// @ts-nocheck — three/tsl の型は JS サンプル前提
import * as THREE from 'three/webgpu';
import {
  Fn,
  If,
  texture,
  uv,
  vec2,
  vec3,
  vec4,
  float,
  abs,
  exp,
  mix,
  normalize,
  cross,
  max,
  min,
  pow,
  clamp,
  dot,
  uniform,
  positionLocal,
  positionView,
  step,
  refract,
  reflect,
  sqrt,
} from 'three/tsl';

export type ScreenSpaceFluid = {
  setParticleMesh: (mesh: THREE.Mesh, positionNode: unknown) => void;
  setParticleCount: (count: number) => void;
  setOpticalRadius: (radius: number) => void;
  resize: (width: number, height: number) => void;
  render: (bgScene: THREE.Scene, camera: THREE.Camera) => void;
  dispose: () => void;
};

/**
 * Screen-Space Fluid Rendering（物理寄り）
 * depth → bilateral blur → thickness → thickness blur → composite
 * composite: Snell 屈折 / Beer-Lambert 吸収 / 単散乱 / Schlick Fresnel / SSR風反射
 */
export function createScreenSpaceFluid(
  renderer: THREE.WebGPURenderer,
): ScreenSpaceFluid {
  const rtOpts = {
    type: THREE.HalfFloatType,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
  };

  const bgRT = new THREE.RenderTarget(1, 1, { ...rtOpts, depthBuffer: true });
  const depthRT = new THREE.RenderTarget(1, 1, { ...rtOpts, depthBuffer: true });
  const thicknessRT = new THREE.RenderTarget(1, 1, {
    ...rtOpts,
    depthBuffer: false,
  });
  const thicknessBlurRT = new THREE.RenderTarget(1, 1, {
    ...rtOpts,
    depthBuffer: false,
  });
  const blurTempRT = new THREE.RenderTarget(1, 1, { ...rtOpts, depthBuffer: false });
  const blurRT = new THREE.RenderTarget(1, 1, { ...rtOpts, depthBuffer: false });

  const fluidScene = new THREE.Scene();
  let particleMesh: THREE.Mesh | null = null;

  const texelSize = uniform(new THREE.Vector2(1, 1));
  const projectionMatrix = uniform(new THREE.Matrix4());
  const invViewMatrix = uniform(new THREE.Matrix4());
  const opticalRadius = uniform(0.02);
  // 水の光学定数（シミュレーション単位）
  // 赤・緑を強く吸収し、深いほど濃い青へ。浅い厚さでは T≈1 で澄んだまま。
  const sigmaA = uniform(new THREE.Vector3(1.05, 0.28, 0.045));
  const sigmaS = uniform(0.34);
  const ior = uniform(1.333);
  const scatterColor = uniform(new THREE.Vector3(0.035, 0.26, 0.62));
  const ambientScatter = uniform(new THREE.Vector3(0.32, 0.52, 0.95));

  const depthMat = new THREE.MeshBasicNodeMaterial({
    depthWrite: true,
    depthTest: true,
  });
  depthMat.colorNode = vec4(positionView.z.negate(), float(0), float(0), float(1));

  // 球コード長 ≈ 2 R √(1 - r_xy²) を光学厚さとして加算
  const thicknessMat = new THREE.MeshBasicNodeMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: THREE.AdditiveBlending,
  });
  thicknessMat.colorNode = Fn(() => {
    const p = positionLocal;
    const r2 = p.x.mul(p.x).add(p.y.mul(p.y));
    const chord = sqrt(max(float(0), float(1).sub(r2))).mul(2);
    const optical = chord.mul(opticalRadius).mul(1.6);
    return vec4(optical, optical, optical, float(1));
  })();

  function makeDepthBlurMaterial(src: THREE.Texture, horizontal: boolean) {
    const mat = new THREE.MeshBasicNodeMaterial({ depthTest: false, depthWrite: false });
    const map = texture(src);
    mat.colorNode = Fn(() => {
      const u = uv();
      const center = map.sample(u).r.toVar('center');
      const outColor = vec4(center, float(0), float(0), float(1)).toVar('outColor');

      If(center.greaterThan(float(0.0005)), () => {
        const result = float(0).toVar('result');
        const wSum = float(0).toVar('wSum');
        const offsets = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
        const weights = [0.05, 0.09, 0.12, 0.15, 0.18, 0.15, 0.12, 0.09, 0.05];

        for (let i = 0; i < offsets.length; i++) {
          const o = offsets[i]!;
          const gw = weights[i]!;
          const offsetUv = horizontal
            ? u.add(vec2(texelSize.x.mul(o), float(0)))
            : u.add(vec2(float(0), texelSize.y.mul(o)));
          const sample = map.sample(offsetUv).r;
          const w = float(gw)
            .mul(exp(abs(sample.sub(center)).mul(-14)))
            .mul(step(float(0.0005), sample));
          result.addAssign(sample.mul(w));
          wSum.addAssign(w);
        }

        outColor.assign(
          vec4(result.div(max(wSum, float(1e-5))), float(0), float(0), float(1)),
        );
      });

      return outColor;
    })();
    return mat;
  }

  function makeThicknessBlurMaterial(src: THREE.Texture, horizontal: boolean) {
    const mat = new THREE.MeshBasicNodeMaterial({ depthTest: false, depthWrite: false });
    const map = texture(src);
    mat.colorNode = Fn(() => {
      const u = uv();
      const result = float(0).toVar('result');
      const wSum = float(0).toVar('wSum');
      const offsets = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
      const weights = [0.05, 0.09, 0.12, 0.15, 0.18, 0.15, 0.12, 0.09, 0.05];

      for (let i = 0; i < offsets.length; i++) {
        const o = offsets[i]!;
        const gw = weights[i]!;
        const offsetUv = horizontal
          ? u.add(vec2(texelSize.x.mul(o), float(0)))
          : u.add(vec2(float(0), texelSize.y.mul(o)));
        const sample = map.sample(offsetUv).r;
        result.addAssign(sample.mul(float(gw)));
        wSum.addAssign(float(gw));
      }

      return vec4(result.div(max(wSum, float(1e-5))), float(0), float(0), float(1));
    })();
    return mat;
  }

  let blurXMat = makeDepthBlurMaterial(depthRT.texture, true);
  let blurYMat = makeDepthBlurMaterial(blurTempRT.texture, false);
  let thickBlurXMat = makeThicknessBlurMaterial(thicknessRT.texture, true);
  let thickBlurYMat = makeThicknessBlurMaterial(blurTempRT.texture, false);

  const bgMap = texture(bgRT.texture);
  const depthMap = texture(blurRT.texture);
  const thicknessMap = texture(thicknessBlurRT.texture);

  const compositeMat = new THREE.MeshBasicNodeMaterial({
    depthTest: false,
    depthWrite: false,
  });

  compositeMat.colorNode = Fn(() => {
    const u = uv();
    const depth = depthMap.sample(u).r.toVar('depth');
    const bg = bgMap.sample(u).rgb.toVar('bg');
    const outColor = vec4(bg, float(1)).toVar('outColor');

    If(depth.greaterThan(float(0.01)), () => {
      const eyeDepth = depth.toVar('eyeDepth');
      const viewZ = depth.negate();
      const px = projectionMatrix.element(0).x;
      const py = projectionMatrix.element(1).y;

      const surfacePos = vec3(
        u.x.mul(2).sub(1).mul(eyeDepth).div(px),
        u.y.mul(2).sub(1).mul(eyeDepth).div(py),
        viewZ,
      ).toVar('surfacePos');

      const samplePos = (coord: ReturnType<typeof uv>, zEye: ReturnType<typeof float>) =>
        vec3(
          coord.x.mul(2).sub(1).mul(zEye).div(px),
          coord.y.mul(2).sub(1).mul(zEye).div(py),
          zEye.negate(),
        );

      const dR = depthMap.sample(u.add(vec2(texelSize.x, float(0)))).r;
      const dL = depthMap.sample(u.add(vec2(texelSize.x.negate(), float(0)))).r;
      const dU = depthMap.sample(u.add(vec2(float(0), texelSize.y))).r;
      const dD = depthMap.sample(u.add(vec2(float(0), texelSize.y.negate()))).r;

      const ddx = samplePos(u.add(vec2(texelSize.x, float(0))), max(dR, float(0.01)))
        .sub(surfacePos)
        .toVar('ddx');
      const ddy = samplePos(u.add(vec2(float(0), texelSize.y)), max(dU, float(0.01)))
        .sub(surfacePos)
        .toVar('ddy');
      const ddx2 = surfacePos.sub(
        samplePos(u.add(vec2(texelSize.x.negate(), float(0))), max(dL, float(0.01))),
      );
      const ddy2 = surfacePos.sub(
        samplePos(u.add(vec2(float(0), texelSize.y.negate())), max(dD, float(0.01))),
      );
      If(abs(ddx.z).greaterThan(abs(ddx2.z)), () => {
        ddx.assign(ddx2);
      });
      If(abs(ddy.z).greaterThan(abs(ddy2.z)), () => {
        ddy.assign(ddy2);
      });

      const normal = normalize(cross(ddx, ddy)).negate().toVar('normal');
      const viewDir = normalize(surfacePos).toVar('viewDir');
      const nDotV = max(dot(normal, viewDir.negate()), float(0)).toVar('nDotV');

      const thickness = max(thicknessMap.sample(u).r, float(0.001)).toVar('thickness');

      // Beer-Lambert: T = exp(-σ_a * d)
      const transmittance = exp(sigmaA.mul(thickness).negate()).toVar('transmittance');

      // 単散乱: L_s ≈ (σ_s/σ_t) * L_amb * (1 - exp(-σ_t d))
      const sigmaT = sigmaA.add(vec3(sigmaS, sigmaS, sigmaS)).toVar('sigmaT');
      const extinction = exp(sigmaT.mul(thickness).negate()).toVar('extinction');
      const albedo = vec3(sigmaS, sigmaS, sigmaS)
        .div(max(sigmaT, vec3(1e-4, 1e-4, 1e-4)))
        .toVar('albedo');
      // 深いほど (1-extinction) が増え、青寄りの単散乱が支配的になる
      const inScatter = scatterColor
        .mul(ambientScatter)
        .mul(albedo)
        .mul(float(1).sub(extinction))
        .mul(1.25)
        .toVar('inScatter');

      // Snell 屈折
      const eta = float(1).div(ior);
      const refrDir = refract(viewDir, normal, eta).toVar('refrDir');
      const refrOk = step(float(0.001), dot(refrDir, refrDir));
      const refrDirSafe = mix(reflect(viewDir, normal), refrDir, refrOk).toVar('refrDirSafe');

      const refrStrength = thickness.mul(0.55).add(0.02);
      const baseOffset = refrDirSafe.xy.mul(refrStrength);
      const blurPx = min(thickness.mul(0.05), float(0.014));

      const sampleBg = (offset: ReturnType<typeof vec2>, aberr: number) => {
        const uvR = clamp(
          u.add(offset).add(vec2(texelSize.x.mul(aberr), float(0))),
          float(0.001),
          float(0.999),
        );
        const uvG = clamp(u.add(offset), float(0.001), float(0.999));
        const uvB = clamp(
          u.add(offset).sub(vec2(texelSize.x.mul(aberr), float(0))),
          float(0.001),
          float(0.999),
        );
        return vec3(bgMap.sample(uvR).r, bgMap.sample(uvG).g, bgMap.sample(uvB).b);
      };

      const bg0 = sampleBg(baseOffset, 1.4);
      const bg1 = sampleBg(baseOffset.add(vec2(blurPx, float(0))), 1.0);
      const bg2 = sampleBg(baseOffset.sub(vec2(blurPx, float(0))), 1.0);
      const bg3 = sampleBg(baseOffset.add(vec2(float(0), blurPx)), 1.0);
      const bg4 = sampleBg(baseOffset.sub(vec2(float(0), blurPx)), 1.0);
      const bgRefracted = bg0
        .mul(0.36)
        .add(bg1.add(bg2).add(bg3).add(bg4).mul(0.16))
        .toVar('bgRefracted');

      const transmitted = bgRefracted.mul(transmittance).add(inScatter).toVar('transmitted');

      // Schlick Fresnel（形状は物理的、合成時の重みだけ抑える）
      const F0 = pow(float(1).sub(ior).div(float(1).add(ior)), float(2));
      const fresnel = clamp(
        F0.add(float(1).sub(F0).mul(pow(float(1).sub(nDotV), float(5)))),
        float(0),
        float(1),
      ).toVar('fresnel');
      const reflAmount = fresnel.mul(0.62).toVar('reflAmount');

      // 反射: 空グラデーション + 背景の SSR 風サンプリング（強度を抑える）
      const reflDir = reflect(viewDir, normal).toVar('reflDir');
      const reflWorld = normalize(invViewMatrix.mul(vec4(reflDir, float(0))).xyz).toVar(
        'reflWorld',
      );
      const sky = mix(
        vec3(0.07, 0.12, 0.24),
        vec3(0.48, 0.62, 0.82),
        clamp(reflWorld.y.mul(0.55).add(0.45), float(0), float(1)),
      );
      const ssrUv = clamp(u.add(reflDir.xy.mul(0.1)), float(0.001), float(0.999));
      const ssr = bgMap.sample(ssrUv).rgb;
      const reflection = mix(sky, ssr, float(0.18)).mul(0.72).toVar('reflection');

      // スペキュラ（ハイライトは残しつつ全体を弱める）
      const lightDir = normalize(vec3(0.35, 0.85, 0.4));
      const halfVec = normalize(lightDir.add(viewDir.negate()));
      const spec = pow(max(dot(normal, halfVec), float(0)), float(220)).mul(0.32);
      const specular = vec3(spec, spec, spec).mul(fresnel);

      const color = mix(transmitted, reflection, reflAmount).add(specular);
      outColor.assign(vec4(color, float(1)));
    });

    return outColor;
  })();

  const quad = new THREE.QuadMesh(compositeMat);

  function setParticleMesh(mesh: THREE.Mesh, positionNode: unknown): void {
    if (particleMesh) fluidScene.remove(particleMesh);
    particleMesh = mesh;
    depthMat.positionNode = positionNode;
    thicknessMat.positionNode = positionNode;
    fluidScene.add(mesh);
  }

  function setParticleCount(count: number): void {
    if (particleMesh) particleMesh.count = count;
  }

  function setOpticalRadius(radius: number): void {
    opticalRadius.value = Math.max(0.004, radius);
  }

  /** width/height は CSS ではなく drawing buffer（canvas.width/height）を渡すこと */
  function resize(width: number, height: number): void {
    const w = Math.max(1, Math.floor(width));
    const h = Math.max(1, Math.floor(height));
    // 深度・厚さパスのみ軽くダウンサンプル（基準は drawing buffer）
    const scale = 0.85;
    const rw = Math.max(1, Math.floor(w * scale));
    const rh = Math.max(1, Math.floor(h * scale));
    bgRT.setSize(w, h);
    depthRT.setSize(rw, rh);
    thicknessRT.setSize(rw, rh);
    thicknessBlurRT.setSize(rw, rh);
    blurTempRT.setSize(rw, rh);
    blurRT.setSize(rw, rh);
    texelSize.value.set(1 / rw, 1 / rh);

    blurXMat.dispose();
    blurYMat.dispose();
    thickBlurXMat.dispose();
    thickBlurYMat.dispose();
    blurXMat = makeDepthBlurMaterial(depthRT.texture, true);
    blurYMat = makeDepthBlurMaterial(blurTempRT.texture, false);
    thickBlurXMat = makeThicknessBlurMaterial(thicknessRT.texture, true);
    thickBlurYMat = makeThicknessBlurMaterial(blurTempRT.texture, false);
  }

  function render(bgScene: THREE.Scene, camera: THREE.Camera): void {
    projectionMatrix.value.copy(camera.projectionMatrix);
    invViewMatrix.value.copy(camera.matrixWorld);

    renderer.setRenderTarget(bgRT);
    renderer.setClearColor(0x0b1020, 1);
    renderer.clear();
    renderer.render(bgScene, camera);

    if (!particleMesh) {
      renderer.setRenderTarget(null);
      renderer.render(bgScene, camera);
      return;
    }

    particleMesh.material = depthMat;
    renderer.setRenderTarget(depthRT);
    renderer.setClearColor(0x000000, 1);
    renderer.clear();
    renderer.render(fluidScene, camera);

    particleMesh.material = thicknessMat;
    renderer.setRenderTarget(thicknessRT);
    renderer.setClearColor(0x000000, 1);
    renderer.clear();
    renderer.render(fluidScene, camera);

    quad.material = blurXMat;
    renderer.setRenderTarget(blurTempRT);
    quad.render(renderer);
    quad.material = blurYMat;
    renderer.setRenderTarget(blurRT);
    quad.render(renderer);

    quad.material = thickBlurXMat;
    renderer.setRenderTarget(blurTempRT);
    quad.render(renderer);
    quad.material = thickBlurYMat;
    renderer.setRenderTarget(thicknessBlurRT);
    quad.render(renderer);

    quad.material = compositeMat;
    renderer.setRenderTarget(null);
    quad.render(renderer);
  }

  function dispose(): void {
    bgRT.dispose();
    depthRT.dispose();
    thicknessRT.dispose();
    thicknessBlurRT.dispose();
    blurTempRT.dispose();
    blurRT.dispose();
    depthMat.dispose();
    thicknessMat.dispose();
    blurXMat.dispose();
    blurYMat.dispose();
    thickBlurXMat.dispose();
    thickBlurYMat.dispose();
    compositeMat.dispose();
  }

  return {
    setParticleMesh,
    setParticleCount,
    setOpticalRadius,
    resize,
    render,
    dispose,
  };
}

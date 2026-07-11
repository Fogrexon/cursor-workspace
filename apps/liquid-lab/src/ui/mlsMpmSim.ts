// @ts-nocheck — three/tsl の型は JS サンプル前提で、strict TS と噛み合わない
import * as THREE from 'three/webgpu';
import {
  Fn,
  If,
  Return,
  instancedArray,
  instanceIndex,
  uniform,
  attribute,
  float,
  clamp,
  struct,
  atomicStore,
  int,
  ivec3,
  array,
  vec3,
  atomicAdd,
  Loop,
  atomicLoad,
  max,
  pow,
  mat3,
  vec4,
  cross,
  abs,
  min,
  normalize,
  dot,
} from 'three/tsl';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import type { PresetId } from '../types';
import { FIXED_POINT_MULTIPLIER } from '../logic/fixedPoint';
import {
  createInitialPositions,
  GRID_SIZE,
  MAX_PARTICLES,
  PARTICLE_STRUCT_FLOATS,
  WORKGROUP_SIZE,
} from '../logic/particles';
import {
  DEFAULT_WAVE_MAKER,
  maxWaveAmplitudeForBox,
  paddleHalfZ,
  paddlePositionX,
  paddleRestX,
  paddleVelocityX,
} from '../logic/waveMaker';
import {
  BEACH_MACRO_PRESET,
  cameraFarPlane,
  cameraFrameDistance,
  cameraMaxDistance,
  clampFillRatio,
  clampSplatScale,
  clampTimeScale,
  DEFAULT_MACRO_SCALE,
  splatRadius,
} from '../logic/macroScale';
import {
  boxCenterWorld,
  clampSimBounds,
  DEFAULT_SIM_BOUNDS,
  domainScale,
  toUnitSimBounds,
  type SimBounds,
} from '../logic/simBounds';
import {
  BEACH_SLOPE_PRESET,
  beachRise,
  beachRunLength,
  beachStartX,
  clampBeachSlope,
  clampFlatFraction,
  DEFAULT_BEACH_SLOPE,
  type BeachSlopeParams,
} from '../logic/beachSlope';
import { createScreenSpaceFluid } from './screenSpaceFluid';

const BASE_SPLAT_RADIUS = 0.02;
const BASE_MAX_SPEED = 1.8;
const BASE_CAMERA_OFFSET = { x: 1.55, y: 0.97, z: 1.42 };

/** StorageBufferNode の実体 BufferAttribute を取り出す */
function storageAttr(node: { value?: THREE.BufferAttribute }): THREE.BufferAttribute {
  return node.value as THREE.BufferAttribute;
}

export type MlsMpmHandle = {
  canvas: HTMLCanvasElement;
  setParticleCount: (count: number) => void;
  setGravity: (g: number) => void;
  setViscosity: (v: number) => void;
  setStiffness: (s: number) => void;
  setBoxWidth: (w: number) => void;
  setSimBounds: (bounds: Partial<SimBounds>) => void;
  getSimBounds: () => SimBounds;
  setTimeScale: (scale: number) => void;
  setFillRatio: (ratio: number) => void;
  setSplatScale: (scale: number) => void;
  setWaveEnabled: (enabled: boolean) => void;
  setWaveFrequency: (hz: number) => void;
  setWaveAmplitude: (amp: number) => void;
  setBeachSlope: (params: Partial<BeachSlopeParams>) => void;
  getBeachSlope: () => BeachSlopeParams;
  applyBeachLook: () => {
    timeScale: number;
    fillRatio: number;
    splatScale: number;
    boxWidth: number;
    boxDepth: number;
    boxHeight: number;
    gravity: number;
    viscosity: number;
    stiffness: number;
    waveEnabled: boolean;
    waveFrequency: number;
    waveAmplitude: number;
    beachEnabled: boolean;
    beachSlope: number;
    beachFlatFraction: number;
  };
  setPaused: (paused: boolean) => void;
  reset: (preset: PresetId) => void;
  resize: () => void;
  dispose: () => void;
};

type CreateOptions = {
  particleCount: number;
  gravity: number;
  viscosity: number;
  stiffness: number;
  boxWidth: number;
  boxDepth?: number;
  boxHeight?: number;
  preset: PresetId;
  waveEnabled?: boolean;
  waveFrequency?: number;
  waveAmplitude?: number;
  timeScale?: number;
  fillRatio?: number;
  splatScale?: number;
};

export async function createMlsMpmSim(
  container: HTMLElement,
  options: CreateOptions,
): Promise<MlsMpmHandle> {
  const renderer = new THREE.WebGPURenderer({
    antialias: true,
    requiredLimits: { maxStorageBuffersInVertexStage: 8 },
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);
  renderer.domElement.className = 'viewport-canvas';

  await renderer.init();

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new RoomEnvironment();
  const envMap = pmrem.fromScene(envScene, 0.04).texture;
  scene.environment = envMap;
  scene.background = new THREE.Color(0x0b1020);
  scene.environmentIntensity = 1.2;

  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 80);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = 0.8;
  controls.maxDistance = 24;
  controls.maxPolarAngle = Math.PI * 0.48;

  const ambient = new THREE.AmbientLight(0xb0c4ff, 0.4);
  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(2.2, 4.5, 1.5);
  const fill = new THREE.DirectionalLight(0x88aaff, 0.5);
  fill.position.set(-2, 1.5, -1);
  scene.add(ambient, key, fill);

  // ワールド範囲を等方スケールで見せるルート（物理は常に単位立方体）
  const simRoot = new THREE.Group();
  scene.add(simRoot);

  // 床（砂浜ルックにも切り替え可能）
  const floorMat = new THREE.MeshStandardNodeMaterial({
    color: '#1a2238',
    roughness: 0.4,
    metalness: 0.12,
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.4), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.501;
  simRoot.add(floor);

  const gridHelper = new THREE.GridHelper(2.4, 24, 0x3a4568, 0x2a3348);
  gridHelper.position.y = -0.499;
  simRoot.add(gridHelper);

  const initialWorld = clampSimBounds({
    width: options.boxWidth,
    depth: options.boxDepth ?? options.boxWidth,
    height: options.boxHeight ?? DEFAULT_SIM_BOUNDS.height,
  });
  let currentBounds: SimBounds = { ...initialWorld };
  let unitBounds = toUnitSimBounds(currentBounds);
  let currentDomainScale = domainScale(currentBounds);
  simRoot.scale.setScalar(currentDomainScale);

  const box = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1)),
    new THREE.LineBasicMaterial({ color: 0x7a8ab8 }),
  );
  // 床基準: Y は下端を -0.5 に合わせ、高さ分だけ伸ばす（単位空間）
  box.position.set(0, -0.5 + unitBounds.height / 2, 0);
  box.scale.set(unitBounds.width, unitBounds.height, unitBounds.depth);
  simRoot.add(box);

  // 波発生パドル（見た目・単位空間）
  const paddleHalfThick = 0.018;
  let waveEnabled = options.waveEnabled ?? DEFAULT_WAVE_MAKER.enabled;
  let waveFrequency = options.waveFrequency ?? DEFAULT_WAVE_MAKER.frequency;
  let waveAmplitude = options.waveAmplitude ?? DEFAULT_WAVE_MAKER.amplitude;
  let timeScale = clampTimeScale(options.timeScale ?? DEFAULT_MACRO_SCALE.timeScale);
  let fillRatio = clampFillRatio(options.fillRatio ?? DEFAULT_MACRO_SCALE.fillRatio);
  let currentSplatScale = clampSplatScale(
    options.splatScale ?? DEFAULT_MACRO_SCALE.splatScale,
  );
  let baseGravity = options.gravity;
  let simTime = 0;
  let currentRestX = paddleRestX(unitBounds.width, paddleHalfThick);
  let currentPaddleHalfZ = paddleHalfZ(unitBounds.depth);

  const paddleMesh = new THREE.Mesh(
    new THREE.BoxGeometry(paddleHalfThick * 2, 1, 1),
    new THREE.MeshStandardNodeMaterial({
      color: '#c4a35a',
      roughness: 0.45,
      metalness: 0.2,
    }),
  );
  paddleMesh.scale.set(1, unitBounds.height * 0.92, currentPaddleHalfZ * 2);
  paddleMesh.position.set(
    currentRestX - 0.5,
    -0.5 + unitBounds.height * 0.46,
    0,
  );
  paddleMesh.visible = waveEnabled;
  simRoot.add(paddleMesh);

  // 砂浜斜面（沖=小X / 浜=大X で上昇）
  let beachEnabled = DEFAULT_BEACH_SLOPE.enabled;
  let beachSlope = DEFAULT_BEACH_SLOPE.slope;
  let beachFlatFraction = DEFAULT_BEACH_SLOPE.flatFraction;
  const beachMat = new THREE.MeshStandardNodeMaterial({
    color: '#d2b48c',
    roughness: 0.95,
    metalness: 0.02,
    side: THREE.DoubleSide,
  });
  const beachGeo = new THREE.PlaneGeometry(1, 1);
  beachGeo.rotateX(-Math.PI / 2); // XZ 平面・法線 +Y
  const beachMesh = new THREE.Mesh(beachGeo, beachMat);
  beachMesh.visible = false;
  simRoot.add(beachMesh);
  const ssFluid = createScreenSpaceFluid(renderer);

  const gridSize = new THREE.Vector3(GRID_SIZE, GRID_SIZE, GRID_SIZE);
  const gridSizeUniform = uniform(gridSize);
  const particleCountUniform = uniform(options.particleCount, 'uint');
  const stiffnessUniform = uniform(options.stiffness);
  const restDensityUniform = uniform(1.2);
  const dynamicViscosityUniform = uniform(options.viscosity);
  const dtUniform = uniform(1 / 120);
  const gravityUniform = uniform(new THREE.Vector3(0, -options.gravity, 0));
  // Vector3 で渡す（float uniform 単体だと compute 側で更新が効かないことがある）
  const boxSizeUniform = uniform(
    new THREE.Vector3(unitBounds.width, unitBounds.height, unitBounds.depth),
  );
  const maxSpeedUniform = uniform(BASE_MAX_SPEED);
  const mouseRayOriginUniform = uniform(new THREE.Vector3());
  const mouseRayDirectionUniform = uniform(new THREE.Vector3());
  const mouseForceUniform = uniform(new THREE.Vector3());
  const waveEnabledUniform = uniform(waveEnabled ? 1 : 0);
  const paddleXUniform = uniform(currentRestX);
  const paddleVelUniform = uniform(0);
  const paddleHalfThickUniform = uniform(paddleHalfThick);
  const paddleHalfZUniform = uniform(currentPaddleHalfZ);
  const beachEnabledUniform = uniform(0);
  const beachSlopeUniform = uniform(beachSlope);
  const beachStartXUniform = uniform(0.5);
  const beachBaseYUniform = uniform(2 / GRID_SIZE);
  const splatRadiusUniform = uniform(splatRadius(BASE_SPLAT_RADIUS, currentSplatScale));

  const particleStruct = struct({
    position: { type: 'vec3' },
    velocity: { type: 'vec3' },
    C: { type: 'mat3' },
  });

  const particleArray = new Float32Array(MAX_PARTICLES * PARTICLE_STRUCT_FLOATS);
  const initPosArray = new Float32Array(MAX_PARTICLES * 3);
  fillParticleArray(
    particleArray,
    options.preset,
    options.particleCount,
    currentBounds,
    fillRatio,
  );
  fillInitPositions(
    initPosArray,
    options.preset,
    options.particleCount,
    currentBounds,
    fillRatio,
  );
  const particleBuffer = instancedArray(particleArray, particleStruct);
  const initPosBuffer = instancedArray(initPosArray, 'vec3');

  const cellCount = GRID_SIZE * GRID_SIZE * GRID_SIZE;
  const cellStruct = struct({
    x: { type: 'int', atomic: true },
    y: { type: 'int', atomic: true },
    z: { type: 'int', atomic: true },
    mass: { type: 'int', atomic: true },
  });
  const cellBuffer = instancedArray(cellCount, cellStruct);
  const cellBufferFloat = instancedArray(cellCount, 'vec4');

  const encodeFixedPoint = (f32: ReturnType<typeof float>) =>
    int(f32.mul(FIXED_POINT_MULTIPLIER));
  const decodeFixedPoint = (i32: ReturnType<typeof int>) =>
    float(i32).div(FIXED_POINT_MULTIPLIER);

  const clearGridKernel = Fn(() => {
    atomicStore(cellBuffer.element(instanceIndex).get('x'), 0);
    atomicStore(cellBuffer.element(instanceIndex).get('y'), 0);
    atomicStore(cellBuffer.element(instanceIndex).get('z'), 0);
    atomicStore(cellBuffer.element(instanceIndex).get('mass'), 0);
  })()
    .compute(cellCount)
    .setName('clearGridKernel');

  const p2g1Kernel = Fn(() => {
    const particlePosition = particleBuffer
      .element(instanceIndex)
      .get('position')
      .toConst('particlePosition');
    const particleVelocity = particleBuffer
      .element(instanceIndex)
      .get('velocity')
      .toConst('particleVelocity');
    const C = particleBuffer.element(instanceIndex).get('C').toConst('C');

    const gridPosition = particlePosition.mul(gridSizeUniform).toVar();
    const cellIndex = ivec3(gridPosition).sub(1).toConst('cellIndex');
    const cellDiff = gridPosition.fract().sub(0.5).toConst('cellDiff');
    const w0 = float(0.5).mul(float(0.5).sub(cellDiff)).mul(float(0.5).sub(cellDiff));
    const w1 = float(0.75).sub(cellDiff.mul(cellDiff));
    const w2 = float(0.5).mul(float(0.5).add(cellDiff)).mul(float(0.5).add(cellDiff));
    const weights = array([w0, w1, w2]).toConst('weights');

    Loop({ start: 0, end: 3, type: 'int', name: 'gx', condition: '<' }, ({ gx }) => {
      Loop({ start: 0, end: 3, type: 'int', name: 'gy', condition: '<' }, ({ gy }) => {
        Loop({ start: 0, end: 3, type: 'int', name: 'gz', condition: '<' }, ({ gz }) => {
          const weight = weights
            .element(gx)
            .x.mul(weights.element(gy).y)
            .mul(weights.element(gz).z);
          const cellX = cellIndex.add(ivec3(gx, gy, gz)).toConst();
          const cellDist = vec3(cellX).add(0.5).sub(gridPosition).toConst('cellDist');
          const Q = C.mul(cellDist);
          const massContrib = weight;
          const velContrib = massContrib.mul(particleVelocity.add(Q)).toConst('velContrib');
          const cellPtr = cellX.x
            .mul(int(GRID_SIZE * GRID_SIZE))
            .add(cellX.y.mul(int(GRID_SIZE)))
            .add(cellX.z)
            .toConst();
          const cell = cellBuffer.element(cellPtr);
          atomicAdd(cell.get('x'), encodeFixedPoint(velContrib.x));
          atomicAdd(cell.get('y'), encodeFixedPoint(velContrib.y));
          atomicAdd(cell.get('z'), encodeFixedPoint(velContrib.z));
          atomicAdd(cell.get('mass'), encodeFixedPoint(massContrib));
        });
      });
    });
  })()
    .compute(options.particleCount, [WORKGROUP_SIZE, 1, 1])
    .setName('p2g1Kernel');

  const p2g2Kernel = Fn(() => {
    const particlePosition = particleBuffer
      .element(instanceIndex)
      .get('position')
      .toConst('particlePosition');
    const gridPosition = particlePosition.mul(gridSizeUniform).toVar();
    const cellIndex = ivec3(gridPosition).sub(1).toConst('cellIndex');
    const cellDiff = gridPosition.fract().sub(0.5).toConst('cellDiff');
    const w0 = float(0.5).mul(float(0.5).sub(cellDiff)).mul(float(0.5).sub(cellDiff));
    const w1 = float(0.75).sub(cellDiff.mul(cellDiff));
    const w2 = float(0.5).mul(float(0.5).add(cellDiff)).mul(float(0.5).add(cellDiff));
    const weights = array([w0, w1, w2]).toConst('weights');

    const density = float(0).toVar('density');
    Loop({ start: 0, end: 3, type: 'int', name: 'gx', condition: '<' }, ({ gx }) => {
      Loop({ start: 0, end: 3, type: 'int', name: 'gy', condition: '<' }, ({ gy }) => {
        Loop({ start: 0, end: 3, type: 'int', name: 'gz', condition: '<' }, ({ gz }) => {
          const weight = weights
            .element(gx)
            .x.mul(weights.element(gy).y)
            .mul(weights.element(gz).z);
          const cellX = cellIndex.add(ivec3(gx, gy, gz)).toConst();
          const cellPtr = cellX.x
            .mul(int(GRID_SIZE * GRID_SIZE))
            .add(cellX.y.mul(int(GRID_SIZE)))
            .add(cellX.z)
            .toConst();
          const mass = decodeFixedPoint(atomicLoad(cellBuffer.element(cellPtr).get('mass')));
          density.addAssign(mass.mul(weight));
        });
      });
    });

    const volume = float(1).div(density);
    const pressure = max(
      0.0,
      pow(density.div(restDensityUniform), 4.0).sub(1).mul(stiffnessUniform),
    ).toConst('pressure');
    const stress = mat3(
      pressure.negate(),
      0,
      0,
      0,
      pressure.negate(),
      0,
      0,
      0,
      pressure.negate(),
    ).toVar('stress');
    const dudv = particleBuffer.element(instanceIndex).get('C').toConst('C');
    const strain = dudv.add(dudv.transpose());
    stress.addAssign(strain.mul(dynamicViscosityUniform));
    const eq16Term0 = volume.mul(-4).mul(stress).mul(dtUniform);

    Loop({ start: 0, end: 3, type: 'int', name: 'gx', condition: '<' }, ({ gx }) => {
      Loop({ start: 0, end: 3, type: 'int', name: 'gy', condition: '<' }, ({ gy }) => {
        Loop({ start: 0, end: 3, type: 'int', name: 'gz', condition: '<' }, ({ gz }) => {
          const weight = weights
            .element(gx)
            .x.mul(weights.element(gy).y)
            .mul(weights.element(gz).z);
          const cellX = cellIndex.add(ivec3(gx, gy, gz)).toConst();
          const cellDist = vec3(cellX).add(0.5).sub(gridPosition).toConst('cellDist');
          const momentum = eq16Term0.mul(weight).mul(cellDist).toConst('momentum');
          const cellPtr = cellX.x
            .mul(int(GRID_SIZE * GRID_SIZE))
            .add(cellX.y.mul(int(GRID_SIZE)))
            .add(cellX.z)
            .toConst();
          const cell = cellBuffer.element(cellPtr);
          atomicAdd(cell.get('x'), encodeFixedPoint(momentum.x));
          atomicAdd(cell.get('y'), encodeFixedPoint(momentum.y));
          atomicAdd(cell.get('z'), encodeFixedPoint(momentum.z));
        });
      });
    });
  })()
    .compute(options.particleCount, [WORKGROUP_SIZE, 1, 1])
    .setName('p2g2Kernel');

  const updateGridKernel = Fn(() => {
    const cell = cellBuffer.element(instanceIndex);
    const mass = decodeFixedPoint(atomicLoad(cell.get('mass'))).toConst();
    If(mass.lessThanEqual(0), () => {
      Return();
    });

    const vx = decodeFixedPoint(atomicLoad(cell.get('x'))).div(mass).toVar();
    const vy = decodeFixedPoint(atomicLoad(cell.get('y'))).div(mass).toVar();
    const vz = decodeFixedPoint(atomicLoad(cell.get('z'))).div(mass).toVar();

    const x = int(instanceIndex).div(int(GRID_SIZE * GRID_SIZE));
    const y = int(instanceIndex).div(int(GRID_SIZE)).mod(int(GRID_SIZE));
    const z = int(instanceIndex).mod(int(GRID_SIZE));
    If(x.lessThan(int(2)).or(x.greaterThan(int(GRID_SIZE).sub(int(3)))), () => {
      vx.assign(0);
    });
    If(y.lessThan(int(2)).or(y.greaterThan(int(GRID_SIZE).sub(int(3)))), () => {
      vy.assign(0);
    });
    If(z.lessThan(int(2)).or(z.greaterThan(int(GRID_SIZE).sub(int(3)))), () => {
      vz.assign(0);
    });

    cellBufferFloat.element(instanceIndex).assign(vec4(vx, vy, vz, mass));
  })()
    .compute(cellCount)
    .setName('updateGridKernel');

  const g2pKernel = Fn(() => {
    const particlePosition = particleBuffer
      .element(instanceIndex)
      .get('position')
      .toVar('particlePosition');
    const gridPosition = particlePosition.mul(gridSizeUniform).toVar();
    const particleVelocity = vec3(0).toVar();

    const cellIndex = ivec3(gridPosition).sub(1).toConst('cellIndex');
    const cellDiff = gridPosition.fract().sub(0.5).toConst('cellDiff');
    const w0 = float(0.5).mul(float(0.5).sub(cellDiff)).mul(float(0.5).sub(cellDiff));
    const w1 = float(0.75).sub(cellDiff.mul(cellDiff));
    const w2 = float(0.5).mul(float(0.5).add(cellDiff)).mul(float(0.5).add(cellDiff));
    const weights = array([w0, w1, w2]).toConst('weights');

    const B = mat3(0).toVar('B');
    Loop({ start: 0, end: 3, type: 'int', name: 'gx', condition: '<' }, ({ gx }) => {
      Loop({ start: 0, end: 3, type: 'int', name: 'gy', condition: '<' }, ({ gy }) => {
        Loop({ start: 0, end: 3, type: 'int', name: 'gz', condition: '<' }, ({ gz }) => {
          const weight = weights
            .element(gx)
            .x.mul(weights.element(gy).y)
            .mul(weights.element(gz).z);
          const cellX = cellIndex.add(ivec3(gx, gy, gz)).toConst();
          const cellDist = vec3(cellX).add(0.5).sub(gridPosition).toConst('cellDist');
          const cellPtr = cellX.x
            .mul(int(GRID_SIZE * GRID_SIZE))
            .add(cellX.y.mul(int(GRID_SIZE)))
            .add(cellX.z)
            .toConst();
          const weightedVelocity = cellBufferFloat
            .element(cellPtr)
            .xyz.mul(weight)
            .toConst('weightedVelocity');
          const term = mat3(
            weightedVelocity.mul(cellDist.x),
            weightedVelocity.mul(cellDist.y),
            weightedVelocity.mul(cellDist.z),
          );
          B.addAssign(term);
          particleVelocity.addAssign(weightedVelocity);
        });
      });
    });

    particleBuffer.element(instanceIndex).get('C').assign(B.mul(4));
    particleVelocity.addAssign(gravityUniform.mul(dtUniform));
    particleVelocity.divAssign(gridSizeUniform);

    // 速度クランプで爆発・跳ねを抑制
    const speed = particleVelocity.length().toVar('speed');
    If(speed.greaterThan(maxSpeedUniform), () => {
      particleVelocity.mulAssign(maxSpeedUniform.div(speed));
    });

    const dist = cross(
      mouseRayDirectionUniform,
      particlePosition.sub(mouseRayOriginUniform),
    ).length();
    const force = dist.mul(3.0).oneMinus().max(0.0).pow(2);
    particleVelocity.addAssign(mouseForceUniform.mul(force));

    particlePosition.addAssign(particleVelocity.mul(dtUniform));

    // 波発生パドルとの衝突（左壁側の薄い板が往復）
    If(waveEnabledUniform.greaterThan(float(0.5)), () => {
      const halfT = paddleHalfThickUniform;
      const halfZ = paddleHalfZUniform;
      const halfY = float(0.46);
      const localX = particlePosition.x.sub(paddleXUniform);
      const localY = particlePosition.y.sub(float(0.5));
      const localZ = particlePosition.z.sub(float(0.5));
      If(
        abs(localX)
          .lessThan(halfT.add(0.012))
          .and(abs(localY).lessThan(halfY))
          .and(abs(localZ).lessThan(halfZ)),
        () => {
          // パドル右側へ押し出し + パドル速度を付与
          const push = halfT.add(0.014).sub(localX);
          If(push.greaterThan(float(0)), () => {
            particlePosition.x.addAssign(push);
            particleVelocity.x.assign(
              max(particleVelocity.x, paddleVelUniform.mul(float(1.15))),
            );
          });
        },
      );
    });

    // 砂浜斜面との衝突（沖側は平坦、浜側は線形に上昇）
    If(beachEnabledUniform.greaterThan(float(0.5)), () => {
      const floorY = beachBaseYUniform
        .add(
          max(particlePosition.x.sub(beachStartXUniform), float(0)).mul(
            beachSlopeUniform,
          ),
        )
        .toVar('beachFloorY');
      If(particlePosition.y.lessThan(floorY), () => {
        particlePosition.y.assign(floorY);
        const n = normalize(
          vec3(beachSlopeUniform.negate(), float(1), float(0)),
        ).toVar('beachN');
        const vn = dot(particleVelocity, n).toVar('beachVn');
        If(vn.lessThan(float(0)), () => {
          particleVelocity.subAssign(n.mul(vn));
        });
      });
    });

    // シミュレーション範囲（幅・高さ・奥行き）に合わせた壁拘束
    const halfW = boxSizeUniform.x.mul(0.5);
    const halfD = boxSizeUniform.z.mul(0.5);
    const minX = float(0.5).sub(halfW).add(float(2).div(gridSizeUniform.x));
    const maxX = float(0.5).add(halfW).sub(float(2).div(gridSizeUniform.x));
    const minZ = float(0.5).sub(halfD).add(float(2).div(gridSizeUniform.z));
    const maxZ = float(0.5).add(halfD).sub(float(2).div(gridSizeUniform.z));
    const minY = float(2).div(gridSizeUniform.y);
    const maxY = min(
      float(1).sub(float(2).div(gridSizeUniform.y)),
      minY.add(boxSizeUniform.y),
    );
    particlePosition.assign(
      vec3(
        clamp(particlePosition.x, minX, maxX),
        clamp(particlePosition.y, minY, maxY),
        clamp(particlePosition.z, minZ, maxZ),
      ),
    );

    // 柔らかい壁反発（強すぎると跳ねる）
    const wallStiffness = float(0.35);
    const xN = particlePosition.add(particleVelocity.mul(dtUniform).mul(1.5)).toConst('xN');
    particleVelocity.addAssign(
      vec3(
        minX.sub(xN.x).max(0.0).mul(wallStiffness).add(maxX.sub(xN.x).min(0.0).mul(wallStiffness)),
        minY.sub(xN.y).max(0.0).mul(wallStiffness).add(maxY.sub(xN.y).min(0.0).mul(wallStiffness)),
        minZ.sub(xN.z).max(0.0).mul(wallStiffness).add(maxZ.sub(xN.z).min(0.0).mul(wallStiffness)),
      ),
    );

    // 軽い減衰
    particleVelocity.mulAssign(float(0.999));
    particleVelocity.mulAssign(gridSizeUniform);

    particleBuffer.element(instanceIndex).get('position').assign(particlePosition);
    particleBuffer.element(instanceIndex).get('velocity').assign(particleVelocity);
  })()
    .compute(options.particleCount, [WORKGROUP_SIZE, 1, 1])
    .setName('g2pKernel');

  // CPU→GPU の needsUpdate だけでは compute 用 storage が更新されないことがあるため、
  // 初期位置バッファから書き戻す compute でリセットする
  const resetKernel = Fn(() => {
    If(instanceIndex.greaterThanEqual(int(particleCountUniform)), () => {
      Return();
    });
    const p = particleBuffer.element(instanceIndex);
    p.get('position').assign(initPosBuffer.element(instanceIndex));
    p.get('velocity').assign(vec3(0));
    p.get('C').assign(mat3(0, 0, 0, 0, 0, 0, 0, 0, 0));
  })()
    .compute(MAX_PARTICLES, [WORKGROUP_SIZE, 1, 1])
    .setName('resetKernel');

  // 連続水面用: splatScale で半径を変え、粒子数固定のまま大規模感を出す
  const geometry = BufferGeometryUtils.mergeVertices(
    new THREE.IcosahedronGeometry(1, 1).deleteAttribute('uv'),
  );
  const material = new THREE.MeshBasicNodeMaterial({ color: 0x4db0ff });
  const positionNode = Fn(() => {
    const particlePosition = particleBuffer.element(instanceIndex).get('position');
    return attribute('position').mul(splatRadiusUniform).add(particlePosition);
  })();
  material.positionNode = positionNode;

  const particleMesh = new THREE.Mesh(geometry, material);
  particleMesh.count = options.particleCount;
  particleMesh.position.set(
    -0.5 * currentDomainScale,
    -0.5 * currentDomainScale,
    -0.5 * currentDomainScale,
  );
  particleMesh.scale.setScalar(currentDomainScale);
  particleMesh.frustumCulled = false;
  ssFluid.setParticleMesh(particleMesh, positionNode);
  // fluidScene に移るため simRoot には載せない。スケールは mesh 自身で同期する。

  let paused = false;
  let currentPreset: PresetId = options.preset;
  let currentCount = options.particleCount;
  const mouseCoord = new THREE.Vector3();
  const prevMouseCoord = new THREE.Vector3();
  const raycaster = new THREE.Raycaster();
  const raycastPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  let stirring = false;

  /** ワールド座標 → 単位立方体シミュレーション座標 */
  function worldToSim(v: THREE.Vector3): THREE.Vector3 {
    const s = currentDomainScale;
    return new THREE.Vector3(v.x / s + 0.5, v.y / s + 0.5, v.z / s + 0.5);
  }

  const onPointerMove = (event: PointerEvent) => {
    const rect = renderer.domElement.getBoundingClientRect();
    const pointer = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, camera);
    mouseRayOriginUniform.value.copy(worldToSim(raycaster.ray.origin));
    mouseRayDirectionUniform.value.copy(raycaster.ray.direction);
    if (stirring) {
      raycaster.ray.intersectPlane(raycastPlane, mouseCoord);
      const sim = worldToSim(mouseCoord);
      mouseCoord.set(sim.x, 0, sim.z);
    }
  };

  renderer.domElement.addEventListener('pointerdown', (e) => {
    if (!e.shiftKey) return;
    stirring = true;
    controls.enabled = false;
    renderer.domElement.setPointerCapture(e.pointerId);
    onPointerMove(e);
    prevMouseCoord.copy(mouseCoord);
  });
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  const endStir = (e: PointerEvent) => {
    if (!stirring) return;
    stirring = false;
    controls.enabled = true;
    mouseForceUniform.value.set(0, 0, 0);
    try {
      renderer.domElement.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };
  renderer.domElement.addEventListener('pointerup', endStir);
  renderer.domElement.addEventListener('pointercancel', endStir);

  function resize(): void {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;
    // CSS は .viewport-canvas の width/height:100% に任せ、
    // 描画バッファだけ DPR 倍にする（updateStyle=false）。
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // SSFR の RT は CSS サイズではなく drawing buffer に合わせる
    ssFluid.resize(renderer.domElement.width, renderer.domElement.height);
  }

  function uploadInitBuffer(): void {
    const attr = storageAttr(initPosBuffer);
    attr.array.set(initPosArray);
    attr.needsUpdate = true;
  }

  function syncPaddleGeometry(): void {
    currentRestX = paddleRestX(unitBounds.width, paddleHalfThick);
    currentPaddleHalfZ = paddleHalfZ(unitBounds.depth);
    paddleHalfZUniform.value = currentPaddleHalfZ;
    paddleMesh.scale.set(1, unitBounds.height * 0.92, currentPaddleHalfZ * 2);
    paddleMesh.position.set(
      currentRestX - 0.5,
      -0.5 + unitBounds.height * 0.46,
      0,
    );
  }

  function syncBeachGeometry(): void {
    const minX = 0.5 - unitBounds.width / 2;
    const start = beachStartX(minX, unitBounds.width, beachFlatFraction);
    const run = beachRunLength(unitBounds.width, beachFlatFraction);
    const rise = beachRise(unitBounds.width, beachSlope, beachFlatFraction);
    const baseY = 2 / GRID_SIZE;
    const angle = Math.atan(beachSlope);

    beachEnabledUniform.value = beachEnabled ? 1 : 0;
    beachSlopeUniform.value = beachSlope;
    beachStartXUniform.value = start;
    beachBaseYUniform.value = baseY;

    beachMesh.visible = beachEnabled && run > 1e-4;
    if (!beachMesh.visible) return;

    beachMesh.position.set(
      start + run / 2 - 0.5,
      baseY + rise / 2 - 0.5,
      0,
    );
    beachMesh.rotation.z = angle;
    // 幾何は XZ。傾き後の斜辺長 = run / cos(angle)、奥行き = depth
    beachMesh.scale.set(run / Math.cos(angle), 1, unitBounds.depth);
  }

  function applyBeachParams(params: Partial<BeachSlopeParams>): void {
    if (params.enabled !== undefined) beachEnabled = params.enabled;
    if (params.slope !== undefined) beachSlope = clampBeachSlope(params.slope);
    if (params.flatFraction !== undefined) {
      beachFlatFraction = clampFlatFraction(params.flatFraction);
    }
    syncBeachGeometry();
    if (beachEnabled) setFloorBeach(true);
  }

  function applySimBounds(bounds: SimBounds, resetParticles: boolean): void {
    currentBounds = clampSimBounds(bounds);
    unitBounds = toUnitSimBounds(currentBounds);
    currentDomainScale = domainScale(currentBounds);
    simRoot.scale.setScalar(currentDomainScale);
    particleMesh.scale.setScalar(currentDomainScale);
    particleMesh.position.set(
      -0.5 * currentDomainScale,
      -0.5 * currentDomainScale,
      -0.5 * currentDomainScale,
    );
    boxSizeUniform.value.set(
      unitBounds.width,
      unitBounds.height,
      unitBounds.depth,
    );
    box.scale.set(unitBounds.width, unitBounds.height, unitBounds.depth);
    box.position.set(0, -0.5 + unitBounds.height / 2, 0);
    syncPaddleGeometry();
    syncBeachGeometry();
    applyCameraForBounds(false);
    if (resetParticles) reset(currentPreset);
  }

  function applyVisualDerived(): void {
    gravityUniform.value.set(0, -baseGravity, 0);
    maxSpeedUniform.value = BASE_MAX_SPEED;
    const radius = splatRadius(BASE_SPLAT_RADIUS, currentSplatScale);
    splatRadiusUniform.value = radius;
    ssFluid.setOpticalRadius(radius);
  }

  function setFloorBeach(enabled: boolean): void {
    if (enabled) {
      floorMat.color.set('#c2a574');
      floorMat.roughness = 0.92;
      floorMat.metalness = 0.02;
      gridHelper.visible = false;
    } else {
      floorMat.color.set('#1a2238');
      floorMat.roughness = 0.4;
      floorMat.metalness = 0.12;
      gridHelper.visible = true;
    }
  }

  function reset(preset: PresetId): void {
    currentPreset = preset;
    simTime = 0;
    fillParticleArray(particleArray, preset, currentCount, currentBounds, fillRatio);
    fillInitPositions(initPosArray, preset, currentCount, currentBounds, fillRatio);
    uploadInitBuffer();
    renderer.compute(resetKernel);
  }

  function applyCameraForBounds(resetPose = false): void {
    const center = boxCenterWorld(currentBounds);
    const maxDist = cameraMaxDistance(currentBounds);
    const frameDist = cameraFrameDistance(currentBounds, camera.fov);
    const prevTarget = controls.target.clone();

    controls.minDistance = Math.max(0.5, maxDist * 0.02);
    controls.maxDistance = maxDist;
    camera.near = Math.max(0.01, maxDist * 0.0002);
    camera.far = cameraFarPlane(currentBounds);
    camera.updateProjectionMatrix();
    controls.target.set(center.x, center.y, center.z);

    const dir = new THREE.Vector3();
    if (resetPose) {
      dir.set(BASE_CAMERA_OFFSET.x, BASE_CAMERA_OFFSET.y, BASE_CAMERA_OFFSET.z);
    } else {
      dir.copy(camera.position).sub(prevTarget);
      if (dir.lengthSq() < 1e-6) {
        dir.set(BASE_CAMERA_OFFSET.x, BASE_CAMERA_OFFSET.y, BASE_CAMERA_OFFSET.z);
      }
    }
    dir.normalize();
    camera.position.copy(controls.target).addScaledVector(dir, frameDist);
    controls.update();
  }

  let disposed = false;
  const FIXED_DT = 1 / 120;

  async function frame(): Promise<void> {
    if (disposed) return;
    requestAnimationFrame(() => {
      void frame();
    });

    controls.update();

    if (!paused) {
      const stepDt = FIXED_DT * clampTimeScale(timeScale);
      dtUniform.value = stepDt;
      simTime += stepDt * 2;

      if (waveEnabled) {
        const ampCap = maxWaveAmplitudeForBox(unitBounds.width, paddleHalfThick);
        const amp = Math.min(ampCap, waveAmplitude);
        const x = paddlePositionX(simTime, currentRestX, amp, waveFrequency);
        const v = paddleVelocityX(simTime, amp, waveFrequency);
        paddleXUniform.value = x;
        paddleVelUniform.value = v;
        paddleMesh.position.x = x - 0.5;
        paddleMesh.position.y = -0.5 + unitBounds.height * 0.46;
        paddleMesh.visible = true;
      } else {
        paddleXUniform.value = currentRestX;
        paddleVelUniform.value = 0;
        paddleMesh.position.x = currentRestX - 0.5;
        paddleMesh.position.y = -0.5 + unitBounds.height * 0.46;
        paddleMesh.visible = false;
      }

      if (stirring) {
        mouseForceUniform.value.copy(mouseCoord).sub(prevMouseCoord).multiplyScalar(1.6);
        const len = mouseForceUniform.value.length();
        if (len > 0.22) mouseForceUniform.value.multiplyScalar(0.22 / len);
        prevMouseCoord.copy(mouseCoord);
      } else {
        mouseForceUniform.value.set(0, 0, 0);
      }

      for (let s = 0; s < 2; s++) {
        renderer.compute(clearGridKernel);
        renderer.compute(p2g1Kernel);
        renderer.compute(p2g2Kernel);
        renderer.compute(updateGridKernel);
        renderer.compute(g2pKernel);
      }
    }

    ssFluid.render(scene, camera);
  }

  applyVisualDerived();
  applyCameraForBounds(true);
  syncBeachGeometry();
  resize();
  void frame();

  return {
    canvas: renderer.domElement,
    setParticleCount: (count: number) => {
      currentCount = count;
      particleCountUniform.value = count;
      particleMesh.count = count;
      ssFluid.setParticleCount(count);
      p2g1Kernel.count = count;
      p2g2Kernel.count = count;
      g2pKernel.count = count;
      reset(currentPreset);
    },
    setGravity: (g: number) => {
      baseGravity = g;
      applyVisualDerived();
    },
    setViscosity: (v: number) => {
      dynamicViscosityUniform.value = v;
    },
    setStiffness: (s: number) => {
      stiffnessUniform.value = s;
    },
    setBoxWidth: (w: number) => {
      applySimBounds({ ...currentBounds, width: w, depth: w }, true);
    },
    setSimBounds: (partial: Partial<SimBounds>) => {
      applySimBounds({ ...currentBounds, ...partial }, true);
    },
    getSimBounds: () => ({ ...currentBounds }),
    setTimeScale: (scale: number) => {
      timeScale = clampTimeScale(scale);
    },
    setFillRatio: (ratio: number) => {
      fillRatio = clampFillRatio(ratio);
      reset(currentPreset);
    },
    setSplatScale: (scale: number) => {
      currentSplatScale = clampSplatScale(scale);
      const radius = splatRadius(BASE_SPLAT_RADIUS, currentSplatScale);
      splatRadiusUniform.value = radius;
      ssFluid.setOpticalRadius(radius);
    },
    setWaveEnabled: (enabled: boolean) => {
      waveEnabled = enabled;
      waveEnabledUniform.value = enabled ? 1 : 0;
      paddleMesh.visible = enabled;
    },
    setWaveFrequency: (hz: number) => {
      waveFrequency = hz;
    },
    setWaveAmplitude: (amp: number) => {
      waveAmplitude = amp;
    },
    setBeachSlope: (params: Partial<BeachSlopeParams>) => {
      applyBeachParams(params);
    },
    getBeachSlope: () => ({
      enabled: beachEnabled,
      slope: beachSlope,
      flatFraction: beachFlatFraction,
    }),
    applyBeachLook: () => {
      const p = BEACH_MACRO_PRESET;
      const b = BEACH_SLOPE_PRESET;
      timeScale = p.timeScale;
      fillRatio = p.fillRatio;
      currentSplatScale = p.splatScale;
      baseGravity = p.gravity;
      dynamicViscosityUniform.value = p.viscosity;
      stiffnessUniform.value = p.stiffness;
      waveEnabled = p.waveEnabled;
      waveEnabledUniform.value = p.waveEnabled ? 1 : 0;
      waveFrequency = p.waveFrequency;
      waveAmplitude = p.waveAmplitude;
      beachEnabled = b.enabled;
      beachSlope = b.slope;
      beachFlatFraction = b.flatFraction;
      setFloorBeach(true);
      applyVisualDerived();
      applySimBounds(
        { width: p.boxWidth, depth: p.boxDepth, height: p.boxHeight },
        true,
      );
      applyCameraForBounds(true);
      return {
        ...p,
        beachEnabled: b.enabled,
        beachSlope: b.slope,
        beachFlatFraction: b.flatFraction,
      };
    },
    setPaused: (value: boolean) => {
      paused = value;
    },
    reset,
    resize,
    dispose: () => {
      disposed = true;
      controls.dispose();
      ssFluid.dispose();
      geometry.dispose();
      material.dispose();
      floor.geometry.dispose();
      floorMat.dispose();
      beachMesh.geometry.dispose();
      beachMat.dispose();
      box.geometry.dispose();
      (box.material as THREE.Material).dispose();
      paddleMesh.geometry.dispose();
      (paddleMesh.material as THREE.Material).dispose();
      envMap.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

function fillParticleArray(
  particleArray: Float32Array,
  preset: PresetId,
  count: number,
  bounds: SimBounds,
  fillRatio: number,
): void {
  particleArray.fill(0);
  const positions = createInitialPositions(preset, count, bounds, fillRatio);
  for (let i = 0; i < count; i++) {
    const dst = i * PARTICLE_STRUCT_FLOATS;
    const src = i * 3;
    particleArray[dst] = positions[src]!;
    particleArray[dst + 1] = positions[src + 1]!;
    particleArray[dst + 2] = positions[src + 2]!;
  }
}

function fillInitPositions(
  initPosArray: Float32Array,
  preset: PresetId,
  count: number,
  bounds: SimBounds,
  fillRatio: number,
): void {
  initPosArray.fill(0);
  const positions = createInitialPositions(preset, count, bounds, fillRatio);
  initPosArray.set(positions.subarray(0, count * 3));
}

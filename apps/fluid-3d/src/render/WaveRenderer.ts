function compile(
  gl: WebGL2RenderingContext,
  type: number,
  src: string,
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('createShader failed');
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) ?? 'unknown';
    gl.deleteShader(shader);
    throw new Error(log);
  }
  return shader;
}

function link(
  gl: WebGL2RenderingContext,
  vertSrc: string,
  fragSrc: string,
): WebGLProgram {
  const vs = compile(gl, gl.VERTEX_SHADER, vertSrc);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragSrc);
  const prog = gl.createProgram();
  if (!prog) throw new Error('createProgram failed');
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(prog) ?? 'unknown';
    gl.deleteProgram(prog);
    throw new Error(log);
  }
  return prog;
}

const LINE_VERT = `#version 300 es
precision highp float;
layout(location=0) in vec3 aPos;
uniform mat4 uViewProj;
void main() {
  gl_Position = uViewProj * vec4(aPos, 1.0);
}
`;

const LINE_FRAG = `#version 300 es
precision highp float;
out vec4 outColor;
uniform vec3 uColor;
void main() {
  outColor = vec4(uColor, 1.0);
}
`;

const FLOOR_VERT = `#version 300 es
precision highp float;
layout(location=0) in vec3 aPos;
uniform mat4 uViewProj;
out float vZ;
void main() {
  vZ = aPos.z;
  gl_Position = uViewProj * vec4(aPos, 1.0);
}
`;

const FLOOR_FRAG = `#version 300 es
precision highp float;
in float vZ;
out vec4 outColor;
void main() {
  // Darker toward the bottom of the slope (pool side)
  float t = clamp((-vZ + 0.45) / 0.9, 0.0, 1.0);
  vec3 top = vec3(0.28, 0.30, 0.38);
  vec3 bottom = vec3(0.14, 0.16, 0.22);
  outColor = vec4(mix(top, bottom, t), 1.0);
}
`;

const PARTICLE_VERT = `#version 300 es
precision highp float;
layout(location=0) in vec3 aPos;
uniform mat4 uViewProj;
uniform float uPointSize;
void main() {
  vec4 clip = uViewProj * vec4(aPos, 1.0);
  gl_Position = clip;
  gl_PointSize = uPointSize / max(clip.w, 0.12);
}
`;

const PARTICLE_FRAG = `#version 300 es
precision highp float;
out vec4 outColor;
void main() {
  vec2 p = gl_PointCoord * 2.0 - 1.0;
  float r2 = dot(p, p);
  if (r2 > 1.0) discard;
  float a = smoothstep(1.0, 0.2, r2);
  float shade = 0.55 + 0.45 * (1.0 - r2);
  outColor = vec4(vec3(0.25, 0.55, 0.95) * shade, a * 0.88);
}
`;

// Must match assembly FLOOR_A / FLOOR_B
const FLOOR_A = -0.08;
const FLOOR_B = 0.42;
const X0 = -0.45;
const X1 = 0.45;
const Z0 = -0.45;
const Z1 = 0.45;
const YTOP = 0.5;

function floorY(z: number): number {
  return FLOOR_A + FLOOR_B * z;
}

function buildFloorMesh(): Float32Array {
  // Two triangles covering the slope
  const y0 = floorY(Z0);
  const y1 = floorY(Z1);
  return new Float32Array([
    X0, y0, Z0, X1, y0, Z0, X1, y1, Z1,
    X0, y0, Z0, X1, y1, Z1, X0, y1, Z1,
  ]);
}

function buildBoxLines(): Float32Array {
  const y00 = floorY(Z0);
  const y01 = floorY(Z1);
  const y10 = floorY(Z0);
  const y11 = floorY(Z1);
  // Wire box following slope on bottom edges
  return new Float32Array([
    // bottom rectangle on slope
    X0, y00, Z0, X1, y10, Z0,
    X1, y10, Z0, X1, y11, Z1,
    X1, y11, Z1, X0, y01, Z1,
    X0, y01, Z1, X0, y00, Z0,
    // top rectangle
    X0, YTOP, Z0, X1, YTOP, Z0,
    X1, YTOP, Z0, X1, YTOP, Z1,
    X1, YTOP, Z1, X0, YTOP, Z1,
    X0, YTOP, Z1, X0, YTOP, Z0,
    // verticals
    X0, y00, Z0, X0, YTOP, Z0,
    X1, y10, Z0, X1, YTOP, Z0,
    X1, y11, Z1, X1, YTOP, Z1,
    X0, y01, Z1, X0, YTOP, Z1,
  ]);
}

export class WaveRenderer {
  private readonly gl: WebGL2RenderingContext;
  private readonly lineProg: WebGLProgram;
  private readonly floorProg: WebGLProgram;
  private readonly particleProg: WebGLProgram;
  private readonly boxVao: WebGLVertexArrayObject;
  private readonly floorVao: WebGLVertexArrayObject;
  private readonly particleVao: WebGLVertexArrayObject;
  private readonly particleBuf: WebGLBuffer;
  private readonly boxCount: number;
  private readonly floorCount: number;
  private readonly uLineVP: WebGLUniformLocation;
  private readonly uLineColor: WebGLUniformLocation;
  private readonly uFloorVP: WebGLUniformLocation;
  private readonly uPartVP: WebGLUniformLocation;
  private readonly uPartSize: WebGLUniformLocation;

  constructor(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl2', {
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    if (!gl) throw new Error('WebGL2 is required');
    this.gl = gl;

    this.lineProg = link(gl, LINE_VERT, LINE_FRAG);
    this.floorProg = link(gl, FLOOR_VERT, FLOOR_FRAG);
    this.particleProg = link(gl, PARTICLE_VERT, PARTICLE_FRAG);
    this.uLineVP = gl.getUniformLocation(this.lineProg, 'uViewProj')!;
    this.uLineColor = gl.getUniformLocation(this.lineProg, 'uColor')!;
    this.uFloorVP = gl.getUniformLocation(this.floorProg, 'uViewProj')!;
    this.uPartVP = gl.getUniformLocation(this.particleProg, 'uViewProj')!;
    this.uPartSize = gl.getUniformLocation(this.particleProg, 'uPointSize')!;

    const box = buildBoxLines();
    this.boxCount = box.length / 3;
    this.boxVao = gl.createVertexArray()!;
    const boxBuf = gl.createBuffer()!;
    gl.bindVertexArray(this.boxVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, boxBuf);
    gl.bufferData(gl.ARRAY_BUFFER, box, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

    const floor = buildFloorMesh();
    this.floorCount = floor.length / 3;
    this.floorVao = gl.createVertexArray()!;
    const floorBuf = gl.createBuffer()!;
    gl.bindVertexArray(this.floorVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, floorBuf);
    gl.bufferData(gl.ARRAY_BUFFER, floor, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

    this.particleVao = gl.createVertexArray()!;
    this.particleBuf = gl.createBuffer()!;
    gl.bindVertexArray(this.particleVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.particleBuf);
    gl.bufferData(gl.ARRAY_BUFFER, 8000 * 3 * 4, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  setBeachMesh(_meshN: number, _terrain: Float32Array): void {}

  resize(width: number, height: number, dpr: number): void {
    const gl = this.gl;
    const w = Math.max(1, Math.floor(width * dpr));
    const h = Math.max(1, Math.floor(height * dpr));
    if (gl.canvas.width !== w || gl.canvas.height !== h) {
      gl.canvas.width = w;
      gl.canvas.height = h;
    }
    gl.viewport(0, 0, w, h);
  }

  draw(
    water: Float32Array,
    waterCount: number,
    _foam: Float32Array,
    _foamLife: Float32Array,
    _foamSize: Float32Array,
    _foamCount: number,
    viewProj: Float32Array,
    _eye: { x: number; y: number; z: number },
  ): void {
    const gl = this.gl;
    gl.clearColor(0.07, 0.07, 0.1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.disable(gl.BLEND);
    gl.useProgram(this.floorProg);
    gl.uniformMatrix4fv(this.uFloorVP, false, viewProj);
    gl.bindVertexArray(this.floorVao);
    gl.drawArrays(gl.TRIANGLES, 0, this.floorCount);

    gl.useProgram(this.lineProg);
    gl.uniformMatrix4fv(this.uLineVP, false, viewProj);
    gl.uniform3f(this.uLineColor, 0.5, 0.55, 0.7);
    gl.bindVertexArray(this.boxVao);
    gl.drawArrays(gl.LINES, 0, this.boxCount);

    gl.enable(gl.BLEND);
    gl.depthMask(false);
    gl.useProgram(this.particleProg);
    gl.uniformMatrix4fv(this.uPartVP, false, viewProj);
    gl.uniform1f(this.uPartSize, 36);
    gl.bindVertexArray(this.particleVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.particleBuf);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, water.subarray(0, waterCount * 3));
    gl.drawArrays(gl.POINTS, 0, waterCount);
    gl.depthMask(true);
    gl.bindVertexArray(null);
  }
}

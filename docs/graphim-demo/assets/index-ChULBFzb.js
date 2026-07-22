(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(e){if(typeof e==`number`)return{kind:`1f`,value:e};if(e instanceof Float32Array){if(e.length===16)return{kind:`matrix4`,value:e};if(e.length===1)return{kind:`1f`,value:e[0]};if(e.length===2)return{kind:`2f`,value:[e[0],e[1]]};if(e.length===3)return{kind:`3f`,value:[e[0],e[1],e[2]]};if(e.length===4)return{kind:`4f`,value:[e[0],e[1],e[2],e[3]]};throw Error(`unsupported Float32Array length ${e.length}`)}if(e instanceof Int32Array){if(e.length!==1)throw Error(`unsupported Int32Array length ${e.length}`);return{kind:`1i`,value:e[0]}}let t=e;if(t.length===1)return{kind:`1f`,value:t[0]};if(t.length===2)return{kind:`2f`,value:[t[0],t[1]]};if(t.length===3)return{kind:`3f`,value:[t[0],t[1],t[2]]};if(t.length===4)return{kind:`4f`,value:[t[0],t[1],t[2],t[3]]};throw Error(`unsupported uniform array length ${t.length}`)}function t(e,t,n){switch(n.kind){case`1f`:e.uniform1f(t,n.value);break;case`2f`:e.uniform2f(t,n.value[0],n.value[1]);break;case`3f`:e.uniform3f(t,n.value[0],n.value[1],n.value[2]);break;case`4f`:e.uniform4f(t,n.value[0],n.value[1],n.value[2],n.value[3]);break;case`1i`:e.uniform1i(t,n.value);break;case`matrix4`:e.uniformMatrix4fv(t,!1,n.value);break;default:return n}}var n=`#version 300 es
layout(location = 0) in vec2 aPosition;
layout(location = 1) in vec2 aUv;
uniform float uFlipY;
out vec2 vUv;
void main() {
  vUv = aUv;
  gl_Position = vec4(aPosition.x, aPosition.y * uFlipY, 0.0, 1.0);
}
`,r=`#version 300 es
precision mediump float;
in vec2 vUv;
uniform sampler2D uMain;
uniform sampler2D uSecond;
uniform sampler2D uThird;
uniform sampler2D uFourth;
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform int isHover;
uniform float uFlipY;
out vec4 fragColor;
`;function i(e,t,n){let r=e.createShader(t);if(!r)throw Error(`createShader failed`);if(e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS)){let t=e.getShaderInfoLog(r)??`unknown`;throw e.deleteShader(r),Error(`shader compile failed: ${t}\n${n}`)}return r}var a=class{gl;cache=new Map;constructor(e){this.gl=e}get(e){let t=this.cache.get(e);if(t)return t;let a=this.gl,o=i(a,a.VERTEX_SHADER,n),s=i(a,a.FRAGMENT_SHADER,`${r}\n${e}`),c=a.createProgram();if(!c)throw Error(`createProgram failed`);if(a.attachShader(c,o),a.attachShader(c,s),a.linkProgram(c),a.deleteShader(o),a.deleteShader(s),!a.getProgramParameter(c,a.LINK_STATUS)){let e=a.getProgramInfoLog(c)??`unknown`;throw a.deleteProgram(c),Error(`program link failed: ${e}`)}let l={program:c,locations:{aPosition:a.getAttribLocation(c,`aPosition`),aUv:a.getAttribLocation(c,`aUv`),uFlipY:a.getUniformLocation(c,`uFlipY`),uMain:a.getUniformLocation(c,`uMain`),uSecond:a.getUniformLocation(c,`uSecond`),uThird:a.getUniformLocation(c,`uThird`),uFourth:a.getUniformLocation(c,`uFourth`),time:a.getUniformLocation(c,`time`),resolution:a.getUniformLocation(c,`resolution`),mouse:a.getUniformLocation(c,`mouse`),isHover:a.getUniformLocation(c,`isHover`)},custom:new Map};return this.cache.set(e,l),l}customLocation(e,t){if(e.custom.has(t))return e.custom.get(t);let n=this.gl.getUniformLocation(e.program,t);return e.custom.set(t,n),n}dispose(){for(let{program:e}of this.cache.values())this.gl.deleteProgram(e);this.cache.clear()}};function o(e,t,n){let r=e.createTexture(),i=e.createFramebuffer();if(!r||!i)throw Error(`failed to create render target`);e.bindTexture(e.TEXTURE_2D,r),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,t,n,0,e.RGBA,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindFramebuffer(e.FRAMEBUFFER,i),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,r,0);let a=e.checkFramebufferStatus(e.FRAMEBUFFER);if(a!==e.FRAMEBUFFER_COMPLETE)throw Error(`framebuffer incomplete: ${a}`);return e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindTexture(e.TEXTURE_2D,null),{framebuffer:i,texture:r,width:t,height:n}}function s(e,t){e.deleteFramebuffer(t.framebuffer),e.deleteTexture(t.texture)}var c=class{gl;width;height;free=[];all=new Set;constructor(e,t,n){this.gl=e,this.width=t,this.height=n}resize(e,t){e===this.width&&t===this.height||(this.clear(),this.width=e,this.height=t)}acquire(){let e=this.free.pop();if(e)return e;let t=o(this.gl,this.width,this.height);return this.all.add(t),t}release(e){this.all.has(e)&&this.free.push(e)}clear(){for(let e of this.all)s(this.gl,e);this.all.clear(),this.free.length=0}get checkedOut(){return this.all.size-this.free.length}};function l(e){let t=e.createVertexArray();if(!t)throw Error(`createVertexArray failed`);e.bindVertexArray(t);let n=new Float32Array([-1,-1,0,0,1,-1,1,0,-1,1,0,1,-1,1,0,1,1,-1,1,0,1,1,1,1]),r=e.createBuffer();if(!r)throw Error(`createBuffer failed`);return e.bindBuffer(e.ARRAY_BUFFER,r),e.bufferData(e.ARRAY_BUFFER,n,e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,16,0),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,2,e.FLOAT,!1,16,8),e.bindVertexArray(null),e.bindBuffer(e.ARRAY_BUFFER,null),{vao:t,dispose:()=>{e.deleteBuffer(r),e.deleteVertexArray(t)}}}function u(e,t){let n=e.createTexture();if(!n)throw Error(`createTexture failed`);return e.bindTexture(e.TEXTURE_2D,n),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,0),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindTexture(e.TEXTURE_2D,null),n}function d(e,t){let n=e,r=n.naturalWidth||e.clientWidth||1,i=n.naturalHeight||e.clientHeight||1;t.width=r,t.height=i,t.style.removeProperty(`width`),t.style.removeProperty(`height`)}function f(e){switch(e.kind){case`source`:return[];case`pass`:case`delay`:return[e.input];case`blend`:return[...e.inputs];default:return e}}var p=class extends Error{constructor(e){super(e),this.name=`GraphValidationError`}};function m(e){let{nodes:t,output:n}=e;if(!(n in t))throw new p(`output node "${n}" is missing from graph.nodes`);for(let[e,n]of Object.entries(t)){if(n.id!==e)throw new p(`node key "${e}" does not match node.id "${n.id}"`);if(n.kind===`blend`){let t=n.inputs.length;if(t<2||t>4)throw new p(`blend "${e}" must have 2–4 inputs, got ${t}`)}for(let r of f(n))if(!(r in t))throw new p(`node "${e}" references missing input "${r}"`)}let r=new Set,i=new Set,a=e=>{if(!i.has(e)){if(r.has(e))throw new p(`cycle detected at node "${e}"`);r.add(e);for(let n of f(t[e]))a(n);r.delete(e),i.add(e)}};a(n)}function h(e){m(e);let{nodes:t,output:n}=e,r=[],i=new Set,a=e=>{if(!i.has(e)){i.add(e);for(let n of f(t[e]))a(n);r.push(e)}};return a(n),r}var g=0;function _(e){return g+=1,`${e}_${g}`}function v(e,t){return{...e,...t}}function y(e=`main`){let t=_(`source`),n={id:t,label:e===`main`?`Main image`:`External image`,kind:`source`,input:e};return{output:t,nodes:{[t]:n}}}function b(e,t,n={}){let r=_(`pass`),i={id:r,label:`Custom pass`,kind:`pass`,shader:e,uniforms:{...n},input:t.output};return{output:r,nodes:v(t.nodes,{[r]:i})}}function x(e,t){if(e.length<2||e.length>4)throw Error(`merge() expects 2–4 inputs, got ${e.length}`);let n=_(`blend`),r={};for(let t of e)r=v(r,t.nodes);let i={id:n,label:`Merge`,kind:`blend`,shader:t.shader,uniforms:{...t.uniforms},inputs:e.map(e=>e.output)};return{output:n,nodes:v(r,{[n]:i})}}function S(e,t,n={}){return w(x([e,t],{shader:n.shader??ee,uniforms:{blend:.5,...n.uniforms}}),`Blend`)}function C(e){let t=_(`delay`),n={id:t,label:`Delay`,kind:`delay`,input:e.output};return{output:t,nodes:v(e.nodes,{[t]:n})}}function w(e,t){let n=e.nodes[e.output];if(!n)throw Error(`named() output "${e.output}" is missing`);return{output:e.output,nodes:{...e.nodes,[e.output]:{...n,label:t}}}}var ee=`uniform float blend;
void main() {
  vec4 col1 = texture(uMain, vUv);
  vec4 col2 = texture(uSecond, vUv);
  fragColor = mix(col1, col2, blend);
}`,te=`void main() {\r
  vec4 col = texture(uMain, vUv);\r
  float gray = col.r * 0.3 + col.g * 0.59 + col.b * 0.11;\r
  fragColor = vec4(gray, gray, gray, col.a);\r
}\r
`,ne=`void main() {\r
  vec4 col = texture(uMain, vUv);\r
  fragColor = vec4(\r
    col.r * 0.393 + col.g * 0.769 + col.b * 0.189,\r
    col.r * 0.349 + col.g * 0.686 + col.b * 0.168,\r
    col.r * 0.272 + col.g * 0.534 + col.b * 0.131,\r
    col.a);\r
}\r
`,re=`void main() {\r
  vec4 col = texture(uMain, vUv);\r
  fragColor = vec4(vec3(1.0) - col.rgb, col.a);\r
}\r
`,ie=`uniform float strength;\r
\r
vec4 getTex(vec2 uv) {\r
  return texture(uMain, uv / resolution);\r
}\r
\r
float gauss(vec2 pos) {\r
  return -exp(-length(pos) * 2.0);\r
}\r
\r
vec4 sampleBox(vec2 center) {\r
  float acc = 0.0;\r
  vec4 col = vec4(0.0);\r
  for (float x = -1.0; x < 1.0; x += 0.2) {\r
    for (float y = -1.0; y < 1.0; y += 0.2) {\r
      vec2 pos = center + vec2(x, y) * strength;\r
      float g = gauss(vec2(x, y));\r
      col += getTex(pos) * g;\r
      acc += g;\r
    }\r
  }\r
  return col / acc;\r
}\r
\r
void main() {\r
  vec2 pos = vUv * resolution;\r
  fragColor = sampleBox(pos);\r
}\r
`,ae=`uniform float threshold;\r
uniform float strength;\r
uniform float blur;\r
\r
float getBrightness(vec3 col) {\r
  return max(col.r, max(col.g, col.b));\r
}\r
\r
vec4 getOriginalTex(vec2 uv) {\r
  return texture(uMain, uv / resolution);\r
}\r
\r
vec3 getTex(vec2 uv) {\r
  vec4 col = texture(uMain, uv / resolution);\r
  return getBrightness(col.rgb) > threshold ? col.rgb : vec3(0.0);\r
}\r
\r
float gauss(vec2 pos) {\r
  return -exp(-length(pos) * 2.0);\r
}\r
\r
vec3 sampleBox(vec2 center) {\r
  float acc = 0.0;\r
  vec3 col = vec3(0.0);\r
  for (float x = -1.0; x < 1.0; x += 0.2) {\r
    for (float y = -1.0; y < 1.0; y += 0.2) {\r
      vec2 pos = center + vec2(x, y) * blur;\r
      float g = gauss(vec2(x, y));\r
      col += getTex(pos) * g;\r
      acc += g;\r
    }\r
  }\r
  return col / acc;\r
}\r
\r
void main() {\r
  vec2 pos = vUv * resolution;\r
  vec4 baseCol = getOriginalTex(pos);\r
  fragColor = baseCol + vec4(sampleBox(pos), 0.0) * strength;\r
}\r
`,oe=`uniform float blockSize;\r
\r
vec4 getTex(vec2 uv) {\r
  return texture(uMain, uv / resolution);\r
}\r
\r
vec4 getPixel(vec2 uv) {\r
  vec2 base = floor(uv / blockSize) * blockSize;\r
  return (\r
    getTex(base)\r
    + getTex(base + vec2(blockSize, 0.0))\r
    + getTex(base + vec2(0.0, blockSize))\r
    + getTex(base + vec2(blockSize, blockSize))\r
  ) * 0.25;\r
}\r
\r
void main() {\r
  vec2 pos = vUv * resolution;\r
  fragColor = getPixel(pos);\r
}\r
`,T=`float random(vec2 st) {\r
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);\r
}\r
\r
uniform float randomSize;\r
\r
vec4 getTex(vec2 uv) {\r
  return texture(uMain, uv / resolution);\r
}\r
\r
void main() {\r
  vec2 pos = vUv * resolution;\r
  fragColor = getTex(\r
    pos + (\r
      vec2(random(vUv), random(vUv + vec2(1.0))) * 2.0 - vec2(1.0)\r
    ) * randomSize\r
  );\r
}\r
`,se=`uniform float blend;\r
void main() {\r
  vec4 col1 = texture(uMain, vUv);\r
  vec4 col2 = texture(uSecond, vUv);\r
  fragColor = mix(col1, col2, blend);\r
}\r
`,ce=`uniform float amount;\r
\r
void main() {\r
  vec4 col = texture(uMain, vUv);\r
  float d = distance(vUv, vec2(0.5));\r
  float vig = smoothstep(0.8, 0.2, d * (0.5 + amount));\r
  fragColor = vec4(col.rgb * vig, col.a);\r
}\r
`,le=`uniform float contrast;\r
uniform float brightness;\r
\r
void main() {\r
  vec4 col = texture(uMain, vUv);\r
  vec3 c = (col.rgb - 0.5) * contrast + 0.5 + brightness;\r
  fragColor = vec4(clamp(c, 0.0, 1.0), col.a);\r
}\r
`,E=`uniform float levels;\r
\r
void main() {\r
  vec4 col = texture(uMain, vUv);\r
  float lv = max(levels, 2.0);\r
  fragColor = vec4(floor(col.rgb * lv) / lv, col.a);\r
}\r
`,ue=`void main() {\r
  vec2 uv = vec2(1.0 - vUv.x, vUv.y);\r
  fragColor = texture(uMain, uv);\r
}\r
`,de=`uniform float amount;\r
\r
void main() {\r
  vec2 off = vec2(amount, 0.0) / resolution;\r
  float r = texture(uMain, vUv + off).r;\r
  float g = texture(uMain, vUv).g;\r
  float b = texture(uMain, vUv - off).b;\r
  fragColor = vec4(r, g, b, 1.0);\r
}\r
`,fe=`void main() {\r
  vec2 px = 1.0 / resolution;\r
  vec3 c = texture(uMain, vUv).rgb;\r
  vec3 n = texture(uMain, vUv + vec2(0.0, px.y)).rgb;\r
  vec3 s = texture(uMain, vUv - vec2(0.0, px.y)).rgb;\r
  vec3 e = texture(uMain, vUv + vec2(px.x, 0.0)).rgb;\r
  vec3 w = texture(uMain, vUv - vec2(px.x, 0.0)).rgb;\r
  vec3 edge = abs(n - s) + abs(e - w);\r
  float l = edge.r * 0.3 + edge.g * 0.59 + edge.b * 0.11;\r
  fragColor = vec4(vec3(l * 4.0), 1.0);\r
}\r
`,pe=`void main() {\r
  vec4 a = texture(uMain, vUv);\r
  vec4 b = texture(uSecond, vUv);\r
  fragColor = vec4(a.rgb * b.rgb, a.a);\r
}\r
`,me=`void main() {\r
  vec4 a = texture(uMain, vUv);\r
  vec4 b = texture(uSecond, vUv);\r
  fragColor = vec4(1.0 - (1.0 - a.rgb) * (1.0 - b.rgb), a.a);\r
}\r
`,D=`void main() {\r
  vec4 a = texture(uMain, vUv);\r
  vec4 b = texture(uSecond, vUv);\r
  vec3 low = 2.0 * a.rgb * b.rgb;\r
  vec3 high = 1.0 - 2.0 * (1.0 - a.rgb) * (1.0 - b.rgb);\r
  vec3 mixd = mix(low, high, step(0.5, a.rgb));\r
  fragColor = vec4(mixd, a.a);\r
}\r
`,O=`void main() {\r
  vec4 a = texture(uMain, vUv);\r
  vec4 b = texture(uSecond, vUv);\r
  fragColor = vec4(abs(a.rgb - b.rgb), a.a);\r
}\r
`,k=`uniform float amount;\r
\r
void main() {\r
  vec4 a = texture(uMain, vUv);\r
  vec4 b = texture(uSecond, vUv);\r
  fragColor = vec4(clamp(a.rgb + b.rgb * amount, 0.0, 1.0), a.a);\r
}\r
`,A=`/** Use uSecond luminance as a soft mask over uMain. */\r
uniform float invertMask;\r
\r
void main() {\r
  vec4 a = texture(uMain, vUv);\r
  vec4 b = texture(uSecond, vUv);\r
  float m = b.r * 0.3 + b.g * 0.59 + b.b * 0.11;\r
  m = mix(m, 1.0 - m, invertMask);\r
  fragColor = vec4(a.rgb * m, a.a);\r
}\r
`,j=`/** Weighted mix of three inputs. */\r
uniform vec3 weights;\r
\r
void main() {\r
  vec4 a = texture(uMain, vUv);\r
  vec4 b = texture(uSecond, vUv);\r
  vec4 c = texture(uThird, vUv);\r
  float wsum = max(weights.x + weights.y + weights.z, 0.0001);\r
  vec3 rgb = (a.rgb * weights.x + b.rgb * weights.y + c.rgb * weights.z) / wsum;\r
  fragColor = vec4(rgb, a.a);\r
}\r
`,M=`void main() {
  fragColor = texture(uMain, vUv);
}`,N=class{gl;canvas;programs;pool;quad;sourceTextures=new Map;delayPairs=new Map;mainTexture=null;width;height;constructor(e,t,n){this.gl=e,this.canvas=t,this.width=t.width,this.height=t.height,this.programs=new a(e),this.pool=new c(e,this.width,this.height),this.quad=l(e),this.mainTexture=u(e,n)}setMainImage(e){this.mainTexture&&this.gl.deleteTexture(this.mainTexture),this.mainTexture=u(this.gl,e),this.resize(e.naturalWidth||this.canvas.width,e.naturalHeight||this.canvas.height)}resize(e,t){if(!(e===this.width&&t===this.height)){this.width=e,this.height=t,this.canvas.width=e,this.canvas.height=t,this.pool.resize(e,t);for(let e of this.delayPairs.values())this.pool.release(e.read),this.pool.release(e.write);this.delayPairs.clear()}}render(e,t){let n=this.gl,r=h(e),i=new Map,a=[],o=e=>{if(e.input===`main`){if(!this.mainTexture)throw Error(`main texture missing`);return this.mainTexture}let t=e.id,r=this.sourceTextures.get(t);return r||(r=u(n,e.input.image),this.sourceTextures.set(t,r)),r};for(let n of r){let r=e.nodes[n],s=n===e.output;if(r.kind===`source`){let e=o(r);i.set(n,e),s&&this.drawPass({shader:M,uniforms:{},textures:[e],target:null,flipY:-1,frame:t});continue}if(r.kind===`delay`){let e=this.delayPairs.get(n);e||(e={read:this.pool.acquire(),write:this.pool.acquire()},this.delayPairs.set(n,e));let a=i.get(r.input);if(!a)throw Error(`delay "${n}" missing input`);this.drawPass({shader:M,uniforms:{},textures:[a],target:e.write,flipY:1,frame:t}),i.set(n,e.read.texture),s&&this.drawPass({shader:M,uniforms:{},textures:[e.read.texture],target:null,flipY:-1,frame:t});let o=e.read;e.read=e.write,e.write=o;continue}let c=s?null:this.pool.acquire();if(c&&a.push(c),r.kind===`pass`){let e=i.get(r.input);if(!e)throw Error(`pass "${n}" missing input`);this.drawPass({shader:r.shader,uniforms:{...r.uniforms,...t.globalUniforms},textures:[e],target:c,flipY:s?-1:1,frame:t}),!s&&c&&i.set(n,c.texture);continue}if(r.kind===`blend`){let e=r.inputs.map(e=>{let t=i.get(e);if(!t)throw Error(`blend "${n}" missing input "${e}"`);return t});this.drawPass({shader:r.shader,uniforms:{...r.uniforms,...t.globalUniforms},textures:e,target:c,flipY:s?-1:1,frame:t}),!s&&c&&i.set(n,c.texture)}}for(let e of a)this.pool.release(e)}drawPass(n){let r=this.gl,i=this.programs.get(n.shader);r.useProgram(i.program),n.target?r.bindFramebuffer(r.FRAMEBUFFER,n.target.framebuffer):r.bindFramebuffer(r.FRAMEBUFFER,null),r.viewport(0,0,this.width,this.height),i.locations.uFlipY&&r.uniform1f(i.locations.uFlipY,n.flipY),i.locations.time&&r.uniform1f(i.locations.time,n.frame.time),i.locations.resolution&&r.uniform2f(i.locations.resolution,this.width,this.height),i.locations.mouse&&r.uniform2f(i.locations.mouse,n.frame.mouse[0],n.frame.mouse[1]),i.locations.isHover&&r.uniform1i(i.locations.isHover,+!!n.frame.isHover);for(let[a,o]of Object.entries(n.uniforms)){let n=this.programs.customLocation(i,a);n&&t(r,n,e(o))}let a=[i.locations.uMain,i.locations.uSecond,i.locations.uThird,i.locations.uFourth];for(let e=0;e<n.textures.length;e++){r.activeTexture(r.TEXTURE0+e),r.bindTexture(r.TEXTURE_2D,n.textures[e]);let t=a[e];t&&r.uniform1i(t,e)}r.bindVertexArray(this.quad.vao),r.drawArrays(r.TRIANGLES,0,6),r.bindVertexArray(null),r.bindTexture(r.TEXTURE_2D,null),r.bindFramebuffer(r.FRAMEBUFFER,null)}dispose(){let e=this.gl;this.programs.dispose(),this.pool.clear(),this.quad.dispose(),this.mainTexture&&e.deleteTexture(this.mainTexture);for(let t of this.sourceTextures.values())e.deleteTexture(t);this.sourceTextures.clear(),this.delayPairs.clear()}};function P(e){switch(e){case`image/png`:return`png`;case`image/jpeg`:return`jpg`;case`image/webp`:return`webp`;default:return e}}function F(e,t=`image/png`){let n=P(t),r=e.trim()||`graphim-export`;return r.toLowerCase().endsWith(`.${n}`)?r:`${r}.${n}`}function I(e,t){let n=URL.createObjectURL(e),r=document.createElement(`a`);r.href=n,r.download=t,r.rel=`noopener`,r.click(),URL.revokeObjectURL(n)}function L(e){let{image:t}=e,n=document.createElement(`canvas`);d(t,n),t.after(n),t.style.display=`none`;let r=n.getContext(`webgl2`,{preserveDrawingBuffer:!0,alpha:!0,premultipliedAlpha:!0});if(!r)throw n.remove(),t.style.removeProperty(`display`),Error(`WebGL2 is required but not available in this browser`);let i=new N(r,n,t),a=null,o={},s=!1,c=0,l=0,u=[0,0],f=!1,p=e=>{if(e instanceof TouchEvent){let t=n.getBoundingClientRect(),r=e.touches[0];if(!r)return;u=[(r.clientX-t.left)/Math.max(n.width,1),1-(r.clientY-t.top)/Math.max(n.height,1)]}else u=[e.offsetX/Math.max(n.width,1),1-e.offsetY/Math.max(n.height,1)]};n.addEventListener(`mouseenter`,e=>{f=!0,p(e)}),n.addEventListener(`mousemove`,p),n.addEventListener(`mouseleave`,e=>{f=!1,p(e)}),n.addEventListener(`touchstart`,e=>{f=!0,p(e)}),n.addEventListener(`touchmove`,p),n.addEventListener(`touchend`,()=>{f=!1});let m=e=>{a&&i.render(a,{time:e,mouse:u,isHover:f,globalUniforms:o})},h=()=>{if(!a)throw Error(`setGraph() before exporting`);m(c)},g=e=>e?.type??`image/png`,_={canvas:n,setGraph(e){a={nodes:{...e.nodes},output:e.output}},render(e=0){c=e,m(e)},animate(){if(s)return;s=!0,l=performance.now()/1e3;let e=()=>{if(!s)return;let t=performance.now()/1e3;c+=t-l,l=t,m(c),requestAnimationFrame(e)};requestAnimationFrame(e)},stop(){s=!1},setUniforms(e){o={...o,...e}},setImage(e){d(e,n),i.setMainImage(e)},setSize(e,t){if(!Number.isFinite(e)||!Number.isFinite(t)||e<=0||t<=0)throw Error(`width and height must be positive finite numbers`);i.resize(Math.floor(e),Math.floor(t))},toDataURL(e){h();let t=g(e);return t===`image/png`?n.toDataURL(t):n.toDataURL(t,e?.quality??.92)},toBlob(e){h();let t=g(e),r=e?.quality??.92;return new Promise((e,i)=>{n.toBlob(t=>{if(!t){i(Error(`canvas.toBlob returned null`));return}e(t)},t,t===`image/png`?void 0:r)})},async download(e){let t=g(e);I(await _.toBlob(e),F(e?.fileName??`graphim-export`,t))},dispose(){s=!1,i.dispose(),n.remove(),t.style.removeProperty(`display`)}};return _}var R={mount:L};function z(e){return w(b(te,e),`Gray`)}function B(e){return w(b(ne,e),`Sepia`)}function he(e){return w(b(re,e),`Negative`)}function V(e,t=5){return w(b(ie,e,{strength:t}),`Blur`)}function H(e,t={}){return w(b(ae,e,{threshold:t.threshold??.5,strength:t.strength??2,blur:t.blur??1}),`Bloom`)}function ge(e,t=5){return w(b(oe,e,{blockSize:t}),`Pixel`)}function _e(e,t=3){return w(b(T,e,{randomSize:t}),`Frosted glass`)}function ve(e,t=1){return w(b(ce,e,{amount:t}),`Vignette`)}function U(e,t={}){return w(b(le,e,{contrast:t.contrast??1.4,brightness:t.brightness??0}),`Contrast`)}function W(e,t=6){return w(b(E,e,{levels:t}),`Posterize`)}function G(e){return w(b(ue,e),`Mirror`)}function ye(e,t=4){return w(b(de,e,{amount:t}),`Chromatic`)}function K(e){return w(b(fe,e),`Edge`)}function q(e,t,n=.5){return w(S(e,t,{shader:se,uniforms:{blend:n}}),`Mix`)}function be(e,t){return w(S(e,t,{shader:pe,uniforms:{}}),`Multiply`)}function xe(e,t){return w(S(e,t,{shader:me,uniforms:{}}),`Screen`)}function Se(e,t){return w(S(e,t,{shader:D,uniforms:{}}),`Overlay`)}function Ce(e,t){return w(S(e,t,{shader:O,uniforms:{}}),`Difference`)}function we(e,t,n=1){return w(S(e,t,{shader:k,uniforms:{amount:n}}),`Add`)}function Te(e,t,n=0){return w(S(e,t,{shader:A,uniforms:{invertMask:n}}),`Mask`)}function Ee(e,t,n,r=[1,1,1]){return w(x([e,t,n],{shader:j,uniforms:{weights:[...r]}}),`Triple mix`)}var De=`/cursor-workspace/graphim-demo/assets/sample-BEKEdzgG.jpg`,J=[`gray`,`sepia`,`neg`,`blur`,`bloom`,`pixel`,`frosted`,`vignette`,`contrast`,`posterize`,`mirror`,`chromatic`,`edge`,`wave`,`mixSplit`,`bloomGlow`,`multiplyDuo`,`screenDuo`,`overlayDuo`,`differenceDuo`,`maskRadial`,`tripleLook`,`trail`],Y={gray:{label:`Gray`,animated:!1,inputs:1},sepia:{label:`Sepia`,animated:!1,inputs:1},neg:{label:`Negative`,animated:!1,inputs:1},blur:{label:`Blur`,animated:!1,inputs:1},bloom:{label:`Bloom`,animated:!1,inputs:1},pixel:{label:`Pixel`,animated:!1,inputs:1},frosted:{label:`Frosted glass`,animated:!1,inputs:1},vignette:{label:`Vignette`,animated:!1,inputs:1},contrast:{label:`Contrast`,animated:!1,inputs:1},posterize:{label:`Posterize`,animated:!1,inputs:1},mirror:{label:`Mirror`,animated:!1,inputs:1},chromatic:{label:`Chromatic`,animated:!1,inputs:1},edge:{label:`Edge`,animated:!1,inputs:1},wave:{label:`Prismatic flow (custom)`,animated:!0,inputs:1},mixSplit:{label:`Mix: sepia | gray`,animated:!1,inputs:2},bloomGlow:{label:`Mix: original | bloom`,animated:!1,inputs:2},multiplyDuo:{label:`Multiply × overlay`,animated:!1,inputs:2},screenDuo:{label:`Screen × blur`,animated:!1,inputs:2},overlayDuo:{label:`Overlay × posterize`,animated:!1,inputs:2},differenceDuo:{label:`Difference × mirror`,animated:!1,inputs:2},maskRadial:{label:`Mask with vignette`,animated:!1,inputs:2},tripleLook:{label:`Triple: sepia|edge|blur`,animated:!1,inputs:3},trail:{label:`Delay trail`,animated:!0,inputs:2}};function Oe(){return J.map(e=>({id:e,...Y[e]}))}function ke(e){return J.includes(e)}function Ae(e){return Y[e].animated}function je(e){return`graphim-${e.replace(/[^a-z0-9_-]+/gi,`-`).replace(/^-|-$/g,``)||`export`}`}function Me(e=512){let t=document.createElement(`canvas`);t.width=e,t.height=e;let n=t.getContext(`2d`);if(!n)return Promise.reject(Error(`2d context unavailable`));let r=n.createRadialGradient(e/2,e/2,e*.05,e/2,e/2,e*.55);r.addColorStop(0,`#ffffff`),r.addColorStop(1,`#000000`),n.fillStyle=r,n.fillRect(0,0,e,e);let i=new Image;return new Promise((e,n)=>{i.onload=()=>e(i),i.onerror=()=>n(Error(`mask image failed to load`)),i.src=t.toDataURL(`image/png`)})}function Ne(e){let t=h({nodes:e.nodes,output:e.output}),n=new Map,r=new Map;for(let i of t){let t=e.nodes[i],a=f(t),o=a.length===0?0:Math.max(...a.map(e=>n.get(e)??0))+1;n.set(i,o);let s=r.get(o)??[];s.push(i),r.set(o,s)}let i=Math.max(0,...n.values()),a=Math.max(1,...[...r.values()].map(e=>e.length)),o=96+(i+1)*128+i*64,s=96+a*48+(a-1)*24,c=t.flatMap(t=>{let n=f(e.nodes[t]);return n.map((e,r)=>({from:e,to:t,targetIndex:r,targetCount:n.length}))}),l=new Map;for(let e of c){let t=l.get(e.from)??[];t.push(e),l.set(e.from,t)}let u=0,d=c.map(e=>{let t=l.get(e.from)??[e],r=n.get(e.from)??0,i=(n.get(e.to)??0)-r>1?u++:-1;return{...e,sourceIndex:t.indexOf(e),sourceCount:t.length,route:i<0?`direct`:i%2==0?`above`:`below`,routeLane:i<0?0:Math.floor(i/2)}}),p=[];for(let[t,n]of r){let r=(s-(n.length*48+Math.max(0,n.length-1)*24))/2;n.forEach((n,i)=>{let a=e.nodes[n];p.push({id:n,label:a.label??Pe(a),kind:a.kind,x:48+t*192,y:r+i*72,inputCount:f(a).length,outputCount:l.get(n)?.length??0,output:n===e.output})})}return{nodes:p,edges:d,width:o,height:s}}function X(e,t){return t<=1?48/2:(e+1)*48/(t+1)}function Pe(e){switch(e.kind){case`source`:return`Source`;case`pass`:return`Pass`;case`blend`:return`Merge`;case`delay`:return`Delay`;default:return e}}var Z=`http://www.w3.org/2000/svg`;function Fe(e,t){let n=Ne(t),r=document.createElementNS(Z,`svg`);r.setAttribute(`viewBox`,`0 0 ${n.width} ${n.height}`),r.setAttribute(`role`,`img`),r.setAttribute(`aria-label`,`Effect DAG with ${n.nodes.length} nodes and ${n.edges.length} edges`),r.classList.add(`dag-svg`);let i=document.createElementNS(Z,`defs`),a=document.createElementNS(Z,`marker`);a.setAttribute(`id`,`dag-arrow`),a.setAttribute(`markerWidth`,`8`),a.setAttribute(`markerHeight`,`8`),a.setAttribute(`refX`,`7`),a.setAttribute(`refY`,`4`),a.setAttribute(`orient`,`auto`);let o=document.createElementNS(Z,`path`);o.setAttribute(`d`,`M 0 0 L 8 4 L 0 8 z`),o.classList.add(`dag-arrow`),a.append(o),i.append(a),r.append(i);let s=new Map(n.nodes.map(e=>[e.id,e]));for(let e of n.edges){let t=s.get(e.from),i=s.get(e.to);if(!t||!i)continue;let a=document.createElementNS(Z,`path`),o=t.x+128,c=t.y+X(e.sourceIndex,e.sourceCount),l=i.x,u=i.y+X(e.targetIndex,e.targetCount);a.setAttribute(`d`,Ie(o,c,l,u,e.route,e.routeLane,n.height)),a.setAttribute(`marker-end`,`url(#dag-arrow)`),a.classList.add(`dag-edge`),r.append(a)}for(let e of n.nodes)r.append(Le(e));e.replaceChildren(r)}function Ie(e,t,n,r,i,a,o){if(i===`direct`){let i=(e+n)/2;return`M ${e} ${t} C ${i} ${t}, ${i} ${r}, ${n} ${r}`}let s=14+a*9,c=i===`above`?s:o-s,l=Math.min(30,Math.max(18,(n-e)/5));return[`M ${e} ${t}`,`C ${e+l*.4} ${t}, ${e+l*.6} ${c}, ${e+l} ${c}`,`L ${n-l} ${c}`,`C ${n-l*.6} ${c}, ${n-l*.4} ${r}, ${n} ${r}`].join(` `)}function Le(e){let t=document.createElementNS(Z,`g`);t.setAttribute(`transform`,`translate(${e.x} ${e.y})`),t.classList.add(`dag-node`,`dag-node--${e.kind}`),e.output&&t.classList.add(`dag-node--output`);let n=document.createElementNS(Z,`rect`);n.setAttribute(`width`,`128`),n.setAttribute(`height`,`48`),n.setAttribute(`rx`,`6`);let r=document.createElementNS(Z,`text`);r.setAttribute(`x`,`64`),r.setAttribute(`y`,`21`),r.setAttribute(`text-anchor`,`middle`),r.classList.add(`dag-node__label`),r.textContent=e.label;let i=document.createElementNS(Z,`text`);return i.setAttribute(`x`,`64`),i.setAttribute(`y`,`37`),i.setAttribute(`text-anchor`,`middle`),i.classList.add(`dag-node__kind`),i.textContent=e.output?`${e.kind} · output`:e.kind,t.append(n,r,i),Q(t,`input`,e.inputCount),Q(t,`output`,e.outputCount),t}function Q(e,t,n){for(let r=0;r<n;r+=1){let i=document.createElementNS(Z,`circle`);i.setAttribute(`cx`,t===`input`?`0`:`128`),i.setAttribute(`cy`,String(X(r,n))),i.setAttribute(`r`,`3.5`),i.classList.add(`dag-port`,`dag-port--${t}`),e.append(i)}}function Re(e){e.innerHTML=`
    <header class="header">
      <p class="back"><a href="../">← Portal</a></p>
      <h1>Graphim Demo</h1>
      <p>WebGL2 フル DAG — 単一パス / 2〜3 入力ブレンド / Delay</p>
    </header>
    <section class="controls">
      <label>
        Effect
        <select id="effect">${Oe().map(e=>`<option value="${e.id}">${e.label}${e.inputs>1?` (${e.inputs}in)`:``}</option>`).join(``)}</select>
      </label>
      <button type="button" id="export" class="btn">画像を書き出し</button>
    </section>
    <section class="stage-wrap">
      <img id="source" src="${De}" alt="Sample for Graphim filters" />
    </section>
    <p id="status" class="status" aria-live="polite"></p>
    <section class="dag-panel" aria-labelledby="dag-title">
      <div class="dag-panel__header">
        <h2 id="dag-title">Effect DAG</h2>
        <p>入力から出力まで、実際に実行されるノード構成</p>
      </div>
      <div id="dag-graph" class="dag-graph"></div>
    </section>
  `;let t=e.querySelector(`#source`),n=e.querySelector(`#effect`),r=e.querySelector(`#export`),i=e.querySelector(`#status`),a=e.querySelector(`#dag-graph`);if(!t||!n||!r||!i||!a)throw Error(`demo DOM missing`);let o=null,s=null,c=`gray`,l=()=>{if(!o)return;o.stop();let e=ze(c,s);o.setGraph(e),Fe(a,e),Ae(c)?(o.animate(),i.textContent=`${c}: animating`):(o.render(),i.textContent=`${c}: rendered`)},u=async()=>{s=await Me(Math.max(t.naturalWidth,t.naturalHeight,512)),o=R.mount({image:t}),l()},d=()=>{u().catch(e=>{i.textContent=`init failed: ${e instanceof Error?e.message:String(e)}`})};t.complete&&t.naturalWidth>0?d():t.addEventListener(`load`,d,{once:!0}),n.addEventListener(`change`,()=>{let e=n.value;ke(e)&&(c=e,l())}),r.addEventListener(`click`,()=>{(async()=>{if(o)try{await o.download({fileName:je(c),type:`image/png`}),i.textContent=`${c}: exported PNG`}catch(e){i.textContent=`export failed: ${e instanceof Error?e.message:String(e)}`}})()})}function ze(e,t){let n=y(),r=t?y({image:t}):z(n);switch(e){case`gray`:return z(n);case`sepia`:return B(n);case`neg`:return he(n);case`blur`:return V(n,8);case`bloom`:return H(n,{threshold:.45,strength:2.5,blur:1.2});case`pixel`:return ge(n,12);case`frosted`:return _e(n,4);case`vignette`:return ve(n,1.2);case`contrast`:return U(n,{contrast:1.5,brightness:.02});case`posterize`:return W(n,5);case`mirror`:return G(n);case`chromatic`:return ye(n,6);case`edge`:return K(n);case`wave`:return w(b(`
uniform float strength;
void main() {
  vec2 p = vUv - vec2(0.5);
  float falloff = 1.0 - smoothstep(0.12, 0.72, length(p));
  float flowX = sin(p.y * 18.0 + time * 1.1)
    + 0.5 * sin(p.y * 31.0 - time * 0.7);
  float flowY = cos(p.x * 16.0 - time * 0.9)
    + 0.5 * cos(p.x * 27.0 + time * 0.6);
  vec2 flow = vec2(flowX, flowY) * 0.0045 * strength * falloff;
  vec2 prism = normalize(flow + vec2(0.0001)) * 0.0025 * strength;
  float r = texture(uMain, vUv + flow + prism).r;
  float g = texture(uMain, vUv + flow).g;
  float b = texture(uMain, vUv + flow - prism).b;
  fragColor = vec4(r, g, b, texture(uMain, vUv + flow).a);
}
`,n,{strength:1}),`Prismatic flow`);case`mixSplit`:return q(B(n),z(n),.45);case`bloomGlow`:return q(n,H(n,{threshold:.4,strength:2.2,blur:1.5}),.55);case`multiplyDuo`:return be(n,r);case`screenDuo`:return xe(n,V(n,14));case`overlayDuo`:return Se(n,W(n,4));case`differenceDuo`:return Ce(n,G(n));case`maskRadial`:return Te(U(n,{contrast:1.2}),r,0);case`tripleLook`:return Ee(B(n),K(n),V(n,6),[.45,.35,.2]);case`trail`:return q(n,C(we(n,V(n,10),.35)),.55);default:return e}}var $=document.querySelector(`#app`);if(!$)throw Error(`#app not found`);Re($);
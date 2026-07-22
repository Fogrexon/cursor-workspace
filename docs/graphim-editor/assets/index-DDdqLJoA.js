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
`;function i(e,t,n){let r=e.createShader(t);if(!r)throw Error(`createShader failed`);if(e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS)){let t=e.getShaderInfoLog(r)??`unknown`;throw e.deleteShader(r),Error(`shader compile failed: ${t}\n${n}`)}return r}var a=class{gl;cache=new Map;constructor(e){this.gl=e}get(e){let t=this.cache.get(e);if(t)return t;let a=this.gl,o=i(a,a.VERTEX_SHADER,n),s=i(a,a.FRAGMENT_SHADER,`${r}\n${e}`),c=a.createProgram();if(!c)throw Error(`createProgram failed`);if(a.attachShader(c,o),a.attachShader(c,s),a.linkProgram(c),a.deleteShader(o),a.deleteShader(s),!a.getProgramParameter(c,a.LINK_STATUS)){let e=a.getProgramInfoLog(c)??`unknown`;throw a.deleteProgram(c),Error(`program link failed: ${e}`)}let l={program:c,locations:{aPosition:a.getAttribLocation(c,`aPosition`),aUv:a.getAttribLocation(c,`aUv`),uFlipY:a.getUniformLocation(c,`uFlipY`),uMain:a.getUniformLocation(c,`uMain`),uSecond:a.getUniformLocation(c,`uSecond`),uThird:a.getUniformLocation(c,`uThird`),uFourth:a.getUniformLocation(c,`uFourth`),time:a.getUniformLocation(c,`time`),resolution:a.getUniformLocation(c,`resolution`),mouse:a.getUniformLocation(c,`mouse`),isHover:a.getUniformLocation(c,`isHover`)},custom:new Map};return this.cache.set(e,l),l}customLocation(e,t){if(e.custom.has(t))return e.custom.get(t);let n=this.gl.getUniformLocation(e.program,t);return e.custom.set(t,n),n}dispose(){for(let{program:e}of this.cache.values())this.gl.deleteProgram(e);this.cache.clear()}};function o(e,t,n){let r=e.createTexture(),i=e.createFramebuffer();if(!r||!i)throw Error(`failed to create render target`);e.bindTexture(e.TEXTURE_2D,r),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,t,n,0,e.RGBA,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindFramebuffer(e.FRAMEBUFFER,i),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,r,0);let a=e.checkFramebufferStatus(e.FRAMEBUFFER);if(a!==e.FRAMEBUFFER_COMPLETE)throw Error(`framebuffer incomplete: ${a}`);return e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindTexture(e.TEXTURE_2D,null),{framebuffer:i,texture:r,width:t,height:n}}function s(e,t){e.deleteFramebuffer(t.framebuffer),e.deleteTexture(t.texture)}var c=class{gl;width;height;free=[];all=new Set;constructor(e,t,n){this.gl=e,this.width=t,this.height=n}resize(e,t){e===this.width&&t===this.height||(this.clear(),this.width=e,this.height=t)}acquire(){let e=this.free.pop();if(e)return e;let t=o(this.gl,this.width,this.height);return this.all.add(t),t}release(e){this.all.has(e)&&this.free.push(e)}clear(){for(let e of this.all)s(this.gl,e);this.all.clear(),this.free.length=0}get checkedOut(){return this.all.size-this.free.length}};function l(e){let t=e.createVertexArray();if(!t)throw Error(`createVertexArray failed`);e.bindVertexArray(t);let n=new Float32Array([-1,-1,0,0,1,-1,1,0,-1,1,0,1,-1,1,0,1,1,-1,1,0,1,1,1,1]),r=e.createBuffer();if(!r)throw Error(`createBuffer failed`);return e.bindBuffer(e.ARRAY_BUFFER,r),e.bufferData(e.ARRAY_BUFFER,n,e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,16,0),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,2,e.FLOAT,!1,16,8),e.bindVertexArray(null),e.bindBuffer(e.ARRAY_BUFFER,null),{vao:t,dispose:()=>{e.deleteBuffer(r),e.deleteVertexArray(t)}}}function u(e,t){let n=e.createTexture();if(!n)throw Error(`createTexture failed`);return e.bindTexture(e.TEXTURE_2D,n),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,0),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindTexture(e.TEXTURE_2D,null),n}function d(e,t){let n=e,r=n.naturalWidth||e.clientWidth||1,i=n.naturalHeight||e.clientHeight||1;t.width=r,t.height=i,t.style.removeProperty(`width`),t.style.removeProperty(`height`)}function f(e){switch(e.kind){case`source`:return[];case`pass`:case`delay`:return[e.input];case`blend`:return[...e.inputs];default:return e}}var p=class extends Error{constructor(e){super(e),this.name=`GraphValidationError`}};function m(e){let{nodes:t,output:n}=e;if(!(n in t))throw new p(`output node "${n}" is missing from graph.nodes`);for(let[e,n]of Object.entries(t)){if(n.id!==e)throw new p(`node key "${e}" does not match node.id "${n.id}"`);if(n.kind===`blend`){let t=n.inputs.length;if(t<2||t>4)throw new p(`blend "${e}" must have 2–4 inputs, got ${t}`)}for(let r of f(n))if(!(r in t))throw new p(`node "${e}" references missing input "${r}"`)}let r=new Set,i=new Set,a=e=>{if(!i.has(e)){if(r.has(e))throw new p(`cycle detected at node "${e}"`);r.add(e);for(let n of f(t[e]))a(n);r.delete(e),i.add(e)}};a(n)}function h(e){m(e);let{nodes:t,output:n}=e,r=[],i=new Set,a=e=>{if(!i.has(e)){i.add(e);for(let n of f(t[e]))a(n);r.push(e)}};return a(n),r}var g=0;function _(e){return g+=1,`${e}_${g}`}function v(e,t){return{...e,...t}}function ee(e=`main`){let t=_(`source`),n={id:t,label:e===`main`?`Main image`:`External image`,kind:`source`,input:e};return{output:t,nodes:{[t]:n}}}function y(e,t,n={}){let r=_(`pass`),i={id:r,label:`Custom pass`,kind:`pass`,shader:e,uniforms:{...n},input:t.output};return{output:r,nodes:v(t.nodes,{[r]:i})}}function b(e,t){if(e.length<2||e.length>4)throw Error(`merge() expects 2–4 inputs, got ${e.length}`);let n=_(`blend`),r={};for(let t of e)r=v(r,t.nodes);let i={id:n,label:`Merge`,kind:`blend`,shader:t.shader,uniforms:{...t.uniforms},inputs:e.map(e=>e.output)};return{output:n,nodes:v(r,{[n]:i})}}function x(e,t,n={}){return C(b([e,t],{shader:n.shader??w,uniforms:{blend:.5,...n.uniforms}}),`Blend`)}function S(e){let t=_(`delay`),n={id:t,label:`Delay`,kind:`delay`,input:e.output};return{output:t,nodes:v(e.nodes,{[t]:n})}}function C(e,t){let n=e.nodes[e.output];if(!n)throw Error(`named() output "${e.output}" is missing`);return{output:e.output,nodes:{...e.nodes,[e.output]:{...n,label:t}}}}var w=`uniform float blend;
void main() {
  vec4 col1 = texture(uMain, vUv);
  vec4 col2 = texture(uSecond, vUv);
  fragColor = mix(col1, col2, blend);
}`,T=`void main() {\r
  vec4 col = texture(uMain, vUv);\r
  float gray = col.r * 0.3 + col.g * 0.59 + col.b * 0.11;\r
  fragColor = vec4(gray, gray, gray, col.a);\r
}\r
`,E=`void main() {\r
  vec4 col = texture(uMain, vUv);\r
  fragColor = vec4(\r
    col.r * 0.393 + col.g * 0.769 + col.b * 0.189,\r
    col.r * 0.349 + col.g * 0.686 + col.b * 0.168,\r
    col.r * 0.272 + col.g * 0.534 + col.b * 0.131,\r
    col.a);\r
}\r
`,te=`void main() {\r
  vec4 col = texture(uMain, vUv);\r
  fragColor = vec4(vec3(1.0) - col.rgb, col.a);\r
}\r
`,D=`uniform float strength;\r
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
`,ne=`uniform float threshold;\r
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
`,O=`uniform float blockSize;\r
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
`,k=`uniform float blend;\r
void main() {\r
  vec4 col1 = texture(uMain, vUv);\r
  vec4 col2 = texture(uSecond, vUv);\r
  fragColor = mix(col1, col2, blend);\r
}\r
`,A=`uniform float amount;\r
\r
void main() {\r
  vec4 col = texture(uMain, vUv);\r
  float d = distance(vUv, vec2(0.5));\r
  float vig = smoothstep(0.8, 0.2, d * (0.5 + amount));\r
  fragColor = vec4(col.rgb * vig, col.a);\r
}\r
`,j=`uniform float contrast;\r
uniform float brightness;\r
\r
void main() {\r
  vec4 col = texture(uMain, vUv);\r
  vec3 c = (col.rgb - 0.5) * contrast + 0.5 + brightness;\r
  fragColor = vec4(clamp(c, 0.0, 1.0), col.a);\r
}\r
`,re=`uniform float levels;\r
\r
void main() {\r
  vec4 col = texture(uMain, vUv);\r
  float lv = max(levels, 2.0);\r
  fragColor = vec4(floor(col.rgb * lv) / lv, col.a);\r
}\r
`,M=`void main() {\r
  vec2 uv = vec2(1.0 - vUv.x, vUv.y);\r
  fragColor = texture(uMain, uv);\r
}\r
`,N=`uniform float amount;\r
\r
void main() {\r
  vec2 off = vec2(amount, 0.0) / resolution;\r
  float r = texture(uMain, vUv + off).r;\r
  float g = texture(uMain, vUv).g;\r
  float b = texture(uMain, vUv - off).b;\r
  fragColor = vec4(r, g, b, 1.0);\r
}\r
`,P=`void main() {\r
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
`,F=`void main() {\r
  vec4 a = texture(uMain, vUv);\r
  vec4 b = texture(uSecond, vUv);\r
  fragColor = vec4(a.rgb * b.rgb, a.a);\r
}\r
`,I=`void main() {\r
  vec4 a = texture(uMain, vUv);\r
  vec4 b = texture(uSecond, vUv);\r
  fragColor = vec4(1.0 - (1.0 - a.rgb) * (1.0 - b.rgb), a.a);\r
}\r
`,L=`void main() {\r
  vec4 a = texture(uMain, vUv);\r
  vec4 b = texture(uSecond, vUv);\r
  vec3 low = 2.0 * a.rgb * b.rgb;\r
  vec3 high = 1.0 - 2.0 * (1.0 - a.rgb) * (1.0 - b.rgb);\r
  vec3 mixd = mix(low, high, step(0.5, a.rgb));\r
  fragColor = vec4(mixd, a.a);\r
}\r
`,ie=`void main() {\r
  vec4 a = texture(uMain, vUv);\r
  vec4 b = texture(uSecond, vUv);\r
  fragColor = vec4(abs(a.rgb - b.rgb), a.a);\r
}\r
`,ae=`uniform float amount;\r
\r
void main() {\r
  vec4 a = texture(uMain, vUv);\r
  vec4 b = texture(uSecond, vUv);\r
  fragColor = vec4(clamp(a.rgb + b.rgb * amount, 0.0, 1.0), a.a);\r
}\r
`,oe=`/** Use uSecond luminance as a soft mask over uMain. */\r
uniform float invertMask;\r
\r
void main() {\r
  vec4 a = texture(uMain, vUv);\r
  vec4 b = texture(uSecond, vUv);\r
  float m = b.r * 0.3 + b.g * 0.59 + b.b * 0.11;\r
  m = mix(m, 1.0 - m, invertMask);\r
  fragColor = vec4(a.rgb * m, a.a);\r
}\r
`,se=`/** Weighted mix of three inputs. */\r
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
`,R=`void main() {
  fragColor = texture(uMain, vUv);
}`,ce=class{gl;canvas;programs;pool;quad;sourceTextures=new Map;delayPairs=new Map;mainTexture=null;width;height;constructor(e,t,n){this.gl=e,this.canvas=t,this.width=t.width,this.height=t.height,this.programs=new a(e),this.pool=new c(e,this.width,this.height),this.quad=l(e),this.mainTexture=u(e,n)}setMainImage(e){this.mainTexture&&this.gl.deleteTexture(this.mainTexture),this.mainTexture=u(this.gl,e),this.resize(e.naturalWidth||this.canvas.width,e.naturalHeight||this.canvas.height)}resize(e,t){if(!(e===this.width&&t===this.height)){this.width=e,this.height=t,this.canvas.width=e,this.canvas.height=t,this.pool.resize(e,t);for(let e of this.delayPairs.values())this.pool.release(e.read),this.pool.release(e.write);this.delayPairs.clear()}}render(e,t){let n=this.gl,r=h(e),i=new Map,a=[],o=e=>{if(e.input===`main`){if(!this.mainTexture)throw Error(`main texture missing`);return this.mainTexture}let t=e.id,r=this.sourceTextures.get(t);return r||(r=u(n,e.input.image),this.sourceTextures.set(t,r)),r};for(let n of r){let r=e.nodes[n],s=n===e.output;if(r.kind===`source`){let e=o(r);i.set(n,e),s&&this.drawPass({shader:R,uniforms:{},textures:[e],target:null,flipY:-1,frame:t});continue}if(r.kind===`delay`){let e=this.delayPairs.get(n);e||(e={read:this.pool.acquire(),write:this.pool.acquire()},this.delayPairs.set(n,e));let a=i.get(r.input);if(!a)throw Error(`delay "${n}" missing input`);this.drawPass({shader:R,uniforms:{},textures:[a],target:e.write,flipY:1,frame:t}),i.set(n,e.read.texture),s&&this.drawPass({shader:R,uniforms:{},textures:[e.read.texture],target:null,flipY:-1,frame:t});let o=e.read;e.read=e.write,e.write=o;continue}let c=s?null:this.pool.acquire();if(c&&a.push(c),r.kind===`pass`){let e=i.get(r.input);if(!e)throw Error(`pass "${n}" missing input`);this.drawPass({shader:r.shader,uniforms:{...r.uniforms,...t.globalUniforms},textures:[e],target:c,flipY:s?-1:1,frame:t}),!s&&c&&i.set(n,c.texture);continue}if(r.kind===`blend`){let e=r.inputs.map(e=>{let t=i.get(e);if(!t)throw Error(`blend "${n}" missing input "${e}"`);return t});this.drawPass({shader:r.shader,uniforms:{...r.uniforms,...t.globalUniforms},textures:e,target:c,flipY:s?-1:1,frame:t}),!s&&c&&i.set(n,c.texture)}}for(let e of a)this.pool.release(e)}drawPass(n){let r=this.gl,i=this.programs.get(n.shader);r.useProgram(i.program),n.target?r.bindFramebuffer(r.FRAMEBUFFER,n.target.framebuffer):r.bindFramebuffer(r.FRAMEBUFFER,null),r.viewport(0,0,this.width,this.height),i.locations.uFlipY&&r.uniform1f(i.locations.uFlipY,n.flipY),i.locations.time&&r.uniform1f(i.locations.time,n.frame.time),i.locations.resolution&&r.uniform2f(i.locations.resolution,this.width,this.height),i.locations.mouse&&r.uniform2f(i.locations.mouse,n.frame.mouse[0],n.frame.mouse[1]),i.locations.isHover&&r.uniform1i(i.locations.isHover,+!!n.frame.isHover);for(let[a,o]of Object.entries(n.uniforms)){let n=this.programs.customLocation(i,a);n&&t(r,n,e(o))}let a=[i.locations.uMain,i.locations.uSecond,i.locations.uThird,i.locations.uFourth];for(let e=0;e<n.textures.length;e++){r.activeTexture(r.TEXTURE0+e),r.bindTexture(r.TEXTURE_2D,n.textures[e]);let t=a[e];t&&r.uniform1i(t,e)}r.bindVertexArray(this.quad.vao),r.drawArrays(r.TRIANGLES,0,6),r.bindVertexArray(null),r.bindTexture(r.TEXTURE_2D,null),r.bindFramebuffer(r.FRAMEBUFFER,null)}dispose(){let e=this.gl;this.programs.dispose(),this.pool.clear(),this.quad.dispose(),this.mainTexture&&e.deleteTexture(this.mainTexture);for(let t of this.sourceTextures.values())e.deleteTexture(t);this.sourceTextures.clear(),this.delayPairs.clear()}};function le(e){switch(e){case`image/png`:return`png`;case`image/jpeg`:return`jpg`;case`image/webp`:return`webp`;default:return e}}function ue(e,t=`image/png`){let n=le(t),r=e.trim()||`graphim-export`;return r.toLowerCase().endsWith(`.${n}`)?r:`${r}.${n}`}function de(e,t){let n=URL.createObjectURL(e),r=document.createElement(`a`);r.href=n,r.download=t,r.rel=`noopener`,r.click(),URL.revokeObjectURL(n)}function fe(e){let{image:t}=e,n=document.createElement(`canvas`);d(t,n),t.after(n),t.style.display=`none`;let r=n.getContext(`webgl2`,{preserveDrawingBuffer:!0,alpha:!0,premultipliedAlpha:!0});if(!r)throw n.remove(),t.style.removeProperty(`display`),Error(`WebGL2 is required but not available in this browser`);let i=new ce(r,n,t),a=null,o={},s=!1,c=0,l=0,u=[0,0],f=!1,p=e=>{if(e instanceof TouchEvent){let t=n.getBoundingClientRect(),r=e.touches[0];if(!r)return;u=[(r.clientX-t.left)/Math.max(n.width,1),1-(r.clientY-t.top)/Math.max(n.height,1)]}else u=[e.offsetX/Math.max(n.width,1),1-e.offsetY/Math.max(n.height,1)]};n.addEventListener(`mouseenter`,e=>{f=!0,p(e)}),n.addEventListener(`mousemove`,p),n.addEventListener(`mouseleave`,e=>{f=!1,p(e)}),n.addEventListener(`touchstart`,e=>{f=!0,p(e)}),n.addEventListener(`touchmove`,p),n.addEventListener(`touchend`,()=>{f=!1});let m=e=>{a&&i.render(a,{time:e,mouse:u,isHover:f,globalUniforms:o})},h=()=>{if(!a)throw Error(`setGraph() before exporting`);m(c)},g=e=>e?.type??`image/png`,_={canvas:n,setGraph(e){a={nodes:{...e.nodes},output:e.output}},render(e=0){c=e,m(e)},animate(){if(s)return;s=!0,l=performance.now()/1e3;let e=()=>{if(!s)return;let t=performance.now()/1e3;c+=t-l,l=t,m(c),requestAnimationFrame(e)};requestAnimationFrame(e)},stop(){s=!1},setUniforms(e){o={...o,...e}},setImage(e){d(e,n),i.setMainImage(e)},setSize(e,t){if(!Number.isFinite(e)||!Number.isFinite(t)||e<=0||t<=0)throw Error(`width and height must be positive finite numbers`);i.resize(Math.floor(e),Math.floor(t))},toDataURL(e){h();let t=g(e);return t===`image/png`?n.toDataURL(t):n.toDataURL(t,e?.quality??.92)},toBlob(e){h();let t=g(e),r=e?.quality??.92;return new Promise((e,i)=>{n.toBlob(t=>{if(!t){i(Error(`canvas.toBlob returned null`));return}e(t)},t,t===`image/png`?void 0:r)})},async download(e){let t=g(e);de(await _.toBlob(e),ue(e?.fileName??`graphim-export`,t))},dispose(){s=!1,i.dispose(),n.remove(),t.style.removeProperty(`display`)}};return _}var pe={mount:fe};function me(e){return C(y(T,e),`Gray`)}function he(e){return C(y(E,e),`Sepia`)}function ge(e){return C(y(te,e),`Negative`)}function _e(e,t=5){return C(y(D,e,{strength:t}),`Blur`)}function ve(e,t={}){return C(y(ne,e,{threshold:t.threshold??.5,strength:t.strength??2,blur:t.blur??1}),`Bloom`)}function ye(e,t=5){return C(y(O,e,{blockSize:t}),`Pixel`)}function be(e,t=1){return C(y(A,e,{amount:t}),`Vignette`)}function xe(e,t={}){return C(y(j,e,{contrast:t.contrast??1.4,brightness:t.brightness??0}),`Contrast`)}function Se(e,t=6){return C(y(re,e,{levels:t}),`Posterize`)}function Ce(e){return C(y(M,e),`Mirror`)}function we(e,t=4){return C(y(N,e,{amount:t}),`Chromatic`)}function Te(e){return C(y(P,e),`Edge`)}function Ee(e,t,n=.5){return C(x(e,t,{shader:k,uniforms:{blend:n}}),`Mix`)}function De(e,t){return C(x(e,t,{shader:F,uniforms:{}}),`Multiply`)}function Oe(e,t){return C(x(e,t,{shader:I,uniforms:{}}),`Screen`)}function ke(e,t){return C(x(e,t,{shader:L,uniforms:{}}),`Overlay`)}function Ae(e,t){return C(x(e,t,{shader:ie,uniforms:{}}),`Difference`)}function je(e,t,n=1){return C(x(e,t,{shader:ae,uniforms:{amount:n}}),`Add`)}function Me(e,t,n=0){return C(x(e,t,{shader:oe,uniforms:{invertMask:n}}),`Mask`)}function Ne(e,t,n,r=[1,1,1]){return C(b([e,t,n],{shader:se,uniforms:{weights:[...r]}}),`Triple mix`)}var Pe=`data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='960'%20height='640'%20viewBox='0%200%20960%20640'%3e%3cdefs%3e%3clinearGradient%20id='sky'%20x1='0'%20y1='0'%20x2='1'%20y2='1'%3e%3cstop%20offset='0'%20stop-color='%23243b73'/%3e%3cstop%20offset='.52'%20stop-color='%23b65f8d'/%3e%3cstop%20offset='1'%20stop-color='%23f6b66c'/%3e%3c/linearGradient%3e%3clinearGradient%20id='water'%20x1='0'%20y1='0'%20x2='0'%20y2='1'%3e%3cstop%20stop-color='%23374f76'/%3e%3cstop%20offset='1'%20stop-color='%23111726'/%3e%3c/linearGradient%3e%3cradialGradient%20id='sun'%3e%3cstop%20stop-color='%23fff5cf'/%3e%3cstop%20offset='.35'%20stop-color='%23ffc679'/%3e%3cstop%20offset='1'%20stop-color='%23ff8e75'/%3e%3c/radialGradient%3e%3c/defs%3e%3crect%20width='960'%20height='420'%20fill='url(%23sky)'/%3e%3ccircle%20cx='696'%20cy='214'%20r='78'%20fill='url(%23sun)'/%3e%3cpath%20d='M0%20380%20125%20242l94%2094%20124-189%20112%20177%20117-98%20139%20154Z'%20fill='%23253251'/%3e%3cpath%20d='m0%20402%20173-117%2097%20102%20127-82%20124%20102%20172-138%20267%20133Z'%20fill='%23182238'/%3e%3crect%20y='402'%20width='960'%20height='238'%20fill='url(%23water)'/%3e%3cg%20fill='none'%20stroke-linecap='round'%3e%3cpath%20d='M510%20463q130%2020%20300-2'%20stroke='%23f7b790'%20stroke-width='10'%20opacity='.65'/%3e%3cpath%20d='M408%20506q167%2020%20430-4'%20stroke='%23d58ca2'%20stroke-width='7'%20opacity='.44'/%3e%3cpath%20d='M220%20559q232%2018%20568-6'%20stroke='%237e7fa6'%20stroke-width='5'%20opacity='.38'/%3e%3c/g%3e%3cg%20fill='%23101727'%3e%3cpath%20d='m132%20458%2065-89%2072%2089Z'/%3e%3crect%20x='191'%20y='432'%20width='16'%20height='90'/%3e%3cpath%20d='m764%20435%2052-74%2058%2074Z'/%3e%3crect%20x='811'%20y='420'%20width='13'%20height='70'/%3e%3c/g%3e%3c/svg%3e`;function Fe(e){return Object.values(e.nodes).some(e=>e.kind===`delay`?!0:e.kind!==`pass`&&e.kind!==`blend`?!1:/\btime\b/.test(Ie(e.shader)))}function Ie(e){return e.replace(/\/\*[\s\S]*?\*\//g,``).replace(/\/\/.*$/gm,``)}var z={width:960,height:640},B=8192,Le=(e,t,n,r,i,a)=>({defaults:{[e]:n},parameters:[{key:e,label:t,type:`number`,min:r,max:i,step:a}]}),V={source:{kind:`source`,title:`Image source`,category:`Input`,inputLabels:[],defaults:{assetId:`builtin:main`,assetName:`Sample image`},parameters:[]},gray:H(`gray`,`Gray`),sepia:H(`sepia`,`Sepia`),negative:H(`negative`,`Negative`),blur:U(`blur`,`Blur`,`strength`,`Strength`,6,0,24,.5),bloom:{kind:`bloom`,title:`Bloom`,category:`Effect`,inputLabels:[`image`],defaults:{threshold:.45,strength:2.2,blur:1.2},parameters:[{key:`threshold`,label:`Threshold`,type:`number`,min:0,max:1,step:.01},{key:`strength`,label:`Strength`,type:`number`,min:0,max:6,step:.1},{key:`blur`,label:`Radius`,type:`number`,min:0,max:8,step:.1}]},pixel:U(`pixel`,`Pixel`,`blockSize`,`Block size`,8,2,64,1),vignette:U(`vignette`,`Vignette`,`amount`,`Amount`,1,0,3,.05),contrast:{kind:`contrast`,title:`Contrast`,category:`Effect`,inputLabels:[`image`],defaults:{contrast:1.3,brightness:0},parameters:[{key:`contrast`,label:`Contrast`,type:`number`,min:0,max:3,step:.05},{key:`brightness`,label:`Brightness`,type:`number`,min:-1,max:1,step:.02}]},posterize:U(`posterize`,`Posterize`,`levels`,`Levels`,6,2,32,1),mirror:H(`mirror`,`Mirror`),chromatic:U(`chromatic`,`Chromatic`,`amount`,`Pixels`,4,0,32,.5),edge:H(`edge`,`Edge`),custom:{kind:`custom`,title:`Custom shader`,category:`Effect`,inputLabels:[`image`],defaults:{shader:`uniform float strength;
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
  fragColor = vec4(r, g, b, 1.0);
}`,uniforms:`{"strength": 2.0}`},parameters:[{key:`shader`,label:`Fragment shader`,type:`textarea`},{key:`uniforms`,label:`Uniforms JSON`,type:`textarea`}]},mix:W(`mix`,`Mix`,[`a`,`b`],{amount:.5},[{key:`amount`,label:`Amount`,type:`number`,min:0,max:1,step:.01}]),multiply:W(`multiply`,`Multiply`,[`a`,`b`]),screen:W(`screen`,`Screen`,[`a`,`b`]),overlay:W(`overlay`,`Overlay`,[`a`,`b`]),difference:W(`difference`,`Difference`,[`a`,`b`]),add:W(`add`,`Add`,[`a`,`b`],{amount:.5},[{key:`amount`,label:`Amount`,type:`number`,min:0,max:2,step:.05}]),mask:W(`mask`,`Mask`,[`image`,`mask`],{invertMask:0},[{key:`invertMask`,label:`Invert`,type:`select`,options:[{value:`0`,label:`No`},{value:`1`,label:`Yes`}]}]),tripleMix:W(`tripleMix`,`Triple mix`,[`a`,`b`,`c`],{weightA:.4,weightB:.35,weightC:.25},[{key:`weightA`,label:`Weight A`,type:`number`,min:0,max:1,step:.05},{key:`weightB`,label:`Weight B`,type:`number`,min:0,max:1,step:.05},{key:`weightC`,label:`Weight C`,type:`number`,min:0,max:1,step:.05}]),delay:{kind:`delay`,title:`Delay`,category:`Timing`,inputLabels:[`image`],defaults:{},parameters:[]},output:{kind:`output`,title:`Output`,category:`Output`,inputLabels:[`image`],defaults:{},parameters:[]}};function H(e,t){return{kind:e,title:t,category:`Effect`,inputLabels:[`image`],defaults:{},parameters:[]}}function U(e,t,n,r,i,a,o,s){return{kind:e,title:t,category:`Effect`,inputLabels:[`image`],...Le(n,r,i,a,o,s)}}function W(e,t,n,r={},i=[]){return{kind:e,title:t,category:`Compose`,inputLabels:n,defaults:r,parameters:i}}var Re=0;function ze(e,t,n){Re+=1;let r=V[e];return{id:`${e}-${Re}`,kind:e,x:t,y:n,inputs:r.inputLabels.map(()=>null),params:{...r.defaults}}}function G(e){if(e.kind!==`source`)throw Error(`sourceAssetId expects a source node`);return typeof e.params.assetId==`string`?e.params.assetId:e.params.mode===`mask`?`builtin:mask`:`builtin:main`}function K(e){if(e.kind!==`source`)throw Error(`sourceAssetName expects a source node`);let t=G(e);return t===`builtin:main`?`Sample image`:t===`builtin:mask`?`Radial mask`:typeof e.params.assetName==`string`?e.params.assetName:`Image source`}function Be(e){let t=[];e.version!==1&&t.push({message:`Unsupported document version: ${e.version}`}),(!Number.isInteger(e.width)||!Number.isInteger(e.height)||e.width<1||e.height<1||e.width>8192||e.height>8192)&&t.push({message:`Project size must be 1–${B} pixels per dimension`});let n=new Map;for(let r of e.nodes){n.has(r.id)&&t.push({nodeId:r.id,message:`Duplicate node id: ${r.id}`}),n.set(r.id,r);let e=V[r.kind];if(!e){t.push({nodeId:r.id,message:`Unknown node kind: ${String(r.kind)}`});continue}r.inputs.length!==e.inputLabels.length&&t.push({nodeId:r.id,message:`${e.title} expects ${e.inputLabels.length} inputs`})}let r=n.get(e.outputId);(!r||r.kind!==`output`)&&t.push({message:`The document outputId must reference an Output node`});for(let r of e.nodes)r.inputs.forEach((e,i)=>{let a=V[r.kind]?.inputLabels[i]??`input ${i+1}`;e?n.has(e)?e===r.id&&t.push({nodeId:r.id,message:`A node cannot connect to itself`}):t.push({nodeId:r.id,message:`Missing input node: ${e}`}):t.push({nodeId:r.id,message:`Connect required input “${a}”`})});let i=new Map,a=e=>{if(i.get(e.id)===`visiting`){t.push({nodeId:e.id,message:`Cycle detected`});return}if(i.get(e.id)!==`done`){i.set(e.id,`visiting`);for(let t of e.inputs){let e=t?n.get(t):void 0;e&&a(e)}i.set(e.id,`done`)}};return r&&a(r),Ve(t)}function Ve(e){let t=new Set;return e.filter(e=>{let n=`${e.nodeId??``}:${e.message}`;return t.has(n)?!1:(t.add(n),!0)})}function He(e,t,n={}){let r=new Map(e.nodes.map(e=>[e.id,e])),i=new Map,a=new Set,o=e=>{let t=i.get(e);if(t)return t;let s=r.get(e);if(!s)throw Error(`Unknown node: ${e}`);if(a.has(e))throw Error(`Cycle detected at ${e}`);a.add(e);let c=Ue(s,s.inputs.map((e,t)=>{if(!e)throw Error(`Connect required input ${t+1} on ${s.id}`);return o(e)}),n);return a.delete(e),i.set(e,c),c};return o(t)}function Ue(e,t,n){let r=t=>Number(e.params[t]);switch(e.kind){case`source`:{if(n.resolveSource){let t=n.resolveSource(e);if(!t)throw Error(`Image asset is unavailable: ${String(e.params.assetName??e.id)}`);return C(ee(t),K(e))}let t=G(e)===`builtin:mask`?`mask`:`main`,r=n.sources?.[t];if(!r)throw Error(`No ${t} image is available`);return C(ee(r),t===`main`?`Main image`:`Radial mask`)}case`gray`:return me(t[0]);case`sepia`:return he(t[0]);case`negative`:return ge(t[0]);case`blur`:return _e(t[0],r(`strength`));case`bloom`:return ve(t[0],{threshold:r(`threshold`),strength:r(`strength`),blur:r(`blur`)});case`pixel`:return ye(t[0],r(`blockSize`));case`vignette`:return be(t[0],r(`amount`));case`contrast`:return xe(t[0],{contrast:r(`contrast`),brightness:r(`brightness`)});case`posterize`:return Se(t[0],r(`levels`));case`mirror`:return Ce(t[0]);case`chromatic`:return we(t[0],r(`amount`));case`edge`:return Te(t[0]);case`custom`:return C(y(String(e.params.shader),t[0],We(String(e.params.uniforms))),`Custom shader`);case`mix`:return Ee(t[0],t[1],r(`amount`));case`multiply`:return De(t[0],t[1]);case`screen`:return Oe(t[0],t[1]);case`overlay`:return ke(t[0],t[1]);case`difference`:return Ae(t[0],t[1]);case`add`:return je(t[0],t[1],r(`amount`));case`mask`:return Me(t[0],t[1],r(`invertMask`));case`tripleMix`:return Ne(t[0],t[1],t[2],[r(`weightA`),r(`weightB`),r(`weightC`)]);case`delay`:return S(t[0]);case`output`:return t[0]}}function We(e){let t;try{t=JSON.parse(e)}catch{throw Error(`Custom shader uniforms must be valid JSON`)}if(!t||Array.isArray(t)||typeof t!=`object`)throw Error(`Custom shader uniforms must be a JSON object`);for(let e of Object.values(t))if(typeof e!=`number`&&!(Array.isArray(e)&&e.every(e=>typeof e==`number`)))throw Error(`Uniform values must be numbers or number arrays`);return t}var q=`graphim-editor:document:v1`;function J(e){return JSON.stringify(e,null,2)}function Ge(e){let t=JSON.parse(e);if(!Je(t)||t.version!==1||!Array.isArray(t.nodes))throw Error(`Not a Graphim Editor v1 document`);if(typeof t.name!=`string`||typeof t.outputId!=`string`)throw Error(`Document name or output is invalid`);let n=t.nodes.map(qe);return{version:1,name:t.name,width:Ke(t.width,z.width,`width`),height:Ke(t.height,z.height,`height`),outputId:t.outputId,nodes:n}}function Ke(e,t,n){if(e===void 0)return t;if(typeof e!=`number`||!Number.isInteger(e)||e<1||e>8192)throw Error(`Project ${n} must be an integer from 1 to ${B}`);return e}function qe(e){if(!Je(e))throw Error(`Invalid node`);let t=e.kind;if(typeof t!=`string`||!(t in V))throw Error(`Unknown node kind: ${String(t)}`);if(typeof e.id!=`string`||typeof e.x!=`number`||typeof e.y!=`number`||!Array.isArray(e.inputs)||!e.inputs.every(e=>e===null||typeof e==`string`)||!Je(e.params))throw Error(`Invalid ${t} node`);let n={};for(let[t,r]of Object.entries(e.params)){if(typeof r!=`number`&&typeof r!=`string`)throw Error(`Invalid parameter ${t}`);n[t]=r}return{id:e.id,kind:t,x:e.x,y:e.y,inputs:e.inputs,params:n}}function Je(e){return typeof e==`object`&&!!e&&!Array.isArray(e)}var Y=[{id:`prismatic-flow`,label:`Prismatic flow`,description:`time uniform で連続変化するカスタムシェーダーです。`,create:()=>X(`Prismatic flow`,[{key:`source`,kind:`source`,x:100,y:235},{key:`flow`,kind:`custom`,x:410,y:235,inputs:[`source`]},{key:`output`,kind:`output`,x:730,y:235,inputs:[`flow`]}])},{id:`bloom-split`,label:`Bloom split`,description:`1つの画像を2枝へ分岐し、BloomとVignetteをMixします。`,create:()=>X(`Bloom split`,[{key:`source`,kind:`source`,x:60,y:235},{key:`bloom`,kind:`bloom`,x:330,y:120,inputs:[`source`]},{key:`vignette`,kind:`vignette`,x:330,y:350,inputs:[`source`]},{key:`mix`,kind:`mix`,x:620,y:235,inputs:[`bloom`,`vignette`]},{key:`output`,kind:`output`,x:900,y:235,inputs:[`mix`]}])},{id:`masked-color`,label:`Masked color`,description:`加工画像とラジアルマスクを合成します。`,create:()=>X(`Masked color`,[{key:`source`,kind:`source`,x:50,y:140},{key:`maskSource`,kind:`source`,x:330,y:390,params:{assetId:`builtin:mask`,assetName:`Radial mask`}},{key:`chromatic`,kind:`chromatic`,x:330,y:110,inputs:[`source`]},{key:`mask`,kind:`mask`,x:630,y:225,inputs:[`chromatic`,`maskSource`]},{key:`output`,kind:`output`,x:910,y:225,inputs:[`mask`]}])},{id:`three-look`,label:`Three-look mix`,description:`3つの色調を明示的に合流させる複合DAGです。`,create:()=>X(`Three-look mix`,[{key:`source`,kind:`source`,x:40,y:260},{key:`sepia`,kind:`sepia`,x:300,y:70,inputs:[`source`]},{key:`gray`,kind:`gray`,x:300,y:260,inputs:[`source`]},{key:`negative`,kind:`negative`,x:300,y:450,inputs:[`source`]},{key:`mix`,kind:`tripleMix`,x:610,y:260,inputs:[`sepia`,`gray`,`negative`]},{key:`output`,kind:`output`,x:900,y:260,inputs:[`mix`]}])}];function X(e,t){let n=new Map,r=t.map(e=>{let t=ze(e.kind,e.x,e.y);return n.set(e.key,t.id),{...t,params:{...t.params,...e.params}}});t.forEach((e,t)=>{r[t].inputs=(e.inputs??[]).map(e=>{let t=n.get(e);if(!t)throw Error(`Preset references unknown node: ${e}`);return t})});let i=t.findIndex(e=>e.kind===`output`);return{version:1,name:e,width:z.width,height:z.height,nodes:r,outputId:r[i].id}}var Ye=`graphim-editor-assets`,Z=`images`,Xe=1;async function Ze(e){let t={id:`asset:${crypto.randomUUID()}`,name:e.name,blob:e},n=await $e();return await et(n,`readwrite`,e=>e.put(t)),n.close(),t}async function Qe(e){let t=await $e(),n=await et(t,`readonly`,t=>t.get(e));return t.close(),n??null}function $e(){return new Promise((e,t)=>{let n=indexedDB.open(Ye,Xe);n.onupgradeneeded=()=>{let e=n.result;e.objectStoreNames.contains(Z)||e.createObjectStore(Z,{keyPath:`id`})},n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error??Error(`Could not open image storage`))})}function et(e,t,n){return new Promise((r,i)=>{let a=e.transaction(Z,t),o=n(a.objectStore(Z));o.onsuccess=()=>r(o.result),o.onerror=()=>i(o.error??Error(`Image storage failed`)),a.onabort=()=>i(a.error??Error(`Image storage aborted`))})}function tt(e=640){let t=document.createElement(`canvas`);t.width=e,t.height=e;let n=t.getContext(`2d`);if(!n)return Promise.reject(Error(`2D canvas is unavailable`));let r=n.createRadialGradient(e/2,e/2,e*.08,e/2,e/2,e*.58);r.addColorStop(0,`#fff`),r.addColorStop(.7,`#777`),r.addColorStop(1,`#000`),n.fillStyle=r,n.fillRect(0,0,e,e);let i=new Image;return new Promise((e,n)=>{i.onload=()=>e(i),i.onerror=()=>n(Error(`Mask image failed to load`)),i.src=t.toDataURL()})}function nt(e){let t={document:at()??Y[0].create(),selectedId:null,pendingConnection:null},n=null,r=null,i=null,a=0,o=null,s=new Map;e.innerHTML=`
    <div class="app-shell">
      <header class="topbar">
        <div class="brand">
          <a href="../" class="portal-link">← Portal</a>
          <div><h1>Graphim Node Editor</h1><p>WebGL2 effect DAG designer</p></div>
        </div>
        <div class="topbar__actions">
          <label class="project-size" title="Project output size">
            <input id="project-width" type="number" min="1" max="${B}" aria-label="Project width" />
            <span>×</span>
            <input id="project-height" type="number" min="1" max="${B}" aria-label="Project height" />
            <span>px</span>
          </label>
          <select id="preset" aria-label="Preset"></select>
          <button id="new-project" class="button button--quiet" type="button">Reset</button>
          <button id="save-project" class="button button--quiet" type="button">Save JSON</button>
          <button id="load-project" class="button button--quiet" type="button">Load JSON</button>
          <button id="export-image" class="button" type="button">Export image</button>
          <input id="project-file" type="file" accept="application/json,.json" hidden />
          <input id="source-asset-file" type="file" accept="image/*" hidden />
        </div>
      </header>
      <main class="editor">
        <aside class="palette panel">
          <div class="panel__heading"><span>Nodes</span><small>click to add</small></div>
          <div id="palette-list"></div>
        </aside>
        <section class="workspace-panel">
          <div class="workspace-toolbar">
            <span id="connection-hint">Select an output port, then an input port</span>
            <button id="clear-wire" class="text-button" type="button" hidden>Cancel connection</button>
          </div>
          <div id="graph-scroll" class="graph-scroll">
            <div id="workspace" class="workspace">
              <svg id="wires" class="wires" aria-hidden="true"></svg>
              <div id="nodes" class="nodes"></div>
            </div>
          </div>
        </section>
        <aside class="inspector panel">
          <div class="panel__heading"><span>Inspector</span></div>
          <div id="inspector-content" class="inspector-content"></div>
          <section class="preview">
            <div class="preview__heading">
              <span>Final output</span>
            </div>
            <div class="preview__stage">
              <img id="final-preview-source" src="${Pe}" alt="Final Graphim output source" />
            </div>
            <p id="final-status" class="status" aria-live="polite">Loading WebGL2…</p>
          </section>
          <section class="preview preview--node is-idle">
            <div class="preview__heading">
              <span id="node-preview-title">Node output</span>
            </div>
            <div class="preview__stage">
              <img id="node-preview-source" src="${Pe}" alt="Selected node output source" />
            </div>
            <p id="node-status" class="status" aria-live="polite">Select a node</p>
          </section>
        </aside>
      </main>
    </div>
  `;let c=Q(e,`#palette-list`),l=Q(e,`#nodes`),u=Q(e,`#wires`),d=Q(e,`#workspace`),f=Q(e,`#graph-scroll`),p=Q(e,`#inspector-content`),m=Q(e,`#final-status`),h=Q(e,`#node-status`),g=Q(e,`#node-preview-title`),_=Q(e,`#final-preview-source`),v=Q(e,`#node-preview-source`),ee=Q(e,`.preview--node`),y=Q(e,`#preset`),b=Q(e,`#clear-wire`),x=Q(e,`#connection-hint`),S=Q(e,`#project-file`),C=Q(e,`#source-asset-file`),w=Q(e,`#project-width`),T=Q(e,`#project-height`),E=()=>{w.value=String(t.document.width),T.value=String(t.document.height)},te=()=>{let e=Number(w.value),n=Number(T.value);if(!Number.isInteger(e)||!Number.isInteger(n)||e<1||n<1||e>8192||n>8192){E(),$(m,`Size must be 1–${B} pixels per dimension`,!0);return}t.document.width=e,t.document.height=n,M()};w.addEventListener(`change`,te),T.addEventListener(`change`,te),E(),rt(c,e=>{let n=ze(e,Math.max(40,f.scrollLeft+100),Math.max(40,f.scrollTop+100));t.document.nodes.push(n),t.selectedId=n.id,M()}),y.innerHTML=Y.map(e=>`<option value="${e.id}">${e.label}</option>`).join(``),y.addEventListener(`change`,()=>{let e=Y.find(e=>e.id===y.value);e&&(t.document=e.create(),t.selectedId=null,t.pendingConnection=null,E(),M())}),e.querySelector(`#new-project`)?.addEventListener(`click`,()=>{t.document=Y[0].create(),t.selectedId=null,t.pendingConnection=null,y.value=Y[0].id,E(),M()}),e.querySelector(`#save-project`)?.addEventListener(`click`,()=>{ot(`${lt(t.document.name)}.graphim.json`,J(t.document))}),e.querySelector(`#load-project`)?.addEventListener(`click`,()=>S.click()),S.addEventListener(`change`,()=>{let e=S.files?.[0];e&&(e.text().then(e=>(t.document=Ge(e),t.selectedId=null,t.pendingConnection=null,E(),L())).then(()=>{M()}).catch(e=>$(m,e,!0)),S.value=``)}),e.querySelector(`#export-image`)?.addEventListener(`click`,()=>{n&&n.download({fileName:`${lt(t.document.name)}.png`}).catch(e=>$(m,e,!0))}),b.addEventListener(`click`,()=>{t.pendingConnection=null,I(),D()}),window.addEventListener(`keydown`,e=>{e.key===`Escape`&&t.pendingConnection&&(t.pendingConnection=null,I(),D()),(e.key===`Delete`||e.key===`Backspace`)&&ft(e)&&re()}),C.addEventListener(`change`,()=>{let e=C.files?.[0],n=t.document.nodes.find(e=>e.id===o);C.value=``,o=null,!(!e||!n||n.kind!==`source`)&&Ze(e).then(async e=>{let t=await st(e.name,e.blob);s.set(e.id,t),n.params.assetId=e.id,n.params.assetName=e.name,M()}).catch(e=>$(h,e,!0))});function D(){l.replaceChildren();let e=Be(t.document),n=new Set(e.map(e=>e.nodeId).filter(Boolean));for(let e of t.document.nodes){let r=V[e.kind],i=document.createElement(`article`);i.className=[`node`,t.selectedId===e.id?`is-selected`:``,t.pendingConnection===e.id?`is-connecting`:``,n.has(e.id)?`is-invalid`:``,`node--${r.category.toLowerCase()}`].filter(Boolean).join(` `),i.dataset.nodeId=e.id,i.style.transform=`translate(${e.x}px, ${e.y}px)`;let a=document.createElement(`header`);a.className=`node__header`;let c=document.createElement(`span`);c.textContent=r.title;let u=document.createElement(`small`);if(u.textContent=e.kind,a.append(c,u),i.append(a),e.kind===`source`){let t=s.get(G(e)),n=document.createElement(`div`);if(n.className=`node__image-preview`,t){let e=document.createElement(`img`);e.src=t.url,e.alt=``,n.append(e)}else n.classList.add(`is-missing`),n.textContent=`Image unavailable`;let r=document.createElement(`span`);r.textContent=K(e),n.append(r);let a=document.createElement(`button`);a.type=`button`,a.className=`node__image-button`,a.dataset.sourcePicker=`true`,a.textContent=`Set image`,n.append(a),i.append(n)}if(r.inputLabels.forEach((t,n)=>{let r=document.createElement(`div`);r.className=`port-row port-row--input`;let a=document.createElement(`button`);a.type=`button`,a.className=`port port--input${e.inputs[n]?` is-connected`:``}`,a.dataset.inputIndex=String(n),a.ariaLabel=`Connect ${t}`,r.append(a,document.createTextNode(t)),i.append(r)}),e.kind!==`output`){let e=document.createElement(`div`);e.className=`port-row port-row--output`,e.append(document.createTextNode(`output`));let t=document.createElement(`button`);t.type=`button`,t.className=`port port--output`,t.dataset.output=`true`,t.ariaLabel=`Connect from ${r.title}`,e.append(t),i.append(e)}l.append(i),i.addEventListener(`click`,n=>{let r=n.target,i=r.dataset.inputIndex;if(r.dataset.sourcePicker){t.selectedId=e.id,o=e.id,D(),k(),P(),C.click();return}if(r.dataset.output){t.pendingConnection=e.id,t.selectedId=e.id,I(),D(),k(),P();return}if(i!==void 0){let n=Number(i);t.pendingConnection?(e.inputs[n]=t.pendingConnection,t.pendingConnection=null):e.inputs[n]=null,t.selectedId=e.id,M();return}t.selectedId=e.id,D(),k(),P()}),ne(a,e,i)}requestAnimationFrame(O)}function ne(e,n,r){e.addEventListener(`pointerdown`,i=>{if(i.button!==0)return;i.preventDefault(),t.selectedId=n.id;let a=i.clientX,o=i.clientY,s=n.x,c=n.y;e.setPointerCapture(i.pointerId);let l=e=>{n.x=Math.max(8,s+e.clientX-a),n.y=Math.max(8,c+e.clientY-o),r.style.transform=`translate(${n.x}px, ${n.y}px)`,O()},u=()=>{e.removeEventListener(`pointermove`,l),localStorage.setItem(q,J(t.document)),k(),P()};e.addEventListener(`pointermove`,l),e.addEventListener(`pointerup`,u,{once:!0}),e.addEventListener(`pointercancel`,u,{once:!0})})}function O(){let e=d.getBoundingClientRect();u.replaceChildren();for(let n of t.document.nodes)n.inputs.forEach((t,r)=>{if(!t)return;let i=l.querySelector(`[data-node-id="${dt(t)}"] [data-output]`),a=l.querySelector(`[data-node-id="${dt(n.id)}"] [data-input-index="${r}"]`);if(!i||!a)return;let o=ut(i,e),s=ut(a,e),c=Math.max(60,Math.abs(s.x-o.x)*.48),d=document.createElementNS(`http://www.w3.org/2000/svg`,`path`);d.setAttribute(`d`,`M ${o.x} ${o.y} C ${o.x+c} ${o.y}, ${s.x-c} ${s.y}, ${s.x} ${s.y}`),d.setAttribute(`class`,`wire`),u.append(d)})}function k(){p.replaceChildren();let e=t.document.nodes.find(e=>e.id===t.selectedId);if(!e){let e=document.createElement(`div`);e.className=`empty-state`,e.innerHTML=`<strong>No node selected</strong><span>Select a node to edit its inputs and parameters.</span>`,p.append(e);return}let n=V[e.kind],r=document.createElement(`div`);if(r.className=`inspector-title`,r.innerHTML=`<strong>${n.title}</strong><code>${e.id}</code>`,p.append(r),e.kind===`source`){let t=s.get(G(e)),n=document.createElement(`section`);if(n.className=`source-picker`,t){let r=document.createElement(`img`);r.src=t.url,r.alt=K(e),n.append(r)}let r=document.createElement(`span`);r.textContent=t?.name??`${K(e)} (unavailable)`,n.append(r);let i=document.createElement(`div`);i.className=`source-picker__actions`,i.append(A(`Choose file`,()=>{o=e.id,C.click()}),A(`Sample`,()=>j(e,`builtin:main`,`Sample image`)),A(`Mask`,()=>j(e,`builtin:mask`,`Radial mask`))),n.append(i),p.append(n)}n.inputLabels.forEach((n,r)=>{let i=it(n),a=document.createElement(`select`);a.innerHTML=`<option value="">Not connected</option>`;for(let n of t.document.nodes){if(n.id===e.id||n.kind===`output`)continue;let t=document.createElement(`option`);t.value=n.id,t.textContent=`${V[n.kind].title} · ${n.id}`,t.selected=n.id===e.inputs[r],a.append(t)}a.addEventListener(`change`,()=>{e.inputs[r]=a.value||null,M()}),i.append(a),p.append(i)});for(let t of n.parameters){let n=it(t.label),r=e.params[t.key],i;if(t.type===`textarea`)i=document.createElement(`textarea`),i.rows=t.key===`shader`?12:3,i.spellcheck=!1,i.value=String(r);else if(t.type===`select`){i=document.createElement(`select`);for(let e of t.options??[]){let t=document.createElement(`option`);t.value=e.value,t.textContent=e.label,t.selected=String(r)===e.value,i.append(t)}}else i=document.createElement(`input`),i.type=`number`,i.value=String(r),i.min=String(t.min),i.max=String(t.max),i.step=String(t.step);i.addEventListener(`input`,()=>{e.params[t.key]=t.type===`number`?Number(i.value):i.value,N()}),n.append(i),p.append(n)}if(e.kind!==`output`){let e=document.createElement(`button`);e.type=`button`,e.className=`button button--danger inspector-delete`,e.textContent=`Delete node`,e.addEventListener(`click`,re),p.append(e)}}function A(e,t){let n=document.createElement(`button`);return n.type=`button`,n.className=`button button--quiet`,n.textContent=e,n.addEventListener(`click`,t),n}function j(e,t,n){e.params.assetId=t,e.params.assetName=n,M()}function re(){let e=t.selectedId,n=t.document.nodes.find(t=>t.id===e);if(!(!e||!n||n.kind===`output`)){t.document.nodes=t.document.nodes.filter(t=>t.id!==e);for(let n of t.document.nodes)n.inputs=n.inputs.map(t=>t===e?null:t);t.selectedId=null,t.pendingConnection===e&&(t.pendingConnection=null),M()}}function M(){D(),k(),I(),N()}function N(){localStorage.setItem(q,J(t.document)),P()}function P(){window.clearTimeout(a),a=window.setTimeout(()=>{if(!n||!r)return;n.setSize(t.document.width,t.document.height),r.setSize(t.document.width,t.document.height);let e=t.document.nodes.find(e=>e.id===t.document.outputId),i=t.document.nodes.find(e=>e.id===t.selectedId);if(e&&F(n,e,m,`Final output`),ee.classList.toggle(`is-idle`,!i),!i){r.stop(),g.textContent=`Node output`,h.classList.remove(`is-error`),h.textContent=`Select a node`;return}g.textContent=`${V[i.kind].title} output`,F(r,i,h,V[i.kind].title)},100)}function F(e,n,r,i){try{e.stop(),e.setSize(t.document.width,t.document.height);let a=He(t.document,n.id,{resolveSource(e){let t=G(e);if(t===`builtin:main`)return`main`;let n=s.get(t);return n?{image:n.image}:void 0}});e.setGraph(a);let o=Fe(a);o?e.animate():e.render(),r.classList.remove(`is-error`),r.textContent=`${i} · ${t.document.width}×${t.document.height} · ${o?`animating`:`rendered`}`}catch(e){$(r,e,!0)}}function I(){b.hidden=!t.pendingConnection,x.textContent=t.pendingConnection?`Connecting from ${V[t.document.nodes.find(e=>e.id===t.pendingConnection)?.kind??`source`].title} — select an input port`:`Select an output port, then an input port`}async function L(){let e=new Set(t.document.nodes.filter(e=>e.kind===`source`).map(G).filter(e=>e.startsWith(`asset:`)));await Promise.all([...e].map(async e=>{if(s.has(e))return;let t=await Qe(e);t&&s.set(e,await st(t.name,t.blob))}))}let ie=async()=>{i=await tt(),s.set(`builtin:main`,{image:_,name:`Sample image`,url:Pe}),s.set(`builtin:mask`,{image:i,name:`Radial mask`,url:i.src}),await L(),n=pe.mount({image:_}),r=pe.mount({image:v}),D(),k(),P()};Promise.all([ct(_),ct(v)]).then(()=>{ie().catch(e=>{$(m,e,!0),$(h,e,!0)})}).catch(e=>{$(m,e,!0),$(h,e,!0)}),D(),k(),I(),f.addEventListener(`scroll`,O),window.addEventListener(`resize`,O)}function rt(e,t){for(let n of[`Input`,`Effect`,`Compose`,`Timing`]){let r=document.createElement(`section`);r.className=`palette-group`;let i=document.createElement(`h2`);i.textContent=n,r.append(i);for(let e of Object.values(V)){if(e.category!==n)continue;let i=document.createElement(`button`);i.type=`button`,i.className=`palette-node`,i.innerHTML=`<span>${e.title}</span><small>${e.inputLabels.length} in</small>`,i.addEventListener(`click`,()=>t(e.kind)),r.append(i)}e.append(r)}}function it(e){let t=document.createElement(`label`);t.className=`field`;let n=document.createElement(`span`);return n.textContent=e,t.append(n),t}function at(){let e=localStorage.getItem(q);if(!e)return null;try{return Ge(e)}catch{return localStorage.removeItem(q),null}}function ot(e,t){let n=URL.createObjectURL(new Blob([t],{type:`application/json`})),r=document.createElement(`a`);r.href=n,r.download=e,r.click(),URL.revokeObjectURL(n)}function st(e,t){let n=URL.createObjectURL(t),r=new Image;return new Promise((t,i)=>{r.onload=()=>t({image:r,name:e,url:n}),r.onerror=()=>{URL.revokeObjectURL(n),i(Error(`Could not load image asset: ${e}`))},r.src=n})}function ct(e){return e.complete&&e.naturalWidth>0?Promise.resolve():new Promise((t,n)=>{e.addEventListener(`load`,()=>t(),{once:!0}),e.addEventListener(`error`,()=>n(Error(`Preview source image failed to load`)),{once:!0})})}function lt(e){return e.trim().replace(/[<>:"/\\|?*\u0000-\u001f]/g,`-`).replace(/\s+/g,`-`)||`graph`}function Q(e,t){let n=e.querySelector(t);if(!n)throw Error(`${t} not found`);return n}function ut(e,t){let n=e.getBoundingClientRect();return{x:n.left+n.width/2-t.left,y:n.top+n.height/2-t.top}}function dt(e){return CSS.escape(e)}function $(e,t,n){e.classList.toggle(`is-error`,n),e.textContent=t instanceof Error?t.message:String(t)}function ft(e){let t=e.target;return!t||![`INPUT`,`TEXTAREA`,`SELECT`].includes(t.tagName)}var pt=document.querySelector(`#app`);if(!pt)throw Error(`#app not found`);nt(pt);
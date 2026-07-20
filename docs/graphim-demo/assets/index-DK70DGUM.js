(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=class e{x;constructor(e=0){this.x=e}set(e){this.x=e}equal(e){return this.x===e.x}clone(){return new e(this.x)}copy(e){this.x=e.x}setUniform(e,t){e.uniform1f(t,this.x)}},t=class e{x;y;constructor(e=0,t=0){this.x=e,this.y=t}set(t,n=0){t instanceof e?(this.x=t.x,this.y=t.y):(this.x=t,this.y=n)}length2(){return this.x**2+this.y**2}length(){return Math.sqrt(this.length2())}distance(e){return Math.sqrt((this.x-e.x)**2+(this.y-e.y)**2)}add(t){t instanceof e?(this.x+=t.x,this.y+=t.y):(this.x+=t,this.y+=t)}subtract(t){t instanceof e?(this.x-=t.x,this.y-=t.y):(this.x-=t,this.y-=t)}multiply(t){t instanceof e?(this.x*=t.x,this.y*=t.y):(this.x*=t,this.y*=t)}divide(t){t instanceof e?(console.assert(t.x!==0&&t.y!==0),this.x/=t.x,this.y/=t.y):(console.assert(t!==0),this.x/=t,this.y/=t)}normalize(){this.divide(this.length())}dot(e){return this.x*e.x+this.y*e.y}equal(e){return this.x===e.x&&this.y===e.y}clone(){return new e(this.x,this.y)}copy(e){this.x=e.x,this.y=e.y}getArray(){return new Float32Array([this.x,this.y])}setUniform(e,t){e.uniform2fv(t,this.getArray())}},n=class{valueMap={};locationMap={};gl=null;program=null;flipYLocation=-1;timeLocation=-1;aspectLocation=-1;mouseLocation=-1;isHoverLocation=-1;constructor(e={}){this.valueMap=e}addUniform(e,t){this.valueMap[e]=t,this.gl&&this.program&&(this.locationMap[e]=this.gl.getUniformLocation(this.program,e))}set(e,t){this.addUniform(e,t)}getUniform(e){return this.valueMap[e]}removeUniform(e){delete this.valueMap[e],delete this.locationMap[e]}setUniform(e,t){this.valueMap[e]=t}init(e,t){this.flipYLocation=e.getUniformLocation(t,`flipY`),this.timeLocation=e.getUniformLocation(t,`time`),this.aspectLocation=e.getUniformLocation(t,`resolution`),this.mouseLocation=e.getUniformLocation(t,`mouse`),this.isHoverLocation=e.getUniformLocation(t,`isHover`),Object.entries(this.valueMap).forEach(([n])=>{this.locationMap[n]=e.getUniformLocation(t,n)}),this.gl=e,this.program=t}render(e,n,r,i,a){e.uniform1f(this.flipYLocation,n?-1:1),e.uniform1f(this.timeLocation,r||0),e.uniform2fv(this.aspectLocation,new t(e.canvas.width,e.canvas.height).getArray()),e.uniform2fv(this.mouseLocation,new Float32Array(i||[0,0])),e.uniform1i(this.isHoverLocation,+!!a),Object.entries(this.valueMap).forEach(([t,n])=>{n.setUniform(e,this.locationMap[t])})}},r=(e,t)=>{let n=e.createBuffer();return e.bindBuffer(e.ARRAY_BUFFER,n),e.bufferData(e.ARRAY_BUFFER,new Float32Array(t),e.STATIC_DRAW),e.bindBuffer(e.ARRAY_BUFFER,null),n},i=(e,t)=>{let n=e.createBuffer();return e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n),e.bufferData(e.ELEMENT_ARRAY_BUFFER,new Int16Array(t),e.STATIC_DRAW),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,null),n},a=[-1,1,.5,-1,-1,.5,1,1,.5,1,-1,.5],o=[0,1,2,1,3,2],s=[0,1,0,0,1,1,1,0],c=class{positionLocation=-1;positionVBO=null;uvLocation=-1;uvVBO=null;indexIBO=null;init(e,t){this.positionLocation=e.getAttribLocation(t,`position`),this.positionVBO=r(e,a),this.uvLocation=e.getAttribLocation(t,`uv`),this.uvVBO=r(e,s),this.indexIBO=i(e,o)}release(e){e.deleteBuffer(this.positionVBO),e.deleteBuffer(this.uvVBO),e.deleteBuffer(this.indexIBO)}render(e){e.bindBuffer(e.ARRAY_BUFFER,this.positionVBO),e.vertexAttribPointer(this.positionLocation,3,e.FLOAT,!1,0,0),e.enableVertexAttribArray(this.positionLocation),e.bindBuffer(e.ARRAY_BUFFER,this.uvVBO),e.enableVertexAttribArray(this.uvLocation),e.vertexAttribPointer(this.uvLocation,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,this.indexIBO)}},l=(e,t,n)=>{if(e.shaderSource(t,n),e.compileShader(t),!e.getShaderParameter(t,e.COMPILE_STATUS))throw console.error(n),Error(e.getShaderInfoLog(t))},u=(e,t,n,r)=>{e.attachShader(t,n),e.attachShader(t,r),e.linkProgram(t)},d=(e,t,n)=>{e.bindFramebuffer(e.FRAMEBUFFER,t),e.bindTexture(e.TEXTURE_2D,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.canvas.width,e.canvas.height,0,e.RGBA,e.UNSIGNED_BYTE,null),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,n,0),e.bindTexture(e.TEXTURE_2D,null),e.bindFramebuffer(e.FRAMEBUFFER,null)},f=(e,t,n)=>{e.bindTexture(e.TEXTURE_2D,t),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.bindTexture(e.TEXTURE_2D,null)},p=(e,t)=>{e.width=t.width,e.height=t.height,t.classList.forEach(t=>{e.classList.add(t)}),e.id=t.id,Object.entries(t.style).forEach(([t,n])=>{e.style.setProperty(t,n)}),Object.entries(t.dataset).forEach(([t,n])=>{e.setAttribute(`data-${t}`,n)})},m=`attribute vec3 position;\r
attribute vec2 uv;\r
\r
varying mediump vec4 vPosition;\r
varying mediump vec2 vUv;\r
\r
uniform float flipY;\r
\r
void main(void) {\r
  vPosition = vec4(position * vec3(1.0, flipY, 1.0), 1.0);\r
  vUv = uv;\r
\r
  gl_Position = vPosition;\r
}\r
`,h=`// default variables\r
precision mediump float;\r
varying vec4 vPosition;\r
varying vec2 vUv;\r
\r
uniform sampler2D renderTexture;\r
uniform sampler2D renderTexture2;\r
uniform float time;\r
uniform vec2 resolution;\r
uniform vec2 mouse;\r
uniform int isHover;\r
`,g=class{initialized=``;renderResult={targetTexture:null,renderID:``};gl=null;fragmentSource=``;framebuffer=null;vertexShader=null;fragmentShader=null;program=null;quad=null;uniforms=null;inputTextureLocation=null;outputNode=[];inputNode=null;constructor(e,t){this.fragmentSource=e,this.uniforms=t||new n({})}init(e,t){this.initialized&&this.release(),this.initialized=t,this.gl=e,this.framebuffer=e.createFramebuffer(),this.renderResult.targetTexture=e.createTexture(),d(e,this.framebuffer,this.renderResult.targetTexture),this.vertexShader=e.createShader(e.VERTEX_SHADER),this.fragmentShader=e.createShader(e.FRAGMENT_SHADER),l(e,this.vertexShader,m),l(e,this.fragmentShader,`${h}\n${this.fragmentSource}`),this.program=e.createProgram(),u(e,this.program,this.vertexShader,this.fragmentShader),this.quad=new c,this.quad.init(e,this.program),this.uniforms?.init(this.gl,this.program),this.inputTextureLocation=e.getUniformLocation(this.program,`targetTexture`)}release(){this.initialized&&=(this.gl?.deleteFramebuffer(this.framebuffer),this.gl?.deleteTexture(this.renderResult.targetTexture),this.gl?.deleteShader(this.vertexShader),this.gl?.deleteShader(this.fragmentShader),this.gl?.deleteProgram(this.program),this.quad?.release(this.gl),``)}getRenderResult(){return this.renderResult}removeOutputNode(e){this.outputNode=this.outputNode.filter(t=>t!==e),this.outputNode.length===0&&this.release()}setOutputNode(e){this.outputNode.push(e)}},_=`void main() {\r
  gl_FragColor = texture2D(renderTexture, vUv);\r
}\r
`,v=class extends g{constructor(){super(_)}init(e,t){}release(){}render(e){this.renderResult.targetTexture=e.inputTexture,this.renderResult.renderID=e.renderID,e.renderToCanvas&&console.warn(`DefaultInput cannot be destination node.`)}},y=class extends g{connect(e){this.inputNode?.removeOutputNode(this),this.inputNode=e,this.inputNode.setOutputNode(this)}disconnect(){this.inputNode?.removeOutputNode(this),this.inputNode=null}release(){super.release(),this.inputNode?.release()}},b=class extends y{init(e,t){super.init(e,t)}getInitializedUUID(){return this.initialized}setShader(e,t){if(!this.gl||!this.program||!this.vertexShader||!this.fragmentShader){console.warn(`filter is not initialized.`);return}this.fragmentSource=e,l(this.gl,this.fragmentShader,`${h}\n${this.fragmentSource}`),this.gl.linkProgram(this.program),t&&(this.uniforms=t),this.uniforms?.init(this.gl,this.program)}render(e){if((!this.gl||!this.initialized||e.canvasID!==this.initialized)&&(this.init(e.gl,e.canvasID),!this.gl))throw Error(`gl is not initialized`);if(this.renderResult.renderID===e.renderID)return;this.renderResult.renderID=e.renderID;let{renderToCanvas:t}=e;e.renderToCanvas=!1,this.inputNode?.render(e);let{gl:n}=this,{time:r,mouse:i,isHover:a}=e,{targetTexture:o}=this.inputNode.getRenderResult();t?n.bindFramebuffer(n.FRAMEBUFFER,null):(n.bindFramebuffer(n.FRAMEBUFFER,this.framebuffer),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,this.renderResult.targetTexture,0)),n.useProgram(this.program),this.quad?.render(n),this.uniforms?.render(n,!!t,r,i,a),n.bindTexture(n.TEXTURE_2D,o),n.uniform1i(this.inputTextureLocation,0),n.clearColor(.5,.5,.5,1),n.enable(n.DEPTH_TEST),n.depthFunc(n.LEQUAL),n.clearDepth(0),n.clear(n.COLOR_BUFFER_BIT),n.viewport(0,0,n.canvas.width,n.canvas.height),n.drawElements(n.TRIANGLES,6,n.UNSIGNED_SHORT,0),n.bindTexture(n.TEXTURE_2D,null),n.flush()}},x=`void main() {\r
  vec4 col = texture2D(renderTexture, vUv);\r
  gl_FragColor = vec4(vec3(1.0) - col.rgb, col.a);\r
}\r
`,S=class extends b{constructor(){super(x)}},C=`void main() {\r
  vec4 col = texture2D(renderTexture, vUv);\r
  gl_FragColor = vec4(\r
    col.r * 0.393 + col.g * 0.769 + col.b * 0.189,\r
    col.r * 0.349 + col.g * 0.686 + col.b * 0.168,\r
    col.r * 0.272 + col.g * 0.534 + col.b * 0.131,\r
    col.a);\r
}\r
`,w=class extends b{constructor(){super(C)}},T=`void main() {\r
  vec4 col = texture2D(renderTexture, vUv);\r
  float gray = col.r * 0.3 + col.g * 0.59 + col.b * 0.11;\r
  gl_FragColor = vec4(gray, gray, gray, col.a);\r
}\r
`,E=class extends b{constructor(){super(T)}},D=`uniform float threshold;\r
uniform float strength;\r
uniform float blur;\r
\r
\r
float getBrightness(vec3 col) {\r
  return max(col.r, max(col.g, col.b));\r
}\r
\r
vec4 getOriginalTex(vec2 uv) {\r
  return texture2D(renderTexture, uv / resolution);\r
}\r
vec3 getTex(vec2 uv) {\r
  vec4 col = texture2D(renderTexture, uv / resolution);\r
  return getBrightness(col.rgb) > threshold ? col.rgb : vec3(0.0);\r
}\r
\r
float gauss(vec2 pos) {\r
  return -exp(-length(pos) * 2.0);\r
}\r
\r
vec3 sampleBox(vec2 center) {\r
\r
  float acc = 0.0;\r
  vec3 col = vec3(0.0);\r
\r
  for(float x = -1.0;x < 1.0;x += 0.2) {\r
    for(float y = -1.0; y < 1.0; y += 0.2) {\r
      vec2 pos = center + vec2(x, y) * blur;\r
      float g = gauss(vec2(x, y));\r
      col += getTex(pos).rgb * g;\r
      acc += g;\r
    }\r
  }\r
  return col / acc;\r
}\r
\r
void main() {\r
  vec2 pos = vUv * resolution;\r
  vec4 baseCol = getOriginalTex(pos);\r
  gl_FragColor = baseCol + vec4(sampleBox(pos), 0.0) * strength;\r
}\r
\r
`,O=class extends b{constructor(t=.5,r=2,i=1){let a={threshold:new e(t),strength:new e(r),blur:new e(i)};super(D,new n(a))}},k=`uniform float strength;\r
\r
float getBrightness(vec3 col) {\r
  return max(col.r, max(col.g, col.b));\r
}\r
\r
vec4 getTex(vec2 uv) {\r
  return texture2D(renderTexture, uv / resolution);\r
}\r
\r
float gauss(vec2 pos) {\r
  return -exp(-length(pos) * 2.0);\r
}\r
\r
vec4 sampleBox(vec2 center) {\r
\r
  float acc = 0.0;\r
  vec4 col = vec4(0);\r
\r
  for(float x = -1.0;x < 1.0;x += 0.2) {\r
    for(float y = -1.0; y < 1.0; y += 0.2) {\r
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
  gl_FragColor = sampleBox(pos);\r
}\r
\r
`,A=class extends b{constructor(t=5){let r={strength:new e(t)};super(k,new n(r))}},j=`uniform float blockSize;\r
\r
vec4 getTex(vec2 uv) {\r
  return texture2D(renderTexture, uv / resolution);\r
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
  gl_FragColor = getPixel(pos);\r
}\r
`,M=class extends b{constructor(t=5){let r={blockSize:new e(t)};super(j,new n(r))}},N=`float random (vec2 st) {\r
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);\r
}\r
\r
uniform float randomSize;\r
\r
vec4 getTex(vec2 uv) {\r
  return texture2D(renderTexture, uv / resolution);\r
}\r
\r
void main() {\r
  vec2 pos = vUv * resolution;\r
  gl_FragColor = getTex(\r
    pos + (\r
      vec2(\r
        random(vUv), random(vUv + vec2(1.0))\r
      ) * 2.0 - vec2(1.0)) * randomSize\r
    );\r
}\r
`,P=class extends b{constructor(t=3){let r={randomSize:new e(t)};super(N,new n(r))}},F=()=>typeof crypto<`u`&&typeof crypto.randomUUID==`function`?crypto.randomUUID():`graphim-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`,I=class{originalImage;image;canvas;gl;imageTexture;isAnimation=!1;accTime=0;mouse=[0,0];isHover=!1;canvasID;constructor({image:e}){this.originalImage=e,this.image=e,this.canvas=document.createElement(`canvas`),p(this.canvas,e),this.canvasID=F(),e.after(this.canvas),e.style.display=`none`,this.canvas.addEventListener(`mouseenter`,e=>{this.isHover=!0,this.handlePointer(e)}),this.canvas.addEventListener(`mousemove`,e=>{this.handlePointer(e)}),this.canvas.addEventListener(`mouseleave`,e=>{this.isHover=!1,this.handlePointer(e)}),this.canvas.addEventListener(`touchstart`,e=>{this.isHover=!0,this.handlePointer(e)}),this.canvas.addEventListener(`touchmove`,e=>{this.handlePointer(e)}),this.canvas.addEventListener(`touchend`,e=>{this.isHover=!1,this.handlePointer(e)}),this.gl=this.canvas.getContext(`webgl`),this.isAnimation=!1,this.imageTexture=this.gl.createTexture(),f(this.gl,this.imageTexture,this.image)}handlePointer(e){if(e instanceof TouchEvent){let t=e.target.getBoundingClientRect();this.mouse=[(e.touches[0].clientX-window.pageXOffset-t.left)/this.canvas.width,(e.touches[0].clientX-window.pageXOffset-t.left)/this.canvas.height]}else this.mouse=[e.offsetX/this.canvas.width,e.offsetY/this.canvas.height]}setImage(e){this.image=e,this.originalImage.src=e.src,this.originalImage.width=e.width,this.originalImage.height=e.height,this.canvas.width=e.width,this.canvas.height=e.height,f(this.gl,this.imageTexture,this.image)}release(){this.gl.deleteTexture(this.imageTexture),this.image.style.removeProperty(`display`),this.canvas.remove()}render(e,t=0){let n={inputTexture:this.imageTexture,renderID:F(),canvasID:this.canvasID,renderToCanvas:!0,time:t,mouse:this.mouse,isHover:this.isHover,gl:this.gl};e.render(n)}animate(e){let t=new Date().getTime()/1e3;this.isAnimation=!0;let n=()=>{if(!this.isAnimation)return;let r=new Date().getTime()/1e3;this.accTime+=r-t,t=r,this.render(e,this.accTime),requestAnimationFrame(n)};n()}stopAnimate(){this.isAnimation=!1}},L=`/cursor-workspace/graphim-demo/assets/sample-BEKEdzgG.jpg`,R=[`gray`,`sepia`,`neg`,`blur`,`bloom`,`pixel`,`frosted`,`wave`],z={gray:{label:`Gray`,animated:!1},sepia:{label:`Sepia`,animated:!1},neg:{label:`Negative`,animated:!1},blur:{label:`Blur`,animated:!1},bloom:{label:`Bloom`,animated:!1},pixel:{label:`Pixel`,animated:!1},frosted:{label:`Frosted glass`,animated:!1},wave:{label:`Wave (custom)`,animated:!0}};function B(){return R.map(e=>({id:e,...z[e]}))}function V(e){return R.includes(e)}function H(e){return z[e].animated}function U(e){let t=new v,n=W(e);return n.connect(t),n}function W(e){switch(e){case`gray`:return new E;case`sepia`:return new w;case`neg`:return new S;case`blur`:return new A(8);case`bloom`:return new O(.45,2.5,1.2);case`pixel`:return new M(12);case`frosted`:return new P(4);case`wave`:return new b(`
uniform vec2 delta;
void main(void) {
  gl_FragColor = texture2D(
    renderTexture,
    vUv + sin(time) * distance(vUv, vec2(0.5, 0.5)) * delta
  );
}
`,new n({delta:new t(.08,.12)}));default:return e}}function G(e){e.innerHTML=`
    <header class="header">
      <p class="back"><a href="../">← Portal</a></p>
      <h1>Graphim Demo</h1>
      <p>WebGL ノードベース画像エフェクト（<code>lib/graphim</code> submodule）</p>
    </header>
    <section class="controls">
      <label>
        Effect
        <select id="effect">${B().map(e=>`<option value="${e.id}">${e.label}</option>`).join(``)}</select>
      </label>
    </section>
    <section class="stage-wrap">
      <img id="source" src="${L}" alt="Sample for Graphim filters" width="640" />
    </section>
    <p id="status" class="status" aria-live="polite"></p>
  `;let t=e.querySelector(`#source`),n=e.querySelector(`#effect`),r=e.querySelector(`#status`);if(!t||!n||!r)throw Error(`demo DOM missing`);let i=null,a=`gray`,o=()=>{if(!i)return;i.stopAnimate();let e=U(a);H(a)?(i.animate(e),r.textContent=`${a}: animating`):(i.render(e),r.textContent=`${a}: rendered`)},s=()=>{i=new I({image:t}),o()};t.complete&&t.naturalWidth>0?s():t.addEventListener(`load`,s,{once:!0}),n.addEventListener(`change`,()=>{let e=n.value;V(e)&&(a=e,o())})}var K=document.querySelector(`#app`);if(!K)throw Error(`#app not found`);G(K);
(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(){return{yaw:.7,pitch:.4,distance:1.7,targetX:0,targetY:0,targetZ:0}}function t(e,t,n){let r=Math.max(-1.2,Math.min(1.2,e.pitch+n));return{...e,yaw:e.yaw+t,pitch:r}}function n(e,t){let n=Math.max(.9,Math.min(4.5,e.distance+t));return{...e,distance:n}}function r(e){let t=Math.cos(e.pitch);return{x:e.targetX+e.distance*t*Math.sin(e.yaw),y:e.targetY+e.distance*Math.sin(e.pitch),z:e.targetZ+e.distance*t*Math.cos(e.yaw)}}function i(e,t,n){let r=e.x-t.x,i=e.y-t.y,a=e.z-t.z,o=1/Math.hypot(r,i,a),s=r*o,c=i*o,l=a*o,u=n.y*l-n.z*c,d=n.z*s-n.x*l,f=n.x*c-n.y*s,p=1/Math.hypot(u,d,f);u*=p,d*=p,f*=p;let m=c*f-l*d,h=l*u-s*f,g=s*d-c*u,_=new Float32Array(16);return _[0]=u,_[1]=m,_[2]=s,_[3]=0,_[4]=d,_[5]=h,_[6]=c,_[7]=0,_[8]=f,_[9]=g,_[10]=l,_[11]=0,_[12]=-(u*e.x+d*e.y+f*e.z),_[13]=-(m*e.x+h*e.y+g*e.z),_[14]=-(s*e.x+c*e.y+l*e.z),_[15]=1,_}function a(e,t,n,r){let i=1/Math.tan(e/2),a=1/(n-r),o=new Float32Array(16);return o[0]=i/t,o[5]=i,o[10]=(r+n)*a,o[11]=-1,o[14]=2*r*n*a,o}function o(e,t){let n=new Float32Array(16);for(let r=0;r<4;r++)for(let i=0;i<4;i++)n[r*4+i]=e[i]*t[r*4]+e[4+i]*t[r*4+1]+e[8+i]*t[r*4+2]+e[12+i]*t[r*4+3];return n}var s=[{id:`low`,label:`軽量 (1,000)`,params:{particleCount:1e3,gravity:3.5,pressure:12,viscosity:.12,bounce:.05,friction:.05}},{id:`medium`,label:`標準 (2,000)`,params:{particleCount:2e3,gravity:3.5,pressure:14,viscosity:.15,bounce:.05,friction:.06}},{id:`high`,label:`多め (3,500)`,params:{particleCount:3500,gravity:3.5,pressure:16,viscosity:.16,bounce:.04,friction:.06}}];function c(e){return s.find(t=>t.id===e)??s[0]}function l(e,t){return{particleCount:d(t.particleCount??e.particleCount,64,8e3),gravity:u(t.gravity??e.gravity,.2,10),pressure:u(t.pressure??e.pressure,1,40),viscosity:u(t.viscosity??e.viscosity,0,2),bounce:u(t.bounce??e.bounce,0,.8),friction:u(t.friction??e.friction,0,1)}}function u(e,t,n){return Number.isFinite(e)?Math.min(n,Math.max(t,e)):t}function d(e,t,n){return Math.round(u(e,t,n))}function f(e,t=1/45){return!Number.isFinite(e)||e<0?0:e>t?t:e}function p(e,t,n){let r=m(e,t,-1,n),i=m(e,t,1,n),a=i.x-r.x,o=i.y-r.y,s=i.z-r.z;if(Math.abs(o)<1e-6)return null;let c=-r.y/o;if(c<0||c>1)return null;let l=r.x+a*c,u=r.z+s*c,d=l+.5,f=u+.5;return d<0||d>1||f<0||f>1?null:{u:d,v:f}}function m(e,t,n,r){let i=r[0]*e+r[4]*t+r[8]*n+r[12],a=r[1]*e+r[5]*t+r[9]*n+r[13],o=r[2]*e+r[6]*t+r[10]*n+r[14],s=1/(r[3]*e+r[7]*t+r[11]*n+r[15]);return{x:i*s,y:a*s,z:o*s}}function h(e){let t=new Float32Array(16),n=e[0],r=e[1],i=e[2],a=e[3],o=e[4],s=e[5],c=e[6],l=e[7],u=e[8],d=e[9],f=e[10],p=e[11],m=e[12],h=e[13],g=e[14],_=e[15],v=n*s-r*o,y=n*c-i*o,b=n*l-a*o,x=r*c-i*s,S=r*l-a*s,C=i*l-a*c,w=u*h-d*m,T=u*g-f*m,E=u*_-p*m,D=d*g-f*h,O=d*_-p*h,k=f*_-p*g,A=v*k-y*O+b*D+x*E-S*T+C*w;return Math.abs(A)<1e-8?null:(A=1/A,t[0]=(s*k-c*O+l*D)*A,t[1]=(i*O-r*k-a*D)*A,t[2]=(h*C-g*S+_*x)*A,t[3]=(f*S-d*C-p*x)*A,t[4]=(c*E-o*k-l*T)*A,t[5]=(n*k-i*E+a*T)*A,t[6]=(g*b-m*C-_*y)*A,t[7]=(u*C-f*b+p*y)*A,t[8]=(o*O-s*E+l*w)*A,t[9]=(r*E-n*O-a*w)*A,t[10]=(m*S-h*b+_*v)*A,t[11]=(d*b-u*S-p*v)*A,t[12]=(s*T-o*D-c*w)*A,t[13]=(n*D-r*T+i*w)*A,t[14]=(h*y-m*x-g*v)*A,t[15]=(u*x-d*y+f*v)*A,t)}function g(e,t,n){let r=e.createShader(t);if(!r)throw Error(`createShader failed`);if(e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS)){let t=e.getShaderInfoLog(r)??`unknown`;throw e.deleteShader(r),Error(t)}return r}function _(e,t,n){let r=g(e,e.VERTEX_SHADER,t),i=g(e,e.FRAGMENT_SHADER,n),a=e.createProgram();if(!a)throw Error(`createProgram failed`);if(e.attachShader(a,r),e.attachShader(a,i),e.linkProgram(a),e.deleteShader(r),e.deleteShader(i),!e.getProgramParameter(a,e.LINK_STATUS)){let t=e.getProgramInfoLog(a)??`unknown`;throw e.deleteProgram(a),Error(t)}return a}var v=`#version 300 es
precision highp float;
layout(location=0) in vec3 aPos;
uniform mat4 uViewProj;
void main() {
  gl_Position = uViewProj * vec4(aPos, 1.0);
}
`,y=`#version 300 es
precision highp float;
out vec4 outColor;
uniform vec3 uColor;
void main() {
  outColor = vec4(uColor, 1.0);
}
`,b=`#version 300 es
precision highp float;
layout(location=0) in vec3 aPos;
uniform mat4 uViewProj;
out float vZ;
void main() {
  vZ = aPos.z;
  gl_Position = uViewProj * vec4(aPos, 1.0);
}
`,x=`#version 300 es
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
`,S=`#version 300 es
precision highp float;
layout(location=0) in vec3 aPos;
uniform mat4 uViewProj;
uniform float uPointSize;
void main() {
  vec4 clip = uViewProj * vec4(aPos, 1.0);
  gl_Position = clip;
  gl_PointSize = uPointSize / max(clip.w, 0.12);
}
`,C=`#version 300 es
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
`,w=-.08,T=.42,E=-.45,D=.45,O=-.45,k=.45,A=.5;function j(e){return w+T*e}function M(){let e=j(O),t=j(k);return new Float32Array([E,e,O,D,e,O,D,t,k,E,e,O,D,t,k,E,t,k])}function N(){let e=j(O),t=j(k),n=j(O),r=j(k);return new Float32Array([E,e,O,D,n,O,D,n,O,D,r,k,D,r,k,E,t,k,E,t,k,E,e,O,E,A,O,D,A,O,D,A,O,D,A,k,D,A,k,E,A,k,E,A,k,E,A,O,E,e,O,E,A,O,D,n,O,D,A,O,D,r,k,D,A,k,E,t,k,E,A,k])}var P=class{gl;lineProg;floorProg;particleProg;boxVao;floorVao;particleVao;particleBuf;boxCount;floorCount;uLineVP;uLineColor;uFloorVP;uPartVP;uPartSize;constructor(e){let t=e.getContext(`webgl2`,{antialias:!0,alpha:!1,powerPreference:`high-performance`});if(!t)throw Error(`WebGL2 is required`);this.gl=t,this.lineProg=_(t,v,y),this.floorProg=_(t,b,x),this.particleProg=_(t,S,C),this.uLineVP=t.getUniformLocation(this.lineProg,`uViewProj`),this.uLineColor=t.getUniformLocation(this.lineProg,`uColor`),this.uFloorVP=t.getUniformLocation(this.floorProg,`uViewProj`),this.uPartVP=t.getUniformLocation(this.particleProg,`uViewProj`),this.uPartSize=t.getUniformLocation(this.particleProg,`uPointSize`);let n=N();this.boxCount=n.length/3,this.boxVao=t.createVertexArray();let r=t.createBuffer();t.bindVertexArray(this.boxVao),t.bindBuffer(t.ARRAY_BUFFER,r),t.bufferData(t.ARRAY_BUFFER,n,t.STATIC_DRAW),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,3,t.FLOAT,!1,0,0);let i=M();this.floorCount=i.length/3,this.floorVao=t.createVertexArray();let a=t.createBuffer();t.bindVertexArray(this.floorVao),t.bindBuffer(t.ARRAY_BUFFER,a),t.bufferData(t.ARRAY_BUFFER,i,t.STATIC_DRAW),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,3,t.FLOAT,!1,0,0),this.particleVao=t.createVertexArray(),this.particleBuf=t.createBuffer(),t.bindVertexArray(this.particleVao),t.bindBuffer(t.ARRAY_BUFFER,this.particleBuf),t.bufferData(t.ARRAY_BUFFER,8e3*3*4,t.DYNAMIC_DRAW),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,3,t.FLOAT,!1,0,0),t.bindVertexArray(null),t.enable(t.DEPTH_TEST),t.enable(t.BLEND),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA)}setBeachMesh(e,t){}resize(e,t,n){let r=this.gl,i=Math.max(1,Math.floor(e*n)),a=Math.max(1,Math.floor(t*n));(r.canvas.width!==i||r.canvas.height!==a)&&(r.canvas.width=i,r.canvas.height=a),r.viewport(0,0,i,a)}draw(e,t,n,r,i,a,o,s){let c=this.gl;c.clearColor(.07,.07,.1,1),c.clear(c.COLOR_BUFFER_BIT|c.DEPTH_BUFFER_BIT),c.disable(c.BLEND),c.useProgram(this.floorProg),c.uniformMatrix4fv(this.uFloorVP,!1,o),c.bindVertexArray(this.floorVao),c.drawArrays(c.TRIANGLES,0,this.floorCount),c.useProgram(this.lineProg),c.uniformMatrix4fv(this.uLineVP,!1,o),c.uniform3f(this.uLineColor,.5,.55,.7),c.bindVertexArray(this.boxVao),c.drawArrays(c.LINES,0,this.boxCount),c.enable(c.BLEND),c.depthMask(!1),c.useProgram(this.particleProg),c.uniformMatrix4fv(this.uPartVP,!1,o),c.uniform1f(this.uPartSize,36),c.bindVertexArray(this.particleVao),c.bindBuffer(c.ARRAY_BUFFER,this.particleBuf),c.bufferSubData(c.ARRAY_BUFFER,0,e.subarray(0,t*3)),c.drawArrays(c.POINTS,0,t),c.depthMask(!0),c.bindVertexArray(null)}},F=class e{api;constructor(e){this.api=e}static async load(t){let n={env:{abort(e,t,n,r){throw Error(`WASM abort at ${n}:${r}`)}}},r=await fetch(t);if(!r.ok)throw Error(`Failed to fetch WASM: ${r.status}`);let i=await WebAssembly.instantiateStreaming(r,n);return new e(i.instance.exports)}applyParams(e,t=!0){this.api.setParams(e.gravity,e.pressure,e.viscosity,e.bounce,e.friction),t&&this.api.init(e.particleCount)}reset(){this.api.reset()}step(e){this.api.step(e)}pour(e=300){this.api.pour(e)}getWaterCount(){return this.api.getWaterCount()}getWaterPositions(){return new Float32Array(this.api.memory.buffer,this.api.waterPtr(),this.api.getWaterCount()*3)}splash(e,t,n=.1,r=1.5){this.api.splash(e,t,n,r)}};function I(u){u.innerHTML=`
    <div class="app">
      <header class="header">
        <div>
          <a class="back" href="../">← ポータルへ</a>
          <h1>Box Fluid</h1>
        </div>
        <div class="meta">
          <span id="backend">WASM 読込中…</span>
          <span id="fps">— fps</span>
          <span id="count">—</span>
        </div>
      </header>

      <div class="layout">
        <div class="viewport-wrap">
          <canvas id="viewport" aria-label="箱流体ビュー"></canvas>
          <p class="hint">ドラッグで回転 / ホイールでズーム / クリックで押し上げ</p>
        </div>

        <aside class="panel" aria-label="操作パネル">
          <label class="field">
            <span>粒子数</span>
            <select id="quality">
              ${s.map(e=>`<option value="${e.id}">${e.label}</option>`).join(``)}
            </select>
          </label>

          <label class="field">
            <span>重力 <em id="grav-val">3.50</em></span>
            <input id="gravity" type="range" min="1" max="10" step="0.1" value="3.5" />
          </label>

          <label class="field">
            <span>圧力 <em id="press-val">14.0</em></span>
            <input id="pressure" type="range" min="1" max="40" step="0.5" value="14" />
          </label>

          <label class="field">
            <span>粘性 <em id="visc-val">0.15</em></span>
            <input id="viscosity" type="range" min="0" max="2" step="0.01" value="0.15" />
          </label>

          <label class="field">
            <span>跳ね返り <em id="bounce-val">0.05</em></span>
            <input id="bounce" type="range" min="0" max="0.8" step="0.05" value="0.05" />
          </label>

          <label class="field">
            <span>摩擦 <em id="fric-val">0.06</em></span>
            <input id="friction" type="range" min="0" max="1" step="0.02" value="0.06" />
          </label>

          <div class="actions">
            <button type="button" id="pour" class="btn">追加で注ぐ</button>
            <button type="button" id="pause" class="btn btn-secondary">一時停止</button>
            <button type="button" id="reset" class="btn btn-secondary">リセット</button>
          </div>
        </aside>
      </div>
    </div>
  `;let d=u.querySelector(`#viewport`),m=u.querySelector(`#backend`),g=u.querySelector(`#fps`),_=u.querySelector(`#count`),v=u.querySelector(`#quality`),y=u.querySelector(`#gravity`),b=u.querySelector(`#pressure`),x=u.querySelector(`#viscosity`),S=u.querySelector(`#bounce`),C=u.querySelector(`#friction`),w=u.querySelector(`#grav-val`),T=u.querySelector(`#press-val`),E=u.querySelector(`#visc-val`),D=u.querySelector(`#bounce-val`),O=u.querySelector(`#fric-val`),k=u.querySelector(`#pour`),A=u.querySelector(`#pause`),j=u.querySelector(`#reset`),M={...c(`medium`).params};v.value=`medium`,H(M);let N=e(),I=!1,L=null,R=null,z=new Float32Array(16),B=new Float32Array;(async()=>{try{R=new P(d),L=await F.load(`/cursor-workspace/fluid-3d/wave.wasm`),L.applyParams(M),m.textContent=`WASM SPH`,_.textContent=`${L.getWaterCount()} particles`,Z(performance.now())}catch(e){m.textContent=`読込失敗`,console.error(e)}})();function V(){return{gravity:Number(y.value),pressure:Number(b.value),viscosity:Number(x.value),bounce:Number(S.value),friction:Number(C.value)}}function H(e){y.value=String(e.gravity),b.value=String(e.pressure),x.value=String(e.viscosity),S.value=String(e.bounce),C.value=String(e.friction),w.textContent=e.gravity.toFixed(2),T.textContent=e.pressure.toFixed(1),E.textContent=e.viscosity.toFixed(2),D.textContent=e.bounce.toFixed(2),O.textContent=e.friction.toFixed(2)}function U(){L&&(M=l(M,V()),H(M),L.applyParams(M,!1))}v.addEventListener(`change`,()=>{let e=c(v.value);M={...e.params,...V(),particleCount:e.params.particleCount},M=l(M,{}),H(M),L&&(L.applyParams(M,!0),_.textContent=`${L.getWaterCount()} particles`)});for(let e of[y,b,x,S,C])e.addEventListener(`input`,()=>{w.textContent=Number(y.value).toFixed(2),T.textContent=Number(b.value).toFixed(1),E.textContent=Number(x.value).toFixed(2),D.textContent=Number(S.value).toFixed(2),O.textContent=Number(C.value).toFixed(2)}),e.addEventListener(`change`,U);k.addEventListener(`click`,()=>{L&&(L.pour(300),_.textContent=`${L.getWaterCount()} particles`)}),A.addEventListener(`click`,()=>{I=!I,A.textContent=I?`再開`:`一時停止`}),j.addEventListener(`click`,()=>{L&&(L.applyParams(M,!0),_.textContent=`${L.getWaterCount()} particles`)});let W=!1,G=!1,K=0,q=0;d.addEventListener(`pointerdown`,e=>{W=!0,G=!1,K=e.clientX,q=e.clientY,d.setPointerCapture(e.pointerId)}),d.addEventListener(`pointermove`,e=>{if(!W)return;let n=e.clientX-K,r=e.clientY-q;Math.hypot(n,r)>2&&(G=!0),K=e.clientX,q=e.clientY,N=t(N,n*.005,r*.005)}),d.addEventListener(`pointerup`,e=>{if(W=!1,!G&&L){let t=d.getBoundingClientRect(),n=(e.clientX-t.left)/t.width*2-1,r=-((e.clientY-t.top)/t.height*2-1),i=h(z);if(i){let e=p(n,r,i);e&&L.splash(e.u,e.v)}}}),d.addEventListener(`pointercancel`,()=>{W=!1}),d.addEventListener(`wheel`,e=>{e.preventDefault(),N=n(N,e.deltaY*.0015)},{passive:!1});let J=performance.now(),Y=0,X=0;function Z(e){let t=f((e-J)/1e3);if(J=e,Y++,X+=t,X>=.5&&(g.textContent=`${Math.round(Y/X)} fps`,Y=0,X=0,L&&(_.textContent=`${L.getWaterCount()} particles`)),L&&R){if(!I){let e=t/5;for(let t=0;t<5;t++)L.step(e)}let e=d.getBoundingClientRect(),n=Math.min(window.devicePixelRatio||1,1.75);R.resize(e.width,e.height,n);let s=r(N),c=i(s,{x:N.targetX,y:N.targetY,z:N.targetZ},{x:0,y:1,z:0});z=o(a(Math.PI/3.5,Math.max(e.width/Math.max(e.height,1),.1),.05,20),c),R.draw(L.getWaterPositions(),L.getWaterCount(),B,B,B,0,z,s)}requestAnimationFrame(Z)}}var L=document.querySelector(`#app`);if(!L)throw Error(`#app not found`);I(L);
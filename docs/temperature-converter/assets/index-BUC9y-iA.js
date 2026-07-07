(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function c(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(t){if(t.ep)return;t.ep=!0;const o=c(t);fetch(t.href,o)}})();const a=-273.15;function f(e,r){switch(r){case"c":return e;case"f":return(e-32)*(5/9);case"k":return e-273.15}}function d(e,r){switch(r){case"c":return e;case"f":return e*(9/5)+32;case"k":return e+273.15}}function p(e,r,c){if(!Number.isFinite(e))throw new Error("数値を入力してください");const s=f(e,r);if(s<a-1e-9)throw new Error("絶対零度を下回る温度は指定できません");return d(s,c)}function m(e){return Math.round(e*100)/100}const i={c:"摂氏 (℃)",f:"華氏 (℉)",k:"ケルビン (K)"};function l(e){return Object.keys(i).map(r=>`<option value="${r}" ${r===e?"selected":""}>${i[r]}</option>`).join("")}function v(e){e.innerHTML=`
    <main>
      <header>
        <a class="back" href="../">← ポータルへ戻る</a>
        <h1>温度変換</h1>
        <p>摂氏・華氏・ケルビンを相互に変換します。</p>
      </header>
      <section class="panel">
        <div class="field">
          <label for="value">値</label>
          <input id="value" type="number" value="25" step="any" />
        </div>
        <div class="units">
          <div class="field">
            <label for="from">変換元</label>
            <select id="from">${l("c")}</select>
          </div>
          <div class="field">
            <label for="to">変換先</label>
            <select id="to">${l("f")}</select>
          </div>
        </div>
        <output id="result" class="result">—</output>
      </section>
    </main>
  `;const r=e.querySelector("#value"),c=e.querySelector("#from"),s=e.querySelector("#to"),t=e.querySelector("#result");function o(){try{const n=p(r.valueAsNumber,c.value,s.value);t.textContent=`${m(n)} ${i[s.value]}`,t.classList.remove("error")}catch(n){t.textContent=n instanceof Error?n.message:String(n),t.classList.add("error")}}[r,c,s].forEach(n=>n.addEventListener("input",o)),o()}const u=document.querySelector("#app");u&&v(u);

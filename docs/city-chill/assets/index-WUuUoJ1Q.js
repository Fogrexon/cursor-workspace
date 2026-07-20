(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const Qt={population:{housingRoomFactor:.24,baseGrowth:4,popGrowthRate:.062,happinessFactorBase:.45,happinessDivisor:180,transportFactorBase:.45,transportFactorCap:1.25,transportPopDivisor:8,transportMinDenom:20,jobRoomJobsMult:1.25,jobRoomPopMult:.45,jobRoomThreshold:.25,overcrowdingThreshold:-5,overcrowdingLossCap:3,overcrowdingLossRate:.05,lowHappinessThreshold:30,lowHappinessLoss:1.5,initial:12},budget:{commerceIncome:1.35,industryIncome:1.1,populationIncome:.12,baseIncome:4,roadUpkeep:.55,railUpkeep:1.6,buildingUpkeep:.9,initial:260,debtLimit:500},buildCosts:{residential:22,commercial:32,industrial:42,road:12,rail:90,crossing:70,school:75,park:18,hospital:95,tower:170,station:240,plaza:28,skyscraper:340,upgradeBase:20,fallback:28},development:{forestClearCost:22,bridgeCost:95,bridgeUpkeep:2.2,bridgeTransport:6},terrain:{waterThreshold:.63,forestThreshold:.54,scale:.035},stages:{town:60,city:250,metropolis:900},buildInterval:{dayFactor:.42,minSeconds:.32,jitterMin:.7,jitterRange:.45},tiles:{residentialHousing:8,towerHousing:42,towerJobs:6,skyscraperHousing:90,skyscraperJobs:35,skyscraperCommerce:22,commercialJobs:12,commercialCommerce:10,industrialJobs:18,industrialIndustry:15,roadTransport:4,railTransport:10,crossingTransport:14,stationTransport:28,stationJobs:10,schoolEducation:18,schoolJobs:6,hospitalJobs:10,plazaParks:2,plazaCommerce:5,parkParks:1},happiness:{base:45,parksCap:20,parksPer:3,educationCap:15,educationFactor:.15,transportBonusCap:15,transportBonusBase:.5,transportBonusScale:20,jobBonusCap:10,jobBonusBase:.7,jobBonusScale:15,housingBonusCap:8,housingBonusBase:.8,housingBonusScale:10,hospitalBonus:4,transportPenaltyScale:25,jobPenaltyBase:.6,jobPenaltyScale:30,min:5,max:100,transportNeedDivisor:12,transportRatioCap:1.5,jobNeedFactor:.55}};function pt(i,e,t){return e*t+i}function It(i,e,t,n){return i>=0&&e>=0&&i<t&&e<n}function Ve(i,e,t,n,s){return It(e,t,n,s)?i[pt(e,t,n)]:null}function Xt(i,e,t,n,s){i[pt(e,t,n)]=s}function Lt(i,e=0,t=0,n=0,s="none",r=i==="pad"?0:1,o=-1){return{kind:i,tier:e,variant:t,construction:n,facing:s,footprint:r,anchorIdx:o}}const zi=new Set(["residential","commercial","industrial","park","school","hospital","station","plaza","tower","skyscraper"]),cr=[[0,0],[1,0],[0,1],[1,1]];function Qu(i,e,t,n,s){for(const[r,o]of cr){const a=e+r,c=t+o;if(!It(a,c,n,s))return!1;const l=i[pt(a,c,n)];if(!Ts(l.kind))return!1}return!0}function vd(i,e,t,n,s){for(const[r,o]of cr)if(ju(i,e+r,t+o,n,s))return!0;return!1}const St=new Set(["road","station","crossing","bridge"]),Ei=new Set(["rail","station","crossing","bridge"]);function Ts(i){return i==="grass"||i==="empty"||i==="forest"}function Hi(i){return Ts(i)||i==="water"||i==="bridge"}const Md=[[1,0],[-1,0],[0,1],[0,-1]];function xt(i,e,t,n){const s=[];for(const[r,o]of Md){const a=i+r,c=e+o;It(a,c,t,n)&&s.push({x:a,y:c})}return s}function ju(i,e,t,n,s){return xt(e,t,n,s).some(r=>{const o=i[pt(r.x,r.y,n)];return St.has(o.kind)})}function sl(i,e){return i==="none"||i==="both"?!0:i==="x"?e==="e"||e==="w":e==="n"||e==="s"}function ii(i,e){return i==="none"?e:e==="none"||i===e?i:"both"}function va(i,e){return i.y===e.y&&i.x!==e.x?"x":i.x===e.x&&i.y!==e.y?"z":"both"}function yd(i,e,t){let n="none";return i&&(n=ii(n,va(i,e))),t&&(n=ii(n,va(e,t))),n==="none"?"x":n}function $i(i,e,t,n,s,r){const o=Ve(i,e,t,n,s);if(!o)return{e:!1,w:!1,n:!1,s:!1};const a=(c,l,u,f)=>{const d=Ve(i,e+c,t+l,n,s);return!d||!r(d.kind)?!1:o.facing==="none"&&d.facing==="none"?!0:sl(o.facing,u)&&sl(d.facing,f)};return{e:a(1,0,"e","w"),w:a(-1,0,"w","e"),s:a(0,1,"s","n"),n:a(0,-1,"n","s")}}function ef(i){return(i.e?1:0)+(i.w?1:0)+(i.n?1:0)+(i.s?1:0)}function rl(i){const e=ef(i);return e===0?"none":e===1?"end":e===2?i.e&&i.w||i.n&&i.s?"straight":"L":e===3?"T":"cross"}function wo(i){const e=i.e||i.w,t=i.n||i.s;return e&&t?"both":e?"x":t?"z":"none"}function ps(i){return i==="road"||i==="station"||i==="crossing"||i==="bridge"}function ol(i){return i==="rail"||i==="station"||i==="crossing"||i==="bridge"}function Ma(i,e){i.facing=ii(i.facing,e)}const xc={park:20,plaza:16,residential:5,commercial:4,industrial:2},Sd=new Set(Object.keys(xc));function al(i){return!(!Sd.has(i.kind)||i.kind==="pad"||i.footprint===0||i.footprint>=2||i.construction>0||xc[i.kind]==null||i.kind==="residential"&&i.tier>=3||i.kind==="commercial"&&i.tier>=3||i.kind==="industrial"&&i.tier>=2)}function no(i,e,t,n,s){return xt(e,t,n,s).filter(r=>{const o=i[r.y*n+r.x];return St.has(o.kind)}).length}function bd(i,e,t,n,s){return xt(e,t,n,s).filter(r=>{const o=i[r.y*n+r.x];return Hi(o.kind)}).length}function js(i,e,t,n,s){const r=(a,c)=>a===e&&c===t?!0:It(a,c,n,s)?St.has(i[c*n+a].kind):!1,o=[[e,t],[e-1,t],[e,t-1],[e-1,t-1]];for(const[a,c]of o)if(r(a,c)&&r(a+1,c)&&r(a,c+1)&&r(a+1,c+1))return!0;return!1}function Co(i,e,t,n,s){const r=e/2,o=t/2,a=s<n*1.05,c=[];for(let l=0;l<t;l++)for(let u=0;u<e;u++){const f=i[l*e+u];if(!St.has(f.kind)||bd(i,u,l,e,t)>0||no(i,u,l,e,t)!==1)continue;const h=Math.hypot(u-r,l-o);for(const g of xt(u,l,e,t)){const x=i[g.y*e+g.x];if(!al(x)||js(i,g.x,g.y,e,t)||no(i,g.x,g.y,e,t)!==1)continue;let p=xc[x.kind]??1;p-=x.tier*2,p+=h*2;const S=Math.hypot(g.x-r,g.y-o);S>h+.1?p+=8:S<h-.1?p-=10:p-=2;const b=g.x-u,v=g.y-l,E=Ve(i,u-b,l-v,e,t);E&&St.has(E.kind)?p+=6:p+=1,xt(g.x,g.y,e,t).filter(_=>_.x!==u||_.y!==l).some(_=>{const y=i[_.y*e+_.x];return Hi(y.kind)||al(y)})&&(p+=4),a&&(x.kind==="residential"||x.kind==="commercial")&&(p-=8),p>0&&c.push({x:g.x,y:g.y,score:p,kind:x.kind})}}return c.length===0?null:(c.sort((l,u)=>u.score-l.score),c[0])}function Ed(i,e,t){for(let s=0;s<t;s++)for(let r=0;r<e;r++){const o=i[s*e+r];if(St.has(o.kind))for(const a of xt(r,s,e,t)){const c=i[a.y*e+a.x];if(Hi(c.kind)&&!js(i,a.x,a.y,e,t))return!1}}let n=!1;for(const s of i)if(St.has(s.kind)){n=!0;break}return n}function tf(i,e,t,n,s){if(!It(e,t,n,s))return!1;const r=Ve(i,e,t,n,s);if(!r||!Ts(r.kind)||js(i,e,t,n,s))return!1;for(const o of xt(e,t,n,s)){const a=i[o.y*n+o.x];if(!St.has(a.kind)||xt(o.x,o.y,n,s).filter(u=>St.has(i[u.y*n+u.x].kind)).length>=2)continue;if(xt(o.x,o.y,n,s).filter(u=>{const f=i[u.y*n+u.x];return Hi(f.kind)&&!js(i,u.x,u.y,n,s)}).length<=1)return!0}return!1}function pr(i){return Ts(i)||i==="road"||i==="rail"||i==="station"||i==="crossing"||i==="bridge"||i==="water"}function Td(i){return i==="rail"||i==="station"?.3:i==="crossing"?.45:i==="bridge"?.5:i==="grass"||i==="empty"?1:i==="forest"?1.8:i==="road"?8:i==="water"?12:99}function Ad(i,e,t,n,s,r=48){if(!It(n.x,n.y,e,t)||!It(s.x,s.y,e,t))return null;const o=Ve(i,n.x,n.y,e,t),a=Ve(i,s.x,s.y,e,t);if(!o||!a||!pr(o.kind)&&!(o.kind==="rail"||o.kind==="station"||o.kind==="crossing")&&!pr(o.kind)||!pr(a.kind))return null;const c=(x,m)=>m*e+x,l=(x,m)=>Math.abs(x-s.x)+Math.abs(m-s.y),u=[],f=new Map,d=new Map,h=c(n.x,n.y);d.set(h,0),u.push({x:n.x,y:n.y,g:0,f:l(n.x,n.y),px:n.x,py:n.y,dx:0,dy:0});let g=0;for(;u.length>0&&g++<e*t*4;){let x=0;for(let p=1;p<u.length;p++)u[p].f<u[x].f&&(x=p);const m=u.splice(x,1)[0];if(m.x===s.x&&m.y===s.y){const p=[{x:m.x,y:m.y}];let S=m.x,b=m.y;for(;S!==n.x||b!==n.y;){const v=f.get(c(S,b));if(!v)break;S=v.x,b=v.y,p.push({x:S,y:b})}return p.reverse(),p.length>r?null:p}for(const p of xt(m.x,m.y,e,t)){const S=Ve(i,p.x,p.y,e,t);if(!S||!pr(S.kind))continue;const b=p.x-m.x,v=p.y-m.y;let E=Td(S.kind);(m.dx!==0||m.dy!==0)&&(b===m.dx&&v===m.dy?E*=.85:E*=1.25),(p.x<=0||p.y<=0||p.x>=e-1||p.y>=t-1)&&(E+=2);const T=m.g+E,w=c(p.x,p.y);T>=(d.get(w)??1/0)||(d.set(w,T),f.set(w,{x:m.x,y:m.y}),u.push({x:p.x,y:p.y,g:T,f:T+l(p.x,p.y),px:m.x,py:m.y,dx:b,dy:v}))}}return null}function Vi(i){let e=i>>>0;return()=>{e=e+1831565813>>>0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}function Ae(i,e,t){return e+Math.floor(i()*(t-e+1))}function vt(i,e){return i()<e}const cl=["青葉","緑ヶ丘","桜台","日向","風見","白砂","山手","朝霧","紅葉","金星","鈴蘭","潮見","若葉","霞丘","月見","星川"],Rd=new Set([...zi,"road","rail","crossing","bridge","station"]);function wd(i){return i<18?"hamlet":i<55?"village":i<130?"town":i<280?"city":"metropolis"}function Cd(i){switch(i){case"hamlet":return"hamlet";case"village":return"village";case"borough":return"village";case"town":return"town"}}function Pd(i,e){const t=cl.filter(r=>!e.has(r)),n=t.length>0?t:[...cl],s=n[Ae(i,0,n.length-1)];return e.add(s),s}function Yt(i,e,t,n,s,r){let o=t,a=n;for(;o!==s||a!==r;){const l=i[pt(o,a,e)];if(l.kind!=="water"){const u=o!==s?"x":"z",f=l.kind==="road"||l.kind==="crossing"||l.kind==="bridge"?ii(l.facing,u):u;i[pt(o,a,e)]=Lt("road",0,0,0,f)}o!==s?o+=o<s?1:-1:a!==r&&(a+=a<r?1:-1)}const c=i[pt(s,r,e)];if(c.kind!=="water"){const l=t!==s?"x":"z",u=c.kind==="road"||c.kind==="crossing"||c.kind==="bridge"?ii(c.facing,l):l;i[pt(s,r,e)]=Lt("road",0,0,0,u)}}function Id(i,e,t){if(t>=3){if(e===0)return vt(i,.55)?"borough":"town";if(e===1)return vt(i,.6)?"hamlet":"village"}const n=i();return n<.22?"hamlet":n<.55?"village":n<.82?"borough":"town"}function Ld(i,e){if(e==="hamlet"){const n=i();return n<.35?"ell":n<.65?"strip":n<.85?"tee":"cross"}if(e==="village"){const n=i();return n<.25?"cross":n<.45?"tee":n<.65?"ell":n<.85?"branch":"strip"}if(e==="borough"){const n=i();return n<.2?"cross":n<.4?"branch":n<.6?"loop":n<.8?"tee":"ell"}const t=i();return t<.25?"loop":t<.5?"branch":t<.7?"cross":t<.85?"tee":"ell"}function Dd(i,e,t,n,s,r,o,a){if(n<=0||s<=0||n>=e-1||s>=t-1)return;const c=i[pt(n,s,e)];c.kind==="water"||c.kind==="road"||c.kind==="crossing"||c.kind==="bridge"||(i[pt(n,s,e)]=Lt(r,o,Ae(a,0,3)))}function dn(i,e,t,n,s,r,o){o<=0||Yt(i,e,t,n,t+s*o,n+r*o)}function Nd(i,e,t,n,s,r,o){const a=Ld(r,o),c=o==="hamlet"?1:o==="village"?2:o==="borough"?3:4,l=c+Ae(r,0,2)+(vt(r,.4)?1:0),u=c+Ae(r,0,2)+(vt(r,.4)?1:0),f=vt(r,.5),d=l-Ae(r,0,Math.min(2,l-1)),h=l-Ae(r,0,Math.min(2,l-1)),g=u-Ae(r,0,Math.min(2,u-1)),x=u-Ae(r,0,Math.min(2,u-1));if(a==="strip"){if(f?Yt(i,e,n-h,s,n+d,s):Yt(i,e,n,s-g,n,s+x),vt(r,.55)){const E=Ae(r,1,Math.max(1,c)),T=Ae(r,-Math.min(h,d),Math.min(h,d));f?dn(i,e,n+T,s,0,vt(r,.5)?1:-1,E):dn(i,e,n,s+T,vt(r,.5)?1:-1,0,E)}return}if(a==="ell"){const E=[[1,0,d],[-1,0,h],[0,1,x],[0,-1,g]];for(let T=E.length-1;T>0;T--){const w=Ae(r,0,T),_=E[T];E[T]=E[w],E[w]=_}dn(i,e,n,s,E[0][0],E[0][1],E[0][2]),dn(i,e,n,s,E[1][0],E[1][1],E[1][2]);return}if(a==="tee"){f?(Yt(i,e,n-h,s,n+d,s),dn(i,e,n,s,0,vt(r,.5)?1:-1,Math.max(g,x))):(Yt(i,e,n,s-g,n,s+x),dn(i,e,n,s,vt(r,.5)?1:-1,0,Math.max(d,h)));return}if(a==="cross"){dn(i,e,n,s,1,0,d),dn(i,e,n,s,-1,0,h),dn(i,e,n,s,0,1,x),dn(i,e,n,s,0,-1,g);return}if(a==="branch"){if(f){Yt(i,e,n-h,s,n+d,s);const E=1+Ae(r,0,o==="town"?3:2);for(let T=0;T<E;T++){const w=Ae(r,-h,d),_=Ae(r,1,u);dn(i,e,n+w,s,0,vt(r,.5)?1:-1,_)}}else{Yt(i,e,n,s-g,n,s+x);const E=1+Ae(r,0,o==="town"?3:2);for(let T=0;T<E;T++){const w=Ae(r,-g,x),_=Ae(r,1,l);dn(i,e,n,s+w,vt(r,.5)?1:-1,0,_)}}if(o!=="hamlet"&&vt(r,.4)){const E=Ae(r,2,Math.max(2,c+1))*(vt(r,.5)?1:-1);if(f){const T=s+E;T>0&&T<t-1&&Yt(i,e,n-Ae(r,1,h),T,n+Ae(r,1,d),T)}else{const T=n+E;T>0&&T<e-1&&Yt(i,e,T,s-Ae(r,1,g),T,s+Ae(r,1,x))}}return}const m=h,p=d,S=g,b=x,v=vt(r,.35)?Ae(r,0,3):-1;v!==0&&Yt(i,e,n-m,s-S,n+p,s-S),v!==1&&Yt(i,e,n-m,s+b,n+p,s+b),v!==2&&Yt(i,e,n-m,s-S,n-m,s+b),v!==3&&Yt(i,e,n+p,s-S,n+p,s+b),vt(r,.7)&&Yt(i,e,n-Ae(r,0,m),s,n+Ae(r,0,p),s),vt(r,.55)&&Yt(i,e,n,s-Ae(r,0,S),n,s+Ae(r,0,b))}function Ud(i,e,t){const n=i();return e==="hamlet"?n<.75?{kind:"residential",tier:1}:{kind:"park",tier:1}:e==="village"?n<.55?{kind:"residential",tier:1}:n<.75?{kind:"commercial",tier:1}:n<.9?{kind:"park",tier:1}:{kind:"industrial",tier:1}:e==="borough"?t===0&&vt(i,.45)?{kind:"school",tier:1}:n<.45?{kind:"residential",tier:vt(i,.35)?2:1}:n<.65?{kind:"commercial",tier:1}:n<.78?{kind:"industrial",tier:1}:n<.9?{kind:"park",tier:1}:{kind:"plaza",tier:1}:t===0&&vt(i,.55)?{kind:"school",tier:1}:t===1&&vt(i,.4)?{kind:"hospital",tier:1}:n<.4?{kind:"residential",tier:vt(i,.5)?2:1}:n<.58?{kind:"commercial",tier:vt(i,.4)?2:1}:n<.72?{kind:"industrial",tier:1}:n<.84?{kind:"park",tier:1}:n<.92?{kind:"plaza",tier:1}:{kind:"residential",tier:1}}function Fd(i,e,t,n,s,r,o,a){const c=o==="hamlet"?Ae(r,1,3):o==="village"?Ae(r,4,7):o==="borough"?Ae(r,8,14):Ae(r,14,24),l=[];for(let h=s-a;h<=s+a;h++)for(let g=n-a;g<=n+a;g++){if(g<=0||h<=0||g>=e-1||h>=t-1)continue;const x=i[pt(g,h,e)];if(x.kind!=="grass"&&x.kind!=="empty"&&x.kind!=="forest"||!xt(g,h,e,t).some(p=>St.has(i[pt(p.x,p.y,e)].kind)))continue;const m=Math.hypot(g-n,h-s);l.push({x:g,y:h,score:3-m*.15+r()*2.5})}l.sort((h,g)=>g.score-h.score);const u=new Set;let f=0;const d=l.slice(0,Math.min(l.length,c*3+8));for(;f<c&&d.length>0;){const h=Ae(r,0,Math.min(d.length-1,Math.max(2,Math.floor(d.length*.4)))),g=d.splice(h,1)[0],x=`${g.x},${g.y}`;if(u.has(x)||xt(g.x,g.y,e,t).filter(b=>zi.has(i[pt(b.x,b.y,e)].kind)).length>=3&&vt(r,.7))continue;const{kind:p,tier:S}=Ud(r,o,f);Dd(i,e,t,g.x,g.y,p,S,r),zi.has(i[pt(g.x,g.y,e)].kind)&&(u.add(x),f+=1)}}function Od(i,e,t,n,s,r,o){Nd(i,e,t,n,s,r,o);const a=o==="hamlet"?3:o==="village"?5:o==="borough"?7:9;for(let c=-2;c<=2;c++)for(let l=-2;l<=2;l++){const u=n+l,f=s+c;if(!It(u,f,e,t))continue;i[pt(u,f,e)].kind==="forest"&&(i[pt(u,f,e)]=Lt("grass"))}return Fd(i,e,t,n,s,r,o,a),a+4}function Bd(i,e,t,n){const s=e*t,r=s>=200*200?Ae(n,8,12):s>=100*100?Ae(n,5,8):s>=80*80?Ae(n,3,5):1,o=Math.max(22,Math.floor(Math.min(e,t)*(s>=200*200?.13:s>=100*100?.16:.22))),a=Math.max(12,Math.floor(Math.min(e,t)*.08)),c=[],l=new Set,u=(x,m,p,S)=>{for(const E of c)if(Math.hypot(x-E.cx,m-E.cy)<S)return!1;const b=Id(n,c.length,r),v=Od(i,e,t,x,m,n,b);return c.push({id:p,name:Pd(n,l),cx:x,cy:m,radius:v,level:Cd(b)}),!0},f=Math.floor(e/2+(n()-.5)*e*.15),d=Math.floor(t/2+(n()-.5)*t*.15);u(Math.max(a,Math.min(e-a-1,f)),Math.max(a,Math.min(t-a-1,d)),0,o);let h=0,g=o;for(;c.length<r&&h++<240;){const x=Ae(n,a,e-a-1),m=Ae(n,a,t-a-1);u(x,m,c.length,g)||h>120&&c.length<r*.7&&(g=Math.max(24,Math.floor(g*.92)))}if(r>=3&&c.length<2){const x=Math.max(a,e-a-20),m=Math.max(a,t-a-20);u(x,m,c.length,24)}return c}function io(i,e,t,n){let s=0;const r=Math.ceil(n.radius)+4;for(let o=n.cy-r;o<=n.cy+r;o++)for(let a=n.cx-r;a<=n.cx+r;a++)It(a,o,e,t)&&(Math.hypot(a-n.cx,o-n.cy)>r||Rd.has(i[pt(a,o,e)].kind)&&(s+=1));return s}function kd(i,e,t,n,s){if(i.length===0)return null;if(i.length===1)return i[0];const r=i.map(c=>{const l=io(e,t,n,c);return .4+Math.sqrt(l+1)}),o=r.reduce((c,l)=>c+l,0);let a=s()*o;for(let c=0;c<i.length;c++)if(a-=r[c],a<=0)return i[c];return i[i.length-1]}function zd(i,e,t,n){for(const s of i){let r=0,o=0,a=0;const c=Math.ceil(s.radius)+8;for(let u=s.cy-c;u<=s.cy+c;u++)for(let f=s.cx-c;f<=s.cx+c;f++){if(!It(f,u,t,n)||Math.hypot(f-s.cx,u-s.cy)>c)continue;const d=e[pt(f,u,t)];!zi.has(d.kind)||d.kind==="station"||(r+=f,o+=u,a+=1)}a>6&&(s.cx=Math.round(s.cx*.7+r/a*.3),s.cy=Math.round(s.cy*.7+o/a*.3),s.radius=Math.min(48,Math.max(10,Math.sqrt(a)*1.25)));const l=io(e,t,n,s);s.level=wd(l)}}function Hd(i,e,t,n){if(i.length<2)return{merged:!1,absorbedId:null};for(let s=0;s<i.length;s++)for(let r=s+1;r<i.length;r++){const o=i[s],a=i[r],c=Math.hypot(o.cx-a.cx,o.cy-a.cy),l=o.radius+a.radius+6;if(c>l||!Vd(e,t,n,o,a))continue;const u=io(e,t,n,o),f=io(e,t,n,a),d=u>=f?o:a,h=u>=f?a:o;d.cx=Math.round((o.cx*u+a.cx*f)/Math.max(1,u+f)),d.cy=Math.round((o.cy*u+a.cy*f)/Math.max(1,u+f)),d.radius=Math.min(56,o.radius+a.radius*.6);const g=h.id,x=i.indexOf(h);return i.splice(x,1),{merged:!0,absorbedId:g}}return{merged:!1,absorbedId:null}}function Vd(i,e,t,n,s){const r=ll(i,e,t,n.cx,n.cy,12),o=ll(i,e,t,s.cx,s.cy,12);if(!r||!o)return!1;const a=(h,g)=>g*e+h,c=a(o.x,o.y),l=new Set,u=[r];l.add(a(r.x,r.y));let f=0;const d=4e3;for(;u.length>0&&f++<d;){const h=u.shift();if(a(h.x,h.y)===c||Math.hypot(h.x-o.x,h.y-o.y)<=2)return!0;for(const g of xt(h.x,h.y,e,t)){const x=a(g.x,g.y);if(l.has(x))continue;const m=i[pt(g.x,g.y,e)];!St.has(m.kind)&&m.kind!=="bridge"||(l.add(x),u.push(g))}}return!1}function ll(i,e,t,n,s,r){let o=null,a=1/0;for(let c=s-r;c<=s+r;c++)for(let l=n-r;l<=n+r;l++){if(!It(l,c,e,t))continue;const u=Ve(i,l,c,e,t);if(!u||!St.has(u.kind))continue;const f=Math.hypot(l-n,c-s);f<a&&(a=f,o={x:l,y:c})}return o}function Gd(i){return i==="grass"||i==="empty"||i==="forest"||i==="rail"}function Wd(i,e,t,n,s,r=4){let o=0;for(let a=-r;a<=r;a++)for(let c=-r;c<=r;c++){const l=e+c,u=t+a;if(!It(l,u,n,s))continue;const f=i[pt(l,u,n)].kind;f!=="station"&&zi.has(f)&&(o+=1)}return o}function Xd(i,e,t,n,s,r){const o=Yd(i,e,t,n,s,r+4,"station");if(o)return o;let a=null;for(let c=s-r;c<=s+r;c++)for(let l=n-r;l<=n+r;l++){if(!It(l,c,e,t))continue;const u=i[pt(l,c,e)];if(!Gd(u.kind)||u.kind==="road"||u.kind==="crossing"||u.kind==="bridge")continue;const f=Wd(i,l,c,e,t);if(f<3)continue;let d=!1;for(let m=c-8;m<=c+8&&!d;m++)for(let p=l-8;p<=l+8;p++)It(p,m,e,t)&&i[pt(p,m,e)].kind==="station"&&Math.hypot(p-l,m-c)<8&&(d=!0);if(d)continue;const h=xt(l,c,e,t).some(m=>St.has(i[pt(m.x,m.y,e)].kind)),g=Math.hypot(l-n,c-s);let x=f*2+8-g*.4;h&&(x+=4),u.kind==="rail"&&(x+=5),u.kind==="forest"&&(x-=1),(!a||x>a.score)&&(a={x:l,y:c,score:x})}return a?{x:a.x,y:a.y}:null}function qd(i,e,t,n,s){if(i.length<2)return null;const r=[];for(const l of i){const u=Xd(e,t,n,l.cx,l.cy,Math.ceil(l.radius)+8);u&&r.push({...u,sid:l.id})}const o=[];for(let l=0;l<r.length;l++)for(let u=l+1;u<r.length;u++){const f=r[l],d=r[u];if(f.sid===d.sid)continue;const h=Math.hypot(f.x-d.x,f.y-d.y);h<18||h>120||Kd(e,t,n,f,d)||o.push({a:f,b:d,dist:h})}if(o.length===0)return null;o.sort((l,u)=>l.dist-u.dist);const a=o.slice(0,Math.min(4,o.length)),c=a[Ae(s,0,a.length-1)];return{a:{x:c.a.x,y:c.a.y},b:{x:c.b.x,y:c.b.y}}}function Yd(i,e,t,n,s,r,o){let a=null,c=1/0;for(let l=s-r;l<=s+r;l++)for(let u=n-r;u<=n+r;u++){if(!It(u,l,e,t)||i[pt(u,l,e)].kind!==o)continue;const d=Math.hypot(u-n,l-s);d<c&&(c=d,a={x:u,y:l})}return a}function Kd(i,e,t,n,s){const r=Math.max(1,Math.ceil(Math.hypot(s.x-n.x,s.y-n.y)));let o=0;for(let a=0;a<=r;a++){const c=a/r,l=Math.round(n.x+(s.x-n.x)*c),u=Math.round(n.y+(s.y-n.y)*c);for(let f=-1;f<=1;f++)for(let d=-1;d<=1;d++){if(!It(l+d,u+f,e,t))continue;const h=i[pt(l+d,u+f,e)].kind;(h==="rail"||h==="station"||h==="crossing")&&(o+=1)}}return o>r*.35}function xo(i,e,t,n=!0){if(!t)return 0;const s=Math.hypot(i-t.cx,e-t.cy),r=t.radius+6;return n?s<=r?2-s/r:-s/(r*3):0}function $d(i,e,t){return i.length<2||e==="village"||e==="town"?!1:vt(t,e==="city"?.05:.16)}function nf(i,e,t=Qt){const n=t.tiles,s=t.happiness,r=t.budget;let o=0,a=0,c=0,l=0,u=0,f=0,d=0,h=0,g=0,x=0,m=0,p=0,S=0,b=0;for(const D of i){if(D.kind==="pad"||D.footprint===0)continue;const F=Math.max(1,D.tier),L=D.footprint>=2?2.5:1;switch(D.kind){case"residential":o+=n.residentialHousing*F,b+=1;break;case"tower":o+=n.towerHousing*F*L,a+=n.towerJobs*F*L,b+=1;break;case"skyscraper":o+=n.skyscraperHousing*F*L,a+=n.skyscraperJobs*F*L,f+=n.skyscraperCommerce*F*L,b+=1;break;case"commercial":a+=n.commercialJobs*F,f+=n.commercialCommerce*F,b+=1;break;case"industrial":a+=n.industrialJobs*F,u+=n.industrialIndustry*F,b+=1;break;case"road":c+=n.roadTransport,g+=1;break;case"bridge":c+=t.development.bridgeTransport,m+=1;break;case"rail":c+=n.railTransport,x+=1;break;case"crossing":c+=n.crossingTransport,p+=1;break;case"station":c+=n.stationTransport,a+=n.stationJobs,S+=1,b+=1;break;case"school":l+=n.schoolEducation*F,a+=n.schoolJobs,b+=1;break;case"hospital":h+=1,a+=n.hospitalJobs,b+=1;break;case"park":d+=n.parkParks,b+=1;break;case"plaza":d+=n.plazaParks,f+=n.plazaCommerce,b+=1;break}}l=Math.min(100,l);const v=e.population,E=Math.max(1,v/s.transportNeedDivisor),T=Math.min(s.transportRatioCap,c/E),w=a/Math.max(1,v*s.jobNeedFactor),_=o/Math.max(1,v);let y=s.base;y+=Math.min(s.parksCap,d*s.parksPer),y+=Math.min(s.educationCap,l*s.educationFactor),y+=Math.min(s.transportBonusCap,(T-s.transportBonusBase)*s.transportBonusScale),y+=Math.min(s.jobBonusCap,(w-s.jobBonusBase)*s.jobBonusScale),y+=Math.min(s.housingBonusCap,(_-s.housingBonusBase)*s.housingBonusScale),y+=h*s.hospitalBonus,y-=Math.max(0,(1-T)*s.transportPenaltyScale),y-=Math.max(0,(s.jobPenaltyBase-w)*s.jobPenaltyScale),y=Math.max(s.min,Math.min(s.max,y));const R=f*r.commerceIncome+u*r.industryIncome+v*r.populationIncome+r.baseIncome,C=g*r.roadUpkeep+x*r.railUpkeep+m*t.development.bridgeUpkeep+p*r.roadUpkeep*.5+S*r.buildingUpkeep*1.8+(b-S)*r.buildingUpkeep,I=R-C;return{population:v,housing:o,jobs:a,transport:c,education:l,happiness:y,budget:e.budget+I,industry:u,commerce:f,day:e.day}}function Zd(i,e=Qt){const t=e.population,n=i.housing-i.population,s=i.jobs*t.jobRoomJobsMult-i.population*t.jobRoomPopMult,r=t.happinessFactorBase+i.happiness/t.happinessDivisor,o=Math.min(t.transportFactorCap,t.transportFactorBase+i.transport/Math.max(t.transportMinDenom,i.population/t.transportPopDivisor));let a=0;return n>0&&s>-i.population*t.jobRoomThreshold?a=Math.min(n*t.housingRoomFactor,t.baseGrowth+i.population*t.popGrowthRate*r*o):n<t.overcrowdingThreshold?a=-Math.min(t.overcrowdingLossCap,Math.abs(n)*t.overcrowdingLossRate):i.happiness<t.lowHappinessThreshold&&(a=-t.lowHappinessLoss),Math.max(0,i.population+a)}function sf(i,e=Qt){return i<e.stages.town?"village":i<e.stages.city?"town":i<e.stages.metropolis?"city":"metropolis"}function rf(i){switch(i){case"village":return"小さな村";case"town":return"町";case"city":return"都市";case"metropolis":return"大都会"}}function Jd(i,e,t=e,n=Qt){const s=n.happiness,r=Math.max(1,i.population),o=(i.housing-r)/r,a=(i.jobs-r*s.jobNeedFactor)/r,c=i.transport/Math.max(1,r/s.transportNeedDivisor)-1,l=40-i.education,u=60-i.happiness,f={residential:o<.25?1.5-o:.25,commercial:a<.2?1.2-a:.25,industrial:a<.1&&e!=="village"?1-a:.15,road:c<.25?1.2-c:.35,rail:e==="metropolis"?c<.2?.45:.15:e==="city"?c<.15?.35:.08:.02,school:l>0?l/35:.08,park:u>0?u/45:.12,hospital:e!=="village"&&i.happiness<55?.55:.08,tower:t==="metropolis"?o<.3?.9:.3:t==="city"&&r>=n.stages.city*1.1?o<.25?.7:.2:0,station:e==="city"||e==="metropolis"?c<.2?.35:.08:0,skyscraper:t==="metropolis"&&r>=n.stages.metropolis*1.1?o<.3?.55:.15:0};if(i.budget>120){const h=Math.min(2.2,1+i.budget/400);f.residential*=h,f.commercial*=h,f.industrial*=h*.9,f.road*=1.2,f.tower*=Math.min(h,1.4),r>=n.stages.metropolis*1.2?f.skyscraper*=Math.min(h,1.3):f.skyscraper*=.4,f.rail*=.45,f.station*=.55}return i.budget>280&&(f.residential*=1.25,f.commercial*=1.2,f.tower*=1.15,r>=n.stages.metropolis*1.25&&(f.skyscraper*=1.25),f.rail*=.6),e==="metropolis"&&(f.residential*=1.35,f.commercial*=1.25,t==="metropolis"&&(f.tower*=1.2,r>=n.stages.metropolis*1.15&&(f.skyscraper*=1.2))),i.budget+n.budget.debtLimit<80?(f.tower*=.1,f.rail*=.2,f.station*=.15,f.skyscraper=0):i.budget<0&&(f.tower*=.55,f.skyscraper*=.35,f.rail*=.7),f}({...Qt.buildCosts});function mr(i,e,t){let n=i*374761393+e*668265263+t*982451653|0;return n=(n^n>>>13)*1274126177,n=n^n>>>16,(n>>>0)/4294967296}function ul(i){return i*i*(3-2*i)}function Qd(i,e,t){const n=Math.floor(i),s=Math.floor(e),r=ul(i-n),o=ul(e-s),a=mr(n,s,t),c=mr(n+1,s,t),l=mr(n,s+1,t),u=mr(n+1,s+1,t),f=a+(c-a)*r,d=l+(u-l)*r;return f+(d-f)*o}function fl(i,e,t,n=4,s=2,r=.5){let o=1,a=1,c=0,l=0;for(let u=0;u<n;u++)c+=o*Qd(i*a,e*a,t+u*1013),l+=o,o*=r,a*=s;return c/Math.max(1e-6,l)}function jd(i,e,t,n){const s=[],r=(i-1)/2,o=(e-1)/2,a=Math.hypot(r,o)||1;for(let c=0;c<e;c++)for(let l=0;l<i;l++){const u=l*n.scale,f=c*n.scale,d=fl(u,f,t),h=fl(u+40,f-17,t+7),g=l===0||c===0||l===i-1||c===e-1?.06:0,x=Math.hypot(l-r,c-o)/a,m=Math.max(0,1-x*1.6)*.2,p=d+g-m;let S;p>n.waterThreshold?S="water":h>n.forestThreshold&&p<n.waterThreshold-.03?S="forest":S="grass";const b=S==="water"?Math.floor(d*3)%3:S==="forest"?Math.floor(h*4)%4:Math.floor((d+h)*2)%4;s.push(Lt(S,0,b))}return s}function Di(i,e,t){const n=t.development;return i==="forest"?n.forestClearCost:i==="water"?e==="road"||e==="rail"||e==="crossing"?n.bridgeCost:Number.POSITIVE_INFINITY:0}function ya(i,e){return i==="water"||i==="bridge"?"bridge":e==="road"&&i==="rail"||e==="rail"&&i==="road"?"crossing":e}const Bi=48,dl=36,hs=28,hl=36,eh=4,yi=8,th=3,nh=4;function si(i,e,t,n,s,r=nh){let o=0;for(let a=-r;a<=r;a++)for(let c=-r;c<=r;c++){const l=e+c,u=t+a;if(!It(l,u,n,s))continue;const f=i[u*n+l].kind;f!=="station"&&zi.has(f)&&(o+=1)}return o}function ih(i,e,t,n,s,r=th){return si(i,e,t,n,s)>=r}function sh(i,e,t){for(let n=0;n<e.length;n++){const s=e[n],r=n>0?e[n-1]:null,o=n<e.length-1?e[n+1]:null,a=yd(r,s,o),c=i[s.y*t+s.x];c&&Ma(c,a)}}function Is(i,e,t,n,s){const r=Ve(i,e,t,n,s);if(!r||!ps(r.kind))return;let o="none";for(const a of xt(e,t,n,s)){const c=i[a.y*n+a.x];if(!ps(c.kind))continue;const l=va({x:e,y:t},a);o=ii(o,l),Ma(c,l)}Ma(r,o==="none"?"x":o)}function rh(i,e){const t=e.reduce((s,r)=>s+Math.max(0,r.w),0);if(t<=0)return"park";let n=i()*t;for(const s of e)if(n-=Math.max(0,s.w),n<=0)return s.key;return e[e.length-1].key}function oh(i,e,t,n,s){const r=[],o=(s==null?void 0:s.cx)??e/2,a=(s==null?void 0:s.cy)??t/2,c=s?s.radius+2:8,l=s?Math.ceil(s.radius)+10:Math.min(e,t),u=Math.max(0,a-l),f=Math.min(t-1,a+l),d=Math.max(0,o-l),h=Math.min(e-1,o+l);for(let x=u;x<=f;x++)for(let m=d;m<=h;m++){const p=Ve(i,m,x,e,t);if(!p||!Ts(p.kind)||!ju(i,m,x,e,t)||tf(i,m,x,e,t))continue;const S=Math.hypot(m-o,x-a),b=si(i,m,x,e,t,3);if(b===0&&S>c||b===0&&S>Math.max(5,c*.55))continue;const v=xt(m,x,e,t).filter(w=>St.has(i[w.y*e+w.x].kind)).length,E=p.kind==="forest"?.4:0,T=b*.65+v*.45+1/(1+S*.2)+xo(m,x,s)+n()*.25-E;r.push({x:m,y:x,score:T})}if(r.length===0)return null;r.sort((x,m)=>m.score-x.score);const g=r.slice(0,Math.min(12,r.length));return g[Ae(n,0,g.length-1)]}function ah(i,e,t,n,s,r){const o=[];for(let a=0;a<t;a++)for(let c=0;c<e;c++){const l=Ve(i,c,a,e,t);l&&s.includes(l.kind)&&(l.kind==="pad"||l.footprint===0||l.tier>=r||l.construction>0||o.push({x:c,y:a}))}return o.length===0?null:o[Ae(n,0,o.length-1)]}function pl(i,e,t,n,s,r=Qt){const o=[],a=(s==null?void 0:s.cx)??e/2,c=(s==null?void 0:s.cy)??t/2,l=s?s.radius+4:10,u=s?Math.ceil(s.radius)+12:Math.min(e,t),f=Math.max(1,r.buildCosts.road),d=Math.max(0,c-u),h=Math.min(t-1,c+u),g=Math.max(0,a-u),x=Math.min(e-1,a+u);for(let p=d;p<=h;p++)for(let S=g;S<=x;S++){const b=Ve(i,S,p,e,t);if(!b||!St.has(b.kind))continue;const v=no(i,S,p,e,t);for(const E of xt(S,p,e,t)){const T=i[E.y*e+E.x];if(!Hi(T.kind)||js(i,E.x,E.y,e,t))continue;const w=Di(T.kind,"road",r);if(!Number.isFinite(w))continue;const _=f+w,y=no(i,E.x,E.y,e,t);if(y>=3||y>=2&&v>=2)continue;let R=0;v===2?R+=4.8:v<=1?R+=1.6:R-=1.2;const C=E.x-S,I=E.y-p,D=Ve(i,S-C,p-I,e,t);!!(D&&St.has(D.kind))?R+=1:R+=3.2,y===1?R+=3.5:y===2&&(R-=1.8);const L=si(i,E.x,E.y,e,t,3),G=si(i,S,p,e,t,3);R+=Math.min(4.5,L*.85+G*.35);const O=Math.hypot(E.x-a,E.y-c),H=Math.hypot(S-a,p-c);O>l?(R-=(O-l)*.45,L===0&&G===0&&(R-=4)):R+=1.2-O/(l+1)*.6,O>H?R+=L+G>0?.7:-2:R+=.4,R+=xo(E.x,E.y,s)*.85;const Z=_/f;R+=1.4/Z,R-=(Z-1)*4.5,!(O>l+6&&L===0&&G===0&&v<=1)&&(R+=n()*.5,o.push({x:E.x,y:E.y,score:R}))}}if(o.length===0)return null;o.sort((p,S)=>S.score-p.score);const m=o.slice(0,Math.min(10,o.length));return m[Ae(n,0,m.length-1)]}function ch(i,e,t){const n=[];for(let s=0;s<t;s++)for(let r=0;r<e;r++){const o=i[s*e+r];(o.kind==="rail"||o.kind==="station"||o.kind==="crossing"||o.kind==="bridge")&&n.push({x:r,y:s})}return n}function lh(i,e,t,n,s){const r=Ve(i,e,t,n,s);return r?r.kind==="grass"||r.kind==="empty"||r.kind==="forest"||r.kind==="rail":!1}function uh(i,e,t,n,s){let r=Number.POSITIVE_INFINITY;for(let o=0;o<s;o++)for(let a=0;a<n;a++){if(i[o*n+a].kind!=="station")continue;const c=Math.hypot(a-e,o-t);c<r&&(r=c)}return r}function Mn(i,e,t,n,s,r=yi){return lh(i,e,t,n,s)?i[t*n+e].kind==="station"?!0:uh(i,e,t,n,s)<r?!1:ih(i,e,t,n,s):!1}function Yr(i,e,t,n,s,r){let o=null,a=r;const c=Math.max(0,Math.floor(t-r)),l=Math.min(s-1,Math.ceil(t+r)),u=Math.max(0,Math.floor(e-r)),f=Math.min(n-1,Math.ceil(e+r));for(let d=c;d<=l;d++)for(let h=u;h<=f;h++){const g=i[d*n+h];if(!g||g.kind!=="station")continue;const x=Math.hypot(h-e,d-t);x<=a&&(a=x,o={x:h,y:d})}return o}function Ls(i,e,t,n){const s=Yr(i,e.x,e.y,t,n,yi);return s||(Mn(i,e.x,e.y,t,n)?e:xt(e.x,e.y,t,n).filter(a=>Mn(i,a.x,a.y,t,n)).map(a=>{const c=xt(a.x,a.y,t,n).some(l=>St.has(i[l.y*t+l.x].kind));return{...a,score:c?2:1}}).sort((a,c)=>c.score-a.score)[0]??null)}function Po(i,e,t){const n=t.buildCosts;if(e&&(i==="road"||i==="water"||i==="bridge"))return Number.POSITIVE_INFINITY;const s=e?n.station:i==="road"?n.crossing:n.rail,o=Di(i,e?"station":i==="road"?"crossing":"rail",t);return Number.isFinite(o)?s+o:Number.POSITIVE_INFINITY}function of(i,e){return i+e.budget.debtLimit}function Xn(i,e,t){return e<=of(i,t)}function ml(i,e,t,n,s,r,o,a){const c=of(r,s),l=ch(i,e,t),u=(_,y)=>{if(_.length<2)return null;let R=0;for(let C=0;C<_.length;C++){const I=_[C],D=C===0,F=C===_.length-1,L=y==="both"&&(D||F)||y==="goal"&&F,G=Ve(i,I.x,I.y,e,t);if(G.kind!=="station"){if(G.kind==="rail"||G.kind==="crossing"||G.kind==="bridge"){L&&G.kind==="rail"&&(Yr(i,I.x,I.y,e,t,yi-.01)||(R+=5));continue}if(L){if(Yr(i,I.x,I.y,e,t,yi-.01))continue;const O=Mn(i,I.x,I.y,e,t)?I:Ls(i,I,e,t);if(!O)return null;const H=Ve(i,O.x,O.y,e,t);if(H.kind==="station")continue;if(!Mn(i,O.x,O.y,e,t))return null;const Z=Po(H.kind==="rail"?"grass":H.kind,!0,s);if(!Number.isFinite(Z))return null;R+=Z;continue}if(D&&y==="goal")return null;if(G.kind==="road"||Hi(G.kind)){const O=Po(G.kind,!1,s);if(!Number.isFinite(O))return null;R+=O}else return null}}return R},f=(_,y,R,C=R?Bi:hl)=>{const I=Ve(i,_,y,e,t);if(I.kind==="rail"||I.kind==="station"||I.kind==="crossing"||I.kind==="bridge")return 0;if(R&&!Mn(i,_,y,e,t))return-1;const D=Po(I.kind,R,s);if(!Number.isFinite(D))return-1;if(R)return Xt(i,_,y,e,Lt("station",1,Ae(n,0,2),C,"both")),D;if(I.kind==="road")return Xt(i,_,y,e,Lt("crossing",0,0,Math.max(C,hs),"both")),D;if(!Hi(I.kind))return-1;const F=ya(I.kind,"rail");return Xt(i,_,y,e,Lt(F,0,0,C,"x")),D},d=(_,y,R=Bi)=>{const C=Ve(i,_,y,e,t);if(!C)return-1;if(C.kind==="station"||Yr(i,_,y,e,t,yi-.01))return 0;if(Mn(i,_,y,e,t))return C.kind==="rail"?(Xt(i,_,y,e,Lt("station",1,Ae(n,0,2),R,ii(C.facing,"both"))),5):f(_,y,!0,R);const I=Ls(i,{x:_,y},e,t);if(!I)return-1;const D=Ve(i,I.x,I.y,e,t);return D.kind==="station"?0:Mn(i,I.x,I.y,e,t)?D.kind==="rail"?(Xt(i,I.x,I.y,e,Lt("station",1,Ae(n,0,2),R,ii(D.facing,"both"))),5):f(I.x,I.y,!0,R):-1},h=(_,y,R)=>{const C=u(_,y);if(C==null||C>c)return null;const I=_.map(H=>{const Z=i[H.y*e+H.x];return{x:H.x,y:H.y,tile:{...Z}}}),D=[];for(const H of[_[0],_[_.length-1]])for(const Z of xt(H.x,H.y,e,t))I.some(ne=>ne.x===Z.x&&ne.y===Z.y)||D.some(ne=>ne.x===Z.x&&ne.y===Z.y)||D.push({x:Z.x,y:Z.y,tile:{...i[Z.y*e+Z.x]}});const F=[];let L=0,G=0,O=!0;for(let H=0;H<_.length;H++){const Z=_[H],ne=H===0,re=H===_.length-1,de=y==="both"&&(ne||re)||y==="goal"&&re,Ue=Ve(i,Z.x,Z.y,e,t),Qe=hl+H*eh;if(de){if(Ue.kind==="station"){F.push("station");continue}const ee=d(Z.x,Z.y,Math.max(Qe,Bi));if(ee<0){O=!1;break}G+=ee,F.push("station"),ee>5&&(L+=1);continue}if(Ue.kind==="rail"||Ue.kind==="station"||Ue.kind==="crossing"||Ue.kind==="bridge")continue;const Ge=f(Z.x,Z.y,!1,Qe);if(Ge<0){O=!1;break}G+=Ge,L+=1;const J=Ve(i,Z.x,Z.y,e,t);F.push(J.kind)}if(O){sh(i,_,e);const H=(de,Ue)=>{const Qe=Ve(i,de,Ue,e,t);return(Qe==null?void 0:Qe.kind)==="station"?!0:xt(de,Ue,e,t).some(Ge=>i[Ge.y*e+Ge.x].kind==="station")},Z=(de,Ue)=>{var Ge;const Qe=(Ge=Ve(i,de,Ue,e,t))==null?void 0:Ge.kind;return Qe==="rail"||Qe==="station"||Qe==="crossing"||Qe==="bridge"},ne=_[0],re=_[_.length-1];y==="both"?(!H(ne.x,ne.y)||!H(re.x,re.y))&&(O=!1):(!Z(ne.x,ne.y)||!H(re.x,re.y))&&(O=!1)}if(!O||G>c){for(const H of I)Xt(i,H.x,H.y,e,H.tile);for(const H of D)Xt(i,H.x,H.y,e,H.tile);return null}return{placed:L,kinds:[...new Set(F)],cost:G,intercity:R,path:_}},g=(_,y,R,C,I)=>{var G,O,H,Z;let D=_,F=y;if(C==="both"){const ne=Ls(i,_,e,t),re=Ls(i,y,e,t);if(!ne||!re)return null;D=((G=Ve(i,_.x,_.y,e,t))==null?void 0:G.kind)==="station"?_:ne,F=((O=Ve(i,y.x,y.y,e,t))==null?void 0:O.kind)==="station"?y:re}else{const ne=(H=Ve(i,_.x,_.y,e,t))==null?void 0:H.kind;if(ne!=="rail"&&ne!=="station"&&ne!=="crossing"&&ne!=="bridge")return null;if(((Z=Ve(i,y.x,y.y,e,t))==null?void 0:Z.kind)!=="station"){const re=Ls(i,y,e,t);if(!re)return null;F=re}}const L=Ad(i,e,t,D,F,R);return L?h(L,C,I):null};if(a){const _=g(a.a,a.b,140,"both",!0);if(_)return _}if(l.length===0){const _=(o==null?void 0:o.cx)??Math.floor(e/2),y=(o==null?void 0:o.cy)??Math.floor(t/2),R=[];for(let C=y-12;C<=y+12;C++)for(let I=_-14;I<=_+14;I++)!Mn(i,I,C,e,t)||!xt(I,C,e,t).some(F=>St.has(i[F.y*e+F.x].kind))||R.push({x:I,y:C});if(R.length<2)return null;for(let C=0;C<40;C++){const I=R[Ae(n,0,R.length-1)],D=R[Ae(n,0,R.length-1)],F=Math.hypot(I.x-D.x,I.y-D.y);if(F<yi||F>22)continue;const L=g(I,D,48,"both",!1);if(L)return L}return null}const x=l.filter(_=>{const y=i[_.y*e+_.x].kind;return y==="rail"||y==="station"});if(x.length===0)return null;x.sort((_,y)=>o?Math.hypot(_.x-o.cx,_.y-o.cy)-Math.hypot(y.x-o.cx,y.y-o.cy):0);const m=x[Ae(n,0,Math.min(5,x.length-1))],p=[];for(const _ of l){if(_.x===m.x&&_.y===m.y||i[_.y*e+_.x].kind!=="station")continue;const y=Math.hypot(_.x-m.x,_.y-m.y);y>=yi&&y<=40&&p.push(_)}const S=o?Math.ceil(o.radius)+16:22,b=Math.max(2,((o==null?void 0:o.cy)??m.y)-S),v=Math.min(t-3,((o==null?void 0:o.cy)??m.y)+S),E=Math.max(2,((o==null?void 0:o.cx)??m.x)-S),T=Math.min(e-3,((o==null?void 0:o.cx)??m.x)+S);for(let _=b;_<=v;_++)for(let y=E;y<=T;y++){if(!Mn(i,y,_,e,t)||!xt(y,_,e,t).some(I=>St.has(i[I.y*e+I.x].kind)))continue;const C=Math.hypot(y-m.x,_-m.y);C<yi||C>28||p.push({x:y,y:_})}p.sort((_,y)=>{const R=si(i,y.x,y.y,e,t)-si(i,_.x,_.y,e,t);return R!==0?R:Math.hypot(_.x-m.x,_.y-m.y)-Math.hypot(y.x-m.x,y.y-m.y)});const w=p.slice(0,Math.min(10,p.length));for(let _=0;_<w.length;_++){const y=w[Ae(n,0,w.length-1)],R=g(m,y,60,"goal",!1);if(R)return R}return null}function fh(i,e,t,n,s){const r=[],o=(s==null?void 0:s.cx)??e/2,a=(s==null?void 0:s.cy)??t/2,c=s?Math.ceil(s.radius)+12:24,l=Math.max(1,a-c),u=Math.min(t-2,a+c),f=Math.max(1,o-c),d=Math.min(e-2,o+c);for(let h=l;h<=u;h++)for(let g=f;g<=d;g++){const x=Ve(i,g,h,e,t);if(!x||x.kind==="station"||!Mn(i,g,h,e,t))continue;const m=x.kind==="rail",p=xt(g,h,e,t).some(v=>{const E=i[v.y*e+v.x];return E.kind==="rail"||E.kind==="crossing"||E.kind==="station"});if(!m&&!p)continue;const b=si(i,g,h,e,t)*1.5+(m?4:p?2.5:0)+xo(g,h,s)+n()*.3;r.push({x:g,y:h,score:b})}return r.length===0?null:(r.sort((h,g)=>g.score-h.score),r[Ae(n,0,Math.min(5,r.length-1))])}function dh(i,e,t,n,s,r,o,a){if(!It(n,s,e,t))return!1;const c=Ve(i,n,s,e,t);return!c||!Ts(c.kind)?!1:(Xt(i,n,s,e,Lt(r,o,Ae(a,0,7),Bi)),!0)}function vo(i,e,t,n,s,r,o,a=Qt){const c=si(i,e,t,n,s,4),l=Math.min(1,c/16);let u=0;for(let x=-3;x<=3;x++)for(let m=-3;m<=3;m++){const p=Ve(i,e+m,t+x,n,s);p&&(p.kind==="commercial"?u+=.025:p.kind==="tower"?u+=.05:p.kind==="skyscraper"?u+=.07:(p.kind==="plaza"||p.kind==="station")&&(u+=.02))}u=Math.min(1,u);const f=r==="metropolis"?.5:r==="city"?.28:r==="town"?.1:0,d=Math.max(1,a.stages.metropolis),h=Math.min(1,o.population/(d*1.5)),g=Math.min(.15,Math.max(0,o.budget)/2500);return l*.38+u*.22+f*.22+h*.13+g*.05}function hh(i,e,t,n,s,r,o,a=Qt){return r!=="city"&&r!=="metropolis"||o.population<a.stages.city*.85?!1:vo(i,e,t,n,s,r,o,a)>=.48}function af(i,e,t,n,s,r,o,a=Qt){return r!=="metropolis"||o.population<a.stages.metropolis||o.budget<80?!1:vo(i,e,t,n,s,r,o,a)>=.68}function ph(i,e,t,n,s,r,o,a=Qt){return r!=="metropolis"||o.population<a.stages.metropolis*1.25||o.budget<150?!1:vo(i,e,t,n,s,r,o,a)>=.74}function mh(i,e,t,n,s,r,o,a="premium",c=Qt){const l=[],u=(s==null?void 0:s.cx)??e/2,f=(s==null?void 0:s.cy)??t/2,d=s?Math.ceil(s.radius)+14:Math.min(e,t),h=Math.max(0,f-d),g=Math.min(t-2,f+d),x=Math.max(0,u-d),m=Math.min(e-2,u+d);for(let S=h;S<=g;S++)for(let b=x;b<=m;b++){if(!Qu(i,b,S,e,t)||!vd(i,b,S,e,t)||!(a==="premium"?ph(i,b,S,e,t,r,o,c):af(i,b,S,e,t,r,o,c)))continue;let E=!1;for(const[y,R]of cr)if(tf(i,b+y,S+R,e,t)){E=!0;break}if(E)continue;const T=Math.hypot(b+.5-u,S+.5-f),w=si(i,b,S,e,t,3),_=vo(i,b,S,e,t,r,o,c);l.push({x:b,y:S,score:w*.08+_*3-T*.08+xo(b,S,s)+n()*.25})}if(l.length===0)return null;l.sort((S,b)=>b.score-S.score);const p=l.slice(0,Math.min(8,l.length));return p[Ae(n,0,p.length-1)]}function gh(i,e,t,n,s,r,o,a){if(!Qu(i,n,s,e,t))return!1;const c=Ae(a,0,7),l=pt(n,s,e);for(const[u,f]of cr){const d=n+u,h=s+f;u===0&&f===0?Xt(i,d,h,e,Lt(r,o,c,Bi,"none",2,-1)):Xt(i,d,h,e,Lt("pad",0,c,Bi,"none",0,l))}return!0}function _h(i,e,t,n){const s=n?e==="metropolis"?.35:e==="city"?.12:0:0;return[{key:"residential",w:i.residential},{key:"commercial",w:i.commercial},{key:"industrial",w:i.industrial},{key:"road",w:i.road+(t?1.4:0)+(n?.35:0)},{key:"rail",w:i.rail+s},{key:"school",w:i.school},{key:"park",w:i.park},{key:"hospital",w:i.hospital},{key:"tower",w:i.tower},{key:"station",w:i.station},{key:"plaza",w:e==="city"?.3:e==="metropolis"?.45:.05},{key:"upgrade",w:e==="town"?.55:e==="city"?.95:e==="metropolis"?1.4:.15},{key:"skyscraper",w:i.skyscraper},{key:"demolish",w:t?2:.05}]}function xh(i,e,t,n,s,r,o,a=Qt,c=[]){const l=Vi((r^o*2654435761)>>>0),u=a.buildCosts,f=kd(c,i,e,t,l),d=(f==null?void 0:f.level)??s,h=Jd(n,s,d,a),g=Ed(i,e,t),x=c.length>=2,m=rh(l,_h(h,s,g,x));if(m==="demolish"||m==="road"&&g){const y=Co(i,e,t,n.population,n.housing);if(y){const R=Math.round(u.road*1.5);if(Xn(n.budget,R,a))return Xt(i,y.x,y.y,e,Lt("road",0,0,hs,"x")),Is(i,y.x,y.y,e,t),{built:!0,kind:"demolish",cost:R}}if(m==="demolish")return{built:!1,cost:0}}if(m==="upgrade"){const R=ah(i,e,t,l,["residential","commercial","industrial","tower"],d==="metropolis"?5:d==="city"?4:3);if(!R)return{built:!1,cost:0};const C=Ve(i,R.x,R.y,e,t),I=u.upgradeBase*(C.tier+1)*(C.footprint>=2?2:1);if(!Xn(n.budget,I,a))return{built:!1,cost:0};if(C.tier+=1,C.construction=dl,C.footprint>=2)for(const[D,F]of cr){if(D===0&&F===0)continue;const L=Ve(i,R.x+D,R.y+F,e,t);L&&L.kind==="pad"&&(L.construction=dl)}return{built:!0,kind:"upgrade",cost:I}}const p=u[m]??u.fallback;if(m==="road"){const y=pl(i,e,t,l,f,a);if(!y){const F=Co(i,e,t,n.population,n.housing);if(!F)return{built:!1,cost:0};const L=Math.round(u.road*1.5);return Xn(n.budget,L,a)?(Xt(i,F.x,F.y,e,Lt("road",0,0,hs,"x")),Is(i,F.x,F.y,e,t),{built:!0,kind:"demolish",cost:L}):{built:!1,cost:0}}const R=Ve(i,y.x,y.y,e,t),C=Di(R.kind,"road",a),I=u.road+(Number.isFinite(C)?C:0);if(!Xn(n.budget,I,a))return{built:!1,cost:0};const D=ya(R.kind,"road");return Xt(i,y.x,y.y,e,Lt(D,0,0,hs,"x")),Is(i,y.x,y.y,e,t),{built:!0,kind:D,cost:I}}if(m==="rail"){const R=$d(c,s,l)?qd(c,i,e,t,l):null,C=ml(i,e,t,l,a,n.budget,f,R);return C?{built:!0,kind:C.intercity?"intercity-rail":C.kinds.includes("station")?"rail":C.kinds.includes("bridge")?"bridge":C.kinds.includes("crossing")?"crossing":"rail",cost:C.cost,trainPath:C.path.length>=2?C.path:void 0}:{built:!1,cost:0}}if(m==="station"){const y=fh(i,e,t,l,f);if(!y){const D=ml(i,e,t,l,a,n.budget,f,null);return D?{built:!0,kind:"station",cost:D.cost,trainPath:D.path.length>=2?D.path:void 0}:{built:!1,cost:0}}const R=Ve(i,y.x,y.y,e,t);if(!Mn(i,y.x,y.y,e,t))return{built:!1,cost:0};const C=Di(R.kind==="rail"?"grass":R.kind,"station",a),I=u.station+(Number.isFinite(C)?C:0);return Xn(n.budget,I,a)?(Xt(i,y.x,y.y,e,Lt("station",1,Ae(l,0,2),Bi,ii(R.facing==="none"?"x":R.facing,"both"))),{built:!0,kind:"station",cost:I}):{built:!1,cost:0}}const S=oh(i,e,t,l,f);if(!S){const y=pl(i,e,t,l,f,a);if(y){const I=Ve(i,y.x,y.y,e,t),D=Di(I.kind,"road",a),F=u.road+(Number.isFinite(D)?D:0);if(Xn(n.budget,F,a)){const L=ya(I.kind,"road");return Xt(i,y.x,y.y,e,Lt(L,0,0,hs,"x")),Is(i,y.x,y.y,e,t),{built:!0,kind:L,cost:F}}}const R=Co(i,e,t,n.population,n.housing),C=Math.round(u.road*1.5);return R&&Xn(n.budget,C,a)?(Xt(i,R.x,R.y,e,Lt("road",0,0,hs,"x")),Is(i,R.x,R.y,e,t),{built:!0,kind:"demolish",cost:C}):{built:!1,cost:0}}const b=m,v=m==="skyscraper"||m==="tower"?2:1;if(m==="skyscraper"&&d==="metropolis"||m==="tower"&&d==="metropolis"){const y=mh(i,e,t,l,f,d,n,m==="skyscraper"?"premium":"high",a);if(y){const R=Ve(i,y.x,y.y,e,t),C=Di(R.kind,"building",a);if(Number.isFinite(C)){const I=Math.round(p*2.4)+C;if(Xn(n.budget,I,a)&&gh(i,e,t,y.x,y.y,b,v,l))return{built:!0,kind:m==="skyscraper"?"skyscraper-2x2":"tower-2x2",cost:I}}}}if(m==="skyscraper"){if(!af(i,S.x,S.y,e,t,d,n,a))return{built:!1,cost:0}}else if(m==="tower"&&!hh(i,S.x,S.y,e,t,d,n,a))return{built:!1,cost:0};const T=Ve(i,S.x,S.y,e,t),w=Di(T.kind,"building",a);if(!Number.isFinite(w))return{built:!1,cost:0};const _=p+w;return Xn(n.budget,_,a)?dh(i,e,t,S.x,S.y,b,v,l)?{built:!0,kind:m,cost:_}:{built:!1,cost:0}:{built:!1,cost:0}}const vh=1/3;function Mh(i){const e=[];for(let t=0;t<i.length;t++)i[t].construction>0&&e.push(t);return e}function yh(i,e){const t=[];let n=!1;const s=r=>{const o=i[r];if(!o||o.construction<=0)return;const a=Math.ceil(o.construction/3),c=Math.ceil(o.construction/4);o.construction=Math.max(0,o.construction-vh),o.construction>0?(t.push(r),(Math.ceil(o.construction/3)!==a||Math.ceil(o.construction/4)!==c)&&(n=!0)):n=!0};if(e)for(const r of e)s(r);else for(let r=0;r<i.length;r++)s(r);return{indices:t,visualChanged:n}}function Sh(i,e=Qt){const{width:t,height:n,seed:s}=i,r=Vi(s),o=jd(t,n,s,e.terrain),a=Bd(o,t,n,r),c={population:e.population.initial,budget:e.budget.initial,day:0},l=nf(o,c,e),u=Math.round(l.housing*.62),f=Math.max(1,a.length);return l.population=Math.max(e.population.initial,u+(f-1)*4),l.budget=e.budget.initial+Math.round(l.housing*.9)+(f-1)*40,{width:t,height:n,tiles:o,stats:l,vehicles:[],stage:sf(l.population,e),buildCooldown:.8,nextVehicleId:1,seed:s,settlements:a,mapRevision:0,visualRevision:0,constructionIndices:[]}}function vc(i,e,t,n,s,r,o=64){if(!It(n.x,n.y,e,t)||!It(s.x,s.y,e,t))return null;const a=Ve(i,n.x,n.y,e,t),c=Ve(i,s.x,s.y,e,t);if(!a||!c||!r.has(a.kind)||!r.has(c.kind))return null;if(n.x===s.x&&n.y===s.y)return[{...n}];const l=(m,p)=>p*e+m,u=(m,p)=>Math.abs(m-s.x)+Math.abs(p-s.y),f=[],d=new Map,h=new Map,g=l(n.x,n.y);h.set(g,0),f.push({x:n.x,y:n.y,g:0,f:u(n.x,n.y),dx:0,dy:0});let x=0;for(;f.length>0&&x++<e*t*4;){let m=0;for(let S=1;S<f.length;S++)f[S].f<f[m].f&&(m=S);const p=f.splice(m,1)[0];if(p.x===s.x&&p.y===s.y){const S=[{x:p.x,y:p.y}];let b=p.x,v=p.y;for(;b!==n.x||v!==n.y;){const E=d.get(l(b,v));if(!E)break;b=E.x,v=E.y,S.push({x:b,y:v})}return S.reverse(),S.length>o?null:S}for(const S of xt(p.x,p.y,e,t)){const b=Ve(i,S.x,S.y,e,t);if(!b||!r.has(b.kind))continue;const v=S.x-p.x,E=S.y-p.y;let T=1;(p.dx!==0||p.dy!==0)&&(v===p.dx&&E===p.dy?T=.85:T=1.2);const w=p.g+T,_=l(S.x,S.y);w>=(h.get(_)??1/0)||(h.set(_,w),d.set(_,{x:p.x,y:p.y}),f.push({x:S.x,y:S.y,g:w,f:w+u(S.x,S.y),dx:v,dy:E}))}}return null}function ms(i,e,t,n){const s=[];for(let r=0;r<t;r++)for(let o=0;o<e;o++)n(i[r*e+o])&&s.push({x:o,y:r});return s}function cf(i){const e=[0];for(let t=1;t<i.length;t++){const n=i[t-1],s=i[t];e.push(e[t-1]+Math.hypot(s.x-n.x,s.y-n.y))}return e}function lf(i){const e=cf(i);return e[e.length-1]??0}function uf(i,e){i.path=e,i.pathLens=void 0}function ff(i){return i.pathLens&&i.pathLens.length===i.path.length||(i.pathLens=cf(i.path)),i.pathLens}function df(i){const e=ff(i);return e[e.length-1]??0}function bh(i,e,t){if(i.length===0)return{x:0,y:0,dir:0};if(i.length===1){const h=i[0];return{x:h.x,y:h.y,dir:0}}const n=e[e.length-1],s=Math.max(0,Math.min(n,t));let r=0;for(;r<e.length-2&&e[r+1]<s;)r+=1;const o=i[r],a=i[r+1],c=e[r],l=Math.max(1e-6,e[r+1]-c),u=(s-c)/l,f=a.x-o.x,d=a.y-o.y;return{x:o.x+f*u,y:o.y+d*u,dir:Math.atan2(d,f)}}function hf(i,e){return bh(i.path,ff(i),e)}const gl=[0,1,2,3,4,5],Mo=.55,pf=160,Eh=.4,Th=1.8;function Ah(i){if(i.kind!=="train"){i.carPoses=void 0;return}const e=i.cars??4,t=[];for(let s=0;s<e;s++)t.push(hf(i,Math.max(0,i.progress-s*Mo)));i.carPoses=t;const n=t[0];i.x=n.x,i.y=n.y,i.dir=n.dir}function ki(i){if(i.kind==="train")Ah(i);else{const e=hf(i,i.progress);i.x=e.x,i.y=e.y,i.dir=e.dir}}function mf(i,e,t,n=3){const s=i.filter(r=>Math.hypot(r.x-e.x,r.y-e.y)>=n);if(s.length===0){if(i.length<=1)return null;const r=i.filter(o=>o.x!==e.x||o.y!==e.y);return r.length===0?null:r[Ae(t,0,r.length-1)]}return s[Ae(t,0,s.length-1)]}function Mc(i,e,t,n,s=4e3){const r=(l,u)=>u*e+l,o=Ve(i,n.x,n.y,e,t);if(!o||!Ei.has(o.kind))return new Set;const a=new Set,c=[{x:n.x,y:n.y}];for(a.add(r(n.x,n.y));c.length>0&&a.size<s;){const l=c.shift();for(const u of xt(l.x,l.y,e,t)){const f=r(u.x,u.y);if(a.has(f))continue;const d=i[f];Ei.has(d.kind)&&(a.add(f),c.push(u))}}return a}function Rh(i,e,t,n){if(i.length<=1)return i.map(f=>({...f}));if(i.length===2)return i.map(f=>({...f}));const s=f=>`${f.x},${f.y}`,r=i.reduce((f,d)=>f+d.x,0)/i.length,o=i.reduce((f,d)=>f+d.y,0)/i.length;let a=i[0],c=-1;for(const f of i){const d=Math.hypot(f.x-r,f.y-o);d>c&&(c=d,a=f)}const l=[{...a}],u=new Set([s(a)]);for(;l.length<i.length;){const f=l[l.length-1];let d=null,h=Number.POSITIVE_INFINITY;for(const g of i){if(u.has(s(g)))continue;const x=Math.abs(g.x-f.x)+Math.abs(g.y-f.y);x<h&&(h=x,d=g)}if(!d)break;l.push({...d}),u.add(s(d))}return l}function gf(i,e,t,n,s,r){const o={x:Math.round(i.x),y:Math.round(i.y)},a=Ve(e,o.x,o.y,t,n);let c=o;if(!a||!St.has(a.kind)){if(s.length===0)return!1;c=s[Ae(r,0,s.length-1)]}let l=null,u=null;for(let f=0;f<8;f++){if(l=mf(s,c,r,4),!l)return!1;if(u=vc(e,t,n,c,l,St),u&&u.length>=2)break;u=null}return!u||!l?!1:(i.destination=l,uf(i,u),i.progress=0,ki(i),!0)}function wh(i,e,t,n,s,r,o){const a={x:Math.round(i.x),y:Math.round(i.y)},c=Ve(e,a.x,a.y,t,n);let l=a;if(!c||!Ei.has(c.kind)){const m=s.length>0?s:r;if(m.length===0)return!1;l=m[Ae(o,0,m.length-1)]}const u=Mc(e,t,n,l);if(u.size<2)return!1;const f=(m,p)=>p*t+m,d=s.filter(m=>u.has(f(m.x,m.y)));let h=null;if(d.length>=2){const m=Rh(d);let p=0,S=Number.POSITIVE_INFINITY;for(let b=0;b<m.length;b++){const v=m[b],E=Math.hypot(v.x-l.x,v.y-l.y);E<S&&(S=E,p=b)}if(S>1.5)h=m[p];else if(m.length===2)h=m[1-p],i.railDir=p===0?1:-1;else{let b=i.railDir??1,v=p+b;(v<0||v>=m.length)&&(b=b===1?-1:1,v=p+b),(v<0||v>=m.length)&&(v=p===0?1:p-1,b=v>p?1:-1),i.railDir=b,h=m[v]}}else{const m=r.filter(p=>u.has(f(p.x,p.y))&&(p.x!==l.x||p.y!==l.y));if(m.length===0)return!1;h=mf(m,l,o,3)}if(!h)return!1;const g=vc(e,t,n,l,h,Ei,pf);if(!g||g.length<2)return!1;i.destination={x:h.x,y:h.y},uf(i,g);const x=i.cars??4;return i.progress=Math.min((x-1)*Mo,df(i)*.2),ki(i),!0}function Ch(i,e,t){if(i.length<2)return null;const n=Ae(t,3,5),s=i[0],r=i[i.length-1],o={id:e,kind:"train",x:s.x,y:s.y,dir:0,speed:2.4,progress:0,path:i.map(a=>({...a})),destination:{...r},color:0,cars:n,wait:0};return o.progress=Math.min((n-1)*Mo,lf(o.path)*.2),ki(o),o}function Ph(i,e,t,n,s,r,o,a){const c=Vi(o+a*9973>>>0),l=ms(i,e,t,m=>St.has(m.kind)),u=ms(i,e,t,m=>m.kind==="station"),f=Math.min(40,Math.floor(r/8)+Math.floor(l.length/6)),d=n.filter(m=>{if(m.path.length<2)return!1;const p=Ve(i,m.destination.x,m.destination.y,e,t);return p?m.kind==="train"?Ei.has(p.kind):St.has(p.kind):!1});let h=s,g=0,x=d.filter(m=>m.kind!=="train").length;for(;x<f&&l.length>1&&!(++g>60);){const m=l[Ae(c,0,l.length-1)],p=c();let S="car";p>.92?S="bus":p>.82&&(S="truck");const b=S==="bus"?1.6:S==="truck"?1.4:2+c()*.8,v={id:h++,kind:S,x:m.x,y:m.y,dir:0,speed:b,progress:0,path:[m,m],destination:{...m},color:gl[Ae(c,0,gl.length-1)],wait:0};gf(v,i,e,t,l,c)&&(d.push(v),x+=1)}return h=Dh(i,e,t,u,d,h,c),{vehicles:d,nextId:h}}function Ih(i,e,t,n){const s=(c,l)=>l*e+c,r=new Set(n.map(c=>s(c.x,c.y))),o=new Map(n.map(c=>[s(c.x,c.y),c])),a=[];for(;r.size>0;){const c=r.values().next().value,l=o.get(c),u=Mc(i,e,t,l),f=[];for(const d of r)u.has(d)&&f.push(o.get(d));for(const d of f)r.delete(s(d.x,d.y));f.length>0&&a.push(f)}return a}function Lh(i,e,t,n,s){if(s.length===0)return!1;const r=Mc(e,t,n,s[0]),o=(a,c)=>c*t+a;return i.some(a=>a.kind!=="train"?!1:r.has(o(Math.round(a.x),Math.round(a.y))))}function Dh(i,e,t,n,s,r,o){let a=r;if(n.length<2){if(s.every(l=>l.kind!=="train")){const l=ms(i,e,t,f=>Ei.has(f.kind)),u=_l(i,e,t,n,l,a,o);u&&(s.push(u),a=u.id+1)}return a}const c=Ih(i,e,t,n);for(const l of c){if(l.length<2||Lh(s,i,e,t,l))continue;const u=_l(i,e,t,l,l,a,o);u&&(s.push(u),a=u.id+1)}return a}function _l(i,e,t,n,s,r,o){const a=n.length>=2?n:s;if(a.length<2)return null;const c=[];for(let l=0;l<a.length;l++)for(let u=l+1;u<a.length;u++){const f=a[l],d=a[u];c.push({a:f,b:d,d:Math.hypot(f.x-d.x,f.y-d.y)})}c.sort((l,u)=>u.d-l.d);for(const{a:l,b:u}of c){const f=vc(i,e,t,l,u,Ei,pf);if(!f||f.length<2)continue;const d=Ae(o,3,5),h={id:r,kind:"train",x:l.x,y:l.y,dir:0,speed:2.4,progress:0,path:f,destination:{...u},color:0,cars:d,wait:0};return h.progress=Math.min((d-1)*Mo,lf(f)*.2),ki(h),h}return null}function Nh(i,e,t){const n=Vi(t?(t.seed^t.day*7919^i.length*104729)>>>0:1);let s=null,r=null,o=null;const a=()=>{!t||s||(s=ms(t.tiles,t.width,t.height,c=>St.has(c.kind)),r=ms(t.tiles,t.width,t.height,c=>Ei.has(c.kind)),o=ms(t.tiles,t.width,t.height,c=>c.kind==="station"))};for(const c of i){if((c.wait??0)>0){c.wait=Math.max(0,(c.wait??0)-e);continue}const l=df(c);if(l<.01){t&&(a(),xl(c,t,s,r,o,n));continue}if(c.progress+=c.speed*e,c.progress>=l-.001){c.progress=l,ki(c),t?(a(),xl(c,t,s,r,o,n)||(c.progress=l,ki(c))):c.progress=0,c.wait=c.kind==="train"?Th:Eh;continue}ki(c)}}function xl(i,e,t,n,s,r){return i.kind==="train"?wh(i,e.tiles,e.width,e.height,s,n,r):gf(i,e.tiles,e.width,e.height,t,r)}function vl(i={},e){const t={width:i.width??28,height:i.height??28,seed:i.seed??42,secondsPerDay:i.secondsPerDay??2.8};return Sh(t,Qt)}function Uh(i,e,t,n=Qt){const s=[],r=yh(i.tiles,i.constructionIndices);i.constructionIndices=r.indices,r.visualChanged&&(i.visualRevision+=1),Nh(i.vehicles,e,{tiles:i.tiles,width:i.width,height:i.height,seed:i.seed,day:i.stats.day}),i.buildCooldown-=e;const o=n.buildInterval,a=Math.max(o.minSeconds,t*o.dayFactor);if(i.buildCooldown<=0){const c=Vi((i.seed^i.stats.day*374761393^2654435769)>>>0);i.buildCooldown=a*(o.jitterMin+c()*o.jitterRange);const l=i.stats.budget>320?4:i.stats.budget>180?3:i.stats.budget>90?2:1;let u=!1;for(let d=0;d<l;d++){const h=xh(i.tiles,i.width,i.height,i.stats,i.stage,i.seed,i.stats.day*17+d,n,i.settlements);if(!h.built||!h.kind)break;if(u=!0,i.stats.budget-=h.cost,s.push(h.kind),h.trainPath&&h.trainPath.length>=2){const g=Vi((i.seed^i.stats.day*2654435761^d*2246822507)>>>0),x=Ch(h.trainPath,i.nextVehicleId,g);x&&(i.vehicles.push(x),i.nextVehicleId=x.id+1)}if(i.stats.budget+n.budget.debtLimit<40)break}u&&(i.mapRevision+=1,i.visualRevision+=1,i.constructionIndices=Mh(i.tiles)),i.stats.day+=1,i.stats=nf(i.tiles,i.stats,n),i.stats.population=Zd(i.stats,n),i.stage=sf(i.stats.population,n),i.stats.day%3===0&&(zd(i.settlements,i.tiles,i.width,i.height),Hd(i.settlements,i.tiles,i.width,i.height).merged&&s.push("merge"));const f=Ph(i.tiles,i.width,i.height,i.vehicles,i.nextVehicleId,i.stats.population,i.seed,i.stats.day);i.vehicles=f.vehicles,i.nextVehicleId=f.nextId}return{state:i,events:s}}function Fh(){let e=0,t=0,n=0,s=60,r=performance.now(),o=0,a=0;return{beginFrame(c){const l=Math.max(.001,(c-r)/1e3);r=c,o+=1,a+=l,a>=.5&&(s=o/a,o=0,a=0)},markSim(c){e=e*(1-.08)+c*.08},markSync(c){t=t*(1-.08)+c*.08},markDraw(c){n=n*(1-.08)+c*.08},snapshot(){return{fps:s,simMs:e,syncMs:t,drawMs:n,totalMs:e+t+n}}}}function Oh(i,e){const t=[`${i.fps.toFixed(0)}fps`,`sim ${i.simMs.toFixed(1)}`,`sync ${i.syncMs.toFixed(1)}`,`draw ${i.drawMs.toFixed(1)}`];return(e==null?void 0:e.calls)!=null&&t.push(`calls ${e.calls}`),(e==null?void 0:e.vehicles)!=null&&t.push(`veh ${e.vehicles}`),t.join(" · ")}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const yc="185",Bh=0,Ml=1,kh=2,Kr=1,zh=2,Ys=3,ri=0,en=1,Nn=2,ti=0,gs=1,yl=2,Sl=3,bl=4,Hh=5,Ni=100,Vh=101,Gh=102,Wh=103,Xh=104,qh=200,Yh=201,Kh=202,$h=203,Sa=204,ba=205,Zh=206,Jh=207,Qh=208,jh=209,ep=210,tp=211,np=212,ip=213,sp=214,Ea=0,Ta=1,Aa=2,Ms=3,Ra=4,wa=5,Ca=6,Pa=7,_f=0,rp=1,op=2,On=0,xf=1,vf=2,Mf=3,Sc=4,yf=5,Sf=6,bf=7,El="attached",ap="detached",Ef=300,Gi=301,ys=302,Io=303,Lo=304,yo=306,zn=1e3,Un=1001,so=1002,Dt=1003,Tf=1004,Ks=1005,Nt=1006,$r=1007,jn=1008,an=1009,Af=1010,Rf=1011,er=1012,bc=1013,Hn=1014,mn=1015,oi=1016,Ec=1017,Tc=1018,tr=1020,wf=35902,Cf=35899,Pf=1021,If=1022,gn=1023,ai=1026,Fi=1027,Ac=1028,Rc=1029,Wi=1030,wc=1031,Cc=1033,Zr=33776,Jr=33777,Qr=33778,jr=33779,Ia=35840,La=35841,Da=35842,Na=35843,Ua=36196,Fa=37492,Oa=37496,Ba=37488,ka=37489,ro=37490,za=37491,Ha=37808,Va=37809,Ga=37810,Wa=37811,Xa=37812,qa=37813,Ya=37814,Ka=37815,$a=37816,Za=37817,Ja=37818,Qa=37819,ja=37820,ec=37821,tc=36492,nc=36494,ic=36495,sc=36283,rc=36284,oo=36285,oc=36286,nr=2300,ir=2301,Do=2302,Tl=2303,Al=2400,Rl=2401,wl=2402,cp=2500,lp=0,Lf=1,ac=2,up=3200,cc=0,fp=1,Si="",Pt="srgb",un="srgb-linear",ao="linear",ot="srgb",Zi=7680,Cl=519,dp=512,hp=513,pp=514,Pc=515,mp=516,gp=517,Ic=518,_p=519,lc=35044,In=35048,Pl="300 es",Fn=2e3,sr=2001;function xp(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function vp(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function rr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Mp(){const i=rr("canvas");return i.style.display="block",i}const Il={};function co(...i){const e="THREE."+i.shift();console.log(e,...i)}function Df(i){const e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Ce(...i){i=Df(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function Be(...i){i=Df(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function _s(...i){const e=i.join(" ");e in Il||(Il[e]=!0,Ce(...i))}function yp(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const Sp={[Ea]:Ta,[Aa]:Ca,[Ra]:Pa,[Ms]:wa,[Ta]:Ea,[Ca]:Aa,[Pa]:Ra,[wa]:Ms};class qi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}}const Gt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Ll=1234567;const Zs=Math.PI/180,Ss=180/Math.PI;function bn(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Gt[i&255]+Gt[i>>8&255]+Gt[i>>16&255]+Gt[i>>24&255]+"-"+Gt[e&255]+Gt[e>>8&255]+"-"+Gt[e>>16&15|64]+Gt[e>>24&255]+"-"+Gt[t&63|128]+Gt[t>>8&255]+"-"+Gt[t>>16&255]+Gt[t>>24&255]+Gt[n&255]+Gt[n>>8&255]+Gt[n>>16&255]+Gt[n>>24&255]).toLowerCase()}function et(i,e,t){return Math.max(e,Math.min(t,i))}function Lc(i,e){return(i%e+e)%e}function bp(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Ep(i,e,t){return i!==e?(t-i)/(e-i):0}function Js(i,e,t){return(1-t)*i+t*e}function Tp(i,e,t,n){return Js(i,e,1-Math.exp(-t*n))}function Ap(i,e=1){return e-Math.abs(Lc(i,e*2)-e)}function Rp(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function wp(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Cp(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Pp(i,e){return i+Math.random()*(e-i)}function Ip(i){return i*(.5-Math.random())}function Lp(i){i!==void 0&&(Ll=i);let e=Ll+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Dp(i){return i*Zs}function Np(i){return i*Ss}function Up(i){return(i&i-1)===0&&i!==0}function Fp(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Op(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Bp(i,e,t,n,s){const r=Math.cos,o=Math.sin,a=r(t/2),c=o(t/2),l=r((e+n)/2),u=o((e+n)/2),f=r((e-n)/2),d=o((e-n)/2),h=r((n-e)/2),g=o((n-e)/2);switch(s){case"XYX":i.set(a*u,c*f,c*d,a*l);break;case"YZY":i.set(c*d,a*u,c*f,a*l);break;case"ZXZ":i.set(c*f,c*d,a*u,a*l);break;case"XZX":i.set(a*u,c*g,c*h,a*l);break;case"YXY":i.set(c*h,a*u,c*g,a*l);break;case"ZYZ":i.set(c*g,c*h,a*u,a*l);break;default:Ce("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function yn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function at(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const kp={DEG2RAD:Zs,RAD2DEG:Ss,generateUUID:bn,clamp:et,euclideanModulo:Lc,mapLinear:bp,inverseLerp:Ep,lerp:Js,damp:Tp,pingpong:Ap,smoothstep:Rp,smootherstep:wp,randInt:Cp,randFloat:Pp,randFloatSpread:Ip,seededRandom:Lp,degToRad:Dp,radToDeg:Np,isPowerOfTwo:Up,ceilPowerOfTwo:Fp,floorPowerOfTwo:Op,setQuaternionFromProperEuler:Bp,normalize:at,denormalize:yn},Wc=class Wc{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=et(this.x,e.x,t.x),this.y=et(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=et(this.x,e,t),this.y=et(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(et(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(et(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Wc.prototype.isVector2=!0;let Je=Wc;class ci{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let c=n[s+0],l=n[s+1],u=n[s+2],f=n[s+3],d=r[o+0],h=r[o+1],g=r[o+2],x=r[o+3];if(f!==x||c!==d||l!==h||u!==g){let m=c*d+l*h+u*g+f*x;m<0&&(d=-d,h=-h,g=-g,x=-x,m=-m);let p=1-a;if(m<.9995){const S=Math.acos(m),b=Math.sin(S);p=Math.sin(p*S)/b,a=Math.sin(a*S)/b,c=c*p+d*a,l=l*p+h*a,u=u*p+g*a,f=f*p+x*a}else{c=c*p+d*a,l=l*p+h*a,u=u*p+g*a,f=f*p+x*a;const S=1/Math.sqrt(c*c+l*l+u*u+f*f);c*=S,l*=S,u*=S,f*=S}}e[t]=c,e[t+1]=l,e[t+2]=u,e[t+3]=f}static multiplyQuaternionsFlat(e,t,n,s,r,o){const a=n[s],c=n[s+1],l=n[s+2],u=n[s+3],f=r[o],d=r[o+1],h=r[o+2],g=r[o+3];return e[t]=a*g+u*f+c*h-l*d,e[t+1]=c*g+u*d+l*f-a*h,e[t+2]=l*g+u*h+a*d-c*f,e[t+3]=u*g-a*f-c*d-l*h,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(n/2),u=a(s/2),f=a(r/2),d=c(n/2),h=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=d*u*f+l*h*g,this._y=l*h*f-d*u*g,this._z=l*u*g+d*h*f,this._w=l*u*f-d*h*g;break;case"YXZ":this._x=d*u*f+l*h*g,this._y=l*h*f-d*u*g,this._z=l*u*g-d*h*f,this._w=l*u*f+d*h*g;break;case"ZXY":this._x=d*u*f-l*h*g,this._y=l*h*f+d*u*g,this._z=l*u*g+d*h*f,this._w=l*u*f-d*h*g;break;case"ZYX":this._x=d*u*f-l*h*g,this._y=l*h*f+d*u*g,this._z=l*u*g-d*h*f,this._w=l*u*f+d*h*g;break;case"YZX":this._x=d*u*f+l*h*g,this._y=l*h*f+d*u*g,this._z=l*u*g-d*h*f,this._w=l*u*f-d*h*g;break;case"XZY":this._x=d*u*f-l*h*g,this._y=l*h*f-d*u*g,this._z=l*u*g+d*h*f,this._w=l*u*f+d*h*g;break;default:Ce("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],c=t[9],l=t[2],u=t[6],f=t[10],d=n+a+f;if(d>0){const h=.5/Math.sqrt(d+1);this._w=.25/h,this._x=(u-c)*h,this._y=(r-l)*h,this._z=(o-s)*h}else if(n>a&&n>f){const h=2*Math.sqrt(1+n-a-f);this._w=(u-c)/h,this._x=.25*h,this._y=(s+o)/h,this._z=(r+l)/h}else if(a>f){const h=2*Math.sqrt(1+a-n-f);this._w=(r-l)/h,this._x=(s+o)/h,this._y=.25*h,this._z=(c+u)/h}else{const h=2*Math.sqrt(1+f-n-a);this._w=(o-s)/h,this._x=(r+l)/h,this._y=(c+u)/h,this._z=.25*h}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(et(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,c=t._y,l=t._z,u=t._w;return this._x=n*u+o*a+s*l-r*c,this._y=s*u+o*c+r*a-n*l,this._z=r*u+o*l+n*c-s*a,this._w=o*u-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=this.dot(e);a<0&&(n=-n,s=-s,r=-r,o=-o,a=-a);let c=1-t;if(a<.9995){const l=Math.acos(a),u=Math.sin(l);c=Math.sin(c*l)/u,t=Math.sin(t*l)/u,this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+o*t,this._onChangeCallback()}else this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+o*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Xc=class Xc{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Dl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Dl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*s-a*n),u=2*(a*t-r*s),f=2*(r*n-o*t);return this.x=t+c*l+o*f-a*u,this.y=n+c*u+a*l-r*f,this.z=s+c*f+r*u-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=et(this.x,e.x,t.x),this.y=et(this.y,e.y,t.y),this.z=et(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=et(this.x,e,t),this.y=et(this.y,e,t),this.z=et(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(et(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,c=t.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return No.copy(this).projectOnVector(e),this.sub(No)}reflect(e){return this.sub(No.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(et(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Xc.prototype.isVector3=!0;let k=Xc;const No=new k,Dl=new ci,qc=class qc{constructor(e,t,n,s,r,o,a,c,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,l)}set(e,t,n,s,r,o,a,c,l){const u=this.elements;return u[0]=e,u[1]=s,u[2]=a,u[3]=t,u[4]=r,u[5]=c,u[6]=n,u[7]=o,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],u=n[4],f=n[7],d=n[2],h=n[5],g=n[8],x=s[0],m=s[3],p=s[6],S=s[1],b=s[4],v=s[7],E=s[2],T=s[5],w=s[8];return r[0]=o*x+a*S+c*E,r[3]=o*m+a*b+c*T,r[6]=o*p+a*v+c*w,r[1]=l*x+u*S+f*E,r[4]=l*m+u*b+f*T,r[7]=l*p+u*v+f*w,r[2]=d*x+h*S+g*E,r[5]=d*m+h*b+g*T,r[8]=d*p+h*v+g*w,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8];return t*o*u-t*a*l-n*r*u+n*a*c+s*r*l-s*o*c}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],f=u*o-a*l,d=a*c-u*r,h=l*r-o*c,g=t*f+n*d+s*h;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/g;return e[0]=f*x,e[1]=(s*l-u*n)*x,e[2]=(a*n-s*o)*x,e[3]=d*x,e[4]=(u*t-s*c)*x,e[5]=(s*r-a*t)*x,e[6]=h*x,e[7]=(n*c-l*t)*x,e[8]=(o*t-n*r)*x,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+e,-s*l,s*c,-s*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return _s("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Uo.makeScale(e,t)),this}rotate(e){return _s("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Uo.makeRotation(-e)),this}translate(e,t){return _s("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Uo.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};qc.prototype.isMatrix3=!0;let He=qc;const Uo=new He,Nl=new He().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ul=new He().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function zp(){const i={enabled:!0,workingColorSpace:un,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===ot&&(s.r=ni(s.r),s.g=ni(s.g),s.b=ni(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===ot&&(s.r=xs(s.r),s.g=xs(s.g),s.b=xs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Si?ao:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return _s("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return _s("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[un]:{primaries:e,whitePoint:n,transfer:ao,toXYZ:Nl,fromXYZ:Ul,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Pt},outputColorSpaceConfig:{drawingBufferColorSpace:Pt}},[Pt]:{primaries:e,whitePoint:n,transfer:ot,toXYZ:Nl,fromXYZ:Ul,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Pt}}}),i}const je=zp();function ni(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function xs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Ji;class Hp{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Ji===void 0&&(Ji=rr("canvas")),Ji.width=e.width,Ji.height=e.height;const s=Ji.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Ji}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=rr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=ni(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(ni(t[n]/255)*255):t[n]=ni(t[n]);return{data:t,width:e.width,height:e.height}}else return Ce("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Vp=0;class Dc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Vp++}),this.uuid=bn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Fo(s[o].image)):r.push(Fo(s[o]))}else r=Fo(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function Fo(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Hp.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Ce("Texture: Unable to serialize Texture."),{})}let Gp=0;const Oo=new k;class Ut extends qi{constructor(e=Ut.DEFAULT_IMAGE,t=Ut.DEFAULT_MAPPING,n=Un,s=Un,r=Nt,o=jn,a=gn,c=an,l=Ut.DEFAULT_ANISOTROPY,u=Si){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Gp++}),this.uuid=bn(),this.name="",this.source=new Dc(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new Je(0,0),this.repeat=new Je(1,1),this.center=new Je(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new He,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Oo).x}get height(){return this.source.getSize(Oo).y}get depth(){return this.source.getSize(Oo).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){Ce(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ce(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Ef)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case zn:e.x=e.x-Math.floor(e.x);break;case Un:e.x=e.x<0?0:1;break;case so:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case zn:e.y=e.y-Math.floor(e.y);break;case Un:e.y=e.y<0?0:1;break;case so:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Ut.DEFAULT_IMAGE=null;Ut.DEFAULT_MAPPING=Ef;Ut.DEFAULT_ANISOTROPY=1;const Yc=class Yc{constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const c=e.elements,l=c[0],u=c[4],f=c[8],d=c[1],h=c[5],g=c[9],x=c[2],m=c[6],p=c[10];if(Math.abs(u-d)<.01&&Math.abs(f-x)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(f+x)<.1&&Math.abs(g+m)<.1&&Math.abs(l+h+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const b=(l+1)/2,v=(h+1)/2,E=(p+1)/2,T=(u+d)/4,w=(f+x)/4,_=(g+m)/4;return b>v&&b>E?b<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(b),s=T/n,r=w/n):v>E?v<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),n=T/s,r=_/s):E<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),n=w/r,s=_/r),this.set(n,s,r,t),this}let S=Math.sqrt((m-g)*(m-g)+(f-x)*(f-x)+(d-u)*(d-u));return Math.abs(S)<.001&&(S=1),this.x=(m-g)/S,this.y=(f-x)/S,this.z=(d-u)/S,this.w=Math.acos((l+h+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=et(this.x,e.x,t.x),this.y=et(this.y,e.y,t.y),this.z=et(this.z,e.z,t.z),this.w=et(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=et(this.x,e,t),this.y=et(this.y,e,t),this.z=et(this.z,e,t),this.w=et(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(et(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Yc.prototype.isVector4=!0;let ft=Yc;class Wp extends qi{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Nt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new ft(0,0,e,t),this.scissorTest=!1,this.viewport=new ft(0,0,e,t),this.textures=[];const s={width:e,height:t,depth:n.depth},r=new Ut(s),o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:Nt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Dc(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Bn extends Wp{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Nf extends Ut{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Dt,this.minFilter=Dt,this.wrapR=Un,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Xp extends Ut{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Dt,this.minFilter=Dt,this.wrapR=Un,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const _o=class _o{constructor(e,t,n,s,r,o,a,c,l,u,f,d,h,g,x,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,l,u,f,d,h,g,x,m)}set(e,t,n,s,r,o,a,c,l,u,f,d,h,g,x,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=u,p[10]=f,p[14]=d,p[3]=h,p[7]=g,p[11]=x,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new _o().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,n=e.elements,s=1/Qi.setFromMatrixColumn(e,0).length(),r=1/Qi.setFromMatrixColumn(e,1).length(),o=1/Qi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),u=Math.cos(r),f=Math.sin(r);if(e.order==="XYZ"){const d=o*u,h=o*f,g=a*u,x=a*f;t[0]=c*u,t[4]=-c*f,t[8]=l,t[1]=h+g*l,t[5]=d-x*l,t[9]=-a*c,t[2]=x-d*l,t[6]=g+h*l,t[10]=o*c}else if(e.order==="YXZ"){const d=c*u,h=c*f,g=l*u,x=l*f;t[0]=d+x*a,t[4]=g*a-h,t[8]=o*l,t[1]=o*f,t[5]=o*u,t[9]=-a,t[2]=h*a-g,t[6]=x+d*a,t[10]=o*c}else if(e.order==="ZXY"){const d=c*u,h=c*f,g=l*u,x=l*f;t[0]=d-x*a,t[4]=-o*f,t[8]=g+h*a,t[1]=h+g*a,t[5]=o*u,t[9]=x-d*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){const d=o*u,h=o*f,g=a*u,x=a*f;t[0]=c*u,t[4]=g*l-h,t[8]=d*l+x,t[1]=c*f,t[5]=x*l+d,t[9]=h*l-g,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){const d=o*c,h=o*l,g=a*c,x=a*l;t[0]=c*u,t[4]=x-d*f,t[8]=g*f+h,t[1]=f,t[5]=o*u,t[9]=-a*u,t[2]=-l*u,t[6]=h*f+g,t[10]=d-x*f}else if(e.order==="XZY"){const d=o*c,h=o*l,g=a*c,x=a*l;t[0]=c*u,t[4]=-f,t[8]=l*u,t[1]=d*f+x,t[5]=o*u,t[9]=h*f-g,t[2]=g*f-h,t[6]=a*u,t[10]=x*f+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(qp,e,Yp)}lookAt(e,t,n){const s=this.elements;return sn.subVectors(e,t),sn.lengthSq()===0&&(sn.z=1),sn.normalize(),hi.crossVectors(n,sn),hi.lengthSq()===0&&(Math.abs(n.z)===1?sn.x+=1e-4:sn.z+=1e-4,sn.normalize(),hi.crossVectors(n,sn)),hi.normalize(),gr.crossVectors(sn,hi),s[0]=hi.x,s[4]=gr.x,s[8]=sn.x,s[1]=hi.y,s[5]=gr.y,s[9]=sn.y,s[2]=hi.z,s[6]=gr.z,s[10]=sn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],u=n[1],f=n[5],d=n[9],h=n[13],g=n[2],x=n[6],m=n[10],p=n[14],S=n[3],b=n[7],v=n[11],E=n[15],T=s[0],w=s[4],_=s[8],y=s[12],R=s[1],C=s[5],I=s[9],D=s[13],F=s[2],L=s[6],G=s[10],O=s[14],H=s[3],Z=s[7],ne=s[11],re=s[15];return r[0]=o*T+a*R+c*F+l*H,r[4]=o*w+a*C+c*L+l*Z,r[8]=o*_+a*I+c*G+l*ne,r[12]=o*y+a*D+c*O+l*re,r[1]=u*T+f*R+d*F+h*H,r[5]=u*w+f*C+d*L+h*Z,r[9]=u*_+f*I+d*G+h*ne,r[13]=u*y+f*D+d*O+h*re,r[2]=g*T+x*R+m*F+p*H,r[6]=g*w+x*C+m*L+p*Z,r[10]=g*_+x*I+m*G+p*ne,r[14]=g*y+x*D+m*O+p*re,r[3]=S*T+b*R+v*F+E*H,r[7]=S*w+b*C+v*L+E*Z,r[11]=S*_+b*I+v*G+E*ne,r[15]=S*y+b*D+v*O+E*re,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],c=e[9],l=e[13],u=e[2],f=e[6],d=e[10],h=e[14],g=e[3],x=e[7],m=e[11],p=e[15],S=c*h-l*d,b=a*h-l*f,v=a*d-c*f,E=o*h-l*u,T=o*d-c*u,w=o*f-a*u;return t*(x*S-m*b+p*v)-n*(g*S-m*E+p*T)+s*(g*b-x*E+p*w)-r*(g*v-x*T+m*w)}determinantAffine(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],o=e[5],a=e[9],c=e[2],l=e[6],u=e[10];return t*(o*u-a*l)-n*(r*u-a*c)+s*(r*l-o*c)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],f=e[9],d=e[10],h=e[11],g=e[12],x=e[13],m=e[14],p=e[15],S=t*a-n*o,b=t*c-s*o,v=t*l-r*o,E=n*c-s*a,T=n*l-r*a,w=s*l-r*c,_=u*x-f*g,y=u*m-d*g,R=u*p-h*g,C=f*m-d*x,I=f*p-h*x,D=d*p-h*m,F=S*D-b*I+v*C+E*R-T*y+w*_;if(F===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const L=1/F;return e[0]=(a*D-c*I+l*C)*L,e[1]=(s*I-n*D-r*C)*L,e[2]=(x*w-m*T+p*E)*L,e[3]=(d*T-f*w-h*E)*L,e[4]=(c*R-o*D-l*y)*L,e[5]=(t*D-s*R+r*y)*L,e[6]=(m*v-g*w-p*b)*L,e[7]=(u*w-d*v+h*b)*L,e[8]=(o*I-a*R+l*_)*L,e[9]=(n*R-t*I-r*_)*L,e[10]=(g*T-x*v+p*S)*L,e[11]=(f*v-u*T-h*S)*L,e[12]=(a*y-o*C-c*_)*L,e[13]=(t*C-n*y+s*_)*L,e[14]=(x*b-g*E-m*S)*L,e[15]=(u*E-f*b+d*S)*L,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,c=e.z,l=r*o,u=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,u*a+n,u*c-s*o,0,l*c-s*a,u*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,o=t._y,a=t._z,c=t._w,l=r+r,u=o+o,f=a+a,d=r*l,h=r*u,g=r*f,x=o*u,m=o*f,p=a*f,S=c*l,b=c*u,v=c*f,E=n.x,T=n.y,w=n.z;return s[0]=(1-(x+p))*E,s[1]=(h+v)*E,s[2]=(g-b)*E,s[3]=0,s[4]=(h-v)*T,s[5]=(1-(d+p))*T,s[6]=(m+S)*T,s[7]=0,s[8]=(g+b)*w,s[9]=(m-S)*w,s[10]=(1-(d+x))*w,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let o=Qi.set(s[0],s[1],s[2]).length();const a=Qi.set(s[4],s[5],s[6]).length(),c=Qi.set(s[8],s[9],s[10]).length();r<0&&(o=-o),_n.copy(this);const l=1/o,u=1/a,f=1/c;return _n.elements[0]*=l,_n.elements[1]*=l,_n.elements[2]*=l,_n.elements[4]*=u,_n.elements[5]*=u,_n.elements[6]*=u,_n.elements[8]*=f,_n.elements[9]*=f,_n.elements[10]*=f,t.setFromRotationMatrix(_n),n.x=o,n.y=a,n.z=c,this}makePerspective(e,t,n,s,r,o,a=Fn,c=!1){const l=this.elements,u=2*r/(t-e),f=2*r/(n-s),d=(t+e)/(t-e),h=(n+s)/(n-s);let g,x;if(c)g=r/(o-r),x=o*r/(o-r);else if(a===Fn)g=-(o+r)/(o-r),x=-2*o*r/(o-r);else if(a===sr)g=-o/(o-r),x=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=f,l[9]=h,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=Fn,c=!1){const l=this.elements,u=2/(t-e),f=2/(n-s),d=-(t+e)/(t-e),h=-(n+s)/(n-s);let g,x;if(c)g=1/(o-r),x=o/(o-r);else if(a===Fn)g=-2/(o-r),x=-(o+r)/(o-r);else if(a===sr)g=-1/(o-r),x=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=f,l[9]=0,l[13]=h,l[2]=0,l[6]=0,l[10]=g,l[14]=x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};_o.prototype.isMatrix4=!0;let Ke=_o;const Qi=new k,_n=new Ke,qp=new k(0,0,0),Yp=new k(1,1,1),hi=new k,gr=new k,sn=new k,Fl=new Ke,Ol=new ci;class Ti{constructor(e=0,t=0,n=0,s=Ti.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],u=s[9],f=s[2],d=s[6],h=s[10];switch(t){case"XYZ":this._y=Math.asin(et(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,h),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-et(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,h),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(et(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,h),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-et(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,h),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(et(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(a,h));break;case"XZY":this._z=Math.asin(-et(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,h),this._y=0);break;default:Ce("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Fl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Fl,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Ol.setFromEuler(this),this.setFromQuaternion(Ol,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ti.DEFAULT_ORDER="XYZ";class Uf{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Kp=0;const Bl=new k,ji=new ci,qn=new Ke,_r=new k,Ds=new k,$p=new k,Zp=new ci,kl=new k(1,0,0),zl=new k(0,1,0),Hl=new k(0,0,1),Vl={type:"added"},Jp={type:"removed"},es={type:"childadded",child:null},Bo={type:"childremoved",child:null};class mt extends qi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Kp++}),this.uuid=bn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=mt.DEFAULT_UP.clone();const e=new k,t=new Ti,n=new ci,s=new k(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Ke},normalMatrix:{value:new He}}),this.matrix=new Ke,this.matrixWorld=new Ke,this.matrixAutoUpdate=mt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=mt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Uf,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ji.setFromAxisAngle(e,t),this.quaternion.multiply(ji),this}rotateOnWorldAxis(e,t){return ji.setFromAxisAngle(e,t),this.quaternion.premultiply(ji),this}rotateX(e){return this.rotateOnAxis(kl,e)}rotateY(e){return this.rotateOnAxis(zl,e)}rotateZ(e){return this.rotateOnAxis(Hl,e)}translateOnAxis(e,t){return Bl.copy(e).applyQuaternion(this.quaternion),this.position.add(Bl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(kl,e)}translateY(e){return this.translateOnAxis(zl,e)}translateZ(e){return this.translateOnAxis(Hl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(qn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?_r.copy(e):_r.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Ds.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?qn.lookAt(Ds,_r,this.up):qn.lookAt(_r,Ds,this.up),this.quaternion.setFromRotationMatrix(qn),s&&(qn.extractRotation(s.matrixWorld),ji.setFromRotationMatrix(qn),this.quaternion.premultiply(ji.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Be("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Vl),es.child=e,this.dispatchEvent(es),es.child=null):Be("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Jp),Bo.child=e,this.dispatchEvent(Bo),Bo.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),qn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),qn.multiply(e.parent.matrixWorld)),e.applyMatrix4(qn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Vl),es.child=e,this.dispatchEvent(es),es.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ds,e,$p),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ds,Zp,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){const r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,n)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){const f=c[l];r(e.shapes,f)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(e.materials,this.material[c]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(r(e.animations,c))}}if(t){const a=o(e.geometries),c=o(e.materials),l=o(e.textures),u=o(e.images),f=o(e.shapes),d=o(e.skeletons),h=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),u.length>0&&(n.images=u),f.length>0&&(n.shapes=f),d.length>0&&(n.skeletons=d),h.length>0&&(n.animations=h),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const c=[];for(const l in a){const u=a[l];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}mt.DEFAULT_UP=new k(0,1,0);mt.DEFAULT_MATRIX_AUTO_UPDATE=!0;mt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Rt extends mt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Qp={type:"move"};class ko{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Rt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Rt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new k,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new k),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Rt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new k,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new k,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(const x of e.hand.values()){const m=t.getJointPose(x,n),p=this._getHandJoint(l,x);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const u=l.joints["index-finger-tip"],f=l.joints["thumb-tip"],d=u.position.distanceTo(f.position),h=.02,g=.005;l.inputState.pinching&&d>h+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&d<=h-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Qp)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Rt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const Ff={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},pi={h:0,s:0,l:0},xr={h:0,s:0,l:0};function zo(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Fe{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Pt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,je.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=je.workingColorSpace){return this.r=e,this.g=t,this.b=n,je.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=je.workingColorSpace){if(e=Lc(e,1),t=et(t,0,1),n=et(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=zo(o,r,e+1/3),this.g=zo(o,r,e),this.b=zo(o,r,e-1/3)}return je.colorSpaceToWorking(this,s),this}setStyle(e,t=Pt){function n(r){r!==void 0&&parseFloat(r)<1&&Ce("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ce("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);Ce("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Pt){const n=Ff[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Ce("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ni(e.r),this.g=ni(e.g),this.b=ni(e.b),this}copyLinearToSRGB(e){return this.r=xs(e.r),this.g=xs(e.g),this.b=xs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Pt){return je.workingToColorSpace(Wt.copy(this),e),Math.round(et(Wt.r*255,0,255))*65536+Math.round(et(Wt.g*255,0,255))*256+Math.round(et(Wt.b*255,0,255))}getHexString(e=Pt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=je.workingColorSpace){je.workingToColorSpace(Wt.copy(this),t);const n=Wt.r,s=Wt.g,r=Wt.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let c,l;const u=(a+o)/2;if(a===o)c=0,l=0;else{const f=o-a;switch(l=u<=.5?f/(o+a):f/(2-o-a),o){case n:c=(s-r)/f+(s<r?6:0);break;case s:c=(r-n)/f+2;break;case r:c=(n-s)/f+4;break}c/=6}return e.h=c,e.s=l,e.l=u,e}getRGB(e,t=je.workingColorSpace){return je.workingToColorSpace(Wt.copy(this),t),e.r=Wt.r,e.g=Wt.g,e.b=Wt.b,e}getStyle(e=Pt){je.workingToColorSpace(Wt.copy(this),e);const t=Wt.r,n=Wt.g,s=Wt.b;return e!==Pt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(pi),this.setHSL(pi.h+e,pi.s+t,pi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(pi),e.getHSL(xr);const n=Js(pi.h,xr.h,t),s=Js(pi.s,xr.s,t),r=Js(pi.l,xr.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Wt=new Fe;Fe.NAMES=Ff;class Nc{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Fe(e),this.density=t}clone(){return new Nc(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class jp extends mt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ti,this.environmentIntensity=1,this.environmentRotation=new Ti,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const xn=new k,Yn=new k,Ho=new k,Kn=new k,ts=new k,ns=new k,Gl=new k,Vo=new k,Go=new k,Wo=new k,Xo=new ft,qo=new ft,Yo=new ft;class Sn{constructor(e=new k,t=new k,n=new k){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),xn.subVectors(e,t),s.cross(xn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){xn.subVectors(s,t),Yn.subVectors(n,t),Ho.subVectors(e,t);const o=xn.dot(xn),a=xn.dot(Yn),c=xn.dot(Ho),l=Yn.dot(Yn),u=Yn.dot(Ho),f=o*l-a*a;if(f===0)return r.set(0,0,0),null;const d=1/f,h=(l*c-a*u)*d,g=(o*u-a*c)*d;return r.set(1-h-g,g,h)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Kn)===null?!1:Kn.x>=0&&Kn.y>=0&&Kn.x+Kn.y<=1}static getInterpolation(e,t,n,s,r,o,a,c){return this.getBarycoord(e,t,n,s,Kn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Kn.x),c.addScaledVector(o,Kn.y),c.addScaledVector(a,Kn.z),c)}static getInterpolatedAttribute(e,t,n,s,r,o){return Xo.setScalar(0),qo.setScalar(0),Yo.setScalar(0),Xo.fromBufferAttribute(e,t),qo.fromBufferAttribute(e,n),Yo.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(Xo,r.x),o.addScaledVector(qo,r.y),o.addScaledVector(Yo,r.z),o}static isFrontFacing(e,t,n,s){return xn.subVectors(n,t),Yn.subVectors(e,t),xn.cross(Yn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return xn.subVectors(this.c,this.b),Yn.subVectors(this.a,this.b),xn.cross(Yn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Sn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Sn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return Sn.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return Sn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Sn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let o,a;ts.subVectors(s,n),ns.subVectors(r,n),Vo.subVectors(e,n);const c=ts.dot(Vo),l=ns.dot(Vo);if(c<=0&&l<=0)return t.copy(n);Go.subVectors(e,s);const u=ts.dot(Go),f=ns.dot(Go);if(u>=0&&f<=u)return t.copy(s);const d=c*f-u*l;if(d<=0&&c>=0&&u<=0)return o=c/(c-u),t.copy(n).addScaledVector(ts,o);Wo.subVectors(e,r);const h=ts.dot(Wo),g=ns.dot(Wo);if(g>=0&&h<=g)return t.copy(r);const x=h*l-c*g;if(x<=0&&l>=0&&g<=0)return a=l/(l-g),t.copy(n).addScaledVector(ns,a);const m=u*g-h*f;if(m<=0&&f-u>=0&&h-g>=0)return Gl.subVectors(r,s),a=(f-u)/(f-u+(h-g)),t.copy(s).addScaledVector(Gl,a);const p=1/(m+x+d);return o=x*p,a=d*p,t.copy(n).addScaledVector(ts,o).addScaledVector(ns,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class li{constructor(e=new k(1/0,1/0,1/0),t=new k(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(vn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(vn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=vn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,vn):vn.fromBufferAttribute(r,o),vn.applyMatrix4(e.matrixWorld),this.expandByPoint(vn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),vr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),vr.copy(n.boundingBox)),vr.applyMatrix4(e.matrixWorld),this.union(vr)}const s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,vn),vn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ns),Mr.subVectors(this.max,Ns),is.subVectors(e.a,Ns),ss.subVectors(e.b,Ns),rs.subVectors(e.c,Ns),mi.subVectors(ss,is),gi.subVectors(rs,ss),Ri.subVectors(is,rs);let t=[0,-mi.z,mi.y,0,-gi.z,gi.y,0,-Ri.z,Ri.y,mi.z,0,-mi.x,gi.z,0,-gi.x,Ri.z,0,-Ri.x,-mi.y,mi.x,0,-gi.y,gi.x,0,-Ri.y,Ri.x,0];return!Ko(t,is,ss,rs,Mr)||(t=[1,0,0,0,1,0,0,0,1],!Ko(t,is,ss,rs,Mr))?!1:(yr.crossVectors(mi,gi),t=[yr.x,yr.y,yr.z],Ko(t,is,ss,rs,Mr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,vn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(vn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:($n[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),$n[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),$n[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),$n[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),$n[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),$n[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),$n[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),$n[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints($n),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const $n=[new k,new k,new k,new k,new k,new k,new k,new k],vn=new k,vr=new li,is=new k,ss=new k,rs=new k,mi=new k,gi=new k,Ri=new k,Ns=new k,Mr=new k,yr=new k,wi=new k;function Ko(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){wi.fromArray(i,r);const a=s.x*Math.abs(wi.x)+s.y*Math.abs(wi.y)+s.z*Math.abs(wi.z),c=e.dot(wi),l=t.dot(wi),u=n.dot(wi);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>a)return!1}return!0}const Ct=new k,Sr=new Je;let em=0;class Jt extends qi{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:em++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=lc,this.updateRanges=[],this.gpuType=mn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Sr.fromBufferAttribute(this,t),Sr.applyMatrix3(e),this.setXY(t,Sr.x,Sr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ct.fromBufferAttribute(this,t),Ct.applyMatrix3(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ct.fromBufferAttribute(this,t),Ct.applyMatrix4(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ct.fromBufferAttribute(this,t),Ct.applyNormalMatrix(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ct.fromBufferAttribute(this,t),Ct.transformDirection(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=yn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=at(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=yn(t,this.array)),t}setX(e,t){return this.normalized&&(t=at(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=yn(t,this.array)),t}setY(e,t){return this.normalized&&(t=at(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=yn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=at(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=yn(t,this.array)),t}setW(e,t){return this.normalized&&(t=at(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=at(t,this.array),n=at(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=at(t,this.array),n=at(n,this.array),s=at(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=at(t,this.array),n=at(n,this.array),s=at(s,this.array),r=at(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==lc&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class Of extends Jt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Bf extends Jt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Ht extends Jt{constructor(e,t,n){super(new Float32Array(e),t,n)}}const tm=new li,Us=new k,$o=new k;class Gn{constructor(e=new k,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):tm.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Us.subVectors(e,this.center);const t=Us.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Us,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):($o.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Us.copy(e.center).add($o)),this.expandByPoint(Us.copy(e.center).sub($o))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let nm=0;const hn=new Ke,Zo=new mt,os=new k,rn=new li,Fs=new li,Bt=new k;class tn extends qi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:nm++}),this.uuid=bn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(xp(e)?Bf:Of)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new He().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return hn.makeRotationFromQuaternion(e),this.applyMatrix4(hn),this}rotateX(e){return hn.makeRotationX(e),this.applyMatrix4(hn),this}rotateY(e){return hn.makeRotationY(e),this.applyMatrix4(hn),this}rotateZ(e){return hn.makeRotationZ(e),this.applyMatrix4(hn),this}translate(e,t,n){return hn.makeTranslation(e,t,n),this.applyMatrix4(hn),this}scale(e,t,n){return hn.makeScale(e,t,n),this.applyMatrix4(hn),this}lookAt(e){return Zo.lookAt(e),Zo.updateMatrix(),this.applyMatrix4(Zo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(os).negate(),this.translate(os.x,os.y,os.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Ht(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Ce("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new li);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Be("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new k(-1/0,-1/0,-1/0),new k(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];rn.setFromBufferAttribute(r),this.morphTargetsRelative?(Bt.addVectors(this.boundingBox.min,rn.min),this.boundingBox.expandByPoint(Bt),Bt.addVectors(this.boundingBox.max,rn.max),this.boundingBox.expandByPoint(Bt)):(this.boundingBox.expandByPoint(rn.min),this.boundingBox.expandByPoint(rn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Be('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Gn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Be("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new k,1/0);return}if(e){const n=this.boundingSphere.center;if(rn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){const a=t[r];Fs.setFromBufferAttribute(a),this.morphTargetsRelative?(Bt.addVectors(rn.min,Fs.min),rn.expandByPoint(Bt),Bt.addVectors(rn.max,Fs.max),rn.expandByPoint(Bt)):(rn.expandByPoint(Fs.min),rn.expandByPoint(Fs.max))}rn.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)Bt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Bt));if(t)for(let r=0,o=t.length;r<o;r++){const a=t[r],c=this.morphTargetsRelative;for(let l=0,u=a.count;l<u;l++)Bt.fromBufferAttribute(a,l),c&&(os.fromBufferAttribute(e,l),Bt.add(os)),s=Math.max(s,n.distanceToSquared(Bt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Be('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Be("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;let o=this.getAttribute("tangent");(o===void 0||o.count!==n.count)&&(o=new Jt(new Float32Array(4*n.count),4),this.setAttribute("tangent",o));const a=[],c=[];for(let _=0;_<n.count;_++)a[_]=new k,c[_]=new k;const l=new k,u=new k,f=new k,d=new Je,h=new Je,g=new Je,x=new k,m=new k;function p(_,y,R){l.fromBufferAttribute(n,_),u.fromBufferAttribute(n,y),f.fromBufferAttribute(n,R),d.fromBufferAttribute(r,_),h.fromBufferAttribute(r,y),g.fromBufferAttribute(r,R),u.sub(l),f.sub(l),h.sub(d),g.sub(d);const C=1/(h.x*g.y-g.x*h.y);isFinite(C)&&(x.copy(u).multiplyScalar(g.y).addScaledVector(f,-h.y).multiplyScalar(C),m.copy(f).multiplyScalar(h.x).addScaledVector(u,-g.x).multiplyScalar(C),a[_].add(x),a[y].add(x),a[R].add(x),c[_].add(m),c[y].add(m),c[R].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:e.count}]);for(let _=0,y=S.length;_<y;++_){const R=S[_],C=R.start,I=R.count;for(let D=C,F=C+I;D<F;D+=3)p(e.getX(D+0),e.getX(D+1),e.getX(D+2))}const b=new k,v=new k,E=new k,T=new k;function w(_){E.fromBufferAttribute(s,_),T.copy(E);const y=a[_];b.copy(y),b.sub(E.multiplyScalar(E.dot(y))).normalize(),v.crossVectors(T,y);const C=v.dot(c[_])<0?-1:1;o.setXYZW(_,b.x,b.y,b.z,C)}for(let _=0,y=S.length;_<y;++_){const R=S[_],C=R.start,I=R.count;for(let D=C,F=C+I;D<F;D+=3)w(e.getX(D+0)),w(e.getX(D+1)),w(e.getX(D+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Jt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,h=n.count;d<h;d++)n.setXYZ(d,0,0,0);const s=new k,r=new k,o=new k,a=new k,c=new k,l=new k,u=new k,f=new k;if(e)for(let d=0,h=e.count;d<h;d+=3){const g=e.getX(d+0),x=e.getX(d+1),m=e.getX(d+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,x),o.fromBufferAttribute(t,m),u.subVectors(o,r),f.subVectors(s,r),u.cross(f),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,x),l.fromBufferAttribute(n,m),a.add(u),c.add(u),l.add(u),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,h=t.count;d<h;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),u.subVectors(o,r),f.subVectors(s,r),u.cross(f),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Bt.fromBufferAttribute(e,t),Bt.normalize(),e.setXYZ(t,Bt.x,Bt.y,Bt.z)}toNonIndexed(){function e(a,c){const l=a.array,u=a.itemSize,f=a.normalized,d=new l.constructor(c.length*u);let h=0,g=0;for(let x=0,m=c.length;x<m;x++){a.isInterleavedBufferAttribute?h=c[x]*a.data.stride+a.offset:h=c[x]*u;for(let p=0;p<u;p++)d[g++]=l[h++]}return new Jt(d,u,f)}if(this.index===null)return Ce("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new tn,n=this.index.array,s=this.attributes;for(const a in s){const c=s[a],l=e(c,n);t.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const c=[],l=r[a];for(let u=0,f=l.length;u<f;u++){const d=l[u],h=e(d,n);c.push(h)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],u=[];for(let f=0,d=l.length;f<d;f++){const h=l[f];u.push(h.toJSON(e.data))}u.length>0&&(s[c]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const s=e.attributes;for(const l in s){const u=s[l];this.setAttribute(l,u.clone(t))}const r=e.morphAttributes;for(const l in r){const u=[],f=r[l];for(let d=0,h=f.length;d<h;d++)u.push(f[d].clone(t));this.morphAttributes[l]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let l=0,u=o.length;l<u;l++){const f=o[l];this.addGroup(f.start,f.count,f.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class im{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=lc,this.updateRanges=[],this.version=0,this.uuid=bn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=bn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=bn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const qt=new k;class Uc{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.applyMatrix4(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.applyNormalMatrix(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.transformDirection(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=yn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=at(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=at(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=at(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=at(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=at(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=yn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=yn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=yn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=yn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=at(t,this.array),n=at(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=at(t,this.array),n=at(n,this.array),s=at(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=at(t,this.array),n=at(n,this.array),s=at(s,this.array),r=at(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){co("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Jt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Uc(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){co("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}let sm=0;class kn extends qi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:sm++}),this.uuid=bn(),this.name="",this.type="Material",this.blending=gs,this.side=ri,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Sa,this.blendDst=ba,this.blendEquation=Ni,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Fe(0,0,0),this.blendAlpha=0,this.depthFunc=Ms,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Cl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Zi,this.stencilZFail=Zi,this.stencilZPass=Zi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){Ce(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ce(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==gs&&(n.blending=this.blending),this.side!==ri&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Sa&&(n.blendSrc=this.blendSrc),this.blendDst!==ba&&(n.blendDst=this.blendDst),this.blendEquation!==Ni&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ms&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Cl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Zi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Zi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Zi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(t){const r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Fe().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new Je().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Je().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Zn=new k,Jo=new k,br=new k,_i=new k,Qo=new k,Er=new k,jo=new k;class So{constructor(e=new k,t=new k(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Zn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Zn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Zn.copy(this.origin).addScaledVector(this.direction,t),Zn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Jo.copy(e).add(t).multiplyScalar(.5),br.copy(t).sub(e).normalize(),_i.copy(this.origin).sub(Jo);const r=e.distanceTo(t)*.5,o=-this.direction.dot(br),a=_i.dot(this.direction),c=-_i.dot(br),l=_i.lengthSq(),u=Math.abs(1-o*o);let f,d,h,g;if(u>0)if(f=o*c-a,d=o*a-c,g=r*u,f>=0)if(d>=-g)if(d<=g){const x=1/u;f*=x,d*=x,h=f*(f+o*d+2*a)+d*(o*f+d+2*c)+l}else d=r,f=Math.max(0,-(o*d+a)),h=-f*f+d*(d+2*c)+l;else d=-r,f=Math.max(0,-(o*d+a)),h=-f*f+d*(d+2*c)+l;else d<=-g?(f=Math.max(0,-(-o*r+a)),d=f>0?-r:Math.min(Math.max(-r,-c),r),h=-f*f+d*(d+2*c)+l):d<=g?(f=0,d=Math.min(Math.max(-r,-c),r),h=d*(d+2*c)+l):(f=Math.max(0,-(o*r+a)),d=f>0?r:Math.min(Math.max(-r,-c),r),h=-f*f+d*(d+2*c)+l);else d=o>0?-r:r,f=Math.max(0,-(o*d+a)),h=-f*f+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Jo).addScaledVector(br,d),h}intersectSphere(e,t){Zn.subVectors(e.center,this.origin);const n=Zn.dot(this.direction),s=Zn.dot(Zn)-n*n,r=e.radius*e.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,c;const l=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,d=this.origin;return l>=0?(n=(e.min.x-d.x)*l,s=(e.max.x-d.x)*l):(n=(e.max.x-d.x)*l,s=(e.min.x-d.x)*l),u>=0?(r=(e.min.y-d.y)*u,o=(e.max.y-d.y)*u):(r=(e.max.y-d.y)*u,o=(e.min.y-d.y)*u),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),f>=0?(a=(e.min.z-d.z)*f,c=(e.max.z-d.z)*f):(a=(e.max.z-d.z)*f,c=(e.min.z-d.z)*f),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Zn)!==null}intersectTriangle(e,t,n,s,r){Qo.subVectors(t,e),Er.subVectors(n,e),jo.crossVectors(Qo,Er);let o=this.direction.dot(jo),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;_i.subVectors(this.origin,e);const c=a*this.direction.dot(Er.crossVectors(_i,Er));if(c<0)return null;const l=a*this.direction.dot(Qo.cross(_i));if(l<0||c+l>o)return null;const u=-a*_i.dot(jo);return u<0?null:this.at(u/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Oi extends kn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Fe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ti,this.combine=_f,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Wl=new Ke,Ci=new So,Tr=new Gn,Xl=new k,Ar=new k,Rr=new k,wr=new k,ea=new k,Cr=new k,ql=new k,Pr=new k;class Mt extends mt{constructor(e=new tn,t=new Oi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const a=this.morphTargetInfluences;if(r&&a){Cr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const u=a[c],f=r[c];u!==0&&(ea.fromBufferAttribute(f,e),o?Cr.addScaledVector(ea,u):Cr.addScaledVector(ea.sub(t),u))}t.add(Cr)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Tr.copy(n.boundingSphere),Tr.applyMatrix4(r),Ci.copy(e.ray).recast(e.near),!(Tr.containsPoint(Ci.origin)===!1&&(Ci.intersectSphere(Tr,Xl)===null||Ci.origin.distanceToSquared(Xl)>(e.far-e.near)**2))&&(Wl.copy(r).invert(),Ci.copy(e.ray).applyMatrix4(Wl),!(n.boundingBox!==null&&Ci.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Ci)))}_computeIntersections(e,t,n){let s;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,u=r.attributes.uv1,f=r.attributes.normal,d=r.groups,h=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,x=d.length;g<x;g++){const m=d[g],p=o[m.materialIndex],S=Math.max(m.start,h.start),b=Math.min(a.count,Math.min(m.start+m.count,h.start+h.count));for(let v=S,E=b;v<E;v+=3){const T=a.getX(v),w=a.getX(v+1),_=a.getX(v+2);s=Ir(this,p,e,n,l,u,f,T,w,_),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,h.start),x=Math.min(a.count,h.start+h.count);for(let m=g,p=x;m<p;m+=3){const S=a.getX(m),b=a.getX(m+1),v=a.getX(m+2);s=Ir(this,o,e,n,l,u,f,S,b,v),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,x=d.length;g<x;g++){const m=d[g],p=o[m.materialIndex],S=Math.max(m.start,h.start),b=Math.min(c.count,Math.min(m.start+m.count,h.start+h.count));for(let v=S,E=b;v<E;v+=3){const T=v,w=v+1,_=v+2;s=Ir(this,p,e,n,l,u,f,T,w,_),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,h.start),x=Math.min(c.count,h.start+h.count);for(let m=g,p=x;m<p;m+=3){const S=m,b=m+1,v=m+2;s=Ir(this,o,e,n,l,u,f,S,b,v),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function rm(i,e,t,n,s,r,o,a){let c;if(e.side===en?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,e.side===ri,a),c===null)return null;Pr.copy(a),Pr.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(Pr);return l<t.near||l>t.far?null:{distance:l,point:Pr.clone(),object:i}}function Ir(i,e,t,n,s,r,o,a,c,l){i.getVertexPosition(a,Ar),i.getVertexPosition(c,Rr),i.getVertexPosition(l,wr);const u=rm(i,e,t,n,Ar,Rr,wr,ql);if(u){const f=new k;Sn.getBarycoord(ql,Ar,Rr,wr,f),s&&(u.uv=Sn.getInterpolatedAttribute(s,a,c,l,f,new Je)),r&&(u.uv1=Sn.getInterpolatedAttribute(r,a,c,l,f,new Je)),o&&(u.normal=Sn.getInterpolatedAttribute(o,a,c,l,f,new k),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const d={a,b:c,c:l,normal:new k,materialIndex:0};Sn.getNormal(Ar,Rr,wr,d.normal),u.face=d,u.barycoord=f}return u}const Os=new ft,Yl=new ft,Kl=new ft,om=new ft,$l=new Ke,Lr=new k,ta=new Gn,Zl=new Ke,na=new So;class am extends Mt{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=El,this.bindMatrix=new Ke,this.bindMatrixInverse=new Ke,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new li),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Lr),this.boundingBox.expandByPoint(Lr)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Gn),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Lr),this.boundingSphere.expandByPoint(Lr)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ta.copy(this.boundingSphere),ta.applyMatrix4(s),e.ray.intersectsSphere(ta)!==!1&&(Zl.copy(s).invert(),na.copy(e.ray).applyMatrix4(Zl),!(this.boundingBox!==null&&na.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,na)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new ft,t=this.geometry.attributes.skinWeight;for(let n=0,s=t.count;n<s;n++){e.fromBufferAttribute(t,n);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===El?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===ap?this.bindMatrixInverse.copy(this.bindMatrix).invert():Ce("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,s=this.geometry;Yl.fromBufferAttribute(s.attributes.skinIndex,e),Kl.fromBufferAttribute(s.attributes.skinWeight,e),t.isVector4?(Os.copy(t),t.set(0,0,0,0)):(Os.set(...t,1),t.set(0,0,0)),Os.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){const o=Kl.getComponent(r);if(o!==0){const a=Yl.getComponent(r);$l.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(om.copy(Os).applyMatrix4($l),o)}}return t.isVector4&&(t.w=Os.w),t.applyMatrix4(this.bindMatrixInverse)}}class kf extends mt{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Fc extends Ut{constructor(e=null,t=1,n=1,s,r,o,a,c,l=Dt,u=Dt,f,d){super(null,o,a,c,l,u,s,r,f,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Jl=new Ke,cm=new Ke;class Oc{constructor(e=[],t=[]){this.uuid=bn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Ce("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new Ke)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new Ke;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,o=e.length;r<o;r++){const a=e[r]?e[r].matrixWorld:cm;Jl.multiplyMatrices(a,t[r]),Jl.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new Oc(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new Fc(t,e,e,gn,mn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,s=e.bones.length;n<s;n++){const r=e.bones[n];let o=t[r];o===void 0&&(Ce("Skeleton: No bone found with UUID:",r),o=new kf),this.bones.push(o),this.boneInverses.push(new Ke().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let s=0,r=t.length;s<r;s++){const o=t[s];e.bones.push(o.uuid);const a=n[s];e.boneInverses.push(a.toArray())}return e}}class uc extends Jt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const as=new Ke,Ql=new Ke,Dr=[],jl=new li,lm=new Ke,Bs=new Mt,ks=new Gn;class on extends Mt{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new uc(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,lm)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new li),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,as),jl.copy(e.boundingBox).applyMatrix4(as),this.boundingBox.union(jl)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Gn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,as),ks.copy(e.boundingSphere).applyMatrix4(as),this.boundingSphere.union(ks)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(e,t){const n=this.matrixWorld,s=this.count;if(Bs.geometry=this.geometry,Bs.material=this.material,Bs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ks.copy(this.boundingSphere),ks.applyMatrix4(n),e.ray.intersectsSphere(ks)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,as),Ql.multiplyMatrices(n,as),Bs.matrixWorld=Ql,Bs.raycast(e,Dr);for(let o=0,a=Dr.length;o<a;o++){const c=Dr[o];c.instanceId=r,c.object=this,t.push(c)}Dr.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new uc(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){const n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Fc(new Float32Array(s*this.count),s,this.count,Ac,mn));const r=this.morphTexture.source.data.data;let o=0;for(let l=0;l<n.length;l++)o+=n[l];const a=this.geometry.morphTargetsRelative?1:1-o,c=s*e;return r[c]=a,r.set(n,c+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const ia=new k,um=new k,fm=new He;class Li{constructor(e=new k(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=ia.subVectors(n,t).cross(um.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){const s=e.delta(ia),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const o=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(o<0||o>1)?null:t.copy(e.start).addScaledVector(s,o)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||fm.getNormalMatrix(e),s=this.coplanarPoint(ia).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Pi=new Gn,dm=new Je(.5,.5),Nr=new k;class Bc{constructor(e=new Li,t=new Li,n=new Li,s=new Li,r=new Li,o=new Li){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Fn,n=!1){const s=this.planes,r=e.elements,o=r[0],a=r[1],c=r[2],l=r[3],u=r[4],f=r[5],d=r[6],h=r[7],g=r[8],x=r[9],m=r[10],p=r[11],S=r[12],b=r[13],v=r[14],E=r[15];if(s[0].setComponents(l-o,h-u,p-g,E-S).normalize(),s[1].setComponents(l+o,h+u,p+g,E+S).normalize(),s[2].setComponents(l+a,h+f,p+x,E+b).normalize(),s[3].setComponents(l-a,h-f,p-x,E-b).normalize(),n)s[4].setComponents(c,d,m,v).normalize(),s[5].setComponents(l-c,h-d,p-m,E-v).normalize();else if(s[4].setComponents(l-c,h-d,p-m,E-v).normalize(),t===Fn)s[5].setComponents(l+c,h+d,p+m,E+v).normalize();else if(t===sr)s[5].setComponents(c,d,m,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Pi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Pi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Pi)}intersectsSprite(e){Pi.center.set(0,0,0);const t=dm.distanceTo(e.center);return Pi.radius=.7071067811865476+t,Pi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Pi)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(Nr.x=s.normal.x>0?e.max.x:e.min.x,Nr.y=s.normal.y>0?e.max.y:e.min.y,Nr.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Nr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class zf extends kn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Fe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const lo=new k,uo=new k,eu=new Ke,zs=new So,Ur=new Gn,sa=new k,tu=new k;class kc extends mt{constructor(e=new tn,t=new zf){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)lo.fromBufferAttribute(t,s-1),uo.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=lo.distanceTo(uo);e.setAttribute("lineDistance",new Ht(n,1))}else Ce("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ur.copy(n.boundingSphere),Ur.applyMatrix4(s),Ur.radius+=r,e.ray.intersectsSphere(Ur)===!1)return;eu.copy(s).invert(),zs.copy(e.ray).applyMatrix4(eu);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,u=n.index,d=n.attributes.position;if(u!==null){const h=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let x=h,m=g-1;x<m;x+=l){const p=u.getX(x),S=u.getX(x+1),b=Fr(this,e,zs,c,p,S,x);b&&t.push(b)}if(this.isLineLoop){const x=u.getX(g-1),m=u.getX(h),p=Fr(this,e,zs,c,x,m,g-1);p&&t.push(p)}}else{const h=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let x=h,m=g-1;x<m;x+=l){const p=Fr(this,e,zs,c,x,x+1,x);p&&t.push(p)}if(this.isLineLoop){const x=Fr(this,e,zs,c,g-1,h,g-1);x&&t.push(x)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Fr(i,e,t,n,s,r,o){const a=i.geometry.attributes.position;if(lo.fromBufferAttribute(a,s),uo.fromBufferAttribute(a,r),t.distanceSqToSegment(lo,uo,sa,tu)>n)return;sa.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(sa);if(!(l<e.near||l>e.far))return{distance:l,point:tu.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}const nu=new k,iu=new k;class hm extends kc{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)nu.fromBufferAttribute(t,s),iu.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+nu.distanceTo(iu);e.setAttribute("lineDistance",new Ht(n,1))}else Ce("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class pm extends kc{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class Hf extends kn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Fe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const su=new Ke,fc=new So,Or=new Gn,Br=new k;class mm extends mt{constructor(e=new tn,t=new Hf){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Or.copy(n.boundingSphere),Or.applyMatrix4(s),Or.radius+=r,e.ray.intersectsSphere(Or)===!1)return;su.copy(s).invert(),fc.copy(e.ray).applyMatrix4(su);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,f=n.attributes.position;if(l!==null){const d=Math.max(0,o.start),h=Math.min(l.count,o.start+o.count);for(let g=d,x=h;g<x;g++){const m=l.getX(g);Br.fromBufferAttribute(f,m),ru(Br,m,c,s,e,t,this)}}else{const d=Math.max(0,o.start),h=Math.min(f.count,o.start+o.count);for(let g=d,x=h;g<x;g++)Br.fromBufferAttribute(f,g),ru(Br,g,c,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function ru(i,e,t,n,s,r,o){const a=fc.distanceSqToPoint(i);if(a<t){const c=new k;fc.closestPointToPoint(i,c),c.applyMatrix4(n);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}class Vf extends Ut{constructor(e=[],t=Gi,n,s,r,o,a,c,l,u){super(e,t,n,s,r,o,a,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class gm extends Ut{constructor(e,t,n,s,r,o,a,c,l){super(e,t,n,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class bs extends Ut{constructor(e,t,n=Hn,s,r,o,a=Dt,c=Dt,l,u=ai,f=1){if(u!==ai&&u!==Fi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:f};super(d,s,r,o,a,c,u,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Dc(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class _m extends bs{constructor(e,t=Hn,n=Gi,s,r,o=Dt,a=Dt,c,l=ai){const u={width:e,height:e,depth:1},f=[u,u,u,u,u,u];super(e,e,t,n,s,r,o,a,c,l),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Gf extends Ut{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class cn extends tn{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const c=[],l=[],u=[],f=[];let d=0,h=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,s,o,2),g("x","z","y",1,-1,e,n,-t,s,o,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new Ht(l,3)),this.setAttribute("normal",new Ht(u,3)),this.setAttribute("uv",new Ht(f,2));function g(x,m,p,S,b,v,E,T,w,_,y){const R=v/w,C=E/_,I=v/2,D=E/2,F=T/2,L=w+1,G=_+1;let O=0,H=0;const Z=new k;for(let ne=0;ne<G;ne++){const re=ne*C-D;for(let de=0;de<L;de++){const Ue=de*R-I;Z[x]=Ue*S,Z[m]=re*b,Z[p]=F,l.push(Z.x,Z.y,Z.z),Z[x]=0,Z[m]=0,Z[p]=T>0?1:-1,u.push(Z.x,Z.y,Z.z),f.push(de/w),f.push(1-ne/_),O+=1}}for(let ne=0;ne<_;ne++)for(let re=0;re<w;re++){const de=d+re+L*ne,Ue=d+re+L*(ne+1),Qe=d+(re+1)+L*(ne+1),Ge=d+(re+1)+L*ne;c.push(de,Ue,Ge),c.push(Ue,Qe,Ge),H+=6}a.addGroup(h,H,y),h+=H,d+=O}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new cn(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Xi extends tn{constructor(e=1,t=1,n=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const u=[],f=[],d=[],h=[];let g=0;const x=[],m=n/2;let p=0;S(),o===!1&&(e>0&&b(!0),t>0&&b(!1)),this.setIndex(u),this.setAttribute("position",new Ht(f,3)),this.setAttribute("normal",new Ht(d,3)),this.setAttribute("uv",new Ht(h,2));function S(){const v=new k,E=new k;let T=0;const w=(t-e)/n;for(let _=0;_<=r;_++){const y=[],R=_/r,C=R*(t-e)+e;for(let I=0;I<=s;I++){const D=I/s,F=D*c+a,L=Math.sin(F),G=Math.cos(F);E.x=C*L,E.y=-R*n+m,E.z=C*G,f.push(E.x,E.y,E.z),v.set(L,w,G).normalize(),d.push(v.x,v.y,v.z),h.push(D,1-R),y.push(g++)}x.push(y)}for(let _=0;_<s;_++)for(let y=0;y<r;y++){const R=x[y][_],C=x[y+1][_],I=x[y+1][_+1],D=x[y][_+1];(e>0||y!==0)&&(u.push(R,C,D),T+=3),(t>0||y!==r-1)&&(u.push(C,I,D),T+=3)}l.addGroup(p,T,0),p+=T}function b(v){const E=g,T=new Je,w=new k;let _=0;const y=v===!0?e:t,R=v===!0?1:-1;for(let I=1;I<=s;I++)f.push(0,m*R,0),d.push(0,R,0),h.push(.5,.5),g++;const C=g;for(let I=0;I<=s;I++){const F=I/s*c+a,L=Math.cos(F),G=Math.sin(F);w.x=y*G,w.y=m*R,w.z=y*L,f.push(w.x,w.y,w.z),d.push(0,R,0),T.x=L*.5+.5,T.y=G*.5*R+.5,h.push(T.x,T.y),g++}for(let I=0;I<s;I++){const D=E+I,F=C+I;v===!0?u.push(F,F+1,D):u.push(F+1,F,D),_+=3}l.addGroup(p,_,v===!0?1:2),p+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Xi(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class zc extends Xi{constructor(e=1,t=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new zc(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class bo extends tn{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,o=t/2,a=Math.floor(n),c=Math.floor(s),l=a+1,u=c+1,f=e/a,d=t/c,h=[],g=[],x=[],m=[];for(let p=0;p<u;p++){const S=p*d-o;for(let b=0;b<l;b++){const v=b*f-r;g.push(v,-S,0),x.push(0,0,1),m.push(b/a),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let S=0;S<a;S++){const b=S+l*p,v=S+l*(p+1),E=S+1+l*(p+1),T=S+1+l*p;h.push(b,v,T),h.push(v,E,T)}this.setIndex(h),this.setAttribute("position",new Ht(g,3)),this.setAttribute("normal",new Ht(x,3)),this.setAttribute("uv",new Ht(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new bo(e.width,e.height,e.widthSegments,e.heightSegments)}}class lr extends tn{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const c=Math.min(o+a,Math.PI);let l=0;const u=[],f=new k,d=new k,h=[],g=[],x=[],m=[];for(let p=0;p<=n;p++){const S=[],b=p/n,v=o+b*a,E=e*Math.cos(v),T=Math.sqrt(e*e-E*E);let w=0;p===0&&o===0?w=.5/t:p===n&&c===Math.PI&&(w=-.5/t);for(let _=0;_<=t;_++){const y=_/t,R=s+y*r;f.x=-T*Math.cos(R),f.y=E,f.z=T*Math.sin(R),g.push(f.x,f.y,f.z),d.copy(f).normalize(),x.push(d.x,d.y,d.z),m.push(y+w,1-b),S.push(l++)}u.push(S)}for(let p=0;p<n;p++)for(let S=0;S<t;S++){const b=u[p][S+1],v=u[p][S],E=u[p+1][S],T=u[p+1][S+1];(p!==0||o>0)&&h.push(b,v,T),(p!==n-1||c<Math.PI)&&h.push(v,E,T)}this.setIndex(h),this.setAttribute("position",new Ht(g,3)),this.setAttribute("normal",new Ht(x,3)),this.setAttribute("uv",new Ht(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new lr(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}function Es(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];if(ou(s))s.isRenderTargetTexture?(Ce("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(ou(s[0])){const r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function Kt(i){const e={};for(let t=0;t<i.length;t++){const n=Es(i[t]);for(const s in n)e[s]=n[s]}return e}function ou(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function xm(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Wf(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:je.workingColorSpace}const vm={clone:Es,merge:Kt};var Mm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ym=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Vn extends kn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Mm,this.fragmentShader=ym,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Es(e.uniforms),this.uniformsGroups=xm(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const n in e.uniforms){const s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new Fe().setHex(s.value);break;case"v2":this.uniforms[n].value=new Je().fromArray(s.value);break;case"v3":this.uniforms[n].value=new k().fromArray(s.value);break;case"v4":this.uniforms[n].value=new ft().fromArray(s.value);break;case"m3":this.uniforms[n].value=new He().fromArray(s.value);break;case"m4":this.uniforms[n].value=new Ke().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class Sm extends Vn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class $t extends kn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Fe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Fe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=cc,this.normalScale=new Je(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ti,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Wn extends $t{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Je(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return et(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Fe(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Fe(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Fe(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class bm extends kn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=up,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Em extends kn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function kr(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function Tm(i){function e(s,r){return i[s]-i[r]}const t=i.length,n=new Array(t);for(let s=0;s!==t;++s)n[s]=s;return n.sort(e),n}function au(i,e,t){const n=i.length,s=new i.constructor(n);for(let r=0,o=0;o!==n;++r){const a=t[r]*e;for(let c=0;c!==e;++c)s[o++]=i[a+c]}return s}function Am(i,e,t,n){let s=1,r=i[0];for(;r!==void 0&&r[n]===void 0;)r=i[s++];if(r===void 0)return;let o=r[n];if(o!==void 0)if(Array.isArray(o))do o=r[n],o!==void 0&&(e.push(r.time),t.push(...o)),r=i[s++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[n],o!==void 0&&(e.push(r.time),o.toArray(t,t.length)),r=i[s++];while(r!==void 0);else do o=r[n],o!==void 0&&(e.push(r.time),t.push(o)),r=i[s++];while(r!==void 0)}class As{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,s=t[n],r=t[n-1];e:{t:{let o;n:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break t}o=t.length;break n}if(!(e>=r)){const a=t[1];e<a&&(n=2,r=a);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=t[--n-1],e>=r)break t}o=n,n=0;break n}break e}for(;n<o;){const a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}}class Rm extends As{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Al,endingEnd:Al}}intervalChanged_(e,t,n){const s=this.parameterPositions;let r=e-2,o=e+1,a=s[r],c=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Rl:r=e,a=2*t-n;break;case wl:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case Rl:o=e,c=2*n-t;break;case wl:o=1,c=n+s[1]-s[0];break;default:o=e-1,c=t}const l=(n-t)*.5,u=this.valueSize;this._weightPrev=l/(t-a),this._weightNext=l/(c-n),this._offsetPrev=r*u,this._offsetNext=o*u}interpolate_(e,t,n,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,u=this._offsetPrev,f=this._offsetNext,d=this._weightPrev,h=this._weightNext,g=(n-t)/(s-t),x=g*g,m=x*g,p=-d*m+2*d*x-d*g,S=(1+d)*m+(-1.5-2*d)*x+(-.5+d)*g+1,b=(-1-h)*m+(1.5+h)*x+.5*g,v=h*m-h*x;for(let E=0;E!==a;++E)r[E]=p*o[u+E]+S*o[l+E]+b*o[c+E]+v*o[f+E];return r}}class wm extends As{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,u=(n-t)/(s-t),f=1-u;for(let d=0;d!==a;++d)r[d]=o[l+d]*f+o[c+d]*u;return r}}class Cm extends As{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}}class Pm extends As{interpolate_(e,t,n,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,u=this.inTangents,f=this.outTangents;if(!u||!f){const g=(n-t)/(s-t),x=1-g;for(let m=0;m!==a;++m)r[m]=o[l+m]*x+o[c+m]*g;return r}const d=a*2,h=e-1;for(let g=0;g!==a;++g){const x=o[l+g],m=o[c+g],p=h*d+g*2,S=f[p],b=f[p+1],v=e*d+g*2,E=u[v],T=u[v+1];let w=(n-t)/(s-t),_,y,R,C,I;for(let D=0;D<8;D++){_=w*w,y=_*w,R=1-w,C=R*R,I=C*R;const L=I*t+3*C*w*S+3*R*_*E+y*s-n;if(Math.abs(L)<1e-10)break;const G=3*C*(S-t)+6*R*w*(E-S)+3*_*(s-E);if(Math.abs(G)<1e-10)break;w=w-L/G,w=Math.max(0,Math.min(1,w))}r[g]=I*x+3*C*w*b+3*R*_*T+y*m}return r}}class En{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=kr(t,this.TimeBufferType),this.values=kr(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:kr(e.times,Array),values:kr(e.values,Array)};const s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Cm(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new wm(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Rm(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){const t=new Pm(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case nr:t=this.InterpolantFactoryMethodDiscrete;break;case ir:t=this.InterpolantFactoryMethodLinear;break;case Do:t=this.InterpolantFactoryMethodSmooth;break;case Tl:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Ce("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return nr;case this.InterpolantFactoryMethodLinear:return ir;case this.InterpolantFactoryMethodSmooth:return Do;case this.InterpolantFactoryMethodBezier:return Tl}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){const n=this.times,s=n.length;let r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);const a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(Be("KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,s=this.values,r=n.length;r===0&&(Be("KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){const c=n[a];if(typeof c=="number"&&isNaN(c)){Be("KeyframeTrack: Time is not a valid number.",this,a,c),e=!1;break}if(o!==null&&o>c){Be("KeyframeTrack: Out of order keys.",this,a,c,o),e=!1;break}o=c}if(s!==void 0&&vp(s))for(let a=0,c=s.length;a!==c;++a){const l=s[a];if(isNaN(l)){Be("KeyframeTrack: Value is not a valid number.",this,a,l),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Do,r=e.length-1;let o=1;for(let a=1;a<r;++a){let c=!1;const l=e[a],u=e[a+1];if(l!==u&&(a!==1||l!==e[0]))if(s)c=!0;else{const f=a*n,d=f-n,h=f+n;for(let g=0;g!==n;++g){const x=t[f+g];if(x!==t[d+g]||x!==t[h+g]){c=!0;break}}}if(c){if(a!==o){e[o]=e[a];const f=a*n,d=o*n;for(let h=0;h!==n;++h)t[d+h]=t[f+h]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,c=o*n,l=0;l!==n;++l)t[c+l]=t[a+l];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}}En.prototype.ValueTypeName="";En.prototype.TimeBufferType=Float32Array;En.prototype.ValueBufferType=Float32Array;En.prototype.DefaultInterpolation=ir;class Rs extends En{constructor(e,t,n){super(e,t,n)}}Rs.prototype.ValueTypeName="bool";Rs.prototype.ValueBufferType=Array;Rs.prototype.DefaultInterpolation=nr;Rs.prototype.InterpolantFactoryMethodLinear=void 0;Rs.prototype.InterpolantFactoryMethodSmooth=void 0;class Xf extends En{constructor(e,t,n,s){super(e,t,n,s)}}Xf.prototype.ValueTypeName="color";class or extends En{constructor(e,t,n,s){super(e,t,n,s)}}or.prototype.ValueTypeName="number";class Im extends As{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-t)/(s-t);let l=e*a;for(let u=l+a;l!==u;l+=4)ci.slerpFlat(r,0,o,l-a,o,l,c);return r}}class ar extends En{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new Im(this.times,this.values,this.getValueSize(),e)}}ar.prototype.ValueTypeName="quaternion";ar.prototype.InterpolantFactoryMethodSmooth=void 0;class ws extends En{constructor(e,t,n){super(e,t,n)}}ws.prototype.ValueTypeName="string";ws.prototype.ValueBufferType=Array;ws.prototype.DefaultInterpolation=nr;ws.prototype.InterpolantFactoryMethodLinear=void 0;ws.prototype.InterpolantFactoryMethodSmooth=void 0;class fo extends En{constructor(e,t,n,s){super(e,t,n,s)}}fo.prototype.ValueTypeName="vector";class Lm{constructor(e="",t=-1,n=[],s=cp){this.name=e,this.tracks=n,this.duration=t,this.blendMode=s,this.uuid=bn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,s=1/(e.fps||1);for(let o=0,a=n.length;o!==a;++o)t.push(Nm(n[o]).scale(s));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){const t=[],n=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,o=n.length;r!==o;++r)t.push(En.toJSON(n[r]));return s}static CreateFromMorphTargetSequence(e,t,n,s){const r=t.length,o=[];for(let a=0;a<r;a++){let c=[],l=[];c.push((a+r-1)%r,a,(a+1)%r),l.push(0,1,0);const u=Tm(c);c=au(c,1,u),l=au(l,1,u),!s&&c[0]===0&&(c.push(r),l.push(l[0])),o.push(new or(".morphTargetInfluences["+t[a].name+"]",c,l).scale(1/n))}return new this(e,-1,o)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const s=e;n=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<n.length;s++)if(n[s].name===t)return n[s];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const s={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,c=e.length;a<c;a++){const l=e[a],u=l.name.match(r);if(u&&u.length>1){const f=u[1];let d=s[f];d||(s[f]=d=[]),d.push(l)}}const o=[];for(const a in s)o.push(this.CreateFromMorphTargetSequence(a,s[a],t,n));return o}resetDuration(){const e=this.tracks;let t=0;for(let n=0,s=e.length;n!==s;++n){const r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());const t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function Dm(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return or;case"vector":case"vector2":case"vector3":case"vector4":return fo;case"color":return Xf;case"quaternion":return ar;case"bool":case"boolean":return Rs;case"string":return ws}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function Nm(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=Dm(i.type);if(i.times===void 0){const t=[],n=[];Am(i.keys,t,n,"value"),i.times=t,i.values=n}return e.parse!==void 0?e.parse(i):new e(i.name,i.times,i.values,i.interpolation)}const ei={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(cu(i)||(this.files[i]=e))},get:function(i){if(this.enabled!==!1&&!cu(i))return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};function cu(i){try{const e=i.slice(i.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class Um{constructor(e,t,n){const s=this;let r=!1,o=0,a=0,c;const l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(u){a++,r===!1&&s.onStart!==void 0&&s.onStart(u,o,a),r=!0},this.itemEnd=function(u){o++,s.onProgress!==void 0&&s.onProgress(u,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),c?c(u):u},this.setURLModifier=function(u){return c=u,this},this.addHandler=function(u,f){return l.push(u,f),this},this.removeHandler=function(u){const f=l.indexOf(u);return f!==-1&&l.splice(f,2),this},this.getHandler=function(u){for(let f=0,d=l.length;f<d;f+=2){const h=l[f],g=l[f+1];if(h.global&&(h.lastIndex=0),h.test(u))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const Fm=new Um;class Cs{constructor(e){this.manager=e!==void 0?e:Fm,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}Cs.DEFAULT_MATERIAL_NAME="__DEFAULT";const Jn={};class Om extends Error{constructor(e,t){super(e),this.response=t}}class qf extends Cs{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=ei.get(`file:${e}`);if(r!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0);return}if(Jn[e]!==void 0){Jn[e].push({onLoad:t,onProgress:n,onError:s});return}Jn[e]=[],Jn[e].push({onLoad:t,onProgress:n,onError:s});const o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,c=this.responseType;fetch(o).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&Ce("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;const u=Jn[e],f=l.body.getReader(),d=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),h=d?parseInt(d):0,g=h!==0;let x=0;const m=new ReadableStream({start(p){S();function S(){f.read().then(({done:b,value:v})=>{if(b)p.close();else{x+=v.byteLength;const E=new ProgressEvent("progress",{lengthComputable:g,loaded:x,total:h});for(let T=0,w=u.length;T<w;T++){const _=u[T];_.onProgress&&_.onProgress(E)}p.enqueue(v),S()}},b=>{p.error(b)})}}});return new Response(m)}else throw new Om(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(u=>new DOMParser().parseFromString(u,a));case"json":return l.json();default:if(a==="")return l.text();{const f=/charset="?([^;"\s]*)"?/i.exec(a),d=f&&f[1]?f[1].toLowerCase():void 0,h=new TextDecoder(d);return l.arrayBuffer().then(g=>h.decode(g))}}}).then(l=>{ei.add(`file:${e}`,l);const u=Jn[e];delete Jn[e];for(let f=0,d=u.length;f<d;f++){const h=u[f];h.onLoad&&h.onLoad(l)}}).catch(l=>{const u=Jn[e];if(u===void 0)throw this.manager.itemError(e),l;delete Jn[e];for(let f=0,d=u.length;f<d;f++){const h=u[f];h.onError&&h.onError(l)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const cs=new WeakMap;class Bm extends Cs{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,o=ei.get(`image:${e}`);if(o!==void 0){if(o.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0);else{let f=cs.get(o);f===void 0&&(f=[],cs.set(o,f)),f.push({onLoad:t,onError:s})}return o}const a=rr("img");function c(){u(),t&&t(this);const f=cs.get(this)||[];for(let d=0;d<f.length;d++){const h=f[d];h.onLoad&&h.onLoad(this)}cs.delete(this),r.manager.itemEnd(e)}function l(f){u(),s&&s(f),ei.remove(`image:${e}`);const d=cs.get(this)||[];for(let h=0;h<d.length;h++){const g=d[h];g.onError&&g.onError(f)}cs.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function u(){a.removeEventListener("load",c,!1),a.removeEventListener("error",l,!1)}return a.addEventListener("load",c,!1),a.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),ei.add(`image:${e}`,a),r.manager.itemStart(e),a.src=e,a}}class Yf extends Cs{constructor(e){super(e)}load(e,t,n,s){const r=new Ut,o=new Bm(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){r.image=a,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}}class ur extends mt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Fe(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class km extends ur{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(mt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Fe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const ra=new Ke,lu=new k,uu=new k;class Hc{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Je(512,512),this.mapType=an,this.map=null,this.mapPass=null,this.matrix=new Ke,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Bc,this._frameExtents=new Je(1,1),this._viewportCount=1,this._viewports=[new ft(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;lu.setFromMatrixPosition(e.matrixWorld),t.position.copy(lu),uu.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(uu),t.updateMatrixWorld(),ra.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ra,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===sr||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ra)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const zr=new k,Hr=new ci,wn=new k;class Kf extends mt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ke,this.projectionMatrix=new Ke,this.projectionMatrixInverse=new Ke,this.coordinateSystem=Fn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(zr,Hr,wn),wn.x===1&&wn.y===1&&wn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(zr,Hr,wn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(zr,Hr,wn),wn.x===1&&wn.y===1&&wn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(zr,Hr,wn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const xi=new k,fu=new Je,du=new Je;class jt extends Kf{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Ss*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Zs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ss*2*Math.atan(Math.tan(Zs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){xi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(xi.x,xi.y).multiplyScalar(-e/xi.z),xi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(xi.x,xi.y).multiplyScalar(-e/xi.z)}getViewSize(e,t){return this.getViewBounds(e,fu,du),t.subVectors(du,fu)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Zs*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,t-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class zm extends Hc{constructor(){super(new jt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,n=Ss*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class Hm extends ur{constructor(e,t,n=0,s=Math.PI/3,r=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(mt.DEFAULT_UP),this.updateMatrix(),this.target=new mt,this.distance=n,this.angle=s,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new zm}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}}class Vm extends Hc{constructor(){super(new jt(90,1,.5,500)),this.isPointLightShadow=!0}}class Gm extends ur{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Vm}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class fr extends Kf{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,o=n+e,a=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=u*this.view.offsetY,c=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Wm extends Hc{constructor(){super(new fr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class eo extends ur{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(mt.DEFAULT_UP),this.updateMatrix(),this.target=new mt,this.shadow=new Wm}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class Xm extends ur{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class Qs{static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}const oa=new WeakMap;class qm extends Cs{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Ce("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Ce("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,o=ei.get(`image-bitmap:${e}`);if(o!==void 0){if(r.manager.itemStart(e),o.then){o.then(l=>{oa.has(o)===!0?(s&&s(oa.get(o)),r.manager.itemError(e),r.manager.itemEnd(e)):(t&&t(l),r.manager.itemEnd(e))});return}setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0);return}const a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader,a.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const c=fetch(e,a).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(l){ei.add(`image-bitmap:${e}`,l),t&&t(l),r.manager.itemEnd(e)}).catch(function(l){s&&s(l),oa.set(c,l),ei.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});ei.add(`image-bitmap:${e}`,c),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const ls=-90,us=1;class Ym extends mt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new jt(ls,us,e,t);s.layers=this.layers,this.add(s);const r=new jt(ls,us,e,t);r.layers=this.layers,this.add(r);const o=new jt(ls,us,e,t);o.layers=this.layers,this.add(o);const a=new jt(ls,us,e,t);a.layers=this.layers,this.add(a);const c=new jt(ls,us,e,t);c.layers=this.layers,this.add(c);const l=new jt(ls,us,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,c]=t;for(const l of t)this.remove(l);if(e===Fn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===sr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,l,u]=this.children,f=e.getRenderTarget(),d=e.getActiveCubeFace(),h=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,2,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,3,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(n,4,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(f,d,h),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Km extends jt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const Vc="\\[\\]\\.:\\/",$m=new RegExp("["+Vc+"]","g"),Gc="[^"+Vc+"]",Zm="[^"+Vc.replace("\\.","")+"]",Jm=/((?:WC+[\/:])*)/.source.replace("WC",Gc),Qm=/(WCOD+)?/.source.replace("WCOD",Zm),jm=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Gc),e0=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Gc),t0=new RegExp("^"+Jm+Qm+jm+e0+"$"),n0=["material","materials","bones","map"];class i0{constructor(e,t,n){const s=n||ct.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class ct{constructor(e,t,n){this.path=t,this.parsedPath=n||ct.parseTrackName(t),this.node=ct.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new ct.Composite(e,t,n):new ct(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace($m,"")}static parseTrackName(e){const t=t0.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){const r=n.nodeName.substring(s+1);n0.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(r){for(let o=0;o<r.length;o++){const a=r[o];if(a.name===t||a.uuid===t)return a;const c=n(a.children);if(c)return c}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,s=t.propertyName;let r=t.propertyIndex;if(e||(e=ct.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Ce("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){Be("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Be("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Be("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===l){l=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Be("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Be("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Be("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){Be("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}const o=e[s];if(o===void 0){const l=t.nodeName;Be("PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){Be("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Be("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}ct.Composite=i0;ct.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ct.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ct.prototype.GetterByBindingType=[ct.prototype._getValue_direct,ct.prototype._getValue_array,ct.prototype._getValue_arrayElement,ct.prototype._getValue_toArray];ct.prototype.SetterByBindingTypeAndVersioning=[[ct.prototype._setValue_direct,ct.prototype._setValue_direct_setNeedsUpdate,ct.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ct.prototype._setValue_array,ct.prototype._setValue_array_setNeedsUpdate,ct.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ct.prototype._setValue_arrayElement,ct.prototype._setValue_arrayElement_setNeedsUpdate,ct.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ct.prototype._setValue_fromArray,ct.prototype._setValue_fromArray_setNeedsUpdate,ct.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];const Kc=class Kc{constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){const r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}};Kc.prototype.isMatrix2=!0;let hu=Kc;function pu(i,e,t,n){const s=s0(n);switch(t){case Pf:return i*e;case Ac:return i*e/s.components*s.byteLength;case Rc:return i*e/s.components*s.byteLength;case Wi:return i*e*2/s.components*s.byteLength;case wc:return i*e*2/s.components*s.byteLength;case If:return i*e*3/s.components*s.byteLength;case gn:return i*e*4/s.components*s.byteLength;case Cc:return i*e*4/s.components*s.byteLength;case Zr:case Jr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Qr:case jr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case La:case Na:return Math.max(i,16)*Math.max(e,8)/4;case Ia:case Da:return Math.max(i,8)*Math.max(e,8)/2;case Ua:case Fa:case Ba:case ka:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Oa:case ro:case za:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ha:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Va:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Ga:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Wa:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Xa:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case qa:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Ya:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Ka:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case $a:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Za:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Ja:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Qa:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case ja:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case ec:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case tc:case nc:case ic:return Math.ceil(i/4)*Math.ceil(e/4)*16;case sc:case rc:return Math.ceil(i/4)*Math.ceil(e/4)*8;case oo:case oc:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function s0(i){switch(i){case an:case Af:return{byteLength:1,components:1};case er:case Rf:case oi:return{byteLength:2,components:1};case Ec:case Tc:return{byteLength:2,components:4};case Hn:case bc:case mn:return{byteLength:4,components:1};case wf:case Cf:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:yc}}));typeof window<"u"&&(window.__THREE__?Ce("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=yc);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function $f(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function r0(i){const e=new WeakMap;function t(a,c){const l=a.array,u=a.usage,f=l.byteLength,d=i.createBuffer();i.bindBuffer(c,d),i.bufferData(c,l,u),a.onUploadCallback();let h;if(l instanceof Float32Array)h=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)h=i.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?h=i.HALF_FLOAT:h=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)h=i.SHORT;else if(l instanceof Uint32Array)h=i.UNSIGNED_INT;else if(l instanceof Int32Array)h=i.INT;else if(l instanceof Int8Array)h=i.BYTE;else if(l instanceof Uint8Array)h=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)h=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:h,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:f}}function n(a,c,l){const u=c.array,f=c.updateRanges;if(i.bindBuffer(l,a),f.length===0)i.bufferSubData(l,0,u);else{f.sort((h,g)=>h.start-g.start);let d=0;for(let h=1;h<f.length;h++){const g=f[d],x=f[h];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++d,f[d]=x)}f.length=d+1;for(let h=0,g=f.length;h<g;h++){const x=f[h];i.bufferSubData(l,x.start*u.BYTES_PER_ELEMENT,u,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=e.get(a);c&&(i.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=e.get(a);if(l===void 0)e.set(a,t(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}var o0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,a0=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,c0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,l0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,u0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,f0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,d0=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,h0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,p0=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,m0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,g0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,_0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,x0=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,v0=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,M0=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,y0=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,S0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,b0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,E0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,T0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,A0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,R0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,w0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,C0=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,P0=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,I0=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,L0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,D0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,N0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,U0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,F0="gl_FragColor = linearToOutputTexel( gl_FragColor );",O0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,B0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,k0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,z0=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,H0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,V0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,G0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,W0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,X0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,q0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Y0=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,K0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,$0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Z0=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,J0=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Q0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,j0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,eg=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,tg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,ng=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ig=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,sg=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,rg=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,og=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,ag=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,cg=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,lg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ug=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,fg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,dg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,hg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,pg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,mg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,gg=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,_g=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,xg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,vg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Mg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,yg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Sg=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,bg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Eg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Tg=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Ag=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Rg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,wg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Cg=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Pg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Ig=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Lg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Dg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Ng=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Ug=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Fg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Og=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Bg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,kg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,zg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Hg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Vg=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Gg=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Wg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Xg=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,qg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Yg=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Kg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,$g=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Zg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Jg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Qg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,jg=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,e_=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,t_=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,n_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,i_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,s_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,r_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const o_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,a_=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,c_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,l_=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,u_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,f_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,d_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,h_=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,p_=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,m_=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,g_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,__=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,x_=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,v_=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,M_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,y_=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,S_=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,b_=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,E_=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,T_=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,A_=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,R_=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,w_=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,C_=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,P_=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,I_=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,L_=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,D_=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,N_=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,U_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,F_=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,O_=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,B_=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,k_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ye={alphahash_fragment:o0,alphahash_pars_fragment:a0,alphamap_fragment:c0,alphamap_pars_fragment:l0,alphatest_fragment:u0,alphatest_pars_fragment:f0,aomap_fragment:d0,aomap_pars_fragment:h0,batching_pars_vertex:p0,batching_vertex:m0,begin_vertex:g0,beginnormal_vertex:_0,bsdfs:x0,iridescence_fragment:v0,bumpmap_pars_fragment:M0,clipping_planes_fragment:y0,clipping_planes_pars_fragment:S0,clipping_planes_pars_vertex:b0,clipping_planes_vertex:E0,color_fragment:T0,color_pars_fragment:A0,color_pars_vertex:R0,color_vertex:w0,common:C0,cube_uv_reflection_fragment:P0,defaultnormal_vertex:I0,displacementmap_pars_vertex:L0,displacementmap_vertex:D0,emissivemap_fragment:N0,emissivemap_pars_fragment:U0,colorspace_fragment:F0,colorspace_pars_fragment:O0,envmap_fragment:B0,envmap_common_pars_fragment:k0,envmap_pars_fragment:z0,envmap_pars_vertex:H0,envmap_physical_pars_fragment:Q0,envmap_vertex:V0,fog_vertex:G0,fog_pars_vertex:W0,fog_fragment:X0,fog_pars_fragment:q0,gradientmap_pars_fragment:Y0,lightmap_pars_fragment:K0,lights_lambert_fragment:$0,lights_lambert_pars_fragment:Z0,lights_pars_begin:J0,lights_toon_fragment:j0,lights_toon_pars_fragment:eg,lights_phong_fragment:tg,lights_phong_pars_fragment:ng,lights_physical_fragment:ig,lights_physical_pars_fragment:sg,lights_fragment_begin:rg,lights_fragment_maps:og,lights_fragment_end:ag,lightprobes_pars_fragment:cg,logdepthbuf_fragment:lg,logdepthbuf_pars_fragment:ug,logdepthbuf_pars_vertex:fg,logdepthbuf_vertex:dg,map_fragment:hg,map_pars_fragment:pg,map_particle_fragment:mg,map_particle_pars_fragment:gg,metalnessmap_fragment:_g,metalnessmap_pars_fragment:xg,morphinstance_vertex:vg,morphcolor_vertex:Mg,morphnormal_vertex:yg,morphtarget_pars_vertex:Sg,morphtarget_vertex:bg,normal_fragment_begin:Eg,normal_fragment_maps:Tg,normal_pars_fragment:Ag,normal_pars_vertex:Rg,normal_vertex:wg,normalmap_pars_fragment:Cg,clearcoat_normal_fragment_begin:Pg,clearcoat_normal_fragment_maps:Ig,clearcoat_pars_fragment:Lg,iridescence_pars_fragment:Dg,opaque_fragment:Ng,packing:Ug,premultiplied_alpha_fragment:Fg,project_vertex:Og,dithering_fragment:Bg,dithering_pars_fragment:kg,roughnessmap_fragment:zg,roughnessmap_pars_fragment:Hg,shadowmap_pars_fragment:Vg,shadowmap_pars_vertex:Gg,shadowmap_vertex:Wg,shadowmask_pars_fragment:Xg,skinbase_vertex:qg,skinning_pars_vertex:Yg,skinning_vertex:Kg,skinnormal_vertex:$g,specularmap_fragment:Zg,specularmap_pars_fragment:Jg,tonemapping_fragment:Qg,tonemapping_pars_fragment:jg,transmission_fragment:e_,transmission_pars_fragment:t_,uv_pars_fragment:n_,uv_pars_vertex:i_,uv_vertex:s_,worldpos_vertex:r_,background_vert:o_,background_frag:a_,backgroundCube_vert:c_,backgroundCube_frag:l_,cube_vert:u_,cube_frag:f_,depth_vert:d_,depth_frag:h_,distance_vert:p_,distance_frag:m_,equirect_vert:g_,equirect_frag:__,linedashed_vert:x_,linedashed_frag:v_,meshbasic_vert:M_,meshbasic_frag:y_,meshlambert_vert:S_,meshlambert_frag:b_,meshmatcap_vert:E_,meshmatcap_frag:T_,meshnormal_vert:A_,meshnormal_frag:R_,meshphong_vert:w_,meshphong_frag:C_,meshphysical_vert:P_,meshphysical_frag:I_,meshtoon_vert:L_,meshtoon_frag:D_,points_vert:N_,points_frag:U_,shadow_vert:F_,shadow_frag:O_,sprite_vert:B_,sprite_frag:k_},me={common:{diffuse:{value:new Fe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new He},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new He}},envmap:{envMap:{value:null},envMapRotation:{value:new He},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new He}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new He}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new He},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new He},normalScale:{value:new Je(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new He},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new He}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new He}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new He}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Fe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new k},probesMax:{value:new k},probesResolution:{value:new k}},points:{diffuse:{value:new Fe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0},uvTransform:{value:new He}},sprite:{diffuse:{value:new Fe(16777215)},opacity:{value:1},center:{value:new Je(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new He},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0}}},Dn={basic:{uniforms:Kt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.fog]),vertexShader:Ye.meshbasic_vert,fragmentShader:Ye.meshbasic_frag},lambert:{uniforms:Kt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new Fe(0)},envMapIntensity:{value:1}}]),vertexShader:Ye.meshlambert_vert,fragmentShader:Ye.meshlambert_frag},phong:{uniforms:Kt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new Fe(0)},specular:{value:new Fe(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ye.meshphong_vert,fragmentShader:Ye.meshphong_frag},standard:{uniforms:Kt([me.common,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.roughnessmap,me.metalnessmap,me.fog,me.lights,{emissive:{value:new Fe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ye.meshphysical_vert,fragmentShader:Ye.meshphysical_frag},toon:{uniforms:Kt([me.common,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.gradientmap,me.fog,me.lights,{emissive:{value:new Fe(0)}}]),vertexShader:Ye.meshtoon_vert,fragmentShader:Ye.meshtoon_frag},matcap:{uniforms:Kt([me.common,me.bumpmap,me.normalmap,me.displacementmap,me.fog,{matcap:{value:null}}]),vertexShader:Ye.meshmatcap_vert,fragmentShader:Ye.meshmatcap_frag},points:{uniforms:Kt([me.points,me.fog]),vertexShader:Ye.points_vert,fragmentShader:Ye.points_frag},dashed:{uniforms:Kt([me.common,me.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ye.linedashed_vert,fragmentShader:Ye.linedashed_frag},depth:{uniforms:Kt([me.common,me.displacementmap]),vertexShader:Ye.depth_vert,fragmentShader:Ye.depth_frag},normal:{uniforms:Kt([me.common,me.bumpmap,me.normalmap,me.displacementmap,{opacity:{value:1}}]),vertexShader:Ye.meshnormal_vert,fragmentShader:Ye.meshnormal_frag},sprite:{uniforms:Kt([me.sprite,me.fog]),vertexShader:Ye.sprite_vert,fragmentShader:Ye.sprite_frag},background:{uniforms:{uvTransform:{value:new He},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ye.background_vert,fragmentShader:Ye.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new He}},vertexShader:Ye.backgroundCube_vert,fragmentShader:Ye.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ye.cube_vert,fragmentShader:Ye.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ye.equirect_vert,fragmentShader:Ye.equirect_frag},distance:{uniforms:Kt([me.common,me.displacementmap,{referencePosition:{value:new k},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ye.distance_vert,fragmentShader:Ye.distance_frag},shadow:{uniforms:Kt([me.lights,me.fog,{color:{value:new Fe(0)},opacity:{value:1}}]),vertexShader:Ye.shadow_vert,fragmentShader:Ye.shadow_frag}};Dn.physical={uniforms:Kt([Dn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new He},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new He},clearcoatNormalScale:{value:new Je(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new He},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new He},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new He},sheen:{value:0},sheenColor:{value:new Fe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new He},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new He},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new He},transmissionSamplerSize:{value:new Je},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new He},attenuationDistance:{value:0},attenuationColor:{value:new Fe(0)},specularColor:{value:new Fe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new He},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new He},anisotropyVector:{value:new Je},anisotropyMap:{value:null},anisotropyMapTransform:{value:new He}}]),vertexShader:Ye.meshphysical_vert,fragmentShader:Ye.meshphysical_frag};const Vr={r:0,b:0,g:0},z_=new Ke,Zf=new He;Zf.set(-1,0,0,0,1,0,0,0,1);function H_(i,e,t,n,s,r){const o=new Fe(0);let a=s===!0?0:1,c,l,u=null,f=0,d=null;function h(S){let b=S.isScene===!0?S.background:null;if(b&&b.isTexture){const v=S.backgroundBlurriness>0;b=e.get(b,v)}return b}function g(S){let b=!1;const v=h(S);v===null?m(o,a):v&&v.isColor&&(m(v,1),b=!0);const E=i.xr.getEnvironmentBlendMode();E==="additive"?t.buffers.color.setClear(0,0,0,1,r):E==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||b)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function x(S,b){const v=h(b);v&&(v.isCubeTexture||v.mapping===yo)?(l===void 0&&(l=new Mt(new cn(1,1,1),new Vn({name:"BackgroundCubeMaterial",uniforms:Es(Dn.backgroundCube.uniforms),vertexShader:Dn.backgroundCube.vertexShader,fragmentShader:Dn.backgroundCube.fragmentShader,side:en,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(E,T,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(l)),l.material.uniforms.envMap.value=v,l.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(z_.makeRotationFromEuler(b.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Zf),l.material.toneMapped=je.getTransfer(v.colorSpace)!==ot,(u!==v||f!==v.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,u=v,f=v.version,d=i.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new Mt(new bo(2,2),new Vn({name:"BackgroundMaterial",uniforms:Es(Dn.background.uniforms),vertexShader:Dn.background.vertexShader,fragmentShader:Dn.background.fragmentShader,side:ri,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,c.material.toneMapped=je.getTransfer(v.colorSpace)!==ot,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||f!==v.version||d!==i.toneMapping)&&(c.material.needsUpdate=!0,u=v,f=v.version,d=i.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null))}function m(S,b){S.getRGB(Vr,Wf(i)),t.buffers.color.setClear(Vr.r,Vr.g,Vr.b,b,r)}function p(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(S,b=1){o.set(S),a=b,m(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(S){a=S,m(o,a)},render:g,addToRenderList:x,dispose:p}}function V_(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null);let r=s,o=!1;function a(C,I,D,F,L){let G=!1;const O=f(C,F,D,I);r!==O&&(r=O,l(r.object)),G=h(C,F,D,L),G&&g(C,F,D,L),L!==null&&e.update(L,i.ELEMENT_ARRAY_BUFFER),(G||o)&&(o=!1,v(C,I,D,F),L!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(L).buffer))}function c(){return i.createVertexArray()}function l(C){return i.bindVertexArray(C)}function u(C){return i.deleteVertexArray(C)}function f(C,I,D,F){const L=F.wireframe===!0;let G=n[I.id];G===void 0&&(G={},n[I.id]=G);const O=C.isInstancedMesh===!0?C.id:0;let H=G[O];H===void 0&&(H={},G[O]=H);let Z=H[D.id];Z===void 0&&(Z={},H[D.id]=Z);let ne=Z[L];return ne===void 0&&(ne=d(c()),Z[L]=ne),ne}function d(C){const I=[],D=[],F=[];for(let L=0;L<t;L++)I[L]=0,D[L]=0,F[L]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:D,attributeDivisors:F,object:C,attributes:{},index:null}}function h(C,I,D,F){const L=r.attributes,G=I.attributes;let O=0;const H=D.getAttributes();for(const Z in H)if(H[Z].location>=0){const re=L[Z];let de=G[Z];if(de===void 0&&(Z==="instanceMatrix"&&C.instanceMatrix&&(de=C.instanceMatrix),Z==="instanceColor"&&C.instanceColor&&(de=C.instanceColor)),re===void 0||re.attribute!==de||de&&re.data!==de.data)return!0;O++}return r.attributesNum!==O||r.index!==F}function g(C,I,D,F){const L={},G=I.attributes;let O=0;const H=D.getAttributes();for(const Z in H)if(H[Z].location>=0){let re=G[Z];re===void 0&&(Z==="instanceMatrix"&&C.instanceMatrix&&(re=C.instanceMatrix),Z==="instanceColor"&&C.instanceColor&&(re=C.instanceColor));const de={};de.attribute=re,re&&re.data&&(de.data=re.data),L[Z]=de,O++}r.attributes=L,r.attributesNum=O,r.index=F}function x(){const C=r.newAttributes;for(let I=0,D=C.length;I<D;I++)C[I]=0}function m(C){p(C,0)}function p(C,I){const D=r.newAttributes,F=r.enabledAttributes,L=r.attributeDivisors;D[C]=1,F[C]===0&&(i.enableVertexAttribArray(C),F[C]=1),L[C]!==I&&(i.vertexAttribDivisor(C,I),L[C]=I)}function S(){const C=r.newAttributes,I=r.enabledAttributes;for(let D=0,F=I.length;D<F;D++)I[D]!==C[D]&&(i.disableVertexAttribArray(D),I[D]=0)}function b(C,I,D,F,L,G,O){O===!0?i.vertexAttribIPointer(C,I,D,L,G):i.vertexAttribPointer(C,I,D,F,L,G)}function v(C,I,D,F){x();const L=F.attributes,G=D.getAttributes(),O=I.defaultAttributeValues;for(const H in G){const Z=G[H];if(Z.location>=0){let ne=L[H];if(ne===void 0&&(H==="instanceMatrix"&&C.instanceMatrix&&(ne=C.instanceMatrix),H==="instanceColor"&&C.instanceColor&&(ne=C.instanceColor)),ne!==void 0){const re=ne.normalized,de=ne.itemSize,Ue=e.get(ne);if(Ue===void 0)continue;const Qe=Ue.buffer,Ge=Ue.type,J=Ue.bytesPerElement,ee=Ge===i.INT||Ge===i.UNSIGNED_INT||ne.gpuType===bc;if(ne.isInterleavedBufferAttribute){const oe=ne.data,Oe=oe.stride,ze=ne.offset;if(oe.isInstancedInterleavedBuffer){for(let De=0;De<Z.locationSize;De++)p(Z.location+De,oe.meshPerAttribute);C.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let De=0;De<Z.locationSize;De++)m(Z.location+De);i.bindBuffer(i.ARRAY_BUFFER,Qe);for(let De=0;De<Z.locationSize;De++)b(Z.location+De,de/Z.locationSize,Ge,re,Oe*J,(ze+de/Z.locationSize*De)*J,ee)}else{if(ne.isInstancedBufferAttribute){for(let oe=0;oe<Z.locationSize;oe++)p(Z.location+oe,ne.meshPerAttribute);C.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let oe=0;oe<Z.locationSize;oe++)m(Z.location+oe);i.bindBuffer(i.ARRAY_BUFFER,Qe);for(let oe=0;oe<Z.locationSize;oe++)b(Z.location+oe,de/Z.locationSize,Ge,re,de*J,de/Z.locationSize*oe*J,ee)}}else if(O!==void 0){const re=O[H];if(re!==void 0)switch(re.length){case 2:i.vertexAttrib2fv(Z.location,re);break;case 3:i.vertexAttrib3fv(Z.location,re);break;case 4:i.vertexAttrib4fv(Z.location,re);break;default:i.vertexAttrib1fv(Z.location,re)}}}}S()}function E(){y();for(const C in n){const I=n[C];for(const D in I){const F=I[D];for(const L in F){const G=F[L];for(const O in G)u(G[O].object),delete G[O];delete F[L]}}delete n[C]}}function T(C){if(n[C.id]===void 0)return;const I=n[C.id];for(const D in I){const F=I[D];for(const L in F){const G=F[L];for(const O in G)u(G[O].object),delete G[O];delete F[L]}}delete n[C.id]}function w(C){for(const I in n){const D=n[I];for(const F in D){const L=D[F];if(L[C.id]===void 0)continue;const G=L[C.id];for(const O in G)u(G[O].object),delete G[O];delete L[C.id]}}}function _(C){for(const I in n){const D=n[I],F=C.isInstancedMesh===!0?C.id:0,L=D[F];if(L!==void 0){for(const G in L){const O=L[G];for(const H in O)u(O[H].object),delete O[H];delete L[G]}delete D[F],Object.keys(D).length===0&&delete n[I]}}}function y(){R(),o=!0,r!==s&&(r=s,l(r.object))}function R(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:y,resetDefaultState:R,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfObject:_,releaseStatesOfProgram:w,initAttributes:x,enableAttribute:m,disableUnusedAttributes:S}}function G_(i,e,t){let n;function s(c){n=c}function r(c,l){i.drawArrays(n,c,l),t.update(l,n,1)}function o(c,l,u){u!==0&&(i.drawArraysInstanced(n,c,l,u),t.update(l,n,u))}function a(c,l,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,l,0,u);let d=0;for(let h=0;h<u;h++)d+=l[h];t.update(d,n,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function W_(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const w=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(w){return!(w!==gn&&n.convert(w)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(w){const _=w===oi&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(w!==an&&n.convert(w)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==mn&&!_)}function c(w){if(w==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const u=c(l);u!==l&&(Ce("WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);const f=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&d===!1&&Ce("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const h=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),S=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),b=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),E=i.getParameter(i.MAX_SAMPLES),T=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:f,reversedDepthBuffer:d,maxTextures:h,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:S,maxVaryings:b,maxFragmentUniforms:v,maxSamples:E,samples:T}}function X_(i){const e=this;let t=null,n=0,s=!1,r=!1;const o=new Li,a=new He,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const h=f.length!==0||d||n!==0||s;return s=d,n=f.length,h},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,d){t=u(f,d,0)},this.setState=function(f,d,h){const g=f.clippingPlanes,x=f.clipIntersection,m=f.clipShadows,p=i.get(f);if(!s||g===null||g.length===0||r&&!m)r?u(null):l();else{const S=r?0:n,b=S*4;let v=p.clippingState||null;c.value=v,v=u(g,d,b,h);for(let E=0;E!==b;++E)v[E]=t[E];p.clippingState=v,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=S}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(f,d,h,g){const x=f!==null?f.length:0;let m=null;if(x!==0){if(m=c.value,g!==!0||m===null){const p=h+x*4,S=d.matrixWorldInverse;a.getNormalMatrix(S),(m===null||m.length<p)&&(m=new Float32Array(p));for(let b=0,v=h;b!==x;++b,v+=4)o.copy(f[b]).applyMatrix4(S,a),o.normal.toArray(m,v),m[v+3]=o.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,m}}const bi=4,mu=[.125,.215,.35,.446,.526,.582],Ui=20,q_=256,Hs=new fr,gu=new Fe;let aa=null,ca=0,la=0,ua=!1;const Y_=new k;class _u{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){const{size:o=256,position:a=Y_}=r;aa=this._renderer.getRenderTarget(),ca=this._renderer.getActiveCubeFace(),la=this._renderer.getActiveMipmapLevel(),ua=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,s,c,a),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Mu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=vu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(aa,ca,la),this._renderer.xr.enabled=ua,e.scissorTest=!1,fs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Gi||e.mapping===ys?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),aa=this._renderer.getRenderTarget(),ca=this._renderer.getActiveCubeFace(),la=this._renderer.getActiveMipmapLevel(),ua=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Nt,minFilter:Nt,generateMipmaps:!1,type:oi,format:gn,colorSpace:un,depthBuffer:!1},s=xu(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=xu(e,t,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=K_(r)),this._blurMaterial=Z_(r,e,t),this._ggxMaterial=$_(r,e,t)}return s}_compileMaterial(e){const t=new Mt(new tn,e);this._renderer.compile(t,Hs)}_sceneToCubeUV(e,t,n,s,r){const c=new jt(90,1,t,n),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],f=this._renderer,d=f.autoClear,h=f.toneMapping;f.getClearColor(gu),f.toneMapping=On,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Mt(new cn,new Oi({name:"PMREM.Background",side:en,depthWrite:!1,depthTest:!1})));const x=this._backgroundBox,m=x.material;let p=!1;const S=e.background;S?S.isColor&&(m.color.copy(S),e.background=null,p=!0):(m.color.copy(gu),p=!0);for(let b=0;b<6;b++){const v=b%3;v===0?(c.up.set(0,l[b],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+u[b],r.y,r.z)):v===1?(c.up.set(0,0,l[b]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+u[b],r.z)):(c.up.set(0,l[b],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+u[b]));const E=this._cubeSize;fs(s,v*E,b>2?E:0,E,E),f.setRenderTarget(s),p&&f.render(x,c),f.render(e,c)}f.toneMapping=h,f.autoClear=d,e.background=S}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===Gi||e.mapping===ys;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Mu()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=vu());const r=s?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;const a=r.uniforms;a.envMap.value=e;const c=this._cubeSize;fs(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(o,Hs)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){const s=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[n];a.material=o;const c=o.uniforms,l=n/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),f=Math.sqrt(l*l-u*u),d=0+l*1.25,h=f*d,{_lodMax:g}=this,x=this._sizeLods[n],m=3*x*(n>g-bi?n-g+bi:0),p=4*(this._cubeSize-x);c.envMap.value=e.texture,c.roughness.value=h,c.mipInt.value=g-t,fs(r,m,p,3*x,2*x),s.setRenderTarget(r),s.render(a,Hs),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=g-n,fs(e,m,p,3*x,2*x),s.setRenderTarget(e),s.render(a,Hs)}_blur(e,t,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&Be("blur direction must be either latitudinal or longitudinal!");const u=3,f=this._lodMeshes[s];f.material=l;const d=l.uniforms,h=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*h):2*Math.PI/(2*Ui-1),x=r/g,m=isFinite(r)?1+Math.floor(u*x):Ui;m>Ui&&Ce(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Ui}`);const p=[];let S=0;for(let w=0;w<Ui;++w){const _=w/x,y=Math.exp(-_*_/2);p.push(y),w===0?S+=y:w<m&&(S+=2*y)}for(let w=0;w<p.length;w++)p[w]=p[w]/S;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:b}=this;d.dTheta.value=g,d.mipInt.value=b-n;const v=this._sizeLods[s],E=3*v*(s>b-bi?s-b+bi:0),T=4*(this._cubeSize-v);fs(t,E,T,3*v,2*v),c.setRenderTarget(t),c.render(f,Hs)}}function K_(i){const e=[],t=[],n=[];let s=i;const r=i-bi+1+mu.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let c=1/a;o>i-bi?c=mu[o-i+bi-1]:o===0&&(c=0),t.push(c);const l=1/(a-2),u=-l,f=1+l,d=[u,u,f,u,f,f,u,u,f,f,u,f],h=6,g=6,x=3,m=2,p=1,S=new Float32Array(x*g*h),b=new Float32Array(m*g*h),v=new Float32Array(p*g*h);for(let T=0;T<h;T++){const w=T%3*2/3-1,_=T>2?0:-1,y=[w,_,0,w+2/3,_,0,w+2/3,_+1,0,w,_,0,w+2/3,_+1,0,w,_+1,0];S.set(y,x*g*T),b.set(d,m*g*T);const R=[T,T,T,T,T,T];v.set(R,p*g*T)}const E=new tn;E.setAttribute("position",new Jt(S,x)),E.setAttribute("uv",new Jt(b,m)),E.setAttribute("faceIndex",new Jt(v,p)),n.push(new Mt(E,null)),s>bi&&s--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function xu(i,e,t){const n=new Bn(i,e,t);return n.texture.mapping=yo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function fs(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function $_(i,e,t){return new Vn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:q_,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Eo(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:ti,depthTest:!1,depthWrite:!1})}function Z_(i,e,t){const n=new Float32Array(Ui),s=new k(0,1,0);return new Vn({name:"SphericalGaussianBlur",defines:{n:Ui,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Eo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ti,depthTest:!1,depthWrite:!1})}function vu(){return new Vn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Eo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ti,depthTest:!1,depthWrite:!1})}function Mu(){return new Vn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Eo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ti,depthTest:!1,depthWrite:!1})}function Eo(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class Jf extends Bn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Vf(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new cn(5,5,5),r=new Vn({name:"CubemapFromEquirect",uniforms:Es(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:en,blending:ti});r.uniforms.tEquirect.value=t;const o=new Mt(s,r),a=t.minFilter;return t.minFilter===jn&&(t.minFilter=Nt),new Ym(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}}function J_(i){let e=new WeakMap,t=new WeakMap,n=null;function s(d,h=!1){return d==null?null:h?o(d):r(d)}function r(d){if(d&&d.isTexture){const h=d.mapping;if(h===Io||h===Lo)if(e.has(d)){const g=e.get(d).texture;return a(g,d.mapping)}else{const g=d.image;if(g&&g.height>0){const x=new Jf(g.height);return x.fromEquirectangularTexture(i,d),e.set(d,x),d.addEventListener("dispose",l),a(x.texture,d.mapping)}else return null}}return d}function o(d){if(d&&d.isTexture){const h=d.mapping,g=h===Io||h===Lo,x=h===Gi||h===ys;if(g||x){let m=t.get(d);const p=m!==void 0?m.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==p)return n===null&&(n=new _u(i)),m=g?n.fromEquirectangular(d,m):n.fromCubemap(d,m),m.texture.pmremVersion=d.pmremVersion,t.set(d,m),m.texture;if(m!==void 0)return m.texture;{const S=d.image;return g&&S&&S.height>0||x&&S&&c(S)?(n===null&&(n=new _u(i)),m=g?n.fromEquirectangular(d):n.fromCubemap(d),m.texture.pmremVersion=d.pmremVersion,t.set(d,m),d.addEventListener("dispose",u),m.texture):null}}}return d}function a(d,h){return h===Io?d.mapping=Gi:h===Lo&&(d.mapping=ys),d}function c(d){let h=0;const g=6;for(let x=0;x<g;x++)d[x]!==void 0&&h++;return h===g}function l(d){const h=d.target;h.removeEventListener("dispose",l);const g=e.get(h);g!==void 0&&(e.delete(h),g.dispose())}function u(d){const h=d.target;h.removeEventListener("dispose",u);const g=t.get(h);g!==void 0&&(t.delete(h),g.dispose())}function f(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:f}}function Q_(i){const e={};function t(n){if(e[n]!==void 0)return e[n];const s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&_s("WebGLRenderer: "+n+" extension not supported."),s}}}function j_(i,e,t,n){const s={},r=new WeakMap;function o(f){const d=f.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",o),delete s[d.id];const h=r.get(d);h&&(e.remove(h),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(f,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,t.memory.geometries++),d}function c(f){const d=f.attributes;for(const h in d)e.update(d[h],i.ARRAY_BUFFER)}function l(f){const d=[],h=f.index,g=f.attributes.position;let x=0;if(g===void 0)return;if(h!==null){const S=h.array;x=h.version;for(let b=0,v=S.length;b<v;b+=3){const E=S[b+0],T=S[b+1],w=S[b+2];d.push(E,T,T,w,w,E)}}else{const S=g.array;x=g.version;for(let b=0,v=S.length/3-1;b<v;b+=3){const E=b+0,T=b+1,w=b+2;d.push(E,T,T,w,w,E)}}const m=new(g.count>=65535?Bf:Of)(d,1);m.version=x;const p=r.get(f);p&&e.remove(p),r.set(f,m)}function u(f){const d=r.get(f);if(d){const h=f.index;h!==null&&d.version<h.version&&l(f)}else l(f);return r.get(f)}return{get:a,update:c,getWireframeAttribute:u}}function ex(i,e,t){let n;function s(f){n=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function c(f,d){i.drawElements(n,d,r,f*o),t.update(d,n,1)}function l(f,d,h){h!==0&&(i.drawElementsInstanced(n,d,r,f*o,h),t.update(d,n,h))}function u(f,d,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,f,0,h);let x=0;for(let m=0;m<h;m++)x+=d[m];t.update(x,n,1)}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function tx(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:Be("WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function nx(i,e,t){const n=new WeakMap,s=new ft;function r(o,a,c){const l=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,f=u!==void 0?u.length:0;let d=n.get(a);if(d===void 0||d.count!==f){let R=function(){_.dispose(),n.delete(a),a.removeEventListener("dispose",R)};var h=R;d!==void 0&&d.texture.dispose();const g=a.morphAttributes.position!==void 0,x=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],S=a.morphAttributes.normal||[],b=a.morphAttributes.color||[];let v=0;g===!0&&(v=1),x===!0&&(v=2),m===!0&&(v=3);let E=a.attributes.position.count*v,T=1;E>e.maxTextureSize&&(T=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const w=new Float32Array(E*T*4*f),_=new Nf(w,E,T,f);_.type=mn,_.needsUpdate=!0;const y=v*4;for(let C=0;C<f;C++){const I=p[C],D=S[C],F=b[C],L=E*T*4*C;for(let G=0;G<I.count;G++){const O=G*y;g===!0&&(s.fromBufferAttribute(I,G),w[L+O+0]=s.x,w[L+O+1]=s.y,w[L+O+2]=s.z,w[L+O+3]=0),x===!0&&(s.fromBufferAttribute(D,G),w[L+O+4]=s.x,w[L+O+5]=s.y,w[L+O+6]=s.z,w[L+O+7]=0),m===!0&&(s.fromBufferAttribute(F,G),w[L+O+8]=s.x,w[L+O+9]=s.y,w[L+O+10]=s.z,w[L+O+11]=F.itemSize===4?s.w:1)}}d={count:f,texture:_,size:new Je(E,T)},n.set(a,d),a.addEventListener("dispose",R)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const x=a.morphTargetsRelative?1:1-g;c.getUniforms().setValue(i,"morphTargetBaseInfluence",x),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function ix(i,e,t,n,s){let r=new WeakMap;function o(l){const u=s.render.frame,f=l.geometry,d=e.get(l,f);if(r.get(d)!==u&&(e.update(d),r.set(d,u)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==u&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),r.set(l,u))),l.isSkinnedMesh){const h=l.skeleton;r.get(h)!==u&&(h.update(),r.set(h,u))}return d}function a(){r=new WeakMap}function c(l){const u=l.target;u.removeEventListener("dispose",c),n.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:o,dispose:a}}const sx={[xf]:"LINEAR_TONE_MAPPING",[vf]:"REINHARD_TONE_MAPPING",[Mf]:"CINEON_TONE_MAPPING",[Sc]:"ACES_FILMIC_TONE_MAPPING",[Sf]:"AGX_TONE_MAPPING",[bf]:"NEUTRAL_TONE_MAPPING",[yf]:"CUSTOM_TONE_MAPPING"};function rx(i,e,t,n,s,r){const o=new Bn(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,depthTexture:s?new bs(e,t):void 0}),a=new Bn(e,t,{type:oi,depthBuffer:!1,stencilBuffer:!1}),c=new tn;c.setAttribute("position",new Ht([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new Ht([0,2,0,0,2,0],2));const l=new Sm({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),u=new Mt(c,l),f=new fr(-1,1,1,-1,0,1);let d=null,h=null,g=!1,x,m=null,p=[],S=!1;this.setSize=function(b,v){o.setSize(b,v),a.setSize(b,v);for(let E=0;E<p.length;E++){const T=p[E];T.setSize&&T.setSize(b,v)}},this.setEffects=function(b){p=b,S=p.length>0&&p[0].isRenderPass===!0;const v=o.width,E=o.height;for(let T=0;T<p.length;T++){const w=p[T];w.setSize&&w.setSize(v,E)}},this.begin=function(b,v){if(g||b.toneMapping===On&&p.length===0)return!1;if(m=v,v!==null){const E=v.width,T=v.height;(o.width!==E||o.height!==T)&&this.setSize(E,T)}return S===!1&&b.setRenderTarget(o),x=b.toneMapping,b.toneMapping=On,!0},this.hasRenderPass=function(){return S},this.end=function(b,v){b.toneMapping=x,g=!0;let E=o,T=a;for(let w=0;w<p.length;w++){const _=p[w];if(_.enabled!==!1&&(_.render(b,T,E,v),_.needsSwap!==!1)){const y=E;E=T,T=y}}if(d!==b.outputColorSpace||h!==b.toneMapping){d=b.outputColorSpace,h=b.toneMapping,l.defines={},je.getTransfer(d)===ot&&(l.defines.SRGB_TRANSFER="");const w=sx[h];w&&(l.defines[w]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=E.texture,b.setRenderTarget(m),b.render(u,f),m=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){o.depthTexture&&o.depthTexture.dispose(),o.dispose(),a.dispose(),c.dispose(),l.dispose()}}const Qf=new Ut,dc=new bs(1,1),jf=new Nf,ed=new Xp,td=new Vf,yu=[],Su=[],bu=new Float32Array(16),Eu=new Float32Array(9),Tu=new Float32Array(4);function Ps(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=yu[s];if(r===void 0&&(r=new Float32Array(s),yu[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function Ft(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Ot(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function To(i,e){let t=Su[e];t===void 0&&(t=new Int32Array(e),Su[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function ox(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function ax(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ft(t,e))return;i.uniform2fv(this.addr,e),Ot(t,e)}}function cx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ft(t,e))return;i.uniform3fv(this.addr,e),Ot(t,e)}}function lx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ft(t,e))return;i.uniform4fv(this.addr,e),Ot(t,e)}}function ux(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ft(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Ot(t,e)}else{if(Ft(t,n))return;Tu.set(n),i.uniformMatrix2fv(this.addr,!1,Tu),Ot(t,n)}}function fx(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ft(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Ot(t,e)}else{if(Ft(t,n))return;Eu.set(n),i.uniformMatrix3fv(this.addr,!1,Eu),Ot(t,n)}}function dx(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ft(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Ot(t,e)}else{if(Ft(t,n))return;bu.set(n),i.uniformMatrix4fv(this.addr,!1,bu),Ot(t,n)}}function hx(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function px(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ft(t,e))return;i.uniform2iv(this.addr,e),Ot(t,e)}}function mx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ft(t,e))return;i.uniform3iv(this.addr,e),Ot(t,e)}}function gx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ft(t,e))return;i.uniform4iv(this.addr,e),Ot(t,e)}}function _x(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function xx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ft(t,e))return;i.uniform2uiv(this.addr,e),Ot(t,e)}}function vx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ft(t,e))return;i.uniform3uiv(this.addr,e),Ot(t,e)}}function Mx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ft(t,e))return;i.uniform4uiv(this.addr,e),Ot(t,e)}}function yx(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(dc.compareFunction=t.isReversedDepthBuffer()?Ic:Pc,r=dc):r=Qf,t.setTexture2D(e||r,s)}function Sx(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||ed,s)}function bx(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||td,s)}function Ex(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||jf,s)}function Tx(i){switch(i){case 5126:return ox;case 35664:return ax;case 35665:return cx;case 35666:return lx;case 35674:return ux;case 35675:return fx;case 35676:return dx;case 5124:case 35670:return hx;case 35667:case 35671:return px;case 35668:case 35672:return mx;case 35669:case 35673:return gx;case 5125:return _x;case 36294:return xx;case 36295:return vx;case 36296:return Mx;case 35678:case 36198:case 36298:case 36306:case 35682:return yx;case 35679:case 36299:case 36307:return Sx;case 35680:case 36300:case 36308:case 36293:return bx;case 36289:case 36303:case 36311:case 36292:return Ex}}function Ax(i,e){i.uniform1fv(this.addr,e)}function Rx(i,e){const t=Ps(e,this.size,2);i.uniform2fv(this.addr,t)}function wx(i,e){const t=Ps(e,this.size,3);i.uniform3fv(this.addr,t)}function Cx(i,e){const t=Ps(e,this.size,4);i.uniform4fv(this.addr,t)}function Px(i,e){const t=Ps(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Ix(i,e){const t=Ps(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Lx(i,e){const t=Ps(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Dx(i,e){i.uniform1iv(this.addr,e)}function Nx(i,e){i.uniform2iv(this.addr,e)}function Ux(i,e){i.uniform3iv(this.addr,e)}function Fx(i,e){i.uniform4iv(this.addr,e)}function Ox(i,e){i.uniform1uiv(this.addr,e)}function Bx(i,e){i.uniform2uiv(this.addr,e)}function kx(i,e){i.uniform3uiv(this.addr,e)}function zx(i,e){i.uniform4uiv(this.addr,e)}function Hx(i,e,t){const n=this.cache,s=e.length,r=To(t,s);Ft(n,r)||(i.uniform1iv(this.addr,r),Ot(n,r));let o;this.type===i.SAMPLER_2D_SHADOW?o=dc:o=Qf;for(let a=0;a!==s;++a)t.setTexture2D(e[a]||o,r[a])}function Vx(i,e,t){const n=this.cache,s=e.length,r=To(t,s);Ft(n,r)||(i.uniform1iv(this.addr,r),Ot(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||ed,r[o])}function Gx(i,e,t){const n=this.cache,s=e.length,r=To(t,s);Ft(n,r)||(i.uniform1iv(this.addr,r),Ot(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||td,r[o])}function Wx(i,e,t){const n=this.cache,s=e.length,r=To(t,s);Ft(n,r)||(i.uniform1iv(this.addr,r),Ot(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||jf,r[o])}function Xx(i){switch(i){case 5126:return Ax;case 35664:return Rx;case 35665:return wx;case 35666:return Cx;case 35674:return Px;case 35675:return Ix;case 35676:return Lx;case 5124:case 35670:return Dx;case 35667:case 35671:return Nx;case 35668:case 35672:return Ux;case 35669:case 35673:return Fx;case 5125:return Ox;case 36294:return Bx;case 36295:return kx;case 36296:return zx;case 35678:case 36198:case 36298:case 36306:case 35682:return Hx;case 35679:case 36299:case 36307:return Vx;case 35680:case 36300:case 36308:case 36293:return Gx;case 36289:case 36303:case 36311:case 36292:return Wx}}class qx{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Tx(t.type)}}class Yx{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Xx(t.type)}}class Kx{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(e,t[a.id],n)}}}const fa=/(\w+)(\])?(\[|\.)?/g;function Au(i,e){i.seq.push(e),i.map[e.id]=e}function $x(i,e,t){const n=i.name,s=n.length;for(fa.lastIndex=0;;){const r=fa.exec(n),o=fa.lastIndex;let a=r[1];const c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){Au(t,l===void 0?new qx(a,i,e):new Yx(a,i,e));break}else{let f=t.map[a];f===void 0&&(f=new Kx(a),Au(t,f)),t=f}}}class to{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){const a=e.getActiveUniform(t,o),c=e.getUniformLocation(t,a.name);$x(a,c,this)}const s=[],r=[];for(const o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){const a=t[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const o=e[s];o.id in t&&n.push(o)}return n}}function Ru(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const Zx=37297;let Jx=0;function Qx(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}const wu=new He;function jx(i){je._getMatrix(wu,je.workingColorSpace,i);const e=`mat3( ${wu.elements.map(t=>t.toFixed(4))} )`;switch(je.getTransfer(i)){case ao:return[e,"LinearTransferOETF"];case ot:return[e,"sRGBTransferOETF"];default:return Ce("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Cu(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const o=/ERROR: 0:(\d+)/.exec(r);if(o){const a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+Qx(i.getShaderSource(e),a)}else return r}function ev(i,e){const t=jx(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const tv={[xf]:"Linear",[vf]:"Reinhard",[Mf]:"Cineon",[Sc]:"ACESFilmic",[Sf]:"AgX",[bf]:"Neutral",[yf]:"Custom"};function nv(i,e){const t=tv[e];return t===void 0?(Ce("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Gr=new k;function iv(){je.getLuminanceCoefficients(Gr);const i=Gr.x.toFixed(4),e=Gr.y.toFixed(4),t=Gr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function sv(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter($s).join(`
`)}function rv(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function ov(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function $s(i){return i!==""}function Pu(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Iu(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const av=/^[ \t]*#include +<([\w\d./]+)>/gm;function hc(i){return i.replace(av,lv)}const cv=new Map;function lv(i,e){let t=Ye[e];if(t===void 0){const n=cv.get(e);if(n!==void 0)t=Ye[n],Ce('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return hc(t)}const uv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Lu(i){return i.replace(uv,fv)}function fv(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Du(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const dv={[Kr]:"SHADOWMAP_TYPE_PCF",[Ys]:"SHADOWMAP_TYPE_VSM"};function hv(i){return dv[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const pv={[Gi]:"ENVMAP_TYPE_CUBE",[ys]:"ENVMAP_TYPE_CUBE",[yo]:"ENVMAP_TYPE_CUBE_UV"};function mv(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":pv[i.envMapMode]||"ENVMAP_TYPE_CUBE"}const gv={[ys]:"ENVMAP_MODE_REFRACTION"};function _v(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":gv[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}const xv={[_f]:"ENVMAP_BLENDING_MULTIPLY",[rp]:"ENVMAP_BLENDING_MIX",[op]:"ENVMAP_BLENDING_ADD"};function vv(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":xv[i.combine]||"ENVMAP_BLENDING_NONE"}function Mv(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function yv(i,e,t,n){const s=i.getContext(),r=t.defines;let o=t.vertexShader,a=t.fragmentShader;const c=hv(t),l=mv(t),u=_v(t),f=vv(t),d=Mv(t),h=sv(t),g=rv(r),x=s.createProgram();let m,p,S=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter($s).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter($s).join(`
`),p.length>0&&(p+=`
`)):(m=[Du(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter($s).join(`
`),p=[Du(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",t.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==On?"#define TONE_MAPPING":"",t.toneMapping!==On?Ye.tonemapping_pars_fragment:"",t.toneMapping!==On?nv("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ye.colorspace_pars_fragment,ev("linearToOutputTexel",t.outputColorSpace),iv(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter($s).join(`
`)),o=hc(o),o=Pu(o,t),o=Iu(o,t),a=hc(a),a=Pu(a,t),a=Iu(a,t),o=Lu(o),a=Lu(a),t.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[h,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===Pl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Pl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const b=S+m+o,v=S+p+a,E=Ru(s,s.VERTEX_SHADER,b),T=Ru(s,s.FRAGMENT_SHADER,v);s.attachShader(x,E),s.attachShader(x,T),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function w(C){if(i.debug.checkShaderErrors){const I=s.getProgramInfoLog(x)||"",D=s.getShaderInfoLog(E)||"",F=s.getShaderInfoLog(T)||"",L=I.trim(),G=D.trim(),O=F.trim();let H=!0,Z=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(H=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,E,T);else{const ne=Cu(s,E,"vertex"),re=Cu(s,T,"fragment");Be("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+L+`
`+ne+`
`+re)}else L!==""?Ce("WebGLProgram: Program Info Log:",L):(G===""||O==="")&&(Z=!1);Z&&(C.diagnostics={runnable:H,programLog:L,vertexShader:{log:G,prefix:m},fragmentShader:{log:O,prefix:p}})}s.deleteShader(E),s.deleteShader(T),_=new to(s,x),y=ov(s,x)}let _;this.getUniforms=function(){return _===void 0&&w(this),_};let y;this.getAttributes=function(){return y===void 0&&w(this),y};let R=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=s.getProgramParameter(x,Zx)),R},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Jx++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=E,this.fragmentShader=T,this}let Sv=0;class bv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){const s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Ev(e),t.set(e,n)),n}}class Ev{constructor(e){this.id=Sv++,this.code=e,this.usedTimes=0}}function Tv(i){return i===Wi||i===ro||i===oo}function Av(i,e,t,n,s,r){const o=new Uf,a=new bv,c=new Set,l=[],u=new Map,f=n.logarithmicDepthBuffer;let d=n.precision;const h={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(_){return c.add(_),_===0?"uv":`uv${_}`}function x(_,y,R,C,I,D){const F=C.fog,L=I.geometry,G=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?C.environment:null,O=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,H=e.get(_.envMap||G,O),Z=H&&H.mapping===yo?H.image.height:null,ne=h[_.type];_.precision!==null&&(d=n.getMaxPrecision(_.precision),d!==_.precision&&Ce("WebGLProgram.getParameters:",_.precision,"not supported, using",d,"instead."));const re=L.morphAttributes.position||L.morphAttributes.normal||L.morphAttributes.color,de=re!==void 0?re.length:0;let Ue=0;L.morphAttributes.position!==void 0&&(Ue=1),L.morphAttributes.normal!==void 0&&(Ue=2),L.morphAttributes.color!==void 0&&(Ue=3);let Qe,Ge,J,ee;if(ne){const Te=Dn[ne];Qe=Te.vertexShader,Ge=Te.fragmentShader}else{Qe=_.vertexShader,Ge=_.fragmentShader;const Te=a.getVertexShaderStage(_),bt=a.getFragmentShaderStage(_);a.update(_,Te,bt),J=Te.id,ee=bt.id}const oe=i.getRenderTarget(),Oe=i.state.buffers.depth.getReversed(),ze=I.isInstancedMesh===!0,De=I.isBatchedMesh===!0,yt=!!_.map,qe=!!_.matcap,rt=!!H,it=!!_.aoMap,tt=!!_.lightMap,ie=!!_.bumpMap&&_.wireframe===!1,ue=!!_.normalMap,ve=!!_.displacementMap,Ee=!!_.emissiveMap,Me=!!_.metalnessMap,Ne=!!_.roughnessMap,N=_.anisotropy>0,nt=_.clearcoat>0,Xe=_.dispersion>0,P=_.iridescence>0,M=_.sheen>0,z=_.transmission>0,W=N&&!!_.anisotropyMap,K=nt&&!!_.clearcoatMap,ce=nt&&!!_.clearcoatNormalMap,fe=nt&&!!_.clearcoatRoughnessMap,$=P&&!!_.iridescenceMap,V=P&&!!_.iridescenceThicknessMap,j=M&&!!_.sheenColorMap,le=M&&!!_.sheenRoughnessMap,ae=!!_.specularMap,se=!!_.specularColorMap,be=!!_.specularIntensityMap,Ie=z&&!!_.transmissionMap,ke=z&&!!_.thicknessMap,U=!!_.gradientMap,he=!!_.alphaMap,Q=_.alphaTest>0,pe=!!_.alphaHash,xe=!!_.extensions;let te=On;_.toneMapped&&(oe===null||oe.isXRRenderTarget===!0)&&(te=i.toneMapping);const we={shaderID:ne,shaderType:_.type,shaderName:_.name,vertexShader:Qe,fragmentShader:Ge,defines:_.defines,customVertexShaderID:J,customFragmentShaderID:ee,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:d,batching:De,batchingColor:De&&I._colorsTexture!==null,instancing:ze,instancingColor:ze&&I.instanceColor!==null,instancingMorph:ze&&I.morphTexture!==null,outputColorSpace:oe===null?i.outputColorSpace:oe.isXRRenderTarget===!0?oe.texture.colorSpace:je.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:yt,matcap:qe,envMap:rt,envMapMode:rt&&H.mapping,envMapCubeUVHeight:Z,aoMap:it,lightMap:tt,bumpMap:ie,normalMap:ue,displacementMap:ve,emissiveMap:Ee,normalMapObjectSpace:ue&&_.normalMapType===fp,normalMapTangentSpace:ue&&_.normalMapType===cc,packedNormalMap:ue&&_.normalMapType===cc&&Tv(_.normalMap.format),metalnessMap:Me,roughnessMap:Ne,anisotropy:N,anisotropyMap:W,clearcoat:nt,clearcoatMap:K,clearcoatNormalMap:ce,clearcoatRoughnessMap:fe,dispersion:Xe,iridescence:P,iridescenceMap:$,iridescenceThicknessMap:V,sheen:M,sheenColorMap:j,sheenRoughnessMap:le,specularMap:ae,specularColorMap:se,specularIntensityMap:be,transmission:z,transmissionMap:Ie,thicknessMap:ke,gradientMap:U,opaque:_.transparent===!1&&_.blending===gs&&_.alphaToCoverage===!1,alphaMap:he,alphaTest:Q,alphaHash:pe,combine:_.combine,mapUv:yt&&g(_.map.channel),aoMapUv:it&&g(_.aoMap.channel),lightMapUv:tt&&g(_.lightMap.channel),bumpMapUv:ie&&g(_.bumpMap.channel),normalMapUv:ue&&g(_.normalMap.channel),displacementMapUv:ve&&g(_.displacementMap.channel),emissiveMapUv:Ee&&g(_.emissiveMap.channel),metalnessMapUv:Me&&g(_.metalnessMap.channel),roughnessMapUv:Ne&&g(_.roughnessMap.channel),anisotropyMapUv:W&&g(_.anisotropyMap.channel),clearcoatMapUv:K&&g(_.clearcoatMap.channel),clearcoatNormalMapUv:ce&&g(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:fe&&g(_.clearcoatRoughnessMap.channel),iridescenceMapUv:$&&g(_.iridescenceMap.channel),iridescenceThicknessMapUv:V&&g(_.iridescenceThicknessMap.channel),sheenColorMapUv:j&&g(_.sheenColorMap.channel),sheenRoughnessMapUv:le&&g(_.sheenRoughnessMap.channel),specularMapUv:ae&&g(_.specularMap.channel),specularColorMapUv:se&&g(_.specularColorMap.channel),specularIntensityMapUv:be&&g(_.specularIntensityMap.channel),transmissionMapUv:Ie&&g(_.transmissionMap.channel),thicknessMapUv:ke&&g(_.thicknessMap.channel),alphaMapUv:he&&g(_.alphaMap.channel),vertexTangents:!!L.attributes.tangent&&(ue||N),vertexNormals:!!L.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!L.attributes.color&&L.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!L.attributes.uv&&(yt||he),fog:!!F,useFog:_.fog===!0,fogExp2:!!F&&F.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||L.attributes.normal===void 0&&ue===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:Oe,skinning:I.isSkinnedMesh===!0,hasPositionAttribute:L.attributes.position!==void 0,morphTargets:L.morphAttributes.position!==void 0,morphNormals:L.morphAttributes.normal!==void 0,morphColors:L.morphAttributes.color!==void 0,morphTargetsCount:de,morphTextureStride:Ue,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numLightProbeGrids:D.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&R.length>0,shadowMapType:i.shadowMap.type,toneMapping:te,decodeVideoTexture:yt&&_.map.isVideoTexture===!0&&je.getTransfer(_.map.colorSpace)===ot,decodeVideoTextureEmissive:Ee&&_.emissiveMap.isVideoTexture===!0&&je.getTransfer(_.emissiveMap.colorSpace)===ot,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Nn,flipSided:_.side===en,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:xe&&_.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(xe&&_.extensions.multiDraw===!0||De)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return we.vertexUv1s=c.has(1),we.vertexUv2s=c.has(2),we.vertexUv3s=c.has(3),c.clear(),we}function m(_){const y=[];if(_.shaderID?y.push(_.shaderID):(y.push(_.customVertexShaderID),y.push(_.customFragmentShaderID)),_.defines!==void 0)for(const R in _.defines)y.push(R),y.push(_.defines[R]);return _.isRawShaderMaterial===!1&&(p(y,_),S(y,_),y.push(i.outputColorSpace)),y.push(_.customProgramCacheKey),y.join()}function p(_,y){_.push(y.precision),_.push(y.outputColorSpace),_.push(y.envMapMode),_.push(y.envMapCubeUVHeight),_.push(y.mapUv),_.push(y.alphaMapUv),_.push(y.lightMapUv),_.push(y.aoMapUv),_.push(y.bumpMapUv),_.push(y.normalMapUv),_.push(y.displacementMapUv),_.push(y.emissiveMapUv),_.push(y.metalnessMapUv),_.push(y.roughnessMapUv),_.push(y.anisotropyMapUv),_.push(y.clearcoatMapUv),_.push(y.clearcoatNormalMapUv),_.push(y.clearcoatRoughnessMapUv),_.push(y.iridescenceMapUv),_.push(y.iridescenceThicknessMapUv),_.push(y.sheenColorMapUv),_.push(y.sheenRoughnessMapUv),_.push(y.specularMapUv),_.push(y.specularColorMapUv),_.push(y.specularIntensityMapUv),_.push(y.transmissionMapUv),_.push(y.thicknessMapUv),_.push(y.combine),_.push(y.fogExp2),_.push(y.sizeAttenuation),_.push(y.morphTargetsCount),_.push(y.morphAttributeCount),_.push(y.numDirLights),_.push(y.numPointLights),_.push(y.numSpotLights),_.push(y.numSpotLightMaps),_.push(y.numHemiLights),_.push(y.numRectAreaLights),_.push(y.numDirLightShadows),_.push(y.numPointLightShadows),_.push(y.numSpotLightShadows),_.push(y.numSpotLightShadowsWithMaps),_.push(y.numLightProbes),_.push(y.shadowMapType),_.push(y.toneMapping),_.push(y.numClippingPlanes),_.push(y.numClipIntersection),_.push(y.depthPacking)}function S(_,y){o.disableAll(),y.instancing&&o.enable(0),y.instancingColor&&o.enable(1),y.instancingMorph&&o.enable(2),y.matcap&&o.enable(3),y.envMap&&o.enable(4),y.normalMapObjectSpace&&o.enable(5),y.normalMapTangentSpace&&o.enable(6),y.clearcoat&&o.enable(7),y.iridescence&&o.enable(8),y.alphaTest&&o.enable(9),y.vertexColors&&o.enable(10),y.vertexAlphas&&o.enable(11),y.vertexUv1s&&o.enable(12),y.vertexUv2s&&o.enable(13),y.vertexUv3s&&o.enable(14),y.vertexTangents&&o.enable(15),y.anisotropy&&o.enable(16),y.alphaHash&&o.enable(17),y.batching&&o.enable(18),y.dispersion&&o.enable(19),y.batchingColor&&o.enable(20),y.gradientMap&&o.enable(21),y.packedNormalMap&&o.enable(22),y.vertexNormals&&o.enable(23),_.push(o.mask),o.disableAll(),y.fog&&o.enable(0),y.useFog&&o.enable(1),y.flatShading&&o.enable(2),y.logarithmicDepthBuffer&&o.enable(3),y.reversedDepthBuffer&&o.enable(4),y.skinning&&o.enable(5),y.morphTargets&&o.enable(6),y.morphNormals&&o.enable(7),y.morphColors&&o.enable(8),y.premultipliedAlpha&&o.enable(9),y.shadowMapEnabled&&o.enable(10),y.doubleSided&&o.enable(11),y.flipSided&&o.enable(12),y.useDepthPacking&&o.enable(13),y.dithering&&o.enable(14),y.transmission&&o.enable(15),y.sheen&&o.enable(16),y.opaque&&o.enable(17),y.pointsUvs&&o.enable(18),y.decodeVideoTexture&&o.enable(19),y.decodeVideoTextureEmissive&&o.enable(20),y.alphaToCoverage&&o.enable(21),y.numLightProbeGrids>0&&o.enable(22),y.hasPositionAttribute&&o.enable(23),_.push(o.mask)}function b(_){const y=h[_.type];let R;if(y){const C=Dn[y];R=vm.clone(C.uniforms)}else R=_.uniforms;return R}function v(_,y){let R=u.get(y);return R!==void 0?++R.usedTimes:(R=new yv(i,y,_,s),l.push(R),u.set(y,R)),R}function E(_){if(--_.usedTimes===0){const y=l.indexOf(_);l[y]=l[l.length-1],l.pop(),u.delete(_.cacheKey),_.destroy()}}function T(_){a.remove(_)}function w(){a.dispose()}return{getParameters:x,getProgramCacheKey:m,getUniforms:b,acquireProgram:v,releaseProgram:E,releaseShaderCache:T,programs:l,dispose:w}}function Rv(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,c){i.get(o)[a]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function wv(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function Nu(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Uu(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(d){let h=0;return d.isInstancedMesh&&(h+=2),d.isSkinnedMesh&&(h+=1),h}function a(d,h,g,x,m,p){let S=i[e];return S===void 0?(S={id:d.id,object:d,geometry:h,material:g,materialVariant:o(d),groupOrder:x,renderOrder:d.renderOrder,z:m,group:p},i[e]=S):(S.id=d.id,S.object=d,S.geometry=h,S.material=g,S.materialVariant=o(d),S.groupOrder=x,S.renderOrder=d.renderOrder,S.z=m,S.group=p),e++,S}function c(d,h,g,x,m,p){const S=a(d,h,g,x,m,p);g.transmission>0?n.push(S):g.transparent===!0?s.push(S):t.push(S)}function l(d,h,g,x,m,p){const S=a(d,h,g,x,m,p);g.transmission>0?n.unshift(S):g.transparent===!0?s.unshift(S):t.unshift(S)}function u(d,h,g){t.length>1&&t.sort(d||wv),n.length>1&&n.sort(h||Nu),s.length>1&&s.sort(h||Nu),g&&(t.reverse(),n.reverse(),s.reverse())}function f(){for(let d=e,h=i.length;d<h;d++){const g=i[d];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:c,unshift:l,finish:f,sort:u}}function Cv(){let i=new WeakMap;function e(n,s){const r=i.get(n);let o;return r===void 0?(o=new Uu,i.set(n,[o])):s>=r.length?(o=new Uu,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function Pv(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new k,color:new Fe};break;case"SpotLight":t={position:new k,direction:new k,color:new Fe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new k,color:new Fe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new k,skyColor:new Fe,groundColor:new Fe};break;case"RectAreaLight":t={color:new Fe,position:new k,halfWidth:new k,halfHeight:new k};break}return i[e.id]=t,t}}}function Iv(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Je};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Je};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Je,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let Lv=0;function Dv(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Nv(i){const e=new Pv,t=Iv(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new k);const s=new k,r=new Ke,o=new Ke;function a(l){let u=0,f=0,d=0;for(let y=0;y<9;y++)n.probe[y].set(0,0,0);let h=0,g=0,x=0,m=0,p=0,S=0,b=0,v=0,E=0,T=0,w=0;l.sort(Dv);for(let y=0,R=l.length;y<R;y++){const C=l[y],I=C.color,D=C.intensity,F=C.distance;let L=null;if(C.shadow&&C.shadow.map&&(C.shadow.map.texture.format===Wi?L=C.shadow.map.texture:L=C.shadow.map.depthTexture||C.shadow.map.texture),C.isAmbientLight)u+=I.r*D,f+=I.g*D,d+=I.b*D;else if(C.isLightProbe){for(let G=0;G<9;G++)n.probe[G].addScaledVector(C.sh.coefficients[G],D);w++}else if(C.isDirectionalLight){const G=e.get(C);if(G.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const O=C.shadow,H=t.get(C);H.shadowIntensity=O.intensity,H.shadowBias=O.bias,H.shadowNormalBias=O.normalBias,H.shadowRadius=O.radius,H.shadowMapSize=O.mapSize,n.directionalShadow[h]=H,n.directionalShadowMap[h]=L,n.directionalShadowMatrix[h]=C.shadow.matrix,S++}n.directional[h]=G,h++}else if(C.isSpotLight){const G=e.get(C);G.position.setFromMatrixPosition(C.matrixWorld),G.color.copy(I).multiplyScalar(D),G.distance=F,G.coneCos=Math.cos(C.angle),G.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),G.decay=C.decay,n.spot[x]=G;const O=C.shadow;if(C.map&&(n.spotLightMap[E]=C.map,E++,O.updateMatrices(C),C.castShadow&&T++),n.spotLightMatrix[x]=O.matrix,C.castShadow){const H=t.get(C);H.shadowIntensity=O.intensity,H.shadowBias=O.bias,H.shadowNormalBias=O.normalBias,H.shadowRadius=O.radius,H.shadowMapSize=O.mapSize,n.spotShadow[x]=H,n.spotShadowMap[x]=L,v++}x++}else if(C.isRectAreaLight){const G=e.get(C);G.color.copy(I).multiplyScalar(D),G.halfWidth.set(C.width*.5,0,0),G.halfHeight.set(0,C.height*.5,0),n.rectArea[m]=G,m++}else if(C.isPointLight){const G=e.get(C);if(G.color.copy(C.color).multiplyScalar(C.intensity),G.distance=C.distance,G.decay=C.decay,C.castShadow){const O=C.shadow,H=t.get(C);H.shadowIntensity=O.intensity,H.shadowBias=O.bias,H.shadowNormalBias=O.normalBias,H.shadowRadius=O.radius,H.shadowMapSize=O.mapSize,H.shadowCameraNear=O.camera.near,H.shadowCameraFar=O.camera.far,n.pointShadow[g]=H,n.pointShadowMap[g]=L,n.pointShadowMatrix[g]=C.shadow.matrix,b++}n.point[g]=G,g++}else if(C.isHemisphereLight){const G=e.get(C);G.skyColor.copy(C.color).multiplyScalar(D),G.groundColor.copy(C.groundColor).multiplyScalar(D),n.hemi[p]=G,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=me.LTC_FLOAT_1,n.rectAreaLTC2=me.LTC_FLOAT_2):(n.rectAreaLTC1=me.LTC_HALF_1,n.rectAreaLTC2=me.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=f,n.ambient[2]=d;const _=n.hash;(_.directionalLength!==h||_.pointLength!==g||_.spotLength!==x||_.rectAreaLength!==m||_.hemiLength!==p||_.numDirectionalShadows!==S||_.numPointShadows!==b||_.numSpotShadows!==v||_.numSpotMaps!==E||_.numLightProbes!==w)&&(n.directional.length=h,n.spot.length=x,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.pointShadow.length=b,n.pointShadowMap.length=b,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=S,n.pointShadowMatrix.length=b,n.spotLightMatrix.length=v+E-T,n.spotLightMap.length=E,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=w,_.directionalLength=h,_.pointLength=g,_.spotLength=x,_.rectAreaLength=m,_.hemiLength=p,_.numDirectionalShadows=S,_.numPointShadows=b,_.numSpotShadows=v,_.numSpotMaps=E,_.numLightProbes=w,n.version=Lv++)}function c(l,u){let f=0,d=0,h=0,g=0,x=0;const m=u.matrixWorldInverse;for(let p=0,S=l.length;p<S;p++){const b=l[p];if(b.isDirectionalLight){const v=n.directional[f];v.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),f++}else if(b.isSpotLight){const v=n.spot[h];v.position.setFromMatrixPosition(b.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),h++}else if(b.isRectAreaLight){const v=n.rectArea[g];v.position.setFromMatrixPosition(b.matrixWorld),v.position.applyMatrix4(m),o.identity(),r.copy(b.matrixWorld),r.premultiply(m),o.extractRotation(r),v.halfWidth.set(b.width*.5,0,0),v.halfHeight.set(0,b.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),g++}else if(b.isPointLight){const v=n.point[d];v.position.setFromMatrixPosition(b.matrixWorld),v.position.applyMatrix4(m),d++}else if(b.isHemisphereLight){const v=n.hemi[x];v.direction.setFromMatrixPosition(b.matrixWorld),v.direction.transformDirection(m),x++}}}return{setup:a,setupView:c,state:n}}function Fu(i){const e=new Nv(i),t=[],n=[],s=[];function r(d){f.camera=d,t.length=0,n.length=0,s.length=0}function o(d){t.push(d)}function a(d){n.push(d)}function c(d){s.push(d)}function l(){e.setup(t)}function u(d){e.setupView(t,d)}const f={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:f,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:a,pushLightProbeGrid:c}}function Uv(i){let e=new WeakMap;function t(s,r=0){const o=e.get(s);let a;return o===void 0?(a=new Fu(i),e.set(s,[a])):r>=o.length?(a=new Fu(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}const Fv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Ov=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Bv=[new k(1,0,0),new k(-1,0,0),new k(0,1,0),new k(0,-1,0),new k(0,0,1),new k(0,0,-1)],kv=[new k(0,-1,0),new k(0,-1,0),new k(0,0,1),new k(0,0,-1),new k(0,-1,0),new k(0,-1,0)],Ou=new Ke,Vs=new k,da=new k;function zv(i,e,t){let n=new Bc;const s=new Je,r=new Je,o=new ft,a=new bm,c=new Em,l={},u=t.maxTextureSize,f={[ri]:en,[en]:ri,[Nn]:Nn},d=new Vn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Je},radius:{value:4}},vertexShader:Fv,fragmentShader:Ov}),h=d.clone();h.defines.HORIZONTAL_PASS=1;const g=new tn;g.setAttribute("position",new Jt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new Mt(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Kr;let p=this.type;this.render=function(T,w,_){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;this.type===zh&&(Ce("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Kr);const y=i.getRenderTarget(),R=i.getActiveCubeFace(),C=i.getActiveMipmapLevel(),I=i.state;I.setBlending(ti),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const D=p!==this.type;D&&w.traverse(function(F){F.material&&(Array.isArray(F.material)?F.material.forEach(L=>L.needsUpdate=!0):F.material.needsUpdate=!0)});for(let F=0,L=T.length;F<L;F++){const G=T[F],O=G.shadow;if(O===void 0){Ce("WebGLShadowMap:",G,"has no shadow.");continue}if(O.autoUpdate===!1&&O.needsUpdate===!1)continue;s.copy(O.mapSize);const H=O.getFrameExtents();s.multiply(H),r.copy(O.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/H.x),s.x=r.x*H.x,O.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/H.y),s.y=r.y*H.y,O.mapSize.y=r.y));const Z=i.state.buffers.depth.getReversed();if(O.camera._reversedDepth=Z,O.map===null||D===!0){if(O.map!==null&&(O.map.depthTexture!==null&&(O.map.depthTexture.dispose(),O.map.depthTexture=null),O.map.dispose()),this.type===Ys){if(G.isPointLight){Ce("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}O.map=new Bn(s.x,s.y,{format:Wi,type:oi,minFilter:Nt,magFilter:Nt,generateMipmaps:!1}),O.map.texture.name=G.name+".shadowMap",O.map.depthTexture=new bs(s.x,s.y,mn),O.map.depthTexture.name=G.name+".shadowMapDepth",O.map.depthTexture.format=ai,O.map.depthTexture.compareFunction=null,O.map.depthTexture.minFilter=Dt,O.map.depthTexture.magFilter=Dt}else G.isPointLight?(O.map=new Jf(s.x),O.map.depthTexture=new _m(s.x,Hn)):(O.map=new Bn(s.x,s.y),O.map.depthTexture=new bs(s.x,s.y,Hn)),O.map.depthTexture.name=G.name+".shadowMap",O.map.depthTexture.format=ai,this.type===Kr?(O.map.depthTexture.compareFunction=Z?Ic:Pc,O.map.depthTexture.minFilter=Nt,O.map.depthTexture.magFilter=Nt):(O.map.depthTexture.compareFunction=null,O.map.depthTexture.minFilter=Dt,O.map.depthTexture.magFilter=Dt);O.camera.updateProjectionMatrix()}const ne=O.map.isWebGLCubeRenderTarget?6:1;for(let re=0;re<ne;re++){if(O.map.isWebGLCubeRenderTarget)i.setRenderTarget(O.map,re),i.clear();else{re===0&&(i.setRenderTarget(O.map),i.clear());const de=O.getViewport(re);o.set(r.x*de.x,r.y*de.y,r.x*de.z,r.y*de.w),I.viewport(o)}if(G.isPointLight){const de=O.camera,Ue=O.matrix,Qe=G.distance||de.far;Qe!==de.far&&(de.far=Qe,de.updateProjectionMatrix()),Vs.setFromMatrixPosition(G.matrixWorld),de.position.copy(Vs),da.copy(de.position),da.add(Bv[re]),de.up.copy(kv[re]),de.lookAt(da),de.updateMatrixWorld(),Ue.makeTranslation(-Vs.x,-Vs.y,-Vs.z),Ou.multiplyMatrices(de.projectionMatrix,de.matrixWorldInverse),O._frustum.setFromProjectionMatrix(Ou,de.coordinateSystem,de.reversedDepth)}else O.updateMatrices(G);n=O.getFrustum(),v(w,_,O.camera,G,this.type)}O.isPointLightShadow!==!0&&this.type===Ys&&S(O,_),O.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(y,R,C)};function S(T,w){const _=e.update(x);d.defines.VSM_SAMPLES!==T.blurSamples&&(d.defines.VSM_SAMPLES=T.blurSamples,h.defines.VSM_SAMPLES=T.blurSamples,d.needsUpdate=!0,h.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Bn(s.x,s.y,{format:Wi,type:oi})),d.uniforms.shadow_pass.value=T.map.depthTexture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(w,null,_,d,x,null),h.uniforms.shadow_pass.value=T.mapPass.texture,h.uniforms.resolution.value=T.mapSize,h.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(w,null,_,h,x,null)}function b(T,w,_,y){let R=null;const C=_.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(C!==void 0)R=C;else if(R=_.isPointLight===!0?c:a,i.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0||w.alphaToCoverage===!0){const I=R.uuid,D=w.uuid;let F=l[I];F===void 0&&(F={},l[I]=F);let L=F[D];L===void 0&&(L=R.clone(),F[D]=L,w.addEventListener("dispose",E)),R=L}if(R.visible=w.visible,R.wireframe=w.wireframe,y===Ys?R.side=w.shadowSide!==null?w.shadowSide:w.side:R.side=w.shadowSide!==null?w.shadowSide:f[w.side],R.alphaMap=w.alphaMap,R.alphaTest=w.alphaToCoverage===!0?.5:w.alphaTest,R.map=w.map,R.clipShadows=w.clipShadows,R.clippingPlanes=w.clippingPlanes,R.clipIntersection=w.clipIntersection,R.displacementMap=w.displacementMap,R.displacementScale=w.displacementScale,R.displacementBias=w.displacementBias,R.wireframeLinewidth=w.wireframeLinewidth,R.linewidth=w.linewidth,_.isPointLight===!0&&R.isMeshDistanceMaterial===!0){const I=i.properties.get(R);I.light=_}return R}function v(T,w,_,y,R){if(T.visible===!1)return;if(T.layers.test(w.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&R===Ys)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,T.matrixWorld);const D=e.update(T),F=T.material;if(Array.isArray(F)){const L=D.groups;for(let G=0,O=L.length;G<O;G++){const H=L[G],Z=F[H.materialIndex];if(Z&&Z.visible){const ne=b(T,Z,y,R);T.onBeforeShadow(i,T,w,_,D,ne,H),i.renderBufferDirect(_,null,D,ne,T,H),T.onAfterShadow(i,T,w,_,D,ne,H)}}}else if(F.visible){const L=b(T,F,y,R);T.onBeforeShadow(i,T,w,_,D,L,null),i.renderBufferDirect(_,null,D,L,T,null),T.onAfterShadow(i,T,w,_,D,L,null)}}const I=T.children;for(let D=0,F=I.length;D<F;D++)v(I[D],w,_,y,R)}function E(T){T.target.removeEventListener("dispose",E);for(const _ in l){const y=l[_],R=T.target.uuid;R in y&&(y[R].dispose(),delete y[R])}}}function Hv(i,e){function t(){let U=!1;const he=new ft;let Q=null;const pe=new ft(0,0,0,0);return{setMask:function(xe){Q!==xe&&!U&&(i.colorMask(xe,xe,xe,xe),Q=xe)},setLocked:function(xe){U=xe},setClear:function(xe,te,we,Te,bt){bt===!0&&(xe*=Te,te*=Te,we*=Te),he.set(xe,te,we,Te),pe.equals(he)===!1&&(i.clearColor(xe,te,we,Te),pe.copy(he))},reset:function(){U=!1,Q=null,pe.set(-1,0,0,0)}}}function n(){let U=!1,he=!1,Q=null,pe=null,xe=null;return{setReversed:function(te){if(he!==te){const we=e.get("EXT_clip_control");te?we.clipControlEXT(we.LOWER_LEFT_EXT,we.ZERO_TO_ONE_EXT):we.clipControlEXT(we.LOWER_LEFT_EXT,we.NEGATIVE_ONE_TO_ONE_EXT),he=te;const Te=xe;xe=null,this.setClear(Te)}},getReversed:function(){return he},setTest:function(te){te?oe(i.DEPTH_TEST):Oe(i.DEPTH_TEST)},setMask:function(te){Q!==te&&!U&&(i.depthMask(te),Q=te)},setFunc:function(te){if(he&&(te=Sp[te]),pe!==te){switch(te){case Ea:i.depthFunc(i.NEVER);break;case Ta:i.depthFunc(i.ALWAYS);break;case Aa:i.depthFunc(i.LESS);break;case Ms:i.depthFunc(i.LEQUAL);break;case Ra:i.depthFunc(i.EQUAL);break;case wa:i.depthFunc(i.GEQUAL);break;case Ca:i.depthFunc(i.GREATER);break;case Pa:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}pe=te}},setLocked:function(te){U=te},setClear:function(te){xe!==te&&(xe=te,he&&(te=1-te),i.clearDepth(te))},reset:function(){U=!1,Q=null,pe=null,xe=null,he=!1}}}function s(){let U=!1,he=null,Q=null,pe=null,xe=null,te=null,we=null,Te=null,bt=null;return{setTest:function(gt){U||(gt?oe(i.STENCIL_TEST):Oe(i.STENCIL_TEST))},setMask:function(gt){he!==gt&&!U&&(i.stencilMask(gt),he=gt)},setFunc:function(gt,Tn,An){(Q!==gt||pe!==Tn||xe!==An)&&(i.stencilFunc(gt,Tn,An),Q=gt,pe=Tn,xe=An)},setOp:function(gt,Tn,An){(te!==gt||we!==Tn||Te!==An)&&(i.stencilOp(gt,Tn,An),te=gt,we=Tn,Te=An)},setLocked:function(gt){U=gt},setClear:function(gt){bt!==gt&&(i.clearStencil(gt),bt=gt)},reset:function(){U=!1,he=null,Q=null,pe=null,xe=null,te=null,we=null,Te=null,bt=null}}}const r=new t,o=new n,a=new s,c=new WeakMap,l=new WeakMap;let u={},f={},d={},h=new WeakMap,g=[],x=null,m=!1,p=null,S=null,b=null,v=null,E=null,T=null,w=null,_=new Fe(0,0,0),y=0,R=!1,C=null,I=null,D=null,F=null,L=null;const G=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let O=!1,H=0;const Z=i.getParameter(i.VERSION);Z.indexOf("WebGL")!==-1?(H=parseFloat(/^WebGL (\d)/.exec(Z)[1]),O=H>=1):Z.indexOf("OpenGL ES")!==-1&&(H=parseFloat(/^OpenGL ES (\d)/.exec(Z)[1]),O=H>=2);let ne=null,re={};const de=i.getParameter(i.SCISSOR_BOX),Ue=i.getParameter(i.VIEWPORT),Qe=new ft().fromArray(de),Ge=new ft().fromArray(Ue);function J(U,he,Q,pe){const xe=new Uint8Array(4),te=i.createTexture();i.bindTexture(U,te),i.texParameteri(U,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(U,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let we=0;we<Q;we++)U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY?i.texImage3D(he,0,i.RGBA,1,1,pe,0,i.RGBA,i.UNSIGNED_BYTE,xe):i.texImage2D(he+we,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,xe);return te}const ee={};ee[i.TEXTURE_2D]=J(i.TEXTURE_2D,i.TEXTURE_2D,1),ee[i.TEXTURE_CUBE_MAP]=J(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ee[i.TEXTURE_2D_ARRAY]=J(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ee[i.TEXTURE_3D]=J(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),oe(i.DEPTH_TEST),o.setFunc(Ms),ie(!1),ue(Ml),oe(i.CULL_FACE),it(ti);function oe(U){u[U]!==!0&&(i.enable(U),u[U]=!0)}function Oe(U){u[U]!==!1&&(i.disable(U),u[U]=!1)}function ze(U,he){return d[U]!==he?(i.bindFramebuffer(U,he),d[U]=he,U===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=he),U===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=he),!0):!1}function De(U,he){let Q=g,pe=!1;if(U){Q=h.get(he),Q===void 0&&(Q=[],h.set(he,Q));const xe=U.textures;if(Q.length!==xe.length||Q[0]!==i.COLOR_ATTACHMENT0){for(let te=0,we=xe.length;te<we;te++)Q[te]=i.COLOR_ATTACHMENT0+te;Q.length=xe.length,pe=!0}}else Q[0]!==i.BACK&&(Q[0]=i.BACK,pe=!0);pe&&i.drawBuffers(Q)}function yt(U){return x!==U?(i.useProgram(U),x=U,!0):!1}const qe={[Ni]:i.FUNC_ADD,[Vh]:i.FUNC_SUBTRACT,[Gh]:i.FUNC_REVERSE_SUBTRACT};qe[Wh]=i.MIN,qe[Xh]=i.MAX;const rt={[qh]:i.ZERO,[Yh]:i.ONE,[Kh]:i.SRC_COLOR,[Sa]:i.SRC_ALPHA,[ep]:i.SRC_ALPHA_SATURATE,[Qh]:i.DST_COLOR,[Zh]:i.DST_ALPHA,[$h]:i.ONE_MINUS_SRC_COLOR,[ba]:i.ONE_MINUS_SRC_ALPHA,[jh]:i.ONE_MINUS_DST_COLOR,[Jh]:i.ONE_MINUS_DST_ALPHA,[tp]:i.CONSTANT_COLOR,[np]:i.ONE_MINUS_CONSTANT_COLOR,[ip]:i.CONSTANT_ALPHA,[sp]:i.ONE_MINUS_CONSTANT_ALPHA};function it(U,he,Q,pe,xe,te,we,Te,bt,gt){if(U===ti){m===!0&&(Oe(i.BLEND),m=!1);return}if(m===!1&&(oe(i.BLEND),m=!0),U!==Hh){if(U!==p||gt!==R){if((S!==Ni||E!==Ni)&&(i.blendEquation(i.FUNC_ADD),S=Ni,E=Ni),gt)switch(U){case gs:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case yl:i.blendFunc(i.ONE,i.ONE);break;case Sl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case bl:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Be("WebGLState: Invalid blending: ",U);break}else switch(U){case gs:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case yl:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Sl:Be("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case bl:Be("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Be("WebGLState: Invalid blending: ",U);break}b=null,v=null,T=null,w=null,_.set(0,0,0),y=0,p=U,R=gt}return}xe=xe||he,te=te||Q,we=we||pe,(he!==S||xe!==E)&&(i.blendEquationSeparate(qe[he],qe[xe]),S=he,E=xe),(Q!==b||pe!==v||te!==T||we!==w)&&(i.blendFuncSeparate(rt[Q],rt[pe],rt[te],rt[we]),b=Q,v=pe,T=te,w=we),(Te.equals(_)===!1||bt!==y)&&(i.blendColor(Te.r,Te.g,Te.b,bt),_.copy(Te),y=bt),p=U,R=!1}function tt(U,he){U.side===Nn?Oe(i.CULL_FACE):oe(i.CULL_FACE);let Q=U.side===en;he&&(Q=!Q),ie(Q),U.blending===gs&&U.transparent===!1?it(ti):it(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),o.setFunc(U.depthFunc),o.setTest(U.depthTest),o.setMask(U.depthWrite),r.setMask(U.colorWrite);const pe=U.stencilWrite;a.setTest(pe),pe&&(a.setMask(U.stencilWriteMask),a.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),a.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),Ee(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?oe(i.SAMPLE_ALPHA_TO_COVERAGE):Oe(i.SAMPLE_ALPHA_TO_COVERAGE)}function ie(U){C!==U&&(U?i.frontFace(i.CW):i.frontFace(i.CCW),C=U)}function ue(U){U!==Bh?(oe(i.CULL_FACE),U!==I&&(U===Ml?i.cullFace(i.BACK):U===kh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Oe(i.CULL_FACE),I=U}function ve(U){U!==D&&(O&&i.lineWidth(U),D=U)}function Ee(U,he,Q){U?(oe(i.POLYGON_OFFSET_FILL),(F!==he||L!==Q)&&(F=he,L=Q,o.getReversed()&&(he=-he),i.polygonOffset(he,Q))):Oe(i.POLYGON_OFFSET_FILL)}function Me(U){U?oe(i.SCISSOR_TEST):Oe(i.SCISSOR_TEST)}function Ne(U){U===void 0&&(U=i.TEXTURE0+G-1),ne!==U&&(i.activeTexture(U),ne=U)}function N(U,he,Q){Q===void 0&&(ne===null?Q=i.TEXTURE0+G-1:Q=ne);let pe=re[Q];pe===void 0&&(pe={type:void 0,texture:void 0},re[Q]=pe),(pe.type!==U||pe.texture!==he)&&(ne!==Q&&(i.activeTexture(Q),ne=Q),i.bindTexture(U,he||ee[U]),pe.type=U,pe.texture=he)}function nt(){const U=re[ne];U!==void 0&&U.type!==void 0&&(i.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function Xe(){try{i.compressedTexImage2D(...arguments)}catch(U){Be("WebGLState:",U)}}function P(){try{i.compressedTexImage3D(...arguments)}catch(U){Be("WebGLState:",U)}}function M(){try{i.texSubImage2D(...arguments)}catch(U){Be("WebGLState:",U)}}function z(){try{i.texSubImage3D(...arguments)}catch(U){Be("WebGLState:",U)}}function W(){try{i.compressedTexSubImage2D(...arguments)}catch(U){Be("WebGLState:",U)}}function K(){try{i.compressedTexSubImage3D(...arguments)}catch(U){Be("WebGLState:",U)}}function ce(){try{i.texStorage2D(...arguments)}catch(U){Be("WebGLState:",U)}}function fe(){try{i.texStorage3D(...arguments)}catch(U){Be("WebGLState:",U)}}function $(){try{i.texImage2D(...arguments)}catch(U){Be("WebGLState:",U)}}function V(){try{i.texImage3D(...arguments)}catch(U){Be("WebGLState:",U)}}function j(U){return f[U]!==void 0?f[U]:i.getParameter(U)}function le(U,he){f[U]!==he&&(i.pixelStorei(U,he),f[U]=he)}function ae(U){Qe.equals(U)===!1&&(i.scissor(U.x,U.y,U.z,U.w),Qe.copy(U))}function se(U){Ge.equals(U)===!1&&(i.viewport(U.x,U.y,U.z,U.w),Ge.copy(U))}function be(U,he){let Q=l.get(he);Q===void 0&&(Q=new WeakMap,l.set(he,Q));let pe=Q.get(U);pe===void 0&&(pe=i.getUniformBlockIndex(he,U.name),Q.set(U,pe))}function Ie(U,he){const pe=l.get(he).get(U);c.get(he)!==pe&&(i.uniformBlockBinding(he,pe,U.__bindingPointIndex),c.set(he,pe))}function ke(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),u={},f={},ne=null,re={},d={},h=new WeakMap,g=[],x=null,m=!1,p=null,S=null,b=null,v=null,E=null,T=null,w=null,_=new Fe(0,0,0),y=0,R=!1,C=null,I=null,D=null,F=null,L=null,Qe.set(0,0,i.canvas.width,i.canvas.height),Ge.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:oe,disable:Oe,bindFramebuffer:ze,drawBuffers:De,useProgram:yt,setBlending:it,setMaterial:tt,setFlipSided:ie,setCullFace:ue,setLineWidth:ve,setPolygonOffset:Ee,setScissorTest:Me,activeTexture:Ne,bindTexture:N,unbindTexture:nt,compressedTexImage2D:Xe,compressedTexImage3D:P,texImage2D:$,texImage3D:V,pixelStorei:le,getParameter:j,updateUBOMapping:be,uniformBlockBinding:Ie,texStorage2D:ce,texStorage3D:fe,texSubImage2D:M,texSubImage3D:z,compressedTexSubImage2D:W,compressedTexSubImage3D:K,scissor:ae,viewport:se,reset:ke}}function Vv(i,e,t,n,s,r,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Je,u=new WeakMap,f=new Set;let d;const h=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(P,M){return g?new OffscreenCanvas(P,M):rr("canvas")}function m(P,M,z){let W=1;const K=Xe(P);if((K.width>z||K.height>z)&&(W=z/Math.max(K.width,K.height)),W<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const ce=Math.floor(W*K.width),fe=Math.floor(W*K.height);d===void 0&&(d=x(ce,fe));const $=M?x(ce,fe):d;return $.width=ce,$.height=fe,$.getContext("2d").drawImage(P,0,0,ce,fe),Ce("WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+ce+"x"+fe+")."),$}else return"data"in P&&Ce("WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),P;return P}function p(P){return P.generateMipmaps}function S(P){i.generateMipmap(P)}function b(P){return P.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?i.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(P,M,z,W,K,ce=!1){if(P!==null){if(i[P]!==void 0)return i[P];Ce("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let fe;W&&(fe=e.get("EXT_texture_norm16"),fe||Ce("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let $=M;if(M===i.RED&&(z===i.FLOAT&&($=i.R32F),z===i.HALF_FLOAT&&($=i.R16F),z===i.UNSIGNED_BYTE&&($=i.R8),z===i.UNSIGNED_SHORT&&fe&&($=fe.R16_EXT),z===i.SHORT&&fe&&($=fe.R16_SNORM_EXT)),M===i.RED_INTEGER&&(z===i.UNSIGNED_BYTE&&($=i.R8UI),z===i.UNSIGNED_SHORT&&($=i.R16UI),z===i.UNSIGNED_INT&&($=i.R32UI),z===i.BYTE&&($=i.R8I),z===i.SHORT&&($=i.R16I),z===i.INT&&($=i.R32I)),M===i.RG&&(z===i.FLOAT&&($=i.RG32F),z===i.HALF_FLOAT&&($=i.RG16F),z===i.UNSIGNED_BYTE&&($=i.RG8),z===i.UNSIGNED_SHORT&&fe&&($=fe.RG16_EXT),z===i.SHORT&&fe&&($=fe.RG16_SNORM_EXT)),M===i.RG_INTEGER&&(z===i.UNSIGNED_BYTE&&($=i.RG8UI),z===i.UNSIGNED_SHORT&&($=i.RG16UI),z===i.UNSIGNED_INT&&($=i.RG32UI),z===i.BYTE&&($=i.RG8I),z===i.SHORT&&($=i.RG16I),z===i.INT&&($=i.RG32I)),M===i.RGB_INTEGER&&(z===i.UNSIGNED_BYTE&&($=i.RGB8UI),z===i.UNSIGNED_SHORT&&($=i.RGB16UI),z===i.UNSIGNED_INT&&($=i.RGB32UI),z===i.BYTE&&($=i.RGB8I),z===i.SHORT&&($=i.RGB16I),z===i.INT&&($=i.RGB32I)),M===i.RGBA_INTEGER&&(z===i.UNSIGNED_BYTE&&($=i.RGBA8UI),z===i.UNSIGNED_SHORT&&($=i.RGBA16UI),z===i.UNSIGNED_INT&&($=i.RGBA32UI),z===i.BYTE&&($=i.RGBA8I),z===i.SHORT&&($=i.RGBA16I),z===i.INT&&($=i.RGBA32I)),M===i.RGB&&(z===i.UNSIGNED_SHORT&&fe&&($=fe.RGB16_EXT),z===i.SHORT&&fe&&($=fe.RGB16_SNORM_EXT),z===i.UNSIGNED_INT_5_9_9_9_REV&&($=i.RGB9_E5),z===i.UNSIGNED_INT_10F_11F_11F_REV&&($=i.R11F_G11F_B10F)),M===i.RGBA){const V=ce?ao:je.getTransfer(K);z===i.FLOAT&&($=i.RGBA32F),z===i.HALF_FLOAT&&($=i.RGBA16F),z===i.UNSIGNED_BYTE&&($=V===ot?i.SRGB8_ALPHA8:i.RGBA8),z===i.UNSIGNED_SHORT&&fe&&($=fe.RGBA16_EXT),z===i.SHORT&&fe&&($=fe.RGBA16_SNORM_EXT),z===i.UNSIGNED_SHORT_4_4_4_4&&($=i.RGBA4),z===i.UNSIGNED_SHORT_5_5_5_1&&($=i.RGB5_A1)}return($===i.R16F||$===i.R32F||$===i.RG16F||$===i.RG32F||$===i.RGBA16F||$===i.RGBA32F)&&e.get("EXT_color_buffer_float"),$}function E(P,M){let z;return P?M===null||M===Hn||M===tr?z=i.DEPTH24_STENCIL8:M===mn?z=i.DEPTH32F_STENCIL8:M===er&&(z=i.DEPTH24_STENCIL8,Ce("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===Hn||M===tr?z=i.DEPTH_COMPONENT24:M===mn?z=i.DEPTH_COMPONENT32F:M===er&&(z=i.DEPTH_COMPONENT16),z}function T(P,M){return p(P)===!0||P.isFramebufferTexture&&P.minFilter!==Dt&&P.minFilter!==Nt?Math.log2(Math.max(M.width,M.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?M.mipmaps.length:1}function w(P){const M=P.target;M.removeEventListener("dispose",w),y(M),M.isVideoTexture&&u.delete(M),M.isHTMLTexture&&f.delete(M)}function _(P){const M=P.target;M.removeEventListener("dispose",_),C(M)}function y(P){const M=n.get(P);if(M.__webglInit===void 0)return;const z=P.source,W=h.get(z);if(W){const K=W[M.__cacheKey];K.usedTimes--,K.usedTimes===0&&R(P),Object.keys(W).length===0&&h.delete(z)}n.remove(P)}function R(P){const M=n.get(P);i.deleteTexture(M.__webglTexture);const z=P.source,W=h.get(z);delete W[M.__cacheKey],o.memory.textures--}function C(P){const M=n.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),n.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let W=0;W<6;W++){if(Array.isArray(M.__webglFramebuffer[W]))for(let K=0;K<M.__webglFramebuffer[W].length;K++)i.deleteFramebuffer(M.__webglFramebuffer[W][K]);else i.deleteFramebuffer(M.__webglFramebuffer[W]);M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer[W])}else{if(Array.isArray(M.__webglFramebuffer))for(let W=0;W<M.__webglFramebuffer.length;W++)i.deleteFramebuffer(M.__webglFramebuffer[W]);else i.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&i.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let W=0;W<M.__webglColorRenderbuffer.length;W++)M.__webglColorRenderbuffer[W]&&i.deleteRenderbuffer(M.__webglColorRenderbuffer[W]);M.__webglDepthRenderbuffer&&i.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const z=P.textures;for(let W=0,K=z.length;W<K;W++){const ce=n.get(z[W]);ce.__webglTexture&&(i.deleteTexture(ce.__webglTexture),o.memory.textures--),n.remove(z[W])}n.remove(P)}let I=0;function D(){I=0}function F(){return I}function L(P){I=P}function G(){const P=I;return P>=s.maxTextures&&Ce("WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+s.maxTextures),I+=1,P}function O(P){const M=[];return M.push(P.wrapS),M.push(P.wrapT),M.push(P.wrapR||0),M.push(P.magFilter),M.push(P.minFilter),M.push(P.anisotropy),M.push(P.internalFormat),M.push(P.format),M.push(P.type),M.push(P.generateMipmaps),M.push(P.premultiplyAlpha),M.push(P.flipY),M.push(P.unpackAlignment),M.push(P.colorSpace),M.join()}function H(P,M){const z=n.get(P);if(P.isVideoTexture&&N(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&z.__version!==P.version){const W=P.image;if(W===null)Ce("WebGLRenderer: Texture marked for update but no image data found.");else if(W.complete===!1)Ce("WebGLRenderer: Texture marked for update but image is incomplete");else{Oe(z,P,M);return}}else P.isExternalTexture&&(z.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,z.__webglTexture,i.TEXTURE0+M)}function Z(P,M){const z=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&z.__version!==P.version){Oe(z,P,M);return}else P.isExternalTexture&&(z.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,z.__webglTexture,i.TEXTURE0+M)}function ne(P,M){const z=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&z.__version!==P.version){Oe(z,P,M);return}t.bindTexture(i.TEXTURE_3D,z.__webglTexture,i.TEXTURE0+M)}function re(P,M){const z=n.get(P);if(P.isCubeDepthTexture!==!0&&P.version>0&&z.__version!==P.version){ze(z,P,M);return}t.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture,i.TEXTURE0+M)}const de={[zn]:i.REPEAT,[Un]:i.CLAMP_TO_EDGE,[so]:i.MIRRORED_REPEAT},Ue={[Dt]:i.NEAREST,[Tf]:i.NEAREST_MIPMAP_NEAREST,[Ks]:i.NEAREST_MIPMAP_LINEAR,[Nt]:i.LINEAR,[$r]:i.LINEAR_MIPMAP_NEAREST,[jn]:i.LINEAR_MIPMAP_LINEAR},Qe={[dp]:i.NEVER,[_p]:i.ALWAYS,[hp]:i.LESS,[Pc]:i.LEQUAL,[pp]:i.EQUAL,[Ic]:i.GEQUAL,[mp]:i.GREATER,[gp]:i.NOTEQUAL};function Ge(P,M){if(M.type===mn&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===Nt||M.magFilter===$r||M.magFilter===Ks||M.magFilter===jn||M.minFilter===Nt||M.minFilter===$r||M.minFilter===Ks||M.minFilter===jn)&&Ce("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(P,i.TEXTURE_WRAP_S,de[M.wrapS]),i.texParameteri(P,i.TEXTURE_WRAP_T,de[M.wrapT]),(P===i.TEXTURE_3D||P===i.TEXTURE_2D_ARRAY)&&i.texParameteri(P,i.TEXTURE_WRAP_R,de[M.wrapR]),i.texParameteri(P,i.TEXTURE_MAG_FILTER,Ue[M.magFilter]),i.texParameteri(P,i.TEXTURE_MIN_FILTER,Ue[M.minFilter]),M.compareFunction&&(i.texParameteri(P,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(P,i.TEXTURE_COMPARE_FUNC,Qe[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===Dt||M.minFilter!==Ks&&M.minFilter!==jn||M.type===mn&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||n.get(M).__currentAnisotropy){const z=e.get("EXT_texture_filter_anisotropic");i.texParameterf(P,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,s.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy}}}function J(P,M){let z=!1;P.__webglInit===void 0&&(P.__webglInit=!0,M.addEventListener("dispose",w));const W=M.source;let K=h.get(W);K===void 0&&(K={},h.set(W,K));const ce=O(M);if(ce!==P.__cacheKey){K[ce]===void 0&&(K[ce]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,z=!0),K[ce].usedTimes++;const fe=K[P.__cacheKey];fe!==void 0&&(K[P.__cacheKey].usedTimes--,fe.usedTimes===0&&R(M)),P.__cacheKey=ce,P.__webglTexture=K[ce].texture}return z}function ee(P,M,z){return Math.floor(Math.floor(P/z)/M)}function oe(P,M,z,W){const ce=P.updateRanges;if(ce.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,M.width,M.height,z,W,M.data);else{ce.sort((le,ae)=>le.start-ae.start);let fe=0;for(let le=1;le<ce.length;le++){const ae=ce[fe],se=ce[le],be=ae.start+ae.count,Ie=ee(se.start,M.width,4),ke=ee(ae.start,M.width,4);se.start<=be+1&&Ie===ke&&ee(se.start+se.count-1,M.width,4)===Ie?ae.count=Math.max(ae.count,se.start+se.count-ae.start):(++fe,ce[fe]=se)}ce.length=fe+1;const $=t.getParameter(i.UNPACK_ROW_LENGTH),V=t.getParameter(i.UNPACK_SKIP_PIXELS),j=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,M.width);for(let le=0,ae=ce.length;le<ae;le++){const se=ce[le],be=Math.floor(se.start/4),Ie=Math.ceil(se.count/4),ke=be%M.width,U=Math.floor(be/M.width),he=Ie,Q=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,ke),t.pixelStorei(i.UNPACK_SKIP_ROWS,U),t.texSubImage2D(i.TEXTURE_2D,0,ke,U,he,Q,z,W,M.data)}P.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,$),t.pixelStorei(i.UNPACK_SKIP_PIXELS,V),t.pixelStorei(i.UNPACK_SKIP_ROWS,j)}}function Oe(P,M,z){let W=i.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(W=i.TEXTURE_2D_ARRAY),M.isData3DTexture&&(W=i.TEXTURE_3D);const K=J(P,M),ce=M.source;t.bindTexture(W,P.__webglTexture,i.TEXTURE0+z);const fe=n.get(ce);if(ce.version!==fe.__version||K===!0){if(t.activeTexture(i.TEXTURE0+z),(typeof ImageBitmap<"u"&&M.image instanceof ImageBitmap)===!1){const Q=je.getPrimaries(je.workingColorSpace),pe=M.colorSpace===Si?null:je.getPrimaries(M.colorSpace),xe=M.colorSpace===Si||Q===pe?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,xe)}t.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment);let V=m(M.image,!1,s.maxTextureSize);V=nt(M,V);const j=r.convert(M.format,M.colorSpace),le=r.convert(M.type);let ae=v(M.internalFormat,j,le,M.normalized,M.colorSpace,M.isVideoTexture);Ge(W,M);let se;const be=M.mipmaps,Ie=M.isVideoTexture!==!0,ke=fe.__version===void 0||K===!0,U=ce.dataReady,he=T(M,V);if(M.isDepthTexture)ae=E(M.format===Fi,M.type),ke&&(Ie?t.texStorage2D(i.TEXTURE_2D,1,ae,V.width,V.height):t.texImage2D(i.TEXTURE_2D,0,ae,V.width,V.height,0,j,le,null));else if(M.isDataTexture)if(be.length>0){Ie&&ke&&t.texStorage2D(i.TEXTURE_2D,he,ae,be[0].width,be[0].height);for(let Q=0,pe=be.length;Q<pe;Q++)se=be[Q],Ie?U&&t.texSubImage2D(i.TEXTURE_2D,Q,0,0,se.width,se.height,j,le,se.data):t.texImage2D(i.TEXTURE_2D,Q,ae,se.width,se.height,0,j,le,se.data);M.generateMipmaps=!1}else Ie?(ke&&t.texStorage2D(i.TEXTURE_2D,he,ae,V.width,V.height),U&&oe(M,V,j,le)):t.texImage2D(i.TEXTURE_2D,0,ae,V.width,V.height,0,j,le,V.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){Ie&&ke&&t.texStorage3D(i.TEXTURE_2D_ARRAY,he,ae,be[0].width,be[0].height,V.depth);for(let Q=0,pe=be.length;Q<pe;Q++)if(se=be[Q],M.format!==gn)if(j!==null)if(Ie){if(U)if(M.layerUpdates.size>0){const xe=pu(se.width,se.height,M.format,M.type);for(const te of M.layerUpdates){const we=se.data.subarray(te*xe/se.data.BYTES_PER_ELEMENT,(te+1)*xe/se.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,te,se.width,se.height,1,j,we)}M.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,0,se.width,se.height,V.depth,j,se.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Q,ae,se.width,se.height,V.depth,0,se.data,0,0);else Ce("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ie?U&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,0,se.width,se.height,V.depth,j,le,se.data):t.texImage3D(i.TEXTURE_2D_ARRAY,Q,ae,se.width,se.height,V.depth,0,j,le,se.data)}else{Ie&&ke&&t.texStorage2D(i.TEXTURE_2D,he,ae,be[0].width,be[0].height);for(let Q=0,pe=be.length;Q<pe;Q++)se=be[Q],M.format!==gn?j!==null?Ie?U&&t.compressedTexSubImage2D(i.TEXTURE_2D,Q,0,0,se.width,se.height,j,se.data):t.compressedTexImage2D(i.TEXTURE_2D,Q,ae,se.width,se.height,0,se.data):Ce("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ie?U&&t.texSubImage2D(i.TEXTURE_2D,Q,0,0,se.width,se.height,j,le,se.data):t.texImage2D(i.TEXTURE_2D,Q,ae,se.width,se.height,0,j,le,se.data)}else if(M.isDataArrayTexture)if(Ie){if(ke&&t.texStorage3D(i.TEXTURE_2D_ARRAY,he,ae,V.width,V.height,V.depth),U)if(M.layerUpdates.size>0){const Q=pu(V.width,V.height,M.format,M.type);for(const pe of M.layerUpdates){const xe=V.data.subarray(pe*Q/V.data.BYTES_PER_ELEMENT,(pe+1)*Q/V.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,pe,V.width,V.height,1,j,le,xe)}M.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,V.width,V.height,V.depth,j,le,V.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,ae,V.width,V.height,V.depth,0,j,le,V.data);else if(M.isData3DTexture)Ie?(ke&&t.texStorage3D(i.TEXTURE_3D,he,ae,V.width,V.height,V.depth),U&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,V.width,V.height,V.depth,j,le,V.data)):t.texImage3D(i.TEXTURE_3D,0,ae,V.width,V.height,V.depth,0,j,le,V.data);else if(M.isFramebufferTexture){if(ke)if(Ie)t.texStorage2D(i.TEXTURE_2D,he,ae,V.width,V.height);else{let Q=V.width,pe=V.height;for(let xe=0;xe<he;xe++)t.texImage2D(i.TEXTURE_2D,xe,ae,Q,pe,0,j,le,null),Q>>=1,pe>>=1}}else if(M.isHTMLTexture){if("texElementImage2D"in i){const Q=i.canvas;if(Q.hasAttribute("layoutsubtree")||Q.setAttribute("layoutsubtree","true"),V.parentNode!==Q){Q.appendChild(V),f.add(M),Q.onpaint=pe=>{const xe=pe.changedElements;for(const te of f)xe.includes(te.image)&&(te.needsUpdate=!0)},Q.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,V);else{const xe=i.RGBA,te=i.RGBA,we=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,xe,te,we,V)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(be.length>0){if(Ie&&ke){const Q=Xe(be[0]);t.texStorage2D(i.TEXTURE_2D,he,ae,Q.width,Q.height)}for(let Q=0,pe=be.length;Q<pe;Q++)se=be[Q],Ie?U&&t.texSubImage2D(i.TEXTURE_2D,Q,0,0,j,le,se):t.texImage2D(i.TEXTURE_2D,Q,ae,j,le,se);M.generateMipmaps=!1}else if(Ie){if(ke){const Q=Xe(V);t.texStorage2D(i.TEXTURE_2D,he,ae,Q.width,Q.height)}U&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,j,le,V)}else t.texImage2D(i.TEXTURE_2D,0,ae,j,le,V);p(M)&&S(W),fe.__version=ce.version,M.onUpdate&&M.onUpdate(M)}P.__version=M.version}function ze(P,M,z){if(M.image.length!==6)return;const W=J(P,M),K=M.source;t.bindTexture(i.TEXTURE_CUBE_MAP,P.__webglTexture,i.TEXTURE0+z);const ce=n.get(K);if(K.version!==ce.__version||W===!0){t.activeTexture(i.TEXTURE0+z);const fe=je.getPrimaries(je.workingColorSpace),$=M.colorSpace===Si?null:je.getPrimaries(M.colorSpace),V=M.colorSpace===Si||fe===$?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,V);const j=M.isCompressedTexture||M.image[0].isCompressedTexture,le=M.image[0]&&M.image[0].isDataTexture,ae=[];for(let te=0;te<6;te++)!j&&!le?ae[te]=m(M.image[te],!0,s.maxCubemapSize):ae[te]=le?M.image[te].image:M.image[te],ae[te]=nt(M,ae[te]);const se=ae[0],be=r.convert(M.format,M.colorSpace),Ie=r.convert(M.type),ke=v(M.internalFormat,be,Ie,M.normalized,M.colorSpace),U=M.isVideoTexture!==!0,he=ce.__version===void 0||W===!0,Q=K.dataReady;let pe=T(M,se);Ge(i.TEXTURE_CUBE_MAP,M);let xe;if(j){U&&he&&t.texStorage2D(i.TEXTURE_CUBE_MAP,pe,ke,se.width,se.height);for(let te=0;te<6;te++){xe=ae[te].mipmaps;for(let we=0;we<xe.length;we++){const Te=xe[we];M.format!==gn?be!==null?U?Q&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,we,0,0,Te.width,Te.height,be,Te.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,we,ke,Te.width,Te.height,0,Te.data):Ce("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):U?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,we,0,0,Te.width,Te.height,be,Ie,Te.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,we,ke,Te.width,Te.height,0,be,Ie,Te.data)}}}else{if(xe=M.mipmaps,U&&he){xe.length>0&&pe++;const te=Xe(ae[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,pe,ke,te.width,te.height)}for(let te=0;te<6;te++)if(le){U?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,ae[te].width,ae[te].height,be,Ie,ae[te].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,ke,ae[te].width,ae[te].height,0,be,Ie,ae[te].data);for(let we=0;we<xe.length;we++){const bt=xe[we].image[te].image;U?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,we+1,0,0,bt.width,bt.height,be,Ie,bt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,we+1,ke,bt.width,bt.height,0,be,Ie,bt.data)}}else{U?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,be,Ie,ae[te]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,ke,be,Ie,ae[te]);for(let we=0;we<xe.length;we++){const Te=xe[we];U?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,we+1,0,0,be,Ie,Te.image[te]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,we+1,ke,be,Ie,Te.image[te])}}}p(M)&&S(i.TEXTURE_CUBE_MAP),ce.__version=K.version,M.onUpdate&&M.onUpdate(M)}P.__version=M.version}function De(P,M,z,W,K,ce){const fe=r.convert(z.format,z.colorSpace),$=r.convert(z.type),V=v(z.internalFormat,fe,$,z.normalized,z.colorSpace),j=n.get(M),le=n.get(z);if(le.__renderTarget=M,!j.__hasExternalTextures){const ae=Math.max(1,M.width>>ce),se=Math.max(1,M.height>>ce);K===i.TEXTURE_3D||K===i.TEXTURE_2D_ARRAY?t.texImage3D(K,ce,V,ae,se,M.depth,0,fe,$,null):t.texImage2D(K,ce,V,ae,se,0,fe,$,null)}t.bindFramebuffer(i.FRAMEBUFFER,P),Ne(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,W,K,le.__webglTexture,0,Me(M)):(K===i.TEXTURE_2D||K>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,W,K,le.__webglTexture,ce),t.bindFramebuffer(i.FRAMEBUFFER,null)}function yt(P,M,z){if(i.bindRenderbuffer(i.RENDERBUFFER,P),M.depthBuffer){const W=M.depthTexture,K=W&&W.isDepthTexture?W.type:null,ce=E(M.stencilBuffer,K),fe=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;Ne(M)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Me(M),ce,M.width,M.height):z?i.renderbufferStorageMultisample(i.RENDERBUFFER,Me(M),ce,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,ce,M.width,M.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,fe,i.RENDERBUFFER,P)}else{const W=M.textures;for(let K=0;K<W.length;K++){const ce=W[K],fe=r.convert(ce.format,ce.colorSpace),$=r.convert(ce.type),V=v(ce.internalFormat,fe,$,ce.normalized,ce.colorSpace);Ne(M)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Me(M),V,M.width,M.height):z?i.renderbufferStorageMultisample(i.RENDERBUFFER,Me(M),V,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,V,M.width,M.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function qe(P,M,z){const W=M.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,P),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const K=n.get(M.depthTexture);if(K.__renderTarget=M,(!K.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),W){if(K.__webglInit===void 0&&(K.__webglInit=!0,M.depthTexture.addEventListener("dispose",w)),K.__webglTexture===void 0){K.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,K.__webglTexture),Ge(i.TEXTURE_CUBE_MAP,M.depthTexture);const j=r.convert(M.depthTexture.format),le=r.convert(M.depthTexture.type);let ae;M.depthTexture.format===ai?ae=i.DEPTH_COMPONENT24:M.depthTexture.format===Fi&&(ae=i.DEPTH24_STENCIL8);for(let se=0;se<6;se++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,ae,M.width,M.height,0,j,le,null)}}else H(M.depthTexture,0);const ce=K.__webglTexture,fe=Me(M),$=W?i.TEXTURE_CUBE_MAP_POSITIVE_X+z:i.TEXTURE_2D,V=M.depthTexture.format===Fi?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(M.depthTexture.format===ai)Ne(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,V,$,ce,0,fe):i.framebufferTexture2D(i.FRAMEBUFFER,V,$,ce,0);else if(M.depthTexture.format===Fi)Ne(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,V,$,ce,0,fe):i.framebufferTexture2D(i.FRAMEBUFFER,V,$,ce,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function rt(P){const M=n.get(P),z=P.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==P.depthTexture){const W=P.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),W){const K=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,W.removeEventListener("dispose",K)};W.addEventListener("dispose",K),M.__depthDisposeCallback=K}M.__boundDepthTexture=W}if(P.depthTexture&&!M.__autoAllocateDepthBuffer)if(z)for(let W=0;W<6;W++)qe(M.__webglFramebuffer[W],P,W);else{const W=P.texture.mipmaps;W&&W.length>0?qe(M.__webglFramebuffer[0],P,0):qe(M.__webglFramebuffer,P,0)}else if(z){M.__webglDepthbuffer=[];for(let W=0;W<6;W++)if(t.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer[W]),M.__webglDepthbuffer[W]===void 0)M.__webglDepthbuffer[W]=i.createRenderbuffer(),yt(M.__webglDepthbuffer[W],P,!1);else{const K=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ce=M.__webglDepthbuffer[W];i.bindRenderbuffer(i.RENDERBUFFER,ce),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,ce)}}else{const W=P.texture.mipmaps;if(W&&W.length>0?t.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=i.createRenderbuffer(),yt(M.__webglDepthbuffer,P,!1);else{const K=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ce=M.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ce),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,ce)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function it(P,M,z){const W=n.get(P);M!==void 0&&De(W.__webglFramebuffer,P,P.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),z!==void 0&&rt(P)}function tt(P){const M=P.texture,z=n.get(P),W=n.get(M);P.addEventListener("dispose",_);const K=P.textures,ce=P.isWebGLCubeRenderTarget===!0,fe=K.length>1;if(fe||(W.__webglTexture===void 0&&(W.__webglTexture=i.createTexture()),W.__version=M.version,o.memory.textures++),ce){z.__webglFramebuffer=[];for(let $=0;$<6;$++)if(M.mipmaps&&M.mipmaps.length>0){z.__webglFramebuffer[$]=[];for(let V=0;V<M.mipmaps.length;V++)z.__webglFramebuffer[$][V]=i.createFramebuffer()}else z.__webglFramebuffer[$]=i.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){z.__webglFramebuffer=[];for(let $=0;$<M.mipmaps.length;$++)z.__webglFramebuffer[$]=i.createFramebuffer()}else z.__webglFramebuffer=i.createFramebuffer();if(fe)for(let $=0,V=K.length;$<V;$++){const j=n.get(K[$]);j.__webglTexture===void 0&&(j.__webglTexture=i.createTexture(),o.memory.textures++)}if(P.samples>0&&Ne(P)===!1){z.__webglMultisampledFramebuffer=i.createFramebuffer(),z.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let $=0;$<K.length;$++){const V=K[$];z.__webglColorRenderbuffer[$]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,z.__webglColorRenderbuffer[$]);const j=r.convert(V.format,V.colorSpace),le=r.convert(V.type),ae=v(V.internalFormat,j,le,V.normalized,V.colorSpace,P.isXRRenderTarget===!0),se=Me(P);i.renderbufferStorageMultisample(i.RENDERBUFFER,se,ae,P.width,P.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+$,i.RENDERBUFFER,z.__webglColorRenderbuffer[$])}i.bindRenderbuffer(i.RENDERBUFFER,null),P.depthBuffer&&(z.__webglDepthRenderbuffer=i.createRenderbuffer(),yt(z.__webglDepthRenderbuffer,P,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ce){t.bindTexture(i.TEXTURE_CUBE_MAP,W.__webglTexture),Ge(i.TEXTURE_CUBE_MAP,M);for(let $=0;$<6;$++)if(M.mipmaps&&M.mipmaps.length>0)for(let V=0;V<M.mipmaps.length;V++)De(z.__webglFramebuffer[$][V],P,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+$,V);else De(z.__webglFramebuffer[$],P,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0);p(M)&&S(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(fe){for(let $=0,V=K.length;$<V;$++){const j=K[$],le=n.get(j);let ae=i.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(ae=P.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ae,le.__webglTexture),Ge(ae,j),De(z.__webglFramebuffer,P,j,i.COLOR_ATTACHMENT0+$,ae,0),p(j)&&S(ae)}t.unbindTexture()}else{let $=i.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&($=P.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture($,W.__webglTexture),Ge($,M),M.mipmaps&&M.mipmaps.length>0)for(let V=0;V<M.mipmaps.length;V++)De(z.__webglFramebuffer[V],P,M,i.COLOR_ATTACHMENT0,$,V);else De(z.__webglFramebuffer,P,M,i.COLOR_ATTACHMENT0,$,0);p(M)&&S($),t.unbindTexture()}P.depthBuffer&&rt(P)}function ie(P){const M=P.textures;for(let z=0,W=M.length;z<W;z++){const K=M[z];if(p(K)){const ce=b(P),fe=n.get(K).__webglTexture;t.bindTexture(ce,fe),S(ce),t.unbindTexture()}}}const ue=[],ve=[];function Ee(P){if(P.samples>0){if(Ne(P)===!1){const M=P.textures,z=P.width,W=P.height;let K=i.COLOR_BUFFER_BIT;const ce=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,fe=n.get(P),$=M.length>1;if($)for(let j=0;j<M.length;j++)t.bindFramebuffer(i.FRAMEBUFFER,fe.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+j,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,fe.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+j,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,fe.__webglMultisampledFramebuffer);const V=P.texture.mipmaps;V&&V.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,fe.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,fe.__webglFramebuffer);for(let j=0;j<M.length;j++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(K|=i.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(K|=i.STENCIL_BUFFER_BIT)),$){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,fe.__webglColorRenderbuffer[j]);const le=n.get(M[j]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,le,0)}i.blitFramebuffer(0,0,z,W,0,0,z,W,K,i.NEAREST),c===!0&&(ue.length=0,ve.length=0,ue.push(i.COLOR_ATTACHMENT0+j),P.depthBuffer&&P.resolveDepthBuffer===!1&&(ue.push(ce),ve.push(ce),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,ve)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ue))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),$)for(let j=0;j<M.length;j++){t.bindFramebuffer(i.FRAMEBUFFER,fe.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+j,i.RENDERBUFFER,fe.__webglColorRenderbuffer[j]);const le=n.get(M[j]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,fe.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+j,i.TEXTURE_2D,le,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,fe.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&c){const M=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[M])}}}function Me(P){return Math.min(s.maxSamples,P.samples)}function Ne(P){const M=n.get(P);return P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function N(P){const M=o.render.frame;u.get(P)!==M&&(u.set(P,M),P.update())}function nt(P,M){const z=P.colorSpace,W=P.format,K=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||z!==un&&z!==Si&&(je.getTransfer(z)===ot?(W!==gn||K!==an)&&Ce("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Be("WebGLTextures: Unsupported texture color space:",z)),M}function Xe(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(l.width=P.naturalWidth||P.width,l.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(l.width=P.displayWidth,l.height=P.displayHeight):(l.width=P.width,l.height=P.height),l}this.allocateTextureUnit=G,this.resetTextureUnits=D,this.getTextureUnits=F,this.setTextureUnits=L,this.setTexture2D=H,this.setTexture2DArray=Z,this.setTexture3D=ne,this.setTextureCube=re,this.rebindTextures=it,this.setupRenderTarget=tt,this.updateRenderTargetMipmap=ie,this.updateMultisampleRenderTarget=Ee,this.setupDepthRenderbuffer=rt,this.setupFrameBufferTexture=De,this.useMultisampledRTT=Ne,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function Gv(i,e){function t(n,s=Si){let r;const o=je.getTransfer(s);if(n===an)return i.UNSIGNED_BYTE;if(n===Ec)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Tc)return i.UNSIGNED_SHORT_5_5_5_1;if(n===wf)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Cf)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Af)return i.BYTE;if(n===Rf)return i.SHORT;if(n===er)return i.UNSIGNED_SHORT;if(n===bc)return i.INT;if(n===Hn)return i.UNSIGNED_INT;if(n===mn)return i.FLOAT;if(n===oi)return i.HALF_FLOAT;if(n===Pf)return i.ALPHA;if(n===If)return i.RGB;if(n===gn)return i.RGBA;if(n===ai)return i.DEPTH_COMPONENT;if(n===Fi)return i.DEPTH_STENCIL;if(n===Ac)return i.RED;if(n===Rc)return i.RED_INTEGER;if(n===Wi)return i.RG;if(n===wc)return i.RG_INTEGER;if(n===Cc)return i.RGBA_INTEGER;if(n===Zr||n===Jr||n===Qr||n===jr)if(o===ot)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Zr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Jr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Qr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===jr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Zr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Jr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Qr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===jr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ia||n===La||n===Da||n===Na)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Ia)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===La)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Da)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Na)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ua||n===Fa||n===Oa||n===Ba||n===ka||n===ro||n===za)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ua||n===Fa)return o===ot?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Oa)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Ba)return r.COMPRESSED_R11_EAC;if(n===ka)return r.COMPRESSED_SIGNED_R11_EAC;if(n===ro)return r.COMPRESSED_RG11_EAC;if(n===za)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Ha||n===Va||n===Ga||n===Wa||n===Xa||n===qa||n===Ya||n===Ka||n===$a||n===Za||n===Ja||n===Qa||n===ja||n===ec)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Ha)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Va)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ga)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Wa)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Xa)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===qa)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ya)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ka)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===$a)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Za)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ja)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Qa)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===ja)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ec)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===tc||n===nc||n===ic)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===tc)return o===ot?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===nc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ic)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===sc||n===rc||n===oo||n===oc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===sc)return r.COMPRESSED_RED_RGTC1_EXT;if(n===rc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===oo)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===oc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===tr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const Wv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Xv=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class qv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new Gf(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Vn({vertexShader:Wv,fragmentShader:Xv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Mt(new bo(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Yv extends qi{constructor(e,t){super();const n=this;let s=null,r=1,o=null,a="local-floor",c=1,l=null,u=null,f=null,d=null,h=null,g=null;const x=typeof XRWebGLBinding<"u",m=new qv,p={},S=t.getContextAttributes();let b=null,v=null;const E=[],T=[],w=new Je;let _=null;const y=new jt;y.viewport=new ft;const R=new jt;R.viewport=new ft;const C=[y,R],I=new Km;let D=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let ee=E[J];return ee===void 0&&(ee=new ko,E[J]=ee),ee.getTargetRaySpace()},this.getControllerGrip=function(J){let ee=E[J];return ee===void 0&&(ee=new ko,E[J]=ee),ee.getGripSpace()},this.getHand=function(J){let ee=E[J];return ee===void 0&&(ee=new ko,E[J]=ee),ee.getHandSpace()};function L(J){const ee=T.indexOf(J.inputSource);if(ee===-1)return;const oe=E[ee];oe!==void 0&&(oe.update(J.inputSource,J.frame,l||o),oe.dispatchEvent({type:J.type,data:J.inputSource}))}function G(){s.removeEventListener("select",L),s.removeEventListener("selectstart",L),s.removeEventListener("selectend",L),s.removeEventListener("squeeze",L),s.removeEventListener("squeezestart",L),s.removeEventListener("squeezeend",L),s.removeEventListener("end",G),s.removeEventListener("inputsourceschange",O);for(let J=0;J<E.length;J++){const ee=T[J];ee!==null&&(T[J]=null,E[J].disconnect(ee))}D=null,F=null,m.reset();for(const J in p)delete p[J];e.setRenderTarget(b),h=null,d=null,f=null,s=null,v=null,Ge.stop(),n.isPresenting=!1,e.setPixelRatio(_),e.setSize(w.width,w.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){r=J,n.isPresenting===!0&&Ce("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){a=J,n.isPresenting===!0&&Ce("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(J){l=J},this.getBaseLayer=function(){return d!==null?d:h},this.getBinding=function(){return f===null&&x&&(f=new XRWebGLBinding(s,t)),f},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(J){if(s=J,s!==null){if(b=e.getRenderTarget(),s.addEventListener("select",L),s.addEventListener("selectstart",L),s.addEventListener("selectend",L),s.addEventListener("squeeze",L),s.addEventListener("squeezestart",L),s.addEventListener("squeezeend",L),s.addEventListener("end",G),s.addEventListener("inputsourceschange",O),S.xrCompatible!==!0&&await t.makeXRCompatible(),_=e.getPixelRatio(),e.getSize(w),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let oe=null,Oe=null,ze=null;S.depth&&(ze=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,oe=S.stencil?Fi:ai,Oe=S.stencil?tr:Hn);const De={colorFormat:t.RGBA8,depthFormat:ze,scaleFactor:r};f=this.getBinding(),d=f.createProjectionLayer(De),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),v=new Bn(d.textureWidth,d.textureHeight,{format:gn,type:an,depthTexture:new bs(d.textureWidth,d.textureHeight,Oe,void 0,void 0,void 0,void 0,void 0,void 0,oe),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const oe={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};h=new XRWebGLLayer(s,t,oe),s.updateRenderState({baseLayer:h}),e.setPixelRatio(1),e.setSize(h.framebufferWidth,h.framebufferHeight,!1),v=new Bn(h.framebufferWidth,h.framebufferHeight,{format:gn,type:an,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),Ge.setContext(s),Ge.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function O(J){for(let ee=0;ee<J.removed.length;ee++){const oe=J.removed[ee],Oe=T.indexOf(oe);Oe>=0&&(T[Oe]=null,E[Oe].disconnect(oe))}for(let ee=0;ee<J.added.length;ee++){const oe=J.added[ee];let Oe=T.indexOf(oe);if(Oe===-1){for(let De=0;De<E.length;De++)if(De>=T.length){T.push(oe),Oe=De;break}else if(T[De]===null){T[De]=oe,Oe=De;break}if(Oe===-1)break}const ze=E[Oe];ze&&ze.connect(oe)}}const H=new k,Z=new k;function ne(J,ee,oe){H.setFromMatrixPosition(ee.matrixWorld),Z.setFromMatrixPosition(oe.matrixWorld);const Oe=H.distanceTo(Z),ze=ee.projectionMatrix.elements,De=oe.projectionMatrix.elements,yt=ze[14]/(ze[10]-1),qe=ze[14]/(ze[10]+1),rt=(ze[9]+1)/ze[5],it=(ze[9]-1)/ze[5],tt=(ze[8]-1)/ze[0],ie=(De[8]+1)/De[0],ue=yt*tt,ve=yt*ie,Ee=Oe/(-tt+ie),Me=Ee*-tt;if(ee.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(Me),J.translateZ(Ee),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),ze[10]===-1)J.projectionMatrix.copy(ee.projectionMatrix),J.projectionMatrixInverse.copy(ee.projectionMatrixInverse);else{const Ne=yt+Ee,N=qe+Ee,nt=ue-Me,Xe=ve+(Oe-Me),P=rt*qe/N*Ne,M=it*qe/N*Ne;J.projectionMatrix.makePerspective(nt,Xe,P,M,Ne,N),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function re(J,ee){ee===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(ee.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(s===null)return;let ee=J.near,oe=J.far;m.texture!==null&&(m.depthNear>0&&(ee=m.depthNear),m.depthFar>0&&(oe=m.depthFar)),I.near=R.near=y.near=ee,I.far=R.far=y.far=oe,(D!==I.near||F!==I.far)&&(s.updateRenderState({depthNear:I.near,depthFar:I.far}),D=I.near,F=I.far),I.layers.mask=J.layers.mask|6,y.layers.mask=I.layers.mask&-5,R.layers.mask=I.layers.mask&-3;const Oe=J.parent,ze=I.cameras;re(I,Oe);for(let De=0;De<ze.length;De++)re(ze[De],Oe);ze.length===2?ne(I,y,R):I.projectionMatrix.copy(y.projectionMatrix),de(J,I,Oe)};function de(J,ee,oe){oe===null?J.matrix.copy(ee.matrixWorld):(J.matrix.copy(oe.matrixWorld),J.matrix.invert(),J.matrix.multiply(ee.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(ee.projectionMatrix),J.projectionMatrixInverse.copy(ee.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=Ss*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return I},this.getFoveation=function(){if(!(d===null&&h===null))return c},this.setFoveation=function(J){c=J,d!==null&&(d.fixedFoveation=J),h!==null&&h.fixedFoveation!==void 0&&(h.fixedFoveation=J)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(I)},this.getCameraTexture=function(J){return p[J]};let Ue=null;function Qe(J,ee){if(u=ee.getViewerPose(l||o),g=ee,u!==null){const oe=u.views;h!==null&&(e.setRenderTargetFramebuffer(v,h.framebuffer),e.setRenderTarget(v));let Oe=!1;oe.length!==I.cameras.length&&(I.cameras.length=0,Oe=!0);for(let qe=0;qe<oe.length;qe++){const rt=oe[qe];let it=null;if(h!==null)it=h.getViewport(rt);else{const ie=f.getViewSubImage(d,rt);it=ie.viewport,qe===0&&(e.setRenderTargetTextures(v,ie.colorTexture,ie.depthStencilTexture),e.setRenderTarget(v))}let tt=C[qe];tt===void 0&&(tt=new jt,tt.layers.enable(qe),tt.viewport=new ft,C[qe]=tt),tt.matrix.fromArray(rt.transform.matrix),tt.matrix.decompose(tt.position,tt.quaternion,tt.scale),tt.projectionMatrix.fromArray(rt.projectionMatrix),tt.projectionMatrixInverse.copy(tt.projectionMatrix).invert(),tt.viewport.set(it.x,it.y,it.width,it.height),qe===0&&(I.matrix.copy(tt.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale)),Oe===!0&&I.cameras.push(tt)}const ze=s.enabledFeatures;if(ze&&ze.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){f=n.getBinding();const qe=f.getDepthInformation(oe[0]);qe&&qe.isValid&&qe.texture&&m.init(qe,s.renderState)}if(ze&&ze.includes("camera-access")&&x){e.state.unbindTexture(),f=n.getBinding();for(let qe=0;qe<oe.length;qe++){const rt=oe[qe].camera;if(rt){let it=p[rt];it||(it=new Gf,p[rt]=it);const tt=f.getCameraImage(rt);it.sourceTexture=tt}}}}for(let oe=0;oe<E.length;oe++){const Oe=T[oe],ze=E[oe];Oe!==null&&ze!==void 0&&ze.update(Oe,ee,l||o)}Ue&&Ue(J,ee),ee.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ee}),g=null}const Ge=new $f;Ge.setAnimationLoop(Qe),this.setAnimationLoop=function(J){Ue=J},this.dispose=function(){}}}const Kv=new Ke,nd=new He;nd.set(-1,0,0,0,1,0,0,0,1);function $v(i,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Wf(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,S,b,v){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(m,p):p.isMeshLambertMaterial?(r(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(m,p),f(m,p)):p.isMeshPhongMaterial?(r(m,p),u(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&h(m,p,v)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),x(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?c(m,p,S,b):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===en&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===en&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const S=e.get(p),b=S.envMap,v=S.envMapRotation;b&&(m.envMap.value=b,m.envMapRotation.value.setFromMatrix4(Kv.makeRotationFromEuler(v)).transpose(),b.isCubeTexture&&b.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(nd),m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,S,b){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*S,m.scale.value=b*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function f(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function h(m,p,S){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===en&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function x(m,p){const S=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Zv(i,e,t,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(v,E){const T=E.program;n.uniformBlockBinding(v,T)}function l(v,E){let T=s[v.id];T===void 0&&(m(v),T=u(v),s[v.id]=T,v.addEventListener("dispose",S));const w=E.program;n.updateUBOMapping(v,w);const _=e.render.frame;r[v.id]!==_&&(d(v),r[v.id]=_)}function u(v){const E=f();v.__bindingPointIndex=E;const T=i.createBuffer(),w=v.__size,_=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,T),i.bufferData(i.UNIFORM_BUFFER,w,_),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,E,T),T}function f(){for(let v=0;v<a;v++)if(o.indexOf(v)===-1)return o.push(v),v;return Be("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(v){const E=s[v.id],T=v.uniforms,w=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,E);for(let _=0,y=T.length;_<y;_++){const R=T[_];if(Array.isArray(R))for(let C=0,I=R.length;C<I;C++)h(R[C],_,C,w);else h(R,_,0,w)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function h(v,E,T,w){if(x(v,E,T,w)===!0){const _=v.__offset,y=v.value;if(Array.isArray(y)){let R=0;for(let C=0;C<y.length;C++){const I=y[C],D=p(I);g(I,v.__data,R),typeof I!="number"&&typeof I!="boolean"&&!I.isMatrix3&&!ArrayBuffer.isView(I)&&(R+=D.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(y,v.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,_,v.__data)}}function g(v,E,T){typeof v=="number"||typeof v=="boolean"?E[0]=v:v.isMatrix3?(E[0]=v.elements[0],E[1]=v.elements[1],E[2]=v.elements[2],E[3]=0,E[4]=v.elements[3],E[5]=v.elements[4],E[6]=v.elements[5],E[7]=0,E[8]=v.elements[6],E[9]=v.elements[7],E[10]=v.elements[8],E[11]=0):ArrayBuffer.isView(v)?E.set(new v.constructor(v.buffer,v.byteOffset,E.length)):v.toArray(E,T)}function x(v,E,T,w){const _=v.value,y=E+"_"+T;if(w[y]===void 0)return typeof _=="number"||typeof _=="boolean"?w[y]=_:ArrayBuffer.isView(_)?w[y]=_.slice():w[y]=_.clone(),!0;{const R=w[y];if(typeof _=="number"||typeof _=="boolean"){if(R!==_)return w[y]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(R.equals(_)===!1)return R.copy(_),!0}}return!1}function m(v){const E=v.uniforms;let T=0;const w=16;for(let y=0,R=E.length;y<R;y++){const C=Array.isArray(E[y])?E[y]:[E[y]];for(let I=0,D=C.length;I<D;I++){const F=C[I],L=Array.isArray(F.value)?F.value:[F.value];for(let G=0,O=L.length;G<O;G++){const H=L[G],Z=p(H),ne=T%w,re=ne%Z.boundary,de=ne+re;T+=re,de!==0&&w-de<Z.storage&&(T+=w-de),F.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=T,T+=Z.storage}}}const _=T%w;return _>0&&(T+=w-_),v.__size=T,v.__cache={},this}function p(v){const E={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(E.boundary=4,E.storage=4):v.isVector2?(E.boundary=8,E.storage=8):v.isVector3||v.isColor?(E.boundary=16,E.storage=12):v.isVector4?(E.boundary=16,E.storage=16):v.isMatrix3?(E.boundary=48,E.storage=48):v.isMatrix4?(E.boundary=64,E.storage=64):v.isTexture?Ce("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(E.boundary=16,E.storage=v.byteLength):Ce("WebGLRenderer: Unsupported uniform value type.",v),E}function S(v){const E=v.target;E.removeEventListener("dispose",S);const T=o.indexOf(E.__bindingPointIndex);o.splice(T,1),i.deleteBuffer(s[E.id]),delete s[E.id],delete r[E.id]}function b(){for(const v in s)i.deleteBuffer(s[v]);o=[],s={},r={}}return{bind:c,update:l,dispose:b}}const Jv=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Cn=null;function Qv(){return Cn===null&&(Cn=new Fc(Jv,16,16,Wi,oi),Cn.name="DFG_LUT",Cn.minFilter=Nt,Cn.magFilter=Nt,Cn.wrapS=Un,Cn.wrapT=Un,Cn.generateMipmaps=!1,Cn.needsUpdate=!0),Cn}class jv{constructor(e={}){const{canvas:t=Mp(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:d=!1,outputBufferType:h=an}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=o;const x=h,m=new Set([Cc,wc,Rc]),p=new Set([an,Hn,er,tr,Ec,Tc]),S=new Uint32Array(4),b=new Int32Array(4),v=new k;let E=null,T=null;const w=[],_=[];let y=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=On,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const R=this;let C=!1,I=null,D=null,F=null,L=null;this._outputColorSpace=Pt;let G=0,O=0,H=null,Z=-1,ne=null;const re=new ft,de=new ft;let Ue=null;const Qe=new Fe(0);let Ge=0,J=t.width,ee=t.height,oe=1,Oe=null,ze=null;const De=new ft(0,0,J,ee),yt=new ft(0,0,J,ee);let qe=!1;const rt=new Bc;let it=!1,tt=!1;const ie=new Ke,ue=new k,ve=new ft,Ee={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Me=!1;function Ne(){return H===null?oe:1}let N=n;function nt(A,B){return t.getContext(A,B)}try{const A={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${yc}`),t.addEventListener("webglcontextlost",bt,!1),t.addEventListener("webglcontextrestored",gt,!1),t.addEventListener("webglcontextcreationerror",Tn,!1),N===null){const B="webgl2";if(N=nt(B,A),N===null)throw nt(B)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(A){throw Be("WebGLRenderer: "+A.message),A}let Xe,P,M,z,W,K,ce,fe,$,V,j,le,ae,se,be,Ie,ke,U,he,Q,pe,xe,te;function we(){Xe=new Q_(N),Xe.init(),pe=new Gv(N,Xe),P=new W_(N,Xe,e,pe),M=new Hv(N,Xe),P.reversedDepthBuffer&&d&&M.buffers.depth.setReversed(!0),D=N.createFramebuffer(),F=N.createFramebuffer(),L=N.createFramebuffer(),z=new tx(N),W=new Rv,K=new Vv(N,Xe,M,W,P,pe,z),ce=new J_(R),fe=new r0(N),xe=new V_(N,fe),$=new j_(N,fe,z,xe),V=new ix(N,$,fe,xe,z),U=new nx(N,P,K),be=new X_(W),j=new Av(R,ce,Xe,P,xe,be),le=new $v(R,W),ae=new Cv,se=new Uv(Xe),ke=new H_(R,ce,M,V,g,c),Ie=new zv(R,V,P),te=new Zv(N,z,P,M),he=new G_(N,Xe,z),Q=new ex(N,Xe,z),z.programs=j.programs,R.capabilities=P,R.extensions=Xe,R.properties=W,R.renderLists=ae,R.shadowMap=Ie,R.state=M,R.info=z}we(),x!==an&&(y=new rx(x,t.width,t.height,a,s,r));const Te=new Yv(R,N);this.xr=Te,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const A=Xe.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=Xe.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return oe},this.setPixelRatio=function(A){A!==void 0&&(oe=A,this.setSize(J,ee,!1))},this.getSize=function(A){return A.set(J,ee)},this.setSize=function(A,B,Y=!0){if(Te.isPresenting){Ce("WebGLRenderer: Can't change size while VR device is presenting.");return}J=A,ee=B,t.width=Math.floor(A*oe),t.height=Math.floor(B*oe),Y===!0&&(t.style.width=A+"px",t.style.height=B+"px"),y!==null&&y.setSize(t.width,t.height),this.setViewport(0,0,A,B)},this.getDrawingBufferSize=function(A){return A.set(J*oe,ee*oe).floor()},this.setDrawingBufferSize=function(A,B,Y){J=A,ee=B,oe=Y,t.width=Math.floor(A*Y),t.height=Math.floor(B*Y),this.setViewport(0,0,A,B)},this.setEffects=function(A){if(x===an){Be("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(A){for(let B=0;B<A.length;B++)if(A[B].isOutputPass===!0){Ce("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}y.setEffects(A||[])},this.getCurrentViewport=function(A){return A.copy(re)},this.getViewport=function(A){return A.copy(De)},this.setViewport=function(A,B,Y,X){A.isVector4?De.set(A.x,A.y,A.z,A.w):De.set(A,B,Y,X),M.viewport(re.copy(De).multiplyScalar(oe).round())},this.getScissor=function(A){return A.copy(yt)},this.setScissor=function(A,B,Y,X){A.isVector4?yt.set(A.x,A.y,A.z,A.w):yt.set(A,B,Y,X),M.scissor(de.copy(yt).multiplyScalar(oe).round())},this.getScissorTest=function(){return qe},this.setScissorTest=function(A){M.setScissorTest(qe=A)},this.setOpaqueSort=function(A){Oe=A},this.setTransparentSort=function(A){ze=A},this.getClearColor=function(A){return A.copy(ke.getClearColor())},this.setClearColor=function(){ke.setClearColor(...arguments)},this.getClearAlpha=function(){return ke.getClearAlpha()},this.setClearAlpha=function(){ke.setClearAlpha(...arguments)},this.clear=function(A=!0,B=!0,Y=!0){let X=0;if(A){let q=!1;if(H!==null){const _e=H.texture.format;q=m.has(_e)}if(q){const _e=H.texture.type,Se=p.has(_e),ge=ke.getClearColor(),Re=ke.getClearAlpha(),Pe=ge.r,We=ge.g,$e=ge.b;Se?(S[0]=Pe,S[1]=We,S[2]=$e,S[3]=Re,N.clearBufferuiv(N.COLOR,0,S)):(b[0]=Pe,b[1]=We,b[2]=$e,b[3]=Re,N.clearBufferiv(N.COLOR,0,b))}else X|=N.COLOR_BUFFER_BIT}B&&(X|=N.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Y&&(X|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),X!==0&&N.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(A){A.setRenderer(this),I=A},this.dispose=function(){t.removeEventListener("webglcontextlost",bt,!1),t.removeEventListener("webglcontextrestored",gt,!1),t.removeEventListener("webglcontextcreationerror",Tn,!1),ke.dispose(),ae.dispose(),se.dispose(),W.dispose(),ce.dispose(),V.dispose(),xe.dispose(),te.dispose(),j.dispose(),Te.dispose(),Te.removeEventListener("sessionstart",Zc),Te.removeEventListener("sessionend",Jc),Ai.stop()};function bt(A){A.preventDefault(),co("WebGLRenderer: Context Lost."),C=!0}function gt(){co("WebGLRenderer: Context Restored."),C=!1;const A=z.autoReset,B=Ie.enabled,Y=Ie.autoUpdate,X=Ie.needsUpdate,q=Ie.type;we(),z.autoReset=A,Ie.enabled=B,Ie.autoUpdate=Y,Ie.needsUpdate=X,Ie.type=q}function Tn(A){Be("WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function An(A){const B=A.target;B.removeEventListener("dispose",An),dd(B)}function dd(A){hd(A),W.remove(A)}function hd(A){const B=W.get(A).programs;B!==void 0&&(B.forEach(function(Y){j.releaseProgram(Y)}),A.isShaderMaterial&&j.releaseShaderCache(A))}this.renderBufferDirect=function(A,B,Y,X,q,_e){B===null&&(B=Ee);const Se=q.isMesh&&q.matrixWorld.determinantAffine()<0,ge=gd(A,B,Y,X,q);M.setMaterial(X,Se);let Re=Y.index,Pe=1;if(X.wireframe===!0){if(Re=$.getWireframeAttribute(Y),Re===void 0)return;Pe=2}const We=Y.drawRange,$e=Y.attributes.position;let Le=We.start*Pe,ut=(We.start+We.count)*Pe;_e!==null&&(Le=Math.max(Le,_e.start*Pe),ut=Math.min(ut,(_e.start+_e.count)*Pe)),Re!==null?(Le=Math.max(Le,0),ut=Math.min(ut,Re.count)):$e!=null&&(Le=Math.max(Le,0),ut=Math.min(ut,$e.count));const Tt=ut-Le;if(Tt<0||Tt===1/0)return;xe.setup(q,X,ge,Y,Re);let Et,dt=he;if(Re!==null&&(Et=fe.get(Re),dt=Q,dt.setIndex(Et)),q.isMesh)X.wireframe===!0?(M.setLineWidth(X.wireframeLinewidth*Ne()),dt.setMode(N.LINES)):dt.setMode(N.TRIANGLES);else if(q.isLine){let Vt=X.linewidth;Vt===void 0&&(Vt=1),M.setLineWidth(Vt*Ne()),q.isLineSegments?dt.setMode(N.LINES):q.isLineLoop?dt.setMode(N.LINE_LOOP):dt.setMode(N.LINE_STRIP)}else q.isPoints?dt.setMode(N.POINTS):q.isSprite&&dt.setMode(N.TRIANGLES);if(q.isBatchedMesh)if(Xe.get("WEBGL_multi_draw"))dt.renderMultiDraw(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount);else{const Vt=q._multiDrawStarts,ye=q._multiDrawCounts,nn=q._multiDrawCount,st=Re?fe.get(Re).bytesPerElement:1,fn=W.get(X).currentProgram.getUniforms();for(let Rn=0;Rn<nn;Rn++)fn.setValue(N,"_gl_DrawID",Rn),dt.render(Vt[Rn]/st,ye[Rn])}else if(q.isInstancedMesh)dt.renderInstances(Le,Tt,q.count);else if(Y.isInstancedBufferGeometry){const Vt=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,ye=Math.min(Y.instanceCount,Vt);dt.renderInstances(Le,Tt,ye)}else dt.render(Le,Tt)};function $c(A,B,Y){A.transparent===!0&&A.side===Nn&&A.forceSinglePass===!1?(A.side=en,A.needsUpdate=!0,hr(A,B,Y),A.side=ri,A.needsUpdate=!0,hr(A,B,Y),A.side=Nn):hr(A,B,Y)}this.compile=function(A,B,Y=null){Y===null&&(Y=A),T=se.get(Y),T.init(B),_.push(T),Y.traverseVisible(function(q){q.isLight&&q.layers.test(B.layers)&&(T.pushLight(q),q.castShadow&&T.pushShadow(q))}),A!==Y&&A.traverseVisible(function(q){q.isLight&&q.layers.test(B.layers)&&(T.pushLight(q),q.castShadow&&T.pushShadow(q))}),T.setupLights();const X=new Set;return A.traverse(function(q){if(!(q.isMesh||q.isPoints||q.isLine||q.isSprite))return;const _e=q.material;if(_e)if(Array.isArray(_e))for(let Se=0;Se<_e.length;Se++){const ge=_e[Se];$c(ge,Y,q),X.add(ge)}else $c(_e,Y,q),X.add(_e)}),T=_.pop(),X},this.compileAsync=function(A,B,Y=null){const X=this.compile(A,B,Y);return new Promise(q=>{function _e(){if(X.forEach(function(Se){W.get(Se).currentProgram.isReady()&&X.delete(Se)}),X.size===0){q(A);return}setTimeout(_e,10)}Xe.get("KHR_parallel_shader_compile")!==null?_e():setTimeout(_e,10)})};let Ao=null;function pd(A){Ao&&Ao(A)}function Zc(){Ai.stop()}function Jc(){Ai.start()}const Ai=new $f;Ai.setAnimationLoop(pd),typeof self<"u"&&Ai.setContext(self),this.setAnimationLoop=function(A){Ao=A,Te.setAnimationLoop(A),A===null?Ai.stop():Ai.start()},Te.addEventListener("sessionstart",Zc),Te.addEventListener("sessionend",Jc),this.render=function(A,B){if(B!==void 0&&B.isCamera!==!0){Be("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;I!==null&&I.renderStart(A,B);const Y=Te.enabled===!0&&Te.isPresenting===!0,X=y!==null&&(H===null||Y)&&y.begin(R,H);if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),Te.enabled===!0&&Te.isPresenting===!0&&(y===null||y.isCompositing()===!1)&&(Te.cameraAutoUpdate===!0&&Te.updateCamera(B),B=Te.getCamera()),A.isScene===!0&&A.onBeforeRender(R,A,B,H),T=se.get(A,_.length),T.init(B),T.state.textureUnits=K.getTextureUnits(),_.push(T),ie.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),rt.setFromProjectionMatrix(ie,Fn,B.reversedDepth),tt=this.localClippingEnabled,it=be.init(this.clippingPlanes,tt),E=ae.get(A,w.length),E.init(),w.push(E),Te.enabled===!0&&Te.isPresenting===!0){const Se=R.xr.getDepthSensingMesh();Se!==null&&Ro(Se,B,-1/0,R.sortObjects)}Ro(A,B,0,R.sortObjects),E.finish(),R.sortObjects===!0&&E.sort(Oe,ze,B.reversedDepth),Me=Te.enabled===!1||Te.isPresenting===!1||Te.hasDepthSensing()===!1,Me&&ke.addToRenderList(E,A),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),it===!0&&be.beginShadows();const q=T.state.shadowsArray;if(Ie.render(q,A,B),it===!0&&be.endShadows(),(X&&y.hasRenderPass())===!1){const Se=E.opaque,ge=E.transmissive;if(T.setupLights(),B.isArrayCamera){const Re=B.cameras;if(ge.length>0)for(let Pe=0,We=Re.length;Pe<We;Pe++){const $e=Re[Pe];jc(Se,ge,A,$e)}Me&&ke.render(A);for(let Pe=0,We=Re.length;Pe<We;Pe++){const $e=Re[Pe];Qc(E,A,$e,$e.viewport)}}else ge.length>0&&jc(Se,ge,A,B),Me&&ke.render(A),Qc(E,A,B)}H!==null&&O===0&&(K.updateMultisampleRenderTarget(H),K.updateRenderTargetMipmap(H)),X&&y.end(R),A.isScene===!0&&A.onAfterRender(R,A,B),xe.resetDefaultState(),Z=-1,ne=null,_.pop(),_.length>0?(T=_[_.length-1],K.setTextureUnits(T.state.textureUnits),it===!0&&be.setGlobalState(R.clippingPlanes,T.state.camera)):T=null,w.pop(),w.length>0?E=w[w.length-1]:E=null,I!==null&&I.renderEnd()};function Ro(A,B,Y,X){if(A.visible===!1)return;if(A.layers.test(B.layers)){if(A.isGroup)Y=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(B);else if(A.isLightProbeGrid)T.pushLightProbeGrid(A);else if(A.isLight)T.pushLight(A),A.castShadow&&T.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||rt.intersectsSprite(A)){X&&ve.setFromMatrixPosition(A.matrixWorld).applyMatrix4(ie);const Se=V.update(A),ge=A.material;ge.visible&&E.push(A,Se,ge,Y,ve.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||rt.intersectsObject(A))){const Se=V.update(A),ge=A.material;if(X&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),ve.copy(A.boundingSphere.center)):(Se.boundingSphere===null&&Se.computeBoundingSphere(),ve.copy(Se.boundingSphere.center)),ve.applyMatrix4(A.matrixWorld).applyMatrix4(ie)),Array.isArray(ge)){const Re=Se.groups;for(let Pe=0,We=Re.length;Pe<We;Pe++){const $e=Re[Pe],Le=ge[$e.materialIndex];Le&&Le.visible&&E.push(A,Se,Le,Y,ve.z,$e)}}else ge.visible&&E.push(A,Se,ge,Y,ve.z,null)}}const _e=A.children;for(let Se=0,ge=_e.length;Se<ge;Se++)Ro(_e[Se],B,Y,X)}function Qc(A,B,Y,X){const{opaque:q,transmissive:_e,transparent:Se}=A;T.setupLightsView(Y),it===!0&&be.setGlobalState(R.clippingPlanes,Y),X&&M.viewport(re.copy(X)),q.length>0&&dr(q,B,Y),_e.length>0&&dr(_e,B,Y),Se.length>0&&dr(Se,B,Y),M.buffers.depth.setTest(!0),M.buffers.depth.setMask(!0),M.buffers.color.setMask(!0),M.setPolygonOffset(!1)}function jc(A,B,Y,X){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[X.id]===void 0){const Le=Xe.has("EXT_color_buffer_half_float")||Xe.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[X.id]=new Bn(1,1,{generateMipmaps:!0,type:Le?oi:an,minFilter:jn,samples:Math.max(4,P.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:je.workingColorSpace})}const _e=T.state.transmissionRenderTarget[X.id],Se=X.viewport||re;_e.setSize(Se.z*R.transmissionResolutionScale,Se.w*R.transmissionResolutionScale);const ge=R.getRenderTarget(),Re=R.getActiveCubeFace(),Pe=R.getActiveMipmapLevel();R.setRenderTarget(_e),R.getClearColor(Qe),Ge=R.getClearAlpha(),Ge<1&&R.setClearColor(16777215,.5),R.clear(),Me&&ke.render(Y);const We=R.toneMapping;R.toneMapping=On;const $e=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),T.setupLightsView(X),it===!0&&be.setGlobalState(R.clippingPlanes,X),dr(A,Y,X),K.updateMultisampleRenderTarget(_e),K.updateRenderTargetMipmap(_e),Xe.has("WEBGL_multisampled_render_to_texture")===!1){let Le=!1;for(let ut=0,Tt=B.length;ut<Tt;ut++){const Et=B[ut],{object:dt,geometry:Vt,material:ye,group:nn}=Et;if(ye.side===Nn&&dt.layers.test(X.layers)){const st=ye.side;ye.side=en,ye.needsUpdate=!0,el(dt,Y,X,Vt,ye,nn),ye.side=st,ye.needsUpdate=!0,Le=!0}}Le===!0&&(K.updateMultisampleRenderTarget(_e),K.updateRenderTargetMipmap(_e))}R.setRenderTarget(ge,Re,Pe),R.setClearColor(Qe,Ge),$e!==void 0&&(X.viewport=$e),R.toneMapping=We}function dr(A,B,Y){const X=B.isScene===!0?B.overrideMaterial:null;for(let q=0,_e=A.length;q<_e;q++){const Se=A[q],{object:ge,geometry:Re,group:Pe}=Se;let We=Se.material;We.allowOverride===!0&&X!==null&&(We=X),ge.layers.test(Y.layers)&&el(ge,B,Y,Re,We,Pe)}}function el(A,B,Y,X,q,_e){A.onBeforeRender(R,B,Y,X,q,_e),A.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),q.onBeforeRender(R,B,Y,X,A,_e),q.transparent===!0&&q.side===Nn&&q.forceSinglePass===!1?(q.side=en,q.needsUpdate=!0,R.renderBufferDirect(Y,B,X,q,A,_e),q.side=ri,q.needsUpdate=!0,R.renderBufferDirect(Y,B,X,q,A,_e),q.side=Nn):R.renderBufferDirect(Y,B,X,q,A,_e),A.onAfterRender(R,B,Y,X,q,_e)}function hr(A,B,Y){B.isScene!==!0&&(B=Ee);const X=W.get(A),q=T.state.lights,_e=T.state.shadowsArray,Se=q.state.version,ge=j.getParameters(A,q.state,_e,B,Y,T.state.lightProbeGridArray),Re=j.getProgramCacheKey(ge);let Pe=X.programs;X.environment=A.isMeshStandardMaterial||A.isMeshLambertMaterial||A.isMeshPhongMaterial?B.environment:null,X.fog=B.fog;const We=A.isMeshStandardMaterial||A.isMeshLambertMaterial&&!A.envMap||A.isMeshPhongMaterial&&!A.envMap;X.envMap=ce.get(A.envMap||X.environment,We),X.envMapRotation=X.environment!==null&&A.envMap===null?B.environmentRotation:A.envMapRotation,Pe===void 0&&(A.addEventListener("dispose",An),Pe=new Map,X.programs=Pe);let $e=Pe.get(Re);if($e!==void 0){if(X.currentProgram===$e&&X.lightsStateVersion===Se)return nl(A,ge),$e}else ge.uniforms=j.getUniforms(A),I!==null&&A.isNodeMaterial&&I.build(A,Y,ge),A.onBeforeCompile(ge,R),$e=j.acquireProgram(ge,Re),Pe.set(Re,$e),X.uniforms=ge.uniforms;const Le=X.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Le.clippingPlanes=be.uniform),nl(A,ge),X.needsLights=xd(A),X.lightsStateVersion=Se,X.needsLights&&(Le.ambientLightColor.value=q.state.ambient,Le.lightProbe.value=q.state.probe,Le.directionalLights.value=q.state.directional,Le.directionalLightShadows.value=q.state.directionalShadow,Le.spotLights.value=q.state.spot,Le.spotLightShadows.value=q.state.spotShadow,Le.rectAreaLights.value=q.state.rectArea,Le.ltc_1.value=q.state.rectAreaLTC1,Le.ltc_2.value=q.state.rectAreaLTC2,Le.pointLights.value=q.state.point,Le.pointLightShadows.value=q.state.pointShadow,Le.hemisphereLights.value=q.state.hemi,Le.directionalShadowMatrix.value=q.state.directionalShadowMatrix,Le.spotLightMatrix.value=q.state.spotLightMatrix,Le.spotLightMap.value=q.state.spotLightMap,Le.pointShadowMatrix.value=q.state.pointShadowMatrix),X.lightProbeGrid=T.state.lightProbeGridArray.length>0,X.currentProgram=$e,X.uniformsList=null,$e}function tl(A){if(A.uniformsList===null){const B=A.currentProgram.getUniforms();A.uniformsList=to.seqWithValue(B.seq,A.uniforms)}return A.uniformsList}function nl(A,B){const Y=W.get(A);Y.outputColorSpace=B.outputColorSpace,Y.batching=B.batching,Y.batchingColor=B.batchingColor,Y.instancing=B.instancing,Y.instancingColor=B.instancingColor,Y.instancingMorph=B.instancingMorph,Y.skinning=B.skinning,Y.morphTargets=B.morphTargets,Y.morphNormals=B.morphNormals,Y.morphColors=B.morphColors,Y.morphTargetsCount=B.morphTargetsCount,Y.numClippingPlanes=B.numClippingPlanes,Y.numIntersection=B.numClipIntersection,Y.vertexAlphas=B.vertexAlphas,Y.vertexTangents=B.vertexTangents,Y.toneMapping=B.toneMapping}function md(A,B){if(A.length===0)return null;if(A.length===1)return A[0].texture!==null?A[0]:null;v.setFromMatrixPosition(B.matrixWorld);for(let Y=0,X=A.length;Y<X;Y++){const q=A[Y];if(q.texture!==null&&q.boundingBox.containsPoint(v))return q}return null}function gd(A,B,Y,X,q){B.isScene!==!0&&(B=Ee),K.resetTextureUnits();const _e=B.fog,Se=X.isMeshStandardMaterial||X.isMeshLambertMaterial||X.isMeshPhongMaterial?B.environment:null,ge=H===null?R.outputColorSpace:H.isXRRenderTarget===!0?H.texture.colorSpace:je.workingColorSpace,Re=X.isMeshStandardMaterial||X.isMeshLambertMaterial&&!X.envMap||X.isMeshPhongMaterial&&!X.envMap,Pe=ce.get(X.envMap||Se,Re),We=X.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,$e=!!Y.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Le=!!Y.morphAttributes.position,ut=!!Y.morphAttributes.normal,Tt=!!Y.morphAttributes.color;let Et=On;X.toneMapped&&(H===null||H.isXRRenderTarget===!0)&&(Et=R.toneMapping);const dt=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,Vt=dt!==void 0?dt.length:0,ye=W.get(X),nn=T.state.lights;if(it===!0&&(tt===!0||A!==ne)){const _t=A===ne&&X.id===Z;be.setState(X,A,_t)}let st=!1;X.version===ye.__version?(ye.needsLights&&ye.lightsStateVersion!==nn.state.version||ye.outputColorSpace!==ge||q.isBatchedMesh&&ye.batching===!1||!q.isBatchedMesh&&ye.batching===!0||q.isBatchedMesh&&ye.batchingColor===!0&&q.colorTexture===null||q.isBatchedMesh&&ye.batchingColor===!1&&q.colorTexture!==null||q.isInstancedMesh&&ye.instancing===!1||!q.isInstancedMesh&&ye.instancing===!0||q.isSkinnedMesh&&ye.skinning===!1||!q.isSkinnedMesh&&ye.skinning===!0||q.isInstancedMesh&&ye.instancingColor===!0&&q.instanceColor===null||q.isInstancedMesh&&ye.instancingColor===!1&&q.instanceColor!==null||q.isInstancedMesh&&ye.instancingMorph===!0&&q.morphTexture===null||q.isInstancedMesh&&ye.instancingMorph===!1&&q.morphTexture!==null||ye.envMap!==Pe||X.fog===!0&&ye.fog!==_e||ye.numClippingPlanes!==void 0&&(ye.numClippingPlanes!==be.numPlanes||ye.numIntersection!==be.numIntersection)||ye.vertexAlphas!==We||ye.vertexTangents!==$e||ye.morphTargets!==Le||ye.morphNormals!==ut||ye.morphColors!==Tt||ye.toneMapping!==Et||ye.morphTargetsCount!==Vt||!!ye.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(st=!0):(st=!0,ye.__version=X.version);let fn=ye.currentProgram;st===!0&&(fn=hr(X,B,q),I&&X.isNodeMaterial&&I.onUpdateProgram(X,fn,ye));let Rn=!1,ui=!1,Yi=!1;const ht=fn.getUniforms(),At=ye.uniforms;if(M.useProgram(fn.program)&&(Rn=!0,ui=!0,Yi=!0),X.id!==Z&&(Z=X.id,ui=!0),ye.needsLights){const _t=md(T.state.lightProbeGridArray,q);ye.lightProbeGrid!==_t&&(ye.lightProbeGrid=_t,ui=!0)}if(Rn||ne!==A){M.buffers.depth.getReversed()&&A.reversedDepth!==!0&&(A._reversedDepth=!0,A.updateProjectionMatrix()),ht.setValue(N,"projectionMatrix",A.projectionMatrix),ht.setValue(N,"viewMatrix",A.matrixWorldInverse);const di=ht.map.cameraPosition;di!==void 0&&di.setValue(N,ue.setFromMatrixPosition(A.matrixWorld)),P.logarithmicDepthBuffer&&ht.setValue(N,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&ht.setValue(N,"isOrthographic",A.isOrthographicCamera===!0),ne!==A&&(ne=A,ui=!0,Yi=!0)}if(ye.needsLights&&(nn.state.directionalShadowMap.length>0&&ht.setValue(N,"directionalShadowMap",nn.state.directionalShadowMap,K),nn.state.spotShadowMap.length>0&&ht.setValue(N,"spotShadowMap",nn.state.spotShadowMap,K),nn.state.pointShadowMap.length>0&&ht.setValue(N,"pointShadowMap",nn.state.pointShadowMap,K)),q.isSkinnedMesh){ht.setOptional(N,q,"bindMatrix"),ht.setOptional(N,q,"bindMatrixInverse");const _t=q.skeleton;_t&&(_t.boneTexture===null&&_t.computeBoneTexture(),ht.setValue(N,"boneTexture",_t.boneTexture,K))}q.isBatchedMesh&&(ht.setOptional(N,q,"batchingTexture"),ht.setValue(N,"batchingTexture",q._matricesTexture,K),ht.setOptional(N,q,"batchingIdTexture"),ht.setValue(N,"batchingIdTexture",q._indirectTexture,K),ht.setOptional(N,q,"batchingColorTexture"),q._colorsTexture!==null&&ht.setValue(N,"batchingColorTexture",q._colorsTexture,K));const fi=Y.morphAttributes;if((fi.position!==void 0||fi.normal!==void 0||fi.color!==void 0)&&U.update(q,Y,fn),(ui||ye.receiveShadow!==q.receiveShadow)&&(ye.receiveShadow=q.receiveShadow,ht.setValue(N,"receiveShadow",q.receiveShadow)),(X.isMeshStandardMaterial||X.isMeshLambertMaterial||X.isMeshPhongMaterial)&&X.envMap===null&&B.environment!==null&&(At.envMapIntensity.value=B.environmentIntensity),At.dfgLUT!==void 0&&(At.dfgLUT.value=Qv()),ui){if(ht.setValue(N,"toneMappingExposure",R.toneMappingExposure),ye.needsLights&&_d(At,Yi),_e&&X.fog===!0&&le.refreshFogUniforms(At,_e),le.refreshMaterialUniforms(At,X,oe,ee,T.state.transmissionRenderTarget[A.id]),ye.needsLights&&ye.lightProbeGrid){const _t=ye.lightProbeGrid;At.probesSH.value=_t.texture,At.probesMin.value.copy(_t.boundingBox.min),At.probesMax.value.copy(_t.boundingBox.max),At.probesResolution.value.copy(_t.resolution)}to.upload(N,tl(ye),At,K)}if(X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(to.upload(N,tl(ye),At,K),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&ht.setValue(N,"center",q.center),ht.setValue(N,"modelViewMatrix",q.modelViewMatrix),ht.setValue(N,"normalMatrix",q.normalMatrix),ht.setValue(N,"modelMatrix",q.matrixWorld),X.uniformsGroups!==void 0){const _t=X.uniformsGroups;for(let di=0,Ki=_t.length;di<Ki;di++){const il=_t[di];te.update(il,fn),te.bind(il,fn)}}return fn}function _d(A,B){A.ambientLightColor.needsUpdate=B,A.lightProbe.needsUpdate=B,A.directionalLights.needsUpdate=B,A.directionalLightShadows.needsUpdate=B,A.pointLights.needsUpdate=B,A.pointLightShadows.needsUpdate=B,A.spotLights.needsUpdate=B,A.spotLightShadows.needsUpdate=B,A.rectAreaLights.needsUpdate=B,A.hemisphereLights.needsUpdate=B}function xd(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return G},this.getActiveMipmapLevel=function(){return O},this.getRenderTarget=function(){return H},this.setRenderTargetTextures=function(A,B,Y){const X=W.get(A);X.__autoAllocateDepthBuffer=A.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),W.get(A.texture).__webglTexture=B,W.get(A.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:Y,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(A,B){const Y=W.get(A);Y.__webglFramebuffer=B,Y.__useDefaultFramebuffer=B===void 0},this.setRenderTarget=function(A,B=0,Y=0){H=A,G=B,O=Y;let X=null,q=!1,_e=!1;if(A){const ge=W.get(A);if(ge.__useDefaultFramebuffer!==void 0){M.bindFramebuffer(N.FRAMEBUFFER,ge.__webglFramebuffer),re.copy(A.viewport),de.copy(A.scissor),Ue=A.scissorTest,M.viewport(re),M.scissor(de),M.setScissorTest(Ue),Z=-1;return}else if(ge.__webglFramebuffer===void 0)K.setupRenderTarget(A);else if(ge.__hasExternalTextures)K.rebindTextures(A,W.get(A.texture).__webglTexture,W.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const We=A.depthTexture;if(ge.__boundDepthTexture!==We){if(We!==null&&W.has(We)&&(A.width!==We.image.width||A.height!==We.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");K.setupDepthRenderbuffer(A)}}const Re=A.texture;(Re.isData3DTexture||Re.isDataArrayTexture||Re.isCompressedArrayTexture)&&(_e=!0);const Pe=W.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Pe[B])?X=Pe[B][Y]:X=Pe[B],q=!0):A.samples>0&&K.useMultisampledRTT(A)===!1?X=W.get(A).__webglMultisampledFramebuffer:Array.isArray(Pe)?X=Pe[Y]:X=Pe,re.copy(A.viewport),de.copy(A.scissor),Ue=A.scissorTest}else re.copy(De).multiplyScalar(oe).floor(),de.copy(yt).multiplyScalar(oe).floor(),Ue=qe;if(Y!==0&&(X=D),M.bindFramebuffer(N.FRAMEBUFFER,X)&&M.drawBuffers(A,X),M.viewport(re),M.scissor(de),M.setScissorTest(Ue),q){const ge=W.get(A.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+B,ge.__webglTexture,Y)}else if(_e){const ge=B;for(let Re=0;Re<A.textures.length;Re++){const Pe=W.get(A.textures[Re]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+Re,Pe.__webglTexture,Y,ge)}}else if(A!==null&&Y!==0){const ge=W.get(A.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,ge.__webglTexture,Y)}Z=-1},this.readRenderTargetPixels=function(A,B,Y,X,q,_e,Se,ge=0){if(!(A&&A.isWebGLRenderTarget)){Be("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Re=W.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Se!==void 0&&(Re=Re[Se]),Re){M.bindFramebuffer(N.FRAMEBUFFER,Re);try{const Pe=A.textures[ge],We=Pe.format,$e=Pe.type;if(A.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+ge),!P.textureFormatReadable(We)){Be("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!P.textureTypeReadable($e)){Be("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=A.width-X&&Y>=0&&Y<=A.height-q&&N.readPixels(B,Y,X,q,pe.convert(We),pe.convert($e),_e)}finally{const Pe=H!==null?W.get(H).__webglFramebuffer:null;M.bindFramebuffer(N.FRAMEBUFFER,Pe)}}},this.readRenderTargetPixelsAsync=async function(A,B,Y,X,q,_e,Se,ge=0){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Re=W.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Se!==void 0&&(Re=Re[Se]),Re)if(B>=0&&B<=A.width-X&&Y>=0&&Y<=A.height-q){M.bindFramebuffer(N.FRAMEBUFFER,Re);const Pe=A.textures[ge],We=Pe.format,$e=Pe.type;if(A.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+ge),!P.textureFormatReadable(We))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!P.textureTypeReadable($e))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Le=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,Le),N.bufferData(N.PIXEL_PACK_BUFFER,_e.byteLength,N.STREAM_READ),N.readPixels(B,Y,X,q,pe.convert(We),pe.convert($e),0);const ut=H!==null?W.get(H).__webglFramebuffer:null;M.bindFramebuffer(N.FRAMEBUFFER,ut);const Tt=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await yp(N,Tt,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,Le),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,_e),N.deleteBuffer(Le),N.deleteSync(Tt),_e}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(A,B=null,Y=0){const X=Math.pow(2,-Y),q=Math.floor(A.image.width*X),_e=Math.floor(A.image.height*X),Se=B!==null?B.x:0,ge=B!==null?B.y:0;K.setTexture2D(A,0),N.copyTexSubImage2D(N.TEXTURE_2D,Y,0,0,Se,ge,q,_e),M.unbindTexture()},this.copyTextureToTexture=function(A,B,Y=null,X=null,q=0,_e=0){let Se,ge,Re,Pe,We,$e,Le,ut,Tt;const Et=A.isCompressedTexture?A.mipmaps[_e]:A.image;if(Y!==null)Se=Y.max.x-Y.min.x,ge=Y.max.y-Y.min.y,Re=Y.isBox3?Y.max.z-Y.min.z:1,Pe=Y.min.x,We=Y.min.y,$e=Y.isBox3?Y.min.z:0;else{const At=Math.pow(2,-q);Se=Math.floor(Et.width*At),ge=Math.floor(Et.height*At),A.isDataArrayTexture?Re=Et.depth:A.isData3DTexture?Re=Math.floor(Et.depth*At):Re=1,Pe=0,We=0,$e=0}X!==null?(Le=X.x,ut=X.y,Tt=X.z):(Le=0,ut=0,Tt=0);const dt=pe.convert(B.format),Vt=pe.convert(B.type);let ye;B.isData3DTexture?(K.setTexture3D(B,0),ye=N.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(K.setTexture2DArray(B,0),ye=N.TEXTURE_2D_ARRAY):(K.setTexture2D(B,0),ye=N.TEXTURE_2D),M.activeTexture(N.TEXTURE0),M.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,B.flipY),M.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),M.pixelStorei(N.UNPACK_ALIGNMENT,B.unpackAlignment);const nn=M.getParameter(N.UNPACK_ROW_LENGTH),st=M.getParameter(N.UNPACK_IMAGE_HEIGHT),fn=M.getParameter(N.UNPACK_SKIP_PIXELS),Rn=M.getParameter(N.UNPACK_SKIP_ROWS),ui=M.getParameter(N.UNPACK_SKIP_IMAGES);M.pixelStorei(N.UNPACK_ROW_LENGTH,Et.width),M.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Et.height),M.pixelStorei(N.UNPACK_SKIP_PIXELS,Pe),M.pixelStorei(N.UNPACK_SKIP_ROWS,We),M.pixelStorei(N.UNPACK_SKIP_IMAGES,$e);const Yi=A.isDataArrayTexture||A.isData3DTexture,ht=B.isDataArrayTexture||B.isData3DTexture;if(A.isDepthTexture){const At=W.get(A),fi=W.get(B),_t=W.get(At.__renderTarget),di=W.get(fi.__renderTarget);M.bindFramebuffer(N.READ_FRAMEBUFFER,_t.__webglFramebuffer),M.bindFramebuffer(N.DRAW_FRAMEBUFFER,di.__webglFramebuffer);for(let Ki=0;Ki<Re;Ki++)Yi&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,W.get(A).__webglTexture,q,$e+Ki),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,W.get(B).__webglTexture,_e,Tt+Ki)),N.blitFramebuffer(Pe,We,Se,ge,Le,ut,Se,ge,N.DEPTH_BUFFER_BIT,N.NEAREST);M.bindFramebuffer(N.READ_FRAMEBUFFER,null),M.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(q!==0||A.isRenderTargetTexture||W.has(A)){const At=W.get(A),fi=W.get(B);M.bindFramebuffer(N.READ_FRAMEBUFFER,F),M.bindFramebuffer(N.DRAW_FRAMEBUFFER,L);for(let _t=0;_t<Re;_t++)Yi?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,At.__webglTexture,q,$e+_t):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,At.__webglTexture,q),ht?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,fi.__webglTexture,_e,Tt+_t):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,fi.__webglTexture,_e),q!==0?N.blitFramebuffer(Pe,We,Se,ge,Le,ut,Se,ge,N.COLOR_BUFFER_BIT,N.NEAREST):ht?N.copyTexSubImage3D(ye,_e,Le,ut,Tt+_t,Pe,We,Se,ge):N.copyTexSubImage2D(ye,_e,Le,ut,Pe,We,Se,ge);M.bindFramebuffer(N.READ_FRAMEBUFFER,null),M.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else ht?A.isDataTexture||A.isData3DTexture?N.texSubImage3D(ye,_e,Le,ut,Tt,Se,ge,Re,dt,Vt,Et.data):B.isCompressedArrayTexture?N.compressedTexSubImage3D(ye,_e,Le,ut,Tt,Se,ge,Re,dt,Et.data):N.texSubImage3D(ye,_e,Le,ut,Tt,Se,ge,Re,dt,Vt,Et):A.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,_e,Le,ut,Se,ge,dt,Vt,Et.data):A.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,_e,Le,ut,Et.width,Et.height,dt,Et.data):N.texSubImage2D(N.TEXTURE_2D,_e,Le,ut,Se,ge,dt,Vt,Et);M.pixelStorei(N.UNPACK_ROW_LENGTH,nn),M.pixelStorei(N.UNPACK_IMAGE_HEIGHT,st),M.pixelStorei(N.UNPACK_SKIP_PIXELS,fn),M.pixelStorei(N.UNPACK_SKIP_ROWS,Rn),M.pixelStorei(N.UNPACK_SKIP_IMAGES,ui),_e===0&&B.generateMipmaps&&N.generateMipmap(ye),M.unbindTexture()},this.initRenderTarget=function(A){W.get(A).__webglFramebuffer===void 0&&K.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?K.setTextureCube(A,0):A.isData3DTexture?K.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?K.setTexture2DArray(A,0):K.setTexture2D(A,0),M.unbindTexture()},this.resetState=function(){G=0,O=0,H=null,M.reset(),xe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Fn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=je._getDrawingBufferColorSpace(e),t.unpackColorSpace=je._getUnpackColorSpace()}}const eM=new Set([...zi,"road","station"]);function tM(i,e,t,n=[],s){const r=e>=128?2:1,o=6,a=Math.ceil(e/r),c=Math.ceil(t/r),l=new Uint8Array(a*c);for(let h=0;h<c;h++)for(let g=0;g<a;g++){let x=!1;const m=g*r,p=h*r,S=Math.min(e,m+r),b=Math.min(t,p+r);e:for(let v=p;v<b;v++)for(let E=m;E<S;E++)if(eM.has(i[pt(E,v,e)].kind)){x=!0;break e}x&&(l[h*a+g]=1)}const u=new Uint8Array(a*c),f=[],d=[[1,0],[-1,0],[0,1],[0,-1]];for(let h=0;h<c;h++)for(let g=0;g<a;g++){const x=h*a+g;if(!l[x]||u[x])continue;let m=0,p=0,S=0,b=g,v=g,E=h,T=h;const w=[x];for(u[x]=1;w.length>0;){const G=w.pop(),O=G%a,H=G/a|0;m+=O,p+=H,S+=1,O<b&&(b=O),O>v&&(v=O),H<E&&(E=H),H>T&&(T=H);for(const[Z,ne]of d){const re=O+Z,de=H+ne;if(re<0||de<0||re>=a||de>=c)continue;const Ue=de*a+re;!l[Ue]||u[Ue]||(u[Ue]=1,w.push(Ue))}}if(S<o)continue;const _=m/S,y=p/S,R=(_+.5)*r,C=(y+.5)*r,I=Math.max(v-b,T-E)*r,D=Math.max(6,I*.55+Math.sqrt(S)*r*.35);let F=null,L=1/0;for(const G of n){const O=Math.hypot(G.cx-R,G.cy-C);O<L&&(L=O,F=G.name)}L>D+20&&(F=null),f.push({cx:R,cy:C,radius:D,size:S,label:F})}return f.sort((h,g)=>g.size-h.size),f}function id(i){const e=.95-i.radius*.011-Math.log2(1+i.size)*.02;return Math.max(.48,Math.min(.9,e))}const lt=1,Bu=14,nM=22,iM=8,ku=Math.PI/4,ha=Math.atan(1/Math.sqrt(2)),pa=220;function sM(i){const t=new fr(-18*i/2,18*i/2,9,-9,.1,2e3);return t.position.set(0,0,0),{target:new k(0,0,0),pan:new k(0,0,0),zoom:1,autoZoom:.72,camera:t,clusters:[],focusIndex:-1,focusTimer:0,reclusterTimer:0,targetAutoZoom:.72,focusAnnounce:null}}function rM(i,e,t,n){const r=sd(i)/n,o=new k(1,0,-1).normalize(),a=new k(-1,0,-1).normalize();i.pan.addScaledVector(o,-e*r),i.pan.addScaledVector(a,t*r)}function oM(i,e){i.zoom=Math.max(.45,Math.min(1.8,i.zoom*e))}function sd(i){return 28/(i.zoom*i.autoZoom)}function Gs(i,e){const t=sd(i),n=t*e,s=i.camera;s.left=-n/2,s.right=n/2,s.top=t/2,s.bottom=-t/2,s.updateProjectionMatrix()}function ds(i){const e=new k().copy(i.target).add(i.pan),t=e.x+pa*Math.cos(ha)*Math.sin(ku),n=e.y+pa*Math.sin(ha),s=e.z+pa*Math.cos(ha)*Math.cos(ku);i.camera.position.set(t,n,s),i.camera.lookAt(e),i.camera.updateMatrixWorld()}function aM(){return Bu+Math.random()*(nM-Bu)}function rd(i,e){const t=i.focusIndex>=0?i.clusters[i.focusIndex]:null;if(i.clusters=tM(e.tiles,e.width,e.height,e.settlements),i.reclusterTimer=iM,i.clusters.length===0){i.focusIndex=-1;return}if(t){let n=0,s=1/0;for(let o=0;o<i.clusters.length;o++){const a=i.clusters[o],c=Math.hypot(a.cx-t.cx,a.cy-t.cy);c<s&&(s=c,n=o)}i.focusIndex=n;const r=i.clusters[n];i.targetAutoZoom=id(r)}}function cM(i,e){if(i.length===0)return-1;if(i.length===1)return 0;const t=i.map((r,o)=>{const a=Math.sqrt(r.size);return o===e?a*.15:a}),n=t.reduce((r,o)=>r+o,0);let s=Math.random()*n;for(let r=0;r<t.length;r++)if(s-=t[r],s<=0)return r;return i.length-1}function od(i,e,t){if(e<0||e>=i.clusters.length)return;const n=i.clusters[e];i.focusIndex,i.focusIndex=e,i.focusTimer=aM(),i.targetAutoZoom=id(n),i.pan.set(0,0,0),n.label&&(i.focusAnnounce=n.label)}function zu(i,e,t){if(i.reclusterTimer-=t,i.focusTimer-=t,(i.clusters.length===0||i.reclusterTimer<=0)&&rd(i,e),i.clusters.length===0){const s=e.settlements[0];if(s){const r=1-Math.exp(-.45*t);i.target.x+=(s.cx*lt-i.target.x)*r,i.target.z+=(s.cy*lt-i.target.z)*r}return}if(i.focusIndex<0||i.focusIndex>=i.clusters.length||i.focusTimer<=0){const s=cM(i.clusters,i.focusIndex);od(i,s)}const n=i.clusters[i.focusIndex];if(n){const s=n.cx*lt,r=n.cy*lt,o=1-Math.exp(-.5*t);i.target.x+=(s-i.target.x)*o,i.target.z+=(r-i.target.z)*o,i.autoZoom+=(i.targetAutoZoom-i.autoZoom)*(1-Math.exp(-.35*t))}}function lM(i){const e=i.focusAnnounce;return i.focusAnnounce=null,e}function uM(i,e,t){i.target.set((e-1)/2*lt,0,(t-1)/2*lt),i.pan.set(0,0,0),i.zoom=1,i.autoZoom=.72,i.targetAutoZoom=.72,i.clusters=[],i.focusIndex=-1,i.focusTimer=0,i.reclusterTimer=0,i.focusAnnounce=null}function fM(i,e){if(rd(i,e),i.clusters.length===0){const n=e.settlements[0];n&&(i.target.set(n.cx*lt,0,n.cy*lt),n.name&&(i.focusAnnounce=n.name));return}od(i,0);const t=i.clusters[0];i.target.set(t.cx*lt,0,t.cy*lt),i.autoZoom=i.targetAutoZoom}function dM(i){i.background=new Fe(9353432),i.fog=new Nc(11061472,.0012);const e=new km(15791871,6982232,1.45);i.add(e);const t=new eo(16775402,2);t.position.set(50,80,30),t.castShadow=!1,i.add(t);const n=new eo(13163248,.75);n.position.set(-40,30,-50),i.add(n);const s=new eo(11583743,.4);s.position.set(20,15,-60),i.add(s);const r=new Xm(9478328,.7);i.add(r)}const ho=new Map,po=new Map,mo=new Map;function kt(i,e,t={}){const n=ho.get(i);if(n)return n;const s=new $t({color:e,roughness:.85,metalness:.08,...t});return ho.set(i,s),s}function zt(i,e,t,n,s=e/2){const r=new Mt(new cn(i,e,t),n);return r.position.y=s,r}function ad(i,e,t,n=1){const r=t>0?Math.max(.12,1-t/48):1,o={residential:.55,commercial:.7,industrial:.65,park:.1,school:.75,hospital:.8,station:.5,plaza:.12,tower:1.6,skyscraper:3.2},a=n>=2?1.35:1;return Math.max(.12,(o[i]??.5)*(.55+e*.28)*r*a)}const hM=[12888194,12095600,13678744,11040864,13152400,10123866,14206120,11575432],pM=[8036036,6982320,9482440,5929624,10533072,7375016,8956096,4876416],mM=[9079408,8026720,10129528,6973536,10524800,7893088,9076848,5920848],gM=[9482448,8429760,10535136,7375016,11587816,6848672,10008792,5269624],_M=[11059424,9480392,12112112,7901360,12638448,6848672,10533080,5795984],pc={residential:12888194,commercial:8036036,industrial:9079408,school:15257728,hospital:15263984,station:9474208,plaza:13682864,tower:9482448,skyscraper:11059424};function xM(i,e){const t=e%8;switch(i){case"residential":return hM[t];case"commercial":return pM[t];case"industrial":return mM[t];case"tower":return gM[t];case"skyscraper":return _M[t];default:return pc[i]??pc.residential}}function vM(i,e){return e>=2?i==="skyscraper"?{w:1.65,d:1.65}:i==="tower"?{w:1.45,d:1.4}:{w:1.5,d:1.5}:i==="skyscraper"?{w:.72,d:.72}:i==="tower"?{w:.55,d:.58}:i==="industrial"?{w:.68,d:.62}:i==="commercial"?{w:.64,d:.58}:{w:.62,d:.58}}function MM(i){if(i.construction>0||i.kind==="pad"||i.footprint===0)return!1;switch(i.kind){case"residential":case"commercial":case"industrial":case"school":case"hospital":case"station":case"tower":case"skyscraper":return!0;default:return!1}}function yM(i,e){const t=`${i}:${e}`,n=po.get(t);if(n)return n;const s=64,r=128,o=document.createElement("canvas");o.width=s,o.height=r;const a=o.getContext("2d");a.fillStyle="#ffffff",a.fillRect(0,0,s,r);const c=i==="skyscraper"||i==="tower"?10:6,l=i==="skyscraper"||i==="tower"?5:4,u=6,f=8,d=3,h=4,g=(s-u*2-d*(l-1))/l,x=(r-f*2-h*(c-1))/c;for(let p=0;p<c;p++)for(let S=0;S<l;S++){const b=(e*7+p*3+S*5)%10>4;i==="skyscraper"||i==="tower"?a.fillStyle=b?"rgba(40, 70, 100, 0.55)":"rgba(20, 30, 45, 0.7)":i==="industrial"?a.fillStyle=b?"rgba(50, 50, 40, 0.45)":"rgba(30, 30, 25, 0.55)":a.fillStyle=b?"rgba(255, 220, 140, 0.55)":"rgba(25, 35, 45, 0.65)";const v=u+S*(g+d),E=f+p*(x+h);a.fillRect(v,E,g,x)}a.fillStyle="rgba(0,0,0,0.12)",a.fillRect(0,0,s,5);const m=new gm(o);return m.colorSpace=Pt,m.anisotropy=4,m.wrapS=zn,m.wrapT=zn,po.set(t,m),m}function SM(i,e){const t=e%4,n=`facade-${i}-${t}`,s=mo.get(n);if(s)return s;const r=i==="skyscraper"||i==="tower",o=yM(i,t),a=new $t({color:16777215,map:o,roughness:r?.32:.78,metalness:r?.35:.08});return mo.set(n,a),a}function bM(i,e,t,n,s,r){const o=new Rt;o.userData.constructionSite=!0;const a=zt(i*1.1,.06,t*1.1,kt("foundation",6974064,{roughness:.95}),.03);o.add(a);const c=zt(.22,.08,.18,kt("pallet",9068592),.08);c.position.set(-i*.55,0,t*.4),o.add(c);for(let T=0;T<3;T++){const w=zt(.18,.04,.08,kt("brick",11554880),.14+T*.045);w.position.set(-i*.55,0,t*.4),o.add(w)}const l=kt("scaffold",13148224,{metalness:.45,roughness:.45}),u=Math.max(2,Math.ceil(3*r+1));for(let T=0;T<u;T++){const w=(T+1)/(u+1)*e*Math.max(.4,r),_=zt(i*1.08,.025,t*1.08,l,w);o.add(_);for(const[y,R]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const C=zt(.03,w,.03,l,w/2);C.position.set(y*i*.52,0,R*t*.52),o.add(C)}}const f=e+.7,d=zt(.07,f,.07,kt("crane",12632264,{metalness:.55}),f/2);d.position.x=i*.42,o.add(d);const h=zt(.16,.12,.14,kt("crane-cab",14721088,{metalness:.35}),f-.05);h.position.x=i*.42,o.add(h);const g=i*1.1,x=zt(g,.045,.045,kt("crane-boom",14721088,{metalness:.4}),f+.08);x.position.x=i*.42-g*.25,x.userData.craneBoom=!0,o.add(x);const m=Math.sin(n*1.2+s)*.22,p=.25+r*(e*.7),S=Math.max(.15,f+.08-p),b=zt(.012,S,.012,kt("cable",8947856),f+.08-S/2);b.position.x=m,b.userData.craneCable=!0,o.add(b);const v=zt(.07,.09,.07,kt("hook",14721088),p);v.position.x=m,v.userData.craneHook=!0,o.add(v);const E=new Mt(new lr(.04,6,6),kt("site-lamp",16769152,{emissive:16760896,emissiveIntensity:.9}));return E.position.set(-i*.4,.35,-t*.4),E.userData.siteLamp=!0,o.add(E),o}function EM(i){const e=new Rt,t=zt(.08,.28,.08,kt("trunk",5914672),.14);e.add(t);const n=kt(`canopy-${i%2}`,i%2===0?3836485:4889173,{roughness:.95}),s=new Mt(new lr(.22,6,5),n);return s.position.y=.42,s.scale.set(1,.9,1),e.add(s),e}function TM(i,e,t){const n=new Rt,s=kt(`roof-${t}`,t,{roughness:.75}),r=.48,o=i*.52,a=o/Math.cos(r),c=o*Math.tan(r),l=e*.98,u=zt(a,.035,l,s,0);u.rotation.z=r,u.position.set(-o/2,c/2,0),n.add(u);const f=zt(a,.035,l,s,0);return f.rotation.z=-r,f.position.set(o/2,c/2,0),n.add(f),n}function AM(i,e,t,n){return zt(i*1.02,.05,e*1.02,kt(`flat-roof-${t}`,t,{roughness:.9}),n)}function RM(i,e){const t=i.kind;if(t==="grass"||t==="empty"||t==="water"||t==="forest"||t==="road"||t==="rail"||t==="crossing"||t==="bridge"||t==="pad")return null;const n=new Rt;if(n.userData={kind:t,tier:i.tier,construction:i.construction,variant:i.variant,footprint:i.footprint,animated:!1},t==="park"){for(let f=0;f<3;f++){const d=EM(i.variant+f);d.position.set((f-1)*.28,0,f%2*.15-.05),d.userData.sway=f+i.variant,n.add(d)}return n.userData.animated=!0,n}if(t==="plaza"){n.add(zt(.75,.08,.75,kt("plaza",pc.plaza),.04));const f=new Mt(new Xi(.12,.15,.1,8),kt("fountain",6983856,{metalness:.3,roughness:.4}));return f.position.y=.12,n.add(f),n}const s=Math.max(1,i.footprint||1),r=ad(t,i.tier,i.construction,s),{w:o,d:a}=vM(t,s),c=xM(t,i.variant);if(i.construction<=0){const d=SM(t,i.variant).clone();if(d.color.setHex(c),n.add(zt(o,r,a,d,r/2)),t==="residential"&&i.tier<=2){const h=TM(o,a,10502208);h.position.y=r,n.add(h)}else t!=="tower"&&t!=="skyscraper"&&n.add(AM(o,a,7370880,r+.025));return n}const l=Math.max(.12,1-i.construction/48),u=kt(`body-build-${t}`,c,{transparent:!0,opacity:.35+l*.5,roughness:.9});return n.add(zt(o,r,a,u,r/2)),n.add(bM(o,Math.max(r,.4),a,e,i.variant,l)),n.userData.buildingProgress=l,n.userData.animated=!0,n}function wM(i,e){const t=i.userData.variant??0;i.traverse(n=>{if(n instanceof mt){if(n.userData.sway!=null&&(n.rotation.z=Math.sin(e*1.5+n.userData.sway)*.06),n.userData.craneHook||n.userData.craneCable){const s=Math.sin(e*1.2+t)*.22;n.position.x=s}if(n.userData.siteLamp){const s=Math.sin(e*4+t)>-.2,r=n.material;r.emissiveIntensity=s?1.1:.25}}})}function CM(){for(const i of ho.values())i.dispose();ho.clear();for(const i of mo.values())i.dispose();mo.clear();for(const i of po.values())i.dispose();po.clear()}const cd=[{id:"res_box_t1",kind:"residential",baseHeight:.7,footprint:1,shape:"box"},{id:"res_lwing_t1",kind:"residential",baseHeight:.7,footprint:1,shape:"lwing"},{id:"res_hip_t1",kind:"residential",baseHeight:.75,footprint:1,shape:"hip"},{id:"res_tall_t3",kind:"residential",baseHeight:1.2,footprint:1,shape:"tall"},{id:"com_shop",kind:"commercial",baseHeight:.85,footprint:1,shape:"shop"},{id:"com_awning",kind:"commercial",baseHeight:.9,footprint:1,shape:"awning"},{id:"com_block",kind:"commercial",baseHeight:1.15,footprint:1,shape:"block"},{id:"ind_shed",kind:"industrial",baseHeight:.8,footprint:1,shape:"shed"},{id:"ind_sawtooth",kind:"industrial",baseHeight:.95,footprint:1,shape:"sawtooth"},{id:"ind_chimney",kind:"industrial",baseHeight:1.1,footprint:1,shape:"chimney"},{id:"school_main",kind:"school",baseHeight:.95,footprint:1,shape:"school"},{id:"hospital_cross",kind:"hospital",baseHeight:1,footprint:1,shape:"hospital"},{id:"station_canopy",kind:"station",baseHeight:.65,footprint:1,shape:"station"},{id:"tower_plain",kind:"tower",baseHeight:2,footprint:1,shape:"plain"},{id:"tower_setback",kind:"tower",baseHeight:2.2,footprint:1,shape:"setback"},{id:"tower_podium",kind:"tower",baseHeight:2.3,footprint:1,shape:"podium"},{id:"tower_step",kind:"tower",baseHeight:2.4,footprint:1,shape:"step"},{id:"tower2_plain",kind:"tower",baseHeight:2.7,footprint:2,shape:"plain"},{id:"tower2_setback",kind:"tower",baseHeight:2.9,footprint:2,shape:"setback"},{id:"sky_plain",kind:"skyscraper",baseHeight:4,footprint:1,shape:"plain"},{id:"sky_setback",kind:"skyscraper",baseHeight:4.4,footprint:1,shape:"setback"},{id:"sky_podium",kind:"skyscraper",baseHeight:4.6,footprint:1,shape:"podium"},{id:"sky_step",kind:"skyscraper",baseHeight:4.8,footprint:1,shape:"step"},{id:"sky2_plain",kind:"skyscraper",baseHeight:5.4,footprint:2,shape:"plain"},{id:"sky2_setback",kind:"skyscraper",baseHeight:5.8,footprint:2,shape:"setback"}],mc=new Map;for(const i of cd){const e=mc.get(i.kind)??[];e.push(i),mc.set(i.kind,e)}function Hu(i){if(i.construction>0||i.kind==="pad"||i.footprint===0)return null;const e=i.footprint>=2?2:1,t=(mc.get(i.kind)??[]).filter(n=>n.footprint===e);if(t.length===0)return null;if(i.kind==="residential"){if(i.tier>=3){const s=t.find(r=>r.shape==="tall");if(s)return s.id}const n=t.filter(s=>s.shape!=="tall");return n[i.variant%n.length].id}return i.kind==="tower"||i.kind==="skyscraper",t[i.variant%t.length].id}function PM(i){return cd.find(e=>e.id===i)}function Vu(i,e){if(e===lp)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),i;if(e===ac||e===Lf){let t=i.getIndex();if(t===null){const o=[],a=i.getAttribute("position");if(a!==void 0){for(let c=0;c<a.count;c++)o.push(c);i.setIndex(o),t=i.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),i}const n=t.count-2,s=[];if(e===ac)for(let o=1;o<=n;o++)s.push(t.getX(0)),s.push(t.getX(o)),s.push(t.getX(o+1));else for(let o=0;o<n;o++)o%2===0?(s.push(t.getX(o)),s.push(t.getX(o+1)),s.push(t.getX(o+2))):(s.push(t.getX(o+2)),s.push(t.getX(o+1)),s.push(t.getX(o)));s.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const r=i.clone();return r.setIndex(s),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),i}function IM(i){const e=new Map,t=new Map,n=i.clone();return ld(i,n,function(s,r){e.set(r,s),t.set(s,r)}),n.traverse(function(s){if(!s.isSkinnedMesh)return;const r=s,o=e.get(s),a=o.skeleton.bones;r.skeleton=o.skeleton.clone(),r.bindMatrix.copy(o.bindMatrix),r.skeleton.bones=a.map(function(c){return t.get(c)}),r.bind(r.skeleton,r.bindMatrix)}),n}function ld(i,e,t){t(i,e);for(let n=0;n<i.children.length;n++)ld(i.children[n],e.children[n],t)}class LM extends Cs{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new OM(t)}),this.register(function(t){return new BM(t)}),this.register(function(t){return new YM(t)}),this.register(function(t){return new KM(t)}),this.register(function(t){return new $M(t)}),this.register(function(t){return new zM(t)}),this.register(function(t){return new HM(t)}),this.register(function(t){return new VM(t)}),this.register(function(t){return new GM(t)}),this.register(function(t){return new FM(t)}),this.register(function(t){return new WM(t)}),this.register(function(t){return new kM(t)}),this.register(function(t){return new qM(t)}),this.register(function(t){return new XM(t)}),this.register(function(t){return new NM(t)}),this.register(function(t){return new Gu(t,Ze.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new Gu(t,Ze.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new ZM(t)})}load(e,t,n,s){const r=this;let o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){const l=Qs.extractUrlBase(e);o=Qs.resolveURL(l,this.path)}else o=Qs.extractUrlBase(e);this.manager.itemStart(e);const a=function(l){s?s(l):console.error(l),r.manager.itemError(e),r.manager.itemEnd(e)},c=new qf(this.manager);c.setPath(this.path),c.setResponseType("arraybuffer"),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(e,function(l){try{r.parse(l,o,function(u){t(u),r.manager.itemEnd(e)},a)}catch(u){a(u)}},n,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,s){let r;const o={},a={},c=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(c.decode(new Uint8Array(e,0,4))===ud){try{o[Ze.KHR_BINARY_GLTF]=new JM(e)}catch(f){s&&s(f);return}r=JSON.parse(o[Ze.KHR_BINARY_GLTF].content)}else r=JSON.parse(c.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const l=new uy(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});l.fileLoader.setRequestHeader(this.requestHeader);for(let u=0;u<this.pluginCallbacks.length;u++){const f=this.pluginCallbacks[u](l);f.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[f.name]=f,o[f.name]=!0}if(r.extensionsUsed)for(let u=0;u<r.extensionsUsed.length;++u){const f=r.extensionsUsed[u],d=r.extensionsRequired||[];switch(f){case Ze.KHR_MATERIALS_UNLIT:o[f]=new UM;break;case Ze.KHR_DRACO_MESH_COMPRESSION:o[f]=new QM(r,this.dracoLoader);break;case Ze.KHR_TEXTURE_TRANSFORM:o[f]=new jM;break;case Ze.KHR_MESH_QUANTIZATION:o[f]=new ey;break;default:d.indexOf(f)>=0&&a[f]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+f+'".')}}l.setExtensions(o),l.setPlugins(a),l.parse(n,s)}parseAsync(e,t){const n=this;return new Promise(function(s,r){n.parse(e,t,s,r)})}}function DM(){let i={};return{get:function(e){return i[e]},add:function(e,t){i[e]=t},remove:function(e){delete i[e]},removeAll:function(){i={}}}}function wt(i,e,t){const n=i.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}const Ze={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class NM{constructor(e){this.parser=e,this.name=Ze.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,s=t.length;n<s;n++){const r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let s=t.cache.get(n);if(s)return s;const r=t.json,c=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e];let l;const u=new Fe(16777215);c.color!==void 0&&u.setRGB(c.color[0],c.color[1],c.color[2],un);const f=c.range!==void 0?c.range:0;switch(c.type){case"directional":l=new eo(u),l.target.position.set(0,0,-1),l.add(l.target);break;case"point":l=new Gm(u),l.distance=f;break;case"spot":l=new Hm(u),l.distance=f,c.spot=c.spot||{},c.spot.innerConeAngle=c.spot.innerConeAngle!==void 0?c.spot.innerConeAngle:0,c.spot.outerConeAngle=c.spot.outerConeAngle!==void 0?c.spot.outerConeAngle:Math.PI/4,l.angle=c.spot.outerConeAngle,l.penumbra=1-c.spot.innerConeAngle/c.spot.outerConeAngle,l.target.position.set(0,0,-1),l.add(l.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+c.type)}return l.position.set(0,0,0),Ln(l,c),c.intensity!==void 0&&(l.intensity=c.intensity),l.name=t.createUniqueName(c.name||"light_"+e),s=Promise.resolve(l),t.cache.add(n,s),s}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,r=n.json.nodes[e],a=(r.extensions&&r.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(c){return n._getNodeRef(t.cache,a,c)})}}class UM{constructor(){this.name=Ze.KHR_MATERIALS_UNLIT}getMaterialType(){return Oi}extendParams(e,t,n){const s=[];e.color=new Fe(1,1,1),e.opacity=1;const r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){const o=r.baseColorFactor;e.color.setRGB(o[0],o[1],o[2],un),e.opacity=o[3]}r.baseColorTexture!==void 0&&s.push(n.assignTexture(e,"map",r.baseColorTexture,Pt))}return Promise.all(s)}}class FM{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const n=wt(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}}class OM{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return wt(this.parser,e,this.name)!==null?Wn:null}extendMaterialParams(e,t){const n=wt(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(s.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){const r=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new Je(r,r)}return Promise.all(s)}}class BM{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_DISPERSION}getMaterialType(e){return wt(this.parser,e,this.name)!==null?Wn:null}extendMaterialParams(e,t){const n=wt(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}}class kM{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return wt(this.parser,e,this.name)!==null?Wn:null}extendMaterialParams(e,t){const n=wt(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(s)}}class zM{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_SHEEN}getMaterialType(e){return wt(this.parser,e,this.name)!==null?Wn:null}extendMaterialParams(e,t){const n=wt(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];if(t.sheenColor=new Fe(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){const r=n.sheenColorFactor;t.sheenColor.setRGB(r[0],r[1],r[2],un)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,Pt)),n.sheenRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(s)}}class HM{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return wt(this.parser,e,this.name)!==null?Wn:null}extendMaterialParams(e,t){const n=wt(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&s.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(s)}}class VM{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_VOLUME}getMaterialType(e){return wt(this.parser,e,this.name)!==null?Wn:null}extendMaterialParams(e,t){const n=wt(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;const r=n.attenuationColor||[1,1,1];return t.attenuationColor=new Fe().setRGB(r[0],r[1],r[2],un),Promise.all(s)}}class GM{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_IOR}getMaterialType(e){return wt(this.parser,e,this.name)!==null?Wn:null}extendMaterialParams(e,t){const n=wt(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}}class WM{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_SPECULAR}getMaterialType(e){return wt(this.parser,e,this.name)!==null?Wn:null}extendMaterialParams(e,t){const n=wt(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));const r=n.specularColorFactor||[1,1,1];return t.specularColor=new Fe().setRGB(r[0],r[1],r[2],un),n.specularColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,Pt)),Promise.all(s)}}class XM{constructor(e){this.parser=e,this.name=Ze.EXT_MATERIALS_BUMP}getMaterialType(e){return wt(this.parser,e,this.name)!==null?Wn:null}extendMaterialParams(e,t){const n=wt(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&s.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(s)}}class qM{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return wt(this.parser,e,this.name)!==null?Wn:null}extendMaterialParams(e,t){const n=wt(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&s.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(s)}}class YM{constructor(e){this.parser=e,this.name=Ze.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,s=n.textures[e];if(!s.extensions||!s.extensions[this.name])return null;const r=s.extensions[this.name],o=t.options.ktx2Loader;if(!o){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,o)}}class KM{constructor(e){this.parser=e,this.name=Ze.EXT_TEXTURE_WEBP}loadTexture(e){const t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;const o=r.extensions[t],a=s.images[o.source];let c=n.textureLoader;if(a.uri){const l=n.options.manager.getHandler(a.uri);l!==null&&(c=l)}return n.loadTextureImage(e,o.source,c)}}class $M{constructor(e){this.parser=e,this.name=Ze.EXT_TEXTURE_AVIF}loadTexture(e){const t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;const o=r.extensions[t],a=s.images[o.source];let c=n.textureLoader;if(a.uri){const l=n.options.manager.getHandler(a.uri);l!==null&&(c=l)}return n.loadTextureImage(e,o.source,c)}}class Gu{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const s=n.extensions[this.name],r=this.parser.getDependency("buffer",s.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(a){const c=s.byteOffset||0,l=s.byteLength||0,u=s.count,f=s.byteStride,d=new Uint8Array(a,c,l);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(u,f,d,s.mode,s.filter).then(function(h){return h.buffer}):o.ready.then(function(){const h=new ArrayBuffer(u*f);return o.decodeGltfBuffer(new Uint8Array(h),u,f,d,s.mode,s.filter),h})})}else return null}}class ZM{constructor(e){this.name=Ze.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const s=t.meshes[n.mesh];for(const l of s.primitives)if(l.mode!==pn.TRIANGLES&&l.mode!==pn.TRIANGLE_STRIP&&l.mode!==pn.TRIANGLE_FAN&&l.mode!==void 0)return null;const o=n.extensions[this.name].attributes,a=[],c={};for(const l in o)a.push(this.parser.getDependency("accessor",o[l]).then(u=>(c[l]=u,c[l])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(l=>{const u=l.pop(),f=u.isGroup?u.children:[u],d=l[0].count,h=[];for(const g of f){const x=new Ke,m=new k,p=new ci,S=new k(1,1,1),b=new on(g.geometry,g.material,d);for(let v=0;v<d;v++)c.TRANSLATION&&m.fromBufferAttribute(c.TRANSLATION,v),c.ROTATION&&p.fromBufferAttribute(c.ROTATION,v),c.SCALE&&S.fromBufferAttribute(c.SCALE,v),b.setMatrixAt(v,x.compose(m,p,S));for(const v in c)if(v==="_COLOR_0"){const E=c[v];b.instanceColor=new uc(E.array,E.itemSize,E.normalized)}else v!=="TRANSLATION"&&v!=="ROTATION"&&v!=="SCALE"&&g.geometry.setAttribute(v,c[v]);mt.prototype.copy.call(b,g),this.parser.assignFinalMaterial(b),h.push(b)}return u.isGroup?(u.clear(),u.add(...h),u):h[0]}))}}const ud="glTF",Ws=12,Wu={JSON:1313821514,BIN:5130562};class JM{constructor(e){this.name=Ze.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,Ws),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==ud)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const s=this.header.length-Ws,r=new DataView(e,Ws);let o=0;for(;o<s;){const a=r.getUint32(o,!0);o+=4;const c=r.getUint32(o,!0);if(o+=4,c===Wu.JSON){const l=new Uint8Array(e,Ws+o,a);this.content=n.decode(l)}else if(c===Wu.BIN){const l=Ws+o;this.body=e.slice(l,l+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class QM{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=Ze.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,s=this.dracoLoader,r=e.extensions[this.name].bufferView,o=e.extensions[this.name].attributes,a={},c={},l={};for(const u in o){const f=gc[u]||u.toLowerCase();a[f]=o[u]}for(const u in e.attributes){const f=gc[u]||u.toLowerCase();if(o[u]!==void 0){const d=n.accessors[e.attributes[u]],h=vs[d.componentType];l[f]=h.name,c[f]=d.normalized===!0}}return t.getDependency("bufferView",r).then(function(u){return new Promise(function(f,d){s.decodeDracoFile(u,function(h){for(const g in h.attributes){const x=h.attributes[g],m=c[g];m!==void 0&&(x.normalized=m)}f(h)},a,l,un,d)})})}}class jM{constructor(){this.name=Ze.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class ey{constructor(){this.name=Ze.KHR_MESH_QUANTIZATION}}class fd extends As{constructor(e,t,n,s){super(e,t,n,s)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s*3+s;for(let o=0;o!==s;o++)t[o]=n[r+o];return t}interpolate_(e,t,n,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=a*2,l=a*3,u=s-t,f=(n-t)/u,d=f*f,h=d*f,g=e*l,x=g-l,m=-2*h+3*d,p=h-d,S=1-m,b=p-d+f;for(let v=0;v!==a;v++){const E=o[x+v+a],T=o[x+v+c]*u,w=o[g+v+a],_=o[g+v]*u;r[v]=S*E+b*T+m*w+p*_}return r}}const ty=new ci;class ny extends fd{interpolate_(e,t,n,s){const r=super.interpolate_(e,t,n,s);return ty.fromArray(r).normalize().toArray(r),r}}const pn={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},vs={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Xu={9728:Dt,9729:Nt,9984:Tf,9985:$r,9986:Ks,9987:jn},qu={33071:Un,33648:so,10497:zn},ma={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},gc={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},vi={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},iy={CUBICSPLINE:void 0,LINEAR:ir,STEP:nr},ga={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function sy(i){return i.DefaultMaterial===void 0&&(i.DefaultMaterial=new $t({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:ri})),i.DefaultMaterial}function Ii(i,e,t){for(const n in t.extensions)i[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function Ln(i,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(i.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function ry(i,e,t){let n=!1,s=!1,r=!1;for(let l=0,u=e.length;l<u;l++){const f=e[l];if(f.POSITION!==void 0&&(n=!0),f.NORMAL!==void 0&&(s=!0),f.COLOR_0!==void 0&&(r=!0),n&&s&&r)break}if(!n&&!s&&!r)return Promise.resolve(i);const o=[],a=[],c=[];for(let l=0,u=e.length;l<u;l++){const f=e[l];if(n){const d=f.POSITION!==void 0?t.getDependency("accessor",f.POSITION):i.attributes.position;o.push(d)}if(s){const d=f.NORMAL!==void 0?t.getDependency("accessor",f.NORMAL):i.attributes.normal;a.push(d)}if(r){const d=f.COLOR_0!==void 0?t.getDependency("accessor",f.COLOR_0):i.attributes.color;c.push(d)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c)]).then(function(l){const u=l[0],f=l[1],d=l[2];return n&&(i.morphAttributes.position=u),s&&(i.morphAttributes.normal=f),r&&(i.morphAttributes.color=d),i.morphTargetsRelative=!0,i})}function oy(i,e){if(i.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)i.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(i.morphTargetInfluences.length===t.length){i.morphTargetDictionary={};for(let n=0,s=t.length;n<s;n++)i.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function ay(i){let e;const t=i.extensions&&i.extensions[Ze.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+_a(t.attributes):e=i.indices+":"+_a(i.attributes)+":"+i.mode,i.targets!==void 0)for(let n=0,s=i.targets.length;n<s;n++)e+=":"+_a(i.targets[n]);return e}function _a(i){let e="";const t=Object.keys(i).sort();for(let n=0,s=t.length;n<s;n++)e+=t[n]+":"+i[t[n]]+";";return e}function _c(i){switch(i){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function cy(i){return i.search(/\.jpe?g($|\?)/i)>0||i.search(/^data\:image\/jpeg/)===0?"image/jpeg":i.search(/\.webp($|\?)/i)>0||i.search(/^data\:image\/webp/)===0?"image/webp":i.search(/\.ktx2($|\?)/i)>0||i.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const ly=new Ke;class uy{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new DM,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,s=-1,r=!1,o=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){const a=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(a)===!0;const c=a.match(/Version\/(\d+)/);s=n&&c?parseInt(c[1],10):-1,r=a.indexOf("Firefox")>-1,o=r?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&s<17||r&&o<98?this.textureLoader=new Yf(this.options.manager):this.textureLoader=new qm(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new qf(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,s=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(o){const a={scene:o[0][s.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:s.asset,parser:n,userData:{}};return Ii(r,a,s),Ln(a,s),Promise.all(n._invokeAll(function(c){return c.afterRoot&&c.afterRoot(a)})).then(function(){for(const c of a.scenes)c.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let s=0,r=t.length;s<r;s++){const o=t[s].joints;for(let a=0,c=o.length;a<c;a++)e[o[a]].isBone=!0}for(let s=0,r=e.length;s<r;s++){const o=e[s];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(n[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const s=n.clone(),r=(o,a)=>{const c=this.associations.get(o);c!=null&&this.associations.set(a,c);for(const[l,u]of o.children.entries())r(u,a.children[l])};return r(n,s),s.name+="_instance_"+e.uses[t]++,s}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const s=e(t[n]);if(s)return s}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let s=0;s<t.length;s++){const r=e(t[s]);r&&n.push(r)}return n}getDependency(e,t){const n=e+":"+t;let s=this.cache.get(n);if(!s){switch(e){case"scene":s=this.loadScene(t);break;case"node":s=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":s=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":s=this.loadAccessor(t);break;case"bufferView":s=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":s=this.loadBuffer(t);break;case"material":s=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":s=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":s=this.loadSkin(t);break;case"animation":s=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":s=this.loadCamera(t);break;default:if(s=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!s)throw new Error("Unknown type: "+e);break}this.cache.add(n,s)}return s}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,s=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(s.map(function(r,o){return n.getDependency(e,o)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[Ze.KHR_BINARY_GLTF].body);const s=this.options;return new Promise(function(r,o){n.load(Qs.resolveURL(t.uri,s.path),r,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const s=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+s)})}loadAccessor(e){const t=this,n=this.json,s=this.json.accessors[e];if(s.bufferView===void 0&&s.sparse===void 0){const o=ma[s.type],a=vs[s.componentType],c=s.normalized===!0,l=new a(s.count*o);return Promise.resolve(new Jt(l,o,c))}const r=[];return s.bufferView!==void 0?r.push(this.getDependency("bufferView",s.bufferView)):r.push(null),s.sparse!==void 0&&(r.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(r).then(function(o){const a=o[0],c=ma[s.type],l=vs[s.componentType],u=l.BYTES_PER_ELEMENT,f=u*c,d=s.byteOffset||0,h=s.bufferView!==void 0?n.bufferViews[s.bufferView].byteStride:void 0,g=s.normalized===!0;let x,m;if(h&&h!==f){const p=Math.floor(d/h),S="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+p+":"+s.count;let b=t.cache.get(S);b||(x=new l(a,p*h,s.count*h/u),b=new im(x,h/u),t.cache.add(S,b)),m=new Uc(b,c,d%h/u,g)}else a===null?x=new l(s.count*c):x=new l(a,d,s.count*c),m=new Jt(x,c,g);if(s.sparse!==void 0){const p=ma.SCALAR,S=vs[s.sparse.indices.componentType],b=s.sparse.indices.byteOffset||0,v=s.sparse.values.byteOffset||0,E=new S(o[1],b,s.sparse.count*p),T=new l(o[2],v,s.sparse.count*c);a!==null&&(m=new Jt(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let w=0,_=E.length;w<_;w++){const y=E[w];if(m.setX(y,T[w*c]),c>=2&&m.setY(y,T[w*c+1]),c>=3&&m.setZ(y,T[w*c+2]),c>=4&&m.setW(y,T[w*c+3]),c>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=g}return m})}loadTexture(e){const t=this.json,n=this.options,r=t.textures[e].source,o=t.images[r];let a=this.textureLoader;if(o.uri){const c=n.manager.getHandler(o.uri);c!==null&&(a=c)}return this.loadTextureImage(e,r,a)}loadTextureImage(e,t,n){const s=this,r=this.json,o=r.textures[e],a=r.images[t],c=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[c])return this.textureCache[c];const l=this.loadImageSource(t,n).then(function(u){u.flipY=!1,u.name=o.name||a.name||"",u.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(u.name=a.uri);const d=(r.samplers||{})[o.sampler]||{};return u.magFilter=Xu[d.magFilter]||Nt,u.minFilter=Xu[d.minFilter]||jn,u.wrapS=qu[d.wrapS]||zn,u.wrapT=qu[d.wrapT]||zn,u.generateMipmaps=!u.isCompressedTexture&&u.minFilter!==Dt&&u.minFilter!==Nt,s.associations.set(u,{textures:e}),u}).catch(function(){return null});return this.textureCache[c]=l,l}loadImageSource(e,t){const n=this,s=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(f=>f.clone());const o=s.images[e],a=self.URL||self.webkitURL;let c=o.uri||"",l=!1;if(o.bufferView!==void 0)c=n.getDependency("bufferView",o.bufferView).then(function(f){l=!0;const d=new Blob([f],{type:o.mimeType});return c=a.createObjectURL(d),c});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const u=Promise.resolve(c).then(function(f){return new Promise(function(d,h){let g=d;t.isImageBitmapLoader===!0&&(g=function(x){const m=new Ut(x);m.needsUpdate=!0,d(m)}),t.load(Qs.resolveURL(f,r.path),g,void 0,h)})}).then(function(f){return l===!0&&a.revokeObjectURL(c),Ln(f,o),f.userData.mimeType=o.mimeType||cy(o.uri),f}).catch(function(f){throw console.error("THREE.GLTFLoader: Couldn't load texture",c),f});return this.sourceCache[e]=u,u}assignTexture(e,t,n,s){const r=this;return this.getDependency("texture",n.index).then(function(o){if(!o)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(o=o.clone(),o.channel=n.texCoord),r.extensions[Ze.KHR_TEXTURE_TRANSFORM]){const a=n.extensions!==void 0?n.extensions[Ze.KHR_TEXTURE_TRANSFORM]:void 0;if(a){const c=r.associations.get(o);o=r.extensions[Ze.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),r.associations.set(o,c)}}return s!==void 0&&(o.colorSpace=s),e[t]=o,o})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const s=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(e.isPoints){const a="PointsMaterial:"+n.uuid;let c=this.cache.get(a);c||(c=new Hf,kn.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,c.sizeAttenuation=!1,this.cache.add(a,c)),n=c}else if(e.isLine){const a="LineBasicMaterial:"+n.uuid;let c=this.cache.get(a);c||(c=new zf,kn.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,this.cache.add(a,c)),n=c}if(s||r||o){let a="ClonedMaterial:"+n.uuid+":";s&&(a+="derivative-tangents:"),r&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let c=this.cache.get(a);c||(c=n.clone(),r&&(c.vertexColors=!0),o&&(c.flatShading=!0),s&&(c.normalScale&&(c.normalScale.y*=-1),c.clearcoatNormalScale&&(c.clearcoatNormalScale.y*=-1)),this.cache.add(a,c),this.associations.set(c,this.associations.get(n))),n=c}e.material=n}getMaterialType(){return $t}loadMaterial(e){const t=this,n=this.json,s=this.extensions,r=n.materials[e];let o;const a={},c=r.extensions||{},l=[];if(c[Ze.KHR_MATERIALS_UNLIT]){const f=s[Ze.KHR_MATERIALS_UNLIT];o=f.getMaterialType(),l.push(f.extendParams(a,r,t))}else{const f=r.pbrMetallicRoughness||{};if(a.color=new Fe(1,1,1),a.opacity=1,Array.isArray(f.baseColorFactor)){const d=f.baseColorFactor;a.color.setRGB(d[0],d[1],d[2],un),a.opacity=d[3]}f.baseColorTexture!==void 0&&l.push(t.assignTexture(a,"map",f.baseColorTexture,Pt)),a.metalness=f.metallicFactor!==void 0?f.metallicFactor:1,a.roughness=f.roughnessFactor!==void 0?f.roughnessFactor:1,f.metallicRoughnessTexture!==void 0&&(l.push(t.assignTexture(a,"metalnessMap",f.metallicRoughnessTexture)),l.push(t.assignTexture(a,"roughnessMap",f.metallicRoughnessTexture))),o=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),l.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,a)})))}r.doubleSided===!0&&(a.side=Nn);const u=r.alphaMode||ga.OPAQUE;if(u===ga.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,u===ga.MASK&&(a.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&o!==Oi&&(l.push(t.assignTexture(a,"normalMap",r.normalTexture)),a.normalScale=new Je(1,1),r.normalTexture.scale!==void 0)){const f=r.normalTexture.scale;a.normalScale.set(f,f)}if(r.occlusionTexture!==void 0&&o!==Oi&&(l.push(t.assignTexture(a,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&o!==Oi){const f=r.emissiveFactor;a.emissive=new Fe().setRGB(f[0],f[1],f[2],un)}return r.emissiveTexture!==void 0&&o!==Oi&&l.push(t.assignTexture(a,"emissiveMap",r.emissiveTexture,Pt)),Promise.all(l).then(function(){const f=new o(a);return r.name&&(f.name=r.name),Ln(f,r),t.associations.set(f,{materials:e}),r.extensions&&Ii(s,f,r),f})}createUniqueName(e){const t=ct.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,s=this.primitiveCache;function r(a){return n[Ze.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(c){return Yu(c,a,t)})}const o=[];for(let a=0,c=e.length;a<c;a++){const l=e[a],u=ay(l),f=s[u];if(f)o.push(f.promise);else{let d;l.extensions&&l.extensions[Ze.KHR_DRACO_MESH_COMPRESSION]?d=r(l):d=Yu(new tn,l,t),s[u]={primitive:l,promise:d},o.push(d)}}return Promise.all(o)}loadMesh(e){const t=this,n=this.json,s=this.extensions,r=n.meshes[e],o=r.primitives,a=[];for(let c=0,l=o.length;c<l;c++){const u=o[c].material===void 0?sy(this.cache):this.getDependency("material",o[c].material);a.push(u)}return a.push(t.loadGeometries(o)),Promise.all(a).then(function(c){const l=c.slice(0,c.length-1),u=c[c.length-1],f=[];for(let h=0,g=u.length;h<g;h++){const x=u[h],m=o[h];let p;const S=l[h];if(m.mode===pn.TRIANGLES||m.mode===pn.TRIANGLE_STRIP||m.mode===pn.TRIANGLE_FAN||m.mode===void 0)p=r.isSkinnedMesh===!0?new am(x,S):new Mt(x,S),p.isSkinnedMesh===!0&&p.normalizeSkinWeights(),m.mode===pn.TRIANGLE_STRIP?p.geometry=Vu(p.geometry,Lf):m.mode===pn.TRIANGLE_FAN&&(p.geometry=Vu(p.geometry,ac));else if(m.mode===pn.LINES)p=new hm(x,S);else if(m.mode===pn.LINE_STRIP)p=new kc(x,S);else if(m.mode===pn.LINE_LOOP)p=new pm(x,S);else if(m.mode===pn.POINTS)p=new mm(x,S);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(p.geometry.morphAttributes).length>0&&oy(p,r),p.name=t.createUniqueName(r.name||"mesh_"+e),Ln(p,r),m.extensions&&Ii(s,p,m),t.assignFinalMaterial(p),f.push(p)}for(let h=0,g=f.length;h<g;h++)t.associations.set(f[h],{meshes:e,primitives:h});if(f.length===1)return r.extensions&&Ii(s,f[0],r),f[0];const d=new Rt;r.extensions&&Ii(s,d,r),t.associations.set(d,{meshes:e});for(let h=0,g=f.length;h<g;h++)d.add(f[h]);return d})}loadCamera(e){let t;const n=this.json.cameras[e],s=n[n.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new jt(kp.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):n.type==="orthographic"&&(t=new fr(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Ln(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let s=0,r=t.joints.length;s<r;s++)n.push(this._loadNodeShallow(t.joints[s]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(s){const r=s.pop(),o=s,a=[],c=[];for(let l=0,u=o.length;l<u;l++){const f=o[l];if(f){a.push(f);const d=new Ke;r!==null&&d.fromArray(r.array,l*16),c.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[l])}return new Oc(a,c)})}loadAnimation(e){const t=this.json,n=this,s=t.animations[e],r=s.name?s.name:"animation_"+e,o=[],a=[],c=[],l=[],u=[];for(let f=0,d=s.channels.length;f<d;f++){const h=s.channels[f],g=s.samplers[h.sampler],x=h.target,m=x.node,p=s.parameters!==void 0?s.parameters[g.input]:g.input,S=s.parameters!==void 0?s.parameters[g.output]:g.output;x.node!==void 0&&(o.push(this.getDependency("node",m)),a.push(this.getDependency("accessor",p)),c.push(this.getDependency("accessor",S)),l.push(g),u.push(x))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c),Promise.all(l),Promise.all(u)]).then(function(f){const d=f[0],h=f[1],g=f[2],x=f[3],m=f[4],p=[];for(let b=0,v=d.length;b<v;b++){const E=d[b],T=h[b],w=g[b],_=x[b],y=m[b];if(E===void 0)continue;E.updateMatrix&&E.updateMatrix();const R=n._createAnimationTracks(E,T,w,_,y);if(R)for(let C=0;C<R.length;C++)p.push(R[C])}const S=new Lm(r,void 0,p);return Ln(S,s),S})}createNodeMesh(e){const t=this.json,n=this,s=t.nodes[e];return s.mesh===void 0?null:n.getDependency("mesh",s.mesh).then(function(r){const o=n._getNodeRef(n.meshCache,s.mesh,r);return s.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let c=0,l=s.weights.length;c<l;c++)a.morphTargetInfluences[c]=s.weights[c]}),o})}loadNode(e){const t=this.json,n=this,s=t.nodes[e],r=n._loadNodeShallow(e),o=[],a=s.children||[];for(let l=0,u=a.length;l<u;l++)o.push(n.getDependency("node",a[l]));const c=s.skin===void 0?Promise.resolve(null):n.getDependency("skin",s.skin);return Promise.all([r,Promise.all(o),c]).then(function(l){const u=l[0],f=l[1],d=l[2];d!==null&&u.traverse(function(h){h.isSkinnedMesh&&h.bind(d,ly)});for(let h=0,g=f.length;h<g;h++)u.add(f[h]);if(u.userData.pivot!==void 0&&f.length>0){const h=u.userData.pivot,g=f[0];u.pivot=new k().fromArray(h),u.position.x-=h[0],u.position.y-=h[1],u.position.z-=h[2],g.position.set(0,0,0),delete u.userData.pivot}return u})}_loadNodeShallow(e){const t=this.json,n=this.extensions,s=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const r=t.nodes[e],o=r.name?s.createUniqueName(r.name):"",a=[],c=s._invokeOne(function(l){return l.createNodeMesh&&l.createNodeMesh(e)});return c&&a.push(c),r.camera!==void 0&&a.push(s.getDependency("camera",r.camera).then(function(l){return s._getNodeRef(s.cameraCache,r.camera,l)})),s._invokeAll(function(l){return l.createNodeAttachment&&l.createNodeAttachment(e)}).forEach(function(l){a.push(l)}),this.nodeCache[e]=Promise.all(a).then(function(l){let u;if(r.isBone===!0?u=new kf:l.length>1?u=new Rt:l.length===1?u=l[0]:u=new mt,u!==l[0])for(let f=0,d=l.length;f<d;f++)u.add(l[f]);if(r.name&&(u.userData.name=r.name,u.name=o),Ln(u,r),r.extensions&&Ii(n,u,r),r.matrix!==void 0){const f=new Ke;f.fromArray(r.matrix),u.applyMatrix4(f)}else r.translation!==void 0&&u.position.fromArray(r.translation),r.rotation!==void 0&&u.quaternion.fromArray(r.rotation),r.scale!==void 0&&u.scale.fromArray(r.scale);if(!s.associations.has(u))s.associations.set(u,{});else if(r.mesh!==void 0&&s.meshCache.refs[r.mesh]>1){const f=s.associations.get(u);s.associations.set(u,{...f})}return s.associations.get(u).nodes=e,u}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],s=this,r=new Rt;n.name&&(r.name=s.createUniqueName(n.name)),Ln(r,n),n.extensions&&Ii(t,r,n);const o=n.nodes||[],a=[];for(let c=0,l=o.length;c<l;c++)a.push(s.getDependency("node",o[c]));return Promise.all(a).then(function(c){for(let u=0,f=c.length;u<f;u++){const d=c[u];d.parent!==null?r.add(IM(d)):r.add(d)}const l=u=>{const f=new Map;for(const[d,h]of s.associations)(d instanceof kn||d instanceof Ut)&&f.set(d,h);return u.traverse(d=>{const h=s.associations.get(d);h!=null&&f.set(d,h)}),f};return s.associations=l(r),r})}_createAnimationTracks(e,t,n,s,r){const o=[],a=e.name?e.name:e.uuid,c=[];function l(h){h.morphTargetInfluences&&c.push(h.name?h.name:h.uuid)}vi[r.path]===vi.weights?(l(e),e.isGroup&&e.children.forEach(l)):c.push(a);let u;switch(vi[r.path]){case vi.weights:u=or;break;case vi.rotation:u=ar;break;case vi.translation:case vi.scale:u=fo;break;default:switch(n.itemSize){case 1:u=or;break;case 2:case 3:default:u=fo;break}break}const f=s.interpolation!==void 0?iy[s.interpolation]:ir,d=this._getArrayFromAccessor(n);for(let h=0,g=c.length;h<g;h++){const x=new u(c[h]+"."+vi[r.path],t.array,d,f);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(x),o.push(x)}return o}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=_c(t.constructor),s=new Float32Array(t.length);for(let r=0,o=t.length;r<o;r++)s[r]=t[r]*n;t=s}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const s=this instanceof ar?ny:fd;return new s(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function fy(i,e,t){const n=e.attributes,s=new li;if(n.POSITION!==void 0){const a=t.json.accessors[n.POSITION],c=a.min,l=a.max;if(c!==void 0&&l!==void 0){if(s.set(new k(c[0],c[1],c[2]),new k(l[0],l[1],l[2])),a.normalized){const u=_c(vs[a.componentType]);s.min.multiplyScalar(u),s.max.multiplyScalar(u)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const r=e.targets;if(r!==void 0){const a=new k,c=new k;for(let l=0,u=r.length;l<u;l++){const f=r[l];if(f.POSITION!==void 0){const d=t.json.accessors[f.POSITION],h=d.min,g=d.max;if(h!==void 0&&g!==void 0){if(c.setX(Math.max(Math.abs(h[0]),Math.abs(g[0]))),c.setY(Math.max(Math.abs(h[1]),Math.abs(g[1]))),c.setZ(Math.max(Math.abs(h[2]),Math.abs(g[2]))),d.normalized){const x=_c(vs[d.componentType]);c.multiplyScalar(x)}a.max(c)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(a)}i.boundingBox=s;const o=new Gn;s.getCenter(o.center),o.radius=s.min.distanceTo(s.max)/2,i.boundingSphere=o}function Yu(i,e,t){const n=e.attributes,s=[];function r(o,a){return t.getDependency("accessor",o).then(function(c){i.setAttribute(a,c)})}for(const o in n){const a=gc[o]||o.toLowerCase();a in i.attributes||s.push(r(n[o],a))}if(e.indices!==void 0&&!i.index){const o=t.getDependency("accessor",e.indices).then(function(a){i.setIndex(a)});s.push(o)}return je.workingColorSpace!==un&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${je.workingColorSpace}" not supported.`),Ln(i,e),fy(i,e,t),Promise.all(s).then(function(){return e.targets!==void 0?ry(i,e.targets,t):i})}async function dy(i){const t=`${"/cursor-workspace/city-chill/".endsWith("/")?"/cursor-workspace/city-chill/":"/cursor-workspace/city-chill//"}models/buildings/`,n=`${t}manifest.json`,s=await fetch(n);if(!s.ok)throw new Error(`building manifest not found: ${n}`);const r=await s.json(),o=new LM,a=new Yf,c=new Map;return await Promise.all(r.models.map(async l=>{const[u,f]=await Promise.all([o.loadAsync(`${t}${l.glb}`),a.loadAsync(`${t}${l.texture}`)]);f.colorSpace=Pt,f.wrapS=zn,f.wrapT=zn,f.anisotropy=4;const d=[];if(u.scene.updateMatrixWorld(!0),u.scene.traverse(h=>{if(!(h instanceof Mt))return;const g=h.geometry.clone();h.updateWorldMatrix(!0,!1),g.applyMatrix4(h.matrixWorld);const m=(Array.isArray(h.material)?h.material[0]:h.material).clone();m.map=f,m.color.setHex(16777215),m.needsUpdate=!0,d.push({geometry:g,material:m})}),d.length===0){console.warn(`no meshes in ${l.id}`);return}c.set(l.id,{id:l.id,baseHeight:l.baseHeight,footprint:l.footprint,parts:d})})),{models:c,dispose(){for(const l of c.values())for(const u of l.parts)u.geometry.dispose(),Array.isArray(u.material)?u.material.forEach(f=>f.dispose()):u.material.dispose();c.clear()}}}const Xs=new mt;function hy(i){if(i.kind==="park"||i.kind==="plaza")return!0;if(i.construction<=0)return!1;switch(i.kind){case"residential":case"commercial":case"industrial":case"school":case"hospital":case"station":case"tower":case"skyscraper":return!0;default:return!1}}async function py(i){const e=Math.min(4096,Math.max(512,i)),t=new Rt;t.name="building-batch";const n=await dy(),s=new Map;for(const[b,v]of n.models){const E=v.parts.map((T,w)=>{const _=new on(T.geometry,T.material,e);return _.instanceMatrix.setUsage(In),_.count=0,_.frustumCulled=!1,_.name=`batch-${b}-${w}`,t.add(_),{mesh:_,count:0}});s.set(b,{model:v,parts:E})}const r=new Rt;r.name="building-special",t.add(r);const o=new Map,a=new Set;let c=-1,l=-1,u=0,f=0;function d(){for(const b of s.values())for(const v of b.parts)v.count=0,v.mesh.count=0}function h(b,v,E){const T=Hu(b);if(!T)return;const w=s.get(T);if(!w)return;const _=PM(T),y=Math.max(1,b.footprint||1),R=ad(b.kind,b.tier,0,y),C=(_==null?void 0:_.baseHeight)??w.model.baseHeight,I=C>1e-6?R/C:1,D=y>=2?.5:0,F=y>=2?.5:0;Xs.position.set((v+D)*lt,0,(E+F)*lt),Xs.rotation.set(0,0,0),Xs.scale.set(1,I,1),Xs.updateMatrix();for(const L of w.parts)L.count>=e||(L.mesh.setMatrixAt(L.count,Xs.matrix),L.count+=1)}function g(b){const v=o.get(b);v&&(r.remove(v.mesh),v.mesh.traverse(E=>{E instanceof Mt&&E.geometry.dispose()}),o.delete(b),a.delete(b))}function x(b,v,E,T,w){const _=`${v.kind}:${v.tier}:${Math.ceil(v.construction/4)}:${v.variant}:${v.footprint}`,y=o.get(b);if(y&&y.key===_)return;y&&g(b);const R=RM(v,w);if(!R)return;const C=v.footprint>=2?.5:0,I=v.footprint>=2?.5:0;R.position.set((E+C)*lt,0,(T+I)*lt),r.add(R),o.set(b,{key:_,mesh:R}),R.userData.animated&&a.add(b)}function m(b,v){const{width:E,height:T,tiles:w}=b;d();const _=new Set;for(let y=0;y<T;y++)for(let R=0;R<E;R++){const C=y*E+R,I=w[C];I.kind==="pad"||I.footprint===0||(MM(I)&&Hu(I)?h(I,R,y):hy(I)&&(_.add(C),x(C,I,R,y,v)))}for(const y of[...o.keys()])_.has(y)||g(y);for(const y of s.values())for(const R of y.parts)R.mesh.count=R.count,R.mesh.instanceMatrix.needsUpdate=!0}function p(b,v){const{width:E,height:T}=b,_=E!==u||T!==f||b.mapRevision!==c,y=b.visualRevision!==l;(_||y)&&(m(b,v),c=b.mapRevision,l=b.visualRevision,u=E,f=T);for(const R of a){const C=o.get(R);C&&wM(C.mesh,v)}}function S(){for(const b of s.values())for(const v of b.parts)t.remove(v.mesh),v.mesh.dispose();s.clear();for(const b of o.values())r.remove(b.mesh),b.mesh.traverse(v=>{v instanceof Mt&&v.geometry.dispose()});o.clear(),a.clear(),n.dispose(),CM()}return{group:t,sync:p,dispose:S}}const my=[4028997,4557390,3567680,4886610],gy=[2775602,3301432,2377768,3693626],_y=[2776975,3304090,2381184],Ku=36,$u=28;function xy(i){return i==="water"?"water":i==="forest"?"forest":i==="empty"?"empty":i==="crossing"?"crossing":i==="bridge"?"bridge":i==="road"||i==="station"?"road":i==="rail"?"rail":"grass"}function Wr(i,e){return i<=0?1:Math.max(.12,1-i/e)}function Mi(i,e,t){const n=new cn(lt,.08,lt),s=new $t({color:i,roughness:.92,metalness:.05}),r=new on(n,s,e);return r.instanceMatrix.setUsage(In),r.count=0,r.position.y=t,r.frustumCulled=!1,{mesh:r,count:0,capacity:e}}const Pn=new mt;function vy(i){const e=new Rt;e.name="ground";const t=my.map((ie,ue)=>{const ve=Mi(ie,i,0);return ve.mesh.name=`grass-${ue}`,e.add(ve.mesh),ve}),n=gy.map((ie,ue)=>{const ve=Mi(ie,i,.02);return ve.mesh.name=`forest-${ue}`,e.add(ve.mesh),ve}),s=new Xi(.04,.05,.28,5),r=new $t({color:4863264,roughness:.9}),o=new on(s,r,i*3);o.instanceMatrix.setUsage(In),o.count=0,o.frustumCulled=!1,e.add(o);const a=new zc(.18,.35,6),c=new $t({color:2976568,roughness:.85}),l=new on(a,c,i*3);l.instanceMatrix.setUsage(In),l.count=0,l.frustumCulled=!1,e.add(l);const u=_y.map((ie,ue)=>{const ve=Mi(ie,i,-.04),Ee=ve.mesh.material;return Ee.roughness=.35,Ee.metalness=.15,Ee.emissive=new Fe(1056816),Ee.emissiveIntensity=.15,ve.mesh.name=`water-${ue}`,e.add(ve.mesh),ve}),f=Mi(2763317,i,-.02);f.mesh.name="empty",e.add(f.mesh);const d=Mi(4868693,i,.05);d.mesh.name="road",e.add(d.mesh);const h=Mi(6969928,i,.12);h.mesh.name="bridge",e.add(h.mesh);const g=Mi(9075304,i,.22);g.mesh.name="bridge-rail",e.add(g.mesh);const x=new cn(lt*.08,.02,lt*.5),m=new $t({color:13156464,roughness:.8,emissive:4208640,emissiveIntensity:.35}),p=new on(x,m,i*4);p.instanceMatrix.setUsage(In),p.count=0,p.frustumCulled=!1,p.position.y=.1,e.add(p);const S=Mi(3814704,i,.04);S.mesh.name="rail-bed",e.add(S.mesh);const b=new cn(lt*1.02,.03,.06),v=new $t({color:9079440,metalness:.6,roughness:.4}),E=new on(b,v,i*4),T=new on(b,v.clone(),i*4);for(const ie of[E,T])ie.instanceMatrix.setUsage(In),ie.count=0,ie.frustumCulled=!1,ie.position.y=.09,e.add(ie);const w=new cn(.14,.04,lt*.5),_=new $t({color:5914672,roughness:.95}),y=new on(w,_,i*6);y.instanceMatrix.setUsage(In),y.count=0,y.frustumCulled=!1,y.position.y=.07,e.add(y);const R=new cn(.18,.16,.18),C=new $t({color:13664304,roughness:.85,emissive:4202496,emissiveIntensity:.25}),I=new on(R,C,i*2);I.instanceMatrix.setUsage(In),I.count=0,I.frustumCulled=!1,e.add(I);const D=new cn(lt*.7,.04,.05),F=new $t({color:14700624,emissive:6295568,emissiveIntensity:.4,roughness:.6}),L=new on(D,F,i*2);L.instanceMatrix.setUsage(In),L.count=0,L.frustumCulled=!1,e.add(L);const G=new Xi(.03,.03,.35,6),O=new $t({color:3355448,roughness:.7}),H=new on(G,O,i*2);H.instanceMatrix.setUsage(In),H.count=0,H.frustumCulled=!1,e.add(H);let Z=-1,ne=-1,re=0,de=0,Ue=!1,Qe=!1;function Ge(){for(const ie of t)ie.count=0;for(const ie of n)ie.count=0;for(const ie of u)ie.count=0;f.count=0,d.count=0,h.count=0,g.count=0,S.count=0,p.count=0,E.count=0,T.count=0,y.count=0,I.count=0,L.count=0,H.count=0,o.count=0,l.count=0}function J(ie,ue,ve,Ee=0,Me=1,Ne=1){ie.count>=ie.capacity||(Pn.position.set(ue*lt,0,ve*lt),Pn.rotation.set(0,Ee,0),Pn.scale.set(Me,1,Ne),Pn.updateMatrix(),ie.mesh.setMatrixAt(ie.count++,Pn.matrix))}function ee(ie,ue,ve,Ee,Me,Ne=0,N=0,nt=0,Xe=0,P=1,M=1,z=1){ue.count>=ve||(Pn.position.set(Ee*lt+N,nt,Me*lt+Xe),Pn.rotation.set(0,Ne,0),Pn.scale.set(P,M,z),Pn.updateMatrix(),ie.setMatrixAt(ue.count++,Pn.matrix))}function oe(ie){Ue=!1;for(let ue=0;ue<ie.length;ue++)if(ie[ue].kind==="crossing"){Ue=!0;break}}function Oe(ie,ue,ve,Ee,Me){const Ne=.55*Me,N=(nt,Xe,P)=>{ee(p,Ee,i*4,ie,ue,nt,Xe,0,P,1,1,Ne)};ve.n&&N(0,0,-.22*Me),ve.s&&N(0,0,.22*Me),ve.e&&N(Math.PI/2,.22*Me,0),ve.w&&N(Math.PI/2,-.22*Me,0)}function ze(ie,ue,ve,Ee,Me=1){const Ne=rl(ve);if(Ne==="L"||Ne==="T"||Ne==="cross"){Oe(ie,ue,ve,Ee,Me);return}if(Ne==="none"){ee(p,Ee,i*4,ie,ue,0,0,0,0,1,1,Me);return}const nt=wo(ve)==="x"?Math.PI/2:0;ee(p,Ee,i*4,ie,ue,nt,0,0,0,1,1,Me)}function De(ie,ue,ve,Ee,Me,Ne,N,nt,Xe){ve===0?(ee(E,N,i*4,ie,ue,0,Ee,0,Me-.12,Ne,1,1),ee(T,nt,i*4,ie,ue,0,Ee,0,Me+.12,Ne,1,1),Ne>.2&&ee(y,Xe,i*6,ie,ue,0,Ee,0,Me)):(ee(E,N,i*4,ie,ue,Math.PI/2,Ee-.12,0,Me,Ne,1,1),ee(T,nt,i*4,ie,ue,Math.PI/2,Ee+.12,0,Me,Ne,1,1),Ne>.2&&ee(y,Xe,i*6,ie,ue,Math.PI/2,Ee,0,Me))}function yt(ie,ue,ve,Ee,Me,Ne,N=1){const nt=rl(ve);if(nt==="L"||nt==="T"||nt==="cross"){const P=.5*N,M=.25*N;ve.e&&De(ie,ue,0,M,0,P,Ee,Me,Ne),ve.w&&De(ie,ue,0,-M,0,P,Ee,Me,Ne),ve.s&&De(ie,ue,Math.PI/2,0,M,P,Ee,Me,Ne),ve.n&&De(ie,ue,Math.PI/2,0,-M,P,Ee,Me,Ne);return}if(wo(ve)==="z"){if(ee(E,Ee,i*4,ie,ue,Math.PI/2,-.12,0,0,N,1,1),ee(T,Me,i*4,ie,ue,Math.PI/2,.12,0,0,N,1,1),N>.3)for(let P=-1;P<=1;P++)ee(y,Ne,i*6,ie,ue,Math.PI/2,0,0,P*.28*N)}else if(ee(E,Ee,i*4,ie,ue,0,0,0,-.12,N,1,1),ee(T,Me,i*4,ie,ue,0,0,0,.12,N,1,1),N>.3)for(let P=-1;P<=1;P++)ee(y,Ne,i*6,ie,ue,0,P*.28*N,0,0)}function qe(ie,ue,ve,Ee,Me){if(ve>=.95)return;const Ne=.02*Math.sin(Me*3+ie+ue);ee(I,Ee,i*2,ie,ue,0,-.2,.12+Ne,-.15,1,1,1),ee(I,Ee,i*2,ie,ue,.4,.18,.1+Ne,.2,.8,.8,.8)}function rt(ie,ue,ve,Ee,Me,Ne){const N=wo(ve),nt=.15+.85*(.5+.5*Math.sin(Ee*.7+ie*.3+ue*.2));N==="z"||N==="none"?(ee(H,Ne,i*2,ie,ue,0,-.35,.18,0),ee(H,Ne,i*2,ie,ue,0,.35,.18,0),ee(L,Me,i*2,ie,ue,0,-.1,.28,0,nt,1,1),ee(L,Me,i*2,ie,ue,0,.1,.28,0,nt,1,1)):(ee(H,Ne,i*2,ie,ue,0,0,.18,-.35),ee(H,Ne,i*2,ie,ue,0,0,.18,.35),ee(L,Me,i*2,ie,ue,Math.PI/2,0,.28,-.1,nt,1,1),ee(L,Me,i*2,ie,ue,Math.PI/2,0,.28,.1,nt,1,1))}function it(ie,ue){const{width:ve,height:Ee,tiles:Me}=ie,N=ve!==re||Ee!==de||ie.mapRevision!==Z,nt=ie.visualRevision!==ne;if(!N&&!nt){if(Ue&&!Qe){const V={count:0},j={count:0};for(let le=0;le<Ee;le++)for(let ae=0;ae<ve;ae++){if(Me[le*ve+ae].kind!=="crossing")continue;const se=$i(Me,ae,le,ve,Ee,ps);rt(ae,le,se,ue,V,j)}L.count=V.count,L.instanceMatrix.needsUpdate=!0,H.count=j.count,H.instanceMatrix.needsUpdate=!0}for(const V of u){const j=V.mesh.material;j.emissiveIntensity=.12+.08*Math.sin(ue*1.5)}return}N&&oe(Me),Qe=ie.constructionIndices.length>0,Z=ie.mapRevision,ne=ie.visualRevision,re=ve,de=Ee,Ge();const Xe={count:0},P={count:0},M={count:0},z={count:0},W={count:0},K={count:0},ce={count:0},fe={count:0},$={count:0};for(let V=0;V<Ee;V++)for(let j=0;j<ve;j++){const le=Me[V*ve+j],ae=xy(le.kind);if(ae==="water"){J(u[le.variant%u.length],j,V);continue}if(ae==="empty"){J(f,j,V);continue}if(ae==="forest"){J(n[le.variant%n.length],j,V);const se=2+le.variant%2;for(let be=0;be<se;be++){const Ie=(be*.37+le.variant*.11)%.7-.35,ke=(be*.53+le.variant*.07)%.7-.35;ee(o,fe,i*3,j,V,0,Ie,.14,ke),ee(l,$,i*3,j,V,0,Ie,.38,ke)}continue}if(ae==="bridge"){J(u[0],j,V);const se=Wr(le.construction,$u);J(h,j,V,0,se,se);const be=$i(Me,j,V,ve,Ee,ps);ze(j,V,be,Xe,se),J(g,j,V,0,.95,.12),J(g,j,V,0,.12,.95);const Ie=$i(Me,j,V,ve,Ee,ol);if(ef(Ie)>0){const ke=Wr(le.construction,Ku);yt(j,V,Ie,P,M,z,ke)}le.construction>0&&qe(j,V,se,W,ue);continue}if(J(t[le.variant%t.length],j,V),ae==="road"||ae==="crossing"||le.kind==="station"){const se=Wr(le.construction,$u);J(d,j,V,0,Math.max(.4,se),Math.max(.4,se));const be=$i(Me,j,V,ve,Ee,ps);ze(j,V,be,Xe,se),le.construction>0&&le.kind==="road"&&qe(j,V,se,W,ue)}if(ae==="rail"||ae==="crossing"||le.kind==="station"){const se=Wr(le.construction,Ku);le.kind==="rail"&&J(S,j,V,0,Math.max(.35,se),Math.max(.35,se));const be=$i(Me,j,V,ve,Ee,ol);yt(j,V,be,P,M,z,se),le.construction>0&&(le.kind==="rail"||le.kind==="crossing")&&qe(j,V,se,W,ue)}if(ae==="crossing"){const se=$i(Me,j,V,ve,Ee,ps);rt(j,V,se,ue,K,ce)}}for(const V of t)V.mesh.count=V.count,V.mesh.instanceMatrix.needsUpdate=!0;for(const V of n)V.mesh.count=V.count,V.mesh.instanceMatrix.needsUpdate=!0;for(const V of u)V.mesh.count=V.count,V.mesh.instanceMatrix.needsUpdate=!0;f.mesh.count=f.count,f.mesh.instanceMatrix.needsUpdate=!0,d.mesh.count=d.count,d.mesh.instanceMatrix.needsUpdate=!0,h.mesh.count=h.count,h.mesh.instanceMatrix.needsUpdate=!0,g.mesh.count=g.count,g.mesh.instanceMatrix.needsUpdate=!0,S.mesh.count=S.count,S.mesh.instanceMatrix.needsUpdate=!0,o.count=fe.count,o.instanceMatrix.needsUpdate=!0,l.count=$.count,l.instanceMatrix.needsUpdate=!0,p.count=Xe.count,p.instanceMatrix.needsUpdate=!0,E.count=P.count,E.instanceMatrix.needsUpdate=!0,T.count=M.count,T.instanceMatrix.needsUpdate=!0,y.count=z.count,y.instanceMatrix.needsUpdate=!0,I.count=W.count,I.instanceMatrix.needsUpdate=!0,L.count=K.count,L.instanceMatrix.needsUpdate=!0,H.count=ce.count,H.instanceMatrix.needsUpdate=!0}function tt(){e.traverse(ie=>{ie instanceof on&&(ie.geometry.dispose(),Array.isArray(ie.material)?ie.material.forEach(ue=>ue.dispose()):ie.material.dispose())})}return{group:e,sync:it,dispose:tt}}const Zu=[14700624,5275872,14729280,5292144,12607712,14712896],go=new Map;function Zt(i,e,t={}){let n=go.get(i);return n||(n=new $t({color:e,roughness:.55,metalness:.25,...t}),go.set(i,n)),n}function ln(i,e,t,n,s=e/2){const r=new Mt(new cn(i,e,t),n);return r.position.y=s,r}function My(i){const e=new Rt,t=ln(.38,.12,.22,Zt(`car-${i}`,i),.1);e.add(t);const n=ln(.2,.1,.2,Zt(`cabin-${i}`,i,{roughness:.4}),.2);n.position.x=-.02,e.add(n);const s=ln(.16,.08,.18,Zt("glass",10537192,{transparent:!0,opacity:.65,metalness:.3,roughness:.2,emissive:2113632,emissiveIntensity:.15}),.2);s.position.x=.06,e.add(s);const r=Zt("wheel",1710618,{roughness:.9});for(const[o,a]of[[-.12,.12],[.12,.12],[-.12,-.12],[.12,-.12]]){const c=new Mt(new Xi(.05,.05,.04,8),r);c.rotation.z=Math.PI/2,c.position.set(o,.05,a),e.add(c)}return e}function yy(i){const e=new Rt,t=ln(.55,.22,.24,Zt(`bus-${i}`,i),.16);e.add(t);const n=ln(.52,.04,.25,Zt("bus-stripe",15790320),.14);e.add(n);for(let s=-2;s<=2;s++){const r=ln(.07,.08,.02,Zt("bus-win",8433888,{emissive:4219008,emissiveIntensity:.3,transparent:!0,opacity:.8}),.22);r.position.set(s*.09,0,.13),e.add(r)}return e}function Sy(i){const e=new Rt,t=ln(.22,.18,.22,Zt(`truck-cab-${i}`,i),.16);t.position.x=.14,e.add(t);const n=ln(.32,.2,.24,Zt("cargo",6974064,{roughness:.7}),.18);n.position.x=-.12,e.add(n);const s=ln(.02,.1,.18,Zt("truck-glass",10537192,{transparent:!0,opacity:.7}),.2);return s.position.set(.26,0,0),e.add(s),e}function by(i,e){const t=new Rt,n=i?3824266:13684952,s=ln(.42,.18,.22,Zt(`train-${i}-${e}`,n,{metalness:.35,roughness:.45}),.16);if(t.add(s),i){const o=ln(.12,.14,.2,Zt("engine-nose",2771578),.14);o.position.x=.24,t.add(o);const a=new Mt(new lr(.04,6,6),Zt("headlight",16769152,{emissive:16760896,emissiveIntensity:1}));a.position.set(.32,.14,0),a.userData.headlight=!0,t.add(a)}else{const o=ln(.28,.08,.02,Zt("train-win",6590664,{emissive:3166320,emissiveIntensity:.4,transparent:!0,opacity:.75}),.2);o.position.z=.12,t.add(o)}const r=ln(.06,.04,.04,Zt("coupler",4473928),.1);return r.position.x=-.24,t.add(r),t}function Ey(i,e,t){const n=Zu[e%Zu.length];if(i==="bus")return yy(n);if(i==="truck")return Sy(n);if(i==="train"){const s=new Rt;s.userData.isTrain=!0;const r=t??4;for(let o=0;o<r;o++){const a=by(o===0,o);a.userData.carIndex=o,s.add(a)}return s}return My(n)}function Ty(){const i=new Rt;i.name="vehicles";const e=new Map;function t(s,r){const o=new Set;for(const a of s){o.add(a.id);let c=e.get(a.id);if(c||(c=Ey(a.kind,a.color,a.cars),c.userData.id=a.id,e.set(a.id,c),i.add(c)),a.kind==="train"&&a.carPoses&&a.carPoses.length>0){c.position.set(0,0,0),c.rotation.set(0,0,0);const l=c.children;for(let u=0;u<l.length;u++){const f=l[u],d=a.carPoses[u]??a.carPoses[a.carPoses.length-1];f.position.set(d.x*lt,.02,d.y*lt),f.rotation.y=-d.dir}}else c.position.set(a.x*lt,.02,a.y*lt),c.rotation.y=-a.dir;c.traverse(l=>{if(l.userData.headlight){const u=Math.sin(r*8)>0,f=l.material;f.emissiveIntensity=u?1.4:.2}})}for(const[a,c]of e)o.has(a)||(i.remove(c),c.traverse(l=>{l instanceof Mt&&l.geometry.dispose()}),e.delete(a))}function n(){for(const s of e.values())i.remove(s),s.traverse(r=>{r instanceof Mt&&r.geometry.dispose()});e.clear();for(const s of go.values())s.dispose();go.clear()}return{group:i,sync:t,dispose:n}}async function Ay(i=128,e=128){const t=new Rt;t.name="world";const n=vy(i*e);t.add(n.group);const s=await py(i*e);t.add(s.group);const r=Ty();t.add(r.group);function o(c,l){n.sync(c,l),s.sync(c,l),r.sync(c.vehicles,l)}function a(){n.dispose(),s.dispose(),r.dispose()}return{root:t,sync:o,dispose:a}}async function Ry(i){const e=new jv({canvas:i,antialias:!0,alpha:!1,powerPreference:"high-performance"});e.setPixelRatio(Math.min(window.devicePixelRatio||1,1.25)),e.outputColorSpace=Pt,e.toneMapping=Sc,e.toneMappingExposure=1.55;const t=new jp;dM(t);let n=1;const s=sM(n),r=await Ay(128,128);t.add(r.root);let o=1,a=1;function c(m,p){o=Math.max(1,m),a=Math.max(1,p),n=o/a,e.setSize(o,a,!1),Gs(s,n),ds(s)}function l(m,p,S){zu(s,m,S),Gs(s,n),ds(s),r.sync(m,p),e.render(t,s.camera)}function u(m,p,S){zu(s,m,S),Gs(s,n),ds(s);const b=performance.now();r.sync(m,p);const v=performance.now();e.render(t,s.camera);const E=performance.now();return{syncMs:v-b,drawMs:E-v,calls:e.info.render.calls}}function f(m,p,S){rM(s,m,p,S),ds(s)}function d(m){oM(s,m),Gs(s,n),ds(s)}function h(m){uM(s,m.width,m.height),fM(s,m),Gs(s,n),ds(s)}function g(){return lM(s)}function x(){r.dispose(),e.dispose()}return{render:l,renderTimed:u,resize:c,pan:f,zoom:d,resetCamera:h,consumeFocusAnnounce:g,dispose:x,canvas:i}}function qs(i,e,t){return`<div class="bar"><div class="bar-fill" style="width:${Math.max(0,Math.min(100,i/e*100))}%;background:${t}"></div></div>`}function Qn(i){return Math.round(i).toLocaleString("ja-JP")}function wy(i,e,t){const{paused:n,speed:s,panelOpen:r}=t,o=`
      <div class="controls">
        <button type="button" data-action="pause" class="btn">${n?"再開":"一時停止"}</button>
        <button type="button" data-action="speed" class="btn btn-ghost">速度 ×${s}</button>
        <button type="button" data-action="reset" class="btn btn-ghost">最初から</button>
      </div>`,a=r?`
    <aside class="panel" id="stats-panel" aria-label="都市の状態">
      <div class="panel-head">
        <h2>都市の状態</h2>
        <button type="button" data-action="toggle-panel" class="btn-icon" aria-label="パネルを閉じる" title="閉じる">×</button>
      </div>
      <div class="panel-body" id="stats-body">
        <dl class="stats" id="stats-list"></dl>
        ${o}
        <p class="hint">ドラッグで視点移動 · ホイールでズーム</p>
      </div>
    </aside>`:`
    <div class="panel-collapsed" id="stats-panel-collapsed">
      <button type="button" data-action="toggle-panel" class="btn btn-ghost panel-open-btn" aria-label="都市の状態を開く">
        状態
      </button>
      ${o}
    </div>`;return`
    <header class="top-bar">
      <div class="brand">
        <a class="back" href="../">← ポータル</a>
        <h1>City Chill</h1>
        <p class="tagline">街が育つのを、ただ眺める</p>
      </div>
      <div class="stage-badge" data-stage="${i}">
        <span class="stage-label" id="hud-stage">${rf(i)}</span>
        <span class="day" id="hud-day">Day ${e}</span>
      </div>
    </header>
    ${a}
  `}function Ju(i,e,t){const n=i.querySelector("#hud-stage");n&&(n.textContent=rf(t));const s=i.querySelector("#hud-day");s&&(s.textContent=`Day ${e.day}`);const r=i.querySelector(".stage-badge");r&&r.setAttribute("data-stage",t);const o=i.querySelector("#stats-list");o&&(o.innerHTML=`
        <div class="stat">
          <dt>人口</dt>
          <dd>${Qn(e.population)} <span class="muted">/ 住宅 ${Qn(e.housing)}</span></dd>
          ${qs(e.population,Math.max(e.housing,1),"var(--color-accent)")}
        </div>
        <div class="stat">
          <dt>雇用</dt>
          <dd>${Qn(e.jobs)}</dd>
          ${qs(e.jobs,Math.max(e.population*.7,1),"var(--color-success)")}
        </div>
        <div class="stat">
          <dt>交通</dt>
          <dd>${Qn(e.transport)}</dd>
          ${qs(e.transport,Math.max(e.population/8,20),"#6ec8ff")}
        </div>
        <div class="stat">
          <dt>教育</dt>
          <dd>${Qn(e.education)}</dd>
          ${qs(e.education,100,"#e0c060")}
        </div>
        <div class="stat">
          <dt>幸福度</dt>
          <dd>${Qn(e.happiness)}</dd>
          ${qs(e.happiness,100,"#ff8ab0")}
        </div>
        <div class="stat">
          <dt>予算</dt>
          <dd class="${e.budget<0?"danger":""}">¥${Qn(e.budget)}${e.budget<0?' <span class="muted">（借入）</span>':""}</dd>
        </div>
        <div class="stat row">
          <div><dt>商業</dt><dd>${Qn(e.commerce)}</dd></div>
          <div><dt>産業</dt><dd>${Qn(e.industry)}</dd></div>
        </div>`)}function Cy(i,e){const t=i.querySelector('button[data-action="pause"]');t&&(t.textContent=e.paused?"再開":"一時停止");const n=i.querySelector('button[data-action="speed"]');n&&(n.textContent=`速度 ×${e.speed}`)}const Xr=[1,2,4],qr=128,Py=2.8;async function Iy(i){i.innerHTML=`
    <div class="app">
      <div class="hud" id="hud"></div>
      <canvas id="city-canvas"></canvas>
      <div class="toast" id="toast" hidden></div>
      <div class="perf" id="perf" title="P キーで表示切替">…</div>
    </div>
  `;const e=i.querySelector("#city-canvas"),t=i.querySelector("#hud"),n=i.querySelector("#toast"),s=i.querySelector("#perf"),r=await Ry(e),o=Fh();let a=!0,c=vl({seed:Date.now()%1e5,width:qr,height:qr});r.resetCamera(c);let l=!1,u=0,f=!0,d=!0;const h=Py;let g=performance.now(),x=0,m=0,p=0,S=0,b=!1,v=0,E=0;function T(){const D=window.innerWidth,F=window.innerHeight;e.style.width=`${D}px`,e.style.height=`${F}px`,r.resize(D,F)}function w(){const D=t.querySelector(".panel-body"),F=(D==null?void 0:D.scrollTop)??0;t.innerHTML=wy(c.stage,c.stats.day,{paused:l,speed:Xr[u],panelOpen:f}),Ju(t,c.stats,c.stage);const L=t.querySelector(".panel-body");L&&(L.scrollTop=F),d=!1}function _(D=!1){if(D||d){w();return}Ju(t,c.stats,c.stage),Cy(t,{paused:l,speed:Xr[u]})}function y(D){n.hidden=!1,n.textContent=D,p=2.2}const R={residential:"新しい住宅が建った",commercial:"商店がオープン",industrial:"工場が稼働開始",road:"道路が延伸",rail:"線路が敷設された","intercity-rail":"都市間鉄道が開通した",crossing:"踏切ができた",school:"学校が開校",park:"公園が整備された",hospital:"病院が完成",tower:"高層マンションが建った","tower-2x2":"大型タワーが街区を占めた",station:"駅が開業",plaza:"広場ができた",skyscraper:"超高層ビルがそびえる","skyscraper-2x2":"巨大な超高層が街区に建った",demolish:"再開発で道路を通した",upgrade:"建物がグレードアップ",merge:"近くの町がひとつになった",bridge:"橋が架かった"};function C(D){o.beginFrame(D);const F=Math.min(.05,(D-g)/1e3);g=D;const L=l?0:F*Xr[u];if(x+=F,L>0){const H=c.stage,Z=performance.now(),ne=Uh(c,L,h);o.markSim(performance.now()-Z),c=ne.state;for(const re of ne.events){const de=R[re];de&&y(de)}H!==c.stage&&y(`街が「${I(c.stage)}」に成長した`)}else o.markSim(0);const G=r.renderTimed(c,x,F);o.markSync(G.syncMs),o.markDraw(G.drawMs);const O=r.consumeFocusAnnounce();if(O&&y(`${O}を眺める`),m-=F,m<=0&&(_(),m=.25),S-=F,a&&S<=0){const H=o.snapshot();s.hidden=!1,s.textContent=Oh(H,{calls:G.calls,vehicles:c.vehicles.length}),S=.25}else a||(s.hidden=!0);p>0&&(p-=F,p<=0&&(n.hidden=!0)),requestAnimationFrame(C)}function I(D){return{village:"小さな村",town:"町",city:"都市",metropolis:"大都会"}[D]}t.addEventListener("click",D=>{const F=D.target.closest("button[data-action]");if(!F)return;const L=F.dataset.action;L==="toggle-panel"?(f=!f,d=!0,_(!0)):L==="pause"?(l=!l,_()):L==="speed"?(u=(u+1)%Xr.length,_()):L==="reset"&&(c=vl({seed:Date.now()%1e5,width:qr,height:qr}),r.resetCamera(c),y("新しい街が始まった"),d=!0,_(!0))}),window.addEventListener("keydown",D=>{(D.key==="p"||D.key==="P")&&(a=!a,s.hidden=!a)}),e.addEventListener("pointerdown",D=>{b=!0,v=D.clientX,E=D.clientY,e.setPointerCapture(D.pointerId)}),e.addEventListener("pointermove",D=>{if(!b)return;const F=D.clientX-v,L=D.clientY-E;v=D.clientX,E=D.clientY,r.pan(F,L,window.innerHeight)}),e.addEventListener("pointerup",()=>{b=!1}),e.addEventListener("pointercancel",()=>{b=!1}),e.addEventListener("wheel",D=>{D.preventDefault();const F=D.deltaY>0?.92:1.08;r.zoom(F)},{passive:!1}),window.addEventListener("resize",T),T(),_(!0),y("小さな村から、物語が始まる"),requestAnimationFrame(C)}const xa=document.querySelector("#app");xa&&Iy(xa).catch(i=>{console.error(i),xa.textContent="建物モデルの読み込みに失敗しました。npm run generate:buildings を実行してください。"});

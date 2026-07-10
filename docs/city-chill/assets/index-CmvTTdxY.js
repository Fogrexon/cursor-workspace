(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();const qt={population:{housingRoomFactor:.24,baseGrowth:4,popGrowthRate:.062,happinessFactorBase:.45,happinessDivisor:180,transportFactorBase:.45,transportFactorCap:1.25,transportPopDivisor:8,transportMinDenom:20,jobRoomJobsMult:1.25,jobRoomPopMult:.45,jobRoomThreshold:.25,overcrowdingThreshold:-5,overcrowdingLossCap:3,overcrowdingLossRate:.05,lowHappinessThreshold:30,lowHappinessLoss:1.5,initial:12},budget:{commerceIncome:1.35,industryIncome:1.1,populationIncome:.12,baseIncome:4,roadUpkeep:.55,railUpkeep:1.6,buildingUpkeep:.9,initial:260,debtLimit:500},buildCosts:{residential:22,commercial:32,industrial:42,road:12,rail:90,crossing:70,school:75,park:18,hospital:95,tower:170,station:240,plaza:28,skyscraper:340,upgradeBase:20,fallback:28},development:{forestClearCost:22,bridgeCost:95,bridgeUpkeep:2.2,bridgeTransport:6},terrain:{waterThreshold:.63,forestThreshold:.54,scale:.035},stages:{town:60,city:250,metropolis:900},buildInterval:{dayFactor:.42,minSeconds:.32,jitterMin:.7,jitterRange:.45},tiles:{residentialHousing:8,towerHousing:42,towerJobs:6,skyscraperHousing:90,skyscraperJobs:35,skyscraperCommerce:22,commercialJobs:12,commercialCommerce:10,industrialJobs:18,industrialIndustry:15,roadTransport:4,railTransport:10,crossingTransport:14,stationTransport:28,stationJobs:10,schoolEducation:18,schoolJobs:6,hospitalJobs:10,plazaParks:2,plazaCommerce:5,parkParks:1},happiness:{base:45,parksCap:20,parksPer:3,educationCap:15,educationFactor:.15,transportBonusCap:15,transportBonusBase:.5,transportBonusScale:20,jobBonusCap:10,jobBonusBase:.7,jobBonusScale:15,housingBonusCap:8,housingBonusBase:.8,housingBonusScale:10,hospitalBonus:4,transportPenaltyScale:25,jobPenaltyBase:.6,jobPenaltyScale:30,min:5,max:100,transportNeedDivisor:12,transportRatioCap:1.5,jobNeedFactor:.55}};function ut(n,e,t){return e*t+n}function At(n,e,t,i){return n>=0&&e>=0&&n<t&&e<i}function He(n,e,t,i,r){return At(e,t,i,r)?n[ut(e,t,i)]:null}function Ot(n,e,t,i,r){n[ut(e,t,i)]=r}function Rt(n,e=0,t=0,i=0,r="none",s=n==="pad"?0:1,a=-1){return{kind:n,tier:e,variant:t,construction:i,facing:r,footprint:s,anchorIdx:a}}const ii=new Set(["residential","commercial","industrial","park","school","hospital","station","plaza","tower","skyscraper"]),Tr=[[0,0],[1,0],[0,1],[1,1]];function Tl(n,e,t,i,r){for(const[s,a]of Tr){const o=e+s,c=t+a;if(!At(o,c,i,r))return!1;const l=n[ut(o,c,i)];if(!ir(l.kind))return!1}return!0}function Pu(n,e,t,i,r){for(const[s,a]of Tr)if(Al(n,e+s,t+a,i,r))return!0;return!1}const Mt=new Set(["road","station","crossing","bridge"]),zn=new Set(["rail","station","crossing","bridge"]);function ir(n){return n==="grass"||n==="empty"||n==="forest"}function vi(n){return ir(n)||n==="water"||n==="bridge"}const Iu=[[1,0],[-1,0],[0,1],[0,-1]];function gt(n,e,t,i){const r=[];for(const[s,a]of Iu){const o=n+s,c=e+a;At(o,c,t,i)&&r.push({x:o,y:c})}return r}function Al(n,e,t,i,r){return gt(e,t,i,r).some(s=>{const a=n[ut(s.x,s.y,i)];return Mt.has(a.kind)})}function Ci(n,e){let t=0;for(const i of n)i.kind===e&&(t+=1);return t}function Qo(n,e){return n==="none"||n==="both"?!0:n==="x"?e==="e"||e==="w":e==="n"||e==="s"}function Gn(n,e){return n==="none"?e:e==="none"||n===e?n:"both"}function Ea(n,e){return n.y===e.y&&n.x!==e.x?"x":n.x===e.x&&n.y!==e.y?"z":"both"}function Du(n,e,t){let i="none";return n&&(i=Gn(i,Ea(n,e))),t&&(i=Gn(i,Ea(e,t))),i==="none"?"x":i}function wi(n,e,t,i,r,s){const a=He(n,e,t,i,r);if(!a)return{e:!1,w:!1,n:!1,s:!1};const o=(c,l,f,d)=>{const u=He(n,e+c,t+l,i,r);return!u||!s(u.kind)?!1:a.facing==="none"&&u.facing==="none"?!0:Qo(a.facing,f)&&Qo(u.facing,d)};return{e:o(1,0,"e","w"),w:o(-1,0,"w","e"),s:o(0,1,"s","n"),n:o(0,-1,"n","s")}}function Rl(n){return(n.e?1:0)+(n.w?1:0)+(n.n?1:0)+(n.s?1:0)}function jo(n){const e=Rl(n);return e===0?"none":e===1?"end":e===2?n.e&&n.w||n.n&&n.s?"straight":"L":e===3?"T":"cross"}function Os(n){const e=n.e||n.w,t=n.n||n.s;return e&&t?"both":e?"x":t?"z":"none"}function Yi(n){return n==="road"||n==="station"||n==="crossing"||n==="bridge"}function ec(n){return n==="rail"||n==="station"||n==="crossing"||n==="bridge"}function ba(n,e){n.facing=Gn(n.facing,e)}const vo={park:20,plaza:16,residential:5,commercial:4,industrial:2},Lu=new Set(Object.keys(vo));function tc(n){return!(!Lu.has(n.kind)||n.kind==="pad"||n.footprint===0||n.footprint>=2||n.construction>0||vo[n.kind]==null||n.kind==="residential"&&n.tier>=3||n.kind==="commercial"&&n.tier>=3||n.kind==="industrial"&&n.tier>=2)}function gs(n,e,t,i,r){return gt(e,t,i,r).filter(s=>{const a=n[s.y*i+s.x];return Mt.has(a.kind)}).length}function Uu(n,e,t,i,r){return gt(e,t,i,r).filter(s=>{const a=n[s.y*i+s.x];return vi(a.kind)}).length}function Sr(n,e,t,i,r){const s=(o,c)=>o===e&&c===t?!0:At(o,c,i,r)?Mt.has(n[c*i+o].kind):!1,a=[[e,t],[e-1,t],[e,t-1],[e-1,t-1]];for(const[o,c]of a)if(s(o,c)&&s(o+1,c)&&s(o,c+1)&&s(o+1,c+1))return!0;return!1}function Bs(n,e,t,i,r){const s=e/2,a=t/2,o=r<i*1.05,c=[];for(let l=0;l<t;l++)for(let f=0;f<e;f++){const d=n[l*e+f];if(!Mt.has(d.kind)||Uu(n,f,l,e,t)>0||gs(n,f,l,e,t)!==1)continue;const h=Math.hypot(f-s,l-a);for(const g of gt(f,l,e,t)){const x=n[g.y*e+g.x];if(!tc(x)||Sr(n,g.x,g.y,e,t)||gs(n,g.x,g.y,e,t)!==1)continue;let p=vo[x.kind]??1;p-=x.tier*2,p+=h*2;const E=Math.hypot(g.x-s,g.y-a);E>h+.1?p+=8:E<h-.1?p-=10:p-=2;const A=g.x-f,S=g.y-l,T=He(n,f-A,l-S,e,t);T&&Mt.has(T.kind)?p+=6:p+=1,gt(g.x,g.y,e,t).filter(_=>_.x!==f||_.y!==l).some(_=>{const M=n[_.y*e+_.x];return vi(M.kind)||tc(M)})&&(p+=4),o&&(x.kind==="residential"||x.kind==="commercial")&&(p-=8),p>0&&c.push({x:g.x,y:g.y,score:p,kind:x.kind})}}return c.length===0?null:(c.sort((l,f)=>f.score-l.score),c[0])}function Nu(n,e,t){for(let r=0;r<t;r++)for(let s=0;s<e;s++){const a=n[r*e+s];if(Mt.has(a.kind))for(const o of gt(s,r,e,t)){const c=n[o.y*e+o.x];if(vi(c.kind)&&!Sr(n,o.x,o.y,e,t))return!1}}let i=!1;for(const r of n)if(Mt.has(r.kind)){i=!0;break}return i}function Cl(n,e,t,i,r){if(!At(e,t,i,r))return!1;const s=He(n,e,t,i,r);if(!s||!ir(s.kind)||Sr(n,e,t,i,r))return!1;for(const a of gt(e,t,i,r)){const o=n[a.y*i+a.x];if(!Mt.has(o.kind)||gt(a.x,a.y,i,r).filter(f=>Mt.has(n[f.y*i+f.x].kind)).length>=2)continue;if(gt(a.x,a.y,i,r).filter(f=>{const d=n[f.y*i+f.x];return vi(d.kind)&&!Sr(n,f.x,f.y,i,r)}).length<=1)return!0}return!1}function Dr(n){return ir(n)||n==="road"||n==="rail"||n==="station"||n==="crossing"||n==="bridge"||n==="water"}function Fu(n){return n==="rail"||n==="station"?.3:n==="crossing"?.45:n==="bridge"?.5:n==="grass"||n==="empty"?1:n==="forest"?1.8:n==="road"?8:n==="water"?12:99}function Ou(n,e,t,i,r,s=48){if(!At(i.x,i.y,e,t)||!At(r.x,r.y,e,t))return null;const a=He(n,i.x,i.y,e,t),o=He(n,r.x,r.y,e,t);if(!a||!o||!Dr(a.kind)&&!(a.kind==="rail"||a.kind==="station"||a.kind==="crossing")&&!Dr(a.kind)||!Dr(o.kind))return null;const c=(x,m)=>m*e+x,l=(x,m)=>Math.abs(x-r.x)+Math.abs(m-r.y),f=[],d=new Map,u=new Map,h=c(i.x,i.y);u.set(h,0),f.push({x:i.x,y:i.y,g:0,f:l(i.x,i.y),px:i.x,py:i.y,dx:0,dy:0});let g=0;for(;f.length>0&&g++<e*t*4;){f.sort((m,p)=>m.f-p.f);const x=f.shift();if(x.x===r.x&&x.y===r.y){const m=[{x:x.x,y:x.y}];let p=x.x,E=x.y;for(;p!==i.x||E!==i.y;){const A=d.get(c(p,E));if(!A)break;p=A.x,E=A.y,m.push({x:p,y:E})}return m.reverse(),m.length>s?null:m}for(const m of gt(x.x,x.y,e,t)){const p=He(n,m.x,m.y,e,t);if(!p||!Dr(p.kind))continue;const E=m.x-x.x,A=m.y-x.y;let S=Fu(p.kind);(x.dx!==0||x.dy!==0)&&(E===x.dx&&A===x.dy?S*=.85:S*=1.25),(m.x<=0||m.y<=0||m.x>=e-1||m.y>=t-1)&&(S+=2);const T=x.g+S,b=c(m.x,m.y);T>=(u.get(b)??1/0)||(u.set(b,T),d.set(b,{x:x.x,y:x.y}),f.push({x:m.x,y:m.y,g:T,f:T+l(m.x,m.y),px:x.x,py:x.y,dx:E,dy:A}))}}return null}function Mi(n){let e=n>>>0;return()=>{e=e+1831565813>>>0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}function Re(n,e,t){return e+Math.floor(n()*(t-e+1))}function mt(n,e){return n()<e}const nc=["青葉","緑ヶ丘","桜台","日向","風見","白砂","山手","朝霧","紅葉","金星","鈴蘭","潮見","若葉","霞丘","月見","星川"],Bu=new Set([...ii,"road","rail","crossing","bridge","station"]);function ku(n){return n<18?"hamlet":n<55?"village":n<130?"town":n<280?"city":"metropolis"}function zu(n){switch(n){case"hamlet":return"hamlet";case"village":return"village";case"borough":return"village";case"town":return"town"}}function Gu(n,e){const t=nc.filter(s=>!e.has(s)),i=t.length>0?t:[...nc],r=i[Re(n,0,i.length-1)];return e.add(r),r}function kt(n,e,t,i,r,s){let a=t,o=i;for(;a!==r||o!==s;){const l=n[ut(a,o,e)];if(l.kind!=="water"){const f=a!==r?"x":"z",d=l.kind==="road"||l.kind==="crossing"||l.kind==="bridge"?Gn(l.facing,f):f;n[ut(a,o,e)]=Rt("road",0,0,0,d)}a!==r?a+=a<r?1:-1:o!==s&&(o+=o<s?1:-1)}const c=n[ut(r,s,e)];if(c.kind!=="water"){const l=t!==r?"x":"z",f=c.kind==="road"||c.kind==="crossing"||c.kind==="bridge"?Gn(c.facing,l):l;n[ut(r,s,e)]=Rt("road",0,0,0,f)}}function Vu(n,e,t){if(t>=3){if(e===0)return mt(n,.55)?"borough":"town";if(e===1)return mt(n,.6)?"hamlet":"village"}const i=n();return i<.22?"hamlet":i<.55?"village":i<.82?"borough":"town"}function Hu(n,e){if(e==="hamlet"){const i=n();return i<.35?"ell":i<.65?"strip":i<.85?"tee":"cross"}if(e==="village"){const i=n();return i<.25?"cross":i<.45?"tee":i<.65?"ell":i<.85?"branch":"strip"}if(e==="borough"){const i=n();return i<.2?"cross":i<.4?"branch":i<.6?"loop":i<.8?"tee":"ell"}const t=n();return t<.25?"loop":t<.5?"branch":t<.7?"cross":t<.85?"tee":"ell"}function Wu(n,e,t,i,r,s,a,o){if(i<=0||r<=0||i>=e-1||r>=t-1)return;const c=n[ut(i,r,e)];c.kind==="water"||c.kind==="road"||c.kind==="crossing"||c.kind==="bridge"||(n[ut(i,r,e)]=Rt(s,a,Re(o,0,3)))}function tn(n,e,t,i,r,s,a){a<=0||kt(n,e,t,i,t+r*a,i+s*a)}function Xu(n,e,t,i,r,s,a){const o=Hu(s,a),c=a==="hamlet"?1:a==="village"?2:a==="borough"?3:4,l=c+Re(s,0,2)+(mt(s,.4)?1:0),f=c+Re(s,0,2)+(mt(s,.4)?1:0),d=mt(s,.5),u=l-Re(s,0,Math.min(2,l-1)),h=l-Re(s,0,Math.min(2,l-1)),g=f-Re(s,0,Math.min(2,f-1)),x=f-Re(s,0,Math.min(2,f-1));if(o==="strip"){if(d?kt(n,e,i-h,r,i+u,r):kt(n,e,i,r-g,i,r+x),mt(s,.55)){const T=Re(s,1,Math.max(1,c)),b=Re(s,-Math.min(h,u),Math.min(h,u));d?tn(n,e,i+b,r,0,mt(s,.5)?1:-1,T):tn(n,e,i,r+b,mt(s,.5)?1:-1,0,T)}return}if(o==="ell"){const T=[[1,0,u],[-1,0,h],[0,1,x],[0,-1,g]];for(let b=T.length-1;b>0;b--){const P=Re(s,0,b),_=T[b];T[b]=T[P],T[P]=_}tn(n,e,i,r,T[0][0],T[0][1],T[0][2]),tn(n,e,i,r,T[1][0],T[1][1],T[1][2]);return}if(o==="tee"){d?(kt(n,e,i-h,r,i+u,r),tn(n,e,i,r,0,mt(s,.5)?1:-1,Math.max(g,x))):(kt(n,e,i,r-g,i,r+x),tn(n,e,i,r,mt(s,.5)?1:-1,0,Math.max(u,h)));return}if(o==="cross"){tn(n,e,i,r,1,0,u),tn(n,e,i,r,-1,0,h),tn(n,e,i,r,0,1,x),tn(n,e,i,r,0,-1,g);return}if(o==="branch"){if(d){kt(n,e,i-h,r,i+u,r);const T=1+Re(s,0,a==="town"?3:2);for(let b=0;b<T;b++){const P=Re(s,-h,u),_=Re(s,1,f);tn(n,e,i+P,r,0,mt(s,.5)?1:-1,_)}}else{kt(n,e,i,r-g,i,r+x);const T=1+Re(s,0,a==="town"?3:2);for(let b=0;b<T;b++){const P=Re(s,-g,x),_=Re(s,1,l);tn(n,e,i,r+P,mt(s,.5)?1:-1,0,_)}}if(a!=="hamlet"&&mt(s,.4)){const T=Re(s,2,Math.max(2,c+1))*(mt(s,.5)?1:-1);if(d){const b=r+T;b>0&&b<t-1&&kt(n,e,i-Re(s,1,h),b,i+Re(s,1,u),b)}else{const b=i+T;b>0&&b<e-1&&kt(n,e,b,r-Re(s,1,g),b,r+Re(s,1,x))}}return}const m=h,p=u,E=g,A=x,S=mt(s,.35)?Re(s,0,3):-1;S!==0&&kt(n,e,i-m,r-E,i+p,r-E),S!==1&&kt(n,e,i-m,r+A,i+p,r+A),S!==2&&kt(n,e,i-m,r-E,i-m,r+A),S!==3&&kt(n,e,i+p,r-E,i+p,r+A),mt(s,.7)&&kt(n,e,i-Re(s,0,m),r,i+Re(s,0,p),r),mt(s,.55)&&kt(n,e,i,r-Re(s,0,E),i,r+Re(s,0,A))}function qu(n,e,t){const i=n();return e==="hamlet"?i<.75?{kind:"residential",tier:1}:{kind:"park",tier:1}:e==="village"?i<.55?{kind:"residential",tier:1}:i<.75?{kind:"commercial",tier:1}:i<.9?{kind:"park",tier:1}:{kind:"industrial",tier:1}:e==="borough"?t===0&&mt(n,.45)?{kind:"school",tier:1}:i<.45?{kind:"residential",tier:mt(n,.35)?2:1}:i<.65?{kind:"commercial",tier:1}:i<.78?{kind:"industrial",tier:1}:i<.9?{kind:"park",tier:1}:{kind:"plaza",tier:1}:t===0&&mt(n,.55)?{kind:"school",tier:1}:t===1&&mt(n,.4)?{kind:"hospital",tier:1}:i<.4?{kind:"residential",tier:mt(n,.5)?2:1}:i<.58?{kind:"commercial",tier:mt(n,.4)?2:1}:i<.72?{kind:"industrial",tier:1}:i<.84?{kind:"park",tier:1}:i<.92?{kind:"plaza",tier:1}:{kind:"residential",tier:1}}function Yu(n,e,t,i,r,s,a,o){const c=a==="hamlet"?Re(s,1,3):a==="village"?Re(s,4,7):a==="borough"?Re(s,8,14):Re(s,14,24),l=[];for(let h=r-o;h<=r+o;h++)for(let g=i-o;g<=i+o;g++){if(g<=0||h<=0||g>=e-1||h>=t-1)continue;const x=n[ut(g,h,e)];if(x.kind!=="grass"&&x.kind!=="empty"&&x.kind!=="forest"||!gt(g,h,e,t).some(p=>Mt.has(n[ut(p.x,p.y,e)].kind)))continue;const m=Math.hypot(g-i,h-r);l.push({x:g,y:h,score:3-m*.15+s()*2.5})}l.sort((h,g)=>g.score-h.score);const f=new Set;let d=0;const u=l.slice(0,Math.min(l.length,c*3+8));for(;d<c&&u.length>0;){const h=Re(s,0,Math.min(u.length-1,Math.max(2,Math.floor(u.length*.4)))),g=u.splice(h,1)[0],x=`${g.x},${g.y}`;if(f.has(x)||gt(g.x,g.y,e,t).filter(A=>ii.has(n[ut(A.x,A.y,e)].kind)).length>=3&&mt(s,.7))continue;const{kind:p,tier:E}=qu(s,a,d);Wu(n,e,t,g.x,g.y,p,E,s),ii.has(n[ut(g.x,g.y,e)].kind)&&(f.add(x),d+=1)}}function $u(n,e,t,i,r,s,a){Xu(n,e,t,i,r,s,a);const o=a==="hamlet"?3:a==="village"?5:a==="borough"?7:9;for(let c=-2;c<=2;c++)for(let l=-2;l<=2;l++){const f=i+l,d=r+c;if(!At(f,d,e,t))continue;n[ut(f,d,e)].kind==="forest"&&(n[ut(f,d,e)]=Rt("grass"))}return Yu(n,e,t,i,r,s,a,o),o+4}function Ku(n,e,t,i){const r=e*t,s=r>=200*200?Re(i,8,12):r>=100*100?Re(i,5,8):r>=80*80?Re(i,3,5):1,a=Math.max(22,Math.floor(Math.min(e,t)*(r>=200*200?.13:r>=100*100?.16:.22))),o=Math.max(12,Math.floor(Math.min(e,t)*.08)),c=[],l=new Set,f=(x,m,p,E)=>{for(const T of c)if(Math.hypot(x-T.cx,m-T.cy)<E)return!1;const A=Vu(i,c.length,s),S=$u(n,e,t,x,m,i,A);return c.push({id:p,name:Gu(i,l),cx:x,cy:m,radius:S,level:zu(A)}),!0},d=Math.floor(e/2+(i()-.5)*e*.15),u=Math.floor(t/2+(i()-.5)*t*.15);f(Math.max(o,Math.min(e-o-1,d)),Math.max(o,Math.min(t-o-1,u)),0,a);let h=0,g=a;for(;c.length<s&&h++<240;){const x=Re(i,o,e-o-1),m=Re(i,o,t-o-1);f(x,m,c.length,g)||h>120&&c.length<s*.7&&(g=Math.max(24,Math.floor(g*.92)))}if(s>=3&&c.length<2){const x=Math.max(o,e-o-20),m=Math.max(o,t-o-20);f(x,m,c.length,24)}return c}function _s(n,e,t,i){let r=0;const s=Math.ceil(i.radius)+4;for(let a=i.cy-s;a<=i.cy+s;a++)for(let o=i.cx-s;o<=i.cx+s;o++)At(o,a,e,t)&&(Math.hypot(o-i.cx,a-i.cy)>s||Bu.has(n[ut(o,a,e)].kind)&&(r+=1));return r}function Zu(n,e,t,i,r){if(n.length===0)return null;if(n.length===1)return n[0];const s=n.map(c=>{const l=_s(e,t,i,c);return .4+Math.sqrt(l+1)}),a=s.reduce((c,l)=>c+l,0);let o=r()*a;for(let c=0;c<n.length;c++)if(o-=s[c],o<=0)return n[c];return n[n.length-1]}function Ju(n,e,t,i){for(const r of n){let s=0,a=0,o=0;const c=Math.ceil(r.radius)+8;for(let f=r.cy-c;f<=r.cy+c;f++)for(let d=r.cx-c;d<=r.cx+c;d++){if(!At(d,f,t,i)||Math.hypot(d-r.cx,f-r.cy)>c)continue;const u=e[ut(d,f,t)];!ii.has(u.kind)||u.kind==="station"||(s+=d,a+=f,o+=1)}o>6&&(r.cx=Math.round(r.cx*.7+s/o*.3),r.cy=Math.round(r.cy*.7+a/o*.3),r.radius=Math.min(48,Math.max(10,Math.sqrt(o)*1.25)));const l=_s(e,t,i,r);r.level=ku(l)}}function Qu(n,e,t,i){if(n.length<2)return{merged:!1,absorbedId:null};for(let r=0;r<n.length;r++)for(let s=r+1;s<n.length;s++){const a=n[r],o=n[s],c=Math.hypot(a.cx-o.cx,a.cy-o.cy),l=a.radius+o.radius+6;if(c>l||!ju(e,t,i,a,o))continue;const f=_s(e,t,i,a),d=_s(e,t,i,o),u=f>=d?a:o,h=f>=d?o:a;u.cx=Math.round((a.cx*f+o.cx*d)/Math.max(1,f+d)),u.cy=Math.round((a.cy*f+o.cy*d)/Math.max(1,f+d)),u.radius=Math.min(56,a.radius+o.radius*.6);const g=h.id,x=n.indexOf(h);return n.splice(x,1),{merged:!0,absorbedId:g}}return{merged:!1,absorbedId:null}}function ju(n,e,t,i,r){const s=ic(n,e,t,i.cx,i.cy,12),a=ic(n,e,t,r.cx,r.cy,12);if(!s||!a)return!1;const o=(h,g)=>g*e+h,c=o(a.x,a.y),l=new Set,f=[s];l.add(o(s.x,s.y));let d=0;const u=4e3;for(;f.length>0&&d++<u;){const h=f.shift();if(o(h.x,h.y)===c||Math.hypot(h.x-a.x,h.y-a.y)<=2)return!0;for(const g of gt(h.x,h.y,e,t)){const x=o(g.x,g.y);if(l.has(x))continue;const m=n[ut(g.x,g.y,e)];!Mt.has(m.kind)&&m.kind!=="bridge"||(l.add(x),f.push(g))}}return!1}function ic(n,e,t,i,r,s){let a=null,o=1/0;for(let c=r-s;c<=r+s;c++)for(let l=i-s;l<=i+s;l++){if(!At(l,c,e,t))continue;const f=He(n,l,c,e,t);if(!f||!Mt.has(f.kind))continue;const d=Math.hypot(l-i,c-r);d<o&&(o=d,a={x:l,y:c})}return a}function ef(n){return n==="grass"||n==="empty"||n==="forest"||n==="rail"}function tf(n,e,t,i,r,s=4){let a=0;for(let o=-s;o<=s;o++)for(let c=-s;c<=s;c++){const l=e+c,f=t+o;if(!At(l,f,i,r))continue;const d=n[ut(l,f,i)].kind;d!=="station"&&ii.has(d)&&(a+=1)}return a}function nf(n,e,t,i,r,s){const a=sf(n,e,t,i,r,s+4,"station");if(a)return a;let o=null;for(let c=r-s;c<=r+s;c++)for(let l=i-s;l<=i+s;l++){if(!At(l,c,e,t))continue;const f=n[ut(l,c,e)];if(!ef(f.kind)||f.kind==="road"||f.kind==="crossing"||f.kind==="bridge")continue;const d=tf(n,l,c,e,t);if(d<3)continue;let u=!1;for(let m=c-8;m<=c+8&&!u;m++)for(let p=l-8;p<=l+8;p++)At(p,m,e,t)&&n[ut(p,m,e)].kind==="station"&&Math.hypot(p-l,m-c)<8&&(u=!0);if(u)continue;const h=gt(l,c,e,t).some(m=>Mt.has(n[ut(m.x,m.y,e)].kind)),g=Math.hypot(l-i,c-r);let x=d*2+8-g*.4;h&&(x+=4),f.kind==="rail"&&(x+=5),f.kind==="forest"&&(x-=1),(!o||x>o.score)&&(o={x:l,y:c,score:x})}return o?{x:o.x,y:o.y}:null}function rf(n,e,t,i,r){if(n.length<2)return null;const s=[];for(const l of n){const f=nf(e,t,i,l.cx,l.cy,Math.ceil(l.radius)+8);f&&s.push({...f,sid:l.id})}const a=[];for(let l=0;l<s.length;l++)for(let f=l+1;f<s.length;f++){const d=s[l],u=s[f];if(d.sid===u.sid)continue;const h=Math.hypot(d.x-u.x,d.y-u.y);h<18||h>120||af(e,t,i,d,u)||a.push({a:d,b:u,dist:h})}if(a.length===0)return null;a.sort((l,f)=>l.dist-f.dist);const o=a.slice(0,Math.min(4,a.length)),c=o[Re(r,0,o.length-1)];return{a:{x:c.a.x,y:c.a.y},b:{x:c.b.x,y:c.b.y}}}function sf(n,e,t,i,r,s,a){let o=null,c=1/0;for(let l=r-s;l<=r+s;l++)for(let f=i-s;f<=i+s;f++){if(!At(f,l,e,t)||n[ut(f,l,e)].kind!==a)continue;const u=Math.hypot(f-i,l-r);u<c&&(c=u,o={x:f,y:l})}return o}function af(n,e,t,i,r){const s=Math.max(1,Math.ceil(Math.hypot(r.x-i.x,r.y-i.y)));let a=0;for(let o=0;o<=s;o++){const c=o/s,l=Math.round(i.x+(r.x-i.x)*c),f=Math.round(i.y+(r.y-i.y)*c);for(let d=-1;d<=1;d++)for(let u=-1;u<=1;u++){if(!At(l+u,f+d,e,t))continue;const h=n[ut(l+u,f+d,e)].kind;(h==="rail"||h==="station"||h==="crossing")&&(a+=1)}}return a>s*.35}function As(n,e,t,i=!0){if(!t)return 0;const r=Math.hypot(n-t.cx,e-t.cy),s=t.radius+6;return i?r<=s?2-r/s:-r/(s*3):0}function of(n,e,t){return n.length<2||e==="village"||e==="town"?!1:mt(t,e==="city"?.05:.16)}function wl(n,e,t=qt){const i=t.tiles,r=t.happiness,s=t.budget;let a=0,o=0,c=0,l=0,f=0,d=0,u=0,h=0;for(const _ of n){if(_.kind==="pad"||_.footprint===0)continue;const M=Math.max(1,_.tier),R=_.footprint>=2?2.5:1;switch(_.kind){case"residential":a+=i.residentialHousing*M;break;case"tower":a+=i.towerHousing*M*R,o+=i.towerJobs*M*R;break;case"skyscraper":a+=i.skyscraperHousing*M*R,o+=i.skyscraperJobs*M*R,d+=i.skyscraperCommerce*M*R;break;case"commercial":o+=i.commercialJobs*M,d+=i.commercialCommerce*M;break;case"industrial":o+=i.industrialJobs*M,f+=i.industrialIndustry*M;break;case"road":c+=i.roadTransport;break;case"bridge":c+=t.development.bridgeTransport;break;case"rail":c+=i.railTransport;break;case"crossing":c+=i.crossingTransport;break;case"station":c+=i.stationTransport,o+=i.stationJobs;break;case"school":l+=i.schoolEducation*M,o+=i.schoolJobs;break;case"hospital":h+=1,o+=i.hospitalJobs;break;case"park":u+=i.parkParks;break;case"plaza":u+=i.plazaParks,d+=i.plazaCommerce;break}}l=Math.min(100,l);const g=e.population,x=Math.max(1,g/r.transportNeedDivisor),m=Math.min(r.transportRatioCap,c/x),p=o/Math.max(1,g*r.jobNeedFactor),E=a/Math.max(1,g);let A=r.base;A+=Math.min(r.parksCap,u*r.parksPer),A+=Math.min(r.educationCap,l*r.educationFactor),A+=Math.min(r.transportBonusCap,(m-r.transportBonusBase)*r.transportBonusScale),A+=Math.min(r.jobBonusCap,(p-r.jobBonusBase)*r.jobBonusScale),A+=Math.min(r.housingBonusCap,(E-r.housingBonusBase)*r.housingBonusScale),A+=h*r.hospitalBonus,A-=Math.max(0,(1-m)*r.transportPenaltyScale),A-=Math.max(0,(r.jobPenaltyBase-p)*r.jobPenaltyScale),A=Math.max(r.min,Math.min(r.max,A));const S=d*s.commerceIncome+f*s.industryIncome+g*s.populationIncome+s.baseIncome,T=Ci(n,"station"),b=Ci(n,"road")*s.roadUpkeep+Ci(n,"rail")*s.railUpkeep+Ci(n,"bridge")*t.development.bridgeUpkeep+Ci(n,"crossing")*s.roadUpkeep*.5+T*s.buildingUpkeep*1.8+[...ii].reduce((_,M)=>_+(M==="station"?0:Ci(n,M)*s.buildingUpkeep),0),P=S-b;return{population:g,housing:a,jobs:o,transport:c,education:l,happiness:A,budget:e.budget+P,industry:f,commerce:d,day:e.day}}function cf(n,e=qt){const t=e.population,i=n.housing-n.population,r=n.jobs*t.jobRoomJobsMult-n.population*t.jobRoomPopMult,s=t.happinessFactorBase+n.happiness/t.happinessDivisor,a=Math.min(t.transportFactorCap,t.transportFactorBase+n.transport/Math.max(t.transportMinDenom,n.population/t.transportPopDivisor));let o=0;return i>0&&r>-n.population*t.jobRoomThreshold?o=Math.min(i*t.housingRoomFactor,t.baseGrowth+n.population*t.popGrowthRate*s*a):i<t.overcrowdingThreshold?o=-Math.min(t.overcrowdingLossCap,Math.abs(i)*t.overcrowdingLossRate):n.happiness<t.lowHappinessThreshold&&(o=-t.lowHappinessLoss),Math.max(0,n.population+o)}function Pl(n,e=qt){return n<e.stages.town?"village":n<e.stages.city?"town":n<e.stages.metropolis?"city":"metropolis"}function Il(n){switch(n){case"village":return"小さな村";case"town":return"町";case"city":return"都市";case"metropolis":return"大都会"}}function lf(n,e,t=e,i=qt){const r=i.happiness,s=Math.max(1,n.population),a=(n.housing-s)/s,o=(n.jobs-s*r.jobNeedFactor)/s,c=n.transport/Math.max(1,s/r.transportNeedDivisor)-1,l=40-n.education,f=60-n.happiness,d={residential:a<.25?1.5-a:.25,commercial:o<.2?1.2-o:.25,industrial:o<.1&&e!=="village"?1-o:.15,road:c<.25?1.2-c:.35,rail:e==="metropolis"?c<.2?.45:.15:e==="city"?c<.15?.35:.08:.02,school:l>0?l/35:.08,park:f>0?f/45:.12,hospital:e!=="village"&&n.happiness<55?.55:.08,tower:t==="metropolis"?a<.3?.9:.3:t==="city"&&s>=i.stages.city*1.1?a<.25?.7:.2:0,station:e==="city"||e==="metropolis"?c<.2?.35:.08:0,skyscraper:t==="metropolis"&&s>=i.stages.metropolis*1.1?a<.3?.55:.15:0};if(n.budget>120){const h=Math.min(2.2,1+n.budget/400);d.residential*=h,d.commercial*=h,d.industrial*=h*.9,d.road*=1.2,d.tower*=Math.min(h,1.4),s>=i.stages.metropolis*1.2?d.skyscraper*=Math.min(h,1.3):d.skyscraper*=.4,d.rail*=.45,d.station*=.55}return n.budget>280&&(d.residential*=1.25,d.commercial*=1.2,d.tower*=1.15,s>=i.stages.metropolis*1.25&&(d.skyscraper*=1.25),d.rail*=.6),e==="metropolis"&&(d.residential*=1.35,d.commercial*=1.25,t==="metropolis"&&(d.tower*=1.2,s>=i.stages.metropolis*1.15&&(d.skyscraper*=1.2))),n.budget+i.budget.debtLimit<80?(d.tower*=.1,d.rail*=.2,d.station*=.15,d.skyscraper=0):n.budget<0&&(d.tower*=.55,d.skyscraper*=.35,d.rail*=.7),d}({...qt.buildCosts});function Lr(n,e,t){let i=n*374761393+e*668265263+t*982451653|0;return i=(i^i>>>13)*1274126177,i=i^i>>>16,(i>>>0)/4294967296}function rc(n){return n*n*(3-2*n)}function uf(n,e,t){const i=Math.floor(n),r=Math.floor(e),s=rc(n-i),a=rc(e-r),o=Lr(i,r,t),c=Lr(i+1,r,t),l=Lr(i,r+1,t),f=Lr(i+1,r+1,t),d=o+(c-o)*s,u=l+(f-l)*s;return d+(u-d)*a}function sc(n,e,t,i=4,r=2,s=.5){let a=1,o=1,c=0,l=0;for(let f=0;f<i;f++)c+=a*uf(n*o,e*o,t+f*1013),l+=a,a*=s,o*=r;return c/Math.max(1e-6,l)}function ff(n,e,t,i){const r=[],s=(n-1)/2,a=(e-1)/2,o=Math.hypot(s,a)||1;for(let c=0;c<e;c++)for(let l=0;l<n;l++){const f=l*i.scale,d=c*i.scale,u=sc(f,d,t),h=sc(f+40,d-17,t+7),g=l===0||c===0||l===n-1||c===e-1?.06:0,x=Math.hypot(l-s,c-a)/o,m=Math.max(0,1-x*1.6)*.2,p=u+g-m;let E;p>i.waterThreshold?E="water":h>i.forestThreshold&&p<i.waterThreshold-.03?E="forest":E="grass";const A=E==="water"?Math.floor(u*3)%3:E==="forest"?Math.floor(h*4)%4:Math.floor((u+h)*2)%4;r.push(Rt(E,0,A))}return r}function Xi(n,e,t){const i=t.development;return n==="forest"?i.forestClearCost:n==="water"?e==="road"||e==="rail"||e==="crossing"?i.bridgeCost:Number.POSITIVE_INFINITY:0}function Ta(n,e){return n==="water"||n==="bridge"?"bridge":e==="road"&&n==="rail"||e==="rail"&&n==="road"?"crossing":e}const _i=48,ac=36,qi=28,oc=36,df=4,ei=8,hf=3,pf=4;function Qi(n,e,t,i,r,s=pf){let a=0;for(let o=-s;o<=s;o++)for(let c=-s;c<=s;c++){const l=e+c,f=t+o;if(!At(l,f,i,r))continue;const d=n[f*i+l].kind;d!=="station"&&ii.has(d)&&(a+=1)}return a}function mf(n,e,t,i,r,s=hf){return Qi(n,e,t,i,r)>=s}function gf(n,e,t){for(let i=0;i<e.length;i++){const r=e[i],s=i>0?e[i-1]:null,a=i<e.length-1?e[i+1]:null,o=Du(s,r,a),c=n[r.y*t+r.x];c&&ba(c,o)}}function ar(n,e,t,i,r){const s=He(n,e,t,i,r);if(!s||!Yi(s.kind))return;let a="none";for(const o of gt(e,t,i,r)){const c=n[o.y*i+o.x];if(!Yi(c.kind))continue;const l=Ea({x:e,y:t},o);a=Gn(a,l),ba(c,l)}ba(s,a==="none"?"x":a)}function _f(n,e){const t=e.reduce((r,s)=>r+Math.max(0,s.w),0);if(t<=0)return"park";let i=n()*t;for(const r of e)if(i-=Math.max(0,r.w),i<=0)return r.key;return e[e.length-1].key}function xf(n,e,t,i,r){const s=[],a=(r==null?void 0:r.cx)??e/2,o=(r==null?void 0:r.cy)??t/2,c=r?Math.ceil(r.radius)+14:Math.min(e,t),l=Math.max(0,o-c),f=Math.min(t-1,o+c),d=Math.max(0,a-c),u=Math.min(e-1,a+c);for(let g=l;g<=f;g++)for(let x=d;x<=u;x++){const m=He(n,x,g,e,t);if(!m||!ir(m.kind)||!Al(n,x,g,e,t)||Cl(n,x,g,e,t))continue;const p=Math.hypot(x-a,g-o),E=m.kind==="forest"?.35:0,A=1/(1+p*.12)+As(x,g,r)+i()*.3-E;s.push({x,y:g,score:A})}if(s.length===0)return null;s.sort((g,x)=>x.score-g.score);const h=s.slice(0,Math.min(12,s.length));return h[Re(i,0,h.length-1)]}function vf(n,e,t,i,r,s){const a=[];for(let o=0;o<t;o++)for(let c=0;c<e;c++){const l=He(n,c,o,e,t);l&&r.includes(l.kind)&&(l.kind==="pad"||l.footprint===0||l.tier>=s||l.construction>0||a.push({x:c,y:o}))}return a.length===0?null:a[Re(i,0,a.length-1)]}function cc(n,e,t,i,r){const s=[],a=(r==null?void 0:r.cx)??e/2,o=(r==null?void 0:r.cy)??t/2,c=r?Math.ceil(r.radius)+18:Math.min(e,t),l=Math.max(0,o-c),f=Math.min(t-1,o+c),d=Math.max(0,a-c),u=Math.min(e-1,a+c);for(let g=l;g<=f;g++)for(let x=d;x<=u;x++){const m=He(n,x,g,e,t);if(!m||!Mt.has(m.kind))continue;const p=gs(n,x,g,e,t),E=p<=1?4:p===2?1.5:-1;for(const A of gt(x,g,e,t)){const S=n[A.y*e+A.x];if(!vi(S.kind)||Sr(n,A.x,A.y,e,t))continue;const T=gs(n,A.x,A.y,e,t);if(T>=3||T>=2&&p>=2)continue;let b=E;const P=A.x-x,_=A.y-g,M=He(n,x-P,g-_,e,t);M&&Mt.has(M.kind)?b+=5:b+=.5,T===1?b+=3:T===2&&(b-=2);const R=Math.hypot(A.x-a,A.y-o),C=Math.hypot(x-a,g-o);R>C?b+=2.5:b-=.5,b+=As(A.x,A.y,r)*.5,S.kind==="grass"||S.kind==="empty"?b+=2:S.kind==="forest"?b+=.8:b-=1.5,b+=i()*.4,s.push({x:A.x,y:A.y,score:b})}}if(s.length===0)return null;s.sort((g,x)=>x.score-g.score);const h=s.slice(0,Math.min(8,s.length));return h[Re(i,0,h.length-1)]}function Mf(n,e,t){const i=[];for(let r=0;r<t;r++)for(let s=0;s<e;s++){const a=n[r*e+s];(a.kind==="rail"||a.kind==="station"||a.kind==="crossing"||a.kind==="bridge")&&i.push({x:s,y:r})}return i}function Sf(n,e,t,i,r){const s=He(n,e,t,i,r);return s?s.kind==="grass"||s.kind==="empty"||s.kind==="forest"||s.kind==="rail":!1}function yf(n,e,t,i,r){let s=Number.POSITIVE_INFINITY;for(let a=0;a<r;a++)for(let o=0;o<i;o++){if(n[a*i+o].kind!=="station")continue;const c=Math.hypot(o-e,a-t);c<s&&(s=c)}return s}function ln(n,e,t,i,r,s=ei){return Sf(n,e,t,i,r)?n[t*i+e].kind==="station"?!0:yf(n,e,t,i,r)<s?!1:mf(n,e,t,i,r):!1}function ls(n,e,t,i,r,s){let a=null,o=s;const c=Math.max(0,Math.floor(t-s)),l=Math.min(r-1,Math.ceil(t+s)),f=Math.max(0,Math.floor(e-s)),d=Math.min(i-1,Math.ceil(e+s));for(let u=c;u<=l;u++)for(let h=f;h<=d;h++){const g=n[u*i+h];if(!g||g.kind!=="station")continue;const x=Math.hypot(h-e,u-t);x<=o&&(o=x,a={x:h,y:u})}return a}function or(n,e,t,i){const r=ls(n,e.x,e.y,t,i,ei);return r||(ln(n,e.x,e.y,t,i)?e:gt(e.x,e.y,t,i).filter(o=>ln(n,o.x,o.y,t,i)).map(o=>{const c=gt(o.x,o.y,t,i).some(l=>Mt.has(n[l.y*t+l.x].kind));return{...o,score:c?2:1}}).sort((o,c)=>c.score-o.score)[0]??null)}function ks(n,e,t){const i=t.buildCosts;if(e&&(n==="road"||n==="water"||n==="bridge"))return Number.POSITIVE_INFINITY;const r=e?i.station:n==="road"?i.crossing:i.rail,a=Xi(n,e?"station":n==="road"?"crossing":"rail",t);return Number.isFinite(a)?r+a:Number.POSITIVE_INFINITY}function Dl(n,e){return n+e.budget.debtLimit}function Cn(n,e,t){return e<=Dl(n,t)}function lc(n,e,t,i,r,s,a,o){const c=Dl(s,r),l=Mf(n,e,t),f=(_,M)=>{if(_.length<2)return null;let R=0;for(let C=0;C<_.length;C++){const I=_[C],O=C===0,V=C===_.length-1,D=M==="both"&&(O||V)||M==="goal"&&V,H=He(n,I.x,I.y,e,t);if(H.kind!=="station"){if(H.kind==="rail"||H.kind==="crossing"||H.kind==="bridge"){D&&H.kind==="rail"&&(ls(n,I.x,I.y,e,t,ei-.01)||(R+=5));continue}if(D){if(ls(n,I.x,I.y,e,t,ei-.01))continue;const F=ln(n,I.x,I.y,e,t)?I:or(n,I,e,t);if(!F)return null;const k=He(n,F.x,F.y,e,t);if(k.kind==="station")continue;if(!ln(n,F.x,F.y,e,t))return null;const J=ks(k.kind==="rail"?"grass":k.kind,!0,r);if(!Number.isFinite(J))return null;R+=J;continue}if(O&&M==="goal")return null;if(H.kind==="road"||vi(H.kind)){const F=ks(H.kind,!1,r);if(!Number.isFinite(F))return null;R+=F}else return null}}return R},d=(_,M,R,C=R?_i:oc)=>{const I=He(n,_,M,e,t);if(I.kind==="rail"||I.kind==="station"||I.kind==="crossing"||I.kind==="bridge")return 0;if(R&&!ln(n,_,M,e,t))return-1;const O=ks(I.kind,R,r);if(!Number.isFinite(O))return-1;if(R)return Ot(n,_,M,e,Rt("station",1,Re(i,0,2),C,"both")),O;if(I.kind==="road")return Ot(n,_,M,e,Rt("crossing",0,0,Math.max(C,qi),"both")),O;if(!vi(I.kind))return-1;const V=Ta(I.kind,"rail");return Ot(n,_,M,e,Rt(V,0,0,C,"x")),O},u=(_,M,R=_i)=>{const C=He(n,_,M,e,t);if(!C)return-1;if(C.kind==="station"||ls(n,_,M,e,t,ei-.01))return 0;if(ln(n,_,M,e,t))return C.kind==="rail"?(Ot(n,_,M,e,Rt("station",1,Re(i,0,2),R,Gn(C.facing,"both"))),5):d(_,M,!0,R);const I=or(n,{x:_,y:M},e,t);if(!I)return-1;const O=He(n,I.x,I.y,e,t);return O.kind==="station"?0:ln(n,I.x,I.y,e,t)?O.kind==="rail"?(Ot(n,I.x,I.y,e,Rt("station",1,Re(i,0,2),R,Gn(O.facing,"both"))),5):d(I.x,I.y,!0,R):-1},h=(_,M,R)=>{const C=f(_,M);if(C==null||C>c)return null;const I=_.map(k=>{const J=n[k.y*e+k.x];return{x:k.x,y:k.y,tile:{...J}}}),O=[];for(const k of[_[0],_[_.length-1]])for(const J of gt(k.x,k.y,e,t))I.some(ne=>ne.x===J.x&&ne.y===J.y)||O.some(ne=>ne.x===J.x&&ne.y===J.y)||O.push({x:J.x,y:J.y,tile:{...n[J.y*e+J.x]}});const V=[];let D=0,H=0,F=!0;for(let k=0;k<_.length;k++){const J=_[k],ne=k===0,se=k===_.length-1,me=M==="both"&&(ne||se)||M==="goal"&&se,Pe=He(n,J.x,J.y,e,t),Te=oc+k*df;if(me){if(Pe.kind==="station"){V.push("station");continue}const ue=u(J.x,J.y,Math.max(Te,_i));if(ue<0){F=!1;break}H+=ue,V.push("station"),ue>5&&(D+=1);continue}if(Pe.kind==="rail"||Pe.kind==="station"||Pe.kind==="crossing"||Pe.kind==="bridge")continue;const We=d(J.x,J.y,!1,Te);if(We<0){F=!1;break}H+=We,D+=1;const Q=He(n,J.x,J.y,e,t);V.push(Q.kind)}if(F){gf(n,_,e);const k=(me,Pe)=>{const Te=He(n,me,Pe,e,t);return(Te==null?void 0:Te.kind)==="station"?!0:gt(me,Pe,e,t).some(We=>n[We.y*e+We.x].kind==="station")},J=(me,Pe)=>{var We;const Te=(We=He(n,me,Pe,e,t))==null?void 0:We.kind;return Te==="rail"||Te==="station"||Te==="crossing"||Te==="bridge"},ne=_[0],se=_[_.length-1];M==="both"?(!k(ne.x,ne.y)||!k(se.x,se.y))&&(F=!1):(!J(ne.x,ne.y)||!k(se.x,se.y))&&(F=!1)}if(!F||H>c){for(const k of I)Ot(n,k.x,k.y,e,k.tile);for(const k of O)Ot(n,k.x,k.y,e,k.tile);return null}return{placed:D,kinds:[...new Set(V)],cost:H,intercity:R,path:_}},g=(_,M,R,C,I)=>{var H,F,k,J;let O=_,V=M;if(C==="both"){const ne=or(n,_,e,t),se=or(n,M,e,t);if(!ne||!se)return null;O=((H=He(n,_.x,_.y,e,t))==null?void 0:H.kind)==="station"?_:ne,V=((F=He(n,M.x,M.y,e,t))==null?void 0:F.kind)==="station"?M:se}else{const ne=(k=He(n,_.x,_.y,e,t))==null?void 0:k.kind;if(ne!=="rail"&&ne!=="station"&&ne!=="crossing"&&ne!=="bridge")return null;if(((J=He(n,M.x,M.y,e,t))==null?void 0:J.kind)!=="station"){const se=or(n,M,e,t);if(!se)return null;V=se}}const D=Ou(n,e,t,O,V,R);return D?h(D,C,I):null};if(o){const _=g(o.a,o.b,140,"both",!0);if(_)return _}if(l.length===0){const _=(a==null?void 0:a.cx)??Math.floor(e/2),M=(a==null?void 0:a.cy)??Math.floor(t/2),R=[];for(let C=M-12;C<=M+12;C++)for(let I=_-14;I<=_+14;I++)!ln(n,I,C,e,t)||!gt(I,C,e,t).some(V=>Mt.has(n[V.y*e+V.x].kind))||R.push({x:I,y:C});if(R.length<2)return null;for(let C=0;C<40;C++){const I=R[Re(i,0,R.length-1)],O=R[Re(i,0,R.length-1)],V=Math.hypot(I.x-O.x,I.y-O.y);if(V<ei||V>22)continue;const D=g(I,O,48,"both",!1);if(D)return D}return null}const x=l.filter(_=>{const M=n[_.y*e+_.x].kind;return M==="rail"||M==="station"});if(x.length===0)return null;x.sort((_,M)=>a?Math.hypot(_.x-a.cx,_.y-a.cy)-Math.hypot(M.x-a.cx,M.y-a.cy):0);const m=x[Re(i,0,Math.min(5,x.length-1))],p=[];for(const _ of l){if(_.x===m.x&&_.y===m.y||n[_.y*e+_.x].kind!=="station")continue;const M=Math.hypot(_.x-m.x,_.y-m.y);M>=ei&&M<=40&&p.push(_)}const E=a?Math.ceil(a.radius)+16:22,A=Math.max(2,((a==null?void 0:a.cy)??m.y)-E),S=Math.min(t-3,((a==null?void 0:a.cy)??m.y)+E),T=Math.max(2,((a==null?void 0:a.cx)??m.x)-E),b=Math.min(e-3,((a==null?void 0:a.cx)??m.x)+E);for(let _=A;_<=S;_++)for(let M=T;M<=b;M++){if(!ln(n,M,_,e,t)||!gt(M,_,e,t).some(I=>Mt.has(n[I.y*e+I.x].kind)))continue;const C=Math.hypot(M-m.x,_-m.y);C<ei||C>28||p.push({x:M,y:_})}p.sort((_,M)=>{const R=Qi(n,M.x,M.y,e,t)-Qi(n,_.x,_.y,e,t);return R!==0?R:Math.hypot(_.x-m.x,_.y-m.y)-Math.hypot(M.x-m.x,M.y-m.y)});const P=p.slice(0,Math.min(10,p.length));for(let _=0;_<P.length;_++){const M=P[Re(i,0,P.length-1)],R=g(m,M,60,"goal",!1);if(R)return R}return null}function Ef(n,e,t,i,r){const s=[],a=(r==null?void 0:r.cx)??e/2,o=(r==null?void 0:r.cy)??t/2,c=r?Math.ceil(r.radius)+12:24,l=Math.max(1,o-c),f=Math.min(t-2,o+c),d=Math.max(1,a-c),u=Math.min(e-2,a+c);for(let h=l;h<=f;h++)for(let g=d;g<=u;g++){const x=He(n,g,h,e,t);if(!x||x.kind==="station"||!ln(n,g,h,e,t))continue;const m=x.kind==="rail",p=gt(g,h,e,t).some(S=>{const T=n[S.y*e+S.x];return T.kind==="rail"||T.kind==="crossing"||T.kind==="station"});if(!m&&!p)continue;const A=Qi(n,g,h,e,t)*1.5+(m?4:p?2.5:0)+As(g,h,r)+i()*.3;s.push({x:g,y:h,score:A})}return s.length===0?null:(s.sort((h,g)=>g.score-h.score),s[Re(i,0,Math.min(5,s.length-1))])}function bf(n,e,t,i,r,s,a,o){if(!At(i,r,e,t))return!1;const c=He(n,i,r,e,t);return!c||!ir(c.kind)?!1:(Ot(n,i,r,e,Rt(s,a,Re(o,0,7),_i)),!0)}function Rs(n,e,t,i,r,s,a,o=qt){const c=Qi(n,e,t,i,r,4),l=Math.min(1,c/16);let f=0;for(let x=-3;x<=3;x++)for(let m=-3;m<=3;m++){const p=He(n,e+m,t+x,i,r);p&&(p.kind==="commercial"?f+=.025:p.kind==="tower"?f+=.05:p.kind==="skyscraper"?f+=.07:(p.kind==="plaza"||p.kind==="station")&&(f+=.02))}f=Math.min(1,f);const d=s==="metropolis"?.5:s==="city"?.28:s==="town"?.1:0,u=Math.max(1,o.stages.metropolis),h=Math.min(1,a.population/(u*1.5)),g=Math.min(.15,Math.max(0,a.budget)/2500);return l*.38+f*.22+d*.22+h*.13+g*.05}function Tf(n,e,t,i,r,s,a,o=qt){return s!=="city"&&s!=="metropolis"||a.population<o.stages.city*.85?!1:Rs(n,e,t,i,r,s,a,o)>=.48}function Ll(n,e,t,i,r,s,a,o=qt){return s!=="metropolis"||a.population<o.stages.metropolis||a.budget<80?!1:Rs(n,e,t,i,r,s,a,o)>=.68}function Af(n,e,t,i,r,s,a,o=qt){return s!=="metropolis"||a.population<o.stages.metropolis*1.25||a.budget<150?!1:Rs(n,e,t,i,r,s,a,o)>=.74}function Rf(n,e,t,i,r,s,a,o="premium",c=qt){const l=[],f=(r==null?void 0:r.cx)??e/2,d=(r==null?void 0:r.cy)??t/2,u=r?Math.ceil(r.radius)+14:Math.min(e,t),h=Math.max(0,d-u),g=Math.min(t-2,d+u),x=Math.max(0,f-u),m=Math.min(e-2,f+u);for(let E=h;E<=g;E++)for(let A=x;A<=m;A++){if(!Tl(n,A,E,e,t)||!Pu(n,A,E,e,t)||!(o==="premium"?Af(n,A,E,e,t,s,a,c):Ll(n,A,E,e,t,s,a,c)))continue;let T=!1;for(const[M,R]of Tr)if(Cl(n,A+M,E+R,e,t)){T=!0;break}if(T)continue;const b=Math.hypot(A+.5-f,E+.5-d),P=Qi(n,A,E,e,t,3),_=Rs(n,A,E,e,t,s,a,c);l.push({x:A,y:E,score:P*.08+_*3-b*.08+As(A,E,r)+i()*.25})}if(l.length===0)return null;l.sort((E,A)=>A.score-E.score);const p=l.slice(0,Math.min(8,l.length));return p[Re(i,0,p.length-1)]}function Cf(n,e,t,i,r,s,a,o){if(!Tl(n,i,r,e,t))return!1;const c=Re(o,0,7),l=ut(i,r,e);for(const[f,d]of Tr){const u=i+f,h=r+d;f===0&&d===0?Ot(n,u,h,e,Rt(s,a,c,_i,"none",2,-1)):Ot(n,u,h,e,Rt("pad",0,c,_i,"none",0,l))}return!0}function wf(n,e,t,i){const r=i?e==="metropolis"?.35:e==="city"?.12:0:0;return[{key:"residential",w:n.residential},{key:"commercial",w:n.commercial},{key:"industrial",w:n.industrial},{key:"road",w:n.road+(t?1.4:0)+(i?.35:0)},{key:"rail",w:n.rail+r},{key:"school",w:n.school},{key:"park",w:n.park},{key:"hospital",w:n.hospital},{key:"tower",w:n.tower},{key:"station",w:n.station},{key:"plaza",w:e==="city"?.3:e==="metropolis"?.45:.05},{key:"upgrade",w:e==="town"?.55:e==="city"?.95:e==="metropolis"?1.4:.15},{key:"skyscraper",w:n.skyscraper},{key:"demolish",w:t?2:.05}]}function Pf(n,e,t,i,r,s,a,o=qt,c=[]){const l=Mi((s^a*2654435761)>>>0),f=o.buildCosts,d=Zu(c,n,e,t,l),u=(d==null?void 0:d.level)??r,h=lf(i,r,u,o),g=Nu(n,e,t),x=c.length>=2,m=_f(l,wf(h,r,g,x));if(m==="demolish"||m==="road"&&g){const M=Bs(n,e,t,i.population,i.housing);if(M){const R=Math.round(f.road*1.5);if(Cn(i.budget,R,o))return Ot(n,M.x,M.y,e,Rt("road",0,0,qi,"x")),ar(n,M.x,M.y,e,t),{built:!0,kind:"demolish",cost:R}}if(m==="demolish")return{built:!1,cost:0}}if(m==="upgrade"){const R=vf(n,e,t,l,["residential","commercial","industrial","tower"],u==="metropolis"?5:u==="city"?4:3);if(!R)return{built:!1,cost:0};const C=He(n,R.x,R.y,e,t),I=f.upgradeBase*(C.tier+1)*(C.footprint>=2?2:1);if(!Cn(i.budget,I,o))return{built:!1,cost:0};if(C.tier+=1,C.construction=ac,C.footprint>=2)for(const[O,V]of Tr){if(O===0&&V===0)continue;const D=He(n,R.x+O,R.y+V,e,t);D&&D.kind==="pad"&&(D.construction=ac)}return{built:!0,kind:"upgrade",cost:I}}const p=f[m]??f.fallback;if(m==="road"){const M=cc(n,e,t,l,d);if(!M){const V=Bs(n,e,t,i.population,i.housing);if(!V)return{built:!1,cost:0};const D=Math.round(f.road*1.5);return Cn(i.budget,D,o)?(Ot(n,V.x,V.y,e,Rt("road",0,0,qi,"x")),ar(n,V.x,V.y,e,t),{built:!0,kind:"demolish",cost:D}):{built:!1,cost:0}}const R=He(n,M.x,M.y,e,t),C=Xi(R.kind,"road",o),I=f.road+(Number.isFinite(C)?C:0);if(!Cn(i.budget,I,o))return{built:!1,cost:0};const O=Ta(R.kind,"road");return Ot(n,M.x,M.y,e,Rt(O,0,0,qi,"x")),ar(n,M.x,M.y,e,t),{built:!0,kind:O,cost:I}}if(m==="rail"){const R=of(c,r,l)?rf(c,n,e,t,l):null,C=lc(n,e,t,l,o,i.budget,d,R);return C?{built:!0,kind:C.intercity?"intercity-rail":C.kinds.includes("station")?"rail":C.kinds.includes("bridge")?"bridge":C.kinds.includes("crossing")?"crossing":"rail",cost:C.cost,trainPath:C.path.length>=2?C.path:void 0}:{built:!1,cost:0}}if(m==="station"){const M=Ef(n,e,t,l,d);if(!M){const O=lc(n,e,t,l,o,i.budget,d,null);return O?{built:!0,kind:"station",cost:O.cost,trainPath:O.path.length>=2?O.path:void 0}:{built:!1,cost:0}}const R=He(n,M.x,M.y,e,t);if(!ln(n,M.x,M.y,e,t))return{built:!1,cost:0};const C=Xi(R.kind==="rail"?"grass":R.kind,"station",o),I=f.station+(Number.isFinite(C)?C:0);return Cn(i.budget,I,o)?(Ot(n,M.x,M.y,e,Rt("station",1,Re(l,0,2),_i,Gn(R.facing==="none"?"x":R.facing,"both"))),{built:!0,kind:"station",cost:I}):{built:!1,cost:0}}const E=xf(n,e,t,l,d);if(!E){const M=cc(n,e,t,l,d);if(M){const I=He(n,M.x,M.y,e,t),O=Xi(I.kind,"road",o),V=f.road+(Number.isFinite(O)?O:0);if(Cn(i.budget,V,o)){const D=Ta(I.kind,"road");return Ot(n,M.x,M.y,e,Rt(D,0,0,qi,"x")),ar(n,M.x,M.y,e,t),{built:!0,kind:D,cost:V}}}const R=Bs(n,e,t,i.population,i.housing),C=Math.round(f.road*1.5);return R&&Cn(i.budget,C,o)?(Ot(n,R.x,R.y,e,Rt("road",0,0,qi,"x")),ar(n,R.x,R.y,e,t),{built:!0,kind:"demolish",cost:C}):{built:!1,cost:0}}const A=m,S=m==="skyscraper"||m==="tower"?2:1;if(m==="skyscraper"&&u==="metropolis"||m==="tower"&&u==="metropolis"){const M=Rf(n,e,t,l,d,u,i,m==="skyscraper"?"premium":"high",o);if(M){const R=He(n,M.x,M.y,e,t),C=Xi(R.kind,"building",o);if(Number.isFinite(C)){const I=Math.round(p*2.4)+C;if(Cn(i.budget,I,o)&&Cf(n,e,t,M.x,M.y,A,S,l))return{built:!0,kind:m==="skyscraper"?"skyscraper-2x2":"tower-2x2",cost:I}}}}if(m==="skyscraper"){if(!Ll(n,E.x,E.y,e,t,u,i,o))return{built:!1,cost:0}}else if(m==="tower"&&!Tf(n,E.x,E.y,e,t,u,i,o))return{built:!1,cost:0};const b=He(n,E.x,E.y,e,t),P=Xi(b.kind,"building",o);if(!Number.isFinite(P))return{built:!1,cost:0};const _=p+P;return Cn(i.budget,_,o)?bf(n,e,t,E.x,E.y,A,S,l)?{built:!0,kind:m,cost:_}:{built:!1,cost:0}:{built:!1,cost:0}}function If(n){for(const e of n)e.construction>0&&(e.construction=Math.max(0,e.construction-1/3))}function Df(n,e=qt){const{width:t,height:i,seed:r}=n,s=Mi(r),a=ff(t,i,r,e.terrain),o=Ku(a,t,i,s),c={population:e.population.initial,budget:e.budget.initial,day:0},l=wl(a,c,e),f=Math.round(l.housing*.62),d=Math.max(1,o.length);return l.population=Math.max(e.population.initial,f+(d-1)*4),l.budget=e.budget.initial+Math.round(l.housing*.9)+(d-1)*40,{width:t,height:i,tiles:a,stats:l,vehicles:[],stage:Pl(l.population,e),buildCooldown:.8,nextVehicleId:1,seed:r,settlements:o}}function Cs(n,e,t,i,r,s,a=64){if(!At(i.x,i.y,e,t)||!At(r.x,r.y,e,t))return null;const o=He(n,i.x,i.y,e,t),c=He(n,r.x,r.y,e,t);if(!o||!c||!s.has(o.kind)||!s.has(c.kind))return null;if(i.x===r.x&&i.y===r.y)return[{...i}];const l=(m,p)=>p*e+m,f=(m,p)=>Math.abs(m-r.x)+Math.abs(p-r.y),d=[],u=new Map,h=new Map,g=l(i.x,i.y);h.set(g,0),d.push({x:i.x,y:i.y,g:0,f:f(i.x,i.y),dx:0,dy:0});let x=0;for(;d.length>0&&x++<e*t*4;){let m=0;for(let E=1;E<d.length;E++)d[E].f<d[m].f&&(m=E);const p=d.splice(m,1)[0];if(p.x===r.x&&p.y===r.y){const E=[{x:p.x,y:p.y}];let A=p.x,S=p.y;for(;A!==i.x||S!==i.y;){const T=u.get(l(A,S));if(!T)break;A=T.x,S=T.y,E.push({x:A,y:S})}return E.reverse(),E.length>a?null:E}for(const E of gt(p.x,p.y,e,t)){const A=He(n,E.x,E.y,e,t);if(!A||!s.has(A.kind))continue;const S=E.x-p.x,T=E.y-p.y;let b=1;(p.dx!==0||p.dy!==0)&&(S===p.dx&&T===p.dy?b=.85:b=1.2);const P=p.g+b,_=l(E.x,E.y);P>=(h.get(_)??1/0)||(h.set(_,P),u.set(_,{x:p.x,y:p.y}),d.push({x:E.x,y:E.y,g:P,f:P+f(E.x,E.y),dx:S,dy:T}))}}return null}function $i(n,e,t,i){const r=[];for(let s=0;s<t;s++)for(let a=0;a<e;a++)i(n[s*e+a])&&r.push({x:a,y:s});return r}function Ul(n){const e=[0];for(let t=1;t<n.length;t++){const i=n[t-1],r=n[t];e.push(e[t-1]+Math.hypot(r.x-i.x,r.y-i.y))}return e}function Ar(n){const e=Ul(n);return e[e.length-1]??0}function Nl(n,e){if(n.length===0)return{x:0,y:0,dir:0};if(n.length===1){const h=n[0];return{x:h.x,y:h.y,dir:0}}const t=Ul(n),i=t[t.length-1],r=Math.max(0,Math.min(i,e));let s=0;for(;s<t.length-2&&t[s+1]<r;)s+=1;const a=n[s],o=n[s+1],c=t[s],l=Math.max(1e-6,t[s+1]-c),f=(r-c)/l,d=o.x-a.x,u=o.y-a.y;return{x:a.x+d*f,y:a.y+u*f,dir:Math.atan2(u,d)}}const uc=[0,1,2,3,4,5],ws=.55,Mo=160,Lf=.4,Uf=1.8;function Nf(n){if(n.kind!=="train"){n.carPoses=void 0;return}const e=n.cars??4,t=[];for(let r=0;r<e;r++)t.push(Nl(n.path,Math.max(0,n.progress-r*ws)));n.carPoses=t;const i=t[0];n.x=i.x,n.y=i.y,n.dir=i.dir}function xi(n){if(n.kind==="train")Nf(n);else{const e=Nl(n.path,n.progress);n.x=e.x,n.y=e.y,n.dir=e.dir}}function Fl(n,e,t,i=3){const r=n.filter(s=>Math.hypot(s.x-e.x,s.y-e.y)>=i);if(r.length===0){if(n.length<=1)return null;const s=n.filter(a=>a.x!==e.x||a.y!==e.y);return s.length===0?null:s[Re(t,0,s.length-1)]}return r[Re(t,0,r.length-1)]}function So(n,e,t,i,r=4e3){const s=(l,f)=>f*e+l,a=He(n,i.x,i.y,e,t);if(!a||!zn.has(a.kind))return new Set;const o=new Set,c=[{x:i.x,y:i.y}];for(o.add(s(i.x,i.y));c.length>0&&o.size<r;){const l=c.shift();for(const f of gt(l.x,l.y,e,t)){const d=s(f.x,f.y);if(o.has(d))continue;const u=n[d];zn.has(u.kind)&&(o.add(d),c.push(f))}}return o}function Ff(n,e,t,i){if(n.length<=1)return n.map(d=>({...d}));if(n.length===2)return n.map(d=>({...d}));const r=d=>`${d.x},${d.y}`,s=n.reduce((d,u)=>d+u.x,0)/n.length,a=n.reduce((d,u)=>d+u.y,0)/n.length;let o=n[0],c=-1;for(const d of n){const u=Math.hypot(d.x-s,d.y-a);u>c&&(c=u,o=d)}const l=[{...o}],f=new Set([r(o)]);for(;l.length<n.length;){const d=l[l.length-1];let u=null,h=Number.POSITIVE_INFINITY;for(const g of n){if(f.has(r(g)))continue;const x=Cs(e,t,i,d,g,zn,Mo),m=x&&x.length>=2?Ar(x):Number.POSITIVE_INFINITY;m<h&&(h=m,u=g)}if(!u||!Number.isFinite(h))for(const g of n){if(f.has(r(g)))continue;const x=Math.hypot(g.x-d.x,g.y-d.y);x<h&&(h=x,u=g)}if(!u)break;l.push({...u}),f.add(r(u))}return l}function Ol(n,e,t,i,r,s){const a={x:Math.round(n.x),y:Math.round(n.y)},o=He(e,a.x,a.y,t,i);let c=a;if(!o||!Mt.has(o.kind)){if(r.length===0)return!1;c=r[Re(s,0,r.length-1)]}let l=null,f=null;for(let d=0;d<8;d++){if(l=Fl(r,c,s,4),!l)return!1;if(f=Cs(e,t,i,c,l,Mt),f&&f.length>=2)break;f=null}return!f||!l?!1:(n.destination=l,n.path=f,n.progress=0,xi(n),!0)}function Of(n,e,t,i,r,s,a){const o={x:Math.round(n.x),y:Math.round(n.y)},c=He(e,o.x,o.y,t,i);let l=o;if(!c||!zn.has(c.kind)){const m=r.length>0?r:s;if(m.length===0)return!1;l=m[Re(a,0,m.length-1)]}const f=So(e,t,i,l);if(f.size<2)return!1;const d=(m,p)=>p*t+m,u=r.filter(m=>f.has(d(m.x,m.y)));let h=null;if(u.length>=2){const m=Ff(u,e,t,i);let p=0,E=Number.POSITIVE_INFINITY;for(let A=0;A<m.length;A++){const S=m[A],T=Math.hypot(S.x-l.x,S.y-l.y);T<E&&(E=T,p=A)}if(E>1.5)h=m[p];else if(m.length===2)h=m[1-p],n.railDir=p===0?1:-1;else{let A=n.railDir??1,S=p+A;(S<0||S>=m.length)&&(A=A===1?-1:1,S=p+A),(S<0||S>=m.length)&&(S=p===0?1:p-1,A=S>p?1:-1),n.railDir=A,h=m[S]}}else{const m=s.filter(p=>f.has(d(p.x,p.y))&&(p.x!==l.x||p.y!==l.y));if(m.length===0)return!1;h=Fl(m,l,a,3)}if(!h)return!1;const g=Cs(e,t,i,l,h,zn,Mo);if(!g||g.length<2)return!1;n.destination={x:h.x,y:h.y},n.path=g;const x=n.cars??4;return n.progress=Math.min((x-1)*ws,Ar(g)*.2),xi(n),!0}function Bf(n,e,t){if(n.length<2)return null;const i=Re(t,3,5),r=n[0],s=n[n.length-1],a={id:e,kind:"train",x:r.x,y:r.y,dir:0,speed:2.4,progress:0,path:n.map(o=>({...o})),destination:{...s},color:0,cars:i,wait:0};return a.progress=Math.min((i-1)*ws,Ar(a.path)*.2),xi(a),a}function kf(n,e,t,i,r,s,a,o){const c=Mi(a+o*9973>>>0),l=$i(n,e,t,x=>Mt.has(x.kind)),f=$i(n,e,t,x=>x.kind==="station"),d=Math.min(40,Math.floor(s/8)+Math.floor(l.length/6)),u=i.filter(x=>{if(x.path.length<2)return!1;const m=He(n,x.destination.x,x.destination.y,e,t);return m?x.kind==="train"?zn.has(m.kind):Mt.has(m.kind):!1});let h=r,g=0;for(;u.filter(x=>x.kind!=="train").length<d&&l.length>1&&!(++g>60);){const x=l[Re(c,0,l.length-1)],m=c();let p="car";m>.92?p="bus":m>.82&&(p="truck");const E=p==="bus"?1.6:p==="truck"?1.4:2+c()*.8,A={id:h++,kind:p,x:x.x,y:x.y,dir:0,speed:E,progress:0,path:[x,x],destination:{...x},color:uc[Re(c,0,uc.length-1)],wait:0};Ol(A,n,e,t,l,c)&&u.push(A)}return h=Vf(n,e,t,f,u,h,c),{vehicles:u,nextId:h}}function zf(n,e,t,i){const r=(c,l)=>l*e+c,s=new Set(i.map(c=>r(c.x,c.y))),a=new Map(i.map(c=>[r(c.x,c.y),c])),o=[];for(;s.size>0;){const c=s.values().next().value,l=a.get(c),f=So(n,e,t,l),d=[];for(const u of s)f.has(u)&&d.push(a.get(u));for(const u of d)s.delete(r(u.x,u.y));d.length>0&&o.push(d)}return o}function Gf(n,e,t,i,r){if(r.length===0)return!1;const s=So(e,t,i,r[0]),a=(o,c)=>c*t+o;return n.some(o=>o.kind!=="train"?!1:s.has(a(Math.round(o.x),Math.round(o.y))))}function Vf(n,e,t,i,r,s,a){let o=s;if(i.length<2){if(r.every(l=>l.kind!=="train")){const l=$i(n,e,t,d=>zn.has(d.kind)),f=fc(n,e,t,i,l,o,a);f&&(r.push(f),o=f.id+1)}return o}const c=zf(n,e,t,i);for(const l of c){if(l.length<2||Gf(r,n,e,t,l))continue;const f=fc(n,e,t,l,l,o,a);f&&(r.push(f),o=f.id+1)}return o}function fc(n,e,t,i,r,s,a){const o=i.length>=2?i:r;if(o.length<2)return null;const c=[];for(let l=0;l<o.length;l++)for(let f=l+1;f<o.length;f++){const d=o[l],u=o[f];c.push({a:d,b:u,d:Math.hypot(d.x-u.x,d.y-u.y)})}c.sort((l,f)=>f.d-l.d);for(const{a:l,b:f}of c){const d=Cs(n,e,t,l,f,zn,Mo);if(!d||d.length<2)continue;const u=Re(a,3,5),h={id:s,kind:"train",x:l.x,y:l.y,dir:0,speed:2.4,progress:0,path:d,destination:{...f},color:0,cars:u,wait:0};return h.progress=Math.min((u-1)*ws,Ar(d)*.2),xi(h),h}return null}function Hf(n,e,t){const i=Mi(t?(t.seed^t.day*7919^n.length*104729)>>>0:1);let r=null,s=null,a=null;const o=()=>{!t||r||(r=$i(t.tiles,t.width,t.height,c=>Mt.has(c.kind)),s=$i(t.tiles,t.width,t.height,c=>zn.has(c.kind)),a=$i(t.tiles,t.width,t.height,c=>c.kind==="station"))};for(const c of n){if((c.wait??0)>0){c.wait=Math.max(0,(c.wait??0)-e);continue}const l=Ar(c.path);if(l<.01){t&&(o(),dc(c,t,r,s,a,i));continue}if(c.progress+=c.speed*e,c.progress>=l-.001){c.progress=l,xi(c),t?(o(),dc(c,t,r,s,a,i)||(c.progress=l,xi(c))):c.progress=0,c.wait=c.kind==="train"?Uf:Lf;continue}xi(c)}}function dc(n,e,t,i,r,s){return n.kind==="train"?Of(n,e.tiles,e.width,e.height,r,i,s):Ol(n,e.tiles,e.width,e.height,t,s)}function hc(n={},e){const t={width:n.width??28,height:n.height??28,seed:n.seed??42,secondsPerDay:n.secondsPerDay??2.8};return Df(t,qt)}function Wf(n,e,t,i=qt){const r=[],s={...n,tiles:n.tiles.map(c=>({...c})),stats:{...n.stats},settlements:n.settlements.map(c=>({...c})),vehicles:n.vehicles.map(c=>{var l;return{...c,path:c.path.map(f=>({...f})),destination:{...c.destination},carPoses:(l=c.carPoses)==null?void 0:l.map(f=>({...f}))}})};If(s.tiles),Hf(s.vehicles,e,{tiles:s.tiles,width:s.width,height:s.height,seed:s.seed,day:s.stats.day}),s.buildCooldown-=e;const a=i.buildInterval,o=Math.max(a.minSeconds,t*a.dayFactor);if(s.buildCooldown<=0){const c=Mi((s.seed^s.stats.day*374761393^2654435769)>>>0);s.buildCooldown=o*(a.jitterMin+c()*a.jitterRange);const l=s.stats.budget>320?4:s.stats.budget>180?3:s.stats.budget>90?2:1;for(let d=0;d<l;d++){const u=Pf(s.tiles,s.width,s.height,s.stats,s.stage,s.seed,s.stats.day*17+d,i,s.settlements);if(!u.built||!u.kind)break;if(s.stats.budget-=u.cost,r.push(u.kind),u.trainPath&&u.trainPath.length>=2){const h=Mi((s.seed^s.stats.day*2654435761^d*2246822507)>>>0),g=Bf(u.trainPath,s.nextVehicleId,h);g&&(s.vehicles.push(g),s.nextVehicleId=g.id+1)}if(s.stats.budget+i.budget.debtLimit<40)break}s.stats.day+=1,s.stats=wl(s.tiles,s.stats,i),s.stats.population=cf(s.stats,i),s.stage=Pl(s.stats.population,i),s.stats.day%3===0&&(Ju(s.settlements,s.tiles,s.width,s.height),Qu(s.settlements,s.tiles,s.width,s.height).merged&&r.push("merge"));const f=kf(s.tiles,s.width,s.height,s.vehicles,s.nextVehicleId,s.stats.population,s.seed,s.stats.day);s.vehicles=f.vehicles,s.nextVehicleId=f.nextId}return{state:s,events:r}}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const yo="185",Xf=0,pc=1,qf=2,us=1,Yf=2,vr=3,ri=0,Xt=1,Fn=2,Bn=0,Ki=1,mc=2,gc=3,_c=4,$f=5,hi=100,Kf=101,Zf=102,Jf=103,Qf=104,jf=200,ed=201,td=202,nd=203,Aa=204,Ra=205,id=206,rd=207,sd=208,ad=209,od=210,cd=211,ld=212,ud=213,fd=214,Ca=0,wa=1,Pa=2,ji=3,Ia=4,Da=5,La=6,Ua=7,Bl=0,dd=1,hd=2,bn=0,kl=1,zl=2,Gl=3,Eo=4,Vl=5,Hl=6,Wl=7,Xl=300,Si=301,er=302,zs=303,Gs=304,Ps=306,Na=1e3,On=1001,Fa=1002,Lt=1003,pd=1004,Ur=1005,Bt=1006,Vs=1007,mi=1008,Jt=1009,ql=1010,Yl=1011,yr=1012,bo=1013,An=1014,dn=1015,Vn=1016,To=1017,Ao=1018,Er=1020,$l=35902,Kl=35899,Zl=1021,Jl=1022,hn=1023,Hn=1026,gi=1027,Ro=1028,Co=1029,yi=1030,wo=1031,Po=1033,fs=33776,ds=33777,hs=33778,ps=33779,Oa=35840,Ba=35841,ka=35842,za=35843,Ga=36196,Va=37492,Ha=37496,Wa=37488,Xa=37489,xs=37490,qa=37491,Ya=37808,$a=37809,Ka=37810,Za=37811,Ja=37812,Qa=37813,ja=37814,eo=37815,to=37816,no=37817,io=37818,ro=37819,so=37820,ao=37821,oo=36492,co=36494,lo=36495,uo=36283,fo=36284,vs=36285,ho=36286,md=3200,po=0,gd=1,ti="",Zt="srgb",Ms="srgb-linear",Ss="linear",st="srgb",Pi=7680,xc=519,_d=512,xd=513,vd=514,Io=515,Md=516,Sd=517,Do=518,yd=519,vc=35044,Nn=35048,Mc="300 es",En=2e3,br=2001;function Ed(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function ys(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function bd(){const n=ys("canvas");return n.style.display="block",n}const Sc={};function yc(...n){const e="THREE."+n.shift();console.log(e,...n)}function Ql(n){const e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Be(...n){n=Ql(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function it(...n){n=Ql(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function Zi(...n){const e=n.join(" ");e in Sc||(Sc[e]=!0,Be(...n))}function Td(n,e,t){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}const Ad={[Ca]:wa,[Pa]:La,[Ia]:Ua,[ji]:Da,[wa]:Ca,[La]:Pa,[Ua]:Ia,[Da]:ji};class bi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const r=i[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const Nt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Hs=Math.PI/180,mo=180/Math.PI;function Rr(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Nt[n&255]+Nt[n>>8&255]+Nt[n>>16&255]+Nt[n>>24&255]+"-"+Nt[e&255]+Nt[e>>8&255]+"-"+Nt[e>>16&15|64]+Nt[e>>24&255]+"-"+Nt[t&63|128]+Nt[t>>8&255]+"-"+Nt[t>>16&255]+Nt[t>>24&255]+Nt[i&255]+Nt[i>>8&255]+Nt[i>>16&255]+Nt[i>>24&255]).toLowerCase()}function et(n,e,t){return Math.max(e,Math.min(t,n))}function Rd(n,e){return(n%e+e)%e}function Ws(n,e,t){return(1-t)*n+t*e}function cr(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Wt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const Bo=class Bo{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=et(this.x,e.x,t.x),this.y=et(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=et(this.x,e,t),this.y=et(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(et(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(et(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*r+e.x,this.y=s*r+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Bo.prototype.isVector2=!0;let tt=Bo;class rr{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,a,o){let c=i[r+0],l=i[r+1],f=i[r+2],d=i[r+3],u=s[a+0],h=s[a+1],g=s[a+2],x=s[a+3];if(d!==x||c!==u||l!==h||f!==g){let m=c*u+l*h+f*g+d*x;m<0&&(u=-u,h=-h,g=-g,x=-x,m=-m);let p=1-o;if(m<.9995){const E=Math.acos(m),A=Math.sin(E);p=Math.sin(p*E)/A,o=Math.sin(o*E)/A,c=c*p+u*o,l=l*p+h*o,f=f*p+g*o,d=d*p+x*o}else{c=c*p+u*o,l=l*p+h*o,f=f*p+g*o,d=d*p+x*o;const E=1/Math.sqrt(c*c+l*l+f*f+d*d);c*=E,l*=E,f*=E,d*=E}}e[t]=c,e[t+1]=l,e[t+2]=f,e[t+3]=d}static multiplyQuaternionsFlat(e,t,i,r,s,a){const o=i[r],c=i[r+1],l=i[r+2],f=i[r+3],d=s[a],u=s[a+1],h=s[a+2],g=s[a+3];return e[t]=o*g+f*d+c*h-l*u,e[t+1]=c*g+f*u+l*d-o*h,e[t+2]=l*g+f*h+o*u-c*d,e[t+3]=f*g-o*d-c*u-l*h,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(i/2),f=o(r/2),d=o(s/2),u=c(i/2),h=c(r/2),g=c(s/2);switch(a){case"XYZ":this._x=u*f*d+l*h*g,this._y=l*h*d-u*f*g,this._z=l*f*g+u*h*d,this._w=l*f*d-u*h*g;break;case"YXZ":this._x=u*f*d+l*h*g,this._y=l*h*d-u*f*g,this._z=l*f*g-u*h*d,this._w=l*f*d+u*h*g;break;case"ZXY":this._x=u*f*d-l*h*g,this._y=l*h*d+u*f*g,this._z=l*f*g+u*h*d,this._w=l*f*d-u*h*g;break;case"ZYX":this._x=u*f*d-l*h*g,this._y=l*h*d+u*f*g,this._z=l*f*g-u*h*d,this._w=l*f*d+u*h*g;break;case"YZX":this._x=u*f*d+l*h*g,this._y=l*h*d+u*f*g,this._z=l*f*g-u*h*d,this._w=l*f*d-u*h*g;break;case"XZY":this._x=u*f*d-l*h*g,this._y=l*h*d-u*f*g,this._z=l*f*g+u*h*d,this._w=l*f*d+u*h*g;break;default:Be("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],a=t[1],o=t[5],c=t[9],l=t[2],f=t[6],d=t[10],u=i+o+d;if(u>0){const h=.5/Math.sqrt(u+1);this._w=.25/h,this._x=(f-c)*h,this._y=(s-l)*h,this._z=(a-r)*h}else if(i>o&&i>d){const h=2*Math.sqrt(1+i-o-d);this._w=(f-c)/h,this._x=.25*h,this._y=(r+a)/h,this._z=(s+l)/h}else if(o>d){const h=2*Math.sqrt(1+o-i-d);this._w=(s-l)/h,this._x=(r+a)/h,this._y=.25*h,this._z=(c+f)/h}else{const h=2*Math.sqrt(1+d-i-o);this._w=(a-r)/h,this._x=(s+l)/h,this._y=(c+f)/h,this._z=.25*h}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(et(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,a=e._w,o=t._x,c=t._y,l=t._z,f=t._w;return this._x=i*f+a*o+r*l-s*c,this._y=r*f+a*c+s*o-i*l,this._z=s*f+a*l+i*c-r*o,this._w=a*f-i*o-r*c-s*l,this._onChangeCallback(),this}slerp(e,t){let i=e._x,r=e._y,s=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,r=-r,s=-s,a=-a,o=-o);let c=1-t;if(o<.9995){const l=Math.acos(o),f=Math.sin(l);c=Math.sin(c*l)/f,t=Math.sin(t*l)/f,this._x=this._x*c+i*t,this._y=this._y*c+r*t,this._z=this._z*c+s*t,this._w=this._w*c+a*t,this._onChangeCallback()}else this._x=this._x*c+i*t,this._y=this._y*c+r*t,this._z=this._z*c+s*t,this._w=this._w*c+a*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const ko=class ko{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Ec.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Ec.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,a=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*a,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*a,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*r-o*i),f=2*(o*t-s*r),d=2*(s*i-a*t);return this.x=t+c*l+a*d-o*f,this.y=i+c*f+o*l-s*d,this.z=r+c*d+s*f-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=et(this.x,e.x,t.x),this.y=et(this.y,e.y,t.y),this.z=et(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=et(this.x,e,t),this.y=et(this.y,e,t),this.z=et(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(et(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,a=t.x,o=t.y,c=t.z;return this.x=r*c-s*o,this.y=s*a-i*c,this.z=i*o-r*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Xs.copy(this).projectOnVector(e),this.sub(Xs)}reflect(e){return this.sub(Xs.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(et(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};ko.prototype.isVector3=!0;let z=ko;const Xs=new z,Ec=new rr,zo=class zo{constructor(e,t,i,r,s,a,o,c,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,a,o,c,l)}set(e,t,i,r,s,a,o,c,l){const f=this.elements;return f[0]=e,f[1]=r,f[2]=o,f[3]=t,f[4]=s,f[5]=c,f[6]=i,f[7]=a,f[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,a=i[0],o=i[3],c=i[6],l=i[1],f=i[4],d=i[7],u=i[2],h=i[5],g=i[8],x=r[0],m=r[3],p=r[6],E=r[1],A=r[4],S=r[7],T=r[2],b=r[5],P=r[8];return s[0]=a*x+o*E+c*T,s[3]=a*m+o*A+c*b,s[6]=a*p+o*S+c*P,s[1]=l*x+f*E+d*T,s[4]=l*m+f*A+d*b,s[7]=l*p+f*S+d*P,s[2]=u*x+h*E+g*T,s[5]=u*m+h*A+g*b,s[8]=u*p+h*S+g*P,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],f=e[8];return t*a*f-t*o*l-i*s*f+i*o*c+r*s*l-r*a*c}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],f=e[8],d=f*a-o*l,u=o*c-f*s,h=l*s-a*c,g=t*d+i*u+r*h;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/g;return e[0]=d*x,e[1]=(r*l-f*i)*x,e[2]=(o*i-r*a)*x,e[3]=u*x,e[4]=(f*t-r*c)*x,e[5]=(r*s-o*t)*x,e[6]=h*x,e[7]=(i*c-l*t)*x,e[8]=(a*t-i*s)*x,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,a,o){const c=Math.cos(s),l=Math.sin(s);return this.set(i*c,i*l,-i*(c*a+l*o)+a+e,-r*l,r*c,-r*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return Zi("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(qs.makeScale(e,t)),this}rotate(e){return Zi("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(qs.makeRotation(-e)),this}translate(e,t){return Zi("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(qs.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};zo.prototype.isMatrix3=!0;let Ve=zo;const qs=new Ve,bc=new Ve().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Tc=new Ve().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Cd(){const n={enabled:!0,workingColorSpace:Ms,spaces:{},convert:function(r,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===st&&(r.r=kn(r.r),r.g=kn(r.g),r.b=kn(r.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===st&&(r.r=Ji(r.r),r.g=Ji(r.g),r.b=Ji(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===ti?Ss:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,a){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return Zi("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return Zi("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Ms]:{primaries:e,whitePoint:i,transfer:Ss,toXYZ:bc,fromXYZ:Tc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Zt},outputColorSpaceConfig:{drawingBufferColorSpace:Zt}},[Zt]:{primaries:e,whitePoint:i,transfer:st,toXYZ:bc,fromXYZ:Tc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Zt}}}),n}const je=Cd();function kn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Ji(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Ii;class wd{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Ii===void 0&&(Ii=ys("canvas")),Ii.width=e.width,Ii.height=e.height;const r=Ii.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=Ii}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=ys("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=kn(s[a]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(kn(t[i]/255)*255):t[i]=kn(t[i]);return{data:t,width:e.width,height:e.height}}else return Be("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Pd=0;class Lo{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Pd++}),this.uuid=Rr(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(Ys(r[a].image)):s.push(Ys(r[a]))}else s=Ys(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function Ys(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?wd.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Be("Texture: Unable to serialize Texture."),{})}let Id=0;const $s=new z;class Vt extends bi{constructor(e=Vt.DEFAULT_IMAGE,t=Vt.DEFAULT_MAPPING,i=On,r=On,s=Bt,a=mi,o=hn,c=Jt,l=Vt.DEFAULT_ANISOTROPY,f=ti){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Id++}),this.uuid=Rr(),this.name="",this.source=new Lo(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new tt(0,0),this.repeat=new tt(1,1),this.center=new tt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ve,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=f,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize($s).x}get height(){return this.source.getSize($s).y}get depth(){return this.source.getSize($s).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){Be(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){Be(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Xl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Na:e.x=e.x-Math.floor(e.x);break;case On:e.x=e.x<0?0:1;break;case Fa:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Na:e.y=e.y-Math.floor(e.y);break;case On:e.y=e.y<0?0:1;break;case Fa:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Vt.DEFAULT_IMAGE=null;Vt.DEFAULT_MAPPING=Xl;Vt.DEFAULT_ANISOTROPY=1;const Go=class Go{constructor(e=0,t=0,i=0,r=1){this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*r+a[12]*s,this.y=a[1]*t+a[5]*i+a[9]*r+a[13]*s,this.z=a[2]*t+a[6]*i+a[10]*r+a[14]*s,this.w=a[3]*t+a[7]*i+a[11]*r+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const c=e.elements,l=c[0],f=c[4],d=c[8],u=c[1],h=c[5],g=c[9],x=c[2],m=c[6],p=c[10];if(Math.abs(f-u)<.01&&Math.abs(d-x)<.01&&Math.abs(g-m)<.01){if(Math.abs(f+u)<.1&&Math.abs(d+x)<.1&&Math.abs(g+m)<.1&&Math.abs(l+h+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const A=(l+1)/2,S=(h+1)/2,T=(p+1)/2,b=(f+u)/4,P=(d+x)/4,_=(g+m)/4;return A>S&&A>T?A<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(A),r=b/i,s=P/i):S>T?S<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(S),i=b/r,s=_/r):T<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(T),i=P/s,r=_/s),this.set(i,r,s,t),this}let E=Math.sqrt((m-g)*(m-g)+(d-x)*(d-x)+(u-f)*(u-f));return Math.abs(E)<.001&&(E=1),this.x=(m-g)/E,this.y=(d-x)/E,this.z=(u-f)/E,this.w=Math.acos((l+h+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=et(this.x,e.x,t.x),this.y=et(this.y,e.y,t.y),this.z=et(this.z,e.z,t.z),this.w=et(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=et(this.x,e,t),this.y=et(this.y,e,t),this.z=et(this.z,e,t),this.w=et(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(et(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Go.prototype.isVector4=!0;let vt=Go;class Dd extends bi{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Bt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new vt(0,0,e,t),this.scissorTest=!1,this.viewport=new vt(0,0,e,t),this.textures=[];const r={width:e,height:t,depth:i.depth},s=new Vt(r),a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:Bt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const r=Object.assign({},e.textures[t].image);this.textures[t].source=new Lo(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Tn extends Dd{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class jl extends Vt{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Lt,this.minFilter=Lt,this.wrapR=On,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Ld extends Vt{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Lt,this.minFilter=Lt,this.wrapR=On,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Ts=class Ts{constructor(e,t,i,r,s,a,o,c,l,f,d,u,h,g,x,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,a,o,c,l,f,d,u,h,g,x,m)}set(e,t,i,r,s,a,o,c,l,f,d,u,h,g,x,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=r,p[1]=s,p[5]=a,p[9]=o,p[13]=c,p[2]=l,p[6]=f,p[10]=d,p[14]=u,p[3]=h,p[7]=g,p[11]=x,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ts().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,i=e.elements,r=1/Di.setFromMatrixColumn(e,0).length(),s=1/Di.setFromMatrixColumn(e,1).length(),a=1/Di.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),c=Math.cos(r),l=Math.sin(r),f=Math.cos(s),d=Math.sin(s);if(e.order==="XYZ"){const u=a*f,h=a*d,g=o*f,x=o*d;t[0]=c*f,t[4]=-c*d,t[8]=l,t[1]=h+g*l,t[5]=u-x*l,t[9]=-o*c,t[2]=x-u*l,t[6]=g+h*l,t[10]=a*c}else if(e.order==="YXZ"){const u=c*f,h=c*d,g=l*f,x=l*d;t[0]=u+x*o,t[4]=g*o-h,t[8]=a*l,t[1]=a*d,t[5]=a*f,t[9]=-o,t[2]=h*o-g,t[6]=x+u*o,t[10]=a*c}else if(e.order==="ZXY"){const u=c*f,h=c*d,g=l*f,x=l*d;t[0]=u-x*o,t[4]=-a*d,t[8]=g+h*o,t[1]=h+g*o,t[5]=a*f,t[9]=x-u*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const u=a*f,h=a*d,g=o*f,x=o*d;t[0]=c*f,t[4]=g*l-h,t[8]=u*l+x,t[1]=c*d,t[5]=x*l+u,t[9]=h*l-g,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const u=a*c,h=a*l,g=o*c,x=o*l;t[0]=c*f,t[4]=x-u*d,t[8]=g*d+h,t[1]=d,t[5]=a*f,t[9]=-o*f,t[2]=-l*f,t[6]=h*d+g,t[10]=u-x*d}else if(e.order==="XZY"){const u=a*c,h=a*l,g=o*c,x=o*l;t[0]=c*f,t[4]=-d,t[8]=l*f,t[1]=u*d+x,t[5]=a*f,t[9]=h*d-g,t[2]=g*d-h,t[6]=o*f,t[10]=x*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Ud,e,Nd)}lookAt(e,t,i){const r=this.elements;return $t.subVectors(e,t),$t.lengthSq()===0&&($t.z=1),$t.normalize(),Yn.crossVectors(i,$t),Yn.lengthSq()===0&&(Math.abs(i.z)===1?$t.x+=1e-4:$t.z+=1e-4,$t.normalize(),Yn.crossVectors(i,$t)),Yn.normalize(),Nr.crossVectors($t,Yn),r[0]=Yn.x,r[4]=Nr.x,r[8]=$t.x,r[1]=Yn.y,r[5]=Nr.y,r[9]=$t.y,r[2]=Yn.z,r[6]=Nr.z,r[10]=$t.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,a=i[0],o=i[4],c=i[8],l=i[12],f=i[1],d=i[5],u=i[9],h=i[13],g=i[2],x=i[6],m=i[10],p=i[14],E=i[3],A=i[7],S=i[11],T=i[15],b=r[0],P=r[4],_=r[8],M=r[12],R=r[1],C=r[5],I=r[9],O=r[13],V=r[2],D=r[6],H=r[10],F=r[14],k=r[3],J=r[7],ne=r[11],se=r[15];return s[0]=a*b+o*R+c*V+l*k,s[4]=a*P+o*C+c*D+l*J,s[8]=a*_+o*I+c*H+l*ne,s[12]=a*M+o*O+c*F+l*se,s[1]=f*b+d*R+u*V+h*k,s[5]=f*P+d*C+u*D+h*J,s[9]=f*_+d*I+u*H+h*ne,s[13]=f*M+d*O+u*F+h*se,s[2]=g*b+x*R+m*V+p*k,s[6]=g*P+x*C+m*D+p*J,s[10]=g*_+x*I+m*H+p*ne,s[14]=g*M+x*O+m*F+p*se,s[3]=E*b+A*R+S*V+T*k,s[7]=E*P+A*C+S*D+T*J,s[11]=E*_+A*I+S*H+T*ne,s[15]=E*M+A*O+S*F+T*se,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],a=e[1],o=e[5],c=e[9],l=e[13],f=e[2],d=e[6],u=e[10],h=e[14],g=e[3],x=e[7],m=e[11],p=e[15],E=c*h-l*u,A=o*h-l*d,S=o*u-c*d,T=a*h-l*f,b=a*u-c*f,P=a*d-o*f;return t*(x*E-m*A+p*S)-i*(g*E-m*T+p*b)+r*(g*A-x*T+p*P)-s*(g*S-x*b+m*P)}determinantAffine(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[1],a=e[5],o=e[9],c=e[2],l=e[6],f=e[10];return t*(a*f-o*l)-i*(s*f-o*c)+r*(s*l-a*c)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],f=e[8],d=e[9],u=e[10],h=e[11],g=e[12],x=e[13],m=e[14],p=e[15],E=t*o-i*a,A=t*c-r*a,S=t*l-s*a,T=i*c-r*o,b=i*l-s*o,P=r*l-s*c,_=f*x-d*g,M=f*m-u*g,R=f*p-h*g,C=d*m-u*x,I=d*p-h*x,O=u*p-h*m,V=E*O-A*I+S*C+T*R-b*M+P*_;if(V===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const D=1/V;return e[0]=(o*O-c*I+l*C)*D,e[1]=(r*I-i*O-s*C)*D,e[2]=(x*P-m*b+p*T)*D,e[3]=(u*b-d*P-h*T)*D,e[4]=(c*R-a*O-l*M)*D,e[5]=(t*O-r*R+s*M)*D,e[6]=(m*S-g*P-p*A)*D,e[7]=(f*P-u*S+h*A)*D,e[8]=(a*I-o*R+l*_)*D,e[9]=(i*R-t*I-s*_)*D,e[10]=(g*b-x*S+p*E)*D,e[11]=(d*S-f*b-h*E)*D,e[12]=(o*M-a*C-c*_)*D,e[13]=(t*C-i*M+r*_)*D,e[14]=(x*A-g*T-m*E)*D,e[15]=(f*T-d*A+u*E)*D,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,a=e.x,o=e.y,c=e.z,l=s*a,f=s*o;return this.set(l*a+i,l*o-r*c,l*c+r*o,0,l*o+r*c,f*o+i,f*c-r*a,0,l*c-r*o,f*c+r*a,s*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,a){return this.set(1,i,s,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,a=t._y,o=t._z,c=t._w,l=s+s,f=a+a,d=o+o,u=s*l,h=s*f,g=s*d,x=a*f,m=a*d,p=o*d,E=c*l,A=c*f,S=c*d,T=i.x,b=i.y,P=i.z;return r[0]=(1-(x+p))*T,r[1]=(h+S)*T,r[2]=(g-A)*T,r[3]=0,r[4]=(h-S)*b,r[5]=(1-(u+p))*b,r[6]=(m+E)*b,r[7]=0,r[8]=(g+A)*P,r[9]=(m-E)*P,r[10]=(1-(u+x))*P,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];const s=this.determinantAffine();if(s===0)return i.set(1,1,1),t.identity(),this;let a=Di.set(r[0],r[1],r[2]).length();const o=Di.set(r[4],r[5],r[6]).length(),c=Di.set(r[8],r[9],r[10]).length();s<0&&(a=-a),rn.copy(this);const l=1/a,f=1/o,d=1/c;return rn.elements[0]*=l,rn.elements[1]*=l,rn.elements[2]*=l,rn.elements[4]*=f,rn.elements[5]*=f,rn.elements[6]*=f,rn.elements[8]*=d,rn.elements[9]*=d,rn.elements[10]*=d,t.setFromRotationMatrix(rn),i.x=a,i.y=o,i.z=c,this}makePerspective(e,t,i,r,s,a,o=En,c=!1){const l=this.elements,f=2*s/(t-e),d=2*s/(i-r),u=(t+e)/(t-e),h=(i+r)/(i-r);let g,x;if(c)g=s/(a-s),x=a*s/(a-s);else if(o===En)g=-(a+s)/(a-s),x=-2*a*s/(a-s);else if(o===br)g=-a/(a-s),x=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=f,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=d,l[9]=h,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,r,s,a,o=En,c=!1){const l=this.elements,f=2/(t-e),d=2/(i-r),u=-(t+e)/(t-e),h=-(i+r)/(i-r);let g,x;if(c)g=1/(a-s),x=a/(a-s);else if(o===En)g=-2/(a-s),x=-(a+s)/(a-s);else if(o===br)g=-1/(a-s),x=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=f,l[4]=0,l[8]=0,l[12]=u,l[1]=0,l[5]=d,l[9]=0,l[13]=h,l[2]=0,l[6]=0,l[10]=g,l[14]=x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};Ts.prototype.isMatrix4=!0;let _t=Ts;const Di=new z,rn=new _t,Ud=new z(0,0,0),Nd=new z(1,1,1),Yn=new z,Nr=new z,$t=new z,Ac=new _t,Rc=new rr;class si{constructor(e=0,t=0,i=0,r=si.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],c=r[1],l=r[5],f=r[9],d=r[2],u=r[6],h=r[10];switch(t){case"XYZ":this._y=Math.asin(et(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-f,h),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(u,l),this._z=0);break;case"YXZ":this._x=Math.asin(-et(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(o,h),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(et(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,h),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-et(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,h),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(et(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-f,l),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(o,h));break;case"XZY":this._z=Math.asin(-et(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,l),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-f,h),this._y=0);break;default:Be("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Ac.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ac,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Rc.setFromEuler(this),this.setFromQuaternion(Rc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}si.DEFAULT_ORDER="XYZ";class eu{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Fd=0;const Cc=new z,Li=new rr,wn=new _t,Fr=new z,lr=new z,Od=new z,Bd=new rr,wc=new z(1,0,0),Pc=new z(0,1,0),Ic=new z(0,0,1),Dc={type:"added"},kd={type:"removed"},Ui={type:"childadded",child:null},Ks={type:"childremoved",child:null};class wt extends bi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Fd++}),this.uuid=Rr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=wt.DEFAULT_UP.clone();const e=new z,t=new si,i=new rr,r=new z(1,1,1);function s(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new _t},normalMatrix:{value:new Ve}}),this.matrix=new _t,this.matrixWorld=new _t,this.matrixAutoUpdate=wt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=wt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new eu,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Li.setFromAxisAngle(e,t),this.quaternion.multiply(Li),this}rotateOnWorldAxis(e,t){return Li.setFromAxisAngle(e,t),this.quaternion.premultiply(Li),this}rotateX(e){return this.rotateOnAxis(wc,e)}rotateY(e){return this.rotateOnAxis(Pc,e)}rotateZ(e){return this.rotateOnAxis(Ic,e)}translateOnAxis(e,t){return Cc.copy(e).applyQuaternion(this.quaternion),this.position.add(Cc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(wc,e)}translateY(e){return this.translateOnAxis(Pc,e)}translateZ(e){return this.translateOnAxis(Ic,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(wn.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Fr.copy(e):Fr.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),lr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?wn.lookAt(lr,Fr,this.up):wn.lookAt(Fr,lr,this.up),this.quaternion.setFromRotationMatrix(wn),r&&(wn.extractRotation(r.matrixWorld),Li.setFromRotationMatrix(wn),this.quaternion.premultiply(Li.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(it("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Dc),Ui.child=e,this.dispatchEvent(Ui),Ui.child=null):it("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(kd),Ks.child=e,this.dispatchEvent(Ks),Ks.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),wn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),wn.multiply(e.parent.matrixWorld)),e.applyMatrix4(wn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Dc),Ui.child=e,this.dispatchEvent(Ui),Ui.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(lr,e,Od),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(lr,Bd,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,r=e.z,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*i-s[8]*r,s[13]+=i-s[1]*t-s[5]*i-s[9]*r,s[14]+=r-s[2]*t-s[6]*i-s[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){const r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){const s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].updateWorldMatrix(!1,!0,i)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),this.static!==!1&&(r.static=this.static),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(o=>({...o})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,f=c.length;l<f;l++){const d=c[l];s(e.shapes,d)}else s(e.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(s(e.materials,this.material[c]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];r.animations.push(s(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),f=a(e.images),d=a(e.shapes),u=a(e.skeletons),h=a(e.animations),g=a(e.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),f.length>0&&(i.images=f),d.length>0&&(i.shapes=d),u.length>0&&(i.skeletons=u),h.length>0&&(i.animations=h),g.length>0&&(i.nodes=g)}return i.object=r,i;function a(o){const c=[];for(const l in o){const f=o[l];delete f.metadata,c.push(f)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}wt.DEFAULT_UP=new z(0,1,0);wt.DEFAULT_MATRIX_AUTO_UPDATE=!0;wt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Ct extends wt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const zd={type:"move"};class Zs{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ct,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ct,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new z,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new z),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ct,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new z,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new z,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const x of e.hand.values()){const m=t.getJointPose(x,i),p=this._getHandJoint(l,x);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const f=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],u=f.position.distanceTo(d.position),h=.02,g=.005;l.inputState.pinching&&u>h+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&u<=h-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(zd)))}return o!==null&&(o.visible=r!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Ct;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const tu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},$n={h:0,s:0,l:0},Or={h:0,s:0,l:0};function Js(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class Je{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Zt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,je.colorSpaceToWorking(this,t),this}setRGB(e,t,i,r=je.workingColorSpace){return this.r=e,this.g=t,this.b=i,je.colorSpaceToWorking(this,r),this}setHSL(e,t,i,r=je.workingColorSpace){if(e=Rd(e,1),t=et(t,0,1),i=et(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,a=2*i-s;this.r=Js(a,s,e+1/3),this.g=Js(a,s,e),this.b=Js(a,s,e-1/3)}return je.colorSpaceToWorking(this,r),this}setStyle(e,t=Zt){function i(s){s!==void 0&&parseFloat(s)<1&&Be("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:Be("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);Be("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Zt){const i=tu[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Be("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=kn(e.r),this.g=kn(e.g),this.b=kn(e.b),this}copyLinearToSRGB(e){return this.r=Ji(e.r),this.g=Ji(e.g),this.b=Ji(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Zt){return je.workingToColorSpace(Ft.copy(this),e),Math.round(et(Ft.r*255,0,255))*65536+Math.round(et(Ft.g*255,0,255))*256+Math.round(et(Ft.b*255,0,255))}getHexString(e=Zt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=je.workingColorSpace){je.workingToColorSpace(Ft.copy(this),t);const i=Ft.r,r=Ft.g,s=Ft.b,a=Math.max(i,r,s),o=Math.min(i,r,s);let c,l;const f=(o+a)/2;if(o===a)c=0,l=0;else{const d=a-o;switch(l=f<=.5?d/(a+o):d/(2-a-o),a){case i:c=(r-s)/d+(r<s?6:0);break;case r:c=(s-i)/d+2;break;case s:c=(i-r)/d+4;break}c/=6}return e.h=c,e.s=l,e.l=f,e}getRGB(e,t=je.workingColorSpace){return je.workingToColorSpace(Ft.copy(this),t),e.r=Ft.r,e.g=Ft.g,e.b=Ft.b,e}getStyle(e=Zt){je.workingToColorSpace(Ft.copy(this),e);const t=Ft.r,i=Ft.g,r=Ft.b;return e!==Zt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL($n),this.setHSL($n.h+e,$n.s+t,$n.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL($n),e.getHSL(Or);const i=Ws($n.h,Or.h,t),r=Ws($n.s,Or.s,t),s=Ws($n.l,Or.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ft=new Je;Je.NAMES=tu;class Uo{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Je(e),this.density=t}clone(){return new Uo(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Gd extends wt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new si,this.environmentIntensity=1,this.environmentRotation=new si,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const sn=new z,Pn=new z,Qs=new z,In=new z,Ni=new z,Fi=new z,Lc=new z,js=new z,ea=new z,ta=new z,na=new vt,ia=new vt,ra=new vt;class fn{constructor(e=new z,t=new z,i=new z){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),sn.subVectors(e,t),r.cross(sn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){sn.subVectors(r,t),Pn.subVectors(i,t),Qs.subVectors(e,t);const a=sn.dot(sn),o=sn.dot(Pn),c=sn.dot(Qs),l=Pn.dot(Pn),f=Pn.dot(Qs),d=a*l-o*o;if(d===0)return s.set(0,0,0),null;const u=1/d,h=(l*c-o*f)*u,g=(a*f-o*c)*u;return s.set(1-h-g,g,h)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,In)===null?!1:In.x>=0&&In.y>=0&&In.x+In.y<=1}static getInterpolation(e,t,i,r,s,a,o,c){return this.getBarycoord(e,t,i,r,In)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,In.x),c.addScaledVector(a,In.y),c.addScaledVector(o,In.z),c)}static getInterpolatedAttribute(e,t,i,r,s,a){return na.setScalar(0),ia.setScalar(0),ra.setScalar(0),na.fromBufferAttribute(e,t),ia.fromBufferAttribute(e,i),ra.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(na,s.x),a.addScaledVector(ia,s.y),a.addScaledVector(ra,s.z),a}static isFrontFacing(e,t,i,r){return sn.subVectors(i,t),Pn.subVectors(e,t),sn.cross(Pn).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return sn.subVectors(this.c,this.b),Pn.subVectors(this.a,this.b),sn.cross(Pn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return fn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return fn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return fn.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return fn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return fn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let a,o;Ni.subVectors(r,i),Fi.subVectors(s,i),js.subVectors(e,i);const c=Ni.dot(js),l=Fi.dot(js);if(c<=0&&l<=0)return t.copy(i);ea.subVectors(e,r);const f=Ni.dot(ea),d=Fi.dot(ea);if(f>=0&&d<=f)return t.copy(r);const u=c*d-f*l;if(u<=0&&c>=0&&f<=0)return a=c/(c-f),t.copy(i).addScaledVector(Ni,a);ta.subVectors(e,s);const h=Ni.dot(ta),g=Fi.dot(ta);if(g>=0&&h<=g)return t.copy(s);const x=h*l-c*g;if(x<=0&&l>=0&&g<=0)return o=l/(l-g),t.copy(i).addScaledVector(Fi,o);const m=f*g-h*d;if(m<=0&&d-f>=0&&h-g>=0)return Lc.subVectors(s,r),o=(d-f)/(d-f+(h-g)),t.copy(r).addScaledVector(Lc,o);const p=1/(m+x+u);return a=x*p,o=u*p,t.copy(i).addScaledVector(Ni,a).addScaledVector(Fi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Ti{constructor(e=new z(1/0,1/0,1/0),t=new z(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(an.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(an.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=an.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,an):an.fromBufferAttribute(s,a),an.applyMatrix4(e.matrixWorld),this.expandByPoint(an);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Br.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Br.copy(i.boundingBox)),Br.applyMatrix4(e.matrixWorld),this.union(Br)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,an),an.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ur),kr.subVectors(this.max,ur),Oi.subVectors(e.a,ur),Bi.subVectors(e.b,ur),ki.subVectors(e.c,ur),Kn.subVectors(Bi,Oi),Zn.subVectors(ki,Bi),ci.subVectors(Oi,ki);let t=[0,-Kn.z,Kn.y,0,-Zn.z,Zn.y,0,-ci.z,ci.y,Kn.z,0,-Kn.x,Zn.z,0,-Zn.x,ci.z,0,-ci.x,-Kn.y,Kn.x,0,-Zn.y,Zn.x,0,-ci.y,ci.x,0];return!sa(t,Oi,Bi,ki,kr)||(t=[1,0,0,0,1,0,0,0,1],!sa(t,Oi,Bi,ki,kr))?!1:(zr.crossVectors(Kn,Zn),t=[zr.x,zr.y,zr.z],sa(t,Oi,Bi,ki,kr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,an).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(an).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Dn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Dn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Dn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Dn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Dn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Dn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Dn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Dn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Dn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Dn=[new z,new z,new z,new z,new z,new z,new z,new z],an=new z,Br=new Ti,Oi=new z,Bi=new z,ki=new z,Kn=new z,Zn=new z,ci=new z,ur=new z,kr=new z,zr=new z,li=new z;function sa(n,e,t,i,r){for(let s=0,a=n.length-3;s<=a;s+=3){li.fromArray(n,s);const o=r.x*Math.abs(li.x)+r.y*Math.abs(li.y)+r.z*Math.abs(li.z),c=e.dot(li),l=t.dot(li),f=i.dot(li);if(Math.max(-Math.max(c,l,f),Math.min(c,l,f))>o)return!1}return!0}const Tt=new z,Gr=new tt;let Vd=0;class pn extends bi{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Vd++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=vc,this.updateRanges=[],this.gpuType=dn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Gr.fromBufferAttribute(this,t),Gr.applyMatrix3(e),this.setXY(t,Gr.x,Gr.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Tt.fromBufferAttribute(this,t),Tt.applyMatrix3(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Tt.fromBufferAttribute(this,t),Tt.applyMatrix4(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Tt.fromBufferAttribute(this,t),Tt.applyNormalMatrix(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Tt.fromBufferAttribute(this,t),Tt.transformDirection(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=cr(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Wt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=cr(t,this.array)),t}setX(e,t){return this.normalized&&(t=Wt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=cr(t,this.array)),t}setY(e,t){return this.normalized&&(t=Wt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=cr(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Wt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=cr(t,this.array)),t}setW(e,t){return this.normalized&&(t=Wt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Wt(t,this.array),i=Wt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=Wt(t,this.array),i=Wt(i,this.array),r=Wt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=Wt(t,this.array),i=Wt(i,this.array),r=Wt(r,this.array),s=Wt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==vc&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class nu extends pn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class iu extends pn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class Ht extends pn{constructor(e,t,i){super(new Float32Array(e),t,i)}}const Hd=new Ti,fr=new z,aa=new z;class Cr{constructor(e=new z,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Hd.setFromPoints(e).getCenter(i);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;fr.subVectors(e,this.center);const t=fr.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(fr,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(aa.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(fr.copy(e.center).add(aa)),this.expandByPoint(fr.copy(e.center).sub(aa))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let Wd=0;const nn=new _t,oa=new wt,zi=new z,Kt=new Ti,dr=new Ti,Dt=new z;class mn extends bi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Wd++}),this.uuid=Rr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Ed(e)?iu:nu)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Ve().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return nn.makeRotationFromQuaternion(e),this.applyMatrix4(nn),this}rotateX(e){return nn.makeRotationX(e),this.applyMatrix4(nn),this}rotateY(e){return nn.makeRotationY(e),this.applyMatrix4(nn),this}rotateZ(e){return nn.makeRotationZ(e),this.applyMatrix4(nn),this}translate(e,t,i){return nn.makeTranslation(e,t,i),this.applyMatrix4(nn),this}scale(e,t,i){return nn.makeScale(e,t,i),this.applyMatrix4(nn),this}lookAt(e){return oa.lookAt(e),oa.updateMatrix(),this.applyMatrix4(oa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(zi).negate(),this.translate(zi.x,zi.y,zi.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const a=e[r];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Ht(i,3))}else{const i=Math.min(e.length,t.count);for(let r=0;r<i;r++){const s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&Be("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ti);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){it("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new z(-1/0,-1/0,-1/0),new z(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];Kt.setFromBufferAttribute(s),this.morphTargetsRelative?(Dt.addVectors(this.boundingBox.min,Kt.min),this.boundingBox.expandByPoint(Dt),Dt.addVectors(this.boundingBox.max,Kt.max),this.boundingBox.expandByPoint(Dt)):(this.boundingBox.expandByPoint(Kt.min),this.boundingBox.expandByPoint(Kt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&it('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Cr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){it("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new z,1/0);return}if(e){const i=this.boundingSphere.center;if(Kt.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];dr.setFromBufferAttribute(o),this.morphTargetsRelative?(Dt.addVectors(Kt.min,dr.min),Kt.expandByPoint(Dt),Dt.addVectors(Kt.max,dr.max),Kt.expandByPoint(Dt)):(Kt.expandByPoint(dr.min),Kt.expandByPoint(dr.max))}Kt.getCenter(i);let r=0;for(let s=0,a=e.count;s<a;s++)Dt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Dt));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],c=this.morphTargetsRelative;for(let l=0,f=o.count;l<f;l++)Dt.fromBufferAttribute(o,l),c&&(zi.fromBufferAttribute(e,l),Dt.add(zi)),r=Math.max(r,i.distanceToSquared(Dt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&it('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){it("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,s=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==i.count)&&(a=new pn(new Float32Array(4*i.count),4),this.setAttribute("tangent",a));const o=[],c=[];for(let _=0;_<i.count;_++)o[_]=new z,c[_]=new z;const l=new z,f=new z,d=new z,u=new tt,h=new tt,g=new tt,x=new z,m=new z;function p(_,M,R){l.fromBufferAttribute(i,_),f.fromBufferAttribute(i,M),d.fromBufferAttribute(i,R),u.fromBufferAttribute(s,_),h.fromBufferAttribute(s,M),g.fromBufferAttribute(s,R),f.sub(l),d.sub(l),h.sub(u),g.sub(u);const C=1/(h.x*g.y-g.x*h.y);isFinite(C)&&(x.copy(f).multiplyScalar(g.y).addScaledVector(d,-h.y).multiplyScalar(C),m.copy(d).multiplyScalar(h.x).addScaledVector(f,-g.x).multiplyScalar(C),o[_].add(x),o[M].add(x),o[R].add(x),c[_].add(m),c[M].add(m),c[R].add(m))}let E=this.groups;E.length===0&&(E=[{start:0,count:e.count}]);for(let _=0,M=E.length;_<M;++_){const R=E[_],C=R.start,I=R.count;for(let O=C,V=C+I;O<V;O+=3)p(e.getX(O+0),e.getX(O+1),e.getX(O+2))}const A=new z,S=new z,T=new z,b=new z;function P(_){T.fromBufferAttribute(r,_),b.copy(T);const M=o[_];A.copy(M),A.sub(T.multiplyScalar(T.dot(M))).normalize(),S.crossVectors(b,M);const C=S.dot(c[_])<0?-1:1;a.setXYZW(_,A.x,A.y,A.z,C)}for(let _=0,M=E.length;_<M;++_){const R=E[_],C=R.start,I=R.count;for(let O=C,V=C+I;O<V;O+=3)P(e.getX(O+0)),P(e.getX(O+1)),P(e.getX(O+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new pn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let u=0,h=i.count;u<h;u++)i.setXYZ(u,0,0,0);const r=new z,s=new z,a=new z,o=new z,c=new z,l=new z,f=new z,d=new z;if(e)for(let u=0,h=e.count;u<h;u+=3){const g=e.getX(u+0),x=e.getX(u+1),m=e.getX(u+2);r.fromBufferAttribute(t,g),s.fromBufferAttribute(t,x),a.fromBufferAttribute(t,m),f.subVectors(a,s),d.subVectors(r,s),f.cross(d),o.fromBufferAttribute(i,g),c.fromBufferAttribute(i,x),l.fromBufferAttribute(i,m),o.add(f),c.add(f),l.add(f),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(x,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let u=0,h=t.count;u<h;u+=3)r.fromBufferAttribute(t,u+0),s.fromBufferAttribute(t,u+1),a.fromBufferAttribute(t,u+2),f.subVectors(a,s),d.subVectors(r,s),f.cross(d),i.setXYZ(u+0,f.x,f.y,f.z),i.setXYZ(u+1,f.x,f.y,f.z),i.setXYZ(u+2,f.x,f.y,f.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Dt.fromBufferAttribute(e,t),Dt.normalize(),e.setXYZ(t,Dt.x,Dt.y,Dt.z)}toNonIndexed(){function e(o,c){const l=o.array,f=o.itemSize,d=o.normalized,u=new l.constructor(c.length*f);let h=0,g=0;for(let x=0,m=c.length;x<m;x++){o.isInterleavedBufferAttribute?h=c[x]*o.data.stride+o.offset:h=c[x]*f;for(let p=0;p<f;p++)u[g++]=l[h++]}return new pn(u,f,d)}if(this.index===null)return Be("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new mn,i=this.index.array,r=this.attributes;for(const o in r){const c=r[o],l=e(c,i);t.setAttribute(o,l)}const s=this.morphAttributes;for(const o in s){const c=[],l=s[o];for(let f=0,d=l.length;f<d;f++){const u=l[f],h=e(u,i);c.push(h)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const c in i){const l=i[c];e.data.attributes[c]=l.toJSON(e.data)}const r={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],f=[];for(let d=0,u=l.length;d<u;d++){const h=l[d];f.push(h.toJSON(e.data))}f.length>0&&(r[c]=f,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const r=e.attributes;for(const l in r){const f=r[l];this.setAttribute(l,f.clone(t))}const s=e.morphAttributes;for(const l in s){const f=[],d=s[l];for(let u=0,h=d.length;u<h;u++)f.push(d[u].clone(t));this.morphAttributes[l]=f}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,f=a.length;l<f;l++){const d=a[l];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}let Xd=0;class wr extends bi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Xd++}),this.uuid=Rr(),this.name="",this.type="Material",this.blending=Ki,this.side=ri,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Aa,this.blendDst=Ra,this.blendEquation=hi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Je(0,0,0),this.blendAlpha=0,this.depthFunc=ji,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=xc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Pi,this.stencilZFail=Pi,this.stencilZPass=Pi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){Be(`Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){Be(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector2&&i&&i.isVector2||r&&r.isEuler&&i&&i.isEuler||r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Ki&&(i.blending=this.blending),this.side!==ri&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Aa&&(i.blendSrc=this.blendSrc),this.blendDst!==Ra&&(i.blendDst=this.blendDst),this.blendEquation!==hi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==ji&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==xc&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Pi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Pi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Pi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const a=[];for(const o in s){const c=s[o];delete c.metadata,a.push(c)}return a}if(t){const s=r(e.textures),a=r(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Je().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new tt().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new tt().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Ln=new z,ca=new z,Vr=new z,Jn=new z,la=new z,Hr=new z,ua=new z;class qd{constructor(e=new z,t=new z(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ln)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Ln.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ln.copy(this.origin).addScaledVector(this.direction,t),Ln.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){ca.copy(e).add(t).multiplyScalar(.5),Vr.copy(t).sub(e).normalize(),Jn.copy(this.origin).sub(ca);const s=e.distanceTo(t)*.5,a=-this.direction.dot(Vr),o=Jn.dot(this.direction),c=-Jn.dot(Vr),l=Jn.lengthSq(),f=Math.abs(1-a*a);let d,u,h,g;if(f>0)if(d=a*c-o,u=a*o-c,g=s*f,d>=0)if(u>=-g)if(u<=g){const x=1/f;d*=x,u*=x,h=d*(d+a*u+2*o)+u*(a*d+u+2*c)+l}else u=s,d=Math.max(0,-(a*u+o)),h=-d*d+u*(u+2*c)+l;else u=-s,d=Math.max(0,-(a*u+o)),h=-d*d+u*(u+2*c)+l;else u<=-g?(d=Math.max(0,-(-a*s+o)),u=d>0?-s:Math.min(Math.max(-s,-c),s),h=-d*d+u*(u+2*c)+l):u<=g?(d=0,u=Math.min(Math.max(-s,-c),s),h=u*(u+2*c)+l):(d=Math.max(0,-(a*s+o)),u=d>0?s:Math.min(Math.max(-s,-c),s),h=-d*d+u*(u+2*c)+l);else u=a>0?-s:s,d=Math.max(0,-(a*u+o)),h=-d*d+u*(u+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,d),r&&r.copy(ca).addScaledVector(Vr,u),h}intersectSphere(e,t){Ln.subVectors(e.center,this.origin);const i=Ln.dot(this.direction),r=Ln.dot(Ln)-i*i,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=i-a,c=i+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,a,o,c;const l=1/this.direction.x,f=1/this.direction.y,d=1/this.direction.z,u=this.origin;return l>=0?(i=(e.min.x-u.x)*l,r=(e.max.x-u.x)*l):(i=(e.max.x-u.x)*l,r=(e.min.x-u.x)*l),f>=0?(s=(e.min.y-u.y)*f,a=(e.max.y-u.y)*f):(s=(e.max.y-u.y)*f,a=(e.min.y-u.y)*f),i>a||s>r||((s>i||isNaN(i))&&(i=s),(a<r||isNaN(r))&&(r=a),d>=0?(o=(e.min.z-u.z)*d,c=(e.max.z-u.z)*d):(o=(e.max.z-u.z)*d,c=(e.min.z-u.z)*d),i>c||o>r)||((o>i||i!==i)&&(i=o),(c<r||r!==r)&&(r=c),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,Ln)!==null}intersectTriangle(e,t,i,r,s){la.subVectors(t,e),Hr.subVectors(i,e),ua.crossVectors(la,Hr);let a=this.direction.dot(ua),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Jn.subVectors(this.origin,e);const c=o*this.direction.dot(Hr.crossVectors(Jn,Hr));if(c<0)return null;const l=o*this.direction.dot(la.cross(Jn));if(l<0||c+l>a)return null;const f=-o*Jn.dot(ua);return f<0?null:this.at(f/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ru extends wr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Je(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new si,this.combine=Bl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Uc=new _t,ui=new qd,Wr=new Cr,Nc=new z,Xr=new z,qr=new z,Yr=new z,fa=new z,$r=new z,Fc=new z,Kr=new z;class ft extends wt{constructor(e=new mn,t=new ru){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){$r.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const f=o[c],d=s[c];f!==0&&(fa.fromBufferAttribute(d,e),a?$r.addScaledVector(fa,f):$r.addScaledVector(fa.sub(t),f))}t.add($r)}return t}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Wr.copy(i.boundingSphere),Wr.applyMatrix4(s),ui.copy(e.ray).recast(e.near),!(Wr.containsPoint(ui.origin)===!1&&(ui.intersectSphere(Wr,Nc)===null||ui.origin.distanceToSquared(Nc)>(e.far-e.near)**2))&&(Uc.copy(s).invert(),ui.copy(e.ray).applyMatrix4(Uc),!(i.boundingBox!==null&&ui.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,ui)))}_computeIntersections(e,t,i){let r;const s=this.geometry,a=this.material,o=s.index,c=s.attributes.position,l=s.attributes.uv,f=s.attributes.uv1,d=s.attributes.normal,u=s.groups,h=s.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,x=u.length;g<x;g++){const m=u[g],p=a[m.materialIndex],E=Math.max(m.start,h.start),A=Math.min(o.count,Math.min(m.start+m.count,h.start+h.count));for(let S=E,T=A;S<T;S+=3){const b=o.getX(S),P=o.getX(S+1),_=o.getX(S+2);r=Zr(this,p,e,i,l,f,d,b,P,_),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,h.start),x=Math.min(o.count,h.start+h.count);for(let m=g,p=x;m<p;m+=3){const E=o.getX(m),A=o.getX(m+1),S=o.getX(m+2);r=Zr(this,a,e,i,l,f,d,E,A,S),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,x=u.length;g<x;g++){const m=u[g],p=a[m.materialIndex],E=Math.max(m.start,h.start),A=Math.min(c.count,Math.min(m.start+m.count,h.start+h.count));for(let S=E,T=A;S<T;S+=3){const b=S,P=S+1,_=S+2;r=Zr(this,p,e,i,l,f,d,b,P,_),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,h.start),x=Math.min(c.count,h.start+h.count);for(let m=g,p=x;m<p;m+=3){const E=m,A=m+1,S=m+2;r=Zr(this,a,e,i,l,f,d,E,A,S),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}}function Yd(n,e,t,i,r,s,a,o){let c;if(e.side===Xt?c=i.intersectTriangle(a,s,r,!0,o):c=i.intersectTriangle(r,s,a,e.side===ri,o),c===null)return null;Kr.copy(o),Kr.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(Kr);return l<t.near||l>t.far?null:{distance:l,point:Kr.clone(),object:n}}function Zr(n,e,t,i,r,s,a,o,c,l){n.getVertexPosition(o,Xr),n.getVertexPosition(c,qr),n.getVertexPosition(l,Yr);const f=Yd(n,e,t,i,Xr,qr,Yr,Fc);if(f){const d=new z;fn.getBarycoord(Fc,Xr,qr,Yr,d),r&&(f.uv=fn.getInterpolatedAttribute(r,o,c,l,d,new tt)),s&&(f.uv1=fn.getInterpolatedAttribute(s,o,c,l,d,new tt)),a&&(f.normal=fn.getInterpolatedAttribute(a,o,c,l,d,new z),f.normal.dot(i.direction)>0&&f.normal.multiplyScalar(-1));const u={a:o,b:c,c:l,normal:new z,materialIndex:0};fn.getNormal(Xr,qr,Yr,u.normal),f.face=u,f.barycoord=d}return f}class su extends Vt{constructor(e=null,t=1,i=1,r,s,a,o,c,l=Lt,f=Lt,d,u){super(null,a,o,c,l,f,r,s,d,u),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Oc extends pn{constructor(e,t,i,r=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Gi=new _t,Bc=new _t,Jr=[],kc=new Ti,$d=new _t,hr=new ft,pr=new Cr;class on extends ft{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Oc(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<i;r++)this.setMatrixAt(r,$d)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Ti),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Gi),kc.copy(e.boundingBox).applyMatrix4(Gi),this.boundingBox.union(kc)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Cr),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Gi),pr.copy(e.boundingSphere).applyMatrix4(Gi),this.boundingSphere.union(pr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,r=this.morphTexture.source.data.data,s=i.length+1,a=e*s+1;for(let o=0;o<i.length;o++)i[o]=r[a+o]}raycast(e,t){const i=this.matrixWorld,r=this.count;if(hr.geometry=this.geometry,hr.material=this.material,hr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),pr.copy(this.boundingSphere),pr.applyMatrix4(i),e.ray.intersectsSphere(pr)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,Gi),Bc.multiplyMatrices(i,Gi),hr.matrixWorld=Bc,hr.raycast(e,Jr);for(let a=0,o=Jr.length;a<o;a++){const c=Jr[a];c.instanceId=s,c.object=this,t.push(c)}Jr.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Oc(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){const i=t.morphTargetInfluences,r=i.length+1;this.morphTexture===null&&(this.morphTexture=new su(new Float32Array(r*this.count),r,this.count,Ro,dn));const s=this.morphTexture.source.data.data;let a=0;for(let l=0;l<i.length;l++)a+=i[l];const o=this.geometry.morphTargetsRelative?1:1-a,c=r*e;return s[c]=o,s.set(i,c+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const da=new z,Kd=new z,Zd=new Ve;class di{constructor(e=new z(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=da.subVectors(i,t).cross(Kd.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const r=e.delta(da),s=this.normal.dot(r);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/s;return i===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||Zd.getNormalMatrix(e),r=this.coplanarPoint(da).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const fi=new Cr,Jd=new tt(.5,.5),Qr=new z;class No{constructor(e=new di,t=new di,i=new di,r=new di,s=new di,a=new di){this.planes=[e,t,i,r,s,a]}set(e,t,i,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=En,i=!1){const r=this.planes,s=e.elements,a=s[0],o=s[1],c=s[2],l=s[3],f=s[4],d=s[5],u=s[6],h=s[7],g=s[8],x=s[9],m=s[10],p=s[11],E=s[12],A=s[13],S=s[14],T=s[15];if(r[0].setComponents(l-a,h-f,p-g,T-E).normalize(),r[1].setComponents(l+a,h+f,p+g,T+E).normalize(),r[2].setComponents(l+o,h+d,p+x,T+A).normalize(),r[3].setComponents(l-o,h-d,p-x,T-A).normalize(),i)r[4].setComponents(c,u,m,S).normalize(),r[5].setComponents(l-c,h-u,p-m,T-S).normalize();else if(r[4].setComponents(l-c,h-u,p-m,T-S).normalize(),t===En)r[5].setComponents(l+c,h+u,p+m,T+S).normalize();else if(t===br)r[5].setComponents(c,u,m,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),fi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),fi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(fi)}intersectsSprite(e){fi.center.set(0,0,0);const t=Jd.distanceTo(e.center);return fi.radius=.7071067811865476+t,fi.applyMatrix4(e.matrixWorld),this.intersectsSphere(fi)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(Qr.x=r.normal.x>0?e.max.x:e.min.x,Qr.y=r.normal.y>0?e.max.y:e.min.y,Qr.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Qr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class au extends Vt{constructor(e=[],t=Si,i,r,s,a,o,c,l,f){super(e,t,i,r,s,a,o,c,l,f),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class tr extends Vt{constructor(e,t,i=An,r,s,a,o=Lt,c=Lt,l,f=Hn,d=1){if(f!==Hn&&f!==gi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:e,height:t,depth:d};super(u,r,s,a,o,c,f,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Lo(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Qd extends tr{constructor(e,t=An,i=Si,r,s,a=Lt,o=Lt,c,l=Hn){const f={width:e,height:e,depth:1},d=[f,f,f,f,f,f];super(e,e,t,i,r,s,a,o,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class ou extends Vt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Qt extends mn{constructor(e=1,t=1,i=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const c=[],l=[],f=[],d=[];let u=0,h=0;g("z","y","x",-1,-1,i,t,e,a,s,0),g("z","y","x",1,-1,i,t,-e,a,s,1),g("x","z","y",1,1,e,i,t,r,a,2),g("x","z","y",1,-1,e,i,-t,r,a,3),g("x","y","z",1,-1,e,t,i,r,s,4),g("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(c),this.setAttribute("position",new Ht(l,3)),this.setAttribute("normal",new Ht(f,3)),this.setAttribute("uv",new Ht(d,2));function g(x,m,p,E,A,S,T,b,P,_,M){const R=S/P,C=T/_,I=S/2,O=T/2,V=b/2,D=P+1,H=_+1;let F=0,k=0;const J=new z;for(let ne=0;ne<H;ne++){const se=ne*C-O;for(let me=0;me<D;me++){const Pe=me*R-I;J[x]=Pe*E,J[m]=se*A,J[p]=V,l.push(J.x,J.y,J.z),J[x]=0,J[m]=0,J[p]=b>0?1:-1,f.push(J.x,J.y,J.z),d.push(me/P),d.push(1-ne/_),F+=1}}for(let ne=0;ne<_;ne++)for(let se=0;se<P;se++){const me=u+se+D*ne,Pe=u+se+D*(ne+1),Te=u+(se+1)+D*(ne+1),We=u+(se+1)+D*ne;c.push(me,Pe,We),c.push(Pe,Te,We),k+=6}o.addGroup(h,k,M),h+=k,u+=F}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Qt(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Ei extends mn{constructor(e=1,t=1,i=1,r=32,s=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:r,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:c};const l=this;r=Math.floor(r),s=Math.floor(s);const f=[],d=[],u=[],h=[];let g=0;const x=[],m=i/2;let p=0;E(),a===!1&&(e>0&&A(!0),t>0&&A(!1)),this.setIndex(f),this.setAttribute("position",new Ht(d,3)),this.setAttribute("normal",new Ht(u,3)),this.setAttribute("uv",new Ht(h,2));function E(){const S=new z,T=new z;let b=0;const P=(t-e)/i;for(let _=0;_<=s;_++){const M=[],R=_/s,C=R*(t-e)+e;for(let I=0;I<=r;I++){const O=I/r,V=O*c+o,D=Math.sin(V),H=Math.cos(V);T.x=C*D,T.y=-R*i+m,T.z=C*H,d.push(T.x,T.y,T.z),S.set(D,P,H).normalize(),u.push(S.x,S.y,S.z),h.push(O,1-R),M.push(g++)}x.push(M)}for(let _=0;_<r;_++)for(let M=0;M<s;M++){const R=x[M][_],C=x[M+1][_],I=x[M+1][_+1],O=x[M][_+1];(e>0||M!==0)&&(f.push(R,C,O),b+=3),(t>0||M!==s-1)&&(f.push(C,I,O),b+=3)}l.addGroup(p,b,0),p+=b}function A(S){const T=g,b=new tt,P=new z;let _=0;const M=S===!0?e:t,R=S===!0?1:-1;for(let I=1;I<=r;I++)d.push(0,m*R,0),u.push(0,R,0),h.push(.5,.5),g++;const C=g;for(let I=0;I<=r;I++){const V=I/r*c+o,D=Math.cos(V),H=Math.sin(V);P.x=M*H,P.y=m*R,P.z=M*D,d.push(P.x,P.y,P.z),u.push(0,R,0),b.x=D*.5+.5,b.y=H*.5*R+.5,h.push(b.x,b.y),g++}for(let I=0;I<r;I++){const O=T+I,V=C+I;S===!0?f.push(V,V+1,O):f.push(V+1,V,O),_+=3}l.addGroup(p,_,S===!0?1:2),p+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ei(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Fo extends Ei{constructor(e=1,t=1,i=32,r=1,s=!1,a=0,o=Math.PI*2){super(0,e,t,i,r,s,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:r,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(e){return new Fo(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Is extends mn{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,a=t/2,o=Math.floor(i),c=Math.floor(r),l=o+1,f=c+1,d=e/o,u=t/c,h=[],g=[],x=[],m=[];for(let p=0;p<f;p++){const E=p*u-a;for(let A=0;A<l;A++){const S=A*d-s;g.push(S,-E,0),x.push(0,0,1),m.push(A/o),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let E=0;E<o;E++){const A=E+l*p,S=E+l*(p+1),T=E+1+l*(p+1),b=E+1+l*p;h.push(A,S,b),h.push(S,T,b)}this.setIndex(h),this.setAttribute("position",new Ht(g,3)),this.setAttribute("normal",new Ht(x,3)),this.setAttribute("uv",new Ht(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Is(e.width,e.height,e.widthSegments,e.heightSegments)}}class ai extends mn{constructor(e=1,t=32,i=16,r=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const c=Math.min(a+o,Math.PI);let l=0;const f=[],d=new z,u=new z,h=[],g=[],x=[],m=[];for(let p=0;p<=i;p++){const E=[],A=p/i,S=a+A*o,T=e*Math.cos(S),b=Math.sqrt(e*e-T*T);let P=0;p===0&&a===0?P=.5/t:p===i&&c===Math.PI&&(P=-.5/t);for(let _=0;_<=t;_++){const M=_/t,R=r+M*s;d.x=-b*Math.cos(R),d.y=T,d.z=b*Math.sin(R),g.push(d.x,d.y,d.z),u.copy(d).normalize(),x.push(u.x,u.y,u.z),m.push(M+P,1-A),E.push(l++)}f.push(E)}for(let p=0;p<i;p++)for(let E=0;E<t;E++){const A=f[p][E+1],S=f[p][E],T=f[p+1][E],b=f[p+1][E+1];(p!==0||a>0)&&h.push(A,S,b),(p!==i-1||c<Math.PI)&&h.push(S,T,b)}this.setIndex(h),this.setAttribute("position",new Ht(g,3)),this.setAttribute("normal",new Ht(x,3)),this.setAttribute("uv",new Ht(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ai(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}function nr(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];if(zc(r))r.isRenderTargetTexture?(Be("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone();else if(Array.isArray(r))if(zc(r[0])){const s=[];for(let a=0,o=r.length;a<o;a++)s[a]=r[a].clone();e[t][i]=s}else e[t][i]=r.slice();else e[t][i]=r}}return e}function zt(n){const e={};for(let t=0;t<n.length;t++){const i=nr(n[t]);for(const r in i)e[r]=i[r]}return e}function zc(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function jd(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function cu(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:je.workingColorSpace}const eh={clone:nr,merge:zt};var th=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,nh=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Rn extends wr{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=th,this.fragmentShader=nh,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=nr(e.uniforms),this.uniformsGroups=jd(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?t.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[r]={type:"m4",value:a.toArray()}:t.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const i in e.uniforms){const r=e.uniforms[i];switch(this.uniforms[i]={},r.type){case"t":this.uniforms[i].value=t[r.value]||null;break;case"c":this.uniforms[i].value=new Je().setHex(r.value);break;case"v2":this.uniforms[i].value=new tt().fromArray(r.value);break;case"v3":this.uniforms[i].value=new z().fromArray(r.value);break;case"v4":this.uniforms[i].value=new vt().fromArray(r.value);break;case"m3":this.uniforms[i].value=new Ve().fromArray(r.value);break;case"m4":this.uniforms[i].value=new _t().fromArray(r.value);break;default:this.uniforms[i].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class ih extends Rn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class cn extends wr{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Je(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Je(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=po,this.normalScale=new tt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new si,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class rh extends wr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=md,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class sh extends wr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Oo extends wt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Je(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class ah extends Oo{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(wt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Je(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const ha=new _t,Gc=new z,Vc=new z;class oh{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new tt(512,512),this.mapType=Jt,this.map=null,this.mapPass=null,this.matrix=new _t,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new No,this._frameExtents=new tt(1,1),this._viewportCount=1,this._viewports=[new vt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;Gc.setFromMatrixPosition(e.matrixWorld),t.position.copy(Gc),Vc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Vc),t.updateMatrixWorld(),ha.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ha,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===br||t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(ha)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const jr=new z,es=new rr,vn=new z;class lu extends wt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new _t,this.projectionMatrix=new _t,this.projectionMatrixInverse=new _t,this.coordinateSystem=En,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(jr,es,vn),vn.x===1&&vn.y===1&&vn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(jr,es,vn.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(jr,es,vn),vn.x===1&&vn.y===1&&vn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(jr,es,vn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Qn=new z,Hc=new tt,Wc=new tt;class un extends lu{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=mo*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Hs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return mo*2*Math.atan(Math.tan(Hs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Qn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Qn.x,Qn.y).multiplyScalar(-e/Qn.z),Qn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Qn.x,Qn.y).multiplyScalar(-e/Qn.z)}getViewSize(e,t){return this.getViewBounds(e,Hc,Wc),t.subVectors(Wc,Hc)}setViewOffset(e,t,i,r,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Hs*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;s+=a.offsetX*r/c,t-=a.offsetY*i/l,r*=a.width/c,i*=a.height/l}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class Ds extends lu{constructor(e=-1,t=1,i=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,a=i+e,o=r+t,c=r-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,f=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,a=s+l*this.view.width,o-=f*this.view.offsetY,c=o-f*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class ch extends oh{constructor(){super(new Ds(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class pa extends Oo{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(wt.DEFAULT_UP),this.updateMatrix(),this.target=new wt,this.shadow=new ch}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class lh extends Oo{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}const Vi=-90,Hi=1;class uh extends wt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new un(Vi,Hi,e,t);r.layers=this.layers,this.add(r);const s=new un(Vi,Hi,e,t);s.layers=this.layers,this.add(s);const a=new un(Vi,Hi,e,t);a.layers=this.layers,this.add(a);const o=new un(Vi,Hi,e,t);o.layers=this.layers,this.add(o);const c=new un(Vi,Hi,e,t);c.layers=this.layers,this.add(c);const l=new un(Vi,Hi,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,s,a,o,c]=t;for(const l of t)this.remove(l);if(e===En)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===br)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,c,l,f]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),h=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(i,0,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(i,1,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,2,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,3,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(i,4,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),i.texture.generateMipmaps=x,e.setRenderTarget(i,5,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,f),e.setRenderTarget(d,u,h),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class fh extends un{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const Vo=class Vo{constructor(e,t,i,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,r){const s=this.elements;return s[0]=e,s[2]=t,s[1]=i,s[3]=r,this}};Vo.prototype.isMatrix2=!0;let Xc=Vo;function qc(n,e,t,i){const r=dh(i);switch(t){case Zl:return n*e;case Ro:return n*e/r.components*r.byteLength;case Co:return n*e/r.components*r.byteLength;case yi:return n*e*2/r.components*r.byteLength;case wo:return n*e*2/r.components*r.byteLength;case Jl:return n*e*3/r.components*r.byteLength;case hn:return n*e*4/r.components*r.byteLength;case Po:return n*e*4/r.components*r.byteLength;case fs:case ds:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case hs:case ps:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Ba:case za:return Math.max(n,16)*Math.max(e,8)/4;case Oa:case ka:return Math.max(n,8)*Math.max(e,8)/2;case Ga:case Va:case Wa:case Xa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Ha:case xs:case qa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Ya:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case $a:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Ka:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Za:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Ja:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Qa:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case ja:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case eo:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case to:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case no:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case io:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case ro:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case so:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case ao:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case oo:case co:case lo:return Math.ceil(n/4)*Math.ceil(e/4)*16;case uo:case fo:return Math.ceil(n/4)*Math.ceil(e/4)*8;case vs:case ho:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function dh(n){switch(n){case Jt:case ql:return{byteLength:1,components:1};case yr:case Yl:case Vn:return{byteLength:2,components:1};case To:case Ao:return{byteLength:2,components:4};case An:case bo:case dn:return{byteLength:4,components:1};case $l:case Kl:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:yo}}));typeof window<"u"&&(window.__THREE__?Be("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=yo);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function uu(){let n=null,e=!1,t=null,i=null;function r(s,a){t(s,a),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function hh(n){const e=new WeakMap;function t(o,c){const l=o.array,f=o.usage,d=l.byteLength,u=n.createBuffer();n.bindBuffer(c,u),n.bufferData(c,l,f),o.onUploadCallback();let h;if(l instanceof Float32Array)h=n.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)h=n.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?h=n.HALF_FLOAT:h=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)h=n.SHORT;else if(l instanceof Uint32Array)h=n.UNSIGNED_INT;else if(l instanceof Int32Array)h=n.INT;else if(l instanceof Int8Array)h=n.BYTE;else if(l instanceof Uint8Array)h=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)h=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:u,type:h,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:d}}function i(o,c,l){const f=c.array,d=c.updateRanges;if(n.bindBuffer(l,o),d.length===0)n.bufferSubData(l,0,f);else{d.sort((h,g)=>h.start-g.start);let u=0;for(let h=1;h<d.length;h++){const g=d[u],x=d[h];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++u,d[u]=x)}d.length=u+1;for(let h=0,g=d.length;h<g;h++){const x=d[h];n.bufferSubData(l,x.start*f.BYTES_PER_ELEMENT,f,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(n.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const f=e.get(o);(!f||f.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,o,c),l.version=o.version}}return{get:r,remove:s,update:a}}var ph=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,mh=`#ifdef USE_ALPHAHASH
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
#endif`,gh=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,_h=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,xh=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,vh=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Mh=`#ifdef USE_AOMAP
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
#endif`,Sh=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,yh=`#ifdef USE_BATCHING
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
#endif`,Eh=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,bh=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Th=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ah=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Rh=`#ifdef USE_IRIDESCENCE
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
#endif`,Ch=`#ifdef USE_BUMPMAP
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
#endif`,wh=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Ph=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ih=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Dh=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Lh=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Uh=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Nh=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Fh=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Oh=`#define PI 3.141592653589793
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
} // validated`,Bh=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,kh=`vec3 transformedNormal = objectNormal;
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
#endif`,zh=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Gh=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Vh=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Hh=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Wh="gl_FragColor = linearToOutputTexel( gl_FragColor );",Xh=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,qh=`#ifdef USE_ENVMAP
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
#endif`,Yh=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,$h=`#ifdef USE_ENVMAP
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
#endif`,Kh=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Zh=`#ifdef USE_ENVMAP
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
#endif`,Jh=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Qh=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,jh=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ep=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,tp=`#ifdef USE_GRADIENTMAP
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
}`,np=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ip=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,rp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,sp=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,ap=`#ifdef USE_ENVMAP
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
#endif`,op=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,cp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,up=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,fp=`PhysicalMaterial material;
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
#endif`,dp=`uniform sampler2D dfgLUT;
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
}`,hp=`
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
#endif`,pp=`#if defined( RE_IndirectDiffuse )
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
#endif`,mp=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,gp=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,_p=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,xp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,vp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Mp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Sp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,yp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Ep=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,bp=`#if defined( USE_POINTS_UV )
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
#endif`,Tp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Ap=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Rp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Cp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,wp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Pp=`#ifdef USE_MORPHTARGETS
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
#endif`,Ip=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Dp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Lp=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Up=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Np=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Fp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Op=`#ifdef USE_NORMALMAP
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
#endif`,Bp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,kp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,zp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Gp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Vp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Hp=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Wp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Xp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,qp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Yp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,$p=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Kp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Zp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Jp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Qp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,jp=`float getShadowMask() {
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
}`,em=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,tm=`#ifdef USE_SKINNING
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
#endif`,nm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,im=`#ifdef USE_SKINNING
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
#endif`,rm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,sm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,am=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,om=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,cm=`#ifdef USE_TRANSMISSION
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
#endif`,lm=`#ifdef USE_TRANSMISSION
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
#endif`,um=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,fm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,dm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,hm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const pm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,mm=`uniform sampler2D t2D;
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
}`,gm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,_m=`#ifdef ENVMAP_TYPE_CUBE
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
}`,xm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,vm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Mm=`#include <common>
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
}`,Sm=`#if DEPTH_PACKING == 3200
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
}`,ym=`#define DISTANCE
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
}`,Em=`#define DISTANCE
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
}`,bm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Tm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Am=`uniform float scale;
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
}`,Rm=`uniform vec3 diffuse;
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
}`,Cm=`#include <common>
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
}`,wm=`uniform vec3 diffuse;
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
}`,Pm=`#define LAMBERT
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
}`,Im=`#define LAMBERT
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
}`,Dm=`#define MATCAP
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
}`,Lm=`#define MATCAP
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
}`,Um=`#define NORMAL
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
}`,Nm=`#define NORMAL
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
}`,Fm=`#define PHONG
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
}`,Om=`#define PHONG
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
}`,Bm=`#define STANDARD
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
}`,km=`#define STANDARD
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
}`,zm=`#define TOON
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
}`,Gm=`#define TOON
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
}`,Vm=`uniform float size;
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
}`,Hm=`uniform vec3 diffuse;
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
}`,Wm=`#include <common>
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
}`,Xm=`uniform vec3 color;
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
}`,qm=`uniform float rotation;
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
}`,Ym=`uniform vec3 diffuse;
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
}`,Ye={alphahash_fragment:ph,alphahash_pars_fragment:mh,alphamap_fragment:gh,alphamap_pars_fragment:_h,alphatest_fragment:xh,alphatest_pars_fragment:vh,aomap_fragment:Mh,aomap_pars_fragment:Sh,batching_pars_vertex:yh,batching_vertex:Eh,begin_vertex:bh,beginnormal_vertex:Th,bsdfs:Ah,iridescence_fragment:Rh,bumpmap_pars_fragment:Ch,clipping_planes_fragment:wh,clipping_planes_pars_fragment:Ph,clipping_planes_pars_vertex:Ih,clipping_planes_vertex:Dh,color_fragment:Lh,color_pars_fragment:Uh,color_pars_vertex:Nh,color_vertex:Fh,common:Oh,cube_uv_reflection_fragment:Bh,defaultnormal_vertex:kh,displacementmap_pars_vertex:zh,displacementmap_vertex:Gh,emissivemap_fragment:Vh,emissivemap_pars_fragment:Hh,colorspace_fragment:Wh,colorspace_pars_fragment:Xh,envmap_fragment:qh,envmap_common_pars_fragment:Yh,envmap_pars_fragment:$h,envmap_pars_vertex:Kh,envmap_physical_pars_fragment:ap,envmap_vertex:Zh,fog_vertex:Jh,fog_pars_vertex:Qh,fog_fragment:jh,fog_pars_fragment:ep,gradientmap_pars_fragment:tp,lightmap_pars_fragment:np,lights_lambert_fragment:ip,lights_lambert_pars_fragment:rp,lights_pars_begin:sp,lights_toon_fragment:op,lights_toon_pars_fragment:cp,lights_phong_fragment:lp,lights_phong_pars_fragment:up,lights_physical_fragment:fp,lights_physical_pars_fragment:dp,lights_fragment_begin:hp,lights_fragment_maps:pp,lights_fragment_end:mp,lightprobes_pars_fragment:gp,logdepthbuf_fragment:_p,logdepthbuf_pars_fragment:xp,logdepthbuf_pars_vertex:vp,logdepthbuf_vertex:Mp,map_fragment:Sp,map_pars_fragment:yp,map_particle_fragment:Ep,map_particle_pars_fragment:bp,metalnessmap_fragment:Tp,metalnessmap_pars_fragment:Ap,morphinstance_vertex:Rp,morphcolor_vertex:Cp,morphnormal_vertex:wp,morphtarget_pars_vertex:Pp,morphtarget_vertex:Ip,normal_fragment_begin:Dp,normal_fragment_maps:Lp,normal_pars_fragment:Up,normal_pars_vertex:Np,normal_vertex:Fp,normalmap_pars_fragment:Op,clearcoat_normal_fragment_begin:Bp,clearcoat_normal_fragment_maps:kp,clearcoat_pars_fragment:zp,iridescence_pars_fragment:Gp,opaque_fragment:Vp,packing:Hp,premultiplied_alpha_fragment:Wp,project_vertex:Xp,dithering_fragment:qp,dithering_pars_fragment:Yp,roughnessmap_fragment:$p,roughnessmap_pars_fragment:Kp,shadowmap_pars_fragment:Zp,shadowmap_pars_vertex:Jp,shadowmap_vertex:Qp,shadowmask_pars_fragment:jp,skinbase_vertex:em,skinning_pars_vertex:tm,skinning_vertex:nm,skinnormal_vertex:im,specularmap_fragment:rm,specularmap_pars_fragment:sm,tonemapping_fragment:am,tonemapping_pars_fragment:om,transmission_fragment:cm,transmission_pars_fragment:lm,uv_pars_fragment:um,uv_pars_vertex:fm,uv_vertex:dm,worldpos_vertex:hm,background_vert:pm,background_frag:mm,backgroundCube_vert:gm,backgroundCube_frag:_m,cube_vert:xm,cube_frag:vm,depth_vert:Mm,depth_frag:Sm,distance_vert:ym,distance_frag:Em,equirect_vert:bm,equirect_frag:Tm,linedashed_vert:Am,linedashed_frag:Rm,meshbasic_vert:Cm,meshbasic_frag:wm,meshlambert_vert:Pm,meshlambert_frag:Im,meshmatcap_vert:Dm,meshmatcap_frag:Lm,meshnormal_vert:Um,meshnormal_frag:Nm,meshphong_vert:Fm,meshphong_frag:Om,meshphysical_vert:Bm,meshphysical_frag:km,meshtoon_vert:zm,meshtoon_frag:Gm,points_vert:Vm,points_frag:Hm,shadow_vert:Wm,shadow_frag:Xm,sprite_vert:qm,sprite_frag:Ym},ge={common:{diffuse:{value:new Je(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ve}},envmap:{envMap:{value:null},envMapRotation:{value:new Ve},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ve}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ve}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ve},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ve},normalScale:{value:new tt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ve},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ve}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ve}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ve}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Je(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new z},probesMax:{value:new z},probesResolution:{value:new z}},points:{diffuse:{value:new Je(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0},uvTransform:{value:new Ve}},sprite:{diffuse:{value:new Je(16777215)},opacity:{value:1},center:{value:new tt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}}},yn={basic:{uniforms:zt([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.fog]),vertexShader:Ye.meshbasic_vert,fragmentShader:Ye.meshbasic_frag},lambert:{uniforms:zt([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,ge.lights,{emissive:{value:new Je(0)},envMapIntensity:{value:1}}]),vertexShader:Ye.meshlambert_vert,fragmentShader:Ye.meshlambert_frag},phong:{uniforms:zt([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,ge.lights,{emissive:{value:new Je(0)},specular:{value:new Je(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ye.meshphong_vert,fragmentShader:Ye.meshphong_frag},standard:{uniforms:zt([ge.common,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.roughnessmap,ge.metalnessmap,ge.fog,ge.lights,{emissive:{value:new Je(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ye.meshphysical_vert,fragmentShader:Ye.meshphysical_frag},toon:{uniforms:zt([ge.common,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.gradientmap,ge.fog,ge.lights,{emissive:{value:new Je(0)}}]),vertexShader:Ye.meshtoon_vert,fragmentShader:Ye.meshtoon_frag},matcap:{uniforms:zt([ge.common,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,{matcap:{value:null}}]),vertexShader:Ye.meshmatcap_vert,fragmentShader:Ye.meshmatcap_frag},points:{uniforms:zt([ge.points,ge.fog]),vertexShader:Ye.points_vert,fragmentShader:Ye.points_frag},dashed:{uniforms:zt([ge.common,ge.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ye.linedashed_vert,fragmentShader:Ye.linedashed_frag},depth:{uniforms:zt([ge.common,ge.displacementmap]),vertexShader:Ye.depth_vert,fragmentShader:Ye.depth_frag},normal:{uniforms:zt([ge.common,ge.bumpmap,ge.normalmap,ge.displacementmap,{opacity:{value:1}}]),vertexShader:Ye.meshnormal_vert,fragmentShader:Ye.meshnormal_frag},sprite:{uniforms:zt([ge.sprite,ge.fog]),vertexShader:Ye.sprite_vert,fragmentShader:Ye.sprite_frag},background:{uniforms:{uvTransform:{value:new Ve},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ye.background_vert,fragmentShader:Ye.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ve}},vertexShader:Ye.backgroundCube_vert,fragmentShader:Ye.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ye.cube_vert,fragmentShader:Ye.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ye.equirect_vert,fragmentShader:Ye.equirect_frag},distance:{uniforms:zt([ge.common,ge.displacementmap,{referencePosition:{value:new z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ye.distance_vert,fragmentShader:Ye.distance_frag},shadow:{uniforms:zt([ge.lights,ge.fog,{color:{value:new Je(0)},opacity:{value:1}}]),vertexShader:Ye.shadow_vert,fragmentShader:Ye.shadow_frag}};yn.physical={uniforms:zt([yn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ve},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ve},clearcoatNormalScale:{value:new tt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ve},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ve},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ve},sheen:{value:0},sheenColor:{value:new Je(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ve},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ve},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ve},transmissionSamplerSize:{value:new tt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ve},attenuationDistance:{value:0},attenuationColor:{value:new Je(0)},specularColor:{value:new Je(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ve},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ve},anisotropyVector:{value:new tt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ve}}]),vertexShader:Ye.meshphysical_vert,fragmentShader:Ye.meshphysical_frag};const ts={r:0,b:0,g:0},$m=new _t,fu=new Ve;fu.set(-1,0,0,0,1,0,0,0,1);function Km(n,e,t,i,r,s){const a=new Je(0);let o=r===!0?0:1,c,l,f=null,d=0,u=null;function h(E){let A=E.isScene===!0?E.background:null;if(A&&A.isTexture){const S=E.backgroundBlurriness>0;A=e.get(A,S)}return A}function g(E){let A=!1;const S=h(E);S===null?m(a,o):S&&S.isColor&&(m(S,1),A=!0);const T=n.xr.getEnvironmentBlendMode();T==="additive"?t.buffers.color.setClear(0,0,0,1,s):T==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,s),(n.autoClear||A)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function x(E,A){const S=h(A);S&&(S.isCubeTexture||S.mapping===Ps)?(l===void 0&&(l=new ft(new Qt(1,1,1),new Rn({name:"BackgroundCubeMaterial",uniforms:nr(yn.backgroundCube.uniforms),vertexShader:yn.backgroundCube.vertexShader,fragmentShader:yn.backgroundCube.fragmentShader,side:Xt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(T,b,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(l)),l.material.uniforms.envMap.value=S,l.material.uniforms.backgroundBlurriness.value=A.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4($m.makeRotationFromEuler(A.backgroundRotation)).transpose(),S.isCubeTexture&&S.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(fu),l.material.toneMapped=je.getTransfer(S.colorSpace)!==st,(f!==S||d!==S.version||u!==n.toneMapping)&&(l.material.needsUpdate=!0,f=S,d=S.version,u=n.toneMapping),l.layers.enableAll(),E.unshift(l,l.geometry,l.material,0,0,null)):S&&S.isTexture&&(c===void 0&&(c=new ft(new Is(2,2),new Rn({name:"BackgroundMaterial",uniforms:nr(yn.background.uniforms),vertexShader:yn.background.vertexShader,fragmentShader:yn.background.fragmentShader,side:ri,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=S,c.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,c.material.toneMapped=je.getTransfer(S.colorSpace)!==st,S.matrixAutoUpdate===!0&&S.updateMatrix(),c.material.uniforms.uvTransform.value.copy(S.matrix),(f!==S||d!==S.version||u!==n.toneMapping)&&(c.material.needsUpdate=!0,f=S,d=S.version,u=n.toneMapping),c.layers.enableAll(),E.unshift(c,c.geometry,c.material,0,0,null))}function m(E,A){E.getRGB(ts,cu(n)),t.buffers.color.setClear(ts.r,ts.g,ts.b,A,s)}function p(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(E,A=1){a.set(E),o=A,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(E){o=E,m(a,o)},render:g,addToRenderList:x,dispose:p}}function Zm(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=u(null);let s=r,a=!1;function o(C,I,O,V,D){let H=!1;const F=d(C,V,O,I);s!==F&&(s=F,l(s.object)),H=h(C,V,O,D),H&&g(C,V,O,D),D!==null&&e.update(D,n.ELEMENT_ARRAY_BUFFER),(H||a)&&(a=!1,S(C,I,O,V),D!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(D).buffer))}function c(){return n.createVertexArray()}function l(C){return n.bindVertexArray(C)}function f(C){return n.deleteVertexArray(C)}function d(C,I,O,V){const D=V.wireframe===!0;let H=i[I.id];H===void 0&&(H={},i[I.id]=H);const F=C.isInstancedMesh===!0?C.id:0;let k=H[F];k===void 0&&(k={},H[F]=k);let J=k[O.id];J===void 0&&(J={},k[O.id]=J);let ne=J[D];return ne===void 0&&(ne=u(c()),J[D]=ne),ne}function u(C){const I=[],O=[],V=[];for(let D=0;D<t;D++)I[D]=0,O[D]=0,V[D]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:O,attributeDivisors:V,object:C,attributes:{},index:null}}function h(C,I,O,V){const D=s.attributes,H=I.attributes;let F=0;const k=O.getAttributes();for(const J in k)if(k[J].location>=0){const se=D[J];let me=H[J];if(me===void 0&&(J==="instanceMatrix"&&C.instanceMatrix&&(me=C.instanceMatrix),J==="instanceColor"&&C.instanceColor&&(me=C.instanceColor)),se===void 0||se.attribute!==me||me&&se.data!==me.data)return!0;F++}return s.attributesNum!==F||s.index!==V}function g(C,I,O,V){const D={},H=I.attributes;let F=0;const k=O.getAttributes();for(const J in k)if(k[J].location>=0){let se=H[J];se===void 0&&(J==="instanceMatrix"&&C.instanceMatrix&&(se=C.instanceMatrix),J==="instanceColor"&&C.instanceColor&&(se=C.instanceColor));const me={};me.attribute=se,se&&se.data&&(me.data=se.data),D[J]=me,F++}s.attributes=D,s.attributesNum=F,s.index=V}function x(){const C=s.newAttributes;for(let I=0,O=C.length;I<O;I++)C[I]=0}function m(C){p(C,0)}function p(C,I){const O=s.newAttributes,V=s.enabledAttributes,D=s.attributeDivisors;O[C]=1,V[C]===0&&(n.enableVertexAttribArray(C),V[C]=1),D[C]!==I&&(n.vertexAttribDivisor(C,I),D[C]=I)}function E(){const C=s.newAttributes,I=s.enabledAttributes;for(let O=0,V=I.length;O<V;O++)I[O]!==C[O]&&(n.disableVertexAttribArray(O),I[O]=0)}function A(C,I,O,V,D,H,F){F===!0?n.vertexAttribIPointer(C,I,O,D,H):n.vertexAttribPointer(C,I,O,V,D,H)}function S(C,I,O,V){x();const D=V.attributes,H=O.getAttributes(),F=I.defaultAttributeValues;for(const k in H){const J=H[k];if(J.location>=0){let ne=D[k];if(ne===void 0&&(k==="instanceMatrix"&&C.instanceMatrix&&(ne=C.instanceMatrix),k==="instanceColor"&&C.instanceColor&&(ne=C.instanceColor)),ne!==void 0){const se=ne.normalized,me=ne.itemSize,Pe=e.get(ne);if(Pe===void 0)continue;const Te=Pe.buffer,We=Pe.type,Q=Pe.bytesPerElement,ue=We===n.INT||We===n.UNSIGNED_INT||ne.gpuType===bo;if(ne.isInterleavedBufferAttribute){const ie=ne.data,Fe=ie.stride,ke=ne.offset;if(ie.isInstancedInterleavedBuffer){for(let Ue=0;Ue<J.locationSize;Ue++)p(J.location+Ue,ie.meshPerAttribute);C.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let Ue=0;Ue<J.locationSize;Ue++)m(J.location+Ue);n.bindBuffer(n.ARRAY_BUFFER,Te);for(let Ue=0;Ue<J.locationSize;Ue++)A(J.location+Ue,me/J.locationSize,We,se,Fe*Q,(ke+me/J.locationSize*Ue)*Q,ue)}else{if(ne.isInstancedBufferAttribute){for(let ie=0;ie<J.locationSize;ie++)p(J.location+ie,ne.meshPerAttribute);C.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let ie=0;ie<J.locationSize;ie++)m(J.location+ie);n.bindBuffer(n.ARRAY_BUFFER,Te);for(let ie=0;ie<J.locationSize;ie++)A(J.location+ie,me/J.locationSize,We,se,me*Q,me/J.locationSize*ie*Q,ue)}}else if(F!==void 0){const se=F[k];if(se!==void 0)switch(se.length){case 2:n.vertexAttrib2fv(J.location,se);break;case 3:n.vertexAttrib3fv(J.location,se);break;case 4:n.vertexAttrib4fv(J.location,se);break;default:n.vertexAttrib1fv(J.location,se)}}}}E()}function T(){M();for(const C in i){const I=i[C];for(const O in I){const V=I[O];for(const D in V){const H=V[D];for(const F in H)f(H[F].object),delete H[F];delete V[D]}}delete i[C]}}function b(C){if(i[C.id]===void 0)return;const I=i[C.id];for(const O in I){const V=I[O];for(const D in V){const H=V[D];for(const F in H)f(H[F].object),delete H[F];delete V[D]}}delete i[C.id]}function P(C){for(const I in i){const O=i[I];for(const V in O){const D=O[V];if(D[C.id]===void 0)continue;const H=D[C.id];for(const F in H)f(H[F].object),delete H[F];delete D[C.id]}}}function _(C){for(const I in i){const O=i[I],V=C.isInstancedMesh===!0?C.id:0,D=O[V];if(D!==void 0){for(const H in D){const F=D[H];for(const k in F)f(F[k].object),delete F[k];delete D[H]}delete O[V],Object.keys(O).length===0&&delete i[I]}}}function M(){R(),a=!0,s!==r&&(s=r,l(s.object))}function R(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:M,resetDefaultState:R,dispose:T,releaseStatesOfGeometry:b,releaseStatesOfObject:_,releaseStatesOfProgram:P,initAttributes:x,enableAttribute:m,disableUnusedAttributes:E}}function Jm(n,e,t){let i;function r(c){i=c}function s(c,l){n.drawArrays(i,c,l),t.update(l,i,1)}function a(c,l,f){f!==0&&(n.drawArraysInstanced(i,c,l,f),t.update(l,i,f))}function o(c,l,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,l,0,f);let u=0;for(let h=0;h<f;h++)u+=l[h];t.update(u,i,1)}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o}function Qm(n,e,t,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const P=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(P){return!(P!==hn&&i.convert(P)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(P){const _=P===Vn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(P!==Jt&&i.convert(P)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==dn&&!_)}function c(P){if(P==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const f=c(l);f!==l&&(Be("WebGLRenderer:",l,"not supported, using",f,"instead."),l=f);const d=t.logarithmicDepthBuffer===!0,u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&u===!1&&Be("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const h=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),E=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),A=n.getParameter(n.MAX_VARYING_VECTORS),S=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),T=n.getParameter(n.MAX_SAMPLES),b=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:h,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:E,maxVaryings:A,maxFragmentUniforms:S,maxSamples:T,samples:b}}function jm(n){const e=this;let t=null,i=0,r=!1,s=!1;const a=new di,o=new Ve,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const h=d.length!==0||u||i!==0||r;return r=u,i=d.length,h},this.beginShadows=function(){s=!0,f(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,u){t=f(d,u,0)},this.setState=function(d,u,h){const g=d.clippingPlanes,x=d.clipIntersection,m=d.clipShadows,p=n.get(d);if(!r||g===null||g.length===0||s&&!m)s?f(null):l();else{const E=s?0:i,A=E*4;let S=p.clippingState||null;c.value=S,S=f(g,u,A,h);for(let T=0;T!==A;++T)S[T]=t[T];p.clippingState=S,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=E}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function f(d,u,h,g){const x=d!==null?d.length:0;let m=null;if(x!==0){if(m=c.value,g!==!0||m===null){const p=h+x*4,E=u.matrixWorldInverse;o.getNormalMatrix(E),(m===null||m.length<p)&&(m=new Float32Array(p));for(let A=0,S=h;A!==x;++A,S+=4)a.copy(d[A]).applyMatrix4(E,o),a.normal.toArray(m,S),m[S+3]=a.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,m}}const ni=4,Yc=[.125,.215,.35,.446,.526,.582],pi=20,e0=256,mr=new Ds,$c=new Je;let ma=null,ga=0,_a=0,xa=!1;const t0=new z;class Kc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,r=100,s={}){const{size:a=256,position:o=t0}=s;ma=this._renderer.getRenderTarget(),ga=this._renderer.getActiveCubeFace(),_a=this._renderer.getActiveMipmapLevel(),xa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,i,r,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Qc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Jc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(ma,ga,_a),this._renderer.xr.enabled=xa,e.scissorTest=!1,Wi(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Si||e.mapping===er?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ma=this._renderer.getRenderTarget(),ga=this._renderer.getActiveCubeFace(),_a=this._renderer.getActiveMipmapLevel(),xa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Bt,minFilter:Bt,generateMipmaps:!1,type:Vn,format:hn,colorSpace:Ms,depthBuffer:!1},r=Zc(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Zc(e,t,i);const{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=n0(s)),this._blurMaterial=r0(s,e,t),this._ggxMaterial=i0(s,e,t)}return r}_compileMaterial(e){const t=new ft(new mn,e);this._renderer.compile(t,mr)}_sceneToCubeUV(e,t,i,r,s){const c=new un(90,1,t,i),l=[1,-1,1,1,1,1],f=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,h=d.toneMapping;d.getClearColor($c),d.toneMapping=bn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(r),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ft(new Qt,new ru({name:"PMREM.Background",side:Xt,depthWrite:!1,depthTest:!1})));const x=this._backgroundBox,m=x.material;let p=!1;const E=e.background;E?E.isColor&&(m.color.copy(E),e.background=null,p=!0):(m.color.copy($c),p=!0);for(let A=0;A<6;A++){const S=A%3;S===0?(c.up.set(0,l[A],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x+f[A],s.y,s.z)):S===1?(c.up.set(0,0,l[A]),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y+f[A],s.z)):(c.up.set(0,l[A],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y,s.z+f[A]));const T=this._cubeSize;Wi(r,S*T,A>2?T:0,T,T),d.setRenderTarget(r),p&&d.render(x,c),d.render(e,c)}d.toneMapping=h,d.autoClear=u,e.background=E}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===Si||e.mapping===er;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Qc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Jc());const s=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=s;const o=s.uniforms;o.envMap.value=e;const c=this._cubeSize;Wi(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(a,mr)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(e,s-1,s);t.autoClear=i}_applyGGXFilter(e,t,i){const r=this._renderer,s=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;const c=a.uniforms,l=i/(this._lodMeshes.length-1),f=t/(this._lodMeshes.length-1),d=Math.sqrt(l*l-f*f),u=0+l*1.25,h=d*u,{_lodMax:g}=this,x=this._sizeLods[i],m=3*x*(i>g-ni?i-g+ni:0),p=4*(this._cubeSize-x);c.envMap.value=e.texture,c.roughness.value=h,c.mipInt.value=g-t,Wi(s,m,p,3*x,2*x),r.setRenderTarget(s),r.render(o,mr),c.envMap.value=s.texture,c.roughness.value=0,c.mipInt.value=g-i,Wi(e,m,p,3*x,2*x),r.setRenderTarget(e),r.render(o,mr)}_blur(e,t,i,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,r,"latitudinal",s),this._halfBlur(a,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&it("blur direction must be either latitudinal or longitudinal!");const f=3,d=this._lodMeshes[r];d.material=l;const u=l.uniforms,h=this._sizeLods[i]-1,g=isFinite(s)?Math.PI/(2*h):2*Math.PI/(2*pi-1),x=s/g,m=isFinite(s)?1+Math.floor(f*x):pi;m>pi&&Be(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${pi}`);const p=[];let E=0;for(let P=0;P<pi;++P){const _=P/x,M=Math.exp(-_*_/2);p.push(M),P===0?E+=M:P<m&&(E+=2*M)}for(let P=0;P<p.length;P++)p[P]=p[P]/E;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=p,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);const{_lodMax:A}=this;u.dTheta.value=g,u.mipInt.value=A-i;const S=this._sizeLods[r],T=3*S*(r>A-ni?r-A+ni:0),b=4*(this._cubeSize-S);Wi(t,T,b,3*S,2*S),c.setRenderTarget(t),c.render(d,mr)}}function n0(n){const e=[],t=[],i=[];let r=n;const s=n-ni+1+Yc.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);e.push(o);let c=1/o;a>n-ni?c=Yc[a-n+ni-1]:a===0&&(c=0),t.push(c);const l=1/(o-2),f=-l,d=1+l,u=[f,f,d,f,d,d,f,f,d,d,f,d],h=6,g=6,x=3,m=2,p=1,E=new Float32Array(x*g*h),A=new Float32Array(m*g*h),S=new Float32Array(p*g*h);for(let b=0;b<h;b++){const P=b%3*2/3-1,_=b>2?0:-1,M=[P,_,0,P+2/3,_,0,P+2/3,_+1,0,P,_,0,P+2/3,_+1,0,P,_+1,0];E.set(M,x*g*b),A.set(u,m*g*b);const R=[b,b,b,b,b,b];S.set(R,p*g*b)}const T=new mn;T.setAttribute("position",new pn(E,x)),T.setAttribute("uv",new pn(A,m)),T.setAttribute("faceIndex",new pn(S,p)),i.push(new ft(T,null)),r>ni&&r--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function Zc(n,e,t){const i=new Tn(n,e,t);return i.texture.mapping=Ps,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Wi(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function i0(n,e,t){return new Rn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:e0,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Ls(),fragmentShader:`

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
		`,blending:Bn,depthTest:!1,depthWrite:!1})}function r0(n,e,t){const i=new Float32Array(pi),r=new z(0,1,0);return new Rn({name:"SphericalGaussianBlur",defines:{n:pi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Ls(),fragmentShader:`

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
		`,blending:Bn,depthTest:!1,depthWrite:!1})}function Jc(){return new Rn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ls(),fragmentShader:`

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
		`,blending:Bn,depthTest:!1,depthWrite:!1})}function Qc(){return new Rn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ls(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Bn,depthTest:!1,depthWrite:!1})}function Ls(){return`

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
	`}class du extends Tn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new au(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Qt(5,5,5),s=new Rn({name:"CubemapFromEquirect",uniforms:nr(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Xt,blending:Bn});s.uniforms.tEquirect.value=t;const a=new ft(r,s),o=t.minFilter;return t.minFilter===mi&&(t.minFilter=Bt),new uh(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,r=!0){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,r);e.setRenderTarget(s)}}function s0(n){let e=new WeakMap,t=new WeakMap,i=null;function r(u,h=!1){return u==null?null:h?a(u):s(u)}function s(u){if(u&&u.isTexture){const h=u.mapping;if(h===zs||h===Gs)if(e.has(u)){const g=e.get(u).texture;return o(g,u.mapping)}else{const g=u.image;if(g&&g.height>0){const x=new du(g.height);return x.fromEquirectangularTexture(n,u),e.set(u,x),u.addEventListener("dispose",l),o(x.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){const h=u.mapping,g=h===zs||h===Gs,x=h===Si||h===er;if(g||x){let m=t.get(u);const p=m!==void 0?m.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==p)return i===null&&(i=new Kc(n)),m=g?i.fromEquirectangular(u,m):i.fromCubemap(u,m),m.texture.pmremVersion=u.pmremVersion,t.set(u,m),m.texture;if(m!==void 0)return m.texture;{const E=u.image;return g&&E&&E.height>0||x&&E&&c(E)?(i===null&&(i=new Kc(n)),m=g?i.fromEquirectangular(u):i.fromCubemap(u),m.texture.pmremVersion=u.pmremVersion,t.set(u,m),u.addEventListener("dispose",f),m.texture):null}}}return u}function o(u,h){return h===zs?u.mapping=Si:h===Gs&&(u.mapping=er),u}function c(u){let h=0;const g=6;for(let x=0;x<g;x++)u[x]!==void 0&&h++;return h===g}function l(u){const h=u.target;h.removeEventListener("dispose",l);const g=e.get(h);g!==void 0&&(e.delete(h),g.dispose())}function f(u){const h=u.target;h.removeEventListener("dispose",f);const g=t.get(h);g!==void 0&&(t.delete(h),g.dispose())}function d(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:r,dispose:d}}function a0(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const r=n.getExtension(i);return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&Zi("WebGLRenderer: "+i+" extension not supported."),r}}}function o0(n,e,t,i){const r={},s=new WeakMap;function a(d){const u=d.target;u.index!==null&&e.remove(u.index);for(const g in u.attributes)e.remove(u.attributes[g]);u.removeEventListener("dispose",a),delete r[u.id];const h=s.get(u);h&&(e.remove(h),s.delete(u)),i.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function o(d,u){return r[u.id]===!0||(u.addEventListener("dispose",a),r[u.id]=!0,t.memory.geometries++),u}function c(d){const u=d.attributes;for(const h in u)e.update(u[h],n.ARRAY_BUFFER)}function l(d){const u=[],h=d.index,g=d.attributes.position;let x=0;if(g===void 0)return;if(h!==null){const E=h.array;x=h.version;for(let A=0,S=E.length;A<S;A+=3){const T=E[A+0],b=E[A+1],P=E[A+2];u.push(T,b,b,P,P,T)}}else{const E=g.array;x=g.version;for(let A=0,S=E.length/3-1;A<S;A+=3){const T=A+0,b=A+1,P=A+2;u.push(T,b,b,P,P,T)}}const m=new(g.count>=65535?iu:nu)(u,1);m.version=x;const p=s.get(d);p&&e.remove(p),s.set(d,m)}function f(d){const u=s.get(d);if(u){const h=d.index;h!==null&&u.version<h.version&&l(d)}else l(d);return s.get(d)}return{get:o,update:c,getWireframeAttribute:f}}function c0(n,e,t){let i;function r(d){i=d}let s,a;function o(d){s=d.type,a=d.bytesPerElement}function c(d,u){n.drawElements(i,u,s,d*a),t.update(u,i,1)}function l(d,u,h){h!==0&&(n.drawElementsInstanced(i,u,s,d*a,h),t.update(u,i,h))}function f(d,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,s,d,0,h);let x=0;for(let m=0;m<h;m++)x+=u[m];t.update(x,i,1)}this.setMode=r,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=f}function l0(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(s/3);break;case n.LINES:t.lines+=o*(s/2);break;case n.LINE_STRIP:t.lines+=o*(s-1);break;case n.LINE_LOOP:t.lines+=o*s;break;case n.POINTS:t.points+=o*s;break;default:it("WebGLInfo: Unknown draw mode:",a);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function u0(n,e,t){const i=new WeakMap,r=new vt;function s(a,o,c){const l=a.morphTargetInfluences,f=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=f!==void 0?f.length:0;let u=i.get(o);if(u===void 0||u.count!==d){let R=function(){_.dispose(),i.delete(o),o.removeEventListener("dispose",R)};var h=R;u!==void 0&&u.texture.dispose();const g=o.morphAttributes.position!==void 0,x=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],E=o.morphAttributes.normal||[],A=o.morphAttributes.color||[];let S=0;g===!0&&(S=1),x===!0&&(S=2),m===!0&&(S=3);let T=o.attributes.position.count*S,b=1;T>e.maxTextureSize&&(b=Math.ceil(T/e.maxTextureSize),T=e.maxTextureSize);const P=new Float32Array(T*b*4*d),_=new jl(P,T,b,d);_.type=dn,_.needsUpdate=!0;const M=S*4;for(let C=0;C<d;C++){const I=p[C],O=E[C],V=A[C],D=T*b*4*C;for(let H=0;H<I.count;H++){const F=H*M;g===!0&&(r.fromBufferAttribute(I,H),P[D+F+0]=r.x,P[D+F+1]=r.y,P[D+F+2]=r.z,P[D+F+3]=0),x===!0&&(r.fromBufferAttribute(O,H),P[D+F+4]=r.x,P[D+F+5]=r.y,P[D+F+6]=r.z,P[D+F+7]=0),m===!0&&(r.fromBufferAttribute(V,H),P[D+F+8]=r.x,P[D+F+9]=r.y,P[D+F+10]=r.z,P[D+F+11]=V.itemSize===4?r.w:1)}}u={count:d,texture:_,size:new tt(T,b)},i.set(o,u),o.addEventListener("dispose",R)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const x=o.morphTargetsRelative?1:1-g;c.getUniforms().setValue(n,"morphTargetBaseInfluence",x),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",u.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",u.size)}return{update:s}}function f0(n,e,t,i,r){let s=new WeakMap;function a(l){const f=r.render.frame,d=l.geometry,u=e.get(l,d);if(s.get(u)!==f&&(e.update(u),s.set(u,f)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),s.get(l)!==f&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,f))),l.isSkinnedMesh){const h=l.skeleton;s.get(h)!==f&&(h.update(),s.set(h,f))}return u}function o(){s=new WeakMap}function c(l){const f=l.target;f.removeEventListener("dispose",c),i.releaseStatesOfObject(f),t.remove(f.instanceMatrix),f.instanceColor!==null&&t.remove(f.instanceColor)}return{update:a,dispose:o}}const d0={[kl]:"LINEAR_TONE_MAPPING",[zl]:"REINHARD_TONE_MAPPING",[Gl]:"CINEON_TONE_MAPPING",[Eo]:"ACES_FILMIC_TONE_MAPPING",[Hl]:"AGX_TONE_MAPPING",[Wl]:"NEUTRAL_TONE_MAPPING",[Vl]:"CUSTOM_TONE_MAPPING"};function h0(n,e,t,i,r,s){const a=new Tn(e,t,{type:n,depthBuffer:r,stencilBuffer:s,samples:i?4:0,depthTexture:r?new tr(e,t):void 0}),o=new Tn(e,t,{type:Vn,depthBuffer:!1,stencilBuffer:!1}),c=new mn;c.setAttribute("position",new Ht([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new Ht([0,2,0,0,2,0],2));const l=new ih({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),f=new ft(c,l),d=new Ds(-1,1,1,-1,0,1);let u=null,h=null,g=!1,x,m=null,p=[],E=!1;this.setSize=function(A,S){a.setSize(A,S),o.setSize(A,S);for(let T=0;T<p.length;T++){const b=p[T];b.setSize&&b.setSize(A,S)}},this.setEffects=function(A){p=A,E=p.length>0&&p[0].isRenderPass===!0;const S=a.width,T=a.height;for(let b=0;b<p.length;b++){const P=p[b];P.setSize&&P.setSize(S,T)}},this.begin=function(A,S){if(g||A.toneMapping===bn&&p.length===0)return!1;if(m=S,S!==null){const T=S.width,b=S.height;(a.width!==T||a.height!==b)&&this.setSize(T,b)}return E===!1&&A.setRenderTarget(a),x=A.toneMapping,A.toneMapping=bn,!0},this.hasRenderPass=function(){return E},this.end=function(A,S){A.toneMapping=x,g=!0;let T=a,b=o;for(let P=0;P<p.length;P++){const _=p[P];if(_.enabled!==!1&&(_.render(A,b,T,S),_.needsSwap!==!1)){const M=T;T=b,b=M}}if(u!==A.outputColorSpace||h!==A.toneMapping){u=A.outputColorSpace,h=A.toneMapping,l.defines={},je.getTransfer(u)===st&&(l.defines.SRGB_TRANSFER="");const P=d0[h];P&&(l.defines[P]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=T.texture,A.setRenderTarget(m),A.render(f,d),m=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),o.dispose(),c.dispose(),l.dispose()}}const hu=new Vt,go=new tr(1,1),pu=new jl,mu=new Ld,gu=new au,jc=[],el=[],tl=new Float32Array(16),nl=new Float32Array(9),il=new Float32Array(4);function sr(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=jc[r];if(s===void 0&&(s=new Float32Array(r),jc[r]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(s,o)}return s}function Pt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function It(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Us(n,e){let t=el[e];t===void 0&&(t=new Int32Array(e),el[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function p0(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function m0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Pt(t,e))return;n.uniform2fv(this.addr,e),It(t,e)}}function g0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Pt(t,e))return;n.uniform3fv(this.addr,e),It(t,e)}}function _0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Pt(t,e))return;n.uniform4fv(this.addr,e),It(t,e)}}function x0(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Pt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),It(t,e)}else{if(Pt(t,i))return;il.set(i),n.uniformMatrix2fv(this.addr,!1,il),It(t,i)}}function v0(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Pt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),It(t,e)}else{if(Pt(t,i))return;nl.set(i),n.uniformMatrix3fv(this.addr,!1,nl),It(t,i)}}function M0(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Pt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),It(t,e)}else{if(Pt(t,i))return;tl.set(i),n.uniformMatrix4fv(this.addr,!1,tl),It(t,i)}}function S0(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function y0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Pt(t,e))return;n.uniform2iv(this.addr,e),It(t,e)}}function E0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Pt(t,e))return;n.uniform3iv(this.addr,e),It(t,e)}}function b0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Pt(t,e))return;n.uniform4iv(this.addr,e),It(t,e)}}function T0(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function A0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Pt(t,e))return;n.uniform2uiv(this.addr,e),It(t,e)}}function R0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Pt(t,e))return;n.uniform3uiv(this.addr,e),It(t,e)}}function C0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Pt(t,e))return;n.uniform4uiv(this.addr,e),It(t,e)}}function w0(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(go.compareFunction=t.isReversedDepthBuffer()?Do:Io,s=go):s=hu,t.setTexture2D(e||s,r)}function P0(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||mu,r)}function I0(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||gu,r)}function D0(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||pu,r)}function L0(n){switch(n){case 5126:return p0;case 35664:return m0;case 35665:return g0;case 35666:return _0;case 35674:return x0;case 35675:return v0;case 35676:return M0;case 5124:case 35670:return S0;case 35667:case 35671:return y0;case 35668:case 35672:return E0;case 35669:case 35673:return b0;case 5125:return T0;case 36294:return A0;case 36295:return R0;case 36296:return C0;case 35678:case 36198:case 36298:case 36306:case 35682:return w0;case 35679:case 36299:case 36307:return P0;case 35680:case 36300:case 36308:case 36293:return I0;case 36289:case 36303:case 36311:case 36292:return D0}}function U0(n,e){n.uniform1fv(this.addr,e)}function N0(n,e){const t=sr(e,this.size,2);n.uniform2fv(this.addr,t)}function F0(n,e){const t=sr(e,this.size,3);n.uniform3fv(this.addr,t)}function O0(n,e){const t=sr(e,this.size,4);n.uniform4fv(this.addr,t)}function B0(n,e){const t=sr(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function k0(n,e){const t=sr(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function z0(n,e){const t=sr(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function G0(n,e){n.uniform1iv(this.addr,e)}function V0(n,e){n.uniform2iv(this.addr,e)}function H0(n,e){n.uniform3iv(this.addr,e)}function W0(n,e){n.uniform4iv(this.addr,e)}function X0(n,e){n.uniform1uiv(this.addr,e)}function q0(n,e){n.uniform2uiv(this.addr,e)}function Y0(n,e){n.uniform3uiv(this.addr,e)}function $0(n,e){n.uniform4uiv(this.addr,e)}function K0(n,e,t){const i=this.cache,r=e.length,s=Us(t,r);Pt(i,s)||(n.uniform1iv(this.addr,s),It(i,s));let a;this.type===n.SAMPLER_2D_SHADOW?a=go:a=hu;for(let o=0;o!==r;++o)t.setTexture2D(e[o]||a,s[o])}function Z0(n,e,t){const i=this.cache,r=e.length,s=Us(t,r);Pt(i,s)||(n.uniform1iv(this.addr,s),It(i,s));for(let a=0;a!==r;++a)t.setTexture3D(e[a]||mu,s[a])}function J0(n,e,t){const i=this.cache,r=e.length,s=Us(t,r);Pt(i,s)||(n.uniform1iv(this.addr,s),It(i,s));for(let a=0;a!==r;++a)t.setTextureCube(e[a]||gu,s[a])}function Q0(n,e,t){const i=this.cache,r=e.length,s=Us(t,r);Pt(i,s)||(n.uniform1iv(this.addr,s),It(i,s));for(let a=0;a!==r;++a)t.setTexture2DArray(e[a]||pu,s[a])}function j0(n){switch(n){case 5126:return U0;case 35664:return N0;case 35665:return F0;case 35666:return O0;case 35674:return B0;case 35675:return k0;case 35676:return z0;case 5124:case 35670:return G0;case 35667:case 35671:return V0;case 35668:case 35672:return H0;case 35669:case 35673:return W0;case 5125:return X0;case 36294:return q0;case 36295:return Y0;case 36296:return $0;case 35678:case 36198:case 36298:case 36306:case 35682:return K0;case 35679:case 36299:case 36307:return Z0;case 35680:case 36300:case 36308:case 36293:return J0;case 36289:case 36303:case 36311:case 36292:return Q0}}class eg{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=L0(t.type)}}class tg{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=j0(t.type)}}class ng{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,t[o.id],i)}}}const va=/(\w+)(\])?(\[|\.)?/g;function rl(n,e){n.seq.push(e),n.map[e.id]=e}function ig(n,e,t){const i=n.name,r=i.length;for(va.lastIndex=0;;){const s=va.exec(i),a=va.lastIndex;let o=s[1];const c=s[2]==="]",l=s[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===r){rl(t,l===void 0?new eg(o,n,e):new tg(o,n,e));break}else{let d=t.map[o];d===void 0&&(d=new ng(o),rl(t,d)),t=d}}}class ms{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=e.getActiveUniform(t,a),c=e.getUniformLocation(t,o.name);ig(o,c,this)}const r=[],s=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(a):s.push(a);r.length>0&&(this.seq=r.concat(s))}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,a=t.length;s!==a;++s){const o=t[s],c=i[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in t&&i.push(a)}return i}}function sl(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const rg=37297;let sg=0;function ag(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=r;a<s;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const al=new Ve;function og(n){je._getMatrix(al,je.workingColorSpace,n);const e=`mat3( ${al.elements.map(t=>t.toFixed(4))} )`;switch(je.getTransfer(n)){case Ss:return[e,"LinearTransferOETF"];case st:return[e,"sRGBTransferOETF"];default:return Be("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function ol(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),s=(n.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+s+`

`+ag(n.getShaderSource(e),o)}else return s}function cg(n,e){const t=og(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const lg={[kl]:"Linear",[zl]:"Reinhard",[Gl]:"Cineon",[Eo]:"ACESFilmic",[Hl]:"AgX",[Wl]:"Neutral",[Vl]:"Custom"};function ug(n,e){const t=lg[e];return t===void 0?(Be("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const ns=new z;function fg(){je.getLuminanceCoefficients(ns);const n=ns.x.toFixed(4),e=ns.y.toFixed(4),t=ns.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function dg(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Mr).join(`
`)}function hg(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function pg(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),a=s.name;let o=1;s.type===n.FLOAT_MAT2&&(o=2),s.type===n.FLOAT_MAT3&&(o=3),s.type===n.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function Mr(n){return n!==""}function cl(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function ll(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const mg=/^[ \t]*#include +<([\w\d./]+)>/gm;function _o(n){return n.replace(mg,_g)}const gg=new Map;function _g(n,e){let t=Ye[e];if(t===void 0){const i=gg.get(e);if(i!==void 0)t=Ye[i],Be('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return _o(t)}const xg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ul(n){return n.replace(xg,vg)}function vg(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function fl(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const Mg={[us]:"SHADOWMAP_TYPE_PCF",[vr]:"SHADOWMAP_TYPE_VSM"};function Sg(n){return Mg[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const yg={[Si]:"ENVMAP_TYPE_CUBE",[er]:"ENVMAP_TYPE_CUBE",[Ps]:"ENVMAP_TYPE_CUBE_UV"};function Eg(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":yg[n.envMapMode]||"ENVMAP_TYPE_CUBE"}const bg={[er]:"ENVMAP_MODE_REFRACTION"};function Tg(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":bg[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Ag={[Bl]:"ENVMAP_BLENDING_MULTIPLY",[dd]:"ENVMAP_BLENDING_MIX",[hd]:"ENVMAP_BLENDING_ADD"};function Rg(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":Ag[n.combine]||"ENVMAP_BLENDING_NONE"}function Cg(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function wg(n,e,t,i){const r=n.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=Sg(t),l=Eg(t),f=Tg(t),d=Rg(t),u=Cg(t),h=dg(t),g=hg(s),x=r.createProgram();let m,p,E=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Mr).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Mr).join(`
`),p.length>0&&(p+=`
`)):(m=[fl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+f:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Mr).join(`
`),p=[fl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+f:"",t.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==bn?"#define TONE_MAPPING":"",t.toneMapping!==bn?Ye.tonemapping_pars_fragment:"",t.toneMapping!==bn?ug("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ye.colorspace_pars_fragment,cg("linearToOutputTexel",t.outputColorSpace),fg(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Mr).join(`
`)),a=_o(a),a=cl(a,t),a=ll(a,t),o=_o(o),o=cl(o,t),o=ll(o,t),a=ul(a),o=ul(o),t.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,m=[h,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===Mc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Mc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const A=E+m+a,S=E+p+o,T=sl(r,r.VERTEX_SHADER,A),b=sl(r,r.FRAGMENT_SHADER,S);r.attachShader(x,T),r.attachShader(x,b),t.index0AttributeName!==void 0?r.bindAttribLocation(x,0,t.index0AttributeName):t.hasPositionAttribute===!0&&r.bindAttribLocation(x,0,"position"),r.linkProgram(x);function P(C){if(n.debug.checkShaderErrors){const I=r.getProgramInfoLog(x)||"",O=r.getShaderInfoLog(T)||"",V=r.getShaderInfoLog(b)||"",D=I.trim(),H=O.trim(),F=V.trim();let k=!0,J=!0;if(r.getProgramParameter(x,r.LINK_STATUS)===!1)if(k=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,x,T,b);else{const ne=ol(r,T,"vertex"),se=ol(r,b,"fragment");it("WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(x,r.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+D+`
`+ne+`
`+se)}else D!==""?Be("WebGLProgram: Program Info Log:",D):(H===""||F==="")&&(J=!1);J&&(C.diagnostics={runnable:k,programLog:D,vertexShader:{log:H,prefix:m},fragmentShader:{log:F,prefix:p}})}r.deleteShader(T),r.deleteShader(b),_=new ms(r,x),M=pg(r,x)}let _;this.getUniforms=function(){return _===void 0&&P(this),_};let M;this.getAttributes=function(){return M===void 0&&P(this),M};let R=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=r.getProgramParameter(x,rg)),R},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=sg++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=T,this.fragmentShader=b,this}let Pg=0;class Ig{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){const r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(i)===!1&&(r.add(i),i.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new Dg(e),t.set(e,i)),i}}class Dg{constructor(e){this.id=Pg++,this.code=e,this.usedTimes=0}}function Lg(n){return n===yi||n===xs||n===vs}function Ug(n,e,t,i,r,s){const a=new eu,o=new Ig,c=new Set,l=[],f=new Map,d=i.logarithmicDepthBuffer;let u=i.precision;const h={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(_){return c.add(_),_===0?"uv":`uv${_}`}function x(_,M,R,C,I,O){const V=C.fog,D=I.geometry,H=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?C.environment:null,F=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,k=e.get(_.envMap||H,F),J=k&&k.mapping===Ps?k.image.height:null,ne=h[_.type];_.precision!==null&&(u=i.getMaxPrecision(_.precision),u!==_.precision&&Be("WebGLProgram.getParameters:",_.precision,"not supported, using",u,"instead."));const se=D.morphAttributes.position||D.morphAttributes.normal||D.morphAttributes.color,me=se!==void 0?se.length:0;let Pe=0;D.morphAttributes.position!==void 0&&(Pe=1),D.morphAttributes.normal!==void 0&&(Pe=2),D.morphAttributes.color!==void 0&&(Pe=3);let Te,We,Q,ue;if(ne){const Ae=yn[ne];Te=Ae.vertexShader,We=Ae.fragmentShader}else{Te=_.vertexShader,We=_.fragmentShader;const Ae=o.getVertexShaderStage(_),St=o.getFragmentShaderStage(_);o.update(_,Ae,St),Q=Ae.id,ue=St.id}const ie=n.getRenderTarget(),Fe=n.state.buffers.depth.getReversed(),ke=I.isInstancedMesh===!0,Ue=I.isBatchedMesh===!0,xt=!!_.map,Ke=!!_.matcap,te=!!k,ae=!!_.aoMap,oe=!!_.lightMap,Me=!!_.bumpMap&&_.wireframe===!1,Se=!!_.normalMap,Ee=!!_.displacementMap,Oe=!!_.emissiveMap,Ge=!!_.metalnessMap,rt=!!_.roughnessMap,L=_.anisotropy>0,pt=_.clearcoat>0,Qe=_.dispersion>0,w=_.iridescence>0,v=_.sheen>0,B=_.transmission>0,q=L&&!!_.anisotropyMap,K=pt&&!!_.clearcoatMap,ce=pt&&!!_.clearcoatNormalMap,Z=pt&&!!_.clearcoatRoughnessMap,G=w&&!!_.iridescenceMap,Y=w&&!!_.iridescenceThicknessMap,re=v&&!!_.sheenColorMap,he=v&&!!_.sheenRoughnessMap,le=!!_.specularMap,fe=!!_.specularColorMap,we=!!_.specularIntensityMap,Ne=B&&!!_.transmissionMap,Xe=B&&!!_.thicknessMap,U=!!_.gradientMap,de=!!_.alphaMap,j=_.alphaTest>0,pe=!!_.alphaHash,ve=!!_.extensions;let ee=bn;_.toneMapped&&(ie===null||ie.isXRRenderTarget===!0)&&(ee=n.toneMapping);const Ie={shaderID:ne,shaderType:_.type,shaderName:_.name,vertexShader:Te,fragmentShader:We,defines:_.defines,customVertexShaderID:Q,customFragmentShaderID:ue,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:u,batching:Ue,batchingColor:Ue&&I._colorsTexture!==null,instancing:ke,instancingColor:ke&&I.instanceColor!==null,instancingMorph:ke&&I.morphTexture!==null,outputColorSpace:ie===null?n.outputColorSpace:ie.isXRRenderTarget===!0?ie.texture.colorSpace:je.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:xt,matcap:Ke,envMap:te,envMapMode:te&&k.mapping,envMapCubeUVHeight:J,aoMap:ae,lightMap:oe,bumpMap:Me,normalMap:Se,displacementMap:Ee,emissiveMap:Oe,normalMapObjectSpace:Se&&_.normalMapType===gd,normalMapTangentSpace:Se&&_.normalMapType===po,packedNormalMap:Se&&_.normalMapType===po&&Lg(_.normalMap.format),metalnessMap:Ge,roughnessMap:rt,anisotropy:L,anisotropyMap:q,clearcoat:pt,clearcoatMap:K,clearcoatNormalMap:ce,clearcoatRoughnessMap:Z,dispersion:Qe,iridescence:w,iridescenceMap:G,iridescenceThicknessMap:Y,sheen:v,sheenColorMap:re,sheenRoughnessMap:he,specularMap:le,specularColorMap:fe,specularIntensityMap:we,transmission:B,transmissionMap:Ne,thicknessMap:Xe,gradientMap:U,opaque:_.transparent===!1&&_.blending===Ki&&_.alphaToCoverage===!1,alphaMap:de,alphaTest:j,alphaHash:pe,combine:_.combine,mapUv:xt&&g(_.map.channel),aoMapUv:ae&&g(_.aoMap.channel),lightMapUv:oe&&g(_.lightMap.channel),bumpMapUv:Me&&g(_.bumpMap.channel),normalMapUv:Se&&g(_.normalMap.channel),displacementMapUv:Ee&&g(_.displacementMap.channel),emissiveMapUv:Oe&&g(_.emissiveMap.channel),metalnessMapUv:Ge&&g(_.metalnessMap.channel),roughnessMapUv:rt&&g(_.roughnessMap.channel),anisotropyMapUv:q&&g(_.anisotropyMap.channel),clearcoatMapUv:K&&g(_.clearcoatMap.channel),clearcoatNormalMapUv:ce&&g(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Z&&g(_.clearcoatRoughnessMap.channel),iridescenceMapUv:G&&g(_.iridescenceMap.channel),iridescenceThicknessMapUv:Y&&g(_.iridescenceThicknessMap.channel),sheenColorMapUv:re&&g(_.sheenColorMap.channel),sheenRoughnessMapUv:he&&g(_.sheenRoughnessMap.channel),specularMapUv:le&&g(_.specularMap.channel),specularColorMapUv:fe&&g(_.specularColorMap.channel),specularIntensityMapUv:we&&g(_.specularIntensityMap.channel),transmissionMapUv:Ne&&g(_.transmissionMap.channel),thicknessMapUv:Xe&&g(_.thicknessMap.channel),alphaMapUv:de&&g(_.alphaMap.channel),vertexTangents:!!D.attributes.tangent&&(Se||L),vertexNormals:!!D.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!D.attributes.color&&D.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!D.attributes.uv&&(xt||de),fog:!!V,useFog:_.fog===!0,fogExp2:!!V&&V.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||D.attributes.normal===void 0&&Se===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:Fe,skinning:I.isSkinnedMesh===!0,hasPositionAttribute:D.attributes.position!==void 0,morphTargets:D.morphAttributes.position!==void 0,morphNormals:D.morphAttributes.normal!==void 0,morphColors:D.morphAttributes.color!==void 0,morphTargetsCount:me,morphTextureStride:Pe,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numLightProbeGrids:O.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:_.dithering,shadowMapEnabled:n.shadowMap.enabled&&R.length>0,shadowMapType:n.shadowMap.type,toneMapping:ee,decodeVideoTexture:xt&&_.map.isVideoTexture===!0&&je.getTransfer(_.map.colorSpace)===st,decodeVideoTextureEmissive:Oe&&_.emissiveMap.isVideoTexture===!0&&je.getTransfer(_.emissiveMap.colorSpace)===st,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Fn,flipSided:_.side===Xt,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:ve&&_.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ve&&_.extensions.multiDraw===!0||Ue)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Ie.vertexUv1s=c.has(1),Ie.vertexUv2s=c.has(2),Ie.vertexUv3s=c.has(3),c.clear(),Ie}function m(_){const M=[];if(_.shaderID?M.push(_.shaderID):(M.push(_.customVertexShaderID),M.push(_.customFragmentShaderID)),_.defines!==void 0)for(const R in _.defines)M.push(R),M.push(_.defines[R]);return _.isRawShaderMaterial===!1&&(p(M,_),E(M,_),M.push(n.outputColorSpace)),M.push(_.customProgramCacheKey),M.join()}function p(_,M){_.push(M.precision),_.push(M.outputColorSpace),_.push(M.envMapMode),_.push(M.envMapCubeUVHeight),_.push(M.mapUv),_.push(M.alphaMapUv),_.push(M.lightMapUv),_.push(M.aoMapUv),_.push(M.bumpMapUv),_.push(M.normalMapUv),_.push(M.displacementMapUv),_.push(M.emissiveMapUv),_.push(M.metalnessMapUv),_.push(M.roughnessMapUv),_.push(M.anisotropyMapUv),_.push(M.clearcoatMapUv),_.push(M.clearcoatNormalMapUv),_.push(M.clearcoatRoughnessMapUv),_.push(M.iridescenceMapUv),_.push(M.iridescenceThicknessMapUv),_.push(M.sheenColorMapUv),_.push(M.sheenRoughnessMapUv),_.push(M.specularMapUv),_.push(M.specularColorMapUv),_.push(M.specularIntensityMapUv),_.push(M.transmissionMapUv),_.push(M.thicknessMapUv),_.push(M.combine),_.push(M.fogExp2),_.push(M.sizeAttenuation),_.push(M.morphTargetsCount),_.push(M.morphAttributeCount),_.push(M.numDirLights),_.push(M.numPointLights),_.push(M.numSpotLights),_.push(M.numSpotLightMaps),_.push(M.numHemiLights),_.push(M.numRectAreaLights),_.push(M.numDirLightShadows),_.push(M.numPointLightShadows),_.push(M.numSpotLightShadows),_.push(M.numSpotLightShadowsWithMaps),_.push(M.numLightProbes),_.push(M.shadowMapType),_.push(M.toneMapping),_.push(M.numClippingPlanes),_.push(M.numClipIntersection),_.push(M.depthPacking)}function E(_,M){a.disableAll(),M.instancing&&a.enable(0),M.instancingColor&&a.enable(1),M.instancingMorph&&a.enable(2),M.matcap&&a.enable(3),M.envMap&&a.enable(4),M.normalMapObjectSpace&&a.enable(5),M.normalMapTangentSpace&&a.enable(6),M.clearcoat&&a.enable(7),M.iridescence&&a.enable(8),M.alphaTest&&a.enable(9),M.vertexColors&&a.enable(10),M.vertexAlphas&&a.enable(11),M.vertexUv1s&&a.enable(12),M.vertexUv2s&&a.enable(13),M.vertexUv3s&&a.enable(14),M.vertexTangents&&a.enable(15),M.anisotropy&&a.enable(16),M.alphaHash&&a.enable(17),M.batching&&a.enable(18),M.dispersion&&a.enable(19),M.batchingColor&&a.enable(20),M.gradientMap&&a.enable(21),M.packedNormalMap&&a.enable(22),M.vertexNormals&&a.enable(23),_.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reversedDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),M.numLightProbeGrids>0&&a.enable(22),M.hasPositionAttribute&&a.enable(23),_.push(a.mask)}function A(_){const M=h[_.type];let R;if(M){const C=yn[M];R=eh.clone(C.uniforms)}else R=_.uniforms;return R}function S(_,M){let R=f.get(M);return R!==void 0?++R.usedTimes:(R=new wg(n,M,_,r),l.push(R),f.set(M,R)),R}function T(_){if(--_.usedTimes===0){const M=l.indexOf(_);l[M]=l[l.length-1],l.pop(),f.delete(_.cacheKey),_.destroy()}}function b(_){o.remove(_)}function P(){o.dispose()}return{getParameters:x,getProgramCacheKey:m,getUniforms:A,acquireProgram:S,releaseProgram:T,releaseShaderCache:b,programs:l,dispose:P}}function Ng(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function r(a,o,c){n.get(a)[o]=c}function s(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:s}}function Fg(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function dl(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function hl(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function a(u){let h=0;return u.isInstancedMesh&&(h+=2),u.isSkinnedMesh&&(h+=1),h}function o(u,h,g,x,m,p){let E=n[e];return E===void 0?(E={id:u.id,object:u,geometry:h,material:g,materialVariant:a(u),groupOrder:x,renderOrder:u.renderOrder,z:m,group:p},n[e]=E):(E.id=u.id,E.object=u,E.geometry=h,E.material=g,E.materialVariant=a(u),E.groupOrder=x,E.renderOrder=u.renderOrder,E.z=m,E.group=p),e++,E}function c(u,h,g,x,m,p){const E=o(u,h,g,x,m,p);g.transmission>0?i.push(E):g.transparent===!0?r.push(E):t.push(E)}function l(u,h,g,x,m,p){const E=o(u,h,g,x,m,p);g.transmission>0?i.unshift(E):g.transparent===!0?r.unshift(E):t.unshift(E)}function f(u,h,g){t.length>1&&t.sort(u||Fg),i.length>1&&i.sort(h||dl),r.length>1&&r.sort(h||dl),g&&(t.reverse(),i.reverse(),r.reverse())}function d(){for(let u=e,h=n.length;u<h;u++){const g=n[u];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:c,unshift:l,finish:d,sort:f}}function Og(){let n=new WeakMap;function e(i,r){const s=n.get(i);let a;return s===void 0?(a=new hl,n.set(i,[a])):r>=s.length?(a=new hl,s.push(a)):a=s[r],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function Bg(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new z,color:new Je};break;case"SpotLight":t={position:new z,direction:new z,color:new Je,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new z,color:new Je,distance:0,decay:0};break;case"HemisphereLight":t={direction:new z,skyColor:new Je,groundColor:new Je};break;case"RectAreaLight":t={color:new Je,position:new z,halfWidth:new z,halfHeight:new z};break}return n[e.id]=t,t}}}function kg(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let zg=0;function Gg(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function Vg(n){const e=new Bg,t=kg(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new z);const r=new z,s=new _t,a=new _t;function o(l){let f=0,d=0,u=0;for(let M=0;M<9;M++)i.probe[M].set(0,0,0);let h=0,g=0,x=0,m=0,p=0,E=0,A=0,S=0,T=0,b=0,P=0;l.sort(Gg);for(let M=0,R=l.length;M<R;M++){const C=l[M],I=C.color,O=C.intensity,V=C.distance;let D=null;if(C.shadow&&C.shadow.map&&(C.shadow.map.texture.format===yi?D=C.shadow.map.texture:D=C.shadow.map.depthTexture||C.shadow.map.texture),C.isAmbientLight)f+=I.r*O,d+=I.g*O,u+=I.b*O;else if(C.isLightProbe){for(let H=0;H<9;H++)i.probe[H].addScaledVector(C.sh.coefficients[H],O);P++}else if(C.isDirectionalLight){const H=e.get(C);if(H.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const F=C.shadow,k=t.get(C);k.shadowIntensity=F.intensity,k.shadowBias=F.bias,k.shadowNormalBias=F.normalBias,k.shadowRadius=F.radius,k.shadowMapSize=F.mapSize,i.directionalShadow[h]=k,i.directionalShadowMap[h]=D,i.directionalShadowMatrix[h]=C.shadow.matrix,E++}i.directional[h]=H,h++}else if(C.isSpotLight){const H=e.get(C);H.position.setFromMatrixPosition(C.matrixWorld),H.color.copy(I).multiplyScalar(O),H.distance=V,H.coneCos=Math.cos(C.angle),H.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),H.decay=C.decay,i.spot[x]=H;const F=C.shadow;if(C.map&&(i.spotLightMap[T]=C.map,T++,F.updateMatrices(C),C.castShadow&&b++),i.spotLightMatrix[x]=F.matrix,C.castShadow){const k=t.get(C);k.shadowIntensity=F.intensity,k.shadowBias=F.bias,k.shadowNormalBias=F.normalBias,k.shadowRadius=F.radius,k.shadowMapSize=F.mapSize,i.spotShadow[x]=k,i.spotShadowMap[x]=D,S++}x++}else if(C.isRectAreaLight){const H=e.get(C);H.color.copy(I).multiplyScalar(O),H.halfWidth.set(C.width*.5,0,0),H.halfHeight.set(0,C.height*.5,0),i.rectArea[m]=H,m++}else if(C.isPointLight){const H=e.get(C);if(H.color.copy(C.color).multiplyScalar(C.intensity),H.distance=C.distance,H.decay=C.decay,C.castShadow){const F=C.shadow,k=t.get(C);k.shadowIntensity=F.intensity,k.shadowBias=F.bias,k.shadowNormalBias=F.normalBias,k.shadowRadius=F.radius,k.shadowMapSize=F.mapSize,k.shadowCameraNear=F.camera.near,k.shadowCameraFar=F.camera.far,i.pointShadow[g]=k,i.pointShadowMap[g]=D,i.pointShadowMatrix[g]=C.shadow.matrix,A++}i.point[g]=H,g++}else if(C.isHemisphereLight){const H=e.get(C);H.skyColor.copy(C.color).multiplyScalar(O),H.groundColor.copy(C.groundColor).multiplyScalar(O),i.hemi[p]=H,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ge.LTC_FLOAT_1,i.rectAreaLTC2=ge.LTC_FLOAT_2):(i.rectAreaLTC1=ge.LTC_HALF_1,i.rectAreaLTC2=ge.LTC_HALF_2)),i.ambient[0]=f,i.ambient[1]=d,i.ambient[2]=u;const _=i.hash;(_.directionalLength!==h||_.pointLength!==g||_.spotLength!==x||_.rectAreaLength!==m||_.hemiLength!==p||_.numDirectionalShadows!==E||_.numPointShadows!==A||_.numSpotShadows!==S||_.numSpotMaps!==T||_.numLightProbes!==P)&&(i.directional.length=h,i.spot.length=x,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=E,i.directionalShadowMap.length=E,i.pointShadow.length=A,i.pointShadowMap.length=A,i.spotShadow.length=S,i.spotShadowMap.length=S,i.directionalShadowMatrix.length=E,i.pointShadowMatrix.length=A,i.spotLightMatrix.length=S+T-b,i.spotLightMap.length=T,i.numSpotLightShadowsWithMaps=b,i.numLightProbes=P,_.directionalLength=h,_.pointLength=g,_.spotLength=x,_.rectAreaLength=m,_.hemiLength=p,_.numDirectionalShadows=E,_.numPointShadows=A,_.numSpotShadows=S,_.numSpotMaps=T,_.numLightProbes=P,i.version=zg++)}function c(l,f){let d=0,u=0,h=0,g=0,x=0;const m=f.matrixWorldInverse;for(let p=0,E=l.length;p<E;p++){const A=l[p];if(A.isDirectionalLight){const S=i.directional[d];S.direction.setFromMatrixPosition(A.matrixWorld),r.setFromMatrixPosition(A.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(m),d++}else if(A.isSpotLight){const S=i.spot[h];S.position.setFromMatrixPosition(A.matrixWorld),S.position.applyMatrix4(m),S.direction.setFromMatrixPosition(A.matrixWorld),r.setFromMatrixPosition(A.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(m),h++}else if(A.isRectAreaLight){const S=i.rectArea[g];S.position.setFromMatrixPosition(A.matrixWorld),S.position.applyMatrix4(m),a.identity(),s.copy(A.matrixWorld),s.premultiply(m),a.extractRotation(s),S.halfWidth.set(A.width*.5,0,0),S.halfHeight.set(0,A.height*.5,0),S.halfWidth.applyMatrix4(a),S.halfHeight.applyMatrix4(a),g++}else if(A.isPointLight){const S=i.point[u];S.position.setFromMatrixPosition(A.matrixWorld),S.position.applyMatrix4(m),u++}else if(A.isHemisphereLight){const S=i.hemi[x];S.direction.setFromMatrixPosition(A.matrixWorld),S.direction.transformDirection(m),x++}}}return{setup:o,setupView:c,state:i}}function pl(n){const e=new Vg(n),t=[],i=[],r=[];function s(u){d.camera=u,t.length=0,i.length=0,r.length=0}function a(u){t.push(u)}function o(u){i.push(u)}function c(u){r.push(u)}function l(){e.setup(t)}function f(u){e.setupView(t,u)}const d={lightsArray:t,shadowsArray:i,lightProbeGridArray:r,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:d,setupLights:l,setupLightsView:f,pushLight:a,pushShadow:o,pushLightProbeGrid:c}}function Hg(n){let e=new WeakMap;function t(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new pl(n),e.set(r,[o])):s>=a.length?(o=new pl(n),a.push(o)):o=a[s],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const Wg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Xg=`uniform sampler2D shadow_pass;
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
}`,qg=[new z(1,0,0),new z(-1,0,0),new z(0,1,0),new z(0,-1,0),new z(0,0,1),new z(0,0,-1)],Yg=[new z(0,-1,0),new z(0,-1,0),new z(0,0,1),new z(0,0,-1),new z(0,-1,0),new z(0,-1,0)],ml=new _t,gr=new z,Ma=new z;function $g(n,e,t){let i=new No;const r=new tt,s=new tt,a=new vt,o=new rh,c=new sh,l={},f=t.maxTextureSize,d={[ri]:Xt,[Xt]:ri,[Fn]:Fn},u=new Rn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new tt},radius:{value:4}},vertexShader:Wg,fragmentShader:Xg}),h=u.clone();h.defines.HORIZONTAL_PASS=1;const g=new mn;g.setAttribute("position",new pn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new ft(g,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=us;let p=this.type;this.render=function(b,P,_){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||b.length===0)return;this.type===Yf&&(Be("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=us);const M=n.getRenderTarget(),R=n.getActiveCubeFace(),C=n.getActiveMipmapLevel(),I=n.state;I.setBlending(Bn),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const O=p!==this.type;O&&P.traverse(function(V){V.material&&(Array.isArray(V.material)?V.material.forEach(D=>D.needsUpdate=!0):V.material.needsUpdate=!0)});for(let V=0,D=b.length;V<D;V++){const H=b[V],F=H.shadow;if(F===void 0){Be("WebGLShadowMap:",H,"has no shadow.");continue}if(F.autoUpdate===!1&&F.needsUpdate===!1)continue;r.copy(F.mapSize);const k=F.getFrameExtents();r.multiply(k),s.copy(F.mapSize),(r.x>f||r.y>f)&&(r.x>f&&(s.x=Math.floor(f/k.x),r.x=s.x*k.x,F.mapSize.x=s.x),r.y>f&&(s.y=Math.floor(f/k.y),r.y=s.y*k.y,F.mapSize.y=s.y));const J=n.state.buffers.depth.getReversed();if(F.camera._reversedDepth=J,F.map===null||O===!0){if(F.map!==null&&(F.map.depthTexture!==null&&(F.map.depthTexture.dispose(),F.map.depthTexture=null),F.map.dispose()),this.type===vr){if(H.isPointLight){Be("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}F.map=new Tn(r.x,r.y,{format:yi,type:Vn,minFilter:Bt,magFilter:Bt,generateMipmaps:!1}),F.map.texture.name=H.name+".shadowMap",F.map.depthTexture=new tr(r.x,r.y,dn),F.map.depthTexture.name=H.name+".shadowMapDepth",F.map.depthTexture.format=Hn,F.map.depthTexture.compareFunction=null,F.map.depthTexture.minFilter=Lt,F.map.depthTexture.magFilter=Lt}else H.isPointLight?(F.map=new du(r.x),F.map.depthTexture=new Qd(r.x,An)):(F.map=new Tn(r.x,r.y),F.map.depthTexture=new tr(r.x,r.y,An)),F.map.depthTexture.name=H.name+".shadowMap",F.map.depthTexture.format=Hn,this.type===us?(F.map.depthTexture.compareFunction=J?Do:Io,F.map.depthTexture.minFilter=Bt,F.map.depthTexture.magFilter=Bt):(F.map.depthTexture.compareFunction=null,F.map.depthTexture.minFilter=Lt,F.map.depthTexture.magFilter=Lt);F.camera.updateProjectionMatrix()}const ne=F.map.isWebGLCubeRenderTarget?6:1;for(let se=0;se<ne;se++){if(F.map.isWebGLCubeRenderTarget)n.setRenderTarget(F.map,se),n.clear();else{se===0&&(n.setRenderTarget(F.map),n.clear());const me=F.getViewport(se);a.set(s.x*me.x,s.y*me.y,s.x*me.z,s.y*me.w),I.viewport(a)}if(H.isPointLight){const me=F.camera,Pe=F.matrix,Te=H.distance||me.far;Te!==me.far&&(me.far=Te,me.updateProjectionMatrix()),gr.setFromMatrixPosition(H.matrixWorld),me.position.copy(gr),Ma.copy(me.position),Ma.add(qg[se]),me.up.copy(Yg[se]),me.lookAt(Ma),me.updateMatrixWorld(),Pe.makeTranslation(-gr.x,-gr.y,-gr.z),ml.multiplyMatrices(me.projectionMatrix,me.matrixWorldInverse),F._frustum.setFromProjectionMatrix(ml,me.coordinateSystem,me.reversedDepth)}else F.updateMatrices(H);i=F.getFrustum(),S(P,_,F.camera,H,this.type)}F.isPointLightShadow!==!0&&this.type===vr&&E(F,_),F.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(M,R,C)};function E(b,P){const _=e.update(x);u.defines.VSM_SAMPLES!==b.blurSamples&&(u.defines.VSM_SAMPLES=b.blurSamples,h.defines.VSM_SAMPLES=b.blurSamples,u.needsUpdate=!0,h.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new Tn(r.x,r.y,{format:yi,type:Vn})),u.uniforms.shadow_pass.value=b.map.depthTexture,u.uniforms.resolution.value=b.mapSize,u.uniforms.radius.value=b.radius,n.setRenderTarget(b.mapPass),n.clear(),n.renderBufferDirect(P,null,_,u,x,null),h.uniforms.shadow_pass.value=b.mapPass.texture,h.uniforms.resolution.value=b.mapSize,h.uniforms.radius.value=b.radius,n.setRenderTarget(b.map),n.clear(),n.renderBufferDirect(P,null,_,h,x,null)}function A(b,P,_,M){let R=null;const C=_.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(C!==void 0)R=C;else if(R=_.isPointLight===!0?c:o,n.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){const I=R.uuid,O=P.uuid;let V=l[I];V===void 0&&(V={},l[I]=V);let D=V[O];D===void 0&&(D=R.clone(),V[O]=D,P.addEventListener("dispose",T)),R=D}if(R.visible=P.visible,R.wireframe=P.wireframe,M===vr?R.side=P.shadowSide!==null?P.shadowSide:P.side:R.side=P.shadowSide!==null?P.shadowSide:d[P.side],R.alphaMap=P.alphaMap,R.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,R.map=P.map,R.clipShadows=P.clipShadows,R.clippingPlanes=P.clippingPlanes,R.clipIntersection=P.clipIntersection,R.displacementMap=P.displacementMap,R.displacementScale=P.displacementScale,R.displacementBias=P.displacementBias,R.wireframeLinewidth=P.wireframeLinewidth,R.linewidth=P.linewidth,_.isPointLight===!0&&R.isMeshDistanceMaterial===!0){const I=n.properties.get(R);I.light=_}return R}function S(b,P,_,M,R){if(b.visible===!1)return;if(b.layers.test(P.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&R===vr)&&(!b.frustumCulled||i.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,b.matrixWorld);const O=e.update(b),V=b.material;if(Array.isArray(V)){const D=O.groups;for(let H=0,F=D.length;H<F;H++){const k=D[H],J=V[k.materialIndex];if(J&&J.visible){const ne=A(b,J,M,R);b.onBeforeShadow(n,b,P,_,O,ne,k),n.renderBufferDirect(_,null,O,ne,b,k),b.onAfterShadow(n,b,P,_,O,ne,k)}}}else if(V.visible){const D=A(b,V,M,R);b.onBeforeShadow(n,b,P,_,O,D,null),n.renderBufferDirect(_,null,O,D,b,null),b.onAfterShadow(n,b,P,_,O,D,null)}}const I=b.children;for(let O=0,V=I.length;O<V;O++)S(I[O],P,_,M,R)}function T(b){b.target.removeEventListener("dispose",T);for(const _ in l){const M=l[_],R=b.target.uuid;R in M&&(M[R].dispose(),delete M[R])}}}function Kg(n,e){function t(){let U=!1;const de=new vt;let j=null;const pe=new vt(0,0,0,0);return{setMask:function(ve){j!==ve&&!U&&(n.colorMask(ve,ve,ve,ve),j=ve)},setLocked:function(ve){U=ve},setClear:function(ve,ee,Ie,Ae,St){St===!0&&(ve*=Ae,ee*=Ae,Ie*=Ae),de.set(ve,ee,Ie,Ae),pe.equals(de)===!1&&(n.clearColor(ve,ee,Ie,Ae),pe.copy(de))},reset:function(){U=!1,j=null,pe.set(-1,0,0,0)}}}function i(){let U=!1,de=!1,j=null,pe=null,ve=null;return{setReversed:function(ee){if(de!==ee){const Ie=e.get("EXT_clip_control");ee?Ie.clipControlEXT(Ie.LOWER_LEFT_EXT,Ie.ZERO_TO_ONE_EXT):Ie.clipControlEXT(Ie.LOWER_LEFT_EXT,Ie.NEGATIVE_ONE_TO_ONE_EXT),de=ee;const Ae=ve;ve=null,this.setClear(Ae)}},getReversed:function(){return de},setTest:function(ee){ee?ie(n.DEPTH_TEST):Fe(n.DEPTH_TEST)},setMask:function(ee){j!==ee&&!U&&(n.depthMask(ee),j=ee)},setFunc:function(ee){if(de&&(ee=Ad[ee]),pe!==ee){switch(ee){case Ca:n.depthFunc(n.NEVER);break;case wa:n.depthFunc(n.ALWAYS);break;case Pa:n.depthFunc(n.LESS);break;case ji:n.depthFunc(n.LEQUAL);break;case Ia:n.depthFunc(n.EQUAL);break;case Da:n.depthFunc(n.GEQUAL);break;case La:n.depthFunc(n.GREATER);break;case Ua:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}pe=ee}},setLocked:function(ee){U=ee},setClear:function(ee){ve!==ee&&(ve=ee,de&&(ee=1-ee),n.clearDepth(ee))},reset:function(){U=!1,j=null,pe=null,ve=null,de=!1}}}function r(){let U=!1,de=null,j=null,pe=null,ve=null,ee=null,Ie=null,Ae=null,St=null;return{setTest:function(dt){U||(dt?ie(n.STENCIL_TEST):Fe(n.STENCIL_TEST))},setMask:function(dt){de!==dt&&!U&&(n.stencilMask(dt),de=dt)},setFunc:function(dt,gn,_n){(j!==dt||pe!==gn||ve!==_n)&&(n.stencilFunc(dt,gn,_n),j=dt,pe=gn,ve=_n)},setOp:function(dt,gn,_n){(ee!==dt||Ie!==gn||Ae!==_n)&&(n.stencilOp(dt,gn,_n),ee=dt,Ie=gn,Ae=_n)},setLocked:function(dt){U=dt},setClear:function(dt){St!==dt&&(n.clearStencil(dt),St=dt)},reset:function(){U=!1,de=null,j=null,pe=null,ve=null,ee=null,Ie=null,Ae=null,St=null}}}const s=new t,a=new i,o=new r,c=new WeakMap,l=new WeakMap;let f={},d={},u={},h=new WeakMap,g=[],x=null,m=!1,p=null,E=null,A=null,S=null,T=null,b=null,P=null,_=new Je(0,0,0),M=0,R=!1,C=null,I=null,O=null,V=null,D=null;const H=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let F=!1,k=0;const J=n.getParameter(n.VERSION);J.indexOf("WebGL")!==-1?(k=parseFloat(/^WebGL (\d)/.exec(J)[1]),F=k>=1):J.indexOf("OpenGL ES")!==-1&&(k=parseFloat(/^OpenGL ES (\d)/.exec(J)[1]),F=k>=2);let ne=null,se={};const me=n.getParameter(n.SCISSOR_BOX),Pe=n.getParameter(n.VIEWPORT),Te=new vt().fromArray(me),We=new vt().fromArray(Pe);function Q(U,de,j,pe){const ve=new Uint8Array(4),ee=n.createTexture();n.bindTexture(U,ee),n.texParameteri(U,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(U,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ie=0;Ie<j;Ie++)U===n.TEXTURE_3D||U===n.TEXTURE_2D_ARRAY?n.texImage3D(de,0,n.RGBA,1,1,pe,0,n.RGBA,n.UNSIGNED_BYTE,ve):n.texImage2D(de+Ie,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ve);return ee}const ue={};ue[n.TEXTURE_2D]=Q(n.TEXTURE_2D,n.TEXTURE_2D,1),ue[n.TEXTURE_CUBE_MAP]=Q(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),ue[n.TEXTURE_2D_ARRAY]=Q(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),ue[n.TEXTURE_3D]=Q(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ie(n.DEPTH_TEST),a.setFunc(ji),Me(!1),Se(pc),ie(n.CULL_FACE),ae(Bn);function ie(U){f[U]!==!0&&(n.enable(U),f[U]=!0)}function Fe(U){f[U]!==!1&&(n.disable(U),f[U]=!1)}function ke(U,de){return u[U]!==de?(n.bindFramebuffer(U,de),u[U]=de,U===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=de),U===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=de),!0):!1}function Ue(U,de){let j=g,pe=!1;if(U){j=h.get(de),j===void 0&&(j=[],h.set(de,j));const ve=U.textures;if(j.length!==ve.length||j[0]!==n.COLOR_ATTACHMENT0){for(let ee=0,Ie=ve.length;ee<Ie;ee++)j[ee]=n.COLOR_ATTACHMENT0+ee;j.length=ve.length,pe=!0}}else j[0]!==n.BACK&&(j[0]=n.BACK,pe=!0);pe&&n.drawBuffers(j)}function xt(U){return x!==U?(n.useProgram(U),x=U,!0):!1}const Ke={[hi]:n.FUNC_ADD,[Kf]:n.FUNC_SUBTRACT,[Zf]:n.FUNC_REVERSE_SUBTRACT};Ke[Jf]=n.MIN,Ke[Qf]=n.MAX;const te={[jf]:n.ZERO,[ed]:n.ONE,[td]:n.SRC_COLOR,[Aa]:n.SRC_ALPHA,[od]:n.SRC_ALPHA_SATURATE,[sd]:n.DST_COLOR,[id]:n.DST_ALPHA,[nd]:n.ONE_MINUS_SRC_COLOR,[Ra]:n.ONE_MINUS_SRC_ALPHA,[ad]:n.ONE_MINUS_DST_COLOR,[rd]:n.ONE_MINUS_DST_ALPHA,[cd]:n.CONSTANT_COLOR,[ld]:n.ONE_MINUS_CONSTANT_COLOR,[ud]:n.CONSTANT_ALPHA,[fd]:n.ONE_MINUS_CONSTANT_ALPHA};function ae(U,de,j,pe,ve,ee,Ie,Ae,St,dt){if(U===Bn){m===!0&&(Fe(n.BLEND),m=!1);return}if(m===!1&&(ie(n.BLEND),m=!0),U!==$f){if(U!==p||dt!==R){if((E!==hi||T!==hi)&&(n.blendEquation(n.FUNC_ADD),E=hi,T=hi),dt)switch(U){case Ki:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case mc:n.blendFunc(n.ONE,n.ONE);break;case gc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case _c:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:it("WebGLState: Invalid blending: ",U);break}else switch(U){case Ki:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case mc:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case gc:it("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case _c:it("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:it("WebGLState: Invalid blending: ",U);break}A=null,S=null,b=null,P=null,_.set(0,0,0),M=0,p=U,R=dt}return}ve=ve||de,ee=ee||j,Ie=Ie||pe,(de!==E||ve!==T)&&(n.blendEquationSeparate(Ke[de],Ke[ve]),E=de,T=ve),(j!==A||pe!==S||ee!==b||Ie!==P)&&(n.blendFuncSeparate(te[j],te[pe],te[ee],te[Ie]),A=j,S=pe,b=ee,P=Ie),(Ae.equals(_)===!1||St!==M)&&(n.blendColor(Ae.r,Ae.g,Ae.b,St),_.copy(Ae),M=St),p=U,R=!1}function oe(U,de){U.side===Fn?Fe(n.CULL_FACE):ie(n.CULL_FACE);let j=U.side===Xt;de&&(j=!j),Me(j),U.blending===Ki&&U.transparent===!1?ae(Bn):ae(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),a.setFunc(U.depthFunc),a.setTest(U.depthTest),a.setMask(U.depthWrite),s.setMask(U.colorWrite);const pe=U.stencilWrite;o.setTest(pe),pe&&(o.setMask(U.stencilWriteMask),o.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),o.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),Oe(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?ie(n.SAMPLE_ALPHA_TO_COVERAGE):Fe(n.SAMPLE_ALPHA_TO_COVERAGE)}function Me(U){C!==U&&(U?n.frontFace(n.CW):n.frontFace(n.CCW),C=U)}function Se(U){U!==Xf?(ie(n.CULL_FACE),U!==I&&(U===pc?n.cullFace(n.BACK):U===qf?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Fe(n.CULL_FACE),I=U}function Ee(U){U!==O&&(F&&n.lineWidth(U),O=U)}function Oe(U,de,j){U?(ie(n.POLYGON_OFFSET_FILL),(V!==de||D!==j)&&(V=de,D=j,a.getReversed()&&(de=-de),n.polygonOffset(de,j))):Fe(n.POLYGON_OFFSET_FILL)}function Ge(U){U?ie(n.SCISSOR_TEST):Fe(n.SCISSOR_TEST)}function rt(U){U===void 0&&(U=n.TEXTURE0+H-1),ne!==U&&(n.activeTexture(U),ne=U)}function L(U,de,j){j===void 0&&(ne===null?j=n.TEXTURE0+H-1:j=ne);let pe=se[j];pe===void 0&&(pe={type:void 0,texture:void 0},se[j]=pe),(pe.type!==U||pe.texture!==de)&&(ne!==j&&(n.activeTexture(j),ne=j),n.bindTexture(U,de||ue[U]),pe.type=U,pe.texture=de)}function pt(){const U=se[ne];U!==void 0&&U.type!==void 0&&(n.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function Qe(){try{n.compressedTexImage2D(...arguments)}catch(U){it("WebGLState:",U)}}function w(){try{n.compressedTexImage3D(...arguments)}catch(U){it("WebGLState:",U)}}function v(){try{n.texSubImage2D(...arguments)}catch(U){it("WebGLState:",U)}}function B(){try{n.texSubImage3D(...arguments)}catch(U){it("WebGLState:",U)}}function q(){try{n.compressedTexSubImage2D(...arguments)}catch(U){it("WebGLState:",U)}}function K(){try{n.compressedTexSubImage3D(...arguments)}catch(U){it("WebGLState:",U)}}function ce(){try{n.texStorage2D(...arguments)}catch(U){it("WebGLState:",U)}}function Z(){try{n.texStorage3D(...arguments)}catch(U){it("WebGLState:",U)}}function G(){try{n.texImage2D(...arguments)}catch(U){it("WebGLState:",U)}}function Y(){try{n.texImage3D(...arguments)}catch(U){it("WebGLState:",U)}}function re(U){return d[U]!==void 0?d[U]:n.getParameter(U)}function he(U,de){d[U]!==de&&(n.pixelStorei(U,de),d[U]=de)}function le(U){Te.equals(U)===!1&&(n.scissor(U.x,U.y,U.z,U.w),Te.copy(U))}function fe(U){We.equals(U)===!1&&(n.viewport(U.x,U.y,U.z,U.w),We.copy(U))}function we(U,de){let j=l.get(de);j===void 0&&(j=new WeakMap,l.set(de,j));let pe=j.get(U);pe===void 0&&(pe=n.getUniformBlockIndex(de,U.name),j.set(U,pe))}function Ne(U,de){const pe=l.get(de).get(U);c.get(de)!==pe&&(n.uniformBlockBinding(de,pe,U.__bindingPointIndex),c.set(de,pe))}function Xe(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),f={},d={},ne=null,se={},u={},h=new WeakMap,g=[],x=null,m=!1,p=null,E=null,A=null,S=null,T=null,b=null,P=null,_=new Je(0,0,0),M=0,R=!1,C=null,I=null,O=null,V=null,D=null,Te.set(0,0,n.canvas.width,n.canvas.height),We.set(0,0,n.canvas.width,n.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:ie,disable:Fe,bindFramebuffer:ke,drawBuffers:Ue,useProgram:xt,setBlending:ae,setMaterial:oe,setFlipSided:Me,setCullFace:Se,setLineWidth:Ee,setPolygonOffset:Oe,setScissorTest:Ge,activeTexture:rt,bindTexture:L,unbindTexture:pt,compressedTexImage2D:Qe,compressedTexImage3D:w,texImage2D:G,texImage3D:Y,pixelStorei:he,getParameter:re,updateUBOMapping:we,uniformBlockBinding:Ne,texStorage2D:ce,texStorage3D:Z,texSubImage2D:v,texSubImage3D:B,compressedTexSubImage2D:q,compressedTexSubImage3D:K,scissor:le,viewport:fe,reset:Xe}}function Zg(n,e,t,i,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new tt,f=new WeakMap,d=new Set;let u;const h=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(w,v){return g?new OffscreenCanvas(w,v):ys("canvas")}function m(w,v,B){let q=1;const K=Qe(w);if((K.width>B||K.height>B)&&(q=B/Math.max(K.width,K.height)),q<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const ce=Math.floor(q*K.width),Z=Math.floor(q*K.height);u===void 0&&(u=x(ce,Z));const G=v?x(ce,Z):u;return G.width=ce,G.height=Z,G.getContext("2d").drawImage(w,0,0,ce,Z),Be("WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+ce+"x"+Z+")."),G}else return"data"in w&&Be("WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),w;return w}function p(w){return w.generateMipmaps}function E(w){n.generateMipmap(w)}function A(w){return w.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?n.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function S(w,v,B,q,K,ce=!1){if(w!==null){if(n[w]!==void 0)return n[w];Be("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let Z;q&&(Z=e.get("EXT_texture_norm16"),Z||Be("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let G=v;if(v===n.RED&&(B===n.FLOAT&&(G=n.R32F),B===n.HALF_FLOAT&&(G=n.R16F),B===n.UNSIGNED_BYTE&&(G=n.R8),B===n.UNSIGNED_SHORT&&Z&&(G=Z.R16_EXT),B===n.SHORT&&Z&&(G=Z.R16_SNORM_EXT)),v===n.RED_INTEGER&&(B===n.UNSIGNED_BYTE&&(G=n.R8UI),B===n.UNSIGNED_SHORT&&(G=n.R16UI),B===n.UNSIGNED_INT&&(G=n.R32UI),B===n.BYTE&&(G=n.R8I),B===n.SHORT&&(G=n.R16I),B===n.INT&&(G=n.R32I)),v===n.RG&&(B===n.FLOAT&&(G=n.RG32F),B===n.HALF_FLOAT&&(G=n.RG16F),B===n.UNSIGNED_BYTE&&(G=n.RG8),B===n.UNSIGNED_SHORT&&Z&&(G=Z.RG16_EXT),B===n.SHORT&&Z&&(G=Z.RG16_SNORM_EXT)),v===n.RG_INTEGER&&(B===n.UNSIGNED_BYTE&&(G=n.RG8UI),B===n.UNSIGNED_SHORT&&(G=n.RG16UI),B===n.UNSIGNED_INT&&(G=n.RG32UI),B===n.BYTE&&(G=n.RG8I),B===n.SHORT&&(G=n.RG16I),B===n.INT&&(G=n.RG32I)),v===n.RGB_INTEGER&&(B===n.UNSIGNED_BYTE&&(G=n.RGB8UI),B===n.UNSIGNED_SHORT&&(G=n.RGB16UI),B===n.UNSIGNED_INT&&(G=n.RGB32UI),B===n.BYTE&&(G=n.RGB8I),B===n.SHORT&&(G=n.RGB16I),B===n.INT&&(G=n.RGB32I)),v===n.RGBA_INTEGER&&(B===n.UNSIGNED_BYTE&&(G=n.RGBA8UI),B===n.UNSIGNED_SHORT&&(G=n.RGBA16UI),B===n.UNSIGNED_INT&&(G=n.RGBA32UI),B===n.BYTE&&(G=n.RGBA8I),B===n.SHORT&&(G=n.RGBA16I),B===n.INT&&(G=n.RGBA32I)),v===n.RGB&&(B===n.UNSIGNED_SHORT&&Z&&(G=Z.RGB16_EXT),B===n.SHORT&&Z&&(G=Z.RGB16_SNORM_EXT),B===n.UNSIGNED_INT_5_9_9_9_REV&&(G=n.RGB9_E5),B===n.UNSIGNED_INT_10F_11F_11F_REV&&(G=n.R11F_G11F_B10F)),v===n.RGBA){const Y=ce?Ss:je.getTransfer(K);B===n.FLOAT&&(G=n.RGBA32F),B===n.HALF_FLOAT&&(G=n.RGBA16F),B===n.UNSIGNED_BYTE&&(G=Y===st?n.SRGB8_ALPHA8:n.RGBA8),B===n.UNSIGNED_SHORT&&Z&&(G=Z.RGBA16_EXT),B===n.SHORT&&Z&&(G=Z.RGBA16_SNORM_EXT),B===n.UNSIGNED_SHORT_4_4_4_4&&(G=n.RGBA4),B===n.UNSIGNED_SHORT_5_5_5_1&&(G=n.RGB5_A1)}return(G===n.R16F||G===n.R32F||G===n.RG16F||G===n.RG32F||G===n.RGBA16F||G===n.RGBA32F)&&e.get("EXT_color_buffer_float"),G}function T(w,v){let B;return w?v===null||v===An||v===Er?B=n.DEPTH24_STENCIL8:v===dn?B=n.DEPTH32F_STENCIL8:v===yr&&(B=n.DEPTH24_STENCIL8,Be("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===An||v===Er?B=n.DEPTH_COMPONENT24:v===dn?B=n.DEPTH_COMPONENT32F:v===yr&&(B=n.DEPTH_COMPONENT16),B}function b(w,v){return p(w)===!0||w.isFramebufferTexture&&w.minFilter!==Lt&&w.minFilter!==Bt?Math.log2(Math.max(v.width,v.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?v.mipmaps.length:1}function P(w){const v=w.target;v.removeEventListener("dispose",P),M(v),v.isVideoTexture&&f.delete(v),v.isHTMLTexture&&d.delete(v)}function _(w){const v=w.target;v.removeEventListener("dispose",_),C(v)}function M(w){const v=i.get(w);if(v.__webglInit===void 0)return;const B=w.source,q=h.get(B);if(q){const K=q[v.__cacheKey];K.usedTimes--,K.usedTimes===0&&R(w),Object.keys(q).length===0&&h.delete(B)}i.remove(w)}function R(w){const v=i.get(w);n.deleteTexture(v.__webglTexture);const B=w.source,q=h.get(B);delete q[v.__cacheKey],a.memory.textures--}function C(w){const v=i.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),i.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(v.__webglFramebuffer[q]))for(let K=0;K<v.__webglFramebuffer[q].length;K++)n.deleteFramebuffer(v.__webglFramebuffer[q][K]);else n.deleteFramebuffer(v.__webglFramebuffer[q]);v.__webglDepthbuffer&&n.deleteRenderbuffer(v.__webglDepthbuffer[q])}else{if(Array.isArray(v.__webglFramebuffer))for(let q=0;q<v.__webglFramebuffer.length;q++)n.deleteFramebuffer(v.__webglFramebuffer[q]);else n.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&n.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&n.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let q=0;q<v.__webglColorRenderbuffer.length;q++)v.__webglColorRenderbuffer[q]&&n.deleteRenderbuffer(v.__webglColorRenderbuffer[q]);v.__webglDepthRenderbuffer&&n.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const B=w.textures;for(let q=0,K=B.length;q<K;q++){const ce=i.get(B[q]);ce.__webglTexture&&(n.deleteTexture(ce.__webglTexture),a.memory.textures--),i.remove(B[q])}i.remove(w)}let I=0;function O(){I=0}function V(){return I}function D(w){I=w}function H(){const w=I;return w>=r.maxTextures&&Be("WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+r.maxTextures),I+=1,w}function F(w){const v=[];return v.push(w.wrapS),v.push(w.wrapT),v.push(w.wrapR||0),v.push(w.magFilter),v.push(w.minFilter),v.push(w.anisotropy),v.push(w.internalFormat),v.push(w.format),v.push(w.type),v.push(w.generateMipmaps),v.push(w.premultiplyAlpha),v.push(w.flipY),v.push(w.unpackAlignment),v.push(w.colorSpace),v.join()}function k(w,v){const B=i.get(w);if(w.isVideoTexture&&L(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&B.__version!==w.version){const q=w.image;if(q===null)Be("WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)Be("WebGLRenderer: Texture marked for update but image is incomplete");else{Fe(B,w,v);return}}else w.isExternalTexture&&(B.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,B.__webglTexture,n.TEXTURE0+v)}function J(w,v){const B=i.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&B.__version!==w.version){Fe(B,w,v);return}else w.isExternalTexture&&(B.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,B.__webglTexture,n.TEXTURE0+v)}function ne(w,v){const B=i.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&B.__version!==w.version){Fe(B,w,v);return}t.bindTexture(n.TEXTURE_3D,B.__webglTexture,n.TEXTURE0+v)}function se(w,v){const B=i.get(w);if(w.isCubeDepthTexture!==!0&&w.version>0&&B.__version!==w.version){ke(B,w,v);return}t.bindTexture(n.TEXTURE_CUBE_MAP,B.__webglTexture,n.TEXTURE0+v)}const me={[Na]:n.REPEAT,[On]:n.CLAMP_TO_EDGE,[Fa]:n.MIRRORED_REPEAT},Pe={[Lt]:n.NEAREST,[pd]:n.NEAREST_MIPMAP_NEAREST,[Ur]:n.NEAREST_MIPMAP_LINEAR,[Bt]:n.LINEAR,[Vs]:n.LINEAR_MIPMAP_NEAREST,[mi]:n.LINEAR_MIPMAP_LINEAR},Te={[_d]:n.NEVER,[yd]:n.ALWAYS,[xd]:n.LESS,[Io]:n.LEQUAL,[vd]:n.EQUAL,[Do]:n.GEQUAL,[Md]:n.GREATER,[Sd]:n.NOTEQUAL};function We(w,v){if(v.type===dn&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===Bt||v.magFilter===Vs||v.magFilter===Ur||v.magFilter===mi||v.minFilter===Bt||v.minFilter===Vs||v.minFilter===Ur||v.minFilter===mi)&&Be("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(w,n.TEXTURE_WRAP_S,me[v.wrapS]),n.texParameteri(w,n.TEXTURE_WRAP_T,me[v.wrapT]),(w===n.TEXTURE_3D||w===n.TEXTURE_2D_ARRAY)&&n.texParameteri(w,n.TEXTURE_WRAP_R,me[v.wrapR]),n.texParameteri(w,n.TEXTURE_MAG_FILTER,Pe[v.magFilter]),n.texParameteri(w,n.TEXTURE_MIN_FILTER,Pe[v.minFilter]),v.compareFunction&&(n.texParameteri(w,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(w,n.TEXTURE_COMPARE_FUNC,Te[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===Lt||v.minFilter!==Ur&&v.minFilter!==mi||v.type===dn&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||i.get(v).__currentAnisotropy){const B=e.get("EXT_texture_filter_anisotropic");n.texParameterf(w,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,r.getMaxAnisotropy())),i.get(v).__currentAnisotropy=v.anisotropy}}}function Q(w,v){let B=!1;w.__webglInit===void 0&&(w.__webglInit=!0,v.addEventListener("dispose",P));const q=v.source;let K=h.get(q);K===void 0&&(K={},h.set(q,K));const ce=F(v);if(ce!==w.__cacheKey){K[ce]===void 0&&(K[ce]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,B=!0),K[ce].usedTimes++;const Z=K[w.__cacheKey];Z!==void 0&&(K[w.__cacheKey].usedTimes--,Z.usedTimes===0&&R(v)),w.__cacheKey=ce,w.__webglTexture=K[ce].texture}return B}function ue(w,v,B){return Math.floor(Math.floor(w/B)/v)}function ie(w,v,B,q){const ce=w.updateRanges;if(ce.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,v.width,v.height,B,q,v.data);else{ce.sort((he,le)=>he.start-le.start);let Z=0;for(let he=1;he<ce.length;he++){const le=ce[Z],fe=ce[he],we=le.start+le.count,Ne=ue(fe.start,v.width,4),Xe=ue(le.start,v.width,4);fe.start<=we+1&&Ne===Xe&&ue(fe.start+fe.count-1,v.width,4)===Ne?le.count=Math.max(le.count,fe.start+fe.count-le.start):(++Z,ce[Z]=fe)}ce.length=Z+1;const G=t.getParameter(n.UNPACK_ROW_LENGTH),Y=t.getParameter(n.UNPACK_SKIP_PIXELS),re=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,v.width);for(let he=0,le=ce.length;he<le;he++){const fe=ce[he],we=Math.floor(fe.start/4),Ne=Math.ceil(fe.count/4),Xe=we%v.width,U=Math.floor(we/v.width),de=Ne,j=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,Xe),t.pixelStorei(n.UNPACK_SKIP_ROWS,U),t.texSubImage2D(n.TEXTURE_2D,0,Xe,U,de,j,B,q,v.data)}w.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,G),t.pixelStorei(n.UNPACK_SKIP_PIXELS,Y),t.pixelStorei(n.UNPACK_SKIP_ROWS,re)}}function Fe(w,v,B){let q=n.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(q=n.TEXTURE_2D_ARRAY),v.isData3DTexture&&(q=n.TEXTURE_3D);const K=Q(w,v),ce=v.source;t.bindTexture(q,w.__webglTexture,n.TEXTURE0+B);const Z=i.get(ce);if(ce.version!==Z.__version||K===!0){if(t.activeTexture(n.TEXTURE0+B),(typeof ImageBitmap<"u"&&v.image instanceof ImageBitmap)===!1){const j=je.getPrimaries(je.workingColorSpace),pe=v.colorSpace===ti?null:je.getPrimaries(v.colorSpace),ve=v.colorSpace===ti||j===pe?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ve)}t.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment);let Y=m(v.image,!1,r.maxTextureSize);Y=pt(v,Y);const re=s.convert(v.format,v.colorSpace),he=s.convert(v.type);let le=S(v.internalFormat,re,he,v.normalized,v.colorSpace,v.isVideoTexture);We(q,v);let fe;const we=v.mipmaps,Ne=v.isVideoTexture!==!0,Xe=Z.__version===void 0||K===!0,U=ce.dataReady,de=b(v,Y);if(v.isDepthTexture)le=T(v.format===gi,v.type),Xe&&(Ne?t.texStorage2D(n.TEXTURE_2D,1,le,Y.width,Y.height):t.texImage2D(n.TEXTURE_2D,0,le,Y.width,Y.height,0,re,he,null));else if(v.isDataTexture)if(we.length>0){Ne&&Xe&&t.texStorage2D(n.TEXTURE_2D,de,le,we[0].width,we[0].height);for(let j=0,pe=we.length;j<pe;j++)fe=we[j],Ne?U&&t.texSubImage2D(n.TEXTURE_2D,j,0,0,fe.width,fe.height,re,he,fe.data):t.texImage2D(n.TEXTURE_2D,j,le,fe.width,fe.height,0,re,he,fe.data);v.generateMipmaps=!1}else Ne?(Xe&&t.texStorage2D(n.TEXTURE_2D,de,le,Y.width,Y.height),U&&ie(v,Y,re,he)):t.texImage2D(n.TEXTURE_2D,0,le,Y.width,Y.height,0,re,he,Y.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){Ne&&Xe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,de,le,we[0].width,we[0].height,Y.depth);for(let j=0,pe=we.length;j<pe;j++)if(fe=we[j],v.format!==hn)if(re!==null)if(Ne){if(U)if(v.layerUpdates.size>0){const ve=qc(fe.width,fe.height,v.format,v.type);for(const ee of v.layerUpdates){const Ie=fe.data.subarray(ee*ve/fe.data.BYTES_PER_ELEMENT,(ee+1)*ve/fe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,j,0,0,ee,fe.width,fe.height,1,re,Ie)}v.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,j,0,0,0,fe.width,fe.height,Y.depth,re,fe.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,j,le,fe.width,fe.height,Y.depth,0,fe.data,0,0);else Be("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ne?U&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,j,0,0,0,fe.width,fe.height,Y.depth,re,he,fe.data):t.texImage3D(n.TEXTURE_2D_ARRAY,j,le,fe.width,fe.height,Y.depth,0,re,he,fe.data)}else{Ne&&Xe&&t.texStorage2D(n.TEXTURE_2D,de,le,we[0].width,we[0].height);for(let j=0,pe=we.length;j<pe;j++)fe=we[j],v.format!==hn?re!==null?Ne?U&&t.compressedTexSubImage2D(n.TEXTURE_2D,j,0,0,fe.width,fe.height,re,fe.data):t.compressedTexImage2D(n.TEXTURE_2D,j,le,fe.width,fe.height,0,fe.data):Be("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ne?U&&t.texSubImage2D(n.TEXTURE_2D,j,0,0,fe.width,fe.height,re,he,fe.data):t.texImage2D(n.TEXTURE_2D,j,le,fe.width,fe.height,0,re,he,fe.data)}else if(v.isDataArrayTexture)if(Ne){if(Xe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,de,le,Y.width,Y.height,Y.depth),U)if(v.layerUpdates.size>0){const j=qc(Y.width,Y.height,v.format,v.type);for(const pe of v.layerUpdates){const ve=Y.data.subarray(pe*j/Y.data.BYTES_PER_ELEMENT,(pe+1)*j/Y.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,pe,Y.width,Y.height,1,re,he,ve)}v.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,Y.width,Y.height,Y.depth,re,he,Y.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,le,Y.width,Y.height,Y.depth,0,re,he,Y.data);else if(v.isData3DTexture)Ne?(Xe&&t.texStorage3D(n.TEXTURE_3D,de,le,Y.width,Y.height,Y.depth),U&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,Y.width,Y.height,Y.depth,re,he,Y.data)):t.texImage3D(n.TEXTURE_3D,0,le,Y.width,Y.height,Y.depth,0,re,he,Y.data);else if(v.isFramebufferTexture){if(Xe)if(Ne)t.texStorage2D(n.TEXTURE_2D,de,le,Y.width,Y.height);else{let j=Y.width,pe=Y.height;for(let ve=0;ve<de;ve++)t.texImage2D(n.TEXTURE_2D,ve,le,j,pe,0,re,he,null),j>>=1,pe>>=1}}else if(v.isHTMLTexture){if("texElementImage2D"in n){const j=n.canvas;if(j.hasAttribute("layoutsubtree")||j.setAttribute("layoutsubtree","true"),Y.parentNode!==j){j.appendChild(Y),d.add(v),j.onpaint=pe=>{const ve=pe.changedElements;for(const ee of d)ve.includes(ee.image)&&(ee.needsUpdate=!0)},j.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,Y);else{const ve=n.RGBA,ee=n.RGBA,Ie=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,ve,ee,Ie,Y)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(we.length>0){if(Ne&&Xe){const j=Qe(we[0]);t.texStorage2D(n.TEXTURE_2D,de,le,j.width,j.height)}for(let j=0,pe=we.length;j<pe;j++)fe=we[j],Ne?U&&t.texSubImage2D(n.TEXTURE_2D,j,0,0,re,he,fe):t.texImage2D(n.TEXTURE_2D,j,le,re,he,fe);v.generateMipmaps=!1}else if(Ne){if(Xe){const j=Qe(Y);t.texStorage2D(n.TEXTURE_2D,de,le,j.width,j.height)}U&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,re,he,Y)}else t.texImage2D(n.TEXTURE_2D,0,le,re,he,Y);p(v)&&E(q),Z.__version=ce.version,v.onUpdate&&v.onUpdate(v)}w.__version=v.version}function ke(w,v,B){if(v.image.length!==6)return;const q=Q(w,v),K=v.source;t.bindTexture(n.TEXTURE_CUBE_MAP,w.__webglTexture,n.TEXTURE0+B);const ce=i.get(K);if(K.version!==ce.__version||q===!0){t.activeTexture(n.TEXTURE0+B);const Z=je.getPrimaries(je.workingColorSpace),G=v.colorSpace===ti?null:je.getPrimaries(v.colorSpace),Y=v.colorSpace===ti||Z===G?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Y);const re=v.isCompressedTexture||v.image[0].isCompressedTexture,he=v.image[0]&&v.image[0].isDataTexture,le=[];for(let ee=0;ee<6;ee++)!re&&!he?le[ee]=m(v.image[ee],!0,r.maxCubemapSize):le[ee]=he?v.image[ee].image:v.image[ee],le[ee]=pt(v,le[ee]);const fe=le[0],we=s.convert(v.format,v.colorSpace),Ne=s.convert(v.type),Xe=S(v.internalFormat,we,Ne,v.normalized,v.colorSpace),U=v.isVideoTexture!==!0,de=ce.__version===void 0||q===!0,j=K.dataReady;let pe=b(v,fe);We(n.TEXTURE_CUBE_MAP,v);let ve;if(re){U&&de&&t.texStorage2D(n.TEXTURE_CUBE_MAP,pe,Xe,fe.width,fe.height);for(let ee=0;ee<6;ee++){ve=le[ee].mipmaps;for(let Ie=0;Ie<ve.length;Ie++){const Ae=ve[Ie];v.format!==hn?we!==null?U?j&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ie,0,0,Ae.width,Ae.height,we,Ae.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ie,Xe,Ae.width,Ae.height,0,Ae.data):Be("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):U?j&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ie,0,0,Ae.width,Ae.height,we,Ne,Ae.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ie,Xe,Ae.width,Ae.height,0,we,Ne,Ae.data)}}}else{if(ve=v.mipmaps,U&&de){ve.length>0&&pe++;const ee=Qe(le[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,pe,Xe,ee.width,ee.height)}for(let ee=0;ee<6;ee++)if(he){U?j&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,le[ee].width,le[ee].height,we,Ne,le[ee].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,Xe,le[ee].width,le[ee].height,0,we,Ne,le[ee].data);for(let Ie=0;Ie<ve.length;Ie++){const St=ve[Ie].image[ee].image;U?j&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ie+1,0,0,St.width,St.height,we,Ne,St.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ie+1,Xe,St.width,St.height,0,we,Ne,St.data)}}else{U?j&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,we,Ne,le[ee]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,Xe,we,Ne,le[ee]);for(let Ie=0;Ie<ve.length;Ie++){const Ae=ve[Ie];U?j&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ie+1,0,0,we,Ne,Ae.image[ee]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ie+1,Xe,we,Ne,Ae.image[ee])}}}p(v)&&E(n.TEXTURE_CUBE_MAP),ce.__version=K.version,v.onUpdate&&v.onUpdate(v)}w.__version=v.version}function Ue(w,v,B,q,K,ce){const Z=s.convert(B.format,B.colorSpace),G=s.convert(B.type),Y=S(B.internalFormat,Z,G,B.normalized,B.colorSpace),re=i.get(v),he=i.get(B);if(he.__renderTarget=v,!re.__hasExternalTextures){const le=Math.max(1,v.width>>ce),fe=Math.max(1,v.height>>ce);K===n.TEXTURE_3D||K===n.TEXTURE_2D_ARRAY?t.texImage3D(K,ce,Y,le,fe,v.depth,0,Z,G,null):t.texImage2D(K,ce,Y,le,fe,0,Z,G,null)}t.bindFramebuffer(n.FRAMEBUFFER,w),rt(v)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,q,K,he.__webglTexture,0,Ge(v)):(K===n.TEXTURE_2D||K>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,q,K,he.__webglTexture,ce),t.bindFramebuffer(n.FRAMEBUFFER,null)}function xt(w,v,B){if(n.bindRenderbuffer(n.RENDERBUFFER,w),v.depthBuffer){const q=v.depthTexture,K=q&&q.isDepthTexture?q.type:null,ce=T(v.stencilBuffer,K),Z=v.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;rt(v)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ge(v),ce,v.width,v.height):B?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ge(v),ce,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,ce,v.width,v.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Z,n.RENDERBUFFER,w)}else{const q=v.textures;for(let K=0;K<q.length;K++){const ce=q[K],Z=s.convert(ce.format,ce.colorSpace),G=s.convert(ce.type),Y=S(ce.internalFormat,Z,G,ce.normalized,ce.colorSpace);rt(v)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ge(v),Y,v.width,v.height):B?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ge(v),Y,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,Y,v.width,v.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Ke(w,v,B){const q=v.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,w),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const K=i.get(v.depthTexture);if(K.__renderTarget=v,(!K.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),q){if(K.__webglInit===void 0&&(K.__webglInit=!0,v.depthTexture.addEventListener("dispose",P)),K.__webglTexture===void 0){K.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,K.__webglTexture),We(n.TEXTURE_CUBE_MAP,v.depthTexture);const re=s.convert(v.depthTexture.format),he=s.convert(v.depthTexture.type);let le;v.depthTexture.format===Hn?le=n.DEPTH_COMPONENT24:v.depthTexture.format===gi&&(le=n.DEPTH24_STENCIL8);for(let fe=0;fe<6;fe++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0,le,v.width,v.height,0,re,he,null)}}else k(v.depthTexture,0);const ce=K.__webglTexture,Z=Ge(v),G=q?n.TEXTURE_CUBE_MAP_POSITIVE_X+B:n.TEXTURE_2D,Y=v.depthTexture.format===gi?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(v.depthTexture.format===Hn)rt(v)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Y,G,ce,0,Z):n.framebufferTexture2D(n.FRAMEBUFFER,Y,G,ce,0);else if(v.depthTexture.format===gi)rt(v)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Y,G,ce,0,Z):n.framebufferTexture2D(n.FRAMEBUFFER,Y,G,ce,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function te(w){const v=i.get(w),B=w.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==w.depthTexture){const q=w.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),q){const K=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,q.removeEventListener("dispose",K)};q.addEventListener("dispose",K),v.__depthDisposeCallback=K}v.__boundDepthTexture=q}if(w.depthTexture&&!v.__autoAllocateDepthBuffer)if(B)for(let q=0;q<6;q++)Ke(v.__webglFramebuffer[q],w,q);else{const q=w.texture.mipmaps;q&&q.length>0?Ke(v.__webglFramebuffer[0],w,0):Ke(v.__webglFramebuffer,w,0)}else if(B){v.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer[q]),v.__webglDepthbuffer[q]===void 0)v.__webglDepthbuffer[q]=n.createRenderbuffer(),xt(v.__webglDepthbuffer[q],w,!1);else{const K=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ce=v.__webglDepthbuffer[q];n.bindRenderbuffer(n.RENDERBUFFER,ce),n.framebufferRenderbuffer(n.FRAMEBUFFER,K,n.RENDERBUFFER,ce)}}else{const q=w.texture.mipmaps;if(q&&q.length>0?t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=n.createRenderbuffer(),xt(v.__webglDepthbuffer,w,!1);else{const K=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ce=v.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ce),n.framebufferRenderbuffer(n.FRAMEBUFFER,K,n.RENDERBUFFER,ce)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function ae(w,v,B){const q=i.get(w);v!==void 0&&Ue(q.__webglFramebuffer,w,w.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),B!==void 0&&te(w)}function oe(w){const v=w.texture,B=i.get(w),q=i.get(v);w.addEventListener("dispose",_);const K=w.textures,ce=w.isWebGLCubeRenderTarget===!0,Z=K.length>1;if(Z||(q.__webglTexture===void 0&&(q.__webglTexture=n.createTexture()),q.__version=v.version,a.memory.textures++),ce){B.__webglFramebuffer=[];for(let G=0;G<6;G++)if(v.mipmaps&&v.mipmaps.length>0){B.__webglFramebuffer[G]=[];for(let Y=0;Y<v.mipmaps.length;Y++)B.__webglFramebuffer[G][Y]=n.createFramebuffer()}else B.__webglFramebuffer[G]=n.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){B.__webglFramebuffer=[];for(let G=0;G<v.mipmaps.length;G++)B.__webglFramebuffer[G]=n.createFramebuffer()}else B.__webglFramebuffer=n.createFramebuffer();if(Z)for(let G=0,Y=K.length;G<Y;G++){const re=i.get(K[G]);re.__webglTexture===void 0&&(re.__webglTexture=n.createTexture(),a.memory.textures++)}if(w.samples>0&&rt(w)===!1){B.__webglMultisampledFramebuffer=n.createFramebuffer(),B.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let G=0;G<K.length;G++){const Y=K[G];B.__webglColorRenderbuffer[G]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,B.__webglColorRenderbuffer[G]);const re=s.convert(Y.format,Y.colorSpace),he=s.convert(Y.type),le=S(Y.internalFormat,re,he,Y.normalized,Y.colorSpace,w.isXRRenderTarget===!0),fe=Ge(w);n.renderbufferStorageMultisample(n.RENDERBUFFER,fe,le,w.width,w.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+G,n.RENDERBUFFER,B.__webglColorRenderbuffer[G])}n.bindRenderbuffer(n.RENDERBUFFER,null),w.depthBuffer&&(B.__webglDepthRenderbuffer=n.createRenderbuffer(),xt(B.__webglDepthRenderbuffer,w,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ce){t.bindTexture(n.TEXTURE_CUBE_MAP,q.__webglTexture),We(n.TEXTURE_CUBE_MAP,v);for(let G=0;G<6;G++)if(v.mipmaps&&v.mipmaps.length>0)for(let Y=0;Y<v.mipmaps.length;Y++)Ue(B.__webglFramebuffer[G][Y],w,v,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+G,Y);else Ue(B.__webglFramebuffer[G],w,v,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+G,0);p(v)&&E(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Z){for(let G=0,Y=K.length;G<Y;G++){const re=K[G],he=i.get(re);let le=n.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(le=w.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(le,he.__webglTexture),We(le,re),Ue(B.__webglFramebuffer,w,re,n.COLOR_ATTACHMENT0+G,le,0),p(re)&&E(le)}t.unbindTexture()}else{let G=n.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(G=w.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(G,q.__webglTexture),We(G,v),v.mipmaps&&v.mipmaps.length>0)for(let Y=0;Y<v.mipmaps.length;Y++)Ue(B.__webglFramebuffer[Y],w,v,n.COLOR_ATTACHMENT0,G,Y);else Ue(B.__webglFramebuffer,w,v,n.COLOR_ATTACHMENT0,G,0);p(v)&&E(G),t.unbindTexture()}w.depthBuffer&&te(w)}function Me(w){const v=w.textures;for(let B=0,q=v.length;B<q;B++){const K=v[B];if(p(K)){const ce=A(w),Z=i.get(K).__webglTexture;t.bindTexture(ce,Z),E(ce),t.unbindTexture()}}}const Se=[],Ee=[];function Oe(w){if(w.samples>0){if(rt(w)===!1){const v=w.textures,B=w.width,q=w.height;let K=n.COLOR_BUFFER_BIT;const ce=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Z=i.get(w),G=v.length>1;if(G)for(let re=0;re<v.length;re++)t.bindFramebuffer(n.FRAMEBUFFER,Z.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+re,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Z.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+re,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Z.__webglMultisampledFramebuffer);const Y=w.texture.mipmaps;Y&&Y.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Z.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Z.__webglFramebuffer);for(let re=0;re<v.length;re++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(K|=n.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(K|=n.STENCIL_BUFFER_BIT)),G){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Z.__webglColorRenderbuffer[re]);const he=i.get(v[re]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,he,0)}n.blitFramebuffer(0,0,B,q,0,0,B,q,K,n.NEAREST),c===!0&&(Se.length=0,Ee.length=0,Se.push(n.COLOR_ATTACHMENT0+re),w.depthBuffer&&w.resolveDepthBuffer===!1&&(Se.push(ce),Ee.push(ce),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,Ee)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Se))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),G)for(let re=0;re<v.length;re++){t.bindFramebuffer(n.FRAMEBUFFER,Z.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+re,n.RENDERBUFFER,Z.__webglColorRenderbuffer[re]);const he=i.get(v[re]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Z.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+re,n.TEXTURE_2D,he,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Z.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&c){const v=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[v])}}}function Ge(w){return Math.min(r.maxSamples,w.samples)}function rt(w){const v=i.get(w);return w.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function L(w){const v=a.render.frame;f.get(w)!==v&&(f.set(w,v),w.update())}function pt(w,v){const B=w.colorSpace,q=w.format,K=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||B!==Ms&&B!==ti&&(je.getTransfer(B)===st?(q!==hn||K!==Jt)&&Be("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):it("WebGLTextures: Unsupported texture color space:",B)),v}function Qe(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(l.width=w.naturalWidth||w.width,l.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(l.width=w.displayWidth,l.height=w.displayHeight):(l.width=w.width,l.height=w.height),l}this.allocateTextureUnit=H,this.resetTextureUnits=O,this.getTextureUnits=V,this.setTextureUnits=D,this.setTexture2D=k,this.setTexture2DArray=J,this.setTexture3D=ne,this.setTextureCube=se,this.rebindTextures=ae,this.setupRenderTarget=oe,this.updateRenderTargetMipmap=Me,this.updateMultisampleRenderTarget=Oe,this.setupDepthRenderbuffer=te,this.setupFrameBufferTexture=Ue,this.useMultisampledRTT=rt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function Jg(n,e){function t(i,r=ti){let s;const a=je.getTransfer(r);if(i===Jt)return n.UNSIGNED_BYTE;if(i===To)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Ao)return n.UNSIGNED_SHORT_5_5_5_1;if(i===$l)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Kl)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===ql)return n.BYTE;if(i===Yl)return n.SHORT;if(i===yr)return n.UNSIGNED_SHORT;if(i===bo)return n.INT;if(i===An)return n.UNSIGNED_INT;if(i===dn)return n.FLOAT;if(i===Vn)return n.HALF_FLOAT;if(i===Zl)return n.ALPHA;if(i===Jl)return n.RGB;if(i===hn)return n.RGBA;if(i===Hn)return n.DEPTH_COMPONENT;if(i===gi)return n.DEPTH_STENCIL;if(i===Ro)return n.RED;if(i===Co)return n.RED_INTEGER;if(i===yi)return n.RG;if(i===wo)return n.RG_INTEGER;if(i===Po)return n.RGBA_INTEGER;if(i===fs||i===ds||i===hs||i===ps)if(a===st)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===fs)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===ds)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===hs)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===ps)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===fs)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===ds)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===hs)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===ps)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Oa||i===Ba||i===ka||i===za)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Oa)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Ba)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===ka)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===za)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Ga||i===Va||i===Ha||i===Wa||i===Xa||i===xs||i===qa)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Ga||i===Va)return a===st?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Ha)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(i===Wa)return s.COMPRESSED_R11_EAC;if(i===Xa)return s.COMPRESSED_SIGNED_R11_EAC;if(i===xs)return s.COMPRESSED_RG11_EAC;if(i===qa)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Ya||i===$a||i===Ka||i===Za||i===Ja||i===Qa||i===ja||i===eo||i===to||i===no||i===io||i===ro||i===so||i===ao)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Ya)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===$a)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Ka)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Za)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ja)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Qa)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===ja)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===eo)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===to)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===no)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===io)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===ro)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===so)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===ao)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===oo||i===co||i===lo)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===oo)return a===st?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===co)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===lo)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===uo||i===fo||i===vs||i===ho)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===uo)return s.COMPRESSED_RED_RGTC1_EXT;if(i===fo)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===vs)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===ho)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Er?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const Qg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,jg=`
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

}`;class e_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new ou(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Rn({vertexShader:Qg,fragmentShader:jg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ft(new Is(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class t_ extends bi{constructor(e,t){super();const i=this;let r=null,s=1,a=null,o="local-floor",c=1,l=null,f=null,d=null,u=null,h=null,g=null;const x=typeof XRWebGLBinding<"u",m=new e_,p={},E=t.getContextAttributes();let A=null,S=null;const T=[],b=[],P=new tt;let _=null;const M=new un;M.viewport=new vt;const R=new un;R.viewport=new vt;const C=[M,R],I=new fh;let O=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let ue=T[Q];return ue===void 0&&(ue=new Zs,T[Q]=ue),ue.getTargetRaySpace()},this.getControllerGrip=function(Q){let ue=T[Q];return ue===void 0&&(ue=new Zs,T[Q]=ue),ue.getGripSpace()},this.getHand=function(Q){let ue=T[Q];return ue===void 0&&(ue=new Zs,T[Q]=ue),ue.getHandSpace()};function D(Q){const ue=b.indexOf(Q.inputSource);if(ue===-1)return;const ie=T[ue];ie!==void 0&&(ie.update(Q.inputSource,Q.frame,l||a),ie.dispatchEvent({type:Q.type,data:Q.inputSource}))}function H(){r.removeEventListener("select",D),r.removeEventListener("selectstart",D),r.removeEventListener("selectend",D),r.removeEventListener("squeeze",D),r.removeEventListener("squeezestart",D),r.removeEventListener("squeezeend",D),r.removeEventListener("end",H),r.removeEventListener("inputsourceschange",F);for(let Q=0;Q<T.length;Q++){const ue=b[Q];ue!==null&&(b[Q]=null,T[Q].disconnect(ue))}O=null,V=null,m.reset();for(const Q in p)delete p[Q];e.setRenderTarget(A),h=null,u=null,d=null,r=null,S=null,We.stop(),i.isPresenting=!1,e.setPixelRatio(_),e.setSize(P.width,P.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){s=Q,i.isPresenting===!0&&Be("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){o=Q,i.isPresenting===!0&&Be("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(Q){l=Q},this.getBaseLayer=function(){return u!==null?u:h},this.getBinding=function(){return d===null&&x&&(d=new XRWebGLBinding(r,t)),d},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(Q){if(r=Q,r!==null){if(A=e.getRenderTarget(),r.addEventListener("select",D),r.addEventListener("selectstart",D),r.addEventListener("selectend",D),r.addEventListener("squeeze",D),r.addEventListener("squeezestart",D),r.addEventListener("squeezeend",D),r.addEventListener("end",H),r.addEventListener("inputsourceschange",F),E.xrCompatible!==!0&&await t.makeXRCompatible(),_=e.getPixelRatio(),e.getSize(P),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let ie=null,Fe=null,ke=null;E.depth&&(ke=E.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ie=E.stencil?gi:Hn,Fe=E.stencil?Er:An);const Ue={colorFormat:t.RGBA8,depthFormat:ke,scaleFactor:s};d=this.getBinding(),u=d.createProjectionLayer(Ue),r.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),S=new Tn(u.textureWidth,u.textureHeight,{format:hn,type:Jt,depthTexture:new tr(u.textureWidth,u.textureHeight,Fe,void 0,void 0,void 0,void 0,void 0,void 0,ie),stencilBuffer:E.stencil,colorSpace:e.outputColorSpace,samples:E.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{const ie={antialias:E.antialias,alpha:!0,depth:E.depth,stencil:E.stencil,framebufferScaleFactor:s};h=new XRWebGLLayer(r,t,ie),r.updateRenderState({baseLayer:h}),e.setPixelRatio(1),e.setSize(h.framebufferWidth,h.framebufferHeight,!1),S=new Tn(h.framebufferWidth,h.framebufferHeight,{format:hn,type:Jt,colorSpace:e.outputColorSpace,stencilBuffer:E.stencil,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await r.requestReferenceSpace(o),We.setContext(r),We.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function F(Q){for(let ue=0;ue<Q.removed.length;ue++){const ie=Q.removed[ue],Fe=b.indexOf(ie);Fe>=0&&(b[Fe]=null,T[Fe].disconnect(ie))}for(let ue=0;ue<Q.added.length;ue++){const ie=Q.added[ue];let Fe=b.indexOf(ie);if(Fe===-1){for(let Ue=0;Ue<T.length;Ue++)if(Ue>=b.length){b.push(ie),Fe=Ue;break}else if(b[Ue]===null){b[Ue]=ie,Fe=Ue;break}if(Fe===-1)break}const ke=T[Fe];ke&&ke.connect(ie)}}const k=new z,J=new z;function ne(Q,ue,ie){k.setFromMatrixPosition(ue.matrixWorld),J.setFromMatrixPosition(ie.matrixWorld);const Fe=k.distanceTo(J),ke=ue.projectionMatrix.elements,Ue=ie.projectionMatrix.elements,xt=ke[14]/(ke[10]-1),Ke=ke[14]/(ke[10]+1),te=(ke[9]+1)/ke[5],ae=(ke[9]-1)/ke[5],oe=(ke[8]-1)/ke[0],Me=(Ue[8]+1)/Ue[0],Se=xt*oe,Ee=xt*Me,Oe=Fe/(-oe+Me),Ge=Oe*-oe;if(ue.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(Ge),Q.translateZ(Oe),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert(),ke[10]===-1)Q.projectionMatrix.copy(ue.projectionMatrix),Q.projectionMatrixInverse.copy(ue.projectionMatrixInverse);else{const rt=xt+Oe,L=Ke+Oe,pt=Se-Ge,Qe=Ee+(Fe-Ge),w=te*Ke/L*rt,v=ae*Ke/L*rt;Q.projectionMatrix.makePerspective(pt,Qe,w,v,rt,L),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}}function se(Q,ue){ue===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(ue.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(r===null)return;let ue=Q.near,ie=Q.far;m.texture!==null&&(m.depthNear>0&&(ue=m.depthNear),m.depthFar>0&&(ie=m.depthFar)),I.near=R.near=M.near=ue,I.far=R.far=M.far=ie,(O!==I.near||V!==I.far)&&(r.updateRenderState({depthNear:I.near,depthFar:I.far}),O=I.near,V=I.far),I.layers.mask=Q.layers.mask|6,M.layers.mask=I.layers.mask&-5,R.layers.mask=I.layers.mask&-3;const Fe=Q.parent,ke=I.cameras;se(I,Fe);for(let Ue=0;Ue<ke.length;Ue++)se(ke[Ue],Fe);ke.length===2?ne(I,M,R):I.projectionMatrix.copy(M.projectionMatrix),me(Q,I,Fe)};function me(Q,ue,ie){ie===null?Q.matrix.copy(ue.matrixWorld):(Q.matrix.copy(ie.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(ue.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(ue.projectionMatrix),Q.projectionMatrixInverse.copy(ue.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=mo*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return I},this.getFoveation=function(){if(!(u===null&&h===null))return c},this.setFoveation=function(Q){c=Q,u!==null&&(u.fixedFoveation=Q),h!==null&&h.fixedFoveation!==void 0&&(h.fixedFoveation=Q)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(I)},this.getCameraTexture=function(Q){return p[Q]};let Pe=null;function Te(Q,ue){if(f=ue.getViewerPose(l||a),g=ue,f!==null){const ie=f.views;h!==null&&(e.setRenderTargetFramebuffer(S,h.framebuffer),e.setRenderTarget(S));let Fe=!1;ie.length!==I.cameras.length&&(I.cameras.length=0,Fe=!0);for(let Ke=0;Ke<ie.length;Ke++){const te=ie[Ke];let ae=null;if(h!==null)ae=h.getViewport(te);else{const Me=d.getViewSubImage(u,te);ae=Me.viewport,Ke===0&&(e.setRenderTargetTextures(S,Me.colorTexture,Me.depthStencilTexture),e.setRenderTarget(S))}let oe=C[Ke];oe===void 0&&(oe=new un,oe.layers.enable(Ke),oe.viewport=new vt,C[Ke]=oe),oe.matrix.fromArray(te.transform.matrix),oe.matrix.decompose(oe.position,oe.quaternion,oe.scale),oe.projectionMatrix.fromArray(te.projectionMatrix),oe.projectionMatrixInverse.copy(oe.projectionMatrix).invert(),oe.viewport.set(ae.x,ae.y,ae.width,ae.height),Ke===0&&(I.matrix.copy(oe.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale)),Fe===!0&&I.cameras.push(oe)}const ke=r.enabledFeatures;if(ke&&ke.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&x){d=i.getBinding();const Ke=d.getDepthInformation(ie[0]);Ke&&Ke.isValid&&Ke.texture&&m.init(Ke,r.renderState)}if(ke&&ke.includes("camera-access")&&x){e.state.unbindTexture(),d=i.getBinding();for(let Ke=0;Ke<ie.length;Ke++){const te=ie[Ke].camera;if(te){let ae=p[te];ae||(ae=new ou,p[te]=ae);const oe=d.getCameraImage(te);ae.sourceTexture=oe}}}}for(let ie=0;ie<T.length;ie++){const Fe=b[ie],ke=T[ie];Fe!==null&&ke!==void 0&&ke.update(Fe,ue,l||a)}Pe&&Pe(Q,ue),ue.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ue}),g=null}const We=new uu;We.setAnimationLoop(Te),this.setAnimationLoop=function(Q){Pe=Q},this.dispose=function(){}}}const n_=new _t,_u=new Ve;_u.set(-1,0,0,0,1,0,0,0,1);function i_(n,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,cu(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function r(m,p,E,A,S){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?s(m,p):p.isMeshLambertMaterial?(s(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(s(m,p),d(m,p)):p.isMeshPhongMaterial?(s(m,p),f(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(s(m,p),u(m,p),p.isMeshPhysicalMaterial&&h(m,p,S)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),x(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?c(m,p,E,A):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Xt&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Xt&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const E=e.get(p),A=E.envMap,S=E.envMapRotation;A&&(m.envMap.value=A,m.envMapRotation.value.setFromMatrix4(n_.makeRotationFromEuler(S)).transpose(),A.isCubeTexture&&A.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(_u),m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,E,A){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*E,m.scale.value=A*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function f(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function d(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function u(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function h(m,p,E){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Xt&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=E.texture,m.transmissionSamplerSize.value.set(E.width,E.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function x(m,p){const E=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(E.matrixWorld),m.nearDistance.value=E.shadow.camera.near,m.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function r_(n,e,t,i){let r={},s={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(S,T){const b=T.program;i.uniformBlockBinding(S,b)}function l(S,T){let b=r[S.id];b===void 0&&(m(S),b=f(S),r[S.id]=b,S.addEventListener("dispose",E));const P=T.program;i.updateUBOMapping(S,P);const _=e.render.frame;s[S.id]!==_&&(u(S),s[S.id]=_)}function f(S){const T=d();S.__bindingPointIndex=T;const b=n.createBuffer(),P=S.__size,_=S.usage;return n.bindBuffer(n.UNIFORM_BUFFER,b),n.bufferData(n.UNIFORM_BUFFER,P,_),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,T,b),b}function d(){for(let S=0;S<o;S++)if(a.indexOf(S)===-1)return a.push(S),S;return it("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(S){const T=r[S.id],b=S.uniforms,P=S.__cache;n.bindBuffer(n.UNIFORM_BUFFER,T);for(let _=0,M=b.length;_<M;_++){const R=b[_];if(Array.isArray(R))for(let C=0,I=R.length;C<I;C++)h(R[C],_,C,P);else h(R,_,0,P)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function h(S,T,b,P){if(x(S,T,b,P)===!0){const _=S.__offset,M=S.value;if(Array.isArray(M)){let R=0;for(let C=0;C<M.length;C++){const I=M[C],O=p(I);g(I,S.__data,R),typeof I!="number"&&typeof I!="boolean"&&!I.isMatrix3&&!ArrayBuffer.isView(I)&&(R+=O.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(M,S.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,_,S.__data)}}function g(S,T,b){typeof S=="number"||typeof S=="boolean"?T[0]=S:S.isMatrix3?(T[0]=S.elements[0],T[1]=S.elements[1],T[2]=S.elements[2],T[3]=0,T[4]=S.elements[3],T[5]=S.elements[4],T[6]=S.elements[5],T[7]=0,T[8]=S.elements[6],T[9]=S.elements[7],T[10]=S.elements[8],T[11]=0):ArrayBuffer.isView(S)?T.set(new S.constructor(S.buffer,S.byteOffset,T.length)):S.toArray(T,b)}function x(S,T,b,P){const _=S.value,M=T+"_"+b;if(P[M]===void 0)return typeof _=="number"||typeof _=="boolean"?P[M]=_:ArrayBuffer.isView(_)?P[M]=_.slice():P[M]=_.clone(),!0;{const R=P[M];if(typeof _=="number"||typeof _=="boolean"){if(R!==_)return P[M]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(R.equals(_)===!1)return R.copy(_),!0}}return!1}function m(S){const T=S.uniforms;let b=0;const P=16;for(let M=0,R=T.length;M<R;M++){const C=Array.isArray(T[M])?T[M]:[T[M]];for(let I=0,O=C.length;I<O;I++){const V=C[I],D=Array.isArray(V.value)?V.value:[V.value];for(let H=0,F=D.length;H<F;H++){const k=D[H],J=p(k),ne=b%P,se=ne%J.boundary,me=ne+se;b+=se,me!==0&&P-me<J.storage&&(b+=P-me),V.__data=new Float32Array(J.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=b,b+=J.storage}}}const _=b%P;return _>0&&(b+=P-_),S.__size=b,S.__cache={},this}function p(S){const T={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(T.boundary=4,T.storage=4):S.isVector2?(T.boundary=8,T.storage=8):S.isVector3||S.isColor?(T.boundary=16,T.storage=12):S.isVector4?(T.boundary=16,T.storage=16):S.isMatrix3?(T.boundary=48,T.storage=48):S.isMatrix4?(T.boundary=64,T.storage=64):S.isTexture?Be("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(S)?(T.boundary=16,T.storage=S.byteLength):Be("WebGLRenderer: Unsupported uniform value type.",S),T}function E(S){const T=S.target;T.removeEventListener("dispose",E);const b=a.indexOf(T.__bindingPointIndex);a.splice(b,1),n.deleteBuffer(r[T.id]),delete r[T.id],delete s[T.id]}function A(){for(const S in r)n.deleteBuffer(r[S]);a=[],r={},s={}}return{bind:c,update:l,dispose:A}}const s_=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Mn=null;function a_(){return Mn===null&&(Mn=new su(s_,16,16,yi,Vn),Mn.name="DFG_LUT",Mn.minFilter=Bt,Mn.magFilter=Bt,Mn.wrapS=On,Mn.wrapT=On,Mn.generateMipmaps=!1,Mn.needsUpdate=!0),Mn}class o_{constructor(e={}){const{canvas:t=bd(),context:i=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:f="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:h=Jt}=e;this.isWebGLRenderer=!0;let g;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=i.getContextAttributes().alpha}else g=a;const x=h,m=new Set([Po,wo,Co]),p=new Set([Jt,An,yr,Er,To,Ao]),E=new Uint32Array(4),A=new Int32Array(4),S=new z;let T=null,b=null;const P=[],_=[];let M=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=bn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const R=this;let C=!1,I=null,O=null,V=null,D=null;this._outputColorSpace=Zt;let H=0,F=0,k=null,J=-1,ne=null;const se=new vt,me=new vt;let Pe=null;const Te=new Je(0);let We=0,Q=t.width,ue=t.height,ie=1,Fe=null,ke=null;const Ue=new vt(0,0,Q,ue),xt=new vt(0,0,Q,ue);let Ke=!1;const te=new No;let ae=!1,oe=!1;const Me=new _t,Se=new z,Ee=new vt,Oe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ge=!1;function rt(){return k===null?ie:1}let L=i;function pt(y,N){return t.getContext(y,N)}try{const y={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:f,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${yo}`),t.addEventListener("webglcontextlost",St,!1),t.addEventListener("webglcontextrestored",dt,!1),t.addEventListener("webglcontextcreationerror",gn,!1),L===null){const N="webgl2";if(L=pt(N,y),L===null)throw pt(N)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(y){throw it("WebGLRenderer: "+y.message),y}let Qe,w,v,B,q,K,ce,Z,G,Y,re,he,le,fe,we,Ne,Xe,U,de,j,pe,ve,ee;function Ie(){Qe=new a0(L),Qe.init(),pe=new Jg(L,Qe),w=new Qm(L,Qe,e,pe),v=new Kg(L,Qe),w.reversedDepthBuffer&&u&&v.buffers.depth.setReversed(!0),O=L.createFramebuffer(),V=L.createFramebuffer(),D=L.createFramebuffer(),B=new l0(L),q=new Ng,K=new Zg(L,Qe,v,q,w,pe,B),ce=new s0(R),Z=new hh(L),ve=new Zm(L,Z),G=new o0(L,Z,B,ve),Y=new f0(L,G,Z,ve,B),U=new u0(L,w,K),we=new jm(q),re=new Ug(R,ce,Qe,w,ve,we),he=new i_(R,q),le=new Og,fe=new Hg(Qe),Xe=new Km(R,ce,v,Y,g,c),Ne=new $g(R,Y,w),ee=new r_(L,B,w,v),de=new Jm(L,Qe,B),j=new c0(L,Qe,B),B.programs=re.programs,R.capabilities=w,R.extensions=Qe,R.properties=q,R.renderLists=le,R.shadowMap=Ne,R.state=v,R.info=B}Ie(),x!==Jt&&(M=new h0(x,t.width,t.height,o,r,s));const Ae=new t_(R,L);this.xr=Ae,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const y=Qe.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=Qe.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return ie},this.setPixelRatio=function(y){y!==void 0&&(ie=y,this.setSize(Q,ue,!1))},this.getSize=function(y){return y.set(Q,ue)},this.setSize=function(y,N,$=!0){if(Ae.isPresenting){Be("WebGLRenderer: Can't change size while VR device is presenting.");return}Q=y,ue=N,t.width=Math.floor(y*ie),t.height=Math.floor(N*ie),$===!0&&(t.style.width=y+"px",t.style.height=N+"px"),M!==null&&M.setSize(t.width,t.height),this.setViewport(0,0,y,N)},this.getDrawingBufferSize=function(y){return y.set(Q*ie,ue*ie).floor()},this.setDrawingBufferSize=function(y,N,$){Q=y,ue=N,ie=$,t.width=Math.floor(y*$),t.height=Math.floor(N*$),this.setViewport(0,0,y,N)},this.setEffects=function(y){if(x===Jt){it("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(y){for(let N=0;N<y.length;N++)if(y[N].isOutputPass===!0){Be("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}M.setEffects(y||[])},this.getCurrentViewport=function(y){return y.copy(se)},this.getViewport=function(y){return y.copy(Ue)},this.setViewport=function(y,N,$,W){y.isVector4?Ue.set(y.x,y.y,y.z,y.w):Ue.set(y,N,$,W),v.viewport(se.copy(Ue).multiplyScalar(ie).round())},this.getScissor=function(y){return y.copy(xt)},this.setScissor=function(y,N,$,W){y.isVector4?xt.set(y.x,y.y,y.z,y.w):xt.set(y,N,$,W),v.scissor(me.copy(xt).multiplyScalar(ie).round())},this.getScissorTest=function(){return Ke},this.setScissorTest=function(y){v.setScissorTest(Ke=y)},this.setOpaqueSort=function(y){Fe=y},this.setTransparentSort=function(y){ke=y},this.getClearColor=function(y){return y.copy(Xe.getClearColor())},this.setClearColor=function(){Xe.setClearColor(...arguments)},this.getClearAlpha=function(){return Xe.getClearAlpha()},this.setClearAlpha=function(){Xe.setClearAlpha(...arguments)},this.clear=function(y=!0,N=!0,$=!0){let W=0;if(y){let X=!1;if(k!==null){const xe=k.texture.format;X=m.has(xe)}if(X){const xe=k.texture.type,be=p.has(xe),_e=Xe.getClearColor(),Ce=Xe.getClearAlpha(),De=_e.r,qe=_e.g,$e=_e.b;be?(E[0]=De,E[1]=qe,E[2]=$e,E[3]=Ce,L.clearBufferuiv(L.COLOR,0,E)):(A[0]=De,A[1]=qe,A[2]=$e,A[3]=Ce,L.clearBufferiv(L.COLOR,0,A))}else W|=L.COLOR_BUFFER_BIT}N&&(W|=L.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),$&&(W|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),W!==0&&L.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(y){y.setRenderer(this),I=y},this.dispose=function(){t.removeEventListener("webglcontextlost",St,!1),t.removeEventListener("webglcontextrestored",dt,!1),t.removeEventListener("webglcontextcreationerror",gn,!1),Xe.dispose(),le.dispose(),fe.dispose(),q.dispose(),ce.dispose(),Y.dispose(),ve.dispose(),ee.dispose(),re.dispose(),Ae.dispose(),Ae.removeEventListener("sessionstart",Wo),Ae.removeEventListener("sessionend",Xo),oi.stop()};function St(y){y.preventDefault(),yc("WebGLRenderer: Context Lost."),C=!0}function dt(){yc("WebGLRenderer: Context Restored."),C=!1;const y=B.autoReset,N=Ne.enabled,$=Ne.autoUpdate,W=Ne.needsUpdate,X=Ne.type;Ie(),B.autoReset=y,Ne.enabled=N,Ne.autoUpdate=$,Ne.needsUpdate=W,Ne.type=X}function gn(y){it("WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function _n(y){const N=y.target;N.removeEventListener("dispose",_n),Eu(N)}function Eu(y){bu(y),q.remove(y)}function bu(y){const N=q.get(y).programs;N!==void 0&&(N.forEach(function($){re.releaseProgram($)}),y.isShaderMaterial&&re.releaseShaderCache(y))}this.renderBufferDirect=function(y,N,$,W,X,xe){N===null&&(N=Oe);const be=X.isMesh&&X.matrixWorld.determinantAffine()<0,_e=Ru(y,N,$,W,X);v.setMaterial(W,be);let Ce=$.index,De=1;if(W.wireframe===!0){if(Ce=G.getWireframeAttribute($),Ce===void 0)return;De=2}const qe=$.drawRange,$e=$.attributes.position;let Le=qe.start*De,at=(qe.start+qe.count)*De;xe!==null&&(Le=Math.max(Le,xe.start*De),at=Math.min(at,(xe.start+xe.count)*De)),Ce!==null?(Le=Math.max(Le,0),at=Math.min(at,Ce.count)):$e!=null&&(Le=Math.max(Le,0),at=Math.min(at,$e.count));const Et=at-Le;if(Et<0||Et===1/0)return;ve.setup(X,W,_e,$,Ce);let yt,ot=de;if(Ce!==null&&(yt=Z.get(Ce),ot=j,ot.setIndex(yt)),X.isMesh)W.wireframe===!0?(v.setLineWidth(W.wireframeLinewidth*rt()),ot.setMode(L.LINES)):ot.setMode(L.TRIANGLES);else if(X.isLine){let Ut=W.linewidth;Ut===void 0&&(Ut=1),v.setLineWidth(Ut*rt()),X.isLineSegments?ot.setMode(L.LINES):X.isLineLoop?ot.setMode(L.LINE_LOOP):ot.setMode(L.LINE_STRIP)}else X.isPoints?ot.setMode(L.POINTS):X.isSprite&&ot.setMode(L.TRIANGLES);if(X.isBatchedMesh)if(Qe.get("WEBGL_multi_draw"))ot.renderMultiDraw(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount);else{const Ut=X._multiDrawStarts,ye=X._multiDrawCounts,Yt=X._multiDrawCount,nt=Ce?Z.get(Ce).bytesPerElement:1,en=q.get(W).currentProgram.getUniforms();for(let xn=0;xn<Yt;xn++)en.setValue(L,"_gl_DrawID",xn),ot.render(Ut[xn]/nt,ye[xn])}else if(X.isInstancedMesh)ot.renderInstances(Le,Et,X.count);else if($.isInstancedBufferGeometry){const Ut=$._maxInstanceCount!==void 0?$._maxInstanceCount:1/0,ye=Math.min($.instanceCount,Ut);ot.renderInstances(Le,Et,ye)}else ot.render(Le,Et)};function Ho(y,N,$){y.transparent===!0&&y.side===Fn&&y.forceSinglePass===!1?(y.side=Xt,y.needsUpdate=!0,Ir(y,N,$),y.side=ri,y.needsUpdate=!0,Ir(y,N,$),y.side=Fn):Ir(y,N,$)}this.compile=function(y,N,$=null){$===null&&($=y),b=fe.get($),b.init(N),_.push(b),$.traverseVisible(function(X){X.isLight&&X.layers.test(N.layers)&&(b.pushLight(X),X.castShadow&&b.pushShadow(X))}),y!==$&&y.traverseVisible(function(X){X.isLight&&X.layers.test(N.layers)&&(b.pushLight(X),X.castShadow&&b.pushShadow(X))}),b.setupLights();const W=new Set;return y.traverse(function(X){if(!(X.isMesh||X.isPoints||X.isLine||X.isSprite))return;const xe=X.material;if(xe)if(Array.isArray(xe))for(let be=0;be<xe.length;be++){const _e=xe[be];Ho(_e,$,X),W.add(_e)}else Ho(xe,$,X),W.add(xe)}),b=_.pop(),W},this.compileAsync=function(y,N,$=null){const W=this.compile(y,N,$);return new Promise(X=>{function xe(){if(W.forEach(function(be){q.get(be).currentProgram.isReady()&&W.delete(be)}),W.size===0){X(y);return}setTimeout(xe,10)}Qe.get("KHR_parallel_shader_compile")!==null?xe():setTimeout(xe,10)})};let Ns=null;function Tu(y){Ns&&Ns(y)}function Wo(){oi.stop()}function Xo(){oi.start()}const oi=new uu;oi.setAnimationLoop(Tu),typeof self<"u"&&oi.setContext(self),this.setAnimationLoop=function(y){Ns=y,Ae.setAnimationLoop(y),y===null?oi.stop():oi.start()},Ae.addEventListener("sessionstart",Wo),Ae.addEventListener("sessionend",Xo),this.render=function(y,N){if(N!==void 0&&N.isCamera!==!0){it("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;I!==null&&I.renderStart(y,N);const $=Ae.enabled===!0&&Ae.isPresenting===!0,W=M!==null&&(k===null||$)&&M.begin(R,k);if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),Ae.enabled===!0&&Ae.isPresenting===!0&&(M===null||M.isCompositing()===!1)&&(Ae.cameraAutoUpdate===!0&&Ae.updateCamera(N),N=Ae.getCamera()),y.isScene===!0&&y.onBeforeRender(R,y,N,k),b=fe.get(y,_.length),b.init(N),b.state.textureUnits=K.getTextureUnits(),_.push(b),Me.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),te.setFromProjectionMatrix(Me,En,N.reversedDepth),oe=this.localClippingEnabled,ae=we.init(this.clippingPlanes,oe),T=le.get(y,P.length),T.init(),P.push(T),Ae.enabled===!0&&Ae.isPresenting===!0){const be=R.xr.getDepthSensingMesh();be!==null&&Fs(be,N,-1/0,R.sortObjects)}Fs(y,N,0,R.sortObjects),T.finish(),R.sortObjects===!0&&T.sort(Fe,ke,N.reversedDepth),Ge=Ae.enabled===!1||Ae.isPresenting===!1||Ae.hasDepthSensing()===!1,Ge&&Xe.addToRenderList(T,y),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ae===!0&&we.beginShadows();const X=b.state.shadowsArray;if(Ne.render(X,y,N),ae===!0&&we.endShadows(),(W&&M.hasRenderPass())===!1){const be=T.opaque,_e=T.transmissive;if(b.setupLights(),N.isArrayCamera){const Ce=N.cameras;if(_e.length>0)for(let De=0,qe=Ce.length;De<qe;De++){const $e=Ce[De];Yo(be,_e,y,$e)}Ge&&Xe.render(y);for(let De=0,qe=Ce.length;De<qe;De++){const $e=Ce[De];qo(T,y,$e,$e.viewport)}}else _e.length>0&&Yo(be,_e,y,N),Ge&&Xe.render(y),qo(T,y,N)}k!==null&&F===0&&(K.updateMultisampleRenderTarget(k),K.updateRenderTargetMipmap(k)),W&&M.end(R),y.isScene===!0&&y.onAfterRender(R,y,N),ve.resetDefaultState(),J=-1,ne=null,_.pop(),_.length>0?(b=_[_.length-1],K.setTextureUnits(b.state.textureUnits),ae===!0&&we.setGlobalState(R.clippingPlanes,b.state.camera)):b=null,P.pop(),P.length>0?T=P[P.length-1]:T=null,I!==null&&I.renderEnd()};function Fs(y,N,$,W){if(y.visible===!1)return;if(y.layers.test(N.layers)){if(y.isGroup)$=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(N);else if(y.isLightProbeGrid)b.pushLightProbeGrid(y);else if(y.isLight)b.pushLight(y),y.castShadow&&b.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||te.intersectsSprite(y)){W&&Ee.setFromMatrixPosition(y.matrixWorld).applyMatrix4(Me);const be=Y.update(y),_e=y.material;_e.visible&&T.push(y,be,_e,$,Ee.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||te.intersectsObject(y))){const be=Y.update(y),_e=y.material;if(W&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),Ee.copy(y.boundingSphere.center)):(be.boundingSphere===null&&be.computeBoundingSphere(),Ee.copy(be.boundingSphere.center)),Ee.applyMatrix4(y.matrixWorld).applyMatrix4(Me)),Array.isArray(_e)){const Ce=be.groups;for(let De=0,qe=Ce.length;De<qe;De++){const $e=Ce[De],Le=_e[$e.materialIndex];Le&&Le.visible&&T.push(y,be,Le,$,Ee.z,$e)}}else _e.visible&&T.push(y,be,_e,$,Ee.z,null)}}const xe=y.children;for(let be=0,_e=xe.length;be<_e;be++)Fs(xe[be],N,$,W)}function qo(y,N,$,W){const{opaque:X,transmissive:xe,transparent:be}=y;b.setupLightsView($),ae===!0&&we.setGlobalState(R.clippingPlanes,$),W&&v.viewport(se.copy(W)),X.length>0&&Pr(X,N,$),xe.length>0&&Pr(xe,N,$),be.length>0&&Pr(be,N,$),v.buffers.depth.setTest(!0),v.buffers.depth.setMask(!0),v.buffers.color.setMask(!0),v.setPolygonOffset(!1)}function Yo(y,N,$,W){if(($.isScene===!0?$.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[W.id]===void 0){const Le=Qe.has("EXT_color_buffer_half_float")||Qe.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[W.id]=new Tn(1,1,{generateMipmaps:!0,type:Le?Vn:Jt,minFilter:mi,samples:Math.max(4,w.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:je.workingColorSpace})}const xe=b.state.transmissionRenderTarget[W.id],be=W.viewport||se;xe.setSize(be.z*R.transmissionResolutionScale,be.w*R.transmissionResolutionScale);const _e=R.getRenderTarget(),Ce=R.getActiveCubeFace(),De=R.getActiveMipmapLevel();R.setRenderTarget(xe),R.getClearColor(Te),We=R.getClearAlpha(),We<1&&R.setClearColor(16777215,.5),R.clear(),Ge&&Xe.render($);const qe=R.toneMapping;R.toneMapping=bn;const $e=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),b.setupLightsView(W),ae===!0&&we.setGlobalState(R.clippingPlanes,W),Pr(y,$,W),K.updateMultisampleRenderTarget(xe),K.updateRenderTargetMipmap(xe),Qe.has("WEBGL_multisampled_render_to_texture")===!1){let Le=!1;for(let at=0,Et=N.length;at<Et;at++){const yt=N[at],{object:ot,geometry:Ut,material:ye,group:Yt}=yt;if(ye.side===Fn&&ot.layers.test(W.layers)){const nt=ye.side;ye.side=Xt,ye.needsUpdate=!0,$o(ot,$,W,Ut,ye,Yt),ye.side=nt,ye.needsUpdate=!0,Le=!0}}Le===!0&&(K.updateMultisampleRenderTarget(xe),K.updateRenderTargetMipmap(xe))}R.setRenderTarget(_e,Ce,De),R.setClearColor(Te,We),$e!==void 0&&(W.viewport=$e),R.toneMapping=qe}function Pr(y,N,$){const W=N.isScene===!0?N.overrideMaterial:null;for(let X=0,xe=y.length;X<xe;X++){const be=y[X],{object:_e,geometry:Ce,group:De}=be;let qe=be.material;qe.allowOverride===!0&&W!==null&&(qe=W),_e.layers.test($.layers)&&$o(_e,N,$,Ce,qe,De)}}function $o(y,N,$,W,X,xe){y.onBeforeRender(R,N,$,W,X,xe),y.modelViewMatrix.multiplyMatrices($.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),X.onBeforeRender(R,N,$,W,y,xe),X.transparent===!0&&X.side===Fn&&X.forceSinglePass===!1?(X.side=Xt,X.needsUpdate=!0,R.renderBufferDirect($,N,W,X,y,xe),X.side=ri,X.needsUpdate=!0,R.renderBufferDirect($,N,W,X,y,xe),X.side=Fn):R.renderBufferDirect($,N,W,X,y,xe),y.onAfterRender(R,N,$,W,X,xe)}function Ir(y,N,$){N.isScene!==!0&&(N=Oe);const W=q.get(y),X=b.state.lights,xe=b.state.shadowsArray,be=X.state.version,_e=re.getParameters(y,X.state,xe,N,$,b.state.lightProbeGridArray),Ce=re.getProgramCacheKey(_e);let De=W.programs;W.environment=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?N.environment:null,W.fog=N.fog;const qe=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap;W.envMap=ce.get(y.envMap||W.environment,qe),W.envMapRotation=W.environment!==null&&y.envMap===null?N.environmentRotation:y.envMapRotation,De===void 0&&(y.addEventListener("dispose",_n),De=new Map,W.programs=De);let $e=De.get(Ce);if($e!==void 0){if(W.currentProgram===$e&&W.lightsStateVersion===be)return Zo(y,_e),$e}else _e.uniforms=re.getUniforms(y),I!==null&&y.isNodeMaterial&&I.build(y,$,_e),y.onBeforeCompile(_e,R),$e=re.acquireProgram(_e,Ce),De.set(Ce,$e),W.uniforms=_e.uniforms;const Le=W.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(Le.clippingPlanes=we.uniform),Zo(y,_e),W.needsLights=wu(y),W.lightsStateVersion=be,W.needsLights&&(Le.ambientLightColor.value=X.state.ambient,Le.lightProbe.value=X.state.probe,Le.directionalLights.value=X.state.directional,Le.directionalLightShadows.value=X.state.directionalShadow,Le.spotLights.value=X.state.spot,Le.spotLightShadows.value=X.state.spotShadow,Le.rectAreaLights.value=X.state.rectArea,Le.ltc_1.value=X.state.rectAreaLTC1,Le.ltc_2.value=X.state.rectAreaLTC2,Le.pointLights.value=X.state.point,Le.pointLightShadows.value=X.state.pointShadow,Le.hemisphereLights.value=X.state.hemi,Le.directionalShadowMatrix.value=X.state.directionalShadowMatrix,Le.spotLightMatrix.value=X.state.spotLightMatrix,Le.spotLightMap.value=X.state.spotLightMap,Le.pointShadowMatrix.value=X.state.pointShadowMatrix),W.lightProbeGrid=b.state.lightProbeGridArray.length>0,W.currentProgram=$e,W.uniformsList=null,$e}function Ko(y){if(y.uniformsList===null){const N=y.currentProgram.getUniforms();y.uniformsList=ms.seqWithValue(N.seq,y.uniforms)}return y.uniformsList}function Zo(y,N){const $=q.get(y);$.outputColorSpace=N.outputColorSpace,$.batching=N.batching,$.batchingColor=N.batchingColor,$.instancing=N.instancing,$.instancingColor=N.instancingColor,$.instancingMorph=N.instancingMorph,$.skinning=N.skinning,$.morphTargets=N.morphTargets,$.morphNormals=N.morphNormals,$.morphColors=N.morphColors,$.morphTargetsCount=N.morphTargetsCount,$.numClippingPlanes=N.numClippingPlanes,$.numIntersection=N.numClipIntersection,$.vertexAlphas=N.vertexAlphas,$.vertexTangents=N.vertexTangents,$.toneMapping=N.toneMapping}function Au(y,N){if(y.length===0)return null;if(y.length===1)return y[0].texture!==null?y[0]:null;S.setFromMatrixPosition(N.matrixWorld);for(let $=0,W=y.length;$<W;$++){const X=y[$];if(X.texture!==null&&X.boundingBox.containsPoint(S))return X}return null}function Ru(y,N,$,W,X){N.isScene!==!0&&(N=Oe),K.resetTextureUnits();const xe=N.fog,be=W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial?N.environment:null,_e=k===null?R.outputColorSpace:k.isXRRenderTarget===!0?k.texture.colorSpace:je.workingColorSpace,Ce=W.isMeshStandardMaterial||W.isMeshLambertMaterial&&!W.envMap||W.isMeshPhongMaterial&&!W.envMap,De=ce.get(W.envMap||be,Ce),qe=W.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,$e=!!$.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Le=!!$.morphAttributes.position,at=!!$.morphAttributes.normal,Et=!!$.morphAttributes.color;let yt=bn;W.toneMapped&&(k===null||k.isXRRenderTarget===!0)&&(yt=R.toneMapping);const ot=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,Ut=ot!==void 0?ot.length:0,ye=q.get(W),Yt=b.state.lights;if(ae===!0&&(oe===!0||y!==ne)){const ht=y===ne&&W.id===J;we.setState(W,y,ht)}let nt=!1;W.version===ye.__version?(ye.needsLights&&ye.lightsStateVersion!==Yt.state.version||ye.outputColorSpace!==_e||X.isBatchedMesh&&ye.batching===!1||!X.isBatchedMesh&&ye.batching===!0||X.isBatchedMesh&&ye.batchingColor===!0&&X.colorTexture===null||X.isBatchedMesh&&ye.batchingColor===!1&&X.colorTexture!==null||X.isInstancedMesh&&ye.instancing===!1||!X.isInstancedMesh&&ye.instancing===!0||X.isSkinnedMesh&&ye.skinning===!1||!X.isSkinnedMesh&&ye.skinning===!0||X.isInstancedMesh&&ye.instancingColor===!0&&X.instanceColor===null||X.isInstancedMesh&&ye.instancingColor===!1&&X.instanceColor!==null||X.isInstancedMesh&&ye.instancingMorph===!0&&X.morphTexture===null||X.isInstancedMesh&&ye.instancingMorph===!1&&X.morphTexture!==null||ye.envMap!==De||W.fog===!0&&ye.fog!==xe||ye.numClippingPlanes!==void 0&&(ye.numClippingPlanes!==we.numPlanes||ye.numIntersection!==we.numIntersection)||ye.vertexAlphas!==qe||ye.vertexTangents!==$e||ye.morphTargets!==Le||ye.morphNormals!==at||ye.morphColors!==Et||ye.toneMapping!==yt||ye.morphTargetsCount!==Ut||!!ye.lightProbeGrid!=b.state.lightProbeGridArray.length>0)&&(nt=!0):(nt=!0,ye.__version=W.version);let en=ye.currentProgram;nt===!0&&(en=Ir(W,N,X),I&&W.isNodeMaterial&&I.onUpdateProgram(W,en,ye));let xn=!1,Wn=!1,Ai=!1;const ct=en.getUniforms(),bt=ye.uniforms;if(v.useProgram(en.program)&&(xn=!0,Wn=!0,Ai=!0),W.id!==J&&(J=W.id,Wn=!0),ye.needsLights){const ht=Au(b.state.lightProbeGridArray,X);ye.lightProbeGrid!==ht&&(ye.lightProbeGrid=ht,Wn=!0)}if(xn||ne!==y){v.buffers.depth.getReversed()&&y.reversedDepth!==!0&&(y._reversedDepth=!0,y.updateProjectionMatrix()),ct.setValue(L,"projectionMatrix",y.projectionMatrix),ct.setValue(L,"viewMatrix",y.matrixWorldInverse);const qn=ct.map.cameraPosition;qn!==void 0&&qn.setValue(L,Se.setFromMatrixPosition(y.matrixWorld)),w.logarithmicDepthBuffer&&ct.setValue(L,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&ct.setValue(L,"isOrthographic",y.isOrthographicCamera===!0),ne!==y&&(ne=y,Wn=!0,Ai=!0)}if(ye.needsLights&&(Yt.state.directionalShadowMap.length>0&&ct.setValue(L,"directionalShadowMap",Yt.state.directionalShadowMap,K),Yt.state.spotShadowMap.length>0&&ct.setValue(L,"spotShadowMap",Yt.state.spotShadowMap,K),Yt.state.pointShadowMap.length>0&&ct.setValue(L,"pointShadowMap",Yt.state.pointShadowMap,K)),X.isSkinnedMesh){ct.setOptional(L,X,"bindMatrix"),ct.setOptional(L,X,"bindMatrixInverse");const ht=X.skeleton;ht&&(ht.boneTexture===null&&ht.computeBoneTexture(),ct.setValue(L,"boneTexture",ht.boneTexture,K))}X.isBatchedMesh&&(ct.setOptional(L,X,"batchingTexture"),ct.setValue(L,"batchingTexture",X._matricesTexture,K),ct.setOptional(L,X,"batchingIdTexture"),ct.setValue(L,"batchingIdTexture",X._indirectTexture,K),ct.setOptional(L,X,"batchingColorTexture"),X._colorsTexture!==null&&ct.setValue(L,"batchingColorTexture",X._colorsTexture,K));const Xn=$.morphAttributes;if((Xn.position!==void 0||Xn.normal!==void 0||Xn.color!==void 0)&&U.update(X,$,en),(Wn||ye.receiveShadow!==X.receiveShadow)&&(ye.receiveShadow=X.receiveShadow,ct.setValue(L,"receiveShadow",X.receiveShadow)),(W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial)&&W.envMap===null&&N.environment!==null&&(bt.envMapIntensity.value=N.environmentIntensity),bt.dfgLUT!==void 0&&(bt.dfgLUT.value=a_()),Wn){if(ct.setValue(L,"toneMappingExposure",R.toneMappingExposure),ye.needsLights&&Cu(bt,Ai),xe&&W.fog===!0&&he.refreshFogUniforms(bt,xe),he.refreshMaterialUniforms(bt,W,ie,ue,b.state.transmissionRenderTarget[y.id]),ye.needsLights&&ye.lightProbeGrid){const ht=ye.lightProbeGrid;bt.probesSH.value=ht.texture,bt.probesMin.value.copy(ht.boundingBox.min),bt.probesMax.value.copy(ht.boundingBox.max),bt.probesResolution.value.copy(ht.resolution)}ms.upload(L,Ko(ye),bt,K)}if(W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(ms.upload(L,Ko(ye),bt,K),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&ct.setValue(L,"center",X.center),ct.setValue(L,"modelViewMatrix",X.modelViewMatrix),ct.setValue(L,"normalMatrix",X.normalMatrix),ct.setValue(L,"modelMatrix",X.matrixWorld),W.uniformsGroups!==void 0){const ht=W.uniformsGroups;for(let qn=0,Ri=ht.length;qn<Ri;qn++){const Jo=ht[qn];ee.update(Jo,en),ee.bind(Jo,en)}}return en}function Cu(y,N){y.ambientLightColor.needsUpdate=N,y.lightProbe.needsUpdate=N,y.directionalLights.needsUpdate=N,y.directionalLightShadows.needsUpdate=N,y.pointLights.needsUpdate=N,y.pointLightShadows.needsUpdate=N,y.spotLights.needsUpdate=N,y.spotLightShadows.needsUpdate=N,y.rectAreaLights.needsUpdate=N,y.hemisphereLights.needsUpdate=N}function wu(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return H},this.getActiveMipmapLevel=function(){return F},this.getRenderTarget=function(){return k},this.setRenderTargetTextures=function(y,N,$){const W=q.get(y);W.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),q.get(y.texture).__webglTexture=N,q.get(y.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:$,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,N){const $=q.get(y);$.__webglFramebuffer=N,$.__useDefaultFramebuffer=N===void 0},this.setRenderTarget=function(y,N=0,$=0){k=y,H=N,F=$;let W=null,X=!1,xe=!1;if(y){const _e=q.get(y);if(_e.__useDefaultFramebuffer!==void 0){v.bindFramebuffer(L.FRAMEBUFFER,_e.__webglFramebuffer),se.copy(y.viewport),me.copy(y.scissor),Pe=y.scissorTest,v.viewport(se),v.scissor(me),v.setScissorTest(Pe),J=-1;return}else if(_e.__webglFramebuffer===void 0)K.setupRenderTarget(y);else if(_e.__hasExternalTextures)K.rebindTextures(y,q.get(y.texture).__webglTexture,q.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){const qe=y.depthTexture;if(_e.__boundDepthTexture!==qe){if(qe!==null&&q.has(qe)&&(y.width!==qe.image.width||y.height!==qe.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");K.setupDepthRenderbuffer(y)}}const Ce=y.texture;(Ce.isData3DTexture||Ce.isDataArrayTexture||Ce.isCompressedArrayTexture)&&(xe=!0);const De=q.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(De[N])?W=De[N][$]:W=De[N],X=!0):y.samples>0&&K.useMultisampledRTT(y)===!1?W=q.get(y).__webglMultisampledFramebuffer:Array.isArray(De)?W=De[$]:W=De,se.copy(y.viewport),me.copy(y.scissor),Pe=y.scissorTest}else se.copy(Ue).multiplyScalar(ie).floor(),me.copy(xt).multiplyScalar(ie).floor(),Pe=Ke;if($!==0&&(W=O),v.bindFramebuffer(L.FRAMEBUFFER,W)&&v.drawBuffers(y,W),v.viewport(se),v.scissor(me),v.setScissorTest(Pe),X){const _e=q.get(y.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+N,_e.__webglTexture,$)}else if(xe){const _e=N;for(let Ce=0;Ce<y.textures.length;Ce++){const De=q.get(y.textures[Ce]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+Ce,De.__webglTexture,$,_e)}}else if(y!==null&&$!==0){const _e=q.get(y.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,_e.__webglTexture,$)}J=-1},this.readRenderTargetPixels=function(y,N,$,W,X,xe,be,_e=0){if(!(y&&y.isWebGLRenderTarget)){it("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ce=q.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&be!==void 0&&(Ce=Ce[be]),Ce){v.bindFramebuffer(L.FRAMEBUFFER,Ce);try{const De=y.textures[_e],qe=De.format,$e=De.type;if(y.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+_e),!w.textureFormatReadable(qe)){it("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!w.textureTypeReadable($e)){it("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=y.width-W&&$>=0&&$<=y.height-X&&L.readPixels(N,$,W,X,pe.convert(qe),pe.convert($e),xe)}finally{const De=k!==null?q.get(k).__webglFramebuffer:null;v.bindFramebuffer(L.FRAMEBUFFER,De)}}},this.readRenderTargetPixelsAsync=async function(y,N,$,W,X,xe,be,_e=0){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ce=q.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&be!==void 0&&(Ce=Ce[be]),Ce)if(N>=0&&N<=y.width-W&&$>=0&&$<=y.height-X){v.bindFramebuffer(L.FRAMEBUFFER,Ce);const De=y.textures[_e],qe=De.format,$e=De.type;if(y.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+_e),!w.textureFormatReadable(qe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!w.textureTypeReadable($e))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Le=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,Le),L.bufferData(L.PIXEL_PACK_BUFFER,xe.byteLength,L.STREAM_READ),L.readPixels(N,$,W,X,pe.convert(qe),pe.convert($e),0);const at=k!==null?q.get(k).__webglFramebuffer:null;v.bindFramebuffer(L.FRAMEBUFFER,at);const Et=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await Td(L,Et,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,Le),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,xe),L.deleteBuffer(Le),L.deleteSync(Et),xe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,N=null,$=0){const W=Math.pow(2,-$),X=Math.floor(y.image.width*W),xe=Math.floor(y.image.height*W),be=N!==null?N.x:0,_e=N!==null?N.y:0;K.setTexture2D(y,0),L.copyTexSubImage2D(L.TEXTURE_2D,$,0,0,be,_e,X,xe),v.unbindTexture()},this.copyTextureToTexture=function(y,N,$=null,W=null,X=0,xe=0){let be,_e,Ce,De,qe,$e,Le,at,Et;const yt=y.isCompressedTexture?y.mipmaps[xe]:y.image;if($!==null)be=$.max.x-$.min.x,_e=$.max.y-$.min.y,Ce=$.isBox3?$.max.z-$.min.z:1,De=$.min.x,qe=$.min.y,$e=$.isBox3?$.min.z:0;else{const bt=Math.pow(2,-X);be=Math.floor(yt.width*bt),_e=Math.floor(yt.height*bt),y.isDataArrayTexture?Ce=yt.depth:y.isData3DTexture?Ce=Math.floor(yt.depth*bt):Ce=1,De=0,qe=0,$e=0}W!==null?(Le=W.x,at=W.y,Et=W.z):(Le=0,at=0,Et=0);const ot=pe.convert(N.format),Ut=pe.convert(N.type);let ye;N.isData3DTexture?(K.setTexture3D(N,0),ye=L.TEXTURE_3D):N.isDataArrayTexture||N.isCompressedArrayTexture?(K.setTexture2DArray(N,0),ye=L.TEXTURE_2D_ARRAY):(K.setTexture2D(N,0),ye=L.TEXTURE_2D),v.activeTexture(L.TEXTURE0),v.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,N.flipY),v.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),v.pixelStorei(L.UNPACK_ALIGNMENT,N.unpackAlignment);const Yt=v.getParameter(L.UNPACK_ROW_LENGTH),nt=v.getParameter(L.UNPACK_IMAGE_HEIGHT),en=v.getParameter(L.UNPACK_SKIP_PIXELS),xn=v.getParameter(L.UNPACK_SKIP_ROWS),Wn=v.getParameter(L.UNPACK_SKIP_IMAGES);v.pixelStorei(L.UNPACK_ROW_LENGTH,yt.width),v.pixelStorei(L.UNPACK_IMAGE_HEIGHT,yt.height),v.pixelStorei(L.UNPACK_SKIP_PIXELS,De),v.pixelStorei(L.UNPACK_SKIP_ROWS,qe),v.pixelStorei(L.UNPACK_SKIP_IMAGES,$e);const Ai=y.isDataArrayTexture||y.isData3DTexture,ct=N.isDataArrayTexture||N.isData3DTexture;if(y.isDepthTexture){const bt=q.get(y),Xn=q.get(N),ht=q.get(bt.__renderTarget),qn=q.get(Xn.__renderTarget);v.bindFramebuffer(L.READ_FRAMEBUFFER,ht.__webglFramebuffer),v.bindFramebuffer(L.DRAW_FRAMEBUFFER,qn.__webglFramebuffer);for(let Ri=0;Ri<Ce;Ri++)Ai&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,q.get(y).__webglTexture,X,$e+Ri),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,q.get(N).__webglTexture,xe,Et+Ri)),L.blitFramebuffer(De,qe,be,_e,Le,at,be,_e,L.DEPTH_BUFFER_BIT,L.NEAREST);v.bindFramebuffer(L.READ_FRAMEBUFFER,null),v.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(X!==0||y.isRenderTargetTexture||q.has(y)){const bt=q.get(y),Xn=q.get(N);v.bindFramebuffer(L.READ_FRAMEBUFFER,V),v.bindFramebuffer(L.DRAW_FRAMEBUFFER,D);for(let ht=0;ht<Ce;ht++)Ai?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,bt.__webglTexture,X,$e+ht):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,bt.__webglTexture,X),ct?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Xn.__webglTexture,xe,Et+ht):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Xn.__webglTexture,xe),X!==0?L.blitFramebuffer(De,qe,be,_e,Le,at,be,_e,L.COLOR_BUFFER_BIT,L.NEAREST):ct?L.copyTexSubImage3D(ye,xe,Le,at,Et+ht,De,qe,be,_e):L.copyTexSubImage2D(ye,xe,Le,at,De,qe,be,_e);v.bindFramebuffer(L.READ_FRAMEBUFFER,null),v.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else ct?y.isDataTexture||y.isData3DTexture?L.texSubImage3D(ye,xe,Le,at,Et,be,_e,Ce,ot,Ut,yt.data):N.isCompressedArrayTexture?L.compressedTexSubImage3D(ye,xe,Le,at,Et,be,_e,Ce,ot,yt.data):L.texSubImage3D(ye,xe,Le,at,Et,be,_e,Ce,ot,Ut,yt):y.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,xe,Le,at,be,_e,ot,Ut,yt.data):y.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,xe,Le,at,yt.width,yt.height,ot,yt.data):L.texSubImage2D(L.TEXTURE_2D,xe,Le,at,be,_e,ot,Ut,yt);v.pixelStorei(L.UNPACK_ROW_LENGTH,Yt),v.pixelStorei(L.UNPACK_IMAGE_HEIGHT,nt),v.pixelStorei(L.UNPACK_SKIP_PIXELS,en),v.pixelStorei(L.UNPACK_SKIP_ROWS,xn),v.pixelStorei(L.UNPACK_SKIP_IMAGES,Wn),xe===0&&N.generateMipmaps&&L.generateMipmap(ye),v.unbindTexture()},this.initRenderTarget=function(y){q.get(y).__webglFramebuffer===void 0&&K.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?K.setTextureCube(y,0):y.isData3DTexture?K.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?K.setTexture2DArray(y,0):K.setTexture2D(y,0),v.unbindTexture()},this.resetState=function(){H=0,F=0,k=null,v.reset(),ve.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return En}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=je._getDrawingBufferColorSpace(e),t.unpackColorSpace=je._getUnpackColorSpace()}}const c_=new Set([...ii,"road","station"]);function l_(n,e,t,i=[],r){const s=e>=128?2:1,a=6,o=Math.ceil(e/s),c=Math.ceil(t/s),l=new Uint8Array(o*c);for(let h=0;h<c;h++)for(let g=0;g<o;g++){let x=!1;const m=g*s,p=h*s,E=Math.min(e,m+s),A=Math.min(t,p+s);e:for(let S=p;S<A;S++)for(let T=m;T<E;T++)if(c_.has(n[ut(T,S,e)].kind)){x=!0;break e}x&&(l[h*o+g]=1)}const f=new Uint8Array(o*c),d=[],u=[[1,0],[-1,0],[0,1],[0,-1]];for(let h=0;h<c;h++)for(let g=0;g<o;g++){const x=h*o+g;if(!l[x]||f[x])continue;let m=0,p=0,E=0,A=g,S=g,T=h,b=h;const P=[x];for(f[x]=1;P.length>0;){const H=P.pop(),F=H%o,k=H/o|0;m+=F,p+=k,E+=1,F<A&&(A=F),F>S&&(S=F),k<T&&(T=k),k>b&&(b=k);for(const[J,ne]of u){const se=F+J,me=k+ne;if(se<0||me<0||se>=o||me>=c)continue;const Pe=me*o+se;!l[Pe]||f[Pe]||(f[Pe]=1,P.push(Pe))}}if(E<a)continue;const _=m/E,M=p/E,R=(_+.5)*s,C=(M+.5)*s,I=Math.max(S-A,b-T)*s,O=Math.max(6,I*.55+Math.sqrt(E)*s*.35);let V=null,D=1/0;for(const H of i){const F=Math.hypot(H.cx-R,H.cy-C);F<D&&(D=F,V=H.name)}D>O+20&&(V=null),d.push({cx:R,cy:C,radius:O,size:E,label:V})}return d.sort((h,g)=>g.size-h.size),d}function xu(n){const e=.95-n.radius*.011-Math.log2(1+n.size)*.02;return Math.max(.48,Math.min(.9,e))}const lt=1,gl=14,u_=22,f_=8,_l=Math.PI/4,Sa=Math.atan(1/Math.sqrt(2)),ya=220;function d_(n){const t=new Ds(-18*n/2,18*n/2,9,-9,.1,2e3);return t.position.set(0,0,0),{target:new z(0,0,0),pan:new z(0,0,0),zoom:1,autoZoom:.72,camera:t,clusters:[],focusIndex:-1,focusTimer:0,reclusterTimer:0,targetAutoZoom:.72,focusAnnounce:null}}function h_(n,e,t,i){const s=vu(n)/i,a=new z(1,0,-1).normalize(),o=new z(-1,0,-1).normalize();n.pan.addScaledVector(a,-e*s),n.pan.addScaledVector(o,t*s)}function p_(n,e){n.zoom=Math.max(.45,Math.min(1.8,n.zoom*e))}function vu(n){return 28/(n.zoom*n.autoZoom)}function is(n,e){const t=vu(n),i=t*e,r=n.camera;r.left=-i/2,r.right=i/2,r.top=t/2,r.bottom=-t/2,r.updateProjectionMatrix()}function _r(n){const e=new z().copy(n.target).add(n.pan),t=e.x+ya*Math.cos(Sa)*Math.sin(_l),i=e.y+ya*Math.sin(Sa),r=e.z+ya*Math.cos(Sa)*Math.cos(_l);n.camera.position.set(t,i,r),n.camera.lookAt(e),n.camera.updateMatrixWorld()}function m_(){return gl+Math.random()*(u_-gl)}function Mu(n,e){const t=n.focusIndex>=0?n.clusters[n.focusIndex]:null;if(n.clusters=l_(e.tiles,e.width,e.height,e.settlements),n.reclusterTimer=f_,n.clusters.length===0){n.focusIndex=-1;return}if(t){let i=0,r=1/0;for(let a=0;a<n.clusters.length;a++){const o=n.clusters[a],c=Math.hypot(o.cx-t.cx,o.cy-t.cy);c<r&&(r=c,i=a)}n.focusIndex=i;const s=n.clusters[i];n.targetAutoZoom=xu(s)}}function g_(n,e){if(n.length===0)return-1;if(n.length===1)return 0;const t=n.map((s,a)=>{const o=Math.sqrt(s.size);return a===e?o*.15:o}),i=t.reduce((s,a)=>s+a,0);let r=Math.random()*i;for(let s=0;s<t.length;s++)if(r-=t[s],r<=0)return s;return n.length-1}function Su(n,e,t){if(e<0||e>=n.clusters.length)return;const i=n.clusters[e];n.focusIndex,n.focusIndex=e,n.focusTimer=m_(),n.targetAutoZoom=xu(i),n.pan.set(0,0,0),i.label&&(n.focusAnnounce=i.label)}function __(n,e,t){if(n.reclusterTimer-=t,n.focusTimer-=t,(n.clusters.length===0||n.reclusterTimer<=0)&&Mu(n,e),n.clusters.length===0){const r=e.settlements[0];if(r){const s=1-Math.exp(-.45*t);n.target.x+=(r.cx*lt-n.target.x)*s,n.target.z+=(r.cy*lt-n.target.z)*s}return}if(n.focusIndex<0||n.focusIndex>=n.clusters.length||n.focusTimer<=0){const r=g_(n.clusters,n.focusIndex);Su(n,r)}const i=n.clusters[n.focusIndex];if(i){const r=i.cx*lt,s=i.cy*lt,a=1-Math.exp(-.5*t);n.target.x+=(r-n.target.x)*a,n.target.z+=(s-n.target.z)*a,n.autoZoom+=(n.targetAutoZoom-n.autoZoom)*(1-Math.exp(-.35*t))}}function x_(n){const e=n.focusAnnounce;return n.focusAnnounce=null,e}function v_(n,e,t){n.target.set((e-1)/2*lt,0,(t-1)/2*lt),n.pan.set(0,0,0),n.zoom=1,n.autoZoom=.72,n.targetAutoZoom=.72,n.clusters=[],n.focusIndex=-1,n.focusTimer=0,n.reclusterTimer=0,n.focusAnnounce=null}function M_(n,e){if(Mu(n,e),n.clusters.length===0){const i=e.settlements[0];i&&(n.target.set(i.cx*lt,0,i.cy*lt),i.name&&(n.focusAnnounce=i.name));return}Su(n,0);const t=n.clusters[0];n.target.set(t.cx*lt,0,t.cy*lt),n.autoZoom=n.targetAutoZoom}function S_(n){n.background=new Je(9353432),n.fog=new Uo(11061472,.0012);const e=new ah(15791871,6982232,1.45);n.add(e);const t=new pa(16775402,2);t.position.set(50,80,30),t.castShadow=!1,n.add(t);const i=new pa(13163248,.75);i.position.set(-40,30,-50),n.add(i);const r=new pa(11583743,.4);r.position.set(20,15,-60),n.add(r);const s=new lh(9478328,.7);n.add(s)}const Es=new Map;function Ze(n,e,t={}){const i=Es.get(n);if(i)return i;const r=new cn({color:e,roughness:.85,metalness:.08,...t});return Es.set(n,r),r}function ze(n,e,t,i,r=e/2){const s=new ft(new Qt(n,e,t),i);return s.position.y=r,s}function yu(n,e,t,i=1){const s=t>0?Math.max(.12,1-t/48):1,a={residential:.55,commercial:.7,industrial:.65,park:.1,school:.75,hospital:.8,station:.5,plaza:.12,tower:1.6,skyscraper:3.2},o=i>=2?1.35:1;return Math.max(.12,(a[n]??.5)*(.55+e*.28)*s*o)}function y_(n,e,t,i,r,s){const a=new Ct;a.userData.constructionSite=!0;const o=ze(n*1.1,.06,t*1.1,Ze("foundation",6974064,{roughness:.95}),.03);a.add(o);const c=ze(.22,.08,.18,Ze("pallet",9068592),.08);c.position.set(-n*.55,0,t*.4),a.add(c);for(let b=0;b<3;b++){const P=ze(.18,.04,.08,Ze("brick",11554880),.14+b*.045);P.position.set(-n*.55,0,t*.4),a.add(P)}const l=Ze("scaffold",13148224,{metalness:.45,roughness:.45}),f=Math.max(2,Math.ceil(3*s+1));for(let b=0;b<f;b++){const P=(b+1)/(f+1)*e*Math.max(.4,s),_=ze(n*1.08,.025,t*1.08,l,P);a.add(_);for(const[M,R]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const C=ze(.03,P,.03,l,P/2);C.position.set(M*n*.52,0,R*t*.52),a.add(C)}}const d=e+.7,u=ze(.07,d,.07,Ze("crane",12632264,{metalness:.55}),d/2);u.position.x=n*.42,a.add(u);const h=ze(.16,.12,.14,Ze("crane-cab",14721088,{metalness:.35}),d-.05);h.position.x=n*.42,a.add(h);const g=n*1.1,x=ze(g,.045,.045,Ze("crane-boom",14721088,{metalness:.4}),d+.08);x.position.x=n*.42-g*.25,x.userData.craneBoom=!0,a.add(x);const m=Math.sin(i*1.2+r)*.22,p=.25+s*(e*.7),E=Math.max(.15,d+.08-p),A=ze(.012,E,.012,Ze("cable",8947856),d+.08-E/2);A.position.x=m,A.userData.craneCable=!0,a.add(A);const S=ze(.07,.09,.07,Ze("hook",14721088),p);S.position.x=m,S.userData.craneHook=!0,a.add(S);const T=new ft(new ai(.04,6,6),Ze("site-lamp",16769152,{emissive:16760896,emissiveIntensity:.9}));return T.position.set(-n*.4,.35,-t*.4),T.userData.siteLamp=!0,a.add(T),a}function rs(n,e,t,i,r,s,a,o,c){const l=s-r;if(l<.18)return;const f=e==="front"||e==="back"?t:i,d=Math.max(1,Math.floor(l/.26)),u=Math.max(1,a==="skyscraper"?Math.round(f/.22):a==="tower"?Math.round(f/.2):Math.max(2,Math.round(f/.28)+o%2)),h=Ze("win-on",16771232,{emissive:16762976,emissiveIntensity:.85,roughness:.4}),g=Ze("win-off",1713456,{roughness:.6}),x=Ze("win-blue",6983864,{emissive:2113632,emissiveIntensity:.25,roughness:.35,metalness:.4}),m=o%4,E=Math.max(.12,f-.04*2),A=Math.min(.08,l*.08),S=Math.max(.1,l-A*2);for(let T=0;T<d;T++)for(let b=0;b<u;b++){const P=(o*7+T*3+b*5+c*11)%10>4;let _=P?h:g;(a==="skyscraper"||a==="tower")&&(_=m===0||m===2?x:P?h:g);const M=E/u,R=S/d,C=M*(m===1?.62:.52),I=R*(m===3?.7:.55),O=-E/2+(b+.5)*M,V=r+A+(T+.5)*R;if(e==="front"||e==="back"){const D=e==="front"?i/2+.012:-i/2-.012,H=ze(C,I,.02,_,V);H.position.x=O,H.position.z=D,n.add(H)}else{const D=e==="right"?t/2+.012:-t/2-.012,H=ze(.02,I,C,_,V);H.position.x=D,H.position.z=O,n.add(H)}}}function xl(n,e,t,i,r,s,a){s==="station"||s==="park"||s==="plaza"||(rs(n,"front",e,t,i,r,s,a,0),rs(n,"back",e,t,i,r,s,a,1),rs(n,"left",e,t,i,r,s,a,2),rs(n,"right",e,t,i,r,s,a,3))}function E_(n){const e=new Ct,t=ze(.08,.28,.08,Ze("trunk",5914672),.14);e.add(t);const i=Ze(`canopy-${n%2}`,n%2===0?3836485:4889173,{roughness:.95}),r=new ft(new ai(.22,6,5),i);r.position.y=.42,r.scale.set(1,.9,1),e.add(r);const s=new ft(new ai(.12,5,4),Ze("canopy-hi",5945957,{roughness:.9}));return s.position.set(-.05,.48,.04),e.add(s),e}function b_(n,e,t){const i=new Ct,r=Ze(`roof-${t}`,t,{roughness:.75}),s=.48,a=n*.52,o=a/Math.cos(s),c=a*Math.tan(s),l=e*.98,f=ze(o,.035,l,r,0);f.rotation.z=s,f.position.set(-a/2,c/2,0),i.add(f);const d=ze(o,.035,l,r,0);d.rotation.z=-s,d.position.set(a/2,c/2,0),i.add(d);const u=ze(.04,.04,l*1.02,r,0);return u.position.set(0,c+.01,0),i.add(u),i}function ss(n,e,t,i){return ze(n*1.02,.05,e*1.02,Ze(`flat-roof-${t}`,t,{roughness:.9}),i)}function T_(n,e,t){const i=new Ct,r=Ze(`hip-${t}`,t,{roughness:.78}),s=ze(n*.55,.04,e*.55,r,.12);i.add(s);const a=ze(n*1.05,.03,e*1.05,r,.02);return i.add(a),i}const A_=[12888194,12095600,13678744,11040864,13152400,10123866,14206120,11575432],R_=[8036036,6982320,9482440,5929624,10533072,7375016,8956096,4876416],C_=[9079408,8026720,10129528,6973536,10524800,7893088,9076848,5920848],w_=[9482448,8429760,10535136,7375016,11587816,6848672,10008792,5269624],P_=[11059424,9480392,12112112,7901360,12638448,6848672,10533080,5795984],xo={residential:12888194,commercial:8036036,industrial:9079408,school:15257728,hospital:15263984,station:9474208,plaza:13682864,tower:9482448,skyscraper:11059424};function I_(n,e){const t=e%8;switch(n){case"residential":return A_[t];case"commercial":return R_[t];case"industrial":return C_[t];case"tower":return w_[t];case"skyscraper":return P_[t];default:return xo[n]??xo.residential}}function D_(n,e){return e>=2?n==="skyscraper"?{w:1.65,d:1.65}:n==="tower"?{w:1.45,d:1.4}:{w:1.5,d:1.5}:n==="skyscraper"?{w:.72,d:.72}:n==="tower"?{w:.55,d:.58}:n==="industrial"?{w:.68,d:.62}:n==="commercial"?{w:.64,d:.58}:{w:.62,d:.58}}function L_(n,e){const t=n.kind;if(t==="grass"||t==="empty"||t==="water"||t==="forest"||t==="road"||t==="rail"||t==="crossing"||t==="bridge"||t==="pad")return null;const i=new Ct;if(i.userData={kind:t,tier:n.tier,construction:n.construction,variant:n.variant,footprint:n.footprint},t==="park"){for(let u=0;u<3;u++){const h=E_(n.variant+u);h.position.set((u-1)*.28,0,u%2*.15-.05),h.userData.sway=u+n.variant,i.add(h)}return i}if(t==="plaza"){i.add(ze(.75,.08,.75,Ze("plaza",xo.plaza),.04));const u=new ft(new Ei(.12,.15,.1,8),Ze("fountain",6983856,{metalness:.3,roughness:.4}));return u.position.y=.12,i.add(u),i}const r=Math.max(1,n.footprint||1),s=yu(t,n.tier,n.construction,r),{w:a,d:o}=D_(t,r),c=I_(t,n.variant),l=t==="skyscraper"||t==="tower",f=Ze(`body-${t}-v${n.variant%8}-fp${r}`,c,{roughness:l?.28+n.variant%3*.08:.75+n.variant%3*.05,metalness:l?.4:.08}),d=[];if(t==="tower"||t==="skyscraper"){const u=n.variant%4;if(u===0)i.add(ze(a,s,o,f,s/2)),d.push({w:a,d:o,y0:.12,y1:s*.96});else if(u===1){const h=s*.62,g=s*.38;i.add(ze(a,h,o,f,h/2)),i.add(ze(a*.72,g,o*.72,f,h+g/2)),d.push({w:a,d:o,y0:.12,y1:h*.96}),d.push({w:a*.72,d:o*.72,y0:h+.04,y1:h+g*.96})}else if(u===2){const h=s*.22,g=s-h;i.add(ze(a*1.05,h,o*1.05,f,h/2)),i.add(ze(a*.78,g,o*.78,f,h+g/2)),d.push({w:a*1.05,d:o*1.05,y0:.1,y1:h*.92}),d.push({w:a*.78,d:o*.78,y0:h+.04,y1:h+g*.96})}else{const h=s*.4,g=s*.35,x=s*.25;i.add(ze(a,h,o,f,h/2)),i.add(ze(a*.82,g,o*.82,f,h+g/2)),i.add(ze(a*.58,x,o*.58,f,h+g+x/2)),d.push({w:a,d:o,y0:.12,y1:h*.96}),d.push({w:a*.82,d:o*.82,y0:h+.04,y1:h+g*.96}),d.push({w:a*.58,d:o*.58,y0:h+g+.04,y1:h+g+x*.96})}}else if(t==="industrial"&&n.variant%3===1){const u=s*.85;i.add(ze(a*1.1,u,o*.9,f,u/2)),d.push({w:a*1.1,d:o*.9,y0:.15,y1:u*.9})}else if(t==="residential"&&n.variant%4===2&&n.tier<=2){i.add(ze(a,s,o*.55,f,s/2));const u=ze(a*.45,s*.9,o,f,s*.9/2);u.position.x=a*.28,i.add(u),d.push({w:a,d:o*.55,y0:.12,y1:s*.92}),d.push({w:a*.45,d:o,y0:.12,y1:s*.85})}else i.add(ze(a,s,o,f,s/2)),d.push({w:a,d:o,y0:.12,y1:s*.96});if(n.construction>0){const u=Math.max(.12,1-n.construction/48),h=i.children.filter(g=>g instanceof ft);for(const g of h)g.material=Ze(`body-build-${t}`,c,{transparent:!0,opacity:.35+u*.5,roughness:.9});return i.add(y_(a,Math.max(s,.4),o,e,n.variant,u)),i.userData.buildingProgress=u,i}for(const u of d)if(t==="residential"&&n.variant%4===2&&n.tier<=2&&Math.abs(u.w-a*.45)<.01){const h=new Ct;h.position.x=a*.28,xl(h,u.w,u.d,u.y0,u.y1,t,n.variant),i.add(h)}else xl(i,u.w,u.d,u.y0,u.y1,t,n.variant);if(t==="residential"){const u=n.variant%4,h=[10502208,8409136,7364688,11554880][u];if(n.tier<=2)if(u===0||u===1){const g=b_(a,o,h+n.variant*263172);g.position.y=s,i.add(g)}else if(u===2){const g=T_(a,o,h);g.position.y=s,i.add(g)}else i.add(ss(a,o,8423568,s+.025));else i.add(ss(a,o,7370880,s+.025));if(n.variant%3===0&&n.tier<=2){const g=ze(.2,.08,.12,Ze("porch",9072736),.08);g.position.z=o/2+.06,i.add(g)}}if(t==="commercial"){const u=[12599360,4219040,13672512,4235360][n.variant%4],h=ze(a*.95,.04,.14,Ze(`awning-${u}`,u),s*.35);if(h.position.z=o/2+.06,i.add(h),n.variant%2===0){const g=ze(.28,.1,.03,Ze(`com-sign-${n.variant}`,14737640,{emissive:4210768,emissiveIntensity:.3}),s*.55);g.position.z=o/2+.03,i.add(g)}n.tier>=2&&i.add(ss(a,o,6320256,s+.025))}if(t==="hospital"){const u=Ze("cross",14700624,{emissive:8392720,emissiveIntensity:.4}),h=ze(.08,.28,.04,u,s*.7),g=ze(.22,.08,.04,u,s*.7);h.position.z=o/2+.02,g.position.z=o/2+.02,i.add(h,g)}if(t==="school"){const u=ze(.2,.1,.02,Ze("flag",4219040),s+.12);i.add(u);const h=ze(.03,.25,.03,Ze("pole",8947856),s+.05);h.position.x=-.12,i.add(h)}if(t==="station"){const u=ze(.9,.08,.35,Ze("canopy",11579584,{metalness:.2}),s+.06);i.add(u);const h=ze(.05,s*.6,.05,Ze("post",7368832),s*.3);h.position.set(-.35,0,.1);const g=h.clone();g.position.x=.35,i.add(h,g);const x=ze(.28,.12,.03,Ze("sign",14729280,{emissive:8413184,emissiveIntensity:.5}),s*.55);x.position.z=o/2+.03,i.add(x)}if(t==="industrial"){if(n.variant%3!==2){const h=ze(.14,s+.35,.14,Ze("chimney",6971480),(s+.35)/2);h.position.set(.2,0,-.1),i.add(h);for(let g=0;g<3;g++){const x=new ft(new ai(.1+g*.03,5,4),Ze(`smoke-${g}`,11842750,{transparent:!0,opacity:.35-g*.08,roughness:1}));x.position.set(.2,s+.4+g*.18,-.1),x.userData.smoke=g,i.add(x)}}if(n.variant%3===0)for(let h=0;h<2;h++){const g=ze(a*.35,.12,o*.9,Ze("sawtooth",10129536),s+.06);g.position.x=(h-.5)*a*.4,i.add(g)}else i.add(ss(a,o,6973536,s+.025))}if(t==="tower"||t==="skyscraper"){const u=r>=2?.55:.35,h=ze(.03,u,.03,Ze("antenna",12636384,{metalness:.6}),s+u/2);i.add(h);const g=new ft(new ai(r>=2?.07:.05,6,6),Ze("beacon",16736352,{emissive:16719904,emissiveIntensity:1}));if(g.position.y=s+u+.04,g.userData.beacon=!0,i.add(g),n.variant%2===0){const x=ze(a*.25,.12,o*.2,Ze("mech",8425632,{metalness:.3}),s+.06);x.position.set(-a*.25,0,-o*.2),i.add(x)}}return i}function vl(n,e){const t=n.userData.variant??0;n.traverse(i=>{if(i instanceof wt){if(i.userData.sway!=null&&(i.rotation.z=Math.sin(e*1.5+i.userData.sway)*.06),i.userData.smoke!=null){const r=i.userData.smoke,s=(n.userData.kind==="industrial"?yu("industrial",n.userData.tier,0):1)+.4;i.position.y=s+r*.18+(e*.4+r*.3)%.5,i.position.x=.2+Math.sin(e+r)*.05;const a=i.material;a.opacity!=null&&(a.opacity=.3-r*.08)}if(i.userData.beacon){const r=Math.sin(e*3+t)>.3,s=i.material;s.emissiveIntensity=r?1.2:.15}if(i.userData.craneHook||i.userData.craneCable){const r=Math.sin(e*1.2+t)*.22;i.position.x=r}if(i.userData.siteLamp){const r=Math.sin(e*4+t)>-.2,s=i.material;s.emissiveIntensity=r?1.1:.25}}})}function U_(){for(const n of Es.values())n.dispose();Es.clear()}const N_=[4028997,4557390,3567680,4886610],F_=[2775602,3301432,2377768,3693626],O_=[2776975,3304090,2381184],Ml=36,Sl=28;function B_(n){return n==="water"?"water":n==="forest"?"forest":n==="empty"?"empty":n==="crossing"?"crossing":n==="bridge"?"bridge":n==="road"||n==="station"?"road":n==="rail"?"rail":"grass"}function as(n,e){return n<=0?1:Math.max(.12,1-n/e)}function jn(n,e,t){const i=new Qt(lt,.08,lt),r=new cn({color:n,roughness:.92,metalness:.05}),s=new on(i,r,e);return s.instanceMatrix.setUsage(Nn),s.count=0,s.position.y=t,s.frustumCulled=!1,{mesh:s,count:0,capacity:e}}const Sn=new wt;function k_(n){const e=new Ct;e.name="ground";const t=N_.map((te,ae)=>{const oe=jn(te,n,0);return oe.mesh.name=`grass-${ae}`,e.add(oe.mesh),oe}),i=F_.map((te,ae)=>{const oe=jn(te,n,.02);return oe.mesh.name=`forest-${ae}`,e.add(oe.mesh),oe}),r=new Ei(.04,.05,.28,5),s=new cn({color:4863264,roughness:.9}),a=new on(r,s,n*3);a.instanceMatrix.setUsage(Nn),a.count=0,a.frustumCulled=!1,e.add(a);const o=new Fo(.18,.35,6),c=new cn({color:2976568,roughness:.85}),l=new on(o,c,n*3);l.instanceMatrix.setUsage(Nn),l.count=0,l.frustumCulled=!1,e.add(l);const f=O_.map((te,ae)=>{const oe=jn(te,n,-.04),Me=oe.mesh.material;return Me.roughness=.35,Me.metalness=.15,Me.emissive=new Je(1056816),Me.emissiveIntensity=.15,oe.mesh.name=`water-${ae}`,e.add(oe.mesh),oe}),d=jn(2763317,n,-.02);d.mesh.name="empty",e.add(d.mesh);const u=jn(4868693,n,.05);u.mesh.name="road",e.add(u.mesh);const h=jn(6969928,n,.12);h.mesh.name="bridge",e.add(h.mesh);const g=jn(9075304,n,.22);g.mesh.name="bridge-rail",e.add(g.mesh);const x=new Qt(lt*.08,.02,lt*.5),m=new cn({color:13156464,roughness:.8,emissive:4208640,emissiveIntensity:.35}),p=new on(x,m,n*4);p.instanceMatrix.setUsage(Nn),p.count=0,p.frustumCulled=!1,p.position.y=.1,e.add(p);const E=jn(3814704,n,.04);E.mesh.name="rail-bed",e.add(E.mesh);const A=new Qt(lt*1.02,.03,.06),S=new cn({color:9079440,metalness:.6,roughness:.4}),T=new on(A,S,n*4),b=new on(A,S.clone(),n*4);for(const te of[T,b])te.instanceMatrix.setUsage(Nn),te.count=0,te.frustumCulled=!1,te.position.y=.09,e.add(te);const P=new Qt(.14,.04,lt*.5),_=new cn({color:5914672,roughness:.95}),M=new on(P,_,n*6);M.instanceMatrix.setUsage(Nn),M.count=0,M.frustumCulled=!1,M.position.y=.07,e.add(M);const R=new Qt(.18,.16,.18),C=new cn({color:13664304,roughness:.85,emissive:4202496,emissiveIntensity:.25}),I=new on(R,C,n*2);I.instanceMatrix.setUsage(Nn),I.count=0,I.frustumCulled=!1,e.add(I);const O=new Qt(lt*.7,.04,.05),V=new cn({color:14700624,emissive:6295568,emissiveIntensity:.4,roughness:.6}),D=new on(O,V,n*2);D.instanceMatrix.setUsage(Nn),D.count=0,D.frustumCulled=!1,e.add(D);const H=new Ei(.03,.03,.35,6),F=new cn({color:3355448,roughness:.7}),k=new on(H,F,n*2);k.instanceMatrix.setUsage(Nn),k.count=0,k.frustumCulled=!1,e.add(k);let J="",ne=0,se=0;function me(){for(const te of t)te.count=0;for(const te of i)te.count=0;for(const te of f)te.count=0;d.count=0,u.count=0,h.count=0,g.count=0,E.count=0,p.count=0,T.count=0,b.count=0,M.count=0,I.count=0,D.count=0,k.count=0,a.count=0,l.count=0}function Pe(te,ae,oe,Me=0,Se=1,Ee=1){te.count>=te.capacity||(Sn.position.set(ae*lt,0,oe*lt),Sn.rotation.set(0,Me,0),Sn.scale.set(Se,1,Ee),Sn.updateMatrix(),te.mesh.setMatrixAt(te.count++,Sn.matrix))}function Te(te,ae,oe,Me,Se,Ee=0,Oe=0,Ge=0,rt=0,L=1,pt=1,Qe=1){ae.count>=oe||(Sn.position.set(Me*lt+Oe,Ge,Se*lt+rt),Sn.rotation.set(0,Ee,0),Sn.scale.set(L,pt,Qe),Sn.updateMatrix(),te.setMatrixAt(ae.count++,Sn.matrix))}function We(te,ae,oe){let Me=ae*73856093^oe*19349663;for(let Se=0;Se<te.length;Se++){const Ee=te[Se],Oe=Ee.construction>0?Math.ceil(Ee.construction/3):0,Ge=Ee.facing==="x"?1:Ee.facing==="z"?2:Ee.facing==="both"?3:0;Me=Me*31+Ee.kind.charCodeAt(0)+Ee.kind.charCodeAt(Ee.kind.length-1)*13+Ee.tier*7+Oe*17+Ge*23+Ee.variant|0}return`${Me}`}function Q(te,ae,oe,Me,Se){const Ee=.55*Se,Oe=(Ge,rt,L)=>{Te(p,Me,n*4,te,ae,Ge,rt,0,L,1,1,Ee)};oe.n&&Oe(0,0,-.22*Se),oe.s&&Oe(0,0,.22*Se),oe.e&&Oe(Math.PI/2,.22*Se,0),oe.w&&Oe(Math.PI/2,-.22*Se,0)}function ue(te,ae,oe,Me,Se=1){const Ee=jo(oe);if(Ee==="L"||Ee==="T"||Ee==="cross"){Q(te,ae,oe,Me,Se);return}if(Ee==="none"){Te(p,Me,n*4,te,ae,0,0,0,0,1,1,Se);return}const Ge=Os(oe)==="x"?Math.PI/2:0;Te(p,Me,n*4,te,ae,Ge,0,0,0,1,1,Se)}function ie(te,ae,oe,Me,Se,Ee,Oe,Ge,rt){oe===0?(Te(T,Oe,n*4,te,ae,0,Me,0,Se-.12,Ee,1,1),Te(b,Ge,n*4,te,ae,0,Me,0,Se+.12,Ee,1,1),Ee>.2&&Te(M,rt,n*6,te,ae,0,Me,0,Se)):(Te(T,Oe,n*4,te,ae,Math.PI/2,Me-.12,0,Se,Ee,1,1),Te(b,Ge,n*4,te,ae,Math.PI/2,Me+.12,0,Se,Ee,1,1),Ee>.2&&Te(M,rt,n*6,te,ae,Math.PI/2,Me,0,Se))}function Fe(te,ae,oe,Me,Se,Ee,Oe=1){const Ge=jo(oe);if(Ge==="L"||Ge==="T"||Ge==="cross"){const L=.5*Oe,pt=.25*Oe;oe.e&&ie(te,ae,0,pt,0,L,Me,Se,Ee),oe.w&&ie(te,ae,0,-pt,0,L,Me,Se,Ee),oe.s&&ie(te,ae,Math.PI/2,0,pt,L,Me,Se,Ee),oe.n&&ie(te,ae,Math.PI/2,0,-pt,L,Me,Se,Ee);return}if(Os(oe)==="z"){if(Te(T,Me,n*4,te,ae,Math.PI/2,-.12,0,0,Oe,1,1),Te(b,Se,n*4,te,ae,Math.PI/2,.12,0,0,Oe,1,1),Oe>.3)for(let L=-1;L<=1;L++)Te(M,Ee,n*6,te,ae,Math.PI/2,0,0,L*.28*Oe)}else if(Te(T,Me,n*4,te,ae,0,0,0,-.12,Oe,1,1),Te(b,Se,n*4,te,ae,0,0,0,.12,Oe,1,1),Oe>.3)for(let L=-1;L<=1;L++)Te(M,Ee,n*6,te,ae,0,L*.28*Oe,0,0)}function ke(te,ae,oe,Me,Se){if(oe>=.95)return;const Ee=.02*Math.sin(Se*3+te+ae);Te(I,Me,n*2,te,ae,0,-.2,.12+Ee,-.15,1,1,1),Te(I,Me,n*2,te,ae,.4,.18,.1+Ee,.2,.8,.8,.8)}function Ue(te,ae,oe,Me,Se,Ee){const Oe=Os(oe),Ge=.15+.85*(.5+.5*Math.sin(Me*.7+te*.3+ae*.2));Oe==="z"||Oe==="none"?(Te(k,Ee,n*2,te,ae,0,-.35,.18,0),Te(k,Ee,n*2,te,ae,0,.35,.18,0),Te(D,Se,n*2,te,ae,0,-.1,.28,0,Ge,1,1),Te(D,Se,n*2,te,ae,0,.1,.28,0,Ge,1,1)):(Te(k,Ee,n*2,te,ae,0,0,.18,-.35),Te(k,Ee,n*2,te,ae,0,0,.18,.35),Te(D,Se,n*2,te,ae,Math.PI/2,0,.28,-.1,Ge,1,1),Te(D,Se,n*2,te,ae,Math.PI/2,0,.28,.1,Ge,1,1))}function xt(te,ae){const{width:oe,height:Me,tiles:Se}=te,Ee=We(Se,oe,Me),Oe=oe!==ne||Me!==se,Ge=Se.some(Z=>Z.kind==="crossing"),rt=Se.some(Z=>Z.construction>0);if(Ee===J&&!Oe&&!Ge){for(const Z of f){const G=Z.mesh.material;G.emissiveIntensity=.12+.08*Math.sin(ae*1.5)}return}if(Ee===J&&!Oe&&Ge&&!rt){const Z={count:0},G={count:0};for(let Y=0;Y<Me;Y++)for(let re=0;re<oe;re++){if(Se[Y*oe+re].kind!=="crossing")continue;const he=wi(Se,re,Y,oe,Me,Yi);Ue(re,Y,he,ae,Z,G)}D.count=Z.count,D.instanceMatrix.needsUpdate=!0,k.count=G.count,k.instanceMatrix.needsUpdate=!0;for(const Y of f){const re=Y.mesh.material;re.emissiveIntensity=.12+.08*Math.sin(ae*1.5)}return}J=Ee,ne=oe,se=Me,me();const L={count:0},pt={count:0},Qe={count:0},w={count:0},v={count:0},B={count:0},q={count:0},K={count:0},ce={count:0};for(let Z=0;Z<Me;Z++)for(let G=0;G<oe;G++){const Y=Se[Z*oe+G],re=B_(Y.kind);if(re==="water"){Pe(f[Y.variant%f.length],G,Z);continue}if(re==="empty"){Pe(d,G,Z);continue}if(re==="forest"){Pe(i[Y.variant%i.length],G,Z);const he=2+Y.variant%2;for(let le=0;le<he;le++){const fe=(le*.37+Y.variant*.11)%.7-.35,we=(le*.53+Y.variant*.07)%.7-.35;Te(a,K,n*3,G,Z,0,fe,.14,we),Te(l,ce,n*3,G,Z,0,fe,.38,we)}continue}if(re==="bridge"){Pe(f[0],G,Z);const he=as(Y.construction,Sl);Pe(h,G,Z,0,he,he);const le=wi(Se,G,Z,oe,Me,Yi);ue(G,Z,le,L,he),Pe(g,G,Z,0,.95,.12),Pe(g,G,Z,0,.12,.95);const fe=wi(Se,G,Z,oe,Me,ec);if(Rl(fe)>0){const we=as(Y.construction,Ml);Fe(G,Z,fe,pt,Qe,w,we)}Y.construction>0&&ke(G,Z,he,v,ae);continue}if(Pe(t[Y.variant%t.length],G,Z),re==="road"||re==="crossing"||Y.kind==="station"){const he=as(Y.construction,Sl);Pe(u,G,Z,0,Math.max(.4,he),Math.max(.4,he));const le=wi(Se,G,Z,oe,Me,Yi);ue(G,Z,le,L,he),Y.construction>0&&Y.kind==="road"&&ke(G,Z,he,v,ae)}if(re==="rail"||re==="crossing"||Y.kind==="station"){const he=as(Y.construction,Ml);Y.kind==="rail"&&Pe(E,G,Z,0,Math.max(.35,he),Math.max(.35,he));const le=wi(Se,G,Z,oe,Me,ec);Fe(G,Z,le,pt,Qe,w,he),Y.construction>0&&(Y.kind==="rail"||Y.kind==="crossing")&&ke(G,Z,he,v,ae)}if(re==="crossing"){const he=wi(Se,G,Z,oe,Me,Yi);Ue(G,Z,he,ae,B,q)}}for(const Z of t)Z.mesh.count=Z.count,Z.mesh.instanceMatrix.needsUpdate=!0;for(const Z of i)Z.mesh.count=Z.count,Z.mesh.instanceMatrix.needsUpdate=!0;for(const Z of f)Z.mesh.count=Z.count,Z.mesh.instanceMatrix.needsUpdate=!0;d.mesh.count=d.count,d.mesh.instanceMatrix.needsUpdate=!0,u.mesh.count=u.count,u.mesh.instanceMatrix.needsUpdate=!0,h.mesh.count=h.count,h.mesh.instanceMatrix.needsUpdate=!0,g.mesh.count=g.count,g.mesh.instanceMatrix.needsUpdate=!0,E.mesh.count=E.count,E.mesh.instanceMatrix.needsUpdate=!0,a.count=K.count,a.instanceMatrix.needsUpdate=!0,l.count=ce.count,l.instanceMatrix.needsUpdate=!0,p.count=L.count,p.instanceMatrix.needsUpdate=!0,T.count=pt.count,T.instanceMatrix.needsUpdate=!0,b.count=Qe.count,b.instanceMatrix.needsUpdate=!0,M.count=w.count,M.instanceMatrix.needsUpdate=!0,I.count=v.count,I.instanceMatrix.needsUpdate=!0,D.count=B.count,D.instanceMatrix.needsUpdate=!0,k.count=q.count,k.instanceMatrix.needsUpdate=!0}function Ke(){e.traverse(te=>{te instanceof on&&(te.geometry.dispose(),Array.isArray(te.material)?te.material.forEach(ae=>ae.dispose()):te.material.dispose())})}return{group:e,sync:xt,dispose:Ke}}const yl=[14700624,5275872,14729280,5292144,12607712,14712896],bs=new Map;function Gt(n,e,t={}){let i=bs.get(n);return i||(i=new cn({color:e,roughness:.55,metalness:.25,...t}),bs.set(n,i)),i}function jt(n,e,t,i,r=e/2){const s=new ft(new Qt(n,e,t),i);return s.position.y=r,s}function z_(n){const e=new Ct,t=jt(.38,.12,.22,Gt(`car-${n}`,n),.1);e.add(t);const i=jt(.2,.1,.2,Gt(`cabin-${n}`,n,{roughness:.4}),.2);i.position.x=-.02,e.add(i);const r=jt(.16,.08,.18,Gt("glass",10537192,{transparent:!0,opacity:.65,metalness:.3,roughness:.2,emissive:2113632,emissiveIntensity:.15}),.2);r.position.x=.06,e.add(r);const s=Gt("wheel",1710618,{roughness:.9});for(const[a,o]of[[-.12,.12],[.12,.12],[-.12,-.12],[.12,-.12]]){const c=new ft(new Ei(.05,.05,.04,8),s);c.rotation.z=Math.PI/2,c.position.set(a,.05,o),e.add(c)}return e}function G_(n){const e=new Ct,t=jt(.55,.22,.24,Gt(`bus-${n}`,n),.16);e.add(t);const i=jt(.52,.04,.25,Gt("bus-stripe",15790320),.14);e.add(i);for(let r=-2;r<=2;r++){const s=jt(.07,.08,.02,Gt("bus-win",8433888,{emissive:4219008,emissiveIntensity:.3,transparent:!0,opacity:.8}),.22);s.position.set(r*.09,0,.13),e.add(s)}return e}function V_(n){const e=new Ct,t=jt(.22,.18,.22,Gt(`truck-cab-${n}`,n),.16);t.position.x=.14,e.add(t);const i=jt(.32,.2,.24,Gt("cargo",6974064,{roughness:.7}),.18);i.position.x=-.12,e.add(i);const r=jt(.02,.1,.18,Gt("truck-glass",10537192,{transparent:!0,opacity:.7}),.2);return r.position.set(.26,0,0),e.add(r),e}function H_(n,e){const t=new Ct,i=n?3824266:13684952,r=jt(.42,.18,.22,Gt(`train-${n}-${e}`,i,{metalness:.35,roughness:.45}),.16);if(t.add(r),n){const a=jt(.12,.14,.2,Gt("engine-nose",2771578),.14);a.position.x=.24,t.add(a);const o=new ft(new ai(.04,6,6),Gt("headlight",16769152,{emissive:16760896,emissiveIntensity:1}));o.position.set(.32,.14,0),o.userData.headlight=!0,t.add(o)}else{const a=jt(.28,.08,.02,Gt("train-win",6590664,{emissive:3166320,emissiveIntensity:.4,transparent:!0,opacity:.75}),.2);a.position.z=.12,t.add(a)}const s=jt(.06,.04,.04,Gt("coupler",4473928),.1);return s.position.x=-.24,t.add(s),t}function W_(n,e,t){const i=yl[e%yl.length];if(n==="bus")return G_(i);if(n==="truck")return V_(i);if(n==="train"){const r=new Ct;r.userData.isTrain=!0;const s=t??4;for(let a=0;a<s;a++){const o=H_(a===0,a);o.userData.carIndex=a,r.add(o)}return r}return z_(i)}function X_(){const n=new Ct;n.name="vehicles";const e=new Map;function t(r,s){const a=new Set;for(const o of r){a.add(o.id);let c=e.get(o.id);if(c||(c=W_(o.kind,o.color,o.cars),c.userData.id=o.id,e.set(o.id,c),n.add(c)),o.kind==="train"&&o.carPoses&&o.carPoses.length>0){c.position.set(0,0,0),c.rotation.set(0,0,0);const l=c.children;for(let f=0;f<l.length;f++){const d=l[f],u=o.carPoses[f]??o.carPoses[o.carPoses.length-1];d.position.set(u.x*lt,.02,u.y*lt),d.rotation.y=-u.dir}}else c.position.set(o.x*lt,.02,o.y*lt),c.rotation.y=-o.dir;c.traverse(l=>{if(l.userData.headlight){const f=Math.sin(s*8)>0,d=l.material;d.emissiveIntensity=f?1.4:.2}})}for(const[o,c]of e)a.has(o)||(n.remove(c),c.traverse(l=>{l instanceof ft&&l.geometry.dispose()}),e.delete(o))}function i(){for(const r of e.values())n.remove(r),r.traverse(s=>{s instanceof ft&&s.geometry.dispose()});e.clear();for(const r of bs.values())r.dispose();bs.clear()}return{group:n,sync:t,dispose:i}}function q_(n){const e=n.construction>0?Math.ceil(n.construction/4):0;return`${n.kind}:${n.tier}:${e}:${n.variant}:${n.footprint}`}function Y_(n=128,e=128){const t=new Ct;t.name="world";const i=k_(n*e);t.add(i.group);const r=new Ct;r.name="buildings",t.add(r);const s=X_();t.add(s.group);const a=new Map;function o(l,f){const{width:d,height:u,tiles:h}=l;i.sync(l,f);const g=new Set;for(let x=0;x<u;x++)for(let m=0;m<d;m++){const p=x*d+m,E=h[p],A=q_(E);g.add(p);const S=a.get(p);if(S&&S.key===A){vl(S.mesh,f);continue}S&&(r.remove(S.mesh),S.mesh.traverse(_=>{_ instanceof ft&&_.geometry.dispose()}),a.delete(p));const T=L_(E,f);if(!T)continue;const b=E.footprint>=2?.5:0,P=E.footprint>=2?.5:0;T.position.set((m+b)*lt,0,(x+P)*lt),r.add(T),a.set(p,{key:A,mesh:T}),vl(T,f)}for(const[x,m]of a)g.has(x)||(r.remove(m.mesh),m.mesh.traverse(p=>{p instanceof ft&&p.geometry.dispose()}),a.delete(x));s.sync(l.vehicles,f)}function c(){i.dispose(),s.dispose();for(const l of a.values())r.remove(l.mesh),l.mesh.traverse(f=>{f instanceof ft&&f.geometry.dispose()});a.clear(),U_()}return{root:t,sync:o,dispose:c}}function $_(n){const e=new o_({canvas:n,antialias:!0,alpha:!1,powerPreference:"high-performance"});e.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),e.outputColorSpace=Zt,e.toneMapping=Eo,e.toneMappingExposure=1.55;const t=new Gd;S_(t);let i=1;const r=d_(i),s=Y_(128,128);t.add(s.root);let a=1,o=1;function c(x,m){a=Math.max(1,x),o=Math.max(1,m),i=a/o,e.setSize(a,o,!1),is(r,i),_r(r)}function l(x,m,p){__(r,x,p),is(r,i),_r(r),s.sync(x,m),e.render(t,r.camera)}function f(x,m,p){h_(r,x,m,p),_r(r)}function d(x){p_(r,x),is(r,i),_r(r)}function u(x){v_(r,x.width,x.height),M_(r,x),is(r,i),_r(r)}function h(){return x_(r)}function g(){s.dispose(),e.dispose()}return{render:l,resize:c,pan:f,zoom:d,resetCamera:u,consumeFocusAnnounce:h,dispose:g,canvas:n}}function xr(n,e,t){return`<div class="bar"><div class="bar-fill" style="width:${Math.max(0,Math.min(100,n/e*100))}%;background:${t}"></div></div>`}function Un(n){return Math.round(n).toLocaleString("ja-JP")}function K_(n,e,t){const{paused:i,speed:r,panelOpen:s}=t,a=`
      <div class="controls">
        <button type="button" data-action="pause" class="btn">${i?"再開":"一時停止"}</button>
        <button type="button" data-action="speed" class="btn btn-ghost">速度 ×${r}</button>
        <button type="button" data-action="reset" class="btn btn-ghost">最初から</button>
      </div>`,o=s?`
    <aside class="panel" id="stats-panel" aria-label="都市の状態">
      <div class="panel-head">
        <h2>都市の状態</h2>
        <button type="button" data-action="toggle-panel" class="btn-icon" aria-label="パネルを閉じる" title="閉じる">×</button>
      </div>
      <div class="panel-body" id="stats-body">
        <dl class="stats" id="stats-list"></dl>
        ${a}
        <p class="hint">ドラッグで視点移動 · ホイールでズーム</p>
      </div>
    </aside>`:`
    <div class="panel-collapsed" id="stats-panel-collapsed">
      <button type="button" data-action="toggle-panel" class="btn btn-ghost panel-open-btn" aria-label="都市の状態を開く">
        状態
      </button>
      ${a}
    </div>`;return`
    <header class="top-bar">
      <div class="brand">
        <a class="back" href="../">← ポータル</a>
        <h1>City Chill</h1>
        <p class="tagline">街が育つのを、ただ眺める</p>
      </div>
      <div class="stage-badge" data-stage="${n}">
        <span class="stage-label" id="hud-stage">${Il(n)}</span>
        <span class="day" id="hud-day">Day ${e}</span>
      </div>
    </header>
    ${o}
  `}function El(n,e,t){const i=n.querySelector("#hud-stage");i&&(i.textContent=Il(t));const r=n.querySelector("#hud-day");r&&(r.textContent=`Day ${e.day}`);const s=n.querySelector(".stage-badge");s&&s.setAttribute("data-stage",t);const a=n.querySelector("#stats-list");a&&(a.innerHTML=`
        <div class="stat">
          <dt>人口</dt>
          <dd>${Un(e.population)} <span class="muted">/ 住宅 ${Un(e.housing)}</span></dd>
          ${xr(e.population,Math.max(e.housing,1),"var(--color-accent)")}
        </div>
        <div class="stat">
          <dt>雇用</dt>
          <dd>${Un(e.jobs)}</dd>
          ${xr(e.jobs,Math.max(e.population*.7,1),"var(--color-success)")}
        </div>
        <div class="stat">
          <dt>交通</dt>
          <dd>${Un(e.transport)}</dd>
          ${xr(e.transport,Math.max(e.population/8,20),"#6ec8ff")}
        </div>
        <div class="stat">
          <dt>教育</dt>
          <dd>${Un(e.education)}</dd>
          ${xr(e.education,100,"#e0c060")}
        </div>
        <div class="stat">
          <dt>幸福度</dt>
          <dd>${Un(e.happiness)}</dd>
          ${xr(e.happiness,100,"#ff8ab0")}
        </div>
        <div class="stat">
          <dt>予算</dt>
          <dd class="${e.budget<0?"danger":""}">¥${Un(e.budget)}${e.budget<0?' <span class="muted">（借入）</span>':""}</dd>
        </div>
        <div class="stat row">
          <div><dt>商業</dt><dd>${Un(e.commerce)}</dd></div>
          <div><dt>産業</dt><dd>${Un(e.industry)}</dd></div>
        </div>`)}function Z_(n,e){const t=n.querySelector('button[data-action="pause"]');t&&(t.textContent=e.paused?"再開":"一時停止");const i=n.querySelector('button[data-action="speed"]');i&&(i.textContent=`速度 ×${e.speed}`)}const os=[1,2,4],cs=128,J_=2.8;function Q_(n){n.innerHTML=`
    <div class="app">
      <div class="hud" id="hud"></div>
      <canvas id="city-canvas"></canvas>
      <div class="toast" id="toast" hidden></div>
    </div>
  `;const e=n.querySelector("#city-canvas"),t=n.querySelector("#hud"),i=n.querySelector("#toast"),r=$_(e);let s=hc({seed:Date.now()%1e5,width:cs,height:cs});r.resetCamera(s);let a=!1,o=0,c=!0,l=!0;const f=J_;let d=performance.now(),u=0,h=0,g=0,x=!1,m=0,p=0;function E(){const M=window.innerWidth,R=window.innerHeight;e.style.width=`${M}px`,e.style.height=`${R}px`,r.resize(M,R)}function A(){const M=t.querySelector(".panel-body"),R=(M==null?void 0:M.scrollTop)??0;t.innerHTML=K_(s.stage,s.stats.day,{paused:a,speed:os[o],panelOpen:c}),El(t,s.stats,s.stage);const C=t.querySelector(".panel-body");C&&(C.scrollTop=R),l=!1}function S(M=!1){if(M||l){A();return}El(t,s.stats,s.stage),Z_(t,{paused:a,speed:os[o]})}function T(M){i.hidden=!1,i.textContent=M,g=2.2}const b={residential:"新しい住宅が建った",commercial:"商店がオープン",industrial:"工場が稼働開始",road:"道路が延伸",rail:"線路が敷設された","intercity-rail":"都市間鉄道が開通した",crossing:"踏切ができた",school:"学校が開校",park:"公園が整備された",hospital:"病院が完成",tower:"高層マンションが建った","tower-2x2":"大型タワーが街区を占めた",station:"駅が開業",plaza:"広場ができた",skyscraper:"超高層ビルがそびえる","skyscraper-2x2":"巨大な超高層が街区に建った",demolish:"再開発で道路を通した",upgrade:"建物がグレードアップ",merge:"近くの町がひとつになった",bridge:"橋が架かった"};function P(M){const R=Math.min(.05,(M-d)/1e3);d=M;const C=a?0:R*os[o];if(u+=R,C>0){const O=s.stage,V=Wf(s,C,f);s=V.state;for(const D of V.events){const H=b[D];H&&T(H)}O!==s.stage&&T(`街が「${_(s.stage)}」に成長した`)}r.render(s,u,R);const I=r.consumeFocusAnnounce();I&&T(`${I}を眺める`),h-=R,h<=0&&(S(),h=.25),g>0&&(g-=R,g<=0&&(i.hidden=!0)),requestAnimationFrame(P)}function _(M){return{village:"小さな村",town:"町",city:"都市",metropolis:"大都会"}[M]}t.addEventListener("click",M=>{const R=M.target.closest("button[data-action]");if(!R)return;const C=R.dataset.action;C==="toggle-panel"?(c=!c,l=!0,S(!0)):C==="pause"?(a=!a,S()):C==="speed"?(o=(o+1)%os.length,S()):C==="reset"&&(s=hc({seed:Date.now()%1e5,width:cs,height:cs}),r.resetCamera(s),T("新しい街が始まった"),l=!0,S(!0))}),e.addEventListener("pointerdown",M=>{x=!0,m=M.clientX,p=M.clientY,e.setPointerCapture(M.pointerId)}),e.addEventListener("pointermove",M=>{if(!x)return;const R=M.clientX-m,C=M.clientY-p;m=M.clientX,p=M.clientY,r.pan(R,C,window.innerHeight)}),e.addEventListener("pointerup",()=>{x=!1}),e.addEventListener("pointercancel",()=>{x=!1}),e.addEventListener("wheel",M=>{M.preventDefault();const R=M.deltaY>0?.92:1.08;r.zoom(R)},{passive:!1}),window.addEventListener("resize",E),E(),S(!0),T("小さな村から、物語が始まる"),requestAnimationFrame(P)}const bl=document.querySelector("#app");bl&&Q_(bl);

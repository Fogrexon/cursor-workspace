(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();const Fn={population:{housingRoomFactor:.18,baseGrowth:3,popGrowthRate:.055,happinessFactorBase:.4,happinessDivisor:200,transportFactorBase:.5,transportFactorCap:1.2,transportPopDivisor:8,transportMinDenom:20,jobRoomJobsMult:1.2,jobRoomPopMult:.5,jobRoomThreshold:.2,overcrowdingThreshold:-5,overcrowdingLossCap:3,overcrowdingLossRate:.05,lowHappinessThreshold:30,lowHappinessLoss:1.5,initial:12},budget:{commerceIncome:1.8,industryIncome:1.4,populationIncome:.2,baseIncome:5,roadUpkeep:.35,railUpkeep:.75,buildingUpkeep:.5,initial:280,debtLimit:450},buildCosts:{residential:28,commercial:38,industrial:48,road:14,rail:50,crossing:40,school:80,park:20,hospital:100,tower:200,station:150,plaza:30,skyscraper:400,upgradeBase:22,fallback:30},development:{forestClearCost:28,bridgeCost:80,bridgeUpkeep:1.5,bridgeTransport:6},terrain:{waterThreshold:.63,forestThreshold:.54,scale:.035},stages:{town:35,city:140,metropolis:450},buildInterval:{dayFactor:.85,minSeconds:.7,jitterMin:.75,jitterRange:.5},tiles:{residentialHousing:8,towerHousing:40,towerJobs:5,skyscraperHousing:80,skyscraperJobs:30,skyscraperCommerce:20,commercialJobs:12,commercialCommerce:10,industrialJobs:18,industrialIndustry:15,roadTransport:4,railTransport:10,crossingTransport:14,stationTransport:25,stationJobs:8,schoolEducation:18,schoolJobs:6,hospitalJobs:10,plazaParks:2,plazaCommerce:5,parkParks:1},happiness:{base:45,parksCap:20,parksPer:3,educationCap:15,educationFactor:.15,transportBonusCap:15,transportBonusBase:.5,transportBonusScale:20,jobBonusCap:10,jobBonusBase:.7,jobBonusScale:15,housingBonusCap:8,housingBonusBase:.8,housingBonusScale:10,hospitalBonus:4,transportPenaltyScale:25,jobPenaltyBase:.6,jobPenaltyScale:30,min:5,max:100,transportNeedDivisor:12,transportRatioCap:1.5,jobNeedFactor:.55}};function wt(n,e,t){return e*t+n}function zt(n,e,t,i){return n>=0&&e>=0&&n<t&&e<i}function We(n,e,t,i,r){return zt(e,t,i,r)?n[wt(e,t,i)]:null}function Vt(n,e,t,i,r){n[wt(e,t,i)]=r}function Ct(n,e=0,t=0,i=0){return{kind:n,tier:e,variant:t,construction:i}}const Qa=new Set(["residential","commercial","industrial","park","school","hospital","station","plaza","tower","skyscraper"]),Mt=new Set(["road","station","crossing","bridge"]),zi=new Set(["rail","station","crossing","bridge"]);function mr(n){return n==="grass"||n==="empty"||n==="forest"}function ui(n){return mr(n)||n==="water"||n==="bridge"}const ru=[[1,0],[-1,0],[0,1],[0,-1]];function Et(n,e,t,i){const r=[];for(const[s,a]of ru){const o=n+s,c=e+a;zt(o,c,t,i)&&r.push({x:o,y:c})}return r}function tl(n,e,t,i,r){return Et(e,t,i,r).some(s=>{const a=n[wt(s.x,s.y,i)];return Mt.has(a.kind)})}function $i(n,e){let t=0;for(const i of n)i.kind===e&&(t+=1);return t}const ja={park:20,plaza:16,residential:5,commercial:4,industrial:2},su=new Set(Object.keys(ja));function No(n){return!(!su.has(n.kind)||n.construction>0||ja[n.kind]==null||n.kind==="residential"&&n.tier>=3||n.kind==="commercial"&&n.tier>=3||n.kind==="industrial"&&n.tier>=2)}function is(n,e,t,i,r){return Et(e,t,i,r).filter(s=>{const a=n[s.y*i+s.x];return Mt.has(a.kind)}).length}function au(n,e,t,i,r){return Et(e,t,i,r).filter(s=>{const a=n[s.y*i+s.x];return ui(a.kind)}).length}function fr(n,e,t,i,r){const s=(o,c)=>o===e&&c===t?!0:zt(o,c,i,r)?Mt.has(n[c*i+o].kind):!1,a=[[e,t],[e-1,t],[e,t-1],[e-1,t-1]];for(const[o,c]of a)if(s(o,c)&&s(o+1,c)&&s(o,c+1)&&s(o+1,c+1))return!0;return!1}function vs(n,e,t,i,r){const s=e/2,a=t/2,o=r<i*1.05,c=[];for(let l=0;l<t;l++)for(let u=0;u<e;u++){const h=n[l*e+u];if(!Mt.has(h.kind)||au(n,u,l,e,t)>0||is(n,u,l,e,t)!==1)continue;const m=Math.hypot(u-s,l-a);for(const _ of Et(u,l,e,t)){const v=n[_.y*e+_.x];if(!No(v)||fr(n,_.x,_.y,e,t)||is(n,_.x,_.y,e,t)!==1)continue;let d=ja[v.kind]??1;d-=v.tier*2,d+=m*2;const y=Math.hypot(_.x-s,_.y-a);y>m+.1?d+=8:y<m-.1?d-=10:d-=2;const T=_.x-u,S=_.y-l,A=We(n,u-T,l-S,e,t);A&&Mt.has(A.kind)?d+=6:d+=1,Et(_.x,_.y,e,t).filter(g=>g.x!==u||g.y!==l).some(g=>{const M=n[g.y*e+g.x];return ui(M.kind)||No(M)})&&(d+=4),o&&(v.kind==="residential"||v.kind==="commercial")&&(d-=8),d>0&&c.push({x:_.x,y:_.y,score:d,kind:v.kind})}}return c.length===0?null:(c.sort((l,u)=>u.score-l.score),c[0])}function ou(n,e,t){for(let r=0;r<t;r++)for(let s=0;s<e;s++){const a=n[r*e+s];if(Mt.has(a.kind))for(const o of Et(s,r,e,t)){const c=n[o.y*e+o.x];if(ui(c.kind)&&!fr(n,o.x,o.y,e,t))return!1}}let i=!1;for(const r of n)if(Mt.has(r.kind)){i=!0;break}return i}function cu(n,e,t,i,r){if(!zt(e,t,i,r))return!1;const s=We(n,e,t,i,r);if(!s||!mr(s.kind)||fr(n,e,t,i,r))return!1;for(const a of Et(e,t,i,r)){const o=n[a.y*i+a.x];if(!Mt.has(o.kind))continue;if(Et(a.x,a.y,i,r).filter(l=>{const u=n[l.y*i+l.x];return ui(u.kind)&&!fr(n,l.x,l.y,i,r)}).length<=1)return!0}return!1}function Sr(n){return mr(n)||n==="road"||n==="rail"||n==="station"||n==="crossing"||n==="bridge"||n==="water"}function lu(n){return n==="rail"||n==="station"?.3:n==="crossing"?.45:n==="bridge"?.5:n==="grass"||n==="empty"?1:n==="forest"?1.8:n==="road"?8:n==="water"?12:99}function uu(n,e,t,i,r,s=48){if(!zt(i.x,i.y,e,t)||!zt(r.x,r.y,e,t))return null;const a=We(n,i.x,i.y,e,t),o=We(n,r.x,r.y,e,t);if(!a||!o||!Sr(a.kind)&&!(a.kind==="rail"||a.kind==="station"||a.kind==="crossing")&&!Sr(a.kind)||!Sr(o.kind))return null;const c=(v,p)=>p*e+v,l=(v,p)=>Math.abs(v-r.x)+Math.abs(p-r.y),u=[],h=new Map,f=new Map,m=c(i.x,i.y);f.set(m,0),u.push({x:i.x,y:i.y,g:0,f:l(i.x,i.y),px:i.x,py:i.y,dx:0,dy:0});let _=0;for(;u.length>0&&_++<e*t*4;){u.sort((p,d)=>p.f-d.f);const v=u.shift();if(v.x===r.x&&v.y===r.y){const p=[{x:v.x,y:v.y}];let d=v.x,y=v.y;for(;d!==i.x||y!==i.y;){const T=h.get(c(d,y));if(!T)break;d=T.x,y=T.y,p.push({x:d,y})}return p.reverse(),p.length>s?null:p}for(const p of Et(v.x,v.y,e,t)){const d=We(n,p.x,p.y,e,t);if(!d||!Sr(d.kind))continue;const y=p.x-v.x,T=p.y-v.y;let S=lu(d.kind);(v.dx!==0||v.dy!==0)&&(y===v.dx&&T===v.dy?S*=.85:S*=1.25),(p.x<=0||p.y<=0||p.x>=e-1||p.y>=t-1)&&(S+=2);const A=v.g+S,b=c(p.x,p.y);A>=(f.get(b)??1/0)||(f.set(b,A),h.set(b,{x:v.x,y:v.y}),u.push({x:p.x,y:p.y,g:A,f:A+l(p.x,p.y),px:v.x,py:v.y,dx:y,dy:T}))}}return null}function Gi(n){let e=n>>>0;return()=>{e=e+1831565813>>>0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}function Qe(n,e,t){return e+Math.floor(n()*(t-e+1))}function fu(n,e){return n()<e}const Fo=["青葉","緑ヶ丘","桜台","日向","風見","白砂","山手","朝霧","紅葉","金星","鈴蘭","潮見","若葉","霞丘","月見","星川"],nl=new Set([...Qa,"road","rail","crossing","bridge","station"]);function du(n,e){const t=Fo.filter(s=>!e.has(s)),i=t.length>0?t:[...Fo],r=i[Qe(n,0,i.length-1)];return e.add(r),r}function Oo(n,e,t,i,r,s){let a=t,o=i;for(;a!==r||o!==s;)n[wt(a,o,e)].kind!=="water"&&(n[wt(a,o,e)]=Ct("road")),a!==r?a+=a<r?1:-1:o!==s&&(o+=o<s?1:-1);n[wt(r,s,e)].kind!=="water"&&(n[wt(r,s,e)]=Ct("road"))}function hu(n,e,t,i,r,s){for(let a=-3;a<=3;a++)for(let o=-4;o<=4;o++){const c=i+o,l=r+a;if(c<=0||l<=0||c>=e-1||l>=t-1)continue;const u=n[wt(c,l,e)];(u.kind==="water"||u.kind==="forest")&&(n[wt(c,l,e)]=Ct("grass",0,Qe(s,0,3)))}}function pu(n,e,t,i,r,s){Oo(n,e,i-3,r,i+3,r),Oo(n,e,i,r-2,i,r+2);const a=[{dx:-1,dy:-1,kind:"residential",tier:1},{dx:1,dy:-1,kind:"residential",tier:1},{dx:-1,dy:1,kind:"residential",tier:1},{dx:1,dy:1,kind:"commercial",tier:1},{dx:2,dy:-1,kind:"park",tier:1}];for(const o of a){const c=i+o.dx,l=r+o.dy;c>0&&l>0&&c<e-1&&l<t-1&&(n[wt(c,l,e)]=Ct(o.kind,o.tier,Qe(s,0,2)))}}function mu(n,e,t,i){const r=e*t,s=r>=200*200?Qe(i,4,6):r>=80*80?Qe(i,3,4):1,a=Math.max(28,Math.floor(Math.min(e,t)*.22)),o=Math.max(12,Math.floor(Math.min(e,t)*.08)),c=[],l=new Set,u=(_,v,p)=>{for(const d of c)if(Math.hypot(_-d.cx,v-d.cy)<a)return!1;return hu(n,e,t,_,v,i),pu(n,e,t,_,v,i),c.push({id:p,name:du(i,l),cx:_,cy:v,radius:10}),!0},h=Math.floor(e/2+(i()-.5)*e*.15),f=Math.floor(t/2+(i()-.5)*t*.15);u(Math.max(o,Math.min(e-o-1,h)),Math.max(o,Math.min(t-o-1,f)),0);let m=0;for(;c.length<s&&m++<80;){const _=Qe(i,o,e-o-1),v=Qe(i,o,t-o-1);u(_,v,c.length)}if(s>=3&&c.length<2){const _=Math.max(o,e-o-20),v=Math.max(o,t-o-20);u(_,v,c.length)}return c}function sa(n,e,t,i){let r=0;const s=Math.ceil(i.radius)+4;for(let a=i.cy-s;a<=i.cy+s;a++)for(let o=i.cx-s;o<=i.cx+s;o++)zt(o,a,e,t)&&(Math.hypot(o-i.cx,a-i.cy)>s||nl.has(n[wt(o,a,e)].kind)&&(r+=1));return r}function gu(n,e,t,i,r){if(n.length===0)return null;if(n.length===1)return n[0];const s=n.map(c=>{const l=sa(e,t,i,c);return .4+Math.sqrt(l+1)}),a=s.reduce((c,l)=>c+l,0);let o=r()*a;for(let c=0;c<n.length;c++)if(o-=s[c],o<=0)return n[c];return n[n.length-1]}function _u(n,e,t,i){for(const r of n){let s=0,a=0,o=0;const c=Math.ceil(r.radius)+8;for(let l=r.cy-c;l<=r.cy+c;l++)for(let u=r.cx-c;u<=r.cx+c;u++){if(!zt(u,l,t,i)||Math.hypot(u-r.cx,l-r.cy)>c)continue;const h=e[wt(u,l,t)];nl.has(h.kind)&&(s+=u,a+=l,o+=1)}o>8&&(r.cx=Math.round(r.cx*.7+s/o*.3),r.cy=Math.round(r.cy*.7+a/o*.3),r.radius=Math.min(48,Math.max(10,Math.sqrt(o)*1.1)))}}function xu(n,e,t,i){if(n.length<2)return{merged:!1,absorbedId:null};for(let r=0;r<n.length;r++)for(let s=r+1;s<n.length;s++){const a=n[r],o=n[s],c=Math.hypot(a.cx-o.cx,a.cy-o.cy),l=a.radius+o.radius+6;if(c>l||!vu(e,t,i,a,o))continue;const u=sa(e,t,i,a),h=sa(e,t,i,o),f=u>=h?a:o,m=u>=h?o:a;f.cx=Math.round((a.cx*u+o.cx*h)/Math.max(1,u+h)),f.cy=Math.round((a.cy*u+o.cy*h)/Math.max(1,u+h)),f.radius=Math.min(56,a.radius+o.radius*.6);const _=m.id,v=n.indexOf(m);return n.splice(v,1),{merged:!0,absorbedId:_}}return{merged:!1,absorbedId:null}}function vu(n,e,t,i,r){const s=Bo(n,e,t,i.cx,i.cy,12),a=Bo(n,e,t,r.cx,r.cy,12);if(!s||!a)return!1;const o=(m,_)=>_*e+m,c=o(a.x,a.y),l=new Set,u=[s];l.add(o(s.x,s.y));let h=0;const f=4e3;for(;u.length>0&&h++<f;){const m=u.shift();if(o(m.x,m.y)===c||Math.hypot(m.x-a.x,m.y-a.y)<=2)return!0;for(const _ of Et(m.x,m.y,e,t)){const v=o(_.x,_.y);if(l.has(v))continue;const p=n[wt(_.x,_.y,e)];!Mt.has(p.kind)&&p.kind!=="bridge"||(l.add(v),u.push(_))}}return!1}function Bo(n,e,t,i,r,s){let a=null,o=1/0;for(let c=r-s;c<=r+s;c++)for(let l=i-s;l<=i+s;l++){if(!zt(l,c,e,t))continue;const u=We(n,l,c,e,t);if(!u||!Mt.has(u.kind))continue;const h=Math.hypot(l-i,c-r);h<o&&(o=h,a={x:l,y:c})}return a}function Mu(n){return n==="grass"||n==="empty"||n==="forest"||n==="rail"}function Su(n,e,t,i,r,s){const a=Eu(n,e,t,i,r,s+4,"station");if(a)return a;let o=null;for(let c=r-s;c<=r+s;c++)for(let l=i-s;l<=i+s;l++){if(!zt(l,c,e,t))continue;const u=n[wt(l,c,e)];if(!Mu(u.kind)||u.kind==="road"||u.kind==="crossing"||u.kind==="bridge")continue;const h=Et(l,c,e,t).some(_=>Mt.has(n[wt(_.x,_.y,e)].kind));let m=10-Math.hypot(l-i,c-r)*.4;h&&(m+=5),u.kind==="rail"&&(m+=3),u.kind==="forest"&&(m-=1),(!o||m>o.score)&&(o={x:l,y:c,score:m})}return o?{x:o.x,y:o.y}:null}function yu(n,e,t,i,r){if(n.length<2)return null;const s=[];for(const l of n){const u=Su(e,t,i,l.cx,l.cy,Math.ceil(l.radius)+8);u&&s.push({...u,sid:l.id})}const a=[];for(let l=0;l<s.length;l++)for(let u=l+1;u<s.length;u++){const h=s[l],f=s[u];if(h.sid===f.sid)continue;const m=Math.hypot(h.x-f.x,h.y-f.y);m<18||m>120||bu(e,t,i,h,f)||a.push({a:h,b:f,dist:m})}if(a.length===0)return null;a.sort((l,u)=>l.dist-u.dist);const o=a.slice(0,Math.min(4,a.length)),c=o[Qe(r,0,o.length-1)];return{a:{x:c.a.x,y:c.a.y},b:{x:c.b.x,y:c.b.y}}}function Eu(n,e,t,i,r,s,a){let o=null,c=1/0;for(let l=r-s;l<=r+s;l++)for(let u=i-s;u<=i+s;u++){if(!zt(u,l,e,t)||n[wt(u,l,e)].kind!==a)continue;const f=Math.hypot(u-i,l-r);f<c&&(c=f,o={x:u,y:l})}return o}function bu(n,e,t,i,r){const s=Math.max(1,Math.ceil(Math.hypot(r.x-i.x,r.y-i.y)));let a=0;for(let o=0;o<=s;o++){const c=o/s,l=Math.round(i.x+(r.x-i.x)*c),u=Math.round(i.y+(r.y-i.y)*c);for(let h=-1;h<=1;h++)for(let f=-1;f<=1;f++){if(!zt(l+f,u+h,e,t))continue;const m=n[wt(l+f,u+h,e)].kind;(m==="rail"||m==="station"||m==="crossing")&&(a+=1)}}return a>s*.35}function eo(n,e,t,i=!0){if(!t)return 0;const r=Math.hypot(n-t.cx,e-t.cy),s=t.radius+6;return i?r<=s?2-r/s:-r/(s*3):0}function Tu(n,e,t){return n.length<2||e==="village"?!1:fu(t,e==="town"?.18:e==="city"?.35:.45)}function il(n,e,t=Fn){const i=t.tiles,r=t.happiness,s=t.budget;let a=0,o=0,c=0,l=0,u=0,h=0,f=0,m=0;for(const w of n){const g=Math.max(1,w.tier);switch(w.kind){case"residential":a+=i.residentialHousing*g;break;case"tower":a+=i.towerHousing*g,o+=i.towerJobs*g;break;case"skyscraper":a+=i.skyscraperHousing*g,o+=i.skyscraperJobs*g,h+=i.skyscraperCommerce*g;break;case"commercial":o+=i.commercialJobs*g,h+=i.commercialCommerce*g;break;case"industrial":o+=i.industrialJobs*g,u+=i.industrialIndustry*g;break;case"road":c+=i.roadTransport;break;case"bridge":c+=t.development.bridgeTransport;break;case"rail":c+=i.railTransport;break;case"crossing":c+=i.crossingTransport;break;case"station":c+=i.stationTransport,o+=i.stationJobs;break;case"school":l+=i.schoolEducation*g,o+=i.schoolJobs;break;case"hospital":m+=1,o+=i.hospitalJobs;break;case"park":f+=i.parkParks;break;case"plaza":f+=i.plazaParks,h+=i.plazaCommerce;break}}l=Math.min(100,l);const _=e.population,v=Math.max(1,_/r.transportNeedDivisor),p=Math.min(r.transportRatioCap,c/v),d=o/Math.max(1,_*r.jobNeedFactor),y=a/Math.max(1,_);let T=r.base;T+=Math.min(r.parksCap,f*r.parksPer),T+=Math.min(r.educationCap,l*r.educationFactor),T+=Math.min(r.transportBonusCap,(p-r.transportBonusBase)*r.transportBonusScale),T+=Math.min(r.jobBonusCap,(d-r.jobBonusBase)*r.jobBonusScale),T+=Math.min(r.housingBonusCap,(y-r.housingBonusBase)*r.housingBonusScale),T+=m*r.hospitalBonus,T-=Math.max(0,(1-p)*r.transportPenaltyScale),T-=Math.max(0,(r.jobPenaltyBase-d)*r.jobPenaltyScale),T=Math.max(r.min,Math.min(r.max,T));const S=h*s.commerceIncome+u*s.industryIncome+_*s.populationIncome+s.baseIncome,A=$i(n,"road")*s.roadUpkeep+$i(n,"rail")*s.railUpkeep+$i(n,"bridge")*t.development.bridgeUpkeep+$i(n,"crossing")*s.roadUpkeep*.5+[...Qa].reduce((w,g)=>w+$i(n,g)*s.buildingUpkeep,0),b=S-A;return{population:_,housing:a,jobs:o,transport:c,education:l,happiness:T,budget:e.budget+b,industry:u,commerce:h,day:e.day}}function Au(n,e=Fn){const t=e.population,i=n.housing-n.population,r=n.jobs*t.jobRoomJobsMult-n.population*t.jobRoomPopMult,s=t.happinessFactorBase+n.happiness/t.happinessDivisor,a=Math.min(t.transportFactorCap,t.transportFactorBase+n.transport/Math.max(t.transportMinDenom,n.population/t.transportPopDivisor));let o=0;return i>0&&r>-n.population*t.jobRoomThreshold?o=Math.min(i*t.housingRoomFactor,t.baseGrowth+n.population*t.popGrowthRate*s*a):i<t.overcrowdingThreshold?o=-Math.min(t.overcrowdingLossCap,Math.abs(i)*t.overcrowdingLossRate):n.happiness<t.lowHappinessThreshold&&(o=-t.lowHappinessLoss),Math.max(0,n.population+o)}function rl(n,e=Fn){return n<e.stages.town?"village":n<e.stages.city?"town":n<e.stages.metropolis?"city":"metropolis"}function sl(n){switch(n){case"village":return"小さな村";case"town":return"町";case"city":return"都市";case"metropolis":return"大都会"}}function Ru(n,e,t=Fn){const i=t.happiness,r=Math.max(1,n.population),s=(n.housing-r)/r,a=(n.jobs-r*i.jobNeedFactor)/r,o=n.transport/Math.max(1,r/i.transportNeedDivisor)-1,c=40-n.education,l=60-n.happiness,u={residential:s<.15?1.2-s:.1,commercial:a<.1?1-a:.15,industrial:a<0&&e!=="village"?.9-a:.1,road:o<.2?1.3-o:.2,rail:e==="city"||e==="metropolis"?o<.4?.9:.3:.05,school:c>0?c/40:.05,park:l>0?l/50:.1,hospital:e!=="village"&&n.happiness<55?.6:.05,tower:e==="city"||e==="metropolis"?s<.2?.8:.2:0,station:e==="city"||e==="metropolis"?o<.3?.7:.15:0,skyscraper:e==="metropolis"&&s<.25?.7:0};return n.budget+t.budget.debtLimit<80?(u.tower*=.1,u.rail*=.25,u.station*=.2,u.skyscraper=0):n.budget<0&&(u.tower*=.5,u.skyscraper*=.3),u}({...Fn.buildCosts});function yr(n,e,t){let i=n*374761393+e*668265263+t*982451653|0;return i=(i^i>>>13)*1274126177,i=i^i>>>16,(i>>>0)/4294967296}function ko(n){return n*n*(3-2*n)}function wu(n,e,t){const i=Math.floor(n),r=Math.floor(e),s=ko(n-i),a=ko(e-r),o=yr(i,r,t),c=yr(i+1,r,t),l=yr(i,r+1,t),u=yr(i+1,r+1,t),h=o+(c-o)*s,f=l+(u-l)*s;return h+(f-h)*a}function zo(n,e,t,i=4,r=2,s=.5){let a=1,o=1,c=0,l=0;for(let u=0;u<i;u++)c+=a*wu(n*o,e*o,t+u*1013),l+=a,a*=s,o*=r;return c/Math.max(1e-6,l)}function Cu(n,e,t,i){const r=[],s=(n-1)/2,a=(e-1)/2,o=Math.hypot(s,a)||1;for(let c=0;c<e;c++)for(let l=0;l<n;l++){const u=l*i.scale,h=c*i.scale,f=zo(u,h,t),m=zo(u+40,h-17,t+7),_=l===0||c===0||l===n-1||c===e-1?.06:0,v=Math.hypot(l-s,c-a)/o,p=Math.max(0,1-v*1.6)*.2,d=f+_-p;let y;d>i.waterThreshold?y="water":m>i.forestThreshold&&d<i.waterThreshold-.03?y="forest":y="grass";const T=y==="water"?Math.floor(f*3)%3:y==="forest"?Math.floor(m*4)%4:Math.floor((f+m)*2)%4;r.push(Ct(y,0,T))}return r}function or(n,e,t){const i=t.development;return n==="forest"?i.forestClearCost:n==="water"?e==="road"||e==="rail"||e==="crossing"?i.bridgeCost:Number.POSITIVE_INFINITY:0}function aa(n,e){return n==="water"||n==="bridge"?"bridge":e==="road"&&n==="rail"||e==="rail"&&n==="road"?"crossing":e}const ur=48,Pu=36,Ui=20,Du=24;function Iu(n,e){const t=e.reduce((r,s)=>r+Math.max(0,s.w),0);if(t<=0)return"park";let i=n()*t;for(const r of e)if(i-=Math.max(0,r.w),i<=0)return r.key;return e[e.length-1].key}function Lu(n,e,t,i,r){const s=[],a=(r==null?void 0:r.cx)??e/2,o=(r==null?void 0:r.cy)??t/2,c=r?Math.ceil(r.radius)+14:Math.min(e,t),l=Math.max(0,o-c),u=Math.min(t-1,o+c),h=Math.max(0,a-c),f=Math.min(e-1,a+c);for(let _=l;_<=u;_++)for(let v=h;v<=f;v++){const p=We(n,v,_,e,t);if(!p||!mr(p.kind)||!tl(n,v,_,e,t)||cu(n,v,_,e,t))continue;const d=Math.hypot(v-a,_-o),y=p.kind==="forest"?.35:0,T=1/(1+d*.12)+eo(v,_,r)+i()*.3-y;s.push({x:v,y:_,score:T})}if(s.length===0)return null;s.sort((_,v)=>v.score-_.score);const m=s.slice(0,Math.min(12,s.length));return m[Qe(i,0,m.length-1)]}function Uu(n,e,t,i,r,s){const a=[];for(let o=0;o<t;o++)for(let c=0;c<e;c++){const l=We(n,c,o,e,t);l&&r.includes(l.kind)&&(l.tier>=s||l.construction>0||a.push({x:c,y:o}))}return a.length===0?null:a[Qe(i,0,a.length-1)]}function Go(n,e,t,i,r){const s=[],a=(r==null?void 0:r.cx)??e/2,o=(r==null?void 0:r.cy)??t/2,c=r?Math.ceil(r.radius)+18:Math.min(e,t),l=Math.max(0,o-c),u=Math.min(t-1,o+c),h=Math.max(0,a-c),f=Math.min(e-1,a+c);for(let _=l;_<=u;_++)for(let v=h;v<=f;v++){const p=We(n,v,_,e,t);if(!p||!Mt.has(p.kind))continue;const d=is(n,v,_,e,t),y=d<=1?4:d===2?1.5:-1;for(const T of Et(v,_,e,t)){const S=n[T.y*e+T.x];if(!ui(S.kind)||fr(n,T.x,T.y,e,t))continue;const A=is(n,T.x,T.y,e,t);if(A>=3||A>=2&&d>=2)continue;let b=y;const w=T.x-v,g=T.y-_,M=We(n,v-w,_-g,e,t);M&&Mt.has(M.kind)?b+=5:b+=.5,A===1?b+=3:A===2&&(b-=2);const P=Math.hypot(T.x-a,T.y-o),C=Math.hypot(v-a,_-o);P>C?b+=2.5:b-=.5,b+=eo(T.x,T.y,r)*.5,S.kind==="grass"||S.kind==="empty"?b+=2:S.kind==="forest"?b+=.8:b-=1.5,b+=i()*.4,s.push({x:T.x,y:T.y,score:b})}}if(s.length===0)return null;s.sort((_,v)=>v.score-_.score);const m=s.slice(0,Math.min(8,s.length));return m[Qe(i,0,m.length-1)]}function Nu(n,e,t){const i=[];for(let r=0;r<t;r++)for(let s=0;s<e;s++){const a=n[r*e+s];(a.kind==="rail"||a.kind==="station"||a.kind==="crossing"||a.kind==="bridge")&&i.push({x:s,y:r})}return i}function Cn(n,e,t,i,r){const s=We(n,e,t,i,r);return s?s.kind==="grass"||s.kind==="empty"||s.kind==="forest"||s.kind==="rail":!1}function Zi(n,e,t,i){return Cn(n,e.x,e.y,t,i)?e:Et(e.x,e.y,t,i).filter(a=>Cn(n,a.x,a.y,t,i)).map(a=>{const o=Et(a.x,a.y,t,i).some(c=>Mt.has(n[c.y*t+c.x].kind));return{...a,score:o?2:1}}).sort((a,o)=>o.score-a.score)[0]??null}function Ms(n,e,t){const i=t.buildCosts;if(e&&(n==="road"||n==="water"||n==="bridge"))return Number.POSITIVE_INFINITY;const r=e?i.station:n==="road"?i.crossing:i.rail,a=or(n,e?"station":n==="road"?"crossing":"rail",t);return Number.isFinite(a)?r+a:Number.POSITIVE_INFINITY}function al(n,e){return n+e.budget.debtLimit}function zn(n,e,t){return e<=al(n,t)}function Vo(n,e,t,i,r,s,a,o){const c=al(s,r),l=Nu(n,e,t),u=(g,M)=>{if(g.length<2)return null;let P=0;for(let C=0;C<g.length;C++){const D=g[C],z=C===0,Y=C===g.length-1,I=M==="both"&&(z||Y)||M==="goal"&&Y,H=We(n,D.x,D.y,e,t);if(H.kind!=="station"){if(H.kind==="rail"||H.kind==="crossing"||H.kind==="bridge"){I&&H.kind==="rail"&&(P+=5);continue}if(I){const O=Cn(n,D.x,D.y,e,t)?D:Zi(n,D,e,t);if(!O)return null;const X=We(n,O.x,O.y,e,t);if(X.kind==="station")continue;const K=Ms(X.kind==="rail"?"grass":X.kind,!0,r);if(!Number.isFinite(K))return null;P+=K;continue}if(z&&M==="goal")return null;if(H.kind==="road"||ui(H.kind)){const O=Ms(H.kind,!1,r);if(!Number.isFinite(O))return null;P+=O}else return null}}return P},h=(g,M,P)=>{const C=We(n,g,M,e,t);if(C.kind==="rail"||C.kind==="station"||C.kind==="crossing"||C.kind==="bridge")return 0;if(P&&!Cn(n,g,M,e,t))return-1;const D=Ms(C.kind,P,r);if(!Number.isFinite(D))return-1;if(P)return Vt(n,g,M,e,Ct("station",1,Qe(i,0,2),ur)),D;if(C.kind==="road")return Vt(n,g,M,e,Ct("crossing",0,0,Ui)),D;if(!ui(C.kind))return-1;const z=aa(C.kind,"rail");return Vt(n,g,M,e,Ct(z,0,0,Du)),D},f=(g,M)=>{const P=We(n,g,M,e,t);if(!P)return-1;if(P.kind==="station")return 0;if(Cn(n,g,M,e,t))return P.kind==="rail"?(Vt(n,g,M,e,Ct("station",1,Qe(i,0,2),ur)),5):h(g,M,!0);const C=Zi(n,{x:g,y:M},e,t);if(!C)return-1;const D=We(n,C.x,C.y,e,t);return D.kind==="station"?0:D.kind==="rail"?(Vt(n,C.x,C.y,e,Ct("station",1,Qe(i,0,2),ur)),5):h(C.x,C.y,!0)},m=(g,M,P)=>{const C=u(g,M);if(C==null||C>c)return null;const D=g.map(X=>{const K=n[X.y*e+X.x];return{x:X.x,y:X.y,tile:{...K}}}),z=[];for(const X of[g[0],g[g.length-1]])for(const K of Et(X.x,X.y,e,t))D.some(te=>te.x===K.x&&te.y===K.y)||z.some(te=>te.x===K.x&&te.y===K.y)||z.push({x:K.x,y:K.y,tile:{...n[K.y*e+K.x]}});const Y=[];let I=0,H=0,O=!0;for(let X=0;X<g.length;X++){const K=g[X],te=X===0,ee=X===g.length-1,he=M==="both"&&(te||ee)||M==="goal"&&ee,Ie=We(n,K.x,K.y,e,t);if(he){if(Ie.kind==="station"){Y.push("station");continue}const J=f(K.x,K.y);if(J<0){O=!1;break}H+=J,Y.push("station"),J>5&&(I+=1);continue}if(Ie.kind==="rail"||Ie.kind==="station"||Ie.kind==="crossing"||Ie.kind==="bridge")continue;const Xe=h(K.x,K.y,!1);if(Xe<0){O=!1;break}H+=Xe,I+=1;const Be=We(n,K.x,K.y,e,t);Y.push(Be.kind)}if(O){const X=(he,Ie)=>{const Xe=We(n,he,Ie,e,t);return(Xe==null?void 0:Xe.kind)==="station"?!0:Et(he,Ie,e,t).some(Be=>n[Be.y*e+Be.x].kind==="station")},K=(he,Ie)=>{var Be;const Xe=(Be=We(n,he,Ie,e,t))==null?void 0:Be.kind;return Xe==="rail"||Xe==="station"||Xe==="crossing"||Xe==="bridge"},te=g[0],ee=g[g.length-1];M==="both"?(!X(te.x,te.y)||!X(ee.x,ee.y))&&(O=!1):(!K(te.x,te.y)||!X(ee.x,ee.y))&&(O=!1)}if(!O||H>c){for(const X of D)Vt(n,X.x,X.y,e,X.tile);for(const X of z)Vt(n,X.x,X.y,e,X.tile);return null}return{placed:I,kinds:[...new Set(Y)],cost:H,intercity:P}},_=(g,M,P,C,D)=>{var H,O,X,K;let z=g,Y=M;if(C==="both"){const te=Zi(n,g,e,t),ee=Zi(n,M,e,t);if(!te||!ee)return null;z=((H=We(n,g.x,g.y,e,t))==null?void 0:H.kind)==="station"?g:te,Y=((O=We(n,M.x,M.y,e,t))==null?void 0:O.kind)==="station"?M:ee}else{const te=(X=We(n,g.x,g.y,e,t))==null?void 0:X.kind;if(te!=="rail"&&te!=="station"&&te!=="crossing"&&te!=="bridge")return null;if(((K=We(n,M.x,M.y,e,t))==null?void 0:K.kind)!=="station"){const ee=Zi(n,M,e,t);if(!ee)return null;Y=ee}}const I=uu(n,e,t,z,Y,P);return I?m(I,C,D):null};if(o){const g=_(o.a,o.b,140,"both",!0);if(g)return g}if(l.length===0){const g=(a==null?void 0:a.cx)??Math.floor(e/2),M=(a==null?void 0:a.cy)??Math.floor(t/2),P=[];for(let C=M-8;C<=M+8;C++)for(let D=g-10;D<=g+10;D++)!Cn(n,D,C,e,t)||!Et(D,C,e,t).some(Y=>Mt.has(n[Y.y*e+Y.x].kind))||P.push({x:D,y:C});if(P.length<2)return null;for(let C=0;C<24;C++){const D=P[Qe(i,0,P.length-1)],z=P[Qe(i,0,P.length-1)],Y=Math.hypot(D.x-z.x,D.y-z.y);if(Y<6||Y>14)continue;const I=_(D,z,40,"both",!1);if(I)return I}return null}const v=l.filter(g=>{const M=n[g.y*e+g.x].kind;return M==="rail"||M==="station"});if(v.length===0)return null;v.sort((g,M)=>a?Math.hypot(g.x-a.cx,g.y-a.cy)-Math.hypot(M.x-a.cx,M.y-a.cy):0);const p=v[Qe(i,0,Math.min(5,v.length-1))],d=[];for(const g of l){if(g.x===p.x&&g.y===p.y||n[g.y*e+g.x].kind!=="station")continue;const M=Math.hypot(g.x-p.x,g.y-p.y);M>=5&&M<=40&&d.push(g)}const y=a?Math.ceil(a.radius)+16:22,T=Math.max(2,((a==null?void 0:a.cy)??p.y)-y),S=Math.min(t-3,((a==null?void 0:a.cy)??p.y)+y),A=Math.max(2,((a==null?void 0:a.cx)??p.x)-y),b=Math.min(e-3,((a==null?void 0:a.cx)??p.x)+y);for(let g=T;g<=S;g++)for(let M=A;M<=b;M++){if(!Cn(n,M,g,e,t)||n[g*e+M].kind==="station"||!Et(M,g,e,t).some(D=>Mt.has(n[D.y*e+D.x].kind)))continue;const C=Math.hypot(M-p.x,g-p.y);C<5||C>24||d.push({x:M,y:g})}d.sort((g,M)=>Math.hypot(g.x-p.x,g.y-p.y)-Math.hypot(M.x-p.x,M.y-p.y));const w=d.slice(0,Math.min(10,d.length));for(let g=0;g<w.length;g++){const M=w[Qe(i,0,w.length-1)],P=_(p,M,60,"goal",!1);if(P)return P}return null}function Fu(n,e,t,i,r){const s=[],a=(r==null?void 0:r.cx)??e/2,o=(r==null?void 0:r.cy)??t/2,c=r?Math.ceil(r.radius)+12:24,l=Math.max(1,o-c),u=Math.min(t-2,o+c),h=Math.max(1,a-c),f=Math.min(e-2,a+c);for(let m=l;m<=u;m++)for(let _=h;_<=f;_++){const v=We(n,_,m,e,t);if(!v||v.kind==="station"||!Cn(n,_,m,e,t))continue;const p=v.kind==="rail",d=Et(_,m,e,t).some(S=>{const A=n[S.y*e+S.x];return A.kind==="rail"||A.kind==="crossing"||A.kind==="station"}),y=tl(n,_,m,e,t);if(!p&&!d&&!y)continue;const T=(p?3:d?2:1)+(y?2:0)+eo(_,m,r)+i()*.3;s.push({x:_,y:m,score:T})}return s.length===0?null:(s.sort((m,_)=>_.score-m.score),s[Qe(i,0,Math.min(5,s.length-1))])}function Ou(n,e,t,i,r,s,a,o){if(!zt(i,r,e,t))return!1;const c=We(n,i,r,e,t);return!c||!mr(c.kind)?!1:(Vt(n,i,r,e,Ct(s,a,Qe(o,0,3),ur)),!0)}function Bu(n,e,t,i){const r=i?e==="town"?.35:e==="city"?.7:e==="metropolis"?.9:0:0;return[{key:"residential",w:n.residential},{key:"commercial",w:n.commercial},{key:"industrial",w:n.industrial},{key:"road",w:n.road+(t?1.2:0)+(i?.25:0)},{key:"rail",w:n.rail+r},{key:"school",w:n.school},{key:"park",w:n.park},{key:"hospital",w:n.hospital},{key:"tower",w:n.tower},{key:"station",w:n.station+r*.4},{key:"plaza",w:e==="city"||e==="metropolis"?.25:.05},{key:"upgrade",w:e==="town"?.4:e==="city"?.7:e==="metropolis"?1:.1},{key:"skyscraper",w:n.skyscraper},{key:"demolish",w:t?1.8:.05}]}function ku(n,e,t,i,r,s,a,o=Fn,c=[]){const l=Gi((s^a*2654435761)>>>0),u=o.buildCosts,h=Ru(i,r,o),f=ou(n,e,t),m=gu(c,n,e,t,l),_=c.length>=2,v=Iu(l,Bu(h,r,f,_));if(v==="demolish"||v==="road"&&f){const w=vs(n,e,t,i.population,i.housing);if(w){const g=Math.round(u.road*1.5);if(zn(i.budget,g,o))return Vt(n,w.x,w.y,e,Ct("road",0,0,Ui)),{built:!0,kind:"demolish",cost:g}}if(v==="demolish")return{built:!1,cost:0}}if(v==="upgrade"){const g=Uu(n,e,t,l,["residential","commercial","industrial","tower"],r==="metropolis"?5:r==="city"?4:3);if(!g)return{built:!1,cost:0};const M=We(n,g.x,g.y,e,t),P=u.upgradeBase*(M.tier+1);return zn(i.budget,P,o)?(M.tier+=1,M.construction=Pu,{built:!0,kind:"upgrade",cost:P}):{built:!1,cost:0}}const p=u[v]??u.fallback;if(v==="road"){const w=Go(n,e,t,l,m);if(!w){const D=vs(n,e,t,i.population,i.housing);if(!D)return{built:!1,cost:0};const z=Math.round(u.road*1.5);return zn(i.budget,z,o)?(Vt(n,D.x,D.y,e,Ct("road",0,0,Ui)),{built:!0,kind:"demolish",cost:z}):{built:!1,cost:0}}const g=We(n,w.x,w.y,e,t),M=or(g.kind,"road",o),P=u.road+(Number.isFinite(M)?M:0);if(!zn(i.budget,P,o))return{built:!1,cost:0};const C=aa(g.kind,"road");return Vt(n,w.x,w.y,e,Ct(C,0,0,Ui)),{built:!0,kind:C,cost:P}}if(v==="rail"){const g=Tu(c,r,l)?yu(c,n,e,t,l):null,M=Vo(n,e,t,l,o,i.budget,m,g);return M?{built:!0,kind:M.intercity?"intercity-rail":M.kinds.includes("station")?"rail":M.kinds.includes("bridge")?"bridge":M.kinds.includes("crossing")?"crossing":"rail",cost:M.cost}:{built:!1,cost:0}}if(v==="station"){const w=Fu(n,e,t,l,m);if(!w){const C=Vo(n,e,t,l,o,i.budget,m,null);return C?{built:!0,kind:"station",cost:C.cost}:{built:!1,cost:0}}const g=We(n,w.x,w.y,e,t);if(!Cn(n,w.x,w.y,e,t))return{built:!1,cost:0};const M=or(g.kind==="rail"?"grass":g.kind,"station",o),P=u.station+(Number.isFinite(M)?M:0);return zn(i.budget,P,o)?(Vt(n,w.x,w.y,e,Ct("station",1,Qe(l,0,2),ur)),{built:!0,kind:"station",cost:P}):{built:!1,cost:0}}const d=Lu(n,e,t,l,m);if(!d){const w=Go(n,e,t,l,m);if(w){const P=We(n,w.x,w.y,e,t),C=or(P.kind,"road",o),D=u.road+(Number.isFinite(C)?C:0);if(zn(i.budget,D,o)){const z=aa(P.kind,"road");return Vt(n,w.x,w.y,e,Ct(z,0,0,Ui)),{built:!0,kind:z,cost:D}}}const g=vs(n,e,t,i.population,i.housing),M=Math.round(u.road*1.5);return g&&zn(i.budget,M,o)?(Vt(n,g.x,g.y,e,Ct("road",0,0,Ui)),{built:!0,kind:"demolish",cost:M}):{built:!1,cost:0}}const y=v,T=v==="skyscraper"||v==="tower"?2:1,S=We(n,d.x,d.y,e,t),A=or(S.kind,"building",o);if(!Number.isFinite(A))return{built:!1,cost:0};const b=p+A;return zn(i.budget,b,o)?Ou(n,e,t,d.x,d.y,y,T,l)?{built:!0,kind:v,cost:b}:{built:!1,cost:0}:{built:!1,cost:0}}function zu(n){for(const e of n)e.construction>0&&(e.construction=Math.max(0,e.construction-1/3))}function Gu(n,e=Fn){const{width:t,height:i,seed:r}=n,s=Gi(r),a=Cu(t,i,r,e.terrain),o=mu(a,t,i,s),c=Math.max(1,o.length),l=e.population.initial*c,u=e.budget.initial+(c-1)*80,f=il(a,{population:l,budget:u,day:0},e);return f.population=l,f.budget=u,{width:t,height:i,tiles:a,stats:f,vehicles:[],stage:rl(l,e),buildCooldown:.8,nextVehicleId:1,seed:r,settlements:o}}function to(n,e,t,i,r,s,a=64){if(!zt(i.x,i.y,e,t)||!zt(r.x,r.y,e,t))return null;const o=We(n,i.x,i.y,e,t),c=We(n,r.x,r.y,e,t);if(!o||!c||!s.has(o.kind)||!s.has(c.kind))return null;if(i.x===r.x&&i.y===r.y)return[{...i}];const l=(p,d)=>d*e+p,u=(p,d)=>Math.abs(p-r.x)+Math.abs(d-r.y),h=[],f=new Map,m=new Map,_=l(i.x,i.y);m.set(_,0),h.push({x:i.x,y:i.y,g:0,f:u(i.x,i.y),dx:0,dy:0});let v=0;for(;h.length>0&&v++<e*t*4;){let p=0;for(let y=1;y<h.length;y++)h[y].f<h[p].f&&(p=y);const d=h.splice(p,1)[0];if(d.x===r.x&&d.y===r.y){const y=[{x:d.x,y:d.y}];let T=d.x,S=d.y;for(;T!==i.x||S!==i.y;){const A=f.get(l(T,S));if(!A)break;T=A.x,S=A.y,y.push({x:T,y:S})}return y.reverse(),y.length>a?null:y}for(const y of Et(d.x,d.y,e,t)){const T=We(n,y.x,y.y,e,t);if(!T||!s.has(T.kind))continue;const S=y.x-d.x,A=y.y-d.y;let b=1;(d.dx!==0||d.dy!==0)&&(S===d.dx&&A===d.dy?b=.85:b=1.2);const w=d.g+b,g=l(y.x,y.y);w>=(m.get(g)??1/0)||(m.set(g,w),f.set(g,{x:d.x,y:d.y}),h.push({x:y.x,y:y.y,g:w,f:w+u(y.x,y.y),dx:S,dy:A}))}}return null}function Ni(n,e,t,i){const r=[];for(let s=0;s<t;s++)for(let a=0;a<e;a++)i(n[s*e+a])&&r.push({x:a,y:s});return r}function ol(n){const e=[0];for(let t=1;t<n.length;t++){const i=n[t-1],r=n[t];e.push(e[t-1]+Math.hypot(r.x-i.x,r.y-i.y))}return e}function no(n){const e=ol(n);return e[e.length-1]??0}function cl(n,e){if(n.length===0)return{x:0,y:0,dir:0};if(n.length===1){const m=n[0];return{x:m.x,y:m.y,dir:0}}const t=ol(n),i=t[t.length-1],r=Math.max(0,Math.min(i,e));let s=0;for(;s<t.length-2&&t[s+1]<r;)s+=1;const a=n[s],o=n[s+1],c=t[s],l=Math.max(1e-6,t[s+1]-c),u=(r-c)/l,h=o.x-a.x,f=o.y-a.y;return{x:a.x+h*u,y:a.y+f*u,dir:Math.atan2(f,h)}}const Ho=[0,1,2,3,4,5],io=.55,ll=160,Vu=.4,Hu=1.8;function Wu(n){if(n.kind!=="train"){n.carPoses=void 0;return}const e=n.cars??4,t=[];for(let r=0;r<e;r++)t.push(cl(n.path,Math.max(0,n.progress-r*io)));n.carPoses=t;const i=t[0];n.x=i.x,n.y=i.y,n.dir=i.dir}function Fi(n){if(n.kind==="train")Wu(n);else{const e=cl(n.path,n.progress);n.x=e.x,n.y=e.y,n.dir=e.dir}}function Xu(n,e,t,i=3){const r=n.filter(s=>Math.hypot(s.x-e.x,s.y-e.y)>=i);if(r.length===0){if(n.length<=1)return null;const s=n.filter(a=>a.x!==e.x||a.y!==e.y);return s.length===0?null:s[Qe(t,0,s.length-1)]}return r[Qe(t,0,r.length-1)]}function ul(n,e,t,i,r,s){const a={x:Math.round(n.x),y:Math.round(n.y)},o=We(e,a.x,a.y,t,i);let c=a;if(!o||!Mt.has(o.kind)){if(r.length===0)return!1;c=r[Qe(s,0,r.length-1)]}let l=null,u=null;for(let h=0;h<8;h++){if(l=Xu(r,c,s,4),!l)return!1;if(u=to(e,t,i,c,l,Mt),u&&u.length>=2)break;u=null}return!u||!l?!1:(n.destination=l,n.path=u,n.progress=0,Fi(n),!0)}function fl(n,e,t,i,r,s,a){const o={x:Math.round(n.x),y:Math.round(n.y)},c=We(e,o.x,o.y,t,i);let l=o;if(!c||!zi.has(c.kind)){const y=r.length>0?r:s;if(y.length===0)return!1;l=y[Qe(a,0,y.length-1)]}const h=(r.length>=2?r:s).filter(y=>y.x!==l.x||y.y!==l.y);if(h.length===0)return!1;const f=h.map(y=>({...y,d:Math.hypot(y.x-l.x,y.y-l.y)})).sort((y,T)=>T.d-y.d);let m=null,_=null;const v=[...f],p=Math.min(4,v.length);for(let y=p-1;y>0;y--){const T=Qe(a,0,y),S=v[y];v[y]=v[T],v[T]=S}for(const y of v){const T=to(e,t,i,l,y,zi,ll);if(T&&T.length>=2){m={x:y.x,y:y.y},_=T;break}}if(!_||!m)return!1;n.destination=m,n.path=_;const d=n.cars??4;return n.progress=Math.min((d-1)*io,no(_)*.2),Fi(n),!0}function qu(n,e,t,i,r,s,a,o){const c=Gi(a+o*9973>>>0),l=Ni(n,e,t,y=>Mt.has(y.kind)),u=Ni(n,e,t,y=>zi.has(y.kind)),h=Ni(n,e,t,y=>y.kind==="station"),f=Math.min(40,Math.floor(s/8)+Math.floor(l.length/6)),m=h.length>=4?Math.min(2,Math.floor(h.length/4)):0,_=i.filter(y=>{if(y.path.length<2)return!1;const T=We(n,y.destination.x,y.destination.y,e,t);return T?y.kind==="train"?zi.has(T.kind):Mt.has(T.kind):!1});let v=r,p=0;for(;_.filter(y=>y.kind!=="train").length<f&&l.length>1&&!(++p>60);){const y=l[Qe(c,0,l.length-1)],T=c();let S="car";T>.92?S="bus":T>.82&&(S="truck");const A=S==="bus"?1.6:S==="truck"?1.4:2+c()*.8,b={id:v++,kind:S,x:y.x,y:y.y,dir:0,speed:A,progress:0,path:[y,y],destination:{...y},color:Ho[Qe(c,0,Ho.length-1)],wait:0};ul(b,n,e,t,l,c)&&_.push(b)}if(_.filter(y=>y.kind==="train").length===0){const y=Yu(n,e,t,h,u,v,c);y&&(_.push(y),v=y.id+1)}p=0;const d=1+m;for(;_.filter(y=>y.kind==="train").length<d&&u.length>1&&!(++p>20);){const y=h.length>0?h:u,T=y[Qe(c,0,y.length-1)],S=Qe(c,3,5),A={id:v++,kind:"train",x:T.x,y:T.y,dir:0,speed:2.4,progress:0,path:[T,T],destination:{...T},color:0,cars:S,wait:0};fl(A,n,e,t,h,u,c)&&_.push(A)}return{vehicles:_,nextId:v}}function Yu(n,e,t,i,r,s,a){const o=i.length>=2?i:r;if(o.length<2)return null;const c=[];for(let u=0;u<o.length;u++)for(let h=u+1;h<o.length;h++){const f=o[u],m=o[h];c.push({a:f,b:m,d:Math.hypot(f.x-m.x,f.y-m.y)})}c.sort((u,h)=>h.d-u.d);const l=Math.min(c.length,i.length>=2?48:24);for(let u=0;u<l;u++){const{a:h,b:f}=c[u],m=to(n,e,t,h,f,zi,ll);if(!m||m.length<2)continue;const _=Qe(a,3,5),v={id:s,kind:"train",x:h.x,y:h.y,dir:0,speed:2.4,progress:0,path:m,destination:{...f},color:0,cars:_,wait:0};return v.progress=Math.min((_-1)*io,no(m)*.2),Fi(v),v}return null}function $u(n,e,t){const i=Gi(t?(t.seed^t.day*7919^n.length*104729)>>>0:1),r=t?Ni(t.tiles,t.width,t.height,o=>Mt.has(o.kind)):[],s=t?Ni(t.tiles,t.width,t.height,o=>zi.has(o.kind)):[],a=t?Ni(t.tiles,t.width,t.height,o=>o.kind==="station"):[];for(const o of n){if((o.wait??0)>0){o.wait=Math.max(0,(o.wait??0)-e);continue}const c=no(o.path);if(c<.01){t&&Wo(o,t,r,s,a,i);continue}if(o.progress+=o.speed*e,o.progress>=c-.001){o.progress=c,Fi(o),t?(Wo(o,t,r,s,a,i),o.progress=0,Fi(o)):o.progress=0,o.wait=o.kind==="train"?Hu:Vu;continue}Fi(o)}}function Wo(n,e,t,i,r,s){n.kind==="train"?fl(n,e.tiles,e.width,e.height,r,i,s):ul(n,e.tiles,e.width,e.height,t,s)}function Xo(n={},e){const t={width:n.width??28,height:n.height??28,seed:n.seed??42,secondsPerDay:n.secondsPerDay??2.8};return Gu(t,Fn)}function Zu(n,e,t,i=Fn){const r=[],s={...n,tiles:n.tiles.map(c=>({...c})),stats:{...n.stats},settlements:n.settlements.map(c=>({...c})),vehicles:n.vehicles.map(c=>{var l;return{...c,path:c.path.map(u=>({...u})),destination:{...c.destination},carPoses:(l=c.carPoses)==null?void 0:l.map(u=>({...u}))}})};zu(s.tiles),$u(s.vehicles,e,{tiles:s.tiles,width:s.width,height:s.height,seed:s.seed,day:s.stats.day}),s.buildCooldown-=e;const a=i.buildInterval,o=Math.max(a.minSeconds,t*a.dayFactor);if(s.buildCooldown<=0){const c=Gi((s.seed^s.stats.day*374761393^2654435769)>>>0);s.buildCooldown=o*(a.jitterMin+c()*a.jitterRange);const l=ku(s.tiles,s.width,s.height,s.stats,s.stage,s.seed,s.stats.day,i,s.settlements);l.built&&l.kind&&(s.stats.budget-=l.cost,r.push(l.kind)),s.stats.day+=1,s.stats=il(s.tiles,s.stats,i),s.stats.population=Au(s.stats,i),s.stage=rl(s.stats.population,i),s.stats.day%3===0&&(_u(s.settlements,s.tiles,s.width,s.height),xu(s.settlements,s.tiles,s.width,s.height).merged&&r.push("merge"));const u=qu(s.tiles,s.width,s.height,s.vehicles,s.nextVehicleId,s.stats.population,s.seed,s.stats.day);s.vehicles=u.vehicles,s.nextVehicleId=u.nextId}return{state:s,events:r}}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const ro="185",Ku=0,qo=1,Ju=2,Kr=1,Qu=2,cr=3,Jn=0,Ht=1,Pn=2,In=0,Oi=1,Yo=2,$o=3,Zo=4,ju=5,ai=100,ef=101,tf=102,nf=103,rf=104,sf=200,af=201,of=202,cf=203,oa=204,ca=205,lf=206,uf=207,ff=208,df=209,hf=210,pf=211,mf=212,gf=213,_f=214,la=0,ua=1,fa=2,Vi=3,da=4,ha=5,pa=6,ma=7,dl=0,xf=1,vf=2,vn=0,hl=1,pl=2,ml=3,so=4,gl=5,_l=6,xl=7,vl=300,fi=301,Hi=302,Ss=303,ys=304,ds=306,ga=1e3,Dn=1001,_a=1002,Pt=1003,Mf=1004,Er=1005,Nt=1006,Es=1007,ci=1008,$t=1009,Ml=1010,Sl=1011,dr=1012,ao=1013,Sn=1014,sn=1015,Un=1016,oo=1017,co=1018,hr=1020,yl=35902,El=35899,bl=1021,Tl=1022,an=1023,Nn=1026,li=1027,lo=1028,uo=1029,di=1030,fo=1031,ho=1033,Jr=33776,Qr=33777,jr=33778,es=33779,xa=35840,va=35841,Ma=35842,Sa=35843,ya=36196,Ea=37492,ba=37496,Ta=37488,Aa=37489,rs=37490,Ra=37491,wa=37808,Ca=37809,Pa=37810,Da=37811,Ia=37812,La=37813,Ua=37814,Na=37815,Fa=37816,Oa=37817,Ba=37818,ka=37819,za=37820,Ga=37821,Va=36492,Ha=36494,Wa=36495,Xa=36283,qa=36284,ss=36285,Ya=36286,Sf=3200,$a=0,yf=1,Zn="",Yt="srgb",as="srgb-linear",os="linear",et="srgb",xi=7680,Ko=519,Ef=512,bf=513,Tf=514,po=515,Af=516,Rf=517,mo=518,wf=519,Jo=35044,$n=35048,Qo="300 es",xn=2e3,pr=2001;function Cf(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function cs(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Pf(){const n=cs("canvas");return n.style.display="block",n}const jo={};function ec(...n){const e="THREE."+n.shift();console.log(e,...n)}function Al(n){const e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Ne(...n){n=Al(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function Je(...n){n=Al(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function Bi(...n){const e=n.join(" ");e in jo||(jo[e]=!0,Ne(...n))}function Df(n,e,t){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}const If={[la]:ua,[fa]:pa,[da]:ma,[Vi]:ha,[ua]:la,[pa]:fa,[ma]:da,[ha]:Vi};class pi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const r=i[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const Lt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],bs=Math.PI/180,Za=180/Math.PI;function gr(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Lt[n&255]+Lt[n>>8&255]+Lt[n>>16&255]+Lt[n>>24&255]+"-"+Lt[e&255]+Lt[e>>8&255]+"-"+Lt[e>>16&15|64]+Lt[e>>24&255]+"-"+Lt[t&63|128]+Lt[t>>8&255]+"-"+Lt[t>>16&255]+Lt[t>>24&255]+Lt[i&255]+Lt[i>>8&255]+Lt[i>>16&255]+Lt[i>>24&255]).toLowerCase()}function $e(n,e,t){return Math.max(e,Math.min(t,n))}function Lf(n,e){return(n%e+e)%e}function Ts(n,e,t){return(1-t)*n+t*e}function Ki(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Gt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const So=class So{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar($e(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos($e(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*r+e.x,this.y=s*r+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};So.prototype.isVector2=!0;let Ze=So;class qi{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,a,o){let c=i[r+0],l=i[r+1],u=i[r+2],h=i[r+3],f=s[a+0],m=s[a+1],_=s[a+2],v=s[a+3];if(h!==v||c!==f||l!==m||u!==_){let p=c*f+l*m+u*_+h*v;p<0&&(f=-f,m=-m,_=-_,v=-v,p=-p);let d=1-o;if(p<.9995){const y=Math.acos(p),T=Math.sin(y);d=Math.sin(d*y)/T,o=Math.sin(o*y)/T,c=c*d+f*o,l=l*d+m*o,u=u*d+_*o,h=h*d+v*o}else{c=c*d+f*o,l=l*d+m*o,u=u*d+_*o,h=h*d+v*o;const y=1/Math.sqrt(c*c+l*l+u*u+h*h);c*=y,l*=y,u*=y,h*=y}}e[t]=c,e[t+1]=l,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,i,r,s,a){const o=i[r],c=i[r+1],l=i[r+2],u=i[r+3],h=s[a],f=s[a+1],m=s[a+2],_=s[a+3];return e[t]=o*_+u*h+c*m-l*f,e[t+1]=c*_+u*f+l*h-o*m,e[t+2]=l*_+u*m+o*f-c*h,e[t+3]=u*_-o*h-c*f-l*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(i/2),u=o(r/2),h=o(s/2),f=c(i/2),m=c(r/2),_=c(s/2);switch(a){case"XYZ":this._x=f*u*h+l*m*_,this._y=l*m*h-f*u*_,this._z=l*u*_+f*m*h,this._w=l*u*h-f*m*_;break;case"YXZ":this._x=f*u*h+l*m*_,this._y=l*m*h-f*u*_,this._z=l*u*_-f*m*h,this._w=l*u*h+f*m*_;break;case"ZXY":this._x=f*u*h-l*m*_,this._y=l*m*h+f*u*_,this._z=l*u*_+f*m*h,this._w=l*u*h-f*m*_;break;case"ZYX":this._x=f*u*h-l*m*_,this._y=l*m*h+f*u*_,this._z=l*u*_-f*m*h,this._w=l*u*h+f*m*_;break;case"YZX":this._x=f*u*h+l*m*_,this._y=l*m*h+f*u*_,this._z=l*u*_-f*m*h,this._w=l*u*h-f*m*_;break;case"XZY":this._x=f*u*h-l*m*_,this._y=l*m*h-f*u*_,this._z=l*u*_+f*m*h,this._w=l*u*h+f*m*_;break;default:Ne("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],a=t[1],o=t[5],c=t[9],l=t[2],u=t[6],h=t[10],f=i+o+h;if(f>0){const m=.5/Math.sqrt(f+1);this._w=.25/m,this._x=(u-c)*m,this._y=(s-l)*m,this._z=(a-r)*m}else if(i>o&&i>h){const m=2*Math.sqrt(1+i-o-h);this._w=(u-c)/m,this._x=.25*m,this._y=(r+a)/m,this._z=(s+l)/m}else if(o>h){const m=2*Math.sqrt(1+o-i-h);this._w=(s-l)/m,this._x=(r+a)/m,this._y=.25*m,this._z=(c+u)/m}else{const m=2*Math.sqrt(1+h-i-o);this._w=(a-r)/m,this._x=(s+l)/m,this._y=(c+u)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs($e(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,a=e._w,o=t._x,c=t._y,l=t._z,u=t._w;return this._x=i*u+a*o+r*l-s*c,this._y=r*u+a*c+s*o-i*l,this._z=s*u+a*l+i*c-r*o,this._w=a*u-i*o-r*c-s*l,this._onChangeCallback(),this}slerp(e,t){let i=e._x,r=e._y,s=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,r=-r,s=-s,a=-a,o=-o);let c=1-t;if(o<.9995){const l=Math.acos(o),u=Math.sin(l);c=Math.sin(c*l)/u,t=Math.sin(t*l)/u,this._x=this._x*c+i*t,this._y=this._y*c+r*t,this._z=this._z*c+s*t,this._w=this._w*c+a*t,this._onChangeCallback()}else this._x=this._x*c+i*t,this._y=this._y*c+r*t,this._z=this._z*c+s*t,this._w=this._w*c+a*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const yo=class yo{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(tc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(tc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,a=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*a,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*a,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*r-o*i),u=2*(o*t-s*r),h=2*(s*i-a*t);return this.x=t+c*l+a*h-o*u,this.y=i+c*u+o*l-s*h,this.z=r+c*h+s*u-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this.z=$e(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this.z=$e(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar($e(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,a=t.x,o=t.y,c=t.z;return this.x=r*c-s*o,this.y=s*a-i*c,this.z=i*o-r*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return As.copy(this).projectOnVector(e),this.sub(As)}reflect(e){return this.sub(As.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos($e(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};yo.prototype.isVector3=!0;let B=yo;const As=new B,tc=new qi,Eo=class Eo{constructor(e,t,i,r,s,a,o,c,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,a,o,c,l)}set(e,t,i,r,s,a,o,c,l){const u=this.elements;return u[0]=e,u[1]=r,u[2]=o,u[3]=t,u[4]=s,u[5]=c,u[6]=i,u[7]=a,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,a=i[0],o=i[3],c=i[6],l=i[1],u=i[4],h=i[7],f=i[2],m=i[5],_=i[8],v=r[0],p=r[3],d=r[6],y=r[1],T=r[4],S=r[7],A=r[2],b=r[5],w=r[8];return s[0]=a*v+o*y+c*A,s[3]=a*p+o*T+c*b,s[6]=a*d+o*S+c*w,s[1]=l*v+u*y+h*A,s[4]=l*p+u*T+h*b,s[7]=l*d+u*S+h*w,s[2]=f*v+m*y+_*A,s[5]=f*p+m*T+_*b,s[8]=f*d+m*S+_*w,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8];return t*a*u-t*o*l-i*s*u+i*o*c+r*s*l-r*a*c}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8],h=u*a-o*l,f=o*c-u*s,m=l*s-a*c,_=t*h+i*f+r*m;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/_;return e[0]=h*v,e[1]=(r*l-u*i)*v,e[2]=(o*i-r*a)*v,e[3]=f*v,e[4]=(u*t-r*c)*v,e[5]=(r*s-o*t)*v,e[6]=m*v,e[7]=(i*c-l*t)*v,e[8]=(a*t-i*s)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,a,o){const c=Math.cos(s),l=Math.sin(s);return this.set(i*c,i*l,-i*(c*a+l*o)+a+e,-r*l,r*c,-r*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return Bi("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Rs.makeScale(e,t)),this}rotate(e){return Bi("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Rs.makeRotation(-e)),this}translate(e,t){return Bi("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Rs.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Eo.prototype.isMatrix3=!0;let Oe=Eo;const Rs=new Oe,nc=new Oe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ic=new Oe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Uf(){const n={enabled:!0,workingColorSpace:as,spaces:{},convert:function(r,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===et&&(r.r=Ln(r.r),r.g=Ln(r.g),r.b=Ln(r.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===et&&(r.r=ki(r.r),r.g=ki(r.g),r.b=ki(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Zn?os:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,a){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return Bi("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return Bi("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[as]:{primaries:e,whitePoint:i,transfer:os,toXYZ:nc,fromXYZ:ic,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Yt},outputColorSpaceConfig:{drawingBufferColorSpace:Yt}},[Yt]:{primaries:e,whitePoint:i,transfer:et,toXYZ:nc,fromXYZ:ic,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Yt}}}),n}const Ye=Uf();function Ln(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function ki(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let vi;class Nf{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{vi===void 0&&(vi=cs("canvas")),vi.width=e.width,vi.height=e.height;const r=vi.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=vi}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=cs("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=Ln(s[a]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Ln(t[i]/255)*255):t[i]=Ln(t[i]);return{data:t,width:e.width,height:e.height}}else return Ne("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Ff=0;class go{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ff++}),this.uuid=gr(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(ws(r[a].image)):s.push(ws(r[a]))}else s=ws(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function ws(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Nf.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Ne("Texture: Unable to serialize Texture."),{})}let Of=0;const Cs=new B;class Bt extends pi{constructor(e=Bt.DEFAULT_IMAGE,t=Bt.DEFAULT_MAPPING,i=Dn,r=Dn,s=Nt,a=ci,o=an,c=$t,l=Bt.DEFAULT_ANISOTROPY,u=Zn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Of++}),this.uuid=gr(),this.name="",this.source=new go(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Ze(0,0),this.repeat=new Ze(1,1),this.center=new Ze(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Oe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Cs).x}get height(){return this.source.getSize(Cs).y}get depth(){return this.source.getSize(Cs).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){Ne(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){Ne(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==vl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case ga:e.x=e.x-Math.floor(e.x);break;case Dn:e.x=e.x<0?0:1;break;case _a:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case ga:e.y=e.y-Math.floor(e.y);break;case Dn:e.y=e.y<0?0:1;break;case _a:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Bt.DEFAULT_IMAGE=null;Bt.DEFAULT_MAPPING=vl;Bt.DEFAULT_ANISOTROPY=1;const bo=class bo{constructor(e=0,t=0,i=0,r=1){this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*r+a[12]*s,this.y=a[1]*t+a[5]*i+a[9]*r+a[13]*s,this.z=a[2]*t+a[6]*i+a[10]*r+a[14]*s,this.w=a[3]*t+a[7]*i+a[11]*r+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const c=e.elements,l=c[0],u=c[4],h=c[8],f=c[1],m=c[5],_=c[9],v=c[2],p=c[6],d=c[10];if(Math.abs(u-f)<.01&&Math.abs(h-v)<.01&&Math.abs(_-p)<.01){if(Math.abs(u+f)<.1&&Math.abs(h+v)<.1&&Math.abs(_+p)<.1&&Math.abs(l+m+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const T=(l+1)/2,S=(m+1)/2,A=(d+1)/2,b=(u+f)/4,w=(h+v)/4,g=(_+p)/4;return T>S&&T>A?T<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(T),r=b/i,s=w/i):S>A?S<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(S),i=b/r,s=g/r):A<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(A),i=w/s,r=g/s),this.set(i,r,s,t),this}let y=Math.sqrt((p-_)*(p-_)+(h-v)*(h-v)+(f-u)*(f-u));return Math.abs(y)<.001&&(y=1),this.x=(p-_)/y,this.y=(h-v)/y,this.z=(f-u)/y,this.w=Math.acos((l+m+d-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this.z=$e(this.z,e.z,t.z),this.w=$e(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this.z=$e(this.z,e,t),this.w=$e(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar($e(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};bo.prototype.isVector4=!0;let mt=bo;class Bf extends pi{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Nt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new mt(0,0,e,t),this.scissorTest=!1,this.viewport=new mt(0,0,e,t),this.textures=[];const r={width:e,height:t,depth:i.depth},s=new Bt(r),a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:Nt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const r=Object.assign({},e.textures[t].image);this.textures[t].source=new go(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Mn extends Bf{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Rl extends Bt{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Pt,this.minFilter=Pt,this.wrapR=Dn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class kf extends Bt{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Pt,this.minFilter=Pt,this.wrapR=Dn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const fs=class fs{constructor(e,t,i,r,s,a,o,c,l,u,h,f,m,_,v,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,a,o,c,l,u,h,f,m,_,v,p)}set(e,t,i,r,s,a,o,c,l,u,h,f,m,_,v,p){const d=this.elements;return d[0]=e,d[4]=t,d[8]=i,d[12]=r,d[1]=s,d[5]=a,d[9]=o,d[13]=c,d[2]=l,d[6]=u,d[10]=h,d[14]=f,d[3]=m,d[7]=_,d[11]=v,d[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new fs().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,i=e.elements,r=1/Mi.setFromMatrixColumn(e,0).length(),s=1/Mi.setFromMatrixColumn(e,1).length(),a=1/Mi.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),c=Math.cos(r),l=Math.sin(r),u=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){const f=a*u,m=a*h,_=o*u,v=o*h;t[0]=c*u,t[4]=-c*h,t[8]=l,t[1]=m+_*l,t[5]=f-v*l,t[9]=-o*c,t[2]=v-f*l,t[6]=_+m*l,t[10]=a*c}else if(e.order==="YXZ"){const f=c*u,m=c*h,_=l*u,v=l*h;t[0]=f+v*o,t[4]=_*o-m,t[8]=a*l,t[1]=a*h,t[5]=a*u,t[9]=-o,t[2]=m*o-_,t[6]=v+f*o,t[10]=a*c}else if(e.order==="ZXY"){const f=c*u,m=c*h,_=l*u,v=l*h;t[0]=f-v*o,t[4]=-a*h,t[8]=_+m*o,t[1]=m+_*o,t[5]=a*u,t[9]=v-f*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const f=a*u,m=a*h,_=o*u,v=o*h;t[0]=c*u,t[4]=_*l-m,t[8]=f*l+v,t[1]=c*h,t[5]=v*l+f,t[9]=m*l-_,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const f=a*c,m=a*l,_=o*c,v=o*l;t[0]=c*u,t[4]=v-f*h,t[8]=_*h+m,t[1]=h,t[5]=a*u,t[9]=-o*u,t[2]=-l*u,t[6]=m*h+_,t[10]=f-v*h}else if(e.order==="XZY"){const f=a*c,m=a*l,_=o*c,v=o*l;t[0]=c*u,t[4]=-h,t[8]=l*u,t[1]=f*h+v,t[5]=a*u,t[9]=m*h-_,t[2]=_*h-m,t[6]=o*u,t[10]=v*h+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(zf,e,Gf)}lookAt(e,t,i){const r=this.elements;return Xt.subVectors(e,t),Xt.lengthSq()===0&&(Xt.z=1),Xt.normalize(),Gn.crossVectors(i,Xt),Gn.lengthSq()===0&&(Math.abs(i.z)===1?Xt.x+=1e-4:Xt.z+=1e-4,Xt.normalize(),Gn.crossVectors(i,Xt)),Gn.normalize(),br.crossVectors(Xt,Gn),r[0]=Gn.x,r[4]=br.x,r[8]=Xt.x,r[1]=Gn.y,r[5]=br.y,r[9]=Xt.y,r[2]=Gn.z,r[6]=br.z,r[10]=Xt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,a=i[0],o=i[4],c=i[8],l=i[12],u=i[1],h=i[5],f=i[9],m=i[13],_=i[2],v=i[6],p=i[10],d=i[14],y=i[3],T=i[7],S=i[11],A=i[15],b=r[0],w=r[4],g=r[8],M=r[12],P=r[1],C=r[5],D=r[9],z=r[13],Y=r[2],I=r[6],H=r[10],O=r[14],X=r[3],K=r[7],te=r[11],ee=r[15];return s[0]=a*b+o*P+c*Y+l*X,s[4]=a*w+o*C+c*I+l*K,s[8]=a*g+o*D+c*H+l*te,s[12]=a*M+o*z+c*O+l*ee,s[1]=u*b+h*P+f*Y+m*X,s[5]=u*w+h*C+f*I+m*K,s[9]=u*g+h*D+f*H+m*te,s[13]=u*M+h*z+f*O+m*ee,s[2]=_*b+v*P+p*Y+d*X,s[6]=_*w+v*C+p*I+d*K,s[10]=_*g+v*D+p*H+d*te,s[14]=_*M+v*z+p*O+d*ee,s[3]=y*b+T*P+S*Y+A*X,s[7]=y*w+T*C+S*I+A*K,s[11]=y*g+T*D+S*H+A*te,s[15]=y*M+T*z+S*O+A*ee,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],a=e[1],o=e[5],c=e[9],l=e[13],u=e[2],h=e[6],f=e[10],m=e[14],_=e[3],v=e[7],p=e[11],d=e[15],y=c*m-l*f,T=o*m-l*h,S=o*f-c*h,A=a*m-l*u,b=a*f-c*u,w=a*h-o*u;return t*(v*y-p*T+d*S)-i*(_*y-p*A+d*b)+r*(_*T-v*A+d*w)-s*(_*S-v*b+p*w)}determinantAffine(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[1],a=e[5],o=e[9],c=e[2],l=e[6],u=e[10];return t*(a*u-o*l)-i*(s*u-o*c)+r*(s*l-a*c)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8],h=e[9],f=e[10],m=e[11],_=e[12],v=e[13],p=e[14],d=e[15],y=t*o-i*a,T=t*c-r*a,S=t*l-s*a,A=i*c-r*o,b=i*l-s*o,w=r*l-s*c,g=u*v-h*_,M=u*p-f*_,P=u*d-m*_,C=h*p-f*v,D=h*d-m*v,z=f*d-m*p,Y=y*z-T*D+S*C+A*P-b*M+w*g;if(Y===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const I=1/Y;return e[0]=(o*z-c*D+l*C)*I,e[1]=(r*D-i*z-s*C)*I,e[2]=(v*w-p*b+d*A)*I,e[3]=(f*b-h*w-m*A)*I,e[4]=(c*P-a*z-l*M)*I,e[5]=(t*z-r*P+s*M)*I,e[6]=(p*S-_*w-d*T)*I,e[7]=(u*w-f*S+m*T)*I,e[8]=(a*D-o*P+l*g)*I,e[9]=(i*P-t*D-s*g)*I,e[10]=(_*b-v*S+d*y)*I,e[11]=(h*S-u*b-m*y)*I,e[12]=(o*M-a*C-c*g)*I,e[13]=(t*C-i*M+r*g)*I,e[14]=(v*T-_*A-p*y)*I,e[15]=(u*A-h*T+f*y)*I,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,a=e.x,o=e.y,c=e.z,l=s*a,u=s*o;return this.set(l*a+i,l*o-r*c,l*c+r*o,0,l*o+r*c,u*o+i,u*c-r*a,0,l*c-r*o,u*c+r*a,s*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,a){return this.set(1,i,s,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,a=t._y,o=t._z,c=t._w,l=s+s,u=a+a,h=o+o,f=s*l,m=s*u,_=s*h,v=a*u,p=a*h,d=o*h,y=c*l,T=c*u,S=c*h,A=i.x,b=i.y,w=i.z;return r[0]=(1-(v+d))*A,r[1]=(m+S)*A,r[2]=(_-T)*A,r[3]=0,r[4]=(m-S)*b,r[5]=(1-(f+d))*b,r[6]=(p+y)*b,r[7]=0,r[8]=(_+T)*w,r[9]=(p-y)*w,r[10]=(1-(f+v))*w,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];const s=this.determinantAffine();if(s===0)return i.set(1,1,1),t.identity(),this;let a=Mi.set(r[0],r[1],r[2]).length();const o=Mi.set(r[4],r[5],r[6]).length(),c=Mi.set(r[8],r[9],r[10]).length();s<0&&(a=-a),jt.copy(this);const l=1/a,u=1/o,h=1/c;return jt.elements[0]*=l,jt.elements[1]*=l,jt.elements[2]*=l,jt.elements[4]*=u,jt.elements[5]*=u,jt.elements[6]*=u,jt.elements[8]*=h,jt.elements[9]*=h,jt.elements[10]*=h,t.setFromRotationMatrix(jt),i.x=a,i.y=o,i.z=c,this}makePerspective(e,t,i,r,s,a,o=xn,c=!1){const l=this.elements,u=2*s/(t-e),h=2*s/(i-r),f=(t+e)/(t-e),m=(i+r)/(i-r);let _,v;if(c)_=s/(a-s),v=a*s/(a-s);else if(o===xn)_=-(a+s)/(a-s),v=-2*a*s/(a-s);else if(o===pr)_=-a/(a-s),v=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=u,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=h,l[9]=m,l[13]=0,l[2]=0,l[6]=0,l[10]=_,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,r,s,a,o=xn,c=!1){const l=this.elements,u=2/(t-e),h=2/(i-r),f=-(t+e)/(t-e),m=-(i+r)/(i-r);let _,v;if(c)_=1/(a-s),v=a/(a-s);else if(o===xn)_=-2/(a-s),v=-(a+s)/(a-s);else if(o===pr)_=-1/(a-s),v=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=u,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=h,l[9]=0,l[13]=m,l[2]=0,l[6]=0,l[10]=_,l[14]=v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};fs.prototype.isMatrix4=!0;let dt=fs;const Mi=new B,jt=new dt,zf=new B(0,0,0),Gf=new B(1,1,1),Gn=new B,br=new B,Xt=new B,rc=new dt,sc=new qi;class Qn{constructor(e=0,t=0,i=0,r=Qn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],c=r[1],l=r[5],u=r[9],h=r[2],f=r[6],m=r[10];switch(t){case"XYZ":this._y=Math.asin($e(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,m),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-$e(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin($e(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,m),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-$e(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,m),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin($e(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-$e(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,m),this._y=0);break;default:Ne("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return rc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(rc,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return sc.setFromEuler(this),this.setFromQuaternion(sc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Qn.DEFAULT_ORDER="XYZ";class wl{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Vf=0;const ac=new B,Si=new qi,En=new dt,Tr=new B,Ji=new B,Hf=new B,Wf=new qi,oc=new B(1,0,0),cc=new B(0,1,0),lc=new B(0,0,1),uc={type:"added"},Xf={type:"removed"},yi={type:"childadded",child:null},Ps={type:"childremoved",child:null};class bt extends pi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Vf++}),this.uuid=gr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=bt.DEFAULT_UP.clone();const e=new B,t=new Qn,i=new qi,r=new B(1,1,1);function s(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new dt},normalMatrix:{value:new Oe}}),this.matrix=new dt,this.matrixWorld=new dt,this.matrixAutoUpdate=bt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=bt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new wl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Si.setFromAxisAngle(e,t),this.quaternion.multiply(Si),this}rotateOnWorldAxis(e,t){return Si.setFromAxisAngle(e,t),this.quaternion.premultiply(Si),this}rotateX(e){return this.rotateOnAxis(oc,e)}rotateY(e){return this.rotateOnAxis(cc,e)}rotateZ(e){return this.rotateOnAxis(lc,e)}translateOnAxis(e,t){return ac.copy(e).applyQuaternion(this.quaternion),this.position.add(ac.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(oc,e)}translateY(e){return this.translateOnAxis(cc,e)}translateZ(e){return this.translateOnAxis(lc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(En.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Tr.copy(e):Tr.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),Ji.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?En.lookAt(Ji,Tr,this.up):En.lookAt(Tr,Ji,this.up),this.quaternion.setFromRotationMatrix(En),r&&(En.extractRotation(r.matrixWorld),Si.setFromRotationMatrix(En),this.quaternion.premultiply(Si.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Je("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(uc),yi.child=e,this.dispatchEvent(yi),yi.child=null):Je("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Xf),Ps.child=e,this.dispatchEvent(Ps),Ps.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),En.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),En.multiply(e.parent.matrixWorld)),e.applyMatrix4(En),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(uc),yi.child=e,this.dispatchEvent(yi),yi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ji,e,Hf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ji,Wf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,r=e.z,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*i-s[8]*r,s[13]+=i-s[1]*t-s[5]*i-s[9]*r,s[14]+=r-s[2]*t-s[6]*i-s[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){const r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){const s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].updateWorldMatrix(!1,!0,i)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),this.static!==!1&&(r.static=this.static),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(o=>({...o})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){const h=c[l];s(e.shapes,h)}else s(e.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(s(e.materials,this.material[c]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];r.animations.push(s(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),u=a(e.images),h=a(e.shapes),f=a(e.skeletons),m=a(e.animations),_=a(e.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),f.length>0&&(i.skeletons=f),m.length>0&&(i.animations=m),_.length>0&&(i.nodes=_)}return i.object=r,i;function a(o){const c=[];for(const l in o){const u=o[l];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}bt.DEFAULT_UP=new B(0,1,0);bt.DEFAULT_MATRIX_AUTO_UPDATE=!0;bt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Dt extends bt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const qf={type:"move"};class Ds{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Dt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Dt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new B,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new B),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Dt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new B,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new B,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const v of e.hand.values()){const p=t.getJointPose(v,i),d=this._getHandJoint(l,v);p!==null&&(d.matrix.fromArray(p.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=p.radius),d.visible=p!==null}const u=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],f=u.position.distanceTo(h.position),m=.02,_=.005;l.inputState.pinching&&f>m+_?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&f<=m-_&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(qf)))}return o!==null&&(o.visible=r!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Dt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const Cl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Vn={h:0,s:0,l:0},Ar={h:0,s:0,l:0};function Is(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class qe{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Yt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ye.colorSpaceToWorking(this,t),this}setRGB(e,t,i,r=Ye.workingColorSpace){return this.r=e,this.g=t,this.b=i,Ye.colorSpaceToWorking(this,r),this}setHSL(e,t,i,r=Ye.workingColorSpace){if(e=Lf(e,1),t=$e(t,0,1),i=$e(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,a=2*i-s;this.r=Is(a,s,e+1/3),this.g=Is(a,s,e),this.b=Is(a,s,e-1/3)}return Ye.colorSpaceToWorking(this,r),this}setStyle(e,t=Yt){function i(s){s!==void 0&&parseFloat(s)<1&&Ne("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:Ne("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);Ne("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Yt){const i=Cl[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Ne("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ln(e.r),this.g=Ln(e.g),this.b=Ln(e.b),this}copyLinearToSRGB(e){return this.r=ki(e.r),this.g=ki(e.g),this.b=ki(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Yt){return Ye.workingToColorSpace(Ut.copy(this),e),Math.round($e(Ut.r*255,0,255))*65536+Math.round($e(Ut.g*255,0,255))*256+Math.round($e(Ut.b*255,0,255))}getHexString(e=Yt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ye.workingColorSpace){Ye.workingToColorSpace(Ut.copy(this),t);const i=Ut.r,r=Ut.g,s=Ut.b,a=Math.max(i,r,s),o=Math.min(i,r,s);let c,l;const u=(o+a)/2;if(o===a)c=0,l=0;else{const h=a-o;switch(l=u<=.5?h/(a+o):h/(2-a-o),a){case i:c=(r-s)/h+(r<s?6:0);break;case r:c=(s-i)/h+2;break;case s:c=(i-r)/h+4;break}c/=6}return e.h=c,e.s=l,e.l=u,e}getRGB(e,t=Ye.workingColorSpace){return Ye.workingToColorSpace(Ut.copy(this),t),e.r=Ut.r,e.g=Ut.g,e.b=Ut.b,e}getStyle(e=Yt){Ye.workingToColorSpace(Ut.copy(this),e);const t=Ut.r,i=Ut.g,r=Ut.b;return e!==Yt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(Vn),this.setHSL(Vn.h+e,Vn.s+t,Vn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Vn),e.getHSL(Ar);const i=Ts(Vn.h,Ar.h,t),r=Ts(Vn.s,Ar.s,t),s=Ts(Vn.l,Ar.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ut=new qe;qe.NAMES=Cl;class _o{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new qe(e),this.density=t}clone(){return new _o(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Yf extends bt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Qn,this.environmentIntensity=1,this.environmentRotation=new Qn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const en=new B,bn=new B,Ls=new B,Tn=new B,Ei=new B,bi=new B,fc=new B,Us=new B,Ns=new B,Fs=new B,Os=new mt,Bs=new mt,ks=new mt;class rn{constructor(e=new B,t=new B,i=new B){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),en.subVectors(e,t),r.cross(en);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){en.subVectors(r,t),bn.subVectors(i,t),Ls.subVectors(e,t);const a=en.dot(en),o=en.dot(bn),c=en.dot(Ls),l=bn.dot(bn),u=bn.dot(Ls),h=a*l-o*o;if(h===0)return s.set(0,0,0),null;const f=1/h,m=(l*c-o*u)*f,_=(a*u-o*c)*f;return s.set(1-m-_,_,m)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,Tn)===null?!1:Tn.x>=0&&Tn.y>=0&&Tn.x+Tn.y<=1}static getInterpolation(e,t,i,r,s,a,o,c){return this.getBarycoord(e,t,i,r,Tn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,Tn.x),c.addScaledVector(a,Tn.y),c.addScaledVector(o,Tn.z),c)}static getInterpolatedAttribute(e,t,i,r,s,a){return Os.setScalar(0),Bs.setScalar(0),ks.setScalar(0),Os.fromBufferAttribute(e,t),Bs.fromBufferAttribute(e,i),ks.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Os,s.x),a.addScaledVector(Bs,s.y),a.addScaledVector(ks,s.z),a}static isFrontFacing(e,t,i,r){return en.subVectors(i,t),bn.subVectors(e,t),en.cross(bn).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return en.subVectors(this.c,this.b),bn.subVectors(this.a,this.b),en.cross(bn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return rn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return rn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return rn.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return rn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return rn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let a,o;Ei.subVectors(r,i),bi.subVectors(s,i),Us.subVectors(e,i);const c=Ei.dot(Us),l=bi.dot(Us);if(c<=0&&l<=0)return t.copy(i);Ns.subVectors(e,r);const u=Ei.dot(Ns),h=bi.dot(Ns);if(u>=0&&h<=u)return t.copy(r);const f=c*h-u*l;if(f<=0&&c>=0&&u<=0)return a=c/(c-u),t.copy(i).addScaledVector(Ei,a);Fs.subVectors(e,s);const m=Ei.dot(Fs),_=bi.dot(Fs);if(_>=0&&m<=_)return t.copy(s);const v=m*l-c*_;if(v<=0&&l>=0&&_<=0)return o=l/(l-_),t.copy(i).addScaledVector(bi,o);const p=u*_-m*h;if(p<=0&&h-u>=0&&m-_>=0)return fc.subVectors(s,r),o=(h-u)/(h-u+(m-_)),t.copy(r).addScaledVector(fc,o);const d=1/(p+v+f);return a=v*d,o=f*d,t.copy(i).addScaledVector(Ei,a).addScaledVector(bi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class mi{constructor(e=new B(1/0,1/0,1/0),t=new B(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(tn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(tn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=tn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,tn):tn.fromBufferAttribute(s,a),tn.applyMatrix4(e.matrixWorld),this.expandByPoint(tn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Rr.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Rr.copy(i.boundingBox)),Rr.applyMatrix4(e.matrixWorld),this.union(Rr)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,tn),tn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Qi),wr.subVectors(this.max,Qi),Ti.subVectors(e.a,Qi),Ai.subVectors(e.b,Qi),Ri.subVectors(e.c,Qi),Hn.subVectors(Ai,Ti),Wn.subVectors(Ri,Ai),ti.subVectors(Ti,Ri);let t=[0,-Hn.z,Hn.y,0,-Wn.z,Wn.y,0,-ti.z,ti.y,Hn.z,0,-Hn.x,Wn.z,0,-Wn.x,ti.z,0,-ti.x,-Hn.y,Hn.x,0,-Wn.y,Wn.x,0,-ti.y,ti.x,0];return!zs(t,Ti,Ai,Ri,wr)||(t=[1,0,0,0,1,0,0,0,1],!zs(t,Ti,Ai,Ri,wr))?!1:(Cr.crossVectors(Hn,Wn),t=[Cr.x,Cr.y,Cr.z],zs(t,Ti,Ai,Ri,wr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,tn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(tn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(An[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),An[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),An[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),An[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),An[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),An[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),An[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),An[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(An),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const An=[new B,new B,new B,new B,new B,new B,new B,new B],tn=new B,Rr=new mi,Ti=new B,Ai=new B,Ri=new B,Hn=new B,Wn=new B,ti=new B,Qi=new B,wr=new B,Cr=new B,ni=new B;function zs(n,e,t,i,r){for(let s=0,a=n.length-3;s<=a;s+=3){ni.fromArray(n,s);const o=r.x*Math.abs(ni.x)+r.y*Math.abs(ni.y)+r.z*Math.abs(ni.z),c=e.dot(ni),l=t.dot(ni),u=i.dot(ni);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>o)return!1}return!0}const yt=new B,Pr=new Ze;let $f=0;class on extends pi{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:$f++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Jo,this.updateRanges=[],this.gpuType=sn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Pr.fromBufferAttribute(this,t),Pr.applyMatrix3(e),this.setXY(t,Pr.x,Pr.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)yt.fromBufferAttribute(this,t),yt.applyMatrix3(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)yt.fromBufferAttribute(this,t),yt.applyMatrix4(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)yt.fromBufferAttribute(this,t),yt.applyNormalMatrix(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)yt.fromBufferAttribute(this,t),yt.transformDirection(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Ki(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Gt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ki(t,this.array)),t}setX(e,t){return this.normalized&&(t=Gt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ki(t,this.array)),t}setY(e,t){return this.normalized&&(t=Gt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ki(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Gt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ki(t,this.array)),t}setW(e,t){return this.normalized&&(t=Gt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Gt(t,this.array),i=Gt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=Gt(t,this.array),i=Gt(i,this.array),r=Gt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=Gt(t,this.array),i=Gt(i,this.array),r=Gt(r,this.array),s=Gt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Jo&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class Pl extends on{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Dl extends on{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class kt extends on{constructor(e,t,i){super(new Float32Array(e),t,i)}}const Zf=new mi,ji=new B,Gs=new B;class _r{constructor(e=new B,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Zf.setFromPoints(e).getCenter(i);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ji.subVectors(e,this.center);const t=ji.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(ji,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Gs.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ji.copy(e.center).add(Gs)),this.expandByPoint(ji.copy(e.center).sub(Gs))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let Kf=0;const Jt=new dt,Vs=new bt,wi=new B,qt=new mi,er=new mi,Rt=new B;class cn extends pi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Kf++}),this.uuid=gr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Cf(e)?Dl:Pl)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Oe().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Jt.makeRotationFromQuaternion(e),this.applyMatrix4(Jt),this}rotateX(e){return Jt.makeRotationX(e),this.applyMatrix4(Jt),this}rotateY(e){return Jt.makeRotationY(e),this.applyMatrix4(Jt),this}rotateZ(e){return Jt.makeRotationZ(e),this.applyMatrix4(Jt),this}translate(e,t,i){return Jt.makeTranslation(e,t,i),this.applyMatrix4(Jt),this}scale(e,t,i){return Jt.makeScale(e,t,i),this.applyMatrix4(Jt),this}lookAt(e){return Vs.lookAt(e),Vs.updateMatrix(),this.applyMatrix4(Vs.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(wi).negate(),this.translate(wi.x,wi.y,wi.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const a=e[r];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new kt(i,3))}else{const i=Math.min(e.length,t.count);for(let r=0;r<i;r++){const s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&Ne("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new mi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Je("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new B(-1/0,-1/0,-1/0),new B(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];qt.setFromBufferAttribute(s),this.morphTargetsRelative?(Rt.addVectors(this.boundingBox.min,qt.min),this.boundingBox.expandByPoint(Rt),Rt.addVectors(this.boundingBox.max,qt.max),this.boundingBox.expandByPoint(Rt)):(this.boundingBox.expandByPoint(qt.min),this.boundingBox.expandByPoint(qt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Je('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new _r);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Je("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new B,1/0);return}if(e){const i=this.boundingSphere.center;if(qt.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];er.setFromBufferAttribute(o),this.morphTargetsRelative?(Rt.addVectors(qt.min,er.min),qt.expandByPoint(Rt),Rt.addVectors(qt.max,er.max),qt.expandByPoint(Rt)):(qt.expandByPoint(er.min),qt.expandByPoint(er.max))}qt.getCenter(i);let r=0;for(let s=0,a=e.count;s<a;s++)Rt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Rt));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],c=this.morphTargetsRelative;for(let l=0,u=o.count;l<u;l++)Rt.fromBufferAttribute(o,l),c&&(wi.fromBufferAttribute(e,l),Rt.add(wi)),r=Math.max(r,i.distanceToSquared(Rt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&Je('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Je("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,s=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==i.count)&&(a=new on(new Float32Array(4*i.count),4),this.setAttribute("tangent",a));const o=[],c=[];for(let g=0;g<i.count;g++)o[g]=new B,c[g]=new B;const l=new B,u=new B,h=new B,f=new Ze,m=new Ze,_=new Ze,v=new B,p=new B;function d(g,M,P){l.fromBufferAttribute(i,g),u.fromBufferAttribute(i,M),h.fromBufferAttribute(i,P),f.fromBufferAttribute(s,g),m.fromBufferAttribute(s,M),_.fromBufferAttribute(s,P),u.sub(l),h.sub(l),m.sub(f),_.sub(f);const C=1/(m.x*_.y-_.x*m.y);isFinite(C)&&(v.copy(u).multiplyScalar(_.y).addScaledVector(h,-m.y).multiplyScalar(C),p.copy(h).multiplyScalar(m.x).addScaledVector(u,-_.x).multiplyScalar(C),o[g].add(v),o[M].add(v),o[P].add(v),c[g].add(p),c[M].add(p),c[P].add(p))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let g=0,M=y.length;g<M;++g){const P=y[g],C=P.start,D=P.count;for(let z=C,Y=C+D;z<Y;z+=3)d(e.getX(z+0),e.getX(z+1),e.getX(z+2))}const T=new B,S=new B,A=new B,b=new B;function w(g){A.fromBufferAttribute(r,g),b.copy(A);const M=o[g];T.copy(M),T.sub(A.multiplyScalar(A.dot(M))).normalize(),S.crossVectors(b,M);const C=S.dot(c[g])<0?-1:1;a.setXYZW(g,T.x,T.y,T.z,C)}for(let g=0,M=y.length;g<M;++g){const P=y[g],C=P.start,D=P.count;for(let z=C,Y=C+D;z<Y;z+=3)w(e.getX(z+0)),w(e.getX(z+1)),w(e.getX(z+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new on(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let f=0,m=i.count;f<m;f++)i.setXYZ(f,0,0,0);const r=new B,s=new B,a=new B,o=new B,c=new B,l=new B,u=new B,h=new B;if(e)for(let f=0,m=e.count;f<m;f+=3){const _=e.getX(f+0),v=e.getX(f+1),p=e.getX(f+2);r.fromBufferAttribute(t,_),s.fromBufferAttribute(t,v),a.fromBufferAttribute(t,p),u.subVectors(a,s),h.subVectors(r,s),u.cross(h),o.fromBufferAttribute(i,_),c.fromBufferAttribute(i,v),l.fromBufferAttribute(i,p),o.add(u),c.add(u),l.add(u),i.setXYZ(_,o.x,o.y,o.z),i.setXYZ(v,c.x,c.y,c.z),i.setXYZ(p,l.x,l.y,l.z)}else for(let f=0,m=t.count;f<m;f+=3)r.fromBufferAttribute(t,f+0),s.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),u.subVectors(a,s),h.subVectors(r,s),u.cross(h),i.setXYZ(f+0,u.x,u.y,u.z),i.setXYZ(f+1,u.x,u.y,u.z),i.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Rt.fromBufferAttribute(e,t),Rt.normalize(),e.setXYZ(t,Rt.x,Rt.y,Rt.z)}toNonIndexed(){function e(o,c){const l=o.array,u=o.itemSize,h=o.normalized,f=new l.constructor(c.length*u);let m=0,_=0;for(let v=0,p=c.length;v<p;v++){o.isInterleavedBufferAttribute?m=c[v]*o.data.stride+o.offset:m=c[v]*u;for(let d=0;d<u;d++)f[_++]=l[m++]}return new on(f,u,h)}if(this.index===null)return Ne("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new cn,i=this.index.array,r=this.attributes;for(const o in r){const c=r[o],l=e(c,i);t.setAttribute(o,l)}const s=this.morphAttributes;for(const o in s){const c=[],l=s[o];for(let u=0,h=l.length;u<h;u++){const f=l[u],m=e(f,i);c.push(m)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const c in i){const l=i[c];e.data.attributes[c]=l.toJSON(e.data)}const r={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],u=[];for(let h=0,f=l.length;h<f;h++){const m=l[h];u.push(m.toJSON(e.data))}u.length>0&&(r[c]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const r=e.attributes;for(const l in r){const u=r[l];this.setAttribute(l,u.clone(t))}const s=e.morphAttributes;for(const l in s){const u=[],h=s[l];for(let f=0,m=h.length;f<m;f++)u.push(h[f].clone(t));this.morphAttributes[l]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,u=a.length;l<u;l++){const h=a[l];this.addGroup(h.start,h.count,h.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}let Jf=0;class xr extends pi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Jf++}),this.uuid=gr(),this.name="",this.type="Material",this.blending=Oi,this.side=Jn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=oa,this.blendDst=ca,this.blendEquation=ai,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new qe(0,0,0),this.blendAlpha=0,this.depthFunc=Vi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ko,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=xi,this.stencilZFail=xi,this.stencilZPass=xi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){Ne(`Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){Ne(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector2&&i&&i.isVector2||r&&r.isEuler&&i&&i.isEuler||r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Oi&&(i.blending=this.blending),this.side!==Jn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==oa&&(i.blendSrc=this.blendSrc),this.blendDst!==ca&&(i.blendDst=this.blendDst),this.blendEquation!==ai&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Vi&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ko&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==xi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==xi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==xi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const a=[];for(const o in s){const c=s[o];delete c.metadata,a.push(c)}return a}if(t){const s=r(e.textures),a=r(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new qe().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new Ze().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Ze().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Rn=new B,Hs=new B,Dr=new B,Xn=new B,Ws=new B,Ir=new B,Xs=new B;class Qf{constructor(e=new B,t=new B(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Rn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Rn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Rn.copy(this.origin).addScaledVector(this.direction,t),Rn.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){Hs.copy(e).add(t).multiplyScalar(.5),Dr.copy(t).sub(e).normalize(),Xn.copy(this.origin).sub(Hs);const s=e.distanceTo(t)*.5,a=-this.direction.dot(Dr),o=Xn.dot(this.direction),c=-Xn.dot(Dr),l=Xn.lengthSq(),u=Math.abs(1-a*a);let h,f,m,_;if(u>0)if(h=a*c-o,f=a*o-c,_=s*u,h>=0)if(f>=-_)if(f<=_){const v=1/u;h*=v,f*=v,m=h*(h+a*f+2*o)+f*(a*h+f+2*c)+l}else f=s,h=Math.max(0,-(a*f+o)),m=-h*h+f*(f+2*c)+l;else f=-s,h=Math.max(0,-(a*f+o)),m=-h*h+f*(f+2*c)+l;else f<=-_?(h=Math.max(0,-(-a*s+o)),f=h>0?-s:Math.min(Math.max(-s,-c),s),m=-h*h+f*(f+2*c)+l):f<=_?(h=0,f=Math.min(Math.max(-s,-c),s),m=f*(f+2*c)+l):(h=Math.max(0,-(a*s+o)),f=h>0?s:Math.min(Math.max(-s,-c),s),m=-h*h+f*(f+2*c)+l);else f=a>0?-s:s,h=Math.max(0,-(a*f+o)),m=-h*h+f*(f+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(Hs).addScaledVector(Dr,f),m}intersectSphere(e,t){Rn.subVectors(e.center,this.origin);const i=Rn.dot(this.direction),r=Rn.dot(Rn)-i*i,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=i-a,c=i+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,a,o,c;const l=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,f=this.origin;return l>=0?(i=(e.min.x-f.x)*l,r=(e.max.x-f.x)*l):(i=(e.max.x-f.x)*l,r=(e.min.x-f.x)*l),u>=0?(s=(e.min.y-f.y)*u,a=(e.max.y-f.y)*u):(s=(e.max.y-f.y)*u,a=(e.min.y-f.y)*u),i>a||s>r||((s>i||isNaN(i))&&(i=s),(a<r||isNaN(r))&&(r=a),h>=0?(o=(e.min.z-f.z)*h,c=(e.max.z-f.z)*h):(o=(e.max.z-f.z)*h,c=(e.min.z-f.z)*h),i>c||o>r)||((o>i||i!==i)&&(i=o),(c<r||r!==r)&&(r=c),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,Rn)!==null}intersectTriangle(e,t,i,r,s){Ws.subVectors(t,e),Ir.subVectors(i,e),Xs.crossVectors(Ws,Ir);let a=this.direction.dot(Xs),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Xn.subVectors(this.origin,e);const c=o*this.direction.dot(Ir.crossVectors(Xn,Ir));if(c<0)return null;const l=o*this.direction.dot(Ws.cross(Xn));if(l<0||c+l>a)return null;const u=-o*Xn.dot(Xs);return u<0?null:this.at(u/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Il extends xr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new qe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Qn,this.combine=dl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const dc=new dt,ii=new Qf,Lr=new _r,hc=new B,Ur=new B,Nr=new B,Fr=new B,qs=new B,Or=new B,pc=new B,Br=new B;class lt extends bt{constructor(e=new cn,t=new Il){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){Or.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const u=o[c],h=s[c];u!==0&&(qs.fromBufferAttribute(h,e),a?Or.addScaledVector(qs,u):Or.addScaledVector(qs.sub(t),u))}t.add(Or)}return t}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Lr.copy(i.boundingSphere),Lr.applyMatrix4(s),ii.copy(e.ray).recast(e.near),!(Lr.containsPoint(ii.origin)===!1&&(ii.intersectSphere(Lr,hc)===null||ii.origin.distanceToSquared(hc)>(e.far-e.near)**2))&&(dc.copy(s).invert(),ii.copy(e.ray).applyMatrix4(dc),!(i.boundingBox!==null&&ii.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,ii)))}_computeIntersections(e,t,i){let r;const s=this.geometry,a=this.material,o=s.index,c=s.attributes.position,l=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,f=s.groups,m=s.drawRange;if(o!==null)if(Array.isArray(a))for(let _=0,v=f.length;_<v;_++){const p=f[_],d=a[p.materialIndex],y=Math.max(p.start,m.start),T=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let S=y,A=T;S<A;S+=3){const b=o.getX(S),w=o.getX(S+1),g=o.getX(S+2);r=kr(this,d,e,i,l,u,h,b,w,g),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=p.materialIndex,t.push(r))}}else{const _=Math.max(0,m.start),v=Math.min(o.count,m.start+m.count);for(let p=_,d=v;p<d;p+=3){const y=o.getX(p),T=o.getX(p+1),S=o.getX(p+2);r=kr(this,a,e,i,l,u,h,y,T,S),r&&(r.faceIndex=Math.floor(p/3),t.push(r))}}else if(c!==void 0)if(Array.isArray(a))for(let _=0,v=f.length;_<v;_++){const p=f[_],d=a[p.materialIndex],y=Math.max(p.start,m.start),T=Math.min(c.count,Math.min(p.start+p.count,m.start+m.count));for(let S=y,A=T;S<A;S+=3){const b=S,w=S+1,g=S+2;r=kr(this,d,e,i,l,u,h,b,w,g),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=p.materialIndex,t.push(r))}}else{const _=Math.max(0,m.start),v=Math.min(c.count,m.start+m.count);for(let p=_,d=v;p<d;p+=3){const y=p,T=p+1,S=p+2;r=kr(this,a,e,i,l,u,h,y,T,S),r&&(r.faceIndex=Math.floor(p/3),t.push(r))}}}}function jf(n,e,t,i,r,s,a,o){let c;if(e.side===Ht?c=i.intersectTriangle(a,s,r,!0,o):c=i.intersectTriangle(r,s,a,e.side===Jn,o),c===null)return null;Br.copy(o),Br.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(Br);return l<t.near||l>t.far?null:{distance:l,point:Br.clone(),object:n}}function kr(n,e,t,i,r,s,a,o,c,l){n.getVertexPosition(o,Ur),n.getVertexPosition(c,Nr),n.getVertexPosition(l,Fr);const u=jf(n,e,t,i,Ur,Nr,Fr,pc);if(u){const h=new B;rn.getBarycoord(pc,Ur,Nr,Fr,h),r&&(u.uv=rn.getInterpolatedAttribute(r,o,c,l,h,new Ze)),s&&(u.uv1=rn.getInterpolatedAttribute(s,o,c,l,h,new Ze)),a&&(u.normal=rn.getInterpolatedAttribute(a,o,c,l,h,new B),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const f={a:o,b:c,c:l,normal:new B,materialIndex:0};rn.getNormal(Ur,Nr,Fr,f.normal),u.face=f,u.barycoord=h}return u}class Ll extends Bt{constructor(e=null,t=1,i=1,r,s,a,o,c,l=Pt,u=Pt,h,f){super(null,a,o,c,l,u,r,s,h,f),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class mc extends on{constructor(e,t,i,r=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Ci=new dt,gc=new dt,zr=[],_c=new mi,ed=new dt,tr=new lt,nr=new _r;class mn extends lt{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new mc(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<i;r++)this.setMatrixAt(r,ed)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new mi),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Ci),_c.copy(e.boundingBox).applyMatrix4(Ci),this.boundingBox.union(_c)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new _r),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Ci),nr.copy(e.boundingSphere).applyMatrix4(Ci),this.boundingSphere.union(nr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,r=this.morphTexture.source.data.data,s=i.length+1,a=e*s+1;for(let o=0;o<i.length;o++)i[o]=r[a+o]}raycast(e,t){const i=this.matrixWorld,r=this.count;if(tr.geometry=this.geometry,tr.material=this.material,tr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),nr.copy(this.boundingSphere),nr.applyMatrix4(i),e.ray.intersectsSphere(nr)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,Ci),gc.multiplyMatrices(i,Ci),tr.matrixWorld=gc,tr.raycast(e,zr);for(let a=0,o=zr.length;a<o;a++){const c=zr[a];c.instanceId=s,c.object=this,t.push(c)}zr.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new mc(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){const i=t.morphTargetInfluences,r=i.length+1;this.morphTexture===null&&(this.morphTexture=new Ll(new Float32Array(r*this.count),r,this.count,lo,sn));const s=this.morphTexture.source.data.data;let a=0;for(let l=0;l<i.length;l++)a+=i[l];const o=this.geometry.morphTargetsRelative?1:1-a,c=r*e;return s[c]=o,s.set(i,c+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Ys=new B,td=new B,nd=new Oe;class si{constructor(e=new B(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=Ys.subVectors(i,t).cross(td.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const r=e.delta(Ys),s=this.normal.dot(r);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/s;return i===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||nd.getNormalMatrix(e),r=this.coplanarPoint(Ys).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ri=new _r,id=new Ze(.5,.5),Gr=new B;class xo{constructor(e=new si,t=new si,i=new si,r=new si,s=new si,a=new si){this.planes=[e,t,i,r,s,a]}set(e,t,i,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=xn,i=!1){const r=this.planes,s=e.elements,a=s[0],o=s[1],c=s[2],l=s[3],u=s[4],h=s[5],f=s[6],m=s[7],_=s[8],v=s[9],p=s[10],d=s[11],y=s[12],T=s[13],S=s[14],A=s[15];if(r[0].setComponents(l-a,m-u,d-_,A-y).normalize(),r[1].setComponents(l+a,m+u,d+_,A+y).normalize(),r[2].setComponents(l+o,m+h,d+v,A+T).normalize(),r[3].setComponents(l-o,m-h,d-v,A-T).normalize(),i)r[4].setComponents(c,f,p,S).normalize(),r[5].setComponents(l-c,m-f,d-p,A-S).normalize();else if(r[4].setComponents(l-c,m-f,d-p,A-S).normalize(),t===xn)r[5].setComponents(l+c,m+f,d+p,A+S).normalize();else if(t===pr)r[5].setComponents(c,f,p,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ri.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ri.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ri)}intersectsSprite(e){ri.center.set(0,0,0);const t=id.distanceTo(e.center);return ri.radius=.7071067811865476+t,ri.applyMatrix4(e.matrixWorld),this.intersectsSphere(ri)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(Gr.x=r.normal.x>0?e.max.x:e.min.x,Gr.y=r.normal.y>0?e.max.y:e.min.y,Gr.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Gr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Ul extends Bt{constructor(e=[],t=fi,i,r,s,a,o,c,l,u){super(e,t,i,r,s,a,o,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Wi extends Bt{constructor(e,t,i=Sn,r,s,a,o=Pt,c=Pt,l,u=Nn,h=1){if(u!==Nn&&u!==li)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:e,height:t,depth:h};super(f,r,s,a,o,c,u,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new go(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class rd extends Wi{constructor(e,t=Sn,i=fi,r,s,a=Pt,o=Pt,c,l=Nn){const u={width:e,height:e,depth:1},h=[u,u,u,u,u,u];super(e,e,t,i,r,s,a,o,c,l),this.image=h,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Nl extends Bt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Qt extends cn{constructor(e=1,t=1,i=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const c=[],l=[],u=[],h=[];let f=0,m=0;_("z","y","x",-1,-1,i,t,e,a,s,0),_("z","y","x",1,-1,i,t,-e,a,s,1),_("x","z","y",1,1,e,i,t,r,a,2),_("x","z","y",1,-1,e,i,-t,r,a,3),_("x","y","z",1,-1,e,t,i,r,s,4),_("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(c),this.setAttribute("position",new kt(l,3)),this.setAttribute("normal",new kt(u,3)),this.setAttribute("uv",new kt(h,2));function _(v,p,d,y,T,S,A,b,w,g,M){const P=S/w,C=A/g,D=S/2,z=A/2,Y=b/2,I=w+1,H=g+1;let O=0,X=0;const K=new B;for(let te=0;te<H;te++){const ee=te*C-z;for(let he=0;he<I;he++){const Ie=he*P-D;K[v]=Ie*y,K[p]=ee*T,K[d]=Y,l.push(K.x,K.y,K.z),K[v]=0,K[p]=0,K[d]=b>0?1:-1,u.push(K.x,K.y,K.z),h.push(he/w),h.push(1-te/g),O+=1}}for(let te=0;te<g;te++)for(let ee=0;ee<w;ee++){const he=f+ee+I*te,Ie=f+ee+I*(te+1),Xe=f+(ee+1)+I*(te+1),Be=f+(ee+1)+I*te;c.push(he,Ie,Be),c.push(Ie,Xe,Be),X+=6}o.addGroup(m,X,M),m+=X,f+=O}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Qt(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class hi extends cn{constructor(e=1,t=1,i=1,r=32,s=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:r,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:c};const l=this;r=Math.floor(r),s=Math.floor(s);const u=[],h=[],f=[],m=[];let _=0;const v=[],p=i/2;let d=0;y(),a===!1&&(e>0&&T(!0),t>0&&T(!1)),this.setIndex(u),this.setAttribute("position",new kt(h,3)),this.setAttribute("normal",new kt(f,3)),this.setAttribute("uv",new kt(m,2));function y(){const S=new B,A=new B;let b=0;const w=(t-e)/i;for(let g=0;g<=s;g++){const M=[],P=g/s,C=P*(t-e)+e;for(let D=0;D<=r;D++){const z=D/r,Y=z*c+o,I=Math.sin(Y),H=Math.cos(Y);A.x=C*I,A.y=-P*i+p,A.z=C*H,h.push(A.x,A.y,A.z),S.set(I,w,H).normalize(),f.push(S.x,S.y,S.z),m.push(z,1-P),M.push(_++)}v.push(M)}for(let g=0;g<r;g++)for(let M=0;M<s;M++){const P=v[M][g],C=v[M+1][g],D=v[M+1][g+1],z=v[M][g+1];(e>0||M!==0)&&(u.push(P,C,z),b+=3),(t>0||M!==s-1)&&(u.push(C,D,z),b+=3)}l.addGroup(d,b,0),d+=b}function T(S){const A=_,b=new Ze,w=new B;let g=0;const M=S===!0?e:t,P=S===!0?1:-1;for(let D=1;D<=r;D++)h.push(0,p*P,0),f.push(0,P,0),m.push(.5,.5),_++;const C=_;for(let D=0;D<=r;D++){const Y=D/r*c+o,I=Math.cos(Y),H=Math.sin(Y);w.x=M*H,w.y=p*P,w.z=M*I,h.push(w.x,w.y,w.z),f.push(0,P,0),b.x=I*.5+.5,b.y=H*.5*P+.5,m.push(b.x,b.y),_++}for(let D=0;D<r;D++){const z=A+D,Y=C+D;S===!0?u.push(Y,Y+1,z):u.push(Y+1,Y,z),g+=3}l.addGroup(d,g,S===!0?1:2),d+=g}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new hi(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class vo extends hi{constructor(e=1,t=1,i=32,r=1,s=!1,a=0,o=Math.PI*2){super(0,e,t,i,r,s,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:r,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(e){return new vo(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class hs extends cn{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,a=t/2,o=Math.floor(i),c=Math.floor(r),l=o+1,u=c+1,h=e/o,f=t/c,m=[],_=[],v=[],p=[];for(let d=0;d<u;d++){const y=d*f-a;for(let T=0;T<l;T++){const S=T*h-s;_.push(S,-y,0),v.push(0,0,1),p.push(T/o),p.push(1-d/c)}}for(let d=0;d<c;d++)for(let y=0;y<o;y++){const T=y+l*d,S=y+l*(d+1),A=y+1+l*(d+1),b=y+1+l*d;m.push(T,S,b),m.push(S,A,b)}this.setIndex(m),this.setAttribute("position",new kt(_,3)),this.setAttribute("normal",new kt(v,3)),this.setAttribute("uv",new kt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new hs(e.width,e.height,e.widthSegments,e.heightSegments)}}class jn extends cn{constructor(e=1,t=32,i=16,r=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const c=Math.min(a+o,Math.PI);let l=0;const u=[],h=new B,f=new B,m=[],_=[],v=[],p=[];for(let d=0;d<=i;d++){const y=[],T=d/i,S=a+T*o,A=e*Math.cos(S),b=Math.sqrt(e*e-A*A);let w=0;d===0&&a===0?w=.5/t:d===i&&c===Math.PI&&(w=-.5/t);for(let g=0;g<=t;g++){const M=g/t,P=r+M*s;h.x=-b*Math.cos(P),h.y=A,h.z=b*Math.sin(P),_.push(h.x,h.y,h.z),f.copy(h).normalize(),v.push(f.x,f.y,f.z),p.push(M+w,1-T),y.push(l++)}u.push(y)}for(let d=0;d<i;d++)for(let y=0;y<t;y++){const T=u[d][y+1],S=u[d][y],A=u[d+1][y],b=u[d+1][y+1];(d!==0||a>0)&&m.push(T,S,b),(d!==i-1||c<Math.PI)&&m.push(S,A,b)}this.setIndex(m),this.setAttribute("position",new kt(_,3)),this.setAttribute("normal",new kt(v,3)),this.setAttribute("uv",new kt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new jn(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}function Xi(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];if(xc(r))r.isRenderTargetTexture?(Ne("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone();else if(Array.isArray(r))if(xc(r[0])){const s=[];for(let a=0,o=r.length;a<o;a++)s[a]=r[a].clone();e[t][i]=s}else e[t][i]=r.slice();else e[t][i]=r}}return e}function Ft(n){const e={};for(let t=0;t<n.length;t++){const i=Xi(n[t]);for(const r in i)e[r]=i[r]}return e}function xc(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function sd(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Fl(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ye.workingColorSpace}const ad={clone:Xi,merge:Ft};var od=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,cd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class yn extends xr{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=od,this.fragmentShader=cd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Xi(e.uniforms),this.uniformsGroups=sd(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?t.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[r]={type:"m4",value:a.toArray()}:t.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const i in e.uniforms){const r=e.uniforms[i];switch(this.uniforms[i]={},r.type){case"t":this.uniforms[i].value=t[r.value]||null;break;case"c":this.uniforms[i].value=new qe().setHex(r.value);break;case"v2":this.uniforms[i].value=new Ze().fromArray(r.value);break;case"v3":this.uniforms[i].value=new B().fromArray(r.value);break;case"v4":this.uniforms[i].value=new mt().fromArray(r.value);break;case"m3":this.uniforms[i].value=new Oe().fromArray(r.value);break;case"m4":this.uniforms[i].value=new dt().fromArray(r.value);break;default:this.uniforms[i].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class ld extends yn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class gn extends xr{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new qe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=$a,this.normalScale=new Ze(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Qn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class ud extends xr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Sf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class fd extends xr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Mo extends bt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new qe(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class dd extends Mo{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(bt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new qe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const $s=new dt,vc=new B,Mc=new B;class hd{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ze(512,512),this.mapType=$t,this.map=null,this.mapPass=null,this.matrix=new dt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new xo,this._frameExtents=new Ze(1,1),this._viewportCount=1,this._viewports=[new mt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;vc.setFromMatrixPosition(e.matrixWorld),t.position.copy(vc),Mc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Mc),t.updateMatrixWorld(),$s.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix($s,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===pr||t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply($s)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Vr=new B,Hr=new qi,dn=new B;class Ol extends bt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new dt,this.projectionMatrix=new dt,this.projectionMatrixInverse=new dt,this.coordinateSystem=xn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Vr,Hr,dn),dn.x===1&&dn.y===1&&dn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Vr,Hr,dn.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(Vr,Hr,dn),dn.x===1&&dn.y===1&&dn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Vr,Hr,dn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const qn=new B,Sc=new Ze,yc=new Ze;class nn extends Ol{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Za*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(bs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Za*2*Math.atan(Math.tan(bs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){qn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(qn.x,qn.y).multiplyScalar(-e/qn.z),qn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(qn.x,qn.y).multiplyScalar(-e/qn.z)}getViewSize(e,t){return this.getViewBounds(e,Sc,yc),t.subVectors(yc,Sc)}setViewOffset(e,t,i,r,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(bs*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;s+=a.offsetX*r/c,t-=a.offsetY*i/l,r*=a.width/c,i*=a.height/l}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class ps extends Ol{constructor(e=-1,t=1,i=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,a=i+e,o=r+t,c=r-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,a=s+l*this.view.width,o-=u*this.view.offsetY,c=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class pd extends hd{constructor(){super(new ps(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Zs extends Mo{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(bt.DEFAULT_UP),this.updateMatrix(),this.target=new bt,this.shadow=new pd}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class md extends Mo{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}const Pi=-90,Di=1;class gd extends bt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new nn(Pi,Di,e,t);r.layers=this.layers,this.add(r);const s=new nn(Pi,Di,e,t);s.layers=this.layers,this.add(s);const a=new nn(Pi,Di,e,t);a.layers=this.layers,this.add(a);const o=new nn(Pi,Di,e,t);o.layers=this.layers,this.add(o);const c=new nn(Pi,Di,e,t);c.layers=this.layers,this.add(c);const l=new nn(Pi,Di,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,s,a,o,c]=t;for(const l of t)this.remove(l);if(e===xn)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===pr)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,c,l,u]=this.children,h=e.getRenderTarget(),f=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let p=!1;e.isWebGLRenderer===!0?p=e.state.buffers.depth.getReversed():p=e.reversedDepthBuffer,e.setRenderTarget(i,0,r),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(i,1,r),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,2,r),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,3,r),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(i,4,r),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),i.texture.generateMipmaps=v,e.setRenderTarget(i,5,r),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(h,f,m),e.xr.enabled=_,i.texture.needsPMREMUpdate=!0}}class _d extends nn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const To=class To{constructor(e,t,i,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,r){const s=this.elements;return s[0]=e,s[2]=t,s[1]=i,s[3]=r,this}};To.prototype.isMatrix2=!0;let Ec=To;function bc(n,e,t,i){const r=xd(i);switch(t){case bl:return n*e;case lo:return n*e/r.components*r.byteLength;case uo:return n*e/r.components*r.byteLength;case di:return n*e*2/r.components*r.byteLength;case fo:return n*e*2/r.components*r.byteLength;case Tl:return n*e*3/r.components*r.byteLength;case an:return n*e*4/r.components*r.byteLength;case ho:return n*e*4/r.components*r.byteLength;case Jr:case Qr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case jr:case es:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case va:case Sa:return Math.max(n,16)*Math.max(e,8)/4;case xa:case Ma:return Math.max(n,8)*Math.max(e,8)/2;case ya:case Ea:case Ta:case Aa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case ba:case rs:case Ra:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case wa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Ca:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Pa:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Da:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Ia:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case La:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Ua:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Na:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Fa:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Oa:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Ba:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case ka:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case za:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Ga:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Va:case Ha:case Wa:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Xa:case qa:return Math.ceil(n/4)*Math.ceil(e/4)*8;case ss:case Ya:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function xd(n){switch(n){case $t:case Ml:return{byteLength:1,components:1};case dr:case Sl:case Un:return{byteLength:2,components:1};case oo:case co:return{byteLength:2,components:4};case Sn:case ao:case sn:return{byteLength:4,components:1};case yl:case El:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ro}}));typeof window<"u"&&(window.__THREE__?Ne("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ro);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Bl(){let n=null,e=!1,t=null,i=null;function r(s,a){t(s,a),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function vd(n){const e=new WeakMap;function t(o,c){const l=o.array,u=o.usage,h=l.byteLength,f=n.createBuffer();n.bindBuffer(c,f),n.bufferData(c,l,u),o.onUploadCallback();let m;if(l instanceof Float32Array)m=n.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)m=n.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?m=n.HALF_FLOAT:m=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)m=n.SHORT;else if(l instanceof Uint32Array)m=n.UNSIGNED_INT;else if(l instanceof Int32Array)m=n.INT;else if(l instanceof Int8Array)m=n.BYTE;else if(l instanceof Uint8Array)m=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)m=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:m,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:h}}function i(o,c,l){const u=c.array,h=c.updateRanges;if(n.bindBuffer(l,o),h.length===0)n.bufferSubData(l,0,u);else{h.sort((m,_)=>m.start-_.start);let f=0;for(let m=1;m<h.length;m++){const _=h[f],v=h[m];v.start<=_.start+_.count+1?_.count=Math.max(_.count,v.start+v.count-_.start):(++f,h[f]=v)}h.length=f+1;for(let m=0,_=h.length;m<_;m++){const v=h[m];n.bufferSubData(l,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(n.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,o,c),l.version=o.version}}return{get:r,remove:s,update:a}}var Md=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Sd=`#ifdef USE_ALPHAHASH
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
#endif`,yd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ed=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,bd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Td=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Ad=`#ifdef USE_AOMAP
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
#endif`,Rd=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,wd=`#ifdef USE_BATCHING
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
#endif`,Cd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Pd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Dd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Id=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Ld=`#ifdef USE_IRIDESCENCE
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
#endif`,Ud=`#ifdef USE_BUMPMAP
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
#endif`,Nd=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Fd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Od=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Bd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,kd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,zd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Gd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Vd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Hd=`#define PI 3.141592653589793
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
} // validated`,Wd=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Xd=`vec3 transformedNormal = objectNormal;
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
#endif`,qd=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Yd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,$d=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Zd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Kd="gl_FragColor = linearToOutputTexel( gl_FragColor );",Jd=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Qd=`#ifdef USE_ENVMAP
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
#endif`,jd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,eh=`#ifdef USE_ENVMAP
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
#endif`,th=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,nh=`#ifdef USE_ENVMAP
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
#endif`,ih=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,rh=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,sh=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ah=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,oh=`#ifdef USE_GRADIENTMAP
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
}`,ch=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lh=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,uh=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,fh=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,dh=`#ifdef USE_ENVMAP
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
#endif`,hh=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,ph=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,mh=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,gh=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,_h=`PhysicalMaterial material;
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
#endif`,xh=`uniform sampler2D dfgLUT;
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
}`,vh=`
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
#endif`,Mh=`#if defined( RE_IndirectDiffuse )
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
#endif`,Sh=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,yh=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,Eh=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,bh=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Th=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ah=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Rh=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,wh=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Ch=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Ph=`#if defined( USE_POINTS_UV )
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
#endif`,Dh=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Ih=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Lh=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Uh=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Nh=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Fh=`#ifdef USE_MORPHTARGETS
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
#endif`,Oh=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Bh=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,kh=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,zh=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Gh=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Vh=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Hh=`#ifdef USE_NORMALMAP
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
#endif`,Wh=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Xh=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,qh=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Yh=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,$h=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Zh=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Kh=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Jh=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Qh=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,jh=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ep=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,tp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,np=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,ip=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,rp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,sp=`float getShadowMask() {
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
}`,ap=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,op=`#ifdef USE_SKINNING
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
#endif`,cp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,lp=`#ifdef USE_SKINNING
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
#endif`,up=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,fp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,dp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,hp=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,pp=`#ifdef USE_TRANSMISSION
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
#endif`,mp=`#ifdef USE_TRANSMISSION
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
#endif`,gp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,_p=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,xp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,vp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Mp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Sp=`uniform sampler2D t2D;
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
}`,yp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ep=`#ifdef ENVMAP_TYPE_CUBE
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
}`,bp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Tp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ap=`#include <common>
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
}`,Rp=`#if DEPTH_PACKING == 3200
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
}`,wp=`#define DISTANCE
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
}`,Cp=`#define DISTANCE
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
}`,Pp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Dp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ip=`uniform float scale;
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
}`,Lp=`uniform vec3 diffuse;
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
}`,Up=`#include <common>
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
}`,Np=`uniform vec3 diffuse;
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
}`,Fp=`#define LAMBERT
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
}`,Op=`#define LAMBERT
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
}`,Bp=`#define MATCAP
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
}`,kp=`#define MATCAP
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
}`,zp=`#define NORMAL
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
}`,Gp=`#define NORMAL
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
}`,Vp=`#define PHONG
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
}`,Hp=`#define PHONG
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
}`,Wp=`#define STANDARD
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
}`,Xp=`#define STANDARD
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
}`,qp=`#define TOON
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
}`,Yp=`#define TOON
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
}`,$p=`uniform float size;
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
}`,Zp=`uniform vec3 diffuse;
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
}`,Kp=`#include <common>
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
}`,Jp=`uniform vec3 color;
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
}`,Qp=`uniform float rotation;
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
}`,jp=`uniform vec3 diffuse;
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
}`,Ge={alphahash_fragment:Md,alphahash_pars_fragment:Sd,alphamap_fragment:yd,alphamap_pars_fragment:Ed,alphatest_fragment:bd,alphatest_pars_fragment:Td,aomap_fragment:Ad,aomap_pars_fragment:Rd,batching_pars_vertex:wd,batching_vertex:Cd,begin_vertex:Pd,beginnormal_vertex:Dd,bsdfs:Id,iridescence_fragment:Ld,bumpmap_pars_fragment:Ud,clipping_planes_fragment:Nd,clipping_planes_pars_fragment:Fd,clipping_planes_pars_vertex:Od,clipping_planes_vertex:Bd,color_fragment:kd,color_pars_fragment:zd,color_pars_vertex:Gd,color_vertex:Vd,common:Hd,cube_uv_reflection_fragment:Wd,defaultnormal_vertex:Xd,displacementmap_pars_vertex:qd,displacementmap_vertex:Yd,emissivemap_fragment:$d,emissivemap_pars_fragment:Zd,colorspace_fragment:Kd,colorspace_pars_fragment:Jd,envmap_fragment:Qd,envmap_common_pars_fragment:jd,envmap_pars_fragment:eh,envmap_pars_vertex:th,envmap_physical_pars_fragment:dh,envmap_vertex:nh,fog_vertex:ih,fog_pars_vertex:rh,fog_fragment:sh,fog_pars_fragment:ah,gradientmap_pars_fragment:oh,lightmap_pars_fragment:ch,lights_lambert_fragment:lh,lights_lambert_pars_fragment:uh,lights_pars_begin:fh,lights_toon_fragment:hh,lights_toon_pars_fragment:ph,lights_phong_fragment:mh,lights_phong_pars_fragment:gh,lights_physical_fragment:_h,lights_physical_pars_fragment:xh,lights_fragment_begin:vh,lights_fragment_maps:Mh,lights_fragment_end:Sh,lightprobes_pars_fragment:yh,logdepthbuf_fragment:Eh,logdepthbuf_pars_fragment:bh,logdepthbuf_pars_vertex:Th,logdepthbuf_vertex:Ah,map_fragment:Rh,map_pars_fragment:wh,map_particle_fragment:Ch,map_particle_pars_fragment:Ph,metalnessmap_fragment:Dh,metalnessmap_pars_fragment:Ih,morphinstance_vertex:Lh,morphcolor_vertex:Uh,morphnormal_vertex:Nh,morphtarget_pars_vertex:Fh,morphtarget_vertex:Oh,normal_fragment_begin:Bh,normal_fragment_maps:kh,normal_pars_fragment:zh,normal_pars_vertex:Gh,normal_vertex:Vh,normalmap_pars_fragment:Hh,clearcoat_normal_fragment_begin:Wh,clearcoat_normal_fragment_maps:Xh,clearcoat_pars_fragment:qh,iridescence_pars_fragment:Yh,opaque_fragment:$h,packing:Zh,premultiplied_alpha_fragment:Kh,project_vertex:Jh,dithering_fragment:Qh,dithering_pars_fragment:jh,roughnessmap_fragment:ep,roughnessmap_pars_fragment:tp,shadowmap_pars_fragment:np,shadowmap_pars_vertex:ip,shadowmap_vertex:rp,shadowmask_pars_fragment:sp,skinbase_vertex:ap,skinning_pars_vertex:op,skinning_vertex:cp,skinnormal_vertex:lp,specularmap_fragment:up,specularmap_pars_fragment:fp,tonemapping_fragment:dp,tonemapping_pars_fragment:hp,transmission_fragment:pp,transmission_pars_fragment:mp,uv_pars_fragment:gp,uv_pars_vertex:_p,uv_vertex:xp,worldpos_vertex:vp,background_vert:Mp,background_frag:Sp,backgroundCube_vert:yp,backgroundCube_frag:Ep,cube_vert:bp,cube_frag:Tp,depth_vert:Ap,depth_frag:Rp,distance_vert:wp,distance_frag:Cp,equirect_vert:Pp,equirect_frag:Dp,linedashed_vert:Ip,linedashed_frag:Lp,meshbasic_vert:Up,meshbasic_frag:Np,meshlambert_vert:Fp,meshlambert_frag:Op,meshmatcap_vert:Bp,meshmatcap_frag:kp,meshnormal_vert:zp,meshnormal_frag:Gp,meshphong_vert:Vp,meshphong_frag:Hp,meshphysical_vert:Wp,meshphysical_frag:Xp,meshtoon_vert:qp,meshtoon_frag:Yp,points_vert:$p,points_frag:Zp,shadow_vert:Kp,shadow_frag:Jp,sprite_vert:Qp,sprite_frag:jp},me={common:{diffuse:{value:new qe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Oe}},envmap:{envMap:{value:null},envMapRotation:{value:new Oe},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Oe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Oe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Oe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Oe},normalScale:{value:new Ze(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Oe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Oe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Oe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Oe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new qe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new B},probesMax:{value:new B},probesResolution:{value:new B}},points:{diffuse:{value:new qe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0},uvTransform:{value:new Oe}},sprite:{diffuse:{value:new qe(16777215)},opacity:{value:1},center:{value:new Ze(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}}},_n={basic:{uniforms:Ft([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.fog]),vertexShader:Ge.meshbasic_vert,fragmentShader:Ge.meshbasic_frag},lambert:{uniforms:Ft([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new qe(0)},envMapIntensity:{value:1}}]),vertexShader:Ge.meshlambert_vert,fragmentShader:Ge.meshlambert_frag},phong:{uniforms:Ft([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new qe(0)},specular:{value:new qe(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ge.meshphong_vert,fragmentShader:Ge.meshphong_frag},standard:{uniforms:Ft([me.common,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.roughnessmap,me.metalnessmap,me.fog,me.lights,{emissive:{value:new qe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag},toon:{uniforms:Ft([me.common,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.gradientmap,me.fog,me.lights,{emissive:{value:new qe(0)}}]),vertexShader:Ge.meshtoon_vert,fragmentShader:Ge.meshtoon_frag},matcap:{uniforms:Ft([me.common,me.bumpmap,me.normalmap,me.displacementmap,me.fog,{matcap:{value:null}}]),vertexShader:Ge.meshmatcap_vert,fragmentShader:Ge.meshmatcap_frag},points:{uniforms:Ft([me.points,me.fog]),vertexShader:Ge.points_vert,fragmentShader:Ge.points_frag},dashed:{uniforms:Ft([me.common,me.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ge.linedashed_vert,fragmentShader:Ge.linedashed_frag},depth:{uniforms:Ft([me.common,me.displacementmap]),vertexShader:Ge.depth_vert,fragmentShader:Ge.depth_frag},normal:{uniforms:Ft([me.common,me.bumpmap,me.normalmap,me.displacementmap,{opacity:{value:1}}]),vertexShader:Ge.meshnormal_vert,fragmentShader:Ge.meshnormal_frag},sprite:{uniforms:Ft([me.sprite,me.fog]),vertexShader:Ge.sprite_vert,fragmentShader:Ge.sprite_frag},background:{uniforms:{uvTransform:{value:new Oe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ge.background_vert,fragmentShader:Ge.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Oe}},vertexShader:Ge.backgroundCube_vert,fragmentShader:Ge.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ge.cube_vert,fragmentShader:Ge.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ge.equirect_vert,fragmentShader:Ge.equirect_frag},distance:{uniforms:Ft([me.common,me.displacementmap,{referencePosition:{value:new B},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ge.distance_vert,fragmentShader:Ge.distance_frag},shadow:{uniforms:Ft([me.lights,me.fog,{color:{value:new qe(0)},opacity:{value:1}}]),vertexShader:Ge.shadow_vert,fragmentShader:Ge.shadow_frag}};_n.physical={uniforms:Ft([_n.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Oe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Oe},clearcoatNormalScale:{value:new Ze(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Oe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Oe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Oe},sheen:{value:0},sheenColor:{value:new qe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Oe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Oe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Oe},transmissionSamplerSize:{value:new Ze},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Oe},attenuationDistance:{value:0},attenuationColor:{value:new qe(0)},specularColor:{value:new qe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Oe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Oe},anisotropyVector:{value:new Ze},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Oe}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag};const Wr={r:0,b:0,g:0},em=new dt,kl=new Oe;kl.set(-1,0,0,0,1,0,0,0,1);function tm(n,e,t,i,r,s){const a=new qe(0);let o=r===!0?0:1,c,l,u=null,h=0,f=null;function m(y){let T=y.isScene===!0?y.background:null;if(T&&T.isTexture){const S=y.backgroundBlurriness>0;T=e.get(T,S)}return T}function _(y){let T=!1;const S=m(y);S===null?p(a,o):S&&S.isColor&&(p(S,1),T=!0);const A=n.xr.getEnvironmentBlendMode();A==="additive"?t.buffers.color.setClear(0,0,0,1,s):A==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,s),(n.autoClear||T)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function v(y,T){const S=m(T);S&&(S.isCubeTexture||S.mapping===ds)?(l===void 0&&(l=new lt(new Qt(1,1,1),new yn({name:"BackgroundCubeMaterial",uniforms:Xi(_n.backgroundCube.uniforms),vertexShader:_n.backgroundCube.vertexShader,fragmentShader:_n.backgroundCube.fragmentShader,side:Ht,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(A,b,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(l)),l.material.uniforms.envMap.value=S,l.material.uniforms.backgroundBlurriness.value=T.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(em.makeRotationFromEuler(T.backgroundRotation)).transpose(),S.isCubeTexture&&S.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(kl),l.material.toneMapped=Ye.getTransfer(S.colorSpace)!==et,(u!==S||h!==S.version||f!==n.toneMapping)&&(l.material.needsUpdate=!0,u=S,h=S.version,f=n.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null)):S&&S.isTexture&&(c===void 0&&(c=new lt(new hs(2,2),new yn({name:"BackgroundMaterial",uniforms:Xi(_n.background.uniforms),vertexShader:_n.background.vertexShader,fragmentShader:_n.background.fragmentShader,side:Jn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=S,c.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,c.material.toneMapped=Ye.getTransfer(S.colorSpace)!==et,S.matrixAutoUpdate===!0&&S.updateMatrix(),c.material.uniforms.uvTransform.value.copy(S.matrix),(u!==S||h!==S.version||f!==n.toneMapping)&&(c.material.needsUpdate=!0,u=S,h=S.version,f=n.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function p(y,T){y.getRGB(Wr,Fl(n)),t.buffers.color.setClear(Wr.r,Wr.g,Wr.b,T,s)}function d(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(y,T=1){a.set(y),o=T,p(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(y){o=y,p(a,o)},render:_,addToRenderList:v,dispose:d}}function nm(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=f(null);let s=r,a=!1;function o(C,D,z,Y,I){let H=!1;const O=h(C,Y,z,D);s!==O&&(s=O,l(s.object)),H=m(C,Y,z,I),H&&_(C,Y,z,I),I!==null&&e.update(I,n.ELEMENT_ARRAY_BUFFER),(H||a)&&(a=!1,S(C,D,z,Y),I!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(I).buffer))}function c(){return n.createVertexArray()}function l(C){return n.bindVertexArray(C)}function u(C){return n.deleteVertexArray(C)}function h(C,D,z,Y){const I=Y.wireframe===!0;let H=i[D.id];H===void 0&&(H={},i[D.id]=H);const O=C.isInstancedMesh===!0?C.id:0;let X=H[O];X===void 0&&(X={},H[O]=X);let K=X[z.id];K===void 0&&(K={},X[z.id]=K);let te=K[I];return te===void 0&&(te=f(c()),K[I]=te),te}function f(C){const D=[],z=[],Y=[];for(let I=0;I<t;I++)D[I]=0,z[I]=0,Y[I]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:z,attributeDivisors:Y,object:C,attributes:{},index:null}}function m(C,D,z,Y){const I=s.attributes,H=D.attributes;let O=0;const X=z.getAttributes();for(const K in X)if(X[K].location>=0){const ee=I[K];let he=H[K];if(he===void 0&&(K==="instanceMatrix"&&C.instanceMatrix&&(he=C.instanceMatrix),K==="instanceColor"&&C.instanceColor&&(he=C.instanceColor)),ee===void 0||ee.attribute!==he||he&&ee.data!==he.data)return!0;O++}return s.attributesNum!==O||s.index!==Y}function _(C,D,z,Y){const I={},H=D.attributes;let O=0;const X=z.getAttributes();for(const K in X)if(X[K].location>=0){let ee=H[K];ee===void 0&&(K==="instanceMatrix"&&C.instanceMatrix&&(ee=C.instanceMatrix),K==="instanceColor"&&C.instanceColor&&(ee=C.instanceColor));const he={};he.attribute=ee,ee&&ee.data&&(he.data=ee.data),I[K]=he,O++}s.attributes=I,s.attributesNum=O,s.index=Y}function v(){const C=s.newAttributes;for(let D=0,z=C.length;D<z;D++)C[D]=0}function p(C){d(C,0)}function d(C,D){const z=s.newAttributes,Y=s.enabledAttributes,I=s.attributeDivisors;z[C]=1,Y[C]===0&&(n.enableVertexAttribArray(C),Y[C]=1),I[C]!==D&&(n.vertexAttribDivisor(C,D),I[C]=D)}function y(){const C=s.newAttributes,D=s.enabledAttributes;for(let z=0,Y=D.length;z<Y;z++)D[z]!==C[z]&&(n.disableVertexAttribArray(z),D[z]=0)}function T(C,D,z,Y,I,H,O){O===!0?n.vertexAttribIPointer(C,D,z,I,H):n.vertexAttribPointer(C,D,z,Y,I,H)}function S(C,D,z,Y){v();const I=Y.attributes,H=z.getAttributes(),O=D.defaultAttributeValues;for(const X in H){const K=H[X];if(K.location>=0){let te=I[X];if(te===void 0&&(X==="instanceMatrix"&&C.instanceMatrix&&(te=C.instanceMatrix),X==="instanceColor"&&C.instanceColor&&(te=C.instanceColor)),te!==void 0){const ee=te.normalized,he=te.itemSize,Ie=e.get(te);if(Ie===void 0)continue;const Xe=Ie.buffer,Be=Ie.type,J=Ie.bytesPerElement,oe=Be===n.INT||Be===n.UNSIGNED_INT||te.gpuType===ao;if(te.isInterleavedBufferAttribute){const W=te.data,ie=W.stride,ae=te.offset;if(W.isInstancedInterleavedBuffer){for(let se=0;se<K.locationSize;se++)d(K.location+se,W.meshPerAttribute);C.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=W.meshPerAttribute*W.count)}else for(let se=0;se<K.locationSize;se++)p(K.location+se);n.bindBuffer(n.ARRAY_BUFFER,Xe);for(let se=0;se<K.locationSize;se++)T(K.location+se,he/K.locationSize,Be,ee,ie*J,(ae+he/K.locationSize*se)*J,oe)}else{if(te.isInstancedBufferAttribute){for(let W=0;W<K.locationSize;W++)d(K.location+W,te.meshPerAttribute);C.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let W=0;W<K.locationSize;W++)p(K.location+W);n.bindBuffer(n.ARRAY_BUFFER,Xe);for(let W=0;W<K.locationSize;W++)T(K.location+W,he/K.locationSize,Be,ee,he*J,he/K.locationSize*W*J,oe)}}else if(O!==void 0){const ee=O[X];if(ee!==void 0)switch(ee.length){case 2:n.vertexAttrib2fv(K.location,ee);break;case 3:n.vertexAttrib3fv(K.location,ee);break;case 4:n.vertexAttrib4fv(K.location,ee);break;default:n.vertexAttrib1fv(K.location,ee)}}}}y()}function A(){M();for(const C in i){const D=i[C];for(const z in D){const Y=D[z];for(const I in Y){const H=Y[I];for(const O in H)u(H[O].object),delete H[O];delete Y[I]}}delete i[C]}}function b(C){if(i[C.id]===void 0)return;const D=i[C.id];for(const z in D){const Y=D[z];for(const I in Y){const H=Y[I];for(const O in H)u(H[O].object),delete H[O];delete Y[I]}}delete i[C.id]}function w(C){for(const D in i){const z=i[D];for(const Y in z){const I=z[Y];if(I[C.id]===void 0)continue;const H=I[C.id];for(const O in H)u(H[O].object),delete H[O];delete I[C.id]}}}function g(C){for(const D in i){const z=i[D],Y=C.isInstancedMesh===!0?C.id:0,I=z[Y];if(I!==void 0){for(const H in I){const O=I[H];for(const X in O)u(O[X].object),delete O[X];delete I[H]}delete z[Y],Object.keys(z).length===0&&delete i[D]}}}function M(){P(),a=!0,s!==r&&(s=r,l(s.object))}function P(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:M,resetDefaultState:P,dispose:A,releaseStatesOfGeometry:b,releaseStatesOfObject:g,releaseStatesOfProgram:w,initAttributes:v,enableAttribute:p,disableUnusedAttributes:y}}function im(n,e,t){let i;function r(c){i=c}function s(c,l){n.drawArrays(i,c,l),t.update(l,i,1)}function a(c,l,u){u!==0&&(n.drawArraysInstanced(i,c,l,u),t.update(l,i,u))}function o(c,l,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,l,0,u);let f=0;for(let m=0;m<u;m++)f+=l[m];t.update(f,i,1)}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o}function rm(n,e,t,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const w=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(w){return!(w!==an&&i.convert(w)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(w){const g=w===Un&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(w!==$t&&i.convert(w)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==sn&&!g)}function c(w){if(w==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const u=c(l);u!==l&&(Ne("WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);const h=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&f===!1&&Ne("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const m=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),p=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),d=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),T=n.getParameter(n.MAX_VARYING_VECTORS),S=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),A=n.getParameter(n.MAX_SAMPLES),b=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:h,reversedDepthBuffer:f,maxTextures:m,maxVertexTextures:_,maxTextureSize:v,maxCubemapSize:p,maxAttributes:d,maxVertexUniforms:y,maxVaryings:T,maxFragmentUniforms:S,maxSamples:A,samples:b}}function sm(n){const e=this;let t=null,i=0,r=!1,s=!1;const a=new si,o=new Oe,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){const m=h.length!==0||f||i!==0||r;return r=f,i=h.length,m},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,f){t=u(h,f,0)},this.setState=function(h,f,m){const _=h.clippingPlanes,v=h.clipIntersection,p=h.clipShadows,d=n.get(h);if(!r||_===null||_.length===0||s&&!p)s?u(null):l();else{const y=s?0:i,T=y*4;let S=d.clippingState||null;c.value=S,S=u(_,f,T,m);for(let A=0;A!==T;++A)S[A]=t[A];d.clippingState=S,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=y}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(h,f,m,_){const v=h!==null?h.length:0;let p=null;if(v!==0){if(p=c.value,_!==!0||p===null){const d=m+v*4,y=f.matrixWorldInverse;o.getNormalMatrix(y),(p===null||p.length<d)&&(p=new Float32Array(d));for(let T=0,S=m;T!==v;++T,S+=4)a.copy(h[T]).applyMatrix4(y,o),a.normal.toArray(p,S),p[S+3]=a.constant}c.value=p,c.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,p}}const Kn=4,Tc=[.125,.215,.35,.446,.526,.582],oi=20,am=256,ir=new ps,Ac=new qe;let Ks=null,Js=0,Qs=0,js=!1;const om=new B;class Rc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,r=100,s={}){const{size:a=256,position:o=om}=s;Ks=this._renderer.getRenderTarget(),Js=this._renderer.getActiveCubeFace(),Qs=this._renderer.getActiveMipmapLevel(),js=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,i,r,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Pc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Cc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Ks,Js,Qs),this._renderer.xr.enabled=js,e.scissorTest=!1,Ii(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===fi||e.mapping===Hi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ks=this._renderer.getRenderTarget(),Js=this._renderer.getActiveCubeFace(),Qs=this._renderer.getActiveMipmapLevel(),js=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Nt,minFilter:Nt,generateMipmaps:!1,type:Un,format:an,colorSpace:as,depthBuffer:!1},r=wc(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=wc(e,t,i);const{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=cm(s)),this._blurMaterial=um(s,e,t),this._ggxMaterial=lm(s,e,t)}return r}_compileMaterial(e){const t=new lt(new cn,e);this._renderer.compile(t,ir)}_sceneToCubeUV(e,t,i,r,s){const c=new nn(90,1,t,i),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,m=h.toneMapping;h.getClearColor(Ac),h.toneMapping=vn,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(r),h.clearDepth(),h.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new lt(new Qt,new Il({name:"PMREM.Background",side:Ht,depthWrite:!1,depthTest:!1})));const v=this._backgroundBox,p=v.material;let d=!1;const y=e.background;y?y.isColor&&(p.color.copy(y),e.background=null,d=!0):(p.color.copy(Ac),d=!0);for(let T=0;T<6;T++){const S=T%3;S===0?(c.up.set(0,l[T],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x+u[T],s.y,s.z)):S===1?(c.up.set(0,0,l[T]),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y+u[T],s.z)):(c.up.set(0,l[T],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y,s.z+u[T]));const A=this._cubeSize;Ii(r,S*A,T>2?A:0,A,A),h.setRenderTarget(r),d&&h.render(v,c),h.render(e,c)}h.toneMapping=m,h.autoClear=f,e.background=y}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===fi||e.mapping===Hi;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Pc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Cc());const s=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=s;const o=s.uniforms;o.envMap.value=e;const c=this._cubeSize;Ii(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(a,ir)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(e,s-1,s);t.autoClear=i}_applyGGXFilter(e,t,i){const r=this._renderer,s=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;const c=a.uniforms,l=i/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),h=Math.sqrt(l*l-u*u),f=0+l*1.25,m=h*f,{_lodMax:_}=this,v=this._sizeLods[i],p=3*v*(i>_-Kn?i-_+Kn:0),d=4*(this._cubeSize-v);c.envMap.value=e.texture,c.roughness.value=m,c.mipInt.value=_-t,Ii(s,p,d,3*v,2*v),r.setRenderTarget(s),r.render(o,ir),c.envMap.value=s.texture,c.roughness.value=0,c.mipInt.value=_-i,Ii(e,p,d,3*v,2*v),r.setRenderTarget(e),r.render(o,ir)}_blur(e,t,i,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,r,"latitudinal",s),this._halfBlur(a,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Je("blur direction must be either latitudinal or longitudinal!");const u=3,h=this._lodMeshes[r];h.material=l;const f=l.uniforms,m=this._sizeLods[i]-1,_=isFinite(s)?Math.PI/(2*m):2*Math.PI/(2*oi-1),v=s/_,p=isFinite(s)?1+Math.floor(u*v):oi;p>oi&&Ne(`sigmaRadians, ${s}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${oi}`);const d=[];let y=0;for(let w=0;w<oi;++w){const g=w/v,M=Math.exp(-g*g/2);d.push(M),w===0?y+=M:w<p&&(y+=2*M)}for(let w=0;w<d.length;w++)d[w]=d[w]/y;f.envMap.value=e.texture,f.samples.value=p,f.weights.value=d,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:T}=this;f.dTheta.value=_,f.mipInt.value=T-i;const S=this._sizeLods[r],A=3*S*(r>T-Kn?r-T+Kn:0),b=4*(this._cubeSize-S);Ii(t,A,b,3*S,2*S),c.setRenderTarget(t),c.render(h,ir)}}function cm(n){const e=[],t=[],i=[];let r=n;const s=n-Kn+1+Tc.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);e.push(o);let c=1/o;a>n-Kn?c=Tc[a-n+Kn-1]:a===0&&(c=0),t.push(c);const l=1/(o-2),u=-l,h=1+l,f=[u,u,h,u,h,h,u,u,h,h,u,h],m=6,_=6,v=3,p=2,d=1,y=new Float32Array(v*_*m),T=new Float32Array(p*_*m),S=new Float32Array(d*_*m);for(let b=0;b<m;b++){const w=b%3*2/3-1,g=b>2?0:-1,M=[w,g,0,w+2/3,g,0,w+2/3,g+1,0,w,g,0,w+2/3,g+1,0,w,g+1,0];y.set(M,v*_*b),T.set(f,p*_*b);const P=[b,b,b,b,b,b];S.set(P,d*_*b)}const A=new cn;A.setAttribute("position",new on(y,v)),A.setAttribute("uv",new on(T,p)),A.setAttribute("faceIndex",new on(S,d)),i.push(new lt(A,null)),r>Kn&&r--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function wc(n,e,t){const i=new Mn(n,e,t);return i.texture.mapping=ds,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Ii(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function lm(n,e,t){return new yn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:am,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:ms(),fragmentShader:`

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
		`,blending:In,depthTest:!1,depthWrite:!1})}function um(n,e,t){const i=new Float32Array(oi),r=new B(0,1,0);return new yn({name:"SphericalGaussianBlur",defines:{n:oi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:ms(),fragmentShader:`

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
		`,blending:In,depthTest:!1,depthWrite:!1})}function Cc(){return new yn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ms(),fragmentShader:`

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
		`,blending:In,depthTest:!1,depthWrite:!1})}function Pc(){return new yn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ms(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:In,depthTest:!1,depthWrite:!1})}function ms(){return`

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
	`}class zl extends Mn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new Ul(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Qt(5,5,5),s=new yn({name:"CubemapFromEquirect",uniforms:Xi(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Ht,blending:In});s.uniforms.tEquirect.value=t;const a=new lt(r,s),o=t.minFilter;return t.minFilter===ci&&(t.minFilter=Nt),new gd(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,r=!0){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,r);e.setRenderTarget(s)}}function fm(n){let e=new WeakMap,t=new WeakMap,i=null;function r(f,m=!1){return f==null?null:m?a(f):s(f)}function s(f){if(f&&f.isTexture){const m=f.mapping;if(m===Ss||m===ys)if(e.has(f)){const _=e.get(f).texture;return o(_,f.mapping)}else{const _=f.image;if(_&&_.height>0){const v=new zl(_.height);return v.fromEquirectangularTexture(n,f),e.set(f,v),f.addEventListener("dispose",l),o(v.texture,f.mapping)}else return null}}return f}function a(f){if(f&&f.isTexture){const m=f.mapping,_=m===Ss||m===ys,v=m===fi||m===Hi;if(_||v){let p=t.get(f);const d=p!==void 0?p.texture.pmremVersion:0;if(f.isRenderTargetTexture&&f.pmremVersion!==d)return i===null&&(i=new Rc(n)),p=_?i.fromEquirectangular(f,p):i.fromCubemap(f,p),p.texture.pmremVersion=f.pmremVersion,t.set(f,p),p.texture;if(p!==void 0)return p.texture;{const y=f.image;return _&&y&&y.height>0||v&&y&&c(y)?(i===null&&(i=new Rc(n)),p=_?i.fromEquirectangular(f):i.fromCubemap(f),p.texture.pmremVersion=f.pmremVersion,t.set(f,p),f.addEventListener("dispose",u),p.texture):null}}}return f}function o(f,m){return m===Ss?f.mapping=fi:m===ys&&(f.mapping=Hi),f}function c(f){let m=0;const _=6;for(let v=0;v<_;v++)f[v]!==void 0&&m++;return m===_}function l(f){const m=f.target;m.removeEventListener("dispose",l);const _=e.get(m);_!==void 0&&(e.delete(m),_.dispose())}function u(f){const m=f.target;m.removeEventListener("dispose",u);const _=t.get(m);_!==void 0&&(t.delete(m),_.dispose())}function h(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:r,dispose:h}}function dm(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const r=n.getExtension(i);return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&Bi("WebGLRenderer: "+i+" extension not supported."),r}}}function hm(n,e,t,i){const r={},s=new WeakMap;function a(h){const f=h.target;f.index!==null&&e.remove(f.index);for(const _ in f.attributes)e.remove(f.attributes[_]);f.removeEventListener("dispose",a),delete r[f.id];const m=s.get(f);m&&(e.remove(m),s.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(h,f){return r[f.id]===!0||(f.addEventListener("dispose",a),r[f.id]=!0,t.memory.geometries++),f}function c(h){const f=h.attributes;for(const m in f)e.update(f[m],n.ARRAY_BUFFER)}function l(h){const f=[],m=h.index,_=h.attributes.position;let v=0;if(_===void 0)return;if(m!==null){const y=m.array;v=m.version;for(let T=0,S=y.length;T<S;T+=3){const A=y[T+0],b=y[T+1],w=y[T+2];f.push(A,b,b,w,w,A)}}else{const y=_.array;v=_.version;for(let T=0,S=y.length/3-1;T<S;T+=3){const A=T+0,b=T+1,w=T+2;f.push(A,b,b,w,w,A)}}const p=new(_.count>=65535?Dl:Pl)(f,1);p.version=v;const d=s.get(h);d&&e.remove(d),s.set(h,p)}function u(h){const f=s.get(h);if(f){const m=h.index;m!==null&&f.version<m.version&&l(h)}else l(h);return s.get(h)}return{get:o,update:c,getWireframeAttribute:u}}function pm(n,e,t){let i;function r(h){i=h}let s,a;function o(h){s=h.type,a=h.bytesPerElement}function c(h,f){n.drawElements(i,f,s,h*a),t.update(f,i,1)}function l(h,f,m){m!==0&&(n.drawElementsInstanced(i,f,s,h*a,m),t.update(f,i,m))}function u(h,f,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,s,h,0,m);let v=0;for(let p=0;p<m;p++)v+=f[p];t.update(v,i,1)}this.setMode=r,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function mm(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(s/3);break;case n.LINES:t.lines+=o*(s/2);break;case n.LINE_STRIP:t.lines+=o*(s-1);break;case n.LINE_LOOP:t.lines+=o*s;break;case n.POINTS:t.points+=o*s;break;default:Je("WebGLInfo: Unknown draw mode:",a);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function gm(n,e,t){const i=new WeakMap,r=new mt;function s(a,o,c){const l=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=u!==void 0?u.length:0;let f=i.get(o);if(f===void 0||f.count!==h){let P=function(){g.dispose(),i.delete(o),o.removeEventListener("dispose",P)};var m=P;f!==void 0&&f.texture.dispose();const _=o.morphAttributes.position!==void 0,v=o.morphAttributes.normal!==void 0,p=o.morphAttributes.color!==void 0,d=o.morphAttributes.position||[],y=o.morphAttributes.normal||[],T=o.morphAttributes.color||[];let S=0;_===!0&&(S=1),v===!0&&(S=2),p===!0&&(S=3);let A=o.attributes.position.count*S,b=1;A>e.maxTextureSize&&(b=Math.ceil(A/e.maxTextureSize),A=e.maxTextureSize);const w=new Float32Array(A*b*4*h),g=new Rl(w,A,b,h);g.type=sn,g.needsUpdate=!0;const M=S*4;for(let C=0;C<h;C++){const D=d[C],z=y[C],Y=T[C],I=A*b*4*C;for(let H=0;H<D.count;H++){const O=H*M;_===!0&&(r.fromBufferAttribute(D,H),w[I+O+0]=r.x,w[I+O+1]=r.y,w[I+O+2]=r.z,w[I+O+3]=0),v===!0&&(r.fromBufferAttribute(z,H),w[I+O+4]=r.x,w[I+O+5]=r.y,w[I+O+6]=r.z,w[I+O+7]=0),p===!0&&(r.fromBufferAttribute(Y,H),w[I+O+8]=r.x,w[I+O+9]=r.y,w[I+O+10]=r.z,w[I+O+11]=Y.itemSize===4?r.w:1)}}f={count:h,texture:g,size:new Ze(A,b)},i.set(o,f),o.addEventListener("dispose",P)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let _=0;for(let p=0;p<l.length;p++)_+=l[p];const v=o.morphTargetsRelative?1:1-_;c.getUniforms().setValue(n,"morphTargetBaseInfluence",v),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",f.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:s}}function _m(n,e,t,i,r){let s=new WeakMap;function a(l){const u=r.render.frame,h=l.geometry,f=e.get(l,h);if(s.get(f)!==u&&(e.update(f),s.set(f,u)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),s.get(l)!==u&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,u))),l.isSkinnedMesh){const m=l.skeleton;s.get(m)!==u&&(m.update(),s.set(m,u))}return f}function o(){s=new WeakMap}function c(l){const u=l.target;u.removeEventListener("dispose",c),i.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:a,dispose:o}}const xm={[hl]:"LINEAR_TONE_MAPPING",[pl]:"REINHARD_TONE_MAPPING",[ml]:"CINEON_TONE_MAPPING",[so]:"ACES_FILMIC_TONE_MAPPING",[_l]:"AGX_TONE_MAPPING",[xl]:"NEUTRAL_TONE_MAPPING",[gl]:"CUSTOM_TONE_MAPPING"};function vm(n,e,t,i,r,s){const a=new Mn(e,t,{type:n,depthBuffer:r,stencilBuffer:s,samples:i?4:0,depthTexture:r?new Wi(e,t):void 0}),o=new Mn(e,t,{type:Un,depthBuffer:!1,stencilBuffer:!1}),c=new cn;c.setAttribute("position",new kt([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new kt([0,2,0,0,2,0],2));const l=new ld({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),u=new lt(c,l),h=new ps(-1,1,1,-1,0,1);let f=null,m=null,_=!1,v,p=null,d=[],y=!1;this.setSize=function(T,S){a.setSize(T,S),o.setSize(T,S);for(let A=0;A<d.length;A++){const b=d[A];b.setSize&&b.setSize(T,S)}},this.setEffects=function(T){d=T,y=d.length>0&&d[0].isRenderPass===!0;const S=a.width,A=a.height;for(let b=0;b<d.length;b++){const w=d[b];w.setSize&&w.setSize(S,A)}},this.begin=function(T,S){if(_||T.toneMapping===vn&&d.length===0)return!1;if(p=S,S!==null){const A=S.width,b=S.height;(a.width!==A||a.height!==b)&&this.setSize(A,b)}return y===!1&&T.setRenderTarget(a),v=T.toneMapping,T.toneMapping=vn,!0},this.hasRenderPass=function(){return y},this.end=function(T,S){T.toneMapping=v,_=!0;let A=a,b=o;for(let w=0;w<d.length;w++){const g=d[w];if(g.enabled!==!1&&(g.render(T,b,A,S),g.needsSwap!==!1)){const M=A;A=b,b=M}}if(f!==T.outputColorSpace||m!==T.toneMapping){f=T.outputColorSpace,m=T.toneMapping,l.defines={},Ye.getTransfer(f)===et&&(l.defines.SRGB_TRANSFER="");const w=xm[m];w&&(l.defines[w]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=A.texture,T.setRenderTarget(p),T.render(u,h),p=null,_=!1},this.isCompositing=function(){return _},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),o.dispose(),c.dispose(),l.dispose()}}const Gl=new Bt,Ka=new Wi(1,1),Vl=new Rl,Hl=new kf,Wl=new Ul,Dc=[],Ic=[],Lc=new Float32Array(16),Uc=new Float32Array(9),Nc=new Float32Array(4);function Yi(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=Dc[r];if(s===void 0&&(s=new Float32Array(r),Dc[r]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(s,o)}return s}function Tt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function At(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function gs(n,e){let t=Ic[e];t===void 0&&(t=new Int32Array(e),Ic[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function Mm(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function Sm(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;n.uniform2fv(this.addr,e),At(t,e)}}function ym(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Tt(t,e))return;n.uniform3fv(this.addr,e),At(t,e)}}function Em(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;n.uniform4fv(this.addr,e),At(t,e)}}function bm(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Tt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),At(t,e)}else{if(Tt(t,i))return;Nc.set(i),n.uniformMatrix2fv(this.addr,!1,Nc),At(t,i)}}function Tm(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Tt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),At(t,e)}else{if(Tt(t,i))return;Uc.set(i),n.uniformMatrix3fv(this.addr,!1,Uc),At(t,i)}}function Am(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Tt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),At(t,e)}else{if(Tt(t,i))return;Lc.set(i),n.uniformMatrix4fv(this.addr,!1,Lc),At(t,i)}}function Rm(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function wm(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;n.uniform2iv(this.addr,e),At(t,e)}}function Cm(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Tt(t,e))return;n.uniform3iv(this.addr,e),At(t,e)}}function Pm(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;n.uniform4iv(this.addr,e),At(t,e)}}function Dm(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function Im(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;n.uniform2uiv(this.addr,e),At(t,e)}}function Lm(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Tt(t,e))return;n.uniform3uiv(this.addr,e),At(t,e)}}function Um(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;n.uniform4uiv(this.addr,e),At(t,e)}}function Nm(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(Ka.compareFunction=t.isReversedDepthBuffer()?mo:po,s=Ka):s=Gl,t.setTexture2D(e||s,r)}function Fm(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||Hl,r)}function Om(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||Wl,r)}function Bm(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||Vl,r)}function km(n){switch(n){case 5126:return Mm;case 35664:return Sm;case 35665:return ym;case 35666:return Em;case 35674:return bm;case 35675:return Tm;case 35676:return Am;case 5124:case 35670:return Rm;case 35667:case 35671:return wm;case 35668:case 35672:return Cm;case 35669:case 35673:return Pm;case 5125:return Dm;case 36294:return Im;case 36295:return Lm;case 36296:return Um;case 35678:case 36198:case 36298:case 36306:case 35682:return Nm;case 35679:case 36299:case 36307:return Fm;case 35680:case 36300:case 36308:case 36293:return Om;case 36289:case 36303:case 36311:case 36292:return Bm}}function zm(n,e){n.uniform1fv(this.addr,e)}function Gm(n,e){const t=Yi(e,this.size,2);n.uniform2fv(this.addr,t)}function Vm(n,e){const t=Yi(e,this.size,3);n.uniform3fv(this.addr,t)}function Hm(n,e){const t=Yi(e,this.size,4);n.uniform4fv(this.addr,t)}function Wm(n,e){const t=Yi(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function Xm(n,e){const t=Yi(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function qm(n,e){const t=Yi(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Ym(n,e){n.uniform1iv(this.addr,e)}function $m(n,e){n.uniform2iv(this.addr,e)}function Zm(n,e){n.uniform3iv(this.addr,e)}function Km(n,e){n.uniform4iv(this.addr,e)}function Jm(n,e){n.uniform1uiv(this.addr,e)}function Qm(n,e){n.uniform2uiv(this.addr,e)}function jm(n,e){n.uniform3uiv(this.addr,e)}function e0(n,e){n.uniform4uiv(this.addr,e)}function t0(n,e,t){const i=this.cache,r=e.length,s=gs(t,r);Tt(i,s)||(n.uniform1iv(this.addr,s),At(i,s));let a;this.type===n.SAMPLER_2D_SHADOW?a=Ka:a=Gl;for(let o=0;o!==r;++o)t.setTexture2D(e[o]||a,s[o])}function n0(n,e,t){const i=this.cache,r=e.length,s=gs(t,r);Tt(i,s)||(n.uniform1iv(this.addr,s),At(i,s));for(let a=0;a!==r;++a)t.setTexture3D(e[a]||Hl,s[a])}function i0(n,e,t){const i=this.cache,r=e.length,s=gs(t,r);Tt(i,s)||(n.uniform1iv(this.addr,s),At(i,s));for(let a=0;a!==r;++a)t.setTextureCube(e[a]||Wl,s[a])}function r0(n,e,t){const i=this.cache,r=e.length,s=gs(t,r);Tt(i,s)||(n.uniform1iv(this.addr,s),At(i,s));for(let a=0;a!==r;++a)t.setTexture2DArray(e[a]||Vl,s[a])}function s0(n){switch(n){case 5126:return zm;case 35664:return Gm;case 35665:return Vm;case 35666:return Hm;case 35674:return Wm;case 35675:return Xm;case 35676:return qm;case 5124:case 35670:return Ym;case 35667:case 35671:return $m;case 35668:case 35672:return Zm;case 35669:case 35673:return Km;case 5125:return Jm;case 36294:return Qm;case 36295:return jm;case 36296:return e0;case 35678:case 36198:case 36298:case 36306:case 35682:return t0;case 35679:case 36299:case 36307:return n0;case 35680:case 36300:case 36308:case 36293:return i0;case 36289:case 36303:case 36311:case 36292:return r0}}class a0{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=km(t.type)}}class o0{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=s0(t.type)}}class c0{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,t[o.id],i)}}}const ea=/(\w+)(\])?(\[|\.)?/g;function Fc(n,e){n.seq.push(e),n.map[e.id]=e}function l0(n,e,t){const i=n.name,r=i.length;for(ea.lastIndex=0;;){const s=ea.exec(i),a=ea.lastIndex;let o=s[1];const c=s[2]==="]",l=s[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===r){Fc(t,l===void 0?new a0(o,n,e):new o0(o,n,e));break}else{let h=t.map[o];h===void 0&&(h=new c0(o),Fc(t,h)),t=h}}}class ts{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=e.getActiveUniform(t,a),c=e.getUniformLocation(t,o.name);l0(o,c,this)}const r=[],s=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(a):s.push(a);r.length>0&&(this.seq=r.concat(s))}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,a=t.length;s!==a;++s){const o=t[s],c=i[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in t&&i.push(a)}return i}}function Oc(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const u0=37297;let f0=0;function d0(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=r;a<s;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const Bc=new Oe;function h0(n){Ye._getMatrix(Bc,Ye.workingColorSpace,n);const e=`mat3( ${Bc.elements.map(t=>t.toFixed(4))} )`;switch(Ye.getTransfer(n)){case os:return[e,"LinearTransferOETF"];case et:return[e,"sRGBTransferOETF"];default:return Ne("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function kc(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),s=(n.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+s+`

`+d0(n.getShaderSource(e),o)}else return s}function p0(n,e){const t=h0(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const m0={[hl]:"Linear",[pl]:"Reinhard",[ml]:"Cineon",[so]:"ACESFilmic",[_l]:"AgX",[xl]:"Neutral",[gl]:"Custom"};function g0(n,e){const t=m0[e];return t===void 0?(Ne("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Xr=new B;function _0(){Ye.getLuminanceCoefficients(Xr);const n=Xr.x.toFixed(4),e=Xr.y.toFixed(4),t=Xr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function x0(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(lr).join(`
`)}function v0(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function M0(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),a=s.name;let o=1;s.type===n.FLOAT_MAT2&&(o=2),s.type===n.FLOAT_MAT3&&(o=3),s.type===n.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function lr(n){return n!==""}function zc(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Gc(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const S0=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ja(n){return n.replace(S0,E0)}const y0=new Map;function E0(n,e){let t=Ge[e];if(t===void 0){const i=y0.get(e);if(i!==void 0)t=Ge[i],Ne('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Ja(t)}const b0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Vc(n){return n.replace(b0,T0)}function T0(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Hc(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}const A0={[Kr]:"SHADOWMAP_TYPE_PCF",[cr]:"SHADOWMAP_TYPE_VSM"};function R0(n){return A0[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const w0={[fi]:"ENVMAP_TYPE_CUBE",[Hi]:"ENVMAP_TYPE_CUBE",[ds]:"ENVMAP_TYPE_CUBE_UV"};function C0(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":w0[n.envMapMode]||"ENVMAP_TYPE_CUBE"}const P0={[Hi]:"ENVMAP_MODE_REFRACTION"};function D0(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":P0[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const I0={[dl]:"ENVMAP_BLENDING_MULTIPLY",[xf]:"ENVMAP_BLENDING_MIX",[vf]:"ENVMAP_BLENDING_ADD"};function L0(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":I0[n.combine]||"ENVMAP_BLENDING_NONE"}function U0(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function N0(n,e,t,i){const r=n.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=R0(t),l=C0(t),u=D0(t),h=L0(t),f=U0(t),m=x0(t),_=v0(s),v=r.createProgram();let p,d,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(lr).join(`
`),p.length>0&&(p+=`
`),d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(lr).join(`
`),d.length>0&&(d+=`
`)):(p=[Hc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(lr).join(`
`),d=[Hc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==vn?"#define TONE_MAPPING":"",t.toneMapping!==vn?Ge.tonemapping_pars_fragment:"",t.toneMapping!==vn?g0("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ge.colorspace_pars_fragment,p0("linearToOutputTexel",t.outputColorSpace),_0(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(lr).join(`
`)),a=Ja(a),a=zc(a,t),a=Gc(a,t),o=Ja(o),o=zc(o,t),o=Gc(o,t),a=Vc(a),o=Vc(o),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,d=["#define varying in",t.glslVersion===Qo?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Qo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const T=y+p+a,S=y+d+o,A=Oc(r,r.VERTEX_SHADER,T),b=Oc(r,r.FRAGMENT_SHADER,S);r.attachShader(v,A),r.attachShader(v,b),t.index0AttributeName!==void 0?r.bindAttribLocation(v,0,t.index0AttributeName):t.hasPositionAttribute===!0&&r.bindAttribLocation(v,0,"position"),r.linkProgram(v);function w(C){if(n.debug.checkShaderErrors){const D=r.getProgramInfoLog(v)||"",z=r.getShaderInfoLog(A)||"",Y=r.getShaderInfoLog(b)||"",I=D.trim(),H=z.trim(),O=Y.trim();let X=!0,K=!0;if(r.getProgramParameter(v,r.LINK_STATUS)===!1)if(X=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,v,A,b);else{const te=kc(r,A,"vertex"),ee=kc(r,b,"fragment");Je("WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(v,r.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+I+`
`+te+`
`+ee)}else I!==""?Ne("WebGLProgram: Program Info Log:",I):(H===""||O==="")&&(K=!1);K&&(C.diagnostics={runnable:X,programLog:I,vertexShader:{log:H,prefix:p},fragmentShader:{log:O,prefix:d}})}r.deleteShader(A),r.deleteShader(b),g=new ts(r,v),M=M0(r,v)}let g;this.getUniforms=function(){return g===void 0&&w(this),g};let M;this.getAttributes=function(){return M===void 0&&w(this),M};let P=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return P===!1&&(P=r.getProgramParameter(v,u0)),P},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=f0++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=A,this.fragmentShader=b,this}let F0=0;class O0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){const r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(i)===!1&&(r.add(i),i.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new B0(e),t.set(e,i)),i}}class B0{constructor(e){this.id=F0++,this.code=e,this.usedTimes=0}}function k0(n){return n===di||n===rs||n===ss}function z0(n,e,t,i,r,s){const a=new wl,o=new O0,c=new Set,l=[],u=new Map,h=i.logarithmicDepthBuffer;let f=i.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(g){return c.add(g),g===0?"uv":`uv${g}`}function v(g,M,P,C,D,z){const Y=C.fog,I=D.geometry,H=g.isMeshStandardMaterial||g.isMeshLambertMaterial||g.isMeshPhongMaterial?C.environment:null,O=g.isMeshStandardMaterial||g.isMeshLambertMaterial&&!g.envMap||g.isMeshPhongMaterial&&!g.envMap,X=e.get(g.envMap||H,O),K=X&&X.mapping===ds?X.image.height:null,te=m[g.type];g.precision!==null&&(f=i.getMaxPrecision(g.precision),f!==g.precision&&Ne("WebGLProgram.getParameters:",g.precision,"not supported, using",f,"instead."));const ee=I.morphAttributes.position||I.morphAttributes.normal||I.morphAttributes.color,he=ee!==void 0?ee.length:0;let Ie=0;I.morphAttributes.position!==void 0&&(Ie=1),I.morphAttributes.normal!==void 0&&(Ie=2),I.morphAttributes.color!==void 0&&(Ie=3);let Xe,Be,J,oe;if(te){const Se=_n[te];Xe=Se.vertexShader,Be=Se.fragmentShader}else{Xe=g.vertexShader,Be=g.fragmentShader;const Se=o.getVertexShaderStage(g),gt=o.getFragmentShaderStage(g);o.update(g,Se,gt),J=Se.id,oe=gt.id}const W=n.getRenderTarget(),ie=n.state.buffers.depth.getReversed(),ae=D.isInstancedMesh===!0,se=D.isBatchedMesh===!0,De=!!g.map,be=!!g.matcap,Ve=!!X,Fe=!!g.aoMap,Ue=!!g.lightMap,at=!!g.bumpMap&&g.wireframe===!1,ut=!!g.normalMap,ht=!!g.displacementMap,St=!!g.emissiveMap,ft=!!g.metalnessMap,pt=!!g.roughnessMap,U=g.anisotropy>0,Te=g.clearcoat>0,ye=g.dispersion>0,R=g.iridescence>0,x=g.sheen>0,N=g.transmission>0,k=U&&!!g.anisotropyMap,$=Te&&!!g.clearcoatMap,re=Te&&!!g.clearcoatNormalMap,le=Te&&!!g.clearcoatRoughnessMap,Z=R&&!!g.iridescenceMap,j=R&&!!g.iridescenceThicknessMap,ue=x&&!!g.sheenColorMap,Re=x&&!!g.sheenRoughnessMap,pe=!!g.specularMap,fe=!!g.specularColorMap,Pe=!!g.specularIntensityMap,Le=N&&!!g.transmissionMap,ke=N&&!!g.thicknessMap,L=!!g.gradientMap,ce=!!g.alphaMap,Q=g.alphaTest>0,de=!!g.alphaHash,xe=!!g.extensions;let ne=vn;g.toneMapped&&(W===null||W.isXRRenderTarget===!0)&&(ne=n.toneMapping);const Ae={shaderID:te,shaderType:g.type,shaderName:g.name,vertexShader:Xe,fragmentShader:Be,defines:g.defines,customVertexShaderID:J,customFragmentShaderID:oe,isRawShaderMaterial:g.isRawShaderMaterial===!0,glslVersion:g.glslVersion,precision:f,batching:se,batchingColor:se&&D._colorsTexture!==null,instancing:ae,instancingColor:ae&&D.instanceColor!==null,instancingMorph:ae&&D.morphTexture!==null,outputColorSpace:W===null?n.outputColorSpace:W.isXRRenderTarget===!0?W.texture.colorSpace:Ye.workingColorSpace,alphaToCoverage:!!g.alphaToCoverage,map:De,matcap:be,envMap:Ve,envMapMode:Ve&&X.mapping,envMapCubeUVHeight:K,aoMap:Fe,lightMap:Ue,bumpMap:at,normalMap:ut,displacementMap:ht,emissiveMap:St,normalMapObjectSpace:ut&&g.normalMapType===yf,normalMapTangentSpace:ut&&g.normalMapType===$a,packedNormalMap:ut&&g.normalMapType===$a&&k0(g.normalMap.format),metalnessMap:ft,roughnessMap:pt,anisotropy:U,anisotropyMap:k,clearcoat:Te,clearcoatMap:$,clearcoatNormalMap:re,clearcoatRoughnessMap:le,dispersion:ye,iridescence:R,iridescenceMap:Z,iridescenceThicknessMap:j,sheen:x,sheenColorMap:ue,sheenRoughnessMap:Re,specularMap:pe,specularColorMap:fe,specularIntensityMap:Pe,transmission:N,transmissionMap:Le,thicknessMap:ke,gradientMap:L,opaque:g.transparent===!1&&g.blending===Oi&&g.alphaToCoverage===!1,alphaMap:ce,alphaTest:Q,alphaHash:de,combine:g.combine,mapUv:De&&_(g.map.channel),aoMapUv:Fe&&_(g.aoMap.channel),lightMapUv:Ue&&_(g.lightMap.channel),bumpMapUv:at&&_(g.bumpMap.channel),normalMapUv:ut&&_(g.normalMap.channel),displacementMapUv:ht&&_(g.displacementMap.channel),emissiveMapUv:St&&_(g.emissiveMap.channel),metalnessMapUv:ft&&_(g.metalnessMap.channel),roughnessMapUv:pt&&_(g.roughnessMap.channel),anisotropyMapUv:k&&_(g.anisotropyMap.channel),clearcoatMapUv:$&&_(g.clearcoatMap.channel),clearcoatNormalMapUv:re&&_(g.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:le&&_(g.clearcoatRoughnessMap.channel),iridescenceMapUv:Z&&_(g.iridescenceMap.channel),iridescenceThicknessMapUv:j&&_(g.iridescenceThicknessMap.channel),sheenColorMapUv:ue&&_(g.sheenColorMap.channel),sheenRoughnessMapUv:Re&&_(g.sheenRoughnessMap.channel),specularMapUv:pe&&_(g.specularMap.channel),specularColorMapUv:fe&&_(g.specularColorMap.channel),specularIntensityMapUv:Pe&&_(g.specularIntensityMap.channel),transmissionMapUv:Le&&_(g.transmissionMap.channel),thicknessMapUv:ke&&_(g.thicknessMap.channel),alphaMapUv:ce&&_(g.alphaMap.channel),vertexTangents:!!I.attributes.tangent&&(ut||U),vertexNormals:!!I.attributes.normal,vertexColors:g.vertexColors,vertexAlphas:g.vertexColors===!0&&!!I.attributes.color&&I.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!I.attributes.uv&&(De||ce),fog:!!Y,useFog:g.fog===!0,fogExp2:!!Y&&Y.isFogExp2,flatShading:g.wireframe===!1&&(g.flatShading===!0||I.attributes.normal===void 0&&ut===!1&&(g.isMeshLambertMaterial||g.isMeshPhongMaterial||g.isMeshStandardMaterial||g.isMeshPhysicalMaterial)),sizeAttenuation:g.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:ie,skinning:D.isSkinnedMesh===!0,hasPositionAttribute:I.attributes.position!==void 0,morphTargets:I.morphAttributes.position!==void 0,morphNormals:I.morphAttributes.normal!==void 0,morphColors:I.morphAttributes.color!==void 0,morphTargetsCount:he,morphTextureStride:Ie,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numLightProbeGrids:z.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:g.dithering,shadowMapEnabled:n.shadowMap.enabled&&P.length>0,shadowMapType:n.shadowMap.type,toneMapping:ne,decodeVideoTexture:De&&g.map.isVideoTexture===!0&&Ye.getTransfer(g.map.colorSpace)===et,decodeVideoTextureEmissive:St&&g.emissiveMap.isVideoTexture===!0&&Ye.getTransfer(g.emissiveMap.colorSpace)===et,premultipliedAlpha:g.premultipliedAlpha,doubleSided:g.side===Pn,flipSided:g.side===Ht,useDepthPacking:g.depthPacking>=0,depthPacking:g.depthPacking||0,index0AttributeName:g.index0AttributeName,extensionClipCullDistance:xe&&g.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(xe&&g.extensions.multiDraw===!0||se)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:g.customProgramCacheKey()};return Ae.vertexUv1s=c.has(1),Ae.vertexUv2s=c.has(2),Ae.vertexUv3s=c.has(3),c.clear(),Ae}function p(g){const M=[];if(g.shaderID?M.push(g.shaderID):(M.push(g.customVertexShaderID),M.push(g.customFragmentShaderID)),g.defines!==void 0)for(const P in g.defines)M.push(P),M.push(g.defines[P]);return g.isRawShaderMaterial===!1&&(d(M,g),y(M,g),M.push(n.outputColorSpace)),M.push(g.customProgramCacheKey),M.join()}function d(g,M){g.push(M.precision),g.push(M.outputColorSpace),g.push(M.envMapMode),g.push(M.envMapCubeUVHeight),g.push(M.mapUv),g.push(M.alphaMapUv),g.push(M.lightMapUv),g.push(M.aoMapUv),g.push(M.bumpMapUv),g.push(M.normalMapUv),g.push(M.displacementMapUv),g.push(M.emissiveMapUv),g.push(M.metalnessMapUv),g.push(M.roughnessMapUv),g.push(M.anisotropyMapUv),g.push(M.clearcoatMapUv),g.push(M.clearcoatNormalMapUv),g.push(M.clearcoatRoughnessMapUv),g.push(M.iridescenceMapUv),g.push(M.iridescenceThicknessMapUv),g.push(M.sheenColorMapUv),g.push(M.sheenRoughnessMapUv),g.push(M.specularMapUv),g.push(M.specularColorMapUv),g.push(M.specularIntensityMapUv),g.push(M.transmissionMapUv),g.push(M.thicknessMapUv),g.push(M.combine),g.push(M.fogExp2),g.push(M.sizeAttenuation),g.push(M.morphTargetsCount),g.push(M.morphAttributeCount),g.push(M.numDirLights),g.push(M.numPointLights),g.push(M.numSpotLights),g.push(M.numSpotLightMaps),g.push(M.numHemiLights),g.push(M.numRectAreaLights),g.push(M.numDirLightShadows),g.push(M.numPointLightShadows),g.push(M.numSpotLightShadows),g.push(M.numSpotLightShadowsWithMaps),g.push(M.numLightProbes),g.push(M.shadowMapType),g.push(M.toneMapping),g.push(M.numClippingPlanes),g.push(M.numClipIntersection),g.push(M.depthPacking)}function y(g,M){a.disableAll(),M.instancing&&a.enable(0),M.instancingColor&&a.enable(1),M.instancingMorph&&a.enable(2),M.matcap&&a.enable(3),M.envMap&&a.enable(4),M.normalMapObjectSpace&&a.enable(5),M.normalMapTangentSpace&&a.enable(6),M.clearcoat&&a.enable(7),M.iridescence&&a.enable(8),M.alphaTest&&a.enable(9),M.vertexColors&&a.enable(10),M.vertexAlphas&&a.enable(11),M.vertexUv1s&&a.enable(12),M.vertexUv2s&&a.enable(13),M.vertexUv3s&&a.enable(14),M.vertexTangents&&a.enable(15),M.anisotropy&&a.enable(16),M.alphaHash&&a.enable(17),M.batching&&a.enable(18),M.dispersion&&a.enable(19),M.batchingColor&&a.enable(20),M.gradientMap&&a.enable(21),M.packedNormalMap&&a.enable(22),M.vertexNormals&&a.enable(23),g.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reversedDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),M.numLightProbeGrids>0&&a.enable(22),M.hasPositionAttribute&&a.enable(23),g.push(a.mask)}function T(g){const M=m[g.type];let P;if(M){const C=_n[M];P=ad.clone(C.uniforms)}else P=g.uniforms;return P}function S(g,M){let P=u.get(M);return P!==void 0?++P.usedTimes:(P=new N0(n,M,g,r),l.push(P),u.set(M,P)),P}function A(g){if(--g.usedTimes===0){const M=l.indexOf(g);l[M]=l[l.length-1],l.pop(),u.delete(g.cacheKey),g.destroy()}}function b(g){o.remove(g)}function w(){o.dispose()}return{getParameters:v,getProgramCacheKey:p,getUniforms:T,acquireProgram:S,releaseProgram:A,releaseShaderCache:b,programs:l,dispose:w}}function G0(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function r(a,o,c){n.get(a)[o]=c}function s(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:s}}function V0(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function Wc(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Xc(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function a(f){let m=0;return f.isInstancedMesh&&(m+=2),f.isSkinnedMesh&&(m+=1),m}function o(f,m,_,v,p,d){let y=n[e];return y===void 0?(y={id:f.id,object:f,geometry:m,material:_,materialVariant:a(f),groupOrder:v,renderOrder:f.renderOrder,z:p,group:d},n[e]=y):(y.id=f.id,y.object=f,y.geometry=m,y.material=_,y.materialVariant=a(f),y.groupOrder=v,y.renderOrder=f.renderOrder,y.z=p,y.group=d),e++,y}function c(f,m,_,v,p,d){const y=o(f,m,_,v,p,d);_.transmission>0?i.push(y):_.transparent===!0?r.push(y):t.push(y)}function l(f,m,_,v,p,d){const y=o(f,m,_,v,p,d);_.transmission>0?i.unshift(y):_.transparent===!0?r.unshift(y):t.unshift(y)}function u(f,m,_){t.length>1&&t.sort(f||V0),i.length>1&&i.sort(m||Wc),r.length>1&&r.sort(m||Wc),_&&(t.reverse(),i.reverse(),r.reverse())}function h(){for(let f=e,m=n.length;f<m;f++){const _=n[f];if(_.id===null)break;_.id=null,_.object=null,_.geometry=null,_.material=null,_.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:c,unshift:l,finish:h,sort:u}}function H0(){let n=new WeakMap;function e(i,r){const s=n.get(i);let a;return s===void 0?(a=new Xc,n.set(i,[a])):r>=s.length?(a=new Xc,s.push(a)):a=s[r],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function W0(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new B,color:new qe};break;case"SpotLight":t={position:new B,direction:new B,color:new qe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new B,color:new qe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new B,skyColor:new qe,groundColor:new qe};break;case"RectAreaLight":t={color:new qe,position:new B,halfWidth:new B,halfHeight:new B};break}return n[e.id]=t,t}}}function X0(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ze};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ze};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ze,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let q0=0;function Y0(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function $0(n){const e=new W0,t=X0(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new B);const r=new B,s=new dt,a=new dt;function o(l){let u=0,h=0,f=0;for(let M=0;M<9;M++)i.probe[M].set(0,0,0);let m=0,_=0,v=0,p=0,d=0,y=0,T=0,S=0,A=0,b=0,w=0;l.sort(Y0);for(let M=0,P=l.length;M<P;M++){const C=l[M],D=C.color,z=C.intensity,Y=C.distance;let I=null;if(C.shadow&&C.shadow.map&&(C.shadow.map.texture.format===di?I=C.shadow.map.texture:I=C.shadow.map.depthTexture||C.shadow.map.texture),C.isAmbientLight)u+=D.r*z,h+=D.g*z,f+=D.b*z;else if(C.isLightProbe){for(let H=0;H<9;H++)i.probe[H].addScaledVector(C.sh.coefficients[H],z);w++}else if(C.isDirectionalLight){const H=e.get(C);if(H.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const O=C.shadow,X=t.get(C);X.shadowIntensity=O.intensity,X.shadowBias=O.bias,X.shadowNormalBias=O.normalBias,X.shadowRadius=O.radius,X.shadowMapSize=O.mapSize,i.directionalShadow[m]=X,i.directionalShadowMap[m]=I,i.directionalShadowMatrix[m]=C.shadow.matrix,y++}i.directional[m]=H,m++}else if(C.isSpotLight){const H=e.get(C);H.position.setFromMatrixPosition(C.matrixWorld),H.color.copy(D).multiplyScalar(z),H.distance=Y,H.coneCos=Math.cos(C.angle),H.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),H.decay=C.decay,i.spot[v]=H;const O=C.shadow;if(C.map&&(i.spotLightMap[A]=C.map,A++,O.updateMatrices(C),C.castShadow&&b++),i.spotLightMatrix[v]=O.matrix,C.castShadow){const X=t.get(C);X.shadowIntensity=O.intensity,X.shadowBias=O.bias,X.shadowNormalBias=O.normalBias,X.shadowRadius=O.radius,X.shadowMapSize=O.mapSize,i.spotShadow[v]=X,i.spotShadowMap[v]=I,S++}v++}else if(C.isRectAreaLight){const H=e.get(C);H.color.copy(D).multiplyScalar(z),H.halfWidth.set(C.width*.5,0,0),H.halfHeight.set(0,C.height*.5,0),i.rectArea[p]=H,p++}else if(C.isPointLight){const H=e.get(C);if(H.color.copy(C.color).multiplyScalar(C.intensity),H.distance=C.distance,H.decay=C.decay,C.castShadow){const O=C.shadow,X=t.get(C);X.shadowIntensity=O.intensity,X.shadowBias=O.bias,X.shadowNormalBias=O.normalBias,X.shadowRadius=O.radius,X.shadowMapSize=O.mapSize,X.shadowCameraNear=O.camera.near,X.shadowCameraFar=O.camera.far,i.pointShadow[_]=X,i.pointShadowMap[_]=I,i.pointShadowMatrix[_]=C.shadow.matrix,T++}i.point[_]=H,_++}else if(C.isHemisphereLight){const H=e.get(C);H.skyColor.copy(C.color).multiplyScalar(z),H.groundColor.copy(C.groundColor).multiplyScalar(z),i.hemi[d]=H,d++}}p>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=me.LTC_FLOAT_1,i.rectAreaLTC2=me.LTC_FLOAT_2):(i.rectAreaLTC1=me.LTC_HALF_1,i.rectAreaLTC2=me.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=f;const g=i.hash;(g.directionalLength!==m||g.pointLength!==_||g.spotLength!==v||g.rectAreaLength!==p||g.hemiLength!==d||g.numDirectionalShadows!==y||g.numPointShadows!==T||g.numSpotShadows!==S||g.numSpotMaps!==A||g.numLightProbes!==w)&&(i.directional.length=m,i.spot.length=v,i.rectArea.length=p,i.point.length=_,i.hemi.length=d,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=T,i.pointShadowMap.length=T,i.spotShadow.length=S,i.spotShadowMap.length=S,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=T,i.spotLightMatrix.length=S+A-b,i.spotLightMap.length=A,i.numSpotLightShadowsWithMaps=b,i.numLightProbes=w,g.directionalLength=m,g.pointLength=_,g.spotLength=v,g.rectAreaLength=p,g.hemiLength=d,g.numDirectionalShadows=y,g.numPointShadows=T,g.numSpotShadows=S,g.numSpotMaps=A,g.numLightProbes=w,i.version=q0++)}function c(l,u){let h=0,f=0,m=0,_=0,v=0;const p=u.matrixWorldInverse;for(let d=0,y=l.length;d<y;d++){const T=l[d];if(T.isDirectionalLight){const S=i.directional[h];S.direction.setFromMatrixPosition(T.matrixWorld),r.setFromMatrixPosition(T.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(p),h++}else if(T.isSpotLight){const S=i.spot[m];S.position.setFromMatrixPosition(T.matrixWorld),S.position.applyMatrix4(p),S.direction.setFromMatrixPosition(T.matrixWorld),r.setFromMatrixPosition(T.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(p),m++}else if(T.isRectAreaLight){const S=i.rectArea[_];S.position.setFromMatrixPosition(T.matrixWorld),S.position.applyMatrix4(p),a.identity(),s.copy(T.matrixWorld),s.premultiply(p),a.extractRotation(s),S.halfWidth.set(T.width*.5,0,0),S.halfHeight.set(0,T.height*.5,0),S.halfWidth.applyMatrix4(a),S.halfHeight.applyMatrix4(a),_++}else if(T.isPointLight){const S=i.point[f];S.position.setFromMatrixPosition(T.matrixWorld),S.position.applyMatrix4(p),f++}else if(T.isHemisphereLight){const S=i.hemi[v];S.direction.setFromMatrixPosition(T.matrixWorld),S.direction.transformDirection(p),v++}}}return{setup:o,setupView:c,state:i}}function qc(n){const e=new $0(n),t=[],i=[],r=[];function s(f){h.camera=f,t.length=0,i.length=0,r.length=0}function a(f){t.push(f)}function o(f){i.push(f)}function c(f){r.push(f)}function l(){e.setup(t)}function u(f){e.setupView(t,f)}const h={lightsArray:t,shadowsArray:i,lightProbeGridArray:r,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:h,setupLights:l,setupLightsView:u,pushLight:a,pushShadow:o,pushLightProbeGrid:c}}function Z0(n){let e=new WeakMap;function t(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new qc(n),e.set(r,[o])):s>=a.length?(o=new qc(n),a.push(o)):o=a[s],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const K0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,J0=`uniform sampler2D shadow_pass;
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
}`,Q0=[new B(1,0,0),new B(-1,0,0),new B(0,1,0),new B(0,-1,0),new B(0,0,1),new B(0,0,-1)],j0=[new B(0,-1,0),new B(0,-1,0),new B(0,0,1),new B(0,0,-1),new B(0,-1,0),new B(0,-1,0)],Yc=new dt,rr=new B,ta=new B;function eg(n,e,t){let i=new xo;const r=new Ze,s=new Ze,a=new mt,o=new ud,c=new fd,l={},u=t.maxTextureSize,h={[Jn]:Ht,[Ht]:Jn,[Pn]:Pn},f=new yn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ze},radius:{value:4}},vertexShader:K0,fragmentShader:J0}),m=f.clone();m.defines.HORIZONTAL_PASS=1;const _=new cn;_.setAttribute("position",new on(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new lt(_,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Kr;let d=this.type;this.render=function(b,w,g){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||b.length===0)return;this.type===Qu&&(Ne("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Kr);const M=n.getRenderTarget(),P=n.getActiveCubeFace(),C=n.getActiveMipmapLevel(),D=n.state;D.setBlending(In),D.buffers.depth.getReversed()===!0?D.buffers.color.setClear(0,0,0,0):D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);const z=d!==this.type;z&&w.traverse(function(Y){Y.material&&(Array.isArray(Y.material)?Y.material.forEach(I=>I.needsUpdate=!0):Y.material.needsUpdate=!0)});for(let Y=0,I=b.length;Y<I;Y++){const H=b[Y],O=H.shadow;if(O===void 0){Ne("WebGLShadowMap:",H,"has no shadow.");continue}if(O.autoUpdate===!1&&O.needsUpdate===!1)continue;r.copy(O.mapSize);const X=O.getFrameExtents();r.multiply(X),s.copy(O.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/X.x),r.x=s.x*X.x,O.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/X.y),r.y=s.y*X.y,O.mapSize.y=s.y));const K=n.state.buffers.depth.getReversed();if(O.camera._reversedDepth=K,O.map===null||z===!0){if(O.map!==null&&(O.map.depthTexture!==null&&(O.map.depthTexture.dispose(),O.map.depthTexture=null),O.map.dispose()),this.type===cr){if(H.isPointLight){Ne("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}O.map=new Mn(r.x,r.y,{format:di,type:Un,minFilter:Nt,magFilter:Nt,generateMipmaps:!1}),O.map.texture.name=H.name+".shadowMap",O.map.depthTexture=new Wi(r.x,r.y,sn),O.map.depthTexture.name=H.name+".shadowMapDepth",O.map.depthTexture.format=Nn,O.map.depthTexture.compareFunction=null,O.map.depthTexture.minFilter=Pt,O.map.depthTexture.magFilter=Pt}else H.isPointLight?(O.map=new zl(r.x),O.map.depthTexture=new rd(r.x,Sn)):(O.map=new Mn(r.x,r.y),O.map.depthTexture=new Wi(r.x,r.y,Sn)),O.map.depthTexture.name=H.name+".shadowMap",O.map.depthTexture.format=Nn,this.type===Kr?(O.map.depthTexture.compareFunction=K?mo:po,O.map.depthTexture.minFilter=Nt,O.map.depthTexture.magFilter=Nt):(O.map.depthTexture.compareFunction=null,O.map.depthTexture.minFilter=Pt,O.map.depthTexture.magFilter=Pt);O.camera.updateProjectionMatrix()}const te=O.map.isWebGLCubeRenderTarget?6:1;for(let ee=0;ee<te;ee++){if(O.map.isWebGLCubeRenderTarget)n.setRenderTarget(O.map,ee),n.clear();else{ee===0&&(n.setRenderTarget(O.map),n.clear());const he=O.getViewport(ee);a.set(s.x*he.x,s.y*he.y,s.x*he.z,s.y*he.w),D.viewport(a)}if(H.isPointLight){const he=O.camera,Ie=O.matrix,Xe=H.distance||he.far;Xe!==he.far&&(he.far=Xe,he.updateProjectionMatrix()),rr.setFromMatrixPosition(H.matrixWorld),he.position.copy(rr),ta.copy(he.position),ta.add(Q0[ee]),he.up.copy(j0[ee]),he.lookAt(ta),he.updateMatrixWorld(),Ie.makeTranslation(-rr.x,-rr.y,-rr.z),Yc.multiplyMatrices(he.projectionMatrix,he.matrixWorldInverse),O._frustum.setFromProjectionMatrix(Yc,he.coordinateSystem,he.reversedDepth)}else O.updateMatrices(H);i=O.getFrustum(),S(w,g,O.camera,H,this.type)}O.isPointLightShadow!==!0&&this.type===cr&&y(O,g),O.needsUpdate=!1}d=this.type,p.needsUpdate=!1,n.setRenderTarget(M,P,C)};function y(b,w){const g=e.update(v);f.defines.VSM_SAMPLES!==b.blurSamples&&(f.defines.VSM_SAMPLES=b.blurSamples,m.defines.VSM_SAMPLES=b.blurSamples,f.needsUpdate=!0,m.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new Mn(r.x,r.y,{format:di,type:Un})),f.uniforms.shadow_pass.value=b.map.depthTexture,f.uniforms.resolution.value=b.mapSize,f.uniforms.radius.value=b.radius,n.setRenderTarget(b.mapPass),n.clear(),n.renderBufferDirect(w,null,g,f,v,null),m.uniforms.shadow_pass.value=b.mapPass.texture,m.uniforms.resolution.value=b.mapSize,m.uniforms.radius.value=b.radius,n.setRenderTarget(b.map),n.clear(),n.renderBufferDirect(w,null,g,m,v,null)}function T(b,w,g,M){let P=null;const C=g.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(C!==void 0)P=C;else if(P=g.isPointLight===!0?c:o,n.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0||w.alphaToCoverage===!0){const D=P.uuid,z=w.uuid;let Y=l[D];Y===void 0&&(Y={},l[D]=Y);let I=Y[z];I===void 0&&(I=P.clone(),Y[z]=I,w.addEventListener("dispose",A)),P=I}if(P.visible=w.visible,P.wireframe=w.wireframe,M===cr?P.side=w.shadowSide!==null?w.shadowSide:w.side:P.side=w.shadowSide!==null?w.shadowSide:h[w.side],P.alphaMap=w.alphaMap,P.alphaTest=w.alphaToCoverage===!0?.5:w.alphaTest,P.map=w.map,P.clipShadows=w.clipShadows,P.clippingPlanes=w.clippingPlanes,P.clipIntersection=w.clipIntersection,P.displacementMap=w.displacementMap,P.displacementScale=w.displacementScale,P.displacementBias=w.displacementBias,P.wireframeLinewidth=w.wireframeLinewidth,P.linewidth=w.linewidth,g.isPointLight===!0&&P.isMeshDistanceMaterial===!0){const D=n.properties.get(P);D.light=g}return P}function S(b,w,g,M,P){if(b.visible===!1)return;if(b.layers.test(w.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&P===cr)&&(!b.frustumCulled||i.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(g.matrixWorldInverse,b.matrixWorld);const z=e.update(b),Y=b.material;if(Array.isArray(Y)){const I=z.groups;for(let H=0,O=I.length;H<O;H++){const X=I[H],K=Y[X.materialIndex];if(K&&K.visible){const te=T(b,K,M,P);b.onBeforeShadow(n,b,w,g,z,te,X),n.renderBufferDirect(g,null,z,te,b,X),b.onAfterShadow(n,b,w,g,z,te,X)}}}else if(Y.visible){const I=T(b,Y,M,P);b.onBeforeShadow(n,b,w,g,z,I,null),n.renderBufferDirect(g,null,z,I,b,null),b.onAfterShadow(n,b,w,g,z,I,null)}}const D=b.children;for(let z=0,Y=D.length;z<Y;z++)S(D[z],w,g,M,P)}function A(b){b.target.removeEventListener("dispose",A);for(const g in l){const M=l[g],P=b.target.uuid;P in M&&(M[P].dispose(),delete M[P])}}}function tg(n,e){function t(){let L=!1;const ce=new mt;let Q=null;const de=new mt(0,0,0,0);return{setMask:function(xe){Q!==xe&&!L&&(n.colorMask(xe,xe,xe,xe),Q=xe)},setLocked:function(xe){L=xe},setClear:function(xe,ne,Ae,Se,gt){gt===!0&&(xe*=Se,ne*=Se,Ae*=Se),ce.set(xe,ne,Ae,Se),de.equals(ce)===!1&&(n.clearColor(xe,ne,Ae,Se),de.copy(ce))},reset:function(){L=!1,Q=null,de.set(-1,0,0,0)}}}function i(){let L=!1,ce=!1,Q=null,de=null,xe=null;return{setReversed:function(ne){if(ce!==ne){const Ae=e.get("EXT_clip_control");ne?Ae.clipControlEXT(Ae.LOWER_LEFT_EXT,Ae.ZERO_TO_ONE_EXT):Ae.clipControlEXT(Ae.LOWER_LEFT_EXT,Ae.NEGATIVE_ONE_TO_ONE_EXT),ce=ne;const Se=xe;xe=null,this.setClear(Se)}},getReversed:function(){return ce},setTest:function(ne){ne?W(n.DEPTH_TEST):ie(n.DEPTH_TEST)},setMask:function(ne){Q!==ne&&!L&&(n.depthMask(ne),Q=ne)},setFunc:function(ne){if(ce&&(ne=If[ne]),de!==ne){switch(ne){case la:n.depthFunc(n.NEVER);break;case ua:n.depthFunc(n.ALWAYS);break;case fa:n.depthFunc(n.LESS);break;case Vi:n.depthFunc(n.LEQUAL);break;case da:n.depthFunc(n.EQUAL);break;case ha:n.depthFunc(n.GEQUAL);break;case pa:n.depthFunc(n.GREATER);break;case ma:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}de=ne}},setLocked:function(ne){L=ne},setClear:function(ne){xe!==ne&&(xe=ne,ce&&(ne=1-ne),n.clearDepth(ne))},reset:function(){L=!1,Q=null,de=null,xe=null,ce=!1}}}function r(){let L=!1,ce=null,Q=null,de=null,xe=null,ne=null,Ae=null,Se=null,gt=null;return{setTest:function(ot){L||(ot?W(n.STENCIL_TEST):ie(n.STENCIL_TEST))},setMask:function(ot){ce!==ot&&!L&&(n.stencilMask(ot),ce=ot)},setFunc:function(ot,ln,un){(Q!==ot||de!==ln||xe!==un)&&(n.stencilFunc(ot,ln,un),Q=ot,de=ln,xe=un)},setOp:function(ot,ln,un){(ne!==ot||Ae!==ln||Se!==un)&&(n.stencilOp(ot,ln,un),ne=ot,Ae=ln,Se=un)},setLocked:function(ot){L=ot},setClear:function(ot){gt!==ot&&(n.clearStencil(ot),gt=ot)},reset:function(){L=!1,ce=null,Q=null,de=null,xe=null,ne=null,Ae=null,Se=null,gt=null}}}const s=new t,a=new i,o=new r,c=new WeakMap,l=new WeakMap;let u={},h={},f={},m=new WeakMap,_=[],v=null,p=!1,d=null,y=null,T=null,S=null,A=null,b=null,w=null,g=new qe(0,0,0),M=0,P=!1,C=null,D=null,z=null,Y=null,I=null;const H=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let O=!1,X=0;const K=n.getParameter(n.VERSION);K.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(K)[1]),O=X>=1):K.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(K)[1]),O=X>=2);let te=null,ee={};const he=n.getParameter(n.SCISSOR_BOX),Ie=n.getParameter(n.VIEWPORT),Xe=new mt().fromArray(he),Be=new mt().fromArray(Ie);function J(L,ce,Q,de){const xe=new Uint8Array(4),ne=n.createTexture();n.bindTexture(L,ne),n.texParameteri(L,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(L,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ae=0;Ae<Q;Ae++)L===n.TEXTURE_3D||L===n.TEXTURE_2D_ARRAY?n.texImage3D(ce,0,n.RGBA,1,1,de,0,n.RGBA,n.UNSIGNED_BYTE,xe):n.texImage2D(ce+Ae,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,xe);return ne}const oe={};oe[n.TEXTURE_2D]=J(n.TEXTURE_2D,n.TEXTURE_2D,1),oe[n.TEXTURE_CUBE_MAP]=J(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),oe[n.TEXTURE_2D_ARRAY]=J(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),oe[n.TEXTURE_3D]=J(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),W(n.DEPTH_TEST),a.setFunc(Vi),at(!1),ut(qo),W(n.CULL_FACE),Fe(In);function W(L){u[L]!==!0&&(n.enable(L),u[L]=!0)}function ie(L){u[L]!==!1&&(n.disable(L),u[L]=!1)}function ae(L,ce){return f[L]!==ce?(n.bindFramebuffer(L,ce),f[L]=ce,L===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=ce),L===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=ce),!0):!1}function se(L,ce){let Q=_,de=!1;if(L){Q=m.get(ce),Q===void 0&&(Q=[],m.set(ce,Q));const xe=L.textures;if(Q.length!==xe.length||Q[0]!==n.COLOR_ATTACHMENT0){for(let ne=0,Ae=xe.length;ne<Ae;ne++)Q[ne]=n.COLOR_ATTACHMENT0+ne;Q.length=xe.length,de=!0}}else Q[0]!==n.BACK&&(Q[0]=n.BACK,de=!0);de&&n.drawBuffers(Q)}function De(L){return v!==L?(n.useProgram(L),v=L,!0):!1}const be={[ai]:n.FUNC_ADD,[ef]:n.FUNC_SUBTRACT,[tf]:n.FUNC_REVERSE_SUBTRACT};be[nf]=n.MIN,be[rf]=n.MAX;const Ve={[sf]:n.ZERO,[af]:n.ONE,[of]:n.SRC_COLOR,[oa]:n.SRC_ALPHA,[hf]:n.SRC_ALPHA_SATURATE,[ff]:n.DST_COLOR,[lf]:n.DST_ALPHA,[cf]:n.ONE_MINUS_SRC_COLOR,[ca]:n.ONE_MINUS_SRC_ALPHA,[df]:n.ONE_MINUS_DST_COLOR,[uf]:n.ONE_MINUS_DST_ALPHA,[pf]:n.CONSTANT_COLOR,[mf]:n.ONE_MINUS_CONSTANT_COLOR,[gf]:n.CONSTANT_ALPHA,[_f]:n.ONE_MINUS_CONSTANT_ALPHA};function Fe(L,ce,Q,de,xe,ne,Ae,Se,gt,ot){if(L===In){p===!0&&(ie(n.BLEND),p=!1);return}if(p===!1&&(W(n.BLEND),p=!0),L!==ju){if(L!==d||ot!==P){if((y!==ai||A!==ai)&&(n.blendEquation(n.FUNC_ADD),y=ai,A=ai),ot)switch(L){case Oi:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Yo:n.blendFunc(n.ONE,n.ONE);break;case $o:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Zo:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:Je("WebGLState: Invalid blending: ",L);break}else switch(L){case Oi:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Yo:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case $o:Je("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Zo:Je("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Je("WebGLState: Invalid blending: ",L);break}T=null,S=null,b=null,w=null,g.set(0,0,0),M=0,d=L,P=ot}return}xe=xe||ce,ne=ne||Q,Ae=Ae||de,(ce!==y||xe!==A)&&(n.blendEquationSeparate(be[ce],be[xe]),y=ce,A=xe),(Q!==T||de!==S||ne!==b||Ae!==w)&&(n.blendFuncSeparate(Ve[Q],Ve[de],Ve[ne],Ve[Ae]),T=Q,S=de,b=ne,w=Ae),(Se.equals(g)===!1||gt!==M)&&(n.blendColor(Se.r,Se.g,Se.b,gt),g.copy(Se),M=gt),d=L,P=!1}function Ue(L,ce){L.side===Pn?ie(n.CULL_FACE):W(n.CULL_FACE);let Q=L.side===Ht;ce&&(Q=!Q),at(Q),L.blending===Oi&&L.transparent===!1?Fe(In):Fe(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),a.setFunc(L.depthFunc),a.setTest(L.depthTest),a.setMask(L.depthWrite),s.setMask(L.colorWrite);const de=L.stencilWrite;o.setTest(de),de&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),St(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?W(n.SAMPLE_ALPHA_TO_COVERAGE):ie(n.SAMPLE_ALPHA_TO_COVERAGE)}function at(L){C!==L&&(L?n.frontFace(n.CW):n.frontFace(n.CCW),C=L)}function ut(L){L!==Ku?(W(n.CULL_FACE),L!==D&&(L===qo?n.cullFace(n.BACK):L===Ju?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):ie(n.CULL_FACE),D=L}function ht(L){L!==z&&(O&&n.lineWidth(L),z=L)}function St(L,ce,Q){L?(W(n.POLYGON_OFFSET_FILL),(Y!==ce||I!==Q)&&(Y=ce,I=Q,a.getReversed()&&(ce=-ce),n.polygonOffset(ce,Q))):ie(n.POLYGON_OFFSET_FILL)}function ft(L){L?W(n.SCISSOR_TEST):ie(n.SCISSOR_TEST)}function pt(L){L===void 0&&(L=n.TEXTURE0+H-1),te!==L&&(n.activeTexture(L),te=L)}function U(L,ce,Q){Q===void 0&&(te===null?Q=n.TEXTURE0+H-1:Q=te);let de=ee[Q];de===void 0&&(de={type:void 0,texture:void 0},ee[Q]=de),(de.type!==L||de.texture!==ce)&&(te!==Q&&(n.activeTexture(Q),te=Q),n.bindTexture(L,ce||oe[L]),de.type=L,de.texture=ce)}function Te(){const L=ee[te];L!==void 0&&L.type!==void 0&&(n.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function ye(){try{n.compressedTexImage2D(...arguments)}catch(L){Je("WebGLState:",L)}}function R(){try{n.compressedTexImage3D(...arguments)}catch(L){Je("WebGLState:",L)}}function x(){try{n.texSubImage2D(...arguments)}catch(L){Je("WebGLState:",L)}}function N(){try{n.texSubImage3D(...arguments)}catch(L){Je("WebGLState:",L)}}function k(){try{n.compressedTexSubImage2D(...arguments)}catch(L){Je("WebGLState:",L)}}function $(){try{n.compressedTexSubImage3D(...arguments)}catch(L){Je("WebGLState:",L)}}function re(){try{n.texStorage2D(...arguments)}catch(L){Je("WebGLState:",L)}}function le(){try{n.texStorage3D(...arguments)}catch(L){Je("WebGLState:",L)}}function Z(){try{n.texImage2D(...arguments)}catch(L){Je("WebGLState:",L)}}function j(){try{n.texImage3D(...arguments)}catch(L){Je("WebGLState:",L)}}function ue(L){return h[L]!==void 0?h[L]:n.getParameter(L)}function Re(L,ce){h[L]!==ce&&(n.pixelStorei(L,ce),h[L]=ce)}function pe(L){Xe.equals(L)===!1&&(n.scissor(L.x,L.y,L.z,L.w),Xe.copy(L))}function fe(L){Be.equals(L)===!1&&(n.viewport(L.x,L.y,L.z,L.w),Be.copy(L))}function Pe(L,ce){let Q=l.get(ce);Q===void 0&&(Q=new WeakMap,l.set(ce,Q));let de=Q.get(L);de===void 0&&(de=n.getUniformBlockIndex(ce,L.name),Q.set(L,de))}function Le(L,ce){const de=l.get(ce).get(L);c.get(ce)!==de&&(n.uniformBlockBinding(ce,de,L.__bindingPointIndex),c.set(ce,de))}function ke(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),u={},h={},te=null,ee={},f={},m=new WeakMap,_=[],v=null,p=!1,d=null,y=null,T=null,S=null,A=null,b=null,w=null,g=new qe(0,0,0),M=0,P=!1,C=null,D=null,z=null,Y=null,I=null,Xe.set(0,0,n.canvas.width,n.canvas.height),Be.set(0,0,n.canvas.width,n.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:W,disable:ie,bindFramebuffer:ae,drawBuffers:se,useProgram:De,setBlending:Fe,setMaterial:Ue,setFlipSided:at,setCullFace:ut,setLineWidth:ht,setPolygonOffset:St,setScissorTest:ft,activeTexture:pt,bindTexture:U,unbindTexture:Te,compressedTexImage2D:ye,compressedTexImage3D:R,texImage2D:Z,texImage3D:j,pixelStorei:Re,getParameter:ue,updateUBOMapping:Pe,uniformBlockBinding:Le,texStorage2D:re,texStorage3D:le,texSubImage2D:x,texSubImage3D:N,compressedTexSubImage2D:k,compressedTexSubImage3D:$,scissor:pe,viewport:fe,reset:ke}}function ng(n,e,t,i,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Ze,u=new WeakMap,h=new Set;let f;const m=new WeakMap;let _=!1;try{_=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(R,x){return _?new OffscreenCanvas(R,x):cs("canvas")}function p(R,x,N){let k=1;const $=ye(R);if(($.width>N||$.height>N)&&(k=N/Math.max($.width,$.height)),k<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const re=Math.floor(k*$.width),le=Math.floor(k*$.height);f===void 0&&(f=v(re,le));const Z=x?v(re,le):f;return Z.width=re,Z.height=le,Z.getContext("2d").drawImage(R,0,0,re,le),Ne("WebGLRenderer: Texture has been resized from ("+$.width+"x"+$.height+") to ("+re+"x"+le+")."),Z}else return"data"in R&&Ne("WebGLRenderer: Image in DataTexture is too big ("+$.width+"x"+$.height+")."),R;return R}function d(R){return R.generateMipmaps}function y(R){n.generateMipmap(R)}function T(R){return R.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?n.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function S(R,x,N,k,$,re=!1){if(R!==null){if(n[R]!==void 0)return n[R];Ne("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let le;k&&(le=e.get("EXT_texture_norm16"),le||Ne("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Z=x;if(x===n.RED&&(N===n.FLOAT&&(Z=n.R32F),N===n.HALF_FLOAT&&(Z=n.R16F),N===n.UNSIGNED_BYTE&&(Z=n.R8),N===n.UNSIGNED_SHORT&&le&&(Z=le.R16_EXT),N===n.SHORT&&le&&(Z=le.R16_SNORM_EXT)),x===n.RED_INTEGER&&(N===n.UNSIGNED_BYTE&&(Z=n.R8UI),N===n.UNSIGNED_SHORT&&(Z=n.R16UI),N===n.UNSIGNED_INT&&(Z=n.R32UI),N===n.BYTE&&(Z=n.R8I),N===n.SHORT&&(Z=n.R16I),N===n.INT&&(Z=n.R32I)),x===n.RG&&(N===n.FLOAT&&(Z=n.RG32F),N===n.HALF_FLOAT&&(Z=n.RG16F),N===n.UNSIGNED_BYTE&&(Z=n.RG8),N===n.UNSIGNED_SHORT&&le&&(Z=le.RG16_EXT),N===n.SHORT&&le&&(Z=le.RG16_SNORM_EXT)),x===n.RG_INTEGER&&(N===n.UNSIGNED_BYTE&&(Z=n.RG8UI),N===n.UNSIGNED_SHORT&&(Z=n.RG16UI),N===n.UNSIGNED_INT&&(Z=n.RG32UI),N===n.BYTE&&(Z=n.RG8I),N===n.SHORT&&(Z=n.RG16I),N===n.INT&&(Z=n.RG32I)),x===n.RGB_INTEGER&&(N===n.UNSIGNED_BYTE&&(Z=n.RGB8UI),N===n.UNSIGNED_SHORT&&(Z=n.RGB16UI),N===n.UNSIGNED_INT&&(Z=n.RGB32UI),N===n.BYTE&&(Z=n.RGB8I),N===n.SHORT&&(Z=n.RGB16I),N===n.INT&&(Z=n.RGB32I)),x===n.RGBA_INTEGER&&(N===n.UNSIGNED_BYTE&&(Z=n.RGBA8UI),N===n.UNSIGNED_SHORT&&(Z=n.RGBA16UI),N===n.UNSIGNED_INT&&(Z=n.RGBA32UI),N===n.BYTE&&(Z=n.RGBA8I),N===n.SHORT&&(Z=n.RGBA16I),N===n.INT&&(Z=n.RGBA32I)),x===n.RGB&&(N===n.UNSIGNED_SHORT&&le&&(Z=le.RGB16_EXT),N===n.SHORT&&le&&(Z=le.RGB16_SNORM_EXT),N===n.UNSIGNED_INT_5_9_9_9_REV&&(Z=n.RGB9_E5),N===n.UNSIGNED_INT_10F_11F_11F_REV&&(Z=n.R11F_G11F_B10F)),x===n.RGBA){const j=re?os:Ye.getTransfer($);N===n.FLOAT&&(Z=n.RGBA32F),N===n.HALF_FLOAT&&(Z=n.RGBA16F),N===n.UNSIGNED_BYTE&&(Z=j===et?n.SRGB8_ALPHA8:n.RGBA8),N===n.UNSIGNED_SHORT&&le&&(Z=le.RGBA16_EXT),N===n.SHORT&&le&&(Z=le.RGBA16_SNORM_EXT),N===n.UNSIGNED_SHORT_4_4_4_4&&(Z=n.RGBA4),N===n.UNSIGNED_SHORT_5_5_5_1&&(Z=n.RGB5_A1)}return(Z===n.R16F||Z===n.R32F||Z===n.RG16F||Z===n.RG32F||Z===n.RGBA16F||Z===n.RGBA32F)&&e.get("EXT_color_buffer_float"),Z}function A(R,x){let N;return R?x===null||x===Sn||x===hr?N=n.DEPTH24_STENCIL8:x===sn?N=n.DEPTH32F_STENCIL8:x===dr&&(N=n.DEPTH24_STENCIL8,Ne("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===Sn||x===hr?N=n.DEPTH_COMPONENT24:x===sn?N=n.DEPTH_COMPONENT32F:x===dr&&(N=n.DEPTH_COMPONENT16),N}function b(R,x){return d(R)===!0||R.isFramebufferTexture&&R.minFilter!==Pt&&R.minFilter!==Nt?Math.log2(Math.max(x.width,x.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?x.mipmaps.length:1}function w(R){const x=R.target;x.removeEventListener("dispose",w),M(x),x.isVideoTexture&&u.delete(x),x.isHTMLTexture&&h.delete(x)}function g(R){const x=R.target;x.removeEventListener("dispose",g),C(x)}function M(R){const x=i.get(R);if(x.__webglInit===void 0)return;const N=R.source,k=m.get(N);if(k){const $=k[x.__cacheKey];$.usedTimes--,$.usedTimes===0&&P(R),Object.keys(k).length===0&&m.delete(N)}i.remove(R)}function P(R){const x=i.get(R);n.deleteTexture(x.__webglTexture);const N=R.source,k=m.get(N);delete k[x.__cacheKey],a.memory.textures--}function C(R){const x=i.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),i.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let k=0;k<6;k++){if(Array.isArray(x.__webglFramebuffer[k]))for(let $=0;$<x.__webglFramebuffer[k].length;$++)n.deleteFramebuffer(x.__webglFramebuffer[k][$]);else n.deleteFramebuffer(x.__webglFramebuffer[k]);x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer[k])}else{if(Array.isArray(x.__webglFramebuffer))for(let k=0;k<x.__webglFramebuffer.length;k++)n.deleteFramebuffer(x.__webglFramebuffer[k]);else n.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&n.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let k=0;k<x.__webglColorRenderbuffer.length;k++)x.__webglColorRenderbuffer[k]&&n.deleteRenderbuffer(x.__webglColorRenderbuffer[k]);x.__webglDepthRenderbuffer&&n.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const N=R.textures;for(let k=0,$=N.length;k<$;k++){const re=i.get(N[k]);re.__webglTexture&&(n.deleteTexture(re.__webglTexture),a.memory.textures--),i.remove(N[k])}i.remove(R)}let D=0;function z(){D=0}function Y(){return D}function I(R){D=R}function H(){const R=D;return R>=r.maxTextures&&Ne("WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+r.maxTextures),D+=1,R}function O(R){const x=[];return x.push(R.wrapS),x.push(R.wrapT),x.push(R.wrapR||0),x.push(R.magFilter),x.push(R.minFilter),x.push(R.anisotropy),x.push(R.internalFormat),x.push(R.format),x.push(R.type),x.push(R.generateMipmaps),x.push(R.premultiplyAlpha),x.push(R.flipY),x.push(R.unpackAlignment),x.push(R.colorSpace),x.join()}function X(R,x){const N=i.get(R);if(R.isVideoTexture&&U(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&N.__version!==R.version){const k=R.image;if(k===null)Ne("WebGLRenderer: Texture marked for update but no image data found.");else if(k.complete===!1)Ne("WebGLRenderer: Texture marked for update but image is incomplete");else{ie(N,R,x);return}}else R.isExternalTexture&&(N.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,N.__webglTexture,n.TEXTURE0+x)}function K(R,x){const N=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&N.__version!==R.version){ie(N,R,x);return}else R.isExternalTexture&&(N.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,N.__webglTexture,n.TEXTURE0+x)}function te(R,x){const N=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&N.__version!==R.version){ie(N,R,x);return}t.bindTexture(n.TEXTURE_3D,N.__webglTexture,n.TEXTURE0+x)}function ee(R,x){const N=i.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&N.__version!==R.version){ae(N,R,x);return}t.bindTexture(n.TEXTURE_CUBE_MAP,N.__webglTexture,n.TEXTURE0+x)}const he={[ga]:n.REPEAT,[Dn]:n.CLAMP_TO_EDGE,[_a]:n.MIRRORED_REPEAT},Ie={[Pt]:n.NEAREST,[Mf]:n.NEAREST_MIPMAP_NEAREST,[Er]:n.NEAREST_MIPMAP_LINEAR,[Nt]:n.LINEAR,[Es]:n.LINEAR_MIPMAP_NEAREST,[ci]:n.LINEAR_MIPMAP_LINEAR},Xe={[Ef]:n.NEVER,[wf]:n.ALWAYS,[bf]:n.LESS,[po]:n.LEQUAL,[Tf]:n.EQUAL,[mo]:n.GEQUAL,[Af]:n.GREATER,[Rf]:n.NOTEQUAL};function Be(R,x){if(x.type===sn&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===Nt||x.magFilter===Es||x.magFilter===Er||x.magFilter===ci||x.minFilter===Nt||x.minFilter===Es||x.minFilter===Er||x.minFilter===ci)&&Ne("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(R,n.TEXTURE_WRAP_S,he[x.wrapS]),n.texParameteri(R,n.TEXTURE_WRAP_T,he[x.wrapT]),(R===n.TEXTURE_3D||R===n.TEXTURE_2D_ARRAY)&&n.texParameteri(R,n.TEXTURE_WRAP_R,he[x.wrapR]),n.texParameteri(R,n.TEXTURE_MAG_FILTER,Ie[x.magFilter]),n.texParameteri(R,n.TEXTURE_MIN_FILTER,Ie[x.minFilter]),x.compareFunction&&(n.texParameteri(R,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(R,n.TEXTURE_COMPARE_FUNC,Xe[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Pt||x.minFilter!==Er&&x.minFilter!==ci||x.type===sn&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||i.get(x).__currentAnisotropy){const N=e.get("EXT_texture_filter_anisotropic");n.texParameterf(R,N.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,r.getMaxAnisotropy())),i.get(x).__currentAnisotropy=x.anisotropy}}}function J(R,x){let N=!1;R.__webglInit===void 0&&(R.__webglInit=!0,x.addEventListener("dispose",w));const k=x.source;let $=m.get(k);$===void 0&&($={},m.set(k,$));const re=O(x);if(re!==R.__cacheKey){$[re]===void 0&&($[re]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,N=!0),$[re].usedTimes++;const le=$[R.__cacheKey];le!==void 0&&($[R.__cacheKey].usedTimes--,le.usedTimes===0&&P(x)),R.__cacheKey=re,R.__webglTexture=$[re].texture}return N}function oe(R,x,N){return Math.floor(Math.floor(R/N)/x)}function W(R,x,N,k){const re=R.updateRanges;if(re.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,x.width,x.height,N,k,x.data);else{re.sort((Re,pe)=>Re.start-pe.start);let le=0;for(let Re=1;Re<re.length;Re++){const pe=re[le],fe=re[Re],Pe=pe.start+pe.count,Le=oe(fe.start,x.width,4),ke=oe(pe.start,x.width,4);fe.start<=Pe+1&&Le===ke&&oe(fe.start+fe.count-1,x.width,4)===Le?pe.count=Math.max(pe.count,fe.start+fe.count-pe.start):(++le,re[le]=fe)}re.length=le+1;const Z=t.getParameter(n.UNPACK_ROW_LENGTH),j=t.getParameter(n.UNPACK_SKIP_PIXELS),ue=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,x.width);for(let Re=0,pe=re.length;Re<pe;Re++){const fe=re[Re],Pe=Math.floor(fe.start/4),Le=Math.ceil(fe.count/4),ke=Pe%x.width,L=Math.floor(Pe/x.width),ce=Le,Q=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,ke),t.pixelStorei(n.UNPACK_SKIP_ROWS,L),t.texSubImage2D(n.TEXTURE_2D,0,ke,L,ce,Q,N,k,x.data)}R.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,Z),t.pixelStorei(n.UNPACK_SKIP_PIXELS,j),t.pixelStorei(n.UNPACK_SKIP_ROWS,ue)}}function ie(R,x,N){let k=n.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(k=n.TEXTURE_2D_ARRAY),x.isData3DTexture&&(k=n.TEXTURE_3D);const $=J(R,x),re=x.source;t.bindTexture(k,R.__webglTexture,n.TEXTURE0+N);const le=i.get(re);if(re.version!==le.__version||$===!0){if(t.activeTexture(n.TEXTURE0+N),(typeof ImageBitmap<"u"&&x.image instanceof ImageBitmap)===!1){const Q=Ye.getPrimaries(Ye.workingColorSpace),de=x.colorSpace===Zn?null:Ye.getPrimaries(x.colorSpace),xe=x.colorSpace===Zn||Q===de?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,xe)}t.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment);let j=p(x.image,!1,r.maxTextureSize);j=Te(x,j);const ue=s.convert(x.format,x.colorSpace),Re=s.convert(x.type);let pe=S(x.internalFormat,ue,Re,x.normalized,x.colorSpace,x.isVideoTexture);Be(k,x);let fe;const Pe=x.mipmaps,Le=x.isVideoTexture!==!0,ke=le.__version===void 0||$===!0,L=re.dataReady,ce=b(x,j);if(x.isDepthTexture)pe=A(x.format===li,x.type),ke&&(Le?t.texStorage2D(n.TEXTURE_2D,1,pe,j.width,j.height):t.texImage2D(n.TEXTURE_2D,0,pe,j.width,j.height,0,ue,Re,null));else if(x.isDataTexture)if(Pe.length>0){Le&&ke&&t.texStorage2D(n.TEXTURE_2D,ce,pe,Pe[0].width,Pe[0].height);for(let Q=0,de=Pe.length;Q<de;Q++)fe=Pe[Q],Le?L&&t.texSubImage2D(n.TEXTURE_2D,Q,0,0,fe.width,fe.height,ue,Re,fe.data):t.texImage2D(n.TEXTURE_2D,Q,pe,fe.width,fe.height,0,ue,Re,fe.data);x.generateMipmaps=!1}else Le?(ke&&t.texStorage2D(n.TEXTURE_2D,ce,pe,j.width,j.height),L&&W(x,j,ue,Re)):t.texImage2D(n.TEXTURE_2D,0,pe,j.width,j.height,0,ue,Re,j.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){Le&&ke&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ce,pe,Pe[0].width,Pe[0].height,j.depth);for(let Q=0,de=Pe.length;Q<de;Q++)if(fe=Pe[Q],x.format!==an)if(ue!==null)if(Le){if(L)if(x.layerUpdates.size>0){const xe=bc(fe.width,fe.height,x.format,x.type);for(const ne of x.layerUpdates){const Ae=fe.data.subarray(ne*xe/fe.data.BYTES_PER_ELEMENT,(ne+1)*xe/fe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,ne,fe.width,fe.height,1,ue,Ae)}x.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,0,fe.width,fe.height,j.depth,ue,fe.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,Q,pe,fe.width,fe.height,j.depth,0,fe.data,0,0);else Ne("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Le?L&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,0,fe.width,fe.height,j.depth,ue,Re,fe.data):t.texImage3D(n.TEXTURE_2D_ARRAY,Q,pe,fe.width,fe.height,j.depth,0,ue,Re,fe.data)}else{Le&&ke&&t.texStorage2D(n.TEXTURE_2D,ce,pe,Pe[0].width,Pe[0].height);for(let Q=0,de=Pe.length;Q<de;Q++)fe=Pe[Q],x.format!==an?ue!==null?Le?L&&t.compressedTexSubImage2D(n.TEXTURE_2D,Q,0,0,fe.width,fe.height,ue,fe.data):t.compressedTexImage2D(n.TEXTURE_2D,Q,pe,fe.width,fe.height,0,fe.data):Ne("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Le?L&&t.texSubImage2D(n.TEXTURE_2D,Q,0,0,fe.width,fe.height,ue,Re,fe.data):t.texImage2D(n.TEXTURE_2D,Q,pe,fe.width,fe.height,0,ue,Re,fe.data)}else if(x.isDataArrayTexture)if(Le){if(ke&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ce,pe,j.width,j.height,j.depth),L)if(x.layerUpdates.size>0){const Q=bc(j.width,j.height,x.format,x.type);for(const de of x.layerUpdates){const xe=j.data.subarray(de*Q/j.data.BYTES_PER_ELEMENT,(de+1)*Q/j.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,de,j.width,j.height,1,ue,Re,xe)}x.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,j.width,j.height,j.depth,ue,Re,j.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,pe,j.width,j.height,j.depth,0,ue,Re,j.data);else if(x.isData3DTexture)Le?(ke&&t.texStorage3D(n.TEXTURE_3D,ce,pe,j.width,j.height,j.depth),L&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,j.width,j.height,j.depth,ue,Re,j.data)):t.texImage3D(n.TEXTURE_3D,0,pe,j.width,j.height,j.depth,0,ue,Re,j.data);else if(x.isFramebufferTexture){if(ke)if(Le)t.texStorage2D(n.TEXTURE_2D,ce,pe,j.width,j.height);else{let Q=j.width,de=j.height;for(let xe=0;xe<ce;xe++)t.texImage2D(n.TEXTURE_2D,xe,pe,Q,de,0,ue,Re,null),Q>>=1,de>>=1}}else if(x.isHTMLTexture){if("texElementImage2D"in n){const Q=n.canvas;if(Q.hasAttribute("layoutsubtree")||Q.setAttribute("layoutsubtree","true"),j.parentNode!==Q){Q.appendChild(j),h.add(x),Q.onpaint=de=>{const xe=de.changedElements;for(const ne of h)xe.includes(ne.image)&&(ne.needsUpdate=!0)},Q.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,j);else{const xe=n.RGBA,ne=n.RGBA,Ae=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,xe,ne,Ae,j)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(Pe.length>0){if(Le&&ke){const Q=ye(Pe[0]);t.texStorage2D(n.TEXTURE_2D,ce,pe,Q.width,Q.height)}for(let Q=0,de=Pe.length;Q<de;Q++)fe=Pe[Q],Le?L&&t.texSubImage2D(n.TEXTURE_2D,Q,0,0,ue,Re,fe):t.texImage2D(n.TEXTURE_2D,Q,pe,ue,Re,fe);x.generateMipmaps=!1}else if(Le){if(ke){const Q=ye(j);t.texStorage2D(n.TEXTURE_2D,ce,pe,Q.width,Q.height)}L&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ue,Re,j)}else t.texImage2D(n.TEXTURE_2D,0,pe,ue,Re,j);d(x)&&y(k),le.__version=re.version,x.onUpdate&&x.onUpdate(x)}R.__version=x.version}function ae(R,x,N){if(x.image.length!==6)return;const k=J(R,x),$=x.source;t.bindTexture(n.TEXTURE_CUBE_MAP,R.__webglTexture,n.TEXTURE0+N);const re=i.get($);if($.version!==re.__version||k===!0){t.activeTexture(n.TEXTURE0+N);const le=Ye.getPrimaries(Ye.workingColorSpace),Z=x.colorSpace===Zn?null:Ye.getPrimaries(x.colorSpace),j=x.colorSpace===Zn||le===Z?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,j);const ue=x.isCompressedTexture||x.image[0].isCompressedTexture,Re=x.image[0]&&x.image[0].isDataTexture,pe=[];for(let ne=0;ne<6;ne++)!ue&&!Re?pe[ne]=p(x.image[ne],!0,r.maxCubemapSize):pe[ne]=Re?x.image[ne].image:x.image[ne],pe[ne]=Te(x,pe[ne]);const fe=pe[0],Pe=s.convert(x.format,x.colorSpace),Le=s.convert(x.type),ke=S(x.internalFormat,Pe,Le,x.normalized,x.colorSpace),L=x.isVideoTexture!==!0,ce=re.__version===void 0||k===!0,Q=$.dataReady;let de=b(x,fe);Be(n.TEXTURE_CUBE_MAP,x);let xe;if(ue){L&&ce&&t.texStorage2D(n.TEXTURE_CUBE_MAP,de,ke,fe.width,fe.height);for(let ne=0;ne<6;ne++){xe=pe[ne].mipmaps;for(let Ae=0;Ae<xe.length;Ae++){const Se=xe[Ae];x.format!==an?Pe!==null?L?Q&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,Ae,0,0,Se.width,Se.height,Pe,Se.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,Ae,ke,Se.width,Se.height,0,Se.data):Ne("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?Q&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,Ae,0,0,Se.width,Se.height,Pe,Le,Se.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,Ae,ke,Se.width,Se.height,0,Pe,Le,Se.data)}}}else{if(xe=x.mipmaps,L&&ce){xe.length>0&&de++;const ne=ye(pe[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,de,ke,ne.width,ne.height)}for(let ne=0;ne<6;ne++)if(Re){L?Q&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,0,0,pe[ne].width,pe[ne].height,Pe,Le,pe[ne].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,ke,pe[ne].width,pe[ne].height,0,Pe,Le,pe[ne].data);for(let Ae=0;Ae<xe.length;Ae++){const gt=xe[Ae].image[ne].image;L?Q&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,Ae+1,0,0,gt.width,gt.height,Pe,Le,gt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,Ae+1,ke,gt.width,gt.height,0,Pe,Le,gt.data)}}else{L?Q&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,0,0,Pe,Le,pe[ne]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0,ke,Pe,Le,pe[ne]);for(let Ae=0;Ae<xe.length;Ae++){const Se=xe[Ae];L?Q&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,Ae+1,0,0,Pe,Le,Se.image[ne]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,Ae+1,ke,Pe,Le,Se.image[ne])}}}d(x)&&y(n.TEXTURE_CUBE_MAP),re.__version=$.version,x.onUpdate&&x.onUpdate(x)}R.__version=x.version}function se(R,x,N,k,$,re){const le=s.convert(N.format,N.colorSpace),Z=s.convert(N.type),j=S(N.internalFormat,le,Z,N.normalized,N.colorSpace),ue=i.get(x),Re=i.get(N);if(Re.__renderTarget=x,!ue.__hasExternalTextures){const pe=Math.max(1,x.width>>re),fe=Math.max(1,x.height>>re);$===n.TEXTURE_3D||$===n.TEXTURE_2D_ARRAY?t.texImage3D($,re,j,pe,fe,x.depth,0,le,Z,null):t.texImage2D($,re,j,pe,fe,0,le,Z,null)}t.bindFramebuffer(n.FRAMEBUFFER,R),pt(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,k,$,Re.__webglTexture,0,ft(x)):($===n.TEXTURE_2D||$>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&$<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,k,$,Re.__webglTexture,re),t.bindFramebuffer(n.FRAMEBUFFER,null)}function De(R,x,N){if(n.bindRenderbuffer(n.RENDERBUFFER,R),x.depthBuffer){const k=x.depthTexture,$=k&&k.isDepthTexture?k.type:null,re=A(x.stencilBuffer,$),le=x.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;pt(x)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ft(x),re,x.width,x.height):N?n.renderbufferStorageMultisample(n.RENDERBUFFER,ft(x),re,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,re,x.width,x.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,le,n.RENDERBUFFER,R)}else{const k=x.textures;for(let $=0;$<k.length;$++){const re=k[$],le=s.convert(re.format,re.colorSpace),Z=s.convert(re.type),j=S(re.internalFormat,le,Z,re.normalized,re.colorSpace);pt(x)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ft(x),j,x.width,x.height):N?n.renderbufferStorageMultisample(n.RENDERBUFFER,ft(x),j,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,j,x.width,x.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function be(R,x,N){const k=x.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,R),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const $=i.get(x.depthTexture);if($.__renderTarget=x,(!$.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),k){if($.__webglInit===void 0&&($.__webglInit=!0,x.depthTexture.addEventListener("dispose",w)),$.__webglTexture===void 0){$.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,$.__webglTexture),Be(n.TEXTURE_CUBE_MAP,x.depthTexture);const ue=s.convert(x.depthTexture.format),Re=s.convert(x.depthTexture.type);let pe;x.depthTexture.format===Nn?pe=n.DEPTH_COMPONENT24:x.depthTexture.format===li&&(pe=n.DEPTH24_STENCIL8);for(let fe=0;fe<6;fe++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0,pe,x.width,x.height,0,ue,Re,null)}}else X(x.depthTexture,0);const re=$.__webglTexture,le=ft(x),Z=k?n.TEXTURE_CUBE_MAP_POSITIVE_X+N:n.TEXTURE_2D,j=x.depthTexture.format===li?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(x.depthTexture.format===Nn)pt(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,j,Z,re,0,le):n.framebufferTexture2D(n.FRAMEBUFFER,j,Z,re,0);else if(x.depthTexture.format===li)pt(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,j,Z,re,0,le):n.framebufferTexture2D(n.FRAMEBUFFER,j,Z,re,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Ve(R){const x=i.get(R),N=R.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==R.depthTexture){const k=R.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),k){const $=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,k.removeEventListener("dispose",$)};k.addEventListener("dispose",$),x.__depthDisposeCallback=$}x.__boundDepthTexture=k}if(R.depthTexture&&!x.__autoAllocateDepthBuffer)if(N)for(let k=0;k<6;k++)be(x.__webglFramebuffer[k],R,k);else{const k=R.texture.mipmaps;k&&k.length>0?be(x.__webglFramebuffer[0],R,0):be(x.__webglFramebuffer,R,0)}else if(N){x.__webglDepthbuffer=[];for(let k=0;k<6;k++)if(t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[k]),x.__webglDepthbuffer[k]===void 0)x.__webglDepthbuffer[k]=n.createRenderbuffer(),De(x.__webglDepthbuffer[k],R,!1);else{const $=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,re=x.__webglDepthbuffer[k];n.bindRenderbuffer(n.RENDERBUFFER,re),n.framebufferRenderbuffer(n.FRAMEBUFFER,$,n.RENDERBUFFER,re)}}else{const k=R.texture.mipmaps;if(k&&k.length>0?t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=n.createRenderbuffer(),De(x.__webglDepthbuffer,R,!1);else{const $=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,re=x.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,re),n.framebufferRenderbuffer(n.FRAMEBUFFER,$,n.RENDERBUFFER,re)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Fe(R,x,N){const k=i.get(R);x!==void 0&&se(k.__webglFramebuffer,R,R.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),N!==void 0&&Ve(R)}function Ue(R){const x=R.texture,N=i.get(R),k=i.get(x);R.addEventListener("dispose",g);const $=R.textures,re=R.isWebGLCubeRenderTarget===!0,le=$.length>1;if(le||(k.__webglTexture===void 0&&(k.__webglTexture=n.createTexture()),k.__version=x.version,a.memory.textures++),re){N.__webglFramebuffer=[];for(let Z=0;Z<6;Z++)if(x.mipmaps&&x.mipmaps.length>0){N.__webglFramebuffer[Z]=[];for(let j=0;j<x.mipmaps.length;j++)N.__webglFramebuffer[Z][j]=n.createFramebuffer()}else N.__webglFramebuffer[Z]=n.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){N.__webglFramebuffer=[];for(let Z=0;Z<x.mipmaps.length;Z++)N.__webglFramebuffer[Z]=n.createFramebuffer()}else N.__webglFramebuffer=n.createFramebuffer();if(le)for(let Z=0,j=$.length;Z<j;Z++){const ue=i.get($[Z]);ue.__webglTexture===void 0&&(ue.__webglTexture=n.createTexture(),a.memory.textures++)}if(R.samples>0&&pt(R)===!1){N.__webglMultisampledFramebuffer=n.createFramebuffer(),N.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,N.__webglMultisampledFramebuffer);for(let Z=0;Z<$.length;Z++){const j=$[Z];N.__webglColorRenderbuffer[Z]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,N.__webglColorRenderbuffer[Z]);const ue=s.convert(j.format,j.colorSpace),Re=s.convert(j.type),pe=S(j.internalFormat,ue,Re,j.normalized,j.colorSpace,R.isXRRenderTarget===!0),fe=ft(R);n.renderbufferStorageMultisample(n.RENDERBUFFER,fe,pe,R.width,R.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Z,n.RENDERBUFFER,N.__webglColorRenderbuffer[Z])}n.bindRenderbuffer(n.RENDERBUFFER,null),R.depthBuffer&&(N.__webglDepthRenderbuffer=n.createRenderbuffer(),De(N.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(re){t.bindTexture(n.TEXTURE_CUBE_MAP,k.__webglTexture),Be(n.TEXTURE_CUBE_MAP,x);for(let Z=0;Z<6;Z++)if(x.mipmaps&&x.mipmaps.length>0)for(let j=0;j<x.mipmaps.length;j++)se(N.__webglFramebuffer[Z][j],R,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,j);else se(N.__webglFramebuffer[Z],R,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0);d(x)&&y(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(le){for(let Z=0,j=$.length;Z<j;Z++){const ue=$[Z],Re=i.get(ue);let pe=n.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(pe=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(pe,Re.__webglTexture),Be(pe,ue),se(N.__webglFramebuffer,R,ue,n.COLOR_ATTACHMENT0+Z,pe,0),d(ue)&&y(pe)}t.unbindTexture()}else{let Z=n.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(Z=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Z,k.__webglTexture),Be(Z,x),x.mipmaps&&x.mipmaps.length>0)for(let j=0;j<x.mipmaps.length;j++)se(N.__webglFramebuffer[j],R,x,n.COLOR_ATTACHMENT0,Z,j);else se(N.__webglFramebuffer,R,x,n.COLOR_ATTACHMENT0,Z,0);d(x)&&y(Z),t.unbindTexture()}R.depthBuffer&&Ve(R)}function at(R){const x=R.textures;for(let N=0,k=x.length;N<k;N++){const $=x[N];if(d($)){const re=T(R),le=i.get($).__webglTexture;t.bindTexture(re,le),y(re),t.unbindTexture()}}}const ut=[],ht=[];function St(R){if(R.samples>0){if(pt(R)===!1){const x=R.textures,N=R.width,k=R.height;let $=n.COLOR_BUFFER_BIT;const re=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,le=i.get(R),Z=x.length>1;if(Z)for(let ue=0;ue<x.length;ue++)t.bindFramebuffer(n.FRAMEBUFFER,le.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ue,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,le.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ue,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,le.__webglMultisampledFramebuffer);const j=R.texture.mipmaps;j&&j.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,le.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,le.__webglFramebuffer);for(let ue=0;ue<x.length;ue++){if(R.resolveDepthBuffer&&(R.depthBuffer&&($|=n.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&($|=n.STENCIL_BUFFER_BIT)),Z){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,le.__webglColorRenderbuffer[ue]);const Re=i.get(x[ue]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Re,0)}n.blitFramebuffer(0,0,N,k,0,0,N,k,$,n.NEAREST),c===!0&&(ut.length=0,ht.length=0,ut.push(n.COLOR_ATTACHMENT0+ue),R.depthBuffer&&R.resolveDepthBuffer===!1&&(ut.push(re),ht.push(re),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,ht)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,ut))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Z)for(let ue=0;ue<x.length;ue++){t.bindFramebuffer(n.FRAMEBUFFER,le.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ue,n.RENDERBUFFER,le.__webglColorRenderbuffer[ue]);const Re=i.get(x[ue]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,le.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ue,n.TEXTURE_2D,Re,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,le.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&c){const x=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[x])}}}function ft(R){return Math.min(r.maxSamples,R.samples)}function pt(R){const x=i.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function U(R){const x=a.render.frame;u.get(R)!==x&&(u.set(R,x),R.update())}function Te(R,x){const N=R.colorSpace,k=R.format,$=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||N!==as&&N!==Zn&&(Ye.getTransfer(N)===et?(k!==an||$!==$t)&&Ne("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Je("WebGLTextures: Unsupported texture color space:",N)),x}function ye(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(l.width=R.naturalWidth||R.width,l.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(l.width=R.displayWidth,l.height=R.displayHeight):(l.width=R.width,l.height=R.height),l}this.allocateTextureUnit=H,this.resetTextureUnits=z,this.getTextureUnits=Y,this.setTextureUnits=I,this.setTexture2D=X,this.setTexture2DArray=K,this.setTexture3D=te,this.setTextureCube=ee,this.rebindTextures=Fe,this.setupRenderTarget=Ue,this.updateRenderTargetMipmap=at,this.updateMultisampleRenderTarget=St,this.setupDepthRenderbuffer=Ve,this.setupFrameBufferTexture=se,this.useMultisampledRTT=pt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function ig(n,e){function t(i,r=Zn){let s;const a=Ye.getTransfer(r);if(i===$t)return n.UNSIGNED_BYTE;if(i===oo)return n.UNSIGNED_SHORT_4_4_4_4;if(i===co)return n.UNSIGNED_SHORT_5_5_5_1;if(i===yl)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===El)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Ml)return n.BYTE;if(i===Sl)return n.SHORT;if(i===dr)return n.UNSIGNED_SHORT;if(i===ao)return n.INT;if(i===Sn)return n.UNSIGNED_INT;if(i===sn)return n.FLOAT;if(i===Un)return n.HALF_FLOAT;if(i===bl)return n.ALPHA;if(i===Tl)return n.RGB;if(i===an)return n.RGBA;if(i===Nn)return n.DEPTH_COMPONENT;if(i===li)return n.DEPTH_STENCIL;if(i===lo)return n.RED;if(i===uo)return n.RED_INTEGER;if(i===di)return n.RG;if(i===fo)return n.RG_INTEGER;if(i===ho)return n.RGBA_INTEGER;if(i===Jr||i===Qr||i===jr||i===es)if(a===et)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Jr)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Qr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===jr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===es)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Jr)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Qr)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===jr)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===es)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===xa||i===va||i===Ma||i===Sa)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===xa)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===va)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Ma)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Sa)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===ya||i===Ea||i===ba||i===Ta||i===Aa||i===rs||i===Ra)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===ya||i===Ea)return a===et?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===ba)return a===et?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(i===Ta)return s.COMPRESSED_R11_EAC;if(i===Aa)return s.COMPRESSED_SIGNED_R11_EAC;if(i===rs)return s.COMPRESSED_RG11_EAC;if(i===Ra)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===wa||i===Ca||i===Pa||i===Da||i===Ia||i===La||i===Ua||i===Na||i===Fa||i===Oa||i===Ba||i===ka||i===za||i===Ga)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===wa)return a===et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Ca)return a===et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Pa)return a===et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Da)return a===et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ia)return a===et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===La)return a===et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Ua)return a===et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Na)return a===et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Fa)return a===et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Oa)return a===et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Ba)return a===et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===ka)return a===et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===za)return a===et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Ga)return a===et?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Va||i===Ha||i===Wa)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===Va)return a===et?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Ha)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Wa)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Xa||i===qa||i===ss||i===Ya)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===Xa)return s.COMPRESSED_RED_RGTC1_EXT;if(i===qa)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===ss)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Ya)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===hr?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const rg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,sg=`
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

}`;class ag{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new Nl(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new yn({vertexShader:rg,fragmentShader:sg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new lt(new hs(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class og extends pi{constructor(e,t){super();const i=this;let r=null,s=1,a=null,o="local-floor",c=1,l=null,u=null,h=null,f=null,m=null,_=null;const v=typeof XRWebGLBinding<"u",p=new ag,d={},y=t.getContextAttributes();let T=null,S=null;const A=[],b=[],w=new Ze;let g=null;const M=new nn;M.viewport=new mt;const P=new nn;P.viewport=new mt;const C=[M,P],D=new _d;let z=null,Y=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let oe=A[J];return oe===void 0&&(oe=new Ds,A[J]=oe),oe.getTargetRaySpace()},this.getControllerGrip=function(J){let oe=A[J];return oe===void 0&&(oe=new Ds,A[J]=oe),oe.getGripSpace()},this.getHand=function(J){let oe=A[J];return oe===void 0&&(oe=new Ds,A[J]=oe),oe.getHandSpace()};function I(J){const oe=b.indexOf(J.inputSource);if(oe===-1)return;const W=A[oe];W!==void 0&&(W.update(J.inputSource,J.frame,l||a),W.dispatchEvent({type:J.type,data:J.inputSource}))}function H(){r.removeEventListener("select",I),r.removeEventListener("selectstart",I),r.removeEventListener("selectend",I),r.removeEventListener("squeeze",I),r.removeEventListener("squeezestart",I),r.removeEventListener("squeezeend",I),r.removeEventListener("end",H),r.removeEventListener("inputsourceschange",O);for(let J=0;J<A.length;J++){const oe=b[J];oe!==null&&(b[J]=null,A[J].disconnect(oe))}z=null,Y=null,p.reset();for(const J in d)delete d[J];e.setRenderTarget(T),m=null,f=null,h=null,r=null,S=null,Be.stop(),i.isPresenting=!1,e.setPixelRatio(g),e.setSize(w.width,w.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){s=J,i.isPresenting===!0&&Ne("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){o=J,i.isPresenting===!0&&Ne("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(J){l=J},this.getBaseLayer=function(){return f!==null?f:m},this.getBinding=function(){return h===null&&v&&(h=new XRWebGLBinding(r,t)),h},this.getFrame=function(){return _},this.getSession=function(){return r},this.setSession=async function(J){if(r=J,r!==null){if(T=e.getRenderTarget(),r.addEventListener("select",I),r.addEventListener("selectstart",I),r.addEventListener("selectend",I),r.addEventListener("squeeze",I),r.addEventListener("squeezestart",I),r.addEventListener("squeezeend",I),r.addEventListener("end",H),r.addEventListener("inputsourceschange",O),y.xrCompatible!==!0&&await t.makeXRCompatible(),g=e.getPixelRatio(),e.getSize(w),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let W=null,ie=null,ae=null;y.depth&&(ae=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,W=y.stencil?li:Nn,ie=y.stencil?hr:Sn);const se={colorFormat:t.RGBA8,depthFormat:ae,scaleFactor:s};h=this.getBinding(),f=h.createProjectionLayer(se),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),S=new Mn(f.textureWidth,f.textureHeight,{format:an,type:$t,depthTexture:new Wi(f.textureWidth,f.textureHeight,ie,void 0,void 0,void 0,void 0,void 0,void 0,W),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const W={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:s};m=new XRWebGLLayer(r,t,W),r.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),S=new Mn(m.framebufferWidth,m.framebufferHeight,{format:an,type:$t,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await r.requestReferenceSpace(o),Be.setContext(r),Be.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function O(J){for(let oe=0;oe<J.removed.length;oe++){const W=J.removed[oe],ie=b.indexOf(W);ie>=0&&(b[ie]=null,A[ie].disconnect(W))}for(let oe=0;oe<J.added.length;oe++){const W=J.added[oe];let ie=b.indexOf(W);if(ie===-1){for(let se=0;se<A.length;se++)if(se>=b.length){b.push(W),ie=se;break}else if(b[se]===null){b[se]=W,ie=se;break}if(ie===-1)break}const ae=A[ie];ae&&ae.connect(W)}}const X=new B,K=new B;function te(J,oe,W){X.setFromMatrixPosition(oe.matrixWorld),K.setFromMatrixPosition(W.matrixWorld);const ie=X.distanceTo(K),ae=oe.projectionMatrix.elements,se=W.projectionMatrix.elements,De=ae[14]/(ae[10]-1),be=ae[14]/(ae[10]+1),Ve=(ae[9]+1)/ae[5],Fe=(ae[9]-1)/ae[5],Ue=(ae[8]-1)/ae[0],at=(se[8]+1)/se[0],ut=De*Ue,ht=De*at,St=ie/(-Ue+at),ft=St*-Ue;if(oe.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(ft),J.translateZ(St),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),ae[10]===-1)J.projectionMatrix.copy(oe.projectionMatrix),J.projectionMatrixInverse.copy(oe.projectionMatrixInverse);else{const pt=De+St,U=be+St,Te=ut-ft,ye=ht+(ie-ft),R=Ve*be/U*pt,x=Fe*be/U*pt;J.projectionMatrix.makePerspective(Te,ye,R,x,pt,U),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function ee(J,oe){oe===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(oe.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(r===null)return;let oe=J.near,W=J.far;p.texture!==null&&(p.depthNear>0&&(oe=p.depthNear),p.depthFar>0&&(W=p.depthFar)),D.near=P.near=M.near=oe,D.far=P.far=M.far=W,(z!==D.near||Y!==D.far)&&(r.updateRenderState({depthNear:D.near,depthFar:D.far}),z=D.near,Y=D.far),D.layers.mask=J.layers.mask|6,M.layers.mask=D.layers.mask&-5,P.layers.mask=D.layers.mask&-3;const ie=J.parent,ae=D.cameras;ee(D,ie);for(let se=0;se<ae.length;se++)ee(ae[se],ie);ae.length===2?te(D,M,P):D.projectionMatrix.copy(M.projectionMatrix),he(J,D,ie)};function he(J,oe,W){W===null?J.matrix.copy(oe.matrixWorld):(J.matrix.copy(W.matrixWorld),J.matrix.invert(),J.matrix.multiply(oe.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(oe.projectionMatrix),J.projectionMatrixInverse.copy(oe.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=Za*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return D},this.getFoveation=function(){if(!(f===null&&m===null))return c},this.setFoveation=function(J){c=J,f!==null&&(f.fixedFoveation=J),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=J)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(D)},this.getCameraTexture=function(J){return d[J]};let Ie=null;function Xe(J,oe){if(u=oe.getViewerPose(l||a),_=oe,u!==null){const W=u.views;m!==null&&(e.setRenderTargetFramebuffer(S,m.framebuffer),e.setRenderTarget(S));let ie=!1;W.length!==D.cameras.length&&(D.cameras.length=0,ie=!0);for(let be=0;be<W.length;be++){const Ve=W[be];let Fe=null;if(m!==null)Fe=m.getViewport(Ve);else{const at=h.getViewSubImage(f,Ve);Fe=at.viewport,be===0&&(e.setRenderTargetTextures(S,at.colorTexture,at.depthStencilTexture),e.setRenderTarget(S))}let Ue=C[be];Ue===void 0&&(Ue=new nn,Ue.layers.enable(be),Ue.viewport=new mt,C[be]=Ue),Ue.matrix.fromArray(Ve.transform.matrix),Ue.matrix.decompose(Ue.position,Ue.quaternion,Ue.scale),Ue.projectionMatrix.fromArray(Ve.projectionMatrix),Ue.projectionMatrixInverse.copy(Ue.projectionMatrix).invert(),Ue.viewport.set(Fe.x,Fe.y,Fe.width,Fe.height),be===0&&(D.matrix.copy(Ue.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale)),ie===!0&&D.cameras.push(Ue)}const ae=r.enabledFeatures;if(ae&&ae.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&v){h=i.getBinding();const be=h.getDepthInformation(W[0]);be&&be.isValid&&be.texture&&p.init(be,r.renderState)}if(ae&&ae.includes("camera-access")&&v){e.state.unbindTexture(),h=i.getBinding();for(let be=0;be<W.length;be++){const Ve=W[be].camera;if(Ve){let Fe=d[Ve];Fe||(Fe=new Nl,d[Ve]=Fe);const Ue=h.getCameraImage(Ve);Fe.sourceTexture=Ue}}}}for(let W=0;W<A.length;W++){const ie=b[W],ae=A[W];ie!==null&&ae!==void 0&&ae.update(ie,oe,l||a)}Ie&&Ie(J,oe),oe.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:oe}),_=null}const Be=new Bl;Be.setAnimationLoop(Xe),this.setAnimationLoop=function(J){Ie=J},this.dispose=function(){}}}const cg=new dt,Xl=new Oe;Xl.set(-1,0,0,0,1,0,0,0,1);function lg(n,e){function t(p,d){p.matrixAutoUpdate===!0&&p.updateMatrix(),d.value.copy(p.matrix)}function i(p,d){d.color.getRGB(p.fogColor.value,Fl(n)),d.isFog?(p.fogNear.value=d.near,p.fogFar.value=d.far):d.isFogExp2&&(p.fogDensity.value=d.density)}function r(p,d,y,T,S){d.isNodeMaterial?d.uniformsNeedUpdate=!1:d.isMeshBasicMaterial?s(p,d):d.isMeshLambertMaterial?(s(p,d),d.envMap&&(p.envMapIntensity.value=d.envMapIntensity)):d.isMeshToonMaterial?(s(p,d),h(p,d)):d.isMeshPhongMaterial?(s(p,d),u(p,d),d.envMap&&(p.envMapIntensity.value=d.envMapIntensity)):d.isMeshStandardMaterial?(s(p,d),f(p,d),d.isMeshPhysicalMaterial&&m(p,d,S)):d.isMeshMatcapMaterial?(s(p,d),_(p,d)):d.isMeshDepthMaterial?s(p,d):d.isMeshDistanceMaterial?(s(p,d),v(p,d)):d.isMeshNormalMaterial?s(p,d):d.isLineBasicMaterial?(a(p,d),d.isLineDashedMaterial&&o(p,d)):d.isPointsMaterial?c(p,d,y,T):d.isSpriteMaterial?l(p,d):d.isShadowMaterial?(p.color.value.copy(d.color),p.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function s(p,d){p.opacity.value=d.opacity,d.color&&p.diffuse.value.copy(d.color),d.emissive&&p.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(p.map.value=d.map,t(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,t(d.alphaMap,p.alphaMapTransform)),d.bumpMap&&(p.bumpMap.value=d.bumpMap,t(d.bumpMap,p.bumpMapTransform),p.bumpScale.value=d.bumpScale,d.side===Ht&&(p.bumpScale.value*=-1)),d.normalMap&&(p.normalMap.value=d.normalMap,t(d.normalMap,p.normalMapTransform),p.normalScale.value.copy(d.normalScale),d.side===Ht&&p.normalScale.value.negate()),d.displacementMap&&(p.displacementMap.value=d.displacementMap,t(d.displacementMap,p.displacementMapTransform),p.displacementScale.value=d.displacementScale,p.displacementBias.value=d.displacementBias),d.emissiveMap&&(p.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,p.emissiveMapTransform)),d.specularMap&&(p.specularMap.value=d.specularMap,t(d.specularMap,p.specularMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest);const y=e.get(d),T=y.envMap,S=y.envMapRotation;T&&(p.envMap.value=T,p.envMapRotation.value.setFromMatrix4(cg.makeRotationFromEuler(S)).transpose(),T.isCubeTexture&&T.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(Xl),p.reflectivity.value=d.reflectivity,p.ior.value=d.ior,p.refractionRatio.value=d.refractionRatio),d.lightMap&&(p.lightMap.value=d.lightMap,p.lightMapIntensity.value=d.lightMapIntensity,t(d.lightMap,p.lightMapTransform)),d.aoMap&&(p.aoMap.value=d.aoMap,p.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,p.aoMapTransform))}function a(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,d.map&&(p.map.value=d.map,t(d.map,p.mapTransform))}function o(p,d){p.dashSize.value=d.dashSize,p.totalSize.value=d.dashSize+d.gapSize,p.scale.value=d.scale}function c(p,d,y,T){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.size.value=d.size*y,p.scale.value=T*.5,d.map&&(p.map.value=d.map,t(d.map,p.uvTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,t(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest)}function l(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.rotation.value=d.rotation,d.map&&(p.map.value=d.map,t(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,t(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest)}function u(p,d){p.specular.value.copy(d.specular),p.shininess.value=Math.max(d.shininess,1e-4)}function h(p,d){d.gradientMap&&(p.gradientMap.value=d.gradientMap)}function f(p,d){p.metalness.value=d.metalness,d.metalnessMap&&(p.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,p.metalnessMapTransform)),p.roughness.value=d.roughness,d.roughnessMap&&(p.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,p.roughnessMapTransform)),d.envMap&&(p.envMapIntensity.value=d.envMapIntensity)}function m(p,d,y){p.ior.value=d.ior,d.sheen>0&&(p.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),p.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(p.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,p.sheenColorMapTransform)),d.sheenRoughnessMap&&(p.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,p.sheenRoughnessMapTransform))),d.clearcoat>0&&(p.clearcoat.value=d.clearcoat,p.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(p.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,p.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(p.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Ht&&p.clearcoatNormalScale.value.negate())),d.dispersion>0&&(p.dispersion.value=d.dispersion),d.iridescence>0&&(p.iridescence.value=d.iridescence,p.iridescenceIOR.value=d.iridescenceIOR,p.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(p.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,p.iridescenceMapTransform)),d.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),d.transmission>0&&(p.transmission.value=d.transmission,p.transmissionSamplerMap.value=y.texture,p.transmissionSamplerSize.value.set(y.width,y.height),d.transmissionMap&&(p.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,p.transmissionMapTransform)),p.thickness.value=d.thickness,d.thicknessMap&&(p.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=d.attenuationDistance,p.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(p.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(p.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=d.specularIntensity,p.specularColor.value.copy(d.specularColor),d.specularColorMap&&(p.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,p.specularColorMapTransform)),d.specularIntensityMap&&(p.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,p.specularIntensityMapTransform))}function _(p,d){d.matcap&&(p.matcap.value=d.matcap)}function v(p,d){const y=e.get(d).light;p.referencePosition.value.setFromMatrixPosition(y.matrixWorld),p.nearDistance.value=y.shadow.camera.near,p.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function ug(n,e,t,i){let r={},s={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(S,A){const b=A.program;i.uniformBlockBinding(S,b)}function l(S,A){let b=r[S.id];b===void 0&&(p(S),b=u(S),r[S.id]=b,S.addEventListener("dispose",y));const w=A.program;i.updateUBOMapping(S,w);const g=e.render.frame;s[S.id]!==g&&(f(S),s[S.id]=g)}function u(S){const A=h();S.__bindingPointIndex=A;const b=n.createBuffer(),w=S.__size,g=S.usage;return n.bindBuffer(n.UNIFORM_BUFFER,b),n.bufferData(n.UNIFORM_BUFFER,w,g),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,A,b),b}function h(){for(let S=0;S<o;S++)if(a.indexOf(S)===-1)return a.push(S),S;return Je("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(S){const A=r[S.id],b=S.uniforms,w=S.__cache;n.bindBuffer(n.UNIFORM_BUFFER,A);for(let g=0,M=b.length;g<M;g++){const P=b[g];if(Array.isArray(P))for(let C=0,D=P.length;C<D;C++)m(P[C],g,C,w);else m(P,g,0,w)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function m(S,A,b,w){if(v(S,A,b,w)===!0){const g=S.__offset,M=S.value;if(Array.isArray(M)){let P=0;for(let C=0;C<M.length;C++){const D=M[C],z=d(D);_(D,S.__data,P),typeof D!="number"&&typeof D!="boolean"&&!D.isMatrix3&&!ArrayBuffer.isView(D)&&(P+=z.storage/Float32Array.BYTES_PER_ELEMENT)}}else _(M,S.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,g,S.__data)}}function _(S,A,b){typeof S=="number"||typeof S=="boolean"?A[0]=S:S.isMatrix3?(A[0]=S.elements[0],A[1]=S.elements[1],A[2]=S.elements[2],A[3]=0,A[4]=S.elements[3],A[5]=S.elements[4],A[6]=S.elements[5],A[7]=0,A[8]=S.elements[6],A[9]=S.elements[7],A[10]=S.elements[8],A[11]=0):ArrayBuffer.isView(S)?A.set(new S.constructor(S.buffer,S.byteOffset,A.length)):S.toArray(A,b)}function v(S,A,b,w){const g=S.value,M=A+"_"+b;if(w[M]===void 0)return typeof g=="number"||typeof g=="boolean"?w[M]=g:ArrayBuffer.isView(g)?w[M]=g.slice():w[M]=g.clone(),!0;{const P=w[M];if(typeof g=="number"||typeof g=="boolean"){if(P!==g)return w[M]=g,!0}else{if(ArrayBuffer.isView(g))return!0;if(P.equals(g)===!1)return P.copy(g),!0}}return!1}function p(S){const A=S.uniforms;let b=0;const w=16;for(let M=0,P=A.length;M<P;M++){const C=Array.isArray(A[M])?A[M]:[A[M]];for(let D=0,z=C.length;D<z;D++){const Y=C[D],I=Array.isArray(Y.value)?Y.value:[Y.value];for(let H=0,O=I.length;H<O;H++){const X=I[H],K=d(X),te=b%w,ee=te%K.boundary,he=te+ee;b+=ee,he!==0&&w-he<K.storage&&(b+=w-he),Y.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),Y.__offset=b,b+=K.storage}}}const g=b%w;return g>0&&(b+=w-g),S.__size=b,S.__cache={},this}function d(S){const A={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(A.boundary=4,A.storage=4):S.isVector2?(A.boundary=8,A.storage=8):S.isVector3||S.isColor?(A.boundary=16,A.storage=12):S.isVector4?(A.boundary=16,A.storage=16):S.isMatrix3?(A.boundary=48,A.storage=48):S.isMatrix4?(A.boundary=64,A.storage=64):S.isTexture?Ne("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(S)?(A.boundary=16,A.storage=S.byteLength):Ne("WebGLRenderer: Unsupported uniform value type.",S),A}function y(S){const A=S.target;A.removeEventListener("dispose",y);const b=a.indexOf(A.__bindingPointIndex);a.splice(b,1),n.deleteBuffer(r[A.id]),delete r[A.id],delete s[A.id]}function T(){for(const S in r)n.deleteBuffer(r[S]);a=[],r={},s={}}return{bind:c,update:l,dispose:T}}const fg=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let hn=null;function dg(){return hn===null&&(hn=new Ll(fg,16,16,di,Un),hn.name="DFG_LUT",hn.minFilter=Nt,hn.magFilter=Nt,hn.wrapS=Dn,hn.wrapT=Dn,hn.generateMipmaps=!1,hn.needsUpdate=!0),hn}class hg{constructor(e={}){const{canvas:t=Pf(),context:i=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:f=!1,outputBufferType:m=$t}=e;this.isWebGLRenderer=!0;let _;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");_=i.getContextAttributes().alpha}else _=a;const v=m,p=new Set([ho,fo,uo]),d=new Set([$t,Sn,dr,hr,oo,co]),y=new Uint32Array(4),T=new Int32Array(4),S=new B;let A=null,b=null;const w=[],g=[];let M=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=vn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const P=this;let C=!1,D=null,z=null,Y=null,I=null;this._outputColorSpace=Yt;let H=0,O=0,X=null,K=-1,te=null;const ee=new mt,he=new mt;let Ie=null;const Xe=new qe(0);let Be=0,J=t.width,oe=t.height,W=1,ie=null,ae=null;const se=new mt(0,0,J,oe),De=new mt(0,0,J,oe);let be=!1;const Ve=new xo;let Fe=!1,Ue=!1;const at=new dt,ut=new B,ht=new mt,St={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ft=!1;function pt(){return X===null?W:1}let U=i;function Te(E,F){return t.getContext(E,F)}try{const E={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${ro}`),t.addEventListener("webglcontextlost",gt,!1),t.addEventListener("webglcontextrestored",ot,!1),t.addEventListener("webglcontextcreationerror",ln,!1),U===null){const F="webgl2";if(U=Te(F,E),U===null)throw Te(F)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(E){throw Je("WebGLRenderer: "+E.message),E}let ye,R,x,N,k,$,re,le,Z,j,ue,Re,pe,fe,Pe,Le,ke,L,ce,Q,de,xe,ne;function Ae(){ye=new dm(U),ye.init(),de=new ig(U,ye),R=new rm(U,ye,e,de),x=new tg(U,ye),R.reversedDepthBuffer&&f&&x.buffers.depth.setReversed(!0),z=U.createFramebuffer(),Y=U.createFramebuffer(),I=U.createFramebuffer(),N=new mm(U),k=new G0,$=new ng(U,ye,x,k,R,de,N),re=new fm(P),le=new vd(U),xe=new nm(U,le),Z=new hm(U,le,N,xe),j=new _m(U,Z,le,xe,N),L=new gm(U,R,$),Pe=new sm(k),ue=new z0(P,re,ye,R,xe,Pe),Re=new lg(P,k),pe=new H0,fe=new Z0(ye),ke=new tm(P,re,x,j,_,c),Le=new eg(P,j,R),ne=new ug(U,N,R,x),ce=new im(U,ye,N),Q=new pm(U,ye,N),N.programs=ue.programs,P.capabilities=R,P.extensions=ye,P.properties=k,P.renderLists=pe,P.shadowMap=Le,P.state=x,P.info=N}Ae(),v!==$t&&(M=new vm(v,t.width,t.height,o,r,s));const Se=new og(P,U);this.xr=Se,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const E=ye.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=ye.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return W},this.setPixelRatio=function(E){E!==void 0&&(W=E,this.setSize(J,oe,!1))},this.getSize=function(E){return E.set(J,oe)},this.setSize=function(E,F,q=!0){if(Se.isPresenting){Ne("WebGLRenderer: Can't change size while VR device is presenting.");return}J=E,oe=F,t.width=Math.floor(E*W),t.height=Math.floor(F*W),q===!0&&(t.style.width=E+"px",t.style.height=F+"px"),M!==null&&M.setSize(t.width,t.height),this.setViewport(0,0,E,F)},this.getDrawingBufferSize=function(E){return E.set(J*W,oe*W).floor()},this.setDrawingBufferSize=function(E,F,q){J=E,oe=F,W=q,t.width=Math.floor(E*q),t.height=Math.floor(F*q),this.setViewport(0,0,E,F)},this.setEffects=function(E){if(v===$t){Je("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(E){for(let F=0;F<E.length;F++)if(E[F].isOutputPass===!0){Ne("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}M.setEffects(E||[])},this.getCurrentViewport=function(E){return E.copy(ee)},this.getViewport=function(E){return E.copy(se)},this.setViewport=function(E,F,q,G){E.isVector4?se.set(E.x,E.y,E.z,E.w):se.set(E,F,q,G),x.viewport(ee.copy(se).multiplyScalar(W).round())},this.getScissor=function(E){return E.copy(De)},this.setScissor=function(E,F,q,G){E.isVector4?De.set(E.x,E.y,E.z,E.w):De.set(E,F,q,G),x.scissor(he.copy(De).multiplyScalar(W).round())},this.getScissorTest=function(){return be},this.setScissorTest=function(E){x.setScissorTest(be=E)},this.setOpaqueSort=function(E){ie=E},this.setTransparentSort=function(E){ae=E},this.getClearColor=function(E){return E.copy(ke.getClearColor())},this.setClearColor=function(){ke.setClearColor(...arguments)},this.getClearAlpha=function(){return ke.getClearAlpha()},this.setClearAlpha=function(){ke.setClearAlpha(...arguments)},this.clear=function(E=!0,F=!0,q=!0){let G=0;if(E){let V=!1;if(X!==null){const _e=X.texture.format;V=p.has(_e)}if(V){const _e=X.texture.type,Me=d.has(_e),ge=ke.getClearColor(),Ee=ke.getClearAlpha(),we=ge.r,ze=ge.g,He=ge.b;Me?(y[0]=we,y[1]=ze,y[2]=He,y[3]=Ee,U.clearBufferuiv(U.COLOR,0,y)):(T[0]=we,T[1]=ze,T[2]=He,T[3]=Ee,U.clearBufferiv(U.COLOR,0,T))}else G|=U.COLOR_BUFFER_BIT}F&&(G|=U.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),q&&(G|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G!==0&&U.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(E){E.setRenderer(this),D=E},this.dispose=function(){t.removeEventListener("webglcontextlost",gt,!1),t.removeEventListener("webglcontextrestored",ot,!1),t.removeEventListener("webglcontextcreationerror",ln,!1),ke.dispose(),pe.dispose(),fe.dispose(),k.dispose(),re.dispose(),j.dispose(),xe.dispose(),ne.dispose(),ue.dispose(),Se.dispose(),Se.removeEventListener("sessionstart",Ro),Se.removeEventListener("sessionend",wo),ei.stop()};function gt(E){E.preventDefault(),ec("WebGLRenderer: Context Lost."),C=!0}function ot(){ec("WebGLRenderer: Context Restored."),C=!1;const E=N.autoReset,F=Le.enabled,q=Le.autoUpdate,G=Le.needsUpdate,V=Le.type;Ae(),N.autoReset=E,Le.enabled=F,Le.autoUpdate=q,Le.needsUpdate=G,Le.type=V}function ln(E){Je("WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function un(E){const F=E.target;F.removeEventListener("dispose",un),Jl(F)}function Jl(E){Ql(E),k.remove(E)}function Ql(E){const F=k.get(E).programs;F!==void 0&&(F.forEach(function(q){ue.releaseProgram(q)}),E.isShaderMaterial&&ue.releaseShaderCache(E))}this.renderBufferDirect=function(E,F,q,G,V,_e){F===null&&(F=St);const Me=V.isMesh&&V.matrixWorld.determinantAffine()<0,ge=tu(E,F,q,G,V);x.setMaterial(G,Me);let Ee=q.index,we=1;if(G.wireframe===!0){if(Ee=Z.getWireframeAttribute(q),Ee===void 0)return;we=2}const ze=q.drawRange,He=q.attributes.position;let Ce=ze.start*we,tt=(ze.start+ze.count)*we;_e!==null&&(Ce=Math.max(Ce,_e.start*we),tt=Math.min(tt,(_e.start+_e.count)*we)),Ee!==null?(Ce=Math.max(Ce,0),tt=Math.min(tt,Ee.count)):He!=null&&(Ce=Math.max(Ce,0),tt=Math.min(tt,He.count));const xt=tt-Ce;if(xt<0||xt===1/0)return;xe.setup(V,G,ge,q,Ee);let _t,nt=ce;if(Ee!==null&&(_t=le.get(Ee),nt=Q,nt.setIndex(_t)),V.isMesh)G.wireframe===!0?(x.setLineWidth(G.wireframeLinewidth*pt()),nt.setMode(U.LINES)):nt.setMode(U.TRIANGLES);else if(V.isLine){let It=G.linewidth;It===void 0&&(It=1),x.setLineWidth(It*pt()),V.isLineSegments?nt.setMode(U.LINES):V.isLineLoop?nt.setMode(U.LINE_LOOP):nt.setMode(U.LINE_STRIP)}else V.isPoints?nt.setMode(U.POINTS):V.isSprite&&nt.setMode(U.TRIANGLES);if(V.isBatchedMesh)if(ye.get("WEBGL_multi_draw"))nt.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{const It=V._multiDrawStarts,ve=V._multiDrawCounts,Wt=V._multiDrawCount,Ke=Ee?le.get(Ee).bytesPerElement:1,Kt=k.get(G).currentProgram.getUniforms();for(let fn=0;fn<Wt;fn++)Kt.setValue(U,"_gl_DrawID",fn),nt.render(It[fn]/Ke,ve[fn])}else if(V.isInstancedMesh)nt.renderInstances(Ce,xt,V.count);else if(q.isInstancedBufferGeometry){const It=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,ve=Math.min(q.instanceCount,It);nt.renderInstances(Ce,xt,ve)}else nt.render(Ce,xt)};function Ao(E,F,q){E.transparent===!0&&E.side===Pn&&E.forceSinglePass===!1?(E.side=Ht,E.needsUpdate=!0,Mr(E,F,q),E.side=Jn,E.needsUpdate=!0,Mr(E,F,q),E.side=Pn):Mr(E,F,q)}this.compile=function(E,F,q=null){q===null&&(q=E),b=fe.get(q),b.init(F),g.push(b),q.traverseVisible(function(V){V.isLight&&V.layers.test(F.layers)&&(b.pushLight(V),V.castShadow&&b.pushShadow(V))}),E!==q&&E.traverseVisible(function(V){V.isLight&&V.layers.test(F.layers)&&(b.pushLight(V),V.castShadow&&b.pushShadow(V))}),b.setupLights();const G=new Set;return E.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;const _e=V.material;if(_e)if(Array.isArray(_e))for(let Me=0;Me<_e.length;Me++){const ge=_e[Me];Ao(ge,q,V),G.add(ge)}else Ao(_e,q,V),G.add(_e)}),b=g.pop(),G},this.compileAsync=function(E,F,q=null){const G=this.compile(E,F,q);return new Promise(V=>{function _e(){if(G.forEach(function(Me){k.get(Me).currentProgram.isReady()&&G.delete(Me)}),G.size===0){V(E);return}setTimeout(_e,10)}ye.get("KHR_parallel_shader_compile")!==null?_e():setTimeout(_e,10)})};let _s=null;function jl(E){_s&&_s(E)}function Ro(){ei.stop()}function wo(){ei.start()}const ei=new Bl;ei.setAnimationLoop(jl),typeof self<"u"&&ei.setContext(self),this.setAnimationLoop=function(E){_s=E,Se.setAnimationLoop(E),E===null?ei.stop():ei.start()},Se.addEventListener("sessionstart",Ro),Se.addEventListener("sessionend",wo),this.render=function(E,F){if(F!==void 0&&F.isCamera!==!0){Je("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;D!==null&&D.renderStart(E,F);const q=Se.enabled===!0&&Se.isPresenting===!0,G=M!==null&&(X===null||q)&&M.begin(P,X);if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),Se.enabled===!0&&Se.isPresenting===!0&&(M===null||M.isCompositing()===!1)&&(Se.cameraAutoUpdate===!0&&Se.updateCamera(F),F=Se.getCamera()),E.isScene===!0&&E.onBeforeRender(P,E,F,X),b=fe.get(E,g.length),b.init(F),b.state.textureUnits=$.getTextureUnits(),g.push(b),at.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),Ve.setFromProjectionMatrix(at,xn,F.reversedDepth),Ue=this.localClippingEnabled,Fe=Pe.init(this.clippingPlanes,Ue),A=pe.get(E,w.length),A.init(),w.push(A),Se.enabled===!0&&Se.isPresenting===!0){const Me=P.xr.getDepthSensingMesh();Me!==null&&xs(Me,F,-1/0,P.sortObjects)}xs(E,F,0,P.sortObjects),A.finish(),P.sortObjects===!0&&A.sort(ie,ae,F.reversedDepth),ft=Se.enabled===!1||Se.isPresenting===!1||Se.hasDepthSensing()===!1,ft&&ke.addToRenderList(A,E),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Fe===!0&&Pe.beginShadows();const V=b.state.shadowsArray;if(Le.render(V,E,F),Fe===!0&&Pe.endShadows(),(G&&M.hasRenderPass())===!1){const Me=A.opaque,ge=A.transmissive;if(b.setupLights(),F.isArrayCamera){const Ee=F.cameras;if(ge.length>0)for(let we=0,ze=Ee.length;we<ze;we++){const He=Ee[we];Po(Me,ge,E,He)}ft&&ke.render(E);for(let we=0,ze=Ee.length;we<ze;we++){const He=Ee[we];Co(A,E,He,He.viewport)}}else ge.length>0&&Po(Me,ge,E,F),ft&&ke.render(E),Co(A,E,F)}X!==null&&O===0&&($.updateMultisampleRenderTarget(X),$.updateRenderTargetMipmap(X)),G&&M.end(P),E.isScene===!0&&E.onAfterRender(P,E,F),xe.resetDefaultState(),K=-1,te=null,g.pop(),g.length>0?(b=g[g.length-1],$.setTextureUnits(b.state.textureUnits),Fe===!0&&Pe.setGlobalState(P.clippingPlanes,b.state.camera)):b=null,w.pop(),w.length>0?A=w[w.length-1]:A=null,D!==null&&D.renderEnd()};function xs(E,F,q,G){if(E.visible===!1)return;if(E.layers.test(F.layers)){if(E.isGroup)q=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(F);else if(E.isLightProbeGrid)b.pushLightProbeGrid(E);else if(E.isLight)b.pushLight(E),E.castShadow&&b.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||Ve.intersectsSprite(E)){G&&ht.setFromMatrixPosition(E.matrixWorld).applyMatrix4(at);const Me=j.update(E),ge=E.material;ge.visible&&A.push(E,Me,ge,q,ht.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||Ve.intersectsObject(E))){const Me=j.update(E),ge=E.material;if(G&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),ht.copy(E.boundingSphere.center)):(Me.boundingSphere===null&&Me.computeBoundingSphere(),ht.copy(Me.boundingSphere.center)),ht.applyMatrix4(E.matrixWorld).applyMatrix4(at)),Array.isArray(ge)){const Ee=Me.groups;for(let we=0,ze=Ee.length;we<ze;we++){const He=Ee[we],Ce=ge[He.materialIndex];Ce&&Ce.visible&&A.push(E,Me,Ce,q,ht.z,He)}}else ge.visible&&A.push(E,Me,ge,q,ht.z,null)}}const _e=E.children;for(let Me=0,ge=_e.length;Me<ge;Me++)xs(_e[Me],F,q,G)}function Co(E,F,q,G){const{opaque:V,transmissive:_e,transparent:Me}=E;b.setupLightsView(q),Fe===!0&&Pe.setGlobalState(P.clippingPlanes,q),G&&x.viewport(ee.copy(G)),V.length>0&&vr(V,F,q),_e.length>0&&vr(_e,F,q),Me.length>0&&vr(Me,F,q),x.buffers.depth.setTest(!0),x.buffers.depth.setMask(!0),x.buffers.color.setMask(!0),x.setPolygonOffset(!1)}function Po(E,F,q,G){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[G.id]===void 0){const Ce=ye.has("EXT_color_buffer_half_float")||ye.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[G.id]=new Mn(1,1,{generateMipmaps:!0,type:Ce?Un:$t,minFilter:ci,samples:Math.max(4,R.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ye.workingColorSpace})}const _e=b.state.transmissionRenderTarget[G.id],Me=G.viewport||ee;_e.setSize(Me.z*P.transmissionResolutionScale,Me.w*P.transmissionResolutionScale);const ge=P.getRenderTarget(),Ee=P.getActiveCubeFace(),we=P.getActiveMipmapLevel();P.setRenderTarget(_e),P.getClearColor(Xe),Be=P.getClearAlpha(),Be<1&&P.setClearColor(16777215,.5),P.clear(),ft&&ke.render(q);const ze=P.toneMapping;P.toneMapping=vn;const He=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),b.setupLightsView(G),Fe===!0&&Pe.setGlobalState(P.clippingPlanes,G),vr(E,q,G),$.updateMultisampleRenderTarget(_e),$.updateRenderTargetMipmap(_e),ye.has("WEBGL_multisampled_render_to_texture")===!1){let Ce=!1;for(let tt=0,xt=F.length;tt<xt;tt++){const _t=F[tt],{object:nt,geometry:It,material:ve,group:Wt}=_t;if(ve.side===Pn&&nt.layers.test(G.layers)){const Ke=ve.side;ve.side=Ht,ve.needsUpdate=!0,Do(nt,q,G,It,ve,Wt),ve.side=Ke,ve.needsUpdate=!0,Ce=!0}}Ce===!0&&($.updateMultisampleRenderTarget(_e),$.updateRenderTargetMipmap(_e))}P.setRenderTarget(ge,Ee,we),P.setClearColor(Xe,Be),He!==void 0&&(G.viewport=He),P.toneMapping=ze}function vr(E,F,q){const G=F.isScene===!0?F.overrideMaterial:null;for(let V=0,_e=E.length;V<_e;V++){const Me=E[V],{object:ge,geometry:Ee,group:we}=Me;let ze=Me.material;ze.allowOverride===!0&&G!==null&&(ze=G),ge.layers.test(q.layers)&&Do(ge,F,q,Ee,ze,we)}}function Do(E,F,q,G,V,_e){E.onBeforeRender(P,F,q,G,V,_e),E.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),V.onBeforeRender(P,F,q,G,E,_e),V.transparent===!0&&V.side===Pn&&V.forceSinglePass===!1?(V.side=Ht,V.needsUpdate=!0,P.renderBufferDirect(q,F,G,V,E,_e),V.side=Jn,V.needsUpdate=!0,P.renderBufferDirect(q,F,G,V,E,_e),V.side=Pn):P.renderBufferDirect(q,F,G,V,E,_e),E.onAfterRender(P,F,q,G,V,_e)}function Mr(E,F,q){F.isScene!==!0&&(F=St);const G=k.get(E),V=b.state.lights,_e=b.state.shadowsArray,Me=V.state.version,ge=ue.getParameters(E,V.state,_e,F,q,b.state.lightProbeGridArray),Ee=ue.getProgramCacheKey(ge);let we=G.programs;G.environment=E.isMeshStandardMaterial||E.isMeshLambertMaterial||E.isMeshPhongMaterial?F.environment:null,G.fog=F.fog;const ze=E.isMeshStandardMaterial||E.isMeshLambertMaterial&&!E.envMap||E.isMeshPhongMaterial&&!E.envMap;G.envMap=re.get(E.envMap||G.environment,ze),G.envMapRotation=G.environment!==null&&E.envMap===null?F.environmentRotation:E.envMapRotation,we===void 0&&(E.addEventListener("dispose",un),we=new Map,G.programs=we);let He=we.get(Ee);if(He!==void 0){if(G.currentProgram===He&&G.lightsStateVersion===Me)return Lo(E,ge),He}else ge.uniforms=ue.getUniforms(E),D!==null&&E.isNodeMaterial&&D.build(E,q,ge),E.onBeforeCompile(ge,P),He=ue.acquireProgram(ge,Ee),we.set(Ee,He),G.uniforms=ge.uniforms;const Ce=G.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Ce.clippingPlanes=Pe.uniform),Lo(E,ge),G.needsLights=iu(E),G.lightsStateVersion=Me,G.needsLights&&(Ce.ambientLightColor.value=V.state.ambient,Ce.lightProbe.value=V.state.probe,Ce.directionalLights.value=V.state.directional,Ce.directionalLightShadows.value=V.state.directionalShadow,Ce.spotLights.value=V.state.spot,Ce.spotLightShadows.value=V.state.spotShadow,Ce.rectAreaLights.value=V.state.rectArea,Ce.ltc_1.value=V.state.rectAreaLTC1,Ce.ltc_2.value=V.state.rectAreaLTC2,Ce.pointLights.value=V.state.point,Ce.pointLightShadows.value=V.state.pointShadow,Ce.hemisphereLights.value=V.state.hemi,Ce.directionalShadowMatrix.value=V.state.directionalShadowMatrix,Ce.spotLightMatrix.value=V.state.spotLightMatrix,Ce.spotLightMap.value=V.state.spotLightMap,Ce.pointShadowMatrix.value=V.state.pointShadowMatrix),G.lightProbeGrid=b.state.lightProbeGridArray.length>0,G.currentProgram=He,G.uniformsList=null,He}function Io(E){if(E.uniformsList===null){const F=E.currentProgram.getUniforms();E.uniformsList=ts.seqWithValue(F.seq,E.uniforms)}return E.uniformsList}function Lo(E,F){const q=k.get(E);q.outputColorSpace=F.outputColorSpace,q.batching=F.batching,q.batchingColor=F.batchingColor,q.instancing=F.instancing,q.instancingColor=F.instancingColor,q.instancingMorph=F.instancingMorph,q.skinning=F.skinning,q.morphTargets=F.morphTargets,q.morphNormals=F.morphNormals,q.morphColors=F.morphColors,q.morphTargetsCount=F.morphTargetsCount,q.numClippingPlanes=F.numClippingPlanes,q.numIntersection=F.numClipIntersection,q.vertexAlphas=F.vertexAlphas,q.vertexTangents=F.vertexTangents,q.toneMapping=F.toneMapping}function eu(E,F){if(E.length===0)return null;if(E.length===1)return E[0].texture!==null?E[0]:null;S.setFromMatrixPosition(F.matrixWorld);for(let q=0,G=E.length;q<G;q++){const V=E[q];if(V.texture!==null&&V.boundingBox.containsPoint(S))return V}return null}function tu(E,F,q,G,V){F.isScene!==!0&&(F=St),$.resetTextureUnits();const _e=F.fog,Me=G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial?F.environment:null,ge=X===null?P.outputColorSpace:X.isXRRenderTarget===!0?X.texture.colorSpace:Ye.workingColorSpace,Ee=G.isMeshStandardMaterial||G.isMeshLambertMaterial&&!G.envMap||G.isMeshPhongMaterial&&!G.envMap,we=re.get(G.envMap||Me,Ee),ze=G.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,He=!!q.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Ce=!!q.morphAttributes.position,tt=!!q.morphAttributes.normal,xt=!!q.morphAttributes.color;let _t=vn;G.toneMapped&&(X===null||X.isXRRenderTarget===!0)&&(_t=P.toneMapping);const nt=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,It=nt!==void 0?nt.length:0,ve=k.get(G),Wt=b.state.lights;if(Fe===!0&&(Ue===!0||E!==te)){const ct=E===te&&G.id===K;Pe.setState(G,E,ct)}let Ke=!1;G.version===ve.__version?(ve.needsLights&&ve.lightsStateVersion!==Wt.state.version||ve.outputColorSpace!==ge||V.isBatchedMesh&&ve.batching===!1||!V.isBatchedMesh&&ve.batching===!0||V.isBatchedMesh&&ve.batchingColor===!0&&V.colorTexture===null||V.isBatchedMesh&&ve.batchingColor===!1&&V.colorTexture!==null||V.isInstancedMesh&&ve.instancing===!1||!V.isInstancedMesh&&ve.instancing===!0||V.isSkinnedMesh&&ve.skinning===!1||!V.isSkinnedMesh&&ve.skinning===!0||V.isInstancedMesh&&ve.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&ve.instancingColor===!1&&V.instanceColor!==null||V.isInstancedMesh&&ve.instancingMorph===!0&&V.morphTexture===null||V.isInstancedMesh&&ve.instancingMorph===!1&&V.morphTexture!==null||ve.envMap!==we||G.fog===!0&&ve.fog!==_e||ve.numClippingPlanes!==void 0&&(ve.numClippingPlanes!==Pe.numPlanes||ve.numIntersection!==Pe.numIntersection)||ve.vertexAlphas!==ze||ve.vertexTangents!==He||ve.morphTargets!==Ce||ve.morphNormals!==tt||ve.morphColors!==xt||ve.toneMapping!==_t||ve.morphTargetsCount!==It||!!ve.lightProbeGrid!=b.state.lightProbeGridArray.length>0)&&(Ke=!0):(Ke=!0,ve.__version=G.version);let Kt=ve.currentProgram;Ke===!0&&(Kt=Mr(G,F,V),D&&G.isNodeMaterial&&D.onUpdateProgram(G,Kt,ve));let fn=!1,On=!1,gi=!1;const it=Kt.getUniforms(),vt=ve.uniforms;if(x.useProgram(Kt.program)&&(fn=!0,On=!0,gi=!0),G.id!==K&&(K=G.id,On=!0),ve.needsLights){const ct=eu(b.state.lightProbeGridArray,V);ve.lightProbeGrid!==ct&&(ve.lightProbeGrid=ct,On=!0)}if(fn||te!==E){x.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),it.setValue(U,"projectionMatrix",E.projectionMatrix),it.setValue(U,"viewMatrix",E.matrixWorldInverse);const kn=it.map.cameraPosition;kn!==void 0&&kn.setValue(U,ut.setFromMatrixPosition(E.matrixWorld)),R.logarithmicDepthBuffer&&it.setValue(U,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&it.setValue(U,"isOrthographic",E.isOrthographicCamera===!0),te!==E&&(te=E,On=!0,gi=!0)}if(ve.needsLights&&(Wt.state.directionalShadowMap.length>0&&it.setValue(U,"directionalShadowMap",Wt.state.directionalShadowMap,$),Wt.state.spotShadowMap.length>0&&it.setValue(U,"spotShadowMap",Wt.state.spotShadowMap,$),Wt.state.pointShadowMap.length>0&&it.setValue(U,"pointShadowMap",Wt.state.pointShadowMap,$)),V.isSkinnedMesh){it.setOptional(U,V,"bindMatrix"),it.setOptional(U,V,"bindMatrixInverse");const ct=V.skeleton;ct&&(ct.boneTexture===null&&ct.computeBoneTexture(),it.setValue(U,"boneTexture",ct.boneTexture,$))}V.isBatchedMesh&&(it.setOptional(U,V,"batchingTexture"),it.setValue(U,"batchingTexture",V._matricesTexture,$),it.setOptional(U,V,"batchingIdTexture"),it.setValue(U,"batchingIdTexture",V._indirectTexture,$),it.setOptional(U,V,"batchingColorTexture"),V._colorsTexture!==null&&it.setValue(U,"batchingColorTexture",V._colorsTexture,$));const Bn=q.morphAttributes;if((Bn.position!==void 0||Bn.normal!==void 0||Bn.color!==void 0)&&L.update(V,q,Kt),(On||ve.receiveShadow!==V.receiveShadow)&&(ve.receiveShadow=V.receiveShadow,it.setValue(U,"receiveShadow",V.receiveShadow)),(G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial)&&G.envMap===null&&F.environment!==null&&(vt.envMapIntensity.value=F.environmentIntensity),vt.dfgLUT!==void 0&&(vt.dfgLUT.value=dg()),On){if(it.setValue(U,"toneMappingExposure",P.toneMappingExposure),ve.needsLights&&nu(vt,gi),_e&&G.fog===!0&&Re.refreshFogUniforms(vt,_e),Re.refreshMaterialUniforms(vt,G,W,oe,b.state.transmissionRenderTarget[E.id]),ve.needsLights&&ve.lightProbeGrid){const ct=ve.lightProbeGrid;vt.probesSH.value=ct.texture,vt.probesMin.value.copy(ct.boundingBox.min),vt.probesMax.value.copy(ct.boundingBox.max),vt.probesResolution.value.copy(ct.resolution)}ts.upload(U,Io(ve),vt,$)}if(G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(ts.upload(U,Io(ve),vt,$),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&it.setValue(U,"center",V.center),it.setValue(U,"modelViewMatrix",V.modelViewMatrix),it.setValue(U,"normalMatrix",V.normalMatrix),it.setValue(U,"modelMatrix",V.matrixWorld),G.uniformsGroups!==void 0){const ct=G.uniformsGroups;for(let kn=0,_i=ct.length;kn<_i;kn++){const Uo=ct[kn];ne.update(Uo,Kt),ne.bind(Uo,Kt)}}return Kt}function nu(E,F){E.ambientLightColor.needsUpdate=F,E.lightProbe.needsUpdate=F,E.directionalLights.needsUpdate=F,E.directionalLightShadows.needsUpdate=F,E.pointLights.needsUpdate=F,E.pointLightShadows.needsUpdate=F,E.spotLights.needsUpdate=F,E.spotLightShadows.needsUpdate=F,E.rectAreaLights.needsUpdate=F,E.hemisphereLights.needsUpdate=F}function iu(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return H},this.getActiveMipmapLevel=function(){return O},this.getRenderTarget=function(){return X},this.setRenderTargetTextures=function(E,F,q){const G=k.get(E);G.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),k.get(E.texture).__webglTexture=F,k.get(E.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:q,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,F){const q=k.get(E);q.__webglFramebuffer=F,q.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(E,F=0,q=0){X=E,H=F,O=q;let G=null,V=!1,_e=!1;if(E){const ge=k.get(E);if(ge.__useDefaultFramebuffer!==void 0){x.bindFramebuffer(U.FRAMEBUFFER,ge.__webglFramebuffer),ee.copy(E.viewport),he.copy(E.scissor),Ie=E.scissorTest,x.viewport(ee),x.scissor(he),x.setScissorTest(Ie),K=-1;return}else if(ge.__webglFramebuffer===void 0)$.setupRenderTarget(E);else if(ge.__hasExternalTextures)$.rebindTextures(E,k.get(E.texture).__webglTexture,k.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const ze=E.depthTexture;if(ge.__boundDepthTexture!==ze){if(ze!==null&&k.has(ze)&&(E.width!==ze.image.width||E.height!==ze.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");$.setupDepthRenderbuffer(E)}}const Ee=E.texture;(Ee.isData3DTexture||Ee.isDataArrayTexture||Ee.isCompressedArrayTexture)&&(_e=!0);const we=k.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(we[F])?G=we[F][q]:G=we[F],V=!0):E.samples>0&&$.useMultisampledRTT(E)===!1?G=k.get(E).__webglMultisampledFramebuffer:Array.isArray(we)?G=we[q]:G=we,ee.copy(E.viewport),he.copy(E.scissor),Ie=E.scissorTest}else ee.copy(se).multiplyScalar(W).floor(),he.copy(De).multiplyScalar(W).floor(),Ie=be;if(q!==0&&(G=z),x.bindFramebuffer(U.FRAMEBUFFER,G)&&x.drawBuffers(E,G),x.viewport(ee),x.scissor(he),x.setScissorTest(Ie),V){const ge=k.get(E.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+F,ge.__webglTexture,q)}else if(_e){const ge=F;for(let Ee=0;Ee<E.textures.length;Ee++){const we=k.get(E.textures[Ee]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+Ee,we.__webglTexture,q,ge)}}else if(E!==null&&q!==0){const ge=k.get(E.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,ge.__webglTexture,q)}K=-1},this.readRenderTargetPixels=function(E,F,q,G,V,_e,Me,ge=0){if(!(E&&E.isWebGLRenderTarget)){Je("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ee=k.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Me!==void 0&&(Ee=Ee[Me]),Ee){x.bindFramebuffer(U.FRAMEBUFFER,Ee);try{const we=E.textures[ge],ze=we.format,He=we.type;if(E.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+ge),!R.textureFormatReadable(ze)){Je("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!R.textureTypeReadable(He)){Je("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=E.width-G&&q>=0&&q<=E.height-V&&U.readPixels(F,q,G,V,de.convert(ze),de.convert(He),_e)}finally{const we=X!==null?k.get(X).__webglFramebuffer:null;x.bindFramebuffer(U.FRAMEBUFFER,we)}}},this.readRenderTargetPixelsAsync=async function(E,F,q,G,V,_e,Me,ge=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ee=k.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Me!==void 0&&(Ee=Ee[Me]),Ee)if(F>=0&&F<=E.width-G&&q>=0&&q<=E.height-V){x.bindFramebuffer(U.FRAMEBUFFER,Ee);const we=E.textures[ge],ze=we.format,He=we.type;if(E.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+ge),!R.textureFormatReadable(ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!R.textureTypeReadable(He))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ce=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,Ce),U.bufferData(U.PIXEL_PACK_BUFFER,_e.byteLength,U.STREAM_READ),U.readPixels(F,q,G,V,de.convert(ze),de.convert(He),0);const tt=X!==null?k.get(X).__webglFramebuffer:null;x.bindFramebuffer(U.FRAMEBUFFER,tt);const xt=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await Df(U,xt,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,Ce),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,_e),U.deleteBuffer(Ce),U.deleteSync(xt),_e}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,F=null,q=0){const G=Math.pow(2,-q),V=Math.floor(E.image.width*G),_e=Math.floor(E.image.height*G),Me=F!==null?F.x:0,ge=F!==null?F.y:0;$.setTexture2D(E,0),U.copyTexSubImage2D(U.TEXTURE_2D,q,0,0,Me,ge,V,_e),x.unbindTexture()},this.copyTextureToTexture=function(E,F,q=null,G=null,V=0,_e=0){let Me,ge,Ee,we,ze,He,Ce,tt,xt;const _t=E.isCompressedTexture?E.mipmaps[_e]:E.image;if(q!==null)Me=q.max.x-q.min.x,ge=q.max.y-q.min.y,Ee=q.isBox3?q.max.z-q.min.z:1,we=q.min.x,ze=q.min.y,He=q.isBox3?q.min.z:0;else{const vt=Math.pow(2,-V);Me=Math.floor(_t.width*vt),ge=Math.floor(_t.height*vt),E.isDataArrayTexture?Ee=_t.depth:E.isData3DTexture?Ee=Math.floor(_t.depth*vt):Ee=1,we=0,ze=0,He=0}G!==null?(Ce=G.x,tt=G.y,xt=G.z):(Ce=0,tt=0,xt=0);const nt=de.convert(F.format),It=de.convert(F.type);let ve;F.isData3DTexture?($.setTexture3D(F,0),ve=U.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?($.setTexture2DArray(F,0),ve=U.TEXTURE_2D_ARRAY):($.setTexture2D(F,0),ve=U.TEXTURE_2D),x.activeTexture(U.TEXTURE0),x.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,F.flipY),x.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),x.pixelStorei(U.UNPACK_ALIGNMENT,F.unpackAlignment);const Wt=x.getParameter(U.UNPACK_ROW_LENGTH),Ke=x.getParameter(U.UNPACK_IMAGE_HEIGHT),Kt=x.getParameter(U.UNPACK_SKIP_PIXELS),fn=x.getParameter(U.UNPACK_SKIP_ROWS),On=x.getParameter(U.UNPACK_SKIP_IMAGES);x.pixelStorei(U.UNPACK_ROW_LENGTH,_t.width),x.pixelStorei(U.UNPACK_IMAGE_HEIGHT,_t.height),x.pixelStorei(U.UNPACK_SKIP_PIXELS,we),x.pixelStorei(U.UNPACK_SKIP_ROWS,ze),x.pixelStorei(U.UNPACK_SKIP_IMAGES,He);const gi=E.isDataArrayTexture||E.isData3DTexture,it=F.isDataArrayTexture||F.isData3DTexture;if(E.isDepthTexture){const vt=k.get(E),Bn=k.get(F),ct=k.get(vt.__renderTarget),kn=k.get(Bn.__renderTarget);x.bindFramebuffer(U.READ_FRAMEBUFFER,ct.__webglFramebuffer),x.bindFramebuffer(U.DRAW_FRAMEBUFFER,kn.__webglFramebuffer);for(let _i=0;_i<Ee;_i++)gi&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,k.get(E).__webglTexture,V,He+_i),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,k.get(F).__webglTexture,_e,xt+_i)),U.blitFramebuffer(we,ze,Me,ge,Ce,tt,Me,ge,U.DEPTH_BUFFER_BIT,U.NEAREST);x.bindFramebuffer(U.READ_FRAMEBUFFER,null),x.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(V!==0||E.isRenderTargetTexture||k.has(E)){const vt=k.get(E),Bn=k.get(F);x.bindFramebuffer(U.READ_FRAMEBUFFER,Y),x.bindFramebuffer(U.DRAW_FRAMEBUFFER,I);for(let ct=0;ct<Ee;ct++)gi?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,vt.__webglTexture,V,He+ct):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,vt.__webglTexture,V),it?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Bn.__webglTexture,_e,xt+ct):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Bn.__webglTexture,_e),V!==0?U.blitFramebuffer(we,ze,Me,ge,Ce,tt,Me,ge,U.COLOR_BUFFER_BIT,U.NEAREST):it?U.copyTexSubImage3D(ve,_e,Ce,tt,xt+ct,we,ze,Me,ge):U.copyTexSubImage2D(ve,_e,Ce,tt,we,ze,Me,ge);x.bindFramebuffer(U.READ_FRAMEBUFFER,null),x.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else it?E.isDataTexture||E.isData3DTexture?U.texSubImage3D(ve,_e,Ce,tt,xt,Me,ge,Ee,nt,It,_t.data):F.isCompressedArrayTexture?U.compressedTexSubImage3D(ve,_e,Ce,tt,xt,Me,ge,Ee,nt,_t.data):U.texSubImage3D(ve,_e,Ce,tt,xt,Me,ge,Ee,nt,It,_t):E.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,_e,Ce,tt,Me,ge,nt,It,_t.data):E.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,_e,Ce,tt,_t.width,_t.height,nt,_t.data):U.texSubImage2D(U.TEXTURE_2D,_e,Ce,tt,Me,ge,nt,It,_t);x.pixelStorei(U.UNPACK_ROW_LENGTH,Wt),x.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Ke),x.pixelStorei(U.UNPACK_SKIP_PIXELS,Kt),x.pixelStorei(U.UNPACK_SKIP_ROWS,fn),x.pixelStorei(U.UNPACK_SKIP_IMAGES,On),_e===0&&F.generateMipmaps&&U.generateMipmap(ve),x.unbindTexture()},this.initRenderTarget=function(E){k.get(E).__webglFramebuffer===void 0&&$.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?$.setTextureCube(E,0):E.isData3DTexture?$.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?$.setTexture2DArray(E,0):$.setTexture2D(E,0),x.unbindTexture()},this.resetState=function(){H=0,O=0,X=null,x.reset(),xe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return xn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Ye._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ye._getUnpackColorSpace()}}const pg=new Set([...Qa,"road","station"]);function mg(n,e,t,i=[],r){const s=e>=128?2:1,a=6,o=Math.ceil(e/s),c=Math.ceil(t/s),l=new Uint8Array(o*c);for(let m=0;m<c;m++)for(let _=0;_<o;_++){let v=!1;const p=_*s,d=m*s,y=Math.min(e,p+s),T=Math.min(t,d+s);e:for(let S=d;S<T;S++)for(let A=p;A<y;A++)if(pg.has(n[wt(A,S,e)].kind)){v=!0;break e}v&&(l[m*o+_]=1)}const u=new Uint8Array(o*c),h=[],f=[[1,0],[-1,0],[0,1],[0,-1]];for(let m=0;m<c;m++)for(let _=0;_<o;_++){const v=m*o+_;if(!l[v]||u[v])continue;let p=0,d=0,y=0,T=_,S=_,A=m,b=m;const w=[v];for(u[v]=1;w.length>0;){const H=w.pop(),O=H%o,X=H/o|0;p+=O,d+=X,y+=1,O<T&&(T=O),O>S&&(S=O),X<A&&(A=X),X>b&&(b=X);for(const[K,te]of f){const ee=O+K,he=X+te;if(ee<0||he<0||ee>=o||he>=c)continue;const Ie=he*o+ee;!l[Ie]||u[Ie]||(u[Ie]=1,w.push(Ie))}}if(y<a)continue;const g=p/y,M=d/y,P=(g+.5)*s,C=(M+.5)*s,D=Math.max(S-T,b-A)*s,z=Math.max(6,D*.55+Math.sqrt(y)*s*.35);let Y=null,I=1/0;for(const H of i){const O=Math.hypot(H.cx-P,H.cy-C);O<I&&(I=O,Y=H.name)}I>z+20&&(Y=null),h.push({cx:P,cy:C,radius:z,size:y,label:Y})}return h.sort((m,_)=>_.size-m.size),h}function ql(n){const e=.95-n.radius*.011-Math.log2(1+n.size)*.02;return Math.max(.48,Math.min(.9,e))}const st=1,$c=14,gg=22,_g=8,Zc=Math.PI/4,na=Math.atan(1/Math.sqrt(2)),ia=220;function xg(n){const t=new ps(-18*n/2,18*n/2,9,-9,.1,2e3);return t.position.set(0,0,0),{target:new B(0,0,0),pan:new B(0,0,0),zoom:1,autoZoom:.72,camera:t,clusters:[],focusIndex:-1,focusTimer:0,reclusterTimer:0,targetAutoZoom:.72,focusAnnounce:null}}function vg(n,e,t,i){const s=Yl(n)/i,a=new B(1,0,-1).normalize(),o=new B(-1,0,-1).normalize();n.pan.addScaledVector(a,-e*s),n.pan.addScaledVector(o,t*s)}function Mg(n,e){n.zoom=Math.max(.45,Math.min(1.8,n.zoom*e))}function Yl(n){return 28/(n.zoom*n.autoZoom)}function qr(n,e){const t=Yl(n),i=t*e,r=n.camera;r.left=-i/2,r.right=i/2,r.top=t/2,r.bottom=-t/2,r.updateProjectionMatrix()}function sr(n){const e=new B().copy(n.target).add(n.pan),t=e.x+ia*Math.cos(na)*Math.sin(Zc),i=e.y+ia*Math.sin(na),r=e.z+ia*Math.cos(na)*Math.cos(Zc);n.camera.position.set(t,i,r),n.camera.lookAt(e),n.camera.updateMatrixWorld()}function Sg(){return $c+Math.random()*(gg-$c)}function $l(n,e){const t=n.focusIndex>=0?n.clusters[n.focusIndex]:null;if(n.clusters=mg(e.tiles,e.width,e.height,e.settlements),n.reclusterTimer=_g,n.clusters.length===0){n.focusIndex=-1;return}if(t){let i=0,r=1/0;for(let a=0;a<n.clusters.length;a++){const o=n.clusters[a],c=Math.hypot(o.cx-t.cx,o.cy-t.cy);c<r&&(r=c,i=a)}n.focusIndex=i;const s=n.clusters[i];n.targetAutoZoom=ql(s)}}function yg(n,e){if(n.length===0)return-1;if(n.length===1)return 0;const t=n.map((s,a)=>{const o=Math.sqrt(s.size);return a===e?o*.15:o}),i=t.reduce((s,a)=>s+a,0);let r=Math.random()*i;for(let s=0;s<t.length;s++)if(r-=t[s],r<=0)return s;return n.length-1}function Zl(n,e,t){if(e<0||e>=n.clusters.length)return;const i=n.clusters[e];n.focusIndex,n.focusIndex=e,n.focusTimer=Sg(),n.targetAutoZoom=ql(i),n.pan.set(0,0,0),i.label&&(n.focusAnnounce=i.label)}function Eg(n,e,t){if(n.reclusterTimer-=t,n.focusTimer-=t,(n.clusters.length===0||n.reclusterTimer<=0)&&$l(n,e),n.clusters.length===0){const r=e.settlements[0];if(r){const s=1-Math.exp(-.45*t);n.target.x+=(r.cx*st-n.target.x)*s,n.target.z+=(r.cy*st-n.target.z)*s}return}if(n.focusIndex<0||n.focusIndex>=n.clusters.length||n.focusTimer<=0){const r=yg(n.clusters,n.focusIndex);Zl(n,r)}const i=n.clusters[n.focusIndex];if(i){const r=i.cx*st,s=i.cy*st,a=1-Math.exp(-.5*t);n.target.x+=(r-n.target.x)*a,n.target.z+=(s-n.target.z)*a,n.autoZoom+=(n.targetAutoZoom-n.autoZoom)*(1-Math.exp(-.35*t))}}function bg(n){const e=n.focusAnnounce;return n.focusAnnounce=null,e}function Tg(n,e,t){n.target.set((e-1)/2*st,0,(t-1)/2*st),n.pan.set(0,0,0),n.zoom=1,n.autoZoom=.72,n.targetAutoZoom=.72,n.clusters=[],n.focusIndex=-1,n.focusTimer=0,n.reclusterTimer=0,n.focusAnnounce=null}function Ag(n,e){if($l(n,e),n.clusters.length===0){const i=e.settlements[0];i&&(n.target.set(i.cx*st,0,i.cy*st),i.name&&(n.focusAnnounce=i.name));return}Zl(n,0);const t=n.clusters[0];n.target.set(t.cx*st,0,t.cy*st),n.autoZoom=n.targetAutoZoom}function Rg(n){n.background=new qe(9353432),n.fog=new _o(11061472,.0012);const e=new dd(15791871,6982232,1.45);n.add(e);const t=new Zs(16775402,2);t.position.set(50,80,30),t.castShadow=!1,n.add(t);const i=new Zs(13163248,.75);i.position.set(-40,30,-50),n.add(i);const r=new Zs(11583743,.4);r.position.set(20,15,-60),n.add(r);const s=new md(9478328,.7);n.add(s)}const ls=new Map;function je(n,e,t={}){const i=ls.get(n);if(i)return i;const r=new gn({color:e,roughness:.85,metalness:.08,...t});return ls.set(n,r),r}function rt(n,e,t,i,r=e/2){const s=new lt(new Qt(n,e,t),i);return s.position.y=r,s}function Kl(n,e,t){const r=t>0?Math.max(.12,1-t/48):1;return Math.max(.12,({residential:.55,commercial:.7,industrial:.65,park:.1,school:.75,hospital:.8,station:.5,plaza:.12,tower:1.6,skyscraper:3.2}[n]??.5)*(.55+e*.28)*r)}function wg(n,e,t,i,r,s){const a=new Dt;a.userData.constructionSite=!0;const o=rt(n*1.1,.06,t*1.1,je("foundation",6974064,{roughness:.95}),.03);a.add(o);const c=rt(.22,.08,.18,je("pallet",9068592),.08);c.position.set(-n*.55,0,t*.4),a.add(c);for(let b=0;b<3;b++){const w=rt(.18,.04,.08,je("brick",11554880),.14+b*.045);w.position.set(-n*.55,0,t*.4),a.add(w)}const l=je("scaffold",13148224,{metalness:.45,roughness:.45}),u=Math.max(2,Math.ceil(3*s+1));for(let b=0;b<u;b++){const w=(b+1)/(u+1)*e*Math.max(.4,s),g=rt(n*1.08,.025,t*1.08,l,w);a.add(g);for(const[M,P]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const C=rt(.03,w,.03,l,w/2);C.position.set(M*n*.52,0,P*t*.52),a.add(C)}}const h=e+.7,f=rt(.07,h,.07,je("crane",12632264,{metalness:.55}),h/2);f.position.x=n*.42,a.add(f);const m=rt(.16,.12,.14,je("crane-cab",14721088,{metalness:.35}),h-.05);m.position.x=n*.42,a.add(m);const _=n*1.1,v=rt(_,.045,.045,je("crane-boom",14721088,{metalness:.4}),h+.08);v.position.x=n*.42-_*.25,v.userData.craneBoom=!0,a.add(v);const p=Math.sin(i*1.2+r)*.22,d=.25+s*(e*.7),y=Math.max(.15,h+.08-d),T=rt(.012,y,.012,je("cable",8947856),h+.08-y/2);T.position.x=p,T.userData.craneCable=!0,a.add(T);const S=rt(.07,.09,.07,je("hook",14721088),d);S.position.x=p,S.userData.craneHook=!0,a.add(S);const A=new lt(new jn(.04,6,6),je("site-lamp",16769152,{emissive:16760896,emissiveIntensity:.9}));return A.position.set(-n*.4,.35,-t*.4),A.userData.siteLamp=!0,a.add(A),a}function Cg(n,e,t,i,r,s){if(r==="station"||r==="park"||r==="plaza")return;const a=Math.max(1,Math.floor(t/.28)),o=r==="skyscraper"?4:r==="tower"?3:2,c=je("win-on",16771232,{emissive:16762976,emissiveIntensity:.85,roughness:.4}),l=je("win-off",1713456,{roughness:.6}),u=e*.92;for(let h=0;h<a;h++)for(let f=0;f<o;f++){const _=(s*7+h*3+f*5)%10>4?c:l,v=u/o*.45,p=.12,d=-u/2+(f+.5)*(u/o),y=.18+h*(t*.85)/a,T=rt(v,p,.02,_,y);T.position.x=d,T.position.z=i/2+.01,n.add(T);const S=rt(.02,p,v,_,y);S.position.x=e/2+.01,S.position.z=d*(i/e),n.add(S)}}function Pg(n){const e=new Dt,t=rt(.08,.28,.08,je("trunk",5914672),.14);e.add(t);const i=je(`canopy-${n%2}`,n%2===0?3836485:4889173,{roughness:.95}),r=new lt(new jn(.22,6,5),i);r.position.y=.42,r.scale.set(1,.9,1),e.add(r);const s=new lt(new jn(.12,5,4),je("canopy-hi",5945957,{roughness:.9}));return s.position.set(-.05,.48,.04),e.add(s),e}function Dg(n,e,t){const i=new Dt,r=je(`roof-${t}`,t,{roughness:.75}),s=.48,a=n*.52,o=a/Math.cos(s),c=a*Math.tan(s),l=e*.98,u=rt(o,.035,l,r,0);u.rotation.z=s,u.position.set(-a/2,c/2,0),i.add(u);const h=rt(o,.035,l,r,0);h.rotation.z=-s,h.position.set(a/2,c/2,0),i.add(h);const f=rt(.04,.04,l*1.02,r,0);return f.position.set(0,c+.01,0),i.add(f),i}const ra={residential:12888194,commercial:8036036,industrial:9079408,school:15257728,hospital:15263984,station:9474208,plaza:13682864,tower:9482448,skyscraper:11059424};function Ig(n,e){const t=n.kind;if(t==="grass"||t==="empty"||t==="water"||t==="forest"||t==="road"||t==="rail"||t==="crossing"||t==="bridge")return null;const i=new Dt;if(i.userData={kind:t,tier:n.tier,construction:n.construction,variant:n.variant},t==="park"){for(let u=0;u<3;u++){const h=Pg(n.variant+u);h.position.set((u-1)*.28,0,u%2*.15-.05),h.userData.sway=u+n.variant,i.add(h)}return i}if(t==="plaza"){i.add(rt(.75,.08,.75,je("plaza",ra.plaza),.04));const u=new lt(new hi(.12,.15,.1,8),je("fountain",6983856,{metalness:.3,roughness:.4}));return u.position.y=.12,i.add(u),i}const r=Kl(t,n.tier,n.construction),s=t==="skyscraper"?.72:t==="tower"?.55:.62,a=t==="skyscraper"?.72:.58,o=ra[t]??ra.residential,c=je(`body-${t}-${n.variant%3}`,o,{roughness:t==="skyscraper"?.35:.8,metalness:t==="skyscraper"||t==="tower"?.35:.08}),l=rt(s,r,a,c,r/2);if(i.add(l),n.construction>0){const u=Math.max(.12,1-n.construction/48);return l.material=je(`body-build-${t}`,o,{transparent:!0,opacity:.35+u*.5,roughness:.9}),i.add(wg(s,Math.max(r,.4),a,e,n.variant,u)),i.userData.buildingProgress=u,i}if(Cg(i,s,r,a,t,n.variant),t==="residential"&&n.tier<=2){const u=Dg(s,a,10502208+n.variant*526344);u.position.y=r,i.add(u)}if(t==="hospital"){const u=je("cross",14700624,{emissive:8392720,emissiveIntensity:.4}),h=rt(.08,.28,.04,u,r*.7),f=rt(.22,.08,.04,u,r*.7);h.position.z=a/2+.02,f.position.z=a/2+.02,i.add(h,f)}if(t==="school"){const u=rt(.2,.1,.02,je("flag",4219040),r+.12);i.add(u);const h=rt(.03,.25,.03,je("pole",8947856),r+.05);h.position.x=-.12,i.add(h)}if(t==="station"){const u=rt(.9,.08,.35,je("canopy",11579584,{metalness:.2}),r+.06);i.add(u);const h=rt(.05,r*.6,.05,je("post",7368832),r*.3);h.position.set(-.35,0,.1);const f=h.clone();f.position.x=.35,i.add(h,f);const m=rt(.28,.12,.03,je("sign",14729280,{emissive:8413184,emissiveIntensity:.5}),r*.55);m.position.z=a/2+.03,i.add(m)}if(t==="industrial"){const u=rt(.14,r+.35,.14,je("chimney",6971480),(r+.35)/2);u.position.set(.2,0,-.1),i.add(u);for(let h=0;h<3;h++){const f=new lt(new jn(.1+h*.03,5,4),je(`smoke-${h}`,11842750,{transparent:!0,opacity:.35-h*.08,roughness:1}));f.position.set(.2,r+.4+h*.18,-.1),f.userData.smoke=h,i.add(f)}}if(t==="tower"||t==="skyscraper"){const u=rt(.03,.35,.03,je("antenna",12636384,{metalness:.6}),r+.18);i.add(u);const h=new lt(new jn(.05,6,6),je("beacon",16736352,{emissive:16719904,emissiveIntensity:1}));h.position.y=r+.38,h.userData.beacon=!0,i.add(h)}return i}function Kc(n,e){const t=n.userData.variant??0;n.traverse(i=>{if(i instanceof bt){if(i.userData.sway!=null&&(i.rotation.z=Math.sin(e*1.5+i.userData.sway)*.06),i.userData.smoke!=null){const r=i.userData.smoke,s=(n.userData.kind==="industrial"?Kl("industrial",n.userData.tier,0):1)+.4;i.position.y=s+r*.18+(e*.4+r*.3)%.5,i.position.x=.2+Math.sin(e+r)*.05;const a=i.material;a.opacity!=null&&(a.opacity=.3-r*.08)}if(i.userData.beacon){const r=Math.sin(e*3+t)>.3,s=i.material;s.emissiveIntensity=r?1.2:.15}if(i.userData.craneHook||i.userData.craneCable){const r=Math.sin(e*1.2+t)*.22;i.position.x=r}if(i.userData.siteLamp){const r=Math.sin(e*4+t)>-.2,s=i.material;s.emissiveIntensity=r?1.1:.25}}})}function Lg(){for(const n of ls.values())n.dispose();ls.clear()}function Li(n,e,t,i,r,s){const a=(o,c)=>{const l=We(n,e+o,t+c,i,r);return!!l&&s(l.kind)};return{e:a(1,0),w:a(-1,0),s:a(0,1),n:a(0,-1)}}function Ug(n){return(n.e?1:0)+(n.w?1:0)+(n.n?1:0)+(n.s?1:0)}function ns(n){const e=n.e||n.w,t=n.n||n.s;return e&&t?"both":e?"x":t?"z":"none"}function Yr(n){return n==="road"||n==="station"||n==="crossing"||n==="bridge"}function Jc(n){return n==="rail"||n==="station"||n==="crossing"||n==="bridge"}const Ng=[4028997,4557390,3567680,4886610],Fg=[2775602,3301432,2377768,3693626],Og=[2776975,3304090,2381184];function Bg(n){return n==="water"?"water":n==="forest"?"forest":n==="empty"?"empty":n==="crossing"?"crossing":n==="bridge"?"bridge":n==="road"||n==="station"?"road":n==="rail"?"rail":"grass"}function Yn(n,e,t){const i=new Qt(st*.98,.08,st*.98),r=new gn({color:n,roughness:.92,metalness:.05}),s=new mn(i,r,e);return s.instanceMatrix.setUsage($n),s.count=0,s.position.y=t,s.frustumCulled=!1,{mesh:s,count:0,capacity:e}}const pn=new bt;function kg(n){return ns(n)==="x"?Math.PI/2:0}function zg(n){const e=new Dt;e.name="ground";const t=Ng.map((W,ie)=>{const ae=Yn(W,n,0);return ae.mesh.name=`grass-${ie}`,e.add(ae.mesh),ae}),i=Fg.map((W,ie)=>{const ae=Yn(W,n,.02);return ae.mesh.name=`forest-${ie}`,e.add(ae.mesh),ae}),r=new hi(.04,.05,.28,5),s=new gn({color:4863264,roughness:.9}),a=new mn(r,s,n*3);a.instanceMatrix.setUsage($n),a.count=0,a.frustumCulled=!1,e.add(a);const o=new vo(.18,.35,6),c=new gn({color:2976568,roughness:.85}),l=new mn(o,c,n*3);l.instanceMatrix.setUsage($n),l.count=0,l.frustumCulled=!1,e.add(l);const u=Og.map((W,ie)=>{const ae=Yn(W,n,-.04),se=ae.mesh.material;return se.roughness=.35,se.metalness=.15,se.emissive=new qe(1056816),se.emissiveIntensity=.15,ae.mesh.name=`water-${ie}`,e.add(ae.mesh),ae}),h=Yn(2763317,n,-.02);h.mesh.name="empty",e.add(h.mesh);const f=Yn(4868693,n,.05);f.mesh.name="road",e.add(f.mesh);const m=Yn(6969928,n,.12);m.mesh.name="bridge",e.add(m.mesh);const _=Yn(9075304,n,.22);_.mesh.name="bridge-rail",e.add(_.mesh);const v=new Qt(st*.08,.02,st*.55),p=new gn({color:13156464,roughness:.8,emissive:4208640,emissiveIntensity:.35}),d=new mn(v,p,n*2);d.instanceMatrix.setUsage($n),d.count=0,d.frustumCulled=!1,d.position.y=.1,e.add(d);const y=Yn(3814704,n,.04);y.mesh.name="rail-bed",e.add(y.mesh);const T=new Qt(st*.7,.03,.06),S=new gn({color:9079440,metalness:.6,roughness:.4}),A=new mn(T,S,n),b=new mn(T,S.clone(),n);for(const W of[A,b])W.instanceMatrix.setUsage($n),W.count=0,W.frustumCulled=!1,W.position.y=.09,e.add(W);const w=new Qt(.12,.04,st*.45),g=new gn({color:5914672,roughness:.95}),M=new mn(w,g,n*3);M.instanceMatrix.setUsage($n),M.count=0,M.frustumCulled=!1,M.position.y=.07,e.add(M);const P=new Qt(st*.7,.04,.05),C=new gn({color:14700624,emissive:6295568,emissiveIntensity:.4,roughness:.6}),D=new mn(P,C,n*2);D.instanceMatrix.setUsage($n),D.count=0,D.frustumCulled=!1,e.add(D);const z=new hi(.03,.03,.35,6),Y=new gn({color:3355448,roughness:.7}),I=new mn(z,Y,n*2);I.instanceMatrix.setUsage($n),I.count=0,I.frustumCulled=!1,e.add(I);let H="",O=0,X=0;function K(){for(const W of t)W.count=0;for(const W of i)W.count=0;for(const W of u)W.count=0;h.count=0,f.count=0,m.count=0,_.count=0,y.count=0,d.count=0,A.count=0,b.count=0,M.count=0,D.count=0,I.count=0,a.count=0,l.count=0}function te(W,ie,ae,se=0,De=1,be=1){W.count>=W.capacity||(pn.position.set(ie*st,0,ae*st),pn.rotation.set(0,se,0),pn.scale.set(De,1,be),pn.updateMatrix(),W.mesh.setMatrixAt(W.count++,pn.matrix))}function ee(W,ie,ae,se,De,be=0,Ve=0,Fe=0,Ue=0,at=1,ut=1,ht=1){ie.count>=ae||(pn.position.set(se*st+Ve,Fe,De*st+Ue),pn.rotation.set(0,be,0),pn.scale.set(at,ut,ht),pn.updateMatrix(),W.setMatrixAt(ie.count++,pn.matrix))}function he(W,ie,ae){let se=ie*73856093^ae*19349663;for(let De=0;De<W.length;De++){const be=W[De];se=se*31+be.kind.charCodeAt(0)+be.kind.charCodeAt(be.kind.length-1)*13+be.tier*7+(be.construction>0?1:0)+be.variant|0}return`${se}`}function Ie(W,ie,ae,se){const De=ns(ae);if(De==="both"){ee(d,se,n*2,W,ie,0,0,0,0,1,1,.45),ee(d,se,n*2,W,ie,Math.PI/2,0,0,0,1,1,.45);return}if(De==="none"){ee(d,se,n*2,W,ie,0);return}ee(d,se,n*2,W,ie,kg(ae))}function Xe(W,ie,ae,se,De,be){const Ve=ns(ae),Fe=Ve==="z"?Math.PI/2:0;if(Ve==="z"){ee(A,se,n,W,ie,Fe,-.12,0,0),ee(b,De,n,W,ie,Fe,.12,0,0);for(let Ue=-1;Ue<=1;Ue++)ee(M,be,n*3,W,ie,Fe,0,0,Ue*.22)}else if(Ve==="both")ee(A,se,n,W,ie,0,0,0,-.12,.7,1,1),ee(b,De,n,W,ie,0,0,0,.12,.7,1,1),ee(A,se,n,W,ie,Math.PI/2,-.12,0,0,.7,1,1),ee(b,De,n,W,ie,Math.PI/2,.12,0,0,.7,1,1);else{ee(A,se,n,W,ie,0,0,0,-.12),ee(b,De,n,W,ie,0,0,0,.12);for(let Ue=-1;Ue<=1;Ue++)ee(M,be,n*3,W,ie,0,Ue*.22,0,0)}}function Be(W,ie,ae,se,De,be){const Ve=ns(ae),Fe=.15+.85*(.5+.5*Math.sin(se*.7+W*.3+ie*.2));Ve==="z"||Ve==="none"?(ee(I,be,n*2,W,ie,0,-.35,.18,0),ee(I,be,n*2,W,ie,0,.35,.18,0),ee(D,De,n*2,W,ie,0,-.1,.28,0,Fe,1,1),ee(D,De,n*2,W,ie,0,.1,.28,0,Fe,1,1)):(ee(I,be,n*2,W,ie,0,0,.18,-.35),ee(I,be,n*2,W,ie,0,0,.18,.35),ee(D,De,n*2,W,ie,Math.PI/2,0,.28,-.1,Fe,1,1),ee(D,De,n*2,W,ie,Math.PI/2,0,.28,.1,Fe,1,1))}function J(W,ie){const{width:ae,height:se,tiles:De}=W,be=he(De,ae,se),Ve=ae!==O||se!==X,Fe=De.some(Te=>Te.kind==="crossing");if(be===H&&!Ve&&!Fe){for(const Te of u){const ye=Te.mesh.material;ye.emissiveIntensity=.12+.08*Math.sin(ie*1.5)}return}if(be===H&&!Ve&&Fe){const Te={count:0},ye={count:0};for(let R=0;R<se;R++)for(let x=0;x<ae;x++){if(De[R*ae+x].kind!=="crossing")continue;const N=Li(De,x,R,ae,se,Yr);Be(x,R,N,ie,Te,ye)}D.count=Te.count,D.instanceMatrix.needsUpdate=!0,I.count=ye.count,I.instanceMatrix.needsUpdate=!0;for(const R of u){const x=R.mesh.material;x.emissiveIntensity=.12+.08*Math.sin(ie*1.5)}return}H=be,O=ae,X=se,K();const Ue={count:0},at={count:0},ut={count:0},ht={count:0},St={count:0},ft={count:0},pt={count:0},U={count:0};for(let Te=0;Te<se;Te++)for(let ye=0;ye<ae;ye++){const R=De[Te*ae+ye],x=Bg(R.kind);if(x==="water"){te(u[R.variant%u.length],ye,Te);continue}if(x==="empty"){te(h,ye,Te);continue}if(x==="forest"){te(i[R.variant%i.length],ye,Te);const N=2+R.variant%2;for(let k=0;k<N;k++){const $=(k*.37+R.variant*.11)%.7-.35,re=(k*.53+R.variant*.07)%.7-.35;ee(a,pt,n*3,ye,Te,0,$,.14,re),ee(l,U,n*3,ye,Te,0,$,.38,re)}continue}if(x==="bridge"){te(u[0],ye,Te),te(m,ye,Te,0,.88,.88);const N=Li(De,ye,Te,ae,se,Yr);Ie(ye,Te,N,Ue),te(_,ye,Te,0,.95,.12),te(_,ye,Te,0,.12,.95);const k=Li(De,ye,Te,ae,se,Jc);Ug(k)>0&&Xe(ye,Te,k,at,ut,ht);continue}if(te(t[R.variant%t.length],ye,Te),x==="road"||x==="crossing"||R.kind==="station"){te(f,ye,Te,0,.92,.92);const N=Li(De,ye,Te,ae,se,Yr);Ie(ye,Te,N,Ue)}if(x==="rail"||x==="crossing"||R.kind==="station"){R.kind==="rail"&&te(y,ye,Te,0,.75,.75);const N=Li(De,ye,Te,ae,se,Jc);Xe(ye,Te,N,at,ut,ht)}if(x==="crossing"){const N=Li(De,ye,Te,ae,se,Yr);Be(ye,Te,N,ie,St,ft)}}for(const Te of t)Te.mesh.count=Te.count,Te.mesh.instanceMatrix.needsUpdate=!0;for(const Te of i)Te.mesh.count=Te.count,Te.mesh.instanceMatrix.needsUpdate=!0;for(const Te of u)Te.mesh.count=Te.count,Te.mesh.instanceMatrix.needsUpdate=!0;h.mesh.count=h.count,h.mesh.instanceMatrix.needsUpdate=!0,f.mesh.count=f.count,f.mesh.instanceMatrix.needsUpdate=!0,m.mesh.count=m.count,m.mesh.instanceMatrix.needsUpdate=!0,_.mesh.count=_.count,_.mesh.instanceMatrix.needsUpdate=!0,y.mesh.count=y.count,y.mesh.instanceMatrix.needsUpdate=!0,a.count=pt.count,a.instanceMatrix.needsUpdate=!0,l.count=U.count,l.instanceMatrix.needsUpdate=!0,d.count=Ue.count,d.instanceMatrix.needsUpdate=!0,A.count=at.count,A.instanceMatrix.needsUpdate=!0,b.count=ut.count,b.instanceMatrix.needsUpdate=!0,M.count=ht.count,M.instanceMatrix.needsUpdate=!0,D.count=St.count,D.instanceMatrix.needsUpdate=!0,I.count=ft.count,I.instanceMatrix.needsUpdate=!0}function oe(){e.traverse(W=>{W instanceof mn&&(W.geometry.dispose(),Array.isArray(W.material)?W.material.forEach(ie=>ie.dispose()):W.material.dispose())})}return{group:e,sync:J,dispose:oe}}const Qc=[14700624,5275872,14729280,5292144,12607712,14712896],us=new Map;function Ot(n,e,t={}){let i=us.get(n);return i||(i=new gn({color:e,roughness:.55,metalness:.25,...t}),us.set(n,i)),i}function Zt(n,e,t,i,r=e/2){const s=new lt(new Qt(n,e,t),i);return s.position.y=r,s}function Gg(n){const e=new Dt,t=Zt(.38,.12,.22,Ot(`car-${n}`,n),.1);e.add(t);const i=Zt(.2,.1,.2,Ot(`cabin-${n}`,n,{roughness:.4}),.2);i.position.x=-.02,e.add(i);const r=Zt(.16,.08,.18,Ot("glass",10537192,{transparent:!0,opacity:.65,metalness:.3,roughness:.2,emissive:2113632,emissiveIntensity:.15}),.2);r.position.x=.06,e.add(r);const s=Ot("wheel",1710618,{roughness:.9});for(const[a,o]of[[-.12,.12],[.12,.12],[-.12,-.12],[.12,-.12]]){const c=new lt(new hi(.05,.05,.04,8),s);c.rotation.z=Math.PI/2,c.position.set(a,.05,o),e.add(c)}return e}function Vg(n){const e=new Dt,t=Zt(.55,.22,.24,Ot(`bus-${n}`,n),.16);e.add(t);const i=Zt(.52,.04,.25,Ot("bus-stripe",15790320),.14);e.add(i);for(let r=-2;r<=2;r++){const s=Zt(.07,.08,.02,Ot("bus-win",8433888,{emissive:4219008,emissiveIntensity:.3,transparent:!0,opacity:.8}),.22);s.position.set(r*.09,0,.13),e.add(s)}return e}function Hg(n){const e=new Dt,t=Zt(.22,.18,.22,Ot(`truck-cab-${n}`,n),.16);t.position.x=.14,e.add(t);const i=Zt(.32,.2,.24,Ot("cargo",6974064,{roughness:.7}),.18);i.position.x=-.12,e.add(i);const r=Zt(.02,.1,.18,Ot("truck-glass",10537192,{transparent:!0,opacity:.7}),.2);return r.position.set(.26,0,0),e.add(r),e}function Wg(n,e){const t=new Dt,i=n?3824266:13684952,r=Zt(.42,.18,.22,Ot(`train-${n}-${e}`,i,{metalness:.35,roughness:.45}),.16);if(t.add(r),n){const a=Zt(.12,.14,.2,Ot("engine-nose",2771578),.14);a.position.x=.24,t.add(a);const o=new lt(new jn(.04,6,6),Ot("headlight",16769152,{emissive:16760896,emissiveIntensity:1}));o.position.set(.32,.14,0),o.userData.headlight=!0,t.add(o)}else{const a=Zt(.28,.08,.02,Ot("train-win",6590664,{emissive:3166320,emissiveIntensity:.4,transparent:!0,opacity:.75}),.2);a.position.z=.12,t.add(a)}const s=Zt(.06,.04,.04,Ot("coupler",4473928),.1);return s.position.x=-.24,t.add(s),t}function Xg(n,e,t){const i=Qc[e%Qc.length];if(n==="bus")return Vg(i);if(n==="truck")return Hg(i);if(n==="train"){const r=new Dt;r.userData.isTrain=!0;const s=t??4;for(let a=0;a<s;a++){const o=Wg(a===0,a);o.userData.carIndex=a,r.add(o)}return r}return Gg(i)}function qg(){const n=new Dt;n.name="vehicles";const e=new Map;function t(r,s){const a=new Set;for(const o of r){a.add(o.id);let c=e.get(o.id);if(c||(c=Xg(o.kind,o.color,o.cars),c.userData.id=o.id,e.set(o.id,c),n.add(c)),o.kind==="train"&&o.carPoses&&o.carPoses.length>0){c.position.set(0,0,0),c.rotation.set(0,0,0);const l=c.children;for(let u=0;u<l.length;u++){const h=l[u],f=o.carPoses[u]??o.carPoses[o.carPoses.length-1];h.position.set(f.x*st,.02,f.y*st),h.rotation.y=-f.dir}}else c.position.set(o.x*st,.02,o.y*st),c.rotation.y=-o.dir;c.traverse(l=>{if(l.userData.headlight){const u=Math.sin(s*8)>0,h=l.material;h.emissiveIntensity=u?1.4:.2}})}for(const[o,c]of e)a.has(o)||(n.remove(c),c.traverse(l=>{l instanceof lt&&l.geometry.dispose()}),e.delete(o))}function i(){for(const r of e.values())n.remove(r),r.traverse(s=>{s instanceof lt&&s.geometry.dispose()});e.clear();for(const r of us.values())r.dispose();us.clear()}return{group:n,sync:t,dispose:i}}function Yg(n){const e=n.construction>0?Math.ceil(n.construction/4):0;return`${n.kind}:${n.tier}:${e}:${n.variant}`}function $g(n=256,e=256){const t=new Dt;t.name="world";const i=zg(n*e);t.add(i.group);const r=new Dt;r.name="buildings",t.add(r);const s=qg();t.add(s.group);const a=new Map;function o(l,u){const{width:h,height:f,tiles:m}=l;i.sync(l,u);const _=new Set;for(let v=0;v<f;v++)for(let p=0;p<h;p++){const d=v*h+p,y=m[d],T=Yg(y);_.add(d);const S=a.get(d);if(S&&S.key===T){Kc(S.mesh,u);continue}S&&(r.remove(S.mesh),S.mesh.traverse(b=>{b instanceof lt&&b.geometry.dispose()}),a.delete(d));const A=Ig(y,u);A&&(A.position.set(p*st,0,v*st),r.add(A),a.set(d,{key:T,mesh:A}),Kc(A,u))}for(const[v,p]of a)_.has(v)||(r.remove(p.mesh),p.mesh.traverse(d=>{d instanceof lt&&d.geometry.dispose()}),a.delete(v));s.sync(l.vehicles,u)}function c(){i.dispose(),s.dispose();for(const l of a.values())r.remove(l.mesh),l.mesh.traverse(u=>{u instanceof lt&&u.geometry.dispose()});a.clear(),Lg()}return{root:t,sync:o,dispose:c}}function Zg(n){const e=new hg({canvas:n,antialias:!0,alpha:!1,powerPreference:"high-performance"});e.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),e.outputColorSpace=Yt,e.toneMapping=so,e.toneMappingExposure=1.55;const t=new Yf;Rg(t);let i=1;const r=xg(i),s=$g(256,256);t.add(s.root);let a=1,o=1;function c(v,p){a=Math.max(1,v),o=Math.max(1,p),i=a/o,e.setSize(a,o,!1),qr(r,i),sr(r)}function l(v,p,d){Eg(r,v,d),qr(r,i),sr(r),s.sync(v,p),e.render(t,r.camera)}function u(v,p,d){vg(r,v,p,d),sr(r)}function h(v){Mg(r,v),qr(r,i),sr(r)}function f(v){Tg(r,v.width,v.height),Ag(r,v),qr(r,i),sr(r)}function m(){return bg(r)}function _(){s.dispose(),e.dispose()}return{render:l,resize:c,pan:u,zoom:h,resetCamera:f,consumeFocusAnnounce:m,dispose:_,canvas:n}}function ar(n,e,t){return`<div class="bar"><div class="bar-fill" style="width:${Math.max(0,Math.min(100,n/e*100))}%;background:${t}"></div></div>`}function wn(n){return Math.round(n).toLocaleString("ja-JP")}function Kg(n,e,t){const{paused:i,speed:r,panelOpen:s}=t,a=`
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
        <span class="stage-label" id="hud-stage">${sl(n)}</span>
        <span class="day" id="hud-day">Day ${e}</span>
      </div>
    </header>
    ${o}
  `}function jc(n,e,t){const i=n.querySelector("#hud-stage");i&&(i.textContent=sl(t));const r=n.querySelector("#hud-day");r&&(r.textContent=`Day ${e.day}`);const s=n.querySelector(".stage-badge");s&&s.setAttribute("data-stage",t);const a=n.querySelector("#stats-list");a&&(a.innerHTML=`
        <div class="stat">
          <dt>人口</dt>
          <dd>${wn(e.population)} <span class="muted">/ 住宅 ${wn(e.housing)}</span></dd>
          ${ar(e.population,Math.max(e.housing,1),"var(--color-accent)")}
        </div>
        <div class="stat">
          <dt>雇用</dt>
          <dd>${wn(e.jobs)}</dd>
          ${ar(e.jobs,Math.max(e.population*.7,1),"var(--color-success)")}
        </div>
        <div class="stat">
          <dt>交通</dt>
          <dd>${wn(e.transport)}</dd>
          ${ar(e.transport,Math.max(e.population/8,20),"#6ec8ff")}
        </div>
        <div class="stat">
          <dt>教育</dt>
          <dd>${wn(e.education)}</dd>
          ${ar(e.education,100,"#e0c060")}
        </div>
        <div class="stat">
          <dt>幸福度</dt>
          <dd>${wn(e.happiness)}</dd>
          ${ar(e.happiness,100,"#ff8ab0")}
        </div>
        <div class="stat">
          <dt>予算</dt>
          <dd class="${e.budget<0?"danger":""}">¥${wn(e.budget)}${e.budget<0?' <span class="muted">（借入）</span>':""}</dd>
        </div>
        <div class="stat row">
          <div><dt>商業</dt><dd>${wn(e.commerce)}</dd></div>
          <div><dt>産業</dt><dd>${wn(e.industry)}</dd></div>
        </div>`)}function Jg(n,e){const t=n.querySelector('button[data-action="pause"]');t&&(t.textContent=e.paused?"再開":"一時停止");const i=n.querySelector('button[data-action="speed"]');i&&(i.textContent=`速度 ×${e.speed}`)}const $r=[1,2,4],Zr=256,Qg=2.8;function jg(n){n.innerHTML=`
    <div class="app">
      <div class="hud" id="hud"></div>
      <canvas id="city-canvas"></canvas>
      <div class="toast" id="toast" hidden></div>
    </div>
  `;const e=n.querySelector("#city-canvas"),t=n.querySelector("#hud"),i=n.querySelector("#toast"),r=Zg(e);let s=Xo({seed:Date.now()%1e5,width:Zr,height:Zr});r.resetCamera(s);let a=!1,o=0,c=!0,l=!0;const u=Qg;let h=performance.now(),f=0,m=0,_=0,v=!1,p=0,d=0;function y(){const M=window.innerWidth,P=window.innerHeight;e.style.width=`${M}px`,e.style.height=`${P}px`,r.resize(M,P)}function T(){const M=t.querySelector(".panel-body"),P=(M==null?void 0:M.scrollTop)??0;t.innerHTML=Kg(s.stage,s.stats.day,{paused:a,speed:$r[o],panelOpen:c}),jc(t,s.stats,s.stage);const C=t.querySelector(".panel-body");C&&(C.scrollTop=P),l=!1}function S(M=!1){if(M||l){T();return}jc(t,s.stats,s.stage),Jg(t,{paused:a,speed:$r[o]})}function A(M){i.hidden=!1,i.textContent=M,_=2.2}const b={residential:"新しい住宅が建った",commercial:"商店がオープン",industrial:"工場が稼働開始",road:"道路が延伸",rail:"線路が敷設された","intercity-rail":"都市間鉄道が開通した",crossing:"踏切ができた",school:"学校が開校",park:"公園が整備された",hospital:"病院が完成",tower:"高層マンションが建った",station:"駅が開業",plaza:"広場ができた",skyscraper:"超高層ビルがそびえる",demolish:"再開発で道路を通した",upgrade:"建物がグレードアップ",merge:"近くの町がひとつになった",bridge:"橋が架かった"};function w(M){const P=Math.min(.05,(M-h)/1e3);h=M;const C=a?0:P*$r[o];if(f+=P,C>0){const z=s.stage,Y=Zu(s,C,u);s=Y.state;for(const I of Y.events){const H=b[I];H&&A(H)}z!==s.stage&&A(`街が「${g(s.stage)}」に成長した`)}r.render(s,f,P);const D=r.consumeFocusAnnounce();D&&A(`${D}を眺める`),m-=P,m<=0&&(S(),m=.25),_>0&&(_-=P,_<=0&&(i.hidden=!0)),requestAnimationFrame(w)}function g(M){return{village:"小さな村",town:"町",city:"都市",metropolis:"大都会"}[M]}t.addEventListener("click",M=>{const P=M.target.closest("button[data-action]");if(!P)return;const C=P.dataset.action;C==="toggle-panel"?(c=!c,l=!0,S(!0)):C==="pause"?(a=!a,S()):C==="speed"?(o=(o+1)%$r.length,S()):C==="reset"&&(s=Xo({seed:Date.now()%1e5,width:Zr,height:Zr}),r.resetCamera(s),A("新しい街が始まった"),l=!0,S(!0))}),e.addEventListener("pointerdown",M=>{v=!0,p=M.clientX,d=M.clientY,e.setPointerCapture(M.pointerId)}),e.addEventListener("pointermove",M=>{if(!v)return;const P=M.clientX-p,C=M.clientY-d;p=M.clientX,d=M.clientY,r.pan(P,C,window.innerHeight)}),e.addEventListener("pointerup",()=>{v=!1}),e.addEventListener("pointercancel",()=>{v=!1}),e.addEventListener("wheel",M=>{M.preventDefault();const P=M.deltaY>0?.92:1.08;r.zoom(P)},{passive:!1}),window.addEventListener("resize",y),y(),S(!0),A("小さな村から、物語が始まる"),requestAnimationFrame(w)}const el=document.querySelector("#app");el&&jg(el);

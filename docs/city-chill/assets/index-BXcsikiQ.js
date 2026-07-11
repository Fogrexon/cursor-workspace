(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();const $t={population:{housingRoomFactor:.24,baseGrowth:4,popGrowthRate:.062,happinessFactorBase:.45,happinessDivisor:180,transportFactorBase:.45,transportFactorCap:1.25,transportPopDivisor:8,transportMinDenom:20,jobRoomJobsMult:1.25,jobRoomPopMult:.45,jobRoomThreshold:.25,overcrowdingThreshold:-5,overcrowdingLossCap:3,overcrowdingLossRate:.05,lowHappinessThreshold:30,lowHappinessLoss:1.5,initial:12},budget:{commerceIncome:1.35,industryIncome:1.1,populationIncome:.12,baseIncome:4,roadUpkeep:.55,railUpkeep:1.6,buildingUpkeep:.9,initial:260,debtLimit:500},buildCosts:{residential:22,commercial:32,industrial:42,road:12,rail:90,crossing:70,school:75,park:18,hospital:95,tower:170,station:240,plaza:28,skyscraper:340,upgradeBase:20,fallback:28},development:{forestClearCost:22,bridgeCost:95,bridgeUpkeep:2.2,bridgeTransport:6},terrain:{waterThreshold:.63,forestThreshold:.54,scale:.035},stages:{town:60,city:250,metropolis:900},buildInterval:{dayFactor:.42,minSeconds:.32,jitterMin:.7,jitterRange:.45},tiles:{residentialHousing:8,towerHousing:42,towerJobs:6,skyscraperHousing:90,skyscraperJobs:35,skyscraperCommerce:22,commercialJobs:12,commercialCommerce:10,industrialJobs:18,industrialIndustry:15,roadTransport:4,railTransport:10,crossingTransport:14,stationTransport:28,stationJobs:10,schoolEducation:18,schoolJobs:6,hospitalJobs:10,plazaParks:2,plazaCommerce:5,parkParks:1},happiness:{base:45,parksCap:20,parksPer:3,educationCap:15,educationFactor:.15,transportBonusCap:15,transportBonusBase:.5,transportBonusScale:20,jobBonusCap:10,jobBonusBase:.7,jobBonusScale:15,housingBonusCap:8,housingBonusBase:.8,housingBonusScale:10,hospitalBonus:4,transportPenaltyScale:25,jobPenaltyBase:.6,jobPenaltyScale:30,min:5,max:100,transportNeedDivisor:12,transportRatioCap:1.5,jobNeedFactor:.55}};function lt(n,e,t){return e*t+n}function Tt(n,e,t,i){return n>=0&&e>=0&&n<t&&e<i}function ze(n,e,t,i,r){return Tt(e,t,i,r)?n[lt(e,t,i)]:null}function Ot(n,e,t,i,r){n[lt(e,t,i)]=r}function At(n,e=0,t=0,i=0,r="none",s=n==="pad"?0:1,a=-1){return{kind:n,tier:e,variant:t,construction:i,facing:r,footprint:s,anchorIdx:a}}const xi=new Set(["residential","commercial","industrial","park","school","hospital","station","plaza","tower","skyscraper"]),Ar=[[0,0],[1,0],[0,1],[1,1]];function El(n,e,t,i,r){for(const[s,a]of Ar){const o=e+s,c=t+a;if(!Tt(o,c,i,r))return!1;const l=n[lt(o,c,i)];if(!nr(l.kind))return!1}return!0}function Fu(n,e,t,i,r){for(const[s,a]of Ar)if(bl(n,e+s,t+a,i,r))return!0;return!1}const gt=new Set(["road","station","crossing","bridge"]),ii=new Set(["rail","station","crossing","bridge"]);function nr(n){return n==="grass"||n==="empty"||n==="forest"}function vi(n){return nr(n)||n==="water"||n==="bridge"}const Ou=[[1,0],[-1,0],[0,1],[0,-1]];function dt(n,e,t,i){const r=[];for(const[s,a]of Ou){const o=n+s,c=e+a;Tt(o,c,t,i)&&r.push({x:o,y:c})}return r}function bl(n,e,t,i,r){return dt(e,t,i,r).some(s=>{const a=n[lt(s.x,s.y,i)];return gt.has(a.kind)})}function Jo(n,e){return n==="none"||n==="both"?!0:n==="x"?e==="e"||e==="w":e==="n"||e==="s"}function zn(n,e){return n==="none"?e:e==="none"||n===e?n:"both"}function ya(n,e){return n.y===e.y&&n.x!==e.x?"x":n.x===e.x&&n.y!==e.y?"z":"both"}function Bu(n,e,t){let i="none";return n&&(i=zn(i,ya(n,e))),t&&(i=zn(i,ya(e,t))),i==="none"?"x":i}function Ci(n,e,t,i,r,s){const a=ze(n,e,t,i,r);if(!a)return{e:!1,w:!1,n:!1,s:!1};const o=(c,l,u,d)=>{const f=ze(n,e+c,t+l,i,r);return!f||!s(f.kind)?!1:a.facing==="none"&&f.facing==="none"?!0:Jo(a.facing,u)&&Jo(f.facing,d)};return{e:o(1,0,"e","w"),w:o(-1,0,"w","e"),s:o(0,1,"s","n"),n:o(0,-1,"n","s")}}function Tl(n){return(n.e?1:0)+(n.w?1:0)+(n.n?1:0)+(n.s?1:0)}function Qo(n){const e=Tl(n);return e===0?"none":e===1?"end":e===2?n.e&&n.w||n.n&&n.s?"straight":"L":e===3?"T":"cross"}function Fs(n){const e=n.e||n.w,t=n.n||n.s;return e&&t?"both":e?"x":t?"z":"none"}function Yi(n){return n==="road"||n==="station"||n==="crossing"||n==="bridge"}function jo(n){return n==="rail"||n==="station"||n==="crossing"||n==="bridge"}function Ea(n,e){n.facing=zn(n.facing,e)}const xo={park:20,plaza:16,residential:5,commercial:4,industrial:2},ku=new Set(Object.keys(xo));function ec(n){return!(!ku.has(n.kind)||n.kind==="pad"||n.footprint===0||n.footprint>=2||n.construction>0||xo[n.kind]==null||n.kind==="residential"&&n.tier>=3||n.kind==="commercial"&&n.tier>=3||n.kind==="industrial"&&n.tier>=2)}function ps(n,e,t,i,r){return dt(e,t,i,r).filter(s=>{const a=n[s.y*i+s.x];return gt.has(a.kind)}).length}function zu(n,e,t,i,r){return dt(e,t,i,r).filter(s=>{const a=n[s.y*i+s.x];return vi(a.kind)}).length}function Sr(n,e,t,i,r){const s=(o,c)=>o===e&&c===t?!0:Tt(o,c,i,r)?gt.has(n[c*i+o].kind):!1,a=[[e,t],[e-1,t],[e,t-1],[e-1,t-1]];for(const[o,c]of a)if(s(o,c)&&s(o+1,c)&&s(o,c+1)&&s(o+1,c+1))return!0;return!1}function Os(n,e,t,i,r){const s=e/2,a=t/2,o=r<i*1.05,c=[];for(let l=0;l<t;l++)for(let u=0;u<e;u++){const d=n[l*e+u];if(!gt.has(d.kind)||zu(n,u,l,e,t)>0||ps(n,u,l,e,t)!==1)continue;const m=Math.hypot(u-s,l-a);for(const _ of dt(u,l,e,t)){const S=n[_.y*e+_.x];if(!ec(S)||Sr(n,_.x,_.y,e,t)||ps(n,_.x,_.y,e,t)!==1)continue;let h=xo[S.kind]??1;h-=S.tier*2,h+=m*2;const y=Math.hypot(_.x-s,_.y-a);y>m+.1?h+=8:y<m-.1?h-=10:h-=2;const A=_.x-u,M=_.y-l,b=ze(n,u-A,l-M,e,t);b&&gt.has(b.kind)?h+=6:h+=1,dt(_.x,_.y,e,t).filter(g=>g.x!==u||g.y!==l).some(g=>{const v=n[g.y*e+g.x];return vi(v.kind)||ec(v)})&&(h+=4),o&&(S.kind==="residential"||S.kind==="commercial")&&(h-=8),h>0&&c.push({x:_.x,y:_.y,score:h,kind:S.kind})}}return c.length===0?null:(c.sort((l,u)=>u.score-l.score),c[0])}function Gu(n,e,t){for(let r=0;r<t;r++)for(let s=0;s<e;s++){const a=n[r*e+s];if(gt.has(a.kind))for(const o of dt(s,r,e,t)){const c=n[o.y*e+o.x];if(vi(c.kind)&&!Sr(n,o.x,o.y,e,t))return!1}}let i=!1;for(const r of n)if(gt.has(r.kind)){i=!0;break}return i}function Al(n,e,t,i,r){if(!Tt(e,t,i,r))return!1;const s=ze(n,e,t,i,r);if(!s||!nr(s.kind)||Sr(n,e,t,i,r))return!1;for(const a of dt(e,t,i,r)){const o=n[a.y*i+a.x];if(!gt.has(o.kind)||dt(a.x,a.y,i,r).filter(u=>gt.has(n[u.y*i+u.x].kind)).length>=2)continue;if(dt(a.x,a.y,i,r).filter(u=>{const d=n[u.y*i+u.x];return vi(d.kind)&&!Sr(n,u.x,u.y,i,r)}).length<=1)return!0}return!1}function Lr(n){return nr(n)||n==="road"||n==="rail"||n==="station"||n==="crossing"||n==="bridge"||n==="water"}function Vu(n){return n==="rail"||n==="station"?.3:n==="crossing"?.45:n==="bridge"?.5:n==="grass"||n==="empty"?1:n==="forest"?1.8:n==="road"?8:n==="water"?12:99}function Hu(n,e,t,i,r,s=48){if(!Tt(i.x,i.y,e,t)||!Tt(r.x,r.y,e,t))return null;const a=ze(n,i.x,i.y,e,t),o=ze(n,r.x,r.y,e,t);if(!a||!o||!Lr(a.kind)&&!(a.kind==="rail"||a.kind==="station"||a.kind==="crossing")&&!Lr(a.kind)||!Lr(o.kind))return null;const c=(S,p)=>p*e+S,l=(S,p)=>Math.abs(S-r.x)+Math.abs(p-r.y),u=[],d=new Map,f=new Map,m=c(i.x,i.y);f.set(m,0),u.push({x:i.x,y:i.y,g:0,f:l(i.x,i.y),px:i.x,py:i.y,dx:0,dy:0});let _=0;for(;u.length>0&&_++<e*t*4;){let S=0;for(let h=1;h<u.length;h++)u[h].f<u[S].f&&(S=h);const p=u.splice(S,1)[0];if(p.x===r.x&&p.y===r.y){const h=[{x:p.x,y:p.y}];let y=p.x,A=p.y;for(;y!==i.x||A!==i.y;){const M=d.get(c(y,A));if(!M)break;y=M.x,A=M.y,h.push({x:y,y:A})}return h.reverse(),h.length>s?null:h}for(const h of dt(p.x,p.y,e,t)){const y=ze(n,h.x,h.y,e,t);if(!y||!Lr(y.kind))continue;const A=h.x-p.x,M=h.y-p.y;let b=Vu(y.kind);(p.dx!==0||p.dy!==0)&&(A===p.dx&&M===p.dy?b*=.85:b*=1.25),(h.x<=0||h.y<=0||h.x>=e-1||h.y>=t-1)&&(b+=2);const E=p.g+b,P=c(h.x,h.y);E>=(f.get(P)??1/0)||(f.set(P,E),d.set(P,{x:p.x,y:p.y}),u.push({x:h.x,y:h.y,g:E,f:E+l(h.x,h.y),px:p.x,py:p.y,dx:A,dy:M}))}}return null}function Mi(n){let e=n>>>0;return()=>{e=e+1831565813>>>0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}function Ae(n,e,t){return e+Math.floor(n()*(t-e+1))}function ht(n,e){return n()<e}const tc=["青葉","緑ヶ丘","桜台","日向","風見","白砂","山手","朝霧","紅葉","金星","鈴蘭","潮見","若葉","霞丘","月見","星川"],Wu=new Set([...xi,"road","rail","crossing","bridge","station"]);function Xu(n){return n<18?"hamlet":n<55?"village":n<130?"town":n<280?"city":"metropolis"}function qu(n){switch(n){case"hamlet":return"hamlet";case"village":return"village";case"borough":return"village";case"town":return"town"}}function Yu(n,e){const t=tc.filter(s=>!e.has(s)),i=t.length>0?t:[...tc],r=i[Ae(n,0,i.length-1)];return e.add(r),r}function zt(n,e,t,i,r,s){let a=t,o=i;for(;a!==r||o!==s;){const l=n[lt(a,o,e)];if(l.kind!=="water"){const u=a!==r?"x":"z",d=l.kind==="road"||l.kind==="crossing"||l.kind==="bridge"?zn(l.facing,u):u;n[lt(a,o,e)]=At("road",0,0,0,d)}a!==r?a+=a<r?1:-1:o!==s&&(o+=o<s?1:-1)}const c=n[lt(r,s,e)];if(c.kind!=="water"){const l=t!==r?"x":"z",u=c.kind==="road"||c.kind==="crossing"||c.kind==="bridge"?zn(c.facing,l):l;n[lt(r,s,e)]=At("road",0,0,0,u)}}function $u(n,e,t){if(t>=3){if(e===0)return ht(n,.55)?"borough":"town";if(e===1)return ht(n,.6)?"hamlet":"village"}const i=n();return i<.22?"hamlet":i<.55?"village":i<.82?"borough":"town"}function Ku(n,e){if(e==="hamlet"){const i=n();return i<.35?"ell":i<.65?"strip":i<.85?"tee":"cross"}if(e==="village"){const i=n();return i<.25?"cross":i<.45?"tee":i<.65?"ell":i<.85?"branch":"strip"}if(e==="borough"){const i=n();return i<.2?"cross":i<.4?"branch":i<.6?"loop":i<.8?"tee":"ell"}const t=n();return t<.25?"loop":t<.5?"branch":t<.7?"cross":t<.85?"tee":"ell"}function Zu(n,e,t,i,r,s,a,o){if(i<=0||r<=0||i>=e-1||r>=t-1)return;const c=n[lt(i,r,e)];c.kind==="water"||c.kind==="road"||c.kind==="crossing"||c.kind==="bridge"||(n[lt(i,r,e)]=At(s,a,Ae(o,0,3)))}function tn(n,e,t,i,r,s,a){a<=0||zt(n,e,t,i,t+r*a,i+s*a)}function Ju(n,e,t,i,r,s,a){const o=Ku(s,a),c=a==="hamlet"?1:a==="village"?2:a==="borough"?3:4,l=c+Ae(s,0,2)+(ht(s,.4)?1:0),u=c+Ae(s,0,2)+(ht(s,.4)?1:0),d=ht(s,.5),f=l-Ae(s,0,Math.min(2,l-1)),m=l-Ae(s,0,Math.min(2,l-1)),_=u-Ae(s,0,Math.min(2,u-1)),S=u-Ae(s,0,Math.min(2,u-1));if(o==="strip"){if(d?zt(n,e,i-m,r,i+f,r):zt(n,e,i,r-_,i,r+S),ht(s,.55)){const b=Ae(s,1,Math.max(1,c)),E=Ae(s,-Math.min(m,f),Math.min(m,f));d?tn(n,e,i+E,r,0,ht(s,.5)?1:-1,b):tn(n,e,i,r+E,ht(s,.5)?1:-1,0,b)}return}if(o==="ell"){const b=[[1,0,f],[-1,0,m],[0,1,S],[0,-1,_]];for(let E=b.length-1;E>0;E--){const P=Ae(s,0,E),g=b[E];b[E]=b[P],b[P]=g}tn(n,e,i,r,b[0][0],b[0][1],b[0][2]),tn(n,e,i,r,b[1][0],b[1][1],b[1][2]);return}if(o==="tee"){d?(zt(n,e,i-m,r,i+f,r),tn(n,e,i,r,0,ht(s,.5)?1:-1,Math.max(_,S))):(zt(n,e,i,r-_,i,r+S),tn(n,e,i,r,ht(s,.5)?1:-1,0,Math.max(f,m)));return}if(o==="cross"){tn(n,e,i,r,1,0,f),tn(n,e,i,r,-1,0,m),tn(n,e,i,r,0,1,S),tn(n,e,i,r,0,-1,_);return}if(o==="branch"){if(d){zt(n,e,i-m,r,i+f,r);const b=1+Ae(s,0,a==="town"?3:2);for(let E=0;E<b;E++){const P=Ae(s,-m,f),g=Ae(s,1,u);tn(n,e,i+P,r,0,ht(s,.5)?1:-1,g)}}else{zt(n,e,i,r-_,i,r+S);const b=1+Ae(s,0,a==="town"?3:2);for(let E=0;E<b;E++){const P=Ae(s,-_,S),g=Ae(s,1,l);tn(n,e,i,r+P,ht(s,.5)?1:-1,0,g)}}if(a!=="hamlet"&&ht(s,.4)){const b=Ae(s,2,Math.max(2,c+1))*(ht(s,.5)?1:-1);if(d){const E=r+b;E>0&&E<t-1&&zt(n,e,i-Ae(s,1,m),E,i+Ae(s,1,f),E)}else{const E=i+b;E>0&&E<e-1&&zt(n,e,E,r-Ae(s,1,_),E,r+Ae(s,1,S))}}return}const p=m,h=f,y=_,A=S,M=ht(s,.35)?Ae(s,0,3):-1;M!==0&&zt(n,e,i-p,r-y,i+h,r-y),M!==1&&zt(n,e,i-p,r+A,i+h,r+A),M!==2&&zt(n,e,i-p,r-y,i-p,r+A),M!==3&&zt(n,e,i+h,r-y,i+h,r+A),ht(s,.7)&&zt(n,e,i-Ae(s,0,p),r,i+Ae(s,0,h),r),ht(s,.55)&&zt(n,e,i,r-Ae(s,0,y),i,r+Ae(s,0,A))}function Qu(n,e,t){const i=n();return e==="hamlet"?i<.75?{kind:"residential",tier:1}:{kind:"park",tier:1}:e==="village"?i<.55?{kind:"residential",tier:1}:i<.75?{kind:"commercial",tier:1}:i<.9?{kind:"park",tier:1}:{kind:"industrial",tier:1}:e==="borough"?t===0&&ht(n,.45)?{kind:"school",tier:1}:i<.45?{kind:"residential",tier:ht(n,.35)?2:1}:i<.65?{kind:"commercial",tier:1}:i<.78?{kind:"industrial",tier:1}:i<.9?{kind:"park",tier:1}:{kind:"plaza",tier:1}:t===0&&ht(n,.55)?{kind:"school",tier:1}:t===1&&ht(n,.4)?{kind:"hospital",tier:1}:i<.4?{kind:"residential",tier:ht(n,.5)?2:1}:i<.58?{kind:"commercial",tier:ht(n,.4)?2:1}:i<.72?{kind:"industrial",tier:1}:i<.84?{kind:"park",tier:1}:i<.92?{kind:"plaza",tier:1}:{kind:"residential",tier:1}}function ju(n,e,t,i,r,s,a,o){const c=a==="hamlet"?Ae(s,1,3):a==="village"?Ae(s,4,7):a==="borough"?Ae(s,8,14):Ae(s,14,24),l=[];for(let m=r-o;m<=r+o;m++)for(let _=i-o;_<=i+o;_++){if(_<=0||m<=0||_>=e-1||m>=t-1)continue;const S=n[lt(_,m,e)];if(S.kind!=="grass"&&S.kind!=="empty"&&S.kind!=="forest"||!dt(_,m,e,t).some(h=>gt.has(n[lt(h.x,h.y,e)].kind)))continue;const p=Math.hypot(_-i,m-r);l.push({x:_,y:m,score:3-p*.15+s()*2.5})}l.sort((m,_)=>_.score-m.score);const u=new Set;let d=0;const f=l.slice(0,Math.min(l.length,c*3+8));for(;d<c&&f.length>0;){const m=Ae(s,0,Math.min(f.length-1,Math.max(2,Math.floor(f.length*.4)))),_=f.splice(m,1)[0],S=`${_.x},${_.y}`;if(u.has(S)||dt(_.x,_.y,e,t).filter(A=>xi.has(n[lt(A.x,A.y,e)].kind)).length>=3&&ht(s,.7))continue;const{kind:h,tier:y}=Qu(s,a,d);Zu(n,e,t,_.x,_.y,h,y,s),xi.has(n[lt(_.x,_.y,e)].kind)&&(u.add(S),d+=1)}}function ef(n,e,t,i,r,s,a){Ju(n,e,t,i,r,s,a);const o=a==="hamlet"?3:a==="village"?5:a==="borough"?7:9;for(let c=-2;c<=2;c++)for(let l=-2;l<=2;l++){const u=i+l,d=r+c;if(!Tt(u,d,e,t))continue;n[lt(u,d,e)].kind==="forest"&&(n[lt(u,d,e)]=At("grass"))}return ju(n,e,t,i,r,s,a,o),o+4}function tf(n,e,t,i){const r=e*t,s=r>=200*200?Ae(i,8,12):r>=100*100?Ae(i,5,8):r>=80*80?Ae(i,3,5):1,a=Math.max(22,Math.floor(Math.min(e,t)*(r>=200*200?.13:r>=100*100?.16:.22))),o=Math.max(12,Math.floor(Math.min(e,t)*.08)),c=[],l=new Set,u=(S,p,h,y)=>{for(const b of c)if(Math.hypot(S-b.cx,p-b.cy)<y)return!1;const A=$u(i,c.length,s),M=ef(n,e,t,S,p,i,A);return c.push({id:h,name:Yu(i,l),cx:S,cy:p,radius:M,level:qu(A)}),!0},d=Math.floor(e/2+(i()-.5)*e*.15),f=Math.floor(t/2+(i()-.5)*t*.15);u(Math.max(o,Math.min(e-o-1,d)),Math.max(o,Math.min(t-o-1,f)),0,a);let m=0,_=a;for(;c.length<s&&m++<240;){const S=Ae(i,o,e-o-1),p=Ae(i,o,t-o-1);u(S,p,c.length,_)||m>120&&c.length<s*.7&&(_=Math.max(24,Math.floor(_*.92)))}if(s>=3&&c.length<2){const S=Math.max(o,e-o-20),p=Math.max(o,t-o-20);u(S,p,c.length,24)}return c}function ms(n,e,t,i){let r=0;const s=Math.ceil(i.radius)+4;for(let a=i.cy-s;a<=i.cy+s;a++)for(let o=i.cx-s;o<=i.cx+s;o++)Tt(o,a,e,t)&&(Math.hypot(o-i.cx,a-i.cy)>s||Wu.has(n[lt(o,a,e)].kind)&&(r+=1));return r}function nf(n,e,t,i,r){if(n.length===0)return null;if(n.length===1)return n[0];const s=n.map(c=>{const l=ms(e,t,i,c);return .4+Math.sqrt(l+1)}),a=s.reduce((c,l)=>c+l,0);let o=r()*a;for(let c=0;c<n.length;c++)if(o-=s[c],o<=0)return n[c];return n[n.length-1]}function rf(n,e,t,i){for(const r of n){let s=0,a=0,o=0;const c=Math.ceil(r.radius)+8;for(let u=r.cy-c;u<=r.cy+c;u++)for(let d=r.cx-c;d<=r.cx+c;d++){if(!Tt(d,u,t,i)||Math.hypot(d-r.cx,u-r.cy)>c)continue;const f=e[lt(d,u,t)];!xi.has(f.kind)||f.kind==="station"||(s+=d,a+=u,o+=1)}o>6&&(r.cx=Math.round(r.cx*.7+s/o*.3),r.cy=Math.round(r.cy*.7+a/o*.3),r.radius=Math.min(48,Math.max(10,Math.sqrt(o)*1.25)));const l=ms(e,t,i,r);r.level=Xu(l)}}function sf(n,e,t,i){if(n.length<2)return{merged:!1,absorbedId:null};for(let r=0;r<n.length;r++)for(let s=r+1;s<n.length;s++){const a=n[r],o=n[s],c=Math.hypot(a.cx-o.cx,a.cy-o.cy),l=a.radius+o.radius+6;if(c>l||!af(e,t,i,a,o))continue;const u=ms(e,t,i,a),d=ms(e,t,i,o),f=u>=d?a:o,m=u>=d?o:a;f.cx=Math.round((a.cx*u+o.cx*d)/Math.max(1,u+d)),f.cy=Math.round((a.cy*u+o.cy*d)/Math.max(1,u+d)),f.radius=Math.min(56,a.radius+o.radius*.6);const _=m.id,S=n.indexOf(m);return n.splice(S,1),{merged:!0,absorbedId:_}}return{merged:!1,absorbedId:null}}function af(n,e,t,i,r){const s=nc(n,e,t,i.cx,i.cy,12),a=nc(n,e,t,r.cx,r.cy,12);if(!s||!a)return!1;const o=(m,_)=>_*e+m,c=o(a.x,a.y),l=new Set,u=[s];l.add(o(s.x,s.y));let d=0;const f=4e3;for(;u.length>0&&d++<f;){const m=u.shift();if(o(m.x,m.y)===c||Math.hypot(m.x-a.x,m.y-a.y)<=2)return!0;for(const _ of dt(m.x,m.y,e,t)){const S=o(_.x,_.y);if(l.has(S))continue;const p=n[lt(_.x,_.y,e)];!gt.has(p.kind)&&p.kind!=="bridge"||(l.add(S),u.push(_))}}return!1}function nc(n,e,t,i,r,s){let a=null,o=1/0;for(let c=r-s;c<=r+s;c++)for(let l=i-s;l<=i+s;l++){if(!Tt(l,c,e,t))continue;const u=ze(n,l,c,e,t);if(!u||!gt.has(u.kind))continue;const d=Math.hypot(l-i,c-r);d<o&&(o=d,a={x:l,y:c})}return a}function of(n){return n==="grass"||n==="empty"||n==="forest"||n==="rail"}function cf(n,e,t,i,r,s=4){let a=0;for(let o=-s;o<=s;o++)for(let c=-s;c<=s;c++){const l=e+c,u=t+o;if(!Tt(l,u,i,r))continue;const d=n[lt(l,u,i)].kind;d!=="station"&&xi.has(d)&&(a+=1)}return a}function lf(n,e,t,i,r,s){const a=ff(n,e,t,i,r,s+4,"station");if(a)return a;let o=null;for(let c=r-s;c<=r+s;c++)for(let l=i-s;l<=i+s;l++){if(!Tt(l,c,e,t))continue;const u=n[lt(l,c,e)];if(!of(u.kind)||u.kind==="road"||u.kind==="crossing"||u.kind==="bridge")continue;const d=cf(n,l,c,e,t);if(d<3)continue;let f=!1;for(let p=c-8;p<=c+8&&!f;p++)for(let h=l-8;h<=l+8;h++)Tt(h,p,e,t)&&n[lt(h,p,e)].kind==="station"&&Math.hypot(h-l,p-c)<8&&(f=!0);if(f)continue;const m=dt(l,c,e,t).some(p=>gt.has(n[lt(p.x,p.y,e)].kind)),_=Math.hypot(l-i,c-r);let S=d*2+8-_*.4;m&&(S+=4),u.kind==="rail"&&(S+=5),u.kind==="forest"&&(S-=1),(!o||S>o.score)&&(o={x:l,y:c,score:S})}return o?{x:o.x,y:o.y}:null}function uf(n,e,t,i,r){if(n.length<2)return null;const s=[];for(const l of n){const u=lf(e,t,i,l.cx,l.cy,Math.ceil(l.radius)+8);u&&s.push({...u,sid:l.id})}const a=[];for(let l=0;l<s.length;l++)for(let u=l+1;u<s.length;u++){const d=s[l],f=s[u];if(d.sid===f.sid)continue;const m=Math.hypot(d.x-f.x,d.y-f.y);m<18||m>120||df(e,t,i,d,f)||a.push({a:d,b:f,dist:m})}if(a.length===0)return null;a.sort((l,u)=>l.dist-u.dist);const o=a.slice(0,Math.min(4,a.length)),c=o[Ae(r,0,o.length-1)];return{a:{x:c.a.x,y:c.a.y},b:{x:c.b.x,y:c.b.y}}}function ff(n,e,t,i,r,s,a){let o=null,c=1/0;for(let l=r-s;l<=r+s;l++)for(let u=i-s;u<=i+s;u++){if(!Tt(u,l,e,t)||n[lt(u,l,e)].kind!==a)continue;const f=Math.hypot(u-i,l-r);f<c&&(c=f,o={x:u,y:l})}return o}function df(n,e,t,i,r){const s=Math.max(1,Math.ceil(Math.hypot(r.x-i.x,r.y-i.y)));let a=0;for(let o=0;o<=s;o++){const c=o/s,l=Math.round(i.x+(r.x-i.x)*c),u=Math.round(i.y+(r.y-i.y)*c);for(let d=-1;d<=1;d++)for(let f=-1;f<=1;f++){if(!Tt(l+f,u+d,e,t))continue;const m=n[lt(l+f,u+d,e)].kind;(m==="rail"||m==="station"||m==="crossing")&&(a+=1)}}return a>s*.35}function As(n,e,t,i=!0){if(!t)return 0;const r=Math.hypot(n-t.cx,e-t.cy),s=t.radius+6;return i?r<=s?2-r/s:-r/(s*3):0}function hf(n,e,t){return n.length<2||e==="village"||e==="town"?!1:ht(t,e==="city"?.05:.16)}function Rl(n,e,t=$t){const i=t.tiles,r=t.happiness,s=t.budget;let a=0,o=0,c=0,l=0,u=0,d=0,f=0,m=0,_=0,S=0,p=0,h=0,y=0,A=0;for(const D of n){if(D.kind==="pad"||D.footprint===0)continue;const F=Math.max(1,D.tier),L=D.footprint>=2?2.5:1;switch(D.kind){case"residential":a+=i.residentialHousing*F,A+=1;break;case"tower":a+=i.towerHousing*F*L,o+=i.towerJobs*F*L,A+=1;break;case"skyscraper":a+=i.skyscraperHousing*F*L,o+=i.skyscraperJobs*F*L,d+=i.skyscraperCommerce*F*L,A+=1;break;case"commercial":o+=i.commercialJobs*F,d+=i.commercialCommerce*F,A+=1;break;case"industrial":o+=i.industrialJobs*F,u+=i.industrialIndustry*F,A+=1;break;case"road":c+=i.roadTransport,_+=1;break;case"bridge":c+=t.development.bridgeTransport,p+=1;break;case"rail":c+=i.railTransport,S+=1;break;case"crossing":c+=i.crossingTransport,h+=1;break;case"station":c+=i.stationTransport,o+=i.stationJobs,y+=1,A+=1;break;case"school":l+=i.schoolEducation*F,o+=i.schoolJobs,A+=1;break;case"hospital":m+=1,o+=i.hospitalJobs,A+=1;break;case"park":f+=i.parkParks,A+=1;break;case"plaza":f+=i.plazaParks,d+=i.plazaCommerce,A+=1;break}}l=Math.min(100,l);const M=e.population,b=Math.max(1,M/r.transportNeedDivisor),E=Math.min(r.transportRatioCap,c/b),P=o/Math.max(1,M*r.jobNeedFactor),g=a/Math.max(1,M);let v=r.base;v+=Math.min(r.parksCap,f*r.parksPer),v+=Math.min(r.educationCap,l*r.educationFactor),v+=Math.min(r.transportBonusCap,(E-r.transportBonusBase)*r.transportBonusScale),v+=Math.min(r.jobBonusCap,(P-r.jobBonusBase)*r.jobBonusScale),v+=Math.min(r.housingBonusCap,(g-r.housingBonusBase)*r.housingBonusScale),v+=m*r.hospitalBonus,v-=Math.max(0,(1-E)*r.transportPenaltyScale),v-=Math.max(0,(r.jobPenaltyBase-P)*r.jobPenaltyScale),v=Math.max(r.min,Math.min(r.max,v));const w=d*s.commerceIncome+u*s.industryIncome+M*s.populationIncome+s.baseIncome,R=_*s.roadUpkeep+S*s.railUpkeep+p*t.development.bridgeUpkeep+h*s.roadUpkeep*.5+y*s.buildingUpkeep*1.8+(A-y)*s.buildingUpkeep,I=w-R;return{population:M,housing:a,jobs:o,transport:c,education:l,happiness:v,budget:e.budget+I,industry:u,commerce:d,day:e.day}}function pf(n,e=$t){const t=e.population,i=n.housing-n.population,r=n.jobs*t.jobRoomJobsMult-n.population*t.jobRoomPopMult,s=t.happinessFactorBase+n.happiness/t.happinessDivisor,a=Math.min(t.transportFactorCap,t.transportFactorBase+n.transport/Math.max(t.transportMinDenom,n.population/t.transportPopDivisor));let o=0;return i>0&&r>-n.population*t.jobRoomThreshold?o=Math.min(i*t.housingRoomFactor,t.baseGrowth+n.population*t.popGrowthRate*s*a):i<t.overcrowdingThreshold?o=-Math.min(t.overcrowdingLossCap,Math.abs(i)*t.overcrowdingLossRate):n.happiness<t.lowHappinessThreshold&&(o=-t.lowHappinessLoss),Math.max(0,n.population+o)}function Cl(n,e=$t){return n<e.stages.town?"village":n<e.stages.city?"town":n<e.stages.metropolis?"city":"metropolis"}function wl(n){switch(n){case"village":return"小さな村";case"town":return"町";case"city":return"都市";case"metropolis":return"大都会"}}function mf(n,e,t=e,i=$t){const r=i.happiness,s=Math.max(1,n.population),a=(n.housing-s)/s,o=(n.jobs-s*r.jobNeedFactor)/s,c=n.transport/Math.max(1,s/r.transportNeedDivisor)-1,l=40-n.education,u=60-n.happiness,d={residential:a<.25?1.5-a:.25,commercial:o<.2?1.2-o:.25,industrial:o<.1&&e!=="village"?1-o:.15,road:c<.25?1.2-c:.35,rail:e==="metropolis"?c<.2?.45:.15:e==="city"?c<.15?.35:.08:.02,school:l>0?l/35:.08,park:u>0?u/45:.12,hospital:e!=="village"&&n.happiness<55?.55:.08,tower:t==="metropolis"?a<.3?.9:.3:t==="city"&&s>=i.stages.city*1.1?a<.25?.7:.2:0,station:e==="city"||e==="metropolis"?c<.2?.35:.08:0,skyscraper:t==="metropolis"&&s>=i.stages.metropolis*1.1?a<.3?.55:.15:0};if(n.budget>120){const m=Math.min(2.2,1+n.budget/400);d.residential*=m,d.commercial*=m,d.industrial*=m*.9,d.road*=1.2,d.tower*=Math.min(m,1.4),s>=i.stages.metropolis*1.2?d.skyscraper*=Math.min(m,1.3):d.skyscraper*=.4,d.rail*=.45,d.station*=.55}return n.budget>280&&(d.residential*=1.25,d.commercial*=1.2,d.tower*=1.15,s>=i.stages.metropolis*1.25&&(d.skyscraper*=1.25),d.rail*=.6),e==="metropolis"&&(d.residential*=1.35,d.commercial*=1.25,t==="metropolis"&&(d.tower*=1.2,s>=i.stages.metropolis*1.15&&(d.skyscraper*=1.2))),n.budget+i.budget.debtLimit<80?(d.tower*=.1,d.rail*=.2,d.station*=.15,d.skyscraper=0):n.budget<0&&(d.tower*=.55,d.skyscraper*=.35,d.rail*=.7),d}({...$t.buildCosts});function Ur(n,e,t){let i=n*374761393+e*668265263+t*982451653|0;return i=(i^i>>>13)*1274126177,i=i^i>>>16,(i>>>0)/4294967296}function ic(n){return n*n*(3-2*n)}function gf(n,e,t){const i=Math.floor(n),r=Math.floor(e),s=ic(n-i),a=ic(e-r),o=Ur(i,r,t),c=Ur(i+1,r,t),l=Ur(i,r+1,t),u=Ur(i+1,r+1,t),d=o+(c-o)*s,f=l+(u-l)*s;return d+(f-d)*a}function rc(n,e,t,i=4,r=2,s=.5){let a=1,o=1,c=0,l=0;for(let u=0;u<i;u++)c+=a*gf(n*o,e*o,t+u*1013),l+=a,a*=s,o*=r;return c/Math.max(1e-6,l)}function _f(n,e,t,i){const r=[],s=(n-1)/2,a=(e-1)/2,o=Math.hypot(s,a)||1;for(let c=0;c<e;c++)for(let l=0;l<n;l++){const u=l*i.scale,d=c*i.scale,f=rc(u,d,t),m=rc(u+40,d-17,t+7),_=l===0||c===0||l===n-1||c===e-1?.06:0,S=Math.hypot(l-s,c-a)/o,p=Math.max(0,1-S*1.6)*.2,h=f+_-p;let y;h>i.waterThreshold?y="water":m>i.forestThreshold&&h<i.waterThreshold-.03?y="forest":y="grass";const A=y==="water"?Math.floor(f*3)%3:y==="forest"?Math.floor(m*4)%4:Math.floor((f+m)*2)%4;r.push(At(y,0,A))}return r}function Xi(n,e,t){const i=t.development;return n==="forest"?i.forestClearCost:n==="water"?e==="road"||e==="rail"||e==="crossing"?i.bridgeCost:Number.POSITIVE_INFINITY:0}function ba(n,e){return n==="water"||n==="bridge"?"bridge":e==="road"&&n==="rail"||e==="rail"&&n==="road"?"crossing":e}const gi=48,sc=36,qi=28,ac=36,xf=4,ei=8,vf=3,Mf=4;function Gn(n,e,t,i,r,s=Mf){let a=0;for(let o=-s;o<=s;o++)for(let c=-s;c<=s;c++){const l=e+c,u=t+o;if(!Tt(l,u,i,r))continue;const d=n[u*i+l].kind;d!=="station"&&xi.has(d)&&(a+=1)}return a}function Sf(n,e,t,i,r,s=vf){return Gn(n,e,t,i,r)>=s}function yf(n,e,t){for(let i=0;i<e.length;i++){const r=e[i],s=i>0?e[i-1]:null,a=i<e.length-1?e[i+1]:null,o=Bu(s,r,a),c=n[r.y*t+r.x];c&&Ea(c,o)}}function sr(n,e,t,i,r){const s=ze(n,e,t,i,r);if(!s||!Yi(s.kind))return;let a="none";for(const o of dt(e,t,i,r)){const c=n[o.y*i+o.x];if(!Yi(c.kind))continue;const l=ya({x:e,y:t},o);a=zn(a,l),Ea(c,l)}Ea(s,a==="none"?"x":a)}function Ef(n,e){const t=e.reduce((r,s)=>r+Math.max(0,s.w),0);if(t<=0)return"park";let i=n()*t;for(const r of e)if(i-=Math.max(0,r.w),i<=0)return r.key;return e[e.length-1].key}function bf(n,e,t,i,r){const s=[],a=(r==null?void 0:r.cx)??e/2,o=(r==null?void 0:r.cy)??t/2,c=r?r.radius+2:8,l=r?Math.ceil(r.radius)+10:Math.min(e,t),u=Math.max(0,o-l),d=Math.min(t-1,o+l),f=Math.max(0,a-l),m=Math.min(e-1,a+l);for(let S=u;S<=d;S++)for(let p=f;p<=m;p++){const h=ze(n,p,S,e,t);if(!h||!nr(h.kind)||!bl(n,p,S,e,t)||Al(n,p,S,e,t))continue;const y=Math.hypot(p-a,S-o),A=Gn(n,p,S,e,t,3);if(A===0&&y>c||A===0&&y>Math.max(5,c*.55))continue;const M=dt(p,S,e,t).filter(P=>gt.has(n[P.y*e+P.x].kind)).length,b=h.kind==="forest"?.4:0,E=A*.65+M*.45+1/(1+y*.2)+As(p,S,r)+i()*.25-b;s.push({x:p,y:S,score:E})}if(s.length===0)return null;s.sort((S,p)=>p.score-S.score);const _=s.slice(0,Math.min(12,s.length));return _[Ae(i,0,_.length-1)]}function Tf(n,e,t,i,r,s){const a=[];for(let o=0;o<t;o++)for(let c=0;c<e;c++){const l=ze(n,c,o,e,t);l&&r.includes(l.kind)&&(l.kind==="pad"||l.footprint===0||l.tier>=s||l.construction>0||a.push({x:c,y:o}))}return a.length===0?null:a[Ae(i,0,a.length-1)]}function oc(n,e,t,i,r){const s=[],a=(r==null?void 0:r.cx)??e/2,o=(r==null?void 0:r.cy)??t/2,c=r?r.radius+4:10,l=r?Math.ceil(r.radius)+12:Math.min(e,t),u=Math.max(0,o-l),d=Math.min(t-1,o+l),f=Math.max(0,a-l),m=Math.min(e-1,a+l);for(let S=u;S<=d;S++)for(let p=f;p<=m;p++){const h=ze(n,p,S,e,t);if(!h||!gt.has(h.kind))continue;const y=ps(n,p,S,e,t);for(const A of dt(p,S,e,t)){const M=n[A.y*e+A.x];if(!vi(M.kind)||Sr(n,A.x,A.y,e,t))continue;const b=ps(n,A.x,A.y,e,t);if(b>=3||b>=2&&y>=2)continue;let E=0;y===2?E+=4.8:y<=1?E+=1.6:E-=1.2;const P=A.x-p,g=A.y-S,v=ze(n,p-P,S-g,e,t);!!(v&&gt.has(v.kind))?E+=1:E+=3.2,b===1?E+=3.5:b===2&&(E-=1.8);const R=Gn(n,A.x,A.y,e,t,3),I=Gn(n,p,S,e,t,3);E+=Math.min(4.5,R*.85+I*.35);const D=Math.hypot(A.x-a,A.y-o),F=Math.hypot(p-a,S-o);D>c?(E-=(D-c)*.45,R===0&&I===0&&(E-=4)):E+=1.2-D/(c+1)*.6,D>F?E+=R+I>0?.7:-2:E+=.4,E+=As(A.x,A.y,r)*.85,M.kind==="grass"||M.kind==="empty"?E+=1.4:M.kind==="forest"?E+=.5:E-=1.5,!(D>c+6&&R===0&&I===0&&y<=1)&&(E+=i()*.5,s.push({x:A.x,y:A.y,score:E}))}}if(s.length===0)return null;s.sort((S,p)=>p.score-S.score);const _=s.slice(0,Math.min(10,s.length));return _[Ae(i,0,_.length-1)]}function Af(n,e,t){const i=[];for(let r=0;r<t;r++)for(let s=0;s<e;s++){const a=n[r*e+s];(a.kind==="rail"||a.kind==="station"||a.kind==="crossing"||a.kind==="bridge")&&i.push({x:s,y:r})}return i}function Rf(n,e,t,i,r){const s=ze(n,e,t,i,r);return s?s.kind==="grass"||s.kind==="empty"||s.kind==="forest"||s.kind==="rail":!1}function Cf(n,e,t,i,r){let s=Number.POSITIVE_INFINITY;for(let a=0;a<r;a++)for(let o=0;o<i;o++){if(n[a*i+o].kind!=="station")continue;const c=Math.hypot(o-e,a-t);c<s&&(s=c)}return s}function ln(n,e,t,i,r,s=ei){return Rf(n,e,t,i,r)?n[t*i+e].kind==="station"?!0:Cf(n,e,t,i,r)<s?!1:Sf(n,e,t,i,r):!1}function os(n,e,t,i,r,s){let a=null,o=s;const c=Math.max(0,Math.floor(t-s)),l=Math.min(r-1,Math.ceil(t+s)),u=Math.max(0,Math.floor(e-s)),d=Math.min(i-1,Math.ceil(e+s));for(let f=c;f<=l;f++)for(let m=u;m<=d;m++){const _=n[f*i+m];if(!_||_.kind!=="station")continue;const S=Math.hypot(m-e,f-t);S<=o&&(o=S,a={x:m,y:f})}return a}function ar(n,e,t,i){const r=os(n,e.x,e.y,t,i,ei);return r||(ln(n,e.x,e.y,t,i)?e:dt(e.x,e.y,t,i).filter(o=>ln(n,o.x,o.y,t,i)).map(o=>{const c=dt(o.x,o.y,t,i).some(l=>gt.has(n[l.y*t+l.x].kind));return{...o,score:c?2:1}}).sort((o,c)=>c.score-o.score)[0]??null)}function Bs(n,e,t){const i=t.buildCosts;if(e&&(n==="road"||n==="water"||n==="bridge"))return Number.POSITIVE_INFINITY;const r=e?i.station:n==="road"?i.crossing:i.rail,a=Xi(n,e?"station":n==="road"?"crossing":"rail",t);return Number.isFinite(a)?r+a:Number.POSITIVE_INFINITY}function Pl(n,e){return n+e.budget.debtLimit}function wn(n,e,t){return e<=Pl(n,t)}function cc(n,e,t,i,r,s,a,o){const c=Pl(s,r),l=Af(n,e,t),u=(g,v)=>{if(g.length<2)return null;let w=0;for(let R=0;R<g.length;R++){const I=g[R],D=R===0,F=R===g.length-1,L=v==="both"&&(D||F)||v==="goal"&&F,q=ze(n,I.x,I.y,e,t);if(q.kind!=="station"){if(q.kind==="rail"||q.kind==="crossing"||q.kind==="bridge"){L&&q.kind==="rail"&&(os(n,I.x,I.y,e,t,ei-.01)||(w+=5));continue}if(L){if(os(n,I.x,I.y,e,t,ei-.01))continue;const B=ln(n,I.x,I.y,e,t)?I:ar(n,I,e,t);if(!B)return null;const z=ze(n,B.x,B.y,e,t);if(z.kind==="station")continue;if(!ln(n,B.x,B.y,e,t))return null;const J=Bs(z.kind==="rail"?"grass":z.kind,!0,r);if(!Number.isFinite(J))return null;w+=J;continue}if(D&&v==="goal")return null;if(q.kind==="road"||vi(q.kind)){const B=Bs(q.kind,!1,r);if(!Number.isFinite(B))return null;w+=B}else return null}}return w},d=(g,v,w,R=w?gi:ac)=>{const I=ze(n,g,v,e,t);if(I.kind==="rail"||I.kind==="station"||I.kind==="crossing"||I.kind==="bridge")return 0;if(w&&!ln(n,g,v,e,t))return-1;const D=Bs(I.kind,w,r);if(!Number.isFinite(D))return-1;if(w)return Ot(n,g,v,e,At("station",1,Ae(i,0,2),R,"both")),D;if(I.kind==="road")return Ot(n,g,v,e,At("crossing",0,0,Math.max(R,qi),"both")),D;if(!vi(I.kind))return-1;const F=ba(I.kind,"rail");return Ot(n,g,v,e,At(F,0,0,R,"x")),D},f=(g,v,w=gi)=>{const R=ze(n,g,v,e,t);if(!R)return-1;if(R.kind==="station"||os(n,g,v,e,t,ei-.01))return 0;if(ln(n,g,v,e,t))return R.kind==="rail"?(Ot(n,g,v,e,At("station",1,Ae(i,0,2),w,zn(R.facing,"both"))),5):d(g,v,!0,w);const I=ar(n,{x:g,y:v},e,t);if(!I)return-1;const D=ze(n,I.x,I.y,e,t);return D.kind==="station"?0:ln(n,I.x,I.y,e,t)?D.kind==="rail"?(Ot(n,I.x,I.y,e,At("station",1,Ae(i,0,2),w,zn(D.facing,"both"))),5):d(I.x,I.y,!0,w):-1},m=(g,v,w)=>{const R=u(g,v);if(R==null||R>c)return null;const I=g.map(z=>{const J=n[z.y*e+z.x];return{x:z.x,y:z.y,tile:{...J}}}),D=[];for(const z of[g[0],g[g.length-1]])for(const J of dt(z.x,z.y,e,t))I.some(ne=>ne.x===J.x&&ne.y===J.y)||D.some(ne=>ne.x===J.x&&ne.y===J.y)||D.push({x:J.x,y:J.y,tile:{...n[J.y*e+J.x]}});const F=[];let L=0,q=0,B=!0;for(let z=0;z<g.length;z++){const J=g[z],ne=z===0,se=z===g.length-1,de=v==="both"&&(ne||se)||v==="goal"&&se,Ue=ze(n,J.x,J.y,e,t),$e=ac+z*xf;if(de){if(Ue.kind==="station"){F.push("station");continue}const ee=f(J.x,J.y,Math.max($e,gi));if(ee<0){B=!1;break}q+=ee,F.push("station"),ee>5&&(L+=1);continue}if(Ue.kind==="rail"||Ue.kind==="station"||Ue.kind==="crossing"||Ue.kind==="bridge")continue;const Ge=d(J.x,J.y,!1,$e);if(Ge<0){B=!1;break}q+=Ge,L+=1;const Z=ze(n,J.x,J.y,e,t);F.push(Z.kind)}if(B){yf(n,g,e);const z=(de,Ue)=>{const $e=ze(n,de,Ue,e,t);return($e==null?void 0:$e.kind)==="station"?!0:dt(de,Ue,e,t).some(Ge=>n[Ge.y*e+Ge.x].kind==="station")},J=(de,Ue)=>{var Ge;const $e=(Ge=ze(n,de,Ue,e,t))==null?void 0:Ge.kind;return $e==="rail"||$e==="station"||$e==="crossing"||$e==="bridge"},ne=g[0],se=g[g.length-1];v==="both"?(!z(ne.x,ne.y)||!z(se.x,se.y))&&(B=!1):(!J(ne.x,ne.y)||!z(se.x,se.y))&&(B=!1)}if(!B||q>c){for(const z of I)Ot(n,z.x,z.y,e,z.tile);for(const z of D)Ot(n,z.x,z.y,e,z.tile);return null}return{placed:L,kinds:[...new Set(F)],cost:q,intercity:w,path:g}},_=(g,v,w,R,I)=>{var q,B,z,J;let D=g,F=v;if(R==="both"){const ne=ar(n,g,e,t),se=ar(n,v,e,t);if(!ne||!se)return null;D=((q=ze(n,g.x,g.y,e,t))==null?void 0:q.kind)==="station"?g:ne,F=((B=ze(n,v.x,v.y,e,t))==null?void 0:B.kind)==="station"?v:se}else{const ne=(z=ze(n,g.x,g.y,e,t))==null?void 0:z.kind;if(ne!=="rail"&&ne!=="station"&&ne!=="crossing"&&ne!=="bridge")return null;if(((J=ze(n,v.x,v.y,e,t))==null?void 0:J.kind)!=="station"){const se=ar(n,v,e,t);if(!se)return null;F=se}}const L=Hu(n,e,t,D,F,w);return L?m(L,R,I):null};if(o){const g=_(o.a,o.b,140,"both",!0);if(g)return g}if(l.length===0){const g=(a==null?void 0:a.cx)??Math.floor(e/2),v=(a==null?void 0:a.cy)??Math.floor(t/2),w=[];for(let R=v-12;R<=v+12;R++)for(let I=g-14;I<=g+14;I++)!ln(n,I,R,e,t)||!dt(I,R,e,t).some(F=>gt.has(n[F.y*e+F.x].kind))||w.push({x:I,y:R});if(w.length<2)return null;for(let R=0;R<40;R++){const I=w[Ae(i,0,w.length-1)],D=w[Ae(i,0,w.length-1)],F=Math.hypot(I.x-D.x,I.y-D.y);if(F<ei||F>22)continue;const L=_(I,D,48,"both",!1);if(L)return L}return null}const S=l.filter(g=>{const v=n[g.y*e+g.x].kind;return v==="rail"||v==="station"});if(S.length===0)return null;S.sort((g,v)=>a?Math.hypot(g.x-a.cx,g.y-a.cy)-Math.hypot(v.x-a.cx,v.y-a.cy):0);const p=S[Ae(i,0,Math.min(5,S.length-1))],h=[];for(const g of l){if(g.x===p.x&&g.y===p.y||n[g.y*e+g.x].kind!=="station")continue;const v=Math.hypot(g.x-p.x,g.y-p.y);v>=ei&&v<=40&&h.push(g)}const y=a?Math.ceil(a.radius)+16:22,A=Math.max(2,((a==null?void 0:a.cy)??p.y)-y),M=Math.min(t-3,((a==null?void 0:a.cy)??p.y)+y),b=Math.max(2,((a==null?void 0:a.cx)??p.x)-y),E=Math.min(e-3,((a==null?void 0:a.cx)??p.x)+y);for(let g=A;g<=M;g++)for(let v=b;v<=E;v++){if(!ln(n,v,g,e,t)||!dt(v,g,e,t).some(I=>gt.has(n[I.y*e+I.x].kind)))continue;const R=Math.hypot(v-p.x,g-p.y);R<ei||R>28||h.push({x:v,y:g})}h.sort((g,v)=>{const w=Gn(n,v.x,v.y,e,t)-Gn(n,g.x,g.y,e,t);return w!==0?w:Math.hypot(g.x-p.x,g.y-p.y)-Math.hypot(v.x-p.x,v.y-p.y)});const P=h.slice(0,Math.min(10,h.length));for(let g=0;g<P.length;g++){const v=P[Ae(i,0,P.length-1)],w=_(p,v,60,"goal",!1);if(w)return w}return null}function wf(n,e,t,i,r){const s=[],a=(r==null?void 0:r.cx)??e/2,o=(r==null?void 0:r.cy)??t/2,c=r?Math.ceil(r.radius)+12:24,l=Math.max(1,o-c),u=Math.min(t-2,o+c),d=Math.max(1,a-c),f=Math.min(e-2,a+c);for(let m=l;m<=u;m++)for(let _=d;_<=f;_++){const S=ze(n,_,m,e,t);if(!S||S.kind==="station"||!ln(n,_,m,e,t))continue;const p=S.kind==="rail",h=dt(_,m,e,t).some(M=>{const b=n[M.y*e+M.x];return b.kind==="rail"||b.kind==="crossing"||b.kind==="station"});if(!p&&!h)continue;const A=Gn(n,_,m,e,t)*1.5+(p?4:h?2.5:0)+As(_,m,r)+i()*.3;s.push({x:_,y:m,score:A})}return s.length===0?null:(s.sort((m,_)=>_.score-m.score),s[Ae(i,0,Math.min(5,s.length-1))])}function Pf(n,e,t,i,r,s,a,o){if(!Tt(i,r,e,t))return!1;const c=ze(n,i,r,e,t);return!c||!nr(c.kind)?!1:(Ot(n,i,r,e,At(s,a,Ae(o,0,7),gi)),!0)}function Rs(n,e,t,i,r,s,a,o=$t){const c=Gn(n,e,t,i,r,4),l=Math.min(1,c/16);let u=0;for(let S=-3;S<=3;S++)for(let p=-3;p<=3;p++){const h=ze(n,e+p,t+S,i,r);h&&(h.kind==="commercial"?u+=.025:h.kind==="tower"?u+=.05:h.kind==="skyscraper"?u+=.07:(h.kind==="plaza"||h.kind==="station")&&(u+=.02))}u=Math.min(1,u);const d=s==="metropolis"?.5:s==="city"?.28:s==="town"?.1:0,f=Math.max(1,o.stages.metropolis),m=Math.min(1,a.population/(f*1.5)),_=Math.min(.15,Math.max(0,a.budget)/2500);return l*.38+u*.22+d*.22+m*.13+_*.05}function If(n,e,t,i,r,s,a,o=$t){return s!=="city"&&s!=="metropolis"||a.population<o.stages.city*.85?!1:Rs(n,e,t,i,r,s,a,o)>=.48}function Il(n,e,t,i,r,s,a,o=$t){return s!=="metropolis"||a.population<o.stages.metropolis||a.budget<80?!1:Rs(n,e,t,i,r,s,a,o)>=.68}function Df(n,e,t,i,r,s,a,o=$t){return s!=="metropolis"||a.population<o.stages.metropolis*1.25||a.budget<150?!1:Rs(n,e,t,i,r,s,a,o)>=.74}function Lf(n,e,t,i,r,s,a,o="premium",c=$t){const l=[],u=(r==null?void 0:r.cx)??e/2,d=(r==null?void 0:r.cy)??t/2,f=r?Math.ceil(r.radius)+14:Math.min(e,t),m=Math.max(0,d-f),_=Math.min(t-2,d+f),S=Math.max(0,u-f),p=Math.min(e-2,u+f);for(let y=m;y<=_;y++)for(let A=S;A<=p;A++){if(!El(n,A,y,e,t)||!Fu(n,A,y,e,t)||!(o==="premium"?Df(n,A,y,e,t,s,a,c):Il(n,A,y,e,t,s,a,c)))continue;let b=!1;for(const[v,w]of Ar)if(Al(n,A+v,y+w,e,t)){b=!0;break}if(b)continue;const E=Math.hypot(A+.5-u,y+.5-d),P=Gn(n,A,y,e,t,3),g=Rs(n,A,y,e,t,s,a,c);l.push({x:A,y,score:P*.08+g*3-E*.08+As(A,y,r)+i()*.25})}if(l.length===0)return null;l.sort((y,A)=>A.score-y.score);const h=l.slice(0,Math.min(8,l.length));return h[Ae(i,0,h.length-1)]}function Uf(n,e,t,i,r,s,a,o){if(!El(n,i,r,e,t))return!1;const c=Ae(o,0,7),l=lt(i,r,e);for(const[u,d]of Ar){const f=i+u,m=r+d;u===0&&d===0?Ot(n,f,m,e,At(s,a,c,gi,"none",2,-1)):Ot(n,f,m,e,At("pad",0,c,gi,"none",0,l))}return!0}function Nf(n,e,t,i){const r=i?e==="metropolis"?.35:e==="city"?.12:0:0;return[{key:"residential",w:n.residential},{key:"commercial",w:n.commercial},{key:"industrial",w:n.industrial},{key:"road",w:n.road+(t?1.4:0)+(i?.35:0)},{key:"rail",w:n.rail+r},{key:"school",w:n.school},{key:"park",w:n.park},{key:"hospital",w:n.hospital},{key:"tower",w:n.tower},{key:"station",w:n.station},{key:"plaza",w:e==="city"?.3:e==="metropolis"?.45:.05},{key:"upgrade",w:e==="town"?.55:e==="city"?.95:e==="metropolis"?1.4:.15},{key:"skyscraper",w:n.skyscraper},{key:"demolish",w:t?2:.05}]}function Ff(n,e,t,i,r,s,a,o=$t,c=[]){const l=Mi((s^a*2654435761)>>>0),u=o.buildCosts,d=nf(c,n,e,t,l),f=(d==null?void 0:d.level)??r,m=mf(i,r,f,o),_=Gu(n,e,t),S=c.length>=2,p=Ef(l,Nf(m,r,_,S));if(p==="demolish"||p==="road"&&_){const v=Os(n,e,t,i.population,i.housing);if(v){const w=Math.round(u.road*1.5);if(wn(i.budget,w,o))return Ot(n,v.x,v.y,e,At("road",0,0,qi,"x")),sr(n,v.x,v.y,e,t),{built:!0,kind:"demolish",cost:w}}if(p==="demolish")return{built:!1,cost:0}}if(p==="upgrade"){const w=Tf(n,e,t,l,["residential","commercial","industrial","tower"],f==="metropolis"?5:f==="city"?4:3);if(!w)return{built:!1,cost:0};const R=ze(n,w.x,w.y,e,t),I=u.upgradeBase*(R.tier+1)*(R.footprint>=2?2:1);if(!wn(i.budget,I,o))return{built:!1,cost:0};if(R.tier+=1,R.construction=sc,R.footprint>=2)for(const[D,F]of Ar){if(D===0&&F===0)continue;const L=ze(n,w.x+D,w.y+F,e,t);L&&L.kind==="pad"&&(L.construction=sc)}return{built:!0,kind:"upgrade",cost:I}}const h=u[p]??u.fallback;if(p==="road"){const v=oc(n,e,t,l,d);if(!v){const F=Os(n,e,t,i.population,i.housing);if(!F)return{built:!1,cost:0};const L=Math.round(u.road*1.5);return wn(i.budget,L,o)?(Ot(n,F.x,F.y,e,At("road",0,0,qi,"x")),sr(n,F.x,F.y,e,t),{built:!0,kind:"demolish",cost:L}):{built:!1,cost:0}}const w=ze(n,v.x,v.y,e,t),R=Xi(w.kind,"road",o),I=u.road+(Number.isFinite(R)?R:0);if(!wn(i.budget,I,o))return{built:!1,cost:0};const D=ba(w.kind,"road");return Ot(n,v.x,v.y,e,At(D,0,0,qi,"x")),sr(n,v.x,v.y,e,t),{built:!0,kind:D,cost:I}}if(p==="rail"){const w=hf(c,r,l)?uf(c,n,e,t,l):null,R=cc(n,e,t,l,o,i.budget,d,w);return R?{built:!0,kind:R.intercity?"intercity-rail":R.kinds.includes("station")?"rail":R.kinds.includes("bridge")?"bridge":R.kinds.includes("crossing")?"crossing":"rail",cost:R.cost,trainPath:R.path.length>=2?R.path:void 0}:{built:!1,cost:0}}if(p==="station"){const v=wf(n,e,t,l,d);if(!v){const D=cc(n,e,t,l,o,i.budget,d,null);return D?{built:!0,kind:"station",cost:D.cost,trainPath:D.path.length>=2?D.path:void 0}:{built:!1,cost:0}}const w=ze(n,v.x,v.y,e,t);if(!ln(n,v.x,v.y,e,t))return{built:!1,cost:0};const R=Xi(w.kind==="rail"?"grass":w.kind,"station",o),I=u.station+(Number.isFinite(R)?R:0);return wn(i.budget,I,o)?(Ot(n,v.x,v.y,e,At("station",1,Ae(l,0,2),gi,zn(w.facing==="none"?"x":w.facing,"both"))),{built:!0,kind:"station",cost:I}):{built:!1,cost:0}}const y=bf(n,e,t,l,d);if(!y){const v=oc(n,e,t,l,d);if(v){const I=ze(n,v.x,v.y,e,t),D=Xi(I.kind,"road",o),F=u.road+(Number.isFinite(D)?D:0);if(wn(i.budget,F,o)){const L=ba(I.kind,"road");return Ot(n,v.x,v.y,e,At(L,0,0,qi,"x")),sr(n,v.x,v.y,e,t),{built:!0,kind:L,cost:F}}}const w=Os(n,e,t,i.population,i.housing),R=Math.round(u.road*1.5);return w&&wn(i.budget,R,o)?(Ot(n,w.x,w.y,e,At("road",0,0,qi,"x")),sr(n,w.x,w.y,e,t),{built:!0,kind:"demolish",cost:R}):{built:!1,cost:0}}const A=p,M=p==="skyscraper"||p==="tower"?2:1;if(p==="skyscraper"&&f==="metropolis"||p==="tower"&&f==="metropolis"){const v=Lf(n,e,t,l,d,f,i,p==="skyscraper"?"premium":"high",o);if(v){const w=ze(n,v.x,v.y,e,t),R=Xi(w.kind,"building",o);if(Number.isFinite(R)){const I=Math.round(h*2.4)+R;if(wn(i.budget,I,o)&&Uf(n,e,t,v.x,v.y,A,M,l))return{built:!0,kind:p==="skyscraper"?"skyscraper-2x2":"tower-2x2",cost:I}}}}if(p==="skyscraper"){if(!Il(n,y.x,y.y,e,t,f,i,o))return{built:!1,cost:0}}else if(p==="tower"&&!If(n,y.x,y.y,e,t,f,i,o))return{built:!1,cost:0};const E=ze(n,y.x,y.y,e,t),P=Xi(E.kind,"building",o);if(!Number.isFinite(P))return{built:!1,cost:0};const g=h+P;return wn(i.budget,g,o)?Pf(n,e,t,y.x,y.y,A,M,l)?{built:!0,kind:p,cost:g}:{built:!1,cost:0}:{built:!1,cost:0}}const Of=1/3;function Bf(n){const e=[];for(let t=0;t<n.length;t++)n[t].construction>0&&e.push(t);return e}function kf(n,e){const t=[];let i=!1;const r=s=>{const a=n[s];if(!a||a.construction<=0)return;const o=Math.ceil(a.construction/3),c=Math.ceil(a.construction/4);a.construction=Math.max(0,a.construction-Of),a.construction>0?(t.push(s),(Math.ceil(a.construction/3)!==o||Math.ceil(a.construction/4)!==c)&&(i=!0)):i=!0};if(e)for(const s of e)r(s);else for(let s=0;s<n.length;s++)r(s);return{indices:t,visualChanged:i}}function zf(n,e=$t){const{width:t,height:i,seed:r}=n,s=Mi(r),a=_f(t,i,r,e.terrain),o=tf(a,t,i,s),c={population:e.population.initial,budget:e.budget.initial,day:0},l=Rl(a,c,e),u=Math.round(l.housing*.62),d=Math.max(1,o.length);return l.population=Math.max(e.population.initial,u+(d-1)*4),l.budget=e.budget.initial+Math.round(l.housing*.9)+(d-1)*40,{width:t,height:i,tiles:a,stats:l,vehicles:[],stage:Cl(l.population,e),buildCooldown:.8,nextVehicleId:1,seed:r,settlements:o,mapRevision:0,visualRevision:0,constructionIndices:[]}}function vo(n,e,t,i,r,s,a=64){if(!Tt(i.x,i.y,e,t)||!Tt(r.x,r.y,e,t))return null;const o=ze(n,i.x,i.y,e,t),c=ze(n,r.x,r.y,e,t);if(!o||!c||!s.has(o.kind)||!s.has(c.kind))return null;if(i.x===r.x&&i.y===r.y)return[{...i}];const l=(p,h)=>h*e+p,u=(p,h)=>Math.abs(p-r.x)+Math.abs(h-r.y),d=[],f=new Map,m=new Map,_=l(i.x,i.y);m.set(_,0),d.push({x:i.x,y:i.y,g:0,f:u(i.x,i.y),dx:0,dy:0});let S=0;for(;d.length>0&&S++<e*t*4;){let p=0;for(let y=1;y<d.length;y++)d[y].f<d[p].f&&(p=y);const h=d.splice(p,1)[0];if(h.x===r.x&&h.y===r.y){const y=[{x:h.x,y:h.y}];let A=h.x,M=h.y;for(;A!==i.x||M!==i.y;){const b=f.get(l(A,M));if(!b)break;A=b.x,M=b.y,y.push({x:A,y:M})}return y.reverse(),y.length>a?null:y}for(const y of dt(h.x,h.y,e,t)){const A=ze(n,y.x,y.y,e,t);if(!A||!s.has(A.kind))continue;const M=y.x-h.x,b=y.y-h.y;let E=1;(h.dx!==0||h.dy!==0)&&(M===h.dx&&b===h.dy?E=.85:E=1.2);const P=h.g+E,g=l(y.x,y.y);P>=(m.get(g)??1/0)||(m.set(g,P),f.set(g,{x:h.x,y:h.y}),d.push({x:y.x,y:y.y,g:P,f:P+u(y.x,y.y),dx:M,dy:b}))}}return null}function $i(n,e,t,i){const r=[];for(let s=0;s<t;s++)for(let a=0;a<e;a++)i(n[s*e+a])&&r.push({x:a,y:s});return r}function Dl(n){const e=[0];for(let t=1;t<n.length;t++){const i=n[t-1],r=n[t];e.push(e[t-1]+Math.hypot(r.x-i.x,r.y-i.y))}return e}function Ll(n){const e=Dl(n);return e[e.length-1]??0}function Ul(n,e){n.path=e,n.pathLens=void 0}function Nl(n){return n.pathLens&&n.pathLens.length===n.path.length||(n.pathLens=Dl(n.path)),n.pathLens}function Fl(n){const e=Nl(n);return e[e.length-1]??0}function Gf(n,e,t){if(n.length===0)return{x:0,y:0,dir:0};if(n.length===1){const m=n[0];return{x:m.x,y:m.y,dir:0}}const i=e[e.length-1],r=Math.max(0,Math.min(i,t));let s=0;for(;s<e.length-2&&e[s+1]<r;)s+=1;const a=n[s],o=n[s+1],c=e[s],l=Math.max(1e-6,e[s+1]-c),u=(r-c)/l,d=o.x-a.x,f=o.y-a.y;return{x:a.x+d*u,y:a.y+f*u,dir:Math.atan2(f,d)}}function Ol(n,e){return Gf(n.path,Nl(n),e)}const lc=[0,1,2,3,4,5],Cs=.55,Bl=160,Vf=.4,Hf=1.8;function Wf(n){if(n.kind!=="train"){n.carPoses=void 0;return}const e=n.cars??4,t=[];for(let r=0;r<e;r++)t.push(Ol(n,Math.max(0,n.progress-r*Cs)));n.carPoses=t;const i=t[0];n.x=i.x,n.y=i.y,n.dir=i.dir}function _i(n){if(n.kind==="train")Wf(n);else{const e=Ol(n,n.progress);n.x=e.x,n.y=e.y,n.dir=e.dir}}function kl(n,e,t,i=3){const r=n.filter(s=>Math.hypot(s.x-e.x,s.y-e.y)>=i);if(r.length===0){if(n.length<=1)return null;const s=n.filter(a=>a.x!==e.x||a.y!==e.y);return s.length===0?null:s[Ae(t,0,s.length-1)]}return r[Ae(t,0,r.length-1)]}function Mo(n,e,t,i,r=4e3){const s=(l,u)=>u*e+l,a=ze(n,i.x,i.y,e,t);if(!a||!ii.has(a.kind))return new Set;const o=new Set,c=[{x:i.x,y:i.y}];for(o.add(s(i.x,i.y));c.length>0&&o.size<r;){const l=c.shift();for(const u of dt(l.x,l.y,e,t)){const d=s(u.x,u.y);if(o.has(d))continue;const f=n[d];ii.has(f.kind)&&(o.add(d),c.push(u))}}return o}function Xf(n,e,t,i){if(n.length<=1)return n.map(d=>({...d}));if(n.length===2)return n.map(d=>({...d}));const r=d=>`${d.x},${d.y}`,s=n.reduce((d,f)=>d+f.x,0)/n.length,a=n.reduce((d,f)=>d+f.y,0)/n.length;let o=n[0],c=-1;for(const d of n){const f=Math.hypot(d.x-s,d.y-a);f>c&&(c=f,o=d)}const l=[{...o}],u=new Set([r(o)]);for(;l.length<n.length;){const d=l[l.length-1];let f=null,m=Number.POSITIVE_INFINITY;for(const _ of n){if(u.has(r(_)))continue;const S=Math.abs(_.x-d.x)+Math.abs(_.y-d.y);S<m&&(m=S,f=_)}if(!f)break;l.push({...f}),u.add(r(f))}return l}function zl(n,e,t,i,r,s){const a={x:Math.round(n.x),y:Math.round(n.y)},o=ze(e,a.x,a.y,t,i);let c=a;if(!o||!gt.has(o.kind)){if(r.length===0)return!1;c=r[Ae(s,0,r.length-1)]}let l=null,u=null;for(let d=0;d<8;d++){if(l=kl(r,c,s,4),!l)return!1;if(u=vo(e,t,i,c,l,gt),u&&u.length>=2)break;u=null}return!u||!l?!1:(n.destination=l,Ul(n,u),n.progress=0,_i(n),!0)}function qf(n,e,t,i,r,s,a){const o={x:Math.round(n.x),y:Math.round(n.y)},c=ze(e,o.x,o.y,t,i);let l=o;if(!c||!ii.has(c.kind)){const p=r.length>0?r:s;if(p.length===0)return!1;l=p[Ae(a,0,p.length-1)]}const u=Mo(e,t,i,l);if(u.size<2)return!1;const d=(p,h)=>h*t+p,f=r.filter(p=>u.has(d(p.x,p.y)));let m=null;if(f.length>=2){const p=Xf(f);let h=0,y=Number.POSITIVE_INFINITY;for(let A=0;A<p.length;A++){const M=p[A],b=Math.hypot(M.x-l.x,M.y-l.y);b<y&&(y=b,h=A)}if(y>1.5)m=p[h];else if(p.length===2)m=p[1-h],n.railDir=h===0?1:-1;else{let A=n.railDir??1,M=h+A;(M<0||M>=p.length)&&(A=A===1?-1:1,M=h+A),(M<0||M>=p.length)&&(M=h===0?1:h-1,A=M>h?1:-1),n.railDir=A,m=p[M]}}else{const p=s.filter(h=>u.has(d(h.x,h.y))&&(h.x!==l.x||h.y!==l.y));if(p.length===0)return!1;m=kl(p,l,a,3)}if(!m)return!1;const _=vo(e,t,i,l,m,ii,Bl);if(!_||_.length<2)return!1;n.destination={x:m.x,y:m.y},Ul(n,_);const S=n.cars??4;return n.progress=Math.min((S-1)*Cs,Fl(n)*.2),_i(n),!0}function Yf(n,e,t){if(n.length<2)return null;const i=Ae(t,3,5),r=n[0],s=n[n.length-1],a={id:e,kind:"train",x:r.x,y:r.y,dir:0,speed:2.4,progress:0,path:n.map(o=>({...o})),destination:{...s},color:0,cars:i,wait:0};return a.progress=Math.min((i-1)*Cs,Ll(a.path)*.2),_i(a),a}function $f(n,e,t,i,r,s,a,o){const c=Mi(a+o*9973>>>0),l=$i(n,e,t,p=>gt.has(p.kind)),u=$i(n,e,t,p=>p.kind==="station"),d=Math.min(40,Math.floor(s/8)+Math.floor(l.length/6)),f=i.filter(p=>{if(p.path.length<2)return!1;const h=ze(n,p.destination.x,p.destination.y,e,t);return h?p.kind==="train"?ii.has(h.kind):gt.has(h.kind):!1});let m=r,_=0,S=f.filter(p=>p.kind!=="train").length;for(;S<d&&l.length>1&&!(++_>60);){const p=l[Ae(c,0,l.length-1)],h=c();let y="car";h>.92?y="bus":h>.82&&(y="truck");const A=y==="bus"?1.6:y==="truck"?1.4:2+c()*.8,M={id:m++,kind:y,x:p.x,y:p.y,dir:0,speed:A,progress:0,path:[p,p],destination:{...p},color:lc[Ae(c,0,lc.length-1)],wait:0};zl(M,n,e,t,l,c)&&(f.push(M),S+=1)}return m=Jf(n,e,t,u,f,m,c),{vehicles:f,nextId:m}}function Kf(n,e,t,i){const r=(c,l)=>l*e+c,s=new Set(i.map(c=>r(c.x,c.y))),a=new Map(i.map(c=>[r(c.x,c.y),c])),o=[];for(;s.size>0;){const c=s.values().next().value,l=a.get(c),u=Mo(n,e,t,l),d=[];for(const f of s)u.has(f)&&d.push(a.get(f));for(const f of d)s.delete(r(f.x,f.y));d.length>0&&o.push(d)}return o}function Zf(n,e,t,i,r){if(r.length===0)return!1;const s=Mo(e,t,i,r[0]),a=(o,c)=>c*t+o;return n.some(o=>o.kind!=="train"?!1:s.has(a(Math.round(o.x),Math.round(o.y))))}function Jf(n,e,t,i,r,s,a){let o=s;if(i.length<2){if(r.every(l=>l.kind!=="train")){const l=$i(n,e,t,d=>ii.has(d.kind)),u=uc(n,e,t,i,l,o,a);u&&(r.push(u),o=u.id+1)}return o}const c=Kf(n,e,t,i);for(const l of c){if(l.length<2||Zf(r,n,e,t,l))continue;const u=uc(n,e,t,l,l,o,a);u&&(r.push(u),o=u.id+1)}return o}function uc(n,e,t,i,r,s,a){const o=i.length>=2?i:r;if(o.length<2)return null;const c=[];for(let l=0;l<o.length;l++)for(let u=l+1;u<o.length;u++){const d=o[l],f=o[u];c.push({a:d,b:f,d:Math.hypot(d.x-f.x,d.y-f.y)})}c.sort((l,u)=>u.d-l.d);for(const{a:l,b:u}of c){const d=vo(n,e,t,l,u,ii,Bl);if(!d||d.length<2)continue;const f=Ae(a,3,5),m={id:s,kind:"train",x:l.x,y:l.y,dir:0,speed:2.4,progress:0,path:d,destination:{...u},color:0,cars:f,wait:0};return m.progress=Math.min((f-1)*Cs,Ll(d)*.2),_i(m),m}return null}function Qf(n,e,t){const i=Mi(t?(t.seed^t.day*7919^n.length*104729)>>>0:1);let r=null,s=null,a=null;const o=()=>{!t||r||(r=$i(t.tiles,t.width,t.height,c=>gt.has(c.kind)),s=$i(t.tiles,t.width,t.height,c=>ii.has(c.kind)),a=$i(t.tiles,t.width,t.height,c=>c.kind==="station"))};for(const c of n){if((c.wait??0)>0){c.wait=Math.max(0,(c.wait??0)-e);continue}const l=Fl(c);if(l<.01){t&&(o(),fc(c,t,r,s,a,i));continue}if(c.progress+=c.speed*e,c.progress>=l-.001){c.progress=l,_i(c),t?(o(),fc(c,t,r,s,a,i)||(c.progress=l,_i(c))):c.progress=0,c.wait=c.kind==="train"?Hf:Vf;continue}_i(c)}}function fc(n,e,t,i,r,s){return n.kind==="train"?qf(n,e.tiles,e.width,e.height,r,i,s):zl(n,e.tiles,e.width,e.height,t,s)}function dc(n={},e){const t={width:n.width??28,height:n.height??28,seed:n.seed??42,secondsPerDay:n.secondsPerDay??2.8};return zf(t,$t)}function jf(n,e,t,i=$t){const r=[],s=kf(n.tiles,n.constructionIndices);n.constructionIndices=s.indices,s.visualChanged&&(n.visualRevision+=1),Qf(n.vehicles,e,{tiles:n.tiles,width:n.width,height:n.height,seed:n.seed,day:n.stats.day}),n.buildCooldown-=e;const a=i.buildInterval,o=Math.max(a.minSeconds,t*a.dayFactor);if(n.buildCooldown<=0){const c=Mi((n.seed^n.stats.day*374761393^2654435769)>>>0);n.buildCooldown=o*(a.jitterMin+c()*a.jitterRange);const l=n.stats.budget>320?4:n.stats.budget>180?3:n.stats.budget>90?2:1;let u=!1;for(let f=0;f<l;f++){const m=Ff(n.tiles,n.width,n.height,n.stats,n.stage,n.seed,n.stats.day*17+f,i,n.settlements);if(!m.built||!m.kind)break;if(u=!0,n.stats.budget-=m.cost,r.push(m.kind),m.trainPath&&m.trainPath.length>=2){const _=Mi((n.seed^n.stats.day*2654435761^f*2246822507)>>>0),S=Yf(m.trainPath,n.nextVehicleId,_);S&&(n.vehicles.push(S),n.nextVehicleId=S.id+1)}if(n.stats.budget+i.budget.debtLimit<40)break}u&&(n.mapRevision+=1,n.visualRevision+=1,n.constructionIndices=Bf(n.tiles)),n.stats.day+=1,n.stats=Rl(n.tiles,n.stats,i),n.stats.population=pf(n.stats,i),n.stage=Cl(n.stats.population,i),n.stats.day%3===0&&(rf(n.settlements,n.tiles,n.width,n.height),sf(n.settlements,n.tiles,n.width,n.height).merged&&r.push("merge"));const d=$f(n.tiles,n.width,n.height,n.vehicles,n.nextVehicleId,n.stats.population,n.seed,n.stats.day);n.vehicles=d.vehicles,n.nextVehicleId=d.nextId}return{state:n,events:r}}function ed(){let e=0,t=0,i=0,r=60,s=performance.now(),a=0,o=0;return{beginFrame(c){const l=Math.max(.001,(c-s)/1e3);s=c,a+=1,o+=l,o>=.5&&(r=a/o,a=0,o=0)},markSim(c){e=e*(1-.08)+c*.08},markSync(c){t=t*(1-.08)+c*.08},markDraw(c){i=i*(1-.08)+c*.08},snapshot(){return{fps:r,simMs:e,syncMs:t,drawMs:i,totalMs:e+t+i}}}}function td(n,e){const t=[`${n.fps.toFixed(0)}fps`,`sim ${n.simMs.toFixed(1)}`,`sync ${n.syncMs.toFixed(1)}`,`draw ${n.drawMs.toFixed(1)}`];return(e==null?void 0:e.calls)!=null&&t.push(`calls ${e.calls}`),(e==null?void 0:e.vehicles)!=null&&t.push(`veh ${e.vehicles}`),t.join(" · ")}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const So="185",nd=0,hc=1,id=2,cs=1,rd=2,vr=3,ri=0,Yt=1,Fn=2,Bn=0,Ki=1,pc=2,mc=3,gc=4,sd=5,di=100,ad=101,od=102,cd=103,ld=104,ud=200,fd=201,dd=202,hd=203,Ta=204,Aa=205,pd=206,md=207,gd=208,_d=209,xd=210,vd=211,Md=212,Sd=213,yd=214,Ra=0,Ca=1,wa=2,Qi=3,Pa=4,Ia=5,Da=6,La=7,Gl=0,Ed=1,bd=2,Tn=0,Vl=1,Hl=2,Wl=3,yo=4,Xl=5,ql=6,Yl=7,$l=300,Si=301,ji=302,ks=303,zs=304,ws=306,yr=1e3,On=1001,Ua=1002,Lt=1003,Td=1004,Nr=1005,Bt=1006,Gs=1007,pi=1008,Qt=1009,Kl=1010,Zl=1011,Er=1012,Eo=1013,Rn=1014,dn=1015,Vn=1016,bo=1017,To=1018,br=1020,Jl=35902,Ql=35899,jl=1021,eu=1022,hn=1023,Hn=1026,mi=1027,Ao=1028,Ro=1029,yi=1030,Co=1031,wo=1033,ls=33776,us=33777,fs=33778,ds=33779,Na=35840,Fa=35841,Oa=35842,Ba=35843,ka=36196,za=37492,Ga=37496,Va=37488,Ha=37489,gs=37490,Wa=37491,Xa=37808,qa=37809,Ya=37810,$a=37811,Ka=37812,Za=37813,Ja=37814,Qa=37815,ja=37816,eo=37817,to=37818,no=37819,io=37820,ro=37821,so=36492,ao=36494,oo=36495,co=36283,lo=36284,_s=36285,uo=36286,Ad=3200,fo=0,Rd=1,ti="",Xt="srgb",xs="srgb-linear",vs="linear",rt="srgb",wi=7680,_c=519,Cd=512,wd=513,Pd=514,Po=515,Id=516,Dd=517,Io=518,Ld=519,xc=35044,yn=35048,vc="300 es",bn=2e3,Tr=2001;function Ud(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Ms(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Nd(){const n=Ms("canvas");return n.style.display="block",n}const Mc={};function Sc(...n){const e="THREE."+n.shift();console.log(e,...n)}function tu(n){const e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Oe(...n){n=tu(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function nt(...n){n=tu(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function Zi(...n){const e=n.join(" ");e in Mc||(Mc[e]=!0,Oe(...n))}function Fd(n,e,t){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}const Od={[Ra]:Ca,[wa]:Da,[Pa]:La,[Qi]:Ia,[Ca]:Ra,[Da]:wa,[La]:Pa,[Ia]:Qi};class bi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const r=i[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const Nt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Vs=Math.PI/180,ho=180/Math.PI;function Rr(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Nt[n&255]+Nt[n>>8&255]+Nt[n>>16&255]+Nt[n>>24&255]+"-"+Nt[e&255]+Nt[e>>8&255]+"-"+Nt[e>>16&15|64]+Nt[e>>24&255]+"-"+Nt[t&63|128]+Nt[t>>8&255]+"-"+Nt[t>>16&255]+Nt[t>>24&255]+Nt[i&255]+Nt[i>>8&255]+Nt[i>>16&255]+Nt[i>>24&255]).toLowerCase()}function Je(n,e,t){return Math.max(e,Math.min(t,n))}function Bd(n,e){return(n%e+e)%e}function Hs(n,e,t){return(1-t)*n+t*e}function or(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Wt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const Oo=class Oo{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Je(this.x,e.x,t.x),this.y=Je(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Je(this.x,e,t),this.y=Je(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Je(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Je(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*r+e.x,this.y=s*r+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Oo.prototype.isVector2=!0;let Qe=Oo;class ir{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,a,o){let c=i[r+0],l=i[r+1],u=i[r+2],d=i[r+3],f=s[a+0],m=s[a+1],_=s[a+2],S=s[a+3];if(d!==S||c!==f||l!==m||u!==_){let p=c*f+l*m+u*_+d*S;p<0&&(f=-f,m=-m,_=-_,S=-S,p=-p);let h=1-o;if(p<.9995){const y=Math.acos(p),A=Math.sin(y);h=Math.sin(h*y)/A,o=Math.sin(o*y)/A,c=c*h+f*o,l=l*h+m*o,u=u*h+_*o,d=d*h+S*o}else{c=c*h+f*o,l=l*h+m*o,u=u*h+_*o,d=d*h+S*o;const y=1/Math.sqrt(c*c+l*l+u*u+d*d);c*=y,l*=y,u*=y,d*=y}}e[t]=c,e[t+1]=l,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,i,r,s,a){const o=i[r],c=i[r+1],l=i[r+2],u=i[r+3],d=s[a],f=s[a+1],m=s[a+2],_=s[a+3];return e[t]=o*_+u*d+c*m-l*f,e[t+1]=c*_+u*f+l*d-o*m,e[t+2]=l*_+u*m+o*f-c*d,e[t+3]=u*_-o*d-c*f-l*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(i/2),u=o(r/2),d=o(s/2),f=c(i/2),m=c(r/2),_=c(s/2);switch(a){case"XYZ":this._x=f*u*d+l*m*_,this._y=l*m*d-f*u*_,this._z=l*u*_+f*m*d,this._w=l*u*d-f*m*_;break;case"YXZ":this._x=f*u*d+l*m*_,this._y=l*m*d-f*u*_,this._z=l*u*_-f*m*d,this._w=l*u*d+f*m*_;break;case"ZXY":this._x=f*u*d-l*m*_,this._y=l*m*d+f*u*_,this._z=l*u*_+f*m*d,this._w=l*u*d-f*m*_;break;case"ZYX":this._x=f*u*d-l*m*_,this._y=l*m*d+f*u*_,this._z=l*u*_-f*m*d,this._w=l*u*d+f*m*_;break;case"YZX":this._x=f*u*d+l*m*_,this._y=l*m*d+f*u*_,this._z=l*u*_-f*m*d,this._w=l*u*d-f*m*_;break;case"XZY":this._x=f*u*d-l*m*_,this._y=l*m*d-f*u*_,this._z=l*u*_+f*m*d,this._w=l*u*d+f*m*_;break;default:Oe("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],a=t[1],o=t[5],c=t[9],l=t[2],u=t[6],d=t[10],f=i+o+d;if(f>0){const m=.5/Math.sqrt(f+1);this._w=.25/m,this._x=(u-c)*m,this._y=(s-l)*m,this._z=(a-r)*m}else if(i>o&&i>d){const m=2*Math.sqrt(1+i-o-d);this._w=(u-c)/m,this._x=.25*m,this._y=(r+a)/m,this._z=(s+l)/m}else if(o>d){const m=2*Math.sqrt(1+o-i-d);this._w=(s-l)/m,this._x=(r+a)/m,this._y=.25*m,this._z=(c+u)/m}else{const m=2*Math.sqrt(1+d-i-o);this._w=(a-r)/m,this._x=(s+l)/m,this._y=(c+u)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Je(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,a=e._w,o=t._x,c=t._y,l=t._z,u=t._w;return this._x=i*u+a*o+r*l-s*c,this._y=r*u+a*c+s*o-i*l,this._z=s*u+a*l+i*c-r*o,this._w=a*u-i*o-r*c-s*l,this._onChangeCallback(),this}slerp(e,t){let i=e._x,r=e._y,s=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,r=-r,s=-s,a=-a,o=-o);let c=1-t;if(o<.9995){const l=Math.acos(o),u=Math.sin(l);c=Math.sin(c*l)/u,t=Math.sin(t*l)/u,this._x=this._x*c+i*t,this._y=this._y*c+r*t,this._z=this._z*c+s*t,this._w=this._w*c+a*t,this._onChangeCallback()}else this._x=this._x*c+i*t,this._y=this._y*c+r*t,this._z=this._z*c+s*t,this._w=this._w*c+a*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Bo=class Bo{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(yc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(yc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,a=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*a,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*a,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*r-o*i),u=2*(o*t-s*r),d=2*(s*i-a*t);return this.x=t+c*l+a*d-o*u,this.y=i+c*u+o*l-s*d,this.z=r+c*d+s*u-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Je(this.x,e.x,t.x),this.y=Je(this.y,e.y,t.y),this.z=Je(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Je(this.x,e,t),this.y=Je(this.y,e,t),this.z=Je(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Je(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,a=t.x,o=t.y,c=t.z;return this.x=r*c-s*o,this.y=s*a-i*c,this.z=i*o-r*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Ws.copy(this).projectOnVector(e),this.sub(Ws)}reflect(e){return this.sub(Ws.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Je(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Bo.prototype.isVector3=!0;let V=Bo;const Ws=new V,yc=new ir,ko=class ko{constructor(e,t,i,r,s,a,o,c,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,a,o,c,l)}set(e,t,i,r,s,a,o,c,l){const u=this.elements;return u[0]=e,u[1]=r,u[2]=o,u[3]=t,u[4]=s,u[5]=c,u[6]=i,u[7]=a,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,a=i[0],o=i[3],c=i[6],l=i[1],u=i[4],d=i[7],f=i[2],m=i[5],_=i[8],S=r[0],p=r[3],h=r[6],y=r[1],A=r[4],M=r[7],b=r[2],E=r[5],P=r[8];return s[0]=a*S+o*y+c*b,s[3]=a*p+o*A+c*E,s[6]=a*h+o*M+c*P,s[1]=l*S+u*y+d*b,s[4]=l*p+u*A+d*E,s[7]=l*h+u*M+d*P,s[2]=f*S+m*y+_*b,s[5]=f*p+m*A+_*E,s[8]=f*h+m*M+_*P,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8];return t*a*u-t*o*l-i*s*u+i*o*c+r*s*l-r*a*c}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8],d=u*a-o*l,f=o*c-u*s,m=l*s-a*c,_=t*d+i*f+r*m;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const S=1/_;return e[0]=d*S,e[1]=(r*l-u*i)*S,e[2]=(o*i-r*a)*S,e[3]=f*S,e[4]=(u*t-r*c)*S,e[5]=(r*s-o*t)*S,e[6]=m*S,e[7]=(i*c-l*t)*S,e[8]=(a*t-i*s)*S,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,a,o){const c=Math.cos(s),l=Math.sin(s);return this.set(i*c,i*l,-i*(c*a+l*o)+a+e,-r*l,r*c,-r*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return Zi("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Xs.makeScale(e,t)),this}rotate(e){return Zi("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Xs.makeRotation(-e)),this}translate(e,t){return Zi("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Xs.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};ko.prototype.isMatrix3=!0;let ke=ko;const Xs=new ke,Ec=new ke().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),bc=new ke().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function kd(){const n={enabled:!0,workingColorSpace:xs,spaces:{},convert:function(r,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===rt&&(r.r=kn(r.r),r.g=kn(r.g),r.b=kn(r.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===rt&&(r.r=Ji(r.r),r.g=Ji(r.g),r.b=Ji(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===ti?vs:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,a){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return Zi("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return Zi("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[xs]:{primaries:e,whitePoint:i,transfer:vs,toXYZ:Ec,fromXYZ:bc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Xt},outputColorSpaceConfig:{drawingBufferColorSpace:Xt}},[Xt]:{primaries:e,whitePoint:i,transfer:rt,toXYZ:Ec,fromXYZ:bc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Xt}}}),n}const Ze=kd();function kn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Ji(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Pi;class zd{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Pi===void 0&&(Pi=Ms("canvas")),Pi.width=e.width,Pi.height=e.height;const r=Pi.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=Pi}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Ms("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=kn(s[a]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(kn(t[i]/255)*255):t[i]=kn(t[i]);return{data:t,width:e.width,height:e.height}}else return Oe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Gd=0;class Do{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Gd++}),this.uuid=Rr(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(qs(r[a].image)):s.push(qs(r[a]))}else s=qs(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function qs(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?zd.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Oe("Texture: Unable to serialize Texture."),{})}let Vd=0;const Ys=new V;class kt extends bi{constructor(e=kt.DEFAULT_IMAGE,t=kt.DEFAULT_MAPPING,i=On,r=On,s=Bt,a=pi,o=hn,c=Qt,l=kt.DEFAULT_ANISOTROPY,u=ti){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Vd++}),this.uuid=Rr(),this.name="",this.source=new Do(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Qe(0,0),this.repeat=new Qe(1,1),this.center=new Qe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ke,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Ys).x}get height(){return this.source.getSize(Ys).y}get depth(){return this.source.getSize(Ys).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){Oe(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){Oe(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==$l)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case yr:e.x=e.x-Math.floor(e.x);break;case On:e.x=e.x<0?0:1;break;case Ua:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case yr:e.y=e.y-Math.floor(e.y);break;case On:e.y=e.y<0?0:1;break;case Ua:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}kt.DEFAULT_IMAGE=null;kt.DEFAULT_MAPPING=$l;kt.DEFAULT_ANISOTROPY=1;const zo=class zo{constructor(e=0,t=0,i=0,r=1){this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*r+a[12]*s,this.y=a[1]*t+a[5]*i+a[9]*r+a[13]*s,this.z=a[2]*t+a[6]*i+a[10]*r+a[14]*s,this.w=a[3]*t+a[7]*i+a[11]*r+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const c=e.elements,l=c[0],u=c[4],d=c[8],f=c[1],m=c[5],_=c[9],S=c[2],p=c[6],h=c[10];if(Math.abs(u-f)<.01&&Math.abs(d-S)<.01&&Math.abs(_-p)<.01){if(Math.abs(u+f)<.1&&Math.abs(d+S)<.1&&Math.abs(_+p)<.1&&Math.abs(l+m+h-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const A=(l+1)/2,M=(m+1)/2,b=(h+1)/2,E=(u+f)/4,P=(d+S)/4,g=(_+p)/4;return A>M&&A>b?A<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(A),r=E/i,s=P/i):M>b?M<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(M),i=E/r,s=g/r):b<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(b),i=P/s,r=g/s),this.set(i,r,s,t),this}let y=Math.sqrt((p-_)*(p-_)+(d-S)*(d-S)+(f-u)*(f-u));return Math.abs(y)<.001&&(y=1),this.x=(p-_)/y,this.y=(d-S)/y,this.z=(f-u)/y,this.w=Math.acos((l+m+h-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Je(this.x,e.x,t.x),this.y=Je(this.y,e.y,t.y),this.z=Je(this.z,e.z,t.z),this.w=Je(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Je(this.x,e,t),this.y=Je(this.y,e,t),this.z=Je(this.z,e,t),this.w=Je(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Je(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};zo.prototype.isVector4=!0;let _t=zo;class Hd extends bi{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Bt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new _t(0,0,e,t),this.scissorTest=!1,this.viewport=new _t(0,0,e,t),this.textures=[];const r={width:e,height:t,depth:i.depth},s=new kt(r),a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:Bt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const r=Object.assign({},e.textures[t].image);this.textures[t].source=new Do(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class An extends Hd{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class nu extends kt{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Lt,this.minFilter=Lt,this.wrapR=On,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Wd extends kt{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Lt,this.minFilter=Lt,this.wrapR=On,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Ts=class Ts{constructor(e,t,i,r,s,a,o,c,l,u,d,f,m,_,S,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,a,o,c,l,u,d,f,m,_,S,p)}set(e,t,i,r,s,a,o,c,l,u,d,f,m,_,S,p){const h=this.elements;return h[0]=e,h[4]=t,h[8]=i,h[12]=r,h[1]=s,h[5]=a,h[9]=o,h[13]=c,h[2]=l,h[6]=u,h[10]=d,h[14]=f,h[3]=m,h[7]=_,h[11]=S,h[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ts().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,i=e.elements,r=1/Ii.setFromMatrixColumn(e,0).length(),s=1/Ii.setFromMatrixColumn(e,1).length(),a=1/Ii.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),c=Math.cos(r),l=Math.sin(r),u=Math.cos(s),d=Math.sin(s);if(e.order==="XYZ"){const f=a*u,m=a*d,_=o*u,S=o*d;t[0]=c*u,t[4]=-c*d,t[8]=l,t[1]=m+_*l,t[5]=f-S*l,t[9]=-o*c,t[2]=S-f*l,t[6]=_+m*l,t[10]=a*c}else if(e.order==="YXZ"){const f=c*u,m=c*d,_=l*u,S=l*d;t[0]=f+S*o,t[4]=_*o-m,t[8]=a*l,t[1]=a*d,t[5]=a*u,t[9]=-o,t[2]=m*o-_,t[6]=S+f*o,t[10]=a*c}else if(e.order==="ZXY"){const f=c*u,m=c*d,_=l*u,S=l*d;t[0]=f-S*o,t[4]=-a*d,t[8]=_+m*o,t[1]=m+_*o,t[5]=a*u,t[9]=S-f*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const f=a*u,m=a*d,_=o*u,S=o*d;t[0]=c*u,t[4]=_*l-m,t[8]=f*l+S,t[1]=c*d,t[5]=S*l+f,t[9]=m*l-_,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const f=a*c,m=a*l,_=o*c,S=o*l;t[0]=c*u,t[4]=S-f*d,t[8]=_*d+m,t[1]=d,t[5]=a*u,t[9]=-o*u,t[2]=-l*u,t[6]=m*d+_,t[10]=f-S*d}else if(e.order==="XZY"){const f=a*c,m=a*l,_=o*c,S=o*l;t[0]=c*u,t[4]=-d,t[8]=l*u,t[1]=f*d+S,t[5]=a*u,t[9]=m*d-_,t[2]=_*d-m,t[6]=o*u,t[10]=S*d+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Xd,e,qd)}lookAt(e,t,i){const r=this.elements;return Zt.subVectors(e,t),Zt.lengthSq()===0&&(Zt.z=1),Zt.normalize(),Yn.crossVectors(i,Zt),Yn.lengthSq()===0&&(Math.abs(i.z)===1?Zt.x+=1e-4:Zt.z+=1e-4,Zt.normalize(),Yn.crossVectors(i,Zt)),Yn.normalize(),Fr.crossVectors(Zt,Yn),r[0]=Yn.x,r[4]=Fr.x,r[8]=Zt.x,r[1]=Yn.y,r[5]=Fr.y,r[9]=Zt.y,r[2]=Yn.z,r[6]=Fr.z,r[10]=Zt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,a=i[0],o=i[4],c=i[8],l=i[12],u=i[1],d=i[5],f=i[9],m=i[13],_=i[2],S=i[6],p=i[10],h=i[14],y=i[3],A=i[7],M=i[11],b=i[15],E=r[0],P=r[4],g=r[8],v=r[12],w=r[1],R=r[5],I=r[9],D=r[13],F=r[2],L=r[6],q=r[10],B=r[14],z=r[3],J=r[7],ne=r[11],se=r[15];return s[0]=a*E+o*w+c*F+l*z,s[4]=a*P+o*R+c*L+l*J,s[8]=a*g+o*I+c*q+l*ne,s[12]=a*v+o*D+c*B+l*se,s[1]=u*E+d*w+f*F+m*z,s[5]=u*P+d*R+f*L+m*J,s[9]=u*g+d*I+f*q+m*ne,s[13]=u*v+d*D+f*B+m*se,s[2]=_*E+S*w+p*F+h*z,s[6]=_*P+S*R+p*L+h*J,s[10]=_*g+S*I+p*q+h*ne,s[14]=_*v+S*D+p*B+h*se,s[3]=y*E+A*w+M*F+b*z,s[7]=y*P+A*R+M*L+b*J,s[11]=y*g+A*I+M*q+b*ne,s[15]=y*v+A*D+M*B+b*se,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],a=e[1],o=e[5],c=e[9],l=e[13],u=e[2],d=e[6],f=e[10],m=e[14],_=e[3],S=e[7],p=e[11],h=e[15],y=c*m-l*f,A=o*m-l*d,M=o*f-c*d,b=a*m-l*u,E=a*f-c*u,P=a*d-o*u;return t*(S*y-p*A+h*M)-i*(_*y-p*b+h*E)+r*(_*A-S*b+h*P)-s*(_*M-S*E+p*P)}determinantAffine(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[1],a=e[5],o=e[9],c=e[2],l=e[6],u=e[10];return t*(a*u-o*l)-i*(s*u-o*c)+r*(s*l-a*c)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8],d=e[9],f=e[10],m=e[11],_=e[12],S=e[13],p=e[14],h=e[15],y=t*o-i*a,A=t*c-r*a,M=t*l-s*a,b=i*c-r*o,E=i*l-s*o,P=r*l-s*c,g=u*S-d*_,v=u*p-f*_,w=u*h-m*_,R=d*p-f*S,I=d*h-m*S,D=f*h-m*p,F=y*D-A*I+M*R+b*w-E*v+P*g;if(F===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const L=1/F;return e[0]=(o*D-c*I+l*R)*L,e[1]=(r*I-i*D-s*R)*L,e[2]=(S*P-p*E+h*b)*L,e[3]=(f*E-d*P-m*b)*L,e[4]=(c*w-a*D-l*v)*L,e[5]=(t*D-r*w+s*v)*L,e[6]=(p*M-_*P-h*A)*L,e[7]=(u*P-f*M+m*A)*L,e[8]=(a*I-o*w+l*g)*L,e[9]=(i*w-t*I-s*g)*L,e[10]=(_*E-S*M+h*y)*L,e[11]=(d*M-u*E-m*y)*L,e[12]=(o*v-a*R-c*g)*L,e[13]=(t*R-i*v+r*g)*L,e[14]=(S*A-_*b-p*y)*L,e[15]=(u*b-d*A+f*y)*L,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,a=e.x,o=e.y,c=e.z,l=s*a,u=s*o;return this.set(l*a+i,l*o-r*c,l*c+r*o,0,l*o+r*c,u*o+i,u*c-r*a,0,l*c-r*o,u*c+r*a,s*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,a){return this.set(1,i,s,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,a=t._y,o=t._z,c=t._w,l=s+s,u=a+a,d=o+o,f=s*l,m=s*u,_=s*d,S=a*u,p=a*d,h=o*d,y=c*l,A=c*u,M=c*d,b=i.x,E=i.y,P=i.z;return r[0]=(1-(S+h))*b,r[1]=(m+M)*b,r[2]=(_-A)*b,r[3]=0,r[4]=(m-M)*E,r[5]=(1-(f+h))*E,r[6]=(p+y)*E,r[7]=0,r[8]=(_+A)*P,r[9]=(p-y)*P,r[10]=(1-(f+S))*P,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];const s=this.determinantAffine();if(s===0)return i.set(1,1,1),t.identity(),this;let a=Ii.set(r[0],r[1],r[2]).length();const o=Ii.set(r[4],r[5],r[6]).length(),c=Ii.set(r[8],r[9],r[10]).length();s<0&&(a=-a),an.copy(this);const l=1/a,u=1/o,d=1/c;return an.elements[0]*=l,an.elements[1]*=l,an.elements[2]*=l,an.elements[4]*=u,an.elements[5]*=u,an.elements[6]*=u,an.elements[8]*=d,an.elements[9]*=d,an.elements[10]*=d,t.setFromRotationMatrix(an),i.x=a,i.y=o,i.z=c,this}makePerspective(e,t,i,r,s,a,o=bn,c=!1){const l=this.elements,u=2*s/(t-e),d=2*s/(i-r),f=(t+e)/(t-e),m=(i+r)/(i-r);let _,S;if(c)_=s/(a-s),S=a*s/(a-s);else if(o===bn)_=-(a+s)/(a-s),S=-2*a*s/(a-s);else if(o===Tr)_=-a/(a-s),S=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=u,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=d,l[9]=m,l[13]=0,l[2]=0,l[6]=0,l[10]=_,l[14]=S,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,r,s,a,o=bn,c=!1){const l=this.elements,u=2/(t-e),d=2/(i-r),f=-(t+e)/(t-e),m=-(i+r)/(i-r);let _,S;if(c)_=1/(a-s),S=a/(a-s);else if(o===bn)_=-2/(a-s),S=-(a+s)/(a-s);else if(o===Tr)_=-1/(a-s),S=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=u,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=d,l[9]=0,l[13]=m,l[2]=0,l[6]=0,l[10]=_,l[14]=S,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};Ts.prototype.isMatrix4=!0;let pt=Ts;const Ii=new V,an=new pt,Xd=new V(0,0,0),qd=new V(1,1,1),Yn=new V,Fr=new V,Zt=new V,Tc=new pt,Ac=new ir;class si{constructor(e=0,t=0,i=0,r=si.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],c=r[1],l=r[5],u=r[9],d=r[2],f=r[6],m=r[10];switch(t){case"XYZ":this._y=Math.asin(Je(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,m),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Je(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(Je(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,m),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-Je(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,m),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Je(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-Je(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,m),this._y=0);break;default:Oe("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Tc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Tc,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Ac.setFromEuler(this),this.setFromQuaternion(Ac,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}si.DEFAULT_ORDER="XYZ";class iu{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Yd=0;const Rc=new V,Di=new ir,Pn=new pt,Or=new V,cr=new V,$d=new V,Kd=new ir,Cc=new V(1,0,0),wc=new V(0,1,0),Pc=new V(0,0,1),Ic={type:"added"},Zd={type:"removed"},Li={type:"childadded",child:null},$s={type:"childremoved",child:null};class bt extends bi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Yd++}),this.uuid=Rr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=bt.DEFAULT_UP.clone();const e=new V,t=new si,i=new ir,r=new V(1,1,1);function s(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new pt},normalMatrix:{value:new ke}}),this.matrix=new pt,this.matrixWorld=new pt,this.matrixAutoUpdate=bt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=bt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new iu,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Di.setFromAxisAngle(e,t),this.quaternion.multiply(Di),this}rotateOnWorldAxis(e,t){return Di.setFromAxisAngle(e,t),this.quaternion.premultiply(Di),this}rotateX(e){return this.rotateOnAxis(Cc,e)}rotateY(e){return this.rotateOnAxis(wc,e)}rotateZ(e){return this.rotateOnAxis(Pc,e)}translateOnAxis(e,t){return Rc.copy(e).applyQuaternion(this.quaternion),this.position.add(Rc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Cc,e)}translateY(e){return this.translateOnAxis(wc,e)}translateZ(e){return this.translateOnAxis(Pc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Pn.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Or.copy(e):Or.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),cr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Pn.lookAt(cr,Or,this.up):Pn.lookAt(Or,cr,this.up),this.quaternion.setFromRotationMatrix(Pn),r&&(Pn.extractRotation(r.matrixWorld),Di.setFromRotationMatrix(Pn),this.quaternion.premultiply(Di.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(nt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Ic),Li.child=e,this.dispatchEvent(Li),Li.child=null):nt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Zd),$s.child=e,this.dispatchEvent($s),$s.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Pn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Pn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Pn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Ic),Li.child=e,this.dispatchEvent(Li),Li.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(cr,e,$d),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(cr,Kd,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,r=e.z,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*i-s[8]*r,s[13]+=i-s[1]*t-s[5]*i-s[9]*r,s[14]+=r-s[2]*t-s[6]*i-s[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){const r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){const s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].updateWorldMatrix(!1,!0,i)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),this.static!==!1&&(r.static=this.static),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(o=>({...o})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){const d=c[l];s(e.shapes,d)}else s(e.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(s(e.materials,this.material[c]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];r.animations.push(s(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),u=a(e.images),d=a(e.shapes),f=a(e.skeletons),m=a(e.animations),_=a(e.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),u.length>0&&(i.images=u),d.length>0&&(i.shapes=d),f.length>0&&(i.skeletons=f),m.length>0&&(i.animations=m),_.length>0&&(i.nodes=_)}return i.object=r,i;function a(o){const c=[];for(const l in o){const u=o[l];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}bt.DEFAULT_UP=new V(0,1,0);bt.DEFAULT_MATRIX_AUTO_UPDATE=!0;bt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Pt extends bt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Jd={type:"move"};class Ks{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Pt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Pt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new V,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new V),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Pt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new V,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new V,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const S of e.hand.values()){const p=t.getJointPose(S,i),h=this._getHandJoint(l,S);p!==null&&(h.matrix.fromArray(p.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,h.jointRadius=p.radius),h.visible=p!==null}const u=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],f=u.position.distanceTo(d.position),m=.02,_=.005;l.inputState.pinching&&f>m+_?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&f<=m-_&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Jd)))}return o!==null&&(o.visible=r!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Pt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const ru={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},$n={h:0,s:0,l:0},Br={h:0,s:0,l:0};function Zs(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class Ye{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Xt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ze.colorSpaceToWorking(this,t),this}setRGB(e,t,i,r=Ze.workingColorSpace){return this.r=e,this.g=t,this.b=i,Ze.colorSpaceToWorking(this,r),this}setHSL(e,t,i,r=Ze.workingColorSpace){if(e=Bd(e,1),t=Je(t,0,1),i=Je(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,a=2*i-s;this.r=Zs(a,s,e+1/3),this.g=Zs(a,s,e),this.b=Zs(a,s,e-1/3)}return Ze.colorSpaceToWorking(this,r),this}setStyle(e,t=Xt){function i(s){s!==void 0&&parseFloat(s)<1&&Oe("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:Oe("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);Oe("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Xt){const i=ru[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Oe("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=kn(e.r),this.g=kn(e.g),this.b=kn(e.b),this}copyLinearToSRGB(e){return this.r=Ji(e.r),this.g=Ji(e.g),this.b=Ji(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Xt){return Ze.workingToColorSpace(Ft.copy(this),e),Math.round(Je(Ft.r*255,0,255))*65536+Math.round(Je(Ft.g*255,0,255))*256+Math.round(Je(Ft.b*255,0,255))}getHexString(e=Xt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ze.workingColorSpace){Ze.workingToColorSpace(Ft.copy(this),t);const i=Ft.r,r=Ft.g,s=Ft.b,a=Math.max(i,r,s),o=Math.min(i,r,s);let c,l;const u=(o+a)/2;if(o===a)c=0,l=0;else{const d=a-o;switch(l=u<=.5?d/(a+o):d/(2-a-o),a){case i:c=(r-s)/d+(r<s?6:0);break;case r:c=(s-i)/d+2;break;case s:c=(i-r)/d+4;break}c/=6}return e.h=c,e.s=l,e.l=u,e}getRGB(e,t=Ze.workingColorSpace){return Ze.workingToColorSpace(Ft.copy(this),t),e.r=Ft.r,e.g=Ft.g,e.b=Ft.b,e}getStyle(e=Xt){Ze.workingToColorSpace(Ft.copy(this),e);const t=Ft.r,i=Ft.g,r=Ft.b;return e!==Xt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL($n),this.setHSL($n.h+e,$n.s+t,$n.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL($n),e.getHSL(Br);const i=Hs($n.h,Br.h,t),r=Hs($n.s,Br.s,t),s=Hs($n.l,Br.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ft=new Ye;Ye.NAMES=ru;class Lo{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Ye(e),this.density=t}clone(){return new Lo(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Qd extends bt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new si,this.environmentIntensity=1,this.environmentRotation=new si,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const on=new V,In=new V,Js=new V,Dn=new V,Ui=new V,Ni=new V,Dc=new V,Qs=new V,js=new V,ea=new V,ta=new _t,na=new _t,ia=new _t;class fn{constructor(e=new V,t=new V,i=new V){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),on.subVectors(e,t),r.cross(on);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){on.subVectors(r,t),In.subVectors(i,t),Js.subVectors(e,t);const a=on.dot(on),o=on.dot(In),c=on.dot(Js),l=In.dot(In),u=In.dot(Js),d=a*l-o*o;if(d===0)return s.set(0,0,0),null;const f=1/d,m=(l*c-o*u)*f,_=(a*u-o*c)*f;return s.set(1-m-_,_,m)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,Dn)===null?!1:Dn.x>=0&&Dn.y>=0&&Dn.x+Dn.y<=1}static getInterpolation(e,t,i,r,s,a,o,c){return this.getBarycoord(e,t,i,r,Dn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,Dn.x),c.addScaledVector(a,Dn.y),c.addScaledVector(o,Dn.z),c)}static getInterpolatedAttribute(e,t,i,r,s,a){return ta.setScalar(0),na.setScalar(0),ia.setScalar(0),ta.fromBufferAttribute(e,t),na.fromBufferAttribute(e,i),ia.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(ta,s.x),a.addScaledVector(na,s.y),a.addScaledVector(ia,s.z),a}static isFrontFacing(e,t,i,r){return on.subVectors(i,t),In.subVectors(e,t),on.cross(In).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return on.subVectors(this.c,this.b),In.subVectors(this.a,this.b),on.cross(In).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return fn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return fn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return fn.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return fn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return fn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let a,o;Ui.subVectors(r,i),Ni.subVectors(s,i),Qs.subVectors(e,i);const c=Ui.dot(Qs),l=Ni.dot(Qs);if(c<=0&&l<=0)return t.copy(i);js.subVectors(e,r);const u=Ui.dot(js),d=Ni.dot(js);if(u>=0&&d<=u)return t.copy(r);const f=c*d-u*l;if(f<=0&&c>=0&&u<=0)return a=c/(c-u),t.copy(i).addScaledVector(Ui,a);ea.subVectors(e,s);const m=Ui.dot(ea),_=Ni.dot(ea);if(_>=0&&m<=_)return t.copy(s);const S=m*l-c*_;if(S<=0&&l>=0&&_<=0)return o=l/(l-_),t.copy(i).addScaledVector(Ni,o);const p=u*_-m*d;if(p<=0&&d-u>=0&&m-_>=0)return Dc.subVectors(s,r),o=(d-u)/(d-u+(m-_)),t.copy(r).addScaledVector(Dc,o);const h=1/(p+S+f);return a=S*h,o=f*h,t.copy(i).addScaledVector(Ui,a).addScaledVector(Ni,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Ti{constructor(e=new V(1/0,1/0,1/0),t=new V(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(cn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(cn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=cn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,cn):cn.fromBufferAttribute(s,a),cn.applyMatrix4(e.matrixWorld),this.expandByPoint(cn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),kr.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),kr.copy(i.boundingBox)),kr.applyMatrix4(e.matrixWorld),this.union(kr)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,cn),cn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(lr),zr.subVectors(this.max,lr),Fi.subVectors(e.a,lr),Oi.subVectors(e.b,lr),Bi.subVectors(e.c,lr),Kn.subVectors(Oi,Fi),Zn.subVectors(Bi,Oi),oi.subVectors(Fi,Bi);let t=[0,-Kn.z,Kn.y,0,-Zn.z,Zn.y,0,-oi.z,oi.y,Kn.z,0,-Kn.x,Zn.z,0,-Zn.x,oi.z,0,-oi.x,-Kn.y,Kn.x,0,-Zn.y,Zn.x,0,-oi.y,oi.x,0];return!ra(t,Fi,Oi,Bi,zr)||(t=[1,0,0,0,1,0,0,0,1],!ra(t,Fi,Oi,Bi,zr))?!1:(Gr.crossVectors(Kn,Zn),t=[Gr.x,Gr.y,Gr.z],ra(t,Fi,Oi,Bi,zr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,cn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(cn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Ln[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ln[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ln[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ln[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ln[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ln[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ln[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ln[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ln),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Ln=[new V,new V,new V,new V,new V,new V,new V,new V],cn=new V,kr=new Ti,Fi=new V,Oi=new V,Bi=new V,Kn=new V,Zn=new V,oi=new V,lr=new V,zr=new V,Gr=new V,ci=new V;function ra(n,e,t,i,r){for(let s=0,a=n.length-3;s<=a;s+=3){ci.fromArray(n,s);const o=r.x*Math.abs(ci.x)+r.y*Math.abs(ci.y)+r.z*Math.abs(ci.z),c=e.dot(ci),l=t.dot(ci),u=i.dot(ci);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>o)return!1}return!0}const Et=new V,Vr=new Qe;let jd=0;class pn extends bi{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:jd++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=xc,this.updateRanges=[],this.gpuType=dn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Vr.fromBufferAttribute(this,t),Vr.applyMatrix3(e),this.setXY(t,Vr.x,Vr.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Et.fromBufferAttribute(this,t),Et.applyMatrix3(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Et.fromBufferAttribute(this,t),Et.applyMatrix4(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Et.fromBufferAttribute(this,t),Et.applyNormalMatrix(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Et.fromBufferAttribute(this,t),Et.transformDirection(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=or(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Wt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=or(t,this.array)),t}setX(e,t){return this.normalized&&(t=Wt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=or(t,this.array)),t}setY(e,t){return this.normalized&&(t=Wt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=or(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Wt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=or(t,this.array)),t}setW(e,t){return this.normalized&&(t=Wt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Wt(t,this.array),i=Wt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=Wt(t,this.array),i=Wt(i,this.array),r=Wt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=Wt(t,this.array),i=Wt(i,this.array),r=Wt(r,this.array),s=Wt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==xc&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class su extends pn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class au extends pn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class Ht extends pn{constructor(e,t,i){super(new Float32Array(e),t,i)}}const eh=new Ti,ur=new V,sa=new V;class Cr{constructor(e=new V,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):eh.setFromPoints(e).getCenter(i);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ur.subVectors(e,this.center);const t=ur.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(ur,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(sa.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ur.copy(e.center).add(sa)),this.expandByPoint(ur.copy(e.center).sub(sa))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let th=0;const nn=new pt,aa=new bt,ki=new V,Jt=new Ti,fr=new Ti,wt=new V;class mn extends bi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:th++}),this.uuid=Rr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Ud(e)?au:su)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new ke().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return nn.makeRotationFromQuaternion(e),this.applyMatrix4(nn),this}rotateX(e){return nn.makeRotationX(e),this.applyMatrix4(nn),this}rotateY(e){return nn.makeRotationY(e),this.applyMatrix4(nn),this}rotateZ(e){return nn.makeRotationZ(e),this.applyMatrix4(nn),this}translate(e,t,i){return nn.makeTranslation(e,t,i),this.applyMatrix4(nn),this}scale(e,t,i){return nn.makeScale(e,t,i),this.applyMatrix4(nn),this}lookAt(e){return aa.lookAt(e),aa.updateMatrix(),this.applyMatrix4(aa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ki).negate(),this.translate(ki.x,ki.y,ki.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const a=e[r];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Ht(i,3))}else{const i=Math.min(e.length,t.count);for(let r=0;r<i;r++){const s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&Oe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ti);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){nt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new V(-1/0,-1/0,-1/0),new V(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];Jt.setFromBufferAttribute(s),this.morphTargetsRelative?(wt.addVectors(this.boundingBox.min,Jt.min),this.boundingBox.expandByPoint(wt),wt.addVectors(this.boundingBox.max,Jt.max),this.boundingBox.expandByPoint(wt)):(this.boundingBox.expandByPoint(Jt.min),this.boundingBox.expandByPoint(Jt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&nt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Cr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){nt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new V,1/0);return}if(e){const i=this.boundingSphere.center;if(Jt.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];fr.setFromBufferAttribute(o),this.morphTargetsRelative?(wt.addVectors(Jt.min,fr.min),Jt.expandByPoint(wt),wt.addVectors(Jt.max,fr.max),Jt.expandByPoint(wt)):(Jt.expandByPoint(fr.min),Jt.expandByPoint(fr.max))}Jt.getCenter(i);let r=0;for(let s=0,a=e.count;s<a;s++)wt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(wt));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],c=this.morphTargetsRelative;for(let l=0,u=o.count;l<u;l++)wt.fromBufferAttribute(o,l),c&&(ki.fromBufferAttribute(e,l),wt.add(ki)),r=Math.max(r,i.distanceToSquared(wt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&nt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){nt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,s=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==i.count)&&(a=new pn(new Float32Array(4*i.count),4),this.setAttribute("tangent",a));const o=[],c=[];for(let g=0;g<i.count;g++)o[g]=new V,c[g]=new V;const l=new V,u=new V,d=new V,f=new Qe,m=new Qe,_=new Qe,S=new V,p=new V;function h(g,v,w){l.fromBufferAttribute(i,g),u.fromBufferAttribute(i,v),d.fromBufferAttribute(i,w),f.fromBufferAttribute(s,g),m.fromBufferAttribute(s,v),_.fromBufferAttribute(s,w),u.sub(l),d.sub(l),m.sub(f),_.sub(f);const R=1/(m.x*_.y-_.x*m.y);isFinite(R)&&(S.copy(u).multiplyScalar(_.y).addScaledVector(d,-m.y).multiplyScalar(R),p.copy(d).multiplyScalar(m.x).addScaledVector(u,-_.x).multiplyScalar(R),o[g].add(S),o[v].add(S),o[w].add(S),c[g].add(p),c[v].add(p),c[w].add(p))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let g=0,v=y.length;g<v;++g){const w=y[g],R=w.start,I=w.count;for(let D=R,F=R+I;D<F;D+=3)h(e.getX(D+0),e.getX(D+1),e.getX(D+2))}const A=new V,M=new V,b=new V,E=new V;function P(g){b.fromBufferAttribute(r,g),E.copy(b);const v=o[g];A.copy(v),A.sub(b.multiplyScalar(b.dot(v))).normalize(),M.crossVectors(E,v);const R=M.dot(c[g])<0?-1:1;a.setXYZW(g,A.x,A.y,A.z,R)}for(let g=0,v=y.length;g<v;++g){const w=y[g],R=w.start,I=w.count;for(let D=R,F=R+I;D<F;D+=3)P(e.getX(D+0)),P(e.getX(D+1)),P(e.getX(D+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new pn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let f=0,m=i.count;f<m;f++)i.setXYZ(f,0,0,0);const r=new V,s=new V,a=new V,o=new V,c=new V,l=new V,u=new V,d=new V;if(e)for(let f=0,m=e.count;f<m;f+=3){const _=e.getX(f+0),S=e.getX(f+1),p=e.getX(f+2);r.fromBufferAttribute(t,_),s.fromBufferAttribute(t,S),a.fromBufferAttribute(t,p),u.subVectors(a,s),d.subVectors(r,s),u.cross(d),o.fromBufferAttribute(i,_),c.fromBufferAttribute(i,S),l.fromBufferAttribute(i,p),o.add(u),c.add(u),l.add(u),i.setXYZ(_,o.x,o.y,o.z),i.setXYZ(S,c.x,c.y,c.z),i.setXYZ(p,l.x,l.y,l.z)}else for(let f=0,m=t.count;f<m;f+=3)r.fromBufferAttribute(t,f+0),s.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),u.subVectors(a,s),d.subVectors(r,s),u.cross(d),i.setXYZ(f+0,u.x,u.y,u.z),i.setXYZ(f+1,u.x,u.y,u.z),i.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)wt.fromBufferAttribute(e,t),wt.normalize(),e.setXYZ(t,wt.x,wt.y,wt.z)}toNonIndexed(){function e(o,c){const l=o.array,u=o.itemSize,d=o.normalized,f=new l.constructor(c.length*u);let m=0,_=0;for(let S=0,p=c.length;S<p;S++){o.isInterleavedBufferAttribute?m=c[S]*o.data.stride+o.offset:m=c[S]*u;for(let h=0;h<u;h++)f[_++]=l[m++]}return new pn(f,u,d)}if(this.index===null)return Oe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new mn,i=this.index.array,r=this.attributes;for(const o in r){const c=r[o],l=e(c,i);t.setAttribute(o,l)}const s=this.morphAttributes;for(const o in s){const c=[],l=s[o];for(let u=0,d=l.length;u<d;u++){const f=l[u],m=e(f,i);c.push(m)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const c in i){const l=i[c];e.data.attributes[c]=l.toJSON(e.data)}const r={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],u=[];for(let d=0,f=l.length;d<f;d++){const m=l[d];u.push(m.toJSON(e.data))}u.length>0&&(r[c]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const r=e.attributes;for(const l in r){const u=r[l];this.setAttribute(l,u.clone(t))}const s=e.morphAttributes;for(const l in s){const u=[],d=s[l];for(let f=0,m=d.length;f<m;f++)u.push(d[f].clone(t));this.morphAttributes[l]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,u=a.length;l<u;l++){const d=a[l];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}let nh=0;class wr extends bi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:nh++}),this.uuid=Rr(),this.name="",this.type="Material",this.blending=Ki,this.side=ri,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ta,this.blendDst=Aa,this.blendEquation=di,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ye(0,0,0),this.blendAlpha=0,this.depthFunc=Qi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=_c,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=wi,this.stencilZFail=wi,this.stencilZPass=wi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){Oe(`Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){Oe(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector2&&i&&i.isVector2||r&&r.isEuler&&i&&i.isEuler||r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Ki&&(i.blending=this.blending),this.side!==ri&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Ta&&(i.blendSrc=this.blendSrc),this.blendDst!==Aa&&(i.blendDst=this.blendDst),this.blendEquation!==di&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Qi&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==_c&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==wi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==wi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==wi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const a=[];for(const o in s){const c=s[o];delete c.metadata,a.push(c)}return a}if(t){const s=r(e.textures),a=r(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Ye().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new Qe().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Qe().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Un=new V,oa=new V,Hr=new V,Jn=new V,ca=new V,Wr=new V,la=new V;class ih{constructor(e=new V,t=new V(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Un)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Un.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Un.copy(this.origin).addScaledVector(this.direction,t),Un.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){oa.copy(e).add(t).multiplyScalar(.5),Hr.copy(t).sub(e).normalize(),Jn.copy(this.origin).sub(oa);const s=e.distanceTo(t)*.5,a=-this.direction.dot(Hr),o=Jn.dot(this.direction),c=-Jn.dot(Hr),l=Jn.lengthSq(),u=Math.abs(1-a*a);let d,f,m,_;if(u>0)if(d=a*c-o,f=a*o-c,_=s*u,d>=0)if(f>=-_)if(f<=_){const S=1/u;d*=S,f*=S,m=d*(d+a*f+2*o)+f*(a*d+f+2*c)+l}else f=s,d=Math.max(0,-(a*f+o)),m=-d*d+f*(f+2*c)+l;else f=-s,d=Math.max(0,-(a*f+o)),m=-d*d+f*(f+2*c)+l;else f<=-_?(d=Math.max(0,-(-a*s+o)),f=d>0?-s:Math.min(Math.max(-s,-c),s),m=-d*d+f*(f+2*c)+l):f<=_?(d=0,f=Math.min(Math.max(-s,-c),s),m=f*(f+2*c)+l):(d=Math.max(0,-(a*s+o)),f=d>0?s:Math.min(Math.max(-s,-c),s),m=-d*d+f*(f+2*c)+l);else f=a>0?-s:s,d=Math.max(0,-(a*f+o)),m=-d*d+f*(f+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,d),r&&r.copy(oa).addScaledVector(Hr,f),m}intersectSphere(e,t){Un.subVectors(e.center,this.origin);const i=Un.dot(this.direction),r=Un.dot(Un)-i*i,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=i-a,c=i+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,a,o,c;const l=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,f=this.origin;return l>=0?(i=(e.min.x-f.x)*l,r=(e.max.x-f.x)*l):(i=(e.max.x-f.x)*l,r=(e.min.x-f.x)*l),u>=0?(s=(e.min.y-f.y)*u,a=(e.max.y-f.y)*u):(s=(e.max.y-f.y)*u,a=(e.min.y-f.y)*u),i>a||s>r||((s>i||isNaN(i))&&(i=s),(a<r||isNaN(r))&&(r=a),d>=0?(o=(e.min.z-f.z)*d,c=(e.max.z-f.z)*d):(o=(e.max.z-f.z)*d,c=(e.min.z-f.z)*d),i>c||o>r)||((o>i||i!==i)&&(i=o),(c<r||r!==r)&&(r=c),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,Un)!==null}intersectTriangle(e,t,i,r,s){ca.subVectors(t,e),Wr.subVectors(i,e),la.crossVectors(ca,Wr);let a=this.direction.dot(la),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Jn.subVectors(this.origin,e);const c=o*this.direction.dot(Wr.crossVectors(Jn,Wr));if(c<0)return null;const l=o*this.direction.dot(ca.cross(Jn));if(l<0||c+l>a)return null;const u=-o*Jn.dot(la);return u<0?null:this.at(u/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ou extends wr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ye(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new si,this.combine=Gl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Lc=new pt,li=new ih,Xr=new Cr,Uc=new V,qr=new V,Yr=new V,$r=new V,ua=new V,Kr=new V,Nc=new V,Zr=new V;class Mt extends bt{constructor(e=new mn,t=new ou){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){Kr.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const u=o[c],d=s[c];u!==0&&(ua.fromBufferAttribute(d,e),a?Kr.addScaledVector(ua,u):Kr.addScaledVector(ua.sub(t),u))}t.add(Kr)}return t}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Xr.copy(i.boundingSphere),Xr.applyMatrix4(s),li.copy(e.ray).recast(e.near),!(Xr.containsPoint(li.origin)===!1&&(li.intersectSphere(Xr,Uc)===null||li.origin.distanceToSquared(Uc)>(e.far-e.near)**2))&&(Lc.copy(s).invert(),li.copy(e.ray).applyMatrix4(Lc),!(i.boundingBox!==null&&li.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,li)))}_computeIntersections(e,t,i){let r;const s=this.geometry,a=this.material,o=s.index,c=s.attributes.position,l=s.attributes.uv,u=s.attributes.uv1,d=s.attributes.normal,f=s.groups,m=s.drawRange;if(o!==null)if(Array.isArray(a))for(let _=0,S=f.length;_<S;_++){const p=f[_],h=a[p.materialIndex],y=Math.max(p.start,m.start),A=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let M=y,b=A;M<b;M+=3){const E=o.getX(M),P=o.getX(M+1),g=o.getX(M+2);r=Jr(this,h,e,i,l,u,d,E,P,g),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=p.materialIndex,t.push(r))}}else{const _=Math.max(0,m.start),S=Math.min(o.count,m.start+m.count);for(let p=_,h=S;p<h;p+=3){const y=o.getX(p),A=o.getX(p+1),M=o.getX(p+2);r=Jr(this,a,e,i,l,u,d,y,A,M),r&&(r.faceIndex=Math.floor(p/3),t.push(r))}}else if(c!==void 0)if(Array.isArray(a))for(let _=0,S=f.length;_<S;_++){const p=f[_],h=a[p.materialIndex],y=Math.max(p.start,m.start),A=Math.min(c.count,Math.min(p.start+p.count,m.start+m.count));for(let M=y,b=A;M<b;M+=3){const E=M,P=M+1,g=M+2;r=Jr(this,h,e,i,l,u,d,E,P,g),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=p.materialIndex,t.push(r))}}else{const _=Math.max(0,m.start),S=Math.min(c.count,m.start+m.count);for(let p=_,h=S;p<h;p+=3){const y=p,A=p+1,M=p+2;r=Jr(this,a,e,i,l,u,d,y,A,M),r&&(r.faceIndex=Math.floor(p/3),t.push(r))}}}}function rh(n,e,t,i,r,s,a,o){let c;if(e.side===Yt?c=i.intersectTriangle(a,s,r,!0,o):c=i.intersectTriangle(r,s,a,e.side===ri,o),c===null)return null;Zr.copy(o),Zr.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(Zr);return l<t.near||l>t.far?null:{distance:l,point:Zr.clone(),object:n}}function Jr(n,e,t,i,r,s,a,o,c,l){n.getVertexPosition(o,qr),n.getVertexPosition(c,Yr),n.getVertexPosition(l,$r);const u=rh(n,e,t,i,qr,Yr,$r,Nc);if(u){const d=new V;fn.getBarycoord(Nc,qr,Yr,$r,d),r&&(u.uv=fn.getInterpolatedAttribute(r,o,c,l,d,new Qe)),s&&(u.uv1=fn.getInterpolatedAttribute(s,o,c,l,d,new Qe)),a&&(u.normal=fn.getInterpolatedAttribute(a,o,c,l,d,new V),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const f={a:o,b:c,c:l,normal:new V,materialIndex:0};fn.getNormal(qr,Yr,$r,f.normal),u.face=f,u.barycoord=d}return u}class cu extends kt{constructor(e=null,t=1,i=1,r,s,a,o,c,l=Lt,u=Lt,d,f){super(null,a,o,c,l,u,r,s,d,f),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class po extends pn{constructor(e,t,i,r=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const zi=new pt,Fc=new pt,Qr=[],Oc=new Ti,sh=new pt,dr=new Mt,hr=new Cr;class rn extends Mt{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new po(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<i;r++)this.setMatrixAt(r,sh)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Ti),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,zi),Oc.copy(e.boundingBox).applyMatrix4(zi),this.boundingBox.union(Oc)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Cr),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,zi),hr.copy(e.boundingSphere).applyMatrix4(zi),this.boundingSphere.union(hr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,r=this.morphTexture.source.data.data,s=i.length+1,a=e*s+1;for(let o=0;o<i.length;o++)i[o]=r[a+o]}raycast(e,t){const i=this.matrixWorld,r=this.count;if(dr.geometry=this.geometry,dr.material=this.material,dr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),hr.copy(this.boundingSphere),hr.applyMatrix4(i),e.ray.intersectsSphere(hr)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,zi),Fc.multiplyMatrices(i,zi),dr.matrixWorld=Fc,dr.raycast(e,Qr);for(let a=0,o=Qr.length;a<o;a++){const c=Qr[a];c.instanceId=s,c.object=this,t.push(c)}Qr.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new po(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){const i=t.morphTargetInfluences,r=i.length+1;this.morphTexture===null&&(this.morphTexture=new cu(new Float32Array(r*this.count),r,this.count,Ao,dn));const s=this.morphTexture.source.data.data;let a=0;for(let l=0;l<i.length;l++)a+=i[l];const o=this.geometry.morphTargetsRelative?1:1-a,c=r*e;return s[c]=o,s.set(i,c+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const fa=new V,ah=new V,oh=new ke;class fi{constructor(e=new V(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=fa.subVectors(i,t).cross(ah.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const r=e.delta(fa),s=this.normal.dot(r);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/s;return i===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||oh.getNormalMatrix(e),r=this.coplanarPoint(fa).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ui=new Cr,ch=new Qe(.5,.5),jr=new V;class Uo{constructor(e=new fi,t=new fi,i=new fi,r=new fi,s=new fi,a=new fi){this.planes=[e,t,i,r,s,a]}set(e,t,i,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=bn,i=!1){const r=this.planes,s=e.elements,a=s[0],o=s[1],c=s[2],l=s[3],u=s[4],d=s[5],f=s[6],m=s[7],_=s[8],S=s[9],p=s[10],h=s[11],y=s[12],A=s[13],M=s[14],b=s[15];if(r[0].setComponents(l-a,m-u,h-_,b-y).normalize(),r[1].setComponents(l+a,m+u,h+_,b+y).normalize(),r[2].setComponents(l+o,m+d,h+S,b+A).normalize(),r[3].setComponents(l-o,m-d,h-S,b-A).normalize(),i)r[4].setComponents(c,f,p,M).normalize(),r[5].setComponents(l-c,m-f,h-p,b-M).normalize();else if(r[4].setComponents(l-c,m-f,h-p,b-M).normalize(),t===bn)r[5].setComponents(l+c,m+f,h+p,b+M).normalize();else if(t===Tr)r[5].setComponents(c,f,p,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ui.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ui.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ui)}intersectsSprite(e){ui.center.set(0,0,0);const t=ch.distanceTo(e.center);return ui.radius=.7071067811865476+t,ui.applyMatrix4(e.matrixWorld),this.intersectsSphere(ui)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(jr.x=r.normal.x>0?e.max.x:e.min.x,jr.y=r.normal.y>0?e.max.y:e.min.y,jr.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(jr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class lu extends kt{constructor(e=[],t=Si,i,r,s,a,o,c,l,u){super(e,t,i,r,s,a,o,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class lh extends kt{constructor(e,t,i,r,s,a,o,c,l){super(e,t,i,r,s,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class er extends kt{constructor(e,t,i=Rn,r,s,a,o=Lt,c=Lt,l,u=Hn,d=1){if(u!==Hn&&u!==mi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:e,height:t,depth:d};super(f,r,s,a,o,c,u,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Do(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class uh extends er{constructor(e,t=Rn,i=Si,r,s,a=Lt,o=Lt,c,l=Hn){const u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,t,i,r,s,a,o,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class uu extends kt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class qt extends mn{constructor(e=1,t=1,i=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const c=[],l=[],u=[],d=[];let f=0,m=0;_("z","y","x",-1,-1,i,t,e,a,s,0),_("z","y","x",1,-1,i,t,-e,a,s,1),_("x","z","y",1,1,e,i,t,r,a,2),_("x","z","y",1,-1,e,i,-t,r,a,3),_("x","y","z",1,-1,e,t,i,r,s,4),_("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(c),this.setAttribute("position",new Ht(l,3)),this.setAttribute("normal",new Ht(u,3)),this.setAttribute("uv",new Ht(d,2));function _(S,p,h,y,A,M,b,E,P,g,v){const w=M/P,R=b/g,I=M/2,D=b/2,F=E/2,L=P+1,q=g+1;let B=0,z=0;const J=new V;for(let ne=0;ne<q;ne++){const se=ne*R-D;for(let de=0;de<L;de++){const Ue=de*w-I;J[S]=Ue*y,J[p]=se*A,J[h]=F,l.push(J.x,J.y,J.z),J[S]=0,J[p]=0,J[h]=E>0?1:-1,u.push(J.x,J.y,J.z),d.push(de/P),d.push(1-ne/g),B+=1}}for(let ne=0;ne<g;ne++)for(let se=0;se<P;se++){const de=f+se+L*ne,Ue=f+se+L*(ne+1),$e=f+(se+1)+L*(ne+1),Ge=f+(se+1)+L*ne;c.push(de,Ue,Ge),c.push(Ue,$e,Ge),z+=6}o.addGroup(m,z,v),m+=z,f+=B}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new qt(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Ei extends mn{constructor(e=1,t=1,i=1,r=32,s=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:r,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:c};const l=this;r=Math.floor(r),s=Math.floor(s);const u=[],d=[],f=[],m=[];let _=0;const S=[],p=i/2;let h=0;y(),a===!1&&(e>0&&A(!0),t>0&&A(!1)),this.setIndex(u),this.setAttribute("position",new Ht(d,3)),this.setAttribute("normal",new Ht(f,3)),this.setAttribute("uv",new Ht(m,2));function y(){const M=new V,b=new V;let E=0;const P=(t-e)/i;for(let g=0;g<=s;g++){const v=[],w=g/s,R=w*(t-e)+e;for(let I=0;I<=r;I++){const D=I/r,F=D*c+o,L=Math.sin(F),q=Math.cos(F);b.x=R*L,b.y=-w*i+p,b.z=R*q,d.push(b.x,b.y,b.z),M.set(L,P,q).normalize(),f.push(M.x,M.y,M.z),m.push(D,1-w),v.push(_++)}S.push(v)}for(let g=0;g<r;g++)for(let v=0;v<s;v++){const w=S[v][g],R=S[v+1][g],I=S[v+1][g+1],D=S[v][g+1];(e>0||v!==0)&&(u.push(w,R,D),E+=3),(t>0||v!==s-1)&&(u.push(R,I,D),E+=3)}l.addGroup(h,E,0),h+=E}function A(M){const b=_,E=new Qe,P=new V;let g=0;const v=M===!0?e:t,w=M===!0?1:-1;for(let I=1;I<=r;I++)d.push(0,p*w,0),f.push(0,w,0),m.push(.5,.5),_++;const R=_;for(let I=0;I<=r;I++){const F=I/r*c+o,L=Math.cos(F),q=Math.sin(F);P.x=v*q,P.y=p*w,P.z=v*L,d.push(P.x,P.y,P.z),f.push(0,w,0),E.x=L*.5+.5,E.y=q*.5*w+.5,m.push(E.x,E.y),_++}for(let I=0;I<r;I++){const D=b+I,F=R+I;M===!0?u.push(F,F+1,D):u.push(F+1,F,D),g+=3}l.addGroup(h,g,M===!0?1:2),h+=g}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ei(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class No extends Ei{constructor(e=1,t=1,i=32,r=1,s=!1,a=0,o=Math.PI*2){super(0,e,t,i,r,s,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:r,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(e){return new No(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Ps extends mn{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,a=t/2,o=Math.floor(i),c=Math.floor(r),l=o+1,u=c+1,d=e/o,f=t/c,m=[],_=[],S=[],p=[];for(let h=0;h<u;h++){const y=h*f-a;for(let A=0;A<l;A++){const M=A*d-s;_.push(M,-y,0),S.push(0,0,1),p.push(A/o),p.push(1-h/c)}}for(let h=0;h<c;h++)for(let y=0;y<o;y++){const A=y+l*h,M=y+l*(h+1),b=y+1+l*(h+1),E=y+1+l*h;m.push(A,M,E),m.push(M,b,E)}this.setIndex(m),this.setAttribute("position",new Ht(_,3)),this.setAttribute("normal",new Ht(S,3)),this.setAttribute("uv",new Ht(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ps(e.width,e.height,e.widthSegments,e.heightSegments)}}class Pr extends mn{constructor(e=1,t=32,i=16,r=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const c=Math.min(a+o,Math.PI);let l=0;const u=[],d=new V,f=new V,m=[],_=[],S=[],p=[];for(let h=0;h<=i;h++){const y=[],A=h/i,M=a+A*o,b=e*Math.cos(M),E=Math.sqrt(e*e-b*b);let P=0;h===0&&a===0?P=.5/t:h===i&&c===Math.PI&&(P=-.5/t);for(let g=0;g<=t;g++){const v=g/t,w=r+v*s;d.x=-E*Math.cos(w),d.y=b,d.z=E*Math.sin(w),_.push(d.x,d.y,d.z),f.copy(d).normalize(),S.push(f.x,f.y,f.z),p.push(v+P,1-A),y.push(l++)}u.push(y)}for(let h=0;h<i;h++)for(let y=0;y<t;y++){const A=u[h][y+1],M=u[h][y],b=u[h+1][y],E=u[h+1][y+1];(h!==0||a>0)&&m.push(A,M,E),(h!==i-1||c<Math.PI)&&m.push(M,b,E)}this.setIndex(m),this.setAttribute("position",new Ht(_,3)),this.setAttribute("normal",new Ht(S,3)),this.setAttribute("uv",new Ht(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Pr(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}function tr(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];if(Bc(r))r.isRenderTargetTexture?(Oe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone();else if(Array.isArray(r))if(Bc(r[0])){const s=[];for(let a=0,o=r.length;a<o;a++)s[a]=r[a].clone();e[t][i]=s}else e[t][i]=r.slice();else e[t][i]=r}}return e}function Gt(n){const e={};for(let t=0;t<n.length;t++){const i=tr(n[t]);for(const r in i)e[r]=i[r]}return e}function Bc(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function fh(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function fu(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ze.workingColorSpace}const dh={clone:tr,merge:Gt};var hh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ph=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Cn extends wr{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=hh,this.fragmentShader=ph,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=tr(e.uniforms),this.uniformsGroups=fh(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?t.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[r]={type:"m4",value:a.toArray()}:t.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const i in e.uniforms){const r=e.uniforms[i];switch(this.uniforms[i]={},r.type){case"t":this.uniforms[i].value=t[r.value]||null;break;case"c":this.uniforms[i].value=new Ye().setHex(r.value);break;case"v2":this.uniforms[i].value=new Qe().fromArray(r.value);break;case"v3":this.uniforms[i].value=new V().fromArray(r.value);break;case"v4":this.uniforms[i].value=new _t().fromArray(r.value);break;case"m3":this.uniforms[i].value=new ke().fromArray(r.value);break;case"m4":this.uniforms[i].value=new pt().fromArray(r.value);break;default:this.uniforms[i].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class mh extends Cn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class sn extends wr{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ye(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ye(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=fo,this.normalScale=new Qe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new si,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class gh extends wr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Ad,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class _h extends wr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Fo extends bt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ye(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class xh extends Fo{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(bt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ye(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const da=new pt,kc=new V,zc=new V;class vh{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Qe(512,512),this.mapType=Qt,this.map=null,this.mapPass=null,this.matrix=new pt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Uo,this._frameExtents=new Qe(1,1),this._viewportCount=1,this._viewports=[new _t(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;kc.setFromMatrixPosition(e.matrixWorld),t.position.copy(kc),zc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(zc),t.updateMatrixWorld(),da.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(da,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===Tr||t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(da)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const es=new V,ts=new ir,vn=new V;class du extends bt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new pt,this.projectionMatrix=new pt,this.projectionMatrixInverse=new pt,this.coordinateSystem=bn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(es,ts,vn),vn.x===1&&vn.y===1&&vn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(es,ts,vn.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(es,ts,vn),vn.x===1&&vn.y===1&&vn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(es,ts,vn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Qn=new V,Gc=new Qe,Vc=new Qe;class un extends du{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ho*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Vs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ho*2*Math.atan(Math.tan(Vs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Qn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Qn.x,Qn.y).multiplyScalar(-e/Qn.z),Qn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Qn.x,Qn.y).multiplyScalar(-e/Qn.z)}getViewSize(e,t){return this.getViewBounds(e,Gc,Vc),t.subVectors(Vc,Gc)}setViewOffset(e,t,i,r,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Vs*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;s+=a.offsetX*r/c,t-=a.offsetY*i/l,r*=a.width/c,i*=a.height/l}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class Is extends du{constructor(e=-1,t=1,i=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,a=i+e,o=r+t,c=r-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,a=s+l*this.view.width,o-=u*this.view.offsetY,c=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Mh extends vh{constructor(){super(new Is(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class ha extends Fo{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(bt.DEFAULT_UP),this.updateMatrix(),this.target=new bt,this.shadow=new Mh}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class Sh extends Fo{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}const Gi=-90,Vi=1;class yh extends bt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new un(Gi,Vi,e,t);r.layers=this.layers,this.add(r);const s=new un(Gi,Vi,e,t);s.layers=this.layers,this.add(s);const a=new un(Gi,Vi,e,t);a.layers=this.layers,this.add(a);const o=new un(Gi,Vi,e,t);o.layers=this.layers,this.add(o);const c=new un(Gi,Vi,e,t);c.layers=this.layers,this.add(c);const l=new un(Gi,Vi,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,s,a,o,c]=t;for(const l of t)this.remove(l);if(e===bn)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Tr)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,c,l,u]=this.children,d=e.getRenderTarget(),f=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const S=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let p=!1;e.isWebGLRenderer===!0?p=e.state.buffers.depth.getReversed():p=e.reversedDepthBuffer,e.setRenderTarget(i,0,r),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(i,1,r),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,2,r),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,3,r),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(i,4,r),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),i.texture.generateMipmaps=S,e.setRenderTarget(i,5,r),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(d,f,m),e.xr.enabled=_,i.texture.needsPMREMUpdate=!0}}class Eh extends un{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const Go=class Go{constructor(e,t,i,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,r){const s=this.elements;return s[0]=e,s[2]=t,s[1]=i,s[3]=r,this}};Go.prototype.isMatrix2=!0;let Hc=Go;function Wc(n,e,t,i){const r=bh(i);switch(t){case jl:return n*e;case Ao:return n*e/r.components*r.byteLength;case Ro:return n*e/r.components*r.byteLength;case yi:return n*e*2/r.components*r.byteLength;case Co:return n*e*2/r.components*r.byteLength;case eu:return n*e*3/r.components*r.byteLength;case hn:return n*e*4/r.components*r.byteLength;case wo:return n*e*4/r.components*r.byteLength;case ls:case us:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case fs:case ds:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Fa:case Ba:return Math.max(n,16)*Math.max(e,8)/4;case Na:case Oa:return Math.max(n,8)*Math.max(e,8)/2;case ka:case za:case Va:case Ha:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Ga:case gs:case Wa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Xa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case qa:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Ya:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case $a:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Ka:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Za:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Ja:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Qa:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case ja:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case eo:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case to:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case no:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case io:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case ro:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case so:case ao:case oo:return Math.ceil(n/4)*Math.ceil(e/4)*16;case co:case lo:return Math.ceil(n/4)*Math.ceil(e/4)*8;case _s:case uo:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function bh(n){switch(n){case Qt:case Kl:return{byteLength:1,components:1};case Er:case Zl:case Vn:return{byteLength:2,components:1};case bo:case To:return{byteLength:2,components:4};case Rn:case Eo:case dn:return{byteLength:4,components:1};case Jl:case Ql:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:So}}));typeof window<"u"&&(window.__THREE__?Oe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=So);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function hu(){let n=null,e=!1,t=null,i=null;function r(s,a){t(s,a),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function Th(n){const e=new WeakMap;function t(o,c){const l=o.array,u=o.usage,d=l.byteLength,f=n.createBuffer();n.bindBuffer(c,f),n.bufferData(c,l,u),o.onUploadCallback();let m;if(l instanceof Float32Array)m=n.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)m=n.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?m=n.HALF_FLOAT:m=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)m=n.SHORT;else if(l instanceof Uint32Array)m=n.UNSIGNED_INT;else if(l instanceof Int32Array)m=n.INT;else if(l instanceof Int8Array)m=n.BYTE;else if(l instanceof Uint8Array)m=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)m=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:m,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:d}}function i(o,c,l){const u=c.array,d=c.updateRanges;if(n.bindBuffer(l,o),d.length===0)n.bufferSubData(l,0,u);else{d.sort((m,_)=>m.start-_.start);let f=0;for(let m=1;m<d.length;m++){const _=d[f],S=d[m];S.start<=_.start+_.count+1?_.count=Math.max(_.count,S.start+S.count-_.start):(++f,d[f]=S)}d.length=f+1;for(let m=0,_=d.length;m<_;m++){const S=d[m];n.bufferSubData(l,S.start*u.BYTES_PER_ELEMENT,u,S.start,S.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(n.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,o,c),l.version=o.version}}return{get:r,remove:s,update:a}}var Ah=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Rh=`#ifdef USE_ALPHAHASH
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
#endif`,Ch=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,wh=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Ph=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Ih=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Dh=`#ifdef USE_AOMAP
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
#endif`,Lh=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Uh=`#ifdef USE_BATCHING
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
#endif`,Nh=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Fh=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Oh=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Bh=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,kh=`#ifdef USE_IRIDESCENCE
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
#endif`,zh=`#ifdef USE_BUMPMAP
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
#endif`,Gh=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Vh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Hh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Wh=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Xh=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,qh=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Yh=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,$h=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Kh=`#define PI 3.141592653589793
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
} // validated`,Zh=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Jh=`vec3 transformedNormal = objectNormal;
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
#endif`,Qh=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,jh=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,ep=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,tp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,np="gl_FragColor = linearToOutputTexel( gl_FragColor );",ip=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,rp=`#ifdef USE_ENVMAP
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
#endif`,sp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,ap=`#ifdef USE_ENVMAP
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
#endif`,op=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,cp=`#ifdef USE_ENVMAP
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
#endif`,lp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,up=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,dp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,hp=`#ifdef USE_GRADIENTMAP
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
}`,pp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,mp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,gp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,_p=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,xp=`#ifdef USE_ENVMAP
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
#endif`,vp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Mp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Sp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,yp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Ep=`PhysicalMaterial material;
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
#endif`,bp=`uniform sampler2D dfgLUT;
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
}`,Tp=`
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
#endif`,Ap=`#if defined( RE_IndirectDiffuse )
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
#endif`,Rp=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Cp=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,wp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Pp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ip=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Dp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Lp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Up=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Np=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Fp=`#if defined( USE_POINTS_UV )
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
#endif`,Op=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Bp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,kp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,zp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Gp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Vp=`#ifdef USE_MORPHTARGETS
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
#endif`,Hp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Wp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Xp=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,qp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Yp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,$p=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Kp=`#ifdef USE_NORMALMAP
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
#endif`,Zp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Jp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Qp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,jp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,em=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,tm=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,nm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,im=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,rm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,sm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,am=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,om=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,cm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,lm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,um=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,fm=`float getShadowMask() {
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
}`,dm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,hm=`#ifdef USE_SKINNING
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
#endif`,pm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,mm=`#ifdef USE_SKINNING
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
#endif`,gm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,_m=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,xm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,vm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Mm=`#ifdef USE_TRANSMISSION
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
#endif`,Sm=`#ifdef USE_TRANSMISSION
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
#endif`,ym=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Em=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,bm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Tm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Am=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Rm=`uniform sampler2D t2D;
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
}`,Cm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,wm=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Pm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Im=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Dm=`#include <common>
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
}`,Lm=`#if DEPTH_PACKING == 3200
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
}`,Um=`#define DISTANCE
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
}`,Nm=`#define DISTANCE
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
}`,Fm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Om=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Bm=`uniform float scale;
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
}`,km=`uniform vec3 diffuse;
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
}`,zm=`#include <common>
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
}`,Gm=`uniform vec3 diffuse;
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
}`,Vm=`#define LAMBERT
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
}`,Hm=`#define LAMBERT
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
}`,Wm=`#define MATCAP
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
}`,Xm=`#define MATCAP
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
}`,qm=`#define NORMAL
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
}`,Ym=`#define NORMAL
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
}`,$m=`#define PHONG
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
}`,Km=`#define PHONG
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
}`,Zm=`#define STANDARD
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
}`,Jm=`#define STANDARD
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
}`,Qm=`#define TOON
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
}`,jm=`#define TOON
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
}`,e0=`uniform float size;
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
}`,t0=`uniform vec3 diffuse;
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
}`,n0=`#include <common>
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
}`,i0=`uniform vec3 color;
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
}`,r0=`uniform float rotation;
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
}`,s0=`uniform vec3 diffuse;
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
}`,Xe={alphahash_fragment:Ah,alphahash_pars_fragment:Rh,alphamap_fragment:Ch,alphamap_pars_fragment:wh,alphatest_fragment:Ph,alphatest_pars_fragment:Ih,aomap_fragment:Dh,aomap_pars_fragment:Lh,batching_pars_vertex:Uh,batching_vertex:Nh,begin_vertex:Fh,beginnormal_vertex:Oh,bsdfs:Bh,iridescence_fragment:kh,bumpmap_pars_fragment:zh,clipping_planes_fragment:Gh,clipping_planes_pars_fragment:Vh,clipping_planes_pars_vertex:Hh,clipping_planes_vertex:Wh,color_fragment:Xh,color_pars_fragment:qh,color_pars_vertex:Yh,color_vertex:$h,common:Kh,cube_uv_reflection_fragment:Zh,defaultnormal_vertex:Jh,displacementmap_pars_vertex:Qh,displacementmap_vertex:jh,emissivemap_fragment:ep,emissivemap_pars_fragment:tp,colorspace_fragment:np,colorspace_pars_fragment:ip,envmap_fragment:rp,envmap_common_pars_fragment:sp,envmap_pars_fragment:ap,envmap_pars_vertex:op,envmap_physical_pars_fragment:xp,envmap_vertex:cp,fog_vertex:lp,fog_pars_vertex:up,fog_fragment:fp,fog_pars_fragment:dp,gradientmap_pars_fragment:hp,lightmap_pars_fragment:pp,lights_lambert_fragment:mp,lights_lambert_pars_fragment:gp,lights_pars_begin:_p,lights_toon_fragment:vp,lights_toon_pars_fragment:Mp,lights_phong_fragment:Sp,lights_phong_pars_fragment:yp,lights_physical_fragment:Ep,lights_physical_pars_fragment:bp,lights_fragment_begin:Tp,lights_fragment_maps:Ap,lights_fragment_end:Rp,lightprobes_pars_fragment:Cp,logdepthbuf_fragment:wp,logdepthbuf_pars_fragment:Pp,logdepthbuf_pars_vertex:Ip,logdepthbuf_vertex:Dp,map_fragment:Lp,map_pars_fragment:Up,map_particle_fragment:Np,map_particle_pars_fragment:Fp,metalnessmap_fragment:Op,metalnessmap_pars_fragment:Bp,morphinstance_vertex:kp,morphcolor_vertex:zp,morphnormal_vertex:Gp,morphtarget_pars_vertex:Vp,morphtarget_vertex:Hp,normal_fragment_begin:Wp,normal_fragment_maps:Xp,normal_pars_fragment:qp,normal_pars_vertex:Yp,normal_vertex:$p,normalmap_pars_fragment:Kp,clearcoat_normal_fragment_begin:Zp,clearcoat_normal_fragment_maps:Jp,clearcoat_pars_fragment:Qp,iridescence_pars_fragment:jp,opaque_fragment:em,packing:tm,premultiplied_alpha_fragment:nm,project_vertex:im,dithering_fragment:rm,dithering_pars_fragment:sm,roughnessmap_fragment:am,roughnessmap_pars_fragment:om,shadowmap_pars_fragment:cm,shadowmap_pars_vertex:lm,shadowmap_vertex:um,shadowmask_pars_fragment:fm,skinbase_vertex:dm,skinning_pars_vertex:hm,skinning_vertex:pm,skinnormal_vertex:mm,specularmap_fragment:gm,specularmap_pars_fragment:_m,tonemapping_fragment:xm,tonemapping_pars_fragment:vm,transmission_fragment:Mm,transmission_pars_fragment:Sm,uv_pars_fragment:ym,uv_pars_vertex:Em,uv_vertex:bm,worldpos_vertex:Tm,background_vert:Am,background_frag:Rm,backgroundCube_vert:Cm,backgroundCube_frag:wm,cube_vert:Pm,cube_frag:Im,depth_vert:Dm,depth_frag:Lm,distance_vert:Um,distance_frag:Nm,equirect_vert:Fm,equirect_frag:Om,linedashed_vert:Bm,linedashed_frag:km,meshbasic_vert:zm,meshbasic_frag:Gm,meshlambert_vert:Vm,meshlambert_frag:Hm,meshmatcap_vert:Wm,meshmatcap_frag:Xm,meshnormal_vert:qm,meshnormal_frag:Ym,meshphong_vert:$m,meshphong_frag:Km,meshphysical_vert:Zm,meshphysical_frag:Jm,meshtoon_vert:Qm,meshtoon_frag:jm,points_vert:e0,points_frag:t0,shadow_vert:n0,shadow_frag:i0,sprite_vert:r0,sprite_frag:s0},me={common:{diffuse:{value:new Ye(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ke},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ke}},envmap:{envMap:{value:null},envMapRotation:{value:new ke},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ke}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ke}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ke},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ke},normalScale:{value:new Qe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ke},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ke}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ke}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ke}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ye(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new V},probesMax:{value:new V},probesResolution:{value:new V}},points:{diffuse:{value:new Ye(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0},uvTransform:{value:new ke}},sprite:{diffuse:{value:new Ye(16777215)},opacity:{value:1},center:{value:new Qe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ke},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0}}},En={basic:{uniforms:Gt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.fog]),vertexShader:Xe.meshbasic_vert,fragmentShader:Xe.meshbasic_frag},lambert:{uniforms:Gt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new Ye(0)},envMapIntensity:{value:1}}]),vertexShader:Xe.meshlambert_vert,fragmentShader:Xe.meshlambert_frag},phong:{uniforms:Gt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new Ye(0)},specular:{value:new Ye(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Xe.meshphong_vert,fragmentShader:Xe.meshphong_frag},standard:{uniforms:Gt([me.common,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.roughnessmap,me.metalnessmap,me.fog,me.lights,{emissive:{value:new Ye(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag},toon:{uniforms:Gt([me.common,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.gradientmap,me.fog,me.lights,{emissive:{value:new Ye(0)}}]),vertexShader:Xe.meshtoon_vert,fragmentShader:Xe.meshtoon_frag},matcap:{uniforms:Gt([me.common,me.bumpmap,me.normalmap,me.displacementmap,me.fog,{matcap:{value:null}}]),vertexShader:Xe.meshmatcap_vert,fragmentShader:Xe.meshmatcap_frag},points:{uniforms:Gt([me.points,me.fog]),vertexShader:Xe.points_vert,fragmentShader:Xe.points_frag},dashed:{uniforms:Gt([me.common,me.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xe.linedashed_vert,fragmentShader:Xe.linedashed_frag},depth:{uniforms:Gt([me.common,me.displacementmap]),vertexShader:Xe.depth_vert,fragmentShader:Xe.depth_frag},normal:{uniforms:Gt([me.common,me.bumpmap,me.normalmap,me.displacementmap,{opacity:{value:1}}]),vertexShader:Xe.meshnormal_vert,fragmentShader:Xe.meshnormal_frag},sprite:{uniforms:Gt([me.sprite,me.fog]),vertexShader:Xe.sprite_vert,fragmentShader:Xe.sprite_frag},background:{uniforms:{uvTransform:{value:new ke},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xe.background_vert,fragmentShader:Xe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ke}},vertexShader:Xe.backgroundCube_vert,fragmentShader:Xe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xe.cube_vert,fragmentShader:Xe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xe.equirect_vert,fragmentShader:Xe.equirect_frag},distance:{uniforms:Gt([me.common,me.displacementmap,{referencePosition:{value:new V},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xe.distance_vert,fragmentShader:Xe.distance_frag},shadow:{uniforms:Gt([me.lights,me.fog,{color:{value:new Ye(0)},opacity:{value:1}}]),vertexShader:Xe.shadow_vert,fragmentShader:Xe.shadow_frag}};En.physical={uniforms:Gt([En.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ke},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ke},clearcoatNormalScale:{value:new Qe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ke},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ke},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ke},sheen:{value:0},sheenColor:{value:new Ye(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ke},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ke},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ke},transmissionSamplerSize:{value:new Qe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ke},attenuationDistance:{value:0},attenuationColor:{value:new Ye(0)},specularColor:{value:new Ye(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ke},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ke},anisotropyVector:{value:new Qe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ke}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag};const ns={r:0,b:0,g:0},a0=new pt,pu=new ke;pu.set(-1,0,0,0,1,0,0,0,1);function o0(n,e,t,i,r,s){const a=new Ye(0);let o=r===!0?0:1,c,l,u=null,d=0,f=null;function m(y){let A=y.isScene===!0?y.background:null;if(A&&A.isTexture){const M=y.backgroundBlurriness>0;A=e.get(A,M)}return A}function _(y){let A=!1;const M=m(y);M===null?p(a,o):M&&M.isColor&&(p(M,1),A=!0);const b=n.xr.getEnvironmentBlendMode();b==="additive"?t.buffers.color.setClear(0,0,0,1,s):b==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,s),(n.autoClear||A)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function S(y,A){const M=m(A);M&&(M.isCubeTexture||M.mapping===ws)?(l===void 0&&(l=new Mt(new qt(1,1,1),new Cn({name:"BackgroundCubeMaterial",uniforms:tr(En.backgroundCube.uniforms),vertexShader:En.backgroundCube.vertexShader,fragmentShader:En.backgroundCube.fragmentShader,side:Yt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(b,E,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(l)),l.material.uniforms.envMap.value=M,l.material.uniforms.backgroundBlurriness.value=A.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(a0.makeRotationFromEuler(A.backgroundRotation)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(pu),l.material.toneMapped=Ze.getTransfer(M.colorSpace)!==rt,(u!==M||d!==M.version||f!==n.toneMapping)&&(l.material.needsUpdate=!0,u=M,d=M.version,f=n.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null)):M&&M.isTexture&&(c===void 0&&(c=new Mt(new Ps(2,2),new Cn({name:"BackgroundMaterial",uniforms:tr(En.background.uniforms),vertexShader:En.background.vertexShader,fragmentShader:En.background.fragmentShader,side:ri,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=M,c.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,c.material.toneMapped=Ze.getTransfer(M.colorSpace)!==rt,M.matrixAutoUpdate===!0&&M.updateMatrix(),c.material.uniforms.uvTransform.value.copy(M.matrix),(u!==M||d!==M.version||f!==n.toneMapping)&&(c.material.needsUpdate=!0,u=M,d=M.version,f=n.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function p(y,A){y.getRGB(ns,fu(n)),t.buffers.color.setClear(ns.r,ns.g,ns.b,A,s)}function h(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(y,A=1){a.set(y),o=A,p(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(y){o=y,p(a,o)},render:_,addToRenderList:S,dispose:h}}function c0(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=f(null);let s=r,a=!1;function o(R,I,D,F,L){let q=!1;const B=d(R,F,D,I);s!==B&&(s=B,l(s.object)),q=m(R,F,D,L),q&&_(R,F,D,L),L!==null&&e.update(L,n.ELEMENT_ARRAY_BUFFER),(q||a)&&(a=!1,M(R,I,D,F),L!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(L).buffer))}function c(){return n.createVertexArray()}function l(R){return n.bindVertexArray(R)}function u(R){return n.deleteVertexArray(R)}function d(R,I,D,F){const L=F.wireframe===!0;let q=i[I.id];q===void 0&&(q={},i[I.id]=q);const B=R.isInstancedMesh===!0?R.id:0;let z=q[B];z===void 0&&(z={},q[B]=z);let J=z[D.id];J===void 0&&(J={},z[D.id]=J);let ne=J[L];return ne===void 0&&(ne=f(c()),J[L]=ne),ne}function f(R){const I=[],D=[],F=[];for(let L=0;L<t;L++)I[L]=0,D[L]=0,F[L]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:D,attributeDivisors:F,object:R,attributes:{},index:null}}function m(R,I,D,F){const L=s.attributes,q=I.attributes;let B=0;const z=D.getAttributes();for(const J in z)if(z[J].location>=0){const se=L[J];let de=q[J];if(de===void 0&&(J==="instanceMatrix"&&R.instanceMatrix&&(de=R.instanceMatrix),J==="instanceColor"&&R.instanceColor&&(de=R.instanceColor)),se===void 0||se.attribute!==de||de&&se.data!==de.data)return!0;B++}return s.attributesNum!==B||s.index!==F}function _(R,I,D,F){const L={},q=I.attributes;let B=0;const z=D.getAttributes();for(const J in z)if(z[J].location>=0){let se=q[J];se===void 0&&(J==="instanceMatrix"&&R.instanceMatrix&&(se=R.instanceMatrix),J==="instanceColor"&&R.instanceColor&&(se=R.instanceColor));const de={};de.attribute=se,se&&se.data&&(de.data=se.data),L[J]=de,B++}s.attributes=L,s.attributesNum=B,s.index=F}function S(){const R=s.newAttributes;for(let I=0,D=R.length;I<D;I++)R[I]=0}function p(R){h(R,0)}function h(R,I){const D=s.newAttributes,F=s.enabledAttributes,L=s.attributeDivisors;D[R]=1,F[R]===0&&(n.enableVertexAttribArray(R),F[R]=1),L[R]!==I&&(n.vertexAttribDivisor(R,I),L[R]=I)}function y(){const R=s.newAttributes,I=s.enabledAttributes;for(let D=0,F=I.length;D<F;D++)I[D]!==R[D]&&(n.disableVertexAttribArray(D),I[D]=0)}function A(R,I,D,F,L,q,B){B===!0?n.vertexAttribIPointer(R,I,D,L,q):n.vertexAttribPointer(R,I,D,F,L,q)}function M(R,I,D,F){S();const L=F.attributes,q=D.getAttributes(),B=I.defaultAttributeValues;for(const z in q){const J=q[z];if(J.location>=0){let ne=L[z];if(ne===void 0&&(z==="instanceMatrix"&&R.instanceMatrix&&(ne=R.instanceMatrix),z==="instanceColor"&&R.instanceColor&&(ne=R.instanceColor)),ne!==void 0){const se=ne.normalized,de=ne.itemSize,Ue=e.get(ne);if(Ue===void 0)continue;const $e=Ue.buffer,Ge=Ue.type,Z=Ue.bytesPerElement,ee=Ge===n.INT||Ge===n.UNSIGNED_INT||ne.gpuType===Eo;if(ne.isInterleavedBufferAttribute){const ae=ne.data,Ne=ae.stride,Be=ne.offset;if(ae.isInstancedInterleavedBuffer){for(let De=0;De<J.locationSize;De++)h(J.location+De,ae.meshPerAttribute);R.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let De=0;De<J.locationSize;De++)p(J.location+De);n.bindBuffer(n.ARRAY_BUFFER,$e);for(let De=0;De<J.locationSize;De++)A(J.location+De,de/J.locationSize,Ge,se,Ne*Z,(Be+de/J.locationSize*De)*Z,ee)}else{if(ne.isInstancedBufferAttribute){for(let ae=0;ae<J.locationSize;ae++)h(J.location+ae,ne.meshPerAttribute);R.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let ae=0;ae<J.locationSize;ae++)p(J.location+ae);n.bindBuffer(n.ARRAY_BUFFER,$e);for(let ae=0;ae<J.locationSize;ae++)A(J.location+ae,de/J.locationSize,Ge,se,de*Z,de/J.locationSize*ae*Z,ee)}}else if(B!==void 0){const se=B[z];if(se!==void 0)switch(se.length){case 2:n.vertexAttrib2fv(J.location,se);break;case 3:n.vertexAttrib3fv(J.location,se);break;case 4:n.vertexAttrib4fv(J.location,se);break;default:n.vertexAttrib1fv(J.location,se)}}}}y()}function b(){v();for(const R in i){const I=i[R];for(const D in I){const F=I[D];for(const L in F){const q=F[L];for(const B in q)u(q[B].object),delete q[B];delete F[L]}}delete i[R]}}function E(R){if(i[R.id]===void 0)return;const I=i[R.id];for(const D in I){const F=I[D];for(const L in F){const q=F[L];for(const B in q)u(q[B].object),delete q[B];delete F[L]}}delete i[R.id]}function P(R){for(const I in i){const D=i[I];for(const F in D){const L=D[F];if(L[R.id]===void 0)continue;const q=L[R.id];for(const B in q)u(q[B].object),delete q[B];delete L[R.id]}}}function g(R){for(const I in i){const D=i[I],F=R.isInstancedMesh===!0?R.id:0,L=D[F];if(L!==void 0){for(const q in L){const B=L[q];for(const z in B)u(B[z].object),delete B[z];delete L[q]}delete D[F],Object.keys(D).length===0&&delete i[I]}}}function v(){w(),a=!0,s!==r&&(s=r,l(s.object))}function w(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:v,resetDefaultState:w,dispose:b,releaseStatesOfGeometry:E,releaseStatesOfObject:g,releaseStatesOfProgram:P,initAttributes:S,enableAttribute:p,disableUnusedAttributes:y}}function l0(n,e,t){let i;function r(c){i=c}function s(c,l){n.drawArrays(i,c,l),t.update(l,i,1)}function a(c,l,u){u!==0&&(n.drawArraysInstanced(i,c,l,u),t.update(l,i,u))}function o(c,l,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,l,0,u);let f=0;for(let m=0;m<u;m++)f+=l[m];t.update(f,i,1)}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o}function u0(n,e,t,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const P=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(P){return!(P!==hn&&i.convert(P)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(P){const g=P===Vn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(P!==Qt&&i.convert(P)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==dn&&!g)}function c(P){if(P==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const u=c(l);u!==l&&(Oe("WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);const d=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&f===!1&&Oe("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const m=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),S=n.getParameter(n.MAX_TEXTURE_SIZE),p=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),h=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),A=n.getParameter(n.MAX_VARYING_VECTORS),M=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),b=n.getParameter(n.MAX_SAMPLES),E=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:m,maxVertexTextures:_,maxTextureSize:S,maxCubemapSize:p,maxAttributes:h,maxVertexUniforms:y,maxVaryings:A,maxFragmentUniforms:M,maxSamples:b,samples:E}}function f0(n){const e=this;let t=null,i=0,r=!1,s=!1;const a=new fi,o=new ke,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){const m=d.length!==0||f||i!==0||r;return r=f,i=d.length,m},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,f){t=u(d,f,0)},this.setState=function(d,f,m){const _=d.clippingPlanes,S=d.clipIntersection,p=d.clipShadows,h=n.get(d);if(!r||_===null||_.length===0||s&&!p)s?u(null):l();else{const y=s?0:i,A=y*4;let M=h.clippingState||null;c.value=M,M=u(_,f,A,m);for(let b=0;b!==A;++b)M[b]=t[b];h.clippingState=M,this.numIntersection=S?this.numPlanes:0,this.numPlanes+=y}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(d,f,m,_){const S=d!==null?d.length:0;let p=null;if(S!==0){if(p=c.value,_!==!0||p===null){const h=m+S*4,y=f.matrixWorldInverse;o.getNormalMatrix(y),(p===null||p.length<h)&&(p=new Float32Array(h));for(let A=0,M=m;A!==S;++A,M+=4)a.copy(d[A]).applyMatrix4(y,o),a.normal.toArray(p,M),p[M+3]=a.constant}c.value=p,c.needsUpdate=!0}return e.numPlanes=S,e.numIntersection=0,p}}const ni=4,Xc=[.125,.215,.35,.446,.526,.582],hi=20,d0=256,pr=new Is,qc=new Ye;let pa=null,ma=0,ga=0,_a=!1;const h0=new V;class Yc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,r=100,s={}){const{size:a=256,position:o=h0}=s;pa=this._renderer.getRenderTarget(),ma=this._renderer.getActiveCubeFace(),ga=this._renderer.getActiveMipmapLevel(),_a=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,i,r,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Zc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Kc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(pa,ma,ga),this._renderer.xr.enabled=_a,e.scissorTest=!1,Hi(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Si||e.mapping===ji?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),pa=this._renderer.getRenderTarget(),ma=this._renderer.getActiveCubeFace(),ga=this._renderer.getActiveMipmapLevel(),_a=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Bt,minFilter:Bt,generateMipmaps:!1,type:Vn,format:hn,colorSpace:xs,depthBuffer:!1},r=$c(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=$c(e,t,i);const{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=p0(s)),this._blurMaterial=g0(s,e,t),this._ggxMaterial=m0(s,e,t)}return r}_compileMaterial(e){const t=new Mt(new mn,e);this._renderer.compile(t,pr)}_sceneToCubeUV(e,t,i,r,s){const c=new un(90,1,t,i),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,f=d.autoClear,m=d.toneMapping;d.getClearColor(qc),d.toneMapping=Tn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(r),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Mt(new qt,new ou({name:"PMREM.Background",side:Yt,depthWrite:!1,depthTest:!1})));const S=this._backgroundBox,p=S.material;let h=!1;const y=e.background;y?y.isColor&&(p.color.copy(y),e.background=null,h=!0):(p.color.copy(qc),h=!0);for(let A=0;A<6;A++){const M=A%3;M===0?(c.up.set(0,l[A],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x+u[A],s.y,s.z)):M===1?(c.up.set(0,0,l[A]),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y+u[A],s.z)):(c.up.set(0,l[A],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y,s.z+u[A]));const b=this._cubeSize;Hi(r,M*b,A>2?b:0,b,b),d.setRenderTarget(r),h&&d.render(S,c),d.render(e,c)}d.toneMapping=m,d.autoClear=f,e.background=y}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===Si||e.mapping===ji;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Zc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Kc());const s=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=s;const o=s.uniforms;o.envMap.value=e;const c=this._cubeSize;Hi(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(a,pr)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(e,s-1,s);t.autoClear=i}_applyGGXFilter(e,t,i){const r=this._renderer,s=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;const c=a.uniforms,l=i/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),d=Math.sqrt(l*l-u*u),f=0+l*1.25,m=d*f,{_lodMax:_}=this,S=this._sizeLods[i],p=3*S*(i>_-ni?i-_+ni:0),h=4*(this._cubeSize-S);c.envMap.value=e.texture,c.roughness.value=m,c.mipInt.value=_-t,Hi(s,p,h,3*S,2*S),r.setRenderTarget(s),r.render(o,pr),c.envMap.value=s.texture,c.roughness.value=0,c.mipInt.value=_-i,Hi(e,p,h,3*S,2*S),r.setRenderTarget(e),r.render(o,pr)}_blur(e,t,i,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,r,"latitudinal",s),this._halfBlur(a,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&nt("blur direction must be either latitudinal or longitudinal!");const u=3,d=this._lodMeshes[r];d.material=l;const f=l.uniforms,m=this._sizeLods[i]-1,_=isFinite(s)?Math.PI/(2*m):2*Math.PI/(2*hi-1),S=s/_,p=isFinite(s)?1+Math.floor(u*S):hi;p>hi&&Oe(`sigmaRadians, ${s}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${hi}`);const h=[];let y=0;for(let P=0;P<hi;++P){const g=P/S,v=Math.exp(-g*g/2);h.push(v),P===0?y+=v:P<p&&(y+=2*v)}for(let P=0;P<h.length;P++)h[P]=h[P]/y;f.envMap.value=e.texture,f.samples.value=p,f.weights.value=h,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:A}=this;f.dTheta.value=_,f.mipInt.value=A-i;const M=this._sizeLods[r],b=3*M*(r>A-ni?r-A+ni:0),E=4*(this._cubeSize-M);Hi(t,b,E,3*M,2*M),c.setRenderTarget(t),c.render(d,pr)}}function p0(n){const e=[],t=[],i=[];let r=n;const s=n-ni+1+Xc.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);e.push(o);let c=1/o;a>n-ni?c=Xc[a-n+ni-1]:a===0&&(c=0),t.push(c);const l=1/(o-2),u=-l,d=1+l,f=[u,u,d,u,d,d,u,u,d,d,u,d],m=6,_=6,S=3,p=2,h=1,y=new Float32Array(S*_*m),A=new Float32Array(p*_*m),M=new Float32Array(h*_*m);for(let E=0;E<m;E++){const P=E%3*2/3-1,g=E>2?0:-1,v=[P,g,0,P+2/3,g,0,P+2/3,g+1,0,P,g,0,P+2/3,g+1,0,P,g+1,0];y.set(v,S*_*E),A.set(f,p*_*E);const w=[E,E,E,E,E,E];M.set(w,h*_*E)}const b=new mn;b.setAttribute("position",new pn(y,S)),b.setAttribute("uv",new pn(A,p)),b.setAttribute("faceIndex",new pn(M,h)),i.push(new Mt(b,null)),r>ni&&r--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function $c(n,e,t){const i=new An(n,e,t);return i.texture.mapping=ws,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Hi(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function m0(n,e,t){return new Cn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:d0,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Ds(),fragmentShader:`

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
		`,blending:Bn,depthTest:!1,depthWrite:!1})}function g0(n,e,t){const i=new Float32Array(hi),r=new V(0,1,0);return new Cn({name:"SphericalGaussianBlur",defines:{n:hi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Ds(),fragmentShader:`

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
		`,blending:Bn,depthTest:!1,depthWrite:!1})}function Kc(){return new Cn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ds(),fragmentShader:`

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
		`,blending:Bn,depthTest:!1,depthWrite:!1})}function Zc(){return new Cn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ds(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Bn,depthTest:!1,depthWrite:!1})}function Ds(){return`

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
	`}class mu extends An{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new lu(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new qt(5,5,5),s=new Cn({name:"CubemapFromEquirect",uniforms:tr(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Yt,blending:Bn});s.uniforms.tEquirect.value=t;const a=new Mt(r,s),o=t.minFilter;return t.minFilter===pi&&(t.minFilter=Bt),new yh(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,r=!0){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,r);e.setRenderTarget(s)}}function _0(n){let e=new WeakMap,t=new WeakMap,i=null;function r(f,m=!1){return f==null?null:m?a(f):s(f)}function s(f){if(f&&f.isTexture){const m=f.mapping;if(m===ks||m===zs)if(e.has(f)){const _=e.get(f).texture;return o(_,f.mapping)}else{const _=f.image;if(_&&_.height>0){const S=new mu(_.height);return S.fromEquirectangularTexture(n,f),e.set(f,S),f.addEventListener("dispose",l),o(S.texture,f.mapping)}else return null}}return f}function a(f){if(f&&f.isTexture){const m=f.mapping,_=m===ks||m===zs,S=m===Si||m===ji;if(_||S){let p=t.get(f);const h=p!==void 0?p.texture.pmremVersion:0;if(f.isRenderTargetTexture&&f.pmremVersion!==h)return i===null&&(i=new Yc(n)),p=_?i.fromEquirectangular(f,p):i.fromCubemap(f,p),p.texture.pmremVersion=f.pmremVersion,t.set(f,p),p.texture;if(p!==void 0)return p.texture;{const y=f.image;return _&&y&&y.height>0||S&&y&&c(y)?(i===null&&(i=new Yc(n)),p=_?i.fromEquirectangular(f):i.fromCubemap(f),p.texture.pmremVersion=f.pmremVersion,t.set(f,p),f.addEventListener("dispose",u),p.texture):null}}}return f}function o(f,m){return m===ks?f.mapping=Si:m===zs&&(f.mapping=ji),f}function c(f){let m=0;const _=6;for(let S=0;S<_;S++)f[S]!==void 0&&m++;return m===_}function l(f){const m=f.target;m.removeEventListener("dispose",l);const _=e.get(m);_!==void 0&&(e.delete(m),_.dispose())}function u(f){const m=f.target;m.removeEventListener("dispose",u);const _=t.get(m);_!==void 0&&(t.delete(m),_.dispose())}function d(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:r,dispose:d}}function x0(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const r=n.getExtension(i);return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&Zi("WebGLRenderer: "+i+" extension not supported."),r}}}function v0(n,e,t,i){const r={},s=new WeakMap;function a(d){const f=d.target;f.index!==null&&e.remove(f.index);for(const _ in f.attributes)e.remove(f.attributes[_]);f.removeEventListener("dispose",a),delete r[f.id];const m=s.get(f);m&&(e.remove(m),s.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(d,f){return r[f.id]===!0||(f.addEventListener("dispose",a),r[f.id]=!0,t.memory.geometries++),f}function c(d){const f=d.attributes;for(const m in f)e.update(f[m],n.ARRAY_BUFFER)}function l(d){const f=[],m=d.index,_=d.attributes.position;let S=0;if(_===void 0)return;if(m!==null){const y=m.array;S=m.version;for(let A=0,M=y.length;A<M;A+=3){const b=y[A+0],E=y[A+1],P=y[A+2];f.push(b,E,E,P,P,b)}}else{const y=_.array;S=_.version;for(let A=0,M=y.length/3-1;A<M;A+=3){const b=A+0,E=A+1,P=A+2;f.push(b,E,E,P,P,b)}}const p=new(_.count>=65535?au:su)(f,1);p.version=S;const h=s.get(d);h&&e.remove(h),s.set(d,p)}function u(d){const f=s.get(d);if(f){const m=d.index;m!==null&&f.version<m.version&&l(d)}else l(d);return s.get(d)}return{get:o,update:c,getWireframeAttribute:u}}function M0(n,e,t){let i;function r(d){i=d}let s,a;function o(d){s=d.type,a=d.bytesPerElement}function c(d,f){n.drawElements(i,f,s,d*a),t.update(f,i,1)}function l(d,f,m){m!==0&&(n.drawElementsInstanced(i,f,s,d*a,m),t.update(f,i,m))}function u(d,f,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,s,d,0,m);let S=0;for(let p=0;p<m;p++)S+=f[p];t.update(S,i,1)}this.setMode=r,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function S0(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(s/3);break;case n.LINES:t.lines+=o*(s/2);break;case n.LINE_STRIP:t.lines+=o*(s-1);break;case n.LINE_LOOP:t.lines+=o*s;break;case n.POINTS:t.points+=o*s;break;default:nt("WebGLInfo: Unknown draw mode:",a);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function y0(n,e,t){const i=new WeakMap,r=new _t;function s(a,o,c){const l=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=u!==void 0?u.length:0;let f=i.get(o);if(f===void 0||f.count!==d){let w=function(){g.dispose(),i.delete(o),o.removeEventListener("dispose",w)};var m=w;f!==void 0&&f.texture.dispose();const _=o.morphAttributes.position!==void 0,S=o.morphAttributes.normal!==void 0,p=o.morphAttributes.color!==void 0,h=o.morphAttributes.position||[],y=o.morphAttributes.normal||[],A=o.morphAttributes.color||[];let M=0;_===!0&&(M=1),S===!0&&(M=2),p===!0&&(M=3);let b=o.attributes.position.count*M,E=1;b>e.maxTextureSize&&(E=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);const P=new Float32Array(b*E*4*d),g=new nu(P,b,E,d);g.type=dn,g.needsUpdate=!0;const v=M*4;for(let R=0;R<d;R++){const I=h[R],D=y[R],F=A[R],L=b*E*4*R;for(let q=0;q<I.count;q++){const B=q*v;_===!0&&(r.fromBufferAttribute(I,q),P[L+B+0]=r.x,P[L+B+1]=r.y,P[L+B+2]=r.z,P[L+B+3]=0),S===!0&&(r.fromBufferAttribute(D,q),P[L+B+4]=r.x,P[L+B+5]=r.y,P[L+B+6]=r.z,P[L+B+7]=0),p===!0&&(r.fromBufferAttribute(F,q),P[L+B+8]=r.x,P[L+B+9]=r.y,P[L+B+10]=r.z,P[L+B+11]=F.itemSize===4?r.w:1)}}f={count:d,texture:g,size:new Qe(b,E)},i.set(o,f),o.addEventListener("dispose",w)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let _=0;for(let p=0;p<l.length;p++)_+=l[p];const S=o.morphTargetsRelative?1:1-_;c.getUniforms().setValue(n,"morphTargetBaseInfluence",S),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",f.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:s}}function E0(n,e,t,i,r){let s=new WeakMap;function a(l){const u=r.render.frame,d=l.geometry,f=e.get(l,d);if(s.get(f)!==u&&(e.update(f),s.set(f,u)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),s.get(l)!==u&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,u))),l.isSkinnedMesh){const m=l.skeleton;s.get(m)!==u&&(m.update(),s.set(m,u))}return f}function o(){s=new WeakMap}function c(l){const u=l.target;u.removeEventListener("dispose",c),i.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:a,dispose:o}}const b0={[Vl]:"LINEAR_TONE_MAPPING",[Hl]:"REINHARD_TONE_MAPPING",[Wl]:"CINEON_TONE_MAPPING",[yo]:"ACES_FILMIC_TONE_MAPPING",[ql]:"AGX_TONE_MAPPING",[Yl]:"NEUTRAL_TONE_MAPPING",[Xl]:"CUSTOM_TONE_MAPPING"};function T0(n,e,t,i,r,s){const a=new An(e,t,{type:n,depthBuffer:r,stencilBuffer:s,samples:i?4:0,depthTexture:r?new er(e,t):void 0}),o=new An(e,t,{type:Vn,depthBuffer:!1,stencilBuffer:!1}),c=new mn;c.setAttribute("position",new Ht([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new Ht([0,2,0,0,2,0],2));const l=new mh({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),u=new Mt(c,l),d=new Is(-1,1,1,-1,0,1);let f=null,m=null,_=!1,S,p=null,h=[],y=!1;this.setSize=function(A,M){a.setSize(A,M),o.setSize(A,M);for(let b=0;b<h.length;b++){const E=h[b];E.setSize&&E.setSize(A,M)}},this.setEffects=function(A){h=A,y=h.length>0&&h[0].isRenderPass===!0;const M=a.width,b=a.height;for(let E=0;E<h.length;E++){const P=h[E];P.setSize&&P.setSize(M,b)}},this.begin=function(A,M){if(_||A.toneMapping===Tn&&h.length===0)return!1;if(p=M,M!==null){const b=M.width,E=M.height;(a.width!==b||a.height!==E)&&this.setSize(b,E)}return y===!1&&A.setRenderTarget(a),S=A.toneMapping,A.toneMapping=Tn,!0},this.hasRenderPass=function(){return y},this.end=function(A,M){A.toneMapping=S,_=!0;let b=a,E=o;for(let P=0;P<h.length;P++){const g=h[P];if(g.enabled!==!1&&(g.render(A,E,b,M),g.needsSwap!==!1)){const v=b;b=E,E=v}}if(f!==A.outputColorSpace||m!==A.toneMapping){f=A.outputColorSpace,m=A.toneMapping,l.defines={},Ze.getTransfer(f)===rt&&(l.defines.SRGB_TRANSFER="");const P=b0[m];P&&(l.defines[P]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=b.texture,A.setRenderTarget(p),A.render(u,d),p=null,_=!1},this.isCompositing=function(){return _},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),o.dispose(),c.dispose(),l.dispose()}}const gu=new kt,mo=new er(1,1),_u=new nu,xu=new Wd,vu=new lu,Jc=[],Qc=[],jc=new Float32Array(16),el=new Float32Array(9),tl=new Float32Array(4);function rr(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=Jc[r];if(s===void 0&&(s=new Float32Array(r),Jc[r]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(s,o)}return s}function Rt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Ct(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Ls(n,e){let t=Qc[e];t===void 0&&(t=new Int32Array(e),Qc[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function A0(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function R0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Rt(t,e))return;n.uniform2fv(this.addr,e),Ct(t,e)}}function C0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Rt(t,e))return;n.uniform3fv(this.addr,e),Ct(t,e)}}function w0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Rt(t,e))return;n.uniform4fv(this.addr,e),Ct(t,e)}}function P0(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Rt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Ct(t,e)}else{if(Rt(t,i))return;tl.set(i),n.uniformMatrix2fv(this.addr,!1,tl),Ct(t,i)}}function I0(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Rt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Ct(t,e)}else{if(Rt(t,i))return;el.set(i),n.uniformMatrix3fv(this.addr,!1,el),Ct(t,i)}}function D0(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Rt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Ct(t,e)}else{if(Rt(t,i))return;jc.set(i),n.uniformMatrix4fv(this.addr,!1,jc),Ct(t,i)}}function L0(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function U0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Rt(t,e))return;n.uniform2iv(this.addr,e),Ct(t,e)}}function N0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Rt(t,e))return;n.uniform3iv(this.addr,e),Ct(t,e)}}function F0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Rt(t,e))return;n.uniform4iv(this.addr,e),Ct(t,e)}}function O0(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function B0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Rt(t,e))return;n.uniform2uiv(this.addr,e),Ct(t,e)}}function k0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Rt(t,e))return;n.uniform3uiv(this.addr,e),Ct(t,e)}}function z0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Rt(t,e))return;n.uniform4uiv(this.addr,e),Ct(t,e)}}function G0(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(mo.compareFunction=t.isReversedDepthBuffer()?Io:Po,s=mo):s=gu,t.setTexture2D(e||s,r)}function V0(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||xu,r)}function H0(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||vu,r)}function W0(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||_u,r)}function X0(n){switch(n){case 5126:return A0;case 35664:return R0;case 35665:return C0;case 35666:return w0;case 35674:return P0;case 35675:return I0;case 35676:return D0;case 5124:case 35670:return L0;case 35667:case 35671:return U0;case 35668:case 35672:return N0;case 35669:case 35673:return F0;case 5125:return O0;case 36294:return B0;case 36295:return k0;case 36296:return z0;case 35678:case 36198:case 36298:case 36306:case 35682:return G0;case 35679:case 36299:case 36307:return V0;case 35680:case 36300:case 36308:case 36293:return H0;case 36289:case 36303:case 36311:case 36292:return W0}}function q0(n,e){n.uniform1fv(this.addr,e)}function Y0(n,e){const t=rr(e,this.size,2);n.uniform2fv(this.addr,t)}function $0(n,e){const t=rr(e,this.size,3);n.uniform3fv(this.addr,t)}function K0(n,e){const t=rr(e,this.size,4);n.uniform4fv(this.addr,t)}function Z0(n,e){const t=rr(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function J0(n,e){const t=rr(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function Q0(n,e){const t=rr(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function j0(n,e){n.uniform1iv(this.addr,e)}function eg(n,e){n.uniform2iv(this.addr,e)}function tg(n,e){n.uniform3iv(this.addr,e)}function ng(n,e){n.uniform4iv(this.addr,e)}function ig(n,e){n.uniform1uiv(this.addr,e)}function rg(n,e){n.uniform2uiv(this.addr,e)}function sg(n,e){n.uniform3uiv(this.addr,e)}function ag(n,e){n.uniform4uiv(this.addr,e)}function og(n,e,t){const i=this.cache,r=e.length,s=Ls(t,r);Rt(i,s)||(n.uniform1iv(this.addr,s),Ct(i,s));let a;this.type===n.SAMPLER_2D_SHADOW?a=mo:a=gu;for(let o=0;o!==r;++o)t.setTexture2D(e[o]||a,s[o])}function cg(n,e,t){const i=this.cache,r=e.length,s=Ls(t,r);Rt(i,s)||(n.uniform1iv(this.addr,s),Ct(i,s));for(let a=0;a!==r;++a)t.setTexture3D(e[a]||xu,s[a])}function lg(n,e,t){const i=this.cache,r=e.length,s=Ls(t,r);Rt(i,s)||(n.uniform1iv(this.addr,s),Ct(i,s));for(let a=0;a!==r;++a)t.setTextureCube(e[a]||vu,s[a])}function ug(n,e,t){const i=this.cache,r=e.length,s=Ls(t,r);Rt(i,s)||(n.uniform1iv(this.addr,s),Ct(i,s));for(let a=0;a!==r;++a)t.setTexture2DArray(e[a]||_u,s[a])}function fg(n){switch(n){case 5126:return q0;case 35664:return Y0;case 35665:return $0;case 35666:return K0;case 35674:return Z0;case 35675:return J0;case 35676:return Q0;case 5124:case 35670:return j0;case 35667:case 35671:return eg;case 35668:case 35672:return tg;case 35669:case 35673:return ng;case 5125:return ig;case 36294:return rg;case 36295:return sg;case 36296:return ag;case 35678:case 36198:case 36298:case 36306:case 35682:return og;case 35679:case 36299:case 36307:return cg;case 35680:case 36300:case 36308:case 36293:return lg;case 36289:case 36303:case 36311:case 36292:return ug}}class dg{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=X0(t.type)}}class hg{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=fg(t.type)}}class pg{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,t[o.id],i)}}}const xa=/(\w+)(\])?(\[|\.)?/g;function nl(n,e){n.seq.push(e),n.map[e.id]=e}function mg(n,e,t){const i=n.name,r=i.length;for(xa.lastIndex=0;;){const s=xa.exec(i),a=xa.lastIndex;let o=s[1];const c=s[2]==="]",l=s[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===r){nl(t,l===void 0?new dg(o,n,e):new hg(o,n,e));break}else{let d=t.map[o];d===void 0&&(d=new pg(o),nl(t,d)),t=d}}}class hs{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=e.getActiveUniform(t,a),c=e.getUniformLocation(t,o.name);mg(o,c,this)}const r=[],s=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(a):s.push(a);r.length>0&&(this.seq=r.concat(s))}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,a=t.length;s!==a;++s){const o=t[s],c=i[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in t&&i.push(a)}return i}}function il(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const gg=37297;let _g=0;function xg(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=r;a<s;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const rl=new ke;function vg(n){Ze._getMatrix(rl,Ze.workingColorSpace,n);const e=`mat3( ${rl.elements.map(t=>t.toFixed(4))} )`;switch(Ze.getTransfer(n)){case vs:return[e,"LinearTransferOETF"];case rt:return[e,"sRGBTransferOETF"];default:return Oe("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function sl(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),s=(n.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+s+`

`+xg(n.getShaderSource(e),o)}else return s}function Mg(n,e){const t=vg(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const Sg={[Vl]:"Linear",[Hl]:"Reinhard",[Wl]:"Cineon",[yo]:"ACESFilmic",[ql]:"AgX",[Yl]:"Neutral",[Xl]:"Custom"};function yg(n,e){const t=Sg[e];return t===void 0?(Oe("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const is=new V;function Eg(){Ze.getLuminanceCoefficients(is);const n=is.x.toFixed(4),e=is.y.toFixed(4),t=is.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function bg(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Mr).join(`
`)}function Tg(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function Ag(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),a=s.name;let o=1;s.type===n.FLOAT_MAT2&&(o=2),s.type===n.FLOAT_MAT3&&(o=3),s.type===n.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function Mr(n){return n!==""}function al(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function ol(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Rg=/^[ \t]*#include +<([\w\d./]+)>/gm;function go(n){return n.replace(Rg,wg)}const Cg=new Map;function wg(n,e){let t=Xe[e];if(t===void 0){const i=Cg.get(e);if(i!==void 0)t=Xe[i],Oe('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return go(t)}const Pg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function cl(n){return n.replace(Pg,Ig)}function Ig(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function ll(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}const Dg={[cs]:"SHADOWMAP_TYPE_PCF",[vr]:"SHADOWMAP_TYPE_VSM"};function Lg(n){return Dg[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Ug={[Si]:"ENVMAP_TYPE_CUBE",[ji]:"ENVMAP_TYPE_CUBE",[ws]:"ENVMAP_TYPE_CUBE_UV"};function Ng(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":Ug[n.envMapMode]||"ENVMAP_TYPE_CUBE"}const Fg={[ji]:"ENVMAP_MODE_REFRACTION"};function Og(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":Fg[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Bg={[Gl]:"ENVMAP_BLENDING_MULTIPLY",[Ed]:"ENVMAP_BLENDING_MIX",[bd]:"ENVMAP_BLENDING_ADD"};function kg(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":Bg[n.combine]||"ENVMAP_BLENDING_NONE"}function zg(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function Gg(n,e,t,i){const r=n.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=Lg(t),l=Ng(t),u=Og(t),d=kg(t),f=zg(t),m=bg(t),_=Tg(s),S=r.createProgram();let p,h,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Mr).join(`
`),p.length>0&&(p+=`
`),h=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Mr).join(`
`),h.length>0&&(h+=`
`)):(p=[ll(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Mr).join(`
`),h=[ll(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Tn?"#define TONE_MAPPING":"",t.toneMapping!==Tn?Xe.tonemapping_pars_fragment:"",t.toneMapping!==Tn?yg("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Xe.colorspace_pars_fragment,Mg("linearToOutputTexel",t.outputColorSpace),Eg(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Mr).join(`
`)),a=go(a),a=al(a,t),a=ol(a,t),o=go(o),o=al(o,t),o=ol(o,t),a=cl(a),o=cl(o),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,h=["#define varying in",t.glslVersion===vc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===vc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+h);const A=y+p+a,M=y+h+o,b=il(r,r.VERTEX_SHADER,A),E=il(r,r.FRAGMENT_SHADER,M);r.attachShader(S,b),r.attachShader(S,E),t.index0AttributeName!==void 0?r.bindAttribLocation(S,0,t.index0AttributeName):t.hasPositionAttribute===!0&&r.bindAttribLocation(S,0,"position"),r.linkProgram(S);function P(R){if(n.debug.checkShaderErrors){const I=r.getProgramInfoLog(S)||"",D=r.getShaderInfoLog(b)||"",F=r.getShaderInfoLog(E)||"",L=I.trim(),q=D.trim(),B=F.trim();let z=!0,J=!0;if(r.getProgramParameter(S,r.LINK_STATUS)===!1)if(z=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,S,b,E);else{const ne=sl(r,b,"vertex"),se=sl(r,E,"fragment");nt("WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(S,r.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+L+`
`+ne+`
`+se)}else L!==""?Oe("WebGLProgram: Program Info Log:",L):(q===""||B==="")&&(J=!1);J&&(R.diagnostics={runnable:z,programLog:L,vertexShader:{log:q,prefix:p},fragmentShader:{log:B,prefix:h}})}r.deleteShader(b),r.deleteShader(E),g=new hs(r,S),v=Ag(r,S)}let g;this.getUniforms=function(){return g===void 0&&P(this),g};let v;this.getAttributes=function(){return v===void 0&&P(this),v};let w=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return w===!1&&(w=r.getProgramParameter(S,gg)),w},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(S),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=_g++,this.cacheKey=e,this.usedTimes=1,this.program=S,this.vertexShader=b,this.fragmentShader=E,this}let Vg=0;class Hg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){const r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(i)===!1&&(r.add(i),i.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new Wg(e),t.set(e,i)),i}}class Wg{constructor(e){this.id=Vg++,this.code=e,this.usedTimes=0}}function Xg(n){return n===yi||n===gs||n===_s}function qg(n,e,t,i,r,s){const a=new iu,o=new Hg,c=new Set,l=[],u=new Map,d=i.logarithmicDepthBuffer;let f=i.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(g){return c.add(g),g===0?"uv":`uv${g}`}function S(g,v,w,R,I,D){const F=R.fog,L=I.geometry,q=g.isMeshStandardMaterial||g.isMeshLambertMaterial||g.isMeshPhongMaterial?R.environment:null,B=g.isMeshStandardMaterial||g.isMeshLambertMaterial&&!g.envMap||g.isMeshPhongMaterial&&!g.envMap,z=e.get(g.envMap||q,B),J=z&&z.mapping===ws?z.image.height:null,ne=m[g.type];g.precision!==null&&(f=i.getMaxPrecision(g.precision),f!==g.precision&&Oe("WebGLProgram.getParameters:",g.precision,"not supported, using",f,"instead."));const se=L.morphAttributes.position||L.morphAttributes.normal||L.morphAttributes.color,de=se!==void 0?se.length:0;let Ue=0;L.morphAttributes.position!==void 0&&(Ue=1),L.morphAttributes.normal!==void 0&&(Ue=2),L.morphAttributes.color!==void 0&&(Ue=3);let $e,Ge,Z,ee;if(ne){const Te=En[ne];$e=Te.vertexShader,Ge=Te.fragmentShader}else{$e=g.vertexShader,Ge=g.fragmentShader;const Te=o.getVertexShaderStage(g),xt=o.getFragmentShaderStage(g);o.update(g,Te,xt),Z=Te.id,ee=xt.id}const ae=n.getRenderTarget(),Ne=n.state.buffers.depth.getReversed(),Be=I.isInstancedMesh===!0,De=I.isBatchedMesh===!0,mt=!!g.map,We=!!g.matcap,it=!!z,et=!!g.aoMap,Ke=!!g.lightMap,ie=!!g.bumpMap&&g.wireframe===!1,ue=!!g.normalMap,ve=!!g.displacementMap,be=!!g.emissiveMap,Me=!!g.metalnessMap,Le=!!g.roughnessMap,U=g.anisotropy>0,je=g.clearcoat>0,He=g.dispersion>0,C=g.iridescence>0,x=g.sheen>0,k=g.transmission>0,H=U&&!!g.anisotropyMap,$=je&&!!g.clearcoatMap,ce=je&&!!g.clearcoatNormalMap,fe=je&&!!g.clearcoatRoughnessMap,K=C&&!!g.iridescenceMap,G=C&&!!g.iridescenceThicknessMap,j=x&&!!g.sheenColorMap,le=x&&!!g.sheenRoughnessMap,oe=!!g.specularMap,re=!!g.specularColorMap,Ee=!!g.specularIntensityMap,Pe=k&&!!g.transmissionMap,Fe=k&&!!g.thicknessMap,N=!!g.gradientMap,he=!!g.alphaMap,Q=g.alphaTest>0,pe=!!g.alphaHash,xe=!!g.extensions;let te=Tn;g.toneMapped&&(ae===null||ae.isXRRenderTarget===!0)&&(te=n.toneMapping);const Ce={shaderID:ne,shaderType:g.type,shaderName:g.name,vertexShader:$e,fragmentShader:Ge,defines:g.defines,customVertexShaderID:Z,customFragmentShaderID:ee,isRawShaderMaterial:g.isRawShaderMaterial===!0,glslVersion:g.glslVersion,precision:f,batching:De,batchingColor:De&&I._colorsTexture!==null,instancing:Be,instancingColor:Be&&I.instanceColor!==null,instancingMorph:Be&&I.morphTexture!==null,outputColorSpace:ae===null?n.outputColorSpace:ae.isXRRenderTarget===!0?ae.texture.colorSpace:Ze.workingColorSpace,alphaToCoverage:!!g.alphaToCoverage,map:mt,matcap:We,envMap:it,envMapMode:it&&z.mapping,envMapCubeUVHeight:J,aoMap:et,lightMap:Ke,bumpMap:ie,normalMap:ue,displacementMap:ve,emissiveMap:be,normalMapObjectSpace:ue&&g.normalMapType===Rd,normalMapTangentSpace:ue&&g.normalMapType===fo,packedNormalMap:ue&&g.normalMapType===fo&&Xg(g.normalMap.format),metalnessMap:Me,roughnessMap:Le,anisotropy:U,anisotropyMap:H,clearcoat:je,clearcoatMap:$,clearcoatNormalMap:ce,clearcoatRoughnessMap:fe,dispersion:He,iridescence:C,iridescenceMap:K,iridescenceThicknessMap:G,sheen:x,sheenColorMap:j,sheenRoughnessMap:le,specularMap:oe,specularColorMap:re,specularIntensityMap:Ee,transmission:k,transmissionMap:Pe,thicknessMap:Fe,gradientMap:N,opaque:g.transparent===!1&&g.blending===Ki&&g.alphaToCoverage===!1,alphaMap:he,alphaTest:Q,alphaHash:pe,combine:g.combine,mapUv:mt&&_(g.map.channel),aoMapUv:et&&_(g.aoMap.channel),lightMapUv:Ke&&_(g.lightMap.channel),bumpMapUv:ie&&_(g.bumpMap.channel),normalMapUv:ue&&_(g.normalMap.channel),displacementMapUv:ve&&_(g.displacementMap.channel),emissiveMapUv:be&&_(g.emissiveMap.channel),metalnessMapUv:Me&&_(g.metalnessMap.channel),roughnessMapUv:Le&&_(g.roughnessMap.channel),anisotropyMapUv:H&&_(g.anisotropyMap.channel),clearcoatMapUv:$&&_(g.clearcoatMap.channel),clearcoatNormalMapUv:ce&&_(g.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:fe&&_(g.clearcoatRoughnessMap.channel),iridescenceMapUv:K&&_(g.iridescenceMap.channel),iridescenceThicknessMapUv:G&&_(g.iridescenceThicknessMap.channel),sheenColorMapUv:j&&_(g.sheenColorMap.channel),sheenRoughnessMapUv:le&&_(g.sheenRoughnessMap.channel),specularMapUv:oe&&_(g.specularMap.channel),specularColorMapUv:re&&_(g.specularColorMap.channel),specularIntensityMapUv:Ee&&_(g.specularIntensityMap.channel),transmissionMapUv:Pe&&_(g.transmissionMap.channel),thicknessMapUv:Fe&&_(g.thicknessMap.channel),alphaMapUv:he&&_(g.alphaMap.channel),vertexTangents:!!L.attributes.tangent&&(ue||U),vertexNormals:!!L.attributes.normal,vertexColors:g.vertexColors,vertexAlphas:g.vertexColors===!0&&!!L.attributes.color&&L.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!L.attributes.uv&&(mt||he),fog:!!F,useFog:g.fog===!0,fogExp2:!!F&&F.isFogExp2,flatShading:g.wireframe===!1&&(g.flatShading===!0||L.attributes.normal===void 0&&ue===!1&&(g.isMeshLambertMaterial||g.isMeshPhongMaterial||g.isMeshStandardMaterial||g.isMeshPhysicalMaterial)),sizeAttenuation:g.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:Ne,skinning:I.isSkinnedMesh===!0,hasPositionAttribute:L.attributes.position!==void 0,morphTargets:L.morphAttributes.position!==void 0,morphNormals:L.morphAttributes.normal!==void 0,morphColors:L.morphAttributes.color!==void 0,morphTargetsCount:de,morphTextureStride:Ue,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numLightProbeGrids:D.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:g.dithering,shadowMapEnabled:n.shadowMap.enabled&&w.length>0,shadowMapType:n.shadowMap.type,toneMapping:te,decodeVideoTexture:mt&&g.map.isVideoTexture===!0&&Ze.getTransfer(g.map.colorSpace)===rt,decodeVideoTextureEmissive:be&&g.emissiveMap.isVideoTexture===!0&&Ze.getTransfer(g.emissiveMap.colorSpace)===rt,premultipliedAlpha:g.premultipliedAlpha,doubleSided:g.side===Fn,flipSided:g.side===Yt,useDepthPacking:g.depthPacking>=0,depthPacking:g.depthPacking||0,index0AttributeName:g.index0AttributeName,extensionClipCullDistance:xe&&g.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(xe&&g.extensions.multiDraw===!0||De)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:g.customProgramCacheKey()};return Ce.vertexUv1s=c.has(1),Ce.vertexUv2s=c.has(2),Ce.vertexUv3s=c.has(3),c.clear(),Ce}function p(g){const v=[];if(g.shaderID?v.push(g.shaderID):(v.push(g.customVertexShaderID),v.push(g.customFragmentShaderID)),g.defines!==void 0)for(const w in g.defines)v.push(w),v.push(g.defines[w]);return g.isRawShaderMaterial===!1&&(h(v,g),y(v,g),v.push(n.outputColorSpace)),v.push(g.customProgramCacheKey),v.join()}function h(g,v){g.push(v.precision),g.push(v.outputColorSpace),g.push(v.envMapMode),g.push(v.envMapCubeUVHeight),g.push(v.mapUv),g.push(v.alphaMapUv),g.push(v.lightMapUv),g.push(v.aoMapUv),g.push(v.bumpMapUv),g.push(v.normalMapUv),g.push(v.displacementMapUv),g.push(v.emissiveMapUv),g.push(v.metalnessMapUv),g.push(v.roughnessMapUv),g.push(v.anisotropyMapUv),g.push(v.clearcoatMapUv),g.push(v.clearcoatNormalMapUv),g.push(v.clearcoatRoughnessMapUv),g.push(v.iridescenceMapUv),g.push(v.iridescenceThicknessMapUv),g.push(v.sheenColorMapUv),g.push(v.sheenRoughnessMapUv),g.push(v.specularMapUv),g.push(v.specularColorMapUv),g.push(v.specularIntensityMapUv),g.push(v.transmissionMapUv),g.push(v.thicknessMapUv),g.push(v.combine),g.push(v.fogExp2),g.push(v.sizeAttenuation),g.push(v.morphTargetsCount),g.push(v.morphAttributeCount),g.push(v.numDirLights),g.push(v.numPointLights),g.push(v.numSpotLights),g.push(v.numSpotLightMaps),g.push(v.numHemiLights),g.push(v.numRectAreaLights),g.push(v.numDirLightShadows),g.push(v.numPointLightShadows),g.push(v.numSpotLightShadows),g.push(v.numSpotLightShadowsWithMaps),g.push(v.numLightProbes),g.push(v.shadowMapType),g.push(v.toneMapping),g.push(v.numClippingPlanes),g.push(v.numClipIntersection),g.push(v.depthPacking)}function y(g,v){a.disableAll(),v.instancing&&a.enable(0),v.instancingColor&&a.enable(1),v.instancingMorph&&a.enable(2),v.matcap&&a.enable(3),v.envMap&&a.enable(4),v.normalMapObjectSpace&&a.enable(5),v.normalMapTangentSpace&&a.enable(6),v.clearcoat&&a.enable(7),v.iridescence&&a.enable(8),v.alphaTest&&a.enable(9),v.vertexColors&&a.enable(10),v.vertexAlphas&&a.enable(11),v.vertexUv1s&&a.enable(12),v.vertexUv2s&&a.enable(13),v.vertexUv3s&&a.enable(14),v.vertexTangents&&a.enable(15),v.anisotropy&&a.enable(16),v.alphaHash&&a.enable(17),v.batching&&a.enable(18),v.dispersion&&a.enable(19),v.batchingColor&&a.enable(20),v.gradientMap&&a.enable(21),v.packedNormalMap&&a.enable(22),v.vertexNormals&&a.enable(23),g.push(a.mask),a.disableAll(),v.fog&&a.enable(0),v.useFog&&a.enable(1),v.flatShading&&a.enable(2),v.logarithmicDepthBuffer&&a.enable(3),v.reversedDepthBuffer&&a.enable(4),v.skinning&&a.enable(5),v.morphTargets&&a.enable(6),v.morphNormals&&a.enable(7),v.morphColors&&a.enable(8),v.premultipliedAlpha&&a.enable(9),v.shadowMapEnabled&&a.enable(10),v.doubleSided&&a.enable(11),v.flipSided&&a.enable(12),v.useDepthPacking&&a.enable(13),v.dithering&&a.enable(14),v.transmission&&a.enable(15),v.sheen&&a.enable(16),v.opaque&&a.enable(17),v.pointsUvs&&a.enable(18),v.decodeVideoTexture&&a.enable(19),v.decodeVideoTextureEmissive&&a.enable(20),v.alphaToCoverage&&a.enable(21),v.numLightProbeGrids>0&&a.enable(22),v.hasPositionAttribute&&a.enable(23),g.push(a.mask)}function A(g){const v=m[g.type];let w;if(v){const R=En[v];w=dh.clone(R.uniforms)}else w=g.uniforms;return w}function M(g,v){let w=u.get(v);return w!==void 0?++w.usedTimes:(w=new Gg(n,v,g,r),l.push(w),u.set(v,w)),w}function b(g){if(--g.usedTimes===0){const v=l.indexOf(g);l[v]=l[l.length-1],l.pop(),u.delete(g.cacheKey),g.destroy()}}function E(g){o.remove(g)}function P(){o.dispose()}return{getParameters:S,getProgramCacheKey:p,getUniforms:A,acquireProgram:M,releaseProgram:b,releaseShaderCache:E,programs:l,dispose:P}}function Yg(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function r(a,o,c){n.get(a)[o]=c}function s(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:s}}function $g(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function ul(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function fl(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function a(f){let m=0;return f.isInstancedMesh&&(m+=2),f.isSkinnedMesh&&(m+=1),m}function o(f,m,_,S,p,h){let y=n[e];return y===void 0?(y={id:f.id,object:f,geometry:m,material:_,materialVariant:a(f),groupOrder:S,renderOrder:f.renderOrder,z:p,group:h},n[e]=y):(y.id=f.id,y.object=f,y.geometry=m,y.material=_,y.materialVariant=a(f),y.groupOrder=S,y.renderOrder=f.renderOrder,y.z=p,y.group=h),e++,y}function c(f,m,_,S,p,h){const y=o(f,m,_,S,p,h);_.transmission>0?i.push(y):_.transparent===!0?r.push(y):t.push(y)}function l(f,m,_,S,p,h){const y=o(f,m,_,S,p,h);_.transmission>0?i.unshift(y):_.transparent===!0?r.unshift(y):t.unshift(y)}function u(f,m,_){t.length>1&&t.sort(f||$g),i.length>1&&i.sort(m||ul),r.length>1&&r.sort(m||ul),_&&(t.reverse(),i.reverse(),r.reverse())}function d(){for(let f=e,m=n.length;f<m;f++){const _=n[f];if(_.id===null)break;_.id=null,_.object=null,_.geometry=null,_.material=null,_.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:c,unshift:l,finish:d,sort:u}}function Kg(){let n=new WeakMap;function e(i,r){const s=n.get(i);let a;return s===void 0?(a=new fl,n.set(i,[a])):r>=s.length?(a=new fl,s.push(a)):a=s[r],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function Zg(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new V,color:new Ye};break;case"SpotLight":t={position:new V,direction:new V,color:new Ye,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new V,color:new Ye,distance:0,decay:0};break;case"HemisphereLight":t={direction:new V,skyColor:new Ye,groundColor:new Ye};break;case"RectAreaLight":t={color:new Ye,position:new V,halfWidth:new V,halfHeight:new V};break}return n[e.id]=t,t}}}function Jg(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Qe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Qe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Qe,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let Qg=0;function jg(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function e_(n){const e=new Zg,t=Jg(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new V);const r=new V,s=new pt,a=new pt;function o(l){let u=0,d=0,f=0;for(let v=0;v<9;v++)i.probe[v].set(0,0,0);let m=0,_=0,S=0,p=0,h=0,y=0,A=0,M=0,b=0,E=0,P=0;l.sort(jg);for(let v=0,w=l.length;v<w;v++){const R=l[v],I=R.color,D=R.intensity,F=R.distance;let L=null;if(R.shadow&&R.shadow.map&&(R.shadow.map.texture.format===yi?L=R.shadow.map.texture:L=R.shadow.map.depthTexture||R.shadow.map.texture),R.isAmbientLight)u+=I.r*D,d+=I.g*D,f+=I.b*D;else if(R.isLightProbe){for(let q=0;q<9;q++)i.probe[q].addScaledVector(R.sh.coefficients[q],D);P++}else if(R.isDirectionalLight){const q=e.get(R);if(q.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const B=R.shadow,z=t.get(R);z.shadowIntensity=B.intensity,z.shadowBias=B.bias,z.shadowNormalBias=B.normalBias,z.shadowRadius=B.radius,z.shadowMapSize=B.mapSize,i.directionalShadow[m]=z,i.directionalShadowMap[m]=L,i.directionalShadowMatrix[m]=R.shadow.matrix,y++}i.directional[m]=q,m++}else if(R.isSpotLight){const q=e.get(R);q.position.setFromMatrixPosition(R.matrixWorld),q.color.copy(I).multiplyScalar(D),q.distance=F,q.coneCos=Math.cos(R.angle),q.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),q.decay=R.decay,i.spot[S]=q;const B=R.shadow;if(R.map&&(i.spotLightMap[b]=R.map,b++,B.updateMatrices(R),R.castShadow&&E++),i.spotLightMatrix[S]=B.matrix,R.castShadow){const z=t.get(R);z.shadowIntensity=B.intensity,z.shadowBias=B.bias,z.shadowNormalBias=B.normalBias,z.shadowRadius=B.radius,z.shadowMapSize=B.mapSize,i.spotShadow[S]=z,i.spotShadowMap[S]=L,M++}S++}else if(R.isRectAreaLight){const q=e.get(R);q.color.copy(I).multiplyScalar(D),q.halfWidth.set(R.width*.5,0,0),q.halfHeight.set(0,R.height*.5,0),i.rectArea[p]=q,p++}else if(R.isPointLight){const q=e.get(R);if(q.color.copy(R.color).multiplyScalar(R.intensity),q.distance=R.distance,q.decay=R.decay,R.castShadow){const B=R.shadow,z=t.get(R);z.shadowIntensity=B.intensity,z.shadowBias=B.bias,z.shadowNormalBias=B.normalBias,z.shadowRadius=B.radius,z.shadowMapSize=B.mapSize,z.shadowCameraNear=B.camera.near,z.shadowCameraFar=B.camera.far,i.pointShadow[_]=z,i.pointShadowMap[_]=L,i.pointShadowMatrix[_]=R.shadow.matrix,A++}i.point[_]=q,_++}else if(R.isHemisphereLight){const q=e.get(R);q.skyColor.copy(R.color).multiplyScalar(D),q.groundColor.copy(R.groundColor).multiplyScalar(D),i.hemi[h]=q,h++}}p>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=me.LTC_FLOAT_1,i.rectAreaLTC2=me.LTC_FLOAT_2):(i.rectAreaLTC1=me.LTC_HALF_1,i.rectAreaLTC2=me.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=d,i.ambient[2]=f;const g=i.hash;(g.directionalLength!==m||g.pointLength!==_||g.spotLength!==S||g.rectAreaLength!==p||g.hemiLength!==h||g.numDirectionalShadows!==y||g.numPointShadows!==A||g.numSpotShadows!==M||g.numSpotMaps!==b||g.numLightProbes!==P)&&(i.directional.length=m,i.spot.length=S,i.rectArea.length=p,i.point.length=_,i.hemi.length=h,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=A,i.pointShadowMap.length=A,i.spotShadow.length=M,i.spotShadowMap.length=M,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=A,i.spotLightMatrix.length=M+b-E,i.spotLightMap.length=b,i.numSpotLightShadowsWithMaps=E,i.numLightProbes=P,g.directionalLength=m,g.pointLength=_,g.spotLength=S,g.rectAreaLength=p,g.hemiLength=h,g.numDirectionalShadows=y,g.numPointShadows=A,g.numSpotShadows=M,g.numSpotMaps=b,g.numLightProbes=P,i.version=Qg++)}function c(l,u){let d=0,f=0,m=0,_=0,S=0;const p=u.matrixWorldInverse;for(let h=0,y=l.length;h<y;h++){const A=l[h];if(A.isDirectionalLight){const M=i.directional[d];M.direction.setFromMatrixPosition(A.matrixWorld),r.setFromMatrixPosition(A.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(p),d++}else if(A.isSpotLight){const M=i.spot[m];M.position.setFromMatrixPosition(A.matrixWorld),M.position.applyMatrix4(p),M.direction.setFromMatrixPosition(A.matrixWorld),r.setFromMatrixPosition(A.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(p),m++}else if(A.isRectAreaLight){const M=i.rectArea[_];M.position.setFromMatrixPosition(A.matrixWorld),M.position.applyMatrix4(p),a.identity(),s.copy(A.matrixWorld),s.premultiply(p),a.extractRotation(s),M.halfWidth.set(A.width*.5,0,0),M.halfHeight.set(0,A.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),_++}else if(A.isPointLight){const M=i.point[f];M.position.setFromMatrixPosition(A.matrixWorld),M.position.applyMatrix4(p),f++}else if(A.isHemisphereLight){const M=i.hemi[S];M.direction.setFromMatrixPosition(A.matrixWorld),M.direction.transformDirection(p),S++}}}return{setup:o,setupView:c,state:i}}function dl(n){const e=new e_(n),t=[],i=[],r=[];function s(f){d.camera=f,t.length=0,i.length=0,r.length=0}function a(f){t.push(f)}function o(f){i.push(f)}function c(f){r.push(f)}function l(){e.setup(t)}function u(f){e.setupView(t,f)}const d={lightsArray:t,shadowsArray:i,lightProbeGridArray:r,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:d,setupLights:l,setupLightsView:u,pushLight:a,pushShadow:o,pushLightProbeGrid:c}}function t_(n){let e=new WeakMap;function t(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new dl(n),e.set(r,[o])):s>=a.length?(o=new dl(n),a.push(o)):o=a[s],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const n_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,i_=`uniform sampler2D shadow_pass;
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
}`,r_=[new V(1,0,0),new V(-1,0,0),new V(0,1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1)],s_=[new V(0,-1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1),new V(0,-1,0),new V(0,-1,0)],hl=new pt,mr=new V,va=new V;function a_(n,e,t){let i=new Uo;const r=new Qe,s=new Qe,a=new _t,o=new gh,c=new _h,l={},u=t.maxTextureSize,d={[ri]:Yt,[Yt]:ri,[Fn]:Fn},f=new Cn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Qe},radius:{value:4}},vertexShader:n_,fragmentShader:i_}),m=f.clone();m.defines.HORIZONTAL_PASS=1;const _=new mn;_.setAttribute("position",new pn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const S=new Mt(_,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=cs;let h=this.type;this.render=function(E,P,g){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||E.length===0)return;this.type===rd&&(Oe("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=cs);const v=n.getRenderTarget(),w=n.getActiveCubeFace(),R=n.getActiveMipmapLevel(),I=n.state;I.setBlending(Bn),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const D=h!==this.type;D&&P.traverse(function(F){F.material&&(Array.isArray(F.material)?F.material.forEach(L=>L.needsUpdate=!0):F.material.needsUpdate=!0)});for(let F=0,L=E.length;F<L;F++){const q=E[F],B=q.shadow;if(B===void 0){Oe("WebGLShadowMap:",q,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;r.copy(B.mapSize);const z=B.getFrameExtents();r.multiply(z),s.copy(B.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/z.x),r.x=s.x*z.x,B.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/z.y),r.y=s.y*z.y,B.mapSize.y=s.y));const J=n.state.buffers.depth.getReversed();if(B.camera._reversedDepth=J,B.map===null||D===!0){if(B.map!==null&&(B.map.depthTexture!==null&&(B.map.depthTexture.dispose(),B.map.depthTexture=null),B.map.dispose()),this.type===vr){if(q.isPointLight){Oe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}B.map=new An(r.x,r.y,{format:yi,type:Vn,minFilter:Bt,magFilter:Bt,generateMipmaps:!1}),B.map.texture.name=q.name+".shadowMap",B.map.depthTexture=new er(r.x,r.y,dn),B.map.depthTexture.name=q.name+".shadowMapDepth",B.map.depthTexture.format=Hn,B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=Lt,B.map.depthTexture.magFilter=Lt}else q.isPointLight?(B.map=new mu(r.x),B.map.depthTexture=new uh(r.x,Rn)):(B.map=new An(r.x,r.y),B.map.depthTexture=new er(r.x,r.y,Rn)),B.map.depthTexture.name=q.name+".shadowMap",B.map.depthTexture.format=Hn,this.type===cs?(B.map.depthTexture.compareFunction=J?Io:Po,B.map.depthTexture.minFilter=Bt,B.map.depthTexture.magFilter=Bt):(B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=Lt,B.map.depthTexture.magFilter=Lt);B.camera.updateProjectionMatrix()}const ne=B.map.isWebGLCubeRenderTarget?6:1;for(let se=0;se<ne;se++){if(B.map.isWebGLCubeRenderTarget)n.setRenderTarget(B.map,se),n.clear();else{se===0&&(n.setRenderTarget(B.map),n.clear());const de=B.getViewport(se);a.set(s.x*de.x,s.y*de.y,s.x*de.z,s.y*de.w),I.viewport(a)}if(q.isPointLight){const de=B.camera,Ue=B.matrix,$e=q.distance||de.far;$e!==de.far&&(de.far=$e,de.updateProjectionMatrix()),mr.setFromMatrixPosition(q.matrixWorld),de.position.copy(mr),va.copy(de.position),va.add(r_[se]),de.up.copy(s_[se]),de.lookAt(va),de.updateMatrixWorld(),Ue.makeTranslation(-mr.x,-mr.y,-mr.z),hl.multiplyMatrices(de.projectionMatrix,de.matrixWorldInverse),B._frustum.setFromProjectionMatrix(hl,de.coordinateSystem,de.reversedDepth)}else B.updateMatrices(q);i=B.getFrustum(),M(P,g,B.camera,q,this.type)}B.isPointLightShadow!==!0&&this.type===vr&&y(B,g),B.needsUpdate=!1}h=this.type,p.needsUpdate=!1,n.setRenderTarget(v,w,R)};function y(E,P){const g=e.update(S);f.defines.VSM_SAMPLES!==E.blurSamples&&(f.defines.VSM_SAMPLES=E.blurSamples,m.defines.VSM_SAMPLES=E.blurSamples,f.needsUpdate=!0,m.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new An(r.x,r.y,{format:yi,type:Vn})),f.uniforms.shadow_pass.value=E.map.depthTexture,f.uniforms.resolution.value=E.mapSize,f.uniforms.radius.value=E.radius,n.setRenderTarget(E.mapPass),n.clear(),n.renderBufferDirect(P,null,g,f,S,null),m.uniforms.shadow_pass.value=E.mapPass.texture,m.uniforms.resolution.value=E.mapSize,m.uniforms.radius.value=E.radius,n.setRenderTarget(E.map),n.clear(),n.renderBufferDirect(P,null,g,m,S,null)}function A(E,P,g,v){let w=null;const R=g.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(R!==void 0)w=R;else if(w=g.isPointLight===!0?c:o,n.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){const I=w.uuid,D=P.uuid;let F=l[I];F===void 0&&(F={},l[I]=F);let L=F[D];L===void 0&&(L=w.clone(),F[D]=L,P.addEventListener("dispose",b)),w=L}if(w.visible=P.visible,w.wireframe=P.wireframe,v===vr?w.side=P.shadowSide!==null?P.shadowSide:P.side:w.side=P.shadowSide!==null?P.shadowSide:d[P.side],w.alphaMap=P.alphaMap,w.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,w.map=P.map,w.clipShadows=P.clipShadows,w.clippingPlanes=P.clippingPlanes,w.clipIntersection=P.clipIntersection,w.displacementMap=P.displacementMap,w.displacementScale=P.displacementScale,w.displacementBias=P.displacementBias,w.wireframeLinewidth=P.wireframeLinewidth,w.linewidth=P.linewidth,g.isPointLight===!0&&w.isMeshDistanceMaterial===!0){const I=n.properties.get(w);I.light=g}return w}function M(E,P,g,v,w){if(E.visible===!1)return;if(E.layers.test(P.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&w===vr)&&(!E.frustumCulled||i.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(g.matrixWorldInverse,E.matrixWorld);const D=e.update(E),F=E.material;if(Array.isArray(F)){const L=D.groups;for(let q=0,B=L.length;q<B;q++){const z=L[q],J=F[z.materialIndex];if(J&&J.visible){const ne=A(E,J,v,w);E.onBeforeShadow(n,E,P,g,D,ne,z),n.renderBufferDirect(g,null,D,ne,E,z),E.onAfterShadow(n,E,P,g,D,ne,z)}}}else if(F.visible){const L=A(E,F,v,w);E.onBeforeShadow(n,E,P,g,D,L,null),n.renderBufferDirect(g,null,D,L,E,null),E.onAfterShadow(n,E,P,g,D,L,null)}}const I=E.children;for(let D=0,F=I.length;D<F;D++)M(I[D],P,g,v,w)}function b(E){E.target.removeEventListener("dispose",b);for(const g in l){const v=l[g],w=E.target.uuid;w in v&&(v[w].dispose(),delete v[w])}}}function o_(n,e){function t(){let N=!1;const he=new _t;let Q=null;const pe=new _t(0,0,0,0);return{setMask:function(xe){Q!==xe&&!N&&(n.colorMask(xe,xe,xe,xe),Q=xe)},setLocked:function(xe){N=xe},setClear:function(xe,te,Ce,Te,xt){xt===!0&&(xe*=Te,te*=Te,Ce*=Te),he.set(xe,te,Ce,Te),pe.equals(he)===!1&&(n.clearColor(xe,te,Ce,Te),pe.copy(he))},reset:function(){N=!1,Q=null,pe.set(-1,0,0,0)}}}function i(){let N=!1,he=!1,Q=null,pe=null,xe=null;return{setReversed:function(te){if(he!==te){const Ce=e.get("EXT_clip_control");te?Ce.clipControlEXT(Ce.LOWER_LEFT_EXT,Ce.ZERO_TO_ONE_EXT):Ce.clipControlEXT(Ce.LOWER_LEFT_EXT,Ce.NEGATIVE_ONE_TO_ONE_EXT),he=te;const Te=xe;xe=null,this.setClear(Te)}},getReversed:function(){return he},setTest:function(te){te?ae(n.DEPTH_TEST):Ne(n.DEPTH_TEST)},setMask:function(te){Q!==te&&!N&&(n.depthMask(te),Q=te)},setFunc:function(te){if(he&&(te=Od[te]),pe!==te){switch(te){case Ra:n.depthFunc(n.NEVER);break;case Ca:n.depthFunc(n.ALWAYS);break;case wa:n.depthFunc(n.LESS);break;case Qi:n.depthFunc(n.LEQUAL);break;case Pa:n.depthFunc(n.EQUAL);break;case Ia:n.depthFunc(n.GEQUAL);break;case Da:n.depthFunc(n.GREATER);break;case La:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}pe=te}},setLocked:function(te){N=te},setClear:function(te){xe!==te&&(xe=te,he&&(te=1-te),n.clearDepth(te))},reset:function(){N=!1,Q=null,pe=null,xe=null,he=!1}}}function r(){let N=!1,he=null,Q=null,pe=null,xe=null,te=null,Ce=null,Te=null,xt=null;return{setTest:function(ut){N||(ut?ae(n.STENCIL_TEST):Ne(n.STENCIL_TEST))},setMask:function(ut){he!==ut&&!N&&(n.stencilMask(ut),he=ut)},setFunc:function(ut,gn,_n){(Q!==ut||pe!==gn||xe!==_n)&&(n.stencilFunc(ut,gn,_n),Q=ut,pe=gn,xe=_n)},setOp:function(ut,gn,_n){(te!==ut||Ce!==gn||Te!==_n)&&(n.stencilOp(ut,gn,_n),te=ut,Ce=gn,Te=_n)},setLocked:function(ut){N=ut},setClear:function(ut){xt!==ut&&(n.clearStencil(ut),xt=ut)},reset:function(){N=!1,he=null,Q=null,pe=null,xe=null,te=null,Ce=null,Te=null,xt=null}}}const s=new t,a=new i,o=new r,c=new WeakMap,l=new WeakMap;let u={},d={},f={},m=new WeakMap,_=[],S=null,p=!1,h=null,y=null,A=null,M=null,b=null,E=null,P=null,g=new Ye(0,0,0),v=0,w=!1,R=null,I=null,D=null,F=null,L=null;const q=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,z=0;const J=n.getParameter(n.VERSION);J.indexOf("WebGL")!==-1?(z=parseFloat(/^WebGL (\d)/.exec(J)[1]),B=z>=1):J.indexOf("OpenGL ES")!==-1&&(z=parseFloat(/^OpenGL ES (\d)/.exec(J)[1]),B=z>=2);let ne=null,se={};const de=n.getParameter(n.SCISSOR_BOX),Ue=n.getParameter(n.VIEWPORT),$e=new _t().fromArray(de),Ge=new _t().fromArray(Ue);function Z(N,he,Q,pe){const xe=new Uint8Array(4),te=n.createTexture();n.bindTexture(N,te),n.texParameteri(N,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(N,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ce=0;Ce<Q;Ce++)N===n.TEXTURE_3D||N===n.TEXTURE_2D_ARRAY?n.texImage3D(he,0,n.RGBA,1,1,pe,0,n.RGBA,n.UNSIGNED_BYTE,xe):n.texImage2D(he+Ce,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,xe);return te}const ee={};ee[n.TEXTURE_2D]=Z(n.TEXTURE_2D,n.TEXTURE_2D,1),ee[n.TEXTURE_CUBE_MAP]=Z(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),ee[n.TEXTURE_2D_ARRAY]=Z(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),ee[n.TEXTURE_3D]=Z(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ae(n.DEPTH_TEST),a.setFunc(Qi),ie(!1),ue(hc),ae(n.CULL_FACE),et(Bn);function ae(N){u[N]!==!0&&(n.enable(N),u[N]=!0)}function Ne(N){u[N]!==!1&&(n.disable(N),u[N]=!1)}function Be(N,he){return f[N]!==he?(n.bindFramebuffer(N,he),f[N]=he,N===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=he),N===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=he),!0):!1}function De(N,he){let Q=_,pe=!1;if(N){Q=m.get(he),Q===void 0&&(Q=[],m.set(he,Q));const xe=N.textures;if(Q.length!==xe.length||Q[0]!==n.COLOR_ATTACHMENT0){for(let te=0,Ce=xe.length;te<Ce;te++)Q[te]=n.COLOR_ATTACHMENT0+te;Q.length=xe.length,pe=!0}}else Q[0]!==n.BACK&&(Q[0]=n.BACK,pe=!0);pe&&n.drawBuffers(Q)}function mt(N){return S!==N?(n.useProgram(N),S=N,!0):!1}const We={[di]:n.FUNC_ADD,[ad]:n.FUNC_SUBTRACT,[od]:n.FUNC_REVERSE_SUBTRACT};We[cd]=n.MIN,We[ld]=n.MAX;const it={[ud]:n.ZERO,[fd]:n.ONE,[dd]:n.SRC_COLOR,[Ta]:n.SRC_ALPHA,[xd]:n.SRC_ALPHA_SATURATE,[gd]:n.DST_COLOR,[pd]:n.DST_ALPHA,[hd]:n.ONE_MINUS_SRC_COLOR,[Aa]:n.ONE_MINUS_SRC_ALPHA,[_d]:n.ONE_MINUS_DST_COLOR,[md]:n.ONE_MINUS_DST_ALPHA,[vd]:n.CONSTANT_COLOR,[Md]:n.ONE_MINUS_CONSTANT_COLOR,[Sd]:n.CONSTANT_ALPHA,[yd]:n.ONE_MINUS_CONSTANT_ALPHA};function et(N,he,Q,pe,xe,te,Ce,Te,xt,ut){if(N===Bn){p===!0&&(Ne(n.BLEND),p=!1);return}if(p===!1&&(ae(n.BLEND),p=!0),N!==sd){if(N!==h||ut!==w){if((y!==di||b!==di)&&(n.blendEquation(n.FUNC_ADD),y=di,b=di),ut)switch(N){case Ki:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case pc:n.blendFunc(n.ONE,n.ONE);break;case mc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case gc:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:nt("WebGLState: Invalid blending: ",N);break}else switch(N){case Ki:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case pc:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case mc:nt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case gc:nt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:nt("WebGLState: Invalid blending: ",N);break}A=null,M=null,E=null,P=null,g.set(0,0,0),v=0,h=N,w=ut}return}xe=xe||he,te=te||Q,Ce=Ce||pe,(he!==y||xe!==b)&&(n.blendEquationSeparate(We[he],We[xe]),y=he,b=xe),(Q!==A||pe!==M||te!==E||Ce!==P)&&(n.blendFuncSeparate(it[Q],it[pe],it[te],it[Ce]),A=Q,M=pe,E=te,P=Ce),(Te.equals(g)===!1||xt!==v)&&(n.blendColor(Te.r,Te.g,Te.b,xt),g.copy(Te),v=xt),h=N,w=!1}function Ke(N,he){N.side===Fn?Ne(n.CULL_FACE):ae(n.CULL_FACE);let Q=N.side===Yt;he&&(Q=!Q),ie(Q),N.blending===Ki&&N.transparent===!1?et(Bn):et(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),a.setFunc(N.depthFunc),a.setTest(N.depthTest),a.setMask(N.depthWrite),s.setMask(N.colorWrite);const pe=N.stencilWrite;o.setTest(pe),pe&&(o.setMask(N.stencilWriteMask),o.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),o.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),be(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?ae(n.SAMPLE_ALPHA_TO_COVERAGE):Ne(n.SAMPLE_ALPHA_TO_COVERAGE)}function ie(N){R!==N&&(N?n.frontFace(n.CW):n.frontFace(n.CCW),R=N)}function ue(N){N!==nd?(ae(n.CULL_FACE),N!==I&&(N===hc?n.cullFace(n.BACK):N===id?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Ne(n.CULL_FACE),I=N}function ve(N){N!==D&&(B&&n.lineWidth(N),D=N)}function be(N,he,Q){N?(ae(n.POLYGON_OFFSET_FILL),(F!==he||L!==Q)&&(F=he,L=Q,a.getReversed()&&(he=-he),n.polygonOffset(he,Q))):Ne(n.POLYGON_OFFSET_FILL)}function Me(N){N?ae(n.SCISSOR_TEST):Ne(n.SCISSOR_TEST)}function Le(N){N===void 0&&(N=n.TEXTURE0+q-1),ne!==N&&(n.activeTexture(N),ne=N)}function U(N,he,Q){Q===void 0&&(ne===null?Q=n.TEXTURE0+q-1:Q=ne);let pe=se[Q];pe===void 0&&(pe={type:void 0,texture:void 0},se[Q]=pe),(pe.type!==N||pe.texture!==he)&&(ne!==Q&&(n.activeTexture(Q),ne=Q),n.bindTexture(N,he||ee[N]),pe.type=N,pe.texture=he)}function je(){const N=se[ne];N!==void 0&&N.type!==void 0&&(n.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function He(){try{n.compressedTexImage2D(...arguments)}catch(N){nt("WebGLState:",N)}}function C(){try{n.compressedTexImage3D(...arguments)}catch(N){nt("WebGLState:",N)}}function x(){try{n.texSubImage2D(...arguments)}catch(N){nt("WebGLState:",N)}}function k(){try{n.texSubImage3D(...arguments)}catch(N){nt("WebGLState:",N)}}function H(){try{n.compressedTexSubImage2D(...arguments)}catch(N){nt("WebGLState:",N)}}function $(){try{n.compressedTexSubImage3D(...arguments)}catch(N){nt("WebGLState:",N)}}function ce(){try{n.texStorage2D(...arguments)}catch(N){nt("WebGLState:",N)}}function fe(){try{n.texStorage3D(...arguments)}catch(N){nt("WebGLState:",N)}}function K(){try{n.texImage2D(...arguments)}catch(N){nt("WebGLState:",N)}}function G(){try{n.texImage3D(...arguments)}catch(N){nt("WebGLState:",N)}}function j(N){return d[N]!==void 0?d[N]:n.getParameter(N)}function le(N,he){d[N]!==he&&(n.pixelStorei(N,he),d[N]=he)}function oe(N){$e.equals(N)===!1&&(n.scissor(N.x,N.y,N.z,N.w),$e.copy(N))}function re(N){Ge.equals(N)===!1&&(n.viewport(N.x,N.y,N.z,N.w),Ge.copy(N))}function Ee(N,he){let Q=l.get(he);Q===void 0&&(Q=new WeakMap,l.set(he,Q));let pe=Q.get(N);pe===void 0&&(pe=n.getUniformBlockIndex(he,N.name),Q.set(N,pe))}function Pe(N,he){const pe=l.get(he).get(N);c.get(he)!==pe&&(n.uniformBlockBinding(he,pe,N.__bindingPointIndex),c.set(he,pe))}function Fe(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),u={},d={},ne=null,se={},f={},m=new WeakMap,_=[],S=null,p=!1,h=null,y=null,A=null,M=null,b=null,E=null,P=null,g=new Ye(0,0,0),v=0,w=!1,R=null,I=null,D=null,F=null,L=null,$e.set(0,0,n.canvas.width,n.canvas.height),Ge.set(0,0,n.canvas.width,n.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:ae,disable:Ne,bindFramebuffer:Be,drawBuffers:De,useProgram:mt,setBlending:et,setMaterial:Ke,setFlipSided:ie,setCullFace:ue,setLineWidth:ve,setPolygonOffset:be,setScissorTest:Me,activeTexture:Le,bindTexture:U,unbindTexture:je,compressedTexImage2D:He,compressedTexImage3D:C,texImage2D:K,texImage3D:G,pixelStorei:le,getParameter:j,updateUBOMapping:Ee,uniformBlockBinding:Pe,texStorage2D:ce,texStorage3D:fe,texSubImage2D:x,texSubImage3D:k,compressedTexSubImage2D:H,compressedTexSubImage3D:$,scissor:oe,viewport:re,reset:Fe}}function c_(n,e,t,i,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Qe,u=new WeakMap,d=new Set;let f;const m=new WeakMap;let _=!1;try{_=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function S(C,x){return _?new OffscreenCanvas(C,x):Ms("canvas")}function p(C,x,k){let H=1;const $=He(C);if(($.width>k||$.height>k)&&(H=k/Math.max($.width,$.height)),H<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const ce=Math.floor(H*$.width),fe=Math.floor(H*$.height);f===void 0&&(f=S(ce,fe));const K=x?S(ce,fe):f;return K.width=ce,K.height=fe,K.getContext("2d").drawImage(C,0,0,ce,fe),Oe("WebGLRenderer: Texture has been resized from ("+$.width+"x"+$.height+") to ("+ce+"x"+fe+")."),K}else return"data"in C&&Oe("WebGLRenderer: Image in DataTexture is too big ("+$.width+"x"+$.height+")."),C;return C}function h(C){return C.generateMipmaps}function y(C){n.generateMipmap(C)}function A(C){return C.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?n.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function M(C,x,k,H,$,ce=!1){if(C!==null){if(n[C]!==void 0)return n[C];Oe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let fe;H&&(fe=e.get("EXT_texture_norm16"),fe||Oe("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let K=x;if(x===n.RED&&(k===n.FLOAT&&(K=n.R32F),k===n.HALF_FLOAT&&(K=n.R16F),k===n.UNSIGNED_BYTE&&(K=n.R8),k===n.UNSIGNED_SHORT&&fe&&(K=fe.R16_EXT),k===n.SHORT&&fe&&(K=fe.R16_SNORM_EXT)),x===n.RED_INTEGER&&(k===n.UNSIGNED_BYTE&&(K=n.R8UI),k===n.UNSIGNED_SHORT&&(K=n.R16UI),k===n.UNSIGNED_INT&&(K=n.R32UI),k===n.BYTE&&(K=n.R8I),k===n.SHORT&&(K=n.R16I),k===n.INT&&(K=n.R32I)),x===n.RG&&(k===n.FLOAT&&(K=n.RG32F),k===n.HALF_FLOAT&&(K=n.RG16F),k===n.UNSIGNED_BYTE&&(K=n.RG8),k===n.UNSIGNED_SHORT&&fe&&(K=fe.RG16_EXT),k===n.SHORT&&fe&&(K=fe.RG16_SNORM_EXT)),x===n.RG_INTEGER&&(k===n.UNSIGNED_BYTE&&(K=n.RG8UI),k===n.UNSIGNED_SHORT&&(K=n.RG16UI),k===n.UNSIGNED_INT&&(K=n.RG32UI),k===n.BYTE&&(K=n.RG8I),k===n.SHORT&&(K=n.RG16I),k===n.INT&&(K=n.RG32I)),x===n.RGB_INTEGER&&(k===n.UNSIGNED_BYTE&&(K=n.RGB8UI),k===n.UNSIGNED_SHORT&&(K=n.RGB16UI),k===n.UNSIGNED_INT&&(K=n.RGB32UI),k===n.BYTE&&(K=n.RGB8I),k===n.SHORT&&(K=n.RGB16I),k===n.INT&&(K=n.RGB32I)),x===n.RGBA_INTEGER&&(k===n.UNSIGNED_BYTE&&(K=n.RGBA8UI),k===n.UNSIGNED_SHORT&&(K=n.RGBA16UI),k===n.UNSIGNED_INT&&(K=n.RGBA32UI),k===n.BYTE&&(K=n.RGBA8I),k===n.SHORT&&(K=n.RGBA16I),k===n.INT&&(K=n.RGBA32I)),x===n.RGB&&(k===n.UNSIGNED_SHORT&&fe&&(K=fe.RGB16_EXT),k===n.SHORT&&fe&&(K=fe.RGB16_SNORM_EXT),k===n.UNSIGNED_INT_5_9_9_9_REV&&(K=n.RGB9_E5),k===n.UNSIGNED_INT_10F_11F_11F_REV&&(K=n.R11F_G11F_B10F)),x===n.RGBA){const G=ce?vs:Ze.getTransfer($);k===n.FLOAT&&(K=n.RGBA32F),k===n.HALF_FLOAT&&(K=n.RGBA16F),k===n.UNSIGNED_BYTE&&(K=G===rt?n.SRGB8_ALPHA8:n.RGBA8),k===n.UNSIGNED_SHORT&&fe&&(K=fe.RGBA16_EXT),k===n.SHORT&&fe&&(K=fe.RGBA16_SNORM_EXT),k===n.UNSIGNED_SHORT_4_4_4_4&&(K=n.RGBA4),k===n.UNSIGNED_SHORT_5_5_5_1&&(K=n.RGB5_A1)}return(K===n.R16F||K===n.R32F||K===n.RG16F||K===n.RG32F||K===n.RGBA16F||K===n.RGBA32F)&&e.get("EXT_color_buffer_float"),K}function b(C,x){let k;return C?x===null||x===Rn||x===br?k=n.DEPTH24_STENCIL8:x===dn?k=n.DEPTH32F_STENCIL8:x===Er&&(k=n.DEPTH24_STENCIL8,Oe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===Rn||x===br?k=n.DEPTH_COMPONENT24:x===dn?k=n.DEPTH_COMPONENT32F:x===Er&&(k=n.DEPTH_COMPONENT16),k}function E(C,x){return h(C)===!0||C.isFramebufferTexture&&C.minFilter!==Lt&&C.minFilter!==Bt?Math.log2(Math.max(x.width,x.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?x.mipmaps.length:1}function P(C){const x=C.target;x.removeEventListener("dispose",P),v(x),x.isVideoTexture&&u.delete(x),x.isHTMLTexture&&d.delete(x)}function g(C){const x=C.target;x.removeEventListener("dispose",g),R(x)}function v(C){const x=i.get(C);if(x.__webglInit===void 0)return;const k=C.source,H=m.get(k);if(H){const $=H[x.__cacheKey];$.usedTimes--,$.usedTimes===0&&w(C),Object.keys(H).length===0&&m.delete(k)}i.remove(C)}function w(C){const x=i.get(C);n.deleteTexture(x.__webglTexture);const k=C.source,H=m.get(k);delete H[x.__cacheKey],a.memory.textures--}function R(C){const x=i.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),i.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let H=0;H<6;H++){if(Array.isArray(x.__webglFramebuffer[H]))for(let $=0;$<x.__webglFramebuffer[H].length;$++)n.deleteFramebuffer(x.__webglFramebuffer[H][$]);else n.deleteFramebuffer(x.__webglFramebuffer[H]);x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer[H])}else{if(Array.isArray(x.__webglFramebuffer))for(let H=0;H<x.__webglFramebuffer.length;H++)n.deleteFramebuffer(x.__webglFramebuffer[H]);else n.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&n.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let H=0;H<x.__webglColorRenderbuffer.length;H++)x.__webglColorRenderbuffer[H]&&n.deleteRenderbuffer(x.__webglColorRenderbuffer[H]);x.__webglDepthRenderbuffer&&n.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const k=C.textures;for(let H=0,$=k.length;H<$;H++){const ce=i.get(k[H]);ce.__webglTexture&&(n.deleteTexture(ce.__webglTexture),a.memory.textures--),i.remove(k[H])}i.remove(C)}let I=0;function D(){I=0}function F(){return I}function L(C){I=C}function q(){const C=I;return C>=r.maxTextures&&Oe("WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+r.maxTextures),I+=1,C}function B(C){const x=[];return x.push(C.wrapS),x.push(C.wrapT),x.push(C.wrapR||0),x.push(C.magFilter),x.push(C.minFilter),x.push(C.anisotropy),x.push(C.internalFormat),x.push(C.format),x.push(C.type),x.push(C.generateMipmaps),x.push(C.premultiplyAlpha),x.push(C.flipY),x.push(C.unpackAlignment),x.push(C.colorSpace),x.join()}function z(C,x){const k=i.get(C);if(C.isVideoTexture&&U(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&k.__version!==C.version){const H=C.image;if(H===null)Oe("WebGLRenderer: Texture marked for update but no image data found.");else if(H.complete===!1)Oe("WebGLRenderer: Texture marked for update but image is incomplete");else{Ne(k,C,x);return}}else C.isExternalTexture&&(k.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,k.__webglTexture,n.TEXTURE0+x)}function J(C,x){const k=i.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&k.__version!==C.version){Ne(k,C,x);return}else C.isExternalTexture&&(k.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,k.__webglTexture,n.TEXTURE0+x)}function ne(C,x){const k=i.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&k.__version!==C.version){Ne(k,C,x);return}t.bindTexture(n.TEXTURE_3D,k.__webglTexture,n.TEXTURE0+x)}function se(C,x){const k=i.get(C);if(C.isCubeDepthTexture!==!0&&C.version>0&&k.__version!==C.version){Be(k,C,x);return}t.bindTexture(n.TEXTURE_CUBE_MAP,k.__webglTexture,n.TEXTURE0+x)}const de={[yr]:n.REPEAT,[On]:n.CLAMP_TO_EDGE,[Ua]:n.MIRRORED_REPEAT},Ue={[Lt]:n.NEAREST,[Td]:n.NEAREST_MIPMAP_NEAREST,[Nr]:n.NEAREST_MIPMAP_LINEAR,[Bt]:n.LINEAR,[Gs]:n.LINEAR_MIPMAP_NEAREST,[pi]:n.LINEAR_MIPMAP_LINEAR},$e={[Cd]:n.NEVER,[Ld]:n.ALWAYS,[wd]:n.LESS,[Po]:n.LEQUAL,[Pd]:n.EQUAL,[Io]:n.GEQUAL,[Id]:n.GREATER,[Dd]:n.NOTEQUAL};function Ge(C,x){if(x.type===dn&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===Bt||x.magFilter===Gs||x.magFilter===Nr||x.magFilter===pi||x.minFilter===Bt||x.minFilter===Gs||x.minFilter===Nr||x.minFilter===pi)&&Oe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(C,n.TEXTURE_WRAP_S,de[x.wrapS]),n.texParameteri(C,n.TEXTURE_WRAP_T,de[x.wrapT]),(C===n.TEXTURE_3D||C===n.TEXTURE_2D_ARRAY)&&n.texParameteri(C,n.TEXTURE_WRAP_R,de[x.wrapR]),n.texParameteri(C,n.TEXTURE_MAG_FILTER,Ue[x.magFilter]),n.texParameteri(C,n.TEXTURE_MIN_FILTER,Ue[x.minFilter]),x.compareFunction&&(n.texParameteri(C,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(C,n.TEXTURE_COMPARE_FUNC,$e[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Lt||x.minFilter!==Nr&&x.minFilter!==pi||x.type===dn&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||i.get(x).__currentAnisotropy){const k=e.get("EXT_texture_filter_anisotropic");n.texParameterf(C,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,r.getMaxAnisotropy())),i.get(x).__currentAnisotropy=x.anisotropy}}}function Z(C,x){let k=!1;C.__webglInit===void 0&&(C.__webglInit=!0,x.addEventListener("dispose",P));const H=x.source;let $=m.get(H);$===void 0&&($={},m.set(H,$));const ce=B(x);if(ce!==C.__cacheKey){$[ce]===void 0&&($[ce]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,k=!0),$[ce].usedTimes++;const fe=$[C.__cacheKey];fe!==void 0&&($[C.__cacheKey].usedTimes--,fe.usedTimes===0&&w(x)),C.__cacheKey=ce,C.__webglTexture=$[ce].texture}return k}function ee(C,x,k){return Math.floor(Math.floor(C/k)/x)}function ae(C,x,k,H){const ce=C.updateRanges;if(ce.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,x.width,x.height,k,H,x.data);else{ce.sort((le,oe)=>le.start-oe.start);let fe=0;for(let le=1;le<ce.length;le++){const oe=ce[fe],re=ce[le],Ee=oe.start+oe.count,Pe=ee(re.start,x.width,4),Fe=ee(oe.start,x.width,4);re.start<=Ee+1&&Pe===Fe&&ee(re.start+re.count-1,x.width,4)===Pe?oe.count=Math.max(oe.count,re.start+re.count-oe.start):(++fe,ce[fe]=re)}ce.length=fe+1;const K=t.getParameter(n.UNPACK_ROW_LENGTH),G=t.getParameter(n.UNPACK_SKIP_PIXELS),j=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,x.width);for(let le=0,oe=ce.length;le<oe;le++){const re=ce[le],Ee=Math.floor(re.start/4),Pe=Math.ceil(re.count/4),Fe=Ee%x.width,N=Math.floor(Ee/x.width),he=Pe,Q=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,Fe),t.pixelStorei(n.UNPACK_SKIP_ROWS,N),t.texSubImage2D(n.TEXTURE_2D,0,Fe,N,he,Q,k,H,x.data)}C.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,K),t.pixelStorei(n.UNPACK_SKIP_PIXELS,G),t.pixelStorei(n.UNPACK_SKIP_ROWS,j)}}function Ne(C,x,k){let H=n.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(H=n.TEXTURE_2D_ARRAY),x.isData3DTexture&&(H=n.TEXTURE_3D);const $=Z(C,x),ce=x.source;t.bindTexture(H,C.__webglTexture,n.TEXTURE0+k);const fe=i.get(ce);if(ce.version!==fe.__version||$===!0){if(t.activeTexture(n.TEXTURE0+k),(typeof ImageBitmap<"u"&&x.image instanceof ImageBitmap)===!1){const Q=Ze.getPrimaries(Ze.workingColorSpace),pe=x.colorSpace===ti?null:Ze.getPrimaries(x.colorSpace),xe=x.colorSpace===ti||Q===pe?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,xe)}t.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment);let G=p(x.image,!1,r.maxTextureSize);G=je(x,G);const j=s.convert(x.format,x.colorSpace),le=s.convert(x.type);let oe=M(x.internalFormat,j,le,x.normalized,x.colorSpace,x.isVideoTexture);Ge(H,x);let re;const Ee=x.mipmaps,Pe=x.isVideoTexture!==!0,Fe=fe.__version===void 0||$===!0,N=ce.dataReady,he=E(x,G);if(x.isDepthTexture)oe=b(x.format===mi,x.type),Fe&&(Pe?t.texStorage2D(n.TEXTURE_2D,1,oe,G.width,G.height):t.texImage2D(n.TEXTURE_2D,0,oe,G.width,G.height,0,j,le,null));else if(x.isDataTexture)if(Ee.length>0){Pe&&Fe&&t.texStorage2D(n.TEXTURE_2D,he,oe,Ee[0].width,Ee[0].height);for(let Q=0,pe=Ee.length;Q<pe;Q++)re=Ee[Q],Pe?N&&t.texSubImage2D(n.TEXTURE_2D,Q,0,0,re.width,re.height,j,le,re.data):t.texImage2D(n.TEXTURE_2D,Q,oe,re.width,re.height,0,j,le,re.data);x.generateMipmaps=!1}else Pe?(Fe&&t.texStorage2D(n.TEXTURE_2D,he,oe,G.width,G.height),N&&ae(x,G,j,le)):t.texImage2D(n.TEXTURE_2D,0,oe,G.width,G.height,0,j,le,G.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){Pe&&Fe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,he,oe,Ee[0].width,Ee[0].height,G.depth);for(let Q=0,pe=Ee.length;Q<pe;Q++)if(re=Ee[Q],x.format!==hn)if(j!==null)if(Pe){if(N)if(x.layerUpdates.size>0){const xe=Wc(re.width,re.height,x.format,x.type);for(const te of x.layerUpdates){const Ce=re.data.subarray(te*xe/re.data.BYTES_PER_ELEMENT,(te+1)*xe/re.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,te,re.width,re.height,1,j,Ce)}x.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,0,re.width,re.height,G.depth,j,re.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,Q,oe,re.width,re.height,G.depth,0,re.data,0,0);else Oe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Pe?N&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,0,re.width,re.height,G.depth,j,le,re.data):t.texImage3D(n.TEXTURE_2D_ARRAY,Q,oe,re.width,re.height,G.depth,0,j,le,re.data)}else{Pe&&Fe&&t.texStorage2D(n.TEXTURE_2D,he,oe,Ee[0].width,Ee[0].height);for(let Q=0,pe=Ee.length;Q<pe;Q++)re=Ee[Q],x.format!==hn?j!==null?Pe?N&&t.compressedTexSubImage2D(n.TEXTURE_2D,Q,0,0,re.width,re.height,j,re.data):t.compressedTexImage2D(n.TEXTURE_2D,Q,oe,re.width,re.height,0,re.data):Oe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Pe?N&&t.texSubImage2D(n.TEXTURE_2D,Q,0,0,re.width,re.height,j,le,re.data):t.texImage2D(n.TEXTURE_2D,Q,oe,re.width,re.height,0,j,le,re.data)}else if(x.isDataArrayTexture)if(Pe){if(Fe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,he,oe,G.width,G.height,G.depth),N)if(x.layerUpdates.size>0){const Q=Wc(G.width,G.height,x.format,x.type);for(const pe of x.layerUpdates){const xe=G.data.subarray(pe*Q/G.data.BYTES_PER_ELEMENT,(pe+1)*Q/G.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,pe,G.width,G.height,1,j,le,xe)}x.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,G.width,G.height,G.depth,j,le,G.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,oe,G.width,G.height,G.depth,0,j,le,G.data);else if(x.isData3DTexture)Pe?(Fe&&t.texStorage3D(n.TEXTURE_3D,he,oe,G.width,G.height,G.depth),N&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,G.width,G.height,G.depth,j,le,G.data)):t.texImage3D(n.TEXTURE_3D,0,oe,G.width,G.height,G.depth,0,j,le,G.data);else if(x.isFramebufferTexture){if(Fe)if(Pe)t.texStorage2D(n.TEXTURE_2D,he,oe,G.width,G.height);else{let Q=G.width,pe=G.height;for(let xe=0;xe<he;xe++)t.texImage2D(n.TEXTURE_2D,xe,oe,Q,pe,0,j,le,null),Q>>=1,pe>>=1}}else if(x.isHTMLTexture){if("texElementImage2D"in n){const Q=n.canvas;if(Q.hasAttribute("layoutsubtree")||Q.setAttribute("layoutsubtree","true"),G.parentNode!==Q){Q.appendChild(G),d.add(x),Q.onpaint=pe=>{const xe=pe.changedElements;for(const te of d)xe.includes(te.image)&&(te.needsUpdate=!0)},Q.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,G);else{const xe=n.RGBA,te=n.RGBA,Ce=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,xe,te,Ce,G)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(Ee.length>0){if(Pe&&Fe){const Q=He(Ee[0]);t.texStorage2D(n.TEXTURE_2D,he,oe,Q.width,Q.height)}for(let Q=0,pe=Ee.length;Q<pe;Q++)re=Ee[Q],Pe?N&&t.texSubImage2D(n.TEXTURE_2D,Q,0,0,j,le,re):t.texImage2D(n.TEXTURE_2D,Q,oe,j,le,re);x.generateMipmaps=!1}else if(Pe){if(Fe){const Q=He(G);t.texStorage2D(n.TEXTURE_2D,he,oe,Q.width,Q.height)}N&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,j,le,G)}else t.texImage2D(n.TEXTURE_2D,0,oe,j,le,G);h(x)&&y(H),fe.__version=ce.version,x.onUpdate&&x.onUpdate(x)}C.__version=x.version}function Be(C,x,k){if(x.image.length!==6)return;const H=Z(C,x),$=x.source;t.bindTexture(n.TEXTURE_CUBE_MAP,C.__webglTexture,n.TEXTURE0+k);const ce=i.get($);if($.version!==ce.__version||H===!0){t.activeTexture(n.TEXTURE0+k);const fe=Ze.getPrimaries(Ze.workingColorSpace),K=x.colorSpace===ti?null:Ze.getPrimaries(x.colorSpace),G=x.colorSpace===ti||fe===K?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,G);const j=x.isCompressedTexture||x.image[0].isCompressedTexture,le=x.image[0]&&x.image[0].isDataTexture,oe=[];for(let te=0;te<6;te++)!j&&!le?oe[te]=p(x.image[te],!0,r.maxCubemapSize):oe[te]=le?x.image[te].image:x.image[te],oe[te]=je(x,oe[te]);const re=oe[0],Ee=s.convert(x.format,x.colorSpace),Pe=s.convert(x.type),Fe=M(x.internalFormat,Ee,Pe,x.normalized,x.colorSpace),N=x.isVideoTexture!==!0,he=ce.__version===void 0||H===!0,Q=$.dataReady;let pe=E(x,re);Ge(n.TEXTURE_CUBE_MAP,x);let xe;if(j){N&&he&&t.texStorage2D(n.TEXTURE_CUBE_MAP,pe,Fe,re.width,re.height);for(let te=0;te<6;te++){xe=oe[te].mipmaps;for(let Ce=0;Ce<xe.length;Ce++){const Te=xe[Ce];x.format!==hn?Ee!==null?N?Q&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ce,0,0,Te.width,Te.height,Ee,Te.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ce,Fe,Te.width,Te.height,0,Te.data):Oe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):N?Q&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ce,0,0,Te.width,Te.height,Ee,Pe,Te.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ce,Fe,Te.width,Te.height,0,Ee,Pe,Te.data)}}}else{if(xe=x.mipmaps,N&&he){xe.length>0&&pe++;const te=He(oe[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,pe,Fe,te.width,te.height)}for(let te=0;te<6;te++)if(le){N?Q&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,oe[te].width,oe[te].height,Ee,Pe,oe[te].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,Fe,oe[te].width,oe[te].height,0,Ee,Pe,oe[te].data);for(let Ce=0;Ce<xe.length;Ce++){const xt=xe[Ce].image[te].image;N?Q&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ce+1,0,0,xt.width,xt.height,Ee,Pe,xt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ce+1,Fe,xt.width,xt.height,0,Ee,Pe,xt.data)}}else{N?Q&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,Ee,Pe,oe[te]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,Fe,Ee,Pe,oe[te]);for(let Ce=0;Ce<xe.length;Ce++){const Te=xe[Ce];N?Q&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ce+1,0,0,Ee,Pe,Te.image[te]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ce+1,Fe,Ee,Pe,Te.image[te])}}}h(x)&&y(n.TEXTURE_CUBE_MAP),ce.__version=$.version,x.onUpdate&&x.onUpdate(x)}C.__version=x.version}function De(C,x,k,H,$,ce){const fe=s.convert(k.format,k.colorSpace),K=s.convert(k.type),G=M(k.internalFormat,fe,K,k.normalized,k.colorSpace),j=i.get(x),le=i.get(k);if(le.__renderTarget=x,!j.__hasExternalTextures){const oe=Math.max(1,x.width>>ce),re=Math.max(1,x.height>>ce);$===n.TEXTURE_3D||$===n.TEXTURE_2D_ARRAY?t.texImage3D($,ce,G,oe,re,x.depth,0,fe,K,null):t.texImage2D($,ce,G,oe,re,0,fe,K,null)}t.bindFramebuffer(n.FRAMEBUFFER,C),Le(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,H,$,le.__webglTexture,0,Me(x)):($===n.TEXTURE_2D||$>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&$<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,H,$,le.__webglTexture,ce),t.bindFramebuffer(n.FRAMEBUFFER,null)}function mt(C,x,k){if(n.bindRenderbuffer(n.RENDERBUFFER,C),x.depthBuffer){const H=x.depthTexture,$=H&&H.isDepthTexture?H.type:null,ce=b(x.stencilBuffer,$),fe=x.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;Le(x)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Me(x),ce,x.width,x.height):k?n.renderbufferStorageMultisample(n.RENDERBUFFER,Me(x),ce,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,ce,x.width,x.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,fe,n.RENDERBUFFER,C)}else{const H=x.textures;for(let $=0;$<H.length;$++){const ce=H[$],fe=s.convert(ce.format,ce.colorSpace),K=s.convert(ce.type),G=M(ce.internalFormat,fe,K,ce.normalized,ce.colorSpace);Le(x)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Me(x),G,x.width,x.height):k?n.renderbufferStorageMultisample(n.RENDERBUFFER,Me(x),G,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,G,x.width,x.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function We(C,x,k){const H=x.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,C),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const $=i.get(x.depthTexture);if($.__renderTarget=x,(!$.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),H){if($.__webglInit===void 0&&($.__webglInit=!0,x.depthTexture.addEventListener("dispose",P)),$.__webglTexture===void 0){$.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,$.__webglTexture),Ge(n.TEXTURE_CUBE_MAP,x.depthTexture);const j=s.convert(x.depthTexture.format),le=s.convert(x.depthTexture.type);let oe;x.depthTexture.format===Hn?oe=n.DEPTH_COMPONENT24:x.depthTexture.format===mi&&(oe=n.DEPTH24_STENCIL8);for(let re=0;re<6;re++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,oe,x.width,x.height,0,j,le,null)}}else z(x.depthTexture,0);const ce=$.__webglTexture,fe=Me(x),K=H?n.TEXTURE_CUBE_MAP_POSITIVE_X+k:n.TEXTURE_2D,G=x.depthTexture.format===mi?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(x.depthTexture.format===Hn)Le(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,G,K,ce,0,fe):n.framebufferTexture2D(n.FRAMEBUFFER,G,K,ce,0);else if(x.depthTexture.format===mi)Le(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,G,K,ce,0,fe):n.framebufferTexture2D(n.FRAMEBUFFER,G,K,ce,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function it(C){const x=i.get(C),k=C.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==C.depthTexture){const H=C.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),H){const $=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,H.removeEventListener("dispose",$)};H.addEventListener("dispose",$),x.__depthDisposeCallback=$}x.__boundDepthTexture=H}if(C.depthTexture&&!x.__autoAllocateDepthBuffer)if(k)for(let H=0;H<6;H++)We(x.__webglFramebuffer[H],C,H);else{const H=C.texture.mipmaps;H&&H.length>0?We(x.__webglFramebuffer[0],C,0):We(x.__webglFramebuffer,C,0)}else if(k){x.__webglDepthbuffer=[];for(let H=0;H<6;H++)if(t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[H]),x.__webglDepthbuffer[H]===void 0)x.__webglDepthbuffer[H]=n.createRenderbuffer(),mt(x.__webglDepthbuffer[H],C,!1);else{const $=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ce=x.__webglDepthbuffer[H];n.bindRenderbuffer(n.RENDERBUFFER,ce),n.framebufferRenderbuffer(n.FRAMEBUFFER,$,n.RENDERBUFFER,ce)}}else{const H=C.texture.mipmaps;if(H&&H.length>0?t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=n.createRenderbuffer(),mt(x.__webglDepthbuffer,C,!1);else{const $=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ce=x.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ce),n.framebufferRenderbuffer(n.FRAMEBUFFER,$,n.RENDERBUFFER,ce)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function et(C,x,k){const H=i.get(C);x!==void 0&&De(H.__webglFramebuffer,C,C.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),k!==void 0&&it(C)}function Ke(C){const x=C.texture,k=i.get(C),H=i.get(x);C.addEventListener("dispose",g);const $=C.textures,ce=C.isWebGLCubeRenderTarget===!0,fe=$.length>1;if(fe||(H.__webglTexture===void 0&&(H.__webglTexture=n.createTexture()),H.__version=x.version,a.memory.textures++),ce){k.__webglFramebuffer=[];for(let K=0;K<6;K++)if(x.mipmaps&&x.mipmaps.length>0){k.__webglFramebuffer[K]=[];for(let G=0;G<x.mipmaps.length;G++)k.__webglFramebuffer[K][G]=n.createFramebuffer()}else k.__webglFramebuffer[K]=n.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){k.__webglFramebuffer=[];for(let K=0;K<x.mipmaps.length;K++)k.__webglFramebuffer[K]=n.createFramebuffer()}else k.__webglFramebuffer=n.createFramebuffer();if(fe)for(let K=0,G=$.length;K<G;K++){const j=i.get($[K]);j.__webglTexture===void 0&&(j.__webglTexture=n.createTexture(),a.memory.textures++)}if(C.samples>0&&Le(C)===!1){k.__webglMultisampledFramebuffer=n.createFramebuffer(),k.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let K=0;K<$.length;K++){const G=$[K];k.__webglColorRenderbuffer[K]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,k.__webglColorRenderbuffer[K]);const j=s.convert(G.format,G.colorSpace),le=s.convert(G.type),oe=M(G.internalFormat,j,le,G.normalized,G.colorSpace,C.isXRRenderTarget===!0),re=Me(C);n.renderbufferStorageMultisample(n.RENDERBUFFER,re,oe,C.width,C.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+K,n.RENDERBUFFER,k.__webglColorRenderbuffer[K])}n.bindRenderbuffer(n.RENDERBUFFER,null),C.depthBuffer&&(k.__webglDepthRenderbuffer=n.createRenderbuffer(),mt(k.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ce){t.bindTexture(n.TEXTURE_CUBE_MAP,H.__webglTexture),Ge(n.TEXTURE_CUBE_MAP,x);for(let K=0;K<6;K++)if(x.mipmaps&&x.mipmaps.length>0)for(let G=0;G<x.mipmaps.length;G++)De(k.__webglFramebuffer[K][G],C,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+K,G);else De(k.__webglFramebuffer[K],C,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+K,0);h(x)&&y(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(fe){for(let K=0,G=$.length;K<G;K++){const j=$[K],le=i.get(j);let oe=n.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(oe=C.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(oe,le.__webglTexture),Ge(oe,j),De(k.__webglFramebuffer,C,j,n.COLOR_ATTACHMENT0+K,oe,0),h(j)&&y(oe)}t.unbindTexture()}else{let K=n.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(K=C.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(K,H.__webglTexture),Ge(K,x),x.mipmaps&&x.mipmaps.length>0)for(let G=0;G<x.mipmaps.length;G++)De(k.__webglFramebuffer[G],C,x,n.COLOR_ATTACHMENT0,K,G);else De(k.__webglFramebuffer,C,x,n.COLOR_ATTACHMENT0,K,0);h(x)&&y(K),t.unbindTexture()}C.depthBuffer&&it(C)}function ie(C){const x=C.textures;for(let k=0,H=x.length;k<H;k++){const $=x[k];if(h($)){const ce=A(C),fe=i.get($).__webglTexture;t.bindTexture(ce,fe),y(ce),t.unbindTexture()}}}const ue=[],ve=[];function be(C){if(C.samples>0){if(Le(C)===!1){const x=C.textures,k=C.width,H=C.height;let $=n.COLOR_BUFFER_BIT;const ce=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,fe=i.get(C),K=x.length>1;if(K)for(let j=0;j<x.length;j++)t.bindFramebuffer(n.FRAMEBUFFER,fe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+j,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,fe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+j,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,fe.__webglMultisampledFramebuffer);const G=C.texture.mipmaps;G&&G.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,fe.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,fe.__webglFramebuffer);for(let j=0;j<x.length;j++){if(C.resolveDepthBuffer&&(C.depthBuffer&&($|=n.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&($|=n.STENCIL_BUFFER_BIT)),K){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,fe.__webglColorRenderbuffer[j]);const le=i.get(x[j]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,le,0)}n.blitFramebuffer(0,0,k,H,0,0,k,H,$,n.NEAREST),c===!0&&(ue.length=0,ve.length=0,ue.push(n.COLOR_ATTACHMENT0+j),C.depthBuffer&&C.resolveDepthBuffer===!1&&(ue.push(ce),ve.push(ce),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,ve)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,ue))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),K)for(let j=0;j<x.length;j++){t.bindFramebuffer(n.FRAMEBUFFER,fe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+j,n.RENDERBUFFER,fe.__webglColorRenderbuffer[j]);const le=i.get(x[j]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,fe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+j,n.TEXTURE_2D,le,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,fe.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&c){const x=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[x])}}}function Me(C){return Math.min(r.maxSamples,C.samples)}function Le(C){const x=i.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function U(C){const x=a.render.frame;u.get(C)!==x&&(u.set(C,x),C.update())}function je(C,x){const k=C.colorSpace,H=C.format,$=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||k!==xs&&k!==ti&&(Ze.getTransfer(k)===rt?(H!==hn||$!==Qt)&&Oe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):nt("WebGLTextures: Unsupported texture color space:",k)),x}function He(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(l.width=C.naturalWidth||C.width,l.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(l.width=C.displayWidth,l.height=C.displayHeight):(l.width=C.width,l.height=C.height),l}this.allocateTextureUnit=q,this.resetTextureUnits=D,this.getTextureUnits=F,this.setTextureUnits=L,this.setTexture2D=z,this.setTexture2DArray=J,this.setTexture3D=ne,this.setTextureCube=se,this.rebindTextures=et,this.setupRenderTarget=Ke,this.updateRenderTargetMipmap=ie,this.updateMultisampleRenderTarget=be,this.setupDepthRenderbuffer=it,this.setupFrameBufferTexture=De,this.useMultisampledRTT=Le,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function l_(n,e){function t(i,r=ti){let s;const a=Ze.getTransfer(r);if(i===Qt)return n.UNSIGNED_BYTE;if(i===bo)return n.UNSIGNED_SHORT_4_4_4_4;if(i===To)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Jl)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Ql)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Kl)return n.BYTE;if(i===Zl)return n.SHORT;if(i===Er)return n.UNSIGNED_SHORT;if(i===Eo)return n.INT;if(i===Rn)return n.UNSIGNED_INT;if(i===dn)return n.FLOAT;if(i===Vn)return n.HALF_FLOAT;if(i===jl)return n.ALPHA;if(i===eu)return n.RGB;if(i===hn)return n.RGBA;if(i===Hn)return n.DEPTH_COMPONENT;if(i===mi)return n.DEPTH_STENCIL;if(i===Ao)return n.RED;if(i===Ro)return n.RED_INTEGER;if(i===yi)return n.RG;if(i===Co)return n.RG_INTEGER;if(i===wo)return n.RGBA_INTEGER;if(i===ls||i===us||i===fs||i===ds)if(a===rt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===ls)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===us)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===fs)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===ds)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===ls)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===us)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===fs)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===ds)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Na||i===Fa||i===Oa||i===Ba)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Na)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Fa)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Oa)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Ba)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===ka||i===za||i===Ga||i===Va||i===Ha||i===gs||i===Wa)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===ka||i===za)return a===rt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Ga)return a===rt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(i===Va)return s.COMPRESSED_R11_EAC;if(i===Ha)return s.COMPRESSED_SIGNED_R11_EAC;if(i===gs)return s.COMPRESSED_RG11_EAC;if(i===Wa)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Xa||i===qa||i===Ya||i===$a||i===Ka||i===Za||i===Ja||i===Qa||i===ja||i===eo||i===to||i===no||i===io||i===ro)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Xa)return a===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===qa)return a===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Ya)return a===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===$a)return a===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ka)return a===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Za)return a===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Ja)return a===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Qa)return a===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===ja)return a===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===eo)return a===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===to)return a===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===no)return a===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===io)return a===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===ro)return a===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===so||i===ao||i===oo)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===so)return a===rt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===ao)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===oo)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===co||i===lo||i===_s||i===uo)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===co)return s.COMPRESSED_RED_RGTC1_EXT;if(i===lo)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===_s)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===uo)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===br?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const u_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,f_=`
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

}`;class d_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new uu(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Cn({vertexShader:u_,fragmentShader:f_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Mt(new Ps(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class h_ extends bi{constructor(e,t){super();const i=this;let r=null,s=1,a=null,o="local-floor",c=1,l=null,u=null,d=null,f=null,m=null,_=null;const S=typeof XRWebGLBinding<"u",p=new d_,h={},y=t.getContextAttributes();let A=null,M=null;const b=[],E=[],P=new Qe;let g=null;const v=new un;v.viewport=new _t;const w=new un;w.viewport=new _t;const R=[v,w],I=new Eh;let D=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let ee=b[Z];return ee===void 0&&(ee=new Ks,b[Z]=ee),ee.getTargetRaySpace()},this.getControllerGrip=function(Z){let ee=b[Z];return ee===void 0&&(ee=new Ks,b[Z]=ee),ee.getGripSpace()},this.getHand=function(Z){let ee=b[Z];return ee===void 0&&(ee=new Ks,b[Z]=ee),ee.getHandSpace()};function L(Z){const ee=E.indexOf(Z.inputSource);if(ee===-1)return;const ae=b[ee];ae!==void 0&&(ae.update(Z.inputSource,Z.frame,l||a),ae.dispatchEvent({type:Z.type,data:Z.inputSource}))}function q(){r.removeEventListener("select",L),r.removeEventListener("selectstart",L),r.removeEventListener("selectend",L),r.removeEventListener("squeeze",L),r.removeEventListener("squeezestart",L),r.removeEventListener("squeezeend",L),r.removeEventListener("end",q),r.removeEventListener("inputsourceschange",B);for(let Z=0;Z<b.length;Z++){const ee=E[Z];ee!==null&&(E[Z]=null,b[Z].disconnect(ee))}D=null,F=null,p.reset();for(const Z in h)delete h[Z];e.setRenderTarget(A),m=null,f=null,d=null,r=null,M=null,Ge.stop(),i.isPresenting=!1,e.setPixelRatio(g),e.setSize(P.width,P.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){s=Z,i.isPresenting===!0&&Oe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){o=Z,i.isPresenting===!0&&Oe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(Z){l=Z},this.getBaseLayer=function(){return f!==null?f:m},this.getBinding=function(){return d===null&&S&&(d=new XRWebGLBinding(r,t)),d},this.getFrame=function(){return _},this.getSession=function(){return r},this.setSession=async function(Z){if(r=Z,r!==null){if(A=e.getRenderTarget(),r.addEventListener("select",L),r.addEventListener("selectstart",L),r.addEventListener("selectend",L),r.addEventListener("squeeze",L),r.addEventListener("squeezestart",L),r.addEventListener("squeezeend",L),r.addEventListener("end",q),r.addEventListener("inputsourceschange",B),y.xrCompatible!==!0&&await t.makeXRCompatible(),g=e.getPixelRatio(),e.getSize(P),S&&"createProjectionLayer"in XRWebGLBinding.prototype){let ae=null,Ne=null,Be=null;y.depth&&(Be=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ae=y.stencil?mi:Hn,Ne=y.stencil?br:Rn);const De={colorFormat:t.RGBA8,depthFormat:Be,scaleFactor:s};d=this.getBinding(),f=d.createProjectionLayer(De),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),M=new An(f.textureWidth,f.textureHeight,{format:hn,type:Qt,depthTexture:new er(f.textureWidth,f.textureHeight,Ne,void 0,void 0,void 0,void 0,void 0,void 0,ae),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const ae={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:s};m=new XRWebGLLayer(r,t,ae),r.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),M=new An(m.framebufferWidth,m.framebufferHeight,{format:hn,type:Qt,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await r.requestReferenceSpace(o),Ge.setContext(r),Ge.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function B(Z){for(let ee=0;ee<Z.removed.length;ee++){const ae=Z.removed[ee],Ne=E.indexOf(ae);Ne>=0&&(E[Ne]=null,b[Ne].disconnect(ae))}for(let ee=0;ee<Z.added.length;ee++){const ae=Z.added[ee];let Ne=E.indexOf(ae);if(Ne===-1){for(let De=0;De<b.length;De++)if(De>=E.length){E.push(ae),Ne=De;break}else if(E[De]===null){E[De]=ae,Ne=De;break}if(Ne===-1)break}const Be=b[Ne];Be&&Be.connect(ae)}}const z=new V,J=new V;function ne(Z,ee,ae){z.setFromMatrixPosition(ee.matrixWorld),J.setFromMatrixPosition(ae.matrixWorld);const Ne=z.distanceTo(J),Be=ee.projectionMatrix.elements,De=ae.projectionMatrix.elements,mt=Be[14]/(Be[10]-1),We=Be[14]/(Be[10]+1),it=(Be[9]+1)/Be[5],et=(Be[9]-1)/Be[5],Ke=(Be[8]-1)/Be[0],ie=(De[8]+1)/De[0],ue=mt*Ke,ve=mt*ie,be=Ne/(-Ke+ie),Me=be*-Ke;if(ee.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(Me),Z.translateZ(be),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),Be[10]===-1)Z.projectionMatrix.copy(ee.projectionMatrix),Z.projectionMatrixInverse.copy(ee.projectionMatrixInverse);else{const Le=mt+be,U=We+be,je=ue-Me,He=ve+(Ne-Me),C=it*We/U*Le,x=et*We/U*Le;Z.projectionMatrix.makePerspective(je,He,C,x,Le,U),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function se(Z,ee){ee===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(ee.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(r===null)return;let ee=Z.near,ae=Z.far;p.texture!==null&&(p.depthNear>0&&(ee=p.depthNear),p.depthFar>0&&(ae=p.depthFar)),I.near=w.near=v.near=ee,I.far=w.far=v.far=ae,(D!==I.near||F!==I.far)&&(r.updateRenderState({depthNear:I.near,depthFar:I.far}),D=I.near,F=I.far),I.layers.mask=Z.layers.mask|6,v.layers.mask=I.layers.mask&-5,w.layers.mask=I.layers.mask&-3;const Ne=Z.parent,Be=I.cameras;se(I,Ne);for(let De=0;De<Be.length;De++)se(Be[De],Ne);Be.length===2?ne(I,v,w):I.projectionMatrix.copy(v.projectionMatrix),de(Z,I,Ne)};function de(Z,ee,ae){ae===null?Z.matrix.copy(ee.matrixWorld):(Z.matrix.copy(ae.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(ee.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(ee.projectionMatrix),Z.projectionMatrixInverse.copy(ee.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=ho*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return I},this.getFoveation=function(){if(!(f===null&&m===null))return c},this.setFoveation=function(Z){c=Z,f!==null&&(f.fixedFoveation=Z),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=Z)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(I)},this.getCameraTexture=function(Z){return h[Z]};let Ue=null;function $e(Z,ee){if(u=ee.getViewerPose(l||a),_=ee,u!==null){const ae=u.views;m!==null&&(e.setRenderTargetFramebuffer(M,m.framebuffer),e.setRenderTarget(M));let Ne=!1;ae.length!==I.cameras.length&&(I.cameras.length=0,Ne=!0);for(let We=0;We<ae.length;We++){const it=ae[We];let et=null;if(m!==null)et=m.getViewport(it);else{const ie=d.getViewSubImage(f,it);et=ie.viewport,We===0&&(e.setRenderTargetTextures(M,ie.colorTexture,ie.depthStencilTexture),e.setRenderTarget(M))}let Ke=R[We];Ke===void 0&&(Ke=new un,Ke.layers.enable(We),Ke.viewport=new _t,R[We]=Ke),Ke.matrix.fromArray(it.transform.matrix),Ke.matrix.decompose(Ke.position,Ke.quaternion,Ke.scale),Ke.projectionMatrix.fromArray(it.projectionMatrix),Ke.projectionMatrixInverse.copy(Ke.projectionMatrix).invert(),Ke.viewport.set(et.x,et.y,et.width,et.height),We===0&&(I.matrix.copy(Ke.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale)),Ne===!0&&I.cameras.push(Ke)}const Be=r.enabledFeatures;if(Be&&Be.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&S){d=i.getBinding();const We=d.getDepthInformation(ae[0]);We&&We.isValid&&We.texture&&p.init(We,r.renderState)}if(Be&&Be.includes("camera-access")&&S){e.state.unbindTexture(),d=i.getBinding();for(let We=0;We<ae.length;We++){const it=ae[We].camera;if(it){let et=h[it];et||(et=new uu,h[it]=et);const Ke=d.getCameraImage(it);et.sourceTexture=Ke}}}}for(let ae=0;ae<b.length;ae++){const Ne=E[ae],Be=b[ae];Ne!==null&&Be!==void 0&&Be.update(Ne,ee,l||a)}Ue&&Ue(Z,ee),ee.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ee}),_=null}const Ge=new hu;Ge.setAnimationLoop($e),this.setAnimationLoop=function(Z){Ue=Z},this.dispose=function(){}}}const p_=new pt,Mu=new ke;Mu.set(-1,0,0,0,1,0,0,0,1);function m_(n,e){function t(p,h){p.matrixAutoUpdate===!0&&p.updateMatrix(),h.value.copy(p.matrix)}function i(p,h){h.color.getRGB(p.fogColor.value,fu(n)),h.isFog?(p.fogNear.value=h.near,p.fogFar.value=h.far):h.isFogExp2&&(p.fogDensity.value=h.density)}function r(p,h,y,A,M){h.isNodeMaterial?h.uniformsNeedUpdate=!1:h.isMeshBasicMaterial?s(p,h):h.isMeshLambertMaterial?(s(p,h),h.envMap&&(p.envMapIntensity.value=h.envMapIntensity)):h.isMeshToonMaterial?(s(p,h),d(p,h)):h.isMeshPhongMaterial?(s(p,h),u(p,h),h.envMap&&(p.envMapIntensity.value=h.envMapIntensity)):h.isMeshStandardMaterial?(s(p,h),f(p,h),h.isMeshPhysicalMaterial&&m(p,h,M)):h.isMeshMatcapMaterial?(s(p,h),_(p,h)):h.isMeshDepthMaterial?s(p,h):h.isMeshDistanceMaterial?(s(p,h),S(p,h)):h.isMeshNormalMaterial?s(p,h):h.isLineBasicMaterial?(a(p,h),h.isLineDashedMaterial&&o(p,h)):h.isPointsMaterial?c(p,h,y,A):h.isSpriteMaterial?l(p,h):h.isShadowMaterial?(p.color.value.copy(h.color),p.opacity.value=h.opacity):h.isShaderMaterial&&(h.uniformsNeedUpdate=!1)}function s(p,h){p.opacity.value=h.opacity,h.color&&p.diffuse.value.copy(h.color),h.emissive&&p.emissive.value.copy(h.emissive).multiplyScalar(h.emissiveIntensity),h.map&&(p.map.value=h.map,t(h.map,p.mapTransform)),h.alphaMap&&(p.alphaMap.value=h.alphaMap,t(h.alphaMap,p.alphaMapTransform)),h.bumpMap&&(p.bumpMap.value=h.bumpMap,t(h.bumpMap,p.bumpMapTransform),p.bumpScale.value=h.bumpScale,h.side===Yt&&(p.bumpScale.value*=-1)),h.normalMap&&(p.normalMap.value=h.normalMap,t(h.normalMap,p.normalMapTransform),p.normalScale.value.copy(h.normalScale),h.side===Yt&&p.normalScale.value.negate()),h.displacementMap&&(p.displacementMap.value=h.displacementMap,t(h.displacementMap,p.displacementMapTransform),p.displacementScale.value=h.displacementScale,p.displacementBias.value=h.displacementBias),h.emissiveMap&&(p.emissiveMap.value=h.emissiveMap,t(h.emissiveMap,p.emissiveMapTransform)),h.specularMap&&(p.specularMap.value=h.specularMap,t(h.specularMap,p.specularMapTransform)),h.alphaTest>0&&(p.alphaTest.value=h.alphaTest);const y=e.get(h),A=y.envMap,M=y.envMapRotation;A&&(p.envMap.value=A,p.envMapRotation.value.setFromMatrix4(p_.makeRotationFromEuler(M)).transpose(),A.isCubeTexture&&A.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(Mu),p.reflectivity.value=h.reflectivity,p.ior.value=h.ior,p.refractionRatio.value=h.refractionRatio),h.lightMap&&(p.lightMap.value=h.lightMap,p.lightMapIntensity.value=h.lightMapIntensity,t(h.lightMap,p.lightMapTransform)),h.aoMap&&(p.aoMap.value=h.aoMap,p.aoMapIntensity.value=h.aoMapIntensity,t(h.aoMap,p.aoMapTransform))}function a(p,h){p.diffuse.value.copy(h.color),p.opacity.value=h.opacity,h.map&&(p.map.value=h.map,t(h.map,p.mapTransform))}function o(p,h){p.dashSize.value=h.dashSize,p.totalSize.value=h.dashSize+h.gapSize,p.scale.value=h.scale}function c(p,h,y,A){p.diffuse.value.copy(h.color),p.opacity.value=h.opacity,p.size.value=h.size*y,p.scale.value=A*.5,h.map&&(p.map.value=h.map,t(h.map,p.uvTransform)),h.alphaMap&&(p.alphaMap.value=h.alphaMap,t(h.alphaMap,p.alphaMapTransform)),h.alphaTest>0&&(p.alphaTest.value=h.alphaTest)}function l(p,h){p.diffuse.value.copy(h.color),p.opacity.value=h.opacity,p.rotation.value=h.rotation,h.map&&(p.map.value=h.map,t(h.map,p.mapTransform)),h.alphaMap&&(p.alphaMap.value=h.alphaMap,t(h.alphaMap,p.alphaMapTransform)),h.alphaTest>0&&(p.alphaTest.value=h.alphaTest)}function u(p,h){p.specular.value.copy(h.specular),p.shininess.value=Math.max(h.shininess,1e-4)}function d(p,h){h.gradientMap&&(p.gradientMap.value=h.gradientMap)}function f(p,h){p.metalness.value=h.metalness,h.metalnessMap&&(p.metalnessMap.value=h.metalnessMap,t(h.metalnessMap,p.metalnessMapTransform)),p.roughness.value=h.roughness,h.roughnessMap&&(p.roughnessMap.value=h.roughnessMap,t(h.roughnessMap,p.roughnessMapTransform)),h.envMap&&(p.envMapIntensity.value=h.envMapIntensity)}function m(p,h,y){p.ior.value=h.ior,h.sheen>0&&(p.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),p.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(p.sheenColorMap.value=h.sheenColorMap,t(h.sheenColorMap,p.sheenColorMapTransform)),h.sheenRoughnessMap&&(p.sheenRoughnessMap.value=h.sheenRoughnessMap,t(h.sheenRoughnessMap,p.sheenRoughnessMapTransform))),h.clearcoat>0&&(p.clearcoat.value=h.clearcoat,p.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(p.clearcoatMap.value=h.clearcoatMap,t(h.clearcoatMap,p.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,t(h.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(p.clearcoatNormalMap.value=h.clearcoatNormalMap,t(h.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===Yt&&p.clearcoatNormalScale.value.negate())),h.dispersion>0&&(p.dispersion.value=h.dispersion),h.iridescence>0&&(p.iridescence.value=h.iridescence,p.iridescenceIOR.value=h.iridescenceIOR,p.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(p.iridescenceMap.value=h.iridescenceMap,t(h.iridescenceMap,p.iridescenceMapTransform)),h.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=h.iridescenceThicknessMap,t(h.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),h.transmission>0&&(p.transmission.value=h.transmission,p.transmissionSamplerMap.value=y.texture,p.transmissionSamplerSize.value.set(y.width,y.height),h.transmissionMap&&(p.transmissionMap.value=h.transmissionMap,t(h.transmissionMap,p.transmissionMapTransform)),p.thickness.value=h.thickness,h.thicknessMap&&(p.thicknessMap.value=h.thicknessMap,t(h.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=h.attenuationDistance,p.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(p.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(p.anisotropyMap.value=h.anisotropyMap,t(h.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=h.specularIntensity,p.specularColor.value.copy(h.specularColor),h.specularColorMap&&(p.specularColorMap.value=h.specularColorMap,t(h.specularColorMap,p.specularColorMapTransform)),h.specularIntensityMap&&(p.specularIntensityMap.value=h.specularIntensityMap,t(h.specularIntensityMap,p.specularIntensityMapTransform))}function _(p,h){h.matcap&&(p.matcap.value=h.matcap)}function S(p,h){const y=e.get(h).light;p.referencePosition.value.setFromMatrixPosition(y.matrixWorld),p.nearDistance.value=y.shadow.camera.near,p.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function g_(n,e,t,i){let r={},s={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(M,b){const E=b.program;i.uniformBlockBinding(M,E)}function l(M,b){let E=r[M.id];E===void 0&&(p(M),E=u(M),r[M.id]=E,M.addEventListener("dispose",y));const P=b.program;i.updateUBOMapping(M,P);const g=e.render.frame;s[M.id]!==g&&(f(M),s[M.id]=g)}function u(M){const b=d();M.__bindingPointIndex=b;const E=n.createBuffer(),P=M.__size,g=M.usage;return n.bindBuffer(n.UNIFORM_BUFFER,E),n.bufferData(n.UNIFORM_BUFFER,P,g),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,b,E),E}function d(){for(let M=0;M<o;M++)if(a.indexOf(M)===-1)return a.push(M),M;return nt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(M){const b=r[M.id],E=M.uniforms,P=M.__cache;n.bindBuffer(n.UNIFORM_BUFFER,b);for(let g=0,v=E.length;g<v;g++){const w=E[g];if(Array.isArray(w))for(let R=0,I=w.length;R<I;R++)m(w[R],g,R,P);else m(w,g,0,P)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function m(M,b,E,P){if(S(M,b,E,P)===!0){const g=M.__offset,v=M.value;if(Array.isArray(v)){let w=0;for(let R=0;R<v.length;R++){const I=v[R],D=h(I);_(I,M.__data,w),typeof I!="number"&&typeof I!="boolean"&&!I.isMatrix3&&!ArrayBuffer.isView(I)&&(w+=D.storage/Float32Array.BYTES_PER_ELEMENT)}}else _(v,M.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,g,M.__data)}}function _(M,b,E){typeof M=="number"||typeof M=="boolean"?b[0]=M:M.isMatrix3?(b[0]=M.elements[0],b[1]=M.elements[1],b[2]=M.elements[2],b[3]=0,b[4]=M.elements[3],b[5]=M.elements[4],b[6]=M.elements[5],b[7]=0,b[8]=M.elements[6],b[9]=M.elements[7],b[10]=M.elements[8],b[11]=0):ArrayBuffer.isView(M)?b.set(new M.constructor(M.buffer,M.byteOffset,b.length)):M.toArray(b,E)}function S(M,b,E,P){const g=M.value,v=b+"_"+E;if(P[v]===void 0)return typeof g=="number"||typeof g=="boolean"?P[v]=g:ArrayBuffer.isView(g)?P[v]=g.slice():P[v]=g.clone(),!0;{const w=P[v];if(typeof g=="number"||typeof g=="boolean"){if(w!==g)return P[v]=g,!0}else{if(ArrayBuffer.isView(g))return!0;if(w.equals(g)===!1)return w.copy(g),!0}}return!1}function p(M){const b=M.uniforms;let E=0;const P=16;for(let v=0,w=b.length;v<w;v++){const R=Array.isArray(b[v])?b[v]:[b[v]];for(let I=0,D=R.length;I<D;I++){const F=R[I],L=Array.isArray(F.value)?F.value:[F.value];for(let q=0,B=L.length;q<B;q++){const z=L[q],J=h(z),ne=E%P,se=ne%J.boundary,de=ne+se;E+=se,de!==0&&P-de<J.storage&&(E+=P-de),F.__data=new Float32Array(J.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=E,E+=J.storage}}}const g=E%P;return g>0&&(E+=P-g),M.__size=E,M.__cache={},this}function h(M){const b={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(b.boundary=4,b.storage=4):M.isVector2?(b.boundary=8,b.storage=8):M.isVector3||M.isColor?(b.boundary=16,b.storage=12):M.isVector4?(b.boundary=16,b.storage=16):M.isMatrix3?(b.boundary=48,b.storage=48):M.isMatrix4?(b.boundary=64,b.storage=64):M.isTexture?Oe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(M)?(b.boundary=16,b.storage=M.byteLength):Oe("WebGLRenderer: Unsupported uniform value type.",M),b}function y(M){const b=M.target;b.removeEventListener("dispose",y);const E=a.indexOf(b.__bindingPointIndex);a.splice(E,1),n.deleteBuffer(r[b.id]),delete r[b.id],delete s[b.id]}function A(){for(const M in r)n.deleteBuffer(r[M]);a=[],r={},s={}}return{bind:c,update:l,dispose:A}}const __=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Mn=null;function x_(){return Mn===null&&(Mn=new cu(__,16,16,yi,Vn),Mn.name="DFG_LUT",Mn.minFilter=Bt,Mn.magFilter=Bt,Mn.wrapS=On,Mn.wrapT=On,Mn.generateMipmaps=!1,Mn.needsUpdate=!0),Mn}class v_{constructor(e={}){const{canvas:t=Nd(),context:i=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:f=!1,outputBufferType:m=Qt}=e;this.isWebGLRenderer=!0;let _;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");_=i.getContextAttributes().alpha}else _=a;const S=m,p=new Set([wo,Co,Ro]),h=new Set([Qt,Rn,Er,br,bo,To]),y=new Uint32Array(4),A=new Int32Array(4),M=new V;let b=null,E=null;const P=[],g=[];let v=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Tn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const w=this;let R=!1,I=null,D=null,F=null,L=null;this._outputColorSpace=Xt;let q=0,B=0,z=null,J=-1,ne=null;const se=new _t,de=new _t;let Ue=null;const $e=new Ye(0);let Ge=0,Z=t.width,ee=t.height,ae=1,Ne=null,Be=null;const De=new _t(0,0,Z,ee),mt=new _t(0,0,Z,ee);let We=!1;const it=new Uo;let et=!1,Ke=!1;const ie=new pt,ue=new V,ve=new _t,be={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Me=!1;function Le(){return z===null?ae:1}let U=i;function je(T,O){return t.getContext(T,O)}try{const T={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${So}`),t.addEventListener("webglcontextlost",xt,!1),t.addEventListener("webglcontextrestored",ut,!1),t.addEventListener("webglcontextcreationerror",gn,!1),U===null){const O="webgl2";if(U=je(O,T),U===null)throw je(O)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(T){throw nt("WebGLRenderer: "+T.message),T}let He,C,x,k,H,$,ce,fe,K,G,j,le,oe,re,Ee,Pe,Fe,N,he,Q,pe,xe,te;function Ce(){He=new x0(U),He.init(),pe=new l_(U,He),C=new u0(U,He,e,pe),x=new o_(U,He),C.reversedDepthBuffer&&f&&x.buffers.depth.setReversed(!0),D=U.createFramebuffer(),F=U.createFramebuffer(),L=U.createFramebuffer(),k=new S0(U),H=new Yg,$=new c_(U,He,x,H,C,pe,k),ce=new _0(w),fe=new Th(U),xe=new c0(U,fe),K=new v0(U,fe,k,xe),G=new E0(U,K,fe,xe,k),N=new y0(U,C,$),Ee=new f0(H),j=new qg(w,ce,He,C,xe,Ee),le=new m_(w,H),oe=new Kg,re=new t_(He),Fe=new o0(w,ce,x,G,_,c),Pe=new a_(w,G,C),te=new g_(U,k,C,x),he=new l0(U,He,k),Q=new M0(U,He,k),k.programs=j.programs,w.capabilities=C,w.extensions=He,w.properties=H,w.renderLists=oe,w.shadowMap=Pe,w.state=x,w.info=k}Ce(),S!==Qt&&(v=new T0(S,t.width,t.height,o,r,s));const Te=new h_(w,U);this.xr=Te,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const T=He.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=He.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return ae},this.setPixelRatio=function(T){T!==void 0&&(ae=T,this.setSize(Z,ee,!1))},this.getSize=function(T){return T.set(Z,ee)},this.setSize=function(T,O,Y=!0){if(Te.isPresenting){Oe("WebGLRenderer: Can't change size while VR device is presenting.");return}Z=T,ee=O,t.width=Math.floor(T*ae),t.height=Math.floor(O*ae),Y===!0&&(t.style.width=T+"px",t.style.height=O+"px"),v!==null&&v.setSize(t.width,t.height),this.setViewport(0,0,T,O)},this.getDrawingBufferSize=function(T){return T.set(Z*ae,ee*ae).floor()},this.setDrawingBufferSize=function(T,O,Y){Z=T,ee=O,ae=Y,t.width=Math.floor(T*Y),t.height=Math.floor(O*Y),this.setViewport(0,0,T,O)},this.setEffects=function(T){if(S===Qt){nt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(T){for(let O=0;O<T.length;O++)if(T[O].isOutputPass===!0){Oe("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}v.setEffects(T||[])},this.getCurrentViewport=function(T){return T.copy(se)},this.getViewport=function(T){return T.copy(De)},this.setViewport=function(T,O,Y,W){T.isVector4?De.set(T.x,T.y,T.z,T.w):De.set(T,O,Y,W),x.viewport(se.copy(De).multiplyScalar(ae).round())},this.getScissor=function(T){return T.copy(mt)},this.setScissor=function(T,O,Y,W){T.isVector4?mt.set(T.x,T.y,T.z,T.w):mt.set(T,O,Y,W),x.scissor(de.copy(mt).multiplyScalar(ae).round())},this.getScissorTest=function(){return We},this.setScissorTest=function(T){x.setScissorTest(We=T)},this.setOpaqueSort=function(T){Ne=T},this.setTransparentSort=function(T){Be=T},this.getClearColor=function(T){return T.copy(Fe.getClearColor())},this.setClearColor=function(){Fe.setClearColor(...arguments)},this.getClearAlpha=function(){return Fe.getClearAlpha()},this.setClearAlpha=function(){Fe.setClearAlpha(...arguments)},this.clear=function(T=!0,O=!0,Y=!0){let W=0;if(T){let X=!1;if(z!==null){const _e=z.texture.format;X=p.has(_e)}if(X){const _e=z.texture.type,ye=h.has(_e),ge=Fe.getClearColor(),Re=Fe.getClearAlpha(),we=ge.r,Ve=ge.g,qe=ge.b;ye?(y[0]=we,y[1]=Ve,y[2]=qe,y[3]=Re,U.clearBufferuiv(U.COLOR,0,y)):(A[0]=we,A[1]=Ve,A[2]=qe,A[3]=Re,U.clearBufferiv(U.COLOR,0,A))}else W|=U.COLOR_BUFFER_BIT}O&&(W|=U.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Y&&(W|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),W!==0&&U.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(T){T.setRenderer(this),I=T},this.dispose=function(){t.removeEventListener("webglcontextlost",xt,!1),t.removeEventListener("webglcontextrestored",ut,!1),t.removeEventListener("webglcontextcreationerror",gn,!1),Fe.dispose(),oe.dispose(),re.dispose(),H.dispose(),ce.dispose(),G.dispose(),xe.dispose(),te.dispose(),j.dispose(),Te.dispose(),Te.removeEventListener("sessionstart",Ho),Te.removeEventListener("sessionend",Wo),ai.stop()};function xt(T){T.preventDefault(),Sc("WebGLRenderer: Context Lost."),R=!0}function ut(){Sc("WebGLRenderer: Context Restored."),R=!1;const T=k.autoReset,O=Pe.enabled,Y=Pe.autoUpdate,W=Pe.needsUpdate,X=Pe.type;Ce(),k.autoReset=T,Pe.enabled=O,Pe.autoUpdate=Y,Pe.needsUpdate=W,Pe.type=X}function gn(T){nt("WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function _n(T){const O=T.target;O.removeEventListener("dispose",_n),wu(O)}function wu(T){Pu(T),H.remove(T)}function Pu(T){const O=H.get(T).programs;O!==void 0&&(O.forEach(function(Y){j.releaseProgram(Y)}),T.isShaderMaterial&&j.releaseShaderCache(T))}this.renderBufferDirect=function(T,O,Y,W,X,_e){O===null&&(O=be);const ye=X.isMesh&&X.matrixWorld.determinantAffine()<0,ge=Lu(T,O,Y,W,X);x.setMaterial(W,ye);let Re=Y.index,we=1;if(W.wireframe===!0){if(Re=K.getWireframeAttribute(Y),Re===void 0)return;we=2}const Ve=Y.drawRange,qe=Y.attributes.position;let Ie=Ve.start*we,at=(Ve.start+Ve.count)*we;_e!==null&&(Ie=Math.max(Ie,_e.start*we),at=Math.min(at,(_e.start+_e.count)*we)),Re!==null?(Ie=Math.max(Ie,0),at=Math.min(at,Re.count)):qe!=null&&(Ie=Math.max(Ie,0),at=Math.min(at,qe.count));const St=at-Ie;if(St<0||St===1/0)return;xe.setup(X,W,ge,Y,Re);let vt,ot=he;if(Re!==null&&(vt=fe.get(Re),ot=Q,ot.setIndex(vt)),X.isMesh)W.wireframe===!0?(x.setLineWidth(W.wireframeLinewidth*Le()),ot.setMode(U.LINES)):ot.setMode(U.TRIANGLES);else if(X.isLine){let Ut=W.linewidth;Ut===void 0&&(Ut=1),x.setLineWidth(Ut*Le()),X.isLineSegments?ot.setMode(U.LINES):X.isLineLoop?ot.setMode(U.LINE_LOOP):ot.setMode(U.LINE_STRIP)}else X.isPoints?ot.setMode(U.POINTS):X.isSprite&&ot.setMode(U.TRIANGLES);if(X.isBatchedMesh)if(He.get("WEBGL_multi_draw"))ot.renderMultiDraw(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount);else{const Ut=X._multiDrawStarts,Se=X._multiDrawCounts,Kt=X._multiDrawCount,tt=Re?fe.get(Re).bytesPerElement:1,en=H.get(W).currentProgram.getUniforms();for(let xn=0;xn<Kt;xn++)en.setValue(U,"_gl_DrawID",xn),ot.render(Ut[xn]/tt,Se[xn])}else if(X.isInstancedMesh)ot.renderInstances(Ie,St,X.count);else if(Y.isInstancedBufferGeometry){const Ut=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,Se=Math.min(Y.instanceCount,Ut);ot.renderInstances(Ie,St,Se)}else ot.render(Ie,St)};function Vo(T,O,Y){T.transparent===!0&&T.side===Fn&&T.forceSinglePass===!1?(T.side=Yt,T.needsUpdate=!0,Dr(T,O,Y),T.side=ri,T.needsUpdate=!0,Dr(T,O,Y),T.side=Fn):Dr(T,O,Y)}this.compile=function(T,O,Y=null){Y===null&&(Y=T),E=re.get(Y),E.init(O),g.push(E),Y.traverseVisible(function(X){X.isLight&&X.layers.test(O.layers)&&(E.pushLight(X),X.castShadow&&E.pushShadow(X))}),T!==Y&&T.traverseVisible(function(X){X.isLight&&X.layers.test(O.layers)&&(E.pushLight(X),X.castShadow&&E.pushShadow(X))}),E.setupLights();const W=new Set;return T.traverse(function(X){if(!(X.isMesh||X.isPoints||X.isLine||X.isSprite))return;const _e=X.material;if(_e)if(Array.isArray(_e))for(let ye=0;ye<_e.length;ye++){const ge=_e[ye];Vo(ge,Y,X),W.add(ge)}else Vo(_e,Y,X),W.add(_e)}),E=g.pop(),W},this.compileAsync=function(T,O,Y=null){const W=this.compile(T,O,Y);return new Promise(X=>{function _e(){if(W.forEach(function(ye){H.get(ye).currentProgram.isReady()&&W.delete(ye)}),W.size===0){X(T);return}setTimeout(_e,10)}He.get("KHR_parallel_shader_compile")!==null?_e():setTimeout(_e,10)})};let Us=null;function Iu(T){Us&&Us(T)}function Ho(){ai.stop()}function Wo(){ai.start()}const ai=new hu;ai.setAnimationLoop(Iu),typeof self<"u"&&ai.setContext(self),this.setAnimationLoop=function(T){Us=T,Te.setAnimationLoop(T),T===null?ai.stop():ai.start()},Te.addEventListener("sessionstart",Ho),Te.addEventListener("sessionend",Wo),this.render=function(T,O){if(O!==void 0&&O.isCamera!==!0){nt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;I!==null&&I.renderStart(T,O);const Y=Te.enabled===!0&&Te.isPresenting===!0,W=v!==null&&(z===null||Y)&&v.begin(w,z);if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),Te.enabled===!0&&Te.isPresenting===!0&&(v===null||v.isCompositing()===!1)&&(Te.cameraAutoUpdate===!0&&Te.updateCamera(O),O=Te.getCamera()),T.isScene===!0&&T.onBeforeRender(w,T,O,z),E=re.get(T,g.length),E.init(O),E.state.textureUnits=$.getTextureUnits(),g.push(E),ie.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),it.setFromProjectionMatrix(ie,bn,O.reversedDepth),Ke=this.localClippingEnabled,et=Ee.init(this.clippingPlanes,Ke),b=oe.get(T,P.length),b.init(),P.push(b),Te.enabled===!0&&Te.isPresenting===!0){const ye=w.xr.getDepthSensingMesh();ye!==null&&Ns(ye,O,-1/0,w.sortObjects)}Ns(T,O,0,w.sortObjects),b.finish(),w.sortObjects===!0&&b.sort(Ne,Be,O.reversedDepth),Me=Te.enabled===!1||Te.isPresenting===!1||Te.hasDepthSensing()===!1,Me&&Fe.addToRenderList(b,T),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),et===!0&&Ee.beginShadows();const X=E.state.shadowsArray;if(Pe.render(X,T,O),et===!0&&Ee.endShadows(),(W&&v.hasRenderPass())===!1){const ye=b.opaque,ge=b.transmissive;if(E.setupLights(),O.isArrayCamera){const Re=O.cameras;if(ge.length>0)for(let we=0,Ve=Re.length;we<Ve;we++){const qe=Re[we];qo(ye,ge,T,qe)}Me&&Fe.render(T);for(let we=0,Ve=Re.length;we<Ve;we++){const qe=Re[we];Xo(b,T,qe,qe.viewport)}}else ge.length>0&&qo(ye,ge,T,O),Me&&Fe.render(T),Xo(b,T,O)}z!==null&&B===0&&($.updateMultisampleRenderTarget(z),$.updateRenderTargetMipmap(z)),W&&v.end(w),T.isScene===!0&&T.onAfterRender(w,T,O),xe.resetDefaultState(),J=-1,ne=null,g.pop(),g.length>0?(E=g[g.length-1],$.setTextureUnits(E.state.textureUnits),et===!0&&Ee.setGlobalState(w.clippingPlanes,E.state.camera)):E=null,P.pop(),P.length>0?b=P[P.length-1]:b=null,I!==null&&I.renderEnd()};function Ns(T,O,Y,W){if(T.visible===!1)return;if(T.layers.test(O.layers)){if(T.isGroup)Y=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(O);else if(T.isLightProbeGrid)E.pushLightProbeGrid(T);else if(T.isLight)E.pushLight(T),T.castShadow&&E.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||it.intersectsSprite(T)){W&&ve.setFromMatrixPosition(T.matrixWorld).applyMatrix4(ie);const ye=G.update(T),ge=T.material;ge.visible&&b.push(T,ye,ge,Y,ve.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||it.intersectsObject(T))){const ye=G.update(T),ge=T.material;if(W&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),ve.copy(T.boundingSphere.center)):(ye.boundingSphere===null&&ye.computeBoundingSphere(),ve.copy(ye.boundingSphere.center)),ve.applyMatrix4(T.matrixWorld).applyMatrix4(ie)),Array.isArray(ge)){const Re=ye.groups;for(let we=0,Ve=Re.length;we<Ve;we++){const qe=Re[we],Ie=ge[qe.materialIndex];Ie&&Ie.visible&&b.push(T,ye,Ie,Y,ve.z,qe)}}else ge.visible&&b.push(T,ye,ge,Y,ve.z,null)}}const _e=T.children;for(let ye=0,ge=_e.length;ye<ge;ye++)Ns(_e[ye],O,Y,W)}function Xo(T,O,Y,W){const{opaque:X,transmissive:_e,transparent:ye}=T;E.setupLightsView(Y),et===!0&&Ee.setGlobalState(w.clippingPlanes,Y),W&&x.viewport(se.copy(W)),X.length>0&&Ir(X,O,Y),_e.length>0&&Ir(_e,O,Y),ye.length>0&&Ir(ye,O,Y),x.buffers.depth.setTest(!0),x.buffers.depth.setMask(!0),x.buffers.color.setMask(!0),x.setPolygonOffset(!1)}function qo(T,O,Y,W){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[W.id]===void 0){const Ie=He.has("EXT_color_buffer_half_float")||He.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[W.id]=new An(1,1,{generateMipmaps:!0,type:Ie?Vn:Qt,minFilter:pi,samples:Math.max(4,C.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ze.workingColorSpace})}const _e=E.state.transmissionRenderTarget[W.id],ye=W.viewport||se;_e.setSize(ye.z*w.transmissionResolutionScale,ye.w*w.transmissionResolutionScale);const ge=w.getRenderTarget(),Re=w.getActiveCubeFace(),we=w.getActiveMipmapLevel();w.setRenderTarget(_e),w.getClearColor($e),Ge=w.getClearAlpha(),Ge<1&&w.setClearColor(16777215,.5),w.clear(),Me&&Fe.render(Y);const Ve=w.toneMapping;w.toneMapping=Tn;const qe=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),E.setupLightsView(W),et===!0&&Ee.setGlobalState(w.clippingPlanes,W),Ir(T,Y,W),$.updateMultisampleRenderTarget(_e),$.updateRenderTargetMipmap(_e),He.has("WEBGL_multisampled_render_to_texture")===!1){let Ie=!1;for(let at=0,St=O.length;at<St;at++){const vt=O[at],{object:ot,geometry:Ut,material:Se,group:Kt}=vt;if(Se.side===Fn&&ot.layers.test(W.layers)){const tt=Se.side;Se.side=Yt,Se.needsUpdate=!0,Yo(ot,Y,W,Ut,Se,Kt),Se.side=tt,Se.needsUpdate=!0,Ie=!0}}Ie===!0&&($.updateMultisampleRenderTarget(_e),$.updateRenderTargetMipmap(_e))}w.setRenderTarget(ge,Re,we),w.setClearColor($e,Ge),qe!==void 0&&(W.viewport=qe),w.toneMapping=Ve}function Ir(T,O,Y){const W=O.isScene===!0?O.overrideMaterial:null;for(let X=0,_e=T.length;X<_e;X++){const ye=T[X],{object:ge,geometry:Re,group:we}=ye;let Ve=ye.material;Ve.allowOverride===!0&&W!==null&&(Ve=W),ge.layers.test(Y.layers)&&Yo(ge,O,Y,Re,Ve,we)}}function Yo(T,O,Y,W,X,_e){T.onBeforeRender(w,O,Y,W,X,_e),T.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),X.onBeforeRender(w,O,Y,W,T,_e),X.transparent===!0&&X.side===Fn&&X.forceSinglePass===!1?(X.side=Yt,X.needsUpdate=!0,w.renderBufferDirect(Y,O,W,X,T,_e),X.side=ri,X.needsUpdate=!0,w.renderBufferDirect(Y,O,W,X,T,_e),X.side=Fn):w.renderBufferDirect(Y,O,W,X,T,_e),T.onAfterRender(w,O,Y,W,X,_e)}function Dr(T,O,Y){O.isScene!==!0&&(O=be);const W=H.get(T),X=E.state.lights,_e=E.state.shadowsArray,ye=X.state.version,ge=j.getParameters(T,X.state,_e,O,Y,E.state.lightProbeGridArray),Re=j.getProgramCacheKey(ge);let we=W.programs;W.environment=T.isMeshStandardMaterial||T.isMeshLambertMaterial||T.isMeshPhongMaterial?O.environment:null,W.fog=O.fog;const Ve=T.isMeshStandardMaterial||T.isMeshLambertMaterial&&!T.envMap||T.isMeshPhongMaterial&&!T.envMap;W.envMap=ce.get(T.envMap||W.environment,Ve),W.envMapRotation=W.environment!==null&&T.envMap===null?O.environmentRotation:T.envMapRotation,we===void 0&&(T.addEventListener("dispose",_n),we=new Map,W.programs=we);let qe=we.get(Re);if(qe!==void 0){if(W.currentProgram===qe&&W.lightsStateVersion===ye)return Ko(T,ge),qe}else ge.uniforms=j.getUniforms(T),I!==null&&T.isNodeMaterial&&I.build(T,Y,ge),T.onBeforeCompile(ge,w),qe=j.acquireProgram(ge,Re),we.set(Re,qe),W.uniforms=ge.uniforms;const Ie=W.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Ie.clippingPlanes=Ee.uniform),Ko(T,ge),W.needsLights=Nu(T),W.lightsStateVersion=ye,W.needsLights&&(Ie.ambientLightColor.value=X.state.ambient,Ie.lightProbe.value=X.state.probe,Ie.directionalLights.value=X.state.directional,Ie.directionalLightShadows.value=X.state.directionalShadow,Ie.spotLights.value=X.state.spot,Ie.spotLightShadows.value=X.state.spotShadow,Ie.rectAreaLights.value=X.state.rectArea,Ie.ltc_1.value=X.state.rectAreaLTC1,Ie.ltc_2.value=X.state.rectAreaLTC2,Ie.pointLights.value=X.state.point,Ie.pointLightShadows.value=X.state.pointShadow,Ie.hemisphereLights.value=X.state.hemi,Ie.directionalShadowMatrix.value=X.state.directionalShadowMatrix,Ie.spotLightMatrix.value=X.state.spotLightMatrix,Ie.spotLightMap.value=X.state.spotLightMap,Ie.pointShadowMatrix.value=X.state.pointShadowMatrix),W.lightProbeGrid=E.state.lightProbeGridArray.length>0,W.currentProgram=qe,W.uniformsList=null,qe}function $o(T){if(T.uniformsList===null){const O=T.currentProgram.getUniforms();T.uniformsList=hs.seqWithValue(O.seq,T.uniforms)}return T.uniformsList}function Ko(T,O){const Y=H.get(T);Y.outputColorSpace=O.outputColorSpace,Y.batching=O.batching,Y.batchingColor=O.batchingColor,Y.instancing=O.instancing,Y.instancingColor=O.instancingColor,Y.instancingMorph=O.instancingMorph,Y.skinning=O.skinning,Y.morphTargets=O.morphTargets,Y.morphNormals=O.morphNormals,Y.morphColors=O.morphColors,Y.morphTargetsCount=O.morphTargetsCount,Y.numClippingPlanes=O.numClippingPlanes,Y.numIntersection=O.numClipIntersection,Y.vertexAlphas=O.vertexAlphas,Y.vertexTangents=O.vertexTangents,Y.toneMapping=O.toneMapping}function Du(T,O){if(T.length===0)return null;if(T.length===1)return T[0].texture!==null?T[0]:null;M.setFromMatrixPosition(O.matrixWorld);for(let Y=0,W=T.length;Y<W;Y++){const X=T[Y];if(X.texture!==null&&X.boundingBox.containsPoint(M))return X}return null}function Lu(T,O,Y,W,X){O.isScene!==!0&&(O=be),$.resetTextureUnits();const _e=O.fog,ye=W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial?O.environment:null,ge=z===null?w.outputColorSpace:z.isXRRenderTarget===!0?z.texture.colorSpace:Ze.workingColorSpace,Re=W.isMeshStandardMaterial||W.isMeshLambertMaterial&&!W.envMap||W.isMeshPhongMaterial&&!W.envMap,we=ce.get(W.envMap||ye,Re),Ve=W.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,qe=!!Y.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Ie=!!Y.morphAttributes.position,at=!!Y.morphAttributes.normal,St=!!Y.morphAttributes.color;let vt=Tn;W.toneMapped&&(z===null||z.isXRRenderTarget===!0)&&(vt=w.toneMapping);const ot=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,Ut=ot!==void 0?ot.length:0,Se=H.get(W),Kt=E.state.lights;if(et===!0&&(Ke===!0||T!==ne)){const ft=T===ne&&W.id===J;Ee.setState(W,T,ft)}let tt=!1;W.version===Se.__version?(Se.needsLights&&Se.lightsStateVersion!==Kt.state.version||Se.outputColorSpace!==ge||X.isBatchedMesh&&Se.batching===!1||!X.isBatchedMesh&&Se.batching===!0||X.isBatchedMesh&&Se.batchingColor===!0&&X.colorTexture===null||X.isBatchedMesh&&Se.batchingColor===!1&&X.colorTexture!==null||X.isInstancedMesh&&Se.instancing===!1||!X.isInstancedMesh&&Se.instancing===!0||X.isSkinnedMesh&&Se.skinning===!1||!X.isSkinnedMesh&&Se.skinning===!0||X.isInstancedMesh&&Se.instancingColor===!0&&X.instanceColor===null||X.isInstancedMesh&&Se.instancingColor===!1&&X.instanceColor!==null||X.isInstancedMesh&&Se.instancingMorph===!0&&X.morphTexture===null||X.isInstancedMesh&&Se.instancingMorph===!1&&X.morphTexture!==null||Se.envMap!==we||W.fog===!0&&Se.fog!==_e||Se.numClippingPlanes!==void 0&&(Se.numClippingPlanes!==Ee.numPlanes||Se.numIntersection!==Ee.numIntersection)||Se.vertexAlphas!==Ve||Se.vertexTangents!==qe||Se.morphTargets!==Ie||Se.morphNormals!==at||Se.morphColors!==St||Se.toneMapping!==vt||Se.morphTargetsCount!==Ut||!!Se.lightProbeGrid!=E.state.lightProbeGridArray.length>0)&&(tt=!0):(tt=!0,Se.__version=W.version);let en=Se.currentProgram;tt===!0&&(en=Dr(W,O,X),I&&W.isNodeMaterial&&I.onUpdateProgram(W,en,Se));let xn=!1,Wn=!1,Ai=!1;const ct=en.getUniforms(),yt=Se.uniforms;if(x.useProgram(en.program)&&(xn=!0,Wn=!0,Ai=!0),W.id!==J&&(J=W.id,Wn=!0),Se.needsLights){const ft=Du(E.state.lightProbeGridArray,X);Se.lightProbeGrid!==ft&&(Se.lightProbeGrid=ft,Wn=!0)}if(xn||ne!==T){x.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),ct.setValue(U,"projectionMatrix",T.projectionMatrix),ct.setValue(U,"viewMatrix",T.matrixWorldInverse);const qn=ct.map.cameraPosition;qn!==void 0&&qn.setValue(U,ue.setFromMatrixPosition(T.matrixWorld)),C.logarithmicDepthBuffer&&ct.setValue(U,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&ct.setValue(U,"isOrthographic",T.isOrthographicCamera===!0),ne!==T&&(ne=T,Wn=!0,Ai=!0)}if(Se.needsLights&&(Kt.state.directionalShadowMap.length>0&&ct.setValue(U,"directionalShadowMap",Kt.state.directionalShadowMap,$),Kt.state.spotShadowMap.length>0&&ct.setValue(U,"spotShadowMap",Kt.state.spotShadowMap,$),Kt.state.pointShadowMap.length>0&&ct.setValue(U,"pointShadowMap",Kt.state.pointShadowMap,$)),X.isSkinnedMesh){ct.setOptional(U,X,"bindMatrix"),ct.setOptional(U,X,"bindMatrixInverse");const ft=X.skeleton;ft&&(ft.boneTexture===null&&ft.computeBoneTexture(),ct.setValue(U,"boneTexture",ft.boneTexture,$))}X.isBatchedMesh&&(ct.setOptional(U,X,"batchingTexture"),ct.setValue(U,"batchingTexture",X._matricesTexture,$),ct.setOptional(U,X,"batchingIdTexture"),ct.setValue(U,"batchingIdTexture",X._indirectTexture,$),ct.setOptional(U,X,"batchingColorTexture"),X._colorsTexture!==null&&ct.setValue(U,"batchingColorTexture",X._colorsTexture,$));const Xn=Y.morphAttributes;if((Xn.position!==void 0||Xn.normal!==void 0||Xn.color!==void 0)&&N.update(X,Y,en),(Wn||Se.receiveShadow!==X.receiveShadow)&&(Se.receiveShadow=X.receiveShadow,ct.setValue(U,"receiveShadow",X.receiveShadow)),(W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial)&&W.envMap===null&&O.environment!==null&&(yt.envMapIntensity.value=O.environmentIntensity),yt.dfgLUT!==void 0&&(yt.dfgLUT.value=x_()),Wn){if(ct.setValue(U,"toneMappingExposure",w.toneMappingExposure),Se.needsLights&&Uu(yt,Ai),_e&&W.fog===!0&&le.refreshFogUniforms(yt,_e),le.refreshMaterialUniforms(yt,W,ae,ee,E.state.transmissionRenderTarget[T.id]),Se.needsLights&&Se.lightProbeGrid){const ft=Se.lightProbeGrid;yt.probesSH.value=ft.texture,yt.probesMin.value.copy(ft.boundingBox.min),yt.probesMax.value.copy(ft.boundingBox.max),yt.probesResolution.value.copy(ft.resolution)}hs.upload(U,$o(Se),yt,$)}if(W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(hs.upload(U,$o(Se),yt,$),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&ct.setValue(U,"center",X.center),ct.setValue(U,"modelViewMatrix",X.modelViewMatrix),ct.setValue(U,"normalMatrix",X.normalMatrix),ct.setValue(U,"modelMatrix",X.matrixWorld),W.uniformsGroups!==void 0){const ft=W.uniformsGroups;for(let qn=0,Ri=ft.length;qn<Ri;qn++){const Zo=ft[qn];te.update(Zo,en),te.bind(Zo,en)}}return en}function Uu(T,O){T.ambientLightColor.needsUpdate=O,T.lightProbe.needsUpdate=O,T.directionalLights.needsUpdate=O,T.directionalLightShadows.needsUpdate=O,T.pointLights.needsUpdate=O,T.pointLightShadows.needsUpdate=O,T.spotLights.needsUpdate=O,T.spotLightShadows.needsUpdate=O,T.rectAreaLights.needsUpdate=O,T.hemisphereLights.needsUpdate=O}function Nu(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return q},this.getActiveMipmapLevel=function(){return B},this.getRenderTarget=function(){return z},this.setRenderTargetTextures=function(T,O,Y){const W=H.get(T);W.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),H.get(T.texture).__webglTexture=O,H.get(T.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:Y,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,O){const Y=H.get(T);Y.__webglFramebuffer=O,Y.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(T,O=0,Y=0){z=T,q=O,B=Y;let W=null,X=!1,_e=!1;if(T){const ge=H.get(T);if(ge.__useDefaultFramebuffer!==void 0){x.bindFramebuffer(U.FRAMEBUFFER,ge.__webglFramebuffer),se.copy(T.viewport),de.copy(T.scissor),Ue=T.scissorTest,x.viewport(se),x.scissor(de),x.setScissorTest(Ue),J=-1;return}else if(ge.__webglFramebuffer===void 0)$.setupRenderTarget(T);else if(ge.__hasExternalTextures)$.rebindTextures(T,H.get(T.texture).__webglTexture,H.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const Ve=T.depthTexture;if(ge.__boundDepthTexture!==Ve){if(Ve!==null&&H.has(Ve)&&(T.width!==Ve.image.width||T.height!==Ve.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");$.setupDepthRenderbuffer(T)}}const Re=T.texture;(Re.isData3DTexture||Re.isDataArrayTexture||Re.isCompressedArrayTexture)&&(_e=!0);const we=H.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(we[O])?W=we[O][Y]:W=we[O],X=!0):T.samples>0&&$.useMultisampledRTT(T)===!1?W=H.get(T).__webglMultisampledFramebuffer:Array.isArray(we)?W=we[Y]:W=we,se.copy(T.viewport),de.copy(T.scissor),Ue=T.scissorTest}else se.copy(De).multiplyScalar(ae).floor(),de.copy(mt).multiplyScalar(ae).floor(),Ue=We;if(Y!==0&&(W=D),x.bindFramebuffer(U.FRAMEBUFFER,W)&&x.drawBuffers(T,W),x.viewport(se),x.scissor(de),x.setScissorTest(Ue),X){const ge=H.get(T.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+O,ge.__webglTexture,Y)}else if(_e){const ge=O;for(let Re=0;Re<T.textures.length;Re++){const we=H.get(T.textures[Re]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+Re,we.__webglTexture,Y,ge)}}else if(T!==null&&Y!==0){const ge=H.get(T.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,ge.__webglTexture,Y)}J=-1},this.readRenderTargetPixels=function(T,O,Y,W,X,_e,ye,ge=0){if(!(T&&T.isWebGLRenderTarget)){nt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Re=H.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&ye!==void 0&&(Re=Re[ye]),Re){x.bindFramebuffer(U.FRAMEBUFFER,Re);try{const we=T.textures[ge],Ve=we.format,qe=we.type;if(T.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+ge),!C.textureFormatReadable(Ve)){nt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!C.textureTypeReadable(qe)){nt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=T.width-W&&Y>=0&&Y<=T.height-X&&U.readPixels(O,Y,W,X,pe.convert(Ve),pe.convert(qe),_e)}finally{const we=z!==null?H.get(z).__webglFramebuffer:null;x.bindFramebuffer(U.FRAMEBUFFER,we)}}},this.readRenderTargetPixelsAsync=async function(T,O,Y,W,X,_e,ye,ge=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Re=H.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&ye!==void 0&&(Re=Re[ye]),Re)if(O>=0&&O<=T.width-W&&Y>=0&&Y<=T.height-X){x.bindFramebuffer(U.FRAMEBUFFER,Re);const we=T.textures[ge],Ve=we.format,qe=we.type;if(T.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+ge),!C.textureFormatReadable(Ve))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!C.textureTypeReadable(qe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ie=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,Ie),U.bufferData(U.PIXEL_PACK_BUFFER,_e.byteLength,U.STREAM_READ),U.readPixels(O,Y,W,X,pe.convert(Ve),pe.convert(qe),0);const at=z!==null?H.get(z).__webglFramebuffer:null;x.bindFramebuffer(U.FRAMEBUFFER,at);const St=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await Fd(U,St,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,Ie),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,_e),U.deleteBuffer(Ie),U.deleteSync(St),_e}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,O=null,Y=0){const W=Math.pow(2,-Y),X=Math.floor(T.image.width*W),_e=Math.floor(T.image.height*W),ye=O!==null?O.x:0,ge=O!==null?O.y:0;$.setTexture2D(T,0),U.copyTexSubImage2D(U.TEXTURE_2D,Y,0,0,ye,ge,X,_e),x.unbindTexture()},this.copyTextureToTexture=function(T,O,Y=null,W=null,X=0,_e=0){let ye,ge,Re,we,Ve,qe,Ie,at,St;const vt=T.isCompressedTexture?T.mipmaps[_e]:T.image;if(Y!==null)ye=Y.max.x-Y.min.x,ge=Y.max.y-Y.min.y,Re=Y.isBox3?Y.max.z-Y.min.z:1,we=Y.min.x,Ve=Y.min.y,qe=Y.isBox3?Y.min.z:0;else{const yt=Math.pow(2,-X);ye=Math.floor(vt.width*yt),ge=Math.floor(vt.height*yt),T.isDataArrayTexture?Re=vt.depth:T.isData3DTexture?Re=Math.floor(vt.depth*yt):Re=1,we=0,Ve=0,qe=0}W!==null?(Ie=W.x,at=W.y,St=W.z):(Ie=0,at=0,St=0);const ot=pe.convert(O.format),Ut=pe.convert(O.type);let Se;O.isData3DTexture?($.setTexture3D(O,0),Se=U.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?($.setTexture2DArray(O,0),Se=U.TEXTURE_2D_ARRAY):($.setTexture2D(O,0),Se=U.TEXTURE_2D),x.activeTexture(U.TEXTURE0),x.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,O.flipY),x.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),x.pixelStorei(U.UNPACK_ALIGNMENT,O.unpackAlignment);const Kt=x.getParameter(U.UNPACK_ROW_LENGTH),tt=x.getParameter(U.UNPACK_IMAGE_HEIGHT),en=x.getParameter(U.UNPACK_SKIP_PIXELS),xn=x.getParameter(U.UNPACK_SKIP_ROWS),Wn=x.getParameter(U.UNPACK_SKIP_IMAGES);x.pixelStorei(U.UNPACK_ROW_LENGTH,vt.width),x.pixelStorei(U.UNPACK_IMAGE_HEIGHT,vt.height),x.pixelStorei(U.UNPACK_SKIP_PIXELS,we),x.pixelStorei(U.UNPACK_SKIP_ROWS,Ve),x.pixelStorei(U.UNPACK_SKIP_IMAGES,qe);const Ai=T.isDataArrayTexture||T.isData3DTexture,ct=O.isDataArrayTexture||O.isData3DTexture;if(T.isDepthTexture){const yt=H.get(T),Xn=H.get(O),ft=H.get(yt.__renderTarget),qn=H.get(Xn.__renderTarget);x.bindFramebuffer(U.READ_FRAMEBUFFER,ft.__webglFramebuffer),x.bindFramebuffer(U.DRAW_FRAMEBUFFER,qn.__webglFramebuffer);for(let Ri=0;Ri<Re;Ri++)Ai&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,H.get(T).__webglTexture,X,qe+Ri),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,H.get(O).__webglTexture,_e,St+Ri)),U.blitFramebuffer(we,Ve,ye,ge,Ie,at,ye,ge,U.DEPTH_BUFFER_BIT,U.NEAREST);x.bindFramebuffer(U.READ_FRAMEBUFFER,null),x.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(X!==0||T.isRenderTargetTexture||H.has(T)){const yt=H.get(T),Xn=H.get(O);x.bindFramebuffer(U.READ_FRAMEBUFFER,F),x.bindFramebuffer(U.DRAW_FRAMEBUFFER,L);for(let ft=0;ft<Re;ft++)Ai?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,yt.__webglTexture,X,qe+ft):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,yt.__webglTexture,X),ct?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Xn.__webglTexture,_e,St+ft):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Xn.__webglTexture,_e),X!==0?U.blitFramebuffer(we,Ve,ye,ge,Ie,at,ye,ge,U.COLOR_BUFFER_BIT,U.NEAREST):ct?U.copyTexSubImage3D(Se,_e,Ie,at,St+ft,we,Ve,ye,ge):U.copyTexSubImage2D(Se,_e,Ie,at,we,Ve,ye,ge);x.bindFramebuffer(U.READ_FRAMEBUFFER,null),x.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else ct?T.isDataTexture||T.isData3DTexture?U.texSubImage3D(Se,_e,Ie,at,St,ye,ge,Re,ot,Ut,vt.data):O.isCompressedArrayTexture?U.compressedTexSubImage3D(Se,_e,Ie,at,St,ye,ge,Re,ot,vt.data):U.texSubImage3D(Se,_e,Ie,at,St,ye,ge,Re,ot,Ut,vt):T.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,_e,Ie,at,ye,ge,ot,Ut,vt.data):T.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,_e,Ie,at,vt.width,vt.height,ot,vt.data):U.texSubImage2D(U.TEXTURE_2D,_e,Ie,at,ye,ge,ot,Ut,vt);x.pixelStorei(U.UNPACK_ROW_LENGTH,Kt),x.pixelStorei(U.UNPACK_IMAGE_HEIGHT,tt),x.pixelStorei(U.UNPACK_SKIP_PIXELS,en),x.pixelStorei(U.UNPACK_SKIP_ROWS,xn),x.pixelStorei(U.UNPACK_SKIP_IMAGES,Wn),_e===0&&O.generateMipmaps&&U.generateMipmap(Se),x.unbindTexture()},this.initRenderTarget=function(T){H.get(T).__webglFramebuffer===void 0&&$.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?$.setTextureCube(T,0):T.isData3DTexture?$.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?$.setTexture2DArray(T,0):$.setTexture2D(T,0),x.unbindTexture()},this.resetState=function(){q=0,B=0,z=null,x.reset(),xe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return bn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Ze._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ze._getUnpackColorSpace()}}const M_=new Set([...xi,"road","station"]);function S_(n,e,t,i=[],r){const s=e>=128?2:1,a=6,o=Math.ceil(e/s),c=Math.ceil(t/s),l=new Uint8Array(o*c);for(let m=0;m<c;m++)for(let _=0;_<o;_++){let S=!1;const p=_*s,h=m*s,y=Math.min(e,p+s),A=Math.min(t,h+s);e:for(let M=h;M<A;M++)for(let b=p;b<y;b++)if(M_.has(n[lt(b,M,e)].kind)){S=!0;break e}S&&(l[m*o+_]=1)}const u=new Uint8Array(o*c),d=[],f=[[1,0],[-1,0],[0,1],[0,-1]];for(let m=0;m<c;m++)for(let _=0;_<o;_++){const S=m*o+_;if(!l[S]||u[S])continue;let p=0,h=0,y=0,A=_,M=_,b=m,E=m;const P=[S];for(u[S]=1;P.length>0;){const q=P.pop(),B=q%o,z=q/o|0;p+=B,h+=z,y+=1,B<A&&(A=B),B>M&&(M=B),z<b&&(b=z),z>E&&(E=z);for(const[J,ne]of f){const se=B+J,de=z+ne;if(se<0||de<0||se>=o||de>=c)continue;const Ue=de*o+se;!l[Ue]||u[Ue]||(u[Ue]=1,P.push(Ue))}}if(y<a)continue;const g=p/y,v=h/y,w=(g+.5)*s,R=(v+.5)*s,I=Math.max(M-A,E-b)*s,D=Math.max(6,I*.55+Math.sqrt(y)*s*.35);let F=null,L=1/0;for(const q of i){const B=Math.hypot(q.cx-w,q.cy-R);B<L&&(L=B,F=q.name)}L>D+20&&(F=null),d.push({cx:w,cy:R,radius:D,size:y,label:F})}return d.sort((m,_)=>_.size-m.size),d}function Su(n){const e=.95-n.radius*.011-Math.log2(1+n.size)*.02;return Math.max(.48,Math.min(.9,e))}const st=1,pl=14,y_=22,E_=8,ml=Math.PI/4,Ma=Math.atan(1/Math.sqrt(2)),Sa=220;function b_(n){const t=new Is(-18*n/2,18*n/2,9,-9,.1,2e3);return t.position.set(0,0,0),{target:new V(0,0,0),pan:new V(0,0,0),zoom:1,autoZoom:.72,camera:t,clusters:[],focusIndex:-1,focusTimer:0,reclusterTimer:0,targetAutoZoom:.72,focusAnnounce:null}}function T_(n,e,t,i){const s=yu(n)/i,a=new V(1,0,-1).normalize(),o=new V(-1,0,-1).normalize();n.pan.addScaledVector(a,-e*s),n.pan.addScaledVector(o,t*s)}function A_(n,e){n.zoom=Math.max(.45,Math.min(1.8,n.zoom*e))}function yu(n){return 28/(n.zoom*n.autoZoom)}function gr(n,e){const t=yu(n),i=t*e,r=n.camera;r.left=-i/2,r.right=i/2,r.top=t/2,r.bottom=-t/2,r.updateProjectionMatrix()}function Wi(n){const e=new V().copy(n.target).add(n.pan),t=e.x+Sa*Math.cos(Ma)*Math.sin(ml),i=e.y+Sa*Math.sin(Ma),r=e.z+Sa*Math.cos(Ma)*Math.cos(ml);n.camera.position.set(t,i,r),n.camera.lookAt(e),n.camera.updateMatrixWorld()}function R_(){return pl+Math.random()*(y_-pl)}function Eu(n,e){const t=n.focusIndex>=0?n.clusters[n.focusIndex]:null;if(n.clusters=S_(e.tiles,e.width,e.height,e.settlements),n.reclusterTimer=E_,n.clusters.length===0){n.focusIndex=-1;return}if(t){let i=0,r=1/0;for(let a=0;a<n.clusters.length;a++){const o=n.clusters[a],c=Math.hypot(o.cx-t.cx,o.cy-t.cy);c<r&&(r=c,i=a)}n.focusIndex=i;const s=n.clusters[i];n.targetAutoZoom=Su(s)}}function C_(n,e){if(n.length===0)return-1;if(n.length===1)return 0;const t=n.map((s,a)=>{const o=Math.sqrt(s.size);return a===e?o*.15:o}),i=t.reduce((s,a)=>s+a,0);let r=Math.random()*i;for(let s=0;s<t.length;s++)if(r-=t[s],r<=0)return s;return n.length-1}function bu(n,e,t){if(e<0||e>=n.clusters.length)return;const i=n.clusters[e];n.focusIndex,n.focusIndex=e,n.focusTimer=R_(),n.targetAutoZoom=Su(i),n.pan.set(0,0,0),i.label&&(n.focusAnnounce=i.label)}function gl(n,e,t){if(n.reclusterTimer-=t,n.focusTimer-=t,(n.clusters.length===0||n.reclusterTimer<=0)&&Eu(n,e),n.clusters.length===0){const r=e.settlements[0];if(r){const s=1-Math.exp(-.45*t);n.target.x+=(r.cx*st-n.target.x)*s,n.target.z+=(r.cy*st-n.target.z)*s}return}if(n.focusIndex<0||n.focusIndex>=n.clusters.length||n.focusTimer<=0){const r=C_(n.clusters,n.focusIndex);bu(n,r)}const i=n.clusters[n.focusIndex];if(i){const r=i.cx*st,s=i.cy*st,a=1-Math.exp(-.5*t);n.target.x+=(r-n.target.x)*a,n.target.z+=(s-n.target.z)*a,n.autoZoom+=(n.targetAutoZoom-n.autoZoom)*(1-Math.exp(-.35*t))}}function w_(n){const e=n.focusAnnounce;return n.focusAnnounce=null,e}function P_(n,e,t){n.target.set((e-1)/2*st,0,(t-1)/2*st),n.pan.set(0,0,0),n.zoom=1,n.autoZoom=.72,n.targetAutoZoom=.72,n.clusters=[],n.focusIndex=-1,n.focusTimer=0,n.reclusterTimer=0,n.focusAnnounce=null}function I_(n,e){if(Eu(n,e),n.clusters.length===0){const i=e.settlements[0];i&&(n.target.set(i.cx*st,0,i.cy*st),i.name&&(n.focusAnnounce=i.name));return}bu(n,0);const t=n.clusters[0];n.target.set(t.cx*st,0,t.cy*st),n.autoZoom=n.targetAutoZoom}function D_(n){n.background=new Ye(9353432),n.fog=new Lo(11061472,.0012);const e=new xh(15791871,6982232,1.45);n.add(e);const t=new ha(16775402,2);t.position.set(50,80,30),t.castShadow=!1,n.add(t);const i=new ha(13163248,.75);i.position.set(-40,30,-50),n.add(i);const r=new ha(11583743,.4);r.position.set(20,15,-60),n.add(r);const s=new Sh(9478328,.7);n.add(s)}const Ss=new Map,ys=new Map,Es=new Map;function It(n,e,t={}){const i=Ss.get(n);if(i)return i;const r=new sn({color:e,roughness:.85,metalness:.08,...t});return Ss.set(n,r),r}function Dt(n,e,t,i,r=e/2){const s=new Mt(new qt(n,e,t),i);return s.position.y=r,s}function Tu(n,e,t,i=1){const s=t>0?Math.max(.12,1-t/48):1,a={residential:.55,commercial:.7,industrial:.65,park:.1,school:.75,hospital:.8,station:.5,plaza:.12,tower:1.6,skyscraper:3.2},o=i>=2?1.35:1;return Math.max(.12,(a[n]??.5)*(.55+e*.28)*s*o)}const L_=[12888194,12095600,13678744,11040864,13152400,10123866,14206120,11575432],U_=[8036036,6982320,9482440,5929624,10533072,7375016,8956096,4876416],N_=[9079408,8026720,10129528,6973536,10524800,7893088,9076848,5920848],F_=[9482448,8429760,10535136,7375016,11587816,6848672,10008792,5269624],O_=[11059424,9480392,12112112,7901360,12638448,6848672,10533080,5795984],_o={residential:12888194,commercial:8036036,industrial:9079408,school:15257728,hospital:15263984,station:9474208,plaza:13682864,tower:9482448,skyscraper:11059424};function Au(n,e){const t=e%8;switch(n){case"residential":return L_[t];case"commercial":return U_[t];case"industrial":return N_[t];case"tower":return F_[t];case"skyscraper":return O_[t];default:return _o[n]??_o.residential}}function Ru(n,e){return e>=2?n==="skyscraper"?{w:1.65,d:1.65}:n==="tower"?{w:1.45,d:1.4}:{w:1.5,d:1.5}:n==="skyscraper"?{w:.72,d:.72}:n==="tower"?{w:.55,d:.58}:n==="industrial"?{w:.68,d:.62}:n==="commercial"?{w:.64,d:.58}:{w:.62,d:.58}}function B_(n){if(n.construction>0||n.kind==="pad"||n.footprint===0)return!1;switch(n.kind){case"residential":case"commercial":case"industrial":case"school":case"hospital":case"station":case"tower":case"skyscraper":return!0;default:return!1}}function k_(n,e){const t=`${n}:${e}`,i=ys.get(t);if(i)return i;const r=64,s=128,a=document.createElement("canvas");a.width=r,a.height=s;const o=a.getContext("2d");o.fillStyle="#ffffff",o.fillRect(0,0,r,s);const c=n==="skyscraper"||n==="tower"?10:6,l=n==="skyscraper"||n==="tower"?5:4,u=6,d=8,f=3,m=4,_=(r-u*2-f*(l-1))/l,S=(s-d*2-m*(c-1))/c;for(let h=0;h<c;h++)for(let y=0;y<l;y++){const A=(e*7+h*3+y*5)%10>4;n==="skyscraper"||n==="tower"?o.fillStyle=A?"rgba(40, 70, 100, 0.55)":"rgba(20, 30, 45, 0.7)":n==="industrial"?o.fillStyle=A?"rgba(50, 50, 40, 0.45)":"rgba(30, 30, 25, 0.55)":o.fillStyle=A?"rgba(255, 220, 140, 0.55)":"rgba(25, 35, 45, 0.65)";const M=u+y*(_+f),b=d+h*(S+m);o.fillRect(M,b,_,S)}o.fillStyle="rgba(0,0,0,0.12)",o.fillRect(0,0,r,5);const p=new lh(a);return p.colorSpace=Xt,p.anisotropy=4,p.wrapS=yr,p.wrapT=yr,ys.set(t,p),p}function Cu(n,e){const t=e%4,i=`facade-${n}-${t}`,r=Es.get(i);if(r)return r;const s=n==="skyscraper"||n==="tower",a=k_(n,t),o=new sn({color:16777215,map:a,roughness:s?.32:.78,metalness:s?.35:.08});return Es.set(i,o),o}function z_(n,e,t,i,r,s){const a=new Pt;a.userData.constructionSite=!0;const o=Dt(n*1.1,.06,t*1.1,It("foundation",6974064,{roughness:.95}),.03);a.add(o);const c=Dt(.22,.08,.18,It("pallet",9068592),.08);c.position.set(-n*.55,0,t*.4),a.add(c);for(let E=0;E<3;E++){const P=Dt(.18,.04,.08,It("brick",11554880),.14+E*.045);P.position.set(-n*.55,0,t*.4),a.add(P)}const l=It("scaffold",13148224,{metalness:.45,roughness:.45}),u=Math.max(2,Math.ceil(3*s+1));for(let E=0;E<u;E++){const P=(E+1)/(u+1)*e*Math.max(.4,s),g=Dt(n*1.08,.025,t*1.08,l,P);a.add(g);for(const[v,w]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const R=Dt(.03,P,.03,l,P/2);R.position.set(v*n*.52,0,w*t*.52),a.add(R)}}const d=e+.7,f=Dt(.07,d,.07,It("crane",12632264,{metalness:.55}),d/2);f.position.x=n*.42,a.add(f);const m=Dt(.16,.12,.14,It("crane-cab",14721088,{metalness:.35}),d-.05);m.position.x=n*.42,a.add(m);const _=n*1.1,S=Dt(_,.045,.045,It("crane-boom",14721088,{metalness:.4}),d+.08);S.position.x=n*.42-_*.25,S.userData.craneBoom=!0,a.add(S);const p=Math.sin(i*1.2+r)*.22,h=.25+s*(e*.7),y=Math.max(.15,d+.08-h),A=Dt(.012,y,.012,It("cable",8947856),d+.08-y/2);A.position.x=p,A.userData.craneCable=!0,a.add(A);const M=Dt(.07,.09,.07,It("hook",14721088),h);M.position.x=p,M.userData.craneHook=!0,a.add(M);const b=new Mt(new Pr(.04,6,6),It("site-lamp",16769152,{emissive:16760896,emissiveIntensity:.9}));return b.position.set(-n*.4,.35,-t*.4),b.userData.siteLamp=!0,a.add(b),a}function G_(n){const e=new Pt,t=Dt(.08,.28,.08,It("trunk",5914672),.14);e.add(t);const i=It(`canopy-${n%2}`,n%2===0?3836485:4889173,{roughness:.95}),r=new Mt(new Pr(.22,6,5),i);return r.position.y=.42,r.scale.set(1,.9,1),e.add(r),e}function V_(n,e,t){const i=new Pt,r=It(`roof-${t}`,t,{roughness:.75}),s=.48,a=n*.52,o=a/Math.cos(s),c=a*Math.tan(s),l=e*.98,u=Dt(o,.035,l,r,0);u.rotation.z=s,u.position.set(-a/2,c/2,0),i.add(u);const d=Dt(o,.035,l,r,0);return d.rotation.z=-s,d.position.set(a/2,c/2,0),i.add(d),i}function H_(n,e,t,i){return Dt(n*1.02,.05,e*1.02,It(`flat-roof-${t}`,t,{roughness:.9}),i)}function W_(n,e){const t=n.kind;if(t==="grass"||t==="empty"||t==="water"||t==="forest"||t==="road"||t==="rail"||t==="crossing"||t==="bridge"||t==="pad")return null;const i=new Pt;if(i.userData={kind:t,tier:n.tier,construction:n.construction,variant:n.variant,footprint:n.footprint,animated:!1},t==="park"){for(let d=0;d<3;d++){const f=G_(n.variant+d);f.position.set((d-1)*.28,0,d%2*.15-.05),f.userData.sway=d+n.variant,i.add(f)}return i.userData.animated=!0,i}if(t==="plaza"){i.add(Dt(.75,.08,.75,It("plaza",_o.plaza),.04));const d=new Mt(new Ei(.12,.15,.1,8),It("fountain",6983856,{metalness:.3,roughness:.4}));return d.position.y=.12,i.add(d),i}const r=Math.max(1,n.footprint||1),s=Tu(t,n.tier,n.construction,r),{w:a,d:o}=Ru(t,r),c=Au(t,n.variant);if(n.construction<=0){const f=Cu(t,n.variant).clone();if(f.color.setHex(c),i.add(Dt(a,s,o,f,s/2)),t==="residential"&&n.tier<=2){const m=V_(a,o,10502208);m.position.y=s,i.add(m)}else t!=="tower"&&t!=="skyscraper"&&i.add(H_(a,o,7370880,s+.025));return i}const l=Math.max(.12,1-n.construction/48),u=It(`body-build-${t}`,c,{transparent:!0,opacity:.35+l*.5,roughness:.9});return i.add(Dt(a,s,o,u,s/2)),i.add(z_(a,Math.max(s,.4),o,e,n.variant,l)),i.userData.buildingProgress=l,i.userData.animated=!0,i}function X_(n,e){const t=n.userData.variant??0;n.traverse(i=>{if(i instanceof bt){if(i.userData.sway!=null&&(i.rotation.z=Math.sin(e*1.5+i.userData.sway)*.06),i.userData.craneHook||i.userData.craneCable){const r=Math.sin(e*1.2+t)*.22;i.position.x=r}if(i.userData.siteLamp){const r=Math.sin(e*4+t)>-.2,s=i.material;s.emissiveIntensity=r?1.1:.25}}})}function q_(){for(const n of Ss.values())n.dispose();Ss.clear();for(const n of Es.values())n.dispose();Es.clear();for(const n of ys.values())n.dispose();ys.clear()}const _r=new bt,_l=new Ye;function Y_(n){return`${n.kind}:${n.variant%4}`}function $_(n){return!!(n.kind==="park"||n.kind==="plaza"||n.construction>0&&K_(n.kind))}function K_(n){return n==="residential"||n==="commercial"||n==="industrial"||n==="school"||n==="hospital"||n==="station"||n==="tower"||n==="skyscraper"||n==="park"||n==="plaza"}function Z_(n){const e=Math.min(4096,Math.max(512,n)),t=new Pt;t.name="building-batch";const i=new Map,r=new Pt;r.name="building-special",t.add(r);const s=new Map,a=new Set,o=new qt(1,1,1);let c=-1,l=-1,u=0,d=0;function f(M){const b=Y_(M);let E=i.get(b);if(E)return E;const P=M.kind,g=Cu(P,M.variant),v=new rn(o,g,e);return v.instanceMatrix.setUsage(yn),v.instanceColor=new po(new Float32Array(e*3),3),v.count=0,v.frustumCulled=!1,v.name=`batch-${b}`,t.add(v),E={mesh:v,count:0,capacity:e},i.set(b,E),E}function m(){for(const M of i.values())M.count=0,M.mesh.count=0}function _(M,b,E){const P=f(M);if(P.count>=P.capacity)return;const g=M.kind,v=Math.max(1,M.footprint||1),w=Tu(g,M.tier,0,v),{w:R,d:I}=Ru(g,v),D=v>=2?.5:0,F=v>=2?.5:0;_r.position.set((b+D)*st,w/2,(E+F)*st),_r.rotation.set(0,0,0),_r.scale.set(R,w,I),_r.updateMatrix(),P.mesh.setMatrixAt(P.count,_r.matrix),_l.setHex(Au(g,M.variant)),P.mesh.setColorAt(P.count,_l),P.count+=1}function S(M){const b=s.get(M);b&&(r.remove(b.mesh),b.mesh.traverse(E=>{E instanceof Mt&&E.geometry.dispose()}),s.delete(M),a.delete(M))}function p(M,b,E,P,g){const v=`${b.kind}:${b.tier}:${Math.ceil(b.construction/4)}:${b.variant}:${b.footprint}`,w=s.get(M);if(w&&w.key===v)return;w&&S(M);const R=W_(b,g);if(!R)return;const I=b.footprint>=2?.5:0,D=b.footprint>=2?.5:0;R.position.set((E+I)*st,0,(P+D)*st),r.add(R),s.set(M,{key:v,mesh:R}),R.userData.animated&&a.add(M)}function h(M,b){const{width:E,height:P,tiles:g}=M;m();const v=new Set;for(let w=0;w<P;w++)for(let R=0;R<E;R++){const I=w*E+R,D=g[I];D.kind==="pad"||D.footprint===0||(B_(D)?_(D,R,w):$_(D)&&(v.add(I),p(I,D,R,w,b)))}for(const w of[...s.keys()])v.has(w)||S(w);for(const w of i.values())w.mesh.count=w.count,w.mesh.instanceMatrix.needsUpdate=!0,w.mesh.instanceColor&&(w.mesh.instanceColor.needsUpdate=!0)}function y(M,b){const{width:E,height:P}=M,v=E!==u||P!==d||M.mapRevision!==c,w=M.visualRevision!==l;(v||w)&&(h(M,b),c=M.mapRevision,l=M.visualRevision,u=E,d=P);for(const R of a){const I=s.get(R);I&&X_(I.mesh,b)}}function A(){for(const M of i.values())t.remove(M.mesh),M.mesh.dispose();i.clear();for(const M of s.values())r.remove(M.mesh),M.mesh.traverse(b=>{b instanceof Mt&&b.geometry.dispose()});s.clear(),a.clear(),o.dispose(),q_()}return{group:t,sync:y,dispose:A}}const J_=[4028997,4557390,3567680,4886610],Q_=[2775602,3301432,2377768,3693626],j_=[2776975,3304090,2381184],xl=36,vl=28;function ex(n){return n==="water"?"water":n==="forest"?"forest":n==="empty"?"empty":n==="crossing"?"crossing":n==="bridge"?"bridge":n==="road"||n==="station"?"road":n==="rail"?"rail":"grass"}function rs(n,e){return n<=0?1:Math.max(.12,1-n/e)}function jn(n,e,t){const i=new qt(st,.08,st),r=new sn({color:n,roughness:.92,metalness:.05}),s=new rn(i,r,e);return s.instanceMatrix.setUsage(yn),s.count=0,s.position.y=t,s.frustumCulled=!1,{mesh:s,count:0,capacity:e}}const Sn=new bt;function tx(n){const e=new Pt;e.name="ground";const t=J_.map((ie,ue)=>{const ve=jn(ie,n,0);return ve.mesh.name=`grass-${ue}`,e.add(ve.mesh),ve}),i=Q_.map((ie,ue)=>{const ve=jn(ie,n,.02);return ve.mesh.name=`forest-${ue}`,e.add(ve.mesh),ve}),r=new Ei(.04,.05,.28,5),s=new sn({color:4863264,roughness:.9}),a=new rn(r,s,n*3);a.instanceMatrix.setUsage(yn),a.count=0,a.frustumCulled=!1,e.add(a);const o=new No(.18,.35,6),c=new sn({color:2976568,roughness:.85}),l=new rn(o,c,n*3);l.instanceMatrix.setUsage(yn),l.count=0,l.frustumCulled=!1,e.add(l);const u=j_.map((ie,ue)=>{const ve=jn(ie,n,-.04),be=ve.mesh.material;return be.roughness=.35,be.metalness=.15,be.emissive=new Ye(1056816),be.emissiveIntensity=.15,ve.mesh.name=`water-${ue}`,e.add(ve.mesh),ve}),d=jn(2763317,n,-.02);d.mesh.name="empty",e.add(d.mesh);const f=jn(4868693,n,.05);f.mesh.name="road",e.add(f.mesh);const m=jn(6969928,n,.12);m.mesh.name="bridge",e.add(m.mesh);const _=jn(9075304,n,.22);_.mesh.name="bridge-rail",e.add(_.mesh);const S=new qt(st*.08,.02,st*.5),p=new sn({color:13156464,roughness:.8,emissive:4208640,emissiveIntensity:.35}),h=new rn(S,p,n*4);h.instanceMatrix.setUsage(yn),h.count=0,h.frustumCulled=!1,h.position.y=.1,e.add(h);const y=jn(3814704,n,.04);y.mesh.name="rail-bed",e.add(y.mesh);const A=new qt(st*1.02,.03,.06),M=new sn({color:9079440,metalness:.6,roughness:.4}),b=new rn(A,M,n*4),E=new rn(A,M.clone(),n*4);for(const ie of[b,E])ie.instanceMatrix.setUsage(yn),ie.count=0,ie.frustumCulled=!1,ie.position.y=.09,e.add(ie);const P=new qt(.14,.04,st*.5),g=new sn({color:5914672,roughness:.95}),v=new rn(P,g,n*6);v.instanceMatrix.setUsage(yn),v.count=0,v.frustumCulled=!1,v.position.y=.07,e.add(v);const w=new qt(.18,.16,.18),R=new sn({color:13664304,roughness:.85,emissive:4202496,emissiveIntensity:.25}),I=new rn(w,R,n*2);I.instanceMatrix.setUsage(yn),I.count=0,I.frustumCulled=!1,e.add(I);const D=new qt(st*.7,.04,.05),F=new sn({color:14700624,emissive:6295568,emissiveIntensity:.4,roughness:.6}),L=new rn(D,F,n*2);L.instanceMatrix.setUsage(yn),L.count=0,L.frustumCulled=!1,e.add(L);const q=new Ei(.03,.03,.35,6),B=new sn({color:3355448,roughness:.7}),z=new rn(q,B,n*2);z.instanceMatrix.setUsage(yn),z.count=0,z.frustumCulled=!1,e.add(z);let J=-1,ne=-1,se=0,de=0,Ue=!1,$e=!1;function Ge(){for(const ie of t)ie.count=0;for(const ie of i)ie.count=0;for(const ie of u)ie.count=0;d.count=0,f.count=0,m.count=0,_.count=0,y.count=0,h.count=0,b.count=0,E.count=0,v.count=0,I.count=0,L.count=0,z.count=0,a.count=0,l.count=0}function Z(ie,ue,ve,be=0,Me=1,Le=1){ie.count>=ie.capacity||(Sn.position.set(ue*st,0,ve*st),Sn.rotation.set(0,be,0),Sn.scale.set(Me,1,Le),Sn.updateMatrix(),ie.mesh.setMatrixAt(ie.count++,Sn.matrix))}function ee(ie,ue,ve,be,Me,Le=0,U=0,je=0,He=0,C=1,x=1,k=1){ue.count>=ve||(Sn.position.set(be*st+U,je,Me*st+He),Sn.rotation.set(0,Le,0),Sn.scale.set(C,x,k),Sn.updateMatrix(),ie.setMatrixAt(ue.count++,Sn.matrix))}function ae(ie){Ue=!1;for(let ue=0;ue<ie.length;ue++)if(ie[ue].kind==="crossing"){Ue=!0;break}}function Ne(ie,ue,ve,be,Me){const Le=.55*Me,U=(je,He,C)=>{ee(h,be,n*4,ie,ue,je,He,0,C,1,1,Le)};ve.n&&U(0,0,-.22*Me),ve.s&&U(0,0,.22*Me),ve.e&&U(Math.PI/2,.22*Me,0),ve.w&&U(Math.PI/2,-.22*Me,0)}function Be(ie,ue,ve,be,Me=1){const Le=Qo(ve);if(Le==="L"||Le==="T"||Le==="cross"){Ne(ie,ue,ve,be,Me);return}if(Le==="none"){ee(h,be,n*4,ie,ue,0,0,0,0,1,1,Me);return}const je=Fs(ve)==="x"?Math.PI/2:0;ee(h,be,n*4,ie,ue,je,0,0,0,1,1,Me)}function De(ie,ue,ve,be,Me,Le,U,je,He){ve===0?(ee(b,U,n*4,ie,ue,0,be,0,Me-.12,Le,1,1),ee(E,je,n*4,ie,ue,0,be,0,Me+.12,Le,1,1),Le>.2&&ee(v,He,n*6,ie,ue,0,be,0,Me)):(ee(b,U,n*4,ie,ue,Math.PI/2,be-.12,0,Me,Le,1,1),ee(E,je,n*4,ie,ue,Math.PI/2,be+.12,0,Me,Le,1,1),Le>.2&&ee(v,He,n*6,ie,ue,Math.PI/2,be,0,Me))}function mt(ie,ue,ve,be,Me,Le,U=1){const je=Qo(ve);if(je==="L"||je==="T"||je==="cross"){const C=.5*U,x=.25*U;ve.e&&De(ie,ue,0,x,0,C,be,Me,Le),ve.w&&De(ie,ue,0,-x,0,C,be,Me,Le),ve.s&&De(ie,ue,Math.PI/2,0,x,C,be,Me,Le),ve.n&&De(ie,ue,Math.PI/2,0,-x,C,be,Me,Le);return}if(Fs(ve)==="z"){if(ee(b,be,n*4,ie,ue,Math.PI/2,-.12,0,0,U,1,1),ee(E,Me,n*4,ie,ue,Math.PI/2,.12,0,0,U,1,1),U>.3)for(let C=-1;C<=1;C++)ee(v,Le,n*6,ie,ue,Math.PI/2,0,0,C*.28*U)}else if(ee(b,be,n*4,ie,ue,0,0,0,-.12,U,1,1),ee(E,Me,n*4,ie,ue,0,0,0,.12,U,1,1),U>.3)for(let C=-1;C<=1;C++)ee(v,Le,n*6,ie,ue,0,C*.28*U,0,0)}function We(ie,ue,ve,be,Me){if(ve>=.95)return;const Le=.02*Math.sin(Me*3+ie+ue);ee(I,be,n*2,ie,ue,0,-.2,.12+Le,-.15,1,1,1),ee(I,be,n*2,ie,ue,.4,.18,.1+Le,.2,.8,.8,.8)}function it(ie,ue,ve,be,Me,Le){const U=Fs(ve),je=.15+.85*(.5+.5*Math.sin(be*.7+ie*.3+ue*.2));U==="z"||U==="none"?(ee(z,Le,n*2,ie,ue,0,-.35,.18,0),ee(z,Le,n*2,ie,ue,0,.35,.18,0),ee(L,Me,n*2,ie,ue,0,-.1,.28,0,je,1,1),ee(L,Me,n*2,ie,ue,0,.1,.28,0,je,1,1)):(ee(z,Le,n*2,ie,ue,0,0,.18,-.35),ee(z,Le,n*2,ie,ue,0,0,.18,.35),ee(L,Me,n*2,ie,ue,Math.PI/2,0,.28,-.1,je,1,1),ee(L,Me,n*2,ie,ue,Math.PI/2,0,.28,.1,je,1,1))}function et(ie,ue){const{width:ve,height:be,tiles:Me}=ie,U=ve!==se||be!==de||ie.mapRevision!==J,je=ie.visualRevision!==ne;if(!U&&!je){if(Ue&&!$e){const G={count:0},j={count:0};for(let le=0;le<be;le++)for(let oe=0;oe<ve;oe++){if(Me[le*ve+oe].kind!=="crossing")continue;const re=Ci(Me,oe,le,ve,be,Yi);it(oe,le,re,ue,G,j)}L.count=G.count,L.instanceMatrix.needsUpdate=!0,z.count=j.count,z.instanceMatrix.needsUpdate=!0}for(const G of u){const j=G.mesh.material;j.emissiveIntensity=.12+.08*Math.sin(ue*1.5)}return}U&&ae(Me),$e=ie.constructionIndices.length>0,J=ie.mapRevision,ne=ie.visualRevision,se=ve,de=be,Ge();const He={count:0},C={count:0},x={count:0},k={count:0},H={count:0},$={count:0},ce={count:0},fe={count:0},K={count:0};for(let G=0;G<be;G++)for(let j=0;j<ve;j++){const le=Me[G*ve+j],oe=ex(le.kind);if(oe==="water"){Z(u[le.variant%u.length],j,G);continue}if(oe==="empty"){Z(d,j,G);continue}if(oe==="forest"){Z(i[le.variant%i.length],j,G);const re=2+le.variant%2;for(let Ee=0;Ee<re;Ee++){const Pe=(Ee*.37+le.variant*.11)%.7-.35,Fe=(Ee*.53+le.variant*.07)%.7-.35;ee(a,fe,n*3,j,G,0,Pe,.14,Fe),ee(l,K,n*3,j,G,0,Pe,.38,Fe)}continue}if(oe==="bridge"){Z(u[0],j,G);const re=rs(le.construction,vl);Z(m,j,G,0,re,re);const Ee=Ci(Me,j,G,ve,be,Yi);Be(j,G,Ee,He,re),Z(_,j,G,0,.95,.12),Z(_,j,G,0,.12,.95);const Pe=Ci(Me,j,G,ve,be,jo);if(Tl(Pe)>0){const Fe=rs(le.construction,xl);mt(j,G,Pe,C,x,k,Fe)}le.construction>0&&We(j,G,re,H,ue);continue}if(Z(t[le.variant%t.length],j,G),oe==="road"||oe==="crossing"||le.kind==="station"){const re=rs(le.construction,vl);Z(f,j,G,0,Math.max(.4,re),Math.max(.4,re));const Ee=Ci(Me,j,G,ve,be,Yi);Be(j,G,Ee,He,re),le.construction>0&&le.kind==="road"&&We(j,G,re,H,ue)}if(oe==="rail"||oe==="crossing"||le.kind==="station"){const re=rs(le.construction,xl);le.kind==="rail"&&Z(y,j,G,0,Math.max(.35,re),Math.max(.35,re));const Ee=Ci(Me,j,G,ve,be,jo);mt(j,G,Ee,C,x,k,re),le.construction>0&&(le.kind==="rail"||le.kind==="crossing")&&We(j,G,re,H,ue)}if(oe==="crossing"){const re=Ci(Me,j,G,ve,be,Yi);it(j,G,re,ue,$,ce)}}for(const G of t)G.mesh.count=G.count,G.mesh.instanceMatrix.needsUpdate=!0;for(const G of i)G.mesh.count=G.count,G.mesh.instanceMatrix.needsUpdate=!0;for(const G of u)G.mesh.count=G.count,G.mesh.instanceMatrix.needsUpdate=!0;d.mesh.count=d.count,d.mesh.instanceMatrix.needsUpdate=!0,f.mesh.count=f.count,f.mesh.instanceMatrix.needsUpdate=!0,m.mesh.count=m.count,m.mesh.instanceMatrix.needsUpdate=!0,_.mesh.count=_.count,_.mesh.instanceMatrix.needsUpdate=!0,y.mesh.count=y.count,y.mesh.instanceMatrix.needsUpdate=!0,a.count=fe.count,a.instanceMatrix.needsUpdate=!0,l.count=K.count,l.instanceMatrix.needsUpdate=!0,h.count=He.count,h.instanceMatrix.needsUpdate=!0,b.count=C.count,b.instanceMatrix.needsUpdate=!0,E.count=x.count,E.instanceMatrix.needsUpdate=!0,v.count=k.count,v.instanceMatrix.needsUpdate=!0,I.count=H.count,I.instanceMatrix.needsUpdate=!0,L.count=$.count,L.instanceMatrix.needsUpdate=!0,z.count=ce.count,z.instanceMatrix.needsUpdate=!0}function Ke(){e.traverse(ie=>{ie instanceof rn&&(ie.geometry.dispose(),Array.isArray(ie.material)?ie.material.forEach(ue=>ue.dispose()):ie.material.dispose())})}return{group:e,sync:et,dispose:Ke}}const Ml=[14700624,5275872,14729280,5292144,12607712,14712896],bs=new Map;function Vt(n,e,t={}){let i=bs.get(n);return i||(i=new sn({color:e,roughness:.55,metalness:.25,...t}),bs.set(n,i)),i}function jt(n,e,t,i,r=e/2){const s=new Mt(new qt(n,e,t),i);return s.position.y=r,s}function nx(n){const e=new Pt,t=jt(.38,.12,.22,Vt(`car-${n}`,n),.1);e.add(t);const i=jt(.2,.1,.2,Vt(`cabin-${n}`,n,{roughness:.4}),.2);i.position.x=-.02,e.add(i);const r=jt(.16,.08,.18,Vt("glass",10537192,{transparent:!0,opacity:.65,metalness:.3,roughness:.2,emissive:2113632,emissiveIntensity:.15}),.2);r.position.x=.06,e.add(r);const s=Vt("wheel",1710618,{roughness:.9});for(const[a,o]of[[-.12,.12],[.12,.12],[-.12,-.12],[.12,-.12]]){const c=new Mt(new Ei(.05,.05,.04,8),s);c.rotation.z=Math.PI/2,c.position.set(a,.05,o),e.add(c)}return e}function ix(n){const e=new Pt,t=jt(.55,.22,.24,Vt(`bus-${n}`,n),.16);e.add(t);const i=jt(.52,.04,.25,Vt("bus-stripe",15790320),.14);e.add(i);for(let r=-2;r<=2;r++){const s=jt(.07,.08,.02,Vt("bus-win",8433888,{emissive:4219008,emissiveIntensity:.3,transparent:!0,opacity:.8}),.22);s.position.set(r*.09,0,.13),e.add(s)}return e}function rx(n){const e=new Pt,t=jt(.22,.18,.22,Vt(`truck-cab-${n}`,n),.16);t.position.x=.14,e.add(t);const i=jt(.32,.2,.24,Vt("cargo",6974064,{roughness:.7}),.18);i.position.x=-.12,e.add(i);const r=jt(.02,.1,.18,Vt("truck-glass",10537192,{transparent:!0,opacity:.7}),.2);return r.position.set(.26,0,0),e.add(r),e}function sx(n,e){const t=new Pt,i=n?3824266:13684952,r=jt(.42,.18,.22,Vt(`train-${n}-${e}`,i,{metalness:.35,roughness:.45}),.16);if(t.add(r),n){const a=jt(.12,.14,.2,Vt("engine-nose",2771578),.14);a.position.x=.24,t.add(a);const o=new Mt(new Pr(.04,6,6),Vt("headlight",16769152,{emissive:16760896,emissiveIntensity:1}));o.position.set(.32,.14,0),o.userData.headlight=!0,t.add(o)}else{const a=jt(.28,.08,.02,Vt("train-win",6590664,{emissive:3166320,emissiveIntensity:.4,transparent:!0,opacity:.75}),.2);a.position.z=.12,t.add(a)}const s=jt(.06,.04,.04,Vt("coupler",4473928),.1);return s.position.x=-.24,t.add(s),t}function ax(n,e,t){const i=Ml[e%Ml.length];if(n==="bus")return ix(i);if(n==="truck")return rx(i);if(n==="train"){const r=new Pt;r.userData.isTrain=!0;const s=t??4;for(let a=0;a<s;a++){const o=sx(a===0,a);o.userData.carIndex=a,r.add(o)}return r}return nx(i)}function ox(){const n=new Pt;n.name="vehicles";const e=new Map;function t(r,s){const a=new Set;for(const o of r){a.add(o.id);let c=e.get(o.id);if(c||(c=ax(o.kind,o.color,o.cars),c.userData.id=o.id,e.set(o.id,c),n.add(c)),o.kind==="train"&&o.carPoses&&o.carPoses.length>0){c.position.set(0,0,0),c.rotation.set(0,0,0);const l=c.children;for(let u=0;u<l.length;u++){const d=l[u],f=o.carPoses[u]??o.carPoses[o.carPoses.length-1];d.position.set(f.x*st,.02,f.y*st),d.rotation.y=-f.dir}}else c.position.set(o.x*st,.02,o.y*st),c.rotation.y=-o.dir;c.traverse(l=>{if(l.userData.headlight){const u=Math.sin(s*8)>0,d=l.material;d.emissiveIntensity=u?1.4:.2}})}for(const[o,c]of e)a.has(o)||(n.remove(c),c.traverse(l=>{l instanceof Mt&&l.geometry.dispose()}),e.delete(o))}function i(){for(const r of e.values())n.remove(r),r.traverse(s=>{s instanceof Mt&&s.geometry.dispose()});e.clear();for(const r of bs.values())r.dispose();bs.clear()}return{group:n,sync:t,dispose:i}}function cx(n=128,e=128){const t=new Pt;t.name="world";const i=tx(n*e);t.add(i.group);const r=Z_(n*e);t.add(r.group);const s=ox();t.add(s.group);function a(c,l){i.sync(c,l),r.sync(c,l),s.sync(c.vehicles,l)}function o(){i.dispose(),r.dispose(),s.dispose()}return{root:t,sync:a,dispose:o}}function lx(n){const e=new v_({canvas:n,antialias:!0,alpha:!1,powerPreference:"high-performance"});e.setPixelRatio(Math.min(window.devicePixelRatio||1,1.25)),e.outputColorSpace=Xt,e.toneMapping=yo,e.toneMappingExposure=1.55;const t=new Qd;D_(t);let i=1;const r=b_(i),s=cx(128,128);t.add(s.root);let a=1,o=1;function c(p,h){a=Math.max(1,p),o=Math.max(1,h),i=a/o,e.setSize(a,o,!1),gr(r,i),Wi(r)}function l(p,h,y){gl(r,p,y),gr(r,i),Wi(r),s.sync(p,h),e.render(t,r.camera)}function u(p,h,y){gl(r,p,y),gr(r,i),Wi(r);const A=performance.now();s.sync(p,h);const M=performance.now();e.render(t,r.camera);const b=performance.now();return{syncMs:M-A,drawMs:b-M,calls:e.info.render.calls}}function d(p,h,y){T_(r,p,h,y),Wi(r)}function f(p){A_(r,p),gr(r,i),Wi(r)}function m(p){P_(r,p.width,p.height),I_(r,p),gr(r,i),Wi(r)}function _(){return w_(r)}function S(){s.dispose(),e.dispose()}return{render:l,renderTimed:u,resize:c,pan:d,zoom:f,resetCamera:m,consumeFocusAnnounce:_,dispose:S,canvas:n}}function xr(n,e,t){return`<div class="bar"><div class="bar-fill" style="width:${Math.max(0,Math.min(100,n/e*100))}%;background:${t}"></div></div>`}function Nn(n){return Math.round(n).toLocaleString("ja-JP")}function ux(n,e,t){const{paused:i,speed:r,panelOpen:s}=t,a=`
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
        <span class="stage-label" id="hud-stage">${wl(n)}</span>
        <span class="day" id="hud-day">Day ${e}</span>
      </div>
    </header>
    ${o}
  `}function Sl(n,e,t){const i=n.querySelector("#hud-stage");i&&(i.textContent=wl(t));const r=n.querySelector("#hud-day");r&&(r.textContent=`Day ${e.day}`);const s=n.querySelector(".stage-badge");s&&s.setAttribute("data-stage",t);const a=n.querySelector("#stats-list");a&&(a.innerHTML=`
        <div class="stat">
          <dt>人口</dt>
          <dd>${Nn(e.population)} <span class="muted">/ 住宅 ${Nn(e.housing)}</span></dd>
          ${xr(e.population,Math.max(e.housing,1),"var(--color-accent)")}
        </div>
        <div class="stat">
          <dt>雇用</dt>
          <dd>${Nn(e.jobs)}</dd>
          ${xr(e.jobs,Math.max(e.population*.7,1),"var(--color-success)")}
        </div>
        <div class="stat">
          <dt>交通</dt>
          <dd>${Nn(e.transport)}</dd>
          ${xr(e.transport,Math.max(e.population/8,20),"#6ec8ff")}
        </div>
        <div class="stat">
          <dt>教育</dt>
          <dd>${Nn(e.education)}</dd>
          ${xr(e.education,100,"#e0c060")}
        </div>
        <div class="stat">
          <dt>幸福度</dt>
          <dd>${Nn(e.happiness)}</dd>
          ${xr(e.happiness,100,"#ff8ab0")}
        </div>
        <div class="stat">
          <dt>予算</dt>
          <dd class="${e.budget<0?"danger":""}">¥${Nn(e.budget)}${e.budget<0?' <span class="muted">（借入）</span>':""}</dd>
        </div>
        <div class="stat row">
          <div><dt>商業</dt><dd>${Nn(e.commerce)}</dd></div>
          <div><dt>産業</dt><dd>${Nn(e.industry)}</dd></div>
        </div>`)}function fx(n,e){const t=n.querySelector('button[data-action="pause"]');t&&(t.textContent=e.paused?"再開":"一時停止");const i=n.querySelector('button[data-action="speed"]');i&&(i.textContent=`速度 ×${e.speed}`)}const ss=[1,2,4],as=128,dx=2.8;function hx(n){n.innerHTML=`
    <div class="app">
      <div class="hud" id="hud"></div>
      <canvas id="city-canvas"></canvas>
      <div class="toast" id="toast" hidden></div>
      <div class="perf" id="perf" title="P キーで表示切替">…</div>
    </div>
  `;const e=n.querySelector("#city-canvas"),t=n.querySelector("#hud"),i=n.querySelector("#toast"),r=n.querySelector("#perf"),s=lx(e),a=ed();let o=!0,c=dc({seed:Date.now()%1e5,width:as,height:as});s.resetCamera(c);let l=!1,u=0,d=!0,f=!0;const m=dx;let _=performance.now(),S=0,p=0,h=0,y=0,A=!1,M=0,b=0;function E(){const D=window.innerWidth,F=window.innerHeight;e.style.width=`${D}px`,e.style.height=`${F}px`,s.resize(D,F)}function P(){const D=t.querySelector(".panel-body"),F=(D==null?void 0:D.scrollTop)??0;t.innerHTML=ux(c.stage,c.stats.day,{paused:l,speed:ss[u],panelOpen:d}),Sl(t,c.stats,c.stage);const L=t.querySelector(".panel-body");L&&(L.scrollTop=F),f=!1}function g(D=!1){if(D||f){P();return}Sl(t,c.stats,c.stage),fx(t,{paused:l,speed:ss[u]})}function v(D){i.hidden=!1,i.textContent=D,h=2.2}const w={residential:"新しい住宅が建った",commercial:"商店がオープン",industrial:"工場が稼働開始",road:"道路が延伸",rail:"線路が敷設された","intercity-rail":"都市間鉄道が開通した",crossing:"踏切ができた",school:"学校が開校",park:"公園が整備された",hospital:"病院が完成",tower:"高層マンションが建った","tower-2x2":"大型タワーが街区を占めた",station:"駅が開業",plaza:"広場ができた",skyscraper:"超高層ビルがそびえる","skyscraper-2x2":"巨大な超高層が街区に建った",demolish:"再開発で道路を通した",upgrade:"建物がグレードアップ",merge:"近くの町がひとつになった",bridge:"橋が架かった"};function R(D){a.beginFrame(D);const F=Math.min(.05,(D-_)/1e3);_=D;const L=l?0:F*ss[u];if(S+=F,L>0){const z=c.stage,J=performance.now(),ne=jf(c,L,m);a.markSim(performance.now()-J),c=ne.state;for(const se of ne.events){const de=w[se];de&&v(de)}z!==c.stage&&v(`街が「${I(c.stage)}」に成長した`)}else a.markSim(0);const q=s.renderTimed(c,S,F);a.markSync(q.syncMs),a.markDraw(q.drawMs);const B=s.consumeFocusAnnounce();if(B&&v(`${B}を眺める`),p-=F,p<=0&&(g(),p=.25),y-=F,o&&y<=0){const z=a.snapshot();r.hidden=!1,r.textContent=td(z,{calls:q.calls,vehicles:c.vehicles.length}),y=.25}else o||(r.hidden=!0);h>0&&(h-=F,h<=0&&(i.hidden=!0)),requestAnimationFrame(R)}function I(D){return{village:"小さな村",town:"町",city:"都市",metropolis:"大都会"}[D]}t.addEventListener("click",D=>{const F=D.target.closest("button[data-action]");if(!F)return;const L=F.dataset.action;L==="toggle-panel"?(d=!d,f=!0,g(!0)):L==="pause"?(l=!l,g()):L==="speed"?(u=(u+1)%ss.length,g()):L==="reset"&&(c=dc({seed:Date.now()%1e5,width:as,height:as}),s.resetCamera(c),v("新しい街が始まった"),f=!0,g(!0))}),window.addEventListener("keydown",D=>{(D.key==="p"||D.key==="P")&&(o=!o,r.hidden=!o)}),e.addEventListener("pointerdown",D=>{A=!0,M=D.clientX,b=D.clientY,e.setPointerCapture(D.pointerId)}),e.addEventListener("pointermove",D=>{if(!A)return;const F=D.clientX-M,L=D.clientY-b;M=D.clientX,b=D.clientY,s.pan(F,L,window.innerHeight)}),e.addEventListener("pointerup",()=>{A=!1}),e.addEventListener("pointercancel",()=>{A=!1}),e.addEventListener("wheel",D=>{D.preventDefault();const F=D.deltaY>0?.92:1.08;s.zoom(F)},{passive:!1}),window.addEventListener("resize",E),E(),g(!0),v("小さな村から、物語が始まる"),requestAnimationFrame(R)}const yl=document.querySelector("#app");yl&&hx(yl);

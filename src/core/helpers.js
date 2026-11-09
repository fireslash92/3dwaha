// أدوات عامة: ثوابت، أرقام عربية، دوال رسم أساسية
'use strict';

/* =========================================================
   Core constants & helpers
   ========================================================= */
const SPEED=118, HERO_R=7, NPC_R=8, TALK_RANGE=50, TAU=Math.PI*2;
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const AR=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
function mulberry(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function rr(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();}
function ell(g,x,y,rx,ry){g.beginPath();g.ellipse(x,y,rx,ry,0,0,TAU);}
function circ(g,x,y,r){g.beginPath();g.arc(x,y,r,0,TAU);g.fill();}
function poly(g,p){g.beginPath();g.moveTo(p[0],p[1]);for(let i=2;i<p.length;i+=2)g.lineTo(p[i],p[i+1]);g.closePath();g.fill();}
function softShadow(g,x,y,rx,ry,a){g.save();g.translate(x,y);g.scale(1,ry/rx);const gr=g.createRadialGradient(0,0,0,0,0,rx);gr.addColorStop(0,`rgba(28,30,12,${a})`);gr.addColorStop(.6,`rgba(28,30,12,${a*.6})`);gr.addColorStop(1,'rgba(28,30,12,0)');g.fillStyle=gr;g.fillRect(-rx,-rx,rx*2,rx*2);g.restore();}

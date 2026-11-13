// عناصر الصفحة ومقاس الشاشة
'use strict';

/* =========================================================
   DOM & VIEW
   ========================================================= */
const $=id=>document.getElementById(id);
const gameEl=$('game'),canvas=$('view'),ctx=canvas.getContext('2d');
const zone=$('stickZone'),base=$('stickBase'),knob=$('stickKnob'),actBtn=$('actBtn');
const dlg=$('dialog'),dlgText=$('dlgText'),dlgName=$('dlgName'),dlgNext=$('dlgNext'),dotsEl=$('dlgDots');
const toastEl=$('toast'),titleEl=$('title'),startBtn=$('startBtn'),fadeEl=$('fade');
const hud=$('hud'),hudLabel=$('hudLabel'),hudCount=$('hudCount'),chapterEl=$('chapter'),chapterBtn=$('chapterBtn');
const view={w:0,h:0,dpr:1,zoom:1,S:0,camX:0,camY:0,vig:null,warm:null};
const insets={t:0,r:0,b:0,l:0};
const probe=document.createElement('div');
probe.style.cssText='position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)';
document.body.appendChild(probe);
function readInsets(){const cs=getComputedStyle(probe);insets.t=parseFloat(cs.paddingTop)||0;insets.r=parseFloat(cs.paddingRight)||0;insets.b=parseFloat(cs.paddingBottom)||0;insets.l=parseFloat(cs.paddingLeft)||0;}

let rebuildTimer=0;
function resize(){
  if(typeof OPT==="undefined")return; // a viewport event can fire while later scripts are still loading
  readInsets();
  const w=Math.max(1,gameEl.clientWidth),h=Math.max(1,gameEl.clientHeight);
  view.w=w;view.h=h;view.dpr=Math.min(window.devicePixelRatio||1,OPT.quality==='saver'?1.25:2);
  view.zoom=clamp(Math.min(w,h)/330,.9,2.6);
  view.zoom=Math.max(view.zoom,w/VW,h/VH);
  canvas.width=Math.round(w*view.dpr);canvas.height=Math.round(h*view.dpr);
  const S=Math.min(view.zoom*view.dpr,2.5,Math.sqrt(12e6/(VW*VH)));
  const build=()=>{view.S=S;SPR=buildSprites(S);ensureScene(scene);};
  if(!SPR)build();
  else if(Math.abs(S-view.S)>.05){clearTimeout(rebuildTimer);rebuildTimer=setTimeout(build,140);}
  const vg=ctx.createRadialGradient(w/2,h/2,Math.min(w,h)*.35,w/2,h/2,Math.hypot(w,h)*.62);
  vg.addColorStop(0,'rgba(40,20,6,0)');vg.addColorStop(1,'rgba(40,20,6,.34)');view.vig=vg;
  const wm=ctx.createLinearGradient(0,0,w*.7,h);wm.addColorStop(0,'rgba(255,196,120,.13)');wm.addColorStop(1,'rgba(255,196,120,0)');view.warm=wm;
  stickHome(true);
  glResize();
  if(B){B.bg=null;layoutEnemies();}
}

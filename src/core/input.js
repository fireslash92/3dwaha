// العصا والأزرار ولوحة المفاتيح
'use strict';

/* =========================================================
   INPUT
   ========================================================= */
const stick={active:false,id:null,cx:0,cy:0,dx:0,dy:0,R:46};
function stickHome(instant){
  const zr=zone.getBoundingClientRect(),half=base.offsetWidth/2||62;
  const x=OPT.hand==='right'?zr.width-(insets.r+26+half):insets.l+26+half,y=zr.height-(insets.b+24+half);
  base.classList.toggle('returning',!instant);
  base.style.transform=`translate(${x}px,${y}px)`;
  knob.style.transform='translate(0px,0px)';
}
function stickMove(e){
  const zr=zone.getBoundingClientRect();
  let dx=e.clientX-zr.left-stick.cx,dy=e.clientY-zr.top-stick.cy;
  const d=Math.hypot(dx,dy);if(d>stick.R){dx*=stick.R/d;dy*=stick.R/d;}
  knob.style.transform=`translate(${dx}px,${dy}px)`;
  stick.dx=dx/stick.R;stick.dy=dy/stick.R;
}
function releaseStick(){stick.active=false;stick.id=null;stick.dx=stick.dy=0;stickHome(false);}
zone.addEventListener('pointerdown',e=>{
  e.preventDefault();
  if(state!=='play'||stick.active)return;
  const zr=zone.getBoundingClientRect(),half=base.offsetWidth/2||62;
  stick.active=true;stick.id=e.pointerId;
  try{zone.setPointerCapture(e.pointerId);}catch(_){}
  stick.cx=clamp(e.clientX-zr.left,half+6,zr.width-half-6);
  stick.cy=clamp(e.clientY-zr.top,half+6,zr.height-half-6);
  base.classList.remove('returning');
  base.style.transform=`translate(${stick.cx}px,${stick.cy}px)`;
  stickMove(e);
});
zone.addEventListener('pointermove',e=>{if(stick.active&&e.pointerId===stick.id){e.preventDefault();stickMove(e);}});
['pointerup','pointercancel','lostpointercapture'].forEach(n=>zone.addEventListener(n,e=>{if(e.pointerId===stick.id)releaseStick();}));
function resetInput(){if(stick.active||stick.dx||stick.dy)releaseStick();keys.up=keys.down=keys.left=keys.right=false;hero.moving=false;}

actBtn.addEventListener('pointerdown',e=>{e.preventDefault();actBtn.classList.add('down');fishHold=true;act();});
['pointerup','pointercancel','pointerleave'].forEach(n=>actBtn.addEventListener(n,()=>{actBtn.classList.remove('down');fishHold=false;}));
let nextArmed=false;
dlgNext.addEventListener('pointerdown',e=>{e.preventDefault();nextArmed=true;});
dlgNext.addEventListener('pointerup',e=>{e.preventDefault();if(nextArmed&&state==='dialog')advance();nextArmed=false;});
dlgNext.addEventListener('pointercancel',()=>{nextArmed=false;});
startBtn.addEventListener('click',()=>{if(state!=='title')return;if(savedData){if(startBtn.dataset.confirm!=='1'){startBtn.dataset.confirm='1';startBtn.textContent='اضغط مرة أخرى لمسح التقدم';return;}startBtn.dataset.confirm='';resetWorld();}startGame();});
chapterBtn.addEventListener('click',()=>closeChapter());

const KEYMAP={ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right'};
window.addEventListener('keydown',e=>{
  lastInputKeyboard=true;
  if(state==='shop'&&(e.code==='Escape'||e.code==='KeyM')){e.preventDefault();closeShop();return;}
  if(state==='fish'&&(e.code==='Escape'||e.code==='KeyM')){e.preventDefault();endFishing('أعدت السنارة',1.4);return;}
  if(e.code==='Escape'||e.code==='KeyM'){e.preventDefault();if(state==='menu')closeMenu();else if(state==='play')openMenu();return;}
  if(state==='menu'||state==='battle'||state==='shop')return;
  const k=KEYMAP[e.code];
  if(k){e.preventDefault();if(state==='play')keys[k]=true;return;}
  if(e.code==='KeyE'||e.code==='Space'||e.code==='Enter'||e.code==='NumpadEnter'){
    e.preventDefault();fishHold=true;if(e.repeat)return;
    if(state==='title')startGame();else if(state==='chapter')closeChapter();else act();
  }
});
window.addEventListener('keyup',e=>{const k=KEYMAP[e.code];if(k)keys[k]=false;if(e.code==='KeyE'||e.code==='Space'||e.code==='Enter'||e.code==='NumpadEnter')fishHold=false;});
window.addEventListener('blur',resetInput);
window.addEventListener('pagehide',()=>{resetInput();saveGame();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){resetInput();saveGame();SFX.suspend();}else{last=performance.now();SFX.unlock();}});
document.addEventListener('touchmove',e=>{if(e.target.closest&&e.target.closest('.scroll,.tabs-scroll'))return;e.preventDefault();},{passive:false});
['gesturestart','gesturechange','gestureend'].forEach(n=>document.addEventListener(n,e=>e.preventDefault(),{passive:false}));
document.addEventListener('dblclick',e=>e.preventDefault(),{passive:false});
document.addEventListener('contextmenu',e=>e.preventDefault());
window.addEventListener('resize',resize);
window.addEventListener('orientationchange',()=>setTimeout(resize,250));
if(window.visualViewport)window.visualViewport.addEventListener('resize',resize);

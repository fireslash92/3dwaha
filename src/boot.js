// التشغيل
'use strict';

/* =========================================================
   LOOP & BOOT
   ========================================================= */
let last=performance.now();
function frame(now){
  const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;
  update(dt);render();drawTransition();SFX.tick(dt);drawMini();
  requestAnimationFrame(frame);
}
function start(data){
  data=data||{};
  Object.assign(OPT,load(OPT_KEY)||{});applyOptions();
  glInit();resize();ensureScene(scene);
  view.camX=576-view.w/view.zoom/2;view.camY=430-view.h/view.zoom/2;
  savedData=load(SAVE_KEY);
  if(data.started){applySave(data);startGame(true);titleEl.hidden=true;}
  else if(savedData&&savedData.started){continueBtn.hidden=false;startBtn.textContent='رحلة جديدة';startBtn.classList.add('ghost');}
  updateHud(false);
  requestAnimationFrame(t=>{last=t;requestAnimationFrame(frame);});
}
window.claude?.hot?.snapshot?.(()=>snapshot());
window.__game={get state(){return state;},get scene(){return scene.id;},get target(){return target;},get met(){return met.size;},get quest(){return questStarted;},get chapter(){return chapterDone;},
  hero,keys,NPCS,MAP,SCENES,resolve,act,collidersFor,drawPerson,drawHero,LOOKS,openMenu,closeMenu,stat,heroSpeed,startEncounter,get B(){return B;},FOREST,setChapter(v){chapterDone=v;questStarted=true;syncAisha();},FORT,WADI,get gateSeq(){return gateSeq;},openGate,nightAmount,SFX,get FG(){return FG;},petStats,activePet,get ARENA_RUN(){return ARENA_RUN;},startArena,get DIVE(){return DIVE;},startDive,AREAS,enterArea,openWorldMap,travelTo,PLACES,ENEMIES,levelOf,LEVELS,gearId,canWear,marketDay,marketOpen,haggleState,haggleOffer,STALLS,get RACE(){return RACE;},get time(){return time;},startRace,racePress,MUBARAK,openShop,setHold(v){fishHold=v;},fishWater,achUnlock,ACH,WX,wxNow,wxPlan,get P(){return P;},OPT,get toast(){return toastKey;},get view(){return view;},
  step(dt,n=1){for(let i=0;i<n;i++)update(dt);}};
window.claude?.hot?.ready ? window.claude.hot.ready(start) : start(window.claude?.hot?.data ?? {});

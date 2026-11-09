// الإعدادات والحفظ
'use strict';

/* =========================================================
   OPTIONS & SAVE
   ========================================================= */
const OPT={text:'normal',controls:'normal',hand:'left',camera:'smooth',quality:'high',hud:'show',sound:'on',volume:'mid',ambient:'on',music:'on',minimap:'show',encounters:'normal',bspeed:'normal',weather:'on',shake:matchMedia('(prefers-reduced-motion: reduce)').matches?'off':'on'};
const SAVE_KEY='ayn-alwadi-save-v1',OPT_KEY='ayn-alwadi-options-v1';
function store(k,v){try{if(v==null)localStorage.removeItem(k);else localStorage.setItem(k,JSON.stringify(v));return true;}catch(_){return false;}}
function load(k){try{const v=localStorage.getItem(k);return v?JSON.parse(v):null;}catch(_){return null;}}
function applyOptions(){
  gameEl.classList.toggle('big-text',OPT.text==='large');
  gameEl.classList.toggle('big-controls',OPT.controls==='large');
  gameEl.classList.toggle('swap',OPT.hand==='right');
  gameEl.classList.toggle('hide-hud',OPT.hud==='hide');
  gameEl.classList.toggle('hide-mini',OPT.minimap==='hide');
  SFX.applyVolume();
  store(OPT_KEY,OPT);
}
function snapshot(){return {v:1,x:hero.x,y:hero.y,dir:hero.dir,scene:scene.id,met:[...met],talked:Object.fromEntries(NPCS.map(n=>[n.id,n.talked])),quest:questStarted,chapter:chapterDone,P,started:state!=='title'};}
let lastSave=0,savedData=null;
function saveGame(){if(state==='title')return false;lastSave=time;return store(SAVE_KEY,snapshot());}
function applySave(d){
  const f=freshProgress();
  NPCS.forEach(n=>{n.slotKey=null;n.route=null;});lifeReady=false;
  P=f;
  if(d.P){P.xp=+d.P.xp||0;P.hp=d.P.hp??null;P.mp=d.P.mp??null;P.inv=Object.assign({},d.P.inv||f.inv);P.eq=Object.assign(f.eq,d.P.eq||{});P.gifts=Object.assign({},d.P.gifts||{});P.gauge=+d.P.gauge||0;P.flags=Object.assign({},d.P.flags||{});P.ally=Object.assign({hp:null,mp:null},d.P.ally||{});P.money=typeof d.P.money==='number'?d.P.money:(d.chapter?200:50);P.kills=Object.assign({},d.P.kills||{});P.q=JSON.parse(JSON.stringify(d.P.q||{}));P.clock=typeof d.P.clock==='number'?d.P.clock:540;P.lore=JSON.parse(JSON.stringify(d.P.lore||{}));}
  for(const sl in P.eq)if(P.eq[sl]&&!ITEMS[P.eq[sl]])P.eq[sl]=null;
  met.clear();(d.met||[]).forEach(id=>{if(VILLAGERS.some(n=>n.id===id))met.add(id);});
  NPCS.forEach(n=>{n.talked=(d.talked&&+d.talked[n.id])||(met.has(n.id)?1:0);});
  questStarted=!!d.quest;chapterDone=!!d.chapter;if(questStarted)SALEM.talked=Math.max(SALEM.talked,1);
  scene=SCENES[d.scene]||SCENES.village;ensureScene(scene);
  if(typeof d.x==='number'){const p=resolve(d.x,d.y,HERO_R,scene.colliders,scene.W,scene.H);hero.x=p.x;hero.y=p.y;hero.dir=d.dir||'down';}
  syncAisha();snapCamera();resetTrail();updateHud(false);
}
function resetWorld(){
  P=freshProgress();met.clear();questStarted=false;chapterDone=false;doorHintShown=false;toastQ.length=0;
  NPCS.forEach(n=>{n.x=n.home.x;n.y=n.home.y;n.dir=n.home.dir;n.scene=n.home.scene;n.talked=0;n.target=null;n.moving=false;n.slotKey=null;n.route=null;});lifeReady=false;
  scene=SCENES.village;ensureScene(scene);hero.x=MAP.heroSpawn.x;hero.y=MAP.heroSpawn.y;hero.dir='up';
  store(SAVE_KEY,null);savedData=null;updateHud(false);$('menuDot').hidden=true;
}

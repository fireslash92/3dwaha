// تحديث كل إطار
'use strict';

/* =========================================================
   UPDATE
   ========================================================= */
function inputVector(){
  let x=0,y=0;
  if(stick.active){x=stick.dx;y=stick.dy;}
  const kx=(keys.right?1:0)-(keys.left?1:0),ky=(keys.down?1:0)-(keys.up?1:0);
  if(kx||ky){x=kx;y=ky;}
  const m=Math.hypot(x,y);
  if(m<(stick.active&&!(kx||ky)?.22:.5))return null;
  return {x:x/m,y:y/m};
}
function chooseDir(v,cur){
  const ax=Math.abs(v.x),ay=Math.abs(v.y);
  if(ax>ay*1.2)return v.x>0?'right':'left';
  if(ay>ax*1.2)return v.y>0?'down':'up';
  const h=v.x>0?'right':'left',vv=v.y>0?'down':'up';
  return cur===h||cur===vv?cur:(ax>=ay?h:vv);
}
function collidersFor(who){
  const list=scene.colliders.filter(c=>!(c.tag==='barricade'&&chapterDone)&&!(c.tag==='eastgate'&&P.flags.ch3)&&!(c.tag==='rockfall'&&P.flags.ch4)&&!(c.tag==='innergate'&&P.flags.gateopen));
  for(const n of NPCS)if(n!==who&&n.scene===scene.id)list.push({t:'c',x:n.x,y:n.y-1,r:NPC_R});
  if(who!==hero)list.push({t:'c',x:hero.x,y:hero.y,r:HERO_R});
  return list;
}
function updateNpc(n,dt){
  if(state!=='play'){n.moving=false;return;}
  const dh=Math.hypot(hero.x-n.x,hero.y-n.y);
  if(n.wander){
    if(dh<64){n.moving=false;n.dir=face(n,hero);return;}
    if(n.pause>0){n.pause-=dt;n.moving=false;return;}
    if(!n.target){
      const w=n.wander;
      for(let i=0;i<12;i++){const tx=w.x0+Math.random()*(w.x1-w.x0),ty=w.y0+Math.random()*(w.y1-w.y0),q=resolve(tx,ty,NPC_R+2,scene.colliders,scene.W,scene.H);if(Math.hypot(q.x-tx,q.y-ty)<.5){n.target={x:tx,y:ty};break;}}
      if(!n.target){n.pause=1;return;}
    }
    const dx=n.target.x-n.x,dy=n.target.y-n.y,d=Math.hypot(dx,dy);
    if(d<3){n.target=null;n.pause=1+Math.random()*2.5;n.moving=false;return;}
    const step=Math.min(d,n.wander.speed*dt),p=resolve(n.x+dx/d*step,n.y+dy/d*step,NPC_R,collidersFor(n),scene.W,scene.H);
    const moved=Math.hypot(p.x-n.x,p.y-n.y);n.x=p.x;n.y=p.y;
    n.dir=chooseDir({x:dx/d,y:dy/d},n.dir);n.moving=true;n.phase+=dt*10;
    if(moved<step*.35){n.stuck+=dt;if(n.stuck>.5){n.target=null;n.pause=.4;n.stuck=0;}}else n.stuck=0;
    return;
  }
  n.moving=false;
  if(dh<90)n.dir=face(n,hero);
  else if(time>n.lookAt){const d=n.idleDirs||['down','left','down','right','down'];n.dir=d[(Math.random()*d.length)|0];n.lookAt=time+2.5+Math.random()*3;}
}
function findTarget(){
  let best=null,bd=TALK_RANGE;
  for(const n of NPCS){if(n.scene!==scene.id)continue;const d=Math.hypot(hero.x-n.x,hero.y-n.y);if(d<bd){bd=d;best={kind:'npc',npc:n,x:n.x,y:n.y+(n.look.child?6:0)};}}
  if(best)return best;
  for(const p of PICKUPS)if(p.scene===scene.id&&pickupActive(p)&&Math.hypot(hero.x-p.x,hero.y-p.y)<36)return {kind:'pickup',p,x:p.x,y:p.y-10};
  if(scene.fort)return fortTarget();
  if(scene.forest){if(Math.hypot(hero.x-STONE.x,hero.y-STONE.y)<52)return {kind:'npc',npc:STONE,x:STONE.x,y:STONE.y-6};return null;}
  if(scene.wadi){
    if(Math.hypot(hero.x-SIGN.x,hero.y-SIGN.y)<46)return {kind:'npc',npc:SIGN,x:SIGN.x,y:SIGN.y+6};
    if(Math.hypot(hero.x-SPRING.x,(hero.y-SPRING.y)*1.3)<88)return {kind:'npc',npc:SPRING,x:SPRING.x,y:SPRING.y+4};
    if(!P.flags.gates&&hero.y<214)for(let i=0;i<3;i++)if(!gateSeq.includes(i)&&Math.abs(hero.x-WADI.gates[i].x)<30)return {kind:'gate',i,x:WADI.gates[i].x,y:150};
    return null;
  }
  if(scene.id==='village'){const F=MAP.fountain,dx=(hero.x-F.x)/74,dy=(hero.y-F.y)/50;if(dx*dx+dy*dy<1.3)return {kind:'spring',x:F.x,y:F.y-30};}
  if(scene.interior){if(hero.y>IH-62&&Math.abs(hero.x-224)<30)return {kind:'exit',x:224,y:IH-6};}
  else for(const h of MAP.houses)if(Math.abs(hero.x-h.doorX)<22&&hero.y<h.base+30&&hero.y>h.base)return {kind:'door',house:h,x:h.doorX,y:h.base-8};
  return null;
}
function update(dt){
  time+=dt;
  if(talkCooldown>0)talkCooldown-=dt;
  if(state==='play'||state==='dialog')P.clock=(P.clock??540)+dt*DAY_RATE;
  for(const n of NPCS)if(n.scene===scene.id)updateNpc(n,dt);
  if(state==='play'){
    const v=inputVector();
    if(v){
      hero.dir=chooseDir(v,hero.dir);
      const sp=heroSpeed(),p=resolve(hero.x+v.x*sp*dt,hero.y+v.y*sp*dt,HERO_R,collidersFor(hero),scene.W,scene.H);
      const moved=Math.hypot(p.x-hero.x,p.y-hero.y);
      hero.x=p.x;hero.y=p.y;hero.moving=true;hero.phase+=dt*11;
      {const lt=trail[trail.length-1];if(!lt||Math.hypot(hero.x-lt.x,hero.y-lt.y)>=3){trail.push({x:hero.x,y:hero.y,dir:hero.dir});if(trail.length>40)trail.shift();}}
      const si=Math.floor(hero.phase/Math.PI);if(si!==lastStep&&moved>.05){lastStep=si;SFX.step(scene.interior?'wood':scene.fort?'stone':scene.forest||scene.wadi?'dirt':MAP.onAnyPath(hero.x,hero.y)?'stone':'grass',si%2?.15:-.15);stepFeel(scene.fort?'stone':MAP.onAnyPath(hero.x,hero.y)?'stone':'grass',si%2?1:-1);}
      if(scene.forest&&hero.y<FH-150&&Math.hypot(hero.x-FOREST.clearing.x,hero.y-FOREST.clearing.y)>FOREST.clearing.r+10||scene.wadi&&hero.x>150&&hero.x<1080&&hero.y<500||scene.fort&&hero.y>320&&hero.y<830){encounterMeter-=moved;if(encounterMeter<=0){resetMeter();startEncounter();}}
    }else{hero.moving=false;hero.phase=0;}
    target=findTarget();
    if(v&&scene.id==='village'){for(const h of MAP.houses)if(v.y<-.4&&Math.abs(hero.x-h.doorX)<15&&hero.y>h.base&&hero.y<h.base+11){enterHouse(h);break;}}
    if(state==='play'&&scene.interior&&hero.y>IH-18&&hero.x>GAP0&&hero.x<GAP1)exitHouse();
    if(state==='play'&&target&&target.kind==='door'&&!doorHintShown){doorHintShown=true;showToast('door','اتجه نحو الباب، أو اضغط «تفاعل» للدخول',3.2);}
    if(state==='play'&&scene.forest&&hero.y>FH-16){SFX.play('rustle');goTo('village',576,104,'down','عين الوادي');}
    if(state==='play'&&scene.wadi&&P.flags.ch4&&v&&v.y>.4&&hero.y>WH-12&&hero.x>860&&hero.x<940){resetMeter();SFX.play('rustle');P.flags.fort=1;goTo('fort',480,866,'up','الحصن القديم');}
    if(state==='play'&&scene.fort&&v&&v.y>.4&&hero.y>F2H-10){resetMeter();goTo('wadi',900,520,'up','وادي الفلج');}
    if(state==='play'&&scene.wadi&&hero.x<14){SFX.play('rustle');goTo('village',VW-44,446,'left','عين الوادي');}
    if(state==='play'&&scene.id==='village'&&P.flags.ch3&&v&&v.x>.4&&hero.x>VW-26&&Math.abs(hero.y-446)<30){resetMeter();SFX.play('rustle');enterWadi();goTo('wadi',34,300,'right','وادي الفلج');}
    if(state==='play'&&scene.id==='village'&&chapterDone&&v&&v.y<-.4&&hero.y<96&&Math.abs(hero.x-576)<34){resetMeter();SFX.play('rustle');goTo('forest',320,FH-40,'up','ممر الغابة');}
    if(state==='play'&&scene.forest&&!forestHintShown&&!P.flags.boss){forestHintShown=true;notify('احذر: حيوانات الغابة تهاجم المارّة<small>إن خسرت معركة تعود إلى القرية سالمًا</small>',3.6);}
    if(state==='play'&&scene.id==='village'&&!chapterDone){
      const z=MAP.forestZone,inZ=hero.x>z.x&&hero.x<z.x+z.w&&hero.y>z.y&&hero.y<z.y+z.h;
      if(inZ&&!inForest){showToast('forest','الطريق إلى الغابة مغلق حاليًا',0);SFX.play('blocked');}
      if(!inZ&&inForest&&toastKey==='forest')toastUntil=time+1.2;
      inForest=inZ;
    }
  }else{hero.moving=false;if(state!=='dialog')target=null;}
  actBtn.classList.toggle('ready',state==='play'&&!!target);
  if(toastKey&&time>toastUntil)hideToast();
  if(!toastKey&&toastQ.length&&time>toastGap&&state==='play'){const q=toastQ.shift();showToast('note',q[0],q[1]);}
  if(state==='play'&&time-lastSave>15)saveGame();
  feelTick();
  if(time>hero.blinkAt+.13)hero.blinkAt=time+2.5+Math.random()*3;
  const vw=view.w/view.zoom,vh=view.h/view.zoom;
  let tx,ty;
  if(state==='title'){tx=576+Math.sin(time*.12)*170-vw/2;ty=430+Math.cos(time*.1)*70-vh/2;}
  else{const portrait=view.h>view.w*1.15;tx=hero.x-vw/2;ty=hero.y-18-vh/2+(portrait?vh*.1:0);}
  tx=vw>=scene.W?(scene.W-vw)/2:clamp(tx,0,scene.W-vw);
  ty=vh>=scene.H?(scene.H-vh)/2:clamp(ty,0,scene.H-vh);
  const k=1-Math.exp(-dt*(state==='title'?2:OPT.camera==='snappy'?16:7));
  view.camX+=(tx-view.camX)*k;view.camY+=(ty-view.camY)*k;
}
function snapCamera(){
  const vw=view.w/view.zoom,vh=view.h/view.zoom,portrait=view.h>view.w*1.15;
  const tx=hero.x-vw/2,ty=hero.y-18-vh/2+(portrait?vh*.1:0);
  view.camX=vw>=scene.W?(scene.W-vw)/2:clamp(tx,0,scene.W-vw);
  view.camY=vh>=scene.H?(scene.H-vh)/2:clamp(ty,0,scene.H-vh);
}

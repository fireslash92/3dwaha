// الإحساس باللعب: اهتزاز الشاشة، توقف لحظة الإصابة، انتقال المعارك، الغبار وآثار الأقدام وتموّج الماء
'use strict';

/* ---------- screen shake & haptics ---------- */
const SHAKE={t0:-9,amp:0,dur:0};
const feelOn=()=>OPT.shake!=='off';
function shake(amp,dur=.25){if(!feelOn())return;if(time-SHAKE.t0<SHAKE.dur&&amp<SHAKE.amp*(1-(time-SHAKE.t0)/SHAKE.dur))return;SHAKE.t0=time;SHAKE.amp=amp;SHAKE.dur=dur;}
function shakeOffset(){
  const k=(time-SHAKE.t0)/SHAKE.dur;if(k<0||k>=1)return [0,0];
  const a=SHAKE.amp*(1-k)*(1-k);
  return [Math.sin(time*93.1)*a*.8+Math.sin(time*57.3)*a*.4,Math.cos(time*81.7)*a*.7];
}
function buzz(p){if(!feelOn()||!navigator.vibrate)return;try{navigator.vibrate(p);}catch(_){}}

/* ---------- hit stop: the picture holds for a beat when a blow lands ---------- */
let freezeT=-9,freezeUntil=-9;
const animTime=()=>time<freezeUntil?freezeT:time;
function hitStop(ms){freezeT=time;freezeUntil=time+ms/1000;return wait(ms);}

/* ---------- battle transition: the field shatters, the arena opens like an eye ---------- */
let TR=null;
function startTransition(boss,onMid){
  const img=document.createElement('canvas');img.width=canvas.width;img.height=canvas.height;
  try{img.getContext('2d').drawImage(canvas,0,0);}catch(_){}
  const lead=boss?.55:0;
  TR={t0:time,img,boss,lead,mid:lead+.5,end:lead+1.05,onMid,fired:false};gameEl.classList.add('transit');
  if(boss){shake(6,.5);buzz(80);}
}
function drawTransition(){
  if(!TR)return;
  const g=ctx,w=canvas.width,h=canvas.height,k=time-TR.t0;
  if(!TR.fired&&k>=TR.mid){TR.fired=true;gameEl.classList.remove('transit');try{TR.onMid();}catch(err){console.error(err);}}
  if(k>=TR.end){TR=null;return;}
  g.save();g.setTransform(1,0,0,1,0,0);
  if(k<TR.mid){
    if(k<TR.lead){ // boss: the world pulses and reddens before it breaks
      const q=k/TR.lead,z=1+.05*Math.sin(q*Math.PI*3)*q;
      g.fillStyle='#000';g.fillRect(0,0,w,h);
      g.translate(w/2,h/2);g.scale(z,z);g.drawImage(TR.img,-w/2,-h/2);g.setTransform(1,0,0,1,0,0);
      g.fillStyle=`rgba(150,20,10,${.35*q})`;g.fillRect(0,0,w,h);
    }else{
      const q=(k-TR.lead)/(TR.mid-TR.lead);
      g.fillStyle='#0b0704';g.fillRect(0,0,w,h);
      const cols=OPT.quality==='saver'?6:9,rows=Math.max(4,Math.round(cols*h/w)),tw=w/cols,th=h/rows,cx=w/2,cy=h/2,maxd=Math.hypot(cx,cy);
      for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
        const x=c*tw,y=r*th,mx=x+tw/2,my=y+th/2,dx=mx-cx,dy=my-cy,dist=Math.hypot(dx,dy)/maxd;
        const p=clamp((q-(1-dist)*.35)/.65,0,1),e=p*p;
        if(p>=1)continue;
        g.save();g.globalAlpha=1-e;
        g.translate(mx+dx*e*1.4,my+dy*e*1.4+e*h*.15);g.rotate((dx>0?1:-1)*e*2.2*(.5+((r*7+c*13)%5)/5));g.scale(1-e*.5,1-e*.5);
        g.drawImage(TR.img,x,y,tw+1,th+1,-tw/2,-th/2,tw+1,th+1);
        g.restore();
      }
      if(q<.2){g.fillStyle=`rgba(255,248,230,${(.2-q)*4})`;g.fillRect(0,0,w,h);}
    }
  }else{ // reveal: a circle opens from the middle of the arena
    const q=(k-TR.mid)/(TR.end-TR.mid),e=1-Math.pow(1-q,3),R=e*Math.hypot(w,h)*.6;
    g.fillStyle='#0b0704';g.beginPath();g.rect(0,0,w,h);g.moveTo(w/2+R,h*.42);g.arc(w/2,h*.42,Math.max(1,R),0,TAU,true);g.fill('evenodd');
  }
  g.restore();
}

/* ---------- overworld particles: dust, footprints, ripples ---------- */
const PUFFS=[],PRINTS=[],RIPPLES=[];
let lastRipple=0;
function stepFeel(kind,side){
  const sc=scene.id,col=kind==='snow'?'240,246,250':sc==='wadi'?'216,191,142':sc==='fort'?'201,168,118':sc==='forest'?'143,122,84':kind==='stone'?'203,189,159':null;
  if(col&&OPT.quality!=='saver'&&hero.moving){
    for(let i=0;i<2;i++)PUFFS.push({x:hero.x+(Math.random()-.5)*8,y:hero.y-1,vx:(Math.random()-.5)*14,vy:-6-Math.random()*8,r:2+Math.random()*2,t0:time,life:.55,col});
    if(PUFFS.length>60)PUFFS.splice(0,PUFFS.length-60);
  }
  if(sc==='wadi'||kind==='snow'||sc==='forest'&&FOREST.nearest(hero.x,hero.y).d<40){
    const a={up:-Math.PI/2,down:Math.PI/2,left:Math.PI,right:0}[hero.dir]||0,off=side>0?3:-3;
    PRINTS.push({x:hero.x+Math.cos(a+Math.PI/2)*off,y:hero.y-1+Math.sin(a+Math.PI/2)*off,a,t0:time,sc});
    if(PRINTS.length>70)PRINTS.shift();
  }
}
function waterNearHero(){
  if(scene.id==='village'&&!dryVillage()){
    const F=MAP.fountain,dx=hero.x-F.x,dy=(hero.y-F.y)*1.6,d=Math.hypot(dx,dy);
    if(d<110){const a=Math.atan2(dy,dx);return {x:F.x+Math.cos(a)*40,y:F.y+Math.sin(a)*23,rx:1};}
    const L=MAP.falaj;if(hero.x>L.x-30&&hero.x<L.x+L.w+30&&hero.y>L.y&&hero.y<L.y+L.h)return {x:L.x+L.w/2,y:hero.y-4,rx:.45};
  }
  if(scene.wadi&&P.flags.gates){
    if(hero.y<215)return {x:clamp(hero.x,10,WADI.spring.x-40),y:150,rx:.5};
    const s=WADI.spring;if(Math.hypot(hero.x-s.x,(hero.y-s.y)*1.4)<110){const a=Math.atan2(hero.y-s.y,hero.x-s.x);return {x:s.x+Math.cos(a)*34,y:s.y+Math.sin(a)*18,rx:1};}
  }
  return null;
}
function feelTick(){
  if(state!=='play'||!hero.moving)return;
  if(time-lastRipple>.32){const w=waterNearHero();if(w){lastRipple=time;RIPPLES.push({x:w.x,y:w.y,rx:w.rx,t0:time,sc:scene.id});if(RIPPLES.length>24)RIPPLES.shift();}}
}
function drawGroundFeel(g){ // under everything that stands
  for(let i=PRINTS.length-1;i>=0;i--){const p=PRINTS[i],k=(time-p.t0)/8;if(k>=1||p.sc!==scene.id){if(k>=1)PRINTS.splice(i,1);continue;}
    g.save();g.translate(p.x,p.y);g.rotate(p.a);g.fillStyle=`rgba(90,60,30,${.36*(1-k)})`;ell(g,0,0,3.2,1.8);g.fill();g.restore();}
}
function drawAirFeel(g){ // over the scene
  for(let i=RIPPLES.length-1;i>=0;i--){const r=RIPPLES[i],k=(time-r.t0)/1.1;if(k>=1||r.sc!==scene.id){RIPPLES.splice(i,1);continue;}
    g.strokeStyle=`rgba(230,248,255,${.6*(1-k)})`;g.lineWidth=1.1;ell(g,r.x,r.y,(3+k*16)*(r.rx<1?r.rx+.4:1),(3+k*16)*.5);g.stroke();}
  for(let i=PUFFS.length-1;i>=0;i--){const p=PUFFS[i],k=(time-p.t0)/p.life;if(k>=1){PUFFS.splice(i,1);continue;}
    g.fillStyle=`rgba(${p.col},${.45*(1-k)})`;circ(g,p.x+p.vx*k,p.y+p.vy*k,p.r*(1+k*1.4));}
}

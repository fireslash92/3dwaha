// صيد السمك في الفلج وعين الوادي: رمي الخيط، انتظار العضّة، ثم شدّ الخيط وإبقاء السمكة في المنطقة الخضراء
'use strict';

/* =========================================================
   FISH & ROD
   ========================================================= */
const FISH={
  minnow:{name:'سمكة الفلج الصغيرة',where:'village',w:62,len:[6,12],spd:.45,jump:.9,col:'#9fb7a8',price:30,heal:15},
  garra:{name:'سمكة الصدّ',where:'village',w:34,len:[10,22],spd:.75,jump:.7,col:'#7d8f6a',price:70,heal:30},
  aynfish:{name:'سمكة العين',where:'wadi',w:58,len:[18,34],spd:.85,jump:.65,col:'#7aa6b8',price:110,heal:45},
  bigsad:{name:'صدّ الوادي الكبير',where:'wadi',w:36,len:[28,46],spd:1.15,jump:.5,col:'#6f7d5c',price:180,heal:70},
  golden:{name:'السمكة الذهبية',where:'any',w:4,len:[20,31],spd:1.5,jump:.38,col:'#e8b33c',price:800,heal:120},
};
const FISH_ORDER=['minnow','garra','aynfish','bigsad','golden'];
for(const id of FISH_ORDER){const f=FISH[id];ITEMS['fish_'+id]={name:f.name,use:'hp',amount:f.heal,icon:'fish',col:f.col,price:f.price,desc:`صيد طازج. يُشوى ويؤكل فيعيد ${AR(f.heal)} من الصحة.`};}
ITEMS.rod={name:'سنارة الصيد',key:true,icon:'rod',col:'#8a5a2b',price:80,desc:'قصبة من النخيل وخيط متين. اقترب من ماء الفلج أو عين الوادي واضغط «تفاعل».'};
SHOP.saeed.stock.unshift('rod');

/* where the hero can fish (null if nowhere) */
function fishWater(){
  if(scene.id==='village'&&!dryVillage()){const L=MAP.falaj;if(hero.x>L.x-30&&hero.x<L.x+L.w+30&&hero.y>L.y+6&&hero.y<L.y+L.h-6)return {x:L.x+L.w/2,y:hero.y-6,place:'village'};}
  if(scene.wadi&&P.flags.gates&&hero.y<228&&hero.x<WADI.spring.x-90)return {x:clamp(hero.x,20,WADI.spring.x-60),y:150,place:'wadi'};
  return null;
}
function fishTarget(){const w=fishWater();return w?{kind:'fish',x:w.x,y:w.y+30,w}:null;}

/* =========================================================
   THE MINI-GAME
   phases: cast → wait → bite → reel → done
   ========================================================= */
let FG=null,fishHold=false;
function pickFish(place,bait){
  const h=hourNow(),rare=(WX.rain>.2?2:1)*(h<7||h>17&&h<19.5?1.6:1)*(bait?3:1);
  const pool=FISH_ORDER.filter(id=>FISH[id].where===place||FISH[id].where==='any').map(id=>[id,FISH[id].w*(id==='golden'?rare:bait&&(id==='garra'||id==='bigsad')?1.8:1)]);
  let r=Math.random()*pool.reduce((s,p)=>s+p[1],0);for(const [id,w] of pool){if((r-=w)<=0)return id;}return pool[0][0];
}
function startFishing(w){
  if(!P.inv.rod){SFX.play('blocked');showToast('note','الماء هنا يعجّ بالسمك<small>لو عندك سنارة لاصطدت. يبيعها سعيد في دكانه</small>',3.4);talkCooldown=.6;return;}
  resetInput();state='fish';hero.dir=w.x<hero.x-6?'left':w.x>hero.x+6?'right':'up';
  if(toastKey==='hint'||toastKey==='note')hideToast();
  FG={phase:'cast',t0:time,w,place:w.place,nib:0,nextNib:0};SFX.play('cast');
  gameEl.classList.add('fishing');
}
function endFishing(msg,dur=2.6){state='play';FG=null;fishHold=false;talkCooldown=.4;gameEl.classList.remove('fishing');if(msg)showToast('note',msg,dur);}
function fishPress(){ // the interact button while fishing
  if(!FG)return;
  if(FG.phase==='wait'){SFX.play('cancel');endFishing('سحبت الخيط قبل أن تعضّ سمكة',1.8);return;}
  if(FG.phase==='bite'){
    const bait=(P.inv.bait||0)>0;if(bait)P.inv.bait--;FG.bait=bait;
    const id=pickFish(FG.place,bait),f=FISH[id];
    FG.phase='reel';FG.t0=time;FG.fish=id;FG.f=.5;FG.ft=.5;FG.fv=0;FG.nextJump=0;FG.z=.35;FG.zv=0;FG.zw=id==='golden'?.2:.26;FG.prog=.3;FG.spd=f.spd;FG.jump=f.jump;
    SFX.play('hook');buzz(25);
  }
}
function fishTick(dt){
  if(state!=='fish'||!FG)return;
  const k=time-FG.t0;
  if(FG.phase==='cast'&&k>.65){FG.phase='wait';FG.t0=time;FG.waitFor=1.8+Math.random()*4.2;FG.nextNib=.6+Math.random()*1.2;SFX.play('plop');}
  else if(FG.phase==='wait'){
    if(k>FG.nextNib&&k<FG.waitFor-.5){FG.nib=time;FG.nextNib=k+.9+Math.random()*1.4;SFX.play('nibble');}
    if(k>FG.waitFor){FG.phase='bite';FG.t0=time;SFX.play('bite');buzz([40,30,40]);}
  }
  else if(FG.phase==='bite'&&k>.85){SFX.play('splash');endFishing('أفلتت السمكة الطُّعم<small>اضغط «تفاعل» بسرعة لحظة غوص العوّامة</small>',2.4);}
  else if(FG.phase==='reel'){
    // the fish darts around; the green zone rises while you hold and sinks when you let go
    if(k>FG.nextJump){FG.nextJump=k+FG.jump*(.5+Math.random());FG.ft=clamp(FG.f+(Math.random()-.5)*FG.spd*1.1,.03,.97);}
    FG.f+=(FG.ft-FG.f)*Math.min(1,dt*FG.spd*3.2);
    FG.zv+=(fishHold?2.6:-2.3)*dt;FG.zv*=Math.pow(.25,dt);FG.z+=FG.zv*dt;
    if(FG.z<0){FG.z=0;FG.zv=Math.abs(FG.zv)*.3;}if(FG.z>1-FG.zw){FG.z=1-FG.zw;FG.zv=-Math.abs(FG.zv)*.3;}
    const inside=FG.f>=FG.z&&FG.f<=FG.z+FG.zw;FG.inside=inside;
    FG.prog+=(inside?.3:-.2/(.7+FG.spd*.3))*dt;
    if(fishHold&&(FG.tick=(FG.tick||0)-dt)<=0){FG.tick=.09;SFX.play('reel');}
    if(FG.prog>=1)landFish();
    else if(FG.prog<=0){SFX.play('splash');endFishing(`أفلتت ${FISH[FG.fish].name}!<small>أبقِ السمكة داخل المنطقة الخضراء حتى يمتلئ الشريط</small>`,2.6);}
  }
}
function landFish(){
  const id=FG.fish,f=FISH[id],len=Math.round(f.len[0]+(f.len[1]-f.len[0])*Math.pow(Math.random(),FG.bait?.8:1.4));
  P.inv['fish_'+id]=(P.inv['fish_'+id]||0)+1;
  P.fishLog=P.fishLog||{};const L=P.fishLog[id]=P.fishLog[id]||{n:0,best:0};L.n++;const rec=len>L.best&&L.n>1;L.best=Math.max(L.best,len);
  SFX.play(id==='golden'?'fanfare':'itemGet');buzz(id==='golden'?[60,40,60,40,120]:40);
  if(fxOn())for(let i=0;i<10;i++)PUFFS.push({x:FG.w.x,y:FG.w.y,vx:(Math.random()-.5)*50,vy:-30-Math.random()*30,r:1.5,t0:time,life:.6,col:'210,235,250'});
  RIPPLES.push({x:FG.w.x,y:FG.w.y,rx:1,t0:time,sc:scene.id});
  achCheckFish();
  endFishing(`اصطدت ${f.name}!<small>طولها ${AR(len)} سم${rec?'، رقم قياسي جديد':''}${FG.bait?'، بالطُّعم':''}. تجدها في الحقيبة</small>`,3.2);
  saveGame();
}

/* =========================================================
   DRAWING
   ========================================================= */
function drawFishWorld(g,t){
  if(!FG)return;
  const w=FG.w,k=time-FG.t0,hx=hero.x+(hero.dir==='left'?-6:hero.dir==='right'?6:2),hy=hero.y-26;
  // rod tip leans toward the water
  const ang=Math.atan2(w.y-hy,w.x-hx),tipX=hx+Math.cos(ang)*26,tipY=hy+Math.sin(ang)*26-14;
  let bx=w.x,by=w.y;
  if(FG.phase==='cast'){const q=Math.min(1,k/.65);bx=tipX+(w.x-tipX)*q;by=tipY+(w.y-tipY)*q-Math.sin(q*Math.PI)*24;}
  else if(FG.phase==='wait'){by+=Math.sin(t*2.4)*.8+(time-FG.nib<.25?2.2:0);}
  else if(FG.phase==='bite'){by+=4+Math.sin(t*30)*1.2;}
  else if(FG.phase==='reel'){bx+=(FG.f-.5)*18;by+=2+Math.sin(t*14)*1;}
  g.strokeStyle='#5a3a1c';g.lineWidth=2;g.beginPath();g.moveTo(hx,hy);g.lineTo(tipX,tipY);g.stroke();
  g.strokeStyle='rgba(250,245,230,.75)';g.lineWidth=.7;g.beginPath();g.moveTo(tipX,tipY);g.quadraticCurveTo((tipX+bx)/2,Math.max(tipY,by)+(FG.phase==='reel'?-4:8),bx,by);g.stroke();
  if(FG.phase!=='cast'){const q=(t*.9)%1;g.strokeStyle=`rgba(230,245,255,${.55*(1-q)})`;g.lineWidth=.9;ell(g,bx,by+1,3+q*9,(3+q*9)*.45);g.stroke();}
  if(FG.phase==='bite'||FG.phase==='reel'){g.fillStyle='rgba(230,245,255,.5)';for(let i=0;i<3;i++)circ(g,bx+Math.sin(t*20+i*2)*5,by-2-Math.abs(Math.sin(t*16+i))*4,1);}
  if(FG.phase!=='bite'){g.fillStyle='#d8432e';ell(g,bx,by-1.5,2.4,2.2);g.fill();g.fillStyle='#fff';ell(g,bx,by+.6,2.4,1.2);g.fill();}
  if(FG.phase==='bite'){ // "!" over the hero
    const yy=hero.y-62+Math.sin(t*20)*1.5;g.fillStyle='#fffaf0';rr(g,hero.x-8,yy-12,16,20,6);g.fill();g.strokeStyle='#a9472a';g.lineWidth=1.4;g.stroke();
    g.fillStyle='#c0392b';g.fillRect(hero.x-1.6,yy-8,3.2,8.5);circ(g,hero.x,yy+4,1.8);
  }
}
function drawFishIcon(g,x,y,s,col,dir=1){
  g.save();g.translate(x,y);g.scale(s*dir,s);
  g.fillStyle=col;g.beginPath();g.ellipse(0,0,9,4.6,0,0,TAU);g.fill();
  g.beginPath();g.moveTo(-7,0);g.lineTo(-14,-5);g.lineTo(-14,5);g.closePath();g.fill();
  g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.ellipse(1,-1.6,5,1.6,0,0,TAU);g.fill();
  g.fillStyle='#1d140c';g.beginPath();g.arc(5,-1,1.1,0,TAU);g.fill();
  g.restore();
}
function drawFishUI(g){
  if(!FG||FG.phase!=='reel')return;
  const d=view.dpr,W=view.w,H=view.h,bw=Math.min(300,W-150),bh=24,x0=(W-bw)/2,y0=H-insets.b-96;
  g.save();g.setTransform(d,0,0,d,0,0);
  g.fillStyle='rgba(30,18,8,.82)';rr(g,x0-14,y0-34,bw+28,bh+62,14);g.fill();g.strokeStyle='#d9a85c';g.lineWidth=1.5;g.stroke();
  g.fillStyle='#fdf3dc';g.font='700 13px system-ui,-apple-system,"SF Arabic",sans-serif';g.textAlign='center';g.textBaseline='middle';
  g.fillText('اضغط مطوّلًا لتحريك المنطقة الخضراء، وأبقِ السمكة داخلها',W/2,y0-19);
  // the water track
  const gr=g.createLinearGradient(x0,0,x0+bw,0);gr.addColorStop(0,'#1d4b5e');gr.addColorStop(1,'#2f7896');g.fillStyle=gr;rr(g,x0,y0,bw,bh,8);g.fill();
  const zx=x0+FG.z*bw,zw=FG.zw*bw;g.fillStyle=FG.inside?'rgba(120,230,130,.75)':'rgba(120,230,130,.42)';rr(g,zx,y0+2,zw,bh-4,6);g.fill();
  g.strokeStyle='rgba(220,255,220,.9)';g.lineWidth=1.2;rr(g,zx,y0+2,zw,bh-4,6);g.stroke();
  drawFishIcon(g,x0+FG.f*bw,y0+bh/2,1.05,FG.fish==='golden'?'#f2c44e':'#d9e6e0',FG.ft>FG.f?1:-1);
  // catch progress
  g.fillStyle='rgba(255,255,255,.15)';rr(g,x0,y0+bh+8,bw,7,3.5);g.fill();
  g.fillStyle=FG.prog>.66?'#7ee08a':FG.prog>.33?'#f2c44e':'#e0694f';rr(g,x0,y0+bh+8,Math.max(7,bw*clamp(FG.prog,0,1)),7,3.5);g.fill();
  g.restore();
}

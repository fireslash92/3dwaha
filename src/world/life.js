// قرية حيّة: جدول يومي لأهل القرية، وحيوانات تتجول، وبائع متجول، وزينة الاحتفال بعودة الماء
'use strict';

/* =========================================================
   DAILY SCHEDULES
   each entry: [from-hour, scene, x, y, facing]  ('wander' = roam the plaza)
   ========================================================= */
const SCHED={
  saeed:[[6,'village',770,340,'down'],[17,'village',500,368,'up'],[19.5,'A',150,214,'down']],
  rashid:[[6,'B',120,186,'up'],[17,'village',530,368,'up'],[19.5,'B',250,246,'down']],
  mariam:[[6,'village',864,690,'left'],[17.5,'village',232,744,'down'],[19.5,'C',300,206,'down']],
  hamad:[[6,'wander'],[19.5,'A',262,250,'down']],
  shamsa:[[6,'village',546,716,'up'],[21,'C',150,232,'down']],
};
const PEDDLER_LOOK={g:'m',robe:'#9a7a52',robeSh:'#7a5e3c',tassel:'#5a4630',head:'massar',hw:['#2f6b4f','#e3a23c','#f3ead8'],hair:'#bdb6aa',beard:'#cfc8bc',age:'old',skin:'#c48a5e'};
const PEDDLER={id:'peddler',name:'أبو خلفان',scene:'none',x:600,y:524,dir:'down',look:PEDDLER_LOOK,noMeet:true,shop:'peddler',talked:0,
  lines:null,repeat:['السلام عليكم! أبو خلفان، أطوف القرى من صلالة إلى مسندم.','عندي اليوم بضاعة لا تجدها عند سعيد. تفضّل وانظر.']};
PEDDLER.lines=PEDDLER.repeat;
NPCS.push(PEDDLER);
PEDDLER.home={x:PEDDLER.x,y:PEDDLER.y,dir:'down',scene:'none'};
Object.assign(PEDDLER,{phase:0,moving:false,lookAt:2,pause:1,target:null,stuck:0});
SCHED.peddler=[[0,'none'],[8,'village',600,524,'down'],[13,'none']];
Object.assign(ITEMS,{
  saffron:{name:'زعفران',use:'mp',amount:999,icon:'incense',col:'#c0392b',price:150,desc:'خيوط حمراء ثمينة. تعيد الطاقة كاملة.'},
  aqeeq:{name:'خاتم العقيق',slot:'acc',icon:'ring',col:'#a8322a',stats:{luk:2,wis:2,def:1},price:450,desc:'فضة يتوسطها حجر عقيق أحمر من اليمن.'},
});
SHOP.peddler={title:'بضاعة أبي خلفان',sub:'بائع متجول، يمر في الصباح يومًا بعد يوم',tabs:[['buy','شراء'],['sell','بيع']],stock:['saffron','aqeeq','halwa','honey']};
const HOUSE_OF={A:MAP.houses[0],B:MAP.houses[1],C:MAP.houses[2]};
function slotFor(n){
  const S=SCHED[n.id];if(!S)return null;
  const h=hourNow();let pick=S[S.length-1];
  for(const e of S)if(h>=e[0])pick=e;
  if(n===PEDDLER&&Math.floor((P.clock??540)/1440)%2===1)return [0,'none'];
  return pick;
}
function planRoute(n,slot){
  const wander=slot[1]==='wander',dest=wander?{scene:'village',x:576,y:600}:{scene:slot[1],x:slot[2],y:slot[3]};
  const R=[];
  if(n.scene!=='village'&&n.scene!=='none'&&n.scene!==dest.scene){const h=HOUSE_OF[n.scene];R.push({scene:n.scene,x:224,y:IH-30},{scene:'village',x:h.doorX,y:h.base+16,tp:1});}
  if(n.scene==='none'&&dest.scene!=='none')R.push({scene:'village',x:1120,y:446,tp:1});
  if(dest.scene==='none'){if(n.scene!=='none')R.push({scene:'village',x:1120,y:446},{scene:'none',x:600,y:524,tp:1});}
  else if(dest.scene!=='village'&&dest.scene!==n.scene){const h=HOUSE_OF[dest.scene];R.push({scene:'village',x:h.doorX,y:h.base+16},{scene:dest.scene,x:224,y:IH-40,tp:1},dest);}
  else R.push(dest);
  return R;
}
let lifeReady=false;
function scheduleTick(){
  for(const n of NPCS){
    if(n.scene==='party')continue;
    const slot=slotFor(n);if(!slot)continue;
    const key=slot.join(',');if(n.slotKey===key)continue;
    const first=!lifeReady;n.slotKey=key;
    if(n.id==='hamad'){if(!n.wanderDef)n.wanderDef=n.wander;n.wander=null;}
    n.route=planRoute(n,slot);n.endDir=slot[4]||'down';n.endWander=slot[1]==='wander';
    if(first){for(const w of n.route){n.scene=w.scene;n.x=w.x;n.y=w.y;}n.route=null;finishRoute(n);}
  }
  lifeReady=true;
}
function finishRoute(n){n.route=null;n.moving=false;n.dir=n.endDir||n.dir;if(n.endWander&&n.wanderDef){n.wander=n.wanderDef;n.target=null;n.pause=.5;}}
function walkRoute(n,dt){
  const w=n.route[0];
  if(w.tp||n.scene!==scene.id||w.scene!==n.scene){n.scene=w.scene;n.x=w.x;n.y=w.y;n.route.shift();n.stuck=0;if(!n.route.length)finishRoute(n);return;}
  const dx=w.x-n.x,dy=w.y-n.y,d=Math.hypot(dx,dy);
  if(d<3){n.route.shift();if(!n.route.length)finishRoute(n);return;}
  const step=Math.min(d,44*dt),p=resolve(n.x+dx/d*step,n.y+dy/d*step,NPC_R,collidersFor(n),scene.W,scene.H);
  const moved=Math.hypot(p.x-n.x,p.y-n.y);n.x=p.x;n.y=p.y;n.moving=true;n.phase+=dt*9;n.dir=chooseDir({x:dx/d,y:dy/d},n.dir);
  if(moved<step*.3){n.stuck=(n.stuck||0)+dt;if(n.stuck>1.2){n.x=w.x;n.y=w.y;n.stuck=0;}}else n.stuck=0;
}
function hintFor(n){return INTERIORS[n.scene]?`الآن داخل ${INTERIORS[n.scene].name}`:n.scene==='village'?HINTS[n.id]:HINTS[n.id];}

/* =========================================================
   ANIMALS
   ========================================================= */
const ANIMALS=[
  {kind:'goat',scene:'village',x:130,y:500,area:[84,468,204,640],col:'#f1ece2',spot:'#6b4a2b'},
  {kind:'goat',scene:'village',x:170,y:600,area:[84,468,204,640],col:'#5a4636',spot:'#efe8dc'},
  {kind:'goat',scene:'village',x:110,y:590,area:[84,468,204,640],col:'#c9a676',spot:'#f6f0e4',kid:true},
  {kind:'cat',scene:'village',x:520,y:520,area:[450,380,700,560],col:'#d98a3c'},
  {kind:'hen',scene:'village',x:1040,y:530,area:[996,478,1090,590],col:'#f4eee2'},
  {kind:'hen',scene:'village',x:1010,y:560,area:[996,478,1090,590],col:'#a8622c'},
  {kind:'hen',scene:'village',x:1070,y:575,area:[996,478,1090,590],col:'#f4eee2',rooster:true},
  ...[0,1,2,3,4].map(i=>({kind:'pigeon',scene:'village',x:628+i*16,y:506+(i%2)*14,area:[600,494,712,534],col:i%2?'#8f969c':'#a7adb2'})),
  {kind:'camel',scene:'wadi',x:330,y:372,col:'#c49a62'},
];
ANIMALS.forEach((a,i)=>Object.assign(a,{i,hx:a.x,hy:a.y,tx:null,ty:null,pause:Math.random()*2,dir:Math.random()<.5?1:-1,phase:Math.random()*TAU,flee:0,z:0,vz:0,gone:0,next:2+Math.random()*8}));
WADI.colliders.push({t:'c',x:330,y:366,r:24,tag:'camel'});
const COOP={x:1072,y:500};
MAP.colliders.push({t:'r',x:COOP.x-20,y:COOP.y-20,w:40,h:20,tag:'coop'});
function animalAsleep(a){const n=nightAmount();return n>.7&&(a.kind==='goat'||a.kind==='cat');}
function animalHidden(a){const n=nightAmount();return n>.5&&(a.kind==='hen'||a.kind==='pigeon');}
function animalsTick(dt){
  if(state!=='play'&&state!=='dialog')return;
  for(const a of ANIMALS){
    if(a.scene!==scene.id||animalHidden(a))continue;
    const dh=Math.hypot(hero.x-a.x,hero.y-a.y),pan=clamp((a.x-hero.x)/220,-1,1),vol=clamp(1-dh/360,0,1);
    a.next-=dt;
    if(a.kind==='camel'){if(a.next<=0&&vol>0){a.next=10+Math.random()*12;SFX.play('grunt',{pan,vol});}continue;}
    if(animalAsleep(a)){a.moving=false;continue;}
    if(a.kind==='pigeon'){
      if(a.gone>0){a.gone-=dt;if(a.gone<=0&&dh>140){a.z=0;a.vz=0;a.x=a.hx;a.y=a.hy;}else if(a.gone<=0)a.gone=2;continue;}
      if(a.z>0||a.vz>0){a.z+=a.vz*dt;a.vz+=30*dt;a.x+=a.fx*dt;a.y+=a.fy*dt;if(a.z>220){a.gone=10+Math.random()*8;}continue;}
      if(dh<74&&state==='play'){const ang=Math.atan2(a.y-hero.y,a.x-hero.x);a.vz=70;a.z=.1;a.fx=Math.cos(ang)*90;a.fy=Math.sin(ang)*40-30;a.dir=a.fx>0?1:-1;if(!ANIMALS.some(b=>b!==a&&b.kind==='pigeon'&&b.flapT>time-.3)){a.flapT=time;SFX.play('flap',{pan,vol:Math.max(.5,vol)});}continue;}
    }
    if(a.kind==='hen'&&dh<58&&a.flee<=0&&state==='play'){a.flee=.7;const ang=Math.atan2(a.y-hero.y,a.x-hero.x);a.tx=a.x+Math.cos(ang)*70;a.ty=a.y+Math.sin(ang)*50;if(time-(a.cluckT||0)>1.5){a.cluckT=time;SFX.play('cluck',{pan,vol:Math.max(.5,vol)});}}
    if(a.flee>0)a.flee-=dt;
    if(a.next<=0&&vol>.05){a.next=7+Math.random()*12;
      if(a.kind==='goat')SFX.play('bleat',{pan,vol,kid:a.kid});
      else if(a.kind==='hen'&&a.rooster&&hourNow()<9)SFX.play('crow',{pan,vol});
      else if(a.kind==='hen')SFX.play('cluck',{pan,vol:vol*.6});
      else if(a.kind==='cat'&&dh<120)SFX.play('meow',{pan,vol});}
    if(a.pause>0&&a.flee<=0){a.pause-=dt;a.moving=false;a.peck=a.kind==='hen'||a.kind==='pigeon'||a.kind==='goat';continue;}
    a.peck=false;
    if(a.tx==null){const [x0,y0,x1,y1]=a.area;a.tx=x0+Math.random()*(x1-x0);a.ty=y0+Math.random()*(y1-y0);}
    const dx=a.tx-a.x,dy=a.ty-a.y,d=Math.hypot(dx,dy),sp=(a.flee>0?95:{goat:22,cat:30,hen:26,pigeon:18}[a.kind])*dt;
    if(d<2){a.tx=null;a.pause=1+Math.random()*(a.kind==='cat'?6:3);a.moving=false;continue;}
    const q=resolve(a.x+dx/d*Math.min(d,sp),a.y+dy/d*Math.min(d,sp),5,scene.colliders,scene.W,scene.H);
    if(Math.hypot(q.x-a.x,q.y-a.y)<sp*.2){a.tx=null;a.pause=.4;}
    a.x=q.x;a.y=q.y;a.moving=true;a.phase+=dt*(a.flee>0?22:12);if(Math.abs(dx)>.5)a.dir=dx>0?1:-1;
  }
}
function drawAnimal(g,a,t){
  if(animalHidden(a)||a.gone>0)return;
  const sl=animalAsleep(a),bob=a.moving?Math.abs(Math.sin(a.phase))*1.4:0,leg=a.moving?Math.sin(a.phase)*2.4:0;
  g.save();g.translate(a.x,a.y);
  if(a.kind!=='pigeon'||a.z<=0){g.fillStyle='rgba(35,22,10,.28)';ell(g,0,0,a.kind==='camel'?30:a.kind==='goat'?11:a.kind==='cat'?8:5,a.kind==='camel'?7:3);g.fill();}
  else{g.fillStyle=`rgba(35,22,10,${.25*Math.max(0,1-a.z/120)})`;ell(g,0,0,4,1.6);g.fill();}
  g.scale(a.dir,1);
  if(a.kind==='goat'){
    const s=a.kid?.75:1;g.scale(s,s);
    if(sl){g.fillStyle=a.col;ell(g,0,-6,12,6);g.fill();g.fillStyle=a.spot;ell(g,-3,-8,5,3);g.fill();g.fillStyle=a.col;ell(g,11,-9,5,4);g.fill();g.strokeStyle='#4a3a2a';g.lineWidth=1;g.beginPath();g.arc(12,-9,1.4,0,Math.PI);g.stroke();g.restore();return;}
    g.strokeStyle='#3a2a1e';g.lineWidth=1.8;g.lineCap='round';g.beginPath();[[-7,leg],[-4,-leg],[5,leg],[8,-leg]].forEach(([x,o])=>{g.moveTo(x,-8);g.lineTo(x+o*.4,0);});g.stroke();
    g.fillStyle=a.col;ell(g,0,-11-bob,12,6.5);g.fill();g.fillStyle=a.spot;ell(g,-4,-13-bob,5,3.4);g.fill();
    g.strokeStyle=a.col;g.lineWidth=3;g.beginPath();g.moveTo(-11,-14-bob);g.lineTo(-14,-18-bob);g.stroke();
    const hy=a.peck?-6:-18-bob;g.fillStyle=a.col;g.beginPath();g.moveTo(8,-14-bob);g.lineTo(13,hy+2);g.lineTo(17,hy+1);g.lineTo(18,hy+5);g.lineTo(12,-8-bob);g.closePath();g.fill();
    ell(g,15,hy+3,4.6,3.6);g.fill();g.fillStyle='#2a1c12';circ(g,16,hy+2,.9);
    g.strokeStyle='#8a7a66';g.lineWidth=1.4;g.beginPath();g.moveTo(13,hy);g.quadraticCurveTo(11,hy-6,8,hy-6);g.stroke();
    g.strokeStyle=a.col;g.beginPath();g.moveTo(16,hy+6);g.lineTo(16,hy+9);g.stroke();
  }else if(a.kind==='cat'){
    if(sl){g.fillStyle=a.col;ell(g,0,-5,9,5);g.fill();circ(g,-7,-6,4);g.strokeStyle=a.col;g.lineWidth=2.4;g.lineCap='round';g.beginPath();g.moveTo(8,-4);g.quadraticCurveTo(11,1,3,1);g.stroke();g.restore();return;}
    const sit=!a.moving;
    g.strokeStyle='#8a4f1c';g.lineWidth=1.6;g.lineCap='round';if(!sit){g.beginPath();[[-5,leg],[-2,-leg],[4,leg],[6,-leg]].forEach(([x,o])=>{g.moveTo(x,-6);g.lineTo(x+o*.4,0);});g.stroke();}
    g.fillStyle=a.col;if(sit){ell(g,0,-7,6,7);g.fill();}else{ell(g,0,-8-bob,9,4.6);g.fill();}
    g.strokeStyle=a.col;g.lineWidth=2.2;g.beginPath();g.moveTo(-8,-8);g.quadraticCurveTo(-14,-16+Math.sin(t*3)*3,-11,-20);g.stroke();
    const hx=sit?3:9,hy=sit?-15:-12-bob;g.fillStyle=a.col;circ(g,hx,hy,4.2);poly(g,[hx-3.6,hy-2,hx-2.4,hy-6.6,hx-.4,hy-3]);poly(g,[hx+.6,hy-3,hx+2.6,hy-6.6,hx+3.8,hy-2]);
    g.fillStyle='#2a1c12';circ(g,hx+1.6,hy-.4,.8);
  }else if(a.kind==='hen'){
    const pk=a.peck&&Math.sin(t*6+a.i)>.3;
    g.strokeStyle='#d9a23f';g.lineWidth=1.2;g.beginPath();g.moveTo(-1,-4);g.lineTo(-1+leg*.3,0);g.moveTo(2,-4);g.lineTo(2-leg*.3,0);g.stroke();
    g.fillStyle=a.col;ell(g,0,-7-bob,6.5,5);g.fill();poly(g,[-5,-9-bob,-10,-14-bob,-6,-6-bob]);
    if(a.rooster){g.fillStyle='#2f5d4a';poly(g,[-5,-8-bob,-12,-16-bob,-9,-6-bob]);g.fillStyle='#a8322a';poly(g,[-6,-9-bob,-11,-11-bob,-7,-6-bob]);}
    const hx=pk?6:5,hy=pk?-3:-12-bob;g.fillStyle=a.col;circ(g,hx,hy,3.2);g.fillStyle='#d8443a';poly(g,[hx-2,hy-2.6,hx,hy-5.4,hx+1.6,hy-2.6]);circ(g,hx+1.8,hy+2,1.1);
    g.fillStyle='#e8a33a';poly(g,[hx+2.6,hy-.6,hx+5.4,hy+.2,hx+2.6,hy+1]);g.fillStyle='#2a1c12';circ(g,hx+1,hy-.6,.7);
  }else if(a.kind==='pigeon'){
    const fly=a.z>0,y=-a.z,fl=fly?Math.sin(t*28+a.i)*5:0;
    g.fillStyle=a.col;ell(g,0,y-4,4.6,3.2);g.fill();
    if(fly){g.fillStyle='#c9ced2';poly(g,[-1,y-5,-6,y-9-fl,2,y-6]);poly(g,[-1,y-4,-5,y+1+fl,2,y-3]);}
    else{g.fillStyle='#7d8489';ell(g,-1,y-4.6,3,1.6);g.fill();g.strokeStyle='#c46a5a';g.lineWidth=.9;g.beginPath();g.moveTo(0,y-1);g.lineTo(0,y);g.stroke();}
    const pk=!fly&&a.peck&&Math.sin(t*7+a.i*2)>.4,hx=pk?5:4,hy=pk?y-1:y-7;
    g.fillStyle='#6d7479';circ(g,hx,hy,2.2);g.fillStyle='#4d8a7a';circ(g,hx-1.2,hy+1.6,1.2);g.fillStyle='#2a1c12';circ(g,hx+.8,hy-.4,.5);
  }else if(a.kind==='camel'){
    const chew=Math.sin(t*4)*.6;
    g.fillStyle='#a87e4e';ell(g,-2,-10,26,11);g.fill();g.fillStyle=a.col;ell(g,-2,-13,24,10);g.fill();
    g.fillStyle='#b88e58';ell(g,-6,-24,12,8);g.fill();g.fillStyle=a.col;ell(g,-6,-25,10,7);g.fill();
    g.fillStyle='#8f6a3e';poly(g,[-24,-6,-30,-4,-26,-1]);
    g.strokeStyle=a.col;g.lineWidth=7;g.lineCap='round';g.beginPath();g.moveTo(16,-14);g.quadraticCurveTo(26,-18,26,-34);g.stroke();
    g.fillStyle=a.col;ell(g,30,-36,8,5);g.fill();g.fillStyle='#8f6a3e';ell(g,36,-34+chew,3.4,2.4);g.fill();
    g.fillStyle='#2a1c12';circ(g,30,-38,1.1);g.fillStyle='#8f6a3e';poly(g,[25,-40,24,-44,27,-41]);
    g.fillStyle='#a8322a';g.fillRect(-14,-24,16,3);g.fillStyle='#e3a23c';for(let x=-13;x<2;x+=4)g.fillRect(x,-21,2,4);
  }
  g.restore();
}
function drawCoop(g){
  const {x,y}=COOP;
  g.fillStyle='#7d5434';g.fillRect(x-20,y-22,40,22);g.fillStyle='#5c3b22';g.fillRect(x-20,y-6,40,6);
  g.fillStyle='#a8743f';poly(g,[x-24,y-22,x+24,y-22,x+16,y-34,x-16,y-34]);g.fillStyle='#8a5a31';g.fillRect(x-24,y-23,48,3);
  g.fillStyle='#2a1c12';rr(g,x-6,y-16,12,12,5);g.fill();g.fillStyle='#d9b27a';g.fillRect(x-16,y-1,32,3);
  g.strokeStyle='rgba(60,35,15,.4)';g.lineWidth=.8;g.beginPath();for(let k=-14;k<20;k+=8){g.moveTo(x+k,y-22);g.lineTo(x+k,y-6);}g.stroke();
}
function drawDonkey(g,x,y,t){
  g.save();g.translate(x,y);
  g.fillStyle='rgba(35,22,10,.28)';ell(g,0,0,18,4);g.fill();
  g.strokeStyle='#5a4a3e';g.lineWidth=2.4;g.lineCap='round';g.beginPath();[-10,-6,7,11].forEach(px=>{g.moveTo(px,-12);g.lineTo(px,0);});g.stroke();
  g.fillStyle='#8a8077';ell(g,0,-16,15,8);g.fill();
  g.fillStyle='#a8322a';g.fillRect(-9,-24,16,10);g.fillStyle='#e3a23c';g.fillRect(-9,-19,16,2);
  g.fillStyle='#c9a46a';rr(g,-14,-22,7,12,2);g.fill();rr(g,7,-22,7,12,2);g.fill();
  g.fillStyle='#8a8077';g.beginPath();g.moveTo(12,-20);g.lineTo(20,-30);g.lineTo(26,-26);g.lineTo(18,-15);g.closePath();g.fill();
  ell(g,24,-27,5,4);g.fill();g.fillStyle='#d9d2c8';ell(g,27,-26,2.6,2.4);g.fill();
  g.fillStyle='#6d645c';poly(g,[19,-31,18,-40+Math.sin(t*2)*1.5,22,-32]);poly(g,[22,-31,24,-39,25,-31]);
  g.fillStyle='#2a1c12';circ(g,23,-28,.9);
  g.strokeStyle='#6d645c';g.lineWidth=1.6;g.beginPath();g.moveTo(-14,-17);g.quadraticCurveTo(-18,-12+Math.sin(t*2.5)*2,-17,-6);g.stroke();
  g.restore();
}

/* =========================================================
   FESTIVAL BUNTING after the falaj flows again (Omani colours)
   ========================================================= */
function drawBunting(g,t){
  if(!P.flags.boss2||scene.id!=='village')return;
  const L=MAP.lamps,pairs=[[0,1],[2,3],[0,2],[1,3]],cols=['#c0392b','#f4f1ea','#2f7d4a'];
  for(const [a,b] of pairs){
    const A=L[a],Bp=L[b],ax=A.x,ay=A.y-60,bx=Bp.x,by=Bp.y-60,sag=18;
    g.strokeStyle='rgba(60,40,20,.7)';g.lineWidth=1;g.beginPath();g.moveTo(ax,ay);g.quadraticCurveTo((ax+bx)/2,(ay+by)/2+sag*2,bx,by);g.stroke();
    const n=Math.round(Math.hypot(bx-ax,by-ay)/16);
    for(let i=1;i<n;i++){const k=i/n,u=1-k,x=u*u*ax+2*u*k*(ax+bx)/2+k*k*bx,y=u*u*ay+2*u*k*((ay+by)/2+sag*2)+k*k*by,sw=Math.sin(t*3+i)*1.2;
      g.fillStyle=cols[i%3];poly(g,[x-4,y,x+4,y,x+sw,y+8]);}
  }
}

/* ---- hooks used by update & render ---- */
function lifeTick(dt){scheduleTick();animalsTick(dt);}
function lifeDrawables(push){
  for(const a of ANIMALS)if(a.scene===scene.id)push({y:a.kind==='pigeon'&&a.z>0?a.y+400:a.y,x:a.x,draw:(g,t)=>drawAnimal(g,a,t)});
  if(scene.id==='village'){push({y:COOP.y,x:COOP.x,draw:g=>drawCoop(g)});if(PEDDLER.scene==='village')push({y:PEDDLER.y-2,x:PEDDLER.x+30,draw:(g,t)=>drawDonkey(g,PEDDLER.x+34,PEDDLER.y-2,t)});}
}

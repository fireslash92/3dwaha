// مجسّمات العالم: الأشجار والنخيل والصخور والشجيرات والأعمدة والأسوار والبيوت والنافورة
'use strict';

/* =========================================================
   3D PROPS (built once as prototypes, then stamped into the scene)
   ========================================================= */
const PROTO={};
const BARK='#6b4a2b',BARK2='#8a6238';
function protoOf(key,make,flat=true){return PROTO[key]||(PROTO[key]=makeProto(make(),flat));}

function oakProto(i){const p=OAK_PAL[i%3];return protoOf('oak'+i%3,()=>[
  shp(cyl(34,6,10,7),BARK,0,17,0),shp(cyl(14,3,4,5),BARK2,7,30,2,{r:[0,0,-.9]}),
  shp(ico(27,1),p.mid,0,60,2,{s:[1,.86,.95]}),shp(ico(19,1),p.dark,-20,50,6),shp(ico(20,1),p.dark,21,52,4),
  shp(ico(18,1),p.light,-8,72,-4),shp(ico(16,1),p.light,13,70,-8),shp(ico(13,1),p.hi,-2,82,-2),shp(ico(15,1),p.mid,0,50,-16)]);}
function pineProto(i,snow){const p=PINE_PAL[i%2];return protoOf('pine'+i%2+(snow?'s':''),()=>{
  const a=[shp(cyl(16,5,7,6),BARK,0,8,0)],tiers=[[62,26,24],[50,27,42],[38,26,60],[24,24,78]];
  tiers.forEach(([d,h,y],k)=>{a.push(shp(cyl(h,0,d,7),k%2?p.light:p.dark,0,y,0,{r:[0,k*.5,0]}));
    if(snow)a.push(shp(cyl(h*.5,0,d*.56,7),'#f4f8fa',0,y+h*.27,0,{r:[0,k*.5,0]}));});
  if(!snow)a.push(shp(cyl(10,0,9,6),p.hi,0,94,0));
  return a;});}
function palmProto(i){return protoOf('palm'+i%3,()=>{
  const lean=[.09,.02,-.07][i%3],a=[];let x=0,y=0;
  for(let k=0;k<6;k++){const h=14;a.push(shp(cyl(h+1,7.2-k*.5,8.4-k*.5,7),k%2?'#8a6a45':'#7a5a38',x,y+h/2,0,{r:[0,0,-lean*k*.5]}));x+=lean*k*h*.5;y+=h-.5;}
  a.push(shp(sph(11,6),'#6b4a2b',x,y+1,0));
  for(let f=0;f<9;f++){const ang=f/9*TAU+.3,dr=.5+(f%3)*.13,L=40+(f%2)*6,cx=Math.cos(ang),sz=Math.sin(ang);
    a.push(shp(sph(1,6),f%2?'#3f7a35':'#4f8f3e',x+cx*L*.42,y+6-L*.1*dr,sz*L*.42,{s:[L,2.4,11],r:[0,-ang,-dr*.55]}));
    a.push(shp(sph(1,5),f%2?'#356a2e':'#44803a',x+cx*L*.86,y-2-L*.36*dr,sz*L*.86,{s:[L*.55,2,8],r:[0,-ang,-dr*1.5]}));}
  [[-3,-3,2],[3,-4,-2],[0,-5,3]].forEach(q=>a.push(shp(sph(5,5),'#c9782b',x+q[0],y+q[1],q[2])));
  return a;});}
function acaciaProto(i){return protoOf('acacia'+i%3,()=>{const g=['#6f8a3a','#7d9444','#62803a'][i%3];return [
  shp(cyl(40,5,8,6),'#6a4a30',-3,19,0,{r:[0,0,.16]}),shp(cyl(26,3,5,5),'#6a4a30',8,48,0,{r:[0,0,-.75]}),shp(cyl(24,3,5,5),'#6a4a30',-14,48,0,{r:[0,0,.7]}),
  shp(ico(1,1),g,0,64,0,{s:[46,9,34]}),shp(ico(1,1),'#8aa24c',-18,71,-4,{s:[26,7,20]}),shp(ico(1,1),'#5a7632',20,69,6,{s:[28,7,22]})];});}
function frankProto(i){return protoOf('frank'+i%3,()=>{const g=['#8a9a5a','#7d9050','#94a462'][i%3];return [
  shp(cyl(22,6,10,6),'#b8a48a',0,11,0),shp(cyl(24,3,5,5),'#b8a48a',9,30,0,{r:[0,0,-.7]}),shp(cyl(24,3,5,5),'#a8947a',-9,30,2,{r:[0,0,.7]}),shp(cyl(20,2.5,4,5),'#b8a48a',0,34,-6,{r:[.5,0,0]}),
  shp(ico(13,1),g,17,44,0,{s:[1,.6,1]}),shp(ico(13,1),g,-17,45,2,{s:[1,.6,1]}),shp(ico(12,1),'#a2b06a',0,50,-9,{s:[1,.6,1]}),shp(ico(10,1),g,2,54,6,{s:[1,.6,1]})];});}
function mangroveProto(i){return protoOf('mangrove'+i%3,()=>{const c=[['#2f4f2a','#3f6a34','#5f8a44'],['#2a4a30','#3a643c','#5a8a52'],['#344a26','#46602e','#6a8a3e']][i%3],a=[];
  for(let k=0;k<7;k++){const an=k/7*TAU;a.push(shp(cyl(30,2,3,4),'#4a3a26',Math.cos(an)*9,12,Math.sin(an)*7,{r:[Math.sin(an)*.55,0,-Math.cos(an)*.55]}));}
  a.push(shp(cyl(26,5,6,6),'#5a4630',0,36,0),shp(ico(24,1),c[1],0,70,0,{s:[1,.75,.9]}),shp(ico(20,1),c[0],-22,58,4,{s:[1,.75,.9]}),shp(ico(19,1),c[0],20,60,2,{s:[1,.75,.9]}),shp(ico(15,1),c[2],-8,82,-4),shp(ico(14,1),c[2],13,80,-6));
  return a;});}
function deadProto(){return protoOf('dead',()=>[
  shp(cyl(30,4,7,5),'#5a4636',0,15,0),shp(cyl(26,2,4,4),'#5a4636',8,38,0,{r:[0,0,-.6]}),shp(cyl(24,2,4,4),'#4e3c2e',-8,37,1,{r:[0,0,.65]}),
  shp(cyl(16,1,2.4,4),'#5a4636',17,52,0,{r:[0,0,-1]}),shp(cyl(14,1,2.4,4),'#4e3c2e',-15,52,0,{r:[0,0,.2]}),shp(ico(1,1),'#f4f8fa',-8,49,0,{s:[9,2.4,5]}),shp(ico(1,1),'#f4f8fa',10,50,0,{s:[8,2.2,5]})]);}
function bushProto(v){return protoOf('bush'+v%2,()=>{const a=[shp(ico(10,1),'#355f2a',-8,8,0),shp(ico(10,1),'#3f6f2e',8,8,1),shp(ico(11,1),'#4f8336',0,14,-1),shp(ico(9,1),'#5f9a40',0,8,-7)];
  if(v%2)[[-6,13,-8],[5,16,-7],[9,9,-6],[-10,8,-6],[1,10,-13]].forEach(q=>a.push(shp(sph(3.2,5),'#d8443a',q[0],q[1],q[2])));
  else [[-5,17,-6],[6,12,-10]].forEach(q=>a.push(shp(ico(4,1),'#86b85a',q[0],q[1],q[2])));
  return a;});}
function tuftProto(kind,v){return protoOf(kind+v%2,()=>{const a=[];
  if(kind==='reeds'){for(let k=0;k<9;k++){const an=k*2.4,r=2+k%3*3;a.push(shp(cyl(30+k%4*5,0,2.2,4),v%2?'#7a8a4a':'#8a9a52',Math.cos(an)*r,16+k%4*2.5,Math.sin(an)*r,{r:[Math.sin(an)*.14,0,-Math.cos(an)*.14]}));}
    [[-5,33,0],[5,37,-2],[9,30,3]].forEach(q=>a.push(shp(sph(1,5),'#6b4a2b',q[0],q[1],q[2],{s:[3.4,9,3.4]})));}
  else if(kind==='fern'){for(let k=0;k<8;k++){const an=k/8*TAU+v;a.push(shp(sph(1,5),k%2?'#4f8a3a':'#3f7430',Math.cos(an)*9,7,Math.sin(an)*9,{s:[20,2,7],r:[0,-an,-.5]}));}}
  else{a.push(shp(ico(9,1),v%2?'#8a8a4a':'#7d7a42',-5,7,0,{s:[1,.75,1]}),shp(ico(8,1),'#9a964e',6,6,-2,{s:[1,.75,1]}),shp(ico(6,1),'#6f6a3a',0,11,2));}
  return a;});}
const ROCK_COL={snowrock:['#6e7880','#8a949c','#f4f8fa'],mudrock:['#5a4a36','#7a6a4e','#5f8a44'],mossrock:['#5a4a36','#7a6a4e','#5f8a44'],coral:['#c9b08a','#e6d2b0','#e07a63'],mesa:['#a8583a','#c9784a','#e0a070'],wadi:['#8a6a4e','#a98563',null]};
function rockProto(kind,v){const c=ROCK_COL[kind]||ROCK_COL.wadi;return protoOf('rock'+kind+v%2,()=>{
  if(kind==='mesa')return [shp(cyl(34,26,36,6),c[0],0,17,0,{r:[0,v,0]}),shp(cyl(4,28,27,6),c[2],0,35,0,{r:[0,v,0]}),shp(cyl(18,14,20,5),c[1],v%2?17:-16,9,-9)];
  const a=[shp(ico(1,1),c[0],0,9,0,{s:[23,v%2?22:26,17],r:[0,v*1.3,.12]}),shp(ico(1,1),c[1],v%2?-10:9,6,-8,{s:[13,12,11],r:[.3,v,0]})];
  if(c[2])a.push(shp(ico(1,1),c[2],v%2?3:-2,kind==='coral'?22:(v%2?27:31),-1,{s:[kind==='coral'?6:15,3.2,kind==='coral'?5:11]}));
  return a;});}
function lampProto(){return protoOf('lamp',()=>[
  shp(cyl(4,9,11,8),'#3a322c',0,2,0),shp(cyl(48,2.6,3.4,6),'#2f2924',0,26,0),shp(boxm(11,2,11),'#2f2924',0,50,0),
  shp(boxm(8,11,8),'#ffdf9a',0,56.5,0),shp(cyl(5,2,13,4),'#2f2924',0,64,0,{r:[0,Math.PI/4,0]}),shp(sph(2.4,5),'#2f2924',0,67.5,0)]);}
function benchProto(){return protoOf('bench',()=>[
  shp(boxm(42,3,13),'#9a6a3d',0,11,0),shp(boxm(42,10,2.4),'#8a5c33',0,20,5.5),shp(boxm(3,11,3),'#5a3a1c',-18,5.5,-4),shp(boxm(3,11,3),'#5a3a1c',18,5.5,-4),shp(boxm(3,24,3),'#5a3a1c',-18,12,5.5),shp(boxm(3,24,3),'#5a3a1c',18,12,5.5)]);}
function barrelProto(){return protoOf('barrel',()=>[shp(cyl(24,17,17,10),'#8a5c33',0,12,0),shp(cyl(12,20,20,10),'#9a6a3d',0,12,0),shp(cyl(2,20.6,20.6,10),'#4a4038',0,6,0),shp(cyl(2,20.6,20.6,10),'#4a4038',0,18,0),shp(cyl(.6,15,15,10),'#6a4526',0,24.2,0)],false);}
function crateProto(){return protoOf('crate',()=>[shp(boxm(24,18,22),'#a8794a',0,9,0),shp(boxm(25,3,23),'#7d5434',0,2,0),shp(boxm(25,3,23),'#7d5434',0,16.5,0),shp(boxm(3,18,23),'#7d5434',-11,9,0),shp(boxm(3,18,23),'#7d5434',11,9,0)]);}
function columnProto(v){return protoOf('column'+v%2,()=>v%2?[shp(cyl(5,22,24,8),'#b8a078',0,2.5,0),shp(cyl(34,15,17,8),'#cdb890',0,22,0),shp(cyl(8,11,15,6),'#b8a078',3,42,0,{r:[0,0,.2]})]
  :[shp(cyl(5,22,24,8),'#b8a078',0,2.5,0),shp(cyl(58,14,17,8),'#cdb890',0,34,0),shp(cyl(5,21,15,8),'#b8a078',0,65,0),shp(boxm(22,4,22),'#a8906a',0,69,0)]);}
function crystalProto(kind,v){return protoOf('cr'+kind+v%3,()=>{
  if(kind==='mushroom'){const c=['#7be0c0','#9ad0ff','#c8a0ff'][v%3];return [[0,20,10],[-8,12,7],[8,9,6]].flatMap(([x,h,r])=>[shp(cyl(h,2.2,3,5),'#d8e8dc',x,h/2,0),shp(sph(1,6),c,x,h,0,{s:[r*2,r*1.1,r*2]})]);}
  if(kind==='coralp'){const c=['#e07a63','#d2577a','#f2b33c'][v%3],a=[shp(cyl(18,3.5,5,5),c,0,9,0)];[[-.5,10,22],[.45,-9,24],[-.1,2,34]].forEach(([r,x,y])=>a.push(shp(cyl(16,2,3.4,5),c,x,y,0,{r:[0,0,r]})));return a;}
  const c=['#bfe3f0','#9fd0ea','#d8f0fa'][v%3];return [[-8,28,12,.2],[2,46,15,0],[10,24,10,-.25]].map(([x,h,d,r],k)=>shp(cyl(h,0,d,5),k===1?c:'#8fc2dc',x,h/2,0,{r:[0,k,r]}));});}

function treeProto(kind,v){
  return kind==='pine'?pineProto(v):kind==='snowpine'?pineProto(v,true):kind==='palm'?palmProto(v):kind==='acacia'?acaciaProto(v):
    kind==='frank'?frankProto(v):kind==='mangrove'?mangroveProto(v):kind==='dead'?deadProto():oakProto(v);
}

/* ---------- houses: the painted front is kept, the body and roof are built around it ---------- */
function houseFacade(h,spr){
  const pad=2,cv=document.createElement('canvas'),s=spr.cv.width/spr.w;
  cv.width=spr.cv.width;cv.height=spr.cv.height;cv.getContext('2d').drawImage(spr.cv,0,0);
  return {cv,u:x=>(x+spr.ox)/spr.w,v:y=>(y+spr.oy)/spr.h,s,pad};
}
function buildHouse(geo,h,spr,depth,list){
  const W=h.w,Hh=h.wallH,x0=h.x,zf=-h.base,zb=zf+depth,F=houseFacade(h,spr),mat=canvasMat('house'+h.x,F.cv);
  const flat=!!h.arish,rise=flat?0:Math.min(46,h.roofH*.6),ov=flat?4:14,wall=flat?'#b8935a':'#e6cfa2',wallSh=flat?'#96763f':'#c9ae80';
  // front wall, straight from the drawing
  const front=texQuad('hf',[x0,Hh,zf],[x0+W,Hh,zf],[x0+W,0,zf],[x0,0,zf],[F.u(0),F.v(-Hh),F.u(W),F.v(0)],mat,[0,.55,-.83]);
  list.push(front);glCast(front);front.receiveShadows=true;
  // side and back walls
  geo.quad([x0,Hh,zb],[x0,Hh,zf],[x0,0,zf],[x0,0,zb],wallSh);geo.quad([x0+W,Hh,zf],[x0+W,Hh,zb],[x0+W,0,zb],[x0+W,0,zf],wallSh);
  geo.quad([x0,Hh,zb],[x0+W,Hh,zb],[x0+W,0,zb],[x0,0,zb],wall);
  if(flat){
    geo.box(x0+W/2,Hh-1,zf+depth/2,W+ov*2,5,depth+ov*2,'#a8834e','#b9975c');
    const top=texQuad('hr',[x0-ov,Hh+h.roofH*.5,zf-ov+2],[x0+W+ov,Hh+h.roofH*.5,zf-ov+2],[x0+W+ov,Hh-2,zf-ov],[x0-ov,Hh-2,zf-ov],[F.u(-ov),F.v(-Hh-h.roofH-8),F.u(W+ov),F.v(-Hh+4)],mat,[0,.6,-.8]);
    list.push(top);
    return;
  }
  // hipped roof: the front slope carries the drawn tiles, the rest is coloured
  const eave=Hh-6,ridge=Hh+rise,zm=zf+depth/2,r0=h.roof?h.roof[0]:'#d0693f',r1=h.roof?h.roof[1]:'#a5432a',in9=20;
  const slope=texQuad('hr',[x0-ov+2,ridge,zm],[x0+W+ov-2,ridge,zm],[x0+W+ov,eave,zf-ov],[x0-ov,eave,zf-ov],[F.u(-ov),F.v(-Hh-h.roofH),F.u(W+ov),F.v(-Hh+7)],mat,[0,.8,-.6]);
  list.push(slope);glCast(slope);
  const back=texQuad('hb',[x0-ov+2,ridge,zm],[x0+W+ov-2,ridge,zm],[x0+W+ov,eave,zb+ov],[x0-ov,eave,zb+ov],[F.u(-ov),F.v(-Hh-h.roofH),F.u(W+ov),F.v(-Hh+7)],mat,[0,.8,.6]);list.push(back);
  geo.quad([x0-ov+in9,ridge,zm],[x0-ov+in9,ridge,zm],[x0-ov,eave,zf-ov],[x0-ov,eave,zb+ov],r1);
  geo.quad([x0+W+ov-in9,ridge,zm],[x0+W+ov-in9,ridge,zm],[x0+W+ov,eave,zb+ov],[x0+W+ov,eave,zf-ov],r1);
  geo.quad([x0-ov,eave,zf-ov],[x0+W+ov,eave,zf-ov],[x0+W+ov,eave,zb+ov],[x0-ov,eave,zb+ov],'#5b3820');
  if(h.snow){geo.quad([x0-ov+in9,ridge+1.5,zm],[x0+W+ov-in9,ridge+1.5,zm],[x0+W+ov-6,eave+rise*.45,zf+depth*.18],[x0-ov+6,eave+rise*.45,zf+depth*.18],'#f4f8fa');}
  // chimney
  const cx=x0+W*.78;geo.box(cx,ridge-rise*.5,zm+depth*.12,16,rise*.5+16,14,'#9a8670','#6f6456');
  h.smoke3={x:cx,y:ridge+18,z:zm+depth*.12};
}

/* ---------- the plaza fountain ---------- */
function buildFountain(F,list){
  const sc=GL.scene,root=new BABYLON.TransformNode('fountain',sc);root.position.set(F.x,0,-F.y);root.scaling.z=42/66;
  const stone=protoMesh(makeProto([
    shp(cyl(13,128,134,22),'#b9ad98',0,6.5,0),shp(cyl(3,134,134,22),'#d2c8b4',0,13.5,0),shp(cyl(4,140,140,22),'#9a8e7a',0,2,0),
    shp(cyl(34,12,17,10),'#c9bda6',0,17,0),shp(cyl(5,38,12,12),'#b9ad98',0,36.5,0),shp(cyl(3,40,38,12),'#d2c8b4',0,40.5,0),shp(cyl(16,7,9,8),'#c9bda6',0,48,0),shp(sph(9,8),'#d9cdb6',0,58,0)],false),'fstone');
  stone.parent=root;stone.receiveShadows=true;glCast(stone);list.push(stone);
  const wm=new BABYLON.StandardMaterial('water',sc);wm.diffuseColor=col3('#3f8fae');wm.emissiveColor=col3('#16485c');wm.specularColor=new BABYLON.Color3(.9,.9,.8);wm.specularPower=48;wm.alpha=.86;if(GL.matSink)GL.matSink.push(wm);
  const water=MB().CreateDisc('fw',{radius:59,tessellation:24},sc);water.rotation.x=Math.PI/2;water.position.y=15.6;water.parent=root;water.material=wm;list.push(water);
  const bowl=MB().CreateDisc('fb',{radius:17,tessellation:14},sc);bowl.rotation.x=Math.PI/2;bowl.position.y=41.6;bowl.parent=root;bowl.material=wm;list.push(bowl);
  // falling water
  let ps=null;
  if(glQuality()){
    ps=new BABYLON.ParticleSystem('jet',GL.coarse?90:160,sc);ps.particleTexture=GL.dropTex||(GL.dropTex=(()=>{const t=new BABYLON.DynamicTexture('drop',{width:16,height:16},sc,false),g=t.getContext();const gr=g.createRadialGradient(8,8,0,8,8,8);gr.addColorStop(0,'rgba(240,252,255,1)');gr.addColorStop(1,'rgba(200,236,255,0)');g.fillStyle=gr;g.fillRect(0,0,16,16);t.update();t.hasAlpha=true;return t;})());
    ps.emitter=V3(F.x,60,-F.y);ps.minEmitBox=V3(-1,0,-1);ps.maxEmitBox=V3(1,0,1);
    ps.direction1=V3(-26,34,-20);ps.direction2=V3(26,48,20);ps.gravity=V3(0,-150,0);ps.minLifeTime=.5;ps.maxLifeTime=.85;ps.minSize=2;ps.maxSize=4.5;ps.emitRate=GL.coarse?70:130;
    ps.color1=new BABYLON.Color4(.9,.97,1,.9);ps.color2=new BABYLON.Color4(.75,.9,1,.7);ps.colorDead=new BABYLON.Color4(.8,.95,1,0);ps.blendMode=BABYLON.ParticleSystem.BLENDMODE_STANDARD;ps.minEmitPower=1;ps.maxEmitPower=1.2;ps.updateSpeed=.016;
    ps.start();list.push(ps);
  }
  return {water,bowl,ps,root};
}

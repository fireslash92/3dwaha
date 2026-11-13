// ساحة المعركة ثلاثية الأبعاد: أرض وأشجار وصخور من بيئة المنطقة، ناصر وعائشة مجسّمان، والوحوش لوحات حيّة واقفة في الساحة
'use strict';

/* =========================================================
   3D BATTLE ARENA
   The battle keeps its own stage coordinates (x across, y = depth). A long-lens camera is placed so
   that the 3D arena lines up with them, which lets hit sparks, numbers and marks stay on the 2D layer.
   ========================================================= */
const GLB={B:null,own:[],mats:[],figs:{},en:new Map(),pet:null,Z0:40000};
const BT=.45,BSIN=Math.sin(BT),BCOS=Math.cos(BT),BFOV=.24;
const bZ=y=>GLB.Z0-(y-220)/BSIN;
function battleColors(){
  const W2=scene.wadi||scene.fort;
  return scene.area&&BIOMES[scene.biome].bt?BIOMES[scene.biome].bt:W2?{s0:'#6b3f2a',s1:'#d39a62',r0:'#7a4a32',r1:'#a8694a',g0:'#d8bf8e',g1:'#b8956a',grass:'rgba(120,90,55,.5)'}:{s0:'#16261a',s1:'#2e4a2c',r0:'#1b2c1b',r1:'#24391f',g0:'#4f6e37',g1:'#2c421e',grass:'rgba(30,50,20,.6)'};
}
function glBattleEnd(){
  if(!GLB.B)return;
  for(const m of GLB.own)m.dispose();for(const m of GLB.mats)m.dispose(true,true);
  for(const k in GLB.figs)disposeFigure(GLB.figs[k]);
  GLB.own=[];GLB.mats=[];GLB.figs={};GLB.en.clear();GLB.pet=null;GLB.B=null;W3.snap=true;
}
function glBattleBuild(){
  GLB.B=B;const s=GL.scene,C=battleColors(),Z0=GLB.Z0,sink=GL.matSink;GL.matSink=GLB.mats;
  // far ground, and a painted patch under the fighters
  const far=new BABYLON.StandardMaterial('bfar',s);far.diffuseColor=col3(C.g1);far.specularColor=BABYLON.Color3.Black();GLB.mats.push(far);
  const big=MB().CreateGround('bground',{width:5000,height:5000},s);big.position.set(0,-.6,Z0);big.material=far;big.receiveShadows=true;GLB.own.push(big);
  const PW=1100,PH=820,cv=document.createElement('canvas');cv.width=PW;cv.height=PH;const g=cv.getContext('2d'),R=mulberry(31+scene.W);
  const gr=g.createRadialGradient(PW/2,PH/2,40,PW/2,PH/2,PW*.5);gr.addColorStop(0,C.g0);gr.addColorStop(.75,C.g1);gr.addColorStop(1,C.g1);g.fillStyle=gr;g.fillRect(0,0,PW,PH);
  g.fillStyle='rgba(140,115,75,.45)';ell(g,PW/2,PH/2+8,212,100);g.fill();g.fillStyle='rgba(255,240,200,.06)';ell(g,PW/2-30,PH/2-10,150,60);g.fill();
  g.strokeStyle=C.grass;g.lineWidth=1.4;g.beginPath();for(let i=0;i<900;i++){const x=R()*PW,y=R()*PH;g.moveTo(x,y);g.lineTo(x-2,y-7);g.moveTo(x,y);g.lineTo(x+2,y-7);}g.stroke();
  for(let i=0;i<260;i++){g.fillStyle=i%2?'rgba(0,0,0,.08)':'rgba(255,255,255,.08)';circ(g,R()*PW,R()*PH,1+R()*2.4);}
  const eg=g.createRadialGradient(PW/2,PH/2,PW*.3,PW/2,PH/2,PW*.52);eg.addColorStop(0,'rgba(0,0,0,0)');eg.addColorStop(1,C.g1);g.fillStyle=eg;g.fillRect(0,0,PW,PH);
  const pm=canvasMat('bpatch',cv);pm.alphaCutOff=0;
  const patch=texQuad('bpatch',[-PW/2,0,Z0+PH/2],[PW/2,0,Z0+PH/2],[PW/2,0,Z0-PH/2],[-PW/2,0,Z0-PH/2],[0,0,1,1],pm);patch.receiveShadows=true;GLB.own.push(patch);
  // scenery from the land we are fighting in
  const geo=new Geo(),B0=scene.area?BIOMES[scene.biome]:null,dark=!!scene.dark;
  const tree=B0?(B0.tree||(dark?null:'snowpine')):scene.wadi||scene.fort?'palm':null,rock=B0?(B0.rock==='pillar'?'col':B0.rock||'snowrock'):scene.wadi||scene.fort?'wadi':null;
  const put=(x,z)=>{const r=R(),sz=1.7+R()*.5;
    if(dark){if(r<.55)geo.add(crystalProto(B0.crystal==='brazier'?'crystal':B0.crystal||'crystal',(r*30)|0),x,0,z,R()*TAU,sz*1.3);else geo.add(rockProto('mudrock',(r*9)|0),x,0,z,R()*TAU,sz,sz,sz,hex3(B0.wall[2]));return;}
    if(r<.62)geo.add(tree?treeProto(tree,(r*40)|0):treeProto(r<.3?'pine':'oak',(r*40)|0),x,0,z,R()*TAU,sz);
    else if(r<.85&&rock)geo.add(rock==='col'?columnProto((r*20)|0):rockProto(rock,(r*20)|0),x,0,z,R()*TAU,sz*.9);
    else geo.add(B0&&B0.bare?tuftProto(B0.bare,(r*20)|0):bushProto((r*20)|0),x,0,z,R()*TAU,sz);};
  for(let i=0;i<46;i++){const x=(R()-.5)*1300,z=Z0+175+R()*430;put(x,z);}
  for(let i=0;i<10;i++){const sd=i%2?1:-1;put(sd*(380+R()*260),Z0-120+R()*280);}
  if(dark){const wc=hex3(B0.wall[1]),f='#'+wc.map(v=>Math.round(v*170).toString(16).padStart(2,'0')).join('');for(let i=-9;i<=9;i++)geo.box(i*80,0,Z0+640+((i*7)%3)*18,82,150+((i*5)%4)*26,60,f,B0.wall[1]);}
  GLB.own.push(...geo.finish(true));
  GL.matSink=sink;
  // the party
  members().forEach(id=>{const f=id==='hero'?heroFigure():makeFigure(LOOKS.aisha,'','b_aisha');f.yaw=DIR_YAW.left;f.root.scaling.scaleInPlace(1.82);GLB.figs[id]=f;});
}
function battleSprite(key,L,Rr,up,dn){
  let sp=GLB.en.get(key);
  const s=Math.min(2.5,Math.max(1,view.dpr*stageDims().sc*1.05));
  if(sp&&Math.abs(sp.s-s)>.3){sp.mesh.dispose();sp.mat.dispose(true,true);GLB.en.delete(key);sp=null;}
  if(!sp){
    const cv=document.createElement('canvas');cv.width=Math.ceil((L+Rr)*s);cv.height=Math.ceil((up+dn)*s);
    const sink=GL.matSink;GL.matSink=GLB.mats;const mat=canvasMat('en',cv,true);GL.matSink=sink;
    const H=(up+dn)/BCOS,mesh=texQuad('en',[-L,H,0],[Rr,H,0],[Rr,0,0],[-L,0,0],[0,0,1,1],mat);GLB.own.push(mesh);
    sp={cv,g:cv.getContext('2d'),s,mat,mesh,L,up,dn};GLB.en.set(key,sp);
  }
  return sp;
}
function battleSpriteDraw(sp,x,y,SW,draw){
  const g=sp.g,s=sp.s;g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,sp.cv.width,sp.cv.height);g.setTransform(s,0,0,s,-(x-sp.L)*s,-(y-sp.up)*s);
  try{draw(g);}catch(_){}
  sp.mat.diffuseTexture.update(true);sp.mesh.position.set(x-SW/2,0,bZ(y+sp.dn));
}
// returns true when the arena was drawn in 3D (the caller then draws only sparks and numbers on top)
function glBattle(t,so,z,fx0,fy0){
  if(!GL.ok)return false;
  if(GLB.B!==B){glBattleEnd();glBattleBuild();}
  const {sc,ox,oy,SW}=stageDims(),cam=GL.cam,Z0=GLB.Z0;
  // camera: line the arena up with the stage coordinates
  const k=sc*z,xc=(view.w/2-(ox+so[0])-sc*fx0*(1-z))/k,yc=(view.h/2-(oy+so[1])-sc*fy0*(1-z))/k,D=view.h/(2*k*Math.tan(BFOV/2));
  const tx=xc-SW/2+Math.sin(t*.35)*3,tz=bZ(yc);
  cam.fov=BFOV;cam.position.set(tx,D*BSIN,tz-D*BCOS);cam.setTarget(V3(tx,0,tz));
  // light
  const n=(scene.dark?.8:scene.interior?0:nightAmount())*.6,du=scene.dark?0:duskAmount(),sun=GL.sun,d=sun.direction;
  sun.intensity=.7*(1-n)+.08;sun.diffuse.set(1,mix(.95,.66,du),mix(.84,.42,du));
  GL.hemi.intensity=mix(.62,.46,n);GL.hemi.diffuse.set(mix(1,.5,n),mix(.97,.58,n),mix(.92,.95,n));GL.hemi.groundColor.set(mix(.6,.2,n),mix(.55,.22,n),mix(.45,.36,n));
  GL.sg.darkness=mix(.38,.7,n);
  sun.position.set(-d.x*1500,-d.y*1500,Z0-d.z*1500);sun.orthoLeft=-520;sun.orthoRight=520;sun.orthoTop=520;sun.orthoBottom=-520;
  if(W3.lantern)W3.lantern.setEnabled(false);
  const C=battleColors(),fc=hex3(C.g1),li=mix(.95,.4,n);
  GL.scene.clearColor.set(fc[0]*li,fc[1]*li,fc[2]*mix(1,1.4,n)*li,1);GL.scene.fogColor.set(fc[0]*li,fc[1]*li,fc[2]*mix(1,1.4,n)*li);GL.scene.fogStart=D+260;GL.scene.fogEnd=D+760;
  // party
  for(const id of members()){
    const f=GLB.figs[id];if(!f)continue;
    const m=B.m[id],p=mPos(id),ha=time-m.actT,hh=time-m.hitT,ko=mHP(id)<=0;let dx=0,dy=0;
    const lunging=m.act==='lunge'&&ha<.5;
    if(lunging)dx=-Math.sin(ha/.5*Math.PI)*46;
    if(m.act==='cast'&&ha<.6)dy=Math.sin(ha/.6*Math.PI)*10;
    if(m.act==='win')dy=Math.abs(Math.sin(ha*6+(id==='aisha'?1:0)))*10*Math.max(0,1-ha/2.5);
    if(hh<.35)dx+=Math.sin(hh*70)*3;
    poseFigure(f,p.x-SW/2+dx,0,'left',lunging,lunging?ha*20:0,.016,t,id==='hero'?0:2);
    f.root.position.set(p.x-SW/2+dx,ko?2:dy,bZ(p.y));
    f.root.rotation.x=ko?-1.35:0;
    const cast=m.act==='cast'&&ha<.6,win=m.act==='win'&&ha<2.5;
    if(cast||win){f.armL.rotation.x=-2.4;f.armR.rotation.x=f.cane?-.25:-2.4;}else if(lunging){f.armR.rotation.x=-1.6+Math.sin(ha/.5*Math.PI)*1.2;}
    f.root.setEnabled(!(hh<.35&&Math.floor(hh*20)%2&&!ko));
  }
  // monsters and the tamed companion: their own drawings, standing in the arena
  const seen=new Set();
  B.enemies.forEach((e,i)=>{
    if(e.dieT!=null&&time-e.dieT>.6)return;
    const boss=!!e.d.boss,sp=battleSprite('e'+i+(boss?'b':''),boss?150:90,boss?160:110,boss?230:140,boss?26:16);
    seen.add(sp);sp.mesh.setEnabled(true);battleSpriteDraw(sp,e.x,e.y,SW,g=>drawEnemy(g,e,t));
  });
  if(B.pet&&(B.pet.hp>0||time-B.m.pet.hitT<.6)){const sp=battleSprite('pet',90,90,130,16);seen.add(sp);sp.mesh.setEnabled(true);battleSpriteDraw(sp,B.px,B.py,SW,g=>drawPetStage(g,t));}
  for(const sp of GLB.en.values())if(!seen.has(sp))sp.mesh.setEnabled(false);
  GL.scene.render();
  return true;
}

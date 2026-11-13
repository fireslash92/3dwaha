// محرّك العرض ثلاثي الأبعاد (Babylon.js): المشهد، الكاميرا، الإضاءة والظلال، وأدوات بناء المجسّمات
'use strict';

/* =========================================================
   3D ENGINE (Babylon.js)
   World units are the game's own pixels: X = x, Z = -y, Y = up.
   The camera always looks north, so backs of things are never built.
   ========================================================= */
const GL={ok:false,engine:null,scene:null,cam:null,sun:null,hemi:null,sg:null,canvas:null,
  built:null,fps:60,scale:1,slowT:0,tgt:{x:576,y:430},mats:{},tex:{}};
const PITCH=.76, FOV=.3;                       // camera tilt below the horizon, vertical field of view
const hex3=h=>{const n=parseInt(h.slice(1),16);return h.length===4?[(n>>8&15)/15,(n>>4&15)/15,(n&15)/15]:[(n>>16&255)/255,(n>>8&255)/255,(n&255)/255];};
const col3=h=>{const c=hex3(h);return new BABYLON.Color3(c[0],c[1],c[2]);};
const V3=(x,y,z)=>new BABYLON.Vector3(x,y,z);
const glQuality=()=>OPT.quality==='saver'?0:1;

function glInit(){
  if(typeof BABYLON==='undefined')return;
  const cv=$('view3d');
  try{
    const coarse=matchMedia('(pointer:coarse)').matches;
    const e=new BABYLON.Engine(cv,!coarse,{preserveDrawingBuffer:false,stencil:false,antialias:!coarse,powerPreference:'high-performance',doNotHandleContextLost:true},false);
    const s=new BABYLON.Scene(e);
    s.skipPointerMovePicking=true;s.autoClear=true;s.blockMaterialDirtyMechanism=false;
    s.clearColor=new BABYLON.Color4(.13,.19,.1,1);
    s.ambientColor=new BABYLON.Color3(1,1,1);
    const cam=new BABYLON.FreeCamera('cam',V3(576,500,-1000),s);cam.fov=FOV;cam.minZ=20;cam.maxZ=6000;
    const hemi=new BABYLON.HemisphericLight('hemi',V3(0,1,0),s);hemi.specular=BABYLON.Color3.Black();
    const sun=new BABYLON.DirectionalLight('sun',V3(.42,-1,.5).normalize(),s);sun.specular=BABYLON.Color3.Black();
    sun.autoUpdateExtends=false;sun.autoCalcShadowZBounds=false;sun.shadowMinZ=10;sun.shadowMaxZ=3200;
    Object.assign(GL,{engine:e,scene:s,cam,hemi,sun,canvas:cv,coarse,ok:true});
    glShadows();
    // materials shared by everything that is built from coloured geometry
    const solid=new BABYLON.StandardMaterial('solid',s);solid.specularColor=BABYLON.Color3.Black();solid.backFaceCulling=false;GL.mats.solid=solid;
    const skin=new BABYLON.StandardMaterial('people',s);skin.specularColor=new BABYLON.Color3(.06,.05,.04);skin.specularPower=12;GL.mats.people=skin;
    GL.glowTex=glGlowTexture();
    cv.addEventListener('webglcontextlost',ev=>{ev.preventDefault();GL.ok=false;cv.hidden=true;});
  }catch(err){console.warn('3D unavailable, staying in 2D',err);GL.ok=false;cv.hidden=true;}
}
function glShadows(){
  if(GL.sg){GL.sg.dispose();GL.sg=null;}
  const size=glQuality()?(GL.coarse?1024:2048):512;
  const sg=new BABYLON.ShadowGenerator(size,GL.sun);
  if(GL.engine.webGLVersion>1&&glQuality()){sg.usePercentageCloserFiltering=true;sg.filteringQuality=GL.coarse?BABYLON.ShadowGenerator.QUALITY_LOW:BABYLON.ShadowGenerator.QUALITY_MEDIUM;}
  else sg.usePoissonSampling=true;
  sg.bias=.0025;sg.normalBias=.012;sg.darkness=.42;sg.transparencyShadow=false;
  GL.sg=sg;GL.shadowQ=glQuality();
  if(GL.casters)for(const m of GL.casters)sg.addShadowCaster(m,false);
}
function glCast(m){(GL.casters||(GL.casters=new Set())).add(m);GL.sg.addShadowCaster(m,false);m.onDisposeObservable.add(()=>GL.casters.delete(m));}
function glGlowTexture(){
  const t=new BABYLON.DynamicTexture('glow',{width:64,height:64},GL.scene,false),g=t.getContext();
  const gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,214,140,1)');gr.addColorStop(.35,'rgba(255,180,90,.5)');gr.addColorStop(1,'rgba(255,160,70,0)');
  g.fillStyle=gr;g.fillRect(0,0,64,64);t.update();t.hasAlpha=true;return t;
}
function glResize(){
  if(!GL.ok)return;
  const cap=glQuality()?(GL.coarse?1.6:2):1.1;
  GL.scale=Math.min(window.devicePixelRatio||1,cap)*(GL.auto||1);
  GL.engine.setHardwareScalingLevel(1/GL.scale);GL.engine.resize();
}
// when the frame rate stays low, render fewer pixels instead of dropping frames
function glAdapt(dt){
  GL.fps+=(1/Math.max(dt,.001)-GL.fps)*.05;
  if(GL.fps<27&&time>3){GL.slowT+=dt;if(GL.slowT>2.5&&(GL.auto||1)>.55){GL.auto=(GL.auto||1)*.82;GL.slowT=0;GL.fps=40;glResize();}}else GL.slowT=0;
}

/* ---------- geometry accumulator: many coloured shapes, one draw call ---------- */
function Geo(){this.p=[];this.n=[];this.c=[];this.i=[];this.out=[];}
Geo.prototype.flush=function(){
  if(!this.i.length)return;
  const m=new BABYLON.Mesh('geo',GL.scene),vd=new BABYLON.VertexData();
  vd.positions=this.p;vd.normals=this.n;vd.colors=this.c;vd.indices=this.i;vd.applyToMesh(m);
  this.out.push(m);this.p=[];this.n=[];this.c=[];this.i=[];
};
// place a prototype shape: position, turn around Y, scale, optional tint
Geo.prototype.add=function(pr,x,y,z,ry=0,sx=1,sy=sx,sz=sx,tint){
  const P=pr.p,N=pr.n,C=pr.c,nv=P.length/3;
  if(this.p.length/3+nv>60000)this.flush();
  const b=this.p.length/3,cs=Math.cos(ry),sn=Math.sin(ry),tr=tint?tint[0]:1,tg=tint?tint[1]:1,tb=tint?tint[2]:1;
  for(let k=0;k<nv;k++){
    const px=P[k*3]*sx,py=P[k*3+1]*sy,pz=P[k*3+2]*sz;
    this.p.push(x+px*cs+pz*sn,y+py,z-px*sn+pz*cs);
    const nx=N[k*3],ny=N[k*3+1],nz=N[k*3+2];
    this.n.push(nx*cs+nz*sn,ny,-nx*sn+nz*cs);
    this.c.push(C[k*4]*tr,C[k*4+1]*tg,C[k*4+2]*tb,1);
  }
  for(let k=0;k<pr.i.length;k++)this.i.push(b+pr.i[k]);
};
// a flat four-cornered face (corners given clockwise as seen from outside)
Geo.prototype.quad=function(a,b,c,d,col,col2){
  if(this.p.length/3>59990)this.flush();
  const k=this.p.length/3,ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2],vx=d[0]-a[0],vy=d[1]-a[1],vz=d[2]-a[2];
  let nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;
  if(Math.hypot(nx,ny,nz)<1e-6){const wx=c[0]-a[0],wy=c[1]-a[1],wz=c[2]-a[2];nx=wy*vz-wz*vy;ny=wz*vx-wx*vz;nz=wx*vy-wy*vx;}
  const l=Math.hypot(nx,ny,nz)||1;nx/=l;ny/=l;nz/=l;
  if(ny<-.001||(Math.abs(ny)<.001&&nz>0)){nx=-nx;ny=-ny;nz=-nz;}       // faces look up or toward the camera
  const c1=typeof col==='string'?hex3(col):col,c2=col2?(typeof col2==='string'?hex3(col2):col2):c1;
  [a,b,c,d].forEach((q,j)=>{this.p.push(q[0],q[1],q[2]);this.n.push(nx,ny,nz);const cc=j<2?c1:c2;this.c.push(cc[0],cc[1],cc[2],1);});
  this.i.push(k,k+1,k+2,k,k+2,k+3);
};
// a box seen from the south: top, front and both sides (cx,cz = centre, y0 = bottom)
Geo.prototype.box=function(cx,y0,cz,w,h,d,col,top){
  const x0=cx-w/2,x1=cx+w/2,z0=cz-d/2,z1=cz+d/2,y1=y0+h,c=hex3(col),sh=[c[0]*.78,c[1]*.78,c[2]*.8],t=top?hex3(top):[Math.min(1,c[0]*1.08),Math.min(1,c[1]*1.08),Math.min(1,c[2]*1.06)];
  this.quad([x0,y1,z0],[x1,y1,z0],[x1,y0,z0],[x0,y0,z0],c);
  this.quad([x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0],t);
  this.quad([x0,y1,z1],[x0,y1,z0],[x0,y0,z0],[x0,y0,z1],sh);
  this.quad([x1,y1,z0],[x1,y1,z1],[x1,y0,z1],[x1,y0,z0],sh);
};
Geo.prototype.finish=function(cast=true){
  this.flush();
  for(const m of this.out){m.material=GL.mats.solid;m.receiveShadows=true;m.freezeWorldMatrix();m.doNotSyncBoundingInfo=true;if(cast)glCast(m);}
  return this.out;
};

/* ---------- prototypes: small coloured shapes assembled from primitives ---------- */
const MB=()=>BABYLON.MeshBuilder;
function shp(m,c,x=0,y=0,z=0,o){m.position.set(x,y,z);if(o){if(o.s)m.scaling.set(o.s[0],o.s[1],o.s[2]);if(o.r)m.rotation.set(o.r[0],o.r[1],o.r[2]);}return {m,c};}
const sph=(d,seg=8)=>MB().CreateSphere('s',{diameter:d,segments:seg},GL.scene);
const ico=(r,sub=1)=>MB().CreateIcoSphere('i',{radius:r,subdivisions:sub,flat:false},GL.scene);
const cyl=(h,dt,db,tess=8)=>MB().CreateCylinder('c',{height:h,diameterTop:dt,diameterBottom:db,tessellation:tess},GL.scene);
const boxm=(w,h,d)=>MB().CreateBox('b',{width:w,height:h,depth:d},GL.scene);
const tor=(d,th,tess=12)=>MB().CreateTorus('t',{diameter:d,thickness:th,tessellation:tess},GL.scene);
function makeProto(items,flat){
  const ms=items.map(it=>{
    const m=it.m;m.bakeCurrentTransformIntoVertices();
    const n=m.getTotalVertices(),col=new Float32Array(n*4),c=hex3(it.c);
    for(let i=0;i<n;i++){col[i*4]=c[0];col[i*4+1]=c[1];col[i*4+2]=c[2];col[i*4+3]=1;}
    m.setVerticesData(BABYLON.VertexBuffer.ColorKind,col);return m;
  });
  const mm=ms.length>1?BABYLON.Mesh.MergeMeshes(ms,true,true):ms[0];
  if(flat)mm.convertToFlatShadedMesh();
  const K=BABYLON.VertexBuffer,pr={p:mm.getVerticesData(K.PositionKind),n:mm.getVerticesData(K.NormalKind),c:mm.getVerticesData(K.ColorKind),i:mm.getIndices()};
  mm.dispose();return pr;
}
function protoMesh(pr,name,mat){
  const m=new BABYLON.Mesh(name,GL.scene),vd=new BABYLON.VertexData();
  vd.positions=pr.p;vd.normals=pr.n;vd.colors=pr.c;vd.indices=pr.i;vd.applyToMesh(m);m.material=mat||GL.mats.solid;return m;
}
// a textured upright or sloped rectangle; uv = [u0,v0,u1,v1] with v measured from the top of the picture
function texQuad(name,a,b,c,d,uv,mat,nrm){
  const m=new BABYLON.Mesh(name,GL.scene),vd=new BABYLON.VertexData(),n=nrm||[0,1,0];
  vd.positions=[...a,...b,...c,...d];vd.normals=[...n,...n,...n,...n];
  vd.uvs=[uv[0],1-uv[1],uv[2],1-uv[1],uv[2],1-uv[3],uv[0],1-uv[3]];vd.indices=[0,1,2,0,2,3];
  vd.applyToMesh(m);m.material=mat;return m;
}
// a material that shows a 2D drawing with see-through edges, lit like the ground
function canvasMat(name,cv,blend){
  const t=new BABYLON.DynamicTexture(name,cv,GL.scene,false,BABYLON.Texture.BILINEAR_SAMPLINGMODE);
  t.hasAlpha=true;t.wrapU=t.wrapV=BABYLON.Texture.CLAMP_ADDRESSMODE;t.update(true);
  const m=new BABYLON.StandardMaterial(name,GL.scene);m.diffuseTexture=t;m.specularColor=BABYLON.Color3.Black();m.backFaceCulling=false;
  if(blend){m.useAlphaFromDiffuseTexture=true;m.disableDepthWrite=true;}else m.alphaCutOff=.35;
  return m;
}

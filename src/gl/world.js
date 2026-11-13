// تحويل كل مشهد إلى عالم ثلاثي الأبعاد: الأرضية، العناصر، الشخصيات، الإضاءة، الكاميرا، وطبقة الرسم فوق الشاشة
'use strict';

/* =========================================================
   3D WORLD
   Every scene of the game (village, houses, forest, wadi, fort, the towns, trails and caves of
   chapters 5–8) goes through here. Known things become real 3D shapes; anything else stands up
   as a cut-out painted by its own 2D drawing code, so no scene is left behind.
   ========================================================= */
const W3={id:null,cv:null,own:[],bills:[],live:[],people:new Map(),hero:null,heroKey:'',fol:null,glows:[],pools:[],rr:0,fountain:null,snap:true,lantern:null};
const LEAN=.22;                                  // cut-outs lean back a little so the tilted camera does not squash them

/* ---------- which static is what: matched by position against the scene's own data ---------- */
function glTag(sc){
  const idx=new Map();for(const d of sc.statics)if(!d.k){const key=d.x+'|'+d.y;if(!idx.has(key))idx.set(key,d);}
  const tag=(x,y,k)=>{const d=idx.get(x+'|'+y);if(d&&!d.k)d.k=k;};
  const trees=a=>a.forEach(tr=>tag(tr.x,tr.y,{t:'tree',kind:tr.kind,v:tr.v||0}));
  if(sc.id==='village'){
    MAP.houses.forEach(h=>tag(h.x,h.base,{t:'house',h,spr:SPR.houses[h.id],depth:108}));
    trees(MAP.trees);
    [...MAP.bushes,...MAP.hedge].forEach((b,i)=>tag(b.x,b.y,{t:'bush',v:b.v+i}));
    MAP.lamps.forEach(l=>tag(l.x,l.y,{t:'lamp'}));
    MAP.benches.forEach(b=>tag(b.x,b.y,{t:'prop',p:'bench'}));MAP.barrels.forEach(b=>tag(b.x,b.y,{t:'prop',p:'barrel'}));MAP.crates.forEach(b=>tag(b.x,b.y,{t:'prop',p:'crate'}));
    tag(MAP.fountain.x,MAP.fountain.y+30,{t:'fountain'});
    MAP.fences.forEach(([a,b])=>{const len=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.round(len/24));
      for(let i=0;i<=n;i++){const x=a[0]+(b[0]-a[0])*i/n,y=a[1]+(b[1]-a[1])*i/n;tag(x,y,{t:'fence',px:a[0]+(b[0]-a[0])*(i-1)/n,py:a[1]+(b[1]-a[1])*(i-1)/n,first:i===0});}});
  }else if(sc.forest)trees(FOREST.trees);
  else if(sc.wadi){trees(WADI.trees);WADI.rocks.forEach(r=>tag(r.x,r.y,{t:'rock',kind:'wadi',v:r.v,s:r.r/15}));}
  else if(sc.fort)trees(FORT.palms);
  else if(sc.interior){sc.statics.forEach((d,i)=>{const p=sc.cfg.props[i];if(p)d.k={key:'in_'+p.t+(p.s||1)};});}
  else if(sc.area){
    const B0=BIOMES[sc.biome];
    for(const p of sc.props){
      if(p.kind==='tree')tag(p.x,p.y,{t:'tree',kind:B0.tree||'snowpine',v:p.v||0});
      else if(p.kind==='rock'){const k=B0.rock||'snowrock';tag(p.x,p.y,k==='pillar'?{t:'prop',p:'column',v:p.v||0}:{t:'rock',kind:k,v:p.v||0,s:1});}
      else if(p.kind==='bare')tag(p.x,p.y,B0.bare?{t:'tuft',kind:B0.bare,v:p.v||0}:{t:'tree',kind:'dead',v:0});
      else if(p.kind==='crystal')tag(p.x,p.y,(B0.crystal||'crystal')==='brazier'?{key:'brazier'+(p.v%3)}:{t:'crystal',kind:B0.crystal||'crystal',v:p.v||0});
      else if(p.kind==='torch')tag(p.x,p.y-1,{key:'torch'});
    }
    (sc.area.houses||[]).forEach(h=>tag(h.x+h.w/2,h.base,{t:'house',h,spr:ASPR.houses[sc.id+h.x],depth:44}));
    (sc.area.lamps||[]).forEach(l=>tag(l[0],l[1],{t:'lamp'}));
  }
  sc.tagged=true;
}

/* ---------- cut-outs: a 2D drawing standing in the 3D world ---------- */
function billCanvas(b,cap){
  const w=b[2]-b[0],h=b[3]-b[1],s=Math.min(glQuality()?2:1.25,cap/Math.max(w,h));
  const cv=document.createElement('canvas');cv.width=Math.max(2,Math.ceil(w*s));cv.height=Math.max(2,Math.ceil(h*s));
  return {cv,g:cv.getContext('2d'),s};
}
function billDraw(bl,t){
  const g=bl.g,b=bl.b,s=bl.s;g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,bl.cv.width,bl.cv.height);
  g.setTransform(s,0,0,s,-b[0]*s,-b[1]*s);
  try{bl.draw(g,t);}catch(_){}
  bl.mat.diffuseTexture.update(true);
}
function billMesh(b,y,mat){
  const top=y-b[1],bot=y-b[3],z=-y;
  const m=texQuad('bill',[b[0],top,z+top*LEAN],[b[2],top,z+top*LEAN],[b[2],bot,z+bot*LEAN],[b[0],bot,z+bot*LEAN],[0,0,1,1],mat);
  m.receiveShadows=true;return m;
}
const BILLKEY=new Map();
function makeBill(d){
  const b=d.b||[d.x-48,d.y-84,d.x+48,d.y+10],key=d.k&&d.k.key;
  if(key){
    const w=b[2]-b[0],h=b[3]-b[1],id=key+'|'+w+'x'+h;let sh=BILLKEY.get(id);
    if(!sh){const c=billCanvas(b,512);sh={mat:canvasMat('k'+id,c.cv)};const bl={g:c.g,cv:c.cv,s:c.s,b,draw:d.draw,mat:sh.mat};billDraw(bl,1.3);BILLKEY.set(id,sh);}
    const m=billMesh(b,d.y,sh.mat);W3.own.push(m);return;
  }
  const c=billCanvas(b,glQuality()?1536:1024),mat=canvasMat('bill',c.cv),bl={g:c.g,cv:c.cv,s:c.s,b,draw:d.draw,mat,x:d.x,y:d.y};
  billDraw(bl,time);bl.mesh=billMesh(b,d.y,mat);W3.own.push(bl.mesh);W3.bills.push(bl);
}

/* ---------- build one scene ---------- */
function glDisposeScene(){
  for(const m of W3.own)m.dispose();
  for(const m of GL.ownMats||[])m.dispose(true,true);
  for(const f of W3.people.values())disposeFigure(f);
  if(W3.fol){disposeFigure(W3.fol);W3.fol=null;}
  for(const l of W3.live){l.mesh.dispose();}
  W3.own=[];W3.bills=[];W3.live=[];GL.ownMats=[];GL.matSink=GL.ownMats;W3.people.clear();W3.fountain=null;BILLKEY.clear();
}
function glBuildScene(sc){
  glDisposeScene();
  const s=GL.scene,own=W3.own;
  W3.id=sc.id;W3.cv=sc.ground;W3.snap=true;
  if(!sc.tagged)glTag(sc);
  // ground: the hand-painted map, lying flat
  const gt=new BABYLON.DynamicTexture('ground',sc.ground,s,true,BABYLON.Texture.TRILINEAR_SAMPLINGMODE);gt.wrapU=gt.wrapV=BABYLON.Texture.CLAMP_ADDRESSMODE;gt.anisotropicFilteringLevel=GL.coarse?2:8;gt.update(true);
  const gm=new BABYLON.StandardMaterial('ground',s);gm.diffuseTexture=gt;gm.specularColor=BABYLON.Color3.Black();gm.backFaceCulling=false;GL.ownMats.push(gm);
  const top=sc.interior?WALL:0;
  const floor=texQuad('floor',[0,0,-top],[sc.W,0,-top],[sc.W,0,-sc.H],[0,0,-sc.H],[0,top/sc.H,1,1],gm);floor.receiveShadows=true;own.push(floor);
  const bgc=col3(sc.bg||'#22301a');
  if(sc.interior){
    const hW=WALL*1.12,wall=texQuad('wall',[0,hW,-top+2],[sc.W,hW,-top+2],[sc.W,0,-top],[0,0,-top],[0,0,1,top/sc.H],gm,[0,.75,-.66]);wall.receiveShadows=true;own.push(wall);
    const geo=new Geo(),wc=sc.cfg.wall[1];
    geo.box(-11,0,-sc.H/2-top/2,22,hW,sc.H-top,wc);geo.box(sc.W+11,0,-sc.H/2-top/2,22,hW,sc.H-top,wc);geo.box(sc.W/2,hW,-top+12,sc.W+44,6,26,'#5b3820');
    own.push(...geo.finish(false));
  }else{
    const sk=new BABYLON.StandardMaterial('skirt',s);sk.diffuseColor=bgc;sk.specularColor=BABYLON.Color3.Black();GL.ownMats.push(sk);
    const skirt=MB().CreateGround('skirt',{width:9000,height:9000},s);skirt.position.set(sc.W/2,-1.5,-sc.H/2);skirt.material=sk;own.push(skirt);
  }
  // everything that stands on it
  const geo=new Geo(),R=mulberry(sc.W*7+sc.H),rails=[];
  for(const d of sc.statics){
    const k=d.k,x=d.x,z=-d.y;
    if(!k||k.key){makeBill(d);continue;}
    if(k.t==='tree'){const pl=k.kind==='palm',sz=(pl?1.12:1.08)*(.9+R()*.24);geo.add(treeProto(k.kind,k.v),x,0,z,pl?R()*TAU:R()*.9-.45,sz,sz*(.94+R()*.14),sz,[.92+R()*.14,.92+R()*.14,.94+R()*.1]);}
    else if(k.t==='rock'){const sz=(k.s||1)*(.9+R()*.25);geo.add(rockProto(k.kind,k.v),x,0,z,R()*.8-.4,sz);}
    else if(k.t==='bush')geo.add(bushProto(k.v),x,0,z,R()*.6-.3,1.05+R()*.2);
    else if(k.t==='tuft')geo.add(tuftProto(k.kind,k.v),x,0,z,R()*TAU,1+R()*.25);
    else if(k.t==='crystal')geo.add(crystalProto(k.kind,k.v),x,0,z,R()*.6-.3,1.15);
    else if(k.t==='lamp')geo.add(lampProto(),x,0,z,0,1.05);
    else if(k.t==='prop')geo.add(k.p==='bench'?benchProto():k.p==='barrel'?barrelProto():k.p==='column'?columnProto(k.v):crateProto(),x,0,z+(k.p==='bench'?5:4),k.p==='column'?R()*TAU:0,1.05);
    else if(k.t==='fence'){geo.box(x,0,z,5.4,25,5.4,'#6f4a2b','#57381f');if(!k.first)rails.push([k.px,k.py,d.x,d.y]);}
    else if(k.t==='house'){if(k.spr)buildHouse(geo,k.h,k.spr,k.depth,own);else makeBill(d);}
    else if(k.t==='fountain')W3.fountain=buildFountain(MAP.fountain,own);
    else makeBill(d);
  }
  for(const [ax,ay,bx,by] of rails){
    if(ay===by){geo.box((ax+bx)/2,16,-ay,Math.abs(bx-ax),3.4,2.4,'#9a6a3d','#bd8e58');geo.box((ax+bx)/2,8.5,-ay,Math.abs(bx-ax),3.4,2.4,'#9a6a3d','#bd8e58');}
    else{geo.box(ax,16,-(ay+by)/2,2.4,3.4,Math.abs(by-ay),'#9a6a3d','#bd8e58');geo.box(ax,8.5,-(ay+by)/2,2.4,3.4,Math.abs(by-ay),'#9a6a3d','#bd8e58');}
  }
  if(sc.grid){ // caves and temples: raise the walls around every floor
    const B0=BIOMES[sc.biome],g2=sc.grid,fl=(x,y)=>y>=0&&y<sc.rows&&x>=0&&x<sc.cols&&g2[y][x],wc=hex3(B0.wall[1]),front='#'+wc.map(v=>Math.round(v*150).toString(16).padStart(2,'0')).join('');
    for(let y=0;y<sc.rows;y++)for(let x=0;x<sc.cols;x++){
      if(g2[y][x])continue;
      let near=false;for(let dy=-1;dy<=1&&!near;dy++)for(let dx=-1;dx<=1;dx++)if(fl(x+dx,y+dy)){near=true;break;}
      if(!near)continue;
      const south=fl(x,y+1),d=south?DT-10:DT;
      geo.box(x*DT+DT/2,0,-(y*DT+d/2),DT,south?30:22,d,front,B0.wall[1]);
    }
  }
  own.push(...geo.finish(true));
  s.fogMode=BABYLON.Scene.FOGMODE_LINEAR;
}

/* ---------- things that move but are still drawn in 2D: animals, stalls, pick-ups ---------- */
const LIVE_W=124,LIVE_UP=92,LIVE_DN=12;
function liveSlot(i){
  if(W3.live[i])return W3.live[i];
  const s=glQuality()?2:1.4,cv=document.createElement('canvas');cv.width=Math.ceil(LIVE_W*s);cv.height=Math.ceil((LIVE_UP+LIVE_DN)*s);
  const mat=canvasMat('live'+i,cv),mesh=texQuad('live',[-LIVE_W/2,LIVE_UP,LIVE_UP*LEAN],[LIVE_W/2,LIVE_UP,LIVE_UP*LEAN],[LIVE_W/2,-LIVE_DN,-LIVE_DN*LEAN],[-LIVE_W/2,-LIVE_DN,-LIVE_DN*LEAN],[0,0,1,1],mat);
  return W3.live[i]={cv,g:cv.getContext('2d'),s,mat,mesh};
}
function glLive(t){
  let i=0;
  const put=(x,y,draw)=>{
    if(Math.abs(x-GL.tgt.x)>GL.halfW+90||Math.abs(y-GL.tgt.y)>GL.halfD+140||i>=16)return;
    const l=liveSlot(i++),g=l.g,s=l.s;l.mesh.setEnabled(true);l.mesh.position.set(x,0,-y);
    g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,l.cv.width,l.cv.height);g.setTransform(s,0,0,s,(LIVE_W/2-x)*s,(LIVE_UP-y)*s);
    try{draw(g,t);}catch(_){}
    l.mat.diffuseTexture.update(true);
  };
  for(const a of ANIMALS)if(a.scene===scene.id)put(a.x,a.y,(g,t2)=>drawAnimal(g,a,t2));
  if(scene.id==='village'){put(COOP.x,COOP.y,g=>drawCoop(g));if(PEDDLER.scene==='village')put(PEDDLER.x+34,PEDDLER.y-2,(g,t2)=>drawDonkey(g,PEDDLER.x+34,PEDDLER.y-2,t2));}
  marketDrawables(d=>put(d.x,d.y+2,d.draw));
  for(const pk of PICKUPS)if(pk.scene===scene.id&&pickupActive(pk))put(pk.x,pk.y,(g,t2)=>drawPickup(g,pk,t2));
  for(;i<W3.live.length;i++)W3.live[i].mesh.setEnabled(false);
}

/* ---------- people ---------- */
function glPeople(dt,t){
  const hk=heroLookKey();
  if(!W3.hero||W3.heroKey!==hk){if(W3.hero)disposeFigure(W3.hero);W3.hero=heroFigure();W3.heroKey=hk;}
  const show=state!=='title';
  W3.hero.root.setEnabled(show);
  poseFigure(W3.hero,hero.x,hero.y,hero.dir,hero.moving,hero.phase,dt,t);
  const seen=new Set();
  for(const n of NPCS){
    if(n.scene!==scene.id||!n.look)continue;
    let f=W3.people.get(n.id);
    if(!f){f=makeFigure(n.look,'',n.id);f.yaw=DIR_YAW[n.dir]||0;W3.people.set(n.id,f);}
    seen.add(n.id);f.root.setEnabled(true);
    poseFigure(f,n.x,n.y,n.dir,n.moving,n.phase,dt,t,n.x);
  }
  for(const [id,f] of W3.people)if(!seen.has(id))f.root.setEnabled(false);
  const fo=follower();
  if(fo){if(!W3.fol){W3.fol=makeFigure(LOOKS.aisha,'','follower');W3.fol.yaw=DIR_YAW[fo.dir]||0;}W3.fol.root.setEnabled(true);poseFigure(W3.fol,fo.x,fo.y,fo.dir,hero.moving,hero.phase*.9,dt,t,3);}
  else if(W3.fol)W3.fol.root.setEnabled(false);
}

/* ---------- light: sun, sky, night, lamps ---------- */
const mix=(a,b,k)=>a+(b-a)*k;
function glLight(t){
  const inside=!!scene.interior,n=inside?0:scene.dark?.94:Math.min(1,nightAmount()*(scene.forest?1.05:1)),du=inside||scene.dark?0:duskAmount(),rain=inside?0:WX.rain||0;
  const sun=GL.sun,hemi=GL.hemi,day=1-n;
  sun.intensity=(inside?.3:.66*day*(1-.4*rain))+.05*n;
  sun.diffuse.set(1,mix(.95,.62,du),mix(.84,.36,du));
  hemi.intensity=inside?.86:mix(.6,.4,n)*(1-.12*rain)+.06*du;
  hemi.diffuse.set(mix(mix(1,1,du),.42,n),mix(mix(.97,.82,du),.5,n),mix(mix(.92,.7,du),.92,n));
  hemi.groundColor.set(mix(.62,.16,n),mix(.56,.18,n),mix(.46,.34,n));
  if(inside){hemi.diffuse.set(1,.93,.8);hemi.groundColor.set(.6,.5,.4);}
  GL.sg.darkness=inside?.7:mix(.4,.9,n);
  const bg=hex3(scene.bg||'#22301a'),li=inside?.9:mix(1,.34,n),fog=(WX.fog||0)*(inside?0:1);
  const fr=mix(bg[0]*li,.82,fog*.7),fg=mix(bg[1]*li,.85,fog*.7),fb=mix(bg[2]*mix(1,1.5,n)*li,.86,fog*.7);
  GL.scene.clearColor.set(fr,fg,fb,1);GL.scene.fogColor.set(fr,fg,fb);
  GL.scene.fogStart=GL.dist*mix(1.25,.55,fog);GL.scene.fogEnd=GL.dist*mix(2.5,1.35,fog);
  // the hero's lantern
  if(!W3.lantern){const p=new BABYLON.PointLight('lantern',V3(0,40,0),GL.scene);p.diffuse=new BABYLON.Color3(1,.78,.48);p.specular=BABYLON.Color3.Black();p.range=300;W3.lantern=p;}
  W3.lantern.position.set(hero.x,34,-hero.y-10);W3.lantern.intensity=n>.05?n*(1.25+.08*Math.sin(t*9)):0;W3.lantern.setEnabled(n>.05);
  // glows where the game says there are lights
  let i=0;
  if(n>.08&&!inside){
    if(!W3.glowMat){const m=new BABYLON.StandardMaterial('glow',GL.scene);m.emissiveTexture=GL.glowTex;m.opacityTexture=GL.glowTex;m.disableLighting=true;m.alphaMode=BABYLON.Engine.ALPHA_ADD;m.disableDepthWrite=true;m.backFaceCulling=false;m.fogEnabled=false;W3.glowMat=m;}
    for(const [x,y,r,a] of sceneLights()){
      if(i>=28)break;if(Math.abs(x-GL.tgt.x)>GL.halfW+r||Math.abs(y-GL.tgt.y)>GL.halfD+r+60)continue;
      let gl=W3.glows[i];
      if(!gl){const halo=MB().CreatePlane('halo',{size:1},GL.scene);halo.material=W3.glowMat;halo.billboardMode=BABYLON.Mesh.BILLBOARDMODE_ALL;
        const pool=MB().CreateGround('pool',{width:1,height:1},GL.scene);pool.material=W3.glowMat;gl=W3.glows[i]={halo,pool};}
      const f=.9+.1*Math.sin(t*7+x),up=Math.min(60,r*.5);
      gl.halo.setEnabled(true);gl.pool.setEnabled(true);
      gl.halo.position.set(x,up,-(y+up));gl.halo.scaling.setAll(r*.9*f);gl.halo.visibility=.55*n*a;
      gl.pool.position.set(x,1.2,-(y+up));gl.pool.scaling.set(r*2.5,1,r*2);gl.pool.visibility=.42*n*a*f;
      i++;
    }
  }
  for(;i<W3.glows.length;i++){W3.glows[i].halo.setEnabled(false);W3.glows[i].pool.setEnabled(false);}
}

/* ---------- camera ---------- */
function glCamera(dt){
  const cam=GL.cam,asp=view.w/Math.max(1,view.h),span=scene.interior?250:asp>1.2?330:300;
  const D=span/(2*Math.tan(FOV/2))/Math.min(1,asp*.95);GL.dist=D;
  GL.halfW=D*Math.tan(FOV/2)*asp;GL.halfD=D*Math.tan(FOV/2)/Math.sin(PITCH);
  let tx,ty;
  if(state==='title'){tx=576+Math.sin(time*.12)*170;ty=450+Math.cos(time*.1)*70;}
  else{tx=hero.x;ty=hero.y-(view.h>view.w*1.15?-GL.halfD*.12:GL.halfD*.06);}
  const mx=Math.min(scene.W/2,GL.halfW*.72),my=Math.min(scene.H/2,GL.halfD*.5);
  tx=clamp(tx,mx,scene.W-mx);ty=clamp(ty,my,scene.H-my+(scene.interior?0:GL.halfD*.2));
  if(scene.interior){tx=scene.W/2;ty=mix(scene.H*.56,ty,.35);}
  const k=W3.snap?1:1-Math.exp(-dt*(state==='title'?2:OPT.camera==='snappy'?16:7));W3.snap=false;
  GL.tgt.x+=(tx-GL.tgt.x)*k;GL.tgt.y+=(ty-GL.tgt.y)*k;
  const so=state==='title'?[0,0]:shakeOffset(),x=GL.tgt.x+so[0],z=-(GL.tgt.y+so[1]);
  cam.position.set(x,18+D*Math.sin(PITCH),z-D*Math.cos(PITCH));cam.setTarget(V3(x,18,z));
  // the sun's shadow box follows the camera
  const R=Math.max(GL.halfW,GL.halfD)*1.15+90,sun=GL.sun,d=sun.direction;
  sun.position.set(x-d.x*1500,-d.y*1500,z-d.z*1500);sun.orthoLeft=-R;sun.orthoRight=R;sun.orthoTop=R;sun.orthoBottom=-R;
}

/* ---------- 2D layer on top: marks, speech bubble, rain, vignette ---------- */
function glProject(x,y,h){
  const e=GL.engine,p=BABYLON.Vector3.Project(V3(x,h,-y),BABYLON.Matrix.IdentityReadOnly,GL.scene.getTransformMatrix(),GL.cam.viewport.toGlobal(e.getRenderWidth(),e.getRenderHeight()));
  const k=view.w/e.getRenderWidth();return [p.x*k,p.y*k];
}
function glAt(g,x,y,fn){
  const a=glProject(x,y,0),b=glProject(x,y,40),k=Math.max(.2,(a[1]-b[1])/40)*1.12,d=view.dpr;
  g.setTransform(d*k,0,0,d*k,(a[0]-x*k)*d,(a[1]-y*k)*d);fn(g);
}
function glOverlay(t){
  const g=ctx;g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,canvas.width,canvas.height);
  if(FG)glAt(g,hero.x,hero.y,g2=>drawFishWorld(g2,t));
  for(const n of NPCS){if(n.scene!==scene.id||target&&target.npc===n&&state==='play')continue;const m=questMark(n);
    if(m)glAt(g,n.x,n.y,g2=>drawQuestMark(g2,n,m,t));else if(n.shop&&met.has(n.id)&&Math.hypot(hero.x-n.x,hero.y-n.y)<150)glAt(g,n.x,n.y,g2=>drawShopMark(g2,n,t));}
  if(questStarted&&hasSkill('seeker'))for(const n of NPCS){
    if(n.scene!==scene.id||n===SALEM||n.noMeet||met.has(n.id)||(target&&target.npc===n))continue;
    glAt(g,n.x,n.y,g2=>{const sx=n.x,sy=n.y-(n.look.child?44:52)+Math.sin(t*3+n.x)*1.5;g2.fillStyle='rgba(60,30,0,.35)';drawStar(g2,sx+.6,sy+.8,5.4);g2.fillStyle='#ffd36b';drawStar(g2,sx,sy,5.4);});
  }
  if(state==='play'&&target)glAt(g,target.x,target.y,g2=>drawBubble(g2,target,t));
  drawWeatherScreen(g,false);drawAreaWeather(g);
  g.setTransform(1,0,0,1,0,0);g.scale(view.dpr,view.dpr);
  g.fillStyle=view.warm;g.fillRect(0,0,view.w,view.h);
  g.fillStyle=view.vig;g.fillRect(0,0,view.w,view.h);
  drawFishUI(g);
}

/* ---------- one frame ---------- */
let glLast=0;
function glFrame(){
  const now=performance.now(),dt=Math.min(.05,Math.max(.001,(now-glLast)/1000));glLast=now;
  if(GLB.B)glBattleEnd();
  GL.cam.fov=FOV;
  if(GL.shadowQ!==glQuality()){glShadows();glResize();}
  if(W3.id!==scene.id||W3.cv!==scene.ground)glBuildScene(scene);
  const t=time;
  glCamera(dt);glLight(t);glPeople(dt,t);glLive(t);
  if(W3.fountain){const dry=dryVillage();W3.fountain.water.position.y=dry?14.2:15.6+Math.sin(t*2)*.2;W3.fountain.water.material.alpha=dry?.25:.86;W3.fountain.bowl.setEnabled(!dry);if(W3.fountain.ps){if(dry)W3.fountain.ps.stop();else if(!W3.fountain.ps.isStarted())W3.fountain.ps.start();}}
  // refresh one or two of the 2D cut-outs each frame, so their flames, gates and seasons stay alive
  for(let n=GL.coarse?1:2,tries=0;n>0&&tries<W3.bills.length;tries++){
    const bl=W3.bills[W3.rr++%W3.bills.length];
    if(Math.abs(bl.x-GL.tgt.x)>GL.halfW+260||Math.abs(bl.y-GL.tgt.y)>GL.halfD+260)continue;
    billDraw(bl,t);n--;
  }
  GL.scene.render();
  glOverlay(t);glAdapt(dt);
}

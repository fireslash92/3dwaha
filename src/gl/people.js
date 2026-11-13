// الشخصيات ثلاثية الأبعاد: ناصر وأهل القرية بأزيائهم العمانية، مع حركة المشي
'use strict';

/* =========================================================
   3D PEOPLE (models face south; arms and legs swing from the game's own walk phase)
   ========================================================= */
const FIG={};
function figureProtos(L,hero){
  const key=JSON.stringify(L)+(hero||'');if(FIG[key])return FIG[key];
  const body=[],fem=isF(L),skin=L.skin||HP.skin,eye='#2a1d18';
  let arm,leg;
  const head=()=>{body.push(shp(sph(17,12),skin,0,31.5,0),shp(sph(2.3,6),eye,-3.2,32.2,-7.7,{s:[1,1.3,.7]}),shp(sph(2.3,6),eye,3.2,32.2,-7.7,{s:[1,1.3,.7]}),
    shp(sph(3,6),skin,-8.3,31,0,{s:[.6,1,1]}),shp(sph(3,6),skin,8.3,31,0,{s:[.6,1,1]}));};
  if(hero==='tunic'){
    const P0=HP;
    body.push(shp(cyl(13,13,16.6,12),P0.tunic,0,16.6,0),shp(sph(14,10),P0.tunic,0,22.4,0,{s:[1,.5,.9]}),shp(cyl(2.6,16.6,16.9,12),P0.belt,0,12.6,0),shp(boxm(3,3.2,1.4),P0.buckle,0,12.6,-8.2),
      shp(boxm(1.3,6.5,.8),P0.tunicHi,0,18.5,-7.3),shp(tor(12.5,4.4,12),P0.scarf,0,24.6,0),shp(boxm(3.4,8,1.6),P0.scarfSh,5,20.5,-6.6,{r:[0,0,.14]}),
      shp(boxm(11.5,11,5.5),P0.pack,0,17.6,8.4),shp(boxm(11.9,4,5.9),P0.packSh,0,21.4,8.4),shp(boxm(2,2,1),P0.buckle,0,19,11.4));
    head();
    body.push(shp(sph(19,12),P0.hair,0,33.6,1.9,{s:[1,.94,1]}),shp(sph(8,6),P0.hair,-3.4,38.2,-6,{s:[1.2,.7,1]}),shp(sph(8,6),P0.hair,3.6,38.4,-5.6,{s:[1.2,.7,1]}),
      shp(cyl(6,0,5,5),P0.hair,-2.4,43.4,0,{r:[0,0,.3]}),shp(cyl(6.5,0,5,5),P0.hairHi,1.6,43.8,.5,{r:[0,0,-.25]}),shp(cyl(5,0,4.4,5),P0.hair,4.6,42.2,1,{r:[0,0,-.6]}));
    arm=[shp(cyl(9.5,4.6,4.2,8),P0.tunicSh,0,-4.4,0),shp(sph(4,6),skin,0,-10,0)];
    leg=[shp(cyl(7,4.8,4.4,8),P0.pants,0,-3.6,0),shp(boxm(5.6,5,7.2),P0.boot,0,-8.6,-.8),shp(boxm(5.8,1.6,7.6),P0.bootSh,0,-10.3,-.8)];
  }else{
    const c=fem?L.dress:L.robe,cs=fem?L.dressSh:L.robeSh;
    if(fem){
      body.push(shp(cyl(21,12,21,12),c,0,12.6,0),shp(sph(13.4,10),c,0,22.4,0,{s:[1,.5,.9]}),shp(cyl(2.6,20,21.4,12),L.emb||c,0,3.4,0),shp(cyl(.9,19,19.4,12),L.emb2||cs,0,6,0),
        shp(boxm(5,7.5,1),L.emb||cs,0,18.6,-6.3),shp(boxm(2.4,2.4,1.2),L.emb2||c,0,19.8,-6.5));
      head();
      body.push(shp(sph(20.4,12),L.scarf,0,32.6,2.4,{s:[1,1.02,.98]}),shp(cyl(11,15,17.6,12),L.scarfSh||L.scarf,0,24.4,2.6),shp(tor(17.4,1.5,14),L.scarfTrim||L.scarfDot||L.scarf,0,32.4,-4.6,{r:[Math.PI/2-.12,0,0]}));
      if(L.age!=='old')body.push(shp(sph(9,6),'#2a1c16',0,36.6,-4.6,{s:[1.5,.5,.6]}));
    }else{
      body.push(shp(cyl(20,12.6,17.2,12),c,0,13,0),shp(sph(14,10),c,0,22.4,0,{s:[1,.5,.9]}),shp(cyl(1.4,17,17.4,12),cs,0,3.6,0),
        shp(cyl(5.6,.9,.9,5),L.tassel||cs,0,18.6,-6.9),shp(sph(2.2,5),L.tassel||cs,0,15.2,-7.2,{s:[1,1.6,1]}));
      head();
      if(L.hair&&L.head!=='none')body.push(shp(sph(17.8,10),L.hair,0,31.9,1.5));
      if(L.beard)body.push(shp(sph(15,10),L.beard,0,L.age==='old'?27:28,-1.9,{s:[1,L.age==='old'?.9:.72,.86]}),shp(sph(5,6),L.beard,0,29.4,-8,{s:[1.5,.4,.5]}));
      if(L.head==='kumma'){const hw=L.hw||['#f7f3ea','#a9472a'];body.push(shp(cyl(7,15.4,17,14),hw[0],0,38.4,.3),shp(cyl(2.4,17.3,17.5,14),hw[1],0,36.3,.3),shp(cyl(.7,9,9,10),hw[1],0,42,.3),shp(cyl(1.2,16,16.4,14),hw[1],0,40.4,.3));}
      else if(L.head==='massar'){const hw=L.hw||['#6d3b7a','#e3a23c','#f3ead8'];body.push(shp(sph(21,12),hw[0],0,38,.4,{s:[1,.56,1]}),shp(tor(17.6,3.6,14),hw[1],0,36,.4),shp(tor(13,2.6,12),hw[2]||hw[1],0,40.6,.4),shp(sph(5.4,6),hw[1],6.4,39.4,-6.6));}
      else if(L.hair)body.push(shp(sph(19,12),L.hair,0,33.4,1.9));
    }
    if(L.cane)body.push(shp(cyl(31,1.5,1.5,5),'#7b5231',11.6,15.5,-4),shp(sph(3.2,5),'#7b5231',11.6,31,-4));
    arm=[shp(cyl(9.8,4.8,4.6,8),cs,0,-4.6,0),shp(sph(4,6),skin,0,-10.2,0)];
    leg=[shp(sph(1,6),fem?(L.sirwal||'#6a4126'):'#7a5230',0,-9.4,-1.2,{s:[5,3,8]})];
  }
  return FIG[key]={body:makeProto(body,false),arm:makeProto(arm,false),leg:makeProto(leg,false),sc:L.child?.82:1,hero:!!hero};
}
function makeFigure(L,hero,name){
  const pr=figureProtos(L,hero),sc=GL.scene,root=new BABYLON.TransformNode('p_'+name,sc),lift=new BABYLON.TransformNode('l',sc);
  lift.parent=root;root.scaling.setAll(pr.sc*1.06);
  const mk=(p,n,x,y)=>{const m=protoMesh(p,n,GL.mats.people);m.parent=lift;m.position.set(x,y,0);m.receiveShadows=false;glCast(m);return m;};
  const f={root,lift,body:mk(pr.body,'body',0,0),armL:mk(pr.arm,'armL',-8.4,22.4),armR:mk(pr.arm,'armR',8.4,22.4),legL:mk(pr.leg,'legL',-3.3,11),legR:mk(pr.leg,'legR',3.3,11),yaw:0,hero:pr.hero,cane:!!L.cane};
  f.armL.rotation.z=-.12;f.armR.rotation.z=.12;
  return f;
}
const DIR_YAW={down:0,up:Math.PI,left:Math.PI/2,right:-Math.PI/2};
function poseFigure(f,x,y,dir,moving,phase,dt,t,seed=0){
  f.root.position.set(x,0,-y);
  let d=DIR_YAW[dir]-f.yaw;d=Math.atan2(Math.sin(d),Math.cos(d));f.yaw+=d*Math.min(1,dt*12);f.root.rotation.y=f.yaw;
  const sw=moving?Math.sin(phase):0,k=f.hero?.75:.5;
  f.armL.rotation.x=sw*k;f.armR.rotation.x=f.cane?-.25:-sw*k;
  f.legL.rotation.x=-sw*(f.hero?.7:.34);f.legR.rotation.x=sw*(f.hero?.7:.34);
  f.lift.position.y=moving?Math.abs(Math.sin(phase))*1.5:Math.sin(t*2.2+seed)*.35;
  f.lift.rotation.x=moving?.06:0;
}
function disposeFigure(f){f.root.dispose(false,false);}
const heroLookKey=()=>(P.eq.body==='dishdasha'?'robe':'tunic')+(P.eq.head==='kumma'?'K':'');
function heroFigure(){
  const k=heroLookKey();
  if(k.startsWith('robe'))return makeFigure(Object.assign({},HERO_ROBE,{head:k.endsWith('K')?'kumma':'x',hw:HERO_KUMMA.hw,hair:HP.hair,skin:HP.skin}),'','hero');
  if(k.endsWith('K')){ // tunic with a kumma: reuse the tunic body and hide the spikes under the cap
    const f=makeFigure({skin:HP.skin},'tunic','hero'),cap=protoMesh(protoOf('herokumma',()=>[shp(cyl(7.4,16.6,18.6,14),HERO_KUMMA.hw[0],0,39.4,1),shp(cyl(2.4,18.9,19.1,14),HERO_KUMMA.hw[1],0,37,1),shp(cyl(5,10,16.4,12),HERO_KUMMA.hw[0],0,44,1)],false),'cap',GL.mats.people);
    cap.parent=f.lift;glCast(cap);return f;
  }
  return makeFigure({skin:HP.skin},'tunic','hero');
}

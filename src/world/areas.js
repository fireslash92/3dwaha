// محرّك المناطق الجديدة: يبني المدن والدروب والمغارات من إعدادات بسيطة (البيئة، الطرق، البيوت، المخارج، الوحوش)
'use strict';

/* =========================================================
   BIOMES: colours for the ground, the trees, the battle stage
   ========================================================= */
const BIOMES={
  snow:{base:['#e7edf1','#d5dee5','#f4f7f9'],speck:['#c6d0d8','#ffffff','#b8c4cc'],path:'#c3b9a8',pathEdge:'rgba(120,105,85,.25)',grass:'rgba(140,160,150,.5)',tree:'snowpine',rock:'snowrock',step:'snow',music:'forest',townMusic:'village',
    bt:{s0:'#8fa7bf',s1:'#dfe8ef',r0:'#9fb0c0',r1:'#c9d6e0',g0:'#eef3f6',g1:'#c9d4dc',grass:'rgba(150,170,180,.5)'}},
  swamp:{base:['#6f7a4a','#5f6a3e','#7d8854'],speck:['#4f5a32','#8a9660','#3f4a2a'],path:'#9a7a52',pathEdge:'rgba(60,45,25,.35)',grass:'rgba(60,80,40,.6)',plank:true,tree:'mangrove',rock:'mudrock',bare:'reeds',step:'wood',music:'forest',townMusic:'village',water:['#4f6a5a','#3f5a4a'],
    bt:{s0:'#3a4a3c',s1:'#7d8a6a',r0:'#2f3f30',r1:'#46583e',g0:'#6f7a4a',g1:'#4a5432',grass:'rgba(40,60,30,.6)'}},
  coast:{base:['#e6d2a4','#d9c08e','#efe0b8'],speck:['#c9ad7a','#f6ead0','#b89a68'],path:'#b89a68',pathEdge:'rgba(120,90,55,.3)',grass:'rgba(140,140,80,.45)',plank:true,tree:'palm',rock:'coral',bare:'reeds',step:'dirt',music:'wadi',townMusic:'village',water:['#4f9fb8','#3f8aa4'],
    bt:{s0:'#5fa8c8',s1:'#f3e2b8',r0:'#7aa0b0',r1:'#a8c4cc',g0:'#e6d2a4',g1:'#c9ad7a',grass:'rgba(140,120,70,.45)'}},
  temple:{base:['#2f4a48','#2a403e','#3a5654'],speck:['#4f7a70','#7aa89a','#22322f'],floor:['#4f7068','#46645c'],wall:['#1f2e2c','#3a5a54','#6f9a8a'],step:'stone',music:'fort',dark:true,crystal:'coralp',
    bt:{s0:'#0f1e1e',s1:'#2a4a46',r0:'#18302c',r1:'#2a4a42',g0:'#4f7068',g1:'#2f4440',grass:'rgba(120,200,170,.3)'}},
  ice:{base:['#3b4c5e','#33424f','#46596b'],speck:['#5f7890','#8fb4d0','#2a3642'],floor:['#5a7088','#4f6478'],wall:['#24303c','#3b5064','#6f8fa8'],step:'stone',music:'fort',dark:true,
    bt:{s0:'#121c28',s1:'#2a4258',r0:'#1b2a3a',r1:'#2c4256',g0:'#5d7a92',g1:'#34485a',grass:'rgba(160,210,240,.35)'}},
};

/* =========================================================
   SPRITES for the new areas (rebuilt when the screen scale changes)
   ========================================================= */
let ASPR=null;
function areaSprites(){
  const S=view.S;if(ASPR&&ASPR.S===S)return ASPR;
  const R=mulberry(9090),A={S,houses:{}};
  A.snowpine=[0,1,2].map(i=>makeSprite(S,76,104,38,98,g=>{drawPineTrunk(g);g.translate(0,-12);drawPineCanopy(g,PINE_PAL[i%2]);g.translate(0,12);snowOnPine(g,i);}));
  A.snowrock=[0,1].map(i=>makeSprite(S,56,40,28,34,g=>drawSnowRock(g,i)));
  A.crystal=[0,1,2].map(i=>makeSprite(S,40,60,20,56,g=>drawIceCrystal(g,i)));
  A.post=makeSprite(S,40,70,20,66,drawCaravanPost);
  A.stairs=makeSprite(S,70,56,35,40,g=>drawStairs(g,false));
  A.stairsUp=makeSprite(S,70,56,35,40,g=>drawStairs(g,true));
  A.torch=makeSprite(S,20,40,10,36,drawWallTorch);
  A.observatory=makeSprite(S,140,200,70,190,drawObservatory);
  A.heart=makeSprite(S,80,90,40,80,drawFrozenAltar);
  A.dead=makeSprite(S,60,80,30,76,g=>drawBareTree(g,R));
  A.mangrove=[0,1,2].map(i=>makeSprite(S,96,110,48,104,g=>drawMangrove(g,i)));
  A.palm=[0,1,2].map(i=>makeSprite(S,100,160,50,154,g=>{drawPalmTrunk(g);g.translate(6.8,-78);g.rotate((i-1)*.06);g.translate(-48,-40);g.translate(48,40);drawPalmCrown(g);}));
  A.reeds=[0,1].map(i=>makeSprite(S,40,46,20,42,g=>drawReeds(g,i)));
  A.mudrock=[0,1].map(i=>makeSprite(S,56,40,28,34,g=>drawMudRock(g,i)));
  A.coral=[0,1].map(i=>makeSprite(S,56,46,28,40,g=>drawCoralRock(g,i)));
  A.coralp=[0,1,2].map(i=>makeSprite(S,44,60,22,56,g=>drawCoralPlant(g,i)));
  A.arish={};
  A.dhow=makeSprite(S,200,130,100,70,drawDhow);
  A.idol=makeSprite(S,90,110,45,100,drawDrownedIdol);
  A.festival=makeSprite(S,120,90,60,84,drawFestivalTent);
  return ASPR=A;
}
function snowOnPine(g,i){g.fillStyle='#f7fafc';[[-26,-30],[-18,-48],[-10,-64],[0,-80],[10,-62],[18,-46],[26,-28]].forEach(([x,y],k)=>{ell(g,x*.9,y,9+((k+i)%3),3.4);g.fill();});g.fillStyle='rgba(200,215,230,.6)';ell(g,0,-2,18,3);g.fill();}
function drawSnowRock(g,i){g.fillStyle='#6e7880';poly(g,i?[-24,0,-18,-20,-2,-28,16,-22,24,0]:[-20,0,-14,-24,6,-30,20,-14,22,0]);g.fillStyle='#8a949c';poly(g,i?[-18,-20,-2,-28,6,-18,-8,-12]:[-14,-24,6,-30,8,-18,-6,-14]);g.fillStyle='#f4f8fa';g.beginPath();g.ellipse(0,-24,i?17:15,6,0,Math.PI,0);g.fill();ell(g,i?-6:-4,-21,10,3.6);g.fill();}
function drawIceCrystal(g,i){const c=['#bfe3f0','#9fd0ea','#d8f0fa'][i];g.fillStyle='rgba(30,50,70,.3)';ell(g,0,0,16,4);g.fill();[[-8,-28,6],[2,-46,8],[10,-24,5]].forEach(([x,h,w],k)=>{g.fillStyle=k===1?c:'#8fc2dc';poly(g,[x-w,0,x-w*.6,h+8,x,h,x+w*.6,h+8,x+w,0]);g.fillStyle='rgba(255,255,255,.55)';poly(g,[x-w*.4,-2,x-w*.3,h+10,x,h+2]);});}
function drawCaravanPost(g){g.fillStyle='#6b4a2b';g.fillRect(-2,-62,4,62);g.fillStyle='#a8834e';rr(g,-18,-60,36,16,3);g.fill();g.fillStyle='#5a3a1c';g.font='700 8px system-ui,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('القوافل',0,-52);g.fillStyle='#c9a046';poly(g,[18,-56,26,-52,18,-48]);g.fillStyle='#d9b072';rr(g,-14,-40,28,10,3);g.fill();g.fillStyle='rgba(0,0,0,.3)';ell(g,0,0,10,3);g.fill();}
function drawStairs(g,up){g.fillStyle='rgba(0,0,0,.45)';rr(g,-32,-36,64,40,6);g.fill();for(let i=0;i<5;i++){g.fillStyle=up?`rgb(${150+i*14},${170+i*12},${185+i*10})`:`rgb(${90-i*14},${110-i*16},${130-i*16})`;g.fillRect(-28+i*2,-32+i*7,56-i*4,6);}if(up){g.fillStyle='#e9f4fa';poly(g,[0,-46,8,-38,-8,-38]);}}
function drawWallTorch(g){g.fillStyle='#4a3524';g.fillRect(-2,-22,4,16);g.fillStyle='#6b4a2b';g.fillRect(-5,-26,10,5);g.fillStyle='#ffb347';ell(g,0,-31,4,6);g.fill();g.fillStyle='#fff2b0';ell(g,0,-30,2,3);g.fill();}
function drawBareTree(g,R){g.strokeStyle='#5a4636';g.lineCap='round';const br=(x,y,a,l,w)=>{if(l<6)return;const x2=x+Math.cos(a)*l,y2=y+Math.sin(a)*l;g.lineWidth=w;g.beginPath();g.moveTo(x,y);g.lineTo(x2,y2);g.stroke();br(x2,y2,a-.5,l*.7,w*.7);br(x2,y2,a+.45,l*.65,w*.7);};br(0,0,-Math.PI/2,26,5);g.fillStyle='#f4f8fa';ell(g,-6,-40,8,2.4);g.fill();ell(g,8,-46,7,2.2);g.fill();}
function drawMangrove(g,i){g.strokeStyle='#4a3a26';g.lineWidth=2.4;g.lineCap='round';for(let k=-3;k<=3;k++){g.beginPath();g.moveTo(k*3,-26);g.quadraticCurveTo(k*9,-14,k*12+((k+i)%2)*3,0);g.stroke();}
  g.fillStyle='#5a4630';g.fillRect(-3,-46,6,22);const c=[['#2f4f2a','#3f6a34','#5f8a44'],['#2a4a30','#3a643c','#5a8a52'],['#344a26','#46602e','#6a8a3e']][i];
  [[-22,-56,22],[18,-58,20],[0,-72,26],[-12,-80,18],[14,-82,16]].forEach(([x,y,r],k)=>{g.fillStyle=c[k%3];ell(g,x,y,r,r*.72);g.fill();});g.fillStyle='rgba(255,255,255,.08)';ell(g,-6,-84,10,5);g.fill();}
function drawReeds(g,i){g.strokeStyle=i?'#7a8a4a':'#8a9a52';g.lineWidth=1.6;g.lineCap='round';for(let k=-4;k<=4;k++){g.beginPath();g.moveTo(k*3,0);g.quadraticCurveTo(k*3.6,-20,k*4.4+Math.sin(k)*3,-34-((k*7)%6));g.stroke();}g.fillStyle='#6b4a2b';[[-6,-34],[5,-38],[11,-30]].forEach(([x,y])=>{ell(g,x,y,1.8,5);g.fill();});}
function drawMudRock(g,i){g.fillStyle='#5a4a36';poly(g,i?[-24,0,-18,-18,-2,-24,16,-18,24,0]:[-20,0,-14,-20,6,-26,20,-12,22,0]);g.fillStyle='#7a6a4e';poly(g,i?[-18,-18,-2,-24,6,-14,-8,-10]:[-14,-20,6,-26,8,-14,-6,-12]);g.fillStyle='#5f8a44';ell(g,-6,-20,8,3);g.fill();}
function drawCoralRock(g,i){g.fillStyle='#c9b08a';poly(g,i?[-24,0,-18,-18,0,-26,18,-16,24,0]:[-20,0,-12,-22,8,-24,20,-10,22,0]);g.fillStyle='#e6d2b0';for(let k=0;k<8;k++)circ(g,-14+k*4,-12-((k*5)%8),1.6);g.fillStyle='#e07a63';ell(g,8,-22,5,3);g.fill();}
function drawCoralPlant(g,i){const c=['#e07a63','#d2577a','#f2b33c'][i];g.strokeStyle=c;g.lineWidth=4;g.lineCap='round';const br=(x,y,a,l)=>{if(l<6)return;const x2=x+Math.cos(a)*l,y2=y+Math.sin(a)*l;g.beginPath();g.moveTo(x,y);g.lineTo(x2,y2);g.stroke();br(x2,y2,a-.45,l*.7);br(x2,y2,a+.4,l*.68);};br(0,0,-Math.PI/2,18);g.fillStyle='rgba(255,255,255,.4)';circ(g,0,-40,2);}
function drawArish(g,h){const W=h.w,Hh=h.wallH;g.fillStyle='#6b4a2b';g.fillRect(-4,-8,W+8,8);
  const wg=g.createLinearGradient(0,-Hh,0,0);wg.addColorStop(0,'#c9a46a');wg.addColorStop(1,'#a8834e');g.fillStyle=wg;g.fillRect(0,-Hh,W,Hh-6);
  g.strokeStyle='rgba(90,60,30,.45)';g.lineWidth=1;g.beginPath();for(let x=3;x<W;x+=4){g.moveTo(x,-Hh);g.lineTo(x,-6);}g.stroke();
  g.fillStyle='#6b4a2b';for(let x=0;x<=W;x+=W/4)g.fillRect(x-2,-Hh-4,4,Hh);
  g.fillStyle='#3a2a1a';rr(g,W*h.door-14,-52,28,46,3);g.fill();g.fillStyle='#8a6a3a';g.fillRect(W*h.door-14,-52,28,4);
  g.fillStyle='#b89a68';poly(g,[-14,-Hh+4,W+14,-Hh+4,W+4,-Hh-18,-4,-Hh-18]);g.strokeStyle='rgba(90,60,30,.5)';g.beginPath();for(let x=-10;x<W+12;x+=5){g.moveTo(x,-Hh+4);g.lineTo(x+4,-Hh-18);}g.stroke();
  g.fillStyle='rgba(255,240,200,.25)';g.fillRect(-4,-Hh-18,W+8,3);
  if(h.stilts){g.fillStyle='#4a3a26';for(let x=4;x<W;x+=W/5)g.fillRect(x,-6,4,14);}}
function drawDhow(g){g.fillStyle='rgba(0,0,0,.2)';ell(g,0,10,90,10);g.fill();
  g.fillStyle='#7a4a2a';g.beginPath();g.moveTo(-88,-4);g.quadraticCurveTo(-60,14,40,12);g.lineTo(86,-18);g.lineTo(-70,-10);g.closePath();g.fill();
  g.fillStyle='#a8693e';g.fillRect(-70,-14,150,6);g.fillStyle='#e9dcc0';g.beginPath();g.moveTo(-10,-14);g.lineTo(-6,-108);g.lineTo(54,-30);g.closePath();g.fill();
  g.strokeStyle='#4a3a26';g.lineWidth=3;g.beginPath();g.moveTo(-6,-12);g.lineTo(-4,-112);g.stroke();g.lineWidth=1.4;g.beginPath();g.moveTo(-40,-60);g.lineTo(70,-50);g.stroke();
  g.fillStyle='#a8322a';poly(g,[-4,-112,14,-106,-4,-100]);}
function drawDrownedIdol(g){g.fillStyle='rgba(0,0,0,.35)';ell(g,0,0,36,9);g.fill();g.fillStyle='#3a5a54';poly(g,[-30,0,-24,-20,24,-20,30,0]);
  g.fillStyle='#4f7a70';rr(g,-18,-86,36,68,8);g.fill();g.fillStyle='#6f9a8a';rr(g,-14,-82,28,20,6);g.fill();
  const p=.6+.4*Math.sin(time*2);g.fillStyle=`rgba(150,255,210,${p})`;circ(g,-6,-72,3);circ(g,6,-72,3);
  g.fillStyle='#5f8a44';for(let k=0;k<5;k++){ell(g,-16+k*8,-30+((k*7)%10),4,7);g.fill();}
  const gr=g.createRadialGradient(0,-60,0,0,-60,46);gr.addColorStop(0,`rgba(120,255,200,${.25*p})`);gr.addColorStop(1,'rgba(120,255,200,0)');g.fillStyle=gr;g.fillRect(-46,-106,92,92);}
function drawFestivalTent(g){g.fillStyle='rgba(0,0,0,.25)';ell(g,0,0,54,8);g.fill();g.fillStyle='#6b4a2b';g.fillRect(-50,-60,4,60);g.fillRect(46,-60,4,60);
  for(let i=0;i<8;i++){g.fillStyle=i%2?'#f3ead8':'#a8322a';poly(g,[-52+i*13,-62,-52+(i+1)*13,-62,-52+(i+.5)*13,-80]);}
  g.fillStyle='#2f6b4f';g.fillRect(-52,-64,104,5);g.fillStyle='#f3ead8';g.font='700 9px system-ui,sans-serif';g.textAlign='center';g.fillText('مهرجان الغوص',0,-40);
  g.fillStyle='#c9a046';rr(g,-30,-30,60,24,5);g.fill();g.fillStyle='#efe7d6';for(let k=0;k<6;k++)circ(g,-20+k*8,-18,2.4);}
function drawObservatory(g){
  g.fillStyle='#857b70';g.fillRect(-46,-10,92,10);
  const wg=g.createLinearGradient(-40,0,40,0);wg.addColorStop(0,'#e2cfa8');wg.addColorStop(1,'#bfa77c');g.fillStyle=wg;g.fillRect(-38,-130,76,122);
  g.fillStyle='#76492a';for(let y=-120;y<-10;y+=28)g.fillRect(-38,y,76,4);
  g.fillStyle='#4a3524';g.beginPath();g.moveTo(-12,-10);g.lineTo(-12,-44);g.arc(0,-44,12,Math.PI,0);g.lineTo(12,-10);g.closePath();g.fill();
  g.fillStyle='#ffe6a8';[-24,24].forEach(x=>{rr(g,x-6,-100,12,18,5);g.fill();});
  g.fillStyle='#8aa0b4';g.beginPath();g.arc(0,-130,42,Math.PI,0);g.fill();g.fillStyle='#f4f8fa';g.beginPath();g.arc(0,-130,42,Math.PI,Math.PI*1.45);g.lineTo(0,-130);g.fill();
  g.fillStyle='#2a3642';g.save();g.translate(0,-150);g.rotate(-.5);g.fillRect(-4,-32,8,40);g.restore();
  g.fillStyle='#c9a046';circ(g,0,-172,3);
}
function drawFrozenAltar(g){g.fillStyle='rgba(0,0,0,.35)';ell(g,0,0,34,9);g.fill();g.fillStyle='#4f6478';poly(g,[-30,0,-24,-24,24,-24,30,0]);g.fillStyle='#6f8fa8';g.fillRect(-26,-30,52,8);
  const p=.7+.3*Math.sin(time*2.4);const gr=g.createRadialGradient(0,-52,0,0,-52,34);gr.addColorStop(0,`rgba(200,240,255,${.8*p})`);gr.addColorStop(1,'rgba(120,200,255,0)');g.fillStyle=gr;g.fillRect(-34,-86,68,68);
  g.fillStyle='#d8f0fa';poly(g,[0,-74,12,-52,0,-34,-12,-52]);g.fillStyle='rgba(255,255,255,.7)';poly(g,[0,-70,5,-54,0,-40]);}

/* =========================================================
   BUILDING AN AREA FROM ITS SETTINGS
   ========================================================= */
const AREAS={};
const onPathList=(paths,x,y,m)=>paths.some(p=>{for(let i=0;i<p.pts.length-1;i++){const a=p.pts[i],b=p.pts[i+1],dx=b[0]-a[0],dy=b[1]-a[1],l=dx*dx+dy*dy;let t=l?((x-a[0])*dx+(y-a[1])*dy)/l:0;t=clamp(t,0,1);if(Math.hypot(a[0]+t*dx-x,a[1]+t*dy-y)<p.w/2+m)return true;}return false;});
function defineArea(cfg){
  const B0=BIOMES[cfg.biome],sc={id:cfg.id,area:cfg,biome:cfg.biome,W:cfg.W,H:cfg.H,bg:B0.base[1],colliders:[],statics:null,dark:!!B0.dark||!!cfg.dark,lights:[],
    music:cfg.music||(cfg.kind==='town'?B0.townMusic:B0.music),step:B0.step,enc:cfg.enc,name:cfg.name,safe:cfg.kind==='town'};
  const R=mulberry(cfg.seed||7),C=sc.colliders,props=sc.props=[];
  const rect=(x,y,w,h,tag)=>C.push({t:'r',x,y,w,h,tag}),circC=(x,y,r,tag)=>C.push({t:'c',x,y,r,tag});
  if(cfg.kind==='dungeon')buildDungeonLayout(sc,cfg,R);
  else{
    const paths=sc.paths=cfg.paths||[];
    // edges: dense trees all around except where exits open
    const open=(x,y)=>(cfg.exits||[]).some(e=>Math.hypot(x-e.x,y-e.y)<(e.r||70))||(cfg.sea&&y<cfg.sea+10)||(cfg.ponds||[]).some(p=>((x-p.x)/(p.rx+16))**2+((y-p.y)/(p.ry+16))**2<1);
    const add=(x,y,kind,v)=>{props.push({x,y,kind,v});circC(x,y-3,kind==='rock'?14:9,'tree');};
    for(let x=10;x<cfg.W;x+=38){if(!open(x,24))add(x+(R()-.5)*10,26+R()*10,cfg.edgeTree||'tree',(R()*3)|0);if(!open(x,cfg.H-12))add(x+(R()-.5)*10,cfg.H-8,cfg.edgeTree||'tree',(R()*3)|0);}
    for(let y=70;y<cfg.H-40;y+=40){if(!open(18,y))add(16+R()*8,y+(R()-.5)*10,'tree',(R()*3)|0);if(!open(cfg.W-16,y))add(cfg.W-18-R()*8,y+(R()-.5)*10,'tree',(R()*3)|0);}
    rect(0,0,cfg.W,8,'edge');rect(0,cfg.H-4,cfg.W,4,'edge');rect(0,0,6,cfg.H,'edge');rect(cfg.W-6,0,6,cfg.H,'edge');
    // scatter: keep clear of paths, plazas, houses and set pieces
    const clear=(x,y)=>onPathList(paths,x,y,22)||(cfg.plaza&&((x-cfg.plaza.x)/(cfg.plaza.rx+30))**2+((y-cfg.plaza.y)/(cfg.plaza.ry+30))**2<1)||(cfg.houses||[]).some(h=>x>h.x-40&&x<h.x+h.w+40&&y>h.base-h.wallH-60&&y<h.base+46)||(cfg.keep||[]).some(k=>Math.hypot(x-k[0],y-k[1])<k[2])||open(x,y);
    const n=cfg.density||(cfg.kind==='town'?14:60);
    for(let i=0,placed=0;i<n*8&&placed<n;i++){const x=40+R()*(cfg.W-80),y=60+R()*(cfg.H-100);if(clear(x,y))continue;if(props.some(p=>Math.hypot(p.x-x,p.y-y)<34))continue;const k=R()<(cfg.rockShare??.25)?'rock':R()<(cfg.bareShare||0)?'bare':'tree';add(x,y,k,(R()*3)|0);placed++;}
    (cfg.houses||[]).forEach(h=>{h.doorX=Math.round(h.x+h.w*h.door);rect(h.x-4,h.base-34,h.w+8,30,'house');sc.lights.push([h.x+h.w*h.door+30,h.base-h.wallH+28,52,1],[h.x+h.w*.2,h.base-h.wallH+28,44,.7],[h.x+h.w*.8,h.base-h.wallH+28,44,.7]);});
    (cfg.lamps||[]).forEach(l=>{rect(l[0]-4,l[1]-6,8,8,'lamp');sc.lights.push([l[0],l[1]-52,82,1]);});
    (cfg.ponds||[]).forEach(p=>{if(p.solid)C.push({t:'e',x:p.x,y:p.y,rx:p.rx-8,ry:p.ry-6,tag:'water'});});
    if(cfg.sea)rect(0,0,cfg.W,cfg.sea-10,'sea');
  }
  (cfg.features||[]).forEach(f=>{if(f.col)circC(f.x,f.y-3,f.col,'feature');if(f.kind==='post'||f.kind==='stairs'||f.kind==='stairsUp'||f.kind==='heart')sc.lights.push([f.x,f.y-30,f.kind==='heart'?110:60,.8]);});
  sc.buildGround=S=>buildAreaGround(sc,S);
  SCENES[cfg.id]=sc;AREAS[cfg.id]=sc;return sc;
}

/* ---------- dungeons: rooms joined by corridors on a grid ---------- */
const DT=40;
function buildDungeonLayout(sc,cfg,R){
  const cols=Math.floor(cfg.W/DT),rows=Math.floor(cfg.H/DT),grid=Array.from({length:rows},()=>new Uint8Array(cols));
  const rooms=[];
  for(let tries=0;tries<400&&rooms.length<(cfg.rooms||6);tries++){
    const w=5+((R()*4)|0),h=4+((R()*3)|0),x=1+((R()*(cols-w-2))|0),y=2+((R()*(rows-h-3))|0);
    if(rooms.some(r=>x<r.x+r.w+2&&x+w+2>r.x&&y<r.y+r.h+2&&y+h+2>r.y))continue;rooms.push({x,y,w,h,cx:x+(w>>1),cy:y+(h>>1)});
  }
  rooms.sort((a,b)=>a.cx-b.cx||a.cy-b.cy);
  const carve=(x,y)=>{if(y>=1&&y<rows-1&&x>=1&&x<cols-1)grid[y][x]=1;};
  rooms.forEach(r=>{for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++)carve(x,y);});
  for(let i=1;i<rooms.length;i++){const a=rooms[i-1],b=rooms[i];
    for(let x=Math.min(a.cx,b.cx);x<=Math.max(a.cx,b.cx);x++){carve(x,a.cy);carve(x,a.cy+1);}
    for(let y=Math.min(a.cy,b.cy);y<=Math.max(a.cy,b.cy)+1;y++){carve(b.cx,y);carve(b.cx+1,y);}}
  sc.grid=grid;sc.rooms=rooms;sc.cols=cols;sc.rows=rows;
  // walls into colliders: one rectangle per horizontal run
  for(let y=0;y<rows;y++){let x=0;while(x<cols){if(grid[y][x]){x++;continue;}let x2=x;while(x2<cols&&!grid[y][x2])x2++;sc.colliders.push({t:'r',x:x*DT,y:y*DT,w:(x2-x)*DT,h:DT-(y+1<rows&&grid[y+1]&&grid[y+1][x]?10:0),tag:'wall'});x=x2;}}
  // torches on walls just above a floor, a few crystals, and the room centres for the story
  const props=sc.props=[];
  for(let y=1;y<rows-1;y++)for(let x=1;x<cols-1;x++){if(!grid[y][x]&&grid[y+1][x]&&R()<.07){props.push({x:x*DT+DT/2,y:(y+1)*DT+2,kind:'torch'});sc.lights.push([x*DT+DT/2,(y+1)*DT-28,96,1]);}}
  rooms.forEach((r,i)=>{if(i===0||i===rooms.length-1)return;for(let k=0;k<2;k++)if(R()<.6){const x=(r.x+1+R()*(r.w-2))*DT,y=(r.y+1+R()*(r.h-1.5))*DT;props.push({x,y,kind:'crystal',v:(R()*3)|0});sc.colliders.push({t:'c',x,y:y-3,r:12,tag:'crystal'});sc.lights.push([x,y-30,70,.55]);}});
  const c=r=>({x:(r.cx+.5)*DT,y:(r.cy+.8)*DT});
  sc.start=c(rooms[0]);sc.end=c(rooms[rooms.length-1]);sc.mid=rooms.slice(1,-1).map(c);
  if(cfg.place)cfg.place(sc);
}
const tileFloor=(sc,x,y)=>{const cx=Math.floor(x/DT),cy=Math.floor(y/DT);return sc.grid&&cy>=0&&cy<sc.rows&&cx>=0&&cx<sc.cols&&sc.grid[cy][cx];};

/* ---------- ground canvas ---------- */
function buildAreaGround(sc,S){
  const cfg=sc.area,B0=BIOMES[sc.biome],cv=document.createElement('canvas');cv.width=Math.ceil(sc.W*S);cv.height=Math.ceil(sc.H*S);
  const g=cv.getContext('2d');g.scale(S,S);const R=mulberry((cfg.seed||7)+11);
  if(cfg.kind==='dungeon'){
    g.fillStyle=B0.wall[0];g.fillRect(0,0,sc.W,sc.H);
    for(let y=0;y<sc.rows;y++)for(let x=0;x<sc.cols;x++){
      const X=x*DT,Y=y*DT;
      if(sc.grid[y][x]){g.fillStyle=B0.floor[(x+y)&1];g.fillRect(X,Y,DT,DT);g.fillStyle='rgba(255,255,255,.05)';g.fillRect(X+2,Y+2,DT-4,2);
        g.strokeStyle='rgba(0,0,0,.18)';g.lineWidth=1;g.strokeRect(X+.5,Y+.5,DT-1,DT-1);
        for(let i=0;i<3;i++){g.fillStyle=B0.speck[(R()*3)|0];circ(g,X+R()*DT,Y+R()*DT,.6+R()*1.2);}
        if(R()<.12){g.fillStyle='rgba(190,230,250,.25)';ell(g,X+R()*DT,Y+R()*DT,6+R()*8,2+R()*3);g.fill();}
      }else if(y+1<sc.rows&&sc.grid[y+1][x]){ // a wall face we can see: top and front
        g.fillStyle=B0.wall[1];g.fillRect(X,Y,DT,DT-12);g.fillStyle=B0.wall[2];g.fillRect(X,Y,DT,4);
        const fg=g.createLinearGradient(0,Y+DT-12,0,Y+DT);fg.addColorStop(0,'#2c3a48');fg.addColorStop(1,'#1a232c');g.fillStyle=fg;g.fillRect(X,Y+DT-12,DT,12);
        g.strokeStyle='rgba(160,200,230,.25)';g.lineWidth=1;g.beginPath();g.moveTo(X+R()*DT,Y+6);g.lineTo(X+R()*DT,Y+DT-14);g.stroke();
        if(R()<.3){g.fillStyle='rgba(220,240,255,.7)';poly(g,[X+8,Y+DT-12,X+11,Y+DT-2,X+14,Y+DT-12]);}
      }else{g.fillStyle=(x+y)&1?B0.wall[0]:'#202a34';g.fillRect(X,Y,DT,DT);}
    }
    return cv;
  }
  const gr=g.createLinearGradient(0,0,0,sc.H);gr.addColorStop(0,B0.base[0]);gr.addColorStop(.5,B0.base[2]);gr.addColorStop(1,B0.base[1]);g.fillStyle=gr;g.fillRect(0,0,sc.W,sc.H);
  for(let i=0;i<sc.W*sc.H/9000;i++){const x=R()*sc.W,y=R()*sc.H,r=20+R()*60,q=g.createRadialGradient(x,y,0,x,y,r);q.addColorStop(0,R()<.5?'rgba(255,255,255,.45)':'rgba(150,170,185,.18)');q.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=q;g.fillRect(x-r,y-r,r*2,r*2);}
  for(let i=0;i<sc.W*sc.H/700;i++){g.fillStyle=B0.speck[(R()*3)|0];circ(g,R()*sc.W,R()*sc.H,.5+R()*1.3);}
  if(cfg.terraces)cfg.terraces.forEach(y=>{g.fillStyle='rgba(120,110,95,.35)';g.fillRect(0,y,sc.W,5);g.fillStyle='rgba(255,255,255,.6)';g.fillRect(0,y-3,sc.W,3);for(let x=0;x<sc.W;x+=22){g.fillStyle='rgba(110,100,85,.4)';g.fillRect(x,y,1.2,5);}});
  if(cfg.sea){const sg=g.createLinearGradient(0,0,0,cfg.sea);sg.addColorStop(0,'#2f7896');sg.addColorStop(1,'#5fb0c8');g.fillStyle=sg;g.fillRect(0,0,sc.W,cfg.sea);g.fillStyle='rgba(255,255,255,.7)';for(let x=0;x<sc.W;x+=18){ell(g,x+9,cfg.sea-2,10,3);g.fill();}
    g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=1.2;g.beginPath();for(let i=0;i<60;i++){const x=R()*sc.W,y=R()*(cfg.sea-20);g.moveTo(x,y);g.quadraticCurveTo(x+6,y-3,x+12,y);}g.stroke();}
  if(B0.water&&cfg.ponds)cfg.ponds.forEach(p=>{g.fillStyle='rgba(40,30,15,.35)';ell(g,p.x,p.y+3,p.rx+6,p.ry+5);g.fill();const wg=g.createRadialGradient(p.x,p.y,0,p.x,p.y,p.rx);wg.addColorStop(0,B0.water[0]);wg.addColorStop(1,B0.water[1]);g.fillStyle=wg;ell(g,p.x,p.y,p.rx,p.ry);g.fill();
    g.fillStyle='rgba(255,255,255,.18)';ell(g,p.x-p.rx*.3,p.y-p.ry*.4,p.rx*.4,p.ry*.2);g.fill();
    if(sc.biome==='swamp')for(let k=0;k<6;k++){const a=R()*TAU,rr2=R()*.7;g.fillStyle='#5f8a44';ell(g,p.x+Math.cos(a)*p.rx*rr2,p.y+Math.sin(a)*p.ry*rr2,6,3.4);g.fill();if(R()<.4){g.fillStyle='#f3d6e0';circ(g,p.x+Math.cos(a)*p.rx*rr2+2,p.y+Math.sin(a)*p.ry*rr2-1,1.8);}}});
  else if(cfg.ponds)cfg.ponds.forEach(p=>{g.fillStyle='#9fc4d8';ell(g,p.x,p.y,p.rx,p.ry);g.fill();g.fillStyle='rgba(255,255,255,.5)';ell(g,p.x-p.rx*.3,p.y-p.ry*.3,p.rx*.4,p.ry*.25);g.fill();g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=2;ell(g,p.x,p.y,p.rx,p.ry);g.stroke();
    g.strokeStyle='rgba(120,160,185,.5)';g.lineWidth=.8;g.beginPath();for(let i=0;i<6;i++){const a=R()*TAU;g.moveTo(p.x,p.y);g.lineTo(p.x+Math.cos(a)*p.rx*.8,p.y+Math.sin(a)*p.ry*.8);}g.stroke();});
  g.lineCap='round';g.lineJoin='round';
  for(const p of sc.paths){g.strokeStyle=B0.pathEdge;g.lineWidth=p.w+8;g.beginPath();p.pts.forEach((q,i)=>i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.stroke();
    g.strokeStyle=B0.path;g.lineWidth=p.w;g.stroke();
    if(!B0.plank){g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=p.w*.35;g.stroke();}
    else if(p.boards){g.strokeStyle='#8a6440';g.lineWidth=p.w-6;g.stroke();g.strokeStyle='rgba(50,35,20,.5)';g.lineWidth=1.2;g.setLineDash([2,9]);g.lineWidth=p.w-8;g.stroke();g.setLineDash([]);}}
  if(cfg.plaza){const z=cfg.plaza;g.fillStyle=B0.path;ell(g,z.x,z.y,z.rx,z.ry);g.fill();g.strokeStyle='rgba(100,90,75,.35)';g.lineWidth=1;for(let r=20;r<z.rx;r+=18){ell(g,z.x,z.y,r,r*z.ry/z.rx);g.stroke();}}
  for(let i=0;i<sc.W*sc.H/14000;i++){const x=R()*sc.W,y=R()*sc.H;if(onPathList(sc.paths,x,y,4))continue;g.strokeStyle=B0.grass;g.lineWidth=1;g.beginPath();for(let k=-1;k<=1;k++){g.moveTo(x,y);g.lineTo(x+k*3,y-6);}g.stroke();}
  (sc.props||[]).forEach(p=>softShadow(g,p.x+6,p.y+2,p.kind==='rock'?24:22,7,.25));
  (cfg.houses||[]).forEach(h=>softShadow(g,h.x+h.w/2+10,h.base+4,h.w*.62,16,.3));
  return cv;
}

/* ---------- things that stand and are sorted by their feet ---------- */
function areaStatics(sc){
  const A=areaSprites(),L=[],add=(x,y,w,h,draw)=>L.push({y,x,b:[x-w/2,y-h,x+w/2,y+10],draw});
  for(const p of sc.props){
    const B0=BIOMES[sc.biome];
    if(p.kind==='tree'){const k=B0.tree||'snowpine';add(p.x,p.y,k==='palm'?100:96,k==='palm'?160:110,g=>blit(g,ASPR[k][p.v%3],p.x,p.y));}
    else if(p.kind==='rock'){const k=B0.rock||'snowrock';add(p.x,p.y,56,46,g=>blit(g,ASPR[k][p.v%2],p.x,p.y));}
    else if(p.kind==='bare'){if(B0.bare==='reeds')add(p.x,p.y,40,46,g=>blit(g,ASPR.reeds[p.v%2],p.x,p.y));else add(p.x,p.y,60,80,g=>blit(g,ASPR.dead,p.x,p.y));}
    else if(p.kind==='torch')add(p.x,p.y-1,20,40,(g,t)=>{blit(g,ASPR.torch,p.x,p.y-12);const f=.8+.2*Math.sin(t*9+p.x);g.fillStyle=`rgba(255,180,90,${.18*f})`;circ(g,p.x,p.y-44,14);});
    else if(p.kind==='crystal'){const k=BIOMES[sc.biome].crystal||'crystal';add(p.x,p.y,44,60,g=>blit(g,ASPR[k][p.v%3],p.x,p.y));}
  }
  (sc.area.houses||[]).forEach(h=>{const key=sc.id+h.x;if(!A.houses[key])A.houses[key]=makeSprite(view.S,h.w+48,h.wallH+h.roofH+40,24,h.wallH+h.roofH+32,g=>{if(h.arish)drawArish(g,h);else drawHouseStatic(g,h);if(h.snow)snowRoof(g,h);});
    L.push({y:h.base,x:h.x+h.w/2,b:[h.x-30,h.base-h.wallH-h.roofH-40,h.x+h.w+30,h.base+10],draw:g=>blit(g,ASPR.houses[key],h.x,h.base)});});
  (sc.area.lamps||[]).forEach(l=>add(l[0],l[1],24,70,g=>blit(g,SPR.lamp,l[0],l[1])));
  (sc.area.features||[]).forEach(f=>{
    const spr=f.spr||{post:'post',stairs:'stairs',stairsUp:'stairsUp',observatory:'observatory',heart:'heart',dhow:'dhow',festival:'festival',boat:'dhow'}[f.kind];
    if(spr)L.push({y:f.kind==='stairs'||f.kind==='stairsUp'?f.y-40:f.y,x:f.x,b:[f.x-70,f.y-200,f.x+70,f.y+20],draw:g=>blit(g,ASPR[spr],f.x,f.y)});
    if(f.kind==='chest')L.push({y:f.y,x:f.x,b:[f.x-30,f.y-40,f.x+30,f.y+10],draw:g=>{blit(g,SPR.chest,f.x,f.y);if(P.flags['chest_'+f.id]){g.fillStyle='rgba(30,20,10,.55)';g.fillRect(f.x-18,f.y-30,36,10);}}});
  });
  return L;
}
function snowRoof(g,h){const W=h.w,top=-h.wallH,ov=14,eaveY=top+6,ridgeY=top-h.roofH;g.fillStyle='#f7fafc';g.beginPath();g.moveTo(-ov+9,ridgeY-2);g.lineTo(W+ov-9,ridgeY-2);g.lineTo(W+ov-4,ridgeY+(eaveY-ridgeY)*.55);for(let x=W+ov-4;x>-ov+4;x-=12)g.quadraticCurveTo(x-6,ridgeY+(eaveY-ridgeY)*.55+7,x-12,ridgeY+(eaveY-ridgeY)*.55);g.closePath();g.fill();
  g.fillStyle='rgba(180,200,215,.5)';g.fillRect(-ov+9,ridgeY-2,W+ov*2-18,2);for(let x=-ov+2;x<W+ov;x+=9){g.fillStyle='#e9f2f8';poly(g,[x,eaveY-1,x+2,eaveY+5+((x*7)%5),x+4,eaveY-1]);}}

/* =========================================================
   PLAY: exits, interactions, encounters, losing, the minimap
   ========================================================= */
function areaTick(v){
  const sc=scene,cfg=sc.area;
  for(const e of cfg.exits||[]){
    const inside=e.edge==='n'?hero.y<e.y+26&&Math.abs(hero.x-e.x)<(e.r||70):e.edge==='s'?hero.y>e.y-26&&Math.abs(hero.x-e.x)<(e.r||70):e.edge==='e'?hero.x>e.x-26&&Math.abs(hero.y-e.y)<(e.r||70):hero.x<e.x+26&&Math.abs(hero.y-e.y)<(e.r||70);
    const push=v&&(e.edge==='n'?v.y<-.4:e.edge==='s'?v.y>.4:e.edge==='e'?v.x>.4:v.x<-.4);
    if(!inside||!push)continue;
    if(e.need&&!P.flags[e.need]){if(toastKey!=='gate'){showToast('gate',e.block||'الطريق مغلق الآن',2.4);SFX.play('blocked');}return;}
    resetMeter();SFX.play('rustle');enterArea(e.to,e.at,e.dir);return;
  }
}
function enterArea(id,at,dir){
  const sc=SCENES[id],pos=at||sc.spawn||{x:sc.W/2,y:sc.H/2};
  if(sc.area&&sc.area.kind==='town'){P.flags['town_'+id]=1;}
  goTo(id,pos.x,pos.y,dir||'down',sc.name||'');
}
function areaTarget(){
  const sc=scene;
  for(const f of sc.area.features||[]){
    const d=Math.hypot(hero.x-f.x,hero.y-f.y);
    if((f.kind==='boat'&&d<90)||(f.kind==='festival'&&d<56)||(f.kind==='post'&&d<42)||(f.kind==='chest'&&d<36&&!P.flags['chest_'+f.id])||((f.kind==='stairs'||f.kind==='stairsUp')&&d<44)||(f.kind==='heart'&&d<60)||(f.kind==='sign'&&d<40))return {kind:'area',f,x:f.x,y:f.y-(f.kind==='post'?40:20)};
  }
  return null;
}
function areaAct(tg){
  const f=tg.f;talkCooldown=.5;
  if(f.kind==='post'){openWorldMap();return;}
  if(f.kind==='chest'){P.flags['chest_'+f.id]=1;const got=[];for(const [id,n] of f.loot){P.inv[id]=(P.inv[id]||0)+n;got.push(ITEMS[id].name+(n>1?` ×${AR(n)}`:''));}if(f.money){P.money+=f.money;got.push(baisa(f.money));}
    SFX.play('doorOpen');SFX.play('itemGet',{d:.15});showToast('note',`فتحت الصندوق<small>${got.join('، ')}</small>`,3);$('menuDot').hidden=false;saveGame();return;}
  if(f.kind==='stairs'||f.kind==='stairsUp'){SFX.play('doorOpen');resetMeter();enterArea(f.to,f.at,f.dir||'down');return;}
  if(f.kind==='sign'){showToast('note',f.text,3.4);return;}
  if((f.kind==='boat'||f.kind==='festival')&&f.onAct){f.onAct();return;}
  if(f.kind==='heart'&&f.onAct)f.onAct();
}
function areaEncOk(){
  const sc=scene;if(!sc.enc||sc.safe)return false;
  if(sc.area.kind==='dungeon'){if(Math.hypot(hero.x-sc.start.x,hero.y-sc.start.y)<120)return false;if(sc.area.bossRoom&&Math.hypot(hero.x-sc.end.x,hero.y-sc.end.y)<140)return false;return true;}
  return !(sc.area.exits||[]).some(e=>Math.hypot(hero.x-e.x,hero.y-e.y)<120);
}
function areaGroup(){
  const E=scene.enc,pool=isNight()&&E.night&&Math.random()<.45?E.night:E.groups;
  return pool[(Math.random()*pool.length)|0].slice();
}
function areaLose(boss){
  P.hp=null;P.mp=null;P.ally={hp:null,mp:null};P.gauge=0;
  const town=SCENES[P.lastTown]||SCENES.village,sp=town.area?town.area.inn:{x:576,y:530};
  scene=town;ensureScene(scene);hero.x=sp.x;hero.y=sp.y;hero.dir='down';snapCamera();resetTrail();
  state='play';talkCooldown=.4;fadeEl.classList.remove('on');
  notify(`استيقظتم في ${town.area?town.area.innName:'عين الوادي'}<small>${boss?'الخصم قوي. ارفعوا مستواكم وجدّدوا عتادكم، ثم عودوا':'عادت إليكم صحتكم كاملة'}</small>`,4);
}
function drawAreaMini(g,sc){
  const B0=BIOMES[sc.biome];
  if(sc.area.kind==='dungeon'){g.fillStyle='#1a232c';g.fillRect(0,0,sc.W,sc.H);g.fillStyle=B0.floor[0];for(let y=0;y<sc.rows;y++)for(let x=0;x<sc.cols;x++)if(sc.grid[y][x])g.fillRect(x*DT,y*DT,DT+1,DT+1);
    g.fillStyle='#e9c86a';(sc.area.features||[]).forEach(f=>{if(f.kind.startsWith('stairs'))g.fillRect(f.x-30,f.y-30,60,40);});return;}
  g.fillStyle=B0.base[0];g.fillRect(0,0,sc.W,sc.H);
  g.strokeStyle=B0.path;g.lineCap='round';sc.paths.forEach(p=>{g.lineWidth=p.w;g.beginPath();p.pts.forEach((q,i)=>i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.stroke();});
  if(sc.area.plaza){const z=sc.area.plaza;g.fillStyle=B0.path;ell(g,z.x,z.y,z.rx,z.ry);g.fill();}
  g.fillStyle='#4f8faa';(sc.area.ponds||[]).forEach(p=>{ell(g,p.x,p.y,p.rx,p.ry);g.fill();});if(sc.area.sea)g.fillRect(0,0,sc.W,sc.area.sea);
  g.fillStyle='#5f7a6a';sc.props.forEach(p=>{if(p.kind==='tree')g.fillRect(p.x-10,p.y-16,20,16);});
  (sc.area.houses||[]).forEach(h=>{g.fillStyle='#b9532f';g.fillRect(h.x-6,h.base-h.wallH-h.roofH+10,h.w+12,h.wallH+h.roofH-10);});
}

/* ---------- falling snow over the mountain areas ---------- */
const FLAKES=[];
function drawAreaWeather(g){
  if(scene.area&&scene.area.mist){const m=scene.area.mist();if(m>.02){if(!FOGCV)FOGCV=cloudSheet(91,'236,240,244',26);const d=view.dpr,cam=view.camX,camY=view.camY,z=view.zoom;
    g.save();g.setTransform(1,0,0,1,0,0);g.fillStyle=`rgba(150,170,150,${.2*m})`;g.fillRect(0,0,canvas.width,canvas.height);
    if(fxOn()){drawSheet(g,FOGCV,-cam*z*d*.7+time*8*d,-camY*z*d*.7,1.8*d,.5*m);drawSheet(g,FOGCV,-cam*z*d*1.15-time*12*d,-camY*z*d*1.15+80*d,2.5*d,.35*m);}g.restore();}}
  if(!scene.area||scene.dark||scene.biome!=='snow')return;
  const heavy=scene.area.snow?scene.area.snow():.6;if(heavy<.02)return;
  const d=view.dpr,W=canvas.width,H=canvas.height,n=Math.round((fxOn()?110:45)*heavy);
  while(FLAKES.length<n)FLAKES.push({x:Math.random(),y:Math.random(),s:.4+Math.random()*.8,r:.8+Math.random()*1.8,ph:Math.random()*TAU});
  const dt2=Math.min(.05,time-(drawAreaWeather.t||time));drawAreaWeather.t=time;
  g.save();g.setTransform(1,0,0,1,0,0);g.fillStyle='rgba(255,255,255,.85)';
  for(let i=0;i<n;i++){const f=FLAKES[i];f.y+=dt2*f.s*.18;f.x+=dt2*(Math.sin(time*.8+f.ph)*.03+.01);if(f.y>1){f.y=0;f.x=Math.random();}if(f.x>1)f.x-=1;if(f.x<0)f.x+=1;
    g.beginPath();g.arc(f.x*W,f.y*H,f.r*d,0,TAU);g.fill();}
  g.fillStyle=`rgba(225,235,245,${.12*heavy})`;g.fillRect(0,0,W,H);
  g.restore();
}

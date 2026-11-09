// الخريطة الصغيرة
'use strict';

/* =========================================================
   MINIMAP
   ========================================================= */
const miniEl=$('mini');let miniBig=false,miniTick=0;const miniBg={};
miniEl.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();miniBig=!miniBig;miniEl.classList.toggle('big',miniBig);SFX.play('tap');for(const k in miniBg)delete miniBg[k];miniTick=99;});
function miniBox(sc){const w=miniBig?220:120,h=miniBig?168:92;const k=Math.min((w-8)/sc.W,(h-8)/sc.H);return {w,h,k,ox:(w-sc.W*k)/2,oy:(h-sc.H*k)/2};}
function miniBackground(sc,bx,d){
  const key=sc.id+bx.w+'x'+d;if(miniBg[key])return miniBg[key];
  const cv=document.createElement('canvas');cv.width=bx.w*d;cv.height=bx.h*d;const g=cv.getContext('2d');g.scale(d,d);
  g.fillStyle=sc.forest?'#1d2c17':'#2c3f22';g.fillRect(0,0,bx.w,bx.h);
  g.save();g.translate(bx.ox,bx.oy);g.scale(bx.k,bx.k);g.lineCap='round';g.lineJoin='round';
  if(sc.fort){
    g.fillStyle='#c9a876';g.fillRect(0,0,F2W,F2H);g.fillStyle='#8a6a3e';g.fillRect(0,0,40,F2H);g.fillRect(920,0,40,F2H);g.fillRect(0,0,F2W,72);FORT.walls.forEach(w=>g.fillRect(w.x0,w.y-36,w.x1-w.x0,36));FORT.towers.forEach(t=>{ell(g,t.x,t.y-20,46,46);g.fill();});g.fillStyle='#5a7a8a';ell(g,FORT.well.x,FORT.well.y,30,20);g.fill();
  }else if(sc.wadi){
    g.fillStyle='#d6b986';g.fillRect(0,0,WW,WH);g.fillStyle='#8a5a3e';g.fillRect(0,0,WW,140);g.fillRect(0,452,WW,WH-452);g.fillStyle='#9a8d7a';g.fillRect(0,136,1150,26);g.fillStyle='#4f9fb8';ell(g,WADI.spring.x,WADI.spring.y,52,32);g.fill();
  }else if(sc.forest){
    g.fillStyle='#2f4a26';g.fillRect(0,0,FW,FH);
    g.strokeStyle='#b49a6a';g.lineWidth=70;g.beginPath();FOREST.path.forEach((q,i)=>i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.stroke();
    g.fillStyle='#5b8a42';ell(g,FOREST.clearing.x,FOREST.clearing.y,FOREST.clearing.r,FOREST.clearing.r);g.fill();
  }else{
    g.fillStyle='#6f9a46';g.fillRect(60,70,VW-120,VH-80);
    g.strokeStyle='#c9b58c';MAP.paths.forEach(q=>{g.lineWidth=q.w;g.beginPath();q.pts.forEach((pt,i)=>i?g.lineTo(pt[0],pt[1]):g.moveTo(pt[0],pt[1]));g.stroke();});
    g.fillStyle='#c9b58c';ell(g,MAP.plaza.x,MAP.plaza.y,MAP.plaza.rx,MAP.plaza.ry);g.fill();ell(g,MAP.lookout.x,MAP.lookout.y,MAP.lookout.r,MAP.lookout.r);g.fill();
    g.fillStyle='#4a90b0';ell(g,MAP.fountain.x,MAP.fountain.y,60,38);g.fill();
    g.fillStyle='#8a6744';g.fillRect(764,604,248,152);
    MAP.houses.forEach(h=>{g.fillStyle='#b9532f';g.fillRect(h.x-6,h.base-h.wallH-h.roofH+10,h.w+12,h.wallH+h.roofH-10);g.fillStyle='#f0dfb8';g.fillRect(h.x+10,h.base-40,h.w-20,34);});
  }
  g.restore();miniBg[key]=cv;return cv;
}
function drawMini(){
  if(OPT.minimap==='hide'||state==='title'||B)return;
  if(++miniTick<3)return;miniTick=0;
  const sc=scene.interior?SCENES.village:scene,bx=miniBox(sc),d=Math.min(window.devicePixelRatio||1,2);
  if(miniEl.width!==bx.w*d){miniEl.width=bx.w*d;miniEl.height=bx.h*d;}
  const g=miniEl.getContext('2d');g.setTransform(d,0,0,d,0,0);g.drawImage(miniBackground(sc,bx,d),0,0,bx.w,bx.h);
  const P2=(x,y)=>[bx.ox+x*bx.k,bx.oy+y*bx.k],pulse=.6+.4*Math.sin(time*5);
  const star=(x,y,r)=>{g.fillStyle=`rgba(255,211,107,${pulse})`;drawStar(g,x,y,r);};
  if(sc.fort){if(!P.flags.gateopen){const [x,y]=P2(480,540);g.fillStyle=P.inv.fortkey?'#7be08a':'#e05a3a';circ(g,x,y,miniBig?5:4);}FORT.pots.forEach(pt=>{if(P.flags['pot_'+pt.i])return;const [x,y]=P2(pt.x,pt.y);g.fillStyle='#e8c46a';circ(g,x,y,2.4);});if(!P.flags.boss3){const [x,y]=P2(FORT.altar.x,FORT.altar.y);star(x,y,6);}}
  else if(sc.wadi){if(P.flags.ch4&&!P.flags.fort){const [x,y]=P2(900,540);g.fillStyle='#ffd36b';poly(g,[x,y+7,x-5,y,x+5,y]);}if(!P.flags.gates)WADI.gates.forEach((gt,i)=>{const [x,y]=P2(gt.x,150);g.fillStyle=gateSeq.includes(i)?'#7be08a':'#ffd36b';circ(g,x,y,miniBig?5:4);});if(!P.flags.boss2){const [x,y]=P2(WADI.spring.x,WADI.spring.y);star(x,y,P.flags.gates?6:4);}const [sx,sy]=P2(SIGN.x,SIGN.y);g.fillStyle='#fff';circ(g,sx,sy,2.4);}
  else if(sc.forest){const [x,y]=P2(FOREST.stone.x,FOREST.stone.y);star(x,y,P.flags.boss?3:5);for(const pk of PICKUPS)if(pk.scene==='forest'&&pickupActive(pk)){const [a2,b2]=P2(pk.x,pk.y);g.fillStyle='#fff1a8';drawStar(g,a2,b2,3.4);}}
  else{
    const hunt=questStarted&&!chapterDone;
    for(const n of NPCS){
      if(n.scene==='village'){const [x,y]=P2(n.x,n.y);
        if(hunt&&n!==SALEM&&!met.has(n.id))star(x,y,miniBig?6:5.5);
        else if(n===SALEM&&(!questStarted||met.size>=VILLAGERS.length&&!chapterDone))star(x,y,miniBig?7:6);
        else{g.fillStyle='#f6ead2';circ(g,x,y,2);}}
      else if(hunt&&!met.has(n.id)){const h=MAP.houses.find(q=>q.id===n.scene);const [x,y]=P2(h.doorX,h.base);star(x,y,miniBig?6:5.5);}
    }
    if(chapterDone)for(const n of NPCS){const m=questMark(n);if(!m)continue;const sc2=n.scene==='village'?n:MAP.houses.find(h=>h.id===n.scene);if(!sc2)continue;const [x,y]=n.scene==='village'?P2(n.x,n.y):P2(sc2.doorX,sc2.base);g.fillStyle=m==='!'?'#ffd36b':'#7be08a';circ(g,x,y,miniBig?6:5);g.fillStyle='#3a210c';g.font='900 8px system-ui';g.textAlign='center';g.textBaseline='middle';g.fillText(m==='!'?'!':'؟',x,y+.5);}
    for(const pk of PICKUPS)if(pk.scene==='village'&&pickupActive(pk)){const [x,y]=P2(pk.x,pk.y);g.fillStyle='#fff1a8';drawStar(g,x,y,3.4);}
    if(P.flags.ch3&&!P.flags.boss2){const [x,y]=P2(VW-70,446);g.fillStyle='#ffd36b';poly(g,[x+7,y,x,y-5,x,y+5]);}
    if(chapterDone){const [x,y]=P2(576,80);g.fillStyle='#ffd36b';poly(g,[x,y-6,x+5,y,x-5,y]);}
  }
  const hx=scene.interior?scene.house.doorX:hero.x,hy=scene.interior?scene.house.base+12:hero.y,[x,y]=P2(hx,hy);
  const a={up:-Math.PI/2,down:Math.PI/2,left:Math.PI,right:0}[hero.dir]||0;
  g.save();g.translate(x,y);g.rotate(a);g.fillStyle='#fff';g.strokeStyle='#2a1c12';g.lineWidth=1.4;g.beginPath();g.moveTo(5.5,0);g.lineTo(-3.5,-4);g.lineTo(-1.5,0);g.lineTo(-3.5,4);g.closePath();g.fill();g.stroke();g.restore();
  g.strokeStyle='rgba(255,240,210,.35)';g.lineWidth=1;g.strokeRect(.5,.5,bx.w-1,bx.h-1);
}

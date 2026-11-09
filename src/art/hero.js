// رسم ناصر
'use strict';

/* =========================================================
   ART: hero (traveler)
   ========================================================= */
const HP={skin:'#f3cba3',skinSh:'#d9a27a',hair:'#5b3a22',hairHi:'#8a5c3b',tunic:'#3d6ea8',tunicSh:'#2b5285',tunicHi:'#6a99cf',pants:'#4b3c33',boot:'#6a4126',bootSh:'#472b17',belt:'#8b5a2b',buckle:'#e9bc5e',scarf:'#d64a38',scarfSh:'#a53426',pack:'#94663b',packSh:'#6e4826',eye:'#2a1d18'};
function drawHero(g,x,y,dir,phase,moving,t,blink){
  const sw=moving?Math.sin(phase):0;
  const bob=moving?Math.abs(Math.sin(phase))*1.3:Math.sin(t*2.2)*.35;
  g.save();g.translate(x,y);
  g.fillStyle='rgba(35,22,10,.32)';ell(g,0,0,9,3.4);g.fill();
  if(dir==='left')g.scale(-1,1);
  g.translate(0,-bob);
  const side=dir==='left'||dir==='right',robe=P.eq.body==='dishdasha',kumma=P.eq.head==='kumma';
  if(robe){heroRobe(g,side?'side':dir==='up'?'up':'down',sw);HO=true;}
  if(side)heroSide(g,sw,moving,t,blink);
  else if(dir==='up')heroBack(g,sw,moving,t);
  else heroFront(g,sw,moving,t,blink);
  HO=false;
  if(kumma)headwear(g,HERO_KUMMA,-31.5,side?.4:0);
  g.restore();
}
let HO=false; // draw only the head (body comes from the dishdasha)
const HERO_ROBE={g:'m',robe:'#f7f5ef',robeSh:'#d9d4c8',tassel:'#b9a27c',skin:HP.skin};
const HERO_KUMMA={head:'kumma',hw:['#f7f3ea','#a9472a']};
function heroRobe(g,view,sw){
  const L=HERO_ROBE;
  if(view==='side'){
    const st=sw*2.6,hs=sw*.8;
    foot(g,-st,0,L);foot(g,st+1,0,L);
    g.fillStyle=L.robeSh;rr(g,st*.7-2.1,-21.8,4.2,9,2);g.fill();g.fillStyle=L.skin;circ(g,st*.7,-11.4,1.8);
    g.fillStyle=HP.pack;rr(g,-9.8,-22.6,5.4,10.4,2.2);g.fill();g.fillStyle=HP.packSh;g.fillRect(-9.8,-22.6,5.4,3);
    g.fillStyle=L.robe;g.beginPath();g.moveTo(-5.4,-22.6);g.lineTo(5.6,-22.6);g.lineTo(7.6+hs,-3.2);g.quadraticCurveTo(hs,-1.8,-7.6+hs,-3.2);g.closePath();g.fill();
    g.fillStyle=L.robeSh;g.beginPath();g.moveTo(-5.4,-22.6);g.lineTo(-2.2,-22.6);g.lineTo(-3+hs,-2.4);g.lineTo(-7.6+hs,-3.2);g.closePath();g.fill();
    g.fillStyle=HP.packSh;g.fillRect(-1.4,-22.4,1.6,8.6);
    g.strokeStyle=L.tassel;g.lineWidth=.9;g.beginPath();g.moveTo(3.8,-20.4);g.lineTo(4,-15);g.stroke();g.fillStyle=L.tassel;ell(g,4,-14,1,1.7);g.fill();
    g.fillStyle=L.robeSh;rr(g,-st*.7-2.1,-21.8,4.4,9,2);g.fill();g.fillStyle=L.skin;circ(g,-st*.7,-11.2,1.9);
    return;
  }
  foot(g,-3.1,Math.max(0,sw)*1.6,L);foot(g,3.1,Math.max(0,-sw)*1.6,L);
  sleeve(g,-8.4,sw*1.8,L);sleeve(g,8.4,-sw*1.8,L);
  garment(g,L,sw*1.1,6.6,9.2);
  if(view==='up'){g.fillStyle=HP.pack;rr(g,-5.6,-22.4,11.2,10.6,2.6);g.fill();g.fillStyle=HP.packSh;rr(g,-5.6,-22.4,11.2,4,2);g.fill();return;}
  g.strokeStyle=L.robeSh;g.lineWidth=.9;g.beginPath();g.arc(0,-22.6,2.8,0,Math.PI);g.stroke();
  g.strokeStyle=L.tassel;g.beginPath();g.moveTo(0,-19.8);g.lineTo(0,-14.8);g.stroke();g.fillStyle=L.tassel;ell(g,0,-13.8,1.1,1.9);g.fill();
  g.fillStyle=HP.packSh;g.fillRect(-5.4,-22,1.6,8);g.fillRect(3.8,-22,1.6,8);
}
function legF(g,cx,lift){const P=HP;g.fillStyle=P.pants;g.fillRect(cx-2.2,-11,4.4,7.5-lift);g.fillStyle=P.boot;rr(g,cx-2.8,-4.8-lift,5.6,4.8,1.6);g.fill();g.fillStyle=P.bootSh;g.fillRect(cx-2.8,-1.5-lift,5.6,1.5);}
function armF(g,cx,off){const P=HP;g.fillStyle=P.tunicSh;rr(g,cx-2,-21.5+off*.5,4,8.5,2);g.fill();g.fillStyle=P.skin;circ(g,cx,-12.2+off*.5,1.9);}
function heroFront(g,sw,moving,t,blink){
  const P=HP;
  if(!HO){
  legF(g,-3.2,Math.max(0,sw)*1.8);legF(g,3.2,Math.max(0,-sw)*1.8);
  armF(g,-8.3,sw*2);armF(g,8.3,-sw*2);
  g.fillStyle=P.tunic;g.beginPath();g.moveTo(-6.5,-22.5);g.lineTo(6.5,-22.5);g.lineTo(8.2,-9.6);g.quadraticCurveTo(0,-8,-8.2,-9.6);g.closePath();g.fill();
  g.fillStyle=P.tunicSh;g.beginPath();g.moveTo(3.2,-22.5);g.lineTo(6.5,-22.5);g.lineTo(8.2,-9.6);g.quadraticCurveTo(5.5,-9,3.2,-9.1);g.closePath();g.fill();
  g.fillStyle=P.tunicHi;g.fillRect(-.6,-20,1.2,6);
  g.fillStyle=P.packSh;g.fillRect(-5.4,-22,1.6,8);g.fillRect(3.8,-22,1.6,8);
  g.fillStyle=P.belt;g.fillRect(-7.2,-14,14.4,2.5);g.fillStyle=P.buckle;g.fillRect(-1.4,-14.4,2.8,3.2);
  g.fillStyle=P.scarf;rr(g,-6.2,-24.6,12.4,4.2,2);g.fill();
  const f=Math.sin(t*6)*.9+(moving?Math.sin(t*14)*.8:0);
  g.fillStyle=P.scarfSh;g.beginPath();g.moveTo(3.6,-21.5);g.lineTo(6.8,-21.5);g.lineTo(8+f,-15.2);g.lineTo(5,-16.2);g.closePath();g.fill();
  }
  const hy=-31.5;
  g.fillStyle=P.skinSh;ell(g,-8.5,hy+1.5,1.7,2.4);g.fill();ell(g,8.5,hy+1.5,1.7,2.4);g.fill();
  g.fillStyle=P.skin;ell(g,0,hy,8.6,8.3);g.fill();
  g.fillStyle=P.hair;g.beginPath();g.ellipse(0,hy-1.8,9.6,8.4,0,Math.PI,TAU);
  g.lineTo(9.5,hy+1.2);g.lineTo(7.6,hy-.6);g.lineTo(6,hy+1.8);g.lineTo(4,hy-1.2);g.lineTo(1.6,hy+1.2);g.lineTo(-.9,hy-1.8);g.lineTo(-3.4,hy+1.2);g.lineTo(-5.6,hy-1.4);g.lineTo(-7.6,hy+1.8);g.lineTo(-9.5,hy+1.2);g.closePath();g.fill();
  g.beginPath();g.moveTo(-4,hy-9.2);g.lineTo(-2.2,hy-13.2);g.lineTo(-.2,hy-9.8);g.lineTo(1.8,hy-12.6);g.lineTo(3.6,hy-9.4);g.closePath();g.fill();
  g.strokeStyle=P.hairHi;g.lineWidth=1.3;g.beginPath();g.arc(-1.5,hy-3.5,6.2,Math.PI*1.12,Math.PI*1.5);g.stroke();
  g.fillStyle=P.eye;
  if(blink){g.fillRect(-4.4,hy+2.6,2.7,.9);g.fillRect(1.7,hy+2.6,2.7,.9);}
  else{ell(g,-3.1,hy+2.7,1.25,1.95);g.fill();ell(g,3.1,hy+2.7,1.25,1.95);g.fill();g.fillStyle='#fff';circ(g,-2.7,hy+2,.5);circ(g,3.5,hy+2,.5);}
  g.fillStyle='rgba(232,120,100,.38)';ell(g,-5.2,hy+5,1.7,.9);g.fill();ell(g,5.2,hy+5,1.7,.9);g.fill();
  g.fillStyle='#b2654c';g.fillRect(-.9,hy+5.8,1.8,.75);
}
function heroBack(g,sw,moving,t){
  const P=HP;
  if(!HO){
  legF(g,-3.2,Math.max(0,sw)*1.8);legF(g,3.2,Math.max(0,-sw)*1.8);
  armF(g,-8.3,sw*2);armF(g,8.3,-sw*2);
  g.fillStyle=P.tunic;g.beginPath();g.moveTo(-6.5,-22.5);g.lineTo(6.5,-22.5);g.lineTo(8.2,-9.6);g.quadraticCurveTo(0,-8,-8.2,-9.6);g.closePath();g.fill();
  g.fillStyle=P.belt;g.fillRect(-7.2,-14,14.4,2.5);
  g.fillStyle=P.pack;rr(g,-5.6,-22.4,11.2,10.6,2.6);g.fill();
  g.fillStyle=P.packSh;rr(g,-5.6,-22.4,11.2,4,2);g.fill();g.fillStyle=P.buckle;g.fillRect(-.9,-19.2,1.8,1.8);
  g.fillStyle=P.scarf;rr(g,-6.2,-24.6,12.4,4.2,2);g.fill();
  const f=Math.sin(t*5)*1.1+(moving?Math.sin(t*13)*1.2:0);
  g.fillStyle=P.scarfSh;g.beginPath();g.moveTo(-1.6,-21.5);g.lineTo(1.6,-21.5);g.lineTo(2+f,-14.2);g.lineTo(-1.4+f,-14.8);g.closePath();g.fill();
  }
  const hy=-31.5;
  g.fillStyle=P.skinSh;ell(g,-8.6,hy+1.6,1.6,2.3);g.fill();ell(g,8.6,hy+1.6,1.6,2.3);g.fill();
  g.fillStyle=P.hair;ell(g,0,hy-.4,9.4,9);g.fill();
  g.beginPath();g.moveTo(-6,hy+6);g.lineTo(-3.5,hy+9.4);g.lineTo(-1.2,hy+6.6);g.lineTo(1.2,hy+9.6);g.lineTo(3.6,hy+6.6);g.lineTo(5.8,hy+8.6);g.lineTo(7,hy+5);g.closePath();g.fill();
  g.beginPath();g.moveTo(-4,hy-8.4);g.lineTo(-2.2,hy-12.6);g.lineTo(-.2,hy-9.2);g.lineTo(1.8,hy-12);g.lineTo(3.6,hy-8.6);g.closePath();g.fill();
  g.strokeStyle=P.hairHi;g.lineWidth=1.2;g.beginPath();g.arc(-1,hy-1.5,6.4,Math.PI*1.1,Math.PI*1.55);g.stroke();
}
function heroSide(g,sw,moving,t,blink){
  const P=HP,st=sw*2.8;
  if(!HO){
  g.fillStyle='#3c3029';g.fillRect(-st-2,-11,4,7.5);g.fillStyle=P.bootSh;rr(g,-st-2.2,-4.8,6,4.8,1.6);g.fill();
  g.fillStyle='#24456f';rr(g,st*.8-2,-21.5,4,8.5,2);g.fill();g.fillStyle=P.skinSh;circ(g,st*.8,-12.4,1.8);
  g.fillStyle=P.pack;rr(g,-9.6,-22.6,5.4,10.4,2.2);g.fill();g.fillStyle=P.packSh;g.fillRect(-9.6,-22.6,5.4,3);
  g.fillStyle=P.tunic;g.beginPath();g.moveTo(-5.2,-22.5);g.lineTo(5.4,-22.5);g.lineTo(6.8,-9.6);g.quadraticCurveTo(0,-8.4,-6.6,-9.6);g.closePath();g.fill();
  g.fillStyle=P.tunicSh;g.fillRect(-5.4,-14.6,3,4.8);
  g.fillStyle=P.belt;g.fillRect(-6,-14,12.4,2.5);g.fillStyle=P.packSh;g.fillRect(-1.2,-22.4,1.6,8.6);
  g.fillStyle=P.pants;g.fillRect(st-2,-11,4,7.5);g.fillStyle=P.boot;rr(g,st-2.2,-4.8,6.2,4.8,1.6);g.fill();g.fillStyle=P.bootSh;g.fillRect(st-2.2,-1.5,6.2,1.5);
  g.fillStyle=P.scarf;rr(g,-5.6,-24.6,11.4,4.2,2);g.fill();
  const stream=moving?3.4:0,fl=Math.sin(t*(moving?13:5))*(moving?1.6:.8);
  g.fillStyle=P.scarfSh;g.beginPath();g.moveTo(-4.6,-23.6);g.lineTo(-10.5-stream,-22.6+fl);g.lineTo(-9.6-stream,-19.2+fl);g.lineTo(-4.6,-20.8);g.closePath();g.fill();
  }
  const hy=-31.5;
  g.fillStyle=P.skin;ell(g,.8,hy,8.4,8.2);g.fill();
  g.fillStyle=P.hair;g.beginPath();g.ellipse(.2,hy-1.6,9.4,8.4,0,Math.PI*.98,TAU);
  g.lineTo(9.6,hy-.8);g.lineTo(7.6,hy+.6);g.lineTo(6.2,hy-1.4);g.lineTo(4.2,hy+.4);g.lineTo(2.6,hy-1.8);g.lineTo(.6,hy+1.5);
  g.lineTo(-1.6,hy+5);g.lineTo(-4.2,hy+8.8);g.lineTo(-6.6,hy+6.4);g.lineTo(-9,hy+5.4);g.lineTo(-9.2,hy-1);g.closePath();g.fill();
  g.beginPath();g.moveTo(-4.6,hy-8.6);g.lineTo(-3.6,hy-12.8);g.lineTo(-1,hy-9.6);g.lineTo(1.4,hy-12.2);g.lineTo(3,hy-9);g.closePath();g.fill();
  g.strokeStyle=P.hairHi;g.lineWidth=1.2;g.beginPath();g.arc(-.5,hy-3.2,6.3,Math.PI*1.08,Math.PI*1.5);g.stroke();
  g.fillStyle=P.skinSh;ell(g,-.6,hy+2,1.6,2.3);g.fill();
  g.fillStyle=P.eye;if(blink)g.fillRect(3.4,hy+2.8,2.4,.9);else{ell(g,4.6,hy+2.7,1.15,1.95);g.fill();g.fillStyle='#fff';circ(g,5,hy+2,.45);}
  g.fillStyle='rgba(232,120,100,.38)';ell(g,4.2,hy+5.4,1.5,.85);g.fill();
  g.fillStyle=P.skin;ell(g,9,hy+3.6,1.1,1.1);g.fill();
  if(!HO){g.fillStyle=P.tunicSh;rr(g,-st*.8-2,-21.5,4,8.5,2);g.fill();g.fillStyle=P.skin;circ(g,-st*.8,-12.4,1.9);}
}

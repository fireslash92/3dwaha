// رسم أهل القرية بالأزياء العمانية
'use strict';

/* =========================================================
   ART: Omani villagers
   men: dishdasha + furakha tassel, kumma cap or massar turban
   women: embroidered dress over sirwal, lahaf head-scarf
   ========================================================= */
const LOOKS={
  salem:{g:'m',age:'old',robe:'#f5f2ea',robeSh:'#d8d1c3',tassel:'#c9b48a',head:'massar',hw:['#6d3b7a','#e3a23c','#f3ead8'],hair:'#efebe2',beard:'#f2eee6',skin:'#d6a179',cane:true},
  saeed:{g:'m',robe:'#cdb08a',robeSh:'#a98c66',tassel:'#7d6243',head:'kumma',hw:['#f7f3ea','#2f7a6d'],hair:'#241a14',beard:'#241a14',skin:'#c88d62'},
  rashid:{g:'m',robe:'#eef1f3',robeSh:'#cbd2d7',tassel:'#9aa6ae',head:'massar',hw:['#2f5f8f','#e9c86a','#f3ead8'],hair:'#2d241e',beard:'#3a2f28',skin:'#c48a5e'},
  hamad:{g:'m',child:true,robe:'#f8f6f0',robeSh:'#dcd8ce',tassel:'#d9534f',head:'kumma',hw:['#ffffff','#c0392b'],hair:'#1f1712',skin:'#d8a274'},
  mariam:{g:'f',dress:'#2f7d55',dressSh:'#235f40',emb:'#d8443a',emb2:'#f6d36b',scarf:'#e0582f',scarfSh:'#b4401c',scarfDot:'#ffd27a',sirwal:'#d8443a',skin:'#d9a67c'},
  shamsa:{g:'f',child:true,dress:'#e86a8a',dressSh:'#c24f6e',emb:'#f6c84a',emb2:'#ffffff',scarf:'#f3a83b',scarfSh:'#cf8424',scarfDot:'#fff2c9',sirwal:'#6a3fa0',skin:'#dcaa80'},
  ummsaeed:{g:'f',age:'old',dress:'#5b2f6e',dressSh:'#43215a',emb:'#e2b54a',emb2:'#f7e3a6',scarf:'#231c26',scarfSh:'#140f16',scarfTrim:'#e2b54a',sirwal:'#e2b54a',skin:'#c99068'},
  aisha:{g:'f',dress:'#2f6fa8',dressSh:'#245886',emb:'#f0a33a',emb2:'#ffffff',scarf:'#c43c6a',scarfSh:'#992c51',scarfDot:'#ffd1e0',sirwal:'#f0a33a',skin:'#d9a67c'},
  zuwaina:{g:'f',age:'old',dress:'#8d2a2a',dressSh:'#6a1f1f',emb:'#e7c25a',emb2:'#fff0bf',scarf:'#2a1f1a',scarfSh:'#17100c',scarfTrim:'#c9473a',sirwal:'#e7c25a',skin:'#c48d66',cane:true},
};
const isF=L=>L.g==='f';
function drawPerson(g,x,y,dir,L,t,moving,phase){
  const sc=L.child?.82:1;
  const sw=moving?Math.sin(phase):0;
  const bob=moving?Math.abs(Math.sin(phase))*1.1:Math.sin(t*1.8+x*.01)*.4;
  g.save();g.translate(x,y);
  g.fillStyle='rgba(35,22,10,.3)';ell(g,0,0,9.5*sc,3.4*sc);g.fill();
  g.scale(sc,sc);
  if(dir==='left')g.scale(-1,1);
  g.translate(0,-bob);
  if(dir==='left'||dir==='right')personSide(g,L,sw);
  else if(dir==='up')personBack(g,L,sw);
  else personFront(g,L,sw);
  g.restore();
}
function gCols(L){return isF(L)?[L.dress,L.dressSh]:[L.robe,L.robeSh];}
function foot(g,cx,lift,L){
  if(isF(L)){g.fillStyle=L.sirwal;g.fillRect(cx-2.5,-6.2-lift,5,3.4);g.fillStyle=L.emb2||'#f6d36b';g.fillRect(cx-2.5,-4.2-lift,5,.9);}
  g.fillStyle='#4a2f1e';ell(g,cx,-.8-lift,2.9,1.2);g.fill();
  g.fillStyle=L.skin;ell(g,cx,-1.8-lift,2.2,1.5);g.fill();
  g.fillStyle='#6b4528';g.fillRect(cx-2.3,-2.4-lift,4.6,1);
}
function sleeve(g,cx,off,L,raise){
  const sh=gCols(L)[1],y0=raise?-21.8:-21.8+off*.5,hh=raise?7:9.2;
  g.fillStyle=sh;rr(g,cx-2.2,y0,4.4,hh,2.1);g.fill();
  if(isF(L)){g.fillStyle=L.emb;g.fillRect(cx-2.2,y0+hh-2,4.4,1.8);}
  g.fillStyle=L.skin;circ(g,raise?cx+.6:cx,raise?y0+hh+1.2:y0+hh+1.6,1.9);
}
function cane(g,x){g.strokeStyle='#7b5231';g.lineWidth=2.2;g.lineCap='round';g.beginPath();g.moveTo(x,-33);g.lineTo(x+.4,-.5);g.stroke();g.beginPath();g.arc(x-2.4,-33,2.4,Math.PI*1.9,Math.PI*1.05,true);g.stroke();}
function garment(g,L,hs,w0,w1){
  const [c,sh]=gCols(L);
  g.fillStyle=c;g.beginPath();g.moveTo(-w0,-22.6);g.lineTo(w0,-22.6);g.lineTo(w1+hs,-3.4);g.quadraticCurveTo(hs,-1.8,-w1+hs,-3.4);g.closePath();g.fill();
  g.fillStyle=sh;g.beginPath();g.moveTo(w0*.48,-22.6);g.lineTo(w0,-22.6);g.lineTo(w1+hs,-3.4);g.lineTo(w1*.55+hs,-2.6);g.closePath();g.fill();
  if(isF(L)){
    g.fillStyle=L.emb;g.beginPath();g.moveTo(-w1+hs,-3.4);g.quadraticCurveTo(hs,-1.8,w1+hs,-3.4);g.lineTo(w1-.3+hs,-5.8);g.quadraticCurveTo(hs,-4.2,-w1+.3+hs,-5.8);g.closePath();g.fill();
    g.fillStyle=L.emb2||'#f6d36b';for(let k=-w1+1.5;k<w1-1;k+=2.6)circ(g,k+hs,-4.4,.5);
  }
}
function personFront(g,L,sw){
  const F=isF(L),hs=sw*1.1;
  if(L.cane)cane(g,10.6);
  foot(g,-3.1,Math.max(0,sw)*1.6,L);foot(g,3.1,Math.max(0,-sw)*1.6,L);
  sleeve(g,-8.4,sw*1.8,L);sleeve(g,8.4,-sw*1.8,L,L.cane);
  garment(g,L,hs,6.6,9.2);
  const [c,sh]=gCols(L);
  if(F){
    g.fillStyle=L.emb;poly(g,[-3.8,-22.6,3.8,-22.6,0,-17]);g.fillStyle=c;poly(g,[-2,-22.6,2,-22.6,0,-19.6]);
    g.fillStyle=L.emb;g.fillRect(-.8,-17,1.6,8.5);g.fillStyle=L.emb2||'#fff';for(let k=-16;k<-9;k+=2.2)circ(g,0,k,.45);
  }else{
    g.strokeStyle=sh;g.lineWidth=.9;g.beginPath();g.arc(0,-22.6,2.8,0,Math.PI);g.stroke();
    g.strokeStyle=L.tassel;g.beginPath();g.moveTo(0,-19.8);g.lineTo(0,-14.8);g.stroke();
    g.fillStyle=L.tassel;ell(g,0,-13.8,1.1,1.9);g.fill();
    g.strokeStyle='rgba(0,0,0,.07)';g.beginPath();g.moveTo(-3.4,-17);g.lineTo(-4.6,-4);g.moveTo(2.4,-17);g.lineTo(3.4,-4);g.stroke();
  }
  headFront(g,L);
}
function eyesFront(g,L,hy,gap){
  if(L.age==='old'){g.strokeStyle='#3a2a20';g.lineWidth=1.05;g.beginPath();g.arc(-gap,hy,1.4,Math.PI*1.15,Math.PI*1.85);g.stroke();g.beginPath();g.arc(gap,hy,1.4,Math.PI*1.15,Math.PI*1.85);g.stroke();return;}
  g.fillStyle='#22170f';
  ell(g,-gap,hy,1.15,1.8);g.fill();ell(g,gap,hy,1.15,1.8);g.fill();
  if(isF(L)){g.fillRect(-gap-1.6,hy-1.9,2.6,.6);g.fillRect(gap-1,hy-1.9,2.6,.6);}
  g.fillStyle='#fff';circ(g,-gap+.4,hy-.6,.45);circ(g,gap+.4,hy-.6,.45);
}
function headwear(g,L,hy,o){
  if(L.head==='kumma'){
    g.fillStyle=L.hw[0];g.beginPath();g.moveTo(-8.6+o,hy-1.8);g.lineTo(-8.2+o,hy-7.4);g.quadraticCurveTo(o,hy-12.2,8.2+o,hy-7.4);g.lineTo(8.6+o,hy-1.8);g.quadraticCurveTo(o,hy-3.6,-8.6+o,hy-1.8);g.closePath();g.fill();
    g.fillStyle=L.hw[1];
    for(let k=-7;k<=7;k+=2.33)g.fillRect(k+o-.6,hy-5,1.2,1.2);
    for(let k=-5;k<=5;k+=2.5)poly(g,[k+o-1,hy-6.6,k+o,hy-8.6,k+o+1,hy-6.6]);
    g.fillRect(-8.4+o,hy-3.2,16.8,.8);
  }else{
    g.save();g.beginPath();g.moveTo(-9.8+o,hy-1);g.lineTo(-10+o,hy-6.2);g.quadraticCurveTo(o,hy-15,10+o,hy-6.2);g.lineTo(9.8+o,hy-1);g.quadraticCurveTo(o,hy-3.4,-9.8+o,hy-1);g.closePath();
    g.fillStyle=L.hw[0];g.fill();g.clip();
    g.strokeStyle=L.hw[1];g.lineWidth=1.6;g.beginPath();for(let k=-20;k<20;k+=4.6){g.moveTo(k,hy);g.lineTo(k+9,hy-14);}g.stroke();
    g.strokeStyle=L.hw[2];g.lineWidth=.7;g.beginPath();for(let k=-18;k<20;k+=4.6){g.moveTo(k,hy);g.lineTo(k+9,hy-14);}g.stroke();
    g.fillStyle='rgba(0,0,0,.18)';g.fillRect(-12,hy-3.6,24,2.6);
    g.restore();
  }
}
function headFront(g,L){
  const hy=-31;
  if(isF(L)){
    g.fillStyle=L.scarfSh;g.beginPath();g.ellipse(0,hy-.4,10.6,10.2,0,Math.PI,TAU);g.lineTo(10.6,hy+2);g.quadraticCurveTo(11.2,-21,8.4,-18.4);g.lineTo(-8.4,-18.4);g.quadraticCurveTo(-11.2,-21,-10.6,hy+2);g.closePath();g.fill();
    g.fillStyle=L.scarf;g.beginPath();g.ellipse(0,hy-.6,10,9.8,0,Math.PI,TAU);g.lineTo(10,hy+2);g.quadraticCurveTo(9.6,hy+9,6,hy+10.6);g.lineTo(-6,hy+10.6);g.quadraticCurveTo(-9.6,hy+9,-10,hy+2);g.closePath();g.fill();
    g.fillStyle=L.skin;ell(g,0,hy+1.6,6.8,7);g.fill();
    g.fillStyle=L.scarf;g.beginPath();g.ellipse(0,hy-1.8,7.8,4.6,0,Math.PI,TAU);g.closePath();g.fill();
    if(L.scarfTrim){g.strokeStyle=L.scarfTrim;g.lineWidth=1;g.beginPath();g.ellipse(0,hy-1.8,7.8,4.6,0,Math.PI,TAU);g.stroke();}
    if(L.scarfDot){g.fillStyle=L.scarfDot;[[-7,hy-4],[-4,hy-8],[1,hy-9],[5.5,hy-6.5],[8,hy-1],[-8.5,hy+3],[7.5,hy+6],[-6.5,hy+8]].forEach(p=>circ(g,p[0],p[1],.7));}
    eyesFront(g,L,hy+2.6,2.7);
    g.fillStyle='rgba(232,120,100,.4)';ell(g,-4.3,hy+5,1.5,.85);g.fill();ell(g,4.3,hy+5,1.5,.85);g.fill();
    g.fillStyle='#a8573f';g.fillRect(-.8,hy+6.4,1.6,.7);
    if(L.age==='old'){g.strokeStyle='rgba(120,70,40,.35)';g.lineWidth=.6;g.beginPath();g.moveTo(-3,hy+5.6);g.quadraticCurveTo(-2,hy+7,-1,hy+7.4);g.moveTo(3,hy+5.6);g.quadraticCurveTo(2,hy+7,1,hy+7.4);g.stroke();}
    return;
  }
  g.fillStyle=L.skin;ell(g,-8.3,hy+1.4,1.6,2.3);g.fill();ell(g,8.3,hy+1.4,1.6,2.3);g.fill();
  ell(g,0,hy,8.2,8);g.fill();
  g.fillStyle=L.hair;g.fillRect(-8.4,hy-2,1.8,3.4);g.fillRect(6.6,hy-2,1.8,3.4);
  headwear(g,L,hy,0);
  if(L.age==='old'){g.fillStyle=L.hair;rr(g,-5.8,hy-.2,3.8,1.4,.7);g.fill();rr(g,2,hy-.2,3.8,1.4,.7);g.fill();}
  else{g.fillStyle=L.hair;g.fillRect(-5.2,hy-.4,3,.8);g.fillRect(2.2,hy-.4,3,.8);}
  eyesFront(g,L,hy+2.6,3);
  if(L.age==='old'){
    g.fillStyle=L.beard;g.beginPath();g.moveTo(-6.6,hy+2.6);g.quadraticCurveTo(-6.4,hy+9.6,0,hy+13.2);g.quadraticCurveTo(6.4,hy+9.6,6.6,hy+2.6);g.quadraticCurveTo(3,hy+5.4,0,hy+5);g.quadraticCurveTo(-3,hy+5.4,-6.6,hy+2.6);g.closePath();g.fill();
    g.strokeStyle='rgba(150,140,125,.6)';g.lineWidth=.7;g.beginPath();g.moveTo(-2.5,hy+7);g.quadraticCurveTo(-2,hy+10,0,hy+12);g.moveTo(2.5,hy+7);g.quadraticCurveTo(2,hy+10,0,hy+12);g.stroke();
    g.fillStyle='#b98563';ell(g,0,hy+3.4,1.3,1.1);g.fill();
    g.fillStyle=L.beard;ell(g,-2,hy+5,2.3,1.15);g.fill();ell(g,2,hy+5,2.3,1.15);g.fill();
  }else if(L.beard){
    g.fillStyle=L.beard;g.beginPath();g.moveTo(-7.4,hy+.6);g.quadraticCurveTo(-6.8,hy+8.4,0,hy+9.4);g.quadraticCurveTo(6.8,hy+8.4,7.4,hy+.6);g.lineTo(6.4,hy+.8);g.quadraticCurveTo(5,hy+5.8,0,hy+6.2);g.quadraticCurveTo(-5,hy+5.8,-6.4,hy+.8);g.closePath();g.fill();
    g.fillRect(-2.8,hy+4.6,5.6,1.1);
  }else{
    g.fillStyle='rgba(232,120,100,.35)';ell(g,-5,hy+5,1.6,.9);g.fill();ell(g,5,hy+5,1.6,.9);g.fill();
    g.fillStyle='#a8573f';g.fillRect(-.9,hy+5.8,1.8,.75);
  }
}
function personBack(g,L,sw){
  const hs=sw*1.1;
  foot(g,-3.1,Math.max(0,sw)*1.6,L);foot(g,3.1,Math.max(0,-sw)*1.6,L);
  if(L.cane)cane(g,-10.6);
  sleeve(g,-8.4,sw*1.8,L,L.cane);sleeve(g,8.4,-sw*1.8,L);
  garment(g,L,hs,6.6,9.2);
  const hy=-31;
  if(isF(L)){
    g.fillStyle=L.scarf;g.beginPath();g.ellipse(0,hy-.4,10.2,10,0,Math.PI,TAU);g.lineTo(10.2,hy+3);g.quadraticCurveTo(11,-17,9,-14.6);g.quadraticCurveTo(0,-12.6,-9,-14.6);g.quadraticCurveTo(-11,-17,-10.2,hy+3);g.closePath();g.fill();
    g.fillStyle=L.scarfSh;g.beginPath();g.moveTo(-9,-14.6);g.quadraticCurveTo(0,-12.6,9,-14.6);g.lineTo(8.6,-16.6);g.quadraticCurveTo(0,-14.8,-8.6,-16.6);g.closePath();g.fill();
    if(L.scarfTrim){g.fillStyle=L.scarfTrim;g.beginPath();g.moveTo(-9,-14.6);g.quadraticCurveTo(0,-12.6,9,-14.6);g.lineTo(9,-13.6);g.quadraticCurveTo(0,-11.6,-9,-13.6);g.closePath();g.fill();}
    if(L.scarfDot){g.fillStyle=L.scarfDot;[[-6,hy-4],[0,hy-7],[6,hy-4],[-4,hy+3],[4,hy+3],[0,-17],[-6,-17.6],[6,-17.6]].forEach(p=>circ(g,p[0],p[1],.7));}
    return;
  }
  g.fillStyle=L.skin;ell(g,-8.3,hy+1.4,1.6,2.3);g.fill();ell(g,8.3,hy+1.4,1.6,2.3);g.fill();
  g.fillStyle=L.hair;ell(g,0,hy+.4,8.3,7.8);g.fill();
  headwear(g,L,hy,0);
}
function personSide(g,L,sw){
  const st=sw*2.6,hs=sw*.8;
  foot(g,-st,0,L);foot(g,st+1,0,L);
  const [c,sh]=gCols(L);
  g.fillStyle=sh;rr(g,st*.7-2.1,-21.8,4.2,9,2);g.fill();g.fillStyle=L.skin;circ(g,st*.7,-11.4,1.8);
  g.fillStyle=c;g.beginPath();g.moveTo(-5.4,-22.6);g.lineTo(5.6,-22.6);g.lineTo(7.6+hs,-3.2);g.quadraticCurveTo(hs,-1.8,-7.6+hs,-3.2);g.closePath();g.fill();
  g.fillStyle=sh;g.beginPath();g.moveTo(-5.4,-22.6);g.lineTo(-2.2,-22.6);g.lineTo(-3+hs,-2.4);g.lineTo(-7.6+hs,-3.2);g.closePath();g.fill();
  if(isF(L)){g.fillStyle=L.emb;g.beginPath();g.moveTo(-7.6+hs,-3.2);g.quadraticCurveTo(hs,-1.8,7.6+hs,-3.2);g.lineTo(7.3+hs,-5.6);g.quadraticCurveTo(hs,-4.2,-7.3+hs,-5.6);g.closePath();g.fill();g.fillRect(3.2,-21.6,1.4,10);}
  else{g.strokeStyle=L.tassel;g.lineWidth=.9;g.beginPath();g.moveTo(3.8,-20.4);g.lineTo(4,-15);g.stroke();g.fillStyle=L.tassel;ell(g,4,-14,1,1.7);g.fill();}
  if(L.cane)cane(g,9.4);
  const hy=-31;
  if(isF(L)){
    g.fillStyle=L.scarf;g.beginPath();g.moveTo(7.6,hy-3.6);g.quadraticCurveTo(4,hy-10.8,-2,hy-10.2);g.quadraticCurveTo(-10.8,hy-8,-10.4,hy+2);g.quadraticCurveTo(-10.8,-21,-8.6,-17.6);g.lineTo(-.6,-18.4);g.quadraticCurveTo(2.6,hy+9.6,3.2,hy+7);g.lineTo(1.2,hy-2);g.closePath();g.fill();
    g.fillStyle=L.scarfSh;g.beginPath();g.moveTo(-10.4,hy+2);g.quadraticCurveTo(-10.8,-21,-8.6,-17.6);g.lineTo(-5.4,-18);g.quadraticCurveTo(-7,hy+4,-6,hy-2);g.closePath();g.fill();
    g.fillStyle=L.skin;ell(g,3.6,hy+1.6,5,6.6);g.fill();
    g.fillStyle=L.scarf;g.beginPath();g.ellipse(2.6,hy-2,6.4,3.8,0,Math.PI,TAU);g.closePath();g.fill();
    if(L.scarfTrim){g.strokeStyle=L.scarfTrim;g.lineWidth=1;g.beginPath();g.ellipse(2.6,hy-2,6.4,3.8,0,Math.PI,TAU);g.stroke();}
    if(L.scarfDot){g.fillStyle=L.scarfDot;[[-5,hy-5],[-1,hy-8],[-8,hy+1],[-6,hy+7]].forEach(p=>circ(g,p[0],p[1],.7));}
    if(L.age==='old'){g.strokeStyle='#3a2a20';g.lineWidth=1.05;g.beginPath();g.arc(5.4,hy+2.8,1.3,Math.PI*1.15,Math.PI*1.85);g.stroke();}
    else{g.fillStyle='#22170f';ell(g,5.4,hy+2.6,1.05,1.7);g.fill();g.fillRect(4.6,hy+.6,2.4,.55);}
    g.fillStyle=L.skin;ell(g,8.4,hy+3.2,1,1);g.fill();
    g.fillStyle='rgba(232,120,100,.4)';ell(g,4.6,hy+5.2,1.4,.8);g.fill();
  }else{
    g.fillStyle=L.hair;ell(g,-2.6,hy+.8,6.2,6.8);g.fill();
    g.fillStyle=L.skin;ell(g,1.2,hy,7.6,7.8);g.fill();
    ell(g,-1.2,hy+1.6,1.6,2.3);g.fill();g.fillStyle='rgba(0,0,0,.12)';ell(g,-1.2,hy+1.6,.8,1.3);g.fill();
    headwear(g,L,hy,.4);
    if(L.age==='old'){g.fillStyle=L.hair;rr(g,3,hy-.3,4,1.4,.7);g.fill();g.strokeStyle='#3a2a20';g.lineWidth=1.05;g.beginPath();g.arc(5.2,hy+2.8,1.3,Math.PI*1.15,Math.PI*1.85);g.stroke();}
    else{g.fillStyle='#22170f';ell(g,5.2,hy+2.6,1.05,1.75);g.fill();g.fillStyle='#fff';circ(g,5.5,hy+2,.4);}
    g.fillStyle=L.skin;ell(g,8.8,hy+3.2,1.2,1.2);g.fill();
    if(L.age==='old'){
      g.fillStyle=L.beard;g.beginPath();g.moveTo(1,hy+3.2);g.quadraticCurveTo(7,hy+4,8.8,hy+5.6);g.quadraticCurveTo(7.4,hy+11,2.6,hy+13);g.quadraticCurveTo(-.4,hy+8,1,hy+3.2);g.closePath();g.fill();
    }else if(L.beard){
      g.fillStyle=L.beard;g.beginPath();g.moveTo(.4,hy+1.4);g.quadraticCurveTo(6,hy+4.6,8.6,hy+5.4);g.quadraticCurveTo(7,hy+9.2,2,hy+8.6);g.quadraticCurveTo(-.6,hy+6,.4,hy+1.4);g.closePath();g.fill();
    }else{g.fillStyle='rgba(232,120,100,.35)';ell(g,4.4,hy+5.2,1.4,.8);g.fill();}
  }
  g.fillStyle=sh;
  if(L.cane){rr(g,4.6,-21.8,4.4,7,2);g.fill();g.fillStyle=L.skin;circ(g,8.8,-13.6,1.9);}
  else{rr(g,-st*.7-2.1,-21.8,4.4,9,2);g.fill();g.fillStyle=L.skin;circ(g,-st*.7,-11.2,1.9);}
}

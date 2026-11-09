// الإضاءة والعمق: ظلال الغيوم، أشعة الشمس بين أشجار الغابة، أغصان أمامية تتحرك أسرع من الأرض، وتوهّج الزعماء
'use strict';

/* ---------- cloud shadows drifting over open ground (world space) ---------- */
let SHADECV=null;
function drawCloudShadows(g,L,T,R2,B2){
  if(!fxOn()||!(scene.id==='village'||scene.wadi||scene.fort))return;
  const day=1-nightAmount(),a=.34*day*(1-WX.rain*.9)*(1-WX.sand*.7)*(1-WX.fog*.8);if(a<.02)return;
  if(!SHADECV)SHADECV=cloudSheet(303,'22,34,26',14);
  const sc=2.6,tw=512*sc,th=256*sc,ox=(time*7)%tw,oy=(time*3)%th;
  g.save();g.globalAlpha=a;
  for(let y=Math.floor((T-oy)/th)*th+oy;y<B2;y+=th)for(let x=Math.floor((L-ox)/tw)*tw+ox;x<R2;x+=tw)g.drawImage(SHADECV,x,y,tw,th);
  g.restore();
}

/* ---------- forest: shafts of sun through the canopy (screen space) ---------- */
function drawSunShafts(g){
  if(!scene.forest||!fxOn())return;
  const day=1-nightAmount(),a=.24*day*(1-WX.rain)*(1-WX.fog*.4);if(a<.01)return;
  const W=canvas.width,H=canvas.height,d=view.dpr,px=-view.camX*view.zoom*d*.35;
  g.save();g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='lighter';
  for(let i=0;i<5;i++){
    const base=((i*W*.31+px)%(W*1.5)+W*1.5)%(W*1.5)-W*.25,sway=Math.sin(time*.3+i*1.7)*14*d,w=(44+(i*23)%50)*d,k=.6+.4*Math.sin(time*.5+i*2.3);
    const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,`rgba(255,236,170,${a*k})`);gr.addColorStop(1,'rgba(255,236,170,0)');
    g.fillStyle=gr;g.beginPath();g.moveTo(base+sway,0);g.lineTo(base+sway+w,0);g.lineTo(base+w*2.4-H*.35,H);g.lineTo(base+w*.6-H*.35,H);g.closePath();g.fill();
  }
  // motes floating in the light
  g.fillStyle=`rgba(255,244,200,${Math.min(.6,a*6)})`;
  for(let i=0;i<16;i++){const x=((i*157.3+time*8*d+px*.5)%W+W)%W,y=((i*93.7+Math.sin(time*.6+i)*30*d+time*5*d)%H+H)%H;g.fillRect(x,y,1.4*d,1.4*d);}
  g.restore();
}

/* ---------- forest: dark leaves in the foreground move faster than the ground ---------- */
let CANOPY=null;
function canopySheet(){
  const cv=document.createElement('canvas');cv.width=160;cv.height=512;const g=cv.getContext('2d'),R=mulberry(808);
  for(let i=0;i<46;i++){const y=R()*512,x=R()*70,r=16+R()*26;
    for(const oy of [-512,0,512]){
      g.fillStyle=['#1b3520','#234329','#2c5232'][i%3];g.beginPath();g.ellipse(x,y+oy,r,r*.72,R()*3,0,TAU);g.fill();
      g.fillStyle='rgba(150,190,100,.28)';g.beginPath();g.ellipse(x+r*.25,y+oy-r*.3,r*.45,r*.25,0,0,TAU);g.fill();}}
  // a few hanging leaf tips
  g.fillStyle='#183020';for(let i=0;i<30;i++){const y=R()*512,x=60+R()*60;g.beginPath();g.ellipse(x,y,9,4,.6+R(),0,TAU);g.fill();}
  return cv;
}
function drawCanopy(g){
  if(!scene.forest||!fxOn())return;
  if(!CANOPY)CANOPY=canopySheet();
  const d=view.dpr,H=canvas.height,W=canvas.width,s=Math.max(.8,Math.min(1.3,view.h/393))*d,tw=160*s,th=512*s;
  const oy=-view.camY*view.zoom*d*1.35,sway=Math.sin(time*.8)*4*d;
  const lit=1-nightAmount()*.55;
  g.save();g.setTransform(1,0,0,1,0,0);g.globalAlpha=.92*lit+.08;
  const y0=((oy%th)+th)%th-th;
  for(let y=y0;y<H;y+=th){
    g.drawImage(CANOPY,-tw*.3+sway,y,tw,th);
    g.save();g.translate(W+tw*.3-sway,y+th*.37);g.scale(-1,1);g.drawImage(CANOPY,0,0,tw,th);g.drawImage(CANOPY,0,-th,tw,th);g.restore();
  }
  g.restore();
}

/* ---------- boss battles: the arena breathes with a red-gold glow ---------- */
function drawBossAura(g){
  if(!B||!B.boss||B.ended)return;
  const W=canvas.width,H=canvas.height,k=.5+.5*Math.sin(time*2.2),col=B.bossType==='serpent'?'40,140,170':B.bossType==='golem'?'190,90,40':'230,190,90';
  g.save();g.setTransform(1,0,0,1,0,0);
  const gr=g.createRadialGradient(W/2,H*.45,Math.min(W,H)*.25,W/2,H*.45,Math.hypot(W,H)*.6);
  gr.addColorStop(0,`rgba(${col},0)`);gr.addColorStop(1,`rgba(${col},${.16+.1*k})`);g.fillStyle=gr;g.fillRect(0,0,W,H);
  g.restore();
}

// ممر الغابة
'use strict';

/* =========================================================
   FOREST PATH (opens after chapter one)
   ========================================================= */
const FW=640,FH=1200;
const FOREST=(()=>{
  const R=mulberry(777);
  const path=[[320,FH+40],[320,940],[232,770],[252,620],[392,470],[362,330],[320,250]];
  const clearing={x:320,y:165,r:118};
  const maxD=38;
  const stone={x:320,y:124};
  function nearest(x,y){let best=1e9,bx=0,by=0;for(let i=0;i<path.length-1;i++){const a=path[i],b=path[i+1],dx=b[0]-a[0],dy=b[1]-a[1],l=dx*dx+dy*dy;let t=((x-a[0])*dx+(y-a[1])*dy)/l;t=clamp(t,0,1);const qx=a[0]+t*dx,qy=a[1]+t*dy,d=Math.hypot(x-qx,y-qy);if(d<best){best=d;bx=qx;by=qy;}}return {d:best,x:bx,y:by};}
  const near=(x,y,m)=>nearest(x,y).d<m||Math.hypot(x-clearing.x,y-clearing.y)<clearing.r+m-34;
  const trees=[];
  for(let y=-20,row=0;y<FH+40;y+=44,row++)for(let x=-20;x<FW+40;x+=46){
    const tx=x+(R()-.5)*22+(row&1)*23,ty=y+(R()-.5)*16;
    if(near(tx,ty,60))continue;
    trees.push({x:Math.round(tx),y:Math.round(ty),kind:R()<.66?'pine':'oak',v:(R()*3)|0,phase:R()*TAU});
  }
  const corridor={t:'k',tag:'corridor'};
  const colliders=[corridor,{t:'c',x:stone.x,y:stone.y-2,r:20,tag:'stone'}];
  return {path,clearing,maxD,stone,nearest,near,trees,colliders};
})();
function corridorClamp(x,y){
  const F=FOREST,n=F.nearest(x,y),C=F.clearing,dc=Math.hypot(x-C.x,y-C.y),cr=C.r-8;
  if(n.d<=F.maxD||dc<=cr)return null;
  const ax=n.x+(x-n.x)/n.d*F.maxD,ay=n.y+(y-n.y)/n.d*F.maxD;
  const bx=C.x+(x-C.x)/dc*cr,by=C.y+(y-C.y)/dc*cr;
  return Math.hypot(ax-x,ay-y)<Math.hypot(bx-x,by-y)?{x:ax,y:ay}:{x:bx,y:by};
}
function buildForestGround(S){
  const cv=document.createElement('canvas');cv.width=Math.ceil(FW*S);cv.height=Math.ceil(FH*S);
  const g=cv.getContext('2d');g.scale(S,S);
  const R=mulberry(4242),F=FOREST;
  g.fillStyle='#3d6130';g.fillRect(0,0,FW,FH);
  for(let i=0;i<80;i++){const x=R()*FW,y=R()*FH,r=30+R()*70;const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,R()<.5?'rgba(110,150,70,.3)':'rgba(25,45,20,.35)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2);}
  ['#2f5226','#4b7638','#365e2b'].forEach(c=>{g.strokeStyle=c;g.lineWidth=.9;g.beginPath();for(let i=0;i<1600;i++){const x=R()*FW,y=R()*FH;g.moveTo(x,y);g.lineTo(x-1.2,y-3.4);g.moveTo(x,y);g.lineTo(x+1,y-3.8);}g.stroke();});
  const C=F.clearing;
  const cg=g.createRadialGradient(C.x,C.y,10,C.x,C.y,C.r+20);cg.addColorStop(0,'#78a552');cg.addColorStop(.8,'#5b8a42');cg.addColorStop(1,'rgba(61,97,48,0)');g.fillStyle=cg;g.fillRect(C.x-C.r-30,C.y-C.r-30,C.r*2+60,C.r*2+60);
  g.lineCap='round';g.lineJoin='round';
  const strokePath=(w,c)=>{g.strokeStyle=c;g.lineWidth=w;g.beginPath();F.path.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.stroke();};
  strokePath(100,'rgba(60,44,24,.35)');strokePath(86,'#7f6a48');strokePath(64,'#8f7a54');
  for(let i=0;i<900;i++){const x=R()*FW,y=R()*FH,n=F.nearest(x,y);if(n.d>44)continue;g.fillStyle=R()<.5?'rgba(60,44,24,.35)':'rgba(190,170,120,.35)';circ(g,x,y,.6+R()*1.4);}
  for(let i=0;i<260;i++){const x=R()*FW,y=R()*FH,n=F.nearest(x,y);if(n.d<30||n.d>52)continue;g.fillStyle=['#b8692c','#8f4f22','#d1a046','#6d7a2c'][(R()*4)|0];ell(g,x,y,2.2,1.2);g.fill();}
  for(let i=0;i<70;i++){const x=R()*FW,y=R()*FH;if(F.near(x,y,46))continue;g.strokeStyle='#5e9a4a';g.lineWidth=1.2;g.beginPath();for(let k=-3;k<=3;k++){g.moveTo(x,y);g.quadraticCurveTo(x+k*3,y-8,x+k*5,y-12+Math.abs(k));}g.stroke();}
  for(let i=0;i<45;i++){const x=R()*FW,y=R()*FH,n=F.nearest(x,y);if(n.d<44||n.d>70)continue;g.fillStyle='#efe6d2';g.fillRect(x-1,y-4,2,4);g.fillStyle='#c0392b';g.beginPath();g.ellipse(x,y-4,4,2.6,0,Math.PI,TAU);g.fill();g.fillStyle='#fff';circ(g,x-1.5,y-5,.6);circ(g,x+1.4,y-5.4,.5);}
  for(let i=0;i<60;i++){const a=R()*TAU,d=R()*(C.r-20),x=C.x+Math.cos(a)*d,y=C.y+Math.sin(a)*d*.9;g.fillStyle=R()<.5?'#fff7d8':'#ffe08a';circ(g,x,y,1.1);}
  F.trees.forEach(t=>softShadow(g,t.x+6,t.y+2,t.kind==='oak'?30:22,t.kind==='oak'?11:9,.45));
  softShadow(g,F.stone.x+4,F.stone.y+2,26,8,.4);
  const vg=g.createLinearGradient(0,0,FW,0);vg.addColorStop(0,'rgba(10,20,8,.55)');vg.addColorStop(.25,'rgba(10,20,8,0)');vg.addColorStop(.75,'rgba(10,20,8,0)');vg.addColorStop(1,'rgba(10,20,8,.55)');g.fillStyle=vg;g.fillRect(0,0,FW,FH);
  return cv;
}
function drawLightStone(g,x,y,t){
  g.fillStyle='#6f7a72';g.beginPath();g.moveTo(x-16,y);g.quadraticCurveTo(x-18,y-30,x-8,y-44);g.quadraticCurveTo(x+2,y-52,x+12,y-42);g.quadraticCurveTo(x+19,y-26,x+16,y);g.closePath();g.fill();
  g.fillStyle='#57625b';g.beginPath();g.moveTo(x+4,y);g.quadraticCurveTo(x+12,y-24,x+12,y-42);g.quadraticCurveTo(x+19,y-26,x+16,y);g.closePath();g.fill();
  g.fillStyle='#4f7f3a';ell(g,x-8,y-6,7,3);g.fill();ell(g,x+9,y-3,5,2.4);g.fill();
  const p=.6+.4*Math.sin(t*1.8);
  g.strokeStyle=`rgba(255,226,140,${.55+.35*p})`;g.lineWidth=1.6;g.beginPath();g.moveTo(x-6,y-14);g.lineTo(x-1,y-30);g.lineTo(x+5,y-18);g.moveTo(x-1,y-30);g.lineTo(x-1,y-40);g.stroke();
  g.fillStyle=`rgba(255,240,180,${.7+.3*p})`;poly(g,[x-2,y-34,x+1.5,y-41,x+5,y-34,x+1.5,y-28]);
  const gr=g.createRadialGradient(x,y-30,0,x,y-30,60);gr.addColorStop(0,`rgba(255,226,140,${.35*p})`);gr.addColorStop(1,'rgba(255,226,140,0)');g.fillStyle=gr;g.fillRect(x-60,y-90,120,120);
  for(let i=0;i<6;i++){const k=(t*.25+i/6)%1;g.fillStyle=`rgba(255,240,180,${.8*(1-k)})`;circ(g,x+Math.sin(t+i*2)*(10+k*8),y-30-k*50,1.2);}
}
function forestStatics(){
  const L=[];
  FOREST.trees.forEach(tr=>{
    const pine=tr.kind==='pine';
    L.push({y:tr.y,x:tr.x,b:[tr.x-46,tr.y-110,tr.x+46,tr.y+4],draw:(g,t)=>{
      blit(g,pine?SPR.pineTrunk:SPR.oakTrunk,tr.x,tr.y);
      const sway=Math.sin(t*1.25+tr.phase)*(pine?.012:.022);
      g.save();g.translate(tr.x,tr.y-(pine?12:26));g.rotate(sway);blit(g,pine?SPR.pine[tr.v%2]:SPR.oak[tr.v%3],0,0);g.restore();
    }});
  });
  const s=FOREST.stone;L.push({y:s.y,x:s.x,b:[s.x-70,s.y-100,s.x+70,s.y+10],draw:(g,t)=>drawLightStone(g,s.x,s.y,t)});
  return L;
}
SCENES.forest={id:'forest',W:FW,H:FH,bg:'#16220f',forest:true,name:'ممر الغابة',colliders:FOREST.colliders,buildGround:S=>buildForestGround(S),statics:null};
const STONE={id:'stone',name:'حجر النور',noMeet:true,portrait:'stone',x:FOREST.stone.x,y:FOREST.stone.y,talked:0,
  lines:['في قلب الفسحة حجر قديم يتوهّج بنور دافئ.','كلما اقتربت منه خفت وهجه، كأنه يختبئ منك.','على وجهه نقش لنجمة صغيرة، تشبه النجمة في خريطة شمسة.'],
  repeat:['الحجر صامت الآن، لكن النقش ما زال دافئًا تحت أصابعك.']};
let lastStep=0,encounterMeter=400,forestHintShown=false;
const resetMeter=()=>{encounterMeter=(260+Math.random()*320)*({low:1.7,normal:1,high:.6}[OPT.encounters]||1);};

// وادي الفلج (الفصل الثالث)
'use strict';

/* =========================================================
   WADI AL-FALAJ (chapter three)
   ========================================================= */
const WW=1280,WH=560;
const WADI=(()=>{
  const R=mulberry(3131);
  const gates=[{x:380},{x:720},{x:1010}];
  const spring={x:1196,y:262};
  const sign={x:150,y:236};
  const rocks=[[260,420,16],[520,200,13],[600,430,18],[860,214,12],[940,420,15],[1120,420,14],[300,214,11],[1080,206,12]].map(([x,y,r])=>({x,y,r,v:(R()*3)|0}));
  const trees=[[90,430,'palm'],[470,440,'oak'],[800,438,'palm'],[1040,440,'oak'],[680,202,'palm'],[200,200,'oak']].map(([x,y,k])=>({x,y,kind:k,v:(R()*3)|0,phase:R()*TAU}));
  const colliders=[];
  const rectC=(x,y,w,h,tag)=>colliders.push({t:'r',x,y,w,h,tag});const circC=(x,y,r,tag)=>colliders.push({t:'c',x,y,r,tag});
  rectC(0,0,WW,176,'cliff');rectC(0,452,860,WH-452,'cliff');rectC(940,452,WW-940,WH-452,'cliff');rectC(860,452,80,WH-452,'rockfall');rectC(WW-30,0,30,WH,'cliff');
  colliders.push({t:'e',x:spring.x,y:spring.y,rx:52,ry:34,tag:'spring'});
  rocks.forEach(r=>circC(r.x,r.y-3,r.r,'rock'));
  trees.forEach(t=>circC(t.x,t.y-3,t.kind==='palm'?8:10,'tree'));
  circC(sign.x,sign.y-4,14,'sign');
  return {gates,spring,sign,rocks,trees,colliders};
})();
const SOLUTION=[2,0,1];
let gateSeq=[];
const gateOpen=i=>!!P.flags.gates||gateSeq.includes(i);
function buildWadiGround(S){
  const cv=document.createElement('canvas');cv.width=Math.ceil(WW*S);cv.height=Math.ceil(WH*S);
  const g=cv.getContext('2d');g.scale(S,S);const R=mulberry(808);
  const sand=g.createLinearGradient(0,170,0,460);sand.addColorStop(0,'#cfae78');sand.addColorStop(.5,'#dcc08c');sand.addColorStop(1,'#c9a46e');
  g.fillStyle=sand;g.fillRect(0,0,WW,WH);
  for(let i=0;i<90;i++){const x=R()*WW,y=180+R()*270,r=20+R()*60;const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,R()<.5?'rgba(240,220,170,.35)':'rgba(150,110,60,.2)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2);}
  // dry wadi bed in the middle
  g.strokeStyle='rgba(150,115,70,.35)';g.lineWidth=60;g.lineCap='round';g.beginPath();g.moveTo(0,330);for(let x=0;x<=WW;x+=80)g.lineTo(x,320+Math.sin(x*.01)*26);g.stroke();
  g.strokeStyle='rgba(120,90,55,.35)';g.lineWidth=1;g.beginPath();for(let i=0;i<120;i++){const x=R()*WW,y=280+R()*90;g.moveTo(x,y);g.lineTo(x+6+R()*10,y+(R()-.5)*6);g.lineTo(x+12+R()*8,y+(R()-.5)*8);}g.stroke();
  for(let i=0;i<600;i++){const x=R()*WW,y=180+R()*270;g.fillStyle=['#a88458','#e8d3a6','#8f7048','#bfa070'][(R()*4)|0];circ(g,x,y,.6+R()*1.6);}
  for(let i=0;i<40;i++){const x=R()*WW,y=190+R()*250;g.strokeStyle='#8d9a4a';g.lineWidth=1.1;g.beginPath();for(let k=-2;k<=2;k++){g.moveTo(x,y);g.quadraticCurveTo(x+k*2,y-5,x+k*4,y-8);}g.stroke();}
  // cliffs: layered rock
  const cliff=(y0,y1,top)=>{
    const lg=g.createLinearGradient(0,y0,0,y1);lg.addColorStop(0,top?'#7a4a32':'#a8694a');lg.addColorStop(1,top?'#a8694a':'#6e4430');g.fillStyle=lg;g.fillRect(0,y0,WW,y1-y0);
    for(let k=0;k<7;k++){const yy=y0+(y1-y0)*k/7;g.fillStyle=k%2?'rgba(255,210,160,.08)':'rgba(60,30,15,.12)';g.beginPath();g.moveTo(0,yy);for(let x=0;x<=WW;x+=40)g.lineTo(x,yy+Math.sin(x*.02+k)*4);g.lineTo(WW,yy+(y1-y0)/7);g.lineTo(0,yy+(y1-y0)/7);g.closePath();g.fill();}
    g.strokeStyle='rgba(50,25,10,.35)';g.lineWidth=1.2;g.beginPath();for(let i=0;i<60;i++){const x=R()*WW,y=y0+R()*(y1-y0);g.moveTo(x,y);g.lineTo(x+(R()-.5)*14,y+8+R()*14);}g.stroke();
  };
  cliff(0,132,true);cliff(452,WH,false);
  g.fillStyle='#b8925f';g.fillRect(860,452,80,WH-452);for(let y=458;y<WH;y+=12){g.fillStyle='#d6b98a';g.fillRect(864,y,72,5);g.fillStyle='rgba(60,35,15,.3)';g.fillRect(864,y+5,72,2);}g.fillStyle='rgba(60,35,15,.4)';g.fillRect(856,452,4,WH-452);g.fillRect(940,452,4,WH-452);
  g.fillStyle='rgba(60,30,15,.35)';g.fillRect(0,452,WW,6);
  const edge=g.createLinearGradient(0,132,0,180);edge.addColorStop(0,'rgba(60,30,15,.45)');edge.addColorStop(1,'rgba(60,30,15,0)');g.fillStyle=edge;g.fillRect(0,132,WW,48);
  // falaj channel along the north cliff
  g.fillStyle='#9a8d7a';g.fillRect(0,136,1150,26);g.fillStyle='#b8ab94';g.fillRect(0,136,1150,4);g.fillRect(0,158,1150,4);
  g.fillStyle='#6f6556';g.fillRect(0,142,1150,14);
  g.strokeStyle='rgba(60,50,40,.4)';g.lineWidth=.8;g.beginPath();for(let x=10;x<1150;x+=18){g.moveTo(x,136);g.lineTo(x,140);g.moveTo(x+9,158);g.lineTo(x+9,162);}g.stroke();
  // spring pool basin
  const s=WADI.spring;g.fillStyle='#8a7a66';ell(g,s.x,s.y+4,62,40);g.fill();g.fillStyle='#b8ab94';ell(g,s.x,s.y,58,36);g.fill();g.fillStyle='#4f4537';ell(g,s.x,s.y,48,28);g.fill();
  g.fillStyle='#9a8d7a';g.fillRect(1146,140,s.x-1146-30,20);g.fillStyle='#6f6556';g.fillRect(1146,144,s.x-1146-30,12);
  // west entrance path
  g.fillStyle='rgba(160,120,80,.35)';ell(g,40,300,60,40);g.fill();
  WADI.rocks.forEach(r=>softShadow(g,r.x+4,r.y+1,r.r*1.6,r.r*.5,.35));
  WADI.trees.forEach(t=>softShadow(g,t.x+(t.kind==='palm'?16:8),t.y+2,t.kind==='palm'?26:30,10,.32));
  softShadow(g,WADI.sign.x+4,WADI.sign.y+1,22,7,.35);
  return cv;
}
function drawRock(g,r){
  const {x,y}=r,s=r.r/14;
  g.fillStyle='#8a6a4e';g.beginPath();g.moveTo(x-16*s,y);g.quadraticCurveTo(x-18*s,y-16*s,x-6*s,y-24*s);g.quadraticCurveTo(x+8*s,y-28*s,x+15*s,y-14*s);g.quadraticCurveTo(x+19*s,y-4*s,x+14*s,y);g.closePath();g.fill();
  g.fillStyle='#a98563';g.beginPath();g.moveTo(x-12*s,y-8*s);g.quadraticCurveTo(x-12*s,y-18*s,x-4*s,y-22*s);g.quadraticCurveTo(x+4*s,y-24*s,x+6*s,y-16*s);g.closePath();g.fill();
  g.fillStyle='rgba(50,25,10,.25)';g.beginPath();g.moveTo(x+4*s,y);g.quadraticCurveTo(x+14*s,y-8*s,x+15*s,y-14*s);g.quadraticCurveTo(x+19*s,y-4*s,x+14*s,y);g.closePath();g.fill();
}
function drawSign(g,x,y,t){
  g.fillStyle='#7d6a58';g.beginPath();g.moveTo(x-16,y);g.lineTo(x-14,y-30);g.quadraticCurveTo(x,y-40,x+14,y-30);g.lineTo(x+16,y);g.closePath();g.fill();
  g.fillStyle='#968270';g.fillRect(x-11,y-28,22,20);
  g.strokeStyle='#5a4a3a';g.lineWidth=1;g.beginPath();for(let k=0;k<4;k++){g.moveTo(x-8,y-24+k*4.5);g.lineTo(x+8-(k%2)*4,y-24+k*4.5);}g.stroke();
  if(!P.flags.gates){g.fillStyle=`rgba(255,226,150,${.3+.2*Math.sin(t*2)})`;circ(g,x,y-18,2);}
}
function drawGate(g,i,t){
  const x=WADI.gates[i].x,open=gateOpen(i),y=162;
  g.fillStyle='#8f8473';g.fillRect(x-20,y-34,8,34);g.fillRect(x+12,y-34,8,34);
  g.fillStyle='#b3a690';g.fillRect(x-22,y-38,12,6);g.fillRect(x+10,y-38,12,6);
  g.fillStyle='#5c3b22';g.fillRect(x-12,y-44,24,4);
  const by=open?y-40:y-22;
  g.fillStyle='#8a5a31';g.fillRect(x-12,by,24,20);g.fillStyle='#6b4528';g.fillRect(x-12,by+6,24,2);g.fillRect(x-12,by+13,24,2);
  g.strokeStyle='#3b342e';g.lineWidth=1.4;g.beginPath();g.moveTo(x,y-44);g.lineTo(x,by);g.stroke();
  g.fillStyle='#3b342e';circ(g,x,y-46,3);
  if(!P.flags.gates){const n=gateSeq.indexOf(i);if(n>=0){g.fillStyle='#ffd36b';g.font='800 10px system-ui';g.textAlign='center';g.fillText(AR(n+1),x,y-52);}}
}
function wadiStatics(){
  const L=[];
  L.push({y:470,x:900,b:[850,420,950,480],draw:g=>{if(P.flags.ch4)return;[[876,470,18],[904,474,22],[926,468,16],[892,456,14],[916,452,12]].forEach(([x,y,r])=>drawRock(g,{x,y,r}));}});
  WADI.rocks.forEach(r=>L.push({y:r.y,x:r.x,b:[r.x-30,r.y-40,r.x+30,r.y+4],draw:g=>drawRock(g,r)}));
  WADI.trees.forEach(tr=>L.push({y:tr.y,x:tr.x,b:[tr.x-56,tr.y-130,tr.x+56,tr.y+4],draw:(g,t)=>{
    if(tr.kind==='palm'){blit(g,SPR.palmTrunk,tr.x,tr.y);g.save();g.translate(tr.x+6.8,tr.y-78);g.rotate(Math.sin(t*1.1+tr.phase)*.035);blit(g,SPR.palmCrown,0,0);g.restore();}
    else{blit(g,SPR.oakTrunk,tr.x,tr.y);g.save();g.translate(tr.x,tr.y-26);g.rotate(Math.sin(t*1.2+tr.phase)*.02);blit(g,SPR.oak[1],0,0);g.restore();}}}));
  WADI.gates.forEach((gt,i)=>L.push({y:166,x:gt.x,b:[gt.x-30,100,gt.x+30,170],draw:(g,t)=>drawGate(g,i,t)}));
  const s=WADI.sign;L.push({y:s.y,x:s.x,b:[s.x-24,s.y-50,s.x+24,s.y+4],draw:(g,t)=>drawSign(g,s.x,s.y,t)});
  return L;
}
function drawWadiWater(g,t){
  const flow=!!P.flags.gates,s=WADI.spring;
  g.fillStyle=flow?'#3d84a0':'#4f4537';ell(g,s.x,s.y,46,26);g.fill();
  if(flow){
    g.fillStyle='#4f9fb8';ell(g,s.x,s.y-2,40,21);g.fill();
    for(let i=0;i<3;i++){const k=(t*.4+i/3)%1;g.strokeStyle=`rgba(225,246,255,${.5*(1-k)})`;g.lineWidth=1.2;ell(g,s.x,s.y,8+k*36,(8+k*36)*.55);g.stroke();}
    g.fillStyle='#3d84a0';g.fillRect(0,144,s.x-30,12);
    g.fillStyle='rgba(225,246,255,.6)';for(let i=0;i<40;i++){const xx=s.x-40-((t*60+i*31)%(s.x-40));g.fillRect(xx,146+(i%3)*3,4,1);}
  }else{
    g.fillStyle='rgba(60,90,100,.6)';ell(g,s.x+6,s.y+4,14,7);g.fill();
  }
}
SCENES.wadi={id:'wadi',W:WW,H:WH,bg:'#3a2618',wadi:true,name:'وادي الفلج',colliders:WADI.colliders,buildGround:S=>buildWadiGround(S),statics:null};
const SIGN={id:'sign',name:'نقش قديم',noMeet:true,portrait:'rock',x:WADI.sign.x,y:WADI.sign.y,talked:0};
const SPRING={id:'spring',name:'عين الفلج',noMeet:true,portrait:'pool',x:WADI.spring.x,y:WADI.spring.y,talked:0};
const SIGN_LINES=['على الصخرة نقش قديم بخط باهت:','«افتح أقرب البوابات إلى العين أولًا، ثم أبعدها عنها، ثم التي بينهما… يعدِ الماء إلى مجراه».'];
const SALEM_CH3=['منذ أن أخذتما الشظية من الحجر، توقف ماء الفلج! النافورة تكاد تجف.','يقول الأجداد إن الفلج ينبع من عين في وادٍ شرق القرية.','اذهبا إلى هناك. لعل للشظية علاقة بما حدث. فتحت لكما الطريق شرق الساحة.'];
function openGate(i){
  if(P.flags.gates||gateSeq.includes(i))return;
  const want=SOLUTION[gateSeq.length];
  SFX.play('doorOpen');gateSeq.push(i);
  if(i!==want){
    setTimeout(()=>{SFX.play('blocked');gateSeq=[];notify('صرير… ثم انسدّ الماء<small>عادت البوابات مغلقة. اقرأ النقش عند مدخل الوادي</small>',3.2);},500);return;
  }
  if(gateSeq.length===SOLUTION.length){
    P.flags.gates=1;gateSeq=[];
    setTimeout(()=>{shake(6,.8);buzz([40,40,60]);SFX.play('water');SFX.play('bossRoar');notify('اندفع الماء في الفلج!<small>لكن شيئًا ضخمًا يتحرك في عين الفلج…</small>',3.6);saveGame();},500);
  }else notify(`فتحت البوابة (${AR(gateSeq.length)} من ٣)`,1.6);
}
function enterWadi(){P.flags.wadi=1;}

/* ---- enemy art for the wadi ---- */
function drawScorpion(g,t){
  const b=Math.sin(t*3)*1,tl=Math.sin(t*2.2)*3;
  g.strokeStyle='#5a3d22';g.lineWidth=2;g.lineCap='round';
  for(let k=0;k<4;k++){const x=-10+k*6;g.beginPath();g.moveTo(x,-6);g.lineTo(x-4,0);g.moveTo(x,-6);g.lineTo(x+3,0);g.stroke();}
  g.fillStyle='#7a4f2a';ell(g,0,-9+b,18,8);g.fill();g.fillStyle='#9a6a3a';ell(g,2,-11+b,13,4);g.fill();
  g.strokeStyle='#7a4f2a';g.lineWidth=5;g.beginPath();g.moveTo(-14,-10+b);g.quadraticCurveTo(-30,-18,-26,-36+tl);g.quadraticCurveTo(-22,-48+tl,-10,-44+tl);g.stroke();
  g.fillStyle='#c0392b';poly(g,[-10,-47+tl,-4,-42+tl,-10,-40+tl]);
  g.strokeStyle='#7a4f2a';g.lineWidth=3;g.beginPath();g.moveTo(14,-12+b);g.lineTo(26,-18+b);g.moveTo(14,-8+b);g.lineTo(26,-4+b);g.stroke();
  g.fillStyle='#8a5a30';ell(g,30,-20+b,6,4);g.fill();ell(g,30,-2+b,6,4);g.fill();
  g.fillStyle='#1c120a';circ(g,16,-13+b,1.4);circ(g,16,-9+b,1.4);
}
function drawViper(g,t){
  const w=Math.sin(t*3);
  g.strokeStyle='#b8925a';g.lineWidth=9;g.lineCap='round';g.beginPath();g.moveTo(-28,-4);
  for(let k=0;k<=4;k++)g.lineTo(-28+k*10,-4+Math.sin(t*3+k)*4);g.quadraticCurveTo(18,-8,20,-26+w*2);g.stroke();
  g.strokeStyle='#8a6a3a';g.lineWidth=2;g.setLineDash([3,5]);g.beginPath();g.moveTo(-26,-4);for(let k=0;k<=4;k++)g.lineTo(-26+k*10,-4+Math.sin(t*3+k)*4);g.stroke();g.setLineDash([]);
  g.fillStyle='#c9a46a';ell(g,24,-30+w*2,9,6);g.fill();poly(g,[18,-34+w*2,22,-38+w*2,24,-34+w*2]);poly(g,[26,-34+w*2,28,-38+w*2,31,-33+w*2]);
  g.fillStyle='#1c120a';circ(g,27,-31+w*2,1.4);
  if(Math.sin(t*1.7)>.6){g.strokeStyle='#c0392b';g.lineWidth=1.2;g.beginPath();g.moveTo(32,-28+w*2);g.lineTo(38,-27+w*2);g.lineTo(40,-25+w*2);g.moveTo(38,-27+w*2);g.lineTo(40,-29+w*2);g.stroke();}
}
function drawSerpent(g,t,e){
  const hot=e.enraged,sw=Math.sin(t*1.6);
  const body=hot?'#2f7a6d':'#2f6f86',belly=hot?'#9fd8b8':'#a8d8e0';
  g.strokeStyle=body;g.lineCap='round';
  g.lineWidth=26;g.beginPath();g.moveTo(-70,-6);g.quadraticCurveTo(-40,10,-6,-4);g.quadraticCurveTo(30,-18,22,-50);g.quadraticCurveTo(12,-80,28,-104+sw*4);g.stroke();
  g.strokeStyle=belly;g.lineWidth=8;g.beginPath();g.moveTo(-60,-2);g.quadraticCurveTo(-36,10,-8,0);g.quadraticCurveTo(24,-14,16,-48);g.stroke();
  g.fillStyle='rgba(255,255,255,.18)';for(let k=0;k<10;k++){circ(g,-60+k*9,-10+Math.sin(k)*3,3);}
  g.fillStyle=body;ell(g,34,-112+sw*4,24,17);g.fill();
  g.fillStyle=hot?'#3f9a85':'#3f8aa6';poly(g,[18,-124+sw*4,10,-140+sw*4,26,-128+sw*4]);poly(g,[40,-126+sw*4,44,-144+sw*4,50,-124+sw*4]);
  g.fillStyle=hot?'#ff6a2a':'#ffd36b';ell(g,30,-116+sw*4,4.6,3.6);g.fill();ell(g,46,-114+sw*4,4.6,3.6);g.fill();
  g.fillStyle='#10202a';g.fillRect(29,-119+sw*4,1.6,6);g.fillRect(45,-117+sw*4,1.6,6);
  g.fillStyle='#fff';poly(g,[48,-104+sw*4,51,-104+sw*4,49.5,-97+sw*4]);poly(g,[40,-103+sw*4,43,-103+sw*4,41.5,-96+sw*4]);
  for(let i=0;i<5;i++){const k=(t*.6+i/5)%1;g.fillStyle=`rgba(200,240,255,${.7*(1-k)})`;circ(g,-60+i*30+Math.sin(t+i)*6,4-k*30,1.6);}
}

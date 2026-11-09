// الحصن القديم والنهاية (الفصل الرابع)
'use strict';

/* =========================================================
   THE OLD FORT (chapter four) and the ending
   ========================================================= */
Object.assign(ENEMIES,{
  soldier:{name:'جندي الرمل',hp:64,atk:17,def:14,agi:9,xp:46,gold:36,weak:'fire',resist:'sand',drop:['halwa',.15],move:['طعنة الرمح',.3,1.35]},
  spider:{name:'عنكبوت الحصن',hp:52,atk:15,def:10,agi:15,xp:42,gold:32,weak:'sand',drop:['honey',.2],move:['عضّة سامة',.4,1.1],status:'poison'},
  golem:{name:'عملاق الحصن',hp:470,atk:18,mag:15,def:12,agi:6,xp:620,gold:600,weak:'sand',resist:'phys',boss:true,move:['',0,1]},
});
BEAST_ORDER.push('soldier','spider','golem');
ABILITIES.push(
  {id:'flurry',type:'skill',name:'ضربات الخنجر',mp:7,lv:8,target:'one',icon:'sword',desc:'ثلاث ضربات خاطفة متتالية على عدو واحد.'},
  {id:'meteor',type:'magic',name:'شهاب الوادي',mp:14,lv:9,target:'all',icon:'flame',desc:'شهاب من نار يسقط على كل الأعداء.'},
);
Object.assign(ITEMS,{
  saif:{name:'سيف عماني',slot:'weapon',icon:'sword',col:'#9aa6ae',stats:{atk:10,agi:1},price:900,desc:'سيف مستقيم بمقبض فضي، صنعة نزوى.'},
  turs:{name:'ترس جلدي',slot:'acc',icon:'shield',col:'#8a5a31',stats:{def:5,hp:20},price:600,desc:'ترس مستدير من جلد الجمل، يصدّ أقوى الضربات.'},
  fortkey:{name:'مفتاح الحصن',key:true,icon:'key',col:'#b07a2a',desc:'مفتاح حديدي كبير، يفتح البوابة الداخلية للحصن.'},
  shard3:{name:'شظية النجمة الثالثة',key:true,icon:'gem',col:'#e0a83e',desc:'وجدتها في قلعة الحصن القديم. تتوهج كالذهب.'},
  crown:{name:'تاج الحصن',slot:'head',icon:'cap',col:'#d99a2b',stats:{def:4,wis:4,luk:2},desc:'تاج نحاسي قديم تركه عملاق الحصن.'},
});
SHOP.saeed.stock.push('turs','saif');
const eDef=e=>e.d.def+(e.defBonus||0);
const F2W=960,F2H=880,GATE0=440,GATE1=520;
const FORT=(()=>{
  const walls=[
    {y:860,x0:40,x1:GATE0},{y:860,x0:GATE1,x1:920},
    {y:560,x0:40,x1:GATE0,inner:1},{y:560,x0:GATE1,x1:920,inner:1},
    {y:300,x0:40,x1:GATE0,keep:1},{y:300,x0:GATE1,x1:920,keep:1},
  ];
  const towers=[[70,850],[890,850],[70,560],[890,560]].map(([x,y])=>({x,y}));
  const pots=[[120,640],[130,790],[330,820],[640,820],[840,790],[850,640]].map(([x,y],i)=>({i,x,y}));
  const POT_LOOT=[{money:60},{item:'honey'},{battle:['soldier','soldier']},{key:1},{item:'halwa'},{battle:['spider','soldier']}];
  const braziers=[{x:300,y:430},{x:660,y:430}];
  const columns=[{x:300,y:190},{x:660,y:190},{x:300,y:110},{x:660,y:110}];
  const altar={x:480,y:150};
  const well={x:480,y:440};
  const palms=[{x:150,y:400,kind:'palm',phase:1},{x:810,y:400,kind:'palm',phase:2.4},{x:200,y:700,kind:'palm',phase:3.1},{x:760,y:700,kind:'palm',phase:.6}];
  const colliders=[];
  const rectC=(x,y,w,h,tag)=>colliders.push({t:'r',x,y,w,h,tag});const circC=(x,y,r,tag)=>colliders.push({t:'c',x,y,r,tag});
  rectC(0,0,40,F2H,'wall');rectC(920,0,40,F2H,'wall');rectC(0,0,F2W,72,'wall');
  walls.forEach(w=>rectC(w.x0,w.y-36,w.x1-w.x0,36,'wall'));
  rectC(GATE0,524,GATE1-GATE0,36,'innergate');
  towers.forEach(t=>circC(t.x,t.y-20,46,'tower'));
  pots.forEach(p=>circC(p.x,p.y-4,11,'pot'));
  braziers.forEach(b=>circC(b.x,b.y-4,12,'brazier'));
  columns.forEach(c=>circC(c.x,c.y-4,13,'column'));
  palms.forEach(p=>circC(p.x,p.y-3,8,'tree'));
  colliders.push({t:'e',x:well.x,y:well.y,rx:34,ry:22,tag:'well'});
  rectC(altar.x-34,altar.y-30,68,30,'altar');
  return {walls,towers,pots,POT_LOOT,braziers,columns,altar,well,palms,colliders};
})();
function buildFortGround(S){
  const cv=document.createElement('canvas');cv.width=Math.ceil(F2W*S);cv.height=Math.ceil(F2H*S);
  const g=cv.getContext('2d');g.scale(S,S);const R=mulberry(4545);
  g.fillStyle='#c9a876';g.fillRect(0,0,F2W,F2H);
  for(let y=70;y<F2H;y+=24)for(let x=40+(((y-70)/24)&1)*18;x<920;x+=36){g.fillStyle=['#cfae7c','#c4a16e','#d6b888','#bf9c6a'][(R()*4)|0];rr(g,x+1,y+1,34,22,3);g.fill();}
  g.strokeStyle='rgba(110,80,45,.25)';g.lineWidth=1;g.beginPath();for(let y=70;y<F2H;y+=24){g.moveTo(40,y);g.lineTo(920,y);}g.stroke();
  for(let i=0;i<400;i++){g.fillStyle=R()<.5?'rgba(120,90,55,.25)':'rgba(240,220,180,.25)';circ(g,40+R()*880,70+R()*800,.6+R()*1.4);}
  // keep floor: darker stone with a woven runner
  g.fillStyle='rgba(90,60,35,.25)';g.fillRect(40,72,880,228);
  g.fillStyle='#7d2a3a';g.fillRect(452,180,56,120);g.fillStyle='#221b1a';g.fillRect(452,180,6,120);g.fillRect(502,180,6,120);
  g.fillStyle='#e6b84a';for(let y=190;y<296;y+=14)poly(g,[480,y,488,y+7,480,y+14,472,y+7]);
  // side walls (top view bands)
  const band=(x,w)=>{g.fillStyle='#b8925f';g.fillRect(x,0,w,F2H);g.fillStyle='#d6b98a';g.fillRect(x+(x?0:w-6),0,6,F2H);g.strokeStyle='rgba(90,60,30,.25)';g.beginPath();for(let y=10;y<F2H;y+=16){g.moveTo(x,y);g.lineTo(x+w,y);}g.stroke();};
  band(0,40);band(920,40);
  g.fillStyle='#a8834f';g.fillRect(0,0,F2W,40);g.fillStyle='#d9b98a';g.fillRect(0,40,F2W,32);
  g.fillStyle='#c4a06c';for(let x=0;x<F2W;x+=20)g.fillRect(x+2,30,12,10);
  g.fillStyle='rgba(60,35,15,.3)';g.fillRect(0,68,F2W,6);
  // entrance path outside the south gate
  g.fillStyle='#b48e5e';g.fillRect(GATE0,860,GATE1-GATE0,20);
  FORT.pots.forEach(p=>softShadow(g,p.x+3,p.y+1,14,5,.35));
  FORT.towers.forEach(t=>softShadow(g,t.x+10,t.y+4,60,16,.35));
  FORT.columns.forEach(c=>softShadow(g,c.x+4,c.y+2,18,6,.35));
  FORT.palms.forEach(p=>softShadow(g,p.x+16,p.y+2,26,9,.3));
  FORT.walls.forEach(w=>{const sg=g.createLinearGradient(0,w.y,0,w.y+18);sg.addColorStop(0,'rgba(50,30,10,.35)');sg.addColorStop(1,'rgba(50,30,10,0)');g.fillStyle=sg;g.fillRect(w.x0,w.y,w.x1-w.x0,18);});
  softShadow(g,FORT.well.x+4,FORT.well.y+8,40,16,.3);
  return cv;
}
function drawFortWall(g,w){
  const h=w.keep?78:64,x0=w.x0,x1=w.x1,top=w.y-h;
  const fg=g.createLinearGradient(0,top,0,w.y);fg.addColorStop(0,'#e3c596');fg.addColorStop(1,'#c9a26a');
  g.fillStyle=fg;g.fillRect(x0,top,x1-x0,h);
  g.strokeStyle='rgba(120,85,45,.35)';g.lineWidth=1;g.beginPath();
  for(let y=top+10,row=0;y<w.y;y+=11,row++){g.moveTo(x0,y);g.lineTo(x1,y);for(let x=x0+(row&1)*12;x<x1;x+=24){g.moveTo(x,y-11);g.lineTo(x,y);}}g.stroke();
  g.fillStyle='#ecd3a6';g.fillRect(x0,top-8,x1-x0,10);
  g.fillStyle='#e3c596';for(let x=x0+4;x<x1-10;x+=22){g.beginPath();g.moveTo(x,top-8);g.lineTo(x,top-18);g.lineTo(x+6,top-24);g.lineTo(x+12,top-18);g.lineTo(x+12,top-8);g.closePath();g.fill();}
  g.fillStyle='rgba(80,50,20,.35)';for(let x=x0+30;x<x1-20;x+=70){rr(g,x,top+h*.3,6,h*.3,3);g.fill();}
  if(w.keep){
    g.fillStyle='#5c3b22';for(let x=x0+60;x<x1-40;x+=120){g.fillRect(x,top+20,22,26);g.fillStyle='#d9b27a';g.fillRect(x+2,top+22,18,22);g.fillStyle='#5c3b22';g.fillRect(x+10,top+20,2,26);g.fillRect(x,top+31,22,2);}
  }
  g.fillStyle='rgba(0,0,0,.08)';g.fillRect(x0,w.y-6,x1-x0,6);
}
function drawGateArch(g,y,h,closed){
  g.fillStyle='#d9b98a';g.fillRect(GATE0-8,y-h-14,GATE1-GATE0+16,14);
  g.fillStyle='#c9a26a';g.fillRect(GATE0-8,y-h,10,h);g.fillRect(GATE1-2,y-h,10,h);
  g.strokeStyle='#8a6a3e';g.lineWidth=2;g.beginPath();g.arc((GATE0+GATE1)/2,y-h+20,(GATE1-GATE0)/2-2,Math.PI,0);g.stroke();
  if(closed){
    g.fillStyle='#6e4527';g.fillRect(GATE0+2,y-h+6,GATE1-GATE0-4,h-6);
    g.fillStyle='#4a2f1b';for(let x=GATE0+8;x<GATE1-4;x+=12)g.fillRect(x,y-h+6,2,h-6);
    g.fillStyle='#2f2924';for(let k=0;k<3;k++)for(let x=GATE0+10;x<GATE1-6;x+=14)circ(g,x,y-h+20+k*16,1.8);
    g.fillStyle='#b07a2a';g.fillRect((GATE0+GATE1)/2-6,y-30,12,10);g.fillStyle='#2f2924';circ(g,(GATE0+GATE1)/2,y-26,2);
  }
}
function drawTower(g,t){
  const r=48,h=110,top=t.y-h;
  const fg=g.createLinearGradient(t.x-r,0,t.x+r,0);fg.addColorStop(0,'#e8cc9c');fg.addColorStop(.6,'#d2ae78');fg.addColorStop(1,'#b48e5e');
  g.fillStyle=fg;g.fillRect(t.x-r,top,r*2,h);ell(g,t.x,t.y,r,14);g.fill();
  g.strokeStyle='rgba(120,85,45,.3)';g.lineWidth=1;g.beginPath();for(let y=top+12;y<t.y;y+=12){g.moveTo(t.x-r,y);g.lineTo(t.x+r,y);}g.stroke();
  g.fillStyle='#ecd3a6';ell(g,t.x,top,r+4,14);g.fill();
  g.fillStyle='#e3c596';for(let a=0;a<12;a++){const ang=a/12*TAU;if(Math.sin(ang)<-.2)continue;const x=t.x+Math.cos(ang)*(r+2),y=top+Math.sin(ang)*13;g.fillRect(x-4,y-12,8,12);}
  g.fillStyle='#5c3b22';rr(g,t.x-5,top+30,10,22,5);g.fill();
}
function drawPot(g,p,t){
  if(P.flags['pot_'+p.i]){g.fillStyle='#a8713e';[[-6,-2],[4,-1],[0,-4],[7,-3]].forEach(([dx,dy])=>{poly(g,[p.x+dx-3,p.y+dy,p.x+dx+3,p.y+dy-1,p.x+dx+2,p.y+dy+2]);});return;}
  g.save();g.translate(p.x,p.y);g.scale(.9,.9);drawJar(g);g.restore();
  g.fillStyle=`rgba(255,240,180,${.25+.2*Math.sin(t*3+p.i)})`;circ(g,p.x+4,p.y-18,1.4);
}
function drawBrazier(g,b,t){
  g.fillStyle='#4a3b30';g.fillRect(b.x-2,b.y-22,4,22);g.fillRect(b.x-8,b.y-2,16,3);
  g.fillStyle='#2f2924';g.beginPath();g.moveTo(b.x-12,b.y-28);g.lineTo(b.x+12,b.y-28);g.lineTo(b.x+7,b.y-20);g.lineTo(b.x-7,b.y-20);g.closePath();g.fill();
  for(let i=0;i<3;i++){const fl=Math.sin(t*11+i*2)*1.6,h=10+Math.sin(t*8+i)*3;g.fillStyle=i===1?'#ffd36b':'#f07a2e';g.beginPath();g.moveTo(b.x-8+i*6,b.y-28);g.quadraticCurveTo(b.x-6+i*6+fl,b.y-28-h*1.4,b.x-4+i*6,b.y-28);g.closePath();g.fill();}
  const gr=g.createRadialGradient(b.x,b.y-34,0,b.x,b.y-34,36);gr.addColorStop(0,'rgba(255,170,80,.3)');gr.addColorStop(1,'rgba(255,170,80,0)');g.fillStyle=gr;g.fillRect(b.x-36,b.y-70,72,72);
}
function drawColumn(g,c){
  g.fillStyle='#b48e5e';ell(g,c.x,c.y,15,6);g.fill();
  const fg=g.createLinearGradient(c.x-11,0,c.x+11,0);fg.addColorStop(0,'#ecd3a6');fg.addColorStop(1,'#bf9a66');g.fillStyle=fg;g.fillRect(c.x-11,c.y-74,22,74);
  g.fillStyle='#ecd3a6';g.fillRect(c.x-15,c.y-80,30,8);g.fillStyle='#d6b98a';g.fillRect(c.x-15,c.y-6,30,6);
}
function drawWell(g,w,t){
  g.fillStyle='#a8834f';ell(g,w.x,w.y+6,36,22);g.fill();g.fillStyle='#d6b98a';ell(g,w.x,w.y,36,22);g.fill();g.fillStyle='#2f4a52';ell(g,w.x,w.y,26,15);g.fill();
  g.fillStyle='#5c3b22';g.fillRect(w.x-30,w.y-44,4,44);g.fillRect(w.x+26,w.y-44,4,44);g.fillRect(w.x-32,w.y-46,64,5);
  g.strokeStyle='#8a6a3e';g.lineWidth=1.2;g.beginPath();g.moveTo(w.x,w.y-42);g.lineTo(w.x,w.y-12);g.stroke();g.fillStyle='#8a5a31';rr(g,w.x-5,w.y-14,10,9,2);g.fill();
}
function drawAltar(g,a,t){
  g.fillStyle='#8f7a5e';g.fillRect(a.x-34,a.y-26,68,26);g.fillStyle='#b8a07a';g.fillRect(a.x-38,a.y-32,76,8);
  g.fillStyle='#6e5a42';for(let x=a.x-28;x<a.x+30;x+=14)g.fillRect(x,a.y-20,6,14);
  if(!P.flags.boss3){const p=.6+.4*Math.sin(t*2.4);const gr=g.createRadialGradient(a.x,a.y-48,0,a.x,a.y-48,40);gr.addColorStop(0,`rgba(255,220,120,${.55*p})`);gr.addColorStop(1,'rgba(255,220,120,0)');g.fillStyle=gr;g.fillRect(a.x-40,a.y-88,80,80);
    g.fillStyle='#ffe58a';poly(g,[a.x,a.y-60+Math.sin(t*2)*2,a.x+6,a.y-48,a.x,a.y-38,a.x-6,a.y-48]);}
}
function fortStatics(){
  const L=[];
  FORT.walls.forEach(w=>L.push({y:w.y,x:w.x0,b:[w.x0,w.y-130,w.x1,w.y+4],draw:g=>drawFortWall(g,w)}));
  L.push({y:860.5,x:GATE0,b:[GATE0-10,740,GATE1+10,864],draw:g=>drawGateArch(g,860,64,false)});
  L.push({y:560.5,x:GATE0,b:[GATE0-10,440,GATE1+10,564],draw:g=>drawGateArch(g,560,64,!P.flags.gateopen)});
  L.push({y:300.5,x:GATE0,b:[GATE0-10,190,GATE1+10,304],draw:g=>drawGateArch(g,300,78,false)});
  FORT.towers.forEach(t=>L.push({y:t.y,x:t.x,b:[t.x-60,t.y-150,t.x+60,t.y+16],draw:g=>drawTower(g,t)}));
  FORT.pots.forEach(p=>L.push({y:p.y,x:p.x,b:[p.x-16,p.y-32,p.x+16,p.y+4],draw:(g,t)=>drawPot(g,p,t)}));
  FORT.braziers.forEach(b=>L.push({y:b.y,x:b.x,b:[b.x-40,b.y-80,b.x+40,b.y+4],draw:(g,t)=>drawBrazier(g,b,t)}));
  FORT.columns.forEach(c=>L.push({y:c.y,x:c.x,b:[c.x-18,c.y-84,c.x+18,c.y+6],draw:g=>drawColumn(g,c)}));
  FORT.palms.forEach(tr=>L.push({y:tr.y,x:tr.x,b:[tr.x-56,tr.y-130,tr.x+56,tr.y+4],draw:(g,t)=>{blit(g,SPR.palmTrunk,tr.x,tr.y);g.save();g.translate(tr.x+6.8,tr.y-78);g.rotate(Math.sin(t*1.1+tr.phase)*.035);blit(g,SPR.palmCrown,0,0);g.restore();}}));
  L.push({y:FORT.well.y+20,x:FORT.well.x,b:[FORT.well.x-40,FORT.well.y-50,FORT.well.x+40,FORT.well.y+30],draw:(g,t)=>drawWell(g,FORT.well,t)});
  L.push({y:FORT.altar.y,x:FORT.altar.x,b:[FORT.altar.x-44,FORT.altar.y-90,FORT.altar.x+44,FORT.altar.y+4],draw:(g,t)=>drawAltar(g,FORT.altar,t)});
  return L;
}
SCENES.fort={id:'fort',W:F2W,H:F2H,bg:'#2a1c10',fort:true,name:'الحصن القديم',colliders:FORT.colliders,buildGround:S=>buildFortGround(S),statics:null};
const ALTAR={id:'altar',name:'منصة الشظية',noMeet:true,portrait:'rock',x:FORT.altar.x,y:FORT.altar.y,talked:0};
const SALEM_CH4=['شظيتان من النجمة… والثالثة، كما تقول الجدة زوينة، في الحصن القديم خلف الوادي.','أزاح راشد وسعيد الصخور التي سدّت الدرج في جنوب الوادي.','الحصن مهجور منذ زمن بعيد، ويقال إن حارسه ما زال يحرسه. خذا حذركما.'];
const ENDING_LINES=['تقتربان من حجر النور، والشظايا الثلاث تتوهج في أيديكما.','تضعانها في النقش واحدة بعد الأخرى… فتكتمل النجمة!','يرتفع منها شعاع ذهبي إلى السماء، ويغمر الغابة نور دافئ.'];
function fortTarget(){
  if(Math.hypot(hero.x-ALTAR.x,hero.y-ALTAR.y)<58&&hero.y>ALTAR.y)return {kind:'npc',npc:ALTAR,x:ALTAR.x,y:ALTAR.y+10};
  for(const p of FORT.pots)if(!P.flags['pot_'+p.i]&&Math.hypot(hero.x-p.x,hero.y-p.y)<34)return {kind:'pot',p,x:p.x,y:p.y-4};
  if(!P.flags.gateopen&&Math.abs(hero.x-480)<44&&hero.y>560&&hero.y<606)return {kind:'innergate',x:480,y:520};
  if(Math.hypot(hero.x-FORT.well.x,(hero.y-FORT.well.y)*1.3)<56)return {kind:'spring',x:FORT.well.x,y:FORT.well.y-30};
  return null;
}
function smashPot(p){
  P.flags['pot_'+p.i]=1;SFX.play('poof');const L=FORT.POT_LOOT[p.i];
  if(L.money){P.money+=L.money;SFX.play('coin');notify(`وجدت في الجرة ${baisa(L.money)}`,2);}
  else if(L.item){P.inv[L.item]=(P.inv[L.item]||0)+1;SFX.play('itemGet');notify(`وجدت في الجرة: ${ITEMS[L.item].name}`,2);}
  else if(L.key){P.inv.fortkey=1;SFX.play('itemGet');notify('وجدت مفتاح الحصن!<small>افتح به البوابة الداخلية</small>',3);}
  else if(L.battle){notify('خرج من الجرة رمل يتحرك!',1.6);setTimeout(()=>startEncounter({types:L.battle}),500);}
  saveGame();
}
function tryInnerGate(){
  if(P.inv.fortkey){P.flags.gateopen=1;P.inv.fortkey=0;SFX.play('doorOpen');notify('فُتحت البوابة الداخلية',2.2);saveGame();}
  else{SFX.play('blocked');notify('البوابة مقفلة<small>ابحث عن مفتاحها في جرار الساحة الخارجية</small>',3);}
}
function drawSoldier(g,t){
  const b=Math.sin(t*2.4)*1;
  g.fillStyle='#b8925a';g.fillRect(-8,-18,6,18);g.fillRect(3,-18,6,18);
  g.fillStyle='#d6b17a';rr(g,-12,-48+b,24,32,8);g.fill();
  g.fillStyle='#a87a42';g.fillRect(-12,-30+b,24,4);
  g.fillStyle='#d6b17a';circ(g,0,-56+b,10);g.fillStyle='#8a6a3e';g.beginPath();g.arc(0,-58+b,11,Math.PI,0);g.fill();
  g.fillStyle='#ff9a45';circ(g,3,-56+b,1.8);circ(g,-3,-56+b,1.8);
  g.strokeStyle='#6e4a2b';g.lineWidth=2.4;g.beginPath();g.moveTo(14,-8+b);g.lineTo(30,-70+b);g.stroke();g.fillStyle='#c9ced4';poly(g,[30,-70+b,26,-78+b,33,-82+b,34,-72+b]);
  g.fillStyle='#8a5a31';ell(g,-14,-38+b,10,13);g.fill();g.strokeStyle='#d9ae4f';g.lineWidth=1.6;ell(g,-14,-38+b,10,13);g.stroke();g.fillStyle='#d9ae4f';circ(g,-14,-38+b,2.4);
  for(let i=0;i<4;i++){const k=(t*.5+i/4)%1;g.fillStyle=`rgba(220,190,130,${.6*(1-k)})`;circ(g,-6+i*4,-k*14,1.4);}
}
function drawSpider(g,t){
  const b=Math.sin(t*5)*1;
  g.strokeStyle='#2f2424';g.lineWidth=2.2;g.lineCap='round';
  for(let k=0;k<4;k++){const a=Math.sin(t*6+k)*2;[-1,1].forEach(s=>{g.beginPath();g.moveTo(s*6,-12+b);g.quadraticCurveTo(s*(18+k*3),-26+k*4+a,s*(26+k*2),-2+a*.5);g.stroke();});}
  g.fillStyle='#3b2e2e';ell(g,-6,-14+b,13,10);g.fill();g.fillStyle='#5a4545';ell(g,-8,-17+b,6,4);g.fill();
  g.fillStyle='#c0392b';poly(g,[-10,-16+b,-6,-20+b,-2,-16+b,-6,-12+b]);
  g.fillStyle='#2f2424';ell(g,10,-14+b,8,7);g.fill();
  g.fillStyle='#ff4a3a';[[12,-17],[15,-16],[12,-13],[15,-12]].forEach(([x,y])=>circ(g,x,y+b,1.2));
}
function drawGolem(g,t,e){
  const b=Math.sin(t*1.4)*2,hard=e.defBonus>0;
  g.fillStyle='rgba(0,0,0,.25)';ell(g,0,0,58,10);g.fill();
  const brick=(x,y,w,h,c)=>{g.fillStyle=c;rr(g,x,y,w,h,4);g.fill();g.strokeStyle='rgba(90,60,30,.4)';g.lineWidth=1.2;g.beginPath();for(let yy=y+9;yy<y+h;yy+=9){g.moveTo(x+2,yy);g.lineTo(x+w-2,yy);}g.stroke();};
  brick(-36,-46,24,46,'#b48e5e');brick(12,-46,24,46,'#b48e5e');
  brick(-48,-128+b,96,86,hard?'#a8834f':'#d2ae78');
  brick(-74,-122+b,26,62,'#c9a26a');brick(48,-122+b,26,62,'#c9a26a');
  g.fillStyle='#b48e5e';rr(g,-80,-66+b,34,26,8);g.fill();rr(g,46,-66+b,34,26,8);g.fill();
  brick(-26,-170+b,52,44,'#d9b98a');
  g.fillStyle='#e3c596';for(let x=-26;x<26;x+=13)g.fillRect(x+1,-180+b,9,10);
  const eg=hard?'#ff6a2a':'#ffd36b';g.fillStyle=eg;rr(g,-16,-156+b,10,6,2);g.fill();rr(g,6,-156+b,10,6,2);g.fill();
  const gr=g.createRadialGradient(0,-96+b,0,0,-96+b,22);gr.addColorStop(0,hard?'rgba(255,120,60,.9)':'rgba(255,220,120,.9)');gr.addColorStop(1,'rgba(255,200,100,0)');g.fillStyle=gr;g.fillRect(-22,-118+b,44,44);
  g.fillStyle='#ffe58a';poly(g,[0,-108+b,6,-96+b,0,-84+b,-6,-96+b]);
  if(hard){g.strokeStyle=`rgba(255,190,120,${.4+.2*Math.sin(t*6)})`;g.lineWidth=2;rr(g,-54,-134+b,108,98,10);g.stroke();}
  for(let i=0;i<5;i++){const k=(t*.4+i/5)%1;g.fillStyle=`rgba(220,190,130,${.6*(1-k)})`;circ(g,-40+i*20,-20-k*30,1.6);}
}
async function golemAction(e){
  e.turn++;e.actT=time;
  if(!e.phase2&&e.hp<e.max*.5){e.phase2=true;e.defBonus=6;fx('flash',0,0);SFX.play('bossRoar');await say('يرمّم العملاق جسده بطوب الحصن، فتصلب قشرته!',1300);
    B.enemies=B.enemies.filter(x=>x.alive||x.d.boss);['soldier','soldier'].forEach((tp,i)=>B.enemies.push(makeEnemy(tp,'أب'[i])));layoutEnemies();B.enemies.filter(x=>!x.d.boss).forEach(x=>fx('summon',x.x,x.y-40));
    await say('ويستدعي جنديين من الرمل!',1000);return;}
  if(e.defBonus>0&&e.turn%4===0){e.defBonus=0;await say('تتشقق قشرة العملاق… هذه فرصتكم!',1100);return;}
  if(e.phase2&&e.defBonus===0&&e.turn%5===2){e.defBonus=6;SFX.play('shield');await say('يرمّم العملاق قشرته من جديد.',1000);return;}
  const ms=members().filter(alive);if(!ms.length)return;
  if(e.turn%4===0){
    SFX.play('special');fx('flash',0,0);shake(11,.8);buzz([50,30,90]);await wait(260);
    for(const id of ms){let dmg=rollDmg((e.d.atk*1.45-mDef(id))*(e.phase2?1.15:1));if(B.m[id].guard)dmg=Math.ceil(dmg/2);hurt(id,dmg);}
    await say('العملاق يضرب الأرض بقبضتيه، فيهتز الحصن كله!',1000);for(const id of ms)await fallenCheck(id);return;
  }
  if(Math.random()<.25){
    SFX.play('sand');fx('sand',0,0);await wait(300);
    for(const id of ms){let dmg=rollDmg(e.d.mag*1.05-mStat(id,'wis')*.4);if(B.m[id].guard)dmg=Math.ceil(dmg/2);hurt(id,dmg);}
    await say('عاصفة من غبار الطوب تملأ القلعة!',950);for(const id of ms)await fallenCheck(id);return;
  }
  const tgt=pickTarget(),tp=mPos(tgt);SFX.play('swing');await wait(260);SFX.play('hit');
  let dmg=rollDmg((e.d.atk*1.8-mDef(tgt))*1.3*(e.phase2?1.15:1));if(B.m[tgt].guard)dmg=Math.max(1,Math.ceil(dmg/2));
  hurt(tgt,dmg);fx('slash',tp.x,tp.y-30,{big:true});await say(`العملاق يهوي بقبضته على ${NAMES[tgt]} — ${AR(dmg)} ضررًا.`,900);await fallenCheck(tgt);
}
function openEnding(){
  chapterCard=4;const c=chapterEl;c.querySelector('.eyebrow').textContent='أسرار عين الوادي';c.querySelector('h2').textContent='النهاية';
  c.querySelector('.tag').innerHTML='اكتملت نجمة الوادي وعادت إلى السماء، وصار ناصر واحدًا من أهل عين الوادي.<br>شكرًا لأنك لعبت. تستطيع متابعة التجوّل وإكمال ما بقي من مهام.';
  SFX.play('fanfare');setTimeout(()=>SFX.play('victory'),1600);state='chapter';resetInput();c.hidden=false;c.classList.remove('leaving');gameEl.classList.add('talking');
}

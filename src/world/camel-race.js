// سباق الهجن في وادي الفلج: اضغط مع إيقاع خطى الناقة، وغيّر المسار لتتفادى الصخور، وحافظ على نشاطها
'use strict';

/* =========================================================
   MUBARAK, HIS CAMEL, AND THE THREE RACES
   ========================================================= */
const MUBARAK_LOOK={g:'m',robe:'#efe7d6',robeSh:'#d4c8b0',tassel:'#8a6a3a',head:'massar',hw:['#a8322a','#efe2c4','#2f6b4f'],hair:'#3a2a1c',beard:'#3a2a1c',age:'mid',skin:'#b97d52'};
const MUBARAK={id:'mubarak',name:'مبارك',scene:'wadi',x:384,y:384,dir:'left',look:MUBARAK_LOOK,noMeet:true,shop:'race',talked:0,lines:null,
  repeat:['هلا والله! أنا مبارك، وهذي ناقتي «الريح»، أسرع ناقة بين صور وعبري.','نتسابق على طريق الوادي. تبي تجرّبها؟']};
MUBARAK.lines=MUBARAK.repeat;
Object.assign(MUBARAK,{phase:0,moving:false,lookAt:2,pause:1,target:null,stuck:0});
MUBARAK.home={x:MUBARAK.x,y:MUBARAK.y,dir:'left',scene:'wadi'};
NPCS.push(MUBARAK);
const RACES={
  easy:{name:'سباق المبتدئين',len:500,fee:20,prize:80,riv:[9.6,10.2],sprint:0,need:null},
  mid:{name:'سباق الوادي',len:650,fee:40,prize:180,riv:[11.2,11.7],sprint:.4,need:'easy'},
  hard:{name:'كأس عين الوادي',len:800,fee:80,prize:450,riv:[12.2,12.7],sprint:.8,need:'mid'},
};
ITEMS.racemedal={name:'وسام الهجن',slot:'acc',icon:'amulet',col:'#d9a23a',stats:{agi:3,luk:2},price:0,desc:'وسام ذهبي على شريط أحمر، لمن فاز بكأس عين الوادي.'};
SHOP.race={title:'سباق الهجن',sub:'مبارك وناقته «الريح»',tabs:[['race','السباقات']],stock:[]};
function raceBoard(){
  const R=P.race||{},rows=Object.entries(RACES).map(([id,r])=>{
    const rec=R[id]||{},locked=r.need&&!(R[r.need]&&R[r.need].won),ok=!locked&&P.money>=r.fee;
    const chips=`<span class="chip">${AR(r.len)} متر</span><span class="chip">الدخول ${baisa(r.fee)}</span><span class="chip up">الجائزة ${baisa(r.prize)}${id==='hard'?' ووسام الهجن':''}</span>${rec.best?`<span class="chip">أفضل وقت ${raceTime(rec.best)}</span>`:''}${rec.won?'<span class="chip up">فزت به</span>':''}`;
    return `<div class="row"><span class="grow"><span class="val">${r.name}</span><span class="lbl">${locked?`افز أولًا في «${RACES[r.need].name}».`:id==='easy'?'منافسان هادئان على مسار قصير.':id==='mid'?'منافسان أسرع، ويشدّون في آخر السباق.':'أسرع هجن الوادي. تحتاج إيقاعًا متقنًا ونشاطًا محفوظًا للنهاية.'}</span><span class="chips">${chips}</span></span>${locked?'<span class="chip">مقفل</span>':`<button type="button" class="btn" data-race="${id}"${ok?'':' disabled'}>تسابق</button>`}</div>`;}).join('');
  return `<p class="muted">اضغط «تفاعل» مع إيقاع خطى الناقة كلما لامست الدائرة الزر. حرّك العصا للأعلى والأسفل لتغيّر المسار وتتفادى الصخور. الضغط الكثير يُتعب الناقة.</p><div class="list">${rows}</div>`;
}
const raceTime=s=>{const m=Math.floor(s/60),x=s-m*60;return `${AR(m)}:${AR(x.toFixed(1).padStart(4,'0')).replace('.','٫')}`;};

/* =========================================================
   THE RACE
   ========================================================= */
let RACE=null;
const BEAT=60/110,LANES=3;
function startRace(id){
  const r=RACES[id];if(P.money<r.fee){SFX.play('error');return;}
  P.money-=r.fee;SFX.play('coin');
  shopEl.hidden=true;gameEl.classList.remove('talking');state='fade';fadeEl.classList.add('on');resetInput();
  setTimeout(()=>{
    const Rn=mulberry((Date.now()&0xffff)+7),obs=[];
    for(let d=70;d<r.len-40;d+=26+Rn()*30){obs.push({d,lane:(Rn()*3)|0,kind:Rn()<.6?'rock':'bush',hit:false});if(Rn()<.25)obs.push({d:d+2,lane:(obs[obs.length-1].lane+1+((Rn()*2)|0))%3,kind:'rock',hit:false});}
    RACE={id,r,t0:time,phase:'count',d:0,v:0,lane:1,laneT:1,stam:100,tired:0,stumble:-9,combo:0,fb:null,fbT:-9,lastTap:-9,whip:-9,
      riv:[{name:'البرق',d:0,v:0,lane:0,base:r.riv[0],col:'#8c6a44',rider:'#2f5b8f',ph:Math.random(),fin:null},{name:'الغزالة',d:0,v:0,lane:2,base:r.riv[1],col:'#d8b98a',rider:'#3f7a3a',ph:Math.random(),fin:null}],
      obs,fin:null,place:0,lastBeat:-1,dust:[],stickLatch:0};
    state='race';gameEl.classList.add('racing');actBtn.classList.add('ready');
    fadeEl.classList.remove('on');SFX.play('crowd');
  },450);
}
function racePress(){
  const R=RACE;if(!R)return;
  if(R.phase==='done'){endRace();return;}
  if(R.phase!=='run')return;
  const k=time-R.t0-3,ph=((k/BEAT)%1+1)%1,off=Math.min(ph,1-ph)*BEAT;R.lastTap=time;R.whip=time;
  let gain,cost,label;
  if(R.tired>0){gain=.1;cost=0;label='الناقة متعبة';R.combo=0;}
  else if(off<.075){R.combo=Math.min(5,R.combo+1);gain=1.6+.08*R.combo;cost=3;label=R.combo>=3?`ممتاز ×${AR(R.combo)}`:'ممتاز!';SFX.play('perfect');}
  else if(off<.15){R.combo=0;gain=.9;cost=5;label='جيد';SFX.play('swing');}
  else{R.combo=0;gain=.2;cost=8;label=ph<.5?'متأخر':'مبكر';}
  R.v=Math.min(17,R.v+gain);R.stam=Math.max(0,R.stam-cost);R.fb=label;R.fbT=time;
  if(R.stam<=0&&R.tired<=0){R.tired=2.6;R.fb='الناقة تعبت! دعها ترتاح';R.fbT=time;SFX.play('grunt',{vol:1});}
}
function raceTick(dt){
  const R=RACE;if(!R)return;
  const k=time-R.t0;
  if(R.phase==='count'){const n=3-Math.floor(k);if(n!==R.cd){R.cd=n;if(n>0)SFX.play('beep');}if(k>=3){R.phase='run';SFX.play('go');R.v=6;R.riv.forEach(o=>o.v=6);}return;}
  if(R.phase==='done')return;
  const rk=k-3;
  // lanes: stick or arrows, one lane per push
  const v=inputVector(),dy=v?v.y:0;
  if(Math.abs(dy)<.35)R.stickLatch=0;else if(!R.stickLatch){R.stickLatch=1;R.laneT=clamp(R.laneT+(dy>0?1:-1),0,LANES-1);SFX.play('tab');}
  R.lane+=(R.laneT-R.lane)*Math.min(1,dt*9);
  // beat: hooves on every step of the gait
  const b=Math.floor(rk/BEAT);if(b!==R.lastBeat){R.lastBeat=b;SFX.play('hoof',{vol:.9});}
  // player physics
  if(R.tired>0)R.tired-=dt;
  const stumbling=time-R.stumble<.6,vmax=R.tired>0?9:17;
  R.v-=(R.v-8)*.6*dt;if(stumbling)R.v=Math.min(R.v,5);R.v=Math.min(R.v,vmax);
  R.stam=Math.min(100,R.stam+(time-R.lastTap>.35?10:6)*dt);
  if(R.fin==null){R.d+=R.v*dt;
    const ln=Math.round(R.lane);
    if(Math.abs(R.lane-ln)<.3)for(const o of R.obs)if(!o.hit&&o.lane===ln&&Math.abs(o.d-(R.d+1.4))<1.3){o.hit=true;R.stumble=time;R.v*=.45;R.combo=0;R.fb=o.kind==='rock'?'تعثّرت بصخرة!':'علقت بشجيرة!';R.fbT=time;SFX.play('stumble');buzz(60);shake(5,.3);}
    if(R.d>=R.r.len){R.fin=rk;R.d=R.r.len;}
  }else R.d+=R.v*dt;
  // rivals: their own pace, a sprint near the end, and a little pull when far behind
  for(const o of R.riv){
    const prog=o.d/R.r.len,tgt=o.base+Math.sin(rk*.55+o.ph*6)*.9+(prog>.75?R.r.sprint:0)+(R.d-o.d>35?.7:0)-(o.d-R.d>45?.5:0);
    o.v+=(tgt-o.v)*.9*dt;o.d+=o.v*dt;o.phase=(o.phase||0)+dt*o.v*.11;
    if(o.fin==null&&o.d>=R.r.len)o.fin=rk;
  }
  R.gait=(R.gait||0)+dt*R.v*.11;
  if(fxOn()&&Math.random()<dt*R.v*.8)R.dust.push({d:R.d-1.5,lane:R.lane,t0:time,vx:-R.v*.2,s:Math.random()});
  R.dust=R.dust.filter(p=>time-p.t0<.8);
  if(R.fin!=null&&(R.riv.every(o=>o.fin!=null)||rk-R.fin>2.5))finishRace();
}
function finishRace(){
  const R=RACE;R.phase='done';R.doneT=time;
  const est=o=>o.fin!=null?o.fin:(R.fin+(R.r.len-o.d)/Math.max(6,o.v));
  R.place=1+R.riv.filter(o=>est(o)<R.fin).length;
  P.race=P.race||{};const rec=P.race[R.id]=P.race[R.id]||{best:0,won:false,wins:0};
  R.newBest=!rec.best||R.fin<rec.best;if(R.newBest)rec.best=R.fin;
  R.prize=0;R.medal=false;
  if(R.place===1){R.prize=R.r.prize;P.money+=R.prize;rec.wins=(rec.wins||0)+1;
    if(R.id==='hard'&&!rec.won){P.inv.racemedal=(P.inv.racemedal||0)+1;R.medal=true;}
    rec.won=true;achUnlock('race1');if(R.id==='hard')achUnlock('race3');
    SFX.play('fanfare');SFX.play('crowd');}
  else if(R.place===2){R.prize=Math.round(R.r.fee*1.5);P.money+=R.prize;SFX.play('quest');}
  else SFX.play('cancel');
  saveGame();
}
function endRace(){
  state='fade';fadeEl.classList.add('on');
  setTimeout(()=>{RACE=null;gameEl.classList.remove('racing');state='play';talkCooldown=.5;hero.x=MUBARAK.x-34;hero.y=MUBARAK.y+16;hero.dir='right';fadeEl.classList.remove('on');
    if(P.inv.racemedal&&!P.flags.medalNote){P.flags.medalNote=1;notify('حصلت على وسام الهجن<small>البسه من القائمة ← العتاد</small>',3.4);$('menuDot').hidden=false;}},450);
}

/* =========================================================
   DRAWING: a side view of the race course
   ========================================================= */
function drawRaceCamel(g,x,y,s,ph,col,rider,whip){
  const T=ph*TAU,bob=-Math.abs(Math.sin(T))*3;
  g.save();g.translate(x,y);g.scale(s,s);
  g.fillStyle='rgba(60,35,10,.25)';g.beginPath();g.ellipse(0,0,26,5,0,0,TAU);g.fill();
  g.translate(0,bob);
  const dark=shade(col,-.22),legs=[[-15,.0],[-9,.5],[11,.25],[17,.75]];
  g.lineCap='round';
  const leg=(lx,o,c)=>{const a=Math.sin(T+o*TAU)*.65,kx=lx+Math.sin(a)*12,ky=-24+Math.cos(a)*12,b2=a*.6-Math.max(0,Math.sin(T+o*TAU+1))*.9;
    g.strokeStyle=c;g.lineWidth=4.2;g.beginPath();g.moveTo(lx,-30);g.lineTo(kx,ky);g.stroke();g.lineWidth=3.2;g.beginPath();g.moveTo(kx,ky);g.lineTo(kx+Math.sin(b2)*13,ky+Math.cos(b2)*13);g.stroke();};
  leg(legs[0][0],legs[0][1],dark);leg(legs[2][0],legs[2][1],dark);
  g.fillStyle=col;g.beginPath();g.ellipse(0,-36,22,11,0,0,TAU);g.fill();
  g.beginPath();g.ellipse(-2,-46,12,9,0,0,TAU);g.fill();
  g.strokeStyle=col;g.lineWidth=7;g.beginPath();g.moveTo(16,-38);g.quadraticCurveTo(30,-40,32,-58);g.stroke();
  g.fillStyle=col;g.beginPath();g.ellipse(37,-60,8,4.6,-.15,0,TAU);g.fill();
  g.fillStyle=dark;g.beginPath();g.ellipse(32,-64,1.8,2.6,-.4,0,TAU);g.fill();g.fillStyle='#1d140c';g.beginPath();g.arc(38,-62,1,0,TAU);g.fill();
  g.strokeStyle=dark;g.lineWidth=2;g.beginPath();g.moveTo(-21,-38);g.quadraticCurveTo(-27,-32,-25,-24);g.stroke();
  leg(legs[1][0],legs[1][1],col);leg(legs[3][0],legs[3][1],col);
  // saddle cloth with tassels
  g.fillStyle=rider;g.beginPath();g.moveTo(-12,-50);g.lineTo(9,-50);g.lineTo(12,-36);g.lineTo(-14,-36);g.closePath();g.fill();
  g.fillStyle='#f3e3b5';for(let i=0;i<5;i++)g.fillRect(-12+i*5.6,-36,1.6,4);
  // rider
  g.fillStyle='#f4efe4';g.beginPath();g.moveTo(-6,-52);g.lineTo(4,-52);g.lineTo(3,-68);g.lineTo(-4,-68);g.closePath();g.fill();
  g.fillStyle='#c48a5e';g.beginPath();g.arc(0,-73,4.6,0,TAU);g.fill();
  g.fillStyle=rider;g.beginPath();g.ellipse(-.5,-76,5.4,3,0,0,TAU);g.fill();
  const wa=time-whip<.2?-1.2:-.3;g.strokeStyle='#f4efe4';g.lineWidth=2.4;g.beginPath();g.moveTo(1,-64);g.lineTo(8,-60);g.stroke();
  g.strokeStyle='#5a3a1c';g.lineWidth=1.3;g.beginPath();g.moveTo(8,-60);g.lineTo(8+Math.cos(wa)*14,-60+Math.sin(wa)*14);g.stroke();
  g.restore();
}
function shade(hex,k){const n=parseInt(hex.slice(1),16),f=c=>clamp(Math.round(c*(1+k)),0,255);return `rgb(${f(n>>16)},${f(n>>8&255)},${f(n&255)})`;}
function ridge(x,amp,seed){return Math.sin(x*.011+seed)*amp+Math.sin(x*.027+seed*2.3)*amp*.45+Math.sin(x*.063+seed*.7)*amp*.2;}
function renderRace(){
  const R=RACE,g=ctx,d=view.dpr,W=view.w,H=view.h,ppm=Math.max(9,Math.min(14,W/60)),k=time-R.t0;
  g.setTransform(d,0,0,d,0,0);
  const night=nightAmount(),hz=H*.42;
  // sky, sun, the Hajar mountains, dunes
  const sk=g.createLinearGradient(0,0,0,hz);sk.addColorStop(0,night>.5?'#1d2440':'#e9b77a');sk.addColorStop(1,night>.5?'#4b3d4f':'#fbe3b2');g.fillStyle=sk;g.fillRect(0,0,W,hz+2);
  if(night<.5){g.fillStyle='rgba(255,236,190,.9)';g.beginPath();g.arc(W*.78,hz*.38,22,0,TAU);g.fill();}
  else{g.fillStyle='#f4ecd8';g.beginPath();g.arc(W*.78,hz*.38,14,0,TAU);g.fill();}
  const cam=R.d*ppm,layer=(par,base,amp,seed,col)=>{g.fillStyle=col;g.beginPath();g.moveTo(0,H);for(let x=0;x<=W+8;x+=8){g.lineTo(x,base-Math.abs(ridge(x+cam*par,amp,seed)));}g.lineTo(W,H);g.closePath();g.fill();};
  layer(.06,hz+4,46,1.3,night>.5?'#3c3446':'#b98d6c');
  layer(.14,hz+10,26,4.1,night>.5?'#4a3d3e':'#cfa077');
  layer(.32,hz+26,16,7.7,night>.5?'#5a4a3a':'#e2b980');
  // course
  const top=H*.52,laneH=Math.min(46,(H*.9-top)/3.4),laneY=i=>top+laneH*(.6+i);
  const gr=g.createLinearGradient(0,top-14,0,H);gr.addColorStop(0,night>.5?'#6b5640':'#e3c08a');gr.addColorStop(1,night>.5?'#4d3d2c':'#c99a62');g.fillStyle=gr;g.fillRect(0,top-14,W,H-top+14);
  const px=W*.3,sx=dd=>px+(dd-R.d)*ppm;
  // fence & spectators along the back
  g.strokeStyle='#8a6440';g.lineWidth=2;g.beginPath();g.moveTo(0,top-8);g.lineTo(W,top-8);g.stroke();
  for(let m=Math.floor((R.d-px/ppm)/4)*4;m<R.d+(W-px)/ppm+4;m+=4){const x=sx(m);g.fillStyle='#7a5636';g.fillRect(x-1.2,top-16,2.4,12);}
  for(let m=-20;m<R.r.len+40;m+=2.2){
    if(!(m<30||m>R.r.len-50))continue;const x=sx(m);if(x<-10||x>W+10)continue;
    const R2=mulberry(Math.round(m*10)+3),cl=['#f4efe4','#f4efe4','#1d1a1c','#c0392b','#2f6b4f'][(R2()*5)|0],jump=Math.abs(Math.sin(time*6+m))*(R.phase==='done'||m<30?3:1);
    g.fillStyle=cl;g.fillRect(x-3,top-30-jump,6,13);g.fillStyle='#b97d52';g.beginPath();g.arc(x,top-33-jump,3,0,TAU);g.fill();
  }
  // lane lines, distance posts, finish arch
  g.strokeStyle='rgba(255,245,220,.45)';g.lineWidth=1.2;g.setLineDash([10,12]);g.lineDashOffset=cam%22;
  for(let i=0;i<4;i++){const y=top+laneH*(i+.1);g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke();}
  g.setLineDash([]);
  g.font='700 11px system-ui,-apple-system,"SF Arabic",sans-serif';g.textAlign='center';g.textBaseline='middle';
  for(let m=100;m<R.r.len;m+=100){const x=sx(m);if(x<-30||x>W+30)continue;g.fillStyle='#6b4a2b';g.fillRect(x-1.5,top-40,3,30);g.fillStyle='#fff6e2';rr(g,x-20,top-54,40,16,5);g.fill();g.fillStyle='#6b4a2b';g.fillText(`${AR(m)} م`,x,top-46);}
  {const x=sx(R.r.len);if(x>-60&&x<W+60){
    g.fillStyle='#fff';for(let i=0;i<12;i++){g.fillStyle=i%2?'#1d1a1c':'#fff';g.fillRect(x-3,top-12+i*(laneH*3.3/12),6,laneH*3.3/12);}
    g.fillStyle='#7a5636';g.fillRect(x-30,top-70,4,62);g.fillRect(x+26,top-70,4,62);
    g.fillStyle='#a8322a';g.fillRect(x-32,top-74,64,18);g.fillStyle='#fff6e2';g.fillText('خط النهاية',x,top-65);}}
  // obstacles
  for(const o of R.obs){const x=sx(o.d);if(x<-30||x>W+30)continue;const y=laneY(o.lane)+4;
    if(o.kind==='rock'){g.fillStyle='rgba(60,35,10,.25)';g.beginPath();g.ellipse(x,y+2,13,3.5,0,0,TAU);g.fill();g.fillStyle=o.hit?'#8a7a68':'#9a8a76';g.beginPath();g.ellipse(x,y-5,11,8,0,Math.PI,0);g.fill();g.fillStyle='rgba(255,255,255,.25)';g.beginPath();g.ellipse(x-3,y-9,4,2,0,0,TAU);g.fill();}
    else{g.fillStyle='#6f8a3c';for(let i=0;i<5;i++){g.beginPath();g.ellipse(x-8+i*4,y-4-(i%2)*3,5,6,0,0,TAU);g.fill();}g.fillStyle='#4f6a2a';g.beginPath();g.ellipse(x,y-1,11,3,0,0,TAU);g.fill();}}
  // dust
  for(const p of R.dust){const q=(time-p.t0)/.8,x=sx(p.d)+p.vx*q*ppm-q*10,y=laneY(p.lane)+2-q*10;g.fillStyle=`rgba(225,195,150,${.45*(1-q)})`;g.beginPath();g.arc(x,y,3+q*7,0,TAU);g.fill();}
  // camels, back lanes first
  const sc=clamp(laneH/50,.65,1),list=R.riv.map(o=>({lane:o.lane,draw:()=>drawRaceCamel(g,sx(o.d),laneY(o.lane)+6,sc,o.phase||0,o.col,o.rider,-9)}));
  list.push({lane:R.lane,draw:()=>{const st=time-R.stumble<.6;g.save();if(st){g.translate(px,laneY(R.lane)+6);g.rotate(Math.sin((time-R.stumble)*20)*.06);g.translate(-px,-(laneY(R.lane)+6));}drawRaceCamel(g,px,laneY(R.lane)+6,sc,R.gait||0,'#c49a62','#a8322a',R.whip);g.restore();}});
  list.sort((a,b)=>a.lane-b.lane).forEach(o=>o.draw());
  // name tags
  g.font='700 10px system-ui,-apple-system,"SF Arabic",sans-serif';
  for(const o of R.riv){const x=sx(o.d);if(x<-20||x>W+20)continue;g.fillStyle='rgba(30,18,8,.55)';rr(g,x-20,laneY(o.lane)-sc*92,40,14,6);g.fill();g.fillStyle='#fdf3dc';g.fillText(o.name,x,laneY(o.lane)-sc*92+7);}
  g.fillStyle='rgba(169,71,42,.9)';rr(g,px-20,laneY(R.lane)-sc*92,40,14,6);g.fill();g.fillStyle='#fff';g.fillText('الريح',px,laneY(R.lane)-sc*92+7);
  if(night>.3){g.fillStyle=`rgba(10,16,44,${night*.45})`;g.fillRect(0,0,W,H);}
  drawRaceHud(g,W,H,px,laneY(R.lane)-sc*92,k);
}
function drawRaceHud(g,W,H,px,tagY,k){
  const R=RACE,font=(w,s)=>`${w} ${s}px system-ui,-apple-system,"SF Arabic",sans-serif`;
  g.textAlign='center';g.textBaseline='middle';
  // progress bar
  const bw=Math.min(380,W-180),bx=(W-bw)/2,by=insets.t+16;
  g.fillStyle='rgba(30,18,8,.6)';rr(g,bx-10,by-10,bw+20,20,10);g.fill();
  g.fillStyle='rgba(255,246,226,.3)';g.fillRect(bx,by-1.5,bw,3);
  const dot=(dd,c,r)=>{g.fillStyle=c;g.beginPath();g.arc(bx+bw*clamp(dd/R.r.len,0,1),by,r,0,TAU);g.fill();};
  R.riv.forEach(o=>dot(o.d,o.rider,5));dot(R.d,'#ffd36b',6.5);
  g.fillStyle='#fff';g.fillRect(bx+bw-1,by-7,2,14);
  // time, place, stamina
  const rk=Math.max(0,k-3),place=1+R.riv.filter(o=>o.d>R.d).length;
  g.fillStyle='rgba(30,18,8,.6)';rr(g,insets.l+12,insets.t+10,150,48,12);g.fill();
  g.fillStyle='#fdf3dc';g.font=font(800,15);g.textAlign='right';g.fillText(`المركز ${AR(R.fin!=null||R.phase==='done'?R.place||place:place)} من ٣`,insets.l+150,insets.t+24);
  g.font=font(600,12);g.fillText(raceTime(R.fin!=null?R.fin:rk),insets.l+150,insets.t+44);
  g.textAlign='center';
  const sw=110,sx2=W-insets.r-sw-16,sy=insets.t+14;
  g.fillStyle='rgba(30,18,8,.6)';rr(g,sx2-8,sy-4,sw+16,40,12);g.fill();
  g.fillStyle='#fdf3dc';g.font=font(700,11);g.fillText(R.tired>0?'الناقة متعبة':'نشاط الناقة',sx2+sw/2,sy+7);
  g.fillStyle='rgba(255,255,255,.18)';rr(g,sx2,sy+18,sw,8,4);g.fill();
  g.fillStyle=R.tired>0?'#e0694f':R.stam>40?'#7ee08a':'#f2c44e';rr(g,sx2,sy+18,Math.max(8,sw*R.stam/100),8,4);g.fill();
  // feedback above the player's camel
  if(time-R.fbT<.7&&R.fb){const q=(time-R.fbT)/.7;g.globalAlpha=1-q;g.font=font(800,16);g.lineWidth=3;g.strokeStyle='rgba(30,15,5,.85)';g.strokeText(R.fb,px,tagY-12-q*14);g.fillStyle=R.fb.startsWith('ممتاز')?'#ffd36b':R.fb==='جيد'?'#c9f2a8':'#ffb0a0';g.fillText(R.fb,px,tagY-12-q*14);g.globalAlpha=1;}
  // the rhythm ring closes on the button at every beat
  if(R.phase==='run'){
    const ab=actBtn.getBoundingClientRect(),cr=canvas.getBoundingClientRect(),cx=ab.left-cr.left+ab.width/2,cy=ab.top-cr.top+ab.height/2,rr0=ab.width/2;
    const ph=(((k-3)/BEAT)%1+1)%1,rad=rr0+4+(1-ph)*38;
    g.strokeStyle=`rgba(255,230,160,${.35+.6*ph})`;g.lineWidth=3;g.beginPath();g.arc(cx,cy,rad,0,TAU);g.stroke();
    g.strokeStyle='rgba(255,255,255,.55)';g.lineWidth=1.5;g.beginPath();g.arc(cx,cy,rr0+4,0,TAU);g.stroke();
    if(rk<6){g.font=font(700,13);g.fillStyle='rgba(30,18,8,.65)';const msg='اضغط «تفاعل» حين تلامس الدائرة الزر، وغيّر المسار بالعصا';const tw=g.measureText(msg).width+24;rr(g,W/2-tw/2,H-insets.b-34,tw,26,10);g.fill();g.fillStyle='#fdf3dc';g.fillText(msg,W/2,H-insets.b-21);}
  }
  if(R.phase==='count'||(R.phase==='run'&&k<3.8)){const n=3-Math.floor(k),txt=n>0?AR(n):'انطلق!',q=k%1;
    g.font=font(900,n>0?64:48);g.lineWidth=6;g.strokeStyle='rgba(30,15,5,.8)';g.globalAlpha=1-q*.6;g.strokeText(txt,W/2,H*.38);g.fillStyle='#ffd36b';g.fillText(txt,W/2,H*.38);g.globalAlpha=1;}
  if(R.phase==='done'&&time-R.doneT>.6){
    const pw=Math.min(340,W-40),ph2=170,x0=(W-pw)/2,y0=(H-ph2)/2;
    g.fillStyle='rgba(30,18,8,.88)';rr(g,x0,y0,pw,ph2,16);g.fill();g.strokeStyle='#d9a85c';g.lineWidth=2;g.stroke();
    g.fillStyle=R.place===1?'#ffd36b':'#fdf3dc';g.font=font(900,26);g.fillText(R.place===1?'المركز الأول!':R.place===2?'المركز الثاني':'المركز الثالث',W/2,y0+34);
    g.fillStyle='#fdf3dc';g.font=font(600,14);
    g.fillText(`الوقت ${raceTime(R.fin)}${R.newBest?'، أفضل وقت لك':''}`,W/2,y0+68);
    g.fillText(R.prize?`ربحت ${R.prize} بيسة${R.medal?' ووسام الهجن':''}`.replace(/\d+/g,m=>AR(m)):'المرة القادمة يا بطل',W/2,y0+94);
    g.font=font(700,13);g.fillStyle='#e9c98a';g.fillText('اضغط «تفاعل» للعودة إلى الوادي',W/2,y0+138);
  }
}

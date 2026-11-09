// الطقس: مطر بعد الظهر مع برق ورعد وبرك ماء، ضباب الصباح، عاصفة رملية في الوادي، وقوس قزح بعد المطر
'use strict';

/* =========================================================
   DAILY WEATHER PLAN
   every game day rolls its own weather from the day number, so it is the
   same after a reload and needs nothing extra in the save
   ========================================================= */
const WX={rain:0,fog:0,sand:0,flash:0,nextBolt:6,lastScene:null,lastClock:0,told:{}};
let wxPlanCache={day:-1};
function wxPlan(day){
  if(wxPlanCache.day===day)return wxPlanCache;
  const R=mulberry(day*7919+13);R();R();
  const p={day};
  const rr=R(),rs=12+R()*4,rd=1.5+R()*2,heavy=.55+R()*.45;
  if(day>=1&&rr<.34)p.rain={a:rs,b:rs+rd,heavy};
  if(R()<.5)p.fog={a:4,b:9};
  const sr=R(),ss=10+R()*3,sd=2+R()*1.5;
  if(sr<.4)p.sand={a:ss,b:ss+sd};
  return wxPlanCache=p;
}
const wxOn=()=>OPT.weather!=='off';
const ramp=(h,a,b,e)=>h<a||h>b?0:Math.min(1,(h-a)/e,(b-h)/e);
function wxNow(){
  const c=P.clock??540,day=Math.floor(c/1440),h=(c%1440)/60,p=wxPlan(day);
  const o={rain:0,fog:0,sand:0,wet:0,bow:0,heavy:p.rain?p.rain.heavy:0};
  if(!wxOn())return o;
  if(p.rain){
    o.rain=ramp(h,p.rain.a,p.rain.b,.3)*(.45+.55*p.rain.heavy);
    o.wet=h<p.rain.a?0:h<p.rain.b?Math.min(1,(h-p.rain.a)/.6):Math.max(0,1-(h-p.rain.b)/2.2);
    if(h>p.rain.b&&h<p.rain.b+1.3&&h<17.6)o.bow=Math.sin((h-p.rain.b)/1.3*Math.PI);
  }
  if(p.fog)o.fog=h<5?Math.max(0,h-4):h<7.5?1:Math.max(0,(9-h)/1.5);
  if(p.sand)o.sand=ramp(h,p.sand.a,p.sand.b,.4);
  return o;
}
const rainingInVillage=()=>wxNow().rain>.12;

/* what each scene shows */
function wxTargets(){
  const n=wxNow(),id=scene.id,open=id==='village'||scene.forest,inside=!!scene.interior;
  return {rain:open||inside?n.rain:0,fog:open?n.fog:0,sand:scene.wadi||scene.fort?n.sand:0,wet:open?n.wet:0,bow:open?n.bow:0,heavy:n.heavy};
}
function weatherTick(dt){
  const T=wxTargets(),c=P.clock??540,snap=WX.lastScene!==scene.id||Math.abs(c-WX.lastClock)>20;
  WX.lastScene=scene.id;WX.lastClock=c;
  const k=snap?1:Math.min(1,dt*.35);
  for(const key of ['rain','fog','sand'])WX[key]+=(T[key]-WX[key])*k;
  WX.wet=T.wet;WX.bow=T.bow;WX.heavy=T.heavy;
  // lightning & thunder in heavy rain
  if(WX.flash>0)WX.flash=Math.max(0,WX.flash-dt*2.4);
  if(WX.rain>.5&&WX.heavy>.75&&(state==='play'||state==='dialog'||state==='battle')){
    WX.nextBolt-=dt;
    if(WX.nextBolt<=0){WX.nextBolt=12+Math.random()*22;if(!scene.interior)WX.flash=1;const far=Math.random();setTimeout(()=>SFX.play('thunder',{vol:scene.interior?.5:1-far*.5}),300+far*1500);}
  }
  wxNotices(T);
}
function wxNotices(T){
  if(state!=='play')return;
  const day=Math.floor((P.clock??540)/1440),say=(kind,html)=>{const key=kind+day;if(WX.told[key])return;WX.told[key]=1;notify(html,3.6);};
  if(T.rain>.1&&!scene.interior)say('rain','بدأ المطر يهطل<small>أهل القرية يحتمون في بيوتهم، وسحر النار أضعف تحت المطر</small>');
  if(T.sand>.15)say('sand','عاصفة رملية!<small>المشي أبطأ، وسحر الرمل أقوى في المعارك</small>');
  if(T.fog>.3)say('fog','ضباب الصباح<small>ينقشع بعد ساعات قليلة</small>');
  if(T.bow>.3&&!scene.interior)say('bow','قوس قزح فوق الوادي');
}
/* gameplay touches */
function wxElem(el){
  if(!wxOn())return 1;
  if(el==='fire'&&WX.rain>.3)return .75;
  if(el==='sand'&&WX.sand>.3)return 1.25;
  return 1;
}
const wxSlow=()=>1-.16*(scene.wadi||scene.fort?WX.sand:0);
function wxLabel(){const n=wxNow();return n.sand>.1&&(scene.wadi||scene.fort)?'عاصفة رملية':n.rain>.1?'ممطر':n.fog>.2?'ضباب':n.bow>.1?'قوس قزح بعد المطر':n.wet>.1?'الأرض مبللة':'صحو';}

/* =========================================================
   PUDDLES: they fill while it rains and dry in about two hours
   ========================================================= */
const PUDDLES={village:[],forest:[]};
(()=>{
  const R=mulberry(4242);
  for(const p of MAP.paths)for(let i=0;i<p.pts.length-1;i++){const a=p.pts[i],b=p.pts[i+1],L=Math.hypot(b[0]-a[0],b[1]-a[1]);
    for(let s=60;s<L-30;s+=110+R()*90){const t=s/L,x=a[0]+(b[0]-a[0])*t+(R()-.5)*p.w*.45,y=a[1]+(b[1]-a[1])*t+(R()-.5)*p.w*.35;
      if(y<20||Math.hypot(x-MAP.fountain.x,y-MAP.fountain.y)<100)continue;PUDDLES.village.push({x,y,rx:9+R()*10,ry:4+R()*3,s:R()});}}
  [[488,500],[664,520],[520,372],[640,380]].forEach(([x,y])=>PUDDLES.village.push({x,y,rx:10+R()*8,ry:4.5+R()*2,s:R()}));
  const fp=FOREST.path;for(let i=0;i<fp.length-1;i++){const a=fp[i],b=fp[i+1];for(let t=.25;t<1;t+=.5)PUDDLES.forest.push({x:a[0]+(b[0]-a[0])*t+(R()-.5)*20,y:a[1]+(b[1]-a[1])*t,rx:10+R()*9,ry:4+R()*3,s:R()});}
})();
let splashCool=0;
function puddleFeel(dt){
  splashCool-=dt;
  const list=PUDDLES[scene.id];if(!list||WX.wet<.25||!hero.moving||splashCool>0)return;
  for(const p of list){const dx=(hero.x-p.x)/(p.rx+3),dy=(hero.y-p.y)/(p.ry+3);
    if(dx*dx+dy*dy<1){splashCool=.3;RIPPLES.push({x:hero.x,y:hero.y,rx:1,t0:time,sc:scene.id});SFX.play('splash');
      if(fxOn())for(let i=0;i<4;i++)PUFFS.push({x:hero.x,y:hero.y-1,vx:(Math.random()-.5)*30,vy:-14-Math.random()*10,r:1.2,t0:time,life:.35,col:'200,225,240'});break;}}
}
function drawPuddles(g,L,T,R2,B2){
  const list=PUDDLES[scene.id],w=WX.wet;if(!list||w<.03)return;
  for(const p of list){
    if(p.x<L-30||p.x>R2+30||p.y<T-20||p.y>B2+20)continue;
    const s=.55+.45*Math.min(1,w*1.4);
    g.fillStyle=`rgba(64,84,98,${.42*w})`;ell(g,p.x,p.y,p.rx*s,p.ry*s);g.fill();
    g.fillStyle=`rgba(190,215,232,${.28*w})`;ell(g,p.x-p.rx*.25*s,p.y-p.ry*.3*s,p.rx*.45*s,p.ry*.3*s);g.fill();
    if(WX.rain>.1)for(let k=0;k<2;k++){const q=(time*1.4+p.s*7+k*.5)%1;g.strokeStyle=`rgba(225,240,250,${.55*(1-q)*WX.rain})`;g.lineWidth=.8;ell(g,p.x+(p.s-.5)*p.rx+(k?4:-3),p.y+(k?1:-1),1+q*5,(1+q*5)*.45);g.stroke();}
  }
}
/* rain hitting the ground around the camera (stateless, so it costs nothing to keep) */
function drawGroundRain(g,L,T,R2,B2){
  if(WX.rain<.05||!fxOn())return;
  const n=Math.round(46*WX.rain),w=R2-L,h=B2-T;g.lineWidth=.8;
  for(let j=0;j<n;j++){
    const slot=Math.floor(time*3+j*.618),q=(time*3+j*.618)%1,R=mulberry(slot*131+j*977);
    const x=L+R()*w,y=T+R()*h;g.strokeStyle=`rgba(225,238,248,${.5*(1-q)})`;ell(g,x,y,1+q*4,(1+q*4)*.4);g.stroke();
  }
}

/* =========================================================
   SCREEN LAYERS: fog banks, sand clouds, rain streaks, lightning, rainbow
   ========================================================= */
function cloudSheet(seed,col,n){
  const cv=document.createElement('canvas');cv.width=512;cv.height=256;const g=cv.getContext('2d'),R=mulberry(seed);
  for(let i=0;i<n;i++){const x=R()*512,y=R()*256,r=40+R()*70,a=.25+R()*.35;
    for(const ox of [-512,0,512])for(const oy of [-256,0,256]){const gr=g.createRadialGradient(x+ox,y+oy,0,x+ox,y+oy,r);gr.addColorStop(0,`rgba(${col},${a})`);gr.addColorStop(1,`rgba(${col},0)`);g.fillStyle=gr;g.fillRect(x+ox-r,y+oy-r,r*2,r*2);}}
  return cv;
}
let FOGCV=null,SANDCV=null;
function drawSheet(g,cv,ox,oy,scale,alpha){
  const tw=Math.round(512*scale),th=Math.round(256*scale),W=canvas.width,H=canvas.height;
  const x0=Math.round(((ox%tw)+tw)%tw-tw),y0=Math.round(((oy%th)+th)%th-th);g.globalAlpha=alpha;
  for(let y=y0;y<H;y+=th)for(let x=x0;x<W;x+=tw)g.drawImage(cv,x,y,tw,th);
  g.globalAlpha=1;
}
const DROPS=[];
function drawWeatherScreen(g,inBattle){
  const bk=inBattle?.55:1,fo=WX.fog*bk,sa=WX.sand*bk,ra=scene.interior?0:WX.rain,bow=WX.bow;
  if(fo<.02&&sa<.02&&ra<.02&&WX.flash<.02&&bow<.02)return;
  const d=view.dpr,W=canvas.width,H=canvas.height,cam=inBattle?0:view.camX,camY=inBattle?0:view.camY,z=view.zoom,hi=fxOn();
  g.save();g.setTransform(1,0,0,1,0,0);g.imageSmoothingEnabled=true;
  if(bow>.02&&!inBattle){ // a faint arc high over the scene
    const cx=W*.5-cam*z*d*.05,cy=H*1.12,R0=H*.98;
    const cols=['255,70,70','255,160,60','255,235,90','90,210,110','80,150,255','150,100,230'];
    g.globalCompositeOperation='screen';
    cols.forEach((c,i)=>{g.strokeStyle=`rgba(${c},${.3*bow*(1-nightAmount())})`;g.lineWidth=6*d;g.beginPath();g.arc(cx,cy,R0-i*6*d,Math.PI*1.15,Math.PI*1.85);g.stroke();});
    g.globalCompositeOperation='source-over';
  }
  if(fo>.02){
    if(!FOGCV)FOGCV=cloudSheet(91,'236,240,244',26);
    const lit=1-nightAmount()*.6;
    g.fillStyle=`rgba(${Math.round(222*lit)},${Math.round(228*lit)},${Math.round(236*lit)},${.22*fo})`;g.fillRect(0,0,W,H);
    if(hi){drawSheet(g,FOGCV,-cam*z*d*.6+time*6*d,-camY*z*d*.6,1.7*d,.55*fo*lit);drawSheet(g,FOGCV,-cam*z*d*1.1-time*10*d+300*d,-camY*z*d*1.1+90*d,2.4*d,.4*fo*lit);}
  }
  if(sa>.02){
    if(!SANDCV)SANDCV=cloudSheet(57,'214,164,98',30);
    g.fillStyle=`rgba(196,140,78,${.3*sa})`;g.fillRect(0,0,W,H);
    if(hi){drawSheet(g,SANDCV,-cam*z*d*.7-time*120*d,-camY*z*d*.7+Math.sin(time*.7)*20*d,1.8*d,.75*sa);drawSheet(g,SANDCV,-cam*z*d*1.2-time*220*d,-camY*z*d*1.2,2.6*d,.5*sa);}
    g.strokeStyle=`rgba(240,210,160,${.5*sa})`;g.lineWidth=1.1*d;g.beginPath();
    const n=Math.round((hi?90:40)*sa);
    for(let i=0;i<n;i++){const sp=500+(i*37%300),x=((i*173.3-time*sp*d)%W+W)%W,y=((i*97.7)%H+Math.sin(time*3+i)*6*d),l=(14+(i%5)*8)*d;g.moveTo(x,y);g.lineTo(x+l,y-l*.08);}
    g.stroke();
  }
  if(ra>.02){
    g.fillStyle=`rgba(28,42,58,${.26*ra})`;g.fillRect(0,0,W,H);
    const n=Math.round((hi?170:70)*ra);
    while(DROPS.length<n)DROPS.push({x:Math.random(),y:Math.random(),s:.8+Math.random()*.5,l:.6+Math.random()*.6});
    const wind=.18,lt=(1-nightAmount()*.5);
    g.strokeStyle=`rgba(200,220,240,${.42*lt})`;g.lineWidth=1.1*d;g.beginPath();
    const fall=(H/d)*1.6,dt2=Math.min(.05,time-(drawWeatherScreen.t||time));drawWeatherScreen.t=time;
    for(let i=0;i<n;i++){const p=DROPS[i];p.y+=dt2*p.s*fall/(H/d);p.x+=dt2*p.s*wind*fall/(W/d)*(H/W);
      if(p.y>1){p.y-=1.05;p.x=Math.random();}if(p.x>1)p.x-=1;
      const x=p.x*W,y=p.y*H,l=16*p.l*d;g.moveTo(x,y);g.lineTo(x-l*wind,y-l);}
    g.stroke();
  }
  if(WX.flash>.02){g.fillStyle=`rgba(235,240,255,${.7*WX.flash*WX.flash})`;g.fillRect(0,0,W,H);}
  g.restore();
}

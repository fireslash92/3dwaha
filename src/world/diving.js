// مهرجان الغوص على اللؤلؤ: اضغط مطوّلًا لتغوص، واترك ليسحبك السيب إلى السطح، واجمع المحار قبل أن ينفد نفَسك
'use strict';

Object.assign(ITEMS,{
  pearl:{name:'لؤلؤة',mat:true,sell:120,icon:'gem',col:'#efe7d6',desc:'لؤلؤة من محار الخليج. يشتريها التجار بسعر طيب.'},
  dana:{name:'دانة',mat:true,sell:600,icon:'gem',col:'#fff8e6',desc:'لؤلؤة كبيرة نادرة، يسمّيها الغواصون الدانة.'},
});
SHOP.festival={title:'مهرجان الغوص',sub:'النوخذة مسعود يحكم بين الغواصين',tabs:[['dive','الغوص']],stock:[]};
const DIVE_FEE=30;
function diveBoard(){
  const best=P.diveBest||0;
  return `<p class="muted">اضغط «تفاعل» مطوّلًا لتغوص، واتركه ليسحبك السيب إلى السطح. حرّك العصا يمينًا ويسارًا لتصل إلى المحار. على السطح يعود نفَسك، وفي العمق ينفد أسرع، لكن المحار هناك أغنى باللؤلؤ.</p>
  <div class="quest"><b>جولة غوص بـ${baisa(DIVE_FEE)}</b><p class="muted" style="margin:4px 0 8px">خمس وأربعون ثانية. الفائز الأول يأخذ ٣٠٠ بيسة، والثاني ١٢٠. واللؤلؤ الذي تجده لك.${best?` أفضل نتيجة لك: ${AR(best)}.`:''}</p>
  <div class="actions"><button type="button" class="btn" data-dive="1"${P.money<DIVE_FEE?' disabled':''}>ابدأ الغوص</button></div></div>`;
}
let DIVE=null;
function startDive(){
  if(P.money<DIVE_FEE){SFX.play('error');return;}
  P.money-=DIVE_FEE;SFX.play('coin');shopEl.hidden=true;gameEl.classList.remove('talking');state='fade';fadeEl.classList.add('on');resetInput();
  setTimeout(()=>{
    const oy=[];for(let i=0;i<16;i++){const d=i<10?.82+Math.random()*.14:.38+Math.random()*.4,pearl=Math.random()<.25+.45*d,dana=pearl&&d>.7&&Math.random()<.12+.22*(d-.7)/.3;oy.push({x:.08+Math.random()*.84,d,pearl,dana,taken:false,ph:Math.random()*TAU});}
    DIVE={t0:time,phase:'count',x:.5,depth:0,breath:100,basket:[],oy,left:45,black:-9,bubbles:[],msg:null,msgT:-9};
    state='dive';gameEl.classList.add('racing');actBtn.classList.add('ready');fadeEl.classList.remove('on');SFX.play('crowd');
  },450);
}
function diveTick(dt){
  const D=DIVE;if(!D)return;const k=time-D.t0;
  if(D.phase==='count'){if(k>=2.2){D.phase='run';SFX.play('go');}return;}
  if(D.phase==='done')return;
  D.left-=dt;
  const v=inputVector();if(v)D.x=clamp(D.x+v.x*.36*dt,.04,.96);
  const out=time-D.black<1.6;
  if(out)D.depth=Math.max(0,D.depth-.6*dt);
  else if(fishHold&&D.left>0){D.depth=Math.min(1,D.depth+.42*dt);}
  else D.depth=Math.max(0,D.depth-.3*dt);
  if(D.depth<.03)D.breath=Math.min(100,D.breath+32*dt);else D.breath-=(5+D.depth*9)*dt;
  if(D.breath<=0&&!out){D.breath=0;D.black=time;const lost=Math.ceil(D.basket.length/2);D.basket.splice(0,lost);D.msg=lost?`نفد نفَسك! سحبك السيب، وسقط من الديين ${AR(lost)} محار`:'نفد نفَسك! سحبك السيب إلى السطح';D.msgT=time;SFX.play('stumble');buzz([80,40,80]);}
  if(!out&&D.depth>.05)for(const o of D.oy)if(!o.taken&&Math.abs(o.x-D.x)<.045&&Math.abs(o.d-D.depth)<.06){o.taken=true;D.basket.push(o);SFX.play('plop');D.msg='محارة!';D.msgT=time;}
  if(fxOn()&&D.depth>.04&&Math.random()<dt*6)D.bubbles.push({x:D.x,d:D.depth,t0:time});
  D.bubbles=D.bubbles.filter(b=>time-b.t0<1.6);
  if(D.left<=0&&D.depth<.03)finishDive();
}
function finishDive(){
  const D=DIVE;D.phase='done';D.doneT=time;
  const pearls=D.basket.filter(o=>o.pearl&&!o.dana).length,danas=D.basket.filter(o=>o.dana).length,score=pearls+danas*3;
  D.pearls=pearls;D.danas=danas;D.score=score;
  const riv=[1+((Math.random()*3)|0),2+((Math.random()*3)|0),2+((Math.random()*4)|0)];D.riv=riv;
  D.place=1+riv.filter(r=>r>score).length;
  P.inv.pearl=(P.inv.pearl||0)+pearls;P.inv.dana=(P.inv.dana||0)+danas;
  D.prize=D.place===1?300:D.place===2?120:0;P.money+=D.prize;P.diveBest=Math.max(P.diveBest||0,score);
  if(pearls+danas>=2&&!P.flags.c6_dive){P.flags.c6_dive=1;D.unlock=true;}
  if(danas)achUnlock('dana');
  SFX.play(D.place===1?'fanfare':'quest');saveGame();
}
function endDive(){state='fade';fadeEl.classList.add('on');setTimeout(()=>{const u=DIVE&&DIVE.unlock;DIVE=null;gameEl.classList.remove('racing');state='play';talkCooldown=.5;fadeEl.classList.remove('on');if(u)notify('أثبتّم أنكم غواصون!<small>تحدّثوا إلى النوخذة مسعود عند الرصيف</small>',3.6);},450);}
function divePress(){if(DIVE&&DIVE.phase==='done'&&time-DIVE.doneT>.6)endDive();}

function drawDiver(g,x,y,s,swim,t){
  g.save();g.translate(x,y);g.scale(s,s);const k=Math.sin(t*8)*(swim?.5:.15);
  g.fillStyle='#8a5a3a';g.save();g.rotate(k*.4);g.fillRect(-3,8,3,14);g.restore();g.save();g.rotate(-k*.4);g.fillRect(1,8,3,14);g.restore();
  g.fillStyle='#a8714a';ell(g,0,0,6,11);g.fill();g.fillStyle='#f3ead8';g.fillRect(-6,4,12,6);
  g.fillStyle='#a8714a';g.save();g.rotate(-1.2+k);g.fillRect(-2,-16,3,14);g.restore();g.save();g.rotate(1.2-k);g.fillRect(-1,-16,3,14);g.restore();
  g.fillStyle='#a8714a';circ(g,0,-14,5);g.fillStyle='#1f1712';ell(g,0,-17,5,2.4);g.fill();g.fillStyle='#e9dcc0';g.fillRect(-2.5,-13,5,1.6);
  g.fillStyle='#8a6a3a';rr(g,4,-2,7,8,2);g.fill();
  g.restore();
}
function renderDive(){
  const D=DIVE,g=ctx,d=view.dpr,W=view.w,H=view.h,k=time-D.t0,surf=H*.24,bed=H*.9,Y=dp=>surf+(bed-surf)*dp;
  g.setTransform(d,0,0,d,0,0);
  const sky=g.createLinearGradient(0,0,0,surf);sky.addColorStop(0,'#8fc4e0');sky.addColorStop(1,'#f3e2b8');g.fillStyle=sky;g.fillRect(0,0,W,surf);
  const sea=g.createLinearGradient(0,surf,0,H);sea.addColorStop(0,'#3f9fc0');sea.addColorStop(.6,'#1f5f7a');sea.addColorStop(1,'#0f3a4f');g.fillStyle=sea;g.fillRect(0,surf,W,H-surf);
  g.save();g.globalCompositeOperation='lighter';for(let i=0;i<6;i++){const x=W*(.1+i*.17)+Math.sin(time*.4+i)*20;const gr=g.createLinearGradient(0,surf,0,bed);gr.addColorStop(0,'rgba(200,240,255,.12)');gr.addColorStop(1,'rgba(200,240,255,0)');g.fillStyle=gr;poly(g,[x,surf,x+30,surf,x+80,bed,x+40,bed]);}g.restore();
  // seabed, rocks, coral
  g.fillStyle='#c9b08a';g.beginPath();g.moveTo(0,H);for(let x=0;x<=W;x+=20)g.lineTo(x,bed+Math.sin(x*.03)*6);g.lineTo(W,H);g.closePath();g.fill();
  for(let i=0;i<8;i++){const x=(i*137)%W,c=['#e07a63','#d2577a','#f2b33c'][i%3];g.strokeStyle=c;g.lineWidth=3;g.beginPath();g.moveTo(x,bed);g.lineTo(x-6,bed-18);g.moveTo(x,bed);g.lineTo(x+5,bed-24);g.stroke();}
  // oysters
  for(const o of D.oy){if(o.taken)continue;const x=o.x*W,y=Y(o.d)+4;g.fillStyle='#6f6a5a';ell(g,x,y,8,4.4);g.fill();g.fillStyle='#9a9280';ell(g,x,y-1.5,7,2.6);g.fill();if(Math.sin(time*2+o.ph)>.92){g.fillStyle='rgba(255,255,255,.8)';circ(g,x+3,y-3,1.2);}}
  // boat, rope, diver
  const bx=W*.5;g.fillStyle='#7a4a2a';g.beginPath();g.moveTo(bx-90,surf-8);g.quadraticCurveTo(bx,surf+14,bx+90,surf-8);g.lineTo(bx+70,surf-16);g.lineTo(bx-70,surf-16);g.closePath();g.fill();
  g.strokeStyle='#4a3a26';g.lineWidth=2.4;g.beginPath();g.moveTo(bx,surf-16);g.lineTo(bx,surf-70);g.stroke();g.fillStyle='#e9dcc0';poly(g,[bx+2,surf-68,bx+44,surf-24,bx+2,surf-22]);
  g.fillStyle='#a8714a';circ(g,bx-40,surf-26,4);g.fillStyle='#f3ead8';g.fillRect(bx-44,surf-22,8,8);
  const dx=D.x*W,dy=Y(D.depth);
  g.strokeStyle='rgba(230,220,190,.85)';g.lineWidth=1.2;g.beginPath();g.moveTo(bx-38,surf-18);g.quadraticCurveTo((bx+dx)/2,(surf+dy)/2+10,dx,dy-10);g.stroke();
  g.fillStyle='rgba(255,255,255,.25)';ell(g,0,surf,W,3);g.fill();
  for(const b of D.bubbles){const q=(time-b.t0)/1.6;g.strokeStyle=`rgba(230,250,255,${.7*(1-q)})`;g.lineWidth=1;g.beginPath();g.arc(b.x*W+Math.sin(time*5+b.t0)*4,Y(b.d)-q*80-14,2+q*2,0,TAU);g.stroke();}
  drawDiver(g,dx,dy,1.4,fishHold,time);
  // HUD
  const font=(w,s)=>`${w} ${s}px system-ui,-apple-system,"SF Arabic",sans-serif`;g.textAlign='center';g.textBaseline='middle';
  g.fillStyle='rgba(30,18,8,.6)';rr(g,insets.l+12,insets.t+10,170,52,12);g.fill();
  g.fillStyle='#fdf3dc';g.font=font(700,12);g.textAlign='right';g.fillText(`الوقت ${AR(Math.max(0,Math.ceil(D.left)))} ثانية`,insets.l+170,insets.t+24);g.fillText(`في الديين ${AR(D.basket.length)} محار`,insets.l+170,insets.t+44);
  g.textAlign='center';const bw=130,bxx=W-insets.r-bw-18,byy=insets.t+16;g.fillStyle='rgba(30,18,8,.6)';rr(g,bxx-8,byy-6,bw+16,40,12);g.fill();
  g.fillStyle='#fdf3dc';g.font=font(700,11);g.fillText('النفَس',bxx+bw/2,byy+5);g.fillStyle='rgba(255,255,255,.18)';rr(g,bxx,byy+16,bw,8,4);g.fill();
  g.fillStyle=D.breath>50?'#7ee0ff':D.breath>25?'#f2c44e':'#e0694f';rr(g,bxx,byy+16,Math.max(8,bw*D.breath/100),8,4);g.fill();
  if(time-D.msgT<1.4&&D.msg){g.font=font(800,15);g.lineWidth=3;g.strokeStyle='rgba(10,20,30,.8)';g.strokeText(D.msg,W/2,surf+30);g.fillStyle='#fff6d6';g.fillText(D.msg,W/2,surf+30);}
  if(D.phase==='count'){g.font=font(800,15);g.fillStyle='rgba(30,18,8,.7)';const m='اضغط «تفاعل» مطوّلًا لتغوص، واتركه لتصعد';const tw=g.measureText(m).width+26;rr(g,W/2-tw/2,H*.5-16,tw,32,12);g.fill();g.fillStyle='#fdf3dc';g.fillText(m,W/2,H*.5);}
  if(D.left<=0&&D.phase==='run'){g.font=font(700,13);g.fillStyle='#fff6d6';g.fillText('انتهى الوقت، اصعد إلى السطح',W/2,surf+52);}
  if(D.phase==='done'&&time-D.doneT>.5){const pw=Math.min(340,W-40),ph=180,x0=(W-pw)/2,y0=(H-ph)/2;
    g.fillStyle='rgba(30,18,8,.9)';rr(g,x0,y0,pw,ph,16);g.fill();g.strokeStyle='#d9a85c';g.lineWidth=2;g.stroke();
    g.fillStyle=D.place===1?'#ffd36b':'#fdf3dc';g.font=font(900,22);g.fillText(['','المركز الأول!','المركز الثاني','المركز الثالث','المركز الرابع'][D.place],W/2,y0+30);
    g.fillStyle='#fdf3dc';g.font=font(600,13);
    g.fillText(`فتحت ${AR(D.basket.length)} محار: ${AR(D.pearls)} لؤلؤة${D.danas?` و${AR(D.danas)} دانة`:''}`,W/2,y0+64);
    g.fillText(`نتيجتك ${AR(D.score)}، والغواصون الآخرون ${D.riv.map(AR).join('، ')}`,W/2,y0+88);
    g.fillText(D.prize?`ربحت ${AR(D.prize)} بيسة`:'حظًا أوفر في الجولة القادمة',W/2,y0+112);
    g.font=font(700,12);g.fillStyle='#e9c98a';g.fillText('اضغط «تفاعل» للعودة',W/2,y0+152);}
}

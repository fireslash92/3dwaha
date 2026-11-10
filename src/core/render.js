// رسم المشهد
'use strict';

/* =========================================================
   RENDER
   ========================================================= */
const scratch=[];
function render(){
  if(B){renderBattle();return;}
  if(RACE){renderRace();return;}
  if(DIVE){renderDive();return;}
  const g=ctx,s=view.dpr*view.zoom,vw=view.w/view.zoom,vh=view.h/view.zoom;
  const so=state==='title'?[0,0]:shakeOffset(),cx=Math.round((view.camX+so[0])*s)/s,cy=Math.round((view.camY+so[1])*s)/s;
  g.setTransform(1,0,0,1,0,0);g.fillStyle=scene.bg;g.fillRect(0,0,canvas.width,canvas.height);
  if(!SPR||!scene.ground)return;
  g.setTransform(s,0,0,s,-cx*s,-cy*s);
  g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';
  const S=scene.groundS,x0=Math.max(0,Math.floor(cx)),y0=Math.max(0,Math.floor(cy));
  const sw=Math.min(Math.ceil(vw)+2,scene.W-x0),sh=Math.min(Math.ceil(vh)+2,scene.H-y0);
  const srcW=Math.min(sw*S,scene.ground.width-x0*S),srcH=Math.min(sh*S,scene.ground.height-y0*S);
  if(srcW>0&&srcH>0)g.drawImage(scene.ground,x0*S,y0*S,srcW,srcH,x0,y0,srcW/S,srcH/S);
  drawGroundFeel(g);
  const t=time,m=30,L=cx-m,T=cy-m,Rr=cx+vw+m,Bt=cy+vh+m;
  drawPuddles(g,L,T,Rr,Bt);drawGroundRain(g,L,T,Rr,Bt);
  if(scene.id==='village'){
    const F=MAP.falaj;
    if(dryVillage()){g.fillStyle='#7d7262';g.fillRect(F.x+4,F.y,F.w-8,F.h-4);g.fillStyle='rgba(60,50,40,.4)';for(let i=0;i<8;i++)g.fillRect(F.x+6+(i%3)*3,F.y+i*26,6,1);}
    else{g.fillStyle='rgba(225,246,255,.55)';for(let i=0;i<10;i++){const yy=F.y+((t*36+i*22)%(F.h-10));g.fillRect(F.x+6+(i%3)*2.5,yy,2.4,1.1);}}
  }
  if(scene.wadi)drawWadiWater(g,t);
  scratch.length=0;
  for(const d of scene.statics){const b=d.b;if(b[2]<L||b[0]>Rr||b[3]<T||b[1]>Bt)continue;scratch.push(d);}
  for(const n of NPCS)if(n.scene===scene.id)scratch.push({y:n.y,x:n.x,draw:g2=>drawPerson(g2,n.x,n.y,n.dir,n.look,t,n.moving,n.phase)});
  lifeDrawables(d=>{const b=d.x,c=d.y;if(b<L-60||b>Rr+60||c<T-60||c>Bt+460)return;scratch.push(d);});
  marketDrawables(d=>scratch.push(d));
  for(const pk of PICKUPS)if(pk.scene===scene.id&&pickupActive(pk))scratch.push({y:pk.y,x:pk.x,draw:g2=>drawPickup(g2,pk,t)});
  {const f=follower();if(f)scratch.push({y:f.y,x:f.x,draw:g2=>drawPerson(g2,f.x,f.y,f.dir,LOOKS.aisha,t,hero.moving,hero.phase*.9)});}
  scratch.push({y:hero.y+.01,x:hero.x,draw:g2=>drawHero(g2,hero.x,hero.y,hero.dir,hero.phase,hero.moving,t,time>hero.blinkAt)});
  scratch.sort((a,b)=>a.y-b.y||a.x-b.x);
  for(const d of scratch)d.draw(g,t);
  drawFishWorld(g,t);
  drawCloudShadows(g,L,T,Rr,Bt);
  drawBunting(g,t);
  drawAirFeel(g);
  drawSunShafts(g);drawCanopy(g);
  drawNight(g,cx,cy);
  drawWeatherScreen(g,false);drawAreaWeather(g);
  for(const n of NPCS){if(n.scene!==scene.id||target&&target.npc===n&&state==='play')continue;const m=questMark(n);if(m)drawQuestMark(g,n,m,t);else if(n.shop&&met.has(n.id)&&Math.hypot(hero.x-n.x,hero.y-n.y)<150)drawShopMark(g,n,t);}
  if(questStarted&&hasSkill('seeker'))for(const n of NPCS){
    if(n.scene!==scene.id||n===SALEM||n.noMeet||met.has(n.id)||(target&&target.npc===n))continue;
    const sx=n.x,sy=n.y-(n.look.child?44:52)+Math.sin(t*3+n.x)*1.5;
    g.fillStyle='rgba(60,30,0,.35)';drawStar(g,sx+.6,sy+.8,5.4);g.fillStyle='#ffd36b';drawStar(g,sx,sy,5.4);
  }
  const fx=OPT.quality!=='saver';
  if(scene.forest){
    if(fx)for(let i=0;i<14;i++){const al=.5+.5*Math.sin(t*2.2+i*1.9),px=(i*97+Math.sin(t*.4+i)*40)%FW,py=(i*173+t*6)%FH;if(px<L||px>Rr||py<T||py>Bt)continue;g.fillStyle=`rgba(255,238,160,${.16*al})`;circ(g,px,py,5);g.fillStyle=`rgba(255,250,215,${.85*al})`;circ(g,px,py,1.3);}
  }else if(scene.wadi){
    if(fx)for(let i=0;i<10;i++){const k=(t*.08+i/10)%1,px=k*WW,py=200+((i*53)%240)+Math.sin(t+i)*6;g.fillStyle=`rgba(240,220,170,${.35*Math.sin(k*Math.PI)})`;g.fillRect(px,py,10,1.2);}
  }else if(!scene.interior){
    if(cy<200&&fx&&!P.flags.boss){
      const a=.24+.08*Math.sin(t*1.7);
      const gr=g.createRadialGradient(576,28,0,576,28,96);gr.addColorStop(0,`rgba(255,228,150,${a})`);gr.addColorStop(1,'rgba(255,228,150,0)');g.fillStyle=gr;g.fillRect(480,-68,192,192);
      for(let i=0;i<9;i++){const al=.5+.5*Math.sin(t*2.6+i*1.7),fx=576+Math.sin(t*.45+i*2.1)*(i%2?120:70),fy=46+Math.sin(t*.62+i*1.3)*34;
        g.fillStyle=`rgba(255,238,160,${.18*al})`;circ(g,fx,fy,5);g.fillStyle=`rgba(255,250,215,${.9*al})`;circ(g,fx,fy,1.4);}
    }
    for(let i=0;i<(fx?2:0);i++){
      const bx=888+Math.sin(t*.55+i*2.4)*92+Math.sin(t*1.7+i)*10,by=670+Math.sin(t*.8+i*1.7)*48-14,fl=Math.abs(Math.sin(t*14+i*3));
      if(bx<L||bx>Rr||by<T||by>Bt)continue;
      g.fillStyle=i?'#f3a5c0':'#f6d36b';ell(g,bx-2*fl,by,2.6*fl+.4,2);g.fill();ell(g,bx+2*fl,by,2.6*fl+.4,2);g.fill();
      g.fillStyle='#4a3524';g.fillRect(bx-.4,by-1.6,.8,3.2);
    }
  }else{
    const cfg=scene.cfg,wx=cfg.window.x+28;
    g.fillStyle='rgba(255,240,200,.7)';
    for(let i=0;i<(fx?8:0);i++){const k=(t*.05+i/8)%1;g.globalAlpha=.6*Math.sin(k*Math.PI);circ(g,wx-10+k*60+Math.sin(t*.7+i*2)*8,WALL+10+k*130,.9);}
    g.globalAlpha=1;
    cfg.lanterns.forEach((lx,i)=>{const f=.8+.2*Math.sin(t*7+i)*Math.sin(t*3.3+i);const gr=g.createRadialGradient(lx,44,0,lx,44,30);gr.addColorStop(0,`rgba(255,206,120,${.35*f})`);gr.addColorStop(1,'rgba(255,206,120,0)');g.fillStyle=gr;g.fillRect(lx-30,14,60,60);});
  }
  if(state==='play'&&target)drawBubble(g,target,t);
  g.setTransform(1,0,0,1,0,0);g.scale(view.dpr,view.dpr);
  g.fillStyle=view.warm;g.fillRect(0,0,view.w,view.h);
  g.fillStyle=view.vig;g.fillRect(0,0,view.w,view.h);
  drawFishUI(g);
}
function drawStar(g,x,y,r){g.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr2=i%2?r*.45:r;g.lineTo(x+Math.cos(a)*rr2,y+Math.sin(a)*rr2);}g.closePath();g.fill();}
function drawBubble(g,tg,t){
  const x=tg.x,bob=Math.sin(t*5)*1.8,by=(tg.kind==='npc'?tg.y-54:tg.kind==='door'?tg.y-58:tg.y-40)+bob;
  g.fillStyle='rgba(30,18,8,.22)';rr(g,x-12,by-8,24,16,7);g.fill();
  rr(g,x-12,by-10,24,16,7);g.fillStyle='#fffaf0';g.fill();g.strokeStyle='#6b4a2b';g.lineWidth=1.4;g.stroke();
  g.beginPath();g.moveTo(x-3.5,by+5.4);g.lineTo(x,by+10);g.lineTo(x+3.5,by+5.4);g.closePath();g.fillStyle='#fffaf0';g.fill();
  g.strokeStyle='#6b4a2b';g.beginPath();g.moveTo(x-3.5,by+6);g.lineTo(x,by+10);g.lineTo(x+3.5,by+6);g.stroke();
  g.fillStyle='#6b4a2b';
  if(tg.kind==='npc'){for(let i=0;i<3;i++)circ(g,x-6+i*6,by-2,1.5+.5*Math.max(0,Math.sin(t*6-i*.9)));}
  else if(tg.kind==='fish'){g.strokeStyle='#2f7896';g.lineWidth=1.6;g.beginPath();g.moveTo(x+3,by-8);g.lineTo(x+3,by);g.arc(x,by,3,0,Math.PI);g.stroke();g.fillStyle='#d8432e';circ(g,x+3,by-8,1.6);}
  else if(tg.kind==='spring'){g.fillStyle='#2f7896';g.beginPath();g.moveTo(x,by-8);g.quadraticCurveTo(x+5,by-1,x+4,by+1);g.arc(x,by+1,4,0,Math.PI);g.quadraticCurveTo(x-5,by-1,x,by-8);g.fill();}
  else{g.fillStyle='#a9472a';const s=tg.kind==='door'?1:-1,c=by-2;poly(g,[x,c-5*s,x+5,c+.5*s,x+2,c+.5*s,x+2,c+5*s,x-2,c+5*s,x-2,c+.5*s,x-5,c+.5*s]);}
}
function drawPortrait(n){
  const pc=$('portrait'),px=pc.getContext('2d'),d=Math.min(window.devicePixelRatio||1,3),size=66;
  pc.width=size*d;pc.height=size*d;
  px.setTransform(d,0,0,d,0,0);
  const bg=px.createRadialGradient(size*.4,size*.35,4,size/2,size/2,size*.7);bg.addColorStop(0,'#fbe6b8');bg.addColorStop(1,'#d9a85c');
  px.fillStyle=bg;px.fillRect(0,0,size,size);
  px.fillStyle='rgba(255,255,255,.25)';circ(px,size*.22,size*.2,10);
  if(n.portrait==='rock'){px.save();px.translate(size/2,size-4);px.scale(1.5,1.5);drawSign(px,0,0,time);px.restore();return;}
  if(n.portrait==='pool'){const gr=px.createRadialGradient(size/2,size/2,4,size/2,size/2,size*.6);gr.addColorStop(0,'#8fd0e6');gr.addColorStop(1,'#2f6f86');px.fillStyle=gr;px.fillRect(0,0,size,size);px.strokeStyle='rgba(255,255,255,.5)';px.lineWidth=1.5;for(let i=1;i<4;i++){px.beginPath();px.ellipse(size/2,size/2,i*9,i*5,0,0,TAU);px.stroke();}return;}
  if(n.portrait==='stone'){px.save();px.translate(size/2,size-6);px.scale(1.2,1.2);drawLightStone(px,0,0,time);px.restore();return;}
  px.save();px.translate(size/2,size+60);px.scale(2.7,2.7);personFront(px,n.look,0);px.restore();
}

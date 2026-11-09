// الليل والنهار
'use strict';

/* =========================================================
   DAY & NIGHT
   ========================================================= */
const DAY_RATE=4; // game minutes per real second (a full day lasts 6 minutes)
const hourNow=()=>((P.clock??540)%1440)/60;
function nightAmount(h=hourNow()){
  if(h>=6&&h<17)return 0;
  if(h>=17&&h<19.5)return (h-17)/2.5;
  if(h>=4.5&&h<6)return 1-(h-4.5)/1.5;
  return 1;
}
function duskAmount(h=hourNow()){return h>=16.5&&h<19.5?Math.sin((h-16.5)/3*Math.PI):h>=5&&h<6.5?Math.sin((h-5)/1.5*Math.PI)*.6:0;}
function phaseName(h=hourNow()){return h<5?'الليل':h<6.5?'الفجر':h<11.5?'الصباح':h<14.5?'الظهيرة':h<17?'العصر':h<19.5?'المغرب':'الليل';}
const isNight=()=>nightAmount()>.6;
let nightCv=null;
function sceneLights(){
  const L=[],push=(x,y,r,a=1)=>L.push([x,y,r,a]);
  if(scene.id==='village'){
    MAP.lamps.forEach(l=>push(l.x,l.y-52,82));
    MAP.houses.forEach(h=>{if(h.lantern)push(h.lantern.x,h.lantern.y,52);[.2,.8].forEach(k=>push(h.x+h.w*k,h.base-h.wallH+28,46,.8));});
    if(!dryVillage())push(MAP.fountain.x,MAP.fountain.y-20,70,.45);
    if(chapterDone&&!P.flags.boss)push(576,40,110,.9);
  }else if(scene.forest){push(FOREST.stone.x,FOREST.stone.y-30,P.flags.boss?70:150);}
  else if(scene.fort){FORT.braziers.forEach(b=>push(b.x,b.y-34,110));if(!P.flags.boss3)push(FORT.altar.x,FORT.altar.y-50,90);push(FORT.well.x,FORT.well.y,40,.4);}
  else if(scene.wadi){push(WADI.spring.x,WADI.spring.y-10,P.flags.gates?120:60,.8);WADI.gates.forEach(g=>push(g.x,150,30,.4));}
  for(const pk of PICKUPS)if(pk.scene===scene.id&&pickupActive(pk))push(pk.x,pk.y-10,40,.9);
  push(hero.x,hero.y-20,70,.75);
  return L;
}
function drawNight(g,cx,cy){
  if(scene.interior)return;
  const n=nightAmount()*(scene.forest?1.05:1),du=duskAmount();
  if(n<.02&&du<.02)return;
  const z=view.zoom,q=OPT.quality==='saver'?.35:.5,w=Math.ceil(view.w*q),h=Math.ceil(view.h*q);
  if(!nightCv)nightCv=document.createElement('canvas');
  if(nightCv.width!==w||nightCv.height!==h){nightCv.width=w;nightCv.height=h;}
  const c=nightCv.getContext('2d');c.globalCompositeOperation='source-over';c.clearRect(0,0,w,h);
  if(du>.02){c.fillStyle=`rgba(255,120,50,${.16*du})`;c.fillRect(0,0,w,h);}
  if(n>.02){
    c.fillStyle=`rgba(10,16,44,${Math.min(.68,n*.68)})`;c.fillRect(0,0,w,h);
    c.globalCompositeOperation='destination-out';
    for(const [x,y,r,a] of sceneLights()){
      const sx=(x-cx)*z*q,sy=(y-cy)*z*q,sr=r*z*q*(.9+.06*Math.sin(time*7+x));
      if(sx<-sr||sy<-sr||sx>w+sr||sy>h+sr)continue;
      const gr=c.createRadialGradient(sx,sy,0,sx,sy,sr);gr.addColorStop(0,`rgba(0,0,0,${.9*a})`);gr.addColorStop(.55,`rgba(0,0,0,${.45*a})`);gr.addColorStop(1,'rgba(0,0,0,0)');
      c.fillStyle=gr;c.fillRect(sx-sr,sy-sr,sr*2,sr*2);
    }
    c.globalCompositeOperation='source-over';
  }
  g.save();g.setTransform(1,0,0,1,0,0);g.imageSmoothingEnabled=true;g.drawImage(nightCv,0,0,canvas.width,canvas.height);
  if(n>.3&&!scene.wadi){ // warm glow on light sources
    g.globalCompositeOperation='lighter';
    for(const [x,y,r,a] of sceneLights()){const sx=(x-cx)*z*view.dpr,sy=(y-cy)*z*view.dpr,sr=r*.5*z*view.dpr;if(sx<-sr||sy<-sr||sx>canvas.width+sr||sy>canvas.height+sr)continue;
      const gr=g.createRadialGradient(sx,sy,0,sx,sy,sr);gr.addColorStop(0,`rgba(255,170,70,${.12*n*a})`);gr.addColorStop(1,'rgba(255,170,70,0)');g.fillStyle=gr;g.fillRect(sx-sr,sy-sr,sr*2,sr*2);}
    g.globalCompositeOperation='source-over';
  }
  if(n>.5&&fxOn()){ // stars over the top edge
    g.fillStyle=`rgba(255,250,220,${.6*n})`;
    for(let i=0;i<18;i++){const sx=((i*137.5+cx*.05)%view.w)*view.dpr,sy=((i*61)%Math.min(120,view.h*.3))*view.dpr,tw=.5+.5*Math.sin(time*2+i);g.globalAlpha=.4+.6*tw;g.fillRect(sx,sy,1.6*view.dpr,1.6*view.dpr);}
    g.globalAlpha=1;
  }
  g.restore();
}
const fxOn=()=>OPT.quality!=='saver';
function waitUntil(hour,label){
  if(state!=='menu')return;
  closeMenu();state='fade';fadeEl.classList.add('on');
  setTimeout(()=>{P.clock=Math.floor(((P.clock??540)-((P.clock??540)%1440))+1440+hour*60);P.hp=null;P.mp=null;P.ally={hp:null,mp:null};fadeEl.classList.remove('on');state='play';showToast('note',label+'<small>استرحت فعادت إليكم الصحة والطاقة</small>',3);saveGame();},700);
}
const dryVillage=()=>!!P.flags.boss&&!P.flags.boss2;

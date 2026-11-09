// العناصر المرتبة حسب العمق والنافورة
'use strict';

/* =========================================================
   SPRITES & DRAWABLES
   ========================================================= */
let SPR=null;
function buildSprites(S){
  const R=mulberry(512);
  const s={houses:{},oak:[],pine:[],bush:[]};
  MAP.houses.forEach(h=>{s.houses[h.id]=makeSprite(S,h.w+48,h.wallH+h.roofH+40,24,h.wallH+h.roofH+32,g=>drawHouseStatic(g,h));});
  s.oakTrunk=makeSprite(S,20,34,10,32,drawOakTrunk);
  for(let i=0;i<3;i++)s.oak.push(makeSprite(S,90,84,45,74,g=>drawOakCanopy(g,R,OAK_PAL[i])));
  s.pineTrunk=makeSprite(S,10,16,5,14,drawPineTrunk);
  for(let i=0;i<2;i++)s.pine.push(makeSprite(S,72,90,36,80,g=>drawPineCanopy(g,PINE_PAL[i])));
  s.palmTrunk=makeSprite(S,26,84,10,82,drawPalmTrunk);
  s.palmCrown=makeSprite(S,96,70,48,40,drawPalmCrown);
  s.bush.push(makeSprite(S,44,34,22,30,g=>drawBush(g,R,false)));
  s.bush.push(makeSprite(S,44,34,22,30,g=>drawBush(g,R,true)));
  s.lamp=makeSprite(S,24,70,12,67,drawLamp);
  s.bench=makeSprite(S,50,30,25,27,drawBench);
  s.barrel=makeSprite(S,28,32,14,28,drawBarrel);
  s.crate=makeSprite(S,34,32,17,29,drawCrate);
  s.barricade=makeSprite(S,140,60,70,56,drawBarricade);
  s.basin=makeSprite(S,134,96,67,44,drawFountainBasin);
  s.pillar=makeSprite(S,50,66,25,62,drawFountainPillar);
  s.chest=makeSprite(S,46,34,23,31,drawChest);
  s.tray=makeSprite(S,38,28,19,24,drawTray);
  s.hearth=makeSprite(S,62,44,31,41,drawHearth);
  s.jar=makeSprite(S,26,30,13,28,drawJar);
  s.plant=makeSprite(S,26,36,13,33,drawPlant);
  s.bench2=makeSprite(S,84,38,42,36,drawWorkbench);
  s.loom=makeSprite(S,96,62,48,60,drawLoom);
  s.mabkhara=makeSprite(S,18,20,9,18,drawMabkhara);
  s.cat=makeSprite(S,30,18,15,15,drawCat);
  return s;
}

function villageStatics(){
  const L=[];const add=(y,x,b,draw)=>L.push({y,x,b,draw});
  MAP.houses.forEach(h=>add(h.base,h.x,[h.x-30,h.base-h.wallH-h.roofH-80,h.x+h.w+30,h.base+6],(g,t)=>{
    blit(g,SPR.houses[h.id],h.x,h.base);
    const f=.75+.25*Math.sin(t*9+h.x)*Math.sin(t*5.3);
    const gr=g.createRadialGradient(h.lantern.x,h.lantern.y,0,h.lantern.x,h.lantern.y,18);gr.addColorStop(0,`rgba(255,205,120,${.45*f})`);gr.addColorStop(1,'rgba(255,205,120,0)');g.fillStyle=gr;g.fillRect(h.lantern.x-18,h.lantern.y-18,36,36);
    for(let i=0;i<3;i++){const k=(t*.22+i/3)%1;g.fillStyle=`rgba(236,230,222,${.42*(1-k)*Math.min(1,k*5)})`;circ(g,h.smoke.x+Math.sin(t*1.3+i*2)*3+k*10,h.smoke.y-k*46,3.5+k*8);}
  }));
  MAP.trees.forEach(tr=>{
    if(tr.kind==='palm'){
      add(tr.y,tr.x,[tr.x-50,tr.y-130,tr.x+56,tr.y+4],(g,t)=>{
        blit(g,SPR.palmTrunk,tr.x,tr.y);
        g.save();g.translate(tr.x+6.8,tr.y-78);g.rotate(Math.sin(t*1.1+tr.phase)*.035);blit(g,SPR.palmCrown,0,0);g.restore();
      });return;
    }
    const pine=tr.kind==='pine';
    add(tr.y,tr.x,[tr.x-46,tr.y-110,tr.x+46,tr.y+4],(g,t)=>{
      blit(g,pine?SPR.pineTrunk:SPR.oakTrunk,tr.x,tr.y);
      const sway=Math.sin(t*1.25+tr.phase)*(pine?.012:.022)+Math.sin(t*2.7+tr.phase*2)*.007;
      g.save();g.translate(tr.x,tr.y-(pine?12:26));g.rotate(sway);
      blit(g,pine?SPR.pine[tr.v%2]:SPR.oak[tr.v%3],0,0);g.restore();
    });
  });
  [...MAP.bushes,...MAP.hedge].forEach((b,i)=>add(b.y,b.x,[b.x-24,b.y-32,b.x+24,b.y+4],g=>blit(g,SPR.bush[(b.v+i)%2],b.x,b.y)));
  MAP.lamps.forEach(l=>add(l.y,l.x,[l.x-30,l.y-90,l.x+30,l.y+4],(g,t)=>{
    blit(g,SPR.lamp,l.x,l.y);
    const f=.8+.2*Math.sin(t*7+l.phase)*Math.sin(t*3.1+l.phase);
    const gr=g.createRadialGradient(l.x,l.y-52,0,l.x,l.y-52,28);gr.addColorStop(0,`rgba(255,206,120,${.34*f})`);gr.addColorStop(1,'rgba(255,206,120,0)');g.fillStyle=gr;g.fillRect(l.x-28,l.y-80,56,56);
  }));
  MAP.benches.forEach(b=>add(b.y,b.x,[b.x-26,b.y-30,b.x+26,b.y+4],g=>blit(g,SPR.bench,b.x,b.y)));
  MAP.barrels.forEach(b=>add(b.y,b.x,[b.x-15,b.y-30,b.x+15,b.y+4],g=>blit(g,SPR.barrel,b.x,b.y)));
  MAP.crates.forEach(b=>add(b.y,b.x,[b.x-18,b.y-30,b.x+18,b.y+4],g=>blit(g,SPR.crate,b.x,b.y)));
  add(470,1112,[1080,400,1150,480],g=>{if(P.flags.ch3)return;g.fillStyle='#6f4a2b';[424,446,468].forEach(y=>{g.fillRect(1108,y-26,6,26);});g.strokeStyle='#b53e2c';g.lineWidth=2.4;g.beginPath();g.moveTo(1111,404);g.lineTo(1111,446);g.lineTo(1111,468);g.stroke();g.strokeStyle='#d9b27a';g.lineWidth=1.6;g.beginPath();[410,420].forEach(o=>{g.moveTo(1111,o);g.lineTo(1111,o+52);});g.stroke();g.fillStyle='#c99a5e';rr(g,1098,396,26,16,2);g.fill();g.strokeStyle='#b23a2a';g.lineWidth=2.2;g.beginPath();g.moveTo(1104,399);g.lineTo(1118,409);g.moveTo(1118,399);g.lineTo(1104,409);g.stroke();});
  const B=MAP.barricade;add(B.y,B.x,[B.x-72,B.y-60,B.x+72,B.y+4],g=>{if(!chapterDone)blit(g,SPR.barricade,B.x,B.y);});
  const Fo=MAP.fountain;add(Fo.y+30,Fo.x,[Fo.x-70,Fo.y-90,Fo.x+70,Fo.y+54],(g,t)=>drawFountain(g,Fo.x,Fo.y,t));
  MAP.fences.forEach(([a,b])=>{
    const len=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.round(len/24)),horiz=a[1]===b[1];
    for(let i=0;i<=n;i++){
      const x=a[0]+(b[0]-a[0])*i/n,y=a[1]+(b[1]-a[1])*i/n,px=a[0]+(b[0]-a[0])*(i-1)/n,py=a[1]+(b[1]-a[1])*(i-1)/n;
      add(y,x,[Math.min(x,px)-6,Math.min(y,py)-30,Math.max(x,px)+6,y+4],g=>{
        if(i>0){g.fillStyle='#9a6a3d';
          if(horiz){g.fillRect(px+2.6,y-18,x-px-5.2,3.4);g.fillRect(px+2.6,y-10.5,x-px-5.2,3.4);g.fillStyle='#bd8e58';g.fillRect(px+2.6,y-18,x-px-5.2,1);g.fillRect(px+2.6,y-10.5,x-px-5.2,1);}
          else{g.fillRect(x-1.7,py-18,3.4,y-py);g.fillRect(x-1.7,py-10.5,3.4,y-py);g.fillStyle='#bd8e58';g.fillRect(x-1.7,py-18,1,y-py+7.5);}
        }
        g.fillStyle='#6f4a2b';g.fillRect(x-2.7,y-23,5.4,23);g.fillStyle='#8f633a';g.fillRect(x-2.7,y-23,2,23);
        g.fillStyle='#57381f';poly(g,[x-2.7,y-23,x+2.7,y-23,x,y-26.5]);
      });
    }
  });
  return L;
}
const PROP_SPRITE={hearth:'hearth',tray:'tray',chest:'chest',jar:'jar',plant:'plant',bench:'bench2',loom:'loom',mabkhara:'mabkhara',cat:'cat'};
function interiorStatics(cfg){
  return cfg.props.map(p=>{
    const key=PROP_SPRITE[p.t],sc=p.s||1;
    return {y:p.t==='tray'||p.t==='cat'?p.y-6:p.y,x:p.x,b:[p.x-50,p.y-80,p.x+50,p.y+6],draw:(g,t)=>{
      if(sc!==1){g.save();g.translate(p.x,p.y);g.scale(sc,sc);blit(g,SPR[key],0,0);g.restore();}else blit(g,SPR[key],p.x,p.y);
      if(p.t==='hearth'){
        for(let i=0;i<3;i++){const fl=Math.sin(t*12+i*2)*1.4,h=7+Math.sin(t*9+i)*2;g.fillStyle=i===1?'#ffd36b':'#f07a2e';g.beginPath();g.moveTo(p.x-10+i*7,p.y-5);g.quadraticCurveTo(p.x-7+i*7+fl,p.y-5-h*1.6,p.x-4+i*7,p.y-5);g.closePath();g.fill();}
        const gr=g.createRadialGradient(p.x,p.y-8,0,p.x,p.y-8,40);gr.addColorStop(0,`rgba(255,150,60,${.25+.05*Math.sin(t*10)})`);gr.addColorStop(1,'rgba(255,150,60,0)');g.fillStyle=gr;g.fillRect(p.x-40,p.y-48,80,80);
        for(let i=0;i<3;i++){const k=(t*.35+i/3)%1;g.fillStyle=`rgba(245,240,232,${.35*(1-k)})`;circ(g,p.x+Math.sin(t+i*2)*3,p.y-40-k*30,2.5+k*5);}
      }else if(p.t==='mabkhara'){
        for(let i=0;i<4;i++){const k=(t*.3+i/4)%1;g.fillStyle=`rgba(240,236,228,${.4*(1-k)*Math.min(1,k*6)})`;circ(g,p.x+Math.sin(t*1.6+i*1.7+k*4)*(2+k*5),p.y-18-k*42,2+k*5);}
        const gr=g.createRadialGradient(p.x,p.y-15,0,p.x,p.y-15,14);gr.addColorStop(0,`rgba(255,140,60,${.3+.1*Math.sin(t*8)})`);gr.addColorStop(1,'rgba(255,140,60,0)');g.fillStyle=gr;g.fillRect(p.x-14,p.y-29,28,28);
      }
    }};
  });
}
function drawFountain(g,x,y,t){
  blit(g,SPR.basin,x,y);
  if(dryVillage()){g.fillStyle='#5a5348';ell(g,x,y,50,29.4);g.fill();g.fillStyle='rgba(60,110,130,.7)';ell(g,x+8,y+6,22,10);g.fill();blit(g,SPR.pillar,x,y);return;}
  g.save();ell(g,x,y,50,29.4);g.clip();
  const wg=g.createLinearGradient(x,y-30,x,y+30);wg.addColorStop(0,'#4f9fb8');wg.addColorStop(1,'#2f7896');
  g.fillStyle=wg;g.fillRect(x-52,y-31,104,62);
  g.lineWidth=1.3;
  for(let i=0;i<3;i++){const k=(t*.42+i/3)%1,r=10+k*42;g.strokeStyle=`rgba(225,246,255,${.55*(1-k)})`;ell(g,x,y+2,r,r*.58);g.stroke();}
  g.fillStyle='rgba(255,255,255,.75)';
  for(let i=0;i<6;i++){const a=t*.3+i*1.05,r2=22+12*Math.sin(t*.7+i);g.globalAlpha=.5+.5*Math.sin(t*3+i*2);g.fillRect(x+Math.cos(a)*r2,y+Math.sin(a)*r2*.55,2.4,1);}
  g.globalAlpha=1;g.restore();
  blit(g,SPR.pillar,x,y);
  g.lineCap='round';g.lineWidth=1.8;g.setLineDash([5,4]);g.lineDashOffset=-t*26;
  for(let i=0;i<8;i++){const a=i/8*TAU+.2,sx=x+Math.cos(a)*18,sy=y-42+Math.sin(a)*6,ex=x+Math.cos(a)*36,ey=y+Math.sin(a)*21;
    g.strokeStyle=Math.sin(a)<0?'rgba(210,240,255,.45)':'rgba(230,248,255,.75)';
    g.beginPath();g.moveTo(sx,sy);g.quadraticCurveTo(x+Math.cos(a)*33,sy-6,ex,ey);g.stroke();}
  g.strokeStyle='rgba(235,250,255,.85)';g.lineWidth=1.6;g.beginPath();g.moveTo(x,y-60);g.quadraticCurveTo(x-6,y-72,x-12,y-46);g.moveTo(x,y-60);g.quadraticCurveTo(x+6,y-72,x+12,y-46);g.stroke();
  g.setLineDash([]);
  g.fillStyle='rgba(240,252,255,.8)';
  for(let i=0;i<5;i++){const k=(t*.9+i/5)%1;circ(g,x+Math.cos(i*1.3)*(10+k*14),y-62+k*20+k*k*10,1);}
}

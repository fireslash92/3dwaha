// رسم أرضية القرية والبيوت مسبقًا
'use strict';

/* =========================================================
   GROUND builders (prerendered per scene)
   ========================================================= */
function buildVillageGround(S){
  const cv=document.createElement('canvas');cv.width=Math.ceil(VW*S);cv.height=Math.ceil(VH*S);
  const g=cv.getContext('2d');g.scale(S,S);
  const R=mulberry(99);
  g.fillStyle='#86ad4c';g.fillRect(0,0,VW,VH);
  for(let i=0;i<130;i++){const x=R()*VW,y=R()*VH,r=30+R()*70,light=R()<.5;const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,light?'rgba(176,204,98,.38)':'rgba(70,110,45,.28)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2);}
  const band=(x0,y0,x1,y1,a)=>{const lg=g.createLinearGradient(x0,y0,x1,y1);lg.addColorStop(0,`rgba(36,60,30,${a})`);lg.addColorStop(1,'rgba(36,60,30,0)');return lg;};
  g.fillStyle=band(0,0,0,180,.85);g.fillRect(0,0,VW,180);
  g.fillStyle=band(0,0,120,0,.6);g.fillRect(0,0,120,VH);
  g.fillStyle=band(VW,0,VW-120,0,.6);g.fillRect(VW-120,0,120,VH);
  g.fillStyle=band(0,VH,0,VH-80,.55);g.fillRect(0,VH-80,VW,80);
  ['#6f9a3e','#9bc25e','#7ba647','#5f8a35'].forEach(c=>{
    g.strokeStyle=c;g.lineWidth=.9;g.beginPath();
    for(let i=0;i<1500;i++){const x=R()*VW,y=R()*VH;g.moveTo(x,y);g.lineTo(x-1.2,y-3.2);g.moveTo(x,y);g.lineTo(x+1,y-3.6);g.moveTo(x+.2,y);g.lineTo(x+.3,y-2.6);}
    g.stroke();
  });
  g.lineCap='round';g.lineJoin='round';
  const strokePaths=(extra,col)=>{g.strokeStyle=col;MAP.paths.forEach(p=>{g.lineWidth=p.w+extra;g.beginPath();p.pts.forEach((q,i)=>i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.stroke();});};
  const P=MAP.plaza,L=MAP.lookout;
  strokePaths(12,'rgba(150,118,74,.5)');
  g.fillStyle='rgba(150,118,74,.5)';ell(g,P.x,P.y,P.rx+9,P.ry+9);g.fill();ell(g,L.x,L.y,L.r+8,L.r+8);g.fill();
  strokePaths(0,'#a69882');
  g.fillStyle='#ab9e88';ell(g,P.x,P.y,P.rx,P.ry);g.fill();ell(g,L.x,L.y,L.r,L.r);g.fill();
  const shades=['#cdbfa6','#c3b49a','#d6cab3','#bba98e','#c9bba0','#d1c3a8'];
  const stone=(x,y,w,h,c)=>{g.fillStyle=c;rr(g,x,y,w,h,2.4);g.fill();g.fillStyle='rgba(88,70,50,.34)';g.fillRect(x+1,y+h-1.7,w-2,1.7);g.fillStyle='rgba(255,250,235,.32)';g.fillRect(x+2,y+.7,w-4,1);};
  for(let y=-26,row=0;y<VH;y+=10,row++){const off=(row&1)*8;for(let x=-16+off;x<VW;x+=16){const cx=x+8,cy=y+5;if(!MAP.onRoad(cx,cy,-3))continue;if(MAP.onPlaza(cx,cy,-6)||MAP.onLookout(cx,cy,-5))continue;stone(x+1,y+1,14-R()*1.5,8.2,shades[(R()*shades.length)|0]);}}
  const rings=(cx,cy,rmax,sy)=>{
    g.save();g.translate(cx,cy);g.scale(1,sy);
    for(let r=8;r<rmax-2;r+=11){
      const n=Math.max(6,Math.round(TAU*r/17)),a0=R()*TAU,isCurb=r+11>=rmax-2;
      for(let i=0;i<n;i++){
        const a1=a0+i*TAU/n+.03,a2=a0+(i+1)*TAU/n-.03;
        g.beginPath();g.arc(0,0,r+10,a1,a2);g.arc(0,0,r+1,a2,a1,true);g.closePath();
        g.fillStyle=isCurb?'#a89a82':shades[(R()*shades.length)|0];g.fill();
        g.strokeStyle='rgba(90,72,52,.32)';g.lineWidth=1;g.stroke();
      }
    }
    g.restore();
  };
  rings(P.x,P.y,P.rx,P.ry/P.rx);rings(L.x,L.y,L.r,1);
  // falaj: the stone water channel that feeds the fountain
  const F=MAP.falaj;
  g.fillStyle='#8f8473';g.fillRect(F.x,F.y,F.w,F.h);
  g.fillStyle='#b3a690';g.fillRect(F.x,F.y,3,F.h);g.fillRect(F.x+F.w-3,F.y,3,F.h);
  g.fillStyle='#3d84a0';g.fillRect(F.x+4,F.y,F.w-8,F.h-4);
  g.fillStyle='rgba(255,255,255,.12)';g.fillRect(F.x+4,F.y,2,F.h-4);
  g.strokeStyle='rgba(70,60,48,.5)';g.lineWidth=.8;g.beginPath();for(let y=F.y+10;y<F.y+F.h;y+=14){g.moveTo(F.x,y);g.lineTo(F.x+3,y);g.moveTo(F.x+F.w-3,y+7);g.lineTo(F.x+F.w,y+7);}g.stroke();
  g.fillStyle='#a89a82';rr(g,F.x-3,F.y+F.h-6,F.w+6,9,3);g.fill();
  const flower=(x,y,col)=>{g.fillStyle='#4e7d33';ell(g,x-1.7,y+1.2,2.2,1.1);g.fill();ell(g,x+1.7,y+1.5,2.2,1.1);g.fill();g.fillStyle=col;for(let k=0;k<5;k++){const a=k*TAU/5;circ(g,x+Math.cos(a)*1.5,y-1.5+Math.sin(a)*1.2,1.25);}g.fillStyle='#f6dd6a';circ(g,x,y-1.5,.8);};
  const inFalaj=(x,y)=>x>F.x-3&&x<F.x+F.w+3&&y>F.y-3&&y<F.y+F.h+3;
  const patch=(x,y,n,pal,sp=14)=>{for(let i=0;i<n;i++){const fx=x+(R()-.5)*sp*2,fy=y+(R()-.5)*sp;if(MAP.onAnyPath(fx,fy,3)||inFalaj(fx,fy))continue;flower(fx,fy,pal[(R()*pal.length)|0]);}};
  const warm=['#e8564a','#f4c84a','#fff4e6','#f29bb8'],cool=['#b98ad8','#fff4e6','#8fb2ea','#f4c84a'];
  [45,135,225,315].forEach((d,i)=>{const a=d*Math.PI/180;patch(P.x+Math.cos(a)*(P.rx+20),P.y+Math.sin(a)*(P.ry+18),14,i%2?warm:cool,16);});
  MAP.houses.forEach(h=>{patch(h.x+44,h.base+12,10,warm,12);patch(h.x+h.w-44,h.base+12,10,cool,12);});
  [[640,620],[500,600],[340,410],[820,500],[980,480],[420,240],[700,220],[300,620],[110,440],[1060,640]].forEach((p,i)=>patch(p[0],p[1],12,i%2?warm:cool,20));
  for(let i=0;i<260;i++){const x=70+R()*(VW-140),y=150+R()*(VH-240);if(MAP.onAnyPath(x,y,3)||inFalaj(x,y))continue;g.fillStyle=R()<.5?'#fffaf0':'#f7dd6b';circ(g,x,y,.9);}
  g.fillStyle='#9b8a5c';g.fillRect(764,604,248,152);
  [[778,842],[886,998]].forEach(([x0,x1])=>{
    [624,658,692,726].forEach((y,ri)=>{
      g.fillStyle='#8a6744';rr(g,x0,y-9,x1-x0,18,5);g.fill();
      g.strokeStyle='#6c4f33';g.lineWidth=1;g.beginPath();g.moveTo(x0+4,y-2);g.lineTo(x1-4,y-2);g.moveTo(x0+4,y+4);g.lineTo(x1-4,y+4);g.stroke();
      const col=['#e2534a','#f4c84a','#b98ad8','#fff1dc'][ri];
      for(let x=x0+6;x<x1-4;x+=8){g.strokeStyle='#4e7d33';g.lineWidth=1.2;g.beginPath();g.moveTo(x,y+4);g.lineTo(x,y-3);g.stroke();g.fillStyle='#5d9140';ell(g,x+2,y+1,2.4,1.1);g.fill();g.fillStyle=col;g.beginPath();g.moveTo(x-2.4,y-3);g.lineTo(x-2.4,y-7);g.lineTo(x-1,y-5.6);g.lineTo(x,y-7.6);g.lineTo(x+1,y-5.6);g.lineTo(x+2.4,y-7);g.lineTo(x+2.4,y-3);g.quadraticCurveTo(x,y-1.4,x-2.4,y-3);g.fill();}
    });
  });
  MAP.houses.forEach(h=>{const sg=g.createLinearGradient(0,h.base-2,0,h.base+20);sg.addColorStop(0,'rgba(36,30,12,.38)');sg.addColorStop(1,'rgba(36,30,12,0)');g.fillStyle=sg;poly(g,[h.x-6,h.base-2,h.x+h.w+8,h.base-2,h.x+h.w+26,h.base+20,h.x+6,h.base+20]);
    softShadow(g,h.x+h.w+12,h.base-30,22,40,.22);});
  MAP.trees.forEach(t=>t.kind==='oak'?softShadow(g,t.x+8,t.y+2,30,11,.36):t.kind==='palm'?softShadow(g,t.x+16,t.y+2,26,9,.3):softShadow(g,t.x+6,t.y+1,22,9,.36));
  softShadow(g,MAP.fountain.x+8,MAP.fountain.y+16,76,46,.3);
  MAP.lamps.forEach(l=>softShadow(g,l.x+4,l.y+1,9,4,.4));
  MAP.benches.forEach(b=>softShadow(g,b.x+3,b.y+2,26,6,.35));
  MAP.barrels.forEach(b=>softShadow(g,b.x+3,b.y+1,14,5,.4));
  MAP.crates.forEach(b=>softShadow(g,b.x+3,b.y+1,18,6,.4));
  [...MAP.bushes,...MAP.hedge].forEach(b=>softShadow(g,b.x+3,b.y+1,16,5,.35));
  softShadow(g,MAP.barricade.x+4,MAP.barricade.y+2,70,8,.35);
  g.strokeStyle='rgba(30,30,12,.18)';g.lineWidth=4;g.lineCap='round';
  MAP.fences.forEach(([a,b])=>{g.beginPath();g.moveTo(a[0]+3,a[1]+3);g.lineTo(b[0]+3,b[1]+3);g.stroke();});
  return cv;
}

function buildInteriorGround(S,cfg){
  const cv=document.createElement('canvas');cv.width=Math.ceil(IW*S);cv.height=Math.ceil(IH*S);
  const g=cv.getContext('2d');g.scale(S,S);
  const R=mulberry(cfg.name.length*131+cfg.window.x);
  g.fillStyle=cfg.floor[0];g.fillRect(0,WALL,IW,IH-WALL);
  for(let y=WALL;y<IH;y+=28)for(let x=(((y-WALL)/28)&1)*14-14;x<IW;x+=28){g.fillStyle=R()<.5?cfg.floor[1]:cfg.floor[0];g.fillRect(x+1,y+1,26,26);}
  g.strokeStyle='rgba(120,90,55,.25)';g.lineWidth=1;g.beginPath();for(let y=WALL;y<IH;y+=28){g.moveTo(0,y);g.lineTo(IW,y);}g.stroke();
  const wx=cfg.window.x+28;const lp=g.createLinearGradient(0,WALL,0,WALL+150);lp.addColorStop(0,'rgba(255,226,160,.35)');lp.addColorStop(1,'rgba(255,226,160,0)');
  g.fillStyle=lp;poly(g,[wx-26,WALL,wx+26,WALL,wx+70,WALL+150,wx+10,WALL+150]);
  // rug, woven in the sadu way
  const r=cfg.rug;
  g.fillStyle='rgba(40,20,10,.25)';g.fillRect(r.x+3,r.y+4,r.w,r.h);
  g.fillStyle=r.base;g.fillRect(r.x,r.y,r.w,r.h);
  g.fillStyle=r.band;g.fillRect(r.x,r.y,r.w,8);g.fillRect(r.x,r.y+r.h-8,r.w,8);
  g.fillStyle=r.acc;for(let x=r.x;x<r.x+r.w-6;x+=8){poly(g,[x,r.y+8,x+4,r.y+2,x+8,r.y+8]);poly(g,[x,r.y+r.h-8,x+4,r.y+r.h-2,x+8,r.y+r.h-8]);}
  g.fillStyle=r.gold;g.fillRect(r.x,r.y+11,r.w,2);g.fillRect(r.x,r.y+r.h-13,r.w,2);
  const my=r.y+r.h/2;
  for(let x=r.x+18;x<r.x+r.w-12;x+=26){g.fillStyle=r.band;poly(g,[x,my-14,x+10,my,x,my+14,x-10,my]);g.fillStyle=r.acc;poly(g,[x,my-8,x+6,my,x,my+8,x-6,my]);g.fillStyle=r.gold;poly(g,[x,my-3,x+2.4,my,x,my+3,x-2.4,my]);}
  g.strokeStyle=r.acc;g.lineWidth=1;g.beginPath();for(let x=r.x+2;x<r.x+r.w;x+=4){g.moveTo(x,r.y);g.lineTo(x,r.y-3);g.moveTo(x,r.y+r.h);g.lineTo(x,r.y+r.h+3);}g.stroke();
  // back wall with palm-beam ceiling ends, niches, lattice window, lanterns
  const wg=g.createLinearGradient(0,0,0,WALL);wg.addColorStop(0,cfg.wall[1]);wg.addColorStop(.3,cfg.wall[0]);wg.addColorStop(1,cfg.wall[1]);
  g.fillStyle=wg;g.fillRect(0,0,IW,WALL);
  for(let i=0;i<120;i++){g.fillStyle=R()<.5?'rgba(255,255,255,.06)':'rgba(120,90,50,.06)';circ(g,R()*IW,14+R()*(WALL-20),1+R()*3);}
  g.fillStyle='#4c311d';g.fillRect(0,0,IW,12);
  for(let x=10;x<IW;x+=22){g.fillStyle='#6a4529';circ(g,x,13,4.2);g.fillStyle='#4c311d';circ(g,x,13,2);}
  g.fillStyle='#b99a6e';g.fillRect(0,WALL-9,IW,9);g.fillStyle='rgba(255,255,255,.2)';g.fillRect(0,WALL-9,IW,1.2);
  cfg.niches.forEach(nx=>{
    g.fillStyle='rgba(90,60,30,.35)';g.beginPath();g.moveTo(nx,70);g.lineTo(nx,40);g.arc(nx+15,40,15,Math.PI,0);g.lineTo(nx+30,70);g.closePath();g.fill();
    g.fillStyle='#c8a97b';g.beginPath();g.moveTo(nx+2,70);g.lineTo(nx+2,41);g.arc(nx+15,41,13,Math.PI,0);g.lineTo(nx+28,70);g.closePath();g.fill();
    g.fillStyle='#a8713e';g.beginPath();g.moveTo(nx+9,70);g.quadraticCurveTo(nx+5,60,nx+11,54);g.lineTo(nx+19,54);g.quadraticCurveTo(nx+25,60,nx+21,70);g.closePath();g.fill();
    g.fillStyle='#d9ae4f';g.fillRect(nx+11,50,8,4);
  });
  const W0=cfg.window.x;
  g.fillStyle='#5b3820';g.fillRect(W0-4,22,64,56);
  g.fillStyle='#ffe2a2';g.fillRect(W0,26,56,48);
  g.strokeStyle='#6e4527';g.lineWidth=2;g.beginPath();
  for(let k=0;k<=56;k+=8){g.moveTo(W0+k,26);g.lineTo(W0+k,74);}for(let k=0;k<=48;k+=8){g.moveTo(W0,26+k);g.lineTo(W0+56,26+k);}g.stroke();
  g.save();g.beginPath();g.rect(W0,26,56,48);g.clip();g.strokeStyle='rgba(110,69,39,.55)';g.lineWidth=1;g.beginPath();for(let k=-48;k<64;k+=8){g.moveTo(W0+k,26);g.lineTo(W0+k+48,74);g.moveTo(W0+k+48,26);g.lineTo(W0+k,74);}g.stroke();g.restore();
  g.fillStyle='#8a6a48';g.fillRect(W0-6,76,68,4);
  cfg.lanterns.forEach(lx=>{g.strokeStyle='#2f2924';g.lineWidth=1.2;g.beginPath();g.moveTo(lx,30);g.lineTo(lx,38);g.stroke();g.fillStyle='#3a2f26';poly(g,[lx-6,38,lx+6,38,lx,33]);g.fillRect(lx-5,38,10,12);g.fillStyle='#ffd88a';g.fillRect(lx-3.4,39.6,6.8,8.6);g.fillStyle='#3a2f26';g.fillRect(lx-6,50,12,2);});
  const side=(x,w,flip)=>{const sg=g.createLinearGradient(x,0,x+w,0);sg.addColorStop(flip?1:0,'#a98a5f');sg.addColorStop(flip?0:1,'#c9ad82');g.fillStyle=sg;g.fillRect(x,0,w,IH);g.fillStyle='#e6cfa3';g.fillRect(flip?x:x+w-2,0,2,IH);};
  side(0,22,false);side(IW-22,22,true);
  // majlis floor cushions
  const cushStripe=(x,y,w,h,vertical)=>{
    g.fillStyle='rgba(40,20,10,.25)';g.fillRect(x+2,y+3,w,h);
    g.fillStyle=cfg.cush[0];rr(g,x,y,w,h,3);g.fill();
    g.fillStyle=cfg.cush[1];
    if(vertical){for(let yy=y+6;yy<y+h-4;yy+=12)g.fillRect(x+2,yy,w-4,2);}else{for(let xx=x+6;xx<x+w-4;xx+=12)g.fillRect(xx,y+2,2,h-4);}
    g.fillStyle=cfg.cush[2];if(vertical)g.fillRect(x+w/2-1,y+2,2,h-4);else g.fillRect(x+2,y+h/2-1,w-4,2);
  };
  cfg.cushions.forEach(c=>{
    if(c.side==='back'){
      for(let x=c.a;x<c.b-4;x+=22){g.fillStyle=cfg.cush[2];rr(g,x+1,WALL-22,20,20,5);g.fill();g.fillStyle=cfg.cush[1];g.fillRect(x+4,WALL-14,14,2);}
      cushStripe(c.a,WALL-2,c.b-c.a,18,false);
    }else cushStripe(c.side==='left'?22:IW-42,c.a,20,c.b-c.a,true);
  });
  // near wall (cut away) with doorway and palm-frond mat
  g.fillStyle='#c4a57a';g.fillRect(0,IH-14,GAP0,14);g.fillRect(GAP1,IH-14,IW-GAP1,14);
  g.fillStyle='#e0c497';g.fillRect(0,IH-14,GAP0,2);g.fillRect(GAP1,IH-14,IW-GAP1,2);
  g.fillStyle='#6a4529';g.fillRect(GAP0-4,IH-18,6,18);g.fillRect(GAP1-2,IH-18,6,18);
  g.fillStyle='#b8955a';rr(g,GAP0+4,IH-34,GAP1-GAP0-8,22,3);g.fill();
  g.strokeStyle='rgba(110,80,40,.5)';g.lineWidth=1;g.beginPath();for(let y=IH-31;y<IH-13;y+=3.2){g.moveTo(GAP0+6,y);g.lineTo(GAP1-6,y);}g.stroke();
  const vg=g.createRadialGradient(IW/2,IH*.6,60,IW/2,IH*.6,IW*.7);vg.addColorStop(0,'rgba(40,20,5,0)');vg.addColorStop(1,'rgba(40,20,5,.28)');g.fillStyle=vg;g.fillRect(0,0,IW,IH);
  cfg.props.forEach(p=>{const big=p.t==='hearth'||p.t==='bench'||p.t==='loom';softShadow(g,p.x+3,p.y+1,big?44:16,big?9:6,.35);});
  return cv;
}

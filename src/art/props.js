// رسم البيوت والأشجار والأثاث
'use strict';

/* =========================================================
   ART: static sprites (cached at render resolution)
   ========================================================= */
function makeSprite(S,w,h,ox,oy,fn){
  const cv=document.createElement('canvas');cv.width=Math.max(1,Math.ceil(w*S));cv.height=Math.max(1,Math.ceil(h*S));
  const g=cv.getContext('2d');g.scale(S,S);g.translate(ox,oy);fn(g);return {cv,w,h,ox,oy};
}
function blit(g,s,x,y){g.drawImage(s.cv,x-s.ox,y-s.oy,s.w,s.h);}

function drawHouseStatic(g,h){
  const W=h.w,top=-h.wallH,Td='#5b3820',T='#76492a';
  g.fillStyle='#857b70';g.fillRect(-2,-9,W+4,9);
  g.strokeStyle='rgba(60,48,38,.45)';g.lineWidth=.9;g.beginPath();g.moveTo(-2,-4.5);g.lineTo(W+2,-4.5);
  for(let x=4;x<W;x+=14){g.moveTo(x,-9);g.lineTo(x,-4.5);g.moveTo(x+7,-4.5);g.lineTo(x+7,0);}g.stroke();
  const wg=g.createLinearGradient(0,top,0,-9);wg.addColorStop(0,'#f6e7c8');wg.addColorStop(1,'#e2c99c');
  g.fillStyle=wg;g.fillRect(0,top,W,h.wallH-9);
  g.fillStyle=T;g.fillRect(0,top,6,h.wallH-9);g.fillRect(W-6,top,6,h.wallH-9);g.fillRect(0,top,W,6);g.fillRect(0,top+50,W,5);
  g.strokeStyle=T;g.lineWidth=4;g.beginPath();g.moveTo(6,top+50);g.lineTo(22,top+6);g.moveTo(W-6,top+50);g.lineTo(W-22,top+6);g.stroke();
  const dx=W*h.door,dw=30,dh=46,dt=-9-dh+dw/2;
  g.fillStyle=T;g.fillRect(dx-dw/2-7,top+6,5,h.wallH-15);g.fillRect(dx+dw/2+2,top+6,5,h.wallH-15);
  [W*.2,W*.8].forEach(cx=>{
    const y=top+15;
    g.fillStyle=h.trim;rr(g,cx-25,y,9,26,1.5);g.fill();rr(g,cx+16,y,9,26,1.5);g.fill();
    g.strokeStyle='rgba(0,0,0,.22)';g.lineWidth=.8;g.beginPath();for(let k=4;k<26;k+=4){g.moveTo(cx-24,y+k);g.lineTo(cx-17,y+k);g.moveTo(cx+17,y+k);g.lineTo(cx+24,y+k);}g.stroke();
    g.fillStyle=Td;g.fillRect(cx-16,y,32,26);
    const gl=g.createLinearGradient(0,y,0,y+26);gl.addColorStop(0,'#ffe6a8');gl.addColorStop(1,'#f0a248');
    g.fillStyle=gl;g.fillRect(cx-13.5,y+2.5,27,21);
    g.fillStyle=Td;g.fillRect(cx-1,y+2,2,22);g.fillRect(cx-14,y+12,28,2);
    g.fillStyle='rgba(255,255,255,.35)';poly(g,[cx-12,y+11,cx-7,y+3,cx-4,y+3,cx-9,y+11]);
    g.fillStyle='#9a8670';g.fillRect(cx-18,y+26,36,3);
    g.fillStyle='#7d5434';g.fillRect(cx-15,y+29,30,6);
    g.fillStyle='#4f7f33';for(let k=-13;k<14;k+=4){ell(g,cx+k,y+29,2.4,1.6);g.fill();}
    const fc=['#e04f45','#f3a6c0','#f6d35a','#ffffff'];
    for(let k=-12,i=0;k<14;k+=5,i++){g.fillStyle=fc[i%4];circ(g,cx+k,y+27.6,1.7);}
  });
  g.fillStyle=Td;g.beginPath();g.moveTo(dx-dw/2-2,-9);g.lineTo(dx-dw/2-2,dt);g.arc(dx,dt,dw/2+2,Math.PI,0);g.lineTo(dx+dw/2+2,-9);g.closePath();g.fill();
  g.fillStyle='#8c5631';g.beginPath();g.moveTo(dx-dw/2,-9);g.lineTo(dx-dw/2,dt);g.arc(dx,dt,dw/2,Math.PI,0);g.lineTo(dx+dw/2,-9);g.closePath();g.fill();
  g.strokeStyle='rgba(60,32,14,.5)';g.lineWidth=1;g.beginPath();for(let k=-9;k<=9;k+=6){g.moveTo(dx+k,-9);g.lineTo(dx+k,dt-Math.sqrt(Math.max(0,225-k*k))+1);}g.stroke();
  g.fillStyle='#3d3029';g.fillRect(dx-dw/2,-24,dw,2.4);g.fillRect(dx-dw/2,-44,dw,2.4);
  g.fillStyle='#e6b453';circ(g,dx+9,-30,1.9);
  g.fillStyle='#bcae97';rr(g,dx-21,-4,42,6,2.5);g.fill();
  const lx=dx+dw/2+15,ly=top+24;
  g.strokeStyle='#2f2924';g.lineWidth=1.6;g.beginPath();g.moveTo(dx+dw/2+7,ly-4);g.lineTo(lx,ly-4);g.lineTo(lx,ly-1);g.stroke();
  g.fillStyle='#2f2924';g.fillRect(lx-4,ly-1,8,10);g.fillStyle='#ffd88a';g.fillRect(lx-2.6,ly+.6,5.2,6.8);
  h.lantern={x:h.x+lx,y:h.base+ly+4};
  const es=g.createLinearGradient(0,top,0,top+18);es.addColorStop(0,'rgba(70,38,18,.42)');es.addColorStop(1,'rgba(70,38,18,0)');
  g.fillStyle=es;g.fillRect(0,top,W,18);
  const ov=14,eaveY=top+6,ridgeY=top-h.roofH;
  g.fillStyle=h.roof[1];poly(g,[-ov+10,ridgeY,W+ov-10,ridgeY,W+ov-18,ridgeY-11,-ov+18,ridgeY-11]);
  g.fillStyle='rgba(40,10,0,.25)';g.fill();
  const roofPath=()=>{g.beginPath();g.moveTo(-ov,eaveY);g.lineTo(W+ov,eaveY);g.lineTo(W+ov-9,ridgeY);g.lineTo(-ov+9,ridgeY);g.closePath();};
  const rg=g.createLinearGradient(0,ridgeY,0,eaveY);rg.addColorStop(0,h.roof[0]);rg.addColorStop(1,h.roof[1]);
  roofPath();g.fillStyle=rg;g.fill();
  g.save();roofPath();g.clip();
  let row=0;
  for(let yy=ridgeY+8.5;yy<eaveY+9;yy+=8.5,row++){
    g.fillStyle='rgba(95,30,14,.30)';g.fillRect(-ov,yy-1.7,W+ov*2,1.7);
    g.strokeStyle='rgba(98,32,16,.42)';g.lineWidth=.9;g.beginPath();
    const off=(row&1)*6;
    for(let xx=-ov-12+off;xx<W+ov;xx+=12){g.moveTo(xx+12,yy-4.6);g.arc(xx+6,yy-4.6,6,0,Math.PI);}
    g.stroke();
    g.fillStyle='rgba(255,214,170,.2)';
    for(let xx=-ov-12+off;xx<W+ov;xx+=12)g.fillRect(xx+2,yy-7.8,4,1.1);
  }
  const lg=g.createLinearGradient(-ov,0,W+ov,0);lg.addColorStop(0,'rgba(255,228,185,.18)');lg.addColorStop(.6,'rgba(255,228,185,0)');lg.addColorStop(1,'rgba(60,18,6,.16)');
  g.fillStyle=lg;g.fillRect(-ov,ridgeY,W+ov*2,eaveY-ridgeY);
  g.restore();
  g.fillStyle='#7a2f1b';g.fillRect(-ov,eaveY-1.4,W+ov*2,3.6);
  g.fillStyle='#82321d';rr(g,-ov+6,ridgeY-3.6,W+ov*2-12,6.2,3);g.fill();
  g.fillStyle='rgba(255,200,160,.35)';g.fillRect(-ov+9,ridgeY-3,W+ov*2-18,1.2);
  const cx=W*.74;
  g.fillStyle='#9d9184';g.fillRect(cx-9,ridgeY-14,18,34);
  g.fillStyle='rgba(0,0,0,.18)';g.fillRect(cx+3,ridgeY-14,6,34);
  g.strokeStyle='rgba(60,50,40,.45)';g.lineWidth=.8;g.beginPath();for(let k=-10;k<20;k+=6){g.moveTo(cx-9,ridgeY+k);g.lineTo(cx+9,ridgeY+k);}g.stroke();
  g.fillStyle='#6f665c';g.fillRect(cx-11.5,ridgeY-18,23,5);g.fillStyle='#2b2520';g.fillRect(cx-6,ridgeY-18,12,2);
  h.smoke={x:h.x+cx,y:h.base+ridgeY-19};
}
const OAK_PAL=[{dark:'#345e2a',mid:'#4b7e34',light:'#69a043',hi:'#a6d06b'},{dark:'#3e5e25',mid:'#5c8433',light:'#7ea643',hi:'#c4d973'},{dark:'#2f5730',mid:'#457a3d',light:'#62994e',hi:'#9cc879'}];
const PINE_PAL=[{dark:'#264c34',light:'#3c754a',hi:'#5e9a63'},{dark:'#244a40',light:'#386e5a',hi:'#5c937b'}];
function drawOakTrunk(g){
  g.fillStyle='#6b4a2c';g.beginPath();g.moveTo(-7.5,0);g.quadraticCurveTo(-5,-4,-4.6,-12);g.lineTo(-4,-30);g.lineTo(4,-30);g.lineTo(4.6,-12);g.quadraticCurveTo(5,-4,7.5,0);g.closePath();g.fill();
  g.fillStyle='#523720';g.beginPath();g.moveTo(1.6,-30);g.lineTo(4,-30);g.lineTo(4.6,-12);g.quadraticCurveTo(5,-4,7.5,0);g.lineTo(2,0);g.closePath();g.fill();
  g.strokeStyle='rgba(40,24,10,.5)';g.lineWidth=.8;g.beginPath();g.moveTo(-1.5,-26);g.lineTo(-1,-14);g.moveTo(-3,-10);g.lineTo(-2.5,-3);g.stroke();
}
function drawOakCanopy(g,R,pal){
  const b=[{x:0,y:-32,r:21}];
  for(let i=0;i<8;i++){const a=i/8*TAU+R()*.4,d=15+R()*6;b.push({x:Math.cos(a)*d*1.06,y:-32+Math.sin(a)*d*.86,r:12+R()*5});}
  g.fillStyle=pal.dark;b.forEach(o=>circ(g,o.x+1.5,o.y+3,o.r));
  g.fillStyle=pal.mid;b.forEach(o=>circ(g,o.x,o.y,o.r*.93));
  g.fillStyle=pal.light;b.forEach(o=>{if(o.y<-30||o.x<-2)circ(g,o.x-2.6,o.y-3.6,o.r*.62);});
  g.fillStyle=pal.hi;for(let i=0;i<16;i++){const a=R()*TAU,d=R()*22;circ(g,Math.cos(a)*d-7,-40+Math.sin(a)*d*.7,1.3+R()*1.6);}
  g.strokeStyle=pal.dark;g.globalAlpha=.5;g.lineWidth=.8;g.beginPath();
  for(let i=0;i<28;i++){const a=R()*TAU,d=R()*26,x=Math.cos(a)*d,y=-32+Math.sin(a)*d*.8;g.moveTo(x+2.4,y);g.arc(x,y,2.4,0,Math.PI);}
  g.stroke();g.globalAlpha=1;
}
function drawPineTrunk(g){g.fillStyle='#5e4027';g.fillRect(-3,-13,6,13);g.fillStyle='#46301c';g.fillRect(.5,-13,2.5,13);}
function drawPineCanopy(g,pal){
  [{y:0,w:30,h:34},{y:-20,w:25,h:30},{y:-38,w:19,h:26},{y:-54,w:12,h:22}].forEach(t=>{
    const base=t.y+6,apex=base-t.h;
    g.fillStyle=pal.dark;g.beginPath();g.moveTo(0,apex);g.lineTo(t.w,base);
    for(let k=1;k<=6;k++){const x=t.w-2*t.w*k/6;g.lineTo(x+t.w/6,base+(k%2?2.5:0));g.lineTo(x,base);}
    g.closePath();g.fill();
    g.fillStyle=pal.light;poly(g,[0,apex,0,base+1.5,-t.w,base]);
    g.strokeStyle=pal.hi;g.lineWidth=1.1;g.beginPath();g.moveTo(-1,apex+3);g.lineTo(-t.w*.6,base-2);g.stroke();
  });
}
function drawPalmTrunk(g){
  for(let i=0;i<13;i++){
    const y0=-i*6,x0=Math.sin(i/13*1.3)*7,x1=Math.sin((i+1)/13*1.3)*7,w=5.2-i*.13;
    g.fillStyle=i%2?'#8a6a44':'#9e7c50';poly(g,[x0-w,y0,x0+w,y0,x1+w-.3,y0-6.4,x1-w+.3,y0-6.4]);
    g.fillStyle='rgba(60,40,20,.35)';poly(g,[x0-w,y0,x1,y0-4,x0+w,y0]);
  }
}
function drawPalmCrown(g){
  g.fillStyle='#c9782b';[[-4,5],[3,6],[-1,8],[5,3],[-6,2]].forEach(p=>circ(g,p[0],p[1],2.4));
  g.fillStyle='#e59a3f';[[-4,4],[3,5],[5,2]].forEach(p=>circ(g,p[0]-.6,p[1]-.6,1));
  [-3.0,-2.55,-2.05,-1.55,-1.05,-.55,-.15,.35,2.85].forEach((a,i)=>{
    const len=34+(i%3)*4,ex=Math.cos(a)*len,ey=Math.sin(a)*len*.62+14,cx=Math.cos(a)*len*.55,cy=Math.sin(a)*len*.62-12;
    g.strokeStyle=i%2?'#3d7638':'#4f8a43';g.lineWidth=2;g.lineCap='round';
    g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(cx,cy,ex,ey);g.stroke();
    g.strokeStyle=i%2?'#5c9a4c':'#6daa55';g.lineWidth=1.1;g.beginPath();
    for(let k=.15;k<.98;k+=.085){const u=1-k,px=2*u*k*cx+k*k*ex,py=2*u*k*cy+k*k*ey,tx=2*u*cx+2*k*(ex-cx),ty=2*u*cy+2*k*(ey-cy),tl=Math.hypot(tx,ty)||1,nx=-ty/tl,ny=tx/tl,l=5.5*(1-k*.6);
      g.moveTo(px,py);g.lineTo(px+nx*l+tx/tl*2,py+ny*l+ty/tl*2+1.5);g.moveTo(px,py);g.lineTo(px-nx*l+tx/tl*2,py-ny*l+ty/tl*2+1.5);}
    g.stroke();
  });
  g.fillStyle='#6b5233';circ(g,0,0,3.6);
}
function drawBush(g,R,berry){
  const b=[{x:-8,y:-9,r:9},{x:8,y:-9,r:9},{x:0,y:-15,r:10},{x:0,y:-7,r:10}];
  g.fillStyle='#355f2a';b.forEach(o=>circ(g,o.x+1,o.y+2,o.r));
  g.fillStyle='#4f8336';b.forEach(o=>circ(g,o.x,o.y,o.r*.9));
  g.fillStyle='#6fa646';b.forEach(o=>circ(g,o.x-2.5,o.y-3,o.r*.5));
  for(let i=0;i<7;i++){g.fillStyle=berry?'#d8473c':'#fff6e6';circ(g,(R()-.5)*22,-6-R()*14,1.4);}
}
function drawLamp(g){
  g.fillStyle='#7b736a';rr(g,-5.5,-5,11,5,1.6);g.fill();
  g.fillStyle='#3b342e';g.fillRect(-1.7,-50,3.4,46);g.fillRect(-3,-22,6,3);
  g.fillStyle='#2f2924';poly(g,[-7.5,-58,7.5,-58,0,-64.5]);
  g.fillRect(-5.8,-58,11.6,11.5);g.fillStyle='#ffd98a';g.fillRect(-4.2,-56.4,8.4,8.4);
  g.fillStyle='#fff3cc';g.fillRect(-1.2,-54.6,2.4,5);
  g.fillStyle='#2f2924';g.fillRect(-7,-47.6,14,2.2);
}
function drawBench(g){
  g.fillStyle='#5c3b22';g.fillRect(-18,-24,3,24);g.fillRect(15,-24,3,24);
  g.fillStyle='#8b5c34';rr(g,-21,-24,42,4,1.2);g.fill();rr(g,-21,-18.5,42,4,1.2);g.fill();
  g.fillStyle='#a06b3c';rr(g,-22,-12,44,5,1.5);g.fill();g.fillStyle='#b9824c';g.fillRect(-21,-12,42,1.2);
  g.fillStyle='#6d4527';g.fillRect(-22,-7,44,1.6);
  g.fillStyle='#4a2f1b';g.fillRect(-19,-7,3,7);g.fillRect(16,-7,3,7);
}
function drawBarrel(g){
  g.fillStyle='#8a5a33';rr(g,-11,-22,22,22,6);g.fill();
  g.fillStyle='rgba(0,0,0,.18)';g.fillRect(3,-20,7,19);
  g.strokeStyle='rgba(60,36,18,.55)';g.lineWidth=.8;g.beginPath();for(let k=-6;k<=6;k+=4){g.moveTo(k,-21);g.lineTo(k,-1);}g.stroke();
  g.fillStyle='#4a3b30';g.fillRect(-11,-19,22,2.2);g.fillRect(-11,-6,22,2.2);
  g.fillStyle='#a87545';ell(g,0,-22,11,4);g.fill();g.strokeStyle='#5c3b22';g.lineWidth=1;ell(g,0,-22,8.5,2.8);g.stroke();
}
function drawCrate(g){
  g.fillStyle='#c39459';g.fillRect(-14,-27,28,10);g.fillStyle='#a77a45';g.fillRect(-14,-17,28,17);
  g.strokeStyle='rgba(80,50,22,.6)';g.lineWidth=1;g.beginPath();g.moveTo(-14,-22);g.lineTo(14,-22);g.moveTo(-14,-11);g.lineTo(14,-11);g.moveTo(-14,-5.5);g.lineTo(14,-5.5);g.stroke();
  g.fillStyle='#7d5730';g.fillRect(-14,-17,3,17);g.fillRect(11,-17,3,17);g.fillRect(-14,-17,28,2.2);
  g.strokeStyle='#7d5730';g.lineWidth=2.4;g.beginPath();g.moveTo(-11,-1);g.lineTo(11,-15);g.stroke();
}
function drawBarricade(g){
  g.strokeStyle='#6e4a2b';g.lineWidth=3.2;g.lineCap='round';g.beginPath();
  [-46,46].forEach(x=>{g.moveTo(x-10,0);g.lineTo(x+8,-28);g.moveTo(x+10,0);g.lineTo(x-8,-28);});g.stroke();
  g.fillStyle='#3e2a18';g.fillRect(-2,-50,4,50);
  const plank=y=>{g.save();rr(g,-64,y,128,7,2);g.fillStyle='#a9743f';g.fill();g.clip();g.fillStyle='#b53e2c';for(let x=-72;x<70;x+=20)poly(g,[x,y+7,x+7,y,x+14,y,x+7,y+7]);g.restore();g.fillStyle='rgba(255,230,190,.3)';g.fillRect(-62,y+.5,124,1.1);};
  plank(-26);plank(-14);
  g.fillStyle='#c99a5e';rr(g,-15,-52,30,19,2.5);g.fill();g.strokeStyle='#6b4528';g.lineWidth=1.4;g.stroke();
  g.strokeStyle='#b23a2a';g.lineWidth=3.4;g.beginPath();g.moveTo(-8,-48);g.lineTo(8,-37);g.moveTo(8,-48);g.lineTo(-8,-37);g.stroke();
}
function drawFountainBasin(g){
  g.fillStyle='#857b6f';ell(g,0,12,63,38);g.fill();
  g.fillStyle='#968c7f';g.fillRect(-63,0,126,12);
  g.fillStyle='#cfc6b5';ell(g,0,0,63,38);g.fill();
  g.strokeStyle='rgba(90,80,66,.55)';g.lineWidth=1;
  for(let i=0;i<20;i++){const a=i/20*TAU;g.beginPath();g.moveTo(Math.cos(a)*51,Math.sin(a)*30);g.lineTo(Math.cos(a)*63,Math.sin(a)*38);g.stroke();if(Math.sin(a)>.05){g.beginPath();g.moveTo(Math.cos(a)*63,Math.sin(a)*38);g.lineTo(Math.cos(a)*63,Math.sin(a)*38+12);g.stroke();}}
  g.fillStyle='rgba(255,250,235,.35)';g.beginPath();g.ellipse(0,0,62,37,0,Math.PI*1.05,Math.PI*1.6);g.ellipse(0,0,56,33,0,Math.PI*1.6,Math.PI*1.05,true);g.fill();
  g.fillStyle='#2f5866';ell(g,0,0,51,30);g.fill();
}
function drawFountainPillar(g){
  g.fillStyle='#b9b0a0';g.fillRect(-6,-40,12,40);g.fillStyle='rgba(0,0,0,.18)';g.fillRect(1.5,-40,4.5,40);
  g.fillStyle='#cfc6b5';ell(g,0,0,9,4);g.fill();
  g.fillStyle='#8f8578';ell(g,0,-38,22,8.5);g.fill();g.fillRect(-22,-42,44,4);
  g.fillStyle='#d9d0bf';ell(g,0,-42,22,8);g.fill();
  g.fillStyle='#3d7487';ell(g,0,-42,17,5.6);g.fill();
  g.fillStyle='#c4bba9';g.fillRect(-2.5,-56,5,14);circ(g,0,-57,3.4);
}
/* interior furniture */
function drawChest(g){
  g.fillStyle='#8a5530';g.fillRect(-21,-28,42,10);g.fillStyle='#6e3f20';g.fillRect(-21,-18,42,18);
  g.fillStyle='#d9ae4f';g.fillRect(-21,-18,42,2);g.fillRect(-21,-2,42,2);g.fillRect(-21,-28,42,1.6);
  for(let x=-17;x<=17;x+=4.25){circ(g,x,-10,.85);circ(g,x,-24,.7);}
  g.fillStyle='#e8c46a';rr(g,-4,-15,8,9,1.5);g.fill();g.fillStyle='#6e3f20';circ(g,0,-11,1.3);
  g.fillStyle='#d9ae4f';g.fillRect(-21,-18,4,18);g.fillRect(17,-18,4,18);
}
function drawTray(g){
  g.fillStyle='#a8822e';ell(g,0,-2,17,7.4);g.fill();g.fillStyle='#d6ae4e';ell(g,0,-3,16,6.6);g.fill();
  g.strokeStyle='#a8822e';g.lineWidth=.8;ell(g,0,-3,12,4.8);g.stroke();
  g.fillStyle='#7a4a2a';ell(g,-7,-3,5,2.4);g.fill();g.fillStyle='#4a2a14';[[-9,-3.4],[-7,-2.4],[-5,-3.6],[-7.4,-4.2]].forEach(p=>{ell(g,p[0],p[1],1.3,.8);g.fill();});
  [[5,-1],[9,-3.4],[4,-5]].forEach(p=>{g.fillStyle='#f8f2e6';ell(g,p[0],p[1],1.6,1);g.fill();g.fillStyle='#e8c46a';g.fillRect(p[0]-1.6,p[1]-.3,3.2,.5);});
  g.fillStyle='#c79a3c';g.beginPath();g.moveTo(-2,-4);g.quadraticCurveTo(-5,-9,-2.4,-12);g.lineTo(2.4,-12);g.quadraticCurveTo(5,-9,2,-4);g.closePath();g.fill();
  g.fillStyle='#e9c368';g.fillRect(-2,-15.5,4,3.6);poly(g,[-2.6,-15.5,2.6,-15.5,0,-20]);circ(g,0,-20.6,1);
  g.strokeStyle='#c79a3c';g.lineWidth=1.2;g.beginPath();g.moveTo(-2.6,-9);g.quadraticCurveTo(-8,-12,-7,-17.5);g.stroke();
  g.beginPath();g.moveTo(2.6,-11);g.quadraticCurveTo(6,-11,5,-6.5);g.stroke();
  g.fillStyle='rgba(255,255,255,.45)';g.fillRect(-1.6,-11,1,5);
}
function drawHearth(g){
  g.fillStyle='#9a7b5c';rr(g,-28,-26,56,26,6);g.fill();
  g.fillStyle='#b3936f';rr(g,-28,-26,56,9,5);g.fill();
  g.fillStyle='#3a2a20';rr(g,-12,-16,24,13,5);g.fill();
  g.fillStyle='#2a2320';ell(g,0,-27,11,5);g.fill();g.fillRect(-11,-34,22,7);g.fillStyle='#3d3430';ell(g,0,-34,11,4);g.fill();
  g.fillStyle='#55463e';ell(g,0,-34,8,2.6);g.fill();
  g.strokeStyle='#2a2320';g.lineWidth=1.4;g.beginPath();g.arc(0,-34,12,Math.PI*1.1,Math.PI*1.9);g.stroke();
}
function drawJar(g){
  g.fillStyle='#b8713e';g.beginPath();g.moveTo(-4,-22);g.quadraticCurveTo(-12,-18,-10,-8);g.quadraticCurveTo(-8,0,0,0);g.quadraticCurveTo(8,0,10,-8);g.quadraticCurveTo(12,-18,4,-22);g.closePath();g.fill();
  g.fillStyle='rgba(0,0,0,.16)';g.beginPath();g.moveTo(3,-20);g.quadraticCurveTo(11,-16,9,-7);g.quadraticCurveTo(7,-1,1,0);g.quadraticCurveTo(7,-8,3,-20);g.fill();
  g.fillStyle='#cf8a52';g.fillRect(-4.6,-25,9.2,3.6);ell(g,0,-25,4.6,1.6);g.fill();g.fillStyle='#4a2a14';ell(g,0,-25,3.2,1);g.fill();
  g.strokeStyle='#7a3f1c';g.lineWidth=1;g.beginPath();g.moveTo(-9.6,-13);g.quadraticCurveTo(0,-10,9.6,-13);g.stroke();
  g.fillStyle='#7a3f1c';for(let x=-7;x<=7;x+=3.5)poly(g,[x-1.2,-11.4,x+1.2,-11.4,x,-9]);
}
function drawPlant(g){
  g.fillStyle='#a9643a';poly(g,[-6,-10,6,-10,4.4,0,-4.4,0]);g.fillStyle='#c27a48';g.fillRect(-6.6,-11.5,13.2,2.4);
  g.strokeStyle='#4f8a43';g.lineWidth=1.8;g.lineCap='round';
  [[-9,-26],[-3,-30],[4,-29],[10,-24],[0,-24],[-7,-18],[8,-18]].forEach(p=>{g.beginPath();g.moveTo(0,-11);g.quadraticCurveTo(p[0]*.3,p[1]*.7,p[0],p[1]);g.stroke();});
}
function drawWorkbench(g){
  g.fillStyle='#5c3b22';g.fillRect(-36,-16,4,16);g.fillRect(32,-16,4,16);
  g.fillStyle='#8f5f35';g.fillRect(-40,-34,80,18);g.fillStyle='#a8743f';g.fillRect(-40,-34,80,3);g.fillStyle='#6d4527';g.fillRect(-40,-16,80,4);
  g.fillStyle='#d9dde2';ell(g,-22,-27,5,2.2);g.fill();ell(g,14,-25,3.4,1.6);g.fill();
  g.strokeStyle='#cfd4da';g.lineWidth=1.1;g.beginPath();g.arc(-4,-30,6,.2,Math.PI-.2);g.stroke();
  g.fillStyle='#e9eef2';for(let a=.3;a<Math.PI-.2;a+=.35)circ(g,-4+Math.cos(a)*6,-30+Math.sin(a)*6,.8);
  g.fillStyle='#e7c46a';circ(g,-4,-23.6,1.3);
  g.fillStyle='#4a4a4f';g.fillRect(22,-30,10,2.6);g.fillStyle='#7a5230';g.fillRect(28,-30,8,1.8);
  g.fillStyle='#3d3a36';rr(g,24,-24,10,5,1.4);g.fill();
}
function drawLoom(g){
  g.fillStyle='#6e4a2b';g.fillRect(-44,-56,4,56);g.fillRect(40,-56,4,56);g.fillRect(-46,-58,92,5);g.fillRect(-46,-14,92,4);
  const cols=['#a8322a','#f2e3c2','#221b1a','#e0a83e','#2f5d4a'];
  g.globalAlpha=.75;g.lineWidth=.7;
  for(let x=-38;x<39;x+=2.2){g.strokeStyle=cols[((x+40)/2.2|0)%5];g.beginPath();g.moveTo(x,-53);g.lineTo(x,-34);g.stroke();}
  g.globalAlpha=1;
  g.fillStyle='#a8322a';g.fillRect(-39,-34,78,20);
  g.fillStyle='#221b1a';for(let x=-39;x<38;x+=8)poly(g,[x,-14,x+4,-22,x+8,-14]);
  g.fillStyle='#f2e3c2';for(let x=-35;x<38;x+=8)poly(g,[x,-34,x+4,-26,x+8,-34]);
  g.fillStyle='#e0a83e';g.fillRect(-39,-24.4,78,1.4);
  g.fillStyle='#8f6239';rr(g,-12,-38,24,3,1.4);g.fill();
}
function drawMabkhara(g){
  g.fillStyle='#6b3f22';poly(g,[-7,0,7,0,5,-6,-5,-6]);
  g.fillStyle='#c0392b';poly(g,[-5,-6,5,-6,7,-14,-7,-14]);
  g.fillStyle='#2d6a6a';poly(g,[-3,-6,0,-11,3,-6]);g.fillStyle='#e6b84a';poly(g,[-6,-13,-4,-9,-2,-13]);poly(g,[2,-13,4,-9,6,-13]);
  g.fillStyle='#f6eedb';ell(g,0,-14.4,7.6,2.6);g.fill();g.fillStyle='#3a2a20';ell(g,0,-14.6,5.4,1.7);g.fill();
  g.fillStyle='#ff9a45';circ(g,-1.6,-14.8,1);circ(g,1.6,-14.4,.9);
}
function drawCat(g){
  g.fillStyle='#d98a3c';ell(g,0,-5,10,5.6);g.fill();
  g.fillStyle='#e9a457';ell(g,-1,-6.4,7.4,3.4);g.fill();
  g.strokeStyle='#b96e2a';g.lineWidth=1;g.beginPath();g.moveTo(-3,-9.6);g.lineTo(-3,-3);g.moveTo(1,-10);g.lineTo(1,-3);g.stroke();
  g.fillStyle='#d98a3c';circ(g,-8.6,-6,4.2);poly(g,[-12,-8.4,-10.6,-12.6,-8.6,-9.6]);poly(g,[-8.2,-9.8,-5.8,-12.4,-5.2,-8.4]);
  g.strokeStyle='#5a3a22';g.lineWidth=.8;g.beginPath();g.arc(-10,-5.6,1,0,Math.PI);g.moveTo(-6.4,-5.6);g.arc(-7.4,-5.6,1,0,Math.PI);g.stroke();
  g.strokeStyle='#d98a3c';g.lineWidth=2.6;g.lineCap='round';g.beginPath();g.moveTo(9,-4);g.quadraticCurveTo(13,2,4,1.2);g.stroke();
}

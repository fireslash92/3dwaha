// خريطة القرية: الطرق والبيوت والأشجار والتصادم
'use strict';

/* =========================================================
   VILLAGE MAP (pure data + queries)
   ========================================================= */
const VW=1152, VH=864;
const MAP=(()=>{
  const R=mulberry(20261108);
  const plaza={x:576,y:440,rx:150,ry:118}, lookout={x:576,y:722,r:46};
  const paths=[
    {pts:[[576,-20],[576,340]],w:60},
    {pts:[[576,540],[576,722]],w:56},
    {pts:[[440,446],[226,446],[226,300]],w:52},
    {pts:[[226,446],[228,700]],w:52},
    {pts:[[712,446],[924,446],[924,306]],w:52},
    {pts:[[864,446],[864,604]],w:36},
    {pts:[[924,446],[1170,446]],w:48},
  ];
  function distSeg(px,py,ax,ay,bx,by){const dx=bx-ax,dy=by-ay,l=dx*dx+dy*dy;let t=l?((px-ax)*dx+(py-ay)*dy)/l:0;t=clamp(t,0,1);const qx=ax+t*dx-px,qy=ay+t*dy-py;return Math.sqrt(qx*qx+qy*qy);}
  function onRoad(x,y,m=0){for(const p of paths)for(let i=0;i<p.pts.length-1;i++){const a=p.pts[i],b=p.pts[i+1];if(distSeg(x,y,a[0],a[1],b[0],b[1])<p.w/2+m)return true;}return false;}
  function onPlaza(x,y,m=0){const dx=(x-plaza.x)/(plaza.rx+m),dy=(y-plaza.y)/(plaza.ry+m);return dx*dx+dy*dy<1;}
  function onLookout(x,y,m=0){return Math.hypot(x-lookout.x,y-lookout.y)<lookout.r+m;}
  const onAnyPath=(x,y,m=0)=>onRoad(x,y,m)||onPlaza(x,y,m)||onLookout(x,y,m);

  const houses=[
    {id:'A',x:126,w:200,base:300,wallH:82,roofH:76,door:.5,roof:['#d0693f','#a5432a'],trim:'#4f7b6a'},
    {id:'B',x:824,w:200,base:306,wallH:82,roofH:78,door:.5,roof:['#d77a49','#ad4f2e'],trim:'#6c5b8c'},
    {id:'C',x:136,w:184,base:700,wallH:78,roofH:72,door:.5,roof:['#c75e3a','#9c3f26'],trim:'#3f6f86'},
  ];
  houses.forEach(h=>h.doorX=Math.round(h.x+h.w*h.door));

  const trees=[];
  const T=(x,y,kind)=>trees.push({x:Math.round(x),y:Math.round(y),kind,v:(R()*3)|0,phase:R()*TAU});
  for(let x=14;x<=1150;x+=44){if(Math.abs(x-576)<74)continue;T(x+(R()-.5)*10,46+(R()-.5)*10,'pine');}
  for(let x=36;x<=1140;x+=50){if(Math.abs(x-576)<92)continue;T(x+(R()-.5)*12,104+(R()-.5)*8,R()<.55?'pine':'oak');}
  T(520,18,'pine');T(634,22,'pine');
  for(let y=160;y<=780;y+=54){T(24+(R()-.5)*8,y+(R()-.5)*10,R()<.4?'pine':'oak');T(1128+(R()-.5)*8,y+(R()-.5)*10,R()<.4?'pine':'oak');}
  [[372,300],[772,252],[432,642],[714,664],[380,566],[100,548],[1052,560],[1050,420],[470,772],[694,776],[328,776],[1060,760]].forEach(p=>T(p[0],p[1],'oak'));
  [[500,690],[660,700],[110,388],[1066,206]].forEach(p=>T(p[0],p[1],'palm'));
  for(let i=trees.length-1;i>=0;i--){const t=trees[i];if(t.x>990&&Math.abs(t.y-446)<58)trees.splice(i,1);}

  const bushes=[[142,322],[310,322],[840,328],[1008,328],[154,720],[302,720],[492,104],[660,104],[450,382],[702,382]].map(p=>({x:p[0],y:p[1],v:0}));
  const hedge=[];
  for(let x=10;x<=1150;x+=30){hedge.push({x:x+(R()-.5)*6,y:828+(R()-.5)*4,v:1});hedge.push({x:x+15+(R()-.5)*6,y:860,v:1});}
  const lamps=[[470,352],[682,352],[470,530],[682,530]].map(p=>({x:p[0],y:p[1],phase:R()*TAU}));
  const benches=[{x:512,y:344},{x:576,y:760},{x:690,y:320}];
  const barrels=[{x:1046,y:300},{x:1066,y:284}];
  const crates=[{x:796,y:300},{x:104,y:640}];
  const fountain={x:576,y:436}, barricade={x:576,y:106}, heroSpawn={x:576,y:640};
  const falaj={x:624,y:106,w:20,h:214};
  const fences=[
    [[40,792],[1112,792]],
    [[760,600],[842,600]],[[886,600],[1016,600]],
    [[760,600],[760,760]],[[1016,600],[1016,760]],[[760,760],[1016,760]],
  ];
  const colliders=[];
  const rectC=(x,y,w,h,tag)=>colliders.push({t:'r',x,y,w,h,tag});
  const circC=(x,y,r,tag)=>colliders.push({t:'c',x,y,r,tag});
  rectC(0,0,58,VH,'edge');rectC(VW-58,0,58,416,'edge');rectC(VW-58,476,58,VH-476,'edge');rectC(VW-62,416,62,60,'eastgate');rectC(0,0,VW,72,'edge');rectC(0,VH-10,VW,10,'edge');
  houses.forEach(h=>rectC(h.x+2,h.base-112,h.w-4,112,'house'));
  trees.forEach(t=>circC(t.x,t.y-3,t.kind==='oak'?10:t.kind==='palm'?8:9,'tree'));
  bushes.forEach(b=>circC(b.x,b.y-5,11,'bush'));
  lamps.forEach(l=>circC(l.x,l.y-2,6,'lamp'));
  benches.forEach(b=>rectC(b.x-21,b.y-12,42,13,'bench'));
  barrels.forEach(b=>circC(b.x,b.y-4,11,'barrel'));
  crates.forEach(c=>rectC(c.x-14,c.y-18,28,18,'crate'));
  colliders.push({t:'e',x:fountain.x,y:fountain.y,rx:66,ry:42,tag:'fountain'});
  rectC(480,84,192,24,'barricade');
  rectC(falaj.x,falaj.y,falaj.w,falaj.h,'falaj');
  fences.forEach(([a,b])=>{
    if(a[1]===b[1])rectC(Math.min(a[0],b[0])-3,a[1]-6,Math.abs(b[0]-a[0])+6,10,'fence');
    else rectC(a[0]-5,Math.min(a[1],b[1])-4,10,Math.abs(b[1]-a[1])+8,'fence');
  });
  const forestZone={x:470,y:72,w:212,h:112};
  return {plaza,lookout,paths,onRoad,onPlaza,onLookout,onAnyPath,houses,trees,bushes,hedge,lamps,benches,barrels,crates,fountain,barricade,falaj,fences,colliders,heroSpawn,forestZone};
})();

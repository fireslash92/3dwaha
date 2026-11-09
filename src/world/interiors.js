// تصميم داخل البيوت الثلاثة
'use strict';

/* =========================================================
   INTERIORS (data)
   ========================================================= */
const IW=448, IH=320, WALL=96, GAP0=200, GAP1=248;
const INTERIORS={
  A:{name:'بيت أم سعيد',wall:['#f0ddb7','#dcc39a'],floor:['#d9c39d','#cfb68e'],rug:{x:116,y:168,w:216,h:96,base:'#a3302a',band:'#221b1a',acc:'#f2e3c2',gold:'#e0a83e'},
     cushions:[{side:'back',a:30,b:200},{side:'left',a:122,b:232}],cush:['#7a2a2a','#d9a23f','#2f5d4a'],window:{x:300},niches:[60,232],lanterns:[150],
     props:[{t:'hearth',x:390,y:152},{t:'tray',x:224,y:220},{t:'chest',x:66,y:292},{t:'jar',x:404,y:214},{t:'jar',x:420,y:240,s:.8},{t:'plant',x:388,y:296}]},
  B:{name:'بيت راشد',wall:['#ecdcc0','#d6c19e'],floor:['#d3bd98','#c9b08a'],rug:{x:170,y:192,w:128,h:74,base:'#2f5d4a',band:'#221b1a',acc:'#f2e3c2',gold:'#d8443a'},
     cushions:[{side:'back',a:186,b:296}],cush:['#2f4f7a','#e3b24a','#a8322a'],window:{x:92},niches:[214,268],lanterns:[176,330],
     props:[{t:'bench',x:120,y:160},{t:'loom',x:350,y:162},{t:'chest',x:404,y:294},{t:'jar',x:44,y:270},{t:'jar',x:62,y:290,s:.8}]},
  C:{name:'بيت الجدة زوينة',wall:['#efe0c3','#dac7a3'],floor:['#dcc8a4','#d1ba93'],rug:{x:110,y:150,w:214,h:100,base:'#7d2a3a',band:'#221b1a',acc:'#f2e3c2',gold:'#e6b84a'},
     cushions:[{side:'back',a:236,b:418},{side:'right',a:124,b:244}],cush:['#6b2f63','#e9b44c','#2d6a6a'],window:{x:120},niches:[44,196],lanterns:[230],
     props:[{t:'mabkhara',x:232,y:206},{t:'chest',x:66,y:140},{t:'jar',x:52,y:282},{t:'cat',x:372,y:272},{t:'plant',x:408,y:296}]},
};
function interiorColliders(cfg){
  const C=[];const rectC=(x,y,w,h,tag)=>C.push({t:'r',x,y,w,h,tag});const circC=(x,y,r,tag)=>C.push({t:'c',x,y,r,tag});
  rectC(0,0,IW,WALL+6,'wall');rectC(0,0,22,IH,'wall');rectC(IW-22,0,22,IH,'wall');
  rectC(0,IH-14,GAP0,14,'wall');rectC(GAP1,IH-14,IW-GAP1,14,'wall');
  cfg.cushions.forEach(c=>{if(c.side==='back')rectC(c.a,WALL,c.b-c.a,18,'cushion');else if(c.side==='left')rectC(22,c.a,20,c.b-c.a,'cushion');else rectC(IW-42,c.a,20,c.b-c.a,'cushion');});
  cfg.props.forEach(p=>{
    if(p.t==='hearth')rectC(p.x-28,p.y-26,56,26,p.t);
    else if(p.t==='tray')circC(p.x,p.y-3,15,p.t);
    else if(p.t==='chest')rectC(p.x-21,p.y-18,42,18,p.t);
    else if(p.t==='jar')circC(p.x,p.y-4,9*(p.s||1),p.t);
    else if(p.t==='bench')rectC(p.x-40,p.y-24,80,24,p.t);
    else if(p.t==='loom')rectC(p.x-44,p.y-14,88,14,p.t);
    else circC(p.x,p.y-4,9,p.t);
  });
  return C;
}

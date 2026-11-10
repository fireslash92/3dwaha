// سوق القرية: كل ثلاثة أيام تُنصب البسطات في ساحة النافورة صباحًا، فيها حلوى وعطور وسمك، ومساومة على بضاعة نادرة
'use strict';

/* =========================================================
   WHEN: every third day, from seven until one, after the first chapter
   ========================================================= */
const MARKET_EVERY=3;
const dayNow=()=>Math.floor((P.clock??540)/1440);
const marketDay=(d=dayNow())=>chapterDone&&d%MARKET_EVERY===2;
const marketOpen=()=>{const h=hourNow();return marketDay()&&h>=7&&h<13;};
const stallsUp=()=>{const h=hourNow();return marketDay()&&h>=6.2&&h<13.5&&scene.id==='village';};
function marketNote(){
  if(!chapterDone)return '';
  if(marketOpen())return ' اليوم يوم السوق في ساحة النافورة حتى الواحدة ظهرًا.';
  const d=dayNow(),h=hourNow();let k=0;while(!marketDay(d+k)||(k===0&&h>=13))k++;
  return k===0?' السوق يُفتح اليوم في السابعة صباحًا.':k===1?' السوق غدًا صباحًا في ساحة النافورة.':` السوق بعد ${AR(k)} أيام في ساحة النافورة.`;
}

/* =========================================================
   THE STALLS AND THEIR SELLERS
   ========================================================= */
const STALLS=[
  {id:'sweets',x:462,y:404,awn:['#c0392b','#f3ead8'],goods:'sweets'},
  {id:'scent',x:690,y:400,awn:['#2f6b4f','#e9c86a'],goods:'scent'},
  {id:'fish',x:484,y:500,awn:['#2f5f8f','#f3ead8'],goods:'fish'},
];
const STALL_COLLIDERS=STALLS.map(s=>({t:'r',x:s.x-28,y:s.y-8,w:56,h:12,tag:'stall'}));
function marketColliders(list){if(stallsUp())for(const c of STALL_COLLIDERS)list.push(c);}

Object.assign(ITEMS,{
  regag:{name:'خبز رقاق',use:'hp',amount:35,icon:'sweets',col:'#d9b072',price:25,desc:'رقيق ومقرمش، من صاج أم هلال. يعيد ٣٥ من الصحة.'},
  luqaimat:{name:'لقيمات بالدبس',use:'hp',amount:50,icon:'honey',col:'#c98a2a',price:45,desc:'كرات ذهبية بدبس التمر. تعيد ٥٠ من الصحة.'},
  hojari:{name:'لبان حوجري',use:'mp',amount:40,icon:'incense',col:'#e9dcc0',price:110,desc:'أجود لبان ظفار. يعيد ٤٠ من الطاقة.'},
  oud:{name:'دهن العود',slot:'acc',icon:'flask',col:'#5a3a22',stats:{wis:2,luk:1},price:380,desc:'قارورة صغيرة من دهن العود. رائحتها تصفّي الذهن.'},
  bait:{name:'طُعم',tool:true,icon:'dust',col:'#a8834e',price:15,desc:'يُستعمل تلقائيًا عند الصيد. يجذب الأسماك الكبيرة والنادرة.'},
  // rare goods, one of them on each market day, only by haggling
  feroz:{name:'خاتم الفيروز',slot:'acc',icon:'ring',col:'#3fa3a0',stats:{luk:3,def:2},price:600,desc:'فضة نزوانية يتوسطها فيروز أزرق.'},
  bisht:{name:'بشت مطرّز',slot:'body',icon:'robe',col:'#3a2a1c',stats:{def:5,wis:2},price:900,desc:'عباءة رجالية بحواف من خيوط الذهب.'},
  suri:{name:'خنجر صوري',slot:'weapon',icon:'dagger',col:'#c9a046',stats:{atk:10,agi:1},price:1100,desc:'صنعة صور القديمة، مقبضه من قرن ونصله مصقول.'},
  massar:{name:'مصر كشميري',slot:'head',icon:'cap',col:'#7a2f5a',stats:{def:3,wis:3,luk:1},price:700,desc:'عمامة من صوف كشمير بنقوش دقيقة.'},
});
const RARE_GOODS=['feroz','massar','bisht','suri'];
const VENDOR=(id,name,look,x,y,shop,lines)=>{const n={id,name,scene:'none',x,y,dir:'down',look,noMeet:true,shop,talked:0,market:true,lines:null,repeat:lines,phase:0,moving:false,lookAt:2,pause:1,target:null,stuck:0};
  n.lines=n.repeat;n.home={x,y,dir:'down',scene:'none'};NPCS.push(n);SCHED[id]=[[0,'none'],[6.2,'village',x,y,'down'],[13,'none']];return n;};
const UMMHILAL=VENDOR('ummhilal','أم هلال',{g:'f',age:'old',dress:'#7a3a5a',dressSh:'#5e2b45',emb:'#e2b54a',emb2:'#f7e3a6',scarf:'#1f1a1e',scarfSh:'#120e12',scarfTrim:'#c9473a',sirwal:'#e2b54a',skin:'#c99068'},STALLS[0].x,STALLS[0].y-16,'sweets',
  ['يا هلا بالضيف! رقاق حار من الصاج، ولقيمات بدبس التمر.','ذوق قبل لا تشتري، ما عليك حساب.']);
const SULAIMAN=VENDOR('sulaiman','سليمان',{g:'m',robe:'#f3ead8',robeSh:'#d6cbb3',tassel:'#8a6a3a',head:'massar',hw:['#7a2f5a','#e9c86a','#f3ead8'],hair:'#2a1e16',beard:'#2a1e16',skin:'#b97d52'},STALLS[1].x,STALLS[1].y-16,'scent',
  ['العطر عطر، والبخور بخور! عندي لبان حوجري من ظفار ودهن عود ما له مثيل.','وعندي اليوم قطعة نادرة… لكن سعرها بالمساومة، شطارتك تحدد سعرها.']);
const JUMAA=VENDOR('jumaa','جمعة',{g:'m',robe:'#cfe0e6',robeSh:'#a8bec6',tassel:'#5a7a86',head:'kumma',hw:['#f7f3ea','#2f5f8f'],hair:'#1f1712',beard:'#1f1712',skin:'#a8714a'},STALLS[2].x,STALLS[2].y-16,'fishmonger',
  ['سمك! سمك طازج! أشتري صيدك بسعر أحسن من سعيد.','وعندي طُعم يجيب لك الكبار، وربما… الذهبية.']);
Object.assign(SHOP,{
  sweets:{title:'بسطة أم هلال',sub:'حلوى وخبز من صاج الحطب',tabs:[['buy','شراء']],stock:['regag','luqaimat','halwa','dates']},
  scent:{title:'عطور سليمان',sub:'لبان وعود ومساومة على النادر',tabs:[['buy','شراء'],['haggle','مساومة']],stock:['hojari','incense','oud']},
  fishmonger:{title:'بسطة جمعة',sub:'يشتري السمك بسعر أفضل بمرة ونصف',tabs:[['sell','بيع السمك'],['buy','شراء']],stock:['bait'],sellMult:1.5,sellFilter:id=>id.startsWith('fish_')},
});

/* =========================================================
   HAGGLING: offer less, read the seller's mood, don't push too far
   ========================================================= */
function haggleState(){
  const d=dayNow();
  if(!P.haggle||P.haggle.day!==d){
    const R=mulberry(d*131+7),id=RARE_GOODS[d/MARKET_EVERY%RARE_GOODS.length|0],list=ITEMS[id].price,luk=typeof stat==='function'?stat('luk'):6;
    P.haggle={day:d,id,ask:list,min:Math.round(list*(.6+R()*.14)*(1-Math.min(.08,(luk-6)*.01))/5)*5,patience:3,done:false,line:'هذي القطعة ما تلقاها إلا عندي. كم تعطيني؟'};
  }
  return P.haggle;
}
const round5=v=>Math.max(5,Math.round(v/5)*5);
function haggleBoard(){
  const H=haggleState(),it=ITEMS[H.id],list=it.price;
  if(H.done)return `<div class="quest"><b>${H.bought?'بعتها لك. مبروك عليك!':'سليمان مشغول عنك اليوم.'}</b><p class="muted" style="margin:4px 0 0">${H.bought?`اشتريت ${it.name} بـ${baisa(H.bought)} بدل ${baisa(list)}.`:'زعّلته بعروضك. تعال في يوم السوق القادم، وعنده بضاعة جديدة.'}</p></div>`;
  const offers=[.9,.8,.7].map(k=>round5(H.ask*k)).filter((v,i,a)=>a.indexOf(v)===i&&v<H.ask);
  const mood=H.patience>=3?'رايق':H.patience===2?'بدأ يتضايق':'على وشك يزعل';
  return `<div class="row">${icon(it.icon,it.col)}<span class="grow"><span class="val">${it.name}</span><span class="lbl">${it.desc}</span><span class="chips">${chipsOf(it.stats)}<span class="chip">السعر الأصلي ${baisa(list)}</span></span></span></div>
  <div class="quest" style="margin-top:10px"><b>سليمان: «${H.line}»</b><p class="muted" style="margin:4px 0 0">يطلب الآن ${baisa(H.ask)}. مزاجه: ${mood} ${'●'.repeat(H.patience)}${'○'.repeat(3-H.patience)}</p></div>
  <div class="actions" style="flex-wrap:wrap;gap:8px">${offers.map(v=>`<button type="button" class="btn ghost" data-offer="${v}"${P.money<v?' disabled':''}>اعرض ${baisa(v)}</button>`).join('')}<button type="button" class="btn" data-offer="${H.ask}"${P.money<H.ask?' disabled':''}>اشترِ بـ${baisa(H.ask)}</button></div>
  <p class="muted">العرض القليل جدًا يضايقه، وإذا زعل ثلاث مرات ما يبيعك اليوم. الحظ العالي يليّن قلبه.</p>`;
}
function haggleOffer(o){
  const H=haggleState();if(H.done||P.money<o){SFX.play('error');return;}
  const list=ITEMS[H.id].price;
  const buy=price=>{P.money-=price;P.inv[H.id]=(P.inv[H.id]||0)+1;H.done=true;H.bought=price;SFX.play('coin');SFX.play('itemGet');achUnlock('souq');if(price<=list*.75)achUnlock('haggle');$('menuDot').hidden=false;shopMsg=`اشتريت ${ITEMS[H.id].name}. البسه من القائمة ← العتاد.`;};
  if(o>=H.ask)buy(o);
  else if(o>=H.min+(H.ask-H.min)*.35){H.line='ما عليه، عشانك أنت. اتفقنا!';buy(o);}
  else if(o>=H.min){H.ask=round5(Math.max(H.min,(H.ask+o)/2));H.line=['صعبة… بس ممكن نتفاهم. آخر كلام عندي','لا والله ما توفي، بس عشان الجيرة'][(Math.random()*2)|0]+` ${AR(H.ask)}.`;SFX.play('confirm');}
  else{H.patience--;H.ask=round5(Math.max(H.min,H.ask*.97));
    if(H.patience<=0){H.done=true;H.line='';SFX.play('error');}
    else{H.line=['حرام عليك! هذي بضاعة من الهند ونزوى!','تبيني أخسر؟ لا لا لا.','تمزح أكيد!'][(Math.random()*3)|0];SFX.play('cancel');}}
  renderShop();saveGame();
}

/* =========================================================
   LIFE AROUND THE STALLS
   ========================================================= */
let chatterT=2;
function marketTick(dt){
  if(!stallsUp()||state!=='play'&&state!=='dialog')return;
  const day=dayNow();
  if(marketOpen()&&state==='play'&&WX.rain<.12&&!(WX.told['market'+day])){WX.told['market'+day]=1;notify('اليوم يوم السوق!<small>البسطات في ساحة النافورة حتى الواحدة ظهرًا</small>',3.4);}
  if(!marketOpen()||WX.rain>.12)return;
  chatterT-=dt;
  const d=Math.hypot(hero.x-576,(hero.y-450)*1.2),vol=clamp(1-d/420,0,1);
  if(chatterT<=0){chatterT=.5+Math.random()*1.4;if(vol>0)SFX.play('chatter',{pan:clamp((STALLS[(Math.random()*3)|0].x-hero.x)/240,-1,1),vol});}
}
function drawStall(g,s,t){
  const x=s.x,y=s.y,shut=WX.rain>.12||!marketOpen();
  softShadow(g,x,y+4,34,7,.35);
  // posts and table
  g.fillStyle='#6b4a2b';[-27,25].forEach(dx=>{g.fillRect(x+dx,y-84,3,84);});
  g.fillStyle='#8a5e36';g.fillRect(x-30,y-12,60,10);g.fillStyle='#6b4a2b';g.fillRect(x-30,y-3,60,3);
  g.fillStyle='#e9dcc0';g.fillRect(x-30,y-14,60,3);
  // awning (striped cloth, a small sway)
  const sw=Math.sin(t*1.3+x)*1.2;
  for(let i=0;i<6;i++){g.fillStyle=s.awn[i%2];g.beginPath();g.moveTo(x-32+i*10.7,y-88);g.lineTo(x-32+(i+1)*10.7,y-88);g.lineTo(x-32+(i+1)*10.7+sw,y-78);g.lineTo(x-32+i*10.7+sw,y-78);g.closePath();g.fill();}
  for(let i=0;i<6;i++){g.fillStyle=s.awn[i%2];g.beginPath();g.arc(x-26.6+i*10.7+sw,y-78,5.3,0,Math.PI);g.fill();}
  if(shut){g.fillStyle='rgba(120,100,70,.92)';g.fillRect(x-30,y-22,60,10);g.fillStyle='rgba(90,70,45,.9)';for(let i=0;i<4;i++)g.fillRect(x-28+i*15,y-22,1.2,10);return;}
  // goods
  if(s.goods==='sweets'){
    g.fillStyle='#d9c9a6';ell(g,x-16,y-15,9,3.2);g.fill();g.fillStyle='#6b2e14';ell(g,x-16,y-17,7,2.8);g.fill();g.fillStyle='rgba(255,210,140,.5)';ell(g,x-18,y-18,3,1);g.fill();
    g.fillStyle='#b98a44';rr(g,x-4,y-21,12,7,2);g.fill();g.fillStyle='#5a2a12';for(let i=0;i<4;i++)circ(g,x-1+i*2.4,y-21,1.5);
    g.fillStyle='#d9b072';for(let i=0;i<3;i++){ell(g,x+16+i*1.5,y-16-i*1.6,7,2.4);g.fill();}
    if(fxOn()){g.fillStyle='rgba(255,255,255,.35)';for(let i=0;i<3;i++){const q=(t*.6+i/3)%1;circ(g,x+16+Math.sin(t*2+i)*2,y-22-q*14,1.6*(1-q)+.4);}}
  }else if(s.goods==='scent'){
    const bt=[['#8a3a5a',-20],['#2f6b4f',-13],['#c9a046',-6]];bt.forEach(([c,dx])=>{g.fillStyle=c;rr(g,x+dx,y-23,5,9,2);g.fill();g.fillStyle='#e9c86a';g.fillRect(x+dx+1.4,y-26,2.2,3);});
    g.fillStyle='#9a7a52';g.beginPath();g.moveTo(x+6,y-14);g.lineTo(x+16,y-14);g.lineTo(x+14,y-22);g.lineTo(x+8,y-22);g.closePath();g.fill();g.fillStyle='#6b4a2b';ell(g,x+11,y-22,5,1.8);g.fill();
    g.fillStyle='#f3ead8';for(let i=0;i<5;i++)circ(g,x+20+(i%3)*2.6,y-16-(i>2?2:0),1.3);
    if(fxOn())for(let i=0;i<4;i++){const q=(t*.35+i/4)%1;g.fillStyle=`rgba(235,230,220,${.45*(1-q)})`;circ(g,x+11+Math.sin(t*1.5+i*2)*3*q,y-26-q*22,2+q*3);}
  }else{
    g.fillStyle='#6f8a3c';ell(g,x-12,y-16,13,3.6);g.fill();ell(g,x+12,y-16,13,3.6);g.fill();
    [[-16,'#9fb7a8'],[-8,'#7d8f6a'],[8,'#7aa6b8'],[16,'#9fb7a8']].forEach(([dx,c])=>{g.save();g.translate(x+dx,y-18);g.rotate(dx>0?.2:-.2);g.fillStyle=c;ell(g,0,0,6,2.2);g.fill();g.beginPath();g.moveTo(-5,0);g.lineTo(-8,-2);g.lineTo(-8,2);g.fill();g.restore();});
    g.fillStyle='#8a6a3a';rr(g,x-4,y-24,9,8,2);g.fill();g.fillStyle='#a8834e';ell(g,x+.5,y-24,4.5,1.6);g.fill();
  }
}
function marketDrawables(push){if(!stallsUp())return;for(const s of STALLS)push({y:s.y-2,x:s.x,draw:(g,t)=>drawStall(g,s,t)});}

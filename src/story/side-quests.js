// المهام الجانبية
'use strict';

/* =========================================================
   SIDE QUESTS
   ========================================================= */
const SIDEQ={
  shears:{giver:'mariam',title:'مقصّ مريم',xp:40,money:120,items:{rosewater:2},need:{shears:1},
    hint:'ابحث عن المقصّ عند أول ممر الغابة، قرب المنعطف.',
    offer:['ناصر، أريد منك معروفًا.','أضعت مقصّ الورد حين ذهبت أجمع الأعشاب عند أول ممر الغابة.','إن وجدته فأعده إليّ، وسأعطيك من ماء الورد.'],
    remind:()=>['المقصّ عند أول ممر الغابة، قرب المنعطف. انتبه للحيوانات هناك!'],
    done:['مقصّي! كنت أظنه ضاع إلى الأبد.','خذ قارورتين من ماء الورد، وهذه بيسات من بيع الورد.']},
  basket:{giver:'ummsaeed',target:'zuwaina',title:'سلة التمر',xp:40,money:80,items:{halwa:2},give:{basket:1},need:{basket:1},
    hint:'أوصل سلة التمر من أم سعيد إلى الجدة زوينة في البيت الجنوبي.',
    offer:['يا ولدي، الجدة زوينة تحب تمرنا، لكن رجليها لا تحملانها إلى بيتي.','خذ لها هذه السلة، الله يحفظك.'],
    remind:()=>['أوصلت السلة إلى الجدة زوينة؟ بيتها في جنوب القرية.'],
    done:['تمر أم سعيد! ما أطيبها من جارة.','خذ هذه الحلوى العمانية، صنعتها بيدي بالزعفران.']},
  bats:{giver:'hamad',title:'لصوص التمر',xp:60,money:150,items:{slingshot:1},
    hint:'اهزم خمسة خفافيش في ممر الغابة، ثم عُد إلى حمد.',
    progress:()=>Math.min(5,(P.kills.bat||0)-(P.q.bats?P.q.bats.base:0)),goal:5,
    offer:['الخفافيش في الغابة تأتي في الليل وتأكل التمر من نخلنا!','اهزم خمسة منها، وسأعطيك أغلى ما عندي. وعد!'],
    remind:()=>[`هزمت ${AR(SIDEQ.bats.progress())} من خمسة خفافيش. هيا، أنت تقدر!`],
    done:['خمسة خفافيش؟! أنت بطل حقيقي!','هذا مقلاعي، صنعه لي أبي. وهذه عيديّتي كلها!']},
  stars:{giver:'shamsa',title:'النجيمات الثلاث',xp:50,money:60,items:{starcharm:1},
    hint:'اجمع ثلاث نجيمات لامعة في القرية: قرب البيت الغربي، وشرق الحديقة، وفي المرج الشمالي.',
    progress:()=>P.q.stars?P.q.stars.n||0:0,goal:3,
    offer:['البارحة سقطت ثلاث نجيمات صغيرة في القرية، أراها تلمع بين العشب.','اجمعها لي، فأنا أصنع منها قلادة.'],
    remind:()=>[`جمعت ${AR(SIDEQ.stars.progress())} من ثلاث نجيمات.`,'واحدة قرب البيت الغربي، وأخرى شرق الحديقة، والثالثة في المرج الشمالي.'],
    done:['ثلاث نجيمات! صنعت لك منها هذه التميمة، لتحفظك في الغابة.']},
};
const qState=id=>P.q[id]?P.q[id].s:0;
function qReady(id){const q=SIDEQ[id];if(qState(id)!==1)return false;if(q.need)return Object.keys(q.need).every(k=>(P.inv[k]||0)>=q.need[k]);return q.progress()>=q.goal;}
const PICKUPS=[
  {id:'shears',q:'shears',scene:'forest',x:282,y:868,item:'shears',label:'وجدت مقصّ الورد'},
  {id:'star1',q:'stars',scene:'village',x:150,y:470},
  {id:'star2',q:'stars',scene:'village',x:1056,y:664},
  {id:'star3',q:'stars',scene:'village',x:430,y:236},
];
const pickupActive=p=>qState(p.q)===1&&!P.flags['pk_'+p.id];
let questAct=null;
function questLines(n){
  questAct=null;if(!chapterDone)return null;
  for(const id in SIDEQ){const q=SIDEQ[id],s=qState(id);
    if(q.target===n.id&&s===1&&qReady(id)){questAct={id,act:'done',n,lines:q.done};return q.done;}
    if(q.giver!==n.id)continue;
    if(s===0){questAct={id,act:'offer',n,lines:q.offer};return q.offer;}
    if(s===1){if(!q.target&&qReady(id)){questAct={id,act:'done',n,lines:q.done};return q.done;}return q.remind();}
  }
  return null;
}
function applyQuest(qa){
  const q=SIDEQ[qa.id];
  if(qa.act==='offer'){
    P.q[qa.id]={s:1,base:P.kills.bat||0,n:0};
    if(q.give)for(const k in q.give)P.inv[k]=(P.inv[k]||0)+q.give[k];
    SFX.play('quest');notify(`مهمة جديدة: ${q.title}<small>${q.hint}</small>`,3.6);
  }else{
    P.q[qa.id].s=2;
    if(q.need)for(const k in q.need)P.inv[k]=Math.max(0,(P.inv[k]||0)-q.need[k]);
    P.money+=q.money;for(const k in q.items)P.inv[k]=(P.inv[k]||0)+q.items[k];
    const got=Object.keys(q.items).map(k=>ITEMS[k].name+(q.items[k]>1?' ×'+AR(q.items[k]):'')).concat(baisa(q.money)).join('، ');
    SFX.play('itemGet');notify(`أتممت: ${q.title}<small>حصلت على: ${got}</small>`,3.4);gainXP(q.xp);$('menuDot').hidden=false;
  }
}
function questMark(n){
  if(!chapterDone)return null;
  for(const id in SIDEQ){const q=SIDEQ[id],s=qState(id);
    if(q.giver===n.id&&s===0)return '!';
    if(s===1&&qReady(id)&&(q.target?q.target===n.id:q.giver===n.id))return '?';}
  return null;
}
function takePickup(p){
  P.flags['pk_'+p.id]=1;SFX.play('itemGet');
  if(p.item){P.inv[p.item]=(P.inv[p.item]||0)+1;notify(`${p.label}<small>أعده إلى ${NPCS.find(n=>n.id===SIDEQ[p.q].giver).name}</small>`,3);}
  else{P.q[p.q].n=(P.q[p.q].n||0)+1;const k=P.q[p.q].n;notify(`وجدت نجيمة (${AR(k)} من ٣)${k>=3?'<small>عُد إلى شمسة عند المطلّ</small>':''}`,2.6);}
  saveGame();
}
function drawPickup(g,p,t){
  const y=p.y-10+Math.sin(t*3+p.x)*2,a=.6+.4*Math.sin(t*5+p.x);
  const gr=g.createRadialGradient(p.x,y,0,p.x,y,18);gr.addColorStop(0,`rgba(255,236,150,${.55*a})`);gr.addColorStop(1,'rgba(255,236,150,0)');g.fillStyle=gr;g.fillRect(p.x-18,y-18,36,36);
  g.fillStyle='rgba(60,30,0,.3)';ell(g,p.x,p.y,6,2);g.fill();
  if(p.item==='shears'){g.save();g.translate(p.x,y);g.rotate(.4);g.strokeStyle='#cfd4da';g.lineWidth=1.8;g.beginPath();g.moveTo(-6,-2);g.lineTo(6,2);g.moveTo(-6,2);g.lineTo(6,-2);g.stroke();g.strokeStyle='#c0392b';g.lineWidth=1.6;g.beginPath();g.arc(-8,-3,2.2,0,TAU);g.stroke();g.beginPath();g.arc(-8,3,2.2,0,TAU);g.stroke();g.restore();}
  else{g.fillStyle='#ffe58a';drawStar(g,p.x,y,5);g.fillStyle='#fff';circ(g,p.x-1,y-1,1);}
  g.fillStyle=`rgba(255,250,220,${a})`;circ(g,p.x+7*Math.cos(t*2),y-6+5*Math.sin(t*2.6),.9);
}
function drawQuestMark(g,n,m,t){
  const x=n.x,y=n.y-(n.look&&n.look.child?46:56)+Math.sin(t*4)*2;
  g.fillStyle='rgba(30,18,8,.25)';ell(g,x+1,y+1,8,8);g.fill();
  g.fillStyle=m==='!'?'#ffd36b':'#7be08a';ell(g,x,y,8,8);g.fill();g.strokeStyle='#5a3a1e';g.lineWidth=1.4;g.stroke();
  g.fillStyle='#3a210c';g.font='900 12px system-ui,-apple-system,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(m==='!'?'!':'؟',x,y+1);
}
function drawShopMark(g,n,t){
  const x=n.x,y=n.y-56+Math.sin(t*3)*1.5;
  g.fillStyle='#fffaf0';ell(g,x,y,8,8);g.fill();g.strokeStyle='#6b4a2b';g.lineWidth=1.3;g.stroke();
  g.fillStyle='#e0a83e';circ(g,x,y,4.6);g.strokeStyle='#fff3cc';g.lineWidth=.9;g.beginPath();g.arc(x,y,2.6,0,TAU);g.stroke();
}

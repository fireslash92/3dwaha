// الفصل الثامن: غابات الخريف — عين الضباب، غابة الخريف، سوق اللبان ومعرض الوحوش، كهف الشلال، والمها السوداء
// ومعه نظام الترويض: أضعف الوحش ثم روّضه ليقاتل معك
'use strict';

/* =========================================================
   TAMING & COMPANION MONSTERS
   ========================================================= */
const PET_MAX=8;
const tameable=e=>!!e.d.art&&e.d.art!=='warrior'&&!e.d.boss;
function petLevel(p){return clamp(Math.max(ENEMIES[p.type].lv,levelOf(P.xp)-2),1,MAX_LEVEL);}
function petStats(p){
  const d=ENEMIES[p.type],L=petLevel(p),R=ROLES[d.role||'brute'];
  return {hp:Math.round((16+6*L)*R.hp*(1+L/60)*.55),atk:Math.round((3+1.45*L)*R.atk*.95),def:Math.round((1+1.15*L)*R.def*.9),mag:Math.round((4+1.15*L)*R.mag),agi:Math.round((5+.45*L)*R.agi),wis:Math.round((4+1.15*L)*R.mag*.6),luk:3,mp:0};
}
const activePet=()=>P.pets&&P.pets[P.petActive]||null;
function setupPet(){ // called when a battle begins
  const p=activePet();if(!p||p.hp===0)return null;
  const s=petStats(p),hp=p.hp==null?s.hp:Math.min(p.hp,s.hp);
  NAMES.pet=ENEMIES[p.type].name;
  return {ref:p,type:p.type,d:ENEMIES[p.type],s,hp,ph:Math.random()*TAU,hitT:-9,actT:-9};
}
function petSaveBack(){if(B&&B.pet){B.pet.ref.hp=B.pet.hp>=B.pet.s.hp?null:Math.max(0,B.pet.hp);}}
const healPets=()=>(P.pets||[]).forEach(p=>p.hp=null);
async function petAction(){
  const pt=B.pet,es=aliveEnemies();if(!pt||pt.hp<=0||!es.length)return;
  const e=es.slice().sort((a,b)=>a.hp/a.max-b.hp/b.max)[0],d=pt.d,special=Math.random()<d.move[1],mag=d.ai==='magic'||d.ai==='sleep';
  pt.actT=time;SFX.play(mag?'eMagic':'swing');await wait(260);
  let dmg=mag?rollDmg((pt.s.mag*1.5-eDef(e)*.3)*(special?1.3:1)):rollDmg((pt.s.atk*1.9-eDef(e))*(special?d.move[2]:1));
  if(e.veil>0)dmg=Math.ceil(dmg/2);
  SFX.play('hit');e.hp-=dmg;e.hitT=time;fx(mag?'orb':'slash',e.x,eMid(e),mag?{tx:e.x,ty:eMid(e)}:{});popup(e.x,eTop(e),AR(dmg),'#ffe1a8');
  if(d.ai==='drain'){const h=Math.ceil(dmg*.35);pt.hp=Math.min(pt.s.hp,pt.hp+h);}
  await say(`${NAMES.pet} ${special?'يستخدم '+d.move[0]+' على':'يهاجم'} ${e.name} — ${AR(dmg)} ضررًا.`,800);
  await killCheck(e);
}
async function tameAction(e){
  if(!e||!e.alive){e=aliveEnemies()[0];if(!e)return;}
  anim('hero','cast');
  if(!tameable(e)){await say(`لا يمكن ترويض ${e.name}.`,900);return;}
  P.pets=P.pets||[];
  if(P.pets.length>=PET_MAX){await say('معك ثمانية وحوش. أطلق واحدًا من القائمة أولًا.',1100);return;}
  const ratio=e.hp/e.max;
  if(ratio>.6){await say(`${e.name} ما زال قويًا. أضعفه أولًا ثم روّضه.`,1100);return;}
  const bait=(P.inv.tamebait||0)>0;if(bait)P.inv.tamebait--;
  const ch=clamp((1-ratio)*.8+(stat('luk')-6)*.004+(bait?.2:0),.05,.92);
  SFX.play('mystic');fx('heal',e.x,eMid(e));await say(`ناصر يمدّ يده بهدوء نحو ${e.name}${bait?' ومعه علف الترويض':''}…`,1000);
  if(Math.random()<ch){
    e.alive=false;e.dieT=time;e.hp=0;B.xp+=e.d.xp;P.kills[e.type]=(P.kills[e.type]||0)+1;
    P.pets.push({type:e.type,hp:null,t:Date.now()});if(P.petActive==null)P.petActive=P.pets.length-1;
    SFX.play('itemGet');fx('summon',e.x,eMid(e));await say(`نجح الترويض! انضم ${e.name} إلى وحوشك.`,1200);achUnlock('tame1');if(new Set(P.pets.map(p=>p.type)).size>=5)achUnlock('tame5');
    $('menuDot').hidden=false;
  }else{SFX.play('error');await say(`${e.name} يقاوم ويرفض الترويض!`,900);}
}

/* ---------- the monster show ---------- */
function expoBoard(){
  const p=activePet(),day=dayNow();
  if(!P.flags.tamer||!p)return '<p class="muted">يُعرض في المعرض وحش مروّض واحد. روّض وحشًا واجعله مرافقًا، ثم عد.</p>';
  const s=petStats(p);
  return `<p class="muted">الحكّام ينظرون إلى قوة الوحش ومستواه، وندرته، وتنوّع الوحوش التي روّضتها. مرة واحدة كل يوم.</p>
  <div class="row"><img class="pic" style="width:72px;height:56px;border-radius:10px;background:#3c4a2c" src="${beastPic(p.type)}" alt=""><span class="grow"><span class="val">${ENEMIES[p.type].name}</span><span class="chips"><span class="chip">المستوى ${AR(petLevel(p))}</span><span class="chip">الهجوم ${AR(s.atk)}</span><span class="chip">وحوشك ${AR((P.pets||[]).length)}</span></span></span>
  ${P.expoDay===day?'<span class="chip">شاركت اليوم</span>':'<button type="button" class="btn" data-expo="1">اعرض وحشك</button>'}</div>${P.expoLast?`<div class="quest" style="margin-top:10px">${P.expoLast}</div>`:''}`;
}
function runExpo(){
  const p=activePet();if(!p||P.expoDay===dayNow())return;
  const kinds=new Set(P.pets.map(q=>q.type)).size,score=petLevel(p)*10+ENEMIES[p.type].lv*3+kinds*12+Math.round(Math.random()*60);
  const base=levelOf(P.xp)*10,riv=[base+120+Math.random()*120,base+170+Math.random()*140,base+220+Math.random()*160].map(Math.round);
  const place=1+riv.filter(r=>r>score).length,prize=[0,3000,1200,400,0][place];
  P.expoDay=dayNow();P.money+=prize;
  if(place===1){P.expoWins=(P.expoWins||0)+1;if(!P.inv.expomedal){P.inv.expomedal=1;$('menuDot').hidden=false;}achUnlock('expo');SFX.play('fanfare');}else SFX.play('quest');
  P.expoLast=`<b>${['','المركز الأول!','المركز الثاني','المركز الثالث','المركز الرابع'][place]}</b><p class="muted" style="margin:4px 0 0">درجة ${ENEMIES[p.type].name}: ${AR(score)}. منافسوك: ${riv.map(AR).join('، ')}.${prize?` ربحت ${baisa(prize)}.`:''}${place===1&&P.expoWins===1?' وحصلت على وسام المعرض.':''}</p>`;
  renderShop();saveGame();
}

/* =========================================================
   CHAPTER CONTENT
   ========================================================= */
Object.assign(ITEMS,{
  tamebait:{name:'علف الترويض',tool:true,icon:'leaf',col:'#7a9a4a',price:120,desc:'يُستعمل تلقائيًا عند الترويض ويرفع فرصة النجاح.'},
  oryxhorn:{name:'قرن المها البيضاء',key:true,icon:'spike',col:'#efe7d6',desc:'كان قرن المها أسود، ثم ابيضّ حين زال عنها السحر.'},
  luban2:{name:'لبان ظفاري فاخر',use:'mp',amount:160,icon:'incense',col:'#e9dcc0',price:330,desc:'أجود لبان الجنوب. يعيد ١٦٠ من الطاقة.'},
  madhbi:{name:'لحم مضبي',use:'hp',amount:560,icon:'dates',col:'#7a3f1c',price:380,desc:'لحم مشوي على الحجر الحار. يعيد ٥٦٠ من الصحة.'},
  expomedal:{name:'وسام المعرض',slot:'acc',icon:'amulet',col:'#2f5f8f',stats:{luk:6,agi:4,hp:80},price:0,desc:'لمن فاز وحشه بالمركز الأول في معرض الوحوش.'},
});
Object.assign(SHOP,{
  dabab_inn:{title:'بيت سلامة',sub:'شاي ساخن وضباب على النوافذ',tabs:[['inn','الراحة'],['buy','شراء'],['sell','بيع']],stock:['madhbi','luban2','shuwa','qahwa2','honey','qahwa'],inn:{price:100,town:'dabab'}},
  dabab_smith:{title:'دكّان عوض',sub:'عتاد يحتمل المطر',tabs:[['buy','شراء'],['sell','بيع']],stock:tierStock(11,12)},
  luban_inn:{title:'نُزُل وضحى',sub:'رائحة اللبان في كل زاوية',tabs:[['inn','الراحة'],['buy','شراء'],['sell','بيع']],stock:['madhbi','luban2','tamebait','honey','qahwa'],inn:{price:120,town:'luban'}},
  luban_smith:{title:'مبخوت تاجر اللبان',sub:'لبان وعتاد من كل الجهات',tabs:[['buy','شراء'],['sell','بيع']],stock:tierStock(12,13).concat(['luban2'])},
  suhail:{title:'المروّض سهيل',sub:'علف وأسرار الترويض',tabs:[['buy','شراء']],stock:['tamebait']},
  expo:{title:'معرض الوحوش',sub:'في سوق اللبان، كل يوم',tabs:[['expo','المعرض']],stock:[]},
});
// long straight horns for the oryx
{const base=MONSTER_ART.beast;MONSTER_ART.beast=(g,t,p,o,e)=>{base(g,t,p,o,e);if(o.horns==='oryx'){g.strokeStyle=p.horn;g.lineWidth=2.6;g.lineCap='round';g.beginPath();g.moveTo(28,-46);g.lineTo(6,-82);g.moveTo(33,-46);g.lineTo(14,-84);g.stroke();}};}
const P8={
  wildcat:{body:'#8a7a5a',dark:'#5a4a36',belly:'#d9c9a6',eye:'#a8e05a',spot:'#3a2a1a'},
  hornet:{body:'#e9b33c',belly:'#2a2018',wing:'rgba(230,240,250,.7)',dark:'#2a2018',eye:'#1a1a1a',beak:'#2a2018'},
  treant:{body:'#6b4a2b',light:'#8a6a3e',dark:'#3f2a18',crystal:'#5f8a44',eyeGlow:'200,255,120'},
  mistwolf:{body:'#a8b8b0',dark:'#6f8078',belly:'#d9e4de',eye:'#e9f4a8',horn:'#fff'},
  gazelle:{body:'#d9b072',dark:'#a8834e',belly:'#f6ecd8',eye:'#2a1a0a',horn:'#3a2a1a'},
  fallspirit:{core:'230,255,200',glow:'160,210,90',eye:'#1f3a1a'},
  fallbat:{body:'#3f5a4a',belly:'#6f8a7a',wing:'#2a4034',dark:'#1a2a20',eye:'#c9ff9a'},
  frog:{body:'#4f8a3a',light:'#8ac46a',dark:'#2f5a26'},
  mossgolem:{body:'#4f6a3a',light:'#7a9a52',dark:'#2f4026',crystal:'#a8e05a',eyeGlow:'220,255,140'},
  glowcap:{core:'200,255,230',glow:'90,220,160',eye:'#0a2a1a'},
  cavelynx:{body:'#4a4a52',dark:'#2a2a32',belly:'#7a7a82',eye:'#a8e0ff',horn:'#1a1a1a'},
  darkoryx:{body:'#4a4038',dark:'#2a2420',belly:'#7a6a5a',eye:'#ff5a3a',horn:'#1a1410'},
  blackoryx:{body:'#2a2420',dark:'#141010',belly:'#4a3e34',eye:'#ff3a2a',horn:'#0a0808'},
};
makeMonster('wildcat',{name:'القط البري',art:'beast',pal:P8.wildcat,opt:{spots:true,horns:'spike'},lv:56,role:'swift',weak:'fire',move:['خمشة',.3,1.65],drop:['pelt',.3],sfx:'growl'});
makeMonster('hornet',{name:'الدبور العملاق',art:'flyer',pal:P8.hornet,lv:57,role:'swift',fly:true,weak:'fire',ai:'poison',move:['لسعة',.4,1.2],drop:['honey',.3]});
makeMonster('gazelle',{name:'غزال الخريف',art:'beast',pal:P8.gazelle,opt:{horns:'spike'},lv:57,role:'swift',weak:'phys',move:['نطحة خفيفة',.25,1.4],drop:['madhbi',.1]});
makeMonster('treant',{name:'الجذع الحي',art:'elemental',pal:P8.treant,opt:{crystals:true,scale:1.2},lv:58,role:'tank',weak:'fire',resist:'sand',move:['ضربة الغصن',.3,1.5],drop:['luban2',.15],hpK:1.1});
makeMonster('mistwolf',{name:'ذئب الضباب',art:'beast',pal:P8.mistwolf,opt:{frost:true},lv:59,role:'brute',weak:'fire',move:['عضّة الضباب',.3,1.55],drop:['pelt',.3],sfx:'growl'});
makeMonster('fallspirit',{name:'روح الخريف',art:'spirit',pal:P8.fallspirit,lv:60,role:'caster',fly:true,weak:'fire',resist:'sand',ai:'sleep',move:['ضباب ينوّم',.35,1],drop:['luban2',.2]});
makeMonster('fallbat',{name:'خفاش الشلال',art:'flyer',pal:P8.fallbat,lv:62,role:'swift',fly:true,weak:'sand',ai:'drain',move:['امتصاص',.3,.95]});
makeMonster('frog',{name:'ضفدع الكهف',art:'blob',pal:P8.frog,lv:63,role:'caster',weak:'sand',resist:'phys',ai:'poison',move:['لعاب سام',.4,1.1],drop:['honey',.3]});
makeMonster('mossgolem',{name:'عملاق الطحلب',art:'elemental',pal:P8.mossgolem,opt:{crystals:true,scale:1.25},lv:64,role:'tank',weak:'fire',resist:'phys',move:['ضربة الطحلب',.3,1.5],drop:['madhbi',.15],hpK:1.15});
makeMonster('glowcap',{name:'الفطر المضيء',art:'spirit',pal:P8.glowcap,lv:65,role:'caster',fly:true,weak:'fire',ai:'magic',move:['ضوء حارق',.55,1.05],drop:['luban2',.25]});
makeMonster('cavelynx',{name:'وشق الظلام',art:'beast',pal:P8.cavelynx,opt:{horns:'spike'},lv:66,role:'swift',weak:'fire',move:['انقضاض الظلام',.3,1.7],sfx:'growl'});
makeMonster('darkoryx',{name:'المها المسحورة',art:'beast',pal:P8.darkoryx,opt:{horns:'oryx',scale:1.15},lv:67,role:'brute',weak:'phys',move:['طعنة القرون',.3,1.6],hpK:1.1});
makeMonster('blackoryx',{name:'المها السوداء',art:'beast',pal:P8.blackoryx,opt:{horns:'oryx',scale:2.3},lv:70,boss:true,weak:'phys',resist:'fire',hpK:.8,
  intro:['ينشق الظلام عن مها عظيمة سوداء، قرناها كالرماح!','في عينيها نار حمراء ليست منها، ومن قلبها تتسرب بذرة سوداء.'],
  moves:{hit:{name:'طعنة القرنين',k:1.08},big:{name:'دوامة الذبول',k:.98,fx:'sand',sfx:'eMagic',status:'poison',say:'المها تدور، فينتشر الذبول في الفريق!'},every:3,rage:'تصهل المها صهيلًا يهز الكهف كله!'},
  onWin:()=>{P.flags.c8boss=1;['oryxhorn',gearId('weapon',14)].forEach(id=>P.inv[id]=(P.inv[id]||0)+1);P.inv.madhbi=(P.inv.madhbi||0)+3;return ` خرجت من قلب المها بذرة سوداء وتحطّمت، وابيضّ قرنها. ووجدتم ${ITEMS[gearId('weapon',14)].name}.`;},
  after:()=>openCard('الفصل الثامن','نهاية الفصل الثامن','عادت المها بيضاء إلى غابات الخريف، وهدأت الوحوش.<br>لكن البذرة السوداء تحمل ختمًا واحدًا: ختم «الكسوف»… وهو قادم من الشمال.<br>يتبع: الفصل التاسع، حرب المدن',()=>notify('عودا إلى الشيخ مرزوق في عين الضباب<small>الغابة تتنفس من جديد</small>',4)),
});

const H8=(x,base,w,trim)=>({x,base,w,wallH:96,roofH:50,door:.5,trim,roof:['#5f6a3a','#3f4a26']});
defineArea({id:'dabab',name:'عين الضباب',kind:'town',biome:'lush',W:1040,H:780,seed:81,
  plaza:{x:520,y:440,rx:130,ry:84},
  paths:[{pts:[[650,440],[1040,440]],w:52},{pts:[[390,440],[120,440]],w:46},{pts:[[520,524],[520,720]],w:50},{pts:[[520,356],[520,210]],w:44}],
  houses:[H8(150,340,170,'#2f5f8f'),H8(720,340,170,'#a8322a'),H8(150,680,170,'#2f6b4f'),H8(730,690,170,'#c9a046')],
  ponds:[{x:520,y:150,rx:110,ry:30,solid:true}],
  lamps:[[450,370],[590,370],[450,510],[590,510]],
  features:[{kind:'waterfall',x:520,y:130,w:46,h:120,col:0},{kind:'post',x:580,y:710,col:10},{kind:'chest',id:'dabab1',x:960,y:720,loot:[['madhbi',2]],money:600,col:12}],
  exits:[{edge:'e',x:1040,y:440,r:40,to:'kharif',at:{x:40,y:460},dir:'right',need:'c8_marzouq',block:'الشيخ مرزوق يريد أن يكلمكما قبل أن تدخلا الغابة'}],
  keep:[[520,160,140],[580,710,50],[960,720,40]],density:18,rockShare:.2,bareShare:.4,
  inn:{x:490,y:590},innName:'بيت سلامة',arrive:{x:520,y:660,dir:'up'},mist:()=>P.flags.c8boss?.15:.35});
defineArea({id:'kharif',name:'غابة الخريف',kind:'field',biome:'lush',W:1700,H:880,seed:82,
  paths:[{pts:[[0,460],[240,460],[420,340],[700,360],[860,560],[1120,560],[1320,380],[1500,400],[1700,480]],w:62},{pts:[[700,360],[760,180]],w:40},{pts:[[1120,560],[1180,780]],w:38}],
  ponds:[{x:420,y:640,rx:120,ry:46,solid:true},{x:1000,y:250,rx:110,ry:40,solid:true},{x:1460,y:700,rx:120,ry:44,solid:true}],
  features:[{kind:'waterfall',x:1000,y:230,w:40,h:110,col:0},{kind:'cave',x:760,y:170,col:50},{kind:'chest',id:'khf1',x:1190,y:790,loot:[[gearId('acc',12),1],['madhbi',2]],col:12},{kind:'chest',id:'khf2',x:300,y:780,loot:[[gearId('feet',12),1]],money:900,col:12},
    {kind:'sign',x:80,y:410,col:10,text:'غابة الخريف<small>إلى سوق اللبان شرقًا، وكهف الشلال في الشمال</small>'}],
  exits:[{edge:'w',x:0,y:460,r:50,to:'dabab',at:{x:1000,y:440},dir:'left'},{edge:'e',x:1700,y:480,r:50,to:'luban',at:{x:40,y:470},dir:'right'}],
  keep:[[760,170,100],[1190,790,40],[300,780,40],[80,410,30]],density:110,rockShare:.15,bareShare:.4,
  enc:{groups:[['wildcat'],['hornet','hornet'],['gazelle','gazelle'],['treant'],['mistwolf'],['wildcat','hornet'],['mistwolf','gazelle'],['treant','hornet']],night:[['fallspirit'],['fallspirit','mistwolf'],['fallspirit','fallspirit'],['mistwolf','mistwolf']]},
  mist:()=>P.flags.c8boss?.2:.5});
defineArea({id:'luban',name:'سوق اللبان',kind:'town',biome:'luban',W:1100,H:780,seed:83,
  plaza:{x:550,y:450,rx:150,ry:90},
  paths:[{pts:[[400,450],[0,450]],w:52},{pts:[[700,450],[1060,450]],w:50},{pts:[[550,540],[550,740]],w:50},{pts:[[550,360],[550,200]],w:44}],
  houses:[{x:130,base:340,w:170,wallH:96,roofH:50,door:.5,trim:'#2f5f8f',roof:['#9a6a4a','#6e4430']},{x:800,base:340,w:170,wallH:96,roofH:50,door:.5,trim:'#a8322a',roof:['#9a6a4a','#6e4430']},AR6(150,700,160),{x:790,base:710,w:180,wallH:96,roofH:50,door:.5,trim:'#2f6b4f',roof:['#9a6a4a','#6e4430']}],
  lamps:[[470,380],[630,380],[470,520],[630,520]],
  features:[{kind:'expo',x:550,y:220,col:30},{kind:'post',x:610,y:720,col:10}],
  exits:[{edge:'w',x:0,y:450,r:44,to:'kharif',at:{x:1660,y:480},dir:'left'}],
  keep:[[550,220,90],[610,720,40]],density:16,rockShare:.25,bareShare:.3,
  inn:{x:520,y:600},innName:'نُزُل وضحى',arrive:{x:550,y:660,dir:'up'}});
const GROT_ENC=[
  {groups:[['fallbat'],['frog'],['fallbat','frog'],['mossgolem']]},
  {groups:[['mossgolem','glowcap'],['cavelynx'],['frog','frog','fallbat'],['glowcap','glowcap']]},
  {groups:[['darkoryx'],['cavelynx','glowcap'],['mossgolem','darkoryx'],['cavelynx','cavelynx']]},
];
const GROT_LOOT=[[[gearId('head',13),1],['madhbi',2]],[[gearId('body',13),1]],[[gearId('feet',13),1],['luban2',2]],[[gearId('acc',13),1],['tamebait',3]],[[gearId('head',14),1],['madhbi',3]],[[gearId('body',14),1]]];
['grotto1','grotto2','grotto3'].forEach((id,i)=>defineArea({id,name:`كهف الشلال، الطابق ${['الأول','الثاني','الثالث'][i]}`,kind:'dungeon',biome:'grotto',W:1400,H:1000,seed:171+i*23,rooms:i===2?7:8,enc:GROT_ENC[i],bossRoom:i===2,
  features:[],place(sc){
    const F=sc.area.features;
    F.push({kind:'stairsUp',x:sc.start.x,y:sc.start.y-20,to:i?['grotto1','grotto2'][i-1]:'kharif',at:null,dir:'down'});
    if(i<2)F.push({kind:'stairs',x:sc.end.x,y:sc.end.y-20,to:['grotto2','grotto3'][i],at:null,dir:'down'});
    else F.push({kind:'heart',spr:'idol',x:sc.end.x,y:sc.end.y-10,col:26,onAct:()=>{if(P.flags.c8boss){showToast('note','الكهف هادئ، والماء يقطر من السقف',2.6);return;}startEncounter({types:['blackoryx','darkoryx'],boss:true});}});
    sc.mid.slice(0,2).forEach((m,k)=>F.push({kind:'chest',id:`${id}_${k}`,x:m.x+30,y:m.y,loot:GROT_LOOT[i*2+k],money:800+i*250,col:12}));
    sc.spawn={x:sc.start.x,y:sc.start.y+36};
  }}));
{const f=id=>AREAS[id].area.features,st=id=>AREAS[id].start,en=id=>AREAS[id].end;
  f('grotto1')[0].at={x:760,y:220};
  for(let i=1;i<=2;i++){f('grotto'+i)[1].at={x:st('grotto'+(i+1)).x,y:st('grotto'+(i+1)).y+36};f('grotto'+(i+1))[0].at={x:en('grotto'+i).x,y:en('grotto'+i).y+30};}
  AREAS.kharif.area.features.find(q=>q.kind==='cave').onAct=()=>{if(!P.flags.tamer){showToast('note','من داخل الكهف يأتي زئير وحوش هائجة<small>المروّض سهيل في سوق اللبان يعرف كيف تهدأ الوحوش</small>',3.4);SFX.play('blocked');return;}SFX.play('rustle');enterArea('grotto1',{x:st('grotto1').x,y:st('grotto1').y+36},'down');};
  AREAS.luban.area.features.find(q=>q.kind==='expo').onAct=()=>openShop('expo');}

{const K=NPCS.find(n=>n.id==='khalfan'),prevL=K.linesFn,prevS=K.onSaid;
  K.linesFn=()=>P.flags.c7boss&&!P.flags.ch8?['الدهاليز هادئة! رجع العمّال للمنجم.','خذوا نصيبكم من نحاس الشهر.','وجاءنا راعٍ من الجنوب الغربي يقول إن الخريف هذا العام غريب: الضباب كثيف، والوحوش جنّت، والمها البيضاء صارت سوداء.','القافلة تعرف الطريق إلى عين الضباب.']:prevL();
  K.onSaid=said=>{prevS(said);if(P.flags.c7boss&&P.flags.c7_reward&&!P.flags.ch8){P.flags.ch8=1;P.flags.town_dabab=1;
    openCard('الفصل الثامن','غابات الخريف','في الجنوب الغربي، حيث يأتي الخريف بالضباب والمطر، جنّت الوحوش واسودّت المها.<br>وفي سوق اللبان مروّض يعرف كيف تهدأ القلوب البرية.',()=>notify('سافرا بالقافلة إلى عين الضباب<small>من محطة القوافل في أي مدينة</small>',4));}};}
areaNpc('marzouq','الشيخ مرزوق','dabab',520,372,LK('m',{age:'old',robe:'#e9e2d2',hw:['#2f6b4f','#e9c86a','#f3ead8'],hair:'#efebe2',beard:'#f2eee6',skin:'#8a5a3a',cane:true}),{
  linesFn:()=>P.flags.c8boss?['الغابة تتنفس من جديد! والمها البيضاء رجعت ترعى عند الشلال.','خذوا هذا، فالضباب الطيب لا يأتي إلا مع الطيبين.']:P.flags.c8_marzouq?['سوق اللبان في آخر الغابة شرقًا. المروّض سهيل هناك.']:
    ['يا مرحبا. هذه عين الضباب، يأتيها الخريف كل عام بالمطر والخضرة.','لكن هذا العام جاء معه شيء غريب: الوحوش تهجم على كل من يدخل الغابة.','والمها البيضاء، سيدة الغابة، رآها الرعاة سوداء عند كهف الشلال.','لا يُدخل الكهف بالسيف وحده. اذهبا إلى سوق اللبان، إلى المروّض سهيل.'],
  onSaid:()=>{if(!P.flags.c8_marzouq){P.flags.c8_marzouq=1;SFX.play('quest');notify('فُتح طريق غابة الخريف شرق القرية<small>إلى سوق اللبان</small>',3.6);}
    else if(P.flags.c8boss&&!P.flags.c8_reward){P.flags.c8_reward=1;P.inv.madhbi=(P.inv.madhbi||0)+5;P.money+=3000;SFX.play('itemGet');notify('أعطاكم الشيخ مرزوق ٥ قطع مضبي و٣٠٠٠ بيسة',3.4);}}});
areaNpc('salama','سلامة','dabab',236,380,LK('f',{dress:'#2f6b4f',dressSh:'#235040',scarf:'#c9a046',scarfSh:'#a8862e'}),{shop:'dabab_inn',lines:['تعالوا عن المطر! الشاي حار والفراش دافئ.']});
areaNpc('awad','عوض','dabab',805,380,LK('m',{robe:'#5a6a4a',robeSh:'#3f4a34',head:'kumma',hw:['#f7f3ea','#2f6b4f']}),{shop:'dabab_smith',lines:['عتاد خفيف وقوي، ما يثقل عليك في الطين.']});
areaNpc('najma','نجمة','dabab',560,470,LK('f',{child:true,dress:'#e86a8a',dressSh:'#c24f6e',scarf:'#f3a83b',scarfSh:'#cf8424'}),{wander:{x0:440,x1:620,y0:390,y1:500,speed:30},
  linesFn:()=>P.flags.c8boss?['شفت المها البيضاء! كانت تشرب من الشلال!']:['أبوي يقول الغزلان كانت تاكل من يدي… الحين تهرب وتنطح.']});
areaNpc('suhail','المروّض سهيل','luban',470,330,LK('m',{robe:'#8a7a5a',robeSh:'#6b5e44',hw:['#5f8a44','#e9c86a','#f3ead8'],beard:'#3a2a1c',skin:'#7a4a2a'}),{
  linesFn:()=>P.flags.tamer?['الوحوش تحس بالقلب الهادي. أضعفها أولًا، ثم مدّ يدك بهدوء.','وعندي علف الترويض، يرفع فرصتك كثيرًا.']:
    ['أنت من عين الوادي؟ سمعت عنكما. أنا سهيل، أروّض الوحوش من صغري.','الوحوش ما جنّت من نفسها. في قلوبها بذرة سوداء، تجعلها تكره كل شيء.','سأعلّمك الترويض: أضعف الوحش حتى ينهك، ثم مدّ يدك له بهدوء. إن قبلك، صار رفيقك يقاتل معك.','الوحش المروّض يتحرر من البذرة. ومن يروّض وحوش الغابة يستطيع أن يدخل كهف الشلال.'],
  onSaid:()=>{if(!P.flags.tamer){P.flags.tamer=1;P.inv.tamebait=(P.inv.tamebait||0)+3;SFX.play('quest');notify('تعلّمت الترويض!<small>في المعركة: «مهارات» ← «ترويض». ومعك ٣ علف ترويض هدية</small>',4.4);$('menuDot').hidden=false;}
    else setTimeout(()=>{if(state==='play')openShop('suhail');},150);}});
areaNpc('wadha','وضحى','luban',215,380,LK('f',{dress:'#a8322a',dressSh:'#7a2018',scarf:'#2f4f7a',scarfSh:'#1f3554'}),{shop:'luban_inn',lines:['حيّاكم في نُزُل وضحى. اللبان يطرد التعب.']});
areaNpc('makhbout','مبخوت','luban',885,380,LK('m',{robe:'#cdb08a',robeSh:'#a98c66',hw:['#a8322a','#e9c86a','#f3ead8'],skin:'#8a5a3a'}),{shop:'luban_smith',lines:['لبان حوجري ونجدي وشزري! وعندي عتاد ما تلقاه إلا هنا.']});
areaNpc('judge','حَكَم المعرض','luban',640,250,LK('m',{age:'old',robe:'#f3ead8',hw:['#2f5f8f','#e9c86a','#f3ead8'],hair:'#efebe2',beard:'#f2eee6'}),{
  linesFn:()=>['معرض الوحوش يجمع أمهر المروّضين. أحضروا أقوى وحوشكم.','لا نحكم على القوة وحدها، بل على الندرة وتنوّع ما روّضتم.']});

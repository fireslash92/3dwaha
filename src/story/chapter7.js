// الفصل السابع: مغارات الجن والآثار — بيت المنجم، وادي الأبراج، مدينة الأبراج وحلبتها، دهاليز الجن، وعفريت الدهاليز
'use strict';

/* ---------- items & shops ---------- */
Object.assign(ITEMS,{
  tombkey:{name:'مفتاح الدهاليز',key:true,icon:'key',col:'#c9a046',desc:'من الشيخ مرهون، لأبطال الحلبة. يفتح باب المقبرة الكبرى في مدينة الأبراج.'},
  jinnseal:{name:'ختم الأبراج',key:true,icon:'gem',col:'#a87ae0',desc:'الختم القديم الذي كان يحبس الجن. عاد كاملًا بين يديك.'},
  copper:{name:'خام النحاس',mat:true,sell:90,icon:'stone',col:'#b87333',desc:'من مناجم الوادي. يحبه التجار.'},
  shuwa:{name:'شواء',use:'hp',amount:380,icon:'dates',col:'#7a3f1c',price:260,desc:'لحم مطبوخ في التنور تحت الأرض. يعيد ٣٨٠ من الصحة.'},
  qahwa2:{name:'قهوة الهيل والزعفران',use:'mp',amount:110,icon:'cup',col:'#6b3f22',price:220,desc:'قهوة قوية للمسافرين. تعيد ١١٠ من الطاقة.'},
  beltchamp:{name:'حزام البطل',slot:'acc',icon:'ring',col:'#d9a23a',stats:{atk:6,def:4,hp:60},price:0,desc:'حزام فضي مطرّز، لأبطال الحلبة البرونزية.'},
});
Object.assign(SHOP,{
  manjam_inn:{title:'نُزُل نوال',sub:'دافئ مثل قلب الجبل',tabs:[['inn','الراحة'],['buy','شراء'],['sell','بيع']],stock:['shuwa','harees','zaatar','qahwa2','qahwa'],inn:{price:60,town:'manjam'}},
  manjam_smith:{title:'كور جابر',sub:'يصهر نحاس الوادي وحديده',tabs:[['buy','شراء'],['sell','بيع']],stock:tierStock(8,9),sellMult:1.3,sellFilter:id=>!!ITEMS[id].mat},
  abraj_inn:{title:'دار فاطمة',sub:'بين الأبراج القديمة',tabs:[['inn','الراحة'],['buy','شراء'],['sell','بيع']],stock:['shuwa','qahwa2','harees','honey','qahwa'],inn:{price:80,town:'abraj'}},
  abraj_smith:{title:'تحف هلال',sub:'عتاد من كنوز الأبراج',tabs:[['buy','شراء'],['sell','بيع']],stock:tierStock(9,10,11)},
  arena:{title:'حلبة الأبراج',sub:'الشيخ مرهون يحكم بين المتبارزين',tabs:[['arena','المباريات']],stock:[]},
});

/* ---------- monsters ---------- */
const P7={
  rockscorp:{body:'#8a4a2a',light:'#b86a42',dark:'#4a2a18',sting:'#e9c24a'},
  vulture:{body:'#5a4a3a',belly:'#a8916a',wing:'#3f3428',dark:'#2a2018',eye:'#e9c24a',beak:'#d9c9a6'},
  caracal:{body:'#c98a5a',dark:'#8a5a3a',belly:'#efd8b8',eye:'#a8e05a',horn:'#2a1a10'},
  rockgolem:{body:'#a8683e',light:'#d99a6a',dark:'#6b3f22',crystal:'#e9c24a',eyeGlow:'255,180,80'},
  bandit:{body:'#6b5236',trim:'#a8322a',head:'#2a2a2a',dark:'#3a2a1a',skin:'#a8714a',weapon:'#c9d1d6',shield:'#5a4030'},
  dustjinn:{core:'255,230,180',glow:'220,150,80',eye:'#3a1a0a'},
  jinnling:{core:'230,200,255',glow:'150,90,220',eye:'#2a0a3a'},
  shade:{core:'120,100,150',glow:'40,30,60',eye:'#ff5a8a'},
  tombguard:{body:'#bfa77c',trim:'#6b4a2b',head:'#e6d2a4',dark:'#5a4030',skin:'#a8916a',weapon:'#c9a046',shield:'#8a6a4a'},
  obsidian:{body:'#2a2230',light:'#5a4a6a',dark:'#120c1a',crystal:'#a87ae0',eyeGlow:'200,120,255'},
  jinnwarrior:{body:'#4a2a6a',trim:'#c9a046',head:'#7a5aa0',dark:'#1a1424',skin:'#7a5aa0',weapon:'#a87ae0',shield:'#3a2e4e'},
  shadowwolf:{body:'#3a2e4e',dark:'#1a1424',belly:'#5a4a6a',eye:'#ff5a8a',horn:'#000'},
  gladiator:{body:'#8a3a2a',trim:'#c9a046',head:'#c9d1d6',dark:'#3a2a1a',skin:'#a8714a',weapon:'#c9d1d6',shield:'#a8322a'},
  arenalion:{body:'#c9a046',dark:'#8a6a2a',belly:'#efd8a8',eye:'#3a2a0a',mane:'#8a5a2a'},
  champion:{body:'#2f4f7a',trim:'#e9c86a',head:'#c9a046',dark:'#1f2e44',skin:'#8a5a3a',weapon:'#efe7d6',shield:'#2f6b4f'},
  arenajinn:{core:'255,200,200',glow:'220,80,80',eye:'#2a0a0a'},
  grandchamp:{body:'#1f1f2a',trim:'#d9a23a',head:'#d9a23a',dark:'#111',skin:'#6a4a32',weapon:'#ffe9a8',shield:'#a8322a'},
  ifrit:{body:'#8a2a1a',light:'#c94a2a',dark:'#3a0a0a',horn:'#2a1a1a',eye:'#ffcc33',glow:'255,120,40'},
};
makeMonster('rockscorp',{name:'عقرب الصخر',art:'scorp',pal:P7.rockscorp,lv:40,role:'tank',weak:'sand',resist:'phys',ai:'poison',move:['لدغة الصخر',.35,1.3],drop:['copper',.3]});
makeMonster('vulture',{name:'نسر الجبل',art:'flyer',pal:P7.vulture,lv:41,role:'swift',fly:true,weak:'sand',move:['انقضاض',.3,1.65],drop:['pelt',.2]});
makeMonster('caracal',{name:'الوشق',art:'beast',pal:P7.caracal,opt:{horns:'spike'},lv:42,role:'swift',weak:'fire',move:['خمشة الوشق',.3,1.7],drop:['pelt',.3],sfx:'growl'});
makeMonster('rockgolem',{name:'عملاق الصخر',art:'elemental',pal:P7.rockgolem,opt:{crystals:true,scale:1.15},lv:43,role:'tank',weak:'sand',resist:'phys',move:['ضربة الجلمود',.3,1.5],drop:['copper',.5],hpK:1.1});
makeMonster('bandit',{name:'لصّ القوافل',art:'warrior',pal:P7.bandit,lv:44,role:'brute',move:['ضربة غادرة',.3,1.55],drop:['shuwa',.15]});
makeMonster('dustjinn',{name:'جنّي الغبار',art:'spirit',pal:P7.dustjinn,lv:45,role:'caster',fly:true,weak:'phys',resist:'sand',ai:'magic',move:['زوبعة',.55,1],drop:['qahwa2',.2]});
makeMonster('jinnling',{name:'جنّي صغير',art:'spirit',pal:P7.jinnling,lv:46,role:'caster',fly:true,weak:'phys',resist:'fire',ai:'sleep',move:['همس ينوّم',.35,1],drop:['qahwa2',.2]});
makeMonster('shade',{name:'ظلّ الدهاليز',art:'spirit',pal:P7.shade,lv:47,role:'swift',fly:true,weak:'fire',ai:'drain',move:['لمسة الظل',.35,.95],drop:['shuwa',.15]});
makeMonster('tombguard',{name:'حارس المقبرة',art:'warrior',pal:P7.tombguard,opt:{scale:1.15},lv:48,role:'tank',weak:'fire',move:['ضربة الحارس',.3,1.5],drop:['copper',.4],hpK:1.1});
makeMonster('obsidian',{name:'تمثال البازلت',art:'elemental',pal:P7.obsidian,opt:{crystals:true,scale:1.25},lv:49,role:'tank',weak:'sand',resist:'phys',move:['زلزال أسود',.3,1.55],drop:['copper',.5],hpK:1.15});
makeMonster('jinnwarrior',{name:'محارب الجن',art:'warrior',pal:P7.jinnwarrior,opt:{scale:1.2},lv:50,role:'brute',weak:'phys',resist:'fire',move:['سيف الجن',.3,1.6],drop:['qahwa2',.25],hpK:1.1});
makeMonster('shadowwolf',{name:'ذئب الظلال',art:'beast',pal:P7.shadowwolf,lv:51,role:'swift',weak:'fire',ai:'drain',move:['عضّة الظلال',.3,1],drop:['pelt',.3],sfx:'growl'});
makeMonster('gladiator',{name:'مصارع الحلبة',art:'warrior',pal:P7.gladiator,lv:42,role:'brute',move:['ضربة الدرع',.3,1.5]});
makeMonster('arenalion',{name:'أسد الحلبة',art:'beast',pal:P7.arenalion,opt:{mane:true,scale:1.15},lv:44,role:'brute',weak:'fire',move:['زئير ومخلب',.3,1.6],sfx:'growl',hpK:1.15});
makeMonster('champion',{name:'بطل الأبراج',art:'warrior',pal:P7.champion,opt:{scale:1.15},lv:48,role:'swift',move:['ضربة البطل',.35,1.7],hpK:1.25});
makeMonster('arenajinn',{name:'جنّي الحلبة',art:'spirit',pal:P7.arenajinn,lv:50,role:'caster',fly:true,weak:'phys',resist:'fire',ai:'magic',move:['نار حمراء',.55,1.05]});
makeMonster('grandchamp',{name:'سيّد الحلبة',art:'warrior',pal:P7.grandchamp,opt:{scale:1.3},lv:58,role:'brute',move:['ضربة السيّد',.35,1.75],hpK:2.2});
makeMonster('ifrit',{name:'عفريت الدهاليز',art:'ifrit',pal:P7.ifrit,lv:54,boss:true,weak:'sand',resist:'fire',hpK:.85,
  intro:['تشتعل النيران الخضراء في المشاعل، ويرتفع من الأرض عفريت عظيم!','«من كسر الختم حرّرني… ومن جاء ليعيده سيحترق!»'],
  moves:{hit:{name:'قبضة اللهب',k:1.25},big:{name:'نار الجن',k:1.15,fx:'fire',sfx:'fire',status:'sleep',say:'العفريت يطلق نار الجن، فيدوخ الفريق!'},every:3,rage:'يتضاعف لهب العفريت حتى يضيء الدهليز كله!'},
  onWin:()=>{P.flags.c7boss=1;['jinnseal',gearId('weapon',11)].forEach(id=>P.inv[id]=(P.inv[id]||0)+1);P.inv.shuwa=(P.inv.shuwa||0)+3;return ` عاد الختم كاملًا بعد أن خمدت نار العفريت، ووجدتم ${ITEMS[gearId('weapon',11)].name}.`;},
  after:()=>openCard('الفصل السابع','نهاية الفصل السابع','عاد ختم الأبراج إلى مكانه، وهدأت الدهاليز تحت المدينة.<br>يتبع: الفصل الثامن، غابات الخريف',()=>notify('عودا إلى المعلّم خلفان في بيت المنجم<small>عمّال المنجم ينتظرون الخبر</small>',4)),
});

/* ---------- the arena ---------- */
const RANKS={
  bronze:{name:'الحلبة البرونزية',lv:42,bouts:[['gladiator'],['arenalion','gladiator'],['champion']],prize:800,item:'beltchamp'},
  silver:{name:'الحلبة الفضية',lv:50,bouts:[['gladiator','gladiator'],['arenalion','arenalion'],['champion','arenajinn'],['champion','champion']],prize:2000,item:gearId('weapon',10),need:'bronze'},
  gold:{name:'الحلبة الذهبية',lv:58,bouts:[['arenajinn','arenajinn'],['champion','arenalion','arenajinn'],['grandchamp','champion'],['grandchamp']],prize:5000,item:gearId('body',12),need:'silver',needFlag:'c7boss'},
};
let ARENA_RUN=null;
function arenaBoard(){
  const done=P.arena||{};
  return `<p class="muted">مباريات متتالية بلا راحة بينها، فصحتكم وطاقتكم تبقى كما هي من جولة إلى جولة. لا هروب في الحلبة. إن خسرتم تعودون سالمين بلا جائزة.</p><div class="list">${Object.entries(RANKS).map(([id,r])=>{
    const locked=(r.need&&!done[r.need])||(r.needFlag&&!P.flags[r.needFlag]),it=ITEMS[r.item];
    return `<div class="row"><span class="grow"><span class="val">${r.name}${done[id]?' <span class="chip up">فزتم بها</span>':''}</span><span class="lbl">${AR(r.bouts.length)} مباريات. المستوى المناسب ${AR(r.lv)} تقريبًا.</span><span class="chips"><span class="chip up">الجائزة ${baisa(r.prize)}</span><span class="chip">${done[id]?'المرة الأولى فقط: ':''}${it.name}</span></span></span>${locked?`<span class="chip">${r.needFlag&&!P.flags[r.needFlag]&&!(r.need&&!done[r.need])?'بعد هزيمة العفريت':'مقفلة'}</span>`:`<button type="button" class="btn" data-arena="${id}">ابدأ</button>`}</div>`;}).join('')}</div>`;
}
function startArena(id){
  shopEl.hidden=true;gameEl.classList.remove('talking');state='play';resetInput();
  P.hp=null;P.mp=null;P.ally={hp:null,mp:null};ARENA_RUN={id,i:0};SFX.play('crowd');arenaBout();
}
function arenaBout(){const R=RANKS[ARENA_RUN.id];showToast('note',`${R.name}<small>المباراة ${AR(ARENA_RUN.i+1)} من ${AR(R.bouts.length)}</small>`,1.6);setTimeout(()=>startEncounter({types:R.bouts[ARENA_RUN.i].slice(),arena:ARENA_RUN.id}),700);}
function arenaAfter(result){
  state='play';talkCooldown=.5;fadeEl.classList.remove('on');
  const run=ARENA_RUN;if(!run)return;const R=RANKS[run.id];
  if(result!=='win'){ARENA_RUN=null;P.hp=null;P.mp=null;P.ally={hp:null,mp:null};P.gauge=0;healPets();notify(`خسرتم في المباراة ${AR(run.i+1)}<small>عالج الأطباء جراحكم. ارفعوا مستواكم وعودوا</small>`,3.6);return;}
  run.i++;
  if(run.i<R.bouts.length){SFX.play('crowd');arenaBout();return;}
  ARENA_RUN=null;P.arena=P.arena||{};const first=!P.arena[run.id];P.arena[run.id]=1;P.money+=R.prize;
  if(first){P.inv[R.item]=(P.inv[R.item]||0)+1;$('menuDot').hidden=false;}
  SFX.play('fanfare');SFX.play('crowd');
  notify(`فزتم في ${R.name}!<small>${baisa(R.prize)}${first?' و'+ITEMS[R.item].name:''}</small>`,4);
  if(run.id==='bronze'&&!P.flags.c7_bronze){P.flags.c7_bronze=1;P.inv.tombkey=1;notify('أعطاكم الشيخ مرهون مفتاح الدهاليز<small>باب المقبرة الكبرى غرب الساحة</small>',4);}
  if(run.id==='gold')achUnlock('arena');
  saveGame();
}

/* ---------- the areas ---------- */
const SH=(x,base,w,trim)=>({x,base,w,wallH:96,roofH:50,door:.5,trim,roof:['#9a6a4a','#6e4430']});
defineArea({id:'manjam',name:'بيت المنجم',kind:'town',biome:'canyon',W:1000,H:760,seed:71,
  plaza:{x:500,y:430,rx:120,ry:80},
  paths:[{pts:[[620,430],[1000,430]],w:52},{pts:[[380,430],[100,430]],w:46},{pts:[[500,510],[500,700]],w:50},{pts:[[500,350],[620,240],[790,200]],w:44}],
  rails:[[[520,330],[640,236],[800,196]]],
  houses:[SH(140,330,170,'#2f5f8f'),SH(130,660,170,'#a8322a'),SH(700,670,170,'#2f6b4f')],
  lamps:[[430,360],[570,360],[430,500],[570,500]],
  features:[{kind:'mine',x:830,y:200,col:50},{kind:'cart',x:700,y:250,col:16},{kind:'post',x:560,y:690,col:10},{kind:'chest',id:'manjam1',x:930,y:700,loot:[['shuwa',2],['copper',3]],money:300,col:12}],
  exits:[{edge:'e',x:1000,y:430,r:40,to:'wadiabraj',at:{x:40,y:420},dir:'right',need:'c7_khalfan',block:'المعلّم خلفان يريد أن يكلمكما أولًا'}],
  keep:[[830,200,90],[700,250,40],[560,690,50],[930,700,40]],density:14,rockShare:.5,bareShare:.3,
  inn:{x:470,y:570},innName:'نُزُل نوال',arrive:{x:500,y:640,dir:'up'}});
defineArea({id:'wadiabraj',name:'وادي الأبراج',kind:'field',biome:'canyon',W:1700,H:800,seed:72,
  paths:[{pts:[[0,420],[260,420],[420,300],[700,320],[860,520],[1100,520],[1300,320],[1500,360],[1700,470]],w:62},{pts:[[700,320],[760,140]],w:38},{pts:[[1100,520],[1180,700]],w:38}],
  rails:[[[300,600],[600,640],[900,680]]],
  features:[{kind:'mine',x:780,y:130,col:50},{kind:'cart',x:640,y:640,col:16},{kind:'chest',id:'wab1',x:880,y:150,loot:[[gearId('acc',9),1],['shuwa',2]],col:12},{kind:'chest',id:'wab2',x:1190,y:710,loot:[[gearId('feet',9),1]],money:420,col:12},
    {kind:'sign',x:80,y:370,col:10,text:'وادي الأبراج<small>إلى مدينة الأبراج شرقًا. القوافل لا تمر هنا وحدها</small>'}],
  exits:[{edge:'w',x:0,y:420,r:50,to:'manjam',at:{x:960,y:430},dir:'left'},{edge:'e',x:1700,y:470,r:50,to:'abraj',at:{x:40,y:470},dir:'right'}],
  keep:[[780,130,100],[640,640,40],[880,150,40],[1190,710,40],[80,370,30]],density:80,rockShare:.4,bareShare:.35,
  enc:{groups:[['rockscorp'],['vulture','vulture'],['caracal'],['rockgolem'],['bandit','bandit'],['caracal','vulture'],['rockscorp','bandit'],['rockgolem','rockscorp']],night:[['dustjinn'],['dustjinn','dustjinn'],['dustjinn','caracal'],['bandit','dustjinn']]}});
defineArea({id:'abraj',name:'مدينة الأبراج',kind:'town',biome:'ruins',W:1200,H:800,seed:73,
  plaza:{x:600,y:470,rx:150,ry:90},
  paths:[{pts:[[450,470],[0,470]],w:52},{pts:[[750,470],[1100,470]],w:52},{pts:[[600,560],[600,760]],w:52},{pts:[[600,380],[600,200]],w:46},{pts:[[600,300],[880,290]],w:40},{pts:[[600,300],[330,290]],w:40}],
  houses:[SH(130,720,170,'#2f5f8f'),SH(880,720,180,'#a8322a')],
  lamps:[[500,400],[700,400],[500,540],[700,540]],
  features:[{kind:'arena',x:900,y:250,col:70},{kind:'tomb',x:320,y:250,col:46},{kind:'column',x:470,y:180,v:1,col:12},{kind:'column',x:730,y:180,v:0,col:12},{kind:'column',x:1050,y:380,v:1,col:12},{kind:'column',x:160,y:390,v:0,col:12},{kind:'post',x:660,y:700,col:10}],
  exits:[{edge:'w',x:0,y:470,r:44,to:'wadiabraj',at:{x:1660,y:470},dir:'left'}],
  keep:[[900,250,120],[320,250,80],[660,700,40]],density:10,rockShare:.3,bareShare:.4,
  inn:{x:560,y:600},innName:'دار فاطمة',arrive:{x:600,y:660,dir:'up'}});
const JINN_ENC=[
  {groups:[['jinnling'],['shade'],['jinnling','shade'],['tombguard']]},
  {groups:[['tombguard','jinnling'],['shade','shade'],['obsidian'],['jinnling','jinnling','shade']]},
  {groups:[['obsidian','shade'],['jinnwarrior'],['tombguard','tombguard'],['jinnwarrior','jinnling']]},
  {groups:[['jinnwarrior','shadowwolf'],['shadowwolf','shadowwolf'],['obsidian','jinnwarrior'],['shadowwolf','shade','jinnling']]},
];
const JINN_LOOT=[[[gearId('head',10),1],['shuwa',2]],[[gearId('feet',10),1]],[[gearId('body',10),1],['qahwa2',2]],[[gearId('acc',10),1]],[[gearId('head',11),1],['shuwa',3]],[[gearId('body',11),1]],[[gearId('feet',11),1],['qahwa2',3]],[[gearId('acc',11),1],['dana',1]]];
['jinn1','jinn2','jinn3','jinn4'].forEach((id,i)=>defineArea({id,name:`دهاليز الجن، الطابق ${['الأول','الثاني','الثالث','الرابع'][i]}`,kind:'dungeon',biome:'jinn',W:1400,H:1000,seed:131+i*19,rooms:i===3?7:9,enc:JINN_ENC[i],bossRoom:i===3,
  features:[],place(sc){
    const F=sc.area.features;
    F.push({kind:'stairsUp',x:sc.start.x,y:sc.start.y-20,to:i?['jinn1','jinn2','jinn3'][i-1]:'abraj',at:null,dir:'down'});
    if(i<3)F.push({kind:'stairs',x:sc.end.x,y:sc.end.y-20,to:['jinn2','jinn3','jinn4'][i],at:null,dir:'down'});
    else F.push({kind:'heart',spr:'idol',x:sc.end.x,y:sc.end.y-10,col:26,onAct:()=>{if(P.flags.c7boss){showToast('note','الختم في مكانه، والنيران الخضراء انطفأت',2.6);return;}startEncounter({types:['ifrit','jinnwarrior'],boss:true});}});
    sc.mid.slice(0,2).forEach((m,k)=>F.push({kind:'chest',id:`${id}_${k}`,x:m.x+30,y:m.y,loot:JINN_LOOT[i*2+k],money:400+i*150,col:12}));
    sc.spawn={x:sc.start.x,y:sc.start.y+36};
  }}));
{const f=id=>AREAS[id].area.features,st=id=>AREAS[id].start,en=id=>AREAS[id].end;
  f('jinn1')[0].at={x:320,y:300};
  for(let i=1;i<=3;i++){f('jinn'+i)[1].at={x:st('jinn'+(i+1)).x,y:st('jinn'+(i+1)).y+36};f('jinn'+(i+1))[0].at={x:en('jinn'+i).x,y:en('jinn'+i).y+30};}
  const A=AREAS.abraj.area.features;
  A.find(q=>q.kind==='arena').onAct=()=>openShop('arena');
  A.find(q=>q.kind==='tomb').onAct=()=>{if(!P.flags.c7_bronze){showToast('note','باب المقبرة الكبرى مقفل<small>مفتاحه مع الشيخ مرهون، ولا يعطيه إلا لأبطال الحلبة</small>',3.2);SFX.play('blocked');return;}SFX.play('doorOpen');enterArea('jinn1',{x:st('jinn1').x,y:st('jinn1').y+36},'down');};}

/* ---------- people & story ---------- */
{const J=NPCS.find(n=>n.id==='jasim'),prevL=J.linesFn,prevS=J.onSaid;
  J.linesFn=()=>P.flags.c6boss&&!P.flags.ch7?['الضباب راح! شوف القوارب كيف رجعت تملأ الخور.','خذوا هذا، من صيد اليوم ومن خير البحر.','وسمعت من تجار القوافل خبرًا: عمّال بيت المنجم حفروا في الجبل، فوجدوا دهاليز قديمة.','ومن يومها والجن يخرجون منها في الليل. القافلة تعرف الطريق.']:prevL();
  J.onSaid=said=>{prevS(said);if(P.flags.c6boss&&P.flags.c6_reward&&!P.flags.ch7){P.flags.ch7=1;P.flags.town_manjam=1;
    openCard('الفصل السابع','مغارات الجن والآثار','في الجنوب، تحت المقابر القديمة، دهاليز لم يدخلها أحد منذ قرون.<br>والآن انكسر الختم الذي كان يحبس من فيها.',()=>notify('سافرا بالقافلة إلى بيت المنجم<small>من محطة القوافل في أي مدينة</small>',4));}};}
areaNpc('khalfan','المعلّم خلفان','manjam',500,360,LK('m',{robe:'#8a6a4a',robeSh:'#6b5236',head:'kumma',hw:['#f7f3ea','#6b4a2b'],beard:'#3a2a1c',skin:'#8a5a3a'}),{
  linesFn:()=>P.flags.c7boss?['الدهاليز هادئة! رجع العمّال للمنجم، والنحاس يطلع مثل أول.','ما ننسى جميلكم. خذوا نصيبكم من نحاس الشهر.']:P.flags.c7_khalfan?['مدينة الأبراج شرق الوادي. الحكيمة نصرة هناك تعرف أسرار المقابر.']:
    ['أهلًا بالضيوف. أنا خلفان، معلّم هذا المنجم من ثلاثين سنة.','قبل شهر حفرنا أعمق من العادة… فانفتح علينا دهليز قديم، جدرانه كلها نقوش.','من يومها والجن يخرجون في الليل، ويطفئون مصابيحنا، ويخطفون الأدوات.','يقولون إن الدهاليز تصل إلى المقبرة الكبرى في مدينة الأبراج. الحكيمة نصرة هناك تعرف أسرارها.'],
  onSaid:()=>{if(!P.flags.c7_khalfan){P.flags.c7_khalfan=1;SFX.play('quest');notify('فُتح طريق وادي الأبراج شرق المنجم<small>إلى مدينة الأبراج</small>',3.6);}
    else if(P.flags.c7boss&&!P.flags.c7_reward){P.flags.c7_reward=1;P.inv.copper=(P.inv.copper||0)+8;P.money+=1500;SFX.play('itemGet');notify('أعطاكم المعلّم خلفان ٨ قطع نحاس و١٥٠٠ بيسة',3.4);}}});
areaNpc('nawal','نوال','manjam',225,372,LK('f',{dress:'#8a3a2a',dressSh:'#6a2a1e',scarf:'#2f5f8f',scarfSh:'#1f3f6a'}),{shop:'manjam_inn',lines:['ارتاحوا، الشواء جاهز في التنور.']});
areaNpc('jaber','جابر الحداد','manjam',785,690,LK('m',{robe:'#5a4a3a',robeSh:'#3f3428',head:'kumma',hw:['#f7f3ea','#a8322a'],skin:'#7a4a2a'}),{shop:'manjam_smith',lines:['النار عندي ما تنطفي. أشتري مواد الوحوش والنحاس بسعر زين.']});
areaNpc('sultan','سلطان الصغير','manjam',540,470,LK('m',{child:true,robe:'#f8f6f0',head:'kumma',hw:['#ffffff','#c9a046']}),{wander:{x0:420,x1:600,y0:380,y1:490,speed:30},
  linesFn:()=>P.flags.c7boss?['أبوي رجع يشتغل في المنجم! وما عاد أحد يخاف من الليل.']:['شفت جنّي غبار يدور مثل الزوبعة! أمي تقول اقرأ وما بيقرّب.']});
areaNpc('bilal','بلال العامل','manjam',720,300,LK('m',{robe:'#a8916a',robeSh:'#8a7a5a',head:'kumma',hw:['#f7f3ea','#5a4a3a'],skin:'#6a4a32'}),{
  linesFn:()=>['الوحوش في الوادي صارت أقوى من أول. العقارب تلدغ وتسمّم، لا تنسوا العسل.','وعملاق الصخر ما يأثر فيه الضرب، استعملوا سحر الرمل.']});
areaNpc('nasra','الحكيمة نصرة','abraj',420,320,LK('f',{age:'old',dress:'#2f4f7a',dressSh:'#243c5e',scarf:'#1f1a1e',scarfSh:'#120e12',scarfTrim:'#e9c86a',cane:true}),{
  linesFn:()=>P.flags.c7boss?['الختم عاد! أشعر به يضيء تحت المدينة.','لكن النجوم تقول إن الغابات في الجنوب الغربي حزينة. للحكاية بقية.']:P.flags.c7_nasra?['باب الدهاليز في المقبرة الكبرى. المفتاح مع الشيخ مرهون عند الحلبة.']:
    ['هذه الأبراج مقابر أجدادنا، بناها أهل هذه الأرض قبل آلاف السنين.','تحت المقبرة الكبرى دهاليز حبس فيها حكماء الأبراج عفريتًا، وختموه بختم من نحاس ونجوم.','حين حفر العمّال في الجبل، انكسر طرف الختم، وخرج الجن.','باب الدهاليز مقفل، ومفتاحه مع الشيخ مرهون. وهو لا يعطيه إلا لمن يفوز في الحلبة.'],
  onSaid:()=>{if(!P.flags.c7_nasra){P.flags.c7_nasra=1;SFX.play('quest');notify('اذهبا إلى الحلبة شمال شرق الساحة<small>الفوز بالحلبة البرونزية يفتح باب الدهاليز</small>',3.8);}}});
areaNpc('marhoon','الشيخ مرهون','abraj',840,330,LK('m',{age:'old',robe:'#f3ead8',hw:['#a8322a','#e9c86a','#f3ead8'],hair:'#efebe2',beard:'#f2eee6',skin:'#a8714a'}),{dir:'down',
  linesFn:()=>P.flags.c7_bronze?['أبطال الأبراج! الحلبة بيتكم. تبون مباراة جديدة؟']:['أنا مرهون، حَكَم هذه الحلبة من أربعين سنة.','من يفوز فيها يدخل التاريخ… ومن يفوز بالبرونزية آخذه بنفسي إلى باب الدهاليز.'],
  onSaid:()=>setTimeout(()=>{if(state==='play')openShop('arena');},150)});
areaNpc('fatima','فاطمة','abraj',520,620,LK('f',{dress:'#2f6b4f',dressSh:'#235040',scarf:'#a8322a',scarfSh:'#7a2018'}),{shop:'abraj_inn',lines:['حيّاكم في دار فاطمة. نومة هنا تعادل نومة أسبوع.']});
areaNpc('hilal','هلال','abraj',970,760,LK('m',{robe:'#cdb08a',robeSh:'#a98c66',hw:['#2f6b4f','#e9c86a','#f3ead8']}),{dir:'up',shop:'abraj_smith',lines:['تحف ودروع وأسلحة من كنوز الأبراج. لكل مستوى عتاده.']});

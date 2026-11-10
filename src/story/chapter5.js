// الفصل الخامس: شتاء جبال الغيم — حلّة السدر، درب الثلج، رأس الغيم، مغارة الجليد، والغول الأبيض
'use strict';

/* =========================================================
   PEOPLE OF THE NEW AREAS (a small helper)
   ========================================================= */
function areaNpc(id,name,scene,x,y,look,o={}){
  const n=Object.assign({id,name,scene,x,y,dir:o.dir||'down',look,noMeet:true,talked:0,lines:o.lines||['…'],repeat:o.repeat||o.lines||['…'],phase:0,moving:false,lookAt:2,pause:1,target:null,stuck:0},o);
  n.home={x,y,dir:n.dir,scene};NPCS.push(n);return n;
}
const LK=(g,o)=>Object.assign(g==='f'?{g:'f',dress:'#5a3a6e',dressSh:'#43285a',emb:'#e2b54a',emb2:'#f7e3a6',scarf:'#2a2230',scarfSh:'#16121c',scarfTrim:'#c9473a',sirwal:'#e2b54a',skin:'#c99068'}:{g:'m',robe:'#e9e2d2',robeSh:'#cbbfa8',tassel:'#8a6a3a',head:'massar',hw:['#5a3a6e','#e2b54a','#f3ead8'],hair:'#2a1e16',beard:'#2a1e16',skin:'#b97d52'},o);

/* chapter cards that can say anything */
let cardAfter=null;
function openCard(eyebrow,title,tag,after){
  chapterCard=5;cardAfter=after||null;const c=chapterEl;c.querySelector('.eyebrow').textContent=eyebrow;c.querySelector('h2').textContent=title;c.querySelector('.tag').innerHTML=tag;
  SFX.play('fanfare');state='chapter';resetInput();c.hidden=false;c.classList.remove('leaving');gameEl.classList.add('talking');
}

/* =========================================================
   ITEMS, SHOPS, INNS
   ========================================================= */
Object.assign(ITEMS,{
  sunlantern:{name:'فانوس الشمس',key:true,icon:'flame',col:'#f2b33c',desc:'من الفلكي حمدان. فيه جمرة لا تنطفئ، تذيب جليد مدخل المغارة.'},
  frostheart:{name:'قلب النجمة الباردة',key:true,icon:'gem',col:'#bfe3f0',desc:'كان في صدر الغول الأبيض. صار دافئًا بين يديك.'},
  frostshard:{name:'شظية جليد',mat:true,sell:30,icon:'gem',col:'#9fd0ea',desc:'جليد لا يذوب، من وحوش الجبل.'},
  rumman:{name:'رمّان الجبل',use:'hp',amount:90,icon:'dates',col:'#b0234a',price:60,desc:'رمّان الجبل الأخضر. يعيد ٩٠ من الصحة.'},
  kahwajebel:{name:'قهوة الجبل',use:'mp',amount:45,icon:'cup',col:'#6b3f22',price:85,desc:'قهوة بالهيل والزعفران تدفّئ البرد. تعيد ٤٥ من الطاقة.'},
});
Object.assign(SHOP,{
  sidr_inn:{title:'نُزُل حلّة السدر',sub:'سلمى ترحّب بالمسافرين',tabs:[['inn','الراحة'],['buy','شراء'],['sell','بيع']],stock:['dates','halwa','rosewater','honey','qahwa'],inn:{price:15,town:'sidr'}},
  sidr_smith:{title:'دكّان بدر الحداد',sub:'عتاد يصمد في البرد',tabs:[['buy','شراء'],['sell','بيع']],stock:tierStock(2,3)},
  ghaim_inn:{title:'نُزُل رأس الغيم',sub:'زهرة وموقدها الدافئ',tabs:[['inn','الراحة'],['buy','شراء'],['sell','بيع']],stock:['rumman','kahwajebel','honey','qahwa','hojari'],inn:{price:25,town:'ghaim'}},
  ghaim_smith:{title:'مخزن سيف',sub:'أجود عتاد في الجبال',tabs:[['buy','شراء'],['sell','بيع']],stock:tierStock(3,4,5)},
});
function innBoard(){
  const I=SHOP[shopId].inn,town=SCENES[I.town];
  return `<div class="quest"><b>ليلة دافئة بـ${baisa(I.price)}</b><p class="muted" style="margin:4px 0 8px">تعود صحتكم وطاقتكم كاملة، وإن سقطتم في معركة تستيقظون هنا.${P.lastTown===I.town?' أنتم مقيمون هنا الآن.':''}</p>
  <div class="actions"><button type="button" class="btn" data-rest="1"${P.money<I.price?' disabled':''}>استرح في ${town.area.innName}</button></div></div>`;
}
function restInn(){
  const I=SHOP[shopId].inn;if(P.money<I.price){SFX.play('error');return;}
  P.money-=I.price;P.hp=null;P.mp=null;P.ally={hp:null,mp:null};healPets();P.lastTown=I.town;SFX.play('heal');shopMsg='نمتم ليلة هادئة، وعادت إليكم قوتكم.';renderShop();saveGame();
}

/* =========================================================
   MONSTERS OF THE MOUNTAIN
   ========================================================= */
const PALS={
  snowwolf:{body:'#dfe6ea',dark:'#a9b6c0',belly:'#f6f9fb',eye:'#7fc6ff',horn:'#fff'},
  ibex:{body:'#9a7a52',dark:'#6b5236',belly:'#d9c4a0',eye:'#ffcc33',horn:'#4a3a28'},
  leopard:{body:'#d9b072',dark:'#a8834e',belly:'#f3e3c4',eye:'#a8e05a',spot:'#5a3a22'},
  frostleopard:{body:'#e9f0f4',dark:'#b8c8d4',belly:'#ffffff',eye:'#7fd6ff',spot:'#6f8fa8'},
  frostowl:{body:'#e9eef2',belly:'#ffffff',wing:'#c9d6e0',dark:'#8aa0b4',eye:'#ffcc33',beak:'#c9a046'},
  icebat:{body:'#5a7a98',belly:'#8fb4d0',wing:'#3f5a74',dark:'#2a3a4a',eye:'#bfe9ff'},
  icewisp:{core:'235,250,255',glow:'150,210,255',eye:'#2a4a6a'},
  icegolem:{body:'#9fc4dc',light:'#d8f0fa',dark:'#5f86a4',crystal:'#e9f8ff',eyeGlow:'120,200,255'},
  iceguard:{body:'#7fa8c8',light:'#cfeaf8',dark:'#3f5f7a',crystal:'#ffffff',eyeGlow:'255,120,120'},
  yeti:{body:'#eef3f6',light:'#ffffff',dark:'#b8c8d4',face:'#9fb4c4',horn:'#6f8fa8',eye:'#5fd0ff'},
};
makeMonster('snowwolf',{name:'ذئب الثلج',art:'beast',pal:PALS.snowwolf,opt:{frost:true},lv:11,role:'brute',weak:'fire',move:['عضّة الصقيع',.28,1.45],drop:['frostshard',.25],sfx:'growl'});
makeMonster('ibex',{name:'وعل الجبل',art:'beast',pal:PALS.ibex,opt:{horns:'curl'},lv:12,role:'tank',weak:'sand',move:['نطحة',.3,1.55],drop:['pelt',.2]});
makeMonster('frostowl',{name:'بومة الصقيع',art:'flyer',pal:PALS.frostowl,opt:{owl:true},lv:13,role:'caster',fly:true,weak:'fire',ai:'magic',move:['ريح باردة',.5,1],drop:['kahwajebel',.15]});
makeMonster('leopard',{name:'النمر العربي',art:'beast',pal:PALS.leopard,opt:{spots:true,longTail:true},lv:14,role:'swift',weak:'sand',move:['وثبة النمر',.3,1.7],drop:['pelt',.35],sfx:'growl'});
makeMonster('icewisp',{name:'روح الجليد',art:'spirit',pal:PALS.icewisp,lv:15,role:'caster',fly:true,weak:'fire',resist:'sand',ai:'magic',move:['شعاع بارد',.55,1],drop:['frostshard',.3]});
makeMonster('icebat',{name:'خفاش الجليد',art:'flyer',pal:PALS.icebat,lv:15,role:'swift',fly:true,weak:'fire',ai:'drain',move:['امتصاص بارد',.3,.9],drop:['frostshard',.2]});
makeMonster('icegolem',{name:'تمثال الجليد',art:'elemental',pal:PALS.icegolem,opt:{crystals:true},lv:17,role:'tank',weak:'fire',resist:'phys',move:['ضربة متجمدة',.25,1.4],drop:['frostshard',.5]});
makeMonster('frostleopard',{name:'نمر الصقيع',art:'beast',pal:PALS.frostleopard,opt:{spots:true,longTail:true,frost:true},lv:19,role:'swift',weak:'fire',move:['مخلب الصقيع',.3,1.7],drop:['pelt',.3],sfx:'growl'});
makeMonster('iceguard',{name:'حارس الجليد',art:'elemental',pal:PALS.iceguard,opt:{crystals:true,scale:1.35},lv:22,role:'tank',weak:'fire',resist:'phys',move:['زلزال الجليد',.3,1.5],drop:['kahwajebel',.3],hpK:1.3});
makeMonster('yeti',{name:'الغول الأبيض',art:'yeti',pal:PALS.yeti,opt:{breath:true},lv:24,boss:true,weak:'fire',resist:'sand',
  intro:['يهتز سقف المغارة، ويخرج من الظلام غول أبيض عظيم!','في صدره يلمع قلب النجمة الباردة.'],
  moves:{hit:{name:'ضربة المخلب',k:1.2},big:{name:'عاصفة ثلجية',k:1.35,fx:'frost',sfx:'eMagic',say:'الغول ينفث عاصفة ثلجية تجمّد الفريق!'},every:3,rage:'الغول يزأر حتى تتساقط الثلوج من السقف!'},
  onWin:()=>{P.flags.c5boss=1;['frostheart',gearId('weapon',5)].forEach(id=>P.inv[id]=(P.inv[id]||0)+1);P.inv.rumman=(P.inv.rumman||0)+3;return ` سقط من صدر الغول قلب النجمة الباردة، ووجدتم ${ITEMS[gearId('weapon',5)].name}.`;},
  after:()=>openCard('الفصل الخامس','نهاية الفصل الخامس','ذاب الجليد عن قلب النجمة الباردة، وبدأ الربيع يعود إلى جبال الغيم.<br>يتبع: الفصل السادس، مستنقعات القرم',()=>notify('عودا إلى الشيخ عامر في حلّة السدر<small>أهل الجبل ينتظرون الخبر</small>',4)),
});

/* =========================================================
   THE AREAS
   ========================================================= */
const H=(x,base,w,trim,roof)=>({x,base,w,wallH:96,roofH:50,door:.5,trim,roof,snow:true});
defineArea({id:'sidr',name:'حلّة السدر',kind:'town',biome:'snow',W:1000,H:760,seed:51,
  plaza:{x:500,y:410,rx:130,ry:88},
  paths:[{pts:[[500,330],[500,0]],w:60},{pts:[[500,500],[500,700]],w:56},{pts:[[372,410],[90,410]],w:50},{pts:[[628,410],[910,410]],w:50}],
  houses:[H(150,330,170,'#2f5f8f',['#9a4a2a','#6e3018']),H(680,330,180,'#2f6b4f',['#8a3a2a','#5e2818']),H(140,650,180,'#7a2f5a',['#9a4a2a','#6e3018']),H(690,650,170,'#c9a046',['#8a3a2a','#5e2818'])],
  lamps:[[420,334],[580,334],[420,486],[580,486]],terraces:[170,730],
  features:[{kind:'post',x:560,y:690,col:10},{kind:'chest',id:'sidr1',x:930,y:700,loot:[['rumman',2]],money:60,col:12}],
  exits:[{edge:'n',x:500,y:0,r:40,to:'thalj',at:{x:380,y:1460},dir:'up',need:'c5_amer',block:'الشيخ عامر يريد أن يكلمكما قبل أن تصعدا'}],
  keep:[[500,640,70],[930,700,40]],density:16,rockShare:.35,
  inn:{x:470,y:560},innName:'نُزُل حلّة السدر',arrive:{x:500,y:640,dir:'up'},snow:()=>P.flags.c5boss?0:.55});
defineArea({id:'thalj',name:'درب الثلج',kind:'field',biome:'snow',W:760,H:1500,seed:52,
  paths:[{pts:[[380,1500],[380,1320],[250,1150],[300,960],[480,800],[460,600],[300,430],[380,240],[380,0]],w:70},{pts:[[250,1150],[130,1060]],w:40},{pts:[[480,800],[640,700],[640,540]],w:40}],
  ponds:[{x:600,y:1120,rx:70,ry:34}],
  features:[{kind:'chest',id:'thalj1',x:120,y:1050,loot:[[gearId('acc',3),1],['honey',2]],col:12},{kind:'chest',id:'thalj2',x:640,y:530,loot:[[gearId('body',3),1]],money:90,col:12},
    {kind:'sign',x:420,y:1430,col:10,text:'درب الثلج<small>إلى رأس الغيم شمالًا. احذروا الذئاب والنمور</small>'}],
  exits:[{edge:'s',x:380,y:1500,r:50,to:'sidr',at:{x:500,y:60},dir:'down'},{edge:'n',x:380,y:0,r:50,to:'ghaim',at:{x:460,y:680},dir:'up'}],
  keep:[[600,1120,90],[120,1050,40],[640,530,40],[420,1430,30]],density:80,rockShare:.3,bareShare:.2,
  enc:{groups:[['snowwolf'],['snowwolf','snowwolf'],['ibex'],['frostowl'],['ibex','snowwolf'],['frostowl','snowwolf'],['leopard'],['snowwolf','snowwolf','frostowl']],night:[['icewisp'],['frostowl','frostowl'],['icewisp','snowwolf'],['leopard','icewisp']]},
  snow:()=>P.flags.c5boss?.15:.85});
defineArea({id:'ghaim',name:'رأس الغيم',kind:'town',biome:'snow',W:960,H:720,seed:53,
  plaza:{x:460,y:420,rx:120,ry:84},
  paths:[{pts:[[460,505],[460,720]],w:56},{pts:[[580,420],[960,420]],w:54},{pts:[[340,420],[120,420]],w:50}],
  houses:[H(110,320,170,'#2f5f8f',['#8a3a2a','#5e2818']),H(120,650,170,'#2f6b4f',['#9a4a2a','#6e3018']),H(620,660,180,'#a8322a',['#8a3a2a','#5e2818'])],
  lamps:[[380,346],[540,346],[380,494],[540,494]],terraces:[150],
  features:[{kind:'observatory',x:740,y:300,col:42},{kind:'post',x:540,y:640,col:10}],
  exits:[{edge:'s',x:460,y:720,r:44,to:'thalj',at:{x:380,y:40},dir:'down'},{edge:'e',x:960,y:420,r:44,to:'ice1',dir:'right',need:'c5_lantern',block:'مدخل المغارة مسدود بجليد سميك. ربما يعرف الفلكي حمدان طريقة لإذابته'}],
  keep:[[740,300,90],[540,640,40]],density:12,rockShare:.4,
  inn:{x:300,y:470},innName:'نُزُل رأس الغيم',arrive:{x:460,y:640,dir:'up'},snow:()=>P.flags.c5boss?0:.6});
// the ice cave, three floors; stairs and treasure are placed once the rooms exist
const ICE_ENC=[
  {groups:[['icebat'],['icewisp'],['icebat','icebat'],['icewisp','icebat'],['icegolem']]},
  {groups:[['icegolem','icewisp'],['frostleopard'],['icebat','frostleopard'],['icegolem','icebat','icewisp'],['frostleopard','icewisp']]},
  {groups:[['iceguard'],['frostleopard','frostleopard'],['iceguard','icewisp'],['icegolem','icegolem'],['frostleopard','icegolem']]},
];
const ICE_LOOT=[[[gearId('head',4),1],['honey',2]],[[gearId('feet',4),1],['kahwajebel',2]],[[gearId('acc',4),1],['rumman',2]],[[gearId('body',5),1]],[[gearId('head',5),1],['qahwa',1]],[['kahwajebel',3],['rumman',3]]];
['ice1','ice2','ice3'].forEach((id,i)=>defineArea({id,name:`مغارة الجليد، الطابق ${['الأول','الثاني','الثالث'][i]}`,kind:'dungeon',biome:'ice',W:1200,H:880,seed:71+i*13,rooms:i===2?6:7,enc:ICE_ENC[i],bossRoom:i===2,
  features:[],place(sc){
    const F=sc.area.features;
    F.push({kind:'stairsUp',x:sc.start.x,y:sc.start.y-20,to:i?['ice1','ice2'][i-1]:'ghaim',at:null,dir:'down'});
    if(i<2)F.push({kind:'stairs',x:sc.end.x,y:sc.end.y-20,to:['ice2','ice3'][i],at:null,dir:'down'});
    else F.push({kind:'heart',x:sc.end.x,y:sc.end.y-10,col:26,onAct:()=>{if(P.flags.c5boss){showToast('note','قلب النجمة الباردة صار دافئًا، والمغارة هادئة',2.6);return;}startEncounter({types:['yeti','icegolem'],boss:true});}});
    sc.mid.slice(0,2).forEach((m,k)=>F.push({kind:'chest',id:`${id}_${k}`,x:m.x+30,y:m.y,loot:ICE_LOOT[i*2+k],money:80+i*60,col:12}));
    sc.spawn={x:sc.start.x,y:sc.start.y+36};
  }}));
// link the stairs now that every floor knows where its rooms are
{const f=id=>AREAS[id].area.features,st=id=>AREAS[id].start,en=id=>AREAS[id].end;
  f('ice1')[0].at={x:930,y:420};f('ice1')[0].to='ghaim';AREAS.ghaim.area.exits[1].at={x:st('ice1').x,y:st('ice1').y+36};
  f('ice1')[1].at={x:st('ice2').x,y:st('ice2').y+36};f('ice2')[0].at={x:en('ice1').x,y:en('ice1').y+30};
  f('ice2')[1].at={x:st('ice3').x,y:st('ice3').y+36};f('ice3')[0].at={x:en('ice2').x,y:en('ice2').y+30};}

/* =========================================================
   PEOPLE AND THE STORY
   ========================================================= */
const SALEM_CH5=['النجمة عادت، والحمد لله… لكن خبرًا غريبًا وصلنا مع القوافل.','يقولون إن الشتاء لم يفارق جبال الغيم منذ سنة، وإن حلّة السدر محاصرة بالثلج.','رائد دليل القوافل وصل عند الطريق الشرقي. اذهبا معه، فأهل الجبل يحتاجون من يعيد إليهم الربيع.'];
SALEM.onSaid=said=>{if(said===SALEM_CH5&&!P.flags.ch5){P.flags.ch5=1;P.flags.town_sidr=1;SFX.play('quest');
  openCard('الفصل الخامس','شتاء جبال الغيم','في الشمال، فوق الغيوم، قرى لم يزرها الربيع منذ سنة.<br>رائد دليل القوافل ينتظركما عند الطريق الشرقي.',()=>notify('تحدّث إلى رائد عند الطريق الشرقي<small>قافلته تأخذكما إلى حلّة السدر</small>',4));}};
const RAED=areaNpc('raed','رائد',  'none',1040,474,LK('m',{robe:'#cdb08a',robeSh:'#a98c66',hw:['#2f6b4f','#e9c86a','#f3ead8'],skin:'#a8714a'}),{dir:'left',
  linesFn:()=>P.flags.ch5?['القافلة جاهزة! من هنا آخذكما إلى أي مكان زرتماه.','اختارا وجهتكما من الخريطة.']:['سالم يبحث عنكما. اسمعا ما عنده أولًا.'],
  onSaid:()=>{if(P.flags.ch5)setTimeout(openWorldMap,120);}});
const AMER=areaNpc('amer','الشيخ عامر','sidr',500,350,LK('m',{age:'old',robe:'#f3ead8',hw:['#2f5f8f','#e9c86a','#f3ead8'],hair:'#efebe2',beard:'#f2eee6',skin:'#c99068',cane:true}),{
  linesFn:()=>P.flags.c5boss?['أشمّ رائحة الربيع! الثلج يذوب عن المدرجات، والرمان سيعود.','خذا هذا الرمان من آخر شجرة صمدت. أنتما من أهل الجبل الآن.']:P.flags.c5_amer?['رأس الغيم في نهاية درب الثلج. الفلكي حمدان هناك يعرف أسرار الجبل.']:
    ['أهلًا بكم في حلّة السدر. كانت مدرجاتنا خضراء، ورمّاننا يُضرب به المثل.','منذ سنة نزل الشتاء ولم يرحل. الثلج غطّى كل شيء، والرمان مات على أغصانه.','يقول الرعاة إن غولًا أبيض سكن مغارة الجليد فوق رأس الغيم، ومعه بدأ البرد.','اصعدا درب الثلج شمال الحلّة إلى رأس الغيم، وكلّما الفلكي حمدان. هو يعرف أسرار الجبل.'],
  onSaid:()=>{if(!P.flags.c5_amer){P.flags.c5_amer=1;SFX.play('quest');notify('فُتح درب الثلج شمال حلّة السدر<small>الطريق إلى رأس الغيم</small>',3.6);}
    else if(P.flags.c5boss&&!P.flags.c5_reward){P.flags.c5_reward=1;P.inv.rumman=(P.inv.rumman||0)+5;P.money+=500;SFX.play('itemGet');notify('أعطاكم الشيخ عامر ٥ حبات رمّان و٥٠٠ بيسة',3.4);}}});
areaNpc('salma','سلمى','sidr',236,372,LK('f',{dress:'#2f6b4f',dressSh:'#235040',scarf:'#a8322a',scarfSh:'#7a2018'}),{shop:'sidr_inn',lines:['حيّاكم في النُّزُل! الموقد حار والقهوة جاهزة.','ارتاحوا هنا متى تعبتم.']});
areaNpc('badr','بدر','sidr',770,372,LK('m',{robe:'#8a6a4a',robeSh:'#6b5236',head:'kumma',hw:['#f7f3ea','#6b4a2b'],skin:'#a8714a'}),{shop:'sidr_smith',lines:['المطرقة ما توقفت من يوم نزل البرد. الجبل يحتاج عتادًا قويًا.','اختر ما يناسب مستواك، فالعتاد الثقيل لا يحمله إلا المتمرّس.']});
areaNpc('ghanim','غانم','sidr',560,440,LK('m',{child:true,robe:'#f8f6f0',head:'kumma',hw:['#ffffff','#2f5f8f']}),{wander:{x0:420,x1:600,y0:360,y1:470,speed:30},
  linesFn:()=>P.flags.c5boss?['الثلج يذوب! أبي يقول إن الرمان سيزهر قريبًا.']:['شفت النمر العربي مرة على الدرب! عيناه خضراوان مثل الزمرد.','أمي تقول إن النار تخيف وحوش الثلج. صحيح؟']});
areaNpc('rahma','الجدة رحمة','sidr',300,690,LK('f',{age:'old',dress:'#8d2a2a',dressSh:'#6a1f1f',cane:true}),{
  linesFn:()=>P.flags.c5boss?['بارك الله فيكم يا أولادي. الشمس رجعت تدفّي عظامي.']:['في شبابي كانت الحلّة تفوح برائحة الورد والرمان.','البرد يدخل العظام… لا تنسوا أن تستريحوا عند سلمى قبل الدرب.']});
const HAMDAN=areaNpc('hamdan','الفلكي حمدان','ghaim',690,352,LK('m',{age:'old',robe:'#2f4f7a',robeSh:'#243c5e',hw:['#e9c86a','#f3ead8','#2f4f7a'],hair:'#efebe2',beard:'#f2eee6',skin:'#c48a5e'}),{
  linesFn:()=>P.flags.c5boss?['قلب النجمة الباردة دافئ الآن… والسماء صافية لأول مرة منذ سنة.','لكنني أرى في الجنوب الشرقي ضبابًا يتحرك على المستنقعات. احذروا، فالقصة لم تنتهِ.']:P.flags.c5_lantern?['الفانوس معكما. باب المغارة في شرق رأس الغيم، والغول ينتظر في أعمق طابق.','النار سلاحكما: وحوش الجليد كلها تخاف اللهب.']:
    ['من مرصدي هذا أرى النجوم كل ليلة… وقبل سنة رأيت نجمة باردة تسقط في مغارة الجليد.','سكن الغول الأبيض المغارة وأخذ قلب تلك النجمة، وما دام القلب معه سيبقى الشتاء.','باب المغارة شرق رأس الغيم، مسدود بجليد لا يذوب.','خذا هذا الفانوس، فيه جمرة من نار الشمس. سيذيب الجليد عن الباب.'],
  onSaid:()=>{if(!P.flags.c5_lantern){P.flags.c5_lantern=1;P.inv.sunlantern=1;SFX.play('itemGet');notify('حصلت على فانوس الشمس<small>فُتح مدخل مغارة الجليد شرق رأس الغيم</small>',3.8);$('menuDot').hidden=false;}}});
areaNpc('zahra','زهرة','ghaim',196,362,LK('f',{dress:'#a8322a',dressSh:'#7a2018',scarf:'#2f4f7a',scarfSh:'#1f3554'}),{shop:'ghaim_inn',lines:['أهلًا بالضيوف! في رأس الغيم لا يمشي أحد في الليل، تعالوا للموقد.']});
areaNpc('saif','سيف','ghaim',710,700,LK('m',{robe:'#5a4a3a',robeSh:'#3f3428',hw:['#a8322a','#e9c86a','#f3ead8']}),{shop:'ghaim_smith',lines:['عتاد الفولاذ والفضة! من يدخل مغارة الجليد يحتاج أفضل ما عندي.']});
areaNpc('reem','ريم','ghaim',420,470,LK('f',{dress:'#2f5f8f',dressSh:'#244a70',scarf:'#e9c86a',scarfSh:'#c9a046'}),{wander:{x0:360,x1:560,y0:380,y1:480,speed:28},
  linesFn:()=>P.flags.c5boss?['سمعنا زئير الغول يتلاشى في الجبل! أنتما بطلان.']:['دخلت المغارة مرة ورجعت. فيها ثلاثة طوابق، وفي الطابق الأعمق برد لا يطاق.','جهّزوا الرمان والقهوة، ولا تنسوا الصناديق المخبّأة في الغرف.']});

/* Raed stands in the village only after the star has returned */
function chapter5Tick(){RAED.scene=P.flags.ending?'village':'none';}

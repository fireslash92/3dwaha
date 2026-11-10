// الفصل السادس: ضباب مستنقعات القرم — قرية القرم، خور القرم، مرسى اللؤلؤ ومهرجان الغوص، المعبد الغارق، وتنّين المستنقع
'use strict';

/* ---------- items & shops ---------- */
Object.assign(ITEMS,{
  mistpearl:{name:'لؤلؤة الضباب',key:true,icon:'gem',col:'#cfe6dc',desc:'كانت في جوف تنّين المستنقع، ومنها كان يخرج الضباب الأسود.'},
  mudshell:{name:'صدفة الطين',mat:true,sell:55,icon:'gem',col:'#8a7a5a',desc:'صدفة صلبة من وحوش الخور.'},
  samak:{name:'سمك مشوي',use:'hp',amount:160,icon:'fish',col:'#c98a2a',price:110,desc:'سمك الخور مشويًا على السعف. يعيد ١٦٠ من الصحة.'},
  harees:{name:'هريس',use:'hp',amount:260,icon:'sweets',col:'#e9dcc0',price:190,desc:'هريس باللحم والسمن. يعيد ٢٦٠ من الصحة.'},
  zaatar:{name:'شاي الزعتر',use:'mp',amount:70,icon:'cup',col:'#5f8a44',price:140,desc:'شاي بأعشاب الجبل. يعيد ٧٠ من الطاقة.'},
});
Object.assign(SHOP,{
  qurm_inn:{title:'عريش أم خالد',sub:'نُزُل على أعمدة فوق الماء',tabs:[['inn','الراحة'],['buy','شراء'],['sell','بيع']],stock:['samak','zaatar','rumman','kahwajebel','qahwa'],inn:{price:35,town:'qurm'}},
  qurm_smith:{title:'دكّان حمّود',sub:'عتاد لا يصدأ في الرطوبة',tabs:[['buy','شراء'],['sell','بيع']],stock:tierStock(5,6)},
  lulu_inn:{title:'نُزُل شيخة',sub:'غرف تطل على المرسى',tabs:[['inn','الراحة'],['buy','شراء'],['sell','بيع']],stock:['samak','harees','zaatar','qahwa','hojari'],inn:{price:45,town:'lulu'}},
  lulu_smith:{title:'تاجر اللؤلؤ يعقوب',sub:'يشتري اللؤلؤ بمرة ونصف من سعره، ويبيع أجود العتاد',tabs:[['buy','شراء'],['sell','بيع اللؤلؤ']],stock:tierStock(6,7),sellMult:1.5,sellFilter:id=>id==='pearl'||id==='dana'||id==='mudshell'},
});

/* ---------- monsters of the marshes and the sunken temple ---------- */
function artHydra(g,t,p,o,e){
  const hot=e&&e.enraged;
  g.fillStyle='rgba(40,70,60,.5)';ell(g,0,-4,70,14);g.fill();
  g.fillStyle=p.body;g.beginPath();g.ellipse(0,-26,56,26,0,Math.PI,0);g.fill();g.fillStyle=p.belly;g.beginPath();g.ellipse(0,-14,44,12,0,Math.PI,0);g.fill();
  [[-34,-.5],[0,0],[34,.5]].forEach(([bx,lean],i)=>{const sw=Math.sin(t*1.6+i*2)*8,hx=bx+lean*30+sw,hy=-118-Math.abs(lean)*-6+Math.cos(t*1.3+i)*6-(i===1?20:0);
    g.strokeStyle=p.body;g.lineWidth=16;g.lineCap='round';g.beginPath();g.moveTo(bx,-40);g.quadraticCurveTo(bx+lean*40,-80,hx,hy+10);g.stroke();
    g.strokeStyle=p.belly;g.lineWidth=6;g.beginPath();g.moveTo(bx+4,-40);g.quadraticCurveTo(bx+lean*40+4,-80,hx+3,hy+12);g.stroke();
    g.fillStyle=p.body;ell(g,hx+6,hy,16,10);g.fill();poly(g,[hx+14,hy-4,hx+30,hy+2,hx+14,hy+6]);
    g.fillStyle=p.frill;poly(g,[hx-6,hy-6,hx-16,hy-20,hx-2,hy-10]);poly(g,[hx,hy-8,hx-4,hy-24,hx+6,hy-9]);
    g.fillStyle=hot?'#ff5a3a':p.eye;circ(g,hx+10,hy-3,2.6);g.fillStyle='#fff';poly(g,[hx+18,hy+4,hx+20,hy+9,hx+22,hy+4]);});
  if(fxOn()){g.fillStyle='rgba(150,180,150,.25)';for(let i=0;i<5;i++){const k=(t*.4+i/5)%1;circ(g,-40+i*20,-20-k*40,6+k*10);}}
}
MONSTER_ART.hydra=artHydra;
const P6={
  mudcrab:{body:'#6f5a3a',light:'#9a825a',dark:'#3f3220'},
  mudblob:{body:'#5a5a32',light:'#8a8a52',dark:'#3a3a1e'},
  heron:{body:'#c9d1d6',belly:'#f3f6f8',wing:'#8a9aa6',dark:'#4a5a66',eye:'#ffcc33',beak:'#e9a23a'},
  marshlight:{core:'220,255,200',glow:'120,200,110',eye:'#1f3a1a'},
  hyena:{body:'#a8916a',dark:'#6b5a3e',belly:'#d9c9a6',eye:'#e9c24a',spot:'#4a3a26',mane:'#5a4a30'},
  pirate:{body:'#2f4f7a',trim:'#c9a046',head:'#a8322a',dark:'#2a2a2a',skin:'#a8714a',weapon:'#c9d1d6',shield:'#6b4a2b'},
  corsair:{body:'#1f1f2a',trim:'#a8322a',head:'#1f1f2a',dark:'#111',skin:'#8a5a3a',weapon:'#e9c86a',shield:'#3a2a1a'},
  coralgolem:{body:'#c97a6a',light:'#f2b3a3',dark:'#7a3f3a',crystal:'#f2b33c',eyeGlow:'120,255,210'},
  drowned:{body:'#3a5a54',trim:'#6f9a8a',head:'#2a403e',dark:'#1f2e2c',skin:'#7a9a8a',weapon:'#9aa6ae',shield:'#4f7068'},
  templecrab:{body:'#2f6b6a',light:'#5fa0a0',dark:'#1a3a3a'},
  abysseye:{core:'200,255,240',glow:'60,170,160',eye:'#0a2a2a'},
  hydra:{body:'#3f6a54',belly:'#a8c48a',frill:'#a8322a',eye:'#ffe36a'},
};
makeMonster('mudcrab',{name:'سرطان الطين',art:'crab',pal:P6.mudcrab,lv:26,role:'tank',weak:'sand',resist:'fire',move:['كمّاشة',.3,1.5],drop:['mudshell',.35]});
makeMonster('mudblob',{name:'الوحل الحي',art:'blob',pal:P6.mudblob,lv:27,role:'caster',weak:'fire',resist:'phys',ai:'poison',move:['رشّة سامة',.4,1.1],drop:['mudshell',.25]});
makeMonster('heron',{name:'مالك الحزين',art:'flyer',pal:P6.heron,lv:27,role:'swift',fly:true,weak:'sand',move:['طعنة المنقار',.3,1.6],drop:['samak',.2]});
makeMonster('marshlight',{name:'نار المستنقع',art:'spirit',pal:P6.marshlight,lv:28,role:'caster',fly:true,weak:'sand',resist:'fire',ai:'sleep',move:['نور ينوّم',.35,1],drop:['zaatar',.2]});
makeMonster('hyena',{name:'ضبع الخور',art:'beast',pal:P6.hyena,opt:{spots:true,mane:true},lv:29,role:'brute',weak:'fire',move:['عضّة الضبع',.3,1.55],drop:['pelt',.3],sfx:'growl'});
makeMonster('pirate',{name:'قرصان الخور',art:'warrior',pal:P6.pirate,lv:30,role:'brute',move:['ضربة السيف',.3,1.5],drop:['harees',.12]});
makeMonster('corsair',{name:'ربّان القراصنة',art:'warrior',pal:P6.corsair,opt:{scale:1.15},lv:32,role:'swift',move:['طعنة غادرة',.35,1.7],drop:['zaatar',.25],hpK:1.2});
makeMonster('coralgolem',{name:'حارس المرجان',art:'elemental',pal:P6.coralgolem,opt:{crystals:true},lv:32,role:'tank',weak:'sand',resist:'phys',move:['ضربة مرجانية',.3,1.45],drop:['pearl',.15]});
makeMonster('drowned',{name:'غريق المعبد',art:'warrior',pal:P6.drowned,lv:33,role:'brute',weak:'fire',ai:'drain',move:['قبضة الأعماق',.3,1],drop:['harees',.15]});
makeMonster('templecrab',{name:'سرطان المعبد',art:'crab',pal:P6.templecrab,opt:{scale:1.25},lv:34,role:'tank',weak:'sand',resist:'fire',move:['كمّاشة الأعماق',.3,1.6],drop:['mudshell',.4],hpK:1.2});
makeMonster('abysseye',{name:'عين العمق',art:'spirit',pal:P6.abysseye,lv:35,role:'caster',fly:true,weak:'sand',resist:'fire',ai:'magic',move:['شعاع العمق',.55,1],drop:['pearl',.2]});
makeMonster('hydra',{name:'تنّين المستنقع',art:'hydra',pal:P6.hydra,lv:38,boss:true,weak:'sand',resist:'fire',hpK:.85,
  intro:['يغلي الماء حول المعبد، وترتفع منه ثلاثة رؤوس!','الضباب الأسود يخرج من أفواهها.'],
  moves:{hit:{name:'عضّة الرؤوس الثلاثة',k:1.25},big:{name:'الضباب السام',k:1.12,fx:'sand',sfx:'hiss',status:'poison',say:'التنّين ينفث ضبابًا سامًا على الفريق!'},every:3,rage:'تصرخ الرؤوس الثلاثة معًا، ويهتز المعبد!'},
  onWin:()=>{P.flags.c6boss=1;['mistpearl',gearId('weapon',7)].forEach(id=>P.inv[id]=(P.inv[id]||0)+1);P.inv.harees=(P.inv.harees||0)+3;return ` تلاشى الضباب من جوف التنّين، ووجدتم لؤلؤة الضباب و${ITEMS[gearId('weapon',7)].name}.`;},
  after:()=>openCard('الفصل السادس','نهاية الفصل السادس','انقشع الضباب الأسود عن غابات القرم، وعادت القوارب إلى الخور.<br>يتبع: الفصل السابع، مغارات الجن والآثار',()=>notify('عودا إلى الريّس جاسم في قرية القرم<small>الصيادون ينتظرون الخبر</small>',4)),
});

/* ---------- the areas ---------- */
const AR6=(x,base,w,stilts)=>({x,base,w,wallH:70,roofH:22,door:.5,arish:true,stilts});
defineArea({id:'qurm',name:'قرية القرم',kind:'town',biome:'swamp',W:1000,H:760,seed:61,
  plaza:{x:500,y:420,rx:120,ry:80},
  paths:[{pts:[[620,420],[1000,420]],w:50,boards:true},{pts:[[380,420],[100,420]],w:46,boards:true},{pts:[[500,500],[500,700]],w:50,boards:true},{pts:[[500,340],[500,160]],w:46,boards:true}],
  houses:[AR6(160,320,150,true),AR6(700,320,150,true),AR6(160,650,160,true),AR6(690,650,150,true)],
  ponds:[{x:850,y:560,rx:90,ry:40,solid:true},{x:220,y:510,rx:70,ry:32,solid:true},{x:820,y:190,rx:80,ry:38,solid:true},{x:250,y:160,rx:70,ry:34,solid:true}],
  lamps:[[430,350],[570,350],[430,490],[570,490]],
  features:[{kind:'post',x:560,y:690,col:10},{kind:'chest',id:'qurm1',x:930,y:700,loot:[['samak',3]],money:150,col:12}],
  exits:[{edge:'e',x:1000,y:420,r:40,to:'khor',at:{x:40,y:360},dir:'right',need:'c6_jasim',block:'الريّس جاسم يريد أن يكلمكما قبل أن تدخلا الخور'}],
  keep:[[560,690,50],[930,700,40]],density:16,rockShare:.2,bareShare:.5,
  inn:{x:470,y:560},innName:'عريش أم خالد',arrive:{x:500,y:640,dir:'up'},mist:()=>P.flags.c6boss?0:.35});
defineArea({id:'khor',name:'خور القرم',kind:'field',biome:'swamp',W:1600,H:720,seed:62,
  paths:[{pts:[[0,360],[220,360],[380,250],[600,300],[760,470],[980,450],[1150,280],[1360,300],[1600,360]],w:58,boards:true},{pts:[[600,300],[640,120]],w:36,boards:true},{pts:[[980,450],[1040,640]],w:36,boards:true}],
  ponds:[{x:300,y:520,rx:110,ry:50,solid:true},{x:520,y:120,rx:90,ry:40,solid:true},{x:820,y:220,rx:120,ry:56,solid:true},{x:700,y:620,rx:100,ry:44,solid:true},{x:1200,y:560,rx:130,ry:56,solid:true},{x:1380,y:140,rx:100,ry:44,solid:true}],
  features:[{kind:'chest',id:'khor1',x:650,y:110,loot:[[gearId('acc',6),1],['samak',2]],col:12},{kind:'chest',id:'khor2',x:1050,y:650,loot:[[gearId('feet',6),1]],money:220,col:12},
    {kind:'sign',x:80,y:310,col:10,text:'خور القرم<small>إلى مرسى اللؤلؤ شرقًا. لا تبتعدوا عن الألواح</small>'}],
  exits:[{edge:'w',x:0,y:360,r:50,to:'qurm',at:{x:960,y:420},dir:'left'},{edge:'e',x:1600,y:360,r:50,to:'lulu',at:{x:40,y:470},dir:'right'}],
  keep:[[650,110,40],[1050,650,40],[80,310,30]],density:90,rockShare:.15,bareShare:.45,
  enc:{groups:[['mudcrab'],['mudblob','heron'],['heron','heron'],['mudcrab','mudblob'],['hyena'],['hyena','heron'],['pirate'],['pirate','pirate'],['mudcrab','hyena','heron']],night:[['marshlight'],['marshlight','marshlight'],['marshlight','hyena'],['corsair','pirate']]},
  mist:()=>P.flags.c6boss?.1:.6});
defineArea({id:'lulu',name:'مرسى اللؤلؤ',kind:'town',biome:'coast',W:1100,H:760,seed:63,sea:200,
  plaza:{x:550,y:470,rx:130,ry:80},
  paths:[{pts:[[550,390],[550,170]],w:44,boards:true},{pts:[[420,470],[0,470]],w:50},{pts:[[680,470],[1040,470]],w:50},{pts:[[550,550],[550,720]],w:50}],
  houses:[AR6(120,380,150),AR6(160,700,160),{x:760,base:700,w:180,wallH:96,roofH:50,door:.5,trim:'#2f6b4f',roof:['#9a4a2a','#6e3018']},{x:820,base:380,w:170,wallH:96,roofH:50,door:.5,trim:'#a8322a',roof:['#8a3a2a','#5e2818']}],
  lamps:[[470,400],[630,400],[470,540],[630,540]],
  features:[{kind:'dhow',x:380,y:150},{kind:'dhow',x:800,y:120},{kind:'boat',x:550,y:166},{kind:'festival',x:320,y:590,col:30},{kind:'post',x:620,y:690,col:10}],
  exits:[{edge:'w',x:0,y:470,r:44,to:'khor',at:{x:1560,y:360},dir:'left'}],
  keep:[[320,590,80],[620,690,40],[550,200,60]],density:10,rockShare:.4,
  inn:{x:520,y:600},innName:'نُزُل شيخة',arrive:{x:550,y:640,dir:'up'},mist:()=>P.flags.c6boss?0:.25});
const SUNK_ENC=[
  {groups:[['coralgolem'],['drowned'],['drowned','abysseye'],['templecrab'],['coralgolem','drowned']]},
  {groups:[['templecrab','abysseye'],['drowned','drowned'],['coralgolem','abysseye'],['templecrab','drowned','abysseye']]},
  {groups:[['templecrab','coralgolem'],['abysseye','abysseye','drowned'],['coralgolem','coralgolem'],['templecrab','templecrab']]},
];
const SUNK_LOOT=[[[gearId('head',7),1],['harees',2]],[[gearId('body',7),1]],[[gearId('feet',7),1],['zaatar',2]],[[gearId('acc',7),1],['samak',3]],[['dana',1],['harees',2]],[[gearId('head',8),1]]];
['sunk1','sunk2','sunk3'].forEach((id,i)=>defineArea({id,name:`المعبد الغارق، الطابق ${['الأول','الثاني','الثالث'][i]}`,kind:'dungeon',biome:'temple',W:1200,H:880,seed:91+i*17,rooms:i===2?6:7,enc:SUNK_ENC[i],bossRoom:i===2,
  features:[],place(sc){
    const F=sc.area.features;
    F.push({kind:'stairsUp',x:sc.start.x,y:sc.start.y-20,to:i?['sunk1','sunk2'][i-1]:'lulu',at:null,dir:'down'});
    if(i<2)F.push({kind:'stairs',x:sc.end.x,y:sc.end.y-20,to:['sunk2','sunk3'][i],at:null,dir:'down'});
    else F.push({kind:'heart',spr:'idol',x:sc.end.x,y:sc.end.y-10,col:26,onAct:()=>{if(P.flags.c6boss){showToast('note','الصنم الغارق صامت، والماء صافٍ',2.6);return;}startEncounter({types:['hydra','drowned'],boss:true});}});
    sc.mid.slice(0,2).forEach((m,k)=>F.push({kind:'chest',id:`${id}_${k}`,x:m.x+30,y:m.y,loot:SUNK_LOOT[i*2+k],money:200+i*120,col:12}));
    sc.spawn={x:sc.start.x,y:sc.start.y+36};
  }}));
{const f=id=>AREAS[id].area.features,st=id=>AREAS[id].start,en=id=>AREAS[id].end;
  f('sunk1')[0].at={x:550,y:240};
  f('sunk1')[1].at={x:st('sunk2').x,y:st('sunk2').y+36};f('sunk2')[0].at={x:en('sunk1').x,y:en('sunk1').y+30};
  f('sunk2')[1].at={x:st('sunk3').x,y:st('sunk3').y+36};f('sunk3')[0].at={x:en('sunk2').x,y:en('sunk2').y+30};
  const L=AREAS.lulu.area.features;
  L.find(q=>q.kind==='boat').onAct=()=>{if(!P.flags.c6_boat){showToast('note','سنبوق النوخذة مسعود<small>تحتاجون إذنه لتبحروا به</small>',2.8);SFX.play('blocked');return;}SFX.play('water');enterArea('sunk1',{x:st('sunk1').x,y:st('sunk1').y+36},'down');};
  L.find(q=>q.kind==='festival').onAct=()=>openShop('festival');}

/* ---------- people & story ---------- */
{const prevL=AMER.linesFn,prevS=AMER.onSaid;
  AMER.linesFn=()=>P.flags.c5boss&&!P.flags.ch6?['أشمّ رائحة الربيع! الثلج يذوب عن المدرجات، والرمان سيعود.','خذا هذا الرمان وهذه البيسات، أنتما من أهل الجبل الآن.','لكن وصلتنا رسالة من الساحل: ضباب أسود يبتلع غابات القرم، والصيادون ما عادوا يبحرون.','القافلة تعرف الطريق إلى قرية القرم. اذهبا إليهم، فهم يحتاجونكما.']:prevL();
  AMER.onSaid=said=>{prevS(said);if(P.flags.c5boss&&!P.flags.ch6){P.flags.ch6=1;P.flags.town_qurm=1;
    openCard('الفصل السادس','ضباب مستنقعات القرم','في الجنوب الشرقي، ضباب أسود يبتلع غابات القرم، والوحوش تهاجم القوارب.<br>القافلة تأخذكما إلى قرية القرم.',()=>notify('سافرا بالقافلة إلى قرية القرم<small>من محطة القوافل في أي مدينة</small>',4));}};}
areaNpc('jasim','الريّس جاسم','qurm',500,352,LK('m',{age:'old',robe:'#e9e2d2',head:'kumma',hw:['#f7f3ea','#2f6b4f'],hair:'#efebe2',beard:'#f2eee6',skin:'#a8714a',cane:true}),{
  linesFn:()=>P.flags.c6boss?['الضباب راح! شوف القوارب كيف رجعت تملأ الخور.','بارك الله فيكم. خذوا هذا، من صيد اليوم ومن خير البحر.']:P.flags.c6_jasim?['الخور شرق القرية، ومرسى اللؤلؤ في آخره. النوخذة مسعود يعرف طريق المعبد.']:
    ['يا هلا! الحمد لله على سلامتكم. ما عاد أحد يزورنا من يوم نزل الضباب الأسود.','الضباب يخرج من وسط الخور، من المعبد الغارق اللي يظهر وقت الجزر.','والوحوش صارت تهاجم القوارب، والقراصنة استغلوا الضباب.','اعبروا الخور شرقًا إلى مرسى اللؤلؤ. النوخذة مسعود يعرف الطريق إلى المعبد.'],
  onSaid:()=>{if(!P.flags.c6_jasim){P.flags.c6_jasim=1;SFX.play('quest');notify('فُتح طريق خور القرم شرق القرية<small>إلى مرسى اللؤلؤ</small>',3.6);}
    else if(P.flags.c6boss&&!P.flags.c6_reward){P.flags.c6_reward=1;P.inv.samak=(P.inv.samak||0)+5;P.money+=900;SFX.play('itemGet');notify('أعطاكم الريّس جاسم ٥ أسماك مشوية و٩٠٠ بيسة',3.4);}}});
areaNpc('umkhalid','أم خالد','qurm',236,362,LK('f',{dress:'#2f5f8f',dressSh:'#244a70',scarf:'#e9c86a',scarfSh:'#c9a046'}),{shop:'qurm_inn',lines:['تعالوا ارتاحوا في العريش، الهوا هنا بارد وطيب.']});
areaNpc('hammoud','حمّود','qurm',775,362,LK('m',{robe:'#6b5a3e',robeSh:'#4f4230',head:'kumma',hw:['#f7f3ea','#a8322a']}),{shop:'qurm_smith',lines:['الرطوبة تأكل الحديد، لكن عتادي ما يصدأ. اختر ما يناسبك.']});
areaNpc('subaih','صبيح','qurm',540,450,LK('m',{child:true,robe:'#f8f6f0',head:'kumma',hw:['#ffffff','#2f6b4f']}),{wander:{x0:430,x1:600,y0:370,y1:480,speed:30},
  linesFn:()=>P.flags.c6boss?['أبوي بياخذني للصيد بكرة! أول مرة من سنة.']:['شفت نار خضرا تطير فوق الماء بالليل! أمي تقول لا تلحقها.']});
areaNpc('mozna','الجدة مزنة','qurm',300,690,LK('f',{age:'old',dress:'#2a1f1a',dressSh:'#17100c',scarfTrim:'#e7c25a',cane:true}),{
  linesFn:()=>P.flags.c6boss?['الحمد لله… رجع البحر يتنفس.']:['في المعبد الغارق صنم قديم، يقولون إن أهل الخور كانوا يقدمون له اللؤلؤ.','لما توقفوا، نام التنّين في الماء… والظاهر إنه صحى.']});
const MASOUD=areaNpc('masoud','النوخذة مسعود','lulu',600,262,LK('m',{robe:'#f3ead8',hw:['#2f4f7a','#e9c86a','#f3ead8'],beard:'#3a2a1c',skin:'#8a5a3a'}),{dir:'left',
  linesFn:()=>P.flags.c6boss?['ما شاء الله عليكم! المعبد هدأ والبحر صفى. المرسى مرساكم متى ما بغيتوا.']:P.flags.c6_boat?['السنبوق عند رأس الرصيف. توكلوا على الله، وانتبهوا من الغرقى.']:P.flags.c6_dive?['ما شاء الله! غوص يشرّف.','خذوا السنبوق عند رأس الرصيف، يوديكم المعبد الغارق.']:
    ['أنا مسعود، نوخذة هذا المرسى. المعبد الغارق؟ ما يوصله إلا قارب.','وقاربي ما أعطيه إلا لغوّاص يعرف البحر.','شاركوا في مهرجان الغوص عند الخيمة، واطلعوا بلؤلؤتين على الأقل في جولة وحدة.'],
  onSaid:()=>{if(P.flags.c6_dive&&!P.flags.c6_boat){P.flags.c6_boat=1;SFX.play('quest');notify('صار السنبوق تحت أمركم<small>عند رأس الرصيف شمال المرسى</small>',3.6);}}});
areaNpc('shaikha','شيخة','lulu',236,420,LK('f',{dress:'#a8322a',dressSh:'#7a2018',scarf:'#2f6b4f',scarfSh:'#235040'}),{shop:'lulu_inn',lines:['حيّاكم في المرسى! غرفنا تطل على البحر.']});
areaNpc('yaqoub','يعقوب','lulu',905,420,LK('m',{robe:'#cdb08a',robeSh:'#a98c66',hw:['#a8322a','#e9c86a','#f3ead8']}),{shop:'lulu_smith',lines:['لؤلؤ؟ أشتريه بأحسن سعر في الساحل. وعندي عتاد من المرجان والعقيق.']});
areaNpc('ghawas','الغواص سعيّد','lulu',380,540,LK('m',{robe:'#f3ead8',robeSh:'#d6cbb3',head:'kumma',hw:['#f7f3ea','#2f5f8f'],skin:'#8a5a3a'}),{
  linesFn:()=>['سر الغوص في النفَس. لا تطمع، اطلع قبل ما يخلص نفسك.','المحار اللي في القاع أغنى باللؤلؤ، والدانة ما تطلع إلا من العمق.']});

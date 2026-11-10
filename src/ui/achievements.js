// الإنجازات وسجل الصيد
'use strict';

Object.assign(ICONS,{
  fish:'<path d="M3 12c3-5 9-6 14-2l4-3v10l-4-3c-5 4-11 3-14-2z"/><circle cx="8" cy="11" r="1.2" fill="#fff"/>',
  rod:'<path d="M4 21L18 3" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/><path d="M18 3c2 6 2 10 0 14" stroke="currentColor" stroke-width="1" fill="none"/><circle cx="18" cy="18" r="1.8"/>',
  trophy:'<path d="M7 3h10v5a5 5 0 0 1-10 0z"/><path d="M7 5H4a3 3 0 0 0 3 4M17 5h3a3 3 0 0 1-3 4" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M10 13h4v4h-4zM7 20h10v1H7z"/>',
});
TABS.splice(TABS.length-1,0,{id:'ach',name:'الإنجازات',ic:'<path d="M7 3h10v5a5 5 0 0 1-10 0z"/><path d="M7 5H4a3 3 0 0 0 3 4M17 5h3a3 3 0 0 1-3 4"/><path d="M10 13h4v4h-4zM7 20h10"/>'});

const normalBeasts=()=>BEAST_ORDER.filter(k=>!ENEMIES[k].boss);
const fishCount=()=>Object.values(P.fishLog||{}).reduce((s,f)=>s+f.n,0);
const totalKills=()=>Object.values(P.kills||{}).reduce((s,n)=>s+n,0);
const ACH=[
  {id:'meet',name:'ابن القرية',desc:'تعرّف على أهل القرية الثمانية.',test:()=>met.size>=8},
  {id:'ch1',name:'بداية الحكاية',desc:'أنهِ الفصل الأول.',test:()=>chapterDone},
  {id:'boss1',name:'حارس النور',desc:'اهزم حارس النور في الغابة.',test:()=>!!P.flags.boss},
  {id:'boss2',name:'سيّد العين',desc:'اهزم حيّة العين وأعد الماء إلى الفلج.',test:()=>!!P.flags.boss2},
  {id:'boss3',name:'محطّم الحجر',desc:'اهزم عملاق الحصن القديم.',test:()=>!!P.flags.boss3},
  {id:'ending',name:'نجمة الوادي',desc:'أعد النجمة إلى السماء.',test:()=>!!P.flags.ending},
  {id:'lv5',name:'مسافر متمرّس',desc:'بلغ المستوى الخامس.',test:()=>levelOf(P.xp)>=5},
  {id:'lv10',name:'بطل الوادي',desc:'بلغ المستوى العاشر.',test:()=>levelOf(P.xp)>=10},
  {id:'beasts',name:'عالِم المخلوقات',desc:'اهزم كل أنواع المخلوقات العادية مرة على الأقل.',test:()=>normalBeasts().every(k=>(P.kills[k]||0)>0),prog:()=>[normalBeasts().filter(k=>(P.kills[k]||0)>0).length,normalBeasts().length]},
  {id:'hunter',name:'درع القرية',desc:'اهزم ١٠٠ مخلوق.',test:()=>totalKills()>=100,prog:()=>[Math.min(100,totalKills()),100]},
  {id:'rich',name:'تاجر شاطر',desc:'اجمع ١٠٠٠ بيسة في وقت واحد.',test:()=>P.money>=1000},
  {id:'helper',name:'يد العون',desc:'أنهِ كل المهام الجانبية.',test:()=>Object.keys(SIDEQ).every(id=>qState(id)===2),prog:()=>[Object.keys(SIDEQ).filter(id=>qState(id)===2).length,Object.keys(SIDEQ).length]},
  {id:'craft',name:'صنعة يد',desc:'اطلب من راشد أن يصوغ لك قطعة.',flag:true},
  {id:'peddler',name:'زبون أبي خلفان',desc:'اشترِ شيئًا من البائع المتجول.',flag:true},
  {id:'race1',name:'فارس الهجن',desc:'افز بسباق هجن في وادي الفلج.',flag:true},
  {id:'race3',name:'كأس عين الوادي',desc:'افز بأصعب سباق للهجن.',flag:true},
  {id:'souq',name:'زبون السوق',desc:'اشترِ شيئًا من بسطات السوق.',flag:true},
  {id:'haggle',name:'مساوم شاطر',desc:'اشترِ القطعة النادرة من سليمان بخصم الربع أو أكثر من سعرها الأصلي.',flag:true},
  {id:'c5',name:'ربيع الجبل',desc:'اهزم الغول الأبيض وأعد الربيع إلى جبال الغيم.',test:()=>!!P.flags.c5boss},
  {id:'c6',name:'صفاء الخور',desc:'اهزم تنّين المستنقع وابدّد الضباب الأسود.',test:()=>!!P.flags.c6boss},
  {id:'c7',name:'ختم الأبراج',desc:'اهزم عفريت الدهاليز وأعد الختم إلى مكانه.',test:()=>!!P.flags.c7boss},
  {id:'arena',name:'سيّد الحلبة',desc:'افز بالحلبة الذهبية في مدينة الأبراج.',flag:true},
  {id:'dana',name:'صيّاد الدانة',desc:'اعثر على دانة في مهرجان الغوص.',flag:true},
  {id:'fish1',name:'أول صيد',desc:'اصطد أول سمكة.',test:()=>fishCount()>=1},
  {id:'fish25',name:'صيّاد الفلج',desc:'اصطد ٢٥ سمكة.',test:()=>fishCount()>=25,prog:()=>[Math.min(25,fishCount()),25]},
  {id:'golden',name:'الحظ الذهبي',desc:'اصطد السمكة الذهبية. يقال إنها تظهر أكثر تحت المطر وعند الفجر والمغرب.',test:()=>!!(P.fishLog&&P.fishLog.golden)},
  {id:'allfish',name:'سجل الماء',desc:'اصطد كل أنواع السمك.',test:()=>FISH_ORDER.every(id=>P.fishLog&&P.fishLog[id]),prog:()=>[FISH_ORDER.filter(id=>P.fishLog&&P.fishLog[id]).length,FISH_ORDER.length]},
  {id:'splash',name:'طفل المطر',desc:'اقفز في بركة ماء بعد المطر.',flag:true},
  {id:'rainbow',name:'ألوان بعد المطر',desc:'شاهد قوس قزح فوق القرية.',flag:true},
  {id:'night',name:'ساهر الليل',desc:'تجوّل في القرية بعد منتصف الليل.',flag:true},
];
function achUnlock(id){
  P.ach=P.ach||{};if(P.ach[id])return;
  const a=ACH.find(q=>q.id===id);if(!a)return;
  P.ach[id]=1;SFX.play('quest');
  notify(`إنجاز جديد: ${a.name}<small>${a.desc}</small>`,3.2);
  $('menuDot').hidden=false;saveGame();
}
let achT=0;
function achTick(dt){
  if(state!=='play'||(achT-=dt)>0)return;achT=1;
  for(const a of ACH)if(a.test&&!(P.ach&&P.ach[a.id])&&a.test())achUnlock(a.id);
  if(scene.id==='village'){const h=hourNow();if(h<4)achUnlock('night');if(WX.bow>.35)achUnlock('rainbow');}
}
function achCheckFish(){for(const id of ['fish1','fish25','golden','allfish']){const a=ACH.find(q=>q.id===id);if(a.test())achUnlock(id);}}

function tabAch(){
  const got=ACH.filter(a=>P.ach&&P.ach[a.id]).length;
  const cards=ACH.map(a=>{const on=P.ach&&P.ach[a.id],pr=!on&&a.prog?a.prog():null;
    return `<div class="skill${on?'':' locked'}">${icon('trophy',on?'#c08a1e':'#b9a687')}<div class="grow"><b>${a.name}${on?' <span class="chip up">تحقق</span>':''}</b><p class="muted" style="margin:2px 0 0">${a.desc}</p>${pr?`<div class="meta"><span class="chip">${AR(pr[0])} من ${AR(pr[1])}</span></div>`:''}</div></div>`;}).join('');
  const log=P.fishLog||{};
  const fish=FISH_ORDER.map(id=>{const f=FISH[id],L=log[id];
    return L?`<div class="skill">${icon('fish',f.col)}<div class="grow"><b>${f.name}</b><div class="meta"><span class="chip">اصطدت ${AR(L.n)}</span><span class="chip up">أطولها ${AR(L.best)} سم</span><span class="chip">${f.where==='village'?'فلج القرية':f.where==='wadi'?'عين الوادي':'نادرة في كل مكان'}</span></div></div></div>`
      :`<div class="skill locked">${icon('fish','#b9a687')}<div class="grow"><b>؟؟؟</b><p class="muted" style="margin:2px 0 0">${f.where==='village'?'تعيش في فلج القرية.':f.where==='wadi'?'تعيش في ماء الوادي.':'نادرة جدًا.'}</p></div></div>`;}).join('');
  return `<h3>الإنجازات <span class="chip">${AR(got)} من ${AR(ACH.length)}</span></h3><div class="skills">${cards}</div>
  <h3 style="margin-top:18px">سجل الصيد</h3>${P.inv.rod?'':'<p class="muted">تحتاج سنارة للصيد. يبيعها سعيد في دكانه.</p>'}<div class="skills">${fish}</div>`;
}

// أهل القرية وحواراتهم
'use strict';

/* =========================================================
   PEOPLE OF AYN AL-WADI
   ========================================================= */
const NPCS=[
  {id:'salem',name:'سالم',scene:'village',x:668,y:478,dir:'down',look:LOOKS.salem},
  {id:'mariam',name:'مريم',scene:'village',x:864,y:690,dir:'left',look:LOOKS.mariam,idleDirs:['left','right','left','down'],
    lines:['مساء الخير! هذه الورود من بذور جاء بها أبي من الجبل الأخضر.','في الربيع نقطّرها ونصنع منها ماء الورد، فتفوح رائحته في القرية كلها.'],
    repeat:['إن مررت بالحديقة مرة أخرى، فانتبه لأحواض الزهر!']},
  {id:'hamad',name:'حمد',scene:'village',x:520,y:600,dir:'down',look:LOOKS.hamad,wander:{x0:440,y0:350,x1:720,y1:650,speed:46},
    lines:['أنا أسرع ولد في عين الوادي! هل رأيت الفراشات عند الحديقة؟','أمي تقول لا تقترب من الغابة في الليل… لكني رأيت الضوء من سطح بيتنا!'],
    repeat:['تسابقني حول النافورة؟ لا، يبدو أنك متعب من السفر.']},
  {id:'shamsa',name:'شمسة',scene:'village',x:546,y:716,dir:'up',look:LOOKS.shamsa,idleDirs:['up','up','left','right'],
    lines:['من هنا أعدّ النجوم كل ليلة.','البارحة نزلت نجمة صغيرة بين الأشجار ولم تصعد مرة أخرى. جدتي زوينة تعرف الحكاية.'],
    repeat:['إذا عرفت سر الضوء، فأخبرني أولًا، اتفقنا؟']},
  {id:'saeed',name:'سعيد',scene:'village',x:770,y:340,dir:'down',look:LOOKS.saeed,
    lines:['حيّاك الله! وصلت أمس من صور، وكان طريقي طويلًا مثل طريقك.','جئت بالسمك المجفف والبهارات، وسأرجع ومعي تمر القرية. تمرها أحلى تمر في الوادي.'],
    repeat:['أمي أم سعيد في البيت الأول. لا تخرج من عندها من غير قهوة!']},
  {id:'ummsaeed',name:'أم سعيد',scene:'A',x:328,y:186,dir:'down',look:LOOKS.ummsaeed,idleDirs:['down','right','down'],
    lines:['تفضّل يا ولدي، البيت بيتك.','القهوة على النار، والتمر من نخلنا. لا يدخل ضيف بيتنا ويخرج من غير فنجان.','ابني سعيد عند البيت الكبير يرتّب بضاعته. سلّم عليه.'],
    repeat:['خذ تمرة أخرى، فما زال الطريق أمامك طويلًا.']},
  {id:'rashid',name:'راشد',scene:'B',x:120,y:186,dir:'up',look:LOOKS.rashid,idleDirs:['up','up','right'],
    lines:['أهلًا بالضيف. أصوغ الفضة في هذا البيت منذ ثلاثين سنة.','هذه القلادة لعرس ابنة أخي، ونقشها يأخذ أسبوعًا كاملًا.'],
    repeat:['الفضة تحتاج صبرًا، مثل الطريق إلى الغابة.']},
  {id:'aisha',name:'عائشة',scene:'B',x:350,y:192,dir:'up',look:LOOKS.aisha,idleDirs:['up','up','left'],
    lines:['أنسج هذه السجادة بألوان الوادي: أحمر الغروب، وأخضر النخيل.','حين تكتمل سأهديها لجدتي زوينة. لا تخبرها، إنها مفاجأة!'],
    repeat:['انظر إلى الخيوط، لكل لون حكاية.']},
  {id:'zuwaina',name:'الجدة زوينة',scene:'C',x:196,y:196,dir:'down',look:LOOKS.zuwaina,idleDirs:['down','right','down'],
    lines:['اقترب يا ولدي، عيناي ما عادتا كما كانتا.','تقول الحكايات القديمة: إذا أضاءت الغابة، فهناك شيء ينتظر من يجده.','لكن لا تذهب وحدك. سالم يعرف متى يُفتح الطريق.'],
    repeat:['رائحة اللبان تطرد التعب. اجلس قليلًا قبل أن تمضي.']},
];
NPCS.forEach(n=>{n.phase=0;n.moving=false;n.lookAt=2+Math.random()*3;n.pause=1;n.target=null;n.stuck=0;n.talked=0;n.home={x:n.x,y:n.y,dir:n.dir,scene:n.scene};});
const SALEM=NPCS[0];
const VILLAGERS=NPCS.filter(n=>n!==SALEM);
const SALEM_INTRO=[
  'أهلًا بك في قرية عين الوادي. تبدو كأنك قطعت طريقًا طويلًا.',
  'منذ الليلة الماضية، يظهر ضوء غريب بين أشجار الغابة.',
  'استرح قليلًا، وتعرّف على القرية قبل أن تواصل رحلتك.',
];
const SALEM_END=[
  'عرفتَ أهل عين الوادي كلهم، وصرتَ واحدًا منّا.',
  'الضوء في الغابة ما زال يظهر كل ليلة، وزوينة تقول إنه ينتظر أحدًا.',
  'غدًا عند الفجر نفتح الطريق معًا. استرح الليلة.',
];
const AISHA_JOIN=['ناصر! سمعت أنك ذاهب إلى الغابة.','أعرف أعشاب الوادي، وخيوط السدو التي أنسجها تحمي من يلبسها.','لن أتركك وحدك أمام ذلك الضوء. سأمضي معك.'];
function syncAisha(){
  const n=NPCS.find(q=>q.id==='aisha');if(!n)return;
  if(P.flags.aisha){n.scene='party';}
  else if(chapterDone){n.scene='village';n.x=522;n.y=170;n.dir='up';n.idleDirs=['up','right','down'];}
  else{n.scene=n.home.scene;n.x=n.home.x;n.y=n.home.y;n.dir=n.home.dir;}
}
const trail=[];
function resetTrail(){
  trail.length=0;const v={up:[0,1],down:[0,-1],left:[1,0],right:[-1,0]}[hero.dir]||[0,1];
  for(let i=12;i>=0;i--)trail.push({x:hero.x+v[0]*i*2.4,y:hero.y+v[1]*i*2.4,dir:hero.dir});
}
function follower(){
  if(!P.flags.aisha||trail.length<2)return null;
  const p=trail[Math.max(0,trail.length-1-9)];
  return {x:p.x,y:p.y,dir:p.dir};
}

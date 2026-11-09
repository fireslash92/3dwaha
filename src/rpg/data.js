// الخصائص والمستويات والعتاد والهدايا والمهارات
'use strict';

/* =========================================================
   RPG DATA: stats, levels, items, gifts, skills
   ========================================================= */
const STAT_NAMES={hp:'الصحة',mp:'الطاقة',atk:'الهجوم',def:'الدفاع',agi:'الرشاقة',wis:'الحكمة',luk:'الحظ'};
const STAT_NOTES={hp:'تُستنزف في المعارك',mp:'تُستخدم للمهارات القتالية',atk:'قوة الضربة بالسلاح',def:'تخفف الضرر',agi:'كل نقطة تزيد سرعة المشي قليلًا',wis:'تقوّي المهارات',luk:'ترفع فرص العثور على الغنائم'};
const BASE={hp:60,mp:20,atk:5,def:4,agi:6,wis:5,luk:3},GROW={hp:12,mp:4,atk:1,def:1,agi:1,wis:1,luk:.5};
const LEVELS=[0,100,220,380,600,880,1220,1640,2150,2760];
const XP_MEET=40,XP_SALEM=20,XP_CHAPTER=100;
const ITEMS={
  staff:{name:'عصا السفر',slot:'weapon',icon:'staff',col:'#8a5a31',stats:{atk:2},desc:'عصا من خشب السدر رافقتك طوال الطريق.'},
  jacket:{name:'سترة المسافر',slot:'body',icon:'jacket',col:'#3d6ea8',stats:{def:2},desc:'سترة متينة بلون السماء، عليها غبار الطريق.'},
  boots:{name:'حذاء جلدي',slot:'feet',icon:'boot',col:'#6a4126',stats:{agi:1},desc:'حذاء خفيف للمسافات الطويلة.'},
  kumma:{name:'كمة مطرّزة',slot:'head',icon:'cap',col:'#a9472a',stats:{def:1,wis:2},desc:'هدية سالم. كمة عمانية بيضاء بتطريز أحمر.'},
  dishdasha:{name:'دشداشة بيضاء',slot:'body',icon:'robe',col:'#9aa6ae',stats:{def:1,agi:2},desc:'هدية سعيد من صور. خفيفة وباردة في حر الوادي.'},
  ring:{name:'خاتم فضة',slot:'acc',icon:'ring',col:'#8f9aa3',stats:{luk:3},desc:'صاغه راشد بيده. يقولون إنه يجلب الحظ.'},
  sadu:{name:'وشاح السدو',slot:'acc',icon:'scarf',col:'#a8322a',stats:{def:1,wis:1,hp:10},desc:'نسجته عائشة من بقايا خيوطها.'},
  amulet:{name:'تميمة اللبان',slot:'acc',icon:'amulet',col:'#c9952f',stats:{mp:8,wis:2},desc:'من الجدة زوينة، فيها حبّات لبان تهدّئ القلب.'},
  pebble:{name:'حصاة الفلج',slot:'acc',icon:'stone',col:'#5d8a98',stats:{luk:1,agi:1},desc:'أنعم حصاة وجدها حمد في الفلج.'},
  dates:{name:'تمر خلاص',use:'hp',amount:25,icon:'dates',col:'#7a3f1c',desc:'من نخل أم سعيد. يعيد ٢٥ من الصحة.'},
  rosewater:{name:'ماء الورد',use:'mp',amount:12,icon:'flask',col:'#d2577a',desc:'قارورة من حديقة مريم. تعيد ١٢ من الطاقة.'},
  starmap:{name:'خريطة النجوم',key:true,icon:'map',col:'#2f4f7a',desc:'رسمتها شمسة. عليها نجمة صغيرة فوق الغابة.'},
  lightstaff:{name:'عصا النور',slot:'weapon',icon:'staff',col:'#d99a2b',stats:{atk:6,wis:3},desc:'تركها حارس النور خلفه. خشبها دافئ ويلمع في العتمة.'},
  shard:{name:'شظية نجمة',key:true,icon:'gem',col:'#c9952f',desc:'قطعة من نجمة الوادي التي سقطت في الغابة. تنبض بضوء خافت.'},
};
const SLOTS=[{id:'weapon',name:'السلاح',type:'weapon'},{id:'head',name:'الرأس',type:'head'},{id:'body',name:'الجسد',type:'body'},{id:'feet',name:'القدمان',type:'feet'},{id:'acc1',name:'حلية أولى',type:'acc'},{id:'acc2',name:'حلية ثانية',type:'acc'}];
const GIFTS={
  salem:{item:'kumma',n:1},
  saeed:{item:'dishdasha',n:1,line:'وهذه دشداشة بيضاء من صور، البسها فالجو هنا حار.'},
  ummsaeed:{item:'dates',n:3,line:'وخذ هذا التمر معك للطريق.'},
  mariam:{item:'rosewater',n:1,line:'وخذ قارورة ماء الورد هذه، فهي تنعش المتعب.'},
  hamad:{item:'pebble',n:1,line:'وهذه حصاة من الفلج، أنعم حصاة وجدتها. صارت لك!'},
  shamsa:{item:'starmap',n:1,line:'رسمت خريطة للنجوم، احتفظ بها. قد تدلّك في الليل.'},
  rashid:{item:'ring',n:1,line:'خذ هذا الخاتم، صغته بيدي. يقولون إنه يجلب الحظ.'},
  aisha:{item:'sadu',n:1,line:'جرّب هذا الوشاح من بقايا خيوطي، دافئ في ليالي الوادي.'},
  zuwaina:{item:'amulet',n:1,line:'وهذه تميمة فيها حبّات لبان، تُبقي قلبك هادئًا.'},
};
{const sa=NPCS.find(n=>n.id==='saeed'),ra=NPCS.find(n=>n.id==='rashid');sa.shop='saeed';sa.repeat=['حيّاك! عندي بضاعة من صور ومسقط ونزوى، تفضّل.'];ra.shop='rashid';ra.repeat=['تريد أن أصوغ لك شيئًا؟ أحضر لي ما تجده في الغابة من أشواك وجلود.'];}
NPCS.forEach(n=>{const gf=GIFTS[n.id];if(gf&&gf.line&&n.lines)n.lines=n.lines.concat(gf.line);});
const HINTS={saeed:'قرب البيت الكبير شرق الساحة',mariam:'في حديقة الورد',hamad:'يلعب حول الساحة',shamsa:'عند المطلّ جنوب الساحة',ummsaeed:'داخل البيت الغربي',rashid:'داخل البيت الشرقي',aisha:'داخل البيت الشرقي',zuwaina:'داخل البيت الجنوبي'};
const SKILLS=[
  {id:'wayfarer',name:'خُطى المسافر',lv:1,kind:'دائمة',icon:'foot',desc:'اعتدت الطرق الطويلة، فلا يتعبك المشي مهما طال.'},
  {id:'guest',name:'أدب الضيف',lv:1,kind:'دائمة',icon:'heart',desc:'تعرف عادات الضيافة، فيرحّب بك أهل القرية ويهدونك مما عندهم.'},
  {id:'stride',name:'خطوة سريعة',lv:2,kind:'دائمة',icon:'bolt',desc:'تزيد سرعة المشي ١٢٪.'},
  {id:'seeker',name:'عين الباحث',lv:3,kind:'دائمة',icon:'eye',desc:'تظهر نجمة ذهبية فوق كل من لم تتعرّف عليه بعد.'},
  {id:'patience',name:'صبر الصائغ',lv:4,kind:'دائمة',icon:'gem',desc:'تعلّمته من راشد. يرفع الحظ نقطتين.',bonus:{luk:2}},
];
function freshProgress(){return {xp:0,hp:null,mp:null,inv:{staff:1,jacket:1,boots:1},eq:{weapon:'staff',head:null,body:'jacket',feet:'boots',acc1:null,acc2:null},gifts:{},gauge:0,flags:{},ally:{hp:null,mp:null},money:50,kills:{},q:{},clock:540,lore:{}};}
let P=freshProgress();
const levelOf=xp=>{let l=1;for(let i=1;i<LEVELS.length;i++)if(xp>=LEVELS[i])l=i+1;return l;};
const hasSkill=id=>{const s=SKILLS.find(k=>k.id===id);return !!s&&!!s.lv&&levelOf(P.xp)>=s.lv;};
function baseStat(k){const l=levelOf(P.xp)-1;return Math.floor(BASE[k]+GROW[k]*l);}
function bonusStat(k,eq=P.eq){let b=0;for(const sl in eq){const it=eq[sl]&&ITEMS[eq[sl]];if(it&&it.stats&&it.stats[k])b+=it.stats[k];}SKILLS.forEach(s=>{if(s.bonus&&s.bonus[k]&&hasSkill(s.id))b+=s.bonus[k];});return b;}
const stat=(k,eq)=>baseStat(k)+bonusStat(k,eq);
const curHP=()=>Math.min(P.hp==null?stat('hp'):P.hp,stat('hp'));
const curMP=()=>Math.min(P.mp==null?stat('mp'):P.mp,stat('mp'));
const heroSpeed=()=>SPEED*(1+(stat('agi')-6)*.012)*(hasSkill('stride')?1.12:1);

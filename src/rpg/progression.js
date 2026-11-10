// التقدّم حتى المستوى ٩٠: منحنى الخبرة، وعتاد متدرّج كل خمسة مستويات
'use strict';

/* ---------- experience curve: the first ten levels stay as they were ---------- */
const MAX_LEVEL=90;
for(let i=LEVELS.length;i<MAX_LEVEL;i++)LEVELS.push(LEVELS[i-1]+Math.round(650+95*Math.pow(i-9,1.5)));
const TITLES_EXTRA=['رحّال الجبال','حامي القوافل','فارس الوديان','سيّد الدروب','حارس المدن','بطل العُقد العشر','أسطورة الوادي'];

/* ---------- tiered equipment, one tier every five levels ---------- */
const TIER_MATS=['النحاس','البرونز','الحديد','الحديد المطروق','الفولاذ','الفضة','المرجان','العقيق','الذهب','اللؤلؤ','الفيروز','الزمرد','الياقوت','البلّور','النيزك','حجر الشمس','حجر القمر','شظايا النجوم'];
const TIER_COLS=['#b87333','#a97142','#7d7f82','#6a6d70','#9aa6ae','#c9d1d6','#e07a63','#a8322a','#d9a23a','#efe7d6','#3fa3a0','#2f9a5a','#b0234a','#bfe3f0','#6a5a7a','#f2b33c','#c9d6ee','#ffe9a8'];
const GEAR_NOUNS={weapon:['خنجر','سيف','رمح'],head:['خوذة','عمامة مدرّعة','مصر مقوّى'],body:['درع','دشداشة مدرّعة','جوشن'],feet:['نعال','حذاء','جزمة'],acc:['خاتم','تميمة','سوار']};
const GEAR_ICONS={weapon:['dagger','sword','staff'],head:['cap','cap','cap'],body:['jacket','robe','jacket'],feet:['boot','boot','boot'],acc:['ring','amulet','ring']};
const gearId=(slot,t)=>`g_${slot}${t}`;
for(let t=1;t<=TIER_MATS.length;t++){
  const req=t*5,k=(t-1)%3,mat=TIER_MATS[t-1],col=TIER_COLS[t-1],p=s=>Math.round(s*Math.pow(t,1.65)/5)*5;
  const st={
    weapon:k===0?{atk:Math.round(3+2.5*t),agi:Math.round(1+t*.35)}:k===1?{atk:Math.round(4+2.8*t)}:{atk:Math.round(3+2.6*t),def:Math.round(t*.6)},
    head:{def:Math.round(1+1.1*t),wis:Math.round(t*.6)},
    body:{def:Math.round(2+1.9*t),hp:Math.round(t*8)},
    feet:{def:Math.round(t*.7),agi:Math.round(1+t*.5)},
    acc:k===0?{luk:Math.round(1+t*.45),hp:Math.round(t*6)}:k===1?{wis:Math.round(1+t*.6),mp:Math.round(t*2.2)}:{atk:Math.round(t*.8),agi:Math.round(t*.4),luk:Math.round(t*.3)},
  };
  for(const slot of ['weapon','head','body','feet','acc']){
    ITEMS[gearId(slot,t)]={name:`${GEAR_NOUNS[slot][k]} من ${mat}`,slot,icon:GEAR_ICONS[slot][k],col,stats:st[slot],req,tier:t,
      price:p(slot==='weapon'?70:slot==='body'?60:slot==='acc'?55:40),desc:`عتاد من ${mat}. يحتاج المستوى ${AR(req)}.`};
  }
}
const tierStock=(...ts)=>ts.flatMap(t=>['weapon','head','body','feet','acc'].map(s=>gearId(s,t)));
const canWear=id=>!ITEMS[id].req||levelOf(P.xp)>=ITEMS[id].req;

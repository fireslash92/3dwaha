// موسوعة المخلوقات
'use strict';

/* =========================================================
   BESTIARY (menu tab)
   ========================================================= */
const beastPics={};
function beastPic(type){
  if(beastPics[type])return beastPics[type];
  const c=document.createElement('canvas');c.width=192;c.height=150;const g=c.getContext('2d');
  const d=ENEMIES[type],boss=d.boss,s=boss?.85:2;g.setTransform(s,0,0,s,96,boss?146:138);
  g.fillStyle='rgba(0,0,0,.25)';ell(g,0,0,boss?50:22,boss?8:5);g.fill();
  const fake={veil:0,enraged:false};
  ({lizard:drawLizard,bat:drawBat,wolf:drawWolf,wisp:drawWisp,scorpion:drawScorpion,viper:drawViper})[type]?.(g,1.3);
  ({soldier:drawSoldier,spider:drawSpider})[type]?.(g,1.3);if(type==='golem')drawGolem(g,1.3,{defBonus:0});
  if(d.art)drawMonster(g,1.3,{d,enraged:false,veil:0});
  else if(type==='guardian')drawGuardian(g,1.3,fake);if(type==='serpent')drawSerpent(g,1.3,fake);
  return beastPics[type]=c.toDataURL();
}
function tabBeasts(){
  const seen=BEAST_ORDER.filter(k=>(P.kills[k]||0)>0).length;
  return `<h3>موسوعة المخلوقات <span class="chip">${AR(seen)} من ${AR(BEAST_ORDER.length)}</span></h3>
  <p class="muted">تُكشف نقاط الضعف حين تضرب المخلوق بالعنصر المناسب: «الضرب» بالهجوم والمهارات، و«النار» بالشرارة، و«الرمل» بالعاصفة الرملية.</p>
  <div class="skills">${BEAST_ORDER.map(k=>{const d=ENEMIES[k],n=P.kills[k]||0;
    if(!n)return `<div class="skill locked beast"><div class="pic unk">؟</div><div class="grow"><b>؟؟؟</b><p class="muted" style="margin:0">لم تهزمه بعد.</p></div></div>`;
    const lore=(P.lore||{})[k]||{};
    const els=['phys','fire','sand'].map(el=>{const m=d.weak===el?'weak':d.resist===el?'res':'norm';if(!lore[el])return `<span class="chip">${EL_NAMES[el]}: ؟</span>`;
      return m==='weak'?`<span class="chip up">ضعيف أمام ${EL_NAMES[el]}</span>`:m==='res'?`<span class="chip down">يقاوم ${EL_NAMES[el]}</span>`:`<span class="chip">${EL_NAMES[el]}: عادي</span>`;}).join('');
    return `<div class="skill beast"><img class="pic" src="${beastPic(k)}" alt=""><div class="grow"><b>${d.name}${d.boss?' <span class="chip">زعيم</span>':''}</b>
      <div class="meta"><span class="chip">الصحة ${AR(d.hp)}</span><span class="chip">الهجوم ${AR(d.atk)}</span><span class="chip">الدفاع ${AR(d.def)}</span><span class="chip">هزمته ${AR(n)}</span></div>
      <div class="meta">${els}${d.status?`<span class="chip down">${d.status==='poison'?'يسبب السمّ':'يسبب النعاس'}</span>`:''}</div></div></div>`;}).join('')}</div>`;
}

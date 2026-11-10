// صفحة الوحوش المروّضة في القائمة
'use strict';

/* ---------- the companions page in the menu ---------- */
TABS.splice(TABS.length-1,0,{id:'pets',name:'الوحوش',ic:'<path d="M5 14c0-4 3-7 7-7s7 3 7 7-3 6-7 6-7-2-7-6z"/><circle cx="7" cy="6" r="2"/><circle cx="17" cy="6" r="2"/>'});
function tabPets(){
  if(!P.flags.tamer)return `<h3>الوحوش المروّضة</h3><p class="muted">لم تتعلّم الترويض بعد. يقولون إن المروّض سهيل في سوق اللبان يعلّمه لمن يستحق.</p>`;
  const ps=P.pets||[];
  return `<h3>الوحوش المروّضة <span class="chip">${AR(ps.length)} من ${AR(PET_MAX)}</span></h3><p class="muted">أضعف الوحش في المعركة حتى تقل صحته عن النصف تقريبًا، ثم اختر «مهارات» ← «ترويض». المرافق يقاتل معك وحده. إن سقط يعود في النُّزُل.</p>
  ${ps.length?`<div class="skills">${ps.map((p,i)=>{const d=ENEMIES[p.type],s=petStats(p),on=P.petActive===i,hp=p.hp==null?s.hp:p.hp;
    return `<div class="skill beast"><img class="pic" src="${beastPic(p.type)}" alt=""><div class="grow"><b>${d.name}${on?' <span class="chip up">المرافق</span>':''}${p.hp===0?' <span class="chip down">ساقط</span>':''}</b>
    <div class="meta"><span class="chip">المستوى ${AR(petLevel(p))}</span><span class="chip">الصحة ${AR(hp)} / ${AR(s.hp)}</span><span class="chip">الهجوم ${AR(s.atk)}</span><span class="chip">الدفاع ${AR(s.def)}</span></div>
    <div class="actions" style="margin-top:6px">${on?'':`<button type="button" class="btn" data-pet="${i}">اجعله مرافقًا</button>`}<button type="button" class="btn ghost" data-release="${i}">${P.releaseAsk===i?'تأكيد الإطلاق':'أطلقه'}</button></div></div></div>`;}).join('')}</div>`:'<p class="muted">لم تروّض أي وحش بعد.</p>'}`;
}
menuBody.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  if(d.pet!=null){P.petActive=+d.pet;P.releaseAsk=null;SFX.play('equip');renderMenu();saveGame();}
  else if(d.release!=null){const i=+d.release;if(P.releaseAsk!==i){P.releaseAsk=i;SFX.play('tap');renderMenu();return;}
    P.pets.splice(i,1);P.releaseAsk=null;if(P.petActive===i)P.petActive=P.pets.length?0:null;else if(P.petActive>i)P.petActive--;SFX.play('cancel');renderMenu();saveGame();}});


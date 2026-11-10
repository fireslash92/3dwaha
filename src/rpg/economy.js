// البيسة والمتجر والصياغة
'use strict';

/* =========================================================
   ECONOMY: baisa, Saeed's shop, Rashid's smithing
   ========================================================= */
Object.assign(ITEMS,{
  halwa:{name:'حلوى عمانية',use:'hp',amount:60,icon:'sweets',col:'#8a3a1c',price:70,desc:'حلوى بالزعفران والهيل. تعيد ٦٠ من الصحة.'},
  incense:{name:'لبان ظفاري',use:'mp',amount:25,icon:'incense',col:'#c9a46a',price:90,desc:'من جبال ظفار. رائحته تصفّي الذهن وتعيد ٢٥ من الطاقة.'},
  qahwa:{name:'قهوة بالهيل',use:'revive',icon:'cup',col:'#6b3f22',price:120,desc:'فنجان يوقظ من سقط في المعركة بنصف صحته. يُستخدم في المعركة.'},
  khanjar:{name:'خنجر نحاسي',slot:'weapon',icon:'dagger',col:'#b07a2a',stats:{atk:4,agi:1},price:300,desc:'خنجر عماني بمقبض من خشب، خفيف وحاد.'},
  sandals:{name:'نعال جلدية',slot:'feet',icon:'boot',col:'#8a5a31',stats:{agi:2,def:1},price:160,desc:'نعال من سوق نزوى، مريحة على الحصى.'},
  wool:{name:'مصرّ صوفي',slot:'head',icon:'cap',col:'#2f5f8f',stats:{def:2,wis:1},price:220,desc:'مصرّ من الصوف المنسوج، يقي الرأس من الضربات.'},
  spike:{name:'شوكة ضبّ',mat:true,icon:'spike',col:'#9a7442',sell:15,desc:'من ظهر الضبّ الشوكي. يستعملها الصاغة.'},
  pelt:{name:'جلد ذئب',mat:true,icon:'pelt',col:'#7d746d',sell:25,desc:'جلد سميك دافئ من ذئاب الوادي.'},
  dust:{name:'غبار الوهج',mat:true,icon:'dust',col:'#d9c35a',sell:20,desc:'يبقى مضيئًا بعد أن تنطفئ اليراعة.'},
  thornband:{name:'سوار الشوك',slot:'acc',icon:'ring',col:'#9a7442',stats:{atk:3,def:1},desc:'صاغه راشد من أشواك الضبّ.'},
  wolfcloak:{name:'عباءة الذئب',slot:'body',icon:'jacket',col:'#6d655f',stats:{def:4,hp:15,agi:1},desc:'عباءة من جلود الذئاب، تصدّ العضّات.'},
  glowring:{name:'خاتم الوهج',slot:'acc',icon:'ring',col:'#d9c35a',stats:{wis:3,mp:10},desc:'فضة مرصّعة بغبار الوهج، يضيء السحر.'},
  thornstaff:{name:'عصا الشوك',slot:'weapon',icon:'staff',col:'#6e4a2b',stats:{atk:5,luk:2},desc:'عصا ملفوفة بالجلد ومرصّعة بالأشواك.'},
  shears:{name:'مقصّ الورد',key:true,icon:'shears',col:'#8f9aa3',desc:'مقصّ مريم الذي أضاعته في الغابة.'},
  basket:{name:'سلة تمر',key:true,icon:'basket',col:'#a8713e',desc:'من أم سعيد إلى الجدة زوينة.'},
  slingshot:{name:'مقلاع حمد',slot:'acc',icon:'sling',col:'#8a5a31',stats:{atk:2,agi:1,luk:1},desc:'صنعه أبو حمد له، وأهداه لك حمد.'},
  starcharm:{name:'تميمة النجوم',slot:'acc',icon:'amulet',col:'#c9952f',stats:{luk:3,agi:2},desc:'صنعتها شمسة من النجيمات الثلاث.'},
});
ITEMS.dates.price=20;ITEMS.rosewater.price=40;
Object.assign(ENEMIES.lizard,{gold:12,mat:['spike',.55]});
Object.assign(ENEMIES.bat,{gold:10,drop:['dates',.2]});
Object.assign(ENEMIES.wolf,{gold:24,mat:['pelt',.5]});
Object.assign(ENEMIES.wisp,{gold:18,mat:['dust',.55]});
ENEMIES.guardian.gold=300;
const SHOP={
  saeed:{title:'بضاعة سعيد',sub:'من صور ومسقط ونزوى',tabs:[['buy','شراء'],['sell','بيع']],stock:['dates','rosewater','halwa','incense','qahwa','sandals','wool','khanjar']},
  rashid:{title:'دكان راشد الصائغ',sub:'أحضر ما تجده في الغابة',tabs:[['craft','صياغة'],['sell','بيع']]},
};
const RECIPES=[
  {id:'thornband',need:{spike:3},cost:80},
  {id:'glowring',need:{dust:3},cost:120},
  {id:'wolfcloak',need:{pelt:3},cost:150},
  {id:'thornstaff',need:{spike:2,pelt:2},cost:200},
];
const baisa=n=>`${AR(n)} بيسة`;
const COIN='<svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18"><circle cx="12" cy="12" r="9" fill="#e0a83e" stroke="#8a5a1a" stroke-width="1.6"/><circle cx="12" cy="12" r="5.5" fill="none" stroke="#fff3cc" stroke-width="1.2"/></svg>';
const sellValue=id=>{const it=ITEMS[id];return it.mat?it.sell:it.price?Math.floor(it.price/2):0;};
const shopSell=id=>Math.floor(sellValue(id)*((SHOP[shopId]&&SHOP[shopId].sellMult)||1));
function equippedCount(id){return Object.values(P.eq).filter(x=>x===id).length;}
const shopEl=$('shop'),shopBody=$('shopBody'),shopTabs=$('shopTabs');
let shopId=null,shopTab='buy',shopMsg='';
function openShop(id){
  shopId=id;shopTab=SHOP[id].tabs[0][0];shopMsg='';
  state='shop';resetInput();SFX.play('menuOpen');
  $('shopName').textContent=SHOP[id].title;$('shopSub').textContent=SHOP[id].sub;
  renderShop(true);shopEl.hidden=false;gameEl.classList.add('talking');
}
function closeShop(){if(state!=='shop')return;SFX.play('menuClose');shopEl.hidden=true;gameEl.classList.remove('talking');state='play';talkCooldown=.3;saveGame();}
function renderShop(reset){
  $('shopMoney').innerHTML=COIN+baisa(P.money);
  shopTabs.innerHTML=SHOP[shopId].tabs.map(([k,n])=>`<button type="button" data-stab="${k}" aria-selected="${k===shopTab}">${n}</button>`).join('');
  const top=shopBody.scrollTop;
  let html=shopMsg?`<p class="quest" role="status" style="padding:8px 12px">${shopMsg}</p>`:'';
  const row=(id,right,extra)=>{const it=ITEMS[id];const own=P.inv[id]||0;return `<div class="row">${icon(it.icon,it.col)}<span class="grow"><span class="val">${it.name}${own?` <span class="chip">تملك ${AR(own)}</span>`:''}</span><span class="lbl">${it.desc}</span>${it.stats?`<span class="chips">${chipsOf(it.stats)}</span>`:''}${extra||''}</span>${right}</div>`;};
  if(shopTab==='buy'){
    html+=`<div class="list">${SHOP[shopId].stock.map(id=>{const it=ITEMS[id],ok=P.money>=it.price;
      return row(id,it.key&&P.inv[id]?'<span class="tag-eq">تملكها</span>':`<button type="button" class="btn" data-buy="${id}"${ok?'':' disabled'}>${baisa(it.price)}</button>`);}).join('')}</div>`;
  }else if(shopTab==='race'){html+=raceBoard();
  }else if(shopTab==='haggle'){html+=haggleBoard();
  }else if(shopTab==='inn'){html+=innBoard();
  }else if(shopTab==='dive'){html+=diveBoard();
  }else if(shopTab==='arena'){html+=arenaBoard();
  }else if(shopTab==='expo'){html+=expoBoard();
  }else if(shopTab==='sell'){
    const ids=Object.keys(P.inv).filter(id=>ITEMS[id]&&P.inv[id]>0&&!ITEMS[id].key&&sellValue(id)>0&&P.inv[id]>equippedCount(id)&&(!SHOP[shopId].sellFilter||SHOP[shopId].sellFilter(id)));
    html+=ids.length?`<div class="list">${ids.map(id=>row(id,`<button type="button" class="btn ghost" data-sell="${id}">بيع بـ${baisa(shopSell(id))}</button>`)).join('')}</div>`
      :'<p class="muted">لا شيء تبيعه الآن. هدايا أهل القرية والعتاد الذي تلبسه لا يُباع.</p>';
  }else{
    html+='<p class="muted">يصوغ راشد العتاد من غنائم الغابة: أشواك الضبّ وجلود الذئاب وغبار اليراعات.</p>';
    html+=`<div class="list">${RECIPES.map(r=>{const it=ITEMS[r.id],have=P.inv[r.id]||0;
      const needs=Object.keys(r.need).map(m=>{const h=P.inv[m]||0,ok=h>=r.need[m];return `<span class="chip ${ok?'up':'down'}">${ITEMS[m].name} ${AR(Math.min(h,r.need[m]))}/${AR(r.need[m])}</span>`;}).join('');
      const can=!have&&P.money>=r.cost&&Object.keys(r.need).every(m=>(P.inv[m]||0)>=r.need[m]);
      return row(r.id,have?'<span class="tag-eq">تملكه</span>':`<button type="button" class="btn" data-craft="${r.id}"${can?'':' disabled'}>اصنع بـ${baisa(r.cost)}</button>`,`<span class="chips">${needs}</span>`);}).join('')}</div>`;
  }
  shopBody.innerHTML=html;shopBody.scrollTop=reset?0:top;
}
shopEl.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b||state!=='shop')return;
  const d=b.dataset;
  if(b.id==='shopClose'){closeShop();return;}
  if(d.race){startRace(d.race);return;}
  if(d.offer){haggleOffer(+d.offer);return;}
  if(d.rest){restInn();return;}
  if(d.dive){startDive();return;}
  if(d.arena){startArena(d.arena);return;}
  if(d.expo){runExpo();return;}
  if(d.stab){SFX.play('tab');shopTab=d.stab;shopMsg='';renderShop(true);return;}
  if(d.buy){const it=ITEMS[d.buy];if(P.money<it.price){SFX.play('error');return;}P.money-=it.price;P.inv[d.buy]=(P.inv[d.buy]||0)+1;if(shopId==='peddler')achUnlock('peddler');if(SHOP[shopId].stock&&['sweets','scent','fishmonger'].includes(shopId))achUnlock('souq');SFX.play('coin');shopMsg=`اشتريت ${it.name}.${it.slot?' تجده في القائمة ← العتاد.':''}`;renderShop();saveGame();return;}
  if(d.sell){const v=shopSell(d.sell);P.inv[d.sell]--;P.money+=v;SFX.play('coin');shopMsg=`بعت ${ITEMS[d.sell].name} بـ${baisa(v)}.`;renderShop();saveGame();return;}
  if(d.craft){const r=RECIPES.find(q=>q.id===d.craft);if(!r)return;
    if(P.money<r.cost||!Object.keys(r.need).every(m=>(P.inv[m]||0)>=r.need[m])){SFX.play('error');return;}
    P.money-=r.cost;Object.keys(r.need).forEach(m=>P.inv[m]-=r.need[m]);P.inv[r.id]=1;SFX.play('anvil');achUnlock('craft');
    shopMsg=`صاغ لك راشد ${ITEMS[r.id].name}. البسه من القائمة ← العتاد.`;$('menuDot').hidden=false;renderShop();saveGame();}
});

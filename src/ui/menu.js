// القائمة الرئيسية
'use strict';

/* =========================================================
   MAIN MENU: status, gear, bag, skills, quests, settings
   ========================================================= */
const menuEl=$('menu'),menuBody=$('menuBody'),menuTabs=$('menuTabs'),continueBtn=$('continueBtn');
const TABS=[{id:'status',name:'الحالة',ic:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 5-7 8-7s7 2 8 7"/>'},
  {id:'gear',name:'العتاد',ic:'<path d="M6 20L18 4"/><path d="M14.5 4H18v3.5"/><path d="M4.5 15.5l4 4"/>'},
  {id:'bag',name:'الحقيبة',ic:'<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'},
  {id:'skills',name:'المهارات',ic:'<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4l-5.3 3 1.2-6-4.5-4.1 6-.7z"/>'},
  {id:'quests',name:'المهام',ic:'<path d="M7 4h11v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2h11"/><path d="M10 8h5M10 12h5"/>'},
  {id:'beasts',name:'الموسوعة',ic:'<path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a3 3 0 0 0-3 3"/><path d="M20 4v14h-6"/>'},
  {id:'settings',name:'الإعدادات',ic:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>'}];
const ICONS={
  staff:'<path d="M6 21L17 4" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" fill="none"/><circle cx="17.5" cy="3.8" r="2.2"/>',
  jacket:'<path d="M7 3h10l3 8h-3v10H7V11H4z"/><path d="M12 3v18" stroke="#0000004d" stroke-width="1.2"/>',
  boot:'<path d="M7 3h6v10l6 3v5H5v-2l2-1z"/>',
  cap:'<path d="M4 16c0-6 3.6-9 8-9s8 3 8 9z"/><path d="M5 13.5h14" stroke="#fff" stroke-width="1.4"/><circle cx="8" cy="11" r="1" fill="#fff"/><circle cx="12" cy="10" r="1" fill="#fff"/><circle cx="16" cy="11" r="1" fill="#fff"/>',
  robe:'<path d="M8 3h8l3.5 18h-15z"/><path d="M12 5v6" stroke="#5c4a32" stroke-width="1.2"/><circle cx="12" cy="12" r="1.1" fill="#5c4a32"/>',
  ring:'<circle cx="12" cy="14" r="6" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M9.5 6.5 12 3l2.5 3.5L12 9z"/>',
  scarf:'<path d="M4 5h16v5H4z"/><path d="M13 10h5l-1.5 11h-3z"/><path d="M4 7.5h16" stroke="#f2e3c2" stroke-width="1.2"/>',
  amulet:'<path d="M6 3c2 5 10 5 12 0" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="14.5" r="5.5"/><circle cx="12" cy="14.5" r="2" fill="#fff3cc"/>',
  stone:'<ellipse cx="12" cy="14" rx="8.5" ry="6"/><ellipse cx="9.5" cy="12" rx="3" ry="1.5" fill="#ffffff66"/>',
  dates:'<ellipse cx="8.5" cy="14" rx="3.2" ry="5.4"/><ellipse cx="15.5" cy="13" rx="3.2" ry="5.4"/><path d="M8 8l4-4 4 4" fill="none" stroke="#4e7d33" stroke-width="1.6"/>',
  flask:'<path d="M10 3h4v5l4.5 6.5A5.5 5.5 0 1 1 5.5 14.5L10 8z"/>',
  map:'<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><circle cx="15" cy="9" r="1.4" fill="#ffd36b"/><circle cx="9" cy="13" r="1" fill="#ffd36b"/><circle cx="17" cy="14" r="1" fill="#ffd36b"/>',
  foot:'<ellipse cx="9" cy="15" rx="3.5" ry="5"/><ellipse cx="15.5" cy="8" rx="3" ry="4.5"/>',
  heart:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  bolt:'<path d="M13 2 5 13h6l-1 9 8-11h-6z"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3.2" fill="#fff3dc"/>',
  gem:'<path d="M6 4h12l3 5-9 12L3 9z"/><path d="M3 9h18" stroke="#ffffff80" stroke-width="1.2"/>',
  sword:'<path d="M14 3h7v7L9 22l-3-3-2 2-2-2 2-2-2-3z"/>',
  shield:'<path d="M12 2l8 3v6c0 5-3.6 9-8 11-4.4-2-8-6-8-11V5z"/>',
  flame:'<path d="M12 2c1 4 6 6 6 12a6 6 0 0 1-12 0c0-3 2-5 3-6 0 2 1 3 2 3 0-3-1-6 1-9z"/>',
  leaf:'<path d="M5 19C5 9 11 4 20 4c0 9-5 15-15 15z"/><path d="M5 19 14 10" stroke="#fff3dc" stroke-width="1.4"/>',
  wind:'<path d="M3 8h11a3 3 0 1 0-3-3M3 13h15a3 3 0 1 1-3 3M3 18h7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  key:'<circle cx="7" cy="12" r="4.5" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M11 12h10M17 12v4M20 12v3" stroke="currentColor" stroke-width="2.4" fill="none"/>',
  honey:'<path d="M7 6h10l1 4v8a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-8z"/><rect x="6" y="3" width="12" height="3" rx="1" fill="#8a5a1a"/><path d="M8 12h8" stroke="#fff3cc" stroke-width="1.4"/>',
  sweets:'<rect x="4" y="9" width="16" height="11" rx="3"/><path d="M6 9c0-3 2.5-5 6-5s6 2 6 5" fill="#e0a83e"/>',
  incense:'<circle cx="8" cy="14" r="3.4"/><circle cx="15" cy="12" r="3"/><circle cx="12" cy="18" r="2.6"/><circle cx="16.5" cy="18" r="2"/>',
  cup:'<path d="M5 9h12v5a6 6 0 0 1-12 0z"/><path d="M17 10h2a2 2 0 0 1 0 4h-2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M9 3c-1 2 1 3 0 5M13 3c-1 2 1 3 0 5" fill="none" stroke="currentColor" stroke-width="1.3"/>',
  dagger:'<path d="M12 2c3 4 3 9 0 13-3-4-3-9 0-13z"/><rect x="7" y="15" width="10" height="2.4" rx="1"/><path d="M11 17.4h2v3.6c0 1-2 1-2 0z"/>',
  shears:'<circle cx="7" cy="17" r="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17" cy="17" r="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 15 18 3M15 15 6 3" stroke="currentColor" stroke-width="2"/>',
  basket:'<path d="M3 10h18l-2 10H5z"/><path d="M7 10a5 5 0 0 1 10 0" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M5 14h14M6 17h12" stroke="#ffffff55" stroke-width="1.2"/>',
  sling:'<path d="M12 22V12M12 12 6 3M12 12l6-9" stroke="currentColor" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M6 3c3 4 9 4 12 0" fill="none" stroke="#c0392b" stroke-width="1.4"/>',
  spike:'<path d="M4 20 10 4l2 9 2-9 6 16z"/>',
  pelt:'<path d="M6 3h12l2 6-2 3 2 9H4l2-9-2-3z"/><path d="M9 9h6" stroke="#ffffff44" stroke-width="1.4"/>',
  dust:'<circle cx="8" cy="9" r="2.2"/><circle cx="15" cy="7" r="1.6"/><circle cx="13" cy="14" r="2.6"/><circle cx="7" cy="17" r="1.4"/><circle cx="18" cy="16" r="1.8"/>',
  empty:'<rect x="5" y="5" width="14" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray="3 3"/>',
};
const icon=(k,col)=>`<span class="ic" style="color:${col||'#5a3a1e'}"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${ICONS[k]||ICONS.empty}</svg></span>`;
const num=v=>`<bdi dir="ltr">${v>0?'+':'−'}${AR(Math.abs(v))}</bdi>`;
const chipsOf=st=>st?Object.keys(st).map(k=>`<span class="chip">${STAT_NAMES[k]} ${num(st[k])}</span>`).join(''):'';
const TITLES=['مسافر غريب','ضيف القرية','صديق الوادي','ابن عين الوادي','حارس الطريق','محارب الغابة','فارس الوادي','حامي النبع','سيف عين الوادي','أسطورة الوادي'];
let menuTab='status',eqSel=null,confirmNew=false,bagMsg='',saveMsg='',soundMsg='';

function openMenu(tab){
  if(state!=='play')return;
  state='menu';resetInput();if(tab)menuTab=tab;eqSel=null;confirmNew=false;bagMsg='';saveMsg='';
  $('menuDot').hidden=true;SFX.play('menuOpen');renderMenu(true);menuEl.hidden=false;gameEl.classList.add('talking');
  if(toastKey==='hint'||toastKey==='door')hideToast();
  setTimeout(()=>{const b=menuTabs.querySelector('[aria-selected="true"]');if(b&&lastInputKeyboard)b.focus({preventScroll:true});},30);
}
function closeMenu(){if(state!=='menu')return;SFX.play('menuClose');menuEl.hidden=true;state='play';talkCooldown=.25;gameEl.classList.remove('talking');saveGame();}
function renderHead(){
  const l=levelOf(P.xp),hpM=stat('hp'),mpM=stat('mp'),hp=curHP(),mp=curMP();
  $('heroLvl').textContent=`المستوى ${AR(l)}`;$('heroMoney').innerHTML=COIN+baisa(P.money);$('heroTitle').textContent=TITLES[l-1]||TITLES[TITLES.length-1];
  let xpTxt,xpPct;
  if(l<LEVELS.length){const a=LEVELS[l-1],b=LEVELS[l];xpTxt=`${AR(P.xp-a)} / ${AR(b-a)}`;xpPct=(P.xp-a)/(b-a)*100;}else{xpTxt='الأعلى';xpPct=100;}
  $('heroBars').innerHTML=`<div class="bar hp"><span>الصحة<em>${AR(hp)} / ${AR(hpM)}</em></span><i><b style="width:${hp/hpM*100}%"></b></i></div>`+
    `<div class="bar mp"><span>الطاقة<em>${AR(mp)} / ${AR(mpM)}</em></span><i><b style="width:${mp/mpM*100}%"></b></i></div>`+
    `<div class="bar xp"><span>الخبرة<em>${xpTxt}</em></span><i><b style="width:${xpPct}%"></b></i></div>`;
  const c=$('heroFace'),x=c.getContext('2d');x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,108,108);
  const bg=x.createRadialGradient(40,34,4,54,54,70);bg.addColorStop(0,'#fbe6b8');bg.addColorStop(1,'#d9a85c');x.fillStyle=bg;x.fillRect(0,0,108,108);
  x.setTransform(4.4,0,0,4.4,54,54+31.5*4.4-.5);drawHero(x,0,0,'down',0,false,0,false);
}
function renderMenu(resetScroll){
  renderHead();
  menuTabs.innerHTML=TABS.map(t=>`<button type="button" role="tab" data-tab="${t.id}" aria-selected="${t.id===menuTab}"><svg viewBox="0 0 24 24" aria-hidden="true">${t.ic}</svg>${t.name}</button>`).join('');
  const top=menuBody.scrollTop;
  menuBody.innerHTML={beasts:tabBeasts,status:tabStatus,gear:tabGear,bag:tabBag,skills:tabSkills,quests:tabQuests,settings:tabSettings}[menuTab]();
  menuBody.scrollTop=resetScroll?0:top;
}
function tabStatus(){
  const ks=['hp','mp','atk','def','agi','wis','luk'];
  const hh=hourNow(),hm=`${AR(Math.floor(hh))}:${AR(String(Math.floor((hh%1)*60)).padStart(2,'0'))}`,outdoor=scene.id==='village'||scene.interior;
  return `<div class="set" style="padding:6px 0 12px"><div class="grow"><b>الوقت: ${phaseName()}</b><div class="muted">الساعة ${hm}. في الليل تظهر مخلوقات أخرى في الغابة</div></div>${outdoor?`<div class="actions"><button type="button" class="btn" data-act="wait" data-h="${isNight()?7:20}">${isNight()?'استرح حتى الصباح':'استرح حتى الليل'}</button></div>`:''}</div>
  <h3>الخصائص</h3><div class="stats">${ks.map(k=>{const b=bonusStat(k);return `<div class="stat"><div class="n"><b>${STAT_NAMES[k]}</b><small>${STAT_NOTES[k]}</small></div><div class="v">${AR(stat(k))}${b?`<em>${num(b)}</em>`:''}</div></div>`;}).join('')}
  <div class="stat"><div class="n"><b>سرعة المشي</b><small>من الرشاقة والمهارات</small></div><div class="v">${AR(Math.round(heroSpeed()/SPEED*100))}٪</div></div></div>
  ${P.flags.aisha?`<h4>عائشة · رفيقة الرحلة</h4><div class="stats">${['hp','mp','atk','def','agi','wis'].map(k=>`<div class="stat"><div class="n"><b>${STAT_NAMES[k]}</b></div><div class="v">${AR(k==='hp'?allyHP():k==='mp'?allyMP():allyStat(k))}${k==='hp'||k==='mp'?`<em> / ${AR(allyStat(k))}</em>`:''}</div></div>`).join('')}</div>`:''}
  <p class="muted" style="margin-top:12px">الرقم الأخضر هو ما يضيفه العتاد والمهارات. الهجوم والدفاع والحكمة تحدد قوتك في معارك الغابة.</p>`;
}
function tabGear(){
  const slots=SLOTS.map(sl=>{const id=P.eq[sl.id],it=id&&ITEMS[id];
    return `<button type="button" class="row${eqSel===sl.id?' sel':''}" data-slot="${sl.id}">${it?icon(it.icon,it.col):icon('empty','#b59a72')}<span class="grow"><span class="lbl">${sl.name}</span><span class="val${it?'':' empty'}">${it?it.name:'فارغ'}</span>${it?`<span class="chips">${chipsOf(it.stats)}</span>`:''}</span></button>`;}).join('');
  let pick='<p class="muted">اختر خانة لترى القطع التي تناسبها، ومقدار ما تغيّره في خصائصك.</p>';
  if(eqSel){
    const sl=SLOTS.find(s=>s.id===eqSel),cur=P.eq[eqSel],other=sl.type==='acc'?P.eq[eqSel==='acc1'?'acc2':'acc1']:null;
    const cands=Object.keys(P.inv).filter(id=>P.inv[id]>0&&ITEMS[id]&&ITEMS[id].slot===sl.type&&id!==other);
    pick=`<h4 id="pick">${sl.name}</h4><div class="list">${cands.length?cands.map(id=>{
      const it=ITEMS[id],on=id===cur,eq2=Object.assign({},P.eq,{[eqSel]:id});
      const diff=Object.keys(STAT_NAMES).map(k=>[k,stat(k,eq2)-stat(k)]).filter(d=>d[1]);
      const chips=on?chipsOf(it.stats):diff.map(([k,v])=>`<span class="chip ${v>0?'up':'down'}">${STAT_NAMES[k]} ${num(v)}</span>`).join('')||'<span class="chip">بلا تغيير</span>';
      return `<button type="button" class="row${on?' sel':''}" data-equip="${id}">${icon(it.icon,it.col)}<span class="grow"><span class="val">${it.name} ${on?'<span class="tag-eq">مجهّز</span>':''}</span><span class="lbl">${it.desc}</span><span class="chips">${chips}</span></span></button>`;}).join('')
      :'<p class="muted">لا تملك قطعة لهذه الخانة بعد. أهل القرية كرماء، فتحدّث إليهم.</p>'}</div>${cur?`<div class="actions" style="margin-top:10px"><button type="button" class="btn ghost" data-unequip="${eqSel}">نزع ${ITEMS[cur].name}</button></div>`:''}`;
  }
  return `<h3>العتاد</h3><div class="two"><div class="list">${slots}</div><div>${pick}</div></div>`;
}
function tabBag(){
  const ids=Object.keys(P.inv).filter(id=>P.inv[id]>0&&ITEMS[id]);
  const equipped=new Set(Object.values(P.eq));
  const row=(id,extra)=>{const it=ITEMS[id];return `<div class="row">${icon(it.icon,it.col)}<span class="grow"><span class="val">${it.name}${P.inv[id]>1?' ×'+AR(P.inv[id]):''} ${equipped.has(id)?'<span class="tag-eq">مجهّز</span>':''}</span><span class="lbl">${it.desc}</span></span>${extra||''}</div>`;};
  const use=ids.filter(id=>ITEMS[id].use),key=ids.filter(id=>ITEMS[id].key),gear=ids.filter(id=>ITEMS[id].slot),mats=ids.filter(id=>ITEMS[id].mat);
  const none='<p class="muted">لا شيء بعد.</p>';
  return `<h3>الحقيبة</h3><p class="coins" style="color:#7a4a26;margin:0 0 6px">${COIN}${baisa(P.money)}</p>${bagMsg?`<p class="quest" role="status" style="padding:8px 12px">${bagMsg}</p>`:''}
  <h4>المؤن</h4><div class="list">${use.length?use.map(id=>row(id,`<button type="button" class="btn" data-use="${id}">استخدام</button>`)).join(''):none}</div>
  <h4>مواد الصياغة</h4><div class="list">${mats.length?mats.map(id=>row(id)).join(''):'<p class="muted">تسقط من حيوانات الغابة. أحضرها إلى راشد ليصوغ منها.</p>'}</div>
  <h4>أغراض مهمة</h4><div class="list">${key.length?key.map(id=>row(id)).join(''):none}</div>
  <h4>قطع العتاد</h4><div class="list">${gear.map(id=>row(id)).join('')}</div>`;
}
function tabSkills(){
  const l=levelOf(P.xp);
  const card=(name,ic,got,chips,desc)=>`<div class="skill${got?'':' locked'}">${icon(ic,got?'#a9472a':'#9a8466')}<div class="grow"><b>${name}</b><div class="meta">${chips}</div><p class="muted" style="margin:0">${desc}</p></div></div>`;
  const req=(got,lv)=>`<span class="chip${got?' up':''}">${got?'مكتسبة':'عند المستوى '+AR(lv)}</span>`;
  const ab=t=>ABILITIES.filter(a=>a.type===t).map(a=>{const got=l>=a.lv;return card(a.name,a.icon,got,`<span class="chip">${AR(a.mp)} طاقة</span>${req(got,a.lv)}`,a.desc);}).join('');
  const full=(P.gauge||0)>=100;
  return `<h3>المهارات</h3>
  <h4>مهارات القتال</h4><div class="skills">${ab('skill')}</div>
  <h4>السحر</h4><div class="skills">${ab('magic')}</div>
  ${P.flags.aisha?`<h4>سحر عائشة</h4><div class="skills">${ALLY_SPELLS.map(a=>{const got=l>=a.lv;return card(a.name,a.icon,got,`<span class="chip">${AR(a.mp)} طاقة</span>${req(got,a.lv)}`,a.desc);}).join('')}</div>`:''}
  <h4>المهارات الخاصة</h4><div class="skills">${card(SPECIAL.name,SPECIAL.icon,true,`<span class="chip${full?' up':''}">العزيمة ${AR(Math.floor(P.gauge||0))}٪</span>`,SPECIAL.desc)}${card(ABILITY_TEASER.name,'empty',false,'<span class="chip">لاحقًا</span>',ABILITY_TEASER.desc)}</div>
  <h4>مهارات دائمة</h4><div class="skills">${SKILLS.map(s=>{const got=l>=s.lv;return card(s.name,s.icon,got,`<span class="chip">${s.kind}</span>${req(got,s.lv)}`,s.desc);}).join('')}</div>`;
}
function tabQuests(){
  const total=VILLAGERS.length,done=met.size;
  let html='<h3>المهام</h3>';
  if(!questStarted)html+=`<div class="quest"><h4 style="margin-top:0">الوصول إلى عين الوادي</h4><p class="muted" style="margin:0">تحدّث إلى سالم عند النافورة.</p></div>`;
  else html+=`<div class="quest${chapterDone?' done':''}"><h4 style="margin-top:0">أهل عين الوادي ${chapterDone?'<span class="chip up">مكتملة</span>':`<span class="chip">${AR(done)} من ${AR(total)}</span>`}</h4>
    <p class="muted">${chapterDone?'عرفتَ أهل القرية كلهم.':done>=total?'عُد إلى سالم عند النافورة.':'تعرّف على أهل القرية واحدًا واحدًا.'}</p>
    ${chapterDone?'':`<ul class="check">${VILLAGERS.map(n=>{const ok=met.has(n.id);return `<li class="${ok?'done':''}"><i>${ok?'✓':''}</i><span class="grow"><b>${ok?n.name:'شخص لم تقابله'}</b><br><span class="muted">${HINTS[n.id]}</span></span></li>`;}).join('')}</ul>`}</div>`;
  if(chapterDone){
    const st=[[P.flags.aisha,'انضمت عائشة إلى الفريق','عائشة تنتظرك عند مدخل الغابة'],[P.flags.stone,'وصلتم إلى حجر النور','اتبع ممر الغابة حتى الضوء'],[P.flags.boss,'هزمتم حارس النور','اهزم حارس النور (ننصح بالمستوى الخامس أو أعلى)']];
    html+=`<div class="quest${P.flags.boss?' done':''}"><h4 style="margin-top:0">ضوء بين الأشجار ${P.flags.boss?'<span class="chip up">مكتملة</span>':'<span class="chip">الفصل الثاني</span>'}</h4>
      <ul class="check">${st.map(([ok,a2,b2])=>`<li class="${ok?'done':''}"><i>${ok?'✓':''}</i><span class="grow"><b>${ok?a2:b2}</b></span></li>`).join('')}</ul>
      <p class="muted" style="margin:8px 0 0">${P.flags.boss?'في يدك شظية من نجمة الوادي.':'إن تعبتم فاشربوا من ماء النافورة في القرية.'}</p></div>`;
    if(P.flags.boss){
      const st3=[[P.flags.ch3,'عرفتم ما حدث للفلج','تحدّث إلى سالم عند النافورة'],[P.flags.wadi,'وصلتم إلى وادي الفلج','اتبع الطريق شرق الساحة'],[P.flags.gates,'فتحتم بوابات الفلج','افتح البوابات الثلاث بالترتيب الذي يذكره النقش'],[P.flags.boss2,'هزمتم حيّة العين','اهزم ما يسكن عين الفلج (ننصح بالمستوى السابع أو أعلى)']];
      html+=`<div class="quest${P.flags.boss2?' done':''}"><h4 style="margin-top:0">سرّ النجمة الساقطة ${P.flags.boss2?'<span class="chip up">مكتملة</span>':'<span class="chip">الفصل الثالث</span>'}</h4>
        <ul class="check">${st3.map(([ok,a2,b2])=>`<li class="${ok?'done':''}"><i>${ok?'✓':''}</i><span class="grow"><b>${ok?a2:b2}</b></span></li>`).join('')}</ul></div>`;
    }
    if(P.flags.boss2){
      const st4=[[P.flags.ch4,'عرفتم مكان الشظية الثالثة','تحدّث إلى سالم'],[P.flags.fort,'دخلتم الحصن القديم','انزل الدرج في جنوب وادي الفلج'],[P.flags.gateopen,'فتحتم البوابة الداخلية','ابحث عن مفتاح البوابة في جرار الساحة'],[P.flags.boss3,'هزمتم عملاق الحصن','خذ الشظية من منصة القلعة (ننصح بالمستوى التاسع)'],[P.flags.ending,'اكتملت نجمة الوادي','خذ الشظايا الثلاث إلى حجر النور في الغابة']];
      html+=`<div class="quest${P.flags.ending?' done':''}"><h4 style="margin-top:0">نجمة الوادي ${P.flags.ending?'<span class="chip up">مكتملة</span>':'<span class="chip">الفصل الأخير</span>'}</h4>
        <ul class="check">${st4.map(([ok,a2,b2])=>`<li class="${ok?'done':''}"><i>${ok?'✓':''}</i><span class="grow"><b>${ok?a2:b2}</b></span></li>`).join('')}</ul></div>`;
    }
    html+='<h4>مهام جانبية</h4>';
    for(const id in SIDEQ){const q=SIDEQ[id],st=qState(id),giver=NPCS.find(n=>n.id===q.giver).name;
      const prog=q.progress&&st===1?` <span class="chip">${AR(q.progress())} من ${AR(q.goal)}</span>`:'';
      const tag=st===2?'<span class="chip up">مكتملة</span>':st===1?(qReady(id)?'<span class="chip up">جاهزة للتسليم</span>':prog):'<span class="chip">متاحة</span>';
      const txt=st===0?`تحدّث إلى ${giver} (علامة ! فوق رأسه)`:st===1?(qReady(id)?`عُد إلى ${q.target?NPCS.find(n=>n.id===q.target).name:giver}`:q.hint):'شكرًا لمساعدتك.';
      html+=`<div class="quest${st===2?' done':''}"><h4 style="margin-top:0">${q.title} ${tag}</h4><p class="muted" style="margin:0">${txt}</p></div>`;}
  }
  return html;
}
const SETS=[
  {k:'sound',name:'المؤثرات الصوتية',note:'تعمل حتى مع مفتاح الصامت في الآيفون، فأوقفها من هنا إن أردت الهدوء',opts:[['on','تشغيل'],['off','إيقاف']]},
  {k:'volume',name:'مستوى الصوت',opts:[['low','منخفض'],['mid','متوسط'],['high','مرتفع']]},
  {k:'music',name:'الموسيقى',note:'ألحان للقرية والغابة والمعارك',opts:[['on','تشغيل'],['off','إيقاف']]},
  {k:'ambient',name:'أصوات البيئة',note:'العصافير، والنافورة، وصرير الصراصير في الغابة',opts:[['on','تشغيل'],['off','إيقاف']]},
  {k:'text',name:'حجم نص الحوار',opts:[['normal','عادي'],['large','كبير']]},
  {k:'controls',name:'حجم أزرار التحكم',opts:[['normal','عادي'],['large','كبير']]},
  {k:'hand',name:'موضع عصا الحركة',note:'ينتقل زر التفاعل إلى الجهة الأخرى',opts:[['left','يسار'],['right','يمين']]},
  {k:'camera',name:'متابعة الكاميرا',opts:[['smooth','ناعمة'],['snappy','سريعة']]},
  {k:'quality',name:'جودة الرسوم',note:'الوضع الموفّر يخفف الحمل على البطارية',opts:[['high','عالية'],['saver','موفّرة']]},
  {k:'shake',name:'اهتزاز الشاشة',note:'يهتز المشهد مع الضربات القوية والزلازل. أوقفه إن كان مزعجًا',opts:[['on','تشغيل'],['off','إيقاف']]},
  {k:'hud',name:'عدّاد المهمة',opts:[['show','ظاهر'],['hide','مخفي']]},
  {k:'minimap',name:'الخريطة الصغيرة',note:'المسها لتكبيرها أو تصغيرها',opts:[['show','ظاهرة'],['hide','مخفية']]},
  {k:'encounters',name:'تكرار المعارك في الغابة',opts:[['low','قليلة'],['normal','عادية'],['high','كثيرة']]},
  {k:'bspeed',name:'سرعة رسائل المعركة',opts:[['normal','عادية'],['fast','سريعة']]},
];
function tabSettings(){
  return `<h3>الإعدادات</h3>${SETS.map(s=>`<div class="set"><div class="grow"><b>${s.name}</b>${s.note?`<div class="muted">${s.note}</div>`:''}</div><div class="seg" role="group" aria-label="${s.name}">${s.opts.map(([v,l])=>`<button type="button" data-opt="${s.k}" data-val="${v}" aria-pressed="${OPT[s.k]===v}">${l}</button>`).join('')}</div></div>`).join('')}
  <div class="set"><div class="grow"><b>تجربة الصوت</b><div class="muted" role="status">${soundMsg||'تُشغّل نغمة قصيرة لتتأكد أن الصوت يعمل.'}</div></div><div class="actions"><button type="button" class="btn" data-act="testsound">تشغيل نغمة</button></div></div>
  <div class="set"><div class="grow"><b>حفظ الرحلة</b><div class="muted" role="status">${saveMsg||'تُحفظ رحلتك تلقائيًا في هذا المتصفح.'}</div></div><div class="actions"><button type="button" class="btn" data-act="save">حفظ الآن</button><button type="button" class="btn ${confirmNew?'warn':'ghost'}" data-act="new">${confirmNew?'تأكيد: مسح التقدم':'رحلة جديدة'}</button></div></div>`;
}
menuEl.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b||state!=='menu')return;
  const d=b.dataset;
  if(b.id==='menuClose'){closeMenu();return;}
  if(d.tab){SFX.play('tab');menuTab=d.tab;eqSel=null;confirmNew=false;bagMsg='';saveMsg='';renderMenu(true);menuTabs.querySelector(`[data-tab="${d.tab}"]`)?.focus({preventScroll:true});return;}
  if(d.act!=='new')confirmNew=false;
  if(d.slot){SFX.play('tap');eqSel=eqSel===d.slot?null:d.slot;renderMenu();if(eqSel&&matchMedia('(max-width:700px),(orientation:portrait)').matches)$('pick')?.scrollIntoView({block:'start',behavior:'smooth'});return;}
  if(d.equip){SFX.play(P.eq[eqSel]===d.equip?'tap':'equip');P.eq[eqSel]=d.equip;P.hp=Math.min(curHP(),stat('hp'));P.mp=Math.min(curMP(),stat('mp'));renderMenu();saveGame();return;}
  if(d.unequip){SFX.play('unequip');P.eq[d.unequip]=null;P.hp=Math.min(curHP(),stat('hp'));P.mp=Math.min(curMP(),stat('mp'));renderMenu();saveGame();return;}
  if(d.use){
    const it=ITEMS[d.use];
    if(it.use==='revive'){SFX.play('error');bagMsg='تُستخدم في المعركة فقط، حين يسقط أحد أفراد الفريق.';renderMenu();return;}
    const hpLike=it.use==='hp'||it.use==='cure',ratio=m=>hpLike?mHP(m)/mStat(m,'hp'):mMP(m)/mStat(m,'mp');
    const need=members().filter(m=>ratio(m)<1).sort((x,y)=>ratio(x)-ratio(y));
    if(!need.length){SFX.play('error');bagMsg=hpLike?'صحة الفريق مكتملة، فاحتفظ به لوقت الحاجة.':'طاقة الفريق مكتملة، فاحتفظ بها لوقت الحاجة.';}
    else{const t=need[0];P.inv[d.use]--;if(hpLike)setHP(t,mHP(t)+it.amount);else setMP(t,mMP(t)+it.amount);SFX.play('potion');bagMsg=`استخدمت ${it.name}${t==='aisha'?' على عائشة':''}.`;saveGame();}
    renderMenu();return;
  }
  if(d.opt){
    const was=OPT[d.opt];OPT[d.opt]=d.val;applyOptions();if(d.opt==='sound')SFX.unlock();SFX.play('tap');
    if(d.opt==='quality'&&was!==d.val)resize();
    if(d.opt==='encounters')resetMeter();
    if(d.opt==='hand'||d.opt==='controls')requestAnimationFrame(()=>stickHome(true));
    renderMenu();return;
  }
  if(d.act==='wait'){SFX.play('confirm');waitUntil(+d.h,+d.h===7?'طلع الصباح على عين الوادي':'حلّ الليل على عين الوادي');return;}
  if(d.act==='testsound'){
    if(OPT.sound==='off'){soundMsg='المؤثرات متوقفة. شغّلها من الخيار أعلاه.';renderMenu();return;}
    SFX.test();setTimeout(()=>{const st=SFX.ctx?SFX.ctx.state:'none';soundMsg=st==='running'?'إن لم تسمع النغمة، ارفع صوت الوسائط من أزرار الهاتف.':st==='none'?'هذا المتصفح لا يدعم تشغيل الصوت.':'المتصفح ما زال يحجب الصوت. المس الشاشة ثم جرّب مرة أخرى.';if(state==='menu'&&menuTab==='settings')renderMenu();},350);return;
  }
  if(d.act==='save'){SFX.play('confirm');saveMsg=saveGame()?'حُفظت رحلتك.':'تعذّر الحفظ في هذا المتصفح.';renderMenu();return;}
  if(d.act==='new'){
    if(!confirmNew){SFX.play('error');confirmNew=true;renderMenu();return;}
    menuEl.hidden=true;gameEl.classList.remove('talking');resetWorld();backToTitle();
  }
});
$('menuBtn').addEventListener('click',()=>{if(state==='play')openMenu();});
let lastInputKeyboard=false;
window.addEventListener('pointerdown',()=>{lastInputKeyboard=false;},true);
function backToTitle(){
  state='title';hideToast();gameEl.classList.add('title');
  titleEl.hidden=false;titleEl.classList.remove('leaving');
  continueBtn.hidden=true;startBtn.textContent='ابدأ الرحلة';startBtn.classList.remove('ghost');
}
continueBtn.addEventListener('click',()=>{if(state!=='title'||!savedData)return;applySave(savedData);startGame(true);});

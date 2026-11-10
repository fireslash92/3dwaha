// الحوار والفصول والانتقال بين المشاهد
'use strict';

/* =========================================================
   FLOW: title, doors, dialog, quest, chapter
   ========================================================= */
let toastKey=null,toastUntil=0;
function showToast(key,html,dur){toastEl.innerHTML=html;toastEl.classList.add('show');toastKey=key;toastUntil=dur?time+dur:Infinity;}
function hideToast(){toastEl.classList.remove('show');toastKey=null;toastGap=time+.3;}
const toastQ=[];let toastGap=0;
function notify(html,dur=2.4){if(toastKey&&toastKey!=='hint')toastQ.push([html,dur]);else showToast('note',html,dur);}
function updateHud(bump){
  hud.hidden=!questStarted;
  const all=met.size>=VILLAGERS.length;
  hud.classList.toggle('done',all);
  hudLabel.textContent=chapterDone?'انتهى الفصل الأول':all?'عُد إلى سالم':'أهل القرية';
  hudCount.textContent=chapterDone||all?'':`${AR(met.size)} من ${AR(VILLAGERS.length)}`;
  hudCount.hidden=chapterDone||all;
  if(bump){hud.classList.remove('bump');void hud.offsetWidth;hud.classList.add('bump');}
}
function startGame(resume){
  if(state!=='title')return;
  state='play';gameEl.classList.remove('title');titleEl.classList.add('leaving');
  setTimeout(()=>{if(state!=='title')titleEl.hidden=true;},520);
  updateHud(false);SFX.play('start');
  if(resume){showToast('note','أهلًا بعودتك إلى عين الوادي',2.4);return;}
  saveGame();
  const desktop=matchMedia('(hover:hover) and (pointer:fine)').matches;
  showToast('hint','تحرّك بالعصا، واقترب من سالم للتحدث معه'+(desktop?'<small>على الحاسوب: الأسهم أو WASD، وزر E للتفاعل</small>':''),6.5);
}
function act(){
  if(state==='dialog'){advance();return;}
  if(state==='fish'){fishPress();return;}
  if(state==='race'){racePress();return;}
  if(state==='dive'){divePress();return;}
  if(state!=='play'||talkCooldown>0||!target)return;
  if(target.kind==='npc')openDialog(target.npc);
  else if(target.kind==='door')enterHouse(target.house);
  else if(target.kind==='exit')exitHouse();
  else if(target.kind==='gate'){openGate(target.i);talkCooldown=.5;}
  else if(target.kind==='pot'){smashPot(target.p);talkCooldown=.4;}
  else if(target.kind==='innergate'){tryInnerGate();talkCooldown=.6;}
  else if(target.kind==='fish')startFishing(target.w);
  else if(target.kind==='area')areaAct(target);
  else if(target.kind==='pickup'){takePickup(target.p);talkCooldown=.2;}
  else if(target.kind==='spring'){const full=curHP()>=stat('hp')&&curMP()>=stat('mp')&&(!P.flags.aisha||allyHP()>=allyStat('hp')&&allyMP()>=allyStat('mp'));P.hp=null;P.mp=null;P.ally={hp:null,mp:null};SFX.play('water');showToast('note',scene.fort?'شربتم من بئر الحصن<small>عادت إليكم الصحة والطاقة</small>':dryVillage()?'بقي في الحوض قليل من الماء…<small>شربتم فعادت إليكم الصحة والطاقة</small>':full?'ماء النافورة بارد وعذب':'شربت من ماء النافورة<small>عادت إليك صحتك وطاقتك كاملتين</small>',2.6);saveGame();talkCooldown=.5;}
}
function face(from,to){const dx=to.x-from.x,dy=to.y-from.y;return Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');}
function remainingLine(left){
  const who=left===1?'شخص واحد لم تتعرّف عليه':left===2?'شخصان لم تتعرّف عليهما':`${AR(left)} أشخاص لم تتعرّف عليهم`;
  return `بقي ${who} بعد. بعضهم داخل البيوت، فلا تتردد في طرق الأبواب.`;
}
function linesFor(n){
  if(n.linesFn){const l=n.linesFn();if(l)return l;}
  if(n===SIGN)return SIGN_LINES;
  if(n===ALTAR)return P.flags.boss3?['المنصة فارغة الآن. أخذتم الشظية الثالثة.']:['على المنصة تتوهج الشظية الثالثة.','تمتد أيديكما إليها… فتهتز الأرض وتتحرك الجدران!'];
  if(n===SPRING){
    if(P.flags.boss2)return ['ماء العين صافٍ وبارد. شربتم منه فعادت إليكم قوتكم.'];
    if(P.flags.gates)return ['الماء يتدفّق من العين… لكن الماء يغلي ويضطرب.','ترتفع من العين حيّة عظيمة، عيناها تلمعان كالذهب!'];
    return ['العين مسدودة، والماء فيها راكد وقليل.','ربما للبوابات الثلاث على الفلج علاقة بذلك.'];
  }
  if(n===STONE){
    if(P.flags.ending)return ['النجمة تلمع في السماء فوق الغابة، وتضيء لأهل الوادي كل ليلة.'];
    if(P.flags.boss3)return ENDING_LINES;
    if(P.flags.boss)return ['الحجر هادئ الآن، وفي مكان النقش فراغ على شكل نجمة.'];
    return (n.talked?['يعود الحجر إلى التوهّج… والحارس ينتظر.']:STONE.lines).concat('فجأة يشتد الوهج، وينهض من الحجر حارس من نور!');
  }
  if(n.id==='aisha'&&chapterDone&&!P.flags.aisha)return AISHA_JOIN;
  if(n===SALEM){
    if(!questStarted)return SALEM_INTRO;
    if(P.flags.ending&&!P.flags.ch5)return SALEM_CH5;
    if(P.flags.ending)return ['انظرا إلى السماء! نجمة الوادي عادت تلمع فوقنا.','عين الوادي بيتكما دائمًا. أهلًا بكما متى شئتما.'];
    if(P.flags.boss3)return ['الشظايا الثلاث! خذاها إلى حجر النور في قلب الغابة، فهناك سقطت النجمة.'];
    if(P.flags.ch4)return ['الحصن خلف الوادي. انزلا الدرج في جنوب الوادي، وابحثا عن مفتاح بوابته الداخلية.'];
    if(P.flags.boss2)return SALEM_CH4;
    if(P.flags.boss)return P.flags.ch3?['الوادي شرق القرية. اتبعا الطريق من الساحة، وانتبها للعقارب والأفاعي.','اقرأا النقش عند مدخل الوادي قبل أن تفتحا البوابات.']:SALEM_CH3;
    if(chapterDone)return P.flags.aisha?['عائشة معك، فلا تخف. امضِ نحو الضوء، وإن تعبتما فاشربا من ماء النافورة.']:['طريق الغابة مفتوح الآن. عائشة تنتظرك عند مدخله، ولن تتركك تذهب وحدك.'];
    if(met.size>=VILLAGERS.length)return SALEM_END;
    return ['أهل القرية طيبون، سلّم عليهم واحدًا واحدًا.',remainingLine(VILLAGERS.length-met.size)];
  }
  const ql=questLines(n);if(ql)return ql;
  return n.talked?n.repeat:n.lines;
}
function openDialog(n){
  state='dialog';resetInput();talkNpc=n;lines=linesFor(n);
  hero.dir=face(hero,n);n.dir=face(n,hero);n.moving=false;
  page=0;dlgName.textContent=n.name;
  dotsEl.innerHTML=lines.map(()=>'<i></i>').join('');dotsEl.style.visibility=lines.length<2?'hidden':'visible';
  drawPortrait(n);SFX.play(n.portrait?'mystic':'dlgOpen');renderPage(true);
  dlg.hidden=false;gameEl.classList.add('talking');actBtn.classList.remove('ready');
  if(toastKey)hideToast();
}
function renderPage(first){
  dlgText.textContent=lines[page];
  if(!first||talkNpc&&!talkNpc.portrait)setTimeout(()=>SFX.voice(talkNpc,lines[page]||''),first?120:40);
  dlgNext.textContent=page===lines.length-1?'إغلاق':'التالي';
  [...dotsEl.children].forEach((d,i)=>d.classList.toggle('on',i===page));
}
function advance(){
  if(state!=='dialog')return;
  page++;
  if(page>=lines.length){closeDialog();return;}
  SFX.play('dlgNext');renderPage();
}
function closeDialog(){
  SFX.play('dlgClose');dlg.hidden=true;gameEl.classList.remove('talking');
  state='play';page=0;talkCooldown=.3;resetInput();
  const n=talkNpc,said=lines;talkNpc=null;
  if(!n)return;
  n.talked++;n.lookAt=time+2.5;
  if(n===SALEM){
    if(!questStarted){questStarted=true;updateHud(true);const gl=giveGift(n);showToast('note',(met.size>=VILLAGERS.length?'تعرّفت على الجميع. تحدّث إلى سالم مرة أخرى':'مهمة جديدة: تعرّف على أهل القرية')+gl,3.2);gainXP(XP_SALEM);}
    else if(said===SALEM_CH4&&!P.flags.ch4){P.flags.ch4=1;SFX.play('quest');notify('فُتح الدرج إلى الحصن القديم<small>في جنوب وادي الفلج</small>',3.6);}
    else if(said===SALEM_CH3&&!P.flags.ch3){P.flags.ch3=1;SFX.play('quest');notify('فُتح طريق الوادي شرق القرية<small>اتبع الطريق شرقًا من الساحة</small>',3.6);}
    else if(said===SALEM_END){chapterDone=true;P.money+=150;updateHud(false);gainXP(XP_CHAPTER);openChapter();}
  }else if(n.noMeet){
    if(n===STONE){P.flags.stone=1;if(!P.flags.boss)setTimeout(()=>startEncounter({types:['guardian'],boss:true}),250);}
    if(n===ALTAR&&!P.flags.boss3)setTimeout(()=>startEncounter({types:['golem'],boss:true}),250);
    if(n===STONE&&said===ENDING_LINES&&!P.flags.ending){P.flags.ending=1;fadeEl.classList.add('white','on');setTimeout(()=>{fadeEl.classList.remove('on');setTimeout(()=>fadeEl.classList.remove('white'),400);openEnding();},900);}
    if(n===SPRING){if(P.flags.boss2){P.hp=null;P.mp=null;P.ally={hp:null,mp:null};SFX.play('water');}else if(P.flags.gates)setTimeout(()=>startEncounter({types:['serpent'],boss:true}),250);}
  }else if(n.id==='aisha'&&said===AISHA_JOIN){
    P.flags.aisha=1;P.ally={hp:null,mp:null};syncAisha();resetTrail();SFX.play('itemGet');
    notify('انضمت عائشة إلى فريقك<small>تقاتل معك وتشفي بسحرها، وتجد سحرها في القائمة</small>',3.6);$('menuDot').hidden=false;
  }else if(!met.has(n.id)){
    met.add(n.id);updateHud(true);SFX.play('quest');
    notify(`تعرّفت على ${n.name}${giveGift(n)}`,2.8);gainXP(XP_MEET);
    if(met.size>=VILLAGERS.length)notify('تعرّفت على الجميع. تحدّث إلى سالم عند النافورة',3.6);
  }
  if(questAct&&questAct.n===n&&said===questAct.lines){const qa=questAct;questAct=null;applyQuest(qa);}
  else if(n.shop&&said===n.repeat)openShop(n.shop);
  if(n.onSaid)n.onSaid(said);
  saveGame();
}
function giveGift(n){
  const gf=GIFTS[n.id];if(!gf||P.gifts[n.id])return '';
  P.gifts[n.id]=1;P.inv[gf.item]=(P.inv[gf.item]||0)+gf.n;SFX.play('itemGet',{d:.35});
  const it=ITEMS[gf.item];
  $('menuDot').hidden=false;
  return `<small>حصلت على: ${it.name}${gf.n>1?' ×'+AR(gf.n):''} · تجده في ${it.slot?'العتاد':'الحقيبة'}</small>`;
}
function gainXP(n){
  const before=levelOf(P.xp);P.xp+=n;const after=levelOf(P.xp);
  if(after>before){
    P.hp=null;P.mp=null;P.ally={hp:null,mp:null};SFX.play('levelUp',{d:.9});
    const learned=SKILLS.filter(s=>s.lv&&s.lv>before&&s.lv<=after).map(s=>s.name);
    notify(`ارتفع مستواك إلى ${AR(after)}${learned.length?'<small>تعلّمت: '+learned.join('، ')+'</small>':''}`,3);
    $('menuDot').hidden=false;
  }
}
let chapterCard=1;
function openChapter2(){
  chapterCard=2;const c=chapterEl;c.querySelector('h2').textContent='نهاية الفصل الثاني';
  c.querySelector('.tag').innerHTML='هزمتم حارس النور، ووجدتم شظية من نجمة الوادي.<br>يتبع: سرّ النجمة الساقطة';
  SFX.play('fanfare');state='chapter';resetInput();c.hidden=false;c.classList.remove('leaving');gameEl.classList.add('talking');
}
function openChapter3(){
  chapterCard=3;const c=chapterEl;c.querySelector('h2').textContent='نهاية الفصل الثالث';
  c.querySelector('.tag').innerHTML='عاد الماء إلى فلج عين الوادي، ووجدتم الشظية الثانية.<br>يتبع: الحصن القديم';
  SFX.play('fanfare');state='chapter';resetInput();c.hidden=false;c.classList.remove('leaving');gameEl.classList.add('talking');
}
function openChapter(){chapterCard=1;SFX.play('fanfare');state='chapter';resetInput();chapterEl.hidden=false;chapterEl.classList.remove('leaving');gameEl.classList.add('talking');}
function closeChapter(){if(state!=='chapter')return;if(chapterCard===5){const f=cardAfter;cardAfter=null;chapterEl.classList.add('leaving');gameEl.classList.remove('talking');setTimeout(()=>{chapterEl.hidden=true;},500);state='play';talkCooldown=.4;if(f)f();saveGame();return;}if(chapterCard===1){syncAisha();notify('فُتح طريق الغابة شمال القرية<small>وعائشة تنتظرك عند مدخله</small>',4);notify('أعطاك سالم ١٥٠ بيسة للطريق<small>سعيد يبيع المؤن، وراشد يصوغ من غنائم الغابة، وبعض أهل القرية يحتاجون مساعدتك</small>',4.4);}else if(chapterCard===4)notify('شكرًا لأنك لعبت أسرار عين الوادي<small>تستطيع إكمال المهام الجانبية وموسوعة المخلوقات</small>',4);else if(chapterCard===2)notify('تحدّث إلى سالم عند النافورة<small>ماء الفلج بدأ يجف!</small>',3.6);else notify('عاد الماء إلى عين الوادي<small>الفصل الرابع قادم: الحصن القديم</small>',3.6);chapterEl.classList.add('leaving');gameEl.classList.remove('talking');setTimeout(()=>{chapterEl.hidden=true;},500);state='play';talkCooldown=.4;}

function goTo(id,x,y,dir,label){
  if(state!=='play')return;
  state='fade';resetInput();fadeEl.classList.add('on');
  if(toastKey==='forest'||toastKey==='door')hideToast();
  setTimeout(()=>{
    scene=SCENES[id];ensureScene(scene);
    hero.x=x;hero.y=y;hero.dir=dir;hero.moving=false;inForest=false;target=null;
    snapCamera();resetTrail();
    fadeEl.classList.remove('on');state='play';talkCooldown=.25;saveGame();
    if(label)showToast('place',label,2);
  },260);
}
function enterHouse(h){if(state==='play')SFX.play('doorOpen');goTo(h.id,224,IH-42,'up',INTERIORS[h.id].name);}
function exitHouse(){const h=scene.house;if(state==='play')SFX.play('doorClose');goTo('village',h.doorX,h.base+20,'down',null);}

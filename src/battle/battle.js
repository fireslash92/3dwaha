// نظام المعارك والأعداء
'use strict';

/* =========================================================
   BATTLE: classic turn-based encounters
   ========================================================= */
const ENEMIES={
  lizard:{name:'ضبّ شوكي',hp:24,atk:9,def:5,agi:5,xp:14,drop:['dates',.25],move:['ذيل شائك',.25,1.3]},
  bat:{name:'خفاش الليل',hp:20,atk:8,def:3,agi:14,xp:13,evade:.12,fly:true,move:['امتصاص',.3,.9]},
  wolf:{name:'ذئب الوادي',hp:38,atk:11,def:7,agi:11,xp:26,drop:['dates',.3],move:['عضّة شرسة',.25,1.45]},
  wisp:{name:'يراعة الوهج',hp:28,atk:6,mag:13,def:6,agi:9,xp:22,drop:['rosewater',.35],fly:true,move:['وهج',.55,1]},
  guardian:{name:'حارس النور',hp:270,atk:13,mag:15,def:8,agi:10,xp:300,boss:true,move:['',0,1]},
};
const ABILITIES=[
  {id:'falcon',type:'skill',name:'ضربة الصقر',mp:3,lv:1,target:'one',icon:'sword',desc:'ضربة خاطفة بالعصا، أقوى من الهجوم العادي وأكثر إصابة للمقتل.'},
  {id:'palm',type:'skill',name:'صمود النخلة',mp:4,lv:2,target:'self',icon:'shield',desc:'ترفع دفاعك نصف قيمته لثلاث جولات.'},
  {id:'sweep',type:'skill',name:'ضربة دوّارة',mp:6,lv:5,target:'all',icon:'bolt',desc:'تضرب كل الأعداء دفعة واحدة.'},
  {id:'spark',type:'magic',name:'شرارة',mp:4,lv:1,target:'one',icon:'flame',desc:'لهب صغير تقويه الحكمة.'},
  {id:'breeze',type:'magic',name:'نسمة شافية',mp:5,lv:3,target:'self',icon:'leaf',desc:'نسمة من الفلج تعيد جزءًا من صحتك.'},
  {id:'sandstorm',type:'magic',name:'عاصفة رملية',mp:9,lv:4,target:'all',icon:'wind',desc:'رمال الوادي تضرب كل الأعداء.'},
];
const SPECIAL={id:'wadi',name:'ضربة عين الوادي',icon:'gem',desc:'حين يمتلئ شريط العزيمة، تضرب كل الأعداء ضربة هائلة.'};
const ABILITY_TEASER={name:'؟؟؟',desc:'مهارة خاصة تظهر لاحقًا في رحلتك.'};
const abilityOpen=a=>levelOf(P.xp)>=a.lv;
const battleEl=$('battle'),bMsg=$('bMsg'),bCmds=$('bCmds'),bParty=$('bParty'),bUi=$('bUi');
let B=null;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function enemyGroup(){
  if(scene.area)return areaGroup();
  const y=hero.y,pick=a=>a[(Math.random()*a.length)|0];
  if(scene.fort)return y>560?pick([['soldier'],['spider'],['soldier','scorpion'],['spider','spider'],['soldier','spider']]):pick([['soldier','soldier'],['spider','soldier','spider'],['soldier','spider'],['soldier','soldier','spider']]);
  if(scene.wadi){if(isNight()&&Math.random()<.35)return pick([['bat','viper'],['bat','bat','scorpion']]);return hero.x<560?pick([['scorpion'],['viper'],['lizard','scorpion'],['viper','lizard']]):pick([['scorpion','viper'],['scorpion','scorpion'],['viper','viper'],['scorpion','viper','lizard']]);}
  if(isNight()&&Math.random()<.4)return pick([['bat','wisp'],['wisp','wisp'],['bat','bat','wisp']]);
  if(y>820)return pick([['lizard'],['bat'],['lizard','bat'],['bat','bat'],['lizard']]);
  if(y>480)return pick([['wolf'],['lizard','lizard'],['wisp'],['bat','wisp'],['lizard','bat']]);
  return pick([['wolf','wisp'],['wolf','bat'],['wisp','wisp'],['wolf'],['lizard','wolf']]);
}
function stageDims(){
  const port=view.h>view.w*1.15,SW=port?330:440,panel=bUi.offsetHeight||130,H=Math.max(160,view.h-panel+14),top=port?70:44;
  const sc=Math.min(view.w/SW,(H-top)/172);
  return {SW,sc,ox:(view.w-SW*sc)/2,oy:top+((H-top)-172*sc)/2-104*sc,H};
}
/* ---- party: Nasser and (after she joins) Aisha ---- */
const ALLY={name:'عائشة',look:LOOKS.aisha,base:{hp:56,mp:30,atk:6,def:4,agi:8,wis:8,luk:3},grow:{hp:10,mp:6,atk:.8,def:.8,agi:1,wis:1.6,luk:.3}};
function allyStat(k){const l=levelOf(P.xp)-1;return Math.floor(ALLY.base[k]+ALLY.grow[k]*l);}
const allyHP=()=>Math.min(P.ally&&P.ally.hp!=null?P.ally.hp:allyStat('hp'),allyStat('hp'));
const allyMP=()=>Math.min(P.ally&&P.ally.mp!=null?P.ally.mp:allyStat('mp'),allyStat('mp'));
const ALLY_SPELLS=[
  {id:'dew',name:'لمسة الندى',mp:4,lv:1,target:'ally',icon:'leaf',desc:'تعيد جزءًا كبيرًا من صحة أحد أفراد الفريق.'},
  {id:'weave',name:'خيوط السدو',mp:6,lv:1,target:'party',icon:'scarf',desc:'ترفع دفاع الفريق كله ثلاث جولات.'},
  {id:'revive',name:'نفَس الحياة',mp:10,lv:4,target:'fallen',icon:'heart',desc:'تعيد من سقط في المعركة بجزء من صحته.'},
  {id:'mend',name:'نسمة الجماعة',mp:9,lv:6,target:'party',icon:'flame',desc:'تعيد صحة الفريق كله دفعة واحدة.'},
];
const NAMES={hero:'ناصر',aisha:'عائشة'};
const members=()=>P.flags.aisha?['hero','aisha']:['hero'];
const mHP=id=>id==='hero'?curHP():allyHP();
const mMP=id=>id==='hero'?curMP():allyMP();
const mStat=(id,k)=>id==='hero'?stat(k):allyStat(k);
const alive=id=>mHP(id)>0;
function setHP(id,v){v=clamp(Math.round(v),0,mStat(id,'hp'));if(id==='hero')P.hp=v;else P.ally.hp=v;}
function setMP(id,v){v=clamp(Math.round(v),0,mStat(id,'mp'));if(id==='hero')P.mp=v;else P.ally.mp=v;}
const mPos=id=>id==='hero'?{x:B.hx,y:B.hy}:{x:B.ax,y:B.ay};
const mDef=id=>mStat(id,'def')*(id==='hero'&&B.palm>0?1.5:1)*(B.weave>0?1.35:1);
const eTop=e=>e.d.boss?e.y-140:e.y-50,eMid=e=>e.d.boss?e.y-72:e.y-24;
function anim(id,kind){B.m[id].act=kind;B.m[id].actT=time;}

function makeEnemy(type,suffix){const d=ENEMIES[type];return {type,d,name:d.name+(suffix?' '+suffix:''),hp:d.hp,max:d.hp,alive:true,ph:Math.random()*TAU,hitT:-9,actT:-9,dieT:null,veil:0,turn:0};}
function layoutEnemies(){
  const {SW}=stageDims(),bx=SW*.3,boss=B.enemies.find(e=>e.d.boss);
  if(boss){boss.x=SW*.22;boss.y=244;const ms=[[SW*.44,192],[SW*.47,254],[SW*.38,222]];B.enemies.filter(e=>!e.d.boss).forEach((e,i)=>{const q=ms[i%3];e.x=q[0];e.y=q[1];});}
  else{const live=B.enemies,slots=live.length===1?[[bx,214]]:live.length===2?[[bx-34,196],[bx+30,234]]:[[bx-48,186],[bx+28,206],[bx-22,244]];live.forEach((e,i)=>{e.x=slots[i][0];e.y=slots[i][1];});}
  const duo=!!P.flags.aisha;B.hx=duo?SW-66:SW-88;B.hy=duo?204:222;B.ax=SW-114;B.ay=250;
}
function startEncounter(opts){
  if(state!=='play')return;
  opts=opts||{};
  state='fade';resetInput();hideToast();
  const types=opts.types||enemyGroup(),count={},seen={};
  types.forEach(t=>count[t]=(count[t]||0)+1);
  const enemies=types.map(t=>{seen[t]=(seen[t]||0)+1;return makeEnemy(t,count[t]>1?'أبجد'[seen[t]-1]:'');});
  SFX.play(opts.boss?'bossIntro':'encounter');
  startTransition(!!opts.boss,()=>{
    B={enemies,bossType:opts.boss?types[0]:null,st:{hero:{poison:0,sleep:0},aisha:{poison:0,sleep:0}},money:0,pop:[],fx:[],m:{hero:{act:null,actT:-9,hitT:-9,guard:false},aisha:{act:null,actT:-9,hitT:-9,guard:false}},palm:0,weave:0,
       busy:true,mode:'main',actor:'hero',cmds:{},pending:null,ended:false,xp:0,drops:[],bg:null,result:null,boss:!!opts.boss,arena:opts.arena||null,round:0};
    layoutEnemies();
    gameEl.classList.add('battling');battleEl.hidden=false;state='battle';
    renderParty();bCmds.innerHTML='';
    fadeEl.classList.remove('on');
    (async()=>{
      if(B.bossType==='golem'){await say('تهتز الجدران، وتتجمع حجارة الحصن في هيئة عملاق عظيم!',1800);await say('لا مفرّ من هذه المعركة.',1100);}
      else if(B.bossType==='serpent'){await say('تنهض حيّة العين من الماء، وجسدها يلتف حول الصخور!',1800);await say('لا مفرّ من هذه المعركة.',1100);}
      else if(B.boss&&ENEMIES[B.bossType].intro){for(const l of ENEMIES[B.bossType].intro)await say(l,1700);await say('لا مفرّ من هذه المعركة.',1100);}
      else if(B.boss){await say('ينهض حارس النور من الحجر، وجناحاه يملآن الفسحة ضوءًا!',1800);await say('لا مفرّ من هذه المعركة.',1100);}
      else await say(enemies.length===1?`ظهر ${enemies[0].name}!`:'ظهرت مجموعة من الأعداء!',1100);
      if(!P.flags.tut1){P.flags.tut1=1;B.tutor=true;
        await say('نصيحة: «هجوم» ضربة عادية، أما «مهارات» و«سحر» فتستهلك الطاقة الزرقاء.',3200);
        await say('«دفاع» يقلل الضرر إلى النصف ويعيد قليلًا من الطاقة. و«هروب» يخرجك من المعركة.',3200);}
      if(P.flags.aisha&&!P.flags.tut3){P.flags.tut3=1;await say('تختار أمر ناصر ثم أمر عائشة، ثم تبدأ الجولة.',2600);}
      startTurn();
    })();
  });
}
async function say(text,ms=900){bMsg.textContent=text;bMsg.classList.add('show');await wait(OPT.bspeed==='fast'&&ms<2000?ms*.55:ms);}
function popup(x,y,txt,col){B.pop.push({x,y,txt,col,t0:time});}
function fx(kind,x,y,extra){B.fx.push(Object.assign({kind,x,y,t0:time},extra||{}));}
const aliveEnemies=()=>B.enemies.filter(e=>e.alive);
function renderParty(){
  const lvl=AR(levelOf(P.xp)),gauge=P.gauge||0;
  const bar=(cls,lab,v,m)=>`<div class="bar ${cls}"><span>${lab}<em>${AR(Math.max(0,v))} / ${AR(m)}</em></span><i><b style="width:${Math.max(0,v)/m*100}%"></b></i></div>`;
  bParty.innerHTML=members().map(id=>{const hp=mHP(id),on=B&&!B.busy&&!B.ended&&B.actor===id;
    return `<div class="pm${on?' on':''}${hp<=0?' ko':''}"><div class="nm">${NAMES[id]} <small>${hp<=0?'ساقط':B&&B.st[id].sleep>0?'نائم':B&&B.st[id].poison>0?'مسموم':'المستوى '+lvl}</small></div>${bar('hp','الصحة',hp,mStat(id,'hp'))}${bar('mp','الطاقة',mMP(id),mStat(id,'mp'))}</div>`;}).join('')+
    `<div class="bar lb"><span>العزيمة<em>${AR(Math.floor(gauge))}٪</em></span><i><b style="width:${gauge}%"></b></i></div>`+
    `<div class="buffs">${B&&B.palm>0?`<span>صمود النخلة: ${AR(B.palm)} جولات</span>`:''}${B&&B.weave>0?`<span>خيوط السدو: ${AR(B.weave)} جولات</span>`:''}</div>`;
}
function showCmds(mode){
  if(!B)return;B.mode=mode;
  if(!B.busy)bMsg.classList.remove('show');
  const who=B.actor||'hero',mp=mMP(who),busy=B.busy,ms=members().filter(canAct),first=ms[0]===who;
  const cap=ms.length>1&&mode!=='end'?`<div class="cap">دور ${NAMES[who]}${mode==='main'?'':' · طاقتها '+AR(mp)}</div>`.replace('طاقتها',who==='hero'?'طاقته':'طاقتها'):'';
  let html='';
  if(mode==='main'){
    const items=battleItems().length>0;
    if(who==='hero'){
      const full=(P.gauge||0)>=100,sk=ABILITIES.filter(a=>a.type==='skill'&&abilityOpen(a)).length,mg=ABILITIES.filter(a=>a.type==='magic'&&abilityOpen(a)).length;
      html=`<button type="button" data-c="attack">هجوم</button><button type="button" data-c="skills"${sk?'':' disabled'}>مهارات</button><button type="button" data-c="magic"${mg?'':' disabled'}>سحر</button><button type="button" data-c="defend">دفاع</button>
        <button type="button" data-c="items"${items?'':' disabled'}>أغراض</button><button type="button" data-c="flee"${B.boss||B.arena||!first?' disabled':''}>هروب</button>
        <button type="button" class="special" data-c="special"${full?'':' disabled'} style="grid-column:span 2">خاصة<small>${full?SPECIAL.name:'العزيمة '+AR(Math.floor(P.gauge||0))+'٪'}</small></button>`;
    }else{
      html=`<button type="button" data-c="attack">هجوم</button><button type="button" data-c="spells">سحر</button><button type="button" data-c="defend">دفاع</button><button type="button" data-c="items"${items?'':' disabled'}>أغراض</button>`+
        (first?'':`<button type="button" class="back wide" data-c="prev">رجوع إلى ناصر</button>`);
    }
  }else if(mode==='skills'||mode==='magic'){
    const list=ABILITIES.filter(a=>a.type===(mode==='skills'?'skill':'magic')&&abilityOpen(a));
    html=list.map(a=>`<button type="button" data-ab="${a.id}"${mp<a.mp?' disabled':''}>${a.name}<small>${AR(a.mp)} طاقة</small></button>`).join('')+`<button type="button" class="back wide" data-c="back">رجوع</button>`;
  }else if(mode==='spells'){
    const fallen=members().some(id=>!alive(id));
    html=ALLY_SPELLS.filter(s=>levelOf(P.xp)>=s.lv).map(s=>`<button type="button" data-sp="${s.id}"${mp<s.mp||s.target==='fallen'&&!fallen?' disabled':''}>${s.name}<small>${AR(s.mp)} طاقة</small></button>`).join('')+`<button type="button" class="back wide" data-c="back">رجوع</button>`;
  }else if(mode==='items'){
    const fallen=members().some(id=>!alive(id));
    html=battleItems().map(id=>`<button type="button" data-it="${id}"${ITEMS[id].use==='revive'&&!fallen?' disabled':''}>${ITEMS[id].name}<small>×${AR(P.inv[id])}</small></button>`).join('')+`<button type="button" class="back wide" data-c="back">رجوع</button>`;
  }else if(mode==='target'){
    html=`<div class="cap">اختر الهدف، أو المسه في الساحة</div>`+B.enemies.map((e,i)=>e.alive?`<button type="button" data-tg="${i}">${e.name}</button>`:'').join('')+`<button type="button" class="back wide" data-c="back">رجوع</button>`;
  }else if(mode==='ally'){
    const want=B.pending.sp.target;
    html=`<div class="cap">على من؟</div>`+members().filter(id=>want==='fallen'?!alive(id):alive(id)).map(id=>`<button type="button" data-al="${id}">${NAMES[id]}<small>${AR(Math.max(0,mHP(id)))} / ${AR(mStat(id,'hp'))}</small></button>`).join('')+`<button type="button" class="back wide" data-c="back">رجوع</button>`;
  }else if(mode==='end'){
    html=`<button type="button" class="wide" data-c="continue" style="grid-column:1/-1;min-height:52px">متابعة</button>`;
  }
  bCmds.className='b-box b-cmds'+(mode==='main'||mode==='end'?'':' list');
  bCmds.innerHTML=(mode==='target'||mode==='ally'||mode==='end'?'':cap)+html;
  if(busy)bCmds.querySelectorAll('button').forEach(b=>b.disabled=true);
  if(lastInputKeyboard){const f=bCmds.querySelector('button:not(:disabled)');if(f)f.focus({preventScroll:true});}
  renderParty();
}
const canAct=id=>alive(id)&&!(B.st[id].sleep>0);
function startTurn(){if(!B||B.ended)return;B.busy=false;B.cmds={};B.pending=null;B.actor=members().find(canAct);if(!B.actor){runRound();return;}showCmds('main');}
function commit(cmd){
  B.cmds[B.actor]=cmd;B.pending=null;
  const ms=members().filter(canAct),i=ms.indexOf(B.actor);
  if(cmd.kind!=='flee'&&i<ms.length-1){B.actor=ms[i+1];showCmds('main');}else runRound();
}
bCmds.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b||!B||state!=='battle')return;
  if(B.busy&&B.mode!=='end')return;
  const d=b.dataset;
  if(d.c==='back'){SFX.play('cancel');B.pending=null;showCmds('main');return;}
  if(d.c==='prev'){SFX.play('cancel');const ms=members().filter(canAct);B.actor=ms[Math.max(0,ms.indexOf(B.actor)-1)];delete B.cmds[B.actor];showCmds('main');return;}
  SFX.play('tap');
  if(d.c==='continue'){endBattle();return;}
  if(d.c==='attack'){B.pending={kind:'attack'};chooseTarget();return;}
  if(d.c==='skills'||d.c==='magic'||d.c==='items'||d.c==='spells'){showCmds(d.c);return;}
  if(d.c==='defend'){commit({kind:'defend'});return;}
  if(d.c==='flee'){commit({kind:'flee'});return;}
  if(d.c==='special'){commit({kind:'special'});return;}
  if(d.ab){const a=ABILITIES.find(q=>q.id===d.ab);B.pending={kind:'ability',a};if(a.target==='one')chooseTarget();else commit(B.pending);return;}
  if(d.sp){const s=ALLY_SPELLS.find(q=>q.id===d.sp);B.pending={kind:'spell',sp:s};if(s.target==='party')commit(B.pending);else{const opts=members().filter(id=>s.target==='fallen'?!alive(id):alive(id));if(opts.length===1){B.pending.ally=opts[0];commit(B.pending);}else showCmds('ally');}return;}
  if(d.al){B.pending.ally=d.al;commit(B.pending);return;}
  if(d.it){commit({kind:'item',id:d.it});return;}
  if(d.tg!=null){B.pending.target=+d.tg;commit(B.pending);}
});
function chooseTarget(){const live=aliveEnemies();if(live.length===1){B.pending.target=B.enemies.indexOf(live[0]);commit(B.pending);}else showCmds('target');}
canvas.addEventListener('pointerdown',e=>{
  if(state!=='battle'||!B||B.mode!=='target'||B.busy)return;
  const r=canvas.getBoundingClientRect(),{sc,ox,oy}=stageDims(),x=(e.clientX-r.left-ox)/sc,y=(e.clientY-r.top-oy)/sc;
  let best=-1,bd=60;B.enemies.forEach((en,i)=>{if(!en.alive)return;const dd=Math.hypot(x-en.x,y-eMid(en))*(en.d.boss?.6:1);if(dd<bd){bd=dd;best=i;}});
  if(best>=0){SFX.play('tap');B.pending.target=best;commit(B.pending);}
});
function rollDmg(base){return Math.max(1,Math.round(base*(.9+Math.random()*.2)));}
async function runRound(){
  if(!B||B.busy)return;
  B.busy=true;showCmds('main');B.round++;
  const cm=B.cmds;
  members().forEach(id=>{B.m[id].guard=!!cm[id]&&cm[id].kind==='defend';});
  const order=[];
  members().forEach(id=>{if(alive(id)&&(cm[id]||B.st[id].sleep>0))order.push({id,agi:mStat(id,'agi')+Math.random()*4+(cm[id]&&['flee','defend'].includes(cm[id].kind)?99:0)});});
  aliveEnemies().forEach(e=>order.push({e,agi:e.d.agi+Math.random()*4}));
  order.sort((a,b)=>b.agi-a.agi);
  for(const o of order){
    if(B.ended)break;
    if(o.id){if(alive(o.id)){if(B.st[o.id].sleep>0){B.st[o.id].sleep--;await say(`${NAMES[o.id]} ${o.id==='hero'?'نائم':'نائمة'}…`,700);}else if(cm[o.id])await memberAction(o.id,cm[o.id]);}}
    else if(o.e.alive)await enemyAction(o.e);
    renderParty();
    if(await checkEnd())return;
  }
  if(!B||B.ended)return;
  for(const id of members()){if(!alive(id)||!(B.st[id].poison>0))continue;const dmg=Math.max(1,Math.round(mStat(id,'hp')*.06));setHP(id,Math.max(1,mHP(id)-dmg));B.st[id].poison--;const pp=mPos(id);popup(pp.x,pp.y-80,AR(dmg),'#b5e07b');renderParty();await say(`السمّ يؤلم ${NAMES[id]} — ${AR(dmg)} ضررًا.`,700);}
  members().forEach(id=>B.m[id].guard=false);if(B.palm>0)B.palm--;if(B.weave>0)B.weave--;
  if(B.tutor&&!P.flags.tut2){P.flags.tut2=1;await say('شريط العزيمة يمتلئ كلما ضربت أو تلقيت ضربة. حين يكتمل يُفتح زر «خاصة».',3400);
    if(aliveEnemies().length>1)await say('حين يكون أمامك أكثر من عدو، المس العدو نفسه في الساحة لتختاره.',3000);}
  startTurn();
}
function retarget(i){const e=B.enemies[i];if(e&&e.alive)return e;return aliveEnemies()[0];}
async function strike(id,e,mult,label,critBonus=0){
  const hitChance=.95-Math.max(0,(e.d.agi-mStat(id,'agi'))*.015)-(e.d.evade||0);
  anim(id,'lunge');SFX.play('swing');await wait(220);
  const who=label||`${NAMES[id]} ${id==='hero'?'يهاجم':'تهاجم'}`;
  if(Math.random()>hitChance){SFX.play('miss');popup(e.x,eTop(e),'خطأ','#e9dcc5');await say(`${who}… لكن الضربة أخطأت ${e.name}.`,700);return;}
  const crit=Math.random()<.05+mStat(id,'luk')*.006+critBonus;
  const dmg=rollDmg((mStat(id,'atk')*2-eDef(e))*mult*(crit?1.6:1)*(e.veil>0?.5:1)*elemMult(e,'phys'));
  e.hp-=dmg;e.hitT=time;SFX.play(crit?'crit':'hit');fx('slash',e.x,eMid(e),{big:crit});popup(e.x,eTop(e),AR(dmg),crit?'#ffd36b':'#ffffff');
  if(crit){shake(7,.32);buzz(35);await hitStop(95);}else{shake(2.5,.14);await hitStop(55);}
  if(id==='hero')P.gauge=Math.min(100,(P.gauge||0)+6);
  await say(`${crit?'ضربة قاضية! ':''}${who} — ${e.name} يتلقى ${AR(dmg)} ضررًا.`,820);
  await killCheck(e);
}
async function magicHit(e,base,kind){
  const dmg=rollDmg((base-eDef(e)*.3)*(e.veil>0?.5:1)*elemMult(e,kind));shake(3,.2);e.hp-=dmg;e.hitT=time;fx(kind,e.x,eMid(e));popup(e.x,eTop(e),AR(dmg),'#ffb36b');
  P.gauge=Math.min(100,(P.gauge||0)+4);return dmg;
}
async function killCheck(e){
  if(e.hp>0||!e.alive)return;
  e.alive=false;e.dieT=time;B.xp+=e.d.xp;SFX.play(e.d.boss?'special':'poof');
  if(e.d.drop&&Math.random()<e.d.drop[1])B.drops.push(e.d.drop[0]);
  if(e.d.mat&&Math.random()<e.d.mat[1]+stat('luk')*.005)B.drops.push(e.d.mat[0]);
  B.money+=e.d.gold||0;P.kills[e.type]=(P.kills[e.type]||0)+1;
  if(!e.d.boss)fx('burst',e.x,eMid(e));
  if(e.d.boss){fx('flash',0,0);B.focus={x:e.x,y:eMid(e),t0:time};shake(14,.9);buzz([60,40,140]);await say(e.type==='golem'?'يتهاوى العملاق كومة من الطوب والغبار…':e.type==='serpent'?'تغوص الحيّة في الماء ولا تعود…':'ينطفئ وهج الحارس ويتلاشى في الهواء…',1400);for(const m of aliveEnemies()){m.alive=false;m.dieT=time;}}
  else await say(`هُزم ${e.name}.`,650);
}
function healPop(id,amt,col){const p=mPos(id);popup(p.x,p.y-(id==='hero'?86:72),'+'+AR(amt),col||'#7be08a');fx('heal',p.x,p.y-24);}
function battleItems(){return Object.keys(ITEMS).filter(id=>ITEMS[id].use&&(P.inv[id]||0)>0);}
async function useItem(user,id){
  const it=ITEMS[id];if(!(P.inv[id]>0)){await say(`لم يبقَ ${it.name}.`,800);return;}
  if(it.use==='cure'){const ms=members().filter(alive);const t=ms.find(m=>B.st[m].poison>0||B.st[m].sleep>0)||ms.sort((a,b)=>mHP(a)/mStat(a,'hp')-mHP(b)/mStat(b,'hp'))[0];
    P.inv[id]--;anim(user,'cast');SFX.play('potion');B.st[t].poison=0;B.st[t].sleep=0;const b=mHP(t);setHP(t,b+it.amount);healPop(t,mHP(t)-b);await say(`${NAMES[user]} ${user==='hero'?'يعطي':'تعطي'} ${t===user?'نفسه':NAMES[t]} عسل السدر، فيزول السمّ والنعاس.`.replace('نفسه',user==='hero'?'نفسه':'نفسها'),950);return;}
  if(it.use==='revive'){const t=members().find(m=>!alive(m));if(!t){await say(`${NAMES[user]} ${user==='hero'?'يحتفظ':'تحتفظ'} بالقهوة لوقت الحاجة.`,800);return;}
    P.inv[id]--;anim(user,'cast');SFX.play('heal');setHP(t,mStat(t,'hp')*.5);healPop(t,mHP(t));await say(`قهوة بالهيل توقظ ${NAMES[t]}!`,900);return;}
  const ms=members().filter(alive),key=it.use==='hp'?(m=>mHP(m)/mStat(m,'hp')):(m=>mMP(m)/mStat(m,'mp'));
  const tgt=ms.sort((a,b)=>key(a)-key(b))[0];
  P.inv[id]--;anim(user,'cast');SFX.play('potion');
  if(it.use==='hp'){const b=mHP(tgt);setHP(tgt,b+it.amount);healPop(tgt,mHP(tgt)-b);}
  else{const b=mMP(tgt);setMP(tgt,b+it.amount);healPop(tgt,mMP(tgt)-b,'#7bc4ff');}
  await say(`${NAMES[user]} ${user==='hero'?'يستخدم':'تستخدم'} ${it.name}${tgt!==user?' على '+NAMES[tgt]:''}.`,850);
}
async function memberAction(id,cmd){
  if(cmd.kind==='item')return useItem(id,cmd.id);
  if(cmd.kind==='defend'){SFX.play('shield');const p=mPos(id);fx('guard',p.x,p.y-24);setMP(id,mMP(id)+2);if(id==='hero')P.gauge=Math.min(100,(P.gauge||0)+5);await say(`${NAMES[id]} ${id==='hero'?'يتخذ':'تتخذ'} وضع الدفاع.`,700);return;}
  if(id==='aisha')return allyAction(cmd);
  return heroAction(cmd);
}
async function heroAction(cmd){
  if(cmd.kind==='attack'){await strike('hero',retarget(cmd.target),1);return;}
  if(cmd.kind==='flee'){
    const avg=aliveEnemies().reduce((s,e)=>s+e.d.agi,0)/Math.max(1,aliveEnemies().length);
    const ch=clamp(.55+(stat('agi')-avg)*.03,.25,.95);
    if(Math.random()<ch){SFX.play('flee');await say('نجحتم في الهرب!',800);B.ended=true;B.result='flee';await wait(200);endBattle();}
    else{SFX.play('error');await say('لم تستطع الهرب!',800);}
    return;
  }
  if(cmd.kind==='special'){
    P.gauge=0;anim('hero','cast');SFX.play('special');fx('flash',0,0);shake(12,.65);buzz([40,30,80]);await say(`${SPECIAL.name}!`,600);
    for(const e of aliveEnemies()){const dmg=rollDmg((stat('atk')*3+stat('wis')-eDef(e)*.5)*(e.veil>0?.6:1));e.hp-=dmg;e.hitT=time;fx('slash',e.x,eMid(e),{big:true});popup(e.x,eTop(e),AR(dmg),'#ffd36b');}
    await wait(700);for(const e of B.enemies)await killCheck(e);return;
  }
  const a=cmd.a;if(curMP()<a.mp){await say('طاقة ناصر لا تكفي.',700);return;}
  setMP('hero',curMP()-a.mp);renderParty();
  if(a.id==='falcon'){await strike('hero',retarget(cmd.target),1.7,'ضربة الصقر',.15);return;}
  if(a.id==='palm'){SFX.play('buff');B.palm=3;fx('palm',B.hx,B.hy);await say('صمود النخلة: ارتفع دفاع ناصر ثلاث جولات.',900);return;}
  if(a.gen)return genAbility('hero',a,cmd);
  if(a.id==='sweep'){anim('hero','lunge');SFX.play('swing');await wait(220);SFX.play('hit');for(const e of aliveEnemies()){const dmg=rollDmg((stat('atk')*2-eDef(e))*.85*(e.veil>0?.5:1)*elemMult(e,'phys'));e.hp-=dmg;e.hitT=time;fx('slash',e.x,eMid(e));popup(e.x,eTop(e),AR(dmg),'#fff');}await say('ضربة دوّارة تصيب الجميع!',850);for(const e of B.enemies)await killCheck(e);return;}
  anim('hero','cast');
  if(a.id==='spark'){const e=retarget(cmd.target);fx('fireball',B.hx-20,B.hy-40,{tx:e.x,ty:eMid(e)});SFX.play('swing');await wait(380);SFX.play('fire');const dmg=await magicHit(e,stat('wis')*2.4+8,'fire');await say(`شرارة تحرق ${e.name} — ${AR(dmg)} ضررًا.`,820);await killCheck(e);return;}
  if(a.id==='breeze'){SFX.play('heal');const b=curHP();setHP('hero',b+stat('wis')*3+14);healPop('hero',curHP()-b);await say('نسمة شافية تعيد إلى ناصر بعض صحته.',850);return;}
  if(a.id==='flurry'){const e=retarget(cmd.target);for(let i=0;i<3&&e&&e.alive;i++)await strike('hero',e,.62,i===0?'ضربات الخنجر':'ضربة أخرى',.05);return;}
  if(a.id==='meteor'){SFX.play('fire');fx('flash',0,0);await wait(300);for(const e of aliveEnemies())await magicHit(e,stat('wis')*2.1+12,'fire');SFX.play('special');await say('شهاب الوادي يسقط على الأعداء!',900);for(const e of B.enemies)await killCheck(e);return;}
  if(a.id==='sandstorm'){SFX.play('sand');fx('sand',0,0);await wait(300);for(const e of aliveEnemies())await magicHit(e,stat('wis')*1.7+7,'sand');await say('عاصفة رملية تضرب الأعداء!',850);for(const e of B.enemies)await killCheck(e);}
}
async function allyAction(cmd){
  if(cmd.kind==='attack'){await strike('aisha',retarget(cmd.target),1,'عائشة تضرب بمغزلها');return;}
  const s=cmd.sp;if(allyMP()<s.mp){await say('طاقة عائشة لا تكفي.',700);return;}
  setMP('aisha',allyMP()-s.mp);anim('aisha','cast');renderParty();
  const w=allyStat('wis');
  if(s.gen)return genAbility('aisha',s,cmd);
  if(s.id==='dew'){const t=cmd.ally&&alive(cmd.ally)?cmd.ally:'aisha';SFX.play('heal');B.st[t].poison=0;B.st[t].sleep=0;const b=mHP(t);setHP(t,b+w*2.6+14);healPop(t,mHP(t)-b);await say(`لمسة الندى تعيد إلى ${NAMES[t]} ${AR(mHP(t)-b)} من الصحة.`,900);return;}
  if(s.id==='weave'){SFX.play('buff');B.weave=3;fx('palm',B.hx,B.hy);fx('palm',B.ax,B.ay);await say('خيوط السدو تلتف حول الفريق، فيرتفع دفاعه ثلاث جولات.',1000);return;}
  if(s.id==='revive'){const t=cmd.ally;if(!t||alive(t)){await say('لا أحد يحتاج إلى نفَس الحياة الآن.',800);setMP('aisha',allyMP()+s.mp);return;}SFX.play('heal');setHP(t,mStat(t,'hp')*.4);healPop(t,mHP(t));await say(`نفَس الحياة يعيد ${NAMES[t]} إلى المعركة!`,1000);return;}
  if(s.id==='mend'){SFX.play('heal');for(const id of members().filter(alive)){const b=mHP(id);setHP(id,b+w*1.8+10);healPop(id,mHP(id)-b);}await say('نسمة الجماعة تعيد إلى الفريق صحته.',950);}
}
function pickTarget(){const ms=members().filter(alive);if(ms.length<2)return ms[0];return Math.random()<.55?'hero':'aisha';}
function hurt(id,dmg){SFX.play('hurt');shake(dmg>=mStat(id,'hp')*.18?6:3,.24);buzz(dmg>=mStat(id,'hp')*.18?45:20);if(B.st[id].sleep>0){B.st[id].sleep=0;}setHP(id,mHP(id)-dmg);B.m[id].hitT=time;const p=mPos(id);popup(p.x,p.y-(id==='hero'?86:72),AR(dmg),'#ff8a7a');if(id==='hero')P.gauge=Math.min(100,(P.gauge||0)+dmg*.8);renderParty();}
async function fallenCheck(id){if(!alive(id))await say(`${id==='hero'?'سقط ناصر!':'سقطت عائشة!'}`,900);}
async function enemyAction(e){
  if(e.d.art&&e.d.boss)return genBossAction(e);
  if(e.type==='serpent')return serpentAction(e);
  if(e.type==='golem')return golemAction(e);
  if(e.d.boss)return bossAction(e);
  const [mvName,mvChance,mvMult]=e.d.move,special=Math.random()<mvChance,tgt=pickTarget();if(!tgt)return;
  e.actT=time;SFX.play({wolf:special?'growl':'swing',bat:special?'screech':'swing',lizard:special?'hiss':'swing',wisp:special?'eMagic':'swing',scorpion:special?'hiss':'swing',viper:special?'hiss':'swing',spider:special?'bite':'swing',soldier:'swing'}[e.type]||e.d.sfx&&special&&e.d.sfx||'swing');await wait(260);
  if(e.type==='wolf'&&special)SFX.play('bite');
  const tp=mPos(tgt);
  if((e.type==='viper'||e.d.ai==='sleep')&&special){
    fx('orb',e.x+10,e.y-30,{tx:tp.x,ty:tp.y-30});await wait(380);
    if(Math.random()<.75-mStat(tgt,'wis')*.01){B.st[tgt].sleep=2;popup(tp.x,tp.y-90,'نعاس','#c9b8ff');await say(`${e.name} تنفث النعاس على ${NAMES[tgt]}، ${tgt==='hero'?'فيغفو':'فتغفو'}!`,1000);}
    else await say(`${e.name} تنفث النعاس، لكن ${NAMES[tgt]} ${tgt==='hero'?'يقاومه':'تقاومه'}.`,850);
    return;
  }
  if((e.type==='wisp'||e.d.ai==='magic')&&special){
    fx('orb',e.x+10,e.y-30,{tx:tp.x,ty:tp.y-30});await wait(380);
    let dmg=rollDmg(e.d.mag*1.4-mStat(tgt,'wis')*.4);if(B.m[tgt].guard)dmg=Math.ceil(dmg/2);
    hurt(tgt,dmg);await say(`${e.name} يطلق ${mvName} على ${NAMES[tgt]} — ${AR(dmg)} ضررًا.`,850);await fallenCheck(tgt);return;
  }
  const evade=clamp(.04+(mStat(tgt,'agi')-e.d.agi)*.008,.03,.15);
  if(Math.random()<evade){SFX.play('miss');popup(tp.x,tp.y-80,'تفادٍ','#e9dcc5');await say(`${NAMES[tgt]} ${tgt==='hero'?'يتفادى':'تتفادى'} هجمة ${e.name}.`,700);return;}
  let dmg=rollDmg((e.d.atk*1.8-mDef(tgt))*(special?mvMult:1));if(B.m[tgt].guard)dmg=Math.max(1,Math.ceil(dmg/2));
  hurt(tgt,dmg);
  if((e.type==='scorpion'||e.type==='spider'||e.d.ai==='poison')&&special&&alive(tgt)){B.st[tgt].poison=4;popup(tp.x,tp.y-100,'سمّ','#b5e07b');}
  if((e.type==='bat'||e.d.ai==='drain')&&special){const h=Math.min(e.max-e.hp,Math.ceil(dmg*.6));e.hp+=h;popup(e.x,e.y-56,'+'+AR(h),'#7be08a');}
  await say(`${e.name}${special?' يستخدم '+mvName:' يهاجم'} ${NAMES[tgt]} — ${AR(dmg)} ضررًا.`,850);
  await fallenCheck(tgt);
}
async function serpentAction(e){
  e.turn++;
  if(!e.enraged&&e.hp<e.max*.5){e.enraged=true;fx('flash',0,0);SFX.play('bossRoar');await say('تغضب الحيّة، ويغلي الماء حولها!',1300);}
  const pw=e.enraged?1.2:1;e.actT=time;
  const ms=members().filter(alive);if(!ms.length)return;
  const r=Math.random();
  if(r<(e.enraged?.36:.26)){
    SFX.play('water');fx('wave',0,0);shake(5,.45);await wait(320);
    for(const id of ms){let dmg=rollDmg((e.d.mag*1.1-mStat(id,'wis')*.4)*pw);if(B.m[id].guard)dmg=Math.ceil(dmg/2);hurt(id,dmg);}
    await say('سيل العين يجرف الفريق كله!',950);for(const id of ms)await fallenCheck(id);return;
  }
  const tgt=pickTarget(),tp=mPos(tgt);
  if(e.turn%4===2&&!(B.st[tgt].sleep>0)){
    SFX.play('hiss');fx('orb',e.x+30,e.y-110,{tx:tp.x,ty:tp.y-30});await wait(380);
    if(Math.random()<.7-mStat(tgt,'wis')*.01){B.st[tgt].sleep=2;popup(tp.x,tp.y-90,'نعاس','#c9b8ff');await say(`ضباب العين يغشى ${NAMES[tgt]}، ${tgt==='hero'?'فيغفو':'فتغفو'}!`,1000);}
    else await say(`يمرّ ضباب العين، لكن ${NAMES[tgt]} ${tgt==='hero'?'يقاومه':'تقاومه'}.`,850);
    return;
  }
  const coil=r>.78;SFX.play(coil?'growl':'bite');await wait(260);
  let dmg=rollDmg((e.d.atk*1.8-mDef(tgt))*(coil?1.45:1.15)*pw);if(B.m[tgt].guard)dmg=Math.max(1,Math.ceil(dmg/2));
  hurt(tgt,dmg);
  if(!coil&&alive(tgt)&&Math.random()<.45){B.st[tgt].poison=4;popup(tp.x,tp.y-100,'سمّ','#b5e07b');}
  await say(coil?`الحيّة تلتف حول ${NAMES[tgt]} — ${AR(dmg)} ضررًا.`:`الحيّة تعضّ ${NAMES[tgt]} بأنياب سامة — ${AR(dmg)} ضررًا.`,900);
  await fallenCheck(tgt);
}
async function bossAction(e){
  e.turn++;if(e.veil>0)e.veil--;
  if(!e.enraged&&e.hp<e.max*.5){e.enraged=true;fx('flash',0,0);SFX.play('bossRoar');await say('يشتد وهج الحارس، وتتوهج عيناه بلون النار!',1300);}
  const pw=e.enraged?1.2:1,minions=aliveEnemies().filter(x=>x!==e).length;
  e.actT=time;
  if(minions===0&&e.turn>2&&e.turn%4===2){
    B.enemies=B.enemies.filter(x=>x.alive||x.d.boss);
    const n=e.enraged?2:1;for(let i=0;i<n;i++)B.enemies.push(makeEnemy('wisp',n>1?'أب'[i]:''));
    layoutEnemies();B.enemies.filter(x=>!x.d.boss).forEach(x=>fx('summon',x.x,x.y-40));SFX.play('mystic');
    await say(n>1?'حارس النور يستدعي يراعتين من الضوء!':'حارس النور يستدعي يراعة من الضوء!',1100);return;
  }
  if(!e.veil&&e.turn>1&&Math.random()<.18){e.veil=2;SFX.play('shield');await say('حارس النور يحيط نفسه بستار من الضوء، فتضعف ضرباتكم.',1200);return;}
  if(Math.random()<(e.enraged?.45:.3)){
    SFX.play('eMagic');fx('glare',e.x,e.y-80);shake(4,.35);await wait(380);
    const was=members().filter(alive);
    for(const id of was){let dmg=rollDmg((e.d.mag*1.15-mStat(id,'wis')*.45)*pw);if(B.m[id].guard)dmg=Math.ceil(dmg/2);hurt(id,dmg);}
    await say('وهج عظيم يضرب الفريق كله!',950);
    for(const id of was)await fallenCheck(id);
    return;
  }
  const tgt=pickTarget();if(!tgt)return;const tp=mPos(tgt);
  SFX.play('swing');fx('feather',e.x+30,e.y-90,{tx:tp.x,ty:tp.y-30});await wait(360);
  let dmg=rollDmg((e.d.atk*1.8-mDef(tgt))*1.1*pw);if(B.m[tgt].guard)dmg=Math.max(1,Math.ceil(dmg/2));
  hurt(tgt,dmg);await say(`حارس النور يرمي ريشة مضيئة على ${NAMES[tgt]} — ${AR(dmg)} ضررًا.`,900);await fallenCheck(tgt);
}
async function checkEnd(){
  if(B.ended)return true;
  if(members().every(id=>!alive(id))){
    members().forEach(id=>setHP(id,0));B.ended=true;B.result='lose';renderParty();
    SFX.play('defeat');await say(P.flags.aisha?'سقط الفريق كله…':'خارت قوى ناصر…',1200);
    bMsg.textContent='سقطتم في المعركة. اضغط «متابعة» للعودة إلى القرية.';bMsg.classList.add('show');
    B.busy=false;showCmds('end');bMsg.classList.add('show');return true;
  }
  if(aliveEnemies().length===0){
    B.ended=true;B.result='win';members().forEach(id=>{anim(id,'win');if(!alive(id))setHP(id,1);});
    const before=levelOf(P.xp);P.xp+=B.xp;const after=levelOf(P.xp);
    B.drops.forEach(id=>{P.inv[id]=(P.inv[id]||0)+1;});
    SFX.play('victory');await say(B.boss?(ENEMIES[B.bossType].art?`انتصرتم على ${ENEMIES[B.bossType].name}!`:B.bossType==='golem'?'انتصرتم على عملاق الحصن!':B.bossType==='serpent'?'انتصرتم على حيّة العين!':'انتصرتم على حارس النور!'):'انتصرت!',900);
    P.money+=B.money;
    let msg=`حصلت على ${AR(B.xp)} خبرة و${baisa(B.money)}.`;
    if(B.drops.length)msg+=' وجدت: '+B.drops.map(id=>ITEMS[id].name).join('، ')+'.';
    if(B.boss&&B.bossType==='golem'){P.flags.boss3=1;['crown','shard3'].forEach(id=>P.inv[id]=(P.inv[id]||0)+1);P.inv.honey=(P.inv.honey||0)+2;msg+=' وعلى المنصة وجدتم الشظية الثالثة وتاج الحصن.';$('menuDot').hidden=false;}
    else if(B.boss&&B.bossType==='serpent'){P.flags.boss2=1;['silverblade','shard2'].forEach(id=>P.inv[id]=(P.inv[id]||0)+1);P.inv.honey=(P.inv.honey||0)+2;msg+=' وفي قاع العين وجدتم خنجر الفضة والشظية الثانية.';$('menuDot').hidden=false;}
    else if(B.boss&&ENEMIES[B.bossType].onWin){msg+=ENEMIES[B.bossType].onWin();$('menuDot').hidden=false;}
    else if(B.boss){P.flags.boss=1;['lightstaff','shard'].forEach(id=>P.inv[id]=(P.inv[id]||0)+1);P.inv.dates=(P.inv.dates||0)+2;msg+=' وفي مكان الحارس وجدت عصا النور وشظية نجمة.';$('menuDot').hidden=false;}
    if(after>before){
      P.hp=null;P.mp=null;P.ally={hp:null,mp:null};SFX.play('levelUp',{d:1.6});
      const learned=ABILITIES.filter(a=>a.lv>before&&a.lv<=after).map(a=>a.name).concat(SKILLS.filter(s=>s.lv&&s.lv>before&&s.lv<=after).map(s=>s.name)).concat(P.flags.aisha?ALLY_SPELLS.filter(s=>s.lv>before&&s.lv<=after).map(s=>s.name+' (عائشة)'):[]);
      msg+=` ارتفع المستوى إلى ${AR(after)}!`+(learned.length?' تعلّمتم: '+learned.join('، ')+'.':'');
      $('menuDot').hidden=false;
    }
    renderParty();
    bMsg.textContent=msg;bMsg.classList.add('show');
    B.busy=false;showCmds('end');bMsg.classList.add('show');return true;
  }
  return false;
}
function endBattle(){
  if(!B)return;
  const result=B.result,boss=B.boss,bossType=B.bossType,arena=B.arena;
  B.busy=true;bCmds.querySelectorAll('button').forEach(b=>b.disabled=true);
  fadeEl.classList.add('on');
  setTimeout(()=>{
    battleEl.hidden=true;bMsg.classList.remove('show');gameEl.classList.remove('battling');B=null;resetMeter();
    if(arena){arenaAfter(result);saveGame();return;}
    if(result==='lose'&&scene.area){areaLose(boss);saveGame();return;}
    if(result==='lose'){
      P.hp=null;P.mp=null;P.ally={hp:null,mp:null};P.gauge=0;
      scene=SCENES.village;ensureScene(scene);hero.x=576;hero.y=530;hero.dir='up';snapCamera();resetTrail();
      state='play';talkCooldown=.4;fadeEl.classList.remove('on');
      notify(boss?'وجدكم سالم عند طرف الغابة<small>الحارس قوي. ارفع مستواك واشرب من النافورة، ثم عُد إليه</small>':'وجدك سالم عند طرف الغابة وأعادك إلى القرية<small>عادت إليكم صحتكم كاملة</small>',3.8);
    }else{state='play';talkCooldown=.3;fadeEl.classList.remove('on');if(result==='win'&&boss)setTimeout(ENEMIES[bossType].after?ENEMIES[bossType].after:bossType==='golem'?()=>notify('اجتمعت الشظايا الثلاث!<small>خذاها إلى حجر النور في قلب الغابة</small>',4.2):bossType==='serpent'?openChapter3:openChapter2,500);}
    saveGame();
  },320);
}
function battleBackdrop(){
  const w=canvas.width,h=canvas.height;
  if(B.bg&&B.bg.width===w&&B.bg.height===h)return B.bg;
  const cv=document.createElement('canvas');cv.width=w;cv.height=h;const g=cv.getContext('2d');
  const {sc,oy}=stageDims(),d=view.dpr,hz=(oy+150*sc)*d,R=mulberry(31),W2=scene.wadi||scene.fort,nt=nightAmount();
  const C=scene.area&&BIOMES[scene.biome].bt?BIOMES[scene.biome].bt:W2?{s0:'#6b3f2a',s1:'#d39a62',r0:'#7a4a32',r1:'#a8694a',g0:'#d8bf8e',g1:'#b8956a',grass:'rgba(120,90,55,.5)'}:{s0:'#16261a',s1:'#2e4a2c',r0:'#1b2c1b',r1:'#24391f',g0:'#4f6e37',g1:'#2c421e',grass:'rgba(30,50,20,.6)'};
  const sky=g.createLinearGradient(0,0,0,hz);sky.addColorStop(0,C.s0);sky.addColorStop(1,C.s1);g.fillStyle=sky;g.fillRect(0,0,w,hz+2);
  g.fillStyle='rgba(255,226,150,.08)';for(let i=0;i<4;i++){const x=w*(.15+i*.22);poly(g,[x,0,x+w*.06,0,x+w*.16,hz,x+w*.08,hz]);}
  const row=(base,hgt,col,step)=>{g.fillStyle=col;for(let x=-step;x<w+step;x+=step*(.7+R()*.6)){const th=hgt*(.7+R()*.6);poly(g,[x-step*.6,base,x,base-th,x+step*.6,base]);}g.fillRect(0,base,w,h-base);};
  row(hz-10*d,120*d*sc,C.r0,(W2?70:38)*d*sc);row(hz+4*d,80*d*sc,C.r1,(W2?56:30)*d*sc);
  const gr=g.createLinearGradient(0,hz,0,h);gr.addColorStop(0,C.g0);gr.addColorStop(1,C.g1);g.fillStyle=gr;g.fillRect(0,hz,w,h-hz);
  {const {ox:sx,SW}=stageDims();g.fillStyle='rgba(140,115,75,.45)';ell(g,(sx+SW*.5*sc)*d,(oy+216*sc)*d,SW*.48*sc*d,46*sc*d);g.fill();}
  g.strokeStyle=C.grass;g.lineWidth=d;g.beginPath();for(let i=0;i<(W2?160:500);i++){const x=R()*w,y=hz+R()*(h-hz);g.moveTo(x,y);g.lineTo(x-1.5*d,y-4*d);g.moveTo(x,y);g.lineTo(x+1.5*d,y-4*d);}g.stroke();
  const vg=g.createRadialGradient(w/2,h*.55,Math.min(w,h)*.3,w/2,h*.55,Math.hypot(w,h)*.62);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.45)');g.fillStyle=vg;g.fillRect(0,0,w,h);
  if(nt>.3){g.fillStyle=`rgba(10,16,44,${nt*.45})`;g.fillRect(0,0,w,h);g.fillStyle='rgba(255,250,220,.8)';for(let i=0;i<30;i++)g.fillRect(R()*w,R()*hz*.8,1.4*d,1.4*d);}
  B.bg=cv;return cv;
}
/* enemy art (stage units, anchor at feet, facing right toward the hero) */
function drawEnemy(g,e,t){
  const age=e.dieT!=null?(time-e.dieT):0;if(e.dieT!=null&&age>.6)return;
  const hit=time-e.hitT<.35,act=time-e.actT<.5,kb=hit?Math.max(0,1-(time-e.hitT)/.25)*(e.d.boss?4:9):0;
  g.save();g.translate(e.x+(act?Math.sin(Math.min(1,(time-e.actT)/.5)*Math.PI)*22:0)+(hit?Math.sin((time-e.hitT)*60)*3:0)-kb,e.y);
  if(e.dieT!=null){g.globalAlpha=1-age/.6;g.translate(0,age*20);}
  else if(hit&&Math.floor((time-e.hitT)*20)%2)g.globalAlpha=.45;
  g.fillStyle='rgba(0,0,0,.3)';ell(g,0,0,e.d.boss?50:e.d.fly?14:26,e.d.boss?9:5);g.fill();
  if(e.d.art)drawMonster(g,t+e.ph,e);else if(e.type==='serpent')drawSerpent(g,t,e);else if(e.type==='golem')drawGolem(g,t,e);else if(e.d.boss)drawGuardian(g,t,e);else ({lizard:drawLizard,bat:drawBat,wolf:drawWolf,wisp:drawWisp,scorpion:drawScorpion,viper:drawViper,soldier:drawSoldier,spider:drawSpider})[e.type](g,t+e.ph);
  if(e.dieT==null&&time-e.hitT<.1){g.globalCompositeOperation='lighter';g.fillStyle='rgba(255,250,235,.4)';ell(g,0,e.d.boss?-80:-22,e.d.boss?62:24,e.d.boss?72:20);g.fill();g.globalCompositeOperation='source-over';}
  g.restore();
}
function drawLizard(g,t){
  const b=Math.sin(t*3)*1;
  g.strokeStyle='#9a7442';g.lineWidth=6;g.lineCap='round';g.beginPath();g.moveTo(-16,-8+b);g.quadraticCurveTo(-38,-4,-36,-18);g.stroke();
  g.fillStyle='#6b4f2c';[[-12,-2],[12,-2],[-6,0],[16,0]].forEach(p=>{ell(g,p[0],p[1],4,2.4);g.fill();});
  g.fillStyle='#b88a50';ell(g,0,-10+b,21,9);g.fill();g.fillStyle='#d9b27a';ell(g,2,-6+b,15,4);g.fill();
  g.fillStyle='#7d5a2f';for(let x=-16;x<=12;x+=5)poly(g,[x-2.4,-17+b,x,-24+b+Math.abs(x)*.12,x+2.4,-17+b]);
  g.fillStyle='#b88a50';ell(g,24,-13+b,11,7);g.fill();
  g.fillStyle='#fff6d8';circ(g,27,-16+b,2.4);g.fillStyle='#1c120a';circ(g,27.8,-16+b,1.2);
  g.strokeStyle='#5a3e1e';g.lineWidth=1;g.beginPath();g.moveTo(26,-10+b);g.lineTo(34,-11+b);g.stroke();
  if(Math.sin(t*1.3)>.85){g.strokeStyle='#d8443a';g.lineWidth=1.2;g.beginPath();g.moveTo(34,-12+b);g.lineTo(40,-12+b);g.lineTo(42,-10+b);g.moveTo(40,-12+b);g.lineTo(42,-14+b);g.stroke();}
}
function drawBat(g,t){
  const y=-44+Math.sin(t*4)*4,w=Math.sin(t*14);
  g.fillStyle='#5d3c6e';
  const wing=s=>{g.beginPath();g.moveTo(6*s,y-2);g.quadraticCurveTo(22*s,y-18+w*8,34*s,y-10+w*12);g.quadraticCurveTo(28*s,y-2+w*6,26*s,y+4+w*4);g.quadraticCurveTo(20*s,y,16*s,y+6+w*3);g.quadraticCurveTo(12*s,y+2,6*s,y+6);g.closePath();g.fill();};
  wing(1);wing(-1);
  g.fillStyle='#4a2f5a';ell(g,0,y,9,11);g.fill();poly(g,[-6,y-8,-4,y-17,-1,y-9]);poly(g,[6,y-8,4,y-17,1,y-9]);
  g.fillStyle='#ffd04a';circ(g,-3,y-3,2);circ(g,4,y-3,2);g.fillStyle='#1c120a';circ(g,-2.6,y-3,.9);circ(g,4.4,y-3,.9);
  g.fillStyle='#fff';poly(g,[0,y+3,1.5,y+3,.8,y+6]);
}
function drawWolf(g,t){
  const br=Math.sin(t*2.4)*.8;
  g.fillStyle='#5e5752';[[-18,0],[-10,0],[14,0],[22,0]].forEach(p=>g.fillRect(p[0]-2.4,-16,4.8,16));
  g.strokeStyle='#7d746d';g.lineWidth=7;g.lineCap='round';g.beginPath();g.moveTo(-24,-28);g.quadraticCurveTo(-40,-34,-38,-48);g.stroke();
  g.fillStyle='#8a817a';ell(g,0,-26+br*.3,28,13+br);g.fill();
  g.fillStyle='#6d655f';ell(g,-4,-33,22,6);g.fill();g.fillStyle='#b8b0a6';ell(g,16,-20,10,6);g.fill();
  g.fillStyle='#8a817a';ell(g,30,-38,12,9);g.fill();poly(g,[36,-42,50,-36,48,-32,36,-31]);
  g.fillStyle='#6d655f';poly(g,[22,-44,25,-56,30,-45]);poly(g,[29,-45,33,-55,36,-44]);
  g.fillStyle='#1c120a';circ(g,49,-35,1.8);
  g.fillStyle='#ffcc33';ell(g,34,-41,2.2,1.6);g.fill();g.fillStyle='#1c120a';g.fillRect(33.6,-42.4,.8,2.8);
  g.fillStyle='#fff';poly(g,[40,-31.5,41.5,-31.5,40.8,-29]);poly(g,[44,-32,45.4,-32,44.8,-29.6]);
}
function drawWisp(g,t){
  const y=-40+Math.sin(t*2.6)*5,p=.7+.3*Math.sin(t*9);
  const gr=g.createRadialGradient(0,y,0,0,y,26);gr.addColorStop(0,`rgba(255,250,200,${.9*p})`);gr.addColorStop(.4,`rgba(220,240,120,${.45*p})`);gr.addColorStop(1,'rgba(160,220,90,0)');
  g.fillStyle=gr;g.fillRect(-26,y-26,52,52);
  g.fillStyle='rgba(230,255,220,.55)';ell(g,-7,y-6,7,3.5);g.fill();ell(g,7,y-6,7,3.5);g.fill();
  g.fillStyle='#fffbe0';circ(g,0,y,6);g.fillStyle='#4a3a10';circ(g,-2,y-1,1);circ(g,2.4,y-1,1);
  for(let i=0;i<4;i++){const k=(t*.8+i/4)%1;g.fillStyle=`rgba(255,240,150,${1-k})`;circ(g,-6-k*16,y+Math.sin(t*3+i)*4+k*6,1.3);}
}
function drawGuardian(g,t,e){
  const y=-74+Math.sin(t*1.6)*4,fl=Math.sin(t*2.2),hot=e.enraged;
  const gr=g.createRadialGradient(0,y,4,0,y,92);gr.addColorStop(0,hot?'rgba(255,190,120,.55)':'rgba(255,236,170,.5)');gr.addColorStop(1,'rgba(255,230,150,0)');
  g.fillStyle=gr;g.fillRect(-92,y-92,184,184);
  const wing=s=>{
    const wg=g.createLinearGradient(0,y-40,s*80,y+30);wg.addColorStop(0,hot?'#ffe2b0':'#fff6d6');wg.addColorStop(1,hot?'rgba(255,160,80,.55)':'rgba(255,214,120,.5)');
    g.fillStyle=wg;g.beginPath();g.moveTo(s*12,y-14);g.quadraticCurveTo(s*48,y-58+fl*8,s*84,y-34+fl*12);
    for(let k=0;k<5;k++){const px=s*(84-k*15),py=y-30+fl*12+k*11;g.quadraticCurveTo(px-s*4,py+14,px-s*14,py+8);}
    g.quadraticCurveTo(s*22,y+26,s*12,y+16);g.closePath();g.fill();
    g.strokeStyle='rgba(255,255,255,.55)';g.lineWidth=1.2;g.beginPath();for(let k=0;k<4;k++){g.moveTo(s*16,y-6+k*6);g.quadraticCurveTo(s*44,y-24+k*10+fl*6,s*(70-k*10),y-24+k*14+fl*10);}g.stroke();
  };
  wing(-1);wing(1);
  const bg=g.createRadialGradient(0,y-6,4,0,y,36);bg.addColorStop(0,'#fffbea');bg.addColorStop(1,hot?'#ffc27a':'#f1d48a');
  g.fillStyle=bg;ell(g,0,y+2,24,34);g.fill();
  g.strokeStyle='rgba(180,130,40,.45)';g.lineWidth=1.2;g.beginPath();for(let k=0;k<4;k++){g.moveTo(-12+k*2,y-4+k*8);g.lineTo(0,y+2+k*8);g.lineTo(12-k*2,y-4+k*8);}g.stroke();
  g.fillStyle='#fff3cf';circ(g,0,y-36,19);
  g.fillStyle=hot?'#ffc27a':'#f1d48a';poly(g,[-16,y-46,-10,y-64,-5,y-48]);poly(g,[16,y-46,10,y-64,5,y-48]);
  g.fillStyle='#fffdf4';ell(g,-7,y-36,8,8);g.fill();ell(g,7,y-36,8,8);g.fill();
  const eg=hot?'#ff6a2a':'#ffb000';g.fillStyle=eg;circ(g,-7,y-36,5.4);circ(g,7,y-36,5.4);
  g.fillStyle='#2a1500';circ(g,-7,y-36,2.4);circ(g,7,y-36,2.4);g.fillStyle='#fff';circ(g,-6,y-37.5,1);circ(g,8,y-37.5,1);
  g.fillStyle='#d99a2b';poly(g,[-3,y-28,3,y-28,0,y-21]);
  g.strokeStyle='#d99a2b';g.lineWidth=2;g.lineCap='round';g.beginPath();[-8,-3,3,8].forEach(x=>{g.moveTo(x,y+34);g.lineTo(x+(x<0?-2:2),y+40);});g.stroke();
  if(e.veil>0){g.strokeStyle=`rgba(255,240,190,${.45+.25*Math.sin(t*6)})`;g.lineWidth=2.4;ell(g,0,y-6,72,82);g.stroke();g.strokeStyle='rgba(255,240,190,.2)';g.lineWidth=8;ell(g,0,y-6,72,82);g.stroke();}
  for(let i=0;i<6;i++){const k=(t*.3+i/6)%1;g.fillStyle=`rgba(255,240,180,${.8*(1-k)})`;circ(g,Math.sin(t+i*2.3)*(40+k*20),y+30-k*90,1.6);}
}
function drawMember(g,id,t){
  const m=B.m[id],p=mPos(id),ha=time-m.actT,hh=time-m.hitT,ko=mHP(id)<=0;
  let dx=0,dy=0;
  if(m.act==='lunge'&&ha<.5)dx=-Math.sin(ha/.5*Math.PI)*46;
  if(m.act==='cast'&&ha<.6)dy=-Math.sin(ha/.6*Math.PI)*8;
  if(m.act==='win')dy=-Math.abs(Math.sin(ha*6+(id==='aisha'?1:0)))*8*Math.max(0,1-ha/2.5);
  if(hh<.35)dx+=Math.sin(hh*70)*3;
  if(id==='hero'&&B.palm>0||B.weave>0){g.strokeStyle=`rgba(120,220,140,${.5+.2*Math.sin(t*4)})`;g.lineWidth=2;ell(g,p.x,p.y,20,6);g.stroke();}
  g.save();g.translate(p.x+dx,p.y+dy);
  if(ko){g.globalAlpha=.55;g.translate(0,4);g.rotate(-.25);}
  else if(hh<.35&&Math.floor(hh*20)%2)g.globalAlpha=.45;
  g.scale(1.75,1.75);
  const lunging=m.act==='lunge'&&ha<.5;
  if(id==='hero')drawHero(g,0,0,'left',lunging?ha*20:0,lunging,t,false);
  else drawPerson(g,0,0,'left',LOOKS.aisha,t,lunging,lunging?ha*20:0);
  g.restore();
  if(m.guard){g.fillStyle='rgba(120,180,255,.22)';g.strokeStyle='rgba(170,210,255,.8)';g.lineWidth=1.6;ell(g,p.x-20,p.y-30,10,30);g.fill();g.stroke();}
  if(B&&!B.busy&&!B.ended&&B.actor===id&&members().length>1){g.fillStyle='#ffd88a';const by=p.y-(id==='hero'?82:70)+Math.sin(t*6)*2;poly(g,[p.x-5,by-6,p.x+5,by-6,p.x,by]);}
}
function renderBattle(){
  const g=ctx,d=view.dpr,t=animTime(),{sc,ox,oy,SW}=stageDims(),so=shakeOffset();
  g.setTransform(1,0,0,1,0,0);g.drawImage(battleBackdrop(),-10*d+so[0]*d*.6,-10*d+so[1]*d*.6,canvas.width+20*d,canvas.height+20*d);
  let z=1,fx0=0,fy0=0;if(B.focus){const q=(time-B.focus.t0)/1.7;if(q<1){z=1+.38*Math.sin(Math.min(1,q*1.6)*Math.PI/2)*(q<.7?1:1-(q-.7)/.3);fx0=B.focus.x;fy0=B.focus.y;}}
  g.setTransform(d*sc*z,0,0,d*sc*z,d*(ox+so[0])+d*sc*fx0*(1-z),d*(oy+so[1])+d*sc*fy0*(1-z));
  const items=B.enemies.map(e=>({y:e.y,f:()=>drawEnemy(g,e,t)}));
  members().forEach(id=>{const p=mPos(id);items.push({y:p.y,f:()=>drawMember(g,id,t)});});
  items.sort((a,b)=>a.y-b.y).forEach(o=>o.f());
  B.fx=B.fx.filter(f=>time-f.t0<1.2);
  for(const f of B.fx){
    const k=(time-f.t0);
    if(f.kind==='slash'&&k<.3){g.strokeStyle=`rgba(255,250,230,${1-k/.3})`;g.lineWidth=f.big?4:2.6;g.beginPath();g.moveTo(f.x-16,f.y-16);g.lineTo(f.x+16,f.y+16);if(f.big){g.moveTo(f.x+16,f.y-16);g.lineTo(f.x-16,f.y+16);}g.stroke();}
    if(f.kind==='fire'&&k<.6)for(let i=0;i<10;i++){const a=i/10*TAU,r=k*40;g.fillStyle=`rgba(255,${140+i*8},60,${1-k/.6})`;circ(g,f.x+Math.cos(a)*r,f.y+Math.sin(a)*r*.7,4*(1-k/.6)+1);}
    if(f.kind==='fireball'&&k<.4){const q=k/.4;g.fillStyle='#ffb347';circ(g,f.x+(f.tx-f.x)*q,f.y+(f.ty-f.y)*q-Math.sin(q*Math.PI)*20,5);g.fillStyle='rgba(255,220,120,.5)';circ(g,f.x+(f.tx-f.x)*q,f.y+(f.ty-f.y)*q-Math.sin(q*Math.PI)*20,9);}
    if((f.kind==='orb'||f.kind==='feather')&&k<.4){const q=k/.4,x=f.x+(f.tx-f.x)*q,y=f.y+(f.ty-f.y)*q;
      if(f.kind==='orb'){g.fillStyle='rgba(240,255,170,.9)';circ(g,x,y,5);g.fillStyle='rgba(200,255,140,.35)';circ(g,x,y,11);}
      else{g.save();g.translate(x,y);g.rotate(Math.atan2(f.ty-f.y,f.tx-f.x));g.fillStyle='#fff6d6';ell(g,0,0,12,3.4);g.fill();g.strokeStyle='#e8c46a';g.lineWidth=1;g.beginPath();g.moveTo(-12,0);g.lineTo(12,0);g.stroke();g.restore();}}
    if(f.kind==='heal'&&k<.9)for(let i=0;i<8;i++){g.fillStyle=`rgba(150,255,170,${1-k/.9})`;circ(g,f.x+Math.sin(i*2.1)*14,f.y+10-k*50-i*3,2);}
    if(f.kind==='guard'&&k<.5){g.strokeStyle=`rgba(170,210,255,${1-k/.5})`;g.lineWidth=2;ell(g,f.x,f.y,14+k*30,20+k*30);g.stroke();}
    if(f.kind==='palm'&&k<.8){g.strokeStyle=`rgba(120,220,140,${1-k/.8})`;g.lineWidth=3;ell(g,f.x,f.y,10+k*40,3+k*12);g.stroke();}
    if(f.kind==='summon'&&k<.8){g.strokeStyle=`rgba(255,240,170,${1-k/.8})`;g.lineWidth=2;circ2(g,f.x,f.y,6+k*30);}
    if(f.kind==='glare'&&k<1){
      g.save();g.globalAlpha=Math.max(0,.55*(1-k));g.fillStyle='#fff1c0';
      for(let i=0;i<9;i++){const a=-.55+i*.14;g.beginPath();g.moveTo(f.x,f.y);g.lineTo(f.x+Math.cos(a)*SW,f.y+Math.sin(a)*SW);g.lineTo(f.x+Math.cos(a+.05)*SW,f.y+Math.sin(a+.05)*SW);g.closePath();g.fill();}
      g.restore();
    }
    if(f.kind==='burst'&&k<.6){for(let i=0;i<12;i++){const ang=i/12*TAU+f.x,r=8+k*48;g.fillStyle=`rgba(255,230,180,${1-k/.6})`;circ(g,f.x+Math.cos(ang)*r,f.y+Math.sin(ang)*r*.6,2.6*(1-k/.6)+.6);}}
    if(f.kind==='wave'&&k<.9){g.strokeStyle=`rgba(140,210,240,${.85*(1-k/.9)})`;g.lineWidth=3;for(let i=0;i<5;i++){const xx=60+k*SW*.8-i*18,yy=180+i*14;g.beginPath();g.arc(xx,yy,22,-1.2,1.2);g.stroke();}}
    if(f.kind==='frost'&&k<1){for(let i=0;i<26;i++){const xx=((i*53+k*260)%(SW*.8))+20,yy=120+(i*29)%130+k*30;g.fillStyle=`rgba(225,245,255,${.85*(1-k)})`;circ(g,xx,yy,1.6+(i%3));}g.strokeStyle=`rgba(190,230,255,${.7*(1-k)})`;g.lineWidth=2;for(let i=0;i<8;i++){const xx=40+i*45-k*60;g.beginPath();g.moveTo(xx,150);g.lineTo(xx-30,190);g.stroke();}}
    if(f.kind==='sand'&&k<.9){g.strokeStyle=`rgba(230,200,140,${.8*(1-k/.9)})`;g.lineWidth=2;g.beginPath();for(let i=0;i<14;i++){const yy=150+i*8,xx=(SW*.6)-k*SW*.7-(i%3)*20;g.moveTo(xx,yy);g.lineTo(xx-40,yy+4);}g.stroke();
      for(let i=0;i<20;i++){g.fillStyle=`rgba(220,190,130,${.7*(1-k)})`;circ(g,(i*37+k*-300)%300+60,170+(i*13)%80,1.5);}}
  }
  B.pop=B.pop.filter(p=>time-p.t0<1);
  g.textAlign='center';g.textBaseline='middle';
  for(const p of B.pop){const k=time-p.t0,big=p.col==='#ffd36b',sz=(big?20:15)*(k<.12?1.75-k/.12*.75:1);g.globalAlpha=Math.min(1,(1-k)*2);g.font=`800 ${sz}px system-ui,-apple-system,"SF Arabic",sans-serif`;g.lineWidth=3;g.strokeStyle='rgba(30,15,5,.85)';g.strokeText(p.txt,p.x,p.y-k*22);g.fillStyle=p.col;g.fillText(p.txt,p.x,p.y-k*22);}
  g.globalAlpha=1;
  drawBossAura(g);drawWeatherScreen(g,true);
  const fl=B.fx.find(q=>q.kind==='flash'&&time-q.t0<.4);
  if(fl){g.setTransform(1,0,0,1,0,0);g.fillStyle=`rgba(255,240,200,${.8*(1-(time-fl.t0)/.4)})`;g.fillRect(0,0,canvas.width,canvas.height);}
}
function circ2(g,x,y,r){g.beginPath();g.arc(x,y,r,0,TAU);g.stroke();}

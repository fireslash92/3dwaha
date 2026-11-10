// وحوش المناطق الجديدة: مصنع يبني الوحش من مستواه ودوره، ورسومات قابلة للتلوين، وذكاء عام للزعماء، ومهارات المستويات العالية
'use strict';

/* =========================================================
   MONSTER FACTORY: stats grow with the monster's level
   ========================================================= */
const ROLES={
  brute:{hp:1.2,atk:1.1,mag:.7,def:1,agi:.8},
  swift:{hp:.85,atk:1,mag:.7,def:.8,agi:1.4,evade:.1},
  caster:{hp:.85,atk:.7,mag:1.2,def:.8,agi:1},
  tank:{hp:1.45,atk:.95,mag:.6,def:1.35,agi:.7},
  boss:{hp:9,atk:1.15,mag:1.15,def:1.1,agi:.9},
};
function makeMonster(id,o){
  const L=o.lv,R=ROLES[o.boss?'boss':o.role||'brute'];
  ENEMIES[id]=Object.assign({
    name:o.name,lv:L,art:o.art,pal:o.pal,opt:o.opt||{},
    hp:Math.round((16+6*L)*R.hp*(o.hpK||1)),atk:Math.round((3+1.45*L)*R.atk),mag:Math.round((4+1.15*L)*R.mag),def:Math.round((1+1.15*L)*R.def),agi:Math.round((5+.45*L)*R.agi),
    xp:Math.round((.55*Math.pow(L,1.78)+8)*3*(o.boss?12:1)),gold:Math.round((4+1.6*L)*(o.boss?20:1)),
    evade:R.evade||0,fly:!!o.fly,boss:!!o.boss,weak:o.weak,resist:o.resist,ai:o.ai||'phys',move:o.move||['هجمة قوية',.25,1.35],drop:o.drop,status:o.ai==='poison'?'poison':o.ai==='sleep'?'sleep':undefined,
    sfx:o.sfx,intro:o.intro,onWin:o.onWin,after:o.after,moves:o.moves,
  },o.extra||{});
  if(!BEAST_ORDER.includes(id))BEAST_ORDER.push(id);
  return ENEMIES[id];
}

/* =========================================================
   ART: a handful of body plans, recoloured per region
   (stage units, feet at 0, facing right toward the party)
   ========================================================= */
function drawMonster(g,t,e){
  const d=e.d,P2=d.pal,o=d.opt,s=o.scale||1;
  g.save();g.scale(s,s);
  MONSTER_ART[d.art](g,t,P2,o,e);
  g.restore();
}
const MONSTER_ART={};
function artBeast(g,t,p,o){
  const br=Math.sin(t*2.4)*.8,run=Math.sin(t*5)*1.5;
  g.fillStyle=p.dark;[[-18,0],[-10,0],[14,0],[22,0]].forEach((q,i)=>g.fillRect(q[0]-2.4,-16+(i%2?run*.3:0),4.8,16));
  g.strokeStyle=p.body;g.lineWidth=o.thickTail?9:6;g.lineCap='round';g.beginPath();g.moveTo(-24,-28);g.quadraticCurveTo(-40,-34+Math.sin(t*3)*3,-38,o.longTail?-58:-46);g.stroke();
  g.fillStyle=p.body;ell(g,0,-26+br*.3,28,13+br);g.fill();
  if(o.spots){g.fillStyle=p.spot;for(let i=0;i<9;i++){const sx=-20+i*5,sy=-30+((i*7)%10);circ(g,sx,sy,1.8+((i*3)%2));}}
  if(o.mane){g.fillStyle=p.mane;ell(g,14,-34,14,12);g.fill();}
  g.fillStyle=p.dark;ell(g,-4,-33,22,6);g.fill();g.fillStyle=p.belly;ell(g,16,-20,10,6);g.fill();
  g.fillStyle=p.body;ell(g,30,-38,12,9);g.fill();poly(g,[36,-42,50,-36,48,-32,36,-31]);
  if(o.horns==='curl'){g.strokeStyle=p.horn;g.lineWidth=3.4;g.beginPath();g.moveTo(26,-46);g.quadraticCurveTo(14,-64,4,-52);g.quadraticCurveTo(8,-44,14,-50);g.stroke();}
  else if(o.horns==='spike'){g.fillStyle=p.horn;poly(g,[26,-45,22,-62,30,-46]);poly(g,[32,-45,34,-60,36,-44]);}
  else{g.fillStyle=p.dark;poly(g,[22,-44,25,-56,30,-45]);poly(g,[29,-45,33,-55,36,-44]);}
  g.fillStyle='#1c120a';circ(g,49,-35,1.8);
  g.fillStyle=p.eye;ell(g,34,-41,2.2,1.6);g.fill();g.fillStyle='#1c120a';g.fillRect(33.6,-42.4,.8,2.8);
  g.fillStyle='#fff';poly(g,[40,-31.5,41.5,-31.5,40.8,-29]);poly(g,[44,-32,45.4,-32,44.8,-29.6]);
  if(o.frost){g.fillStyle='rgba(230,245,255,.75)';for(let i=0;i<6;i++)poly(g,[-20+i*8,-38,-17+i*8,-46-(i%2)*3,-14+i*8,-38]);}
}
function artFlyer(g,t,p,o){
  const y=-46+Math.sin(t*3.4)*5,w=Math.sin(t*12);
  g.fillStyle=p.wing;
  const wing=s=>{g.beginPath();g.moveTo(4*s,y-4);g.quadraticCurveTo(20*s,y-24+w*10,36*s,y-14+w*14);g.quadraticCurveTo(26*s,y-2+w*6,22*s,y+6+w*4);g.quadraticCurveTo(14*s,y+2,4*s,y+6);g.closePath();g.fill();};
  wing(1);wing(-1);
  g.fillStyle=p.body;ell(g,0,y,11,14);g.fill();g.fillStyle=p.belly;ell(g,1,y+4,7,8);g.fill();
  if(o.owl){g.fillStyle=p.body;poly(g,[-8,y-10,-6,y-20,-2,y-12]);poly(g,[8,y-10,6,y-20,2,y-12]);g.fillStyle='#fff';circ(g,-4,y-5,4);circ(g,5,y-5,4);g.fillStyle=p.eye;circ(g,-3.4,y-5,2.4);circ(g,5.6,y-5,2.4);g.fillStyle='#1c120a';circ(g,-3,y-5,1.1);circ(g,6,y-5,1.1);}
  else{g.fillStyle=p.eye;circ(g,4,y-6,2.2);g.fillStyle='#1c120a';circ(g,4.6,y-6,1);}
  g.fillStyle=p.beak||'#e9a23a';poly(g,[7,y-2,14,y,7,y+2.5]);
  g.fillStyle=p.dark;poly(g,[-4,y+12,-10,y+20,0,y+14]);poly(g,[4,y+12,8,y+21,1,y+14]);
}
function artSpirit(g,t,p){
  const y=-42+Math.sin(t*2.6)*5,pu=.7+.3*Math.sin(t*9);
  const gr=g.createRadialGradient(0,y,0,0,y,30);gr.addColorStop(0,`rgba(${p.core},${.95*pu})`);gr.addColorStop(.45,`rgba(${p.glow},${.5*pu})`);gr.addColorStop(1,`rgba(${p.glow},0)`);
  g.fillStyle=gr;g.fillRect(-30,y-30,60,60);
  g.fillStyle=`rgba(${p.glow},.6)`;g.beginPath();g.moveTo(-8,y+4);for(let i=0;i<5;i++){const k=i/4;g.quadraticCurveTo(-14-k*18,y+8+Math.sin(t*4+i)*6,-20-k*20,y+2+Math.sin(t*5+i)*8);}g.lineTo(-6,y-2);g.closePath();g.fill();
  g.fillStyle=`rgb(${p.core})`;circ(g,0,y,7);g.fillStyle=p.eye;circ(g,-2.4,y-1,1.2);circ(g,2.8,y-1,1.2);
  for(let i=0;i<4;i++){const k=(t*.8+i/4)%1;g.fillStyle=`rgba(${p.core},${1-k})`;circ(g,-6-k*18,y+Math.sin(t*3+i)*4+k*6,1.4);}
}
function artElemental(g,t,p,o){
  const b=Math.sin(t*1.8)*1.2;
  g.fillStyle=p.dark;poly(g,[-16,0,-10,-18,-4,0]);poly(g,[6,0,12,-18,18,0]);
  g.fillStyle=p.body;poly(g,[-22,-14+b,-16,-46+b,0,-58+b,18,-48+b,24,-16+b,10,-8+b,-10,-8+b]);
  g.fillStyle=p.light;poly(g,[-14,-44+b,0,-56+b,6,-40+b,-6,-30+b]);
  g.fillStyle=p.dark;poly(g,[-22,-30+b,-34,-22+b,-30,-10+b,-20,-18+b]);poly(g,[22,-32+b,36,-26+b,34,-12+b,22,-18+b]);
  if(o.crystals){g.fillStyle=p.crystal;[[-10,-58],[4,-62],[14,-54]].forEach(([x,y])=>poly(g,[x-3,y+b+6,x,y+b-8,x+3,y+b+6]));}
  const gl=.6+.4*Math.sin(t*4);g.fillStyle=`rgba(${p.eyeGlow},${gl})`;circ(g,2,-40+b,2.6);circ(g,10,-40+b,2.6);
}
function artBlob(g,t,p){
  const sq=Math.sin(t*3)*2;
  g.fillStyle=p.body;g.beginPath();g.moveTo(-24,0);g.quadraticCurveTo(-26,-30-sq,0,-36-sq);g.quadraticCurveTo(26,-30-sq,24,0);g.closePath();g.fill();
  g.fillStyle=p.light;ell(g,-8,-26-sq,7,4);g.fill();
  g.fillStyle='#fff';circ(g,4,-20,4);circ(g,13,-20,3.4);g.fillStyle='#1c120a';circ(g,5,-20,2);circ(g,14,-20,1.7);
  g.fillStyle=p.dark;for(let i=0;i<4;i++){const k=(t*.5+i/4)%1;circ(g,-18+i*11,-2+k*2,2.4*(1-k));}
}
function artCrab(g,t,p){
  const c=Math.sin(t*4);
  g.strokeStyle=p.dark;g.lineWidth=2.6;g.beginPath();for(let i=0;i<3;i++){g.moveTo(-10,-10);g.lineTo(-22-i*3,-2+i);g.moveTo(10,-10);g.lineTo(22+i*3,-2+i);}g.stroke();
  g.fillStyle=p.body;ell(g,0,-14,20,11);g.fill();g.fillStyle=p.light;ell(g,-4,-18,10,4);g.fill();
  g.fillStyle=p.body;g.save();g.translate(24,-26);g.rotate(-.4+c*.15);ell(g,0,0,9,6);g.fill();g.fillStyle=p.dark;poly(g,[4,-2,14,-8+c*3,8,2]);g.restore();
  g.fillStyle='#1c120a';circ(g,6,-28,2);circ(g,12,-27,2);g.strokeStyle=p.dark;g.lineWidth=1.4;g.beginPath();g.moveTo(6,-26);g.lineTo(5,-20);g.moveTo(12,-25);g.lineTo(11,-20);g.stroke();
}
function artWarrior(g,t,p){
  const b=Math.sin(t*2.2)*.8;
  g.fillStyle=p.dark;g.fillRect(-7,-16,5,16);g.fillRect(3,-16,5,16);
  g.fillStyle=p.body;rr(g,-11,-44+b,22,30,5);g.fill();g.fillStyle=p.trim;g.fillRect(-11,-26+b,22,3);
  g.fillStyle=p.skin||'#b97d52';circ(g,1,-50+b,7);g.fillStyle=p.head;ell(g,0,-55+b,8.4,4.6);g.fill();g.fillRect(-8,-56+b,4,12);
  g.fillStyle='#1c120a';circ(g,4,-50+b,1.1);
  g.strokeStyle=p.weapon||'#c9d1d6';g.lineWidth=2.6;g.beginPath();g.moveTo(10,-34+b);g.lineTo(26,-54+b);g.stroke();
  g.fillStyle=p.shield||p.trim;ell(g,-12,-32+b,6,10);g.fill();
}
function artYeti(g,t,p,o,e){
  const y=Math.sin(t*1.4)*2,arm=Math.sin(t*2)*.12,hot=e&&e.enraged;
  g.fillStyle=p.dark;ell(g,-18,-8,14,9);g.fill();ell(g,20,-8,14,9);g.fill();
  g.fillStyle=p.body;g.beginPath();g.moveTo(-42,-30+y);g.quadraticCurveTo(-50,-110+y,0,-128+y);g.quadraticCurveTo(50,-110+y,42,-30+y);g.quadraticCurveTo(0,-10,-42,-30+y);g.fill();
  g.fillStyle=p.light;for(let i=0;i<14;i++){const a=i/14*Math.PI,r=40;poly(g,[Math.cos(a)*r-4,-70-Math.sin(a)*40+y,Math.cos(a)*r,-82-Math.sin(a)*44+y,Math.cos(a)*r+4,-70-Math.sin(a)*40+y]);}
  g.save();g.translate(-40,-90+y);g.rotate(.35+arm);g.fillStyle=p.body;ell(g,-6,26,12,32);g.fill();g.fillStyle=p.dark;ell(g,-8,56,11,8);g.fill();g.restore();
  g.save();g.translate(40,-90+y);g.rotate(-.35-arm);g.fillStyle=p.body;ell(g,6,26,12,32);g.fill();g.fillStyle=p.dark;ell(g,8,56,11,8);g.fill();g.restore();
  g.fillStyle=p.face;ell(g,8,-100+y,18,15);g.fill();
  g.fillStyle=p.horn;poly(g,[-6,-118+y,-20,-142+y,-2,-124+y]);poly(g,[20,-118+y,34,-140+y,16,-124+y]);
  g.fillStyle=hot?'#ff6a4a':p.eye;circ(g,2,-104+y,3);circ(g,16,-104+y,3);
  g.fillStyle='#2a1a1a';ell(g,9,-92+y,8,3.4+Math.abs(Math.sin(t*2))*2);g.fill();g.fillStyle='#fff';poly(g,[3,-94+y,5,-88+y,7,-94+y]);poly(g,[11,-94+y,13,-88+y,15,-94+y]);
  if(o.breath&&fxOn()){g.fillStyle='rgba(220,240,255,.35)';for(let i=0;i<4;i++){const k=(t*.7+i/4)%1;circ(g,24+k*30,-92+y+Math.sin(t*3+i)*3,3+k*8);}}
}

/* =========================================================
   BEHAVIOUR: bosses built from a list of moves
   ========================================================= */
async function genBossAction(e){
  e.turn=(e.turn||0)+1;const d=e.d,ms=members().filter(alive);if(!ms.length)return;
  if(!e.enraged&&e.hp<e.max*.5){e.enraged=true;e.atkK=1.25;SFX.play('growl');shake(10,.7);await say(d.moves.rage||`${e.name} يغضب، وتشتد ضرباته!`,1300);}
  const pw=e.atkK||1;e.actT=time;
  const big=d.moves.big,every=d.moves.every||3;
  if(big&&e.turn%every===0){
    SFX.play(big.sfx||'eMagic');fx(big.fx||'frost',0,0);shake(7,.5);await say(big.say||`${e.name} يستخدم ${big.name}!`,1000);
    for(const id of ms){let dmg=rollDmg((d.mag*big.k-mStat(id,'wis')*.45)*pw);if(B.m[id].guard)dmg=Math.ceil(dmg/2);hurt(id,dmg);if(big.status&&alive(id)&&Math.random()<.5){B.st[id][big.status]=big.status==='sleep'?2:4;const p=mPos(id);popup(p.x,p.y-100,big.status==='sleep'?'نعاس':'سمّ',big.status==='sleep'?'#c9b8ff':'#b5e07b');}}
    for(const id of ms)await fallenCheck(id);return;
  }
  const tgt=pickTarget();if(!tgt)return;const hit=d.moves.hit||{name:'ضربة',k:1.2};
  SFX.play('swing');await wait(260);
  let dmg=rollDmg((d.atk*1.8-mDef(tgt))*hit.k*pw);if(B.m[tgt].guard)dmg=Math.max(1,Math.ceil(dmg/2));
  SFX.play('hit');shake(5,.3);hurt(tgt,dmg);await say(`${e.name} يستخدم ${hit.name} على ${NAMES[tgt]} — ${AR(dmg)} ضررًا.`,900);await fallenCheck(tgt);
}

/* =========================================================
   HIGH-LEVEL ABILITIES (one generic runner)
   ========================================================= */
ABILITIES.push(
  {id:'blaze',type:'magic',name:'لهيب الجبل',mp:12,lv:12,target:'all',icon:'flame',gen:{el:'fire',k:1.9,add:14,fx:'fire',sfx:'fire'},desc:'نار تلتهم كل الأعداء. قوية على وحوش الثلج.'},
  {id:'eagle',type:'skill',name:'انقضاض العُقاب',mp:9,lv:16,target:'one',icon:'sword',gen:{strike:2.3},desc:'ضربة هائلة على عدو واحد.'},
  {id:'sunflare',type:'magic',name:'شمس الظهيرة',mp:18,lv:22,target:'one',icon:'flame',gen:{el:'fire',k:4.2,add:30,fx:'fire',sfx:'fire'},desc:'حرارة الظهيرة كلها في ضربة واحدة.'},
  {id:'dunes',type:'magic',name:'زحف الكثبان',mp:20,lv:30,target:'all',icon:'wind',gen:{el:'sand',k:2.6,add:24,fx:'sand',sfx:'sand'},desc:'كثبان كاملة تنهال على الأعداء.'},
  {id:'thousand',type:'skill',name:'ألف ضربة',mp:24,lv:40,target:'all',icon:'bolt',gen:{strikeAll:1.25},desc:'تضرب كل عدو ضربة كاملة.'},
);
ALLY_SPELLS.push(
  {id:'spring',name:'عين الحياة',mp:16,lv:15,target:'party',icon:'leaf',gen:{heal:3.2,add:30},desc:'ماء العين يعيد للفريق صحة كثيرة.'},
  {id:'dawn',name:'فجر جديد',mp:30,lv:35,target:'party',icon:'heart',gen:{heal:5,add:60,revive:true},desc:'يعيد الساقطين ويملأ صحة الفريق.'},
);
async function genAbility(id,a,cmd){
  const g=a.gen,w=mStat(id,'wis');
  if(g.heal){SFX.play('heal');for(const m of members()){if(!alive(m)){if(!g.revive)continue;setHP(m,mStat(m,'hp')*.3);}const b=mHP(m);setHP(m,b+w*g.heal+g.add);healPop(m,mHP(m)-b);}renderParty();await say(`${a.name} ${g.revive?'يعيد الفريق كله إلى المعركة':'تعيد للفريق صحته'}!`,950);return;}
  if(g.strike){await strike(id,retarget(cmd.target),g.strike,a.name,.12);return;}
  if(g.strikeAll){for(const e of aliveEnemies())await strike(id,e,g.strikeAll,a.name,.05);return;}
  anim(id,'cast');SFX.play(g.sfx||'eMagic');
  const tg=a.target==='all'?aliveEnemies():[retarget(cmd.target)];
  if(a.target!=='all'){const p=mPos(id);fx('fireball',p.x-20,p.y-40,{tx:tg[0].x,ty:eMid(tg[0])});await wait(380);}else{fx(g.fx,0,0);await wait(300);}
  let tot=0;for(const e of tg)tot+=await magicHit(e,w*g.k+g.add,g.el);
  await say(a.target==='all'?`${a.name} يصيب الأعداء!`:`${a.name} — ${AR(tot)} ضررًا.`,850);
  for(const e of B.enemies)await killCheck(e);
}

Object.assign(MONSTER_ART,{beast:artBeast,flyer:artFlyer,spirit:artSpirit,elemental:artElemental,blob:artBlob,crab:artCrab,warrior:artWarrior,yeti:artYeti});

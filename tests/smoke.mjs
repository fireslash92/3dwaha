// اختبار آلي سريع للعبة في متصفح Chromium (يحتاج Playwright: npm i -D playwright)
// الاستخدام:
//   node tests/smoke.mjs            ← يختبر نسخة الويب متعددة الملفات (index.html)
//   node tests/smoke.mjs artifact   ← يختبر الملف الواحد dist/ayn-alwadi.artifact.html
import {createServer} from 'node:http';
import {readFileSync,existsSync} from 'node:fs';
import {join,dirname,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';

const require=createRequire(import.meta.url);
const {chromium}=require('playwright');
const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const mode=process.argv[2]==='artifact'?'artifact':'web';
const TYPES={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.webmanifest':'application/manifest+json'};

const server=createServer((req,res)=>{
  let p=decodeURIComponent(req.url.split('?')[0]);
  if(p==='/'||p==='/index.html'){
    if(mode==='artifact'){const body=readFileSync(join(root,'dist/ayn-alwadi.artifact.html'),'utf8');res.setHeader('content-type',TYPES['.html']);res.end(`<!doctype html><html><head><meta charset="utf-8"><style>[hidden]{display:none!important}body{margin:0}</style></head><body>${body}</body></html>`);return;}
    p='/index.html';
  }
  const f=join(root,p);if(!f.startsWith(root)||!existsSync(f)){res.statusCode=404;res.end();return;}
  res.setHeader('content-type',TYPES[extname(f)]||'application/octet-stream');res.end(readFileSync(f));
}).listen(0);
const url=`http://127.0.0.1:${server.address().port}/`;

const results=[];const ok=(name,cond,info='')=>{results.push({name,pass:!!cond,info});};
const browser=await chromium.launch({args:['--no-sandbox'],...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
try{
  const ctx=await browser.newContext({viewport:{width:852,height:393},hasTouch:true,isMobile:true});
  const page=await ctx.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error'&&!/ERR_|Failed to load resource/.test(m.text()))errors.push(m.text());});
  await page.goto(url);await page.waitForTimeout(600);
  ok('تحميل اللعبة دون أخطاء',errors.length===0,errors.join(' | '));
  await page.tap('#startBtn');await page.waitForTimeout(400);
  ok('بدء الرحلة',await page.evaluate(()=>__game.state)==='play');

  const talk=id=>page.evaluate(id=>{const G=__game;G.step(1/60,30);const n=G.NPCS.find(q=>q.id===id),h=G.hero;
    for(const [dx,dy] of [[0,30],[0,-30],[30,0],[-30,0],[24,24]]){const sc=G.SCENES[G.scene];const q=G.resolve(n.x+dx,n.y+dy,7,G.collidersFor(h),sc.W,sc.H);h.x=q.x;h.y=q.y;G.step(1/60,1);if(G.target&&G.target.npc===n)break;}
    G.act();let k=0;while(G.state==='dialog'&&k++<10)G.act();return G.met;},id);
  const walk=async(x,y,key)=>{await page.evaluate(([x,y,key])=>{const G=__game;G.hero.x=x;G.hero.y=y;G.keys[key]=true;G.step(1/60,20);G.keys[key]=false;},[x,y,key]);await page.waitForTimeout(450);return page.evaluate(()=>__game.scene);};

  await talk('salem');for(const id of ['saeed','mariam','hamad','shamsa'])await talk(id);
  ok('دخول بيت أم سعيد',await walk(226,330,'up')==='A');await talk('ummsaeed');await walk(224,290,'down');
  ok('دخول بيت راشد',await walk(924,336,'up')==='B');await talk('rashid');await talk('aisha');await walk(224,290,'down');
  ok('دخول بيت الجدة زوينة',await walk(228,730,'up')==='C');await talk('zuwaina');await walk(224,290,'down');
  ok('التعرّف على أهل القرية الثمانية',await page.evaluate(()=>__game.met)===8);
  await talk('salem');await page.waitForTimeout(900);
  ok('نهاية الفصل الأول',await page.evaluate(()=>__game.chapter&&__game.state==='chapter'));
  await page.tap('#chapterBtn');await page.waitForTimeout(600);

  const collisions=await page.evaluate(()=>{const G=__game,h=G.hero,ks=['up','down','left','right'];h.x=576;h.y=600;let worst=0;
    for(let i=0;i<2500;i++){if(i%30===0){ks.forEach(k=>G.keys[k]=false);G.keys[ks[(Math.random()*4)|0]]=true;}
      if(G.scene!=='village'||G.state!=='play')break;G.step(1/30);
      for(const c of G.collidersFor(h)){if(c.t!=='r')continue;const qx=Math.max(c.x,Math.min(h.x,c.x+c.w)),qy=Math.max(c.y,Math.min(h.y,c.y+c.h));worst=Math.max(worst,7-Math.hypot(h.x-qx,h.y-qy));}}
    ks.forEach(k=>G.keys[k]=false);return worst;});
  ok('التصادم في القرية',collisions<.5,`أقصى تداخل ${collisions.toFixed(2)}`);

  // fishing: buy nothing, just hand over a rod and let a simple bot reel in
  const fished=await page.evaluate(async()=>{const G=__game,F=G.MAP.falaj;G.P.inv.rod=1;G.hero.x=F.x+F.w+14;G.hero.y=F.y+F.h/2;G.step(1/60,2);G.act();
    for(let k=0;k<1200&&G.state==='fish';k++){const f=G.FG;if(f&&f.phase==='bite')G.act();if(f&&f.phase==='reel')G.setHold(f.f>f.z+f.zw*.5);await new Promise(r=>setTimeout(r,16));}
    G.setHold(false);return Object.keys(G.P.fishLog||{}).length>0;});
  ok('صيد سمكة من الفلج',fished);
  await page.evaluate(()=>{const G=__game;G.OPT.bspeed='fast';G.hero.x=576;G.hero.y=110;G.keys.up=true;G.step(1/60,10);G.keys.up=false;});await page.waitForTimeout(700);
  ok('دخول ممر الغابة',await page.evaluate(()=>__game.scene)==='forest');
  await page.evaluate(()=>{__game.hero.y=900;__game.startEncounter({types:['lizard']});});await page.waitForTimeout(1600);
  for(let k=0;k<20;k++){await page.waitForFunction(()=>__game.B&&(!__game.B.busy||__game.B.ended),null,{timeout:40000});if(await page.evaluate(()=>__game.B.ended))break;
    await page.click('[data-c="attack"]');await page.waitForTimeout(80);}
  await page.waitForTimeout(1200);
  ok('معركة وفوز',await page.evaluate(()=>__game.B&&__game.B.result)==='win');
  await page.click('[data-c="continue"]');await page.waitForTimeout(700);

  await page.evaluate(()=>__game.openMenu('settings'));await page.waitForTimeout(200);
  await page.click('[data-act="save"]');await page.waitForTimeout(200);await page.click('#menuClose');
  await page.reload();await page.waitForTimeout(700);
  const cont=await page.isVisible('#continueBtn');if(cont)await page.tap('#continueBtn');await page.waitForTimeout(500);
  ok('الحفظ ومتابعة الرحلة',cont&&await page.evaluate(()=>__game.met===8&&__game.chapter));
  ok('لا أخطاء في أثناء اللعب',errors.length===0,errors.join(' | '));
}finally{await browser.close();server.close();}

let failed=0;
for(const r of results){console.log(`${r.pass?'✓':'✗'} ${r.name}${r.info?` — ${r.info}`:''}`);if(!r.pass)failed++;}
console.log(failed?`\n${failed} اختبار فشل`:`\nنجحت كل الاختبارات (${results.length}) على نسخة ${mode==='artifact'?'الملف الواحد':'الويب'}`);
process.exit(failed?1:0);

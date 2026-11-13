// يبني ثلاثة مخرجات من ملفات المصدر دون أي حزم خارجية:
//  1) index.html  — نسخة الويب متعددة الملفات (GitHub Pages) مع تطبيق قابل للتثبيت
//  2) sw.js       — عامل الخدمة الذي يحفظ الملفات للعب دون إنترنت
//  3) dist/ayn-alwadi.artifact.html — ملف واحد يُنشر كـ Claude Artifact
// الاستخدام: node tools/build.mjs
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(join(root,p),'utf8');
const order=JSON.parse(read('src/load-order.json'));
const css=read('styles/main.css');
const markup=read('src/markup.html').trimEnd();
const sources=order.map(p=>({p,code:read(p)}));

const version=createHash('sha1').update(css+markup+sources.map(s=>s.code).join('')).digest('hex').slice(0,10);
const TITLE='أسرار عين الوادي';
const FONT='<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@500;700&display=swap">';

// 1) index.html
const VENDOR='vendor/babylon.js';
const tags=`<script src="${VENDOR}"></script>\n`+order.map(p=>`<script src="${p}?v=${version}"></script>`).join('\n');
writeFileSync(join(root,'index.html'),`<!doctype html>
<!-- هذا الملف يُولَّد تلقائيًا من tools/build.mjs، فلا تعدّله يدويًا -->
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<title>${TITLE}</title>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
<meta name="description" content="لعبة مغامرات بأسلوب JRPG الكلاسيكي في قرية عمانية.">
<meta name="theme-color" content="#22301a">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="عين الوادي">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icons/icon-192.png" type="image/png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
${FONT}
<style>[hidden]{display:none!important}</style>
<link rel="stylesheet" href="styles/main.css?v=${version}">
</head>
<body>
${markup}
${tags}
<script>
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
</script>
</body>
</html>
`);

// 2) sw.js
const assets=['./','index.html','manifest.webmanifest','styles/main.css?v='+version,'icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png',VENDOR,...order.map(p=>`${p}?v=${version}`)];
writeFileSync(join(root,'sw.js'),`// يُولَّد تلقائيًا من tools/build.mjs
const CACHE='ayn-alwadi-${version}';
const ASSETS=${JSON.stringify(assets,null,1)};
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.hostname.endsWith('googleapis.com')||url.hostname.endsWith('gstatic.com')){
    e.respondWith(caches.open(CACHE).then(async c=>{const hit=await c.match(req);if(hit)return hit;try{const res=await fetch(req);c.put(req,res.clone());return res;}catch(_){return hit||Response.error();}}));return;
  }
  if(url.origin!==location.origin)return;
  e.respondWith(caches.match(req,{ignoreSearch:req.mode==='navigate'}).then(hit=>hit||fetch(req).catch(()=>caches.match('index.html'))));
});
`);

// 3) single-file artifact
const bundle=sources.map(s=>`// ---- ${s.p} ----\n`+s.code.replace(/^'use strict';\n/m,'')).join('\n');
mkdirSync(join(root,'dist'),{recursive:true});
writeFileSync(join(root,'dist','ayn-alwadi.artifact.html'),`<title>${TITLE}</title>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
<meta name="claude:viewport-fit-sides" content="cover">
${FONT}
<style>
${css}</style>

${markup}

<script src="${VENDOR}"></script>
<script>
(() => {
'use strict';
${bundle}
})();
</script>
`);
console.log(`built v${version}: ${order.length} source files`);

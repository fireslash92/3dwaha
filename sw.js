// يُولَّد تلقائيًا من tools/build.mjs
const CACHE='ayn-alwadi-692ee480cd';
const ASSETS=[
 "./",
 "index.html",
 "manifest.webmanifest",
 "styles/main.css?v=692ee480cd",
 "icons/icon-192.png",
 "icons/icon-512.png",
 "icons/apple-touch-icon.png",
 "src/core/helpers.js?v=692ee480cd",
 "src/world/village-map.js?v=692ee480cd",
 "src/world/interiors.js?v=692ee480cd",
 "src/core/collision.js?v=692ee480cd",
 "src/art/hero.js?v=692ee480cd",
 "src/art/villagers.js?v=692ee480cd",
 "src/art/props.js?v=692ee480cd",
 "src/world/ground.js?v=692ee480cd",
 "src/world/drawables.js?v=692ee480cd",
 "src/world/scenes.js?v=692ee480cd",
 "src/story/people.js?v=692ee480cd",
 "src/rpg/data.js?v=692ee480cd",
 "src/core/state.js?v=692ee480cd",
 "src/core/view.js?v=692ee480cd",
 "src/core/input.js?v=692ee480cd",
 "src/story/flow.js?v=692ee480cd",
 "src/core/update.js?v=692ee480cd",
 "src/core/render.js?v=692ee480cd",
 "src/world/forest.js?v=692ee480cd",
 "src/battle/battle.js?v=692ee480cd",
 "src/audio/audio.js?v=692ee480cd",
 "src/rpg/economy.js?v=692ee480cd",
 "src/story/side-quests.js?v=692ee480cd",
 "src/world/day-night.js?v=692ee480cd",
 "src/battle/elements.js?v=692ee480cd",
 "src/world/wadi.js?v=692ee480cd",
 "src/ui/bestiary.js?v=692ee480cd",
 "src/world/fort.js?v=692ee480cd",
 "src/ui/minimap.js?v=692ee480cd",
 "src/core/save.js?v=692ee480cd",
 "src/ui/menu.js?v=692ee480cd",
 "src/boot.js?v=692ee480cd"
];
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

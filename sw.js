// يُولَّد تلقائيًا من tools/build.mjs
const CACHE='ayn-alwadi-b28113b09e';
const ASSETS=[
 "./",
 "index.html",
 "manifest.webmanifest",
 "styles/main.css?v=b28113b09e",
 "icons/icon-192.png",
 "icons/icon-512.png",
 "icons/apple-touch-icon.png",
 "src/core/helpers.js?v=b28113b09e",
 "src/world/village-map.js?v=b28113b09e",
 "src/world/interiors.js?v=b28113b09e",
 "src/core/collision.js?v=b28113b09e",
 "src/art/hero.js?v=b28113b09e",
 "src/art/villagers.js?v=b28113b09e",
 "src/art/props.js?v=b28113b09e",
 "src/world/ground.js?v=b28113b09e",
 "src/world/drawables.js?v=b28113b09e",
 "src/world/scenes.js?v=b28113b09e",
 "src/story/people.js?v=b28113b09e",
 "src/rpg/data.js?v=b28113b09e",
 "src/core/state.js?v=b28113b09e",
 "src/fx/feel.js?v=b28113b09e",
 "src/core/view.js?v=b28113b09e",
 "src/core/input.js?v=b28113b09e",
 "src/story/flow.js?v=b28113b09e",
 "src/core/update.js?v=b28113b09e",
 "src/core/render.js?v=b28113b09e",
 "src/world/forest.js?v=b28113b09e",
 "src/battle/battle.js?v=b28113b09e",
 "src/audio/audio.js?v=b28113b09e",
 "src/rpg/economy.js?v=b28113b09e",
 "src/story/side-quests.js?v=b28113b09e",
 "src/world/day-night.js?v=b28113b09e",
 "src/battle/elements.js?v=b28113b09e",
 "src/world/wadi.js?v=b28113b09e",
 "src/ui/bestiary.js?v=b28113b09e",
 "src/world/fort.js?v=b28113b09e",
 "src/world/life.js?v=b28113b09e",
 "src/world/weather.js?v=b28113b09e",
 "src/fx/atmosphere.js?v=b28113b09e",
 "src/ui/minimap.js?v=b28113b09e",
 "src/core/save.js?v=b28113b09e",
 "src/ui/menu.js?v=b28113b09e",
 "src/boot.js?v=b28113b09e"
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

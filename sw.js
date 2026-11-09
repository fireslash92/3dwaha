// يُولَّد تلقائيًا من tools/build.mjs
const CACHE='ayn-alwadi-b0ed2d0faf';
const ASSETS=[
 "./",
 "index.html",
 "manifest.webmanifest",
 "styles/main.css?v=b0ed2d0faf",
 "icons/icon-192.png",
 "icons/icon-512.png",
 "icons/apple-touch-icon.png",
 "src/core/helpers.js?v=b0ed2d0faf",
 "src/world/village-map.js?v=b0ed2d0faf",
 "src/world/interiors.js?v=b0ed2d0faf",
 "src/core/collision.js?v=b0ed2d0faf",
 "src/art/hero.js?v=b0ed2d0faf",
 "src/art/villagers.js?v=b0ed2d0faf",
 "src/art/props.js?v=b0ed2d0faf",
 "src/world/ground.js?v=b0ed2d0faf",
 "src/world/drawables.js?v=b0ed2d0faf",
 "src/world/scenes.js?v=b0ed2d0faf",
 "src/story/people.js?v=b0ed2d0faf",
 "src/rpg/data.js?v=b0ed2d0faf",
 "src/core/state.js?v=b0ed2d0faf",
 "src/fx/feel.js?v=b0ed2d0faf",
 "src/core/view.js?v=b0ed2d0faf",
 "src/core/input.js?v=b0ed2d0faf",
 "src/story/flow.js?v=b0ed2d0faf",
 "src/core/update.js?v=b0ed2d0faf",
 "src/core/render.js?v=b0ed2d0faf",
 "src/world/forest.js?v=b0ed2d0faf",
 "src/battle/battle.js?v=b0ed2d0faf",
 "src/audio/audio.js?v=b0ed2d0faf",
 "src/rpg/economy.js?v=b0ed2d0faf",
 "src/story/side-quests.js?v=b0ed2d0faf",
 "src/world/day-night.js?v=b0ed2d0faf",
 "src/battle/elements.js?v=b0ed2d0faf",
 "src/world/wadi.js?v=b0ed2d0faf",
 "src/ui/bestiary.js?v=b0ed2d0faf",
 "src/world/fort.js?v=b0ed2d0faf",
 "src/world/life.js?v=b0ed2d0faf",
 "src/ui/minimap.js?v=b0ed2d0faf",
 "src/core/save.js?v=b0ed2d0faf",
 "src/ui/menu.js?v=b0ed2d0faf",
 "src/boot.js?v=b0ed2d0faf"
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

// يُولَّد تلقائيًا من tools/build.mjs
const CACHE='ayn-alwadi-73168c1563';
const ASSETS=[
 "./",
 "index.html",
 "manifest.webmanifest",
 "styles/main.css?v=73168c1563",
 "icons/icon-192.png",
 "icons/icon-512.png",
 "icons/apple-touch-icon.png",
 "src/core/helpers.js?v=73168c1563",
 "src/world/village-map.js?v=73168c1563",
 "src/world/interiors.js?v=73168c1563",
 "src/core/collision.js?v=73168c1563",
 "src/art/hero.js?v=73168c1563",
 "src/art/villagers.js?v=73168c1563",
 "src/art/props.js?v=73168c1563",
 "src/world/ground.js?v=73168c1563",
 "src/world/drawables.js?v=73168c1563",
 "src/world/scenes.js?v=73168c1563",
 "src/story/people.js?v=73168c1563",
 "src/rpg/data.js?v=73168c1563",
 "src/core/state.js?v=73168c1563",
 "src/fx/feel.js?v=73168c1563",
 "src/core/view.js?v=73168c1563",
 "src/core/input.js?v=73168c1563",
 "src/story/flow.js?v=73168c1563",
 "src/core/update.js?v=73168c1563",
 "src/core/render.js?v=73168c1563",
 "src/world/forest.js?v=73168c1563",
 "src/battle/battle.js?v=73168c1563",
 "src/audio/audio.js?v=73168c1563",
 "src/rpg/economy.js?v=73168c1563",
 "src/story/side-quests.js?v=73168c1563",
 "src/world/day-night.js?v=73168c1563",
 "src/battle/elements.js?v=73168c1563",
 "src/world/wadi.js?v=73168c1563",
 "src/ui/bestiary.js?v=73168c1563",
 "src/world/fort.js?v=73168c1563",
 "src/world/life.js?v=73168c1563",
 "src/world/weather.js?v=73168c1563",
 "src/fx/atmosphere.js?v=73168c1563",
 "src/world/fishing.js?v=73168c1563",
 "src/ui/minimap.js?v=73168c1563",
 "src/core/save.js?v=73168c1563",
 "src/ui/menu.js?v=73168c1563",
 "src/ui/achievements.js?v=73168c1563",
 "src/boot.js?v=73168c1563"
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

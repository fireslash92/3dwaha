// يُولَّد تلقائيًا من tools/build.mjs
const CACHE='ayn-alwadi-fc8d91b67c';
const ASSETS=[
 "./",
 "index.html",
 "manifest.webmanifest",
 "styles/main.css?v=fc8d91b67c",
 "icons/icon-192.png",
 "icons/icon-512.png",
 "icons/apple-touch-icon.png",
 "src/core/helpers.js?v=fc8d91b67c",
 "src/world/village-map.js?v=fc8d91b67c",
 "src/world/interiors.js?v=fc8d91b67c",
 "src/core/collision.js?v=fc8d91b67c",
 "src/art/hero.js?v=fc8d91b67c",
 "src/art/villagers.js?v=fc8d91b67c",
 "src/art/props.js?v=fc8d91b67c",
 "src/world/ground.js?v=fc8d91b67c",
 "src/world/drawables.js?v=fc8d91b67c",
 "src/world/scenes.js?v=fc8d91b67c",
 "src/story/people.js?v=fc8d91b67c",
 "src/rpg/data.js?v=fc8d91b67c",
 "src/core/state.js?v=fc8d91b67c",
 "src/fx/feel.js?v=fc8d91b67c",
 "src/core/view.js?v=fc8d91b67c",
 "src/core/input.js?v=fc8d91b67c",
 "src/story/flow.js?v=fc8d91b67c",
 "src/core/update.js?v=fc8d91b67c",
 "src/core/render.js?v=fc8d91b67c",
 "src/world/forest.js?v=fc8d91b67c",
 "src/battle/battle.js?v=fc8d91b67c",
 "src/audio/audio.js?v=fc8d91b67c",
 "src/rpg/economy.js?v=fc8d91b67c",
 "src/story/side-quests.js?v=fc8d91b67c",
 "src/world/day-night.js?v=fc8d91b67c",
 "src/battle/elements.js?v=fc8d91b67c",
 "src/world/wadi.js?v=fc8d91b67c",
 "src/ui/bestiary.js?v=fc8d91b67c",
 "src/world/fort.js?v=fc8d91b67c",
 "src/world/life.js?v=fc8d91b67c",
 "src/world/weather.js?v=fc8d91b67c",
 "src/fx/atmosphere.js?v=fc8d91b67c",
 "src/world/fishing.js?v=fc8d91b67c",
 "src/world/camel-race.js?v=fc8d91b67c",
 "src/world/market.js?v=fc8d91b67c",
 "src/ui/minimap.js?v=fc8d91b67c",
 "src/core/save.js?v=fc8d91b67c",
 "src/ui/menu.js?v=fc8d91b67c",
 "src/ui/achievements.js?v=fc8d91b67c",
 "src/boot.js?v=fc8d91b67c"
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

// يُولَّد تلقائيًا من tools/build.mjs
const CACHE='ayn-alwadi-fae523a843';
const ASSETS=[
 "./",
 "index.html",
 "manifest.webmanifest",
 "styles/main.css?v=fae523a843",
 "icons/icon-192.png",
 "icons/icon-512.png",
 "icons/apple-touch-icon.png",
 "src/core/helpers.js?v=fae523a843",
 "src/world/village-map.js?v=fae523a843",
 "src/world/interiors.js?v=fae523a843",
 "src/core/collision.js?v=fae523a843",
 "src/art/hero.js?v=fae523a843",
 "src/art/villagers.js?v=fae523a843",
 "src/art/props.js?v=fae523a843",
 "src/world/ground.js?v=fae523a843",
 "src/world/drawables.js?v=fae523a843",
 "src/world/scenes.js?v=fae523a843",
 "src/story/people.js?v=fae523a843",
 "src/rpg/data.js?v=fae523a843",
 "src/rpg/progression.js?v=fae523a843",
 "src/core/state.js?v=fae523a843",
 "src/fx/feel.js?v=fae523a843",
 "src/core/view.js?v=fae523a843",
 "src/core/input.js?v=fae523a843",
 "src/story/flow.js?v=fae523a843",
 "src/core/update.js?v=fae523a843",
 "src/core/render.js?v=fae523a843",
 "src/world/forest.js?v=fae523a843",
 "src/battle/battle.js?v=fae523a843",
 "src/audio/audio.js?v=fae523a843",
 "src/rpg/economy.js?v=fae523a843",
 "src/story/side-quests.js?v=fae523a843",
 "src/world/day-night.js?v=fae523a843",
 "src/battle/elements.js?v=fae523a843",
 "src/battle/monsters.js?v=fae523a843",
 "src/world/wadi.js?v=fae523a843",
 "src/ui/bestiary.js?v=fae523a843",
 "src/world/fort.js?v=fae523a843",
 "src/world/life.js?v=fae523a843",
 "src/world/weather.js?v=fae523a843",
 "src/fx/atmosphere.js?v=fae523a843",
 "src/world/fishing.js?v=fae523a843",
 "src/world/camel-race.js?v=fae523a843",
 "src/world/market.js?v=fae523a843",
 "src/world/areas.js?v=fae523a843",
 "src/ui/worldmap.js?v=fae523a843",
 "src/story/chapter5.js?v=fae523a843",
 "src/ui/minimap.js?v=fae523a843",
 "src/core/save.js?v=fae523a843",
 "src/ui/menu.js?v=fae523a843",
 "src/ui/achievements.js?v=fae523a843",
 "src/boot.js?v=fae523a843"
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

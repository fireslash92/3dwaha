// يُولَّد تلقائيًا من tools/build.mjs
const CACHE='ayn-alwadi-c6e6f7b27a';
const ASSETS=[
 "./",
 "index.html",
 "manifest.webmanifest",
 "styles/main.css?v=c6e6f7b27a",
 "icons/icon-192.png",
 "icons/icon-512.png",
 "icons/apple-touch-icon.png",
 "src/core/helpers.js?v=c6e6f7b27a",
 "src/world/village-map.js?v=c6e6f7b27a",
 "src/world/interiors.js?v=c6e6f7b27a",
 "src/core/collision.js?v=c6e6f7b27a",
 "src/art/hero.js?v=c6e6f7b27a",
 "src/art/villagers.js?v=c6e6f7b27a",
 "src/art/props.js?v=c6e6f7b27a",
 "src/world/ground.js?v=c6e6f7b27a",
 "src/world/drawables.js?v=c6e6f7b27a",
 "src/world/scenes.js?v=c6e6f7b27a",
 "src/story/people.js?v=c6e6f7b27a",
 "src/rpg/data.js?v=c6e6f7b27a",
 "src/core/state.js?v=c6e6f7b27a",
 "src/fx/feel.js?v=c6e6f7b27a",
 "src/core/view.js?v=c6e6f7b27a",
 "src/core/input.js?v=c6e6f7b27a",
 "src/story/flow.js?v=c6e6f7b27a",
 "src/core/update.js?v=c6e6f7b27a",
 "src/core/render.js?v=c6e6f7b27a",
 "src/world/forest.js?v=c6e6f7b27a",
 "src/battle/battle.js?v=c6e6f7b27a",
 "src/audio/audio.js?v=c6e6f7b27a",
 "src/rpg/economy.js?v=c6e6f7b27a",
 "src/story/side-quests.js?v=c6e6f7b27a",
 "src/world/day-night.js?v=c6e6f7b27a",
 "src/battle/elements.js?v=c6e6f7b27a",
 "src/world/wadi.js?v=c6e6f7b27a",
 "src/ui/bestiary.js?v=c6e6f7b27a",
 "src/world/fort.js?v=c6e6f7b27a",
 "src/world/life.js?v=c6e6f7b27a",
 "src/world/weather.js?v=c6e6f7b27a",
 "src/fx/atmosphere.js?v=c6e6f7b27a",
 "src/world/fishing.js?v=c6e6f7b27a",
 "src/world/camel-race.js?v=c6e6f7b27a",
 "src/ui/minimap.js?v=c6e6f7b27a",
 "src/core/save.js?v=c6e6f7b27a",
 "src/ui/menu.js?v=c6e6f7b27a",
 "src/ui/achievements.js?v=c6e6f7b27a",
 "src/boot.js?v=c6e6f7b27a"
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

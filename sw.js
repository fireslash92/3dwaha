// يُولَّد تلقائيًا من tools/build.mjs
const CACHE='ayn-alwadi-4c2568f4bb';
const ASSETS=[
 "./",
 "index.html",
 "manifest.webmanifest",
 "styles/main.css?v=4c2568f4bb",
 "icons/icon-192.png",
 "icons/icon-512.png",
 "icons/apple-touch-icon.png",
 "src/core/helpers.js?v=4c2568f4bb",
 "src/world/village-map.js?v=4c2568f4bb",
 "src/world/interiors.js?v=4c2568f4bb",
 "src/core/collision.js?v=4c2568f4bb",
 "src/art/hero.js?v=4c2568f4bb",
 "src/art/villagers.js?v=4c2568f4bb",
 "src/art/props.js?v=4c2568f4bb",
 "src/world/ground.js?v=4c2568f4bb",
 "src/world/drawables.js?v=4c2568f4bb",
 "src/world/scenes.js?v=4c2568f4bb",
 "src/story/people.js?v=4c2568f4bb",
 "src/rpg/data.js?v=4c2568f4bb",
 "src/core/state.js?v=4c2568f4bb",
 "src/fx/feel.js?v=4c2568f4bb",
 "src/core/view.js?v=4c2568f4bb",
 "src/core/input.js?v=4c2568f4bb",
 "src/story/flow.js?v=4c2568f4bb",
 "src/core/update.js?v=4c2568f4bb",
 "src/core/render.js?v=4c2568f4bb",
 "src/world/forest.js?v=4c2568f4bb",
 "src/battle/battle.js?v=4c2568f4bb",
 "src/audio/audio.js?v=4c2568f4bb",
 "src/rpg/economy.js?v=4c2568f4bb",
 "src/story/side-quests.js?v=4c2568f4bb",
 "src/world/day-night.js?v=4c2568f4bb",
 "src/battle/elements.js?v=4c2568f4bb",
 "src/world/wadi.js?v=4c2568f4bb",
 "src/ui/bestiary.js?v=4c2568f4bb",
 "src/world/fort.js?v=4c2568f4bb",
 "src/world/life.js?v=4c2568f4bb",
 "src/world/weather.js?v=4c2568f4bb",
 "src/fx/atmosphere.js?v=4c2568f4bb",
 "src/ui/minimap.js?v=4c2568f4bb",
 "src/core/save.js?v=4c2568f4bb",
 "src/ui/menu.js?v=4c2568f4bb",
 "src/boot.js?v=4c2568f4bb"
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

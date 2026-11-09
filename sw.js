// يُولَّد تلقائيًا من tools/build.mjs
const CACHE='ayn-alwadi-82bbc7dfa0';
const ASSETS=[
 "./",
 "index.html",
 "manifest.webmanifest",
 "styles/main.css?v=82bbc7dfa0",
 "icons/icon-192.png",
 "icons/icon-512.png",
 "icons/apple-touch-icon.png",
 "src/core/helpers.js?v=82bbc7dfa0",
 "src/world/village-map.js?v=82bbc7dfa0",
 "src/world/interiors.js?v=82bbc7dfa0",
 "src/core/collision.js?v=82bbc7dfa0",
 "src/art/hero.js?v=82bbc7dfa0",
 "src/art/villagers.js?v=82bbc7dfa0",
 "src/art/props.js?v=82bbc7dfa0",
 "src/world/ground.js?v=82bbc7dfa0",
 "src/world/drawables.js?v=82bbc7dfa0",
 "src/world/scenes.js?v=82bbc7dfa0",
 "src/story/people.js?v=82bbc7dfa0",
 "src/rpg/data.js?v=82bbc7dfa0",
 "src/core/state.js?v=82bbc7dfa0",
 "src/fx/feel.js?v=82bbc7dfa0",
 "src/core/view.js?v=82bbc7dfa0",
 "src/core/input.js?v=82bbc7dfa0",
 "src/story/flow.js?v=82bbc7dfa0",
 "src/core/update.js?v=82bbc7dfa0",
 "src/core/render.js?v=82bbc7dfa0",
 "src/world/forest.js?v=82bbc7dfa0",
 "src/battle/battle.js?v=82bbc7dfa0",
 "src/audio/audio.js?v=82bbc7dfa0",
 "src/rpg/economy.js?v=82bbc7dfa0",
 "src/story/side-quests.js?v=82bbc7dfa0",
 "src/world/day-night.js?v=82bbc7dfa0",
 "src/battle/elements.js?v=82bbc7dfa0",
 "src/world/wadi.js?v=82bbc7dfa0",
 "src/ui/bestiary.js?v=82bbc7dfa0",
 "src/world/fort.js?v=82bbc7dfa0",
 "src/ui/minimap.js?v=82bbc7dfa0",
 "src/core/save.js?v=82bbc7dfa0",
 "src/ui/menu.js?v=82bbc7dfa0",
 "src/boot.js?v=82bbc7dfa0"
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

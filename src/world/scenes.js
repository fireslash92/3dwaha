// سجل المشاهد
'use strict';

/* =========================================================
   SCENES
   ========================================================= */
const SCENES={village:{id:'village',W:VW,H:VH,bg:'#22301a',colliders:MAP.colliders,buildGround:S=>buildVillageGround(S),statics:null}};
Object.keys(INTERIORS).forEach(id=>{
  const cfg=INTERIORS[id];
  SCENES[id]={id,W:IW,H:IH,bg:'#120b07',interior:true,cfg,house:MAP.houses.find(q=>q.id===id),colliders:interiorColliders(cfg),buildGround:S=>buildInteriorGround(S,cfg),statics:null};
});
let scene=SCENES.village;
function ensureScene(sc){
  if(!sc.ground||sc.groundS!==view.S){sc.ground=sc.buildGround(view.S);sc.groundS=view.S;}
  if(!sc.statics)sc.statics=sc.area?areaStatics(sc):sc.interior?interiorStatics(sc.cfg):sc.forest?forestStatics():sc.wadi?wadiStatics():sc.fort?fortStatics():villageStatics();
}

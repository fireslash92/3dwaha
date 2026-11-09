// نقاط الضعف والحالات وأعداء الوادي
'use strict';

/* =========================================================
   ELEMENTS, STATUS EFFECTS, BESTIARY DATA
   ========================================================= */
const EL_NAMES={phys:'الضرب',fire:'النار',sand:'الرمل'};
Object.assign(ENEMIES.lizard,{weak:'fire'});
Object.assign(ENEMIES.bat,{weak:'sand'});
Object.assign(ENEMIES.wolf,{weak:'fire'});
Object.assign(ENEMIES.wisp,{weak:'sand',resist:'fire'});
Object.assign(ENEMIES.guardian,{resist:'sand'});
Object.assign(ENEMIES,{
  scorpion:{name:'عقرب الوادي',hp:46,atk:14,def:12,agi:8,xp:34,gold:28,weak:'sand',resist:'phys',drop:['honey',.18],move:['لدغة سامة',.4,1.1],status:'poison'},
  viper:{name:'أفعى الرمل',hp:40,atk:13,mag:12,def:8,agi:13,xp:32,gold:26,weak:'fire',drop:['dates',.3],move:['نفث النعاس',.3,1],status:'sleep'},
  serpent:{name:'حيّة العين',hp:500,atk:16,mag:17,def:11,agi:9,xp:450,gold:400,weak:'fire',resist:'sand',boss:true,move:['',0,1]},
});
ITEMS.honey={name:'عسل السدر',use:'cure',amount:20,icon:'honey',col:'#d99a2b',price:60,desc:'يشفي من السمّ والنعاس، ويعيد ٢٠ من الصحة.'};
ITEMS.shard2={name:'شظية النجمة الثانية',key:true,icon:'gem',col:'#5fa0dc',desc:'وجدتها في عين الفلج. تتوهج بلون الماء.'};
ITEMS.silverblade={name:'خنجر الفضة',slot:'weapon',icon:'dagger',col:'#9aa6ae',stats:{atk:8,agi:2,luk:1},desc:'خنجر قديم وجدته عند عين الفلج، عليه نقش نجمة.'};
SHOP.saeed.stock.splice(5,0,'honey');
const BEAST_ORDER=['lizard','bat','wolf','wisp','scorpion','viper','guardian','serpent'];
function noteLore(type,el){P.lore=P.lore||{};(P.lore[type]=P.lore[type]||{})[el]=1;}
function elemMult(e,el){
  const m=e.d.weak===el?1.5:e.d.resist===el?.6:1;
  if(m!==1){noteLore(e.type,el);popup(e.x,eTop(e)-18,m>1?'نقطة ضعف!':'مقاومة','#ffd36b');}
  return m*wxElem(el);
}

// حالة اللعب
'use strict';

/* =========================================================
   STATE
   ========================================================= */
const hero={x:MAP.heroSpawn.x,y:MAP.heroSpawn.y,dir:'up',phase:0,moving:false,blinkAt:2};
let state='title';   // title | play | dialog | fade | chapter
let page=0,time=0,talkCooldown=0,inForest=false;
let target=null,talkNpc=null,lines=[];
const met=new Set();
let questStarted=false,chapterDone=false,doorHintShown=false;
const keys={up:false,down:false,left:false,right:false};

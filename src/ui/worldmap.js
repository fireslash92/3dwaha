// خريطة القوافل: السفر بين عين الوادي والمدن العشر التي زرتها، والمدن القادمة تظهر مجهولة
'use strict';

/* every place on the caravan map: chapter, where it sits (0..100), and how to arrive */
const PLACES=[
  {id:'village',name:'عين الوادي',ch:0,x:50,y:66,arrive:{scene:'village',x:1040,y:470,dir:'left'}},
  {id:'sidr',name:'حلّة السدر',ch:5,x:34,y:44,region:'جبال الغيم'},
  {id:'ghaim',name:'رأس الغيم',ch:5,x:24,y:24,region:'جبال الغيم'},
  {id:'qurm',name:'قرية القرم',ch:6,x:74,y:40,region:'مستنقعات القرم'},
  {id:'lulu',name:'مرسى اللؤلؤ',ch:6,x:88,y:28,region:'مستنقعات القرم'},
  {id:'manjam',name:'بيت المنجم',ch:7,x:62,y:80,region:'مغارات الجن'},
  {id:'abraj',name:'مدينة الأبراج',ch:7,x:78,y:88,region:'مغارات الجن'},
  {id:'dabab',name:'عين الضباب',ch:8,x:18,y:78,region:'غابات الخريف'},
  {id:'luban',name:'سوق اللبان',ch:8,x:10,y:92,region:'غابات الخريف'},
  {id:'rih',name:'حصن الريح',ch:9,x:44,y:10,region:'أرض المدن المتحاربة'},
  {id:'bayda',name:'المدينة البيضاء',ch:9,x:66,y:12,region:'أرض المدن المتحاربة'},
];
const placeOpen=p=>p.id==='village'||!!P.flags['town_'+p.id];
const placeKnown=p=>p.ch===0||!!P.flags['ch'+p.ch];
let mapEl=null;
function ensureMapEl(){
  if(mapEl)return mapEl;
  mapEl=document.createElement('div');mapEl.id='worldMap';mapEl.className='overlay';mapEl.hidden=true;mapEl.setAttribute('role','dialog');mapEl.setAttribute('aria-label','خريطة القوافل');
  mapEl.innerHTML=`<div class="map-panel"><div class="map-head"><div><b>خريطة القوافل</b><small>اختر وجهة زرتها من قبل، وستأخذك القافلة إليها</small></div><button type="button" class="btn ghost" data-mapclose>إغلاق</button></div><div class="map-wrap"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"></svg><div class="map-pins"></div></div></div>`;
  gameEl.appendChild(mapEl);
  mapEl.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.mapclose!==undefined){closeWorldMap();return;}
    const p=PLACES.find(q=>q.id===b.dataset.place);if(!p)return;
    if(!placeOpen(p)){SFX.play('error');return;}travelTo(p);});
  return mapEl;
}
function mapSvg(){
  const lines=[['village','sidr'],['sidr','ghaim'],['village','qurm'],['qurm','lulu'],['village','manjam'],['manjam','abraj'],['village','dabab'],['dabab','luban'],['ghaim','rih'],['rih','bayda'],['lulu','bayda']];
  const at=id=>PLACES.find(p=>p.id===id);
  return `<defs><radialGradient id="sea" cx="50%" cy="50%" r="70%"><stop offset="0" stop-color="#e9d7ae"/><stop offset="1" stop-color="#c9ab76"/></radialGradient></defs>
  <rect width="100" height="100" fill="#5f97ad"/><path d="M6 8 Q30 2 58 6 Q86 4 94 18 Q98 40 92 58 Q96 80 84 96 Q50 99 20 96 Q4 86 5 60 Q2 30 6 8Z" fill="url(#sea)" stroke="#8a6a3e" stroke-width=".6"/>
  <g fill="#a7896a" opacity=".8">${[[22,30],[28,36],[32,26],[40,14],[48,18]].map(([x,y])=>`<path d="M${x-5} ${y+3} L${x} ${y-4} L${x+5} ${y+3}Z"/><path d="M${x-2} ${y-1.5} L${x} ${y-4} L${x+2} ${y-1.5}Z" fill="#f4f8fa"/>`).join('')}</g>
  <g fill="#4f7a3c" opacity=".55">${[[14,82],[20,88],[10,74],[24,80]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3"/>`).join('')}</g>
  <g fill="#6f8a5c" opacity=".55">${[[76,44],[82,36],[70,46]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="4" ry="2"/>`).join('')}</g>
  <g stroke="#7a5a32" stroke-width=".5" stroke-dasharray="1.4 1.2" fill="none">${lines.map(([a,b])=>{const A=at(a),B2=at(b);return `<path d="M${A.x} ${A.y} Q${(A.x+B2.x)/2+4} ${(A.y+B2.y)/2-3} ${B2.x} ${B2.y}" opacity="${placeKnown(B2)?1:.35}"/>`;}).join('')}</g>`;
}
function renderWorldMap(){
  const el=ensureMapEl(),here=scene.interior?'village':scene.id;
  el.querySelector('svg').innerHTML=mapSvg();
  el.querySelector('.map-pins').innerHTML=PLACES.map(p=>{
    const open=placeOpen(p),known=placeKnown(p),cur=p.id===here||(p.id==='village'&&SCENES[here]&&!SCENES[here].area);
    return `<button type="button" class="pin${open?' open':''}${cur?' here':''}" data-place="${p.id}" style="left:${p.x}%;top:${p.y}%"${open?'':' aria-disabled="true"'}><i></i><span>${known?p.name:'؟؟؟'}${cur?' <em>أنت هنا</em>':''}${!known?` <em>الفصل ${AR(p.ch)}</em>`:!open?' <em>لم تزرها بعد</em>':''}</span></button>`;}).join('');
}
function openWorldMap(){
  if(state!=='play')return;
  state='worldmap';resetInput();SFX.play('menuOpen');renderWorldMap();ensureMapEl().hidden=false;gameEl.classList.add('talking');
}
function closeWorldMap(){if(state!=='worldmap')return;SFX.play('menuClose');mapEl.hidden=true;gameEl.classList.remove('talking');state='play';talkCooldown=.4;}
function travelTo(p){
  closeWorldMap();
  const here=scene.id;if(p.id===here){return;}
  const a=p.arrive||(SCENES[p.id]&&SCENES[p.id].area&&{scene:p.id,...SCENES[p.id].area.arrive});
  SFX.play('crowd');showToast('note',`سافرتم مع القافلة إلى ${p.name}`,2);
  goTo(a.scene,a.x,a.y,a.dir||'down',p.name);
}
window.addEventListener('keydown',e=>{if(state==='worldmap'&&(e.code==='Escape'||e.code==='KeyM')){e.preventDefault();e.stopImmediatePropagation();closeWorldMap();}},true);

// المؤثرات والموسيقى المولّدة
'use strict';

/* =========================================================
   SOUND: every effect is synthesized live with Web Audio (no files)
   ========================================================= */
const SFX=(()=>{
  let ac=null,master,sfxBus,ambBus,musicBus,noiseBuf,fountain=null,amb={bird:2,cricket:1,owl:8,crackle:.3,tink:3},stepIdx=0;
  const VOL={low:.35,mid:.65,high:1};
  let keepEl=null;
  function silentWav(){ // 0.25 s of 8-bit silence, used to move older iOS out of the "ambient" audio category
    const n=2000,buf=new Uint8Array(44+n),v=new DataView(buf.buffer),w=(o,str)=>{for(let i=0;i<str.length;i++)buf[o+i]=str.charCodeAt(i);};
    w(0,'RIFF');v.setUint32(4,36+n,true);w(8,'WAVEfmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);
    v.setUint32(24,8000,true);v.setUint32(28,8000,true);v.setUint16(32,1,true);v.setUint16(34,8,true);w(36,'data');v.setUint32(40,n,true);buf.fill(128,44);
    let bin='';for(let i=0;i<buf.length;i++)bin+=String.fromCharCode(buf[i]);return 'data:audio/wav;base64,'+btoa(bin);
  }
  function playbackSession(){
    // iOS mutes Web Audio with the ring/silent switch unless the page asks for "playback"
    try{if(navigator.audioSession){navigator.audioSession.type=OPT.sound==='off'?'ambient':'playback';return;}}catch(_){}
    if(!/iP(hone|ad|od)|Macintosh/.test(navigator.userAgent)||!('ontouchend' in document))return;
    if(OPT.sound==='off'){if(keepEl)keepEl.pause();return;}
    try{if(!keepEl){keepEl=document.createElement('audio');keepEl.setAttribute('playsinline','');keepEl.setAttribute('x-webkit-airplay','deny');keepEl.loop=true;keepEl.preload='auto';keepEl.src=silentWav();}
      if(keepEl.paused){const pr=keepEl.play();if(pr&&pr.catch)pr.catch(()=>{});}}catch(_){}
  }
  function unlock(){
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    playbackSession();
    if(!ac){
      try{ac=new C();}catch(_){ac=null;return;}
      master=ac.createGain();const comp=ac.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=4;
      master.connect(comp);comp.connect(ac.destination);
      sfxBus=ac.createGain();ambBus=ac.createGain();musicBus=ac.createGain();musicBus.gain.value=0;sfxBus.connect(master);ambBus.connect(master);musicBus.connect(master);
      noiseBuf=ac.createBuffer(1,ac.sampleRate,ac.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
      applyVolume();
    }
    if(ac.state!=='running'){
      try{const p=ac.resume();if(p&&p.catch)p.catch(()=>{});}catch(_){}
      try{const s=ac.createBufferSource();s.buffer=ac.createBuffer(1,1,22050);s.connect(ac.destination);s.start(0);}catch(_){}
    }
  }
  function test(){unlock();if(ac&&ac.state==='running'&&OPT.sound!=='off')S.quest();return ac?ac.state:'none';}
  function applyVolume(){if(!ac)return;const on=OPT.sound!=='off';master.gain.setTargetAtTime(on?VOL[OPT.volume]||.65:0,ac.currentTime,.03);ambBus.gain.setTargetAtTime(OPT.ambient==='off'?0:.9,ac.currentTime,.1);musicBus.gain.setTargetAtTime(OPT.music==='off'?0:.42,ac.currentTime,.2);}
  const ready=()=>ac&&ac.state==='running'&&OPT.sound!=='off';
  function out(node,pan,bus){
    if(pan&&ac.createStereoPanner){const p=ac.createStereoPanner();p.pan.value=clamp(pan,-1,1);node.connect(p);p.connect(bus||sfxBus);}else node.connect(bus||sfxBus);
  }
  function tone(o){
    const t=ac.currentTime+(o.d||0),a=o.a||.005,dur=o.dur||.12,osc=ac.createOscillator(),g=ac.createGain();
    osc.type=o.type||'sine';osc.frequency.setValueAtTime(o.f,t);if(o.f2)osc.frequency.exponentialRampToValueAtTime(o.f2,t+(o.slide||dur));
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(o.v||.15,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+dur);
    let n=osc;if(o.lp){const f=ac.createBiquadFilter();f.type='lowpass';f.frequency.value=o.lp;osc.connect(f);n=f;}
    n.connect(g);out(g,o.pan,o.bus);osc.start(t);osc.stop(t+a+dur+.05);
  }
  function noise(o){
    const t=ac.currentTime+(o.d||0),a=o.a||.005,dur=o.dur||.1,src=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();
    src.buffer=noiseBuf;src.loop=true;f.type=o.type||'bandpass';f.frequency.setValueAtTime(o.f||1000,t);if(o.f2)f.frequency.exponentialRampToValueAtTime(o.f2,t+a+dur);f.Q.value=o.q||1;
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(o.v||.15,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+dur);
    src.connect(f);f.connect(g);out(g,o.pan,o.bus);src.start(t,Math.random()*.8);src.stop(t+a+dur+.05);
  }
  const arp=(notes,step,o)=>notes.forEach((f,i)=>tone(Object.assign({f,d:(o.d||0)+i*step},o,{d:(o.d||0)+i*step})));
  const S={
    tap:()=>{tone({f:880,type:'triangle',dur:.05,v:.1});tone({f:1320,type:'triangle',dur:.04,v:.04,d:.02});},
    tab:()=>tone({f:660,type:'triangle',dur:.05,v:.09}),
    cancel:()=>tone({f:520,f2:360,type:'triangle',dur:.09,v:.09}),
    menuOpen:()=>{noise({type:'highpass',f:2500,f2:6000,dur:.12,v:.03});arp([523,784],.06,{type:'triangle',dur:.14,v:.11});},
    menuClose:()=>{noise({type:'highpass',f:5000,f2:2000,dur:.1,v:.025});arp([784,523],.06,{type:'triangle',dur:.12,v:.1});},
    equip:()=>{tone({f:1568,dur:.25,v:.08});tone({f:2093,dur:.2,v:.06,d:.03});tone({f:392,type:'triangle',dur:.06,v:.1});},
    unequip:()=>arp([784,523],.06,{dur:.09,v:.08}),
    error:()=>{tone({f:180,type:'square',dur:.09,v:.06,lp:900});tone({f:150,type:'square',dur:.12,v:.06,lp:900,d:.1});},
    confirm:()=>arp([784,1175],.07,{type:'triangle',dur:.14,v:.1}),
    dlgOpen:()=>{tone({f:660,f2:990,dur:.12,v:.1});noise({type:'highpass',f:3000,dur:.05,v:.02});},
    dlgNext:()=>tone({f:1046,type:'triangle',dur:.04,v:.07}),
    dlgClose:()=>tone({f:880,f2:520,dur:.1,v:.08}),
    quest:()=>arp([1046,1318,1568],.07,{dur:.28,v:.08}),
    itemGet:o=>arp([784,988,1175,1568],.08,{type:'triangle',dur:.2,v:.1,d:o.d||0}),
    levelUp:o=>{const d=o.d||0;arp([523,659,784,1046],.07,{type:'square',lp:2400,dur:.12,v:.05,d});[523,659,784,1046].forEach(f=>tone({f,type:'triangle',dur:.8,v:.05,d:d+.32}));},
    fanfare:()=>{arp([392,523,659],.1,{type:'square',lp:2200,dur:.12,v:.05});tone({f:784,type:'square',lp:2200,dur:.7,v:.06,d:.3});[392,523,659].forEach(f=>tone({f,type:'triangle',dur:.9,v:.04,d:.3}));arp([880,988,1046],.12,{type:'triangle',dur:.3,v:.06,d:1.05});},
    start:()=>arp([659,784,988,1318],.08,{type:'triangle',dur:.3,v:.09}),
    doorOpen:()=>{tone({f:170,f2:260,type:'sawtooth',lp:800,dur:.35,v:.05,slide:.3});tone({f:230,f2:190,type:'sawtooth',lp:700,dur:.15,v:.035,d:.28});noise({type:'bandpass',f:500,q:2,dur:.3,v:.04});tone({f:95,f2:50,dur:.16,v:.22,d:.36});},
    doorClose:()=>{tone({f:115,f2:45,dur:.18,v:.28});noise({type:'lowpass',f:400,dur:.1,v:.12});},
    rustle:()=>{for(let i=0;i<5;i++)noise({type:'bandpass',f:2400+Math.random()*1500,q:1.5,dur:.08,v:.05,d:i*.07,pan:Math.random()-.5});},
    blocked:()=>{tone({f:200,f2:120,dur:.06,v:.12});tone({f:200,f2:120,dur:.06,v:.1,d:.12});},
    water:()=>{for(let i=0;i<7;i++)tone({f:420+Math.random()*300,f2:1100+Math.random()*500,dur:.06,v:.05,d:i*.06+Math.random()*.03});arp([1568,2093,2637],.08,{dur:.3,v:.04,d:.35});},
    mystic:()=>arp([523,659,784,988],.22,{dur:1,v:.05,a:.08}),
    step:o=>{
      const k=o.kind,p=o.pan||0;
      if(k==='stone'){noise({type:'bandpass',f:2800,q:2,dur:.03,v:.045,pan:p});tone({f:210,f2:120,dur:.03,v:.025,pan:p});}
      else if(k==='wood'){tone({f:150,f2:90,dur:.06,v:.06,pan:p});noise({type:'lowpass',f:600,dur:.04,v:.04,pan:p});}
      else if(k==='dirt'){noise({type:'bandpass',f:900,q:.8,dur:.06,v:.05,pan:p});noise({type:'bandpass',f:3000,q:1,dur:.04,v:.015,pan:p,d:.02});}
      else noise({type:'bandpass',f:1700,q:.7,dur:.055,v:.035,pan:p});
    },
    voice:o=>{const n=o.n||4;for(let i=0;i<n;i++)tone({f:o.f*(1+(Math.random()-.4)*.28),type:'triangle',lp:2200,dur:.045,v:.06,d:i*.075});},
    encounter:()=>{noise({type:'highpass',f:300,f2:6000,dur:.4,v:.12});tone({f:220,type:'square',lp:1400,dur:.3,v:.05,d:.35});tone({f:233,type:'square',lp:1400,dur:.3,v:.05,d:.35});tone({f:330,type:'sawtooth',lp:1600,dur:.45,v:.05,d:.55});},
    swing:()=>noise({type:'bandpass',f:700,f2:2600,q:1.2,dur:.14,v:.13}),
    hit:()=>{noise({type:'lowpass',f:1400,dur:.08,v:.28});tone({f:150,f2:60,dur:.12,v:.32});},
    crit:()=>{noise({type:'lowpass',f:2200,dur:.1,v:.32});tone({f:170,f2:55,dur:.16,v:.36});tone({f:1760,type:'triangle',dur:.18,v:.07,d:.02});noise({type:'highpass',f:4500,dur:.08,v:.06});},
    miss:()=>noise({type:'bandpass',f:1600,f2:500,q:1,dur:.18,v:.07}),
    hiss:()=>noise({type:'highpass',f:3200,a:.04,dur:.28,v:.06}),
    growl:()=>{tone({f:85,f2:70,type:'sawtooth',lp:420,a:.05,dur:.3,v:.09});},
    bite:()=>{noise({type:'bandpass',f:1300,q:2,dur:.05,v:.25});tone({f:95,type:'square',lp:600,dur:.08,v:.12});},
    screech:()=>{tone({f:2300,f2:3400,type:'square',lp:5000,dur:.09,v:.03});tone({f:3200,f2:2500,type:'square',lp:5000,dur:.1,v:.03,d:.09});},
    eMagic:()=>{tone({f:880,f2:1760,dur:.3,v:.06});tone({f:1320,f2:660,type:'triangle',dur:.3,v:.04,d:.1});},
    hurt:()=>{tone({f:240,f2:110,type:'square',lp:1000,dur:.14,v:.09});noise({type:'lowpass',f:900,dur:.06,v:.15});},
    shield:()=>{tone({f:1180,type:'triangle',dur:.25,v:.07});tone({f:1770,dur:.2,v:.05});noise({type:'highpass',f:5000,dur:.06,v:.04});},
    buff:()=>{tone({f:392,f2:784,dur:.4,v:.08,slide:.35});tone({f:588,f2:1176,type:'triangle',dur:.4,v:.04,slide:.35,d:.05});},
    fire:()=>{noise({type:'bandpass',f:900,f2:280,q:.8,dur:.45,v:.2});for(let i=0;i<6;i++)noise({type:'highpass',f:3000,dur:.02,v:.06,d:.05+Math.random()*.35});},
    heal:()=>{arp([784,988,1318,1568,2093],.05,{dur:.3,v:.06});noise({type:'highpass',f:6000,dur:.4,v:.015});},
    sand:()=>{noise({type:'bandpass',f:1800,f2:900,q:.6,a:.15,dur:.6,v:.18});noise({type:'highpass',f:4000,a:.1,dur:.5,v:.04});},
    special:()=>{tone({f:200,f2:1200,dur:.3,v:.06});tone({f:70,f2:32,dur:.7,v:.45,d:.3});noise({type:'lowpass',f:900,dur:.55,v:.28,d:.3});arp([523,784,1046],.05,{type:'square',lp:2600,dur:.3,v:.04,d:.32});},
    poof:()=>{noise({type:'bandpass',f:1500,f2:300,dur:.3,v:.12});tone({f:600,f2:150,dur:.25,v:.06});},
    potion:()=>{tone({f:300,f2:620,dur:.07,v:.1});tone({f:320,f2:660,dur:.07,v:.1,d:.11});arp([1318,1760],.06,{dur:.2,v:.05,d:.24});},
    flee:()=>{for(let i=0;i<4;i++)noise({type:'bandpass',f:1000,q:.9,dur:.05,v:.07,d:i*.09});noise({type:'highpass',f:1500,f2:5000,dur:.25,v:.05,d:.3});},
    victory:()=>{arp([523,659,784,1046],.09,{type:'square',lp:2400,dur:.12,v:.05});tone({f:988,type:'square',lp:2400,dur:.18,v:.05,d:.4});tone({f:1046,type:'square',lp:2400,dur:.7,v:.06,d:.58});[523,659,784].forEach(f=>tone({f,type:'triangle',dur:.8,v:.04,d:.58}));},
    coin:()=>{tone({f:1975,type:'square',lp:4000,dur:.06,v:.05});tone({f:2637,type:'square',lp:4000,dur:.3,v:.05,d:.07});},
    anvil:()=>{[0,.22,.44].forEach((d,i)=>{noise({type:'bandpass',f:3200,q:4,dur:.05,v:.12,d});tone({f:1480+i*120,dur:.35,v:.06,d});});arp([784,1046,1318],.07,{type:'triangle',dur:.25,v:.07,d:.7});},
    bossIntro:()=>{tone({f:55,f2:45,type:'sawtooth',lp:300,a:.3,dur:1.4,v:.12});noise({type:'highpass',f:200,f2:5000,a:.4,dur:.9,v:.1});arp([294,311,370,392],.18,{type:'square',lp:1400,dur:.4,v:.05,d:.6});},
    bossRoar:()=>{tone({f:140,f2:70,type:'sawtooth',lp:800,a:.05,dur:.7,v:.14});noise({type:'bandpass',f:600,f2:200,q:.7,a:.05,dur:.7,v:.14});},
    bleat:o=>{const f=o.kid?560:380,v=.05*(o.vol??1);for(let i=0;i<3;i++)tone({f:f*(1+(i%2)*.06),f2:f*(.92+(i%2)*.1),type:'sawtooth',lp:1800,a:.02,dur:.13,v,d:i*.12,pan:o.pan});},
    cluck:o=>{const v=.035*(o.vol??1);[760,880,700].forEach((f,i)=>tone({f,f2:f*.8,type:'square',lp:2600,dur:.04,v,d:i*.08,pan:o.pan}));},
    crow:o=>{const v=.04*(o.vol??1);tone({f:520,f2:900,type:'sawtooth',lp:2400,a:.03,dur:.25,v,pan:o.pan,slide:.2});tone({f:900,f2:600,type:'sawtooth',lp:2400,dur:.45,v,d:.27,pan:o.pan});},
    meow:o=>{const v=.04*(o.vol??1);tone({f:620,f2:920,type:'triangle',lp:2600,a:.03,dur:.18,v,pan:o.pan,slide:.15});tone({f:920,f2:520,type:'triangle',lp:2600,dur:.22,v,d:.17,pan:o.pan});},
    flap:o=>{const v=.06*(o.vol??1);for(let i=0;i<7;i++)noise({type:'bandpass',f:900+Math.random()*700,q:1.2,dur:.035,v,d:i*.05,pan:o.pan});},
    thunder:o=>{const v=o.vol??1;noise({type:'highpass',f:1800,dur:.12,v:.08*v});noise({type:'lowpass',f:420,f2:90,a:.05,dur:2.6,v:.32*v,pan:Math.random()-.5});noise({type:'lowpass',f:200,a:.4,dur:2.2,v:.22*v,d:.5});tone({f:55,f2:38,a:.1,dur:1.6,v:.12*v});},
    hoof:o=>{const v=o.vol??1;tone({f:95,f2:55,dur:.07,v:.16*v});noise({type:'lowpass',f:700,dur:.05,v:.08*v});tone({f:85,f2:50,dur:.06,v:.1*v,d:.12});},
    perfect:()=>{tone({f:1568,type:'triangle',dur:.1,v:.07});tone({f:2093,type:'triangle',dur:.12,v:.05,d:.05});},
    stumble:()=>{tone({f:160,f2:60,dur:.2,v:.22});noise({type:'lowpass',f:900,dur:.25,v:.16});noise({type:'bandpass',f:2000,dur:.15,v:.05,d:.1});},
    crowd:()=>{for(let i=0;i<3;i++)noise({type:'bandpass',f:900+i*500,q:.7,a:.25,dur:1.3,v:.05,d:i*.1,pan:i-1});for(let i=0;i<6;i++)tone({f:900+Math.random()*700,f2:1300+Math.random()*600,type:'triangle',dur:.12,v:.02,d:.2+i*.12+Math.random()*.1,pan:Math.random()-.5});},
    beep:()=>tone({f:880,type:'square',lp:2000,dur:.12,v:.06}),
    go:()=>{tone({f:1318,type:'square',lp:2600,dur:.35,v:.07});tone({f:1760,type:'triangle',dur:.3,v:.05,d:.02});},
    cast:()=>{noise({type:'bandpass',f:900,f2:3200,q:1.2,dur:.3,v:.07});tone({f:1800,f2:900,type:'triangle',dur:.2,v:.025,d:.05});},
    plop:()=>{tone({f:520,f2:180,dur:.09,v:.12});noise({type:'bandpass',f:900,q:1.5,dur:.08,v:.05,d:.02});},
    nibble:()=>{tone({f:700,f2:400,dur:.04,v:.06});},
    bite:()=>{noise({type:'bandpass',f:1200,f2:500,q:1.2,dur:.18,v:.12});tone({f:1318,type:'triangle',dur:.12,v:.08,d:.02});tone({f:1760,type:'triangle',dur:.16,v:.07,d:.09});},
    hook:()=>{tone({f:300,f2:900,type:'triangle',dur:.12,v:.08});noise({type:'highpass',f:2500,dur:.06,v:.04});},
    reel:()=>noise({type:'bandpass',f:3400,q:4,dur:.018,v:.035}),
    splash:()=>{noise({type:'bandpass',f:1300,f2:600,q:1.2,dur:.14,v:.09});for(let i=0;i<3;i++)tone({f:700+Math.random()*500,f2:1400,dur:.04,v:.025,d:.03+i*.04});},
    grunt:o=>{const v=.06*(o.vol??1);tone({f:110,f2:78,type:'sawtooth',lp:520,a:.04,dur:.45,v,pan:o.pan});noise({type:'lowpass',f:500,a:.04,dur:.3,v:v*.6,pan:o.pan});},
    defeat:()=>arp([392,349,311,262],.28,{type:'triangle',lp:1600,dur:.5,v:.08}),
  };
  function play(name,o){if(!ready()||!S[name])return;try{S[name](o||{});}catch(err){(window.__sfxErr=window.__sfxErr||[]).push(name+': '+err.message);}}
  const names=()=>Object.keys(S);
  const VOICES={mubarak:165,peddler:150,salem:140,saeed:175,rashid:160,hamad:330,mariam:280,shamsa:400,ummsaeed:235,aisha:300,zuwaina:215};
  function voice(n,text){if(!n)return;if(n.portrait){play('mystic');return;}play('voice',{f:VOICES[n.id]||220,n:Math.min(6,Math.max(2,Math.ceil(text.length/12)))});}
  function step(kind,pan){play('step',{kind,pan});}
  /* ---- music: original tunes in Arabic maqamat (bayati for the village, hijaz for danger) ---- */
  const mf=m=>440*Math.pow(2,(m-69)/12);
  function mPluck(t,m,dur,v,bus){ // oud-like pluck
    const f=mf(m),o1=ac.createOscillator(),o2=ac.createOscillator(),g=ac.createGain(),g2=ac.createGain(),lp=ac.createBiquadFilter();
    o1.type='triangle';o1.frequency.value=f;o2.type='sine';o2.frequency.value=f*2;g2.gain.value=.25;lp.type='lowpass';lp.frequency.setValueAtTime(3200,t);lp.frequency.exponentialRampToValueAtTime(900,t+dur);
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.006);g.gain.exponentialRampToValueAtTime(.0001,t+Math.max(.25,dur*1.4));
    o1.connect(lp);o2.connect(g2);g2.connect(lp);lp.connect(g);g.connect(bus);o1.start(t);o2.start(t);o1.stop(t+dur*1.5+.3);o2.stop(t+dur*1.5+.3);
  }
  function mPad(t,m,dur,v,bus){
    [-4,4].forEach(c=>{const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.value=mf(m);o.detune.value=c;
      g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+Math.min(.8,dur*.3));g.gain.setValueAtTime(v,t+dur*.7);g.gain.exponentialRampToValueAtTime(.0001,t+dur+.4);
      o.connect(g);g.connect(bus);o.start(t);o.stop(t+dur+.5);});
  }
  function mBell(t,m,v,bus){[[1,v],[2.76,v*.25]].forEach(([k,vv])=>{const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=mf(m)*k;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vv,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+1.8);o.connect(g);g.connect(bus);o.start(t);o.stop(t+1.9);});}
  function mLead(t,m,dur,v,bus){const o=ac.createOscillator(),g=ac.createGain(),lp=ac.createBiquadFilter();o.type='sawtooth';o.frequency.value=mf(m);lp.type='lowpass';lp.frequency.value=1700;
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.02);g.gain.setValueAtTime(v*.8,t+dur*.8);g.gain.exponentialRampToValueAtTime(.0001,t+dur+.05);o.connect(lp);lp.connect(g);g.connect(bus);o.start(t);o.stop(t+dur+.1);}
  function mBass(t,m,dur,v,bus){const o=ac.createOscillator(),g=ac.createGain(),lp=ac.createBiquadFilter();o.type='triangle';o.frequency.value=mf(m);lp.type='lowpass';lp.frequency.value=700;
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(lp);lp.connect(g);g.connect(bus);o.start(t);o.stop(t+dur+.05);}
  function mDrum(t,k,v,bus){
    if(k==='d'){const o=ac.createOscillator(),g=ac.createGain();o.frequency.setValueAtTime(120,t);o.frequency.exponentialRampToValueAtTime(52,t+.16);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.005);g.gain.exponentialRampToValueAtTime(.0001,t+.22);o.connect(g);g.connect(bus);o.start(t);o.stop(t+.25);return;}
    const src=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();src.buffer=noiseBuf;f.type=k==='t'?'bandpass':'highpass';f.frequency.value=k==='t'?2600:6000;f.Q.value=1.4;
    const len=k==='t'?.07:.03;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v*(k==='t'?.7:.35),t+.003);g.gain.exponentialRampToValueAtTime(.0001,t+len);src.connect(f);f.connect(g);g.connect(bus);src.start(t,Math.random()*.5);src.stop(t+len+.02);
  }
  const E=63.5; // E half-flat, the bayati quarter tone
  const TRACKS={
    village:{bpm:92,len:128,ev:[]},forest:{bpm:62,len:128,ev:[]},battle:{bpm:140,len:128,ev:[]},
    night:{bpm:70,len:128,ev:[]},race:{bpm:110,len:64,ev:[]},wadi:{bpm:84,len:128,ev:[]},fort:{bpm:60,len:128,ev:[]},boss:{bpm:150,len:128,ev:[]}};
  (()=>{
    const V=TRACKS.village.ev;
    [[0,69,4],[4,67,2],[6,65,2],[8,67,4],[12,69,4],[16,70,2],[18,69,2],[20,67,4],[24,65,2],[26,E,2],[28,62,4],
     [32,65,4],[36,67,2],[38,69,2],[40,70,4],[44,72,4],[48,70,2],[50,69,2],[52,67,4],[56,69,8],
     [64,74,4],[68,72,2],[70,70,2],[72,69,4],[76,67,4],[80,65,2],[82,67,2],[84,69,4],[88,67,2],[90,65,2],[92,E,4],
     [96,65,4],[100,E,2],[102,62,2],[104,E,4],[108,65,4],[112,E,2],[114,62,2],[116,62,12]].forEach(([s,m,l])=>V.push({s,i:'pluck',m,l,v:.09}));
    for(let b=0;b<8;b++){const s=b*16;[[0,'d'],[2,'t'],[6,'t'],[8,'d'],[12,'t']].forEach(([o,k])=>V.push({s:s+o,i:'drum',k,v:.13}));
      [[0,38],[6,38],[8,45],[12,38]].forEach(([o,m])=>V.push({s:s+o,i:'pluck',m,l:3,v:.07}));}
    [0,32,64,96].forEach(s=>{V.push({s,i:'pad',m:50,l:32,v:.022});V.push({s,i:'pad',m:57,l:32,v:.016});});
    const F=TRACKS.forest.ev;
    [[0,[50,53,57]],[32,[46,50,53]],[64,[43,46,50]],[96,[45,49,52]]].forEach(([s,ch])=>ch.forEach(m=>F.push({s,i:'pad',m,l:32,v:.02})));
    [[0,74],[12,77],[24,76],[40,74],[52,73],[64,70],[78,74],[92,69],[104,73],[116,76]].forEach(([s,m])=>F.push({s,i:'bell',m,v:.035}));
    [0,64].forEach(s=>F.push({s,i:'drum',k:'d',v:.06}));
    const Bt=TRACKS.battle.ev;
    for(let b=0;b<8;b++){const s=b*16,r=b%4<2?38:43;
      [[0,0],[3,0],[6,0],[8,1],[10,0],[12,-2],[14,0]].forEach(([o,d])=>Bt.push({s:s+o,i:'bass',m:r+d,l:.22,v:.13}));
      [[0,'d'],[4,'t'],[7,'d'],[8,'d'],[12,'t']].forEach(([o,k])=>Bt.push({s:s+o,i:'drum',k,v:.16}));
      [2,6,10,14].forEach(o=>Bt.push({s:s+o,i:'drum',k:'h',v:.12}));}
    const mel=[[0,74,3],[3,75,3],[6,78,2],[8,79,4],[12,78,2],[14,75,2],[16,74,6],[22,72,2],[24,70,4],[28,69,4],
      [32,67,3],[35,69,3],[38,70,2],[40,72,4],[44,70,2],[46,69,2],[48,70,2],[50,69,2],[52,67,2],[54,66,2],[56,67,8]];
    mel.forEach(([s,m,l])=>{Bt.push({s,i:'lead',m,l,v:.045});Bt.push({s:s+64,i:'lead',m:m+(s<32?0:0),l,v:.045});});
    /* village at night: the same bayati, slower and hushed, with bells like stars */
    const N=TRACKS.night.ev;
    [[0,62,6],[8,65,4],[12,E,4],[16,62,10],[32,65,6],[40,67,4],[44,69,4],[48,67,10],[64,69,6],[72,70,4],[76,69,4],[80,67,10],[96,65,4],[100,E,4],[104,62,4],[108,60,4],[112,62,14]].forEach(([s,m,l])=>N.push({s,i:'pluck',m,l,v:.065}));
    [[0,[50,57]],[32,[48,55]],[64,[46,53]],[96,[45,52]]].forEach(([s,ch])=>ch.forEach(m=>N.push({s,i:'pad',m,l:32,v:.018})));
    [[6,81],[26,79],[58,77],[90,81],[122,74]].forEach(([s,m])=>N.push({s,i:'bell',m,v:.022}));
    for(let b=0;b<8;b++)N.push({s:b*16,i:'drum',k:'d',v:.05});
    /* wadi: hijaz on D over a maqsum rhythm, like a caravan crossing the sand */
    const W=TRACKS.wadi.ev;
    [[0,74,4],[4,72,2],[6,70,2],[8,69,4],[12,70,2],[14,69,2],[16,67,4],[20,66,2],[22,63,2],[24,62,8],
     [32,62,2],[34,63,2],[36,66,4],[40,67,2],[42,69,2],[44,70,4],[48,69,2],[50,67,2],[52,66,2],[54,67,2],[56,69,8],
     [64,74,3],[67,75,1],[68,74,4],[72,72,2],[74,70,2],[76,72,4],[80,70,2],[82,69,2],[84,67,2],[86,66,2],[88,67,8],
     [96,66,2],[98,67,2],[100,69,2],[102,70,2],[104,69,4],[108,67,2],[110,66,2],[112,63,4],[116,62,12]].forEach(([s,m,l])=>W.push({s,i:'pluck',m,l,v:.085}));
    for(let b=0;b<8;b++){const s=b*16;[[0,'d'],[2,'t'],[6,'t'],[8,'d'],[12,'t'],[14,'h']].forEach(([o,k])=>W.push({s:s+o,i:'drum',k,v:.12}));
      [[0,38],[8,38],[11,39]].forEach(([o,m])=>W.push({s:s+o,i:'pluck',m,l:3,v:.06}));}
    [0,32,64,96].forEach(s=>{W.push({s,i:'pad',m:50,l:32,v:.02});W.push({s,i:'pad',m:57,l:32,v:.014});});
    /* fort: stone and old dust, a slow heartbeat and hijaz bells far away */
    const Fo=TRACKS.fort.ev;
    [[0,[38,45]],[32,[39,46]],[64,[38,45]],[96,[37,44]]].forEach(([s,ch])=>ch.forEach(m=>Fo.push({s,i:'pad',m,l:32,v:.03})));
    [[0,74],[10,75],[20,78],[34,74],[48,72],[62,70],[76,75],[90,74],[104,70],[116,69]].forEach(([s,m])=>Fo.push({s,i:'bell',m,v:.03}));
    for(let b=0;b<8;b++){const s=b*16;Fo.push({s,i:'drum',k:'d',v:.15});Fo.push({s:s+3,i:'drum',k:'d',v:.09});Fo.push({s:s+8,i:'pluck',m:b%4===1?51:50,l:6,v:.05});}
    /* camel race: a quick hijaz on the same tempo as the gait */
    const Ra=TRACKS.race.ev;
    for(let b=0;b<4;b++){const s=b*16;
      [[0,'d'],[4,'t'],[8,'d'],[10,'d'],[12,'t']].forEach(([o,k])=>Ra.push({s:s+o,i:'drum',k,v:.12}));[2,6,14].forEach(o=>Ra.push({s:s+o,i:'drum',k:'h',v:.1}));
      [[0,38],[4,38],[8,39],[12,42]].forEach(([o,m])=>Ra.push({s:s+o,i:'bass',m,l:.22,v:.11}));}
    [[0,74,2],[2,75,2],[4,78,2],[6,79,2],[8,81,4],[12,79,2],[14,78,2],[16,75,4],[20,74,4],[24,75,2],[26,78,2],[28,74,4],
     [32,79,2],[34,81,2],[36,82,4],[40,81,2],[42,79,2],[44,78,4],[48,75,2],[50,78,2],[52,79,2],[54,78,2],[56,74,8]].forEach(([s,m,l])=>Ra.push({s,i:'pluck',m,l,v:.08}));
    /* bosses: fast hijaz, driving bass and drums */
    const Bo=TRACKS.boss.ev;
    for(let b=0;b<8;b++){const s=b*16,up=b%4===3?5:0;
      [[0,38],[3,38],[6,39],[8,38],[10,42],[12,43],[14,42]].forEach(([o,m])=>Bo.push({s:s+o,i:'bass',m:m+up,l:.18,v:.15}));
      [[0,'d'],[3,'d'],[4,'t'],[8,'d'],[11,'d'],[12,'t']].forEach(([o,k])=>Bo.push({s:s+o,i:'drum',k,v:.17}));
      [2,6,10,14].forEach(o=>Bo.push({s:s+o,i:'drum',k:'h',v:.12}));}
    const bm=[[0,74,2],[2,75,2],[4,78,4],[8,79,2],[10,78,2],[12,75,2],[14,74,2],[16,72,4],[20,74,4],[24,75,8],
      [32,78,2],[34,79,2],[36,81,4],[40,82,4],[44,81,2],[46,79,2],[48,78,4],[52,75,4],[56,74,8]];
    bm.forEach(([s,m,l])=>{Bo.push({s,i:'lead',m,l,v:.045});Bo.push({s:s+64,i:'lead',m:m+(s>=32?-2:0),l,v:.05});});
    [0,32,64,96].forEach((s,i)=>[50,54,57].forEach(m=>Bo.push({s,i:'pad',m:m+(i===3?1:0),l:30,v:.016})));
    Object.values(TRACKS).forEach(T=>{T.at={};T.ev.forEach(e=>{(T.at[e.s]=T.at[e.s]||[]).push(e);});});
  })();
  const mus={name:null,g:null,step:0,next:0};
  function musicTick(){
    let want=null,lvl=1;
    if(state==='race'||RACE){want='race';}
    else if(state==='battle'||(state==='fade'&&B)){want=B&&B.ended?null:B&&B.boss?'boss':'battle';}
    else if(state==='title'||state==='chapter')want='village';
    else if(scene.forest)want='forest';
    else if(scene.wadi)want='wadi';
    else if(scene.fort)want='fort';
    else{want=nightAmount()>.6&&!scene.interior?'night':'village';if(scene.interior)lvl=.55;}
    if(want!==mus.name){
      if(mus.g){const og=mus.g;og.gain.setTargetAtTime(.0001,ac.currentTime,.35);setTimeout(()=>{try{og.disconnect();}catch(_){}} ,2500);}
      mus.name=want;mus.g=null;
      if(want){mus.g=ac.createGain();mus.g.gain.value=.0001;mus.g.connect(musicBus);mus.g.gain.setTargetAtTime(lvl,ac.currentTime+.05,.5);mus.step=0;mus.next=ac.currentTime+.12;}
    }
    if(!mus.name)return;
    mus.g.gain.setTargetAtTime(lvl,ac.currentTime,.4);
    const T=TRACKS[mus.name],sd=60/T.bpm/4;
    while(mus.next<ac.currentTime+.3){
      const evs=T.at[mus.step%T.len];
      if(evs)for(const e of evs){const t=mus.next;
        if(e.i==='pluck')mPluck(t,e.m,e.l*sd,e.v,mus.g);else if(e.i==='pad')mPad(t,e.m,e.l*sd,e.v,mus.g);else if(e.i==='bell')mBell(t,e.m,e.v,mus.g);
        else if(e.i==='lead')mLead(t,e.m,e.l*sd,e.v,mus.g);else if(e.i==='bass')mBass(t,e.m,e.l,e.v,mus.g);else mDrum(t,e.k,e.v,mus.g);}
      mus.step++;mus.next+=sd;
    }
  }
  let rainG=null,rainF=null,windG=null,windF=null;
  function loopNoise(type,f,q){const src=ac.createBufferSource();src.buffer=noiseBuf;src.loop=true;const fl=ac.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q;const g=ac.createGain();g.gain.value=0;src.connect(fl);fl.connect(g);g.connect(ambBus);src.start();return [g,fl];}
  function weatherSound(on){
    if(typeof WX==='undefined')return;
    if(!rainG){[rainG,rainF]=loopNoise('lowpass',5200,.4);[windG,windF]=loopNoise('bandpass',420,.9);}
    const t=ac.currentTime,inside=!!scene.interior;
    rainG.gain.setTargetAtTime(on?WX.rain*(inside?.07:.16):0,t,.6);rainF.frequency.setTargetAtTime(inside?900:5200,t,.3);
    windG.gain.setTargetAtTime(on?WX.sand*.22:0,t,.6);windF.frequency.setTargetAtTime(380+180*Math.sin(time*.7)+90*Math.sin(time*1.9),t,.2);
  }
  function tick(dt){
    if(!ready())return;
    try{musicTick();}catch(err){(window.__sfxErr=window.__sfxErr||[]).push('music: '+err.message);}
    const on=OPT.ambient!=='off'&&(state==='play'||state==='menu'||state==='dialog'||state==='fish');
    if(!fountain){
      const src=ac.createBufferSource();src.buffer=noiseBuf;src.loop=true;const f1=ac.createBiquadFilter();f1.type='bandpass';f1.frequency.value=1100;f1.Q.value=.6;const f2=ac.createBiquadFilter();f2.type='lowpass';f2.frequency.value=2800;
      const g=ac.createGain();g.gain.value=0;src.connect(f1);f1.connect(f2);f2.connect(g);g.connect(ambBus);src.start();fountain=g;
    }
    let fv=0;
    if(on&&scene.id==='village'&&!dryVillage()){const d=Math.hypot(hero.x-MAP.fountain.x,(hero.y-MAP.fountain.y)*1.3);fv=Math.max(0,1-d/300)*.14;}
    fountain.gain.setTargetAtTime(fv,ac.currentTime,.25);
    weatherSound(OPT.ambient!=='off'&&(on||state==='battle'));
    if(!on)return;
    const A=amb,b={bus:ambBus};
    for(const k in A)A[k]-=dt;
    if(scene.id==='village'&&nightAmount()>.5&&A.cricket<=0){A.cricket=.6+Math.random()*1.4;const pan=Math.random()*1.6-.8;for(let i=0;i<3;i++)tone(Object.assign({f:4100,type:'square',lp:6000,dur:.02,v:.006,d:i*.045,pan},b));}
    if(scene.id==='wadi'&&A.owl<=0){A.owl=4+Math.random()*5;noise(Object.assign({type:'bandpass',f:500,f2:900,q:.6,a:.6,dur:1.4,v:.05,pan:Math.random()-.5},b));}
    if(scene.id==='village'&&nightAmount()<.4&&A.bird<=0){A.bird=2.5+Math.random()*5;const f=2600+Math.random()*1600,pan=Math.random()*1.6-.8,n=2+(Math.random()*3|0);for(let i=0;i<n;i++)tone(Object.assign({f,f2:f*(1.15+Math.random()*.3),dur:.06,v:.025,d:i*.1,pan},b));}
    if(scene.id==='forest'){
      if(A.cricket<=0){A.cricket=.5+Math.random()*1.2;const pan=Math.random()*1.6-.8;for(let i=0;i<3;i++)tone(Object.assign({f:4300,type:'square',lp:6000,dur:.02,v:.008,d:i*.045,pan},b));}
      if(A.owl<=0){A.owl=9+Math.random()*8;const pan=Math.random()-.5;tone(Object.assign({f:390,f2:360,dur:.32,v:.04,a:.06,pan},b));tone(Object.assign({f:360,f2:330,dur:.45,v:.035,a:.06,d:.5,pan},b));}
    }
    if(scene.id==='A'&&A.crackle<=0){A.crackle=.08+Math.random()*.35;noise(Object.assign({type:'highpass',f:2500,dur:.015,v:.025+Math.random()*.03,pan:.6},b));}
    if(scene.id==='B'&&A.tink<=0){A.tink=2.5+Math.random()*3;tone(Object.assign({f:2637,dur:.15,v:.03,pan:-.6},b));tone(Object.assign({f:3520,dur:.1,v:.02,d:.02,pan:-.6},b));}
  }
  function suspend(){if(keepEl)keepEl.pause();if(ac&&ac.state==='running')ac.suspend().catch(()=>{});}
  return {unlock,play,voice,step,tick,applyVolume,suspend,names,test,get track(){return mus.name;},get ready(){return ready();},get ctx(){return ac;}};
})();
['pointerdown','pointerup','touchstart','touchend','mousedown','click','keydown'].forEach(n=>window.addEventListener(n,()=>SFX.unlock(),{capture:true,passive:true}));

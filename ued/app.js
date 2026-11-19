import {zones,feelings,faceSVG} from './data.js';
import {JarStage} from './jar.js?v=20261119';
import {readResponses,clearResponses,exportResponses} from './response-store.js?v=20261119';
const $=id=>document.getElementById(id),storeKey='garden-feelings-responses-v2',discoveryKey='garden-islands-discoveries-v2';
let jar,jarOpening=false,world,activeZone=null,started=false,night=false,sound=false,audioContext,toastTimer,inviteTimer,latest=null,routeRecord=null,reasonSet=new Set(),records=[],discoveries=[];
let reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
try{const pref=localStorage.getItem('garden-feelings-motion');if(pref!==null)reduced=pref==='reduce';}catch{}
try{records=JSON.parse(localStorage.getItem(storeKey)||'[]');if(!Array.isArray(records))records=[];records=records.filter(r=>r&&feelings.some(f=>f.id===r.emotion)&&zones.some(z=>z.id===r.zone));discoveries=JSON.parse(localStorage.getItem(discoveryKey)||'[]');if(!Array.isArray(discoveries))discoveries=[];}catch(e){}
const feelingFor=id=>feelings.find(f=>f.id===id)||feelings[2],zoneFor=id=>zones.find(z=>z.id===id)||zones[0];
function toast(message){$('toast').textContent=message;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),3300);}
function soundNote(note=500){if(!sound)return;try{audioContext ||=new (window.AudioContext||window.webkitAudioContext)();audioContext.resume();const o=audioContext.createOscillator(),g=audioContext.createGain(),t=audioContext.currentTime;o.type='sine';o.frequency.setValueAtTime(note,t);o.frequency.exponentialRampToValueAtTime(note*.8,t+.25);g.gain.setValueAtTime(.001,t);g.gain.exponentialRampToValueAtTime(.055,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+.5);o.connect(g);g.connect(audioContext.destination);o.start(t);o.stop(t+.52);}catch(e){}}
function save(){try{localStorage.setItem(storeKey,JSON.stringify(records));return true;}catch(e){return false;}}
const labelButtons=new Map(),navButtons=new Map();
for(const z of zones){
 const label=document.createElement('button');label.className='island-label';label.innerHTML=`<span class="dot" style="background:${z.color}"></span><span>${z.name}</span><span class="arrow">↗</span>`;label.setAttribute('aria-label',`Explore ${z.name}`);label.onclick=()=>enter(z.id);label.hidden=true;$('islandLabels').append(label);labelButtons.set(z.id,label);
 const nav=document.createElement('button');nav.className='zone-tab';nav.innerHTML=`<span class="tab-icon" style="color:${z.color}">${z.icon}</span><span>${z.short}</span>`;nav.setAttribute('aria-label',`Go to ${z.name}`);nav.onclick=()=>enter(z.id);$('islandNav').append(nav);navButtons.set(z.id,nav);
}
let hotspotItems=[];
function buildHotspots(actions){$('hotspots').replaceChildren();hotspotItems=[];if(!activeZone)return;for(const action of actions){const b=document.createElement('button');b.className='hotspot';const icon=document.createElement('i');icon.textContent='✦';const name=document.createElement('span');name.textContent=action.label;b.append(icon,name);b.setAttribute('aria-label',action.label);b.title=action.label;b.onclick=()=>{action.run();soundNote(600);b.classList.add('discovered');};$('hotspots').append(b);hotspotItems.push({button:b,name,action});}}
async function enter(id){if(!world||!started)return;soundNote(350);await world.enter(id);}
function zoneChanged(zone){activeZone=zone;$('overviewHint').hidden=!!zone;$('zoneIntro').hidden=!zone;$('feelDock').hidden=!zone;if(zone){$('zoneTitle').textContent=zone.name;$('zoneKicker').textContent='ILLUSTRATED EXPLORATION';$('zoneDescription').textContent=zone.description;}navButtons.forEach((b,id)=>b.classList.toggle('active',zone?.id===id));labelButtons.forEach(b=>b.hidden=!!zone);}
function frame(w){if(!started)return;for(const island of w.islands){const b=labelButtons.get(island.zone.id);if(!w.active){const point=island.group.position.clone();point.y=1.2;point.z+=3.5;const p=w.project(point);b.hidden=!p.visible;b.style.left=p.x+'px';b.style.top=p.y+'px';}else b.hidden=true;}
 if(activeZone){const island=w.islands.find(i=>i.zone.id===activeZone.id);for(const h of hotspotItems){const p=w.project(island.group.position.clone().add(h.action.point));h.button.hidden=!p.visible;h.button.style.left=p.x+'px';h.button.style.top=p.y+'px';if(h.name.textContent!==h.action.label){h.name.textContent=h.action.label;h.button.setAttribute('aria-label',h.action.label);}}}}
function discover(zone,action){if(!discoveries.includes(zone.id)){discoveries.push(zone.id);try{localStorage.setItem(discoveryKey,JSON.stringify(discoveries));}catch(e){}$('discoveryCount').textContent=discoveries.length+' / 4';toast(zone.discovery+' ✦');}soundNote(780);}
function error(message){$('loading').hidden=true;$('errorPanel').hidden=false;$('errorText').textContent=message;}
async function init(){try{
 $('loadProgress').style.width='10%';const {GardenWorld}=await import('./world.js');
 world=new GardenWorld($('garden'),{select:enter,feedback:openJar,zone:zoneChanged,loading:value=>$('zoneLoading').hidden=!value,hotspots:buildHotspots,frame,discover,move:()=>soundNote(260),message:toast,error});
 await world.init((percent,message)=>{$('loadProgress').style.width=percent+'%';$('loadMessage').textContent=percent===100?'': 'Loading…';});
 jar=new JarStage({pick:recordFeeling,close:fromForm=>{document.body.classList.remove('entering-jar');jarOpening=false;world.jarOpen=false;world.paused=false;world.companion.visible=!!world.active;world.setReduced(reduced);world.resetView();}});
 jar.setReduced(reduced);world.setReduced(reduced);$('enterGarden').hidden=false;$('loadMessage').hidden=true;$('discoveryCount').textContent=discoveries.length+' / 4';
 $('enterGarden').onclick=start;
 
 }catch(e){console.error('Garden initialization failed',e);error('This device could not open the 3D scene. You can still leave feedback using the direct link.');}}
function start(){if(started)return;started=true;$('loading').classList.add('leaving');setTimeout(()=>$('loading').hidden=true,reduced?0:1300);$('hud').hidden=false;$('bottomHud').hidden=false;$('overviewHint').hidden=false;world.start();soundNote(520);}
$('retry').onclick=()=>location.reload();$('homeBtn').onclick=$('backBtn').onclick=()=>{world?.overview();};$('resetView').onclick=()=>world?.resetView();$('zoomIn').onclick=()=>world?.zoom(1.2);$('zoomOut').onclick=()=>world?.zoom(1/1.2);
$('lightBtn').onclick=()=>{night=!night;document.body.classList.toggle('twilight',night);$('lightBtn').textContent=night?'☾':'☀';$('lightBtn').setAttribute('aria-label',night?'Switch to daylight':'Switch to twilight');world?.setNight(night);};
$('soundBtn').onclick=()=>{sound=!sound;$('soundBtn').setAttribute('aria-pressed',String(sound));$('soundBtn').setAttribute('aria-label',sound?'Mute sound':'Enable sound');$('soundPath').setAttribute('d',sound?'M15 8c3 2 3 6 0 8m3-11c5 4 5 10 0 14':'m16 9 5 6m0-6-5 6');soundNote();};
$('helpBtn').onclick=()=>$('helpDialog').showModal();$('motionBtn').onclick=()=>{reduced=!reduced;try{localStorage.setItem('garden-feelings-motion',reduced?'reduce':'enable');}catch{}document.body.classList.toggle('reduced',reduced);$('motionBtn').textContent=reduced?'Enable gentle motion':'Reduce motion';world?.setReduced(reduced);jar?.setReduced(reduced);};document.body.classList.toggle('reduced',reduced);$('motionBtn').textContent=reduced?'Enable gentle motion':'Reduce motion';
for(const b of document.querySelectorAll('.dialog-close'))b.onclick=()=>b.closest('dialog').close();for(const d of document.querySelectorAll('dialog'))d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();});
function openJar(){
 if(!activeZone||!jar||jarOpening||jar.opened)return;
 jarOpening=true;const zone=activeZone;document.body.classList.add('entering-jar');world.focusVessel();soundNote(310);
 setTimeout(()=>{if(activeZone?.id!==zone.id){jarOpening=false;document.body.classList.remove('entering-jar');return;}jar.open(zone);world.jarOpen=true;world.controls.enabled=false;world.paused=true;},reduced?0:1350);
}
$('feelTrigger').onclick=openJar;
function recordFeeling(f){ soundNote(620); }
$('journalBtn').onclick=()=>{records=readResponses();$('stamps').replaceChildren();for(const z of zones){const d=document.createElement('div');d.className='stamp'+(discoveries.includes(z.id)?' found':'');d.innerHTML=`<span>${z.icon}</span>${z.short}`;$('stamps').append(d);}$('journalSummary').textContent=`${discoveries.length} of 4 discoveries · ${records.length} feelings saved in this browser. Playground discoveries are separate from feedback.`;$('recordList').replaceChildren();records.slice(-8).reverse().forEach(r=>{const d=document.createElement('div');d.className='record';const b=document.createElement('b');b.textContent=feelingFor(r.emotion).name+' · '+zoneFor(r.zone).name;const time=document.createElement('small');time.textContent=new Date(r.date||r.time).toLocaleString('en-GB',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});d.append(b,time);if(r.reasons?.length){const p=document.createElement('p');p.textContent=r.reasons.join(' · ');d.append(p);}if(r.notes){const p=document.createElement('p');p.textContent=r.notes;d.append(p);}$('recordList').append(d);});$('exportBtn').disabled=!records.length;$('journalDialog').showModal();};
$('exportBtn').onclick=exportResponses;
$('deleteRecords').onclick=()=>{if(confirm('Delete all feedback stored in this browser? This cannot be undone.')){if(clearResponses()){records=[];$('journalDialog').close();toast('Local feedback deleted.');}else toast('Could not delete local feedback. Check browser storage settings.');}};
init();

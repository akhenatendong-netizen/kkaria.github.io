/* Task-led edition. Scene transitions explain the task; they never gate it. */
const legacyRender = render;
const legacyContext = currentContext;
const flowSteps = ['Collected','Sorted','Processed','New use'];
const flowIcons = ['truck','sort','process','loop'];
const flowPositions = [.08,.43,.72,1];
let flowState={item:'bottle',step:'choose',stage:0}, sceneState={playing:false,progress:0,speed:1};
let flowDraft=read('task-draft',{});
if(!flowDraft || typeof flowDraft!=='object')flowDraft={};
const readyChecks={};let prepScenario='ready';
let reduceMotion=read('reduce-motion',matchMedia('(prefers-reduced-motion: reduce)').matches)===true;
const sendWorld = detail=>window.dispatchEvent(new CustomEvent('world-command',{detail}));
function flowURL(step='prepare',id=flowState.item,n=0){return `task?item=${encodeURIComponent(id)}&step=${step}&stage=${n}&period=${period}`;}
function selectedItem(){return items.find(i=>i.id===flowState.item)||items[0];}
function flowType(i=selectedItem()){return M.materials[i.type]?i.type:(i.category==='Paper'?'paper':'plastic');}
function softAction(label,href,ic='arrow'){return `<a class="soft-action" href="#${href}">${label}${icon(ic)}</a>`;}
function flowHeader(page){
 const primary=page==='task'&&flowState.step==='route'?'journey':page==='home'||page==='task'||page==='item'||page==='sort'?'task':page;
 const links=[['task','home','Recycle now','home'],['journey','journey','Material journey',journeyRoute(material,stage)],['results','results','Local results','results?period='+period],['saved','saved','My activity','saved']];
 const nav=links.map(([key,ic,label,url])=>`<a href="#${url}" ${primary===key?'aria-current="page"':''}>${icon(ic)}<span>${label}</span></a>`).join('');
 $('#desktop-nav').innerHTML=nav;$('#bottom-nav').innerHTML=nav;
}
navigation=flowHeader;
function flowTop(){return `<div class="flow-location"><button data-action="location">${icon('pin')}Riverside <span>Demo point</span></button><button data-action="scan" aria-label="Scan a collection point">${icon('scan')}</button></div>`;}
function taskBreadcrumb(){return `<nav class="task-steps" aria-label="Your task"><a href="#home">1. Choose</a><a href="#${flowURL('prepare')}" ${flowState.step==='prepare'?'aria-current="step"':''}>2. Prepare</a><a href="#${flowURL('route')}" ${flowState.step==='route'?'aria-current="step"':''}>3. After the bin</a></nav>`;}
function choosePanel(){
 const validDraft=items.some(i=>i.id===flowDraft.item)&&['prepare','route'].includes(flowDraft.step);
 return `<div class="task-panel choose-panel">${flowTop()}<div class="panel-heading"><h1>Start with<br>what’s in your hand.</h1><p>Find the right bin. See what comes next.</p></div><div class="quick-items">${items.slice(0,4).map(i=>`<a href="#${flowURL('prepare',i.id)}" class="quick-item"><span style="background:${colors[i.type]}">${materialArt(i.type)}</span><strong>${i.id==='bottle'?'Plastic bottle':i.id==='can'?'Metal can':i.id==='box'?'Cardboard':'Glass jar'}</strong>${icon('arrow')}</a>`).join('')}</div><div class="quick-tools"><button data-action="photo">${icon('camera')}Take a photo</button><a href="#sort">${icon('search')}Find another item</a></div>${validDraft?`<a class="resume-task" href="#${flowURL(flowDraft.step,flowDraft.item,flowDraft.stage||0)}">${icon('journey')}Continue with ${escapeHTML(items.find(i=>i.id===flowDraft.item).name.toLowerCase())}${icon('arrow')}</a>`:''}<div class="panel-bottom"><span>Just curious?</span><a href="#journey?material=plastic">Explore the material journey ${icon('arrow')}</a></div></div>`;
}
function preparePanel(){
 const i=selectedItem(),ok=i.state==='green',checks=readyChecks[i.id]||[];
 return `<div class="task-panel">${flowTop()}${taskBreadcrumb()}<div class="picked-item"><span style="background:${colors[i.type]}">${materialArt(i.type)}</span><div><h1>${i.name}</h1><a href="#home">Change item</a></div></div><div class="bin-verdict ${ok?'':'not-accepted'}"><span>${icon(ok?'check':'info')}</span><div><span class="overline">${ok?'ACCEPTED AT THIS DEMO POINT':'CHECK BEFORE DISPOSING'}</span><h2>${ok?(i.type==='paper'?'Paper & card slot':'Mixed recycling bin'):i.type==='glass'?'Use a separate glass service':i.state==='gray'?'The rule needs checking':'Keep it out of this bin'}</h2></div></div><div class="prep-list">${i.steps.map(([title,body],n)=>`<label class="prep-row"><input type="checkbox" data-prep="${n}" ${checks.includes(n)?'checked':''}><span><strong>${title}</strong><span>${body}</span></span></label>`).join('')}</div><div class="panel-actions">${ok?`<button class="btn full" data-log="${i.id}">I’ve put it in the bin ${icon('check')}</button>`:`<button class="btn full" data-item-help="${i.id}">Find the right guidance ${icon('arrow')}</button>`}${M.materials[i.type]?`<a class="soft-action" href="#${flowURL('route')}">${ok?'Just show me what happens next':'Explore this material instead'}${icon('journey')}</a>`:`<button class="soft-action" data-item-help="${i.id}">Why the route is uncertain ${icon('info')}</button>`}</div><div class="micro-actions">${sourceButton('rules','Check point rules')}<button data-question-context="${escapeHTML('Item: '+i.name+' · Riverside demo point')}">Ask a question</button></div></div>`;
}
function routeCard(n=stage){
 const i=selectedItem(),t=flowType(),m=M.materials[t],r=M.reportFor(period),outside=i.state!=='green';
 const titles=[m.steps[0],m.steps[1],m.steps[2],m.future];
 const explanations=[t==='paper'?'Keeping card dry and free of food helps preserve useful fibres.':t==='glass'?'A separate glass service must accept the item before this route can begin.':'Empty, loose items enter the collection stream. Preparation helps prevent contamination.', 'Sorting separates useful material from unsuitable items. Some of the collected load may be rejected.',m.process,m.caveat];
 const facts=outside?['No collection at this demo point.','No sorting record for this material here.','No processing record for this material here.','A possible use, not a confirmed outcome.']:[`${r.total.toLocaleString()} kg collected`,`${r.accepted.toLocaleString()} kg accepted for processing`,r.recovered===null?'Processing result not reported':`${r.recovered} kg recovered material`,'Final products not reported'];
 const badges=outside?['General explanation','gray']:n<2?['Sample record','green']:n===2&&r.recovered!==null?['Sample record','green']:['Not yet known','amber'];
 return `<div class="stage-description" id="flow-stage-content"><div class="stage-title"><span class="stage-icon">${icon(flowIcons[n])}</span><span class="overline">${String(n+1).padStart(2,'0')} / ${flowSteps[n].toUpperCase()}</span></div><h1>${titles[n]}</h1><p>${explanations[n]}</p><div class="evidence-inline"><div><span class="tag ${badges[1]}">${badges[0]}</span><strong>${facts[n]}</strong><span>${outside?'Outside this point’s service':period+' 2026 · Combined load, all materials'}</span></div>${sourceButton(outside?'journey':['collection','sorting','processing','journey'][n],n===3?'What is known':'Read source')}</div>${n===1&&!outside?scenarioCard(t):''}${n===2&&r.recovered===null&&!outside?`<button class="soft-action" data-report="September">Compare a month with a result ${icon('arrow')}</button>`:''}</div>`;
}
function scenarioCard(t){
 const ready=prepScenario==='ready';
 const readyTitle=t==='paper'?'Clean & dry':'Empty & loose';
 return `<section class="scenario-card"><div class="scenario-heading"><strong>Why your preparation matters</strong><span>Try a scenario</span></div><div class="scenario-options"><button data-scenario="ready" aria-pressed="${ready}">${readyTitle}</button><button data-scenario="contaminated" aria-pressed="${!ready}">${t==='paper'?'Food-soiled':'Food left inside'}</button></div><p>${ready?'Correct preparation helps material enter the right stream. It still needs sorting and processing.':'Residue can contaminate other material and lead to rejection. Check the preparation guidance before using the bin.'}</p><span class="scenario-limit">Illustration only · report figures stay unchanged</span></section>`;
}
function routePanel(){
 const i=selectedItem();
 return `<div class="task-panel route-panel">${flowTop()}<div class="route-item"><span class="small-material" style="background:${colors[i.type]}">${materialArt(i.type)}</span><div><strong>${M.materials[flowType()].name}</strong><span>Typical route · not live tracking</span></div><button class="text-link" data-flow="materials">Change</button></div>${routeCard(stage)}<div class="panel-actions"><a class="btn full" href="#results?period=${period}">What happened locally? ${icon('results')}</a><button class="soft-action" data-question-context="${escapeHTML(M.materials[flowType()].name+' · '+flowSteps[stage]+' · '+period+' 2026')}">Ask about this step ${icon('chat')}</button></div><a class="panel-back" href="#${flowURL('prepare')}">${icon('back')}Back to item guidance</a></div>`;
}
function stageDock(){return `<div class="scene-tools"><span class="scene-caption">A world beyond the bin.</span><div><button data-flow="overview" aria-label="View the whole neighbourhood">${icon('home')}</button><button data-flow="motion" aria-label="${reduceMotion?'Enable':'Reduce'} animation" aria-pressed="${reduceMotion}">${reduceMotion?'Still':'Motion'}</button><button data-action="about" aria-label="About this prototype">${icon('info')}</button></div></div><div class="scene-dock"><div class="playback-tools"><span>THE MATERIAL JOURNEY</span><div><button id="flow-play" data-flow="play">${icon('journey')}<span>${sceneState.playing?'Pause':'Play 20s'}</span></button><button data-flow="speed" id="flow-speed" aria-label="Change playback speed">${sceneState.speed||1}×</button></div></div><nav class="scene-stages" aria-label="Jump to a journey stage">${flowSteps.map((label,n)=>`<button data-flow-stage="${n}" ${flowState.step==='route'&&stage===n?'aria-current="step"':''}><span>${icon(flowIcons[n])}</span><span><small>0${n+1}</small><strong>${label}</strong></span></button>`).join('')}</nav><div class="scene-scrubber"><input aria-label="Scrub the material journey" id="flow-scrub" type="range" min="0" max="100" value="${Math.round(sceneState.progress*100)}"><span>Illustrative route</span></div></div>`;}
function flowCanvas(){return `<section class="task-layout" aria-label="Recycling assistant">${flowState.step==='choose'?choosePanel():flowState.step==='prepare'?preparePanel():routePanel()}${stageDock()}</section>`;}
function parseFlow(){
 const [path,qs='']=(location.hash.slice(1)||'home').split('?'),p=new URLSearchParams(qs);
 if(M.reports[p.get('period')])period=p.get('period');
 const rawItem=path.startsWith('item/')?path.split('/')[1]:p.get('item');
 if(items.some(i=>i.id===rawItem))flowState.item=rawItem;
 if(path==='journey'){
  material=M.materials[p.get('material')]?p.get('material'):material;
  flowState.item=items.find(i=>i.type===material)?.id||'bottle';
  flowState.step='route';
 }else if(path.startsWith('item/'))flowState.step='prepare';
 else if(path==='home')flowState.step='choose';
 else flowState.step=['prepare','route'].includes(p.get('step'))?p.get('step'):'choose';
 if(flowState.step==='route'&&!M.materials[selectedItem().type])flowState.step='prepare';
 stage=Math.min(3,Math.max(0,Number(p.get('stage'))||0));flowState.stage=stage;
 material=flowType();
 return path;
}
render=function(){
 const path=(location.hash.slice(1)||'home').split('?')[0];
 const isTask=['home','task','journey'].includes(path)||path.startsWith('item/');
 if(isTask){
  parseFlow();document.body.dataset.view='task';document.body.dataset.step=flowState.step;flowHeader(path.split('/')[0]);$('#main').innerHTML=flowCanvas();
  document.title=(flowState.step==='choose'?'Recycle now':flowState.step==='prepare'?'Prepare your item':'After the bin')+' · Recycling Loop';
  if(flowState.step!=='choose'){flowDraft={...flowState};save('task-draft',flowDraft);}
  sendWorld({action:'task',material:material,stage:flowState.step==='route'?stage:0,overview:flowState.step==='choose',reduceMotion});
 }else{
  document.body.dataset.view='tool';legacyRender();
  $('#main').insertAdjacentHTML('afterbegin',`<div class="context-return"><a href="#${flowURL(flowDraft.step||'prepare',flowDraft.item||'bottle',flowDraft.stage||0)}">${icon('back')}Back to my item</a><span>Riverside · Demo point</span></div>`);
  sendWorld('panel');
 }
 if(path==='results')enhanceResults();
};
function enhanceResults(){
 const r=M.reportFor(period);
 const box=$('.report-note');if(box)box.insertAdjacentHTML('beforeend',`<button class="soft-action" data-question-context="Local results · ${period} 2026 · ${r.ref}">Ask about these results ${icon('chat')}</button>`);
 const heading=$('.evidence-section .section-title h2');if(heading)heading.textContent='Where the answer comes from.';
 const activities=$('.help-strip');if(activities)activities.insertAdjacentHTML('afterend',`<div class="next-action-card"><div><span class="overline">YOUR NEXT SMALL ACTION</span><h2>Ready for the next item?</h2></div>${link('home','Recycle another item')}</div>`);
}
currentContext=function(){return document.body.dataset.view==='task'?selectedItem().name+' · '+flowState.step+' · '+(flowState.step==='route'?flowSteps[stage]+' · ':'')+period+' 2026 · Riverside':legacyContext();};
window.loopTaskLogged=(item,n)=>{
 flowState.item=item.id;flowState.step='route';flowState.stage=0;flowDraft={...flowState};save('task-draft',flowDraft);
 modal(`<div class="modal-icon">${icon('check')}</div><h2>Your action is saved.</h2><div class="log-item"><span class="small-material" style="background:${colors[item.type]}">${materialArt(item.type)}</span><div><h3>${item.name} × ${n}</h3><p>${storageAvailable?'On this browser':'This session only'} · Self-reported</p></div></div><p>Your part is done. Here’s what you can find out next.</p><a class="btn full" href="#results?period=${period}" data-action="close">See the local picture ${icon('results')}</a><a class="soft-action" href="#${flowURL('route',item.id)}" data-action="close">Explore the material journey ${icon('journey')}</a><a class="soft-action" href="#home" data-action="close">Check another item ${icon('arrow')}</a><p class="scope-note">This log does not confirm that the item was collected or recycled.</p>`);
};
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-flow],[data-flow-stage],[data-scenario]');if(!b)return;
 if(b.dataset.scenario){prepScenario=b.dataset.scenario;$('#flow-stage-content').outerHTML=routeCard(stage);sendWorld({action:'scenario',value:prepScenario});$('[data-scenario="'+prepScenario+'"]')?.focus({preventScroll:true});return;}
 if(b.dataset.flowStage!==undefined){location.hash=flowURL('route',flowState.item,Number(b.dataset.flowStage));return;}
 const a=b.dataset.flow;
 if(a==='materials')modal(`<h2>Choose a material.</h2><div class="material-options">${Object.entries(M.materials).map(([t,m])=>`<a class="material-option" href="#journey?material=${t}&stage=0&period=${period}" data-action="close"><span>${materialArt(t)}</span>${m.name}${icon('arrow')}</a>`).join('')}</div>`);
 if(a==='overview')sendWorld('overview');
 if(a==='speed'){sceneState.speed=sceneState.speed===2?1:2;sendWorld({action:'speed',value:sceneState.speed});$('#flow-speed').textContent=sceneState.speed+'×';}
 if(a==='motion'){reduceMotion=!reduceMotion;save('reduce-motion',reduceMotion);sendWorld({action:'motion',value:!reduceMotion});b.textContent=reduceMotion?'Still':'Motion';b.setAttribute('aria-pressed',reduceMotion);b.setAttribute('aria-label',(reduceMotion?'Enable':'Reduce')+' animation');}
 if(a==='play'){
  if(sceneState.playing){sendWorld('pause');return;}
  if(flowState.step!=='route'){
   location.hash=flowURL('route');
   window.addEventListener('hashchange',()=>sendWorld('start'),{once:true});
  }else sendWorld('start');
 }
});
document.addEventListener('change',e=>{if(e.target.dataset.prep!==undefined){const list=readyChecks[flowState.item]||[];const n=Number(e.target.dataset.prep);readyChecks[flowState.item]=e.target.checked?[...new Set([...list,n])]:list.filter(x=>x!==n);}});
document.addEventListener('input',e=>{if(e.target.id==='flow-scrub')sendWorld({action:'seek',value:Number(e.target.value)/100});});
window.addEventListener('world-state',e=>{
 sceneState={...sceneState,...e.detail};
 const play=$('#flow-play span');if(play)play.textContent=sceneState.playing?'Pause':sceneState.progress>=1?'Replay 20s':'Play 20s';
 const slider=$('#flow-scrub');if(slider&&document.activeElement!==slider)slider.value=Math.round(sceneState.progress*100);
 const n=sceneState.progress<.34?0:sceneState.progress<.62?1:sceneState.progress<.9?2:3;
 if(flowState.step==='route'&&document.body.dataset.view==='task'&&n!==stage){
  stage=n;flowState.stage=n;flowDraft={...flowState};save('task-draft',flowDraft);const el=$('#flow-stage-content');if(el)el.outerHTML=routeCard(n);
  document.querySelectorAll('[data-flow-stage]').forEach(b=>b.toggleAttribute('data-active',Number(b.dataset.flowStage)===n));
  document.querySelectorAll('[data-flow-stage]').forEach(b=>{if(Number(b.dataset.flowStage)===n)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
 }
});
window.addEventListener('world-inspect',e=>{location.hash=flowURL('route',flowState.item,e.detail);});
window.addEventListener('loop-ready',()=>{$('#world-loader').classList.add('loaded');document.body.classList.add('world-ready');render();});
window.addEventListener('loop-failed',()=>{$('#world-loader').classList.add('loaded');document.body.classList.add('world-unavailable');toast('The 3D scene is unavailable. All guidance and records still work.');});
window.addEventListener('keydown',e=>{if(document.body.dataset.view!=='task'||$('#dialog').open||e.target.matches('input,textarea,select,button,a'))return;if(e.code==='Space'){e.preventDefault();sendWorld(sceneState.playing?'pause':'start');}});
render();

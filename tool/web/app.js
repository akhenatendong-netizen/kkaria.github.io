const $=s=>document.querySelector(s);
const icons={home:'<path d="m3 10 9-7 9 7v10H3Z"/><path d="M9 20v-7h6v7"/>',search:'<circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/>',journey:'<circle cx="5" cy="5" r="2"/><circle cx="19" cy="19" r="2"/><path d="M7 5h8a4 4 0 0 1 0 8H9a4 4 0 0 0 0 8h8"/>',results:'<path d="M4 20V11h4v9m4 0V4h4v16m4 0v-7h3v7M2 21h22"/>',saved:'<path d="M6 3h12v18l-6-4-6 4Z"/>',pin:'<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/>',arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',back:'<path d="M20 12H4m6-6-6 6 6 6"/>',chevron:'<path d="m9 5 7 7-7 7"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-11v1"/>',check:'<path d="m5 12 5 5L20 7"/>',scan:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M7 7h3v3H7zm7 0h3v3h-3zM7 14h3v3H7zm7 0h3v3h-3z"/>',file:'<path d="M14 3H5v18h14V8Zm0 0v5h5M8 12h8m-8 4h6"/>',truck:'<path d="M2 6h12v12H2Zm12 5h5l3 4v3h-8"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>',sort:'<path d="M4 4h16l-6 8v8l-4-2v-6ZM7 8h10"/>',process:'<path d="m4 20 0-13 6 4V7l6 4V4h4v16Z"/><path d="M7 15v2m5-2v2m5-2v2"/>',loop:'<path d="M20 8A8 8 0 0 0 6 5L3 8m0-5v5h5m-4 8a8 8 0 0 0 14 3l3-3m0 5v-5h-5"/>',chat:'<path d="M4 4h16v12H9l-5 4Z"/><path d="M8 8h8m-8 4h5"/>',heart:'<path d="M20 5c-4-4-8 1-8 1s-4-5-8-1c-5 5 8 15 8 15S25 10 20 5Z"/>'};
icons.camera='<path d="M3 7h4l2-3h6l2 3h4v13H3Z"/><circle cx="12" cy="13" r="4"/>';
const icon=(n,c='')=>`<svg class="icon ${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[n]||icons.info}</svg>`;
const materialArt=(type)=>{const paths={plastic:'<path d="M28 12h24v10l8 11v39q0 7-7 7H27q-7 0-7-7V33l8-11Z" fill="#b9cdb8" stroke="#296548" stroke-width="2"/><rect x="27" y="7" width="26" height="9" rx="3" fill="#296548"/><path d="M22 42h36v19H22" fill="#e5eee0"/><path d="M29 32v7m0 28v5" stroke="white" stroke-width="4" stroke-linecap="round"/><path d="m35 47 7-2 4 6-7 5-5-4" fill="none" stroke="#296548" stroke-width="2"/>',metal:'<rect x="22" y="15" width="38" height="61" rx="11" fill="#cddce4" stroke="#6d8d9f" stroke-width="2"/><ellipse cx="41" cy="17" rx="18" ry="6" fill="#e8f0f4" stroke="#6d8d9f" stroke-width="2"/><ellipse cx="41" cy="17" rx="6" ry="2.5" fill="#6d8d9f"/><path d="M23 36h36v22H23" fill="#eaf3f7"/><path d="M29 29v36" stroke="white" stroke-width="3"/><path d="m38 41-4 7h9l-3 7" fill="none" stroke="#6d8d9f" stroke-width="2"/>',paper:'<path d="m12 30 30-15 28 15v35L40 80 12 65Z" fill="#edcca0" stroke="#b58b5b" stroke-width="2"/><path d="m12 30 28 15 30-15M40 45v35M26 23l29 15v14l-9 5V42" fill="#f7e2c6" stroke="#b58b5b" stroke-width="2"/>',glass:'<path d="M31 8h18v24l9 13v29q0 6-6 6H28q-6 0-6-6V45l9-13Z" fill="#b7d8c9" stroke="#4a8c72" stroke-width="2"/><path d="M30 8h20v8H30" fill="#4a8c72"/><rect x="24" y="49" width="32" height="19" rx="2" fill="#e7f1e9"/><path d="M31 40v5m0 24v5" stroke="white" stroke-width="3"/>',bag:'<path d="M23 14h10v18h16V14h10v60H23Z" fill="#d8d5e0" stroke="#8d879e" stroke-width="2"/><path d="M29 40v22m12-20v26m12-29v23" stroke="white" stroke-width="3"/>',cup:'<path d="M22 29h39l-6 46H28Z" fill="#edc6b1" stroke="#b08066" stroke-width="2"/><rect x="19" y="23" width="45" height="8" rx="3" fill="#fff3e7" stroke="#b08066" stroke-width="2"/><path d="M26 45h31l-2 17H28" fill="#f7e7d5"/>'};return `<svg viewBox="0 0 80 90" aria-hidden="true">${paths[type]||paths.plastic}</svg>`};
const colors={plastic:'#fff',metal:'#edf4f7',paper:'#fff4e4',glass:'#edf5ef',bag:'#f2f0f6',cup:'#fff0e8'};
const items=[
 {id:'bottle',name:'Plastic drinks bottle',type:'plastic',category:'Plastic',status:'Accepted in this demo',state:'green',steps:[['Empty the bottle','Remove any remaining drink.'],['Rinse if needed','Remove visible residue.'],['Put the cap back on','This demo point accepts bottles with caps.']],note:'Place it in the mixed recycling bin.',aliases:'water soda pet'},
 {id:'can',name:'Aluminium drinks can',type:'metal',category:'Metal',status:'Accepted in this demo',state:'green',steps:[['Empty the can','Remove any remaining drink.'],['Rinse if needed','Make sure no liquid remains.'],['Use the mixed recycling bin','Keep the can loose, not in a bag.']],note:'Place it in the mixed recycling bin.',aliases:'tin soda beer'},
 {id:'box',name:'Cardboard box',type:'paper',category:'Paper',status:'Accepted in this demo',state:'green',steps:[['Remove packaging','Take out plastic liners and foam.'],['Keep it clean and dry','Set aside heavily food-soiled parts.'],['Flatten the box','Use the paper and card slot.']],note:'Place it in the paper and card slot.',aliases:'carton packaging paper'},
 {id:'jar',name:'Glass jar',type:'glass',category:'Glass',status:'Separate collection',state:'amber',steps:[['Keep it out of this bin','This demo point does not collect glass.'],['Check a glass collection point','Confirm accepted items before travelling.']],note:'This prototype has no verified nearby collection locations.',aliases:'glass bottle'},
 {id:'bag',name:'Plastic carrier bag',type:'bag',category:'Plastic',status:'Not accepted here',state:'amber',steps:[['Do not use this recycling bin','Flexible plastic is excluded from this demo service.'],['Check an alternative service','Look for a verified collection service for flexible plastic.']],note:'No alternative collection service is connected in this prototype.',aliases:'film wrap soft plastic'},
 {id:'cup',name:'Takeaway cup',type:'cup',category:'Paper',status:'Check before recycling',state:'gray',steps:[['Check the cup material','A paper-looking cup may have a lining.'],['Ask the collection operator','We cannot confirm acceptance from appearance alone.']],note:'Keep it out of this recycling bin until the local rule is confirmed.',aliases:'coffee tea cup'}
];
function heroArt(){return `<svg viewBox="0 0 220 210" aria-hidden="true"><circle cx="112" cy="105" r="86" fill="#e4dcff"/><circle cx="112" cy="105" r="68" fill="none" stroke="#c4b3ff" stroke-width="2" stroke-dasharray="5 8"/><g transform="translate(30 35) rotate(-13 60 60)">${materialArt('plastic').replace('<svg ','<svg width="100" height="130" ')}</g><g transform="translate(104 72) rotate(12 45 50)">${materialArt('metal').replace('<svg ','<svg width="87" height="105" ')}</g><circle cx="171" cy="43" r="22" fill="#296548"/><path d="m161 43 7 7 13-14" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M45 155c14 29 57 39 86 22m-8-10 10 11-14 5" fill="none" stroke="#296548" stroke-width="3" stroke-linecap="round"/></svg>`}
const M = window.LoopModel;
const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem('loop-' + key)) ?? fallback; } catch { return fallback; } };
let storageAvailable = true;
const save = (key, value) => { try { localStorage.setItem('loop-' + key, JSON.stringify(value)); return true; } catch { storageAvailable = false; return false; } };
let saved = read('saved', false) === true;
let history = M.normaliseHistory(read('history', []), items.map(i => i.id));
let feedback = read('feedback', []);
if (!Array.isArray(feedback)) feedback = [];
feedback = feedback.filter(x => x && typeof x.text === 'string' && typeof x.at === 'string').map((x,n)=>({...x,uid:typeof x.uid==='string'?x.uid:'question-'+n+'-'+Date.parse(x.at)}));
let filter = 'All', query = '', stage = 0, period = 'October', material = 'plastic', toastTimer;
let pendingLog = null, removed = null, removedQuestion = null, editingQuestion = null, questionContext = '', modalTrigger = null;
const escapeHTML = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link = (route, label, cl = 'btn') => `<a href="#${route}" class="${cl}">${label}${icon('arrow')}</a>`;
const sourceButton = (id, label = 'View record') => `<button class="text-link" data-source="${id}">${label}${icon('chevron')}</button>`;
const back = (route, label) => `<a class="back" href="#${route}">${icon('back')}${label}</a>`;
const journeyRoute = (type = material, step = 0) => `journey?material=${type}&stage=${step}&period=${period}`;
const dateLabel = value => new Date(value).toLocaleDateString('en-GB', {day:'numeric',month:'short',year:'numeric'});
const guideLink = (label = 'Bristol’s official recycling guide') => `<a class="text-link" href="https://bristolwastecompany.co.uk/get-it-sorted/" target="_blank" rel="noopener">${label} ↗</a>`;
const outcomeKnown = () => M.reportFor(period).recovered !== null;
function navigation(current) {
  const entries = [['home','home','Explore'],['sort','search','Sort an item'],['journey','journey','Material journey'],['results','results','Local results'],['saved','saved','My activity']];
  const html = entries.map(([id,ic,label]) => `<a href="#${id}" class="navlink ${current===id?'active':''}" ${current===id?'aria-current="page"':''}>${icon(ic)}<span>${label}</span></a>`).join('');
  $('#desktop-nav').innerHTML = html;
  $('#bottom-nav').innerHTML = html.replace('Sort an item','Sort').replace('Material journey','Journey').replace('Local results','Results').replace('My activity','Activity');
}
function locationRow() {
  return `<div class="page-top location-bar"><button class="location" data-action="location">${icon('pin')}<span>Riverside Community Hub</span>${icon('chevron')}</button><div class="location-tools"><span class="tag gray">Demo point</span><button class="scan-button" aria-label="Scan a collection point QR code" data-action="scan">${icon('scan')}<span>Scan QR</span></button></div></div>`;
}
function statusFor(n) {
  if (n < 2 || (n === 2 && outcomeKnown())) return ['Sample record','green'];
  if (n === 2) return ['Awaiting record','amber'];
  return ['Possible use','gray'];
}
function home() {
  return `${locationRow()}<section class="home-hero"><div class="hero-copy"><h1>You recycle.<br>See what<br> <span>happens next.</span></h1><p>Know where it goes.<br>See what your collection point recovers.</p><div class="action-group">${link('sort','Sort an item')}${link('results','See local results','text-link')}</div></div><div class="hero-art">${heroArt()}<span class="art-caption">Beyond the bin.</span></div></section>
  ${history.length ? `<div class="continue-strip"><span>${icon('saved')}<strong>${M.activityTotal(history)} ${M.activityTotal(history)===1?'item':'items'} in your activity</strong></span>${link('saved','Pick up where you left off','text-link')}</div>` : ''}
  <section class="section material-section"><div class="section-title"><h2>What are you recycling?</h2>${link('sort','Browse all','text-link')}</div><div class="categories">${[['plastic','Plastic bottles','bottle'],['metal','Metal cans','can'],['paper','Paper & card','box'],['glass','Glass','jar']].map(([type,name,id])=>`<a href="#item/${id}" class="category"><span class="material-visual" style="background:${colors[type]}">${materialArt(type)}</span><span class="category-label">${name}${icon('arrow')}</span></a>`).join('')}</div></section>
  <section class="section local-overview"><div class="local-overview-copy"><span class="tag">October 2026 · Sample data</span><h2>A clearer picture<br>of your local load.</h2><p>1,010 kg accepted for processing.<br>The next outcome report is still pending.</p>${link('results?period=October','Explore the results')}</div><div class="local-overview-chart"><div class="ring-chart" role="img" aria-label="Sample load: 1240 kg collected, including 1010 kg accepted, 150 kg rejected and 80 kg unclassified"><div><strong>1,240</strong><span>kg collected</span></div></div><div class="ring-key"><p><i style="background:var(--purple)"></i><span>Accepted for processing</span><strong>1,010 kg</strong></p><p><i style="background:#f3b659"></i><span>Rejected at sorting</span><strong>150 kg</strong></p><p><i style="background:#c5c5d3"></i><span>Unclassified</span><strong>80 kg</strong></p><span class="outcome-label">Updated 4 November · Fictional records</span></div></div></section>
  <section class="section"><div class="section-title"><div><h2>A different journey for every material.</h2><p>Choose a material to see what it could become.</p></div></div><div class="material-routes">${Object.entries(M.materials).slice(0,3).map(([type,m])=>`<a href="#${journeyRoute(type)}" class="material-route"><span class="small-material" style="background:${colors[type]}">${materialArt(type)}</span><div><h3>${m.name}</h3><p>${m.future}</p></div>${icon('arrow')}</a>`).join('')}</div></section>`;
}
function sortPage() {
  return `${locationRow()}<div class="intro"><h1>Find the right bin.</h1><p>Choose your item. We’ll guide you from here.</p></div><div class="search-tools"><label class="search">${icon('search')}<input id="item-search" type="search" placeholder="Try a bottle, can or cardboard…" value="${escapeHTML(query)}" aria-label="Search recycling items"></label><button class="btn secondary" data-action="photo">${icon('camera')}Take a photo</button></div><div class="chips" aria-label="Material filters">${['All','Plastic','Metal','Paper','Glass'].map(f=>`<button class="chip ${filter===f?'active':''}" data-filter="${f}" aria-pressed="${filter===f}">${f}</button>`).join('')}</div><p id="search-count" class="search-count" role="status" aria-live="polite"></p><div id="item-list" class="item-grid"></div><div class="help-strip"><div><h3>Can’t find your item?</h3><p>Check official guidance before using the bin.</p></div><button class="text-link" data-action="item-help">Get help ${icon('arrow')}</button></div><div class="guidance-footnote"><p>Rules shown for this fictional demo point.</p>${sourceButton('rules','View point rules')}</div>`;
}
function fillItems() {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean).map(t=>t.endsWith('s')&&t.length>3?t.slice(0,-1):t);
  const matches = items.filter(i => (filter==='All'||i.category===filter) && terms.every(t=>(`${i.name} ${i.aliases} ${i.category}`).toLowerCase().includes(t)));
  $('#search-count').textContent = `${matches.length} ${matches.length===1?'item':'items'}${filter==='All'?'':' · '+filter}`;
  $('#item-list').innerHTML = matches.length ? matches.map(i=>`<a class="item-row" href="#item/${i.id}"><span class="item-visual" style="background:${colors[i.type]}">${materialArt(i.type)}</span><span class="item-copy"><span class="tag ${i.state}">${i.status}</span><h2>${i.name}</h2><span class="text-link">View guidance ${icon('arrow')}</span></span></a>`).join('') : `<div class="empty"><span class="empty-icon">${icon('search')}</span><h2>No match${query?' for “'+escapeHTML(query)+'”':''}</h2><p>Try a material name, or check official guidance.</p><div class="empty-actions"><button class="btn secondary" data-action="reset-search">Clear search & filters</button><button class="text-link" data-action="item-help">Help with this item ${icon('arrow')}</button></div></div>`;
}
function itemPage(id) {
  const i = items.find(x=>x.id===id);
  if (!i) return `${back('sort','Browse items')}<h1>Item not found</h1>`;
  const accepted = i.state==='green';
  const type = M.materials[i.type] ? i.type : (i.category==='Paper'?'paper':'plastic');
  return `${back('sort','Back to items')}<section class="item-detail"><div class="detail-illustration" style="background:${colors[i.type]}">${materialArt(i.type)}</div><div class="detail-content"><span class="tag ${i.state}">${i.status}</span><h1>${i.name}</h1><p class="detail-location">Riverside · Demo collection point</p><div class="bin-answer ${accepted?'':'unaccepted'}">${icon(accepted?'check':'info')}<div><strong>${accepted?(i.type==='paper'?'Use the paper & card slot':'Use the mixed recycling bin'):'Keep it out of this bin'}</strong><span>${accepted?'Prepare it in three quick steps.':i.type==='glass'?'Use a separately verified glass service.':'Check the right service before disposing of it.'}</span></div></div><ol class="steps">${i.steps.map(([a,b],n)=>`<li><span class="step-no">${n+1}</span><div><h3>${a}</h3><p>${b}</p></div></li>`).join('')}</ol><div class="action-group">${accepted?`<button class="btn" data-log="${i.id}">${icon('check')}I’ve put it in the bin</button>`:`<button class="btn secondary" data-item-help="${i.id}">Find the right guidance ${icon('arrow')}</button>`}${sourceButton('rules','Point rules')}</div><p class="action-note">${accepted?'Optional: add your action to this browser’s activity.':'No verified alternative collection point is connected.'}</p></div></section><section class="next-journey"><div class="next-journey-art">${materialArt(i.type)}</div><div><span class="tag gray">${accepted?'Typical material route':'General explanation'}</span><h2>What could it become?</h2><p>${M.materials[type].future}. ${accepted?'Explore the steps after collection.':'This is not a confirmed route for this item.'}</p>${link(journeyRoute(type), 'Explore the '+M.materials[type].short.toLowerCase()+' journey','text-link')}</div></section>`;
}
function journeyPage() {
  const m = M.materials[material];
  return `${locationRow()}<div class="intro"><h1>Follow the material.</h1><p>From the right bin to a possible new life.</p></div><div class="material-tabs" aria-label="Choose a material">${Object.entries(M.materials).map(([type,data])=>`<button class="material-tab ${material===type?'active':''}" data-material="${type}" aria-pressed="${material===type}"><span>${materialArt(type)}</span>${data.short}</button>`).join('')}</div>${material==='glass'?`<div class="notice amber route-scope">${icon('info')}<p>Glass is not collected at Riverside. These steps show a general route only.</p></div>`:''}<div class="timeline" aria-label="Material journey stages">${[['Collected','truck'],['Sorted','sort'],['Processed','process'],['A new use','loop']].map(([name,ic],n)=>{const [tag,tone]=material==='glass'?['Typical step','gray']:statusFor(n);return `<button class="stage ${stage===n?'active':''}" data-stage="${n}" aria-pressed="${stage===n}" aria-controls="stage-detail"><span class="stage-circle">${icon(ic)}</span><span class="stage-label"><span class="stage-number">0${n+1}</span><strong>${name}</strong><span class="tag ${tone}">${tag}</span></span></button>`}).join('')}</div><div id="stage-detail" aria-live="polite"></div><div class="journey-bottom"><div class="journey-actions"><button class="text-link" data-stage="${Math.max(0,stage-1)}" ${stage===0?'disabled':''}>${icon('back')}Previous step</button><span>${stage+1} of 4</span>${stage<3?`<button class="btn" data-stage="${stage+1}">Next step ${icon('arrow')}</button>`:link('results?period='+period,'See point results')}</div><p class="scope-note">Material routes explain what can happen. Point records cover a combined load, not your individual item.</p></div>`;
}
function fillStage() {
  const m = M.materials[material], r = M.reportFor(period), known = r.recovered!==null;
  const messages = [material==='paper'?'Paper and card are collected through their designated stream. The point’s records report a combined total across accepted materials.':'Accepted items are collected and taken for sorting. A collection record establishes the load weight, not the fate of each item.', 'Sorting separates usable material from rejects. Contamination can prevent some material from continuing.',m.process,m.caveat];
  const fact = material==='glass' ? 'No glass collection record at this point.' : [r.total.toLocaleString()+' kg collected across the demo point.',r.accepted.toLocaleString()+' kg accepted for processing across the demo point.', known ? r.recovered+' kg recovered material in the sample load.' : 'No processing outcome has been reported.', 'No record of the final products made.'][stage];
  const [tag,tone] = material==='glass'?['General explanation','gray']:statusFor(stage);
  const typeIcons=['truck','sort','process','loop'];
  $('#stage-detail').innerHTML = `<section class="stage-card"><div class="stage-illustration" style="background:${colors[material]}"><span class="stage-hero-icon">${icon(typeIcons[stage])}</span><div class="single-material">${materialArt(material)}</div></div><div class="stage-copy"><span class="tag ${tone}">${tag}</span><h2>${m.steps[stage]}</h2><p>${messages[stage]}</p><div class="stage-record">${icon('file')}<div><strong>${fact}</strong><span>${material==='glass'?'Outside this demo point’s service':period+' 2026 · Sample data · All accepted materials'}</span></div></div>${material==='glass'?sourceButton('journey','About this explanation'):sourceButton(['collection','sorting','processing','journey'][stage], stage===3?'What is and isn’t known':'View the record')}</div></section>`;
}
function report() {
  const r = M.reportFor(period), known = r.recovered!==null;
  const breakdown = known ? [[r.recovered,'Recovered material','var(--purple)'],[r.processLoss,'Processing loss','#a8be9e'],[r.rejected,'Sorting rejects','#f3b659'],[r.unclassified,'Unclassified','#c5c5d3']] : [[r.accepted,'Accepted for processing','var(--purple)'],[r.rejected,'Sorting rejects','#f3b659'],[r.unclassified,'Unclassified','#c5c5d3']];
  let sum=0;const segments=breakdown.map(([n,,c])=>{const prev=sum;sum+=n/r.total*100;return `${c} ${prev}% ${sum}%`}).join(',');
  return `${locationRow()}<div class="page-top report-top"><div><h1>What happened locally?</h1><p class="report-subtitle">Riverside Community Hub · Sample data</p></div><label class="period-control">Reporting month<select class="select" id="period">${Object.keys(M.reports).map(p=>`<option ${p===period?'selected':''}>${p}</option>`).join('')}</select></label></div><section class="outcome-banner ${known?'has-outcome':''}"><span class="outcome-icon">${icon(known?'loop':'process')}</span><div><span class="tag ${known?'green':'amber'}">${known?'Processing record available':'Waiting for the next record'}</span><h2>${known?'800 kg recovered for a new use.':'Collected and sorted. What comes next?'}</h2><p>${known?'In this example, material is ready for manufacturing. Final products are not reported.':'1,010 kg is ready for processing in this example. Its outcome is still unknown.'}</p></div></section><div class="summary-stats"><div class="stat"><span>Collected</span><strong>${r.total.toLocaleString()} <small>kg</small></strong><p>Combined load</p></div><div class="stat"><span>Accepted for processing</span><strong>${r.accepted.toLocaleString()} <small>kg</small></strong><p>${(r.accepted/r.total*100).toFixed(1)}% of the collected load</p></div><div class="stat"><span>Recovered material</span><strong>${known?r.recovered+' <small>kg</small>':'Awaiting record'}</strong><p>${known?'Manufacturing input · not finished products':'No outcome claim yet'}</p></div></div><div class="report-grid"><section><h2>The collected load, broken down.</h2><div class="result-donut"><div class="ring-chart" style="background:conic-gradient(${segments})" role="img" aria-label="${breakdown.map(([n,l])=>n+' kg '+l).join('; ')}"><div><strong>${r.total.toLocaleString()}</strong><span>kg collected</span></div></div><ul class="legend">${breakdown.map(([n,l,c])=>`<li><span class="dot" style="background:${c}"></span><span>${l}</span><strong>${n.toLocaleString()} kg</strong></li>`).join('')}</ul></div>${sourceButton(known?'processing':'sorting','How these numbers add up')}</section><section class="report-note"><h3>${known?'What this tells us.':'The missing piece.'}</h3><p>${known?'The example shows useful material recovered. It does not tell us what one person’s item became.':'We need a processor’s outcome record to know how much useful material was recovered.'}</p><p>${known?'Carbon savings and finished products are not measured.':'We won’t turn a collection weight into a recycling claim.'}</p>${!known?`<button class="text-link" data-report="September">See an example with an outcome ${icon('arrow')}</button>`:sourceButton('processing','See processing details')}</section></div><section class="section evidence-section"><div class="section-title"><h2>Follow the evidence.</h2><span class="tag gray">Updated ${r.updated}</span></div><div class="evidence-grid">${[['collection','Collection','truck'],['sorting','Sorting','sort'],['processing','Processing','process']].map(([id,label,ic],n)=>`<button class="evidence-card" data-source="${id}"><span class="preview-icon">${icon(ic)}</span><span class="tag ${n<2||known?'green':'amber'}">${n<2||known?'Sample record':'Awaiting record'}</span><h3>${label}</h3><span>${r.ref}</span><span class="text-link">${n<2||known?'Read record':'What is missing'} ${icon('arrow')}</span></button>`).join('')}</div><details class="evidence-note"><summary>About the data and its limits</summary><p>All quantities and records are fictional prototype scenarios. September demonstrates a processing outcome; October demonstrates an incomplete evidence chain. The figures cover a combined load, not one material or one person’s activity. A higher collection weight alone does not prove better recycling or lower emissions.</p></details></section><div class="help-strip"><div><h3>${saved?'This point is in your activity.':'Keep this point close.'}</h3><p>Return to its journey and available reports.</p></div><button class="btn secondary" data-action="save">${icon('saved')}${saved?'View my activity':'Save this point'}</button></div>`;
}
function savedPage() {
  return `<div class="intro"><h1>Your recycling, connected.</h1><p>Your actions and the local picture, in one place.</p></div>${!storageAvailable?'<div class="notice amber"><p>Storage is unavailable. Changes will last only while this page is open.</p></div>':''}<div class="activity-summary"><div><strong>${M.activityTotal(history)}</strong><span>${M.activityTotal(history)===1?'item':'items'} logged by you</span></div><div><strong>${history.length}</strong><span>${history.length===1?'action':'actions'}</span></div><div class="activity-summary-note">${icon('info')}<p>A personal log, not proof of collection or recycling.</p></div></div><section class="saved-point-summary"><span class="preview-icon">${icon('pin')}</span><div><span class="tag gray">${saved?'Saved point':'Current demo point'}</span><h2>Riverside Community Hub</h2><p>Latest report: October · Processing outcome pending</p></div><div class="stack">${link('results?period=October','View point results','btn secondary')}<button class="text-link" data-action="${saved?'unsave':'save'}">${saved?'Remove saved point':'Save this point'}</button></div></section><section class="section"><div class="section-title"><h2>Your activity</h2>${history.length||feedback.length?'<button class="text-link" data-action="export">Export my data '+icon('file')+'</button>':''}</div>${removed?`<div class="undo-banner" role="status"><span>Activity removed.</span><button class="text-link" data-action="undo">Undo ${icon('back')}</button></div>`:''}${history.length?history.map(h=>{const i=items.find(x=>x.id===h.id);return `<article class="activity-card"><span class="small-material" style="background:${colors[i.type]}">${materialArt(i.type)}</span><div class="activity-main"><h3>${i.name}<span class="quantity-pill">× ${h.quantity}</span></h3><p>${dateLabel(h.at)} · Riverside · Self-reported</p><div class="activity-links">${link(journeyRoute(i.type),'Follow this material','text-link')}<button class="text-link muted" data-remove="${escapeHTML(h.uid)}" aria-label="Remove ${escapeHTML(i.name)} action">Remove</button></div></div><span class="tag gray">Action logged</span></article>`}).join(''):`<div class="empty"><span class="empty-icon">${icon('loop')}</span><h2>Your next action starts here.</h2><p>Look up an accepted item, then log it after using the bin.</p>${link('sort','Find an item')}</div>`}<p class="scope-note">Point results describe earlier combined loads. They are not linked to your individual actions.</p>${history.length?'<button class="text-link" data-action="clear-history">Clear activity</button>':''}</section><section class="section"><div class="section-title"><h2>Your questions</h2><button class="text-link" data-action="feedback">Ask a question ${icon('chat')}</button></div>${removedQuestion?'<div class="undo-banner" role="status"><span>Question removed.</span><button class="text-link" data-action="undo-question">Undo</button></div>':''}${feedback.length?`<p class="scope-note">Saved on this browser. No questions have been sent to an operator.</p>${feedback.slice().reverse().slice(0,20).map(f=>`<article class="question-card"><span class="tag gray">Saved locally · Not sent</span><h3>${escapeHTML(f.type||'Question')}</h3><p>${escapeHTML(f.text)}</p><span class="question-context">${escapeHTML(f.context||'Recycling Loop')} · ${dateLabel(f.at)}</span><div class="activity-links"><button class="text-link" data-edit-question="${escapeHTML(f.uid)}">Edit question</button><button class="text-link muted" data-remove-question="${escapeHTML(f.uid)}">Remove</button></div></article>`).join('')}`:`<div class="notice">${icon('chat')}<p>No questions yet. Save anything you’d like to ask about the guidance or results.</p></div>`}</section>`;
}
function render() {
  const [path, qs=''] = (location.hash.slice(1)||'home').split('?');
  const params = new URLSearchParams(qs), page = path.split('/')[0];
  if (M.materials[params.get('material')]) material = params.get('material');
  if (params.has('stage')) stage = Math.min(3,Math.max(0,Number(params.get('stage'))||0));
  if (M.reports[params.get('period')]) period = params.get('period');
  navigation(page==='item'?'sort':page);
  const views={home,sort:sortPage,journey:journeyPage,results:report,saved:savedPage};
  $('#main').innerHTML=page==='item'?itemPage(path.split('/')[1]):(views[page]||home)();
  if(page==='sort') fillItems();
  if(page==='journey') fillStage();
  document.title=`${({home:'Explore',sort:'Find an item',item:'Item guidance',journey:'Material journey',results:'Local results',saved:'My activity'})[page]||'Explore'} · Recycling Loop`;
}
function toast(message) {
  $('#toast').textContent=message;$('#toast').classList.add('show');
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),4000);
}
function modal(html) {
  window.loopCamera?.stop();
  if(!$('#dialog').open) modalTrigger=document.activeElement;
  $('#dialog-content').innerHTML=html;
  const heading=$('#dialog-content h2');
  if(heading){heading.id='dialog-title';heading.setAttribute('tabindex','-1');$('#dialog').setAttribute('aria-labelledby','dialog-title');}
  if(!$('#dialog').open) $('#dialog').showModal();
  $('#dialog').scrollTop=0;(heading||$('#dialog .close')).focus();
}
function showSource(id) {
  const s=M.sourceFor(id,period) || (id==='rules'?{name:'Demo collection-point rules',kind:'Example rules',date:'6 November 2026',updated:'6 November 2026',ref:'RIV-01 · RULES',scope:'Riverside demo collection point',body:'The fictional point accepts plastic drinks bottles, aluminium drinks cans and clean cardboard. Glass and flexible plastic are excluded; lined cups require clarification.',limit:'These are not Bristol collection rules. Use the official provider’s guidance for real disposal.'}:{name:'How to read the journey',kind:'Typical route · not tracking',date:'13 November 2026',updated:'13 November 2026',ref:'ROUTE-01',scope:M.materials[material].name,body:'The illustrated route explains possible steps for a material. The point’s sample records describe a combined load. Neither is a record of your individual item.',limit:'Final products, individual destinations and carbon savings are not confirmed.'});
  modal(`<div class="modal-icon">${icon('file')}</div><h2>${s.name}</h2><span class="tag amber">${s.kind}</span><dl class="source-meta"><dt>Scope</dt><dd>${s.scope}</dd><dt>Period / date</dt><dd>${s.date}</dd><dt>Report ID</dt><dd>${s.ref}</dd><dt>Updated</dt><dd>${s.updated}</dd></dl><p>${s.body}</p><div class="notice">${icon('info')}<p>${s.limit}</p></div>${id==='rules'?`<div class="action-group">${guideLink()}</div>`:''}<button class="btn secondary full" data-question-context="${escapeHTML(s.name+' · '+s.date+' · '+s.ref)}">Ask about this record ${icon('chat')}</button>`);
}
function openLog(id) {
  const i=items.find(x=>x.id===id && x.state==='green');if(!i)return;
  pendingLog=id;
  modal(`<div class="modal-icon">${icon('check')}</div><h2>Add your action.</h2><div class="log-item"><span class="small-material" style="background:${colors[i.type]}">${materialArt(i.type)}</span><div><h3>${i.name}</h3><p>Riverside · Today</p></div></div><form id="log-form"><label for="log-quantity">How many did you put in?</label><div class="quantity-control"><button type="button" data-quantity="-1" aria-label="One fewer item" disabled>−</button><input id="log-quantity" type="number" min="1" max="20" step="1" value="1" required inputmode="numeric" aria-describedby="quantity-error"><button type="button" data-quantity="1" aria-label="One more item">+</button></div><p id="quantity-error" class="field-error" role="alert" hidden></p><p>This saves your action on this browser. It doesn’t track the item after collection.</p><button class="btn full" type="submit">Add to my activity ${icon('check')}</button></form><button class="text-link modal-cancel" data-action="close">Not yet</button>`);
}
function showItemHelp(id) {
  const i=items.find(x=>x.id===id);
  const context=i?i.name:query?query:'an unlisted item';
  modal(`<div class="modal-icon">${icon('search')}</div><h2>Find a reliable answer.</h2><p>${i?escapeHTML(i.name)+' is not confirmed for this demo bin.':'There is no confirmed rule for this item in the demo.'}</p><div class="help-options"><h3>Recycling in Bristol?</h3><p>Check the official guide for the service you use.</p>${guideLink()}<h3>Still have a question?</h3><p>Keep a note to ask your collection provider.</p><button class="btn secondary" data-question-context="${escapeHTML('Item: '+context+' · Riverside demo point')}">Save a question ${icon('chat')}</button></div>`);
}
function showFeedback(context, editId = null) {
  editingQuestion = editId;
  const existing=feedback.find(f=>f.uid===editId);
  questionContext=existing?.context||context||currentContext();
  const draft=read('feedback-draft',{});
  const text=existing?existing.text:(draft.context===questionContext?draft.text||'':'');
  modal(`<div class="modal-icon">${icon('chat')}</div><h2>${existing?'Edit your question.':'What would you like to know?'}</h2><p class="feedback-context">${escapeHTML(questionContext)}</p><form id="feedback-form"><label for="feedback-type">Topic</label><select class="select" id="feedback-type"><option>Recycling guidance</option><option>A journey stage</option><option>Results or evidence</option><option>Something else</option></select><label for="feedback-text">Your question</label><textarea id="feedback-text" placeholder="What is unclear or missing?" maxlength="1000" required>${escapeHTML(text)}</textarea><p class="field-error" id="feedback-error" role="alert" hidden></p><p>Saved only on this browser. Nothing is sent to an operator.</p><button class="btn full" type="submit">${existing?'Save changes':'Save my question'} ${icon('arrow')}</button></form>`);
  if(existing) $('#feedback-type').value=existing.type;
  else if(/record|results|processing|sorting|collection weight/i.test(questionContext)) $('#feedback-type').value='Results or evidence';
}
function currentContext() {
  const path=location.hash.slice(1).split('?')[0];
  if(path.startsWith('item/'))return 'Item: '+(items.find(i=>i.id===path.split('/')[1])?.name||'Unknown')+' · Riverside';
  if(path==='journey')return M.materials[material].name+' · Journey step '+(stage+1)+' · '+period+' 2026';
  if(path==='results')return 'Local results · '+period+' 2026 · Riverside';
  return 'Riverside demo point';
}
function changeJourney(key, value) {
  if(key==='material') {material=value;stage=0;} else stage=Number(value);
  location.hash=journeyRoute(material,stage);
}
function persistHistory() { return save('history',history); }
function exportData() {
  const data={product:'Recycling Loop prototype',exportedAt:new Date().toISOString(),scope:'Browser-local, self-reported demo data. No verified recycling outcomes.',savedPoint:saved?'riverside':null,activity:history,questions:feedback};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Recycling-Loop-My-Data.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
document.addEventListener('click',e=>{
  if(e.target.closest('.skip')){e.preventDefault();$('#main').focus();return;}
  const b=e.target.closest('[data-action],[data-source],[data-filter],[data-stage],[data-material],[data-report],[data-log],[data-quantity],[data-remove],[data-item-help],[data-question-context],[data-edit-question],[data-remove-question]');
  if(!b)return;
  if(b.dataset.editQuestion){showFeedback(null,b.dataset.editQuestion);return;}
  if(b.dataset.removeQuestion){removedQuestion=feedback.find(x=>x.uid===b.dataset.removeQuestion);feedback=feedback.filter(x=>x.uid!==b.dataset.removeQuestion);save('feedback',feedback);render();$('[data-action="undo-question"]')?.focus();toast('Question removed. Undo is available.');return;}
  if(b.dataset.source){showSource(b.dataset.source);return;}
  if(b.dataset.filter){filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(el=>{el.classList.toggle('active',el.dataset.filter===filter);el.setAttribute('aria-pressed',el.dataset.filter===filter);});fillItems();return;}
  if(b.dataset.stage!==undefined){changeJourney('stage',b.dataset.stage);return;}
  if(b.dataset.material){changeJourney('material',b.dataset.material);return;}
  if(b.dataset.report){location.hash='results?period='+b.dataset.report;return;}
  if(b.dataset.log){openLog(b.dataset.log);return;}
  if(b.dataset.itemHelp){showItemHelp(b.dataset.itemHelp);return;}
  if(b.dataset.questionContext){showFeedback(b.dataset.questionContext);return;}
  if(b.dataset.quantity){const input=$('#log-quantity');input.value=Math.min(20,Math.max(1,(Number(input.value)||1)+Number(b.dataset.quantity)));updateQuantity();return;}
  if(b.dataset.remove){removed=history.filter(x=>x.uid===b.dataset.remove);history=history.filter(x=>x.uid!==b.dataset.remove);persistHistory();render();$('[data-action="undo"]')?.focus();toast('Activity removed. Undo is available.');return;}
  const action=b.dataset.action;
  if(action==='close')$('#dialog').close();
  if(action==='about')modal(`<div class="modal-icon">${icon('loop')}</div><h2>See more. Assume less.</h2><p>Recycling Loop helps you sort an item, record your action and understand the results at a collection point.</p><p><strong>This is a working prototype.</strong> Riverside, its rules and all reporting figures are fictional. October shows an incomplete journey; September demonstrates a processing record.</p><p>Activity and questions stay on this browser. Photos are processed on your device. No live operator data, automatic item recognition or carbon calculation is connected.</p><button class="btn full" data-action="start">Explore ${icon('arrow')}</button>`);
  if(action==='start'){$('#dialog').close();location.hash='home';}
  if(action==='scan')window.loopCamera.open('qr');
  if(action==='photo')window.loopCamera.open('photo');
  if(action==='open-point'){$('#dialog').close();location.hash='sort';toast('Riverside demo point selected');}
  if(action==='location')modal(`<div class="modal-icon">${icon('pin')}</div><h2>Riverside Community Hub</h2><span class="tag">Fictional point · RIV-01</span><p>Plastic bottles, aluminium cans and clean cardboard are accepted in this example.</p><div class="location-modal-actions"><a class="btn full" href="#sort" data-action="close">Check an item ${icon('arrow')}</a><a class="btn secondary full" href="#results?period=October" data-action="close">View point results ${icon('results')}</a><button class="text-link" data-action="scan">${icon('scan')}Scan another point</button></div><p>One demo point is available. No live location or operator is connected.</p>`);
  if(action==='save'){if(saved){location.hash='saved';return;}saved=true;const persisted=save('saved',true);render();toast(persisted?'Point saved in My activity':'Point saved for this session only');}
  if(action==='unsave'){saved=false;save('saved',false);render();toast('Point removed. Your activity is unchanged.');}
  if(action==='clear-history')modal(`<h2>Clear your activity?</h2><p>Your saved point and questions will stay. You can undo the removal from My activity.</p><button class="btn full" data-action="close">Keep my activity</button><button class="text-link modal-cancel" data-action="confirm-clear">Clear activity</button>`);
  if(action==='confirm-clear'){removed=history.slice();history=[];persistHistory();$('#dialog').close();render();}
  if(action==='undo'&&removed){history=[...removed,...history].sort((a,b)=>Date.parse(b.at)-Date.parse(a.at));removed=null;persistHistory();render();toast('Activity restored');}
  if(action==='undo-question'&&removedQuestion){feedback.push(removedQuestion);feedback.sort((a,b)=>Date.parse(a.at)-Date.parse(b.at));removedQuestion=null;save('feedback',feedback);render();toast('Question restored');}
  if(action==='export')exportData();
  if(action==='feedback')showFeedback();
  if(action==='item-help')showItemHelp();
  if(action==='reset-search'){query='';filter='All';render();$('#item-search').focus();}
});
function updateQuantity(){
  const input=$('#log-quantity');if(!input)return;const value=M.validateQuantity(input.value);
  $('[data-quantity="-1"]').disabled=value!==null&&value<=1;$('[data-quantity="1"]').disabled=value!==null&&value>=20;
  input.setCustomValidity('');$('#quantity-error').hidden=true;
}
document.addEventListener('input',e=>{
  if(e.target.id==='item-search'){query=e.target.value;fillItems();}
  if(e.target.id==='log-quantity')updateQuantity();
  if(e.target.id==='feedback-text'){e.target.setCustomValidity('');$('#feedback-error').hidden=true;if(!editingQuestion)save('feedback-draft',{context:questionContext,text:e.target.value});}
});
document.addEventListener('change',e=>{if(e.target.id==='period')location.hash='results?period='+e.target.value;});
document.addEventListener('submit',e=>{
  if(e.target.id==='log-form'){
    e.preventDefault();if(!pendingLog)return;
    const item=items.find(i=>i.id===pendingLog),n=M.validateQuantity($('#log-quantity').value);
    if(n===null){$('#quantity-error').textContent='Enter a whole number from 1 to 20.';$('#quantity-error').hidden=false;$('#log-quantity').focus();return;}
    const uid=typeof crypto.randomUUID==='function'?crypto.randomUUID():Date.now()+'-'+Math.random().toString(36).slice(2);
    const record=M.createActivity(item,n,new Date().toISOString(),uid);if(!record)return;
    pendingLog=null;history.unshift(record);const persisted=persistHistory();
    if(window.loopTaskLogged){window.loopTaskLogged(item,n);return;}
    modal(`<div class="modal-icon">${icon('check')}</div><h2>Your action is logged.</h2><div class="log-item"><span class="small-material" style="background:${colors[item.type]}">${materialArt(item.type)}</span><div><h3>${escapeHTML(item.name)} × ${n}</h3><p>Riverside · ${persisted?'Saved on this browser':'This session only'}</p></div></div><p>Next, explore what can happen to this material after collection.</p><a class="btn full" href="#${journeyRoute(item.type)}" data-action="close">Follow the material ${icon('arrow')}</a><a class="text-link modal-cancel" href="#saved" data-action="close">View my activity ${icon('chevron')}</a><p class="scope-note">Self-reported action. No individual-item tracking.</p>`);
    return;
  }
  if(e.target.id!=='feedback-form')return;
  e.preventDefault();const text=$('#feedback-text').value.trim();
  if(!text){$('#feedback-error').textContent='Please enter your question.';$('#feedback-error').hidden=false;$('#feedback-text').focus();return;}
  const old=feedback.find(f=>f.uid===editingQuestion);
  const record={uid:old?.uid||'question-'+Date.now()+'-'+Math.random().toString(36).slice(2),type:$('#feedback-type').value,text,context:questionContext,at:old?.at||new Date().toISOString(),updatedAt:new Date().toISOString()};
  if(old)feedback=feedback.map(f=>f.uid===old.uid?record:f);else feedback.push(record);editingQuestion=null;const persisted=save('feedback',feedback);save('feedback-draft',{});
  if(location.hash.split('?')[0]==='#saved')render();
  modal(`<div class="modal-icon">${icon('check')}</div><h2>Your question is saved.</h2><span class="tag gray">${persisted?'On this browser':'This session only'} · Not sent</span><div class="receipt"><strong>${escapeHTML(record.type)}</strong><p>${escapeHTML(record.text)}</p><small>${escapeHTML(record.context)}</small></div><p>You can find it in My activity and export it to share yourself.</p><a class="btn full" href="#saved" data-action="close">View my questions ${icon('arrow')}</a><button class="text-link modal-cancel" data-action="close">Continue exploring</button>`);
});
$('#dialog').addEventListener('close',()=>{pendingLog=null;if(modalTrigger?.isConnected)modalTrigger.focus();else $('#main').focus({preventScroll:true});});
window.addEventListener('hashchange',()=>{
  const previous=document.activeElement?.closest('[data-stage],[data-material]')?.dataset;
  const activeId=document.activeElement?.id;
  render();
  if(activeId==='period') $('#period')?.focus({preventScroll:true});
  else if(previous?.stage!==undefined) $(`[data-stage="${stage}"]`)?.focus({preventScroll:true});
  else if(previous?.material) $(`[data-material="${material}"]`)?.focus({preventScroll:true});
  else {window.scrollTo(0,0);$('#main').focus({preventScroll:true});}
});
render();
if(new URLSearchParams(location.search).get('point')==='riverside')toast('Riverside demo collection point selected');

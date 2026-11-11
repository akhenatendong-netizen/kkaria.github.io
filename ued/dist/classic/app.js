(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const feelings = [
    {id:'calm', name:'Calm', color:'#86dbb1', light:'#c6ffda', dark:'#266b55', caption:'A little room to breathe.'},
    {id:'amazed', name:'Amazed', color:'#ff887e', light:'#ffc5ad', dark:'#993c46', caption:'Well, would you look at that.'},
    {id:'curious', name:'Curious', color:'#a995eb', light:'#e2d5ff', dark:'#524394', caption:'Curious by nature.'},
    {id:'confused', name:'Confused', color:'#79b9ed', light:'#c3eaff', dark:'#325e96', caption:'A question is a good beginning.'},
    {id:'neutral', name:'Neutral', color:'#eeca64', light:'#fff2b5', dark:'#96722c', caption:'Just taking it all in.'}
  ];
  const stations = [
    {id:'evolution', name:'Evolution Collection', detail:'Discover how plants changed through time'},
    {id:'glasshouses', name:'The Glasshouses', detail:'A different world, under glass'},
    {id:'useful', name:'Useful Plants', detail:'Plants that connect with everyday life'},
    {id:'entrance', name:'Garden Entrance', detail:'Your visit, from the very beginning'}
  ];
  const reasons = ['Plants & displays','Peace & atmosphere','Signs & information','Finding my way','Access & comfort','Something else'];
  const storageKey = 'garden-feelings-responses-v1';
  let records = [];
  try { const value = JSON.parse(localStorage.getItem(storageKey) || '[]'); if(Array.isArray(value)) records = value.filter(r => r && feelings.some(f=>f.id===r.emotion) && stations.some(s=>s.id===r.station)).slice(-2000); } catch(e) { /* A blocked store does not prevent trying the playground. */ }
  let station = stations[0], selected = feelings[2], latest = null, routeRecord = null;
  let reasonSet = new Set(), sound = false, audioContext, lastDrop = 0, toastTimer, inviteTimer;
  let reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let pointer = {x:0,y:0}, lastHero = 0, width = 0, height = 0, night = false;
  document.body.classList.toggle('reduced', reduced);
  const lookup = id => feelings.find(f=>f.id===id) || feelings[2];
  const place = id => stations.find(s=>s.id===id) || stations[0];
  const makeId = () => crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36)+Math.random().toString(36).slice(2);
  const toast = message => { $('toast').textContent=message; $('toast').classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>$('toast').classList.remove('show'),3200); };
  function persist() {
    try { localStorage.setItem(storageKey, JSON.stringify(records)); updateCount(); return true; }
    catch(e) { updateCount(); return false; }
  }
  function updateCount() { $('responseCount').textContent = `${records.length} ${records.length===1?'response':'responses'} on this device`; }
  function ping(pitch=500) {
    if(!sound) return;
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      if(audioContext.state==='suspended') audioContext.resume();
      const o=audioContext.createOscillator(), g=audioContext.createGain(), t=audioContext.currentTime;
      o.type='sine'; o.frequency.setValueAtTime(pitch,t);o.frequency.exponentialRampToValueAtTime(pitch*.65,t+.16);
      g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.08,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+.22);
      o.connect(g);g.connect(audioContext.destination);o.start(t);o.stop(t+.24);
    } catch(e) { sound=false; }
  }

  // A projected LED lattice: individual light points compress around the curved edge.
  // The physics remain in one plane; all apparent depth comes from the material.
  function sphere(f, size=280, gaze={x:0,y:0}, blink=false) {
    const source=document.createElement('canvas');source.width=source.height=size;
    const c=source.getContext('2d',{willReadFrequently:true}), r=size*.46, mid=size/2;
    c.translate(mid,mid);
    const glow=c.createRadialGradient(-r*.34,-r*.4,r*.02,-r*.1,-r*.12,r*1.14);
    glow.addColorStop(0,f.light);glow.addColorStop(.38,f.color);glow.addColorStop(.78,f.color);glow.addColorStop(1,f.dark);
    c.fillStyle=glow;c.beginPath();c.arc(0,0,r,0,Math.PI*2);c.fill();
    c.save(); c.beginPath();c.arc(0,0,r,0,Math.PI*2);c.clip();
    const sx=r*.32, eyeY=-r*.16, ew=r*.22, eh=r*.31;
    const ellipse=(x,y,rx,ry,color)=>{c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();};
    const line=(x1,y1,cx,cy,x2,y2,lw=r*.045,color='#243144')=>{c.strokeStyle=color;c.lineWidth=lw;c.lineCap='round';c.beginPath();c.moveTo(x1,y1);c.quadraticCurveTo(cx,cy,x2,y2);c.stroke();};
    const ink='#222b3c';
    if(f.id==='calm' || blink) {
      [-1,1].forEach(sign=>line(sign*sx-ew*.8,eyeY,sign*sx,eyeY+eh*.43,sign*sx+ew*.8,eyeY,r*.05));
    } else {
      [-1,1].forEach(sign=>{
        const eyeH=f.id==='neutral'?eh*.73:eh;
        const y=eyeY+(f.id==='confused'&&sign===1?r*.08:0);
        ellipse(sign*sx,y,ew,eyeH,'#fff9df');
        const px=sign*sx+gaze.x*r*.1+(f.id==='curious'?r*.06:0), py=y+gaze.y*r*.08;
        ellipse(px,py,ew*.51,eyeH*.63,ink);
        ellipse(px-ew*.13,py-eyeH*.24,ew*.12,eyeH*.13,'#fff');
      });
    }
    if(f.id==='amazed') { ellipse(0,r*.40,r*.135,r*.18,ink);ellipse(0,r*.48,r*.08,r*.04,'#ec9398'); }
    else if(f.id==='confused') {
      line(-r*.18,r*.4,0,r*.28,r*.18,r*.37);
      line(-r*.51,-r*.58,-r*.34,-r*.48,-r*.17,-r*.52,r*.04);
      line(r*.17,-r*.53,r*.34,-r*.71,r*.51,-r*.62,r*.04);
    } else if(f.id==='neutral') line(-r*.16,r*.38,0,r*.39,r*.16,r*.38,r*.042);
    else line(-r*.24,r*.32,0,r*.58,r*.24,r*.32,r*.047);
    if(f.id==='curious') line(r*.15,-r*.61,r*.34,-r*.72,r*.5,-r*.64,r*.035);
    if(f.id==='calm') {ellipse(-r*.57,r*.16,r*.12,r*.05,'#72b697');ellipse(r*.57,r*.16,r*.12,r*.05,'#72b697');}
    // Gentle spherical fall-off on the whole display, including the face.
    const shade=c.createRadialGradient(-r*.2,-r*.3,r*.3,0,0,r);
    shade.addColorStop(0,'#06172000');shade.addColorStop(.72,'#06172000');shade.addColorStop(1,'#06172077');
    c.fillStyle=shade;c.fillRect(-r,-r,2*r,2*r);c.restore();
    const pixels=c.getImageData(0,0,size,size).data;
    const out=document.createElement('canvas');out.width=out.height=size;
    const o=out.getContext('2d');
    o.fillStyle=f.dark;o.beginPath();o.arc(mid,mid,r,0,Math.PI*2);o.fill();
    o.globalAlpha=.5;o.drawImage(source,0,0);o.globalAlpha=1;
    const rings=size>=500?128:78;
    const step=Math.PI/rings, dot=r*step*.43;
    for(let row=1;row<rings;row++) {
      const lat=-Math.PI/2+row*step, cl=Math.cos(lat), y=mid+r*Math.sin(lat);
      for(let lon=-Math.PI/2+step*.5;lon<Math.PI/2;lon+=step) {
        const x=mid+r*cl*Math.sin(lon), cos=Math.cos(lon);
        const xi=Math.max(0,Math.min(size-1,Math.round(x))), yi=Math.max(0,Math.min(size-1,Math.round(y))), p=(yi*size+xi)*4;
        o.fillStyle=`rgb(${pixels[p]},${pixels[p+1]},${pixels[p+2]})`;
        o.beginPath();o.ellipse(x,y,Math.max(.25,dot*cl*cos),Math.max(.25,dot*cl),0,0,Math.PI*2);o.fill();
      }
    }
    // A faint rim suggests the physical screen without a glossy plastic coating.
    o.strokeStyle='#ffffff20';o.lineWidth=size*.002;o.beginPath();o.arc(mid,mid,r-.5,Math.PI*.92,Math.PI*1.8);o.stroke();
    return out;
  }
  const sprites=new Map(feelings.map(f=>[f.id,sphere(f)]));
  const heroContext=$('heroCanvas').getContext('2d');
  function renderHero(time, force=false) {
    if(!force && time-lastHero<125) return;
    lastHero=time;
    const blink=!reduced && (time%5200)>4990;
    const canvas=sphere(selected,640,reduced?{x:0,y:0}:pointer,blink);
    heroContext.clearRect(0,0,640,640);heroContext.drawImage(canvas,0,0);
  }
  feelings.forEach(f=>{
    const b=document.createElement('button');b.className='feeling-choice';b.dataset.feeling=f.id;b.setAttribute('aria-label',`Leave ${f.id==='amazed'?'an':'a'} ${f.name.toLowerCase()} feeling`);
    const c=document.createElement('canvas');c.width=c.height=160;c.setAttribute('aria-hidden','true');c.getContext('2d').drawImage(sprites.get(f.id),0,0,160,160);
    const label=document.createElement('span');label.textContent=f.name;b.append(c,label);
    b.addEventListener('pointerenter',()=>preview(f));b.addEventListener('focus',()=>preview(f));
    b.addEventListener('click',()=>dropFeeling(f,b));$('choices').append(b);
  });
  function preview(f) {
    selected=f;$('characterName').textContent=f.caption;$('heroBall').setAttribute('aria-label',`Drop ${f.id==='amazed'?'an':'a'} ${f.name.toLowerCase()} feeling`);renderHero(performance.now(),true);
    document.querySelectorAll('.feeling-choice').forEach(b=>b.classList.toggle('selected',b.dataset.feeling===f.id));
  }

  const {Engine,Bodies,Body,Composite,Query,Constraint,Events}=Matter;
  const engine=Engine.create({positionIterations:10,velocityIterations:8,enableSleeping:true});engine.gravity.y=1.2;
  let balls=[], walls=[], dragging=null, dragConstraint=null, dragPointer=null, pointerMoved=false, dragStart=null;
  const canvas=$('world'), ctx=canvas.getContext('2d');
  function addBall(f,x,y,r,seed=false) {
    const body=Bodies.circle(x,y,r,{restitution:.43,friction:.3,frictionStatic:.7,frictionAir:.008,density:.002,slop:.025,sleepThreshold:70});
    body.feeling=f.id;body.seed=seed;body.renderRadius=r;Body.setAngle(body,(Math.random()-.5)*.6);Composite.add(engine.world,body);balls.push(body);return body;
  }
  function resize() {
    const rect=$('experience').getBoundingClientRect();if(!rect.width || !rect.height)return;
    const oldWidth=width; width=rect.width;height=rect.height;
    const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
    walls.forEach(w=>Composite.remove(engine.world,w));
    const floor=height-(width<=800?38:45), inset=width<=800?9:17;
    walls=[Bodies.rectangle(width/2,floor+45,width,90,{isStatic:true}),Bodies.rectangle(inset-45,height/2,90,height*3,{isStatic:true}),Bodies.rectangle(width-inset+45,height/2,90,height*3,{isStatic:true})];Composite.add(engine.world,walls);
    if(!oldWidth) {
      const r=width<=800?24:(height<800?32:37), gap=1, columns=Math.floor((width-inset*2)/(r*2+gap)), count=Math.floor(columns*(width>800&&height<800?1.65:2.55));
      for(let i=0;i<count;i++) {
        const row=Math.floor(i/columns), col=i%columns, rr=r*(.91+Math.random()*.16);
        addBall(feelings[(i*3+row)%5],inset+r+col*(r*2+gap)+(row%2?r*.3:0),floor-r-row*(r*1.82)-3,rr,true);
      }
      for(let i=0;i<120;i++)Engine.update(engine,1000/60);
    } else {
      if(dragConstraint){Composite.remove(engine.world,dragConstraint);dragConstraint=null;dragging=null;}
      const mobileChange=(oldWidth<=800)!==(width<=800);
      balls.forEach(b=>{
        if(mobileChange){const scale=width<=800?24/37:37/24;Body.scale(b,scale,scale);b.renderRadius*=scale;}
        Body.setPosition(b,{x:Math.max(inset+b.renderRadius,Math.min(width-inset-b.renderRadius,b.position.x*width/oldWidth)),y:Math.min(floor-b.renderRadius,b.position.y)});Body.setVelocity(b,{x:0,y:0});Matter.Sleeping.set(b,false);
      });
    }
  }
  new ResizeObserver(resize).observe($('experience'));
  function dropFeeling(f,element) {
    const now=performance.now();if(now-lastDrop<700)return;lastDrop=now;preview(f);
    const rect=element.getBoundingClientRect(), parent=$('experience').getBoundingClientRect(), r=width<=800?25:39;
    const x=Math.max(r+20,Math.min(width-r-20,rect.x+rect.width/2-parent.x));
    const y=reduced?height-(width<=800?38:45)-r*4:rect.bottom-parent.y+r;
    const b=addBall(f,x,y,r);Body.setVelocity(b,{x:(Math.random()-.5)*3,y:reduced?0:-2});Body.setAngularVelocity(b,(Math.random()-.5)*.065);
    if(balls.length>100){const victim=balls.find(item=>item.seed)||balls[0];Composite.remove(engine.world,victim);balls=balls.filter(item=>item!==victim);}
    latest={id:makeId(),emotion:f.id,station:station.id,time:new Date().toISOString(),source:'screen',reasons:[],notes:''};records.push(latest);
    if(reduced)for(let i=0;i<100;i++)Engine.update(engine,1000/60);
    const saved=persist();toast(saved?`Your ${f.name.toLowerCase()} moment is saved. Thank you.`:'Feeling added. Browser storage is unavailable.');ping(520+feelings.indexOf(f)*80);
    clearTimeout(inviteTimer);inviteTimer=setTimeout(()=>showInvitation(latest),reduced?0:700);
  }
  $('heroBall').addEventListener('click',()=>dropFeeling(selected,$('heroBall')));
  function atPointer(e){const rect=canvas.getBoundingClientRect();return{x:e.clientX-rect.left,y:e.clientY-rect.top};}
  canvas.addEventListener('pointerdown',e=>{
    const point=atPointer(e), hits=Query.point(balls,point);if(!hits.length)return;
    dragging=hits[hits.length-1];Matter.Sleeping.set(dragging,false);dragStart=point;pointerMoved=false;dragPointer=e.pointerId;canvas.setPointerCapture(e.pointerId);
    dragConstraint=Constraint.create({pointA:point,bodyB:dragging,pointB:{x:point.x-dragging.position.x,y:point.y-dragging.position.y},length:0,stiffness:.16,damping:.12});Composite.add(engine.world,dragConstraint);canvas.style.cursor='grabbing';
  });
  canvas.addEventListener('pointermove',e=>{
    const point=atPointer(e);
    if(dragConstraint&&e.pointerId===dragPointer){dragConstraint.pointA=point;pointerMoved ||=Math.hypot(point.x-dragStart.x,point.y-dragStart.y)>8;}
    else canvas.style.cursor=Query.point(balls,point).length?'grab':'default';
  });
  function release(e){if(e.pointerId!==dragPointer)return;if(dragConstraint)Composite.remove(engine.world,dragConstraint);if(dragging){Body.setVelocity(dragging,{x:Math.max(-18,Math.min(18,dragging.velocity.x)),y:Math.max(-22,Math.min(20,dragging.velocity.y))});if(!pointerMoved)Body.applyForce(dragging,dragging.position,{x:(Math.random()-.5)*.012,y:-.045});}dragConstraint=null;dragging=null;dragPointer=null;canvas.style.cursor='grab';}
  canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);
  document.addEventListener('pointermove',e=>{const rect=$('heroCanvas').getBoundingClientRect();pointer={x:Math.max(-1,Math.min(1,(e.clientX-rect.x-rect.width/2)/300)),y:Math.max(-1,Math.min(1,(e.clientY-rect.y-rect.height/2)/300))};},{passive:true});
  let lastSound=0;
  Events.on(engine,'collisionStart',event=>{const now=performance.now();if(now-lastSound>150&&event.pairs.some(p=>Math.max(p.bodyA.speed,p.bodyB.speed)>3)){lastSound=now;ping(180+Math.random()*180);}});
  let previous=performance.now(), accumulator=0;
  function frame(time){requestAnimationFrame(frame);const elapsed=Math.min(50,time-previous);previous=time;if(document.hidden||$('experience').hidden)return;accumulator+=elapsed;while(accumulator>=1000/60){Engine.update(engine,1000/60);accumulator-=1000/60;}
    ctx.clearRect(0,0,width,height);
    balls.forEach(b=>{
      const r=b.renderRadius;
      if(b.position.y>height+200){Body.setPosition(b,{x:width/2,y:height-160});Body.setVelocity(b,{x:0,y:0});}
      ctx.save();ctx.translate(b.position.x,b.position.y);ctx.rotate(b.angle);
      ctx.shadowColor=night?'#0006':'#23424f35';ctx.shadowBlur=5;ctx.shadowOffsetY=3;
      const s=r/.46;ctx.drawImage(sprites.get(b.feeling),-s/2,-s/2,s,s);ctx.restore();
    });renderHero(time);
  }
  requestAnimationFrame(frame);

  function feedbackURL(record) {const q=new URLSearchParams({id:record.id,e:record.emotion,s:record.station});return `${location.origin}${location.pathname}#feedback?${q}`;}
  function showInvitation(record) {
    const code=qrcode(0,'M');code.addData(feedbackURL(record));code.make();$('qr').innerHTML=code.createSvgTag({cellSize:3,margin:4,scalable:true});$('qr').setAttribute('aria-label','QR code to continue this feedback on your phone');$('feedbackPrompt').hidden=false;
  }
  $('closePrompt').onclick=()=>$('feedbackPrompt').hidden=true;
  $('openFeedback').onclick=()=>{if(latest)location.href=feedbackURL(latest);};
  $('backHome').onclick=()=>{location.hash='';};
  reasons.forEach(reason=>{const button=document.createElement('button');button.type='button';button.className='reason-chip';button.textContent=reason;button.setAttribute('aria-pressed','false');button.onclick=()=>{if(reasonSet.has(reason))reasonSet.delete(reason);else reasonSet.add(reason);button.classList.toggle('active',reasonSet.has(reason));button.setAttribute('aria-pressed',String(reasonSet.has(reason)));};$('reasonChoices').append(button);});
  function route() {
    const isForm=location.hash.startsWith('#feedback?');$('experience').hidden=isForm;$('mobileFeedback').hidden=!isForm;
    if(!isForm){$('feedbackPrompt').hidden=true;requestAnimationFrame(resize);return;}
    const params=new URLSearchParams(location.hash.split('?')[1]);const f=lookup(params.get('e')), s=place(params.get('s'));
    const id=/^[a-zA-Z0-9-]{8,80}$/.test(params.get('id')||'')?params.get('id'):makeId();
    routeRecord=records.find(r=>r.id===id)||{id,emotion:f.id,station:s.id,time:new Date().toISOString(),source:'phone',reasons:[],notes:''};
    $('feedbackContext').textContent=`Feeling ${lookup(routeRecord.emotion).name.toLowerCase()} at ${place(routeRecord.station).name}.`;
    $('formCanvas').getContext('2d').clearRect(0,0,240,240);$('formCanvas').getContext('2d').drawImage(sprites.get(routeRecord.emotion),0,0,240,240);
    reasonSet=new Set(routeRecord.reasons||[]);document.querySelectorAll('.reason-chip').forEach(button=>{button.classList.toggle('active',reasonSet.has(button.textContent));button.setAttribute('aria-pressed',String(reasonSet.has(button.textContent)));});$('notes').value=routeRecord.notes||'';
    $('feedbackSuccess').hidden=true;$('feedbackFormWrap').hidden=false;scrollTo(0,0);
  }
  window.addEventListener('hashchange',route);
  $('feedbackForm').onsubmit=e=>{
    e.preventDefault();if(!routeRecord)return;
    const record={...routeRecord,reasons:[...reasonSet],notes:$('notes').value.trim().slice(0,800),updatedAt:new Date().toISOString()};
    const index=records.findIndex(r=>r.id===record.id);if(index<0)records.push(record);else records[index]=record;
    if(!persist()){alert('This browser could not save your feedback. Please allow browser storage and try again.');return;}
    $('feedbackFormWrap').hidden=true;$('feedbackSuccess').hidden=false;scrollTo(0,0);
  };
  $('themeBtn').onclick=()=>{night=!night;document.body.classList.toggle('night',night);$('themeBtn').setAttribute('aria-label',night?'Switch to day mode':'Switch to night mode');$('themeBtn').setAttribute('aria-pressed',String(night));};
  $('soundBtn').onclick=()=>{sound=!sound;$('soundBtn').setAttribute('aria-pressed',String(sound));$('soundBtn').setAttribute('aria-label',sound?'Mute sound':'Enable sound');$('soundWave').setAttribute('d',sound?'M15 8c3 2 3 6 0 8m3-11c5 4 5 10 0 14':'m16 9 5 6m0-6-5 6');ping();};
  $('motionBtn').onclick=()=>{reduced=!reduced;document.body.classList.toggle('reduced',reduced);$('motionBtn').textContent=reduced?'Enable gentle motion':'Reduce motion';$('motionBtn').setAttribute('aria-pressed',String(reduced));};
  $('motionBtn').textContent=reduced?'Enable gentle motion':'Reduce motion';
  $('aboutBtn').onclick=()=>$('infoDialog').showModal();$('locationBtn').onclick=()=>$('locationDialog').showModal();
  stations.forEach(s=>{const b=document.createElement('button');b.className='location-option';const text=document.createElement('span');text.textContent=s.name;const small=document.createElement('small');small.textContent=s.detail;text.append(small);const arrow=document.createElement('span');arrow.textContent='↗';b.append(text,arrow);b.onclick=()=>{station=s;$('locationLabel').textContent=s.name;$('locationDialog').close();$('feedbackPrompt').hidden=true;toast(`Your next feeling will be for ${s.name}.`);};$('locations').append(b);});
  document.querySelectorAll('.dialog-close').forEach(b=>b.onclick=()=>b.closest('dialog').close());
  document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
  function showInsights(){
    const root=$('insightsContent');root.replaceChildren();
    feelings.forEach(f=>{const row=document.createElement('div');row.className='insight-row';const dot=document.createElement('span');dot.className='insight-dot';dot.style.background=f.color;const label=document.createElement('span');label.textContent=f.name;const count=document.createElement('b');count.textContent=String(records.filter(r=>r.emotion===f.id).length);row.append(dot,label,count);root.append(row);});
    if(!records.length){const p=document.createElement('p');p.className='empty';p.textContent='Your garden is waiting for its first feeling.';root.append(p);}
    records.slice(-12).reverse().forEach(r=>{const item=document.createElement('div');item.className='insight-record';const title=document.createElement('b');title.textContent=`${lookup(r.emotion).name} · ${place(r.station).name}`;const time=document.createElement('small');time.textContent=new Date(r.time).toLocaleString('en-GB',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});item.append(title,time);
      if(r.reasons?.length){const reasons=document.createElement('p');reasons.textContent=r.reasons.join(' · ');item.append(reasons);}if(r.notes){const note=document.createElement('p');note.textContent=r.notes;item.append(note);}root.append(item);});
    $('exportBtn').disabled=!records.length;$('insightsDialog').showModal();
  }
  $('insightsBtn').onclick=showInsights;
  $('exportBtn').onclick=()=>{const data={project:'Garden Feelings',scope:'Prototype responses from this browser only. Seeded display balls excluded.',exportedAt:new Date().toISOString(),responses:records};const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=`garden-feelings-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  updateCount();preview(selected);route();
})();

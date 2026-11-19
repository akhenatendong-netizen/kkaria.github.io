import {feelings,faceSVG} from './data.js';
import {putResponse,removeResponse} from './response-store.js?v=20261119';
function sphere(f,size=280){
 const out=document.createElement('canvas');out.width=out.height=size;const c=out.getContext('2d');c.scale(size/80,size/80);
 const gradient=c.createRadialGradient(24,20,0,24,20,60);gradient.addColorStop(0,f.light);gradient.addColorStop(.55,f.color);gradient.addColorStop(1,f.color);
 c.fillStyle=gradient;c.beginPath();c.arc(40,40,37,0,Math.PI*2);c.fill();
 const ellipse=(x,y,rx,ry,color)=>{c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();};
 const stroke=(draw,width=2.7)=>{c.strokeStyle='#354448';c.lineWidth=width;c.lineCap='round';c.beginPath();draw();c.stroke();};
 c.save();c.translate(27,14);c.rotate(-24*Math.PI/180);ellipse(0,0,11,4,'#ffffff59');c.restore();
 if(f.id==='calm')stroke(()=>{c.moveTo(22,30);c.quadraticCurveTo(28,37,34,30);c.moveTo(46,30);c.quadraticCurveTo(52,37,58,30);},3);
 else [28,52].forEach(x=>{ellipse(x,29,8,10,'#fffbea');ellipse(x+1,30,3.8,6,'#303b45');ellipse(x,27,1.3,1.3,'white');});
 if(f.id==='amazed')ellipse(40,53,6,8,'#354448');
 else if((f.id==='confused'||f.id==='uncomfortable'))stroke(()=>{c.moveTo(33,54);c.quadraticCurveTo(40,46,47,52);c.moveTo(19,16);c.lineTo(34,21);c.moveTo(47,18);c.lineTo(60,13);},2.5);
 else if((f.id==='neutral'||f.id==='other'))stroke(()=>{c.moveTo(33,53);c.lineTo(47,53);});
 else stroke(()=>{c.moveTo(29,49);c.quadraticCurveTo(40,63,51,49);});
 return out;
}


const reasons=['Plants & wildlife','Atmosphere','Signs & information','Finding my way','Access & comfort','Something else'];
export class JarStage {
 constructor(events={}){
  this.events=events;this.opened=false;this.bodies=[];this.walls=[];this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  this.textures=new Map(feelings.map(f=>[f.id,sphere(f)]));
  this.engine=globalThis.Matter?Matter.Engine.create({positionIterations:10,velocityIterations:8,enableSleeping:true}):null;
  if(this.engine)this.engine.gravity.y=.9;
  this.dialog=document.createElement('dialog');this.dialog.className='jar-stage revised-jar';this.dialog.setAttribute('aria-labelledby','jarHeading');
  this.dialog.innerHTML=`<canvas class="jar-world" aria-hidden="true"></canvas><div class="jar-glass jar-left"></div><div class="jar-glass jar-right"></div><div class="jar-glass jar-bottom"></div><div class="jar-top"><span class="jar-zone"></span><button class="jar-exit" aria-label="Close feedback">×</button></div><div class="jar-content"></div><p class="jar-demo-label" hidden>Decorative spheres · not visitor results</p><p class="jar-status" role="status" aria-live="polite"></p>`;
  document.body.append(this.dialog);this.content=this.dialog.querySelector('.jar-content');this.canvas=this.dialog.querySelector('canvas');this.ctx=this.canvas.getContext('2d');
  this.dialog.querySelector('.jar-exit').onclick=()=>this.exit();this.dialog.addEventListener('cancel',e=>{e.preventDefault();this.exit();});
  this.dialog.addEventListener('close',()=>{this.opened=false;cancelAnimationFrame(this.raf);this.events.close?.();this.opener?.focus?.({preventScroll:true});});
  this.canvas.addEventListener('pointerdown',e=>{
   if(!this.engine||!this.record)return;
   const point=this.localPoint(e),body=Matter.Query.point(this.bodies,point).at(-1);
   if(!body)return;
   e.preventDefault();this.releaseBall();Matter.Sleeping.set(body,false);
   this.dragged=body;this.constraint=Matter.Constraint.create({bodyB:body,pointA:point,pointB:{x:0,y:0},stiffness:.16,damping:.12,length:0});
   Matter.Composite.add(this.engine.world,this.constraint);this.canvas.setPointerCapture(e.pointerId);this.canvas.classList.add('dragging');this.startPhysics();
  });
  this.canvas.addEventListener('pointermove',e=>{if(this.constraint)this.constraint.pointA=this.localPoint(e);});
  for(const event of ['pointerup','pointercancel','lostpointercapture'])this.canvas.addEventListener(event,()=>this.releaseBall());
  document.addEventListener('visibilitychange',()=>{this.last=performance.now();});
  addEventListener('resize',()=>{if(this.opened){this.resize();if(this.record)this.populate(false);}});
 }
 setReduced(value){this.reduced=value;if(this.opened&&this.record)this.populate(false);}
 status(message){this.dialog.querySelector('.jar-status').textContent=message;}
 open(zone,record=null){if(this.opened)return;this.zone=zone;this.record=record?structuredClone(record):null;this.persisted=!!record;this.context=record?.context||'prototype';this.opener=document.activeElement;this.opened=true;this.dialog.querySelector('.jar-zone').textContent=zone.name;this.dialog.classList.remove('jar-leaving');this.dialog.showModal();this.resize();this.status('');if(record){this.showThanks();this.populate(false);}else this.showChoices();}
 resetJar(){cancelAnimationFrame(this.raf);this.releaseBall();this.finishDrop();this.bodies=[];if(this.engine){Matter.Composite.clear(this.engine.world,false);this.walls=[];this.resize();}this.ctx.clearRect(0,0,this.width,this.height);this.dialog.querySelector('.jar-demo-label').hidden=true;}
 showChoices(){this.resetJar();this.content.innerHTML=`<h1 id="jarHeading" tabindex="-1">How did this area feel?</h1><p class="lead">Choose the feeling closest to your experience.</p><div class="emotion-grid" role="group" aria-label="Choose a feeling"></div><p class="privacy-note">Saved on this device only. Not sent to the Garden.</p>${this.record?'<button class="link-button feedback-back">Back to my feedback</button>':''}`;for(const f of feelings){const b=document.createElement('button');b.className='emotion-choice';b.innerHTML=faceSVG(f,'choice')+'<span>'+f.name+'</span>';b.onclick=()=>this.choose(f);this.content.querySelector('.emotion-grid').append(b);}const back=this.content.querySelector('.feedback-back');if(back)back.onclick=()=>{this.showThanks();this.populate(false);};this.focusHeading();}
 choose(f){const now=new Date().toISOString();this.record={...(this.record||{id:crypto.randomUUID(),time:now,reasons:[],notes:''}),zone:this.zone.id,context:this.context,emotion:f.id,updatedAt:now};this.persisted=putResponse(this.record);this.events.pick?.(f);this.showThanks();this.populate(true);this.status(this.persisted?'Feeling saved on this device.':'Storage unavailable. Your choice is shown but has not been saved.');}
 showThanks(){const f=feelings.find(f=>f.id===this.record.emotion);this.content.innerHTML=`<h1 id="jarHeading" tabindex="-1">${this.persisted?'Your feeling is here.':'Your feeling is shown.'}</h1><p class="lead selected-feeling"></p><p class="privacy-note">${this.persisted?'Saved in this browser.':'Not saved: browser storage is unavailable.'} Not sent to the Garden.</p><div class="result-actions"><button class="solid add-reason">${this.record.notes||this.record.reasons.length?'Edit the details':'Add a reason'} <span>↗</span></button><button class="outline finish">Done</button></div><div class="small-actions"><button class="link-button change-feeling">Change feeling</button><button class="link-button withdraw">Remove my feedback</button></div><details class="phone-option"><summary>Use a phone instead</summary><div class="qr-holder"></div><p class="phone-note"></p></details>`;this.content.querySelector('.selected-feeling').textContent=f.name;this.content.querySelector('.add-reason').onclick=()=>this.showDetails();this.content.querySelector('.finish').onclick=()=>this.exit();this.content.querySelector('.change-feeling').onclick=()=>this.showChoices();this.content.querySelector('.withdraw').onclick=()=>this.withdraw();this.renderQR();this.focusHeading();}
 renderQR(){const url=new URL('index.html',location.href);url.searchParams.set('area',this.zone.id);const hosted=location.protocol==='https:'&&!/^(localhost|127\.|0\.0\.0\.0)/.test(location.hostname);const note=this.content.querySelector('.phone-note');if(!hosted){note.textContent='Phone QR becomes available after this folder is published at an HTTPS address. You can add a reason here now.';return;}if(globalThis.qrcode){const qr=qrcode(0,'M');qr.addData(url.href);qr.make();this.content.querySelector('.qr-holder').innerHTML=qr.createSvgTag({cellSize:4,margin:4,scalable:true});}note.textContent='Opens this area on your phone as a new entry. Your current choice is not transferred. To move to your phone, remove this entry first.';const a=document.createElement('a');a.href=url.href;a.textContent='Open the same area';this.content.querySelector('.phone-option').append(a);}
 showDetails(){this.content.innerHTML=`<h1 id="jarHeading" tabindex="-1">What shaped that feeling?</h1><p class="lead">Add as much or as little as you like.</p><form class="detail-form"><fieldset><legend>Choose any reasons <span>Optional</span></legend><div class="reason-grid"></div></fieldset><label for="jarNote">Anything to add? <span>Optional</span></label><textarea id="jarNote" rows="3" maxlength="500" placeholder="An experience, a suggestion, or something that could be clearer…"></textarea><p class="privacy-note">Avoid names, contact details or health information. Text stays in this browser; anyone using this device may be able to view it.</p><div class="result-actions"><button type="submit" class="solid">Save details here</button><button type="button" class="outline details-back">Back</button></div></form>`;const selected=new Set(this.record.reasons);for(const reason of reasons){const b=document.createElement('button');b.type='button';b.className='reason-chip';b.textContent=reason;b.setAttribute('aria-pressed',String(selected.has(reason)));b.onclick=()=>{if(selected.has(reason))selected.delete(reason);else selected.add(reason);b.setAttribute('aria-pressed',String(selected.has(reason)));};this.content.querySelector('.reason-grid').append(b);}const note=this.content.querySelector('textarea');note.value=this.record.notes;this.content.querySelector('.details-back').onclick=()=>this.showThanks();this.content.querySelector('form').onsubmit=e=>{e.preventDefault();this.record={...this.record,reasons:[...selected],notes:note.value.trim(),updatedAt:new Date().toISOString()};this.persisted=putResponse(this.record);this.showThanks();this.status(this.persisted?'Details saved on this device.':'Details could not be saved. Browser storage is unavailable.');};this.focusHeading();}
 withdraw(){if(!removeResponse(this.record.id)){this.status('Could not remove the saved entry. Try clearing this site’s storage in your browser.');return;}this.record=null;this.persisted=false;this.resetJar();this.content.innerHTML=`<h1 id="jarHeading" tabindex="-1">Feedback removed.</h1><p class="lead">This entry is no longer saved in this browser.</p><div class="result-actions"><button class="solid restart">Choose again</button><button class="outline finish">Done</button></div>`;this.content.querySelector('.restart').onclick=()=>this.showChoices();this.content.querySelector('.finish').onclick=()=>this.exit();this.status('Feedback removed.');this.focusHeading();}
 focusHeading(){this.content.scrollTop=0;this.content.querySelector('h1')?.focus({preventScroll:true});}
 resize(){this.width=this.canvas.clientWidth;this.height=this.canvas.clientHeight;const dpr=Math.min(devicePixelRatio||1,2);this.canvas.width=Math.round(this.width*dpr);this.canvas.height=Math.round(this.height*dpr);this.ctx.setTransform(dpr,0,0,dpr,0,0);if(!this.engine)return;this.walls.forEach(b=>Matter.Composite.remove(this.engine.world,b));this.walls=[Matter.Bodies.rectangle(this.width/2,this.height+32,this.width,90,{isStatic:true}),Matter.Bodies.rectangle(-35,this.height/2,90,this.height*3,{isStatic:true}),Matter.Bodies.rectangle(this.width+35,this.height/2,90,this.height*3,{isStatic:true})];Matter.Composite.add(this.engine.world,this.walls);}
 localPoint(e){const box=this.canvas.getBoundingClientRect();return {x:(e.clientX-box.left)*this.width/box.width,y:(e.clientY-box.top)*this.height/box.height};}
 releaseBall(){if(this.constraint&&this.engine)Matter.Composite.remove(this.engine.world,this.constraint);this.constraint=null;this.dragged=null;this.canvas.classList.remove('dragging');}
 finishDrop(){this.dropping=false;this.dialog.classList.remove('is-dropping');this.content.inert=false;}
 add(f,x,y,r){let b;if(this.engine){b=Matter.Bodies.circle(x,y,r,{restitution:.48,friction:.24,frictionAir:.006,slop:.02,sleepThreshold:80});Matter.Composite.add(this.engine.world,b);}else b={position:{x,y},angle:0};b.radius=r;b.feeling=f;this.bodies.push(b);return b;}
 populate(animate){
  this.resetJar();this.dialog.querySelector('.jar-demo-label').hidden=false;
  const r=Math.min(this.width<650?28:44,this.height*.055),cols=Math.max(3,Math.floor((this.width-28)/(2*r+1)));
  for(let row=0;row<2;row++)for(let i=0;i<cols-(row%2);i++)this.add(feelings[(i+row*3)%feelings.length].id,15+r+i*(2*r+.5)+(row%2?r:0),this.height-15-r-row*r*1.73,r);
  if(this.engine)for(let i=0;i<100;i++)Matter.Engine.update(this.engine,1000/60);
  const animateNow=animate&&!this.reduced&&!!this.engine;
  this.selectedBall=this.add(this.record.emotion,this.width*.52,animateNow?-r*1.3:this.height-17-r*4.6,r*1.18);
  if(animateNow){
   Matter.Body.setVelocity(this.selectedBall,{x:1.25,y:.3});Matter.Body.setAngularVelocity(this.selectedBall,.025);
   this.dropping=true;this.dialog.classList.add('is-dropping');this.content.inert=true;this.dialog.querySelector('.jar-exit').focus({preventScroll:true});
  }else if(this.engine){for(let i=0;i<180;i++)Matter.Engine.update(this.engine,1000/60);}
  this.elapsed=0;this.startPhysics();
 }
 startPhysics(){cancelAnimationFrame(this.raf);this.last=performance.now();this.accumulator=0;this.raf=requestAnimationFrame(t=>this.draw(t));}
 draw(time){
  if(!this.opened)return;
  // Advance simulation time only for visible frames; a hidden tab must not skip the drop.
  const dt=document.hidden?0:Math.min(50,Math.max(0,time-this.last));this.last=time;this.elapsed+=dt;
  if(this.engine){this.accumulator+=dt;while(this.accumulator>=1000/60){Matter.Engine.update(this.engine,1000/60);this.accumulator-=1000/60;}}
  const c=this.ctx;c.clearRect(0,0,this.width,this.height);
  for(const b of this.bodies){c.save();c.translate(b.position.x,b.position.y);c.rotate(b.angle||0);const s=b.radius/.4625;c.drawImage(this.textures.get(b.feeling),-s/2,-s/2,s,s);c.restore();}
  if(this.dropping&&this.elapsed>=1900){this.finishDrop();this.focusHeading();}
  if(this.dropping||this.constraint||(this.engine&&this.bodies.some(b=>!b.isSleeping)))this.raf=requestAnimationFrame(t=>this.draw(t));
 }
 exit(){if(!this.opened)return;cancelAnimationFrame(this.raf);this.releaseBall();this.finishDrop();this.dialog.close();}
}

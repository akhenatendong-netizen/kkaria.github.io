import {feelings,faceSVG} from './data.js';
// The same smooth face proportions and highlight as the emotion picker.
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
 else if(f.id==='confused')stroke(()=>{c.moveTo(33,54);c.quadraticCurveTo(40,46,47,52);c.moveTo(19,16);c.lineTo(34,21);c.moveTo(47,18);c.lineTo(60,13);},2.5);
 else if(f.id==='neutral')stroke(()=>{c.moveTo(33,53);c.lineTo(47,53);});
 else stroke(()=>{c.moveTo(29,49);c.quadraticCurveTo(40,63,51,49);});
 return out;
}

export class JarStage {
 constructor(events={}){
  this.events=events;this.opened=false;this.picked=false;this.keep=false;this.bodies=[];this.wallBodies=[];this.width=0;this.height=0;this.frameId=null;this.timer=null;this.revealTimer=null;this.currentURL='';
  this.textures=new Map(feelings.map(f=>[f.id,sphere(f,280)]));
  this.dialog=document.createElement('dialog');this.dialog.className='jar-stage';this.dialog.setAttribute('aria-label','Leave a feeling in the glass jar');
  this.dialog.innerHTML='<canvas class="jar-world" aria-label="Emotion spheres falling and settling in a glass jar"></canvas><div class="jar-glass jar-left"></div><div class="jar-glass jar-right"></div><div class="jar-glass jar-bottom"></div><div class="jar-top"><span class="jar-zone"></span><button class="jar-exit" aria-label="Return to the island">×</button></div><h1 class="jar-title">Leave a little feeling.</h1><div class="jar-options" role="group" aria-label="Choose your feeling"></div><div class="jar-feedback" hidden><h2>Tell us a little more.</h2><div class="jar-qr"></div><button class="jar-continue">Continue here ↗</button><button class="jar-stay">Stay a little longer</button><div class="jar-time"><span></span></div></div>';
  document.body.append(this.dialog);this.canvas=this.dialog.querySelector('canvas');this.ctx=this.canvas.getContext('2d');
  const {Engine}=Matter;this.engine=Engine.create({positionIterations:10,velocityIterations:8,enableSleeping:true});this.engine.gravity.y=1.5;
  feelings.forEach(f=>{const b=document.createElement('button');b.className='jar-emotion';b.innerHTML=faceSVG(f,'jar')+`<span>${f.name}</span>`;b.setAttribute('aria-label',`Choose ${f.name}`);b.onclick=()=>this.pick(f,b);this.dialog.querySelector('.jar-options').append(b);});
  this.dialog.querySelector('.jar-exit').onclick=()=>this.exit();this.dialog.addEventListener('cancel',e=>{e.preventDefault();this.exit();});
  this.dialog.querySelector('.jar-continue').onclick=()=>{this.clearTimers();this.events.continue?.(this.currentURL);this.exit(true);};
  this.dialog.querySelector('.jar-stay').onclick=()=>{this.keep=!this.keep;this.dialog.querySelector('.jar-stay').textContent=this.keep?'Return to the island':'Stay a little longer';if(this.keep){clearTimeout(this.timer);this.dialog.querySelector('.jar-time').hidden=true;this.dialog.querySelector('.jar-stay').onclick=()=>this.exit();}};
  this.dialog.addEventListener('pointerdown',e=>{if(e.target!==this.canvas||!this.opened)return;const point=this.localPoint(e.clientX,e.clientY);const found=Matter.Query.point(this.bodies,point);if(!found.length)return;this.dragged=found.at(-1);Matter.Sleeping.set(this.dragged,false);this.constraint=Matter.Constraint.create({bodyB:this.dragged,pointA:point,pointB:{x:0,y:0},stiffness:.15,damping:.12,length:0});Matter.Composite.add(this.engine.world,this.constraint);this.canvas.setPointerCapture(e.pointerId);});
  this.canvas.addEventListener('pointermove',e=>{if(this.constraint)this.constraint.pointA=this.localPoint(e.clientX,e.clientY);});
  const release=()=>{if(this.constraint)Matter.Composite.remove(this.engine.world,this.constraint);this.constraint=null;this.dragged=null;};this.canvas.addEventListener('pointerup',release);this.canvas.addEventListener('pointercancel',release);
  addEventListener('resize',()=>{if(this.opened)this.resize();});
 }
 localPoint(x,y){const r=this.canvas.getBoundingClientRect();return {x:(x-r.left)*this.width/r.width,y:(y-r.top)*this.height/r.height};}
 clearTimers(){clearTimeout(this.timer);clearTimeout(this.revealTimer);}
 open(zone){
  if(this.opened)return;this.opened=true;this.picked=false;this.keep=false;this.exitAt=0;this.zone=zone;this.currentURL='';this.clearTimers();this.dialog.classList.remove('jar-leaving');this.dialog.querySelector('.jar-zone').textContent=zone.name;this.dialog.querySelector('.jar-title').textContent='Leave a little feeling.';this.dialog.querySelector('.jar-options').hidden=false;this.dialog.querySelectorAll('.jar-emotion').forEach(b=>b.disabled=false);this.dialog.querySelector('.jar-feedback').hidden=true;this.dialog.querySelector('.jar-time').hidden=false;this.dialog.querySelector('.jar-stay').textContent='Stay a little longer';this.dialog.querySelector('.jar-stay').onclick=()=>{clearTimeout(this.timer);this.keep=true;this.dialog.querySelector('.jar-time').hidden=true;this.dialog.querySelector('.jar-stay').textContent='Return to the island';this.dialog.querySelector('.jar-stay').onclick=()=>this.exit();};
  Matter.Composite.clear(this.engine.world,false);this.bodies=[];this.wallBodies=[];this.width=0;this.dialog.showModal();this.resize();this.lastTime=performance.now();this.draw(this.lastTime);this.dialog.querySelector('.jar-emotion').focus({preventScroll:true});
 }
 resize(){
  this.width=this.canvas.clientWidth;this.height=this.canvas.clientHeight;const dpr=Math.min(devicePixelRatio||1,2);this.canvas.width=Math.round(this.width*dpr);this.canvas.height=Math.round(this.height*dpr);this.ctx.setTransform(dpr,0,0,dpr,0,0);this.wallBodies.forEach(b=>Matter.Composite.remove(this.engine.world,b));const w=this.width,h=this.height;
  this.wallBodies=[Matter.Bodies.rectangle(w/2,h+30,w,90,{isStatic:true}),Matter.Bodies.rectangle(-32,h/2,90,h*3,{isStatic:true}),Matter.Bodies.rectangle(w+32,h/2,90,h*3,{isStatic:true})];Matter.Composite.add(this.engine.world,this.wallBodies);
  if(!this.bodies.length){const r=w<650?29:43,cols=Math.floor((w-28)/(r*2+1)),count=Math.floor(cols*2.3);for(let i=0;i<count;i++){const row=Math.floor(i/cols),x=16+r+(i%cols)*(r*2+1)+(row%2?r*.4:0),y=h-17-r-row*r*1.8;this.add(feelings[(i*3+row)%5].id,x,y,r*(.91+Math.random()*.12));}for(let i=0;i<100;i++)Matter.Engine.update(this.engine,1000/60);}
  else this.bodies.forEach(b=>{Matter.Body.setPosition(b,{x:Math.max(b.radius+15,Math.min(w-b.radius-15,b.position.x)),y:Math.min(h-18-b.radius,b.position.y)});Matter.Sleeping.set(b,false);});
 }
 add(id,x,y,r){const b=Matter.Bodies.circle(x,y,r,{restitution:.38,friction:.25,frictionAir:.008,slop:.02});b.feeling=id;b.radius=r;Matter.Body.setAngle(b,(Math.random()-.5)*.8);Matter.Composite.add(this.engine.world,b);this.bodies.push(b);return b;}
 pick(f,button){
  if(this.picked)return;this.picked=true;const r=button.getBoundingClientRect(),point=this.localPoint(r.x+r.width/2,r.y+r.height/2),b=this.add(f.id,point.x,point.y,this.width<650?32:49);Matter.Body.setVelocity(b,{x:(Math.random()-.5)*2,y:-1});Matter.Body.setAngularVelocity(b,.015);this.dialog.querySelectorAll('.jar-emotion').forEach(el=>el.disabled=true);this.dialog.querySelector('.jar-options').hidden=true;this.dialog.querySelector('.jar-title').textContent='A little feeling, shared.';
  const result=this.events.pick?.(f);this.currentURL=result?.url||'';
  this.revealTimer=setTimeout(()=>{if(!this.opened)return;const qr=qrcode(0,'M');qr.addData(this.currentURL);qr.make();this.dialog.querySelector('.jar-qr').innerHTML=qr.createSvgTag({cellSize:4,margin:5,scalable:true});this.dialog.querySelector('.jar-feedback').hidden=false;this.exitAt=performance.now()+18000;this.timer=setTimeout(()=>this.exit(),18000);},1600);
 }
 exit(fromForm=false){if(!this.opened||this.dialog.classList.contains('jar-leaving'))return;this.clearTimers();this.dialog.classList.add('jar-leaving');this.events.close?.(fromForm);setTimeout(()=>{this.opened=false;this.dialog.close();cancelAnimationFrame(this.frameId);this.frameId=null;},550);}
 draw(time){if(!this.opened)return;const dt=Math.min(33.3,time-this.lastTime||16.6);this.lastTime=time;for(let step=0;step<Math.ceil(dt/16.667);step++)Matter.Engine.update(this.engine,dt/Math.ceil(dt/16.667));const c=this.ctx;c.clearRect(0,0,this.width,this.height);for(const b of this.bodies){c.save();c.translate(b.position.x,b.position.y);c.rotate(b.angle);c.shadowColor='#3b677d25';c.shadowBlur=7;c.shadowOffsetY=4;const size=b.radius/.4625;c.drawImage(this.textures.get(b.feeling),-size/2,-size/2,size,size);c.restore();}if(this.exitAt&&!this.keep)this.dialog.querySelector('.jar-time span').style.transform=`scaleX(${Math.max(0,(this.exitAt-time)/18000)})`;this.frameId=requestAnimationFrame(t=>this.draw(t));}
}

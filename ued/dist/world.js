import {T,material,mesh,ball,cylinder,box,tube,tree,flower,fern,mushroom,bench,stones,greenhouse,emoji,shadow} from './primitives.js';
import {OrbitControls} from './vendor/OrbitControls.js';
import {RoomEnvironment} from './vendor/RoomEnvironment.js';
import {zones} from './data.js';
const nextFrame=()=>new Promise(requestAnimationFrame),ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
export class GardenWorld {
 constructor(canvas,events={}){this.canvas=canvas;this.events=events;this.active=null;this.started=false;this.paused=false;this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;this.night=false;this.islands=[];this.interactives=[];this.growing=[];this.effects=[];this.loaded=new Map();this.transition=null;this.clock=new T.Clock();this.last=0;this.pointer=new T.Vector2();this.ray=new T.Raycaster();this.hover=null;this.token=0;}
 async init(progress){
  this.renderer=new T.WebGLRenderer({canvas:this.canvas,antialias:true,powerPreference:'high-performance',alpha:false});this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,innerWidth<650?1.5:1.8));this.renderer.setSize(innerWidth,innerHeight);this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFSoftShadowMap;this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.NeutralToneMapping;this.renderer.toneMappingExposure=1.04;
  this.scene=new T.Scene();this.scene.background=new T.Color('#c3e9e0');this.scene.fog=new T.Fog('#c3e9e0',65,150);
  this.camera=new T.OrthographicCamera(-30,30,17,-17,.1,250);this.camera.position.set(23,34,43);this.camera.lookAt(0,0,0);
  this.controls=new OrbitControls(this.camera,this.canvas);this.controls.enableDamping=true;this.controls.dampingFactor=.065;this.controls.enablePan=false;this.controls.minPolarAngle=.35;this.controls.maxPolarAngle=1.25;this.controls.minZoom=.65;this.controls.maxZoom=4.2;this.controls.rotateSpeed=.5;this.controls.zoomSpeed=.7;this.controls.enabled=false;
  this.controls.addEventListener('start',()=>{if(!this.reduced)this.transition=null;});
  this.hemi=new T.HemisphereLight('#fffce8','#7cad9f',1.2);this.scene.add(this.hemi);
  this.sun=new T.DirectionalLight('#fff3d8',2.2);this.sun.position.set(-15,28,15);this.sun.castShadow=true;this.sun.shadow.mapSize.set(2048,2048);Object.assign(this.sun.shadow.camera,{left:-30,right:30,top:30,bottom:-30,near:1,far:90});this.sun.shadow.bias=-.00035;this.sun.shadow.normalBias=.035;this.sun.shadow.radius=5;this.scene.add(this.sun);const fill=new T.DirectionalLight('#e3dcff',.7);fill.position.set(20,15,-15);this.scene.add(fill);this.fill=fill;
  const pmrem=new T.PMREMGenerator(this.renderer);this.scene.environment=pmrem.fromScene(new RoomEnvironment(),.04).texture;this.scene.environmentIntensity=.38;pmrem.dispose();progress(25,'Finding the sunshine…');await nextFrame();
  this.makeWater();this.makeClouds();
  for(let i=0;i<zones.length;i++){this.makeIsland(zones[i],i);progress(35+i*12,'Growing the islands…');await nextFrame();}
  this.companion=emoji(this.scene,'curious',.55);this.companion.visible=false;this.companionTarget=new T.Vector3();
  this.resize();this.bind();this.renderer.render(this.scene,this.camera);progress(90,'Adding a little wonder…');await nextFrame();
  if(this.renderer.compileAsync)await this.renderer.compileAsync(this.scene,this.camera);
  progress(100,'Your garden is ready.');this.animate();return this;
 }
 makeWater(){
  const geo=new T.PlaneGeometry(220,220,80,80);geo.rotateX(-Math.PI/2);
  this.waterMat=new T.ShaderMaterial({uniforms:{time:{value:0},colorA:{value:new T.Color('#65cbd3')},colorB:{value:new T.Color('#bcebdc')}},vertexShader:'varying vec3 vWorld; uniform float time; void main(){vec3 p=position;p.y+=sin(p.x*.18+time*.24)*.08+cos(p.z*.21+time*.2)*.06;vec4 w=modelMatrix*vec4(p,1.);vWorld=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',fragmentShader:'varying vec3 vWorld; uniform float time; uniform vec3 colorA; uniform vec3 colorB; void main(){float n=sin(vWorld.x*.18+sin(vWorld.z*.24+time*.2))*.5+.5;vec3 col=mix(colorA,colorB,n*.34+.32);float w=sin(vWorld.x*1.9+sin(vWorld.z*.78+time*.15)*1.5+time*.22);float w2=sin(vWorld.z*2.1+sin(vWorld.x*.9-time*.18)*1.4);float foam=pow(max(0.,w*w2),18.)*.085;col+=foam;gl_FragColor=vec4(col,1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}'});
  this.water=mesh(geo,this.waterMat,this.scene,0,-.74,0);this.water.receiveShadow=false;this.water.castShadow=false;const softShadow=mesh(new T.PlaneGeometry(160,160),new T.ShadowMaterial({opacity:.13}),this.scene,0,-.61,0);softShadow.rotation.x=-Math.PI/2;softShadow.castShadow=false;softShadow.receiveShadow=true;
  // Tiny floating petals break up the open water without becoming UI clutter.
  this.petals=[];for(let i=0;i<22;i++){const a=i*2.399,r=18+(i%7)*2;const p=ball(this.scene,i%2?'#e8f1c8':'#f2d0d8',Math.cos(a)*r,-.6,Math.sin(a)*r,.13,.025,.07);p.castShadow=false;this.petals.push(p);}
 }
 makeClouds(){this.clouds=[];const mat=new T.MeshStandardMaterial({color:'#fffdf2',roughness:.8,transparent:true,opacity:.85});for(let i=0;i<5;i++){const g=new T.Group();g.position.set((i-2)*17,8+(i%3)*1.3,-24-(i%2)*10);g.userData.start=g.position.x;this.scene.add(g);for(let j=0;j<5;j++)ball(g,mat,(j-2)*1.0,Math.sin(j*1.3)*.3,Math.cos(j)*.4,1.4, .7+(j%2)*.35, .8);g.scale.setScalar(.75+(i%2)*.35);g.traverse(m=>m.castShadow=false);this.clouds.push(g);}}
 makeIsland(zone,index){
  const g=new T.Group();g.position.set(zone.position[0],0,zone.position[1]);g.userData.zone=zone.id;this.scene.add(g);
  const organic=(rt,rb,h)=>{const geo=new T.CylinderGeometry(rt,rb,h,72,1);const pos=geo.attributes.position;for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i),a=Math.atan2(z,x),f=1+.045*Math.sin(a*3+index)+.035*Math.cos(a*5);pos.setX(i,x*f*1.08);pos.setZ(i,z*f*.94);}geo.computeVertexNormals();return geo;};
  mesh(organic(4.7,4.25,1.3),zone.soil,g,0,-.03,0);mesh(organic(4.84,4.7,.28),'#fae7c7',g,0,.68,0);const ground=mesh(organic(4.75,4.75,.24),zone.ground,g,0,.87,0);ground.userData.ground=true;
  // Soft shore ring and stones give the small world a grounded, rendered finish.
  const ring=mesh(new T.RingGeometry(4.6,5.35,80),new T.MeshBasicMaterial({color:'#e3f5e5',transparent:true,opacity:.32,side:T.DoubleSide,depthWrite:false}),g,0,-.59,0);ring.rotation.x=-Math.PI/2;ring.scale.set(1.09,.94,1);ring.castShadow=false;
  for(let i=0;i<11;i++){const a=i*2.399;const r=4.2;ball(g,['#c3d7ad','#c4bba6','#dbcfb5'][i%3],Math.cos(a)*r,.87,Math.sin(a)*r,.25+(i%3)*.09,.2,.26);}
  const path=[];for(let i=0;i<9;i++)path.push([Math.sin(i*.5)*1.3,(i-4)*.76]);stones(g,path);
  let landmark;
  if(zone.id==='glasshouse'){
   landmark=greenhouse(g);landmark.position.z=-.5;tree(g,-3,-1,3.4,'#77ae78');tree(g,3,-2,3.8,'#a5c17e','palm');bench(g,-3,1.5,.7);for(let i=0;i<7;i++)flower(g,2.3+Math.sin(i)*.6,1.4+i*.33,['#fae5ad','#f4b6cc'][i%2],.5);
  }else if(zone.id==='evolution'){
   tree(g,-1.8,-1.3,5.1,'#8eb58a');tree(g,1.9,-2.3,3.4,'#a0c282','palm');fern(g,-2.6,1.5,.8);fern(g,2.4,.3,.7);for(let i=0;i<5;i++)mushroom(g,2+Math.sin(i*1.4)*.8,2+i*.18,.35+(i%2)*.2,i%2?'#dab4db':'#e4bc8b');bench(g,-2.6,-2.6,-.8);
   const fossil=ball(g,'#e4d9b9',.65,1.1,.3,1.0,.25,.85);for(let i=0;i<22;i++){const a=i*.5,r=.03+i*.024;ball(g,'#baa889',.65+Math.cos(a)*r,1.34,.3+Math.sin(a)*r,.05,.025,.05);}landmark=fossil;
  }else if(zone.id==='pond'){
   const basin=cylinder(g,'#ead4b8',-.55,1.01,0,2.75,2.85,.15,64);basin.scale.z=.76;const p=cylinder(g,material('#79c7d1',.12),-.55,1.12,0,2.57,2.57,.03,64);p.scale.z=.76;landmark=p;g.userData.pond=p;
   tree(g,2.6,-2.2,4.2,'#a2c28a');tree(g,-3.1,-2.3,3.0,'#75a88a');bench(g,2.5,1.8,-.8);
   for(let i=0;i<5;i++){const a=i*2.4;const leaf=mesh(new T.CircleGeometry(.37,32,0,Math.PI*1.82),material('#65a996',.3),g,-.55+Math.cos(a)*1.6,1.15,Math.sin(a)*1.2);leaf.rotation.x=-Math.PI/2;leaf.rotation.z=a;if(i%2===0){const f=flower(g,leaf.position.x,leaf.position.z,'#edb2ca',.12);f.position.y=1.13;}}
  }else{
   tree(g,-2.6,-2.4,4.1,'#b4c78a');tree(g,2.4,-1.7,3.7,'#8caf80');bench(g,-2.5,.4,.8);
   for(let i=0;i<25;i++){const a=i*2.399,r=1.2+(i%6)*.43,x=Math.cos(a)*r,z=Math.sin(a)*r;if(Math.abs(x)<.7)continue;flower(g,x,z,['#f7b2be','#e4c1ee','#ffdf80','#fff4d0'][i%4],.45+(i%3)*.2);}
   const arch=new T.Group();g.add(arch);arch.position.set(.3,1,-2.1);tube(arch,[[-1.5,0,0],[-1.5,1.7,0],[0,3.1,0],[1.5,1.7,0],[1.5,0,0]],.11,'#f6e2bb',40);for(let i=0;i<9;i++){const a=i/8*Math.PI;ball(arch,['#efb1c8','#e9ce91','#c5b0df'][i%3],Math.cos(a)*1.5,1.5+Math.sin(a)*1.1,0,.2,.17,.19);}landmark=arch;
  }
  // A little glass bowl holds any feelings left during this visit.
  const vessel=new T.Group();vessel.position.set(2.65,.98,2.8);g.add(vessel);vessel.userData.action=()=>this.events.feedback?.();cylinder(vessel,'#f8e1b8',0,.05,0,1.0,.91,.18,40);const glassMat=new T.MeshPhysicalMaterial({color:'#f6ffff',transparent:true,opacity:.28,roughness:.12,side:T.DoubleSide,depthWrite:false,metalness:.05});mesh(new T.CylinderGeometry(.92,.84,1.45,40,1,true),glassMat,vessel,0,.86,0);const rim=mesh(new T.TorusGeometry(.92,.04,8,50),'#e2eee0',vessel,0,1.6,0);rim.rotation.x=Math.PI/2;vessel.userData.feelings=[];
  const island={zone,group:g,ground,landmark,vessel,detail:null,hotspot:null};this.islands.push(island);
  g.traverse(o=>{if(o.isMesh)o.userData.zone=zone.id;});return island;
 }
 bind(){
  addEventListener('resize',()=>this.resize());let down=null,moved=false;
  this.canvas.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};moved=false;});
  this.canvas.addEventListener('pointermove',e=>{if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)>6)moved=true;this.pointer.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);if(!this.started||moved)return;this.ray.setFromCamera(this.pointer,this.camera);const hits=this.ray.intersectObjects(this.islands.map(i=>i.group),true);this.canvas.style.cursor=hits.length?'pointer':'grab';});
  this.canvas.addEventListener('pointerup',e=>{if(!down||moved||!this.started){down=null;return;}down=null;this.pointer.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);this.ray.setFromCamera(this.pointer,this.camera);const hits=this.ray.intersectObjects(this.islands.map(i=>i.group),true);if(!hits.length){this.ripple(new T.Vector3(0,-.58,0));return;}const hit=hits[0],id=hit.object.userData.zone||this.active;
   if(!this.active||id!==this.active){this.events.select?.(id);return;}
   let object=hit.object;while(object){if(object.userData.action){object.userData.action();return;}object=object.parent;}
   const island=this.islands.find(i=>i.zone.id===this.active),point=hit.point.clone(),center=island.group.position;const dx=point.x-center.x,dz=point.z-center.z;if(Math.hypot(dx,dz)>4.4)return;this.companionTarget.set(point.x,1.5,point.z);this.events.move?.();this.burst(point,0xeffac4,8);
  });
  this.canvas.addEventListener('pointercancel',()=>down=null);
  this.canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.events.error?.('The 3D view paused. Reload to grow the garden again.');});
 }
 resize(){
  const w=innerWidth,h=innerHeight;this.mobile=w<650;this.renderer.setSize(w,h);const size=this.mobile?70:34;this.camera.left=-size*w/h/2;this.camera.right=size*w/h/2;this.camera.top=size/2;this.camera.bottom=-size/2;this.camera.updateProjectionMatrix();
  if(!this.started){this.camera.position.set(this.mobile?0:23,34,43);this.controls.target.set(0,0,0);this.camera.lookAt(this.controls.target);}else if(!this.jarOpen)this.resetView(true);
 }
 start(){this.started=true;this.controls.enabled=true;this.camera.zoom=.83;this.camera.updateProjectionMatrix();this.goCamera(new T.Vector3(this.mobile?0:23,31,40),new T.Vector3(0,0,0),1,2200);}
 goCamera(pos,target,zoom,duration=1700){this.controls.enabled=false;this.transition={from:this.camera.position.clone(),to:pos,fromTarget:this.controls.target.clone(),toTarget:target,fromZoom:this.camera.zoom,toZoom:zoom,start:performance.now(),duration:this.reduced?0:duration};}
 async enter(id){
  const island=this.islands.find(i=>i.zone.id===id);if(!island)return;const token=++this.token;this.active=id;this.events.zone?.(island.zone);this.events.loading?.(true);
  if(!this.loaded.has(id)){
   const loads={glasshouse:()=>import('./zones/glasshouse.js'),evolution:()=>import('./zones/evolution.js'),pond:()=>import('./zones/pond.js'),meadow:()=>import('./zones/meadow.js')};
   this.loaded.set(id,loads[id]().then(m=>m.build(this,island)).then(detail=>{island.detail=detail;detail.group.scale.setScalar(this.reduced?1:.001);this.growing.push({group:detail.group,start:performance.now()});return detail;}).catch(e=>{this.loaded.delete(id);throw e;}));
  }
  try{await this.loaded.get(id);}catch(e){this.events.loading?.(false);this.events.error?.('This island could not load. Please try again.');return;}
  if(token!==this.token)return;this.events.loading?.(false);this.events.hotspots?.(island.detail.actions);this.resetView();this.companion.visible=true;this.companion.position.set(island.group.position.x,1.5,island.group.position.z+3);this.companionTarget.copy(this.companion.position);
 }
 overview(){++this.token;this.active=null;this.companion.visible=false;this.events.loading?.(false);this.events.zone?.(null);this.events.hotspots?.([]);this.resetView();}
 resetView(immediate=false){
  if(this.active){const island=this.islands.find(i=>i.zone.id===this.active),center=island.group.position.clone();const target=center.clone().add(new T.Vector3(0,1,0));this.goCamera(center.clone().add(new T.Vector3(this.mobile?9:13,13,18)),target,this.mobile?2.72:1.78,immediate?0:1750);}
  else this.goCamera(new T.Vector3(this.mobile?0:23,31,40),new T.Vector3(0,0,0),1,immediate?0:1600);
 }
 focusVessel(){if(!this.active)return;const island=this.islands.find(i=>i.zone.id===this.active),target=island.group.position.clone().add(island.vessel.position).add(new T.Vector3(0,.75,0));this.companion.visible=false;this.goCamera(target.clone().add(new T.Vector3(9,9,15)),target,this.mobile?4.1:2.55,1250);}
 zoom(factor){this.transition=null;this.controls.enabled=true;this.camera.zoom=T.MathUtils.clamp(this.camera.zoom*factor,.65,4.2);this.camera.updateProjectionMatrix();}
 setNight(value){this.night=value;this.lightTransition={start:performance.now(),from:this.dayValue||0,to:value?1:0};}
 setReduced(value){this.reduced=value;}
 discover(island,action){this.events.discover?.(island.zone,action);this.burst(island.group.position.clone().add(new T.Vector3(0,3,0)),0xffde91,26);}
 burst(point,color,count=18){for(let i=0;i<count;i++){const b=ball(this.scene,i%3===0?'#fff4c9':new T.MeshBasicMaterial({color}),point.x,point.y,point.z,.055+(i%3)*.018);b.castShadow=false;this.effects.push({type:'particle',object:b,velocity:new T.Vector3((Math.random()-.5)*3,Math.random()*2+.6,(Math.random()-.5)*3),life:1.6,age:0});}}
 ripple(point){for(let i=0;i<3;i++){const ring=mesh(new T.RingGeometry(.25,.29,48),new T.MeshBasicMaterial({color:'#e6fff3',transparent:true,opacity:.65,side:T.DoubleSide,depthWrite:false}),this.scene,point.x,point.y+.02,point.z);ring.rotation.x=-Math.PI/2;ring.castShadow=false;this.effects.push({type:'ripple',object:ring,life:2.4,age:-i*.24});}}
 leaveFeeling(id){
  if(!this.active)return;const island=this.islands.find(i=>i.zone.id===this.active),v=island.vessel;const count=v.userData.feelings.length;if(count>=12){const old=v.userData.feelings.shift();v.remove(old);}
  const feeling=emoji(v,id,.22);feeling.position.set((Math.random()-.5)*.7,4,(Math.random()-.5)*.7);feeling.rotation.y=Math.atan2(this.camera.position.x-island.group.position.x,this.camera.position.z-island.group.position.z);
  v.userData.feelings.push(feeling);const destination=.37+Math.floor(Math.min(count,11)/3)*.22;
  this.effects.push({type:'drop',object:feeling,velocityY:0,floor:destination,life:3,age:0});this.burst(island.group.position.clone().add(new T.Vector3(2.6,2.4,2.8)),0xf2d17c,14);
 }
 project(point){const p=point.clone().project(this.camera);return{x:(p.x+1)*innerWidth/2,y:(1-p.y)*innerHeight/2,visible:p.z>-1&&p.z<1&&p.x>-1.2&&p.x<1.2&&p.y>-1.2&&p.y<1.2};}
 animate(){this.raf=requestAnimationFrame(()=>this.animate());const now=performance.now(),dt=Math.min(.04,this.clock.getDelta()),t=now/1000;if(document.hidden||this.paused)return;
  if(this.transition){const a=this.transition,progress=a.duration===0?1:T.MathUtils.clamp((now-a.start)/a.duration,0,1),p=ease(progress);this.camera.position.lerpVectors(a.from,a.to,p);this.controls.target.lerpVectors(a.fromTarget,a.toTarget,p);this.camera.zoom=T.MathUtils.lerp(a.fromZoom,a.toZoom,p);this.camera.updateProjectionMatrix();if(progress>=1){this.transition=null;this.controls.enabled=!this.jarOpen;}}
  this.controls.update();
  if(this.lightTransition){const a=this.lightTransition,p=T.MathUtils.clamp((now-a.start)/1200,0,1);this.dayValue=T.MathUtils.lerp(a.from,a.to,p);const d=this.dayValue;this.sun.intensity=T.MathUtils.lerp(2.2,.8,d);this.hemi.intensity=T.MathUtils.lerp(1.2,.75,d);this.fill.intensity=T.MathUtils.lerp(.7,1.0,d);this.sun.color.set('#fff3d8').lerp(new T.Color('#c8c7ff'),d);this.scene.background.set('#c3e9e0').lerp(new T.Color('#564b79'),d);this.scene.fog.color.copy(this.scene.background);this.waterMat.uniforms.colorA.value.set('#65cbd3').lerp(new T.Color('#52679c'),d);this.waterMat.uniforms.colorB.value.set('#bcebdc').lerp(new T.Color('#8d90bc'),d);if(p>=1)this.lightTransition=null;}
  if(!this.reduced){this.waterMat.uniforms.time.value=t;this.clouds.forEach((g,i)=>g.position.x=g.userData.start+Math.sin(t*.025+i)*3);this.petals.forEach((p,i)=>{p.rotation.y=t*.1+i;p.position.y=-.61+Math.sin(t+i)*.03;});}
  for(let i=this.growing.length-1;i>=0;i--){const a=this.growing[i],p=this.reduced?1:Math.min(1,(now-a.start)/1200);a.group.scale.setScalar(ease(p));if(p>=1)this.growing.splice(i,1);}
  this.islands.forEach((island,i)=>{if(!this.reduced){island.group.position.y=Math.sin(t*.7+i)*.055;island.detail?.update?.(t,dt,this.active===island.zone.id);}});
  if(this.companion.visible){this.companion.position.x=T.MathUtils.damp(this.companion.position.x,this.companionTarget.x,4,dt);this.companion.position.z=T.MathUtils.damp(this.companion.position.z,this.companionTarget.z,4,dt);const moving=Math.hypot(this.companion.position.x-this.companionTarget.x,this.companion.position.z-this.companionTarget.z)>.08;this.companion.position.y=1.53+(!this.reduced?(moving?Math.abs(Math.sin(t*10))*.28:Math.sin(t*2)*.06):0);this.companion.rotation.y=Math.atan2(this.camera.position.x-this.companion.position.x,this.camera.position.z-this.companion.position.z);}
  for(let i=this.effects.length-1;i>=0;i--){const e=this.effects[i];e.age+=dt;if(e.type==='particle'){e.object.position.addScaledVector(e.velocity,dt);e.velocity.y-=dt*1.5;e.object.scale.multiplyScalar(.99);}else if(e.type==='ripple'){e.object.visible=e.age>=0;if(e.age>=0){e.object.scale.setScalar(1+e.age*4);e.object.material.opacity=Math.max(0,.6*(1-e.age/e.life));}}else if(e.type==='drop'){e.velocityY-=dt*8;e.object.position.y+=e.velocityY*dt;if(e.object.position.y<e.floor){e.object.position.y=e.floor;e.velocityY=Math.abs(e.velocityY)*.4;if(e.velocityY<.1)e.velocityY=0;}}
   if(e.age>e.life){if(e.type!=='drop'){e.object.parent?.remove(e.object);if(e.type==='ripple'){e.object.geometry.dispose();e.object.material.dispose();}}this.effects.splice(i,1);}}
  this.events.frame?.(this);this.renderer.render(this.scene,this.camera);
 }
}

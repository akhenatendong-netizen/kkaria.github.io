import {useEffect,useRef} from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
export default function RestaurantScene({entered,zone,revision,onChoose,onEnter}:{entered:boolean;zone:number|null;revision:number;onChoose:(n:number)=>void;onEnter:()=>void}){
 const host=useRef<HTMLDivElement>(null),state=useRef({entered,zone,revision}),callbacks=useRef({onChoose,onEnter});state.current={entered,zone,revision};callbacks.current={onChoose,onEnter};
 useEffect(()=>{const el=host.current!;let renderer:THREE.WebGLRenderer;try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});}catch{return;}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setClearColor(0,0);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;el.appendChild(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(36,1,.1,100);camera.position.set(12,10,15);
 const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment(),env=pmrem.fromScene(room,.04);scene.environment=env.texture;scene.environmentIntensity=.22;room.dispose();pmrem.dispose();
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enablePan=false;controls.minDistance=5;controls.maxDistance=23;controls.minPolarAngle=.25;controls.maxPolarAngle=1.43;controls.target.set(0,.8,0);controls.enableZoom=false;
 const building=new THREE.Group();scene.add(building);const geo:THREE.BufferGeometry[]=[],mats:THREE.Material[]=[],textures:THREE.Texture[]=[];
 const material=(color:number,roughness=.7,metalness=0)=>{const m=new THREE.MeshStandardMaterial({color,roughness,metalness});mats.push(m);return m;};
 const walnut=material(0x58372d),floor=material(0x7e5740),wall=material(0x242b2c),dark=material(0x171a1a),brass=material(0xb7995e,.32,.7),red=material(0x783239),stone=material(0xd3c6ac,.4),green=material(0x274d3b);
 const glow=new THREE.MeshStandardMaterial({color:0xffedbd,emissive:0xffbd66,emissiveIntensity:2});mats.push(glow);
 const mesh=(g:THREE.BufferGeometry,m:THREE.Material,x:number,y:number,z:number,parent:THREE.Object3D=building)=>{geo.push(g);const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;};
 const box=(w:number,h:number,d:number,m:THREE.Material,x:number,y:number,z:number,p?:THREE.Object3D)=>mesh(new THREE.BoxGeometry(w,h,d),m,x,y,z,p);
 const cyl=(r:number,h:number,m:THREE.Material,x:number,y:number,z:number,p?:THREE.Object3D)=>mesh(new THREE.CylinderGeometry(r,r,h,40),m,x,y,z,p);
 const ball=(r:number,m:THREE.Material,x:number,y:number,z:number,p?:THREE.Object3D)=>mesh(new THREE.SphereGeometry(r,24,16),m,x,y,z,p);
 box(8.5,.32,6.5,dark,0,-.24,0);box(8,.12,6,floor,0,-.03,0);
 for(let i=0;i<28;i++){const x=-3.9+i*.285;box(.012,.014,6,walnut,x,.038,0);for(let j=0;j<4;j++)box(.275,.014,.009,walnut,x+.14,.04,-2.8+j*1.5+(i%2)*.75);}
 box(8,3.6,.18,wall,0,1.8,-3);box(.18,3.6,6,wall,-4,1.8,0);box(8,.065,.08,brass,0,.2,-2.86);box(.08,.065,6,brass,-3.86,.2,0);
 // Framed glazing, illuminated from within and broken into fine mullions.
 for(const x of [-2.8,0,2.8]){box(1.8,2.35,.08,dark,x,1.9,-2.87);box(1.6,2.12,.025,material(0x5d4836),x,1.9,-2.8);for(const dx of [-.86,0,.86])box(.035,2.35,.055,brass,x+dx,1.9,-2.74);for(const y of [.75,1.5,3.08])box(1.75,.035,.055,brass,x,y,-2.73);
  const curtain=material(0x633d3c);for(let k=0;k<4;k++){cyl(.07,2.6,curtain,x-1.03+k*.065,1.85,-2.55);cyl(.07,2.6,curtain,x+.84+k*.065,1.85,-2.55);}}
 const zones=[new THREE.Group(),new THREE.Group(),new THREE.Group()];zones.forEach((g,i)=>{g.userData.zone=i;building.add(g);});
 // Dining tables, porcelain settings, upholstered chairs and small candles.
 const table=(x:number,z:number)=>{const p=zones[0];cyl(.63,.095,stone,x,1.1,z,p);cyl(.055,.97,brass,x,.57,z,p);cyl(.31,.04,dark,x,.08,z,p);for(const sign of [-1,1]){cyl(.18,.018,stone,x+sign*.31,1.16,z,p);box(.012,.012,.2,brass,x+sign*.53,1.16,z,p);cyl(.055,.13,glow,x,.18+1.1,z,p);const cz=z+sign*.82;box(.57,.13,.54,red,x,.55,cz,p);box(.59,.63,.11,red,x,.86,cz+sign*.22,p);for(const dx of [-.22,.22])for(const dz of [-.19,.19])cyl(.018,.48,brass,x+dx,.25,cz+dz,p);}};
 table(.65,.75);table(2.6,-.85);table(-1.05,-.9);
 // Bar counter with fluted wood, stone top, bottles, glasses and stools.
 const bar=zones[1];box(.95,1.1,3.9,walnut,-3.06,.59,-.45,bar);box(1.14,.13,4.06,stone,-3.06,1.22,-.45,bar);for(let i=0;i<30;i++)box(.04,1.02,.045,brass,-2.57,.57,-2.34+i*.13,bar);
 for(const z of [-1.75,-.45,.85]){cyl(.25,.11,red,-1.99,.76,z,bar);cyl(.035,.64,brass,-1.99,.4,z,bar);cyl(.21,.03,dark,-1.99,.08,z,bar);}
 for(let k=0;k<7;k++){const z=-1.9+k*.33;cyl(.052,.23,green,-3.15,1.4,z,bar);cyl(.022,.1,green,-3.15,1.56,z,bar);}
 // Welcome stand and a small illuminated brand plaque.
 const entry=zones[2];box(.7,.97,.44,walnut,2.8,.54,2.22,entry);box(.77,.07,.5,stone,2.8,1.06,2.22,entry);
 const signCanvas=document.createElement('canvas');signCanvas.width=1024;signCanvas.height=256;const sc=signCanvas.getContext('2d')!;sc.fillStyle='#252828';sc.fillRect(0,0,1024,256);sc.fillStyle='#efe3c9';sc.textAlign='center';sc.font='500 90px Georgia';sc.fillText('CrazyBee',512,126);sc.font='20px Arial';sc.fillText('GOOD FOOD.  REAL CONNECTIONS.',512,184);const signTex=new THREE.CanvasTexture(signCanvas);signTex.colorSpace=THREE.SRGBColorSpace;textures.push(signTex);const signMat=new THREE.MeshBasicMaterial({map:signTex});mats.push(signMat);box(2.7,.74,.08,brass,0,3.57,-2.75);mesh(new THREE.PlaneGeometry(2.6,.65),signMat,0,3.57,-2.7);
 // Greenery softens the architectural edges.
 for(const [x,z] of [[3.55,2.35],[-3.55,2.4]]){cyl(.23,.43,stone,x,.26,z);for(let i=0;i<9;i++){const a=i*2.4;const leaf=ball(.25,green,x+Math.cos(a)*.16,.65+i*.045,z+Math.sin(a)*.16);leaf.scale.set(.35,1.7,.8);leaf.rotation.z=Math.sin(a)*.6;}}
 for(const [x,z] of [[.65,.75],[2.6,-.85],[-1.05,-.9]]){cyl(.009,1.2,brass,x,3.15,z);mesh(new THREE.ConeGeometry(.35,.2,40,1,true),brass,x,2.55,z);ball(.075,glow,x,2.44,z);const l=new THREE.PointLight(0xffcf90,7,5,2);l.position.set(x,2.38,z);scene.add(l);}
 const ambient=new THREE.HemisphereLight(0xffdfb2,0x262333,1);scene.add(ambient);const key=new THREE.DirectionalLight(0xffe1b2,2.6);key.position.set(3,8,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-7;key.shadow.camera.right=7;key.shadow.camera.top=7;key.shadow.camera.bottom=-7;key.shadow.normalBias=.04;scene.add(key);const rim=new THREE.DirectionalLight(0x8a96bb,1.3);rim.position.set(-5,5,-4);scene.add(rim);
 const resize=()=>{const b=el.getBoundingClientRect();renderer.setSize(b.width,b.height);camera.aspect=b.width/b.height;camera.updateProjectionMatrix();};const ro=new ResizeObserver(resize);ro.observe(el);resize();
 let active=true,frame=0,last='',auto=true,downX=0,downY=0;const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();
 controls.addEventListener('start',()=>{auto=false;});const down=(e:PointerEvent)=>{downX=e.clientX;downY=e.clientY;};const up=(e:PointerEvent)=>{if(Math.hypot(e.clientX-downX,e.clientY-downY)>5)return;const b=el.getBoundingClientRect();pointer.set((e.clientX-b.left)/b.width*2-1,1-(e.clientY-b.top)/b.height*2);ray.setFromCamera(pointer,camera);const hits=ray.intersectObjects(zones,true);if(!state.current.entered){callbacks.current.onEnter();return;}if(hits[0]){let o:THREE.Object3D|null=hits[0].object;while(o&&o.userData.zone===undefined)o=o.parent;if(o)callbacks.current.onChoose(o.userData.zone);}};
 el.addEventListener('pointerdown',down);el.addEventListener('pointerup',up);const io=new IntersectionObserver(([e])=>active=e.isIntersecting);io.observe(el);const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const destinations=[new THREE.Vector3(6,5.8,8),new THREE.Vector3(3,4,5),new THREE.Vector3(7,4.2,7)];const targets=[new THREE.Vector3(.7,.85,.2),new THREE.Vector3(-2.8,1,-.4),new THREE.Vector3(2.4,1,1.9)];
 const tick=()=>{frame=requestAnimationFrame(tick);if(!active||document.hidden)return;const s=state.current,k=`${s.entered}-${s.zone}-${s.revision}`;if(k!==last){last=k;auto=true;}controls.enableZoom=s.entered;if(auto){const mobile=el.clientWidth<600;const pos=!s.entered?new THREE.Vector3(11,9,13).multiplyScalar(mobile?1.15:1):s.zone===null?new THREE.Vector3(8,6.5,10):destinations[s.zone];const target=s.entered&&s.zone!==null?targets[s.zone]:new THREE.Vector3(0,.8,0);camera.position.lerp(pos,reduced?1:.055);controls.target.lerp(target,reduced?1:.055);}controls.update();renderer.render(scene,camera);};frame=requestAnimationFrame(tick);
 return()=>{cancelAnimationFrame(frame);io.disconnect();ro.disconnect();el.removeEventListener('pointerdown',down);el.removeEventListener('pointerup',up);controls.dispose();geo.forEach(g=>g.dispose());new Set(mats).forEach(m=>m.dispose());textures.forEach(t=>t.dispose());env.dispose();renderer.dispose();renderer.domElement.remove();};
 },[]);
 return <div className="restaurant-canvas" ref={host} role="img" aria-label="Interactive three-dimensional CrazyBee restaurant. Click to enter, drag to orbit, then choose dining tables, the bar or the welcome desk."/>;
}

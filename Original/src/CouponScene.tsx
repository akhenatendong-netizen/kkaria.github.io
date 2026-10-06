import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCcw, MoveHorizontal } from 'lucide-react';

export default function CouponScene({merchant}:{merchant:boolean}) {
 const host=useRef<HTMLDivElement>(null); const target=useRef(0); const [ready,setReady]=useState(false);
 useEffect(()=>{
  if(!host.current)return; const el=host.current;
  let renderer:THREE.WebGLRenderer;
  try {renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});}catch{return;}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));renderer.setClearColor(0,0);el.appendChild(renderer.domElement);
  const scene=new THREE.Scene(); const camera=new THREE.PerspectiveCamera(36,1,.1,100);camera.position.set(0,0,9);
  scene.add(new THREE.AmbientLight(0xffffff,2.1));const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(-3,5,6);scene.add(light);
  const group=new THREE.Group();scene.add(group);
  const shape=new THREE.Shape();const w=2.65,h=1.5,r=.18;
  shape.moveTo(-w+r,-h);shape.lineTo(w-r,-h);shape.quadraticCurveTo(w,-h,w,-h+r);shape.lineTo(w,-.28);shape.absarc(w,0,.28,-Math.PI/2,-Math.PI*1.5,true);shape.lineTo(w,h-r);shape.quadraticCurveTo(w,h,w-r,h);shape.lineTo(-w+r,h);shape.quadraticCurveTo(-w,h,-w,h-r);shape.lineTo(-w,.28);shape.absarc(-w,0,.28,Math.PI/2,-Math.PI/2,true);shape.lineTo(-w,-h+r);shape.quadraticCurveTo(-w,-h,-w+r,-h);
  const geo=new THREE.ExtrudeGeometry(shape,{depth:.075,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.035,bevelThickness:.025});
  const paper=new THREE.MeshStandardMaterial({color:0xff3535,roughness:.62,metalness:.05}); const mesh=new THREE.Mesh(geo,paper);group.add(mesh);
  const textures:THREE.CanvasTexture[]=[];const materials:THREE.Material[]=[paper];
  function face(back:boolean){const c=document.createElement('canvas');c.width=1200;c.height=650;const ctx=c.getContext('2d')!;ctx.fillStyle='#fff8f3';ctx.fillRect(0,0,1200,650);ctx.fillStyle='#ff3535';ctx.font='bold 35px Arial';ctx.fillText('CrazyBee',65,80);ctx.font='20px Arial';ctx.fillStyle='#68615d';ctx.fillText(back?'A LITTLE MORE CONTROL':'A LITTLE LOCAL DISCOVERY',65,130);ctx.font='bold 92px Arial';ctx.fillStyle='#232320';ctx.fillText(back?'Your deal.':'Good food.',65,280);ctx.fillText(back?'Your rules.':'Better together.',65,385);ctx.strokeStyle='#d6c7c0';ctx.setLineDash([9,10]);ctx.beginPath();ctx.moveTo(65,450);ctx.lineTo(1130,450);ctx.stroke();ctx.font='26px Arial';ctx.fillStyle='#68615d';ctx.fillText(back?'Set the time. Set the limit. Welcome new faces.':'Discover · Get your deal · Dine in',65,530);ctx.fillStyle='#ff3535';ctx.font='bold 20px Arial';ctx.fillText('CRAZYBEE / DEMO PASS',65,600);const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;textures.push(tex);const mat=new THREE.MeshStandardMaterial({map:tex,roughness:.8});materials.push(mat);const plane=new THREE.Mesh(new THREE.PlaneGeometry(4.95,2.7),mat);plane.position.z=back?-.04:.115;if(back)plane.rotation.y=Math.PI;group.add(plane);}
  face(false);face(true); group.rotation.z=-.07;target.current=merchant?Math.PI:0;
  const resize=()=>{const {width,height}=el.getBoundingClientRect();renderer.setSize(width,height);camera.aspect=width/height;camera.position.z=width<400?10.4:9;camera.updateProjectionMatrix();};const ro=new ResizeObserver(resize);ro.observe(el);resize();
  let dragging=false,px=0; const down=(e:PointerEvent)=>{dragging=true;px=e.clientX;el.setPointerCapture(e.pointerId);};const move=(e:PointerEvent)=>{if(dragging){target.current+=(e.clientX-px)*.012;px=e.clientX;}};const up=()=>{dragging=false;};el.addEventListener('pointerdown',down);el.addEventListener('pointermove',move);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;let frame=0;let visible=true;const observer=new IntersectionObserver(([e])=>{visible=e.isIntersecting;});observer.observe(el);const animate=(t:number)=>{frame=requestAnimationFrame(animate);if(!visible||document.hidden)return;group.rotation.y+=(target.current-group.rotation.y)*(reduced?1:.08);group.position.y=reduced?0:Math.sin(t*.0007)*.08;renderer.render(scene,camera);};frame=requestAnimationFrame(animate);setReady(true);
  return()=>{cancelAnimationFrame(frame);ro.disconnect();observer.disconnect();el.removeEventListener('pointerdown',down);el.removeEventListener('pointermove',move);el.removeEventListener('pointerup',up);el.removeEventListener('pointercancel',up);geo.dispose();group.children.forEach(o=>{if(o instanceof THREE.Mesh&&o!==mesh)o.geometry.dispose();});materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());renderer.dispose();renderer.domElement.remove();};
 },[merchant]);
 return <div className="coupon-interactive"><div className="canvas-host" ref={host} role="img" aria-label="Interactive double-sided CrazyBee coupon. Use the buttons below to rotate it."/>{!ready&&<div className="coupon-fallback">CrazyBee<br/><strong>Good food.<br/>Better together.</strong></div>}<div className="canvas-controls"><span><MoveHorizontal size={15}/> Drag to explore</span><button aria-label="Flip coupon" onClick={()=>target.current+=Math.PI}>Flip the deal</button><button aria-label="Reset coupon rotation" onClick={()=>target.current=merchant?Math.PI:0}><RotateCcw size={16}/></button></div></div>;
}

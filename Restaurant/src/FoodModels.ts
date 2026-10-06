import * as THREE from 'three';
/** Original small food sculptures with layered, fully volumetric geometry. */
export function createFood(index:number){
 const root=new THREE.Group();
 const mat=(color:number,roughness=.5)=>new THREE.MeshPhysicalMaterial({color,roughness,metalness:0,clearcoat:.16,clearcoatRoughness:.4,envMapIntensity:.5});
 const add=(g:THREE.BufferGeometry,m:THREE.Material,x=0,y=0,z=0)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);root.add(o);return o;};
 const ball=(m:THREE.Material,x:number,y:number,z:number,sx:number,sy:number,sz:number)=>{const o=add(new THREE.SphereGeometry(1,32,20),m,x,y,z);o.scale.set(sx,sy,sz);return o;};
 if(index===0){
  const bun=mat(0xc78436),sesame=mat(0xffe8bd),patty=mat(0x492418,.85),cheese=mat(0xffbd32),tomato=mat(0xcc3328),lettuce=mat(0x4e862f);
  ball(bun,0,-.37,0,.69,.17,.63);
  add(new THREE.CylinderGeometry(.62,.61,.17,48),patty,0,-.2,0);
  const slice=add(new THREE.BoxGeometry(1.04,.035,1.04),cheese,0,-.075,0);slice.rotation.y=.3;
  for(let i=0;i<10;i++){const t=i/10*Math.PI*2;const leaf=ball(lettuce,Math.cos(t)*.49,.04,Math.sin(t)*.46,.23,.045,.22);leaf.rotation.z=Math.sin(t)*.25;}
  add(new THREE.CylinderGeometry(.59,.59,.075,48),tomato,0,.08,0);
  const top=add(new THREE.SphereGeometry(.69,48,28,0,Math.PI*2,0,Math.PI/2),bun,0,.14,0);top.scale.set(1,.63,.94);
  for(let i=0;i<32;i++){const t=i*2.399,r=.58*Math.sqrt((i+.5)/32),x=Math.cos(t)*r,z=Math.sin(t)*r;const y=.14+Math.sqrt(.69*.69-r*r)*.63;const seed=ball(sesame,x,y+.012,z,.016,.012,.042);seed.rotation.y=t;}
  root.rotation.set(-.25,-.3,-.12);root.scale.setScalar(.95);
 }else if(index===1){
  const bread=mat(0xb67a38),cheese=mat(0xf1c56a),sauce=mat(0xb72e23),pepperoni=mat(0x9f3023),basil=mat(0x3a7838);
  const shape=new THREE.Shape();shape.moveTo(0,-.85);shape.lineTo(-.65,.58);shape.quadraticCurveTo(0,.88,.65,.58);shape.closePath();
  const base=add(new THREE.ExtrudeGeometry(shape,{depth:.07,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.055,bevelThickness:.035}),bread,0,0,-.08);
  const sauceLayer=add(new THREE.ShapeGeometry(shape,32),sauce,0,0,.14);sauceLayer.scale.set(.94,.94,1);
  const cheeseLayer=add(new THREE.ShapeGeometry(shape,32),cheese,0,-.025,.16);cheeseLayer.scale.set(.89,.9,1);
  const curve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(-.64,.59,.06),new THREE.Vector3(0,.87,.06),new THREE.Vector3(.64,.59,.06));add(new THREE.TubeGeometry(curve,36,.105,14,false),bread);
  for(const [x,y,r] of [[-.25,.34,.14],[.22,.31,.15],[0,-.12,.13],[-.12,-.41,.095]]){add(new THREE.CylinderGeometry(r,r,.025,28),pepperoni,x,y,.19).rotation.x=Math.PI/2;for(let k=0;k<5;k++){const a=k*2.4;ball(cheese,x+Math.cos(a)*r*.6,y+Math.sin(a)*r*.6,.22,.012,.009,.005);}}
  for(const [x,y,a] of [[-.38,.08,-.5],[.28,.49,.6],[.14,-.3,.3]]){const leaf=ball(basil,x,y,.21,.045,.11,.012);leaf.rotation.z=a;}
  root.rotation.set(-.1,.25,.27);root.scale.setScalar(.92);
 }else{
  const wrapper=mat(0xc76e65,.8),cake=mat(0xbd884b),cream=mat(0xffe4ca,.48),berry=mat(0xc72840,.3),leaf=mat(0x457040);
  add(new THREE.CylinderGeometry(.46,.33,.58,48),wrapper,0,-.24,0);
  for(let i=0;i<36;i++){const t=i/36*Math.PI*2;const path=new THREE.LineCurve3(new THREE.Vector3(Math.cos(t)*.334,-.53,Math.sin(t)*.334),new THREE.Vector3(Math.cos(t)*.465,.05,Math.sin(t)*.465));add(new THREE.TubeGeometry(path,1,.012,6,false),wrapper);}
  ball(cake,0,.035,0,.47,.14,.47);
  const pathPoints=[];for(let i=0;i<=180;i++){const t=i/180,a=t*Math.PI*6.2,r=.37*(1-t);pathPoints.push(new THREE.Vector3(Math.cos(a)*r,.15+t*.56,Math.sin(a)*r));}
  add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pathPoints),180,.105,12,false),cream);
  const strawberry=ball(berry,.04,.78,0,.13,.18,.12);strawberry.rotation.z=-.2;
  for(let i=0;i<5;i++){const t=i/5*Math.PI*2;const l=ball(leaf,.04+Math.cos(t)*.07,.92,Math.sin(t)*.07,.04,.012,.085);l.rotation.y=-t;}
  root.rotation.set(.2,-.4,-.1);root.scale.setScalar(1.05);
 }
 return root;
}

import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
/** Original stylized, fully volumetric reconstruction from CrazyBee's supplied mascot. */
export function createBee(){
 const bee=new THREE.Group();
 const material=(color:number,roughness=.85)=>new THREE.MeshPhysicalMaterial({color,roughness,metalness:0,sheen:.2,sheenColor:new THREE.Color(0xfff3e6),sheenRoughness:.9});
 const cream=material(0xffdfb5),red=material(0xf82e3d),pink=material(0xffd7d9),white=material(0xfffaf5),brown=material(0x351c16,.35),black=material(0x271310),blush=material(0xf6ac9d);
 const add=(g:THREE.BufferGeometry,m:THREE.Material,x=0,y=0,z=0)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);bee.add(o);return o;};
 const ball=(m:THREE.Material,x:number,y:number,z:number,sx:number,sy=sx,sz=sx)=>{const o=add(new THREE.SphereGeometry(1,40,28),m,x,y,z);o.scale.set(sx,sy,sz);return o;};
 const curve=(p:number[][],r:number,m:THREE.Material)=>add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(p.map(a=>new THREE.Vector3(...a as [number,number,number]))),32,r,10,false),m);
 const striped=material(0xffffff);striped.onBeforeCompile=shader=>{shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vLocal;').replace('#include <begin_vertex>','#include <begin_vertex>\nvLocal=position;');shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vLocal;').replace('#include <color_fragment>',`#include <color_fragment>
float band=step(0.0,sin((vLocal.y+.16)*10.0));diffuseColor.rgb=mix(vec3(.92,.024,.039),vec3(1.,.96,.9),band);`);};
 ball(striped,0,-.65,0,.73,.85,.57);
 const wingMat=new THREE.MeshPhysicalMaterial({color:0xffdce6,roughness:.48,transparent:true,opacity:.72,side:THREE.DoubleSide,metalness:0});
 for(const side of [-1,1]){
  const wing=ball(wingMat,side*.79,-.18,-.43,.48,.72,.065);wing.rotation.z=side*-.65;
  const lower=ball(wingMat,side*.65,-.69,-.47,.35,.4,.06);lower.rotation.z=side*.6;
  for(let i=0;i<3;i++)curve([[side*.35,-.52,-.35],[side*(.7+i*.07),-.1,-.37],[side*(.96+i*.055),.14-i*.13,-.4]],.008,pink);
  const arm=ball(cream,side*.85,-.56,.08,.24,.51,.23);arm.rotation.z=side*.7;
  ball(cream,side*1.11,-.82,.17,.22,.24,.2);
  ball(cream,side*.34,-1.48,.04,.24,.44,.24);ball(cream,side*.35,-1.78,.2,.32,.18,.4);
 }
 ball(cream,0,.8,0,1.02,.9,.77);
 // Sleepy, mischievous eyes with actual lids, pupils and highlights.
 for(const side of [-1,1]){
  const x=side*.39;ball(white,x,.77,.685,.29,.23,.115);ball(brown,x-side*.045,.735,.79,.105,.14,.034);ball(black,x-side*.045,.735,.815,.067,.105,.02);ball(white,x-side*.045+.025,.81,.835,.025,.032,.012);
  const lid=add(new THREE.SphereGeometry(1,32,20,0,Math.PI*2,0,Math.PI/2),cream,x,.81,.7);lid.scale.set(.315,.28,.125);lid.rotation.z=side*.1;
  curve([[x-.3,.86-side*.02,.75],[x,.83,.82],[x+.28,.86+side*.02,.75]],.018,brown);
  ball(blush,side*.72,.5,.577,.18,.1,.033);
 }
 curve([[-.16,.45,.724],[0,.365,.768],[.17,.45,.724]],.019,black);
 // Two antennae and the distinctive soft pink curl.
 for(const side of [-1,1]){curve([[side*.67,1.44,0],[side*.8,1.81,-.025],[side*.91,2.09,-.03]],.042,red);ball(red,side*.91,2.13,-.03,.16);}
 const curlPoints=[];for(let i=0;i<=24;i++){const t=i/24;curlPoints.push(new THREE.Vector2(Math.sin(Math.PI*t)*.24*(1-t*.5),t*.6));}const curl=add(new THREE.LatheGeometry(curlPoints,40),pink,0,1.48,.02);const pos=curl.geometry.attributes.position;for(let i=0;i<pos.count;i++){const y=pos.getY(i);pos.setX(i,pos.getX(i)+Math.pow(y/.6,2)*.23);}curl.geometry.computeVertexNormals();
 const scarf=add(new THREE.TorusGeometry(.48,.12,18,64),red,0,-.055,0);scarf.rotation.x=Math.PI/2;scarf.scale.x=1.23;ball(red,.44,-.11,.45,.15);const tail=ball(red,.52,-.35,.48,.14,.29,.08);tail.rotation.z=.55;
 curve([[-.42,-.08,.43],[-.08,-.51,.57],[.43,-1.03,.53]],.05,red);
 const bag=add(new RoundedBoxGeometry(.61,.58,.22,5,.11),red,.48,-1.03,.6);bag.rotation.z=-.1;
 const handle=add(new THREE.TorusGeometry(.15,.019,8,24,Math.PI),red,.48,-.73,.6);
 // Raised spoon and fork emblem on the bag's front face.
 const utensils=new THREE.Group();utensils.position.set(.48,-1.03,.735);utensils.rotation.z=-.1;bee.add(utensils);
 const utensil=(g:THREE.BufferGeometry,x:number,y:number,angle=0)=>{const o=new THREE.Mesh(g,white);o.position.set(x,y,0);o.rotation.z=angle;utensils.add(o);return o;};
 utensil(new THREE.CapsuleGeometry(.017,.3,4,8),0,0,-.65);const spoon=utensil(new THREE.SphereGeometry(1,16,12),-.105,.145);spoon.scale.set(.058,.075,.015);
 utensil(new THREE.CapsuleGeometry(.017,.29,4,8),0,0,.65);for(let i=0;i<3;i++)utensil(new THREE.CapsuleGeometry(.009,.075,3,6),.08+i*.025,.135+i*.014,.65);
 bee.scale.setScalar(.84);return bee;
}

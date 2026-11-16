import * as THREE from './vendor/three.module.js';
const host=document.getElementById('world');
try {
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(innerWidth,innerHeight);renderer.setClearColor(0,0);
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.8;
 host.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-label','Illustrated recycling world');
 const scene=new THREE.Scene();scene.background=new THREE.Color('#cbd9ca');scene.fog=new THREE.Fog('#cbd9ca',65,125);const camera=new THREE.PerspectiveCamera(42,innerWidth/innerHeight,.1,220);
 const ambient=new THREE.HemisphereLight(0xffffff,0x9aa58e,.8);scene.add(ambient);
 const sun=new THREE.DirectionalLight(0xfff7ea,2.0);sun.position.set(-8,16,12);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-13;sun.shadow.camera.right=13;sun.shadow.camera.top=13;sun.shadow.camera.bottom=-13;sun.shadow.camera.near=.5;sun.shadow.camera.far=65;sun.shadow.bias=-.00025;sun.shadow.normalBias=.035;sun.shadow.radius=5;scene.add(sun,sun.target);
 const rim=new THREE.DirectionalLight(0xdce7da,1.3);rim.position.set(7,7,-7);scene.add(rim);const fill=new THREE.DirectionalLight(0xffffff,.65);fill.position.set(0,2,13);scene.add(fill);
 // A small procedural studio gives the clear-coated surfaces soft, broad reflections.
 const envScene=new THREE.Scene();envScene.background=new THREE.Color('#e4e6df');
 const emat=new THREE.MeshBasicMaterial({color:'#fffef8',side:THREE.DoubleSide});
 [[-4,6,0,8,3],[3,4,5,5,7],[0,6,-5,8,5]].forEach(([x,y,z,w,h])=>{const p=new THREE.Mesh(new THREE.PlaneGeometry(w,h),emat);p.position.set(x,y,z);p.lookAt(0,0,0);envScene.add(p);});
 const pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(envScene,.015).texture;pmrem.dispose();
 const mats={};function mat(color,opts={}){const key=color+JSON.stringify(opts);return mats[key]??=(new THREE.MeshPhysicalMaterial({color,roughness:.65,metalness:.02,clearcoat:.12,clearcoatRoughness:.24,envMapIntensity:.22,...opts}));}
 const C={purple:'#667b6c',deep:'#296548',light:'#afc4b5',cream:'#fff7e6',white:'#fffdfb',ink:'#313c35',mint:'#77996b',green:'#34694f',gold:'#f5c96a',metal:'#adc8d7',pink:'#efb9cf',ground:'#efefe9'};
 const animations=[],materialObjects=[],islands=[],floaters=[];let simTime=0,boost=0,stageIndex=0,targetStage=0,home=true,motion=true,panel=false,type='plastic',dragYaw=0,dragTilt=0,mouseX=0,mouseY=0;let busyUntil=0;
 function mesh(g,m,parent,x=0,y=0,z=0){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
 function box(p,w,h,d,c,x=0,y=0,z=0,r=.09){let shape=new THREE.Shape(),a=w/2,b=h/2;const rr=Math.min(r,a*.8,b*.8,d*.45);shape.moveTo(-a+rr,-b);shape.lineTo(a-rr,-b);shape.quadraticCurveTo(a,-b,a,-b+rr);shape.lineTo(a,b-rr);shape.quadraticCurveTo(a,b,a-rr,b);shape.lineTo(-a+rr,b);shape.quadraticCurveTo(-a,b,-a,b-rr);shape.lineTo(-a,-b+rr);shape.quadraticCurveTo(-a,-b,-a+rr,-b);const g=new THREE.ExtrudeGeometry(shape,{depth:d-rr*2,bevelEnabled:true,bevelThickness:rr,bevelSize:rr,bevelSegments:3,steps:1,curveSegments:4});g.translate(0,0,-d/2+rr);return mesh(g,typeof c==='string'?mat(c):c,p,x,y,z);}
 function cylinder(p,r1,r2,h,c,x=0,y=0,z=0){return mesh(new THREE.CylinderGeometry(r1,r2,h,48),typeof c==='string'?mat(c):c,p,x,y,z);}
 function ball(p,r,c,x=0,y=0,z=0){return mesh(new THREE.SphereGeometry(r,32,20),typeof c==='string'?mat(c):c,p,x,y,z);}
 function torus(p,r,t,c,x=0,y=0,z=0){return mesh(new THREE.TorusGeometry(r,t,12,80),mat(c),p,x,y,z);}
 function tube(p,points,r,c){const curve=new THREE.CatmullRomCurve3(points.map(v=>new THREE.Vector3(...v)));return mesh(new THREE.TubeGeometry(curve,64,r,12,false),mat(c),p);}
 function label(p,text,w=.8,h=.3,x=0,y=0,z=0,color='#fffdfb',ink='#296548'){
  const canvas=document.createElement('canvas');canvas.width=768;canvas.height=256;const ctx=canvas.getContext('2d');ctx.fillStyle=color;ctx.fillRect(0,0,768,256);ctx.fillStyle=ink;ctx.font='bold 92px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,384,132,700);const tx=new THREE.CanvasTexture(canvas);tx.colorSpace=THREE.SRGBColorSpace;const o=mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tx,transparent:false}),p,x,y,z);o.castShadow=false;return o;
 }
 function plant(p,x,z,size=1){const g=new THREE.Group();p.add(g);g.position.set(x,0,z);g.scale.setScalar(size);cylinder(g,.13,.16,1.15,'#af9382',0,.5,0);const crown=ball(g,.73,C.mint,0,1.35,0);crown.scale.set(.8,1.3,.8);ball(g,.45,C.green,.32,1.15,.15).scale.set(.8,1.2,.8);const bed=cylinder(g,.65,.72,.16,'#d9eddb',0,.08,0);return g;}
 function shrub(p,x,z,s=.45){ball(p,s,C.green,x,s*.65,z).scale.set(1,.75,1);ball(p,s*.65,C.mint,x+.25,s*.6,z+.1);}
 function bench(p,x,z){const g=new THREE.Group();p.add(g);g.position.set(x,0,z);box(g,1.5,.16,.55,'#a47e51',0,.62,0);for(const q of [-.52,.52]){box(g,.12,.62,.4,C.white,q,.3,0);box(g,.12,.72,.1,C.white,q,.88,-.25);}box(g,1.5,.3,.1,'#a47e51',0,1.05,-.25);return g;}
 function pebble(p,x,z,r=.15){ball(p,r,'#bdc2b7',x,.1,z).scale.set(1,.55,.8);}
 function bottle(p,scale=1,x=0,y=0,z=0,col=C.light){const g=new THREE.Group();p.add(g);g.position.set(x,y,z);g.scale.setScalar(scale);const pts=[[0,0],[.26,0],[.34,.07],[.35,.24],[.35,1.04],[.3,1.15],[.17,1.36],[.16,1.56],[0,1.56]].map(v=>new THREE.Vector2(...v));mesh(new THREE.LatheGeometry(pts,48),mat(col,{roughness:.19,clearcoat:1}),g);cylinder(g,.18,.18,.16,C.deep,0,1.55,0);const wrap=cylinder(g,.354,.354,.45,C.white,0,.7,0);label(g,'↻',.4,.3,0,.71,.358,C.white,C.deep);for(let n=0;n<3;n++)torus(g,.349,.014,col,0,.18+n*.14,0).rotation.x=Math.PI/2;return g;}
 function can(p,s=1,x=0,y=0,z=0){const g=new THREE.Group();p.add(g);g.position.set(x,y,z);g.scale.setScalar(s);cylinder(g,.34,.34,1.04,mat('#bdd4de',{metalness:.5,roughness:.26}),0,.52,0);cylinder(g,.335,.335,.045,'#e7f0f3',0,1.06,0);cylinder(g,.335,.335,.04,'#8aa6b7',0,.02,0);const ring=torus(g,.28,.018,'#91a9ba',0,1.085,0);ring.rotation.x=Math.PI/2;const tab=torus(g,.09,.02,'#94afc0',0,1.09,.04);tab.rotation.x=Math.PI/2;tab.scale.z=.6;label(g,'↻',.4,.34,0,.54,.345,'#bdd4de','#577c94');return g;}
 function carton(p,s=1,x=0,y=0,z=0){const g=new THREE.Group();p.add(g);g.position.set(x,y,z);g.scale.setScalar(s);box(g,.84,.75,.75,'#edc89b',0,.4,0,.025);box(g,.16,.77,.755,'#f7dfbc',0,.4,0,.005);const line=box(g,.85,.018,.01,'#ad895a',0,.78,.382,.001);label(g,'↻',.32,.25,.19,.42,.39,'#edc89b','#a88052');return g;}
 function jar(p,s=1,x=0,y=0,z=0){const g=new THREE.Group();p.add(g);g.position.set(x,y,z);g.scale.setScalar(s);cylinder(g,.36,.38,.8,mat('#aad9c7',{roughness:.15,clearcoat:1}),0,.45,0);cylinder(g,.34,.34,.12,'#5fa68a',0,.92,0);label(g,'↻',.4,.3,0,.46,.383,'#e4f3ec','#4a8c72');return g;}
 function item(p,s=1,x=0,y=0,z=0,t='plastic',changing=false){const g=(t==='metal'?can:t==='paper'?carton:t==='glass'?jar:bottle)(p,s,x,y,z);if(changing)materialObjects.push({parent:p,object:g,s,x,y,z});return g;}
 function platform(cx,theme){const g=new THREE.Group();g.position.x=cx;scene.add(g);islands.push(g);return g;}
 function groundDecor(g){for(let k=0;k<9;k++){const a=k*1.7;pebble(g,Math.sin(a)*4.4,Math.cos(a)*4.4,.1+k%3*.025);}plant(g,-3,-1.4,1.15);plant(g,-2.6,-2.7,.8);plant(g,3.1,-1.8,.9);shrub(g,-3.4,-.3);shrub(g,3.7,-.5,.5);for(let k=0;k<5;k++)ball(g,.06,C.gold,-3.6+k*.14,.39,-.3+Math.sin(k)*.2);}
 function bin(p,x,z,c=C.purple,mark='↻'){const g=new THREE.Group();p.add(g);g.position.set(x,0,z);box(g,1.2,1.66,1.02,c,0,.9,0,.12);box(g,1.36,.2,1.16,c,0,1.81,0,.07);box(g,.82,.19,.08,C.ink,0,1.62,.55,.04);box(g,.67,.66,.03,C.white,0,1,.54,.1);label(g,mark,.5,.35,0,1,.567);for(const q of [-.37,.37]){cylinder(g,.14,.14,.12,C.ink,q,.16,.48).rotation.x=Math.PI/2;}return g;}
 function truck(p,x,z){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=-.3;p.add(g);box(g,1.38,1.28,2.1,C.light,0,1.12,-.32,.16);box(g,1.4,.92,1.2,C.purple,0,.94,1.18,.13);box(g,1.11,.42,.07,'#d5e5ee',0,1.29,1.81,.045);box(g,1.35,.16,.15,C.white,0,.58,1.86,.04);box(g,.22,.13,.04,C.gold,-.45,.81,1.85,.03);box(g,.22,.13,.04,C.gold,.45,.81,1.85,.03);label(g,'↻',.7,.62,.705,1.18,-.15,C.light,C.deep).rotation.y=Math.PI/2;for(const dx of [-.75,.75])for(const dz of [-.97,1.05]){const tire=cylinder(g,.32,.32,.19,C.ink,dx,.33,dz);tire.rotation.z=Math.PI/2;const hub=cylinder(g,.16,.16,.2,C.white,dx*1.014,.33,dz);hub.rotation.z=Math.PI/2;}return g;}
 const p0=platform(0,'#e8ece6');groundDecor(p0);bench(p0,-2.5,1.8);
 const station=new THREE.Group();p0.add(station);station.position.set(-.5,0,-.8);
 box(station,3.3,.17,2.1,C.white,0,.08,0,.12);
 const b1=bin(station,-.68,.2,C.purple);const b2=bin(station,.74,.2,'#ddc09c','▤');b2.scale.setScalar(.86);
 for(const x of [-1.6,1.6])cylinder(station,.06,.06,2.65,C.white,x,1.34,-.65);
 box(station,3.6,.3,2.4,C.white,0,2.72,.1,.13);box(station,3.3,.035,.15,C.deep,0,2.55,1.19,.01);label(station,'RIVERSIDE',2.4,.25,0,2.75,1.325,C.white,'#455e49');
 const loop=torus(station,.65,.12,C.deep,0,3.7,-.05);loop.rotation.z=-.5;const loopArrow=mesh(new THREE.ConeGeometry(.19,.4,3),mat(C.deep),station,.62,3.9,-.05);loopArrow.rotation.z=-1.1;
 const focalBottle=item(p0,1.45,1.5,.4,.0,'plastic',true);focalBottle.rotation.z=-.15;floaters.push({object:focalBottle,base:.4,phase:0});
 const van=truck(scene,0,5.6);van.scale.setScalar(.72);van.rotation.y=Math.PI/2;label(p0,'01',.8,.45,0,.032,3.55,'#f1f1eb','#859681').rotation.x=-Math.PI/2;
 // Sorting studio: rounded scanner and a moving material belt.
 const p1=platform(10,'#e1e9f0');groundDecor(p1);bench(p1,-2.8,1.8);
 box(p1,4.7,.48,1.45,C.light,.15,.7,.3,.18);box(p1,4.55,.08,1.25,'#535b54',.15,.99,.3,.035);
 for(let k=0;k<11;k++){const roller=cylinder(p1,.08,.08,1.24,'#a2aaa0',-2+k*.43,1.04,.3);roller.rotation.x=Math.PI/2;animations.push((t)=>roller.rotation.y=t);}
 for(const x of [-1.7,1.7]){box(p1,.18,.66,.85,C.white,x,.33,.3);}
 const gate=new THREE.Group();p1.add(gate);gate.position.set(.5,0,.3);for(const z of [-.85,.85])box(gate,.68,2.65,.4,C.white,0,1.45,z,.17);box(gate,.68,.55,2.1,C.white,0,2.6,0,.2);box(gate,.7,.22,1.3,C.deep,0,2.35,0,.06);label(gate,'SORT',.9,.27,.36,2.7,0,C.white,C.deep).rotation.y=Math.PI/2;
 const scan=box(gate,.025,1.3,1.24,new THREE.MeshBasicMaterial({color:'#9cdea2',transparent:true,opacity:.12,depthWrite:false}),0,1.65,0,.003);animations.push(t=>{scan.position.x=Math.sin(t*1.2)*.2;scan.material.opacity=.08+Math.sin(t*3)*.045;});
 for(let k=0;k<5;k++){const o=item(p1,.5,-2+k*.75,1.04,.3,['plastic','metal','paper'][k%3]);animations.push((t)=>{o.position.x=-2.15+((t*.25+k*.83)%4.35);o.rotation.z=Math.sin(t+k)*.035;});}
 const sortedA=bin(p1,1.45,-1.8,C.purple);sortedA.scale.setScalar(.7);const sortedB=bin(p1,2.55,-1.5,'#b0cddb');sortedB.scale.setScalar(.7);const reject=box(p1,1.1,.6,.8,'#efc788',-1.4,-.01,-1.7,.08);reject.position.y=.3;label(p1,'02',.8,.45,0,.032,3.55,'#f1f1eb','#a1b3c4').rotation.x=-Math.PI/2;
 // Transformation lab: a soft industrial still-life, driven by the chosen material.
 const p2=platform(20,'#d8dfcb');groundDecor(p2);
 const machine=new THREE.Group();p2.add(machine);machine.position.set(-.5,0,-.5);
 box(machine,3.4,.35,2.9,C.white,0,.18,0,.14);box(machine,2.1,1.6,1.7,C.purple,-.3,1.08,0,.22);box(machine,1.65,1.12,.04,C.light,-.3,1.12,.88,.16);
 const portal=torus(machine,.43,.095,C.white,-.3,1.25,.94);const dial=cylinder(machine,.34,.34,.04,'#465449',-.3,1.25,.94);dial.rotation.x=Math.PI/2;const spiral=torus(machine,.22,.035,C.gold,-.3,1.25,.98);animations.push(t=>spiral.rotation.z=t);
 cylinder(machine,.53,.53,1.0,C.white,-.3,2.2,-.1);cylinder(machine,.66,.53,.3,C.light,-.3,2.86,-.1);label(machine,'RE:MAKE',1.1,.23,-.3,.66,.914,C.light,C.deep);
 const tank=cylinder(machine,.5,.5,1.85,mat('#d6e2f5',{transparent:true,opacity:.5,roughness:.13,depthWrite:false}),1.22,1.3,-.55);cylinder(machine,.57,.57,.14,C.white,1.22,2.28,-.55);cylinder(machine,.57,.57,.18,C.white,1.22,.33,-.55);
 tube(machine,[[1.22,2.3,-.55],[1.22,3,-.55],[.4,3,-.55],[.3,2.4,-.55]],.12,C.white);
 const flakes=[];for(let k=0;k<28;k++){const a=k*2.39,r=.18+(k%3)*.06;const o=box(machine,.12,.11,.09,C.light,1.22+Math.cos(a)*r,.6+(k%9)*.15,-.55+Math.sin(a)*r,.02);flakes.push(o);animations.push(t=>{o.rotation.set(t*.3+k,t*.5+k,0);o.position.y=.5+((t*.18+k*.17)%1.5);});}
 box(machine,1.05,.36,1.35,C.white,-.5,.25,1.7,.13);for(let k=0;k<14;k++)ball(machine,.07,C.light,-.7+(k%4)*.17,.48,1.4+Math.floor(k/4)*.15);
 const input=item(p2,.72,-1.8,2.25,.5,'plastic',true);floaters.push({object:input,base:2.25,phase:2});bench(p2,2.7,2);label(p2,'03',.8,.45,0,.032,3.55,'#f1f1eb','#8a9c8c').rotation.x=-Math.PI/2;
 // Possible next use: a display garden, never presented as an actual tracked outcome.
 const p3=platform(30,'#e1ecdf');groundDecor(p3);
 // A small, explorable courtyard showing potential material applications.
 for(let row=0;row<7;row++)for(let col=0;col<7;col++){const x=(col-3)*.83,z=(row-3)*.83;if(Math.hypot(x,z)<3.8)box(p3,.79,.06,.79,(row+col)%2?'#dfded5':'#e8e7df',x,.02,z,.018);}
 const pavilion=new THREE.Group();p3.add(pavilion);pavilion.position.set(.2,0,-1.55);
 for(const x of [-1.7,1.7])for(const z of [-.8,.8])box(pavilion,.14,2.7,.14,'#7a8576',x,1.35,z,.02);
 for(let i=0;i<11;i++)box(pavilion,.12,.17,2.2,'#ad967b',-1.8+i*.36,2.75,0,.02);
 box(pavilion,3.9,.16,.12,'#7a8576',0,2.65,-.9,.02);box(pavilion,3.9,.16,.12,'#7a8576',0,2.65,.9,.02);
 bench(p3,-1.7,.6);bench(p3,1.8,.4).rotation.y=-Math.PI/2;
 for(const [x,z] of [[-2.8,1.8],[2.5,1.9]]){box(p3,1.1,.6,.8,'#b39c80',x,.3,z,.04);box(p3,.95,.03,.65,'#555c45',x,.62,z,.01);for(let i=0;i<5;i++){const leaf=ball(p3,.23,i%2?'#7c956d':'#adc09a',x+(i-2)*.17,.85+Math.sin(i)*.13,z);leaf.scale.set(.6,1.5,.7);}}
 const table=cylinder(p3,.6,.6,.1,'#c5b394',.35,.9,1.45);cylinder(p3,.08,.12,.85,'#5c6c5f',.35,.43,1.45);
 for(const [x,z] of [[-.45,1.45],[1.1,1.45]]){cylinder(p3,.27,.27,.08,'#b49c7e',x,.49,z);cylinder(p3,.05,.09,.47,'#5c6c5f',x,.23,z);}
 const starGroup=new THREE.Group();p3.add(starGroup);const star=torus(starGroup,.01,.002,C.gold);star.visible=false;
 label(p3,'A NEW USE',1.1,.26,.2,1.9,-.7,C.white,'#45604a');

 // One continuous landscape. All four processes coexist; nothing is swapped out.
 focalBottle.visible=false;input.visible=false;
 box(scene,160,.5,130,'#99af88',15,-.46,0,.02);
 box(scene,41,.12,8.1,'#d6d7c8',15,-.08,0,.02);
 box(scene,2.5,.06,9,'#c5c8b2',30,-.1,9,.02);
 for(let x=-5;x<37;x+=5){cylinder(scene,.05,.07,2.8,'#4a6050',x,1.4,3.7);box(scene,.6,.09,.35,'#e4d9a9',x,2.85,3.7,.03);}
 for(let x=-4;x<35;x+=1)box(scene,.45,.012,.13,'#ebe6cd',x,0,3.5,.01);

 box(scene,55,.06,3.1,'#5a6661',15,-.14,5.6,.01);
 box(scene,55,.08,.18,'#e3dfc9',15,-.1,3.98,.01);
 box(scene,55,.08,.18,'#e3dfc9',15,-.1,7.2,.01);
 for(let x=-12;x<44;x+=2)box(scene,.85,.015,.06,'#d6d7c6',x,-.095,5.6,.001);
 // Connected service belt between sorting and processing.
 box(scene,7.7,.28,1.15,'#566b5c',15,1.0,.3,.04);
 for(let x=11.9;x<19;x+=.45){const roller=cylinder(scene,.07,.07,1.0,'#b5c2b5',x,1.17,.3);roller.rotation.x=Math.PI/2;}
 for(let x=12;x<19;x+=2)box(scene,.12,1.12,.7,'#718374',x,.5,.3,.02);
 // Factory walls are a single open cutaway rather than separate display stands.
 box(scene,21,4,.24,'#c7c6ac',15,1.9,-4.0,.02);
 for(let x=5;x<=25;x+=2.5){box(scene,.15,4.3,.18,'#557564',x,2,-3.8,.02);box(scene,2.1,1.05,.08,'#8caaa6',x+1.15,2.8,-3.83,.02);}
 box(scene,21,.22,1.3,'#517360',15,4.13,-3.55,.02);
 label(scene,'MATERIAL WORKS',7,.7,15,3.95,-3.68,'#517360','#f7f3dd');
 // Neighbourhood buildings and service details provide depth beyond the route.
 for(let k=0;k<9;k++){let x=-9+k*6;let h=3+(k%3)*1.2;box(scene,4,h,3,k%2?'#cfbea0':'#d7d4b9',x,h/2,-10,.04);box(scene,4.3,.24,3.3,'#677c6b',x,h+.1,-10,.02);for(let w=0;w<3;w++)box(scene,.65,.85,.03,'#6e9290',x-1.2+w*1.2,h-.85,-8.47,.01);}
 for(let k=0;k<38;k++){let x=-20+(k*7.13)%72;let z=k%2?-16-(k%4)*2:11+(k%5)*2;plant(scene,x,z,1.1+(k%4)*.3);}
 // A stream and a pedestrian bridge connect the garden to its surroundings.
 box(scene,90,.03,3.2,'#729e9e',15,-.15,13,.01);
 for(let x=26;x<34;x+=.42)box(scene,.35,.12,4.3,'#ab8e61',x,.04,13,.01);
 for(const z of [11,15]){box(scene,8,.1,.1,'#7a6c50',30,.8,z,.02);for(let x=26;x<34;x+=1.5)box(scene,.08,.9,.08,'#7a6c50',x,.4,z,.01);}
 // Small people keep the world at a human scale.
 function person(x,z,c){const g=new THREE.Group();scene.add(g);g.position.set(x,0,z);cylinder(g,.14,.2,.55,c,0,.72,0);ball(g,.16,'#d0aa84',0,1.16,0);for(const q of [-.1,.1])box(g,.1,.46,.12,'#3e4f48',q,.24,0,.02);return g;}
 person(-2,2.8,'#bc7746');person(9,-1.8,'#c8a651');person(29,1,'#b15b40');person(33,2,'#557e83');
 const carrier=truck(scene,22.7,5.6);carrier.scale.setScalar(.6);carrier.rotation.y=Math.PI/2;carrier.visible=false;
 let hero=bottle(scene,.65,1.2,1.2,1.8,'#e2b650');let selectedMaterial='plastic';
 const halo=torus(scene,.48,.026,'#fff0b7');halo.rotation.x=Math.PI/2;
 const trail=[];for(let k=0;k<16;k++){const q=ball(scene,.035,'#efdb8f');trail.push(q);}
 const fragments=new THREE.Group();scene.add(fragments);for(let k=0;k<22;k++)box(fragments,.09,.08,.1,k%2?'#d5b96a':'#91ac83',Math.sin(k*2.4)*.25,(k%5)*.12,Math.cos(k*2.4)*.25,.01);
 let product=bottle(scene,1.6,29,0,1.7);product.visible=false;
 function switchMaterial(t){
  if(!['plastic','metal','paper','glass'].includes(t)||t===selectedMaterial)return;
  selectedMaterial=t;scene.remove(hero);scene.remove(product);
  hero=item(scene,.8,1.2,1.2,1.8,t);
  product=item(scene,1.6,29,0,1.7,t);product.visible=false;
  const shade=t==='metal'?'#a2c3d1':t==='paper'?'#dfc59d':t==='glass'?'#79af98':'#c6be86';
  fragments.children.forEach((piece,k)=>{piece.material=mat(shade);piece.scale.set(t==='paper'?1.8:1,t==='paper'?.25:1,t==='metal'?1.6:1);});
 }

 const routePoints=[
 [1.2,1.2,1.8],[0,2.2,0],[0,1,5.6],[7.8,1,5.6],[7.9,1.35,.3],
 [10.6,1.35,.3],[15,1.35,.3],[19.5,2.8,-.5],[20.7,1.4,.4],[22.7,.8,5.6],[29,.8,5.6],[29,.5,1.7]
 ].map(a=>new THREE.Vector3(...a));
 const checkpoints=[0,.08,.15,.29,.34,.43,.52,.62,.72,.79,.9,1];
 function at(t){let n=0;while(n<checkpoints.length-2&&t>checkpoints[n+1])n++;const q=THREE.MathUtils.clamp((t-checkpoints[n])/(checkpoints[n+1]-checkpoints[n]),0,1);return routePoints[n].clone().lerp(routePoints[n+1],q*q*(3-2*q));}
 let progress=0,playing=false,started=false,overview=true,last=performance.now(),zoom=1,dragging=false,px=0,py=0,travel=0,blocked=false,speed=1,still=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 const look=new THREE.Vector3(15,0,0),camTarget=new THREE.Vector3();camera.position.set(39,32,40);camera.lookAt(look);
 const emit=()=>window.dispatchEvent(new CustomEvent('world-state',{detail:{progress,playing,overview,started,speed}}));
 function start(){started=true;playing=true;still=false;overview=false;if(progress>=1)progress=0;emit();}
 window.addEventListener('world-command',e=>{const c=e.detail;
 if(c&&typeof c==='object'){
  if(c.action==='task'){switchMaterial(c.material);progress=[.08,.43,.72,1][c.stage]??0;playing=false;started=true;overview=c.overview;blocked=false;still=c.reduceMotion;dragYaw=0;dragTilt=0;emit();}
  if(c.action==='seek'){progress=THREE.MathUtils.clamp(c.value,0,1);started=true;playing=false;overview=false;emit();}
  if(c.action==='scenario'){scan.material.color.set(c.value==='contaminated'?'#e7a352':'#9cdea2');}
  if(c.action==='speed'){speed=c.value===2?2:1;emit();}
  if(c.action==='motion'){still=!c.value;if(still)playing=false;emit();}
 }
 if(c==='start')start();
 if(c==='pause'){playing=!playing;emit();}
 if(c==='overview'){overview=!overview;dragYaw=0;dragTilt=0;emit();}
 if(c==='restart'){progress=0;start();}
 if(c==='back'){blocked=false;}
 if(c==='panel'){blocked=true;}
 });
 const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();const interactive=renderer.domElement;interactive.style.touchAction='none';
 interactive.addEventListener('pointerdown',e=>{dragging=true;travel=0;px=e.clientX;py=e.clientY;interactive.setPointerCapture(e.pointerId);});
 interactive.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-px,dy=e.clientY-py;travel+=Math.abs(dx)+Math.abs(dy);dragYaw+=dx*.005;dragTilt=THREE.MathUtils.clamp(dragTilt+dy*.003,-.35,.4);px=e.clientX;py=e.clientY;});
 interactive.addEventListener('pointerup',e=>{dragging=false;if(interactive.hasPointerCapture(e.pointerId))interactive.releasePointerCapture(e.pointerId);if(travel<8){pointer.set(e.clientX/innerWidth*2-1,1-e.clientY/innerHeight*2);ray.setFromCamera(pointer,camera);if(ray.intersectObject(hero,true).length)start();else{const hit=ray.intersectObjects([station,gate,machine,pavilion],true)[0];if(hit){let o=hit.object;while(o.parent&&!([station,gate,machine,pavilion].includes(o)))o=o.parent;window.dispatchEvent(new CustomEvent('world-inspect',{detail:[station,gate,machine,pavilion].indexOf(o)}));}}}});
 interactive.addEventListener('pointercancel',()=>dragging=false);
 interactive.addEventListener('wheel',e=>{e.preventDefault();zoom=THREE.MathUtils.clamp(zoom+e.deltaY*.001,.7,1.6);},{passive:false});
 window.addEventListener('resize',()=>{renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();});
 const captions=['Choose your item.','Collected. The journey begins.','Useful material, separated.','Prepared for manufacturing.','A possible new beginning.'];
 let lastCaption=-1,uiTime=0;const p=new THREE.Vector3();
 function frame(now){requestAnimationFrame(frame);const dt=Math.min((now-last)/1000,.05);last=now;if(document.hidden)return;
 const modalOpen=!!document.querySelector('dialog[open]');if(!blocked&&!modalOpen){if(!still)simTime+=dt;if(playing){progress=Math.min(1,progress+dt*speed/20);if(progress===1){playing=false;emit();}}}
 p.copy(at(progress));hero.position.copy(p);hero.rotation.y=simTime*.45;hero.visible=progress<.62;
 // The tracked item rides inside the vehicle between the collection point and works.
 if(progress>.15&&progress<.29){van.position.set(p.x,0,5.6);hero.position.set(p.x,1.7,5.3);}
 else if(progress>=.29)van.position.set(7.8,0,5.6);else van.position.set(0,0,5.6);
 fragments.visible=progress>=.62&&progress<.94;fragments.position.copy(p);fragments.rotation.y=simTime*.8;
 carrier.visible=progress>=.79&&progress<.94;if(carrier.visible){carrier.position.set(p.x,0,5.6);fragments.position.set(p.x,1.45,5.3);}
 product.visible=progress>=.94;if(product.visible){product.scale.setScalar(.1+.9*Math.min(1,(progress-.94)/.06));product.position.y=Math.sin(Math.min(1,(progress-.94)/.06)*Math.PI)*.5;}
 halo.position.set(p.x,.03,p.z);halo.scale.setScalar(1+Math.sin(simTime*2)*.12);
 trail.forEach((q,k)=>{q.position.copy(at(Math.max(0,progress-k*.002)));q.position.y+=.4;q.visible=started&&progress<.95;});
 animations.forEach(fn=>fn(simTime));loop.rotation.y=simTime*.25;
 // Continuous following camera, or freely orbit the whole working neighbourhood.
 const mobile=innerWidth<760;const center=overview?new THREE.Vector3(15,0,1):p.clone().setY(.8);
 const dist=(overview?(mobile?81:55):(mobile?28:19))*zoom;
 if(!mobile)center.x-=overview?10:4.8;
 const yaw=.2+dragYaw,pitch=THREE.MathUtils.clamp((overview?.78:.62)+dragTilt,.25,1.35);
 const offset=new THREE.Vector3(Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch)).multiplyScalar(dist);
 camTarget.copy(center).add(offset);camera.position.lerp(camTarget,still?1:1-Math.exp(-dt*5.5));look.lerp(center,still?1:1-Math.exp(-dt*5.5));camera.lookAt(look);
 sun.position.set(look.x-10,20,12);sun.target.position.set(look.x,0,0);
 const caption=!started?0:progress<.34?1:progress<.62?2:progress<.9?3:4;
 if(caption!==lastCaption){lastCaption=caption;window.dispatchEvent(new CustomEvent('world-caption',{detail:{text:captions[caption],stage:Math.max(0,caption-1)}}));}
 uiTime+=dt;if(uiTime>.2){uiTime=0;emit();}
 renderer.render(scene,camera);
 }
 requestAnimationFrame(frame);setTimeout(()=>window.dispatchEvent(new Event('loop-ready')),100);
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();window.dispatchEvent(new Event('loop-failed'));});
} catch(error) {console.error('Scene unavailable:',error);window.dispatchEvent(new Event('loop-failed'));}

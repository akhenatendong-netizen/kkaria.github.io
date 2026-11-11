import * as T from 'three';
export {T};
const mats=new Map(), sphereGeo=new T.SphereGeometry(1,24,16), cylCache=new Map();
export function material(color,roughness=.36){const key=color+':'+roughness;if(!mats.has(key))mats.set(key,new T.MeshPhysicalMaterial({color,roughness,metalness:.02,clearcoat:.5,clearcoatRoughness:.24}));return mats.get(key);}
export function mesh(geometry,mat,parent,x=0,y=0,z=0){const m=new T.Mesh(geometry,typeof mat==='string'?material(mat):mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent?.add(m);return m;}
export function ball(parent,color,x,y,z,sx=1,sy=sx,sz=sx){const m=mesh(sphereGeo,typeof color==='string'?material(color):color,parent,x,y,z);m.scale.set(sx,sy,sz);return m;}
export function cylinder(parent,color,x,y,z,rt,rb,h,segments=40){const key=[rt,rb,h,segments].join();if(!cylCache.has(key))cylCache.set(key,new T.CylinderGeometry(rt,rb,h,segments));return mesh(cylCache.get(key),color,parent,x,y,z);}
export function tube(parent,points,r,color,segments=24){const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));return mesh(new T.TubeGeometry(curve,segments,r,8,false),color,parent);}
export function box(parent,color,x,y,z,sx,sy,sz,bevel=.08){const shape=new T.Shape(),w=sx/2,h=sy/2,b=Math.min(bevel,w,h,sz/2);shape.moveTo(-w+b,-h);shape.lineTo(w-b,-h);shape.quadraticCurveTo(w,-h,w,-h+b);shape.lineTo(w,h-b);shape.quadraticCurveTo(w,h,w-b,h);shape.lineTo(-w+b,h);shape.quadraticCurveTo(-w,h,-w,h-b);shape.lineTo(-w,-h+b);shape.quadraticCurveTo(-w,-h,-w+b,-h);const geo=new T.ExtrudeGeometry(shape,{depth:Math.max(.001,sz-2*b),bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:b,bevelThickness:b,curveSegments:4});geo.translate(0,0,-sz/2+b);return mesh(geo,color,parent,x,y,z);}
export function leaf(parent,color,x,y,z,scale=1,angle=0){const m=ball(parent,color,x,y,z,.2*scale,.085*scale,.65*scale);m.rotation.set(-.3,angle,.2);return m;}
export function tree(parent,x,z,height=3.8,color='#6fa978',type='round'){
 const g=new T.Group();g.position.set(x,.85,z);parent.add(g);tube(g,[[0,0,0],[.05,height*.4,.02],[-.08,height*.7,0]],.14,'#bb916f');
 if(type==='round') {ball(g,color,0,height*.74,0,height*.34,height*.43,height*.32);ball(g,color,-height*.22,height*.65,.08,height*.24,height*.29,height*.25);ball(g,color,height*.21,height*.7,-.12,height*.27,height*.32,height*.27);}
 else {for(let i=0;i<7;i++){const a=i/7*Math.PI*2,l=new T.Group();l.position.y=height*.7;l.rotation.y=a;g.add(l);leaf(l,color,0,.08,.7,height*.6,0);}}
 return g;
}
export function flower(parent,x,z,color='#f5b3cd',height=.7){const g=new T.Group();g.position.set(x,.88,z);parent.add(g);cylinder(g,'#4e9470',0,height/2,0,.025,.035,height,8);leaf(g,'#70b182',.08,height*.4,.02,.4,-1);const blossom=new T.Group();blossom.position.y=height;g.add(blossom);for(let i=0;i<6;i++){const a=i/6*Math.PI*2,p=ball(blossom,color,Math.cos(a)*.17,0,Math.sin(a)*.17,.18,.095,.11);p.rotation.y=-a;}ball(blossom,'#ffd77a',0,.06,0,.12,.09,.12);g.userData.blossom=blossom;return g;}
export function fern(parent,x,z,scale=1,color='#57966c'){
 const g=new T.Group();g.position.set(x,.88,z);g.scale.setScalar(scale);parent.add(g);
 for(let j=0;j<7;j++){const frond=new T.Group();frond.rotation.y=j/7*Math.PI*2;g.add(frond);tube(frond,[[0,0,0],[0,.7,.35],[0,1.1,1],[0,.8,1.55]],.028,'#6c9c60');for(let k=1;k<7;k++){const t=k/7;for(const side of [-1,1]){const m=ball(frond,color,side*.24*Math.sin(t*Math.PI),Math.sin(t*Math.PI*.8)*.85+.12,t*1.45,.12*(1-t*.65),.045,.36*(1-t*.65));m.rotation.set(.2,side*.85,.1);}}}
 return g;
}
export function mushroom(parent,x,z,s=.5,color='#f59a9e'){const g=new T.Group();g.position.set(x,.85,z);g.scale.setScalar(s);parent.add(g);cylinder(g,'#fff4d7',0,.4,0,.17,.21,.8,16);const dome=mesh(new T.SphereGeometry(.57,24,12,0,Math.PI*2,0,Math.PI/2),color,g,0,.65,0);dome.scale.y=.7;cylinder(g,'#f5d5bb',0,.65,0,.57,.57,.06,24);for(let i=0;i<5;i++){let a=i*2.4;ball(g,'#fff5da',Math.sin(a)*.32,.96,Math.cos(a)*.32,.085,.035,.085);}return g;}
export function bench(parent,x,z,angle=0){const g=new T.Group();g.position.set(x,1,z);g.rotation.y=angle;parent.add(g);for(let i=0;i<3;i++)box(g,'#dcad79',0,.55,(i-1)*.19,1.8,.12,.16);for(const side of [-1,1]){box(g,'#6d9280',side*.65,.28,0,.11,.6,.48);box(g,'#6d9280',side*.65,.85,-.25,.08,.85,.08);}for(let i=0;i<2;i++)box(g,'#dcad79',0,.92+i*.22,-.27,1.8,.15,.11);return g;}
export function stones(parent,points){points.forEach((p,i)=>{const m=ball(parent,'#f3dfba',p[0],.91,p[1],.44,.1,.32);m.rotation.y=i*.8;});}
export function greenhouse(parent){
 const g=new T.Group();g.position.y=.92;parent.add(g);box(g,'#f5e4c4',0,.12,0,4.4,.3,4.3);const frame='#e0f2d4',glass=new T.MeshPhysicalMaterial({color:'#a5e4d1',transparent:true,opacity:.35,roughness:.1,metalness:.02,clearcoat:1,side:T.DoubleSide,depthWrite:false});
 const archPoints=[];for(let j=0;j<=24;j++){const a=j/24*Math.PI;archPoints.push([Math.cos(a)*2,1.5+Math.sin(a)*1.7,0]);}
 for(const z of [-2,-1,0,1,2]){tube(g,archPoints.map(p=>[p[0],p[1],z]),.055,frame,30);for(const side of [-1,1])cylinder(g,frame,side*2,.84,z,.055,.055,1.4,12);}
 for(const side of [-1,1]){box(g,glass,side*2,.9,0,.025,1.6,4);box(g,frame,side*2,.55,0,.08,.08,4.15);box(g,frame,side*2,1.5,0,.08,.08,4.15);}
 const roof=mesh(new T.CylinderGeometry(2,2,4,48,1,true,0,Math.PI),glass,g,0,1.5,0);roof.rotation.x=Math.PI/2;roof.rotation.z=Math.PI/2;roof.scale.set(1,.85,1);
 for(const z of [-2,2]){const curve=new T.Shape();curve.moveTo(-2,.2);curve.lineTo(2,.2);curve.lineTo(2,1.5);for(let i=0;i<=32;i++){const a=i/32*Math.PI;curve.lineTo(2*Math.cos(a),1.5+1.7*Math.sin(a));}curve.closePath();mesh(new T.ShapeGeometry(curve),glass,g,0,0,z);}
 // Open doorway and a white roof spine keep the silhouette readable from every angle.
 box(g,frame,0,3.19,0,.09,.09,4.15);for(const side of [-1,1])box(g,frame,side*.48,.95,2.03,.07,1.8,.07);box(g,frame,0,1.84,2.03,1,.07,.07);
 for(const side of [-1,1]){cylinder(g,'#cd8a6c',side*1.15,.38,-.65,.4,.3,.55,24);tree(g,side*1.15,-.65,2,'#6eae76','palm');}
 return g;
}
export function emoji(parent,feeling,r=.7){
 const palette={calm:'#8edbb3',amazed:'#f4948b',curious:'#af97e7',confused:'#8bc4ed',neutral:'#edc969'};const g=new T.Group();g.scale.setScalar(r);parent.add(g);const skin=new T.MeshPhysicalMaterial({color:palette[feeling]||palette.curious,roughness:.2,clearcoat:1,clearcoatRoughness:.15,metalness:.02});
 mesh(new T.SphereGeometry(1,48,32),skin,g);
 const dark=material('#344149',.25),white=material('#fffce9',.23),eyes=[];
 if(feeling==='calm')for(const s of [-1,1])tube(g,[[s*.33-.14,.15,.96],[s*.33,.06,.99],[s*.33+.14,.15,.96]],.035,dark,16);
 else for(const s of [-1,1]){const eye=ball(g,white,s*.33,.16,.9,.19,.27,.105);eyes.push(eye);ball(g,dark,s*.33+.025,.15,.995,.083,.15,.05);ball(g,'#ffffff',s*.33+.005,.21,1.035,.025,.038,.018);}
 if(feeling==='amazed')ball(g,dark,0,-.39,.93,.13,.18,.045);
 else if(feeling==='neutral')tube(g,[[-.16,-.37,.95],[0,-.37,.99],[.16,-.37,.95]],.029,dark,16);
 else if(feeling==='confused'){tube(g,[[-.2,-.4,.92],[0,-.3,.99],[.2,-.39,.92]],.03,dark,16);tube(g,[[-.48,.5,.81],[-.2,.4,.94]],.025,dark);tube(g,[[.2,.48,.88],[.47,.6,.79]],.025,dark);}
 else tube(g,[[-.27,-.28,.93],[0,-.46,.97],[.27,-.28,.93]],.03,dark,20);
 g.userData.eyes=eyes;g.userData.feeling=feeling;return g;
}
export function shadow(parent,x,z,size=2,opacity=.18){const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d');const grad=ctx.createRadialGradient(64,64,5,64,64,64);grad.addColorStop(0,'rgba(42,70,51,.8)');grad.addColorStop(1,'rgba(42,70,51,0)');ctx.fillStyle=grad;ctx.fillRect(0,0,128,128);const texture=new T.CanvasTexture(c);const plane=mesh(new T.PlaneGeometry(size,size),new T.MeshBasicMaterial({map:texture,transparent:true,opacity,depthWrite:false}),parent,x,.91,z);plane.rotation.x=-Math.PI/2;plane.castShadow=false;plane.receiveShadow=false;return plane;}
export function butterfly(parent,color='#ffd5ef'){
 const b=new T.Group();parent.add(b);ball(b,'#7e668f',0,0,0,.035,.035,.14);const wings=[];for(const s of [-1,1]){const wing=new T.Group();b.add(wing);const upper=ball(wing,color,s*.15,0,-.03,.2,.018,.16);const lower=ball(wing,color,s*.12,0,.12,.12,.02,.12);wings.push(wing);}b.userData.wings=wings;return b;
}

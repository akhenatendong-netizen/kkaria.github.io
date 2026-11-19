import {T,butterfly,flower,box,material} from '../primitives.js';
export function build(world,island){
 const group=new T.Group();island.group.add(group);const butterflies=[];
 for(let i=0;i<12;i++){const b=butterfly(group,['#ffd296','#e2b5f4','#fff0a5','#f4a2bd'][i%4]);butterflies.push(b);}
 const flowers=[];for(let i=0;i<7;i++)flowers.push(flower(group,-2.4+Math.sin(i)*.5,.5+i*.38,i%2?'#f6c4dc':'#ffe2a3',.5));
 let awakened=0,open=0,targetOpen=0;const doors=[];
 for(const side of [-1,1]){const pivot=new T.Group();pivot.position.set(side*.49,1.1,1.55);group.add(pivot);const pane=box(pivot,new T.MeshPhysicalMaterial({color:'#e3fff1',transparent:true,opacity:.28,roughness:.12,side:T.DoubleSide}),-side*.23,.72,0,.46,1.42,.025);box(pivot,'#e4efca',-side*.46,.72,0,.045,1.5,.045);doors.push({pivot,side});}
 const actions=[{id:'butterflies',label:'Wake the butterflies',point:new T.Vector3(-2.6,2.1,1.6),run:()=>{awakened=1;world.discover(island,'butterflies');}},{id:'doors',label:'Open the doors',point:new T.Vector3(.1,2.2,1.75),run:()=>{targetOpen=targetOpen?0:1;actions[1].label=targetOpen?'Close the doors':'Open the doors';if(world.reduced)doors.forEach(d=>d.pivot.rotation.y=d.side*targetOpen*1.4);}}];
 island.landmark.userData.action=actions[0].run;
 return {group,actions,update(t,dt){awakened=Math.max(0,awakened-dt*.035);open=T.MathUtils.damp(open,targetOpen,3,dt);doors.forEach(d=>d.pivot.rotation.y=d.side*open*1.4);butterflies.forEach((b,i)=>{const a=t*(.25+awakened*.4)+i*2.399,r=1.8+(i%3)*.55+awakened*.6;b.position.set(Math.cos(a)*r,2+Math.sin(t*1.2+i)*.3+(i%4)*.2+awakened*.9,Math.sin(a)*r);b.rotation.y=-a;for(let j=0;j<2;j++)b.userData.wings[j].rotation.z=Math.sin(t*14+i)*(j?1:-1)*.9;});flowers.forEach((f,i)=>f.rotation.z=Math.sin(t*1.3+i)*.04);}};
}

import {T,fern,flower,mushroom,ball} from '../primitives.js';
export function build(world,island){
 const group=new T.Group();island.group.add(group);const heroFern=fern(group,.8,1.7,1.15,'#62a879');heroFern.scale.set(1.15,.3,1.15);mushroom(group,-3,2.2,.6,'#d6a2c2');mushroom(group,-2.5,2.4,.4,'#f4c17f');const spores=[];
 for(let i=0;i<12;i++){const b=ball(group,'#eff7ba',0,0,0,.035);b.castShadow=false;spores.push(b);}
 let growth=0,target=0,wakeTime=0;
 const actions=[{id:'fern',label:'Unfurl the fern',point:new T.Vector3(.8,2.6,1.7),run:()=>{growth=0;target=1;wakeTime=performance.now();if(world.reduced)heroFern.scale.setScalar(1.15);world.discover(island,'fern');}},{id:'fossil',label:'Find a tiny fossil',point:new T.Vector3(.65,1.8,.3),run:()=>{world.burst(island.group.position.clone().add(new T.Vector3(.65,1.4,.3)),0xf4ddb1,24);world.events.message?.('A spiral, hiding in plain sight.');}}];
 heroFern.userData.action=actions[0].run;island.landmark.userData.action=actions[1].run;
 return{group,actions,update(t,dt){growth=T.MathUtils.damp(growth,target,1.6,dt);heroFern.scale.set(1.15,.3+growth*.85,1.15);heroFern.children.forEach((f,i)=>f.rotation.z=Math.sin(t*.9+i)*.025);spores.forEach((b,i)=>b.position.set(.8+Math.sin(t*.18+i*2.4)*2,1.4+(t*.15+i*.23)%2.8,1.1+Math.cos(t*.2+i)*1.5));}};
}

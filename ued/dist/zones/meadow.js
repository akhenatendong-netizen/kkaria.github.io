import {T,flower,butterfly} from '../primitives.js';
export function build(world,island){
 const group=new T.Group();island.group.add(group);const flowers=[];for(let i=0;i<22;i++){const a=i*2.399,r=.8+(i%6)*.43,f=flower(group,Math.cos(a)*r,Math.sin(a)*r,['#ffc57a','#e6a9d4','#aeb8ef','#fff0be'][i%4],.6+(i%4)*.14);f.userData.blossom.scale.setScalar(.23);flowers.push(f);}
 const bees=[];for(let i=0;i<4;i++){const b=butterfly(group,'#fff0ad');b.scale.setScalar(.65);bees.push(b);}
 let bloom=0,bloomStart=-100;
 const actions=[{id:'bloom',label:'Let it bloom',point:new T.Vector3(0,2.5,1.6),run:()=>{bloomStart=performance.now()/1000;bloom=1;if(world.reduced)flowers.forEach(f=>f.userData.blossom.scale.setScalar(1.15));world.discover(island,'bloom');}},{id:'breeze',label:'A little breeze',point:new T.Vector3(-2,2.3,-1.2),run:()=>{bloomStart=performance.now()/1000;world.burst(island.group.position.clone().add(new T.Vector3(-.5,2.5,0)),0xffcedc,35);}}];
 flowers.forEach(f=>f.userData.action=actions[0].run);
 return {group,actions,update(t,dt){flowers.forEach((f,i)=>{const progress=bloom?T.MathUtils.clamp((t-bloomStart-i*.06)*1.8,0,1):0;const scale=.23+progress*.92;f.userData.blossom.scale.setScalar(scale);f.rotation.z=Math.sin(t*1.6+i*.8)*.08;f.rotation.x=Math.sin(t*1.1+i)*.035;});bees.forEach((b,i)=>{const a=t*.4+i*2;b.position.set(Math.cos(a)*2,2+Math.sin(t+i)*.25,Math.sin(a)*2);b.rotation.y=-a;b.userData.wings.forEach((w,j)=>w.rotation.z=Math.sin(t*25)*(j?1:-1));});}};
}

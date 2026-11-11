import {T,ball,tube,flower} from '../primitives.js';
export function build(world,island){
 const group=new T.Group();island.group.add(group);const duck=new T.Group();group.add(duck);ball(duck,'#fff7dd',0,.14,0,.35,.25,.5);ball(duck,'#fff7dd',0,.48,.28,.24);ball(duck,'#efb35f',0,.42,.51,.16,.07,.16);for(const s of [-1,1])ball(duck,'#394a47',s*.12,.52,.46,.024);ball(duck,'#ead9bc',.28,.2,-.04,.08,.13,.25);ball(duck,'#ead9bc',-.28,.2,-.04,.08,.13,.25);
 const fish=[];for(let i=0;i<3;i++){const g=new T.Group();group.add(g);ball(g,i%2?'#f5b88b':'#e6dba6',0,0,0,.1,.045,.3);const tail=ball(g,'#efcfac',0,0,-.3,.12,.02,.1);fish.push(g);}
 let called=0,lastRipple=0;
 const actions=[{id:'ripple',label:'Make a ripple',point:new T.Vector3(-1.8,1.65,.3),run:()=>{const p=island.group.position.clone().add(new T.Vector3(-.65,1.16,.2));world.ripple(p);world.discover(island,'ripple');}},{id:'duck',label:'Say hello',point:new T.Vector3(1.1,1.9,1.1),run:()=>{called=1;world.ripple(island.group.position.clone().add(new T.Vector3(duck.position.x,1.17,duck.position.z)));world.events.message?.('A new little friend.');}}];
 duck.userData.action=actions[1].run;island.landmark.userData.action=actions[0].run;
 return{group,actions,update(t,dt){called=Math.max(0,called-dt*.1);const a=t*.22;duck.position.set(-.5+Math.sin(a)*1.2*(1-called*.4),1.18+Math.sin(t*2)*.025,Math.cos(a)*.85+called*.45);duck.rotation.y=a+Math.PI/2;fish.forEach((f,i)=>{const angle=t*(.3+i*.03)+i*2.1;f.position.set(-.5+Math.cos(angle)*1.8,1.145,Math.sin(angle)*1.15);f.rotation.y=-angle;});if(t-lastRipple>3){lastRipple=t;world.ripple(island.group.position.clone().add(new T.Vector3(duck.position.x,1.17,duck.position.z)));}}};
}

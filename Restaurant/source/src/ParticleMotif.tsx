import {useEffect,useRef} from 'react';
type Cell={q:number;r:number;x:number;y:number;cx:number;cy:number;angle:number;distance:number};
export default function ParticleMotif({choice}:{choice:number}){
 const ref=useRef<HTMLCanvasElement>(null),current=useRef(choice);current.current=choice;
 useEffect(()=>{const canvas=ref.current!,ctx=canvas.getContext('2d');if(!ctx)return;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;let visible=true,frame=0,prev=0,burst=0,last=current.current;const cells:Cell[]=[];const size=13;
  // A single contiguous axial honeycomb, with a narrow seam between cells.
  for(let q=-3;q<=3;q++)for(let r=-3;r<=3;r++){if(Math.abs(q+r)>3)continue;const x=Math.sqrt(3)*size*(q+r/2),y=1.5*size*r;cells.push({q,r,x,y,cx:x,cy:y,angle:0,distance:Math.hypot(x,y)});}
  const resize=()=>{const b=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio,2);canvas.width=Math.round(b.width*dpr);canvas.height=Math.round(b.height*dpr);};const ro=new ResizeObserver(resize);ro.observe(canvas);resize();
  const scatter=()=>{if(!reduced)burst=1;};const enter=()=>{scatter();};const leave=()=>{};const key=(e:KeyboardEvent)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();scatter();}};
  canvas.addEventListener('pointerenter',enter);canvas.addEventListener('pointerleave',leave);canvas.addEventListener('pointerdown',scatter);canvas.addEventListener('keydown',key);const io=new IntersectionObserver(([e])=>visible=e.isIntersecting);io.observe(canvas);
  const tick=(now:number)=>{frame=requestAnimationFrame(tick);const dt=Math.min((now-prev)/1000,.04);prev=now;if(!visible||document.hidden)return;if(last!==current.current){last=current.current;scatter();}burst=Math.max(0,burst-dt*.63);const spread=reduced?0:Math.sin(burst*Math.PI*.5);ctx.setTransform(canvas.width/300,0,0,canvas.height/178,0,0);ctx.clearRect(0,0,300,178);
   cells.forEach((cell,i)=>{const angle=Math.atan2(cell.y,cell.x);const amount=spread*(19+cell.distance*.4);const targetX=cell.x+Math.cos(angle)*amount,targetY=cell.y+Math.sin(angle)*amount*.45;const ease=reduced?1:1-Math.exp(-dt*(burst>.6?15:8));cell.cx+=(targetX-cell.cx)*ease;cell.cy+=(targetY-cell.cy)*ease;cell.angle+=(((i%2?1:-1)*spread*.25)-cell.angle)*ease;
    const band=current.current===0?cell.q:current.current===1?cell.r:-cell.q-cell.r;const red=Math.abs(band)<=1;ctx.fillStyle=red?'#ff3535':band<0?'#dadce1':'#9399a5';ctx.save();ctx.translate(150+cell.cx,89+cell.cy);ctx.rotate(cell.angle);const radius=(size-.8)*(1-spread*.1);ctx.beginPath();for(let j=0;j<6;j++){const a=Math.PI/3*j-Math.PI/6;const x=Math.cos(a)*radius,y=Math.sin(a)*radius;if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.closePath();ctx.fill();ctx.restore();
   });
  };frame=requestAnimationFrame(tick);return()=>{cancelAnimationFrame(frame);ro.disconnect();io.disconnect();canvas.removeEventListener('pointerenter',enter);canvas.removeEventListener('pointerleave',leave);canvas.removeEventListener('pointerdown',scatter);canvas.removeEventListener('keydown',key);};
 },[]);
 return <canvas className="particle-motif honeycomb-motif" ref={ref} tabIndex={0} role="img" aria-label="Connected red and gray hexagonal honeycomb. Hover, tap or press Enter to scatter and regroup the cells."/>;
}

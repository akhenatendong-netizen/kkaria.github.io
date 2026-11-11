import {useEffect,useRef,useState} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './berkeley-map.css';
const places=[
 {name:'Sharetea',address:'2328 Telegraph Ave, Berkeley',lat:37.868195844278,lng:-122.259141348521},
 {name:'Curry Pizza House',address:'2380 Telegraph Ave, Berkeley',lat:37.867275986244,lng:-122.258967318629},
 {name:'Chengdu Style',address:'2600 Bancroft Way, Berkeley',lat:37.868964725371,lng:-122.256861664439},
 {name:'Katsumi Sushi',address:'2523 Durant Ave, Berkeley',lat:37.867952045939,lng:-122.258449766895},
 {name:'Nash Café',address:'2047 University Ave, Berkeley',lat:37.872105216482,lng:-122.269657661771},
 {name:"Bear’s Ramen House",address:'2521 Durant Ave, Berkeley',lat:37.86794634867,lng:-122.258492196969},
 {name:'Wojia Hunan Cuisine',address:'917 San Pablo Ave, Albany',lat:37.889567971263,lng:-122.298628934911},
 {name:'Ben Ben Hot Pot',address:'1585 University Ave, Berkeley',lat:37.870764045029,lng:-122.280176429629}
];
export function BerkeleyMap(){
 const host=useRef<HTMLDivElement>(null),map=useRef<L.Map|null>(null),markers=useRef<L.Marker[]>([]);const [selected,setSelected]=useState<number|null>(null);
 const bounds=L.latLngBounds(places.map(p=>[p.lat,p.lng] as L.LatLngTuple));
 const campusBounds=L.latLngBounds([0,1,2,3,5].map(i=>[places[i].lat,places[i].lng] as L.LatLngTuple));
 useEffect(()=>{if(!host.current)return;const m=L.map(host.current,{scrollWheelZoom:false,zoomControl:false,attributionControl:true}).fitBounds(campusBounds,{padding:[55,55],maxZoom:18});map.current=m;
 L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(m);
 L.control.zoom({position:'topright'}).addTo(m);
 markers.current=places.map((p,i)=>{const pin=L.marker([p.lat,p.lng],{icon:L.divIcon({className:'bee-map-pin',html:`<span>${i+1}</span>`,iconSize:[28,28],iconAnchor:i===3?[0,36]:i===5?[29,-2]:[14,28]}),title:p.name,keyboard:true}).on('click',()=>setSelected(i));pin.bindPopup(`<strong>${p.name}</strong><br>${p.address}`);return pin.addTo(m)});
 const resize=new ResizeObserver(()=>m.invalidateSize());resize.observe(host.current);
 return()=>{resize.disconnect();m.remove();map.current=null};
 },[]);
 function choose(i:number){setSelected(i);map.current?.setView([places[i].lat,places[i].lng],18,{animate:false});markers.current[i]?.openPopup()}
 return <div className="berkeley-map"><div className="berkeley-map-stage"><div ref={host} className="berkeley-map-canvas" aria-label="Interactive map of eight partner restaurants in Berkeley and nearby Albany"/><button className="map-reset" onClick={()=>{setSelected(null);map.current?.closePopup();map.current?.fitBounds(bounds,{padding:[35,35],animate:false})}}>All locations ↗</button></div><div className="map-places">{places.map((p,i)=><button key={p.name} onClick={()=>choose(i)} aria-pressed={selected===i}><span>{String(i+1).padStart(2,'0')}</span>{p.name}</button>)}</div>{selected!==null&&<div className="map-place-detail"><div><strong>{places[selected].name}</strong><p>{places[selected].address}</p></div><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(places[selected].name+' '+places[selected].address)}`} target="_blank" rel="noreferrer">Directions ↗</a></div>}</div>
}

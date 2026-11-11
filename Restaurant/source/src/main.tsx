import React,{useState,useEffect,useRef,Suspense,lazy} from 'react';
import {createRoot} from 'react-dom/client';
import {MapPin,Heart,Ticket,UtensilsCrossed,Store,Check,Plus,Minus,Menu,X,SlidersHorizontal,ScanLine,Users,MousePointer2,ExternalLink,ArrowUpRight,ArrowRight} from 'lucide-react';
import './style.css';
import {StoryJourney} from './Universe';
import {ProductHero as PhoneHero} from './ProductChapters';
import './world.css';
import './refinement.css';
import './cinema.css';
import ContentSections from './ContentSections';
import './copy.css';
const CouponScene=lazy(()=>import('./CouponScene'));

type Role='consumer'|'merchant';

function App(){

 const [role,setRole]=useState<Role>(new URLSearchParams(location.search).get('view')==='merchants'?'merchant':'consumer');const merchant=role==='merchant';const [menu,setMenu]=useState(false);const [faq,setFaq]=useState<number|null>(0);const [modal,setModal]=useState<'explore'|'contact'|null>(null);const menuDialog=useRef<HTMLDialogElement>(null);const dialog=useRef<HTMLDialogElement>(null);
 function switchRole(r:Role){setRole(r);setFaq(0);setMenu(false);const u=new URL(location.href);u.searchParams.set('view',r==='merchant'?'merchants':'consumers');history.replaceState({},'',u);}
 useEffect(()=>{if(menu){menuDialog.current?.showModal();document.body.style.overflow='hidden';}else{menuDialog.current?.close();document.body.style.overflow='';}return()=>{document.body.style.overflow='';};},[menu]);
 useEffect(()=>{if(modal)dialog.current?.showModal();else dialog.current?.close();},[modal]);
 useEffect(()=>{const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');observer.unobserve(e.target);}});},{threshold:.12});document.querySelectorAll('.section-heading,.food-card,.merchant-card,.experience-copy,.story-copy,.faq').forEach(el=>{el.classList.add('reveal');observer.observe(el);});return()=>observer.disconnect();},[role]);
 return <><header className="header"><a className="wordmark" href="#world" aria-label="CrazyBee home"><img src="/assets/brand-logo.svg" alt="CrazyBee"/></a><a className="header-discover" href="#discover">Discover CrazyBee <ArrowUpRight size={14}/></a><button className="menu-trigger" aria-label="Open menu" aria-haspopup="dialog" aria-expanded={menu} onClick={()=>setMenu(true)}><span>Menu</span><span className="menu-lines"><i/><i/></span></button></header>
 <dialog className="site-menu" ref={menuDialog} aria-label="Site navigation" onCancel={()=>setMenu(false)}><div className="menu-top"><img src="/assets/brand-logo.svg" alt="CrazyBee"/><button aria-label="Close menu" onClick={()=>setMenu(false)}>Close <X size={19}/></button></div><div className="menu-body"><div className="menu-caption"><span>Eat well.<br/>Discover more.</span><p>Your next meal.<br/>Try something new.</p></div><nav aria-label="Main navigation">{[['01','Explore','world'],['02','Discover more','the-idea'],['03','For you & restaurants','discover'],['04','How it works','how'],['05','For restaurants','story']].map(([n,label,id],i)=><a style={{'--delay':`${i*65}ms`} as React.CSSProperties} key={id} href={'#'+id} onClick={()=>setMenu(false)}><small>{n}</small><span>{label}</span><ArrowUpRight/></a>)}</nav></div><div className="menu-footer"><a href="mailto:business@crazybee.life">business@crazybee.life <ArrowUpRight size={14}/></a><span>Starting in Berkeley. Discovering local favorites.</span></div></dialog>
 <main><PhoneHero merchant={merchant} onAction={()=>setModal(merchant?'contact':'explore')}/><StoryJourney merchant={merchant}/>
 <ContentSections immersive merchant={merchant} switchRole={switchRole} onAction={()=>setModal(merchant?'contact':'explore')}/>
 </main><nav className="chapter-nav" aria-label="Jump to a chapter"><a href="#world">Home</a><a href="#the-idea">Discover more</a><a href="#discover">For you & restaurants</a><a href="#how">How it works</a></nav><footer><a className="wordmark" href="#"><img src="/assets/brand-logo.svg" alt="CrazyBee"/></a><span className="footer-contact-note">Partnerships, investment, careers and other inquiries:</span><a href="mailto:business@crazybee.life">business@crazybee.life</a><small>© {new Date().getFullYear()} CrazyBee</small></footer>
 <dialog aria-label={modal==='contact'?'For restaurants':'Get the CrazyBee App'} ref={dialog} onCancel={()=>setModal(null)} onClick={e=>{if(e.target===dialog.current)setModal(null)}}><button className="dialog-close" aria-label="Close" onClick={()=>setModal(null)}><X/></button>{modal==='contact'?<><span className="eyebrow">For restaurants</span><h2>Partner with us</h2><p>Tell us your goal: reach new guests, introduce a new dish, or welcome familiar faces back.</p><a className="primary" href="mailto:business@crazybee.life?subject=CrazyBee%20Partnership">business@crazybee.life <ExternalLink size={16}/></a></>:<><span className="eyebrow">CRAZYBEE APP</span><h2>Your next meal. A new discovery.</h2><p>The app download link is coming soon. In the meantime, explore our campus group delivery in Berkeley.</p><a className="explore-option" href="https://order.crazybee.life/delivery" target="_blank" rel="noreferrer"><div><strong>Explore group delivery</strong><span>See the menu, ordering times and pickup details</span></div><ExternalLink size={18}/></a></>}</dialog>
 </>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);

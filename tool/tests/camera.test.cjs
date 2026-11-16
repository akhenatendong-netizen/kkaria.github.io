const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const jsQR = require('../web/vendor/jsQR.js');
const code = fs.readFileSync('web/camera.js','utf8');
function setup(media, frame = null) {
  const listeners={}, nodes={}, timers=new Map(); let n=0, rendered='';
  const node = id => nodes[id] ||= {hidden:false,disabled:false,textContent:'',value:'',open:true,className:'',classList:{toggle(){}},getTracks(){return[]},pause(){},async play(){},videoWidth:frame?640:0,videoHeight:frame?480:0,readyState:frame?2:0,addEventListener(type,fn){listeners[id+':'+type]=fn},close(){this.open=false;listeners[id+':close']?.()}};
  const context={drawImage(){},getImageData(){return frame}};
  const sandbox={console,Uint8ClampedArray,URL,Image:function(){},setTimeout(fn){timers.set(++n,fn);return n},clearTimeout(i){timers.delete(i)},document:{hidden:false,createElement(){return {getContext:()=>context,toBlob:fn=>fn(new Blob(['test'],{type:'image/jpeg'}))}},getElementById:node,addEventListener:(type,fn)=>listeners[type]=fn},navigator:{mediaDevices:{getUserMedia:media}},location:{hash:''},items:[{id:'bottle',name:'Plastic bottle'}],icon:()=>'',escapeHTML:s=>s.replaceAll('<','&lt;'),$:s=>node(s.replace('#','')),toast(){},render(){}};
  sandbox.window={isSecureContext:true,jsQR,addEventListener:(type,fn)=>listeners['window:'+type]=fn};
  sandbox.modal=html=>{sandbox.window.loopCamera?.stop();rendered=html};
  vm.createContext(sandbox);vm.runInContext(code,sandbox);
  return {api:sandbox.window.loopCamera,node,timers,listeners,get html(){return rendered},click(action){listeners.click({target:{closest:()=>({dataset:{camera:action}})}})}};
}
const settle=()=>new Promise(resolve=>setImmediate(resolve));
function stream(){const track={stops:0,stop(){this.stops++},getSettings(){return{facingMode:'environment'}},onended:null};return {track,getTracks:()=>[track],getVideoTracks:()=>[track]}}
(async()=>{
 const good=stream(), env=setup(async constraints=>{assert.equal(constraints.audio,false);return good});
 env.api.open('qr');env.click('start');await settle();assert.equal(env.node('camera-start').textContent,'Stop camera');assert.equal(env.node('camera-video').srcObject,good);assert.equal(env.timers.size,1);
 env.api.stop();assert.equal(good.track.stops,1);assert.equal(env.node('camera-video').srcObject,null);assert.equal(env.timers.size,0);
 let resolve;const late=stream(), pending=setup(()=>new Promise(r=>resolve=r));pending.api.open();pending.click('start');pending.api.stop();resolve(late);await settle();assert.equal(late.track.stops,1);assert.equal(pending.node('camera-video').srcObject,null);
 const denied=setup(async()=>{throw Object.assign(new Error(),{name:'NotAllowedError'})});denied.api.open();denied.click('start');await settle();assert.match(denied.node('camera-status').textContent,/permission was blocked/);assert.equal(denied.node('camera-start').disabled,false);
 for(const [value,expected] of [['recycling-loop:RIV-01','riverside'],['https://recycling-loop-prototype.lucas58.chatgpt.site/?point=riverside','riverside'],['https://evil.example/?point=riverside',null],['javascript:alert(1)',null],['https://recycling-loop-prototype.lucas58.chatgpt.site.evil.test/?point=riverside',null]]) assert.equal(env.api.pointFromQR(value),expected);
 const live=stream(), photo=setup(async()=>live,{data:new Uint8ClampedArray(4),width:1,height:1});photo.api.open('photo');photo.click('start');await settle();photo.click('capture');await settle();assert.match(photo.html,/Photo captured/);assert.match(photo.html,/Automatic image recognition is not connected/);assert.equal(live.track.stops,1);photo.listeners['dialog:close']();
 const size=Number(fs.readFileSync('tests/qr-frame-size.txt','utf8')),data=new Uint8ClampedArray(require('node:zlib').inflateSync(fs.readFileSync('tests/qr-frame.deflate')));
 const feed=stream(), scan=setup(async()=>feed,{data,width:size,height:size});scan.api.open('qr');scan.click('start');await settle();assert.match(scan.html,/Collection point found/);assert.equal(feed.track.stops,1);assert.equal(scan.timers.size,0);
 console.log('PASS: camera start/stop, no microphone, pending-permission cancellation, denied permission, QR allowlist, photo capture flow, QR-frame decode and stream cleanup. Hardware frames are mocked in this suite.');
})().catch(e=>{console.error(e);process.exit(1)});

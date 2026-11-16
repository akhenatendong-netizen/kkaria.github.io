/* Camera frames and photographs are processed locally. No network upload. */
(() => {
  const LIVE_URL = 'https://recycling-loop-prototype.lucas58.chatgpt.site';
  let stream = null, timer = null, serial = 0, mode = 'qr', facing = 'environment';
  let photoURL = null, photoBlob = null;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d', {willReadFrequently: true});
  const byId = id => document.getElementById(id);
  const cameraIcon = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7h4l2-3h6l2 3h4v13H3Z"/><circle cx="12" cy="13" r="4"/></svg>';
  const scanIcon = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H4a1 1 0 0 0-1 1v4m13-5h4a1 1 0 0 1 1 1v4M3 16v4a1 1 0 0 0 1 1h4m13-5v4a1 1 0 0 1-1 1h-4M7 12h10"/><path d="M8 7v2m4-2v2m4-2v2M8 15v2m4-2v2m4-2v2"/></svg>';
  const imageIcon = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 5-5 4 4 4-6 5 7"/></svg>';
  const lockIcon = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3"/></svg>';
  const qrIllustration = '<svg class="scan-illustration" viewBox="0 0 160 160" fill="none" aria-hidden="true"><rect x="20" y="20" width="120" height="120" rx="16" fill="white"/><g stroke="currentColor" stroke-width="4" stroke-linejoin="round"><rect x="38" y="38" width="26" height="26" rx="3"/><rect x="96" y="38" width="26" height="26" rx="3"/><rect x="38" y="96" width="26" height="26" rx="3"/></g><g fill="currentColor"><rect x="47" y="47" width="8" height="8" rx="1"/><rect x="105" y="47" width="8" height="8" rx="1"/><rect x="47" y="105" width="8" height="8" rx="1"/><path d="M76 38h8v18h-8zM76 65h8v12h-8zM38 76h25v8H38zM96 74h8v14h-8zM114 75h8v9h-8zM76 96h8v26h-8zM96 96h16v8H96zM114 104h8v18h-8zM96 114h8v8h-8z"/></g><path d="M14 80h132" stroke="#85b6a0" stroke-width="2" stroke-linecap="round"/></svg>';

  function stop() {
    serial++;
    clearTimeout(timer);
    timer = null;
    if (stream) stream.getTracks().forEach(track => { track.onended = null; track.stop(); });
    stream = null;
    const video = byId('camera-video');
    if (video) { video.pause(); video.srcObject = null; }
  }
  function releasePhoto() {
    if (photoURL) URL.revokeObjectURL(photoURL);
    photoURL = null; photoBlob = null;
  }
  function status(text, kind = '') {
    const el = byId('camera-status');
    if (el) { el.textContent = text; el.className = 'camera-status ' + kind; }
  }
  function controls(live, pending = false) {
    const start = byId('camera-start');
    if (!start) return;
    start.disabled = pending;
    start.textContent = pending ? 'Opening camera…' : live ? 'Stop camera' : 'Enable camera';
    start.classList.toggle('secondary', live && mode === 'photo');
    byId('camera-capture').disabled = !live;
    byId('camera-capture').hidden = !live || mode !== 'photo';
    byId('camera-switch').disabled = !live;
    byId('camera-switch').hidden = !live;
    byId('camera-placeholder').hidden = live;
    byId('camera-video').hidden = !live;
    byId('camera-guide').hidden = !live || mode !== 'qr';
    byId('camera-live').hidden = !live;
  }
  function open(selectedMode = 'qr') {
    releasePhoto();
    mode = selectedMode;
    modal(`<section class="camera-dialog" data-mode="${mode}">
      <div class="camera-tabs" role="group" aria-label="Camera mode"><button class="chip ${mode==='qr'?'active':''}" data-camera="qr" aria-pressed="${mode==='qr'}">${scanIcon}Scan QR</button><button class="chip ${mode==='photo'?'active':''}" data-camera="photo" aria-pressed="${mode==='photo'}">${cameraIcon}Take a photo</button></div>
      <div class="camera-layout">
        <div class="camera-window">
          <video id="camera-video" autoplay muted playsinline hidden aria-label="Live camera preview"></video>
          <div id="camera-placeholder"><div class="camera-frame"><i></i><i></i><i></i><i></i>${mode==='qr'?qrIllustration:cameraIcon}</div><span class="camera-off"><b></b>Camera off</span></div>
          <div id="camera-guide" hidden></div><span id="camera-live" hidden><b></b>Camera on</span>
          <button id="camera-switch" class="camera-flip" data-camera="switch" hidden disabled aria-label="Switch front or rear camera">${icon('loop')}</button>
        </div>
        <div class="camera-actions">
          <h2>${mode==='qr'?'Scan a collection point.':'Start with a photo.'}</h2>
          <p class="camera-intro">${mode==='qr'?'Scan the code on your recycling point.':'Photograph your item, then choose its type.'}</p>
          <div class="camera-controls"><button id="camera-capture" class="btn full" data-camera="capture" hidden disabled>${cameraIcon}Take photo</button><button id="camera-start" class="btn full" data-camera="start">Enable camera</button></div>
          <button class="upload-button" data-camera="choose-file">${imageIcon}${mode==='qr'?'Upload QR image':'Choose a photo'}</button>
          <input id="camera-file" type="file" accept="image/*" ${mode==='photo'?'capture="environment"':''} hidden>
          <p id="camera-status" class="camera-status" role="status" aria-live="polite"></p>
          <details class="camera-help"><summary>Camera not working?</summary><p>Allow camera access in your browser’s site settings, or choose an image instead. Live camera access requires HTTPS or localhost in a supported browser.</p></details>
        </div>
      </div>
      <div class="camera-footer"><span>${lockIcon}Photos stay on your device.</span>${mode==='qr'?'<button class="text-link" data-camera="sample">Try a test QR '+icon('arrow')+'</button>':''}</div>
    </section>`);
  }
  async function start() {
    stop();
    const token = serial;
    controls(false, true);
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      controls(false);
      status('Live camera needs HTTPS or localhost in a supported browser. Open the online version, or choose a photo below.', 'error');
      return;
    }
    status('Waiting for camera permission…');
    try {
      const next = await navigator.mediaDevices.getUserMedia({audio:false, video:{facingMode:{ideal:facing},width:{ideal:1280},height:{ideal:960}}});
      if (token !== serial || !byId('camera-video') || !$('#dialog').open) { next.getTracks().forEach(t=>t.stop()); return; }
      stream = next;
      const video = byId('camera-video');
      video.srcObject = stream;
      video.hidden = false;
      video.muted = true;
      await video.play();
      if (token !== serial) { next.getTracks().forEach(t=>t.stop()); return; }
      controls(true);
      const actualFacing = next.getVideoTracks()[0]?.getSettings().facingMode;
      status(mode==='qr'?'Hold the QR code steady inside the frame.':'Ready. Position your item and tap Take photo.');
      video.classList.toggle('mirrored', actualFacing === 'user');
      next.getVideoTracks().forEach(track=>{track.onended=()=>{if(token===serial){stop();controls(false);status('Camera disconnected. Reconnect it and try again.','error')}}});
      if (mode === 'qr') scanFrame(token);
    } catch (error) {
      if (token !== serial) return;
      stop(); controls(false);
      const messages = {
        NotAllowedError:'Camera permission was blocked. Allow camera access in your browser’s site settings, then try again. You can also choose an image below.',
        NotFoundError:'No camera was found. Connect a camera or choose an image below.',
        NotReadableError:'The camera is busy or unavailable. Close other camera apps and try again, or choose an image.',
        OverconstrainedError:'This camera could not start with these settings. Try another camera or choose an image.',
        SecurityError:'Your browser has disabled camera access here. Open the online version directly in Safari or Chrome.'
      };
      status(messages[error.name] || 'The camera could not start. Retry, open the online version in your browser, or choose an image.', 'error');
    }
  }
  function pixels(source, width, height, maxSize) {
    if (!width || !height) throw new Error('No image dimensions');
    const ratio = Math.min(1,maxSize / Math.max(width,height));
    canvas.width = Math.max(1,Math.round(width*ratio));
    canvas.height = Math.max(1,Math.round(height*ratio));
    context.drawImage(source,0,0,canvas.width,canvas.height);
    return context.getImageData(0,0,canvas.width,canvas.height);
  }
  function decode(data) {
    if (typeof window.jsQR !== 'function') throw new Error('QR reader unavailable');
    return window.jsQR(data.data,data.width,data.height,{inversionAttempts:'attemptBoth'});
  }
  function scanFrame(token) {
    if (token !== serial || !stream) return;
    const video = byId('camera-video');
    try {
      if (video?.readyState >= 2 && video.videoWidth) {
        const result = decode(pixels(video,video.videoWidth,video.videoHeight,800));
        if (result?.data) { showQR(result.data); return; }
      }
    } catch (_) {
      stop(); controls(false); status('The QR reader could not process this frame. Please retry or choose a QR image.', 'error'); return;
    }
    timer = setTimeout(()=>scanFrame(token),180);
  }
  function pointFromQR(value) {
    if (value.trim().toLowerCase()==='recycling-loop:riv-01') return 'riverside';
    try {
      const url = new URL(value);
      const knownHost = url.origin===LIVE_URL || (['localhost','127.0.0.1'].includes(url.hostname) && ['http:','https:'].includes(url.protocol));
      if (knownHost && url.searchParams.get('point')==='riverside') return 'riverside';
    } catch (_) {}
    return null;
  }
  function showQR(value) {
    stop();
    const point = pointFromQR(value);
    modal(`<div class="modal-icon">${icon(point?'check':'scan')}</div><h2>${point?'Collection point found.':'QR code read.'}</h2>
      ${point?'<span class="tag">RIV-01 · Demo collection point</span><h3 style="margin-top:18px">Riverside Community Hub</h3><p>The code was genuinely decoded. Collection rules and results remain demonstration data.</p>':'<p>This QR code is not a registered collection point in this prototype. Its contents are shown below; no external link has been opened.</p>'}
      ${point?'':`<div class="qr-value">${escapeHTML(value.slice(0,2000))}</div>`}
      ${point?'<button class="btn full" data-camera="open-point">Open collection point '+icon('arrow')+'</button>':''}
      <button class="btn secondary full" data-camera="qr">Scan another QR</button>`);
  }
  async function takePhoto() {
    const video = byId('camera-video');
    if (!stream || !video?.videoWidth || video.readyState<2) { status('Wait for the camera preview, then try again.','error'); return; }
    const token = serial;
    byId('camera-capture').disabled = true;
    try {
      pixels(video,video.videoWidth,video.videoHeight,1600);
      const blob = await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.9));
      if (token !== serial) return;
      if (!blob) throw new Error('Photo capture failed');
      reviewPhoto(blob);
    } catch (_) { if(token===serial){byId('camera-capture').disabled=false;status('Photo capture failed. Please try again.','error');} }
  }
  function reviewPhoto(blob) {
    stop(); releasePhoto();
    photoBlob = blob; photoURL = URL.createObjectURL(blob);
    modal(`<span class="eyebrow">Photo captured · camera off</span><h2>Is this your item?</h2><img class="photo-review" src="${photoURL}" alt="Your captured or selected item photo">
      <div class="row spread"><button class="text-link" data-camera="photo">${icon('back')}Retake</button><button class="text-link" data-camera="download-photo">Download photo ${icon('file')}</button></div>
      <label for="photo-item">Choose the item in your photo</label><select id="photo-item" class="select"><option value="">Select an item type</option>${items.map(i=>`<option value="${i.id}">${i.name}</option>`).join('')}<option value="unknown">Not sure / something else</option></select>
      <p>Item type is confirmed by you. Automatic image recognition is not connected.</p><button id="photo-continue" class="btn full" data-camera="continue-photo" disabled>Check recycling guidance ${icon('arrow')}</button>`);
  }
  async function readFile(file) {
    if (!file) return;
    stop(); controls(false);
    const token = serial;
    if (!file.type.startsWith('image/')) { status('Choose an image file, such as JPG, PNG or WebP.','error'); return; }
    if (file.size > 20*1024*1024) { status('This image is too large. Choose one smaller than 20 MB.','error'); return; }
    status(mode==='qr'?'Reading the QR image…':'Opening your photo…');
    const url = URL.createObjectURL(file);
    try {
      const image = new Image();
      await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;image.src=url});
      if (token!==serial) return;
      if (mode==='qr') {
        let result = null;
        for (const size of [1400,800]) { result=decode(pixels(image,image.naturalWidth,image.naturalHeight,size)); if(result?.data)break; }
        if (result?.data) showQR(result.data);
        else status('No readable QR code found. Try a closer, sharper image of the whole code, including its white border.','error');
      } else {
        pixels(image,image.naturalWidth,image.naturalHeight,1600);
        const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.9));
        if(token!==serial)return;
        if(!blob)throw new Error('Photo could not be converted');
        reviewPhoto(blob);
      }
    } catch (_) { if(token===serial)status('This image could not be read. Try JPG, PNG or WebP instead.','error'); }
    finally { URL.revokeObjectURL(url); }
  }
  function sample() {
    stop(); releasePhoto();
    modal(`<span class="eyebrow">Printable collection-point QR</span><h2>Try a real scan.</h2><p>Display this code on another screen, or print it. Scan it using Scan QR.</p><img class="test-qr" src="sample-riverside.svg" alt="QR code for Riverside demo collection point"><p class="tiny muted">This QR contains the online Riverside demo link.</p><a class="btn full" href="sample-riverside.svg" download="Riverside-Test-QR.svg">Download test QR ${icon('file')}</a><button class="btn secondary full" data-camera="qr">Back to scanner</button>`);
  }
  document.addEventListener('click', e=>{
    const button=e.target.closest('[data-camera]');
    if(!button)return;
    const action=button.dataset.camera;
    if(action==='qr'||action==='photo')open(action);
    if(action==='start'){if(stream){stop();controls(false);status('Camera stopped. Tap Enable camera to resume.')}else start();}
    if(action==='switch'){facing=facing==='environment'?'user':'environment';start();}
    if(action==='capture')takePhoto();
    if(action==='choose-file')byId('camera-file').click();
    if(action==='sample')sample();
    if(action==='open-point'){$('#dialog').close();query='';filter='All';location.hash='sort';render();toast('Riverside selected — choose your item');}
    if(action==='download-photo'&&photoBlob){const a=document.createElement('a');a.href=photoURL;a.download='recycling-item.jpg';a.click();}
    if(action==='continue-photo'){
      const selected=byId('photo-item').value;
      if(!selected)return;
      $('#dialog').close();
      if(selected==='unknown'){query='';filter='All';location.hash='sort';render();showItemHelp();}
      else {location.hash='item/'+selected;toast('Item type confirmed by you');}
    }
  });
  document.addEventListener('change',e=>{
    if(e.target.id==='camera-file'){const file=e.target.files[0];e.target.value='';readFile(file);}
    if(e.target.id==='photo-item')byId('photo-continue').disabled=!e.target.value;
  });
  $('#dialog').addEventListener('close',()=>{stop();releasePhoto()});
  $('#dialog').addEventListener('cancel',()=>{stop();releasePhoto()});
  window.addEventListener('pagehide',()=>{stop();releasePhoto()});
  window.addEventListener('hashchange',()=>{stop();releasePhoto();if(byId('camera-video')&&$('#dialog').open)$('#dialog').close()});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&byId('camera-video')){stop();controls(false);status('Camera paused while you were away. Tap Enable camera to resume.')}});
  window.loopCamera={open,stop,pointFromQR};
})();

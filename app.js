// Application entry point for hand gesture control of Luma Labs iframe.
// Hand gesture control is provided via MediaPipe Hands to control the iframe view.

// Get the iframe element
let lumaIframe;
let gestureButton;
let gestureStatus;

// Variables for hand gesture control
let currentRotationX = 0;
let currentRotationY = 0;
const maxRotation = 15; // Maximum rotation in degrees

// Gesture control via MediaPipe Hands
let isGestureActive = false;
let hands = null;
let camera = null;
let videoElement = null;

function setupGestureControl() {
  console.log('Setting up gesture control...');
  
  if (!gestureButton) {
    console.error('Gesture button not found in setupGestureControl');
    return;
  }
  
  // Remove any existing listeners by cloning the button
  const newButton = gestureButton.cloneNode(true);
  gestureButton.parentNode.replaceChild(newButton, gestureButton);
  gestureButton = newButton;
  
  gestureButton.addEventListener('click', async () => {
    console.log('Gesture button clicked!', { isGestureActive });
    if (isGestureActive) {
      // Disable gesture control
      isGestureActive = false;
      gestureButton.textContent = 'Enable Hand Control';
      
      if (camera) {
        camera.stop();
        camera = null;
      }
      
      if (videoElement) {
        const tracks = videoElement.srcObject ? videoElement.srcObject.getTracks() : [];
        tracks.forEach((t) => t.stop());
        if (videoElement.parentNode) {
          videoElement.remove();
        }
        videoElement = null;
      }
      
      hands = null;
      
      // Reset iframe transform
      if (lumaIframe) {
        lumaIframe.style.transform = '';
        currentRotationX = 0;
        currentRotationY = 0;
      }
      
      // Hide status indicator
      if (gestureStatus) {
        gestureStatus.style.display = 'none';
      }
    } else {
      // Enable gesture control
      gestureButton.textContent = 'Loading…';
      try {
        // Check if MediaPipe is loaded
        if (typeof Hands === 'undefined' || typeof Camera === 'undefined') {
          throw new Error('MediaPipe 库未加载，请刷新页面重试');
        }
        
        // Initialize MediaPipe Hands
        hands = new Hands({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469404/${file}`;
          }
        });
        
        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });
        
        // Set up the callback for hand detection
        hands.onResults(onHandResults);
        
        // Create video element
        videoElement = document.createElement('video');
        videoElement.style.display = 'none';
        videoElement.playsInline = true;
        document.body.appendChild(videoElement);
        
        // Initialize camera
        camera = new Camera(videoElement, {
          onFrame: async () => {
            if (hands && videoElement) {
              await hands.send({ image: videoElement });
            }
          },
          width: 640,
          height: 480
        });
        
        await camera.start();
        
        isGestureActive = true;
        gestureButton.textContent = 'Disable Hand Control';
        
        // Show status indicator
        if (gestureStatus) {
          gestureStatus.style.display = 'block';
          gestureStatus.textContent = '等待检测手部...';
        }
        
        console.log('Hand tracking started with MediaPipe Hands');
      } catch (err) {
        console.error('Gesture control failed:', err);
        alert('无法启动手部识别：' + err.message + '\n\n请确保：\n1. 允许摄像头权限\n2. 使用 HTTPS 或 localhost\n3. 浏览器支持 WebRTC');
        gestureButton.textContent = 'Enable Hand Control';
      }
    }
  });
}

function onHandResults(results) {
  if (!isGestureActive || !lumaIframe) return;
  
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    // Get the first hand's landmarks
    const landmarks = results.multiHandLandmarks[0];
    
    // Use the wrist (landmark 0) for position tracking
    // MediaPipe provides normalized coordinates (0-1)
    const wrist = landmarks[0];
    
    // Normalize coordinates (already normalized by MediaPipe)
    const normX = wrist.x;
    const normY = wrist.y;
    
    // Map hand position to rotation angles (smooth interpolation)
    const targetRotationY = (normX - 0.5) * maxRotation * 2; // Left/Right
    const targetRotationX = (0.5 - normY) * maxRotation * 2; // Up/Down
    
    // Smooth interpolation for natural movement
    currentRotationY += (targetRotationY - currentRotationY) * 0.1;
    currentRotationX += (targetRotationX - currentRotationX) * 0.1;
    
    // Apply rotation to iframe using CSS transform
    lumaIframe.style.transform = `perspective(1000px) rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg)`;
    lumaIframe.style.transition = 'transform 0.1s ease-out';
    
    // Update status indicator
    if (gestureStatus) {
      gestureStatus.textContent = '✓ 手部已检测';
      gestureStatus.style.background = 'rgba(0, 255, 0, 0.3)';
      gestureStatus.style.borderColor = '#00ff00';
    }
    
    // Try to send message to iframe for internal camera control (if supported)
    try {
      lumaIframe.contentWindow.postMessage({
        type: 'handControl',
        rotationX: currentRotationX,
        rotationY: currentRotationY
      }, '*');
    } catch (e) {
      // Cross-origin restrictions may prevent this, that's okay
    }
  } else {
    // No hand detected, smoothly return to center
    currentRotationY *= 0.95;
    currentRotationX *= 0.95;
    lumaIframe.style.transform = `perspective(1000px) rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg)`;
    
    // Update status indicator
    if (gestureStatus) {
      gestureStatus.textContent = '等待检测手部...';
      gestureStatus.style.background = 'rgba(255, 255, 0, 0.3)';
      gestureStatus.style.borderColor = '#ffff00';
    }
  }
}

// Wait for MediaPipe to be ready
function waitForMediaPipe() {
  return new Promise((resolve) => {
    if (typeof Hands !== 'undefined' && typeof Camera !== 'undefined') {
      resolve();
    } else {
      const checkInterval = setInterval(() => {
        if (typeof Hands !== 'undefined' && typeof Camera !== 'undefined') {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
      // Timeout after 15 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        console.error('MediaPipe libraries failed to load');
        resolve(); // Resolve anyway to prevent hanging
      }, 15000);
    }
  });
}

// Initialize the application
async function init() {
  console.log('Initializing app...');
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    console.log('Waiting for DOM...');
    await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
  }
  
  console.log('DOM ready, setting up button...');
  
  // Setup button immediately (even if MediaPipe isn't loaded yet)
  lumaIframe = document.getElementById('luma-embed');
  gestureButton = document.getElementById('gesture-toggle');
  gestureStatus = document.getElementById('gesture-status');
  
  if (!gestureButton) {
    console.error('Gesture button not found!');
    return;
  }
  
  // Wait for MediaPipe to load
  console.log('Waiting for MediaPipe...');
  await waitForMediaPipe();
  
  console.log('MediaPipe check:', { Hands: typeof Hands, Camera: typeof Camera });
  
  if (typeof Hands === 'undefined' || typeof Camera === 'undefined') {
    console.error('MediaPipe libraries are not available');
    gestureButton.textContent = 'MediaPipe 未加载 - 点击查看详情';
    gestureButton.style.background = 'rgba(255, 0, 0, 0.5)';
    
    // Setup a basic handler to show it works
    gestureButton.onclick = () => {
      alert('MediaPipe 库未加载。\n\n可能的原因：\n1. 网络连接问题\n2. CDN 链接失效\n3. 浏览器兼容性问题\n\n请：\n1. 检查控制台错误信息\n2. 刷新页面重试\n3. 检查网络连接');
      console.log('MediaPipe status:', { Hands: typeof Hands, Camera: typeof Camera });
    };
    return;
  }
  
  // Setup gesture control
  setupGestureControl();
  
  console.log('Hand gesture control ready with MediaPipe Hands. Click "Enable Hand Control" to start.');
}

// Start initialization
init().catch(err => {
  console.error('Initialization error:', err);
});

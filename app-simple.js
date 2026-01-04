// Simplified hand tracking using WebRTC and basic hand position detection
// This version doesn't require external libraries and works with file:// protocol

// Get the iframe element
let lumaIframe;
let gestureButton;
let gestureStatus;

// Variables for hand gesture control
let currentRotationX = 0;
let currentRotationY = 0;
const maxRotation = 15; // Maximum rotation in degrees

// Gesture control
let isGestureActive = false;
let videoElement = null;
let stream = null;
let animationFrameId = null;

// Simple hand detection using canvas and basic image processing
let canvas = null;
let ctx = null;

function setupGestureControl() {
  console.log('Setting up gesture control...');
  
  lumaIframe = document.getElementById('luma-embed');
  gestureButton = document.getElementById('gesture-toggle');
  gestureStatus = document.getElementById('gesture-status');
  
  if (!gestureButton) {
    console.error('Gesture button not found');
    return;
  }
  
  gestureButton.addEventListener('click', async () => {
    console.log('Button clicked!', { isGestureActive });
    
    if (isGestureActive) {
      // Disable gesture control
      isGestureActive = false;
      gestureButton.textContent = 'Enable Hand Control';
      
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
      }
      
      if (videoElement) {
        if (videoElement.parentNode) {
          videoElement.remove();
        }
        videoElement = null;
      }
      
      if (canvas) {
        if (canvas.parentNode) {
          canvas.remove();
        }
        canvas = null;
        ctx = null;
      }
      
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
        // Request webcam access
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: 640, 
            height: 480,
            facingMode: 'user'
          } 
        });
        
        // Create video element
        videoElement = document.createElement('video');
        videoElement.style.display = 'none';
        videoElement.playsInline = true;
        videoElement.autoplay = true;
        videoElement.srcObject = stream;
        document.body.appendChild(videoElement);
        
        await videoElement.play();
        
        // Create canvas for processing
        canvas = document.createElement('canvas');
        canvas.style.display = 'none';
        canvas.width = 640;
        canvas.height = 480;
        ctx = canvas.getContext('2d');
        document.body.appendChild(canvas);
        
        isGestureActive = true;
        gestureButton.textContent = 'Disable Hand Control';
        
        // Show status indicator
        if (gestureStatus) {
          gestureStatus.style.display = 'block';
          gestureStatus.textContent = '等待检测手部...';
        }
        
        console.log('Hand tracking started');
        
        // Start detection loop
        detectHandPosition();
      } catch (err) {
        console.error('Gesture control failed:', err);
        alert('无法启动摄像头：' + err.message + '\n\n请确保：\n1. 允许摄像头权限\n2. 使用 HTTPS 或 localhost\n3. 浏览器支持 WebRTC');
        gestureButton.textContent = 'Enable Hand Control';
      }
    }
  });
}

function detectHandPosition() {
  if (!isGestureActive || !videoElement || !canvas || !ctx) {
    return;
  }
  
  try {
    // Draw video frame to canvas
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Simple skin color detection (detect hand-like colors)
    // This is a basic approach - in production, use a proper ML model
    let handPixels = 0;
    let sumX = 0;
    let sumY = 0;
    
    // Sample every 10th pixel for performance
    for (let i = 0; i < data.length; i += 40) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Simple skin color detection (adjust thresholds as needed)
      if (r > 95 && g > 40 && b > 20 && 
          r > g && r > b && 
          Math.max(r, g, b) - Math.min(r, g, b) > 15) {
        const pixelIndex = i / 4;
        const x = pixelIndex % canvas.width;
        const y = Math.floor(pixelIndex / canvas.width);
        sumX += x;
        sumY += y;
        handPixels++;
      }
    }
    
    if (handPixels > 100) {
      // Calculate center of detected hand region
      const centerX = sumX / handPixels;
      const centerY = sumY / handPixels;
      
      // Normalize coordinates
      const normX = centerX / canvas.width;
      const normY = centerY / canvas.height;
      
      // Map hand position to rotation angles (smooth interpolation)
      const targetRotationY = (normX - 0.5) * maxRotation * 2; // Left/Right
      const targetRotationX = (0.5 - normY) * maxRotation * 2; // Up/Down
      
      // Smooth interpolation for natural movement
      currentRotationY += (targetRotationY - currentRotationY) * 0.1;
      currentRotationX += (targetRotationX - currentRotationX) * 0.1;
      
      // Apply rotation to iframe using CSS transform
      if (lumaIframe) {
        lumaIframe.style.transform = `perspective(1000px) rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg)`;
        lumaIframe.style.transition = 'transform 0.1s ease-out';
      }
      
      // Update status indicator
      if (gestureStatus) {
        gestureStatus.textContent = '✓ 手部已检测';
        gestureStatus.style.background = 'rgba(0, 255, 0, 0.3)';
        gestureStatus.style.borderColor = '#00ff00';
      }
    } else {
      // No hand detected, smoothly return to center
      currentRotationY *= 0.95;
      currentRotationX *= 0.95;
      if (lumaIframe) {
        lumaIframe.style.transform = `perspective(1000px) rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg)`;
      }
      
      // Update status indicator
      if (gestureStatus) {
        gestureStatus.textContent = '等待检测手部...';
        gestureStatus.style.background = 'rgba(255, 255, 0, 0.3)';
        gestureStatus.style.borderColor = '#ffff00';
      }
    }
  } catch (err) {
    console.error('Error in hand detection:', err);
  }
  
  // Continue detection loop
  animationFrameId = requestAnimationFrame(detectHandPosition);
}

// Initialize the application
async function init() {
  console.log('Initializing app...');
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    console.log('Waiting for DOM...');
    await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
  }
  
  console.log('DOM ready, setting up gesture control...');
  
  // Setup gesture control
  setupGestureControl();
  
  console.log('Hand gesture control ready. Click "Enable Hand Control" to start.');
}

// Start initialization
init().catch(err => {
  console.error('Initialization error:', err);
});


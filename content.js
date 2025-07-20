console.log("✅ YouTube Shorts Autoscroll script loaded");

let lastUrl = location.href;
let scrolling = false;
let currentVideo = null;
let pollInterval = null;
let hasReloaded = false;

function clickNext() {
  const nextBtn = document.querySelector('button[aria-label="Next video"]');
  if (nextBtn) {
    console.log("⏭️ Clicking next button");
    nextBtn.click();
  } else {
    console.log("❌ Next button not found");
  }
}

function onVideoEnded() {
  console.log("⏭️ Video ended — moving to next Short");
  if (scrolling) {
    clickNext();
  }
}

function checkVideoEnd() {
  if (!currentVideo || !scrolling) return;
  
  // Check if video is near the end (within 1 second instead of 0.5)
  if (currentVideo.currentTime >= currentVideo.duration - 1.0) {
    console.log("⏭️ Video near end (polling) — moving to next Short");
    clickNext();
  }
}

function attachVideoListener() {
  const video = document.querySelector('video');
  if (!video) {
    console.log("❌ No video element found");
    return;
  }
  
  if (currentVideo === video) {
    console.log("ℹ️ Same video element, skipping");
    return;
  }
  
  console.log("✅ Attaching listener to video element");
  currentVideo = video;
  video.addEventListener('ended', onVideoEnded);
  
  // Start polling as fallback
  if (pollInterval) clearInterval(pollInterval);
  pollInterval = setInterval(checkVideoEnd, 200);
  
  console.log("📹 Video duration:", video.duration);
  console.log("📹 Video current time:", video.currentTime);
}

function detachVideoListener() {
  if (currentVideo) {
    console.log("🔌 Removing video listener");
    currentVideo.removeEventListener('ended', onVideoEnded);
    currentVideo = null;
  }
  
  if (pollInterval) {
    console.log("🔌 Stopping poll interval");
    clearInterval(pollInterval);
    pollInterval = null;
  }
}

function injectScrollButton() {
  console.log("🔧 Starting button injection...");
  
  // Remove existing button if it exists
  const existingBtn = document.getElementById("autoscroll-btn");
  if (existingBtn) {
    existingBtn.remove();
    console.log("🗑️ Removed old button");
  }

  const button = document.createElement("button");
  button.id = "autoscroll-btn";
  button.innerText = "Start Autoscroll";
  button.className = "autoscroll-btn yt-shorts-autoscroll-btn";
  
  // Add inline styles to ensure visibility
  button.style.position = "fixed";
  button.style.bottom = "32px";
  button.style.right = "32px";
  button.style.background = "#ff0000";
  button.style.color = "#fff";
  button.style.border = "none";
  button.style.borderRadius = "24px";
  button.style.padding = "14px 28px";
  button.style.fontSize = "16px";
  button.style.fontWeight = "bold";
  button.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
  button.style.cursor = "pointer";
  button.style.zIndex = "10000";
  button.style.fontFamily = "inherit";
  
  document.body.appendChild(button);
  console.log("📦 Button added to DOM");

  button.addEventListener("click", () => {
    scrolling = !scrolling;
    button.innerText = scrolling ? "Stop Autoscroll" : "Start Autoscroll";

    if (scrolling) {
      console.log("▶️ Starting autoscroll");
      attachVideoListener();
    } else {
      console.log("🛑 Stopping autoscroll");
      detachVideoListener();
    }
  });
  
  console.log("✅ Button created and should be visible");
  
  // Double-check if button is actually in DOM
  const checkBtn = document.getElementById("autoscroll-btn");
  if (checkBtn) {
    console.log("✅ Button confirmed in DOM");
    console.log("📍 Button position:", checkBtn.style.position);
    console.log("📍 Button z-index:", checkBtn.style.zIndex);
  } else {
    console.log("❌ Button not found in DOM after creation!");
  }
}

// Check URL every 500ms and re-inject only when switching TO Shorts
setInterval(() => {
  const currentUrl = location.href;
  
  if (currentUrl !== lastUrl) {
    console.log("🔄 URL changed from", lastUrl, "to", currentUrl);
    
    // Check if we're switching TO Shorts (from non-Shorts)
    const wasOnShorts = lastUrl.includes("/shorts/");
    const isOnShorts = currentUrl.includes("/shorts/");
    
    console.log("📍 Was on Shorts:", wasOnShorts);
    console.log("📍 Is on Shorts:", isOnShorts);
    
    if (!wasOnShorts && isOnShorts) {
      console.log("📱 Switching TO Shorts page");
      
      // Reload the page once when first entering Shorts
      if (!hasReloaded) {
        console.log("🔄 Reloading page to ensure proper initialization...");
        hasReloaded = true;
        setTimeout(() => {
          window.location.reload();
        }, 500);
        return;
      }
      
      console.log("📱 Injecting button...");
      setTimeout(injectScrollButton, 1000);
    }
    
    lastUrl = currentUrl;
  }
}, 500);

// Initial injection if already on Shorts page
if (location.href.includes("/shorts/")) {
  console.log("🎯 Already on Shorts page, injecting button...");
  setTimeout(injectScrollButton, 1500);
}

console.log("🚀 YouTube Shorts Autoscroll monitoring started"); 
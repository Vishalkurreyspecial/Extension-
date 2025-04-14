// WebRTC blocking
if (typeof window.RTCPeerConnection !== 'undefined') {
  window.RTCPeerConnection = function() {
    console.log("[Privacy Protector] WebRTC blocked");
    return {
      createOffer: function() {
        return new Promise(function() {});
      },
      createAnswer: function() {
        return new Promise(function() {});
      },
      setLocalDescription: function() {
        return new Promise(function() {});
      }
    };
  };
}

// Disable Cloudways tracking scripts
chrome.storage.sync.get(['blockedScripts'], (result) => {
  if (result.blockedScripts && result.blockedScripts.length > 0) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeName === 'SCRIPT' && node.src) {
            result.blockedScripts.forEach((pattern) => {
              if (new RegExp(pattern.replace(/\*/g, '.*')).test(node.src)) {
                node.remove();
                console.log("[Privacy Protector] Removed tracking script:", node.src);
              }
            });
          }
        });
      });
    });
    
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
});

// Time bypass (modify Date object)
chrome.storage.sync.get(['timeOffset'], (result) => {
  if (result.timeOffset) {
    const originalDate = Date;
    window.Date = class extends Date {
      constructor(...args) {
        if (args.length === 0) {
          super(originalDate.now() + result.timeOffset);
        } else {
          super(...args);
        }
      }
      
      static now() {
        return originalDate.now() + result.timeOffset;
      }
    };
  }
});

// Device information spoofing
if (navigator.userAgent.includes('Chrome')) {
  const originalPlugins = navigator.plugins;
  Object.defineProperty(navigator, 'plugins', {
    get: () => [],
    configurable: false
  });
  
  const originalHardwareConcurrency = navigator.hardwareConcurrency;
  Object.defineProperty(navigator, 'hardwareConcurrency', {
    get: () => 4,
    configurable: false
  });
}
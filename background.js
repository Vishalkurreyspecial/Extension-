// WebRTC IP Leak Prevention
chrome.privacy.network.webRTCIPHandlingPolicy.set({
  value: "disable_non_proxied_udp"
});

// User-Agent randomization storage
let userAgents = [
  // Windows
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
  
  // Mac
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  
  // Linux
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  
  // Mobile
  "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36"
];

// Cloudways tracking scripts to block
const cloudwaysScripts = [
  "*://*.cloudways.com/*",
  "*://*.cloudwaysapps.com/*",
  "*://*.cwcdn.com/*"
];

// Initialize blocked scripts
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ blockedScripts: cloudwaysScripts });
  chrome.storage.sync.set({ randomizeUserAgent: true });
  chrome.storage.sync.set({ blockWebRTC: true });
  randomizeUserAgent();
});

// Randomize User Agent
function randomizeUserAgent() {
  chrome.storage.sync.get(['randomizeUserAgent'], (result) => {
    if (result.randomizeUserAgent !== false) {
      const randomAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
      chrome.declarativeNetRequest.updateSessionRules({
        addRules: [{
          id: 1,
          priority: 1,
          action: {
            type: "modifyHeaders",
            requestHeaders: [
              { header: "User-Agent", operation: "set", value: randomAgent }
            ]
          },
          condition: { urlFilter: "|http*", resourceTypes: ["main_frame"] }
        }],
        removeRuleIds: [1]
      });
    }
  });
}

// Timezone and location spoofing
chrome.storage.sync.get(['spoofLocation'], (result) => {
  if (result.spoofLocation) {
    const timezones = [
      "America/New_York", 
      "Europe/London",
      "Asia/Tokyo",
      "Australia/Sydney"
    ];
    const randomTz = timezones[Math.floor(Math.random() * timezones.length)];
    
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      func: (timezone) => {
        Object.defineProperty(Intl, 'DateTimeFormat', {
          value: class extends Intl.DateTimeFormat {
            constructor(locales, options) {
              super(locales, {...options, timeZone: timezone});
            }
          }
        });
      },
      args: [randomTz]
    });
  }
});

// Cloudways account bypass (direct email verification)
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (details.url.includes("cloudways.com") && 
        (details.url.includes("verify-email") || details.url.includes("account-verification"))) {
      return { redirectUrl: "https://cloudways.com/login" }; // Bypass verification
    }
  },
  { urls: ["*://*.cloudways.com/*"] },
  ["blocking"]
);
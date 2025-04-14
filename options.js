document.addEventListener('DOMContentLoaded', function() {
  // Load saved settings
  chrome.storage.sync.get([
    'blockWebRTC',
    'randomizeUserAgent',
    'blockCloudways',
    'spoofLocation',
    'timeOffset',
    'bypassVerification'
  ], function(result) {
    document.getElementById('blockWebRTC').checked = result.blockWebRTC !== false;
    document.getElementById('randomizeUserAgent').checked = result.randomizeUserAgent !== false;
    document.getElementById('blockCloudways').checked = result.blockCloudways !== false;
    document.getElementById('spoofLocation').checked = result.spoofLocation || false;
    document.getElementById('timeOffset').value = result.timeOffset || 0;
    document.getElementById('bypassVerification').checked = result.bypassVerification || false;
  });
  
  // Save settings
  document.getElementById('save').addEventListener('click', function() {
    const settings = {
      blockWebRTC: document.getElementById('blockWebRTC').checked,
      randomizeUserAgent: document.getElementById('randomizeUserAgent').checked,
      blockCloudways: document.getElementById('blockCloudways').checked,
      spoofLocation: document.getElementById('spoofLocation').checked,
      timeOffset: parseInt(document.getElementById('timeOffset').value) || 0,
      bypassVerification: document.getElementById('bypassVerification').checked
    };
    
    chrome.storage.sync.set(settings, function() {
      alert('Settings saved!');
      window.close();
    });
  });
});
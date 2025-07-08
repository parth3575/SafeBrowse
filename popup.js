// popup.js - handles popup UI logic with detailed threat info

document.addEventListener('DOMContentLoaded', () => {
  const statusEl = document.getElementById('status');
  const detailsEl = document.getElementById('details');
  const reportBtn = document.getElementById('report-btn');

  // Get current active tab URL
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) {
      statusEl.textContent = 'No active tab found.';
      detailsEl.textContent = '';
      return;
    }
    const url = tabs[0].url;
    statusEl.textContent = `Checking safety for: ${url}`;

    // Request background script for cached scan results
    chrome.runtime.sendMessage({ action: 'getScanResult', url: url }, (response) => {
      if (response && response.data && response.data.attributes) {
        const stats = response.data.attributes.last_analysis_stats;
        const lastScan = response.data.attributes.last_analysis_date
          ? new Date(response.data.attributes.last_analysis_date * 1000).toLocaleString()
          : 'N/A';

        detailsEl.innerHTML = `
          <p><strong>Detections:</strong> ${stats.malicious} malicious, ${stats.suspicious} suspicious</p>
          <p><strong>Last Scan:</strong> ${lastScan}</p>
        `;
      } else {
        detailsEl.textContent = 'No scan data available.';
      }
    });
  });

  reportBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;
      const url = tabs[0].url;
      alert(`Reported suspicious site: ${url}`);
      // TODO: Implement reporting logic to backend or API
    });
  });
});

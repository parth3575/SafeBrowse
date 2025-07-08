// popup.js - handles popup UI logic

document.addEventListener('DOMContentLoaded', () => {
  const statusEl = document.getElementById('status');
  const reportBtn = document.getElementById('report-btn');

  // Get current active tab URL
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) {
      statusEl.textContent = 'No active tab found.';
      return;
    }
    const url = tabs[0].url;
    statusEl.textContent = `Checking safety for: ${url}`;

    // Here you could add logic to fetch safety status from storage or background
    // For now, just show a placeholder
  });

  reportBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;
      const url = tabs[0].url;
      // For now, just alert the user
      alert(`Reported suspicious site: ${url}`);
      // TODO: Implement reporting logic to backend or API
    });
  });
});

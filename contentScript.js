// contentScript.js - shows warning popup on flagged sites with improved UI, animation, and sound alert

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.warning) {
    showWarningPopup(message.url, message.details);
  }
});

function showWarningPopup(url, details = {}) {
  if (document.getElementById('safebrowse-warning-popup')) return;

  // Create style element for animation and styling
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(100%); }
      to { opacity: 1; transform: translateX(0); }
    }
    #safebrowse-warning-popup {
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #d9534f;
      color: white;
      padding: 20px;
      z-index: 999999;
      border-radius: 10px;
      box-shadow: 0 0 15px rgba(0,0,0,0.7);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      max-width: 320px;
      animation: slideIn 0.5s ease forwards;
    }
    #safebrowse-warning-popup h2 {
      margin: 0 0 10px 0;
      font-size: 18px;
    }
    #safebrowse-warning-popup p {
      margin: 5px 0;
      font-size: 14px;
    }
    #safebrowse-close-btn {
      margin-top: 15px;
      background: white;
      color: #d9534f;
      border: none;
      padding: 8px 14px;
      cursor: pointer;
      border-radius: 5px;
      font-weight: bold;
      transition: background-color 0.3s ease;
    }
    #safebrowse-close-btn:hover {
      background-color: #c9302c;
      color: white;
    }
  `;
  document.head.appendChild(style);

  // Create popup container
  const popup = document.createElement('div');
  popup.id = 'safebrowse-warning-popup';

  // Detailed threat info
  const threatInfo = `
    <h2>⚠️ Warning!</h2>
    <p>This site (<strong>${url}</strong>) is flagged as potentially malicious or phishing.</p>
    <p><strong>Detections:</strong> ${details.malicious || 0} malicious, ${details.suspicious || 0} suspicious</p>
    <p><strong>Last Scan:</strong> ${details.last_scan || 'N/A'}</p>
    <p>Please proceed with caution.</p>
    <button id="safebrowse-close-btn">Dismiss</button>
  `;

  popup.innerHTML = threatInfo;
  document.body.appendChild(popup);

  // Play alert sound
  const audio = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=');
  audio.play().catch(() => { /* ignore play errors */ });

  // Close button handler
  document.getElementById('safebrowse-close-btn').addEventListener('click', () => {
    popup.remove();
    style.remove();
  });
}

// contentScript.js - shows warning popup on flagged sites

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.warning) {
    showWarningPopup(message.url);
  }
});

function showWarningPopup(url) {
  if (document.getElementById('safebrowse-warning-popup')) return;

  const popup = document.createElement('div');
  popup.id = 'safebrowse-warning-popup';
  popup.style.position = 'fixed';
  popup.style.top = '10px';
  popup.style.right = '10px';
  popup.style.backgroundColor = 'red';
  popup.style.color = 'white';
  popup.style.padding = '15px';
  popup.style.zIndex = '999999';
  popup.style.borderRadius = '8px';
  popup.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
  popup.style.fontFamily = 'Arial, sans-serif';
  popup.style.maxWidth = '300px';

  popup.innerHTML = `
    <strong>Warning!</strong><br>
    This site (${url}) is flagged as potentially malicious or phishing.<br>
    Please proceed with caution.
    <button id="safebrowse-close-btn" style="margin-top:10px; background:#fff; color:#f00; border:none; padding:5px 10px; cursor:pointer; border-radius:4px;">Close</button>
  `;

  document.body.appendChild(popup);

  document.getElementById('safebrowse-close-btn').addEventListener('click', () => {
    popup.remove();
  });
}

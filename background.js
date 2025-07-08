// Background service worker for SafeBrowse extension

const VIRUSTOTAL_API_KEY = 'YOUR_VIRUSTOTAL_API_KEY_HERE';
const VIRUSTOTAL_API_URL = 'https://www.virustotal.com/api/v3/urls';

async function checkUrlWithVirusTotal(url) {
  try {
    // VirusTotal API expects the URL to be base64 encoded without padding
    const encodedUrl = btoa(url).replace(/=+$/, '');
    const response = await fetch(`${VIRUSTOTAL_API_URL}/${encodedUrl}`, {
      headers: {
        'x-apikey': VIRUSTOTAL_API_KEY
      }
    });
    if (!response.ok) {
      console.error('VirusTotal API error:', response.statusText);
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking URL with VirusTotal:', error);
    return null;
  }
}

chrome.webNavigation.onCompleted.addListener(async (details) => {
  if (details.frameId !== 0) return; // Only main frame

  const url = details.url;
  console.log('Checking URL:', url);

  const result = await checkUrlWithVirusTotal(url);
  if (result && result.data && result.data.attributes && result.data.attributes.last_analysis_stats) {
    const stats = result.data.attributes.last_analysis_stats;
    if (stats.malicious > 0 || stats.suspicious > 0) {
      // Show warning popup or badge
      chrome.action.setBadgeText({ text: '!' , tabId: details.tabId });
      chrome.action.setBadgeBackgroundColor({ color: 'red', tabId: details.tabId });
      // Optionally, send message to popup or content script
      chrome.tabs.sendMessage(details.tabId, { warning: true, url: url });
    } else {
      chrome.action.setBadgeText({ text: '', tabId: details.tabId });
    }
  } else {
    chrome.action.setBadgeText({ text: '', tabId: details.tabId });
  }
});

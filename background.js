// Background service worker for SafeBrowse extension with caching, rate limiting, and error handling

const VIRUSTOTAL_API_KEY = 'YOUR_VIRUSTOTAL_API_KEY_HERE';
const VIRUSTOTAL_API_URL = 'https://www.virustotal.com/api/v3/urls';

const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours cache expiry
const RATE_LIMIT_MS = 1500; // 1.5 seconds between API calls
let lastApiCallTime = 0;

async function checkUrlWithVirusTotal(url) {
  try {
    // Check cache first
    const cacheKey = `vt_cache_${url}`;
    const cached = await chrome.storage.local.get(cacheKey);
    const now = Date.now();

    if (cached[cacheKey] && (now - cached[cacheKey].timestamp) < CACHE_EXPIRY_MS) {
      console.log('Using cached result for', url);
      return cached[cacheKey].data;
    }

    // Rate limiting
    const timeSinceLastCall = now - lastApiCallTime;
    if (timeSinceLastCall < RATE_LIMIT_MS) {
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_MS - timeSinceLastCall));
    }

    // VirusTotal API expects the URL to be base64 encoded without padding
    const encodedUrl = btoa(url).replace(/=+$/, '');
    const response = await fetch(`${VIRUSTOTAL_API_URL}/${encodedUrl}`, {
      headers: {
        'x-apikey': VIRUSTOTAL_API_KEY
      }
    });

    lastApiCallTime = Date.now();

    if (!response.ok) {
      console.error('VirusTotal API error:', response.statusText);
      return null;
    }

    const data = await response.json();

    // Cache the result
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    await chrome.storage.local.set({ [cacheKey]: cacheData });

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
      // Send detailed info to content script
      chrome.tabs.sendMessage(details.tabId, { warning: true, url: url, details: {
        malicious: stats.malicious,
        suspicious: stats.suspicious,
        last_scan: result.data.attributes.last_analysis_date
          ? new Date(result.data.attributes.last_analysis_date * 1000).toLocaleString()
          : 'N/A'
      }});
    } else {
      chrome.action.setBadgeText({ text: '', tabId: details.tabId });
      // Send message to clear warning in content script
      chrome.tabs.sendMessage(details.tabId, { warning: false });
    }
  } else {
    chrome.action.setBadgeText({ text: '', tabId: details.tabId });
    chrome.tabs.sendMessage(details.tabId, { warning: false });
  }
});

# SafeBrowse Chrome Extension

SafeBrowse is a Chrome extension that warns users when they visit potentially malicious or phishing websites. It uses the VirusTotal API to check URLs and alerts users with a warning popup and badge notification.

## Features

- Warns users about potentially malicious or phishing domains.
- Uses VirusTotal API for URL reputation checks.
- Shows a warning popup on flagged sites.
- Displays a badge icon on the extension when a site is suspicious.
- Allows users to report suspicious sites (placeholder functionality).

## Installation

1. Clone or download this repository.

2. Obtain a VirusTotal API key from [VirusTotal](https://www.virustotal.com/).

3. Open `SafeBrowse/background.js` and replace `'YOUR_VIRUSTOTAL_API_KEY_HERE'` with your actual API key.

4. Open Google Chrome and navigate to `chrome://extensions/`.

5. Enable "Developer mode" using the toggle in the top right corner.

6. Click "Load unpacked" and select the `SafeBrowse` directory.

7. The extension should now be loaded and active.

## Usage

- Visit any website in Chrome.
- If the site is flagged as malicious or suspicious by VirusTotal, a red badge with "!" will appear on the extension icon.
- A warning popup will be displayed on the page.
- Click the extension icon to open the popup UI, which shows the current site's safety status.
- Use the "Report Suspicious Site" button to report suspicious sites (currently a placeholder alert).

## Development

- The extension uses Manifest V3 with a background service worker.
- The background script checks URLs against the VirusTotal API.
- The content script displays warning popups on flagged sites.
- The popup UI allows user interaction and reporting.

## Notes

- The extension requires internet access to query the VirusTotal API.
- Make sure your API key has sufficient quota for URL scanning.
- Icons are not included by default; you can add your own icons in the `icons/` directory.

## License

This project is licensed under the MIT License.

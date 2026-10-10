document.getElementById('enableBtn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url.includes('coursedog.com')) {
        showStatus('Error: Not on a coursedog.com page!', '#dc2626');
        return;
    }

    chrome.tabs.sendMessage(tab.id, { action: "forceEnable" }, (response) => {
        if (chrome.runtime.lastError) {
            showStatus('Error: Refresh the page first.', '#d97706');
        } else {
            showStatus(`Enabled ${response.count} element(s).`, '#059669');
        }
    });
});

function showStatus(msg, color) {
    const statusEl = document.getElementById('status');
    statusEl.textContent = msg;
    statusEl.style.cssText = `font-size: 12px; font-weight: 500; margin-top: 12px; text-align: center; color: ${color};`;
    setTimeout(() => {
        statusEl.textContent = '';
    }, 3000);
}

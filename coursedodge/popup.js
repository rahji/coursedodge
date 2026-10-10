document.getElementById('enableBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab.url.includes('coursedog.com')) {
    showStatus('Error: Not on a coursedog.com page!', 'text-red-400');
    return;
  }

  chrome.tabs.sendMessage(tab.id, { action: "forceEnable" }, (response) => {
    if (chrome.runtime.lastError) {
      showStatus('Error: Refresh the page first.', 'text-amber-400');
    } else {
      showStatus('All fields enabled successfully!', 'text-emerald-400');
    }
  });
});

function showStatus(msg, colorClass) {
  const statusEl = document.getElementById('status');
  statusEl.textContent = msg;
  statusEl.className = `text-xs font-medium mt-3 text-center ${colorClass}`;
  setTimeout(() => {
    statusEl.textContent = '';
  }, 3000);
}

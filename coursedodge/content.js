/**
 * Content Script: Removes 'disabled' and 'readonly' attributes
 * Scope: restricted via manifest to coursedog.com domains
 */
(function() {
    'use strict';

    let paused = false;

    function enableAllElements() {
        // Target inputs, textareas, selects, buttons, and custom containers
        const disabledElements = document.querySelectorAll('[disabled], [readonly]');
        
        let count = 0;
        disabledElements.forEach(el => {
            el.removeAttribute('disabled');
            el.removeAttribute('readonly');
            el.classList.remove('disabled');
            count++;
        });

        if (count > 0) {
            console.log(`[Coursedodge] Successfully enabled ${count} elements.`);
        }
    }

    // Load saved pause state, then run once if not paused
    chrome.storage.local.get({ paused: false }, (result) => {
        paused = result.paused;
        if (!paused) {
            enableAllElements();
        }
    });

    // Keep pause state in sync when toggled from the popup
    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local' && changes.paused) {
            paused = changes.paused.newValue;
            if (!paused) {
                enableAllElements();
            }
        }
    });

    // Observe dynamic DOM changes (since Coursedog is a heavy Single Page App / React app)
    const observer = new MutationObserver((mutations) => {
        if (paused) return;

        let shouldCheck = false;
        for (let mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                shouldCheck = true;
                break;
            }
        }
        if (shouldCheck) {
            enableAllElements();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Listen for messages from popup button (manual enable works even while paused)
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "forceEnable") {
            enableAllElements();
            sendResponse({ status: "success" });
        }
    });
})();

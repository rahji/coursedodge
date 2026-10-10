/**
 * Content Script: Removes 'disabled' and 'readonly' attributes
 * Scope: restricted via manifest to coursedog.com domains
 */
(function() {
    'use strict';

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
            console.log(`[Coursedog Enabler] Successfully enabled ${count} elements.`);
        }
    }

    // Run immediately upon load
    enableAllElements();

    // Observe dynamic DOM changes (since Coursedog is a heavy Single Page App / React app)
    const observer = new MutationObserver((mutations) => {
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

    // Listen for messages from popup toggle button
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "forceEnable") {
            enableAllElements();
            sendResponse({ status: "success" });
        }
    });
})();
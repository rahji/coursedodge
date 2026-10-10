/**
 * Content Script: Removes 'disabled' and 'readonly' attributes
 * only when the popup button is pressed. Does nothing on page load.
 * Scope: restricted via manifest to coursedog.com domains
 */
(function() {
    'use strict';

    function enableAllElements() {
        const disabledElements = document.querySelectorAll('[disabled], [readonly]');

        let count = 0;
        disabledElements.forEach(el => {
            el.removeAttribute('disabled');
            el.removeAttribute('readonly');
            el.classList.remove('disabled');
            count++;
        });

        console.log(`[Coursedodge] Enabled ${count} elements.`);
        return count;
    }

    // Only act when the popup button sends a message
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "forceEnable") {
            const count = enableAllElements();
            sendResponse({ status: "success", count });
        }
    });
})();

// ABOUTME: Userscript that turns the SFCC Business Manager Content Asset editor background red when someone else edited the asset last.
// ABOUTME: Compares the asset's last editor shown on the page with the signed-in Business Manager user.

// ==UserScript==
// @name         SFCC: Content Asset Last Editor Warning
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Turns the Content Asset editor background red if you are not the most recent person to edit the asset
// @author       Chris Raser
// @match        https://PLACEHOLDER-BM-HOST/PLACEHOLDER-CONTENT-ASSET-EDITOR-PATH*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // PLACEHOLDER: replace with the selector for the element showing who last edited the content asset.
    const LAST_EDITOR_SELECTOR = '[data-placeholder="sfcc-last-editor"]';

    // PLACEHOLDER: replace with the selector for the element showing the signed-in Business Manager user.
    const SIGNED_IN_USER_SELECTOR = '[data-placeholder="sfcc-signed-in-user"]';

    const WARNING_BACKGROUND_COLOR = 'red';

    function normalizeUserName(name) {
        return name.trim().replace(/\s+/g, ' ').toLowerCase();
    }

    function isSameUser(a, b) {
        return normalizeUserName(a) === normalizeUserName(b);
    }

    function readText(selector) {
        const element = document.querySelector(selector);
        return element ? element.textContent : null;
    }

    function warnIfSomeoneElseEditedLast() {
        const lastEditor = readText(LAST_EDITOR_SELECTOR);
        const signedInUser = readText(SIGNED_IN_USER_SELECTOR);
        if (lastEditor === null || signedInUser === null) {
            // Warn rather than fail silently, so a page change doesn't quietly disable the warning.
            console.warn('SFCC Content Asset Last Editor Warning: could not find the last editor or the signed-in user.');
            return;
        }
        if (!isSameUser(lastEditor, signedInUser)) {
            document.body.style.setProperty('background-color', WARNING_BACKGROUND_COLOR, 'important');
        }
    }

    if (typeof module === 'object' && module.exports) {
        module.exports = { normalizeUserName, isSameUser };
    } else if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', warnIfSomeoneElseEditedLast);
    } else {
        warnIfSomeoneElseEditedLast();
    }
})();

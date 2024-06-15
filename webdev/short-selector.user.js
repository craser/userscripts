// ==UserScript==
// @name         shortSelector - find a CSS selector for an element
// @namespace    http://tampermonkey.net/
// @version      1
// @description  quickly find css selectors for page elements
// @author       You
// @match        https://www.underarmour.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=underarmour.com
// @grant        unsafeWindow
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Ignore the various classes that are decorators, 3rd party integration artifacts, etc.
     * @param classes
     */
    function filterClasses(classNames) {
        return classNames.trim().split(/\s+/)
            .filter(Boolean)
            .filter(c => !c.startsWith('bfx-'));
    }

    function formatSelector(tagName, classes) {
        let react = [];
        let regular = [];
        classes.forEach(c => {
            if (/__\w+$/.test(c)) {
                let r = c.replace(/(__)\w+$/, '$1')
                react.push(`[class*="${r}"]`);
            } else {
                regular.push(c);
            }
        });

        let reactSelector = react.length
            ? react.join('')
            : ''
        let regularClassSelector = regular.length
            ? `.${regular.join('.')}`
            : '';

        return `${tagName}${reactSelector}${regularClassSelector}`;
    }

    function shortSelector(element) {
        if (!(element instanceof Element))
            throw new Error('Invalid element provided');

        let path = [];
        let selector = '';

        // Start from the given element
        for (let current = element; current && current.nodeType === Node.ELEMENT_NODE; current = current.parentNode) {
            let tagName = current.tagName.toLowerCase();
            let part = formatSelector(tagName, filterClasses(current.className));
            path.unshift(part);
            // Check if the selector uniquely identifies the element
            let queryResult = document.querySelectorAll(path.join(' '));
            if (queryResult.length === 1 && queryResult[0] === element) {
                // If the selector is unique, we've done enough. Break.
                break;
            }
        }

        // Combine all parts to form the full selector
        selector = path.join(' ');

        return selector;
    }

    console.warn('bound shortSelector', { unsafeWindow, shortSelector });
    unsafeWindow.shortSelector = shortSelector;

})();

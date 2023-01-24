// ==UserScript==
// @name         Set GitHub PR Reviewers from URL Param
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Set GitHub PR Reviewers from URL Param
// @author       chris@raser.io
// @match        https://github.com/ua-digital-commerce/ab-tests/compare/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==

(function() {
    'use strict';

    let match = window.location.href.match(/reviewers=(?<reviewers>[^&]+)/);
    if (match) {
        let reviewersParam = match.groups.reviewers;
        let reviewers = decodeURIComponent(reviewersParam);
        let container = document.querySelector('#reviewers-select-menu');
        let summary = container.querySelector('summary');
        summary.click();
        let input = container.querySelector('#review-filter-field');
        input.value = reviewers;
        input.click();

        new Promise((resolve, reject) => {
            let interval = setInterval(() => {
                let items = container.querySelectorAll('.select-menu-item');
                if (items.length == 1) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        })
            .then(() => {
                input.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }));
                summary.click();
            });
    }
})();




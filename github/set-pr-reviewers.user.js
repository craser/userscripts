// ==UserScript==
// @name         Set GitHub PR Reviewers from URL Param
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Set GitHub PR Reviewers from URL Param
// @author       chris@raser.io
// @match        https://github.com/ua-digital-commerce/ab-tests/compare/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    new Promise((resolve, reject) => {
        let match = window.location.href.match(/reviewers=(?<reviewers>[^&]+)/);
        if (match) {
            let reviewers = decodeURIComponent(match.groups.reviewers);
            let container = document.querySelector('#reviewers-select-menu');
            let summary = container.querySelector('summary');
            summary.click();
            let input = container.querySelector('#review-filter-field');
            input.value = reviewers;
            input.click();
            resolve({ container, input, summary })
        } else {
            reject('No reviewers param found in URL');
        }
    })
        .then(({ container, input, summary }) => {
            return new Promise((resolve, reject) => {
                let max = 100;
                let interval = setInterval(() => {
                    let items = container.querySelectorAll('.select-menu-item');
                    if (items.length == 1) {
                        clearInterval(interval);
                        resolve({ container, input, summary })
                    } else if (max-- == 0) {
                        clearInterval(interval);
                        reject('Timeout waiting for reviewers to load');
                    }
                }, 100);
            });
        })
        .then(({ container, input, summary }) => {
            input.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }));
            summary.click();
        })
        .catch(err => {
            console.error(err);
        });
})();




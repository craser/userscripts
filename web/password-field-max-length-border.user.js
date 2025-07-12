// ABOUTME: Userscript that adds a thick, dashed orange border to password fields when they reach maximum length
// ABOUTME: Monitors all password input fields on any webpage for length changes and applies visual warning

// ==UserScript==
// @name         Password Field Max Length Border
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a thick, dashed orange border around password fields when they reach maximum length
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // CSS class for the orange dashed border
    const BORDER_CLASS = 'password-max-length-border';

    // Add CSS styles to the page
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .${BORDER_CLASS} {
                border: 4px dashed orange !important;
                box-shadow: 0 0 0 1px orange !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Check if password field has reached max length
    function checkPasswordLength(passwordField) {
        const maxLength = passwordField.getAttribute('maxlength');
        const currentLength = passwordField.value.length;

        if (maxLength && currentLength >= parseInt(maxLength)) {
            passwordField.classList.add(BORDER_CLASS);
        } else {
            passwordField.classList.remove(BORDER_CLASS);
        }
    }

    // Monitor password field for input changes
    function monitorPasswordField(passwordField) {
        passwordField.addEventListener('input', function() {
            checkPasswordLength(this);
        });

        // Check initial state
        checkPasswordLength(passwordField);
    }

    // Find and monitor all password fields
    function monitorPasswordFields() {
        const passwordFields = document.querySelectorAll('input[type="password"]');
        passwordFields.forEach(monitorPasswordField);
    }

    // Initialize the script
    function init() {
        addStyles();
        monitorPasswordFields();

        // Monitor for dynamically added password fields
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        if (node.matches && node.matches('input[type="password"]')) {
                            monitorPasswordField(node);
                        } else if (node.querySelectorAll) {
                            const newPasswordFields = node.querySelectorAll('input[type="password"]');
                            newPasswordFields.forEach(monitorPasswordField);
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
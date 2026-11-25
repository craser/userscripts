// ABOUTME: Userscript that makes Gmail's inbox Refresh button also check mail from other (POP3) accounts.
// ABOUTME: Sends the same request as Settings → Accounts and Import → "Check mail now" for every listed account.

// ==UserScript==
// @name         Gmail: Load All Mail Accounts
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Clicking Refresh in Gmail also checks mail from your other accounts, like "Check mail now"
// @author       Chris Raser
// @match        https://mail.google.com/mail/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Gmail's inbox toolbar Refresh button.
    const REFRESH_BUTTON_SELECTOR = '[role="button"][act="20"]';

    // Gmail stores its per-session action token in this cookie; it is required for actions like "Check mail now".
    const ACTION_TOKEN_COOKIE = 'GMAIL_AT';

    // Index of Gmail's "ik" key in window.GLOBALS; every request to the mailbox endpoint requires it.
    const GLOBALS_IK_INDEX = 9;

    function readCookie(cookieString, name) {
        const match = cookieString.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
        return match ? match[1] : null;
    }

    // Gmail prefixes its JSON responses with )]}' to prevent JSON hijacking.
    function parseGmailResponse(text) {
        return JSON.parse(text.replace(/^\)\]\}'/, ''));
    }

    // The "ama" entry lists the other accounts Gmail fetches mail from; each account's first field is its id.
    function parseOtherAccountIds(text) {
        const ama = parseGmailResponse(text)[0].find((entry) => entry[0] === 'ama');
        return ama ? ama[3].map((account) => account[0]) : [];
    }

    function getMailboxPath(pathname) {
        return pathname.match(/^\/mail\/u\/\d+\//)[0];
    }

    function buildGmailUrl(mailboxPath, params) {
        return mailboxPath + '?' + new URLSearchParams(params).toString();
    }

    function postToGmail(url) {
        return fetch(url, { method: 'POST', credentials: 'include', body: '' }).then((response) => {
            if (!response.ok) {
                throw new Error(`Gmail request failed with status ${response.status}: ${url}`);
            }
            return response.text();
        });
    }

    function checkMailFromOtherAccounts() {
        const mailboxPath = getMailboxPath(window.location.pathname);
        const ik = window.GLOBALS[GLOBALS_IK_INDEX];
        const at = readCookie(document.cookie, ACTION_TOKEN_COOKIE);
        return postToGmail(buildGmailUrl(mailboxPath, { ik, view: 'masv', rt: 'j' }))
            .then((text) => Promise.all(parseOtherAccountIds(text).map((id) => {
                return postToGmail(buildGmailUrl(mailboxPath, { ik, at, view: 'up', act: `cma_${id}`, rt: 'c' }));
            })))
            .catch((error) => console.error('Load All Mail Accounts:', error));
    }

    // Gmail re-renders its toolbar, so listen on the document rather than on the button itself.
    function onRefreshClick(event) {
        if (event.target.closest(REFRESH_BUTTON_SELECTOR)) {
            checkMailFromOtherAccounts();
        }
    }

    if (typeof module === 'object' && module.exports) {
        module.exports = { readCookie, parseGmailResponse, parseOtherAccountIds, getMailboxPath, buildGmailUrl };
    } else {
        document.addEventListener('click', onRefreshClick, true);
    }
})();

// @name         Cookie to Visitor Server State
// ==UserScript==
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Set Visitor Server State
// @author       Chris Raser
// @match        *://www.underarmour.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function fireStitchEvent() {
        console.log('[Visitor Server State] Firing stitch event');
        s.tl(true, 'o', 'ua-stitch');
    }

    function getServerState() {
        let regex = /AMCV_A9733BC75245B1A30A490D4D@AdobeOrg_SDID=([^;]+)/;
        if (regex.test(document.cookie)) {
            console.log('[Visitor Server State] found state cookie');
            let cookie = document.cookie.match(regex)[1];
            console.log('[Visitor Server State] cookie', cookie);
            let json = decodeURIComponent(cookie);
            console.log('[Visitor Server State] json', json);
            let state = JSON.parse(json);
            console.log('[Visitor Server State] state', state);
            let sdid = state['A9733BC75245B1A30A490D4D@AdobeOrg'].sdid.supplementalDataIDCurrent;
            console.log('[Visitor Server State] sdid:', sdid);
            return { state, sdid };
        } else {
            console.error('[Visitor Server State] No state cookie found');
            return {};
        }
    }


    let token = setInterval(() => {
        console.log('[Visitor Server State] Waiting for visitor object...');
        if (window.visitor && window.s) {
            try {
                console.log('[Visitor Server State] Found visitor object');
                let { state } = getServerState();
                console.log({ state });
                visitor.resetState(state);
                // fireStitchEvent()
            } catch (e) {
                console.error('[Visitor Server State] Error setting visitor server state');
                console.error(e);
            } finally {
                clearInterval(token);
            }
        }
    }, 100);

})();

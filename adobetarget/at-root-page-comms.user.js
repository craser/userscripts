// ==UserScript==
// @name         Root Page Comms Dispatcher
// @namespace    http://tampermonkey.net/
// @version      2024-06-13
// @description  try to take over the world!
// @author       You
// @match        https://experience.adobe.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=adobe.com
// @grant unsafeWindow
// @grant GM_setClipboard
// @require file:///Users/craser/dev/cjr/wk/userscripts/adobetarget/at-root-page-comms.user.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('Root Page Comms Dispatcher loaded. Binding comms listener.');
    window.addEventListener('message', function (event) {
        if (event.data.type === 'abba-scenario') {
            /*
            console.warn('scenarioChange detected. Saving scenarioID to localStorage.', {
                data: event.data,
                origin: event.origin,
                pageOrigin: window.location.origin
            } );
             */

            debugger;
            if (event.origin != 'https://underarmourinc.experiencecloud.adobe.com') {
                console.log('COMS: Event not from expected host. Ignoring.');
                return;
            } else {
                console.log('COMS: Received event from expected host. Processing.', event);
                let json = localStorage.getItem('abba-scenario');
                let scenarioData = json ? JSON.parse(json) : {};

                // shove the current URL into event.data.scenario.activityUrl
                if ('scenario' in event.data) {
                    console.log('COMS: overwriting activiytUrl with root window URL.', event.data);
                    event.data.scenario.activityUrl = window.location.href;
                }

                Object.assign(scenarioData, event.data);
                console.log('COMS: Saving scenarioData to localStorage.', scenarioData);
                localStorage.setItem('abba-scenario', JSON.stringify(scenarioData));
            }
        }
    })
})();

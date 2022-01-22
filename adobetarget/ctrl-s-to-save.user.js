// ==UserScript==
// @name         Adobe Target Scenario - Ctrl-S to Save
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://underarmourinc.experiencecloud.adobe.com/content/mac/underarmourinc/target/activities.html*
//
// @icon         https://www.google.com/s2/favicons?domain=adobe.com
// @grant unsafeWindow
// @grant window.setTimeout
// ==/UserScript==

(function() {
    'use strict';

    function debug() {
        console.log.apply(console, arguments);
    }

    function clickButton() {
        var buttons = document.getElementsByTagName('button');
        for (var i = 0; i < buttons.length; i++) {
            var button = buttons[i];
            var action = button.getAttribute('data-action');
            if ('save' == action) {
                debug({ found: button });
                button.click();
            }
        }
    }

    function isCtrlS(e) {
        return e.key == 's' && e.ctrlKey;
    }

    $(function () {
        debugger;
        debug({
            msg: 'binding',
            href: window.location.href
        });

        document.addEventListener('keypress', function (e) {
            debug({
                key: e.key,
                ctrl: e.ctrlKey,
                e: e
            });
            if (isCtrlS(e)) {
                clickButton();
            }
        })
    });
})();

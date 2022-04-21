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

    var FORBIDDEN_STRINGS = [
        'debugger',
        'I want to be an Air Force Ranger!',
        'I want to live a life of danger!',
        'alert'
    ];

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

    function bindMutationListener(node, f) {
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        var observer = new MutationObserver(f);
        try {
            observer.observe(node, { childList: true, subtree: true, attributes: false });
        } catch (e) {
            console.log({ error: e });
        }
    }

    function getCodeEditAreaConatiner() {
        var container = document.getElementsByClassName('vec-container')[0];
        return container;
    }

    function getCodeMirror(container) {
        var code = container.getElementsByClassName('code-mirror')[0];
        return code;
    }

    function hasWarnings(code) {
        var warn = false;
        FORBIDDEN_STRINGS.forEach(function (forbidden) {
            warn = warn || code.value.indexOf(forbidden) >= 0;
        });
        return warn;
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
        });

        bindMutationListener(document.body, function () {
            var container = getCodeEditAreaConatiner();
            var code = getCodeMirror(container);
            var warn = hasWarnings(code);
            // CAREFUL! Don't trigger an infinite loop of mutations & updates. Don't listen for attribute changes!
            container.setAttribute('style', (warn ? 'background: red' : 'background: green'));
        });
    });
})();

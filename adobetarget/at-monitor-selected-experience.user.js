// ==UserScript==
// @name         Monitor Selected Adobe Target Experience
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://underarmourinc.experiencecloud.adobe.com/content/mac/underarmourinc/target/activities.html*
// @icon         https://www.google.com/s2/favicons?domain=adobe.com
// @grant unsafeWindow
// @grant window.setTimeout
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require file:///Users/craser/dev/cjr/wk/userscripts/adobetarget/at-monitor-selected-experience.user.js
// ==/UserScript==

(function ($) {
    'use strict';

    // debounce
    function debounce(f, ms) {
        var token;
        return function () {
            var args = arguments;
            if (token) {
                clearTimeout(token);
            }
            token = setTimeout(function () {
                token = null;
                f.apply(null, args);
            }, (ms || 200));
        };
    }


    function bindMutationListener($node, f) {
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        $node.each(function () {
            var observer = new MutationObserver(f);
            observer.observe(this, { childList: true, subtree: true, attributes: true });
        });
    }

    /**
     * Scenario names in Adobe Target are pulled from the activity name.
     * HOWEVER, we need scenario names in our codebase to match directory
     * names, etc.
     *
     * The Adobe Target convention is something like: "Challenger A_THX-1138"
     * The codebase convention is something like: "challengerA", "control", etc.
     *
     * @param atScenarioName
     */
    function toCodebaseScenarioId(atScenarioName) {
        let challengerRegex = /Challenger (?<scenario>[A-Z])/i;
        let challengerMatch = challengerRegex.exec(atScenarioName);
        let experienceRegex = /Experience (?<scenario>[A-Z])/i;
        let experienceMatch = experienceRegex.exec(atScenarioName);
        let controlRegex = /Control_?(.*)/i;
        let controlMatch = controlRegex.exec(atScenarioName);
        if (challengerMatch) {
            return `challenger${challengerMatch.groups.scenario.toUpperCase()}`;
        } else if (experienceMatch) {
            return `challenger${experienceMatch.groups.scenario.toUpperCase()}`;
        } else if (controlMatch) {
            return 'control'
        } else {
            return atScenarioName; // default to something we can backtrace later
        }
    }

    function getJiraId() {
        let names = [];
        $('.experience-rail-container .experience-rail .item-row .item-name').each(function () {
            names.push($(this).text().trim());
        });
        $('.activity-editor-header .e2e-edit-label-title').each(function () {
            names.push($(this).text().trim());
        });

        let jiraId = names.reduce(function (acc, name) {
            let match = name.match(/\w\w\w\w?-\d+/);
            return match ? match[0] : acc;
        });
        return jiraId;
    }

    function getActiveScenarioName() {
        return $('.experience-rail-container .experience-rail .item-row.active .item-name')
            .text().trim();
    }

    function updateCurrentScenarioIdentifier() {
        let jiraId = getJiraId();
        let scenarioName = getActiveScenarioName();
        let scenarioId = toCodebaseScenarioId(scenarioName);
        let message = { type: 'abba-scenario', jiraId, scenarioId, scenarioName };
        let targetOrigin = 'https://experience.adobe.com';
        /*
        console.warn({
            scenarioChange: `Sending message to ${targetOrigin}`,
            message,
            targetOrigin
        });

         */
        top.postMessage(message, targetOrigin);
    }

    $(function () {
        bindMutationListener($('body'), debounce(updateCurrentScenarioIdentifier));
    });

})(jQuery);

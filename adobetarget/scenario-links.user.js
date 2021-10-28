// ==UserScript==
// @name         Adobe Target Scenario Link Gen
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://underarmourinc.experiencecloud.adobe.com/content/mac/underarmourinc/target/activities.html*
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @icon         https://www.google.com/s2/favicons?domain=adobe.com
// @grant unsafeWindow
// @grant window.setTimeout
// ==/UserScript==

(function() {
    'use strict';

    function debug() {
        console.log.apply(console, arguments);
    }

    function bindMutationListener($node, f) {
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        $node.each(function () {
            var observer = new MutationObserver(f);
            observer.observe(this, { childList: true, subtree: true, attributes: true });
        });
    }

    function getLinks($container) {
        var links = []; // [{ text, query }]
        $('.copy-to-clipboard', $container).each(function () {
            var $button = $(this);
            let $container = $button.closest('.preview-link');
            var text = $('.link-title', $container).text();
            var query = $('.preview-link-textarea', $container).text();
            links.push({ text: text, query: query });
        });
        debugger;
        return links;
    }

    function buildScenarioLink(text, query) {
        let href = 'javascript:(function(q) { window.location.replace(window.location.href.replace(/(\\?.*|$)/, q)); })("' + query + '")';
        debug({ msg: 'link computed', href: href });
        var $link = $('<a is="coral-button" variant="primary" type="button" class="coral3-Button coral3-Button--primary" size="M">')
            .attr('href', href)
            .append($('<coral-button-label>').text(text))
            .addClass('js-scenario-link')
            .css({
                'margin-right': '1rem',
                'background-color': 'red',
                'border-color': 'red',
                'text-shadow': 'none'
            });

        return $link;
    }

    function addScenarioLinks() {
        debugger;
        var $container = $('.activity-qa-dialog:visible');
        getLinks($container).forEach(function (link) {
            debugger;
            var $link = buildScenarioLink(link.text, link.query);
            var $header = $('.fullscreen-dialog-header-button:visible');
            $link.insertBefore($('button', $header));
        });
    }

    function pageReady() {
        var $container = $('.activity-qa-dialog:visible');
        var links = $('.js-scenario-link', $container);
        debug({
            'activity-qa-dialog': $container.length,
            'num-links': links.length,
            'links': links
        });
        return $container.length && !links.length;
    }

    function omMutation(e) {
        if (pageReady()) {
            addScenarioLinks();
        }
    }

    $(function () {
        debugger;
        debug({
            msg: 'binding',
            href: window.location.href
        });
        bindMutationListener($('body'), function (mutations) {
            debug({ pageReady: pageReady(), mutations: mutations });
            omMutation(mutations);
        });
    });
})();

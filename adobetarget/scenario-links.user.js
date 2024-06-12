// ==UserScript==
// @name         Adobe Target Scenario Link Gen
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Generate scenario links for Adobe Target
// @author       You
// @match        https://underarmourinc.experiencecloud.adobe.com/content/mac/underarmourinc/target/activities.html*
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @icon         https://www.google.com/s2/favicons?domain=adobe.com
// @grant unsafeWindow
// @grant window.setTimeout
// @grant GM_setClipboard
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
        function toQuery(text) {
            if (text.startsWith('http')) {
                return `?${new URL(text).searchParams.toString()}`;
            } else {
                return text;
            }
        }
        var links = []; // [{ text, query }]
        $('.copy-to-clipboard', $container).each(function () {
            var $button = $(this);
            let $container = $button.closest('.preview-link');
            var text = $('.link-title', $container).text();
            var query = toQuery($('.preview-link-textarea', $container).text());
            links.push({ text: text, query: query });
        });
        return links;
    }


    function getTicketLinkMarkdown(testName) {
        var ticket = testName.replace(/.*(GEAT-\d+).*/, '$1');
        var url = 'https://underarmour.atlassian.net/browse/' + ticket;
        return '[' + ticket + '](' + url + ')';
    }

    function hasWarnings() {
        var code = document.getElementsByClassName('code-mirror');
        var FORBIDDEN_STRINGS = [
            'debugger',
            'I want to be an Air Force Ranger!',
            'I want to live a life of danger!',
            'alert'
        ];

        var warn = false;
        FORBIDDEN_STRINGS.forEach(function (forbidden) {
            warn = warn || code.value.indexOf(forbidden) >= 0;
        });
        return warn;
    }

    function getDebuggingRemovedIcon() {
        try {
            return hasWarnings() ? '❌' : '✅';
        } catch (e) {
            console.log({ message: 'error checking code warnings', error: e });
            return '❓';
        }
    }

    function formatMarkdown(environment, name, qaParam, links) {
        var ticketLink = getTicketLinkMarkdown(name);
        var markdown = '**A/B Test Notes**' +
            '\n' +
            '\n- **Ticket:** ' + ticketLink +
            '\n- **Test Name:** ```' + name + '```' +
            '\n- **[Adobe Target Action](' + window.location.href + ')**' +
            '\n- **Environment:** ```' + environment + '```' +
            '\n- **Debugging Removed:** ' + getDebuggingRemovedIcon() +
            '\n- **QA Links**';

        links.forEach(function (link) {
            var query = `${link.query}${qaParam}`;
            markdown += '\n    - **' + link.text + ':** ```' + query + '```';
        });

        return markdown;
    }

    function showMarkdownDisplay($container, markdown) {

        var $textarea = $('<textarea readonly="true">')
            .text(markdown)
            .on('click', function (e) { $(this).select(); })
            .css({
                width: '90%',
                height: '90%',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            });

        var $display = $('<div class="js-json-display">')
            .append($textarea)
            .css({
                width: '80%',
                height: '80%',
                background: 'white',
                border: '3px solid #555',
                zIndex: '1041',
                borderRadius: '5px',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            })

        var $screen = $('<div>')
            .css({
                background: 'black',
                opacity: '0.5',
                zIndex: '1040',
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            })
            .on('click', function () {
                $display.remove();
                $screen.remove();
            });
        $container.append($screen);
        $container.append($display);
        return $display;
    }


    function buildMarkdownButton() {
        var $button = $('<button is="coral-button" variant="primary" type="button" class="coral3-Button coral3-Button--primary" size="M">')
            .append($('<coral-button-label>').text('NOTES'))
            .addClass('js-json-link')
            .css({
                'margin-right': '1rem',
                'background-color': 'lime',
                'border-color': 'lime',
                'text-shadow': 'none'
            });
        return $button;
    }

    function getActivityName($container) {
        var $name = $('.coral-Form-fieldlabel', $container).filter(function () {
            return /activity name/i.test($(this).text());
        })
        var $wrapper = $name.parents('.coral-Form-fieldwrapper');
        var $info  = $('.coral-Form-fieldinfo', $wrapper);
        var activityName = $info.text();
        return activityName;
    }

    function getAudienceQAParam($container) {
        var $name = $('.coral-Form-fieldlabel', $container).filter(function () {
            return /audience/i.test($(this).text());
        })
        var $wrapper = $name.parents('.coral-Form-fieldwrapper');
        var $info  = $('.coral-Form-fieldinfo', $wrapper);
        var audienceParam = $info.text();
        if (/adobeQA/.test(audienceParam)) {
            return `&${audienceParam.trim()}`;
        } else {
            return '';
        }
    }

    function getEnvironmentText() {
        let environment = $('h4', '.overview-section.e2e-overview-section.border-bottom')
            .filter(function () { return /Workspace/.test($(this).text()); })
            .parent()
            .find('div')
            .text();

        return environment;
    }

    function addMarkdownButton() {
        var $container = getContainer();
        var environment = getEnvironmentText();
        var name = getActivityName($container);
        var qaParam = getAudienceQAParam($container);
        var links = getLinks($container);
        var $button = buildMarkdownButton(name, links);

        $button.on('click', function () {
            var markdown = formatMarkdown(environment, name, qaParam, links);
            showMarkdownDisplay($container, markdown);
        });

        var $header = $('.fullscreen-dialog-header-button:visible');
        $button.insertBefore($('button:first', $header));
    }

    /**
     * Only here so we can render to a string & embed in a scriptlet.
     * @param query
     */
    function switchScenario(query) {
        let qp = new URLSearchParams(query);
        let loc = new URL(window.location.href);
        Array.from(qp.keys()).forEach(k => {
            loc.searchParams.set(k, qp.get(k));
        });
        window.location.replace(loc.toString());
    }

    function buildScenarioLink(text, query, qaParam) {
        let href = `javascript:(${switchScenario.toString()})("${query}${qaParam}")`;
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

    function getContainer() {
        return $('.activity-qa-dialog:visible');
    }

    function addScenarioLinks() {
        var $container = getContainer();
        var qaParam = getAudienceQAParam($container);
        getLinks($container).forEach(function (link) {
            var $link = buildScenarioLink(link.text, link.query, qaParam);
            var $header = $('.fullscreen-dialog-header-button:visible');
            $link.insertBefore($('button:first', $header));
        });
    }

    function pageReady() {
        var $container = getContainer();
        var links = $('.js-scenario-link', $container);
        var jsonLinks = $('.js-json-link', $container);
        debug({
            'activity-qa-dialog': $container.length,
            'num-links': links.length,
            'links': links
        });
        return $container.length && !links.length && !jsonLinks.length;
    }

    function letHeaderSpanStretch() {
        $('.fullscreen-dialog-header-button').css({
            width: 'fit-content'
        });
    }

    function omMutation(e) {
        if (pageReady()) {
            debugger; // FIXME: DO NOT COMMIT TO CODE REPOSITORY!
            letHeaderSpanStretch();
            addMarkdownButton();
            addScenarioLinks();
        }
    }

    $(function () {
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

// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://experience.adobe.com/
// @icon         https://www.google.com/s2/favicons?domain=adobe.com
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==

(function() {
    'use strict';

    var buildKudoCountDisplay = function () {
        var $circle = $('<div class="qalinks">')
            .css('position', 'fixed')
            .css('left', '10px')
            .css('bottom', '10px')
            .css('borderRadius', '40px')
            .css('height', '80px')
            .css('width', '80px')
            .css('padding', '5px')
            .css('backgroundColor', '#FC4C02')
            .css('color', '#eee')
            .css('fontWeight', 'bold')
            .css('textAlign', 'center')
            .css('zIndex', '1')
            .css('boxShadow', '5px 5px 5px #ddd');
        var $contents = $('<div>')
            .css('position', 'absolute')
            .css('top', '50%')
            .css('left', '50%')
            .css('transform', 'translate(-50%, -50%)');
        $circle.append($contents);

        $contents.append($('<div class="kudocount">QA</div>')
            .css('fontSize', '2em')), $contents.append($('<div class="kudos">notes</div>')
            .css('fontSize', '0.8em'));

        $circle.on('click', copyQaNotes);

        return $circle;
    }

    function copyQaNotes() {
        debugger;
        var testName = $('.coral-Form-fieldset').eq(0).find('.info-text').text();
        console.log({ testName: testName });
        var links = $('.preview-link').toArray().map(function (node) {
            var name = $('.link-title', $(node)).text();
            var value = $('.preview-link-textarea', $(node)).text();
            return { name: name, value: value };
        });

        console.log({ links: links });

        var markdown = `- **Test Name:**`
            + `\n- **QA Links**\n`
            + links.map(function (link) {
                console.log({ link: link });
                return `    - **${link.name}:** \`\`\`${link.value}\`\`\``
            }).join('\n');

        navigator.clipboard.writeText(markdown);
    }

    console.log('building qa links');
    $('body').append(buildKudoCountDisplay());
})();

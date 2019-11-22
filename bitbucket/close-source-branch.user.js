// ==UserScript==
// @name         BitBucket: Close Source Branch on PR
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Default the checkbox to CHECKED to close the source branch on new PRs.
// @author       Chris Raser
// @match        https://bitbucket.org/ralphlaurendigital/ralph-lauren-digital/pull-requests/new
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    $(window).on('load', function() {
        var checkbox = $('#id_close_anchor_branch');
        checkbox.on('click', function(e) {
            toggleHighlight(checkbox);
        });
        if (!checkbox.is(':checked')) {
            checkbox.click();
        }
        toggleHighlight(checkbox);
    });

    function toggleHighlight(checkbox) {
        var checked = checkbox.is(':checked');
        console.log({checkbox: checkbox, checked: checked});
        checkbox.parents('.field-group').css('background-color', (checked) ? 'transparent' : 'red');
    }
})();


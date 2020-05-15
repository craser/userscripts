// ==UserScript==
// @name         Jira: Story Points Hotkey ('p')
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.atlassian.net/browse/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==

(function() {
    'use strict';

    $(window).on('keyup', function (event) {
        console.log({key: event.key});
        if (event.key == 'p') {
            clickField();
        } 
    });

    function clickField() {
        console.log({click: 'h2'});
        $('h2').each(function () {
            var label = $(this).text();
            if (label == 'Story Points') {
                var b = findClosestButton($(this));
                b.click();
            }
        });
    }
    
    // Finds the first parent that also contains a 'button' element, then returns that button.
    function findClosestButton(node) {
        if (node == null) {
            return null
        } else if (node.find('button').length) {
            return node.find('button');
        } else {
            return findClosestButton(node.parent());
        }        
    }
})();
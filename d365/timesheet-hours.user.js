// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2024-04-30
// @description  try to take over the world!
// @author       You
// @match        https://dand365prod.operations.dynamics.com/?*&mi=PMBINewTimesheet
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dynamics.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let chargeable = document.querySelectorAll('input[id*="TSTimesheetLine_LinePropertyId_"]');
    chargeable.scrollIntoView();
    chargeable.value = 'Charge';


    let hours = document.querySelectorAll('input[id*="TSTimesheetLineWeek_Hours_"]');
    for (let i = 1; i <= 5; i++) {
        hours[i].value = 8;
    }

})();

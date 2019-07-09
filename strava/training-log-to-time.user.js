// ==UserScript==
// @name         Default Traning Log to Time
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.strava.com/athletes/542024/training/log
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    jQuery(window).on('load', function () {
        jQuery('#scale-by').click();
        jQuery('#scale-by').find('[data-value=moving_time]').click();
    });
})();

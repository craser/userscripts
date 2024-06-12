// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2024-05-06
// @description  try to take over the world!
// @author       You
// @match        https://www.underarmour.com/en-us/p/shirts_and_tops/mens_ua_icon_fleece_hoodie/1373880.html?dwvar_1373880_color=203
// @icon         https://www.google.com/s2/favicons?sz=64&domain=underarmour.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => {
        document.querySelector('.ProductDetailContent_product-title-container__0aB3z').style.opacity = 1;
        document.querySelector('.ProductDetailContent_product-detail-container__GyTp_').style.opacity = 1;
    }, 3000);

})();

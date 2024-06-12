// ==UserScript==
// @name         Cookie to Visitor Server State
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Set Visitor Server State
// @author       Chris Raser
// @match        *://www.underarmour.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    debugger;

    let container = document.querySelector('#product-1373880-203-LG-FPP');
    let mainImage = container.querySelector('.Image_responsive_image__yLc71');
    let thumbContainer = container.querySelectorAll('.ProductTile_product-swatches__eQyb0');
    let links = thumbContainer[0].querySelectorAll('a');
    links.forEach(a => {
        a.classList.add('cjr');
        a.addEventListener('click', function (e) {
            console.log(`preventing default click on ${a.href}`)
            e.preventDefault();
            e.stopPropagation();
            mainImage.src = 'https://underarmour.scene7.com/is/image/Underarmour/V5-1373880-611_FC?rp=standard-0pad|gridTileDesktop&scl=1&fmt=jpg&qlt=50&resMode=sharp2&cache=on,on&bgc=F0F0F0&wid=512&hei=640&size=512,640'
        });
        a.addEventListener('mouseover', function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
        a.addEventListener('mouseout', function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
    });
})();






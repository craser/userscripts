// ==UserScript==
// @name         Inject Swiper POC
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://localhost:3000/
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/Swiper/3.3.1/js/swiper.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function injectSwiperCss() {
        const CSS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/3.3.1/css/swiper.min.css'

        // inject a style tag into the head
        var $style = $('<link>');
        $style.attr('rel', 'stylesheet');
        $style.attr('href', CSS_URL);
        $('head').append($style);
    }

    console.log('WEBPACK', { jQuery: $ });
    console.log('WEBPACK', { Swiper });


    const MARKUP = '<!-- Slider main container -->\n' +
        '<div class="WEBPACK-POC">\n' +
        '    <div class="swiper-container">\n' +
        '        <!-- Additional required wrapper -->\n' +
        '        <div class="swiper-wrapper">\n' +
        '            <!-- Slides -->\n' +
        '            <div class="swiper-slide">Slide 1</div>\n' +
        '            <div class="swiper-slide blue ">Slide 2</div>\n' +
        '            <div class="swiper-slide red">Slide 3</div>\n' +
        '        </div>\n' +
        '        <!-- If we need pagination -->\n' +
        '        <div class="swiper-pagination"></div>\n' +
        '        <!-- If we need navigation buttons -->\n' +
        '        <div class="swiper-button-prev"></div>\n' +
        '        <div class="swiper-button-next"></div>\n' +
        '    </div>\n' +
        '</div>';

    const OVERRIDE_CSS = '.swiper-container {\n' +
        '    width: 800px;\n' +
        '    height: 200px;\n' +
        ' \n' +
        '} \n' +
        '\n' +
        '.swiper-slide {\n' +
        '   background-color: purple;\n' +
        '\n' +
        '}\n' +
        '\n' +
        '.blue {\n' +
        '  background-color: blue;\n' +
        '}\n' +
        '\n' +
        '.red {\n' +
        '  background-color: red;\n' +
        '}';

    function buildCarousel() {
        console.log('WEBPACK', 'challengerA', 'script.js', 'buildCarousel');
        console.log({ MARKUP });
        let $carousel = $(MARKUP);
        console.log({ carousel: $carousel[0] });
        return $carousel;
    }

    function initSwiper(swiperContainer) {
        console.log('WEBPACK', 'challengerA', 'script.js', 'initSwiper');
        console.log({ swiperContainer });
        new Swiper('.swiper-container', {
            initialSlide: 0,
            //truewrapper adoptsheight of active slide
            autoHeight: false,
            // Optional parameters
            direction: 'horizontal',
            loop: true,
            // If we need pagination
            pagination: '.swiper-pagination',
            paginationType: 'bullets',

            // Navigation arrows
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',

            effect: 'slide',
            // Distance between slides in px.
            spaceBetween: 10,
            slidesPerView: 2,
            centeredSlides: true,
            slidesOffsetBefore: 0,
            grabCursor: true,
        });
    }

    function injectCarousel() {
        console.log('WEBPACK', 'challengerA', 'script.js', 'injectCarousel');
        let $carousel = buildCarousel();
        $('body').append($carousel);
        initSwiper($carousel[0]);
        return $carousel;
    }

    function injectOverrideCss() {
        debugger;
        let $style = $('<style>').text(OVERRIDE_CSS);
        $('head').append($style);
    }

    $(window).on('load', () => {
        console.log('WEBPACK', 'challengerA', 'window.load');
        console.log('WEBPACK', { MARKUP });
        injectSwiperCss();
        injectOverrideCss();
        injectCarousel();
    });
})();

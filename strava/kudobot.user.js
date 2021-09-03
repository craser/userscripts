// ==UserScript==
// @name       KudoBot
// @namespace  http://dreadedmonkeygod.net
// @version    10
// @description Automatically click on the "Give Kudos" buttons for all activities.
// @match      https://*.strava.com/dashboard*
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @copyright  2012+, Christopher Raser chris@dreadedmonkeygod.net
// ==/UserScript==
$(window)
    .on('load', function () {
        function init($) {
            var buildKudoCountDisplay = function () {
                var $circle = $('<div>')
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

                $contents.append($('<div class="kudocount">0</div>')
                    .css('fontSize', '2em')), $contents.append($('<div class="kudos">kudos</div>')
                    .css('fontSize', '0.8em'));

                $circle.on('click', giveAllKudos);

                return $circle;
            }

            function log() {
                console.log.apply(console, arguments);
            }

            function updateCount(count) {
                $('.kudocount').text(count);
            }

            var incrementCount = (function () {
                var total = 0;
                return function(count) {
                    total += count;
                    updateCount(total);
                }
            })();

            function bindMutationListener($node, f) {
                var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
                $node.each(function () {
                    var observer = new MutationObserver(f);
                    observer.observe(this, { childList: true, subtree: true, attributes: true });
                });
            }

            function debounce(f, ms) {
                var token;
                return function () {
                    if (token) {
                        clearTimeout(token);
                    }
                    token = setTimeout(function () {
                        token = null;
                        f.apply(null, arguments);
                    }, ms);
                }
            }

            function getKudosButtons() {
                return $('[data-testid="kudos_button"]');
            }

            function isClickable() {
                return $(this).is('[title="Give kudos"]');
            }

            function getUnfilledKudos() {
                return getKudosButtons()
                    .filter(isUnmarked)
                    .filter(isClickable)
                    .filter(function () {
                        return !!$(this).find('[data-testid="unfilled_kudos"]').length;
                    });
            }

            function isUnmarked() {
                return !$(this).is('.kudobot-marked');
            }

            function isMarked() {
                return $(this).is('.kudobot-marked');
            }

            function markUnfilled($buttons) {
                $buttons
                    .addClass('kudobot-marked');
                    //.css('border', '5px solid #f00');
            }

            function markAsFilled($buttons) {
                $buttons
                    .removeClass('kudobot-marked');
                    //.css('border', '5px solid #0f0');

                incrementCount($buttons.length);
            }

            function isFilled() {
                return !!$(this).find('[data-testid="filled_kudos"]').length;
            }

            function markGivenKudos() {
                var $filled = getKudosButtons()
                    .filter(isMarked)
                    .filter(isFilled);
                markAsFilled($filled);
            }

            function giveAllKudos() {
                var $buttons = getUnfilledKudos();
                markUnfilled($buttons);
                $buttons.click();
            }

            $(function () {
                console.log('Loading KudoBot');
                var display = buildKudoCountDisplay()
                $('body').append(display);

                giveAllKudos();
                bindMutationListener($('body'), debounce(function (nodes) {
                    giveAllKudos();
                    markGivenKudos();
                }, 200));
            });
        }

        debugger;
        init($ || jQuery);
    });

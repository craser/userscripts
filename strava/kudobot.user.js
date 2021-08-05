// ==UserScript==
// @name       KudoBot
// @namespace  http://dreadedmonkeygod.net
// @version    9
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
                    .css('fontSize', '0.8em')), $circle.click(function () {
                    $circle.fadeOut();
                });

                return $circle;
            }

            function log() {
                console.log.apply(console, arguments);
            }

            function bindMutationListener(node, f) {
                var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
                var observer = new MutationObserver(f);
                observer.observe(node, { childList: true, subtree: true });
                return observer;
            }

            function getActivityId($container) {
                return $('[data-testid="activity_name"]', $container).prop('href');
            }

            function getActivityName($container) {
                return $('[data-testid="activity_name"]', $container).text();
            }

            function hasKudos($node) {
                return !!$('[data-testid="filled_kudos"]', $node).length;
            }

            function getKudosButton($activity) {
                var $button = $('[data-testid="kudos_button"]', $activity);
                return $button;
            }

            function canGiveKudos($node) {
                if (hasKudos($node)) {
                    return false;
                } else if (getKudosButton($node).is('[title="View all kudos"]')) {
                    return false;
                } else {
                    return true;
                }
            }

            function updateCount(count) {
                $('.kudocount').text(count);
            }

            var clickKudosButton = (function () {
                var count = 0;
                return function ($activity) {
                    var $button = $('[data-testid="kudos_button"]', $activity);
                    var observer = bindMutationListener($activity[0], function () {
                        if (hasKudos($activity)) {
                            count++;
                            updateCount(count);
                            $button.css('border', '5px solid #0f0');
                            observer.disconnect();
                        }
                    });
                    log({ message: 'clicking', name: getActivityName($activity) });
                    $button.css('border', '5px solid #f00');
                    $button.click();
                }
            })();


            function giveKudos($activity) {
                var name = getActivityName($activity);
                if (canGiveKudos($activity)) {
                    log('clicking: ' + name);
                    clickKudosButton($activity)
                } else {
                    log('already has kudos: ' + name);
                }
            }

            function giveAllKudos($) {
                $('[data-testid="web-feed-entry"]').each(function () {
                    giveKudos($(this));
                });
            }

            var detectKudos = (function () {
                var count = 0;
                return function () {
                    $('[data-testid="web-feed-entry"]').each(function () {
                        var $activity = $(this);
                        if (hasKudos($activity)) {
                            count++;
                            updateCount(count);
                            $button.css('border', '5px solid #0f0');
                            observer.disconnect();
                        }
                    });
                }
            })();

            $(function () {
                console.log('Loading KudoBot');
                var display = buildKudoCountDisplay()
                $('body').append(display);
                giveAllKudos($);
            });
        }

        debugger;
        init($ || jQuery);
    });

// ==UserScript==
// @name       KudoBot
// @namespace  http://dreadedmonkeygod.net
// @version    8
// @description Automatically click on the "Give Kudos" buttons for all activities.
// @match      https://*.strava.com/dashboard*
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @copyright  2012+, Christopher Raser chris@dreadedmonkeygod.net
// ==/UserScript==
$(window).on('load', function () {
    (function (o) {
        o(function () {
            function s() {
                console.log.apply(console, arguments)
            }
            function n(o) {
                var n = setInterval(function () {
                    if (s("click?"), o.hasClass("js-add-kudo")) {
                        e(o.data("entry")), o.click()
                    } else clearInterval(n)
                }, 1e3)
            }
            console.log("Loading KudoBot");
            var t = function () {
                var s = o("<div>").css("position", "fixed").css("left", "10px").css("bottom", "10px").css("borderRadius", "40px").css("height", "80px").css("width", "80px").css("padding", "5px").css("backgroundColor", "#FC4C02").css("color", "#eee").css("fontWeight", "bold").css("textAlign", "center").css("zIndex", "1").css("boxShadow", "5px 5px 5px #ddd");
                return s.append(o('<div class="kudocount">0</div>').css("fontSize", "2em")), s.append(o('<div class="kudos">kudos</div>').css("fontSize", "0.8em")), s.click(function () {
                    s.fadeOut()
                }), c = setTimeout(function () {
                    s.fadeOut()
                }, 5e3), window.kudoDiv = s, s
            }(), c = null;
            o("body").append(t), o(".activity").each(function () {
                o(".js-add-kudo", o(this)).each(function () {
                    n(o(this))
                })
            });
            var e = function () {
                var s = 0, n = {};
                return function (e) {
                    clearTimeout(c), n[e] || (n[e] = !0, s++, o(".kudocount", t).html(s), t.toggle(!0), c = setTimeout(function () {
                        t.fadeOut()
                    }, 2e4))
                }
            }()
        })
    })($ || jQuery);
});
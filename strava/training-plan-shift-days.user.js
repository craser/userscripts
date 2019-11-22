// ==UserScript==
// @name         Training Plan Day Shifter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.strava.com/training-plans/cycling
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==

(function() {
    'use strict';
    var $note = buildNotificationDiv();
    $("body").append($note);


    function shiftSchedule() {
        var plan = $('#training-plan-full');
        for (var i = 0; i < 3; i++) {
            var week = $(plan.find('tbody').get(i));
            shiftWeek(week);
        }
        var week = $(plan.find('tbody').get(3));
        shiftChallengeWeek(week);
    }

    function shiftWeek(week) {
        var headers = $(week.find('tr').get(0));
        var details = $(week.find('tr').get(1));
        shiftDays('th', headers);
        shiftDays('td', details);
    }

    function shiftChallengeWeek(week) {
        var headers = $(week.find('tr').get(0));
        var details = $(week.find('tr').get(1));
        shiftChallengeDays('th', headers);
        shiftChallengeDays('td', details);
    }

    function shiftDays(tag, cells) {
        var mon = $($(tag, cells).get(0));
        var tue = $($(tag, cells).get(1));
        var wed = $($(tag, cells).get(2));
        var thr = $($(tag, cells).get(3));
        var fri = $($(tag, cells).get(4));
        var sat = $($(tag, cells).get(5));
        var sun = $($(tag, cells).get(6));

        var rest = mon.html();

        mon.html(tue.html()); // Monday gets Tuesday
        tue.html(wed.html()); // Tuesday get Wednesday
        wed.html(thr.html());       // Wednesday gets Thursday
        thr.html(rest);      // Thursday is a rest day
        fri.html(sat.html()); // Friday gets Saturday
        sat.html(rest);       // Saturday & Sunday are Rest Days.
        sun.html(rest);
    };

    function shiftChallengeDays(tag, cells) {
        var mon = $($(tag, cells).get(0));
        var tue = $($(tag, cells).get(1));
        var wed = $($(tag, cells).get(2));
        var thr = $($(tag, cells).get(3));
        var fri = $($(tag, cells).get(4));
        var sat = $($(tag, cells).get(5));
        var sun = $($(tag, cells).get(6)); // Always Challenge day

        var rest = mon.html();
        var challenge = sun.html();

        mon.html(tue.html()); // Monday gets Tuesday
        tue.html(wed.html()); // Tuesday get Wednesday
        wed.html(thr.html());       // Wednesday is a Rest Day
        thr.html(sat.html()); // Saturday is the new day before Challenge day.
        fri.html(challenge);  // Friday is the new Challenge day.

        sat.html(rest);       // Saturday & Sunday are Rest Days.
        sun.html(rest);
    }


    function buildNotificationDiv() {
        var $div = $("<div>")
            .css("position", "fixed")
            .css("left", "10px")
            .css("bottom", "10px")
            .css("borderRadius", "7px")
            .css("cursor", "pointer")
            .css("padding", "5px")
            .css("backgroundColor", "#FC4C02")
            .css("color", "#eee")
            .css("fontWeight", "bold")
            .css("textAlign", "center")
            .css("zIndex", "1")
            .css("boxShadow", "5px 5px 5px #ddd");

        $div.append($('<div>adjust schedule</div>')
                    .css("fontSize", "2em"));

        $div.click(function() {
            shiftSchedule();
            $div.fadeOut();
        });

        window.kudoDiv = $div;
        return $div;
    }
})();

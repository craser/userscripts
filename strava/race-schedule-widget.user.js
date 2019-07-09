// ==UserScript==
// @name       Race Schedule Widget
// @namespace  http://dreadedmonkeygod.net
// @version    1
// @description Display Days Until Next Race
// @match      https://*.strava.com/dashboard*
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @copyright  2012+, Christopher Raser chris@dreadedmonkeygod.net
// ==/UserScript==


$(window).on('load', function () {
    var races = [
        {name: "OtH 1", date: '7/23/2019'},
        {name: "OtH 2", date: '7/30/2019'},
        {name: "OtH 3", date: '8/6/2019'},
        {name: "OtH 4", date: '8/13/2019'},
        {name: "OtH 5", date: '8/20/2019'},
        {name: "OtH 6", date: '8/27/2019'},
        {name: "Grizzly 100", date: '9/28/2019'},
        {name: "Freemont Cyn", date: '10/5/2019'}
    ];

    function getNextRace() {
        var today = new Date().getTime();
        return races.filter(function(race) { return new Date(race.date).getTime() > today; })
            .shift();
    }

    function daysUntilRace(race) {
        var today = new Date().getTime();
        var next = new Date(race.date).getTime();
        var day = 24 * 60 * 60 * 1000;
        return Math.ceil((next - today) / day);
    }

    function clearCardFooter() {
        $('.card-footer:first .card-section').remove();
    }

    function displayDaysUntilRace(race) {
        var card = $("<div>")
            .attr("class", "card-section")
            .css("font-size", "1.5rem");

        $('.card-footer:first')
            .append(card);

        if (race) {
            var days = daysUntilRace(race);
            var section = $("<div>")
                .css("float", "right")
                .append(days)
                .append($('<span style="font-size: 1rem">days</span>'));
            var header = $("<div>")
                .append(race.name)
                .append(":");

            card
                .append(section)
                .append(header);
        }
        else {
            card.append("No Upcoming Race")
        }
    }

    (function ($) {
        debugger;
        clearCardFooter();
        //var race = getNextRace();
        //displayDaysUntilRace(race);
        races
            .filter(function (race) { return new Date(race.date).getTime() > new Date().getTime(); })
            .map(displayDaysUntilRace);
    })($ || jQuery);
});

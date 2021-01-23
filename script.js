$(document).ready(function() {

    const dt = luxon.DateTime;
    let scheduleStart = $("#schedule");
    let displayClock = init();

    let playerArray = [].slice.call ($(".playerList"));

    $("#schedule").on('wheel', function(e) {

        clearInterval(displayClock);
        var delta = e.originalEvent.deltaY;
      
        if (delta < 0) {}// going down
        else {}; // going up

        return false;
      });

    function init() {
        let dtInit = dt.local().toLocaleString(dt.DATETIME_MED_WITH_SECONDS);
        let dtDisplay = $("#currentDay");
        let screenHeight = screen.availHeight;
        let rowCount = Math.floor((screenHeight - 166.7)/80)

        for(let i = 2; i < rowCount; i++) {
            $(scheduleStart).append(rowTemplate);
        }

        dtDisplay.text(dtInit);

        let displayClock = setInterval (function() {
            dtDisplay.text(dtInit);
            dtInit = dt.local().plus({seconds: 1}).toLocaleString(dt.DATETIME_MED_WITH_SECONDS);
        }, 1000);

        return displayClock;
    }

});
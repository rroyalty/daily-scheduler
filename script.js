$(document).ready(function() {

    const dt = luxon.DateTime;
    let scheduleStart = $("#schedule");
    let displayClock = init();

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

        console.log(rowCount);
        console.log(scheduleStart);
        console.log(rowTemplate);


        for(i = 0; i < rowCount; i++) {
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
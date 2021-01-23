$(document).ready(function() {

    const dt = luxon.DateTime;
    let curBlock = 0;
    let scheduleStart = $("#schedule");
    let displayClock = init();

    let rowArray = $(".row");
    
    let timeHour = dt.local().set({hour: dt.local().hour, minute: "0", second: "0"});

    for(let i = 0; i < rowArray.length; i++ ) {
        formatRow(i, 0);
    }

    console.log(rowArray);

    $("#schedule").on('wheel', function(e) {
        // clearInterval(displayClock);
        var delta = e.originalEvent.deltaY;
      
        if (delta < 0) {
            scrollDown();
        }// going down
        else {
            scrollUp();
        }; // going up

        return false;
      });

    function init() {
        let dtInit = dt.local().weekdayLong + ", " + dt.local().toLocaleString(dt.DATETIME_MED_WITH_SECONDS);
        let dtDisplay = $("#currentDay");
        let screenHeight = screen.availHeight;
        let rowCount = Math.floor((screenHeight - 166.7)/80)

        for(let i = 1; i < rowCount; i++) {
            $(scheduleStart).append(rowTemplate);
        }

        dtDisplay.text(dtInit);

        let displayClock = setInterval (function() {
            dtDisplay.text(dtInit);
            dtInit = dt.local().weekdayLong  + ", " + dt.local().plus({seconds: 1}).toLocaleString(dt.DATETIME_MED_WITH_SECONDS);
        }, 1000);

        return displayClock;
    }

    function formatRow(i, j) {

        $(rowArray[i]).text(timeHour.plus({hours: i + j}).toLocaleString(dt.DATE_SHORT) +"\n" + timeHour.plus({hours: i + j}).toLocaleString(dt.TIME_SIMPLE));

        if (timeHour.hour + i + j === dt.local().hour) $(rowArray[i]).addClass("present");
        else if (timeHour.hour + i + j > dt.local().hour) $(rowArray[i]).addClass("future");
        else $(rowArray[i]).addClass("past");
    }

    function scrollDown() {
        curBlock--; 
        $(rowArray[rowArray.length - 1]).remove();
        $(scheduleStart).prepend(rowTemplate);
        rowArray = $(".row");
        formatRow(0, curBlock);
    }

    function scrollUp() {
        curBlock++; 
        $(rowArray[0]).remove();
        $(scheduleStart).append(rowTemplate);
        rowArray = $(".row");
        formatRow(rowArray.length - 1, curBlock);
    }

});
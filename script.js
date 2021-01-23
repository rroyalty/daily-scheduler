$(document).ready(function() {

    const rowTemp = '<div class="row"></row>' 
    const timeKeyTemp = '<div class="col-2 col-sm-1 locked rpmx"></div>'
    const timeKeyPara = '<p class="timeKey"></p>'
    const saveButton = '<div class="col-2 col-sm-1 btn btn-primary unlocked rpmx" hidden="true"></div>'
    const entryField = '<textarea class="col-10 col-sm-11 unlocked entry rpmx" rows="3" disabled></textarea>'


const schedEntries = { entries: [{}]}


    const dt = luxon.DateTime;
    let position = 0;
    let scheduleStart = $("#schedule");
    let displayClock = init();

    let rowArray = $(".row");
    let entryArray = $(".entry");
    let buttonArray = $(".btn");
    let timeArray = $(".timeKey");
    
    
    let timeHour = dt.local().set({hour: dt.local().hour, minute: "0", second: "0"});

    for(let i = 0; i < rowArray.length; i++ ) {
        formatRow(i, 0);
    }

    console.log(rowArray);

    $(entryArray).on('click', function() {
        let _this = this;
        console.log(_this);
    });

    $("#schedule").on('wheel', function(e) {
        // clearInterval(displayClock);
        var delta = e.originalEvent.deltaY;
      
        if (delta < 0) {
            scrollDown();
        }// going down
        else {
            scrollUp();
        };// going up

        return false;
      });

    function init() {
        let dtInit = dt.local().weekdayLong + ", " + dt.local().toLocaleString(dt.DATETIME_MED_WITH_SECONDS);
        let dtDisplay = $("#currentDay");
        let screenHeight = screen.availHeight;
        let rowCount = Math.floor((screenHeight - 166.7)/80)

        for(let i = 1; i < rowCount; i++) {
            appendRow();
        }

        dtDisplay.text(dtInit);

        let displayClock = setInterval (function() {
            dtDisplay.text(dtInit);
            dtInit = dt.local().weekdayLong  + ", " + dt.local().plus({seconds: 1}).toLocaleString(dt.DATETIME_MED_WITH_SECONDS);
        }, 1000);

        return displayClock;
    }

    function formatRow(i, j) {

        $(timeArray[i]).text(timeHour.plus({hours: i + j}).toLocaleString(dt.DATE_SHORT) +"\n" + timeHour.plus({hours: i + j}).toLocaleString(dt.TIME_SIMPLE));

        if (timeHour.hour + i + j === dt.local().hour) $(timeArray[i]).addClass("present");
        else if (timeHour.hour + i + j > dt.local().hour) $(timeArray[i]).addClass("future");
        else $(timeAr[i]).addClass("past");
    }

    function scrollDown() {
        position--; 
        $(rowArray[rowArray.length - 1]).remove();
        $(scheduleStart).prepend(rowTemplate);
        rowArray = $(".row");
        formatRow(0, position);
    }

    function scrollUp() {
        position++; 
        $(rowArray[0]).remove();
        $(scheduleStart).append(rowTemp);
        rowArray = $(".row");
        formatRow(rowArray.length - 1, position);
    }

    function appendRow() {
        let rowGen = $(scheduleStart).append(rowTemp);
        console.log(rowGen);
        rowGen.append(timeKeyTemp).append(timeKeyPara);
        rowGen.append(saveButton);
        rowGen.append(entryField);
    }

});
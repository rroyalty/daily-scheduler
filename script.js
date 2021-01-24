$(document).ready(function() {
 
    const schedEntries = { entries: [{}]};
    const dt = luxon.DateTime;
    const screenHeight = screen.availHeight;
    const rowCount = Math.floor((screenHeight - 166.7)/80)
    let lockToggle = false;
    let position = 0;
    let scheduleStart = $("#schedule");

    let rowArray = init();
    let entryArray = $(".entry");
    let timeArray = $(".timeKey");
        
    let timeHour = dt.local().set({hour: dt.local().hour, minute: "0", second: "0"});

    for(let i = 0; i < rowArray.length; i++) {
        formatRow(i, 0);
    }

    console.log(rowArray);

    $(rowArray).on('click', function() {

        if (lockToggle === true) return false;
        
        lockToggle = true;
        let _this = this;

        let rowID = $(_this).attr("id");

        lockAllEntries();

        let saveButton = $(_this).children(".unlocked").eq(0);
        let timeKey = $(_this).children(".locked").eq(0);
        let textArea = $(_this).children(".entry").eq(0);
        $(textArea).prop("disabled", false);
        $(saveButton).prop("hidden", false);
        $(timeKey).prop("hidden", true);
        textArea.focus();

    });

    $(rowArray).on('click', ".unlocked", function() {

        if (lockToggle === true) return false;
        
        lockToggle = true;
        let _this = this;

        let rowID = $(_this).attr("id");

        lockAllEntries();

        let saveButton = $(_this).children(".unlocked").eq(0);
        let timeKey = $(_this).children(".locked").eq(0);
        let textArea = $(_this).children(".entry").eq(0);
        $(textArea).prop("disabled", false);
        $(saveButton).prop("hidden", false);
        $(timeKey).prop("hidden", true);
        textArea.focus();

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

        for(let i = 0; i < rowCount - 1; i++) {
            appendRow(i);
        }

        let rowArray = $(".row");

        rowChildren(rowArray);

        dtDisplay.text(dtInit);

        let displayClock = setInterval (function() {
            dtDisplay.text(dtInit);
            dtInit = dt.local().weekdayLong  + ", " + dt.local().plus({seconds: 1}).toLocaleString(dt.DATETIME_MED_WITH_SECONDS);
        }, 1000);

        return rowArray;
    }

    function formatRow(i, j) {

        rowArray = $(".row");
        entryArray = $(".entry");
        timeArray = $(".timeKey");
        
        $(timeArray[i]).text(timeHour.plus({hours: i + j}).toLocaleString(dt.DATE_SHORT) +"\n" + timeHour.plus({hours: i + j}).toLocaleString(dt.TIME_SIMPLE));

        if (timeHour.hour + i + j === dt.local().hour) $(rowArray[i]).addClass("present");
        else if (timeHour.hour + i + j > dt.local().hour) $(rowArray[i]).addClass("future");
        else $(rowArray[i]).addClass("past");
    }

    function scrollDown() {
        if (lockToggle === true) return false;

        position--; 
        $(rowArray[rowArray.length - 1]).remove();
        prependRow(position);
        rowArray = $(".row");
        rowChildren(rowArray[0]);
        formatRow(0, position);
    }

    function scrollUp() {
        if (lockToggle === true) return false;

        position++; 
        $(rowArray[0]).remove();
        appendRow(position + rowArray.length - 1);
        rowArray = $(".row");
        rowChildren(rowArray[rowArray.length - 1]);
        formatRow(rowArray.length - 1, position);
    }

    function appendRow(index) {
        let rowTemp = '<div id="#entry_' + index + '" class="row"></div>' 
        $(scheduleStart).append(rowTemp);
    }

    function prependRow(index) {
        let rowTemp = '<div id="#entry_' + index + '" class="row"></div>' 
        $(scheduleStart).prepend(rowTemp);
    }


    function rowChildren(rowsToAppend) {
        let timeKeyTemp = '<div class="col-2 col-sm-1 locked rpmx"></div>'
        let saveButton = '<div class="col-2 col-sm-1 btn btn-primary unlocked rpmx" hidden="true"></div>'
        let entryField = '<textarea class="col-10 col-sm-11 entry rpmx" rows="3" disabled></textarea>'
        let timeKeyPara = '<p class="timeKey"></p>'
        $(timeKeyTemp).appendTo(rowsToAppend).append(timeKeyPara);
        $(saveButton).appendTo(rowsToAppend);
        $(entryField).appendTo(rowsToAppend);
    };

    function lockAllEntries() {
        $(".locked").prop("hidden", false);
        $(".unlocked").prop("hidden", true);
        $(".entry").prop("disabled", true);
    }

});


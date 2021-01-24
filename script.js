$(document).ready(function() {
 
    const dt = luxon.DateTime;
    const screenHeight = screen.availHeight;
    const rowCount = Math.floor((screenHeight - 166.7)/80)
    let lockToggle = false;
    let position = 0;
    let scheduleStart = $("#schedule");

    let rowArray = init();
    let entryArray = $(".entry");
    let timeArray = $(".timeKey");
    let buttonArray = $(".unlocked");
        
    let timeHour = dt.local().set({hour: dt.local().hour, minute: "0", second: "0"});

    for(let i = 0; i < rowArray.length; i++) {
        formatRow(i, 0);
    }

    setEventHandler(rowArray);

    $(document).on("keydown", function(event) {
        console.log(event.keyCode);
        switch(true) {
            case event.keyCode === 40:
                scrollUp();
            break;
            case event.keyCode === 38:
                scrollDown();
            break;
            case event.keyCode === 36:
                $(".row").remove();
                rowArray = init();
                timeHour = dt.local().set({hour: dt.local().hour, minute: "0", second: "0"});
                for(let i = 0; i < rowArray.length; i++) {
                    formatRow(i, 0);
                }
                setEventHandler(rowArray);
            break;
            case event.keyCode === 33:
                for(i = 0; i < rowCount - 1; i++) scrollDown();
            break;
            case event.keyCode === 34:
                for(i = 0; i < rowCount - 1; i++) scrollUp();
            break;
        }

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
            timeHour = dt.local().set({hour: dt.local().hour + 1, minute: "0", second: "0"});
            if (dtInit == timeHour) scrollUp();
        }, 1000);

        return rowArray;
    }

    function formatRow(i, j) {

        rowArray = $(".row");
        entryArray = $(".entry");
        timeArray = $(".timeKey");
        
        $(timeArray[i]).text(timeHour.plus({hours: i + j}).toLocaleString(dt.DATE_SHORT) +"\n" + timeHour.plus({hours: i + j}).toLocaleString(dt.TIME_SIMPLE));

        let rowID = $(rowArray[i]).attr("id");
        $(entryArray[i]).val(JSON.parse(localStorage.getItem(rowID)));

        if (timeHour.hour + i + j === dt.local().hour) $(rowArray[i]).addClass("present");
        else if (timeHour.hour + i + j > dt.local().hour) $(rowArray[i]).addClass("future");
        else $(rowArray[i]).addClass("past");
    }

    function scrollDown() {
        if (lockToggle) return false;
        position--; 
        $(rowArray[rowArray.length - 1]).remove();
        prependRow(position);
        rowArray = $(".row");
        rowChildren(rowArray[0]);
        formatRow(0, position);
        setEventHandler(rowArray);
    }

    function scrollUp() {
        if (lockToggle) return false;
        position++; 
        $(rowArray[0]).remove();
        appendRow(position + rowArray.length - 1);
        rowArray = $(".row");
        rowChildren(rowArray[rowArray.length - 1]);
        formatRow(rowArray.length - 1, position);
        setEventHandler(rowArray);
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
        let timeKeyTemp = '<div class="d-inline-flex col-2 col-sm-1 locked rpmx"></div>'
        let saveButton = '<div class="d-inline-flex d-none col-2 col-sm-1 btn btn-primary align-items-center justify-content-center unlocked rpmx">Save Entry</div>'
        let entryField = '<textarea class="d-inline-flex col-10 col-sm-11 entry rpmx" rows="3" disabled></textarea>'
        let timeKeyPara = '<p class="d-inline-flex timeKey text-center align-items-center m-0"></p>'
        $(timeKeyTemp).appendTo(rowsToAppend).append(timeKeyPara);
        $(saveButton).appendTo(rowsToAppend);
        $(entryField).appendTo(rowsToAppend);
    };

    function lockAllEntries() {
        $(".locked").removeClass("d-none");
        $(".unlocked").addClass("d-none");
        $(".entry").prop("disabled", true);
    }

    function setEventHandler(rows) {
        $(rows).on('click', function(event) {
            let _this = this;
            let rowID = $(_this).attr("id");
            let saveButton = $(_this).children(".unlocked").eq(0);
            let timeKey = $(_this).children(".locked").eq(0);
            let textArea = $(_this).children(".entry").eq(0);

            if ($(_this).hasClass('past') || $(_this).hasClass('present')) {
                return false;

            } else if (!lockToggle && $(event.target).hasClass('entry')) {
                    lockToggle = true;

                    lockAllEntries();

                    $(_this).removeClass("future");
                    $(textArea).prop("disabled", false);
                    $(saveButton).removeClass("d-none");
                    $(timeKey).addClass("d-none");
                    textArea.focus();
        
                    } else if (lockToggle && $(event.target).hasClass('unlocked')) {
                        $(_this).addClass("future");
                        localStorage.setItem(rowID, JSON.stringify($(textArea).val()));
                        lockAllEntries();
                        lockToggle = false;
        
                    } else { return false };
        });
        
    }

});


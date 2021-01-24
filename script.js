$(document).ready(function() {
 
    // Initial Variables
    const dt = luxon.DateTime;
    let lockToggle = false;
    let position = 0;
    let scheduleStart = $("#schedule");

    // Available screen height.
    const screenHeight = screen.availHeight;

    // Only few enough rows that the current screen can display are created based off of element sizes and available screen height.
    const rowCount = Math.floor((screenHeight - 166.7)/80)

    // Initialize Row Collection and Start Clock.
    let rowArray = init();

    // Other Collections.
    let entryArray = $(".entry");
    let timeArray = $(".timeKey");
    let buttonArray = $(".unlocked");
    
    // Current Time to the Hour.
    let timeHour = dt.local().set({hour: dt.local().hour, minute: "0", second: "0"});

    // Format freshley created rows elements.
    for(let i = 0; i < rowArray.length; i++) {
        formatRow(i, 0);
    }

    // Set the Event Handlers for the initial set of rows.
    setEventHandler(rowArray);

    // Available keyboard events (Mousewheel and Arrow Keys work counterintuitively. Hence, why Down Arrow calls Scroll Up... etc.):
    $(document).on("keydown", function(event) {

        switch(true) {
            // Down Arrow: Scroll Down
            case event.keyCode === 40:
                scrollUp();
            break;

            // Up Arrow: Scroll Up
            case event.keyCode === 38:
                scrollDown();
            break;

            // Home Button: Return to Current Time
            case event.keyCode === 36:
                $(".row").remove();
                rowArray = init();
                timeHour = dt.local().set({hour: dt.local().hour, minute: "0", second: "0"});
                for(let i = 0; i < rowArray.length; i++) {
                    formatRow(i, 0);
                }
                setEventHandler(rowArray);
            break;

            // Page Up button: Scroll Up by a full page.
            case event.keyCode === 33:
                for(i = 0; i < rowCount - 1; i++) scrollDown();
            break;

            // Page Down button: Scroll Down by a full page.
            case event.keyCode === 34:
                for(i = 0; i < rowCount - 1; i++) scrollUp();
            break;
        }

    });

    // Mouse Wheel Events. Scroll through time entries. (Code taken from a solution on Stack Overflow.)
    $("#schedule").on('wheel', function(event) {

        let delta = event.originalEvent.deltaY;
      
        // going down
        if (delta < 0) {
            scrollDown();
        }
        // going up
        else {
            scrollUp();
        };

        return false;
      });


    // Initialize Function: Start clock and create initial set of rows.
    function init() {
        let dtInit = dt.local().weekdayLong + ", " + dt.local().toLocaleString(dt.DATETIME_MED_WITH_SECONDS);
        let dtDisplay = $("#currentDay");

        // Create rows.
        for(let i = 0; i < rowCount - 1; i++) {
            appendRow(i);
        }

        let rowArray = $(".row");

        // Create Row children objects.
        rowChildren(rowArray);

        dtDisplay.text(dtInit);

        // Create clock.
        let displayClock = setInterval (function() {
            dtDisplay.text(dtInit);
            dtInit = dt.local().weekdayLong  + ", " + dt.local().plus({seconds: 1}).toLocaleString(dt.DATETIME_MED_WITH_SECONDS);
        }, 1000);

        return rowArray;
    }

    // Format the rows: Past/present/future. Load local data into rows as they are created.
    function formatRow(i, j) {

        rowArray = $(".row");
        entryArray = $(".entry");
        timeArray = $(".timeKey");
        
        $(timeArray[i]).text(timeHour.plus({hours: i + j}).toLocaleString(dt.DATE_SHORT) +"\n" + timeHour.plus({hours: i + j}).toLocaleString(dt.TIME_SIMPLE));

        let storageID = $(timeArray[i]).text();
        $(entryArray[i]).val(JSON.parse(localStorage.getItem(storageID)));

        if (timeHour.hour + i + j === dt.local().hour) $(rowArray[i]).addClass("present");
        else if (timeHour.hour + i + j > dt.local().hour) $(rowArray[i]).addClass("future");
        else $(rowArray[i]).addClass("past");
    }

    // Scroll Down towards future events.
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

    // Scroll up towards past events.
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

    // Append a 'future' row.
    function appendRow(index) {
        let rowTemp = '<div id="#entry_' + index + '" class="row"></div>' 
        $(scheduleStart).append(rowTemp);
    }

    // Prepend a 'past' row.
    function prependRow(index) {
        let rowTemp = '<div id="#entry_' + index + '" class="row"></div>' 
        $(scheduleStart).prepend(rowTemp);
    }

    // Append all child objects necessary to rows.
    function rowChildren(rowsToAppend) {
        let timeKeyTemp = '<div class="d-inline-flex justify-content-center col-4 col-md-3 col-lg-1 locked rpmx"></div>'
        let saveButton = '<div class="d-inline-flex d-none col-4 col-md-3 col-lg-1 btn btn-primary align-items-center justify-content-center unlocked rpmx">Save Entry</div>'
        let entryField = '<textarea class="d-inline-flex col-8 col-md-9 col-lg-11 entry rpmx" rows="3" disabled></textarea>'
        let timeKeyPara = '<p class="d-inline-flex timeKey text-center align-items-center m-0"></p>'
        $(timeKeyTemp).appendTo(rowsToAppend).append(timeKeyPara);
        $(saveButton).appendTo(rowsToAppend);
        $(entryField).appendTo(rowsToAppend);
    };

    // Locks all entries to editting.
    function lockAllEntries() {
        $(".locked").removeClass("d-none");
        $(".unlocked").addClass("d-none");
        $(".entry").prop("disabled", true);
    }

    // Sets event handlers for rows as they are created.
    function setEventHandler(rows) {
        $(rows).on('click', function(event) {
            let _this = this;
            let saveButton = $(_this).children(".unlocked").eq(0);
            let timeKey = $(_this).children(".locked").eq(0);
            let storageID = $(timeKey).text();
            console.log(storageID);
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
                        localStorage.setItem(storageID, JSON.stringify($(textArea).val()));
                        lockAllEntries();
                        lockToggle = false;
        
                    } else { return false };
        });
        
    }

});


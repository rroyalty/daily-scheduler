$(document).ready(function() {
 
    // Initial Variables
    const dt = luxon.DateTime;
    // Available screen height.
    const screenHeight = screen.availHeight;
    // Only few enough rows that the current screen can display are created based off of element sizes and available screen height.
    const rowCount = Math.floor((screenHeight - 166.7)/80)

    let lockToggle = false;
    let scheduleStart = $("#schedule");

    let rowArray = $(".row");
    let entryArray = $(".entry");
    let timeArray = $(".timeKey");
    let buttonArray = $(".unlocked");

    // Current Time to the Hour
    let rfHour = dt.local().set({hour: dt.local().hour, minute: "0", second: "0"});
    let rlHour = dt.local().set({hour: dt.local().hour, minute: "0", second: "0"});
    let nowHour = dt.local().set({hour: dt.local().hour, minute: "0", second: "0"});

    // Current Time and Day, Human Readable.
    let dtInit = dt.local().weekdayLong + ", " + dt.local().toLocaleString(dt.DATETIME_MED_WITH_SECONDS);

    // UI Time/Day Display Element
    let dtDisplay = $("#currentDay");

    // Create clock.
    let displayClock = setInterval (function() {
        dtDisplay.text(dtInit);
        dtInit = dt.local().weekdayLong  + ", " + dt.local().plus({seconds: 1}).toLocaleString(dt.DATETIME_MED_WITH_SECONDS);
    }, 1000);

    // Create initial Rows.
    for(let i = 0; i < rowCount - 1; i++) {
        appendRow(i);
        rfHour = nowHour;
        rowArray = $('.row');
        rowChildren(rowArray[i]);
        formatRow(i, 1);
    }

    // Set Timestamp of Last Row.
    rlhour = rlHour.plus({hours: rowArray.length - 1});

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
                location.reload();
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

    // Format the rows: Past/present/future. Load local storage data into rows as they are created.
    function formatRow(i, j) {

        rowArray = $(".row");
        entryArray = $(".entry");
        timeArray = $(".timeKey");
        
        if (j===1) $(timeArray[i]).text(rlHour.toLocaleString(dt.DATE_SHORT) +"\n" + rlHour.toLocaleString(dt.TIME_SIMPLE));
        else if (j===-1) $(timeArray[i]).text(rfHour.toLocaleString(dt.DATE_SHORT) +"\n" + rfHour.toLocaleString(dt.TIME_SIMPLE));
        else alert("error formatting rows.");

        let storageID = $(timeArray[i]).text();
        $(entryArray[i]).val(JSON.parse(localStorage.getItem(storageID)));

        if (String(rfHour.ts).slice(0, -3) === String(nowHour.ts).slice(0, -3)) $(rowArray[i]).addClass("present");
        else if (rfHour.ts > nowHour.ts) $(rowArray[i]).addClass("future");
        else $(rowArray[i]).addClass("past");

        if (rfHour.hour === 17) $(rowArray[i]).addClass("bottomBorder");
    }

    // Scroll Down towards future events.
    function scrollDown() {
        if (lockToggle) return false;
        $(rowArray[rowArray.length - 1]).remove();
        prependRow();
        rowArray = $(".row");
        rowChildren(rowArray[0]);
        formatRow(0, -1);
        setEventHandler(rowArray);
    }

    // Scroll up towards past events.
    function scrollUp() {
        if (lockToggle) return false;
        $(rowArray[0]).remove();
        appendRow();
        rowArray = $(".row");
        rowChildren(rowArray[rowArray.length - 1]);
        formatRow(rowArray.length - 1, 1);
        setEventHandler(rowArray);
    }

    // Append a 'future' row.
    function appendRow() {
        if (rlHour.hour === 17) {
            rfhour = rfHour.plus({hours: 16});
            rlhour = rlHour.plus({hours: 16});
        } else {
            rfhour = rfHour.plus({hours: 1});
            rlhour = rlHour.plus({hours: 1});
        }
        let rowTemp = '<div class="row"></div>'
        $(scheduleStart).append(rowTemp);
    }

    // Prepend a 'past' row.
    function prependRow() {
        if (rfHour.hour === 9) {
            rfhour = rfHour.minus({hours: 16});
            rlhour = rlHour.minus({hours: 16});
        } else {
            rfhour = rfHour.minus({hours: 1});
            rlhour = rlHour.minus({hours: 1});
        }
        let rowTemp = '<div class="row"></div>'
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

        // On click text box, allow user to edit text and disable navigation until row is locked again. Only future rows may be editted.
        $(rows).on('click', function(event) {
            let _this = this;
            let saveButton = $(_this).children(".unlocked").eq(0);
            let timeKey = $(_this).children(".locked").eq(0);
            let storageID = $(timeKey).text();
            let textArea = $(_this).children(".entry").eq(0);

            // Only future rows may be editted.
            if ($(_this).hasClass('past') || $(_this).hasClass('present')) {
                return false;

            // Enable textbox and disable navigation.
            } else if (!lockToggle && $(event.target).hasClass('entry')) {
                    lockToggle = true;

                    lockAllEntries();

                    $(_this).removeClass("future");
                    $(textArea).prop("disabled", false);
                    $(saveButton).removeClass("d-none");
                    $(timeKey).addClass("d-none");
                    textArea.focus();
        
                    // Lock the current row to editting and commit the changes to storage.
                    } else if (lockToggle && $(event.target).hasClass('unlocked')) {
                        $(_this).addClass("future");
                        localStorage.setItem(storageID, JSON.stringify($(textArea).val()));
                        lockAllEntries();
                        lockToggle = false;
        
                    } else { return false };
        });
        
    }

});


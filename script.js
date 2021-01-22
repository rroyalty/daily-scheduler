$(document).ready(function() {

    const dt = luxon.DateTime;

    init();


    function init() {
        let dtInit = dt.local().toLocaleString(dt.DATETIME_MED_WITH_SECONDS);
        let dtDisplay = $("#currentDay");
        dtDisplay.text(dtInit);

        setInterval (function() {
            dtDisplay.text(dtInit);
            dtInit = dt.local().plus({seconds: 1}).toLocaleString(dt.DATETIME_MED_WITH_SECONDS);
        }, 1000);
    }

});
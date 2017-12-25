import "../css/contentScript.css";

import chrono from 'chrono-node'
import moment from 'moment'

$(document.body).bind('mouseup', function(e){
    let selection;

    if (window.getSelection) {
        selection = window.getSelection();
    } else if (document.selection) {
        selection = document.selection.createRange();
    }

    let selectionString = selection.toString()

    if (selectionString !== '' && confirm(selectionString)) {
        const parsedDate = chrono.parseDate(selectionString);

        if (parsedDate) {
            const dates = moment(parsedDate).format('YMDTHmmss[Z]') + '/' + moment(parsedDate).add(30, 'minutes').format('YMDTHmmss[Z]')
            window.open('https://calendar.google.com/calendar/r/eventedit?' + $.param({
                dates,
                details: '',
                location: '',
                text: selectionString,
                trp: false,
            }), '_blank');
        }
    }
});
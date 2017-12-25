import "../css/contentScript.css";

$(document.body).bind('mouseup', function(e){
    let selection;

    if (window.getSelection) {
        selection = window.getSelection();
    } else if (document.selection) {
        selection = document.selection.createRange();
    }

    let selectionString = selection.toString()

    if (selectionString !== '' && confirm(selectionString)) {
        window.open('https://calendar.google.com/calendar/r/eventedit?' + $.param({
            dates: '20141106T120000Z/20141106T120000Z',
            details: '',
            location: '',
            text: selectionString,
            trp: false,
        }), '_blank');
    }
});
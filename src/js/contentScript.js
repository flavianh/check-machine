import "../css/contentScript.css";

$(document.body).bind('mouseup', function(e){
    let selection;

    if (window.getSelection) {
        selection = window.getSelection();
    } else if (document.selection) {
        selection = document.selection.createRange();
    }

    let selectionString = selection.toString()

    if (selectionString !== '') {
        confirm(selectionString);
    }
});
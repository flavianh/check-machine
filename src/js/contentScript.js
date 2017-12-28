import '../css/contentScript.css';

import chrono from 'chrono-node'
import moment from 'moment'
import request from 'superagent'
import storageGet from './services/storage'


$(document.body).bind('mouseup', async (e) => {
    const token = await storageGet('trello_token')
    let selection;

    if (window.getSelection) {
        selection = window.getSelection();
    } else if (document.selection) {
        selection = document.selection.createRange();
    }

    let selectionString = selection.toString()

    if (selectionString !== '') {
        let parsedDate = chrono.parseDate(selectionString, new Date(), {forwardDate: true});

        if (parsedDate) {
            parsedDate = moment(parsedDate)
            const dates = parsedDate.format('YMDTHmmss[Z]') + '/' + parsedDate.add(30, 'minutes').format('YMDTHmmss[Z]')
            const key = '300140c4a5500bad38c27a4844d7355c';

            chrome.runtime.sendMessage({
                type: 'basic',
                iconUrl: 'icon-34.png',
                title: 'Sent to Trello list',
                message: `with due date set to ${parsedDate.format('LLL')}`
            });

            request
                .post('https://api.trello.com/1/cards')
                .query({
                    key,
                    token,
                    name: selectionString,
                    pos: 'top',
                    idList: '57fe251b191208b9390ace4c',
                    due: parsedDate.toString()
                })
                .end();

            // window.open('https://calendar.google.com/calendar/r/eventedit?' + $.param({
            //     dates,
            //     details: '',
            //     location: '',
            //     text: selectionString,
            //     trp: false,
            // }), '_blank');
        }
    }
});
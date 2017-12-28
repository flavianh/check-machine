import '../css/contentScript.css';

import _ from 'lodash'
import chrono from 'chrono-node'
import moment from 'moment'
import {storageGet} from './services/storage'
import {createCard} from './services/trelloServices'


$(document.body).bind('mouseup', async (e) => {
    const token = await storageGet('token');
    const list = await storageGet('list');
    let selection;

    if (window.getSelection) {
        selection = window.getSelection();
    } else if (document.selection) {
        selection = document.selection.createRange();
    }

    let selectionString = selection.toString()

    if (selectionString !== '') {
        if (_.isEmpty(list)) {
            chrome.runtime.sendMessage({
                type: 'basic',
                iconUrl: 'icon-34.png',
                title: 'You have to define a Trello list',
                message: 'Please right click on the extension \'s icon and select "options"'
            });
        }

        let parsedDate = chrono.parseDate(selectionString, new Date(), {forwardDate: true});

        if (parsedDate) {
            parsedDate = moment(parsedDate)
            const dates = parsedDate.format('YMDTHmmss[Z]') + '/' + parsedDate.add(30, 'minutes').format('YMDTHmmss[Z]')

            await createCard(token, list, selectionString, parsedDate.toString())

            chrome.runtime.sendMessage({
                type: 'basic',
                iconUrl: 'icon-34.png',
                title: 'Sent to Trello list',
                message: `with due date set to ${parsedDate.format('LLL')}`
            });

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
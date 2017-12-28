import '../img/icon-128.png'
import '../img/icon-34.png'

chrome.runtime.onMessage.addListener((notification) => {
    chrome.notifications.create(notification);
});
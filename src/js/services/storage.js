export default function storageGet(key) {
    return new Promise(resolve => {
        chrome.storage.sync.get(key, (items) => {
            resolve(items[key])
        });
    });
}
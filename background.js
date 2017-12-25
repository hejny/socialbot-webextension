chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
    browser.pageAction.show(tabId);
}
});

browser.pageAction.onClicked.addListener(function(tab) {
    browser.tabs.sendMessage(tab.id, 'socialbot');
});

/*
setTimeout(()=>{
    browser.tabs.sendMessage(tab.id, 'socialbot');
},500);
*/
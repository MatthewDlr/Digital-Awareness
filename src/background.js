console.log("Service worker works!")

chrome.webNavigation.onCompleted.addListener(function(details) {
    let hostname = new URL(details.url).hostname;

    if (hostname) {
        console.log("Navigated to: " + hostname);
    }

    if (hostname == "www.youtube.com") {
        console.log("GOTCHA");
        let redirectUrl = chrome.runtime.getURL('index.html#popup');
        chrome.tabs.update(details.tabId, {url: redirectUrl});
    }
}); 


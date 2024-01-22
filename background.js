function switchTabs() {
    chrome.windows.create({state: "fullscreen"}, function(win) {
        chrome.storage.sync.get(['urls'], function(result) {
            const urls = result.urls || ['https://www.managebac.com'];
            urls.forEach((url, index) => {
                if(index == 0) {
                    // Update the initial tab created with the window
                    chrome.tabs.update(win.tabs[0].id, {url: url});
                } else {
                    // Create new tabs in the same window
                    chrome.tabs.create({windowId: win.id, url: url});
                }
            });
  
            // Close all other windows
            chrome.windows.getAll(function(wins) {
                for(let i = 0; i < wins.length; i++) {
                    if(wins[i].id != win.id) {
                        chrome.windows.remove(wins[i].id);
                    }
                }
            });
        });
    });
}

chrome.action.onClicked.addListener((tab) => {
    switchTabs();
});
  
chrome.commands.onCommand.addListener(function(command) {
    if (command === "switch_tabs") {
      switchTabs();
    }
});




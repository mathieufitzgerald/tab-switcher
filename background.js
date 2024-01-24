function handlePreviousWindows(currentWinId) {
    chrome.storage.sync.get(['closeOrMinimize'], function(result) {
      const shouldMinimize = result.closeOrMinimize || false;
      chrome.windows.getAll({ populate: true }, function(windows) {
        windows.forEach(function(window) {
          if (window.id !== currentWinId) {
            if (shouldMinimize) {
              chrome.windows.update(window.id, { state: 'minimized' });
            } else {
              chrome.windows.remove(window.id);
            }
          }
        });
      });
    });
}

// Updated switchTabs function
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
  
        // Handle previous windows based on user preference
        handlePreviousWindows(win.id);
      });
    });
}

// Listener for the extension icon click
chrome.action.onClicked.addListener((tab) => {
    switchTabs();
});

chrome.commands.onCommand.addListener(function(command) {
    if (command === "switch_tabs") {
      switchTabs();
    }
});
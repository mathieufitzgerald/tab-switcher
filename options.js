document.getElementById('save').addEventListener('click', () => {
  let url = document.getElementById('url').value;
  if(!url.startsWith('http://') && !url.startsWith('https://')) {
    if(!url.startsWith('www.')) {
      url = 'https://www.' + url;
    } else {
      url = 'https://' + url;
    }
  }
  chrome.storage.sync.get(['urls'], function(result) {
    const urls = result.urls || [];
    urls.push(url);
    chrome.storage.sync.set({urls: urls}, function() {
      console.log('URLs are saved');
      displaySavedUrls();
    });
  });
});

function removeUrl(urlToRemove) {
  chrome.storage.sync.get(['urls'], function(result) {
    let urls = result.urls || [];
    urls = urls.filter(url => url !== urlToRemove);
    chrome.storage.sync.set({urls: urls}, function() {
      console.log('URLs are saved');
      displaySavedUrls();
    });
  });
}

function displaySavedUrls() {
  chrome.storage.sync.get(['urls'], function(result) {
    const urls = result.urls || [];
    const savedUrlsDiv = document.getElementById('saved-urls');
    savedUrlsDiv.innerHTML = '';
    urls.forEach((url) => {
      const listItem = document.createElement('li');
      listItem.className = "list-group-item d-flex justify-content-between align-items-center";
      listItem.textContent = url;
      
      const removeButton = document.createElement('button');
      removeButton.className = "btn btn-danger btn-sm";
      removeButton.textContent = 'x';
      removeButton.addEventListener('click', () => {
        removeUrl(url);
      });
      
      listItem.appendChild(removeButton);
      savedUrlsDiv.appendChild(listItem);
    });
    
    document.getElementById('url').value = '';
  });
}  

// Add event listener for the new 'Minimize previous windows instead of closing' checkbox
document.getElementById('closeOrMinimize').addEventListener('change', function() {
  const shouldMinimize = document.getElementById('closeOrMinimize').checked;
  chrome.storage.sync.set({ closeOrMinimize: shouldMinimize }, function() {
    console.log('Preference is set to ' + shouldMinimize);
  });
});

// Load the saved 'Minimize or Close' preference when the options page is opened
document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.sync.get(['closeOrMinimize'], function(result) {
    document.getElementById('closeOrMinimize').checked = result.closeOrMinimize || false;
  });
  displaySavedUrls(); // Ensure saved URLs are displayed when page loads
});

// Save the key bind preferences
document.getElementById('windowsKeybind').addEventListener('change', function() {
  const windowsKeybind = document.getElementById('windowsKeybind').value;
  chrome.storage.sync.set({ windowsKeybind: windowsKeybind }, function() {
    console.log('Windows keybind is set to ' + windowsKeybind);
  });
});

document.getElementById('macKeybind').addEventListener('change', function() {
  const macKeybind = document.getElementById('macKeybind').value;
  chrome.storage.sync.set({ macKeybind: macKeybind }, function() {
    console.log('Mac keybind is set to ' + macKeybind);
  });
});

// Load the saved key bind preferences when the options page is opened
document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.sync.get(['windowsKeybind', 'macKeybind'], function(result) {
    document.getElementById('windowsKeybind').value = result.windowsKeybind || 'Ctrl+Shift+T';
    document.getElementById('macKeybind').value = result.macKeybind || 'Command+Shift+T';
  });
});

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
  // Display saved URLs on page load
  displaySavedUrls();
  
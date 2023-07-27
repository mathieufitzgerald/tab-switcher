document.getElementById('open-managebac').addEventListener('click', () => {
    chrome.runtime.sendMessage({command: "open-managebac"}, function(response) {});
  });
  
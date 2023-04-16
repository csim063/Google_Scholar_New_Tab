// Add event listeners for the login button, search terms input field, and results number input field
document.getElementById('login-button').addEventListener('click', loginWithGoogle);
document.getElementById('search-terms').addEventListener('change', saveSettings);
document.getElementById('results-number').addEventListener('change', saveSettings);

// Implement the loginWithGoogle and saveSettings functions as previously defined
// ...

// Retrieve the search terms and results number when the popup is opened
chrome.storage.sync.get(['searchTerms', 'resultsNumber'], (data) => {
  if (data.searchTerms) {
    document.getElementById('search-terms').value = data.searchTerms;
  }
  if (data.resultsNumber) {
    document.getElementById('results-number').value = data.resultsNumber;
  }
});

// Add event listener for the open tab button
document.getElementById('open-tab-button').addEventListener('click', openScholarTab);

function openScholarTab() {
  chrome.storage.sync.get(['searchTerms', 'resultsNumber'], (data) => {
    if (data.searchTerms) {
      chrome.tabs.create({ url: 'loading.html' }, (tab) => {
        // Wait for the new tab to finish loading before injecting the content script
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
          if (tabId === tab.id && changeInfo.status === 'complete') {
            chrome.tabs.onUpdated.removeListener(listener);

            // Inject the content script and send a message to fetch the search result
            chrome.tabs.executeScript(tab.id, { file: 'scholar.js' }, () => {
              chrome.tabs.sendMessage(tab.id, {
                action: 'fetchAbstract',
                query: data.searchTerms,
                resultIndex: 0, // Replace this with a dynamic result index
              });
            });
          }
        });
      });
    }
  });
}

// Add a message listener for the newTabOpened action
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'newTabOpened') {
    openScholarTab();
  }
});

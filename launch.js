document.getElementById('launch-new-tab').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'open_new_tab' });
  });  
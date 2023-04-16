document.getElementById('login-button').addEventListener('click', loginWithGoogle);

function loginWithGoogle() {
  // Implement the Google authentication logic here
}

document.getElementById('results-number').addEventListener('change', saveSettings);

function saveSettings() {
  const resultsNumber = document.getElementById('results-number').value;
  chrome.storage.sync.set({ resultsNumber: resultsNumber }, () => {
    document.getElementById('status').innerText = 'Settings saved';
    setTimeout(() => {
      document.getElementById('status').innerText = '';
    }, 3000);
  });
}

chrome.storage.sync.get('resultsNumber', (data) => {
  if (data.resultsNumber) {
    document.getElementById('results-number').value = data.resultsNumber;
  }
});
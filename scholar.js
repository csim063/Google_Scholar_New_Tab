chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fetchAbstract') {
      fetchAbstract(request.query, request.resultIndex)
        .then((data) => sendResponse({ status: 'success', data: data }))
        .catch((error) => sendResponse({ status: 'error', error: error }));
      return true;
    }
  });
  
  async function fetchAbstract(query, resultIndex) {
    const searchUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}&start=${resultIndex}`;
    const response = await fetch(searchUrl);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
  
    const searchResult = doc.querySelector('.gs_ri');
    if (!searchResult) {
      throw new Error('No search result found');
    }
  
    const title = searchResult.querySelector('h3').innerText;
    const authors = searchResult.querySelector('.gs_a').innerText;
    const abstract = searchResult.querySelector('.gs_rs').innerText;
    const url = searchResult.querySelector('h3 a').href;
  
    return { title, authors, abstract, url };
  }
  
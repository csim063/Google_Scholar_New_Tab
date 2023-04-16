chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fetchAbstract') {
      fetchAbstract(request.query, request.resultIndex)
        .then((data) => {
          displaySearchResult(data);
          sendResponse({ status: 'success', data: data });
        })
        .catch((error) => sendResponse({ status: 'error', error: error }));
      return true;
    }
  });
  
  function fetchAbstract(query, resultIndex) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(
          `https://scholar.google.com/scholar?hl=en&q=${encodeURIComponent(query)}`,
          {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
            },
          }
        );
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
  
        // Extract the search result data
        const result = extractSearchResultData(doc, resultIndex);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }
  
  function extractSearchResultData(doc, resultIndex) {
    const resultElement = doc.querySelectorAll('.gs_r.gs_or.gs_scl')[resultIndex];
  
    const title = resultElement.querySelector('.gs_rt a').innerText;
    const authors = resultElement.querySelector('.gs_a').innerText;
    const abstract = resultElement.querySelector('.gs_rs').innerText;
    const url = resultElement.querySelector('.gs_rt a').href;
  
    return { title, authors, abstract, url };
  }
  
  function displaySearchResult(result) {
    const title = document.createElement('h1');
    title.innerText = result.title;
    document.body.appendChild(title);
  
    const authors = document.createElement('h2');
    authors.innerText = result.authors;
    document.body.appendChild(authors);
  
    const abstract = document.createElement('p');
    abstract.innerText = result.abstract;
    document.body.appendChild(abstract);
  
    const link = document.createElement('a');
    link.href = result.url;
    link.innerText = 'View original';
    link.target = '_blank';
    document.body.appendChild(link);
  }
  
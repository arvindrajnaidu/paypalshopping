import ext from "./utils/ext";

chrome.devtools.network.onRequestFinished.addListener(request => {
  request.getContent((body) => {
    if (request.request && request.request.url) {
      document.write(request.request.url)
      ext.runtime.sendMessage('URL', request.request.url);
      if (request.request.url.includes('https')) {
      	// document.write(body)
      	let matches = body.match(/EC-(\d*[A-Z]*){17}/)
      	if (matches.length > 0) {
      		document.write(matches)
      	}

      	// let clientIdMatches = body.match(/clientId/)
      	// if (clientIdMatches.length > 0) {
      	// 	document.write(body)
      	// }
        // chrome.runtime.sendMessage({
        //     response: body
        // });
      } else {
      	// document.write('BAR<<<<')
      }
    }
  });
});
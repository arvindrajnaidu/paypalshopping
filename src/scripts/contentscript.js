import ext from "./utils/ext"
import {deals} from "../data/deals.json"

var extractTags = () => {
  var url = document.location.hostname.replace('www.', '')

  let matchedDeal = deals.filter((deal) => url.indexOf(deal.domain) > -1)

  if (matchedDeal.length > 0) {
    return matchedDeal[0]
  }
  return
}

function onRequest(request, sender, sendResponse) {
  if (request.action === 'process-page') {
    sendResponse(extractTags())
  }
}

ext.runtime.onMessage.addListener(onRequest);


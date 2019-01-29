const rawOffers = require('./offers.json')
const fs = require('fs')
const URL = require('url')
const serial = require('./serial')

const axios = require('axios')
const fetch = require('node-fetch')
const Promise = require('bluebird')

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const offers = rawOffers.offers_data.allOffers.results.map((res) => ({
  url: res.content[0].offer_url,
  logoUrl: res.content[0].logo_url,
  name: res.content[0].merchant_name,
  title: res.content[0].title
}))

// const offers = [{
//   url: 'http://www.pntrac.com/t/RkFHRUZKR0dBR0lIRURBTURKSUQ'
// }]

//'http://www.pjtra.com/t/RkFGTEdERERBR0lIRURBS0hNSUo', 'http://www.pntrac.com/t/RkFHRUZKR0dBR0lIRURBTURKSUQ'
const weirdList = []

Promise.mapSeries(offers, (offer) => {
  console.log(`Fetching ${offer.url}`)
  if (weirdList.indexOf(offer.url) > -1) {
    return 'weird.com'
  }
  return axios.get(offer.url, {
    timeout: 10000,
    // headers: {
    //   // 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3583.0 Safari/537.36'
    // },
    maxRedirects: 10
  }).then((r) => {
    const domain = URL.parse(r.request.res.responseUrl).hostname.replace(/^[^.]+\./g, "")
    return Object.assign(offer, { domain: domain })
  }).catch((e) => {
    return Object.assign(offer, { domain: 'www.google.com' })
  })
}).then((results) => {
  fs.writeFileSync('deals.json', JSON.stringify({deals: results}))
})

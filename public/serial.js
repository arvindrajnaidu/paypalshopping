const axios = require('axios')
const fetch = require('node-fetch')
const Promise = require('bluebird')

let q = []
const serial = {
  concat: (urls) => {
    q = q.concat(urls)
    // console.log(q.length)
  },
  next: () => {
    console.log(`Remaining ${q.length}`)
    let url = q.pop()
    console.log(`Processing ${url}`)
    return fetch(url, {
      timeout: 10000,
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3583.0 Safari/537.36'
      },
    })
      .then((r) => {
        // console.log(r.)
        return Promise.resolve(r.url)
      })
      .catch((e) => {
        console.log(`Error ${url}`)
        return Promise.resolve('www.google.com')
      })
  },
  start: (retArr = []) => {
    return new Promise ((resolve, reject) => {
      
      console.log(`Remaining ${q.length}`)
      let url = q.pop()
      console.log(`Processing ${url}`)

      fetch(url, {
        timeout: 5000,
        headers: {
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3583.0 Safari/537.36'
        },
      })
        .then((r) => {
          // console.log(r.)
          return Promise.resolve(r.url)
        })
        .catch((e) => {
          console.log(`Error ${url}`)
          return Promise.resolve('www.google.com')
        })
      serial.next()
        .then((url) => {
          retArr.push(url)
          console.log(q.length)
          if (q.length > 0) {
            serial.start(retArr)
          } else {
            // console.log(retArr)
            return resolve(retArr)
          }
        }).catch((e) => {
          console.log(e)
        })
    })
  }
}

module.exports = serial

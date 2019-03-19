import ext from "./utils/ext"

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById('xo').addEventListener('click', () => {
    ext.tabs.query({active: true, currentWindow: true}, function(tabs) {
      ext.tabs.sendMessage(tabs[0].id, {action: "getECToken"}, ({ecToken}) => {
        fetch(`https://www.paypal.com/shoplist/xo/approve?ecToken=${ecToken}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(function(response) {
            return response.json()
        })
        .then(function(data) {
          console.log(data, 'Approved')
          data.intent = 'sale'
          data.extAction = 'approve'
          ext.tabs.sendMessage(tabs[0].id, data, () => {
          })
        })
        .catch(console.log)
      })
    })  
  })  
})

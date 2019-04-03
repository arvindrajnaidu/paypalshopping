import ext from "./utils/ext"

const displayProfile = (payer) => {

  document.getElementById('profile').style.display = 'block'
  document.getElementById('profile_name').innerText = payer.shipping_address.recipient_name;
  document.getElementById('shipping-address').innerText = payer.shipping_address.line1;
  document.getElementById('profile-email').innerText = payer.email;

}

document.addEventListener("DOMContentLoaded", function() {
  let xoButton = document.getElementById('xo')
  let spinner = document.getElementById('spinner')
  xoButton.addEventListener('click', () => {
    spinner.style.display = 'block'
    xoButton.style.display = 'none'
    ext.tabs.query({active: true, currentWindow: true}, function(tabs) {
      ext.tabs.sendMessage(tabs[0].id, {action: "getECToken"}, ({ecToken}) => {
        fetch(`https://www.paypal.com/shoplist/xo/approve?ecToken=${ecToken}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(function(response) {
            return response.json()
        })
        .then(function(data) {
          console.log(data.payer.payer_info, 'Approved')
          data.intent = 'authorize'
          data.extAction = 'approve'
          let payerID = data.payer.payer_info.payer_id
          
          spinner.style.display = 'none'
          displayProfile(data.payer.payer_info)

          const payload = {
            extAction: 'approve',
            intent: 'authorize',
            orderID: data.id,
            paymentID: ecToken,
            payerID,
            paymentToken: data.id,
            returnUrl: `https://www.paypal.com/checkoutnow/error?paymentId=${ecToken}&token=${data.id}&PayerID=${payerID}`
          }
          
          ext.tabs.sendMessage(tabs[0].id, payload, () => {
          })
        })
        .catch(console.log)
      })
    })  
  })  
})

import ext from "./utils/ext";
// import storage from "./utils/storage";

var popup = document.getElementById("app");
// storage.get('color', function(resp) {
//   var color = resp.color;
//   if(color) {
//     popup.style.backgroundColor = color
//   }
// });

var template = (xoUrl) => {
  // var json = JSON.stringify(data);
  return (`
    <iframe src=${xoUrl} sandbox="allow-top-navigation"/>
  `);
}
var renderMessage = (ecToken) => {
  var displayContainer = document.getElementById("display-container");
  // let ecToken = 'EC-9M781524SP086554C'
  debugger
  // let xoUrl = `https://www.paypal.com/webapps/hermes?locale.x=en_US&fundingSource=paypal&env=production&fundingOffered=paypal&logLevel=warn&sdkMeta=eyJ1cmwiOiJodHRwczovL3d3dy5wYXlwYWxvYmplY3RzLmNvbS9hcGkvY2hlY2tvdXQubWluLmpzIn0%3D&version=min&token=${ecToken}`
  let xoUrl = `https://localhost.paypal.com:8000/webapps/hermes?locale.x=en_US&fundingSource=paypal&env=production&fundingOffered=paypal&logLevel=warn&sdkMeta=eyJ1cmwiOiJodHRwczovL3d3dy5wYXlwYWxvYmplY3RzLmNvbS9hcGkvY2hlY2tvdXQubWluLmpzIn0%3D&version=min&token=${ecToken}`
  // let xoUrl = `http://localhost.paypal.com:8000/webapps/hermes?ul=0&token=${ecToken}&loggernodeweb=1#/checkout/review`
  // http://localhost.paypal.com:8000/webapps/hermes?ul=0&token=EC-9M781524SP086554C&loggernodeweb=1#/checkout/review
  // https://www.msmaster.qa.paypal.com/webapps/hermes?ul=0&token=EC-9M781524SP086554C&loggernodeweb=1#/checkout/review
  // let xoUrl = `https://www.msmaster.qa.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=${ecToken}#/checkout/review`
  // EC-988472223L875241T

  // http://xotoolslvs01.qa.paypal.com/~dbrain/aries.cgi?stage=msmaster&hermes=1&local=1&ul=0   
  console.log(xoUrl, '<<<<')
  displayContainer.innerHTML = `<iframe src=${xoUrl} />`;
}

// var renderBookmark = (data) => {
//   var displayContainer = document.getElementById("display-container")
//   if(data) {
//     var tmpl = template(data);
//     EC-4JL84039RF204482P
//     displayContainer.innerHTML = tmpl;  
//   } else {
//     renderMessage("Sorry, could not find any deals.")
//   }
// }

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
    if (response.ecToken) {
      renderMessage(response.ecToken)  
    }
  });
});

// ext.tabs.query({active: true, currentWindow: true}, function(tabs) {
//   var activeTab = tabs[0];
//   chrome.tabs.sendMessage(activeTab.id, { action: 'process-page' }, renderBookmark);
// });

// popup.addEventListener("click", function(e) {
//   if(e.target && e.target.matches("#save-btn")) {
//     e.preventDefault();
//     var data = e.target.getAttribute("data-bookmark");
//     ext.runtime.sendMessage({ action: "perform-save", data: data }, function(response) {
//       if(response && response.action === "saved") {
//         renderMessage("Your bookmark was saved successfully!");
//       } else {
//         renderMessage("Sorry, there was an error while saving your bookmark.");
//       }
//     })
//   }
// });

// var optionsLink = document.querySelector(".js-options");
// optionsLink.addEventListener("click", function(e) {
//   e.preventDefault();
//   ext.tabs.create({'url': ext.extension.getURL('options.html')});
// })


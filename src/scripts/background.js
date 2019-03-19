import ext from "./utils/ext";

// ext.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     debugger
//   	console.log('>>>>> In Background', request, sender)
//     if(request.action === "perform-save") {
//       console.log("Extension Type: ", "/* @echo extension */");
//       console.log("PERFORM AJAX", request.data);

//       sendResponse({ action: "saved" });
//     }
//   }
// );

// ext.webRequest.onBeforeRequest.addListener(
//   function(details) { 
//     console.log('Cancelling')
//     return { cancel: true }; 
//   },
//   {
//     urls: ["*://www.paypal.com/*"]},
//   ["blocking"]
// );
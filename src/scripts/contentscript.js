import ext from "./utils/ext"

var port = ext.runtime.connect();

let ecToken
let merchantWin
let clientId

function onRequest(request, sender, sendResponse) {
	if (window.location === window.parent.location) {
		console.log(request, sender, ecToken, '<<<<<<<<<<<<<<<<<<<')
		if (request.action === 'getECToken') {
			sendResponse({ecToken})
			return false
		}	else if (request.extAction === 'approve') {
			delete request.extAction
			console.log(request, 'All the cool data')
			merchantWin.postMessage({ type: "PP_APPROVAL", data: request }, "*")
			return false
		}	
	}
	return true
}

const showXO = (data, sendApproval) => {
	const {payer_info} = data.payer
	let xoUrl = `https://www.paypal.com/webapps/hermes?locale.x=en_US&fundingSource=paypal&env=production&fundingOffered=paypal&logLevel=warn&sdkMeta=eyJ1cmwiOiJodHRwczovL3d3dy5wYXlwYWxvYmplY3RzLmNvbS9hcGkvY2hlY2tvdXQubWluLmpzIn0%3D&version=min&token=${ecToken}`
  	alerty.confirm(
	  `<div>
	  		Shipping to ${payer_info.shipping_address.line1}
	  </div>
	  <div>
	  		Shall we fast checkout?
	  </div>
	  `,
	  {
	  	title: `Hi ${payer_info.first_name}`,
	  	okLabel: 'Okay',
	  	cancelLabel: 'Not Now'
	  },
	  sendApproval
	)
}

const infiltrate = () => {
	var actualCode = '(' + function() {
			window._oldxprops = window.xprops;
			window.xprops.onAuthorize = function () {
				console.log(arguments, 'Args')
				window._oldxprops.onAuthorize.apply(this, arguments)
			}
	} + ')();';

	var script = document.createElement('script');
	script.textContent = actualCode;
	(document.head||document.documentElement).appendChild(script);
	script.remove();	
}

const getECToken = () => {
	var actualCode = '(' + function() {
	    window.xprops && window.xprops.payment()
	    	.then((ecToken) => {
	    		console.log(ecToken, 'ECTOKEN')
		 		var evt = document.createEvent("CustomEvent");
				evt.initCustomEvent("EC_TOKEN", true, true, ecToken);
				document.dispatchEvent(evt);
	    	})
	} + ')();';

	var script = document.createElement('script');
	script.textContent = actualCode;
	(document.head||document.documentElement).appendChild(script);
	script.remove();	
}

const setApproval = (data) => {
	var actualCode = `(function() {
	    window.xprops && window.xprops.onAuthorize(${data}, {
	    	payment: {
	    		get: () => {
	    			return new Promise(function(resolve) {
    					resolve(${data});
					});
	    		}
	    	}
	    })
	})();`;

	var script = document.createElement('script');
	script.textContent = actualCode;
	(document.head||document.documentElement).appendChild(script);
	script.remove();	
}

if (window.location.hostname.indexOf('www.paypal.com') > -1) {
	document.addEventListener('EC_TOKEN', (e) => {
	  var data = e.detail;
	  console.log("received " + data)
	  window.top.postMessage({ type: "ECTOKEN", ecToken: data }, "*")
	})

	window.addEventListener('message', (e) => {
		if (e.data && e.data.type === 'PP_APPROVAL') {
			setApproval(JSON.stringify(e.data.data))
		}
	})

	// infiltrate()
	getECToken()
} else if (window.top == window.self) {

	window.addEventListener('message', (e) => {
		if (e.data && e.data.type === 'ECTOKEN') {
			ecToken = e.data.ecToken
			merchantWin = e.source

			ext.runtime.sendMessage(
				{contentScriptQuery: 'approveEC', ecToken},
				data => {
					console.log(data, 'Approved')
					// data.intent = 'sale'
					// showXO(data, () => {
					// 	console.log('Posting Approval')
					// 	e.source.postMessage({ type: "PP_APPROVAL", data }, "*")
					// })
				});

			// fetch(`https://www.paypal.com/shoplist/xo/approve?ecToken=${ecToken}`, {
			// 	headers: {
			// 		'Content-Type': 'application/json'
			// 	}
			// })
			// .then(function(response) {
			// 		debugger
			// 		return response.json()
			// })
			// .then(function(data) {
			// 	console.log(data, 'Approved')
			// 	data.intent = 'sale'

			// 	showXO(data, () => {
			// 		console.log('Posting Approval')
			// 		e.source.postMessage({ type: "PP_APPROVAL", data }, "*")
			// 	})
			// })
			// .catch(console.log)
		} else if (e.data && e.data.type === 'CLIENTID') {
			clientId = e.data.clientId
			console.log('CLIENTID IS: ', clientId)
		}
	})
}

ext.runtime.onMessage.addListener(onRequest);

// ext.webRequest.onBeforeRequest.addListener(
//   function(details) { 
//     console.log('Cancelling')
//     return { cancel: true }; 
//   },
//   {
//     urls: ["*://www.paypal.com/*"
//   ]},
//   ["blocking"]
// );

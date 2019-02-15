import ext from "./utils/ext"

var port = ext.runtime.connect();

let ecToken
let clientId

function onRequest(request, sender, sendResponse) {
	console.log(request, sender, ecToken, '<<<<<<<<<<<<<<<<<<<')
	sendResponse({ecToken})
  	// if (request.action === 'process-page') {
   //  	sendResponse(extractTags())
  	// }
}

const showXO = (ecToken) => {
	let xoUrl = `https://localhost.paypal.com:8000/webapps/hermes?locale.x=en_US&fundingSource=paypal&env=production&fundingOffered=paypal&logLevel=warn&sdkMeta=eyJ1cmwiOiJodHRwczovL3d3dy5wYXlwYWxvYmplY3RzLmNvbS9hcGkvY2hlY2tvdXQubWluLmpzIn0%3D&version=min&token=${ecToken}`
	// let xoUrl = `https://www.paypal.com/webapps/hermes?locale.x=en_US&fundingSource=paypal&env=production&fundingOffered=paypal&logLevel=warn&sdkMeta=eyJ1cmwiOiJodHRwczovL3d3dy5wYXlwYWxvYmplY3RzLmNvbS9hcGkvY2hlY2tvdXQubWluLmpzIn0%3D&version=min&token=${ecToken}`
	// fetch(xoUrl)

	// document.createElement(`<iframe src=${xoUrl} />`)
	// var iframe = document.createElement('iframe');
	// iframe.src = xoUrl
	// document.body.appendChild(iframe);

  	// displayContainer.innerHTML = `<iframe src=${xoUrl} />`;



	alerty.toasts(`Hi Arvind, <a target="_blank" href="${xoUrl}"/>Checkout</a>  `, {
		bgColor: '#ccc', 
		fontColor: '#000',
		time: 30000
	}, function(){
		// alert('toasts callback')
	})
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

if (window.location.hostname.indexOf('.paypal.com') > -1) {
	document.addEventListener('EC_TOKEN', (e) => {
	  var data=e.detail;
	  console.log("received " + data)
	  window.top.postMessage({ type: "ECTOKEN", ecToken: data }, "*")
	})

	window.addEventListener('message', (e) => {
		if (e.data && e.data.type === 'PP_APPROVAL') {
			setApproval(JSON.stringify(e.data.data))
		}
	})

	// FAKE
	let fakeData = `{"intent": "sale", "id":"EC-963615647C474393X","state":"APPROVED","cart_id":"EC-963615647C474393X","shipping_address":{"recipient_name":"Kenneth Susanne","id":"7097108715756759752","line1":"80559476 Marsh Street","line2":"718104 Stout Drive","city":"Pencil Bluff","state":"AR","postal_code":"71965","country_code":"US","type":"HOME_OR_WORK","default_address":true,"preferred_address":true,"primary_address":true,"disable_for_transaction":false},"payer":{"payment_method":"paypal","status":"UNVERIFIED","payer_info":{"email":"onetouch@paypal.com","first_name":"Kenneth","last_name":"Susanne","payer_id":"XCX23Y788DAZ6","shipping_address":{"recipient_name":"Kenneth Susanne","id":"7097108715756759752","line1":"80559476 Marsh Street","line2":"718104 Stout Drive","city":"Pencil Bluff","state":"AR","postal_code":"71965","country_code":"US","type":"HOME_OR_WORK","default_address":true,"preferred_address":true,"primary_address":true,"disable_for_transaction":false},"phone":"479-420-3897","phone_type":"HOME","country_code":"US"},"funding_option":{"id":"66e4e0c1be9b2a1e0778c1a9f5b40000","rank":0,"funding_sources":[{"funding_mode":"INSTANT_TRANSFER","funding_instrument_type":"BALANCE","amount":{"value":"15.00","currency":"USD"}}]},"funding_options":[{"id":"66e4e0c1be9b2a1e0778c1a9f5b40000","rank":0,"funding_sources":[{"funding_mode":"INSTANT_TRANSFER","funding_instrument_type":"BALANCE","amount":{"value":"15.00","currency":"USD"}}]}]},"payment_approved":true,"declined_instruments":[{"funding_instrument_type":"CREDIT","decline_type":"PAYPAL_ELIGIBILITY","reason_code":"PPCREDIT_NOT_IN_WALLET_NOT_ELIGIBLE"}],"sys":{"links":{"jsBaseUrl":"/shoplist/js","cssBaseUrl":"/shoplist/css","templateBaseUrl":"/shoplist/templates/US/en","resourceBaseUrl":"/shoplist","originalTemplateBaseUrl":"/shoplist/templates"},"pageInfo":{"date":"Feb 12, 2019 22:47:20 -08:00","hostName":"rZJvnqaaQhLn/nmWT8cSUsC2av9vPD3/nSVKK9CG5lVEpWjxU+8rtg","rlogId":"rZJvnqaaQhLn%2FnmWT8cSUu8ROy4Jy5XmGwGpQEDSEdI2ZFb%2B8SqI38Zw3FDlGKyouwCHIyztvcw_168e59c1cfc","script":"node","debug":{"scm":"ERROR: scm info not found in manifest.json"}},"locality":{"timezone":{"determiner":"viaCowPrimary","value":"America/Los_Angeles"},"country":"US","locale":"en_US","language":"en","directionality":"ltr"},"tracking":{"fpti":{"name":"pta","jsURL":"https://www.paypalobjects.com/staging","serverURL":"https://www.msmaster.qa.paypal.com/webapps/tracking/ts","dataString":"pgrp=shoplistnodeweb%2Fpublic%2Ftemplates%2F.dust&page=shoplistnodeweb%2Fpublic%2Ftemplates%2F.dust&pgst=1550040440060&calc=35ad9ad07eeb2&rsta=en_US&pgtf=Nodejs&s=ci&ccpg=US&csci=75ff3b68422d487b87c49274b276315c&comp=shoplistnodeweb&tsrce=checkoutjs&cu=1&gacook=1365140868.1549993652&cust=XCX23Y788DAZ6&acnt=anon&aver=unverified&rstr=unrestricted"}}}}`
	setTimeout(() => setApproval(fakeData),  5000)
	// END FAKE
	// getECToken()	
} else {

	window.addEventListener('message', (e) => {
		// console.log(e.data, 'MESSAGES')
		if (e.data && e.data.type === 'ECTOKEN') {
			ecToken = e.data.ecToken

			console.log('ECTOKEN IS: ', ecToken)
			showXO(ecToken)

			fetch(`https://localhost.paypal.com:8443/shoplist/xo/approve?ecToken=${ecToken}`)
				.then(function(response) {
				    return response.json()
				}).then(function(data) {
					console.log(data, 'Approved')
					data.intent = 'sale'
					// let dataWithIntent = {...data, intent: 'sale'}
					e.source.postMessage({ type: "PP_APPROVAL", data }, "*")
				})
		} else if (e.data && e.data.type === 'CLIENTID') {
			clientId = e.data.clientId
			console.log('CLIENTID IS: ', clientId)
		}
	})
}

ext.runtime.onMessage.addListener(onRequest);

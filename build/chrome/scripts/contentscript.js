(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _ext = require('./utils/ext');

var _ext2 = _interopRequireDefault(_ext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var port = _ext2.default.runtime.connect();

var ecToken = void 0;
var merchantWin = void 0;
var clientId = void 0;

function onRequest(request, sender, sendResponse) {
	if (window.location === window.parent.location) {
		console.log(request, sender, ecToken, '<<<<<<<<<<<<<<<<<<<');
		if (request.action === 'getECToken') {
			sendResponse({ ecToken: ecToken });
			return false;
		} else if (request.extAction === 'approve') {
			delete request.extAction;
			console.log(request, 'All the cool data');
			merchantWin.postMessage({ type: "PP_APPROVAL", data: request }, "*");
			return false;
		}
	}
	return true;
}

var showXO = function showXO(data, sendApproval) {
	var payer_info = data.payer.payer_info;

	var xoUrl = 'https://www.paypal.com/webapps/hermes?locale.x=en_US&fundingSource=paypal&env=production&fundingOffered=paypal&logLevel=warn&sdkMeta=eyJ1cmwiOiJodHRwczovL3d3dy5wYXlwYWxvYmplY3RzLmNvbS9hcGkvY2hlY2tvdXQubWluLmpzIn0%3D&version=min&token=' + ecToken;
	alerty.confirm('<div>\n\t  \t\tShipping to ' + payer_info.shipping_address.line1 + '\n\t  </div>\n\t  <div>\n\t  \t\tShall we fast checkout?\n\t  </div>\n\t  ', {
		title: 'Hi ' + payer_info.first_name,
		okLabel: 'Okay',
		cancelLabel: 'Not Now'
	}, sendApproval);
};

var infiltrate = function infiltrate() {
	var actualCode = '(' + function () {
		window._oldxprops = window.xprops;
		window.xprops.onAuthorize = function () {
			console.log(arguments, 'Args');
			window._oldxprops.onAuthorize.apply(this, arguments);
		};
	} + ')();';

	var script = document.createElement('script');
	script.textContent = actualCode;
	(document.head || document.documentElement).appendChild(script);
	script.remove();
};

var getECToken = function getECToken() {
	var actualCode = '(' + function () {
		window.xprops && window.xprops.payment().then(function (ecToken) {
			console.log(ecToken, 'ECTOKEN');
			var evt = document.createEvent("CustomEvent");
			evt.initCustomEvent("EC_TOKEN", true, true, ecToken);
			document.dispatchEvent(evt);
		});
	} + ')();';

	var script = document.createElement('script');
	script.textContent = actualCode;
	(document.head || document.documentElement).appendChild(script);
	script.remove();
};

var setApproval = function setApproval(data) {
	var actualCode = '(function() {\n\t    window.xprops && window.xprops.onAuthorize(' + data + ', {\n\t    \tpayment: {\n\t    \t\tget: () => {\n\t    \t\t\treturn new Promise(function(resolve) {\n    \t\t\t\t\tresolve(' + data + ');\n\t\t\t\t\t});\n\t    \t\t}\n\t    \t}\n\t    })\n\t})();';

	var script = document.createElement('script');
	script.textContent = actualCode;
	(document.head || document.documentElement).appendChild(script);
	script.remove();
};

if (window.location.hostname.indexOf('www.paypal.com') > -1) {
	document.addEventListener('EC_TOKEN', function (e) {
		var data = e.detail;
		console.log("received " + data);
		window.top.postMessage({ type: "ECTOKEN", ecToken: data }, "*");
	});

	window.addEventListener('message', function (e) {
		if (e.data && e.data.type === 'PP_APPROVAL') {
			setApproval(JSON.stringify(e.data.data));
		}
	});

	// infiltrate()
	getECToken();
} else if (window.top == window.self) {

	window.addEventListener('message', function (e) {
		if (e.data && e.data.type === 'ECTOKEN') {
			ecToken = e.data.ecToken;
			merchantWin = e.source;

			_ext2.default.runtime.sendMessage({ contentScriptQuery: 'approveEC', ecToken: ecToken }, function (data) {
				console.log(data, 'Approved');
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
			clientId = e.data.clientId;
			console.log('CLIENTID IS: ', clientId);
		}
	});
}

_ext2.default.runtime.onMessage.addListener(onRequest);

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

},{"./utils/ext":2}],2:[function(require,module,exports){
'use strict';

var apis = ['alarms', 'bookmarks', 'browserAction', 'commands', 'contextMenus', 'cookies', 'downloads', 'events', 'extension', 'extensionTypes', 'history', 'i18n', 'idle', 'notifications', 'pageAction', 'runtime', 'storage', 'tabs', 'webNavigation', 'webRequest', 'windows'];

function Extension() {
  var _this = this;

  apis.forEach(function (api) {

    _this[api] = null;

    try {
      if (chrome[api]) {
        _this[api] = chrome[api];
      }
    } catch (e) {}

    try {
      if (window[api]) {
        _this[api] = window[api];
      }
    } catch (e) {}

    try {
      if (browser[api]) {
        _this[api] = browser[api];
      }
    } catch (e) {}
    try {
      _this.api = browser.extension[api];
    } catch (e) {}
  });

  try {
    if (browser && browser.runtime) {
      this.runtime = browser.runtime;
    }
  } catch (e) {}

  try {
    if (browser && browser.browserAction) {
      this.browserAction = browser.browserAction;
    }
  } catch (e) {}
}

module.exports = new Extension();

},{}]},{},[1])

//# sourceMappingURL=contentscript.js.map

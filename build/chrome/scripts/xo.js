(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
'use strict';

var _ext = require('./utils/ext');

var _ext2 = _interopRequireDefault(_ext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var displayProfile = function displayProfile(payer) {

  document.getElementById('profile').style.display = 'block';
  document.getElementById('profile_name').innerText = payer.shipping_address.recipient_name;
  document.getElementById('shipping-address').innerText = payer.shipping_address.line1;
  document.getElementById('profile-email').innerText = payer.email;
};

document.addEventListener("DOMContentLoaded", function () {
  var xoButton = document.getElementById('xo');
  var spinner = document.getElementById('spinner');
  xoButton.addEventListener('click', function () {
    spinner.style.display = 'block';
    xoButton.style.display = 'none';
    _ext2.default.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      _ext2.default.tabs.sendMessage(tabs[0].id, { action: "getECToken" }, function (_ref) {
        var ecToken = _ref.ecToken;

        fetch('https://www.paypal.com/shoplist/xo/approve?ecToken=' + ecToken, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(function (response) {
          return response.json();
        }).then(function (data) {
          console.log(data.payer.payer_info, 'Approved');
          data.intent = 'authorize';
          data.extAction = 'approve';
          var payerID = data.payer.payer_info.payer_id;

          spinner.style.display = 'none';
          displayProfile(data.payer.payer_info);

          var payload = {
            extAction: 'approve',
            intent: 'authorize',
            orderID: data.id,
            paymentID: ecToken,
            payerID: payerID,
            paymentToken: data.id,
            returnUrl: 'https://www.paypal.com/checkoutnow/error?paymentId=' + ecToken + '&token=' + data.id + '&PayerID=' + payerID
          };

          _ext2.default.tabs.sendMessage(tabs[0].id, payload, function () {});
        }).catch(console.log);
      });
    });
  });
});

},{"./utils/ext":1}]},{},[2])

//# sourceMappingURL=xo.js.map

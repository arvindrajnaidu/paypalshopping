!function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r}()({1:[function(require,module,exports){"use strict";!function(){var commonUse={addClass:function(el,cls){var elClass=el.className,blank=""!==elClass?" ":"",added=elClass+blank+cls;el.className=added},removeClass:function(el,cls){var elClass=" "+el.className+" ";elClass=elClass.replace(/(\s+)/gi," ");var removed=elClass.replace(" "+cls+" "," ");removed=removed.replace(/(^\s+)|(\s+$)/g,""),el.className=removed},hasClass:function(el,cls){var elClass=el.className,elClassList=elClass.split(/\s+/),x=0;for(x in elClassList)if(elClassList[x]==cls)return!0;return!1},addEvent:function(el,type,func){el.addEventListener?el.addEventListener(type,func,!1):el.attachEvent?el.attachEvent("on"+type,func):el["on"+type]=func},removeEvent:function(el,type,func){el.removeEventListener?el.removeEventListener(type,func,!1):el.detachEvent?el.detachEvent("on"+type,func):delete el["on"+type]},removeElement:function(el){el&&el.parentNode&&el.parentNode.removeChild(el)},setUid:function(prefix){do prefix+=Math.floor(1e6*Math.random());while(document.getElementById(prefix));return prefix}},Alerty=function(){var Dialog={defaults:{okLabel:"\u786e\u5b9a",cancelLabel:"\u53d6\u6d88",time:2e3},previousCallback:null,template:'<div class="alerty-overlay" tabindex="-1"></div><div class="alerty"><div class="alerty-title"></div><div class="alerty-content"><p class="alerty-message"></p><div class="alerty-prompt"><input type="text" placeholder="" value=""><div class="input-line"></div></div></div><div class="alerty-action"><a class="btn-cancel"></a><a class="btn-ok"></a></div></div>',setup:function(type,content,opts,onOk,onCancel){var detect="function"==typeof opts;detect&&(onCancel=onOk,onOk=opts);var $oldModal=document.querySelector(".alerty");if($oldModal){commonUse.removeElement($oldModal);var _callback=this.previousCallback;_callback&&_callback()}var $wrapper=document.createElement("div");for($wrapper.innerHTML=this.template;$wrapper.firstChild;)document.body.appendChild($wrapper.firstChild);var $modal=document.querySelector(".alerty"),$overlay=document.querySelector(".alerty-overlay"),$title=$modal.querySelector(".alerty-title"),$message=$modal.querySelector(".alerty-message"),$btnArea=$modal.querySelector(".alerty-action"),$btnOk=$modal.querySelector(".btn-ok"),$btnCancel=$modal.querySelector(".btn-cancel"),$prompt=$modal.querySelector(".alerty-prompt"),$input=$prompt.querySelector("input");$modal.id=commonUse.setUid("alerty"),$overlay.id="overlay-"+$modal.id,commonUse.addClass($overlay,"active"),commonUse.addClass($modal,"alerty-show"),$message.innerHTML=content,opts&&opts.time&&(this.defaults.time=opts.time),"prompt"!==type?commonUse.removeElement($prompt):($input.focus(),opts&&opts.inputType&&$input.setAttribute("type",opts.inputType),opts&&opts.inputPlaceholder&&$input.setAttribute("placeholder",opts.inputPlaceholder),opts&&opts.inputValue&&$input.setAttribute("value",opts.inputValue)),"toasts"===type?(this.previousCallback=onOk,commonUse.removeElement($title),commonUse.removeElement($btnArea),commonUse.removeElement($overlay),commonUse.addClass($modal,"toasts"),opts&&"top"===opts.place&&commonUse.addClass($modal,"place-top"),opts&&opts.bgColor&&($modal.style.backgroundColor=opts.bgColor),opts&&opts.fontColor&&($message.style.color=opts.fontColor)):(commonUse.addClass(document.body,"no-scrolling"),opts&&opts.title?$title.innerHTML=opts.title:commonUse.removeElement($title),opts&&opts.okLabel?$btnOk.innerHTML=opts.okLabel:$btnOk.innerHTML=this.defaults.okLabel,$modal.style.marginTop=-$modal.offsetHeight/2+"px","confirm"===type||"prompt"===type?opts&&opts.cancelLabel?$btnCancel.innerHTML=opts.cancelLabel:$btnCancel.innerHTML=this.defaults.cancelLabel:commonUse.removeElement($btnCancel)),this.bindEvent($modal,onOk,onCancel)},bindEvent:function($modal,onOk,onCancel){var that=this,$btnOk=$modal.querySelector(".btn-ok"),$btnCancel=$modal.querySelector(".btn-cancel");commonUse.hasClass($modal,"toasts")&&setTimeout(function(){null!==document.getElementById($modal.id)&&that.close($modal,onOk)},that.defaults.time),$btnOk&&commonUse.addEvent($btnOk,"click",function(){that.close($modal,onOk)}),$btnCancel&&commonUse.addEvent($btnCancel,"click",function(){that.close($modal,onCancel)})},close:function($modal,callback){var $input=$modal.querySelector("input"),$overlay=document.getElementById("overlay-"+$modal.id);commonUse.removeClass($modal,"alerty-show"),commonUse.addClass($modal,"alerty-hide"),setTimeout(function(){$overlay&&commonUse.removeClass($overlay,"active"),commonUse.removeClass(document.body,"no-scrolling"),commonUse.removeElement($modal),commonUse.removeElement($overlay),callback&&setTimeout(function(){$input?callback($input.value):callback()},100)},100)}};return{toasts:function(content,opts,callback){Dialog.setup("toasts",content,opts,callback)},alert:function(content,opts,onOk){Dialog.setup("alert",content,opts,onOk)},confirm:function(content,opts,onOk,onCancel){Dialog.setup("confirm",content,opts,onOk,onCancel)},prompt:function(content,opts,onOk,oncancel){Dialog.setup("prompt",content,opts,onOk,oncancel)}}};window.alerty=new Alerty}()},{}]},{},[1]);
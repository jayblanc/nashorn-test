"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CryptoObject = function () {
  function CryptoObject() {
    _classCallCheck(this, CryptoObject);

    this.debugFlag = false;
    this.canUseWindowCrypto = false;
    //  if (( typeof window !== 'undefined' ) && (( window.crypto ) || ( window.msCrypto ))) {
    //  Not use msCrypto yet
    if (typeof window !== 'undefined' && window.crypto) {
      this.canUseWindowCrypto = true;
      this.wCrypto = window.crypto || window.msCrypto;
      if (this.wCrypto.webkitSubtle) {
        this.wCrypto.subtle = this.wCrypto.webkitSubtle; //for Safari
      }
    }
    this.windowCrypto = this.canUseWindowCrypto ? true : false;

    this.debugFunction = function (message, obj) {
      if (obj) return console.log("DEBUG : " + message, obj);
      return console.log("DEBUG : " + message);
    };

    this.errorFunction = function (message) {
      throw new Error(message);
    };
  }

  /**
  * Set the debug option
  * @param  {[Boolean]} b [the debug option]
  */


  _createClass(CryptoObject, [{
    key: "debug",
    value: function debug(message, obj) {
      if (this.debugFunction && this.debugFlag) return this.debugFunction(message, obj);
    }
  }, {
    key: "err",
    value: function err(message) {
      if (this.errorFunction) return this.errorFunction(message);
    }
  }, {
    key: "toggleDebug",
    set: function set(b) {
      this.debugFlag = b ? true : false;
    }
  }, {
    key: "useWindowCrypto",
    set: function set(b) {
      if (this.canUseWindowCrypto) this.windowCrypto = b ? true : false;
    }
  }]);

  return CryptoObject;
}();

exports.default = CryptoObject;
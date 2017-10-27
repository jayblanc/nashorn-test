"use strict";

var exports = {};

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.setDebugFlag = setDebugFlag;
exports.setPreferWindowCrypto = setPreferWindowCrypto;
exports.setDebugFunction = setDebugFunction;
exports.setErrorFunction = setErrorFunction;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _Promise = typeof Promise === 'undefined' ? require('es6-promise').Promise : Promise;

var crypto = require('crypto');

// the debug flag
var debugFlag = false;

// the applcation debug function (if set by the app)
var debugAppFunc = undefined;

// -- to say if the crypto is done by this.wCrypto if possible
var preferWindowCrypto = true;

/**
* Default debuf function
* @param  {[string]} message [the message to display]
* @param  {[obj]} obj     [the object to display]
*/
var debug = function debug(message, obj) {
  if (debugFlag != true) return;
  if (debugAppFunc) return debugAppFunc(message, obj);
  if (obj) return console.log("DEBUG : " + message, obj);
  console.log("DEBUG : " + message);
};

/**
* Toggle the debugFlag
* @param {[boolean]} flag [the debug flag]
*/
function setDebugFlag(flag) {
  debugFlag = flag;
}

/**
* Toggle the preferWindowCrypto
* @param {[boolean]} flag [the preferWindowCrypto flag]
*/
function setPreferWindowCrypto(flag) {
  preferWindowCrypto = flag;
}
/**
* Change the debug function to be included in a more complexe application
* @param {[function]} func [the new debug function ]
*/
function setDebugFunction(func) {
  debugAppFunc = func;
}

/**
* the error function
* @param  {[string]} message [the message to display in the error]
* @return {[undefined]}         [undefined]
*/
var err = function err(message) {
  throw new Error(message);
};

/**
* Set the Error function to be included in a more complexe application
* @param {[function]} func [the new errror function ]
*/
function setErrorFunction(func) {
  err = func;
}

/**
* Test if use this.wCrypto or not
* @return {[boolean]} [true if use this.wCrypto]
*/
function useWindowCrypto() {
  if (preferWindowCrypto !== true) {
    debug("Dont want to use windows.crypto.");
    return false;
  }
  // test with this.wCrypto
  if (typeof window !== 'undefined' && this.wCrypto) {
    debug("Using windows.crypto");
    return true;
  } else {
    debug("Using node crypto");
    return false;
  }
}

var PBKDF2_ITERATION = exports.PBKDF2_ITERATION = 10000;
var PBKDF2_HASH = exports.PBKDF2_HASH = 'sha256';
var BLOCK_SIZE = exports.BLOCK_SIZE = 16;

function toArrayBuffer(buffer) {
  var ab = new ArrayBuffer(buffer.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return ab;
}

function toBuffer8(ab) {
  return new Buffer(new Uint8Array(ab));
}
/**
*******************************************************************************
**** Symetric Key structure ***************************************************
*******************************************************************************
*/

var SymetricKey = exports.SymetricKey = function () {
  function SymetricKey() {
    var byteLength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 32;

    _classCallCheck(this, SymetricKey);

    this.byteLength = byteLength;
    this.windowCrypto = useWindowCrypto();
    this.keyStruct = undefined;
  }

  _createClass(SymetricKey, [{
    key: "wrapKeyFromPassphrase",
    value: function wrapKeyFromPassphrase(passphrase) {
      var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      var b64Salt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

      var _this = this;

      var iteration = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : PBKDF2_ITERATION;
      var hash = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : PBKDF2_HASH;

      var salt = b64Salt ? new Buffer(b64Salt, 'base64') : crypto.randomBytes(BLOCK_SIZE);
      return new _Promise(function (resolve, reject) {
        resolve(crypto.pbkdf2Sync(passphrase, salt, iteration, length ? length : _this.byteLength, hash));
      }).then(function (rawKey) {
        _this.keyStruct = {
          "key": rawKey, //  Uint8Array format
          "salt": salt.toString('base64'),
          "iteration": iteration,
          "hash": hash,
          "keylen": length ? length : _this.byteLength,
          "windowCryptoKey": undefined
        };
      }).then(function () {
        if (_this.windowCrypto) return _this.importInWindowCrypto(true, ["encrypt", "decrypt"]);
      });
    }
  }, {
    key: "extract",


    /**
    * return a promise with return the key as an ArrayBuffer
    * @return {[ArrayBuffer]} [the secret key]
    */
    value: function extract() {
      var _this2 = this;

      if (!this.keyStruct) return err("Key not set");
      if (this.keyStruct.key) {
        return new _Promise(function (resolve, reject) {
          resolve(_this2.keyStruct.key);
        });
      }

      if (this.keyStruct.windowCryptoKey && this.keyStruct.windowCryptoKey.extractable) {
        return this.exportWindowCrypto();
      }
    }
  }, {
    key: "importKey",
    value: function importKey(rawKey) {
      var _this3 = this;

      return new _Promise(function (resolve, reject) {
        _this3.keyStruct = {
          "key": rawKey //  Uint8Array format
        };
        resolve(true);
      }).then(function () {

        if (_this3.windowCrypto) return _this3.importInWindowCrypto(true, ["encrypt", "decrypt"]);
      });
    }
  }, {
    key: "importInWindowCrypto",
    value: function importInWindowCrypto() {
      var _this4 = this;

      var extractable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var usages = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ["encrypt", "decrypt"];

      if (!this.keyStruct) return err("Key not set");
      if (!this.windowCrypto) err("this.wCrypto not supported");
      return this.wCrypto.subtle.importKey("raw", //can be "jwk" or "raw"
      this.keyStruct.key, { //this is the algorithm options
        name: "AES-CBC"
      }, extractable, //whether the key is extractable (i.e. can be used in exportKey)
      usages).then(function (key) {
        _this4.keyStruct.windowCryptoKey = key; // CryptoKey object
      });
    }
  }, {
    key: "exportWindowCrypto",
    value: function exportWindowCrypto() {
      if (!this.windowCrypto) err("this.wCrypto not supported");

      return this.wCrypto.subtle.exportKey("raw", //can be "jwk" or "raw"
      this.cryptoKey //extractable must be true
      );
    }
  }, {
    key: "generate",
    value: function generate() {
      var _this5 = this;

      // --------- Use this.wCrypto -------
      if (this.windowCrypto) {
        return this.wCrypto.subtle.generateKey({
          name: "AES-CBC",
          length: this.bitLength //can be  128, 192, or 256
        }, true, //whether the key is extractable (i.e. can be used in exportKey)
        ["encrypt", "decrypt"] //can be "encrypt", "decrypt", "wrapKey", or "unwrapKey"
        ).then(function (key) {
          _this5.keyStruct = {
            windowCryptoKey: key // CryptoKey object
          };
        });
      }

      // --------- Node js AES Key generation -
      return new _Promise(function (resolve, reject) {
        _this5.keyStruct = {
          key: toArrayBuffer(crypto.randomBytes(_this5.byteLength))
        };
        resolve(true);
      });
    }
  }, {
    key: "bitLength",
    get: function get() {
      return this.byteLength * 8;
    }
  }, {
    key: "content",
    get: function get() {
      return this.keyStruct;
    }
  }, {
    key: "params",
    get: function get() {
      return {
        "salt": this.keyStruct.salt,
        "iteration": this.keyStruct.iteration,
        "hash": this.keyStruct.hash,
        "keylen": this.keyStruct.length
      };
    }
  }, {
    key: "raw",
    get: function get() {
      if (!this.keyStruct) return undefined;
      if (this.keyStruct.key) return this.keyStruct.key.buffer;
      return undefined;
    }
  }, {
    key: "rawAsBuffer",
    get: function get() {
      if (!this.keyStruct) return undefined;
      if (this.keyStruct.key) return toBuffer8(this.keyStruct.key);
      return undefined;
    }
  }, {
    key: "cryptoKey",
    get: function get() {
      if (!this.keyStruct) return err("Key not set");
      if (!this.windowCrypto) err("this.wCrypto not supported");
      return this.keyStruct.windowCryptoKey;
    }
  }]);

  return SymetricKey;
}();
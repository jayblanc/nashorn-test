'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SymCrypt = exports.SymetricKey = exports.BLOCK_SIZE = exports.PBKDF2_HASH = exports.PBKDF2_ITERATION = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Common = require('./Common.js');

var _Common2 = _interopRequireDefault(_Common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Promise = typeof Promise === 'undefined' ? require('es6-promise').Promise : Promise;

var crypto = require('crypto');
var UTF8 = require('utf-8');

var PBKDF2_ITERATION = exports.PBKDF2_ITERATION = 10000;
var PBKDF2_HASH = exports.PBKDF2_HASH = 'sha256';

var BLOCK_SIZE = exports.BLOCK_SIZE = 16;

function utf8ToArrayBuffer(str) {
  var out = UTF8.setBytesFromString(str);
  var ab = new ArrayBuffer(out.length);
  var bufView = new Uint8Array(ab);
  for (var i = 0; i < out.length; i++) {
    bufView[i] = out[i];
  }

  var b = UTF8.getStringFromBytes(bufView);
  return ab;
}

function toArrayBuffer(buffer) {
  var ab = new ArrayBuffer(buffer.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return ab;
}

function abToString(ab) {
  var b = new Uint8Array(ab);
  var a = [];
  for (var i = 0; i < b.length; ++i) {
    a.push(String.fromCharCode(b[i]));
  }
  return a.join('');
}

function toHexString(b) {

  var a = [];
  for (var i = 0; i < b.length; ++i) {
    if (b[i] > 15) {
      a.push((b[i] & 0xFF).toString(16));
    } else {
      a.push('0' + (b[i] & 0xFF).toString(16));
    }
  }
  return a.join('');

  /*
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
  */
}

function stringToAb(str) {
  var ab = new ArrayBuffer(str.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < str.length; ++i) {
    view[i] = str.charCodeAt(i);
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

var SymetricKey = exports.SymetricKey = function (_CryptoObject) {
  _inherits(SymetricKey, _CryptoObject);

  function SymetricKey() {
    var byteLength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 32;

    _classCallCheck(this, SymetricKey);

    var _this = _possibleConstructorReturn(this, (SymetricKey.__proto__ || Object.getPrototypeOf(SymetricKey)).call(this));

    _this.byteLength = byteLength;
    _this.keyStruct = undefined;
    return _this;
  }

  _createClass(SymetricKey, [{
    key: 'wrapKeyFromPassphrase',
    value: function wrapKeyFromPassphrase(passphrase) {
      var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      var b64Salt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

      var _this2 = this;

      var iteration = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : PBKDF2_ITERATION;
      var hash = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : PBKDF2_HASH;

      var salt = b64Salt ? new Buffer(b64Salt, 'base64') : crypto.randomBytes(BLOCK_SIZE);
      return new _Promise(function (resolve, reject) {
        resolve(crypto.pbkdf2Sync(passphrase, salt, iteration, length ? length : _this2.byteLength, hash));
      }).then(function (rawKey) {
        _this2.keyStruct = {
          "key": rawKey, //  Uint8Array format
          "salt": salt.toString('base64'),
          "iteration": iteration,
          "hash": hash,
          "keylen": length ? length : _this2.byteLength,
          "windowCryptoKey": undefined
        };
      }).then(function () {
        if (_this2.windowCrypto) return _this2.importInWindowCrypto(true, ["encrypt", "decrypt"]);
      });
    }
  }, {
    key: 'extract',


    /**
    * return a promise with return the key as an ArrayBuffer
    * @return {[ArrayBuffer]} [the secret key]
    */
    value: function extract() {
      var _this3 = this;

      if (!this.keyStruct) return this.err("Key not set");
      if (this.keyStruct.key) {
        return new _Promise(function (resolve, reject) {
          resolve(_this3.keyStruct.key);
        });
      }

      if (this.keyStruct.windowCryptoKey && this.keyStruct.windowCryptoKey.extractable) {
        return this.exportWindowCrypto();
      }
    }
  }, {
    key: 'importKey',
    value: function importKey(rawKey) {
      var _this4 = this;

      return new _Promise(function (resolve, reject) {
        _this4.keyStruct = {
          "key": rawKey //  Uint8Array format
        };
        resolve(true);
      }).then(function () {

        if (_this4.windowCrypto) return _this4.importInWindowCrypto(true, ["encrypt", "decrypt"]);
      });
    }
  }, {
    key: 'importInWindowCrypto',
    value: function importInWindowCrypto() {
      var _this5 = this;

      var extractable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var usages = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ["encrypt", "decrypt"];

      if (!this.keyStruct) return this.err("Key not set");
      if (!this.windowCrypto) this.err("this.wCrypto not supported");
      return this.wCrypto.subtle.importKey("raw", //can be "jwk" or "raw"
      this.keyStruct.key, { //this is the algorithm options
        name: "AES-CBC"
      }, extractable, //whether the key is extractable (i.e. can be used in exportKey)
      usages).then(function (key) {
        _this5.keyStruct.windowCryptoKey = key; // CryptoKey object
      });
    }
  }, {
    key: 'exportWindowCrypto',
    value: function exportWindowCrypto() {
      if (!this.windowCrypto) this.err("this.wCrypto not supported");

      return this.wCrypto.subtle.exportKey("raw", //can be "jwk" or "raw"
      this.cryptoKey //extractable must be true
      );
    }
  }, {
    key: 'generate',
    value: function generate() {
      var _this6 = this;

      // --------- Use this.wCrypto -------
      if (this.windowCrypto) {
        return this.wCrypto.subtle.generateKey({
          name: "AES-CBC",
          length: this.bitLength //can be  128, 192, or 256
        }, true, //whether the key is extractable (i.e. can be used in exportKey)
        ["encrypt", "decrypt"] //can be "encrypt", "decrypt", "wrapKey", or "unwrapKey"
        ).then(function (key) {
          _this6.keyStruct = {
            windowCryptoKey: key // CryptoKey object
          };
        });
      }

      // --------- Node js AES Key generation -
      return new _Promise(function (resolve, reject) {
        _this6.keyStruct = {
          key: toArrayBuffer(crypto.randomBytes(_this6.byteLength))
        };
        resolve(true);
      });
    }
  }, {
    key: 'bitLength',
    get: function get() {
      return this.byteLength * 8;
    }
  }, {
    key: 'content',
    get: function get() {
      return this.keyStruct;
    }
  }, {
    key: 'params',
    get: function get() {
      return {
        "salt": this.keyStruct.salt,
        "iteration": this.keyStruct.iteration,
        "hash": this.keyStruct.hash,
        "keylen": this.keyStruct.keylen
      };
    }
  }, {
    key: 'raw',
    get: function get() {
      if (!this.keyStruct) return undefined;
      if (this.keyStruct.key) return this.keyStruct.key.buffer;
      return undefined;
    }
  }, {
    key: 'rawAsBuffer',
    get: function get() {
      if (!this.keyStruct) return undefined;
      if (this.keyStruct.key) return toBuffer8(this.keyStruct.key);
      return undefined;
    }
  }, {
    key: 'cryptoKey',
    get: function get() {
      if (!this.keyStruct) return this.err("Key not set");
      if (!this.windowCrypto) this.err("this.wCrypto not supported");
      return this.keyStruct.windowCryptoKey;
    }
  }]);

  return SymetricKey;
}(_Common2.default);

/**
*******************************************************************************
**** Symetric encryption ******************************************************
*******************************************************************************
*/


var SymCrypt = exports.SymCrypt = function (_CryptoObject2) {
  _inherits(SymCrypt, _CryptoObject2);

  function SymCrypt(type) {
    _classCallCheck(this, SymCrypt);

    var _this7 = _possibleConstructorReturn(this, (SymCrypt.__proto__ || Object.getPrototypeOf(SymCrypt)).call(this));

    _this7.generateconstants(type);
    _this7.iv = null;
    _this7.key = new SymetricKey(_this7.keylen);
    return _this7;
  }

  _createClass(SymCrypt, [{
    key: 'generateconstants',
    value: function generateconstants(algo) {
      switch (algo) {
        case 'AES-128-CBC':
          this.algoString = 'AES-128-CBC';
          this.algo = 'aes128';
          this.length = 128;
          this.keylen = 16;
          break;
        case 'AES-256-CBC':
        default:
          this.algoString = 'AES-256-CBC';
          this.algo = 'aes256';
          this.keylen = 32;
          this.length = 256;
      }
    }
  }, {
    key: 'generateKey',
    value: function generateKey() {
      return this.key.generate();
    }

    /**
    * AES encryption
    * @param  {[ArrayBuffer|string]} d           [the arrayBuffer or the String to cipher]
    * @param  {[String]} [outputFormat=undefined] [tu output format]
    * @param  {[ArrayBuffer]} [rawKey=undefined] [The key ... in raw ]
    * @return {[variable]}                    [description]
    */

  }, {
    key: 'cipher',
    value: function cipher(d) {
      var _this8 = this;

      var outputFormat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      var rawKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;


      var dd = typeof d === "string" ? utf8ToArrayBuffer(d) : d;

      var p = new _Promise(function (resolve, reject) {
        resolve(true);
      });
      if (rawKey) p = this.key.importKey(rawKey);

      // --------- Use this.wCrypto -------
      if (this.windowCrypto) {
        var dts = Date.now();
        this.iv = this.wCrypto.getRandomValues(new Uint8Array(BLOCK_SIZE));
        return this.wCrypto.subtle.encrypt({
          name: "AES-CBC",
          iv: this.iv
        }, this.key.cryptoKey, //from generateKey or importKey above
        dd //ArrayBuffer of data you want to encrypt
        ).then(function (encrypted) {
          var a = _this8.formatOutput(encrypted, outputFormat);
          return a;
        });
      }

      // --------- Use node crypto ---------
      return p.then(function () {
        _this8.iv = crypto.randomBytes(BLOCK_SIZE);
        var cipher = crypto.createCipheriv(_this8.algo, _this8.key.rawAsBuffer, _this8.iv);
        var base64Iv = _this8.iv.toString('base64');
        //  console.log("try to cipher - ", toBuffer8(dd) );
        var a = cipher.update(toBuffer8(dd));
        //  let a = cipher.update(new Uint8Array(dd));
        var b = cipher.final();

        var encrypted = toArrayBuffer(Buffer.concat([a, b]));
        //      let encrypted =  Buffer.concat([a, b]);
        // console.log("cipher result without format - ", new Uint8Array(encrypted) );
        var c = _this8.formatOutput(new Uint8Array(encrypted), outputFormat);
        // console.log("cipher result format - ",c );
        return c;
      });
    }
  }, {
    key: 'formatOutput',
    value: function formatOutput(data) {
      var outputFormat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

      //let base64Iv = typeof (btoa) === 'undefined' ?  Buffer.from(this.iv).toString('base64') : btoa(String.fromCharCode(...this.iv));
      var base64Iv = Buffer.from(this.iv).toString('base64');

      switch (outputFormat) {
        case "raw":
          return {
            "rawData": new Uint8Array(data),
            "iv": new Uint8Array(this.iv),
            "algo": this.algoString
          };
        case "struct":
          return {
            "rawData": abToString(data),
            "iv": base64Iv,
            "algo": this.algoString
          };
        case "hex":
          return '{' + this.algoString + '}{' + base64Iv + '}' + toHexString(new Uint8Array(data));
        case "base64":
          var base64String = Buffer.from(data).toString('base64');
          return '{' + this.algoString + '}{' + base64Iv + '}' + base64String;
        default:
          return data;
      }
    }
  }, {
    key: 'decipher',
    value: function decipher(encrypted, inputFormat, ouputFormat) {
      var rawKey = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;

      var res = void 0;

      var algo = undefined;
      var iv = undefined;
      var crypted = undefined;

      switch (inputFormat) {
        case "raw":
          algo = encrypted.algo;
          iv = new Buffer(encrypted.iv);
          crypted = encrypted.rawData;
          break;
        case "struct":
          algo = encrypted.algo;
          iv = new Buffer(encrypted.iv, 'base64');
          crypted = encrypted.rawData ? stringToAb(encrypted.rawData) : new Buffer(encrypted.data, 'hex');
          break;
        case "hex":
          if (!(res = encrypted.match(/^\{([^\}]+)\}\{([^\}]+)\}(.*)/))) return this.err("Invalid crypted string");
          algo = res[1];
          iv = new Buffer(res[2], 'base64');
          crypted = new Buffer(res[3], 'hex');
          break;
        case "base64":
        default:
          if (!(res = encrypted.match(/^\{([^\}]+)\}\{([^\}]+)\}(.*)/))) return this.err("Invalid crypted string");
          algo = res[1];
          iv = new Buffer(res[2], 'base64');
          crypted = new Buffer(res[3], 'base64');
          break;
      }

      this.generateconstants(algo);
      return this.decipherArrayBuffer(crypted, iv, rawKey).then(function (clearBuffer) {
        var uib = new Uint8Array(clearBuffer);
        if (ouputFormat == "string") {
          return UTF8.getStringFromBytes(uib);
        } else {
          return uib;
        }
      });
    }

    /**
    * decrypt an Arraybuffer
    * @param  {[Arraybuffer]} encrypted          [the encrypted data]
    * @param  {[Arraybuffer]} iv                 [initialisation vector]
    * @param  {[Arraybuffer]} [rawKey=undefined] [the rawKey]
    * @return {[Arraybuffer]}                    [datas]
    */

  }, {
    key: 'decipherArrayBuffer',
    value: function decipherArrayBuffer(encrypted, iv) {
      var _this9 = this;

      var rawKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

      var p = new _Promise(function (resolve, reject) {
        resolve(true);
      });
      if (rawKey) p = this.key.importKey(rawKey);

      // --------- Use this.wCrypto -------
      if (this.windowCrypto) {
        return p.then(function () {
          return _this9.wCrypto.subtle.decrypt({
            name: "AES-CBC",
            iv: iv //The initialization vector you used to encrypt
          }, _this9.key.cryptoKey, //from generateKey or importKey above
          encrypted //ArrayBuffer of the data
          );
        });
      }

      // --------- Use node crypto ---------
      return p.then(function () {
        var deci = crypto.createDecipheriv(_this9.algo, _this9.key.rawAsBuffer, iv);
        var enc = encrypted instanceof ArrayBuffer ? new Uint8Array(encrypted) : encrypted;
        // console.log("decipher enc ", new Buffer( enc ) );

        var r = deci.update(new Buffer(enc));
        var f = deci.final();
        var b = f.length == 0 ? r : Buffer.concat([r, f]);
        // console.log("decyphred ", b);
        return b;
      });
    }
  }, {
    key: 'useWindowCrypto',
    set: function set(b) {
      this.key.useWindowCrypto = b;
      if (this.canUseWindowCrypto) this.windowCrypto = b ? true : false;
    }
  }, {
    key: 'initialVector',
    get: function get() {
      if (this.iv == null) return null;
      return this.iv.toString('base64');
    }
  }]);

  return SymCrypt;
}(_Common2.default);
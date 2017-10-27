'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Hash = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Common = require('./Common.js');

var _Common2 = _interopRequireDefault(_Common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Promise = typeof Promise === 'undefined' ? require('es6-promise').Promise : Promise;

var crypto = require('crypto');

/**
* convertion from String to Uint8Array
* @param  {[String]} string [the string to convert]
* @return {[Uint8Array]}        [the array]
*/
function stringToUint8Array(string) {
  //var string = btoa(unescape(encodeURIComponent(string)));
  var charList = string.split('');
  var uintArray = [];

  for (var i = 0; i < charList.length; i++) {
    uintArray.push(charList[i].charCodeAt(0));
  }
  //let a = new Uint8Array(uintArray);
  //console.log(String.fromCharCode.apply(null, a));
  return new Uint8Array(uintArray);
}

/**
*******************************************************************************
**** Hash *********************************************************************
*******************************************************************************
*/

var Hash = exports.Hash = function (_CryptoObject) {
  _inherits(Hash, _CryptoObject);

  /**
  * New object Hash
  * @param  {[type]} string [the type of hash]
  * @return {[type]}      [description]
  */
  function Hash(type) {
    _classCallCheck(this, Hash);

    var _this = _possibleConstructorReturn(this, (Hash.__proto__ || Object.getPrototypeOf(Hash)).call(this));

    _this.generateconstants(type);
    return _this;
  }

  _createClass(Hash, [{
    key: 'generateconstants',
    value: function generateconstants(type) {
      switch (type) {
        case 'sha256':
          this.algoString = 'sha256';
          this.algo = 'sha256';
          this.windowCryptoName = "SHA-256";
          break;
        case 'sha512':
        default:
          this.algoString = 'sha512';
          this.algo = 'sha512';
          this.windowCryptoName = "SHA-512";
      }
    }

    /**
    * Make a hash of the string passed in parameter
    * @param  {[String]} text [The string to hash]
    * @return {[Promise]}      [a promise witch compute base64 encoded string with "{algo}" at the beginning]
    */

  }, {
    key: 'hash',
    value: function hash(text) {
      var _this2 = this;

      var algoString = this.algoString;
      var algo = this.algo;

      // --------- Use this.wCrypto -------
      if (this.windowCrypto) {
        return this.wCrypto.subtle.digest({
          name: this.windowCryptoName
        }, stringToUint8Array(text)).then(function (hash) {
          var base64String = btoa(String.fromCharCode.apply(String, _toConsumableArray(new Uint8Array(hash))));
          return '{' + _this2.algoString + '}' + base64String;
        });
      }

      // --------- Use node crypto module -------
      return new _Promise(function (resolve, reject) {
        var hash = crypto.createHash(_this2.algo);
        hash.update(text);
        resolve('{' + _this2.algoString + '}' + hash.digest('base64'));
      });
    }

    /**
    * Verify a hash
    * @param  {[String]} text   [The text]
    * @param  {[String]} digest [The base64 encoded hash]
    * @return {[Promise]}        [a promise witch compute a boolean for verification]
    */

  }, {
    key: 'verify',
    value: function verify(text, digest) {
      var _this3 = this;

      var res = void 0;
      // ---------- get the algo ------------------
      if (!(res = digest.match(/^\{([^\}]+)\}(.*)/))) return this.err("Invalid hashed string");
      var type = res[1];
      this.generateconstants(type);

      // --------- Use this.wCrypto -------
      if (this.windowCrypto) {
        return this.wCrypto.subtle.digest({
          name: this.windowCryptoName
        }, stringToUint8Array(text)).then(function (hash) {
          var hVerif = '{' + _this3.algoString + '}' + btoa(String.fromCharCode.apply(String, _toConsumableArray(new Uint8Array(hash))));
          return hVerif == digest ? true : false;
        });
      }

      // --------- Use node crypto module -------
      return new _Promise(function (resolve, reject) {
        var hash = crypto.createHash(_this3.algo);
        hash.update(text);
        var hVerif = '{' + _this3.algoString + '}' + hash.digest('base64');
        return hVerif == digest ? resolve(true) : resolve(false);
      });
    }
  }, {
    key: 'pkpbf2',
    value: function pkpbf2() {
      // --------- Use this.wCrypto -------
      if (this.windowCrypto) {
        return this.wCrypto.subtle.generateKey({
          name: "PBKDF2"
        }, false, //whether the key is extractable (i.e. can be used in exportKey)
        ["deriveKey", "deriveBits"] //can be any combination of "deriveKey" and "deriveBits"
        );
      }
    }
  }]);

  return Hash;
}(_Common2.default);
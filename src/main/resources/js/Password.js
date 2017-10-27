'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PasswordObj = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Common = require('./Common.js');

var _Common2 = _interopRequireDefault(_Common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Promise = typeof Promise === 'undefined' ? require('es6-promise').Promise : Promise;

var crypto = require('crypto');

var PBKDF2_ITERATION = 10000;
var PBKDF2_HASH = 'sha256';
var BLOCK_SIZE = 16;

/**
*******************************************************************************
**** Authentication and Password **********************************************
*******************************************************************************
*/

var PasswordObj = exports.PasswordObj = function (_CryptoObject) {
  _inherits(PasswordObj, _CryptoObject);

  function PasswordObj() {
    var byteLength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 32;

    _classCallCheck(this, PasswordObj);

    var _this = _possibleConstructorReturn(this, (PasswordObj.__proto__ || Object.getPrototypeOf(PasswordObj)).call(this));

    _this.byteLength = byteLength;
    _this.struct = undefined;
    return _this;
  }

  _createClass(PasswordObj, [{
    key: 'extract',
    value: function extract() {
      var _this2 = this;

      return new _Promise(function (resolve, reject) {
        resolve(_this2.struct);
      });
    }
  }, {
    key: 'pkpbf2',
    value: function pkpbf2(password) {
      var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      var b64Salt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

      var _this3 = this;

      var iteration = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : PBKDF2_ITERATION;
      var hash = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : PBKDF2_HASH;

      var salt = b64Salt ? new Buffer(b64Salt, 'base64') : crypto.randomBytes(BLOCK_SIZE);
      var keyStruct = {
        "iteration": iteration,
        "hash": hash,
        "salt": salt.toString('base64'),
        "keylen": length ? length : this.byteLength
      };
      return new _Promise(function (resolve, reject) {
        resolve(crypto.pbkdf2Sync(password, salt, keyStruct.iteration, keyStruct.keylen, keyStruct.hash));
      }).then(function (rawKey) {
        _this3.struct = {
          "key": rawKey.toString('base64'), //  Uint8Array coded un base64
          "salt": keyStruct.salt,
          "iteration": keyStruct.iteration,
          "hash": keyStruct.hash,
          "keylen": keyStruct.keylen,
          "windowCryptoKey": undefined
        };
      });
    }
  }, {
    key: 'pkpbf2Verify',
    value: function pkpbf2Verify(password, struct) {
      var _this4 = this;

      return new _Promise(function (resolve, reject) {
        resolve(crypto.pbkdf2Sync(password, new Buffer(struct.salt, 'base64'), struct.iteration, struct.keylen ? struct.keylen : _this4.byteLength, struct.hash));
      }).then(function (rawKey) {
        if (rawKey.toString('base64') === struct.key) return true;
        return false;
      });
    }
  }, {
    key: 'content',
    get: function get() {
      return this.struct;
    }
  }]);

  return PasswordObj;
}(_Common2.default);
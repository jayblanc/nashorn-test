(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Nash = exports.Nash = function () {
  function Nash(type) {
    _classCallCheck(this, Nash);

    this.generateconstants(type);
  }

  _createClass(Nash, [{
    key: 'generateconstants',
    value: function generateconstants(type) {
      switch (type) {
        case 'sheldon':
          this.name = 'sheldon';
          this.fullname = "Sheldon Cooper";
          this.age = 45;
          break;
        case 'rajesh':
        default:
          this.name = 'rajesh';
          this.fullname = 'Rajesh Koothrapoly';
          this.age = 38;
      }
    }
  }, {
    key: 'display',
    value: function display(message) {
      var fullname = this.fullname;
      var age = this.age;

      return fullname + "[" + age + "] says: " + message;
    }
  }]);

  return Nash;
}();

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _NashLib = require('./NashLib.js');

Object.keys(_NashLib).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _NashLib[key];
    }
  });
});

},{"./NashLib.js":1}]},{},[2]);

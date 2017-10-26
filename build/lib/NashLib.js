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
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _redata = require('../redata');

var _redata2 = _interopRequireDefault(_redata);

var _redataComponent = require('./redata-component');

var _redataComponent2 = _interopRequireDefault(_redataComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// public stuff -----------------------------------------------------------------------------------

function reactRedata(loader, shouldReload, mapper) {
    // Curry redata with provided information, only the initial data is missing.
    return _redataComponent2.default.bind(null, _redata2.default.bind(null, loader, shouldReload, mapper));
}

// private stuff ----------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------

exports.default = reactRedata;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdC9yZWFjdC1yZWRhdGEuanMiXSwibmFtZXMiOlsicmVhY3RSZWRhdGEiLCJsb2FkZXIiLCJzaG91bGRSZWxvYWQiLCJtYXBwZXIiLCJiaW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQTs7QUFFQSxTQUFTQSxXQUFULENBQXFCQyxNQUFyQixFQUE2QkMsWUFBN0IsRUFBMkNDLE1BQTNDLEVBQW1EO0FBQy9DO0FBQ0EsV0FBTywwQkFBZ0JDLElBQWhCLENBQXFCLElBQXJCLEVBQTJCLGlCQUFPQSxJQUFQLENBQVksSUFBWixFQUFrQkgsTUFBbEIsRUFBMEJDLFlBQTFCLEVBQXdDQyxNQUF4QyxDQUEzQixDQUFQO0FBQ0g7O0FBRUQ7OztBQUdBOztrQkFFZUgsVyIsImZpbGUiOiJyZWFjdC1yZWRhdGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcmVkYXRhIGZyb20gJy4uL3JlZGF0YSc7XG5pbXBvcnQgcmVkYXRhQ29tcG9uZW50IGZyb20gJy4vcmVkYXRhLWNvbXBvbmVudCc7XG5cbi8vIHB1YmxpYyBzdHVmZiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiByZWFjdFJlZGF0YShsb2FkZXIsIHNob3VsZFJlbG9hZCwgbWFwcGVyKSB7XG4gICAgLy8gQ3VycnkgcmVkYXRhIHdpdGggcHJvdmlkZWQgaW5mb3JtYXRpb24sIG9ubHkgdGhlIGluaXRpYWwgZGF0YSBpcyBtaXNzaW5nLlxuICAgIHJldHVybiByZWRhdGFDb21wb25lbnQuYmluZChudWxsLCByZWRhdGEuYmluZChudWxsLCBsb2FkZXIsIHNob3VsZFJlbG9hZCwgbWFwcGVyKSk7XG59XG5cbi8vIHByaXZhdGUgc3R1ZmYgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnQgZGVmYXVsdCByZWFjdFJlZGF0YTtcbiJdfQ==
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compose = exports.composition = exports.reactRedata = undefined;

var _redata = require('./redata');

var _redata2 = _interopRequireDefault(_redata);

var _compose = require('./composition/compose');

var composition = _interopRequireWildcard(_compose);

var _reactRedata = require('./react/react-redata');

var _reactRedata2 = _interopRequireDefault(_reactRedata);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// exports

exports.default = _redata2.default;
exports.reactRedata = _reactRedata2.default;
exports.composition = composition;
exports.compose = composition.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJjb21wb3NpdGlvbiIsInJlYWN0UmVkYXRhIiwiY29tcG9zZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7O0FBQ0E7O0lBQXFCQSxXOztBQUNyQjs7Ozs7Ozs7QUFFQTs7O1FBR1NDLFc7UUFBYUQsVyxHQUFBQSxXO1FBQWFFLE8sR0FOZEYsVyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjcmVhdGUgZnJvbSAnLi9yZWRhdGEnO1xuaW1wb3J0IGNvbXBvc2UsICogYXMgY29tcG9zaXRpb24gZnJvbSAnLi9jb21wb3NpdGlvbi9jb21wb3NlJztcbmltcG9ydCByZWFjdFJlZGF0YSBmcm9tICcuL3JlYWN0L3JlYWN0LXJlZGF0YSc7XG5cbi8vIGV4cG9ydHNcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlO1xuZXhwb3J0IHsgcmVhY3RSZWRhdGEsIGNvbXBvc2l0aW9uLCBjb21wb3NlIH07XG4iXX0=
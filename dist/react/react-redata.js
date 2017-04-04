'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _redata = require('../redata');

var _redata2 = _interopRequireDefault(_redata);

var _redataComponent = require('./redata-component');

var _redataComponent2 = _interopRequireDefault(_redataComponent);

var _compose = require('../composition/compose');

var _compose2 = _interopRequireDefault(_compose);

var _props = require('../composition/props');

var _props2 = _interopRequireDefault(_props);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// public stuff -----------------------------------------------------------------------------------

function reactRedata(loader, shouldReload, mapper) {
    // Curry redata with provided information, only the redata initial ctx is missing.
    return _redataComponent2.default.bind(null, _redata2.default.bind(null, loader, shouldReload, mapper));
}

// Most generic composer.
reactRedata.compose = function (collectionHandler, items) {
    var shouldReload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _compose.defaultShouldReload;
    var mapper = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _compose.defaultMapper;

    return reactRedata((0, _compose2.default)(collectionHandler, items), shouldReload.bind(null, items), mapper);
};

reactRedata.props = reactRedata.compose.bind(null, _props2.default);

// private stuff ----------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------

exports.default = reactRedata;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdC9yZWFjdC1yZWRhdGEuanMiXSwibmFtZXMiOlsicmVhY3RSZWRhdGEiLCJsb2FkZXIiLCJzaG91bGRSZWxvYWQiLCJtYXBwZXIiLCJiaW5kIiwiY29tcG9zZSIsImNvbGxlY3Rpb25IYW5kbGVyIiwiaXRlbXMiLCJwcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBSUE7Ozs7OztBQUVBOztBQUVBLFNBQVNBLFdBQVQsQ0FBcUJDLE1BQXJCLEVBQTZCQyxZQUE3QixFQUEyQ0MsTUFBM0MsRUFBbUQ7QUFDL0M7QUFDQSxXQUFPLDBCQUFnQkMsSUFBaEIsQ0FBcUIsSUFBckIsRUFBMkIsaUJBQU9BLElBQVAsQ0FBWSxJQUFaLEVBQWtCSCxNQUFsQixFQUEwQkMsWUFBMUIsRUFBd0NDLE1BQXhDLENBQTNCLENBQVA7QUFDSDs7QUFFRDtBQUNBSCxZQUFZSyxPQUFaLEdBQXNCLFVBQVVDLGlCQUFWLEVBQTZCQyxLQUE3QixFQUE4RztBQUFBLFFBQTFFTCxZQUEwRTtBQUFBLFFBQS9CQyxNQUErQjs7QUFDaEksV0FBT0gsWUFBWSx1QkFBY00saUJBQWQsRUFBaUNDLEtBQWpDLENBQVosRUFBcURMLGFBQWFFLElBQWIsQ0FBa0IsSUFBbEIsRUFBd0JHLEtBQXhCLENBQXJELEVBQXFGSixNQUFyRixDQUFQO0FBQ0gsQ0FGRDs7QUFJQUgsWUFBWVEsS0FBWixHQUFvQlIsWUFBWUssT0FBWixDQUFvQkQsSUFBcEIsQ0FBeUIsSUFBekIsa0JBQXBCOztBQUVBOztBQUVBOztrQkFFZUosVyIsImZpbGUiOiJyZWFjdC1yZWRhdGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcmVkYXRhIGZyb20gJy4uL3JlZGF0YSc7XG5pbXBvcnQgcmVkYXRhQ29tcG9uZW50IGZyb20gJy4vcmVkYXRhLWNvbXBvbmVudCc7XG5pbXBvcnQgcmVkYXRhQ29tcG9zZSwge1xuICAgIGRlZmF1bHRTaG91bGRSZWxvYWQgYXMgZGVmYXVsdENvbXBvc2VTaG91bGRSZWxvYWQsXG4gICAgZGVmYXVsdE1hcHBlciBhcyBkZWZhdWx0Q29tcG9zZU1hcHBlcixcbn0gZnJvbSAnLi4vY29tcG9zaXRpb24vY29tcG9zZSc7XG5pbXBvcnQgcmVkYXRhUHJvcHMgZnJvbSAnLi4vY29tcG9zaXRpb24vcHJvcHMnO1xuXG4vLyBwdWJsaWMgc3R1ZmYgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gcmVhY3RSZWRhdGEobG9hZGVyLCBzaG91bGRSZWxvYWQsIG1hcHBlcikge1xuICAgIC8vIEN1cnJ5IHJlZGF0YSB3aXRoIHByb3ZpZGVkIGluZm9ybWF0aW9uLCBvbmx5IHRoZSByZWRhdGEgaW5pdGlhbCBjdHggaXMgbWlzc2luZy5cbiAgICByZXR1cm4gcmVkYXRhQ29tcG9uZW50LmJpbmQobnVsbCwgcmVkYXRhLmJpbmQobnVsbCwgbG9hZGVyLCBzaG91bGRSZWxvYWQsIG1hcHBlcikpO1xufVxuXG4vLyBNb3N0IGdlbmVyaWMgY29tcG9zZXIuXG5yZWFjdFJlZGF0YS5jb21wb3NlID0gZnVuY3Rpb24gKGNvbGxlY3Rpb25IYW5kbGVyLCBpdGVtcywgc2hvdWxkUmVsb2FkID0gZGVmYXVsdENvbXBvc2VTaG91bGRSZWxvYWQsIG1hcHBlciA9IGRlZmF1bHRDb21wb3NlTWFwcGVyKSB7XG4gICAgcmV0dXJuIHJlYWN0UmVkYXRhKHJlZGF0YUNvbXBvc2UoY29sbGVjdGlvbkhhbmRsZXIsIGl0ZW1zKSwgc2hvdWxkUmVsb2FkLmJpbmQobnVsbCwgaXRlbXMpLCBtYXBwZXIpO1xufTtcblxucmVhY3RSZWRhdGEucHJvcHMgPSByZWFjdFJlZGF0YS5jb21wb3NlLmJpbmQobnVsbCwgcmVkYXRhUHJvcHMpO1xuXG4vLyBwcml2YXRlIHN0dWZmIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmV4cG9ydCBkZWZhdWx0IHJlYWN0UmVkYXRhO1xuIl19
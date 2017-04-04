'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.defaultMapper = exports.defaultShouldReload = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _redata = require('../redata');

var _shallowequal = require('shallowequal');

var _shallowequal2 = _interopRequireDefault(_shallowequal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function compose(collectionHandler, items) {
    // Init a composition which will hold the data.
    var composition = {};

    // Create a loader that composes the multiple redata items and handles resolution of the Promise using the collectionHandler.
    return composeLoader.bind(null, composition, collectionHandler, items, updateComposition.bind(null, composition));
}

// Default shouldReload that goes through each item redata and asks if the reload is necessary. If any says that it is, a redata happens.
function defaultShouldReload(items, params) {
    // Go through all and check if any redata shouldReload.
    for (var key in items) {
        if (items[key].shouldReload(params)) {
            return true;
        }
    }

    return false;
}

// private stuff ----------------------------------------------------------------------------------

function composeLoader(composition, collectionHandler, items, onUpdate, params) {
    console.log('composeLoader', Array.prototype.slice.call(arguments));
    composition.data = mapKeys(items, function () {
        return _redata.defaultInitialData;
    });

    // Create object with keys and respective redatas bound to the params and onUpdate provided to this loader, and wait for
    // the collectionHandler to determine that the redata collection is resolved.
    return collectionHandler(mapKeys(items, function (redata, key) {
        return redata(params, onUpdate.bind(null, key));
    }))
    // collectionHandler determined that composition is over.
    .then(function (data) {
        console.log('collectionHandler.then', data);
        // If composition data and resolved data are shallow equal, then use data, so that the memory reference doesn't change.
        if (!(0, _shallowequal2.default)(data, composition.data)) {
            composition.data = data;
        } else {
            // Merge previous keys from lastData that are not present in new data. These were provided by onUpdate calls.
            composition.data = _extends({}, composition.data, data);
        }

        // Resolve composition.
        return composition.data;
    });
}

function updateComposition(composition, key, data) {
    console.log('updateComposition', key, data);
    composition.data = _extends({}, composition.data, _defineProperty({}, key, data));
}

function mapKeys(obj) {
    var iteratee = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (value) {
        return value;
    };

    var newObj = {};

    Object.keys(obj).forEach(function (key) {
        newObj[key] = iteratee(obj[key], key, obj);
    });

    return newObj;
}

exports.default = compose;
exports.defaultShouldReload = defaultShouldReload;
exports.defaultMapper = _redata.defaultMapper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb3NpdGlvbi9jb21wb3NlLmpzIl0sIm5hbWVzIjpbImNvbXBvc2UiLCJjb2xsZWN0aW9uSGFuZGxlciIsIml0ZW1zIiwiY29tcG9zaXRpb24iLCJjb21wb3NlTG9hZGVyIiwiYmluZCIsInVwZGF0ZUNvbXBvc2l0aW9uIiwiZGVmYXVsdFNob3VsZFJlbG9hZCIsInBhcmFtcyIsImtleSIsInNob3VsZFJlbG9hZCIsIm9uVXBkYXRlIiwiY29uc29sZSIsImxvZyIsIkFycmF5IiwicHJvdG90eXBlIiwic2xpY2UiLCJjYWxsIiwiYXJndW1lbnRzIiwiZGF0YSIsIm1hcEtleXMiLCJyZWRhdGEiLCJ0aGVuIiwib2JqIiwiaXRlcmF0ZWUiLCJ2YWx1ZSIsIm5ld09iaiIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwiZGVmYXVsdE1hcHBlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7O0FBRUE7Ozs7Ozs7O0FBRUEsU0FBU0EsT0FBVCxDQUFpQkMsaUJBQWpCLEVBQW9DQyxLQUFwQyxFQUEyQztBQUN2QztBQUNBLFFBQU1DLGNBQWMsRUFBcEI7O0FBRUE7QUFDQSxXQUFPQyxjQUFjQyxJQUFkLENBQW1CLElBQW5CLEVBQXlCRixXQUF6QixFQUFzQ0YsaUJBQXRDLEVBQXlEQyxLQUF6RCxFQUFnRUksa0JBQWtCRCxJQUFsQixDQUF1QixJQUF2QixFQUE2QkYsV0FBN0IsQ0FBaEUsQ0FBUDtBQUNIOztBQUVEO0FBQ0EsU0FBU0ksbUJBQVQsQ0FBNkJMLEtBQTdCLEVBQW9DTSxNQUFwQyxFQUE0QztBQUN4QztBQUNBLFNBQUssSUFBTUMsR0FBWCxJQUFrQlAsS0FBbEIsRUFBeUI7QUFDckIsWUFBSUEsTUFBTU8sR0FBTixFQUFXQyxZQUFYLENBQXdCRixNQUF4QixDQUFKLEVBQXFDO0FBQ2pDLG1CQUFPLElBQVA7QUFDSDtBQUNKOztBQUVELFdBQU8sS0FBUDtBQUNIOztBQUVEOztBQUVBLFNBQVNKLGFBQVQsQ0FBdUJELFdBQXZCLEVBQW9DRixpQkFBcEMsRUFBdURDLEtBQXZELEVBQThEUyxRQUE5RCxFQUF3RUgsTUFBeEUsRUFBZ0Y7QUFDaEZJLFlBQVFDLEdBQVIsQ0FBWSxlQUFaLEVBQTZCQyxNQUFNQyxTQUFOLENBQWdCQyxLQUFoQixDQUFzQkMsSUFBdEIsQ0FBMkJDLFNBQTNCLENBQTdCO0FBQ0lmLGdCQUFZZ0IsSUFBWixHQUFtQkMsUUFBUWxCLEtBQVIsRUFBZTtBQUFBO0FBQUEsS0FBZixDQUFuQjs7QUFFQTtBQUNBO0FBQ0EsV0FBT0Qsa0JBQWtCbUIsUUFBUWxCLEtBQVIsRUFBZSxVQUFDbUIsTUFBRCxFQUFTWixHQUFUO0FBQUEsZUFBaUJZLE9BQU9iLE1BQVAsRUFBZUcsU0FBU04sSUFBVCxDQUFjLElBQWQsRUFBb0JJLEdBQXBCLENBQWYsQ0FBakI7QUFBQSxLQUFmLENBQWxCO0FBQ1A7QUFETyxLQUVOYSxJQUZNLENBRUQsVUFBQ0gsSUFBRCxFQUFVO0FBQ3BCUCxnQkFBUUMsR0FBUixDQUFZLHdCQUFaLEVBQXNDTSxJQUF0QztBQUNRO0FBQ0EsWUFBSSxDQUFDLDRCQUFhQSxJQUFiLEVBQW1CaEIsWUFBWWdCLElBQS9CLENBQUwsRUFBMkM7QUFDdkNoQix3QkFBWWdCLElBQVosR0FBbUJBLElBQW5CO0FBQ0gsU0FGRCxNQUVPO0FBQ0g7QUFDQWhCLHdCQUFZZ0IsSUFBWixnQkFBd0JoQixZQUFZZ0IsSUFBcEMsRUFBNkNBLElBQTdDO0FBQ0g7O0FBRUQ7QUFDQSxlQUFPaEIsWUFBWWdCLElBQW5CO0FBQ0gsS0FkTSxDQUFQO0FBZUg7O0FBRUQsU0FBU2IsaUJBQVQsQ0FBMkJILFdBQTNCLEVBQXdDTSxHQUF4QyxFQUE2Q1UsSUFBN0MsRUFBbUQ7QUFDbkRQLFlBQVFDLEdBQVIsQ0FBWSxtQkFBWixFQUFpQ0osR0FBakMsRUFBc0NVLElBQXRDO0FBQ0loQixnQkFBWWdCLElBQVosZ0JBQXdCaEIsWUFBWWdCLElBQXBDLHNCQUEyQ1YsR0FBM0MsRUFBaURVLElBQWpEO0FBQ0g7O0FBRUQsU0FBU0MsT0FBVCxDQUFpQkcsR0FBakIsRUFBbUQ7QUFBQSxRQUE3QkMsUUFBNkIsdUVBQWxCLFVBQUNDLEtBQUQ7QUFBQSxlQUFXQSxLQUFYO0FBQUEsS0FBa0I7O0FBQy9DLFFBQU1DLFNBQVMsRUFBZjs7QUFFQUMsV0FBT0MsSUFBUCxDQUFZTCxHQUFaLEVBQWlCTSxPQUFqQixDQUF5QixVQUFDcEIsR0FBRCxFQUFTO0FBQzlCaUIsZUFBT2pCLEdBQVAsSUFBY2UsU0FBU0QsSUFBSWQsR0FBSixDQUFULEVBQW1CQSxHQUFuQixFQUF3QmMsR0FBeEIsQ0FBZDtBQUNILEtBRkQ7O0FBSUEsV0FBT0csTUFBUDtBQUNIOztrQkFFYzFCLE87UUFDTk8sbUIsR0FBQUEsbUI7UUFBcUJ1QixhIiwiZmlsZSI6ImNvbXBvc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkZWZhdWx0SW5pdGlhbERhdGEsIGRlZmF1bHRNYXBwZXIgfSBmcm9tICcuLi9yZWRhdGEnO1xuXG5pbXBvcnQgc2hhbGxvd2VxdWFsIGZyb20gJ3NoYWxsb3dlcXVhbCc7XG5cbmZ1bmN0aW9uIGNvbXBvc2UoY29sbGVjdGlvbkhhbmRsZXIsIGl0ZW1zKSB7XG4gICAgLy8gSW5pdCBhIGNvbXBvc2l0aW9uIHdoaWNoIHdpbGwgaG9sZCB0aGUgZGF0YS5cbiAgICBjb25zdCBjb21wb3NpdGlvbiA9IHt9O1xuXG4gICAgLy8gQ3JlYXRlIGEgbG9hZGVyIHRoYXQgY29tcG9zZXMgdGhlIG11bHRpcGxlIHJlZGF0YSBpdGVtcyBhbmQgaGFuZGxlcyByZXNvbHV0aW9uIG9mIHRoZSBQcm9taXNlIHVzaW5nIHRoZSBjb2xsZWN0aW9uSGFuZGxlci5cbiAgICByZXR1cm4gY29tcG9zZUxvYWRlci5iaW5kKG51bGwsIGNvbXBvc2l0aW9uLCBjb2xsZWN0aW9uSGFuZGxlciwgaXRlbXMsIHVwZGF0ZUNvbXBvc2l0aW9uLmJpbmQobnVsbCwgY29tcG9zaXRpb24pKTtcbn1cblxuLy8gRGVmYXVsdCBzaG91bGRSZWxvYWQgdGhhdCBnb2VzIHRocm91Z2ggZWFjaCBpdGVtIHJlZGF0YSBhbmQgYXNrcyBpZiB0aGUgcmVsb2FkIGlzIG5lY2Vzc2FyeS4gSWYgYW55IHNheXMgdGhhdCBpdCBpcywgYSByZWRhdGEgaGFwcGVucy5cbmZ1bmN0aW9uIGRlZmF1bHRTaG91bGRSZWxvYWQoaXRlbXMsIHBhcmFtcykge1xuICAgIC8vIEdvIHRocm91Z2ggYWxsIGFuZCBjaGVjayBpZiBhbnkgcmVkYXRhIHNob3VsZFJlbG9hZC5cbiAgICBmb3IgKGNvbnN0IGtleSBpbiBpdGVtcykge1xuICAgICAgICBpZiAoaXRlbXNba2V5XS5zaG91bGRSZWxvYWQocGFyYW1zKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8vIHByaXZhdGUgc3R1ZmYgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBjb21wb3NlTG9hZGVyKGNvbXBvc2l0aW9uLCBjb2xsZWN0aW9uSGFuZGxlciwgaXRlbXMsIG9uVXBkYXRlLCBwYXJhbXMpIHtcbmNvbnNvbGUubG9nKCdjb21wb3NlTG9hZGVyJywgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XG4gICAgY29tcG9zaXRpb24uZGF0YSA9IG1hcEtleXMoaXRlbXMsICgpID0+IGRlZmF1bHRJbml0aWFsRGF0YSk7XG5cbiAgICAvLyBDcmVhdGUgb2JqZWN0IHdpdGgga2V5cyBhbmQgcmVzcGVjdGl2ZSByZWRhdGFzIGJvdW5kIHRvIHRoZSBwYXJhbXMgYW5kIG9uVXBkYXRlIHByb3ZpZGVkIHRvIHRoaXMgbG9hZGVyLCBhbmQgd2FpdCBmb3JcbiAgICAvLyB0aGUgY29sbGVjdGlvbkhhbmRsZXIgdG8gZGV0ZXJtaW5lIHRoYXQgdGhlIHJlZGF0YSBjb2xsZWN0aW9uIGlzIHJlc29sdmVkLlxuICAgIHJldHVybiBjb2xsZWN0aW9uSGFuZGxlcihtYXBLZXlzKGl0ZW1zLCAocmVkYXRhLCBrZXkpID0+IHJlZGF0YShwYXJhbXMsIG9uVXBkYXRlLmJpbmQobnVsbCwga2V5KSkpKVxuICAgIC8vIGNvbGxlY3Rpb25IYW5kbGVyIGRldGVybWluZWQgdGhhdCBjb21wb3NpdGlvbiBpcyBvdmVyLlxuICAgIC50aGVuKChkYXRhKSA9PiB7XG5jb25zb2xlLmxvZygnY29sbGVjdGlvbkhhbmRsZXIudGhlbicsIGRhdGEpXG4gICAgICAgIC8vIElmIGNvbXBvc2l0aW9uIGRhdGEgYW5kIHJlc29sdmVkIGRhdGEgYXJlIHNoYWxsb3cgZXF1YWwsIHRoZW4gdXNlIGRhdGEsIHNvIHRoYXQgdGhlIG1lbW9yeSByZWZlcmVuY2UgZG9lc24ndCBjaGFuZ2UuXG4gICAgICAgIGlmICghc2hhbGxvd2VxdWFsKGRhdGEsIGNvbXBvc2l0aW9uLmRhdGEpKSB7XG4gICAgICAgICAgICBjb21wb3NpdGlvbi5kYXRhID0gZGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE1lcmdlIHByZXZpb3VzIGtleXMgZnJvbSBsYXN0RGF0YSB0aGF0IGFyZSBub3QgcHJlc2VudCBpbiBuZXcgZGF0YS4gVGhlc2Ugd2VyZSBwcm92aWRlZCBieSBvblVwZGF0ZSBjYWxscy5cbiAgICAgICAgICAgIGNvbXBvc2l0aW9uLmRhdGEgPSB7IC4uLmNvbXBvc2l0aW9uLmRhdGEsIC4uLmRhdGEgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlc29sdmUgY29tcG9zaXRpb24uXG4gICAgICAgIHJldHVybiBjb21wb3NpdGlvbi5kYXRhO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVDb21wb3NpdGlvbihjb21wb3NpdGlvbiwga2V5LCBkYXRhKSB7XG5jb25zb2xlLmxvZygndXBkYXRlQ29tcG9zaXRpb24nLCBrZXksIGRhdGEpO1xuICAgIGNvbXBvc2l0aW9uLmRhdGEgPSB7IC4uLmNvbXBvc2l0aW9uLmRhdGEsIFtrZXldOiBkYXRhIH07XG59XG5cbmZ1bmN0aW9uIG1hcEtleXMob2JqLCBpdGVyYXRlZSA9ICh2YWx1ZSkgPT4gdmFsdWUpIHtcbiAgICBjb25zdCBuZXdPYmogPSB7fTtcblxuICAgIE9iamVjdC5rZXlzKG9iaikuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgIG5ld09ialtrZXldID0gaXRlcmF0ZWUob2JqW2tleV0sIGtleSwgb2JqKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBuZXdPYmo7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbXBvc2U7XG5leHBvcnQgeyBkZWZhdWx0U2hvdWxkUmVsb2FkLCBkZWZhdWx0TWFwcGVyIH07XG4iXX0=
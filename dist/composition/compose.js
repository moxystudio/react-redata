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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb3NpdGlvbi9jb21wb3NlLmpzIl0sIm5hbWVzIjpbImNvbXBvc2UiLCJjb2xsZWN0aW9uSGFuZGxlciIsIml0ZW1zIiwiY29tcG9zaXRpb24iLCJjb21wb3NlTG9hZGVyIiwiYmluZCIsInVwZGF0ZUNvbXBvc2l0aW9uIiwiZGVmYXVsdFNob3VsZFJlbG9hZCIsInBhcmFtcyIsImtleSIsInNob3VsZFJlbG9hZCIsIm9uVXBkYXRlIiwiY29uc29sZSIsImxvZyIsIkFycmF5IiwicHJvdG90eXBlIiwic2xpY2UiLCJjYWxsIiwiYXJndW1lbnRzIiwiZGF0YSIsIm1hcEtleXMiLCJyZWRhdGEiLCJ0aGVuIiwib2JqIiwiaXRlcmF0ZWUiLCJ2YWx1ZSIsIm5ld09iaiIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwiZGVmYXVsdE1hcHBlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7Ozs7O0FBRUEsU0FBU0EsT0FBVCxDQUFpQkMsaUJBQWpCLEVBQW9DQyxLQUFwQyxFQUEyQztBQUN2QztBQUNBLFFBQU1DLGNBQWMsRUFBcEI7O0FBRUE7QUFDQSxXQUFPQyxjQUFjQyxJQUFkLENBQW1CLElBQW5CLEVBQXlCRixXQUF6QixFQUFzQ0YsaUJBQXRDLEVBQXlEQyxLQUF6RCxFQUFnRUksa0JBQWtCRCxJQUFsQixDQUF1QixJQUF2QixFQUE2QkYsV0FBN0IsQ0FBaEUsQ0FBUDtBQUNIOztBQUVEO0FBQ0EsU0FBU0ksbUJBQVQsQ0FBNkJMLEtBQTdCLEVBQW9DTSxNQUFwQyxFQUE0QztBQUN4QztBQUNBLFNBQUssSUFBTUMsR0FBWCxJQUFrQlAsS0FBbEIsRUFBeUI7QUFDckIsWUFBSUEsTUFBTU8sR0FBTixFQUFXQyxZQUFYLENBQXdCRixNQUF4QixDQUFKLEVBQXFDO0FBQ2pDLG1CQUFPLElBQVA7QUFDSDtBQUNKOztBQUVELFdBQU8sS0FBUDtBQUNIOztBQUVEOztBQUVBLFNBQVNKLGFBQVQsQ0FBdUJELFdBQXZCLEVBQW9DRixpQkFBcEMsRUFBdURDLEtBQXZELEVBQThEUyxRQUE5RCxFQUF3RUgsTUFBeEUsRUFBZ0Y7QUFDaEZJLFlBQVFDLEdBQVIsQ0FBWSxlQUFaLEVBQTZCQyxNQUFNQyxTQUFOLENBQWdCQyxLQUFoQixDQUFzQkMsSUFBdEIsQ0FBMkJDLFNBQTNCLENBQTdCO0FBQ0lmLGdCQUFZZ0IsSUFBWixHQUFtQkMsUUFBUWxCLEtBQVIsRUFBZTtBQUFBO0FBQUEsS0FBZixDQUFuQjs7QUFFQTtBQUNBO0FBQ0EsV0FBT0Qsa0JBQWtCbUIsUUFBUWxCLEtBQVIsRUFBZSxVQUFDbUIsTUFBRCxFQUFTWixHQUFUO0FBQUEsZUFBaUJZLE9BQU9iLE1BQVAsRUFBZUcsU0FBU04sSUFBVCxDQUFjLElBQWQsRUFBb0JJLEdBQXBCLENBQWYsQ0FBakI7QUFBQSxLQUFmLENBQWxCO0FBQ1A7QUFETyxLQUVOYSxJQUZNLENBRUQsVUFBQ0gsSUFBRCxFQUFVO0FBQ3BCUCxnQkFBUUMsR0FBUixDQUFZLHdCQUFaLEVBQXNDTSxJQUF0QztBQUNRO0FBQ0EsWUFBSSxDQUFDLDRCQUFhQSxJQUFiLEVBQW1CaEIsWUFBWWdCLElBQS9CLENBQUwsRUFBMkM7QUFDdkNoQix3QkFBWWdCLElBQVosR0FBbUJBLElBQW5CO0FBQ0gsU0FGRCxNQUVPO0FBQ0g7QUFDQWhCLHdCQUFZZ0IsSUFBWixnQkFBd0JoQixZQUFZZ0IsSUFBcEMsRUFBNkNBLElBQTdDO0FBQ0g7O0FBRUQ7QUFDQSxlQUFPaEIsWUFBWWdCLElBQW5CO0FBQ0gsS0FkTSxDQUFQO0FBZUg7O0FBRUQsU0FBU2IsaUJBQVQsQ0FBMkJILFdBQTNCLEVBQXdDTSxHQUF4QyxFQUE2Q1UsSUFBN0MsRUFBbUQ7QUFDbkRQLFlBQVFDLEdBQVIsQ0FBWSxtQkFBWixFQUFpQ0osR0FBakMsRUFBc0NVLElBQXRDO0FBQ0loQixnQkFBWWdCLElBQVosZ0JBQXdCaEIsWUFBWWdCLElBQXBDLHNCQUEyQ1YsR0FBM0MsRUFBaURVLElBQWpEO0FBQ0g7O0FBRUQsU0FBU0MsT0FBVCxDQUFpQkcsR0FBakIsRUFBbUQ7QUFBQSxRQUE3QkMsUUFBNkIsdUVBQWxCLFVBQUNDLEtBQUQ7QUFBQSxlQUFXQSxLQUFYO0FBQUEsS0FBa0I7O0FBQy9DLFFBQU1DLFNBQVMsRUFBZjs7QUFFQUMsV0FBT0MsSUFBUCxDQUFZTCxHQUFaLEVBQWlCTSxPQUFqQixDQUF5QixVQUFDcEIsR0FBRCxFQUFTO0FBQzlCaUIsZUFBT2pCLEdBQVAsSUFBY2UsU0FBU0QsSUFBSWQsR0FBSixDQUFULEVBQW1CQSxHQUFuQixFQUF3QmMsR0FBeEIsQ0FBZDtBQUNILEtBRkQ7O0FBSUEsV0FBT0csTUFBUDtBQUNIOztrQkFFYzFCLE87UUFDTk8sbUIsR0FBQUEsbUI7UUFBcUJ1QixhIiwiZmlsZSI6ImNvbXBvc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkZWZhdWx0SW5pdGlhbERhdGEsIGRlZmF1bHRNYXBwZXIgfSBmcm9tICcuLi9yZWRhdGEnO1xuaW1wb3J0IHNoYWxsb3dlcXVhbCBmcm9tICdzaGFsbG93ZXF1YWwnO1xuXG5mdW5jdGlvbiBjb21wb3NlKGNvbGxlY3Rpb25IYW5kbGVyLCBpdGVtcykge1xuICAgIC8vIEluaXQgYSBjb21wb3NpdGlvbiB3aGljaCB3aWxsIGhvbGQgdGhlIGRhdGEuXG4gICAgY29uc3QgY29tcG9zaXRpb24gPSB7fTtcblxuICAgIC8vIENyZWF0ZSBhIGxvYWRlciB0aGF0IGNvbXBvc2VzIHRoZSBtdWx0aXBsZSByZWRhdGEgaXRlbXMgYW5kIGhhbmRsZXMgcmVzb2x1dGlvbiBvZiB0aGUgUHJvbWlzZSB1c2luZyB0aGUgY29sbGVjdGlvbkhhbmRsZXIuXG4gICAgcmV0dXJuIGNvbXBvc2VMb2FkZXIuYmluZChudWxsLCBjb21wb3NpdGlvbiwgY29sbGVjdGlvbkhhbmRsZXIsIGl0ZW1zLCB1cGRhdGVDb21wb3NpdGlvbi5iaW5kKG51bGwsIGNvbXBvc2l0aW9uKSk7XG59XG5cbi8vIERlZmF1bHQgc2hvdWxkUmVsb2FkIHRoYXQgZ29lcyB0aHJvdWdoIGVhY2ggaXRlbSByZWRhdGEgYW5kIGFza3MgaWYgdGhlIHJlbG9hZCBpcyBuZWNlc3NhcnkuIElmIGFueSBzYXlzIHRoYXQgaXQgaXMsIGEgcmVkYXRhIGhhcHBlbnMuXG5mdW5jdGlvbiBkZWZhdWx0U2hvdWxkUmVsb2FkKGl0ZW1zLCBwYXJhbXMpIHtcbiAgICAvLyBHbyB0aHJvdWdoIGFsbCBhbmQgY2hlY2sgaWYgYW55IHJlZGF0YSBzaG91bGRSZWxvYWQuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gaXRlbXMpIHtcbiAgICAgICAgaWYgKGl0ZW1zW2tleV0uc2hvdWxkUmVsb2FkKHBhcmFtcykpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vLyBwcml2YXRlIHN0dWZmIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gY29tcG9zZUxvYWRlcihjb21wb3NpdGlvbiwgY29sbGVjdGlvbkhhbmRsZXIsIGl0ZW1zLCBvblVwZGF0ZSwgcGFyYW1zKSB7XG5jb25zb2xlLmxvZygnY29tcG9zZUxvYWRlcicsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuICAgIGNvbXBvc2l0aW9uLmRhdGEgPSBtYXBLZXlzKGl0ZW1zLCAoKSA9PiBkZWZhdWx0SW5pdGlhbERhdGEpO1xuXG4gICAgLy8gQ3JlYXRlIG9iamVjdCB3aXRoIGtleXMgYW5kIHJlc3BlY3RpdmUgcmVkYXRhcyBib3VuZCB0byB0aGUgcGFyYW1zIGFuZCBvblVwZGF0ZSBwcm92aWRlZCB0byB0aGlzIGxvYWRlciwgYW5kIHdhaXQgZm9yXG4gICAgLy8gdGhlIGNvbGxlY3Rpb25IYW5kbGVyIHRvIGRldGVybWluZSB0aGF0IHRoZSByZWRhdGEgY29sbGVjdGlvbiBpcyByZXNvbHZlZC5cbiAgICByZXR1cm4gY29sbGVjdGlvbkhhbmRsZXIobWFwS2V5cyhpdGVtcywgKHJlZGF0YSwga2V5KSA9PiByZWRhdGEocGFyYW1zLCBvblVwZGF0ZS5iaW5kKG51bGwsIGtleSkpKSlcbiAgICAvLyBjb2xsZWN0aW9uSGFuZGxlciBkZXRlcm1pbmVkIHRoYXQgY29tcG9zaXRpb24gaXMgb3Zlci5cbiAgICAudGhlbigoZGF0YSkgPT4ge1xuY29uc29sZS5sb2coJ2NvbGxlY3Rpb25IYW5kbGVyLnRoZW4nLCBkYXRhKVxuICAgICAgICAvLyBJZiBjb21wb3NpdGlvbiBkYXRhIGFuZCByZXNvbHZlZCBkYXRhIGFyZSBzaGFsbG93IGVxdWFsLCB0aGVuIHVzZSBkYXRhLCBzbyB0aGF0IHRoZSBtZW1vcnkgcmVmZXJlbmNlIGRvZXNuJ3QgY2hhbmdlLlxuICAgICAgICBpZiAoIXNoYWxsb3dlcXVhbChkYXRhLCBjb21wb3NpdGlvbi5kYXRhKSkge1xuICAgICAgICAgICAgY29tcG9zaXRpb24uZGF0YSA9IGRhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBNZXJnZSBwcmV2aW91cyBrZXlzIGZyb20gbGFzdERhdGEgdGhhdCBhcmUgbm90IHByZXNlbnQgaW4gbmV3IGRhdGEuIFRoZXNlIHdlcmUgcHJvdmlkZWQgYnkgb25VcGRhdGUgY2FsbHMuXG4gICAgICAgICAgICBjb21wb3NpdGlvbi5kYXRhID0geyAuLi5jb21wb3NpdGlvbi5kYXRhLCAuLi5kYXRhIH07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXNvbHZlIGNvbXBvc2l0aW9uLlxuICAgICAgICByZXR1cm4gY29tcG9zaXRpb24uZGF0YTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlQ29tcG9zaXRpb24oY29tcG9zaXRpb24sIGtleSwgZGF0YSkge1xuY29uc29sZS5sb2coJ3VwZGF0ZUNvbXBvc2l0aW9uJywga2V5LCBkYXRhKTtcbiAgICBjb21wb3NpdGlvbi5kYXRhID0geyAuLi5jb21wb3NpdGlvbi5kYXRhLCBba2V5XTogZGF0YSB9O1xufVxuXG5mdW5jdGlvbiBtYXBLZXlzKG9iaiwgaXRlcmF0ZWUgPSAodmFsdWUpID0+IHZhbHVlKSB7XG4gICAgY29uc3QgbmV3T2JqID0ge307XG5cbiAgICBPYmplY3Qua2V5cyhvYmopLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICBuZXdPYmpba2V5XSA9IGl0ZXJhdGVlKG9ialtrZXldLCBrZXksIG9iaik7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbmV3T2JqO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjb21wb3NlO1xuZXhwb3J0IHsgZGVmYXVsdFNob3VsZFJlbG9hZCwgZGVmYXVsdE1hcHBlciB9O1xuIl19
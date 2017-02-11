'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _redata = require('./redata');

var _redata2 = _interopRequireDefault(_redata);

var _shallowequal = require('shallowequal');

var _shallowequal2 = _interopRequireDefault(_shallowequal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function compose(collectionHandler, items) {
    var shouldReload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultShouldReload;
    var mapper = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _redata.defaultMapper;

    // Init a ctx which will hold the data of the composition.
    var ctx = {};

    // Create a redata that composes the multiple redata items and handles resolution of the Promise using the collectionHandler.
    return (0, _redata2.default)(composeLoader.bind(null, ctx, collectionHandler, items, function (key, data) {
        // Store data in its key.
        ctx.newData[key] = data;
    }), shouldReload, mapper)
    // collectionHandler determined that composition is over.
    .then(function (data) {
        // Make sure that the resolved data is stored in newData.
        ctx.newData = data;

        // if lastData and newData are shallow equal, then use lastData, so that the memory reference doesn't change.
        if ((0, _shallowequal2.default)(data, ctx.lastData)) {
            ctx.newData = ctx.lastData;
        }

        // Resolve composition.
        return ctx.newData;
    });
}

// private stuff ----------------------------------------------------------------------------------

function composeLoader(ctx, collectionHandler, items, params, onUpdate) {
    ctx.newData = mapKeys(items, function () {
        return _redata.defaultInitialData;
    });
    ctx.final = false;

    return collectionHandler(mapKeys(items, function (redata, key) {
        return redata(params, onUpdate.bind(null, key));
    }));
}

// By default, any composition should reload, and it's up to the parts to decide what to do.
function defaultShouldReload() {
    return true;
}

function mapKeys(obj) {
    var iteratee = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (value) {
        return value;
    };

    var newObj = {};

    Object.keys(obj).each(function (key) {
        newObj[key] = iteratee(obj[key], key, obj);
    });

    return newObj;
}

exports.default = compose;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb3NpdGlvbi9jb21wb3NlLmpzIl0sIm5hbWVzIjpbImNvbXBvc2UiLCJjb2xsZWN0aW9uSGFuZGxlciIsIml0ZW1zIiwic2hvdWxkUmVsb2FkIiwiZGVmYXVsdFNob3VsZFJlbG9hZCIsIm1hcHBlciIsImN0eCIsImNvbXBvc2VMb2FkZXIiLCJiaW5kIiwia2V5IiwiZGF0YSIsIm5ld0RhdGEiLCJ0aGVuIiwibGFzdERhdGEiLCJwYXJhbXMiLCJvblVwZGF0ZSIsIm1hcEtleXMiLCJmaW5hbCIsInJlZGF0YSIsIm9iaiIsIml0ZXJhdGVlIiwidmFsdWUiLCJuZXdPYmoiLCJPYmplY3QiLCJrZXlzIiwiZWFjaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUEsU0FBU0EsT0FBVCxDQUFpQkMsaUJBQWpCLEVBQW9DQyxLQUFwQyxFQUF1RztBQUFBLFFBQTVEQyxZQUE0RCx1RUFBN0NDLG1CQUE2QztBQUFBLFFBQXhCQyxNQUF3Qjs7QUFDbkc7QUFDQSxRQUFNQyxNQUFNLEVBQVo7O0FBRUE7QUFDQSxXQUFPLHNCQUFhQyxjQUFjQyxJQUFkLENBQW1CLElBQW5CLEVBQXlCRixHQUF6QixFQUE4QkwsaUJBQTlCLEVBQWlEQyxLQUFqRCxFQUF3RCxVQUFDTyxHQUFELEVBQU1DLElBQU4sRUFBZTtBQUN2RjtBQUNBSixZQUFJSyxPQUFKLENBQVlGLEdBQVosSUFBbUJDLElBQW5CO0FBQ0gsS0FIbUIsQ0FBYixFQUdIUCxZQUhHLEVBR1dFLE1BSFg7QUFJUDtBQUpPLEtBS05PLElBTE0sQ0FLRCxVQUFDRixJQUFELEVBQVU7QUFDWjtBQUNBSixZQUFJSyxPQUFKLEdBQWNELElBQWQ7O0FBRUE7QUFDQSxZQUFJLDRCQUFhQSxJQUFiLEVBQW1CSixJQUFJTyxRQUF2QixDQUFKLEVBQXNDO0FBQ2xDUCxnQkFBSUssT0FBSixHQUFjTCxJQUFJTyxRQUFsQjtBQUNIOztBQUVEO0FBQ0EsZUFBT1AsSUFBSUssT0FBWDtBQUNILEtBaEJNLENBQVA7QUFpQkg7O0FBRUQ7O0FBRUEsU0FBU0osYUFBVCxDQUF1QkQsR0FBdkIsRUFBNEJMLGlCQUE1QixFQUErQ0MsS0FBL0MsRUFBc0RZLE1BQXRELEVBQThEQyxRQUE5RCxFQUF3RTtBQUNwRVQsUUFBSUssT0FBSixHQUFjSyxRQUFRZCxLQUFSLEVBQWU7QUFBQTtBQUFBLEtBQWYsQ0FBZDtBQUNBSSxRQUFJVyxLQUFKLEdBQVksS0FBWjs7QUFFQSxXQUFPaEIsa0JBQWtCZSxRQUFRZCxLQUFSLEVBQWUsVUFBQ2dCLE1BQUQsRUFBU1QsR0FBVDtBQUFBLGVBQWlCUyxPQUFPSixNQUFQLEVBQWVDLFNBQVNQLElBQVQsQ0FBYyxJQUFkLEVBQW9CQyxHQUFwQixDQUFmLENBQWpCO0FBQUEsS0FBZixDQUFsQixDQUFQO0FBQ0g7O0FBRUQ7QUFDQSxTQUFTTCxtQkFBVCxHQUErQjtBQUMzQixXQUFPLElBQVA7QUFDSDs7QUFFRCxTQUFTWSxPQUFULENBQWlCRyxHQUFqQixFQUFtRDtBQUFBLFFBQTdCQyxRQUE2Qix1RUFBbEIsVUFBQ0MsS0FBRDtBQUFBLGVBQVdBLEtBQVg7QUFBQSxLQUFrQjs7QUFDL0MsUUFBTUMsU0FBUyxFQUFmOztBQUVBQyxXQUFPQyxJQUFQLENBQVlMLEdBQVosRUFBaUJNLElBQWpCLENBQXNCLFVBQUNoQixHQUFELEVBQVM7QUFDM0JhLGVBQU9iLEdBQVAsSUFBY1csU0FBU0QsSUFBSVYsR0FBSixDQUFULEVBQW1CQSxHQUFuQixFQUF3QlUsR0FBeEIsQ0FBZDtBQUNILEtBRkQ7O0FBSUEsV0FBT0csTUFBUDtBQUNIOztrQkFFY3RCLE8iLCJmaWxlIjoiY29tcG9zZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjb25maWdSZWRhdGEsIHsgZGVmYXVsdE1hcHBlciwgZGVmYXVsdEluaXRpYWxEYXRhIH0gZnJvbSAnLi9yZWRhdGEnO1xuaW1wb3J0IHNoYWxsb3dlcXVhbCBmcm9tICdzaGFsbG93ZXF1YWwnO1xuXG5mdW5jdGlvbiBjb21wb3NlKGNvbGxlY3Rpb25IYW5kbGVyLCBpdGVtcywgc2hvdWxkUmVsb2FkID0gZGVmYXVsdFNob3VsZFJlbG9hZCwgbWFwcGVyID0gZGVmYXVsdE1hcHBlcikge1xuICAgIC8vIEluaXQgYSBjdHggd2hpY2ggd2lsbCBob2xkIHRoZSBkYXRhIG9mIHRoZSBjb21wb3NpdGlvbi5cbiAgICBjb25zdCBjdHggPSB7fTtcblxuICAgIC8vIENyZWF0ZSBhIHJlZGF0YSB0aGF0IGNvbXBvc2VzIHRoZSBtdWx0aXBsZSByZWRhdGEgaXRlbXMgYW5kIGhhbmRsZXMgcmVzb2x1dGlvbiBvZiB0aGUgUHJvbWlzZSB1c2luZyB0aGUgY29sbGVjdGlvbkhhbmRsZXIuXG4gICAgcmV0dXJuIGNvbmZpZ1JlZGF0YShjb21wb3NlTG9hZGVyLmJpbmQobnVsbCwgY3R4LCBjb2xsZWN0aW9uSGFuZGxlciwgaXRlbXMsIChrZXksIGRhdGEpID0+IHtcbiAgICAgICAgLy8gU3RvcmUgZGF0YSBpbiBpdHMga2V5LlxuICAgICAgICBjdHgubmV3RGF0YVtrZXldID0gZGF0YTtcbiAgICB9KSwgc2hvdWxkUmVsb2FkLCBtYXBwZXIpXG4gICAgLy8gY29sbGVjdGlvbkhhbmRsZXIgZGV0ZXJtaW5lZCB0aGF0IGNvbXBvc2l0aW9uIGlzIG92ZXIuXG4gICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgLy8gTWFrZSBzdXJlIHRoYXQgdGhlIHJlc29sdmVkIGRhdGEgaXMgc3RvcmVkIGluIG5ld0RhdGEuXG4gICAgICAgIGN0eC5uZXdEYXRhID0gZGF0YTtcblxuICAgICAgICAvLyBpZiBsYXN0RGF0YSBhbmQgbmV3RGF0YSBhcmUgc2hhbGxvdyBlcXVhbCwgdGhlbiB1c2UgbGFzdERhdGEsIHNvIHRoYXQgdGhlIG1lbW9yeSByZWZlcmVuY2UgZG9lc24ndCBjaGFuZ2UuXG4gICAgICAgIGlmIChzaGFsbG93ZXF1YWwoZGF0YSwgY3R4Lmxhc3REYXRhKSkge1xuICAgICAgICAgICAgY3R4Lm5ld0RhdGEgPSBjdHgubGFzdERhdGE7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXNvbHZlIGNvbXBvc2l0aW9uLlxuICAgICAgICByZXR1cm4gY3R4Lm5ld0RhdGE7XG4gICAgfSk7XG59XG5cbi8vIHByaXZhdGUgc3R1ZmYgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBjb21wb3NlTG9hZGVyKGN0eCwgY29sbGVjdGlvbkhhbmRsZXIsIGl0ZW1zLCBwYXJhbXMsIG9uVXBkYXRlKSB7XG4gICAgY3R4Lm5ld0RhdGEgPSBtYXBLZXlzKGl0ZW1zLCAoKSA9PiBkZWZhdWx0SW5pdGlhbERhdGEpO1xuICAgIGN0eC5maW5hbCA9IGZhbHNlO1xuXG4gICAgcmV0dXJuIGNvbGxlY3Rpb25IYW5kbGVyKG1hcEtleXMoaXRlbXMsIChyZWRhdGEsIGtleSkgPT4gcmVkYXRhKHBhcmFtcywgb25VcGRhdGUuYmluZChudWxsLCBrZXkpKSkpO1xufVxuXG4vLyBCeSBkZWZhdWx0LCBhbnkgY29tcG9zaXRpb24gc2hvdWxkIHJlbG9hZCwgYW5kIGl0J3MgdXAgdG8gdGhlIHBhcnRzIHRvIGRlY2lkZSB3aGF0IHRvIGRvLlxuZnVuY3Rpb24gZGVmYXVsdFNob3VsZFJlbG9hZCgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gbWFwS2V5cyhvYmosIGl0ZXJhdGVlID0gKHZhbHVlKSA9PiB2YWx1ZSkge1xuICAgIGNvbnN0IG5ld09iaiA9IHt9O1xuXG4gICAgT2JqZWN0LmtleXMob2JqKS5lYWNoKChrZXkpID0+IHtcbiAgICAgICAgbmV3T2JqW2tleV0gPSBpdGVyYXRlZShvYmpba2V5XSwga2V5LCBvYmopO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5ld09iajtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY29tcG9zZTtcbiJdfQ==
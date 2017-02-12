'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.compose = exports.props = exports.defaultInitialData = exports.defaultInitialCtx = exports.defaultMapper = exports.defaultShouldReload = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _shallowequal = require('shallowequal');

var _shallowequal2 = _interopRequireDefault(_shallowequal);

var _compose = require('./composition/compose');

var _compose2 = _interopRequireDefault(_compose);

var _props = require('./composition/props');

var _props2 = _interopRequireDefault(_props);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * redata's data object definition
 * @typedef {Object} Data
 * @property {boolean} loading - true if the loader is still running, false otherwise.
 * @property {error} error - instance of Error in case the loader failed, undefined otherwise.
 * @property {*} result - result of the loader, or undefined if the loader is still running.
 */

/**
 * @param {function} loader - called to fetch new data
 * @param {function} [shouldReload = defaultShouldReload] - decides whether a redata should occur
 * @param {function} [mapper = defaultMapper] - maps the {@link Data} object values to your component's props
 * @param {object} [initialCtx = defaultInitialCtx] - starting point of redata, defines if there's any preloaded data
 * @returns {function} redata wrapper function
 */
function configRedata(loader) {
    var shouldReload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultShouldReload;
    var mapper = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultMapper;
    var initialCtx = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : defaultInitialCtx;

    // Initialise context, which is passed around and holds the lastData.
    var ctx = initialCtx;

    function redata(params, onUpdate) {
        // If should not reload the data.
        if (!shouldReload(params)) {
            // Inform any subscriber.
            onUpdate && onUpdate(ctx.lastData);

            // Resolve with last data.
            return Promise.resolve(ctx.lastData);
        }

        // Data not valid, will load new data and subscribe to its updates.
        // Reset the lastData, since it is no longer valid.
        ctx.lastData = _extends({}, defaultInitialData);

        // Update any subscriber about new data.
        onUpdate && onUpdate(ctx.lastData);

        // Store promise reference in order to check which is the last one if multiple resolve.
        ctx.promise = load(ctx, loader, params, onUpdate);

        return ctx.promise;
    }

    // Store mapper for future reference in redata compositions.
    redata.map = mapper;

    return redata;
}

// Default initial context for new redatas.
var defaultInitialCtx = {
    lastData: undefined };

var defaultInitialData = { loading: true, error: undefined, result: undefined };

function defaultShouldReload() {
    return false;
}

function defaultMapper(data) {
    return data;
}

// private stuff ----------------------------------------------------------------------------------

function load(ctx, loader, params, onUpdate) {
    // Create an object that holds the loadedData promise, so we can compare on handleLoadResult, and ignore promises that
    // did not originate from the very last load that happened.
    var loadedData = {};

    loadedData.promise = loader(params, handleLoadResult.bind(null, ctx, loadedData, onUpdate, true)).then(handleLoadResult.bind(null, ctx, loadedData, onUpdate, false, undefined)).catch(handleLoadResult.bind(null, ctx, loadedData, onUpdate, false));

    // Return promise for data.
    return loadedData.promise;
}

function handleLoadResult(ctx, loadedData, onUpdate, loading, error, result) {
    // If not the promise from last load, ignore.
    if (ctx.promise !== loadedData.promise) {
        return;
    }

    var lastData = ctx.lastData;

    // Store final data.
    ctx.lastData = { loading: loading, error: error, result: result };

    // If lastData and final data not the same, then user didn't call onUpdate. Do it for them.
    onUpdate && !(0, _shallowequal2.default)(lastData, ctx.lastData) && onUpdate(ctx.lastData);

    // Finally resolve load promise.
    return ctx.lastData;
}

// ------------------------------------------------------------------------------------------------

exports.default = configRedata;
exports.defaultShouldReload = defaultShouldReload;
exports.defaultMapper = defaultMapper;
exports.defaultInitialCtx = defaultInitialCtx;
exports.defaultInitialData = defaultInitialData;
exports.props = _props2.default;
exports.compose = _compose2.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yZWRhdGEuanMiXSwibmFtZXMiOlsiY29uZmlnUmVkYXRhIiwibG9hZGVyIiwic2hvdWxkUmVsb2FkIiwiZGVmYXVsdFNob3VsZFJlbG9hZCIsIm1hcHBlciIsImRlZmF1bHRNYXBwZXIiLCJpbml0aWFsQ3R4IiwiZGVmYXVsdEluaXRpYWxDdHgiLCJjdHgiLCJyZWRhdGEiLCJwYXJhbXMiLCJvblVwZGF0ZSIsImxhc3REYXRhIiwiUHJvbWlzZSIsInJlc29sdmUiLCJkZWZhdWx0SW5pdGlhbERhdGEiLCJwcm9taXNlIiwibG9hZCIsIm1hcCIsInVuZGVmaW5lZCIsImxvYWRpbmciLCJlcnJvciIsInJlc3VsdCIsImRhdGEiLCJsb2FkZWREYXRhIiwiaGFuZGxlTG9hZFJlc3VsdCIsImJpbmQiLCJ0aGVuIiwiY2F0Y2giLCJwcm9wcyIsImNvbXBvc2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUE7Ozs7Ozs7O0FBUUE7Ozs7Ozs7QUFPQSxTQUFTQSxZQUFULENBQXNCQyxNQUF0QixFQUEwSDtBQUFBLFFBQTVGQyxZQUE0Rix1RUFBN0VDLG1CQUE2RTtBQUFBLFFBQXhEQyxNQUF3RCx1RUFBL0NDLGFBQStDO0FBQUEsUUFBaENDLFVBQWdDLHVFQUFuQkMsaUJBQW1COztBQUN0SDtBQUNBLFFBQU1DLE1BQU1GLFVBQVo7O0FBRUEsYUFBU0csTUFBVCxDQUFnQkMsTUFBaEIsRUFBd0JDLFFBQXhCLEVBQWtDO0FBQzlCO0FBQ0EsWUFBSSxDQUFDVCxhQUFhUSxNQUFiLENBQUwsRUFBMkI7QUFDdkI7QUFDQUMsd0JBQVlBLFNBQVNILElBQUlJLFFBQWIsQ0FBWjs7QUFFQTtBQUNBLG1CQUFPQyxRQUFRQyxPQUFSLENBQWdCTixJQUFJSSxRQUFwQixDQUFQO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBSixZQUFJSSxRQUFKLGdCQUFvQkcsa0JBQXBCOztBQUVBO0FBQ0FKLG9CQUFZQSxTQUFTSCxJQUFJSSxRQUFiLENBQVo7O0FBRUE7QUFDQUosWUFBSVEsT0FBSixHQUFjQyxLQUFLVCxHQUFMLEVBQVVQLE1BQVYsRUFBa0JTLE1BQWxCLEVBQTBCQyxRQUExQixDQUFkOztBQUVBLGVBQU9ILElBQUlRLE9BQVg7QUFDSDs7QUFFRDtBQUNBUCxXQUFPUyxHQUFQLEdBQWFkLE1BQWI7O0FBRUEsV0FBT0ssTUFBUDtBQUNIOztBQUVEO0FBQ0EsSUFBTUYsb0JBQW9CO0FBQ3RCSyxjQUFVTyxTQURZLEVBQTFCOztBQUlBLElBQU1KLHFCQUFxQixFQUFFSyxTQUFTLElBQVgsRUFBaUJDLE9BQU9GLFNBQXhCLEVBQW1DRyxRQUFRSCxTQUEzQyxFQUEzQjs7QUFFQSxTQUFTaEIsbUJBQVQsR0FBK0I7QUFDM0IsV0FBTyxLQUFQO0FBQ0g7O0FBRUQsU0FBU0UsYUFBVCxDQUF1QmtCLElBQXZCLEVBQTZCO0FBQ3pCLFdBQU9BLElBQVA7QUFDSDs7QUFFRDs7QUFFQSxTQUFTTixJQUFULENBQWNULEdBQWQsRUFBbUJQLE1BQW5CLEVBQTJCUyxNQUEzQixFQUFtQ0MsUUFBbkMsRUFBNkM7QUFDekM7QUFDQTtBQUNBLFFBQU1hLGFBQWEsRUFBbkI7O0FBRUFBLGVBQVdSLE9BQVgsR0FBcUJmLE9BQU9TLE1BQVAsRUFBZWUsaUJBQWlCQyxJQUFqQixDQUFzQixJQUF0QixFQUE0QmxCLEdBQTVCLEVBQWlDZ0IsVUFBakMsRUFBNkNiLFFBQTdDLEVBQXVELElBQXZELENBQWYsRUFDVWdCLElBRFYsQ0FDZUYsaUJBQWlCQyxJQUFqQixDQUFzQixJQUF0QixFQUE0QmxCLEdBQTVCLEVBQWlDZ0IsVUFBakMsRUFBNkNiLFFBQTdDLEVBQXVELEtBQXZELEVBQThEUSxTQUE5RCxDQURmLEVBRVNTLEtBRlQsQ0FFZUgsaUJBQWlCQyxJQUFqQixDQUFzQixJQUF0QixFQUE0QmxCLEdBQTVCLEVBQWlDZ0IsVUFBakMsRUFBNkNiLFFBQTdDLEVBQXVELEtBQXZELENBRmYsQ0FBckI7O0FBSUE7QUFDQSxXQUFPYSxXQUFXUixPQUFsQjtBQUNIOztBQUVELFNBQVNTLGdCQUFULENBQTBCakIsR0FBMUIsRUFBK0JnQixVQUEvQixFQUEyQ2IsUUFBM0MsRUFBcURTLE9BQXJELEVBQThEQyxLQUE5RCxFQUFxRUMsTUFBckUsRUFBNkU7QUFDekU7QUFDQSxRQUFJZCxJQUFJUSxPQUFKLEtBQWdCUSxXQUFXUixPQUEvQixFQUF3QztBQUNwQztBQUNIOztBQUVELFFBQU1KLFdBQVdKLElBQUlJLFFBQXJCOztBQUVBO0FBQ0FKLFFBQUlJLFFBQUosR0FBZSxFQUFFUSxnQkFBRixFQUFXQyxZQUFYLEVBQWtCQyxjQUFsQixFQUFmOztBQUVBO0FBQ0FYLGdCQUFZLENBQUMsNEJBQWFDLFFBQWIsRUFBdUJKLElBQUlJLFFBQTNCLENBQWIsSUFBcURELFNBQVNILElBQUlJLFFBQWIsQ0FBckQ7O0FBRUE7QUFDQSxXQUFPSixJQUFJSSxRQUFYO0FBQ0g7O0FBRUQ7O2tCQUVlWixZO1FBQ05HLG1CLEdBQUFBLG1CO1FBQXFCRSxhLEdBQUFBLGE7UUFBZUUsaUIsR0FBQUEsaUI7UUFBbUJRLGtCLEdBQUFBLGtCO1FBQW9CYyxLO1FBQU9DLE8iLCJmaWxlIjoicmVkYXRhLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNoYWxsb3dlcXVhbCBmcm9tICdzaGFsbG93ZXF1YWwnO1xuaW1wb3J0IGNvbXBvc2UgZnJvbSAnLi9jb21wb3NpdGlvbi9jb21wb3NlJztcbmltcG9ydCBwcm9wcyBmcm9tICcuL2NvbXBvc2l0aW9uL3Byb3BzJztcblxuLyoqXG4gKiByZWRhdGEncyBkYXRhIG9iamVjdCBkZWZpbml0aW9uXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBEYXRhXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGxvYWRpbmcgLSB0cnVlIGlmIHRoZSBsb2FkZXIgaXMgc3RpbGwgcnVubmluZywgZmFsc2Ugb3RoZXJ3aXNlLlxuICogQHByb3BlcnR5IHtlcnJvcn0gZXJyb3IgLSBpbnN0YW5jZSBvZiBFcnJvciBpbiBjYXNlIHRoZSBsb2FkZXIgZmFpbGVkLCB1bmRlZmluZWQgb3RoZXJ3aXNlLlxuICogQHByb3BlcnR5IHsqfSByZXN1bHQgLSByZXN1bHQgb2YgdGhlIGxvYWRlciwgb3IgdW5kZWZpbmVkIGlmIHRoZSBsb2FkZXIgaXMgc3RpbGwgcnVubmluZy5cbiAqL1xuXG4vKipcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGxvYWRlciAtIGNhbGxlZCB0byBmZXRjaCBuZXcgZGF0YVxuICogQHBhcmFtIHtmdW5jdGlvbn0gW3Nob3VsZFJlbG9hZCA9IGRlZmF1bHRTaG91bGRSZWxvYWRdIC0gZGVjaWRlcyB3aGV0aGVyIGEgcmVkYXRhIHNob3VsZCBvY2N1clxuICogQHBhcmFtIHtmdW5jdGlvbn0gW21hcHBlciA9IGRlZmF1bHRNYXBwZXJdIC0gbWFwcyB0aGUge0BsaW5rIERhdGF9IG9iamVjdCB2YWx1ZXMgdG8geW91ciBjb21wb25lbnQncyBwcm9wc1xuICogQHBhcmFtIHtvYmplY3R9IFtpbml0aWFsQ3R4ID0gZGVmYXVsdEluaXRpYWxDdHhdIC0gc3RhcnRpbmcgcG9pbnQgb2YgcmVkYXRhLCBkZWZpbmVzIGlmIHRoZXJlJ3MgYW55IHByZWxvYWRlZCBkYXRhXG4gKiBAcmV0dXJucyB7ZnVuY3Rpb259IHJlZGF0YSB3cmFwcGVyIGZ1bmN0aW9uXG4gKi9cbmZ1bmN0aW9uIGNvbmZpZ1JlZGF0YShsb2FkZXIsIHNob3VsZFJlbG9hZCA9IGRlZmF1bHRTaG91bGRSZWxvYWQsIG1hcHBlciA9IGRlZmF1bHRNYXBwZXIsIGluaXRpYWxDdHggPSBkZWZhdWx0SW5pdGlhbEN0eCkge1xuICAgIC8vIEluaXRpYWxpc2UgY29udGV4dCwgd2hpY2ggaXMgcGFzc2VkIGFyb3VuZCBhbmQgaG9sZHMgdGhlIGxhc3REYXRhLlxuICAgIGNvbnN0IGN0eCA9IGluaXRpYWxDdHg7XG5cbiAgICBmdW5jdGlvbiByZWRhdGEocGFyYW1zLCBvblVwZGF0ZSkge1xuICAgICAgICAvLyBJZiBzaG91bGQgbm90IHJlbG9hZCB0aGUgZGF0YS5cbiAgICAgICAgaWYgKCFzaG91bGRSZWxvYWQocGFyYW1zKSkge1xuICAgICAgICAgICAgLy8gSW5mb3JtIGFueSBzdWJzY3JpYmVyLlxuICAgICAgICAgICAgb25VcGRhdGUgJiYgb25VcGRhdGUoY3R4Lmxhc3REYXRhKTtcblxuICAgICAgICAgICAgLy8gUmVzb2x2ZSB3aXRoIGxhc3QgZGF0YS5cbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoY3R4Lmxhc3REYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERhdGEgbm90IHZhbGlkLCB3aWxsIGxvYWQgbmV3IGRhdGEgYW5kIHN1YnNjcmliZSB0byBpdHMgdXBkYXRlcy5cbiAgICAgICAgLy8gUmVzZXQgdGhlIGxhc3REYXRhLCBzaW5jZSBpdCBpcyBubyBsb25nZXIgdmFsaWQuXG4gICAgICAgIGN0eC5sYXN0RGF0YSA9IHsgLi4uZGVmYXVsdEluaXRpYWxEYXRhIH07XG5cbiAgICAgICAgLy8gVXBkYXRlIGFueSBzdWJzY3JpYmVyIGFib3V0IG5ldyBkYXRhLlxuICAgICAgICBvblVwZGF0ZSAmJiBvblVwZGF0ZShjdHgubGFzdERhdGEpO1xuXG4gICAgICAgIC8vIFN0b3JlIHByb21pc2UgcmVmZXJlbmNlIGluIG9yZGVyIHRvIGNoZWNrIHdoaWNoIGlzIHRoZSBsYXN0IG9uZSBpZiBtdWx0aXBsZSByZXNvbHZlLlxuICAgICAgICBjdHgucHJvbWlzZSA9IGxvYWQoY3R4LCBsb2FkZXIsIHBhcmFtcywgb25VcGRhdGUpO1xuXG4gICAgICAgIHJldHVybiBjdHgucHJvbWlzZTtcbiAgICB9XG5cbiAgICAvLyBTdG9yZSBtYXBwZXIgZm9yIGZ1dHVyZSByZWZlcmVuY2UgaW4gcmVkYXRhIGNvbXBvc2l0aW9ucy5cbiAgICByZWRhdGEubWFwID0gbWFwcGVyO1xuXG4gICAgcmV0dXJuIHJlZGF0YTtcbn1cblxuLy8gRGVmYXVsdCBpbml0aWFsIGNvbnRleHQgZm9yIG5ldyByZWRhdGFzLlxuY29uc3QgZGVmYXVsdEluaXRpYWxDdHggPSB7XG4gICAgbGFzdERhdGE6IHVuZGVmaW5lZCwgLy8gSG9sZHMgdGhlIGxhc3QgbG9hZGVkIGRhdGEuXG59O1xuXG5jb25zdCBkZWZhdWx0SW5pdGlhbERhdGEgPSB7IGxvYWRpbmc6IHRydWUsIGVycm9yOiB1bmRlZmluZWQsIHJlc3VsdDogdW5kZWZpbmVkIH07XG5cbmZ1bmN0aW9uIGRlZmF1bHRTaG91bGRSZWxvYWQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0TWFwcGVyKGRhdGEpIHtcbiAgICByZXR1cm4gZGF0YTtcbn1cblxuLy8gcHJpdmF0ZSBzdHVmZiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIGxvYWQoY3R4LCBsb2FkZXIsIHBhcmFtcywgb25VcGRhdGUpIHtcbiAgICAvLyBDcmVhdGUgYW4gb2JqZWN0IHRoYXQgaG9sZHMgdGhlIGxvYWRlZERhdGEgcHJvbWlzZSwgc28gd2UgY2FuIGNvbXBhcmUgb24gaGFuZGxlTG9hZFJlc3VsdCwgYW5kIGlnbm9yZSBwcm9taXNlcyB0aGF0XG4gICAgLy8gZGlkIG5vdCBvcmlnaW5hdGUgZnJvbSB0aGUgdmVyeSBsYXN0IGxvYWQgdGhhdCBoYXBwZW5lZC5cbiAgICBjb25zdCBsb2FkZWREYXRhID0ge307XG5cbiAgICBsb2FkZWREYXRhLnByb21pc2UgPSBsb2FkZXIocGFyYW1zLCBoYW5kbGVMb2FkUmVzdWx0LmJpbmQobnVsbCwgY3R4LCBsb2FkZWREYXRhLCBvblVwZGF0ZSwgdHJ1ZSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oaGFuZGxlTG9hZFJlc3VsdC5iaW5kKG51bGwsIGN0eCwgbG9hZGVkRGF0YSwgb25VcGRhdGUsIGZhbHNlLCB1bmRlZmluZWQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGhhbmRsZUxvYWRSZXN1bHQuYmluZChudWxsLCBjdHgsIGxvYWRlZERhdGEsIG9uVXBkYXRlLCBmYWxzZSkpO1xuXG4gICAgLy8gUmV0dXJuIHByb21pc2UgZm9yIGRhdGEuXG4gICAgcmV0dXJuIGxvYWRlZERhdGEucHJvbWlzZTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlTG9hZFJlc3VsdChjdHgsIGxvYWRlZERhdGEsIG9uVXBkYXRlLCBsb2FkaW5nLCBlcnJvciwgcmVzdWx0KSB7XG4gICAgLy8gSWYgbm90IHRoZSBwcm9taXNlIGZyb20gbGFzdCBsb2FkLCBpZ25vcmUuXG4gICAgaWYgKGN0eC5wcm9taXNlICE9PSBsb2FkZWREYXRhLnByb21pc2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGxhc3REYXRhID0gY3R4Lmxhc3REYXRhO1xuXG4gICAgLy8gU3RvcmUgZmluYWwgZGF0YS5cbiAgICBjdHgubGFzdERhdGEgPSB7IGxvYWRpbmcsIGVycm9yLCByZXN1bHQgfTtcblxuICAgIC8vIElmIGxhc3REYXRhIGFuZCBmaW5hbCBkYXRhIG5vdCB0aGUgc2FtZSwgdGhlbiB1c2VyIGRpZG4ndCBjYWxsIG9uVXBkYXRlLiBEbyBpdCBmb3IgdGhlbS5cbiAgICBvblVwZGF0ZSAmJiAhc2hhbGxvd2VxdWFsKGxhc3REYXRhLCBjdHgubGFzdERhdGEpICYmIG9uVXBkYXRlKGN0eC5sYXN0RGF0YSk7XG5cbiAgICAvLyBGaW5hbGx5IHJlc29sdmUgbG9hZCBwcm9taXNlLlxuICAgIHJldHVybiBjdHgubGFzdERhdGE7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnQgZGVmYXVsdCBjb25maWdSZWRhdGE7XG5leHBvcnQgeyBkZWZhdWx0U2hvdWxkUmVsb2FkLCBkZWZhdWx0TWFwcGVyLCBkZWZhdWx0SW5pdGlhbEN0eCwgZGVmYXVsdEluaXRpYWxEYXRhLCBwcm9wcywgY29tcG9zZSB9O1xuIl19
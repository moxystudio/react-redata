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
function create(loader) {
    var shouldReload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultShouldReload;
    var mapper = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultMapper;
    var initialCtx = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : defaultInitialCtx;

    // Initialise context, which is passed around and holds the lastData.
    var ctx = initialCtx; // TODO: instead of providing a full initial context, the redata() function below should receive
    // a third argument, initialData, which is stored in the ctx. This allows for composed
    // redatas to be fed initially.

    function redata(params, onUpdate) {
        // console.log('redata()', params);
        // If should not reload the data.
        if (!shouldReload(params)) {
            console.log('will not reload');
            // Inform any subscriber.
            onUpdate && onUpdate(ctx.lastData);

            // Resolve with last data.
            return Promise.resolve(ctx.lastData);
        }
        console.log('will reload');
        // Data not valid, will load new data and subscribe to its updates.
        // Reset lastData, since it is no longer valid.
        ctx.lastData = _extends({}, defaultInitialData);
        // debugger;
        // Update any subscriber about new data.
        onUpdate && onUpdate(ctx.lastData);

        // Store promise reference in order to check which is the last one if multiple resolve.
        ctx.promise = load(ctx, loader, params, onUpdate);
        // console.log('storing ctx promise', ctx.promise);
        ctx.promise.loader = loader;
        return ctx.promise;
    }

    // Store shouldReload and mapper for future reference in redata compositions.
    redata.shouldReload = shouldReload;
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
    var loadedData = {
        loading: true };

    loadedData.promise = loader(params, handleLoadResult.bind(null, ctx, loadedData, onUpdate, undefined)) // Do not affect loading status.
    .then(handleLoadResult.bind(null, ctx, loadedData, onUpdate, false, undefined)) // Success, not loading.
    .catch(handleLoadResult.bind(null, ctx, loadedData, onUpdate, false)); // Failed, not loading.

    // Return promise for data.
    return loadedData.promise;
}

function handleLoadResult(ctx, loadedData, onUpdate, loading, error, result) {
    // If not the promise from last load, ignore.
    if (ctx.promise !== loadedData.promise) {
        console.log('IGNORING', ctx.promise, loadedData.promise);
        return;
    }

    var lastData = ctx.lastData;

    // If loading status was provided, update loadedData.
    loading !== undefined && (loadedData.loading = loading);

    // Store final data.
    ctx.lastData = { loading: loadedData.loading, error: error, result: result };

    // If lastData and received data not shallow equal, then loader didn't call onUpdate. Implicitly do it.
    onUpdate && !(0, _shallowequal2.default)(lastData, ctx.lastData) && onUpdate(ctx.lastData);
    console.log('handleLoadResult', ctx.lastData);
    return ctx.lastData;
}

// ------------------------------------------------------------------------------------------------

exports.default = create;
exports.defaultShouldReload = defaultShouldReload;
exports.defaultMapper = defaultMapper;
exports.defaultInitialCtx = defaultInitialCtx;
exports.defaultInitialData = defaultInitialData;
exports.props = _props2.default;
exports.compose = _compose2.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yZWRhdGEuanMiXSwibmFtZXMiOlsiY3JlYXRlIiwibG9hZGVyIiwic2hvdWxkUmVsb2FkIiwiZGVmYXVsdFNob3VsZFJlbG9hZCIsIm1hcHBlciIsImRlZmF1bHRNYXBwZXIiLCJpbml0aWFsQ3R4IiwiZGVmYXVsdEluaXRpYWxDdHgiLCJjdHgiLCJyZWRhdGEiLCJwYXJhbXMiLCJvblVwZGF0ZSIsImNvbnNvbGUiLCJsb2ciLCJsYXN0RGF0YSIsIlByb21pc2UiLCJyZXNvbHZlIiwiZGVmYXVsdEluaXRpYWxEYXRhIiwicHJvbWlzZSIsImxvYWQiLCJtYXAiLCJ1bmRlZmluZWQiLCJsb2FkaW5nIiwiZXJyb3IiLCJyZXN1bHQiLCJkYXRhIiwibG9hZGVkRGF0YSIsImhhbmRsZUxvYWRSZXN1bHQiLCJiaW5kIiwidGhlbiIsImNhdGNoIiwicHJvcHMiLCJjb21wb3NlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBOzs7Ozs7OztBQVFBOzs7Ozs7O0FBT0EsU0FBU0EsTUFBVCxDQUFnQkMsTUFBaEIsRUFBb0g7QUFBQSxRQUE1RkMsWUFBNEYsdUVBQTdFQyxtQkFBNkU7QUFBQSxRQUF4REMsTUFBd0QsdUVBQS9DQyxhQUErQztBQUFBLFFBQWhDQyxVQUFnQyx1RUFBbkJDLGlCQUFtQjs7QUFDaEg7QUFDQSxRQUFNQyxNQUFNRixVQUFaLENBRmdILENBRXhGO0FBQ0E7QUFDQTs7QUFFeEIsYUFBU0csTUFBVCxDQUFnQkMsTUFBaEIsRUFBd0JDLFFBQXhCLEVBQWtDO0FBQ3RDO0FBQ1E7QUFDQSxZQUFJLENBQUNULGFBQWFRLE1BQWIsQ0FBTCxFQUEyQjtBQUNuQ0Usb0JBQVFDLEdBQVIsQ0FBWSxpQkFBWjtBQUNZO0FBQ0FGLHdCQUFZQSxTQUFTSCxJQUFJTSxRQUFiLENBQVo7O0FBRUE7QUFDQSxtQkFBT0MsUUFBUUMsT0FBUixDQUFnQlIsSUFBSU0sUUFBcEIsQ0FBUDtBQUNIO0FBQ1RGLGdC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LE8iLCJmaWxlIjoicmVkYXRhLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNoYWxsb3dlcXVhbCBmcm9tICdzaGFsbG93ZXF1YWwnO1xuaW1wb3J0IGNvbXBvc2UgZnJvbSAnLi9jb21wb3NpdGlvbi9jb21wb3NlJztcbmltcG9ydCBwcm9wcyBmcm9tICcuL2NvbXBvc2l0aW9uL3Byb3BzJztcblxuLyoqXG4gKiByZWRhdGEncyBkYXRhIG9iamVjdCBkZWZpbml0aW9uXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBEYXRhXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGxvYWRpbmcgLSB0cnVlIGlmIHRoZSBsb2FkZXIgaXMgc3RpbGwgcnVubmluZywgZmFsc2Ugb3RoZXJ3aXNlLlxuICogQHByb3BlcnR5IHtlcnJvcn0gZXJyb3IgLSBpbnN0YW5jZSBvZiBFcnJvciBpbiBjYXNlIHRoZSBsb2FkZXIgZmFpbGVkLCB1bmRlZmluZWQgb3RoZXJ3aXNlLlxuICogQHByb3BlcnR5IHsqfSByZXN1bHQgLSByZXN1bHQgb2YgdGhlIGxvYWRlciwgb3IgdW5kZWZpbmVkIGlmIHRoZSBsb2FkZXIgaXMgc3RpbGwgcnVubmluZy5cbiAqL1xuXG4vKipcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGxvYWRlciAtIGNhbGxlZCB0byBmZXRjaCBuZXcgZGF0YVxuICogQHBhcmFtIHtmdW5jdGlvbn0gW3Nob3VsZFJlbG9hZCA9IGRlZmF1bHRTaG91bGRSZWxvYWRdIC0gZGVjaWRlcyB3aGV0aGVyIGEgcmVkYXRhIHNob3VsZCBvY2N1clxuICogQHBhcmFtIHtmdW5jdGlvbn0gW21hcHBlciA9IGRlZmF1bHRNYXBwZXJdIC0gbWFwcyB0aGUge0BsaW5rIERhdGF9IG9iamVjdCB2YWx1ZXMgdG8geW91ciBjb21wb25lbnQncyBwcm9wc1xuICogQHBhcmFtIHtvYmplY3R9IFtpbml0aWFsQ3R4ID0gZGVmYXVsdEluaXRpYWxDdHhdIC0gc3RhcnRpbmcgcG9pbnQgb2YgcmVkYXRhLCBkZWZpbmVzIGlmIHRoZXJlJ3MgYW55IHByZWxvYWRlZCBkYXRhXG4gKiBAcmV0dXJucyB7ZnVuY3Rpb259IHJlZGF0YSB3cmFwcGVyIGZ1bmN0aW9uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZShsb2FkZXIsIHNob3VsZFJlbG9hZCA9IGRlZmF1bHRTaG91bGRSZWxvYWQsIG1hcHBlciA9IGRlZmF1bHRNYXBwZXIsIGluaXRpYWxDdHggPSBkZWZhdWx0SW5pdGlhbEN0eCkge1xuICAgIC8vIEluaXRpYWxpc2UgY29udGV4dCwgd2hpY2ggaXMgcGFzc2VkIGFyb3VuZCBhbmQgaG9sZHMgdGhlIGxhc3REYXRhLlxuICAgIGNvbnN0IGN0eCA9IGluaXRpYWxDdHg7IC8vIFRPRE86IGluc3RlYWQgb2YgcHJvdmlkaW5nIGEgZnVsbCBpbml0aWFsIGNvbnRleHQsIHRoZSByZWRhdGEoKSBmdW5jdGlvbiBiZWxvdyBzaG91bGQgcmVjZWl2ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGEgdGhpcmQgYXJndW1lbnQsIGluaXRpYWxEYXRhLCB3aGljaCBpcyBzdG9yZWQgaW4gdGhlIGN0eC4gVGhpcyBhbGxvd3MgZm9yIGNvbXBvc2VkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVkYXRhcyB0byBiZSBmZWQgaW5pdGlhbGx5LlxuXG4gICAgZnVuY3Rpb24gcmVkYXRhKHBhcmFtcywgb25VcGRhdGUpIHtcbi8vIGNvbnNvbGUubG9nKCdyZWRhdGEoKScsIHBhcmFtcyk7XG4gICAgICAgIC8vIElmIHNob3VsZCBub3QgcmVsb2FkIHRoZSBkYXRhLlxuICAgICAgICBpZiAoIXNob3VsZFJlbG9hZChwYXJhbXMpKSB7XG5jb25zb2xlLmxvZygnd2lsbCBub3QgcmVsb2FkJyk7XG4gICAgICAgICAgICAvLyBJbmZvcm0gYW55IHN1YnNjcmliZXIuXG4gICAgICAgICAgICBvblVwZGF0ZSAmJiBvblVwZGF0ZShjdHgubGFzdERhdGEpO1xuXG4gICAgICAgICAgICAvLyBSZXNvbHZlIHdpdGggbGFzdCBkYXRhLlxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShjdHgubGFzdERhdGEpO1xuICAgICAgICB9XG5jb25zb2xlLmxvZygnd2lsbCByZWxvYWQnKTtcbiAgICAgICAgLy8gRGF0YSBub3QgdmFsaWQsIHdpbGwgbG9hZCBuZXcgZGF0YSBhbmQgc3Vic2NyaWJlIHRvIGl0cyB1cGRhdGVzLlxuICAgICAgICAvLyBSZXNldCBsYXN0RGF0YSwgc2luY2UgaXQgaXMgbm8gbG9uZ2VyIHZhbGlkLlxuICAgICAgICBjdHgubGFzdERhdGEgPSB7IC4uLmRlZmF1bHRJbml0aWFsRGF0YSB9O1xuLy8gZGVidWdnZXI7XG4gICAgICAgIC8vIFVwZGF0ZSBhbnkgc3Vic2NyaWJlciBhYm91dCBuZXcgZGF0YS5cbiAgICAgICAgb25VcGRhdGUgJiYgb25VcGRhdGUoY3R4Lmxhc3REYXRhKTtcblxuICAgICAgICAvLyBTdG9yZSBwcm9taXNlIHJlZmVyZW5jZSBpbiBvcmRlciB0byBjaGVjayB3aGljaCBpcyB0aGUgbGFzdCBvbmUgaWYgbXVsdGlwbGUgcmVzb2x2ZS5cbiAgICAgICAgY3R4LnByb21pc2UgPSBsb2FkKGN0eCwgbG9hZGVyLCBwYXJhbXMsIG9uVXBkYXRlKTtcbi8vIGNvbnNvbGUubG9nKCdzdG9yaW5nIGN0eCBwcm9taXNlJywgY3R4LnByb21pc2UpO1xuY3R4LnByb21pc2UubG9hZGVyID0gbG9hZGVyO1xuICAgICAgICByZXR1cm4gY3R4LnByb21pc2U7XG4gICAgfVxuXG4gICAgLy8gU3RvcmUgc2hvdWxkUmVsb2FkIGFuZCBtYXBwZXIgZm9yIGZ1dHVyZSByZWZlcmVuY2UgaW4gcmVkYXRhIGNvbXBvc2l0aW9ucy5cbiAgICByZWRhdGEuc2hvdWxkUmVsb2FkID0gc2hvdWxkUmVsb2FkO1xuICAgIHJlZGF0YS5tYXAgPSBtYXBwZXI7XG5cbiAgICByZXR1cm4gcmVkYXRhO1xufVxuXG4vLyBEZWZhdWx0IGluaXRpYWwgY29udGV4dCBmb3IgbmV3IHJlZGF0YXMuXG5jb25zdCBkZWZhdWx0SW5pdGlhbEN0eCA9IHtcbiAgICBsYXN0RGF0YTogdW5kZWZpbmVkLCAvLyBIb2xkcyB0aGUgbGFzdCBsb2FkZWQgZGF0YS5cbn07XG5cbmNvbnN0IGRlZmF1bHRJbml0aWFsRGF0YSA9IHsgbG9hZGluZzogdHJ1ZSwgZXJyb3I6IHVuZGVmaW5lZCwgcmVzdWx0OiB1bmRlZmluZWQgfTtcblxuZnVuY3Rpb24gZGVmYXVsdFNob3VsZFJlbG9hZCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRNYXBwZXIoZGF0YSkge1xuICAgIHJldHVybiBkYXRhO1xufVxuXG4vLyBwcml2YXRlIHN0dWZmIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gbG9hZChjdHgsIGxvYWRlciwgcGFyYW1zLCBvblVwZGF0ZSkge1xuICAgIC8vIENyZWF0ZSBhbiBvYmplY3QgdGhhdCBob2xkcyB0aGUgbG9hZGVkRGF0YSBwcm9taXNlLCBzbyB3ZSBjYW4gY29tcGFyZSBvbiBoYW5kbGVMb2FkUmVzdWx0LCBhbmQgaWdub3JlIHByb21pc2VzIHRoYXRcbiAgICAvLyBkaWQgbm90IG9yaWdpbmF0ZSBmcm9tIHRoZSB2ZXJ5IGxhc3QgbG9hZCB0aGF0IGhhcHBlbmVkLlxuICAgIGNvbnN0IGxvYWRlZERhdGEgPSB7XG4gICAgICAgIGxvYWRpbmc6IHRydWUsIC8vIFN0YXJ0IG9mZiBcImxvYWRpbmdcIiwgYnV0IG9uY2UgdGhlIHByb21pc2UgYmVsb3cgcmVzb2x2ZXMsIHRoaXMgdmFsdWUgaXMgZmFsc2UuXG4gICAgfTtcblxuICAgIGxvYWRlZERhdGEucHJvbWlzZSA9IGxvYWRlcihwYXJhbXMsIGhhbmRsZUxvYWRSZXN1bHQuYmluZChudWxsLCBjdHgsIGxvYWRlZERhdGEsIG9uVXBkYXRlLCB1bmRlZmluZWQpKSAvLyBEbyBub3QgYWZmZWN0IGxvYWRpbmcgc3RhdHVzLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGhhbmRsZUxvYWRSZXN1bHQuYmluZChudWxsLCBjdHgsIGxvYWRlZERhdGEsIG9uVXBkYXRlLCBmYWxzZSwgdW5kZWZpbmVkKSkgLy8gU3VjY2Vzcywgbm90IGxvYWRpbmcuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goaGFuZGxlTG9hZFJlc3VsdC5iaW5kKG51bGwsIGN0eCwgbG9hZGVkRGF0YSwgb25VcGRhdGUsIGZhbHNlKSk7IC8vIEZhaWxlZCwgbm90IGxvYWRpbmcuXG5cbiAgICAvLyBSZXR1cm4gcHJvbWlzZSBmb3IgZGF0YS5cbiAgICByZXR1cm4gbG9hZGVkRGF0YS5wcm9taXNlO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVMb2FkUmVzdWx0KGN0eCwgbG9hZGVkRGF0YSwgb25VcGRhdGUsIGxvYWRpbmcsIGVycm9yLCByZXN1bHQpIHtcbiAgICAvLyBJZiBub3QgdGhlIHByb21pc2UgZnJvbSBsYXN0IGxvYWQsIGlnbm9yZS5cbiAgICBpZiAoY3R4LnByb21pc2UgIT09IGxvYWRlZERhdGEucHJvbWlzZSkge1xuY29uc29sZS5sb2coJ0lHTk9SSU5HJywgY3R4LnByb21pc2UsIGxvYWRlZERhdGEucHJvbWlzZSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsYXN0RGF0YSA9IGN0eC5sYXN0RGF0YTtcblxuICAgIC8vIElmIGxvYWRpbmcgc3RhdHVzIHdhcyBwcm92aWRlZCwgdXBkYXRlIGxvYWRlZERhdGEuXG4gICAgbG9hZGluZyAhPT0gdW5kZWZpbmVkICYmIChsb2FkZWREYXRhLmxvYWRpbmcgPSBsb2FkaW5nKTtcblxuICAgIC8vIFN0b3JlIGZpbmFsIGRhdGEuXG4gICAgY3R4Lmxhc3REYXRhID0geyBsb2FkaW5nOiBsb2FkZWREYXRhLmxvYWRpbmcsIGVycm9yLCByZXN1bHQgfTtcblxuICAgIC8vIElmIGxhc3REYXRhIGFuZCByZWNlaXZlZCBkYXRhIG5vdCBzaGFsbG93IGVxdWFsLCB0aGVuIGxvYWRlciBkaWRuJ3QgY2FsbCBvblVwZGF0ZS4gSW1wbGljaXRseSBkbyBpdC5cbiAgICBvblVwZGF0ZSAmJiAhc2hhbGxvd2VxdWFsKGxhc3REYXRhLCBjdHgubGFzdERhdGEpICYmIG9uVXBkYXRlKGN0eC5sYXN0RGF0YSk7XG5jb25zb2xlLmxvZygnaGFuZGxlTG9hZFJlc3VsdCcsIGN0eC5sYXN0RGF0YSk7XG4gICAgcmV0dXJuIGN0eC5sYXN0RGF0YTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZTtcbmV4cG9ydCB7IGRlZmF1bHRTaG91bGRSZWxvYWQsIGRlZmF1bHRNYXBwZXIsIGRlZmF1bHRJbml0aWFsQ3R4LCBkZWZhdWx0SW5pdGlhbERhdGEsIHByb3BzLCBjb21wb3NlIH07XG4iXX0=
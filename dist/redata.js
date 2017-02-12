'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

    // Initialise context.
    var ctx = initialCtx;

    function redata(params, onUpdate) {
        console.log('triggered redata', {
            shouldReload: shouldReload(params)
        });

        // If should not reload the data.
        if (!shouldReload(params)) {
            // Inform any subscriber.
            onUpdate && onUpdate(ctx.lastData);

            // Resolve with final data.
            return Promise.resolve(ctx.lastData);
        }

        // Data not valid, load new data and subscribe to its updates.
        ctx.lastData = _extends({}, defaultInitialData); // TODO: consider removing this, since it should happen synchronously with load()
        ctx.final = false; // Not final, waiting to get results.

        // Update any subscriber about new data.
        onUpdate && onUpdate(ctx.lastData);

        var loadResult = load(loader, params, function (data) {
            // If not the promise from last load, ignore.
            if (ctx.promise !== loadResult) {
                return;
            }

            // If loader had already resolved, then this is a programmer error, and should just fail.
            if (ctx.final) {
                // TODO: Consider adding a bit more context here.
                // TODO: Actually, now that I think about it, it might be worth just ignoring the data. This might be a pattern
                // for complex compositions, like .race().
                throw new Error('redata already finalised and new data received: ' + JSON.stringify(data));
            }

            // Cache data in case redata triggers again and shouldReload determines that cache is valid.
            ctx.lastData = data;

            // Inform any subscriber.
            onUpdate && onUpdate(data);
        }).then(function (data) {
            // If this is the last load, mark as no longer accepting onUpdate.
            ctx.promise === loadResult && (ctx.final = true);

            // If lastData is not the same as the data received, then the user didn't call onUpdate, do it for them and store data.
            if (ctx.lastData !== data) {
                ctx.lastData = data;

                // Inform any subscriber.
                onUpdate && onUpdate(data);
            }

            // Finally resolve load promise.
            return data;
        });

        ctx.promise = loadResult; // store promise reference in order to check which is the last one if multiple resolve

        return loadResult;
    }

    // Mark this function as being a redata function, for internal purposes, speacially useful for compositions.
    redata.isRedata = true;

    // Store the load, shouldReload and mapper for future reference in redata compositions.
    redata.load = load.bind(null, loader);
    redata.shouldReload = shouldReload;
    redata.map = mapper;

    return redata;
}

// Default initial context for new redatas.
var defaultInitialCtx = {
    lastData: undefined, // Holds the last loaded data.
    final: false };

var defaultInitialData = { loading: true, error: undefined, result: undefined };

function defaultShouldReload() {
    return false;
}

function defaultMapper(data) {
    return data;
}

// private stuff ----------------------------------------------------------------------------------

/**
 * Calls the loader function with current params and returns a promise which resolves with the {@link data} format
 * @param {function} loader - called to fetch new data
 * @param {object} params - arguments object provided to loader function
 * @param {function} onUpdate - called when new data arrives
 * @return {Promise} - promise which resolves with the {@link data} format
*/
function load(loader, params, onUpdate) {
    // Init new data.
    var data = _extends({}, defaultInitialData);

    // TODO: should probably notify onUpdate here instead of resetting manually above at line 35 (ctx.lastData = { ...defaultInitialData };)

    // Start loading, passing the parameters that were provided, and return a promise for the loader resulting data.
    return loader(params, onUpdate).then(function (result) {
        data.result = result;
    }).catch(function (error) {
        data.error = error;
    }).then(function () {
        data.loading = false;

        onUpdate(data);

        return data;
    });
}

// ------------------------------------------------------------------------------------------------

exports.default = configRedata;
exports.defaultShouldReload = defaultShouldReload;
exports.defaultMapper = defaultMapper;
exports.defaultInitialCtx = defaultInitialCtx;
exports.defaultInitialData = defaultInitialData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yZWRhdGEuanMiXSwibmFtZXMiOlsiY29uZmlnUmVkYXRhIiwibG9hZGVyIiwic2hvdWxkUmVsb2FkIiwiZGVmYXVsdFNob3VsZFJlbG9hZCIsIm1hcHBlciIsImRlZmF1bHRNYXBwZXIiLCJpbml0aWFsQ3R4IiwiZGVmYXVsdEluaXRpYWxDdHgiLCJjdHgiLCJyZWRhdGEiLCJwYXJhbXMiLCJvblVwZGF0ZSIsImNvbnNvbGUiLCJsb2ciLCJsYXN0RGF0YSIsIlByb21pc2UiLCJyZXNvbHZlIiwiZGVmYXVsdEluaXRpYWxEYXRhIiwiZmluYWwiLCJsb2FkUmVzdWx0IiwibG9hZCIsImRhdGEiLCJwcm9taXNlIiwiRXJyb3IiLCJKU09OIiwic3RyaW5naWZ5IiwidGhlbiIsImlzUmVkYXRhIiwiYmluZCIsIm1hcCIsInVuZGVmaW5lZCIsImxvYWRpbmciLCJlcnJvciIsInJlc3VsdCIsImNhdGNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7Ozs7OztBQVFBOzs7Ozs7O0FBT0EsU0FBU0EsWUFBVCxDQUFzQkMsTUFBdEIsRUFBMEg7QUFBQSxRQUE1RkMsWUFBNEYsdUVBQTdFQyxtQkFBNkU7QUFBQSxRQUF4REMsTUFBd0QsdUVBQS9DQyxhQUErQztBQUFBLFFBQWhDQyxVQUFnQyx1RUFBbkJDLGlCQUFtQjs7QUFDdEg7QUFDQSxRQUFNQyxNQUFNRixVQUFaOztBQUVBLGFBQVNHLE1BQVQsQ0FBZ0JDLE1BQWhCLEVBQXdCQyxRQUF4QixFQUFrQztBQUM5QkMsZ0JBQVFDLEdBQVIsQ0FBWSxrQkFBWixFQUFnQztBQUM1QlgsMEJBQWNBLGFBQWFRLE1BQWI7QUFEYyxTQUFoQzs7QUFJQTtBQUNBLFlBQUksQ0FBQ1IsYUFBYVEsTUFBYixDQUFMLEVBQTJCO0FBQ3ZCO0FBQ0FDLHdCQUFZQSxTQUFTSCxJQUFJTSxRQUFiLENBQVo7O0FBRUE7QUFDQSxtQkFBT0MsUUFBUUMsT0FBUixDQUFnQlIsSUFBSU0sUUFBcEIsQ0FBUDtBQUNIOztBQUVEO0FBQ0FOLFlBQUlNLFFBQUosZ0JBQW9CRyxrQkFBcEIsRUFmOEIsQ0FlWTtBQUMxQ1QsWUFBSVUsS0FBSixHQUFZLEtBQVosQ0FoQjhCLENBZ0JYOztBQUVuQjtBQUNBUCxvQkFBWUEsU0FBU0gsSUFBSU0sUUFBYixDQUFaOztBQUVBLFlBQU1LLGFBQWFDLEtBQUtuQixNQUFMLEVBQWFTLE1BQWIsRUFBcUIsVUFBQ1csSUFBRCxFQUFVO0FBQzlDO0FBQ0EsZ0JBQUliLElBQUljLE9BQUosS0FBZ0JILFVBQXBCLEVBQWdDO0FBQzVCO0FBQ0g7O0FBRUQ7QUFDQSxnQkFBSVgsSUFBSVUsS0FBUixFQUFlO0FBQ1g7QUFDQTtBQUNBO0FBQ0Esc0JBQU0sSUFBSUssS0FBSixzREFBNkRDLEtBQUtDLFNBQUwsQ0FBZUosSUFBZixDQUE3RCxDQUFOO0FBQ0g7O0FBRUQ7QUFDQWIsZ0JBQUlNLFFBQUosR0FBZU8sSUFBZjs7QUFFQTtBQUNBVix3QkFBWUEsU0FBU1UsSUFBVCxDQUFaO0FBQ0gsU0FuQmtCLEVBbUJoQkssSUFuQmdCLENBbUJYLFVBQUNMLElBQUQsRUFBVTtBQUNkO0FBQ0FiLGdCQUFJYyxPQUFKLEtBQWdCSCxVQUFoQixLQUErQlgsSUFBSVUsS0FBSixHQUFZLElBQTNDOztBQUVBO0FBQ0EsZ0JBQUlWLElBQUlNLFFBQUosS0FBaUJPLElBQXJCLEVBQTJCO0FBQ3ZCYixvQkFBSU0sUUFBSixHQUFlTyxJQUFmOztBQUVBO0FBQ0FWLDRCQUFZQSxTQUFTVSxJQUFULENBQVo7QUFDSDs7QUFFRDtBQUNBLG1CQUFPQSxJQUFQO0FBQ0gsU0FqQ2tCLENBQW5COztBQW1DQWIsWUFBSWMsT0FBSixHQUFjSCxVQUFkLENBeEQ4QixDQXdESjs7QUFFMUIsZUFBT0EsVUFBUDtBQUNIOztBQUVEO0FBQ0FWLFdBQU9rQixRQUFQLEdBQWtCLElBQWxCOztBQUVBO0FBQ0FsQixXQUFPVyxJQUFQLEdBQWNBLEtBQUtRLElBQUwsQ0FBVSxJQUFWLEVBQWdCM0IsTUFBaEIsQ0FBZDtBQUNBUSxXQUFPUCxZQUFQLEdBQXNCQSxZQUF0QjtBQUNBTyxXQUFPb0IsR0FBUCxHQUFhekIsTUFBYjs7QUFFQSxXQUFPSyxNQUFQO0FBQ0g7O0FBRUQ7QUFDQSxJQUFNRixvQkFBb0I7QUFDdEJPLGNBQVVnQixTQURZLEVBQ0Q7QUFDckJaLFdBQU8sS0FGZSxFQUExQjs7QUFLQSxJQUFNRCxxQkFBcUIsRUFBRWMsU0FBUyxJQUFYLEVBQWlCQyxPQUFPRixTQUF4QixFQUFtQ0csUUFBUUgsU0FBM0MsRUFBM0I7O0FBRUEsU0FBUzNCLG1CQUFULEdBQStCO0FBQzNCLFdBQU8sS0FBUDtBQUNIOztBQUVELFNBQVNFLGFBQVQsQ0FBdUJnQixJQUF2QixFQUE2QjtBQUN6QixXQUFPQSxJQUFQO0FBQ0g7O0FBRUQ7O0FBRUE7Ozs7Ozs7QUFPQSxTQUFTRCxJQUFULENBQWNuQixNQUFkLEVBQXNCUyxNQUF0QixFQUE4QkMsUUFBOUIsRUFBd0M7QUFDcEM7QUFDQSxRQUFNVSxvQkFBWUosa0JBQVosQ0FBTjs7QUFFQTs7QUFFQTtBQUNBLFdBQU9oQixPQUFPUyxNQUFQLEVBQWVDLFFBQWYsRUFDRmUsSUFERSxDQUNHLFVBQUNPLE1BQUQsRUFBWTtBQUFFWixhQUFLWSxNQUFMLEdBQWNBLE1BQWQ7QUFBdUIsS0FEeEMsRUFFRkMsS0FGRSxDQUVJLFVBQUNGLEtBQUQsRUFBVztBQUFFWCxhQUFLVyxLQUFMLEdBQWFBLEtBQWI7QUFBcUIsS0FGdEMsRUFHRk4sSUFIRSxDQUdHLFlBQU07QUFDUkwsYUFBS1UsT0FBTCxHQUFlLEtBQWY7O0FBRUFwQixpQkFBU1UsSUFBVDs7QUFFQSxlQUFPQSxJQUFQO0FBQ0gsS0FURSxDQUFQO0FBVUg7O0FBRUQ7O2tCQUVlckIsWTtRQUNORyxtQixHQUFBQSxtQjtRQUFxQkUsYSxHQUFBQSxhO1FBQWVFLGlCLEdBQUFBLGlCO1FBQW1CVSxrQixHQUFBQSxrQiIsImZpbGUiOiJyZWRhdGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIHJlZGF0YSdzIGRhdGEgb2JqZWN0IGRlZmluaXRpb25cbiAqIEB0eXBlZGVmIHtPYmplY3R9IERhdGFcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gbG9hZGluZyAtIHRydWUgaWYgdGhlIGxvYWRlciBpcyBzdGlsbCBydW5uaW5nLCBmYWxzZSBvdGhlcndpc2UuXG4gKiBAcHJvcGVydHkge2Vycm9yfSBlcnJvciAtIGluc3RhbmNlIG9mIEVycm9yIGluIGNhc2UgdGhlIGxvYWRlciBmYWlsZWQsIHVuZGVmaW5lZCBvdGhlcndpc2UuXG4gKiBAcHJvcGVydHkgeyp9IHJlc3VsdCAtIHJlc3VsdCBvZiB0aGUgbG9hZGVyLCBvciB1bmRlZmluZWQgaWYgdGhlIGxvYWRlciBpcyBzdGlsbCBydW5uaW5nLlxuICovXG5cbi8qKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gbG9hZGVyIC0gY2FsbGVkIHRvIGZldGNoIG5ldyBkYXRhXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbc2hvdWxkUmVsb2FkID0gZGVmYXVsdFNob3VsZFJlbG9hZF0gLSBkZWNpZGVzIHdoZXRoZXIgYSByZWRhdGEgc2hvdWxkIG9jY3VyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbbWFwcGVyID0gZGVmYXVsdE1hcHBlcl0gLSBtYXBzIHRoZSB7QGxpbmsgRGF0YX0gb2JqZWN0IHZhbHVlcyB0byB5b3VyIGNvbXBvbmVudCdzIHByb3BzXG4gKiBAcGFyYW0ge29iamVjdH0gW2luaXRpYWxDdHggPSBkZWZhdWx0SW5pdGlhbEN0eF0gLSBzdGFydGluZyBwb2ludCBvZiByZWRhdGEsIGRlZmluZXMgaWYgdGhlcmUncyBhbnkgcHJlbG9hZGVkIGRhdGFcbiAqIEByZXR1cm5zIHtmdW5jdGlvbn0gcmVkYXRhIHdyYXBwZXIgZnVuY3Rpb25cbiAqL1xuZnVuY3Rpb24gY29uZmlnUmVkYXRhKGxvYWRlciwgc2hvdWxkUmVsb2FkID0gZGVmYXVsdFNob3VsZFJlbG9hZCwgbWFwcGVyID0gZGVmYXVsdE1hcHBlciwgaW5pdGlhbEN0eCA9IGRlZmF1bHRJbml0aWFsQ3R4KSB7XG4gICAgLy8gSW5pdGlhbGlzZSBjb250ZXh0LlxuICAgIGNvbnN0IGN0eCA9IGluaXRpYWxDdHg7XG5cbiAgICBmdW5jdGlvbiByZWRhdGEocGFyYW1zLCBvblVwZGF0ZSkge1xuICAgICAgICBjb25zb2xlLmxvZygndHJpZ2dlcmVkIHJlZGF0YScsIHtcbiAgICAgICAgICAgIHNob3VsZFJlbG9hZDogc2hvdWxkUmVsb2FkKHBhcmFtcyksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIElmIHNob3VsZCBub3QgcmVsb2FkIHRoZSBkYXRhLlxuICAgICAgICBpZiAoIXNob3VsZFJlbG9hZChwYXJhbXMpKSB7XG4gICAgICAgICAgICAvLyBJbmZvcm0gYW55IHN1YnNjcmliZXIuXG4gICAgICAgICAgICBvblVwZGF0ZSAmJiBvblVwZGF0ZShjdHgubGFzdERhdGEpO1xuXG4gICAgICAgICAgICAvLyBSZXNvbHZlIHdpdGggZmluYWwgZGF0YS5cbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoY3R4Lmxhc3REYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERhdGEgbm90IHZhbGlkLCBsb2FkIG5ldyBkYXRhIGFuZCBzdWJzY3JpYmUgdG8gaXRzIHVwZGF0ZXMuXG4gICAgICAgIGN0eC5sYXN0RGF0YSA9IHsgLi4uZGVmYXVsdEluaXRpYWxEYXRhIH07IC8vIFRPRE86IGNvbnNpZGVyIHJlbW92aW5nIHRoaXMsIHNpbmNlIGl0IHNob3VsZCBoYXBwZW4gc3luY2hyb25vdXNseSB3aXRoIGxvYWQoKVxuICAgICAgICBjdHguZmluYWwgPSBmYWxzZTsgLy8gTm90IGZpbmFsLCB3YWl0aW5nIHRvIGdldCByZXN1bHRzLlxuXG4gICAgICAgIC8vIFVwZGF0ZSBhbnkgc3Vic2NyaWJlciBhYm91dCBuZXcgZGF0YS5cbiAgICAgICAgb25VcGRhdGUgJiYgb25VcGRhdGUoY3R4Lmxhc3REYXRhKTtcblxuICAgICAgICBjb25zdCBsb2FkUmVzdWx0ID0gbG9hZChsb2FkZXIsIHBhcmFtcywgKGRhdGEpID0+IHtcbiAgICAgICAgICAgIC8vIElmIG5vdCB0aGUgcHJvbWlzZSBmcm9tIGxhc3QgbG9hZCwgaWdub3JlLlxuICAgICAgICAgICAgaWYgKGN0eC5wcm9taXNlICE9PSBsb2FkUmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiBsb2FkZXIgaGFkIGFscmVhZHkgcmVzb2x2ZWQsIHRoZW4gdGhpcyBpcyBhIHByb2dyYW1tZXIgZXJyb3IsIGFuZCBzaG91bGQganVzdCBmYWlsLlxuICAgICAgICAgICAgaWYgKGN0eC5maW5hbCkge1xuICAgICAgICAgICAgICAgIC8vIFRPRE86IENvbnNpZGVyIGFkZGluZyBhIGJpdCBtb3JlIGNvbnRleHQgaGVyZS5cbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBBY3R1YWxseSwgbm93IHRoYXQgSSB0aGluayBhYm91dCBpdCwgaXQgbWlnaHQgYmUgd29ydGgganVzdCBpZ25vcmluZyB0aGUgZGF0YS4gVGhpcyBtaWdodCBiZSBhIHBhdHRlcm5cbiAgICAgICAgICAgICAgICAvLyBmb3IgY29tcGxleCBjb21wb3NpdGlvbnMsIGxpa2UgLnJhY2UoKS5cbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHJlZGF0YSBhbHJlYWR5IGZpbmFsaXNlZCBhbmQgbmV3IGRhdGEgcmVjZWl2ZWQ6ICR7SlNPTi5zdHJpbmdpZnkoZGF0YSl9YCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENhY2hlIGRhdGEgaW4gY2FzZSByZWRhdGEgdHJpZ2dlcnMgYWdhaW4gYW5kIHNob3VsZFJlbG9hZCBkZXRlcm1pbmVzIHRoYXQgY2FjaGUgaXMgdmFsaWQuXG4gICAgICAgICAgICBjdHgubGFzdERhdGEgPSBkYXRhO1xuXG4gICAgICAgICAgICAvLyBJbmZvcm0gYW55IHN1YnNjcmliZXIuXG4gICAgICAgICAgICBvblVwZGF0ZSAmJiBvblVwZGF0ZShkYXRhKTtcbiAgICAgICAgfSkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgLy8gSWYgdGhpcyBpcyB0aGUgbGFzdCBsb2FkLCBtYXJrIGFzIG5vIGxvbmdlciBhY2NlcHRpbmcgb25VcGRhdGUuXG4gICAgICAgICAgICBjdHgucHJvbWlzZSA9PT0gbG9hZFJlc3VsdCAmJiAoY3R4LmZpbmFsID0gdHJ1ZSk7XG5cbiAgICAgICAgICAgIC8vIElmIGxhc3REYXRhIGlzIG5vdCB0aGUgc2FtZSBhcyB0aGUgZGF0YSByZWNlaXZlZCwgdGhlbiB0aGUgdXNlciBkaWRuJ3QgY2FsbCBvblVwZGF0ZSwgZG8gaXQgZm9yIHRoZW0gYW5kIHN0b3JlIGRhdGEuXG4gICAgICAgICAgICBpZiAoY3R4Lmxhc3REYXRhICE9PSBkYXRhKSB7XG4gICAgICAgICAgICAgICAgY3R4Lmxhc3REYXRhID0gZGF0YTtcblxuICAgICAgICAgICAgICAgIC8vIEluZm9ybSBhbnkgc3Vic2NyaWJlci5cbiAgICAgICAgICAgICAgICBvblVwZGF0ZSAmJiBvblVwZGF0ZShkYXRhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRmluYWxseSByZXNvbHZlIGxvYWQgcHJvbWlzZS5cbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9KTtcblxuICAgICAgICBjdHgucHJvbWlzZSA9IGxvYWRSZXN1bHQ7IC8vIHN0b3JlIHByb21pc2UgcmVmZXJlbmNlIGluIG9yZGVyIHRvIGNoZWNrIHdoaWNoIGlzIHRoZSBsYXN0IG9uZSBpZiBtdWx0aXBsZSByZXNvbHZlXG5cbiAgICAgICAgcmV0dXJuIGxvYWRSZXN1bHQ7XG4gICAgfVxuXG4gICAgLy8gTWFyayB0aGlzIGZ1bmN0aW9uIGFzIGJlaW5nIGEgcmVkYXRhIGZ1bmN0aW9uLCBmb3IgaW50ZXJuYWwgcHVycG9zZXMsIHNwZWFjaWFsbHkgdXNlZnVsIGZvciBjb21wb3NpdGlvbnMuXG4gICAgcmVkYXRhLmlzUmVkYXRhID0gdHJ1ZTtcblxuICAgIC8vIFN0b3JlIHRoZSBsb2FkLCBzaG91bGRSZWxvYWQgYW5kIG1hcHBlciBmb3IgZnV0dXJlIHJlZmVyZW5jZSBpbiByZWRhdGEgY29tcG9zaXRpb25zLlxuICAgIHJlZGF0YS5sb2FkID0gbG9hZC5iaW5kKG51bGwsIGxvYWRlcik7XG4gICAgcmVkYXRhLnNob3VsZFJlbG9hZCA9IHNob3VsZFJlbG9hZDtcbiAgICByZWRhdGEubWFwID0gbWFwcGVyO1xuXG4gICAgcmV0dXJuIHJlZGF0YTtcbn1cblxuLy8gRGVmYXVsdCBpbml0aWFsIGNvbnRleHQgZm9yIG5ldyByZWRhdGFzLlxuY29uc3QgZGVmYXVsdEluaXRpYWxDdHggPSB7XG4gICAgbGFzdERhdGE6IHVuZGVmaW5lZCwgLy8gSG9sZHMgdGhlIGxhc3QgbG9hZGVkIGRhdGEuXG4gICAgZmluYWw6IGZhbHNlLCAvLyBXaGV0aGVyIGxhc3REYXRhIGlzIGZpbmFsIG9yIGEgcmVzdWx0IG9mIG9uVXBkYXRlLlxufTtcblxuY29uc3QgZGVmYXVsdEluaXRpYWxEYXRhID0geyBsb2FkaW5nOiB0cnVlLCBlcnJvcjogdW5kZWZpbmVkLCByZXN1bHQ6IHVuZGVmaW5lZCB9O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2hvdWxkUmVsb2FkKCkge1xuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdE1hcHBlcihkYXRhKSB7XG4gICAgcmV0dXJuIGRhdGE7XG59XG5cbi8vIHByaXZhdGUgc3R1ZmYgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIENhbGxzIHRoZSBsb2FkZXIgZnVuY3Rpb24gd2l0aCBjdXJyZW50IHBhcmFtcyBhbmQgcmV0dXJucyBhIHByb21pc2Ugd2hpY2ggcmVzb2x2ZXMgd2l0aCB0aGUge0BsaW5rIGRhdGF9IGZvcm1hdFxuICogQHBhcmFtIHtmdW5jdGlvbn0gbG9hZGVyIC0gY2FsbGVkIHRvIGZldGNoIG5ldyBkYXRhXG4gKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zIC0gYXJndW1lbnRzIG9iamVjdCBwcm92aWRlZCB0byBsb2FkZXIgZnVuY3Rpb25cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IG9uVXBkYXRlIC0gY2FsbGVkIHdoZW4gbmV3IGRhdGEgYXJyaXZlc1xuICogQHJldHVybiB7UHJvbWlzZX0gLSBwcm9taXNlIHdoaWNoIHJlc29sdmVzIHdpdGggdGhlIHtAbGluayBkYXRhfSBmb3JtYXRcbiovXG5mdW5jdGlvbiBsb2FkKGxvYWRlciwgcGFyYW1zLCBvblVwZGF0ZSkge1xuICAgIC8vIEluaXQgbmV3IGRhdGEuXG4gICAgY29uc3QgZGF0YSA9IHsgLi4uZGVmYXVsdEluaXRpYWxEYXRhIH07XG5cbiAgICAvLyBUT0RPOiBzaG91bGQgcHJvYmFibHkgbm90aWZ5IG9uVXBkYXRlIGhlcmUgaW5zdGVhZCBvZiByZXNldHRpbmcgbWFudWFsbHkgYWJvdmUgYXQgbGluZSAzNSAoY3R4Lmxhc3REYXRhID0geyAuLi5kZWZhdWx0SW5pdGlhbERhdGEgfTspXG5cbiAgICAvLyBTdGFydCBsb2FkaW5nLCBwYXNzaW5nIHRoZSBwYXJhbWV0ZXJzIHRoYXQgd2VyZSBwcm92aWRlZCwgYW5kIHJldHVybiBhIHByb21pc2UgZm9yIHRoZSBsb2FkZXIgcmVzdWx0aW5nIGRhdGEuXG4gICAgcmV0dXJuIGxvYWRlcihwYXJhbXMsIG9uVXBkYXRlKVxuICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7IGRhdGEucmVzdWx0ID0gcmVzdWx0OyB9KVxuICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7IGRhdGEuZXJyb3IgPSBlcnJvcjsgfSlcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgZGF0YS5sb2FkaW5nID0gZmFsc2U7XG5cbiAgICAgICAgICAgIG9uVXBkYXRlKGRhdGEpO1xuXG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfSk7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnQgZGVmYXVsdCBjb25maWdSZWRhdGE7XG5leHBvcnQgeyBkZWZhdWx0U2hvdWxkUmVsb2FkLCBkZWZhdWx0TWFwcGVyLCBkZWZhdWx0SW5pdGlhbEN0eCwgZGVmYXVsdEluaXRpYWxEYXRhIH07XG4iXX0=
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function configRedata(loader) {
    var shouldReload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultShouldReload;
    var mapper = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultMapper;
    var initialCtx = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : defaultInitialCtx;

    // Initialise context.
    var ctx = initialCtx;

    function redata(params, onUpdate) {
        console.log('triggered redata', {
            shouldReload: shouldReload(params)
        }, arguments);
        // If should not reload the data.
        if (!shouldReload(params)) {
            // Inform any subscriber.
            onUpdate(ctx.lastData);

            // Resolve with final data.
            return Promise.resolve(ctx.lastData);
        }

        // Data not valid, load new data and subscribe to its updates.
        ctx.lastData = _extends({}, defaultInitialData);
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
                throw new Error('redata already finalised and new data received: ' + JSON.stringify(data));
            }

            // Cache data in case redata triggers again and shouldReload determines that cache is valid.
            ctx.lastData = data;

            // Inform any subscriber.
            onUpdate && onUpdate(data);
        }).then(function (data) {
            // If this is the last load, mark as no longer accepting onUpdate.
            ctx.promise === loadResult && (ctx.final = true);

            // Finally resolve load promise.
            return data;
        });

        ctx.promise = loadResult; // store promise reference in order to check which is the last one if multiple resolve

        return loadResult;
    }

    // Mark this function as being a redata, for internal purposes, speacially useful for compositions.
    redata.isRedata = true;

    // Store the load, shouldReload and mapper for future reference in redata compositions.
    redata.load = load.bind(null, loader);
    redata.shouldReload = shouldReload;
    redata.map = mapper;

    return redata;
}

// private stuff ----------------------------------------------------------------------------------

// Default initial context for new redatas.
var defaultInitialCtx = {
    lastData: undefined, // Holds the last loaded data.
    final: false };

var defaultInitialData = { loading: true, error: undefined, result: undefined };

function load(loader, params, onUpdate) {
    // Init new data.
    var data = _extends({}, defaultInitialData);

    // Start loading, passing the parameters that were provided, and return a promise for the loader resulting data.
    return loader(params).then(function (result) {
        data.result = result;
    }).catch(function (error) {
        data.error = error;
    }).then(function () {
        data.loading = false;

        onUpdate(data);

        return data;
    });
}

function defaultShouldReload() {
    return false;
}

function defaultMapper(data) {
    return data;
}

// ------------------------------------------------------------------------------------------------

exports.default = configRedata;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yZWRhdGEuanMiXSwibmFtZXMiOlsiY29uZmlnUmVkYXRhIiwibG9hZGVyIiwic2hvdWxkUmVsb2FkIiwiZGVmYXVsdFNob3VsZFJlbG9hZCIsIm1hcHBlciIsImRlZmF1bHRNYXBwZXIiLCJpbml0aWFsQ3R4IiwiZGVmYXVsdEluaXRpYWxDdHgiLCJjdHgiLCJyZWRhdGEiLCJwYXJhbXMiLCJvblVwZGF0ZSIsImNvbnNvbGUiLCJsb2ciLCJhcmd1bWVudHMiLCJsYXN0RGF0YSIsIlByb21pc2UiLCJyZXNvbHZlIiwiZGVmYXVsdEluaXRpYWxEYXRhIiwiZmluYWwiLCJsb2FkUmVzdWx0IiwibG9hZCIsImRhdGEiLCJwcm9taXNlIiwiRXJyb3IiLCJKU09OIiwic3RyaW5naWZ5IiwidGhlbiIsImlzUmVkYXRhIiwiYmluZCIsIm1hcCIsInVuZGVmaW5lZCIsImxvYWRpbmciLCJlcnJvciIsInJlc3VsdCIsImNhdGNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLFNBQVNBLFlBQVQsQ0FBc0JDLE1BQXRCLEVBQTBIO0FBQUEsUUFBNUZDLFlBQTRGLHVFQUE3RUMsbUJBQTZFO0FBQUEsUUFBeERDLE1BQXdELHVFQUEvQ0MsYUFBK0M7QUFBQSxRQUFoQ0MsVUFBZ0MsdUVBQW5CQyxpQkFBbUI7O0FBQ3RIO0FBQ0EsUUFBTUMsTUFBTUYsVUFBWjs7QUFFQSxhQUFTRyxNQUFULENBQWdCQyxNQUFoQixFQUF3QkMsUUFBeEIsRUFBa0M7QUFDdENDLGdCQUFRQyxHQUFSLENBQVksa0JBQVosRUFBZ0M7QUFDNUJYLDBCQUFjQSxhQUFhUSxNQUFiO0FBRGMsU0FBaEMsRUFFR0ksU0FGSDtBQUdRO0FBQ0EsWUFBSSxDQUFDWixhQUFhUSxNQUFiLENBQUwsRUFBMkI7QUFDdkI7QUFDQUMscUJBQVNILElBQUlPLFFBQWI7O0FBRUE7QUFDQSxtQkFBT0MsUUFBUUMsT0FBUixDQUFnQlQsSUFBSU8sUUFBcEIsQ0FBUDtBQUNIOztBQUVEO0FBQ0FQLFlBQUlPLFFBQUosZ0JBQW9CRyxrQkFBcEI7QUFDQVYsWUFBSVcsS0FBSixHQUFZLEtBQVosQ0FmOEIsQ0FlWDs7QUFFbkI7QUFDQVIsb0JBQVlBLFNBQVNILElBQUlPLFFBQWIsQ0FBWjs7QUFFQSxZQUFNSyxhQUFhQyxLQUFLcEIsTUFBTCxFQUFhUyxNQUFiLEVBQXFCLFVBQUNZLElBQUQsRUFBVTtBQUM5QztBQUNBLGdCQUFJZCxJQUFJZSxPQUFKLEtBQWdCSCxVQUFwQixFQUFnQztBQUM1QjtBQUNIOztBQUVEO0FBQ0EsZ0JBQUlaLElBQUlXLEtBQVIsRUFBZTtBQUNYO0FBQ0Esc0JBQU0sSUFBSUssS0FBSixzREFBNkRDLEtBQUtDLFNBQUwsQ0FBZUosSUFBZixDQUE3RCxDQUFOO0FBQ0g7O0FBRUQ7QUFDQWQsZ0JBQUlPLFFBQUosR0FBZU8sSUFBZjs7QUFFQTtBQUNBWCx3QkFBWUEsU0FBU1csSUFBVCxDQUFaO0FBQ0gsU0FqQmtCLEVBaUJoQkssSUFqQmdCLENBaUJYLFVBQUNMLElBQUQsRUFBVTtBQUNkO0FBQ0FkLGdCQUFJZSxPQUFKLEtBQWdCSCxVQUFoQixLQUErQlosSUFBSVcsS0FBSixHQUFZLElBQTNDOztBQUVBO0FBQ0EsbUJBQU9HLElBQVA7QUFDSCxTQXZCa0IsQ0FBbkI7O0FBeUJBZCxZQUFJZSxPQUFKLEdBQWNILFVBQWQsQ0E3QzhCLENBNkNKOztBQUUxQixlQUFPQSxVQUFQO0FBQ0g7O0FBRUQ7QUFDQVgsV0FBT21CLFFBQVAsR0FBa0IsSUFBbEI7O0FBRUE7QUFDQW5CLFdBQU9ZLElBQVAsR0FBY0EsS0FBS1EsSUFBTCxDQUFVLElBQVYsRUFBZ0I1QixNQUFoQixDQUFkO0FBQ0FRLFdBQU9QLFlBQVAsR0FBc0JBLFlBQXRCO0FBQ0FPLFdBQU9xQixHQUFQLEdBQWExQixNQUFiOztBQUVBLFdBQU9LLE1BQVA7QUFDSDs7QUFFRDs7QUFFQTtBQUNBLElBQU1GLG9CQUFvQjtBQUN0QlEsY0FBVWdCLFNBRFksRUFDRDtBQUNyQlosV0FBTyxLQUZlLEVBQTFCOztBQUtBLElBQU1ELHFCQUFxQixFQUFFYyxTQUFTLElBQVgsRUFBaUJDLE9BQU9GLFNBQXhCLEVBQW1DRyxRQUFRSCxTQUEzQyxFQUEzQjs7QUFFQSxTQUFTVixJQUFULENBQWNwQixNQUFkLEVBQXNCUyxNQUF0QixFQUE4QkMsUUFBOUIsRUFBd0M7QUFDcEM7QUFDQSxRQUFNVyxvQkFBWUosa0JBQVosQ0FBTjs7QUFFQTtBQUNBLFdBQU9qQixPQUFPUyxNQUFQLEVBQ05pQixJQURNLENBQ0QsVUFBQ08sTUFBRCxFQUFZO0FBQUVaLGFBQUtZLE1BQUwsR0FBY0EsTUFBZDtBQUF1QixLQURwQyxFQUVOQyxLQUZNLENBRUEsVUFBQ0YsS0FBRCxFQUFXO0FBQUVYLGFBQUtXLEtBQUwsR0FBYUEsS0FBYjtBQUFxQixLQUZsQyxFQUdOTixJQUhNLENBR0QsWUFBTTtBQUNSTCxhQUFLVSxPQUFMLEdBQWUsS0FBZjs7QUFFQXJCLGlCQUFTVyxJQUFUOztBQUVBLGVBQU9BLElBQVA7QUFDSCxLQVRNLENBQVA7QUFVSDs7QUFFRCxTQUFTbkIsbUJBQVQsR0FBK0I7QUFDM0IsV0FBTyxLQUFQO0FBQ0g7O0FBRUQsU0FBU0UsYUFBVCxDQUF1QmlCLElBQXZCLEVBQTZCO0FBQ3pCLFdBQU9BLElBQVA7QUFDSDs7QUFFRDs7a0JBRWV0QixZIiwiZmlsZSI6InJlZGF0YS5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIGNvbmZpZ1JlZGF0YShsb2FkZXIsIHNob3VsZFJlbG9hZCA9IGRlZmF1bHRTaG91bGRSZWxvYWQsIG1hcHBlciA9IGRlZmF1bHRNYXBwZXIsIGluaXRpYWxDdHggPSBkZWZhdWx0SW5pdGlhbEN0eCkge1xuICAgIC8vIEluaXRpYWxpc2UgY29udGV4dC5cbiAgICBjb25zdCBjdHggPSBpbml0aWFsQ3R4O1xuXG4gICAgZnVuY3Rpb24gcmVkYXRhKHBhcmFtcywgb25VcGRhdGUpIHtcbmNvbnNvbGUubG9nKCd0cmlnZ2VyZWQgcmVkYXRhJywge1xuICAgIHNob3VsZFJlbG9hZDogc2hvdWxkUmVsb2FkKHBhcmFtcylcbn0sIGFyZ3VtZW50cyk7XG4gICAgICAgIC8vIElmIHNob3VsZCBub3QgcmVsb2FkIHRoZSBkYXRhLlxuICAgICAgICBpZiAoIXNob3VsZFJlbG9hZChwYXJhbXMpKSB7XG4gICAgICAgICAgICAvLyBJbmZvcm0gYW55IHN1YnNjcmliZXIuXG4gICAgICAgICAgICBvblVwZGF0ZShjdHgubGFzdERhdGEpO1xuXG4gICAgICAgICAgICAvLyBSZXNvbHZlIHdpdGggZmluYWwgZGF0YS5cbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoY3R4Lmxhc3REYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERhdGEgbm90IHZhbGlkLCBsb2FkIG5ldyBkYXRhIGFuZCBzdWJzY3JpYmUgdG8gaXRzIHVwZGF0ZXMuXG4gICAgICAgIGN0eC5sYXN0RGF0YSA9IHsgLi4uZGVmYXVsdEluaXRpYWxEYXRhIH07XG4gICAgICAgIGN0eC5maW5hbCA9IGZhbHNlOyAvLyBOb3QgZmluYWwsIHdhaXRpbmcgdG8gZ2V0IHJlc3VsdHMuXG5cbiAgICAgICAgLy8gVXBkYXRlIGFueSBzdWJzY3JpYmVyIGFib3V0IG5ldyBkYXRhLlxuICAgICAgICBvblVwZGF0ZSAmJiBvblVwZGF0ZShjdHgubGFzdERhdGEpO1xuXG4gICAgICAgIGNvbnN0IGxvYWRSZXN1bHQgPSBsb2FkKGxvYWRlciwgcGFyYW1zLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgLy8gSWYgbm90IHRoZSBwcm9taXNlIGZyb20gbGFzdCBsb2FkLCBpZ25vcmUuXG4gICAgICAgICAgICBpZiAoY3R4LnByb21pc2UgIT09IGxvYWRSZXN1bHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElmIGxvYWRlciBoYWQgYWxyZWFkeSByZXNvbHZlZCwgdGhlbiB0aGlzIGlzIGEgcHJvZ3JhbW1lciBlcnJvciwgYW5kIHNob3VsZCBqdXN0IGZhaWwuXG4gICAgICAgICAgICBpZiAoY3R4LmZpbmFsKSB7XG4gICAgICAgICAgICAgICAgLy8gVE9ETzogQ29uc2lkZXIgYWRkaW5nIGEgYml0IG1vcmUgY29udGV4dCBoZXJlLlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgcmVkYXRhIGFscmVhZHkgZmluYWxpc2VkIGFuZCBuZXcgZGF0YSByZWNlaXZlZDogJHtKU09OLnN0cmluZ2lmeShkYXRhKX1gKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ2FjaGUgZGF0YSBpbiBjYXNlIHJlZGF0YSB0cmlnZ2VycyBhZ2FpbiBhbmQgc2hvdWxkUmVsb2FkIGRldGVybWluZXMgdGhhdCBjYWNoZSBpcyB2YWxpZC5cbiAgICAgICAgICAgIGN0eC5sYXN0RGF0YSA9IGRhdGE7XG5cbiAgICAgICAgICAgIC8vIEluZm9ybSBhbnkgc3Vic2NyaWJlci5cbiAgICAgICAgICAgIG9uVXBkYXRlICYmIG9uVXBkYXRlKGRhdGEpO1xuICAgICAgICB9KS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAvLyBJZiB0aGlzIGlzIHRoZSBsYXN0IGxvYWQsIG1hcmsgYXMgbm8gbG9uZ2VyIGFjY2VwdGluZyBvblVwZGF0ZS5cbiAgICAgICAgICAgIGN0eC5wcm9taXNlID09PSBsb2FkUmVzdWx0ICYmIChjdHguZmluYWwgPSB0cnVlKTtcblxuICAgICAgICAgICAgLy8gRmluYWxseSByZXNvbHZlIGxvYWQgcHJvbWlzZS5cbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9KTtcblxuICAgICAgICBjdHgucHJvbWlzZSA9IGxvYWRSZXN1bHQ7IC8vIHN0b3JlIHByb21pc2UgcmVmZXJlbmNlIGluIG9yZGVyIHRvIGNoZWNrIHdoaWNoIGlzIHRoZSBsYXN0IG9uZSBpZiBtdWx0aXBsZSByZXNvbHZlXG5cbiAgICAgICAgcmV0dXJuIGxvYWRSZXN1bHQ7XG4gICAgfVxuXG4gICAgLy8gTWFyayB0aGlzIGZ1bmN0aW9uIGFzIGJlaW5nIGEgcmVkYXRhLCBmb3IgaW50ZXJuYWwgcHVycG9zZXMsIHNwZWFjaWFsbHkgdXNlZnVsIGZvciBjb21wb3NpdGlvbnMuXG4gICAgcmVkYXRhLmlzUmVkYXRhID0gdHJ1ZTtcblxuICAgIC8vIFN0b3JlIHRoZSBsb2FkLCBzaG91bGRSZWxvYWQgYW5kIG1hcHBlciBmb3IgZnV0dXJlIHJlZmVyZW5jZSBpbiByZWRhdGEgY29tcG9zaXRpb25zLlxuICAgIHJlZGF0YS5sb2FkID0gbG9hZC5iaW5kKG51bGwsIGxvYWRlcik7XG4gICAgcmVkYXRhLnNob3VsZFJlbG9hZCA9IHNob3VsZFJlbG9hZDtcbiAgICByZWRhdGEubWFwID0gbWFwcGVyO1xuXG4gICAgcmV0dXJuIHJlZGF0YTtcbn1cblxuLy8gcHJpdmF0ZSBzdHVmZiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIERlZmF1bHQgaW5pdGlhbCBjb250ZXh0IGZvciBuZXcgcmVkYXRhcy5cbmNvbnN0IGRlZmF1bHRJbml0aWFsQ3R4ID0ge1xuICAgIGxhc3REYXRhOiB1bmRlZmluZWQsIC8vIEhvbGRzIHRoZSBsYXN0IGxvYWRlZCBkYXRhLlxuICAgIGZpbmFsOiBmYWxzZSwgLy8gV2hldGhlciBsYXN0RGF0YSBpcyBmaW5hbCBvciBhIHJlc3VsdCBvZiBvblVwZGF0ZS5cbn07XG5cbmNvbnN0IGRlZmF1bHRJbml0aWFsRGF0YSA9IHsgbG9hZGluZzogdHJ1ZSwgZXJyb3I6IHVuZGVmaW5lZCwgcmVzdWx0OiB1bmRlZmluZWQgfTtcblxuZnVuY3Rpb24gbG9hZChsb2FkZXIsIHBhcmFtcywgb25VcGRhdGUpIHtcbiAgICAvLyBJbml0IG5ldyBkYXRhLlxuICAgIGNvbnN0IGRhdGEgPSB7IC4uLmRlZmF1bHRJbml0aWFsRGF0YSB9O1xuXG4gICAgLy8gU3RhcnQgbG9hZGluZywgcGFzc2luZyB0aGUgcGFyYW1ldGVycyB0aGF0IHdlcmUgcHJvdmlkZWQsIGFuZCByZXR1cm4gYSBwcm9taXNlIGZvciB0aGUgbG9hZGVyIHJlc3VsdGluZyBkYXRhLlxuICAgIHJldHVybiBsb2FkZXIocGFyYW1zKVxuICAgIC50aGVuKChyZXN1bHQpID0+IHsgZGF0YS5yZXN1bHQgPSByZXN1bHQ7IH0pXG4gICAgLmNhdGNoKChlcnJvcikgPT4geyBkYXRhLmVycm9yID0gZXJyb3I7IH0pXG4gICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICBkYXRhLmxvYWRpbmcgPSBmYWxzZTtcblxuICAgICAgICBvblVwZGF0ZShkYXRhKTtcblxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdFNob3VsZFJlbG9hZCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRNYXBwZXIoZGF0YSkge1xuICAgIHJldHVybiBkYXRhO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZXhwb3J0IGRlZmF1bHQgY29uZmlnUmVkYXRhO1xuIl19
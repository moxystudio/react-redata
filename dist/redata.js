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
        });
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

function defaultShouldReload() {
    return false;
}

function defaultMapper(data) {
    return data;
}

// ------------------------------------------------------------------------------------------------

exports.default = configRedata;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yZWRhdGEuanMiXSwibmFtZXMiOlsiY29uZmlnUmVkYXRhIiwibG9hZGVyIiwic2hvdWxkUmVsb2FkIiwiZGVmYXVsdFNob3VsZFJlbG9hZCIsIm1hcHBlciIsImRlZmF1bHRNYXBwZXIiLCJpbml0aWFsQ3R4IiwiZGVmYXVsdEluaXRpYWxDdHgiLCJjdHgiLCJyZWRhdGEiLCJwYXJhbXMiLCJvblVwZGF0ZSIsImNvbnNvbGUiLCJsb2ciLCJsYXN0RGF0YSIsIlByb21pc2UiLCJyZXNvbHZlIiwiZGVmYXVsdEluaXRpYWxEYXRhIiwiZmluYWwiLCJsb2FkUmVzdWx0IiwibG9hZCIsImRhdGEiLCJwcm9taXNlIiwiRXJyb3IiLCJKU09OIiwic3RyaW5naWZ5IiwidGhlbiIsImlzUmVkYXRhIiwiYmluZCIsIm1hcCIsInVuZGVmaW5lZCIsImxvYWRpbmciLCJlcnJvciIsInJlc3VsdCIsImNhdGNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLFNBQVNBLFlBQVQsQ0FBc0JDLE1BQXRCLEVBQTBIO0FBQUEsUUFBNUZDLFlBQTRGLHVFQUE3RUMsbUJBQTZFO0FBQUEsUUFBeERDLE1BQXdELHVFQUEvQ0MsYUFBK0M7QUFBQSxRQUFoQ0MsVUFBZ0MsdUVBQW5CQyxpQkFBbUI7O0FBQ3RIO0FBQ0EsUUFBTUMsTUFBTUYsVUFBWjs7QUFFQSxhQUFTRyxNQUFULENBQWdCQyxNQUFoQixFQUF3QkMsUUFBeEIsRUFBa0M7QUFDdENDLGdCQUFRQyxHQUFSLENBQVksa0JBQVosRUFBZ0M7QUFDNUJYLDBCQUFjQSxhQUFhUSxNQUFiO0FBRGMsU0FBaEM7QUFHUTtBQUNBLFlBQUksQ0FBQ1IsYUFBYVEsTUFBYixDQUFMLEVBQTJCO0FBQ3ZCO0FBQ0FDLHFCQUFTSCxJQUFJTSxRQUFiOztBQUVBO0FBQ0EsbUJBQU9DLFFBQVFDLE9BQVIsQ0FBZ0JSLElBQUlNLFFBQXBCLENBQVA7QUFDSDs7QUFFRDtBQUNBTixZQUFJTSxRQUFKLGdCQUFvQkcsa0JBQXBCO0FBQ0FULFlBQUlVLEtBQUosR0FBWSxLQUFaLENBZjhCLENBZVg7O0FBRW5CO0FBQ0FQLG9CQUFZQSxTQUFTSCxJQUFJTSxRQUFiLENBQVo7O0FBRUEsWUFBTUssYUFBYUMsS0FBS25CLE1BQUwsRUFBYVMsTUFBYixFQUFxQixVQUFDVyxJQUFELEVBQVU7QUFDOUM7QUFDQSxnQkFBSWIsSUFBSWMsT0FBSixLQUFnQkgsVUFBcEIsRUFBZ0M7QUFDNUI7QUFDSDs7QUFFRDtBQUNBLGdCQUFJWCxJQUFJVSxLQUFSLEVBQWU7QUFDWDtBQUNBLHNCQUFNLElBQUlLLEtBQUosc0RBQTZEQyxLQUFLQyxTQUFMLENBQWVKLElBQWYsQ0FBN0QsQ0FBTjtBQUNIOztBQUVEO0FBQ0FiLGdCQUFJTSxRQUFKLEdBQWVPLElBQWY7O0FBRUE7QUFDQVYsd0JBQVlBLFNBQVNVLElBQVQsQ0FBWjtBQUNILFNBakJrQixFQWlCaEJLLElBakJnQixDQWlCWCxVQUFDTCxJQUFELEVBQVU7QUFDZDtBQUNBYixnQkFBSWMsT0FBSixLQUFnQkgsVUFBaEIsS0FBK0JYLElBQUlVLEtBQUosR0FBWSxJQUEzQzs7QUFFQTtBQUNBLGdCQUFJVixJQUFJTSxRQUFKLEtBQWlCTyxJQUFyQixFQUEyQjtBQUN2QmIsb0JBQUlNLFFBQUosR0FBZU8sSUFBZjs7QUFFQTtBQUNBViw0QkFBWUEsU0FBU1UsSUFBVCxDQUFaO0FBQ0g7O0FBRUQ7QUFDQSxtQkFBT0EsSUFBUDtBQUNILFNBL0JrQixDQUFuQjs7QUFpQ0FiLFlBQUljLE9BQUosR0FBY0gsVUFBZCxDQXJEOEIsQ0FxREo7O0FBRTFCLGVBQU9BLFVBQVA7QUFDSDs7QUFFRDtBQUNBVixXQUFPa0IsUUFBUCxHQUFrQixJQUFsQjs7QUFFQTtBQUNBbEIsV0FBT1csSUFBUCxHQUFjQSxLQUFLUSxJQUFMLENBQVUsSUFBVixFQUFnQjNCLE1BQWhCLENBQWQ7QUFDQVEsV0FBT1AsWUFBUCxHQUFzQkEsWUFBdEI7QUFDQU8sV0FBT29CLEdBQVAsR0FBYXpCLE1BQWI7O0FBRUEsV0FBT0ssTUFBUDtBQUNIOztBQUVEOztBQUVBO0FBQ0EsSUFBTUYsb0JBQW9CO0FBQ3RCTyxjQUFVZ0IsU0FEWSxFQUNEO0FBQ3JCWixXQUFPLEtBRmUsRUFBMUI7O0FBS0EsSUFBTUQscUJBQXFCLEVBQUVjLFNBQVMsSUFBWCxFQUFpQkMsT0FBT0YsU0FBeEIsRUFBbUNHLFFBQVFILFNBQTNDLEVBQTNCOztBQUVBLFNBQVNWLElBQVQsQ0FBY25CLE1BQWQsRUFBc0JTLE1BQXRCLEVBQThCQyxRQUE5QixFQUF3QztBQUNwQztBQUNBLFFBQU1VLG9CQUFZSixrQkFBWixDQUFOOztBQUVBO0FBQ0EsV0FBT2hCLE9BQU9TLE1BQVAsRUFBZUMsUUFBZixFQUNOZSxJQURNLENBQ0QsVUFBQ08sTUFBRCxFQUFZO0FBQUVaLGFBQUtZLE1BQUwsR0FBY0EsTUFBZDtBQUF1QixLQURwQyxFQUVOQyxLQUZNLENBRUEsVUFBQ0YsS0FBRCxFQUFXO0FBQUVYLGFBQUtXLEtBQUwsR0FBYUEsS0FBYjtBQUFxQixLQUZsQyxFQUdOTixJQUhNLENBR0QsWUFBTTtBQUNSTCxhQUFLVSxPQUFMLEdBQWUsS0FBZjs7QUFFQXBCLGlCQUFTVSxJQUFUOztBQUVBLGVBQU9BLElBQVA7QUFDSCxLQVRNLENBQVA7QUFVSDs7QUFFRCxTQUFTbEIsbUJBQVQsR0FBK0I7QUFDM0IsV0FBTyxLQUFQO0FBQ0g7O0FBRUQsU0FBU0UsYUFBVCxDQUF1QmdCLElBQXZCLEVBQTZCO0FBQ3pCLFdBQU9BLElBQVA7QUFDSDs7QUFFRDs7a0JBRWVyQixZIiwiZmlsZSI6InJlZGF0YS5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIGNvbmZpZ1JlZGF0YShsb2FkZXIsIHNob3VsZFJlbG9hZCA9IGRlZmF1bHRTaG91bGRSZWxvYWQsIG1hcHBlciA9IGRlZmF1bHRNYXBwZXIsIGluaXRpYWxDdHggPSBkZWZhdWx0SW5pdGlhbEN0eCkge1xuICAgIC8vIEluaXRpYWxpc2UgY29udGV4dC5cbiAgICBjb25zdCBjdHggPSBpbml0aWFsQ3R4O1xuXG4gICAgZnVuY3Rpb24gcmVkYXRhKHBhcmFtcywgb25VcGRhdGUpIHtcbmNvbnNvbGUubG9nKCd0cmlnZ2VyZWQgcmVkYXRhJywge1xuICAgIHNob3VsZFJlbG9hZDogc2hvdWxkUmVsb2FkKHBhcmFtcylcbn0pO1xuICAgICAgICAvLyBJZiBzaG91bGQgbm90IHJlbG9hZCB0aGUgZGF0YS5cbiAgICAgICAgaWYgKCFzaG91bGRSZWxvYWQocGFyYW1zKSkge1xuICAgICAgICAgICAgLy8gSW5mb3JtIGFueSBzdWJzY3JpYmVyLlxuICAgICAgICAgICAgb25VcGRhdGUoY3R4Lmxhc3REYXRhKTtcblxuICAgICAgICAgICAgLy8gUmVzb2x2ZSB3aXRoIGZpbmFsIGRhdGEuXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGN0eC5sYXN0RGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEYXRhIG5vdCB2YWxpZCwgbG9hZCBuZXcgZGF0YSBhbmQgc3Vic2NyaWJlIHRvIGl0cyB1cGRhdGVzLlxuICAgICAgICBjdHgubGFzdERhdGEgPSB7IC4uLmRlZmF1bHRJbml0aWFsRGF0YSB9O1xuICAgICAgICBjdHguZmluYWwgPSBmYWxzZTsgLy8gTm90IGZpbmFsLCB3YWl0aW5nIHRvIGdldCByZXN1bHRzLlxuXG4gICAgICAgIC8vIFVwZGF0ZSBhbnkgc3Vic2NyaWJlciBhYm91dCBuZXcgZGF0YS5cbiAgICAgICAgb25VcGRhdGUgJiYgb25VcGRhdGUoY3R4Lmxhc3REYXRhKTtcblxuICAgICAgICBjb25zdCBsb2FkUmVzdWx0ID0gbG9hZChsb2FkZXIsIHBhcmFtcywgKGRhdGEpID0+IHtcbiAgICAgICAgICAgIC8vIElmIG5vdCB0aGUgcHJvbWlzZSBmcm9tIGxhc3QgbG9hZCwgaWdub3JlLlxuICAgICAgICAgICAgaWYgKGN0eC5wcm9taXNlICE9PSBsb2FkUmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiBsb2FkZXIgaGFkIGFscmVhZHkgcmVzb2x2ZWQsIHRoZW4gdGhpcyBpcyBhIHByb2dyYW1tZXIgZXJyb3IsIGFuZCBzaG91bGQganVzdCBmYWlsLlxuICAgICAgICAgICAgaWYgKGN0eC5maW5hbCkge1xuICAgICAgICAgICAgICAgIC8vIFRPRE86IENvbnNpZGVyIGFkZGluZyBhIGJpdCBtb3JlIGNvbnRleHQgaGVyZS5cbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHJlZGF0YSBhbHJlYWR5IGZpbmFsaXNlZCBhbmQgbmV3IGRhdGEgcmVjZWl2ZWQ6ICR7SlNPTi5zdHJpbmdpZnkoZGF0YSl9YCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENhY2hlIGRhdGEgaW4gY2FzZSByZWRhdGEgdHJpZ2dlcnMgYWdhaW4gYW5kIHNob3VsZFJlbG9hZCBkZXRlcm1pbmVzIHRoYXQgY2FjaGUgaXMgdmFsaWQuXG4gICAgICAgICAgICBjdHgubGFzdERhdGEgPSBkYXRhO1xuXG4gICAgICAgICAgICAvLyBJbmZvcm0gYW55IHN1YnNjcmliZXIuXG4gICAgICAgICAgICBvblVwZGF0ZSAmJiBvblVwZGF0ZShkYXRhKTtcbiAgICAgICAgfSkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgLy8gSWYgdGhpcyBpcyB0aGUgbGFzdCBsb2FkLCBtYXJrIGFzIG5vIGxvbmdlciBhY2NlcHRpbmcgb25VcGRhdGUuXG4gICAgICAgICAgICBjdHgucHJvbWlzZSA9PT0gbG9hZFJlc3VsdCAmJiAoY3R4LmZpbmFsID0gdHJ1ZSk7XG5cbiAgICAgICAgICAgIC8vIElmIGxhc3REYXRhIGlzIG5vdCB0aGUgc2FtZSBhcyB0aGUgZGF0YSByZWNlaXZlZCwgdGhlbiB0aGUgdXNlciBkaWRuJ3QgY2FsbCBvblVwZGF0ZSwgZG8gaXQgZm9yIHRoZW0gYW5kIHN0b3JlIGRhdGEuXG4gICAgICAgICAgICBpZiAoY3R4Lmxhc3REYXRhICE9PSBkYXRhKSB7XG4gICAgICAgICAgICAgICAgY3R4Lmxhc3REYXRhID0gZGF0YTtcblxuICAgICAgICAgICAgICAgIC8vIEluZm9ybSBhbnkgc3Vic2NyaWJlci5cbiAgICAgICAgICAgICAgICBvblVwZGF0ZSAmJiBvblVwZGF0ZShkYXRhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRmluYWxseSByZXNvbHZlIGxvYWQgcHJvbWlzZS5cbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9KTtcblxuICAgICAgICBjdHgucHJvbWlzZSA9IGxvYWRSZXN1bHQ7IC8vIHN0b3JlIHByb21pc2UgcmVmZXJlbmNlIGluIG9yZGVyIHRvIGNoZWNrIHdoaWNoIGlzIHRoZSBsYXN0IG9uZSBpZiBtdWx0aXBsZSByZXNvbHZlXG5cbiAgICAgICAgcmV0dXJuIGxvYWRSZXN1bHQ7XG4gICAgfVxuXG4gICAgLy8gTWFyayB0aGlzIGZ1bmN0aW9uIGFzIGJlaW5nIGEgcmVkYXRhLCBmb3IgaW50ZXJuYWwgcHVycG9zZXMsIHNwZWFjaWFsbHkgdXNlZnVsIGZvciBjb21wb3NpdGlvbnMuXG4gICAgcmVkYXRhLmlzUmVkYXRhID0gdHJ1ZTtcblxuICAgIC8vIFN0b3JlIHRoZSBsb2FkLCBzaG91bGRSZWxvYWQgYW5kIG1hcHBlciBmb3IgZnV0dXJlIHJlZmVyZW5jZSBpbiByZWRhdGEgY29tcG9zaXRpb25zLlxuICAgIHJlZGF0YS5sb2FkID0gbG9hZC5iaW5kKG51bGwsIGxvYWRlcik7XG4gICAgcmVkYXRhLnNob3VsZFJlbG9hZCA9IHNob3VsZFJlbG9hZDtcbiAgICByZWRhdGEubWFwID0gbWFwcGVyO1xuXG4gICAgcmV0dXJuIHJlZGF0YTtcbn1cblxuLy8gcHJpdmF0ZSBzdHVmZiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIERlZmF1bHQgaW5pdGlhbCBjb250ZXh0IGZvciBuZXcgcmVkYXRhcy5cbmNvbnN0IGRlZmF1bHRJbml0aWFsQ3R4ID0ge1xuICAgIGxhc3REYXRhOiB1bmRlZmluZWQsIC8vIEhvbGRzIHRoZSBsYXN0IGxvYWRlZCBkYXRhLlxuICAgIGZpbmFsOiBmYWxzZSwgLy8gV2hldGhlciBsYXN0RGF0YSBpcyBmaW5hbCBvciBhIHJlc3VsdCBvZiBvblVwZGF0ZS5cbn07XG5cbmNvbnN0IGRlZmF1bHRJbml0aWFsRGF0YSA9IHsgbG9hZGluZzogdHJ1ZSwgZXJyb3I6IHVuZGVmaW5lZCwgcmVzdWx0OiB1bmRlZmluZWQgfTtcblxuZnVuY3Rpb24gbG9hZChsb2FkZXIsIHBhcmFtcywgb25VcGRhdGUpIHtcbiAgICAvLyBJbml0IG5ldyBkYXRhLlxuICAgIGNvbnN0IGRhdGEgPSB7IC4uLmRlZmF1bHRJbml0aWFsRGF0YSB9O1xuXG4gICAgLy8gU3RhcnQgbG9hZGluZywgcGFzc2luZyB0aGUgcGFyYW1ldGVycyB0aGF0IHdlcmUgcHJvdmlkZWQsIGFuZCByZXR1cm4gYSBwcm9taXNlIGZvciB0aGUgbG9hZGVyIHJlc3VsdGluZyBkYXRhLlxuICAgIHJldHVybiBsb2FkZXIocGFyYW1zLCBvblVwZGF0ZSlcbiAgICAudGhlbigocmVzdWx0KSA9PiB7IGRhdGEucmVzdWx0ID0gcmVzdWx0OyB9KVxuICAgIC5jYXRjaCgoZXJyb3IpID0+IHsgZGF0YS5lcnJvciA9IGVycm9yOyB9KVxuICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgZGF0YS5sb2FkaW5nID0gZmFsc2U7XG5cbiAgICAgICAgb25VcGRhdGUoZGF0YSk7XG5cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRTaG91bGRSZWxvYWQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0TWFwcGVyKGRhdGEpIHtcbiAgICByZXR1cm4gZGF0YTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmV4cG9ydCBkZWZhdWx0IGNvbmZpZ1JlZGF0YTtcbiJdfQ==
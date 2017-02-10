"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function redata(loader) {
    var shouldReload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultShouldReload;
    var mapper = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultMapper;
    var initialCtx = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : defaultInitialCtx;

    // Initialise context.
    var ctx = initialCtx;

    function configuredRedata(params, onUpdate) {
        // If should not reload the data.
        if (!shouldReload(params)) {
            onUpdate(ctx.lastData);

            return Promise.resolve(ctx.lastData);
        }

        // Data not valid, load new data and subscribe to its updates.
        ctx.lastData = _extends({}, defaultInitialData);
        ctx.final = false; // Not final, waiting to get results.

        // Update any subscriber about new data.
        onUpdate && onUpdate(ctx.lastData);

        var loadResult = load(loader, params, function (data) {
            // If not the last load, ignore.
            if (ctx.promise !== loadResult) {
                return;
            }

            // If loader had already resolved, then this is a programmer error, and should just fail.
            if (ctx.final) {
                // TODO: Consider adding a bit more context here.
                throw new Error("redata already finalised and new data received: " + JSON.stringify(data));
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
    configuredRedata.isRedata = true;

    // Store the load, shouldReload and mapper for future reference in redata compositions.
    configuredRedata.load = load.bind(null, loader);
    configuredRedata.shouldReload = shouldReload;
    configuredRedata.map = mapper;

    return configuredRedata;
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

exports.default = redata;
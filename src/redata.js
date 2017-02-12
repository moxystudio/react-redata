import shallowequal from 'shallowequal';
import compose from './composition/compose';
import props from './composition/props';

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
function configRedata(loader, shouldReload = defaultShouldReload, mapper = defaultMapper, initialCtx = defaultInitialCtx) {
    // Initialise context, which is passed around and holds the lastData.
    const ctx = initialCtx;

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
        ctx.lastData = { ...defaultInitialData };

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
const defaultInitialCtx = {
    lastData: undefined, // Holds the last loaded data.
};

const defaultInitialData = { loading: true, error: undefined, result: undefined };

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
    const loadedData = {};

    loadedData.promise = loader(params, handleLoadResult.bind(null, ctx, loadedData, onUpdate, true))
                                  .then(handleLoadResult.bind(null, ctx, loadedData, onUpdate, false, undefined))
                                 .catch(handleLoadResult.bind(null, ctx, loadedData, onUpdate, false));

    // Return promise for data.
    return loadedData.promise;
}

function handleLoadResult(ctx, loadedData, onUpdate, loading, error, result) {
    // If not the promise from last load, ignore.
    if (ctx.promise !== loadedData.promise) {
        return;
    }

    const lastData = ctx.lastData;

    // Store final data.
    ctx.lastData = { loading, error, result };

    // If lastData and final data not the same, then user didn't call onUpdate. Do it for them.
    onUpdate && !shallowequal(lastData, ctx.lastData) && onUpdate(ctx.lastData);

    // Finally resolve load promise.
    return ctx.lastData;
}

// ------------------------------------------------------------------------------------------------

export default configRedata;
export { defaultShouldReload, defaultMapper, defaultInitialCtx, defaultInitialData, props, compose };

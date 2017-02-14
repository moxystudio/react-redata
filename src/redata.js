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
function create(loader, shouldReload = defaultShouldReload, mapper = defaultMapper, initialCtx = defaultInitialCtx) {
    // Initialise context, which is passed around and holds the lastData.
    const ctx = initialCtx; // TODO: instead of providing a full initial context, the redata() function below should receive
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
        ctx.lastData = { ...defaultInitialData };
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
    const loadedData = {
        loading: true, // Start off "loading", but once the promise below resolves, this value is false.
    };

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

    const lastData = ctx.lastData;

    // If loading status was provided, update loadedData.
    loading !== undefined && (loadedData.loading = loading);

    // Store final data.
    ctx.lastData = { loading: loadedData.loading, error, result };

    // If lastData and received data not shallow equal, then loader didn't call onUpdate. Implicitly do it.
    onUpdate && !shallowequal(lastData, ctx.lastData) && onUpdate(ctx.lastData);
console.log('handleLoadResult', ctx.lastData);
    return ctx.lastData;
}

// ------------------------------------------------------------------------------------------------

export default create;
export { defaultShouldReload, defaultMapper, defaultInitialCtx, defaultInitialData, props, compose };

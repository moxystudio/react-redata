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
    // Initialise context.
    const ctx = initialCtx;

    function redata(params, onUpdate) {
        console.log('triggered redata', {
            shouldReload: shouldReload(params),
        });

        // If should not reload the data.
        if (!shouldReload(params)) {
            // Inform any subscriber.
            onUpdate && onUpdate(ctx.lastData);

            // Resolve with final data.
            return Promise.resolve(ctx.lastData);
        }

        // Data not valid, load new data and subscribe to its updates.
        ctx.lastData = { ...defaultInitialData };
        ctx.final = false; // Not final, waiting to get results.

        // Update any subscriber about new data.
        onUpdate && onUpdate(ctx.lastData);

        const loadResult = load(loader, params, (data) => {
            // If not the promise from last load, ignore.
            if (ctx.promise !== loadResult) {
                return;
            }

            // If loader had already resolved, then this is a programmer error, and should just fail.
            if (ctx.final) {
                // TODO: Consider adding a bit more context here.
                // TODO: Actually, now that I think about it, it might be worth just ignoring the data. This might be a pattern
                // for complex compositions, like .race().
                throw new Error(`redata already finalised and new data received: ${JSON.stringify(data)}`);
            }

            // Cache data in case redata triggers again and shouldReload determines that cache is valid.
            ctx.lastData = data;

            // Inform any subscriber.
            onUpdate && onUpdate(data);
        }).then((data) => {
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

// private stuff ----------------------------------------------------------------------------------

// Default initial context for new redatas.
const defaultInitialCtx = {
    lastData: undefined, // Holds the last loaded data.
    final: false, // Whether lastData is final or a result of onUpdate.
};

const defaultInitialData = { loading: true, error: undefined, result: undefined };

/**
 * Calls the loader function with current params and returns a promise which resolves with the {@link data} format
 * @param {function} loader - called to fetch new data
 * @param {object} params - arguments object provided to loader function
 * @param {function} onUpdate - called when new data arrives
 * @return {Promise} - promise which resolves with the {@link data} format
*/
function load(loader, params, onUpdate) {
    // Init new data.
    const data = { ...defaultInitialData };

    // Start loading, passing the parameters that were provided, and return a promise for the loader resulting data.
    return loader(params, onUpdate)
        .then((result) => { data.result = result; })
        .catch((error) => { data.error = error; })
        .then(() => {
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

export default configRedata;

// Default initial context for new redatas.
const defaultInitialCtx = {
    lastData: undefined, // Holds the last loaded data.
    final: false, // Whether lastData is final or a result of onUpdate.
};

const defaultInitialData = { loading: true, error: undefined, result: undefined };

function redata(loader, shouldReload = defaultShouldReload, mapper = defaultMapper, initialCtx = defaultInitialCtx) {
    // Initialise context.
    const ctx = initialCtx;

    function configuredRedata(params, onUpdate) {
        // If should not reload the data.
        if (!shouldReload(params)) {
            onUpdate(ctx.lastData);

            return Promise.resolve(ctx.lastData);
        }

        // Data not valid, load new data and subscribe to its updates.
        ctx.lastData = { ...defaultInitialData };
        ctx.final = false; // Not final, waiting to get results.

        // Update any subscriber about new data.
        onUpdate && onUpdate(ctx.lastData);

        const loadResult = load(loader, params, (data) => {
            // If not the last load, ignore.
            if (ctx.promise !== loadResult) {
                return;
            }

            // If loader had already resolved, then this is a programmer error, and should just fail.
            if (ctx.final) {
                // TODO: Consider adding a bit more context here.
                throw new Error(`redata already finalised and new data received: ${JSON.stringify(data)}`);
            }

            // Cache data in case redata triggers again and shouldReload determines that cache is valid.
            ctx.lastData = data;

            // Inform any subscriber.
            onUpdate && onUpdate(data);
        }).then((data) => {
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

function load(loader, params, onUpdate) {
    // Init new data.
    const data = { ...defaultInitialData };

    // Start loading, passing the parameters that were provided, and return a promise for the loader resulting data.
    return loader(params)
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

export default redata;

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
console.log('redata()');

        // If should not reload the data.
        if (!shouldReload(params)) {
            onUpdate(ctx.lastData);
console.log('should NOT reload');
            return Promise.resolve(ctx.lastData);
        }

console.log('going to load()');
        // Data not valid, load new data and subscribe to its updates.
        ctx.lastData = { ...defaultInitialData };
        ctx.final = false; // Not final, waiting to get results.

        // Update any subscriber about new data.
        onUpdate && onUpdate(ctx.lastData);

        return load(loader, params, (data) => {
            if (ctx.final) {
                // TODO: Consider adding a bit more context here.
                throw new Error(`redata already finalised and new data received: ${JSON.stringify(data)}`);
            }

            // Cache data in case redata triggers again and shouldReload determines that cache is valid.
            ctx.lastData = data;

            // Inform any subscriber.
            onUpdate && onUpdate(data);
        }).then((data) => {
            // No longer accept onUpdate.
            ctx.final = true;

            return data;
        });
    }

    // Store the load, shouldReload and mapper for future reference in redata compositions.
    configuredRedata.load = load.bind(null, loader);
    configuredRedata.shouldReload = shouldReload;
    configuredRedata.map = mapper;

    return configuredRedata;
}

function load(loader, params, onUpdate) {
    // Init new data.
    const data = { ...defaultInitialData };

    // Start loading, passing the parameters that were provided, and return a promise for the loader resulting data.
    return loader(params)
        .then((result) => { data.result = result; })
        .catch((error) => { data.error = error; })
        .then(() => {
            data.loading = false;
console.log('final then');
            onUpdate(data);

            return data;
        });
}

// private stuff ----------------------------------------------------------------------------------

function defaultShouldReload() {
    return false;
}

function defaultMapper(data) {
    return data;
}

// ------------------------------------------------------------------------------------------------

export default redata;

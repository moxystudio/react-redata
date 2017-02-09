function redata(loader, shouldReload = defaultShouldReload, mapper = defaultMapper, initialData = undefined) {
    // ctx will hold last cached data.
    const ctx = {
        cachedData: initialData, // Here only for readability, holds the last cached data.
        final: true, // Whether the cached data is final.
    };

    function configuredRedata(params, onUpdate) {
console.log('redata()')

        // If should not reload the data.
        if (!shouldReload(params)) {
            onUpdate(ctx.cachedData, ctx.final);
console.log('should NOT reload');
            return Promise.resolve(ctx.cachedData);
        }

console.log('going to load()');
        // Data not valid, load data and subscribe to its updates.
        delete ctx.cachedData;
        ctx.final = false;

        return load(loader, params, (data, final) => {
            if (ctx.final) {
                // TODO: Consider adding a bit more context here.
                throw new Error(`redata already finalised and new data received: ${JSON.stringify(data)}`);
            }

            // Cache data in case redata triggers again and shouldReload determines that cache is valid.
            ctx.cachedData = data;
            ctx.final = final;

            // Inform any subscriber.
            onUpdate && onUpdate(data, final);
        });
    }

    // Store the load, shouldReload and mapper for future reference in redata compositions.
    configuredRedata.load = load.bind(null, loader);
    configuredRedata.shouldReload = shouldReload;
    configuredRedata.map = mapper;

    return configuredRedata;
}

function load(loader, params, onUpdate) {
    // Let's create a new data.
    const data = { loading: true };

    onUpdate(data, false);

    // Start loading, passing the parameters that were provided, and return a promise for the loader resulting data.
    return loader(params)
        .then((result) => { data.result = result; })
        .catch((error) => { data.error = error; })
        .then(() => {
            data.loading = false;

            onUpdate(data, true);

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
export { load };

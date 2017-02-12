import configRedata, { defaultMapper, defaultInitialData } from '../redata';
import shallowequal from 'shallowequal';

function compose(collectionHandler, items, shouldReload = defaultShouldReload, mapper = defaultMapper) {
    // Init a ctx which will hold the data of the composition.
    const ctx = {};

    // Create a redata that composes the multiple redata items and handles resolution of the Promise using the collectionHandler.
    return configRedata(composeLoader.bind(null, ctx, collectionHandler, items, (key, data) => {
        // Store data in its key.
        ctx.newData[key] = data;
    }), shouldReload, mapper)
    // collectionHandler determined that composition is over.
    .then((data) => {
        // Make sure that the resolved data is stored in newData.
        ctx.newData = data;

        // if lastData and newData are shallow equal, then use lastData, so that the memory reference doesn't change.
        if (shallowequal(data, ctx.lastData)) {
            ctx.newData = ctx.lastData;
        }

        // Resolve composition.
        return ctx.newData;
    });
}

// private stuff ----------------------------------------------------------------------------------

function composeLoader(ctx, collectionHandler, items, params, onUpdate) {
    ctx.newData = mapKeys(items, () => defaultInitialData);
    ctx.final = false;

    return collectionHandler(mapKeys(items, (redata, key) => redata(params, onUpdate.bind(null, key))));
}

// By default, any composition should reload, and it's up to the parts to decide what to do.
function defaultShouldReload() {
    return true;
}

function mapKeys(obj, iteratee = (value) => value) {
    const newObj = {};

    Object.keys(obj).each((key) => {
        newObj[key] = iteratee(obj[key], key, obj);
    });

    return newObj;
}

export default compose;

import { defaultInitialData, defaultMapper } from '../redata';
import shallowequal from 'shallowequal';

function compose(collectionHandler, items) {
    // Init a composition which will hold the data.
    const composition = {};

    // Create a loader that composes the multiple redata items and handles resolution of the Promise using the collectionHandler.
    return composeLoader.bind(null, composition, collectionHandler, items, updateComposition.bind(null, composition));
}

// Default shouldReload that goes through each item redata and asks if the reload is necessary. If any says that it is, a redata happens.
function defaultShouldReload(items, params) {
    // Go through all and check if any redata shouldReload.
    for (const key in items) {
        if (items[key].shouldReload(params)) {
            return true;
        }
    }

    return false;
}

// private stuff ----------------------------------------------------------------------------------

function composeLoader(composition, collectionHandler, items, onUpdate, params) {
console.log('composeLoader', Array.prototype.slice.call(arguments));
    composition.data = mapKeys(items, () => defaultInitialData);

    // Create object with keys and respective redatas bound to the params and onUpdate provided to this loader, and wait for
    // the collectionHandler to determine that the redata collection is resolved.
    return collectionHandler(mapKeys(items, (redata, key) => redata(params, onUpdate.bind(null, key))))
    // collectionHandler determined that composition is over.
    .then((data) => {
console.log('collectionHandler.then', data)
        // If composition data and resolved data are shallow equal, then use data, so that the memory reference doesn't change.
        if (!shallowequal(data, composition.data)) {
            composition.data = data;
        } else {
            // Merge previous keys from lastData that are not present in new data. These were provided by onUpdate calls.
            composition.data = { ...composition.data, ...data };
        }

        // Resolve composition.
        return composition.data;
    });
}

function updateComposition(composition, key, data) {
console.log('updateComposition', key, data);
    composition.data = { ...composition.data, [key]: data };
}

function mapKeys(obj, iteratee = (value) => value) {
    const newObj = {};

    Object.keys(obj).forEach((key) => {
        newObj[key] = iteratee(obj[key], key, obj);
    });

    return newObj;
}

export default compose;
export { defaultShouldReload, defaultMapper };

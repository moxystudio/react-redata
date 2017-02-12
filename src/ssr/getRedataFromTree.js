import * as ReactDOM from 'react-dom/server';
import reactTraverseTree from '../react/traverse-tree';

/**
 * Note: this function is heavily inspired by react apollo's approach:
 * https://github.com/apollographql/react-apollo/blob/c6e74d6ca004e5544fd607292de153458cccacd9/src/server.ts
 */


/**
 * Obtains all redata promises for the node provided and fills the redata store when they resolve.
 *
 * @param {Object} [redataStore = {}] - redata store object containing all data retrieved so far. This object
 * is indexed by each redata component's unique ID.
 * @param {ReactElement | DOMElement} rootEl - Node being inspected.
 * @param {Object} [rootContext = {}] - current component context, if it exists.
 * @param {boolean} [fetchRoot = true] - True if the root redata should be done on the server, false otherwise.
 *
 * @return {Promise<Object>} - redata store
 */
export function getRedataFromTree(redataStore = {}, rootEl, rootContext = {}, fetchRoot = true) {
    const queries = getQueriesFromTree({ rootEl, rootContext }, fetchRoot);

    // no queries found, nothing to do
    if (!queries.length) {
        return Promise.resolve(redataStore);
    }

    // wait on each query that we found, re-rendering the subtree when it's done
    const mappedQueries = queries.map(({ promise, element, context }) => {
        // we've just grabbed the promise for element, so don't try and get it again
        return promise.then((data) => {
            // TODO update this in the future. also, check for promise rejection
            redataStore['foo'] = data; // eslint-disable-line dot-notation

            return getRedataFromTree(redataStore, element, context, false);
        });
    });

    return Promise.all(mappedQueries).then(() => redataStore);
}

/**
 * Renders React component to string, after all of the redata has been done.
 *
 * @param {ReactElement} component - React component being rendered.
 *
 * @return {Promise<Object>} - Resolved object has the following format:
 * {
 *   redataStore: Object,
 *   html: string
 * }
 */
export function renderToStringWithRedata(component) {
    const redataStore = {};

    return getRedataFromTree(redataStore, component)
        .then((finalRedataStore) => {
            return {
                redataStore: finalRedataStore,
                html: ReactDOM.renderToString(component),
            };
        });
}

// private stuff ----------------------------------------------------------------------------------

/**
 * Gets all redata promises for the node provided.
 *
 * @param {ReactElement | DOMElement} rootElement - Node being inspected.
 * @param {boolean} [fetchRoot = true] - True if the root redata should be done on the server, false otherwise.
 *
 * @return {Promise<Object>} - redata store
 */
function getQueriesFromTree({ rootElement, rootContext = {} }, fetchRoot = true
) {
    const queries = [];

    reactTraverseTree(rootElement, rootContext, (element, instance, context) => {
        const skipRoot = !fetchRoot && (element === rootElement);

        if (instance && typeof instance.fetchData === 'function' && !skipRoot) {
            const promise = instance.fetchData();

            if (promise) {
                queries.push({ promise, element, context });

                // Tell reactTraverseTree to not recurse inside this component.
                // We have to wait for the promise to resolve before attempting it.
                return false;
            }
            // if no data loading needs where found, tell reactTraverseTree to keep walking
            return true;
        }
    });

    return queries;
}


import { Children } from 'react';

/**
 * Traverses a react component tree, running the visitorFn on each node.
 *
 * @param {ReactElement | DOMElement} element - React or dom element currently being traversed.
 * @param {Object} context - Element context.
 * @param {function} visitorFn - function that runs on the current node. Returns a boolean: false
 * if the traverse should stop or true if it should continue.
 */
export function traverseTree(element, context, visitorFn) {
    const Component = element.type;

    // a stateless functional component or a class
    if (typeof Component === 'function') {
        const props = { ...Component.defaultProps, ...element.props };
        let child;
        let childContext = context;

        if (isReactClass(Component)) {
            // If it's a React Class, we'll create an instance, override setState so that it does
            // not trigger updates, run the necessary lifecycle methods and obtain children

            const instance = new Component(props, context);

            // In case the user doesn't pass these to super in the constructor
            instance.props = instance.props || props;
            instance.context = instance.context || context;

            instance.setState = (newState) => {
                instance.state = { ...instance.state, ...newState };
            };

            // this is a poor man's version of
            //   https://github.com/facebook/react/blob/master/src/renderers/shared/stack/reconciler/ReactCompositeComponent.js#L181
            if (instance.componentWillMount) {
                instance.componentWillMount();
            }

            if (visitorFn(element, instance, context) === false) {
                // a promise was found - we'll stop traversing the tree until it's resolved
                return;
            }

            if (instance.getChildContext) {
                childContext = { ...context, ...instance.getChildContext() };
            }

            child = instance.render();
        } else {
            // Stateless functional component
            if (visitorFn(element, null, context) === false) {
                // a promise was found - we'll stop traversing the tree until it's resolved
                return;
            }

            child = Component(props, context); // eslint-disable-line new-cap
        }

        if (child) {
            traverseTree(child, childContext, visitorFn);
        }
    } else { // a basic string or dom element, just get children
        if (visitorFn(element, null, context) === false) {
            // a promise was found - we'll stop traversing the tree until it's resolved
            return;
        }

        if (element.props && element.props.children) {
            Children.forEach(element.props.children, (child) => {
                if (child) {
                    traverseTree(child, context, visitorFn);
                }
            });
        }
    }
}

// private stuff ----------------------------------------------------------------------------------

// from https://github.com/facebook/react/blob/master/src/renderers/shared/stack/reconciler/ReactCompositeComponent.js#L46
function isReactClass(Component) {
    return !!(Component.prototype && Component.prototype.isReactComponent);
}

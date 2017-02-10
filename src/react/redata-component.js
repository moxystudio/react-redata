import React, { PureComponent } from 'react';

// public stuff -----------------------------------------------------------------------------------

function redataComponent(boundRedata, WrappedComponent) {
    class RedataComponent extends PureComponent {
        constructor(props) {
            super(props);

            this.state = {};

            this._handleOnUpdate = this._handleOnUpdate.bind(this);

            // If it's in the browser, check if there is data coming from server side rendering.
            const serverData = this._loadFromServerRender();

            // Finalise configuration of our redata.
            this._redata = boundRedata(serverData);
console.log('will redata in constructor');
            // If nothing come from server, redata.
            serverData === undefined && this._redata({
                props: {},
                nextProps: props,
                data: serverData,
            }, this._handleOnUpdate);
console.log('did redata in constructor');
        }

        componentDidMount() {
            this._isMounted = true;
        }

        componentWillUpdate(nextProps) {
            // Flow params into redata.
            this._redata({ props: this.props, nextProps, data: this._lastData }, this._handleOnUpdate);
        }

        render() {
            // Render wrapped component passing the received props and the spreaded data.
            return <WrappedComponent { ...this.props } { ...this.state } />;
        }

        _safeSetState(nextState) {
            if (this._isMounted) {
                this.setState(nextState);
            } else {
                this.state = { ...this.state, ...nextState };
            }
        }

        _loadFromServerRender() {
            // If data was already available from server.
            if (typeof window !== 'undefined' && window.__redata && window.__redata.store) {
                return window.__redata.store[this._componentUniqueId()];
            }

            return undefined;
        }

        _componentUniqueId() {
            // TODO: investigate how to consistently generate this
            return 'foo';
        }

        _handleOnUpdate(data) {
console.log('_handleOnUpdate', data);
            // TODO: Map the load result using the mapper and store it in the state, which will trigger a render.
            this._lastData = data;

            this._safeSetState({ ...data });
        }
    }

    RedataComponent.displayName = `Redata(${getDisplayName(WrappedComponent)})`;

    return RedataComponent;
}

// private stuff ----------------------------------------------------------------------------------

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

// ------------------------------------------------------------------------------------------------

export default redataComponent;

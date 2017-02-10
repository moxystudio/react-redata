import React, { PureComponent, PropTypes } from 'react';
import shallowequal from 'shallowequal';

// public stuff -----------------------------------------------------------------------------------

function redataComponent(boundRedata, OriginalComponent) {
    // Will hold redata that is shared by Wrapper and Extended components.
    let redata;

    class WrapperComponent extends PureComponent {
        constructor(props) {
            super(props);

            this.state = {
                data: undefined,
            };

            this._handleOnDataUpdate = this._handleOnDataUpdate.bind(this);

            // If it's in the browser, check if there is data coming from server side rendering.
            const serverData = this._loadFromServerRender();

            // Finalise configuration of our redata.
            redata = boundRedata(serverData);

            // If nothing come from server, redata.
            serverData === undefined && redata({
                props: {},
                nextProps: props,
                data: serverData,
            }, this._handleOnDataUpdate);
        }

        componentDidMount() {
            this._isMounted = true;
        }

        componentWillUpdate(nextProps) {
            // Flow params into redata.
            redata({ props: this.props, nextProps, data: this.state.data }, this._handleOnDataUpdate);
        }

        render() {
            // Render original component passing the received props and the spreaded data.
            return <OriginalComponent { ...this.props } { ...this.state.data } />;
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

        _handleOnDataUpdate(data) {
            this._safeSetState({ data });
        }

        _handleOnStateUpdate(state, nextState) {

        }
    }

    WrapperComponent.displayName = `Redata(${getDisplayName(OriginalComponent)})`;

    // Extend the OriginalComponent, so we get access to lifecycle methods and, consequently, the state changes.
    class ExtendedComponent extends OriginalComponent {
        componentWillUpdate(nextProps, nextState) {
            super.componentWillUpdate(nextProps, nextState);

            // If state changed, inform __redataOnStateUpdate.
            shallowequal(this.state, nextState) && this.props.__redataOnStateUpdate(this.state, nextState);
        }
    }

    ExtendedComponent.propTypes = {
        __redataOnStateUpdate: PropTypes.func.isRequired,
    };

    return WrapperComponent;
}

// private stuff ----------------------------------------------------------------------------------

function getDisplayName(OriginalComponent) {
    return OriginalComponent.displayName || OriginalComponent.name || 'Component';
}

// ------------------------------------------------------------------------------------------------

export default redataComponent;

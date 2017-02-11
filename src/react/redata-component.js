import React, { PureComponent, PropTypes } from 'react';
import shallowequal from 'shallowequal';

// public stuff -----------------------------------------------------------------------------------

function redataComponent(boundRedata, OriginalComponent) {
    // Will hold redata that is shared by Wrapper and Extended components.
    let redata;

    class WrapperComponent extends PureComponent {
        constructor(props) {
            super(props);

            // Initialise state with undefined data and WrappedComponent state.
            const originalComponentState = {
                state: undefined,
                nextState: undefined,
            };

            this.state = {
                data: undefined,
                originalComponentState,
            };

            this._handleOnDataUpdate = this._handleOnDataUpdate.bind(this);
            this._handleOnStateUpdate = this._handleOnStateUpdate.bind(this);

            // If it's in the browser, check if there is data coming from server side rendering.
            const serverData = this._loadFromServerRender();

            // Finalise configuration of our redata.
            redata = boundRedata(serverData);

            // If nothing came from server, redata.
            serverData === undefined && redata({
                props: {},
                nextProps: props,
                state: originalComponentState.state,
                nextState: originalComponentState.nextState,
                data: serverData,
            }, this._handleOnDataUpdate);
        }

        componentDidMount() {
            this._isMounted = true;
        }

        componentWillUpdate(nextProps) {
            // console.log('WrapperComponent::componentWillUpdate');
            const { state, nextState } = this.state.originalComponentState;

            // Flow params into redata.
            redata({ props: this.props, nextProps, state, nextState, data: this.state.data }, this._handleOnDataUpdate);

            // If OriginalComponent state is changing, store nextState in state.
            state !== nextState && this._safeSetState({
                originalComponentState: {
                    state: nextState,
                    nextState,
                },
            });
        }

        render() {
            // Render extended passing the received props and the spreaded data.
            return (
                <ExtendedComponent
                    { ...this.props }
                    { ...this.state.data }
                    onRedataOriginalComponentStateUpdate={ this._handleOnStateUpdate } />
            );
        }

        _safeSetState(state) {
            if (this._isMounted) {
                this.setState(state);
            } else {
                this.state = { ...this.state, ...state };
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
            console.log('_handleOnDataUpdate', data);
            this._safeSetState({ data });
        }

        _handleOnStateUpdate(state, nextState) {
            this._safeSetState({
                originalComponentState: { state, nextState },
            });
        }
    }

    WrapperComponent.displayName = `Redata(${getDisplayName(OriginalComponent)})`;

    // Extend the OriginalComponent, so we get access to lifecycle methods and, consequently, the state changes.
    class ExtendedComponent extends OriginalComponent {
        componentWillUpdate(nextProps, nextState) {
            // console.log('ExtendedComponent::componentWillUpdate');
            // If OriginalComponent has a componentWillUpdate method, call it first.
            super.componentWillUpdate && super.componentWillUpdate(nextProps, nextState);

            // If state changed, inform onRedataOriginalComponentStateUpdate.
            (!shallowequal(this.state, nextState)) && this.props.onRedataOriginalComponentStateUpdate(this.state, nextState);
        }
    }

    ExtendedComponent.propTypes = {
        // Using a hard to collide prop, which is used to hook into state updates of the OriginalComponent.
        onRedataOriginalComponentStateUpdate: PropTypes.func.isRequired,
    };

    return WrapperComponent;
}

// private stuff ----------------------------------------------------------------------------------

function getDisplayName(OriginalComponent) {
    return OriginalComponent.displayName || OriginalComponent.name || 'Component';
}

// ------------------------------------------------------------------------------------------------

export default redataComponent;

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _shallowequal = require('shallowequal');

var _shallowequal2 = _interopRequireDefault(_shallowequal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// public stuff -----------------------------------------------------------------------------------

function redataComponent(boundRedata, OriginalComponent) {
    // Will hold redata that is shared by Wrapper and Extended components.
    var redata = void 0;

    var WrapperComponent = function (_PureComponent) {
        _inherits(WrapperComponent, _PureComponent);

        function WrapperComponent(props) {
            _classCallCheck(this, WrapperComponent);

            // Initialise state with undefined data and WrappedComponent state.
            var _this = _possibleConstructorReturn(this, (WrapperComponent.__proto__ || Object.getPrototypeOf(WrapperComponent)).call(this, props));

            var originalComponentState = {
                state: undefined,
                nextState: undefined
            };

            _this.state = {
                data: undefined,
                originalComponentState: originalComponentState
            };

            _this._handleOnDataUpdate = _this._handleOnDataUpdate.bind(_this);
            _this._handleOnStateUpdate = _this._handleOnStateUpdate.bind(_this);

            // If it's in the browser, check if there is data coming from server side rendering.
            var serverData = _this._loadFromServerRender();

            // Finalise configuration of our redata.
            redata = boundRedata(serverData);

            // If nothing come from server, redata.
            serverData === undefined && redata({
                props: {},
                nextProps: props,
                state: originalComponentState.state,
                nextState: originalComponentState.nextState,
                data: serverData
            }, _this._handleOnDataUpdate);
            return _this;
        }

        _createClass(WrapperComponent, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                this._isMounted = true;
            }
        }, {
            key: 'componentWillUpdate',
            value: function componentWillUpdate(nextProps) {
                // console.log('WrapperComponent::componentWillUpdate');
                var _state$originalCompon = this.state.originalComponentState,
                    state = _state$originalCompon.state,
                    nextState = _state$originalCompon.nextState;

                // Flow params into redata.

                redata({ props: this.props, nextProps: nextProps, state: state, nextState: nextState, data: this.state.data }, this._handleOnDataUpdate);

                // If OriginalComponent state is changing, store nextState in state.
                state !== nextState && this._safeSetState({
                    originalComponentState: {
                        state: nextState,
                        nextState: nextState
                    }
                });
            }
        }, {
            key: 'render',
            value: function render() {
                // Render extended passing the received props and the spreaded data.
                return _react2.default.createElement(ExtendedComponent, _extends({}, this.props, this.state.data, {
                    onRedataOriginalComponentStateUpdate: this._handleOnStateUpdate }));
            }
        }, {
            key: '_safeSetState',
            value: function _safeSetState(state) {
                if (this._isMounted) {
                    this.setState(state);
                } else {
                    this.state = _extends({}, this.state, state);
                }
            }
        }, {
            key: '_loadFromServerRender',
            value: function _loadFromServerRender() {
                // If data was already available from server.
                if (typeof window !== 'undefined' && window.__redata && window.__redata.store) {
                    return window.__redata.store[this._componentUniqueId()];
                }

                return undefined;
            }
        }, {
            key: '_componentUniqueId',
            value: function _componentUniqueId() {
                // TODO: investigate how to consistently generate this
                return 'foo';
            }
        }, {
            key: '_handleOnDataUpdate',
            value: function _handleOnDataUpdate(data) {
                console.log('_handleOnDataUpdate', data);
                this._safeSetState({ data: data });
            }
        }, {
            key: '_handleOnStateUpdate',
            value: function _handleOnStateUpdate(state, nextState) {
                this._safeSetState({
                    originalComponentState: { state: state, nextState: nextState }
                });
            }
        }]);

        return WrapperComponent;
    }(_react.PureComponent);

    WrapperComponent.displayName = 'Redata(' + getDisplayName(OriginalComponent) + ')';

    // Extend the OriginalComponent, so we get access to lifecycle methods and, consequently, the state changes.

    var ExtendedComponent = function (_OriginalComponent) {
        _inherits(ExtendedComponent, _OriginalComponent);

        function ExtendedComponent() {
            _classCallCheck(this, ExtendedComponent);

            return _possibleConstructorReturn(this, (ExtendedComponent.__proto__ || Object.getPrototypeOf(ExtendedComponent)).apply(this, arguments));
        }

        _createClass(ExtendedComponent, [{
            key: 'componentWillUpdate',
            value: function componentWillUpdate(nextProps, nextState) {
                // console.log('ExtendedComponent::componentWillUpdate');
                // If OriginalComponent has a componentWillUpdate method, call it first.
                _get(ExtendedComponent.prototype.__proto__ || Object.getPrototypeOf(ExtendedComponent.prototype), 'componentWillUpdate', this) && _get(ExtendedComponent.prototype.__proto__ || Object.getPrototypeOf(ExtendedComponent.prototype), 'componentWillUpdate', this).call(this, nextProps, nextState);

                // If state changed, inform onRedataOriginalComponentStateUpdate.
                !(0, _shallowequal2.default)(this.state, nextState) && this.props.onRedataOriginalComponentStateUpdate(this.state, nextState);
            }
        }]);

        return ExtendedComponent;
    }(OriginalComponent);

    ExtendedComponent.propTypes = {
        // Using a hard to collide prop, which is used to hook into state updates of the OriginalComponent.
        onRedataOriginalComponentStateUpdate: _react.PropTypes.func.isRequired
    };

    return WrapperComponent;
}

// private stuff ----------------------------------------------------------------------------------

function getDisplayName(OriginalComponent) {
    return OriginalComponent.displayName || OriginalComponent.name || 'Component';
}

// ------------------------------------------------------------------------------------------------

exports.default = redataComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdC9yZWRhdGEtY29tcG9uZW50LmpzIl0sIm5hbWVzIjpbInJlZGF0YUNvbXBvbmVudCIsImJvdW5kUmVkYXRhIiwiT3JpZ2luYWxDb21wb25lbnQiLCJyZWRhdGEiLCJXcmFwcGVyQ29tcG9uZW50IiwicHJvcHMiLCJvcmlnaW5hbENvbXBvbmVudFN0YXRlIiwic3RhdGUiLCJ1bmRlZmluZWQiLCJuZXh0U3RhdGUiLCJkYXRhIiwiX2hhbmRsZU9uRGF0YVVwZGF0ZSIsImJpbmQiLCJfaGFuZGxlT25TdGF0ZVVwZGF0ZSIsInNlcnZlckRhdGEiLCJfbG9hZEZyb21TZXJ2ZXJSZW5kZXIiLCJuZXh0UHJvcHMiLCJfaXNNb3VudGVkIiwiX3NhZmVTZXRTdGF0ZSIsInNldFN0YXRlIiwid2luZG93IiwiX19yZWRhdGEiLCJzdG9yZSIsIl9jb21wb25lbnRVbmlxdWVJZCIsImNvbnNvbGUiLCJsb2ciLCJkaXNwbGF5TmFtZSIsImdldERpc3BsYXlOYW1lIiwiRXh0ZW5kZWRDb21wb25lbnQiLCJvblJlZGF0YU9yaWdpbmFsQ29tcG9uZW50U3RhdGVVcGRhdGUiLCJwcm9wVHlwZXMiLCJmdW5jIiwiaXNSZXF1aXJlZCIsIm5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBOztBQUVBLFNBQVNBLGVBQVQsQ0FBeUJDLFdBQXpCLEVBQXNDQyxpQkFBdEMsRUFBeUQ7QUFDckQ7QUFDQSxRQUFJQyxlQUFKOztBQUZxRCxRQUkvQ0MsZ0JBSitDO0FBQUE7O0FBS2pELGtDQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBR2Y7QUFIZSw0SUFDVEEsS0FEUzs7QUFJZixnQkFBTUMseUJBQXlCO0FBQzNCQyx1QkFBT0MsU0FEb0I7QUFFM0JDLDJCQUFXRDtBQUZnQixhQUEvQjs7QUFLQSxrQkFBS0QsS0FBTCxHQUFhO0FBQ1RHLHNCQUFNRixTQURHO0FBRVRGO0FBRlMsYUFBYjs7QUFLQSxrQkFBS0ss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LGdEQTBHN0JaLFNBMUc2QixFQTBHbEJQLFNBMUdrQixFQTBHUDtBQUNsRDtBQUNZO0FBQ0EsNFJBQXVETyxTQUF2RCxFQUFrRVAsU0FBbEU7O0FBRUE7QUFDQyxpQkFBQyw0QkFBYSxLQUFLRixLQUFsQixFQUF5QkUsU0FBekIsQ0FBRixJQUEwQyxLQUFLSixLQUFMLENBQVd3QixvQ0FBWCxDQUFnRCxLQUFLdEIsS0FBckQsRUFBNERFLFNBQTVELENBQTFDO0FBQ0g7QUFqSGdEOztBQUFBO0FBQUEsTUF5R3JCUCxpQkF6R3FCOztBQW9IckQwQixzQkFBa0JFLFNBQWxCLEdBQThCO0FBQzFCO0FBQ0FELDhDQUFzQyxpQkFBVUUsSUFBVixDQUFlQztBQUYzQixLQUE5Qjs7QUFLQSxXQUFPNUIsZ0JBQVA7QUFDSDs7QUFFRDs7QUFFQSxTQUFTdUIsY0FBVCxDQUF3QnpCLGlCQUF4QixFQUEyQztBQUN2QyxXQUFPQSxrQkFBa0J3QixXQUFsQixJQUFpQ3hCLGtCQUFrQitCLElBQW5ELElBQTJELFdBQWxFO0FBQ0g7O0FBRUQ7O2tCQUVlakMsZSIsImZpbGUiOiJyZWRhdGEtY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IFB1cmVDb21wb25lbnQsIFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzaGFsbG93ZXF1YWwgZnJvbSAnc2hhbGxvd2VxdWFsJztcblxuLy8gcHVibGljIHN0dWZmIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIHJlZGF0YUNvbXBvbmVudChib3VuZFJlZGF0YSwgT3JpZ2luYWxDb21wb25lbnQpIHtcbiAgICAvLyBXaWxsIGhvbGQgcmVkYXRhIHRoYXQgaXMgc2hhcmVkIGJ5IFdyYXBwZXIgYW5kIEV4dGVuZGVkIGNvbXBvbmVudHMuXG4gICAgbGV0IHJlZGF0YTtcblxuICAgIGNsYXNzIFdyYXBwZXJDb21wb25lbnQgZXh0ZW5kcyBQdXJlQ29tcG9uZW50IHtcbiAgICAgICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgICAgIHN1cGVyKHByb3BzKTtcblxuICAgICAgICAgICAgLy8gSW5pdGlhbGlzZSBzdGF0ZSB3aXRoIHVuZGVmaW5lZCBkYXRhIGFuZCBXcmFwcGVkQ29tcG9uZW50IHN0YXRlLlxuICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxDb21wb25lbnRTdGF0ZSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5leHRTdGF0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxDb21wb25lbnRTdGF0ZSxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZU9uRGF0YVVwZGF0ZSA9IHRoaXMuX2hhbmRsZU9uRGF0YVVwZGF0ZS5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5faGFuZGxlT25TdGF0ZVVwZGF0ZSA9IHRoaXMuX2hhbmRsZU9uU3RhdGVVcGRhdGUuYmluZCh0aGlzKTtcblxuICAgICAgICAgICAgLy8gSWYgaXQncyBpbiB0aGUgYnJvd3NlciwgY2hlY2sgaWYgdGhlcmUgaXMgZGF0YSBjb21pbmcgZnJvbSBzZXJ2ZXIgc2lkZSByZW5kZXJpbmcuXG4gICAgICAgICAgICBjb25zdCBzZXJ2ZXJEYXRhID0gdGhpcy5fbG9hZEZyb21TZXJ2ZXJSZW5kZXIoKTtcblxuICAgICAgICAgICAgLy8gRmluYWxpc2UgY29uZmlndXJhdGlvbiBvZiBvdXIgcmVkYXRhLlxuICAgICAgICAgICAgcmVkYXRhID0gYm91bmRSZWRhdGEoc2VydmVyRGF0YSk7XG5cbiAgICAgICAgICAgIC8vIElmIG5vdGhpbmcgY29tZSBmcm9tIHNlcnZlciwgcmVkYXRhLlxuICAgICAgICAgICAgc2VydmVyRGF0YSA9PT0gdW5kZWZpbmVkICYmIHJlZGF0YSh7XG4gICAgICAgICAgICAgICAgcHJvcHM6IHt9LFxuICAgICAgICAgICAgICAgIG5leHRQcm9wczogcHJvcHMsXG4gICAgICAgICAgICAgICAgc3RhdGU6IG9yaWdpbmFsQ29tcG9uZW50U3RhdGUuc3RhdGUsXG4gICAgICAgICAgICAgICAgbmV4dFN0YXRlOiBvcmlnaW5hbENvbXBvbmVudFN0YXRlLm5leHRTdGF0ZSxcbiAgICAgICAgICAgICAgICBkYXRhOiBzZXJ2ZXJEYXRhLFxuICAgICAgICAgICAgfSwgdGhpcy5faGFuZGxlT25EYXRhVXBkYXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICAgICAgdGhpcy5faXNNb3VudGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbXBvbmVudFdpbGxVcGRhdGUobmV4dFByb3BzKSB7XG4vLyBjb25zb2xlLmxvZygnV3JhcHBlckNvbXBvbmVudDo6Y29tcG9uZW50V2lsbFVwZGF0ZScpO1xuICAgICAgICAgICAgY29uc3QgeyBzdGF0ZSwgbmV4dFN0YXRlIH0gPSB0aGlzLnN0YXRlLm9yaWdpbmFsQ29tcG9uZW50U3RhdGU7XG5cbiAgICAgICAgICAgIC8vIEZsb3cgcGFyYW1zIGludG8gcmVkYXRhLlxuICAgICAgICAgICAgcmVkYXRhKHsgcHJvcHM6IHRoaXMucHJvcHMsIG5leHRQcm9wcywgc3RhdGUsIG5leHRTdGF0ZSwgZGF0YTogdGhpcy5zdGF0ZS5kYXRhIH0sIHRoaXMuX2hhbmRsZU9uRGF0YVVwZGF0ZSk7XG5cbiAgICAgICAgICAgIC8vIElmIE9yaWdpbmFsQ29tcG9uZW50IHN0YXRlIGlzIGNoYW5naW5nLCBzdG9yZSBuZXh0U3RhdGUgaW4gc3RhdGUuXG4gICAgICAgICAgICBzdGF0ZSAhPT0gbmV4dFN0YXRlICYmIHRoaXMuX3NhZmVTZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxDb21wb25lbnRTdGF0ZToge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZTogbmV4dFN0YXRlLFxuICAgICAgICAgICAgICAgICAgICBuZXh0U3RhdGUsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgICAgLy8gUmVuZGVyIGV4dGVuZGVkIHBhc3NpbmcgdGhlIHJlY2VpdmVkIHByb3BzIGFuZCB0aGUgc3ByZWFkZWQgZGF0YS5cbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPEV4dGVuZGVkQ29tcG9uZW50XG4gICAgICAgICAgICAgICAgICAgIHsgLi4udGhpcy5wcm9wcyB9XG4gICAgICAgICAgICAgICAgICAgIHsgLi4udGhpcy5zdGF0ZS5kYXRhIH1cbiAgICAgICAgICAgICAgICAgICAgb25SZWRhdGFPcmlnaW5hbENvbXBvbmVudFN0YXRlVXBkYXRlPXsgdGhpcy5faGFuZGxlT25TdGF0ZVVwZGF0ZSB9IC8+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgX3NhZmVTZXRTdGF0ZShzdGF0ZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2lzTW91bnRlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoc3RhdGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0geyAuLi50aGlzLnN0YXRlLCAuLi5zdGF0ZSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgX2xvYWRGcm9tU2VydmVyUmVuZGVyKCkge1xuICAgICAgICAgICAgLy8gSWYgZGF0YSB3YXMgYWxyZWFkeSBhdmFpbGFibGUgZnJvbSBzZXJ2ZXIuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Ll9fcmVkYXRhICYmIHdpbmRvdy5fX3JlZGF0YS5zdG9yZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cuX19yZWRhdGEuc3RvcmVbdGhpcy5fY29tcG9uZW50VW5pcXVlSWQoKV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBfY29tcG9uZW50VW5pcXVlSWQoKSB7XG4gICAgICAgICAgICAvLyBUT0RPOiBpbnZlc3RpZ2F0ZSBob3cgdG8gY29uc2lzdGVudGx5IGdlbmVyYXRlIHRoaXNcbiAgICAgICAgICAgIHJldHVybiAnZm9vJztcbiAgICAgICAgfVxuXG4gICAgICAgIF9oYW5kbGVPbkRhdGFVcGRhdGUoZGF0YSkge1xuY29uc29sZS5sb2coJ19oYW5kbGVPbkRhdGFVcGRhdGUnLCBkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuX3NhZmVTZXRTdGF0ZSh7IGRhdGEgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBfaGFuZGxlT25TdGF0ZVVwZGF0ZShzdGF0ZSwgbmV4dFN0YXRlKSB7XG4gICAgICAgICAgICB0aGlzLl9zYWZlU2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIG9yaWdpbmFsQ29tcG9uZW50U3RhdGU6IHsgc3RhdGUsIG5leHRTdGF0ZSB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBXcmFwcGVyQ29tcG9uZW50LmRpc3BsYXlOYW1lID0gYFJlZGF0YSgke2dldERpc3BsYXlOYW1lKE9yaWdpbmFsQ29tcG9uZW50KX0pYDtcblxuICAgIC8vIEV4dGVuZCB0aGUgT3JpZ2luYWxDb21wb25lbnQsIHNvIHdlIGdldCBhY2Nlc3MgdG8gbGlmZWN5Y2xlIG1ldGhvZHMgYW5kLCBjb25zZXF1ZW50bHksIHRoZSBzdGF0ZSBjaGFuZ2VzLlxuICAgIGNsYXNzIEV4dGVuZGVkQ29tcG9uZW50IGV4dGVuZHMgT3JpZ2luYWxDb21wb25lbnQge1xuICAgICAgICBjb21wb25lbnRXaWxsVXBkYXRlKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XG4vLyBjb25zb2xlLmxvZygnRXh0ZW5kZWRDb21wb25lbnQ6OmNvbXBvbmVudFdpbGxVcGRhdGUnKTtcbiAgICAgICAgICAgIC8vIElmIE9yaWdpbmFsQ29tcG9uZW50IGhhcyBhIGNvbXBvbmVudFdpbGxVcGRhdGUgbWV0aG9kLCBjYWxsIGl0IGZpcnN0LlxuICAgICAgICAgICAgc3VwZXIuY29tcG9uZW50V2lsbFVwZGF0ZSAmJiBzdXBlci5jb21wb25lbnRXaWxsVXBkYXRlKG5leHRQcm9wcywgbmV4dFN0YXRlKTtcblxuICAgICAgICAgICAgLy8gSWYgc3RhdGUgY2hhbmdlZCwgaW5mb3JtIG9uUmVkYXRhT3JpZ2luYWxDb21wb25lbnRTdGF0ZVVwZGF0ZS5cbiAgICAgICAgICAgICghc2hhbGxvd2VxdWFsKHRoaXMuc3RhdGUsIG5leHRTdGF0ZSkpICYmIHRoaXMucHJvcHMub25SZWRhdGFPcmlnaW5hbENvbXBvbmVudFN0YXRlVXBkYXRlKHRoaXMuc3RhdGUsIG5leHRTdGF0ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBFeHRlbmRlZENvbXBvbmVudC5wcm9wVHlwZXMgPSB7XG4gICAgICAgIC8vIFVzaW5nIGEgaGFyZCB0byBjb2xsaWRlIHByb3AsIHdoaWNoIGlzIHVzZWQgdG8gaG9vayBpbnRvIHN0YXRlIHVwZGF0ZXMgb2YgdGhlIE9yaWdpbmFsQ29tcG9uZW50LlxuICAgICAgICBvblJlZGF0YU9yaWdpbmFsQ29tcG9uZW50U3RhdGVVcGRhdGU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgfTtcblxuICAgIHJldHVybiBXcmFwcGVyQ29tcG9uZW50O1xufVxuXG4vLyBwcml2YXRlIHN0dWZmIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gZ2V0RGlzcGxheU5hbWUoT3JpZ2luYWxDb21wb25lbnQpIHtcbiAgICByZXR1cm4gT3JpZ2luYWxDb21wb25lbnQuZGlzcGxheU5hbWUgfHwgT3JpZ2luYWxDb21wb25lbnQubmFtZSB8fCAnQ29tcG9uZW50Jztcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmV4cG9ydCBkZWZhdWx0IHJlZGF0YUNvbXBvbmVudDtcbiJdfQ==
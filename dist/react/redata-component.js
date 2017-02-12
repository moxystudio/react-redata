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

            _this._handleOnRedataUpdate = _this._handleOnRedataUpdate.bind(_this);
            _this._handleOnOriginalComponentStateUpdate = _this._handleOnOriginalComponentStateUpdate.bind(_this);

            // If it's in the browser, check if there is data coming from server side rendering.
            var serverData = _this._loadFromServerRender();

            // Finalise configuration of our redata.
            redata = boundRedata(serverData);

            // If nothing came from server, redata.
            serverData === undefined && redata({
                props: {},
                nextProps: props,
                state: originalComponentState.state,
                nextState: originalComponentState.nextState,
                data: serverData
            }, _this._handleOnRedataUpdate);
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

                redata({ props: this.props, nextProps: nextProps, state: state, nextState: nextState, data: this.state.data }, this._handleOnRedataUpdate);

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
                    onRedataOriginalComponentStateUpdate: this._handleOnOriginalComponentStateUpdate }));
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
            key: '_handleOnRedataUpdate',
            value: function _handleOnRedataUpdate(data) {
                console.log('_handleOnRedataUpdate', data);

                this._safeSetState({ data: data });
            }
        }, {
            key: '_handleOnOriginalComponentStateUpdate',
            value: function _handleOnOriginalComponentStateUpdate(state, nextState) {
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
                console.log('ExtendedComponent::componentWillUpdate. Will redata?', !(0, _shallowequal2.default)(this.state, nextState));

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdC9yZWRhdGEtY29tcG9uZW50LmpzIl0sIm5hbWVzIjpbInJlZGF0YUNvbXBvbmVudCIsImJvdW5kUmVkYXRhIiwiT3JpZ2luYWxDb21wb25lbnQiLCJyZWRhdGEiLCJXcmFwcGVyQ29tcG9uZW50IiwicHJvcHMiLCJvcmlnaW5hbENvbXBvbmVudFN0YXRlIiwic3RhdGUiLCJ1bmRlZmluZWQiLCJuZXh0U3RhdGUiLCJkYXRhIiwiX2hhbmRsZU9uUmVkYXRhVXBkYXRlIiwiYmluZCIsIl9oYW5kbGVPbk9yaWdpbmFsQ29tcG9uZW50U3RhdGVVcGRhdGUiLCJzZXJ2ZXJEYXRhIiwiX2xvYWRGcm9tU2VydmVyUmVuZGVyIiwibmV4dFByb3BzIiwiX2lzTW91bnRlZCIsIl9zYWZlU2V0U3RhdGUiLCJzZXRTdGF0ZSIsIndpbmRvdyIsIl9fcmVkYXRhIiwic3RvcmUiLCJfY29tcG9uZW50VW5pcXVlSWQiLCJjb25zb2xlIiwibG9nIiwiZGlzcGxheU5hbWUiLCJnZXREaXNwbGF5TmFtZSIsIkV4dGVuZGVkQ29tcG9uZW50Iiwib25SZWRhdGFPcmlnaW5hbENvbXBvbmVudFN0YXRlVXBkYXRlIiwicHJvcFR5cGVzIiwiZnVuYyIsImlzUmVxdWlyZWQiLCJuYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQTs7QUFFQSxTQUFTQSxlQUFULENBQXlCQyxXQUF6QixFQUFzQ0MsaUJBQXRDLEVBQXlEO0FBQ3JEO0FBQ0EsUUFBSUMsZUFBSjs7QUFGcUQsUUFJL0NDLGdCQUorQztBQUFBOztBQUtqRCxrQ0FBWUMsS0FBWixFQUFtQjtBQUFBOztBQUdmO0FBSGUsNElBQ1RBLEtBRFM7O0FBSWYsZ0JBQU1DLHlCQUF5QjtBQUMzQkMsdUJBQU9DLFNBRG9CO0FBRTNCQywyQkFBV0Q7QUFGZ0IsYUFBL0I7O0FBS0Esa0JBQUtELEtBQUwsR0FBYTtBQUNURyxzQkFBTUYsU0FERztBQUVURjtBQUZT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OztBQUFBO0FBQUE7QUFBQSxnREEyRzdCWixTQTNHNkIsRUEyR2xCUCxTQTNHa0IsRUEyR1A7QUFDdENlLHdCQUFRQyxHQUFSLENBQVksc0RBQVosRUFBb0UsQ0FBQyw0QkFBYSxLQUFLbEIsS0FBbEIsRUFBeUJFLFNBQXpCLENBQXJFOztBQUVBO0FBQ0EsNFJBQXVETyxTQUF2RCxFQUFrRVAsU0FBbEU7O0FBRUE7QUFDQyxpQkFBQyw0QkFBYSxLQUFLRixLQUFsQixFQUF5QkUsU0FBekIsQ0FBRixJQUEwQyxLQUFLSixLQUFMLENBQVd3QixvQ0FBWCxDQUFnRCxLQUFLdEIsS0FBckQsRUFBNERFLFNBQTVELENBQTFDO0FBQ0g7QUFuSGdEOztBQUFBO0FBQUEsTUEwR3JCUCxpQkExR3FCOztBQXNIckQwQixzQkFBa0JFLFNBQWxCLEdBQThCO0FBQzFCO0FBQ0FELDhDQUFzQyxpQkFBVUUsSUFBVixDQUFlQztBQUYzQixLQUE5Qjs7QUFLQSxXQUFPNUIsZ0JBQVA7QUFDSDs7QUFFRDs7QUFFQSxTQUFTdUIsY0FBVCxDQUF3QnpCLGlCQUF4QixFQUEyQztBQUN2QyxXQUFPQSxrQkFBa0J3QixXQUFsQixJQUFpQ3hCLGtCQUFrQitCLElBQW5ELElBQTJELFdBQWxFO0FBQ0g7O0FBRUQ7O2tCQUVlakMsZSIsImZpbGUiOiJyZWRhdGEtY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IFB1cmVDb21wb25lbnQsIFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzaGFsbG93ZXF1YWwgZnJvbSAnc2hhbGxvd2VxdWFsJztcblxuLy8gcHVibGljIHN0dWZmIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIHJlZGF0YUNvbXBvbmVudChib3VuZFJlZGF0YSwgT3JpZ2luYWxDb21wb25lbnQpIHtcbiAgICAvLyBXaWxsIGhvbGQgcmVkYXRhIHRoYXQgaXMgc2hhcmVkIGJ5IFdyYXBwZXIgYW5kIEV4dGVuZGVkIGNvbXBvbmVudHMuXG4gICAgbGV0IHJlZGF0YTtcblxuICAgIGNsYXNzIFdyYXBwZXJDb21wb25lbnQgZXh0ZW5kcyBQdXJlQ29tcG9uZW50IHtcbiAgICAgICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgICAgIHN1cGVyKHByb3BzKTtcblxuICAgICAgICAgICAgLy8gSW5pdGlhbGlzZSBzdGF0ZSB3aXRoIHVuZGVmaW5lZCBkYXRhIGFuZCBXcmFwcGVkQ29tcG9uZW50IHN0YXRlLlxuICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxDb21wb25lbnRTdGF0ZSA9IHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5leHRTdGF0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxDb21wb25lbnRTdGF0ZSxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZU9uUmVkYXRhVXBkYXRlID0gdGhpcy5faGFuZGxlT25SZWRhdGFVcGRhdGUuYmluZCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZU9uT3JpZ2luYWxDb21wb25lbnRTdGF0ZVVwZGF0ZSA9IHRoaXMuX2hhbmRsZU9uT3JpZ2luYWxDb21wb25lbnRTdGF0ZVVwZGF0ZS5iaW5kKHRoaXMpO1xuXG4gICAgICAgICAgICAvLyBJZiBpdCdzIGluIHRoZSBicm93c2VyLCBjaGVjayBpZiB0aGVyZSBpcyBkYXRhIGNvbWluZyBmcm9tIHNlcnZlciBzaWRlIHJlbmRlcmluZy5cbiAgICAgICAgICAgIGNvbnN0IHNlcnZlckRhdGEgPSB0aGlzLl9sb2FkRnJvbVNlcnZlclJlbmRlcigpO1xuXG4gICAgICAgICAgICAvLyBGaW5hbGlzZSBjb25maWd1cmF0aW9uIG9mIG91ciByZWRhdGEuXG4gICAgICAgICAgICByZWRhdGEgPSBib3VuZFJlZGF0YShzZXJ2ZXJEYXRhKTtcblxuICAgICAgICAgICAgLy8gSWYgbm90aGluZyBjYW1lIGZyb20gc2VydmVyLCByZWRhdGEuXG4gICAgICAgICAgICBzZXJ2ZXJEYXRhID09PSB1bmRlZmluZWQgJiYgcmVkYXRhKHtcbiAgICAgICAgICAgICAgICBwcm9wczoge30sXG4gICAgICAgICAgICAgICAgbmV4dFByb3BzOiBwcm9wcyxcbiAgICAgICAgICAgICAgICBzdGF0ZTogb3JpZ2luYWxDb21wb25lbnRTdGF0ZS5zdGF0ZSxcbiAgICAgICAgICAgICAgICBuZXh0U3RhdGU6IG9yaWdpbmFsQ29tcG9uZW50U3RhdGUubmV4dFN0YXRlLFxuICAgICAgICAgICAgICAgIGRhdGE6IHNlcnZlckRhdGEsXG4gICAgICAgICAgICB9LCB0aGlzLl9oYW5kbGVPblJlZGF0YVVwZGF0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgICAgIHRoaXMuX2lzTW91bnRlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb21wb25lbnRXaWxsVXBkYXRlKG5leHRQcm9wcykge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ1dyYXBwZXJDb21wb25lbnQ6OmNvbXBvbmVudFdpbGxVcGRhdGUnKTtcbiAgICAgICAgICAgIGNvbnN0IHsgc3RhdGUsIG5leHRTdGF0ZSB9ID0gdGhpcy5zdGF0ZS5vcmlnaW5hbENvbXBvbmVudFN0YXRlO1xuXG4gICAgICAgICAgICAvLyBGbG93IHBhcmFtcyBpbnRvIHJlZGF0YS5cbiAgICAgICAgICAgIHJlZGF0YSh7IHByb3BzOiB0aGlzLnByb3BzLCBuZXh0UHJvcHMsIHN0YXRlLCBuZXh0U3RhdGUsIGRhdGE6IHRoaXMuc3RhdGUuZGF0YSB9LCB0aGlzLl9oYW5kbGVPblJlZGF0YVVwZGF0ZSk7XG5cbiAgICAgICAgICAgIC8vIElmIE9yaWdpbmFsQ29tcG9uZW50IHN0YXRlIGlzIGNoYW5naW5nLCBzdG9yZSBuZXh0U3RhdGUgaW4gc3RhdGUuXG4gICAgICAgICAgICBzdGF0ZSAhPT0gbmV4dFN0YXRlICYmIHRoaXMuX3NhZmVTZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxDb21wb25lbnRTdGF0ZToge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZTogbmV4dFN0YXRlLFxuICAgICAgICAgICAgICAgICAgICBuZXh0U3RhdGUsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgICAgLy8gUmVuZGVyIGV4dGVuZGVkIHBhc3NpbmcgdGhlIHJlY2VpdmVkIHByb3BzIGFuZCB0aGUgc3ByZWFkZWQgZGF0YS5cbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPEV4dGVuZGVkQ29tcG9uZW50XG4gICAgICAgICAgICAgICAgICAgIHsgLi4udGhpcy5wcm9wcyB9XG4gICAgICAgICAgICAgICAgICAgIHsgLi4udGhpcy5zdGF0ZS5kYXRhIH1cbiAgICAgICAgICAgICAgICAgICAgb25SZWRhdGFPcmlnaW5hbENvbXBvbmVudFN0YXRlVXBkYXRlPXsgdGhpcy5faGFuZGxlT25PcmlnaW5hbENvbXBvbmVudFN0YXRlVXBkYXRlIH0gLz5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBfc2FmZVNldFN0YXRlKHN0YXRlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5faXNNb3VudGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShzdGF0ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB7IC4uLnRoaXMuc3RhdGUsIC4uLnN0YXRlIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBfbG9hZEZyb21TZXJ2ZXJSZW5kZXIoKSB7XG4gICAgICAgICAgICAvLyBJZiBkYXRhIHdhcyBhbHJlYWR5IGF2YWlsYWJsZSBmcm9tIHNlcnZlci5cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuX19yZWRhdGEgJiYgd2luZG93Ll9fcmVkYXRhLnN0b3JlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5fX3JlZGF0YS5zdG9yZVt0aGlzLl9jb21wb25lbnRVbmlxdWVJZCgpXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIF9jb21wb25lbnRVbmlxdWVJZCgpIHtcbiAgICAgICAgICAgIC8vIFRPRE86IGludmVzdGlnYXRlIGhvdyB0byBjb25zaXN0ZW50bHkgZ2VuZXJhdGUgdGhpc1xuICAgICAgICAgICAgcmV0dXJuICdmb28nO1xuICAgICAgICB9XG5cbiAgICAgICAgX2hhbmRsZU9uUmVkYXRhVXBkYXRlKGRhdGEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdfaGFuZGxlT25SZWRhdGFVcGRhdGUnLCBkYXRhKTtcblxuICAgICAgICAgICAgdGhpcy5fc2FmZVNldFN0YXRlKHsgZGF0YSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9oYW5kbGVPbk9yaWdpbmFsQ29tcG9uZW50U3RhdGVVcGRhdGUoc3RhdGUsIG5leHRTdGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5fc2FmZVNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICBvcmlnaW5hbENvbXBvbmVudFN0YXRlOiB7IHN0YXRlLCBuZXh0U3RhdGUgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgV3JhcHBlckNvbXBvbmVudC5kaXNwbGF5TmFtZSA9IGBSZWRhdGEoJHtnZXREaXNwbGF5TmFtZShPcmlnaW5hbENvbXBvbmVudCl9KWA7XG5cbiAgICAvLyBFeHRlbmQgdGhlIE9yaWdpbmFsQ29tcG9uZW50LCBzbyB3ZSBnZXQgYWNjZXNzIHRvIGxpZmVjeWNsZSBtZXRob2RzIGFuZCwgY29uc2VxdWVudGx5LCB0aGUgc3RhdGUgY2hhbmdlcy5cbiAgICBjbGFzcyBFeHRlbmRlZENvbXBvbmVudCBleHRlbmRzIE9yaWdpbmFsQ29tcG9uZW50IHtcbiAgICAgICAgY29tcG9uZW50V2lsbFVwZGF0ZShuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0V4dGVuZGVkQ29tcG9uZW50Ojpjb21wb25lbnRXaWxsVXBkYXRlLiBXaWxsIHJlZGF0YT8nLCAhc2hhbGxvd2VxdWFsKHRoaXMuc3RhdGUsIG5leHRTdGF0ZSkpO1xuXG4gICAgICAgICAgICAvLyBJZiBPcmlnaW5hbENvbXBvbmVudCBoYXMgYSBjb21wb25lbnRXaWxsVXBkYXRlIG1ldGhvZCwgY2FsbCBpdCBmaXJzdC5cbiAgICAgICAgICAgIHN1cGVyLmNvbXBvbmVudFdpbGxVcGRhdGUgJiYgc3VwZXIuY29tcG9uZW50V2lsbFVwZGF0ZShuZXh0UHJvcHMsIG5leHRTdGF0ZSk7XG5cbiAgICAgICAgICAgIC8vIElmIHN0YXRlIGNoYW5nZWQsIGluZm9ybSBvblJlZGF0YU9yaWdpbmFsQ29tcG9uZW50U3RhdGVVcGRhdGUuXG4gICAgICAgICAgICAoIXNoYWxsb3dlcXVhbCh0aGlzLnN0YXRlLCBuZXh0U3RhdGUpKSAmJiB0aGlzLnByb3BzLm9uUmVkYXRhT3JpZ2luYWxDb21wb25lbnRTdGF0ZVVwZGF0ZSh0aGlzLnN0YXRlLCBuZXh0U3RhdGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgRXh0ZW5kZWRDb21wb25lbnQucHJvcFR5cGVzID0ge1xuICAgICAgICAvLyBVc2luZyBhIGhhcmQgdG8gY29sbGlkZSBwcm9wLCB3aGljaCBpcyB1c2VkIHRvIGhvb2sgaW50byBzdGF0ZSB1cGRhdGVzIG9mIHRoZSBPcmlnaW5hbENvbXBvbmVudC5cbiAgICAgICAgb25SZWRhdGFPcmlnaW5hbENvbXBvbmVudFN0YXRlVXBkYXRlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIH07XG5cbiAgICByZXR1cm4gV3JhcHBlckNvbXBvbmVudDtcbn1cblxuLy8gcHJpdmF0ZSBzdHVmZiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIGdldERpc3BsYXlOYW1lKE9yaWdpbmFsQ29tcG9uZW50KSB7XG4gICAgcmV0dXJuIE9yaWdpbmFsQ29tcG9uZW50LmRpc3BsYXlOYW1lIHx8IE9yaWdpbmFsQ29tcG9uZW50Lm5hbWUgfHwgJ0NvbXBvbmVudCc7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnQgZGVmYXVsdCByZWRhdGFDb21wb25lbnQ7XG4iXX0=
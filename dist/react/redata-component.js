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

            // Finalise configuration of our redata, and provide it publicly, so that it can be called directly in Server Side Rendering.
            _this.redata = boundRedata(serverData);

            // If nothing came from server, redata.
            serverData === undefined && _this.redata({
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

                this.redata({ props: this.props, nextProps: nextProps, state: state, nextState: nextState, data: this.state.data }, this._handleOnRedataUpdate);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdC9yZWRhdGEtY29tcG9uZW50LmpzIl0sIm5hbWVzIjpbInJlZGF0YUNvbXBvbmVudCIsImJvdW5kUmVkYXRhIiwiT3JpZ2luYWxDb21wb25lbnQiLCJXcmFwcGVyQ29tcG9uZW50IiwicHJvcHMiLCJvcmlnaW5hbENvbXBvbmVudFN0YXRlIiwic3RhdGUiLCJ1bmRlZmluZWQiLCJuZXh0U3RhdGUiLCJkYXRhIiwiX2hhbmRsZU9uUmVkYXRhVXBkYXRlIiwiYmluZCIsIl9oYW5kbGVPbk9yaWdpbmFsQ29tcG9uZW50U3RhdGVVcGRhdGUiLCJzZXJ2ZXJEYXRhIiwiX2xvYWRGcm9tU2VydmVyUmVuZGVyIiwicmVkYXRhIiwibmV4dFByb3BzIiwiX2lzTW91bnRlZCIsIl9zYWZlU2V0U3RhdGUiLCJzZXRTdGF0ZSIsIndpbmRvdyIsIl9fcmVkYXRhIiwic3RvcmUiLCJfY29tcG9uZW50VW5pcXVlSWQiLCJjb25zb2xlIiwibG9nIiwiZGlzcGxheU5hbWUiLCJnZXREaXNwbGF5TmFtZSIsIkV4dGVuZGVkQ29tcG9uZW50Iiwib25SZWRhdGFPcmlnaW5hbENvbXBvbmVudFN0YXRlVXBkYXRlIiwicHJvcFR5cGVzIiwiZnVuYyIsImlzUmVxdWlyZWQiLCJuYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQTs7QUFFQSxTQUFTQSxlQUFULENBQXlCQyxXQUF6QixFQUFzQ0MsaUJBQXRDLEVBQXlEO0FBQUEsUUFDL0NDLGdCQUQrQztBQUFBOztBQUVqRCxrQ0FBWUMsS0FBWixFQUFtQjtBQUFBOztBQUdmO0FBSGUsNElBQ1RBLEtBRFM7O0FBSWYsZ0JBQU1DLHlCQUF5QjtBQUMzQkMsdUJBQU9DLFNBRG9CO0FBRTNCQywyQkFBV0Q7QUFGZ0IsYUFBL0I7O0FBS0Esa0JBQUtELEtBQUwsR0FBYTtBQUNURyxzQkFBTUYsU0FERztBQUVURjtBQUZTLGFBQWI7O0FBS0Esa0JBQUtLLHFCQUFM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QUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLGdEQXdHN0JaLFNBeEc2QixFQXdHbEJSLFNBeEdrQixFQXdHUDtBQUN0Q2dCLHdCQUFRQyxHQUFSLENBQVksc0RBQVosRUFBb0UsQ0FBQyw0QkFBYSxLQUFLbkIsS0FBbEIsRUFBeUJFLFNBQXpCLENBQXJFOztBQUVBO0FBQ0EsNFJBQXVEUSxTQUF2RCxFQUFrRVIsU0FBbEU7O0FBRUE7QUFDQyxpQkFBQyw0QkFBYSxLQUFLRixLQUFsQixFQUF5QkUsU0FBekIsQ0FBRixJQUEwQyxLQUFLSixLQUFMLENBQVd5QixvQ0FBWCxDQUFnRCxLQUFLdkIsS0FBckQsRUFBNERFLFNBQTVELENBQTFDO0FBQ0g7QUFoSGdEOztBQUFBO0FBQUEsTUF1R3JCTixpQkF2R3FCOztBQW1IckQwQixzQkFBa0JFLFNBQWxCLEdBQThCO0FBQzFCO0FBQ0FELDhDQUFzQyxpQkFBVUUsSUFBVixDQUFlQztBQUYzQixLQUE5Qjs7QUFLQSxXQUFPN0IsZ0JBQVA7QUFDSDs7QUFFRDs7QUFFQSxTQUFTd0IsY0FBVCxDQUF3QnpCLGlCQUF4QixFQUEyQztBQUN2QyxXQUFPQSxrQkFBa0J3QixXQUFsQixJQUFpQ3hCLGtCQUFrQitCLElBQW5ELElBQTJELFdBQWxFO0FBQ0g7O0FBRUQ7O2tCQUVlakMsZSIsImZpbGUiOiJyZWRhdGEtY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IFB1cmVDb21wb25lbnQsIFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBzaGFsbG93ZXF1YWwgZnJvbSAnc2hhbGxvd2VxdWFsJztcblxuLy8gcHVibGljIHN0dWZmIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIHJlZGF0YUNvbXBvbmVudChib3VuZFJlZGF0YSwgT3JpZ2luYWxDb21wb25lbnQpIHtcbiAgICBjbGFzcyBXcmFwcGVyQ29tcG9uZW50IGV4dGVuZHMgUHVyZUNvbXBvbmVudCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgICAgICBzdXBlcihwcm9wcyk7XG5cbiAgICAgICAgICAgIC8vIEluaXRpYWxpc2Ugc3RhdGUgd2l0aCB1bmRlZmluZWQgZGF0YSBhbmQgV3JhcHBlZENvbXBvbmVudCBzdGF0ZS5cbiAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsQ29tcG9uZW50U3RhdGUgPSB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBuZXh0U3RhdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICAgICAgZGF0YTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsQ29tcG9uZW50U3RhdGUsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVPblJlZGF0YVVwZGF0ZSA9IHRoaXMuX2hhbmRsZU9uUmVkYXRhVXBkYXRlLmJpbmQodGhpcyk7XG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVPbk9yaWdpbmFsQ29tcG9uZW50U3RhdGVVcGRhdGUgPSB0aGlzLl9oYW5kbGVPbk9yaWdpbmFsQ29tcG9uZW50U3RhdGVVcGRhdGUuYmluZCh0aGlzKTtcblxuICAgICAgICAgICAgLy8gSWYgaXQncyBpbiB0aGUgYnJvd3NlciwgY2hlY2sgaWYgdGhlcmUgaXMgZGF0YSBjb21pbmcgZnJvbSBzZXJ2ZXIgc2lkZSByZW5kZXJpbmcuXG4gICAgICAgICAgICBjb25zdCBzZXJ2ZXJEYXRhID0gdGhpcy5fbG9hZEZyb21TZXJ2ZXJSZW5kZXIoKTtcblxuICAgICAgICAgICAgLy8gRmluYWxpc2UgY29uZmlndXJhdGlvbiBvZiBvdXIgcmVkYXRhLCBhbmQgcHJvdmlkZSBpdCBwdWJsaWNseSwgc28gdGhhdCBpdCBjYW4gYmUgY2FsbGVkIGRpcmVjdGx5IGluIFNlcnZlciBTaWRlIFJlbmRlcmluZy5cbiAgICAgICAgICAgIHRoaXMucmVkYXRhID0gYm91bmRSZWRhdGEoc2VydmVyRGF0YSk7XG5cbiAgICAgICAgICAgIC8vIElmIG5vdGhpbmcgY2FtZSBmcm9tIHNlcnZlciwgcmVkYXRhLlxuICAgICAgICAgICAgc2VydmVyRGF0YSA9PT0gdW5kZWZpbmVkICYmIHRoaXMucmVkYXRhKHtcbiAgICAgICAgICAgICAgICBwcm9wczoge30sXG4gICAgICAgICAgICAgICAgbmV4dFByb3BzOiBwcm9wcyxcbiAgICAgICAgICAgICAgICBzdGF0ZTogb3JpZ2luYWxDb21wb25lbnRTdGF0ZS5zdGF0ZSxcbiAgICAgICAgICAgICAgICBuZXh0U3RhdGU6IG9yaWdpbmFsQ29tcG9uZW50U3RhdGUubmV4dFN0YXRlLFxuICAgICAgICAgICAgICAgIGRhdGE6IHNlcnZlckRhdGEsXG4gICAgICAgICAgICB9LCB0aGlzLl9oYW5kbGVPblJlZGF0YVVwZGF0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgICAgIHRoaXMuX2lzTW91bnRlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb21wb25lbnRXaWxsVXBkYXRlKG5leHRQcm9wcykge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ1dyYXBwZXJDb21wb25lbnQ6OmNvbXBvbmVudFdpbGxVcGRhdGUnKTtcbiAgICAgICAgICAgIGNvbnN0IHsgc3RhdGUsIG5leHRTdGF0ZSB9ID0gdGhpcy5zdGF0ZS5vcmlnaW5hbENvbXBvbmVudFN0YXRlO1xuXG4gICAgICAgICAgICAvLyBGbG93IHBhcmFtcyBpbnRvIHJlZGF0YS5cbiAgICAgICAgICAgIHRoaXMucmVkYXRhKHsgcHJvcHM6IHRoaXMucHJvcHMsIG5leHRQcm9wcywgc3RhdGUsIG5leHRTdGF0ZSwgZGF0YTogdGhpcy5zdGF0ZS5kYXRhIH0sIHRoaXMuX2hhbmRsZU9uUmVkYXRhVXBkYXRlKTtcblxuICAgICAgICAgICAgLy8gSWYgT3JpZ2luYWxDb21wb25lbnQgc3RhdGUgaXMgY2hhbmdpbmcsIHN0b3JlIG5leHRTdGF0ZSBpbiBzdGF0ZS5cbiAgICAgICAgICAgIHN0YXRlICE9PSBuZXh0U3RhdGUgJiYgdGhpcy5fc2FmZVNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICBvcmlnaW5hbENvbXBvbmVudFN0YXRlOiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlOiBuZXh0U3RhdGUsXG4gICAgICAgICAgICAgICAgICAgIG5leHRTdGF0ZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZW5kZXIoKSB7XG4gICAgICAgICAgICAvLyBSZW5kZXIgZXh0ZW5kZWQgcGFzc2luZyB0aGUgcmVjZWl2ZWQgcHJvcHMgYW5kIHRoZSBzcHJlYWRlZCBkYXRhLlxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8RXh0ZW5kZWRDb21wb25lbnRcbiAgICAgICAgICAgICAgICAgICAgeyAuLi50aGlzLnByb3BzIH1cbiAgICAgICAgICAgICAgICAgICAgeyAuLi50aGlzLnN0YXRlLmRhdGEgfVxuICAgICAgICAgICAgICAgICAgICBvblJlZGF0YU9yaWdpbmFsQ29tcG9uZW50U3RhdGVVcGRhdGU9eyB0aGlzLl9oYW5kbGVPbk9yaWdpbmFsQ29tcG9uZW50U3RhdGVVcGRhdGUgfSAvPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9zYWZlU2V0U3RhdGUoc3RhdGUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9pc01vdW50ZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHN0YXRlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHsgLi4udGhpcy5zdGF0ZSwgLi4uc3RhdGUgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIF9sb2FkRnJvbVNlcnZlclJlbmRlcigpIHtcbiAgICAgICAgICAgIC8vIElmIGRhdGEgd2FzIGFscmVhZHkgYXZhaWxhYmxlIGZyb20gc2VydmVyLlxuICAgICAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5fX3JlZGF0YSAmJiB3aW5kb3cuX19yZWRhdGEuc3RvcmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93Ll9fcmVkYXRhLnN0b3JlW3RoaXMuX2NvbXBvbmVudFVuaXF1ZUlkKCldO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgX2NvbXBvbmVudFVuaXF1ZUlkKCkge1xuICAgICAgICAgICAgLy8gVE9ETzogaW52ZXN0aWdhdGUgaG93IHRvIGNvbnNpc3RlbnRseSBnZW5lcmF0ZSB0aGlzXG4gICAgICAgICAgICByZXR1cm4gJ2Zvbyc7XG4gICAgICAgIH1cblxuICAgICAgICBfaGFuZGxlT25SZWRhdGFVcGRhdGUoZGF0YSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ19oYW5kbGVPblJlZGF0YVVwZGF0ZScsIGRhdGEpO1xuXG4gICAgICAgICAgICB0aGlzLl9zYWZlU2V0U3RhdGUoeyBkYXRhIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgX2hhbmRsZU9uT3JpZ2luYWxDb21wb25lbnRTdGF0ZVVwZGF0ZShzdGF0ZSwgbmV4dFN0YXRlKSB7XG4gICAgICAgICAgICB0aGlzLl9zYWZlU2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIG9yaWdpbmFsQ29tcG9uZW50U3RhdGU6IHsgc3RhdGUsIG5leHRTdGF0ZSB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBXcmFwcGVyQ29tcG9uZW50LmRpc3BsYXlOYW1lID0gYFJlZGF0YSgke2dldERpc3BsYXlOYW1lKE9yaWdpbmFsQ29tcG9uZW50KX0pYDtcblxuICAgIC8vIEV4dGVuZCB0aGUgT3JpZ2luYWxDb21wb25lbnQsIHNvIHdlIGdldCBhY2Nlc3MgdG8gbGlmZWN5Y2xlIG1ldGhvZHMgYW5kLCBjb25zZXF1ZW50bHksIHRoZSBzdGF0ZSBjaGFuZ2VzLlxuICAgIGNsYXNzIEV4dGVuZGVkQ29tcG9uZW50IGV4dGVuZHMgT3JpZ2luYWxDb21wb25lbnQge1xuICAgICAgICBjb21wb25lbnRXaWxsVXBkYXRlKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRXh0ZW5kZWRDb21wb25lbnQ6OmNvbXBvbmVudFdpbGxVcGRhdGUuIFdpbGwgcmVkYXRhPycsICFzaGFsbG93ZXF1YWwodGhpcy5zdGF0ZSwgbmV4dFN0YXRlKSk7XG5cbiAgICAgICAgICAgIC8vIElmIE9yaWdpbmFsQ29tcG9uZW50IGhhcyBhIGNvbXBvbmVudFdpbGxVcGRhdGUgbWV0aG9kLCBjYWxsIGl0IGZpcnN0LlxuICAgICAgICAgICAgc3VwZXIuY29tcG9uZW50V2lsbFVwZGF0ZSAmJiBzdXBlci5jb21wb25lbnRXaWxsVXBkYXRlKG5leHRQcm9wcywgbmV4dFN0YXRlKTtcblxuICAgICAgICAgICAgLy8gSWYgc3RhdGUgY2hhbmdlZCwgaW5mb3JtIG9uUmVkYXRhT3JpZ2luYWxDb21wb25lbnRTdGF0ZVVwZGF0ZS5cbiAgICAgICAgICAgICghc2hhbGxvd2VxdWFsKHRoaXMuc3RhdGUsIG5leHRTdGF0ZSkpICYmIHRoaXMucHJvcHMub25SZWRhdGFPcmlnaW5hbENvbXBvbmVudFN0YXRlVXBkYXRlKHRoaXMuc3RhdGUsIG5leHRTdGF0ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBFeHRlbmRlZENvbXBvbmVudC5wcm9wVHlwZXMgPSB7XG4gICAgICAgIC8vIFVzaW5nIGEgaGFyZCB0byBjb2xsaWRlIHByb3AsIHdoaWNoIGlzIHVzZWQgdG8gaG9vayBpbnRvIHN0YXRlIHVwZGF0ZXMgb2YgdGhlIE9yaWdpbmFsQ29tcG9uZW50LlxuICAgICAgICBvblJlZGF0YU9yaWdpbmFsQ29tcG9uZW50U3RhdGVVcGRhdGU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgfTtcblxuICAgIHJldHVybiBXcmFwcGVyQ29tcG9uZW50O1xufVxuXG4vLyBwcml2YXRlIHN0dWZmIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gZ2V0RGlzcGxheU5hbWUoT3JpZ2luYWxDb21wb25lbnQpIHtcbiAgICByZXR1cm4gT3JpZ2luYWxDb21wb25lbnQuZGlzcGxheU5hbWUgfHwgT3JpZ2luYWxDb21wb25lbnQubmFtZSB8fCAnQ29tcG9uZW50Jztcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmV4cG9ydCBkZWZhdWx0IHJlZGF0YUNvbXBvbmVudDtcbiJdfQ==
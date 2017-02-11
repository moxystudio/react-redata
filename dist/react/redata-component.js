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

            // If nothing come from server, redata.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdC9yZWRhdGEtY29tcG9uZW50LmpzIl0sIm5hbWVzIjpbInJlZGF0YUNvbXBvbmVudCIsImJvdW5kUmVkYXRhIiwiT3JpZ2luYWxDb21wb25lbnQiLCJyZWRhdGEiLCJXcmFwcGVyQ29tcG9uZW50IiwicHJvcHMiLCJvcmlnaW5hbENvbXBvbmVudFN0YXRlIiwic3RhdGUiLCJ1bmRlZmluZWQiLCJuZXh0U3RhdGUiLCJkYXRhIiwiX2hhbmRsZU9uUmVkYXRhVXBkYXRlIiwiYmluZCIsIl9oYW5kbGVPbk9yaWdpbmFsQ29tcG9uZW50U3RhdGVVcGRhdGUiLCJzZXJ2ZXJEYXRhIiwiX2xvYWRGcm9tU2VydmVyUmVuZGVyIiwibmV4dFByb3BzIiwiX2lzTW91bnRlZCIsIl9zYWZlU2V0U3RhdGUiLCJzZXRTdGF0ZSIsIndpbmRvdyIsIl9fcmVkYXRhIiwic3RvcmUiLCJfY29tcG9uZW50VW5pcXVlSWQiLCJjb25zb2xlIiwibG9nIiwiZGlzcGxheU5hbWUiLCJnZXREaXNwbGF5TmFtZSIsIkV4dGVuZGVkQ29tcG9uZW50Iiwib25SZWRhdGFPcmlnaW5hbENvbXBvbmVudFN0YXRlVXBkYXRlIiwicHJvcFR5cGVzIiwiZnVuYyIsImlzUmVxdWlyZWQiLCJuYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQTs7QUFFQSxTQUFTQSxlQUFULENBQXlCQyxXQUF6QixFQUFzQ0MsaUJBQXRDLEVBQXlEO0FBQ3JEO0FBQ0EsUUFBSUMsZUFBSjs7QUFGcUQsUUFJL0NDLGdCQUorQztBQUFBOztBQUtqRCxrQ0FBWUMsS0FBWixFQUFtQjtBQUFBOztBQUdmO0FBSGUsNElBQ1RBLEtBRFM7O0FBSWYsZ0JBQU1DLHlCQUF5QjtBQUMzQkMsdUJBQU9DLFNBRG9CO0FBRTNCQywyQkFBV0Q7QUFGZ0IsYUFBL0I7O0FBS0Esa0JBQUtELEtBQUwsR0FBYTtBQUNURyxzQkFBTUYsU0FERztBQUVURjtBQUZT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O0FBQUE7QUFBQTtBQUFBLGdEQTBHN0JaLFNBMUc2QixFQTBHbEJQLFNBMUdrQixFQTBHUDtBQUNsRGUsd0JBQVFDLEdBQVIsQ0FBWSxzREFBWixFQUFvRSxDQUFDLDRCQUFhLEtBQUtsQixLQUFsQixFQUF5QkUsU0FBekIsQ0FBckU7QUFDWTtBQUNBLDRSQUF1RE8sU0FBdkQsRUFBa0VQLFNBQWxFOztBQUVBO0FBQ0MsaUJBQUMsNEJBQWEsS0FBS0YsS0FBbEIsRUFBeUJFLFNBQXpCLENBQUYsSUFBMEMsS0FBS0osS0FBTCxDQUFXd0Isb0NBQVgsQ0FBZ0QsS0FBS3RCLEtBQXJELEVBQTRERSxTQUE1RCxDQUExQztBQUNIO0FBakhnRDs7QUFBQTtBQUFBLE1BeUdyQlAsaUJBekdxQjs7QUFvSHJEMEIsc0JBQWtCRSxTQUFsQixHQUE4QjtBQUMxQjtBQUNBRCw4Q0FBc0MsaUJBQVVFLElBQVYsQ0FBZUM7QUFGM0IsS0FBOUI7O0FBS0EsV0FBTzVCLGdCQUFQO0FBQ0g7O0FBRUQ7O0FBRUEsU0FBU3VCLGNBQVQsQ0FBd0J6QixpQkFBeEIsRUFBMkM7QUFDdkMsV0FBT0Esa0JBQWtCd0IsV0FBbEIsSUFBaUN4QixrQkFBa0IrQixJQUFuRCxJQUEyRCxXQUFsRTtBQUNIOztBQUVEOztrQkFFZWpDLGUiLCJmaWxlIjoicmVkYXRhLWNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBQdXJlQ29tcG9uZW50LCBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc2hhbGxvd2VxdWFsIGZyb20gJ3NoYWxsb3dlcXVhbCc7XG5cbi8vIHB1YmxpYyBzdHVmZiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiByZWRhdGFDb21wb25lbnQoYm91bmRSZWRhdGEsIE9yaWdpbmFsQ29tcG9uZW50KSB7XG4gICAgLy8gV2lsbCBob2xkIHJlZGF0YSB0aGF0IGlzIHNoYXJlZCBieSBXcmFwcGVyIGFuZCBFeHRlbmRlZCBjb21wb25lbnRzLlxuICAgIGxldCByZWRhdGE7XG5cbiAgICBjbGFzcyBXcmFwcGVyQ29tcG9uZW50IGV4dGVuZHMgUHVyZUNvbXBvbmVudCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgICAgICBzdXBlcihwcm9wcyk7XG5cbiAgICAgICAgICAgIC8vIEluaXRpYWxpc2Ugc3RhdGUgd2l0aCB1bmRlZmluZWQgZGF0YSBhbmQgV3JhcHBlZENvbXBvbmVudCBzdGF0ZS5cbiAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsQ29tcG9uZW50U3RhdGUgPSB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBuZXh0U3RhdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICAgICAgZGF0YTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsQ29tcG9uZW50U3RhdGUsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVPblJlZGF0YVVwZGF0ZSA9IHRoaXMuX2hhbmRsZU9uUmVkYXRhVXBkYXRlLmJpbmQodGhpcyk7XG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVPbk9yaWdpbmFsQ29tcG9uZW50U3RhdGVVcGRhdGUgPSB0aGlzLl9oYW5kbGVPbk9yaWdpbmFsQ29tcG9uZW50U3RhdGVVcGRhdGUuYmluZCh0aGlzKTtcblxuICAgICAgICAgICAgLy8gSWYgaXQncyBpbiB0aGUgYnJvd3NlciwgY2hlY2sgaWYgdGhlcmUgaXMgZGF0YSBjb21pbmcgZnJvbSBzZXJ2ZXIgc2lkZSByZW5kZXJpbmcuXG4gICAgICAgICAgICBjb25zdCBzZXJ2ZXJEYXRhID0gdGhpcy5fbG9hZEZyb21TZXJ2ZXJSZW5kZXIoKTtcblxuICAgICAgICAgICAgLy8gRmluYWxpc2UgY29uZmlndXJhdGlvbiBvZiBvdXIgcmVkYXRhLlxuICAgICAgICAgICAgcmVkYXRhID0gYm91bmRSZWRhdGEoc2VydmVyRGF0YSk7XG5cbiAgICAgICAgICAgIC8vIElmIG5vdGhpbmcgY29tZSBmcm9tIHNlcnZlciwgcmVkYXRhLlxuICAgICAgICAgICAgc2VydmVyRGF0YSA9PT0gdW5kZWZpbmVkICYmIHJlZGF0YSh7XG4gICAgICAgICAgICAgICAgcHJvcHM6IHt9LFxuICAgICAgICAgICAgICAgIG5leHRQcm9wczogcHJvcHMsXG4gICAgICAgICAgICAgICAgc3RhdGU6IG9yaWdpbmFsQ29tcG9uZW50U3RhdGUuc3RhdGUsXG4gICAgICAgICAgICAgICAgbmV4dFN0YXRlOiBvcmlnaW5hbENvbXBvbmVudFN0YXRlLm5leHRTdGF0ZSxcbiAgICAgICAgICAgICAgICBkYXRhOiBzZXJ2ZXJEYXRhLFxuICAgICAgICAgICAgfSwgdGhpcy5faGFuZGxlT25SZWRhdGFVcGRhdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgICAgICB0aGlzLl9pc01vdW50ZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29tcG9uZW50V2lsbFVwZGF0ZShuZXh0UHJvcHMpIHtcbi8vIGNvbnNvbGUubG9nKCdXcmFwcGVyQ29tcG9uZW50Ojpjb21wb25lbnRXaWxsVXBkYXRlJyk7XG4gICAgICAgICAgICBjb25zdCB7IHN0YXRlLCBuZXh0U3RhdGUgfSA9IHRoaXMuc3RhdGUub3JpZ2luYWxDb21wb25lbnRTdGF0ZTtcblxuICAgICAgICAgICAgLy8gRmxvdyBwYXJhbXMgaW50byByZWRhdGEuXG4gICAgICAgICAgICByZWRhdGEoeyBwcm9wczogdGhpcy5wcm9wcywgbmV4dFByb3BzLCBzdGF0ZSwgbmV4dFN0YXRlLCBkYXRhOiB0aGlzLnN0YXRlLmRhdGEgfSwgdGhpcy5faGFuZGxlT25SZWRhdGFVcGRhdGUpO1xuXG4gICAgICAgICAgICAvLyBJZiBPcmlnaW5hbENvbXBvbmVudCBzdGF0ZSBpcyBjaGFuZ2luZywgc3RvcmUgbmV4dFN0YXRlIGluIHN0YXRlLlxuICAgICAgICAgICAgc3RhdGUgIT09IG5leHRTdGF0ZSAmJiB0aGlzLl9zYWZlU2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIG9yaWdpbmFsQ29tcG9uZW50U3RhdGU6IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGU6IG5leHRTdGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgbmV4dFN0YXRlLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgICAgIC8vIFJlbmRlciBleHRlbmRlZCBwYXNzaW5nIHRoZSByZWNlaXZlZCBwcm9wcyBhbmQgdGhlIHNwcmVhZGVkIGRhdGEuXG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxFeHRlbmRlZENvbXBvbmVudFxuICAgICAgICAgICAgICAgICAgICB7IC4uLnRoaXMucHJvcHMgfVxuICAgICAgICAgICAgICAgICAgICB7IC4uLnRoaXMuc3RhdGUuZGF0YSB9XG4gICAgICAgICAgICAgICAgICAgIG9uUmVkYXRhT3JpZ2luYWxDb21wb25lbnRTdGF0ZVVwZGF0ZT17IHRoaXMuX2hhbmRsZU9uT3JpZ2luYWxDb21wb25lbnRTdGF0ZVVwZGF0ZSB9IC8+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgX3NhZmVTZXRTdGF0ZShzdGF0ZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2lzTW91bnRlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoc3RhdGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0geyAuLi50aGlzLnN0YXRlLCAuLi5zdGF0ZSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgX2xvYWRGcm9tU2VydmVyUmVuZGVyKCkge1xuICAgICAgICAgICAgLy8gSWYgZGF0YSB3YXMgYWxyZWFkeSBhdmFpbGFibGUgZnJvbSBzZXJ2ZXIuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Ll9fcmVkYXRhICYmIHdpbmRvdy5fX3JlZGF0YS5zdG9yZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cuX19yZWRhdGEuc3RvcmVbdGhpcy5fY29tcG9uZW50VW5pcXVlSWQoKV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBfY29tcG9uZW50VW5pcXVlSWQoKSB7XG4gICAgICAgICAgICAvLyBUT0RPOiBpbnZlc3RpZ2F0ZSBob3cgdG8gY29uc2lzdGVudGx5IGdlbmVyYXRlIHRoaXNcbiAgICAgICAgICAgIHJldHVybiAnZm9vJztcbiAgICAgICAgfVxuXG4gICAgICAgIF9oYW5kbGVPblJlZGF0YVVwZGF0ZShkYXRhKSB7XG5jb25zb2xlLmxvZygnX2hhbmRsZU9uUmVkYXRhVXBkYXRlJywgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLl9zYWZlU2V0U3RhdGUoeyBkYXRhIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgX2hhbmRsZU9uT3JpZ2luYWxDb21wb25lbnRTdGF0ZVVwZGF0ZShzdGF0ZSwgbmV4dFN0YXRlKSB7XG4gICAgICAgICAgICB0aGlzLl9zYWZlU2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIG9yaWdpbmFsQ29tcG9uZW50U3RhdGU6IHsgc3RhdGUsIG5leHRTdGF0ZSB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBXcmFwcGVyQ29tcG9uZW50LmRpc3BsYXlOYW1lID0gYFJlZGF0YSgke2dldERpc3BsYXlOYW1lKE9yaWdpbmFsQ29tcG9uZW50KX0pYDtcblxuICAgIC8vIEV4dGVuZCB0aGUgT3JpZ2luYWxDb21wb25lbnQsIHNvIHdlIGdldCBhY2Nlc3MgdG8gbGlmZWN5Y2xlIG1ldGhvZHMgYW5kLCBjb25zZXF1ZW50bHksIHRoZSBzdGF0ZSBjaGFuZ2VzLlxuICAgIGNsYXNzIEV4dGVuZGVkQ29tcG9uZW50IGV4dGVuZHMgT3JpZ2luYWxDb21wb25lbnQge1xuICAgICAgICBjb21wb25lbnRXaWxsVXBkYXRlKG5leHRQcm9wcywgbmV4dFN0YXRlKSB7XG5jb25zb2xlLmxvZygnRXh0ZW5kZWRDb21wb25lbnQ6OmNvbXBvbmVudFdpbGxVcGRhdGUuIFdpbGwgcmVkYXRhPycsICFzaGFsbG93ZXF1YWwodGhpcy5zdGF0ZSwgbmV4dFN0YXRlKSk7XG4gICAgICAgICAgICAvLyBJZiBPcmlnaW5hbENvbXBvbmVudCBoYXMgYSBjb21wb25lbnRXaWxsVXBkYXRlIG1ldGhvZCwgY2FsbCBpdCBmaXJzdC5cbiAgICAgICAgICAgIHN1cGVyLmNvbXBvbmVudFdpbGxVcGRhdGUgJiYgc3VwZXIuY29tcG9uZW50V2lsbFVwZGF0ZShuZXh0UHJvcHMsIG5leHRTdGF0ZSk7XG5cbiAgICAgICAgICAgIC8vIElmIHN0YXRlIGNoYW5nZWQsIGluZm9ybSBvblJlZGF0YU9yaWdpbmFsQ29tcG9uZW50U3RhdGVVcGRhdGUuXG4gICAgICAgICAgICAoIXNoYWxsb3dlcXVhbCh0aGlzLnN0YXRlLCBuZXh0U3RhdGUpKSAmJiB0aGlzLnByb3BzLm9uUmVkYXRhT3JpZ2luYWxDb21wb25lbnRTdGF0ZVVwZGF0ZSh0aGlzLnN0YXRlLCBuZXh0U3RhdGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgRXh0ZW5kZWRDb21wb25lbnQucHJvcFR5cGVzID0ge1xuICAgICAgICAvLyBVc2luZyBhIGhhcmQgdG8gY29sbGlkZSBwcm9wLCB3aGljaCBpcyB1c2VkIHRvIGhvb2sgaW50byBzdGF0ZSB1cGRhdGVzIG9mIHRoZSBPcmlnaW5hbENvbXBvbmVudC5cbiAgICAgICAgb25SZWRhdGFPcmlnaW5hbENvbXBvbmVudFN0YXRlVXBkYXRlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIH07XG5cbiAgICByZXR1cm4gV3JhcHBlckNvbXBvbmVudDtcbn1cblxuLy8gcHJpdmF0ZSBzdHVmZiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIGdldERpc3BsYXlOYW1lKE9yaWdpbmFsQ29tcG9uZW50KSB7XG4gICAgcmV0dXJuIE9yaWdpbmFsQ29tcG9uZW50LmRpc3BsYXlOYW1lIHx8IE9yaWdpbmFsQ29tcG9uZW50Lm5hbWUgfHwgJ0NvbXBvbmVudCc7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnQgZGVmYXVsdCByZWRhdGFDb21wb25lbnQ7XG4iXX0=
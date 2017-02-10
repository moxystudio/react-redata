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

            var _this = _possibleConstructorReturn(this, (WrapperComponent.__proto__ || Object.getPrototypeOf(WrapperComponent)).call(this, props));

            _this.state = {
                data: undefined
            };

            _this._handleOnDataUpdate = _this._handleOnDataUpdate.bind(_this);

            // If it's in the browser, check if there is data coming from server side rendering.
            var serverData = _this._loadFromServerRender();

            // Finalise configuration of our redata.
            redata = boundRedata(serverData);

            // If nothing come from server, redata.
            serverData === undefined && redata({
                props: {},
                nextProps: props,
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
                // Flow params into redata.
                redata({ props: this.props, nextProps: nextProps, data: this.state.data }, this._handleOnDataUpdate);
            }
        }, {
            key: 'render',
            value: function render() {
                // Render original component passing the received props and the spreaded data.
                return _react2.default.createElement(OriginalComponent, _extends({}, this.props, this.state.data));
            }
        }, {
            key: '_safeSetState',
            value: function _safeSetState(nextState) {
                if (this._isMounted) {
                    this.setState(nextState);
                } else {
                    this.state = _extends({}, this.state, nextState);
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
                this._safeSetState({ data: data });
            }
        }, {
            key: '_handleOnStateUpdate',
            value: function _handleOnStateUpdate(state, nextState) {}
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
                _get(ExtendedComponent.prototype.__proto__ || Object.getPrototypeOf(ExtendedComponent.prototype), 'componentWillUpdate', this).call(this, nextProps, nextState);

                // If state changed, inform __redataOnStateUpdate.
                (0, _shallowequal2.default)(this.state, nextState) && this.props.__redataOnStateUpdate(this.state, nextState);
            }
        }]);

        return ExtendedComponent;
    }(OriginalComponent);

    ExtendedComponent.propTypes = {
        __redataOnStateUpdate: _react.PropTypes.func.isRequired
    };

    return WrapperComponent;
}

// private stuff ----------------------------------------------------------------------------------

function getDisplayName(OriginalComponent) {
    return OriginalComponent.displayName || OriginalComponent.name || 'Component';
}

// ------------------------------------------------------------------------------------------------

exports.default = redataComponent;
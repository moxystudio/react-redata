'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// public stuff -----------------------------------------------------------------------------------

function redataComponent(boundRedata, WrappedComponent) {
    var RedataComponent = function (_PureComponent) {
        _inherits(RedataComponent, _PureComponent);

        function RedataComponent(props) {
            _classCallCheck(this, RedataComponent);

            var _this = _possibleConstructorReturn(this, (RedataComponent.__proto__ || Object.getPrototypeOf(RedataComponent)).call(this, props));

            _this.state = {};

            _this._handleOnUpdate = _this._handleOnUpdate.bind(_this);

            // If it's in the browser, check if there is data coming from server side rendering.
            var serverData = _this._loadFromServerRender();

            // Finalise configuration of our redata.
            _this._redata = boundRedata(serverData);
            console.log('will redata in constructor');
            // If nothing come from server, redata.
            serverData === undefined && _this._redata({
                props: {},
                nextProps: props,
                data: serverData
            }, _this._handleOnUpdate);
            console.log('did redata in constructor');
            return _this;
        }

        _createClass(RedataComponent, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                this._isMounted = true;
            }
        }, {
            key: 'componentWillUpdate',
            value: function componentWillUpdate(nextProps) {
                // Flow params into redata.
                this._redata({ props: this.props, nextProps: nextProps, data: this._lastData }, this._handleOnUpdate);
            }
        }, {
            key: 'render',
            value: function render() {
                // Render wrapped component passing the received props and the spreaded data.
                return _react2.default.createElement(WrappedComponent, _extends({}, this.props, this.state));
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
            key: '_handleOnUpdate',
            value: function _handleOnUpdate(data) {
                console.log('_handleOnUpdate', data);
                // TODO: Map the load result using the mapper and store it in the state, which will trigger a render.
                this._lastData = data;

                this._safeSetState(_extends({}, data));
            }
        }]);

        return RedataComponent;
    }(_react.PureComponent);

    RedataComponent.displayName = 'Redata(' + getDisplayName(WrappedComponent) + ')';

    return RedataComponent;
}

// private stuff ----------------------------------------------------------------------------------

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

// ------------------------------------------------------------------------------------------------

exports.default = redataComponent;
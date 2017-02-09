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

function redataComponent(_ref, WrappedComponent) {
    var load = _ref.load,
        shouldReload = _ref.shouldReload,
        mapper = _ref.mapper;

    var RedataComponent = function (_PureComponent) {
        _inherits(RedataComponent, _PureComponent);

        function RedataComponent(props) {
            _classCallCheck(this, RedataComponent);

            var _this = _possibleConstructorReturn(this, (RedataComponent.__proto__ || Object.getPrototypeOf(RedataComponent)).call(this, props));

            _this._handleLoadResult = _this._handleLoadResult.bind(_this);

            // If it's in the browser, check if there is data coming from server side rendering.
            // If server data not available, or if this is not in browser, do first load.
            typeof window !== 'undefined' && _this._loadFromServerRender() || _this._load();

            _this.state = _extends({}, data);

            // console.log('data', JSON.parse(JSON.stringify(data)));
            return _this;
        }

        _createClass(RedataComponent, [{
            key: 'componentWillUpdate',
            value: function componentWillUpdate(nextProps, nextState) {
                var props = this.props,
                    state = this.state;

                // If data no longer valid, start loading.

                shouldReload({ props: props, nextProps: nextProps, state: state, nextState: nextState, data: data }) && this._load();
            }
        }, {
            key: 'render',
            value: function render() {
                // Render wrapped component passing the received props and the spreaded data.
                return _react2.default.createElement(WrappedComponent, _extends({}, this.props, this.state));
            }
        }, {
            key: '_load',
            value: function _load() {
                var props = this.props,
                    state = this.state;


                load({ props: props, state: state }).then(this._handleLoadResult);
            }
        }, {
            key: '_loadFromServerRender',
            value: function _loadFromServerRender() {
                var componentUniqueId = this._componentUniqueId();

                // If data was already available from server.
                if (window.__redata && window.__redata.store && window.__redata.store[componentUniqueId]) {
                    // Store server data in our data.
                    var serverData = window.__redata.store[componentUniqueId];

                    data.loading = serverData.loading;
                    data.error = serverData.error;
                    data.result = serverData.result;

                    this._handleLoadResult(data);

                    return true; // Was able to load from global store.
                }

                return false; // Was not able to load from global store.
            }
        }, {
            key: '_componentUniqueId',
            value: function _componentUniqueId() {
                // TODO: investigate how to consistently generate this
                return 'foo';
            }
        }, {
            key: '_handleLoadResult',
            value: function _handleLoadResult(data) {
                console.log('new result', data);
                // Map the load result using the mapper and store it in the state, which will trigger a render.
                // this.setState({ ...(mapper(data)) });
                this.setState(_extends({}, data));
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
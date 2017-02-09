'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _redata = require('../redata');

var _redata2 = _interopRequireDefault(_redata);

var _redataComponent = require('./redata-component');

var _redataComponent2 = _interopRequireDefault(_redataComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// public stuff -----------------------------------------------------------------------------------

function reactRedata(loader, shouldReload, mapper) {
    // Curry redata with provided information, only the initial data is missing.
    return _redataComponent2.default.bind(null, _redata2.default.bind(null, loader, shouldReload, mapper));
}

// private stuff ----------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------

exports.default = reactRedata;
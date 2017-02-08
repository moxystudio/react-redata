/* eslint no-invalid-this:0 */

'use strict';

var _loaderUtils = require('loader-utils');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loader(content, sourceMap) {
    var _this = this;

    this.cacheable && this.cacheable();

    // Grab the content from the css-loader
    if (content.indexOf('module.exports =') !== -1) {
        content = this.exec(content, this.resource);
        // Otherwise it's a css string
    } else {
        content = [[this.resourcePath, content, '', sourceMap]];
    }

    // Preserve CSS modules locals
    var out = content.locals ? content.locals : {};

    // Generate _nextStyles that will be used by applyStyles()
    out._nextStyles = content.map(function (entry) {
        var relativePath = _path2.default.relative(_this._compiler.context, entry[0]);

        return {
            id: (0, _loaderUtils.getHashDigest)(relativePath, 'md5', 'hex'),
            content: entry[1],
            sourceMap: entry[3]
        };
    });

    return 'module.exports = ' + JSON.stringify(out) + ';';
}

module.exports = loader;
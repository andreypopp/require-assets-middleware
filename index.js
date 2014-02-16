"use strict";

var fs    = require('fs');
var mime  = require('mime');

/**
 * Construct a connect/express middleware to server static assets to a browser
 *
 * @param {Registry?} registry A registry to use for serving assets, if not
 *                    passed then the global instance will be used.
 */
function createServeAssets(registry) {
  var getRegistry = registry ?
    function() { return registry; } :
    require('require-assets').currentRegistry;

  return function serveAssets(req, res, next) {
    var asset = getRegistry().mapping[req.originalUrl];

    if (!asset) return next();

    var contentType = asset.contentType ||
      mime.lookup(asset.filename) ||
      'application/stream';
    res.setHeader('Content-type', contentType);

    if (asset.src) {
      res.send(asset.src);
    } else {
      fs.createReadStream(asset.filename).pipe(res);
    }
  }
}

var serveAssets = createServeAssets();

module.exports = serveAssets;
module.exports.serveAssets = serveAssets;
module.exports.createServeAssets = createServeAssets;

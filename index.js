

/* requires and exposes the separate components of the app */

var Xoces = window.Xoces || {};

Xoces.pack = require('./components/tree/treePack.js');
Xoces.layout = require('./components/tree/treeLayout');
Xoces.draw = require('./components/tree/draw');

// aggressively exports Xoces globally
window.Xoces = Xoces;
global.Xoces = Xoces;


module.exports = Xoces;

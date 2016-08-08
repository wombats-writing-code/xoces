

import layout from './tree/layout'
import draw from './tree/draw'
import style from './tree/style'

var Xoces = window.Xoces || {};

Xoces.tree = {
  style: style,
  layout: layout,
  draw: draw
};

// aggressively exports Xoces globally
window.Xoces = Xoces;
global.Xoces = Xoces;

// export it for CommonJS and es2015
module.exports = Xoces;
export default Xoces;

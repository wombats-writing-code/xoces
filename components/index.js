

import layout from './tree/layout'
import draw from './tree/draw'
import style from './tree/style'
import clear from './tree/clear'

var xoces = window.xoces || {};

xoces.tree = {
  style: style,
  layout: layout,
  draw: draw,
  clear: clear
};

// aggressively exports xoces globally
window.xoces = xoces;
global.xoces = xoces;

// export it for CommonJS and es2015
module.exports = xoces;
export default xoces;

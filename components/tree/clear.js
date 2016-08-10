var d3 = require('d3');


function clear(element) {

  var svgId = element.id + 'tree';

  d3.select('#' + svgId).selectAll("*").remove();

}


module.exports = clear;

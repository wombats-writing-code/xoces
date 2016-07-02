var d3 = require('d3');

/**
  params is an object that must contain at least {
    element: [the raw DOM element],
    levelSpacing: [the vertical spacing between each level],
    nodeSpacing: [the horizontal spacing between each node],
    drawingParams: {
      width: Number,
      height: NUmber,
      fill: [color of the drawing],
    },
    nodeParams: {
      width: Number,
      height: Number,
      fill: [color of the node, hex color],
      labelKey: [the property of the node that should be used to label the node]
      labelFill: [color of the label text, hex color]
    },
    linkParams: {
      stroke: [color of the links, hex color]
    }
  }
*/
function draw(layout, params, element) {

  var drawingParams = params.drawingParams || {},
    nodeParams = params.nodeParams || {},
    linkParams = params.linkParams || {};

    drawingParams.backgroundFill = drawingParams.backgroundFill || '#eee';

  var svgId = '#treeSVG';

  // create and append an SVG element to the passed in element
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute('id', 'treeSVG');
  svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
  element.appendChild(svg);

  var svgEl = d3.select(svgId)
  .attr('width', element.style.width)
  .attr('height', element.style.height)
  .attr('fill', drawingParams.backgroundFill);

  svgEl.append("svg:defs").append("svg:marker")
    .attr("id", "triangle")
    .attr("refX", 2)
    .attr("refY", 6)
    .attr("markerWidth", 13)
    .attr("markerHeight", 13)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M2,2 L2,11 L10,6 L2,2")
    .style("stroke", "black");

  svgEl.selectAll('line')
  .data(layout.links)
  .enter().append('line')
  .attr('x1', function(d) {return d.x1})
  .attr('y1', function(d) {return d.y1})
  .attr('x2', function(d) {return d.x2})
  .attr('y2', function(d) {return d.y2})
  .style('stroke-width', function(d) {return d.strokeWidth})
  .style('stroke', function(d) {return d.stroke})
  .attr("marker-start", "url(#triangle)")


  // draw links first, or else links will be ontop of nodes
  svgEl.selectAll('rect')
  .data(layout.nodes)
  .enter().append("rect")
  .attr('x', function(d) {return d.x})
  .attr('y', function(d) {return d.y})
  .attr('width', function(d) {return d.width})
  .attr('height', function(d) {return d.height})
  .style('fill', function(d) {return d.fill})

  svgEl.selectAll('text')
  .data(layout.nodes)
  .enter().append("text")
  .attr('x', function(d) {return d.label.x})
  .attr('y', function(d) {return d.label.y})
  .text( function(d) {return d.label.text})
  .style('font-size', function(d) {return d.label.fontSize;})
  .style('fill', function(d) {return d.label.fill})


  // then draw nodes
}


module.exports = draw;

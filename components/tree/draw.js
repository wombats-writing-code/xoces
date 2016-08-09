var d3 = require('d3');


function draw(layout, params, element) {

  var svgId = element.id + 'tree';

  // create and append an SVG element to the passed in element
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute('id', svgId)
  svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
  element.appendChild(svg);

  var svgEl = d3.select('#' + svgId)
  .attr('width', element.style.width)
  .attr('height', element.style.height)
  .attr('fill', params.drawing.background);

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

  let link = svgEl.selectAll('line')
  .data(layout.links)
  .enter().append('line')
  .attr('x1', function(d) {return d.x1})
  .attr('y1', function(d) {return d.y1})
  .attr('x2', function(d) {return d.x2})
  .attr('y2', function(d) {return d.y2})
  .style('stroke-width', function(d) {return d.strokeWidth})
  .style('stroke', function(d) {return d.stroke})
  // .attr("marker-start", "url(#triangle)")

  // draw links first, or else links will be ontop of nodes
  let node;
  if (!layout.nodes[0].borderRadius || layout.nodes[0].borderRadius === '0%') {
    node = svgEl.selectAll('rect')
      .data(layout.nodes)
      .enter().append("rect")
      .attr('x', function(d) {return d.x})
      .attr('y', function(d) {return d.y})
      .attr('width', function(d) {return d.width})
      .attr('height', function(d) {return d.height});

  } else {
    node = svgEl.selectAll('circle')
      .data(layout.nodes)
      .enter().append("circle")
      .attr('cx', function(d) {return d.x})
      .attr('cy', function(d) {return d.y})
      .attr('r', function(d) {return d.width})
  }

  node
  .style('fill', (d) => {
    if (typeof d.fill === 'function') {
      return d.fill(d);
    }
    return d.fill;
  })

  let nodeBottomLabel = svgEl.selectAll('.node-bottom-label')
  .data(layout.nodeBottomLabels)
  .enter().append("foreignObject")
  .attr('class', 'foreignObject')
  .attr('x', function(d) { return d.x - d.width/4})
  .attr('y', function(d) { return d.y; })
  .attr("width", function(d) { return d.width })
  .attr("height", function(d) { return d.height })
  .append("xhtml:p")
  .style('background', (d) => d.background)
  .style('line-height', (d) => d.lineHeight)
  .style('font-size', function(d) {return d.fontSize + 'px';})
  .style('color', (d) => d.fill)
  .text(function(d) { return d.text });

  let nodeCenterLabels = svgEl.selectAll('.node-center-label')
  .data(layout.nodeCenterLabels)
  .enter().append("foreignObject")
  .attr('class', 'foreignObject')
  .attr('x', (d) => {
    if (d.width) {
      return d.x - d.width/4;
    }
    return d.x;
  })
  .attr('y', function(d) { return d.y; })
  .attr("width", function(d) { return d.width })
  .attr("height", function(d) { return d.height })
  .append("xhtml:p")
  .style('background', (d) => d.background)
  .style('line-height', (d) => d.lineHeight)
  .style('font-size', function(d) {return d.fontSize + 'px';})
  .style('color', (d) => d.fill)
  .text(function(d) { return d.text });



  // then draw nodes
}


module.exports = draw;

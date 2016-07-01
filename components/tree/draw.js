

// var d3 = require('d3');
/*
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

  // create and append an SVG element to the passed in element
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute('width', element.style.width);
  svg.setAttribute('height', element.style.height);
  svg.setAttribute('fill', drawingParams.backgroundFill);
  svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
  element.appendChild(svg);

  console.log(svg);

  // draw links first, or else links will be ontop of nodes
  for (var i=0; i<layout.links.length; i++) {

  }


  // then draw nodes
}


module.exports = draw;

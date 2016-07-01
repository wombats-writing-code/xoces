(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){


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

},{}],2:[function(require,module,exports){


/*
  params is an object that must contain at least {
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
function layout(params, model) {
  if (!params) {
    console.error('params must be supplied, even if it is {}');
    return;
  }
  if (!model) {
    console.error('model argument is required. run Xoces.layout() to get model');
    return;
  }

  var nodeParams = params.nodeParams || {},
    linkParams = params.linkParams || {},
    drawingParams = params.drawingParams || {};

  nodeParams.height = nodeParams.height || 50;
  nodeParams.width = nodeParams.width || 80;
  nodeParams.fill = nodeParams.fill || '#999';
  nodeParams.labelKey = nodeParams.labelKey || 'name';
  nodeParams.labelFill = nodeParams.labelFill = '#333';

  linkParams.stroke = linkParams.stroke || '#555';

  var canvasWidth = drawingParams.width || 600;


  var nodeSpacing = params.nodeSpacing || 50,
    levelSpacing = params.levelSpacing || 170,
    marginTop = 50,
    marginLeft = 50,
    marginRight = 50;

    // --- layout nodes ----------
    var nodes = [];
    var levels = model.levelsByRank;
    var depths = Object.keys(levels);

    var lastY = marginTop;
    for (var i=0; i<depths.length; i++) {
      var level = levels[depths[i]];

      for (var j=0; j<level.length; j++) {
        var nodeModel = level[j];
        var spacePerNode = (canvasWidth - marginRight - marginLeft) / level.length;

        var layout = {
          height: nodeParams.height,
          width: nodeParams.width,
          x: (j+.5)*nodeSpacing,
          y: lastY,
          fill: nodeParams.fill,
          label: {
            text: nodeModel[nodeParams.labelKey],
            fill: nodeParams.labelFill
          }
        };
        var node = Object.assign({}, nodeModel, layout);
      };

      nodes.push(node);
      lastY += levelSpacing;
    }

    // --- layout links --------
    var links = [];
    for (var i=0; i<nodes.length; i++) {
      var node = nodes[i];
      var linksFromNode = model.links.filter( function(link) {
        return link.sourceId === nodeModel.id;
      });

      for (var s=0; s<linksFromNode.length; s++) {
        var linkModel = linksFromNode[s];
        var targetNode = nodes.filter( function(node) {
          return node.id === linkModel.destinationId;
        });

        var layout = {
          x1: node.x,
          y1: node.y,
          x2: targetNode.x,
          y2: targetNode.y,
          stroke: linkParams.stroke,
        };
        var link = Object.assign({}, linkModel, layout);

        links.push(link);
      }
    }

    return {
      nodes: nodes,
      links: links
    }
}

module.exports = layout;

},{}],3:[function(require,module,exports){


/** treePack

*/
function treePack(nodes, links, iterateeFn) {

  var findDepthTraverse = function findDepthTraverse(arg, iterateeFn) {
    var quantity = iterateeFn(arg);

    if (quantity.length == 0) {
      return 0;

    } else {
      var maxDepth = 0;
      for (var i=quantity.length; i--;) {
        maxDepth = Math.max(maxDepth, findDepthTraverse(quantity[i], iterateeFn));
      }
      return maxDepth + 1;
    }
  }

  var levels = {};
  for (var j=0; j<nodes.length; j++) {
    var depth = findDepthTraverse(nodes[j], iterateeFn);
    levels[depth] = levels[depth] || [];
    levels[depth].push(nodes[j]);
  }

  return {
    levelsByRank: levels,
    links: links
  }
}

module.exports = treePack;

},{}],4:[function(require,module,exports){
(function (global){


/* requires and exposes the separate components of the app */

var Xoces = window.Xoces || {};

Xoces.pack = require('./components/tree/treePack.js');
Xoces.layout = require('./components/tree/treeLayout');
Xoces.draw = require('./components/tree/draw');

// aggressively exports Xoces globally
window.Xoces = Xoces;
global.Xoces = Xoces;


module.exports = Xoces;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./components/tree/draw":1,"./components/tree/treeLayout":2,"./components/tree/treePack.js":3}]},{},[4]);

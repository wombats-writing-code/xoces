

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

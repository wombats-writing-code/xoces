
import layoutParams from './layoutParams'
var _ = require('lodash');

function layout(userParams, ranked, edges) {
  if (!ranked) {
    console.error('ranked argument is required.');
    return;
  }

  let params = _.merge({}, layoutParams, userParams);

  // --- layout elements ----------
  let nodes = [], labels = [];
  let depths = Object.keys(ranked);

  let lastY = params.drawing.paddingTop;
  for (var i=0; i<depths.length; i++) {
    let level = ranked[depths[i]];

    for (var j=0; j<level.length; j++) {
      let sibling = level[j];
      let spacePerNode = Math.max(params.node.width + 5, (params.drawing.width - params.drawing.paddingLeft - params.drawing.paddingRight) / level.length);

      let nodeLayout = {
        height: params.node.height,
        width: params.node.width,
        x: (j+.5) * spacePerNode,
        y: lastY,
      };

      nodes.push( _.assign({}, sibling, nodeLayout));

      labels.push( _.assign({}, {
        x: nodeLayout.x,
        y: nodeLayout.y + params.node.height + params.label.fontSize,
        text: sibling[params.label.property],
        fontSize: params.label.fontSize,
        entity: sibling
      }));
    };

    lastY += params.depthSpacing;
  }

  // --- layout links --------
  let links = [];
  for (var i=0; i<nodes.length; i++) {
    let node = nodes[i];
    let linksFromNode = _.filter(edges, {sourceId: node.id});

    // console.log(linksFromNode.length, 'links from', node.name);

    for (var s=0; s<linksFromNode.length; s++) {
      let linkModel = linksFromNode[s];
      let targetNode = _.find(nodes, {id: linkModel.destinationId});

      // console.log('linkModel', linkModel);
      // console.log('targetNode', targetNode);

      links.push( _.assign({}, linkModel, {
        x1: node.x + node.width / 2,
        y1: node.y,
        x2: targetNode.x + node.width / 2,
        y2: targetNode.y,
      }));
    }
  }

  return {
    nodes, labels, links
  }
}

module.exports = layout;

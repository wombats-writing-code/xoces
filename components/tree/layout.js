import _ from 'lodash'

import {multiLine} from './utils'
import layoutParams from './layoutParams'

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
      let textLines = multiLine(sibling[params.label.property], params.label.fontSize, params.node.width*2);

      labels.push( _.assign({}, {
        x: nodeLayout.x,
        y: nodeLayout.y + params.node.height + params.label.fontSize,
        width: params.node.width*3,
        text: sibling[params.label.property],
        multiLines: textLines,
        fontSize: params.label.fontSize,
        lineHeight: 1.25,
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
        y1: node.y + node.height / 2,
        x2: targetNode.x + node.width / 2,
        y2: targetNode.y + node.height / 2,
      }));
    }
  }

  return {
    nodes, labels, links
  }
}

module.exports = layout;

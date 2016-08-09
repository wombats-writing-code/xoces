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
  let nodes = [], nodeBottomLabels = [], nodeCenterLabels = [];
  let depths = Object.keys(ranked);

  let depthSpacing = Math.max(params.depthSpacing, (params.drawing.height - params.drawing.paddingTop - params.drawing.paddingBottom) / depths.length);

  let lastY = params.drawing.paddingTop;
  for (var i=0; i<depths.length; i++) {
    let level = ranked[depths[i]];

    for (var j=0; j<level.length; j++) {
      let sibling = level[j];
      let spacePerNode = Math.max(params.node.width + 5, (params.drawing.width - params.drawing.paddingLeft - params.drawing.paddingRight) / level.length);

      let nodeLayout = _.assign({}, params.node, {
        x: (j+.5) * spacePerNode,
        y: lastY,
      });

      nodes.push( _.assign({}, sibling, nodeLayout));

      let bottomLabelText;
      if (typeof params.nodeBottomLabel.property === 'function') {
        bottomLabelText = params.nodeBottomLabel.property(sibling);
      } else {
        bottomLabelText = sibling[params.nodeBottomLabel.property];
      }

      // make bottom labels
      nodeBottomLabels.push( _.assign({}, {
        x: nodeLayout.x,
        y: nodeLayout.y + params.node.height + params.nodeBottomLabel.fontSize,
        width: params.node.width*4,
        text: bottomLabelText,
        fontSize: params.nodeBottomLabel.fontSize,
        lineHeight: 1.15,
        entity: sibling
      }));

      // make center labels
      if (params.nodeCenterLabel) {
        let centerLabelText;
        if (typeof params.nodeCenterLabel.property === 'function') {
          centerLabelText = params.nodeCenterLabel.property(sibling);
        } else {
          centerLabelText = sibling[params.nodeCenterLabel.property];
        }

        nodeCenterLabels.push( _.assign({}, {
          x: nodeLayout.x - nodeLayout.width/4,
          y: nodeLayout.y,
          text: centerLabelText,
          fontSize: params.nodeCenterLabel.fontSize,
          lineHeight: 1.15,
          entity: sibling
        }));
      }

    };

    lastY += depthSpacing;
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

      if (!targetNode.borderRadius || targetNode.borderRadius === '0%') {
        links.push( _.assign({}, linkModel, {
          x1: node.x + node.width / 2,
          y1: node.y + node.height / 2,
          x2: targetNode.x + node.width / 2,
          y2: targetNode.y + node.height / 2,
        }));
      } else {
        links.push( _.assign({}, linkModel, {
          x1: node.x,
          y1: node.y,
          x2: targetNode.x,
          y2: targetNode.y,
        }));
      }
    }
  }

  return {
    nodes, links, nodeBottomLabels, nodeCenterLabels
  }
}

module.exports = layout;

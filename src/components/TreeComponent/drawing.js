
export const EDGE_CLASS = 'TREE_VIEW__EDGE_CLASS'
export const EDGE_ARROW_CLASS = 'TREE_VIEW__EDGE_ARROW_CLASS'
export const NODE_CLASS = 'TREE_VIEW__NODE_CLASS'
export const NODE_TAG_CLASS = 'TREE_VIEW__NODE_TAG_CLASS'

import {polarToRectangular, radiansToDegrees} from '../canvas/geometry'

export function drawEdges(props) {
  let data = props.data;

  let edgeGroup = props.selection
    .selectAll(`path.${EDGE_CLASS}`)
    .data(data, d => d.instanceId);

  let arrowGroup = props.selection.selectAll(`.${EDGE_ARROW_CLASS}`)
    .data(props.data, d => d.instanceId);

  edgeGroup.exit().remove();
  arrowGroup.exit().remove()

  edgeGroup.enter()
    .append('line')
    .attr('class', EDGE_CLASS)
    .attr('x1', d => d.x1)
    .attr('y1', d => d.y1)
    .attr('x2', d => d.x2)
    .attr('y2', d => d.y2)
    .attr('opacity', d => d.opacity)
    .attr('stroke', d => d.stroke)
    .attr('stroke-width', d => d.strokeWidth)

  arrowGroup.enter()
    .append('polygon')
    .attr('points', "-5,11 0,0 5,11")
    .attr('class', EDGE_ARROW_CLASS)
    .attr('xlink:href', '#arrow')
    .style('fill', d => d.stroke)
    .attr('transform', function(d) {
      let x = d.x1;
      let y = d.y1;
      let rotationAngle = d.theta < 0 ? radiansToDegrees(d.theta - Math.PI/2) : radiansToDegrees(d.theta + Math.PI/2);

      // console.log('theta', radiansToDegrees(d.theta), 'rotationAngle', rotationAngle)
      return `translate(${x}, ${y})` + ` rotate(${rotationAngle}, ${0}, ${0})`;
    });
}

export function drawNodes(props) {
  let data = props.data;

  let nodeGroup = props.selection
    .selectAll(`foreignObject.${NODE_CLASS}`)
    .data(data, d => d.instanceId);

  nodeGroup.exit().remove();

  let foreignObject = nodeGroup.enter()
    .append('foreignObject')
    .attr('class', NODE_CLASS)
    .attr('width', d => 2*d.radius)
    .attr('height', d => 2*d.radius)
    .attr('x', d => d.x)
    .attr('y', d => d.y)

  foreignObject
    .append("xhtml:p")
    .attr('class', `flex-container align-center justify-center xoces-tree-component-${NODE_CLASS}`)
    .style('width', d => `${2*d.radius}px`)
    .style('height', d => `${2*d.radius}px`)
    .style('opacity', d => d.opacity)
    .style('font-size', d=> `${d.nodeLabelFontSize}px`)
    .style('background', d => d.fill)
    .style('color', d => d.nodeLabelColor)
    .style('hyphens', 'auto')
    // .style('border-left', '2px solid #fff')
    // .style('border-right', '2px solid #fff')
    // .style('padding-left', '5px')
    // .style('padding-right', '5px')
    .style('border-radius', '50%')
    .style('margin-top', 0)
    .style('margin-bottom', 0)
    .style('text-align', 'center')
    .style('line-height', 1)
    .style('cursor', 'default')
    .text(d => d.nodeLabelText)

  foreignObject
    .append("xhtml:p")
    .attr('class', `${NODE_TAG_CLASS}`)
    .style('width', d => `${4*d.radius}px`)
    .style('font-size', d=> `${d.nodeTagFontSize}px`)
    .style('opacity', d => d.nodeTagOpacity)
    .style('color', d => d.nodeTagColor)
    .style('margin-bottom', 0)
    .style('line-height', 1)
    .style('cursor', 'default')
    .style('transform', d => `translate(${2*d.radius+5}px, -${2*d.radius}px)`)
    .text(d => d.nodeTagText)

  return nodeGroup;

}

export function clearDrawing(selection) {
  let nodeGroup = selection
    .selectAll(`foreignObject.${NODE_CLASS}`)
    .data([], d => d.instanceId);

  nodeGroup.exit().remove();

  let edgeGroup = selection
    .selectAll(`path.${EDGE_CLASS}`)
    .data([], d => d.instanceId);

  let arrowGroup = selection.selectAll(`.${EDGE_ARROW_CLASS}`)
    .data([], d => d.instanceId);

  edgeGroup.exit().remove();
  arrowGroup.exit().remove()


  selection.selectAll('*').remove()
}

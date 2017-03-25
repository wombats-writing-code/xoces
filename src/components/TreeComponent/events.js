import {EDGE_CLASS, EDGE_ARROW_CLASS, NODE_CLASS, NODE_TAG_CLASS} from './drawing'
import * as d3 from 'd3-selection'

export function attachEvent(props) {
  props.selection
  .on('mouseover', _.partialRight(_handleMouseOver, props))
  .on('mouseout', _.partialRight(_handleMouseOut, props))
  .on('click', function(d, i, g) {
    // console.log('clicked!', d, this)
    props.onClick(d.model);
    if (props.onClickFinish) {
      props.onClickFinish(d.model)
    }
  });
}

function _handleMouseOver(datum, i, g, props) {
  // console.log('current mouseovered', datum)

  // =====
  // change the style of all the nodes to nonActive
  // =====
  let allOutgoing = props.graph.getOutgoingEntitiesAll(datum.id, props.data.entities, props.data.relationships);
  let allOutgoingIds = _.map(allOutgoing, 'id')

  d3.selectAll(`.${NODE_CLASS}`)
  .filter( d => {
    return d.instanceId !== datum.instanceId && allOutgoingIds.indexOf(d.model.id) === -1;
  })
  .style('opacity', d => d.nonActiveOpacity)

  // =======
  // change all the relevant edges to be activeOpacity
  // =======
  let highlights = [];
  d3.selectAll(`.${EDGE_CLASS}, .${EDGE_ARROW_CLASS}`)
    .filter( d => d.source.id === datum.id || allOutgoingIds.indexOf(d.source.id) > -1)
    .style('opacity', d => d.activeOpacity)

  // change the style of all other edges to be nonActive
  d3.selectAll(`.${EDGE_CLASS}, .${EDGE_ARROW_CLASS}`)
    .filter( d => d.source.id !== datum.id && allOutgoingIds.indexOf(d.source.id) === -1)
    .style('opacity', d => d.nonActiveOpacity)

  // // ====
  // // change the corresponding nodeTagLabel to activeOpacity, and the labels that are the sources
  // // ====
  d3.selectAll(`.${NODE_TAG_CLASS}`)
    .filter(d => d.id === datum.id || allOutgoingIds.indexOf(d.id) > -1 )
    .style('opacity', d => d.activeOpacity)


  if (props.onMouseOverFinish) {
    props.onMouseOverFinish(datum);
  }
}

function _handleMouseOut(d, i, g, props) {
  d3.select(this)
  .style('fill', d => d.fill)

  // make all subArc labels back to normal opacity
  d3.selectAll(`.${NODE_CLASS}`)
  .style('opacity', d => d.opacity)

  // make all node tag labels back to normal opacity
  d3.selectAll(`.${NODE_TAG_CLASS}`)
  .style('opacity', d => d.nodeTagOpacity)

  // // make all the subArcs back to normal opacity
  // d3.selectAll(`.${SUB_ARC_CLASS_NAME}`)
  // .style('opacity', d => d.opacity)
  //
  // make all chords to normal opacity
  d3.selectAll(`.${EDGE_CLASS}, .${EDGE_ARROW_CLASS}`)
  .style('opacity', d => d.opacity)

  if (props.onMouseOutFinish) {
    props.onMouseOutFinish(d);
  }
}

export function detachEvent(props) {

}

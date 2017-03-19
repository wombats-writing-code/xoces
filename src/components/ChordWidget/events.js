import * as d3 from 'd3'
import _ from 'lodash'
import {
  SUB_ARC_CLASS_NAME,
  ARC_LABEL_CLASS_NAME, SUB_ARC_LABEL_CLASS_NAME,
  CHORD_CLASS_NAME, CHORD_ARROW_CLASS_NAME
} from './drawing'

export function attachEvent(props) {

    props.selection
    .on('mouseover', _.partialRight(_handleMouseOver, props))
    .on('mouseout', _.partialRight(_handleMouseOut, props))
    .on('click', function(d, i, g) {
      // console.log('clicked!', d, this)
      props.onClick(d.model);
    });
}

function _handleMouseOver(datum, i, g, props) {

  // console.log('datum', datum)

  // change the style of the subArc
  d3.select(this)
    .style('fill', d => d.activeFill)

  // change the corresponding subArcLabel to activeOpacity
  d3.selectAll(`.${SUB_ARC_LABEL_CLASS_NAME}`)
    .filter(d => d.id === datum.id)
    .style('opacity', d => d.activeOpacity)

  // change the style of all the arc labels to nonActive
  d3.selectAll(`.${ARC_LABEL_CLASS_NAME}`)
    .style('opacity', d => d.nonActiveOpacity)

  // change the style of all the other subArcs to nonActive
  d3.selectAll(`.${SUB_ARC_CLASS_NAME}`)
    .filter(d => d !== datum)
    .style('opacity', d => d.nonActiveOpacity)

  // change all the relevant chords to be activeOpacity
  d3.selectAll(`.${CHORD_CLASS_NAME}, .${CHORD_ARROW_CLASS_NAME}`)
    .filter( d => d.source.arc.id === datum.id)
    .style('opacity', d => d.activeOpacity)

  // change the style of all other chords to be nonActive,
  d3.selectAll(`.${CHORD_CLASS_NAME}, .${CHORD_ARROW_CLASS_NAME}`)
    .filter( d => d.source.arc.id !== datum.id)
    .style('opacity', d => d.nonActiveOpacity)

  if (props.onMouseOverCallback) {
    props.onMouseOverCallback(d);
  }
}

function _handleMouseOut(d, i, g, props) {
  d3.select(this)
  .style('fill', d => d.fill)

  // make all subArc labels back to normal opacity
  d3.selectAll(`.${SUB_ARC_LABEL_CLASS_NAME}`)
  .style('opacity', d => d.opacity)

  // make all arc labels back to normal opacity
  d3.selectAll(`.${ARC_LABEL_CLASS_NAME}`)
  .style('opacity', d => d.opacity)

  // make all the subArcs back to normal opacity
  d3.selectAll(`.${SUB_ARC_CLASS_NAME}`)
  .style('opacity', d => d.opacity)

  // make all chords to normal opacity
  d3.selectAll(`.${CHORD_CLASS_NAME}, .${CHORD_ARROW_CLASS_NAME}`)
  .style('opacity', d => d.opacity)

  if (props.onMouseOutCallback) {
    props.onMouseOutCallback(d);
  }
}

export function detachEvent(props) {

}

import React, {Component} from 'react'
import * as d3 from 'd3-selection'
import _ from 'lodash'

import './ChordComponent.scss'

import {computeDimensions, computeLayout} from './layout'
import {init} from '../canvas'
import {
  drawArcs, drawLabels, drawChords,
  ARC_CLASS_NAME, SUB_ARC_CLASS_NAME, CHORD_CLASS_NAME,
  ARC_LABEL_CLASS_NAME, SUB_ARC_LABEL_CLASS_NAME,
} from './drawing'
import {getScheme, stylize} from './style'
import {attachEvent, detachEvent} from './events'
import graphProvider from '../graph/'


class ChordComponent extends Component {

  constructor(props) {
    super(props);

    this.w;
    this.h;
    this.drawingGroup;
  }

  componentDidMount() {
    // console.log('componentDidMount in ChordComponent', this.canvasId)
    let props = this.props;
    let scheme = getScheme(props.colorScheme)

    let chordVis = d3.select(`#${this.canvasId}`);

    let {drawingGroup, w, h} = init(chordVis, scheme.background, {
      height: this.props.height,
      width: this.props.width
    });

    this.w = w;
    this.h = h;
    this.drawingGroup = drawingGroup;

    this._update(drawingGroup, w, h, this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentLevelEntity !== nextProps.currentLevelEntity ||
        this.props.selectedEntities !== nextProps.selectedEntities
    ) {

      this._update(this.drawingGroup, this.w, this.h, nextProps);
    }
  }

  render() {
    let scheme = getScheme(this.props.colorScheme)
    let graph = graphProvider(this.props.relationship)

    let canvas;
    if (!this.props.canvasId) {
      canvas = (<svg id={_.uniqueId('svg_')} ref={(el) => { this.canvasId = el && el.id; }}></svg>)
    } else {
      this.canvasId = this.props.canvasId;
    }

    return (
      <div>
        {canvas}
      </div>
    )
  }

  _update(drawingGroup, w, h, props) {
    let {innerRadius, outerRadius} = computeDimensions(w, h);

    let scheme = getScheme(props.colorScheme)
    let graph = graphProvider(props.relationship)

    let layout = computeLayout({
      data: props.data,
      hierarchy: props.hierarchy,
      currentLevelEntity: props.currentLevelEntity,
      selectedEntities: props.selectedEntities,
      graph: graph,
      entityLabelKey: props.entityLabelKey,
      outerRadius: outerRadius
    });

    if (!layout) return;

    layout = stylize(layout, scheme);

    // console.log('layout', layout)

    drawChords({
      selection: drawingGroup,
      data: layout.chords,
      className: CHORD_CLASS_NAME,
      w,
      h,
    })

    // draw arcs
    drawArcs({
      selection: drawingGroup,
      data: layout.arcs,
      className: ARC_CLASS_NAME,
      w,
      h,
    });

    // draw subarcs
    drawArcs({
      selection: drawingGroup,
      data: layout.subArcs,
      className: SUB_ARC_CLASS_NAME,
      w,
      h,
    });

    // draw labels
    drawLabels({
      selection: drawingGroup,
      data: layout.arcLabels,
      className: ARC_LABEL_CLASS_NAME,
    });

    drawLabels({
      selection: drawingGroup,
      data: layout.subArcLabels,
      className: SUB_ARC_LABEL_CLASS_NAME,
    });

    // attach events to sub-arcs
    attachEvent({
      selection: d3.selectAll(`.${SUB_ARC_CLASS_NAME}`),
      onMouseOver: props.onMouseOver,
      onMouseOut: props.onMouseOut,
      onClick: props.onClickSubArc,
      graph,
      data: props.data,
      onMouseOverCallback: props.onMouseOverCallback,
      onMouseOutCallback: props.onMouseOutCallback,
      onClickCallback: props.onClickCallback
    })
  }

}

export default ChordComponent

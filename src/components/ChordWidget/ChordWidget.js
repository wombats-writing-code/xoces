import React, {Component} from 'react'
import * as d3 from 'd3-selection'
import './ChordWidget.scss'
import _ from 'lodash'

import {computeDimensions, computeLayout} from './layout'
import {init, drawArcs, drawLabels} from './drawing'
import {getScheme, stylize} from './style'
import {attachEvent, detachEvent} from './events'
import graphProvider from '../graph/'


class ChordWidget extends Component {

  constructor(props) {
    super(props);

    this.w;
    this.h;
    this.drawingGroup;
    this.d3Arc;
  }

  componentDidMount() {
    console.log('this.props', this.props)
    let chordVis = d3.select(`#${this.svgEl.id}`);
    let {drawingGroup, w, h, d3Arc} = init(chordVis, {
      colorScheme: this.props.colorScheme,
      height: this.props.height,
      width: this.props.width
    });

    this.w = w;
    this.h = h;
    this.drawingGroup = drawingGroup;
    this.d3Arc = d3Arc;

    this._update(drawingGroup, w, h, this.props);

    // attach events to sub-arcs
    attachEvent({
      selection: d3.selectAll('.subArc'),
      onMouseOver: this.props.onMouseOver,
      onMouseOut: this.props.onMouseOut,
      onClick: this.props.onClickEntity,
      onMouseOverCallback: this.props.onMouseOverCallback,
      onMouseOutCallback: this.props.onMouseOutCallback,
      onClickCallback: this.props.onClickCallback
    })

  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentLevel !== nextProps.currentLevel) {

      this._update(this.drawingGroup, this.w, this.h, nextProps);
    }
  }

  render() {
    // console.log('props', this.props)

    return (
      <div>
        <h1>I am a Chord Widget</h1>
        <svg id={_.uniqueId('svg_')} ref={(el) => { this.svgEl = el; }}>
        </svg>
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
      level: props.currentLevel,
      graph: graph,
      arcLabelKey: props.arcLabel,
      outerRadius: outerRadius
    });
    layout = stylize(layout, scheme);

    // console.log('layout', layout)

    // draw arcs
    drawArcs({
      selection: drawingGroup,
      data: layout.arcs,
      className: 'arc',
      arc: this.d3Arc
    });

    // draw subarcs
    drawArcs({
      selection: drawingGroup,
      data: layout.subArcs,
      className: 'subArc',
      arc: this.d3Arc
    });

    // draw labels
    drawLabels({
      selection: drawingGroup,
      data: layout.labels,
      className: 'arcLabel',
    });
  }

}

export default ChordWidget

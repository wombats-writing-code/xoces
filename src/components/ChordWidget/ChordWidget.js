import React, {Component} from 'react'
import * as d3 from 'd3-selection'
import './ChordWidget.scss'
import _ from 'lodash'

import {computeDimensions, computeLayout} from './layout'
import {drawArcs, drawLabels} from './drawing'
import {getScheme, stylize} from './style'
import {attachEvent, detachEvent} from './events'
import graphProvider from '../graph/'


class ChordWidget extends Component {

  constructor(props) {
    super(props);

    this.w;
    this.h;
    this.drawingGroup;
  }

  componentDidMount() {
    let scheme = getScheme(this.props.colorScheme)
    let chordVis = d3.select(`#${this.svgEl.id}`);

    chordVis
    .style('height', this.props.height)
    .style('width', this.props.width)
    .style('background', scheme.background);

    let w = parseFloat(chordVis.style('width'), 10);
    let h = parseFloat(chordVis.style('height'), 10);

    let drawingGroup = chordVis.append('g')
      .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

    this.w = w;
    this.h = h;
    this.drawingGroup = drawingGroup;

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
      innerRadius,
      outerRadius
    });

    // draw subarcs
    drawArcs({
      selection: drawingGroup,
      data: layout.subArcs,
      className: 'subArc',
      innerRadius,
      outerRadius
    });

    // draw labels
    drawLabels({
      selection: drawingGroup,
      data: layout.labels,
      className: 'arc-label',
    });
  }

}

export default ChordWidget

import React, {Component} from 'react'
import * as d3 from 'd3-selection'
import './ChordWidget.scss'
import _ from 'lodash'

import {computeDimensions, computeLayout} from './layout'
import {drawArcs, drawLabels} from './drawing'
import {getScheme, style} from './colorScheme'
import graphProvider from '../graph/'

class ChordWidget extends Component {

  constructor(props) {
    super(props);

    this.graph = graphProvider(this.props.relationship)
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
      .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")")

    let {innerRadius, outerRadius} = computeDimensions(w, h);
    let layout = computeLayout(this.props.data, this.props.hierarchy, this.props.hierarchy[0], this.graph, this.props.arcLabel, outerRadius);
    layout = style(layout, scheme);

    // console.log('layout', layout)

    drawArcs({
      selection: drawingGroup,
      data: layout.arcs,
      className: 'arc',
      innerRadius,
      outerRadius
    });

    drawArcs({
      selection: drawingGroup,
      data: layout.subArcs,
      className: 'subArc',
      innerRadius,
      outerRadius
    });

    drawLabels({
      selection: drawingGroup,
      data: layout.labels,
      className: 'arc-label',
    });
  }

  componentWillUpdate() {
    return false;
  }

  render() {
    console.log('props', this.props)

    return (
      <div>
        <h1>I am a Chord Widget</h1>
        <svg id={_.uniqueId('svg_')} ref={(el) => { this.svgEl = el; }}>
        </svg>
      </div>
    )

  }

}

export default ChordWidget

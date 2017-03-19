import React, {Component} from 'react'
import * as d3 from 'd3-selection'
import _ from 'lodash'

import BreadcrumbsNav from '../BreadcrumbsNav'
import HierarchicalListSearch from '../HierarchicalListSearch'

import './ChordWidget.scss'

import {computeDimensions, computeLayout} from './layout'
import {
  init, drawArcs, drawLabels, drawChords,
  ARC_CLASS_NAME, SUB_ARC_CLASS_NAME, CHORD_CLASS_NAME,
  ARC_LABEL_CLASS_NAME, SUB_ARC_LABEL_CLASS_NAME,
} from './drawing'
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
    // console.log('this.props', this.props)
    let chordVis = d3.select(`#${this.svgEl.id}`);
    let {drawingGroup, w, h, d3Arc} = init(chordVis, {
      colorScheme: this.props.colorScheme,
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

    // console.log('props', this.props)

    return (
      <div className="xoces-chord-widget">
        <h1>I am a Chord Widget</h1>
        <BreadcrumbsNav breadcrumbs={this.props.breadcrumbs}
                      schemeName={this.props.colorScheme}
                      entityLabelKey={this.props.entityLabelKey}
                      hierarchy={this.props.hierarchy}
                      onClickBreadcrumb={this.props.onClickBreadcrumb}
                    />

        <div className="">
          <div className="medium-9 columns no-left-padding no-right-padding">
            <svg id={_.uniqueId('svg_')} ref={(el) => { this.svgEl = el; }}></svg>
          </div>
          <div className="medium-3 columns no-left-padding no-right-padding">
            <HierarchicalListSearch schemeName={this.props.colorScheme}
                                    hierarchy={this.props.hierarchy}
                                    currentLevelEntity={this.props.currentLevelEntity}
                                    data={this.props.data}
                                    entityLabelKey={this.props.entityLabelKey}
                                    graph={graph}
                                    selectedEntities={this.props.selectedEntities}
                                    onToggleEntity={this.props.onToggleEntity}
                                  />
          </div>
        </div>

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

export default ChordWidget

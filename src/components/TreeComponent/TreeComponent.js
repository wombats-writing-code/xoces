import React, {Component} from 'react'
import * as d3 from 'd3-selection'
import _ from 'lodash'

import './TreeComponent.scss'
import {computeLayout} from './layout'
import {getScheme, stylize} from './style'
import {NODE_CLASS, drawNodes, drawEdges} from './drawing'
import {attachEvent, detachEvent} from './events'
import {init} from '../canvas'

class TreeComponent extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // console.log('componentDidMount in ChordComponent', this.canvasId)
    let props = this.props;
    let scheme = getScheme(props.colorScheme)

    let visEl = d3.select(`#${this.canvasId}`);

    let {drawingGroup, w, h} = init(visEl, scheme.background, {
      height: this.props.height,
      width: this.props.width
    });

    this.w = w;
    this.h = h;
    this.drawingGroup = drawingGroup;

    this._update(visEl, w, h, this.props);
  }


  render() {
    let scheme = getScheme(this.props.colorScheme)
    // console.log('props in TreeComponent', this.props)

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
    let scheme = getScheme(props.colorScheme)
    let graph = props.graph;

    let layout = computeLayout({
      nodes: props.nodes,
      entityLabelKey: props.entityLabelKey,
      data: props.data,
      graph: graph,
      width: w,
      height: h,
    })

    layout = stylize(layout, scheme);

    drawEdges({
      selection: drawingGroup,
      data: layout.edges
    })

    drawNodes({
      selection: drawingGroup,
      data: layout.nodes
    })

    // attach events to sub-arcs
    attachEvent({
      selection: d3.selectAll(`.${NODE_CLASS}`),
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

export default TreeComponent

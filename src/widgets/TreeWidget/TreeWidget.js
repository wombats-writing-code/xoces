import React, {Component} from 'react'
import * as d3 from 'd3-selection'
import _ from 'lodash'

import TreeComponent from '../../components/TreeComponent/'

class TreeWidget extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="xoces-widget">
        <TreeComponent {...this.props} nodes={this.props.data.entities} />
      </div>
    )
  }

}

export default TreeWidget

import React, {Component} from 'react'
import * as d3 from 'd3-selection'
import _ from 'lodash'

import BreadcrumbsNav from '../../components/BreadcrumbsNav'
import HierarchicalListSearch from '../../components/HierarchicalListSearch'
import ChordComponent from '../../components/ChordComponent'
import TreeComponent from '../../components/TreeComponent'
import {CHORD_VIEW, TREE_VIEW} from '../../reducers/'
import graphProvider from '../../components/graph/'

class XocesWidget extends Component {

  constructor(props) {
    super(props);

    this.w;
    this.h;
  }

  render() {
    let graph = graphProvider(this.props.relationship)

    // console.log('props in XocesWidget', this.props)

    let component;
    if (this.props.view === CHORD_VIEW) {
      component = (<ChordComponent {...this.props} />)
    } else {
      component = (<TreeComponent {...this.props} nodes={this.props.selectedEntities} />)
    }

    return (
      <div className="xoces-widget">
          <BreadcrumbsNav breadcrumbs={this.props.breadcrumbs}
                        schemeName={this.props.colorScheme}
                        entityLabelKey={this.props.entityLabelKey}
                        hierarchy={this.props.hierarchy}
                        view={this.props.view}
                        onClickBreadcrumb={this.props.onClickBreadcrumb}
                        onChangeView={this.props.onChangeView}
                      />

          <div className="">
            <div className="medium-9 columns no-left-padding no-right-padding">
              {component}
            </div>
            <div className="medium-3 columns no-left-padding no-right-padding">
              <HierarchicalListSearch schemeName={this.props.colorScheme}
                                      height={this.props.height}
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

}

export default XocesWidget

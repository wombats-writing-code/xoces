import React, {Component} from 'react'
import * as d3 from 'd3-selection'
import $ from 'jquery'
import _ from 'lodash'
import pluralize from 'pluralize'

import ExpandHideListItem from './ExpandHideListItem'
import './HierarchicalListSearch.scss'


class HierarchicalListSearch extends Component {

  componentDidMount() {
    // console.log('this.props.height', this.props.height);
    $(this.el).height(this.props.height)
  }

  render() {
    let props = this.props;

    return (
      <div className={`xoces-hierarchical-list-search ${props.schemeName}`} ref={(el) => { this.el = el; }}>
        {this._renderLevel(props.currentLevelEntity.type, props.currentLevelEntity, props)}
      </div>
    )
  }

  _renderLevel(level, currentLevelEntity, props) {
    let data = props.data;
    let graph = props.graph;
    let entityLabelKey = props.entityLabelKey;
    let children = graph.getChildren(currentLevelEntity.id, data.entities, data.relationships);

    return (
      <div key={`level-${level}`}>
        <p className="level__entity-title">
          {currentLevelEntity[entityLabelKey]} &nbsp;
          <span className="level__entity-title__type">({currentLevelEntity.type})</span>
        </p>

        {_.map(children, e => {
          return (
            <div key={`entity-${e.id}`} className="level__entity__item">
              <ExpandHideListItem entity={e} {...props} />
            </div>
          )
        })}
      </div>
    )
  }



}

export default HierarchicalListSearch

import React, {Component} from 'react'
import * as d3 from 'd3-selection'
import _ from 'lodash'

import './HierarchicalListSearch.scss'


class HierarchicalListSearch extends Component {

  render() {
    let props = this.props;
    let shownLevels = _.dropRightWhile(props.hierarchy, level => props.currentLevelEntity.type !== level)

    return (
      <div className={`xoces-hierarchical-list-search ${props.schemeName}`}>
        {_.map(shownLevels, (level, idx) => this._renderLevel(level, idx, props.data, props.entityLabelKey))}
      </div>
    )
  }

  _renderLevel(level, idx, data, entityLabelKey) {
    let props = this.props;

    return (
      <div key={`level-${idx}`}>
        {_.map(data.entities, e => {
          if (e.type === level) {
            return (
              <div key={`level__entity-${e.id}`}>
                <p className="level__entity-title">{e[entityLabelKey]}</p>
                {this._renderLevelEntities(props.graph.getChildren(e.id, props.data.entities, props.data.relationships))}
              </div>
            )
          }
        })}
      </div>
    )
  }

  _renderLevelEntities(entities) {
    let entityLabelKey = this.props.entityLabelKey;
    console.log('children', entities);

    return (
      <ol className="level-entities">
        {_.map(entities, e => {
          let isSelected = (this.props.selectedEntities.indexOf(e) > -1) ? 'is-selected' : null;

          return (
            <li key={`entity-${e.id}`} className="level__entity__item" onClick={() => this.props.onToggleEntity(e)}>
              <div className="">
                <span className={`level__entity__checkbox ${isSelected}`}></span>
                <span className="level__entity__name">{e[entityLabelKey]}</span>
              </div>
              <p className="level__summary"></p>
            </li>
          )
        })}
      </ol>
    )
  }

}

export default HierarchicalListSearch

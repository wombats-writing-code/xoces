import React, {Component} from 'react'
import * as d3 from 'd3-selection'
import _ from 'lodash'
import pluralize from 'pluralize'

import './ExpandHideListItem.scss'


class ExpandHideListItem extends Component {

  constructor() {
    super();
    this.state = {
      isExpanded: false
    }
  }

  render() {
    let props = this.props;
    let data = props.data;
    let graph = props.graph;
    let entityLabelKey = props.entityLabelKey;
    let currentLevelEntity = props.currentLevelEntity;
    let e = props.entity;

    let idx = props.hierarchy.indexOf(currentLevelEntity.type);
    let gcType = props.hierarchy[idx+2];
    let gc = graph.getChildren(e.id, data.entities, data.relationships);

    let levelSummary;
    let showHideButton;
    if (gcType) {
      levelSummary = (<p className="level__summary">{gc.length} {pluralize(gcType, gc.length)}</p>)
      showHideButton = (
        <button className="button level__show-hide-button"
                onClick={() => this.setState({isExpanded: !this.state.isExpanded})}
          >[{this.state.isExpanded ? 'Less' : 'More'}]
        </button>)
    }

    let grandChildrenList;
    if (this.state.isExpanded && gcType) {
      grandChildrenList = (
        <ol>
          {_.map(gc, model => {
            return (
              <li className="level__entity__grandchild" key={`grandChild-${model.id}`}>
                {model[entityLabelKey]}
              </li>
            )
          })}
        </ol>
      )
    }

    let isSelected = props.selectedEntities.indexOf(e) > -1 ? 'is-selected' : null;

    return (
      <div key={`entity-${e.id}`} className="level__entity__item">
        <div className="flex-container align-center space-between flex-wrap">
          <div className="level__entity-select flex-container align-center" onClick={() => this.props.onToggleEntity(e)}>
            <div className={`level__entity__checkbox ${isSelected}`}></div>
            <span className="level__entity__name">{e[entityLabelKey]}</span>
          </div>
          {showHideButton}
        </div>
        {levelSummary}
        {grandChildrenList}
      </div>
    )
  }
}

export default ExpandHideListItem

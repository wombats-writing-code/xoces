// import { applyMiddleware, compose, createStore } from 'redux'
// import thunk from 'redux-thunk'
// import { browserHistory } from 'react-router'
import _ from 'lodash'
import {SET_CONFIG} from './setConfig'
import graphProvider from '../components/graph'

export const CLICK_SUB_ARC = 'CLICK_SUB_ARC'
export const CLICK_BREADCRUMB = 'CLICK_BREADCRUMB'

export const clickSubArc = (entity) => {
  return {type: CLICK_SUB_ARC, entity}
}

export const clickBreadcrumb = (entity) => {
  return {type: CLICK_BREADCRUMB, entity}
}


let defaultState = {
  breadcrumbs: {
    present: [],
    past: []
  }
};
export default function visReducer(state = defaultState, action) {
  switch(action.type) {

    case SET_CONFIG:
      var graph = graphProvider(action.config.relationship);
      let currentLevelEntity;
      if (action.config.currentLevelEntity) {
        currentLevelEntity = _.find(action.config.data.entities, {id: action.config.currentLevelEntity});

      } else {
        currentLevelEntity = _.find(action.config.data.entities, {type: action.config.hierarchy[0]});
      }

      let chain;
      if (action.config.hierarchy.indexOf(currentLevelEntity.type) === 0) {
        chain = _.concat(state.breadcrumbs.present, currentLevelEntity);
      } else {
        let parents = _.reverse(graph.getParentsAll(currentLevelEntity.id, action.config.data.entities, action.config.data.relationships));
        chain = _.concat(state.breadcrumbs.present, parents, currentLevelEntity);
      }


      var breadcrumbs = _.assign({}, state.breadcrumbs, {
        present: chain
      });

      // console.log('initial breadcrumbs', breadcrumbs)

      return _.assign({}, state, {
        data: action.config.data,
        config: action.config,
        breadcrumbs,
        currentLevelEntity
      })


    case CLICK_SUB_ARC:
      var graph = graphProvider(state.config.relationship);
      var idx = state.config.hierarchy.indexOf(action.entity.type);
      var currentLevel = state.config.hierarchy[idx-1];

      // console.log('state.currentClick', state.currentClick)
      var model = graph.getParent(action.entity.id, state.data.entities, state.data.relationships);

      if (model === _.last(state.breadcrumbs.present)) {
        return state;
      }

      var breadcrumbs = _.assign({}, state.breadcrumbs, {
        present: _.concat(state.breadcrumbs.present, model)
      });

      // console.log('breadcrumbs', breadcrumbs)

      return _.assign({}, state, {
        breadcrumbs,
        currentSubArc: action.entity,
        currentLevelEntity: model
      })

    case CLICK_BREADCRUMB:
      var idx = state.config.hierarchy.indexOf(action.entity.type);
      var currentLevel = state.config.hierarchy[idx];

      // go back to the breadcrumb that was clicked on
      var breadcrumbs = _.assign({}, state.breadcrumbs, {
        present: _.dropRightWhile(state.breadcrumbs.present, crumb => crumb !== action.entity)
      });

      // console.log('breadcrumbs', breadcrumbs)

      return _.assign({}, state, {
        breadcrumbs,
        currentSubArc: null,
        currentLevelEntity: action.entity
      })

    default:
      return state;
  }
}

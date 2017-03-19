// import { applyMiddleware, compose, createStore } from 'redux'
// import thunk from 'redux-thunk'
// import { browserHistory } from 'react-router'
import _ from 'lodash'
import {SET_CONFIG} from './setConfig'
import graphProvider from '../components/graph'

export const CLICK_SUB_ARC = 'CLICK_SUB_ARC'
export const CLICK_BREADCRUMB = 'CLICK_BREADCRUMB'
export const TOGGLE_ENTITY = 'TOGGLE_ENTITY'

export const clickSubArc = (entity) => {
  return {type: CLICK_SUB_ARC, entity}
}

export const clickBreadcrumb = (entity) => {
  return {type: CLICK_BREADCRUMB, entity}
}

export const toggleEntity = (entity) => {
  return {type: TOGGLE_ENTITY, entity}
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
      var data = action.config.data;

      // ====
      // set the current level entity to be the first one in the hierarchy, or the user-provided one
      // ====
      let currentLevelEntity;
      if (action.config.currentLevelEntity) {
        currentLevelEntity = _.find(action.config.data.entities, {id: action.config.currentLevelEntity});

      } else {
        currentLevelEntity = _.find(action.config.data.entities, {type: action.config.hierarchy[0]});
      }

      // =====
      // figure out the breadcrumb chain
      // =====
      let chain;
      if (action.config.hierarchy.indexOf(currentLevelEntity.type) === 0) {
        chain = _.concat(state.breadcrumbs.present, currentLevelEntity);
      } else {
        let parents = _.reverse(graph.getParentsAll(currentLevelEntity.id, data.entities, data.relationships));
        chain = _.concat(state.breadcrumbs.present, parents, currentLevelEntity);
      }

      // ======
      // set the selectedEntities to all of the children of the currentLevelEntity
      // ======

      return _.assign({}, state, {
        data: action.config.data,
        config: action.config,
        breadcrumbs: _.assign({}, state.breadcrumbs, {
          present: chain
        }),
        currentLevelEntity,
        selectedEntities: graph.getChildren(currentLevelEntity.id, data.entities, data.relationships)
      })


    case CLICK_SUB_ARC:
      var graph = graphProvider(state.config.relationship);
      var data = state.config.data;
      var idx = state.config.hierarchy.indexOf(action.entity.type);
      var currentLevel = state.config.hierarchy[idx-1];

      // console.log('state.currentClick', state.currentClick)
      var model = graph.getParent(action.entity.id, state.data.entities, state.data.relationships);
      // if we're at the bottom of the hierarchy, do nothing
      if (model === _.last(state.breadcrumbs.present)) {
        return state;
      }

      // console.log('breadcrumbs', breadcrumbs)

      // ======
      // set the selectedEntities to all of the children of the currentLevelEntity
      // ======
      let selectedEntities = graph.getChildren(currentLevelEntity.id, data.entities, data.relationships)

      return _.assign({}, state, {
        breadcrumbs: _.assign({}, state.breadcrumbs, {
          present: _.concat(state.breadcrumbs.present, model)
        }),
        currentSubArc: action.entity,
        currentLevelEntity: model,
        selectedEntities
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

    case TOGGLE_ENTITY:
      let idx = _.findIndex(state.selectedEntities, action.entity);
      let selected;
      if (idx > -1) {
        // we need at minimum one selected entity. do nothing if the user tries to de-select the last remaining one
        if (state.selectedEntities.length === 1) {
          return state;
        }
        selected = _.reject(state.selectedEntities, e => e.id === action.entity.id )
      } else {
        selected = _.concat(state.selectedEntities, action.entity)
      }

      return _.assign({}, state, {
        selectedEntities: selected
      })

    default:
      return state;
  }
}

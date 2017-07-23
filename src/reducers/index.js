// import { applyMiddleware, compose, createStore } from 'redux'
// import thunk from 'redux-thunk'
// import { browserHistory } from 'react-router'
import _ from 'lodash'
import {SET_CONFIG, SET_CONFIG_TREE} from './setConfig'
import graphProvider from '../components/graph'

export const CLICK_SUB_ARC = 'CLICK_SUB_ARC'
export const CLICK_BREADCRUMB = 'CLICK_BREADCRUMB'
export const CHANGE_VIEW = 'CHANGE_VIEW'
export const TOGGLE_ENTITY = 'TOGGLE_ENTITY'

export const TREE_VIEW = 'TREE_VIEW'
export const CHORD_VIEW = 'CHORD_VIEW'

export const clickSubArc = (entity) => {
  return {type: CLICK_SUB_ARC, entity}
}

export const clickBreadcrumb = (entity) => {
  return {type: CLICK_BREADCRUMB, entity}
}

export const toggleEntity = (entity) => {
  return {type: TOGGLE_ENTITY, entity}
}

export const changeView = (view, entity) => {
  return {type: CHANGE_VIEW, view, entity}
}

let graph;

let defaultConfig = {
  width: '100%',
  height: 500,
  colorScheme: 'dark',
  currentLevelEntity: null,
  view: CHORD_VIEW,
}

let defaultState = {
  breadcrumbs: {
    present: [],
    past: []
  },
  view: CHORD_VIEW
};
export default function visReducer(state = defaultState, action) {
  let config;
  switch(action.type) {

    case SET_CONFIG:
      graph = graphProvider(action.config.relationship);
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
      // console.log('currentLevelEntity', currentLevelEntity, action.config.currentLevelEntity)

      // =====
      // figure out the breadcrumb chain
      // =====
      let chain;
      if (action.config.hierarchy.indexOf(currentLevelEntity.type) === 0) {
        chain = _.concat([], currentLevelEntity);
      } else {
        let parents = _.reverse(graph.getParentsAll(currentLevelEntity.id, data.entities, data.relationships));
        chain = _.concat([], parents, currentLevelEntity);
      }

      // ======
      // set default config
      // ======
      config = _.assign({}, defaultConfig, action.config);

      return _.assign({}, defaultState, {
        config: config,
        breadcrumbs: _.assign({}, defaultState.breadcrumbs, {
          present: chain
        }),
        view: action.config.view || state.view,
        currentLevelEntity,
        selectedEntities: config.view === 'TREE_VIEW' ? graph.getOutgoingEntitiesAll(currentLevelEntity.id, data.entities, data.relationships) : graph.getChildren(currentLevelEntity.id, data.entities, data.relationships)
      })

    case SET_CONFIG_TREE:
      graph = graphProvider(action.config.relationship);
      var data = action.config.data;

      // ======
      // set default config
      // ======
      config = _.assign({}, defaultConfig, action.config);

      return _.assign({}, defaultState, {
        config: config,
      })

    case CLICK_SUB_ARC:
      var data = state.config.data;
      var idx = state.config.hierarchy.indexOf(action.entity.type);
      var currentLevel = state.config.hierarchy[idx-1];
      var model = graph.getParent(action.entity.id, data.entities, data.relationships);

      // if we're at the bottom of the hierarchy, do nothing
      if (model === _.last(state.breadcrumbs.present)) {
        return state;
      }
      // console.log('breadcrumbs', breadcrumbs)
      // console.log('model', model)

      // ======
      // set the selectedEntities to all of the children of the currentLevelEntity
      // ======
      let selectedEntities = graph.getChildren(model.id, data.entities, data.relationships)
      // console.log('selectedEntities', selectedEntities)

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
      var data = state.config.data;

      // go back to the breadcrumb that was clicked on
      var breadcrumbs = _.assign({}, state.breadcrumbs, {
        present: _.dropRightWhile(state.breadcrumbs.present, crumb => crumb !== action.entity)
      });

      if (currentLevel)

      // console.log('breadcrumbs', breadcrumbs)

      return _.assign({}, state, {
        breadcrumbs,
        currentSubArc: null,
        currentLevelEntity: action.entity,
        selectedEntities: graph.getChildren(action.entity.id, data.entities, data.relationships),
        view: idx !== state.config.hierarchy.length-1 ? CHORD_VIEW : state.view
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

    case CHANGE_VIEW:
      return _.assign({}, state, {
        view: action.view
      })

    default:
      return state;
  }
}

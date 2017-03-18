// import { applyMiddleware, compose, createStore } from 'redux'
// import thunk from 'redux-thunk'
// import { browserHistory } from 'react-router'
import {SET_CONFIG} from './setConfig'
import graphProvider from '../components/graph'

export const CLICK_ENTITY = 'CLICK_ENTITY'

export const clickEntity = (entity) => {
  return {type: CLICK_ENTITY, entity}
}


let defaultState = {
  breadcrumbs: {
    present: [],
    past: []
  }
};
export default function visReducer(state = defaultState, action) {
  // console.log('action', action)
  let breadcrumbs;

  switch(action.type) {
    case SET_CONFIG:
      let firstModel = _.find(action.config.data.entities, {type: action.config.hierarchy[0]})

      breadcrumbs = _.assign({}, state.breadcrumbs, {
        present: _.concat(state.breadcrumbs.present, firstModel)
      });

      // console.log('initial breadcrumbs', breadcrumbs)

      return _.assign({}, state, {
        data: action.config.data,
        config: action.config,
        breadcrumbs
      })


    case CLICK_ENTITY:
      let idx = state.config.hierarchy.indexOf(action.entity.model.type);
      let currentLevel = state.config.hierarchy[idx-1];

      let graph = graphProvider(state.config.relationship);
      // console.log('state.currentClick', state.currentClick)
      let model = graph.getParent(action.entity.model.id, state.data.entities, state.data.relationships);

      breadcrumbs = _.assign({}, state.breadcrumbs, {
        present: _.concat(state.breadcrumbs.present, model)
      });

      // console.log('breadcrumbs', breadcrumbs)

      return _.assign({}, state, {
        breadcrumbs,
        currentClick: action.entity,
      })

    default:
      return state;
  }
}

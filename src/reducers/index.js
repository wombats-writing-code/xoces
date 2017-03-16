// import { applyMiddleware, compose, createStore } from 'redux'
// import thunk from 'redux-thunk'
// import { browserHistory } from 'react-router'
import {SET_CONFIG} from './setConfig'

export const CLICK_ENTITY = 'CLICK_ENTITY'

export const clickEntity = (entity) => {
  return {type: CLICK_ENTITY, entity}
}


let defaultState = {};
export default function visReducer(state = defaultState, action) {
  // console.log('action', action)
  switch(action.type) {
    case SET_CONFIG:
      return _.assign({}, state, {
        config: action.config,
        currentLevel: action.config.hierarchy[0]
      })

    case CLICK_ENTITY:
      let idx = state.config.hierarchy.indexOf(action.entity.model.type);
      let currentLevel = state.config.hierarchy[idx];

      return _.assign({}, state, {
        currentClick: action.entity,
        currentLevel: currentLevel
      })

    default:
      return state;
  }
}

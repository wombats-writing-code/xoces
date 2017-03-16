// import { applyMiddleware, compose, createStore } from 'redux'
// import thunk from 'redux-thunk'
// import { browserHistory } from 'react-router'



export const SELECT_SUB_ARC = 'SELECT_SUB_ARC'

export const selectSubArc = (selection) => {
  return {type: SELECT_SUB_ARC, selection}
}


let defaultState = {};
export default function visReducer(state = defaultState, action) {
  switch(action.type) {
    case SELECT_SUB_ARC:
      return _.assign({}, action.selection, {
        currentSubArc: action.selection
      })

    default:
      return state;
  }
}

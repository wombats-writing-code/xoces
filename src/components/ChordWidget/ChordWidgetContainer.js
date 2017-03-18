import { connect } from 'react-redux'
import {clickEntity} from '../../reducers/'
import graphProvider from '../graph'

import ChordWidget from './ChordWidget'

const mapDispatchToProps = (dispatch) => {
  return {
    onClickEntity: d => dispatch(clickEntity(d))
  }
}

const mapStateToProps = (state) => {
  console.log('state in ChordWidgetContainer', state)

  return {
    breadcrumbs: state.breadcrumbs.present,
    currentLevel: getCurrentLevel(state),
    currentLevelEntity: getCurrentLevelEntity(state),
    currentClick: state.currentClick
  }
}

// ====
// selectors
// ======
const getCurrentLevelEntity = (state) => {
  if (state.currentClick) {
    let graph = graphProvider(state.config.relationship);
    // console.log('state.currentClick', state.currentClick, state.currentClick.model[state.config.entityLabelKey]);

    return graph.getParent(state.currentClick.id, state.data.entities, state.data.relationships);
  }

  // console.log('currentLevelEntity', _.find(state.data.entities, {type: state.currentLevel}));

  return _.find(state.data.entities, {type: getCurrentLevel(state)})
}

const getCurrentLevel = (state) => {
  if (state.currentClick) {
    let idx = state.config.hierarchy.indexOf(state.currentClick.model.type);
    let currentLevel = state.config.hierarchy[idx-1];
  }

  return state.config.hierarchy[0];
}

export default connect(mapStateToProps, mapDispatchToProps)(ChordWidget)

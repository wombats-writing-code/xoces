import { connect } from 'react-redux'
import {clickEntity} from '../../reducers/'

import ChordWidget from './ChordWidget'

const mapDispatchToProps = (dispatch) => {
  return {
    onClickEntity: d => dispatch(clickEntity(d))
  }
}

const mapStateToProps = (state) => {
  console.log('state in ChordWidgetContainer', state)

  return {
    currentLevel: getCurrentLevel(state),
    currentClick: state.currentClick
  }
}

const getCurrentLevel = (state) => {
  return state.currentLevel;
}

export default connect(mapStateToProps, mapDispatchToProps)(ChordWidget)

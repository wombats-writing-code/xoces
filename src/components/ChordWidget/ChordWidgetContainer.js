import { connect } from 'react-redux'
import {clickSubArc, clickBreadcrumb} from '../../reducers/'
import graphProvider from '../graph'

import ChordWidget from './ChordWidget'

const mapDispatchToProps = (dispatch) => {
  return {
    onClickSubArc: d => dispatch(clickSubArc(d)),
    onClickBreadcrumb: d => dispatch(clickBreadcrumb(d))
  }
}

const mapStateToProps = (state) => {
  console.log('state in ChordWidgetContainer', state)

  return {
    breadcrumbs: state.breadcrumbs.present,
    currentLevelEntity: getCurrentLevelEntity(state),
  }
}

// ====
// selectors
// ======
const getCurrentLevelEntity = (state) => {
  return state.currentLevelEntity
}


export default connect(mapStateToProps, mapDispatchToProps)(ChordWidget)

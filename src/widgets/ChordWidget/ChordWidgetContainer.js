import { connect } from 'react-redux'
import {clickSubArc, clickBreadcrumb, toggleEntity, changeView} from '../../reducers/'
import ChordWidget from './ChordWidget'
import graphProvider from '../../components/graph/'

const mapDispatchToProps = (dispatch) => {
  return {
    onClickSubArc: d => dispatch(clickSubArc(d)),
    onToggleEntity: d => dispatch(toggleEntity(d)),
    onClickBreadcrumb: d => dispatch(clickBreadcrumb(d)),
  }
}

const mapStateToProps = (state) => {
  // console.log('state in ChordWidgetContainer', state)

  return {
    graph: graphProvider(state.config.relationship),
    breadcrumbs: state.breadcrumbs.present,
    currentLevelEntity: getCurrentLevelEntity(state),
    selectedEntities: state.selectedEntities,
  }
}

// ====
// selectors
// ======
const getCurrentLevelEntity = (state) => {
  return state.currentLevelEntity
}


export default connect(mapStateToProps, mapDispatchToProps)(ChordWidget)

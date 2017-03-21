import { connect } from 'react-redux'
import {clickSubArc, clickBreadcrumb, toggleEntity, changeView} from '../../reducers/'

import XocesWidget from './XocesWidget'

const mapDispatchToProps = (dispatch) => {
  return {
    onClickSubArc: d => dispatch(clickSubArc(d)),
    onToggleEntity: d => dispatch(toggleEntity(d)),
    onClickBreadcrumb: d => dispatch(clickBreadcrumb(d)),
    onChangeView: (view, currentLevelEntity) => dispatch(changeView(view, currentLevelEntity))
  }
}

const mapStateToProps = (state) => {
  console.log('state in XocesWidgetContainer', state)

  return {
    breadcrumbs: state.breadcrumbs.present,
    currentLevelEntity: getCurrentLevelEntity(state),
    selectedEntities: state.selectedEntities,
    view: state.view
  }
}

// ====
// selectors
// ======
const getCurrentLevelEntity = (state) => {
  return state.currentLevelEntity
}


export default connect(mapStateToProps, mapDispatchToProps)(XocesWidget)

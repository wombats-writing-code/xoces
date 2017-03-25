import { connect } from 'react-redux'
import TreeWidget from './TreeWidget'
import graphProvider from '../../components/graph/'

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

const mapStateToProps = (state) => {
  // console.log('state in TreeWidgetContainer', state)

  return {
    graph: graphProvider(state.config.relationship),
    // selectedEntities: state.selectedEntities,
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(TreeWidget)

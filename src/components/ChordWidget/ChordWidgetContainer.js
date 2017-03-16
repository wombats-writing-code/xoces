import { connect } from 'react-redux'
import {selectSubArc} from '../../reducers/'

import ChordWidget from './ChordWidget'

const mapDispatchToProps = (dispatch) => {
  return {
    onClickSubArc: d => dispatch(selectSubArc(d))
  }
}

const mapStateToProps = (state) => {
  console.log('state in ChordWidgetContainer', state)

  return {
    currentSubArc: state.currentSubArc
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ChordWidget)

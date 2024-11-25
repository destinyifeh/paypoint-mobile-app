import ApplicationScene from "./scene"
import { 
  hideNavigator,
  showNavigator
} from '../../../../services/redux/actions/navigation'
import { connect } from 'react-redux'

function mapStateToProps(state) {
  return {
    isNavigatorVisible: state.navigation.isNavigatorVisible,
    // pendingUrl: state.navigation.pendingUrl
  }
}

function mapDispatchToProps(dispatch) {
  return {
    hideNavigator: () => dispatch(hideNavigator()),
    showNavigator: () => dispatch(showNavigator())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationScene);

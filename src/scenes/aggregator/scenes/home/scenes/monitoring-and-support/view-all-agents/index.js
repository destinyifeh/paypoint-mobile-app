import { 
  hideNavigator,
  showNavigator
} from '../../../../../../../services/redux/actions/navigation'
import { connect } from 'react-redux'
import ViewAllAgentsScene from "./scene";
import { updateApplication } from '../../../../../../../services/redux/actions/fmpa-tunnel';

function mapStateToProps(state) {
  return {
    isNavigatorVisible: state.navigation.isNavigatorVisible,
    // pendingUrl: state.navigation.pendingUrl
  }
}

function mapDispatchToProps(dispatch) {
  return {
    hideNavigator: () => dispatch(hideNavigator()),
    showNavigator: () => dispatch(showNavigator()),
    updateApplication: (application) => dispatch(updateApplication(application)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewAllAgentsScene)

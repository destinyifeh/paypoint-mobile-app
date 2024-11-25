import { connect } from 'react-redux';
import { 
  hideNavigator, 
  showNavigator 
} from '../../../../../services/redux/actions/navigation'
import ViewAllRequestsScene from './scene'
import { updateApplication } from '../../../../../services/redux/actions/fmpa-tunnel';

function mapStateToProps(state) {
  return {
    isNavigatorVisible: state.navigation.isNavigatorVisible
  }
}

function mapDispatchToProps(dispatch) {
  return {
    hideNavigator: () => dispatch(hideNavigator()),
    showNavigator: () => dispatch(showNavigator()),
    updateApplication: (application) => dispatch(updateApplication(application)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewAllRequestsScene)

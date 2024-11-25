import { connect } from 'react-redux';
import { updateApplication } from '../../../services/redux/actions/fmpa-tunnel';
import {
  hideNavigator,
  showNavigator
} from '../../../services/redux/actions/navigation';
import SelfOnboardingLandingScene from "./scene";

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

export default connect(mapStateToProps, mapDispatchToProps)(SelfOnboardingLandingScene)

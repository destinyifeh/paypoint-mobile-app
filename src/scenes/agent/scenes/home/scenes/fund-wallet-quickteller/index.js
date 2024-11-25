import { connect } from 'react-redux';
import { 
  hideNavigator, 
  showNavigator 
} from '../../../../../../services/redux/actions/navigation'
import FundWalletQuicktellerScene from './scene'

function mapStateToProps(state) {
  return {
    fundWalletUrl: state.tunnel.remoteConfig.fund_wallet_url,
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

export default connect(mapStateToProps, mapDispatchToProps)(FundWalletQuicktellerScene)

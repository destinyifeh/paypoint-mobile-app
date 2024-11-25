import { connect } from 'react-redux';

import AllApplicationScene from './scene';
import { updateApplication } from '../../../../services/redux/actions/fmpa-tunnel';


function mapDispatchToProps(dispatch) {
  return {
    updateApplication: application => dispatch(updateApplication(application)),
  }
}

export default connect(null, mapDispatchToProps)(AllApplicationScene);

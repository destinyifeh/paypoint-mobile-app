import { connect } from 'react-redux';

import HomeScene from './scene';


function mapStateToProps(state) {
  return {
    screenAfterLogin: state.tunnel.screenAfterLogin
  }
}


export default connect(mapStateToProps, null)(HomeScene);

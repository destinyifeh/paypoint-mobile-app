import SignupScene from "./scene";
import { connect } from "react-redux";


function mapStateToProps(state) {
  return {
    enable_signup: state.tunnel.remoteConfig.enable_signup
  }
}

export default connect(mapStateToProps, null)(SignupScene);

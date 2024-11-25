import { connect } from "react-redux";

import ApplicationScene from "./scene";


function mapStateToProps(state) {
  return {
    remoteConfig: state.tunnel.remoteConfig,
  };
}

export default connect(mapStateToProps, null)(ApplicationScene);

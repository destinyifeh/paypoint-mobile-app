import { connect } from "react-redux";

import MainScene from "./scene";


function mapStateToProps(state) {
  return {
    remoteConfig: state.tunnel.remoteConfig,
  };
}

export default connect(mapStateToProps, null)(MainScene);

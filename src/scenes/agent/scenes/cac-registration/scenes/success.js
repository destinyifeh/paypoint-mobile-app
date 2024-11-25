import React from "react";
import { connect } from "react-redux";
import SuccessModal from "../../../../../fragments/success-modal";
import { View } from "react-native";

class SuccessScene extends React.Component {
  constructor() {
    super();

    this.successConfRef = React.createRef();
    this.state = {};
  }

  componentDidMount() {
    this.successConfRef.current?.open();
  }

  handleModalClose = () => {
    this.successConfRef.current?.close();
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <SuccessModal
          navigation={this.props.navigation}
          successConfRef={this.successConfRef}
          onClosePress={this.handleModalClose}
          screen2={"Agent"}
          message={
            "The payment has been completed successfully. Your business registration will be completed within 2-5 business days."
          }
          source={require("../../../../../animations/checked-done-2.json")}
          successMessage={"Congratulations!"}
          buttonTitle2= {"Continue to Dashboard"}
          show={false}
          show2={true}
        />
      </View>
      //CacUnsuccessfulPayment
    );
  }
}

function mapStateToProps(state) {
  return {
    isFastRefreshPending: state.tunnel.isFastRefreshPending,
    isNavigatorVisible: state.navigation.isNavigatorVisible,
    navigationState: state.tunnel.navigationState,
    screenAfterLogin: state.tunnel.screenAfterLogin,
    remoteConfig: state.tunnel.remoteConfig,
    requeryTransactionBucket: state.tunnel.requeryTransactionBucket,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideNavigator: () => dispatch(hideNavigator()),
    setIsFastRefreshPending: (value) =>
      dispatch(setIsFastRefreshPending(value)),
    setScreenAfterLogin: (screen) => dispatch(setScreenAfterLogin(screen)),
    showNavigator: () => dispatch(showNavigator()),
    navigateTo: (message) => dispatch(navigateTo(message)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SuccessScene);

import React from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import BankAccountBankDetailsPrompt from "../../../../../fragments/cac-bank-account-details";
import PaymentTypePrompt from "../../../../../fragments/payment-type";
import SuccessModal from "../../../../../fragments/success-modal";

class UnsuccessfulPayment extends React.Component {
  constructor() {
    super();

    this.successConfRef = React.createRef();
    this.paymentTypeModalRef = React.createRef();
    this.paymentDetailsModalRef = React.createRef();
    this.state = {};
  }

  componentDidMount() {
    this.successConfRef.current?.open();
  }

  handleModalClose = () => {
    this.successConfRef.current?.close();
  };

  handleTryAgain = () => {
    this.successConfRef.current?.close();
    this.props.navigation.navigate("CacBusinessNameDetails"); //InsufficientFund
  };

  openBankDetails = () => {
    this.paymentTypeModalRef.current?.close();
    this.paymentDetailsModalRef.current?.open();
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
          screen2={"CancelPayment"}
          message={"Your payment was not successful. Kindly try again."}
          source={require("../../../../../animations/14651-error-animation (2).json")}
          successMessage={"Payment Unsuccessful!"}
          buttonTitle1={"Try again"}
          buttonTitle2={"Cancel"}
          show={true}
          onPressDone1={this.handleTryAgain}
          show2={true}
        />

        <PaymentTypePrompt
          paymentTypeModalRef={this.paymentTypeModalRef}
          loading={this.isLoading}
          transfer={this.openBankDetails}
        />

        <BankAccountBankDetailsPrompt
          paymentDetailsModalRef={this.paymentDetailsModalRef}
          accountNo={"2118157849"}
        />
      </View>
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
)(UnsuccessfulPayment);

import React from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import BankAccountBankDetailsPrompt from "../../../../../fragments/cac-bank-account-details";
import FundingWalletOptionsMenu from "../../../../../fragments/funding-wallet-options-menu";
import PaymentTypePrompt from "../../../../../fragments/payment-type";
import SuccessModal from "../../../../../fragments/success-modal";

class InsufficientFund extends React.Component {
  constructor() {
    super();

    this.successConfRef = React.createRef();
    this.paymentTypeModalRef = React.createRef();
    this.paymentDetailsModalRef = React.createRef();
    this.state = {
      screenShown: "cacRegistration",
    };
    this.showWalletFundingOptions = this.showWalletFundingOptions.bind(this);
    this.onFundWalletPress = this.onFundWalletPress.bind(this);
  }

  componentDidMount() {
    this.successConfRef.current?.open();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("ROUTE NOW", this.props);
    if (this.props.navigationState.currentScreen !== "InsufficientFund") {
      this.successConfRef.current?.close();
    } else if (
      this.props.navigationState.currentScreen === "InsufficientFund"
    ) {
      this.successConfRef.current?.open();
    }
    this.fundingWalletOptionsMenu.close();
  }

  handleModalClose = () => {
    this.successConfRef.current?.close();
  };

  openPaymentTypeModal = () => {
    this.paymentTypeModalRef.current?.open();
  };

  onFundWalletPress() {
    // this.successConfRef.current?.close();
    this.fundingWalletOptionsMenu.open();
  }

  openBankDetails = () => {
    // this.paymentTypeModalRef.current?.close();
    this.paymentDetailsModalRef.current?.open();
  };

  showWalletFundingOptions() {
    this.fundingWalletOptionsMenu.open();
  }

  requestClose() {
    this.fundingWalletOptionsMenu.close();
    this.successConfRef.current?.open();
  }

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
          screen1={"Agent"}
          screen2={"CancelPayment"}
          message={"Funds insufficient to process this payment."}
          source={require("../../../../../animations/14651-error-animation (2).json")}
          successMessage={"Insufficient Funds!"}
          buttonTitle1={"Fund Now"}
          buttonTitle2={"Pay Later"}
          show={true}
          show2={true}
          onPressDone1={this.onFundWalletPress}
        />

        <FundingWalletOptionsMenu
          navigation={this.props.navigation}
          ref_={(component) => (this.fundingWalletOptionsMenu = component)}
          requestClose={() => this.fundingWalletOptionsMenu.close()}
          screenShown={this.state.screenShown}
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
)(InsufficientFund);

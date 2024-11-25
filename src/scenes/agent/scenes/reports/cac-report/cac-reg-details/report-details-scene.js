import React from "react";
import { ToastAndroid, View } from "react-native";
// import { BusinessName } from '../forms/business-name-form'
import { ScrollView } from "react-native";
import { Icon } from "react-native-elements";
import { connect } from "react-redux";
import Header from "../../../../../../components/header";
import {
  COLOUR_BLUE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_SIZE_TITLE,
} from "../../../../../../constants/styles";
import { CacReportForm as ReportFormCacReportFormCac } from "./report-form";

class ReportDetailsCac extends React.Component {
    requiredFields = ["proposedBusinessName", "lineOfBusiness"];
  constructor() {
    super();

    this.state = {
      form: {},
      invalidFields: [],
      isLoading: false,
      lineOfBusiness: null,
      proposedBusinessName: null,
      buttonDisabled: true,
      invalidName: false,
      cacRegType: null,
    };
  }

  componentDidMount() {
    this.checkFormValidity()

  }

  checkFormValidity() {
    const formIsComplete = this.reportForm.state.isComplete;
    const formIsValid = this.reportForm.state.isValid;

    if (!(formIsComplete && formIsValid)) {
      return;
    }

    this.setState({
      propagateFormErrors: true,
      lineOfBusiness: this.businessNameForm.state.form.lineOfBusiness,
      proposedBusinessName: this.businessNameForm.state.form
        .proposedBusinessName,
      buttonDisabled: false,
      isLoading: true,
    });

    return true;
  }

  showToastPendingStatus = () => {
    ToastAndroid.showWithGravityAndOffset(
      "Successful!",
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50
    );
  };

  render() {
    return (
      <View
        style={{
          backgroundColor: COLOUR_WHITE,
          flex: 1,
        }}
      >
        <Header
          containerStyle={{
            backgroundColor: COLOUR_BLUE,
          }}
          leftComponent={
            <Icon
              color={COLOUR_WHITE}
              underlayColor="transparent"
              name="chevron-left"
              size={40}
              type="material"
              onPress={() =>
                // this.props.navigation.navigate("AgentUpgradeLanding")
                this.props.navigation.replace("Agent")
              }
            />
          }
          navigationIconColor={COLOUR_WHITE}
          statusBarProps={{
            backgroundColor: "transparent",
            barStyle: CONTENT_LIGHT,
          }}
          title={`CAC Registration`}
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: "bold",
            fontSize: FONT_SIZE_TITLE,
          }}
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          withNavigator={this.props.withNavigator}
        />

        <ScrollView>
          <View
            style={{
              backgroundColor: COLOUR_WHITE,
              flex: 1,
            }}
          >
            {/* <AgentBusinessNameAgentBusinessName
                propagateFormErrors={this.state.propagateFormErrors}
                ref={(form) => (this.businessNameForm = form)}
                superAgents={this.props.superAgents}
                onPress={() => this.initiateCacRegistration()}
                loading={this.state.isLoading}
                // validName={true}
              /> */}
            <ReportFormCacReportFormCac
              propagateFormErrors={this.state.propagateFormErrors}
              ref={(form) => (this.reportForm = form)}
              superAgents={this.props.superAgents}
            />

            <View style={{ paddingHorizontal: 20 }}>
              {/* <Button
                  onPress={() => this.initiateCacRegistration()}
                  title="Next"
                  loading={this.state.isLoading}
                  buttonStyle={{ backgroundColor: COLOUR_BLUE }}
                  containerStyle={{
                    backgroundColor: COLOUR_BLUE,
                    width: "100%",
                  }}
                  disabled={this.state.buttonDisabled}
                /> */}
            </View>
          </View>
        </ScrollView>
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
)(ReportDetailsCac);

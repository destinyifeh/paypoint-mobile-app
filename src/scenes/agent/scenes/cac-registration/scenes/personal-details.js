import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Icon } from "react-native-elements";
import { connect } from "react-redux";
import Header from "../../../../../components/header";
import {
  COLOUR_BLUE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_SIZE_TITLE,
} from "../../../../../constants/styles";
import { saveData } from "../../../../../utils/storage";
import ProgressBar from "../../../../aggregator/components/progress-bar";
import { PersonalDetailsForm as AgentPersonalDetailsAgentPersonalDetails } from "../forms/personal-details";

class PersonalDetails extends React.Component {
  constructor() {
    super();

    this.state = {
      form: {},
      invalidFields: [],
      isLoading: false,
    };
  }

  componentDidMount() {
    const cacRegPersonalForm = this.personalDetailsForm.state.form;
    console.log("NAVIGATE2", cacRegPersonalForm);
  }

  rewriteDateFormat(dateStr) {
    // Split the input date by the hyphen
    const [day, month, year] = dateStr.split("-");
    // Return the date in the format "YYYY-MM-DD"
    return `${year}-${month}-${day}`;
  }

  async navigate() {
    const cacRegPersonalForm = this.personalDetailsForm.state.form;
    console.log("NAVIGATE2", cacRegPersonalForm);
    await saveData("cacRegPersonalFormData", cacRegPersonalForm);
    this.props.navigation.replace("CacKycDetails");
  }
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
                this.props.navigation.navigate("CacBusinessNameDetails")
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

        <ProgressBar step="1" size="3" />

        <ScrollView>
          <View
            style={{
              backgroundColor: COLOUR_WHITE,
              flex: 1,
            }}
          >
            <AgentPersonalDetailsAgentPersonalDetails
              propagateFormErrors={this.state.propagateFormErrors}
              ref={(form) => (this.personalDetailsForm = form)}
              superAgents={this.props.superAgents}
              onPress={() => this.navigate()}
              loading={this.state.isLoading}
            />

            <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
              {/* <Button
                onPress={() => this.navigate()}
                title="Next"
                loading={this.state.isLoading}
                buttonStyle={{ backgroundColor: COLOUR_BLUE }}
                containerStyle={{
                  backgroundColor: COLOUR_BLUE,
                  width: "100%",
                }}
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
)(PersonalDetails);

const styles = StyleSheet.create({});

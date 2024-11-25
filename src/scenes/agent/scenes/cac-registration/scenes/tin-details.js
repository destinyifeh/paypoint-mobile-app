import React from "react";
import { StyleSheet, View } from "react-native";
// import { BusinessName } from '../forms/business-name-form'
import { ScrollView, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import Button from "../../../../../components/button";
import Header from "../../../../../components/header";
import Text from "../../../../../components/text";
import {
  COLOUR_BLUE,
  COLOUR_LINK_BLUE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_FAMILY_BODY_BOLD,
  FONT_SIZE_TITLE,
} from "../../../../../constants/styles";
import ProgressBar from "../../../../aggregator/components/progress-bar";
import { TinForm as AgentTinDetailsAgentTinDetails } from "../forms/tin-form";

class TinDetails extends React.Component {
  constructor() {
    super();

    this.state = {
      form: {},
      invalidFields: [],
      isLoading: false,
    };
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

        <ProgressBar step="1" size="7" />

        <ScrollView>
          <View
            style={{
              backgroundColor: COLOUR_WHITE,
              flex: 1,
            }}
          >
            <AgentTinDetailsAgentTinDetails
              propagateFormErrors={this.state.propagateFormErrors}
              ref={(form) => (this.tinForm = form)}
              superAgents={this.props.superAgents}
            />

            <View style={{ paddingHorizontal: 20 }}>
              <Button
                onPress={() =>
                  this.props.navigation.navigate("CacBusinessNameDetails")
                }
                title="Next"
                loading={this.state.isLoading}
                buttonStyle={{ backgroundColor: COLOUR_BLUE }}
                containerStyle={{
                  backgroundColor: COLOUR_BLUE,
                  width: "100%",
                }}
              />
            </View>

            <View
              style={{
                paddingTop: 20,
                alignItems: "center",
              }}
            >
              <Text>Not registered with a CAC before?</Text>
            </View>
            <View
              style={{
                alignItems: "center",
                paddingTop: 10,
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("CacBusinessNameDetails")
                }
              >
                <Text
                  style={{
                    color: COLOUR_LINK_BLUE,
                    fontSize: 16,
                    marginLeft: 3,
                    fontFamily: FONT_FAMILY_BODY_BOLD,
                  }}
                >
                  Click here
                </Text>
                <Text
                  style={{
                    color: COLOUR_LINK_BLUE,
                    fontSize: 16,
                    marginLeft: 3,
                    fontFamily: FONT_FAMILY_BODY_BOLD,
                  }}
                />
              </TouchableOpacity>
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
)(TinDetails);

const styles = StyleSheet.create({});

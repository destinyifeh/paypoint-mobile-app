import React from "react";
import {
  ScrollView,
  View
} from "react-native";
import { connect } from "react-redux";

import { Icon } from "react-native-elements";
import Button from "../../../components/button";
import ClickableListItem from "../../../components/clickable-list-item";
import Header from "../../../components/header";
import Text from "../../../components/text";
import {
  COLOUR_BLUE,
  COLOUR_GREEN,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_SIZE_TITLE
} from "../../../constants/styles";
import Onboarding from "../../../services/api/resources/onboarding";
import Platform from "../../../services/api/resources/platform";
import {
  resetApplication,
  updateApplication,
} from "../../../services/redux/actions/fmpa-tunnel";
import {
  hideNavigator,
  showNavigator,
} from "../../../services/redux/actions/navigation";
import { setIsFastRefreshPending } from "../../../services/redux/actions/tunnel";


const ItemRow = (props) => {

  return <ClickableListItem
    disabled={props.disabled}
    style={{
      alignItems: 'center',
      flexDirection: 'row',
      opacity: props.disabled ? .4 : 1,
      paddingLeft: 20,
      paddingTop: 10,
      paddingBottom: 10,
      borderWidth: 1,
      borderRadius: 5,
      borderColor: '#cccccc',
      marginBottom: 15
    }}
    onPressOut={props.onPressOut}
  >
    <View style={{ flex: 1 }}>
      <Text bold>{props.title}</Text>
      <Text>{props.subTitle}</Text>
    </View><Icon
      color={COLOUR_GREEN}
      name={props.completed ? "check-circle" : "circle"}
      size={18}
      type="feather"
    /><View
      style={{ marginRight: 15 }} />

  </ClickableListItem>;
}

class SelfOnboardingLandingScene extends React.Component {
  onboarding = new Onboarding();
  platform = new Platform();

  constructor() {
    super();

    this.state = {
      accept: false,
      animationsDone: false,
      isLoading: false,
      selfOnboarding: false,
      slide: "PERSONAL INFORMATION",
      superAgents: [],
      application: {}
    };

  }

  componentDidMount() {

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
              onPress={() => this.props.navigation.goBack()}
            />
          }
          navigationIconColor={COLOUR_WHITE}
          statusBarProps={{
            backgroundColor: "transparent",
            barStyle: CONTENT_LIGHT,
          }}
          title="Setup New Agent"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: "bold",
            fontSize: FONT_SIZE_TITLE,
          }}
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          withNavigator={this.props.withNavigator}
        />

        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            padding: 15,
          }}
        >
          <ScrollView>

            <View
              style={{
                elevation: 10,
                marginLeft: 20,
                marginRight: 20,
                border: '5px solid red',
                'border-radius': '8px',
              }}>
              <Text style={margin = 20}>The following details below are required to setup agent</Text>
            </View>
            <View
              style={{
                elevation: 10,
                justifyContent: "space-evenly",
                // height: 35,
                margin: 20,
                border: '5px solid red',
                'border-radius': '8px',
              }}
            >

              <ItemRow
                colors={['#6FEBF5', '#0BBDE0']}
                style={{
                  marginBottom: 30
                }}
                title="Personal Details"
                subTitle="Provide agent's personal details"
                completed={this.state.application.applicantDetails}
                onPressOut={() => this.state.selfOnboarding == true? this.props.navigation.replace("SelfOnboardingPreSetupAgent", {
                  selfOnboarding: true,
                }) : this.props.navigation.replace("SelfOnboardingPreSetupAgent")}
              />

              <ItemRow
                colors={['#6FEBF5', '#0BBDE0']}
                style={{
                  marginBottom: 30
                }}
                title="KYC Information"
                subTitle="Kindly provide agent's documentation"
                disabled
                // disabled={!this.state.application.applicantDetails}
                completed={this.state.application.applicantDetails?.identificationType}
                onPressOut={() => this.props.navigation.replace("SelfOnboardingKYCScene")}
              />

              <ItemRow
                colors={['#6FEBF5', '#0BBDE0']}
                style={{
                  marginBottom: 30
                }}
                title="Business Details"
                subTitle="Tell us about agent's business"
                disabled
                // disabled={!this.state.application.applicantDetails?.identificationType}
                completed={this.state.application.businessDetails}
                onPressOut={() => this.props.navigation.replace("SelfOnboardingBusinessScene")}
              />

              <ItemRow
                colors={['#6FEBF5', '#0BBDE0']}
                style={{
                  marginBottom: 30
                }}
                title="Next of Kin Details"
                subTitle="Kindly provide agent's next of kin"
                disabled
                // disabled={!this.state.application.businessDetails}
                completed={this.state.application.nextOfKin || this.state.application?.applicantDetails?.nextOfKin}
                onPressOut={() => this.props.navigation.replace("SelfOnboardingNOKScene")}
              />
            </View>

          </ScrollView>

          <Button
           containerStyle={{
            backgroundColor: COLOUR_BLUE,
          }}
            loading={this.state.isLoading}
            onPress={() => this.props.navigation.replace("SelfOnboardingPreSetupAgent")}
            title="CONTINUE"
          />
        </View>
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    application: state.fmpaTunnel.application,
    isNavigatorVisible: state.navigation.isNavigatorVisible,
    pendingApplication: state.pendingApplication,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideNavigator: () => dispatch(hideNavigator()),
    setIsFastRefreshPending: (value) =>
      dispatch(setIsFastRefreshPending(value)),
    showNavigator: () => dispatch(showNavigator()),
    resetApplication: () => dispatch(resetApplication()),
    updateApplication: (application) =>
      dispatch(updateApplication(application)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelfOnboardingLandingScene);

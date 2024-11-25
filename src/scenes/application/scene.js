import React from "react";
import {
  ActivityIndicator,
  InteractionManager,
  ToastAndroid,
  View,
} from "react-native";
import Header from "../../components/header";
import ProgressBar from "../../components/progress-bar";
import {
  COLOUR_BLUE,
  COLOUR_DARK_RED,
  CONTENT_LIGHT,
  COLOUR_WHITE,
  FONT_SIZE_TITLE,
} from "../../constants/styles";
import BusinessInformation from "./tabs/business-information";
import NextOfKinInformation from "./tabs/next-of-kin-information";
import BvnVerification from "./tabs/bvn-verification";
import PersonalInformation from "./tabs/personal-information";
import Hyperlink from "../../components/hyperlink";
import Onboarding from "../../services/api/resources/onboarding";
import { loadData, saveData } from "../../utils/storage";
import ApplicationSerializer from "../../utils/serializers/application";
import { APPLICATION } from "../../constants";
import { SUCCESS_STATUS } from "../../constants/api";
import Text from "../../components/text";
import { flashMessage } from "../../utils/dialog";
import { BLOCKER } from "../../constants/dialog-priorities";
import DisabledScene from "../misc/disabled-scene";
import ClickableListItem from "../../components/clickable-list-item";
import Platform from "../../services/api/resources/platform";

export default class ApplicationScene extends React.Component {
  onboarding = new Onboarding();
  platform = new Platform();

  constructor() {
    super();

    this.state = {
      animationsDone: false,
      application: {},
      isLoading: true,
      slide: "",
      superAgents: [],
      title: "Application Form",
    };

    this.fetchSuperAgents = this.fetchSuperAgents.bind(this);
    this.onSaveAsDraft = this.onSaveAsDraft.bind(this);
    this.onSkip = this.onSkip.bind(this);
    this.setTitle = this.setTitle.bind(this);
    this.onSubmitBusinessInformation = this.onSubmitBusinessInformation.bind(
      this
    );
    this.onSubmitNextOfKinInformation = this.onSubmitNextOfKinInformation.bind(
      this
    );
    this.onSubmitBvnVerification = this.onSubmitBvnVerification.bind(this);
    this.onSubmitPersonalInformation = this.onSubmitPersonalInformation.bind(
      this
    );
    this.refreshApplication = this.refreshApplication.bind(this);
    this.renderForms = this.renderForms.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });
    });

    this.refreshApplication();
    this.fetchSuperAgents();
  }

  async fetchSuperAgents() {
    const { response, status } = await this.platform.retrieveSuperAgents();

    console.log({ response, status });

    if (status === SUCCESS_STATUS) {
      this.setState({
        superAgents: response,
      });

      return;
    }

    return;
  }

  renderForms(application) {
    const serializedApplication = new ApplicationSerializer(application);

    console.log("SERIALIZED APPLICATION", serializedApplication);

    if (serializedApplication.applicantDetails.bvn) {
      this.setState({
        slide: "PERSONAL INFORMATION",
      });
    }

    if (serializedApplication.isApplicantDetailsComplete) {
      this.setState({
        slide: "BUSINESS INFORMATION",
      });
    }

    if (serializedApplication.isBusinessDetailsComplete) {
      this.setState({
        slide: "NEXT OF KIN INFORMATION",
      });
    }

    if (
      serializedApplication.isNextOfKinDetailsComplete &&
      serializedApplication.isSubmitted
    ) {
      this.setState({
        slide: null,
      });
    }

    if (serializedApplication.isDeclined) {
      this.setState({
        slide: "PERSONAL INFORMATION",
      });
    }

    if (!serializedApplication.applicantDetails.bvn) {
      this.setState({
        slide: "BVN VERIFICATION",
      });
    }
  }

  async refreshApplication() {
    const application = JSON.parse(await loadData(APPLICATION));
    const response = await this.onboarding.getApplicationById(
      application.applicationId
    );

    const responseStatus = response.status;
    const responseObj = response.response;

    console.log("ON REFRESH APPLICATION", responseObj);

    if (responseStatus === SUCCESS_STATUS) {
      this.setState({
        application: responseObj,
        isLoading: false,
      });

      await saveData(APPLICATION, responseObj);

      this.renderForms(responseObj);
    }

    this.setState({
      isLoading: false,
    });
  }

  async onSkip() {
    flashMessage(null, "Saving Application...");

    let didErrorOccur = false;

    if (this.personalInformation) {
      didErrorOccur = !(await this.personalInformation.onSave());
    }

    if (this.businessInformation) {
      console.log(await this.businessInformation.onSave());
    }

    if (this.nextOfKinInformation) {
      console.log(await this.nextOfKinInformation.onSave());
    }

    this.props.navigation.navigate("Agent", { refresh: true });

    flashMessage(null, "Saved successfully!");

    return;
  }

  get toShowBusinessInformation() {
    return this.state.slide === "BUSINESS INFORMATION";
  }

  get toShowNextOfKinInformation() {
    return this.state.slide === "NEXT OF KIN INFORMATION";
  }

  get toShowBvnVerification() {
    return this.state.slide === "BVN VERIFICATION";
  }

  get toShowPersonalInformation() {
    return this.state.slide === "PERSONAL INFORMATION";
  }

  onSaveAsDraft() {
    this.props.navigation.navigate("Agent");
  }

  onSubmitBvnVerification() {
    this.setState({
      title: null,
      slide: "PERSONAL INFORMATION",
    });
  }

  onSubmitBusinessInformation() {
    this.setState({
      slide: "NEXT OF KIN INFORMATION",
    });
  }

  onSubmitNextOfKinInformation() {
    console.log("ON SUBMIT NEXT OF KIN");
    this.props.navigation.replace("ApplicationPreview");
  }

  onSubmitPersonalInformation() {
    this.setState({
      slide: "BUSINESS INFORMATION",
    });
  }

  setTitle(title) {
    this.setState({
      title,
    });
  }

  render() {
    const serializedApplication = new ApplicationSerializer(
      this.state.application
    );
    const isOnboardingDisabled = !this.props.remoteConfig.enable_onboarding;

    if (isOnboardingDisabled) {
      return (
        <DisabledScene
          navigation={this.props.navigation}
          sceneName="Onboarding features"
          withBackButton
        />
      );
    }

    if (!this.state.animationsDone || this.state.isLoading) {
      return (
        <View
          style={{ alignItems: "center", flex: 1, justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color={COLOUR_BLUE} />
        </View>
      );
    }

    if (this.state.slide === null) {
      console.log("REDIRECTING...");
      this.props.navigation.navigate("Agent");
      return <React.Fragment />;
    }

    const skipButton = <Hyperlink onPress={this.onSkip}>Save</Hyperlink>;

    return (
      <View style={{ flex: 1 }}>
        <Header
          containerStyle={{
            backgroundColor: COLOUR_BLUE,
          }}
          rightComponent={!this.toShowBvnVerification && skipButton}
          statusBarProps={{
            backgroundColor: "transparent",
            barStyle: CONTENT_LIGHT,
          }}
          title={this.state.title ? this.state.title : "Application Form"}
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: "bold",
            fontSize: FONT_SIZE_TITLE,
          }}
        />

        {serializedApplication.isDeclined && (
          <ClickableListItem
            onPress={() => {
              flashMessage(
                "Reason for Decline",
                `This application was declined because of the following reasons: ${
                  serializedApplication.declineReason
                }`,
                BLOCKER
              );
            }}
            style={{
              backgroundColor: COLOUR_DARK_RED,
              borderRadius: 8,
              margin: 8,
              padding: 16,
            }}
          >
            <Text bold white>
              Your application was declined on{" "}
              {serializedApplication.formattedDeclineDate}.
            </Text>
            <Text small white>
              Tap to see why.
            </Text>
          </ClickableListItem>
        )}

        <ProgressBar
          styleAttr="Horizontal"
          indeterminate={false}
          progress={0.2}
        />

        {/* <Carousel animate={false} hideIndicators={true}> */}
        {this.toShowBvnVerification && (
          <BvnVerification
            superAgents={this.state.superAgents}
            onSubmit={this.onSubmitBvnVerification}
            setTitle={this.setTitle}
            ref={(input) => (this.bvnVerification = input)}
          />
        )}
        {this.toShowPersonalInformation && (
          <PersonalInformation
            onSave={this.onSaveAsDraft}
            onSubmit={this.onSubmitPersonalInformation}
            ref={(input) => (this.personalInformation = input)}
          />
        )}
        {this.toShowBusinessInformation && (
          <BusinessInformation
            onBack={() => this.setState({ slide: "PERSONAL INFORMATION" })}
            onSave={this.onSaveAsDraft}
            onSubmit={this.onSubmitBusinessInformation}
            ref={(input) => (this.businessInformation = input)}
          />
        )}
        {this.toShowNextOfKinInformation && (
          <NextOfKinInformation
            onBack={() => this.setState({ slide: "BUSINESS INFORMATION" })}
            onSave={this.onSaveAsDraft}
            onSubmit={this.onSubmitNextOfKinInformation}
            ref={(input) => (this.nextOfKinInformation = input)}
          />
        )}
        {/* </Carousel> */}
      </View>
    );
  }
}

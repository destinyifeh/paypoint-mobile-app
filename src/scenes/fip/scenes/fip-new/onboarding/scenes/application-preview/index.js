import React from "react";
import {
  ActivityIndicator,
  BackHandler,
  InteractionManager,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import { connect } from "react-redux";
import Accordion from "../../../../../../../components/accordion";
import Button from "../../../../../../../components/button";
import ClickableListItem from "../../../../../../../components/clickable-list-item";
import Header from "../../../../../../../components/header";
import ProgressiveImage from "../../../../../../../components/progressive-image";
import CustomText from "../../../../../../../components/text";
import { APPLICATION, NIGERIA } from "../../../../../../../constants";
import {
  ERROR_STATUS,
  SUCCESS_STATUS,
} from "../../../../../../../constants/api";
import { DOCUMENT_BASE_URL } from "../../../../../../../constants/api-resources";
import { BLOCKER } from "../../../../../../../constants/dialog-priorities";
import {
  COLOUR_BLUE,
  COLOUR_DARK_RED,
  COLOUR_GREY,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_SIZE_TITLE,
} from "../../../../../../../constants/styles";
import CountriesStatesLgas from "../../../../../../../fixtures/countries_states_lgas";
import {
  resetApplication,
  updateApplication,
} from "../../../../../../../services/redux/actions/fmpa-tunnel";
import {
  hideNavigator,
  showNavigator,
} from "../../../../../../../services/redux/actions/navigation";
import { setIsFastRefreshPending } from "../../../../../../../services/redux/actions/tunnel";
import {
  onboardingService,
  platformService,
} from "../../../../../../../setup/api";
import { flashMessage } from "../../../../../../../utils/dialog";
import ApplicationSerializer from "../../../../../../../utils/serializers/application";
import { deleteData } from "../../../../../../../utils/storage";
import styles from "../../styles";
const EditableHeader = (props) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text style={[styles.previewTitleText, { marginTop: 0, flex: 1 }]}>
        {props.label}
      </Text>
      <ClickableListItem onPressOut={() => props.onPressOut()}>
        <Text style={{ color: "#00425F" }}>Edit</Text>
      </ClickableListItem>
    </View>
  );
};
class FipAgentApplicationPreviewScene extends React.Component {
  constructor() {
    super();

    this.state = {
      accept: false,
      animationsDone: false,
      application: {},
      isLoading: false,
      showSuccessModal: false,
      isReady: true,
      application: null,
      superAgents: [],
      refreshing: false,
      attachments: null,
      uploadedAttachments: [],
    };

    this.loadApplicationToState = this.loadApplicationToState.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.fetchSuperAgents = this.fetchSuperAgents.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }
  handleBackButtonPress = () => {
    this.props.navigation.navigate("HomeTabs");
    return true;
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });
    });
    this.loadApplicationToState();
    this.fetchSuperAgents();
    this.checkIncomingRoute();
    this.refreshApplication();

    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonPress
    );
  }
  componentWillUnmount() {
    this.backHandler.remove();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.application !== prevProps.application) {
      const { application } = this.props;
      const businessInformationAttachments = this.serializeDocumentApiData(
        this.props.application.documentsList || []
      );

      this.setState({
        application,
        uploadedAttachments: businessInformationAttachments,
      });
    }
  }
  checkIncomingRoute = () => {
    console.log(this.props.navigationState.previousScreen, "routeee");
    if (this.props.navigationState.previousScreen === "Login") {
      this.props.navigation.replace("HomeTabs");
      return;
    }
  };

  async loadApplicationToState() {
    const { application } = this.props;
    console.log("APPLICATION IS: ", application);

    const businessInformationAttachments = this.serializeDocumentApiData(
      application?.documentsList || []
    );
    console.log("uploaded BUS UPLOAD: ", businessInformationAttachments);

    this.setState({
      application,
      uploadedAttachments: businessInformationAttachments,
    });
  }

  async fetchSuperAgents() {
    const { response, status } = await platformService.retrieveSuperAgents();

    console.log(response, "super ag");

    if (status === SUCCESS_STATUS) {
      this.setState({
        superAgents: response,
      });

      return;
    }

    return;
  }

  refreshApplication = async () => {
    this.setState({ refreshing: true });

    try {
      const { response, status } = await onboardingService.getMyApplicationById(
        this.props.application.applicationId || 10251
      );
      console.log(response, "onrefresh res...");

      if (status === ERROR_STATUS) {
        this.setState({ refreshing: false });

        return;
      }
      const businessInformationAttachments = this.serializeDocumentApiData(
        response.documentsList || []
      );
      this.props.updateApplication(response);

      this.setState({
        application: response,
        uploadedAttachments: businessInformationAttachments,
        refreshing: false,
      });
    } catch (err) {
      console.log(err, "refresh err");
      this.setState({ refreshing: false });
    }
  };

  async onRefresh() {
    try {
      await this.refreshApplication();
    } catch (err) {
      console.log(err, "onrefresh error");
    }
  }

  serializeDocumentApiData = (attachments) => {
    return attachments.map((value) => {
      const basePath = "/data/inclusio/finch-onboarding-service";

      return {
        hasBeenUploaded: true,
        uri: value.documentLink
          ? value.documentLink.replace(basePath, DOCUMENT_BASE_URL)
          : value?.uri || null,
        fileName: value.documentName,
        documentName: value.documentType,
        documentType: value.documentType,
        documentExtention: value.documentExtention,
        lastModified: new Date().getTime(),
      };
    });
  };

  clearCacheData = async () => {
    await deleteData(APPLICATION);
  };
  get businessDetails() {
    const businessDetails = this.state.application
      ? this.state.application.businessDetails
      : {};

    return (
      <View style={styles.PreviewSection}>
        <EditableHeader
          onPressOut={() =>
            this.props.navigation.replace("FipAgentBusinessInformation", {
              isFromApplicationPreview: true,
            })
          }
          label="Business Name"
        />
        <Text style={styles.previewDescText}>
          {businessDetails?.businessName}
        </Text>

        <Text style={styles.previewTitleText}>Business Address</Text>
        <Text style={styles.previewDescText}>{businessDetails?.address}</Text>

        {/* <Text style={styles.previewTitleText}>Business Type</Text>
        <Text style={styles.previewDescText}>
          {businessDetails?.businessType}
        </Text> */}

        <Text style={styles.previewTitleText}>Account Number</Text>
        <Text style={styles.previewDescText}>
          {businessDetails?.accountNumber}
        </Text>
        <Text style={styles.previewTitleText}>Bank Name</Text>
        <Text style={styles.previewDescText}>{businessDetails?.bankName}</Text>
        <Text style={styles.previewTitleText}>Account Name</Text>
        <Text style={styles.previewDescText}>
          {businessDetails?.accountName}
        </Text>
        <Text style={[styles.previewTitleText, { marginBottom: 5 }]}>
          Uploaded Documents:
        </Text>

        {/* <Text>{"\n"}</Text> */}

        {this.state.uploadedAttachments?.map((attachment, index) => {
          if (attachment) {
            return (
              <View>
                <Text style={styles.previewDescText}>
                  {attachment?.documentType}
                </Text>
                <View
                  key={index}
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  {attachment?.documentExtention === "photo" ||
                  attachment?.documentExtention === "png" ||
                  attachment?.documentExtention === "jpg" ||
                  attachment?.documentExtention === "jpeg" ? (
                    <ProgressiveImage
                      key={attachment.uri}
                      thumbnailSource={{ uri: attachment.uri }}
                      source={{
                        uri: `${attachment.uri}?lastModified=${
                          attachment.lastModified
                        }`,
                      }}
                      style={{
                        height: 75,
                        width: 75,
                        borderRadius: 5,
                      }}
                      resizeMode="cover"
                    />
                  ) : (
                    <Icon
                      color={COLOUR_GREY}
                      name="file-text"
                      size={75}
                      type="feather"
                    />
                  )}
                  <Text style={styles.previewDescText}>
                    {"\n"}
                    {attachment?.documentExtention === "jpg" ||
                    attachment?.documentExtention === "png" ||
                    attachment?.documentExtention === "jpeg"
                      ? "photo"
                      : "pdf"}
                  </Text>
                </View>
                <View style={{ height: 5 }} />
              </View>
            );
          }
          return null;
        })}
      </View>
    );
  }

  get nextOfKinDetails() {
    const NextOfKinInformation = this.state.application
      ? this.state.application.nextOfKin
      : {};

    return (
      <View style={styles.PreviewSection}>
        <EditableHeader
          onPressOut={() =>
            this.props.navigation.replace("FipAgentNextOfKinInformation", {
              isFromApplicationPreview: true,
            })
          }
          label="First Name"
        />

        <Text style={styles.previewDescText}>
          {NextOfKinInformation?.firstName}
        </Text>

        <Text style={styles.previewTitleText}>Last Name</Text>
        <Text style={styles.previewDescText}>
          {NextOfKinInformation?.surname}
        </Text>

        <Text style={styles.previewTitleText}>Phone Number</Text>
        <Text style={styles.previewDescText}>
          {NextOfKinInformation?.phoneNumber}
        </Text>

        <Text style={styles.previewTitleText}>Gender</Text>
        <Text style={styles.previewDescText}>
          {NextOfKinInformation?.gender}
        </Text>
        <Text style={styles.previewTitleText}>Relationship</Text>
        <Text style={styles.previewDescText}>
          {NextOfKinInformation?.relationship}
        </Text>
        <Text style={styles.previewTitleText}>Address</Text>
        <Text style={styles.previewDescText}>
          {NextOfKinInformation?.address}
        </Text>
      </View>
    );
  }

  get personalDetails() {
    const personalInformation = this.state.application
      ? this.state.application.applicantDetails
      : {};
    const aggregator = this.state.superAgents
      ? this.state.superAgents.find(
          (aggregator) =>
            aggregator.referralCode === this.state.application?.referralCode
        )
      : null;
    console.log(aggregator, "aggreee");
    return (
      <View style={styles.PreviewSection}>
        <EditableHeader
          onPressOut={() =>
            this.props.navigation.replace("FipAgentPersonalInformation", {
              isFromApplicationPreview: true,
            })
          }
          label="First Name"
        />

        <Text style={styles.previewDescText}>
          {personalInformation?.firstName}
        </Text>

        <Text style={styles.previewTitleText}>Middle Name</Text>
        <Text style={styles.previewDescText}>
          {personalInformation?.middleName}
        </Text>

        <Text style={styles.previewTitleText}>Last Name</Text>
        <Text style={styles.previewDescText}>
          {personalInformation?.surname}
        </Text>

        <Text style={styles.previewTitleText}>BVN Phone Number</Text>
        <Text style={styles.previewDescText}>
          {personalInformation?.bvnPhoneNumber}
        </Text>

        <Text style={styles.previewTitleText}>Email Address</Text>
        <Text style={styles.previewDescText}>
          {personalInformation?.emailAddress}
        </Text>

        <Text style={styles.previewTitleText}>Date of Birth</Text>
        <Text style={styles.previewDescText}>{personalInformation?.dob}</Text>

        <Text style={styles.previewTitleText}>Gender</Text>
        <Text style={styles.previewDescText}>
          {personalInformation?.gender}
        </Text>

        <Text style={styles.previewTitleText}>Preferred Wallet Number</Text>
        <Text style={styles.previewDescText}>
          {personalInformation?.walletPhoneNumber}
        </Text>

        <Text style={styles.previewTitleText}>Place of Birth</Text>
        <Text style={styles.previewDescText}>
          {personalInformation?.placeOfBirth}
        </Text>

        <Text style={styles.previewTitleText}>Mother's Maiden Name</Text>
        <Text style={styles.previewDescText}>
          {personalInformation?.mothersMaidenName}
        </Text>

        {/* <Text style={styles.previewTitleText}>Aggregator</Text>
        <Text style={styles.previewDescText}>{aggregator?.businessName}</Text>

        <Text style={styles.previewTitleText}>Agent Class</Text>
        <Text style={styles.previewDescText}>
          {this.state.application?.agentTypeId === 4 ? "Agent" : "Super Agent"}
        </Text> */}
      </View>
    );
  }

  get residentialDetails() {
    const residentialInformation = this.state.application
      ? this.state.application?.applicantDetails
      : {};

    const country = CountriesStatesLgas?.find(
      (value) => value?.name === NIGERIA
    );
    const state = country?.states?.find(
      (value) => value.id == residentialInformation?.state
    );
    const lga = state?.lgas?.find(
      (value) => value.id == residentialInformation?.localGovernmentArea
    );

    return (
      <View style={styles.PreviewSection}>
        <EditableHeader
          onPressOut={() =>
            this.props.navigation.replace("FipAgentResidentialInformation", {
              isFromApplicationPreview: true,
            })
          }
          label="Nationality"
        />

        <Text style={styles.previewDescText}>{country?.name}</Text>
        <Text style={styles.previewTitleText}>State</Text>
        <Text style={styles.previewDescText}>{state?.name}</Text>

        <Text style={styles.previewTitleText}>LGA</Text>
        <Text style={styles.previewDescText}>{lga?.name}</Text>

        <Text style={styles.previewTitleText}>Address</Text>
        <Text style={styles.previewDescText}>
          {residentialInformation?.address}
        </Text>

        <Text style={styles.previewTitleText}>Closest Landmark</Text>
        <Text style={styles.previewDescText}>
          {residentialInformation?.closestLandMark}
        </Text>
      </View>
    );
  }

  async onSubmit() {
    this.setState({
      isLoading: true,
    });

    try {
      const { application } = this.props;
      const applicationId = application.applicationId;
      console.log(applicationId, "my applicatin Id");

      const {
        status,
        response,
        code,
      } = await onboardingService.submitFipApplication(applicationId);

      const { firstName, surname } = application.applicantDetails;

      console.log({ status, response, code }, "SUBMIT RES...");

      if (status === ERROR_STATUS) {
        flashMessage(
          null,
          response?.response?.description
            ? response.response.description
            : "Oops! Something went wrong. Please try again"
        );
        this.setState({
          isLoading: false,
        });

        return;
      }

      this.clearCacheData();
      this.props.resetApplication();
      this.setState({
        isLoading: false,
      });
      this.props.navigation.navigate("FipAgentSubmitApplicationSuccess");
    } catch (err) {
      console.log(err, "Final submission error");
      this.setState({
        isLoading: false,
      });
    }
  }
  render() {
    const serializedApplication = new ApplicationSerializer(
      this.props.application
    );
    if (!this.state.animationsDone || this.state.refreshing) {
      return (
        <View
          style={{ alignItems: "center", flex: 1, justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color={COLOUR_BLUE} />
        </View>
      );
    }

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
              onPress={this.handleBackButtonPress}
            />
          }
          navigationIconColor={COLOUR_WHITE}
          // rightComponent={skipButton}
          // rightComponent={this.toShowSkipButton ? skipButton : null}
          statusBarProps={{
            backgroundColor: "transparent",
            barStyle: CONTENT_LIGHT,
          }}
          title="Application Preview"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: "bold",
            fontSize: FONT_SIZE_TITLE,
          }}
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          withNavigator={this.props.withNavigator}
        />

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          <View
            style={{
              flex: 1,
              width: "90%",
              alignSelf: "center",
              marginTop: 30,
            }}
          >
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
                <CustomText bold white>
                  This application was declined on{" "}
                  {serializedApplication.formattedDeclineDate}.
                </CustomText>
                <CustomText small white>
                  Tap to see why.
                </CustomText>
              </ClickableListItem>
            )}
            <Accordion
              content={this.personalDetails}
              expanded={true}
              header="Personal Details"
            />
            <Accordion
              content={this.businessDetails}
              expanded={false}
              header="Business Details"
            />
            <Accordion
              content={this.residentialDetails}
              expanded={false}
              header="Residential Address"
            />
            <Accordion
              content={this.nextOfKinDetails}
              expanded={false}
              header="Next of Kin Details"
            />
            <Button
              loading={this.state.isLoading}
              onPress={this.onSubmit}
              title="Submit"
              containerStyle={{
                marginVertical: 15,
                backgroundColor: "#00425F",
              }}
              buttonStyle={{ backgroundColor: "#00425F" }}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    application: state.fmpaTunnel.application,
    isNavigatorVisible: state.navigation.isNavigatorVisible,
    pendingApplication: state.pendingApplication,
    navigationState: state.tunnel.navigationState,
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
)(FipAgentApplicationPreviewScene);

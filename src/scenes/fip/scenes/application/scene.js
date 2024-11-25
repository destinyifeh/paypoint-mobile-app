import React from 'react';
import {ActivityIndicator, InteractionManager, View} from 'react-native';
import {connect} from 'react-redux';

import {Icon} from 'react-native-elements';
import ClickableListItem from '../../../../components/clickable-list-item';
import Header from '../../../../components/header';
import Hyperlink from '../../../../components/hyperlink';
import ProgressBar from '../../../../components/progress-bar';
import Text from '../../../../components/text';
import {AGENT_TYPE_ID} from '../../../../constants';
import {ERROR_STATUS, SUCCESS_STATUS} from '../../../../constants/api';
import {BLOCKER} from '../../../../constants/dialog-priorities';
import {
  COLOUR_BLUE,
  COLOUR_DARK_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_SIZE_TITLE,
} from '../../../../constants/styles';
import Onboarding from '../../../../services/api/resources/onboarding';
import Platform from '../../../../services/api/resources/platform';
import {
  resetApplication,
  updateApplication,
} from '../../../../services/redux/actions/fmpa-tunnel';
import {
  hideNavigator,
  showNavigator,
} from '../../../../services/redux/actions/navigation';
import {setIsFastRefreshPending} from '../../../../services/redux/actions/tunnel';
import {flashMessage} from '../../../../utils/dialog';
import handleErrorResponse from '../../../../utils/error-handlers/api';
import ApplicationSerializer from '../../../../utils/serializers/application';
import BusinessInformation from './tabs/business-information';
import BvnVerification from './tabs/bvn-verification';
import NextOfKinInformation from './tabs/next-of-kin-information';
import PersonalInformation from './tabs/personal-information';

class ApplicationScene extends React.Component {
  onboarding = new Onboarding();
  platform = new Platform();

  constructor() {
    super();

    this.state = {
      animationsDone: false,
      application: {
        agentTypeId: AGENT_TYPE_ID,
        applicantDetails: {
          nextOfKin: {},
        },
        businessDetails: {},
        howYouHeardAboutUs: 'Referred by an Agent',
      },
      isLoading: false,
      slide: '',
      title: '',
      superAgents: [],
    };

    this.onboardingScreenContent = this.onboardingScreenContent.bind(this);
    this.onSaveAsDraft = this.onSaveAsDraft.bind(this);
    this.onSkip = this.onSkip.bind(this);
    this.onSubmitBusinessInformation =
      this.onSubmitBusinessInformation.bind(this);
    this.onSubmitBvnVerification = this.onSubmitBvnVerification.bind(this);
    this.onSubmitNextOfKinInformation =
      this.onSubmitNextOfKinInformation.bind(this);
    this.onSubmitPersonalInformation =
      this.onSubmitPersonalInformation.bind(this);
    this.refreshApplication = this.refreshApplication.bind(this);
    this.setTitle = this.setTitle.bind(this);
    this.renderForms = this.renderForms.bind(this);
  }

  componentDidMount() {
    const byPassRefresh = this.props.route?.params?.byPassRefresh || false;

    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });
    });

    byPassRefresh
      ? this.renderForms(this.props.application)
      : this.refreshApplication().then(() => {
          this.renderForms(this.props.application);
        });

    this.fetchSuperAgents();
  }

  async refreshApplication() {
    this.setState({
      isLoading: true,
    });

    const {response, status} = await this.onboarding.getApplicationById(
      this.props.application.applicationId,
    );

    this.setState({
      isLoading: false,
    });

    if (status === ERROR_STATUS) {
      flashMessage(null, await handleErrorResponse(response), BLOCKER);

      return;
    }

    this.props.updateApplication(response);
  }

  async fetchSuperAgents() {
    const {response, status} = await this.platform.retrieveSuperAgents();

    if (status === SUCCESS_STATUS) {
      this.setState({
        superAgents: response,
      });

      return;
    }

    return;
  }

  renderForms() {
    const serializedApplication = new ApplicationSerializer(
      this.props.application,
    );

    if (serializedApplication.applicantDetails.bvn) {
      this.setState({
        slide: 'PERSONAL INFORMATION',
      });
    }

    if (serializedApplication.isApplicantDetailsComplete) {
      this.setState({
        slide: 'BUSINESS INFORMATION',
      });
    }

    if (serializedApplication.isBusinessDetailsComplete) {
      this.setState({
        slide: 'NEXT OF KIN INFORMATION',
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
        slide: 'PERSONAL INFORMATION',
      });
    }

    if (!serializedApplication.applicantDetails.bvn) {
      this.setState({
        slide: 'BVN VERIFICATION',
      });
    }
  }

  async onSkip() {
    flashMessage(null, 'Saving Application...');

    if (this.personalInformation) {
      console.log(await this.personalInformation.onSave());
    }

    if (this.businessInformation) {
      console.log(await this.businessInformation.onSave());
    }

    if (this.nextOfKinInformation) {
      console.log(await this.nextOfKinInformation.onSave());
    }

    flashMessage(null, 'Saved successfully!');

    return;
  }

  get toShowBusinessInformation() {
    return this.state.slide === 'BUSINESS INFORMATION';
  }

  get toShowNextOfKinInformation() {
    return this.state.slide === 'NEXT OF KIN INFORMATION';
  }

  get toShowBvnVerification() {
    return this.state.slide === 'BVN VERIFICATION';
  }

  get toShowPersonalInformation() {
    return this.state.slide === 'PERSONAL INFORMATION';
  }

  onSaveAsDraft() {
    this.props.setIsFastRefreshPending(true);
  }

  onSubmitBvnVerification() {
    this.setState({
      title: null,
      slide: 'PERSONAL INFORMATION',
    });
  }

  onSubmitBusinessInformation(modifiedApplication) {
    this.props.updateApplication(modifiedApplication);
    this.props.setIsFastRefreshPending(true);

    this.setState({
      slide: 'NEXT OF KIN INFORMATION',
    });
  }

  onSubmitNextOfKinInformation() {
    console.log('ON SUBMIT NEXT OF KIN');
    this.props.navigation.replace('ApplicationPreview');
    this.props.setIsFastRefreshPending(true);
  }

  onSubmitPersonalInformation(modifiedApplication) {
    this.props.updateApplication(modifiedApplication);
    this.setState({
      slide: 'BUSINESS INFORMATION',
    });
  }

  get toShowSkipButton() {
    return this.state.slide !== 'PERSONAL INFORMATION';
  }

  loadingIndicator() {
    return (
      <View style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
        <ActivityIndicator size="large" color={COLOUR_BLUE} />
      </View>
    );
  }

  onboardingScreenContent() {
    const serializedApplication = new ApplicationSerializer(
      this.props.application,
    );

    return (
      <React.Fragment>
        {serializedApplication.isDeclined && (
          <ClickableListItem
            onPress={() => {
              flashMessage(
                'Reason for Decline',
                `This application was declined because of the following reasons: ${serializedApplication.declineReason}`,
                BLOCKER,
              );
            }}
            style={{
              backgroundColor: COLOUR_DARK_RED,
              borderRadius: 8,
              margin: 8,
              padding: 16,
            }}>
            <Text bold white>
              This application was declined on{' '}
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

        {this.toShowBvnVerification && (
          <BvnVerification
            application={this.props.application}
            superAgents={this.state.superAgents}
            onSubmit={this.onSubmitBvnVerification}
            setTitle={this.setTitle}
            ref={input => (this.bvnVerification = input)}
          />
        )}
        {this.toShowPersonalInformation && (
          <PersonalInformation
            application={this.props.application}
            onSave={this.onSaveAsDraft}
            onSubmit={this.onSubmitPersonalInformation}
            ref={input => (this.personalInformation = input)}
            superAgents={this.state.superAgents}
            updateApplication={this.props.updateApplication}
          />
        )}
        {this.toShowBusinessInformation && (
          <BusinessInformation
            application={this.props.application}
            onBack={() => this.setState({slide: 'PERSONAL INFORMATION'})}
            onSave={this.onSaveAsDraft}
            onSubmit={this.onSubmitBusinessInformation}
            ref={input => (this.businessInformation = input)}
            updateApplication={this.props.updateApplication}
          />
        )}
        {this.toShowNextOfKinInformation && (
          <NextOfKinInformation
            application={this.props.application}
            onBack={() => this.setState({slide: 'BUSINESS INFORMATION'})}
            onSave={this.onSaveAsDraft}
            onSubmit={this.onSubmitNextOfKinInformation}
            ref={input => (this.nextOfKinInformation = input)}
            updateApplication={this.props.updateApplication}
          />
        )}
      </React.Fragment>
    );
  }

  setTitle(title) {
    this.setState({
      title,
    });
  }

  render() {
    const content =
      !this.state.animationsDone || this.state.isLoading
        ? this.loadingIndicator
        : this.onboardingScreenContent;

    if (this.state.slide === null) {
      return <React.Fragment />;
    }

    const skipButton = <Hyperlink onPress={this.onSkip}>Save</Hyperlink>;

    return (
      <View
        style={{
          backgroundColor: COLOUR_WHITE,
          flex: 1,
        }}>
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
          rightComponent={!this.toShowBvnVerification && skipButton}
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_LIGHT,
          }}
          title={this.state.title ? this.state.title : 'Application'}
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
            fontSize: FONT_SIZE_TITLE,
          }}
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          withNavigator={this.props.withNavigator}
        />

        {content()}
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
    setIsFastRefreshPending: value => dispatch(setIsFastRefreshPending(value)),
    showNavigator: () => dispatch(showNavigator()),
    resetApplication: () => dispatch(resetApplication()),
    updateApplication: application => dispatch(updateApplication(application)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationScene);

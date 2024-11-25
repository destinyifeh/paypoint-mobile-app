import React from 'react'
import {
  ActivityIndicator,
  InteractionManager,
  View
} from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';

import Header from '../../../../../../components/header';
import ProgressBar from '../../../../../../components/progress-bar';
import {
  COLOUR_BLUE,
  CONTENT_LIGHT,
  COLOUR_WHITE,
  FONT_SIZE_TITLE
} from '../../../../../../constants/styles';
import BusinessInformation from './tabs/business-information';
import NextOfKinInformation from './tabs/next-of-kin-information';
import PersonalInformation from './tabs/personal-information';
import Hyperlink from '../../../../../../components/hyperlink';
import Onboarding from '../../../../../../services/api/resources/onboarding';
import ApplicationSerializer from '../../../../../../utils/serializers/application';
import { AGENT_TYPE_ID } from '../../../../../../constants';
import { flashMessage } from '../../../../../../utils/dialog';
import {
  hideNavigator,
  showNavigator
} from '../../../../../../services/redux/actions/navigation';
import { updateApplication, resetApplication } from '../../../../../../services/redux/actions/fmpa-tunnel';
import { BLOCKER } from '../../../../../../constants/dialog-priorities';


class PreSetupAgentScene extends React.Component {
  onboarding = new Onboarding();

  constructor() {
    super()

    this.state = {
      animationsDone: false,
      application: {
        agentTypeId: AGENT_TYPE_ID,
        applicantDetails: {
          nextOfKin: {}
        },
        businessDetails: {},
        howYouHeardAboutUs: 'Referred by an Agent',
      },
      isLoading: false,
      slide: 'PERSONAL INFORMATION'
    };

    this.onSaveAsDraft = this.onSaveAsDraft.bind(this);
    this.onSkip = this.onSkip.bind(this);
    this.onSubmitBusinessInformation = this.onSubmitBusinessInformation.bind(this);
    this.onSubmitNextOfKinInformation = this.onSubmitNextOfKinInformation.bind(this);
    this.onSubmitPersonalInformation = this.onSubmitPersonalInformation.bind(this);
    this.renderForms = this.renderForms.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true
      });
    });

    this.renderForms(this.props.application);
  }

  renderForms() {
    const serializedApplication = new ApplicationSerializer(
      this.props.application
    );

    console.log('SERIALIZED APPLICATION', serializedApplication);

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

    if (serializedApplication.isNextOfKinDetailsComplete && serializedApplication.isSubmitted) {
      this.setState({
        slide: null,
      });
    }
  }

  async onSkip() {

    flashMessage(
      null,
      'Saving Application...',
    )

    if (this.personalInformation) {
      console.log(await this.personalInformation.onSave())
    }

    if (this.businessInformation) {
      console.log(await this.businessInformation.onSave())
    }

    if (this.nextOfKinInformation) {
      console.log(await this.nextOfKinInformation.onSave())
    }

    flashMessage(
      null,
      'Saved successfully!',
    )

    return;
  }

  get toShowBusinessInformation() {
    return this.state.slide === 'BUSINESS INFORMATION';
  }

  get toShowNextOfKinInformation() {
    return this.state.slide === 'NEXT OF KIN INFORMATION';
  }

  get toShowPersonalInformation() {
    return this.state.slide === 'PERSONAL INFORMATION';
  }

  onSaveAsDraft() {
    // this.props.navigation.navigate('Agent');
  }

  onSubmitBusinessInformation(modifiedApplication) {
    this.props.updateApplication(modifiedApplication);

    this.setState({
      slide: 'NEXT OF KIN INFORMATION'
    });
  }

  onSubmitNextOfKinInformation(modifiedApplication) {
    this.props.resetApplication();
    this.setState({
      slide: 'PERSONAL INFORMATION',
    });

    flashMessage(
      'Success',
      'Application was submitted successfully!',
      BLOCKER
    )
  }

  onSubmitPersonalInformation(modifiedApplication) {
    this.props.updateApplication(modifiedApplication);
    this.setState({
      slide: 'BUSINESS INFORMATION'
    });
  }

  get toShowSkipButton() {
    return this.state.slide !== 'BUSINESS INFORMATION'
  }

  render() {
    if (!this.state.animationsDone || this.state.isLoading) {
      return <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={COLOUR_BLUE} />
      </View>
    }

    if (this.state.slide === null) {
      console.log('REDIRECTING...');
      // this.props.navigation.navigate('Agent');
      // this.props.navigation.navigate('HomeTabs');
      return <React.Fragment />
    }

    const skipButton = (
      <Hyperlink onPress={this.onSkip}>
        Save
      </Hyperlink>
    );

    return <View
      style={{
        backgroundColor: COLOUR_WHITE,
        flex: 1
      }}
    >
      <Header
        containerStyle={{
          backgroundColor: COLOUR_BLUE
        }}
        leftComponent={<Icon
          color={COLOUR_WHITE}
          underlayColor="transparent"
          name="chevron-left"
          size={40}
          type="material"
          onPress={() => this.props.navigation.goBack()}
        />}
        navigationIconColor={COLOUR_WHITE}
        rightComponent={this.toShowSkipButton ? skipButton : null}
        statusBarProps={{
          backgroundColor: 'transparent',
          barStyle: CONTENT_LIGHT
        }}
        title="Pre-Setup Agent"
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: 'bold',
          fontSize: FONT_SIZE_TITLE
        }}
        hideNavigationMenu={this.props.hideNavigator}
        showNavigationMenu={this.props.showNavigator}
        withNavigator={this.props.withNavigator}
      />

      <ProgressBar
        styleAttr="Horizontal"
        indeterminate={false}
        progress={0.2}
      />

      {this.toShowPersonalInformation && <PersonalInformation
        application={this.props.application}
        onSave={this.onSaveAsDraft}
        onSubmit={this.onSubmitPersonalInformation}
        ref={input => this.personalInformation = input}
        updateApplication={this.props.updateApplication}
      />}
      {this.toShowBusinessInformation && <BusinessInformation
        application={this.props.application}
        onBack={() => this.setState({ slide: 'PERSONAL INFORMATION' })}
        onSave={this.onSaveAsDraft}
        onSubmit={this.onSubmitBusinessInformation}
        ref={input => this.businessInformation = input}
        updateApplication={this.props.updateApplication}
      />}
      {this.toShowNextOfKinInformation && <NextOfKinInformation
        application={this.props.application}
        onBack={() => this.setState({ slide: 'BUSINESS INFORMATION' })}
        onSave={this.onSaveAsDraft}
        onSubmit={this.onSubmitNextOfKinInformation}
        ref={input => this.nextOfKinInformation = input}
        updateApplication={this.props.updateApplication}
      />}
    </View>
  }
}

function mapStateToProps(state) {
  return {
    application: state.fmpaTunnel.application,
    isNavigatorVisible: state.navigation.isNavigatorVisible,
    pendingApplication: state.pendingApplication,
    // pendingUrl: state.navigation.pendingUrl
  }
}

function mapDispatchToProps(dispatch) {
  return {
    hideNavigator: () => dispatch(hideNavigator()),
    showNavigator: () => dispatch(showNavigator()),
    resetApplication: () => dispatch(resetApplication()),
    updateApplication: (application) => dispatch(
      updateApplication(application)
    ),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PreSetupAgentScene);

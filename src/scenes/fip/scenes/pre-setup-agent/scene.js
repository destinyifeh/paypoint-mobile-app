import React from 'react';
import {Alert, InteractionManager, ScrollView, View} from 'react-native';
import {connect} from 'react-redux';

import {Icon} from 'react-native-elements';
import Button from '../../../../components/button';
import Header from '../../../../components/header';
import Hyperlink from '../../../../components/hyperlink';
import Modal from '../../../../components/modal';
import Text from '../../../../components/text';
import {AGENT_TYPE_ID} from '../../../../constants';
import {ERROR_STATUS, SUCCESS_STATUS} from '../../../../constants/api';
import {
  COLOUR_BLUE,
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
import navigationService from '../../../../utils/navigation-service';
import ApplicationSerializer from '../../../../utils/serializers/application';
import PreSetupAgentForm from './forms/pre-setup-agent-form';
class PreSetupAgentScene extends React.Component {
  onboarding = new Onboarding();
  platform = new Platform();

  constructor() {
    super();

    this.state = {
      accept: false,
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
      showSuccessModal: false,
      slide: 'PERSONAL INFORMATION',
      superAgents: [],
    };

    this.fetchSuperAgents = this.fetchSuperAgents.bind(this);
    this.onCompleteSetupPress = this.onCompleteSetupPress.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });
    });

    this.fetchSuperAgents();
  }

  async fetchSuperAgents() {
    const {response, status} = await this.platform.retrieveSuperAgents();

    console.log({response, status});

    if (status === SUCCESS_STATUS) {
      this.setState({
        superAgents: response,
      });

      return;
    }

    return;
  }

  checkFormValidity() {
    const formIsComplete = this.form.state.isComplete;
    const formIsValid = this.form.state.isValid;

    console.log({formIsComplete, formIsValid});

    if (!formIsComplete) {
      this.setState({
        isLoading: false,
        propagateFormErrors: true,
      });

      return;
    }

    return true;
  }

  async createApplication(application) {
    this.setState({
      isLoading: true,
    });

    const {code, response, status} = await this.onboarding.createApplication(
      application,
    );

    console.log({code, response});

    if (status === ERROR_STATUS) {
      flashMessage(null, await handleErrorResponse(response));
      this.setState({
        isLoading: false,
      });

      return;
    }

    this.serializedApplication = new ApplicationSerializer(response);
    this.props.setIsFastRefreshPending(true);

    this.setState({
      showSuccessModal: true,
      isLoading: false,
    });
  }

  showAlert(title, message) {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'Logout',
          onPress: () => navigationService.replace('Logout'),
        },
        {
          text: 'Try Again',
          onPress: () => {},
          style: 'cancel',
        },
      ],

      {cancelable: false},
    );
  }

  showTheAlert(title, message, application) {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'Continue',
          onPress: () => {
            this.createApplication(application);
          },
        },
        {
          text: 'Try Again',
          onPress: () => {},
          style: 'cancel',
        },
      ],

      {cancelable: false},
    );
  }

  async onSubmit() {
    this.setState({
      errorMessage: null,
    });

    const isFormValid = this.checkFormValidity();

    if (!isFormValid) {
      return;
    }

    this.setState({
      isLoading: true,
    });

    const serializedForm = this.form.serializeFormData();

    console.log({serializedForm});
    const {firstName, surname, phoneNumber, bvn, dob} = serializedForm;

    const agentData = {
      bvnFirstName: firstName,
      bvnLastName: surname,
      bvnPhoneNumber: phoneNumber,
      agentPhoneNumber: phoneNumber,
      bvnNumber: bvn,
      bvnDateOfBirth: dob,
    };
    const saveAsDraftResponse = await this.platform.verifyBvn(agentData);
    const saveAsDraftResponseStatus = saveAsDraftResponse.status;
    const saveAsDraftResponseObj = saveAsDraftResponse.response;

    const application = {
      agentTypeId: serializedForm.agentType,
      applicantDetails: serializedForm,
      howYouHeardAboutUs: 'Referred by an Agent',
      referralCode: serializedForm.referralCode,
    };
    const updateApplicationForm = application;
    updateApplicationForm.applicantDetails = {
      ...application.applicantDetails,
      bvnVerificationStatus: saveAsDraftResponseObj.validationStatus,
    };

    if (saveAsDraftResponseStatus === ERROR_STATUS) {
      this.setState({
        description: saveAsDraftResponseObj.description,
        message: saveAsDraftResponseObj.message,
        isLoading: false,
      });
      this.showAlert(
        'BVN Validation Failed',
        saveAsDraftResponseObj
          ? this.state.message || this.state.description
          : '',
      );
    } else if (saveAsDraftResponseObj.validationStatus === 'NOT_VERIFIED') {
      this.setState({
        message: saveAsDraftResponseObj.message,
        isLoading: false,
      });
      this.showAlert('BVN Validation Failed', this.state.message);
      return;
    } else if (saveAsDraftResponseObj.validationStatus === 'VERIFIED') {
      return this.createApplication(application);
    } else {
      this.showAlert('Error', 'Something went wrong. Please try again.');
    }
  }

  get successModal() {
    return (
      <Modal
        onRequestClose={() => {
          this.form.clear();
          this.props.navigation.replace('PreSetupAgent');
        }}
        buttons={[
          {
            onPress: () => {
              this.form.clear();
              this.setState({showSuccessModal: false});
              this.props.navigation.replace('PreSetupAgent');
            },
            buttonStyle: {
              paddingHorizontal: 10,
            },
            containerStyle: {
              paddingHorizontal: 10,
              width: '100%',
            },
            title: 'Pre-Setup Another Agent',
          },
        ]}
        content={
          <View style={{flex: 0.6, justifyContent: 'center'}}>
            <Text big center>
              Application has been created!
            </Text>
            <Text center>
              You can{' '}
              <Hyperlink onPress={this.onCompleteSetupPress}>
                complete setup
              </Hyperlink>{' '}
              or
            </Text>
          </View>
        }
        image={require('../../../../assets/media/images/clap.png')}
        isModalVisible={true}
        size="md"
        title="Success"
        withButtons
      />
    );
  }

  onCompleteSetupPress() {
    this.setState({
      showSuccessModal: false,
    });

    this.props.updateApplication(this.serializedApplication);
    this.props.navigation.navigate('Application');
  }

  render() {
    const {superAgents} = this.state;

    // if (!this.state.animationsDone) {
    //   return (
    //     <View
    //       style={{ alignItems: "center", flex: 1, justifyContent: "center" }}
    //     >
    //       <ActivityIndicator size="large" color={COLOUR_BLUE} />
    //     </View>
    //   );
    // }

    const skipButton = <Hyperlink onPress={this.onSkip}>Save</Hyperlink>;

    return (
      <View
        style={{
          backgroundColor: COLOUR_WHITE,
          flex: 1,
        }}>
        {this.state.showSuccessModal && this.successModal}

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
          // rightComponent={skipButton}
          // rightComponent={this.toShowSkipButton ? skipButton : null}
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_LIGHT,
          }}
          title="Pre-Setup Agent"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
            fontSize: FONT_SIZE_TITLE,
          }}
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          withNavigator={this.props.withNavigator}
        />

        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            padding: 15,
          }}>
          <ScrollView>
            <PreSetupAgentForm
              isDisabled={this.state.isLoading}
              propagateFormErrors={this.state.propagateFormErrors}
              ref={form => (this.form = form)}
              superAgents={superAgents}
            />
          </ScrollView>

          <Button
            loading={this.state.isLoading}
            onPress={this.onSubmit}
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
    // pendingUrl: state.navigation.pendingUrl
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

export default connect(mapStateToProps, mapDispatchToProps)(PreSetupAgentScene);

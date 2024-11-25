import React from 'react';
import {
  ActivityIndicator,
  BackHandler,
  InteractionManager,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {connect} from 'react-redux';

import {Icon} from 'react-native-elements';
import Button from '../../../../../../../components/button';
import Header from '../../../../../../../components/header';
import Hyperlink from '../../../../../../../components/hyperlink';
import {AGENT_TYPE_ID, APPLICATION} from '../../../../../../../constants';
import {ERROR_STATUS, SUCCESS_STATUS} from '../../../../../../../constants/api';
import {
  COLOUR_BLACK,
  COLOUR_BLUE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_FAMILY_BODY_SEMIBOLD,
  FONT_SIZE_TITLE,
} from '../../../../../../../constants/styles';
import Onboarding from '../../../../../../../services/api/resources/onboarding';
import Platform from '../../../../../../../services/api/resources/platform';
import {
  resetApplication,
  updateApplication,
} from '../../../../../../../services/redux/actions/fmpa-tunnel';
import {
  hideNavigator,
  showNavigator,
} from '../../../../../../../services/redux/actions/navigation';
import {setIsFastRefreshPending} from '../../../../../../../services/redux/actions/tunnel';
import {onboardingService} from '../../../../../../../setup/api';
import {flashMessage} from '../../../../../../../utils/dialog';
import sanitizePhoneNumber from '../../../../../../../utils/sanitizers/phone-number';
import {deleteData, saveData} from '../../../../../../../utils/storage';
import FipProgressBar from '../../components/fip-progress-bar';
import {VerifyWalletPhone} from '../../components/verify-wallet-phone';
import FipPersonalDetailsAgentForm from './personal-details-form';

class FipAgentPersonalDetailsScene extends React.Component {
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
      isFromApplicationPreview: null,
      kycId: null,
      showOtpModal: false,
      otpResponse: {},
      isSendingOtp: false,
      validatedData: {},
    };

    this.fetchSuperAgents = this.fetchSuperAgents.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleBackButtonPress = () => {
    return true;
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });
    });
    this.fetchSuperAgents();
    this.checkIncomingRoute();
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonPress,
    );
    const {
      isFromApplicationPreview,
      kycId,
      bvnData: fipAgentValidatedDetails,
    } = this.props.route.params || {};

    console.log(fipAgentValidatedDetails, 'data bvn');
    console.log(kycId, 'person kycid');
    this.setState({
      isFromApplicationPreview: isFromApplicationPreview,
      kycId: kycId,
      validatedData: fipAgentValidatedDetails,
    });
  }
  componentWillUnmount() {
    this.backHandler.remove();
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

  checkIncomingRoute = () => {
    console.log(this.props.navigationState.previousScreen, 'routeee');
    if (this.props.navigationState.previousScreen === 'Login') {
      this.props.navigation.replace('HomeTabs');
      return;
    }
  };

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

  async onSubmit() {
    try {
      this.setState({
        errorMessage: null,
      });

      // const isFormValid = this.checkFormValidity();

      // if (!isFormValid) {
      //   return;
      // }

      this.setState({
        isLoading: true,
      });

      const serializedForm = this.form.serializeFormData();

      console.log({serializedForm});

      const application = {
        ...serializedForm,
        phoneNumber: sanitizePhoneNumber(serializedForm.phoneNumber),
        walletPhoneNumber: sanitizePhoneNumber(
          serializedForm.walletPhoneNumber,
        ),
      };

      console.log(application, 'updated form');
      const saveAsDraftResponse =
        await onboardingService.saveFipPersonalDetails(application);
      console.log(saveAsDraftResponse, 'responseee');

      const saveAsDraftResponseStatus = saveAsDraftResponse.status;
      const saveAsDraftResponseObj = saveAsDraftResponse.response;

      console.log({saveAsDraftResponseObj, saveAsDraftResponse});

      if (saveAsDraftResponseStatus === ERROR_STATUS) {
        flashMessage(
          null,
          saveAsDraftResponse?.response?.description
            ? saveAsDraftResponse.response.description
            : 'Oops! Something went wrong. Please try again',
        );
        this.setState({
          isLoading: false,
          showOtpModal: false,
        });

        return;
      }

      await saveData(APPLICATION, saveAsDraftResponseObj);
      this.props.updateApplication(saveAsDraftResponseObj);
      await this.clearCacheData();

      this.setState({
        isLoading: false,
        showOtpModal: false,
      });

      this.props.navigation.navigate('FipAgentBusinessInformation');
    } catch (err) {
      console.log(err, 'personal err');
      this.setState({
        isLoading: false,
        showOtpModal: false,
      });
    }
  }

  onGoBack = () => {
    if (this.state.isFromApplicationPreview) {
      this.props.navigation.replace('FipAgentApplicationPreview');
      return;
    }
    this.props.navigation.navigate('HomeTabs');
  };

  clearCacheData = async () => {
    await deleteData('fipAgentBvnData');
  };

  updateShowOtpModal = () => {
    this.setState({showOtpModal: false});
  };
  stopLoader = () => {
    this.setState({isLoading: false});
  };
  startloader = () => {
    this.setState({isLoading: true});
  };

  onSendOtpRequest = async () => {
    const isFormValid = this.checkFormValidity();

    if (!isFormValid) {
      return;
    }
    this.setState({isSendingOtp: true});
    try {
      const payload = {
        phoneNumber: this.form?.state?.form?.walletPhone,
        jobId: this.state.kycId,
      };
      console.log(payload, 'otp pay');

      const res = await onboardingService.sendWalletPhonOtpRequest(payload);

      const {status, code, response} = res;
      console.log(res, 'restooo');

      if (status === ERROR_STATUS) {
        flashMessage(
          null,
          response?.description
            ? response.description
            : 'Oops! Something went wrong while sending OTP to your preferred wallet number',
        );
        this.setState({isSendingOtp: false});

        return;
      }

      this.setState({
        otpResponse: response,
        showOtpModal: true,
        isSendingOtp: false,
      });
    } catch (err) {
      console.log(err, 'err');
      this.setState({isSendingOtp: false});
      flashMessage(null, 'Oops! Something went wrong. Please try again later.');
    }
  };

  render() {
    const {superAgents} = this.state;
    const {application} = this.props;

    if (!this.state.animationsDone) {
      return (
        <View style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size="large" color={COLOUR_BLUE} />
        </View>
      );
    }

    const skipButton = <Hyperlink onPress={this.onSkip}>Save</Hyperlink>;

    const walletPhone = this.form?.state?.form?.walletPhone;

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
              onPress={this.onGoBack}
            />
          }
          navigationIconColor={COLOUR_WHITE}
          // rightComponent={skipButton}
          // rightComponent={this.toShowSkipButton ? skipButton : null}
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_LIGHT,
          }}
          title="Setup New Agent"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
            fontSize: FONT_SIZE_TITLE,
          }}
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          withNavigator={this.props.withNavigator}
        />
        <View style={{width: '95%', alignSelf: 'center', marginBottom: 15}}>
          <FipProgressBar step="5" />
        </View>
        <ScrollView>
          <View
            style={{
              flex: 1,
              width: '90%',
              alignSelf: 'center',
            }}>
            <Text
              style={{
                color: COLOUR_BLACK,
                fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                fontSize: 20,
                lineHeight: 24,
                fontWeight: '600',
                marginBottom: 18,
              }}>
              Personal Details
            </Text>
            <FipPersonalDetailsAgentForm
              isDisabled={this.state.isLoading}
              propagateFormErrors={this.state.propagateFormErrors}
              ref={form => (this.form = form)}
              superAgents={superAgents}
              application={application}
              kycId={this.state.kycId}
              validatedData={this.state.validatedData}
            />
            {this.state.showOtpModal && (
              <VerifyWalletPhone
                updateShowOtpModal={this.updateShowOtpModal}
                showOtpModal={this.state.showOtpModal}
                walletPhone={walletPhone}
                onSubmitApplication={this.onSubmit}
                otpResponse={this.state.otpResponse}
                kycId={this.state.kycId}
                isLoading={this.state.isLoading}
                startLoader={this.startloader}
                stopLoader={this.stopLoader}
              />
            )}

            <Button
              loading={this.state.isSendingOtp}
              onPress={this.onSendOtpRequest}
              // onPress={() =>
              //   this.props.navigation.navigate("FipAgentBusinessInformation")
              // }
              title="CONTINUE"
              containerStyle={{
                marginVertical: 15,
                backgroundColor: '#00425F',
              }}
              buttonStyle={{backgroundColor: '#00425F'}}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FipAgentPersonalDetailsScene);

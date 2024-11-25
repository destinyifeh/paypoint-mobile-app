import React from 'react';
import {ScrollView, View} from 'react-native';
import {connect} from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {Icon} from 'react-native-elements';
import Button from '../../../components/button';
import Header from '../../../components/header';
import Text from '../../../components/text';
import {ERROR_STATUS} from '../../../constants/api';
import {
  APPLICATION_CURRENT_APPLICATION,
  APPLICATION_SELF_ONBOARDING,
  COLOUR_BLUE,
  COLOUR_LIGHT_GREY,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_SIZE_TITLE,
} from '../../../constants/styles';
import Onboarding from '../../../services/api/resources/onboarding';
import Platform from '../../../services/api/resources/platform';
import {
  resetApplication,
  updateApplication,
} from '../../../services/redux/actions/fmpa-tunnel';
import {
  hideNavigator,
  showNavigator,
} from '../../../services/redux/actions/navigation';
import {setIsFastRefreshPending} from '../../../services/redux/actions/tunnel';
import {flashMessage} from '../../../utils/dialog';
import handleErrorResponse from '../../../utils/error-handlers/api';
// import ProgressBar from "../../signup/aggregator/components/progress-bar";
import {InteractionManager} from 'react-native';
import ApplicationSerializer from '../../../serializers/resources/application';
import UserManagement from '../../../services/api/resources/user-management';
import {saveData} from '../../../utils/storage';
import ProgressBar from '../../aggregator/components/progress-bar';
import SelfOnboardingKYCForm from './forms/self-onboarding-form';

class SelfOnboardingKYCScene extends React.Component {
  onboarding = new Onboarding();
  platform = new Platform();
  userManagement = new UserManagement();

  constructor() {
    super();

    this.state = {
      accept: false,
      animationsDone: false,
      application: {},
      isLoading: false,
      invalidFields: [
        // "identificationNumber",
        //"identificationType",
        // "ID_CARD",
        'PASSPORT_PHOTO',
      ],
      isReady: false,
      isValid: false,
      selfOnboarding: false,
      isBackButton: false,
      isAssisted: false,
      isFromDashboard: false,
      attachments: null,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.getApplicationDetailsFromApi =
      this.getApplicationDetailsFromApi.bind(this);
    this.getApplicationId = this.getApplicationId.bind(this);
    this.getApplicationForBackButton =
      this.getApplicationForBackButton.bind(this);
    this.updateImage = this.updateImage.bind(this);
  }

  async componentDidMount() {
    const {isFromDashboard, selfOnboarding, isBackButton} =
      this.props.route?.params || {};

    if (isFromDashboard == true) {
      const {resumeApplicationDetails, declineReason} =
        this.props.route?.params || {};

      console.log(
        resumeApplicationDetails,
        'NUGAGEE IS FROM DASHBOARD ON KYC PAGE',
      );
      await AsyncStorage.setItem(
        APPLICATION_SELF_ONBOARDING,
        JSON.stringify(resumeApplicationDetails),
      );

      this.setState({
        isFromDashboard,
        selfOnboarding: false,
        application: new ApplicationSerializer(resumeApplicationDetails),
        declineReason,
        // isReady: true,
      });
    } else if (isBackButton == true) {
      const {resumeApplicationDetails} = this.props.route?.params || {};

      this.setState({
        isBackButton,
        selfOnboarding,
        application: new ApplicationSerializer(resumeApplicationDetails),
      });
      // this.getApplicationForBackButton();
    } else {
      this.setState({
        selfOnboarding,
      });

      const {applicantDetails} = this.props.route?.params || {};

      console.log(applicantDetails, 'RESPONSE RETURNED');

      if (applicantDetails !== {} && applicantDetails.applicationId) {
        this.getApplicationDetailsFromApi(applicantDetails.applicationId);
      } else {
        this.getApplicationId();
      }
    }
  }

  getApplicationId = async () => {
    const application = await AsyncStorage.getItem(APPLICATION_SELF_ONBOARDING);
    const savedApplication = JSON.parse(application);
    console.log(savedApplication, 'NUGAGEE SAVED APPLICATIONS');
    this.setState({
      application: savedApplication,
      isReady: true,
    });
  };

  getApplicationDetailsFromApi = async applicationId => {
    const {status, response} = await this.onboarding.getApplicationById(
      applicationId,
    );
    console.log(response, 'NUGAGEE getting application');
    if (status !== ERROR_STATUS) {
      await AsyncStorage.setItem(
        APPLICATION_SELF_ONBOARDING,
        JSON.stringify(response),
      );

      this.setState({
        application: response,
      });
    }

    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });
    });
  };
  getApplicationForBackButton = async () => {
    const application = await AsyncStorage.getItem(
      APPLICATION_CURRENT_APPLICATION,
    );
    const savedApplication = JSON.parse(application);
    const {status, response} = await this.onboarding.getApplicationById(
      savedApplication.applicationId,
    );
    console.log(response, 'NUGAGEE getting application');
    if (status !== ERROR_STATUS) {
      await AsyncStorage.setItem(
        APPLICATION_SELF_ONBOARDING,
        JSON.stringify(response),
      );

      this.setState({
        application: response,
      });
    }

    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });
    });
  };

  evaluateInvalidField = (fieldObject, count = 1) => {
    const fieldLabel = Object.keys(fieldObject)[0];
    const fieldValue = fieldObject[fieldLabel];
    this.setState({isExist: fieldValue});
    if (!fieldValue || fieldValue.length < count) {
      this.addInvalidField(fieldLabel);
    } else {
      this.removeInvalidField(fieldLabel);
    }
  };

  addInvalidField = fieldName => {
    if (this.state.invalidFields?.includes(fieldName)) return;
    const newInvalidFields = [...this.state.invalidFields, fieldName];

    this.setState({
      invalidFields: newInvalidFields,
      isValid: newInvalidFields.length === 0,
    });
  };

  removeInvalidField(fieldName) {
    if (!this.state.invalidFields?.includes(fieldName)) return;

    const invalidFieldsLength = this.state.invalidFields.length;
    const newInvalidFields = this.state.invalidFields.filter(
      value => value !== fieldName,
    );

    if (newInvalidFields.length === invalidFieldsLength) return;
    this.setState({
      invalidFields: newInvalidFields,
      isValid: newInvalidFields.length === 0,
    });
  }

  async createApplication(application) {
    this.setState({
      isLoading: true,
    });

    const {response, status} = await this.onboarding.putApplication(
      application,
      this.state.application.applicationId,
    );
    this.setState({
      isLoading: false,
    });
    console.log(response, 'sub res');
    if (status === ERROR_STATUS) {
      flashMessage(null, await handleErrorResponse(response));
      console.log(response, 'NUGAGEE ERROR RESPONSE');

      return;
    }

    const applicationClon = JSON.parse(JSON.stringify(this.state.application));

    // applicationClon.applicantDetails.identificationNumber = this.form.state.form.identificationNumber;
    // applicationClon.applicantDetails.identificationType = this.form.state.form.identificationType;
    //applicationClon.applicantDetails.identificationNumber = null;

    applicationClon.applicantDetails.identificationType = 'Passport';

    await AsyncStorage.setItem(
      APPLICATION_SELF_ONBOARDING,
      JSON.stringify(applicationClon),
    );

    // if (applicationClon.businessDetails) {
    //   this.props.navigation.replace("AgentApplicationPreview");
    //   return;
    // }

    this.props.navigation.replace('SelfOnboardingBusinessScene', {
      isFromDashboard: false,
    });
  }

  checkAlphanemeric = identificationNumber => {
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    return alphanumericRegex.test(identificationNumber);
  };

  async onSubmit() {
    this.setState({
      errorMessage: null,
    });
    console.log(this.state.attachments, 'format');

    // if (!this.checkAlphanemeric(this.form.state.form.identificationNumber)) {
    //   this.setState({
    //     isLoading: false,
    //     propagateFormErrors: true,
    //   });
    //   Alert.alert("ID Number must not contain special characters");
    //   return;
    // }

    this.setState({
      isLoading: true,
    });
    const application = {
      applicantDetails: {
        // identificationNumber: this.form.state.form.identificationNumber,
        // identificationType: this.form.state.form.identificationType,
        identificationType: 'Passport',
      },
      documents: this.state.attachments,
    };
    this.createApplication(application);
  }

  async updateImage(attachments) {
    await saveData('PASSPORT_UPLOAD_RES', attachments);
    this.setState({attachments});
  }
  render() {
    // if (!this.state.isReady) {
    //   return <ActivityIndicator />
    // }
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
              onPress={() => {
                this.state.selfOnboarding == true
                  ? this.props.navigation.replace('Login', {
                      isAssisted: true,
                    })
                  : this.props.navigation.replace('HomeTabs');
              }}
            />
          }
          navigationIconColor={COLOUR_WHITE}
          // rightComponent={skipButton}
          // rightComponent={this.toShowSkipButton ? skipButton : null}
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_LIGHT,
          }}
          title="Sign up"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
            fontSize: FONT_SIZE_TITLE,
          }}
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          withNavigator={this.props.withNavigator}
        />

        <ProgressBar step="2" />
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            padding: 15,
          }}>
          {this.state.declineReason && (
            <Text
              bold
              red
              style={{
                marginBottom: 10,
              }}>
              *{this.state.declineReason}*
            </Text>
          )}
          <Text bold black>
            KYC Information{'\n'}
          </Text>
          <ScrollView>
            <SelfOnboardingKYCForm
              isDisabled={this.state.isLoading}
              propagateFormErrors={this.state.propagateFormErrors}
              ref={form => (this.form = form)}
              application={this.state.application}
              selfOnboarding={this.state.selfOnboarding}
              isBackButton={this.state.isBackButton}
              evaluateInvalidField={this.evaluateInvalidField}
              updateImage={this.updateImage}
            />
          </ScrollView>

          <Button
            containerStyle={{
              backgroundColor:
                this.state.isValid || this.state.isExist === 234
                  ? COLOUR_BLUE
                  : COLOUR_LIGHT_GREY,
            }}
            isDisabled={!this.state.isValid && this.state.isExist !== 234}
            loading={this.state.isLoading}
            onPress={this.onSubmit}
            title="Next"
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
    setIsFastRefreshPending: value => dispatch(setIsFastRefreshPending(value)),
    showNavigator: () => dispatch(showNavigator()),
    resetApplication: () => dispatch(resetApplication()),
    updateApplication: application => dispatch(updateApplication(application)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelfOnboardingKYCScene);

import React from 'react';
import {BackHandler, ScrollView, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {connect} from 'react-redux';

import ActivityIndicator from '../../../../../../../components/activity-indicator';
import Button from '../../../../../../../components/button';
import Header from '../../../../../../../components/header';
import {APPLICATION} from '../../../../../../../constants';
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
import {
  resetApplication,
  updateApplication,
} from '../../../../../../../services/redux/actions/fmpa-tunnel';
import {
  hideNavigator,
  showNavigator,
} from '../../../../../../../services/redux/actions/navigation';
import {flashMessage} from '../../../../../../../utils/dialog';
import {saveData} from '../../../../../../../utils/storage';
import FipProgressBar from '../../components/fip-progress-bar';
import {FipAgentBusinessInformationForm} from './business-details-form';

class FipAgentBusinessInformationScene extends React.Component {
  onboarding = new Onboarding();

  constructor() {
    super();

    this.state = {
      attachments: [],
      propagateFormErrors: false,
      isFromApplicationPreview: null,
      propagateAttachmentError: false,
      isFormComplete: false,
      isStateBiller: null,
      animationsDone: false,
    };

    this.onSave = this.onSave.bind(this);
  }
  handleBackButtonPress = () => {
    return true;
  };

  componentDidMount() {
    this.checkIncomingRoute();

    const {isFromApplicationPreview} = this.props.route.params || {};

    this.setState({
      isFromApplicationPreview: isFromApplicationPreview,
      isBankDetailsValidated: true,
    });
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonPress,
    );
    this.checkApplicantType();
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  checkIncomingRoute = () => {
    if (this.props.navigationState.previousScreen === 'Login') {
      this.props.navigation.replace('HomeTabs');
      return;
    }
  };

  checkFormValidity() {
    const formIsComplete = this.form.state.isComplete;
    const {isFormComplete} = this.state;

    const formIsValid = this.form.state.isValid;

    if (!(formIsComplete || isFormComplete) && formIsValid) {
      this.setState({
        isLoading: false,
        propagateFormErrors: true,
      });

      return;
    }

    return true;
  }

  updateFormCompletion = isComplete => {
    this.setState({isFormComplete: isComplete});
  };

  checkApplicantType = async () => {
    try {
      const applicationId = this.props.application?.applicationId;
      const res = await this.onboarding.checkFipApplicantType(applicationId);
      console.log(res, 'my ress');
      const {status, response} = res;
      if (status === SUCCESS_STATUS) {
        this.setState({
          isStateBiller: response.isStateBillerAgent,
          animationsDone: true,
        });
      }
      this.setState({animationsDone: true});

      return null;
    } catch (err) {
      this.setState({animationsDone: true});

      console.log(err, 'err');
    }
  };

  async onSave() {
    this.setState({
      errorMessage: null,
      isLoading: true,
      isBankDetailsValidated: true,
    });

    try {
      const isFormValid = this.checkFormValidity();

      if (!isFormValid) {
        return;
      }

      const previouslySavedData = this.props.application;

      const formData = this.form.serializeFormData();
      const applicationId = this.props.application?.applicationId;

      const updatedApplicationForm = {
        ...formData,
      };

      const saveAsDraftResponse = await this.onboarding.saveFipBusinessDetails(
        updatedApplicationForm,
      );
      const saveAsDraftResponseStatus = saveAsDraftResponse.status;
      const saveAsDraftResponseObj = saveAsDraftResponse.response;
      console.log(saveAsDraftResponse, 'business details');

      if (saveAsDraftResponseStatus === ERROR_STATUS) {
        flashMessage(
          null,
          saveAsDraftResponse?.response?.description
            ? saveAsDraftResponse.response.description
            : 'Oops! Something went wrong. Please try again',
        );
        this.setState({
          isLoading: false,
        });

        return;
      }

      await saveData(APPLICATION, saveAsDraftResponseObj);

      this.props.updateApplication(saveAsDraftResponseObj);

      this.setState({
        errorMessage: null,
        isLoading: false,
      });

      this.props.navigation.navigate('FipAgentResidentialInformation');

      return saveAsDraftResponseObj;
    } catch (err) {
      console.log(err, 'business details error');
      this.setState({
        isLoading: false,
      });
    }
  }

  onGoBack = () => {
    if (this.state.isFromApplicationPreview) {
      this.props.navigation.replace('FipAgentApplicationPreview');
      return;
    }
    this.props.navigation.goBack();
  };
  render() {
    const {application} = this.props;

    if (!this.state.animationsDone) {
      return (
        <View style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size="large" color={COLOUR_BLUE} />
        </View>
      );
    }

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
          <FipProgressBar step="6" />
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
              Business Details
            </Text>
            <FipAgentBusinessInformationForm
              isDisabled={this.state.isLoading}
              propagateFormErrors={this.state.propagateFormErrors}
              ref={form => (this.form = form)}
              application={application}
              updateFormCompletion={this.updateFormCompletion}
              isFromApplicationPreview={this.state.isFromApplicationPreview}
              isStateBiller={this.state.isStateBiller}
            />

            <Button
              loading={this.state.isLoading}
              onPress={this.onSave}
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
    showNavigator: () => dispatch(showNavigator()),
    resetApplication: () => dispatch(resetApplication()),
    updateApplication: application => dispatch(updateApplication(application)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FipAgentBusinessInformationScene);

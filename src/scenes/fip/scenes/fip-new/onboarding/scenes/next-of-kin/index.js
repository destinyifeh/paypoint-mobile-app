import React from 'react';
import {BackHandler, ScrollView, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';

import {connect} from 'react-redux';
import Button from '../../../../../../../components/button';
import Header from '../../../../../../../components/header';
import {APPLICATION} from '../../../../../../../constants';
import {ERROR_STATUS} from '../../../../../../../constants/api';
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
import sanitizePhoneNumber from '../../../../../../../utils/sanitizers/phone-number';
import {saveData} from '../../../../../../../utils/storage';
import FipProgressBar from '../../components/fip-progress-bar';
import {FipAgentNextOfKinInformationForm} from './next-of-kin-form';

class FipAgentNextOfKinInformationScene extends React.Component {
  onboarding = new Onboarding();

  constructor() {
    super();

    this.state = {
      propagateFormErrors: false,
      isFromApplicationPreview: null,
    };

    this.checkFormValidity = this.checkFormValidity.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  handleBackButtonPress = () => {
    return true;
  };
  componentDidMount() {
    this.checkIncomingRoute();
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonPress,
    );

    const {isFromApplicationPreview} = this.props.route.params || {};

    this.setState({isFromApplicationPreview: isFromApplicationPreview});
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.application !== this.props.application) {
      this.setState({
        lastRefresh: new Date(),
      });
    }
  }

  checkIncomingRoute = () => {
    if (this.props.navigationState.previousScreen === 'Login') {
      this.props.navigation.replace('HomeTabs');
      return;
    }
  };
  checkFormValidity() {
    const formIsComplete = this.form.state.isComplete;
    const formIsValid = this.form.state.isValid;

    if (!(formIsComplete && formIsValid)) {
      this.setState({
        isLoading: false,
        propagateFormErrors: true,
      });

      return;
    }

    return true;
  }

  async onSave() {
    const isFormValid = this.checkFormValidity();

    if (!isFormValid) {
      return;
    }

    this.setState({
      errorMessage: null,
      isLoading: true,
    });
    try {
      const formData = this.form.serializeFormData();

      const previouslySavedData = this.props.application;

      const updatedApplicationForm = {
        ...formData,
        phoneNumber: sanitizePhoneNumber(formData.phoneNumber),
      };

      const applicationId = this.props.application?.applicationId;

      console.log(updatedApplicationForm, 'my pay');

      const saveAsDraftResponse = await this.onboarding.saveFipNextOfKinDetails(
        applicationId,
        updatedApplicationForm,
      ); //saveAsDraft
      const saveAsDraftResponseStatus = saveAsDraftResponse.status;
      const saveAsDraftResponseObj = saveAsDraftResponse.response;
      console.log(saveAsDraftResponse, 'next details');

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
      this.props.navigation.replace('FipAgentApplicationPreview');

      return saveAsDraftResponseObj;
    } catch (err) {
      console.log(err, 'nextOfKin details err');
      this.setState({
        errorMessage: null,
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
    console.log(application, 'apllicat next');

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
          <FipProgressBar step="8" />
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
              Next of Kin
            </Text>
            <FipAgentNextOfKinInformationForm
              isDisabled={this.state.isLoading}
              propagateFormErrors={this.state.propagateFormErrors}
              ref={form => (this.form = form)}
              application={application}
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
)(FipAgentNextOfKinInformationScene);

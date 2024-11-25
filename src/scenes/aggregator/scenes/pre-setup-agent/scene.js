import React from 'react';
import {Alert, InteractionManager, ScrollView, View} from 'react-native';
import {connect} from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {Icon} from 'react-native-elements';
import Button from '../../../../components/button';
import Header from '../../../../components/header';
import Text from '../../../../components/text';
import {AGENT_TYPE_ID} from '../../../../constants';
import {ERROR_STATUS} from '../../../../constants/api';
import {
  APPLICATION,
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
import ProgressBar from '../../components/progress-bar';
import PreSetupAgentForm from './forms/pre-setup-agent-form';

class PreSetupAgentScene extends React.Component {
  onboarding = new Onboarding();
  platform = new Platform();

  constructor() {
    super();

    this.state = {
      accept: false,
      animationsDone: false,
      isValid: false,
      invalidFields: [
        'bvn',
        'repeatPhone',
        'phone',
        'repeatPhone',
        'email',
        'repeatEmail',
        'gender',
        'dateOfBirth',
      ],
      application: {
        agentTypeId: AGENT_TYPE_ID,
        applicantDetails: {
          nextOfKin: {},
        },
        businessDetails: {},
        howYouHeardAboutUs: 'Referred by an Agent',
      },
      isLoading: false,
      slide: 'PERSONAL INFORMATION',
      superAgents: [],
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.addInvalidField = this.addInvalidField.bind(this);
    this.removeInvalidField = this.removeInvalidField.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });
    });
  }

  addInvalidField(fieldName) {
    if (this.state.invalidFields?.includes(fieldName)) return;
    const newInvalidFields = [...this.state.invalidFields, fieldName];

    this.setState({
      invalidFields: newInvalidFields,
      isValid: newInvalidFields.length === 0,
    });
  }

  removeInvalidField(fieldName) {
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

    const {response, status} =
      await this.onboarding.createPersonalDetailsAggregator(application);

    this.setState({
      isLoading: false,
    });

    if (status === ERROR_STATUS) {
      flashMessage(null, await handleErrorResponse(response));

      return;
    }

    await AsyncStorage.setItem(APPLICATION, JSON.stringify(response));

    this.props.navigation.replace('kYCInformation');
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

    if (
      !this.form.state.form ||
      !this.form.state.form.phone ||
      !this.form.state.form.gender ||
      !this.form.state.form.email ||
      !this.form.state.form.dateOfBirth
    ) {
      this.setState({
        isLoading: false,
        propagateFormErrors: true,
      });
      return;
    }

    this.setState({
      isLoading: true,
    });

    const serializedForm = this.form.serializeFormData();

    const application = {
      applicantDetails: serializedForm,
    };

    this.createApplication(application);
  }

  render() {
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
              onPress={() => this.props.navigation.replace('AggregatorLanding')}
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

        <ProgressBar step="1" />
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            padding: 15,
          }}>
          <Text bold black>
            Personal Details{'\n'}
          </Text>
          <ScrollView>
            <PreSetupAgentForm
              isDisabled={this.state.isLoading}
              propagateFormErrors={this.state.propagateFormErrors}
              ref={form => (this.form = form)}
              addInvalidField={this.addInvalidField}
              removeInvalidField={this.removeInvalidField}
            />
          </ScrollView>

          <Button
            loading={this.state.isLoading}
            isDisabled={!this.state.isValid}
            onPress={this.onSubmit}
            title="Save & Continue"
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

import React from 'react';
import {Alert, ScrollView, View} from 'react-native';
import {connect} from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActivityIndicator} from 'react-native';
import {Icon} from 'react-native-elements';
import Button from '../../../../components/button';
import Header from '../../../../components/header';
import Text from '../../../../components/text';
import {ERROR_STATUS} from '../../../../constants/api';
import {BLOCKER} from '../../../../constants/dialog-priorities';
import {
  AGENT_UPGRADE,
  COLOUR_BLUE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_SIZE_TITLE,
} from '../../../../constants/styles';
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
import ProgressBar from '../../components/progress-bar';
import PreSetupAgentForm from './forms/agent-kyc-form';

class KYCInformationScene extends React.Component {
  platform = new Platform();

  constructor() {
    super();

    this.state = {
      accept: false,
      animationsDone: false,
      applications: {},
      isLoading: false,
      invalidFields: ['UTILITY_BILL', 'CHARACTER_FORM'],
      isReady: false,
      isValid: false,
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.getApplicatId();
  }

  getApplicatId = async () => {
    const agentUpgrade = await AsyncStorage.getItem(AGENT_UPGRADE);
    const savedAgentUpgrade = JSON.parse(agentUpgrade);

    if (savedAgentUpgrade.newClass === 'Prestige') {
      // check if the fields exist in the payload

      const invalidFields = [];
      if (
        savedAgentUpgrade.businessDetails.documents.filter(
          vv => vv.documentType == 'ADDRESS_VERIFICATION_FORM',
        ).length == 0
      ) {
        invalidFields.push('ADDRESS_VERIFICATION_FORM');
      }
      if (
        savedAgentUpgrade.businessDetails.documents.filter(
          vv => vv.documentType == 'UTILITY_BILL',
        ).length == 0
      ) {
        invalidFields.push('UTILITY_BILL');
      }
      if (
        savedAgentUpgrade.businessDetails.documents.filter(
          vv => vv.documentType == 'CHARACTER_FORM',
        ).length == 0
      ) {
        invalidFields.push('CHARACTER_FORM');
      }

      this.setState({
        invalidFields: invalidFields,
        applications: savedAgentUpgrade,
        isValid: invalidFields.length == 0,
        isReady: true,
      });
    } else {
      const invalidFields = [];
      if (
        savedAgentUpgrade.businessDetails.documents.filter(
          vv => vv.documentType == 'UTILITY_BILL',
        ).length == 0
      ) {
        invalidFields.push('UTILITY_BILL');
      }
      if (
        savedAgentUpgrade.businessDetails.documents.filter(
          vv => vv.documentType == 'CHARACTER_FORM',
        ).length == 0
      ) {
        invalidFields.push('CHARACTER_FORM');
      }
      this.setState({
        applications: savedAgentUpgrade,
        invalidFields: invalidFields,
        isValid: invalidFields.length == 0,
        isReady: true,
      });
    }
  };

  evaluateInvalidField = (fieldObject, count = 1) => {
    const fieldLabel = Object.keys(fieldObject)[0];
    fieldValue = fieldObject[fieldLabel];
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

  async createApplication() {
    const applicationClon = JSON.parse(
      JSON.stringify(this.state.applications.businessDetails),
    );

    applicationClon.businessTypeId = this.form.state.form.businessTypeId;
    applicationClon.bank = this.form.state.form.bank;
    applicationClon.accountNumber = this.form.state.form.accountNumber;
    applicationClon.mothersMaidenName = applicationClon.mothersMaidenName;
    applicationClon.newClassId = applicationClon.newClassId;

    const payload = {
      businessTypeId: this.form.state.form.businessType,
      bank: this.form.state.form.bank,
      accountNumber: this.form.state.form.accountNumber,
      mothersMaidenName: applicationClon.mothersMaidenName,
      newClassId: applicationClon.newClassId,
    };

    const {response, status} = await this.platform.submitAggregatorClassUpgrage(
      payload,
      applicationClon.agentCode,
    );

    this.setState({
      isLoading: false,
    });
    if (status === ERROR_STATUS) {
      if (response.code.includes('400')) {
        flashMessage(null, response.description, BLOCKER);
      } else {
        flashMessage(null, await handleErrorResponse(response), BLOCKER);
      }
      return;
    }

    AsyncStorage.removeItem(AGENT_UPGRADE);
    this.showAlert(
      'Request Successfully Submitted',
      'Your upgrade request has been submitted',
    );
  }

  checkAlphanemeric = identificationNumber => {
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    return alphanumericRegex.test(identificationNumber);
  };

  showAlert(title, message) {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'View Agents',
          onPress: () => this.props.navigation.replace('ViewAgents'),
        },
      ],

      {cancelable: false},
    );
  }

  async onSubmit() {
    this.setState({
      errorMessage: null,
      isLoading: true,
    });

    this.createApplication();
  }

  render() {
    if (!this.state.isReady) {
      return <ActivityIndicator />;
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
          title={`Upgrade Agent to ${this.state.applications.businessDetails?.newClass}`}
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
            fontSize: FONT_SIZE_TITLE,
          }}
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          withNavigator={this.props.withNavigator}
        />

        <ProgressBar step="3" size="3" />
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            padding: 15,
          }}>
          <Text bold black>
            KYC Information{'\n'}
          </Text>
          <ScrollView>
            <PreSetupAgentForm
              isDisabled={this.state.isLoading}
              propagateFormErrors={this.state.propagateFormErrors}
              ref={form => (this.form = form)}
              application={this.state.applications}
              evaluateInvalidField={this.evaluateInvalidField}
            />
          </ScrollView>

          <Button
            isDisabled={!this.state.isValid}
            loading={this.state.isLoading}
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
)(KYCInformationScene);

import React from 'react';
import {ScrollView, View} from 'react-native';
import {connect} from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActivityIndicator} from 'react-native';
import {Icon} from 'react-native-elements';
import Button from '../../../../components/button';
import Header from '../../../../components/header';
import Text from '../../../../components/text';
import {ERROR_STATUS} from '../../../../constants/api';
import {
  AGENT_UPGRADE,
  COLOUR_BLUE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_SIZE_TITLE,
} from '../../../../constants/styles';
import Onboarding from '../../../../services/api/resources/onboarding';
import Platform from '../../../../services/api/resources/platform';
import TransactionV1 from '../../../../services/api/resources/transaction-v1';
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
import PreSetupAgentForm from './forms/business-information-form';

class BusinessDetailsScene extends React.Component {
  onboarding = new Onboarding();
  platform = new Platform();
  transactionV1 = new TransactionV1();

  constructor() {
    super();

    this.state = {
      accept: false,
      animationsDone: true,
      applicationId: 11,
      application: {
        businessDetails: {},
      },
      isLoading: false,
      isReady: false,
      isValid: false,
      invalidFields: ['bank', 'businessType', 'accountNumber'],
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.getApplicatId();
  }

  evaluateInvalidField = (fieldObject, count = 1) => {
    const fieldLabel = Object.keys(fieldObject)[0];
    fieldValue = fieldObject[fieldLabel];
    if (!fieldValue || fieldValue.length < count) {
      this.addInvalidField(fieldLabel);
    } else {
      this.removeInvalidField(fieldLabel);
    }
  };

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

  getApplicatId = async () => {
    const agentUpgrade = await AsyncStorage.getItem(AGENT_UPGRADE);
    const savedAgentUpgrade = JSON.parse(agentUpgrade);

    this.setState({
      application: {
        businessDetails: savedAgentUpgrade,
      },
      businessTypes: [{id: 1, business_type: 'Loading...'}],
      banks: [{cbnCode: 1, bankName: 'Loading...'}],
      isReady: true,
    });
    this.loadData();
  };

  loadData = async () => {
    const {response} = await this.platform.getBusinessType();
    this.loadBanks();
    this.setState({
      businessTypes: response,
    });
  };
  loadBanks = async () => {
    const responseData = await this.transactionV1.getBanks();

    this.setState({
      banks: responseData.response,
    });
  };

  async createApplication() {
    const applicationClon = JSON.parse(JSON.stringify(this.state.application));

    applicationClon.businessTypeId = this.form.state.form.businessType;
    applicationClon.bank = this.form.state.form.bank;
    applicationClon.accountNumber = this.form.state.form.accountNumber;
    applicationClon.motherMadienName =
      applicationClon.businessDetails.motherMadienName;
    applicationClon.newClassId = applicationClon.businessDetails.newClassId;

    const {response, status} = await this.platform.initializeUpgradeAgent(
      {
        businessTypeId: this.form.state.form.businessType,
        bank: this.form.state.form.bank,
        accountNumber: this.form.state.form.accountNumber,
        homeAddressLgaId: applicationClon.businessDetails.homeAddressLgaId,
        homeAddressStateId: applicationClon.businessDetails.homeAddressStateId,
        motherMaidenName: applicationClon.businessDetails.motherMadienName,
        newClassId: applicationClon.businessDetails.newClassId,
      },
      this.form.state.form.agentCode,
    );

    this.setState({
      isLoading: false,
    });

    if (status === ERROR_STATUS) {
      flashMessage(null, await handleErrorResponse(response));

      return;
    }

    await AsyncStorage.setItem(AGENT_UPGRADE, JSON.stringify(applicationClon));

    this.props.navigation.navigate('AgentkYCInformation');
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
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_LIGHT,
          }}
          title={`Upgrade Agent to ${this.state.application.businessDetails.newClass}`}
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
            fontSize: FONT_SIZE_TITLE,
          }}
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          withNavigator={this.props.withNavigator}
        />

        <ProgressBar step="2" size="3" />
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            padding: 15,
          }}>
          <Text bold black>
            Business Details{'\n'}
          </Text>
          <ScrollView>
            <PreSetupAgentForm
              isDisabled={this.state.isLoading}
              propagateFormErrors={this.state.propagateFormErrors}
              ref={form => (this.form = form)}
              application={this.state.application}
              businessTypes={this.state.businessTypes}
              banks={this.state.banks}
              evaluateInvalidField={this.evaluateInvalidField}
            />
          </ScrollView>

          <Button
            loading={this.state.isLoading}
            onPress={this.onSubmit}
            isDisabled={!this.state.isValid}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BusinessDetailsScene);

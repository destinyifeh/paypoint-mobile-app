import React from 'react';
import {InteractionManager, ScrollView, View} from 'react-native';
import {connect} from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {Icon} from 'react-native-elements';
import Button from '../../../../components/button';
import Header from '../../../../components/header';
import Text from '../../../../components/text';
import {AGENT_TYPE_ID, NIGERIA} from '../../../../constants';
import {SUCCESS_STATUS} from '../../../../constants/api';
import {
  AGENT_UPGRADE,
  COLOUR_BLUE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_SIZE_TITLE,
} from '../../../../constants/styles';
import CountriesStatesLgas from '../../../../fixtures/countries_states_lgas.json';
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
import ProgressBar from '../../components/progress-bar';
import PreSetupAgentForm from './forms/pre-setup-agent-form';

class PersonalDetailsUpgradeScene extends React.Component {
  onboarding = new Onboarding();
  platform = new Platform();

  constructor() {
    super();

    this.state = {
      accept: false,
      animationsDone: false,
      isValid: false,
      invalidFields: ['motherMadienName'],
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
    this.getApplicantId();
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });
    });
  }

  getApplicantId = async () => {
    const agentUpgrade = await AsyncStorage.getItem(AGENT_UPGRADE);
    const savedAgentUpgrade = JSON.parse(agentUpgrade);

    if (savedAgentUpgrade.agentClass) {
      savedAgentUpgrade.agentClass = savedAgentUpgrade.newClass;
    }

    const country = CountriesStatesLgas?.find(value => value.name == NIGERIA);

    if (savedAgentUpgrade.stateId != 0) {
      console.log('Got here 1');
      const lgasResponseObj = await this.platform.retrieveLgas(
        savedAgentUpgrade.stateId,
      );
      const lgasResponseStatus = lgasResponseObj.status;
      const lgasResponse = lgasResponseObj.response;
      if (lgasResponseStatus === SUCCESS_STATUS) {
        this.setState({
          form: {
            ...savedAgentUpgrade,
            state: savedAgentUpgrade.stateId,
            lga: savedAgentUpgrade.lga,
            lgas: lgasResponse ? lgasResponse : [],
            states: country.states,
          },
          application: savedAgentUpgrade,
        });
      }
    } else {
      this.setState({
        form: {...savedAgentUpgrade, states: country.states},
        application: savedAgentUpgrade,
      });
    }

    if (savedAgentUpgrade.newClass === 'Prestige') {
      if (
        savedAgentUpgrade.lga &&
        savedAgentUpgrade.stateId &&
        savedAgentUpgrade.motherMadienName
      ) {
        this.setState({
          invalidFields: [],
          isReady: true,
          isValid: true,
        });
      } else {
        this.setState({
          invalidFields: ['motherMadienName', 'state', 'lga'],
          isReady: true,
        });
      }
    } else {
      this.setState({
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

  async onSubmit() {
    this.setState({
      errorMessage: null,
    });

    this.setState({
      isLoading: true,
    });

    const applicationClon = JSON.parse(JSON.stringify(this.state.application));

    applicationClon.motherMadienName = this.form.state.form.motherMadienName;
    if (applicationClon.newClass === 'Prestige') {
      applicationClon.homeAddressLgaId = this.form.state.form.lga;
      applicationClon.homeAddressStateId = this.form.state.form.state;
    }
    await AsyncStorage.setItem(AGENT_UPGRADE, JSON.stringify(applicationClon));

    this.props.navigation.navigate('AgentBusinessDetails');

    this.setState({
      isLoading: false,
    });
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
              onPress={() =>
                this.props.navigation.navigate('AgentUpgradeLanding')
              }
            />
          }
          navigationIconColor={COLOUR_WHITE}
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_LIGHT,
          }}
          title={`Upgrade Agent to ${this.state.application.newClass}`}
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
            fontSize: FONT_SIZE_TITLE,
          }}
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          withNavigator={this.props.withNavigator}
        />

        <ProgressBar step="1" size="3" />
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            padding: 15,
          }}>
          <Text bold black>
            Personal Details{'\n'}
          </Text>
          {this.state.application?.bvn && (
            <ScrollView>
              <PreSetupAgentForm
                isDisabled={this.state.isLoading}
                propagateFormErrors={this.state.propagateFormErrors}
                ref={form => (this.form = form)}
                application={this.state.application}
                form={this.state.form}
                evaluateInvalidField={this.evaluateInvalidField}
              />
            </ScrollView>
          )}

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
)(PersonalDetailsUpgradeScene);

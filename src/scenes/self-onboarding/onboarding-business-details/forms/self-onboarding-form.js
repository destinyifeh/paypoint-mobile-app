import React from 'react';
import FormInput from '../../../../components/form-controls/form-input';
import FormPicker from '../../../../components/form-controls/form-picker';

import AsyncStorage from '@react-native-async-storage/async-storage';
import BaseForm from '../../../../components/base-form';
import {SUCCESS_STATUS} from '../../../../constants/api';
import {CASUAL} from '../../../../constants/dialog-priorities';
import {APPLICATION_CURRENT_APPLICATION} from '../../../../constants/styles';
import CountriesStatesLga from '../../../../fixtures/countries_states_lgas.json';
import Onboarding from '../../../../services/api/resources/onboarding';
import Platform from '../../../../services/api/resources/platform';
import UserManagement from '../../../../services/api/resources/user-management';
import {flashMessage} from '../../../../utils/dialog';
import styles from '../../../signup/styles';

export default class SelfOnboardBusinessInformationForm extends BaseForm {
  requiredFields = ['state', 'localGovernmentArea', 'address', 'businessName'];

  state = {
    applicantDetails: {},
    countries: [],
    form: {},
    invalidFields: [],
    states: [],
    lgas: [],
  };

  userManagement = new UserManagement();
  onboarding = new Onboarding();
  platformService = new Platform();
  constructor() {
    super();

    this.fields = [
      this.email,
      this.address,
      this.bvn,
      this.phone,
      this.localGovernmentArea,
      this.dateOfBirth,
      this.gender,
    ];

    this.onNationalitySelect = this.onNationalitySelect.bind(this);
    this.onStateSelect = this.onStateSelect.bind(this);
  }

  componentDidMount() {
    this.getCurrentApplicantBusinessName();
    this.onNationalitySelect();
    if (this.props.application.businessDetails) {
      this.props.evaluateInvalidField({localGovernmentArea: 123});
      this.props.evaluateInvalidField({state: 123});
      this.props.evaluateInvalidField({address: 123});
      this.props.evaluateInvalidField({businessName: 123});
    }
  }
  async getCurrentApplicantBusinessName() {
    const {applicantDetails} = this.props.application;
    const currentapplication = await AsyncStorage.getItem(
      APPLICATION_CURRENT_APPLICATION,
    );
    const getCurrentApplicationDetails = JSON.parse(currentapplication);
    //const { applicantDetails } = getCurrentApplicationDetails;
    //const { firstName, surname } = applicantDetails;
    this.setState({
      form: {
        ...this.state.form,
        businessName:
          applicantDetails.firstName + ' ' + applicantDetails.surname,
      },
    });
  }
  async getTheCurrentApplicant() {
    try {
      const {status, response} = await this.platformService.getCurrentUser();
      console.log(response, 'restooo');
      if (status === SUCCESS_STATUS) {
        this.setState({
          form: {
            ...this.state.form,
            businessName: response.firstName + ' ' + response.lastName,
          },
        });
      } else {
        flashMessage(
          null,
          'An error occurred while fetching business name',
          CASUAL,
        );
      }
    } catch (err) {
      console.log(err);
    }
  }
  serializeFormData() {
    const {address, businessName, localGovernmentArea, state} = this.state.form;

    return {
      address,
      businessName,
      localGovernmentArea,
      state,
    };
  }

  onNationalitySelect() {
    const country = CountriesStatesLga.find(value => value.id == 1);
    const states = country
      ? country.states.map(value => ({
          id: value.id,
          name: value.name,
        }))
      : [];

    this.setState({
      states,
      form: this.props.application.businessDetails || {},
    });
  }

  onStateSelect(stateId) {
    const country = CountriesStatesLga.find(value => value.id == 1);

    const state = country.states.find(value => value.id == stateId);

    this.setState({
      lgas: state ? state.lgas : [],
    });
  }

  render() {
    return (
      <React.Fragment>
        <FormInput
          autoCapitalize="none"
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(businessName, isValid) => {
            this.updateFormField({businessName});
            this.props.evaluateInvalidField({businessName});
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder=""
          defaultValue={this.state.form?.businessName}
          propagateError={this.props.propagateFormErrors}
          showValidIndicator={true}
          text="Business Name"
          textInputRef={input => (this.businessName = input)}
          validators={{
            required: true,
          }}
          disabled={true}
        />

        <FormInput
          autoCapitalize="none"
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={address => {
            this.updateFormField({address});
            this.props.evaluateInvalidField({address}, 5);
          }}
          defaultValue={this.state.form?.address}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder=""
          propagateError={this.props.propagateFormErrors}
          showValidIndicator={true}
          text="Shop Address"
          textInputRef={input => (this.address = input)}
          validators={{
            required: true,
            minLength: 5,
          }}
        />

        <FormPicker
          choices={
            this.state.states &&
            this.state.states.map(({id, name}) => ({
              label: name,
              value: id,
            }))
          }
          defaultValue={
            this.state.form?.state ? Number(this.state.form.state) : null
          }
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={state => {
            this.updateFormField({state});
            this.onStateSelect(state);
            this.props.evaluateInvalidField({state});
            this.props.evaluateInvalidField({localGovernmentArea: null});
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          propagateError={this.props.propagateFormErrors}
          text="State"
          validators={{
            required: true,
          }}
        />

        <FormPicker
          choices={
            this.state.lgas &&
            this.state.lgas.map(({id, name}) => ({
              label: name,
              value: id,
            }))
          }
          // defaultValue={this.state.form?.localGovernmentArea}
          defaultValue={
            this.state.form?.localGovernmentArea
              ? Number(this.state.form.localGovernmentArea)
              : null
          }
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={localGovernmentArea => {
            this.updateFormField({localGovernmentArea});
            this.props.evaluateInvalidField({localGovernmentArea});
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          propagateError={this.props.propagateFormErrors}
          text="LGA"
          validators={{
            required: true,
          }}
        />
      </React.Fragment>
    );
  }
}

import React from "react";
import FormInput from "../../../../../components/form-controls/form-input";
import FormPicker from "../../../../../components/form-controls/form-picker";

import BaseForm from "../../../../../components/base-form";
import styles from "../styles";
import UserManagement from "../../../../../services/api/resources/user-management";
import Onboarding from "../../../../../services/api/resources/onboarding";
import CountriesStatesLga from '../../../../../fixtures/countries_states_lgas.json'


export default class AgentBusinessInformationForm extends BaseForm {
  requiredFields = [
    "state",
    "lga",
    "address",
    "businessName",
  ];

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

  constructor() {
    super();

    this.fields = [
      this.email,
      this.address,
      this.bvn,
      this.phone,
      this.lga,
      this.dateOfBirth,
      this.gender,
    ];

    this.onNationalitySelect = this.onNationalitySelect.bind(this);
    this.onStateSelect = this.onStateSelect.bind(this);
  }

  componentDidMount() {
    this.onNationalitySelect();
    if (this.props.application.businessDetails) {
      this.props.evaluateInvalidField({ lga: 123 })
      this.props.evaluateInvalidField({ state: 123 })
      this.props.evaluateInvalidField({ address: 123 })
      this.props.evaluateInvalidField({ businessName: 123 })
    }
  }

  serializeFormData() {
    const {
      address,
      businessName,
      lga,
      state
    } = this.state.form;

    return {
      address,
      businessName,
      lga,
      state
    };
  }

  onNationalitySelect() {
    const country = CountriesStatesLga.find((value) => value.id == 1);
    const states = country
      ? country.states.map((value) => ({
        id: value.id,
        name: value.name,
      }))
      : [];

    this.setState({
      states,
      form: this.props.application.businessDetails || {}
    });

  }

  onStateSelect(stateId) {
    const country = CountriesStatesLga.find(
      (value) => value.id == 1
    );

    const state = country.states.find((value) => value.id == stateId);

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
            this.updateFormField({ businessName });
            this.props.evaluateInvalidField({ businessName })
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder=""
          defaultValue={this.state.form?.businessName}
          propagateError={this.props.propagateFormErrors}
          showValidIndicator={true}
          text="Business Name"
          textInputRef={(input) => (this.businessName = input)}
          validators={{
            required: true,
          }}
        />

        <FormInput
          autoCapitalize="none"
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(address) => {
            this.updateFormField({ address });
            this.props.evaluateInvalidField({ address }, 5)
          }}
          defaultValue={this.state.form?.address}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder=""
          propagateError={this.props.propagateFormErrors}
          showValidIndicator={true}
          text="Business Address"
          textInputRef={(input) => (this.address = input)}
          validators={{
            required: true,
            minLength: 5
          }}
        />

        <FormPicker
          choices={this.state.states && this.state.states.map(({ id, name }) => ({
            label: name,
            value: id,
          }))}
          defaultValue={this.state.form?.state ? Number(this.state.form.state) : null}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={(state) => {
            this.updateFormField({ state });
            this.onStateSelect(state);
            this.props.evaluateInvalidField({ state })
            this.props.evaluateInvalidField({ lga: null })
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          propagateError={this.props.propagateFormErrors}
          text="State:"
          validators={{
            required: true,
          }}
        />

        <FormPicker
          choices={this.state.lgas && this.state.lgas.map(({ id, name }) => ({
            label: name,
            value: id,
          }))}
          defaultValue={this.state.form?.lga}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={(lga) => {
            this.updateFormField({ lga });
            this.props.evaluateInvalidField({ lga })
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          propagateError={this.props.propagateFormErrors}
          text="LGA:"
          validators={{
            required: true,
          }}
        />
      </React.Fragment>
    );
  }
}

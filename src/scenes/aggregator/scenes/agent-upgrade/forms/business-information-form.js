import React from "react";
import FormInput from "../../../../../components/form-controls/form-input";
import FormPicker from "../../../../../components/form-controls/form-picker";

import BaseForm from "../../../../../components/base-form";
import CountriesStatesLga from '../../../../../fixtures/countries_states_lgas.json';
import styles from "../styles";


export default class AgentBusinessInformationForm extends BaseForm {
  requiredFields = [
    "state",
    "lga",
    "businessType",
  ];

  state = {
    applicantDetails: {},
    countries: [],
    form: {},
    invalidFields: [],
    states: [],
    lgas: [],
  };


  constructor() {
    super();

    this.fields = [
      this.email,
      this.address,
      this.bvn,
      this.phone,
      this.lga,
      this.businessType,
      this.gender,
    ];

    this.onStateSelect = this.onStateSelect.bind(this);
  }

  componentDidMount() {
    if (this.props.application.businessDetails) {
      this.onStateSelect(this.props.application.businessDetails.businessLocation[0].stateId)
    }
  }

  serializeFormData() {
    const {
      accountNumber,
      bank,
      businessType
    } = this.state.form;

    return {
      accountNumber,
      bank,
      businessType
    };
  }

  onStateSelect(stateId) {
    console.log({ stateId })
    const country = CountriesStatesLga.find(
      (value) => value.id == 1
    );

    const state = country.states.find((value) => value.id == stateId);
    const lgaVal = state.lgas.find(value => value.id = this.props.application.businessDetails.businessLocation[0].lgaId);

    this.setState({
      lgas: state ? state.lgas : [],
      lgaVal: lgaVal?.name,
      form: this.props.application.businessDetails || {}
    });
  }

  render() {

    return (
      <React.Fragment>

        <FormInput
          autoCapitalize="none"
          innerContainerStyle={styles.formInputInnerContainerStyle}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          defaultValue={this.state.form?.businessName}
          propagateError={this.props.propagateFormErrors}
          showValidIndicator={true}
          text="Business Name"
          textInputRef={(input) => (this.businessName = input)}
          validators={{
            required: true,
          }}
          disabled
        />

        {this.state.form?.businessLocation && <><FormInput
          innerContainerStyle={styles.formInputInnerContainerStyle}
          defaultValue={this.state.form?.businessLocation[0].addressLine1}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          showValidIndicator={true}
          text="Business Address"
          textInputRef={(input) => (this.address = input)}
          validators={{
            required: true
          }}
          disabled
        />

          <FormInput
            defaultValue={this.state.form?.businessLocation[0].state}
            innerContainerStyle={styles.formInputInnerContainerStyle}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            propagateError={this.props.propagateFormErrors}
            text="State:"
            validators={{
              required: true,
            }}
            disabled
            showValidIndicator={true}
          />
          
          <FormInput
            defaultValue={this.state.lgaVal}
            innerContainerStyle={styles.formInputInnerContainerStyle}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            propagateError={this.props.propagateFormErrors}
            text="LGA:"
            validators={{
              required: true,
            }}
            disabled
            showValidIndicator={true}
          />
        </>}

        <FormPicker
          choices={this.props.businessTypes && this.props.businessTypes?.map(({ id, business_type }) => ({
            label: business_type,
            value: id,
          }))
          }
          defaultValue={this.state.form?.businessType}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={(businessType) => {
            this.updateFormField({ businessType });
            this.props.evaluateInvalidField({ businessType })
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          propagateError={this.props.propagateFormErrors}
          text="Business Types:"
          validators={{
            required: true,
          }}
          showValidIndicator={true}
        />

        <FormPicker
          choices={this.props.banks && this.props.banks.map(({ cbnCode, bankName }) => ({
            label: bankName,
            value: bankName,
          }))
          }
          defaultValue={this.state.form?.bank}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={(bank) => {
            this.updateFormField({ bank });
            this.props.evaluateInvalidField({ bank })
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          propagateError={this.props.propagateFormErrors}
          text="Bank:"
          validators={{
            required: true,
          }}
          showValidIndicator={true}
        />

        <FormInput
          autoCapitalize="none"
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(accountNumber, isValid) => {
            this.updateFormField({ accountNumber });
            this.props.evaluateInvalidField({ accountNumber }, 10)
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          defaultValue={this.state.form?.accountNumber}
          propagateError={this.props.propagateFormErrors}
          showValidIndicator={true}
          text="Account Number"
          keyboardType='number-pad'
          placeholder="Account Number"
          textInputRef={(input) => (this.accountNumber = input)}
          validators={{
            required: true,
            minLength: 10
          }}
        />
      </React.Fragment>
    );
  }
}

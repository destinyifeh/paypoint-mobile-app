import React from "react";

import BaseForm from "../../../../../../../components/base-form";
import FormInput from "../../../../../../../components/form-controls/form-input";
import FormPicker from "../../../../../../../components/form-controls/form-picker";
import { MIN_ADDRESS_LENGTH } from "../../../../../../../constants/fields";
import CountriesStatesLga from "../../../../../../../fixtures/countries_states_lgas";
import styles from "../../styles";

export class FipAgentResidentialInformationForm extends BaseForm {
  requiredFields = [
    "nationality",
    "address",
    "state",
    "lga",
    "closestLandmark",
  ];

  constructor() {
    super();

    this.state = {
      applicantDetails: {},
      countries: [],
      form: {},
      invalidFields: [],
      states: [],
      lgas: [],
    };

    this.fetchCountries = this.fetchCountries.bind(this);
    this.onNationalitySelect = this.onNationalitySelect.bind(this);
    this.onStateSelect = this.onStateSelect.bind(this);
  }

  componentDidMount() {
    this.fetchCountries();

    const applicantDetails = this.props.application.applicantDetails || {};

    this.setState({
      applicantDetails: applicantDetails,
      form: this.serializeApiData(applicantDetails),
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.application !== prevProps.application) {
      const applicantDetails = this.props.application.applicantDetails || {};

      this.setState({
        applicantDetails,
        form: this.serializeApiData(applicantDetails),
      });
    }
  }

  fetchCountries() {
    this.setState({
      countries: CountriesStatesLga.map((value) => ({
        id: value.id,
        name: value.name,
      })),
    });
  }

  serializeApiData(applicantDetails) {
    return {
      address: applicantDetails.address,
      state: applicantDetails.state ? parseInt(applicantDetails.state) : null,
      lga: applicantDetails.localGovernmentArea
        ? parseInt(applicantDetails.localGovernmentArea)
        : null,
      nationality: applicantDetails.nationality
        ? parseInt(applicantDetails.nationality)
        : null,
      closestLandmark: applicantDetails.closestLandMark,
    };
  }

  serializeFormData() {
    const {
      nationality,
      address,
      state,
      lga,
      closestLandmark,
    } = this.state.form;

    return {
      nationality: nationality ? JSON.stringify(nationality) : undefined,
      address,
      state: state ? JSON.stringify(state) : undefined,
      localGovernmentArea: lga ? JSON.stringify(lga) : undefined,
      closestLandMark: closestLandmark,
    };
  }

  onNationalitySelect(nationality) {
    const country = CountriesStatesLga.find((value) => value.id == nationality);

    this.setState({
      states: country
        ? country.states.map((value) => ({
            id: value.id,
            name: value.name,
          }))
        : [],
    });
  }

  onStateSelect(stateId) {
    const country = CountriesStatesLga.find(
      (value) => value.id == this.state.form.nationality
    );

    const state = country.states.find((value) => value.id == stateId);

    this.setState({
      lgas: state ? state.lgas : [],
    });
  }

  render() {
    return (
      <React.Fragment>
        <FormPicker
          choices={this.state.countries.map(({ id, name }) => ({
            label: name,
            value: id,
          }))}
          defaultValue={this.state.form.nationality}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={(nationality, isValid) => {
            this.updateFormField({ nationality });
            this.onNationalitySelect(nationality);
            !isValid
              ? this.addInvalidField("nationality")
              : this.removeInvalidField("nationality");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          propagateError={this.props.propagateFormErrors}
          text="Nationality"
          validators={{
            required: true,
          }}
        />

        <FormPicker
          choices={this.state.states.map(({ id, name }) => ({
            label: name,
            value: id,
          }))}
          defaultValue={this.state.form.state ? this.state.form.state : null}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={(state, isValid) => {
            this.updateFormField({ state });
            this.onStateSelect(state);
            !isValid
              ? this.addInvalidField("state")
              : this.removeInvalidField("state");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          propagateError={this.props.propagateFormErrors}
          text="State"
          validators={{
            required: true,
          }}
        />

        <FormPicker
          choices={this.state.lgas.map(({ id, name }) => ({
            label: name,
            value: id,
          }))}
          defaultValue={this.state.form.lga}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={(lga, isValid) => {
            this.updateFormField({ lga });
            !isValid
              ? this.addInvalidField("lga")
              : this.removeInvalidField("lga");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          propagateError={this.props.propagateFormErrors}
          text="LGA"
          validators={{
            required: true,
          }}
        />

        <FormInput
          autoCompleteType="street-address"
          defaultValue={this.state.form.address}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(address, isValid) => {
            this.updateFormField({ address });
            !isValid
              ? this.addInvalidField("address")
              : this.removeInvalidField("address");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="1674C, Oko-Awo Rd."
          propagateError={this.props.propagateFormErrors}
          text="Address"
          textInputRef={(input) => (this.address = input)}
          validators={{
            minLength: MIN_ADDRESS_LENGTH,
            regex: "sentence",
            required: true,
          }}
        />

        <FormInput
          autoCompleteType="street-address"
          defaultValue={this.state.form.closestLandmark}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(closestLandmark, isValid) => {
            this.updateFormField({ closestLandmark });
            !isValid
              ? this.addInvalidField("closestLandmark")
              : this.removeInvalidField("closestLandmark");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="Closest landmark"
          propagateError={this.props.propagateFormErrors}
          text="Closest Landmark"
          textInputRef={(input) => (this.closestLandmark = input)}
          validators={{
            minLength: MIN_ADDRESS_LENGTH,
            regex: "sentence",
            required: true,
          }}
        />
      </React.Fragment>
    );
  }
}

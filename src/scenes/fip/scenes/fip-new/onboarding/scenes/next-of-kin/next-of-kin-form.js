import React from "react";

import BaseForm from "../../../../../../../components/base-form";
import FormCheckbox from "../../../../../../../components/form-controls/form-checkbox";
import FormInput from "../../../../../../../components/form-controls/form-input";
import FormPhone from "../../../../../../../components/form-controls/form-phone";
import FormPicker from "../../../../../../../components/form-controls/form-picker";
import {
  MIN_ADDRESS_LENGTH,
  MIN_NAME_LENGTH,
  MIN_NIGERIA_PHONE_LENGTH,
} from "../../../../../../../constants/fields";
import Relationships from "../../../../../../../fixtures/relationships";
import styles from "../../styles";

export class FipAgentNextOfKinInformationForm extends BaseForm {
  requiredFields = [
    "firstName",
    "lastName",
    "phone",
    "gender",
    "relationship",
    "address",
  ];

  state = {
    form: {
      firstName: null,
      lastName: null,
      phone: null,
      gender: null,
      relationship: null,
      address: null,
    },
    invalidFields: [],
    lgas: [],
    states: [],
  };

  constructor() {
    super();
  }

  componentDidMount() {
    console.log(this.props.application, "next apps");
    const applicantDetails = this.props.application;
    const nextOfKinDetails = applicantDetails.nextOfKin || {};

    this.setState({
      nextOfKinDetails,
      form: this.serializeApiData(nextOfKinDetails),
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.application !== prevProps.application) {
      const applicantDetails = this.props.application;
      const nextOfKinDetails = applicantDetails.nextOfKin || {};

      this.setState({
        nextOfKinDetails,
        form: this.serializeApiData(nextOfKinDetails),
      });
    }
  }
  serializeApiData(nextOfKinDetails) {
    const {
      firstName,
      surname,
      phoneNumber,
      gender,
      relationship,
      address,
    } = nextOfKinDetails;

    return {
      firstName: firstName || null,
      lastName: surname || null,
      phone: phoneNumber ? `0${phoneNumber.slice(3)}` : null,
      gender: gender || null,
      relationship: relationship || null,
      address: address || null,
    };
  }

  serializeFormData() {
    const {
      address,
      firstName,
      gender,
      lastName,
      phone,
      relationship,
    } = this.state.form;

    return {
      firstName,
      surname: lastName,
      phoneNumber: phone ? `+234${phone}` : null,
      gender,
      relationship,
      address,
    };
  }

  render() {
    return (
      <React.Fragment>
        <FormInput
          autoCompleteType="name"
          defaultValue={
            this.state.form.firstName ? this.state.form.firstName : ""
          }
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(firstName, isValid) => {
            this.updateFormField({ firstName });
            !isValid
              ? this.addInvalidField("firstName")
              : this.removeInvalidField("firstName");
          }}
          onSubmitEditing={() => {
            this.lastName.focus();
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="First name"
          propagateError={this.props.propagateFormErrors}
          text="First Name"
          textInputRef={(input) => (this.firstName = input)}
          validators={{
            minLength: MIN_NAME_LENGTH,
            regex: "name",
            required: true,
          }}
        />

        <FormInput
          autoCompleteType="name"
          defaultValue={
            this.state.form.lastName ? this.state.form.lastName : ""
          }
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(lastName, isValid) => {
            this.updateFormField({ lastName });
            !isValid
              ? this.addInvalidField("lastName")
              : this.removeInvalidField("lastName");
          }}
          onSubmitEditing={() => {
            this.phone.focus();
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="Last name"
          propagateError={this.props.propagateFormErrors}
          text="Last Name"
          textInputRef={(input) => (this.lastName = input)}
          validators={{
            minLength: MIN_NAME_LENGTH,
            regex: "name",
            required: true,
          }}
        />

        <FormPhone
          autoCompleteType="tel"
          defaultValue={this.state.form.phone}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType="number-pad"
          onChangeText={(phone, isValid) => {
            this.updateFormField({ phone });
            !isValid
              ? this.addInvalidField("phone")
              : this.removeInvalidField("phone");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="08012345678"
          propagateError={this.props.propagateFormErrors}
          text="Phone Number"
          textInputRef={(input) => (this.phone = input)}
          validators={{
            length: MIN_NIGERIA_PHONE_LENGTH,
            required: true,
          }}
        />

        <FormCheckbox
          defaultValue={this.state.form.gender}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          text="Gender"
          options={["Male", "Female"]}
          onSelect={(gender, isValid) => {
            this.updateFormField({ gender });
            !isValid
              ? this.addInvalidField("gender")
              : this.removeInvalidField("gender");
          }}
          propagateError={this.props.propagateFormErrors}
          validators={{
            required: true,
          }}
        />

        <FormPicker
          choices={Relationships.map(({ id, name }) => ({
            label: name,
            value: id,
          }))}
          defaultValue={this.state.form.relationship}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={(relationship, isValid) => {
            this.updateFormField({ relationship });
            !isValid
              ? this.addInvalidField("relationship")
              : this.removeInvalidField("relationship");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          propagateError={this.props.propagateFormErrors}
          text="Relationship"
          validators={{
            required: true,
          }}
        />

        <FormInput
          autoCompleteType="name"
          defaultValue={this.state.form.address ? this.state.form.address : ""}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(address, isValid) => {
            this.updateFormField({ address });
            !isValid
              ? this.addInvalidField("address")
              : this.removeInvalidField("address");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="Address"
          propagateError={this.props.propagateFormErrors}
          text="Address"
          textInputRef={(input) => (this.address = input)}
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

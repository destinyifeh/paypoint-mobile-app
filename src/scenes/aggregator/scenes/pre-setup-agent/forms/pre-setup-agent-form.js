import Moment from "moment";
import React from "react";
import FormInput from "../../../../../components/form-controls/form-input";
import FormPicker from "../../../../../components/form-controls/form-picker";

import BaseForm from "../../../../../components/base-form";
import FormDate from "../../../../../components/form-controls/form-date";
import FormPhone from "../../../../../components/form-controls/form-phone";
import { ERROR_STATUS } from "../../../../../constants/api";
import {
  BVN_LENGTH,
  MIN_NIGERIA_PHONE_LENGTH,
  PAST_DATE,
} from "../../../../../constants/fields";
import Onboarding from "../../../../../services/api/resources/onboarding";
import UserManagement from "../../../../../services/api/resources/user-management";
import { computePastDate } from "../../../../../utils/calendar";
import styles from "../styles";

const GENDER_TYPES = [
  {
    name: "Male",
    value: "Male",
  },
  {
    name: "Female",
    value: "Female",
  },
];

export default class PreSetupAgentForm extends BaseForm {
  state = {
    form: {},
    invalidFields: [],
  };

  requiredFiles = [
    "phone",
    "repeatPhone",
    "email",
    "repeatEmail",
    "gender",
    "dateOfBirth",
  ];

  userManagement = new UserManagement();
  onboarding = new Onboarding();

  constructor() {
    super();
  }

  async checkPhoneValidity() {
    // TODO make API Call here
    return await this.userManagement.checkUserExistsOnPassport(
      this.state.form.phone
    );
  }

  async checkEmailValidity() {
    // TODO make API Call here

    const result = await this.userManagement.checkUserExistsOnPassport(
      this.state.form.email
    );

    return result;
  }

  async checkBvnValidity() {
    if (this.state.form.bvn && this.state.form.dateOfBirth) {
      const dob = Moment(this.state.form.dateOfBirth, "DD-MM-YYYY").format(
        "YYYY-MM-DD"
      );
      const payload = {
        bvnNumber: this.state.form.bvn,
        bvnDateOfBirth: dob,
      };
      const result = await this.onboarding.validateBVNDetailsAggregator(
        payload
      );

      if (result.status !== ERROR_STATUS) {
        this.setState({
          bvnIsValid: true,
        });
      }
      return result;
    }
  }

  serializeApiData(applicantDetails) {
    return {
      firstName: applicantDetails.firstName,
      lastName: applicantDetails.surname,
      middleName: applicantDetails.middleName,
      phone: `${
        applicantDetails.phoneNumber
          ? `0${applicantDetails.phoneNumber.slice(3)}`
          : ""
      }`,
      email: applicantDetails.emailAddress,
      bvn: applicantDetails.bvn,
      dateOfBirth: applicantDetails.dateOfBirth,
    };
  }

  serializeFormData() {
    const { gender, phone, email, bvn, dateOfBirth } = this.state.form;

    return {
      gender,
      phoneNumber: `+234${phone.slice(-10)}`,
      emailAddress: email,
      bvn,
      dob: Moment(dateOfBirth, "DD-MM-YYYY").format("YYYY-MM-DD"),
    };
  }

  render() {
    return (
      <React.Fragment>
        <FormPhone
          autoCompleteType="tel"
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType="number-pad"
          onChangeText={(phone, isValid) => {
            this.updateFormField({
              phone,
            });
            !isValid
              ? this.props.addInvalidField("phone")
              : this.props.removeInvalidField("phone");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="08012345678"
          propagateError={this.props.propagateFormErrors}
          onSubmitEditing={() => {
            this.email.focus();
          }}
          showValidIndicator={true}
          text="Phone Number"
          textInputRef={(input) => (this.phone = input)}
          validators={{
            asyncFunction_: {
              errorToDisplay: "Phone number already registered!",
              func: this.checkPhoneValidity.bind(this),
              test: ({ status }) => {
                // If response is 404 NOT FOUND, return TRUE (GOOD).
                return status === ERROR_STATUS;
              },
            },
            length: MIN_NIGERIA_PHONE_LENGTH,
            required: true,
          }}
        />

        <FormPhone
          autoCompleteType="tel"
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType="number-pad"
          onChangeText={(repeatPhone, isValid) => {
            this.updateFormField({
              repeatPhone,
            });
            !isValid
              ? this.props.addInvalidField("repeatPhone")
              : this.props.removeInvalidField("repeatPhone");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="08012345678"
          propagateError={this.props.propagateFormErrors}
          onSubmitEditing={() => {
            this.email.focus();
          }}
          showValidIndicator={true}
          text="Repeat Phone:"
          textInputRef={(input) => (this.repeatPhone = input)}
          validators={{
            equalTo: this.state.form.phone,
            length: MIN_NIGERIA_PHONE_LENGTH,
            required: true,
          }}
        />

        <FormInput
          autoCapitalize="none"
          autoCompleteType="email"
          // defaultValue={this.state.form.email}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType="email-address"
          leftIcon="mail"
          onChangeText={(email, isValid) => {
            this.updateFormField({ email });
            !isValid
              ? this.props.addInvalidField("email")
              : this.props.removeInvalidField("email");
          }}
          onSubmitEditing={() => {
            this.repeatEmail.focus();
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="johndoe@example.com"
          propagateError={this.props.propagateFormErrors}
          showValidIndicator={true}
          text="Email Address"
          textContentType="emailAddress"
          textInputRef={(input) => (this.email = input)}
          validators={{
            asyncFunction_: {
              errorToDisplay: "Email already registered!",
              func: this.checkEmailValidity.bind(this),
              test: ({ status }) => {
                // If response is 404 NOT FOUND, return TRUE (GOOD).
                return status === ERROR_STATUS;
              },
            },
            email: true,
            required: true,
            minLength: 5,
          }}
        />

        <FormInput
          autoCapitalize="none"
          autoCompleteType="email"
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType="email-address"
          leftIcon="mail"
          onChangeText={(repeatEmail, isValid) => {
            this.updateFormField({
              repeatEmail: repeatEmail,
            });
            !isValid
              ? this.props.addInvalidField("repeatEmail")
              : this.props.removeInvalidField("repeatEmail");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder=""
          propagateError={this.props.propagateFormErrors}
          showValidIndicator={true}
          text="Repeat Email:"
          textInputRef={(input) => (this.repeatEmail = input)}
          validators={{
            email: true,
            equalTo: this.state.form.email,
            required: true,
          }}
        />
        <FormPicker
          choices={GENDER_TYPES.map(({ name, value }) => ({
            label: name,
            value,
          }))}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={(gender, isValid) => {
            this.updateFormField({
              gender,
            });
            !isValid
              ? this.props.addInvalidField("gender")
              : this.props.removeInvalidField("gender");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          propagateError={this.props.propagateFormErrors}
          text="Gender"
          validators={{
            required: true,
          }}
        />

        <FormDate
          innerContainerStyle={styles.formInputInnerContainerStyle}
          maxDate={computePastDate(18, "years")}
          minDate={computePastDate(PAST_DATE)}
          onDateSelect={(dateOfBirth, isValid) => {
            this.updateFormField({ dateOfBirth });
            !isValid
              ? this.props.addInvalidField("dateOfBirth")
              : this.props.removeInvalidField("dateOfBirth");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="Pick date"
          propagateError={this.props.propagateFormErrors}
          text="Date of Birth:"
          textInputRef={(input) => (this.dateOfBirth = input)}
          validators={{
            required: true,
          }}
          width="100%"
        />

        <FormInput
          autoCompleteType="tel"
          defaultValue={this.state.form.bvn}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType="number-pad"
          onChangeText={(bvn, isValid) => {
            this.updateFormField({ bvn });
            !isValid
              ? this.props.addInvalidField("bvn")
              : this.props.removeInvalidField("bvn");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder=""
          propagateError={this.props.propagateFormErrors}
          showValidIndicator
          text="BVN"
          textInputRef={(input) => (this.bvn = input)}
          validators={{
            asyncFunction_: {
              func: this.checkBvnValidity.bind(this),
              test: ({ status, response }) => {
                // If response is 404 NOT FOUND, return TRUE (GOOD).
                return {
                  status: status !== ERROR_STATUS,
                  errorToDisplay: response?.description,
                };
              },
            },
            required: true,
            length: BVN_LENGTH,
          }}
        />
      </React.Fragment>
    );
  }
}

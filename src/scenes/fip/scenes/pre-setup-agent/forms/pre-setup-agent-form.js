import Moment from "moment";
import React from "react";
import FormInput from "../../../../../components/form-controls/form-input";
import FormPicker from "../../../../../components/form-controls/form-picker";

import AlertStrip from "../../../../../components/alert-strip";
import BaseForm from "../../../../../components/base-form";
import FormDate from "../../../../../components/form-controls/form-date";
import FormPhone from "../../../../../components/form-controls/form-phone";
import { ERROR_STATUS } from "../../../../../constants/api";
import {
  BVN_LENGTH,
  MIN_NAME_LENGTH,
  MIN_NIGERIA_PHONE_LENGTH,
  PAST_DATE,
} from "../../../../../constants/fields";
import UserManagement from "../../../../../services/api/resources/user-management";
import { computePastDate } from "../../../../../utils/calendar";
import styles from "../styles";
const AGENT_TYPES = [
  {
    name: "Agent",
    value: 4,
  },
  {
    name: "Super Agent",
    value: 3,
  },
];

export default class PreSetupAgentForm extends BaseForm {
  requiredFields = [
    "aggregator",
    "firstName",
    "lastName",
    "phone",
    "repeatPhone",
    "email",
    "repeatEmail",
    "bvn",
    "agentType",
    "dateOfBirth",
  ];

  state = {
    form: {},
    invalidFields: [],
  };

  userManagement = new UserManagement();

  constructor() {
    super();

    this.matchUserEmailAndMobile = this.matchUserEmailAndMobile.bind(this);

    this.fields = [
      this.firstName,
      this.lastName,
      this.email,
      this.repeatEmail,
      this.bvn,
      this.phone,
      this.repeatPhone,
      this.dateOfBirth,
    ];
  }

  async checkPhoneValidity() {
    // TODO make API Call here
    return await this.userManagement.checkUserExistsOnPassport(
      this.state.form.phone
    );
  }

  async checkEmailValidity() {
    // TODO make API Call here
    console.log("MAKING API CALL...");

    const result = await this.userManagement.checkUserExistsOnPassport(
      this.state.form.email
    );

    console.log({ result });

    return result;
  }

  // clear() {
  //   this.firstName.clear();
  //   this.lastName.clear();
  //   this.phone.clear();
  //   this.repeatPhone.clear();
  //   this.email.clear();
  //   this.repeatEmail.clear();
  //   this.bvn.clear();
  //   this.dateOfBirth.clear();
  //   this.setState({
  //     form: {},
  //     invalidFields: [],
  //     isValid: false,
  //   });
  // }

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
    const {
      agentType,
      aggregator,
      firstName,
      middleName,
      lastName,
      phone,
      email,
      bvn,
      dateOfBirth,
    } = this.state.form;

    return {
      agentType,
      firstName,
      middleName,
      referralCode: aggregator,
      surname: lastName,
      phoneNumber: `+234${phone.slice(1)}`,
      emailAddress: email,
      bvnVerificationStatus: "NOT_VERIFIED",
      bvn,
      dob: Moment(dateOfBirth, "DD-MM-YYYY").format("YYYY-MM-DD"),
    };
  }

  async matchUserEmailAndMobile() {
    this.setState({
      emailAndPhoneDoMatch: null,
    });

    const result = await this.userManagement.matchUserEmailAndMobile(
      this.state.form.email,
      this.state.form.phone
    );

    console.log({ result });

    return result;
  }

  render() {
    const { superAgents } = this.props;

    return (
      <React.Fragment>
        <FormInput
          autoCompleteType="name"
          // defaultValue={this.state.form.firstName}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(firstName, isValid) => {
            this.updateFormField({
              firstName,
            });
            !isValid
              ? this.addInvalidField("firstName")
              : this.removeInvalidField("firstName");
          }}
          onSubmitEditing={() => {
            this.lastName.focus();
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="John"
          propagateError={this.props.propagateFormErrors}
          text="First Name:"
          textInputRef={(input) => (this.firstName = input)}
          validators={{
            minLength: MIN_NAME_LENGTH,
            regex: "name",
            required: true,
          }}
        />

        <FormInput
          autoCompleteType="name"
          // defaultValue={this.state.form.lastName}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(lastName, isValid) => {
            this.updateFormField({
              lastName,
            });
            !isValid
              ? this.addInvalidField("lastName")
              : this.removeInvalidField("lastName");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="Doe"
          propagateError={this.props.propagateFormErrors}
          onSubmitEditing={() => {
            this.phone.focus();
          }}
          text="Last Name:"
          textInputRef={(input) => (this.lastName = input)}
          validators={{
            minLength: MIN_NAME_LENGTH,
            regex: "name",
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
              ? this.addInvalidField("dateOfBirth")
              : this.removeInvalidField("dateOfBirth");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="Pick date"
          propagateError={this.props.propagateFormErrors}
          text="Date of Birth:"
          textInputRef={(input) => (this.dateOfBirth = input)}
          validators={{
            required: true,
          }}
        />

        <FormPhone
          autoCompleteType="tel"
          // defaultValue={this.state.form.phone}
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
          onSubmitEditing={() => {
            this.repeatPhone.focus();
          }}
          showValidIndicator={true}
          text="Phone:"
          textInputRef={(input) => (this.phone = input)}
          validators={{
            asyncFunction_: {
              errorToDisplay:
                "Phone number already registered. Try another number or login with your existing credentials!",
              func: this.checkPhoneValidity.bind(this),
              test: ({ status }) => {
                console.log(status);

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
              ? this.addInvalidField("repeatPhone")
              : this.removeInvalidField("repeatPhone");
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
              ? this.addInvalidField("email")
              : this.removeInvalidField("email");
          }}
          onSubmitEditing={() => {
            this.repeatEmail.focus();
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="johndoe@example.com"
          propagateError={this.props.propagateFormErrors}
          showValidIndicator={true}
          text="Email:"
          textContentType="emailAddress"
          textInputRef={(input) => (this.email = input)}
          validators={{
            asyncFunction_: {
              errorToDisplay:
                "Email already registered. Try another email or login with your existing credentials!",
              func: this.checkEmailValidity.bind(this),
              test: ({ status }) => {
                console.log(status);

                // If response is 404 NOT FOUND, return TRUE (GOOD).
                return status === ERROR_STATUS;
              },
            },
            email: true,
            required: true,
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
              ? this.addInvalidField("repeatEmail")
              : this.removeInvalidField("repeatEmail");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="johndoe@example.com"
          propagateError={this.props.propagateFormErrors}
          showValidIndicator={true}
          text="Repeat Email:"
          textContentType="emailAddress"
          textInputRef={(input) => (this.repeatEmail = input)}
          validators={{
            email: true,
            equalTo: this.state.form.email,
            required: true,
          }}
        />
        <AlertStrip
          content={`Dial *565*0# to securely get your BVN from your network provider`}
          variant="information"
        />

        <FormPhone
          autoCompleteType="tel"
          defaultValue={this.state.form.bvn}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType="number-pad"
          onChangeText={(bvn, isValid) => {
            this.updateFormField({ bvn });
            !isValid
              ? this.addInvalidField("bvn")
              : this.removeInvalidField("bvn");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="**********"
          propagateError={this.props.propagateFormErrors}
          text="BVN:"
          textInputRef={(input) => (this.bvn = input)}
          validators={{
            length: BVN_LENGTH,
            required: true,
          }}
        />

        <FormPicker
          choices={
            superAgents
              ? superAgents.map(({ businessName, referralCode }) => ({
                  label: businessName,
                  value: referralCode,
                }))
              : []
          }
          defaultValue={this.state.form.aggregator}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={(aggregator, isValid) => {
            this.updateFormField({
              aggregator,
            });
            !isValid
              ? this.addInvalidField("aggregator")
              : this.removeInvalidField("aggregator");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          propagateError={this.props.propagateFormErrors}
          text="Aggregator:"
          validators={{
            required: true,
          }}
        />

        <FormPicker
          choices={AGENT_TYPES.map(({ name, value }) => ({
            label: name,
            value,
          }))}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={(agentType, isValid) => {
            this.updateFormField({
              agentType,
            });
            !isValid
              ? this.addInvalidField("agentType")
              : this.removeInvalidField("agentType");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          propagateError={this.props.propagateFormErrors}
          text="Agent Class:"
          validators={{
            required: true,
          }}
        />
      </React.Fragment>
    );
  }
}

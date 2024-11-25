import React from "react";
import { View } from "react-native";
import AlertStrip from "../../components/alert-strip";
import BaseForm from "../../components/base-form";
import FormDate from "../../components/form-controls/form-date";
import FormInput from "../../components/form-controls/form-input";
import FormPhone from "../../components/form-controls/form-phone";
import FormPicker from "../../components/form-controls/form-picker";
import { NIGERIA_SHORT_CODE } from "../../constants";
import { ERROR_STATUS } from "../../constants/api";
import {
  BVN_LENGTH,
  MIN_NAME_LENGTH,
  MIN_NIGERIA_PHONE_LENGTH,
  PAST_DATE,
} from "../../constants/fields";
import HowYouHeardAboutUs from "../../fixtures/how_you_heard_about_us";
import UserManagement from "../../services/api/resources/user-management";
import { computePastDate } from "../../utils/calendar";
import { formatPhoneNumber } from "../../utils/formatters";
import { loadData } from "../../utils/storage";
import styles from "./styles";
export default class SignupForm extends BaseForm {
  requiredFields = [
    "firstName",
    "lastName",
    "phone",
    // 'email',
    "bvn",
    "dateOfBirth",
    "password",
    "howYouHeardAboutUs",
  ];

  userManagement = new UserManagement();

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

  constructor() {
    super();

    this.state = {
      user: {
        confirmPassword: null,
        firstName: null,
        lastName: null,
        phone: null,
        email: null,
        password: null,
        howYouHeardAboutUs: null,
        bvn: null,
        dateOfBirth: null,
      },
      form: {
        confirmPassword: null,
        firstName: null,
        lastName: null,
        phone: null,
        email: null,
        password: null,
        howYouHeardAboutUs: null,
        bvnVerificationStatus: "NOT_VERIFIED",
        bvn: null,
        dateOfBirth: null,
      },
      invalidFields: [],
    };
  }

  serializeFormData() {
    const { form } = this.state;

    return {
      confirmPassword: form.confirmPassword,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      mobileNo: formatPhoneNumber(NIGERIA_SHORT_CODE, form.phone),
      password: form.password,
      email: form.email,
      howYouHeardAboutUs: form.howYouHeardAboutUs,
      domainCode: "app",
      bvnVerificationStatus: form.bvnVerificationStatus,
      bvn: form.bvn,
      dateOfBirth: form.dateOfBirth,
    };
  }

  async loadData() {
    const agentData = JSON.parse(await loadData("agentSignupData"));
    console.log(agentData, "agentino data");
    this.setState({
      user: {
        ...this.state.user,
        phone: `0${agentData.mobileNo.slice(-10)}`,
        email: agentData.email,
        firstName: agentData.firstName,
        lastName: agentData.lastName,
        howYouHeardAboutUs: agentData.howYouHeardAboutUs,
        dateOfBirth: agentData.dateOfBirth,
        password: agentData.password,
        confirmPassword: agentData.confirmPassword,
        bvn: agentData.bvn,
      },
      form: {
        ...this.state.form,
        dateOfBirth: agentData.dateOfBirth,
      },
    });
  }

  componentDidMount() {
    try {
      this.loadData();
    } catch {}
  }

  render() {
    return (
      <View>
        <FormInput
          defaultValue={this.state.user.firstName}
          autoCompleteType="name"
          disabled={this.props.isDisabled}
          focus={true}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(firstName, isValid) => {
            console.log("FIRST NAME IS VALID", isValid);
            this.updateFormField({ firstName });
            !isValid
              ? this.addInvalidField("firstName")
              : this.removeInvalidField("firstName");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="John"
          propagateError={this.props.propagateFormErrors}
          onSubmitEditing={() => {
            this.lastName.focus();
          }}
          text="First Name:"
          textInputRef={(input) => (this.firstName = input)}
          validators={{
            minLength: MIN_NAME_LENGTH,
            required: true,
          }}
        />
        <FormInput
          defaultValue={this.state.user.lastName}
          autoCompleteType="name"
          disabled={this.props.isDisabled}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          minValueLength={MIN_NAME_LENGTH}
          onChangeText={(lastName, isValid) => {
            this.updateFormField({ lastName });
            !isValid
              ? this.addInvalidField("lastName")
              : this.removeInvalidField("lastName");
          }}
          onSubmitEditing={() => this.phone.focus()}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="Doe"
          propagateError={this.props.propagateFormErrors}
          text="Last Name:"
          textInputRef={(input) => (this.lastName = input)}
          validators={{
            minLength: MIN_NAME_LENGTH,
            required: true,
          }}
        />

        <FormPhone
          defaultValue={this.state.user.phone}
          autoCompleteType="tel"
          disabled={
            this.state.user.phone !== null &&
            this.state.user.phone !== undefined
              ? true
              : false
          }
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType="number-pad"
          leftIcon="phone"
          onChangeText={(phone, isValid) => {
            this.updateFormField({ phone });
            !isValid
              ? this.addInvalidField("phone")
              : this.removeInvalidField("phone");
          }}
          onSubmitEditing={() => this.password.focus()}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="08012345678"
          propagateError={this.props.propagateFormErrors}
          showValidIndicator
          text="Phone number:"
          textInputRef={(input) => (this.phone = input)}
          validators={
            this.state.user.phone !== null &&
            this.state.user.phone !== undefined
              ? ""
              : {
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
                }
          }
        />

        <AlertStrip
          content={`Dial *565*0# to securely get your BVN from your network provider`}
          variant="information"
        />

        <FormPhone
          defaultValue={this.state.user.bvn}
          autoCompleteType="tel"
          disabled={this.props.isDisabled}
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

        <FormDate
          defaultValue={this.state.form.dateOfBirth}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          disabled={this.props.isDisabled}
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
        <FormInput
          defaultValue={this.state.user.email}
          autoCapitalize="none"
          autoCompleteType="email"
          disabled={
            this.state.user.email !== null &&
            this.state.user.email !== undefined
              ? true
              : false
          }
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType="email-address"
          leftIcon="mail"
          onChangeText={(email, isValid) => {
            this.updateFormField({ email });
            !isValid
              ? this.addInvalidField("email")
              : this.removeInvalidField("email");
          }}
          onSubmitEditing={() => this.password.focus()}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="johndoe@example.com"
          propagateError={this.props.propagateFormErrors}
          showValidIndicator
          text="Email:"
          textContentType="emailAddress"
          textInputRef={(input) => (this.email = input)}
          validators={
            this.state.user.email !== null &&
            this.state.user.email !== undefined
              ? ""
              : {
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
                  required: false,
                }
          }
        />

        <FormInput
          defaultValue={this.state.user.password}
          autoCapitalize="none"
          disabled={
            this.state.user.password !== null &&
            this.state.user.password !== undefined
              ? true
              : false
          }
          innerContainerStyle={styles.formInputInnerContainerStyle}
          leftIcon="vpn-key"
          onChangeText={(password, isValid) => {
            this.updateFormField({ password });
            !isValid
              ? this.addInvalidField("password")
              : this.removeInvalidField("password");
          }}
          onSubmitEditing={() => this.confirmPassword.focus()}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="Password"
          propagateError={this.props.propagateFormErrors}
          secureTextEntry={true}
          text="Password or PIN:"
          textInputRef={(input) => (this.password = input)}
          validators={{
            password: true,
            required: true,
          }}
        />

        <FormInput
          defaultValue={this.state.user.confirmPassword}
          autoCapitalize="none"
          disabled={
            this.state.user.confirmPassword !== null &&
            this.state.user.confirmPassword !== undefined
              ? true
              : false
          }
          innerContainerStyle={styles.formInputInnerContainerStyle}
          leftIcon="vpn-key"
          onChangeText={(confirmPassword, isValid) => {
            this.updateFormField({
              confirmPassword,
            });
            !isValid
              ? this.addInvalidField("confirmPassword")
              : this.removeInvalidField("confirmPassword");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="Repeat your Password or PIN"
          propagateError={this.props.propagateFormErrors}
          secureTextEntry={true}
          text="Confirm Password or PIN:"
          textInputRef={(input) => (this.confirmPassword = input)}
          validators={{
            equalTo: this.state.form.password,
            password: true,
            required: true,
          }}
        />

        <FormPicker
          defaultValue={this.state.user.howYouHeardAboutUs}
          choices={HowYouHeardAboutUs}
          disabled={
            this.state.user.howYouHeardAboutUs !== null &&
            this.state.user.howYouHeardAboutUs !== undefined
              ? true
              : false
          }
          showTextInputForOption="Other"
          onSelect={(howYouHeardAboutUs, isValid) => {
            this.updateFormField({
              howYouHeardAboutUs,
            });
            !isValid
              ? this.addInvalidField("howYouHeardAboutUs")
              : this.removeInvalidField("howYouHeardAboutUs");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          propagateError={this.props.propagateFormErrors}
          text="How you heard about us:"
          validators={{
            required: true,
          }}
        />
      </View>
    );
  }
}

import Moment from "moment";
import React from "react";
import { Text, View } from "react-native";
import AlertStrip from "../../../../../components/alert-strip";
import BaseForm from "../../../../../components/base-form";
import FormDate from "../../../../../components/form-controls/form-date";
import FormInput from "../../../../../components/form-controls/form-input";
import FormPhone from "../../../../../components/form-controls/form-phone";
import {
  BVN_LENGTH,
  MIN_NAME_LENGTH,
  MIN_NIGERIA_PHONE_LENGTH,
  PAST_DATE,
} from "../../../../../constants/fields";
import { FONT_SIZE_SMALL } from "../../../../../constants/styles";
import { computePastDate } from "../../../../../utils/calendar";
import { formatPhoneNumberToReadable } from "../../../../../utils/formatters";
import styles from "../styles";

export class BvnVerification extends BaseForm {
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
      dateOfBirth: null,
    },
    applicantDetails: null,
    invalidFields: [],
  };

  constructor() {
    super();
  }

  componentDidMount() {
    const applicantDetails = this.props.application.applicantDetails;

    this.setState({
      applicantDetails: applicantDetails,
      form: this.serializeApplicantData(this.props.application),
    });
  }

  serializeApplicantData(application) {
    const applicantDetails = application.applicantDetails;
    return {
      firstName: applicantDetails.firstName,
      lastName: applicantDetails.surname,
      agentPhoneNumber: `${
        applicantDetails.phoneNumber
          ? formatPhoneNumberToReadable(applicantDetails.phoneNumber)
          : ""
      }`,
      phone: `${
        applicantDetails.phoneNumber
          ? formatPhoneNumberToReadable(applicantDetails.phoneNumber)
          : ""
      }`,
      email: applicantDetails.emailAddress,
    };
  }

  serializeApiData(bvnDetails) {
    const { firstName, surname, phoneNumber, bvn, dob } = bvnDetails;

    return {
      firstName,
      lastName: surname,
      phone: phoneNumber ? `0${phoneNumber.slice(-10)}` : null,
      // agentPhoneNumber: phoneNumber ? `0${phoneNumber.slice(-10)}` : null,
      bvn,
      dob,
    };
  }

  serializeFormData() {
    const { firstName, lastName, phone, bvn, dateOfBirth } = this.state.form;

    return {
      bvnFirstName: firstName,
      bvnLastName: lastName,
      bvnPhoneNumber: phone ? `234${phone.slice(-10)}` : null,
      bvnNumber: bvn,
      bvnDateOfBirth: Moment(dateOfBirth, "DD-MM-YYYY").format("YYYY-MM-DD"),
      agentPhoneNumber: phone ? `234${phone.slice(-10)}` : null,
    };
  }

  render() {
    return (
      <View style={{ paddingLeft: 15, paddingRight: 15 }}>
        <View>
          <Text style={{ fontSize: FONT_SIZE_SMALL }}>
            {"\n"}Please provide your accurate information as it is on your BVN
            {"\n"}
          </Text>
        </View>
        <FormInput
          autoCompleteType="name"
          defaultValue={this.state.form.firstName}
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
          placeholder="Your first name"
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
          defaultValue={this.state.form.lastName}
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
          placeholder="Your last name"
          propagateError={this.props.propagateFormErrors}
          text="Last Name:"
          textInputRef={(input) => (this.lastName = input)}
          validators={{
            minLength: MIN_NAME_LENGTH,
            regex: "name",
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

        <FormDate
          defaultValue={this.state.form.dateOfBirth}
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
          validators={{
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
          text="Phone:"
          textInputRef={(input) => (this.phone = input)}
          validators={{
            length: MIN_NIGERIA_PHONE_LENGTH,
            required: true,
          }}
        />
      </View>
    );
  }
}

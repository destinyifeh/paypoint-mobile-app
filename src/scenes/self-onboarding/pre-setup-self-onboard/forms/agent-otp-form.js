import Moment from "moment";
import React from "react";
// import FormPicker from "../../../../components/form-controls/form-picker";

import BaseForm from "../../../../components/base-form";
import FormInput from "../../../../components/form-controls/form-input";
import { ERROR_STATUS } from "../../../../constants/api";
import { OTP_LENGTH } from "../../../../constants/fields";
import Onboarding from "../../../../services/api/resources/onboarding";
import UserManagement from "../../../../services/api/resources/user-management";
import styles from "../../../signup/styles";


export default class PreSetupSelfOnboardingOtpForm extends BaseForm {
  state = {
    form: {},
    invalidFields: [],
  };

  requiredFiles = [
    "otp",
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
      const result = await this.onboarding.validateBVNDetails(payload);

      if (result.status != ERROR_STATUS) {
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
    const {   firstName,
        lastName,
        mobileNo,
        email,
        gender,
        bvn,
        dob,
        password } = this.props.personalData;

    return {
        firstName,
        lastName,
        mobileNo,
        email,
        bvn,
        dob,
        gender,
        password,
        confirmPassword: password,
        otp: this.state.form.otp,
        domainCode: "app",
    };
  }

  render() {
    return (
      <React.Fragment>
        <FormInput
        disabled={this.props.isDisabled}
        innerContainerStyle={styles.formInputInnerContainerStyle}
        keyboardType='number-pad'
        leftIcon='phone'
        onChangeText={(otp, isValid) => {
          this.updateFormField({otp});
          !isValid ? this.addInvalidField('otp') : this.removeInvalidField('otp');
        }}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder='OTP'
        propagateError={this.props.propagateFormErrors}
        text="Enter OTP:"
        textContentType="oneTimeCode"
        textInputRef={(input) => this.email = input}
        validators={{
          length: OTP_LENGTH,
          required: true,
        }}
      />

      
      </React.Fragment>
    );
  }
}

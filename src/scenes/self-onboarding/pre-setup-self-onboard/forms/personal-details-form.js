import Moment from 'moment';
import React from 'react';
import FormInput from '../../../../components/form-controls/form-input';
// import FormPicker from "../../../../components/form-controls/form-picker";

import AsyncStorage from '@react-native-async-storage/async-storage';
import BaseForm from '../../../../components/base-form';
import FormDate from '../../../../components/form-controls/form-date';
import FormPhone from '../../../../components/form-controls/form-phone';
import FormPicker from '../../../../components/form-controls/form-picker';
import {ERROR_STATUS} from '../../../../constants/api';
import {
  BVN_LENGTH,
  MIN_NIGERIA_PHONE_LENGTH,
  PAST_DATE,
} from '../../../../constants/fields';
import {APPLICATION_SELF_ONBOARDING_PERSONAL_DETAILS} from '../../../../constants/styles';
import Onboarding from '../../../../services/api/resources/onboarding';
import UserManagement from '../../../../services/api/resources/user-management';
import {computePastDate} from '../../../../utils/calendar';
import styles from '../../../signup/styles';
// import styles from "../styles";

const GENDER_TYPES = [
  {
    name: 'Male',
    value: 'male',
  },
  {
    name: 'Female',
    value: 'female',
  },
];

export default class PersonalOnboardingForm extends BaseForm {
  state = {
    form: {},
    invalidFields: [],
  };

  requiredFiles = [
    'phone',
    // "repeatPhone",
    'email',
    // "repeatEmail",
    'gender',
    'bvn',
    'password',
    'confirmPassword',
  ];

  userManagement = new UserManagement();
  onboarding = new Onboarding();

  constructor() {
    super();
  }

  componentDidMount() {
    this.getApplicatId();
  }

  getApplicatId = async () => {
    const application = await AsyncStorage.getItem(
      APPLICATION_SELF_ONBOARDING_PERSONAL_DETAILS,
    );
    console.log(JSON.parse(application), 'NUGAGEE PERSONAL DETAILS CACHED');
    this.initiate(JSON.parse(application));
  };

  initiate = personalDetails => {
    // console.log(JSON.parse(personalDetails), "NUGAGEE BUSSINESS PAGE GETTING APPLICATION 333")

    if (personalDetails !== {}) {
      if (personalDetails.mobileNo) {
        const phone = personalDetails.mobileNo
          ? `0${personalDetails.mobileNo.slice(-10)}`
          : '';
        this.updateFormField({
          phone,
        });
      }
      if (personalDetails.email) {
        const email = personalDetails.email;

        this.updateFormField({
          email,
        });
      }
      if (personalDetails.gender) {
        const gender = personalDetails.gender;

        this.updateFormField({
          gender,
        });
      }
      if (personalDetails.dob) {
        let dateOfBirthArr = personalDetails.dob.split('-');
        dateOfBirthArr =
          dateOfBirthArr[2] + '-' + dateOfBirthArr[1] + '-' + dateOfBirthArr[0];
        const dateOfBirth = dateOfBirthArr;
        this.updateFormField({
          dateOfBirth,
        });
      }
      if (personalDetails.bvn) {
        const bvn = personalDetails.bvn;

        this.updateFormField({
          bvn,
        });
      }
      if (personalDetails.password) {
        const password = personalDetails.password;

        this.updateFormField({
          password,
        });
      }
      if (personalDetails.confirmPassword) {
        const confirmPassword = personalDetails.confirmPassword;

        this.updateFormField({
          confirmPassword,
        });
      }
    }
  };

  async checkPhoneValidity() {
    // TODO make API Call here
    return await this.userManagement.checkUserExistsOnPassport(
      this.state.form.phone,
    );
  }

  async checkEmailValidity() {
    // TODO make API Call here

    const result = await this.userManagement.checkUserExistsOnPassport(
      this.state.form.email,
    );

    return result;
  }

  async checkBvnValidity() {
    if (this.state.form.bvn && this.state.form.dateOfBirth) {
      const dob = Moment(this.state.form.dateOfBirth, 'DD-MM-YYYY').format(
        'YYYY-MM-DD',
      );
      const payload = {
        bvnNumber: this.state.form.bvn,
        bvnDateOfBirth: dob,
      };
      const result = await this.onboarding.validateBVNDetails(payload);

      console.log(result, 'NUGAGEE');
      if (result.status != ERROR_STATUS) {
        this.setState({
          bvnIsValid: true,
        });
        this.updateFormField({firstName: result.response.data.surname});
        this.updateFormField({lastName: result.response.data.firstName});
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
          : ''
      }`,
      email: applicantDetails.emailAddress,
      bvn: applicantDetails.bvn,
      dateOfBirth: applicantDetails.dateOfBirth,
    };
  }

  serializeFormData() {
    const {
      firstName,
      lastName,
      phone,
      email,
      gender,
      bvn,
      dateOfBirth,
      password,
    } = this.state.form;

    return {
      firstName,
      lastName,
      mobileNo: `234${phone.slice(-10)}`,
      email,
      bvn,
      password,
      confirmPassword: password,
      dob: Moment(dateOfBirth, 'DD-MM-YYYY').format('YYYY-MM-DD'),
      domainCode: 'app',
      gender,
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
              ? this.props.addInvalidField('phone')
              : this.props.removeInvalidField('phone');
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="08012345678"
          defaultValue={this.state.form?.phone}
          propagateError={this.props.propagateFormErrors}
          onSubmitEditing={() => {
            this.email.focus();
          }}
          showValidIndicator={true}
          text="Phone Number"
          textInputRef={input => (this.phone = input)}
          validators={{
            asyncFunction_: {
              errorToDisplay: 'Phone number already registered!',
              func: this.checkPhoneValidity.bind(this),
              test: ({status}) => {
                // If response is 404 NOT FOUND, return TRUE (GOOD).
                return status === ERROR_STATUS;
              },
            },
            length: MIN_NIGERIA_PHONE_LENGTH,
            required: true,
          }}
        />

        <FormInput
          autoCapitalize="none"
          autoCompleteType="email"
          defaultValue={this.state.form.email}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType="email-address"
          leftIcon="mail"
          onChangeText={(email, isValid) => {
            this.updateFormField({email});
            !isValid
              ? this.props.addInvalidField('email')
              : this.props.removeInvalidField('email');
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
          textInputRef={input => (this.email = input)}
          validators={{
            asyncFunction_: {
              errorToDisplay: 'Email already registered!',
              func: this.checkEmailValidity.bind(this),
              test: ({status}) => {
                // If response is 404 NOT FOUND, return TRUE (GOOD).
                return status === ERROR_STATUS;
              },
            },
            email: true,
            required: true,
            minLength: 5,
          }}
        />

        <FormPicker
          choices={GENDER_TYPES.map(({name, value}) => ({
            label: name,
            value,
          }))}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={(gender, isValid) => {
            this.updateFormField({
              gender,
            });
            !isValid
              ? this.props.addInvalidField('gender')
              : this.props.removeInvalidField('gender');
          }}
          defaultValue={this.state.form.gender}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          propagateError={this.props.propagateFormErrors}
          text="Gender"
          validators={{
            required: true,
          }}
        />

        <FormDate
          innerContainerStyle={styles.formInputInnerContainerStyle}
          maxDate={computePastDate(18, 'years')}
          minDate={computePastDate(PAST_DATE)}
          defaultValue={this.state.form.dateOfBirth}
          onDateSelect={(dateOfBirth, isValid) => {
            this.updateFormField({dateOfBirth});
            !isValid
              ? this.props.addInvalidField('dateOfBirth')
              : this.props.removeInvalidField('dateOfBirth');
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="Pick date"
          propagateError={this.props.propagateFormErrors}
          text="Date of Birth:"
          textInputRef={input => (this.dateOfBirth = input)}
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
            this.updateFormField({bvn});
            !isValid
              ? this.props.addInvalidField('bvn')
              : this.props.removeInvalidField('bvn');
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder=""
          propagateError={this.props.propagateFormErrors}
          showValidIndicator
          text="BVN"
          textInputRef={input => (this.bvn = input)}
          validators={{
            asyncFunction_: {
              func: this.checkBvnValidity.bind(this),
              test: ({status, response}) => {
                // If response is 404 NOT FOUND, return TRUE (GOOD).
                return {
                  status: status != ERROR_STATUS,
                  errorToDisplay: response?.description,
                  //   errorToDisplay: response?.error,
                };
              },
            },
            required: true,
            length: BVN_LENGTH,
          }}
        />

        <FormInput
          defaultValue={this.state.form.password}
          autoCapitalize="none"
          autoCompleteType="tel"
          keyboardType="number-pad"
          innerContainerStyle={styles.formInputInnerContainerStyle}
          leftIcon="vpn-key"
          onChangeText={(password, isValid) => {
            this.updateFormField({password});
            !isValid
              ? this.props.addInvalidField('password')
              : this.props.removeInvalidField('password');
          }}
          onSubmitEditing={() => this.confirmPassword.focus()}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="Password"
          propagateError={this.props.propagateFormErrors}
          secureTextEntry={true}
          text="Password"
          textInputRef={input => (this.password = input)}
          validators={{
            password: true,
            required: true,
          }}
        />

        <FormInput
          defaultValue={this.state.form.confirmPassword}
          autoCapitalize="none"
          autoCompleteType="tel"
          keyboardType="number-pad"
          innerContainerStyle={styles.formInputInnerContainerStyle}
          leftIcon="vpn-key"
          onChangeText={(confirmPassword, isValid) => {
            this.updateFormField({
              confirmPassword,
            });
            !isValid
              ? this.props.addInvalidField('confirmPassword')
              : this.props.removeInvalidField('confirmPassword');
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="Repeat your Password"
          propagateError={this.props.propagateFormErrors}
          secureTextEntry={true}
          showValidIndicator={true}
          text="Confirm Password"
          textInputRef={input => (this.confirmPassword = input)}
          validators={{
            equalTo: this.state.form.password,
            password: true,
            required: true,
          }}
        />
      </React.Fragment>
    );
  }
}

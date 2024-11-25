import React from 'react';
import FormInput from '../../components/form-controls/form-input';
import BaseForm from '../../components/base-form';
import styles from './styles';
import { OTP_LENGTH } from '../../constants/fields';


export class OtpForm extends BaseForm {
  requiredFields = [
    'repeatPassword',
    'otp',
    'newPassword',
  ];

  constructor() {
    super()

    this.state = {
      form: {
        otp: null
      },
      invalidFields: [],
    };
  }

  render() {
    return <React.Fragment>
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
        text="OTP:"
        textContentType="oneTimeCode"
        textInputRef={(input) => this.email = input}
        validators={{
          length: OTP_LENGTH,
          required: true,
        }}
      />

      <FormInput
        disabled={this.props.isDisabled}
        placeholder='New password'
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(newPassword, isValid) => {
          this.updateFormField({newPassword});
          !isValid ? this.addInvalidField('newPassword') : this.removeInvalidField('newPassword');
        }}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        propagateError={this.props.propagateFormErrors}
        text="New Password:"
        textInputRef={(input) => this.newPassword = input}
        leftIcon='vpn-key'
        secureTextEntry={true}
        validators={{
          password: true,
          required: true,
        }}
      />

      <FormInput
        disabled={this.props.isDisabled}
        placeholder='Repeat password'
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(repeatPassword, isValid) => {
          this.updateFormField({repeatPassword});
          !isValid ? this.addInvalidField('repeatPassword') : this.removeInvalidField('repeatPassword');
        }}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        propagateError={this.props.propagateFormErrors}
        text="Repeat Password:"
        textInputRef={(input) => this.repeatPassword = input}
        leftIcon='vpn-key'
        secureTextEntry={true}
        validators={{
          password: true,
          required: true,
        }}
      />
    </React.Fragment>
  }
}

import React from 'react';
import { View } from 'react-native';
import FormInput from '../../components/form-controls/form-input';
import styles from './styles';
import BaseForm from '../../components/base-form';
import { MIN_NIGERIA_PHONE_LENGTH, OTP_LENGTH } from '../../constants/fields';
import FormPhone from '../../components/form-controls/form-phone';
import { formatPhoneNumberToReadable } from '../../utils/formatters';
import FormPicker from '../../components/form-controls/form-picker';


export class LoginForm extends BaseForm {
  requiredFields = [
    'username',
    'password',
  ];

  constructor() {
    super()

    this.state = {
      form: {
        username: null,
        password: null,
      },
      invalidFields: [],
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { shouldAutoFocus } = this.props;

    console.log({shouldAutoFocus})

    if (shouldAutoFocus) {
      if (
        (this.props.username !== prevProps.username) 
        || (this.props.isFingerprintLoginEnabled !== prevProps.isFingerprintLoginEnabled)
      ) {
        this.props.username && this.props.isFingerprintLoginEnabled === false && this.password.focus();
      }
      if (this.props.hasUserBeenLoaded !== prevProps.hasUserBeenLoaded) {
        !this.props.username && this.phone.focus();
      }
    }
  }

  render() {
    return <View>
      <FormPhone
        autoCompleteType='tel'
        defaultValue={this.props.username ? formatPhoneNumberToReadable(this.props.username) : ''}
        disabled={this.props.isDisabled}
        hidden={this.props.hideEmail}
        innerContainerStyle={styles.formInputInnerContainerStyle}
        keyboardType='number-pad'
        leftIcon='phone'
        onChangeText={(username, isValid) => {
          this.updateFormField({username});
          !isValid ? this.addInvalidField('username') : this.removeInvalidField('username');
        }}
        onSubmitEditing={() => this.password.focus()}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder='08012345678'
        propagateError={this.props.propagateFormErrors}
        text="Phone number:"
        textInputRef={(input) => this.phone = input}
        validators={{
          length: [MIN_NIGERIA_PHONE_LENGTH, 13],
          required: true,
        }}
      />
      {/* <FormInput
        autoCapitalize='none'
        autoCompleteType='email'
        defaultValue={this.props.username}
        disabled={this.props.isDisabled}
        hidden={this.props.hideEmail}
        innerContainerStyle={styles.formInputInnerContainerStyle}
        keyboardType='email-address'
        leftIcon='account-circle'
        onChangeText={(username, isValid) => {
          this.updateFormField({username});
          !isValid ? this.addInvalidField('username') : this.removeInvalidField('username');
        }}
        onSubmitEditing={() => this.password.focus()}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder='Email or Phone Number'
        propagateError={this.props.propagateFormErrors}
        text="Email or Phone Number:"
        textContentType="emailAddress"
        textInputRef={(input) => this.email = input}
        validators={{
          username: true,
          required: true,
        }}
      /> */}

      <FormInput
        autoCapitalize='none'
        defaultValue={this.props.password}
        disabled={this.props.isDisabled}
        innerContainerStyle={styles.formInputInnerContainerStyle}
        leftIcon='vpn-key'
        onChangeText={(password, isValid) => {
          this.updateFormField({password});
          !isValid ? this.addInvalidField('password') : this.removeInvalidField('password');
        }}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder='Password or PIN'
        propagateError={this.props.propagateFormErrors}
        secureTextEntry={true}
        text="Password or PIN:"
        textInputRef={(input) => this.password = input}
        validators={{
          password: true,
          required: true,
        }}
      />
    </View>
  }
}

export class OtpForm extends BaseForm {
  requiredFields = [
    'otp',
  ];

  constructor() {
    super()

    this.state = {
      form: {
        email: null,
        password: null,
      },
      invalidFields: [],
    };
  }

  render() {
    return <View>
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
    </View>
  }
}

export class UsernameForm extends BaseForm {
  requiredFields = [
    'username',
  ];

  constructor() {
    super()

    this.state = {
      form: {
        email: null,
        password: null,
      },
      invalidFields: [],
    };
  }

  componentDidMount() {
    this.props.shouldAutoFocus && this.username.focus();
  }

  componentDidUpdate(prevProps, prevState) {
    const { shouldAutoFocus } = this.props;

    if (shouldAutoFocus !== prevProps.shouldAutoFocus && shouldAutoFocus) {
      this.username.focus();
    }
  }

  render() {
    return <View>
      <FormInput
        disabled={this.props.isDisabled}
        innerContainerStyle={styles.formInputInnerContainerStyle}
        keyboardType='email-address'
        leftIcon='account-circle'
        onChangeText={(username, isValid) => {
          this.updateFormField({username});
          !isValid ? this.addInvalidField('username') : this.removeInvalidField('username');
        }}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder='Email or Phone Number'
        propagateError={this.props.propagateFormErrors}
        text="Email or Phone Number:"
        textContentType="emailAddress"
        textInputRef={(input) => this.username = input}
        validators={{
          required: true,
          username: true
        }}
      />
    </View>
  }
}

export class PasswordForm extends BaseForm {
  requiredFields = [
    'password',
  ];

  constructor() {
    super()

    this.state = {
      form: {
        email: null,
        password: null,
      },
      invalidFields: [],
    };
  }

  componentDidMount() {
    this.props.shouldAutoFocus && this.password.focus();
  }

  componentDidUpdate(prevProps, prevState) {
    const { shouldAutoFocus } = this.props;

    if (shouldAutoFocus) {
      if (
        (this.props.username !== prevProps.username) 
        || (this.props.isFingerprintLoginEnabled !== prevProps.isFingerprintLoginEnabled)
      ) {
        this.props.username && this.props.isFingerprintLoginEnabled === false && this.password?.focus();
      }
      if (this.props.hasUserBeenLoaded !== prevProps.hasUserBeenLoaded) {
        !this.props.username && this.username?.focus();
      }
    }
  }

  render() {
    return <View>
      <FormInput
        autoCapitalize='none'
        defaultValue={this.props.password}
        disabled={this.props.isDisabled}
        innerContainerStyle={styles.formInputInnerContainerStyle}
        leftIcon='vpn-key'
        onChangeText={(password, isValid) => {
          this.updateFormField({password});
          !isValid ? this.addInvalidField('password') : this.removeInvalidField('password');
        }}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder='Password or PIN'
        propagateError={this.props.propagateFormErrors}
        secureTextEntry={true}
        text="Password or PIN:"
        textInputRef={(input) => this.password = input}
        validators={{
          password: true,
          required: true,
        }}
      />
    </View>
  }
}

import React from 'react';
import { View } from 'react-native';

import FormInput from '../../../../../../../components/form-controls/form-input';
import BaseForm from '../../../../../../../components/base-form';
import styles from './styles';


export default class UpdatePasswordForm extends BaseForm {
  requiredFields = [
    'currentPassword',
    'newPassword',
    'repeatPassword',
  ];

  constructor() {
    super()

    this.state = {
      form: {
        currentPassword: null,
        newPassword: null,
        repeatPassword: null,
      },
      invalidFields: [],
    };
  }

  render() {
    return <View>
      <FormInput
        placeholder='Current password or PIN'
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(currentPassword, isValid) => {
          this.updateFormField({currentPassword});
          !isValid ? this.addInvalidField('currentPassword') : this.removeInvalidField('currentPassword');
        }}
        onSubmitEditing={() => this.newPassword.focus()}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        propagateError={this.props.propagateFormErrors}
        text="Current Password or PIN:"
        textInputRef={(input) => this.currentPassword = input}
        leftIcon='vpn-key'
        secureTextEntry={true}
        validators={{
          password: true,
          required: true,
        }}
      />

      <FormInput
        placeholder='New password or PIN'
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(newPassword, isValid) => {
          this.updateFormField({newPassword});
          !isValid ? this.addInvalidField('newPassword') : this.removeInvalidField('newPassword');
        }}
        onSubmitEditing={() => this.repeatPassword.focus()}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        propagateError={this.props.propagateFormErrors}
        text="New Password or PIN:"
        textInputRef={(input) => this.newPassword = input}
        leftIcon='vpn-key'
        secureTextEntry={true}
        validators={{
          password: true,
          required: true,
        }}
      />

      <FormInput
        placeholder='Repeat password or PIN'
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(repeatPassword, isValid) => {
          this.updateFormField({repeatPassword});
          !isValid ? this.addInvalidField('repeatPassword') : this.removeInvalidField('repeatPassword');
        }}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        propagateError={this.props.propagateFormErrors}
        text="Repeat Password or PIN:"
        textInputRef={(input) => this.repeatPassword = input}
        leftIcon='vpn-key'
        secureTextEntry={true}
        validators={{
          equalTo: this.state.form.newPassword,
          password: true,
          required: true,
        }}
      />
    </View>
  }
}

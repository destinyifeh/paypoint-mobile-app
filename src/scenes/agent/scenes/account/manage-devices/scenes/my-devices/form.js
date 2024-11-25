import React from 'react';
import { View } from 'react-native';

import FormInput from '../../../../../../../components/form-controls/form-input';
import styles from './styles';
import BaseForm from '../../../../../../../components/base-form';
import { OTP_LENGTH, MIN_NIGERIA_PHONE_LENGTH } from '../../../../../../../constants/fields';
import FormPhone from '../../../../../../../components/form-controls/form-phone';
import { formatPhoneNumberToReadable } from '../../../../../../../utils/formatters';


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
    return <View style={{marginTop: -16}}>
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

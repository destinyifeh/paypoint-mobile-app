import React from 'react';
import FormInput from '../../../../../../components/form-controls/form-input';
import BaseForm from '../../../../../../components/base-form';
import styles from './styles';
import { 
  EMPTY_AMOUNT, 
  MONTHS_NUMBERS,
} from '../../../../../../constants';
import FormPicker from '../../../../../../components/form-controls/form-picker';
import { View, InteractionManager } from 'react-native';
import {
  CVV_LENGTH, 
  PIN_LENGTH,
  MAX_CARD_NUMBER_LENGTH,
  MIN_CARD_NUMBER_LENGTH,
} from '../../../../../../constants/fields';


const currentDate = new Date();

export class AmountForm extends BaseForm {
  requiredFields = [
    'amount',
  ];

  constructor() {
    super()

    this.state = {
      focusAmountField: false,
      form: {
        otp: null
      },
      invalidFields: [],
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        focusAmountField: true
      });

      setTimeout(() => this.amount.focus(), 320);
    });
  }
  
  serializeFormData() {
    const { form } = this.state;

    return {
      amount: form.amount
    };
  }

  render() {
    return <View>
      <FormInput
        disabled={this.props.isDisabled}
        focus={this.state.focusAmountField}
        innerContainerStyle={styles.formInputInnerContainerStyle}
        keyboardType='number-pad'
        onChangeText={(amount, isValid) => {
          this.updateFormField({amount});
          !isValid ? this.addInvalidField('amount') : this.removeInvalidField('amount');
        }}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder={EMPTY_AMOUNT}
        propagateError={this.props.propagateFormErrors}
        text="Amount:"
        textInputRef={(input) => this.amount = input}
        validators={{
          number: true,
          required: true,
        }}
      />

    </View>
  }
}


export class CardForm extends BaseForm {
  requiredFields = [
    'cardNumber',
    'cardExpiryMm',
    'cardExpiryYyyy',
    'cardCvv',
    'cardPin',
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
  
  serializeFormData() {
    const { form } = this.state;

    return {
      cardNumber: form.cardNumber,
      cardExpiryMm: form.cardExpiryMm,
      cardExpiryYyyy: form.cardExpiryYyyy,
      cardCvv: form.cardCvv,
      cardPin: form.cardPin,
    };
  }

  render() {
    return <React.Fragment>
      <FormInput
        autoCompleteType="cc-number"
        disabled={this.props.isDisabled}
        innerContainerStyle={styles.formInputInnerContainerStyle}
        keyboardType='number-pad'
        onChangeText={(cardNumber, isValid) => {
          this.updateFormField({cardNumber});
          !isValid ? this.addInvalidField('cardNumber') : this.removeInvalidField('cardNumber');
        }}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder={"Card Number"}
        propagateError={this.props.propagateFormErrors}
        text="Card Number:"
        validators={{
          maxLength: MAX_CARD_NUMBER_LENGTH,
          minLength: MIN_CARD_NUMBER_LENGTH,
          number: true,
          required: true,
        }}
      />
      
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <FormPicker
          choices={MONTHS_NUMBERS.map((number) => ({
            label: number,
            value: number
          }))}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={(cardExpiryMm, isValid) => {
            this.updateFormField({cardExpiryMm});
            !isValid ? this.addInvalidField('cardExpiryMm') : this.removeInvalidField('cardExpiryMm');
          }}
          outerContainerStyle={[
            styles.formInputOuterContainerStyle, 
            {
              width: 160
            }
          ]}
          placeholder={"--"}
          propagateError={this.props.propagateFormErrors}
          text="Card Expiry (MM):"
          textInputRef={(input) => this.amount = input}
          validators={{
            number: true,
            required: true,
          }}
        />
        <FormPicker
          choices={
            [
              ...Array(5).keys()
            ].map(value => ({
              label: JSON.stringify(currentDate.getFullYear() + value),
              value: JSON.stringify(currentDate.getFullYear() + value)
            }))
          }
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={(cardExpiryYyyy, isValid) => {
            this.updateFormField({cardExpiryYyyy});
            !isValid ? this.addInvalidField('cardExpiryYyyy') : this.removeInvalidField('cardExpiryYyyy');
          }}
          outerContainerStyle={[
            styles.formInputOuterContainerStyle, 
            {
              width: 160
            }
          ]}
          placeholder={"----"}
          propagateError={this.props.propagateFormErrors}
          text="Card Expiry (YYYY):"
          textInputRef={(input) => this.amount = input}
          validators={{
            required: true,
          }}
        />
      </View>
      
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <FormInput
          autoCompleteType="cc-csc"
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType='number-pad'
          onChangeText={(cardCvv, isValid) => {
            this.updateFormField({cardCvv});
            !isValid ? this.addInvalidField('cardCvv') : this.removeInvalidField('cardCvv');
          }}
          onSubmitEditing={() => {
            this.cardPin.focus()
          }}
          outerContainerStyle={[
            styles.formInputOuterContainerStyle, 
            {
              width: 160
            }
          ]}
          placeholder={"CVV2"}
          propagateError={this.props.propagateFormErrors}
          secureTextEntry={true}
          text="Card CVV:"
          textInputRef={(input) => this.amount = input}
          validators={{
            length: CVV_LENGTH,
            number: true,
            required: true,
          }}
        />

        <FormInput
          autoCompleteType="cc-csc"
          choices={
            [
              ...Array(5).keys()
            ].map(value => ({
              label: JSON.stringify(currentDate.getFullYear() + value),
              value: JSON.stringify(currentDate.getFullYear() + value)
            }))
          }
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType='number-pad'
          onChangeText={(cardPin, isValid) => {
            this.updateFormField({cardPin});
            !isValid ? this.addInvalidField('cardPin') : this.removeInvalidField('cardPin');
          }}
          outerContainerStyle={[
            styles.formInputOuterContainerStyle, 
            {
              width: 160
            }
          ]}
          placeholder={"Card PIN"}
          propagateError={this.props.propagateFormErrors}
          secureTextEntry={true}
          text="Card PIN:"
          textInputRef={(input) => this.cardPin = input}
          validators={{
            length: PIN_LENGTH,
            number: true,
            required: true,
          }}
        />
      </View>

    </React.Fragment>
  }
}

/* eslint-disable no-trailing-spaces */
import React from 'react';
import { InteractionManager, StyleSheet, View } from 'react-native';

import { connect } from 'react-redux';
import BaseForm from '../../../../../components/base-form';
import FC from '../../../../../components/form-controls/form-checkbox';
import { FormInput } from '../../../../../components/form-controls/form-input';
import FormPhone from '../../../../../components/form-controls/form-phone';
import FormPicker from '../../../../../components/form-controls/form-picker';
import { NIGERIA_SHORT_CODE } from '../../../../../constants';
import { ERROR_STATUS } from '../../../../../constants/api';
import {
  MIN_NIGERIA_PHONE_LENGTH
} from '../../../../../constants/fields';
import { COLOUR_WHITE } from '../../../../../constants/styles';
import MockCashOutBanks from '../../../../../fixtures/mock_cashout_banks';
import { liquidityService } from '../../../../../setup/api';
import globalStyles from '../styles';


const DEFAULT_ACCOUNT_TYPE = '00';
const FormCheckbox = FC;


class PaycodeWithdrawalForm_ extends BaseForm {
  constructor() {
    super();

    this.state = {
      banks: [],
      countryShortCode: NIGERIA_SHORT_CODE,
      form: {},
      invalidFields: [],
      isComplete: null,
      isValid: null,
      nameInquirySuccess: null,
    };

    this.requiredFields = [
      'paycode',
      'subscriberId', // DONE
      'pin',
      // 'customerName', // DONE
      'customerPhoneNo', // DONE
      // 'customerEmail', // DONE
      'gender', // > customerGender DONE
      'amount', // DONE
    ];
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });
      setTimeout(() => this.paycode.focus(), 500);
    });

    this.updateFormField({
      accountType: DEFAULT_ACCOUNT_TYPE,
    });
  }

  render() {
    const { animationsDone } = this.state;
    if (!animationsDone) {
      return <View />;
    }

    return (
      <React.Fragment>
        <FormInput
          autoCompleteType='tel'
          defaultValue={this.state.form.paycode}
          hint={'Paycode is a 10-14 digit code'}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType='number-pad'
          onChangeText={(paycode, isValid) => {
            this.updateFormField({
              paycode,
            });
            isValid === false ?
              this.addInvalidField('paycode') :
              this.removeInvalidField('paycode');
          }}
          onSubmitEditing={() => this.subscriberId.focus()}
          optional={true}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder=''
          propagateError={this.props.propagateFormErrors}
          text="Paycode:"
          textInputRef={(input) => this.paycode = input}
          validators={{
            minLength: 4,
            required: true,
          }}
        />
        <FormPhone
          autoCompleteType='tel'
          defaultValue={this.state.form.subscriberId}
          hint={'Phone number of the paycode generator'}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType='phone-pad'
          onChangeText={(subscriberId, isValid) => {
            this.updateFormField({
              subscriberId,
            });
            isValid === false ?
              this.addInvalidField('subscriberId') :
              this.removeInvalidField('subscriberId');
          }}
          onSubmitEditing={() => this.pin.focus()}
          optional={true}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder='08012345678'
          propagateError={this.props.propagateFormErrors}
          text="Initiator Phone Number:"
          textInputRef={(input) => this.subscriberId = input}
          validators={{
            length: [MIN_NIGERIA_PHONE_LENGTH, 13],
            required: true,
          }}
        />
        <FormInput
          autoCapitalize='none'
          disabled={this.props.isDisabled}
          hint={'4 digit PIN'}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          leftIcon='vpn-key'
          onChangeText={(pin, isValid) => {
            this.updateFormField({pin});
            !isValid ?
              this.addInvalidField('pin') :
              this.removeInvalidField('pin');
          }}
          onSubmitEditing={() => this.customerPhoneNo.focus()}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder='PIN'
          propagateError={this.props.propagateFormErrors}
          secureTextEntry={true}
          text="PIN:"
          textInputRef={(input) => this.pin = input}
          validators={{
            length: 4,
            password: true,
            required: true,
          }}
        />
        <FormInput
          autoCapitalize='words'
          autoCompleteType='name'
          defaultValue={this.state.form.customerName}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType='default'
          onChangeText={(customerName, isValid) => {
            this.updateFormField({
              customerName,
            });
            isValid === false ?
              this.addInvalidField('customerName') :
              this.removeInvalidField('customerName');
          }}
          onSubmitEditing={() => this.customerPhoneNo.focus()}
          optional={true}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder='John Doe'
          propagateError={this.props.propagateFormErrors}
          text="Customer Name:"
          textInputRef={(input) => this.customerName = input}
          validators={{
            minLength: 4,
            minLengthOfWord: 2,
            numberOfWords: 2,
            required: false,
          }}
        />
        <FormPhone
          autoCompleteType='tel'
          defaultValue={this.state.form.customerPhoneNo}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType='phone-pad'
          onChangeText={(customerPhoneNo, isValid) => {
            this.updateFormField({
              customerPhoneNo,
            });
            isValid === false ?
              this.addInvalidField('customerPhoneNo') :
              this.removeInvalidField('customerPhoneNo');
          }}
          onSubmitEditing={() => this.amount.focus()}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder='08012345678'
          propagateError={this.props.propagateFormErrors}
          text="Customer Phone:"
          textInputRef={(input) => this.customerPhoneNo = input}
          validators={{
            length: [MIN_NIGERIA_PHONE_LENGTH, 13],
            required: true,
          }}
        />
        <FormInput
          autoCapitalize={'none'}
          autoCompleteType='email'
          defaultValue={this.state.form.customerEmail}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType='email-address'
          onChangeText={(customerEmail, isValid) => {
            this.updateFormField({
              customerEmail,
            });
            isValid === false ?
              this.addInvalidField('customerEmail') :
              this.removeInvalidField('customerEmail');
          }}
          onSubmitEditing={() => this.amount.focus()}
          optional={true}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder='customer@example.com'
          propagateError={this.props.propagateFormErrors}
          text="Customer Email:"
          textInputRef={(input) => this.customerEmail = input}
          validators={{
            email: true,
            required: false,
          }}
        />
        <FormInput
          autoCompleteType='tel'
          defaultValue={this.state.form.amount}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType='number-pad'
          onChangeText={(amount, isValid) => {
            this.updateFormField({
              amount,
            });
            isValid === false ?
              this.addInvalidField('amount') :
              this.removeInvalidField('amount');
          }}
          optional={true}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder='0.00'
          propagateError={this.props.propagateFormErrors}
          text="Amount:"
          textInputRef={(input) => this.amount = input}
          validators={{
            positiveNumber: true,
            required: true,
          }}
        />
        <FormCheckbox 
          defaultValue={this.state.form.gender}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          text="Gender:"
          options={['Male', 'Female']}
          onSelect={(gender, isValid) => {
            this.updateFormField({gender});
            isValid === false ?
              this.addInvalidField('gender') :
              this.removeInvalidField('gender');
          }}
          propagateError={this.props.propagateFormErrors}
          validators={{
            required: true,
          }}
        />
      </React.Fragment>
    );
  }
};


class USSDWithdrawalForm_ extends BaseForm {
  constructor() {
    super();

    this.state = {
      banks: [],
      countryShortCode: NIGERIA_SHORT_CODE,
      form: {},
      invalidFields: [],
      isComplete: null,
      isValid: null,
      nameInquirySuccess: null,
    };

    this.requiredFields = [
      'phone',
      'bankCode',
      'amount',
    ];

    this.fetchBanks = this.fetchBanks.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });
      setTimeout(() => this.phone.focus(), 500);
    });

    this.updateFormField({
      accountType: DEFAULT_ACCOUNT_TYPE,
    });

    this.fetchBanks();
  }

  async fetchBanks() {
    const { response, status } = await liquidityService.fetchCashOutBanks();
    
    console.log('FETCH BANKS', {response});

    if (status === ERROR_STATUS) {
      this.setState({
        banks: MockCashOutBanks,
      });
      return;
    }

    this.setState({
      banks: response,
    });
  }

  render() {
    const { animationsDone, banks } = this.state;
    if (!animationsDone) {
      return <View />;
    }

    return (
      <React.Fragment>
        <React.Fragment>
          <FormPhone
            autoCompleteType='tel'
            defaultValue={this.state.form.phone}
            innerContainerStyle={styles.formInputInnerContainerStyle}
            keyboardType='number-pad'
            onChangeText={(phone, isValid) => {
              this.updateFormField({
                phone,
              });
              isValid === false ?
                this.addInvalidField('phone') :
                this.removeInvalidField('phone');
            }}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            placeholder='08012345678'
            propagateError={this.props.propagateFormErrors}
            text="Phone:"
            textInputRef={(input) => this.phone = input}
            validators={{
              length: [MIN_NIGERIA_PHONE_LENGTH, 13],
              required: true,
            }}
          />
          <FormPicker 
            choices={banks.map((option) => ({
              label: option.name,
              value: option.cbnCode,
            }))}
            innerContainerStyle={styles.formInputInnerContainerStyle}
            onSelect={(bankCode, isValid) => {
              this.updateFormField({
                bankCode,
                bankName: banks.find((bank) => (
                  bankCode === bank.cbnCode
                ))?.name,
              });
              isValid === false ?
                this.addInvalidField('bankCode') :
                this.removeInvalidField('bankCode');
            }}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            propagateError={this.props.propagateFormErrors}
            text="Bank:"
            validators={{
              required: true,
            }} 
          />
          <FormInput
            autoCompleteType='tel'
            defaultValue={this.state.form.amount}
            innerContainerStyle={styles.formInputInnerContainerStyle}
            keyboardType='number-pad'
            onChangeText={(amount, isValid) => {
              this.updateFormField({
                amount,
              });
              isValid === false ?
                this.addInvalidField('amount') :
                this.removeInvalidField('amount');
            }}
            optional={true}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            placeholder='0.00'
            propagateError={this.props.propagateFormErrors}
            text="Amount:"
            textInputRef={(input) => this.amount = input}
            validators={{
              required: true,
            }}
          />
          <FormCheckbox 
            defaultValue={this.state.form.gender}
            innerContainerStyle={styles.formInputInnerContainerStyle}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            text="Gender:"
            options={['Male', 'Female']}
            onSelect={(gender, isValid) => {
              this.updateFormField({gender});
              isValid === false ?
                this.addInvalidField('gender') :
                this.removeInvalidField('gender');
            }}
            propagateError={this.props.propagateFormErrors}
            validators={{
              required: true,
            }}
          />
        </React.Fragment>
      </React.Fragment>
    );
  }
};


function mapStateToProps(state) {
  return {
    disabledOptions: state.transactions.disabledPrimaryChoices,
    propagateFormErrors: state.forms.propagateFormErrors,
  };
}


export const PaycodeWithdrawalForm = connect(
    mapStateToProps, null, null, {forwardRef: true},
)(PaycodeWithdrawalForm_);

export const USSDWithdrawalForm = connect(
    mapStateToProps, null, null, {forwardRef: true},
)(USSDWithdrawalForm_);


const styles = StyleSheet.create({
  ...globalStyles,
  container: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: COLOUR_WHITE,
    padding: 20,
    paddingBottom: 30,
    flex: .8,
  },
  but: {
    padding: 10,
    elevation: 5,
    marginTop: 10,
    marginBottom: 40,
    flex: .2,
  },
});

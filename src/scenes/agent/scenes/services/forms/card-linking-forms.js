import React from 'react';

import LottieView from 'lottie-react-native';
import { View } from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet";
import { stopwatch } from '../../../../../../App';
import ActivityIndicator from '../../../../../components/activity-indicator';
import BaseForm from '../../../../../components/base-form';
import Button from '../../../../../components/button';
import { FormInput } from '../../../../../components/form-controls/form-input';
import FormPicker from '../../../../../components/form-controls/form-picker';
import Text from '../../../../../components/text';
import { ACCOUNT_VALIDATION_CLICK, ACCOUNT_VALIDATION_FAILURE, ACCOUNT_VALIDATION_SUCCESS } from '../../../../../constants/analytics';
import { ERROR_STATUS } from '../../../../../constants/api';
import { ACCOUNT_NUMBER_LENGTH, OTP_LENGTH } from '../../../../../constants/fields';
import { COLOUR_GREY, COLOUR_RED } from '../../../../../constants/styles';
import { logEvent } from '../../../../../core/logger';
import AccountOpening from '../../../../../services/api/resources/account-opening';
import Transaction from '../../../../../services/api/resources/transaction';
import { getDeviceDetails } from '../../../../../utils/device';
import { findBankForSanefBank } from '../../../../../utils/helpers';
import styles from '../styles';


export class AccountOpeningCardForm extends BaseForm {
  requiredFields = [
    'bankCode',
    'accountNumber',
    'cardNumber',
  ];

  accountOpening = new AccountOpening();
  transaction = new Transaction();

  constructor() {
    super();

    this.state = {
      form: {
  
      },
      invalidFields: [],
    };

    this.onSelectBank = this.onSelectBank.bind(this);
  }

  serializeApiData(apiData) {
    return {
      firstName: apiData.FirstName,
      lastName: apiData.LastName,
      middleName: apiData.MiddleName,
      phone: `${apiData.PhoneNumber ? `0${apiData.PhoneNumber.slice(3)}` : ''}`,
      email: apiData.EmailAddress,
    }
  }

  serializeFormData() {
    const { firstName, middleName, lastName, phone, email } = this.state.form;

    return {
      FirstName: firstName,
      LastName: lastName,
      MiddleName: middleName,
      PhoneNumber: phone ? `+234${phone.slice(1)}` : null,
      EmailAddress: email
    }
  }

  async onSelectBank(bankCode) {
    const bank__ = this.props.banks.find(({sanefBankCode}) => sanefBankCode === bankCode)
    const bankCode_ = findBankForSanefBank(bank__.bankName).cbnCode;

    this.activityIndicator.open();

    logEvent(ACCOUNT_VALIDATION_CLICK);

    this.setState({
      nameInquirySuccess: null,
    })

    stopwatch.start();

    const { deviceUuid } = await getDeviceDetails();
    const { status, response } = await this.transaction.doAccountInquiry( 
      bankCode_, 
      this.state.form.accountNumber,
      deviceUuid
    );
    
    console.log({status, response});

    stopwatch.stop();

    if (status === ERROR_STATUS) {
      logEvent(ACCOUNT_VALIDATION_FAILURE, {secondsElapsed: stopwatch.secondsElapsed});

      this.setState({
        // form: {
        //   ...this.state.form,
        //   beneficiaryName: null,
        // },
        isLoading: false,
        nameInquirySuccess: false,
      });
    } else {
      logEvent(ACCOUNT_VALIDATION_SUCCESS, {secondsElapsed: stopwatch.secondsElapsed});

      this.props.onCardNameChange(response.accountName);

      this.setState({
        // form: {
        //   ...this.state.form,
        //   beneficiaryName: response.accountName,
        // },
        isLoading: false,
        nameInquirySuccess: true,
      });

      setTimeout(
        () => {
          this.activityIndicator && this.activityIndicator.close()
        }, 3000
      );

      setTimeout(
        () => {
          this.cardNumber.focus()
        }, 3300
      )
    }
  }

  render() {
    return <React.Fragment>
      <RBSheet
        animationType="fade"
        ref={ref => {
          this.activityIndicator = ref;
        }}
        closeOnDragDown={false}
        closeOnPressBack={false}
        closeOnPressMask={false}
        height={400}
        duration={250}
        customStyles={{
          container: {
            justifyContent: "center",
            alignItems: "center"
          }
        }}
      >
        {this.state.nameInquirySuccess && <React.Fragment>
          <LottieView
            autoPlay={true}
            loop={false}
            ref={animation => {
              this.animation = animation;
            }}
            style={{
              // position: 'absolute',
              height: 230,
              top: 0,
              width: 230,
            }}
            source={require('../../../../../animations/checked-done-2.json')}
          />
          <View style={{
            flexDirection: 'column',
          }}>
            <Text center green>Name Inquiry Successful.</Text>
            <Text big center bold>
                {`${this.state.form.beneficiaryName}`}
            </Text>
          </View>
        </React.Fragment>}
        {this.state.nameInquirySuccess === false && <React.Fragment>
          <LottieView
            autoPlay={true}
            loop={false}
            ref={animation => {
                this.animation = animation;
            }}
            style={{
              // position: 'absolute',
              height: 230,
              top: 0,
              width: 230,
            }}
            source={require('../../../../../animations/14651-error-animation (2).json')}
          />
          <Text big bold center red style={{marginTop: 10}}>
            Account name confirmation failed. Please, retry.
          </Text>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-evenly'
            }}
          >
            <Button
              containerStyle={{width: '30%'}}
              onPressOut={() => this.onSelectBank(this.state.form.bankCode)}
              title='RETRY'
              titleStyle={{
              color: COLOUR_RED
              }}
              transparent
            />
              
            <Button
              containerStyle={{width: '30%'}}
              onPressOut={() => this.activityIndicator.close()}
              title='CANCEL'
              titleStyle={{
                color: COLOUR_GREY
              }}
              transparent
            />
          </View>
        </React.Fragment>} 
        {this.state.nameInquirySuccess === null && <React.Fragment>
          <ActivityIndicator
            containerStyle={{
              flex: null
            }}
          />
          <Text style={{marginTop: 5}}>
            Verifying account details
          </Text>
        </React.Fragment>}
      </RBSheet>

      <FormInput
        autoCompleteType='tel'
        defaultValue={this.state.form.accountNumber}
        disabled={this.state.form.disableAccountNumber}
        innerContainerStyle={styles.formInputInnerContainerStyle}
        keyboardType='number-pad'
        onChangeText={(accountNumber, isValid) => {
          this.updateFormField({accountNumber});
          !isValid ? this.addInvalidField('accountNumber') : this.removeInvalidField('accountNumber');
        }}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder='Account Number'
        propagateError={this.props.propagateFormErrors}
        text="Account Number:"
        textInputRef={(input) => this.accountNumber = input}
        validators={{
          minLength: ACCOUNT_NUMBER_LENGTH,
          regex: 'name',
          required: true,
        }}
      />
      
      <FormPicker 
        choices={this.props.banks.map(({sanefBankCode, bankName}) => ({
          label: bankName,
          value: sanefBankCode
        }))}
        defaultValue={this.state.form.bank}
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onSelect={(bankCode, isValid) => {
          this.updateFormField({bankCode});
          !isValid ? this.addInvalidField('bankCode') : this.removeInvalidField('bankCode');
          const isAccountNumberValid = !this.state.invalidFields.includes('accountNumber');
          isAccountNumberValid && this.onSelectBank(bankCode);
        }}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        propagateError={this.props.propagateFormErrors}
        text={'Bank:'}
        validators={{
          required: true
        }}
      />
      
      <FormInput
        defaultValue={this.state.form.cardNumber}
        disabled={this.state.form.disableCardNumber}
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(cardNumber, isValid) => {
          this.props.onCardNumberChange(cardNumber);
          this.updateFormField({cardNumber});
          !isValid ? this.addInvalidField('cardNumber') : this.removeInvalidField('cardNumber');
        }}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder='0000 0000 0000 0000'
        propagateError={this.props.propagateFormErrors}
        text="Card Number:"
        textInputRef={(input) => this.cardNumber = input}
        validators={{
          minLength: 13,
          regex: 'name',
          required: true,
        }}
      />
    </React.Fragment>
  }
}


export class AccountOpeningOtpForm extends BaseForm {
  requiredFields = [
    'otp',
  ];

  state = {
    form: {

    },
    invalidFields: [],
  }

  render() {
    return (
      <React.Fragment>
        <FormInput
          autoCompleteType='tel'
          keyboardType='number-pad'
          defaultValue={this.state.form.otp}
          disabled={this.state.form.disableOtp}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(otp, isValid) => {
            this.updateFormField({otp});
            !isValid ? this.addInvalidField('otp') : this.removeInvalidField('otp');
          }}
          // onSubmitEditing={() => {
          //   this.otp.focus()
          // }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder='OTP'
          propagateError={this.props.propagateFormErrors}
          text="OTP:"
          textInputRef={(input) => this.otp = input}
          validators={{
            minLength: OTP_LENGTH,
            regex: 'name',
            required: true,
          }}
        />
      </React.Fragment>
    )
  }
}

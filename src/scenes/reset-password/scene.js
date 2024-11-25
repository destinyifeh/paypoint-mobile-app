import React from 'react';
import {ScrollView, View} from 'react-native';

import Button from '../../components/button';
import H1 from '../../components/h1';
import Header from '../../components/header';
import {NIGERIA_SHORT_CODE} from '../../constants';
import {ERROR_STATUS} from '../../constants/api';
import {BLOCKER} from '../../constants/dialog-priorities';
import ApiGateway from '../../services/api/resources/api-gateway';
import UserManagement from '../../services/api/resources/user-management';
import {flashMessage} from '../../utils/dialog';
import handleErrorResponse from '../../utils/error-handlers/api';
import BaseScene from '../base-scene';
import {Form, OtpForm} from './form';

export default class ResetPasswordScene extends BaseScene {
  screen_name = 'Reset Password';
  apiGateway = new ApiGateway();
  userManagement = new UserManagement();

  constructor(props) {
    super(props);

    this.state = {
      propagateFormErrors: false,
    };

    this.checkFormValidity = this.checkFormValidity.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
  }

  checkFormValidity() {
    const formIsComplete = this.form.state.isComplete;
    const formIsValid = this.form.state.isValid;

    if (!(formIsComplete && formIsValid)) {
      this.setState({
        isLoading: false,
        propagateFormErrors: true,
      });

      return;
    }

    return true;
  }

  checkFormValidity() {
    const formIsComplete = this.form.state.isComplete;
    const formIsValid = this.form.state.isValid;

    console.log({formIsComplete, formIsValid});

    if (!(formIsComplete && formIsValid)) {
      this.setState({
        isLoading: false,
        propagateFormErrors: true,
      });

      return;
    }

    return true;
  }

  formatPhoneNumber(countryShortCode, phoneNumber) {
    if (countryShortCode === NIGERIA_SHORT_CODE) {
      return `234${phoneNumber.slice(-10)}`;
    }
  }

  async onSubmitForm() {
    this.setState({
      errorMessage: null,
    });

    const isFormValid = this.checkFormValidity();

    if (!isFormValid) {
      return;
    }

    const {repeatPassword, newPassword, otp} = this.form.state.form;

    this.setState({
      isSubmittingForm: true,
    });

    const {accessToken, uuid, username} = this.props.route.params || {};

    const {response, status} = await this.userManagement.resetPassword(
      newPassword,
      repeatPassword,
      otp,
      uuid,
      username,
      accessToken,
    );

    this.setState({
      isSubmittingForm: false,
    });

    if (status === ERROR_STATUS) {
      flashMessage(
        'Reset Password',
        await handleErrorResponse(response),
        BLOCKER,
      );

      return;
    }

    flashMessage(
      'Success',
      'Your password has been updated successfully. Kindly login with new credentials!',
      BLOCKER,
    );

    this.props.navigation.replace('Login');
  }

  render() {
    const isOtpRequired = this.props.route.params.isOtpRequired;

    return (
      <ScrollView contentContainerStyle={{padding: 0}}>
        <View style={{height: 70, marginBottom: 25}}>
          <Header paypointLogo />
        </View>

        <View
          style={{
            padding: 25,
          }}>
          <H1
            style={{
              marginBottom: 20,
              marginTop: 40,
              textAlign: 'center',
            }}
            underline>
            RESET YOUR PASSWORD
          </H1>

          {/* <HR /> */}

          {/* <Text style={{marginBottom: 20, textAlign: 'center'}}>
          An OTP has been sent to your phone number.
        </Text> */}

          {isOtpRequired ? (
            <OtpForm
              isDisabled={this.state.isSubmittingForm}
              ref={form => (this.form = form)}
              propagateFormErrors={this.state.propagateFormErrors}
            />
          ) : (
            <Form
              isDisabled={this.state.isSubmittingForm}
              ref={form => (this.form = form)}
              propagateFormErrors={this.state.propagateFormErrors}
            />
          )}

          <View style={{alignItems: 'center', marginTop: 10}}>
            <Button
              containerStyle={{
                marginTop: 20,
                width: '100%',
              }}
              loading={this.state.isSubmittingForm}
              onPress={this.onSubmitForm}
              title="CONTINUE"
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

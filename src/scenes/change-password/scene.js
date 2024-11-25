import React from 'react';
import {ScrollView, View} from 'react-native';

import Button from '../../components/button';
import H1 from '../../components/h1';
import Header from '../../components/header';
import Text from '../../components/text';
import {ERROR_STATUS} from '../../constants/api';
import {BLOCKER} from '../../constants/dialog-priorities';
import Passport from '../../services/api/resources/passport';
import UserManagement from '../../services/api/resources/user-management';
import {flashMessage} from '../../utils/dialog';
import handleErrorResponse from '../../utils/error-handlers/api';
import BaseScene from '../base-scene';
import ChangePasswordForm from './form';

import Hyperlink from '../../components/hyperlink';

export default class ChangePasswordScene extends BaseScene {
  screen_name = 'Change Password';
  passport = new Passport();
  userManagement = new UserManagement();

  constructor(props) {
    super(props);

    this.state = {
      isSubmittingForm: false,
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

  async onSubmitForm() {
    this.setState({
      errorMessage: null,
    });

    const isFormValid = this.checkFormValidity();

    if (!isFormValid) {
      return;
    }

    const {repeatPassword, currentPassword, newPassword} = this.form.state.form;

    const {accessToken, username, uuid} = this.props.route.params || {};

    this.setState({
      isSubmittingForm: true,
    });

    const changePasswordResponse = await this.userManagement.changePassword(
      currentPassword,
      newPassword,
      repeatPassword,
      uuid,
      username,
      username,
      accessToken,
    );

    const changePasswordResponseStatus = changePasswordResponse.status;
    const changePasswordResponseObj = changePasswordResponse.response;

    if (changePasswordResponseStatus === ERROR_STATUS) {
      flashMessage(
        'Change Password',
        await handleErrorResponse(changePasswordResponseObj),
        BLOCKER,
      );

      this.setState({
        isSubmittingForm: false,
      });

      if (changePasswordResponseObj.code === '40100') {
        this.props.navigation.replace('Login');
      }
      return;
    }

    flashMessage(
      'Success',
      'Password changed successfully! Now, login with your new details',
      BLOCKER,
    );

    this.props.navigation.replace('Login');
  }

  render() {
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
            CHANGE PASSWORD
          </H1>

          <Text
            style={{
              marginBottom: 20,
              textAlign: 'center',
            }}>
            Your password or PIN has expired. You need to update it immediately.
          </Text>

          <ChangePasswordForm
            isDisabled={this.state.isSubmittingForm}
            ref={form => (this.form = form)}
            propagateFormErrors={this.state.propagateFormErrors}
          />

          <View style={{alignItems: 'center', marginTop: 10}}>
            <Button
              containerStyle={{
                marginTop: 20,
                width: '100%',
              }}
              disabled={this.state.isSubmittingForm}
              loading={this.state.isSubmittingForm}
              onPress={this.onSubmitForm}
              title="CONTINUE"
            />
          </View>
          <View style={{alignItems: 'center', marginTop: 10}}>
            <Text>
              Have an account already?{' '}
              <Hyperlink href="Login">Sign in</Hyperlink>
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}

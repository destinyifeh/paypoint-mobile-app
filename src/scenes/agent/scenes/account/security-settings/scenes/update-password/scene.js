import React from 'react';
import {ScrollView, View} from 'react-native';

import {Icon} from 'react-native-elements';
import Button from '../../../../../../../components/button';
import Header from '../../../../../../../components/header';
import {ERROR_STATUS} from '../../../../../../../constants/api';
import {BLOCKER} from '../../../../../../../constants/dialog-priorities';
import {
  COLOUR_BLUE,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../../../../../constants/styles';
import Passport from '../../../../../../../services/api/resources/passport';
import UserManagement from '../../../../../../../services/api/resources/user-management';
import {flashMessage} from '../../../../../../../utils/dialog';
import handleErrorResponse from '../../../../../../../utils/error-handlers/api';
import BaseScene from '../../../../../../base-scene';
import ChangePasswordForm from './form';

export default class UpdatePasswordScene extends BaseScene {
  screen_name = 'Update Password';
  passport = new Passport();
  userManagement = new UserManagement();

  constructor(props) {
    super(props);

    this.state = {
      isSubmittingForm: false,
      propagateFormErrors: false,
    };

    this.onSubmitForm = this.onSubmitForm.bind(this);
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

  async onSubmitForm() {
    this.setState({
      errorMessage: null,
    });

    const isFormValid = this.checkFormValidity();

    if (!isFormValid) {
      return;
    }

    const {repeatPassword, currentPassword, newPassword} = this.form.state.form;

    const {accessToken, username, uuid} = this.props.route?.params || {};

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

    this.setState({
      isSubmittingForm: false,
    });

    console.log('CHANGE PASSWORD RESPONSE', changePasswordResponse);

    const changePasswordResponseStatus = changePasswordResponse.status;
    const changePasswordResponseObj = changePasswordResponse.response;

    if (changePasswordResponseStatus === ERROR_STATUS) {
      flashMessage(
        'Change Password',
        await handleErrorResponse(changePasswordResponseObj),
        BLOCKER,
      );

      return;
    }

    flashMessage('Success', 'Password has been changed successfully!', BLOCKER);

    this.props.navigation.goBack();
  }

  render() {
    return (
      <ScrollView contentContainerStyle={{padding: 0}}>
        <Header
          containerStyle={{
            backgroundColor: COLOUR_BLUE,
          }}
          navigationIconColor={COLOUR_WHITE}
          leftComponent={
            <Icon
              color={COLOUR_RED}
              underlayColor="transparent"
              name="chevron-left"
              size={40}
              type="material"
              onPress={() => this.props.navigation.goBack()}
            />
          }
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_LIGHT,
          }}
          title="Update Password"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
          }}
        />

        <View
          style={{
            padding: 25,
          }}>
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
        </View>
      </ScrollView>
    );
  }
}

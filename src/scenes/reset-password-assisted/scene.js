import React from 'react';
import {ScrollView, View} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {Icon} from 'react-native-elements';
import Button from '../../components/button';
import ClickableListItem from '../../components/clickable-list-item';
import H1 from '../../components/h1';
import Header from '../../components/header';
import Hyperlink from '../../components/hyperlink';
import Text from '../../components/text';
import {NIGERIA_SHORT_CODE} from '../../constants';
import {ERROR_STATUS} from '../../constants/api';
import {RECOVER_PASSWORD_DESTINATION_URL} from '../../constants/api-resources';
import {BLOCKER, CASUAL} from '../../constants/dialog-priorities';
import {COLOUR_BLUE, COLOUR_LINK_BLUE} from '../../constants/styles';
import ApiGateway from '../../services/api/resources/api-gateway';
import UserManagement from '../../services/api/resources/user-management';
import {flashMessage} from '../../utils/dialog';
import handleErrorResponse from '../../utils/error-handlers/api';
import BaseScene from '../base-scene';
import {
  FormAssisted,
  OtpFormAssisted,
} from '../reset-password-assisted/form-otp';

const RESET_OTP = 'reset_otp';
export default class ResetPassordAssistedScene extends BaseScene {
  screen_name = 'Reset Password';
  apiGateway = new ApiGateway();
  userManagement = new UserManagement();

  constructor(props) {
    super(props);

    this.state = {
      propagateFormErrors: false,
      isOtpRequired: false,
      selectedProfile: false,
    };

    this.checkFormValidity = this.checkFormValidity.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.onSubmitOTPForm = this.onSubmitOTPForm.bind(this);
    this.resendOtp = this.resendOtp.bind(this);
  }

  componentDidMount() {
    const {isOtpRequired, uuid, userDomains} = this.props.params || {};
    this.setState({
      isOtpRequired,
      uuid,
      userDomains,
    });
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

  async onSubmitOTPForm() {
    this.setState({
      errorMessage: null,
    });

    const isFormValid = this.checkFormValidity();

    if (!isFormValid) {
      return;
    }

    const {otp} = this.form.state.form;

    await AsyncStorage.setItem(RESET_OTP, otp);

    this.setState({
      isOtpRequired: false,
    });
  }

  async onSubmitForm() {
    this.setState({
      errorMessage: null,
    });

    const isFormValid = this.checkFormValidity();

    if (!isFormValid) {
      return;
    }

    const {repeatPassword, newPassword} = this.form.state.form;
    const otp = await AsyncStorage.getItem(RESET_OTP);

    console.log(
      {repeatPassword, newPassword, otp},
      'NUGAGEE RESET PASSWORD PAYLOAD',
    );

    this.setState({
      isSubmittingForm: true,
    });

    const {email, userDomains} = this.props.route.params || {};

    const {response, status} = await this.userManagement.resetPassword(
      newPassword,
      repeatPassword,
      otp,
      this.state.uuid,
    );

    console.log({response}, 'NUGAGEE RESET PASSWORD RESPONSE');
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

    this.props.navigation.replace('Login', {
      isAssistedPasswordPage: true,
      assistedAgentDetails: email,
      userDomains: userDomains,
    });
  }

  async resendOtp() {
    const {email, userDomains} = this.props.route.params || {};

    this.setState({
      isSendingOtp: true,
    });

    let {code, response, status} = {
      code: null,
      response: null,
      status: null,
    };

    flashMessage(null, 'Resending OTP...', CASUAL);

    const apiResponse = await this.userManagement.recoverPassword(
      email,
      // validateEmail(email) ? email : email,
      RECOVER_PASSWORD_DESTINATION_URL,
      userDomains.authenticatedAs,
    );

    code = apiResponse.code;
    response = apiResponse.response;
    status = apiResponse.status;

    console.warn({code, response, status}, 'NUGAGEE RESEND OTP RESPONSE');

    if (status === ERROR_STATUS) {
      const errorMessage = await handleErrorResponse(response);
      this.setState({
        isSendingOtp: false,
      });

      flashMessage(null, errorMessage, BLOCKER);

      this.setState({
        isLoading: false,
      });

      return;
    }
    this.setState({
      isSendingOtp: false,
    });

    flashMessage(null, 'OTP successfully resent!', CASUAL);
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
            RESET YOUR PASSWORD
          </H1>

          {/* <HR /> */}

          {/* <Text style={{marginBottom: 20, textAlign: 'center'}}>
          An OTP has been sent to your phone number.
        </Text> */}

          {this.state.isOtpRequired == true ? (
            <>
              <View>
                <Text
                  style={{
                    textAlign: 'center',
                    marginTop: 10,
                  }}
                  black>
                  Please enter the 6-digit code that has been sent to your phone
                  number{'\n'}
                </Text>
              </View>
              <OtpFormAssisted
                isDisabled={this.state.isSubmittingForm}
                ref={form => (this.form = form)}
                propagateFormErrors={this.state.propagateFormErrors}
              />
              <ClickableListItem
                style={{
                  flexDirection: 'row',
                  color: COLOUR_BLUE,
                  paddingHorizontal: 5,
                }}>
                {this.state.isSendingOtp ? (
                  <Hyperlink>Sending...</Hyperlink>
                ) : (
                  <>
                    <Icon
                      color={COLOUR_LINK_BLUE}
                      underlayColor="transparent"
                      name="refresh"
                      size={20}
                      type="material"
                    />

                    <Hyperlink onPress={this.resendOtp}>Resend OTP</Hyperlink>
                  </>
                )}
              </ClickableListItem>
            </>
          ) : (
            <>
              <FormAssisted
                isDisabled={this.state.isSubmittingForm}
                ref={form => (this.form = form)}
                propagateFormErrors={this.state.propagateFormErrors}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 20,
                  width: '100%',
                }}>
                <Hyperlink> </Hyperlink>
                <Hyperlink
                  onPress={() =>
                    this.setState({
                      isOtpRequired: true,
                    })
                  }>
                  Go Back
                </Hyperlink>
              </View>
            </>
          )}

          <View style={{alignItems: 'center', marginTop: 10}}>
            {this.state.isOtpRequired ? (
              <Button
                containerStyle={{
                  marginTop: 20,
                  width: '100%',
                }}
                loading={this.state.isSubmittingForm}
                onPress={this.onSubmitOTPForm}
                title="PROCEED"
              />
            ) : (
              <Button
                containerStyle={{
                  marginTop: 20,
                  width: '100%',
                }}
                loading={this.state.isSubmittingForm}
                onPress={this.onSubmitForm}
                title="CONTINUE"
              />
            )}
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

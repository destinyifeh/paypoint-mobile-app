import React from 'react';
import {ScrollView, View} from 'react-native';
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
import {COLOUR_GREY} from '../../constants/styles';
import SelectRoleMenu, {RoleSerializer} from '../../fragments/select-role-menu';
import ApiGateway from '../../services/api/resources/api-gateway';
import UserManagement from '../../services/api/resources/user-management';
import {flashMessage} from '../../utils/dialog';
import handleErrorResponse from '../../utils/error-handlers/api';
import {validateEmail} from '../../validators/form-validators';
import BaseScene from '../base-scene';
import {UsernameForm} from './form';

export default class ForgotPasswordScene extends BaseScene {
  screen_name = 'Forgot Password';
  apiGateway = new ApiGateway();
  userManagement = new UserManagement();

  constructor(props) {
    super(props);

    this.state = {
      propagateFormErrors: false,
    };

    this.checkFormValidity = this.checkFormValidity.bind(this);
    this.onSubmitUsername = this.onSubmitUsername.bind(this);
    this.recoverPasswordForUsername =
      this.recoverPasswordForUsername.bind(this);
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

  checkOtpFormValidity() {
    const formIsComplete = this.otpForm.state.isComplete;
    const formIsValid = this.otpForm.state.isValid;

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

  get selectedProfilePreviewComp() {
    const serializer = new RoleSerializer(this.state.selectedProfile);
    const {domainName, friendlyRoleName} = serializer.data;

    return (
      <ClickableListItem
        onPress={() => {
          this.onSubmitUsername();
          this.selectRoleMenu.open();
        }}
        style={{
          alignItems: 'center',
          backgroundColor: 'white',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          bottom: 0,
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 16,
          position: 'absolute',
          width: '100%',
          elevation: 10,
        }}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-evenly',
          }}>
          <Text
            blue
            bold
            style={{
              fontSize: 18,
              letterSpacing: 1.7,
              textTransform: 'uppercase',
            }}>
            {friendlyRoleName}
          </Text>
          {domainName !== friendlyRoleName && (
            <Text grey semiBold small>
              {domainName}
            </Text>
          )}
        </View>
        <Icon
          color={COLOUR_GREY}
          name="arrow-drop-up"
          size={36}
          type="material"
          underlayColor="transparent"
        />
      </ClickableListItem>
    );
  }

  async recoverPasswordForUsername(email) {
    this.setState({
      errorMessage: null,
    });

    this.email = email;

    this.setState({
      isLoading: true,
    });

    const recoverPasswordResponse = await this.userManagement.recoverPassword(
      validateEmail(email) ? email : email,
      RECOVER_PASSWORD_DESTINATION_URL,
      this.state.selectedProfile.authenticatedAs,
    );

    console.log('RECOVER PASSWORD RESPONSE', recoverPasswordResponse);

    const recoverPasswordResponseStatus = recoverPasswordResponse.status;
    const recoverPasswordResponseObj = recoverPasswordResponse.response;

    if (recoverPasswordResponseStatus === ERROR_STATUS) {
      flashMessage(
        'Reset Password',
        await handleErrorResponse(recoverPasswordResponseObj),
        BLOCKER,
      );

      this.setState({
        isLoading: false,
      });

      return;
    }

    this.setState({
      isLoading: false,
      messageSentSuccessfully: true,
    });

    if (!validateEmail(email)) {
      this.props.navigation.replace('ForgotPasswordOtp', {
        email,
        uuid: recoverPasswordResponseObj.uuid,
      });
    }
  }

  async onSubmitUsername() {
    this.setState({
      errorMessage: null,
    });

    const isFormValid = this.checkFormValidity();

    if (!isFormValid) {
      return;
    }

    const {email} = this.form.state.form;
    this.email = email;

    this.setState({
      isLoading: true,
    });

    const {response, status} = await this.userManagement.getUserProfiles(email);

    this.setState({isLoading: false});

    console.log({response, status});
    if (status === ERROR_STATUS) {
      this.setState({
        errorMessage: await handleErrorResponse(response),
        isLoading: false,
      });

      return;
    }

    const userDomains = response.data.userDomainTypes;

    if (!userDomains.length) {
      flashMessage(null, 'Email or phone number does not exist!', CASUAL);

      return;
    }

    this.setState({
      profiles: userDomains,
      selectedProfile: userDomains.length === 1 ? userDomains[0] : null,
    });

    this.selectRoleMenu.open();

    return;
  }

  async onSelectDomainTypeId(domainTypeId) {
    const selectedProfile = this.state.profiles.find(
      value => value.domainTypeId === domainTypeId,
    );

    this.setState({
      selectedProfile,
    });

    setTimeout(
      () => this.recoverPasswordForUsername(selectedProfile.username),
      0,
    );

    return;
  }

  render() {
    const {messageSentSuccessfully, profiles, showOtpForm, isLoading} =
      this.state;

    if (messageSentSuccessfully && !showOtpForm) {
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
              CHECK YOUR EMAIL TO PROCEED
            </H1>

            {/* <HR /> */}

            <Text center title style={{marginVertical: 10}}>
              An email has been sent to <Text bold>{this.email}</Text>.
            </Text>
            <Text style={{marginBottom: 20}} center>
              Please check your email ({this.form.state.form.email}) and click
              on the link provided to reset your password.
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <Hyperlink href="Login">Back to Login</Hyperlink>
              <Hyperlink
                onPress={() =>
                  this.setState({
                    messageSentSuccessfully: false,
                  })
                }>
                Change email
              </Hyperlink>
            </View>
          </View>
        </ScrollView>
      );
    }

    return (
      <ScrollView
        contentContainerStyle={{padding: 0}}
        style={{backgroundColor: 'white', flex: 1}}>
        <View style={{height: 70, marginBottom: 25}}>
          <Header paypointLogo />
        </View>

        <SelectRoleMenu
          isLoading={isLoading}
          onSelect={domainTypeId => {
            this.onSelectDomainTypeId(domainTypeId);
            this.selectRoleMenu.close();
          }}
          ref_={component => (this.selectRoleMenu = component)}
          requestClose={() => this.selectRoleMenu.close()}
          roles={profiles}
        />

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
            {!this.state.showOtpForm ? 'FORGOT PASSWORD' : 'ENTER YOUR OTP'}
          </H1>

          {/* <HR /> */}

          <Text style={{marginBottom: 20, textAlign: 'center'}}>
            {this.state.showOtpForm
              ? 'An OTP has been sent to your phone number.'
              : "Enter the email or phone number you've registered with. We'll send you the instructions there."}
          </Text>

          <UsernameForm
            isDisabled={this.state.isLoading}
            ref={form => (this.form = form)}
            propagateFormErrors={this.state.propagateFormErrors}
          />

          <Hyperlink href="Login">Back to Login</Hyperlink>

          <View style={{alignItems: 'center', marginTop: 10}}>
            <Button
              containerStyle={{
                marginTop: 20,
                width: '100%',
              }}
              loading={this.state.isLoading}
              onPress={this.onSubmitUsername}
              title="REQUEST PASSWORD RESET"
            />
          </View>

          {/* {this.selectedProfilePreviewComp} */}
        </View>
      </ScrollView>
    );
  }
}

import React from 'react';
import {ScrollView, View} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

import AlertStrip from '../../components/alert-strip';
import Button from '../../components/button';
import Header from '../../components/header';
import Hyperlink from '../../components/hyperlink';
import Text from '../../components/text';
import {DEFAULT_DOMAIN_CODE, LOGIN_DETAILS} from '../../constants';
import {ERROR_STATUS} from '../../constants/api';
import {
  CLIENT_BASIC_AUTH_CREDENTIALS,
  ENVIRONMENT,
  UAT,
} from '../../constants/api-resources';
import {BLOCKER} from '../../constants/dialog-priorities';
import {
  COLOUR_BLUE,
  COLOUR_PRIMARY,
  COLOUR_WHITE,
} from '../../constants/styles';
import ContactUsOptionsMenu from '../../fragments/contact-us-options-menu';
import UserManagement from '../../services/api/resources/user-management';
import {flashMessage} from '../../utils/dialog';
import handleErrorResponse from '../../utils/error-handlers/api';
import {loadData} from '../../utils/storage';
import styles from './styles';

export default class GuestLoginScene extends React.Component {
  userManagement = new UserManagement();

  state = {
    user: {
      firstName: '',
      lastName: '',
    },
  };

  constructor() {
    super();

    this.onContinueButtonPress = this.onContinueButtonPress.bind(this);
  }

  componentDidMount() {
    const loginResponse = this.props.route.params.loginResponse;

    this.setState({
      user: loginResponse.user,
    });
  }

  async onContinueButtonPress() {
    this.setState({
      isLoading: true,
    });

    const {password} = JSON.parse(await loadData(LOGIN_DETAILS));

    const {user} = this.state;

    const {status, response} = await this.userManagement.signupExistingUser(
      {
        mobileNo: user.mobileNo,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roleName: '',
        otp: '',
        domainCode: DEFAULT_DOMAIN_CODE,
        password,
      },
      (sendOtp = true),
      (verifyOtp = false),
      {
        Authorization: CLIENT_BASIC_AUTH_CREDENTIALS,
      },
      (args = {
        env: ENVIRONMENT === UAT ? 'TEST' : '',
      }),
    );

    this.setState({
      isLoading: false,
    });

    console.log({status, response});

    if (status === ERROR_STATUS) {
      flashMessage(null, await handleErrorResponse(response), BLOCKER);

      return;
    }

    this.props.navigation.replace('VerifyPhone', {
      user: {
        mobileNo: user.mobileNo,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roleName: '',
        otp: '',
        domainCode: DEFAULT_DOMAIN_CODE,
        ...user,
        password,
      },
      isExistingUser: true,
    });
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.view}>
        <View style={{height: 70, marginBottom: 25}}>
          <Header paypointLogo />
        </View>
        <ContactUsOptionsMenu
          ref_={component => (this.contactUsOptionsMenu = component)}
          requestClose={() => this.contactUsOptionsMenu.close()}
        />

        <View
          style={{
            marginTop: 16,
            padding: 24,
          }}>
          <AlertStrip
            content={`Hi, ${this.state.user.firstName.toUpperCase()} ${this.state.user.lastName.toUpperCase()}, you currently exist. Would you like to register as a Quickteller Paypoint Agent with the existing details?`}
            variant="information"
          />

          <View
            style={{
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: COLOUR_BLUE,
              borderRadius: 50,
              height: 100,
              justifyContent: 'center',
              marginTop: 30,
              marginBottom: 16,
              padding: 20,
              width: 100,
            }}>
            <FeatherIcon color={`${COLOUR_WHITE}90`} name="user" size={45} />
          </View>

          <Text black bold mid style={{marginTop: 12}}>
            Email Address:
          </Text>
          <Text title>{this.state.user.email}</Text>

          <Text black bold mid style={{marginTop: 12}}>
            Phone Number:
          </Text>
          <Text title>{this.state.user.mobileNo}</Text>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              marginTop: 40,
            }}>
            <Hyperlink
              onPress={() => {
                this.contactUsOptionsMenu.open();
              }}
              style={{
                textAlign: 'right',
                width: '100%',
              }}>
              Contact Support
            </Hyperlink>

            <Button
              containerStyle={{
                marginBottom: 20,
                marginTop: 20,
                maxWidth: '50%',
                width: 150,
              }}
              onPress={() => this.props.navigation.goBack()}
              title="BACK"
              titleStyle={{
                color: COLOUR_PRIMARY,
              }}
              transparent
            />

            <Button
              containerStyle={{
                marginBottom: 20,
                marginTop: 20,
                maxWidth: '50%',
                width: 150,
              }}
              loading={this.state.isLoading}
              onPress={this.onContinueButtonPress}
              title={'CONTINUE'}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

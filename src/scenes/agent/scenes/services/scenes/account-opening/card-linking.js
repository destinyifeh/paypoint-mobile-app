import React, { Component } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';

import { Icon } from 'react-native-elements';

import AtmCard from '../../../../../../components/atm-card';
import Button from '../../../../../../components/button';
import Header from '../../../../../../components/header';
import Text from '../../../../../../components/text';
import { SUCCESSFUL_CARD_LINKING_MESSAGE } from '../../../../../../constants';
import { ERROR_STATUS, SUCCESS_STATUS } from '../../../../../../constants/api';
import { BLOCKER } from '../../../../../../constants/dialog-priorities';
import { COLOUR_BLUE, COLOUR_RED, COLOUR_WHITE, CONTENT_LIGHT } from '../../../../../../constants/styles';
import { accountOpeningService } from '../../../../../../setup/api';
import { getDeviceDetails } from '../../../../../../utils/device';
import { flashMessage } from '../../../../../../utils/dialog';
import handleErrorResponse from '../../../../../../utils/error-handlers/api';
import { AccountOpeningCardForm, AccountOpeningOtpForm } from '../../forms/card-linking-forms';


export default class CardLinkingScene extends Component {
  constructor() {
    super();

    this.onSubmit = this.onSubmit.bind(this);
    this.onSubmitCardDetails = this.onSubmitCardDetails.bind(this);
    this.onSubmitOtp = this.onSubmitOtp.bind(this);

    this.state = {
      banks: [],
      currentForm: 'CardDetails',
      isSettingUp: false,
      cardName: '--',
      cardNumber: null,
      propagateFormErrors: false,
    };
  }

  componentDidMount() {
    this.setState({
      isSettingUp: true,
    });

    this.prepareSanefData();
  }

  checkFormValidityCardDetails() {
    const contactInformationFormIsComplete = this.cardDetailsForm.state.isComplete;
    const contactInformationFormIsValid = this.cardDetailsForm.state.isValid;
    console.log({contactInformationFormIsComplete, contactInformationFormIsValid});
    if (!(contactInformationFormIsComplete && contactInformationFormIsValid)) {
      this.setState({isLoading: false, propagateFormErrors: true});
      return false;
    }

    return true;
  }

  checkFormValidityOtp() {
    const contactInformationFormIsComplete = this.otpForm.state.isComplete;
    const contactInformationFormIsValid = this.otpForm.state.isValid;
    console.log({contactInformationFormIsComplete, contactInformationFormIsValid});
    if (!(contactInformationFormIsComplete && contactInformationFormIsValid)) {
      this.setState({isLoading: false, propagateFormErrors: true});
      return false;
    }

    return true;
  }

  async onSubmitCardDetails() {
    const { deviceUuid } = await getDeviceDetails();
    const { accountNumber, bankCode, cardNumber } = this.cardDetailsForm.state.form;

    if (!this.checkFormValidityCardDetails()) {
      return;
    }

    this.setState({
      cardNumber,
      errorMessage: null,
      isLoading: true,
    });

    const { response, status } = await accountOpeningService.sendCardValidationOtp(
        accountNumber,
        bankCode,
        deviceUuid,
    );

    this.setState({
      isLoading: false,
    });

    console.log({response, status});

    if (status === ERROR_STATUS) {
      flashMessage(
          null,
          await handleErrorResponse(response),
          BLOCKER,
      );

      return;
    }

    this.setState({
      currentForm: 'OtpForm',
      requestId: response.data,
    });
  }

  async onSubmitOtp() {
    const { cardNumber, requestId } = this.state;
    const { otp } = this.otpForm.state.form;

    if (!this.checkFormValidityOtp()) {
      return;
    }

    this.setState({
      errorMessage: null,
      isLoading: true,
    });

    const { response, status } = await accountOpeningService.linkCard(
        cardNumber,
        otp,
        requestId,
    );

    this.setState({
      isLoading: false,
    });

    console.log({response, status});

    if (status === ERROR_STATUS) {
      flashMessage(
          'Error',
          await handleErrorResponse(response),
          BLOCKER,
      );

      return;
    }

    flashMessage(
        'Success',
        SUCCESSFUL_CARD_LINKING_MESSAGE,
        BLOCKER,
    );

    this.props.navigation.goBack();
  }

  onSubmit() {
    return this.state.currentForm === 'CardDetails' ? this.onSubmitCardDetails() : this.onSubmitOtp();
  }

  async prepareSanefData() {
    const { response, status } = (
      await accountOpeningService.registerAgentOnSanef()
    );
      
    console.log({response, status});

    this.setState({
      isSettingUp: false,
    });

    if (status === ERROR_STATUS) {
      this.setState({
        banks: response?.data?.bankList || [],
        errorMessage: await handleErrorResponse(response),
      });
      return;
    }

    const retrieveAccountOpeningBanksResponse = (
      await accountOpeningService.retrieveBanksForCardLinking()
    );

    console.log({retrieveAccountOpeningBanksResponse});

    if (retrieveAccountOpeningBanksResponse.status === SUCCESS_STATUS) {
      this.setState({
        banks: retrieveAccountOpeningBanksResponse.response.data,
      });
    } else {
      this.setState({
        errorMessage: await handleErrorResponse(
            retrieveAccountOpeningBanksResponse.response,
        ),
      });
    }
  }

  render() {
    const { banks, cardName, cardNumber, currentForm, errorMessage, isLoading,
      isSettingUp, propagateFormErrors } = this.state;
    const { navigation, hideNavigator, showNavigator } = this.props;
    const forms = {
      CardDetails: () => <AccountOpeningCardForm
        banks={banks}
        propagateFormErrors={propagateFormErrors}
        ref={(form) => this.cardDetailsForm = form}
        onCardNameChange={(cardName) => this.setState({cardName})}
        onCardNumberChange={(cardNumber) => this.setState({cardNumber})}
      />,
      OtpForm: () => <AccountOpeningOtpForm propagateFormErrors={propagateFormErrors} ref={(form) => this.otpForm = form} />,
    };

    let content = null;
    if (isSettingUp) {
      content = <View style={{flex: .7, justifyContent: 'center'}}>
        <ActivityIndicator size="large" />
      </View>;
    } else if (errorMessage) {
      content = <View>
        <Text>{errorMessage}</Text>
      </View>;
    } else {
      content = (
        <React.Fragment>
          {forms[currentForm]()}
          <View style={{flexDirection: 'row', justifyContent: 'center', paddingVertical: 16}}>
            <Button
              containerStyle={{
                width: '100%',
              }}
              loading={isLoading}
              title="SUBMIT"
              onPress={this.onSubmit}
            />
          </View>
        </React.Fragment>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <Header
          containerStyle={{
            backgroundColor: COLOUR_BLUE,
          }}
          navigationIconColor={COLOUR_WHITE}
          leftComponent={<Icon
            color={COLOUR_RED}
            underlayColor="transparent"
            name="chevron-left"
            size={40}
            type="material"
            onPress={() => navigation.goBack()}
          />}
          hideNavigationMenu={hideNavigator}
          showNavigationMenu={showNavigator}
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_LIGHT,
          }}
          title="Card Linking Form"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
          }}
        />
        <ScrollView contentContainerStyle={{padding: 16}}>
          <AtmCard name={cardName} cardNumber={cardNumber} style={{margin: 16, marginTop: 24}} />
          {content}
         </ScrollView>
      </View>
    );
  }
}

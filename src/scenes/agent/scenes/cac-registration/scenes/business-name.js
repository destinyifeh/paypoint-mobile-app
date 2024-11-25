import React from 'react';
import {StyleSheet, ToastAndroid, View} from 'react-native';
// import { BusinessName } from '../forms/business-name-form'
import {ScrollView} from 'react-native';
import {Icon} from 'react-native-elements';
import {connect} from 'react-redux';
import Header from '../../../../../components/header';
import {APP_NAME, INVALID_FORM_MESSAGE, USER} from '../../../../../constants';
import {ERROR_STATUS, SUCCESS_STATUS} from '../../../../../constants/api';
import {QUICKTELLER_API_TERMINAL_ID} from '../../../../../constants/api-resources';
import {BLOCKER} from '../../../../../constants/dialog-priorities';
import {
  COLOUR_BLUE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_SIZE_TITLE,
} from '../../../../../constants/styles';
import TransactionV1 from '../../../../../services/api/resources/transaction-v1';
import {getDeviceDetails} from '../../../../../utils/device';
import {flashMessage} from '../../../../../utils/dialog';
import {generateChecksum} from '../../../../../utils/helpers';
import {loadData, saveData} from '../../../../../utils/storage';
import {BusinessName as AgentBusinessNameAgentBusinessName} from '../forms/business-name-form';

class BusinessNameDetails extends React.Component {
  constructor() {
    super();
    this.transaction = new TransactionV1();

    this.state = {
      form: {},
      invalidFields: [],
      isLoading: false,
      lineOfBusiness: null,
      proposedBusinessName: null,
      buttonDisabled: true,
      invalidName: false,
      cacRegType: null,
    };

    this.initiateCacRegistration = this.initiateCacRegistration.bind(this);
    this.saveRegType = this.saveRegType.bind(this);
  }

  componentDidMount() {
    const {cacRegType} = this.props.route.params || {};

    this.saveRegType(cacRegType);
    console.log('RegTypeBusiness', cacRegType);
  }

  async saveRegType(type) {
    if (type === 'assisted') {
      await saveData('CAC REG TYPE', type);
    }
  }

  checkFormValidity() {
    const formIsComplete = this.businessNameForm.state.isComplete;
    const formIsValid = this.businessNameForm.state.isValid;

    if (!(formIsComplete && formIsValid)) {
      return;
    }

    this.setState({
      propagateFormErrors: true,
      lineOfBusiness: this.businessNameForm.state.form.lineOfBusiness,
      proposedBusinessName:
        this.businessNameForm.state.form.proposedBusinessName,
      buttonDisabled: false,
      isLoading: true,
    });

    return true;
  }

  showToastPendingStatus = () => {
    ToastAndroid.showWithGravityAndOffset(
      'Successful!',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };

  async initiateCacRegistration2() {
    this.props.navigation.navigate('CacPersonalDetails');
  }

  async initiateCacRegistration() {
    console.log('INITIATE CAC1');
    const isFormValid = this.checkFormValidity();
    if (!isFormValid) {
      flashMessage(APP_NAME, INVALID_FORM_MESSAGE, BLOCKER);
      this.setState({
        errorMessage: null,
        isLoading: false,
      });
    } else {
      const currentUser = JSON.parse(await loadData(USER));
      const deviceDetails = await getDeviceDetails();
      const deviceId = deviceDetails;
      const deviceUuid = deviceId.deviceUuid;
      const amount = 0;
      const paymentItemCode = 'IFISCAC';
      const username = currentUser.username;
      const httpMethod = 'POST';
      console.log('INITIATE CAC2');
      const response = await this.transaction.initiateCacRegistration(
        generateChecksum(
          `${username}${httpMethod}${amount}${httpMethod}${paymentItemCode}${httpMethod}${deviceUuid}`,
        ),
        'CAC_REGISTRATION',
        {
          transactionAmount: 0,
          businessName: this.state.proposedBusinessName,
          lineOfBusiness: this.state.lineOfBusiness,
          paymentItemCode: 'IFISCAC',
          terminalId: QUICKTELLER_API_TERMINAL_ID,
          paymentInstrumentType: 'CASH',
        },
        deviceUuid,
      );
      console.log('INITIATE CAC', response);
      if (response.status === SUCCESS_STATUS) {
        this.setState({
          isLoading: false,
        });
        const businessNameForm = this.businessNameForm.state.form;
        await saveData('cacBusinessFormData', businessNameForm);
        await saveData('cacRegInitiateResponseData', response.response);
        this.showToastPendingStatus();
        this.props.navigation.replace('CacPersonalDetails');
      } else if (response.status === ERROR_STATUS) {
        flashMessage(APP_NAME, response.response.description, BLOCKER);
        this.setState({
          isLoading: false,
        });
      } else if (response.status === ERROR_STATUS && response.code === 503) {
        flashMessage(APP_NAME, 'Service Temporarily Unavailable', BLOCKER);
        this.setState({
          isLoading: false,
        });
      } else {
        flashMessage(APP_NAME, 'Service Temporarily Unavailable', BLOCKER);
        this.setState({
          isLoading: false,
        });
      }
    }
  }

  render() {
    return (
      <View
        style={{
          backgroundColor: COLOUR_WHITE,
          flex: 1,
        }}>
        <Header
          containerStyle={{
            backgroundColor: COLOUR_BLUE,
          }}
          leftComponent={
            <Icon
              color={COLOUR_WHITE}
              underlayColor="transparent"
              name="chevron-left"
              size={40}
              type="material"
              onPress={() =>
                // this.props.navigation.navigate("AgentUpgradeLanding")
                this.props.navigation.replace('Agent')
              }
            />
          }
          navigationIconColor={COLOUR_WHITE}
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_LIGHT,
          }}
          title={`CAC Registration`}
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
            fontSize: FONT_SIZE_TITLE,
          }}
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          withNavigator={this.props.withNavigator}
        />

        <ScrollView>
          <View
            style={{
              backgroundColor: COLOUR_WHITE,
              flex: 1,
            }}>
            <AgentBusinessNameAgentBusinessName
              propagateFormErrors={this.state.propagateFormErrors}
              ref={form => (this.businessNameForm = form)}
              superAgents={this.props.superAgents}
              onPress={() => this.initiateCacRegistration()}
              loading={this.state.isLoading}
              // validName={true}
            />

            <View style={{paddingHorizontal: 20}}>
              {/* <Button
                onPress={() => this.initiateCacRegistration()}
                title="Next"
                loading={this.state.isLoading}
                buttonStyle={{ backgroundColor: COLOUR_BLUE }}
                containerStyle={{
                  backgroundColor: COLOUR_BLUE,
                  width: "100%",
                }}
                disabled={this.state.buttonDisabled}
              /> */}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFastRefreshPending: state.tunnel.isFastRefreshPending,
    isNavigatorVisible: state.navigation.isNavigatorVisible,
    navigationState: state.tunnel.navigationState,
    screenAfterLogin: state.tunnel.screenAfterLogin,
    remoteConfig: state.tunnel.remoteConfig,
    requeryTransactionBucket: state.tunnel.requeryTransactionBucket,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideNavigator: () => dispatch(hideNavigator()),
    setIsFastRefreshPending: value => dispatch(setIsFastRefreshPending(value)),
    setScreenAfterLogin: screen => dispatch(setScreenAfterLogin(screen)),
    showNavigator: () => dispatch(showNavigator()),
    navigateTo: message => dispatch(navigateTo(message)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BusinessNameDetails);

const styles = StyleSheet.create({});

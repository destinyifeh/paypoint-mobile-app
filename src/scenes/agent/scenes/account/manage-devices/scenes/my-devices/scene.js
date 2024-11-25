import React, {Component} from 'react';
import {ToastAndroid, View} from 'react-native';
import {Icon, Image} from 'react-native-elements';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import ActivityIndicator from '../../../../../../../components/activity-indicator';
import Button from '../../../../../../../components/button';
import ClickableListItem from '../../../../../../../components/clickable-list-item';
import Header from '../../../../../../../components/header';
import Modal from '../../../../../../../components/modal';
import Text from '../../../../../../../components/text';
import {
  ERROR_STATUS,
  HTTP_ACCEPTED,
  HTTP_OK,
} from '../../../../../../../constants/api';
import {
  COLOUR_BLUE,
  COLOUR_GREEN,
  COLOUR_GREY,
  COLOUR_LIGHT_GREY,
  COLOUR_LINK_BLUE,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../../../../../constants/styles';
import UserManagement from '../../../../../../../services/api/resources/user-management';
import {retrieveAuthToken} from '../../../../../../../utils/auth';
import handleErrorResponse from '../../../../../../../utils/error-handlers/api';
import {OtpForm} from './form';

class Device extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: false,
      showDetails: false,
    };

    this.activateDevice = this.activateDevice.bind(this);
    this.deactivateDevice = this.deactivateDevice.bind(this);
    this.deleteDevice = this.deleteDevice.bind(this);
  }

  async activateDevice(otp, verifyOtp) {
    const {item} = this.props;

    this.setState({
      isLoading: true,
    });

    const {status, response, code} = await this.props.onActivateDevice(
      item.deviceid,
      otp,
      verifyOtp,
    );
    console.log({status, response, code});

    if (status === ERROR_STATUS) {
      this.setState({
        isLoading: false,
      });

      ToastAndroid.show(await handleErrorResponse(response), ToastAndroid.LONG);

      return;
    }

    if (code === HTTP_ACCEPTED) {
      this.setState({
        isLoading: false,
        pendingAction: this.activateDevice,
        showOtpForm: true,
      });

      return;
    }

    this.setState({
      isLoading: false,
      showDetails: false,
      showOtpForm: false,
    });
  }

  async deactivateDevice(otp, verifyOtp) {
    const {item} = this.props;

    this.setState({
      isLoading: true,
    });

    const {status, response, code} = await this.props.onDeactivateDevice(
      item.deviceid,
      otp,
      verifyOtp,
    );
    console.log({status, response, code});

    if (status === ERROR_STATUS) {
      this.setState({
        isLoading: false,
      });

      ToastAndroid.show(await handleErrorResponse(response), ToastAndroid.LONG);

      return;
    }

    if (code === HTTP_ACCEPTED) {
      this.setState({
        isLoading: false,
        pendingAction: this.deactivateDevice,
        showOtpForm: true,
      });

      return;
    }

    this.setState({
      isLoading: false,
      showDetails: false,
      showOtpForm: false,
    });
  }

  async deleteDevice(otp, verifyOtp) {
    const {item} = this.props;

    this.setState({
      isLoading: true,
    });

    const {status, response, code} = await this.props.onDeleteDevice(
      item.deviceid,
      otp,
      verifyOtp,
    );
    console.log({status, response, code});

    if (status === ERROR_STATUS) {
      this.setState({
        isLoading: false,
      });

      ToastAndroid.show(await handleErrorResponse(response), ToastAndroid.LONG);

      return;
    }

    if (code === HTTP_ACCEPTED) {
      this.setState({
        isLoading: false,
        pendingAction: this.deleteDevice,
        showOtpForm: true,
      });

      return;
    }

    this.setState({
      isLoading: false,
      showDetails: false,
      showOtpForm: false,
    });
  }

  submitOtp() {
    const {pendingAction} = this.state;

    this.setState({
      errorMessage: null,
      isLoading: true,
    });

    const formData = this.otpForm.state.form;
    const formIsComplete = this.otpForm.state.isComplete;
    const formIsValid = this.otpForm.state.isValid;

    if (!(formIsComplete && formIsValid)) {
      this.setState({
        isLoading: false,
        propagateFormErrors: true,
      });

      return;
    }

    pendingAction(formData.otp, true);
  }

  modalContent() {
    const {isLoading, propagateFormErrors, showOtpForm} = this.state;

    if (isLoading) {
      return <ActivityIndicator />;
    }

    if (showOtpForm) {
      return (
        <View
          style={{justifyContent: 'space-between', width: '100%', padding: 16}}>
          <OtpForm
            isDisabled={isLoading}
            propagateFormErrors={propagateFormErrors}
            ref={form => (this.otpForm = form)}
          />
          <Button
            containerStyle={{
              marginBottom: 20,
              width: '100%',
            }}
            loading={this.state.isLoading}
            onPress={this.submitOtp.bind(this)}
            title="CONTINUE"
          />
        </View>
      );
    }

    return (
      <View>
        <ClickableListItem
          style={{
            borderBottomWidth: 1,
            borderBottomColor: COLOUR_LIGHT_GREY,
            flexDirection: 'row',
            padding: 10,
            width: 300,
          }}
          onPressOut={() => this.activateDevice(null, false)}>
          <Icon
            color={COLOUR_GREEN}
            name="check"
            size={22}
            containerStyle={{marginHorizontal: 5}}
            type="feather"
          />
          <Text>Activate</Text>
        </ClickableListItem>
        <ClickableListItem
          style={{
            borderBottomWidth: 1,
            borderBottomColor: COLOUR_LIGHT_GREY,
            flexDirection: 'row',
            padding: 10,
            width: 300,
          }}
          onPressOut={() => this.deactivateDevice(null, false)}>
          <Icon
            containerStyle={{marginHorizontal: 5}}
            color={COLOUR_RED}
            name="x"
            size={22}
            type="feather"
          />
          <Text>Deactivate</Text>
        </ClickableListItem>
        <ClickableListItem
          style={{
            borderBottomWidth: 1,
            borderBottomColor: COLOUR_LIGHT_GREY,
            flexDirection: 'row',
            padding: 10,
            width: 300,
          }}
          onPressOut={() => this.deleteDevice(null, false)}>
          <Icon
            containerStyle={{marginHorizontal: 5}}
            color={COLOUR_GREY}
            name="trash"
            size={22}
            type="feather"
          />
          <Text>Delete</Text>
        </ClickableListItem>
      </View>
    );

    return modalContent;
  }

  modal() {
    const {showOtpForm} = this.state;

    return (
      <Modal
        title={showOtpForm ? 'Enter Your OTP' : this.props.item.deviceName}
        size={'sm'}
        onRequestClose={() =>
          this.setState({
            showDetails: false,
          })
        }
        content={this.modalContent()}
      />
    );
  }

  render() {
    const {item} = this.props;
    const statusIconColor = {
      Active: COLOUR_GREEN,
      Inactive: COLOUR_RED,
    }[item.status];

    return (
      <View
        style={{
          backgroundColor: COLOUR_WHITE,
          borderRadius: 5,
          height: 120,
          marginBottom: 10,
        }}>
        {this.state.showDetails && this.modal()}

        <View
          style={{
            borderBottomColor: COLOUR_LIGHT_GREY,
            borderBottomWidth: 1,
            borderTopLeftRadius: 5,
            flex: 0.75,
            flexDirection: 'row',
          }}>
          <View
            style={{
              backgroundColor: COLOUR_LIGHT_GREY,
              borderTopLeftRadius: 5,
              flex: 0.3,
              alignItems: 'center',
            }}>
            <Image
              source={require('../../../../../../../assets/media/images/laptop.png')}
              style={{
                resizeMode: 'center',
              }}
              width={95}
            />
          </View>

          <View
            style={{
              borderRadius: 5,
              flex: 0.6,
              justifyContent: 'space-evenly',
              padding: 10,
            }}>
            <Text black>{`Device Name: ${item.deviceName}`}</Text>
            <Text small>{`Terminal ID: ${item.terminalId}`}</Text>
          </View>

          <View
            style={{
              flex: 0.1,
              alignItems: 'center',
              paddingTop: 15,
            }}>
            <TouchableOpacity
              style={{height: 200, width: 200}}
              onPress={() => this.setState({showDetails: true})}>
              <Icon
                color={!this.state.showDetails ? COLOUR_GREY : COLOUR_LINK_BLUE}
                onPress={() => this.setState({showDetails: true})}
                name="more-vertical"
                type="feather"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            alignItems: 'center',
            flex: 0.25,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}>
          <Text style={{color: statusIconColor}}>{item.status}</Text>
          {/* <Text small uppercase>Last Event: {item.last_modified}</Text> */}
        </View>
      </View>
    );
  }
}

export default class MyDevicesScene extends Component {
  userManagement = new UserManagement();

  constructor() {
    super();

    this.state = {
      expand: null,
      isLoading: false,
    };

    this.onActivateDevice = this.onActivateDevice.bind(this);
    this.onDeactivateDevice = this.onDeactivateDevice.bind(this);
    this.onDeleteDevice = this.onDeleteDevice.bind(this);
    this.loadDevices = this.loadDevices.bind(this);
  }

  componentDidMount() {
    const {devices = []} = this.props.route?.params || {};

    this.setState({
      devices: devices,
    });
  }

  async loadDevices() {
    const {authToken} = await retrieveAuthToken();
    const {code, response, status} = await this.userManagement.getDeviceList(
      authToken,
    );

    console.log('GET DEVICES', code, response, status);

    if (status === ERROR_STATUS) {
      ToastAndroid.show(await handleErrorResponse(response), ToastAndroid.LONG);

      this.setState({
        isLoading: false,
      });

      return;
    }

    this.setState({
      devices: response.data,
      isLoading: false,
    });
  }

  async onActivateDevice(deviceId, otp, verifyOtp) {
    const {authToken} = await retrieveAuthToken();

    response = await this.userManagement.activateDevice(
      deviceId,
      otp,
      verifyOtp,
    );

    if (response.code === HTTP_OK) {
      const {devices} = this.state;
      devices.map(value => {
        if (value.deviceid === deviceId) {
          value.active = true;
          value.status = 'Active';
        }
      });

      this.setState({
        devices,
      });
    }

    return response;
  }

  async onDeactivateDevice(deviceId, otp, verifyOtp) {
    const {authToken} = await retrieveAuthToken();

    const response = await this.userManagement.deactivateDevice(
      deviceId,
      otp,
      verifyOtp,
    );

    if (response.code === HTTP_OK) {
      const {devices} = this.state;
      devices.map(value => {
        if (value.deviceid === deviceId) {
          value.active = false;
          value.status = 'Inactive';
        }
      });

      this.setState({
        devices,
      });
    }

    return response;
  }

  async onDeleteDevice(deviceId, otp, verifyOtp) {
    const {authToken} = await retrieveAuthToken();

    const response = await this.userManagement.deleteDevice(
      deviceId,
      otp,
      verifyOtp,
    );

    if (response.code === HTTP_OK) {
      const {devices} = this.state;
      devices.filter(value => value.deviceid !== deviceId);

      this.setState({
        devices,
      });
    }

    return response;
  }

  renderItem(item, index) {
    return (
      <Device
        index={index}
        item={item}
        onActivateDevice={this.onActivateDevice}
        onDeactivateDevice={this.onDeactivateDevice}
        onDeleteDevice={this.onDeleteDevice}
      />
    );
  }

  renderSectionHeader(item) {
    return (
      <Text style={{lineHeight: 32, marginLeft: 10, marginTop: 30}}>
        {item}
      </Text>
    );
  }

  render() {
    return this.state.isLoading ? (
      <ActivityIndicator />
    ) : (
      <View
        style={{
          backgroundColor: '#F3F3F4',
          flex: 1,
        }}>
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
              size={32}
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
          title="My Devices"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
          }}
        />

        <FlatList
          contentContainerStyle={{
            padding: 20,
          }}
          data={this.state.devices}
          keyExtractor={(item, index) => index}
          renderItem={({item, index}) => this.renderItem(item)}
        />
      </View>
    );
  }
}

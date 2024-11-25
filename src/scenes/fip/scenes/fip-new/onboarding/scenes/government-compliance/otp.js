import React from 'react';
import {Icon} from 'react-native-elements';

import {
  BackHandler,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import Button from '../../../../../../../components/button';
import Header from '../../../../../../../components/header';
import {ERROR_STATUS} from '../../../../../../../constants/api';
import {OTP_LENGTH} from '../../../../../../../constants/fields';
import {
  COLOUR_BLACK,
  COLOUR_BLUE,
  COLOUR_FORM_CONTROL_BACKGROUND,
  COLOUR_LINK_BLUE,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_FAMILY_BODY,
  FONT_FAMILY_BODY_SEMIBOLD,
  FONT_SIZE_MID,
  FONT_SIZE_TEXT_INPUT,
  FONT_SIZE_TITLE,
} from '../../../../../../../constants/styles';
import {onboardingService} from '../../../../../../../setup/api';
import {flashMessage} from '../../../../../../../utils/dialog';
import FipProgressBar from '../../components/fip-progress-bar';

function FipAgentOtpVerification(props) {
  const {bvn, tokenId, tokenPrefix, kycId, bvnPhoneNumber} =
    props.route.params?.bvnInfo || {};

  console.log(bvn, 'bvnnnn');
  console.log(kycId, 'kycid');
  console.log(bvnPhoneNumber, 'bvnPhone');

  const [state, setState] = React.useState({
    errorMessage: null,
    propagateFormErrors: false,
    description: null,
    message: null,
    isLoading: false,
    user: null,
    isLoadingOtp: false,
    isError: false,
    otp: '',
    tokenId: null,
    prefix: null,
    bvn: null,
    kycId: null,
  });

  const handleBackButtonPress = () => {
    props.navigation.goBack();
    return true;
  };

  React.useEffect(() => {
    setState(prev => ({
      ...prev,
      bvn: bvn,
      prefix: tokenPrefix,
      tokenId: tokenId,
      kycId: kycId,
    }));
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonPress,
    );
    return () => backHandler.remove();
  }, []);

  React.useEffect(() => {
    checkIncomingRoute();
  }, []);

  const checkIncomingRoute = () => {
    if (props.navigationState.previousScreen === 'Login') {
      props.navigation.replace('HomeTabs');
      return;
    }
  };

  const onOtpValidation = async () => {
    let validateOtpRes;
    try {
      setState(prevState => ({
        ...prevState,
        isLoadingOtp: true,
        errorMessage: null,
        isError: false,
      }));

      console.log(state.otp, 'my otp');

      if (!state.otp) {
        setState(prevState => ({
          ...prevState,
          isLoadingOtp: false,
          errorMessage: 'Please enter your OTP',
          isError: true,
        }));
      } else if (state.otp.length !== OTP_LENGTH) {
        setState(prevState => ({
          ...prevState,
          isLoadingOtp: false,
          errorMessage: 'Invalid OTP',
          isError: true,
        }));
      } else {
        const requestPayloadObject = {
          tokenId: state.tokenId,
          prefix: state.prefix,
        };
        console.log(requestPayloadObject, 'payload...');

        validateOtpRes = await onboardingService.validateFipBvnPhone(
          state.otp,
          requestPayloadObject,
        );
        const {status, response} = validateOtpRes;
        console.log(validateOtpRes, 'my ress');

        if (status === ERROR_STATUS) {
          setState(prevState => ({
            ...prevState,
            isLoadingOtp: false,
            isError: true,
            errorMessage: response?.description,
          }));
          return false;
        }
        setState(prevState => ({
          ...prevState,
          isLoadingOtp: false,
          otp: '',
        }));
        const data = {
          bvn: state.bvn,
          kycId: state.kycId,
        };
        props.navigation.replace('FipAgentFacialVerification', {
          data: data,
        });
      }
    } catch (err) {
      console.log(err, 'vaidate otp err');

      setState(prevState => ({
        ...prevState,
        isLoadingOtp: false,
        errorMessage: validateOtpRes?.description
          ? validateOtpRes.description
          : 'Something went wrong, please try again',
        isError: true,
      }));
    }
  };

  const onOtpResend = async () => {
    let resendOtpRes;
    try {
      setState(prevState => ({
        ...prevState,
        isLoadingOtp: true,
        errorMessage: null,
        isError: false,
        otp: '',
      }));

      console.log(state.otp, 'my otp');

      resendOtpRes = await onboardingService.resendFipBvnPhoneOtp(
        state.tokenId,
      );
      const {status, response} = resendOtpRes;
      console.log(resendOtpRes, 'my ress');
      if (status === ERROR_STATUS) {
        setState(prevState => ({
          ...prevState,
          isLoadingOtp: false,
          isError: true,
          errorMessage: response?.description,
        }));
        return false;
      }
      setState(prevState => ({
        ...prevState,
        isLoadingOtp: false,
        tokenId: response.tokenId,
        prefix: response.prefix,
      }));
      flashMessage(null, 'The OTP has been resent successfully');
    } catch (err) {
      console.log(err);
      setState(prevState => ({
        ...prevState,
        isLoadingOtp: false,
        errorMessage: resendOtpRes?.description
          ? resendOtpRes.description
          : 'Something went wrong, please try again',
        isError: true,
      }));
    }
  };

  const maskPhoneNumber = phoneNumber => {
    // Convert the number to a string if it's not already
    const phoneNumberStr = phoneNumber?.toString();

    // Mask the middle part with asterisks
    return phoneNumberStr?.slice(0, 7) + '****' + phoneNumberStr?.slice(-2);
  };
  return (
    <View style={styles.mainContainer}>
      <Header
        containerStyle={{
          backgroundColor: COLOUR_BLUE,
        }}
        leftComponent={
          <Icon
            underlayColor="transparent"
            color={COLOUR_WHITE}
            name="chevron-left"
            size={40}
            type="material"
            onPress={() => props.navigation.goBack()}
          />
        }
        statusBarProps={{
          backgroundColor: 'transparent',
          barStyle: CONTENT_LIGHT,
        }}
        title="Setup New Agent"
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: 'bold',
          fontSize: FONT_SIZE_TITLE,
        }}
      />
      <View style={{width: '95%', alignSelf: 'center'}}>
        <FipProgressBar step="2" />
      </View>
      <View style={styles.contentContainer}>
        <Text
          style={{
            color: COLOUR_BLACK,
            fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
            fontSize: 20,
            lineHeight: 24,
            fontWeight: '600',
          }}>
          Enter OTP
        </Text>
        <Text
          style={{
            color: COLOUR_BLACK,
            fontFamily: FONT_FAMILY_BODY,
            fontSize: FONT_SIZE_MID,
            lineHeight: 20,
            marginTop: 8,
          }}>
          An OTP was sent to your BVN Phone number{' '}
          {bvnPhoneNumber ? bvnPhoneNumber : null}. Kindly enter it below
        </Text>
        <View style={{width: '100%', marginTop: 18}}>
          <Text
            style={{
              color: COLOUR_BLACK,
              fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
              fontSize: FONT_SIZE_MID,
              lineHeight: 20,
              marginBottom: 8,
            }}>
            OTP
          </Text>
          <TextInput
            keyboardType="number-pad"
            maxLength={6}
            editable={!state.isLoadingOtp}
            placeholder=""
            onChangeText={otp => {
              setState(prevState => ({
                ...prevState,
                errorMessage: '',
                isError: false,
                otp: otp,
              }));
            }}
            defaultValue={state.otp}
            style={[
              styles.inputStyle,
              {
                borderColor: state.errorMessage
                  ? COLOUR_RED
                  : COLOUR_FORM_CONTROL_BACKGROUND,
                color: state.isError ? COLOUR_RED : undefined,
              },
            ]}
          />
          <TouchableOpacity style={{marginTop: 5}} onPress={onOtpResend}>
            <Text style={{color: COLOUR_LINK_BLUE}}>Resend OTP</Text>
          </TouchableOpacity>
          {state.isError && (
            <View style={styles.errorView}>
              <Icon
                name="info-circle"
                type="font-awesome"
                color="#DC4437"
                size={18}
              />

              <Text style={styles.errorText}>{state.errorMessage}</Text>
            </View>
          )}
          <View>
            <Button
              onPress={onOtpValidation}
              containerStyle={{
                backgroundColor: COLOUR_BLUE,
                marginBottom: 20,
                marginTop: 40,
              }}
              title="Next"
              buttonStyle={{backgroundColor: COLOUR_BLUE}}
              loading={state.isLoadingOtp}
              disabled={state.isLoadingOtp}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    width: '90%',
    alignSelf: 'center',
    flex: 1,
    paddingVertical: 15,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  inputStyle: {
    fontFamily: FONT_FAMILY_BODY,
    fontSize: FONT_SIZE_TEXT_INPUT,
    width: '100%',
    backgroundColor: COLOUR_FORM_CONTROL_BACKGROUND,

    borderWidth: 1.5,
    borderRadius: 8,
    flexDirection: 'row',
    height: 50,
    padding: 0,
    paddingLeft: 15,
  },

  errorText: {
    color: '#DC4437',
    fontFamily: FONT_FAMILY_BODY,
    fontSize: FONT_SIZE_MID,
    lineHeight: 20,
    left: 3,
  },
  errorView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '98%',
    alignSelf: 'center',
  },
  inputError: {
    color: '#DC4437',
  },
});

function mapStateToProps(state) {
  return {
    navigationState: state.tunnel.navigationState,
  };
}

export default connect(mapStateToProps)(FipAgentOtpVerification);

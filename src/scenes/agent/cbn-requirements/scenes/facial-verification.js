import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  PermissionsAndroid,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import {Icon} from 'react-native-elements';

import Header from '../../../../components/header';
import {ERROR_STATUS, SUCCESS_STATUS} from '../../../../constants/api';
import {
  COLOUR_BLUE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../../constants/styles';
import CbnOtpPrompt from '../../../../fragments/cbn-otp-prompt';
import FaceIdVerificationModal from '../../../../fragments/face-id-verifiction-modal';
import {platformService} from '../../../../setup/api';
import ProgressBar from '../../../aggregator/components/progress-bar';

function AgentFacialVerification(props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [jobIdNum, setJobIdNum] = useState('');
  const [prefix, setPrefix] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [otp, setOtp] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const faceIdModalRef = useRef(null);
  const inputOtpRef = useRef();
  const {bvn} = props.route?.params?.bvnInfo || {};

  React.useEffect(() => {
    setIsModalVisible(true);
  }, []);

  useEffect(() => {
    if (bvn && jobIdNum) {
      setIsLoading(false);
      setIsModalVisible(false);
      openWebView();
    }
  }, [jobIdNum]);

  useEffect(() => {
    const handleFocus = () => {
      setIsModalVisible(true);
    };

    const focusListener = props.navigation.addListener('didFocus', handleFocus);
  }, [props.navigation]);

  const requestCameraPermission = async () => {
    try {
      setIsLoading(true);
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Quickteller App Camera Permission',
          message:
            'Quickteller App needs access to your camera so you can complete your verification.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        initiateLivelinessCheck();
      } else {
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const showAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: '',
          onPress: () => {},
        },
        {
          text: 'Try Again',
          onPress: () => props.navigation.replace('AgentBvnVerification'),
          style: 'cancel',
        },
      ],

      {cancelable: false},
    );
  };

  const showOtpErrorAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: '',
          onPress: () => {},
        },
        {
          text: 'OK',
          onPress: () => {},
          style: 'cancel',
        },
      ],

      {cancelable: true},
    );
  };

  const showToastPendingStatus = () => {
    ToastAndroid.showWithGravityAndOffset(
      'OTP sent successfully!',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };

  const resendOtp = async () => {
    setIsSendingOtp(true);
    console.log('OTPINPUT', otp);
    try {
      const response = await platformService.resendCbnComplianceOtp(tokenId);
      console.log('TOKENNEW', response);
      if (response.status === SUCCESS_STATUS && response.code === 200) {
        setIsSendingOtp(false);
        showToastPendingStatus();
      } else {
        setIsSendingOtp(false);
        showOtpErrorAlert(
          '',
          'Oops! Something went wrong while sending the OTP. Please try again to resend the OTP.',
        );
      }
    } catch (error) {
      setIsSendingOtp(false);
      showOtpErrorAlert(
        '',
        'Oops! Something went wrong while sending the OTP. Please try again to resend the OTP.',
      );
      return null;
    }
  };

  const validateOtp = async () => {
    const otpValidatePayload = {
      tokenId: tokenId,
    };
    setOtpLoading(true);
    const otpInput = `${prefix}-${otp}`;
    console.log('OTPPREFIX', otpInput);
    try {
      const response = await platformService.validateCbnOtp(
        otpInput,
        otpValidatePayload,
      );
      console.log('VALIDATEOTP', response);
      if (response.status === SUCCESS_STATUS && response.code === 200) {
        setOtpLoading(false);
        inputOtpRef.current.close();
        setIsModalVisible(false);
        props.navigation.navigate('AgentNinVerification', {
          bvn: bvn,
        });
      } else {
        setOtpLoading(false);
        showOtpErrorAlert('otp is invalid', '');
      }
    } catch (error) {
      setOtpLoading(false);
      showOtpErrorAlert('otp is invalid', '');
      return null;
    }
  };

  const initiateLivelinessCheck = async () => {
    try {
      const response = await platformService.initiateLivelinessCheck(bvn);
      console.log('RESPONSEINITIATE', response);
      console.log('RESPONSEINITIATE2', response.response.data.prefix);
      console.log('RESPONSEINITIATE3', response.code);
      console.log('RESPONSEINITIATE3', response.status);
      if (response.status === ERROR_STATUS && response.code === 409) {
        setIsLoading(false);
        setPrefix(response.response.data.prefix);
        setTokenId(response.response.data.tokenId);
        inputOtpRef.current.open();
      } else if (response.status === SUCCESS_STATUS && response.code === 200) {
        const {jobId} = response.response.data;
        setJobIdNum(jobId);
      }
    } catch (error) {
      setIsLoading(false);
      showAlert('Error Initiating', '');
      return null;
    }
  };

  const onRequestClose = () => {
    props.navigation.navigate('AgentBvnVerification');
    setIsModalVisible(false);
  };

  const openWebView = () => {
    props.navigation.navigate('AgentWebViewFacialVerification', {
      jobId: jobIdNum,
      bvn: bvn,
    });
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
            onPress={() => props.navigation.navigate('AgentBvnVerification')}
          />
        }
        statusBarProps={{
          backgroundColor: 'transparent',
          barStyle: CONTENT_LIGHT,
        }}
        title=""
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: 'bold',
        }}
      />
      <ProgressBar step="2" />

      <FaceIdVerificationModal
        navigation={props.navigation}
        faceIdPromptModalRef={faceIdModalRef}
        bvn={bvn}
        visible={isModalVisible}
        proceed={requestCameraPermission}
        isLoading={isLoading}
        disabled={isLoading}
        onRequestClose={onRequestClose}
      />
      <CbnOtpPrompt
        inputOtpRef={inputOtpRef}
        defaultValue={prefix}
        resendOtp={resendOtp}
        isSendingOtp={isSendingOtp}
        otp={otp}
        setOtp={setOtp}
        otpOk={validateOtp}
        loading={otpLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default AgentFacialVerification;

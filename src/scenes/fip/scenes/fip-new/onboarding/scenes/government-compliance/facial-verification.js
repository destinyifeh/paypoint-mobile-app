import React, {useEffect, useRef, useState} from 'react';
import {Alert, PermissionsAndroid, StyleSheet, View} from 'react-native';
import {Icon} from 'react-native-elements';

import {BackHandler} from 'react-native';
import {connect} from 'react-redux';
import Header from '../../../../../../../components/header';
import {
  ERROR_STATUS,
  SUCCESS_STATUS,
  SUCCESSFUL_STATUS,
} from '../../../../../../../constants/api';
import {
  COLOUR_BLUE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_SIZE_TITLE,
} from '../../../../../../../constants/styles';
import FaceIdVerificationModal from '../../../../../../../fragments/face-id-verifiction-modal';
import {onboardingService} from '../../../../../../../setup/api';
import FipProgressBar from '../../components/fip-progress-bar';

function FipAgentFacialVerification(props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [jobIdNum, setJobIdNum] = useState('');
  const [agentBvn, setAgentBvn] = useState('');
  const [agentKycid, setAgentKycId] = useState('');

  const faceIdModalRef = useRef(null);
  const {kycId, bvn} = props.route.params?.data || {};

  console.log(bvn, 'agent bvn');
  console.log(kycId, 'agent kycId');

  React.useEffect(() => {
    setAgentBvn(bvn);
    setAgentKycId(kycId);
    setIsModalVisible(true);
    checkIncomingRoute();
  }, []);

  const handleBackButtonPress = () => {
    onRequestClose();

    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonPress,
    );
    return () => backHandler.remove();
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

  const checkIncomingRoute = () => {
    if (props.navigationState.previousScreen === 'Login') {
      props.navigation.replace('HomeTabs');
      return;
    }
  };

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
        setIsLoading(false);
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
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Home',
          onPress: () => {
            props.navigation.replace('HomeTabs'), setIsModalVisible(false);
          },
        },
      ],

      {cancelable: false},
    );
  };

  const initiateLivelinessCheck = async () => {
    const payload = {
      identificationNumber: agentBvn,
      kycId: agentKycid,
    };

    console.log(payload, 'payloader');
    try {
      const res = await onboardingService.initiateLivelinessCheck(agentKycid);
      const {status, response, code} = res;
      const {kycData, description} = response;
      console.log('RESPONSEINITIATE', res);
      console.log('RESPONSEINITIATE2', response);

      if (status === ERROR_STATUS) {
        setIsLoading(false);
        showAlert(
          null,
          description
            ? description
            : 'Oops! Something went wrong while initiating your request. Please try again',
        );
      } else if (
        status === SUCCESS_STATUS &&
        description === SUCCESSFUL_STATUS
      ) {
        const {jobId, kycId} = kycData;
        setJobIdNum(jobId);
        setAgentKycId(kycId);
        setIsLoading(false);
      } else {
        setIsLoading(false);

        showAlert(
          null,
          description
            ? description
            : 'Oops! Something went wrong while initiating your request. Please try again',
        );
        return;
      }
    } catch (error) {
      console.log(error, 'liveliness err');
      setIsLoading(false);
      showAlert(
        null,
        'Oops! Something went wrong while initiating your request. Please try again',
      );
      return;
    }
  };

  const onRequestClose = () => {
    //  props.navigation.navigate("FipAgentBvnVerification");
    // setIsModalVisible(false);
  };

  const openWebView = () => {
    const data = {
      jobId: jobIdNum,
      bvn: agentBvn,
      kycId: agentKycid,
    };
    props.navigation.navigate('FipAgentWebViewFacialVerification', {
      data: data,
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
        <FipProgressBar step="3" />
      </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

function mapStateToProps(state) {
  return {
    navigationState: state.tunnel.navigationState,
  };
}

export default connect(mapStateToProps)(FipAgentFacialVerification);

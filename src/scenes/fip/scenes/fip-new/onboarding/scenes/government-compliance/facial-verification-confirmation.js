import React from 'react';
import {
  BackHandler,
  Image,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import failedIcon from '../../../../../../../assets/media/icons/failure-animation-icon.png';
import successIcon from '../../../../../../../assets/media/icons/success-verification-confirmation-icon.png';
import ActivityIndicator from '../../../../../../../components/activity-indicator';
import {SUCCESS_STATUS} from '../../../../../../../constants/api';
import {FONT_FAMILY_BODY} from '../../../../../../../constants/styles';
import {onboardingService} from '../../../../../../../setup/api';

function FipAgentFacialVerificationConfirmation(props) {
  const [verified, setVerified] = React.useState(false);
  const [verificationFailed, setVerificationFailed] = React.useState(false);

  const {jobId, kycId, bvn} = props.route.params?.data || {};

  console.log(kycId, 'kycid, succ');
  console.log(jobId, 'jobid, succ');
  console.log(bvn, 'bvnnnn, succ');

  const handleBackButtonPress = () => {
    props.navigation.goBack();
    return true;
  };

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonPress,
    );
    return () => backHandler.remove();
  }, []);

  React.useEffect(() => {
    if (jobId && !verified && !verificationFailed) {
      const intervalId = setInterval(() => {
        handleStatus();
      }, 10000); // Call every 10 seconds
      return () => clearInterval(intervalId);
    }
  }, [jobId, verified, verificationFailed]);

  React.useEffect(() => {
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

  const showToastPendingStatus = () => {
    ToastAndroid.showWithGravityAndOffset(
      'Please wait for about 3-5minutes while we validate your details!',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };

  const handleStatus = async () => {
    const payload = {
      jobId: jobId,
      kycId: kycId,
    };
    console.log(payload, 'my payloader');
    try {
      const res = await onboardingService.getKycRecordStatus(payload);
      const {status, response} = res;
      console.log(res, ' res');
      if (response.description === 'Failed') {
        setVerificationFailed(true);

        return;
      } else if (
        status === SUCCESS_STATUS &&
        response.description === 'Successful'
      ) {
        setVerified(true);
        return;
      } else if (
        status === SUCCESS_STATUS &&
        response.description === 'Pending'
      ) {
        showToastPendingStatus();
        return;
      } else {
        setVerificationFailed(true);

        return;
      }
    } catch (err) {
      console.log(err, 'status err');
    }
  };

  const onNext = () => {
    props.navigation.replace('FipAgentNinVerification', {
      kycId: kycId,
    });
  };

  return (
    <View style={styles.main}>
      <View style={styles.contentContainer}>
        {verified ? (
          <>
            <Image source={successIcon} />
            <View style={{marginTop: 15}}>
              <Text style={styles.titeText}>Verification Successful!</Text>
              <Text style={styles.descText}>
                Your face ID verification was successful, please click on the
                button to continue.
              </Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={onNext}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </>
        ) : verificationFailed ? (
          <>
            <Image source={failedIcon} />
            <View style={{marginTop: 15}}>
              <Text style={styles.titeText}>Verification Failed!</Text>
              <Text style={styles.descText}>
                Unable to complete face ID Verification. Please try again.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => props.navigation.replace('HomeTabs')}>
              <Text style={styles.buttonText}>Okay</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <ActivityIndicator />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    width: '90%',
    alignSelf: 'center',
    flex: 1,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderWidth: 1,
    borderColor: '#479FC8',
    height: 56,
    borderRadius: 8,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  buttonText: {
    color: '#479FC8',
    fontFamily: FONT_FAMILY_BODY,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  descText: {
    color: '#9CA3AF',
    fontFamily: FONT_FAMILY_BODY,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    width: 269.27,
    textAlign: 'center',
  },
  titeText: {
    color: '#10345E',
    fontFamily: FONT_FAMILY_BODY,
    fontSize: 24.98,
    lineHeight: 32,
    fontWeight: '700',
    textAlign: 'center',
  },
});

function mapStateToProps(state) {
  return {
    navigationState: state.tunnel.navigationState,
  };
}

export default connect(mapStateToProps)(FipAgentFacialVerificationConfirmation);

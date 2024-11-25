import React from 'react';
import {Icon} from 'react-native-elements';

import {BackHandler, StyleSheet, Text, TextInput, View} from 'react-native';
import {connect} from 'react-redux';
import Button from '../../../../../../../components/button';
import Header from '../../../../../../../components/header';
import {BVN_LENGTH} from '../../../../../../../constants/fields';
import {
  COLOUR_BLACK,
  COLOUR_BLUE,
  COLOUR_FORM_CONTROL_BACKGROUND,
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
import FipProgressBar from '../../components/fip-progress-bar';

function FipAgentBvnVerification(props) {
  const {kycId} = props.route.params || {};

  console.log(kycId, 'kkycid');

  console.log(props, 'my props');

  const [state, setState] = React.useState({
    errorMessage: null,
    propagateFormErrors: false,
    description: null,
    message: null,
    isLoading: false,
    user: null,
    isLoadingBvn: false,
    bvnErrorMessage: '',
    isError: false,
    bvn: '',
    kycId: null,
  });

  const handleBackButtonPress = () => {
    props.navigation.goBack();
    return true;
  };

  React.useEffect(() => {
    setState(prev => ({
      ...prev,
      kycId: kycId,
    }));
    checkIncomingRoute();
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonPress,
    );
    return () => backHandler.remove();
  }, []);

  const checkIncomingRoute = () => {
    if (props.navigationState.previousScreen === 'Login') {
      props.navigation.replace('HomeTabs');
      return;
    }
  };

  const onBvnValidation = async () => {
    let res;
    try {
      setState(prevState => ({
        ...prevState,
        isLoadingBvn: true,
        bvnErrorMessage: '',
        isError: false,
      }));

      console.log(state.bvn, 'my bvn');

      if (!state.bvn) {
        setState(prevState => ({
          ...prevState,
          isLoadingBvn: false,
          bvnErrorMessage: 'Please enter your BVN',
          isError: true,
        }));
      } else if (state.bvn.length !== BVN_LENGTH) {
        setState(prevState => ({
          ...prevState,
          isLoadingBvn: false,
          bvnErrorMessage: 'Invalid BVN',
          isError: true,
        }));
      } else {
        const payload = {
          identificationNumber: state.bvn,
          kycId: state.kycId,
        };
        console.log(payload, 'payloadd');
        res = await onboardingService.fipKycValidation('BVN', payload);
        console.log(res, 'resto');

        const {code, response} = res || {};
        const {kycData, description} = response || {};
        const {bvnVerificationResponse, kycId, kycNextStage} = kycData || {};
        const {
          validationStatus,
          bvnData,
          bvnPhoneNumber,
          message,
          tokenId,
          tokenPrefix,
        } = bvnVerificationResponse || {};
        if (validationStatus === 'NOT_VERIFIED') {
          setState(prevState => ({
            ...prevState,
            isError: true,
            isLoadingBvn: false,
            bvnErrorMessage: message
              ? message
              : 'Something went wrong, please try again',
          }));
          return false;
        } else if (
          validationStatus === 'VERIFIED' ||
          kycNextStage === 'BVN_VERIFY_MOBILE'
        ) {
          const bvnInfo = {
            bvn: state.bvn,
            tokenId: tokenId,
            tokenPrefix: tokenPrefix,
            kycId: kycId,
            bvnPhoneNumber: bvnPhoneNumber,
          };
          props.navigation.replace('FipAgentOtpVerification', {
            bvnInfo: bvnInfo,
          });

          return;
        } else {
          setState(prevState => ({
            ...prevState,
            isLoadingBvn: false,
            bvnErrorMessage: description
              ? description
              : 'Something went wrong, please try again',
            isError: true,
          }));
        }
      }
    } catch (err) {
      console.log(err);

      setState(prevState => ({
        ...prevState,
        isLoadingBvn: false,
        bvnErrorMessage: res?.response?.description
          ? res.response?.description
          : 'Something went wrong, please try again',
        isError: true,
      }));
    }
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
      <View style={{width: '94%', alignSelf: 'center'}}>
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
          Enter your BVN
        </Text>
        <Text
          style={{
            color: COLOUR_BLACK,
            fontFamily: FONT_FAMILY_BODY,
            fontSize: FONT_SIZE_MID,
            lineHeight: 20,
            marginTop: 8,
          }}>
          Dial * 565 *0# to securely get your BVN from your network provider.
        </Text>
        <View style={{width: '100%', marginTop: 18}}>
          <Text
            style={{
              color: COLOUR_BLACK,
              fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
              fontSize: FONT_SIZE_TITLE,
              lineHeight: 20,
              marginBottom: 8,
            }}>
            BVN
          </Text>
          <TextInput
            keyboardType="number-pad"
            maxLength={11}
            editable={!state.isLoadingBvn}
            placeholder="Enter BVN"
            onChangeText={bvn => {
              setState(prevState => ({
                ...prevState,
                bvnErrorMessage: '',
                isError: false,
                bvn: bvn,
              }));
            }}
            defaultValue={state.bvn}
            style={[
              styles.inputStyle,
              {
                borderColor: state.bvnErrorMessage
                  ? COLOUR_RED
                  : COLOUR_FORM_CONTROL_BACKGROUND,
                color: state.isError ? COLOUR_RED : undefined,
              },
            ]}
          />
          {state.isError && (
            <View style={styles.errorView}>
              <Icon
                name="info-circle"
                type="font-awesome"
                color="#DC4437"
                size={18}
              />

              <Text style={styles.errorText}>{state.bvnErrorMessage}</Text>
            </View>
          )}
          <View>
            <Button
              onPress={onBvnValidation}
              containerStyle={{
                backgroundColor: COLOUR_BLUE,
                marginBottom: 20,
                marginTop: 40,
              }}
              title="Next"
              buttonStyle={{backgroundColor: COLOUR_BLUE}}
              loading={state.isLoadingBvn}
              disabled={state.isLoadingBvn}
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

export default connect(mapStateToProps)(FipAgentBvnVerification);

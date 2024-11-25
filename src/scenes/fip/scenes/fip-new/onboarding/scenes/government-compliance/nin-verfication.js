import React from 'react';
import {
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {connect} from 'react-redux';
import ActivityIndicator from '../../../../../../../components/activity-indicator';
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
import {saveData} from '../../../../../../../utils/storage';
import FipProgressBar from '../../components/fip-progress-bar';

function FipAgentNinVerification(props) {
  const [form, setForm] = React.useState('');
  const [isError, setIsError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const {kycId} = props.route.params || {};

  console.log(kycId, 'kycid');

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
    checkIncomingRoute();
  }, []);

  const checkIncomingRoute = () => {
    if (props.navigationState.previousScreen === 'Login') {
      props.navigation.replace('HomeTabs');
      return;
    }
  };

  const updateFormField = params => {
    setIsError(false);
    setErrorMessage('');

    const newForm = {
      ...form,
      ...params,
    };

    setForm(newForm);
  };

  const checkNinValidity = async () => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage('');
    let res;

    try {
      const payload = {
        identificationNumber: form.nin,
        kycId: kycId,
      };
      console.log(payload, 'payloaderr');
      if (!form?.nin) {
        setIsError(true);
        setErrorMessage('Please enter your NIN');

        setIsLoading(false);
      } else if (form?.nin.length !== BVN_LENGTH) {
        setIsError(true);
        setErrorMessage('Field must be 11 characters');

        setIsLoading(false);
      } else {
        res = await onboardingService.fipKycValidation('NIN', payload);
        console.log(res, 'resto');
        const {code, response} = res || {};
        const {kycData, description} = response || {};
        const {
          ninVerificationResponse,
          bvnVerificationResponse,
          kycId,
          kycNextStage,
        } = kycData || {};
        const {validationStatus, ninData, message} =
          ninVerificationResponse || {};
        const startingString = 'We were unable to match';

        if (res?.response?.code === '40096') {
          props.navigation.replace('FipAgentFailedVerification', {
            message: res?.response?.description
              ? res.response.description
              : 'Oops! Something went wrong. Please try again later.',
          });
          setIsLoading(false);

          return;
        }

        if (validationStatus === 'NOT_VERIFIED') {
          setIsError(true);

          setErrorMessage(
            message
              ? message
              : res?.response?.description
              ? res.response.description
              : 'Oops! Something went wrong. Please try again later.',
          );
          setIsLoading(false);
        } else if (
          validationStatus === 'VERIFIED' ||
          kycNextStage === 'BVN_VERIFY_MOBILE'
        ) {
          setIsLoading(false);
          setIsError(false);
          await saveData('fipAgentBvnData', ninData);
          props.navigation.replace('FipAgentPersonalInformation', {
            kycId: kycId,
            bvnData: ninData,
          });

          return;
        } else {
          setIsLoading(false);
          setIsError(true);
          setErrorMessage(
            res?.response?.description
              ? res.response.description
              : 'Oops! Something went wrong. Please try again later.',
          );
        }
      }
    } catch (err) {
      console.log(err, 'NIN Val error');
      setIsLoading(false);
      setIsError(true);
      setErrorMessage(
        res?.response?.description
          ? res.response.description
          : 'Oops! Something went wrong. Please try again later.',
      );
    }
  };

  const navigateBack = () => {
    props.navigation.goBack();
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
            onPress={navigateBack}
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
        <FipProgressBar step="4" />
      </View>
      <ScrollView>
        <View style={styles.contentContainer}>
          <Text
            style={{
              color: COLOUR_BLACK,
              fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
              fontSize: 20,
              lineHeight: 24,
              fontWeight: '600',
            }}>
            KYC Information
          </Text>
          <View style={{marginTop: 18}}>
            <Text
              style={{
                color: COLOUR_BLACK,
                fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                fontSize: FONT_SIZE_TITLE,
                lineHeight: 20,
                marginBottom: 8,
              }}>
              NIN
            </Text>
            <TextInput
              keyboardType="number-pad"
              maxLength={11}
              editable={!isLoading}
              placeholder=""
              onChangeText={nin => {
                updateFormField({nin});
              }}
              defaultValue={form?.nin}
              style={[
                styles.inputStyle,
                {
                  borderColor: errorMessage
                    ? COLOUR_RED
                    : COLOUR_FORM_CONTROL_BACKGROUND,
                  color: isError ? COLOUR_RED : undefined,
                },
              ]}
            />

            {isError && (
              <View style={styles.errorView}>
                <Icon
                  name="info-circle"
                  type="font-awesome"
                  color="#DC4437"
                  size={18}
                />

                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            disabled={isLoading}
            style={[styles.button, {opacity: isLoading ? 0.6 : 1}]}
            onPress={checkNinValidity}>
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.buttonText}>CONTINUE</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function mapStateToProps(state) {
  return {
    navigationState: state.tunnel.navigationState,
  };
}

export default connect(mapStateToProps)(FipAgentNinVerification);

const styles = StyleSheet.create({
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
  button: {
    height: 56,
    backgroundColor: '#00425F',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    width: '100%',
  },

  bannerText: {
    color: '#5F738C',
    fontFamily: FONT_FAMILY_BODY,
    fontSize: FONT_SIZE_MID,
    lineHeight: 20,
  },

  buttonText: {
    color: 'white',
    lineHeight: 24,
    fontSize: 16,
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

import React from 'react';
import {
  Alert,
  BackHandler,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {AGENT} from '../../../..//constants';
import ActivityIndicator from '../../../../components/activity-indicator';
import Button from '../../../../components/button';
import Header from '../../../../components/header';
import Modal from '../../../../components/modal';
import {ERROR_STATUS, SUCCESS_STATUS} from '../../../../constants/api';
import {BVN_LENGTH} from '../../../../constants/fields';
import {
  COLOUR_BLACK,
  COLOUR_BLUE,
  COLOUR_FORM_CONTROL_BACKGROUND,
  COLOUR_OFF_WHITE,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_FAMILY_BODY,
  FONT_FAMILY_BODY_SEMIBOLD,
  FONT_SIZE_BIG,
  FONT_SIZE_MID,
  FONT_SIZE_TEXT_INPUT,
  FONT_SIZE_TITLE,
} from '../../../../constants/styles';
import {platformService} from '../../../../setup/api';
import {loadData} from '../../../../utils/storage';
import ProgressBar from '../../../aggregator/components/progress-bar';

export default function AgentNinVerification(props) {
  const [form, setForm] = React.useState('');
  const [isError, setIsError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [verified, setVerified] = React.useState(false);

  const [agentInfo, setAgentInfo] = React.useState({
    agentPhoneNumber: '',
    phoneNumber: '',
    firstName: '',
    dateOfBirth: '',
    lastName: '',
  });
  const ninRef = React.createRef();
  const jobId = props.route?.params?.jobId || null;
  const bvn = props.route?.params?.bvn || null;

  const handleBackButtonPress = () => {
    props.navigation.replace('Agent');
    return true;
  };

  React.useEffect(() => {
    if (jobId) {
      handleStatus(jobId);
    } else {
      setVerified(true);
    }
  }, [jobId]);

  React.useEffect(() => {
    getCurrentAgentData();
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonPress,
    );
    return () => backHandler.remove();
  }, []);

  const showToastWithGravityAndOffset = () => {
    ToastAndroid.showWithGravityAndOffset(
      'Your face ID verification was successful!',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
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
          text: 'OK',
          onPress: () => props.navigation.replace('Agent'),
          style: 'cancel',
        },
      ],

      {cancelable: false},
    );
  };

  const manualBvnVerification = async bvn => {
    const payload = {identificationNumber: bvn};
    const response = await platformService.verifyBvnInformation(bvn);
    if (response.status === SUCCESS_STATUS) {
      showToastWithGravityAndOffset();
      setVerified(true);
      // showAlert("Facial Verification Failed", "");
    } else {
      showAlert('Facial Verification Failed', '');
    }
  };

  const handleStatus = async jobId => {
    while (!verified) {
      const {status, response} = await platformService.getKycRecordStatus(
        jobId,
      );

      if (response.description === 'Failed') {
        showAlert(
          'Facial Verification Failed',
          'Oops! We couldn’t validate your BVN this time, kindly try again later',
        );
        return;
      } else if (
        status === SUCCESS_STATUS &&
        response.description === 'Successful'
      ) {
        setVerified(true);
        showToastWithGravityAndOffset();
        return;
      } else if (
        status === SUCCESS_STATUS &&
        response.description === 'Pending'
      ) {
        showToastPendingStatus();
        await new Promise(resolve => setTimeout(resolve, 10000));
      } else if (status === ERROR_STATUS) {
        showAlert(
          'Facial Verification Failed',
          'Oops! We couldn’t validate your BVN this time, kindly try again later',
        );
      } else {
        return;
      }
    }
  };

  const getCurrentAgentData = async () => {
    const savedAgentData = JSON.parse(await loadData(AGENT));
    console.log(savedAgentData, 'saveagent');
    const {firstname, lastname, phoneNo, dob, gender} =
      savedAgentData.businessContact;
    setAgentInfo({
      agentPhoneNumber: phoneNo,
      phoneNumber: phoneNo,
      firstName: firstname,
      lastName: lastname,
      dateOfBirth: dob,
    });
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
      };

      if (form?.nin.length !== BVN_LENGTH) {
        setIsError(true);
        setErrorMessage('Field must be 11 characters');

        setIsLoading(false);
      } else {
        res = await platformService.verifyNin(payload);
        console.log(res, 'resto');
        const {status, code, response} = res;
        const {message, validationStatus} = response.data;
        if (validationStatus === 'NOT_VERIFIED') {
          setIsError(true);

          setErrorMessage(
            message
              ? message
              : res?.response?.description
              ? res.response.description
              : 'Your NIN does not match with your account details. Kindly Retry',
          );
          setIsLoading(false);
        } else if (validationStatus === 'VERIFIED') {
          setIsLoading(false);
          setIsError(false);
          props.navigation.replace('AgentTinVerification');
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

  const successModal = () => {
    return (
      <Modal
        buttons={[
          {
            onPress: () => {
              setShowSuccessModal(false);
              props.navigation.replace('Agent');
            },
            buttonStyle: {
              paddingHorizontal: 10,
            },
            containerStyle: {
              paddingHorizontal: 10,
              width: '100%',
            },
            title: 'OKAY',
          },
        ]}
        content={
          <View
            style={{
              flex: 0.6,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily: FONT_FAMILY_BODY,
                fontSize: FONT_SIZE_BIG,
                textAlign: 'center',
                marginBottom: 5,
              }}>
              Account Updated
            </Text>
            <Text style={{textAlign: 'center', fontFamily: FONT_FAMILY_BODY}}>
              Your NIN details have been successfully updated and your account
              upgraded
            </Text>
          </View>
        }
        image={require('../../../../assets/media/images/clap.png')}
        isModalVisible={true}
        size="md"
        title="Success"
        withButtons
        hideCloseButton
      />
    );
  };

  const navigateBack = () => {
    const {params} = props.navigation.state;

    if (params?.isFromDashboard) {
      props.navigation.replace('Agent');
    } else {
      props.navigation.navigate('AgentBvnVerification');
    }
  };
  return (
    <View style={styles.mainContainer}>
      {verified ? (
        <>
          <Header
            containerStyle={{
              backgroundColor: COLOUR_BLUE,
            }}
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
          <ProgressBar step="3" />
          <View style={styles.contentContainer}>
            <Text
              style={{
                color: COLOUR_BLACK,
                fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                fontSize: 20,
                lineHeight: 32,
                fontWeight: '700',
              }}>
              Verify Your NIN
            </Text>
            <View style={{marginTop: 15}}>
              <Text
                style={{
                  color: COLOUR_BLACK,
                  fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                  fontSize: FONT_SIZE_TITLE,
                  lineHeight: 20,
                }}>
                National Identity Number (NIN)
              </Text>
              <TextInput
                keyboardType="number-pad"
                maxLength={11}
                editable={!isLoading}
                placeholder="Enter NIN"
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

            {/* {showSuccessModal && successModal()} */}

            <TouchableOpacity
              disabled={isLoading || !form?.nin}
              style={[
                styles.button,
                {opacity: isLoading || !form?.nin ? 0.6 : 1},
              ]}
              onPress={checkNinValidity}>
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.buttonText}>Next</Text>
              )}
            </TouchableOpacity>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 15,
              }}>
              <Button
                onPress={() => props.navigation.navigate('Agent')}
                title="Continue Later"
                buttonStyle={{
                  backgroundColor: COLOUR_OFF_WHITE,
                  borderRadius: 8,
                }}
                containerStyle={{
                  backgroundColor: COLOUR_OFF_WHITE,
                  width: '100%',
                  borderRadius: 8,
                }}
                titleStyle={{
                  color: COLOUR_BLACK,
                  textTransform: 'capitalize',
                }}
              />
            </View>
          </View>
        </>
      ) : (
        <>
          <ActivityIndicator />
        </>
      )}
    </View>
  );
}

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
    marginTop: 20,
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

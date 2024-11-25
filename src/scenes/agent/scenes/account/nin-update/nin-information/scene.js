import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from 'react-native-elements';
import ActivityIndicator from '../../../../../../components/activity-indicator';
import Header from '../../../../../../components/header';
import Modal from '../../../../../../components/modal';
import {AGENT} from '../../../../../../constants';
import {
  COLOUR_BLACK,
  COLOUR_BLUE,
  COLOUR_FORM_CONTROL_BACKGROUND,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_FAMILY_BODY,
  FONT_FAMILY_BODY_SEMIBOLD,
  FONT_SIZE_BIG,
  FONT_SIZE_MID,
  FONT_SIZE_TEXT_INPUT,
  FONT_SIZE_TITLE,
} from '../../../../../../constants/styles';
import {platformService} from '../../../../../../setup/api';
import {loadData} from '../../../../../../utils/storage';

export default function NINInformation(props) {
  const [form, setForm] = React.useState('');
  const [isError, setIsError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const [agentInfo, setAgentInfo] = React.useState({
    agentPhoneNumber: '',
    phoneNumber: '',
    firstName: '',
    dateOfBirth: '',
    lastName: '',
  });
  const ninRef = React.createRef();

  React.useEffect(() => {
    getCurrentAgentData();
  }, []);

  const getCurrentAgentData = async () => {
    const savedAgentData = JSON.parse(await loadData(AGENT));

    const {firstname, lastname, phoneNo, dob} = savedAgentData.businessContact;
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

    try {
      const payload = {
        identificationNumber: form.nin,
        agentPhoneNumber: agentInfo.agentPhoneNumber,
        firstName: agentInfo.firstName,
        lastName: agentInfo.lastName,
        phoneNumber: agentInfo.phoneNumber,
        dateOfBirth: agentInfo.dateOfBirth,
      };

      if (form?.nin.length !== 11) {
        setIsError(true);
        setErrorMessage('Field must be 11 characters');

        setIsLoading(false);
      } else {
        const res = await platformService.verifyNin(payload);
        console.log(res, 'resto');
        const {status, code, response} = res;
        const {message, validationStatus} = response.data;
        if (validationStatus === 'NOT_VERIFIED') {
          setIsError(true);
          setErrorMessage(
            'Your NIN does not match with your account details. Kindly Retry',
          );
          setIsLoading(false);
        } else if (validationStatus === 'VERIFIED') {
          setIsLoading(false);
          setIsError(false);
          setShowSuccessModal(true);
        } else {
          setIsLoading(false);
          setIsError(true);
          setErrorMessage(
            'Oops! Something went wrong. Please try again later.',
          );
        }
      }
    } catch (err) {
      console.log(err, 'NIN Val error');
      setIsLoading(false);
      setIsError(true);
      setErrorMessage('Oops! Something went wrong. Please try again later.');
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
        image={require('../../../../../../assets/media/images/clap.png')}
        isModalVisible={true}
        size="md"
        title="Success"
        withButtons
        hideCloseButton
      />
    );
  };

  const navigateBack = () => {
    const isNinAccountUpdateModalRoute =
      props.route?.params?.isNinAccountUpdate || null;
    if (isNinAccountUpdateModalRoute) {
      props.navigation.goBack();
    } else {
      props.navigation.replace('Agent');
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
            onPress={navigateBack}
          />
        }
        statusBarProps={{
          backgroundColor: 'transparent',
          barStyle: CONTENT_LIGHT,
        }}
        title="Enter ID Information"
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: 'bold',
        }}
      />
      <View style={styles.contentContainer}>
        <View style={{marginTop: 20, marginBottom: 10}}>
          <Text
            style={{
              color: COLOUR_BLACK,
              fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
              fontSize: FONT_SIZE_TITLE,
              lineHeight: 20,
            }}>
            Enter NIN
          </Text>
          <TextInput
            keyboardType="number-pad"
            maxLength={11}
            editable={!isLoading}
            placeholder="39483882811"
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

        <View style={styles.banner}>
          <View style={{marginRight: 5}}>
            <Icon
              name="verified-user"
              type=""
              color="#36743D"
              style={{marginRight: 5}}
            />
          </View>
          <View style={{width: '95%'}}>
            <Text style={styles.bannerText}>
              In line with the latest regulatory requirements from the CBN, we
              will require some information in order to successfully verify your
              account. Your information is secure
            </Text>
          </View>
        </View>

        {showSuccessModal && successModal()}

        <TouchableOpacity
          disabled={isLoading || !form?.nin}
          style={[styles.button, {opacity: isLoading || !form?.nin ? 0.6 : 1}]}
          onPress={() => checkNinValidity()}>
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.buttonText}>Proceed</Text>
          )}
        </TouchableOpacity>
      </View>
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
    paddingVertical: 5,
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
    position: 'absolute',
    bottom: 30,
    width: '100%',
  },
  banner: {
    minHeight: 100,
    width: '100%',
    backgroundColor: '#F9FBFC',
    borderWidth: 1,
    borderColor: '#E1E6ED',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    padding: 8,
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

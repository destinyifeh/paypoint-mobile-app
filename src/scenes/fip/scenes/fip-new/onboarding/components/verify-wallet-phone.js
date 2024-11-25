import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "../../../../../../components/modal";

import { Icon } from "react-native-elements";
import Button from "../../../../../../components/button";
import { ERROR_STATUS } from "../../../../../../constants/api";
import { OTP_LENGTH } from "../../../../../../constants/fields";
import {
  COLOUR_BLACK,
  COLOUR_BLUE,
  COLOUR_FORM_CONTROL_BACKGROUND,
  COLOUR_LINK_BLUE,
  COLOUR_RED,
  FONT_FAMILY_BODY,
  FONT_FAMILY_BODY_SEMIBOLD,
  FONT_SIZE_MID,
  FONT_SIZE_TEXT_INPUT,
  FONT_SIZE_TITLE,
} from "../../../../../../constants/styles";

import { onboardingService } from "../../../../../../setup/api";
import { flashMessage } from "../../../../../../utils/dialog";

export const VerifyWalletPhone = (props) => {
  const [state, setState] = React.useState({
    errorMessage: null,
    isLoading: false,
    isLoadingOtp: false,
    isError: false,
    showOtpModal: false,
    otp: "",
    tokenId: null,
    prefix: null,
    kycId: null,
    phoneNumber: null,
  });

  console.log(props.otpResponse, "oti res");

  React.useEffect(() => {
    const prefix = props.otpResponse.prefix || null;
    const tokenId = props.otpResponse.tokenId || null;
    const kycId = props.kycId || null;
    setState((prev) => ({
      ...prev,
      prefix: prefix,
      tokenId: tokenId,
      kycId: kycId,
      phoneNumber: props?.walletPhone,
    }));
  }, []);

  const onOtpValidation = async () => {
    let validateOtpRes;
    try {
      props.startLoader();
      setState((prevState) => ({
        ...prevState,
        errorMessage: null,
        isError: false,
      }));

      console.log(state.otp, "my otp");

      if (!state.otp) {
        props.stopLoader();
        setState((prevState) => ({
          ...prevState,
          errorMessage: "Please enter your OTP",
          isError: true,
        }));
      } else if (state.otp.length !== OTP_LENGTH) {
        props.stopLoader();
        setState((prevState) => ({
          ...prevState,
          errorMessage: "Invalid OTP",
          isError: true,
        }));
      } else {
        const payload = {
          prefix: state.prefix,
          tokenId: state.tokenId,
        };
        console.log(payload, "my payl");
        validateOtpRes = await onboardingService.validateWalletPhonOtpRequest(
          state.otp,
          payload
        );
        const { status, response } = validateOtpRes;
        console.log(validateOtpRes, "my ress");

        if (status === ERROR_STATUS) {
          props.stopLoader();
          setState((prevState) => ({
            ...prevState,
            isError: true,
            errorMessage: response?.description,
          }));
          return false;
        }

        props.onSubmitApplication();
      }
    } catch (err) {
      console.log(err, "vaidate otp err");
      props.stopLoader();
      setState((prevState) => ({
        ...prevState,
        errorMessage: validateOtpRes?.description
          ? validateOtpRes.description
          : "Something went wrong, please try again",
        isError: true,
      }));
    }
  };

  const onOtpResend = async () => {
    let resendOtpRes;
    try {
      props.startLoader();
      setState((prevState) => ({
        ...prevState,
        errorMessage: null,
        isError: false,
        otp: "",
      }));

      console.log(state.otp, "my otp");

      const payload = {
        phoneNumber: state.phoneNumber,
        jobId: state.kycId,
      };
      console.log(payload, "my paa resend");
      resendOtpRes = await onboardingService.sendWalletPhonOtpRequest(payload);
      const { status, response } = resendOtpRes;
      console.log(resendOtpRes, "my ress");
      if (status === ERROR_STATUS) {
        props.stopLoader();
        setState((prevState) => ({
          ...prevState,
          isError: true,
          errorMessage: response?.description,
        }));
        return false;
      }
      props.stopLoader();
      setState((prevState) => ({
        ...prevState,
        tokenId: response.tokenId,
        prefix: response.prefix,
      }));
      flashMessage(null, "The OTP has been resent successfully");
    } catch (err) {
      console.log(err);
      props.stopLoader();
      setState((prevState) => ({
        ...prevState,
        errorMessage: resendOtpRes?.description
          ? resendOtpRes.description
          : "Something went wrong, please try again",
        isError: true,
      }));
    }
  };

  const maskPhoneNumber = (phoneNumber) => {
    const phoneNumberStr = phoneNumber?.toString();

    return phoneNumberStr?.slice(0, 5) + "****" + phoneNumberStr?.slice(-2);
  };

  return (
    <>
      <Modal
        onRequestClose={() => {
          props.updateShowOtpModal();
        }}
        buttons={
          [
            //   {
            //     onPress: () => {
            //       //onOtpValidation();
            //       //props.updateShowBvnModal();
            //     },
            //     containerStyle: {
            //       width: "100%",
            //       backgroundColor: "#00425F",
            //     },
            //     //title: "Next",
            //     loading: state.isLoadingOtp,
            //   },
          ]
        }
        underline={false}
        content={
          <View
            style={{
              flex: 0.6,
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Text
              style={{
                color: COLOUR_BLACK,
                fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                fontSize: FONT_SIZE_TITLE,
                lineHeight: 20,
                marginTop: 30,
              }}
            >
              Enter OTP
            </Text>
            <Text
              style={{
                color: COLOUR_BLACK,
                fontFamily: FONT_FAMILY_BODY,
                fontSize: FONT_SIZE_MID,
                lineHeight: 20,
                marginTop: 8,
              }}
            >
              An OTP was sent to your wallet phone number {props?.walletPhone}.
              Kindly enter it below
            </Text>
            <View style={{ width: "100%", marginTop: 18 }}>
              <Text
                style={{
                  color: COLOUR_BLACK,
                  fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                  fontSize: FONT_SIZE_MID,
                  lineHeight: 20,
                  marginBottom: 8,
                }}
              >
                OTP
              </Text>
              <TextInput
                keyboardType="number-pad"
                maxLength={6}
                editable={!props.isLoading}
                placeholder=""
                onChangeText={(otp) => {
                  setState((prevState) => ({
                    ...prevState,
                    errorMessage: "",
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
              <TouchableOpacity style={{ marginTop: 5 }} onPress={onOtpResend}>
                <Text style={{ color: COLOUR_LINK_BLUE }}>Resend OTP</Text>
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
                    marginTop: 35,
                  }}
                  title="Next"
                  buttonStyle={{ backgroundColor: COLOUR_BLUE }}
                  loading={props.isLoading}
                  disabled={props.isLoading}
                />
              </View>
            </View>
          </View>
        }
        isModalVisible={props.showOtpModal}
        size="md"
        withButtons
        hideCloseButton={props.isLoading}
      />
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    width: "90%",
    alignSelf: "center",
    flex: 1,
    paddingVertical: 15,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  inputStyle: {
    fontFamily: FONT_FAMILY_BODY,
    fontSize: FONT_SIZE_TEXT_INPUT,
    width: "100%",
    backgroundColor: COLOUR_FORM_CONTROL_BACKGROUND,

    borderWidth: 1.5,
    borderRadius: 8,
    flexDirection: "row",
    height: 50,
    padding: 0,
    paddingLeft: 15,
  },

  errorText: {
    color: "#DC4437",
    fontFamily: FONT_FAMILY_BODY,
    fontSize: FONT_SIZE_MID,
    lineHeight: 20,
    left: 3,
  },
  errorView: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "98%",
    alignSelf: "center",
  },
  inputError: {
    color: "#DC4437",
  },
});

import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import Button from "../components/button";
import Hyperlink from "../components/hyperlink";
import Text from "../components/text";
import {
  COLOUR_BLUE,
  COLOUR_FORM_CONTROL_BACKGROUND,
  COLOUR_GREY,
  FONT_FAMILY_BODY,
  FONT_SIZE_TEXT_INPUT,
} from "../constants/styles";
import { OtpForm } from "../scenes/agent/cbn-requirements/form/otp-form";

const CbnOtpPrompt = (props) => {
  return (
    <View>
      <RBSheet
        ref={props.inputOtpRef}
        animationType="fade"
        closeOnDragDown={true}
        duration={250}
        height={362}
        customStyles={{
          container: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          },
        }}
      >
        <View style={{ flexDirection: "column" }}>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              //   alignItems: "center",
              //   justifyContent: "center",
            }}
          >
            <Text big black>
              Enter OTP{" "}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 20,
            // alignItems: "center",
            // justifyContent: "center",
            paddingTop: 30,
          }}
        >
          <Text>
            An OTP was sent to your BVN Phone number. Kindly enter it below.
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            paddingTop: 30,
            paddingHorizontal: 20,
            justifyContent: "space-between",
            paddingEnd: 20,
            marginEnd: 35,
          }}
        >
          <TextInput
            defaultValue={props.defaultValue}
            editable={false}
            style={styles.inputStyle}
          />
          <View
            style={{
              width: "5%",
              height: 2,
              backgroundColor: COLOUR_FORM_CONTROL_BACKGROUND,
              marginHorizontal: 3,
              flexDirection: "column",
              alignContent: "center",
              justifyContent: "center",
              marginTop: 20,
            }}
          />

          <OtpForm otp={props.otp} setOtp={props.setOtp} />
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          <Hyperlink onPress={props.resendOtp}>
            {props.isSendingOtp ? "Loading..." : "Resend OTP"}
          </Hyperlink>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 30,
            paddingHorizontal: 20,
          }}
        >
          <Button
            disabled={props.loading}
            onPress={props.otpOk}
            title="SUBMIT"
            buttonStyle={{ backgroundColor: COLOUR_BLUE }}
            containerStyle={{
              backgroundColor: COLOUR_BLUE,
              width: "100%",
            }}
          />
        </View>
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    fontFamily: FONT_FAMILY_BODY,
    fontSize: FONT_SIZE_TEXT_INPUT,
    width: "20%",
    backgroundColor: COLOUR_FORM_CONTROL_BACKGROUND,
    borderWidth: 2,
    borderRadius: 8,
    flexDirection: "row",
    height: 50,
    padding: 0,
    paddingLeft: 15,
    borderColor: COLOUR_FORM_CONTROL_BACKGROUND,
    color: COLOUR_GREY,
  },
});

export default CbnOtpPrompt;

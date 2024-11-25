import React from "react";
import { StyleSheet, View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import Button from "../components/button";
import Text from "../components/text";
import {
  COLOUR_BLACK,
  COLOUR_BLUE,
  COLOUR_FORM_CONTROL_BACKGROUND,
  COLOUR_GREY,
  FONT_FAMILY_BODY,
  FONT_FAMILY_BODY_BOLD,
  FONT_SIZE_TEXT_INPUT,
} from "../constants/styles";
import { PaymentForm } from "../scenes/agent/scenes/cac-registration/forms/payment-amount-form";

const CacRegPaymentPrompt = (props) => {
  return (
    <View>
      <RBSheet
        ref={props.paymentModalRef}
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
              paddingBottom: 20,
              //   alignItems: "center",
              //   justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: COLOUR_BLACK,
                fontSize: 20,
                fontFamily: FONT_FAMILY_BODY_BOLD,
              }}
            >
              Payment Details
            </Text>
          </View>
        </View>
        <PaymentForm />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 20,
            paddingBottom: 10,
          }}
        >
          <Button
            disabled={false}
            onPress={props.otpOk}
            title="Proceed"
            buttonStyle={{ backgroundColor: COLOUR_BLUE }}
            containerStyle={{
              backgroundColor: COLOUR_BLUE,
              width: "100%",
            }}
            loading={props.loading}
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

export default CacRegPaymentPrompt;

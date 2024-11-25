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
  COLOUR_OFF_WHITE,
  FONT_FAMILY_BODY,
  FONT_FAMILY_BODY_BOLD,
  FONT_SIZE_TEXT_INPUT,
} from "../constants/styles";

const PaymentTypePrompt = (props) => {
  return (
    <View>
      <RBSheet
        ref={props.paymentTypeModalRef}
        animationType="fade"
        closeOnDragDown={true}
        duration={250}
        height={276}
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
                fontSize: 15,
                fontFamily: FONT_FAMILY_BODY_BOLD,
              }}
            >
              Select Payment Type
            </Text>
          </View>
        </View>

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
            onPress={props.card}
            title={"Fund via Card"}
            buttonStyle={{
              backgroundColor: COLOUR_OFF_WHITE,
              borderRadius: 4,
              borderRadiusColor: COLOUR_BLUE,
            }}
            containerStyle={{
              backgroundColor: COLOUR_OFF_WHITE,
              width: "100%",
              borderRadius: 4,
              borderRadiusColor: COLOUR_BLUE,
            }}
            titleStyle={{
              color: COLOUR_BLUE,
              textTransform: "capitalize",
            }}
          />
        </View>

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
            onPress={props.transfer}
            title={"Fund via Transfer"}
            buttonStyle={{
              backgroundColor: COLOUR_OFF_WHITE,
              borderRadius: 4,
              borderRadiusColor: COLOUR_BLUE,
            }}
            containerStyle={{
              backgroundColor: COLOUR_OFF_WHITE,
              width: "100%",
              borderRadius: 4,
              borderRadiusColor: COLOUR_BLUE,
            }}
            titleStyle={{
              color: COLOUR_BLUE,
              textTransform: "capitalize",
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

export default PaymentTypePrompt;

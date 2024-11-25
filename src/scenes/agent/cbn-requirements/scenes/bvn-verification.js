import React from "react";
import { Icon } from "react-native-elements";

import { BackHandler, StyleSheet, Text, TextInput, View } from "react-native";
import Button from "../../../../components/button";
import Header from "../../../../components/header";
import { BVN_LENGTH } from "../../../../constants/fields";
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
  FONT_SIZE_MID,
  FONT_SIZE_TEXT_INPUT,
  FONT_SIZE_TITLE,
} from "../../../../constants/styles";
import ProgressBar from "../../../aggregator/components/progress-bar";

function AgentBvnVerification(props) {
  const [state, setState] = React.useState({
    errorMessage: null,
    propagateFormErrors: false,
    description: null,
    message: null,
    isLoading: false,
    user: null,
    isLoadingBvn: false,
    bvnErrorMessage: "",
    isError: false,
    bvn: "",
  });

  const handleBackButtonPress = () => {
    props.navigation.replace("Agent");
    return true;
  };

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButtonPress
    );
    return () => backHandler.remove();
  }, []);

  const onBvnValidation = async () => {
    try {
      setState((prevState) => ({
        ...prevState,
        isLoadingBvn: true,
        bvnErrorMessage: "",
        isError: false,
      }));

      console.log(state.bvn, "my bvn");

      if (!state.bvn) {
        setState((prevState) => ({
          ...prevState,
          isLoadingBvn: false,
          bvnErrorMessage: "Please enter your BVN",
          isError: true,
        }));
      } else if (state.bvn.length !== BVN_LENGTH) {
        setState((prevState) => ({
          ...prevState,
          isLoadingBvn: false,
          bvnErrorMessage: "Invalid BVN",
          isError: true,
        }));
      } else {
        const bvnData = {
          bvn: state.bvn,
        };
        console.log(bvnData, "data bvn");
        setTimeout(() => {
          setState((prevState) => ({
            ...prevState,
            isLoadingBvn: false,
          }));
          props.navigation.navigate("AgentFacialVerification", {
            bvnInfo: bvnData,
          });

          setState((prevState) => ({
            ...prevState,

            bvn: "",
          }));
        }, 5000);
      }
    } catch (err) {
      console.log(err);

      setState((prevState) => ({
        ...prevState,
        isLoadingBvn: false,
        bvnErrorMessage: "Something went wrong, please try again",
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
        statusBarProps={{
          backgroundColor: "transparent",
          barStyle: CONTENT_LIGHT,
        }}
        title=""
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: "bold",
        }}
      />
      <ProgressBar step="1" />

      <View style={styles.contentContainer}>
        <Text
          style={{
            color: COLOUR_BLACK,
            fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
            fontSize: FONT_SIZE_TITLE,
            lineHeight: 20,
            marginTop: 10,
          }}
        >
          Enter Your BVN
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
          Dial * 565 *0# to securely get your BVN from your network provider.
        </Text>
        <View style={{ width: "100%", marginTop: 30 }}>
          <Text
            style={{
              color: COLOUR_BLACK,
              fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
              fontSize: FONT_SIZE_MID,
              lineHeight: 20,
            }}
          >
            BVN
          </Text>
          <TextInput
            keyboardType="number-pad"
            maxLength={11}
            editable={!state.isLoadingBvn}
            placeholder="Enter BVN"
            onChangeText={(bvn) => {
              setState((prevState) => ({
                ...prevState,
                bvnErrorMessage: "",
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
                marginTop: 35,
              }}
              title="Next"
              buttonStyle={{ backgroundColor: COLOUR_BLUE }}
              loading={state.isLoadingBvn}
              disabled={state.isLoadingBvn}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 15,
            }}
          >
            <Button
              onPress={() => props.navigation.navigate("Agent")}
              title="Continue Later"
              buttonStyle={{
                backgroundColor: COLOUR_OFF_WHITE,
                borderRadius: 8,
              }}
              containerStyle={{
                backgroundColor: COLOUR_OFF_WHITE,
                width: "100%",
                borderRadius: 8,
              }}
              titleStyle={{
                color: COLOUR_BLACK,
                textTransform: "capitalize",
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

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

export default AgentBvnVerification;

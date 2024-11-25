import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";

import {
  FONT_FAMILY_BODY,
  FONT_FAMILY_BODY_BOLD,
  FONT_SIZE_MID,
} from "../constants/styles";
const deviceHeight = Dimensions.get("window").height;
export default function NINRestrictedAccount({
  ref_,
  requestClose,
  navigation,
}) {
  return (
    <RBSheet
      animationType="fade"
      closeOnDragDown={false}
      closeOnPressMask={false}
      closeOnPressBack={false}
      duration={250}
      height={deviceHeight * 0.42}
      //onClose={this.onCancelConfirmation}
      ref={ref_}
      customStyles={{
        container: {
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          backgroundColor: "#F3F3F4",
        },
      }}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.clearContainer}
          disabled={true}
          // onPress={requestClose}
        >
          {/* <Icon type="" name="clear" size={20} color="grey" /> */}
        </TouchableOpacity>
        <View style={{ width: "85%", alignSelf: "center" }}>
          <Text style={styles.mainText}>Account Update</Text>

          <Text style={styles.descText}>
            Your account has been restricted according to CBN requirement.
            Kindly update your info to continue at your current account class or
            downgrade to access lower limits.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate("NinIdInformation"), requestClose();
          }}
        >
          <Text style={styles.buttonText}>Update my account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button2]}
          onPress={() => {
            navigation.navigate("NinAccountDowngrade"), requestClose();
          }}
        >
          <Text style={[styles.buttonText, { color: "#353F50" }]}>
            Downgrade account
          </Text>
        </TouchableOpacity>
      </View>
    </RBSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignSelf: "center",
    paddingVertical: 10,
  },
  descText: {
    color: "#5F738C",
    fontFamily: FONT_FAMILY_BODY,
    fontSize: FONT_SIZE_MID,
    lineHeight: 20,
    textAlign: "center",
  },
  mainText: {
    color: "#353F50",
    fontFamily: FONT_FAMILY_BODY_BOLD,
    fontSize: 20,
    lineHeight: 32,
    textAlign: "center",
  },
  button: {
    height: 56,
    backgroundColor: "#00425F",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },

  button2: {
    height: 56,
    backgroundColor: "white",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#E1E6ED",
  },
  buttonText: {
    color: "white",
    lineHeight: 24,
    fontSize: 16,
  },
  clearContainer: {
    backgroundColor: "#F3F5F6",

    width: 24,
    height: 24,
    alignSelf: "flex-end",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});

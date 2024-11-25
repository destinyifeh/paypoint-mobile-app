import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  FONT_FAMILY_BODY,
  FONT_FAMILY_BODY_SEMIBOLD,
  FONT_SIZE_MID,
} from "../constants/styles";

export const NINAccountUpdateBanner = ({ navigation }) => {
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.titleText}>Enter Your NIN</Text>
      <Text style={styles.descText}>
        Your account will be restricted if you do not update your info by march
        1st
      </Text>

      <TouchableOpacity
        style={styles.updateTextContainer}
        onPress={() =>
          navigation.navigate("NinIdInformation", {
            isNinAccountUpdate: true,
          })
        }
      >
        <Text style={styles.updateText}>Update Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#EBF8FE",
    width: "90%",
    // height: 100,
    padding: 10,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "#A8D6EF",
    alignSelf: "center",
  },
  updateText: {
    color: "#0275D8",
    fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
    fontSize: FONT_SIZE_MID,
    lineHeight: 20,
  },
  descText: {
    color: "#5F738C",
    fontFamily: FONT_FAMILY_BODY,
    fontSize: 12,
    lineHeight: 16,
  },

  titleText: {
    color: "#353F50",
    fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
    fontSize: FONT_SIZE_MID,
    lineHeight: 20,
  },
  updateTextContainer: {
    marginTop: 5,
  },
});

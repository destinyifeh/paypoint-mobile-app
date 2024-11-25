import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";
import {
  COLOUR_BLACK,
  FONT_FAMILY_BODY,
  FONT_FAMILY_BODY_SEMIBOLD,
} from "../../../../../../../../constants/styles";

export const PersonalDetailsInfo = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  return (
    <View style={styles.main}>
      <View
        onPress={() => setIsVisible(!isVisible)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text
            style={[
              styles.titleText,
              { fontFamily: FONT_FAMILY_BODY_SEMIBOLD },
            ]}
          >
            Personal Details
          </Text>
          <Text style={[styles.descText, { color: "#353F50" }]}>
            Tell us who owns this business
          </Text>
        </View>
        <View>
          <TouchableOpacity style={{ bottom: 10 }}>
            <Icon
              color={COLOUR_BLACK}
              underlayColor="transparent"
              name={isVisible ? "expand-less" : "expand-more"}
              size={25}
              type="material"
              onPress={() => setIsVisible(!isVisible)}
            />
          </TouchableOpacity>
          {isVisible && (
            <TouchableOpacity style={{ bottom: 5 }}>
              <Text style={styles.ediText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {isVisible && (
        <View style={{ marginTop: 5 }}>
          <View>
            <Text style={styles.titleText}>Phone</Text>
            <Text style={styles.descText}>Tell us who owns this business</Text>
          </View>
          <View>
            <Text style={styles.titleText}>Personal Details</Text>
            <Text style={styles.descText}>Tell us who owns this business</Text>
          </View>
          <View>
            <Text style={styles.titleText}>Personal Details</Text>
            <Text style={styles.descText}>Tell us who owns this business</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    borderWidth: 1,
    borderColor: "#E1E6ED",
    borderRadius: 8,
    padding: 16,
  },
  titleText: {
    color: "#1F2126",
    fontSize: 16,
    fontFamily: FONT_FAMILY_BODY,
    fontWeight: "600",
    lineHeight: 20,
  },
  descText: {
    color: "#9CA3AF",
    fontSize: 14,
    fontFamily: FONT_FAMILY_BODY,
    fontWeight: "600",
    lineHeight: 20,
  },
  ediText: {
    color: "#00425F",
    fontSize: 16,
    fontFamily: FONT_FAMILY_BODY,
    fontWeight: "600",
    lineHeight: 20,
  },
});

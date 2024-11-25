import moment from "moment";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";
import {
  COLOUR_BLACK,
  COLOUR_BLUE,
  COLOUR_GREY,
  COLOUR_LIGHT_GREY,
  COLOUR_OFF_WHITE,
  FONT_FAMILY_BODY,
  FONT_FAMILY_BODY_SEMIBOLD,
  FONT_SIZE_MID,
} from "../../../../../../../constants/styles";
export default function IssueLists({ item, navigateTo }) {
  const isActive = item?.status === "Active";

  return (
    <TouchableOpacity
      style={styles.mainContainer}
      onPress={() => navigateTo("IssueDetails", item)}
    >
      <View>
        <Text style={styles.itemText} numberOfLines={1} ellipsizeMode="tail">
          {item?.ticketNumber}
        </Text>
        <Text style={styles.itemDate}>
          {moment(item?.dateCreated).format("YYYY-MM-DD | HH:mm:ss")}{" "}
        </Text>
      </View>

      <View
        style={[
          styles.statusContainer,
          {
            borderColor: isActive ? "#A8D6EF" : "#E1E6ED",

            backgroundColor: isActive ? "#EBF8FE" : COLOUR_OFF_WHITE,
          },
        ]}
      >
        <Icon
          color={isActive ? COLOUR_BLUE : COLOUR_GREY}
          type="entypo"
          name="dot-single"
        />
        <Text
          style={[
            styles.statusText,
            { color: isActive ? COLOUR_BLUE : COLOUR_GREY },
          ]}
        >
          {item?.status}
        </Text>
      </View>
      <Icon
        underlayColor="transparent"
        color={"#5F738C"}
        name="chevron-right"
        type="material"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    alignItems: "center",
    padding: 14,
    borderWidth: 1,
    borderColor: COLOUR_LIGHT_GREY,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 2,
  },

  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 3,
    borderRadius: 8,
  },
  statusText: {
    fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
    fontSize: FONT_SIZE_MID,
    maxWidth: 100,
    paddingRight: 5,
  },

  itemText: {
    fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
    color: COLOUR_BLACK,
    maxWidth: 160,
  },
  itemDate: {
    fontFamily: FONT_FAMILY_BODY,
    color: COLOUR_BLACK,
  },
});

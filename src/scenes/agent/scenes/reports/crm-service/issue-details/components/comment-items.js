import moment from "moment";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import ActivityIndicator from "../../../../../../../components/activity-indicator";
import {
  COLOUR_BLACK,
  COLOUR_BLUE,
  COLOUR_LIGHT_GREY,
  FONT_FAMILY_BODY,
  FONT_FAMILY_BODY_SEMIBOLD,
  FONT_SIZE_BIG,
  FONT_SIZE_MID,
} from "../../../../../../../constants/styles";
export default function ComplaintCommentItems({ transaction, refreshComment }) {
  return (
    <View style={style.mainContainer}>
      <Text style={style.headerTitle}>Comments</Text>
      {refreshComment ? (
        <View style={{}}>
          <ActivityIndicator />
        </View>
      ) : (
        <>
          {transaction?.comments
            ?.filter((value) => value.comment !== null)
            .map((value, idx) => {
              return (
                <View style={style.itemContainer} key={idx}>
                  <View style={style.itemInnerContainer}>
                    <Text style={style.authorText}>{value?.author}:</Text>
                    <Text style={style.commentDateText}>
                      {moment(value?.dateCreated).format(
                        "DD MMM, YYYY | h:mma"
                      )}
                    </Text>
                  </View>
                  <Text style={style.commentDescriptionText}>
                    {value?.comment?.replace(/"/g, "")}
                  </Text>
                </View>
              );
            })}
          {transaction?.comments &&
            !transaction.comments.some((value) => value.comment !== null) && (
              <Text style={style.commentDescriptionText}>
                No comment available yet
              </Text>
            )}
        </>
      )}
    </View>
  );
}

const style = StyleSheet.create({
  mainContainer: { marginTop: 20, marginBottom: 10 },
  headerTitle: {
    marginVertical: 15,
    color: COLOUR_BLACK,
    fontSize: FONT_SIZE_BIG,
    fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
  },
  itemContainer: {
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderColor: COLOUR_LIGHT_GREY,
    padding: 10,
    marginBottom: 5,
  },

  itemInnerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  authorText: {
    fontFamily: FONT_FAMILY_BODY,
    fontSize: FONT_SIZE_MID,
    color: COLOUR_BLACK,
  },
  commentDateText: {
    fontFamily: FONT_FAMILY_BODY,
    fontSize: FONT_SIZE_MID,
    color: COLOUR_BLUE,
  },
  commentDescriptionText: {
    fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
    fontSize: FONT_SIZE_MID,
    color: COLOUR_BLACK,
  },
});

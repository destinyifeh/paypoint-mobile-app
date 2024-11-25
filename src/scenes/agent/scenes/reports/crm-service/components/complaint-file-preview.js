import React from "react";

import { Image, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";
import { COLOUR_GREY } from "../../../../../../constants/styles";
export default function ComplaintFilePreviewer({
  attachment,
  onRemoveFile,
  documentType,
}) {
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
          }}
        >
          {documentType === "photo" ? (
            <Image
              source={{ uri: attachment && attachment.uri }}
              style={{ height: 75, width: 75 }}
              resizeMode="cover"
            />
          ) : (
            <Icon
              color={COLOUR_GREY}
              name="file-text"
              size={75}
              type="feather"
            />
          )}
          <Text style={{ left: 8, marginTop: 27, color: COLOUR_GREY }}>
            {documentType && documentType}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onRemoveFile}
          style={{
            marginTop: 27,
          }}
        >
          <Icon iconStyle={{}} name="cancel" type="material" />
        </TouchableOpacity>
      </View>
    </>
  );
}

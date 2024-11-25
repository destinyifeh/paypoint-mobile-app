import React from "react";

import { Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";
import ProgressiveImage from "../../../../../../components/progressive-image";
import { COLOUR_GREY } from "../../../../../../constants/styles";
export default function FipAgentFilePreview({
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
          {documentType === "jpg" ||
          documentType === "png" ||
          documentType === "jpeg" ||
          documentType === "photo" ? (
            // <Image
            //   source={{
            //     uri: `${attachment.uri}?lastModified=${
            //       attachment.lastModified
            //     }`,
            //   }}
            //   style={{ height: 75, width: 75 }}
            //   resizeMode="cover"
            // />
            <ProgressiveImage
              key={attachment.uri}
              thumbnailSource={{ uri: attachment.uri }}
              source={{
                uri: `${attachment.uri}?lastModified=${
                  attachment.lastModified
                }`,
              }}
              style={{
                height: 75,
                width: 75,
                borderRadius: 5,
              }}
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
            {documentType === "jpg" ||
            documentType === "png" ||
            documentType === "jpeg" ||
            documentType === "photo"
              ? "photo"
              : "pdf"}
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

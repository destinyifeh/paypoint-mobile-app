import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";
import fileUploadIcon from "../../../../../../assets/media/icons/file-upload-icon.png";
import {
  COLOUR_BLACK,
  COLOUR_RED,
  FONT_FAMILY_BODY,
  FONT_FAMILY_BODY_SEMIBOLD,
  FONT_SIZE_MID,
  FONT_SIZE_TITLE,
} from "../../../../../../constants/styles";
import FipAgentFilePreview from "./file-preview";

export const FipAgentFileUploader = ({
  title,
  loadingFile,
  onPress,
  didUploadFail,
  attachment,
  documentType,
  onRemoveFile,
  propagateError,
  loadingFileMessage,
  disabled,
}) => {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.title}>{title}</Text>

      {!loadingFile ? (
        <>
          {attachment ? (
            <FipAgentFilePreview
              attachment={attachment}
              onRemoveFile={onRemoveFile}
              documentType={documentType}
            />
          ) : (
            <>
              <TouchableOpacity
                disabled={disabled}
                style={[
                  styles.uploadContainer,
                  {
                    borderColor:
                      didUploadFail || propagateError ? "#DC4437" : "#E1E6ED",
                  },
                ]}
                onPress={onPress}
              >
                <Image source={fileUploadIcon} />
                <View style={{ marginTop: 5 }}>
                  <Text style={styles.titleText}>
                    {title === "Image of Business Location"
                      ? "Tap here to upload or take your picture"
                      : "Tap here to upload your picture"}
                  </Text>
                  <Text style={styles.fileTypeText}>
                    JPG or PNG. File size, no more than 5MB
                  </Text>
                </View>
              </TouchableOpacity>

              {didUploadFail && (
                <View style={styles.errorView}>
                  <Icon
                    name="info-circle"
                    type="font-awesome"
                    color="#DC4437"
                    size={18}
                  />

                  <Text style={styles.errorText}>Upload failed, try again</Text>
                </View>
              )}
            </>
          )}
        </>
      ) : (
        <Text
          style={{
            marginTop: 27,
            textAlign: "center",
            fontFamily: FONT_FAMILY_BODY,
          }}
        >
          {loadingFileMessage}
        </Text>
      )}
      {!loadingFile && propagateError && (
        <View style={styles.requiredContainer}>
          <Icon name="error" type="material" size={20} color={COLOUR_RED} />
          <Text style={{ color: COLOUR_BLACK }}> Field is required</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    color: COLOUR_BLACK,
    fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
    fontSize: FONT_SIZE_TITLE,
    marginBottom: 8,
  },
  fileTypeText: {
    color: "#353F50",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
    fontFamily: FONT_FAMILY_BODY,
    width: 230,
    alignSelf: "center",
  },
  titleText: {
    color: "#353F50",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    fontFamily: FONT_FAMILY_BODY,
    width: 253,
    alignSelf: "center",
    textAlign: "center",
  },
  uploadContainer: {
    width: "100%",
    height: 122,
    backgroundColor: "#F3F5F6",
    borderWidth: 1,
    borderColor: "#E1E6ED",
    borderRadius: 4,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
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
  requiredContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
});

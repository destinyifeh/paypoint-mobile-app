import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";
import {
  COLOUR_BLACK,
  COLOUR_FORM_CONTROL_BACKGROUND,
  COLOUR_GREY,
  COLOUR_LIGHT_GREY,
  COLOUR_LINK_BLUE,
  COLOUR_RED,
  FONT_FAMILY_BODY,
  FONT_FAMILY_BODY_SEMIBOLD,
  FONT_SIZE_TITLE,
} from "../../../../../../constants/styles";
import ComplaintFilePreviewer from "./complaint-file-preview";

export default function ComplaintFileUploader({
  addFile,
  attachment,
  onRemoveFile,
  documentType,
  optional,
  required,
  loadingFile,
}) {
  return (
    <>
      <View style={styles.mainContainer}>
        <View style={styles.innerContainer}>
          <Text style={styles.titleText}>Add Attachment</Text>
          <Text style={styles.optionalText}>
            {optional ? "(Optional)" : null}
          </Text>
        </View>
        {!loadingFile ? (
          <>
            {attachment && attachment !== "" ? (
              <ComplaintFilePreviewer
                attachment={attachment}
                onRemoveFile={onRemoveFile}
                documentType={documentType}
              />
            ) : (
              <TouchableOpacity
                onPress={addFile}
                style={[
                  styles.fileContainer,
                  { borderColor: required && "red" },
                ]}
              >
                <View style={styles.fileContainerInnerView}>
                  <Text style={styles.uploadFileText}>
                    Upload file (image or document)
                  </Text>
                  <Text style={styles.fileTypeText}>
                    PNG, JPEG, JPG, DOCX, PDF, up to 3MB
                  </Text>
                </View>
              </TouchableOpacity>
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
            Loading file...
          </Text>
        )}
        {required && (
          <View style={styles.requiredContainer}>
            <Icon name="error" type="material" size={20} color={COLOUR_RED} />
            <Text style={{ color: COLOUR_BLACK }}> Field is required</Text>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    marginVertical: 20,
  },
  innerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginVertical: 4,
  },
  titleText: {
    color: COLOUR_BLACK,
    fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
    fontSize: FONT_SIZE_TITLE,
  },
  fileContainer: {
    minHeight: 100,
    paddingVertical: 16,
    backgroundColor: COLOUR_FORM_CONTROL_BACKGROUND,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLOUR_LIGHT_GREY,
  },
  fileContainerInnerView: {
    alignItems: "center",
    marginVertical: 10,
  },
  uploadFileText: {
    color: COLOUR_LINK_BLUE,
    textAlign: "center",
    fontFamily: FONT_FAMILY_BODY,
  },
  fileTypeText: {
    color: COLOUR_GREY,
    fontFamily: FONT_FAMILY_BODY,
    fontSize: 16,
    marginTop: 10,
  },
  requiredContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  optionalText: {
    color: COLOUR_BLACK,
    fontSize: FONT_SIZE_TITLE,
    fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
  },
});

import React from "react";

import { Alert, StyleSheet, Text, View } from "react-native";

import { ScrollView, TouchableOpacity } from "react-native";
import DocumentPicker from "react-native-document-picker";
import { Icon } from "react-native-elements";
import RBSheet from "react-native-raw-bottom-sheet";
import Button from "../../../../../../../components/button";
import FormInput from "../../../../../../../components/form-controls/form-input";
import { BLOCKER } from "../../../../../../../constants/dialog-priorities";
import {
  COLOUR_BLACK,
  COLOUR_BLUE,
  COLOUR_OFF_WHITE,
  FONT_FAMILY_BODY,
  FONT_FAMILY_BODY_SEMIBOLD,
  FONT_SIZE_TITLE,
} from "../../../../../../../constants/styles";
import { crmService } from "../../../../../../../setup/api";
import { flashMessage } from "../../../../../../../utils/dialog";
import ComplaintFileUploader from "../../components/complaint-upload";
export default function ReopenIssueForm({
  sheetRef,
  getComment,
  ticketNumber,
  getReopenSuccessModal,
}) {
  const [form, setForm] = React.useState("");
  const [attachment, setAttachment] = React.useState("");
  const [documentType, setDocumentType] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingFile, setLoadingFile] = React.useState(false);
  function updateFormField(params) {
    const newForm = {
      ...form,
      ...params,
    };
    setForm(newForm);
  }

  async function pickDocument() {
    setLoadingFile(true);
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log(result, "riri");
      console.log(
        result.uri,
        result.type, // mime type
        result.name,
        result.size
      );
      const THREE_MB = 3145728;

      if (result.size > THREE_MB) {
        Alert.alert(null, "File is more than 3MB, try again");
        setLoadingFile(false);
        return false;
      }
      if (
        result.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        result.type === "application/msword"
      ) {
        setDocumentType("doc");
        setAttachment(result);
        setLoadingFile(false);
      } else if (result.type === "application/pdf") {
        setDocumentType("pdf");
        setAttachment(result);
        setLoadingFile(false);
      } else if (
        result.type === "image/png" ||
        result.type === "image/jpg" ||
        result.type === "image/jpeg"
      ) {
        setDocumentType("photo");
        setAttachment(result);
        setLoadingFile(false);
      } else {
        Alert.alert(null, "Unsupported file format, try again.");
        setLoadingFile(false);
        return;
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        setLoadingFile(false);
        return false;
      } else {
        setLoadingFile(false);

        console.error(err);
      }
    }
  }

  function onRemoveFile() {
    setAttachment("");
    setLoadingFile(false);
  }

  async function onReopenIssue() {
    setIsLoading(true);
    const { comment } = form;
    const attachedDoc = {
      ...attachment,
      filename: attachment.name,
    };

    const payload = {
      file: attachedDoc,
      description: comment,
      documentType: attachment.type,
    };
    try {
      const { status, response } = await crmService.onReopenIssue(
        ticketNumber,
        payload
      );
      const { code, description } = response;
      if (code === "00" && description === "Ticket reactivated successfully") {
        setAttachment(""), setForm("");
        setIsLoading(false);
        sheetRef?.current?.close();
        getReopenSuccessModal();
      } else {
        flashMessage(
          null,
          "Oops! We encountered a problem while reopening ticket. Please try again",
          BLOCKER
        );
        setIsLoading(false);

        return false;
      }
    } catch (err) {
      setIsLoading(false);
      flashMessage(
        null,
        "Oops! We encountered a problem while submitting your comment. Please try again",
        BLOCKER
      );
    }
  }

  const maxLength = 75;
  const commentLength = form?.comment?.length;
  const progressRatio = `${
    commentLength === undefined ? 0 : commentLength
  }/${maxLength}`;

  return (
    <RBSheet
      ref={sheetRef}
      animationType="fade"
      closeOnDragDown={false}
      duration={300}
      height={500}
      customStyles={{
        container: {
          borderRadius: 10,
        },
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          marginTop: 35,
          flex: 1,
          marginBottom: 10,
          width: "88%",
          alignSelf: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                color: COLOUR_BLACK,
                fontSize: FONT_SIZE_TITLE,
              }}
            >
              {" "}
              Reopen Ticket
            </Text>
            <Text
              style={{
                fontFamily: FONT_FAMILY_BODY,
                color: COLOUR_BLACK,
                marginVertical: 5,
                marginLeft: 5,
              }}
            >
              Add a comment and/or attachment to reopen ticket
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => sheetRef.current?.close()}
            style={{
              backgroundColor: COLOUR_OFF_WHITE,
              height: 18,
              borderRadius: 5,
              padding: 2,
            }}
          >
            <Icon
              name="close"
              iconStyle={{ fontWeight: "bold", textAlign: "center" }}
              size={16}
              type="material"
              color={COLOUR_BLACK}
            />
          </TouchableOpacity>
        </View>

        <FormInput
          autoCapitalize="none"
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(comment) => {
            updateFormField({ comment });
          }}
          //defaultValue={this.state.form?.identificationNumber}
          multiline={true}
          maxLength={75}
          showMultiline={true}
          textAlignVertical="top"
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="Add Comments"
          text="Comments"
          textInputRef={(input) => (this.comment = input)}
          rightText={progressRatio}
          rightTextExist={true}
          validators={{
            required: true,
          }}
          textInputWidth="95%"
        />

        <ComplaintFileUploader
          addFile={() => pickDocument()}
          attachment={attachment}
          onRemoveFile={() => onRemoveFile()}
          documentType={documentType}
          optional={true}
          loadingFile={loadingFile}
        />
        <Button
          onPress={() => onReopenIssue()}
          containerStyle={{
            backgroundColor: COLOUR_BLUE,
            marginTop: 20,
          }}
          title="Reopen Ticket"
          buttonStyle={{ backgroundColor: COLOUR_BLUE }}
          loading={isLoading}
          disabled={!form?.comment}
        />
      </ScrollView>
    </RBSheet>
  );
}

const styles = StyleSheet.create({
  formInputOuterContainerStyle: {
    marginTop: 20,
  },
  formInputInnerContainerStyle: {
    marginTop: 0,
  },
});

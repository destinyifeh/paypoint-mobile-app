import React from "react";
import DocumentPicker from "react-native-document-picker";
import { Icon } from "react-native-elements";

import { Alert, BackHandler, StyleSheet, Text, View } from "react-native";
import Button from "../../../../../../../components/button";
import Header from "../../../../../../../components/header";
import { ERROR_STATUS } from "../../../../../../../constants/api";
import { DOCUMENT_BASE_URL } from "../../../../../../../constants/api-resources";
import {
  COLOUR_BLUE,
  COLOUR_FORM_CONTROL_BACKGROUND,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_FAMILY_BODY,
  FONT_SIZE_MID,
  FONT_SIZE_TEXT_INPUT,
  FONT_SIZE_TITLE,
} from "../../../../../../../constants/styles";
import { onboardingService } from "../../../../../../../setup/api";
import { flashMessage } from "../../../../../../../utils/dialog";
import { deleteData } from "../../../../../../../utils/storage";
import { FipAgentFileUploader } from "../../components/file-upload";

function FipAgentAuthorizationLetter(props) {
  const [state, setState] = React.useState({
    errorMessage: null,
    propagateFormErrors: false,
    description: null,
    message: null,
    isLoading: false,
    user: null,
    isLoadingBvn: false,
    uploadErrorMessage: "",
    isError: false,
    bvn: "",
    attachment: null,
    loadingFile: false,
    didUploadFail: false,
    documentType: null,
    documentName: "State Authorisation Letter",
    loadingFileMessage: null,
    kycId: null,
  });

  const handleBackButtonPress = () => {
    props.navigation.goBack();
    return true;
  };

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButtonPress
    );
    return () => backHandler.remove();
  }, []);

  const pickDocument = async () => {
    setState((prev) => ({
      ...prev,
      loadingFile: true,
      didUploadFail: false,
      loadingFileMessage: "Loading your file, hang tight...",
    }));
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log(
        result.uri,
        result.type, // mime type
        result.name,
        result.size
      );
      result.documentName = "State Authorisation Letter";
      result.hasBeenUploaded = false;

      console.log(result, "my ri");
      const TEN_MB = 10485760;
      if (result.size > TEN_MB) {
        Alert.alert(null, "File is more than 10MB, try again");
        setState({ loadingFile: false });
        return false;
      }
      if (
        result.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        result.type === "application/msword"
      ) {
        getUploadedBusinessDocument({
          documentName: state.documentName,
          result: result,
          documentType: "doc",
        });
      } else if (result.type === "application/pdf") {
        getUploadedBusinessDocument({
          documentName: state.documentName,
          result: result,
          documentType: "pdf",
        });
      } else if (
        result.type === "image/png" ||
        result.type === "image/jpg" ||
        result.type === "image/jpeg"
      ) {
        getUploadedBusinessDocument({
          documentName: state.documentName,
          result: result,
          documentType: "photo",
        });
      } else {
        Alert.alert(null, "Unsupported file format, try again.");
        setState({ loadingFile: false });
        return;
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        setState({ loadingFile: false });
        return false;
      } else {
        setState({ loadingFile: false });
      }
    }
  };

  const getUploadedBusinessDocument = async ({
    documentName,
    result,
    documentType,
  }) => {
    console.log(documentName, documentType, "nT");
    console.log(result, "riri");

    result.hasBeenUploaded = true;

    const attachment = {
      ...result,
      fileName: result?.fileName ? result.fileName : result.name,
      documentType: documentType,
    };

    console.log(attachment, "attch");
    try {
      setState((prev) => ({
        ...prev,
        loadingFileMessage: "Uploading your file, please wait…",
      }));
      const {
        status,
        response,
      } = await onboardingService.fipStateDocumentUpload(
        documentName,
        attachment
      );

      console.log("DOCUMENT UPLOAD RESPONSE >>>", status, response);

      if (status === ERROR_STATUS) {
        onDocumentUploadFailure();

        return;
      }
      const serializedFormUploadResponse = serializeDocumentUploadResponseObj(
        response
      );
      onDocumentUploadSuccess(serializedFormUploadResponse);
    } catch (err) {
      console.log(err, "upload err");
    }
  };

  const onDocumentUploadFailure = () => {
    setState((prev) => ({
      ...prev,
      didUploadFail: true,
      loadingFile: false,
      loadingFileMessage: null,
    }));

    flashMessage(null, "Upload failed");
  };

  const onDocumentUploadSuccess = (uploadedDOc) => {
    setState((prev) => ({
      ...prev,
      didUploadFail: false,
      loadingFile: false,
      attachment: uploadedDOc,
      loadingFileMessage: null,
      kycId: uploadedDOc.kycId,
      propagateFormErrors: false,
    }));

    flashMessage(null, "Uploaded");
  };
  const onRemoveFile = () => {
    setState((prev) => ({
      ...prev,
      attachment: null,
    }));
  };

  const serializeDocumentUploadResponseObj = (attachment) => {
    const basePath = "/data/inclusio/finch-onboarding-service";

    return {
      hasBeenUploaded: true,
      uri: attachment?.letterLink
        ? attachment.letterLink.replace(basePath, DOCUMENT_BASE_URL) +
          attachment.letterName
        : attachment?.uri || null,
      fileName: attachment.letterName,
      documentName: attachment.letterType,
      documentType: attachment.letterType,
      documentExtention: attachment.letterExtension,
      lastModified: new Date().getTime(),
      kycId: attachment.kycId,
    };
  };

  const onContinue = async () => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
    }));
    await deleteData("fipAgentBvnDetails");
    if (!state.attachment) {
      setState((prev) => ({
        ...prev,
        propagateFormErrors: true,
        isLoading: false,
      }));
      return;
    }
    setState((prev) => ({
      ...prev,
      isLoading: false,
    }));

    props.navigation.replace("FipAgentBvnVerification", {
      kycId: state.kycId,
    });
  };
  return (
    <View style={styles.mainContainer}>
      <Header
        containerStyle={{
          backgroundColor: COLOUR_BLUE,
        }}
        leftComponent={
          <Icon
            underlayColor="transparent"
            color={COLOUR_WHITE}
            name="chevron-left"
            size={40}
            type="material"
            onPress={() => props.navigation.goBack()}
          />
        }
        statusBarProps={{
          backgroundColor: "transparent",
          barStyle: CONTENT_LIGHT,
        }}
        title="Authorisation Letter"
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: "bold",
          fontSize: FONT_SIZE_TITLE,
        }}
      />

      <View style={styles.contentContainer}>
        <FipAgentFileUploader
          didUploadFail={state.didUploadFail}
          title="State Authorisation Letter"
          attachment={state.attachment}
          documentType={state.attachment?.documentExtention}
          onRemoveFile={onRemoveFile}
          onPress={pickDocument}
          loadingFile={state.loadingFile}
          propagateError={state.propagateFormErrors}
          loadingFileMessage={state.loadingFileMessage}
          disabled={state.loadingFile}
        />
        {state.isError && (
          <View style={styles.errorView}>
            <Icon
              name="info-circle"
              type="font-awesome"
              color="#DC4437"
              size={18}
            />

            <Text style={styles.errorText}>{state.uploadErrorMessage}</Text>
          </View>
        )}
        <View>
          <Button
            onPress={onContinue}
            containerStyle={{
              backgroundColor: COLOUR_BLUE,
              marginBottom: 20,
              marginTop: 35,
            }}
            title="Continue"
            buttonStyle={{ backgroundColor: COLOUR_BLUE }}
            loading={state.isLoading}
            disabled={state.isLoading || state.loadingFile}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    width: "90%",
    alignSelf: "center",
    flex: 1,
    paddingVertical: 15,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  inputStyle: {
    fontFamily: FONT_FAMILY_BODY,
    fontSize: FONT_SIZE_TEXT_INPUT,
    width: "100%",
    backgroundColor: COLOUR_FORM_CONTROL_BACKGROUND,

    borderWidth: 1.5,
    borderRadius: 8,
    flexDirection: "row",
    height: 50,
    padding: 0,
    paddingLeft: 15,
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
  inputError: {
    color: "#DC4437",
  },
});

export default FipAgentAuthorizationLetter;

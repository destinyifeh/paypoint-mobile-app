import React from "react";
import { Image, InteractionManager, ScrollView, View } from "react-native";
import DocumentPicker from "react-native-document-picker";
import BaseForm from "../../../../../../src/components/base-form";
import Button from "../../../../../components/button";
import ClickableListItem from "../../../../../components/clickable-list-item";
import Text from "../../../../../components/text";
import { AGENT } from "../../../../../constants";
import { DOCUMENT_BASE_URL } from "../../../../../constants/api-resources";
import { CASUAL } from "../../../../../constants/dialog-priorities";
import {
  COLOUR_BLACK,
  COLOUR_BLUE,
  COLOUR_WHITE,
  FONT_FAMILY_BODY_BOLD,
  FONT_FAMILY_BODY_SEMIBOLD,
  FONT_SIZE_TITLE,
} from "../../../../../constants/styles";
import CacRegFilePreview from "../../../../../fragments/cac-file-preview";
import UploadFileMenu from "../../../../../fragments/upload-file-menu";
import { flashMessage } from "../../../../../utils/dialog";
import { loadData } from "../../../../../utils/storage";

const UPLOAD_LIMIT = 1048576;
const FILE_UPLOAD_LIMIT_MESSAGE_NEW =
  "The file you uploaded exceeds the file limit of 1MB.";

//KycDetailsForm CacRegFilePreview
export class KycDetailsForm extends BaseForm {
  requiredFields = [
    "firstName",
    "lastName",
    "phoneNumber",
    "dateOfBirth",
    "identificationNumber",
    "agentPhoneNumber",
    "Utility Bill",
  ];
  requiredFilesMap = {
    "NIN Slip Image": "MEANS_OF_IDENTIFICATION",
    Signature: "SIGNATURE",
    "Supporting Documents": "SUPPORTING_DOCUMENTS",
  };

  // platform = new Platform();

  constructor() {
    super();

    this.state = {
      sanefForm: { reference: null },
      form: {},
      invalidFields: [],
      attachments: [],
      filesAttached: [],
      isComplete: null,
      agentCode: "",
      selfie: "",
      buttonDisabled: true,
      isLoading: false,
      validDocuments: [],
      selfieBase64: "",
      hasSelfie: false,
      allDocuments: [],
      assistedCacRegType: false,
    };

    this.onAddDocumentClick = this.onAddDocumentClick.bind(this);
    this.onAddFileClick = this.onAddFileClick.bind(this);
    this.onAddImageClick = this.onAddImageClick.bind(this);
    this.removeAttachment = this.removeAttachment.bind(this);
    this.uploadDocument = this.uploadDocument.bind(this);
    this.loadRegType = this.loadRegType.bind(this);
  }

  requiredFiles = ["NIN Slip Image", "Signature", "Supporting Document"];

  requiredFilesWithoutSelfie = [
    "Passport",
    "NIN Slip Image",
    "Signature",
    "Supporting Document",
  ];

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });
      //   setTimeout(() => this.accountNumber.focus(), 500);
    });
    this.loadData();
    this.loadRegType();
  }

  async loadRegType() {
    const savedCacRegType = JSON.parse(await loadData("CAC REG TYPE"));

    if (savedCacRegType === "assisted") {
      this.setState({ assistedCacRegType: true });
    } else {
      this.setState({ assistedCacRegType: false });
    }

    console.log("savedCacRegTypeKyc", this.state.assistedCacRegType);
  }

  async base64Image(url) {
    const data = await fetch(url);
    const blob = await data.blob();
    const reader = new FileReader();
    const base64data = await new Promise((resolve) => {
      reader.readAsDataURL(blob);
      reader.onloadend = () => resolve(reader.result);
    });
    return base64data;
  }

  async loadData() {
    const agentInformation = JSON.parse(await loadData(AGENT));
    const documents = agentInformation.documents;
    console.log("AGENT INFORMATION FOR KYC1", agentInformation.documents);
    const hasSelfieImage = documents.some(
      (doc) => doc.documentType === "SELFIE_IMAGE"
    );
    if (hasSelfieImage) {
      console.log("Has Selfie", true);
      const selfieImage = documents.find(
        (doc) => doc.documentType === "SELFIE_IMAGE"
      );
      console.log("Has Selfie2", selfieImage);
      // const path = agentInformation.documents[3].documentLink;
      // console.log("Has Selfie3", path);
      const path = selfieImage.documentLink;
      console.log("Has Selfie3", path);
      const newPath = path.replace(
        "/data/inclusio/finch-onboarding-service",
        DOCUMENT_BASE_URL
      );
      console.log("newPath", newPath);

      this.setState({
        selfie: newPath,
        selfieBase64: path,
        hasSelfie: true,
      });
      // const base64Image = await this.base64Image(`${path}`);
      // console.log("BASE64", base64Image);
      console.log("AGENT INFORMATION FOR KYC 2", this.state.selfie);
    } else {
      console.log("Has Selfie", false);
      this.setState({
        hasSelfie: false,
      });
    }
  }

  checkDocumentLength(docs) {
    const valid = this.checkFormValidity(docs);
    const completeDocs = this.hasAllRequiredDocs(docs);
    console.log("VALID LEGNTH", valid);
    console.log("VALID LEGNTH2", completeDocs);

    if (!completeDocs) {
      this.setState({
        buttonDisabled: true,
      });
      return;
    } else if (completeDocs) {
      this.setState({
        buttonDisabled: false,
      });
    }
  }

  hasAllRequiredDocs(array) {
    if (this.state.hasSelfie) {
      const requiredNames = ["NIN Slip Image", "Signature"];
      const hasAllRequiredNames = requiredNames.every((name) =>
        array.some((doc) => doc.documentName === name)
      );
      if (hasAllRequiredNames) {
        console.log(
          "Both 'Means of Identification' and 'Signature' are present."
        );
        return true;
      } else {
        console.log("One or both of the required document names are missing.");
        return false;
      }
    } else {
      const requiredDocsWithoutSelfie = [
        "NIN Slip Image",
        "Signature",
        "Passport",
      ];
      const hasAllRequiredNames = requiredDocsWithoutSelfie.every((name) =>
        array.some((doc) => doc.documentName === name)
      );
      if (hasAllRequiredNames) {
        console.log(
          "Both 'Means of Identification' and 'Signature' are present."
        );
        return true;
      } else {
        console.log("One or both of the required document names are missing.");
        return false;
      }
    }
  }
  checkFormValidity(arr) {
    const documentsData = this.state.attachments;
    const allDocuments = this.state.allDocuments;
    console.log("VALID KYC FORM DOCS", documentsData);
    console.log("VALID KYC FORM DOCS2", allDocuments);
    if (this.state.hasSelfie) {
      return Array.isArray(arr) && arr.length === 2;
    } else {
      return Array.isArray(arr) && arr.length === 3;
    }
  }

  getAttachment(documentName) {
    return this.state.attachments.find(
      (value) =>
        value.documentName === documentName ||
        value.documentType === documentName
    );
  }

  // getAttachment(documentName) {
  //   if (!this.state.attachments) return;
  //   if (documentName === "Means of identification") {
  //     return this.state.attachments.filter(
  //       (value) =>
  //         value.documentName === documentName ||
  //         value.documentType === documentName ||
  //         value.documentName === "MEANS_OF_IDENTIFICATION"
  //     )[0];
  //   }
  //   return this.state.attachments.find(
  //     (value) =>
  //       value.documentName === documentName ||
  //       value.documentType === documentName ||
  //       value.documentName === "MEANS_OF_IDENTIFICATION"
  //   );
  // }

  async onSubmitEditing() {
    this.setState({
      form: {
        ...this.state.form,
      },
    });
  }

  serializeFormData() {
    const {
      firstName,
      lastName,
      phone,
      identificationNumber,
      dateOfBirth,
    } = this.state.form;

    return {
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phone ? `234${phone.slice(-10)}` : null,
      identificationNumber: identificationNumber,
      dateOfBirth: Moment(dateOfBirth, "DD-MM-YYYY").format("YYYY-MM-DD"),
      agentPhoneNumber: phone ? `234${phone.slice(-10)}` : null,
    };
  }

  async onAddDocumentClick() {
    let documentName = this.documentName;

    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });

      documentName = documentName || res.name;

      const response = {
        documentName,
        hasBeenUploaded: false,
        fileName: res.name,
        ...res,
      };
      console.log("SIZE IMAGE", response.fileSize);

      if (response.size > UPLOAD_LIMIT) {
        flashMessage(null, FILE_UPLOAD_LIMIT_MESSAGE_NEW, CASUAL);
        return;
      }

      this.uploadDocument(response).then((value) => {
        const newFilesAttached = this.state.filesAttached.includes(documentName)
          ? this.state.filesAttached
          : [...this.state.filesAttached, documentName];

        const isComplete =
          newFilesAttached.filter((value) => this.requiredFiles.includes(value))
            .length >= this.requiredFiles.length;

        this.setState({
          attachments: [...this.state.attachments, response],
          filesAttached: newFilesAttached,
          isComplete,
        });
        this.checkDocumentLength(this.state.attachments);
        // this.hasAllRequiredDocs(this.state.attachments);
        console.log("ADDED DOC", this.state.attachments);
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  // async onAddImageClick() {
  //   const { sanefForm } = this.state;
  //   const documentName = this.documentName;

  //   const options = {
  //     mediaType: "photo",
  //     quality: 0.25,
  //     includeBase64: true,
  //     saveToPhotos: false,
  //   };

  //   await requestWriteExternalStoragePermission();

  //   ImagePicker.launchImageLibrary(options, (response) => {
  //     console.log("Response = ", response);

  //     if (response.fileSize > FILE_UPLOAD_LIMIT) {
  //       flashMessage(null, FILE_UPLOAD_LIMIT_MESSAGE, CASUAL);

  //       return;
  //     }

  //     if (response.didCancel) {
  //       console.log("User cancelled image picker");
  //     } else if (response.error) {
  //       console.log("ImagePicker Error: ", response.error);
  //     } else if (response.customButton) {
  //       console.log("User tapped custom button: ", response.customButton);
  //     } else {
  //       const source = { uri: response.uri };

  //       const responseData = {
  //         base64Data: `data:${response.type};base64,${response.data}`,
  //         documentName,
  //         hasBeenUploaded: false,
  //         ...response,
  //       };

  //       console.log({ responseData, sanefForm });
  //       console.log(this.state);

  //       this.uploadDocument(responseData).then((value) => {
  //         const newFilesAttached = this.state.filesAttached.includes(
  //           documentName
  //         )
  //           ? this.state.filesAttached
  //           : [...this.state.filesAttached, documentName];

  //         const isComplete =
  //           newFilesAttached.filter((value) =>
  //             this.requiredFiles.includes(value)
  //           ).length === this.requiredFiles.length;

  //         this.setState({
  //           attachments: [...this.state.attachments, responseData],
  //           filesAttached: newFilesAttached,
  //           isComplete,
  //         });
  //         this.checkDocumentLength(this.state.attachments);
  //         // this.hasAllRequiredDocs(this.state.attachments);
  //         console.log("ADDED IMAGE DOC", this.state.attachments);
  //       });
  //     }
  //   });

  //   return;
  // }

  async onAddImageClick() {
    let documentName = this.documentName;

    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });

      documentName = documentName || res.name;

      const response = {
        documentName,
        hasBeenUploaded: false,
        fileName: res.name,
        ...res,
      };

      if (response.size > UPLOAD_LIMIT) {
        flashMessage(null, FILE_UPLOAD_LIMIT_MESSAGE_NEW, CASUAL);

        return;
      }

      console.log("IMAGE PICK RES", response);

      this.uploadDocument(response).then((value) => {
        const newFilesAttached = this.state.filesAttached.includes(documentName)
          ? this.state.filesAttached
          : [...this.state.filesAttached, documentName];

        const isComplete =
          newFilesAttached.filter((value) => this.requiredFiles.includes(value))
            .length >= this.requiredFiles.length;

        this.setState({
          attachments: [...this.state.attachments, response],
          filesAttached: newFilesAttached,
          isComplete,
        });
        this.checkDocumentLength(this.state.attachments);
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  onAddFileClick(documentName) {
    this.documentName = documentName;
    this.uploadFileMenu.open();
  }

  removeAttachment(attachment) {
    const newAttachments = this.state.attachments.filter(
      (value) => value !== attachment
    );
    const newFilesAttached = this.state.filesAttached.filter(
      (value) => value !== attachment.documentName
    );

    // this.props.evaluateInvalidField({ [attachment.documentName]: null });

    const isComplete =
      newFilesAttached.filter((value) => this.requiredFiles.includes(value))
        .length === this.requiredFiles.length;

    this.setState(
      {
        attachments: newAttachments,
        filesAttached: newFilesAttached,
        isComplete,
      },
      () => {
        this.checkDocumentLength(this.state.attachments);
        console.log("REMOVED ATTACHMENT", this.state.attachments);
      }
    );

    // this.checkDocumentLength(this.state.attachments);
  }

  async uploadDocument(
    value,
    onCompleteDocumentUpload = () => {},
    onDocumentUploadFailure = () => {}
  ) {
    if (value.hasBeenUploaded) {
      return;
    }

    let attachments = this.state.attachments;
    console.log("DOCATTACHMENTS", attachments);
    const attachmentPreview = this.refs[`file-preview-${value.documentName}`];

    if (!attachmentPreview) {
      setTimeout(
        () =>
          this.uploadDocument(
            value,
            onCompleteDocumentUpload,
            onDocumentUploadFailure
          ),
        1000
      );

      return value;
    }

    attachmentPreview.setState({
      didUploadFail: null,
      isUploadOngoing: true,
    });

    const docType = this.requiredFilesMap[value.documentName];

    console.log("DOCTYPE", docType);

    // const {
    //   status,
    //   response,
    // } = await this.platform.documentUploadAggregatorClass(
    //   this.state.agentCode,
    //   docType,
    //   value
    // );

    attachmentPreview.setState({
      isUploadOngoing: false,
    });

    // attachments = this.state.attachments;

    // if (status === ERROR_STATUS) {
    //   onDocumentUploadFailure();

    //   attachmentPreview.setState({
    //     didUploadFail: true,
    //   });

    //   return;
    // }

    // this.props.evaluateInvalidField({ [docType]: 234 });
    value.hasBeenUploaded = true;

    attachments.map((thisValue) => {
      if (thisValue.documentName === value.documentName) {
        thisValue.isUploadComplete = true;
      }
    });

    const isUploadComplete =
      attachments.filter((value) => value.hasBeenUploaded).length ===
      attachments.length;

    isUploadComplete && onCompleteDocumentUpload();

    this.setState({
      attachments,
      isUploadComplete,
    });

    console.log("VALID LEGNTH2", this.state.attachments);
    this.checkDocumentLength(this.state.attachments);

    return value;
  }

  uploadAllDocuments(onCompleteDocumentUpload, onDocumentUploadFailure) {
    const { attachments, isUploadComplete } = this.state;

    const uploadedAttachments = attachments.filter(
      (value) => value.hasBeenUploaded
    );

    if (isUploadComplete || uploadedAttachments.length === attachments.length) {
      onCompleteDocumentUpload();
    } else {
      attachments.map((value) => {
        !uploadedAttachments.includes(value) &&
          this.uploadDocument(
            value,
            onCompleteDocumentUpload,
            onDocumentUploadFailure
          );
      });
    }
  }

  render() {
    const { onPress, loading } = this.props;
    const displayedAttachments = [];
    return (
      <React.Fragment>
        <View
          style={{
            backgroundColor: COLOUR_WHITE,
            flex: 1,
          }}
        >
          <ScrollView>
            <View
              style={{
                flex: 1,
                marginHorizontal: 20,
                marginTop: 20,
              }}
            >
              {/* <FormInput
                autoCapitalize="none"
                autoCompleteType="email"
                // defaultValue={this.state.form.identificationNumber}
                innerContainerStyle={styles.formInputInnerContainerStyle}
                keyboardType="number-pad"
                onChangeText={(identificationNumber, isValid) => {
                  this.updateFormField({ identificationNumber });
                  !isValid
                    ? this.addInvalidField("identificationNumber")
                    : this.removeInvalidField("identificationNumber");
                  this.onSubmitEditing();
                }}
                onSubmitEditing={() => {}}
                outerContainerStyle={styles.formInputOuterContainerStyle}
                placeholder="***********"
                propagateError={this.props.propagateFormErrors}
                showValidIndicator={true}
                text="Enter NIN*"
                textInputRef={(input) => (this.identificationNumber = input)}
                validators={{
                  length: BVN_LENGTH,
                  required: true,
                }}
                hideOptionalLabel={true}
              /> */}
              <View style={{ paddingVertical: 10 }}>
                <Text
                  style={{
                    color: COLOUR_BLACK,
                    fontSize: 20,
                    fontFamily: FONT_FAMILY_BODY_BOLD,
                  }}
                >
                  KYC Details
                </Text>
              </View>
              <View style={{ paddingVertical: 10 }}>
                {this.state.hasSelfie && this.state.assistedCacRegType === false && (
                  <Text
                    style={{
                      color: COLOUR_BLACK,
                      fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                      fontSize: FONT_SIZE_TITLE,
                    }}
                  >
                    Passport
                  </Text>
                )}
              </View>

              {this.state.hasSelfie && this.state.assistedCacRegType === false && (
                <View>
                  <View
                    style={{
                      height: 261,
                      width: "100%",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignContent: "center",
                      backgroundColor: "#F3F5F6",
                      alignItems: "center",
                      marginTop: 10,
                      marginBottom: 20,
                    }}
                  >
                    <View
                      style={{ borderRadius: 220, height: 224, width: 224 }}
                    >
                      <Image
                        source={{ uri: `${this.state.selfie}` }}
                        style={{ height: 225, width: 224, borderRadius: 224 }}
                      />
                    </View>
                  </View>
                </View>
              )}

              {/* {this.state.hasSelfie && (
                <View>
                  <View
                    style={{
                      height: 261,
                      width: "100%",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignContent: "center",
                      backgroundColor: "#F3F5F6",
                      alignItems: "center",
                      marginTop: 10,
                      marginBottom: 20,
                    }}
                  >
                    <View
                      style={{ borderRadius: 220, height: 224, width: 224 }}
                    >
                      <Image
                        source={{ uri: `${this.state.selfie}` }}
                        style={{ height: 225, width: 224, borderRadius: 224 }}
                      />
                    </View>
                  </View>
                </View>
              )} */}

              <UploadFileMenu
                onAddDocumentClick={this.onAddDocumentClick}
                onAddImageClick={this.onAddImageClick}
                ref_={(menu) => (this.uploadFileMenu = menu)}
                requestClose={() => this.uploadFileMenu.close()}
              />

              {this.state.hasSelfie && this.state.assistedCacRegType === false
                ? this.requiredFiles.map((value, index) => {
                    const attachment = this.getAttachment(value);

                    attachment && displayedAttachments.push(attachment);

                    console.log("ATTACHMENTSOFT2", displayedAttachments);

                    return (
                      <ClickableListItem
                        key={index}
                        onPressOut={() =>
                          !attachment && this.onAddFileClick(value)
                        }
                      >
                        <CacRegFilePreview
                          attachment={attachment}
                          name={value}
                          onRemove={() => this.removeAttachment(attachment)}
                          placeholder
                          propagateError={this.props.propagateFormErrors}
                          ref={`file-preview-${value}`}
                          retry={() => this.uploadDocument(attachment)}
                          validators={{
                            required: true,
                          }}
                        />
                      </ClickableListItem>
                    );
                  })
                : this.requiredFilesWithoutSelfie.map((value, index) => {
                    const attachment = this.getAttachment(value);
                    attachment && displayedAttachments.push(attachment);
                    // attachment && displayedAttachments.push(attachment);
                    console.log("ATTACHMENTSOFT3", attachment);
                    console.log("ATTACHMENTSOFT4", displayedAttachments);

                    return (
                      <ClickableListItem
                        key={index}
                        onPressOut={() =>
                          !attachment && this.onAddFileClick(value)
                        }
                      >
                        <CacRegFilePreview
                          attachment={attachment}
                          name={value}
                          onRemove={() => this.removeAttachment(attachment)}
                          placeholder
                          propagateError={this.props.propagateFormErrors}
                          ref={`file-preview-${value}`}
                          retry={() => this.uploadDocument(attachment)}
                          validators={{
                            required: true,
                          }}
                        />
                      </ClickableListItem>
                    );
                  })}

              {this.state.attachments.map((value, index) => {
                return !displayedAttachments.includes(value) &&
                  !hiddenAttachments.includes(value.documentName) &&
                  !hiddenAttachments.includes(value.documentType) ? (
                  <CacRegFilePreview
                    attachment={value}
                    key={index}
                    onRemove={() => this.removeAttachment(value)}
                    ref={`file-preview-${value.documentName}`}
                  />
                ) : (
                  <React.Fragment key={index} />
                );
              })}

              {this.state.attachments.map((value, index) => {
                return !displayedAttachments.includes(value) &&
                  !hiddenAttachments.includes(value.documentName) &&
                  !hiddenAttachments.includes(value.documentType) ? (
                  <CacRegFilePreview
                    attachment={value}
                    key={index}
                    onRemove={() => this.removeAttachment(value)}
                    ref={`file-preview-${value.documentName}`}
                  />
                ) : (
                  <React.Fragment key={index} />
                );
              })}

              <View style={{ paddingHorizontal: 10 }}>
                <Button
                  onPress={onPress}
                  title="Next"
                  loading={loading}
                  buttonStyle={{ backgroundColor: COLOUR_BLUE }}
                  containerStyle={{
                    backgroundColor: COLOUR_BLUE,
                    width: "100%",
                  }}
                  disabled={this.state.buttonDisabled}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </React.Fragment>
    );
  }
}

import React from "react";
import { Text } from "react-native";
import ImagePicker from "react-native-image-picker";
import BaseForm from "../../../../../../components/base-form";
import ClickableListItem from "../../../../../../components/clickable-list-item";
import FilePreview from "../../../../../../components/file-preview";
import { COLOUR_GREY } from "../../../../../../constants/styles";
import Onboarding from "../../../../../../services/api/resources/onboarding";

export class Attachments extends BaseForm {
  requiredFiles = ["ID Card", "Passport Photo"];

  onboarding = new Onboarding();

  constructor() {
    super();

    this.state = {
      attachments: [],
      filesAttached: [],
      isComplete: null,
      isUploadComplete: null,
    };

    this.onAddFileClick = this.onAddFileClick.bind(this);
    this.removeAttachment = this.removeAttachment.bind(this);
    this.uploadAllDocuments = this.uploadAllDocuments.bind(this);
    this.uploadDocument = this.uploadDocument.bind(this);
  }

  componentDidMount() {
    const attachments = this.props.application.documentsList || [];

    this.setState({
      attachments,
    });
  }

  getAttachment(documentName) {
    return this.state.attachments.find(
      (value) =>
        value.documentName === documentName ||
        value.documentType === documentName
    );
  }

  onAddFileClick(documentName) {
    const options = {
      title: "Upload Attachment",
    };

    ImagePicker.showImagePicker(options, (response) => {
      response.documentName = documentName;
      response.hasBeenUploaded = false;

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        const source = { uri: response.uri };

        const newFilesAttached = this.state.filesAttached.includes(documentName)
          ? this.state.filesAttached
          : [...this.state.filesAttached, documentName];

        const isComplete =
          newFilesAttached.filter((value) => this.requiredFiles.includes(value))
            .length === this.requiredFiles.length;

        this.props.application.applicationId && this.uploadDocument(response);

        this.setState({
          attachments: [...this.state.attachments, response],
          filesAttached: newFilesAttached,
          isComplete,
        });
      }
    });
  }

  removeAttachment(attachment) {
    const newAttachments = this.state.attachments.filter(
      (value) => value !== attachment
    );
    const newFilesAttached = this.state.filesAttached.filter(
      (value) => value !== attachment.documentName
    );

    const isComplete =
      newFilesAttached.filter((value) => this.requiredFiles.includes(value))
        .length === this.requiredFiles.length;

    this.setState({
      attachments: newAttachments,
      filesAttached: newFilesAttached,
      isComplete,
    });
  }

  serializeApiData(attachments) {
    return attachments.map((value) => {
      return {
        uri: `${CDN_BASE_URL}/p/finch/onboarding/${value.documentName}`,
        hasBeenUploaded: true,
        fileName: value.documentName,
        documentName: value.documentType,
      };
    });
  }

  serializeFormData() {
    return this.state.attachments.map((value) => {
      value.url = value.uri;
      return value;
    });
  }

  async uploadDocument(
    value,
    onCompleteDocumentUpload = () => {},
    onDocumentUploadFailure = () => {}
  ) {
    if (value.hasBeenUploaded) {
      return;
    }

    const { attachments } = this.state;
    const attachmentPreview = this.refs[`file-preview-${value.documentName}`];

    attachmentPreview.setState({
      didUploadFail: null,
      isUploadOngoing: true,
    });

    const { status, response } = await this.onboarding.documentUpload(
      this.props.application.applicationId || 2405,
      value.documentName,
      value
    );
    attachmentPreview.setState({
      isUploadOngoing: false,
    });

    console.log("DOCUMENT UPLOAD RESPONSE >>>", status, response);

    if (status === ERROR_STATUS) {
      onDocumentUploadFailure();

      attachmentPreview.setState({
        didUploadFail: true,
      });

      return;
    }

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

    return value;
  }

  uploadAllDocuments(onCompleteDocumentUpload, onDocumentUploadFailure) {
    const { attachments, isUploadComplete } = this.state;

    uploadedAttachments = attachments.filter((value) => value.hasBeenUploaded);

    if (!isUploadComplete) {
      attachments.map((value) =>
        this.uploadDocument(
          value,
          onCompleteDocumentUpload,
          onDocumentUploadFailure
        )
      );
    } else {
      onCompleteDocumentUpload();
    }
  }

  render() {
    const displayedAttachments = [];

    return (
      <React.Fragment>
        <Text
          style={{
            color: COLOUR_GREY,
            marginBottom: 10,
          }}
        >
          Attach a scanned copy each, of the confirmation documents in one of
          these media formats - .jpg, .jpeg, .png
        </Text>

        {this.requiredFiles.map((value, index) => {
          const attachment = this.getAttachment(value);
          attachment && displayedAttachments.push(attachment);

          return (
            <ClickableListItem
              key={index}
              onPressOut={() => this.onAddFileClick(value)}
            >
              <FilePreview
                attachment={attachment}
                name={value}
                ref={`file-preview-${value}`}
                onRemove={() => this.removeAttachment(attachment)}
                retry={() => this.uploadDocument(attachment)}
                placeholder
                propagateError={this.props.propagateFormErrors}
                validators={{
                  required: true,
                }}
              />
            </ClickableListItem>
          );
        })}
      </React.Fragment>
    );
  }
}

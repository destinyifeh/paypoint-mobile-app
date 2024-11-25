import React from "react";
import FormInput from "../../../../../components/form-controls/form-input";

import { Text, View } from "react-native";
import DocumentPicker from "react-native-document-picker";
import BaseForm from "../../../../../components/base-form";
import ClickableListItem from "../../../../../components/clickable-list-item";
import FilePreview from "../../../../../components/file-preview";
import ProgressiveImage from "../../../../../components/progressive-image";
import { ERROR_STATUS, SUCCESS_STATUS } from "../../../../../constants/api";
import { CDN_BASE_URL } from "../../../../../constants/api-resources";
import { COLOUR_GREY } from "../../../../../constants/styles";
import UploadFileMenu from "../../../../../fragments/upload-file-menu";
import Platform from "../../../../../services/api/resources/platform";
import UserManagement from "../../../../../services/api/resources/user-management";
import styles from "../styles";



export default class AgentKYCForm extends BaseForm {
  requiredFields = [
    "ADDRESS_VERIFICATION_FORM"
  ];
  requiredFilesMap = {'Utility Bill': 'UTILITY_BILL',
  'Character Form': 'CHARACTER_FORM',
  'Address Verification Form': 'ADDRESS_VERIFICATION_FORM'}
  state = {
    form: {},
    invalidFields: [],
  };

  userManagement = new UserManagement();
  platform = new Platform();

  constructor() {
    super();


    this.fields = [
      this.identificationNumber,
      this.identificationType,
    ];

    this.state = {
      attachments: [],
      filesAttached: [],
      isComplete: null,
    };
    
    this.onAddDocumentClick = this.onAddDocumentClick.bind(this);
    this.onAddFileClick = this.onAddFileClick.bind(this);
    this.onAddImageClick = this.onAddImageClick.bind(this);
    this.removeAttachment = this.removeAttachment.bind(this);
    this.uploadDocument = this.uploadDocument.bind(this);
  }




  requiredFiles = [
    'Utility Bill',
    'Character Form',
    'Address Verification Form'
  ];


  componentDidMount() {
    this.initiate();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.application !== prevProps.application) {
      const attachments = this.serializeApiData(this.props.application.documentsList || []);

      this.setState({
        attachments,
      });
    }
  }

  getAttachment(documentName) {
    if (!this.state.attachments) return;

    return this.state.attachments.find(
      value => value.documentName === documentName
        || value.documentType === documentName
        || value.documentName === "ADDRESS_VERIFICATION_FORM"
    )
  }

  async onAddDocumentClick() {
    let documentName = this.documentName;


    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf]
      });

      documentName = documentName || res.name;

      const response = {
        documentName,
        hasBeenUploaded: false,
        fileName: res.name,
        ...res
      };

      this.props.application.businessDetails.agentCode && this.uploadDocument(response).then(
        value => {

          const newFilesAttached = this.state.filesAttached.includes(documentName) ?
            this.state.filesAttached : [
              ...this.state.filesAttached,
              documentName
            ];

          const isComplete = newFilesAttached.filter(
            value => this.requiredFiles.includes(value)
          ).length >= this.requiredFiles.length;

          this.setState({
            attachments: [
              ...this.state.attachments,
              response
            ],
            filesAttached: newFilesAttached,
            isComplete
          });
        }
      );

    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  async onAddImageClick() {
    let documentName = this.documentName;

    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images]
      });

      documentName = documentName || res.name;

      const response = {
        documentName,
        hasBeenUploaded: false,
        fileName: res.name,
        ...res
      };

      this.props.application.businessDetails.agentCode && this.uploadDocument(response).then(
        value => {
          const newFilesAttached = this.state.filesAttached.includes(documentName) ?
            this.state.filesAttached : [
              ...this.state.filesAttached,
              documentName
            ];

          const isComplete = newFilesAttached.filter(
            value => this.requiredFiles.includes(value)
          ).length >= this.requiredFiles.length;


          this.setState({
            attachments: [
              ...this.state.attachments,
              response
            ],
            filesAttached: newFilesAttached,
            isComplete
          });
        }
      );

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
    const newAttachments = this.state.attachments.filter(value => value !== attachment);
    const newFilesAttached = this.state.filesAttached.filter(value => value !== attachment.documentName);

    this.props.evaluateInvalidField({ [attachment.documentName]: null })

    const isComplete = newFilesAttached.filter(
      value => this.requiredFiles.includes(value)
    ).length === this.requiredFiles.length;

    this.setState({
      attachments: newAttachments,
      filesAttached: newFilesAttached,
      isComplete
    });
  }

  serializeApiData(attachments) {
    return attachments.map(value => {
      return {
        hasBeenUploaded: true,
        uri: `${CDN_BASE_URL}/p/finch/onboarding/${value.documentName}`,
        fileName: value.documentName,
        documentName: value.documentType,
        documentType: value.documentType
      }
    })
  }

  initiate = async () => {
    this.setState({
      form: this.props.application
    });

    if (status === SUCCESS_STATUS) {
      const attachments = this.serializeApiData(response) || [];
      if (attachments.length > 0) {
        this.props.evaluateInvalidField({ "ADDRESS_VERIFICATION_FORM": 234 })
      }
      this.setState({
        attachments: this.props.application.businessDetails.documents
      });
    }
  }


  serializeFormData() {
    return this.state.attachments.map(value => {
      value.url = value.documentLink
      return value
    })
  }

  async uploadDocument(value, onCompleteDocumentUpload = () => { }, onDocumentUploadFailure = () => { }) {
    if (value.hasBeenUploaded) {
      return
    }

    let attachments = this.state.attachments;
    const attachmentPreview = this.refs[`file-preview-${value.documentName}`];

    if (!attachmentPreview) {
      setTimeout(
        () => this.uploadDocument(value, onCompleteDocumentUpload, onDocumentUploadFailure),
        1000
      );

      return value;
    }

    attachmentPreview.setState({
      didUploadFail: null,
      isUploadOngoing: true,
    })

    const docType = this.requiredFilesMap[value.documentName];
    const { status, response } = await this.platform.documentUploadAggregatorClass(
      this.props.application.businessDetails.agentCode,
      docType,
      value,
    );

    attachmentPreview.setState({
      isUploadOngoing: false,
    })

    if (status === ERROR_STATUS) {
      onDocumentUploadFailure()

      attachmentPreview.setState({
        didUploadFail: true
      });

      return
    }

    this.props.evaluateInvalidField({ [docType]: 234 })
    value.hasBeenUploaded = true;

    attachments.map(thisValue => {
      if (thisValue.documentName === value.documentName) {
        thisValue.isUploadComplete = true
      }
    });

    const isUploadComplete = attachments.filter(
      value => value.hasBeenUploaded
    ).length === attachments.length;

    isUploadComplete && onCompleteDocumentUpload();

    this.setState({
      attachments,
      isUploadComplete,
    });

    return value;
  }

  uploadAllDocuments(onCompleteDocumentUpload, onDocumentUploadFailure) {
    const { attachments, isUploadComplete } = this.state;

    const uploadedAttachments = attachments.filter(value => value.hasBeenUploaded);

    if (isUploadComplete || uploadedAttachments.length === attachments.length) {
      onCompleteDocumentUpload();
    }
    else {
      attachments.map(
        value => {
          !uploadedAttachments.includes(value) && this.uploadDocument(value, onCompleteDocumentUpload, onDocumentUploadFailure);
        }
      );
    }
  }


  render() {
    const displayedAttachments = [];
    return (
      <React.Fragment>

        <FormInput
          innerContainerStyle={styles.formInputInnerContainerStyle}
          disabled
          outerContainerStyle={styles.formInputOuterContainerStyle}
          defaultValue={this.state.form?.businessDetails.identificationType}
          propagateError={this.props.propagateFormErrors}
          text="Means of Identification"
          validators={{
            required: true,
          }}
          showValidIndicator
        />

        <FormInput
          autoCapitalize="none"
          innerContainerStyle={styles.formInputInnerContainerStyle}
          defaultValue={this.state.form?.businessDetails?.identificationNumber}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="ID Number"
          propagateError={this.props.propagateFormErrors}
          text="Enter ID Number"
          textInputRef={(input) => (this.identificationNumber = input)}
          validators={{
            required: true,
            minLength: 8
          }}
          showValidIndicator
          disabled
        />

        {this.state.form?.businessDetails?.documents?.map((value, index) => {
          return <><View key={index} style={{ display: "flex", flexDirection: 'row' }}>
            <ProgressiveImage
              thumbnailSource={{ uri: value.uri || "https://mufasa.interswitchng.com/p/finch/onboarding/7105_UTILITY_BILL.jpeg" }}
              source={{ uri: value.uri || "https://mufasa.interswitchng.com/p/finch/onboarding/7105_UTILITY_BILL.jpeg" }}
              style={{
                height: 75,
                width: 75,
                borderRadius: 5
              }}
              resizeMode="cover"
            /><Text style={{ verticalAlign: "center" }} >{'\n'}{value?.documentType}</Text>
          </View>
            <View style={{ height: 5 }} />
          </>
        })}


        <UploadFileMenu
          onAddDocumentClick={this.onAddDocumentClick}
          onAddImageClick={this.onAddImageClick}
          ref_={menu => this.uploadFileMenu = menu}
          requestClose={() => this.uploadFileMenu.close()}
        />

        <Text
          style={{
            color: COLOUR_GREY,
            marginBottom: 10
          }}
        >
          Upload a file - .jpg, .jpeg, .png. Up to 10MB
        </Text>


        {this.requiredFiles.map((value, index) => {
          const attachment = this.getAttachment(value);
          attachment && displayedAttachments.push(attachment);

          return (((value==='Address Verification Form' && this.state.form?.businessDetails?.newClass ==='Prestige') 
          || value !== 'Address Verification Form') && 
          (this.props.application.businessDetails.documents.filter(value1=>value1.documentType===this.requiredFilesMap[value]).length < 1)) && <ClickableListItem
            key={index}
            onPressOut={() => !attachment && this.onAddFileClick(value)}
          >
            <FilePreview
              attachment={attachment}
              name={value}
              onRemove={() => this.removeAttachment(attachment)}
              placeholder
              propagateError={this.props.propagateFormErrors}
              ref={`file-preview-${value}`}
              retry={() => this.uploadDocument(attachment)}
              validators={{
                required: true
              }}
            />
          </ClickableListItem>
        })}
      </React.Fragment>
    );
  }
}

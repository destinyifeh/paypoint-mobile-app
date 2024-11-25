import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import DocumentPicker from 'react-native-document-picker';
import BaseForm from '../../../../components/base-form';
import ClickableListItem from '../../../../components/clickable-list-item';
import FilePreviewSelfOnboarding from '../../../../components/file-preview-self-onboarding';
import {ERROR_STATUS, SUCCESS_STATUS} from '../../../../constants/api';
import {DOCUMENT_BASE_URL} from '../../../../constants/api-resources';
import {CASUAL} from '../../../../constants/dialog-priorities';
import {
  APPLICATION_CURRENT_APPLICATION,
  APPLICATION_SELF_ONBOARDING,
} from '../../../../constants/styles';
import UploadFileMenu from '../../../../fragments/upload-file-menu';
import Onboarding from '../../../../services/api/resources/onboarding';
import UserManagement from '../../../../services/api/resources/user-management';
import {flashMessage} from '../../../../utils/dialog';

const MEANS_OF_ID = [
  {
    name: 'Passport',
    value: 'Passport',
  },
  {
    name: 'Drivers License',
    value: 'Drivers License',
  },
  {
    name: 'International Passport',
    value: 'International Passport',
  },
  {
    name: "Voter's Card",
    value: "Voter's Card",
  },
  {
    name: 'National Identification Number',
    value: 'National Identification Number',
  },
];

export default class SelfOnboardingKYCForm extends BaseForm {
  requiredFields = ['identificationType', 'identificationNumber'];

  state = {
    form: {},
    invalidFields: [],
  };

  userManagement = new UserManagement();
  onboarding = new Onboarding();

  constructor() {
    super();

    this.fields = [this.identificationNumber, this.identificationType];

    this.state = {
      attachments: [],
      filesAttached: [],
      isComplete: null,
      selfOnboarding: false,
    };

    this.onAddDocumentClick = this.onAddDocumentClick.bind(this);
    this.onAddFileClick = this.onAddFileClick.bind(this);
    this.onAddImageClick = this.onAddImageClick.bind(this);
    this.removeAttachment = this.removeAttachment.bind(this);
    this.uploadDocument = this.uploadDocument.bind(this);
  }

  ignoreFiles = ['ID Card', 'Passport Photo'];

  requiredFiles = [, /*"Government Issued ID"*/ 'Passport Photograph *'];

  async componentDidMount() {
    // const getting = await AsyncStorage.getItem(APPLICATION_SELF_ONBOARDING);
    this.props.selfOnboarding == true ? '' : this.initiate();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.application !== prevProps.application) {
      const attachments = this.serializeApiData(
        this.props.application.documentsList || [],
      ).filter(
        attachment =>
          !this.ignoreFiles.includes(attachment.documentName) &&
          !this.ignoreFiles.includes(attachment.documentType),
      );

      this.setState({
        attachments,
      });
    }
  }

  getAttachment(documentName) {
    if (!this.state.attachments) return;
    if (documentName === 'Government Issued ID') {
      return this.state.attachments.filter(
        value =>
          value.documentName === documentName ||
          value.documentType === documentName ||
          value.documentName === 'ID_CARD',
      )[0];
    }
    return this.state.attachments.find(
      value =>
        value.documentName === documentName ||
        value.documentType === documentName ||
        value.documentName === 'PASSPORT_PHOTO',
    );
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

      this.props.application.applicationId &&
        this.uploadDocument(response).then(value => {
          const newFilesAttached = this.state.filesAttached.includes(
            documentName,
          )
            ? this.state.filesAttached
            : [...this.state.filesAttached, documentName];

          const isComplete =
            newFilesAttached.filter(value => this.requiredFiles.includes(value))
              .length >= this.requiredFiles.length;

          this.setState({
            attachments: [...this.state.attachments, response],
            filesAttached: newFilesAttached,
            isComplete,
          });
        });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  async onAddImageClick() {
    console.log('SELECTING IMAGE');
    let documentName = this.documentName;

    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      console.log(res, 'NGAGEE SELECTING IMAGE');
      documentName = documentName || res.name;

      const response = {
        documentName,
        hasBeenUploaded: false,
        fileName: res.name,
        ...res,
      };

      this.props.application.applicationId &&
        this.uploadDocument(response).then(value => {
          const newFilesAttached = this.state.filesAttached.includes(
            documentName,
          )
            ? this.state.filesAttached
            : [...this.state.filesAttached, documentName];

          const isComplete =
            newFilesAttached.filter(value => this.requiredFiles.includes(value))
              .length >= this.requiredFiles.length;
          this.setState({
            attachments: [...this.state.attachments, response],
            filesAttached: newFilesAttached,
            isComplete,
          });
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

  async removeAttachment(attachment) {
    flashMessage(null, 'Removing image...', CASUAL);
    console.log(attachment, 'NUGAGEE IMAGE DETAILS RESPONSE');

    const {status, response} =
      await this.onboarding.deleteDocumentsByApplicationAggregator(
        attachment?.documentId
          ? attachment.documentId
          : this.state.uploadedDocumentId,
      );
    console.log(response, 'NUGAGEE IMAGE REMOVED FROM DB');
    if (status === SUCCESS_STATUS) {
      const newAttachments = this.state.attachments.filter(
        value => value !== attachment,
      );
      const newFilesAttached = this.state.filesAttached.filter(
        value => value !== attachment.documentName,
      );
      this.props.evaluateInvalidField({[attachment.documentName]: null});

      const isComplete =
        newFilesAttached.filter(value => this.requiredFiles.includes(value))
          .length === this.requiredFiles.length;
      this.setState({
        attachments: newAttachments,
        filesAttached: newFilesAttached,
        isComplete,
      });
      flashMessage(null, 'Image removed successfully', CASUAL);
    } else {
      flashMessage(null, 'Error removing image', CASUAL);
    }
  }

  serializeApiData(attachments) {
    console.log(attachments, 'NUGAGEE RAW VALUE REVEEALED');

    return attachments.map(value => {
      console.log(
        `${DOCUMENT_BASE_URL}/agent-kyc/${value.documentName.replace(
          'data',
          '',
        )}`,
        'NUGAGEE IMAGE URL NEW',
      );
      return {
        hasBeenUploaded: true,

        uri: `${DOCUMENT_BASE_URL}/agent-kyc/${value.documentName.replace(
          'data',
          '',
        )}`,

        fileName: value.documentName,
        documentName: value.documentType,
        documentType: value.documentType,
        documentId: value.documentId,
      };
    });
  }

  initiate = async () => {
    const newapplication = await AsyncStorage.getItem(
      APPLICATION_SELF_ONBOARDING,
    );
    const currentapplication = await AsyncStorage.getItem(
      APPLICATION_CURRENT_APPLICATION,
    );
    console.log(newapplication?.applicationId, 'NUGAGEE NEW APPLICATION ID');
    console.log(
      JSON.parse(currentapplication),
      'NUGAGEE CURRENT APPLICATION ID',
    );
    console.log(
      currentapplication?.applicationId,
      'NUGAGEE CURRENT APPLICATION DETAILSS',
    );
    console.log(newapplication?.applicationId, 'NUGAGEE APPLICATION ID 222');

    this.setState({
      form:
        this.props.application?.applicantDetails ||
        newapplication?.applicantDetails ||
        currentapplication?.applicantDetails,
    });
    if (this.props.application.applicantDetails?.identificationType) {
      this.props.evaluateInvalidField({identificationType: 123});
    }

    // if (this.props.application.applicantDetails?.identificationNumber) {
    //   this.props.evaluateInvalidField({ identificationNumber: 123 });
    // }
    const {status, response} =
      await this.onboarding.getDocumentsByApplicationAggregator(
        this.props.application?.applicationId ||
          newapplication?.applicationId ||
          currentapplication?.applicationId,
      );

    console.log(response, 'NUGAGEE UPLOADIG RESPONSE');

    if (status === SUCCESS_STATUS) {
      const attachments = this.serializeApiData(response) || [];
      if (attachments.length > 0) {
        // if (attachments[0].documentType === "ID_CARD") {
        //   this.props.evaluateInvalidField({ ID_CARD: 234 });
        // } else {
        //   this.props.evaluateInvalidField({ PASSPORT_PHOTO: 234 });
        // }
        // if (attachments[1].documentType === "ID_CARD") {
        //   this.props.evaluateInvalidField({ ID_CARD: 234 });
        // } else

        if (attachments[0].documentType === 'PASSPORT_PHOTO') {
          this.props.evaluateInvalidField({PASSPORT_PHOTO: 234});
        }
      }

      this.setState({
        attachments: attachments,
      });
    }
  };

  serializeFormData() {
    return this.state.attachments.map(value => {
      value.url = value.uri;
      return value;
    });
  }

  async uploadDocument(
    value,
    onCompleteDocumentUpload = () => {},
    onDocumentUploadFailure = () => {},
  ) {
    if (value.hasBeenUploaded) {
      return;
    }
    let attachments = this.state.attachments;
    const attachmentPreview = this.refs[`file-preview-${value.documentName}`];

    if (!attachmentPreview) {
      setTimeout(
        () =>
          this.uploadDocument(
            value,
            onCompleteDocumentUpload,
            onDocumentUploadFailure,
          ),
        1000,
      );

      return value;
    }

    attachmentPreview.setState({
      didUploadFail: null,
      isUploadOngoing: true,
    });

    const {status, response} = await this.onboarding.documentUploadAggregator(
      this.props.application.applicationId,
      value.documentName,
      value,
    );

    console.log(response, 'NUGAGEE DOCUMENT RESPONSE');

    attachments = this.state.attachments;

    attachmentPreview.setState({
      isUploadOngoing: false,
    });

    if (status === ERROR_STATUS) {
      onDocumentUploadFailure();

      attachmentPreview.setState({
        didUploadFail: true,
      });

      return;
    }
    this.props.updateImage(response);

    if (value.documentName === 'Government Issued ID') {
      this.props.evaluateInvalidField({ID_CARD: 234});
    } else {
      this.props.evaluateInvalidField({PASSPORT_PHOTO: 234});
    }
    value.hasBeenUploaded = true;

    attachments.map(thisValue => {
      if (thisValue.documentName === value.documentName) {
        thisValue.isUploadComplete = true;
      }
    });

    const isUploadComplete =
      attachments.filter(value => value.hasBeenUploaded).length ===
      attachments.length;

    isUploadComplete && onCompleteDocumentUpload();

    this.setState({
      attachments,
      isUploadComplete,
      uploadedDocumentId: response.documentId,
    });
    return value;
  }

  uploadAllDocuments(onCompleteDocumentUpload, onDocumentUploadFailure) {
    const {attachments, isUploadComplete} = this.state;

    const uploadedAttachments = attachments.filter(
      value => value.hasBeenUploaded,
    );

    if (isUploadComplete || uploadedAttachments.length === attachments.length) {
      onCompleteDocumentUpload();
    } else {
      attachments.map(value => {
        !uploadedAttachments.includes(value) &&
          this.uploadDocument(
            value,
            onCompleteDocumentUpload,
            onDocumentUploadFailure,
          );
      });
    }
  }

  render() {
    const displayedAttachments = [];
    return (
      <React.Fragment>
        {/* <FormPicker
          choices={MEANS_OF_ID.map(({ name, value }) => ({
            label: name,
            value,
          }))}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={(identificationType, isValid) => {
            this.updateFormField({
              identificationType,
            });
            this.props.evaluateInvalidField({ identificationType });
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          defaultValue={
            this.state.form?.identificationType ||
            this.props.form?.identificationType
          }
          propagateError={this.props.propagateFormErrors}
          text="Means of Identification"
          validators={{
            required: true,
          }}
        /> */}

        {/* <FormInput
          autoCapitalize="none"
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(identificationNumber) => {
            this.updateFormField({ identificationNumber });
            this.props.evaluateInvalidField({ identificationNumber }, 8);
          }}
          defaultValue={this.state.form?.identificationNumber}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="ID Number"
          propagateError={this.props.propagateFormErrors}
          text="Enter ID Number"
          textInputRef={(input) => (this.identificationNumber = input)}
          validators={{
            required: true,
            minLength: 8,
          }}
        /> */}

        <UploadFileMenu
          onAddDocumentClick={this.onAddDocumentClick}
          onAddImageClick={this.onAddImageClick}
          ref_={menu => (this.uploadFileMenu = menu)}
          requestClose={() => this.uploadFileMenu.close()}
        />

        {/* <Text
          style={{
            color: COLOUR_GREY,
            marginBottom: 10,
          }}
        >
          Upload a file - .jpg, .jpeg, .png. Up to 10MB
        </Text> */}

        {this.requiredFiles.map((value, index) => {
          const attachment = this.getAttachment(value);
          attachment && displayedAttachments.push(attachment);

          return (
            <>
              <ClickableListItem
                key={index}
                onPressOut={() => !attachment && this.onAddFileClick(value)}>
                <FilePreviewSelfOnboarding
                  attachment={attachment}
                  name={
                    value === 'Government Issued ID' &&
                    this.state.form?.identificationType
                      ? this.state.form.identificationType
                      : value
                  }
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
            </>
          );
        })}
        {/*       
      {this.state.attachments.map((value, index) => {
        return !displayedAttachments.includes(value) && !hiddenAttachments.includes(value.documentName) && !hiddenAttachments.includes(value.documentType) ? <FilePreview
          attachment={value}
          key={index}
          onRemove={() => this.removeAttachment(value)}
          ref={`file-preview-${value.documentName}`}
        /> : <React.Fragment key={index} />
      })} */}
      </React.Fragment>
    );
  }
}

import React from "react";

import DocumentPicker from "react-native-document-picker";

import BaseForm from "../../../components/base-form";
import ClickableListItem from "../../../components/clickable-list-item";
import FilePreview from "../../../components/file-preview";
import FormCheckbox from "../../../components/form-controls/form-checkbox";
import FormInput from "../../../components/form-controls/form-input";
import FormPhone from "../../../components/form-controls/form-phone";
import FormPicker from "../../../components/form-controls/form-picker";
import Text from "../../../components/text";
import { APPLICATION } from "../../../constants";
import { ERROR_STATUS } from "../../../constants/api";
import { CDN_BASE_URL } from "../../../constants/api-resources";
import { BLOCKER } from "../../../constants/dialog-priorities";
import {
  MIN_ADDRESS_LENGTH,
  MIN_NAME_LENGTH,
  MIN_NIGERIA_PHONE_LENGTH,
  MIN_PLACE_OF_BIRTH_LENGTH,
} from "../../../constants/fields";
import { COLOUR_GREY } from "../../../constants/styles";
import CountriesStatesLga from "../../../fixtures/countries_states_lgas";
import IdentificationTypes from "../../../fixtures/identification_types";
import UploadFileMenu from "../../../fragments/upload-file-menu";
import Onboarding from "../../../services/api/resources/onboarding";
import UserManagement from "../../../services/api/resources/user-management";
import { flashMessage } from "../../../utils/dialog";
import handleErrorResponse from "../../../utils/error-handlers/api";
import { loadData } from "../../../utils/storage";
import styles from "../styles";

export class ContactInformation extends BaseForm {
  requiredFields = [
    "firstName",
    "lastName",
    "phone",
    // 'email'
  ];

  state = {
    applicantDetails: {},
    form: {},
    invalidFields: [],
  };

  userManagement = new UserManagement();

  componentDidMount() {
    loadData(APPLICATION).then((application) => {
      console.log("Destinyyyy:", JSON.stringify(application));
      const applicantDetails = JSON.parse(application).applicantDetails;

      this.setState({
        applicantDetails: applicantDetails,
        form: this.serializeApiData(applicantDetails),
      });
    });
  }

  async checkEmailValidity() {
    // TODO make API Call here
    console.log("MAKING API CALL...");

    const result = await this.userManagement.checkUserExistsOnPassport(
      this.state.form.email
    );

    console.log({ result });

    return result;
  }

  serializeApiData(applicantDetails) {
    return {
      firstName: applicantDetails.firstName,
      lastName: applicantDetails.surname,
      bvn: applicantDetails.bvn,
      middleName: applicantDetails.middleName,
      phone: `${
        applicantDetails.phoneNumber
          ? `0${applicantDetails.phoneNumber.slice(3)}`
          : ""
      }`,
      email: applicantDetails.emailAddress,
      disableFirstName: Boolean(applicantDetails.firstName),
      disableLastName: Boolean(applicantDetails.surname),
      disablePhone: Boolean(applicantDetails.phoneNumber),
      disableEmail: Boolean(applicantDetails.emailAddress),
    };
  }

  serializeFormData() {
    const { firstName, middleName, lastName, phone, email } = this.state.form;

    return {
      firstName,
      middleName,
      surname: lastName,
      phoneNumber: `+234${phone.slice(-10)}`,
      emailAddress: email,
    };
  }

  render() {
    return (
      <React.Fragment>
        <FormInput
          autoCompleteType="name"
          defaultValue={this.state.form.firstName}
          disabled={this.state.form.disableFirstName}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(firstName, isValid) => {
            this.updateFormField({ firstName });
            !isValid
              ? this.addInvalidField("firstName")
              : this.removeInvalidField("firstName");
          }}
          onSubmitEditing={() => {
            this.middleName.focus();
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="First name"
          propagateError={this.props.propagateFormErrors}
          text="First Name:"
          textInputRef={(input) => (this.firstName = input)}
          validators={{
            minLength: MIN_NAME_LENGTH,
            regex: "name",
            required: true,
          }}
        />

        <FormInput
          autoCompleteType="name"
          defaultValue={this.state.form.middleName}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(middleName, isValid) => {
            this.updateFormField({ middleName });
            !isValid
              ? this.addInvalidField("middleName")
              : this.removeInvalidField("middleName");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="Middle name"
          propagateError={this.props.propagateFormErrors}
          onSubmitEditing={() => {
            this.lastName.focus();
          }}
          text="Middle Name:"
          textInputRef={(input) => (this.middleName = input)}
          validators={{
            minLength: MIN_NAME_LENGTH,
            regex: "name",
          }}
        />
        <FormInput
          autoCompleteType="name"
          defaultValue={this.state.form.lastName}
          disabled={this.state.form.disableLastName}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(lastName, isValid) => {
            this.updateFormField({ lastName });
            !isValid
              ? this.addInvalidField("lastName")
              : this.removeInvalidField("lastName");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="Last name"
          propagateError={this.props.propagateFormErrors}
          onSubmitEditing={() => {
            this.phone.focus();
          }}
          text="Last Name:"
          textInputRef={(input) => (this.lastName = input)}
          validators={{
            minLength: MIN_NAME_LENGTH,
            regex: "name",
            required: true,
          }}
        />
        <FormPhone
          autoCompleteType="tel"
          defaultValue={this.state.form.phone}
          disabled={this.state.form.disablePhone}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType="number-pad"
          onChangeText={(phone, isValid) => {
            this.updateFormField({ phone });
            !isValid
              ? this.addInvalidField("phone")
              : this.removeInvalidField("phone");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="Phone number"
          propagateError={this.props.propagateFormErrors}
          onSubmitEditing={() => {
            this.email.focus();
          }}
          text="Phone:"
          textInputRef={(input) => (this.phone = input)}
          validators={{
            length: MIN_NIGERIA_PHONE_LENGTH,
            required: true,
          }}
        />
        <FormInput
          autoCapitalize="none"
          autoCompleteType="email"
          defaultValue={this.state.form.email}
          // disabled={this.state.form.disableEmail}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType="email-address"
          leftIcon="mail"
          onChangeText={(email, isValid) => {
            this.updateFormField({ email });
            !isValid
              ? this.addInvalidField("email")
              : this.removeInvalidField("email");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="Email"
          propagateError={this.props.propagateFormErrors}
          text="Email:"
          textContentType="emailAddress"
          textInputRef={(input) => (this.email = input)}
          validators={{
            email: true,
            required: false,
          }}
        />
      </React.Fragment>
    );
  }
}

export class ResidentialInformation extends BaseForm {
  requiredFields = [
    "nationality",
    "address",
    "state",
    "lga",
    "closestLandmark",
  ];

  constructor() {
    super();

    this.state = {
      applicantDetails: {},
      countries: [],
      form: {},
      invalidFields: [],
      states: [],
      lgas: [],
    };

    this.fetchCountries = this.fetchCountries.bind(this);
    this.onNationalitySelect = this.onNationalitySelect.bind(this);
    this.onStateSelect = this.onStateSelect.bind(this);
  }

  componentDidMount() {
    this.fetchCountries();

    loadData(APPLICATION).then((application) => {
      const applicantDetails = JSON.parse(application).applicantDetails;
      console.log(applicantDetails, "apps");
      this.setState({
        applicantDetails: applicantDetails,
        form: this.serializeApiData(applicantDetails),
      });
    });
  }

  fetchCountries() {
    this.setState({
      countries: CountriesStatesLga.map((value) => ({
        id: value.id,
        name: value.name,
      })),
    });
  }

  serializeApiData(applicantDetails) {
    return {
      address: applicantDetails.address,
      state: applicantDetails.state ? parseInt(applicantDetails.state) : null,
      lga: applicantDetails.localGovernmentArea
        ? parseInt(applicantDetails.localGovernmentArea)
        : null,
      nationality: applicantDetails.nationality
        ? parseInt(applicantDetails.nationality)
        : null,
      closestLandmark: applicantDetails.closestLandMark,
    };
  }

  serializeFormData() {
    const {
      nationality,
      address,
      state,
      lga,
      closestLandmark,
    } = this.state.form;

    return {
      nationality: nationality ? JSON.stringify(nationality) : undefined,
      address,
      state: state ? JSON.stringify(state) : undefined,
      localGovernmentArea: lga ? JSON.stringify(lga) : undefined,
      closestLandMark: closestLandmark,
    };
  }

  onNationalitySelect(nationality) {
    const country = CountriesStatesLga.find((value) => value.id == nationality);

    this.setState({
      states: country
        ? country.states.map((value) => ({
            id: value.id,
            name: value.name,
          }))
        : [],
    });
  }

  onStateSelect(stateId) {
    const country = CountriesStatesLga.find(
      (value) => value.id == this.state.form.nationality
    );

    const state = country.states.find((value) => value.id == stateId);

    this.setState({
      lgas: state ? state.lgas : [],
    });
  }

  render() {
    console.log(this.state);
    return (
      <React.Fragment>
        <FormPicker
          choices={this.state.countries.map(({ id, name }) => ({
            label: name,
            value: id,
          }))}
          defaultValue={this.state.form.nationality}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={(nationality, isValid) => {
            this.updateFormField({ nationality });
            this.onNationalitySelect(nationality);
            !isValid
              ? this.addInvalidField("nationality")
              : this.removeInvalidField("nationality");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          propagateError={this.props.propagateFormErrors}
          text="Nationality:"
          validators={{
            required: true,
          }}
        />

        <FormPicker
          choices={this.state.states.map(({ id, name }) => ({
            label: name,
            value: id,
          }))}
          defaultValue={this.state.form.state ? this.state.form.state : null}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={(state, isValid) => {
            this.updateFormField({ state });
            this.onStateSelect(state);
            !isValid
              ? this.addInvalidField("state")
              : this.removeInvalidField("state");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          propagateError={this.props.propagateFormErrors}
          text="State:"
          validators={{
            required: true,
          }}
        />

        <FormPicker
          choices={this.state.lgas.map(({ id, name }) => ({
            label: name,
            value: id,
          }))}
          defaultValue={this.state.form.lga}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={(lga, isValid) => {
            this.updateFormField({ lga });
            !isValid
              ? this.addInvalidField("lga")
              : this.removeInvalidField("lga");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          propagateError={this.props.propagateFormErrors}
          text="LGA:"
          validators={{
            required: true,
          }}
        />

        <FormInput
          autoCompleteType="street-address"
          defaultValue={this.state.form.address}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(address, isValid) => {
            this.updateFormField({ address });
            !isValid
              ? this.addInvalidField("address")
              : this.removeInvalidField("address");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="House number and street"
          propagateError={this.props.propagateFormErrors}
          text="Address:"
          textInputRef={(input) => (this.address = input)}
          validators={{
            minLength: MIN_ADDRESS_LENGTH,
            regex: "sentence",
            required: true,
          }}
        />

        <FormInput
          autoCompleteType="street-address"
          defaultValue={this.state.form.closestLandmark}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(closestLandmark, isValid) => {
            this.updateFormField({ closestLandmark });
            !isValid
              ? this.addInvalidField("closestLandmark")
              : this.removeInvalidField("closestLandmark");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="Closest landmark"
          propagateError={this.props.propagateFormErrors}
          text="Closest Landmark:"
          textInputRef={(input) => (this.closestLandmark = input)}
          validators={{
            minLength: MIN_ADDRESS_LENGTH,
            regex: "sentence",
            required: true,
          }}
        />
      </React.Fragment>
    );
  }
}

export class PersonalInformation extends BaseForm {
  requiredFields = [
    "gender",
    "placeOfBirth",
    "idType",
    "idNumber",
    "mothersMaidenName",
  ];

  constructor() {
    super();

    this.state = {
      applicantDetails: {},
      countries: [],
      form: {},
      invalidFields: [],
      states: [],
      lgas: [],
    };
  }

  componentDidMount() {
    loadData(APPLICATION).then((application) => {
      const applicantDetails = JSON.parse(application).applicantDetails;

      this.setState({
        applicantDetails: applicantDetails,
        form: this.serializeApiData(applicantDetails, application),
      });
    });
  }

  serializeApiData(applicantDetails, application) {
    return {
      bvn: applicantDetails.bvn,
      gender: applicantDetails.gender,
      idNumber: applicantDetails.identificationNumber,
      idType:
        applicantDetails.identificationType &&
        !isNaN(parseInt(applicantDetails.identificationType))
          ? parseInt(applicantDetails.identificationType)
          : null,
      placeOfBirth: applicantDetails.placeOfBirth,
      mothersMaidenName: applicantDetails.mothersMaidenName,
    };
  }

  serializeFormData() {
    return {
      gender: this.state.form.gender,
      identificationNumber: this.state.form.idNumber,
      identificationType: JSON.stringify(this.state.form.idType),
      placeOfBirth: this.state.form.placeOfBirth,
      bvn: this.state.form.bvn,
      mothersMaidenName: this.state.form.mothersMaidenName,
    };
  }

  render() {
    return (
      <React.Fragment>
        <FormCheckbox
          defaultValue={this.state.form.gender}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          text="Gender:"
          options={["Male", "Female"]}
          onSelect={(gender, isValid) => {
            this.updateFormField({ gender });
            !isValid
              ? this.addInvalidField("gender")
              : this.removeInvalidField("gender");
          }}
          propagateError={this.props.propagateFormErrors}
          validators={{
            required: true,
          }}
        />

        <FormInput
          autoCompleteType="street-address"
          defaultValue={this.state.form.placeOfBirth}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(placeOfBirth, isValid) => {
            this.updateFormField({ placeOfBirth });
            !isValid
              ? this.addInvalidField("placeOfBirth")
              : this.removeInvalidField("placeOfBirth");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="Place of birth"
          propagateError={this.props.propagateFormErrors}
          text="Place of birth:"
          textInputRef={(input) => (this.placeOfBirth = input)}
          validators={{
            minLength: MIN_PLACE_OF_BIRTH_LENGTH,
            regex: "sentence",
            required: true,
          }}
        />

        <FormPicker
          choices={IdentificationTypes.map(({ id, name }) => ({
            label: name,
            value: id,
          }))}
          defaultValue={this.state.form.idType}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={(idType, isValid) => {
            this.updateFormField({ idType });
            !isValid
              ? this.addInvalidField("idType")
              : this.removeInvalidField("idType");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          propagateError={this.props.propagateFormErrors}
          text="ID Type:"
          validators={{
            required: true,
          }}
        />

        <FormInput
          autoCompleteType="id-number"
          defaultValue={this.state.form.idNumber}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          maxLength={30}
          onChangeText={(idNumber, isValid) => {
            this.updateFormField({ idNumber });
            !isValid
              ? this.addInvalidField("idNumber")
              : this.removeInvalidField("idNumber");
          }}
          onSubmitEditing={() => {
            this.bvn.focus();
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="ID Number"
          propagateError={this.props.propagateFormErrors}
          text="ID Number:"
          textInputRef={(input) => (this.idNumber = input)}
          validators={{
            minLength: 7,
            regex: "alphanumeric",
            required: true,
          }}
        />

        <FormInput
          autoCompleteType="street-address"
          defaultValue={this.state.form.mothersMaidenName}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(mothersMaidenName, isValid) => {
            this.updateFormField({ mothersMaidenName });
            !isValid
              ? this.addInvalidField("mothersMaidenName")
              : this.removeInvalidField("mothersMaidenName");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="Your mother's maiden name"
          propagateError={this.props.propagateFormErrors}
          text="Mother's Maiden Name:"
          textInputRef={(input) => (this.mothersMaidenName = input)}
          validators={{
            minLength: MIN_NAME_LENGTH,
            regex: "name",
            required: true,
          }}
        />
      </React.Fragment>
    );
  }
}

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

    this.onAddDocumentClick = this.onAddDocumentClick.bind(this);
    this.onAddFileClick = this.onAddFileClick.bind(this);
    this.onAddImageClick = this.onAddImageClick.bind(this);
    this.removeAttachment = this.removeAttachment.bind(this);
    this.uploadAllDocuments = this.uploadAllDocuments.bind(this);
    this.uploadDocument = this.uploadDocument.bind(this);
  }

  componentDidMount() {
    loadData(APPLICATION).then((response) => {
      const application = JSON.parse(response);
      const isComplete = !application.documentsList
        ? []
        : application.documentsList.filter(
            (value) =>
              this.requiredFiles.includes(value.documentName) ||
              this.requiredFiles.includes(value.documentType)
          ).length === this.requiredFiles.length;

      const attachments = this.serializeApiData(
        application.documentsList || []
      );

      const filesAttached = attachments.map(({ documentType }) => documentType);

      this.setState({
        application,
        attachments,
        filesAttached,
        isComplete,
      });
    });
  }

  getAttachment(documentName) {
    return this.state.attachments.find(
      (value) =>
        value.documentName === documentName ||
        value.documentType === documentName
    );
  }

  async onAddDocumentClick() {
    const documentName = this.documentName;

    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });

      const response = {
        documentName,
        hasBeenUploaded: false,
        fileName: res.name,
        ...res,
      };

      this.state.application.applicationId &&
        this.uploadDocument(response).then((value) => {
          const newFilesAttached = this.state.filesAttached.includes(
            documentName
          )
            ? this.state.filesAttached
            : [...this.state.filesAttached, documentName];

          const isComplete =
            newFilesAttached.filter((value) =>
              this.requiredFiles.includes(value)
            ).length === this.requiredFiles.length;

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
    const documentName = this.documentName;

    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });

      const response = {
        documentName,
        hasBeenUploaded: false,
        fileName: res.name,
        ...res,
      };

      this.state.application.applicationId &&
        this.uploadDocument(response).then((value) => {
          const newFilesAttached = this.state.filesAttached.includes(
            documentName
          )
            ? this.state.filesAttached
            : [...this.state.filesAttached, documentName];

          const isComplete =
            newFilesAttached.filter((value) =>
              this.requiredFiles.includes(value)
            ).length === this.requiredFiles.length;

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
        fileName: value.documentName,
        hasBeenUploaded: true,
        documentName: value.documentType,
        documentType: value.documentType,
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
    if (value.hasBeenUploaded || value.documentId) {
      return;
    }

    const { application } = this.state;
    let attachments = this.state.attachments;
    const attachmentPreview = this.refs[`file-preview-${value.documentName}`];

    attachmentPreview.setState({
      didUploadFail: null,
      isUploadOngoing: true,
    });

    console.log(">>>>> APPLICATION", this.state.application);

    const { code, status, response } = await this.onboarding.documentUpload(
      application.applicationId,
      value.documentName,
      value
    );
    attachmentPreview.setState({
      isUploadOngoing: false,
    });

    attachments = this.state.attachments;

    console.warn("DOCUMENT UPLOAD RESPONSE >>>", status, response, code);

    if (status === ERROR_STATUS) {
      flashMessage("Document Upload", await handleErrorResponse(response), BLOCKER);

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

    console.log({ attachments });

    this.setState({
      attachments,
      isUploadComplete,
    });

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
    const displayedAttachments = [];

    return (
      <React.Fragment>
        <UploadFileMenu
          onAddDocumentClick={this.onAddDocumentClick}
          onAddImageClick={this.onAddImageClick}
          ref_={(menu) => (this.uploadFileMenu = menu)}
          requestClose={() => this.uploadFileMenu.close()}
        />

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
              onPressOut={() => !attachment && this.onAddFileClick(value)}
            >
              <FilePreview
                attachment={attachment}
                name={value}
                onRemove={() => this.removeAttachment(attachment)}
                propagateError={this.props.propagateFormErrors}
                ref={`file-preview-${value}`}
                retry={() => this.uploadDocument(attachment)}
                placeholder
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

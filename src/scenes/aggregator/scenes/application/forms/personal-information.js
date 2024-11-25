import React from "react";

import DocumentPicker from "react-native-document-picker";

import ClickableListItem from "../../../../../components/clickable-list-item";
import FilePreview from "../../../../../components/file-preview";
import FormCheckbox from "../../../../../components/form-controls/form-checkbox";
import FormInput from "../../../../../components/form-controls/form-input";
import FormPicker from "../../../../../components/form-controls/form-picker";
import {
  MIN_ADDRESS_LENGTH,
  MIN_NAME_LENGTH,
  MIN_NIGERIA_PHONE_LENGTH,
  MIN_PLACE_OF_BIRTH_LENGTH,
} from "../../../../../constants/fields";
import BaseForm from "../../../../../components/base-form";
import CountriesStatesLga from "../../../../../fixtures/countries_states_lgas";
import IdentificationTypes from "../../../../../fixtures/identification_types";
import styles from "../styles";
import Text from "../../../../../components/text";
import { COLOUR_GREY } from "../../../../../constants/styles";
import { CDN_BASE_URL } from "../../../../../constants/api-resources";
import FormPhone from "../../../../../components/form-controls/form-phone";
import Onboarding from "../../../../../services/api/resources/onboarding";
import { ERROR_STATUS } from "../../../../../constants/api";
import { formatPhoneNumberToReadable } from "../../../../../utils/formatters";
import UploadFileMenu from "../../../../../fragments/upload-file-menu";
import { flashMessage } from "../../../../../utils/dialog";
import handleErrorResponse from "../../../../../utils/error-handlers/api";
import { BLOCKER } from "../../../../../constants/dialog-priorities";

export class ContactInformation extends BaseForm {
  requiredFields = [
    "firstName",
    "lastName",
    "phone",
    // 'email',
  ];

  state = {
    applicantDetails: {},
    form: {},
    invalidFields: [],
  };

  componentDidMount() {
    const applicantDetails = this.props.application.applicantDetails;

    this.setState({
      applicantDetails: applicantDetails,
      form: this.serializeApiData(applicantDetails),
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.application !== prevProps.application) {
      const { applicantDetails } = this.props.application;
      this.setState({
        applicantDetails,
        form: this.serializeApiData(applicantDetails),
      });
    }
  }

  serializeApiData(applicantDetails) {
    return {
      bvn: applicantDetails.bvn,
      firstName: applicantDetails.firstName,
      lastName: applicantDetails.surname,
      middleName: applicantDetails.middleName,
      phone: `${
        applicantDetails.phoneNumber
          ? formatPhoneNumberToReadable(applicantDetails.phoneNumber)
          : ""
      }`,
      email: applicantDetails.emailAddress,
    };
  }

  serializeFormData() {
    const { firstName, middleName, lastName, phone, email } = this.state.form;

    return {
      firstName,
      middleName,
      surname: lastName,
      phoneNumber: `+234${phone.slice(1)}`,
      emailAddress: email,
    };
  }

  render() {
    return (
      <React.Fragment>
        <FormInput
          autoCompleteType="name"
          defaultValue={this.state.form.firstName}
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
          placeholder="John"
          propagateError={this.props.propagateFormErrors}
          disabled={true}
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
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(lastName, isValid) => {
            this.updateFormField({ lastName });
            !isValid
              ? this.addInvalidField("lastName")
              : this.removeInvalidField("lastName");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="Doe"
          propagateError={this.props.propagateFormErrors}
          onSubmitEditing={() => {
            this.phone.focus();
          }}
          disabled={true}
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
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType="number-pad"
          onChangeText={(phone, isValid) => {
            this.updateFormField({ phone });
            !isValid
              ? this.addInvalidField("phone")
              : this.removeInvalidField("phone");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="08012345678"
          propagateError={this.props.propagateFormErrors}
          onSubmitEditing={() => {
            this.email.focus();
          }}
          disabled={true}
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
          placeholder="johndoe@example.com"
          propagateError={this.props.propagateFormErrors}
          disabled={Boolean(this.state.form.email)}
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

    const { applicantDetails } = this.props.application;

    this.setState({
      applicantDetails,
      form: this.serializeApiData(applicantDetails),
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.application !== prevProps.application) {
      const { application } = this.props;
      this.setState({
        applicantDetails: application.applicantDetails,
        form: this.serializeApiData(application.applicantDetails),
      });
    }
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
          onSubmitEditing={() => {
            this.closestLandmark.focus();
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="1674C, Oko-Awo Rd."
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
    "aggregator",
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
    const { applicantDetails } = this.props.application;

    this.setState({
      applicantDetails,
      form: this.serializeApiData(applicantDetails, this.props.application),
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.application !== prevProps.application) {
      const { application } = this.props;
      this.setState({
        applicantDetails: application.applicantDetails,
        form: this.serializeApiData(application.applicantDetails, application),
      });
    }
  }

  serializeApiData(applicantDetails, application) {
    return {
      aggregator: application.referralCode,
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
      referralCode: this.state.form.aggregator,
      gender: this.state.form.gender,
      identificationNumber: this.state.form.idNumber,
      identificationType: JSON.stringify(this.state.form.idType),
      placeOfBirth: this.state.form.placeOfBirth,
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
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="ID Number"
          propagateError={this.props.propagateFormErrors}
          text="ID Number:"
          textInputRef={(input) => (this.idNumber = input)}
          validators={{
            minLength: 8,
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

        <FormPicker
          choices={this.props.superAgents?.map(
            ({ businessName, referralCode }) => ({
              label: businessName,
              value: referralCode,
            })
          )}
          defaultValue={this.state.form.aggregator}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={(aggregator, isValid) => {
            this.updateFormField({ aggregator });
            !isValid
              ? this.addInvalidField("aggregator")
              : this.removeInvalidField("aggregator");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          propagateError={this.props.propagateFormErrors}
          text={`Aggregator:`}
          validators={{
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
    const { application } = this.props;
    const attachments = this.serializeApiData(application.documentsList || []);
    const filesAttached = attachments
      .map(({ documentType }) => documentType)
      .filter((value) => this.requiredFiles.includes(value));
    const isComplete = !application.documentsList
      ? []
      : application.documentsList.filter(
          (value) =>
            this.requiredFiles.includes(value.documentName) ||
            this.requiredFiles.includes(value.documentType)
        ).length === this.requiredFiles.length;

    this.setState({
      attachments,
      filesAttached,
      isComplete,
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.application !== prevProps.application) {
      const attachments = this.serializeApiData(
        this.props.application.documentsList || []
      );

      this.setState({
        attachments,
      });
    }
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

      this.props.application.applicationId &&
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

      this.props.application.applicationId &&
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
        hasBeenUploaded: true,
        fileName: value.documentName,
        documentName: value.documentType,
        ...value,
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
    const { application } = this.props;
    let attachments = this.state.attachments;

    if (value.hasBeenUploaded) {
      return;
    }

    if (value.documentId) {
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

    const attachmentPreview = this.refs[`file-preview-${value.documentName}`];

    attachmentPreview.setState({
      didUploadFail: null,
      isUploadOngoing: true,
    });

    const { status, response } = await this.onboarding.documentUpload(
      application.applicationId,
      value.documentName,
      value
    );

    attachments = this.state.attachments;

    attachmentPreview.setState({
      isUploadOngoing: false,
    });

    console.log("DOCUMENT UPLOAD RESPONSE >>>", status, response);

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

    this.setState({
      attachments,
      isUploadComplete,
    });

    return value;
  }

  uploadAllDocuments(onCompleteDocumentUpload, onDocumentUploadFailure) {
    const { attachments, isUploadComplete } = this.state;

    uploadedAttachments = attachments.filter((value) => value.hasBeenUploaded);

    const haveAllAttachmentsBeenUploaded = !Boolean(
      attachments.find((value) => value.hasBeenUploaded === false)
    );
    console.log({
      attachments,
      isUploadComplete,
      uploadedAttachments,
      haveAllAttachmentsBeenUploaded,
      raw: attachments.find((value) => value.hasBeenUploaded === false),
    });

    if (isUploadComplete || haveAllAttachmentsBeenUploaded) {
      onCompleteDocumentUpload();
    } else {
      attachments.map((value) =>
        this.uploadDocument(
          value,
          onCompleteDocumentUpload,
          onDocumentUploadFailure
        )
      );
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

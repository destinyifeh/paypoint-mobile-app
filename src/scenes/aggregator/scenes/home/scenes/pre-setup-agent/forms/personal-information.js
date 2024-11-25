import React from "react";
import ImagePicker from "react-native-image-picker";

import BaseForm from "../../../../../../../components/base-form";
import ClickableListItem from "../../../../../../../components/clickable-list-item";
import FilePreview from "../../../../../../../components/file-preview";
import FormCheckbox from "../../../../../../../components/form-controls/form-checkbox";
import FormDate from "../../../../../../../components/form-controls/form-date";
import FormInput from "../../../../../../../components/form-controls/form-input";
import FormPhone from "../../../../../../../components/form-controls/form-phone";
import FormPicker from "../../../../../../../components/form-controls/form-picker";
import Text from "../../../../../../../components/text";
import { ERROR_STATUS } from "../../../../../../../constants/api";
import { CDN_BASE_URL } from "../../../../../../../constants/api-resources";
import {
  BVN_LENGTH,
  MIN_ADDRESS_LENGTH,
  MIN_NAME_LENGTH,
  MIN_NIGERIA_PHONE_LENGTH,
  PAST_DATE
} from "../../../../../../../constants/fields";
import { COLOUR_GREY } from "../../../../../../../constants/styles";
import CountriesStatesLga from "../../../../../../../fixtures/countries_states_lgas";
import IdentificationTypes from "../../../../../../../fixtures/identification_types";
import Onboarding from "../../../../../../../services/api/resources/onboarding";
import { computePastDate } from "../../../../../../../utils/calendar";
import styles from "../styles";

export class ContactInformation extends BaseForm {
  requiredFields = ["firstName", "lastName", "phone", "email"];

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
        form: this.serializeApiData(nextOfKinDetails),
      });
    }
  }

  serializeApiData(applicantDetails) {
    return {
      firstName: applicantDetails.firstName,
      lastName: applicantDetails.surname,
      middleName: applicantDetails.middleName,
      phone: `${applicantDetails.phoneNumber
          ? applicantDetails.phoneNumber.slice(3)
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
          placeholder="Email address"
          propagateError={this.props.propagateFormErrors}
          text="Email:"
          textContentType="emailAddress"
          textInputRef={(input) => (this.email = input)}
          validators={{
            email: true,
            required: true,
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
      applicantDetails: applicantDetails,
      form: this.serializeApiData(applicantDetails),
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.application !== prevProps.application) {
      const { applicantDetails } = this.props.application;

      this.setState({
        applicantDetails,
        form: this.serializeApiData(nextOfKinDetails),
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
    "dateOfBirth",
    "gender",
    "placeOfBirth",
    "idType",
    "idNumber",
    "bvn",
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
    const { applicantDetails } = this.props.application;

    this.setState({
      applicantDetails,
      form: this.serializeApiData(applicantDetails),
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.application !== prevProps.application) {
      const { applicantDetails } = this.props.application;

      this.setState({
        applicantDetails,
        form: this.serializeApiData(nextOfKinDetails),
      });
    }
  }

  serializeApiData(applicantDetails) {
    return {
      dateOfBirth: applicantDetails.dob,
      gender: applicantDetails.gender,
      idNumber: applicantDetails.identificationNumber,
      idType:
        applicantDetails.identificationType &&
          !isNaN(parseInt(applicantDetails.identificationType))
          ? parseInt(applicantDetails.identificationType)
          : null,
      placeOfBirth: applicantDetails.placeOfBirth,
      mothersMaidenName: applicantDetails.mothersMaidenName,
      bvn: applicantDetails.bvn,
    };
  }

  serializeFormData() {
    return {
      dob: this.state.form.dateOfBirth,
      gender: this.state.form.gender,
      identificationNumber: this.state.form.idNumber,
      identificationType: JSON.stringify(this.state.form.idType),
      placeOfBirth: this.state.form.placeOfBirth,
      mothersMaidenName: this.state.form.mothersMaidenName,
      bvn: this.state.form.bvn,
    };
  }

  render() {
    return (
      <React.Fragment>
        <FormDate
          defaultValue={this.state.form.dateOfBirth}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          maxDate={computePastDate(18, "years")}
          minDate={computePastDate(PAST_DATE)}
          onDateSelect={(dateOfBirth, isValid) => {
            this.updateFormField({ dateOfBirth });
            !isValid
              ? this.addInvalidField("dateOfBirth")
              : this.removeInvalidField("dateOfBirth");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="Pick date"
          propagateError={this.props.propagateFormErrors}
          text="Date of Birth:"
          validators={{
            required: true,
          }}
        />

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
          placeholder="Lagos"
          propagateError={this.props.propagateFormErrors}
          text="Place of birth:"
          textInputRef={(input) => (this.placeOfBirth = input)}
          validators={{
            minLength: MIN_ADDRESS_LENGTH,
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
            minLength: 8,
            regex: "alphanumeric",
            required: true,
          }}
        />

        <FormInput
          defaultValue={this.state.form.bvn}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType="number-pad"
          maxLength={BVN_LENGTH}
          onChangeText={(bvn, isValid) => {
            this.updateFormField({ bvn });
            !isValid
              ? this.addInvalidField("bvn")
              : this.removeInvalidField("bvn");
          }}
          onSubmitEditing={() => {
            this.mothersMaidenName.focus();
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="1234567890"
          propagateError={this.props.propagateFormErrors}
          text="BVN:"
          textInputRef={(input) => (this.bvn = input)}
          validators={{
            length: BVN_LENGTH,
            regex: "number",
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
    onCompleteDocumentUpload = () => { },
    onDocumentUploadFailure = () => { }
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

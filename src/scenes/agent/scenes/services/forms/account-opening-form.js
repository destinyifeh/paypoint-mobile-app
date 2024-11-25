import React from "react";

import moment from "moment";
import DocumentPicker from "react-native-document-picker";
import RNFS from "react-native-fs";
import ImagePicker from "react-native-image-picker";

import BaseForm from "../../../../../components/base-form";
import ClickableListItem from "../../../../../components/clickable-list-item";
import FilePreview from "../../../../../components/file-preview";
import FormCheckbox from "../../../../../components/form-controls/form-checkbox";
import FormDate from "../../../../../components/form-controls/form-date";
import FormInput from "../../../../../components/form-controls/form-input";
import FormPhone from "../../../../../components/form-controls/form-phone";
import FormPicker from "../../../../../components/form-controls/form-picker";
import Text from "../../../../../components/text";
import {
  FILE_UPLOAD_LIMIT,
  FILE_UPLOAD_LIMIT_MESSAGE
} from "../../../../../constants";
import { CDN_BASE_URL } from "../../../../../constants/api-resources";
import {
  BVN_LENGTH,
  MIN_ADDRESS_LENGTH,
  MIN_NAME_LENGTH,
  MIN_NIGERIA_PHONE_LENGTH,
  PAST_DATE,
} from "../../../../../constants/fields";
import { COLOUR_GREY } from "../../../../../constants/styles";
import CountriesStatesLga from "../../../../../fixtures/countries_states_lgas";
import { computePastDate } from "../../../../../utils/calendar";
import styles from "../styles";

import { ERROR_STATUS } from "../../../../../constants/api";
import { BLOCKER, CASUAL } from "../../../../../constants/dialog-priorities";
import UploadFileMenu from "../../../../../fragments/upload-file-menu";
import AccountOpening from "../../../../../services/api/resources/account-opening";
import { accountOpeningService } from "../../../../../setup/api";
import { flashMessage } from "../../../../../utils/dialog";
import handleErrorResponse from "../../../../../utils/error-handlers/api";
import { requestWriteExternalStoragePermission } from "../../../../../utils/permission-requester";

const UPLOAD_FILE_TYPES = {
  "Passport Photo": "photo",
  "Signature Specimen": "signature",
};

export class AccountOpeningBankInformation extends BaseForm {
  requiredFields = ["bank"];

  constructor() {
    super();

    this.state = {
      applicantDetails: {},
      bankData: {},
      banks: [],
      form: {},
      invalidFields: [],
    };

    this.onSelectBank = this.onSelectBank.bind(this);
    this.registerAgentOnSanef = this.registerAgentOnSanef.bind(this);
  }

  async loadData() {
    await this.registerAgentOnSanef();
  }

  async registerAgentOnSanef() {
    this.setState({
      isLoading: true,
    });

    const {
      response,
      status,
    } = await accountOpeningService.registerAgentOnSanef();
    console.log("RegisterAgentOnSanef", { response, status });

    this.setState({
      isLoading: false,
    });

    if (status === ERROR_STATUS) {
      this.setState({
        errorMessage: await handleErrorResponse(response),
      });

      return;
    }

    this.setState({
      banks: response.data.bankList,
    });
    console.log({ response: JSON.stringify(response), status });
  }

  onSelectBank(bank) {
    const bankData = this.props.banks.find(
      ({ sanefBankCode }) => sanefBankCode === bank
    );

    const isBvnRequired = bankData.requireBvn;

    if (isBvnRequired) {
      this.requiredFields = [...this.requiredFields, "bvn"];
    } else {
      this.requiredFields = this.requiredFields.filter(
        (item) => item !== "bvn"
      );
    }
  }

  serializeApiData(apiData) {
    return {
      bvn: apiData.BankVerificationNumber,
      bank: apiData.BankCode,
    };
  }

  serializeFormData() {
    const { bank, bvn } = this.state.form;

    return {
      BankCode: bank,
      BankVerificationNumber: bvn,
    };
  }

  render() {
    return (
      <React.Fragment>
        <FormPicker
          choices={this.props.banks.map(({ sanefBankCode, bankName }) => ({
            label: bankName,
            value: sanefBankCode,
          }))}
          defaultValue={this.state.form.bank}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={(bank, isValid) => {
            this.updateFormField({ bank });
            !isValid
              ? this.addInvalidField("bank")
              : this.removeInvalidField("bank");
            this.onSelectBank(bank);
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          propagateError={this.props.propagateFormErrors}
          text="Bank:"
          validators={{
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
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="1234567890"
          propagateError={this.props.propagateFormErrors}
          text="BVN:"
          textInputRef={(input) => (this.bvn = input)}
          validators={{
            length: BVN_LENGTH,
            regex: "number",
            required: this.requiredFields.includes("bvn"),
          }}
        />
      </React.Fragment>
    );
  }
}

export class AccountOpeningContactInformation extends BaseForm {
  requiredFields = ["firstName", "lastName", "phone", "email"];

  state = {
    applicantDetails: {},
    form: {},
    invalidFields: [],
  };

  accountOpening = new AccountOpening();

  componentDidMount() {}

  async checkEmailValidity() {
    // TODO make API Call here
    console.log("MAKING API CALL...");

    const result = await this.userManagement.checkUserExistsOnPassport(
      this.state.form.email
    );

    console.log({ result });

    return result;
  }

  serializeApiData(apiData) {
    return {
      firstName: apiData.FirstName,
      lastName: apiData.LastName,
      middleName: apiData.MiddleName,
      phone: `${apiData.PhoneNumber ? `0${apiData.PhoneNumber.slice(3)}` : ""}`,
      email: apiData.EmailAddress,
    };
  }

  serializeFormData() {
    const { firstName, middleName, lastName, phone, email } = this.state.form;

    return {
      FirstName: firstName,
      LastName: lastName,
      MiddleName: middleName,
      PhoneNumber: phone ? `+234${phone.slice(1)}` : null,
      EmailAddress: email,
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
            this.lastName.focus();
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
          disabled={this.state.form.disableMiddleName}
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
            required: false,
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
          placeholder="Email address"
          propagateError={this.props.propagateFormErrors}
          // showValidIndicator
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

export class AccountOpeningResidentialInformation extends BaseForm {
  requiredFields = [
    "nationality",
    "state",
    "lga",
    "houseNumber",
    "streetName",
    "city",
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
  }

  fetchCountries() {
    this.setState({
      countries: CountriesStatesLga.map((value) => ({
        id: value.id,
        name: value.name,
      })),
    });
  }

  serializeApiData(apiData) {
    return {
      address: apiData.address,
      city: apiData.City,
      houseNumber: apiData.HouseNumber,
      state: apiData.state ? parseInt(apiData.state) : null,
      streetName: apiData.StreetName,
      lga: apiData.LgaCode,
      nationality: apiData.nationality ? parseInt(apiData.nationality) : null,
    };
  }

  serializeFormData() {
    const { city, houseNumber, lga, streetName } = this.state.form;

    return {
      City: city,
      StreetName: streetName,
      HouseNumber: houseNumber,
      LgaCode: lga,
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
          choices={this.state.lgas.map(({ code, name }) => ({
            label: name,
            value: code,
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
          defaultValue={this.state.form.houseNumber}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(houseNumber, isValid) => {
            this.updateFormField({ houseNumber });
            !isValid
              ? this.addInvalidField("houseNumber")
              : this.removeInvalidField("houseNumber");
          }}
          onSubmitEditing={() => {
            this.streetName.focus();
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="1674C"
          propagateError={this.props.propagateFormErrors}
          text="House Number:"
          textInputRef={(input) => (this.houseNumber = input)}
          validators={{
            minLength: 1,
            maxLength: 8,
            regex: "sentence",
            required: true,
          }}
        />

        <FormInput
          autoCompleteType="street-address"
          defaultValue={this.state.form.streetName}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(streetName, isValid) => {
            this.updateFormField({ streetName });
            !isValid
              ? this.addInvalidField("streetName")
              : this.removeInvalidField("streetName");
          }}
          onSubmitEditing={() => {
            this.city.focus();
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="Street Name"
          propagateError={this.props.propagateFormErrors}
          text="Street Name:"
          textInputRef={(input) => (this.streetName = input)}
          validators={{
            minLength: MIN_ADDRESS_LENGTH,
            regex: "sentence",
            required: true,
          }}
        />

        <FormInput
          autoCompleteType="street-address"
          defaultValue={this.state.form.city}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(city, isValid) => {
            this.updateFormField({ city });
            !isValid
              ? this.addInvalidField("city")
              : this.removeInvalidField("city");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="City"
          propagateError={this.props.propagateFormErrors}
          text="City:"
          textInputRef={(input) => (this.city = input)}
          validators={{
            minLength: 3,
            regex: "sentence",
            required: true,
          }}
        />
      </React.Fragment>
    );
  }
}

export class AccountOpeningPersonalInformation extends BaseForm {
  requiredFields = [
    "dateOfBirth",
    "gender",
    // 'bvn',
  ];

  constructor() {
    super();

    this.state = {
      sanefForm: { reference: null }, //'1f1ead3b-33b9-4e96-8'
      applicantDetails: {},
      countries: [],
      form: {},
      invalidFields: [],
      states: [],
      lgas: [],
    };
  }

  componentDidMount() {}

  serializeApiData(apiData) {
    return {
      dateOfBirth: apiData.DateOfBirth
        ? moment(apiData.DateOfBirth, "YYYY-MM-DD").format("DD-MM-YYYY")
        : null,
      gender: apiData.Gender,
    };
  }

  serializeFormData() {
    return {
      DateOfBirth: this.state.form.dateOfBirth
        ? moment(this.state.form.dateOfBirth, "DD-MM-YYYY").format(
            "YYYY-MMM-DD"
          )
        : null,
      Gender: this.state.form.gender,
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
      </React.Fragment>
    );
  }
}

export class AccountOpeningAttachments extends BaseForm {
  requiredFiles = ["Passport Photo", "Signature Specimen"];

  accountOpening = new AccountOpening();

  constructor() {
    super();

    this.state = {
      reference: null,
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

  componentDidMount() {}

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

      this.uploadDocument(response).then((value) => {
        const newFilesAttached = this.state.filesAttached.includes(documentName)
          ? this.state.filesAttached
          : [...this.state.filesAttached, documentName];

        const isComplete =
          newFilesAttached.filter((value) => this.requiredFiles.includes(value))
            .length === this.requiredFiles.length;

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

  async onAddImageClickOld() {
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

      this.uploadDocument(response).then((value) => {
        const newFilesAttached = this.state.filesAttached.includes(documentName)
          ? this.state.filesAttached
          : [...this.state.filesAttached, documentName];

        const isComplete =
          newFilesAttached.filter((value) => this.requiredFiles.includes(value))
            .length === this.requiredFiles.length;

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
    const { sanefForm } = this.state;
    const documentName = this.documentName;

    const options = {
      mediaType: "photo",
      quality: 0.25,
      includeBase64: true,
      saveToPhotos: false,
    };

    await requestWriteExternalStoragePermission();

    ImagePicker.launchImageLibrary(options, (response) => {
      console.log("Response = ", response);

      if (response.fileSize > FILE_UPLOAD_LIMIT) {
        flashMessage(null, FILE_UPLOAD_LIMIT_MESSAGE, CASUAL);

        return;
      }

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        const source = { uri: response.uri };

        const responseData = {
          base64Data: `data:${response.type};base64,${response.data}`,
          documentName,
          hasBeenUploaded: false,
          ...response,
        };

        console.log({ responseData, sanefForm });
        console.log(this.state);

        this.uploadDocument(responseData).then((value) => {
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
            attachments: [...this.state.attachments, responseData],
            filesAttached: newFilesAttached,
            isComplete,
          });
        });
      }
    });

    return;
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
    if (!value.base64Data) {
      const fileBase64 = await RNFS.readFile(value.uri, "base64");
      value.base64Data = `data:${value.type};base64,${fileBase64}`;
    }

    if (value.hasBeenUploaded || value.documentId) {
      return;
    }

    const { onSave, reference } = this.props;

    let attachments = this.state.attachments;
    const attachmentPreview = this.refs[`file-preview-${value.documentName}`];

    attachmentPreview.setState({
      didUploadFail: null,
      isUploadOngoing: true,
    });

    if (!reference) {
      const reference = await onSave();
      reference &&
        this.uploadDocument(
          value,
          onCompleteDocumentUpload,
          onDocumentUploadFailure
        );
      return;
    }

    const {
      code,
      status,
      response,
    } = await accountOpeningService.uploadBase64Image(
      value,
      reference,
      UPLOAD_FILE_TYPES[value.documentName]
    );
    attachmentPreview.setState({
      isUploadOngoing: false,
    });

    attachments = this.state.attachments;

    console.log("DOCUMENT UPLOAD RESPONSE >>>", { status, response, code });

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
          excludeDocuments={true}
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
              onPressOut={() => {
                isValid = this.props.runFormValidation(
                  "There are some errors in the form. Please, scroll through the form, resolve all invalid fields before uploading attachments.",
                  ["ATTACHMENTS"]
                );
                if (!isValid) return;

                !attachment && this.onAddFileClick(value);
              }}
            >
              <FilePreview
                attachment={attachment}
                name={value}
                onRemove={() => this.removeAttachment(attachment)}
                propagateError={this.props.propagateFormErrors}
                placeholder
                ref={`file-preview-${value}`}
                retry={() => this.uploadDocument(attachment)}
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

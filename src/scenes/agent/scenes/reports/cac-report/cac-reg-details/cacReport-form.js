import React from "react";
import { Image, ScrollView, View } from "react-native";
import DocumentPicker from "react-native-document-picker";
import BaseForm from "../../../../../../components/base-form";
import Button from "../../../../../../components/button";
import ClickableListItem from "../../../../../../components/clickable-list-item";
import { FormInput } from "../../../../../../components/form-controls/form-input";
import FormPicker from "../../../../../../components/form-controls/form-picker";
import Text from "../../../../../../components/text";
import { NIGERIA } from "../../../../../../constants";
import { CASUAL } from "../../../../../../constants/dialog-priorities";
import {
  COLOUR_BLACK,
  COLOUR_BLUE,
  COLOUR_WHITE,
} from "../../../../../../constants/styles";
import CountriesStatesLga from "../../../../../../fixtures/countries_states_lgas.json";
import CacRegFilePreview from "../../../../../../fragments/cac-file-preview";
import UploadFileMenu from "../../../../../../fragments/upload-file-menu";
import styles from "../../../../../aggregator/scenes/home/scenes/pre-setup-agent/styles";
import { CacReportBanner } from "./scene";

const COUNTRY = [
  {
    name: "Nigeria",
    value: "Nigeria",
    id: 1,
  },
];
const LINE_OF_BUSINESS = [
  {
    name: "General Merchandise",
    value: "General MerchandiseMale",
  },
  {
    name: "Trading",
    value: "Trading",
  },
  {
    name: "ICT Service",
    value: "ICT Service",
  },
  {
    name: "Data Analysis",
    value: "Data Analysis",
  },
  {
    name: "Poultry/Livestock Farming",
    value: "Poultry/Livestock Farming",
  },
  {
    name: "Crop production farming/Agro allied service",
    value: "Crop production farming/Agro allied service",
  },
  {
    name: "Hair stylist/salon",
    value: "Hair stylist/salon",
  },
  {
    name: "Solar Panel installation",
    value: "Solar Panel installation",
  },
  {
    name: "Digital Marketing",
    value: "Digital Marketing",
  },
  {
    name: "Graphic Design",
    value: "Graphic Design",
  },
  {
    name: "Content Creation",
    value: "Content Creation",
  },
  {
    name: "Web Design",
    value: "Web Design",
  },
  {
    name: "POS Agent",
    value: "POS Agent",
  },
  {
    name: "Fashion design/tailoring",
    value: "Fashion design/tailoring",
  },
  {
    name: "Fashion",
    value: "Fashion",
  },
  {
    name: "pharmacy",
    value: "pharmacy",
  },
];
const UPLOAD_LIMIT = 1048576;
const FILE_UPLOAD_LIMIT_MESSAGE_NEW =
  "The file you uploaded exceeds the file limit of 1MB.";

const FORMTITLES = {
  lineOfBusiness: "lineOfBusiness",
  meansOfId: "meansOfId",
  proprietorCity: "proprietorCity",
  companyCity: "companyCity",
  companyState: "companyState",
  proprietorNationality: "proprietorNationality",
  proprietorState: "proprietorState",
  proprietorFirstname: "proprietorFirstname",
  proprietorOthername: "proprietorOthername",
  proprietorSurname: "proprietorSurname",
  proposedOption1: "proposedOption1",
  proprietorStreetNumber: "proprietorStreetNumber",
  proprietorServiceAddress: "proprietorServiceAddress",
  companyEmail: "companyEmail",
  companyStreetNumber: "companyStreetNumber",
  companyAddress: "companyAddress",
  proprietorPostcode: "proprietorPostcode",
  proprietorLga: "proprietorLga",
  supportingDoc: "supportingDoc",
  passport: "passport",
  signature: "signature",
};
export class CacReportForm extends BaseForm {
  requiredFields = [
    "lineOfBusiness",
    "proprietorCity",
    "companyCity",
    "companyState",
    "proprietorNationality",
    "proprietorState",
    "proprietorFirstname",
    "proprietorSurname",
    "proposedOption1",
    "proprietorStreetNumber",
    "proprietorServiceAddress",
    "companyEmail",
    "companyStreetNumber",
    "companyAddress",
    "proprietorPostcode",
    "proprietorLga",
  ];
  requiredFilesMap = {
    "NIN Slip Image": "MEANS_OF_IDENTIFICATION",
    Signature: "SIGNATURE",
    "Supporting Documents": "SUPPORTING_DOCUMENTS",
  };
  constructor(props) {
    super(props);
    this.state = {
      form: {
        lineOfBusiness: null,
        proprietorCity: null,
        companyCity: null,
        companyState: null,
        proprietorNationality: null,
        proprietorState: null,
        proprietorFirstname: null,
        proprietorSurname: null,
        proposedOption1: null,
        proprietorServiceAddress: null,
        serviceAddress: null,
        companyEmailAddress: null,
        companyStreetNumber: null,
        companyAddress: null,
        proprietorPostcode: null,
        proprietorLga: null,
      },
      invalidFields: [],
      lineOfBusiness: [],
      buttonDisabled: true,
      isLoading: false,
      invalidName: false,
      savedCacBusinessForm: null,
      invalidFields: [],
      states: [],
      proprietorLgas: [],
      countries: [],
      attachments: [],
      filesAttached: [],
      businessDetails: {},
      selectedCountryId: null,
      selectdPropritorStateId: null,
      cacReportdetails: props.cacReportDetails,
      selectdCompanyStateId: null,
      defaultProprietorLgaId: null,
      hasSelfie: true,
      newImage: false,
      queriedFields: {},
      signatureMatched: false,
      meansOfIdMatched: false,
      passportMatched: false,
      supportingDocMatched: false,
      errorCount: this.props.queriedFieldMap?.length,
      queriedFieldsArray: this.props.queriedFieldMap,
    };
    this.onStateSelect = this.onStateSelect.bind(this);
    this.setDefaultProprietorState = this.setDefaultProprietorState.bind(this);
    this.onAddDocumentClick = this.onAddDocumentClick.bind(this);
    this.onAddFileClick = this.onAddFileClick.bind(this);
    this.onAddImageClick = this.onAddImageClick.bind(this);
    this.removeAttachment = this.removeAttachment.bind(this);
    this.uploadDocument = this.uploadDocument.bind(this);
  }

  requiredFiles = [
    "Passport",
    "NIN Slip Image",
    "Signature",
    "Supporting Document",
  ];

  signature = ["signature"];
  meansOfId = ["meansOfId"];
  passport = ["passport"];
  supportingDoc = ["supportingDoc"];

  async componentDidMount() {
    console.log("cacReportDetailsProps", this.state.cacReportdetails);
    this.loadDrefaultFormDetails();
    this.fetchStates();
    this.setDefaultCountryByName("Nigeria");
    this.checkFormValidity();
    this.checkAndSetState(FORMTITLES, this.props.queriedFieldMap);
    // this.checkDocumentLength(this.state.attachments);
  }

  async loadDrefaultFormDetails() {
    if (this.state.cacReportdetails != null) {
      this.setState({
        form: {
          ...this.state.form,
          lineOfBusiness: this.state.cacReportdetails.lineOfBusiness, // Update only the "state" field
          proprietorCity: this.state.cacReportdetails.proprietorCity,
          companyCity: this.state.cacReportdetails.companyCity,
          companyState: this.state.cacReportdetails.companyState,
          proprietorNationality: this.state.cacReportdetails
            .proprietorNationality,
          proprietorState: this.state.cacReportdetails.proprietorState,
          proprietorFirstname: this.state.cacReportdetails.proprietorFirstname,
          proprietorSurname: this.state.cacReportdetails.proprietorSurname,
          proposedOption1: this.state.cacReportdetails.proposedOption1,
          proprietorStreetNumber: this.state.cacReportdetails
            .proprietorStreetNumber,
          proprietorServiceAddress: this.state.cacReportdetails
            .proprietorServiceAddress,
          companyEmail: this.state.cacReportdetails.companyEmail,
          companyStreetNumber: this.state.cacReportdetails.companyStreetNumber,
          companyAddress: this.state.cacReportdetails.companyAddress,
          proprietorPostcode: this.state.cacReportdetails.proprietorPostcode,
          proprietorLga: this.state.cacReportdetails.proprietorLga,
        },
      });
    }
  }

  // Function to check for matches and update the queriedFields object in the state
  checkAndSetState(requestPayload, queriedFieldMap) {
    console.log("QUERIEDFIELDS1", this.state);
    // Create a new object to store matched fields
    let updatedFields = { ...this.state.queriedFields };

    // Loop through the queriedFieldMap
    queriedFieldMap.forEach((field) => {
      const key = field.reason;

      // Check if the key exists in requestPayload
      if (requestPayload.hasOwnProperty(key)) {
        // Add the key to the updatedFields object with value true
        updatedFields[key] = true;
      }
    });

    // Set the updated queriedFields object in the state
    this.setState({ queriedFields: updatedFields }, () => {
      console.log("QUERIEDFIELDS2", this.state);
    });
  }

  clearError = (formTitle) => {
    const newErrorArray = this.state.queriedFieldsArray.filter(
      (obj) => obj.reason !== formTitle
    );
    console.log("newErrorArray", newErrorArray);
    this.setState({
      queriedFieldsArray: newErrorArray,
      errorCount: newErrorArray.length,
    });
  };

  checkDocuments(documentsArray) {
    documentsArray.forEach((document) => {
      switch (document.documentName) {
        case "passport":
          this.setState({ passportMatched: true });
          break;

        case "meansOfId":
          this.setState({ meansOfIdMatched: true });
          break;

        case "signature":
          this.setState({ signatureMatched: true });
          console.log("signatureMatched", this.state.signatureMatched);
          break;

        case "supportingDoc":
          this.setState({ supportingDocMatched: true });
          break;

        default:
          // If no matching document name, keep state as it is
          break;
      }
    });
  }

  setDefaultCountryByName = (countryName) => {
    const defaultCountry = COUNTRY.find(
      (country) => country.name === countryName
    );

    if (defaultCountry) {
      this.setState({ selectedCountryId: defaultCountry.id });
    }
    console.log("selectedCountryId", defaultCountry.id);
  };

  setDefaultProprietorState = (proprietorStateName) => {
    console.log("selectdPropritorStateId2", proprietorStateName);
    console.log("selectdPropritorStateId3", this.state.states);
    const defaultProprietorStateName = this.state.states.find(
      (state) => state.name === proprietorStateName
    );

    if (defaultProprietorStateName) {
      console.log("selectdPropritorStateId4", defaultProprietorStateName.id);
      this.setState({ selectdPropritorStateId: defaultProprietorStateName.id });

      const country = CountriesStatesLga.find((value) => value.name == NIGERIA);

      const state = country.states.find(
        (value) => value.id == defaultProprietorStateName.id
      );
      this.setState(
        {
          proprietorLgas: state ? state.lgas : [],
        },
        () => {
          this.setDefaultProprietorLga(
            this.state.cacReportdetails.proprietorLga
          );
          console.log("STATEID3", this.state.proprietorLgas);
        }
      );
    }
  };

  setDefaultCompanyState = (companyStateName) => {
    console.log("selectdCompnayStateId", companyStateName);

    const defaultCompanyStateName = this.state.states.find(
      (state) => state.name === companyStateName
    );

    if (defaultCompanyStateName) {
      console.log("selectdPropritorStateId4", defaultCompanyStateName.id);
      this.setState({ selectdCompanyStateId: defaultCompanyStateName.id });
    }
  };

  setDefaultProprietorLga = (proprietorLga) => {
    console.log("selectdproprietorLgaId", proprietorLga);
    console.log("selectdproprietorLgaId2", this.state.proprietorLgas);

    const defaultProprietorLgaName = this.state.proprietorLgas.find(
      (state) => state.name === proprietorLga
    );

    if (defaultProprietorLgaName) {
      console.log("selectdPropritorLgaId4", defaultProprietorLgaName.id);
      this.setState({ defaultProprietorLgaId: defaultProprietorLgaName.id });
    }
  };

  onAddFileClick(documentName) {
    this.documentName = documentName;
    this.uploadFileMenu.open();
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
        this.checkDocuments(this.state.attachments);
        // this.checkDocumentLength(this.state.attachments);
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
          newImage: true,
        });
        this.checkDocuments(this.state.attachments);
        // this.checkDocumentLength(this.state.attachments);
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  getAttachment(documentName) {
    return this.state.attachments.find(
      (value) =>
        value.documentName === documentName ||
        value.documentType === documentName
    );
  }

  hasAllRequiredDocs(array) {
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

  checkDocumentLength(docs) {
    const valid = this.checkFormValidity();
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
    this.checkDocuments(this.state.attachments);
    // this.checkDocumentLength(this.state.attachments);

    return value;
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
        // this.checkDocumentLength(this.state.attachments);
        console.log("REMOVED ATTACHMENT", this.state.attachments);
      }
    );

    // this.checkDocumentLength(this.state.attachments);
  }

  checkFormValidity() {
    const formIsComplete = this.state.isComplete;
    const formIsValid = this.state.isValid;
    const formData = this.state.form;
    console.log("VALID REPORT FORM A", formIsValid);
    console.log("VALID REPORT FORM B", formIsComplete);
    console.log("VALID REPORT FORM C", formData);

    if (!(formIsComplete && formIsValid)) {
      this.setState({
        buttonDisabled: true,
      });
      return;
    }
    this.setState({
      buttonDisabled: false,
    });

    console.log("PERSONAL FORM C", this.state.buttonDisabled);

    return true;
  }

  fetchStates() {
    const nigeria = CountriesStatesLga.find((value) => value.name === NIGERIA);
    this.setState(
      {
        states: nigeria.states,
      },
      () => {
        this.setDefaultProprietorState(
          this.state.cacReportdetails.proprietorState
        );
        this.setDefaultCompanyState(this.state.cacReportdetails.companyState);
      }
    );
    console.log("STATES", nigeria.states);
  }

  fetchCountries() {
    this.setState({
      countries: CountriesStatesLga.map((value) => ({
        id: value.id,
        name: value.name,
      })),
    });
  }

  onStateSelect(stateId) {
    console.log("STATEID", stateId);
    const country = CountriesStatesLga.find((value) => value.name == NIGERIA);
    console.log("STATEID2", country);
    const state = country.states.find((value) => value.id == stateId);
    this.setState({
      proprietorLgas: state ? state.lgas : [],
    });
  }

  onCompanyStateSelect(stateId) {
    console.log("STATEID", stateId);
    const country = CountriesStatesLga.find((value) => value.name == NIGERIA);
    console.log("STATEID2", country);
    const state = country.states.find((value) => value.id == stateId);
    this.setState({
      // proprietorLgas: state ? state.lgas : [],
    });
  }

  render() {
    const {
      onPress,
      loading,
      formData,
      buttonTitle,
      showButton,
      queried,
    } = this.props;
    const displayedAttachments = [];

    return (
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
            <View>
              {this.props.queried && (
                <CacReportBanner
                  title={" errors occurred"}
                  bgColor="#FEF6CF"
                  titleColor="#353F50"
                  message={this.state.queriedFieldsArray?.map(
                    (item, index) => item.comment
                  )}
                  messageColor="#5F738C"
                  action={""}
                  actionColor="#AF5F26"
                  count={this.state.errorCount}
                  queriedComment={this.state.queriedFieldsArray}
                />
              )}
            </View>
            <FormPicker
              choices={LINE_OF_BUSINESS.map(({ value, name }) => ({
                label: name,
                value: value,
              }))}
              disabled={this.props.queried ? false : true}
              defaultValue={formData?.lineOfBusiness}
              innerContainerStyle={styles.formInputInnerContainerStyle}
              onSelect={(lineOfBusiness, isValid) => {
                console.log("ERRORLINEBUSINESS", lineOfBusiness);
                this.updateFormField({ lineOfBusiness });
                !isValid
                  ? this.addInvalidField("lineOfBusiness")
                  : this.removeInvalidField("lineOfBusiness");
                this.clearError("lineOfBusiness");
                if (this.state.queriedFields.lineOfBusiness) {
                  this.clearError("lineOfBusiness");
                  this.setState((prevState) => ({
                    queriedFields: {
                      ...prevState.queriedFields,
                      lineOfBusiness: false, // Replace 'newValue' with the actual value you want to set
                    },
                  }));
                }
                this.checkFormValidity();
              }}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              propagateError={this.props.propagateFormErrors}
              // text="Line Of Business"
              text={
                this.state.queriedFields.lineOfBusiness ? (
                  <>
                    {" "}
                    <Text style={{ color: "red" }} bold>
                      Line Of Business
                    </Text>
                  </>
                ) : (
                  <Text style={{ color: COLOUR_BLACK }} bold>
                    Line Of Business
                  </Text>
                )
              }
              validators={{
                required: true,
              }}
            />

            <FormInput
              autoCapitalize="name"
              disabled={this.props.queried ? false : true}
              defaultValue={formData.proprietorCity}
              autoCompleteType="email"
              innerContainerStyle={styles.formInputInnerContainerStyle}
              keyboardType="email-address"
              onChangeText={(proprietorCity, isValid) => {
                this.updateFormField({ proprietorCity });
                !isValid
                  ? this.addInvalidField("proprietorCity")
                  : this.removeInvalidField("proprietorCity");
                if (this.state.queriedFields.proprietorCity) {
                  this.clearError("proprietorCity");
                  this.setState((prevState) => ({
                    queriedFields: {
                      ...prevState.queriedFields,
                      proprietorCity: false, // Replace 'newValue' with the actual value you want to set
                    },
                  }));
                }
                this.checkFormValidity();
              }}
              onSubmitEditing={() => {
                if (this.state.queriedFields.proprietorCity) {
                  this.clearError("proprietorCity");
                  this.setState((prevState) => ({
                    queriedFields: {
                      ...prevState.queriedFields,
                      proprietorCity: false, // Replace 'newValue' with the actual value you want to set
                    },
                  }));
                }

                this.checkFormValidity();
              }}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              placeholder="Placeholder"
              propagateError={this.props.propagateFormErrors}
              showValidIndicator={true}
              // text="Proprietor City"
              text={
                this.state.queriedFields.proprietorCity ? (
                  <>
                    {" "}
                    <Text style={{ color: "red" }} bold>
                      Proprietor City
                    </Text>
                  </>
                ) : (
                  <Text style={{ color: COLOUR_BLACK }} bold>
                    Proprietor City
                  </Text>
                )
              }
              textContentType="emailAddress"
              textInputRef={(input) => (this.proprietorCity = input)}
              validators={{
                required: true,
              }}
              hideOptionalLabel={true}
            />

            <FormInput
              autoCapitalize="name"
              autoCompleteType="email"
              disabled={this.props.queried ? false : true}
              defaultValue={formData.companyCity}
              innerContainerStyle={styles.formInputInnerContainerStyle}
              keyboardType="email-address"
              onChangeText={(companyCity, isValid) => {
                this.updateFormField({ companyCity });
                !isValid
                  ? this.addInvalidField("companyCity")
                  : this.removeInvalidField("companyCity");
                if (this.state.queriedFields.companyCity) {
                  this.clearError("companyCity");
                  this.setState((prevState) => ({
                    queriedFields: {
                      ...prevState.queriedFields,
                      companyCity: false, // Replace 'newValue' with the actual value you want to set
                    },
                  }));
                }
                this.checkFormValidity();
              }}
              onSubmitEditing={() => {
                if (this.state.queriedFields.companyCity) {
                  this.clearError("companyCity");
                  this.setState((prevState) => ({
                    queriedFields: {
                      ...prevState.queriedFields,
                      companyCity: false, // Replace 'newValue' with the actual value you want to set
                    },
                  }));
                }
                this.checkFormValidity();
              }}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              placeholder="Placeholder"
              propagateError={this.props.propagateFormErrors}
              showValidIndicator={true}
              // text="Company City"
              text={
                this.state.queriedFields.companyCity ? (
                  <>
                    {" "}
                    <Text style={{ color: "red" }} bold>
                      Company City
                    </Text>
                  </>
                ) : (
                  <Text style={{ color: COLOUR_BLACK }} bold>
                    Company City
                  </Text>
                )
              }
              textContentType="emailAddress"
              textInputRef={(input) => (this.companyCity = input)}
              validators={{
                required: true,
              }}
              hideOptionalLabel={true}
            />

            <FormPicker
              choices={this.state.states.map(({ id, name }) => ({
                label: name,
                value: id,
              }))}
              disabled={this.props.queried ? false : true}
              defaultValue={this.state.selectdCompanyStateId}
              innerContainerStyle={styles.formInputInnerContainerStyle}
              onSelect={(companyState, isValid) => {
                this.updateFormField({ companyState });
                this.onCompanyStateSelect(companyState);
                !isValid
                  ? this.addInvalidField("companyState")
                  : this.removeInvalidField("companyState");
                if (this.state.queriedFields.companyState) {
                  this.clearError("companyState");
                  this.setState((prevState) => ({
                    queriedFields: {
                      ...prevState.queriedFields,
                      companyState: false, // Replace 'newValue' with the actual value you want to set
                    },
                  }));
                }
                this.checkFormValidity();
              }}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              propagateError={this.props.propagateFormErrors}
              text={
                this.state.queriedFields.companyState ? (
                  <>
                    {" "}
                    <Text style={{ color: "red" }} bold>
                      Company State
                    </Text>
                  </>
                ) : (
                  <Text style={{ color: COLOUR_BLACK }} bold>
                    Company State
                  </Text>
                )
              }
              validators={{
                required: true,
              }}
            />

            <FormPicker
              choices={COUNTRY.map(({ id, name }) => ({
                label: name,
                value: id,
              }))}
              disabled={this.props.queried ? false : true}
              defaultValue={this.state.selectedCountryId}
              innerContainerStyle={styles.formInputInnerContainerStyle}
              onSelect={(proprietorNationality, isValid) => {
                this.updateFormField({ proprietorNationality });
                !isValid
                  ? this.addInvalidField("proprietorNationality")
                  : this.removeInvalidField("proprietorNationality");
                if (this.state.queriedFields.proprietorNationality) {
                  this.clearError("proprietorNationality");
                  this.setState((prevState) => ({
                    queriedFields: {
                      ...prevState.queriedFields,
                      proprietorNationality: false, // Replace 'newValue' with the actual value you want to set
                    },
                  }));
                }
                this.checkFormValidity();
              }}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              propagateError={this.props.propagateFormErrors}
              // text="Proprietor Nationality"
              text={
                this.state.queriedFields.proprietorNationality ? (
                  <>
                    {" "}
                    <Text style={{ color: "red" }} bold>
                      Proprietor Nationality
                    </Text>
                  </>
                ) : (
                  <Text style={{ color: COLOUR_BLACK }} bold>
                    Proprietor Nationality
                  </Text>
                )
              }
              validators={{
                required: true,
              }}
            />

            <FormPicker
              choices={this.state.states?.map(({ id, name }) => ({
                label: name,
                value: id,
              }))}
              disabled={this.props.queried ? false : true}
              defaultValue={this.state.selectdPropritorStateId}
              innerContainerStyle={styles.formInputInnerContainerStyle}
              onSelect={(proprietorState, isValid) => {
                this.updateFormField({ proprietorState });
                this.onStateSelect(proprietorState);
                if (this.state.queriedFields.proprietorState) {
                  this.clearError("proprietorState");
                  this.setState((prevState) => ({
                    queriedFields: {
                      ...prevState.queriedFields,
                      proprietorState: false, // Replace 'newValue' with the actual value you want to set
                    },
                  }));
                }

                !isValid
                  ? this.addInvalidField("proprietorState")
                  : this.removeInvalidField("proprietorState");
                this.checkFormValidity();
              }}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              propagateError={this.props.propagateFormErrors}
              // text="Proprietor State"
              text={
                this.state.queriedFields.proprietorState ? (
                  <>
                    {" "}
                    <Text style={{ color: "red" }} bold>
                      Proprietor State
                    </Text>
                  </>
                ) : (
                  <Text style={{ color: COLOUR_BLACK }} bold>
                    Proprietor State
                  </Text>
                )
              }
              validators={{
                required: true,
              }}
            />

            <FormInput
              autoCapitalize="name"
              disabled={this.props.queried ? false : true}
              defaultValue={formData.proprietorFirstname}
              autoCompleteType="email"
              innerContainerStyle={styles.formInputInnerContainerStyle}
              keyboardType="email-address"
              onChangeText={(proprietorFirstname, isValid) => {
                this.updateFormField({ proprietorFirstname });
                !isValid
                  ? this.addInvalidField("proprietorFirstname")
                  : this.removeInvalidField("proprietorFirstname");
                if (this.state.queriedFields.proprietorFirstname) {
                  this.clearError("proprietorFirstname");
                  this.setState((prevState) => ({
                    queriedFields: {
                      ...prevState.queriedFields,
                      proprietorFirstname: false, // Replace 'newValue' with the actual value you want to set
                    },
                  }));
                }
                this.checkFormValidity();
              }}
              onSubmitEditing={() => {
                if (this.state.queriedFields.proprietorFirstname) {
                  this.clearError("proprietorFirstname");
                  this.setState((prevState) => ({
                    queriedFields: {
                      ...prevState.queriedFields,
                      proprietorFirstname: false, // Replace 'newValue' with the actual value you want to set
                    },
                  }));
                }
                this.checkFormValidity();
              }}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              placeholder="Placeholder"
              propagateError={this.props.propagateFormErrors}
              showValidIndicator={true}
              // text="Proprietor First Name"
              text={
                this.state.queriedFields.proprietorFirstname ? (
                  <>
                    {" "}
                    <Text style={{ color: "red" }} bold>
                      Proprietor First Name
                    </Text>
                  </>
                ) : (
                  <Text style={{ color: COLOUR_BLACK }} bold>
                    Proprietor First Name
                  </Text>
                )
              }
              textContentType="emailAddress"
              textInputRef={(input) => (this.proprietorFirstname = input)}
              validators={{
                required: true,
              }}
              hideOptionalLabel={true}
            />

            <FormInput
              autoCapitalize="name"
              autoCompleteType="email"
              defaultValue={formData.proprietorOthername}
              disabled={this.props.queried ? false : true}
              innerContainerStyle={styles.formInputInnerContainerStyle}
              keyboardType="email-address"
              onChangeText={(proprietorOthername, isValid) => {
                this.updateFormField({ proprietorOthername });
                !isValid
                  ? this.addInvalidField("proprietorOthername")
                  : this.removeInvalidField("proprietorOthername");
                if (this.state.queriedFields.proprietorOthername) {
                  this.clearError("proprietorOthername");
                  this.setState((prevState) => ({
                    queriedFields: {
                      ...prevState.queriedFields,
                      proprietorOthername: false, // Replace 'newValue' with the actual value you want to set
                    },
                  }));
                }
                this.checkFormValidity();
              }}
              onSubmitEditing={() => {
                if (this.state.queriedFields.proprietorOthername) {
                  this.clearError("proprietorOthername");
                  this.setState((prevState) => ({
                    queriedFields: {
                      ...prevState.queriedFields,
                      proprietorOthername: false, // Replace 'newValue' with the actual value you want to set
                    },
                  }));
                }
                this.checkFormValidity();
              }}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              placeholder="Placeholder"
              propagateError={this.props.propagateFormErrors}
              showValidIndicator={true}
              // text="Proprietor Other Name"
              text={
                this.state.queriedFields.proprietorOthername ? (
                  <>
                    {" "}
                    <Text style={{ color: "red" }} bold>
                      Proprietor Other Name
                    </Text>
                  </>
                ) : (
                  <Text style={{ color: COLOUR_BLACK }} bold>
                    Proprietor Other Name
                  </Text>
                )
              }
              textContentType="emailAddress"
              textInputRef={(input) => (this.proprietorOthername = input)}
              validators={{
                required: true,
              }}
              hideOptionalLabel={true}
            />

            <FormInput
              autoCapitalize="name"
              autoCompleteType="email"
              defaultValue={formData.proprietorSurname}
              disabled={this.props.queried ? false : true}
              innerContainerStyle={styles.formInputInnerContainerStyle}
              keyboardType="email-address"
              onChangeText={(proprietorSurname, isValid) => {
                this.updateFormField({ proprietorSurname });
                !isValid
                  ? this.addInvalidField("proprietorSurname")
                  : this.removeInvalidField("proprietorSurname");
                if (this.state.queriedFields.proprietorSurname) {
                  this.clearError("proprietorSurname");
                  this.setState((prevState) => ({
                    queriedFields: {
                      ...prevState.queriedFields,
                      proprietorSurname: false, // Replace 'newValue' with the actual value you want to set
                    },
                  }));
                }
                this.checkFormValidity();
              }}
              onSubmitEditing={() => {
                if (this.state.queriedFields.proprietorSurname) {
                  this.clearError("proprietorSurname");
                  this.setState((prevState) => ({
                    queriedFields: {
                      ...prevState.queriedFields,
                      proprietorSurname: false, // Replace 'newValue' with the actual value you want to set
                    },
                  }));
                }
                this.checkFormValidity();
              }}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              placeholder="Placeholder"
              propagateError={this.props.propagateFormErrors}
              showValidIndicator={true}
              // text="Proprietor Surname"
              text={
                this.state.queriedFields.proprietorSurname ? (
                  <>
                    {" "}
                    <Text style={{ color: "red" }} bold>
                      Proprietor Surname
                    </Text>
                  </>
                ) : (
                  <Text style={{ color: COLOUR_BLACK }} bold>
                    Proprietor Surname
                  </Text>
                )
              }
              textContentType="emailAddress"
              textInputRef={(input) => (this.proprietorSurname = input)}
              validators={{
                required: true,
              }}
              hideOptionalLabel={true}
            />

            <FormInput
              autoCapitalize="name"
              autoCompleteType="email"
              defaultValue={formData.proposedOption1}
              disabled={this.props.queried ? false : true}
              innerContainerStyle={styles.formInputInnerContainerStyle}
              keyboardType="email-address"
              onChangeText={(proposedOption1, isValid) => {
                this.updateFormField({ proposedOption1 });
                !isValid
                  ? this.addInvalidField("proposedOption1")
                  : this.removeInvalidField("proposedOption1");
                if (this.state.queriedFields.proposedOption1) {
                  this.clearError("proposedOption1");
                  this.setState((prevState) => ({
                    queriedFields: {
                      ...prevState.queriedFields,
                      proposedOption1: false, // Replace 'newValue' with the actual value you want to set
                    },
                  }));
                }
                this.checkFormValidity();
              }}
              onSubmitEditing={() => {
                if (this.state.queriedFields.proposedOption1) {
                  this.clearError("proposedOption1");
                  this.setState((prevState) => ({
                    queriedFields: {
                      ...prevState.queriedFields,
                      proposedOption1: false, // Replace 'newValue' with the actual value you want to set
                    },
                  }));
                }
                this.checkFormValidity();
              }}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              placeholder="Placeholder"
              propagateError={this.props.propagateFormErrors}
              showValidIndicator={true}
              // text="Proposed Option1"
              text={
                this.state.queriedFields.proposedOption1 ? (
                  <>
                    {" "}
                    <Text style={{ color: "red" }} bold>
                      Proposed Option1
                    </Text>
                  </>
                ) : (
                  <Text style={{ color: COLOUR_BLACK }} bold>
                    Proposed Option1
                  </Text>
                )
              }
              textContentType="emailAddress"
              textInputRef={(input) => (this.proposedOption1 = input)}
              validators={{
                required: true,
              }}
              hideOptionalLabel={true}
            />

            <FormInput
              autoCapitalize="name"
              autoCompleteType="email"
              disabled={this.props.queried ? false : true}
              defaultValue={formData.proprietorStreetNumber}
              innerContainerStyle={styles.formInputInnerContainerStyle}
              keyboardType="email-address"
              onChangeText={(proprietorStreetNumber, isValid) => {
                this.updateFormField({ proprietorStreetNumber });
                !isValid
                  ? this.addInvalidField("proprietorStreetNumber")
                  : this.removeInvalidField("proprietorStreetNumber");
                if (this.state.queriedFields.proprietorStreetNumber) {
                  this.clearError("proprietorStreetNumber");
                  this.setState((prevState) => ({
                    queriedFields: {
                      ...prevState.queriedFields,
                      proprietorStreetNumber: false, // Replace 'newValue' with the actual value you want to set
                    },
                  }));
                }
                this.checkFormValidity();
              }}
              onSubmitEditing={() => {
                if (this.state.queriedFields.proprietorStreetNumber) {
                  this.clearError("proprietorStreetNumber");
                  this.setState((prevState) => ({
                    queriedFields: {
                      ...prevState.queriedFields,
                      proprietorStreetNumber: false, // Replace 'newValue' with the actual value you want to set
                    },
                  }));
                }
                this.checkFormValidity();
              }}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              placeholder="Placeholder"
              propagateError={this.props.propagateFormErrors}
              showValidIndicator={true}
              // text="Proprietor Street Number"
              text={
                this.state.queriedFields.proprietorStreetNumber ? (
                  <>
                    {" "}
                    <Text style={{ color: "red" }} bold>
                      Proprietor Street Number
                    </Text>
                  </>
                ) : (
                  <Text style={{ color: COLOUR_BLACK }} bold>
                    Proprietor Street Number
                  </Text>
                )
              }
              textContentType="emailAddress"
              textInputRef={(input) => (this.proprietorStreetNumber = input)}
              validators={{
                required: true,
              }}
              hideOptionalLabel={true}
            />

            <FormInput
              autoCapitalize="name"
              autoCompleteType="email"
              disabled={this.props.queried ? false : true}
              defaultValue={formData.proprietorServiceAddress}
              innerContainerStyle={styles.formInputInnerContainerStyle}
              keyboardType="email-address"
              onChangeText={(proprietorServiceAddress, isValid) => {
                this.updateFormField({ proprietorServiceAddress });
                !isValid
                  ? this.addInvalidField("proprietorServiceAddress")
                  : this.removeInvalidField("proprietorServiceAddress");
                if (this.state.queriedFields.proprietorServiceAddress) {
                  this.clearError("proprietorServiceAddress");
                  this.setState((prevState) => ({
                    queriedFields: {
                      ...prevState.queriedFields,
                      proprietorServiceAddress: false, // Replace 'newValue' with the actual value you want to set
                    },
                  }));
                }
                this.checkFormValidity();
              }}
              onSubmitEditing={() => {
                if (this.state.queriedFields.proprietorServiceAddress) {
                  this.clearError("proprietorServiceAddress");
                  this.setState((prevState) => ({
                    queriedFields: {
                      ...prevState.queriedFields,
                      proprietorServiceAddress: false, // Replace 'newValue' with the actual value you want to set
                    },
                  }));
                }
                this.checkFormValidity();
              }}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              placeholder="Placeholder"
              propagateError={this.props.propagateFormErrors}
              showValidIndicator={true}
              // text="Proprietor Service Address"
              text={
                this.state.queriedFields.proprietorServiceAddress ? (
                  <>
                    {" "}
                    <Text style={{ color: "red" }} bold>
                      Proprietor Service Address
                    </Text>
                  </>
                ) : (
                  <Text style={{ color: COLOUR_BLACK }} bold>
                    Proprietor Service Address
                  </Text>
                )
              }
              textContentType="emailAddress"
              textInputRef={(input) => (this.proprietorServiceAddress = input)}
              validators={{
                required: true,
              }}
              hideOptionalLabel={true}
            />

            <FormInput
              autoCapitalize="name"
              autoCompleteType="email"
              disabled={this.props.queried ? false : true}
              defaultValue={formData.companyEmail}
              innerContainerStyle={styles.formInputInnerContainerStyle}
              keyboardType="email-address"
              onChangeText={(companyEmail, isValid) => {
                this.updateFormField({ companyEmail });
                !isValid
                  ? this.addInvalidField("companyEmail")
                  : this.removeInvalidField("companyEmail");
                if (this.state.queriedFields.companyEmail) {
                  this.clearError("companyEmail");
                  this.setState((prevState) => ({
                    queriedFields: {
                      ...prevState.queriedFields,
                      companyEmail: false, // Replace 'newValue' with the actual value you want to set
                    },
                  }));
                }
                this.checkFormValidity();
              }}
              onSubmitEditing={() => {
                if (this.state.queriedFields.companyEmail) {
                  this.clearError("companyEmail");
                  this.setState((prevState) => ({
                    queriedFields: {
                      ...prevState.queriedFields,
                      companyEmail: false, // Replace 'newValue' with the actual value you want to set
                    },
                  }));
                }
                this.checkFormValidity();
              }}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              placeholder="Placeholder"
              propagateError={this.props.propagateFormErrors}
              showValidIndicator={true}
              // text="Company Email Address"
              text={
                this.state.queriedFields.companyEmail ? (
                  <>
                    {" "}
                    <Text style={{ color: "red" }} bold>
                      Company Email Address
                    </Text>
                  </>
                ) : (
                  <Text style={{ color: COLOUR_BLACK }} bold>
                    Company Email Address
                  </Text>
                )
              }
              textContentType="emailAddress"
              textInputRef={(input) => (this.companyEmail = input)}
              validators={{
                required: true,
                email: true,
              }}
              hideOptionalLabel={true}
            />

            <FormInput
              autoCapitalize="name"
              // disabled={true}
              disabled={this.props.queried ? false : true}
              autoCompleteType="email"
              defaultValue={formData.companyStreetNumber}
              innerContainerStyle={styles.formInputInnerContainerStyle}
              keyboardType="email-address"
              onChangeText={(companyStreetNumber, isValid) => {
                this.updateFormField({ companyStreetNumber });
                !isValid
                  ? this.addInvalidField("companyStreetNumber")
                  : this.removeInvalidField("companyStreetNumber");
                if (this.state.queriedFields.companyStreetNumber) {
                  this.clearError("companyStreetNumber");
                  this.setState((prevState) => ({
                    queriedFields: {
                      ...prevState.queriedFields,
                      companyStreetNumber: false, // Replace 'newValue' with the actual value you want to set
                    },
                  }));
                }
                this.checkFormValidity();
              }}
              onSubmitEditing={() => {
                if (this.state.queriedFields.companyStreetNumber) {
                  this.clearError("companyStreetNumber");
                  this.setState((prevState) => ({
                    queriedFields: {
                      ...prevState.queriedFields,
                      companyStreetNumber: false, // Replace 'newValue' with the actual value you want to set
                    },
                  }));
                }
                this.checkFormValidity();
              }}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              placeholder="Placeholder"
              propagateError={this.props.propagateFormErrors}
              showValidIndicator={true}
              // text="Company Street Number"
              text={
                this.state.queriedFields.companyStreetNumber ? (
                  <>
                    {" "}
                    <Text style={{ color: "red" }} bold>
                      Company Street Number
                    </Text>
                  </>
                ) : (
                  <Text style={{ color: COLOUR_BLACK }} bold>
                    Company Street Number
                  </Text>
                )
              }
              textContentType="emailAddress"
              textInputRef={(input) => (this.companyStreetNumber = input)}
              validators={{
                required: true,
              }}
              hideOptionalLabel={true}
            />

            <FormInput
              autoCapitalize="name"
              // disabled={true}
              disabled={this.props.queried ? false : true}
              autoCompleteType="email"
              defaultValue={formData.companyAddress}
              innerContainerStyle={styles.formInputInnerContainerStyle}
              keyboardType="email-address"
              onChangeText={(companyAddress, isValid) => {
                this.updateFormField({ companyAddress });
                !isValid
                  ? this.addInvalidField("companyAddress")
                  : this.removeInvalidField("companyAddress");
                if (this.state.queriedFields.companyAddress) {
                  this.clearError("companyAddress");
                  this.setState((prevState) => ({
                    queriedFields: {
                      ...prevState.queriedFields,
                      companyAddress: false, // Replace 'newValue' with the actual value you want to set
                    },
                  }));
                }
                this.checkFormValidity();
              }}
              onSubmitEditing={() => {
                if (this.state.queriedFields.companyAddress) {
                  this.clearError("companyAddress");
                  this.setState((prevState) => ({
                    queriedFields: {
                      ...prevState.queriedFields,
                      companyAddress: false, // Replace 'newValue' with the actual value you want to set
                    },
                  }));
                }
                this.checkFormValidity();
              }}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              placeholder="Placeholder"
              propagateError={this.props.propagateFormErrors}
              showValidIndicator={true}
              // text="Company Address"
              text={
                this.state.queriedFields.companyAddress ? (
                  <>
                    {" "}
                    <Text style={{ color: "red" }} bold>
                      Company Address
                    </Text>
                  </>
                ) : (
                  <Text style={{ color: COLOUR_BLACK }} bold>
                    Company Address
                  </Text>
                )
              }
              textContentType="emailAddress"
              textInputRef={(input) => (this.companyAddress = input)}
              validators={{
                required: true,
              }}
              hideOptionalLabel={true}
            />

            <FormInput
              autoCapitalize="name"
              // disabled={true}
              disabled={this.props.queried ? false : true}
              autoCompleteType="email"
              defaultValue={formData.proprietorPostcode}
              innerContainerStyle={styles.formInputInnerContainerStyle}
              keyboardType="number-pad"
              onChangeText={(proprietorPostcode, isValid) => {
                this.updateFormField({ proprietorPostcode });
                !isValid
                  ? this.addInvalidField("proprietorPostcode")
                  : this.removeInvalidField("proprietorPostcode");
                if (this.state.queriedFields.proprietorPostcode) {
                  this.clearError("proprietorPostcode");
                  this.setState((prevState) => ({
                    queriedFields: {
                      ...prevState.queriedFields,
                      proprietorPostcode: false, // Replace 'newValue' with the actual value you want to set
                    },
                  }));
                }
                this.checkFormValidity();
              }}
              onSubmitEditing={() => {
                if (this.state.queriedFields.proprietorPostcode) {
                  this.clearError("proprietorPostcode");
                  this.setState((prevState) => ({
                    queriedFields: {
                      ...prevState.queriedFields,
                      proprietorPostcode: false, // Replace 'newValue' with the actual value you want to set
                    },
                  }));
                }
                this.checkFormValidity();
              }}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              placeholder="Placeholder"
              propagateError={this.props.propagateFormErrors}
              showValidIndicator={true}
              // text="Proprietor Postal Code"
              text={
                this.state.queriedFields.proprietorPostcode ? (
                  <>
                    {" "}
                    <Text style={{ color: "red" }} bold>
                      Proprietor Postal Code
                    </Text>
                  </>
                ) : (
                  <Text style={{ color: COLOUR_BLACK }} bold>
                    Proprietor Postal Code
                  </Text>
                )
              }
              textContentType="emailAddress"
              textInputRef={(input) => (this.proprietorPostcode = input)}
              validators={{
                required: true,
                length: [6, 6],
              }}
              hideOptionalLabel={true}
            />

            <FormPicker
              choices={this.state.proprietorLgas?.map(({ id, name }) => ({
                label: name,
                value: id,
              }))}
              disabled={this.props.queried ? false : true}
              defaultValue={this.state.defaultProprietorLgaId}
              innerContainerStyle={styles.formInputInnerContainerStyle}
              onSelect={(proprietorLga, isValid) => {
                this.updateFormField({ proprietorLga });
                !isValid
                  ? this.addInvalidField("proprietorLga")
                  : this.removeInvalidField("proprietorLga");
                if (this.state.queriedFields.proprietorLga) {
                  this.clearError("proprietorLga");
                  this.setState((prevState) => ({
                    queriedFields: {
                      ...prevState.queriedFields,
                      proprietorLga: false, // Replace 'newValue' with the actual value you want to set
                    },
                  }));
                }
                this.checkFormValidity();
              }}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              propagateError={this.props.propagateFormErrors}
              // text="Proprietor LGA"
              text={
                this.state.queriedFields.proprietorLga ? (
                  <>
                    {" "}
                    <Text style={{ color: "red" }} bold>
                      Proprietor LGA
                    </Text>
                  </>
                ) : (
                  <Text style={{ color: COLOUR_BLACK }} bold>
                    Proprietor LGA
                  </Text>
                )
              }
              validators={{
                required: true,
              }}
            />

            <UploadFileMenu
              onAddDocumentClick={this.onAddDocumentClick}
              onAddImageClick={this.onAddImageClick}
              ref_={(menu) => (this.uploadFileMenu = menu)}
              requestClose={() => this.uploadFileMenu.close()}
            />
            {/* SIGNATURE */}

            {!this.state.signatureMatched && (
              <View style={{ marginBottom: 15 }}>
                <View style={{ marginVertical: 10 }}>
                  {this.state.queriedFields.signature ? (
                    <Text style={{ color: "red" }} bold>
                      Signature
                    </Text>
                  ) : (
                    <Text bold>Signature</Text>
                  )}
                </View>

                {!this.state.queriedFields.signature && !formData.signature ? (
                  <Text>No Image</Text>
                ) : (
                  <Image
                    source={{ uri: formData.signature }}
                    style={{
                      height: 131,
                      width: 98,
                    }}
                  />
                )}
              </View>
            )}

            {this.state.queriedFields.signature || this.props.queried ? (
              this.signature.map((value, index) => {
                const attachment = this.getAttachment(value);
                attachment && displayedAttachments.push(attachment);
                console.log("ATTACHMENTSOFT2", displayedAttachments);

                return (
                  <ClickableListItem
                    key={index}
                    onPressOut={() => {
                      if (this.state.queriedFields.signature) {
                        this.clearError("signature");
                        this.setState((prevState) => ({
                          queriedFields: {
                            ...prevState.queriedFields,
                            signature: false, // Replace 'newValue' with the actual value you want to set
                          },
                        }));
                      }
                      !attachment && this.onAddFileClick(value);
                    }}
                  >
                    <CacRegFilePreview
                      attachment={attachment}
                      name={
                        this.state.queriedFields.signature ? (
                          <>
                            {" "}
                            <Text style={{ color: "red" }} bold>
                              Signature
                            </Text>
                          </>
                        ) : (
                          <Text bold>Signature</Text>
                        )
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
                );
              })
            ) : (
              <></>
            )}

            {/* meansOfId */}
            {!this.state.meansOfIdMatched && (
              <View style={{ marginBottom: 15 }}>
                <View style={{ marginVertical: 10 }}>
                  {this.state.queriedFields.meansOfId ? (
                    <Text style={{ color: "red" }} bold>
                      Means of ID
                    </Text>
                  ) : (
                    <Text bold>Means of ID</Text>
                  )}
                </View>

                {!this.state.queriedFields.meansOfId && !formData.signature ? (
                  <Text>No Image</Text>
                ) : (
                  <Image
                    source={{ uri: formData.meansOfId }}
                    style={{
                      height: 131,
                      width: 98,
                    }}
                  />
                )}
              </View>
            )}

            {this.state.queriedFields.meansOfId || this.props.queried ? (
              this.meansOfId.map((value, index) => {
                const attachment = this.getAttachment(value);

                attachment && displayedAttachments.push(attachment);

                console.log("ATTACHMENTSOFT2", displayedAttachments);

                return (
                  <ClickableListItem
                    key={index}
                    onPressOut={() => {
                      if (this.state.queriedFields.meansOfId) {
                        this.clearError("meansOfId");
                        this.setState((prevState) => ({
                          queriedFields: {
                            ...prevState.queriedFields,
                            meansOfId: false, // Replace 'newValue' with the actual value you want to set
                          },
                        }));
                      }
                      !attachment && this.onAddFileClick(value);
                    }}
                  >
                    <CacRegFilePreview
                      attachment={attachment}
                      name={
                        this.state.queriedFields.meansOfId ? (
                          <>
                            {" "}
                            <Text style={{ color: "red" }} bold>
                              NIN Slip Image
                            </Text>
                          </>
                        ) : (
                          <Text bold>NIN Slip Image</Text>
                        )
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
                );
              })
            ) : (
              <></>
            )}

            {/* passport */}
            {!this.state.passportMatched && (
              <View style={{ marginBottom: 15 }}>
                <View style={{ marginVertical: 10 }}>
                  {this.state.queriedFields.passport ? (
                    <Text style={{ color: "red" }} bold>
                      Passport
                    </Text>
                  ) : (
                    <Text bold>Passport</Text>
                  )}
                </View>

                {!this.state.queriedFields.passport && !formData.signature ? (
                  <Text>No Image</Text>
                ) : (
                  <Image
                    source={{ uri: formData.passport }}
                    style={{
                      height: 131,
                      width: 98,
                    }}
                  />
                )}
              </View>
            )}

            {this.state.queriedFields.passport || this.props.queried ? (
              this.passport.map((value, index) => {
                const attachment = this.getAttachment(value);

                attachment && displayedAttachments.push(attachment);

                console.log("ATTACHMENTSOFT2", displayedAttachments);

                return (
                  <ClickableListItem
                    key={index}
                    onPressOut={() => {
                      if (this.state.queriedFields.passport) {
                        this.clearError("passport");
                        this.setState((prevState) => ({
                          queriedFields: {
                            ...prevState.queriedFields,
                            passport: false, // Replace 'newValue' with the actual value you want to set
                          },
                        }));
                      }
                      !attachment && this.onAddFileClick(value);
                    }}
                  >
                    <CacRegFilePreview
                      attachment={attachment}
                      name={
                        this.state.queriedFields.passport ? (
                          <>
                            {" "}
                            <Text style={{ color: "red" }} bold>
                              Passport
                            </Text>
                          </>
                        ) : (
                          <Text bold>Passport</Text>
                        )
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
                );
              })
            ) : (
              <></>
            )}

            {/* supporting document */}
            {!this.state.supportingDocMatched && (
              <View style={{ marginBottom: 15 }}>
                <View style={{ marginVertical: 10 }}>
                  {this.state.queriedFields.supportingDoc ? (
                    <Text style={{ color: "red" }} bold>
                      supportingDoc
                    </Text>
                  ) : (
                    <Text bold>supportingDoc</Text>
                  )}
                </View>

                {!this.state.queriedFields.supportingDoc &&
                !formData.supportingDoc ? (
                  <Text>No Image</Text>
                ) : (
                  <Image
                    source={{ uri: formData.supportingDoc }}
                    style={{
                      height: 131,
                      width: 98,
                    }}
                  />
                )}
              </View>
            )}

            {this.state.queriedFields.supportingDoc || this.props.queried ? (
              this.supportingDoc.map((value, index) => {
                const attachment = this.getAttachment(value);
                attachment && displayedAttachments.push(attachment);
                console.log("ATTACHMENTSOFT2", displayedAttachments);

                return (
                  <ClickableListItem
                    key={index}
                    onPressOut={() => {
                      if (this.state.queriedFields.supportingDoc) {
                        this.clearError("supportingDoc");
                        this.setState((prevState) => ({
                          queriedFields: {
                            ...prevState.queriedFields,
                            supportingDoc: false, // Replace 'newValue' with the actual value you want to set
                          },
                        }));
                      }
                      !attachment && this.onAddFileClick(value);
                    }}
                  >
                    <CacRegFilePreview
                      attachment={attachment}
                      name={
                        this.state.queriedFields.supportingDoc ? (
                          <>
                            {" "}
                            <Text style={{ color: "red" }} bold>
                              Supporting Document
                            </Text>
                          </>
                        ) : (
                          <Text bold>Supporting Document</Text>
                        )
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
                );
              })
            ) : (
              <></>
            )}

            <View style={{ paddingHorizontal: 10 }}>
              {showButton && (
                <Button
                  onPress={onPress}
                  title={buttonTitle}
                  loading={loading}
                  buttonStyle={{ backgroundColor: COLOUR_BLUE }}
                  containerStyle={{
                    backgroundColor: COLOUR_BLUE,
                    width: "100%",
                  }}
                  disabled={this.state.buttonDisabled}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

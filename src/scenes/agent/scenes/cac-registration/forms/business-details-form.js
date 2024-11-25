import moment from "moment";
import React from "react";
import { InteractionManager, ScrollView, View } from "react-native";
import DocumentPicker from "react-native-document-picker";
import BaseForm from "../../../../../../src/components/base-form";
import Button from "../../../../../components/button";
import FormDate from "../../../../../components/form-controls/form-date";
import FormInput from "../../../../../components/form-controls/form-input";
import FormPicker from "../../../../../components/form-controls/form-picker";
import Text from "../../../../../components/text";
import { NIGERIA } from "../../../../../constants";
import {
  COLOUR_BLACK,
  COLOUR_BLUE,
  COLOUR_WHITE,
  FONT_FAMILY_BODY_BOLD,
  FONT_FAMILY_BODY_SEMIBOLD,
  FONT_SIZE_TITLE,
} from "../../../../../constants/styles";
import CountriesStatesLga from "../../../../../fixtures/countries_states_lgas.json";
import styles from "../../../../../scenes/aggregator/scenes/home/scenes/pre-setup-agent/styles";
import { loadData } from "../../../../../utils/storage";

const currentDateStr = moment().format("YYYY-MM-DD[T]HH:mm:ss");
const lineBusiness = "ICT";
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
    name: "Digital Marketing",
    value: "Digital Marketing",
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
];

export class BusinessDetailsForm extends BaseForm {
  requiredFields = [
    "companyEmailAddress",
    "lineOfBusiness",
    "businessCommencementDate",
    "companyState",
    "companyCity",
    "companyStreetNumber",
    "companyAddress",
  ];
  requiredFilesMap = {
    "Image of Business Location": "ID_CARD",
  };
  constructor() {
    super();

    this.state = {
      form: {
        companyEmailAddress: null,
        lineOfBusiness: null,
        businessCommencementDate: null,
        companyState: null,
        companyCity: null,
        companyStreetNumber: null,
        companyAddress: null,
      },
      invalidFields: [],
      states: [],
      lgas: [],
      countries: [],
      attachments: [],
      filesAttached: [],
      buttonDisabled: true,
      isLoading: false,
      currentDate: currentDateStr,
      startDate: moment()
        .subtract(600, "months")
        .format("YYYY-MM-DD[T00:00:00]"),
      endDate: currentDateStr,
      lineOfBusiness: null,
      initiateResponseData: null,
      assistedCacRegType: false,
      lineOfBusinessTest: null,
      busnessNameForm: null,
      savedCacBusinessForm: {},
      cachedData: false,
      cachedState: null,
    };

    this.fetchCountries = this.fetchCountries.bind(this);
    this.fetchStates = this.fetchStates.bind(this);
    this.onStateSelect = this.onStateSelect.bind(this);
    this.onAddDocumentClick = this.onAddDocumentClick.bind(this);
    this.onAddFileClick = this.onAddFileClick.bind(this);
    this.onAddImageClick = this.onAddImageClick.bind(this);
    this.removeAttachment = this.removeAttachment.bind(this);
    this.uploadDocument = this.uploadDocument.bind(this);
    this.fetchInitiateResponse = this.fetchInitiateResponse.bind(this);
    this.loadRegType = this.loadRegType.bind(this);
    this.getBusinessFormData = this.getBusinessFormData.bind(this);
  }

  requiredFiles = ["Image of Business Location"];

  componentDidMount() {
    this.setState((prev) => ({
      ...prev,
      companyEmailAddress: null,
      lineOfBusiness: null,
      businessCommencementDate: null,
      companyState: null,
      companyCity: null,
      companyStreetNumber: null,
      companyAddress: null,
    }));
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });
      //   setTimeout(() => this.accountNumber.focus(), 500);
    });
    this.fetchCountries();
    this.fetchStates();
    this.fetchInitiateResponse();
    this.loadRegType();
    this.getBusinessFormData();
  }

  async getBusinessFormData() {
    const savedCacBusinessFormData = JSON.parse(
      await loadData("cacRegBusinessFormData")
    );
    console.log("cacRegBusinessFormData1", savedCacBusinessFormData);
    console.log("cacRegBusinessFormData2", "DATAFORM");
    if (savedCacBusinessFormData != null) {
      this.setState(
        {
          savedCacBusinessForm: savedCacBusinessFormData,
          cachedData: true,
        },
        () => {
          this.setState({
            form: {
              ...this.state.form, // Spread the existing form values
              companyState: this.state.savedCacBusinessForm?.companyState, // Update only the "state" field
              businessCommencementDate: this.state.savedCacBusinessForm
                ?.businessCommencementDate,
            },
          });
        }
      );
    }

    console.log("NOT SEEING2", this.state.savedCacBusinessForm);
  }

  async loadRegType() {
    const savedCacRegType = JSON.parse(await loadData("CAC REG TYPE"));
    if (savedCacRegType === "assisted") {
      this.setState({ assistedCacRegType: true });
    } else {
      this.setState({ assistedCacRegType: false, lineOfBusinessTest: "ICT" });
    }

    console.log("savedCacRegTypePersonal", this.state.assistedCacRegType);
  }

  async fetchInitiateResponse() {
    const cacBusinessForm = JSON.parse(await loadData("cacBusinessFormData"));
    const cacInitiateResponse = JSON.parse(
      await loadData("cacRegInitiateResponseData")
    );
    console.log(
      "initaitaeResponseData1",
      cacInitiateResponse.cacInitiateRequest.lineOfBusiness
    );
    this.setState(
      {
        initiateResponseData: cacInitiateResponse,
        lineOfBusiness: cacBusinessForm.lineOfBusiness,
        busnessNameForm: cacBusinessForm.lineOfBusiness,
      },
      () => {
        console.log("initaitaeResponseData2", this.state.lineOfBusiness);
        console.log("busnessNameForm", this.state.busnessNameForm);
      }
    );
  }

  checkFormValidity() {
    const formIsComplete = this.state.isComplete;
    const formIsValid = this.state.isValid;
    console.log("VALID BUSINESS FORM A", formIsValid);
    console.log("VALID BUSINESS FORM B", formIsComplete);
    console.log("VALID BUSINESS FORM C", this.state.form);

    if (!(formIsComplete && formIsValid)) {
      this.setState({
        buttonDisabled: true,
      });
      return;
    }
    this.setState({
      buttonDisabled: false,
    });

    console.log("BUSINESS FORM C", this.state.buttonDisabled);

    return true;
  }

  fetchStates() {
    const nigeria = CountriesStatesLga.find((value) => value.name === NIGERIA);
    this.setState({
      states: nigeria.states,
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

  onStateSelect(stateId) {
    const country = CountriesStatesLga.find((value) => value.name == NIGERIA);

    const state = country.states.find((value) => value.id == stateId);

    this.setState({
      lgas: state ? state.lgas : [],
    });
  }

  getAttachment(documentName) {
    if (!this.state.attachments) return;
    if (documentName === "Utility Bill") {
      return this.state.attachments.filter(
        (value) =>
          value.documentName === documentName ||
          value.documentType === documentName ||
          value.documentName === "UTILITY_BILL"
      )[0];
    }
    return this.state.attachments.find(
      (value) =>
        value.documentName === documentName ||
        value.documentType === documentName ||
        value.documentName === "PASSPORT_PHOTO"
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

    this.setState({
      attachments: newAttachments,
      filesAttached: newFilesAttached,
      isComplete,
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

    console.log(docType);

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
            <View style={{ paddingVertical: 10 }}>
              <Text
                style={{
                  color: COLOUR_BLACK,
                  fontSize: 20,
                  fontFamily: FONT_FAMILY_BODY_BOLD,
                }}
              >
                Business Details
              </Text>
            </View>

            <FormInput
              autoCapitalize="name"
              autoCompleteType="email"
              defaultValue={
                this.state.cachedData &&
                this.state.savedCacBusinessForm?.companyEmailAddress || ''
              }
              innerContainerStyle={styles.formInputInnerContainerStyle}
              keyboardType="email-address"
              onChangeText={(companyEmailAddress, isValid) => {
                this.updateFormField({ companyEmailAddress });
                !isValid
                  ? this.addInvalidField("companyEmailAddress")
                  : this.removeInvalidField("companyEmailAddress");
                this.checkFormValidity();
              }}
              onSubmitEditing={() => {
                this.checkFormValidity();
              }}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              placeholder="Placeholder"
              propagateError={this.props.propagateFormErrors}
              showValidIndicator={true}
              text="Company Email Address"
              textContentType="emailAddress"
              textInputRef={(input) => (this.companyEmailAddress = input)}
              validators={{
                required: true,
                email: true,
              }}
              hideOptionalLabel={true}
            />

            {this.state.assistedCacRegType ? (
              <FormInput
                autoCapitalize="name"
                defaultValue={this.state.lineOfBusiness}
                disabled={true}
                autoCompleteType="email"
                innerContainerStyle={styles.formInputInnerContainerStyle}
                keyboardType="email-address"
                onChangeText={(lineOfBusiness, isValid) => {
                  this.updateFormField({ lineOfBusiness });
                  !isValid
                    ? this.addInvalidField("lineOfBusiness")
                    : this.removeInvalidField("lineOfBusiness");
                  this.checkFormValidity();
                }}
                onSubmitEditing={() => {
                  this.checkFormValidity();
                }}
                outerContainerStyle={styles.formInputOuterContainerStyle}
                placeholder="Placeholder"
                propagateError={this.props.propagateFormErrors}
                showValidIndicator={true}
                text="Line of Business"
                textInputRef={(input) => (this.lineOfBusiness = input)}
                validators={{
                  required: true,
                }}
                hideOptionalLabel={true}
              />
            ) : (
              <FormInput
                autoCapitalize="name"
                disabled={true}
                autoCompleteType="email"
                // defaultValue={'ICT'}
                defaultValue={this.state.lineOfBusiness}
                innerContainerStyle={styles.formInputInnerContainerStyle}
                keyboardType="email-address"
                onChangeText={(lineOfBusiness, isValid) => {
                  this.updateFormField({ lineOfBusiness });
                  !isValid
                    ? this.addInvalidField("lineOfBusiness")
                    : this.removeInvalidField("lineOfBusiness");
                  this.checkFormValidity();
                }}
                onSubmitEditing={() => {
                  this.checkFormValidity();
                }}
                outerContainerStyle={styles.formInputOuterContainerStyle}
                placeholder="Placeholder"
                propagateError={this.props.propagateFormErrors}
                showValidIndicator={true}
                text="Line of Business"
                textContentType="emailAddress"
                textInputRef={(input) => (this.lineOfBusiness = input)}
                validators={{
                  required: true,
                }}
                hideOptionalLabel={true}
              />
            )}
            <Text
              style={{
                color: COLOUR_BLACK,
                fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                fontSize: FONT_SIZE_TITLE,
              }}
              bold
            >
              Business Commencement Date
            </Text>
            <FormDate
              innerContainerStyle={styles.formInputInnerContainerStyle}
              maxDate={moment(this.state.currentDate, "YYYY-MM-DD").format(
                "DD-MM-YYYY"
              )}
              minDate={moment(this.state.startDate, "YYYY-MM-DD").format(
                "DD-MM-YYYY"
              )}
              defaultValue={
                this.state.cachedData &&
                this.state.savedCacBusinessForm?.businessCommencementDate
              }
              onDateSelect={(businessCommencementDate, isValid) => {
                this.updateFormField({ businessCommencementDate });
                this.onStateSelect(businessCommencementDate);
                !isValid
                  ? this.addInvalidField("businessCommencementDate")
                  : this.removeInvalidField("businessCommencementDate");
                this.checkFormValidity();
              }}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              placeholder="Pick date"
              //propagateError={this.props.propagateFormErrors}
              // text="Business Commencement Date:"
              validators={{
                required: false,
              }}
              width={"100%"}
              // format={"YYYY-MM-DD"}
            />

            <FormPicker
              choices={this.state.states.map(({ id, name }) => ({
                label: name,
                value: id,
              }))}
              defaultValue={
                this.state.cachedData &&
                this.state.savedCacBusinessForm?.companyState
              }
              innerContainerStyle={styles.formInputInnerContainerStyle}
              onSelect={(companyState, isValid) => {
                this.updateFormField({ companyState });
                this.onStateSelect(companyState);
                !isValid
                  ? this.addInvalidField("companyState")
                  : this.removeInvalidField("companyState");
                this.checkFormValidity();
              }}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              propagateError={this.props.propagateFormErrors}
              text="Company State"
              validators={{
                required: true,
              }}
            />

            <FormInput
              autoCapitalize="name"
              // disabled={true}
              autoCompleteType="email"
              defaultValue={
                this.state.cachedData &&
                this.state.savedCacBusinessForm?.companyCity || ''
              }
              // defaultValue={this.state.agentAddress}
              innerContainerStyle={styles.formInputInnerContainerStyle}
              keyboardType="email-address"
              onChangeText={(companyCity, isValid) => {
                this.updateFormField({ companyCity });
                !isValid
                  ? this.addInvalidField("companyCity")
                  : this.removeInvalidField("companyCity");
                this.checkFormValidity();
              }}
              onSubmitEditing={() => {
                this.checkFormValidity();
              }}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              placeholder="Placeholder"
              propagateError={this.props.propagateFormErrors}
              showValidIndicator={true}
              text="Company City"
              textContentType="emailAddress"
              textInputRef={(input) => (this.companyCity = input)}
              validators={{
                required: true,
              }}
              hideOptionalLabel={true}
            />

            <FormInput
              autoCapitalize="name"
              // disabled={true}
              autoCompleteType="email"
              defaultValue={
                this.state.cachedData &&
                this.state.savedCacBusinessForm?.companyStreetNumber || ''
              }
              // defaultValue={this.state.agentAddress}
              innerContainerStyle={styles.formInputInnerContainerStyle}
              keyboardType="email-address"
              onChangeText={(companyStreetNumber, isValid) => {
                this.updateFormField({ companyStreetNumber });
                !isValid
                  ? this.addInvalidField("companyStreetNumber")
                  : this.removeInvalidField("companyStreetNumber");
                this.checkFormValidity();
              }}
              onSubmitEditing={() => {
                this.checkFormValidity();
              }}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              placeholder="Placeholder"
              propagateError={this.props.propagateFormErrors}
              showValidIndicator={true}
              text="Company Street Number"
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
              autoCompleteType="email"
              defaultValue={
                this.state.cachedData &&
                this.state.savedCacBusinessForm?.companyAddress || ''
              }
              // defaultValue={this.state.agentAddress}
              innerContainerStyle={styles.formInputInnerContainerStyle}
              keyboardType="email-address"
              onChangeText={(companyAddress, isValid) => {
                this.updateFormField({ companyAddress });
                !isValid
                  ? this.addInvalidField("companyAddress")
                  : this.removeInvalidField("companyAddress");
                this.checkFormValidity();
              }}
              onSubmitEditing={() => {
                this.checkFormValidity();
              }}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              placeholder="Placeholder"
              propagateError={this.props.propagateFormErrors}
              showValidIndicator={true}
              text="Company Address"
              textContentType="emailAddress"
              textInputRef={(input) => (this.companyAddress = input)}
              validators={{
                required: true,
              }}
              hideOptionalLabel={true}
            />

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

            {/* <UploadFileMenu
              onAddDocumentClick={this.onAddDocumentClick}
              onAddImageClick={this.onAddImageClick}
              ref_={(menu) => (this.uploadFileMenu = menu)}
              requestClose={() => this.uploadFileMenu.close()}
            />

            {this.requiredFiles.map((value, index) => {
              const attachment = this.getAttachment(value);
              attachment && displayedAttachments.push(attachment);

              return (
                <ClickableListItem
                  key={index}
                  onPressOut={() => !attachment && this.onAddFileClick(value)}
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
            })} */}
          </View>
        </ScrollView>
      </View>
    );
  }
}

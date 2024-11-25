import React from "react";

import LottieView from "lottie-react-native";
import { Alert, TouchableOpacity, View } from "react-native";
import DocumentPicker from "react-native-document-picker";
import ImagePicker from "react-native-image-picker";
import RBSheet from "react-native-raw-bottom-sheet";
import ActivityIndicator from "../../../../../../../components/activity-indicator";
import BaseForm from "../../../../../../../components/base-form";
import Button from "../../../../../../../components/button";
import FormInput from "../../../../../../../components/form-controls/form-input";
import FormPicker from "../../../../../../../components/form-controls/form-picker";
import Text from "../../../../../../../components/text";
import { ERROR_STATUS } from "../../../../../../../constants/api";
import {
  MIN_ACCOUNT_NUMBER_LENGTH,
  MIN_NAME_LENGTH,
} from "../../../../../../../constants/fields";
import {
  COLOUR_BLACK,
  COLOUR_FORM_CONTROL_BACKGROUND,
  COLOUR_GREY,
  COLOUR_LINK_BLUE,
  COLOUR_RED,
  FONT_FAMILY_BODY_SEMIBOLD,
} from "../../../../../../../constants/styles";
import Banks from "../../../../../../../fixtures/banks";
import Onboarding from "../../../../../../../services/api/resources/onboarding";
import Transaction from "../../../../../../../services/api/resources/transaction";
import { transactionServiceV1 } from "../../../../../../../setup/api";
import { getDeviceDetails } from "../../../../../../../utils/device";
import { flashMessage } from "../../../../../../../utils/dialog";
import { FipAgentFileUploader } from "../../components/file-upload";

import {
  DOCUMENT_BASE_URL,
  FORCE_ACCOUNT_VALIDATION_ON_TRANSFER_TO_ACCOUNT,
} from "../../../../../../../constants/api-resources";
import styles from "../../styles";

export class FipAgentBusinessInformationForm extends BaseForm {
  transaction = new Transaction();
  onboarding = new Onboarding();
  FIVE_MB = 5242880;
  requiredFields = [
    "businessName",
    "businessAddress",
    "businessType",
    "bankName",
    "accountNumber",
    "state",
    "lga",
    "accountName",
  ];

  requiredFiles = [
    "Image of Business Location",
    "Address Verification Form",
    "Utility Bill",
    "Guarantor Form",
  ];
  state = {
    businessDetails: {},
    form: {
      businessName: null,
      businessAddress: null,
      businessType: null,
      bankName: null,
      accountNumber: null,
      accountName: null,
      state: null,
      lga: null,
      theBankName: null,
    },
    invalidFields: [],
    lgas: [],
    states: [],
    loadingFile: false,

    businessDocument: {
      businessLocation: "Business Location Image",
      addressVerificationForm: "Address Verification Form",
      utilityBill: "Utility Bill",
      guarantorForm: "Guarantor Form",
    },
    banks: Banks,
    nameInquirySuccess: null,
    currentDocument: null,
    didUploadFail: false,
    attachments: [],
    filesAttached: [],
    uploadedAttachments: [],
    isFileComplete: null,
    loadingFileMessage: null,
    errors: {},
    isSuperAgent: false,
    showMainBankField: false,
  };

  constructor() {
    super();
    this.onSelectBank = this.onSelectBank.bind(this);
    this.fetchBanks = this.fetchBanks.bind(this);
    this.loadApplicationToState = this.loadApplicationToState.bind(this);
    Banks.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
  }

  componentDidMount() {
    const { agentTypeId } = this.props.application;
    const businessDetails = this.props.application.businessDetails || {};
    const serializedBusinessDetails = this.serializeApiData(businessDetails);
    const isSuperAgent =
      agentTypeId === 3 ||
      (!businessDetails && agentTypeId === 4) ||
      (agentTypeId === 4 && this.props.isStateBiller);

    console.log(isSuperAgent, "isSupa");
    console.log(this.props.isStateBiller, "state bill");
    this.setState({
      businessDetails,
      form: {
        ...serializedBusinessDetails,
      },
      isSuperAgent,
    });
    this.fetchBanks();

    this.loadApplicationToState();
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.application !== prevProps.application) {
      const businessDetails = this.props.application.businessDetails || {};
      const { agentTypeId } = this.props.application;

      const serializedBusinessDetails = this.serializeApiData(businessDetails);
      const businessInformationAttachments = this.serializeDocumentApiData(
        this.props.application.documentsList || []
      );

      const isSuperAgent =
        agentTypeId === 3 ||
        (!businessDetails && agentTypeId === 4) ||
        (agentTypeId === 4 && this.props.isStateBiller);

      this.setState({
        businessDetails,
        form: {
          ...serializedBusinessDetails,
        },
        isSuperAgent,
        uploadedAttachments: businessInformationAttachments,
      });
    }
  }

  async loadApplicationToState() {
    const { application } = this.props;
    console.log(application, "appli");
    const documentsList = application.documentsList || [];
    console.log("uploaded BUS UPLOAD: ", documentsList);

    const businessInformationAttachments = this.serializeDocumentApiData(
      application.documentsList || []
    );

    const filesAttached = businessInformationAttachments.map(
      ({ documentType }) => documentType
    );
    const isComplete =
      filesAttached?.filter((value) => this.requiredFiles.includes(value))
        ?.length === this.requiredFiles.length;

    this.props.updateFormCompletion(isComplete);
    this.setState({
      isComplete: isComplete,
      filesAttached: filesAttached,
      uploadedAttachments: businessInformationAttachments,
    });
  }

  async fetchBanks() {
    try {
      const res = await transactionServiceV1.getBanks();
      console.log(res, "bankoo");
      const { code, response, status } = res;
      const banksList = response || [];
      banksList.sort((a, b) => {
        if (a.bankName.toLowerCase() > b.bankName.toLowerCase()) {
          return 1;
        }

        if (a.bankName.toLowerCase() < b.bankName.toLowerCase()) {
          return -1;
        }

        return 0;
      });

      this.setState({
        banks: banksList,
      });
    } catch (err) {
      console.log(err, "errr bank");
    }
  }

  async onSelectBank(bankCode) {
    this.activityIndicator.open();

    this.setState({
      nameInquirySuccess: null,
    });

    const { deviceUuid } = await getDeviceDetails();

    const res = await this.transaction.doAccountInquiry(
      bankCode,
      this.state.form.accountNumber,
      deviceUuid
    );
    const { status, response } = res;
    console.log(res, "resto inquiry");

    if (status === ERROR_STATUS) {
      this.setState({
        form: {
          ...this.state.form,
          accountName: null,
        },
        isLoading: false,
        nameInquirySuccess: false,
      });
    } else {
      this.setState({
        form: {
          ...this.state.form,
          accountName: response.accountName,
        },
        nameInquirySuccess: true,
      });

      setTimeout(() => {
        this.activityIndicator && this.activityIndicator.close();
      }, 3000);
    }
  }
  getMyBank = (bankName) => {
    const bk = this.state.banks?.find((b) =>
      b.name?.toLowerCase().includes(bankName?.toLowerCase())
    );
    return bk?.cbnCode;
  };
  serializeApiData(businessDetails) {
    const {
      businessName,
      address,
      //businessType,
      bankName,
      accountNumber,
      accountName,
    } = businessDetails;

    return {
      businessName: businessName || null,
      businessAddress: address || null,
      //businessType: businessType || null,
      bankName: bankName || null,
      accountName: accountName || null,
      accountNumber: accountNumber || null,
      // theBankName: this.getMyBank(bankName) || null,
    };
  }

  serializeFormData() {
    const {
      businessName,
      businessAddress,
      //businessType,
      bankName,
      accountNumber,
      accountName,
    } = this.state.form;

    return {
      businessName,
      address: businessAddress,
      //businessType,
      bankName,
      accountNumber,
      accountName,
      applicationId: this.props.application.applicationId,
    };
  }

  onAddFileClick = (documentName) => {
    const options = {
      title: "Upload Attachment",
    };

    this.setState({
      loadingFile: true,
      invalidFileField: false,
      currentDocument: documentName,
      didUploadFail: false,
      loadingFileMessage: "Loading your file, hang tight...",
    });
    ImagePicker.showImagePicker(options, (response) => {
      response.documentName = documentName;
      response.hasBeenUploaded = false;
      console.log(response, "upload res");
      if (response.didCancel) {
        this.setState({
          loadingFile: false,
          currentDocument: documentName,
          didUploadFail: false,
        });
        console.log("User cancelled image picker");
      } else if (response.error) {
        this.setState({
          loadingFile: false,
          currentDocument: documentName,
          didUploadFail: true,
        });
        console.log("ImagePicker Error: ", response.error);
      } else if (response.fileSize > this.FIVE_MB) {
        Alert.alert(null, "File is more than 5MB, try again");
        this.setState({ loadingFile: false });
        return false;
      } else {
        this.getUploadedBusinessDocument({
          documentName: documentName,
          result: response,
          documentType: "photo",
        });
      }
    });
  };

  pickDocument = async (documentName) => {
    console.log(documentName, "docc name");
    if (documentName === "Image of Business Location") {
      return this.onAddFileClick(documentName);
    }
    this.setState({
      loadingFile: true,
      invalidFileField: false,
      currentDocument: documentName,
      didUploadFail: false,
      loadingFileMessage: "Loading your file, hang tight...",
    });
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log(
        result.uri,
        result.type, // mime type
        result.name,
        result.size
      );
      result.documentName = documentName;
      result.hasBeenUploaded = false;
      console.log(result, "my ri");
      const TEN_MB = 10485760;

      if (result.size > this.FIVE_MB) {
        Alert.alert(null, "File is more than 5MB, try again");
        this.setState({ loadingFile: false });
        return false;
      }
      if (
        result.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        result.type === "application/msword"
      ) {
        this.getUploadedBusinessDocument({
          documentName: documentName,
          result: result,
          documentType: "doc",
        });
      } else if (result.type === "application/pdf") {
        this.getUploadedBusinessDocument({
          documentName: documentName,
          result: result,
          documentType: "pdf",
        });
      } else if (
        result.type === "image/png" ||
        result.type === "image/jpg" ||
        result.type === "image/jpeg"
      ) {
        this.getUploadedBusinessDocument({
          documentName: documentName,
          result: result,
          documentType: "photo",
        });
      } else {
        Alert.alert(null, "Unsupported file format, try again.");
        this.setState({ loadingFile: false });
        return;
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        this.setState({ loadingFile: false });
        return false;
      } else {
        this.setState({ loadingFile: false });
      }
    }
  };

  async getUploadedBusinessDocument({ documentName, result, documentType }) {
    const attachment = {
      ...result,
      fileName: result?.fileName ? result.fileName : result.name,
      documentType: documentType,
    };

    try {
      const prod = true;
      console.log(attachment, "attch");
      if (prod === true) {
        this.setState({
          loadingFileMessage: "Uploading your file, please wait…",
        });
        const { status, response } = await this.onboarding.documentUpload(
          this.props.application.applicationId,
          documentName,
          attachment
        );

        console.log("DOCUMENT UPLOAD RESPONSE >>>", response);

        if (status === ERROR_STATUS) {
          this.onDocumentUploadFailure();

          return;
        }

        const newFilesAttached = this.state.filesAttached.includes(documentName)
          ? this.state.filesAttached
          : [...this.state.filesAttached, documentName];

        const isComplete =
          newFilesAttached.filter((value) => this.requiredFiles.includes(value))
            .length >= this.requiredFiles.length;
        const documentResponseObj = this.serializeDocumentUploadResponseObj(
          response
        );
        this.setState({
          uploadedAttachments: [
            ...this.state.uploadedAttachments,
            documentResponseObj,
          ],
          filesAttached: newFilesAttached,
          isComplete,
        });
        this.onDocumentUploadSuccess();
      }
    } catch (err) {
      console.log(err, "upload err");
      this.onDocumentUploadFailure();
    }
  }

  onDocumentUploadFailure = () => {
    this.setState({
      didUploadFail: true,
      loadingFile: false,
      loadingFileMessage: null,
    });

    flashMessage(null, "Upload failed");
  };

  onDocumentUploadSuccess = () => {
    this.setState({
      didUploadFail: false,
      loadingFile: false,
      loadingFileMessage: null,
    });

    flashMessage(null, "Uploaded");
  };

  onRemoveFile = (fileToRemove) => {
    console.log(fileToRemove, "remove file");

    const attachments = this.state.attachments.filter(
      (attachment) => attachment.documentName !== fileToRemove
    );

    const uploadedAttachments = this.state.uploadedAttachments.filter(
      (attachment) => attachment.documentType !== fileToRemove
    );

    const updatedFilesAttached = this.state.filesAttached.filter(
      (file) => file !== fileToRemove
    );

    const isComplete = this.requiredFiles.every((file) =>
      updatedFilesAttached.includes(file)
    );
    this.props.updateFormCompletion(false);

    console.log(uploadedAttachments, isComplete, "remove file call...");

    this.setState({
      attachments: attachments,
      isComplete,
      filesAttached: updatedFilesAttached,
      uploadedAttachments: uploadedAttachments,
    });
  };

  getAttachment2 = (documentName) => {
    return this.state.uploadedAttachments.find(
      (value) =>
        value.documentName === documentName ||
        value.documentType === documentName
    );
  };

  getAttachment = (documentName) => {
    console.log(documentName, "baba33");
    const attachment = this.state.uploadedAttachments.find(
      (value) =>
        value.documentName === documentName ||
        value.documentType === documentName
    );
    console.log(attachment, "attch");

    if (attachment && attachment.documentLink) {
      const basePath = "/data/inclusio/finch-onboarding-service";
      attachment.uri = attachment.documentLink.replace(
        basePath,
        DOCUMENT_BASE_URL
      );
      return attachment;
    }

    return null;
  };

  serializeDocumentApiData = (attachments) => {
    return attachments.map((value) => {
      const basePath = "/data/inclusio/finch-onboarding-service";

      return {
        hasBeenUploaded: true,
        uri: value.documentLink
          ? value.documentLink.replace(basePath, DOCUMENT_BASE_URL)
          : value?.uri || null,
        fileName: value.documentName,
        documentName: value.documentType,
        documentType: value.documentType,
        documentExtention: value.documentExtention,
        lastModified: new Date().getTime(),
      };
    });
  };

  serializeDocumentUploadResponseObj = (attachment) => {
    const basePath = "/data/inclusio/finch-onboarding-service";

    return {
      hasBeenUploaded: true,
      uri: attachment?.documentLink
        ? attachment.documentLink.replace(basePath, DOCUMENT_BASE_URL)
        : attachment?.uri || null,
      fileName: attachment.documentName,
      documentName: attachment.documentType,
      documentType: attachment.documentType,
      documentExtention: attachment.documentExtention,
      lastModified: new Date().getTime(),
    };
  };

  previewInitialField = () => {
    return (
      <View style={{ marginBottom: 30, marginTop: 0 }}>
        <Text
          style={{
            color: COLOUR_BLACK,
            fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
            marginBottom: 5,
          }}
        >
          Bank Name
        </Text>

        <View
          style={{
            height: 50,
            backgroundColor: COLOUR_FORM_CONTROL_BACKGROUND,
            borderRadius: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <Text style={{ color: COLOUR_BLACK }}>
            {this.state.form.bankName}
          </Text>
          <TouchableOpacity
            onPress={() => this.setState({ showMainBankField: true })}
          >
            <Text style={{ color: COLOUR_LINK_BLUE }}>Change</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  render() {
    const {
      currentDocument,
      didUploadFail,
      loadingFile,
      isUploadingFile,
    } = this.state;

    return (
      <React.Fragment>
        <FormInput
          autoCompleteType="name"
          defaultValue={this.state.form.businessName}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(businessName, isValid) => {
            this.updateFormField({ businessName });
            !isValid
              ? this.addInvalidField("businessName")
              : this.removeInvalidField("businessName");
          }}
          onSubmitEditing={() => {
            this.businessAddress.focus();
          }}
          disabled={!this.state.isSuperAgent}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="Your business name"
          propagateError={this.props.propagateFormErrors}
          text="Business Name"
          textInputRef={(input) => (this.businessName = input)}
          validators={{
            minLength: MIN_NAME_LENGTH,
            regex: "name",
            required: true,
          }}
        />

        <FormInput
          autoCompleteType="name"
          defaultValue={this.state.form.businessAddress}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(businessAddress, isValid) => {
            this.updateFormField({ businessAddress });
            !isValid
              ? this.addInvalidField("businessAddress")
              : this.removeInvalidField("businessAddress");
          }}
          onSubmitEditing={() => {
            this.businessType.focus();
          }}
          disabled={!this.state.isSuperAgent}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="Your business address"
          propagateError={this.props.propagateFormErrors}
          text="Business Address"
          textInputRef={(input) => (this.businessAddress = input)}
          validators={{
            minLength: MIN_NAME_LENGTH,
            regex: "sentence",
            required: true,
          }}
        />

        {/* <FormPicker
          choices={BusinessTypes.map(({ id, name }) => ({
            label: name,
            value: name,
          }))}
          defaultValue={this.state.form.businessType}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={(businessType, isValid) => {
            this.updateFormField({ businessType });
            !isValid
              ? this.addInvalidField("businessType")
              : this.removeInvalidField("businessType");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          propagateError={this.props.propagateFormErrors}
          text="Business Type"
          textInputRef={(input) => (this.businessType = input)}
          validators={{
            required: true,
          }}
        /> */}

        <FormInput
          autoCompleteType="tel"
          defaultValue={this.state.form.accountNumber}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType="number-pad"
          maxLength={MIN_ACCOUNT_NUMBER_LENGTH}
          onChangeText={(accountNumber, isValid) => {
            this.updateFormField({
              accountNumber,
            });
            isValid === false
              ? this.addInvalidField("accountNumber")
              : this.removeInvalidField("accountNumber");
            isValid &&
              this.state.form.bankCode &&
              this.onSelectBank(this.state.form.bankCode);
          }}
          optional={true}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="1234567890"
          propagateError={this.props.propagateFormErrors}
          text="Account Number"
          textInputRef={(input) => (this.accountNumber = input)}
          validators={{
            length: MIN_ACCOUNT_NUMBER_LENGTH,
            required: true,
          }}
        />
        {this.props.isFromApplicationPreview &&
        !this.state.showMainBankField ? (
          <>{this.previewInitialField()}</>
        ) : (
          (!this.props.isFromApplicationPreview ||
            this.state.showMainBankField) && (
            <FormPicker
              choices={this.state.banks.map((option) => ({
                label: option.bankName,
                value: option.cbnCode,
              }))}
              innerContainerStyle={styles.formInputInnerContainerStyle}
              onSelect={(bankCode, isValid) => {
                const bank = this.state.banks.find(
                  (bank) => bankCode == bank.cbnCode
                );

                this.updateFormField({
                  bankCode,
                  bankName: bank?.bankName,
                  bank: bank,
                  // theBankName: bank?.cbnCode,
                });
                isValid === false
                  ? this.addInvalidField("bankCode")
                  : this.removeInvalidField("bankCode");
                const isAccountNumberValid = !this.state.invalidFields.includes(
                  "accountNumber"
                );
                isAccountNumberValid && this.onSelectBank(bankCode);
              }}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              propagateError={this.props.propagateFormErrors}
              text="Bank Name"
              validators={{
                required: true,
              }}
            />
          )
        )}
        <FormInput
          autoCompleteType="name"
          defaultValue={
            this.state.form.accountName ? this.state.form.accountName : ""
          }
          disabled={
            FORCE_ACCOUNT_VALIDATION_ON_TRANSFER_TO_ACCOUNT
              ? true
              : this.state.nameInquirySuccess
          }
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(accountName, isValid) => {
            this.updateFormField({ accountName });
            !isValid
              ? this.addInvalidField("accountName")
              : this.removeInvalidField("accountName");
          }}
          onSubmitEditing={() => {
            this.accountName.focus();
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="John Doe"
          propagateError={this.props.propagateFormErrors}
          text="Account Name"
          textInputRef={(input) => (this.accountName = input)}
          validators={{
            minLength: MIN_NAME_LENGTH,
            regex: "name",
            required: true,
          }}
        />

        {this.requiredFiles.map((file, index) => {
          const attachment = this.getAttachment2(file);

          return (
            <FipAgentFileUploader
              key={attachment?.uri}
              didUploadFail={currentDocument === file && didUploadFail}
              title={file}
              attachment={attachment}
              documentType={attachment?.documentExtention}
              onRemoveFile={() => this.onRemoveFile(file)}
              onPress={() => this.pickDocument(file)}
              loadingFile={loadingFile && currentDocument === file}
              propagateError={this.props.propagateFormErrors && !attachment}
              loadingFileMessage={this.state.loadingFileMessage}
              disabled={loadingFile}
            />
          );
        })}
        <RBSheet
          animationType="fade"
          ref={(ref) => {
            this.activityIndicator = ref;
          }}
          closeOnDragDown={false}
          closeOnPressBack={false}
          closeOnPressMask={false}
          height={400}
          duration={250}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center",
            },
          }}
        >
          {this.state.nameInquirySuccess && (
            <React.Fragment>
              <LottieView
                autoPlay={true}
                loop={false}
                ref={(animation) => {
                  this.animation = animation;
                }}
                style={{
                  height: 230,
                  top: 0,
                  width: 230,
                }}
                source={require("../../../../../../../animations/checked-done-2.json")}
              />
              <View
                style={{
                  flexDirection: "column",
                }}
              >
                <Text center green>
                  Name Inquiry Successful.
                </Text>
                <Text big center bold>
                  {`${this.state.form.accountName}`}
                </Text>
              </View>
            </React.Fragment>
          )}
          {this.state.nameInquirySuccess === false && (
            <React.Fragment>
              <LottieView
                autoPlay={true}
                loop={false}
                ref={(animation) => {
                  this.animation = animation;
                }}
                style={{
                  height: 230,
                  top: 0,
                  width: 230,
                }}
                source={require("../../../../../../../animations/14651-error-animation (2).json")}
              />
              <Text big bold center red style={{ marginTop: 10 }}>
                Account name confirmation failed. Please, retry.
              </Text>

              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
              >
                <Button
                  containerStyle={{ width: "30%" }}
                  onPressOut={() => this.onSelectBank(this.state.form.bankCode)}
                  title="RETRY"
                  titleStyle={{
                    color: COLOUR_RED,
                  }}
                  transparent
                />

                <Button
                  containerStyle={{ width: "30%" }}
                  onPressOut={() => this.activityIndicator.close()}
                  title="CANCEL"
                  titleStyle={{
                    color: COLOUR_GREY,
                  }}
                  transparent
                />
              </View>
            </React.Fragment>
          )}
          {this.state.nameInquirySuccess === null && (
            <React.Fragment>
              <ActivityIndicator
                containerStyle={{
                  flex: null,
                }}
              />
              <Text style={{ marginTop: 5 }}>Verifying account details</Text>
            </React.Fragment>
          )}
        </RBSheet>
      </React.Fragment>
    );
  }
}

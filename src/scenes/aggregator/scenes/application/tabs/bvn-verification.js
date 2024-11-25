import React from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import Button from "../../../../../components/button";
import Modal from "../../../../../components/modal";
import { ERROR_STATUS } from "../../../../../constants/api";
import { BLOCKER } from "../../../../../constants/dialog-priorities";
import { BVN_LENGTH } from "../../../../../constants/fields";
import Onboarding from "../../../../../services/api/resources/onboarding";
import Platform from "../../../../../services/api/resources/platform";
import { flashMessage } from "../../../../../utils/dialog";
import navigationService from "../../../../../utils/navigation-service";
import { sanitizeApplicationForm } from "../../../../../utils/sanitizers/application-form";
import { saveData } from "../../../../../utils/storage";
import { BvnVerification as BvnVerificationInformation } from "../forms/bvn-verification";
export default class BvnVerification extends React.Component {
  platform = new Platform();
  onboarding = new Onboarding();

  constructor() {
    super();
    this.state = {
      animationsDone: false,
      isLoading: false,
      showSuccessModal: false,
      form: null,
      message: null,
      description: null,
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    // this.getPermissionAsync();
    this.props.setTitle("BVN Information");
  }

  checkFormValidity(bvnVerificationFormData) {
    const {
      bvnFirstName,
      bvnLastName,
      bvnPhoneNumber,
      bvnNumber,
      bvnDateOfBirth,
    } = bvnVerificationFormData;
    try {
      return !(
        [
          bvnFirstName,
          bvnLastName,
          bvnPhoneNumber,
          bvnNumber,
          bvnDateOfBirth,
        ].includes(null) ||
        [
          bvnFirstName.length < 3,
          bvnLastName.length < 3,
          bvnPhoneNumber.length < 10,
          bvnNumber.length < BVN_LENGTH,
          bvnDateOfBirth.length != 10,
        ].includes(true)
      );
    } catch (e) {
      return false;
    }
  }

  showAlert(title, message) {
    Alert.alert(
      title,
      message,
      [
        {
          text: "Logout",
          onPress: () => navigationService.replace("Logout"),
        },
        {
          text: "Try Again",
          onPress: () => {},
          style: "cancel",
        },
      ],

      { cancelable: false }
    );
  }

  showTheAlert(title, message) {
    Alert.alert(
      title,
      message,
      [
        {
          text: "Continue",
          onPress: () => {
            this.props.onSubmit();
          },
        },
        {
          text: "Try Again",
          onPress: () => {},
          style: "cancel",
        },
      ],

      { cancelable: false }
    );
  }

  async onSubmit() {
    const bvnVerificationFormData = this.bvnVerificationForm.serializeFormData();

    const isFormValid = this.checkFormValidity(bvnVerificationFormData);

    if (!isFormValid) {
      flashMessage(
        "Error",
        "Invalid input. Kindly fill all the required fields",
        BLOCKER
      );
      return;
    }

    // const bvnVerificationFormData = this.bvnVerificationForm.serializeFormData();
    this.setState({
      errorMessage: null,
      isLoading: true,
      bvnVerificationFormData: bvnVerificationFormData,
    });
    const bvnResponse = {
      NOT_VALID:
        "Ensure you have provided accurate BVN information and try again",
      VALID: "Your BVN has been verified successfully",
      NOT_VERIFIED: "Something went wrong, kindly resend the last request",
    };
    const formData = {
      ...bvnVerificationFormData,
    };
    const saveAsDraftResponse = await this.platform.verifyBvn(formData);
    const saveAsDraftResponseStatus = saveAsDraftResponse.status;
    const saveAsDraftResponseObj = saveAsDraftResponse.response;

    if (saveAsDraftResponseStatus === ERROR_STATUS) {
      this.setState({
        message: saveAsDraftResponseObj.message,
        description: saveAsDraftResponseObj.description,

        isLoading: false,
      });

      this.showAlert(
        "BVN Validation Failed",
        saveAsDraftResponseObj
          ? this.state.message || this.state.description
          : ""
      );

      return;
    } else if (
      saveAsDraftResponseObj.validationStatus !== "VERIFIED" &&
      saveAsDraftResponseObj.validationStatus !== "VERIFIED_PARTIALLY"
    ) {
      this.setState({
        message: saveAsDraftResponseObj.message,
        isLoading: false,
      });
      this.showAlert("BVN Validation Failed", this.state.message);
      return;
    } else if (
      saveAsDraftResponseObj.validationStatus === "VERIFIED_PARTIALLY"
    ) {
      this.setState({
        isLoading: false,
      });
      this.showTheAlert(
        "Your BVN Data Is Partially Verified",
        saveAsDraftResponseObj.message
      );

      const getApplicationResponse = await this.onboarding.getApplicationById(
        this.props.application.applicationId
      );

      let previouslySavedData = getApplicationResponse.response;
      const updatedApplicationForm = previouslySavedData;

      const bvnVerificationStatus = saveAsDraftResponseObj.validationStatus;

      const formDataOnboarding = {
        bvn: formData.bvnNumber,
        dob: formData.bvnDateOfBirth,
        firstName: formData.bvnFirstName,
        surname: formData.bvnLastName,
      };

      updatedApplicationForm.applicantDetails = {
        ...previouslySavedData.applicantDetails,
        ...formDataOnboarding,
        bvnVerificationStatus: bvnVerificationStatus,
      };

      const form_ = sanitizeApplicationForm(updatedApplicationForm);
      const res = await this.onboarding.saveApplication(form_);
      await saveData(APPLICATION, res.response);
      console.log(res, "bvn fip partial res");

      return;
    } else {
      this.setState({
        showSuccessModal: true,
        isLoading: false,
      });
      const getApplicationResponse = await this.onboarding.getApplicationById(
        this.props.application.applicationId
      );

      let previouslySavedData = getApplicationResponse.response;
      const updatedApplicationForm = previouslySavedData;

      const bvnVerificationStatus = saveAsDraftResponseObj.validationStatus;

      const formDataOnboarding = {
        bvn: formData.bvnNumber,
        dob: formData.bvnDateOfBirth,
        firstName: formData.bvnFirstName,
        surname: formData.bvnLastName,
      };

      updatedApplicationForm.applicantDetails = {
        ...previouslySavedData.applicantDetails,
        ...formDataOnboarding,
        bvnVerificationStatus: bvnVerificationStatus,
      };

      const form_ = sanitizeApplicationForm(updatedApplicationForm);
      const res = await this.onboarding.saveApplication(form_);
      await saveData(APPLICATION, res.response);
      console.log(res, "bvn fip res");

      return;
    }
  }

  get successModal() {
    return (
      <Modal
        buttons={[
          {
            onPress: () => {
              this.setState({
                showSuccessModal: false,
              });
              this.props.onSubmit();
            },
            buttonStyle: {
              paddingHorizontal: 10,
            },
            containerStyle: {
              paddingHorizontal: 10,
              width: "100%",
            },
            title: "CONTINUE",
          },
        ]}
        content={
          <View
            style={{
              flex: 0.6,
              justifyContent: "center",
            }}
          >
            <Text big center>
              BVN record successfully validated!
            </Text>
          </View>
        }
        image={require("../../../../../assets/media/images/clap.png")}
        isModalVisible={true}
        size="md"
        title="Success"
        withButtons
        hideCloseButton
      />
    );
  }

  render() {
    const { application } = this.props;
    const bvnVerificationAccordion = (
      <BvnVerificationInformation
        propagateFormErrors={this.state.propagateFormErrors}
        application={application}
        ref={(form) => (this.bvnVerificationForm = form)}
      />
    );

    return (
      <ScrollView>
        {this.state.showSuccessModal && this.successModal}
        {bvnVerificationAccordion}

        <Button
          containerStyle={{
            alignSelf: "center",
            marginBottom: 10,
            width: 150,
          }}
          loading={this.state.isLoading}
          title="NEXT"
          onPressOut={this.onSubmit}
        />
      </ScrollView>
    );
  }
}

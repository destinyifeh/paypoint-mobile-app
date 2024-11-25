import React from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import Button from "../../../components/button";
import Modal from "../../../components/modal";
import { APPLICATION } from "../../../constants";
import { ERROR_STATUS } from "../../../constants/api";
import { BLOCKER } from "../../../constants/dialog-priorities";
import { BVN_LENGTH } from "../../../constants/fields";
import Onboarding from "../../../services/api/resources/onboarding";
import Platform from "../../../services/api/resources/platform";
import { flashMessage } from "../../../utils/dialog";
import navigationService from "../../../utils/navigation-service";
import { sanitizeApplicationForm } from "../../../utils/sanitizers/application-form";
import { loadData, saveData } from "../../../utils/storage";
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
      message: null,
      description: null,
      bvnVerificationStatus: null,
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
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
    const bvnVerificationForm = this.bvnVerificationForm.serializeFormData();

    const isFormValid = this.checkFormValidity(bvnVerificationForm);

    if (!isFormValid) {
      flashMessage(
        "Error",
        "Invalid input. Kindly fill all the required fields",
        BLOCKER
      );
      return;
    }

    const bvnVerificationFormData = this.bvnVerificationForm.serializeFormData();
    this.setState({
      errorMessage: null,
      isLoading: true,
    });

    const formData = {
      ...bvnVerificationFormData,
    };
    const saveAsDraftResponse = await this.platform.verifyBvn(formData);
    const saveAsDraftResponseStatus = saveAsDraftResponse.status;
    const saveAsDraftResponseObj = saveAsDraftResponse.response;
    if (saveAsDraftResponseStatus === ERROR_STATUS) {
      this.setState({
        description: saveAsDraftResponseObj.description,
        message: saveAsDraftResponseObj.message,
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
        message: saveAsDraftResponseObj.message,

        bvnVerificationStatus: saveAsDraftResponseObj.validationStatus,
      });

      let previouslySavedData = JSON.parse(await loadData(APPLICATION));

      const getApplicationResponse = await this.onboarding.getApplicationById(
        previouslySavedData.applicationId
      );
      previouslySavedData = getApplicationResponse.response;
      const updatedApplicationForm = previouslySavedData;

      const bvnVerificationStatus = saveAsDraftResponseObj.validationStatus;
      const formDataOnboarding = {
        dob: formData.bvnDateOfBirth,
        bvn: formData.bvnNumber,
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

      console.log(res, "bvn res for partially verified");
      setTimeout(() => {
        this.setState({
          isLoading: false,
        });
      }, 5000);
      this.showTheAlert(
        "Your BVN Data Is Partially Verified",
        saveAsDraftResponseObj.message
      );
      return;
    } else {
      let previouslySavedData = JSON.parse(await loadData(APPLICATION));

      const getApplicationResponse = await this.onboarding.getApplicationById(
        previouslySavedData.applicationId
      );
      previouslySavedData = getApplicationResponse.response;
      const updatedApplicationForm = previouslySavedData;

      const bvnVerificationStatus = saveAsDraftResponseObj.validationStatus;
      const formDataOnboarding = {
        dob: formData.bvnDateOfBirth,
        bvn: formData.bvnNumber,
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

      console.log(res, "bvn res");

      this.setState({
        isLoading: false,
        showSuccessModal: true,
      });
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
        image={require("../../../assets/media/images/clap.png")}
        isModalVisible={true}
        size="md"
        title="Success"
        withButtons
        hideCloseButton
      />
    );
  }

  render() {
    const bvnVerificationAccordion = (
      <BvnVerificationInformation
        propagateFormErrors={this.state.propagateFormErrors}
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

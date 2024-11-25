import React from "react";
import { ScrollView, View } from "react-native";
import BaseForm from "../../../../../../components/base-form";
import Button from "../../../../../../components/button";
import { FormInput } from "../../../../../../components/form-controls/form-input";
import FormPicker from "../../../../../../components/form-controls/form-picker";
import Text from "../../../../../../components/text";
import {
  COLOUR_BLACK,
  COLOUR_BLUE,
  COLOUR_WHITE,
  FONT_FAMILY_BODY_BOLD,
} from "../../../../../../constants/styles";

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

export class ReportFormCac extends BaseForm {
  requiredFields = ["proposedBusinessName", "lineOfBusiness"];
  constructor() {
    super();
    this.state = {
      form: {
        proposedBusinessName: null,
        lineOfBusiness: null,
      },
      invalidFields: [],
      lineOfBusiness: [],
      buttonDisabled: true,
      isLoading: false,
      invalidName: false,
      savedCacBusinessForm: null,
    };
    //   this.loadCacBusinessNameForm = this.loadCacBusinessNameForm.bind(this);
  }

  componentDidMount() {
    this.checkFormValidity();
    this.updateFormField();

    //   this.loadCacBusinessNameForm();
  }

  componentDidUpdate(prevProps, prevState) {
    // if (
    //   prevState.form.proposedBusinessName !==
    //   this.state.form.proposedBusinessName
    // ) {
    //   console.log("proposedBusinessName changed");
    //   this.checkFormValidity();
    // }
    //   if (prevState.form.lineOfBusiness !== this.state.form.lineOfBusiness) {
    //     this.checkFormValidity();
    //   }
  }

  // async loadCacBusinessNameForm() {
  //   const savedCacBusinessForm = JSON.parse(
  //     await loadData("cacBusinessFormData")
  //   );
  //   console.log("savedCacBusinessForm", savedCacBusinessForm);
  //   if (savedCacBusinessForm != null) {
  //     this.setState({
  //       savedCacBusinessForm: savedCacBusinessForm,
  //     });
  //     console.log("savedCacBusinessFormState", this.state.savedCacBusinessForm);
  //   }
  // }

  // checkNameValidity(name) {
  //   const validBusinessNameInput = validateName(name);
  //   if (!validBusinessNameInput) {
  //     // flashMessage(APP_NAME, "Business name cannot be a word", BLOCKER);
  //     this.setState({
  //       errorMessage: null,
  //       isLoading: false,
  //       invalidName: true,
  //     });
  //   } else {
  //     this.setState({
  //       invalidName: false,
  //       buttonDisabled: true,
  //     });
  //   }
  // }

  checkFormValidity() {
    const formIsComplete = this.state.isComplete;
    const formIsValid = this.state.isValid;
    const formData = this.state.form;
    console.log("VALID REPORT FORM C", formData);

    if (!(formIsComplete && formIsValid)) {
      this.setState({
        buttonDisabled: true,
      });
      return;
    }
    this.setState({});

    return true;
  }

  render() {
    const { onPress, loading, invalidName } = this.props;
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
                Complete The Details Below
              </Text>
            </View>
            <View style={{ marginTop: 2, marginBottom: 5 }}>
              {this.state.invalidName && (
                <Text mid red>
                  Business name cannot be empty & a one word
                </Text>
              )}
            </View>

            <FormInput
              autoCapitalize="name"
              autoCompleteType="email"
              defaultValue={
                this.state.savedCacBusinessForm?.proposedBusinessName
              }
              innerContainerStyle={styles.formInputInnerContainerStyle}
              keyboardType="email-address"
              onChangeText={(proposedBusinessName, isValid) => {
                this.updateFormField({ proposedBusinessName });
                !isValid
                  ? this.addInvalidField("proposedBusinessName")
                  : this.removeInvalidField("proposedBusinessName");

                this.checkFormValidity();
              }}
              onSubmitEditing={() => {
                this.checkFormValidity();
              }}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              placeholder="Placeholder"
              propagateError={this.props.propagateFormErrors}
              showValidIndicator={true}
              text="Proposed Business Name"
              textContentType="emailAddress"
              textInputRef={(input) => (this.proposedBusinessName = input)}
              validators={{
                required: true,
              }}
              hideOptionalLabel={true}
            />

            <FormPicker
              choices={LINE_OF_BUSINESS.map(({ value, name }) => ({
                label: name,
                value: value,
              }))}
              // defaultValue={this.state.savedCacBusinessForm?.lineOfBusiness}
              innerContainerStyle={styles.formInputInnerContainerStyle}
              onSelect={(lineOfBusiness, isValid) => {
                console.log("STARTFORMDATA", lineOfBusiness);
                this.updateFormField({ lineOfBusiness });
                !isValid
                  ? this.addInvalidField("lineOfBusiness")
                  : this.removeInvalidField("lineOfBusiness");
                this.checkFormValidity();
              }}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              propagateError={this.props.propagateFormErrors}
              text="Line Of Business"
              validators={{
                required: true,
              }}
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
          </View>
        </ScrollView>
      </View>
    );
  }
}

import React from "react";
import { ScrollView, View } from "react-native";
import BaseForm from "../../../../../../src/components/base-form";
import FormInput from "../../../../../components/form-controls/form-input";
import Text from "../../../../../components/text";
import {
  COLOUR_BLACK,
  COLOUR_WHITE,
  FONT_FAMILY_BODY_BOLD,
} from "../../../../../constants/styles";
import styles from "../../../../../scenes/aggregator/scenes/home/scenes/pre-setup-agent/styles";

export class TinForm extends BaseForm {
  requiredFields = ["tin", "businessType"];
  constructor() {
    super();

    this.state = {
      form: {
        tin: null,
        businessType: null,
      },
      invalidFields: [],
    };
  }

  componentDidMount() {}
  render() {
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
               Enter your business details
              </Text>
            </View>

            <FormInput
              autoCapitalize="name"
              autoCompleteType="email"
              // defaultValue={this.state.upgradeStatus?.motherMaidenName}
              innerContainerStyle={styles.formInputInnerContainerStyle}
              keyboardType="email-address"
              onChangeText={(tin, isValid) => {
                this.updateFormField({ tin });
                !isValid
                  ? this.addInvalidField("tin")
                  : this.removeInvalidField("tin");
              }}
              onSubmitEditing={() => {}}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              placeholder="Placeholder"
              propagateError={this.props.propagateFormErrors}
              showValidIndicator={true}
              text="Enter your Tax Identification Number (TIN)"
              textContentType="emailAddress"
              textInputRef={(input) => (this.proposedBusinessName = input)}
              validators={{
                required: true,
              }}
              hideOptionalLabel={true}
            />

          </View>
        </ScrollView>
      </View>
    );
  }
}

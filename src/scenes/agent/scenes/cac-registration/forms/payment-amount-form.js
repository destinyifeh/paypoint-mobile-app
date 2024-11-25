import React from "react";
import { View } from "react-native";
import BaseForm from "../../../../../components/base-form";
import FormInput from "../../../../../components/form-controls/form-input";

export class PaymentForm extends BaseForm {
  requiredFields = ["otp"];

  constructor(props) {
    super(props);

    this.state = {
      form: {
        otp: null,
      },
      invalidFields: [],
    };
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          marginHorizontal: 20,
        }}
      >
        <FormInput
          disabled={true}
          defaultValue={"N17,500"}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType="number-pad"
          onChangeText={(otp, isValid) => {
            this.props.setOtp(otp);
            this.updateFormField({ otp });
            !isValid
              ? this.addInvalidField("otp")
              : this.removeInvalidField("otp");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="Amount"
          propagateError={this.props.propagateFormErrors}
          text="Amount"
          textContentType="oneTimeCode"
          textInputRef={(input) => (this.otp = input)}
          validators={{
            length: 12,
            required: true,
          }}
        />

        <FormInput
          disabled={true}
          defaultValue={"CAC Registration"}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType="number-pad"
          onChangeText={(otp, isValid) => {
            this.props.setOtp(otp);
            this.updateFormField({ otp });
            !isValid
              ? this.addInvalidField("otp")
              : this.removeInvalidField("otp");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="Reason"
          text="Reason"
          propagateError={this.props.propagateFormErrors}
          textContentType="oneTimeCode"
          textInputRef={(input) => (this.otp = input)}
          validators={{
            length: 12,
            required: true,
          }}
        />
      </View>
    );
  }
}

import React from "react";
import { View } from "react-native";
import BaseForm from "../../../../components/base-form";
import FormInput from "../../../../components/form-controls/form-input";
import { OTP_LENGTH } from "../../../../constants/fields";

export class OtpForm extends BaseForm {
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
      <View>
        <FormInput
          disabled={this.props.isDisabled}
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
          placeholder="OTP"
          propagateError={this.props.propagateFormErrors}
          textContentType="oneTimeCode"
          textInputRef={(input) => (this.otp = input)}
          validators={{
            length: OTP_LENGTH,
            required: true,
          }}
        />
      </View>
    );
  }
}

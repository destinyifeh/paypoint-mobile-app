import Moment from "moment";
import React from "react";
import FormInput from "../../../../components/form-controls/form-input";
import FormPicker from "../../../../components/form-controls/form-picker";

import BaseForm from "../../../../components/base-form";
import FormPhone from "../../../../components/form-controls/form-phone";
import { MIN_NIGERIA_PHONE_LENGTH } from "../../../../constants/fields";
import Onboarding from "../../../../services/api/resources/onboarding";
import UserManagement from "../../../../services/api/resources/user-management";
import styles from "../../../signup/styles";

const RELATIONSHIP = [
  {
    name: "Aunt",
    value: "Aunt",
  },
  {
    name: "Brother",
    value: "Brother",
  },
  {
    name: "Cousin",
    value: "Cousin",
  },
  {
    name: "Daughter",
    value: "Daughter",
  },
  {
    name: "Father",
    value: "Father",
  },
  {
    name: "Guardian",
    value: "Guardian",
  },
  {
    name: "Mother",
    value: "Mother",
  },
  {
    name: "Nephew/Niece",
    value: "Nephew/Niece",
  },
  {
    name: "Sister",
    value: "Sister",
  },
  {
    name: "Spouse",
    value: "Spouse",
  },
  {
    name: "Son",
    value: "Son",
  },
  {
    name: "Uncle",
    value: "Uncle",
  },
];

export default class PreSetupNOKForm extends BaseForm {
  requiredFields = ["phone", "email", "bvn", "gender", "dateOfBirth"];

  state = {
    form: {},
    invalidFields: [],
  };

  userManagement = new UserManagement();
  onboarding = new Onboarding();

  constructor() {
    super();

    this.fields = [
      this.email,
      this.address,
      this.bvn,
      this.phone,
      this.lga,
      this.relationship,
      this.gender,
    ];
  }

  componentDidMount() {
    const nextOfKin =
      this.props.application.nextOfKin ||
      this.props.application?.applicantDetails?.nextOfKin ||
      {};
    this.initiate(nextOfKin);
  }

  initiate = (nextOfKin) => {
    if (nextOfKin !== {}) {
      if (nextOfKin.emailAddress) {
        this.props.evaluateInvalidField({ emailAddress: 123 });
      }
      if (nextOfKin.firstName) {
        this.props.evaluateInvalidField({ firstName: 123 });
      }
      if (nextOfKin.address) {
        this.props.evaluateInvalidField({ address: 123 });
      }
      if (nextOfKin.phoneNumber) {
        this.props.evaluateInvalidField({ phoneNumber: 123 });
      }
      if (nextOfKin.relationship) {
        this.props.evaluateInvalidField({ relationship: 123 });
      }
    }

    this.setState({
      form: nextOfKin,
    });
  };
  serializeFormData() {
    const { gender, phone, email, bvn, dateOfBirth } = this.state.form;

    return {
      gender,
      phoneNumber: `+234${phone.slice(-10)}`,
      emailAddress: email,
      bvn,
      dob: Moment(dateOfBirth, "DD-MM-YYYY").format("YYYY-MM-DD"),
    };
  }

  render() {
    return (
      <React.Fragment>
        <FormInput
          defaultValue={this.state.form.firstName}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(firstName) => {
            this.updateFormField({ firstName });
            this.props.evaluateInvalidField({ firstName }, 5);
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder=""
          propagateError={this.props.propagateFormErrors}
          showValidIndicator
          text="Name"
          textInputRef={(input) => (this.firstName = input)}
          validators={{
            required: true,
            minLength: 5,
          }}
        />

        <FormPhone
          autoCompleteType="tel"
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType="number-pad"
          onChangeText={(phoneNumber) => {
            this.updateFormField({
              phoneNumber,
            });
            this.props.evaluateInvalidField(
              { phoneNumber },
              MIN_NIGERIA_PHONE_LENGTH
            );
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="***********"
          defaultValue={this.state.form?.phoneNumber}
          propagateError={this.props.propagateFormErrors}
          onSubmitEditing={() => {
            this.relationship.focus();
          }}
          showValidIndicator={true}
          text="Phone Number"
          textInputRef={(input) => (this.phoneNumber = input)}
          validators={{
            minLength: MIN_NIGERIA_PHONE_LENGTH,
            required: true,
          }}
        />

        <FormInput
          defaultValue={this.state.form.emailAddress}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(emailAddress) => {
            this.updateFormField({ emailAddress });
            this.props.evaluateInvalidField({ emailAddress }, 5);
          }}
          autoCompleteType="email"
          autoCapitalize="none"
          keyboardType="email-address"
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="johndoe@example.com"
          propagateError={this.props.propagateFormErrors}
          showValidIndicator
          text="Email Address"
          textContentType="emailAddress"
          textInputRef={(input) => (this.emailAddress = input)}
          validators={{
            email: true,
            required: true,
          }}
        />
        <FormInput
          defaultValue={this.state.form.address}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(address) => {
            this.updateFormField({ address });
            this.props.evaluateInvalidField({ address }, 5);
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder=""
          propagateError={this.props.propagateFormErrors}
          showValidIndicator
          text="Home Address"
          textInputRef={(input) => (this.address = input)}
          validators={{
            required: true,
            minLength: 5,
          }}
        />

        <FormPicker
          choices={RELATIONSHIP.map(({ name, value }) => ({
            label: name,
            value,
          }))}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={(relationship, isValid) => {
            this.updateFormField({
              relationship,
            });
            this.props.evaluateInvalidField({ relationship });
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          propagateError={this.props.propagateFormErrors}
          defaultValue={this.state.form.relationship}
          text="Relationship"
          validators={{
            required: true,
          }}
        />
      </React.Fragment>
    );
  }
}

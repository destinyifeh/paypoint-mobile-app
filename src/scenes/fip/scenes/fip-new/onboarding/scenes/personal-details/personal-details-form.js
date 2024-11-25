import Moment from "moment";
import React from "react";
import FormInput from "../../../../../../../components/form-controls/form-input";
import FormPicker from "../../../../../../../components/form-controls/form-picker";

import BaseForm from "../../../../../../../components/base-form";
import FormPhone from "../../../../../../../components/form-controls/form-phone";
import { ERROR_STATUS } from "../../../../../../../constants/api";
import {
  MIN_NAME_LENGTH,
  MIN_NIGERIA_PHONE_LENGTH,
} from "../../../../../../../constants/fields";
import UserManagement from "../../../../../../../services/api/resources/user-management";
import { loadData } from "../../../../../../../utils/storage";
import styles from "../../styles";
const AGENT_TYPES = [
  {
    name: "Agent",
    value: 4,
  },
  {
    name: "Super Agent",
    value: 3,
  },
];

export default class FipPersonalDetailsAgentForm extends BaseForm {
  requiredFields = [
    "aggregator",
    //"firstName",
    //"lastName",
    //"middleName",
    //"bvnPhone",
    "walletPhone",
    "email",
    // "gender",
    "agentType",
    //"dateOfBirth",
    "mothersMaidenName",
    "placeOfBirth",
  ];

  state = {
    form: {},
    invalidFields: [],
  };

  userManagement = new UserManagement();

  constructor() {
    super();

    this.matchUserEmailAndMobile = this.matchUserEmailAndMobile.bind(this);

    this.fields = [
      this.firstName,
      this.lastName,
      this.email,
      this.middleName,
      this.gender,
      this.walletPhone,
      this.bvnPhone,
      this.dateOfBirth,
      this.agentType,
      this.aggregator,
      this.mothersMaidenName,
      this.placeOfBirth,
    ];
  }

  async componentDidMount() {
    const applicantDetails = this.props.application.applicantDetails || {};
    const agentValidatedDetails = JSON.parse(await loadData("fipAgentBvnData"));
    console.log(this.props.validatedData, "agent validated Data");

    const theApplicantDetails = {
      ...applicantDetails,
      ...this.props.validatedData,
    };
    console.log(this.props.application, "appli");
    this.setState({
      applicantDetails,
      form: this.serializeApiData(theApplicantDetails),
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.application !== prevProps.application) {
      const applicantDetails = this.props.application.applicantDetails || {};

      this.setState({
        applicantDetails,
        form: this.serializeApiData(applicantDetails),
      });
    }
  }

  async checkPhoneValidity() {
    // TODO make API Call here
    return await this.userManagement.checkUserExistsOnPassport(
      this.state.form.walletPhone
    );
  }

  async checkEmailValidity() {
    // TODO make API Call here
    console.log("MAKING API CALL...");

    const result = await this.userManagement.checkUserExistsOnPassport(
      this.state.form.email
    );

    console.log({ result });

    return result;
  }

  serializeApiData(applicantDetails) {
    console.log(applicantDetails, "demaa");
    return {
      firstName: applicantDetails?.firstName,
      lastName: applicantDetails?.surname || applicantDetails?.lastName,
      middleName: applicantDetails?.middleName,
      bvnPhone:
        applicantDetails?.bvnPhoneNumber || applicantDetails?.phoneNumber,
      walletPhone: `${
        applicantDetails?.walletPhoneNumber
          ? `0${applicantDetails.walletPhoneNumber.slice(3)}`
          : ""
      }`,
      email: applicantDetails?.emailAddress,
      dateOfBirth: applicantDetails?.dob || applicantDetails?.dateOfBirth,
      agentType: this.getAgentType(this.props?.application?.agentTypeId),
      aggregator: this.getAggregator(this.props?.application?.referralCode),
      gender: applicantDetails?.gender,
      placeOfBirth: applicantDetails?.placeOfBirth,
      mothersMaidenName: applicantDetails?.mothersMaidenName,
    };
  }

  serializeFormData() {
    const {
      agentType,
      aggregator,
      firstName,
      middleName,
      lastName,
      walletPhone,
      email,
      bvnPhone,
      dateOfBirth,
      gender,

      mothersMaidenName,
      placeOfBirth,
    } = this.state.form;

    return {
      agentTypeId: agentType,
      firstName,
      middleName,
      referralCode: aggregator,
      surname: lastName,
      phoneNumber: `+234${bvnPhone.slice(1)}`,
      walletPhoneNumber: `+234${walletPhone.slice(1)}`,
      mothersMaidenName,
      placeOfBirth,
      emailAddress: email,
      gender: gender.toUpperCase(),
      dob: Moment(dateOfBirth, "DD-MM-YYYY").format("YYYY-MM-DD"),
      kycId: this.props.kycId,
      applicationId: this.props.application?.applicationId || 0,
      howYouHeardAboutUs: "Referred by an Agent",
    };
  }

  async matchUserEmailAndMobile() {
    this.setState({
      emailAndPhoneDoMatch: null,
    });

    const result = await this.userManagement.matchUserEmailAndMobile(
      this.state.form.email,
      this.state.form.phone
    );

    console.log({ result });

    return result;
  }

  getAggregator = (agentCode) => {
    const sa = this.props.superAgents?.find(
      (agent) => agent.referralCode === agentCode
    )?.referralCode;

    return sa;
  };

  getAgentType = (agentType) => {
    const theAgent = AGENT_TYPES?.find((agent) => agent.value === agentType)
      ?.value;
    return theAgent;
  };

  render() {
    const { superAgents } = this.props;

    return (
      <React.Fragment>
        <FormInput
          autoCompleteType="name"
          disabled={true}
          defaultValue={this.state.form.firstName}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(firstName, isValid) => {
            this.updateFormField({
              firstName,
            });
            !isValid
              ? this.addInvalidField("firstName")
              : this.removeInvalidField("firstName");
          }}
          onSubmitEditing={() => {
            this.middleName.focus();
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder=""
          propagateError={this.props.propagateFormErrors}
          text="First Name"
          textInputRef={(input) => (this.firstName = input)}
          validators={{
            // minLength: MIN_NAME_LENGTH,
            regex: "name",
            required: true,
          }}
        />

        <FormInput
          autoCompleteType="name"
          disabled={true}
          defaultValue={this.state.form.middleName}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(middleName, isValid) => {
            this.updateFormField({
              middleName,
            });
            !isValid
              ? this.addInvalidField("middleName")
              : this.removeInvalidField("middleName");
          }}
          onSubmitEditing={() => {
            this.lastName.focus();
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder=""
          //propagateError={this.props.propagateFormErrors}
          text="Middle Name"
          textInputRef={(input) => (this.middleName = input)}
          validators={{
            // minLength: MIN_NAME_LENGTH,
            regex: "name",
            required: true,
          }}
        />

        <FormInput
          autoCompleteType="name"
          disabled={true}
          defaultValue={this.state.form.lastName}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(lastName, isValid) => {
            this.updateFormField({
              lastName,
            });
            !isValid
              ? this.addInvalidField("lastName")
              : this.removeInvalidField("lastName");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder=""
          propagateError={this.props.propagateFormErrors}
          onSubmitEditing={() => {
            this.bvnPhone.focus();
          }}
          text="Last Name"
          textInputRef={(input) => (this.lastName = input)}
          validators={{
            minLength: MIN_NAME_LENGTH,
            regex: "name",
            required: true,
          }}
        />

        <FormPhone
          autoCompleteType="tel"
          disabled={true}
          defaultValue={
            this.state.form.bvnPhone ? this.state.form.bvnPhone : ""
          }
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType="number-pad"
          onChangeText={(bvnPhone, isValid) => {
            this.updateFormField({ bvnPhone });
            !isValid
              ? this.addInvalidField("bvnPhone")
              : this.removeInvalidField("bvnPhone");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="08012345678"
          propagateError={this.props.propagateFormErrors}
          onSubmitEditing={() => {
            this.email.focus();
          }}
          text="BVN Phone Number"
          textInputRef={(input) => (this.bvnPhone = input)}
          validators={{
            required: true,
          }}
        />

        <FormInput
          autoCapitalize="none"
          autoCompleteType="email"
          defaultValue={this.state.form.email}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType="email-address"
          leftIcon="mail"
          onChangeText={(email, isValid) => {
            this.updateFormField({ email });
            !isValid
              ? this.addInvalidField("email")
              : this.removeInvalidField("email");
          }}
          onSubmitEditing={() => {
            this.dateOfBirth.focus();
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="Your email address"
          propagateError={this.props.propagateFormErrors}
          showValidIndicator={true}
          text="Email Address"
          textContentType="emailAddress"
          textInputRef={(input) => (this.email = input)}
          validators={{
            asyncFunction_: {
              errorToDisplay: "Email already in use.",
              func: this.checkEmailValidity.bind(this),
              test: ({ status }) => {
                console.log(status);

                // If response is 404 NOT FOUND, return TRUE (GOOD).
                return status === ERROR_STATUS;
              },
            },
            email: true,
            required: true,
          }}
        />
        <FormInput
          autoCapitalize="none"
          disabled={true}
          defaultValue={this.state.form.dateOfBirth}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(dateOfBirth, isValid) => {
            this.updateFormField({
              dateOfBirth,
            });
            !isValid
              ? this.addInvalidField("dateOfBirth")
              : this.removeInvalidField("dateOfBirth");
          }}
          onSubmitEditing={() => {
            this.gender.focus();
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder=""
          propagateError={this.props.propagateFormErrors}
          text="Date of Birth"
          textInputRef={(input) => (this.dateOfBirth = input)}
          validators={{
            required: true,
          }}
        />
        <FormInput
          autoCapitalize="none"
          disabled={true}
          defaultValue={this.state.form.gender}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(gender, isValid) => {
            this.updateFormField({
              gender,
            });
            !isValid
              ? this.addInvalidField("gender")
              : this.removeInvalidField("gender");
          }}
          onSubmitEditing={() => {
            this.walletPhone.focus();
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder=""
          propagateError={this.props.propagateFormErrors}
          text="Gender"
          textInputRef={(input) => (this.gender = input)}
          validators={{
            required: true,
          }}
        />

        <FormPhone
          autoCompleteType="tel"
          defaultValue={
            this.state.form.walletPhone ? this.state.form.walletPhone : ""
          }
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType="number-pad"
          onChangeText={(walletPhone, isValid) => {
            this.updateFormField({
              walletPhone,
            });
            !isValid
              ? this.addInvalidField("walletPhone")
              : this.removeInvalidField("walletPhone");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="08012345678"
          propagateError={this.props.propagateFormErrors}
          onSubmitEditing={() => {
            this.aggregator.focus();
          }}
          showValidIndicator={true}
          text="Preferred Wallet Number"
          textInputRef={(input) => (this.walletPhone = input)}
          validators={{
            asyncFunction_: {
              errorToDisplay: "Phone number already in use.",
              func: this.checkPhoneValidity.bind(this),
              test: ({ status }) => {
                console.log(status);

                // If response is 404 NOT FOUND, return TRUE (GOOD).
                return status === ERROR_STATUS;
              },
            },
            length: MIN_NIGERIA_PHONE_LENGTH,
            required: true,
          }}
        />

        <FormInput
          autoCompleteType="street-address"
          defaultValue={this.state.form.placeOfBirth}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(placeOfBirth, isValid) => {
            this.updateFormField({ placeOfBirth });
            !isValid
              ? this.addInvalidField("placeOfBirth")
              : this.removeInvalidField("placeOfBirth");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="Your place of birth"
          propagateError={this.props.propagateFormErrors}
          text="Place of birth"
          textInputRef={(input) => (this.placeOfBirth = input)}
          validators={{
            //minLength: MIN_ADDRESS_LENGTH,
            // regex: "sentence",
            required: true,
          }}
        />
        <FormInput
          autoCompleteType="name"
          defaultValue={this.state.form.mothersMaidenName}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(mothersMaidenName, isValid) => {
            this.updateFormField({ mothersMaidenName });
            !isValid
              ? this.addInvalidField("mothersMaidenName")
              : this.removeInvalidField("mothersMaidenName");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="Your mother's maiden name"
          propagateError={this.props.propagateFormErrors}
          text="Mother's Maiden Name"
          textInputRef={(input) => (this.mothersMaidenName = input)}
          validators={{
            minLength: MIN_NAME_LENGTH,
            regex: "name",
            required: true,
          }}
        />

        <FormPicker
          choices={
            superAgents
              ? superAgents.map(({ businessName, referralCode }) => ({
                  label: businessName,
                  value: referralCode,
                }))
              : []
          }
          defaultValue={this.state.form.aggregator}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={(aggregator, isValid) => {
            this.updateFormField({
              aggregator,
            });

            !isValid
              ? this.addInvalidField("aggregator")
              : this.removeInvalidField("aggregator");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          propagateError={this.props.propagateFormErrors}
          text="Select Aggregator"
          validators={{
            required: true,
          }}
          ref={(input) => (this.aggregator = input)}
        />

        <FormPicker
          choices={AGENT_TYPES.map(({ name, value }) => ({
            label: name,
            value,
          }))}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={(agentType, isValid) => {
            this.updateFormField({
              agentType,
            });
            !isValid
              ? this.addInvalidField("agentType")
              : this.removeInvalidField("agentType");
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          propagateError={this.props.propagateFormErrors}
          defaultValue={this.state.form.agentType}
          text="Select Agent Class"
          validators={{
            required: true,
          }}
        />
      </React.Fragment>
    );
  }
}

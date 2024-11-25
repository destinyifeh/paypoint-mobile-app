import moment from "moment";
import React from "react";
import { ScrollView, View } from "react-native";
import BaseForm from "../../../../../../src/components/base-form";
import Button from "../../../../../components/button";
import FormDate from "../../../../../components/form-controls/form-date";
import FormInput from "../../../../../components/form-controls/form-input";
import FormPicker from "../../../../../components/form-controls/form-picker";
import Text from "../../../../../components/text";
import { NIGERIA } from "../../../../../constants";
import { MIN_NIGERIA_PHONE_LENGTH, PAST_DATE } from "../../../../../constants/fields";
import {
  COLOUR_BLACK,
  COLOUR_BLUE,
  COLOUR_WHITE,
  FONT_FAMILY_BODY_BOLD,
} from "../../../../../constants/styles";
import CountriesStatesLga from "../../../../../fixtures/countries_states_lgas.json";
import styles from "../../../../../scenes/aggregator/scenes/home/scenes/pre-setup-agent/styles";
import Platform from "../../../../../services/api/resources/platform";
import { loadData } from "../../../../../utils/storage";
import { computePastDate } from "../../../../../utils/calendar";

const GENDER_TYPES = [
  {
    name: "MALE",
    value: "MALE",
    id: 1,
  },
  {
    name: "FEMALE",
    value: "FEMALE",
    id: 2,
  },
];

const COUNTRY = [
  {
    name: "Nigeria",
    value: "Nigeria",
    id: 1,
  },
];
const currentDateStr = moment().format("YYYY-MM-DD[T]HH:mm:ss");

export class PersonalDetailsForm extends BaseForm {
  platform = new Platform();
  requiredFields = [
    "surname",
    "firstname",
    "dateOfBirth",
    "phoneNumber",
    "gender",
    "country",
    "state",
    "city",
    "lga",
    "postalCode",
    "streetNumber",
    "houseAddress",
    "emailAddress",
  ];
  constructor() {
    super();

    this.state = {
      form: {
        surname: null,
        firstname: null,
        dateOfBirth: null,
        phoneNumber: null,
        gender: null,
        country: null,
        state: null,
        city: null,
        lga: null,
        streetNumber: null,
        houseAddress: null,
        postalCode: null,
        emailAddress: null,
      },
      invalidFields: [],
      states: [],
      lgas: [],
      countries: [],
      bvnRecord: {},
      buttonDisabled: true,
      isLoading: false,
      assistedCacRegType: false,
      currentDate: currentDateStr,
      startDate: moment()
        .subtract(900, "months")
        .format("YYYY-MM-DD[T00:00:00]"),
      endDate: moment()
        .subtract(214, "months")
        .format("YYYY-MM-DD[T00:00:00]"),
      lgName: null,
      stateName: null,
      savedlgas: [],
      cachedData: false,
    };

    this.fetchCountries = this.fetchCountries.bind(this);
    this.fetchStates = this.fetchStates.bind(this);
    this.onStateSelect = this.onStateSelect.bind(this);
    this.getBvnRecord = this.getBvnRecord.bind(this);
    this.loadRegType = this.loadRegType.bind(this);
    this.loadCacpersonalDetailsForm = this.loadCacpersonalDetailsForm.bind(
      this
    );
  }

  componentDidMount() {
    this.fetchCountries();
    this.fetchStates();
    this.loadCacpersonalDetailsForm();
    this.loadRegType();

    this.setState((prev) => ({
      ...prev,
      surname: null,
      firstname: null,
      dateOfBirth: null,
      phoneNumber: null,
      gender: null,
      country: null,
      state: null,
      city: null,
      lga: null,
      streetNumber: null,
      houseAddress: null,
      postalCode: null,
      emailAddress: null,
      savedCacPersonalForm: null,
      stateName: null,
    }));
  }

  async loadCacpersonalDetailsForm() {
    const savedCacPersonalForm = JSON.parse(
      await loadData("cacRegPersonalFormData")
    );
    console.log("savedCacPersonalForm", savedCacPersonalForm);
    if (savedCacPersonalForm != null) {
      this.setState({
        savedCacPersonalForm: savedCacPersonalForm,
        cachedData: true,
      });
      console.log("savedCacPersonalForm", this.state.savedCacPersonalForm);
      const { states } = this.state;
      const idState = this.state.savedCacPersonalForm.state;
      const propStateName = states.find((item) => item.id === idState);
      console.log("personalState", propStateName.name);
      this.setState(
        {
          form: {
            ...this.state.form, // Spread the existing form values
            state: this.state.savedCacPersonalForm.state, // Update only the "state" field
            lga: this.state.savedCacPersonalForm.lga,
            country: this.state.savedCacPersonalForm.country,
            dateOfBirth: this.state.savedCacPersonalForm.dateOfBirth,
            emailAddress: this.state.savedCacPersonalForm.emailAddress,
            firstname: this.state.savedCacPersonalForm.firstname,
            gender: this.state.savedCacPersonalForm.gender,
            phoneNumber: this.state.savedCacPersonalForm.phoneNumber,
            surname: this.state.savedCacPersonalForm.surname,
          },
          stateName: propStateName ? propStateName.name : null,
          savedlgas: propStateName.lgas,
        },
        () => {
          console.log("propstate", this.state.stateName);
        }
      );
      this.checkFormValidity();
      const { savedlgas } = this.state;
      console.log("PROPSTATE2", savedlgas);
      const idLg = this.state.savedCacPersonalForm.lga;
      console.log("PROPSTATE3", idLg);
      const lgNmae = savedlgas.find((item) => item.id === idLg);
      this.setState({
        lgName: lgNmae ? lgNmae.name : null,
      });
      this.checkFormValidity();
      console.log("PROPSTATE4", this.state.lgName);
    }
  }

  async loadRegType() {
    const savedCacRegType = JSON.parse(await loadData("CAC REG TYPE"));
    console.log("savedCacRegTypePersonal1", savedCacRegType);
    if (savedCacRegType === "assisted") {
      this.setState({ assistedCacRegType: true });
    } else {
      this.setState({ assistedCacRegType: false });
      this.getBvnRecord();
    }
    console.log("savedCacRegTypePersonal2", this.state.assistedCacRegType);
  }

  checkFormValidity() {
    const formIsComplete = this.state.isComplete;
    const formIsValid = this.state.isValid;
    const formData = this.state;
    console.log("VALID PERSONAL FORM A", formIsValid);
    console.log("VALID PERSONAL FORM B", formIsComplete);
    console.log("VALID PERSONAL FORM C", formData);

    if (!(formIsComplete && formIsValid)) {
      this.setState({
        buttonDisabled: true,
      });
      return;
    }
    this.setState({
      buttonDisabled: false,
    });

    console.log("PERSONAL FORM C", this.state.buttonDisabled);

    return true;
  }

  fetchStates() {
    const nigeria = CountriesStatesLga.find((value) => value.name === NIGERIA);
    this.setState({
      states: nigeria.states,
    });
    console.log("STATES", nigeria.states);
  }

  fetchCountries() {
    this.setState({
      countries: CountriesStatesLga.map((value) => ({
        id: value.id,
        name: value.name,
      })),
    });
  }

  async getBvnRecord() {
    const response = await this.platform.getRecordFromBvn();
    console.log("BVNRESPONSE", response.response.data);
    this.setState({
      bvnRecord: response.response.data,
    });
    console.log("RECORD STATE", this.state.bvnRecord);
  }

  onStateSelect(stateId) {
    console.log("STATEID", stateId);
    const country = CountriesStatesLga.find((value) => value.name == NIGERIA);
    console.log("STATEID2", country);

    const state = country.states.find((value) => value.id == stateId);

    this.setState({
      lgas: state ? state.lgas : [],
    });
  }

  render() {
    const { onPress, loading } = this.props;
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
                Personal Details
              </Text>
            </View>

            {this.state.assistedCacRegType ? (
              <FormInput
                autoCapitalize="name"
                autoCompleteType="email"
                defaultValue={this.state.savedCacPersonalForm?.surname}
                disabled={false}
                innerContainerStyle={styles.formInputInnerContainerStyle}
                keyboardType="email-address"
                onChangeText={(surname, isValid) => {
                  this.updateFormField({ surname });
                  !isValid
                    ? this.addInvalidField("surname")
                    : this.removeInvalidField("surname");
                  this.checkFormValidity();
                }}
                onSubmitEditing={() => {
                  this.checkFormValidity();
                }}
                outerContainerStyle={styles.formInputOuterContainerStyle}
                placeholder="Placeholder"
                propagateError={this.props.propagateFormErrors}
                showValidIndicator={true}
                text="Surname"
                textContentType="emailAddress"
                textInputRef={(input) => (this.surname = input)}
                validators={{
                  required: true,
                }}
                hideOptionalLabel={true}
              />
            ) : (
              <FormInput
                autoCapitalize="name"
                autoCompleteType="email"
                disabled={true}
                defaultValue={this.state.bvnRecord?.bvnLastName}
                innerContainerStyle={styles.formInputInnerContainerStyle}
                keyboardType="email-address"
                onChangeText={(surname, isValid) => {
                  this.updateFormField({ surname });
                  !isValid
                    ? this.addInvalidField("surname")
                    : this.removeInvalidField("surname");
                  this.checkFormValidity();
                }}
                onSubmitEditing={() => {
                  this.checkFormValidity();
                }}
                outerContainerStyle={styles.formInputOuterContainerStyle}
                placeholder="Placeholder"
                propagateError={this.props.propagateFormErrors}
                showValidIndicator={true}
                text="Surname"
                textContentType="emailAddress"
                textInputRef={(input) => (this.surname = input)}
                validators={{
                  required: true,
                }}
                hideOptionalLabel={true}
              />
            )}

            {this.state.assistedCacRegType ? (
              <FormInput
                autoCapitalize="name"
                disabled={false}
                defaultValue={this.state.savedCacPersonalForm?.firstname}
                autoCompleteType="email"
                innerContainerStyle={styles.formInputInnerContainerStyle}
                keyboardType="email-address"
                onChangeText={(firstname, isValid) => {
                  this.updateFormField({ firstname });
                  !isValid
                    ? this.addInvalidField("firstname")
                    : this.removeInvalidField("firstname");
                  this.checkFormValidity();
                }}
                onSubmitEditing={() => {
                  this.checkFormValidity();
                }}
                outerContainerStyle={styles.formInputOuterContainerStyle}
                placeholder="Placeholder"
                propagateError={this.props.propagateFormErrors}
                showValidIndicator={true}
                text="First Name"
                textContentType="emailAddress"
                textInputRef={(input) => (this.firstname = input)}
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
                defaultValue={this.state.bvnRecord?.bvnFirstName}
                innerContainerStyle={styles.formInputInnerContainerStyle}
                keyboardType="email-address"
                onChangeText={(firstname, isValid) => {
                  this.updateFormField({ firstname });
                  !isValid
                    ? this.addInvalidField("firstname")
                    : this.removeInvalidField("firstname");
                }}
                onSubmitEditing={() => {}}
                outerContainerStyle={styles.formInputOuterContainerStyle}
                placeholder="Placeholder"
                propagateError={this.props.propagateFormErrors}
                showValidIndicator={true}
                text="First Name"
                textContentType="emailAddress"
                textInputRef={(input) => (this.firstname = input)}
                validators={{
                  required: true,
                }}
                hideOptionalLabel={true}
              />
            )}

            {this.state.assistedCacRegType ? (
              <FormInput
                autoCapitalize="name"
                disabled={false}
                defaultValue={this.state.savedCacPersonalForm?.emailAddress}
                autoCompleteType="email"
                innerContainerStyle={styles.formInputInnerContainerStyle}
                keyboardType="email-address"
                onChangeText={(emailAddress, isValid) => {
                  this.updateFormField({ emailAddress });
                  !isValid
                    ? this.addInvalidField("emailAddress")
                    : this.removeInvalidField("emailAddress");
                  this.checkFormValidity();
                }}
                onSubmitEditing={() => {
                  this.checkFormValidity();
                }}
                outerContainerStyle={styles.formInputOuterContainerStyle}
                placeholder="Placeholder"
                propagateError={this.props.propagateFormErrors}
                showValidIndicator={true}
                text="Email Address"
                textContentType="emailAddress"
                textInputRef={(input) => (this.emailAddress = input)}
                validators={{
                  required: true,
                  email: true,
                }}
                hideOptionalLabel={true}
              />
            ) : (
              <FormInput
                autoCapitalize="name"
                disabled={true}
                autoCompleteType="email"
                defaultValue={this.state.bvnRecord.businessEmail}
                innerContainerStyle={styles.formInputInnerContainerStyle}
                keyboardType="email-address"
                onChangeText={(emailAddress, isValid) => {
                  this.updateFormField({ emailAddress });
                  !isValid
                    ? this.addInvalidField("emailAddress")
                    : this.removeInvalidField("emailAddress");
                }}
                onSubmitEditing={() => {}}
                outerContainerStyle={styles.formInputOuterContainerStyle}
                placeholder="Placeholder"
                propagateError={this.props.propagateFormErrors}
                showValidIndicator={true}
                text="Email Address"
                textContentType="emailAddress"
                textInputRef={(input) => (this.emailAddress = input)}
                validators={{
                  required: true,
                  email: true,
                }}
                hideOptionalLabel={true}
              />
            )}

            {this.state.assistedCacRegType ? (
              <FormDate
                innerContainerStyle={styles.formInputInnerContainerStyle}
                defaultValue={this.state.savedCacPersonalForm?.dateOfBirth}
                // maxDate={moment(this.state.endDate, "YYYY-MM-DD").format(
                //   "DD-MM-YYYY"
                // )}
                // minDate={moment(this.state.startDate, "YYYY-MM-DD").format(
                //   "DD-MM-YYYY"
                // )}
                maxDate={computePastDate(18, "years")}
                minDate={computePastDate(PAST_DATE)}
                onDateSelect={(dateOfBirth, isValid) => {
                  this.updateFormField({ dateOfBirth });
                  !isValid
                    ? this.addInvalidField("dateOfBirth")
                    : this.removeInvalidField("dateOfBirth");
                  this.checkFormValidity();
                }}
                text="Date of Birth:"
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
            ) : (
              <FormInput
                autoCapitalize="name"
                disabled={true}
                autoCompleteType="email"
                defaultValue={this.state.bvnRecord.bvnDateOfBirth}
                innerContainerStyle={styles.formInputInnerContainerStyle}
                keyboardType="email-address"
                onChangeText={(dateOfBirth, isValid) => {
                  this.updateFormField({ dateOfBirth });
                  !isValid
                    ? this.addInvalidField("dateOfBirth")
                    : this.removeInvalidField("dateOfBirth");
                  this.checkFormValidity();
                }}
                onSubmitEditing={() => {
                  this.checkFormValidity();
                }}
                outerContainerStyle={styles.formInputOuterContainerStyle}
                placeholder="Placeholder"
                propagateError={this.props.propagateFormErrors}
                showValidIndicator={true}
                text="DOB"
                textContentType="emailAddress"
                textInputRef={(input) => (this.dateOfBirth = input)}
                validators={{
                  required: true,
                }}
                hideOptionalLabel={true}
              />
            )}

            {this.state.assistedCacRegType ? (
              <FormInput
                autoCompleteType="tel"
                autoCapitalize="name"
                disabled={false}
                defaultValue={this.state.savedCacPersonalForm?.phoneNumber}
                innerContainerStyle={styles.formInputInnerContainerStyle}
                keyboardType="number-pad"
                onChangeText={(phoneNumber, isValid) => {
                  this.updateFormField({ phoneNumber });
                  !isValid
                    ? this.addInvalidField("phoneNumber")
                    : this.removeInvalidField("phoneNumber");
                  this.checkFormValidity();
                }}
                onSubmitEditing={() => {
                  this.checkFormValidity();
                }}
                outerContainerStyle={styles.formInputOuterContainerStyle}
                placeholder="Placeholder"
                propagateError={this.props.propagateFormErrors}
                showValidIndicator={true}
                text="Phone Number"
                textContentType="emailAddress"
                textInputRef={(input) => (this.phoneNumber = input)}
                validators={{
                  required: true,
                  length: [MIN_NIGERIA_PHONE_LENGTH, 13],
                }}
                hideOptionalLabel={true}
              />
            ) : (
              <FormInput
                autoCapitalize="name"
                disabled={true}
                autoCompleteType="email"
                defaultValue={this.state.bvnRecord.agentMobileNo}
                innerContainerStyle={styles.formInputInnerContainerStyle}
                keyboardType="email-address"
                onChangeText={(phoneNumber, isValid) => {
                  this.updateFormField({ phoneNumber });
                  !isValid
                    ? this.addInvalidField("phoneNumber")
                    : this.removeInvalidField("phoneNumber");
                  this.checkFormValidity();
                }}
                onSubmitEditing={() => {
                  this.checkFormValidity();
                }}
                outerContainerStyle={styles.formInputOuterContainerStyle}
                placeholder="Placeholder"
                propagateError={this.props.propagateFormErrors}
                showValidIndicator={true}
                text="Phone Number"
                textContentType="emailAddress"
                textInputRef={(input) => (this.phoneNumber = input)}
                validators={{
                  required: true,
                  length: [MIN_NIGERIA_PHONE_LENGTH, 13],
                }}
                hideOptionalLabel={true}
              />
            )}

            {this.state.assistedCacRegType ? (
              <FormPicker
                choices={GENDER_TYPES.map(({ id, name }) => ({
                  label: name,
                  value: id,
                }))}
                defaultValue={
                  this.state.cachedData &&
                  this.state.savedCacPersonalForm.gender
                }
                innerContainerStyle={styles.formInputInnerContainerStyle}
                onSelect={(gender, isValid) => {
                  console.log("gender", gender);
                  this.updateFormField({ gender });
                  !isValid
                    ? this.addInvalidField("gender")
                    : this.removeInvalidField("gender");
                  this.checkFormValidity();
                }}
                outerContainerStyle={styles.formInputOuterContainerStyle}
                propagateError={this.props.propagateFormErrors}
                text="Gender"
                validators={{
                  required: true,
                }}
              />
            ) : (
              <FormPicker
                choices={GENDER_TYPES.map(({ id, name }) => ({
                  label: name,
                  value: id,
                }))}
                disabled={true}
                defaultValue={
                  this.state.cachedData &&
                  this.state.savedCacPersonalForm?.gender
                }
                innerContainerStyle={styles.formInputInnerContainerStyle}
                onSelect={(gender, isValid) => {
                  console.log("gender", gender);
                  this.updateFormField({ gender });
                  !isValid
                    ? this.addInvalidField("gender")
                    : this.removeInvalidField("gender");
                  this.checkFormValidity();
                }}
                outerContainerStyle={styles.formInputOuterContainerStyle}
                propagateError={this.props.propagateFormErrors}
                text="Gender"
                validators={{
                  required: true,
                }}
              />
              // <FormInput
              //   autoCapitalize="name"
              //   disabled={true}
              //   autoCompleteType="email"
              //   defaultValue={this.state.bvnRecord.bvnGender}
              //   innerContainerStyle={styles.formInputInnerContainerStyle}
              //   keyboardType="email-address"
              //   onChangeText={(gender, isValid) => {
              //     this.updateFormField({ gender });
              //   }}
              //   onSubmitEditing={() => {}}
              //   outerContainerStyle={styles.formInputOuterContainerStyle}
              //   placeholder="Placeholder"
              //   propagateError={this.props.propagateFormErrors}
              //   showValidIndicator={true}
              //   text="Gender"
              //   textInputRef={(input) => (this.gender = input)}
              //   validators={{
              //     required: true,
              //   }}
              //   hideOptionalLabel={true}
              // />
            )}

            <FormPicker
              choices={COUNTRY.map(({ id, name }) => ({
                label: name,
                value: id,
              }))}
              defaultValue={
                this.state.cachedData && this.state.savedCacPersonalForm.country
              }
              innerContainerStyle={styles.formInputInnerContainerStyle}
              onSelect={(country, isValid) => {
                this.updateFormField({ country });
                !isValid
                  ? this.addInvalidField("country")
                  : this.removeInvalidField("country");
                this.checkFormValidity();
              }}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              propagateError={this.props.propagateFormErrors}
              text="Nationality"
              validators={{
                required: true,
              }}
            />

            {this.state.assistedCacRegType ? (
              <FormPicker
                choices={this.state.states?.map(({ id, name }) => ({
                  label: name,
                  value: id,
                }))}
                defaultValue={this.state.savedCacPersonalForm?.state}
                innerContainerStyle={styles.formInputInnerContainerStyle}
                onSelect={(state, isValid) => {
                  this.updateFormField({ state });
                  this.onStateSelect(state);

                  !isValid
                    ? this.addInvalidField("state")
                    : this.removeInvalidField("state");
                  this.checkFormValidity();
                }}
                outerContainerStyle={styles.formInputOuterContainerStyle}
                propagateError={this.props.propagateFormErrors}
                text="State"
                validators={{
                  required: true,
                }}
              />
            ) : (
              <FormPicker
                choices={this.state.states.map(({ id, name }) => ({
                  label: name,
                  value: id,
                }))}
                disabled={false}
                defaultValue={
                  this.state.cachedData && this.state.savedCacPersonalForm.state
                }
                innerContainerStyle={styles.formInputInnerContainerStyle}
                onSelect={(state, isValid) => {
                  this.updateFormField({ state });
                  this.onStateSelect(state);
                  !isValid
                    ? this.addInvalidField("state")
                    : this.removeInvalidField("state");
                  this.checkFormValidity();
                }}
                outerContainerStyle={styles.formInputOuterContainerStyle}
                propagateError={this.props.propagateFormErrors}
                text="State"
                validators={{
                  required: true,
                }}
              />
            )}

            <FormPicker
              choices={this.state.lgas?.map(({ id, name }) => ({
                label: name,
                value: id,
              }))}
              defaultValue={this.state.savedCacPersonalForm?.lga}
              innerContainerStyle={styles.formInputInnerContainerStyle}
              onSelect={(lga, isValid) => {
                this.updateFormField({ lga });
                this.checkFormValidity();
              }}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              propagateError={this.props.propagateFormErrors}
              text="LGA"
              validators={{
                required: true,
              }}
            />

            <FormInput
              autoCapitalize="name"
              // disabled={true}
              autoCompleteType="email"
              defaultValue={this.state.savedCacPersonalForm?.postalCode}
              // defaultValue={this.state.agentAddress}
              innerContainerStyle={styles.formInputInnerContainerStyle}
              keyboardType="number-pad"
              onChangeText={(postalCode, isValid) => {
                this.updateFormField({ postalCode });
                !isValid
                  ? this.addInvalidField("postalCode")
                  : this.removeInvalidField("postalCode");
                this.checkFormValidity();
              }}
              onSubmitEditing={() => {
                this.checkFormValidity();
              }}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              placeholder="Placeholder"
              propagateError={this.props.propagateFormErrors}
              showValidIndicator={true}
              text="Postal Code"
              textContentType="emailAddress"
              textInputRef={(input) => (this.companyStreetNumber = input)}
              validators={{
                required: true,
                length: [6, 6],
              }}
              hideOptionalLabel={true}
            />

            <FormInput
              autoCapitalize="name"
              disabled={false}
              defaultValue={this.state.savedCacPersonalForm?.city}
              autoCompleteType="email"
              innerContainerStyle={styles.formInputInnerContainerStyle}
              keyboardType="email-address"
              onChangeText={(city, isValid) => {
                this.updateFormField({ city });
                !isValid
                  ? this.addInvalidField("city")
                  : this.removeInvalidField("city");
                this.checkFormValidity();
              }}
              onSubmitEditing={() => {
                this.checkFormValidity();
              }}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              placeholder="Placeholder"
              propagateError={this.props.propagateFormErrors}
              showValidIndicator={true}
              text="City"
              textContentType="emailAddress"
              textInputRef={(input) => (this.city = input)}
              validators={{
                required: true,
              }}
              hideOptionalLabel={true}
            />

            <FormInput
              autoCapitalize="name"
              autoCompleteType="email"
              defaultValue={this.state.savedCacPersonalForm?.streetNumber}
              // defaultValue={this.state.upgradeStatus?.motherMaidenName}
              innerContainerStyle={styles.formInputInnerContainerStyle}
              keyboardType="email-address"
              onChangeText={(streetNumber, isValid) => {
                this.updateFormField({ streetNumber });
                !isValid
                  ? this.addInvalidField("streetNumber")
                  : this.removeInvalidField("streetNumber");
                this.checkFormValidity();
              }}
              onSubmitEditing={() => {
                this.checkFormValidity();
              }}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              placeholder="Placeholder"
              propagateError={this.props.propagateFormErrors}
              showValidIndicator={true}
              text="Street Number"
              textContentType="emailAddress"
              textInputRef={(input) => (this.streetNumber = input)}
              validators={{
                required: true,
              }}
              hideOptionalLabel={true}
            />

            <FormInput
              autoCapitalize="name"
              autoCompleteType="email"
              defaultValue={this.state.savedCacPersonalForm?.houseAddress}
              innerContainerStyle={styles.formInputInnerContainerStyle}
              keyboardType="email-address"
              onChangeText={(houseAddress, isValid) => {
                this.updateFormField({ houseAddress });
                !isValid
                  ? this.addInvalidField("houseAddress")
                  : this.removeInvalidField("houseAddress");
                this.checkFormValidity();
              }}
              onSubmitEditing={() => {
                this.checkFormValidity();
              }}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              placeholder="Placeholder"
              propagateError={this.props.propagateFormErrors}
              showValidIndicator={true}
              text="House Address"
              textContentType="emailAddress"
              textInputRef={(input) => (this.houseAddress = input)}
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
          </View>
        </ScrollView>
      </View>
    );
  }
}

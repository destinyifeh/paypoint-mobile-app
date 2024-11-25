import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";

import { TouchableOpacity } from "react-native";
import ClickableListItem from "../../../../../../../components/clickable-list-item";
import FormInput from "../../../../../../../components/form-controls/form-input";
import Header from "../../../../../../../components/header";
import { AGENT, NIGERIA } from "../../../../../../../constants";
import { DISABLE_PROFILE_FIELDS } from "../../../../../../../constants/api-resources";
import {
  ACCOUNT_NUMBER_LENGTH,
  MIN_NAME_LENGTH,
} from "../../../../../../../constants/fields";
import {
  COLOUR_BLACK,
  COLOUR_BLUE,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_FAMILY_BODY_SEMIBOLD,
} from "../../../../../../../constants/styles";
import Banks from "../../../../../../../fixtures/banks";
import CountriesStatesLgas from "../../../../../../../fixtures/countries_states_lgas";
import AgentSerializer from "../../../../../../../serializers/resources/agent";
import { loadData } from "../../../../../../../utils/storage";
export default class UpdateBusinessInformationScene extends React.Component {
  state = {
    expand: null,
    form: {},
    lgas: [],
    states: [],
    toggler: false,
  };

  componentDidMount() {
    try {
      this.fetchStates();
      this.loadData();
      Banks.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
    } catch {}
  }

  async loadData() {
    const agentInformation = JSON.parse(await loadData(AGENT));

    console.log("AGENT INFORMATION", agentInformation);
    this.getStateLga(agentInformation);
    const serializedAgentInformation = new AgentSerializer(agentInformation);

    this.setState({
      form: {
        ...this.state.form,
        ...this.serializeApiData(serializedAgentInformation),
      },
    });
  }

  addInvalidField() {}

  fetchStates() {
    const nigeria = CountriesStatesLgas.find((value) => value.name === NIGERIA);

    this.setState({
      states: nigeria.states,
    });
  }

  onStateSelect(stateId) {
    const country = CountriesStatesLgas.find((value) => value.name == NIGERIA);

    const state = country.states.find((value) => value.id == stateId);

    this.setState({
      lgas: state ? state.lgas : [],
    });
  }

  removeInvalidField() {}

  serializeApiData(apiData) {
    const {
      businessName,
      businessLocation,
      companyRegNo,
      phoneNumber,
      businessTypeName,
      agentBankAccount,
    } = apiData;

    return {
      businessName: businessName || null,
      businessAddress: businessLocation[0].addressLine1 || null,
      companyRegistrationNo: companyRegNo || null,
      phone: phoneNumber ? `0${phoneNumber.slice(3)}` : null,
      businessType: businessTypeName || null,
      bankName: agentBankAccount.bankName || null,
      accountNumber: agentBankAccount.accountNo || null,
      accountName: agentBankAccount.accountName || null,
      state: parseInt(businessLocation[0].stateId),
      lga: parseInt(businessLocation[0].lgaId),
      theState: businessLocation[0].state,
    };
  }

  async getStateLga(apiData) {
    const { businessLocation } = apiData;

    const stateId = parseInt(businessLocation[0].stateId);
    const lgaId = parseInt(businessLocation[0].lgaId);

    const nigeria = CountriesStatesLgas.find((value) => value.name === NIGERIA);

    const state = nigeria.states.find((value) => value.id === stateId);

    const lga = state.lgas.find((value) => value.id === lgaId);

    this.setState({
      form: {
        ...this.state.form,
        agentLga: lga.name,
        agentState: state.name,
      },
    });
  }
  renderItem(item, index) {
    return (
      <ClickableListItem
        key={index}
        onPressOut={() =>
          this.setState({
            expand: this.state.expand === item.time ? null : item.time,
          })
        }
        style={{
          backgroundColor: "white",
          flexDirection: "row",
          marginBottom: 1,
        }}
      >
        <View
          style={{ flex: 0.8, justifyContent: "space-evenly", paddingLeft: 20 }}
        >
          <Text black>{item.name}</Text>
        </View>

        <View
          style={{
            alignItems: "center",
            flex: 0.2,
            justifyContent: "center",
          }}
        >
          <Icon
            name="chevron-right"
            color={"#B4B7BF"}
            type="material"
            size={50}
          />
        </View>
      </ClickableListItem>
    );
  }

  removeInvalidField() {}

  renderSectionHeader(item) {
    return (
      <Text style={{ lineHeight: 32, marginLeft: 10, marginTop: 30 }}>
        {item}
      </Text>
    );
  }

  updateFormField() {}

  onToggle() {
    this.setState({ toggler: !this.state.toggler });
  }

  render() {
    return (
      <View
        style={{
          // backgroundColor: "#F3F3F4",
          backgroundColor: "#FFFFFF",
          flex: 1,
        }}
      >
        <Header
          containerStyle={{
            backgroundColor: COLOUR_BLUE,
          }}
          navigationIconColor={COLOUR_WHITE}
          leftComponent={
            <Icon
              color={COLOUR_RED}
              underlayColor="transparent"
              name="chevron-left"
              size={40}
              type="material"
              onPress={() => this.props.navigation.goBack()}
            />
          }
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          statusBarProps={{
            backgroundColor: "transparent",
            barStyle: CONTENT_LIGHT,
          }}
          title="Business Information"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: "bold",
          }}
        />
        <ScrollView
          contentContainerStyle={{
            padding: 20,
          }}
        >
          <View style={styles.contentView}>
            {/* <Text
              style={{
                color: COLOUR_BLACK,
                fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                fontSize: 18,
                marginBottom: 20,
              }}
            >
              Business Information
            </Text> */}

            <View style={styles.innerContainerView}>
              <TouchableOpacity
                style={[
                  styles.touchableDropdown,
                  { borderBottomWidth: !this.state.toggler ? 2 : 0 },
                ]}
                onPress={() => this.onToggle()}
              >
                <Text style={styles.titleText}>Business Information</Text>
                <Icon
                  name={this.state.toggler ? "chevron-up" : "chevron-down"}
                  type="feather"
                  size={24}
                  color="grey"
                  containerStyle={{}}
                />
              </TouchableOpacity>

              {!this.state.toggler && (
                <>
                  {/* <FormInput
                autoCompleteType="name"
                defaultValue={this.state.form.businessType}
                disabled={DISABLE_PROFILE_FIELDS}
                innerContainerStyle={styles.formInputInnerContainerStyle}
                onChangeText={(businessType, isValid) => {
                  this.updateFormField({ businessType });
                  !isValid
                    ? this.addInvalidField("businessType")
                    : this.removeInvalidField("businessType");
                }}
                outerContainerStyle={styles.formInputOuterContainerStyle}
                propagateError={this.props.propagateFormErrors}
                text="Business Type:"
                validators={{
                  required: true,
                }}
              /> */}
                  <FormInput
                    autoCompleteType="name"
                    defaultValue={this.state.form.businessName ?? ""}
                    disabled={DISABLE_PROFILE_FIELDS}
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
                    outerContainerStyle={styles.formInputOuterContainerStyle}
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
                    defaultValue={this.state.form.agentState ?? ""}
                    disabled={DISABLE_PROFILE_FIELDS}
                    innerContainerStyle={styles.formInputInnerContainerStyle}
                    onChangeText={(state, isValid) => {
                      this.updateFormField({ state });
                      this.onStateSelect(state);
                      !isValid
                        ? this.addInvalidField("state")
                        : this.removeInvalidField("state");
                    }}
                    outerContainerStyle={styles.formInputOuterContainerStyle}
                    propagateError={this.props.propagateFormErrors}
                    text="State"
                    validators={{
                      required: true,
                    }}
                  />

                  <FormInput
                    defaultValue={this.state.form.agentLga ?? ""}
                    disabled={DISABLE_PROFILE_FIELDS}
                    innerContainerStyle={styles.formInputInnerContainerStyle}
                    onChangeText={(lga, isValid) => {
                      this.updateFormField({ lga });
                      !isValid
                        ? this.addInvalidField("lga")
                        : this.removeInvalidField("lga");
                    }}
                    outerContainerStyle={styles.formInputOuterContainerStyle}
                    propagateError={this.props.propagateFormErrors}
                    text="LGA"
                    validators={{
                      required: true,
                    }}
                  />

                  <FormInput
                    autoCompleteType="name"
                    defaultValue={this.state.form.businessAddress ?? ""}
                    disabled={DISABLE_PROFILE_FIELDS}
                    innerContainerStyle={styles.formInputInnerContainerStyle}
                    onChangeText={(businessAddress, isValid) => {
                      this.updateFormField({ businessAddress });
                      !isValid
                        ? this.addInvalidField("businessAddress")
                        : this.removeInvalidField("businessAddress");
                    }}
                    onSubmitEditing={() => {
                      this.phone.focus();
                    }}
                    outerContainerStyle={styles.formInputOuterContainerStyle}
                    propagateError={this.props.propagateFormErrors}
                    text="Business Address"
                    textInputRef={(input) => (this.businessAddress = input)}
                    validators={{
                      minLength: MIN_NAME_LENGTH,
                      regex: "sentence",
                      required: true,
                    }}
                  />

                  <FormInput
                    autoCompleteType="name"
                    defaultValue={this.state.form.companyRegistrationNo ?? ""}
                    disabled={DISABLE_PROFILE_FIELDS}
                    innerContainerStyle={styles.formInputInnerContainerStyle}
                    onChangeText={(companyRegistrationNo, isValid) => {
                      this.updateFormField({ companyRegistrationNo });
                      !isValid
                        ? this.addInvalidField("companyRegistrationNo")
                        : this.removeInvalidField("companyRegistrationNo");
                    }}
                    onSubmitEditing={() => {
                      this.phone.focus();
                    }}
                    outerContainerStyle={styles.formInputOuterContainerStyle}
                    propagateError={this.props.propagateFormErrors}
                    text="Company Registration Number"
                    textInputRef={(input) =>
                      (this.companyRegistrationNo = input)
                    }
                    validators={{
                      minLength: MIN_NAME_LENGTH,
                      regex: "alphanumeric",
                      required: true,
                    }}
                  />

                  {/* <FormPhone
                autoCompleteType="tel"
                defaultValue={this.state.form.phone}
                disabled={DISABLE_PROFILE_FIELDS}
                innerContainerStyle={styles.formInputInnerContainerStyle}
                keyboardType="number-pad"
                onChangeText={(phone, isValid) => {
                  this.updateFormField({ phone });
                  !isValid
                    ? this.addInvalidField("phone")
                    : this.removeInvalidField("phone");
                }}
                outerContainerStyle={styles.formInputOuterContainerStyle}
                placeholder="08012345678"
                propagateError={this.props.propagateFormErrors}
                text="Phone:"
                textInputRef={(input) => (this.phone = input)}
                validators={{
                  length: MIN_NIGERIA_PHONE_LENGTH,
                  required: true,
                }}
              /> */}

                  <FormInput
                    autoCompleteType="name"
                    defaultValue={this.state.form.bankName ?? ""}
                    disabled={DISABLE_PROFILE_FIELDS}
                    innerContainerStyle={styles.formInputInnerContainerStyle}
                    onChangeText={(bankName, isValid) => {
                      this.updateFormField({ bankName });
                      !isValid
                        ? this.addInvalidField("bankName")
                        : this.removeInvalidField("bankName");
                    }}
                    outerContainerStyle={styles.formInputOuterContainerStyle}
                    propagateError={this.props.propagateFormErrors}
                    text="Bank Name"
                    validators={{
                      required: true,
                    }}
                  />

                  <FormInput
                    autoCompleteType="name"
                    defaultValue={this.state.form.accountNumber ?? ""}
                    disabled={DISABLE_PROFILE_FIELDS}
                    innerContainerStyle={styles.formInputInnerContainerStyle}
                    keyboardType="number-pad"
                    onChangeText={(accountNumber, isValid) => {
                      this.updateFormField({ accountNumber });
                      !isValid
                        ? this.addInvalidField("accountNumber")
                        : this.removeInvalidField("accountNumber");
                    }}
                    outerContainerStyle={styles.formInputOuterContainerStyle}
                    propagateError={this.props.propagateFormErrors}
                    text="Account Number"
                    textInputRef={(input) => (this.accountNumber = input)}
                    validators={{
                      length: ACCOUNT_NUMBER_LENGTH,
                      regex: "numeric",
                      required: true,
                    }}
                  />

                  <FormInput
                    autoCompleteType="name"
                    defaultValue={this.state.form.accountName ?? ""}
                    disabled={DISABLE_PROFILE_FIELDS}
                    innerContainerStyle={styles.formInputInnerContainerStyle}
                    onChangeText={(accountName, isValid) => {
                      this.updateFormField({ accountName });
                      !isValid
                        ? this.addInvalidField("accountName")
                        : this.removeInvalidField("accountName");
                    }}
                    outerContainerStyle={styles.formInputOuterContainerStyle}
                    propagateError={this.props.propagateFormErrors}
                    text="Account Name"
                    validators={{
                      required: true,
                    }}
                  />

                  {/* <FormInput
                defaultValue={this.state.form.nin ?? ""}
                disabled={DISABLE_PROFILE_FIELDS}
                innerContainerStyle={styles.formInputInnerContainerStyle}
                keyboardType="number-pad"
                onChangeText={(nin, isValid) => {
                  this.updateFormField({ nin });
                  !isValid
                    ? this.addInvalidField("nin")
                    : this.removeInvalidField("nin");
                }}
                outerContainerStyle={styles.formInputOuterContainerStyle}
                placeholder="NIN"
                propagateError={this.props.propagateFormErrors}
                text="NIN:"
                textInputRef={(input) => (this.accountNumber = input)}
                validators={{
                  // length: 11,
                  // regex: "numeric",
                  required: true,
                }}
              /> */}

                  {/* <FormPicker
                choices={this.state.states.map(({ id, name }) => ({
                  label: name,
                  value: id,
                }))}
                defaultValue={this.state.form.state}
                disabled={DISABLE_PROFILE_FIELDS}
                innerContainerStyle={styles.formInputInnerContainerStyle}
                onSelect={(state, isValid) => {
                  this.updateFormField({ state });
                  this.onStateSelect(state);
                  !isValid
                    ? this.addInvalidField("state")
                    : this.removeInvalidField("state");
                }}
                outerContainerStyle={styles.formInputOuterContainerStyle}
                propagateError={this.props.propagateFormErrors}
                text="State:"
                validators={{
                  required: true,
                }}
              />

              <FormPicker
                choices={this.state.lgas.map(({ id, name }) => ({
                  label: name,
                  value: id,
                }))}
                defaultValue={this.state.form.lga}
                disabled={DISABLE_PROFILE_FIELDS}
                innerContainerStyle={styles.formInputInnerContainerStyle}
                onSelect={(lga, isValid) => {
                  this.updateFormField({ lga });
                  !isValid
                    ? this.addInvalidField("lga")
                    : this.removeInvalidField("lga");
                }}
                outerContainerStyle={styles.formInputOuterContainerStyle}
                propagateError={this.props.propagateFormErrors}
                text="LGA:"
                validators={{
                  required: true,
                }}
              /> */}
                </>
              )}
            </View>
          </View>
        </ScrollView>

        {/* <View style={{
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 20
      }}>
        <Button 
          transparent
          buttonStyle={{ paddingHorizontal: 40 }} 
          onPressOut={() => this.props.navigation.goBack()}
          title="Cancel"
          titleStyle={{ color: COLOUR_GREY }}
        />
        <Button 
          buttonStyle={{ paddingHorizontal: 40 }} 
          title="Save" 
        />
      </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  formInputOuterContainerStyle: {
    marginTop: 20,
  },
  contentView: { width: "98%", alignSelf: "center" },
  innerContainerView: {
    borderWidth: 2,
    padding: 10,
    borderColor: "#F3F3F4",
    borderRadius: 10,
  },
  touchableDropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#F3F3F4",
    padding: 5,
  },
  titleText: {
    color: COLOUR_BLACK,
    fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
    fontSize: 17,
    paddingBottom: 10,
  },
});

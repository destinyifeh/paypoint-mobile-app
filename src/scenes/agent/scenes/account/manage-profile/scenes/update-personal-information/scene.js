import moment from "moment";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";

import ClickableListItem from "../../../../../../../components/clickable-list-item";
import FormInput from "../../../../../../../components/form-controls/form-input";
import Header from "../../../../../../../components/header";
import Text from "../../../../../../../components/text";
import { AGENT } from "../../../../../../../constants";
import { DISABLE_PROFILE_FIELDS } from "../../../../../../../constants/api-resources";
import {
  BVN_LENGTH,
  MIN_ADDRESS_LENGTH,
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
import AgentSerializer from "../../../../../../../serializers/resources/agent";
import { loadData } from "../../../../../../../utils/storage";

export default class UpdatePersonalInformationScene extends React.Component {
  state = {
    expand: null,
    toggler: false,
    residentialToggler: false,

    form: {},
  };

  componentDidMount() {
    try {
      this.loadData();
    } catch {}
  }

  async loadData() {
    const agentInformation = JSON.parse(await loadData(AGENT));

    console.log("AGENT INFORMATION", agentInformation);

    const serializedAgentInformation = new AgentSerializer(agentInformation);

    this.setState({
      form: {
        ...this.state.form,
        ...this.serializeApiData(serializedAgentInformation),
      },
    });
  }

  addInvalidField() {}

  removeInvalidField() {}

  serializeApiData(apiData) {
    return {
      ...apiData,
      dateOfBirth: moment(apiData.dateOfBirth, "YYYY-MM-DD").format(
        "DD-MM-YYYY"
      ),
      gender: apiData.businessContact.gender,
      motherMaidenName: apiData.businessContact.motherMadienName,
    };
  }

  renderItem(item, index) {
    const statusIconColor = {
      Completed: "#32BE69",
      Failed: "#EE312A",
      "In Progress": "#F8B573",
    }[item.status];

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
          title="Personal Details"
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
            <View style={styles.innerContainerView}>
              <TouchableOpacity
                style={[
                  styles.touchableDropdown,
                  { borderBottomWidth: !this.state.toggler ? 2 : 0 },
                ]}
                onPress={() => this.onToggle()}
              >
                <Text style={styles.titleText}>Personal Details</Text>
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
                  {/* <FormDate
            defaultValue={this.state.form.dateOfBirth}
            disabled={DISABLE_PROFILE_FIELDS}
            innerContainerStyle={styles.formInputInnerContainerStyle}
            maxDate={computePastDate(18, "years")}
            minDate={computePastDate(PAST_DATE)}
            onDateSelect={(dateOfBirth, isValid) => {
              this.updateFormField({ dateOfBirth });
              !isValid
                ? this.addInvalidField("dateOfBirth")
                : this.removeInvalidField("dateOfBirth");
            }}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            placeholder="Pick date"
            propagateError={this.props.propagateFormErrors}
            text="Date of Birth:"
            validators={{
              required: true,
            }}
          /> */}

                  {/* <FormCheckbox
            defaultValue={this.state.form.gender}
            disabled={DISABLE_PROFILE_FIELDS}
            innerContainerStyle={styles.formInputInnerContainerStyle}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            text="Gender:"
            options={["Male", "Female"]}
            onSelect={(gender, isValid) => {
              this.updateFormField({ gender });
              !isValid
                ? this.addInvalidField("gender")
                : this.removeInvalidField("gender");
            }}
            propagateError={this.props.propagateFormErrors}
            validators={{
              required: true,
            }}
            value={this.state.form.gender}
          /> */}

                  <FormInput
                    autoCompleteType="name"
                    defaultValue={this.state.form.firstName ?? ""}
                    disabled={DISABLE_PROFILE_FIELDS}
                    innerContainerStyle={styles.formInputInnerContainerStyle}
                    onChangeText={(firstName, isValid) => {
                      this.updateFormField({ firstName });
                      !isValid
                        ? this.addInvalidField("firstName")
                        : this.removeInvalidField("firstName");
                    }}
                    onSubmitEditing={() => {
                      this.lastName.focus();
                    }}
                    outerContainerStyle={styles.formInputOuterContainerStyle}
                    placeholder=""
                    propagateError={this.props.propagateFormErrors}
                    text="First Name"
                    textInputRef={(input) => (this.firstName = input)}
                    validators={{
                      minLength: MIN_NAME_LENGTH,
                      regex: "name",
                      required: true,
                    }}
                  />

                  <FormInput
                    autoCompleteType="name"
                    defaultValue={this.state.form.middleName ?? ""}
                    disabled={DISABLE_PROFILE_FIELDS}
                    innerContainerStyle={styles.formInputInnerContainerStyle}
                    onChangeText={(middleName, isValid) => {
                      this.updateFormField({ middleName });
                      !isValid
                        ? this.addInvalidField("middleName")
                        : this.removeInvalidField("middleName");
                    }}
                    onSubmitEditing={() => {
                      this.phone.focus();
                    }}
                    outerContainerStyle={styles.formInputOuterContainerStyle}
                    placeholder=""
                    propagateError={this.props.propagateFormErrors}
                    text="Middle Name"
                    textInputRef={(input) => (this.middleName = input)}
                    validators={{
                      minLength: MIN_NAME_LENGTH,
                      regex: "name",
                      required: true,
                    }}
                  />

                  <FormInput
                    autoCompleteType="name"
                    defaultValue={this.state.form.lastName ?? ""}
                    disabled={DISABLE_PROFILE_FIELDS}
                    innerContainerStyle={styles.formInputInnerContainerStyle}
                    onChangeText={(lastName, isValid) => {
                      this.updateFormField({ lastName });
                      !isValid
                        ? this.addInvalidField("lastName")
                        : this.removeInvalidField("lastName");
                    }}
                    onSubmitEditing={() => {
                      this.phone.focus();
                    }}
                    outerContainerStyle={styles.formInputOuterContainerStyle}
                    placeholder=""
                    propagateError={this.props.propagateFormErrors}
                    text="Last Name"
                    textInputRef={(input) => (this.lastName = input)}
                    validators={{
                      minLength: MIN_NAME_LENGTH,
                      regex: "name",
                      required: true,
                    }}
                  />

                  <FormInput
                    defaultValue={this.state.form.phoneNumber ?? ""}
                    disabled={DISABLE_PROFILE_FIELDS}
                    innerContainerStyle={styles.formInputInnerContainerStyle}
                    keyboardType="number-pad"
                    onChangeText={(phoneNumber, isValid) => {
                      this.updateFormField({ phoneNumber });
                      !isValid
                        ? this.addInvalidField("phoneNumber")
                        : this.removeInvalidField("phoneNumber");
                    }}
                    outerContainerStyle={styles.formInputOuterContainerStyle}
                    placeholder=""
                    propagateError={this.props.propagateFormErrors}
                    text="Phone Number"
                    textInputRef={(input) => (this.phoneNumber = input)}
                    validators={{
                      // length: MIN_NIGERIA_PHONE_LENGTH,
                      required: true,
                    }}
                  />

                  <FormInput
                    autoCompleteType="email"
                    defaultValue={this.state.form.emailAddress ?? ""}
                    disabled={DISABLE_PROFILE_FIELDS}
                    innerContainerStyle={styles.formInputInnerContainerStyle}
                    keyboardType="email-address"
                    onChangeText={(emailAddress, isValid) => {
                      this.updateFormField({ emailAddress });
                      !isValid
                        ? this.addInvalidField("emailAddress")
                        : this.removeInvalidField("emailAddress");
                    }}
                    outerContainerStyle={styles.formInputOuterContainerStyle}
                    placeholder=""
                    propagateError={this.props.propagateFormErrors}
                    text="Email Address"
                    textInputRef={(input) => (this.emailAddress = input)}
                    validators={{
                      required: true,
                    }}
                  />

                  <FormInput
                    defaultValue={this.state.form.gender ?? ""}
                    disabled={DISABLE_PROFILE_FIELDS}
                    innerContainerStyle={styles.formInputInnerContainerStyle}
                    outerContainerStyle={styles.formInputOuterContainerStyle}
                    text="Gender"
                    onChangeText={(gender, isValid) => {
                      this.updateFormField({ gender });
                      !isValid
                        ? this.addInvalidField("gender")
                        : this.removeInvalidField("gender");
                    }}
                    propagateError={this.props.propagateFormErrors}
                    validators={{
                      required: true,
                    }}
                    textInputRef={(input) => (this.gender = input)}
                  />

                  <FormInput
                    defaultValue={this.state.form.dateOfBirth ?? ""}
                    disabled={DISABLE_PROFILE_FIELDS}
                    innerContainerStyle={styles.formInputInnerContainerStyle}
                    onChangeText={(dateOfBirth, isValid) => {
                      this.updateFormField({ dateOfBirth });
                      !isValid
                        ? this.addInvalidField("dateOfBirth")
                        : this.removeInvalidField("dateOfBirth");
                    }}
                    outerContainerStyle={styles.formInputOuterContainerStyle}
                    placeholder=""
                    propagateError={this.props.propagateFormErrors}
                    text="Date of Birth"
                    validators={{
                      required: true,
                    }}
                  />

                  <FormInput
                    autoCompleteType="street-address"
                    defaultValue={this.state.form.placeOfBirth ?? ""}
                    disabled={DISABLE_PROFILE_FIELDS}
                    innerContainerStyle={styles.formInputInnerContainerStyle}
                    onChangeText={(placeOfBirth, isValid) => {
                      this.updateFormField({ placeOfBirth });
                      !isValid
                        ? this.addInvalidField("placeOfBirth")
                        : this.removeInvalidField("placeOfBirth");
                    }}
                    outerContainerStyle={styles.formInputOuterContainerStyle}
                    placeholder=""
                    propagateError={this.props.propagateFormErrors}
                    text="Place of birth"
                    textInputRef={(input) => (this.placeOfBirth = input)}
                    validators={{
                      regex: "sentence",
                      required: true,
                    }}
                  />

                  <FormInput
                    autoCompleteType="name"
                    defaultValue={this.state.form.state ?? ""}
                    disabled={DISABLE_PROFILE_FIELDS}
                    innerContainerStyle={styles.formInputInnerContainerStyle}
                    onChangeText={(state, isValid) => {
                      this.updateFormField({ state });
                      !isValid
                        ? this.addInvalidField("state")
                        : this.removeInvalidField("state");
                    }}
                    outerContainerStyle={styles.formInputOuterContainerStyle}
                    propagateError={this.props.propagateFormErrors}
                    text="State of Origin"
                    validators={{
                      required: true,
                    }}
                  />

                  <FormInput
                    defaultValue={this.state.form.bvn ?? ""}
                    disabled={DISABLE_PROFILE_FIELDS}
                    innerContainerStyle={styles.formInputInnerContainerStyle}
                    keyboardType="number-pad"
                    onChangeText={(bvn, isValid) => {
                      this.updateFormField({ bvn });
                      !isValid
                        ? this.addInvalidField("bvn")
                        : this.removeInvalidField("bvn");
                    }}
                    onSubmitEditing={() => {
                      this.mothersMaidenName.focus();
                    }}
                    outerContainerStyle={styles.formInputOuterContainerStyle}
                    propagateError={this.props.propagateFormErrors}
                    text="BVN"
                    textInputRef={(input) => (this.bvn = input)}
                    validators={{
                      length: BVN_LENGTH,
                      regex: "number",
                      required: true,
                    }}
                  />

                  {/* <FormPicker
            choices={IdentificationTypes.map(({ id, name }) => ({
              label: name,
              value: id,
            }))}
            defaultValue={
              this.state.form.identificationType
                ? parseInt(this.state.form.identificationType)
                : null
            }
            disabled={DISABLE_PROFILE_FIELDS}
            innerContainerStyle={styles.formInputInnerContainerStyle}
            onSelect={(idType, isValid) => {
              this.updateFormField({ idType });
              !isValid
                ? this.addInvalidField("idType")
                : this.removeInvalidField("idType");
            }}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            propagateError={this.props.propagateFormErrors}
            text="ID Type:"
            validators={{
              required: true,
            }}
          />

          <FormInput
            autoCompleteType="id-number"
            defaultValue={this.state.form.identificationNumber}
            disabled={DISABLE_PROFILE_FIELDS}
            innerContainerStyle={styles.formInputInnerContainerStyle}
            maxLength={30}
            onChangeText={(idNumber, isValid) => {
              this.updateFormField({ idNumber });
              !isValid
                ? this.addInvalidField("idNumber")
                : this.removeInvalidField("idNumber");
            }}
            onSubmitEditing={() => {
              this.bvn.focus();
            }}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            placeholder="ID Number"
            propagateError={this.props.propagateFormErrors}
            text="ID Number:"
            textInputRef={(input) => (this.idNumber = input)}
            validators={{
              minLength: 8,
              regex: "alphanumeric",
              required: true,
            }}
          />

         

          <FormInput
            autoCompleteType="street-address"
            defaultValue={this.state.form.motherMaidenName}
            disabled={DISABLE_PROFILE_FIELDS}
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
            text="Mother's Maiden Name:"
            textInputRef={(input) => (this.mothersMaidenName = input)}
            validators={{
              minLength: MIN_NAME_LENGTH,
              regex: "name",
              required: true,
            }}
          /> */}
                </>
              )}
            </View>

            <View style={[styles.innerContainerView, { marginTop: 13 }]}>
              <TouchableOpacity
                style={[
                  styles.touchableDropdown,
                  { borderBottomWidth: !this.state.residentialToggler ? 2 : 0 },
                ]}
                onPress={() =>
                  this.setState({
                    residentialToggler: !this.state.residentialToggler,
                  })
                }
              >
                <Text style={styles.titleText}>Residential Address</Text>
                <Icon
                  name={
                    this.state.residentialToggler
                      ? "chevron-up"
                      : "chevron-down"
                  }
                  type="feather"
                  size={24}
                  color="grey"
                  containerStyle={{}}
                />
              </TouchableOpacity>

              {!this.state.residentialToggler && (
                <>
                  <FormInput
                    autoCompleteType="name"
                    defaultValue={this.state.form.nationality ?? ""}
                    disabled={DISABLE_PROFILE_FIELDS}
                    innerContainerStyle={styles.formInputInnerContainerStyle}
                    onChangeText={(nationality, isValid) => {
                      this.updateFormField({ nationality });
                      !isValid
                        ? this.addInvalidField("nationality")
                        : this.removeInvalidField("nationality");
                    }}
                    outerContainerStyle={styles.formInputOuterContainerStyle}
                    propagateError={this.props.propagateFormErrors}
                    text="Country"
                    validators={{
                      required: true,
                    }}
                  />

                  <FormInput
                    autoCompleteType="name"
                    defaultValue={this.state.form.state ?? ""}
                    disabled={DISABLE_PROFILE_FIELDS}
                    innerContainerStyle={styles.formInputInnerContainerStyle}
                    onChangeText={(state, isValid) => {
                      this.updateFormField({ state });
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
                    defaultValue={this.state.form.lga ?? ""}
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
                    autoCompleteType="street-address"
                    defaultValue={this.state.form.address ?? ""}
                    disabled={DISABLE_PROFILE_FIELDS}
                    innerContainerStyle={styles.formInputInnerContainerStyle}
                    onChangeText={(address, isValid) => {
                      this.updateFormField({ address });
                      !isValid
                        ? this.addInvalidField("address")
                        : this.removeInvalidField("address");
                    }}
                    outerContainerStyle={styles.formInputOuterContainerStyle}
                    propagateError={this.props.propagateFormErrors}
                    text="Address"
                    textInputRef={(input) => (this.address = input)}
                    validators={{
                      minLength: MIN_ADDRESS_LENGTH,
                      regex: "sentence",
                      required: true,
                    }}
                  />

                  <FormInput
                    autoCompleteType="name"
                    defaultValue={this.state.form.closestLandmark ?? ""}
                    disabled={DISABLE_PROFILE_FIELDS}
                    innerContainerStyle={styles.formInputInnerContainerStyle}
                    onChangeText={(landmark, isValid) => {
                      this.updateFormField({ landmark });
                      !isValid
                        ? this.addInvalidField("landmark")
                        : this.removeInvalidField("landmark");
                    }}
                    outerContainerStyle={styles.formInputOuterContainerStyle}
                    propagateError={this.props.propagateFormErrors}
                    text="Closest Landmark"
                    validators={{
                      required: true,
                    }}
                  />
                </>
              )}
            </View>
          </View>
        </ScrollView>
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

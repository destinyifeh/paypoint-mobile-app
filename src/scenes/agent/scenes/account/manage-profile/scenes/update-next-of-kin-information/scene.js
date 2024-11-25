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

export default class UpdateNextOfKinInformationScene extends React.Component {
  state = {
    expand: null,
    toggler: false,

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
        ...this.serializeApiData(agentInformation),
      },
    });
  }

  serializeApiData(apiData) {
    const { nextOfKins } = apiData;
    return {
      address: nextOfKins[0].address,

      email: nextOfKins[0].email,

      gender: nextOfKins[0].gender,

      firstName: nextOfKins[0].firstname,
      lastName: nextOfKins[0].lastname,
      middleName: nextOfKins[0].middlename,
      address: nextOfKins[0].residentialAddress.addressLine1,

      phoneNo: nextOfKins[0].phoneNo,
      relationship: nextOfKins[0].relationship,
    };
  }

  addInvalidField() {}

  removeInvalidField() {}

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
          title="Next Of Kin"
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
                <Text style={styles.titleText}>Next of Kin</Text>
                <Icon
                  name={this.state.toggler ? "chevron-up" : "chevron-down"}
                  type="feather"
                  size={24}
                  color="grey"
                  containerStyle={{}}
                />
              </TouchableOpacity>

              {/* <ScrollView contentContainerStyle={{
        padding: 20
      }}> */}

              {!this.state.toggler && (
                <>
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
                    defaultValue={this.state.form.phoneNo ?? ""}
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
                    placeholder=""
                    propagateError={this.props.propagateFormErrors}
                    text="Phone Number"
                    textInputRef={(input) => (this.phone = input)}
                    validators={{
                      // length: MIN_NIGERIA_PHONE_LENGTH,
                      required: true,
                    }}
                  />

                  <FormInput
                    autoCompleteType="email"
                    defaultValue={this.state.form.email ?? ""}
                    disabled={DISABLE_PROFILE_FIELDS}
                    innerContainerStyle={styles.formInputInnerContainerStyle}
                    keyboardType="email-address"
                    onChangeText={(email, isValid) => {
                      this.updateFormField({ email });
                      !isValid
                        ? this.addInvalidField("email")
                        : this.removeInvalidField("email");
                    }}
                    outerContainerStyle={styles.formInputOuterContainerStyle}
                    placeholder=""
                    propagateError={this.props.propagateFormErrors}
                    text="Email Address"
                    textInputRef={(input) => (this.email = input)}
                    validators={{
                      required: true,
                    }}
                  />

                  {/* <FormCheckbox 
          defaultValue={this.state.form.gender}
          disabled={DISABLE_PROFILE_FIELDS}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          text="Gender:"
          options={["Male", "Female"]}
          onSelect={(gender, isValid) => {
            this.updateFormField({gender});
            !isValid ? this.addInvalidField('gender') : this.removeInvalidField('gender');
          }}
          propagateError={this.props.propagateFormErrors}
          validators={{
            required: true,
          }} /> */}

                  {/* <FormPicker 
          choices={Relationships.map(({id, name}) => ({
            label: name,
            value: id
          }))}
          defaultValue={this.state.form.relationship?.toUpperCase()}
          disabled={DISABLE_PROFILE_FIELDS}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={(relationship, isValid) => {
            this.updateFormField({relationship});
            !isValid ? this.addInvalidField('relationship') : this.removeInvalidField('relationship');
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          propagateError={this.props.propagateFormErrors}
          text="Relationship:"
          validators={{
            required: true
          }} /> */}

                  <FormInput
                    autoCompleteType="name"
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
                    placeholder=""
                    propagateError={this.props.propagateFormErrors}
                    text="Home Address"
                    textInputRef={(input) => (this.address = input)}
                    validators={{
                      minLength: MIN_ADDRESS_LENGTH,
                      regex: "sentence",
                      required: true,
                    }}
                  />

                  <FormInput
                    autoCompleteType="name"
                    defaultValue={this.state.form.relationship ?? ""}
                    disabled={DISABLE_PROFILE_FIELDS}
                    innerContainerStyle={styles.formInputInnerContainerStyle}
                    onChangeText={(relationship, isValid) => {
                      this.updateFormField({ relationship });
                      !isValid
                        ? this.addInvalidField("relationship")
                        : this.removeInvalidField("relationship");
                    }}
                    outerContainerStyle={styles.formInputOuterContainerStyle}
                    propagateError={this.props.propagateFormErrors}
                    placeholder=""
                    text="Relationship"
                    textInputRef={(input) => (this.relationship = input)}
                    validators={{
                      required: true,
                    }}
                  />
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

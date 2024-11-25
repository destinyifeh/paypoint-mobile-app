import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Icon } from "react-native-elements";
import ClickableListItem from "../../../../../../../components/clickable-list-item";
import FormInput from "../../../../../../../components/form-controls/form-input";
import Header from "../../../../../../../components/header";
import Text from "../../../../../../../components/text";
import {
  COLOUR_BLUE,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from "../../../../../../../constants/styles";
import FormPhone from "../../../../../../../components/form-controls/form-phone";
import FormDate from "../../../../../../../components/form-controls/form-date";
import { computePastDate } from "../../../../../../../utils/calendar";
import { PAST_DATE } from "../../../../../constants/fields";
import {
  MIN_NIGERIA_PHONE_LENGTH,
  MIN_NAME_LENGTH,
  BVN_LENGTH,
} from "../../../../../../../constants/fields";
import { loadData } from "../../../../../../../utils/storage";
import { AGENT } from "../../../../../../../constants";
import AgentSerializer from "../../../../../../../serializers/resources/agent";
import { DISABLE_PROFILE_FIELDS } from "../../../../../../../constants/api-resources";
import { platformService } from "../../../../../setup/api";

export default class BVNInformationScene1 extends React.Component {
  state = {
    expand: null,
    form: {},
  };

  platform = platformService;

  componentDidMount() {
    try {
      this.loadData();
    } catch {}
  }

  async loadData() {
    const agentInformation = JSON.parse(await loadData(AGENT));

    const serializedAgentInformation = new AgentSerializer(agentInformation);

    serializedAgentInformation[dateOfBirth] = moment(
      apiData.dateOfBirth,
      "YYYY-MM-DD"
    ).format("DD-MM-YYYY");
    this.setState({
      form: {
        ...this.state.form,
        ...serializedAgentInformation,
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

  render() {
    return (
      <View
        style={{
          backgroundColor: "#F3F3F4",
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
          title="BVN Form"
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
          <FormInput
            autoCompleteType="name"
            defaultValue={this.state.form.firstName}
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
            placeholder="First name"
            propagateError={this.props.propagateFormErrors}
            text="First Name:"
            textInputRef={(input) => (this.firstName = input)}
            validators={{
              minLength: MIN_NAME_LENGTH,
              regex: "name",
              required: true,
            }}
          />

          <FormInput
            autoCompleteType="name"
            defaultValue={this.state.form.surname}
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
            placeholder="Last name / Surname"
            propagateError={this.props.propagateFormErrors}
            text="Last Name / Surname:"
            textInputRef={(input) => (this.lastName = input)}
            validators={{
              minLength: MIN_NAME_LENGTH,
              regex: "name",
              required: true,
            }}
          />

          <FormPhone
            autoCompleteType="tel"
            defaultValue={this.state.form.phoneNumber}
            disabled={false}
            innerContainerStyle={styles.formInputInnerContainerStyle}
            keyboardType="number-pad"
            onChangeText={(phone, isValid) => {
              this.updateFormField({ phone });
              !isValid
                ? this.addInvalidField("phone")
                : this.removeInvalidField("phone");
            }}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            placeholder="xxxxxxxxx"
            propagateError={this.props.propagateFormErrors}
            text="Phone:"
            textInputRef={(input) => (this.phone = input)}
            validators={{
              length: MIN_NIGERIA_PHONE_LENGTH,
              required: true,
            }}
          />

          <FormPhone
            autoCompleteType="tel"
            innerContainerStyle={styles.formInputInnerContainerStyle}
            keyboardType="number-pad"
            onChangeText={(bvn, isValid) => {
              this.updateFormField({ bvn });
              !isValid
                ? this.addInvalidField("bvn")
                : this.removeInvalidField("bvn");
            }}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            placeholder="xxxxxxxxxx"
            propagateError={this.props.propagateFormErrors}
            text="BVN:"
            textInputRef={(input) => (this.bvn = input)}
            validators={{
              length: BVN_LENGTH,
              required: true,
            }}
          />

          <FormDate
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
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  formInputOuterContainerStyle: {
    marginTop: 20,
  },
});

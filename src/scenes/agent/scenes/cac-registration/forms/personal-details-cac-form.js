import React from "react";
import { ScrollView, View } from "react-native";
import BaseForm from "../../../../../../src/components/base-form";
import Button from "../../../../../components/button";
import FormPicker from "../../../../../components/form-controls/form-picker";
import Text from "../../../../../components/text";
import { NIGERIA } from "../../../../../constants";
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


const LINE_OF_BUSINESS = [
  {
    name: "General Merchandise",
    value: "General MerchandiseMale",
  },
  {
    name: "Trading",
    value: "Trading",
  },
  {
    name: "ICT Service",
    value: "ICT Service",
  },
  {
    name: "Data Analysis",
    value: "Data Analysis",
  },
  {
    name: "Poultry/Livestock Farming",
    value: "Poultry/Livestock Farming",
  },
  {
    name: "Crop production farming/Agro allied service",
    value: "Crop production farming/Agro allied service",
  },
  {
    name: "Hair stylist/salon",
    value: "Hair stylist/salon",
  },
  {
    name: "Solar Panel installation",
    value: "Solar Panel installation",
  },
  {
    name: "Digital Marketing",
    value: "Digital Marketing",
  },
  {
    name: "Digital Marketing",
    value: "Digital Marketing",
  },
  {
    name: "Content Creation",
    value: "Content Creation",
  },
  {
    name: "Web Design",
    value: "Web Design",
  },
  {
    name: "POS Agent",
    value: "POS Agent",
  },
  {
    name: "Fashion design/tailoring",
    value: "Fashion design/tailoring",
  },
];

export class PersonalDetailsCacForm extends BaseForm {
  requiredFields = ["state"];
  constructor() {
    super();
    this.state = {
      form: {
        state: null,
      },
      invalidFields: [],
      lineOfBusiness: [],
      states: [],
      lgas: [],
      countries: [],
      buttonDisabled: true,
      isLoading: false,
      invalidName: false,
      savedCacBusinessForm: null,
    };

    this.fetchCountries = this.fetchCountries.bind(this);
    this.fetchStates = this.fetchStates.bind(this);
    this.onStateSelect = this.onStateSelect.bind(this);
  }

  componentDidMount() {
    this.fetchCountries();
    this.fetchStates();
  }

  componentDidUpdate(prev){

  }


  checkFormValidity() {
    const formIsComplete = this.state.isComplete;
    const formIsValid = this.state.isValid;
    const formData = this.state.form;
    console.log("VALID PERSONAL FORM C", formData);

    if (!(formIsComplete && formIsValid)) {
      this.setState({
        buttonDisabled: true,
      });
      return;
    } else {
      this.setState({
        buttonDisabled: false,
      });
    }
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
    const { onPress, loading, invalidName } = this.props;
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
                Complete The Details Below
              </Text>
            </View>
            <View style={{ marginTop: 2, marginBottom: 5 }}>
              {this.state.invalidName && (
                <Text mid red>
                  Business name cannot be empty & a one word
                </Text>
              )}
            </View>

            <FormPicker
              choices={this.state.states.map(({ value, name }) => ({
                label: name,
                value: value,
              }))}
              //   defaultValue={this.state.savedCacBusinessForm?.lineOfBusiness}
              innerContainerStyle={styles.formInputInnerContainerStyle}
              onSelect={(state, isValid) => {
                this.updateFormField({ state });
                onStateSelect(state)
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

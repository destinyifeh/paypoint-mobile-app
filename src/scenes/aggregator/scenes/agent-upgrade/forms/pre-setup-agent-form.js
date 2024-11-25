import React from "react";
import FormInput from "../../../../../components/form-controls/form-input";

import BaseForm from "../../../../../components/base-form";
import FormPhone from "../../../../../components/form-controls/form-phone";
import FormPicker from "../../../../../components/form-controls/form-picker";
import { NIGERIA } from "../../../../../constants";
import { SUCCESS_STATUS } from "../../../../../constants/api";
import CountriesStatesLgas from '../../../../../fixtures/countries_states_lgas.json';
import Platform from "../../../../../services/api/resources/platform";
import styles from "../styles";


export default class PreSetupAgentForm extends BaseForm {

  platform = new Platform();
  state = {
    form: {},
    invalidFields: [],
  };

  requiredFiles = [
    'motherMadienName'
  ];


  constructor() {
    super();
    this.fetchStates = this.fetchStates.bind(this);
  }

  componentDidMount(){
    console.log("NEw class:", this.props.application);
    this.fetchStates();
  }


  serializeApiData(applicantDetails) {
    return {
      firstName: applicantDetails.firstName,
      lastName: applicantDetails.surname,
      middleName: applicantDetails.middleName,
      phone: `${
        applicantDetails.phoneNumber
          ? `0${applicantDetails.phoneNumber.slice(3)}`
          : ""
      }`,
      email: applicantDetails.emailAddress,
      bvn: applicantDetails.bvn,
      dateOfBirth: applicantDetails.dateOfBirth,
    };
  }

  fetchStates() {
    const nigeria = CountriesStatesLgas?.find(value => value.name === NIGERIA);

    if(this.props.application.stateId != 0){
      this.onStateSelectPrestige(this.props.application.stateId)
    }else{
      this.setState({
        form: this.props.form,
        lgas: [],
        states: nigeria.states,
      });
    }
  }

  async onStateSelectPrestige(stateId) {
    const lgasResponseObj = await this.platform.retrieveLgas(
      stateId
    );
    const lgasResponseStatus = lgasResponseObj.status;
    const lgasResponse = lgasResponseObj.response;
    if (lgasResponseStatus === SUCCESS_STATUS) {
      this.setState({
        form: {...this.props.form,
          stateId,
          lga: this.props.form.lga
        },
        lgas: lgasResponse
      });
      

    }
    
  }

  async onStateSelect(stateId) {

    const lgasResponseObj = await this.platform.retrieveLgas(
      stateId
    );

    const lgasResponseStatus = lgasResponseObj.status;
    const lgasResponse = lgasResponseObj.response;
    if (lgasResponseStatus === SUCCESS_STATUS) {

      this.setState({
        form: {...this.props.form,
          state: stateId
        },
        lgas: lgasResponse
      });

    }
    else{
      this.setState({
        form:{...this.state.form, 
          state: stateId,
          lga: this.props.application.lga
        },
        lgas: state ? state.lgas : []
      });
    }
  }


  render() {

    return (
      <React.Fragment>

        <FormPhone
          autoCompleteType="tel"
          innerContainerStyle={styles.formInputInnerContainerStyle}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          text="Phone Number"
          textInputRef={(input) => (this.phone = input)}
          defaultValue={this.state.form?.businessPhoneNo}
          showValidIndicator
          disabled
          validators={{
            required: true,
          }}
        />

        <FormInput
          autoCapitalize="none"
          autoCompleteType="email"
          innerContainerStyle={styles.formInputInnerContainerStyle}
          leftIcon="mail"
          outerContainerStyle={styles.formInputOuterContainerStyle}
          showValidIndicator
          text="Email Address"
          textContentType="emailAddress"
          textInputRef={(input) => (this.email = input)}
          disabled
          defaultValue={this.state.form?.businessContact?.emailAddress}
          validators={{
            required: true,
          }}
          />

        <FormInput
          innerContainerStyle={styles.formInputInnerContainerStyle}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          text="Gender"
          defaultValue={this.state.form?.businessContact?.gender}
          showValidIndicator
          validators={{
            required: true,
          }}
          disabled
        />


        <FormInput
          innerContainerStyle={styles.formInputInnerContainerStyle}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          text="Date of Birth:"
          textInputRef={(input) => (this.dateOfBirth = input)}
          defaultValue={this.state.form?.businessContact?.dob}
          showValidIndicator
          width="100%"
          disabled
          validators={{
            required: true,
          }}
        />

        <FormInput
          innerContainerStyle={styles.formInputInnerContainerStyle}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          text="BVN:"
          textInputRef={(input) => (this.bvn = input)}
          defaultValue={this.state.form?.bvn}
          showValidIndicator
          width="100%"
          disabled
          validators={{
            required: true,
          }}
        />
        

        { this.props.application.newClass ==='Prestige' && this.state.lgas && <>
          <FormPicker
            choices={this.state.states?.map(({id, name}) => ({
              label: name,
              value: id
            }))}
            defaultValue={this.state.form.state}
            innerContainerStyle={styles.formInputInnerContainerStyle}
            onSelect={(state, isValid) => {
              this.updateFormField({state});
              this.onStateSelect(state)
              this.props.evaluateInvalidField({state}, 3)
            }}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            propagateError={this.props.propagateFormErrors}
            text="State:"
            validators={{
              required: true
            }} />

          <FormPicker 
            choices={this.state.lgas?.map(({id, name}) => ({
              label: name,
              value: id
            }))}
            defaultValue={this.state.form.lga}
            innerContainerStyle={styles.formInputInnerContainerStyle}
            onSelect={(lga, isValid) => {
              this.updateFormField({lga});
              this.props.evaluateInvalidField({lga}, 3)
            }}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            propagateError={this.props.propagateFormErrors}
            text="LGA:"
            validators={{
              required: true
            }} />
        </>}
        <FormInput
          autoCapitalize="none"
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(motherMadienName) => {
            this.updateFormField({ motherMadienName });
            this.props.evaluateInvalidField({motherMadienName}, 3)
          }}
          defaultValue={this.state.form?.motherMadienName}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="Mother's Maiden Name"
          propagateError={this.props.propagateFormErrors}
          text="Mother's Maiden Name"
          textInputRef={(input) => (this.motherMadienName = input)}
          validators={{
            required: true,
            minLength: 3
          }}
        />

      </React.Fragment>
    );
  }
}

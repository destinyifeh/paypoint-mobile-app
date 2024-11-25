import React from 'react';
import { ScrollView, ToastAndroid, View } from 'react-native';
import Accordion from '../../../components/accordion';
import Button from '../../../components/button';
import { APPLICATION, APP_NAME, INVALID_FORM_MESSAGE } from '../../../constants';
import { ERROR_STATUS } from '../../../constants/api';
import { BLOCKER } from '../../../constants/dialog-priorities';
import { COLOUR_RED } from '../../../constants/styles';
import Onboarding from '../../../services/api/resources/onboarding';
import { flashMessage } from '../../../utils/dialog';
import handleErrorResponse from '../../../utils/error-handlers/api';
import { sanitizeApplicationForm } from '../../../utils/sanitizers/application-form';
import { loadData, saveData } from '../../../utils/storage';
import { NextOfKinInformation as NextOfKinInformationContactInformation } from '../forms/next-of-kin-information';

export default class NextOfKinInformation extends React.Component {
  onboarding = new Onboarding();

  constructor() {
    super();

    this.state = {
      propagateFormErrors: false,
    };

    this.checkFormValidity = this.checkFormValidity.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  checkFormValidity() {
    const formIsComplete = this.form.state.isComplete;
    const formIsValid = this.form.state.isValid;

    if (!(formIsComplete && formIsValid)) {
      this.setState({
        isLoading: false,
        propagateFormErrors: true
      });

      return
    }

    return true;
  }

  async _saveApplication() {
    const formData = this.form.serializeFormData();

    const previouslySavedData = JSON.parse(await loadData(APPLICATION));

    const updatedApplicationForm = previouslySavedData;
    updatedApplicationForm.applicantDetails = {
      ...previouslySavedData.applicantDetails,
      nextOfKin: formData,
    };

    const sanitizedApplicationForm = sanitizeApplicationForm(updatedApplicationForm);

    const saveAsDraftResponse = await this.onboarding.saveAsDraft(sanitizedApplicationForm); //saveAsDraft
    const saveAsDraftResponseStatus = saveAsDraftResponse.status;
    const saveAsDraftResponseObj = saveAsDraftResponse.response;

    if (saveAsDraftResponseStatus === ERROR_STATUS) {
      this.setState({
        errorMessage: await handleErrorResponse(saveAsDraftResponseObj),
        isLoading: false,
      })

      ToastAndroid.show(
        await handleErrorResponse(saveAsDraftResponseObj), 
        ToastAndroid.SHORT
      );

      return
    }

    this.setState({
      errorMessage: null,
      isLoading: false
    });

    await saveData(APPLICATION, sanitizedApplicationForm);

    return saveAsDraftResponse;
  }

  async _submitApplication() {
    const previouslySavedData = JSON.parse(await loadData(APPLICATION));

    const sanitizedApplicationForm = sanitizeApplicationForm(previouslySavedData);

    const submitResponse = await this.onboarding.submit(sanitizedApplicationForm);
    console.log(submitResponse)
    const submitResponseStatus = submitResponse.status;
    const submitResponseObj = submitResponse.response;

    if (submitResponseStatus === ERROR_STATUS) {
      this.setState({
        errorMessage: await handleErrorResponse(submitResponseObj),
        isLoading: false,
      })

      ToastAndroid.show(
        await handleErrorResponse(submitResponseObj), 
        ToastAndroid.SHORT,
      );

      return
    }

    this.setState({
      errorMessage: null,
      isLoading: false,
    });

    return submitResponse;
  }

  async onSave() {
    this.setState({
      errorMessage: null,
      isLoading: true
    });

    const isFormValid = this.checkFormValidity();

    if (!isFormValid) {
      return
    }

    await this._saveApplication();
    // this._submitApplication();

    this.props.onSave();
  }

  async onSubmit() {
    this.setState({
      errorMessage: null,
      isLoading: true
    });

    const isFormValid = this.checkFormValidity();

    if (!isFormValid) {
      flashMessage(
        APP_NAME,
        INVALID_FORM_MESSAGE,
        BLOCKER
      );

      return
    }

    await this._saveApplication();
    // this._submitApplication();

    this.props.onSubmit();
  }

  render() {
    const contactInformationAccordion = <Accordion
      expanded={true}
      header="Next Of Kin Information"
      content={<NextOfKinInformationContactInformation 
        propagateFormErrors={this.state.propagateFormErrors}
        ref={form => this.form = form}
      />}
    />

    return <ScrollView>
      {contactInformationAccordion}

      <View 
        style={{
          justifyContent: 'center',
          flexDirection: 'row',
          marginBottom: 10
        }}
      >
        <Button
          containerStyle={{
            marginRight: 20,
            width: 150
          }} 
          loading={this.state.isLoading}
          title="Back"
          titleStyle={{
            color: COLOUR_RED
          }}
          onPressOut={this.props.onBack} 
          transparent
        />

        <Button 
          containerStyle={{
            width: 150
          }} 
          loading={this.state.isLoading}
          title="SUBMIT"
          onPressOut={this.onSubmit} 
        />
      </View>

    </ScrollView>
  }
}
import React from 'react';
import { ScrollView, ToastAndroid, View } from 'react-native';

import Accordion from '../../../../../components/accordion';
import Button from '../../../../../components/button';
import { APPLICATION, APP_NAME, INVALID_FORM_MESSAGE } from '../../../../../constants';
import { ERROR_STATUS } from '../../../../../constants/api';
import { BLOCKER } from '../../../../../constants/dialog-priorities';
import { COLOUR_PRIMARY } from '../../../../../constants/styles';
import Onboarding from '../../../../../services/api/resources/onboarding';
import { flashMessage } from '../../../../../utils/dialog';
import handleErrorResponse from '../../../../../utils/error-handlers/api';
import { sanitizeApplicationForm } from '../../../../../utils/sanitizers/application-form';
import { saveData } from '../../../../../utils/storage';
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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.application !== this.props.application) {
      this.setState({
        lastRefresh: new Date(),
      });
    }
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

    const previouslySavedData = this.props.application;

    const updatedApplicationForm = previouslySavedData;
    updatedApplicationForm.applicantDetails = {
      ...previouslySavedData.applicantDetails,
      nextOfKin: formData,
    };

    const sanitizedApplicationForm = sanitizeApplicationForm(updatedApplicationForm);

    const saveAsDraftResponse = await this.onboarding.saveApplication(sanitizedApplicationForm); //saveAsDraft
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
    const formData = this.form.serializeFormData();
    
    const previouslySavedData = this.props.application;

    const updatedApplicationForm = previouslySavedData;
    updatedApplicationForm.applicantDetails = {
      ...previouslySavedData.applicantDetails,
      nextOfKin: formData,
    };

    const sanitizedApplicationForm = sanitizeApplicationForm(updatedApplicationForm);

    const submitResponse = await this.onboarding.submitApplication(sanitizedApplicationForm);
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

    // REMOVE THIS BECAUSE OF CONFLICT WHEN THE USER EVENTUALLY PROCEEDS TO SUBMIT
    // await this._submitApplication();

    this.props.onSave();
  }

  async onSubmit() {
    this.setState({
      errorMessage: null,
      isLoading: true,
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
    // await this._submitApplication();

    this.props.onSubmit();
  }

  render() {
    const { application } = this.props;

    const contactInformationAccordion = <Accordion
      expanded={true}
      header="Next Of Kin Information"
      content={<NextOfKinInformationContactInformation
        application={application}
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
            color: COLOUR_PRIMARY
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

import React from 'react';
import {
  ScrollView,
  ToastAndroid
} from 'react-native';
import ImagePicker from 'react-native-image-picker';

import Accordion from '../../../../../../../components/accordion';
import Button from '../../../../../../../components/button';
import {
  DEFAULT_API_ERROR_MESSAGE,
  ERROR_STATUS
} from '../../../../../../../constants/api';
import Onboarding from '../../../../../../../services/api/resources/onboarding';
import handleErrorResponse from '../../../../../../../utils/error-handlers/api';
import { sanitizeApplicationForm } from '../../../../../../../utils/sanitizers/application-form';
import {
  Attachments as PersonalInformationAttachments,
  ContactInformation as PersonalInformationContactInformation,
  PersonalInformation as PersonalInformationPersonalInformation,
  ResidentialInformation as PersonalInformationResidentialInformation,
} from '../forms/personal-information';

export default class PersonalInformation extends React.Component {
  onboarding = new Onboarding();

  constructor() {
    super();

    this.state = {

    };

    this.onAddFileClick = this.onAddFileClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    // this.getPermissionAsync();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.application !== this.props.application) {
      this.setState({
        lastRefresh: new Date(),
      });
    }
  }

  getPermissionAsync () {
    if (Constants.platform.ios) {
      const { status } = Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

  onAddFileClick () {
    const options = {
      title: 'Upload Document',
      // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      // storageOptions: {
      //   skipBackup: true,
      //   path: 'images',
      // },
    };
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
    
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
    
        this.setState({
          avatarSource: source,
        });
      }
    });
  }

  checkFormValidity() {
    const contactInformationFormIsComplete = this.contactInformationForm.state.isComplete;
    const contactInformationFormIsValid = this.contactInformationForm.state.isValid;

    if (!(contactInformationFormIsComplete && contactInformationFormIsValid)) {
      this.setState({
        isLoading: false,
        propagateFormErrors: true
      });

      return
    }

    const residentialInformationFormIsComplete = this.residentialInformationForm.state.isComplete;
    const residentialInformationFormIsValid = this.residentialInformationForm.state.isValid;
    
    if (!(residentialInformationFormIsComplete && residentialInformationFormIsValid)) {
      this.setState({
        isLoading: false,
        propagateFormErrors: true
      });

      return
    }

    const personalInformationFormIsComplete = this.personalInformationForm.state.isComplete;
    const personalInformationFormIsValid = this.personalInformationForm.state.isValid;
    
    if (!(personalInformationFormIsComplete && personalInformationFormIsValid)) {
      this.setState({
        isLoading: false,
        propagateFormErrors: true
      });

      return
    }

    const haveAllDocumentsBeenAttached = this.attachmentsForm.state.isComplete;
    if (!haveAllDocumentsBeenAttached) {
      this.setState({
        isLoading: false,
        propagateFormErrors: true,
      });

      return
    }
    
    return true;
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

    const contactInformationFormData = this.contactInformationForm.serializeFormData();
    const residentialInformationFormData = this.residentialInformationForm.serializeFormData();
    const personalInformationFormData = this.personalInformationForm.serializeFormData();

    const previouslySavedData = this.props.application;

    const formData = {
      ...contactInformationFormData,
      ...residentialInformationFormData,
      ...personalInformationFormData
    }

    const updatedApplicationForm = previouslySavedData;
    updatedApplicationForm.applicantDetails = {
      ...previouslySavedData.applicantDetails,
      ...formData
    };

    const form_ = sanitizeApplicationForm(updatedApplicationForm);

    let saveAsDraftResponse = {};
    if (previouslySavedData.applicationId) {
      saveAsDraftResponse = await this.onboarding.saveApplication(form_);
    } else {
      saveAsDraftResponse = await this.onboarding.createApplication(form_);
    }

    const saveAsDraftResponseStatus = saveAsDraftResponse.status;
    const saveAsDraftResponseObj = saveAsDraftResponse.response;

    console.log('SAVE AS DRAFT RESPONSE', saveAsDraftResponseObj);

    if (saveAsDraftResponseStatus === ERROR_STATUS) {
      this.setState({
        errorMessage: await handleErrorResponse(saveAsDraftResponseObj),
        isLoading: false,
      });

      ToastAndroid.show(
        await handleErrorResponse(saveAsDraftResponseObj), 
        ToastAndroid.SHORT
      );

      return
    }

    this.props.updateApplication(saveAsDraftResponseObj);
    
    await this.uploadAttachments(saveAsDraftResponseObj);

    this.setState({
      errorMessage: null,
      isLoading: false
    });

    this.props.onSubmit(
      saveAsDraftResponseObj
    );

    return saveAsDraftResponseObj;
  }

  async onSubmit() {
    this.setState({
      errorMessage: null,
      isLoading: true
    });

    const isFormValid = this.checkFormValidity();

    if (!isFormValid) {
      return
    }

    const contactInformationFormData = this.contactInformationForm.serializeFormData();
    const residentialInformationFormData = this.residentialInformationForm.serializeFormData();
    const personalInformationFormData = this.personalInformationForm.serializeFormData();

    const previouslySavedData = this.props.application;

    const formData = {
      ...contactInformationFormData,
      ...residentialInformationFormData,
      ...personalInformationFormData,
    };

    const updatedApplicationForm = previouslySavedData;
    updatedApplicationForm.applicantDetails = {
      ...previouslySavedData.applicantDetails,
      ...formData,
    };

    const form_ = sanitizeApplicationForm(updatedApplicationForm);

    let saveAsDraftResponse = {};
    if (previouslySavedData.applicationId) {
      saveAsDraftResponse = await this.onboarding.saveApplication(form_);
    } else {
      saveAsDraftResponse = await this.onboarding.createApplication(form_);
    }

    const saveAsDraftResponseStatus = saveAsDraftResponse.status;
    const saveAsDraftResponseObj = saveAsDraftResponse.response;

    console.log('SAVE AS DRAFT RESPONSE', saveAsDraftResponseObj);

    if (saveAsDraftResponseStatus === ERROR_STATUS) {
      this.setState({
        errorMessage: await handleErrorResponse(saveAsDraftResponseObj),
        isLoading: false,
      });

      ToastAndroid.show(
        await handleErrorResponse(saveAsDraftResponseObj), 
        ToastAndroid.SHORT
      );

      return
    }
    
    await this.attachmentsForm.uploadAllDocuments(() => { 
      this.setState({
        errorMessage: null,
        isLoading: false,
      });

      this.props.onSubmit(saveAsDraftResponseObj);
      
      this.props.updateApplication(saveAsDraftResponseObj);
    }, () => {
      this.setState({
        errorMessage: DEFAULT_API_ERROR_MESSAGE,
        isLoading: false,
      });
    });

    return null;
  }

  render () {
    const { application } = this.props;

    const contactInformationAccordion = <Accordion
      expanded={true}
      header="Contact Information"
      content={<PersonalInformationContactInformation
        application={application}
        propagateFormErrors={this.state.propagateFormErrors}
        ref={form => this.contactInformationForm = form} 
      />}
    />

    const residentialAddressAccordion = <Accordion
      expanded={true}
      header="Residential Address"
      content={<PersonalInformationResidentialInformation 
        application={application}
        propagateFormErrors={this.state.propagateFormErrors}
        ref={form => this.residentialInformationForm = form}
      />}
    />

    const personalInformationAccordion = <Accordion
      expanded={true}
      header="Personal Information"
      content={<PersonalInformationPersonalInformation 
        application={application}
        propagateFormErrors={this.state.propagateFormErrors}
        ref={form => this.personalInformationForm = form}
      />}
    />

    const attachmentsAccordion = <Accordion
      expanded={true}
      header="Attachments"
      content={<PersonalInformationAttachments 
        application={application}
        propagateFormErrors={this.state.propagateFormErrors}
        ref={form => this.attachmentsForm = form}
      />}
    />

    return <ScrollView>
      {contactInformationAccordion}
      {residentialAddressAccordion}
      {personalInformationAccordion}
      {attachmentsAccordion}

      <Button
        containerStyle={{
          alignSelf: 'center',
          marginBottom: 10,
          width: 150
        }}
        loading={this.state.isLoading}
        title="NEXT"
        onPressOut={this.onSubmit}
      />

    </ScrollView>
  }
}

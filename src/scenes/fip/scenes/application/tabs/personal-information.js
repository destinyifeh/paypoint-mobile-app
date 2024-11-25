import React from 'react'
import { ScrollView, ToastAndroid } from 'react-native'
import ImagePicker from 'react-native-image-picker'

import Accordion from '../../../../../components/accordion'
import Button from '../../../../../components/button'
import { APP_NAME, INVALID_FORM_MESSAGE } from '../../../../../constants'
import { DEFAULT_API_ERROR_MESSAGE, ERROR_STATUS, SUCCESS_STATUS } from '../../../../../constants/api'
import { BLOCKER } from '../../../../../constants/dialog-priorities'
import Onboarding from '../../../../../services/api/resources/onboarding'
import { flashMessage } from '../../../../../utils/dialog'
import handleErrorResponse from '../../../../../utils/error-handlers/api'
import { sanitizeApplicationForm } from '../../../../../utils/sanitizers/application-form'
import {
  Attachments as PersonalInformationAttachments,
  ContactInformation as PersonalInformationContactInformation,
  PersonalInformation as PersonalInformationPersonalInformation,
  ResidentialInformation as PersonalInformationResidentialInformation
} from '../forms/personal-information'


export default class PersonalInformation extends React.Component {
  onboarding = new Onboarding();

  constructor() {
    super();

    this.state = {

    };

    this.onAddFileClick = this.onAddFileClick.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    console.log('PERSONAL INFORMATION IS RE-MOUNTING');
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
      title: 'Upload Document'
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

    const personalInformationFormIsComplete = this.personalInformationForm.state.isComplete;
    const personalInformationFormIsValid = this.personalInformationForm.state.isValid;

    const residentialInformationFormIsComplete = this.residentialInformationForm.state.isComplete;
    const residentialInformationFormIsValid = this.residentialInformationForm.state.isValid;
    
    const haveAllDocumentsBeenAttached = this.attachmentsForm.state.isComplete;

    console.log({contactInformationFormIsComplete, contactInformationFormIsValid, personalInformationFormIsComplete, personalInformationFormIsValid, residentialInformationFormIsComplete, residentialInformationFormIsValid, haveAllDocumentsBeenAttached})

    if (!(contactInformationFormIsComplete && contactInformationFormIsValid)) {
      this.setState({
        isLoading: false,
        propagateFormErrors: true
      });

      return
    }
    
    if (!(residentialInformationFormIsComplete && residentialInformationFormIsValid)) {
      this.setState({
        isLoading: false,
        propagateFormErrors: true
      });

      return
    }
    
    if (!(personalInformationFormIsValid && personalInformationFormIsComplete)) {
      this.setState({
        isLoading: false,
        propagateFormErrors: true
      });

      return
    }

    if (!haveAllDocumentsBeenAttached) {
      this.setState({
        isLoading: false,
        propagateFormErrors: true,
      });

      return false;
    }
    
    return true;
  }

  async onSave() {
    this.setState({
      errorMessage: null,
      isLoading: true
    });

    const contactInformationFormData = this.contactInformationForm.serializeFormData();
    const residentialInformationFormData = this.residentialInformationForm.serializeFormData();
    const personalInformationFormData = this.personalInformationForm.serializeFormData();

    const getApplicationResponse = await this.onboarding.getApplicationById(this.props.application.applicationId);
    if (getApplicationResponse.status === ERROR_STATUS) {
      flashMessage(
        null,
        await handleErrorResponse(getApplicationResponse.response),
        BLOCKER
      );

      this.setState({
        errorMessage: null,
        isLoading: false
      });

      return
    }
    const previouslySavedData = getApplicationResponse.response;

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
    
    this.setState({
      errorMessage: null,
      isLoading: false
    });

    this.props.updateApplication(saveAsDraftResponseObj);

    return saveAsDraftResponseObj;
  }

  async onSubmit() {
    this.setState({
      errorMessage: null,
      isLoading: true
    });

    const isFormValid = this.checkFormValidity();
    console.log({isFormValid});

    if (!isFormValid) {
      flashMessage(
        APP_NAME,
        INVALID_FORM_MESSAGE,
        BLOCKER
      );

      return
    }

    const getApplicationResponse = await this.onboarding.getApplicationById(this.props.application.applicationId);
    if (getApplicationResponse.status === ERROR_STATUS) {
      flashMessage(
        null,
        await handleErrorResponse(getApplicationResponse.response),
        BLOCKER
      );

      this.setState({
        errorMessage: null,
        isLoading: false
      });

      return
    }
    const previouslySavedData = getApplicationResponse.response;

    const contactInformationFormData = this.contactInformationForm.serializeFormData();
    const residentialInformationFormData = this.residentialInformationForm.serializeFormData();
    const personalInformationFormData = this.personalInformationForm.serializeFormData();

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

    console.log('WILL SOON SAVE AS DRAFT');

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
    
    await this.attachmentsForm.uploadAllDocuments(async () => { 
      this.setState({
        errorMessage: null,
        isLoading: false,
      });

      this.props.onSubmit(saveAsDraftResponseObj);

      const retrieveApplicationResponse = await this.onboarding.getApplicationById(saveAsDraftResponseObj.applicationId);
      let latestApplicationObject = saveAsDraftResponseObj;
  
      if (retrieveApplicationResponse.status === SUCCESS_STATUS) {
        latestApplicationObject = retrieveApplicationResponse.response;
      }

      console.log('UPDATING APPLICATION WITH', {latestApplicationObject})

      this.props.updateApplication(latestApplicationObject);
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
        superAgents={this.props.superAgents}
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

    return (
      <ScrollView>
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
    );
  }
}

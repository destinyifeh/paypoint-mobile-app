import React from 'react';
import { ScrollView, ToastAndroid, View } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Accordion from '../../../components/accordion';
import Button from '../../../components/button';
import { APPLICATION, APP_NAME, INVALID_FORM_MESSAGE } from '../../../constants';
import { DEFAULT_API_ERROR_MESSAGE, ERROR_STATUS } from '../../../constants/api';
import { BLOCKER } from '../../../constants/dialog-priorities';
import { COLOUR_RED } from '../../../constants/styles';
import Onboarding from '../../../services/api/resources/onboarding';
import { flashMessage } from '../../../utils/dialog';
import handleErrorResponse from '../../../utils/error-handlers/api';
import { sanitizeApplicationForm } from '../../../utils/sanitizers/application-form';
import { loadData, saveData } from '../../../utils/storage';
import {
  Attachments as BusinessInformationAttachments,
  BusinessInformation as BusinessInformationBusinessInformation
} from '../forms/business-information';

export default class BusinessInformation extends React.Component {
  onboarding = new Onboarding();

  constructor() {
    super();

    this.state = {
      attachments: [],
      propagateFormErrors: false,
    };

    this.onAddFileClick = this.onAddFileClick.bind(this);
    this.onGoBack = this.onGoBack.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    // this.getPermissionAsync();
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

    const attachmentsAreComplete = this.attachmentsForm.state.isComplete;
    const attachmentUploadsAreComplete = this.attachmentsForm.state;
    if (!attachmentsAreComplete || !attachmentUploadsAreComplete) {
      this.setState({
        isLoading: false,
        propagateFormErrors: true
      });

      return
    }
    
    return true;
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
      title: 'Upload Attachment'
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
          attachments: [
            ...this.state.attachments,
            response
          ],
        });
      }
    });
  }

  // async uploadAttachments() {
  //   const previouslySavedData = JSON.parse(await loadData(APPLICATION));

  //   const attachments = this.attachmentsForm.serializeFormData();
  //   attachments.map(async value => {
  //     await this.onboarding.documentUpload(
  //       previouslySavedData.applicationId,
  //       value.documentName,
  //       value
  //     );
  //   });
  // }

  async onGoBack() {
    flashMessage(
      null,
      'Saving application...',
      CASUAL
    );

    this.setState({
      isLoading: true
    });

    await this.onSave()

    flashMessage(
      null,
      'Saved successfully',
      CASUAL
    )

    this.setState({
      isLoading: false
    });

    this.props.onBack();
  }

  async onSave() {
    this.setState({
      errorMessage: null,
      isLoading: true
    });

    let previouslySavedData = JSON.parse(await loadData(APPLICATION));

    const getApplicationResponse = await this.onboarding.getApplicationById(previouslySavedData.applicationId);
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
    previouslySavedData = getApplicationResponse.response;

    // await this.uploadAttachments();

    const formData = this.form.serializeFormData();

    const updatedApplicationForm = previouslySavedData;
    updatedApplicationForm.businessDetails = {
      ...previouslySavedData.businessDetails,
      ...formData
    };

    const form_ = sanitizeApplicationForm(updatedApplicationForm);

    const saveAsDraftResponse = await this.onboarding.saveAsDraft(form_);
    const saveAsDraftResponseStatus = saveAsDraftResponse.status;
    const saveAsDraftResponseObj = saveAsDraftResponse.response;

    if (saveAsDraftResponseStatus === ERROR_STATUS) {
      this.setState({
        errorMessage: await handleErrorResponse(saveAsDraftResponseObj),
        isLoading: false,
      })

      ToastAndroid.show(
        await handleErrorResponse(saveAsDraftResponseObj), 
        ToastAndroid.LONG,
      );

      return
    }

    this.setState({
      errorMessage: null,
      isLoading: false
    });

    await saveData(APPLICATION, saveAsDraftResponseObj);

    this.props.onSave();

    return saveAsDraftResponseObj;
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

    let previouslySavedData = JSON.parse(await loadData(APPLICATION));

    const getApplicationResponse = await this.onboarding.getApplicationById(previouslySavedData.applicationId);
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
    previouslySavedData = getApplicationResponse.response;

    // await this.uploadAttachments();

    const formData = this.form.serializeFormData();

    const updatedApplicationForm = previouslySavedData;
    updatedApplicationForm.businessDetails = {
      ...previouslySavedData.businessDetails,
      ...formData
    };

    const form_ = sanitizeApplicationForm(updatedApplicationForm);

    const saveAsDraftResponse = await this.onboarding.saveAsDraft(form_);
    const saveAsDraftResponseStatus = saveAsDraftResponse.status;
    const saveAsDraftResponseObj = saveAsDraftResponse.response;

    if (saveAsDraftResponseStatus === ERROR_STATUS) {
      this.setState({
        errorMessage: await handleErrorResponse(saveAsDraftResponseObj),
        isLoading: false,
      })

      ToastAndroid.show(
        await handleErrorResponse(saveAsDraftResponseObj), 
        ToastAndroid.LONG,
      );

      return
    }
    
    await this.attachmentsForm.uploadAllDocuments(() => { 
      this.setState({
        errorMessage: null,
        isLoading: false,
      });

      saveData(APPLICATION, saveAsDraftResponseObj).then(
        () => {
          this.props.onSubmit(saveAsDraftResponseObj);
        }
      )
      
    }, () => {
      this.setState({
        errorMessage: DEFAULT_API_ERROR_MESSAGE,
        isLoading: false,
      });
    });

    return saveAsDraftResponseObj;
  }

  removeAttachment (attachment) {
    this.setState({
      attachments: this.state.attachments.filter(value => value !== attachment)
    })
  }

  render () {
    const businessInformationAccordion = <Accordion
      expanded={true}
      header="Business Information"
      content={<BusinessInformationBusinessInformation 
        propagateFormErrors={this.state.propagateFormErrors}
        ref={form => this.form = form}
      />}
    />

    const attachmentsAccordion = <Accordion
      expanded={true}
      header="Attachments"
      content={<BusinessInformationAttachments 
        propagateFormErrors={this.state.propagateFormErrors}
        ref={form => this.attachmentsForm = form}
      />}
    />

    return <ScrollView>
      {businessInformationAccordion}
      {attachmentsAccordion}

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
          onPressOut={this.onGoBack} 
          transparent
        />

        <Button 
          containerStyle={{
            alignSelf: 'center',
            width: 150
          }} 
          loading={this.state.isLoading}
          title="NEXT"
          onPressOut={this.onSubmit} 
        />
      </View>

    </ScrollView>
  }
}
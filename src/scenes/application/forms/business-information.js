import React from 'react';

import { Linking } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

import BaseForm from '../../../components/base-form';
import Button from '../../../components/button';
import ClickableListItem from '../../../components/clickable-list-item';
import FilePreview from '../../../components/file-preview';
import FormInput from '../../../components/form-controls/form-input';
import FormPhone from '../../../components/form-controls/form-phone';
import FormPicker from '../../../components/form-controls/form-picker';
import Hyperlink from '../../../components/hyperlink';
import Text from '../../../components/text';
import { APPLICATION, NIGERIA } from '../../../constants';
import { ERROR_STATUS } from '../../../constants/api';
import { CDN_BASE_URL } from '../../../constants/api-resources';
import { BLOCKER } from '../../../constants/dialog-priorities';
import { ACCOUNT_NUMBER_LENGTH, MIN_NAME_LENGTH, MIN_NIGERIA_PHONE_LENGTH } from '../../../constants/fields';
import { COLOUR_GREY, COLOUR_LINK_BLUE } from '../../../constants/styles';
import Banks from '../../../fixtures/banks';
import BusinessTypes from '../../../fixtures/business_types';
import CountriesStatesLgas from '../../../fixtures/countries_states_lgas';
import UploadFileMenu from '../../../fragments/upload-file-menu';
import Onboarding from '../../../services/api/resources/onboarding';
import { flashMessage } from '../../../utils/dialog';
import handleErrorResponse from '../../../utils/error-handlers/api';
import { loadData } from '../../../utils/storage';
import styles from '../styles';


export class BusinessInformation extends BaseForm {
  requiredFields = [
    'businessName',
    'businessAddress',
    'phone',
    'businessType',
    'bankName',
    'accountNumber',
    'state',
    'lga'
  ];

  state = {
    businessDetails: {

    },
    form: {
      businessName: null,
      businessAddress: null,
      companyRegistrationNo: null,
      phone: null,
      businessType: null,
      bankName: null,
      accountNumber: null,
      state: null,
      lga: null
    },
    invalidFields: [],
    lgas: [],
    states: []
  }

  constructor() {
    super()

    this.fetchStates = this.fetchStates.bind(this);
    Banks.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
  }

  componentDidMount() {
    this.fetchStates();

    loadData(APPLICATION).then(application => {
      const businessDetails = JSON.parse(application).businessDetails || {};

      this.setState({
        businessDetails,
        form: this.serializeApiData(businessDetails),
      });
    });
  }

  fetchStates() {
    const nigeria = CountriesStatesLgas.find(value => value.name === NIGERIA);

    this.setState({
      states: nigeria.states,
    });
  }

  onStateSelect(stateId) {
    const country = CountriesStatesLgas.find(
      value => value.name == NIGERIA
    );

    const state = country.states.find(
      value => value.id == stateId
    );

    this.setState({
      lgas: state ? state.lgas : []
    });
  }

  serializeApiData(businessDetails) {
    const {
      businessName,
      address,
      companyRegistrationNumber,
      phoneNumber,
      businessType,
      bankName,
      accountNumber,
      state,
      localGovernmentArea,
    } = businessDetails;

    return {
      businessName: businessName || null,
      businessAddress: address || null,
      companyRegistrationNo: companyRegistrationNumber || null,
      phone: phoneNumber ? `0${phoneNumber.slice(3)}` : null,
      businessType: businessType || null,
      bankName: bankName || null,
      accountNumber: accountNumber || null,
      state: state ? parseInt(state) : null,
      lga: localGovernmentArea ? parseInt(localGovernmentArea) : null,
    };
  }

  serializeFormData() {
    const {
      businessName, 
      businessAddress, 
      companyRegistrationNo, 
      phone, 
      businessType, 
      bankName, 
      accountNumber,
      state,
      lga
    } = this.state.form;

    return {
      businessName,
      address: businessAddress,
      companyRegistrationNumber: companyRegistrationNo,
      phoneNumber: phone ? `+234${phone.slice(1)}` : null,
      businessType,
      bankName,
      accountNumber,
      state,
      localGovernmentArea: lga,
    }
  }

  render() {
    return <React.Fragment>
      <FormInput
        autoCompleteType='name'
        defaultValue={this.state.form.businessName}
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(businessName, isValid) => {
          this.updateFormField({businessName});
          !isValid ? this.addInvalidField('businessName') : this.removeInvalidField('businessName');
        }}
        onSubmitEditing={() => {
          this.businessAddress.focus()
        }}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder='Your business name'
        propagateError={this.props.propagateFormErrors}
        text="Business Name:"
        textInputRef={(input) => this.businessName = input}
        validators={{
          minLength: MIN_NAME_LENGTH,
          regex: 'name',
          required: true,
        }}
      />

      <FormInput
        autoCompleteType='name'
        defaultValue={this.state.form.businessAddress}
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(businessAddress, isValid) => {
          this.updateFormField({businessAddress});
          !isValid ? this.addInvalidField('businessAddress') : this.removeInvalidField('businessAddress');
        }}
        onSubmitEditing={() => {
          this.phone.focus()
        }}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder='Your business address'
        propagateError={this.props.propagateFormErrors}
        text="Business Address:"
        textInputRef={(input) => this.businessAddress = input}
        validators={{
          minLength: MIN_NAME_LENGTH,
          regex: 'sentence',
          required: true,
        }}
      />

      <FormInput
        autoCompleteType='name'
        defaultValue={this.state.form.companyRegistrationNo}
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(companyRegistrationNo, isValid) => {
          this.updateFormField({companyRegistrationNo});
          !isValid ? this.addInvalidField('companyRegistrationNo') : this.removeInvalidField('companyRegistrationNo');
        }}
        onSubmitEditing={() => {
          this.phone.focus()
        }}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder='Your company registration no'
        propagateError={this.props.propagateFormErrors}
        text="Company Registration No:"
        textInputRef={(input) => this.companyRegistrationNo = input}
        validators={{
          minLength: MIN_NAME_LENGTH,
          regex: 'alphanumeric',
        }}
      />

      <FormPhone
        autoCompleteType='tel'
        defaultValue={this.state.form.phone}
        innerContainerStyle={styles.formInputInnerContainerStyle}
        keyboardType='number-pad'
        onChangeText={(phone, isValid) => {
          this.updateFormField({phone});
          !isValid ? this.addInvalidField('phone') : this.removeInvalidField('phone');
        }}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder='08012345678'
        propagateError={this.props.propagateFormErrors}
        text="Phone:"
        textInputRef={(input) => this.phone = input}
        validators={{
          length: MIN_NIGERIA_PHONE_LENGTH,
          required: true,
        }}
      />

      <FormPicker 
        choices={BusinessTypes.map(({id, name}) => ({
          label: name,
          value: name
        }))}
        defaultValue={this.state.form.businessType}
        innerContainerStyle={styles.formInputInnerContainerStyle}
        showTextInputForOption="Others"
        onSelect={(businessType, isValid) => {
          this.updateFormField({businessType});
          !isValid ? this.addInvalidField('businessType') : this.removeInvalidField('businessType');
        }}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        propagateError={this.props.propagateFormErrors}
        text="Business Type:"
        validators={{
          required: true
        }} />

      <FormPicker 
        choices={Banks.map(({id, name}) => ({
          label: name,
          value: name
        }))}
        defaultValue={this.state.form.bankName}
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onSelect={(bankName, isValid) => {
          this.updateFormField({bankName});
          !isValid ? this.addInvalidField('bankName') : this.removeInvalidField('bankName');
        }}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        propagateError={this.props.propagateFormErrors}
        text="Bank:"
        validators={{
          required: true
        }} />

      <FormInput
        autoCompleteType='name'
        defaultValue={this.state.form.accountNumber}
        innerContainerStyle={styles.formInputInnerContainerStyle}
        keyboardType='number-pad'
        maxLength={ACCOUNT_NUMBER_LENGTH}
        onChangeText={(accountNumber, isValid) => {
          this.updateFormField({accountNumber});
          !isValid ? this.addInvalidField('accountNumber') : this.removeInvalidField('accountNumber');
        }}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder='Account Number'
        propagateError={this.props.propagateFormErrors}
        text="Account Number:"
        textInputRef={(input) => this.accountNumber = input}
        validators={{
          length: ACCOUNT_NUMBER_LENGTH,
          regex: 'numeric',
          required: true,
        }}
      />

      <FormPicker 
        choices={this.state.states.map(({id, name}) => ({
          label: name,
          value: id
        }))}
        defaultValue={this.state.form.state}
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onSelect={(state, isValid) => {
          this.updateFormField({state});
          this.onStateSelect(state)
          !isValid ? this.addInvalidField('state') : this.removeInvalidField('state');
        }}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        propagateError={this.props.propagateFormErrors}
        text="State:"
        validators={{
          required: true
        }} />

      <FormPicker 
        choices={this.state.lgas.map(({id, name}) => ({
          label: name,
          value: id
        }))}
        defaultValue={this.state.form.lga}
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onSelect={(lga, isValid) => {
          this.updateFormField({lga});
          !isValid ? this.addInvalidField('lga') : this.removeInvalidField('lga');
        }}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        propagateError={this.props.propagateFormErrors}
        text="LGA:"
        validators={{
          required: true
        }} />
    </React.Fragment>
  }
}

export class Attachments extends BaseForm {
  ignoreFiles = [
    'ID Card',
    'Passport Photo'
  ];

  requiredFiles = [
    'Utility Bill',
    // 'Certificate of Incorporation',
    "Guarantor's Form"
  ];

  onboarding = new Onboarding();

  constructor() {
    super();

    this.state = {
      attachments: [],
      filesAttached: [],
      isComplete: null,
    };
    
    this.getAttachment = this.getAttachment.bind(this);
    this.onAddDocumentClick = this.onAddDocumentClick.bind(this);
    this.onAddFileClick = this.onAddFileClick.bind(this);
    this.onAddImageClick = this.onAddImageClick.bind(this);
    this.removeAttachment = this.removeAttachment.bind(this);
    this.uploadAllDocuments = this.uploadAllDocuments.bind(this);
    this.uploadDocument = this.uploadDocument.bind(this);
  }

  componentDidMount() {

    loadData(APPLICATION).then(
      response => {
        const application = JSON.parse(response);
        
        const isComplete = !application.documentsList ? [] : application.documentsList.filter(
          value => this.requiredFiles.includes(value.documentName) || this.requiredFiles.includes(value.documentType)
        ).length >= this.requiredFiles.length;

        const businessInformationAttachments = this.serializeApiData(application.documentsList || []).filter(
          attachment => !this.ignoreFiles.includes(attachment.documentName)
        );        

        const filesAttached = businessInformationAttachments.map(
          ({documentType}) => documentType
        );

        this.setState({
          application,
          attachments: businessInformationAttachments,
          filesAttached,
          isComplete
        })
      }
    );
  }

  getAttachment (documentName) {
    return this.state.attachments.find(
      value => value.documentName === documentName || value.documentType === documentName
    )
  }
  
  async onAddDocumentClick () {
    let documentName = this.documentName;

    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf]
      });

      documentName = documentName || res.name;
  
      const response = {
        documentName,
        hasBeenUploaded: false,
        fileName: res.name,
        ...res
      };
  
      this.state.application.applicationId && this.uploadDocument(response).then(
        value => {
          const newFilesAttached = this.state.filesAttached.includes(documentName) ? 
            this.state.filesAttached : [
              ...this.state.filesAttached,
              documentName
            ];
      
          const isComplete = newFilesAttached.filter(
            value => this.requiredFiles.includes(value)
          ).length >= this.requiredFiles.length;

          this.setState({
            attachments: [
              ...this.state.attachments,
              response
            ],
            filesAttached: newFilesAttached,
            isComplete
          });
        }
      );

    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  async onAddImageClick() {
    let documentName = this.documentName;

    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images]
      });

      documentName = documentName || res.name;
  
      const response = {
        documentName,
        hasBeenUploaded: false,
        fileName: res.name,
        ...res
      };
  
      this.state.application.applicationId && this.uploadDocument(response).then(
        value => {  
          const newFilesAttached = this.state.filesAttached.includes(documentName) ? 
            this.state.filesAttached : [
              ...this.state.filesAttached,
              documentName
            ];

          const isComplete = newFilesAttached.filter(
            value => this.requiredFiles.includes(value)
          ).length >= this.requiredFiles.length;

          this.setState({
            attachments: [
              ...this.state.attachments,
              response
            ],
            filesAttached: newFilesAttached,
            isComplete
          });
        }
      );

    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  onAddFileClick (documentName) {
    this.documentName = documentName;
    this.uploadFileMenu.open();
  }

  removeAttachment (attachment) {
    const newAttachments = this.state.attachments.filter(value => value !== attachment);
    const newFilesAttached = this.state.filesAttached.filter(value => value !== attachment.documentName);

    const isComplete = newFilesAttached.filter(
      value => this.requiredFiles.includes(value)
    ).length === this.requiredFiles.length;
    
    this.setState({
      attachments: newAttachments,
      filesAttached: newFilesAttached,
      isComplete
    });
  }

  serializeApiData(attachments) {
    return attachments.map(value => {
      return {
        uri: `${CDN_BASE_URL}/p/finch/onboarding/${value.documentName}`,
        fileName: value.documentName,
        documentName: value.documentType,
        documentType: value.documentType,
        hasBeenUploaded: true
      }
    })
  }

  serializeFormData() {
    return this.state.attachments.map(value => {
      value.url = value.uri
      return value
    })
  }

  async uploadDocument(value, onCompleteDocumentUpload=() => {}, onDocumentUploadFailure=() => {}) { 
    if (value.hasBeenUploaded) {
      return 
    }

    const { application } = this.state;
    let attachments = this.state.attachments;
    const attachmentPreview = this.refs[`file-preview-${value.documentName}`];

    if (!attachmentPreview) {
      // console.log(this.refs);
      // console.log('No preview found. Retrying in the frame for >>>', value);
      // attachments.map(thisValue => {
      //   if (thisValue.documentName === value.documentName) {
      //     thisValue.isUploadComplete = true
      //   }
      // });

      setTimeout(
        () => this.uploadDocument(value, onCompleteDocumentUpload, onDocumentUploadFailure),
        1000
      );

      return value;
    }

    attachmentPreview.setState({
      didUploadFail: null,
      isUploadOngoing: true,
    });

    console.log('>>>>> APPLICATION', this.state.application);

    const { code, status, response } = await this.onboarding.documentUpload(
      application.applicationId,
      value.documentName,
      value,
    );

    attachments = this.state.attachments;
    
    attachmentPreview.setState({
      isUploadOngoing: false,
    });

    console.warn('DOCUMENT UPLOAD RESPONSE >>>', status, response, code);

    if (status === ERROR_STATUS) {
      flashMessage(
        'Document Upload',
        await handleErrorResponse(response),
        BLOCKER
      );
      onDocumentUploadFailure();
      
      attachmentPreview.setState({
        didUploadFail: true
      });
      
      return
    }

    value.hasBeenUploaded = true;

    attachments.map(thisValue => {
      if (thisValue.documentName === value.documentName) {
        thisValue.isUploadComplete = true;
      }
    });
    
    const isUploadComplete = attachments.filter(
      value => value.hasBeenUploaded
    ).length === attachments.length;

    isUploadComplete && onCompleteDocumentUpload();

    console.log({attachments})

    this.setState({
      attachments,
      isUploadComplete,
    });

    return value;
  }
  
  uploadAllDocuments(onCompleteDocumentUpload, onDocumentUploadFailure) {
    const { attachments, isUploadComplete } = this.state;

    const uploadedAttachments = attachments.filter(value => value.hasBeenUploaded);

    if (isUploadComplete || uploadedAttachments.length === attachments.length) {
      onCompleteDocumentUpload(); 
    }
    else {
      attachments.map(
        value => {
          !uploadedAttachments.includes(value) && this.uploadDocument(value, onCompleteDocumentUpload, onDocumentUploadFailure);
        }
      );
    }
  }

  render() {
    const displayedAttachments = [];
    const hiddenAttachments = [
      'ID Card',
      'Passport Photo'
    ];

    return <React.Fragment>
      <UploadFileMenu
        onAddDocumentClick={this.onAddDocumentClick} 
        onAddImageClick={this.onAddImageClick} 
        ref_={menu => this.uploadFileMenu = menu}
        requestClose={() => this.uploadFileMenu.close()}
      />
      <Text 
        style={{
          color: COLOUR_GREY, 
          marginBottom: 10
        }}
      >
        Attach a scanned copy each, of the confirmation documents in one of these media formats - .jpg, .jpeg, .png
      </Text>

      <Hyperlink 
        style={{
          marginBottom: 10
        }}
        onPress={() => Linking.openURL(`${CDN_BASE_URL}/p/finch-agent-dashboard/documents/CHARACTER CONFIRMATION FORM.pdf`)}
      >Download Character Attestation Form</Hyperlink>
      
      {this.requiredFiles.map((value, index) => {
        const attachment = this.getAttachment(value);
        attachment && displayedAttachments.push(attachment);

        return <ClickableListItem 
          key={index}
          onPressOut={() => !attachment && this.onAddFileClick(value)}
        >
          <FilePreview 
            attachment={attachment}
            name={value}
            onRemove={() => this.removeAttachment(attachment)}
            placeholder
            propagateError={this.props.propagateFormErrors}
            ref={`file-preview-${value}`}
            retry={() => this.uploadDocument(attachment)}
            validators={{
              required: true
            }}
          />
        </ClickableListItem>
      })}
      
      {this.state.attachments.map((value, index) => {
        console.log(hiddenAttachments, value)
        return !displayedAttachments.includes(value) && !hiddenAttachments.includes(value.documentName) ? <FilePreview
          attachment={value}
          key={index}
          onRemove={() => this.removeAttachment(value)}
          ref={`file-preview-${value.documentName}`}
        /> : <React.Fragment key={index} />
      })}

      <Button
        onPressOut={() => this.onAddFileClick(null)}  
        titleStyle={{
          color: COLOUR_LINK_BLUE
        }}
        title="+ Add Other Attachments"
        transparent
      />

    </React.Fragment>
  }
}

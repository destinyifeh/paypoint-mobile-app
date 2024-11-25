import React from 'react';
import ImagePicker from 'react-native-image-picker';

import BaseForm from '../../../../../components/base-form';
import Button from '../../../../../components/button';
import FilePreview from '../../../../../components/file-preview';
import FormInput from '../../../../../components/form-controls/form-input';
import FormPicker from '../../../../../components/form-controls/form-picker';
import Text from '../../../../../components/text';
import {
  ACCOUNT_NUMBER_LENGTH,
  MIN_NAME_LENGTH,
  MIN_NIGERIA_PHONE_LENGTH,
} from '../../../../../constants/fields';
import Banks from '../../../../../fixtures/banks';
import BusinessTypes from '../../../../../fixtures/business_types';
import CountriesStatesLgas from '../../../../../fixtures/countries_states_lgas';
import styles from '../styles';
import { NIGERIA } from '../../../../../constants';
import { COLOUR_GREY, COLOUR_LINK_BLUE } from '../../../../../constants/styles';
import ClickableListItem from '../../../../../components/clickable-list-item';
import { CDN_BASE_URL } from '../../../../../constants/api-resources';
import FormPhone from '../../../../../components/form-controls/form-phone';
import { ERROR_STATUS } from '../../../../../constants/api';
import Onboarding from '../../../../../services/api/resources/onboarding';
import Hyperlink from '../../../../../components/hyperlink';
import { Linking } from 'react-native';
import { formatPhoneNumberToReadable } from '../../../../../utils/formatters';
import UploadFileMenu from '../../../../../fragments/upload-file-menu';
import DocumentPicker from 'react-native-document-picker';

export class BusinessInformation extends BaseForm {
  requiredFields = [
    'businessName',
    'businessAddress',
    // 'companyRegistrationNo',
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
    Banks.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
  }

  componentDidMount() {
    const businessDetails = this.props.application.businessDetails || {};

    this.setState({
      businessDetails,
      form: this.serializeApiData(businessDetails),
    });

    this.fetchStates();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.application !== prevProps.application) {
      const businessDetails = this.props.application.businessDetails || {};
      
      this.setState({
        businessDetails,
        form: this.serializeApiData(businessDetails),
      });
    }
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
      phone: phoneNumber ? formatPhoneNumberToReadable(phoneNumber) : null,
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
          this.companyRegistrationNo.focus()
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
          // required: true,
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
        choices={BusinessTypes.map(({name}) => ({
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
        choices={Banks.map(({name}) => ({
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
  onboarding = new Onboarding();

  ignoreFiles = [
    'ID Card',
    'Passport Photo'
  ];

  requiredFiles = [
    'Utility Bill',
    "Guarantor's Form"
  ];

  constructor() {
    super();

    this.state = {
      attachments: [],
      filesAttached: [],
      isComplete: null,
    };
    
    this.onAddDocumentClick = this.onAddDocumentClick.bind(this);
    this.onAddFileClick = this.onAddFileClick.bind(this);
    this.onAddImageClick = this.onAddImageClick.bind(this);
    this.removeAttachment = this.removeAttachment.bind(this);
    this.uploadDocument = this.uploadDocument.bind(this);
  }

  componentDidMount() {
    const { application } = this.props;
        
    const isComplete = !application.documentsList ? [] : application.documentsList.filter(
      value => this.requiredFiles.includes(value.documentName) || this.requiredFiles.includes(value.documentType)
    ).length >= this.requiredFiles.length;

    const businessInformationAttachments = this.serializeApiData(application.documentsList || []).filter(
      attachment => !this.ignoreFiles.includes(attachment.documentName) && !this.ignoreFiles.includes(attachment.documentType)
    );

    // console.log({businessInformationAttachments})

    const filesAttached = businessInformationAttachments.map(
      ({documentType}) => documentType
    );

    this.setState({
      attachments: businessInformationAttachments,
      filesAttached,
      isComplete
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.application !== prevProps.application) {
      const attachments = this.serializeApiData(this.props.application.documentsList || []).filter(
        attachment => !this.ignoreFiles.includes(attachment.documentName) && !this.ignoreFiles.includes(attachment.documentType)
      );
      
      this.setState({
        attachments,
      });
    }
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
  
      this.props.application.applicationId && this.uploadDocument(response).then(
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
  
      this.props.application.applicationId && this.uploadDocument(response).then(
        value => {  
          const newFilesAttached = this.state.filesAttached.includes(documentName) ? 
            this.state.filesAttached : [
              ...this.state.filesAttached,
              documentName
            ];

          const isComplete = newFilesAttached.filter(
            value => this.requiredFiles.includes(value)
          ).length >= this.requiredFiles.length;

          // console.log('FIP BUSINESS', {newFilesAttached, isComplete})

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
        hasBeenUploaded: true,
        uri: `${CDN_BASE_URL}/p/finch/onboarding/${value.documentName}`,
        fileName: value.documentName,
        documentName: value.documentType,
        documentType: value.documentType
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

    let attachments = this.state.attachments;
    const attachmentPreview = this.refs[`file-preview-${value.documentName}`];

    if (!attachmentPreview) {
      setTimeout(
        () => this.uploadDocument(value, onCompleteDocumentUpload, onDocumentUploadFailure),
        1000
      );

      return value;
    }

    attachmentPreview.setState({
      didUploadFail: null,
      isUploadOngoing: true,
    })

    const { status, response } = await this.onboarding.documentUpload(
      this.props.application.applicationId || 2405,
      value.documentName,
      value,
    );

    attachments = this.state.attachments;
    
    attachmentPreview.setState({
      isUploadOngoing: false,
    })

    if (status === ERROR_STATUS) {
      onDocumentUploadFailure()
      
      attachmentPreview.setState({
        didUploadFail: true
      });
      
      return
    }

    value.hasBeenUploaded = true;

    attachments.map(thisValue => {
      if (thisValue.documentName === value.documentName) {
        thisValue.isUploadComplete = true
      }
    });
    
    const isUploadComplete = attachments.filter(
      value => value.hasBeenUploaded
    ).length === attachments.length;

    isUploadComplete && onCompleteDocumentUpload();

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
        {/* console.log(this.state.attachments); */}
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
        {/* console.log({hiddenAttachments, value}); */}
        return !displayedAttachments.includes(value) && !hiddenAttachments.includes(value.documentName) && !hiddenAttachments.includes(value.documentType) ? <FilePreview
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

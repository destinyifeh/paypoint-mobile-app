import Requester from '../finch-requester';
import { ACCOUNT_OPENING_API_BASE_URL } from '../../../constants/api-resources';

const API_BASE_URL = ACCOUNT_OPENING_API_BASE_URL;

export default class AccountOpening {
  constructor(props) {
    this.apiRequester = props ? props.apiRequester || new Requester({
      apiBaseUrl: API_BASE_URL,
    }) : new Requester({
      apiBaseUrl: API_BASE_URL,
    });
  }

  createAccount(firstName, lastName, email, phone) {
    return this.apiRequester.post({
      endpoint: 'finch-account-opening-service/api/v1/account/create-form',
      body: {
        firstName,
        lastName,
        email,
        phone,
      },
    });
  }

  registerAgentOnSanef() {
    return this.apiRequester.post({
      endpoint: 'finch-account-opening-service/api/v1/agent',
      cache: true,
    });
  }

  registerAgentOnSanefForCardLinking() {
    return this.apiRequester.post({
      endpoint: 'finch-account-opening-service/api/v1/card-linking-agent',
      cache: true,
    });
  }

  retrieveAccounts() {
    return this.apiRequester.get({
      endpoint: 'finch-account-opening-service/api/v1/accounts',
      args: {
        agentId,
      },
    });
  }

  retrieveBanks() {
    return this.apiRequester.get({
      endpoint: 'finch-account-opening-service/api/v1/banks',
    });
  }

  retrieveBanksForAccountOpening() {
    return this.apiRequester.get({
      endpoint: 'finch-account-opening-service/api/v1/banks/account-opening',
    });
  }

  retrieveBanksForCardLinking() {
    return this.apiRequester.get({
      endpoint: 'finch-account-opening-service/api/v1/banks/card-linking',
    });
  }

  saveForm(sanefAccountOpeningForm, deviceUuid) {
    return this.apiRequester.post({
      endpoint: 'finch-account-opening-service/api/v1/account/create-form',
      headers: {
        deviceUuid,
      },
      body: {
        ...sanefAccountOpeningForm,
      },
    });
  }

  submitForm(transactionReference) {
    return this.apiRequester.get({
      endpoint: 'finch-account-opening-service/api/v1/' +
        `account/submit-form/${transactionReference}`,
    });
  }

  uploadBase64Image(file, ref, type) {
    let fileType = file.type;
    if (fileType === null) {
      const fileNameSplitted = file.fileName.split('.');
      const fileExtension = fileNameSplitted[fileNameSplitted.length - 1];

      switch (fileExtension) {
        case 'jpg':
          fileType = 'image/jpeg';
          break;
        default:
          fileType = 'image';
          break;
      }
    }

    const formData = new FormData();
    formData.append('file', {
      name: file.fileName,
      filename: file.fileName,
      uri: file.uri,
      type: fileType,
    });

    return this.apiRequester.post({
      endpoint: 'finch-account-opening-service/api/v1/account/upload-image',
      body: {
        base64Data: file.base64Data,
        ref,
        type,
      },
    });
  }

  uploadImage(file, ref, type) {
    let fileType = file.type;
    if (fileType === null) {
      const fileNameSplitted = file.fileName.split('.');
      const fileExtension = fileNameSplitted[fileNameSplitted.length - 1];

      switch (fileExtension) {
        case 'jpg':
          fileType = 'image/jpeg';
          break;
        default:
          fileType = 'image';
          break;
      }
    }

    const formData = new FormData();
    formData.append('file', {
      name: file.fileName,
      filename: file.fileName,
      uri: file.uri,
      type: fileType,
    });

    return this.apiRequester.post({
      endpoint: 'finch-account-opening-service/api/v1/account/upload-image',
      headers: {
        'content-type': 'multipart/x-www-form-data',
        ref,
        type,
      },
      body: formData,
    });
  }

  linkCard(cardSerialNumber, otp, requestId) {
    return this.apiRequester.post({
      endpoint: 'finch-account-opening-service/api/v1/card-request/link-card',
      body: {
        cardSerialNumber,
        otp,
        requestId,
      },
    });
  }

  sendCardValidationOtp(accountNumber, bankCode, deviceUuid) {
    return this.apiRequester.post({
      endpoint: 'finch-account-opening-service/api/v1/card-request/send-otp',
      body: {
        accountNumber,
        bankCode,
      },
      headers: {
        deviceUuid,
      },
    });
  }
}

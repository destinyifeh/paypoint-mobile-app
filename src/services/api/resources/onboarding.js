import { ONBOARDING_API_BASE_URL } from "../../../constants/api-resources";
import Requester from "../finch-requester";

const API_BASE_URL = ONBOARDING_API_BASE_URL;

export default class Onboarding {
  constructor(props) {
    this.apiRequester = props
      ? props.apiRequester ||
        new Requester({
          apiBaseUrl: API_BASE_URL,
        })
      : new Requester({
          apiBaseUrl: API_BASE_URL,
        });
  }

  approveApplication(application) {
    return this.apiRequester.put({
      endpoint: "v2/finch-onboarding/v2/finch-onboarding/approval",
      body: {
        applicationID: application.applicationId,
        approvalStatus: "2",
      },
    });
  }

  createApplication(data) {
    return this.apiRequester.post({
      endpoint: "v2/finch-onboarding/applications",
      args: {
        draft: true,
      },
      body: data,
    });
  }
  createApplicationForFailedBvn(data, token) {
    return this.apiRequester.post({
      endpoint: "v2/finch-onboarding/applications",
      args: {
        draft: true,
      },
      body: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  declineApplication(application) {
    return this.apiRequester.put({
      endpoint: "v2/finch-onboarding/approval",
      body: {
        applicationID: application.applicationId,
        approvalStatus: "3",
      },
    });
  }

  getApplicationByEmailOrPhone(emailOrPhone) {
    return this.apiRequester.get({
      endpoint: `v2/finch-onboarding/applications/${emailOrPhone}`,
    });
  }

  getApplicationById(applicationId) {
    return this.apiRequester.get({
      endpoint: `v2/finch-onboarding/applications/${applicationId}`,
    });
  }

  getMyApplicationById(applicationId) {
    return this.apiRequester.get({
      endpoint: `v3/finch-onboarding/applications/${applicationId}`,
    });
  }

  getApplicationsByApprovalStatus(status) {
    return this.apiRequester.get({
      endpoint: "v2/finch-onboarding/applications",
      args: {
        status,
      },
    });
  }

  getMyApplicationsByApprovalStatus(status, pageNo) {
    return this.apiRequester.get({
      endpoint: "v2/finch-onboarding/applications/me",
      args: {
        status,
      },
    });
  }

  getApplicationByApplicationType(applicationType) {
    return this.apiRequester.get({
      endpoint: "v2/finch-onboarding/applications",
      args: {},
    });
  }

  getDocumentsByApplicationId(applicationId) {
    return this.apiRequester.get({
      endpoint: `v2/finch-onboarding/documents/${applicationId}`,
    });
  }

  getDocumentsByDocumentId(documentId) {
    return this.apiRequester.get({
      endpoint: `v2/finch-onboarding/document/${documentId}`,
    });
  }

  getMyApplications(args) {
    return this.apiRequester.get({
      endpoint: "v2/finch-onboarding/v2/applications/me",
      args,
    });
  }

  ping() {
    return this.apiRequester.get({
      endpoint: "v2/finch-onboarding/draft",
    });
  }

  saveApplication(data) {
    return this.apiRequester.put({
      endpoint: "v2/finch-onboarding/applications",
      body: data,
      args: {
        draft: true,
      },
    });
  }

  saveAsDraft(application) {
    return this.apiRequester.put({
      endpoint: "v2/finch-onboarding/applications",
      body: application,
      args: {
        draft: true,
      },
    });
  }

  searchApplications(args) {
    return this.apiRequester.get({
      endpoint: "v2/finch-onboarding/applications/v2/search",
      args,
    });
  }

  searchMyApplications() {
    return this.apiRequester.get({
      endpoint: "v3/finch-onboarding/applications/search",
    });
  }

  signUp(data, headers, params) {
    return this.apiRequester.post({
      endpoint: "v2/finch-onboarding/signup",
      body: data,
      headers,
      args: params,
    });
  }

  submit(application, selfOnboarding = false) {
    if (selfOnboarding == true) {
      return this.apiRequester.post({
        endpoint: "v3/finch-onboarding/applications",
        body: application,
        args: {
          draft: false,
        },
      });
    } else {
      return this.apiRequester.put({
        endpoint: "v2/finch-onboarding/applications",
        body: application,
        args: {
          draft: false,
        },
      });
    }
  }

  submitApplication(data) {
    return this.apiRequester.put({
      endpoint: "v2/finch-onboarding/applications",
      body: data,
      args: {
        draft: false,
      },
    });
  }

  validateApplication(application) {
    return this.apiRequester.put({
      endpoint: "v2/finch-onboarding/approval",
      body: {
        applicationID: application.applicationId,
        approvalStatus: "1",
      },
    });
  }

  validateBVNDetails(bvnForm) {
    return this.apiRequester.post({
      endpoint: `v3/finch-onboarding/bvn/agent/validate`,
      body: {
        bvnDateOfBirth: bvnForm.bvnDateOfBirth,
        bvnNumber: bvnForm.bvnNumber,
      },
    });
  }

  BvnConfirmation(bvn) {
    return this.apiRequester.post({
      endpoint: "v3/finch-onboarding/bvn/confirmation",
      body: {
        bvnNumber: bvn,
      },
    });
  }
  backupBvnConfirmation(bvn) {
    return this.apiRequester.post({
      endpoint: "v3/finch-onboarding/bvn/confirmation",
      body: {
        bvnNumber: bvn,
      },
    });
  }

  validateBVNDetailsAggregator(bvnForm) {
    return this.apiRequester.post({
      endpoint: `v3/finch-onboarding/bvn/validate`,
      body: {
        bvnDateOfBirth: bvnForm.bvnDateOfBirth,
        bvnNumber: bvnForm.bvnNumber,
      },
    });
  }

  putApplication(application, applicationId) {
    return this.apiRequester.put({
      endpoint: `v3/finch-onboarding/applications/${applicationId}`,
      body: application,
      args: {
        draft: true,
      },
    });
  }

  createPersonalDetailsAggregator(application) {
    return this.apiRequester.post({
      endpoint: "v3/finch-onboarding/applications",
      body: application,
      args: {
        draft: true,
      },
    });
  }

  async documentUpload(applicationId, documentType, file) {
    let fileType = file.type;
    if (fileType === null) {
      const fileNameSplitted = file.fileName.split(".");
      const fileExtension = fileNameSplitted[fileNameSplitted.length - 1];

      switch (fileExtension) {
        case "jpg":
          fileType = "image/jpeg";
          break;
        default:
          fileType = "image";
          break;
      }
    }

    const formData = new FormData();
    formData.append("file", {
      name: file.fileName,
      filename: file.fileName,
      uri: file.uri,
      type: fileType,
    });

    return this.apiRequester.post({
      endpoint: "v2/finch-onboarding/document",
      headers: {
        applicationId,
        documentType,
        "content-type": "multipart/x-www-form-data",
      },
      body: formData,
    });
  }

  async documentUploadAggregator(applicationId, docType, file) {
    const formData = new FormData();
    const kycDocType =
      docType === "Government Issued ID" ? "ID_CARD" : "PASSPORT_PHOTO";
    formData.append("kycDoc", file);

    return this.apiRequester.post({
      endpoint: `v3/finch-onboarding/applications/${applicationId}/documents`,
      headers: {
        kycDocType,
        "content-type": "multipart/x-www-form-data",
      },
      body: formData,
    });
  }

  getDocumentsByApplicationAggregator(applicationId) {
    return this.apiRequester.get({
      endpoint: `v3/finch-onboarding/applications/${applicationId}/documents`,
    });
  }

  deleteDocumentsByApplicationAggregator(id) {
    return this.apiRequester.delete({
      endpoint: `v3/finch-onboarding/documents/${id}`,
    });
  }

  getApplicationAggregator(applicationId) {
    return this.apiRequester.get({
      endpoint: `v3/finch-onboarding/applications/${applicationId}`,
    });
  }

  searchApplicationsAggregator(args) {
    return this.apiRequester.get({
      endpoint: `v3/finch-onboarding/applications/search?${args}`,
    });
  }

  submitAggregator(application) {
    return this.apiRequester.put({
      endpoint: `v3/finch-onboarding/applications/${application.applicationId}`,
      body: application,
      args: {
        draft: false,
      },
    });
  }

  validateFipBvnPhone(otp, payload) {
    return this.apiRequester.post({
      endpoint: `v3/finch-onboarding/otp/bvn/validate`,
      body: payload,
      args: {
        otp: otp,
      },
    });
  }

  resendFipBvnPhoneOtp(tokenId) {
    return this.apiRequester.post({
      endpoint: `v3/finch-onboarding/otp/${tokenId}`,
    });
  }

  fipKycValidation(validationType, requestBody) {
    return this.apiRequester.post({
      endpoint: `v2/finch-onboarding/kyc-records/validate`,
      body: requestBody,
      headers: {
        validationType: validationType,
        forceVerification: false,
      },
    });
  }

  initiateLivelinessCheck(kycId) {
    return this.apiRequester.post({
      endpoint: `v2/finch-onboarding/kyc-records/initiate/${kycId}`,
    });
  }

  getKycRecordStatus(payload) {
    return this.apiRequester.post({
      endpoint: `v2/finch-onboarding/kyc-records/status`,
      body: payload,
    });
  }

  checkFipApplicantType(applicationId) {
    return this.apiRequester.get({
      endpoint: `v4/finch-onboarding/applications/applicant-type/${applicationId}`,
    });
  }

  sendWalletPhonOtpRequest(payload) {
    return this.apiRequester.post({
      endpoint: `v3/finch-onboarding/otp/${payload.phoneNumber}/${
        payload.jobId
      }`,
    });
  }

  validateWalletPhonOtpRequest(otp, payload) {
    return this.apiRequester.post({
      endpoint: `v3/finch-onboarding/otp/wallet-mobile/validate`,
      body: payload,
      args: {
        otp: otp,
      },
    });
  }

  saveFipPersonalDetails(payload) {
    return this.apiRequester.post({
      endpoint: `v4/finch-onboarding/applications/personal-details`,
      body: payload,
    });
  }

  saveFipBusinessDetails(payload) {
    return this.apiRequester.post({
      endpoint: `v4/finch-onboarding/applications/business-details`,
      body: payload,
    });
  }

  saveFipNextOfKinDetails(applicationId, payload) {
    return this.apiRequester.put({
      endpoint: `v4/finch-onboarding/applications/next-of-kin/${applicationId}`,
      body: payload,
    });
  }
  saveFipResidentialDetails(applicationId, payload) {
    return this.apiRequester.put({
      endpoint: `v4/finch-onboarding/applications/residential/${applicationId}`,
      body: payload,
    });
  }

  submitFipApplication(applicationId) {
    return this.apiRequester.post({
      endpoint: `v4/finch-onboarding/applications/submit/${applicationId}`,
    });
  }

  async fipStateDocumentUpload(documentType, file) {
    let fileType = file.type;
    if (fileType === null) {
      const fileNameSplitted = file.fileName.split(".");
      const fileExtension = fileNameSplitted[fileNameSplitted.length - 1];

      switch (fileExtension) {
        case "jpg":
          fileType = "image/jpeg";
          break;
        default:
          fileType = "image";
          break;
      }
    }

    const formData = new FormData();
    formData.append("file", {
      name: file.fileName,
      filename: file.fileName,
      uri: file.uri,
      type: fileType,
    });

    return this.apiRequester.post({
      endpoint: "v4/finch-onboarding/letter",
      headers: {
        documentType,
        "content-type": "multipart/x-www-form-data",
      },
      body: formData,
    });
  }
}

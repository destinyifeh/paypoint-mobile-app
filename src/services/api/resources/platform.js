import Requester from "../finch-requester";

import { PLATFORM_API_BASE_URL } from "../../../constants/api-resources";

const API_BASE_URL = PLATFORM_API_BASE_URL;

export default class Platform {
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

  editUserRole(payload) {
    return this.apiRequester.put({
      endpoint: `v2/finch-platform-service/users/roles/edit`,
      body: payload,
    });
  }

  getAgentsUnderAggregator() {
    return this.apiRequester.get({
      endpoint: "v2/finch-platform-service/agents/search",
      cache: true,
      cacheDuration: 600,
    });
  }

  getAgentByPhoneNumber(phoneNumber) {
    return this.apiRequester.get({
      endpoint: `v2/finch-platform-service/agents/${phoneNumber}`,
    });
  }

  getCurrentAgent(headers) {
    return this.apiRequester.get({
      endpoint: "v2/finch-platform-service/agents/me",
      headers,
    });
  }

  getCurrentUser() {
    return this.apiRequester.get({
      endpoint: "v2/finch-platform-service/users/me",
    });
  }

  getWalletStatus() {
    return this.apiRequester.get({
      endpoint: "v2/finch-platform-service/wallet/status",
    });
  }

  retrieveSuperAgents() {
    return this.apiRequester.get({
      endpoint: "v2/finch-platform-service/super-agents/list",
      cache: true,
    });
  }

  retrieveAgent(businessPhone) {
    return this.apiRequester.post({
      endpoint: `v2/finch-platform-service/agents/${businessPhone}`,
    });
  }

  retrieveUserByEmail(email) {
    return this.apiRequester.get({
      endpoint: "v2/finch-platform-service/users/retrieve",
      args: {
        email,
      },
    });
  }
  retrieveRemapAgentDetails(agentMobileNo, token) {
    return this.apiRequester.get({
      endpoint: `v2/finch-platform-service/agents/search?agentMobileNo=${agentMobileNo}`,
      // args: {
      //   agentMobileNo
      // },
      // headers: {'Authorization': token}
    });
  }

  retrieveAgents() {
    return this.apiRequester.get({
      endpoint: "v2/finch-platform-service/agents/me",
      args: {
        domainTypeId: 4,
      },
    });
  }

  retrieveCountries(pageNumber, pageSize, searchTerm) {
    return this.apiRequester.get({
      endpoint: "v2/finch-platform-service/countries",
      args: {
        pageNum: pageNumber,
        pageSize: pageSize,
        searchText: searchTerm,
      },
    });
  }

  retrieveLgas(stateId) {
    return this.apiRequester.get({
      endpoint: `v2/finch-platform-service/lgas/state/${stateId}`,
    });
  }

  retrieveRegions() {
    return this.apiRequester.get({
      endpoint: "v2/finch-platform-service/regions",
    });
  }

  retrieveStates(countryId) {
    return this.apiRequester.get({
      endpoint: `v2/finch-platform-service/states/country/${countryId}`,
    });
  }

  retrieveWards() {
    return this.apiRequester.get({
      endpoint: "v2/finch-platform-service/wards",
    });
  }

  createRole(payload) {
    return this.apiRequester.post({
      endpoint: "v2/finch-platform-service/users/roles/create",
      body: payload,
    });
  }

  retrieveRoles() {
    return this.apiRequester.get({
      endpoint: "v2/finch-platform-service/users/roles",
    });
  }

  retrieveRolePermissions(roleName) {
    return this.apiRequester.get({
      endpoint: "v2/finch-platform-service/users/role/permissions",
      args: {
        roleName,
      },
    });
  }

  removeRolePermission(name, permissions) {
    return this.apiRequester.put({
      endpoint: "v2/finch-platform-service/users/roles/permission/delete",
      body: {
        name,
        permissions,
      },
    });
  }

  createUser(payload) {
    return this.apiRequester.post({
      endpoint: "v2/finch-platform-service/users",
      body: payload,
    });
  }

  retrieveUser() {
    return this.apiRequester.get({
      endpoint: "v2/finch-platform-service/user",
    });
  }

  retrieveUsers() {
    return this.apiRequester.get({
      endpoint: "v2/finch-platform-service/users",
    });
  }

  updateBvn(payload) {
    return this.apiRequester.put({
      endpoint: `v2/finch-platform-service/bvn-records/agent`,
      body: payload,
    });
  }

  verifyFailedBvn(payload, token) {
    return this.apiRequester.post({
      endpoint: `v3/finch-platform-service/bvn-records/validate/bvn`,
      body: payload,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }
  verifyBvn(payload) {
    return this.apiRequester.post({
      endpoint: `v3/finch-platform-service/bvn-records/validate/bvn`,
      body: payload,
    });
  }

  getBvn(agentCode) {
    return this.apiRequester.get({
      endpoint: `v2/finch-platform-service/bvn-records/agent/${agentCode}`,
    });
  }

  getAggregatorAgentsByPhone(phoneNo) {
    return this.apiRequester.get({
      endpoint: `v4/finch-platform-service/agents/search?agentMobileNo=${phoneNo}`,
    });
  }

  upgradeAgents(payload, agentCode) {
    return this.apiRequester.post({
      endpoint: `v5/finch-platform-service/agents/${agentCode}/upgrade-requests/documents`,
      body: payload,
    });
  }

  initializeUpgradeAgent(payload, agentCode) {
    return this.apiRequester.post({
      endpoint: `v5/finch-platform-service/agents/${agentCode}/upgrade-requests/initialize`,
      body: payload,
    });
  }

  getActiveAgentsDetails(agentCode) {
    return this.apiRequester.get({
      endpoint: `v5/finch-platform-service/agents/${agentCode}`,
    });
  }
  agentCount() {
    return this.apiRequester.get({
      endpoint: "v2/finch-platform-service/agents/search/count",
      args: {},
    });
  }

  documentUploadAggregatorClass(agentCode, kycDocType, file) {
    const formData = new FormData();

    formData.append("kycDoc", file);

    return this.apiRequester.post({
      endpoint: `v5/finch-platform-service/agents/${agentCode}/upgrade-requests/documents`,
      headers: {
        kycDocType,
        "content-type": "multipart/form-data",
      },
      body: formData,
    });
  }

  postAggregatorClassUpgrage(payload, agentCode) {
    return this.apiRequester.post({
      endpoint: `v5/finch-platform-service/agents/${agentCode}/upgrade-requests/initialize`,
      body: payload,
    });
  }
  submitAggregatorClassUpgrage(payload, agentCode) {
    return this.apiRequester.put({
      endpoint: `v5/finch-platform-service/agents/${agentCode}/upgrade-requests/complete`,
      body: payload,
    });
  }

  getBusinessType() {
    return this.apiRequester.get({
      endpoint: `v5/finch-platform-service/businesstypes`,
    });
  }

  agentAccountDowngrade(requestBody) {
    return this.apiRequester.put({
      endpoint: `v5/finch-platform-service/agents/downgrade-request`,
      body: requestBody,
    });
  }

  verifyNin(requestBody) {
    return this.apiRequester.post({
      endpoint: `v2/finch-platform-service/kyc-records/validate`,
      body: requestBody,
      headers: {
        validationType: "NIN",
        forceVerification: true,
      },
    });
  }

  verifyBvnInformation(requestBody) {
    return this.apiRequester.post({
      endpoint: `v2/finch-platform-service/kyc-records/validate`,
      body: requestBody,
      headers: {
        validationType: "BVN",
        forceVerification: false,
      },
    });
  }
  verifyKycRecords(type, requestBody) {
    return this.apiRequester.post({
      endpoint: `v2/finch-platform-service/kyc-records/validate`,
      body: requestBody,
      headers: {
        validationType: type,
        forceVerification: true,
      },
    });
  }

  getKycRecordStatus(params) {
    return this.apiRequester.get({
      endpoint: `v2/finch-platform-service/kyc-records/status?jobId=${params}`,
    });
  }

  initiateLivelinessCheck(bvn) {
    return this.apiRequester.post({
      endpoint: `v2/finch-platform-service/kyc-records/initiate`,
      headers: {
        bvn: bvn,
      },
    });
  }

  resendCbnComplianceOtp(tokenId) {
    return this.apiRequester.post({
      endpoint: `v2/finch-platform-service/otp/${tokenId}`,
    });
  }

  validateCbnOtp(otp, requestBody) {
    return this.apiRequester.post({
      endpoint: `v2/finch-platform-service/otp/validate?otp=${otp}`,
      body: requestBody,
    });
  }
  getRecordFromBvn() {
    return this.apiRequester.get({
      endpoint: `v2/finch-platform-service/bvn-records/get-record`,
    });
  }
}

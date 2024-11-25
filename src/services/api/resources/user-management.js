import { USER_MANAGEMENT_API_BASE_URL } from "../../../constants/api-resources";
import Requester from "../finch-requester";

const API_BASE_URL = USER_MANAGEMENT_API_BASE_URL;

/** UserManagement client */
export default class UserManagement {
  /**
   * Constructor
   * @param {object} props
   */
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

  /**
   * Checks if user exists on passport
   * @param {string} userNameOrMobile
   * @return {promise}
   */
  checkUserExistsOnPassport(userNameOrMobile) {
    return this.apiRequester.get({
      endpoint: "v1/finch/user-mgmt/auth/users/validate-passport-user",
      headers: {
        userNameOrMobile,
      },
      auth: false,
    });
  }

  createDomains(payload) {
    return this.apiRequester.post({
      endpoint: "v1/finch/user-mgmt/domains",
      body: payload,
    });
  }

  getDomainByCode(code) {
    return this.apiRequester.get({
      endpoint: "v1/finch/user-mgmt/domains/get",
      args: {
        code,
      },
    });
  }

  getDomains() {
    return this.apiRequester.get({
      endpoint: "v1/finch/user-mgmt/domains",
    });
  }

  getPermissions(pageNo, pageSize) {
    return this.apiRequester.get({
      endpoint: "v1/finch/user-mgmt/permissions",
      args: {
        pageNum: pageNo,
        pageSize,
      },
    });
  }

  updateDomains(domainId, payload) {
    return this.apiRequester.put({
      endpoint: `v1/finch/user-mgmt/domains/${domainId}`,
      body: payload,
    });
  }

  createPermission(payload) {
    return this.apiRequester.post({
      endpoint: "v1/finch/user-mgmt/permissions",
      body: payload,
    });
  }

  updatePermission(permissionId, payload) {
    return this.apiRequester.put({
      endpoint: `v1/finch/user-mgmt/permissions/${permissionId}`,
      body: payload,
    });
  }

  getRoles() {
    return this.apiRequester.get({
      endpoint: "v1/finch/user-mgmt/roles",
    });
  }

  createRole(payload) {
    return this.apiRequester.post({
      endpoint: "v1/finch/user-mgmt/roles",
      body: payload,
    });
  }

  updateRole(roleId, payload) {
    return this.apiRequester.put({
      endpoint: `v1/finch/user-mgmt/roles/${roleId}`,
      body: payload,
    });
  }

  getRole(roleId) {
    return this.apiRequester.get({
      endpoint: `v1/finch/user-mgmt/roles/${roleId}`,
    });
  }

  deleteRole(roleId) {
    return this.apiRequester.delete({
      endpoint: `v1/finch/user-mgmt/roles/${roleId}`,
    });
  }

  searchRole(args) {
    return this.apiRequester.get({
      endpoint: "v1/finch/user-mgmt/roles/search",
      args,
    });
  }

  assignRolePermissions(payload) {
    return this.apiRequester.get({
      endpoint: "v1/finch/user-mgmt/roles/permission",
      body: payload,
    });
  }

  getRolePermissions(roleId) {
    return this.apiRequester.get({
      endpoint: `v1/finch/user-mgmt/roles/${roleId}/permissions`,
    });
  }

  deleteRolePermissions(roleId, permissionIds) {
    return this.apiRequester.delete({
      endpoint: "v1/finch/user-mgmt/roles/permission",
      body: {
        roleId,
        permissionIds,
      },
    });
  }

  getHealthEndpoint() {
    return this.apiRequester.get({
      endpoint: "v1/finch/user-mgmt/health",
    });
  }

  getUserByUsername(username) {
    return this.apiRequester.get({
      endpoint: "v1/finch/user-mgmt/users",
      args: {
        username,
      },
    });
  }

  getUsers() {
    return this.apiRequester.get({
      endpoint: "v1/finch/user-mgmt/users/list",
    });
  }

  searchUsers(args) {
    return this.apiRequester.get({
      endpoint: "v1/finch/user-mgmt/users/search",
      args,
    });
  }

  createUser(payload) {
    return this.apiRequester.post({
      endpoint: "v1/finch/user-mgmt/users",
      payload,
    });
  }

  updateUser(userId, payload) {
    return this.apiRequester.post({
      endpoint: `v1/finch/user-mgmt/users/${userId}`,
      payload,
    });
  }

  getUserRoles(username) {
    return this.apiRequester.get({
      endpoint: `v1/finch/user-mgmt/users/${username}/roles`,
    });
  }

  addUserRoles(userId, roleIds) {
    return this.apiRequester.get({
      endpoint: `v1/finch/user-mgmt/users/role`,
      payload: {
        userId,
        roleIds,
      },
    });
  }

  deleteUserRole(userId, roleIds) {
    return this.apiRequester.delete({
      endpoint: `v1/finch/user-mgmt/users/role`,
      payload: {
        userId,
        roleIds,
      },
    });
  }

  deviceAuth(data, headers) {
    const { device, otp, tokenId, registerDevice } = data;

    return this.apiRequester.post({
      endpoint: "v1/finch/user-mgmt/auth/users/oauth/authenticate/otp",
      body: {
        authenticateOtpRequest: {
          otp,
          tokenId,
        },
        device,
        registerDevice: JSON.stringify(registerDevice),
      },
      headers,
      auth: false,
    });
  }

  getUser(username) {
    return this.apiRequester.get({
      endpoint: "v1/finch/user-mgmt/users/getUser",
      headers: {
        username,
      },
    });
  }

  loginOld(data, headers, args) {
    return this.apiRequester.post({
      endpoint: "v1/finch/user-mgmt/auth/users/oauth/authenticate",
      body: data,
      headers,
      args,
    });
  }

  login(data, headers, args) {
    return this.apiRequester.post({
      endpoint: "v2/finch/user-mgmt/auth/users/oauth/authenticate-user",
      body: data,
      headers,
      args,
      auth: false,
    });
  }

  logout(data, headers, args) {
    return this.apiRequester.delete({
      endpoint: "v1/finch/user-mgmt/auth/users/logout",
      body: data,
      headers,
      args,
      auth: false,
      //
    });
  }

  changePassword(
    oldPassword,
    password,
    confirmPassword,
    uuid,
    username,
    userRef,
    accessToken
  ) {
    let headers = null;
    if (accessToken) {
      headers = { Authorization: `Bearer ${accessToken}` };
    }

    return this.apiRequester.post({
      endpoint: `v1/finch/user-mgmt/auth/users/change-password`,
      headers,
      body: {
        oldPassword,
        password,
        confirmPassword,
        uuid,
        username,
        userRef,
      },
      auth: false,
    });
  }

  recoverPassword(username, destinationUri, resetWith) {
    return this.apiRequester.post({
      endpoint: `v2/finch/user-mgmt/auth/users/recover-password`,
      body: {
        username,
        destinationUri,
        resetWith,
      },
      auth: false,
    });
  }

  resetPassword(password, confirmPassword, otp, uuid, username, userRef) {
    return this.apiRequester.post({
      endpoint: `v2/finch/user-mgmt/auth/users/reset-password`,
      // headers: {
      //   Authorization: `Bearer ${accessToken}`
      // },
      body: {
        password,
        confirmPassword,
        otp,
        uuid,
        username,
        userRef,
      },
      auth: false,
    });
  }

  activateDevice(deviceId, otp, verifyOtp) {
    return this.apiRequester.post({
      endpoint: "v1/finch/user-mgmt/device/activate",
      headers: {
        deviceId: deviceId,
        otp,
        verifyOtp,
      },
      body: {
        deviceId,
        otp,
        verifyOtp,
      },
    });
  }

  deactivateDevice(deviceId, otp, verifyOtp) {
    return this.apiRequester.post({
      endpoint: "v1/finch/user-mgmt/device/deactivate",
      headers: {
        deviceId: deviceId,
        otp,
        verifyOtp,
      },
      body: {
        deviceId,
        otp,
        verifyOtp,
      },
    });
  }

  deleteDevice(deviceId, otp, verifyOtp) {
    return this.apiRequester.delete({
      endpoint: "v1/finch/user-mgmt/device/delete",
      headers: {
        deviceId: deviceId,
        otp,
        verifyOtp,
      },
      body: {
        deviceId,
        otp,
        verifyOtp,
      },
    });
  }

  getDeviceList(authToken) {
    return this.apiRequester.get({
      endpoint: "v1/finch/user-mgmt/device/deviceList",
      headers: {
        // accessToken: authToken,
      },
    });
  }

  regenerateToken(deviceUuid, tokenId) {
    return this.apiRequester.get({
      endpoint: "v1/finch/user-mgmt/auth/users/generateToken",
      headers: {
        deviceUuid,
        tokenId,
      },
      auth: false,
    });
  }

  getAuthenticatedUserDetails() {
    return this.apiRequester.get({
      endpoint: "v1/finch/user-mgmt/users/me",
    });
  }

  matchUserEmailAndMobile(email, mobile) {
    return this.apiRequester.get({
      endpoint: "v1/finch/user-mgmt/auth/users/match-user-email-and-mobile",
      headers: {
        email,
        mobile,
      },
      auth: false,
    });
  }

  refreshAuthToken(refreshToken, mobile) {
    return this.apiRequester.get({
      endpoint: "v1/finch/user-mgmt/auth/users/refreshUserToken",
      headers: {
        refreshToken,
        mobile,
        username: mobile,
      },
      auth: false,
    });
  }

  resendEmailConfirmation(email) {
    return this.apiRequester.post({
      endpoint: "v1/finch/user-mgmt/auth/users/resendEmail-confirmation",
      body: {
        email,
      },
    });
  }

  signupExistingUser(body, sendOtp, verifyOtp, headers, args) {
    return this.apiRequester.post({
      endpoint: "v1/finch/user-mgmt/auth/users/signUp-existing-user",
      headers: {
        sendOtp,
        verifyOtp,
        ...headers,
      },
      body,
      args,
      auth: false,
    });
  }

  signupNewUser(body, sendOtp, verifyOtp, headers, args) {
    return this.apiRequester.post({
      endpoint: "v1/finch/user-mgmt/auth/users/signUp-new-user",
      headers: {
        sendOtp,
        verifyOtp,
        ...headers,
      },
      body,
      args,
      auth: false,
    });
  }

  verifyOtp(body) {
    return this.apiRequester.post({
      endpoint: "v1/finch/user-mgmt/auth/users/verify-otp",
      body,
      auth: false,
    });
  }

  getUserProfiles(username) {
    return this.apiRequester.get({
      endpoint: `v2/finch/user-mgmt/auth/users`,
      headers: {
        username,
      },
      auth: false,
    });
  }

  getAggregatorAgentsByTerminalId(terminalId) {
    return this.apiRequester.get({
      endpoint: `v1/finch/user-mgmt/device/terminal_id`,
      headers: { Terminalid: terminalId },
    });
  }

  requestPOSRemapping(payload) {
    return this.apiRequester.post({
      endpoint: "v1/finch/user-mgmt/pos-remap-request",
      body: payload,
    });
  }

  searchPOSRemapRequests(args) {
    return this.apiRequester.get({
      endpoint: "v1/finch/user-mgmt/pos-remap-request/search",
      args,
    });
  }

  confirmPOSDelivery(terminalId) {
    return this.apiRequester.put({
      endpoint: `v1/finch/user-mgmt/pos-remap-request/${terminalId}`,
    });
  }
  confirmPOSDeliveryRequest(terminalId) {
    return this.apiRequester.put({
      endpoint: `v1/finch/user-mgmt/pos-request/delivery/by-request-stock-id?posRequestStockId=${terminalId}`,
    });
  }

  confirmAllPOSDeliveryRequest(terminalId) {
    return this.apiRequester.put({
      endpoint: `v1/finch/user-mgmt/pos-request/deliver/by-request-id?posRequestId=${terminalId}`,
    });
  }

  getAllPosRequests() {
    return this.apiRequester.get({
      endpoint: "v1/finch/user-mgmt/pos-request/search?pageSize=20&pageNum=1",
    });
  }
  getAllPosModels() {
    return this.apiRequester.get({
      endpoint: "v1/finch/user-mgmt/pos-stocks/pos-models",
    });
  }
  validatePosRequest(payload) {
    return this.apiRequester.post({
      endpoint: "v1/finch/user-mgmt/pos-request/validate",
      body: payload,
    });
  }
  submitPosRequest(payload) {
    return this.apiRequester.post({
      endpoint: "v1/finch/user-mgmt/pos-request",
      body: payload,
    });
  }

  getPosWorkflowDetails(posRequestId) {
    return this.apiRequester.get({
      endpoint: `v2/finch/user-mgmt/pos-request?posRequestId=${posRequestId}`,
    });
  }
  getPosRequestDetails(posRequestId) {
    return this.apiRequester.get({
      endpoint: `v2/finch/user-mgmt/pos-request?posRequestId=${posRequestId}`,
      //   posRequestId: posRequestId,
      // },
    });
  }
  getPosRequestAwaitingDelivery(posRequestId) {
    return this.apiRequester.get({
      endpoint: `v2/finch/user-mgmt/pos-request/awaiting_delivery?posRequestId=${posRequestId}`,
    });
  }

  getActivePosRequests() {
    return this.apiRequester.get({
      endpoint: `v1/finch/user-mgmt/pos-request/active`
    });
  }

  postConcurDelivery(RequestId, payload) {
    return this.apiRequester.post({
      // endpoint: `v2/finch/user-mgmt/pos-request/confirm-delivery?posRequestId=${"REM567384"}`,
      endpoint: `v2/finch/user-mgmt/pos-request/confirm-delivery?posRequestId=${RequestId}`,
      body: payload,
    });
  }

  validatePosTerminal(terminalId) {
    return this.apiRequester.post({
      endpoint: `v2/finch/user-mgmt/pos-request/validate-terminalId?terminalId=${terminalId}`,
    });
  }
}

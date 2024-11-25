import { MESSAGING_API_BASE_URL } from '../../../constants/api-resources';
import Requester from '../finch-requester';

const API_BASE_URL = MESSAGING_API_BASE_URL;

export default class Messaging {
  constructor(props) {
    this.apiRequester = props ? props.apiRequester || new Requester({
      apiBaseUrl: API_BASE_URL
    }) : new Requester({
      apiBaseUrl: API_BASE_URL
    });
  }

  subscribe(firebaseMessagingServiceRecipientToken, phoneNumber) {
    return this.apiRequester.postIgnore401({
      endpoint: `messaging/subscribe/${phoneNumber}`,
      body: {
        token: firebaseMessagingServiceRecipientToken,
      },
    });
  }

  unsubscribe(firebaseMessagingServiceRecipientToken, phoneNumber) {
    return this.apiRequester.delete({
      endpoint: `messaging/unsubscribe-token/${phoneNumber}`,
      args: {
        token: firebaseMessagingServiceRecipientToken,
      },
    });
  }

  retrieveTokens(phoneNumber) {
    return this.apiRequester.get({
      endpoint: `messaging/tokens/${phoneNumber}`
    });
  }

  retrieveNotifications() {
    return this.apiRequester.get({
      endpoint: 'notifications',
    });
  }

  markNotificationsAsRead(notificationIds) {
    return this.apiRequester.post({
      endpoint: 'notifications/markAsRead',
      data: {
        ids: notificationIds,
      },
    });
  }

  getNotificationByDateRange(startDate, endDate) {
    return this.apiRequester.get({
      endpoint: 'daterange',
      args: {
        dateFrom: startDate,
        dateTo: endDate
      },
      headers
    })
  }

  getNotificationByRecipientId(recipientId, platform, deviceId) {
    return this.apiRequester.get({
      endpoint: 'recipientid',
      args: {
        deviceId,
        platform,
        recipientId,
      },
      headers
    })
  }

  getUnreadNotificationCount(recipientId) {
    return this.apiRequester.get({
      endpoint: `unreadmessagescount/${recipientid}/`,
      args: {
        recipientId,
      },
      headers
    })
  }

}

import Requester from '../finch-requester';
import { IN_APP_NOTIFICATIONS_API_BASE_URL } from '../../../constants/api-resources';

const API_BASE_URL = IN_APP_NOTIFICATIONS_API_BASE_URL;

export default class InAppNotifications {
  
  constructor(props) {
    this.apiRequester = props ? props.apiRequester || new Requester({
      apiBaseUrl: API_BASE_URL
    }) : new Requester({
      apiBaseUrl: API_BASE_URL
    });
  }

  getNotificationById(recipientId) {
    return this.apiRequester.get({
      endpoint: `${recipientId}`,
      args: {
        deviceId,
        platform,
        recipientId,
      },
      headers
    })
  }

}
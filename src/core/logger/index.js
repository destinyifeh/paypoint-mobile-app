import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import moment from 'moment';

import { APP_VERSION, IS_ANALYTICS_ENABLED } from '../../constants/api-resources';


const isAnalyticsEnabled = IS_ANALYTICS_ENABLED;


export function logEvent(eventName, params={}) {
  console.log('LOGGING', eventName, params);
  isAnalyticsEnabled && analytics().logEvent(
    eventName, 
    {
      ...params,
      app_version: APP_VERSION,
      day: moment().format('Do'),
      hour: moment().format('h a'),
      week: moment().week(),
      weekDay: moment().format('dddd'),
      month: moment().format('MMMM'),
      year: moment().year()
    }
  );
}

export function setUserProperties(currentUser) {
  const trackedUserProperties = [
    'domainName', 'firstName', 'agentGender', 
    'lastName', 'roleName', 'agentAge', 
    'username'
  ];
  const userPropertiesToTrack = {}
  trackedUserProperties.map(
    key => {
      let value = currentUser[key];
      if (typeof value === "number") {
        value = JSON.stringify(value);
      }
      userPropertiesToTrack[key] = value || null;
    }
  );

  userPropertiesToTrack.app_version = APP_VERSION;

  console.log('SETTING USER PROPERTIES', userPropertiesToTrack);
  
  if (isAnalyticsEnabled) {
    analytics().setUserProperties(userPropertiesToTrack);
    crashlytics().setUserId(userPropertiesToTrack.username);
    crashlytics().setAttributes(userPropertiesToTrack);
  }
}

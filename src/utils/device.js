// import { PermissionsAndroid, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
  DEVICE_CHANNEL,
  MOCK_DEVICE_DETAILS,
} from '../constants/api-resources';
// import { APP_NAME } from '../constants';
// import { flashMessage } from './dialog';
// import { BLOCKER } from '../constants/dialog-priorities';

export async function getDeviceDetails() {
  let deviceName = 'My PC';
  let deviceUuid = 'a3273e44-6558-4483-8005-2274f3b15630';
  let deviceOs = 'Win32';
  const deviceModel = await DeviceInfo.getProduct();

  if (!MOCK_DEVICE_DETAILS) {
    deviceName = await DeviceInfo.getDeviceName();
    // deviceUuid = Platform.OS === 'android' ? await DeviceInfo.getMacAddress() : DeviceInfo.getUniqueId();
    deviceUuid = DeviceInfo.getUniqueId();
    deviceOs = DeviceInfo.getSystemName();
  }

  console.log(
      `DEVICE BRAND >>>>> ${DeviceInfo.getBrand()}, ${DeviceInfo.getDeviceId()}`,
  );

  return {
    deviceUuid,
    deviceName,
    deviceOs,
    deviceModel,
    'channel': DEVICE_CHANNEL,
  };
}

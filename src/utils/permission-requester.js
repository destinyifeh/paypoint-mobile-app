import { PermissionsAndroid, Platform } from 'react-native';

import { APP_NAME } from '../constants';


const READ_PHONE_STATE = 'android.permission.READ_PHONE_STATE';


export const hasReadPhoneStatePermissionBeenGranted = async () => {
  return PermissionsAndroid.check('android.Manifest.permission.READ_PRIVILEGED_PHONE_STATE');
};

export const oldRequestImeiPermission = async (onGrantPermissionCallback) => {
  if (Platform.OS !== 'android') {
    return
  }

  try {
    const granted = await PermissionsAndroid.request(
      READ_PHONE_STATE,
      {
        title: APP_NAME,
        message:
          `${APP_NAME} needs access to your device's IMEI number so we can register your device.`,
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can read the IMEI");
      onGrantPermissionCallback();
    } else {
      console.log("READ_PHONE_STATE permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
};


export const requestReadContacts = async () => {
  const result = await PermissionsAndroid.PERMISSIONS.READ_CONTACTS;
  console.log({result});
  onGrantPermissionCallback();
}


export const requestImeiPermission = async (onGrantPermissionCallback) => {
  const result = await PermissionsAndroid.request('android.Manifest.permission.READ_PRIVILEGED_PHONE_STATE');
  console.log({result});
  onGrantPermissionCallback();
}

export async function requestWriteExternalStoragePermission(
    title='We need your permission',
) {
  return await PermissionsAndroid.requestMultiple(
      [
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ],
      {
        title,
      },
  );
}

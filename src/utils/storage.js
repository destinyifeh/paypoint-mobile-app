import AsyncStorage from '@react-native-async-storage/async-storage';
import {USER} from '../constants';

export async function deleteData(key) {
  await AsyncStorage.removeItem(key);
}

export async function saveData(key, value) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function loadData(key) {
  const data = AsyncStorage.getItem(key);

  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }

  return null;
}

export async function newSaveData(key, value) {
  let username = null;
  let userSpecificData = {};

  try {
    const skipUserSpecificData = true;
    const userData = JSON.parse(
      (await loadData(USER, skipUserSpecificData)) || '{}',
    );
    username = userData.username;

    if (username) {
      const skipUserSpecificData = true;
      userSpecificData = JSON.parse(
        (await loadData(username, skipUserSpecificData)) || '{}',
      );
    }
  } catch {}

  if (username) {
    AsyncStorage.setItem(
      username,
      JSON.stringify({
        ...userSpecificData,
        [key]: JSON.stringify(value),
      }),
    );
  } else {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  }
}

export async function newLoadData(key, skipUserSpecificData = false) {
  let username = null;
  let userSpecificData = null;

  if (skipUserSpecificData === false) {
    try {
      const skipUserSpecificData = true;
      const userData = JSON.parse(
        (await loadData(USER, skipUserSpecificData)) || '{}',
      );
      username = userData.username;

      console.log('LOADING USER DATA', username);

      if (username) {
        const skipUserSpecificData = true;
        userSpecificData = JSON.parse(
          (await loadData(username, skipUserSpecificData)) || '{}',
        );
        console.log('LOADING USER SPECIFIC DATA', userSpecificData);
      }
    } catch {}
  }

  let data = AsyncStorage.getItem(key);
  if (
    userSpecificData &&
    Object.keys(userSpecificData).length &&
    !(await data)
  ) {
    dataFromUserSpecificData = userSpecificData[key];
    console.log(`READING "${key}" USER SPECIFIC DATA`, {
      data: await data,
      dataFromUserSpecificData,
    });

    if (dataFromUserSpecificData) {
      data = dataFromUserSpecificData;
    }
  }

  if (data) {
    return data;

    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }

  return null;
}

import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';

import { retrieveAuthToken } from './auth';


export function getDefaultFilePath(url) {
  return RNFS.DownloadDirectoryPath + `/${url.split('/').reverse()[0]}`;
}

export async function startFileDownload(
    url, destinationPath=null, overwriteExisting=false,
) {
  const destinationPath_ = destinationPath || getDefaultFilePath(url);

  if (await RNFS.exists(destinationPath_) && !overwriteExisting) {
    return [null, destinationPath_];
  }

  return [
    await RNFS.downloadFile({
      fromUrl: url, // 'https://www.quickteller.com/images/Downloaded/e3335668-6fff-43da-acef-39371ffad86b.png',
      toFile: destinationPath_,
    }),
    destinationPath_,
  ];
}

export async function startFinchFileDownload(url, mime, description) {
  console.log({url, mime, description});
  const { authToken } = await retrieveAuthToken();

  const downloadResp = await RNFetchBlob.config({
    addAndroidDownloads: {
      useDownloadManager: true,
      notification: true,
      mime,
      description,
    },
  }).fetch(
      'GET',
      url,
      {
        'Authorization': `Bearer ${authToken}`,
      },
  ).then((res) => {
    console.log('The file saved to ', res.path());
  });

  console.log({downloadResp});
}

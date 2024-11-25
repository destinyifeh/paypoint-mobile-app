import {NativeModules} from 'react-native';
import FileProvider from 'react-native-file-provider';
import RNFS from 'react-native-fs';

import SendIntentAndroid from 'react-native-send-intent';
import {
  APP_LOGO_ASSET_PATH,
  DEVICES_WITH_PRINTERS,
  PRINTER_DRIVER_PACKAGE_NAME,
} from '../constants/api-resources';
import {BLOCKER} from '../constants/dialog-priorities';
import {formatReceiptFieldsAsString} from '../serializers/resources/receipt';
import {flashMessage} from './dialog';

const {IntentHelper, TelpoPrinterHelper} = NativeModules;

export default class PrintManager {
  constructor({devicesWithPrinters = DEVICES_WITH_PRINTERS}) {
    this.devicesWithPrinters = devicesWithPrinters;
  }

  async checkIfDeviceHasInbuiltPrinter() {
    return false;

    // const { deviceModel } = await getDeviceDetails();
    // return this.devicesWithPrinters.includes(deviceModel);
  }

  async checkIfUserCanPrint() {
    return await SendIntentAndroid.isAppInstalled(PRINTER_DRIVER_PACKAGE_NAME);

    // return (
    //   await this.checkIfDeviceHasInbuiltPrinter() ||
    //   await SendIntentAndroid.isAppInstalled(PRINTER_DRIVER_PACKAGE_NAME)
    // );
  }

  async printReceipt(uri, billerLogo = null) {
    // const manager = await this.checkIfDeviceHasInbuiltPrinter() ?
    //   new InbuiltUsbThermalPrintManager() :
    //   new BluetoothPrintManager();

    const manager = new BluetoothPrintManager();

    return manager.printReceipt(uri, billerLogo);
  }
}

export class BluetoothPrintManager {
  async printReceipt(uri, billerLogo) {
    console.log({billerLogo});

    IntentHelper.sendIntent(
      'android.intent.action.SEND',
      await FileProvider.getUriForFile(
        ' com.finch_agent_mobile_app.provider',
        uri,
      ),
      PRINTER_DRIVER_PACKAGE_NAME,
      'image/jpg',
    );
  }
}

export class InbuiltUsbThermalPrintManager {
  errorCallback(error) {
    flashMessage('Printer Error', error, BLOCKER);
  }

  async printReceipt(fields, billerLogo) {
    let content;
    let fontSize;
    let grayLevel;
    let isBold;
    let numberOfLinesToWalk;

    const appLogoDestinationPath = RNFS.DocumentDirectoryPath + '/logo.png';

    console.log('FIELDS >>>>', {fields});

    console.log(`BILLER LOGO ${billerLogo}`);

    billerLogo
      ? TelpoPrinterHelper.printImage(billerLogo, 160, 160, this.errorCallback)
      : TelpoPrinterHelper.printImage(
          appLogoDestinationPath,
          136,
          384,
          this.errorCallback,
        );

    numberOfLinesToWalk = 5;
    TelpoPrinterHelper.walk(numberOfLinesToWalk, this.errorCallback);

    (await RNFS.exists(appLogoDestinationPath))
      ? null
      : await RNFS.copyFileAssets(APP_LOGO_ASSET_PATH, appLogoDestinationPath);

    // \nHere is your transaction receipt.\nSee payment details below.
    content = 'Here is your transaction receipt.\nSee payment details below.';
    fontSize = 18;
    grayLevel = 5;
    isBold = false;
    isCenter = false;
    TelpoPrinterHelper.printString(
      content,
      isBold,
      isCenter,
      fontSize,
      grayLevel,
      this.errorCallback,
    );

    content = '\nPayment Details';
    fontSize = 27;
    grayLevel = 7;
    isBold = true;
    isCenter = false;
    TelpoPrinterHelper.printString(
      content,
      isBold,
      isCenter,
      fontSize,
      grayLevel,
      this.errorCallback,
    );

    numberOfLinesToWalk = 2;
    TelpoPrinterHelper.walk(numberOfLinesToWalk, this.errorCallback);

    content = formatReceiptFieldsAsString(fields);
    fontSize = 20;
    grayLevel = 5;
    isBold = false;
    isCenter = false;
    TelpoPrinterHelper.printString(
      content,
      isBold,
      isCenter,
      fontSize,
      grayLevel,
      this.errorCallback,
    );

    numberOfLinesToWalk = 10;
    TelpoPrinterHelper.walk(numberOfLinesToWalk, this.errorCallback);

    numberOfLinesToWalk = 2;
    TelpoPrinterHelper.walk(numberOfLinesToWalk, this.errorCallback);

    billerLogo &&
      TelpoPrinterHelper.printImage(
        appLogoDestinationPath,
        136,
        384,
        this.errorCallback,
      );

    content = 'Thank you for using Quickteller Paypoint';
    fontSize = 24;
    grayLevel = 7;
    isBold = true;
    isCenter = true;
    TelpoPrinterHelper.printString(
      content,
      isBold,
      isCenter,
      fontSize,
      grayLevel,
      this.errorCallback,
    );

    numberOfLinesToWalk = 10;
    TelpoPrinterHelper.walk(numberOfLinesToWalk, this.errorCallback);
  }
}

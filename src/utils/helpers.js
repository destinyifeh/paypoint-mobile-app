import CryptoJS from 'crypto-js';

import Clipboard from '@react-native-clipboard/clipboard';

import {COPIED_TO_CLIPBOARD} from '../constants';
import {CASUAL} from '../constants/dialog-priorities';
import Banks from '../fixtures/banks.json';
import {flashMessage} from './dialog';

export function checkIfWordIncludesAnyOf(word, referenceList) {
  word = word.toLowerCase();
  referenceList = referenceList.map(element => element.toLowerCase());
  return referenceList.some(element => word.includes(element));
}

export function copyContentToClipboard(content) {
  Clipboard.setString(content);

  flashMessage(null, COPIED_TO_CLIPBOARD, CASUAL);
}

export function generateChecksum(rawValue) {
  const hashedValue = CryptoJS.MD5(rawValue).toString();
  console.log({rawValue, hashedValue});
  return hashedValue;
}

export function getBankNameForSanefBank(bank) {
  return {
    'First City Monument Bank': 'First City Monument Bank',
    'Zenith Bank Plc': 'Zenith Bank International',
    'First Bank of Nigeria': 'First Bank of Nigeria Plc',
    'Sterling Bank': 'Sterling Bank Plc',
    'United Bank for Africa': 'United Bank for Africa Plc',
    'JAIZ Bank': 'Jaiz Bank Plc',
    'Fidelity Bank': 'Fidelity Bank Plc',
    'Unity Bank': 'Unity Bank Plc',
    'Stanbic IBTC Bank': 'Stanbic IBTC Plc',
    'GTBank Plc': 'Guaranty Trust Bank Plc',
    'Access Bank': 'Access Bank Nigeria Plc',
    'Wema Bank': 'WEMA Bank Plc',
  }[bank];
}

export function generateMac(rawValue) {
  const hash = CryptoJS.SHA512(rawValue);
  return hash.toString(CryptoJS.enc.Hex);
}

export function getBankForBankCode(bankCode) {
  return Banks.find(({cbnCode}) => bankCode === cbnCode);
}

export function getVersionNumber(versionCode) {
  return versionCode ? parseInt(versionCode.split('.').join('')) : null;
}

export function safeUsername(username) {
  return isNaN(username) || username.startsWith('234')
    ? username
    : `234${username.slice(1)}`;
}

export function findBankForSanefBank(sanefBankName) {
  const bankName = getBankNameForSanefBank(sanefBankName);
  return Banks.find(({name}) => name === bankName);
}

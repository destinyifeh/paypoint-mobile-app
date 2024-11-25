import React from 'react';
import PropTypes from 'prop-types';

import { Image } from 'react-native';
import Banks from '../fixtures/banks.json';


const BASE_BANK_URL = 'https://quickteller.com/images/banks'


export default function BankIcon({bankCode, bankName, ...props}) {
  let bankCode_ = bankCode;
  if (!bankCode_) {
    const foundBank = Banks.find(({ name }) => name === bankName);
    bankCode_ = foundBank?.cbnCode
  };

  return (
    <Image
      {...props}
      source={{uri: `${BASE_BANK_URL}/${bankCode_}.png`}}
      style={{
        height: 40,
        width: 40,
        ...props.style
      }}
    />
  );
}

BankIcon.propTypes = {
  bankCode: PropTypes.string,
  bankName: PropTypes.string,
  style: PropTypes.object,
}

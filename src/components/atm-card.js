import React from 'react';
import { Image, View } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { FONT_FAMILY_CREDIT_CARD } from '../constants/styles';

import Text from './text';


const MASTERCARD = 'MasterCard';
const VISA = 'Visa';
const VERVE = 'Verve';

const CARD_LOGO_URLS = {
  [MASTERCARD]: "https://img.icons8.com/color/48/000000/mastercard-logo.png",
  [VISA]: "https://img.icons8.com/color/48/000000/visa.png",
  [VERVE]: '',
};


function detectCardIssuer(pan) {
  const cleanedPan = pan.split(' ').join('');
  if (cleanedPan.match(/^4[0-9]{6,}$/)) {
    return VISA;
  }
  if (cleanedPan.match(/^5[1-5][0-9]{5,}|222[1-9][0-9]{3,}|22[3-9][0-9]{4,}|2[3-6][0-9]{5,}|27[01][0-9]{4,}|2720[0-9]{3,}$/)) {
    return MASTERCARD;
  }

  return VERVE;
}

function formatCardPan(pan) {
  const cleanedPan = pan.split(' ').join('').split('');
  return cleanedPan.map((value, index) => {
    if ((index + 1) % 4 === 0 && index > 0) {
      return `${value} `;
    }

    return value;
  }).join('');
}


export default function AtmCard({colors, cardNumber, name, pan, exp, style}) {
  const cardLogoUrl = pan ? CARD_LOGO_URLS[detectCardIssuer(pan)] : null;

  return (
    <LinearGradient colors={colors} style={{
      alignItems: 'center',
      borderRadius: 6,
      elevation: 12,
      flexDirection: 'column',
      height: 211.5384,
      justifyContent: 'flex-end',
      alignSelf: 'center',
      width: 330,
      padding: 16,
      ...style
    }}>
      <Image
        source={{uri: cardLogoUrl}}
        style={{
          height: 40,
          width: 40,
          position: 'absolute',
          resizeMode: 'contain',
          top: 16,
          right: 16,
        }}
      />

      <Text center bold white style={{fontFamily: FONT_FAMILY_CREDIT_CARD, fontSize: 18, letterSpacing: 1.3, marginBottom: 12, opacity: 0.2}}>{'XXXX XXXX XXXX XXXX'}</Text>

      <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
        <Text bold left small style={{fontSize: 8, letterSpacing: 1.3, lineHeight: 10, opacity: 0.5}} white>NUMBER</Text>
        <Text bold right small style={{fontSize: 8, letterSpacing: 1.3, lineHeight: 10, opacity: 0.5}} white>EXP</Text>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
        <Text left small white style={{fontFamily: FONT_FAMILY_CREDIT_CARD, fontSize: 8, letterSpacing: 1.3}}>{cardNumber ? cardNumber.toUpperCase() : null}</Text>
        <Text right small white style={{letterSpacing: 1.3}}>{exp}</Text>
      </View>

      <View style={{backgroundColor: '#FFD5AA', borderRadius: 4, width: 42, height: 34.0513, position: 'absolute', left: 16, top: '35%'}} />
      
    </LinearGradient>
  );
}

AtmCard.defaultProps = {
  colors: ['#304864', '#001824'],
  exp: '--',
  name: '--',
  pan: '',
};

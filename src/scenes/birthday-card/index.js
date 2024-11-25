import React from 'react';
import { Image, View } from 'react-native';

import Text from '../../components/text';


export default function BirthdayCard() {
  const firstName = 'Agent';

  return (
    <View
      style={{
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        paddingBottom: 0
      }}
    >
      <Image 
        resizeMode="contain"
        source={{uri: 'https://mufasa.interswitchng.com/p/finch-agent-mobile-app/assets/images/undraw_Birthday_cake_2wxy.png'}}
        style={{
          height: 400,
          position: 'absolute',
          top: -8,
          left: '6%',
          width: 400
        }}
      />
      <Image 
        resizeMode="cover"
        source={{uri: 'https://mufasa.interswitchng.com/p/finch-agent-mobile-app/assets/images/undraw_happy_birthday_s72n.png'}}
        style={{
          height: 130,
          position: 'absolute',
          bottom: 140,
          right: -12,
          width: 130,
          zIndex: 2
        }}
      />
      <Image 
        resizeMode="contain"
        source={{uri: 'https://mufasa.interswitchng.com/p/finch-agent-mobile-app/assets/images/undraw_Gift_box_re_vau4.png'}}
        style={{
          height: 240,
          position: 'absolute',
          bottom: -40,
          right: -20,
          width: 240,
          zIndex: 1
        }}
      />
      <Text biggest bold center style={{fontFamily: 'Precious', lineHeight: 65}}>Happy Birthday, {firstName}!</Text>
      <Text big style={{marginTop: 8}}>From all of us in the Quickteller Paypoint family, we are sending you smiles for every moment of your special day. Have a wonderful time and a very happy birthday!</Text>
    </View>
  );
}

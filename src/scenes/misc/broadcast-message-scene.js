import React, {useEffect} from 'react';
import {Image, StatusBar, View} from 'react-native';

import PropTypes from 'prop-types';
import Svg, {Path} from 'react-native-svg';

import Button from '../../components/button';
import Text from '../../components/text';
import {BROADCAST_MESSAGE_READ} from '../../constants/analytics';
import {
  COLOUR_BLUE,
  COLOUR_PRIMARY,
  COLOUR_WHITE,
} from '../../constants/styles';
import {logEvent} from '../../core/logger';
import {loadData, saveData} from '../../utils/storage';

const READ_BROADCAST_MESSAGES = 'READ_BROADCAST_MESSAGES';

export async function addBroadcastMessageToRead(message) {
  const readMessages = JSON.parse(
    (await loadData(READ_BROADCAST_MESSAGES)) || '[]',
  );

  await saveData(READ_BROADCAST_MESSAGES, [...readMessages, message]);
}

export async function isMessageLastReadMessage(message) {
  const readMessages = JSON.parse(
    (await loadData(READ_BROADCAST_MESSAGES)) || '[]',
  );

  const lastMessageRead = readMessages[readMessages.length - 1];

  return lastMessageRead === message;
}

export default function BroadcastMessageScene({
  navigation,
  onContinueButtonClick,
  withBackButton,
  route,
  ...props
}) {
  const message = route?.params?.message || null;
  const subMessage = route?.params?.subMessage || null;

  useEffect(() => {
    logEvent(BROADCAST_MESSAGE_READ);
  }, []);

  return (
    <View style={{backgroundColor: COLOUR_WHITE, flex: 1}}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />

      <View style={{flex: 1, marginTop: 54, justifyContent: 'space-between'}}>
        <View style={{paddingHorizontal: 16, marginTop: 48}}>
          <Text bigger blue center semiBold>
            {message}
          </Text>
          <Text center style={{marginHorizontal: 16, marginTop: 8}}>
            {subMessage}
          </Text>
        </View>

        <Image
          source={{
            uri: 'https://mufasa.interswitchng.com/p/finch-agent-mobile-app/assets/images/broadcast_message_background.png',
          }}
          style={{
            height: 320,
            marginBottom: -34,
            // marginTop: 24,
            // position: 'absolute'
          }}
        />

        {
          <Button
            buttonStyle={{
              backgroundColor: COLOUR_PRIMARY,
              borderRadius: 25,
              padding: 12,
            }}
            containerStyle={{
              bottom: 8,
              left: 0,
              margin: 16,
              paddingHorizontal: 16,
              position: 'absolute',
              // width: '100%',
            }}
            onPress={() => navigation.goBack()}
            title="CONTINUE"
          />
        }
      </View>

      <Svg
        style={{position: 'absolute', top: 0, left: 0}}
        width="145"
        height="89"
        viewBox="0 0 145 89"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <Path
          opacity="0.15"
          d="M36 56C77.9736 56 112 21.9736 112 -20C112 -61.9736 77.9736 -96 36 -96C-5.97364 -96 -40 -61.9736 -40 -20C-40 21.9736 -5.97364 56 36 56Z"
          stroke={COLOUR_BLUE}
          strokeWidth="65"
        />
      </Svg>
      <Svg
        style={{position: 'absolute', top: '40%', left: 0}}
        width="48"
        height="59"
        viewBox="0 0 48 59"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <Path
          opacity="0.15"
          d="M18.5 48C28.7173 48 37 39.7173 37 29.5C37 19.2827 28.7173 11 18.5 11C8.28273 11 0 19.2827 0 29.5C0 39.7173 8.28273 48 18.5 48Z"
          stroke={COLOUR_BLUE}
          strokeWidth="22"
        />
      </Svg>
    </View>
  );
}

BroadcastMessageScene.propTypes = {
  message: PropTypes.string.isRequired,
};

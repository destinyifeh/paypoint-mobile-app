import React, { useRef } from 'react';
import { View, StatusBar, Image } from 'react-native';

import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';

import ContactUsOptionsMenu from '../../fragments/contact-us-options-menu';
import Hyperlink from '../../components/hyperlink';
import Text from '../../components/text';
import { COLOUR_BLUE, COLOUR_WHITE, COLOUR_PRIMARY } from '../../constants/styles';
import ClickableListItem from '../../components/clickable-list-item';
import Button from '../../components/button';


export default function DisabledScene({includeLogoutButton, includeStatusBar, sceneName, navigation, withBackButton, ...props}) {
  const text = sceneName 
    ? `${sceneName} are currently unavailable on our mobile channel.`
    : "Our mobile channel is currently unavailable.";

  const contactUsMenu = useRef();
  
  return (
    <View style={{backgroundColor: COLOUR_WHITE, flex: 1}}>
      {(!Boolean(sceneName) || Boolean(includeStatusBar)) && <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />}

      <View style={{flex: 1, marginTop: 54, justifyContent: 'space-between'}}>
        <View style={{paddingHorizontal: 16}}>
          <Text bigger blue center thin>{text}</Text>
          <Text center style={{marginHorizontal: 16, marginTop: 8}}>Please, be patient! {sceneName ? "They'll" : "It'll"} be back soon.</Text>
        </View>

        <Image 
          source={{
            uri: 'https://mufasa.interswitchng.com/p/finch-agent-mobile-app/assets/images/undraw_empty_street_sfxm (2).png'
          }} 
          style={{
            height: 240,
            marginBottom: -32,
            // marginTop: 24,
            // position: 'absolute'
          }}
        />

        {withBackButton && <Button  
          buttonStyle={{
            backgroundColor: COLOUR_PRIMARY, 
            borderRadius: 25, 
            padding: 12
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
          title="GO BACK"
        />}

        {/* <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, width: '100%'}}>
          <ClickableListItem
            onPress={() => {
              contactUsMenu.current.open();
            }}
          >
            <Text lightBlue>Contact Support</Text>
          </ClickableListItem>
        </View> */}
      </View>

      <Svg style={{position: 'absolute', top: 0, left: 0}} width="145" height="89" viewBox="0 0 145 89" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Path 
          opacity="0.15" 
          d="M36 56C77.9736 56 112 21.9736 112 -20C112 -61.9736 77.9736 -96 36 -96C-5.97364 -96 -40 -61.9736 -40 -20C-40 21.9736 -5.97364 56 36 56Z" 
          stroke={COLOUR_BLUE} 
          strokeWidth="65" 
        />
      </Svg>
      <Svg style={{position: 'absolute', top: '40%', left: 0}} width="48" height="59" viewBox="0 0 48 59" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Path
          opacity="0.15"
          d="M18.5 48C28.7173 48 37 39.7173 37 29.5C37 19.2827 28.7173 11 18.5 11C8.28273 11 0 19.2827 0 29.5C0 39.7173 8.28273 48 18.5 48Z" 
          stroke={COLOUR_BLUE} 
          strokeWidth="22"
        />
      </Svg>
      <ContactUsOptionsMenu 
        ref_={contactUsMenu}
        requestClose={() => contactUsMenu.current.close()}
      />
    </View>
  );
}

DisabledScene.propTypes = {
  includeLogoutButton: PropTypes.bool,
  includeStatusBar: PropTypes.bool,
  sceneName: PropTypes.string.isRequired,
  withBackButton: PropTypes.bool,
}

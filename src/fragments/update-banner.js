import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux';
import { Animated, Easing, Linking, View } from 'react-native';

import Button from '../components/button';
import Text from '../components/text';
import { COLOUR_BLACK, COLOUR_GREEN } from '../constants/styles';
import { APP_VERSION, ENVIRONMENT_IS_PRODUCTION } from '../constants/api-resources';
import { shouldForceAppUpdate } from '../scenes/misc/important-update-available';


function UpdateBanner({remoteConfig}) {

  const opacity = new Animated.Value(1);
  const translateY = new Animated.Value(0);
  const isUpdateAvailable = remoteConfig.latest_app_version && remoteConfig.latest_app_version !== APP_VERSION;
  const toShowBanner = (
    isUpdateAvailable 
    && !shouldForceAppUpdate({...remoteConfig})
    && remoteConfig.show_app_update_banner 
    && ENVIRONMENT_IS_PRODUCTION
  );
 
  useEffect(() => {
    Animated.timing(
      translateY,
      {
        toValue: -170,
        duration: 200,
        easing: Easing.exp,
        useNativeDriver: true,
      }
    ).start();
  });

  if (!toShowBanner) {
    return <React.Fragment />
  } else {
    setTimeout(() => {
      Animated.timing(
        opacity,
        {
          toValue: 0,
          duration: 200,
          easing: Easing.exp,
          useNativeDriver: true,
        }
      ).start();
      
      Animated.timing(
        translateY,
        {
          toValue: 0,
          duration: 200,
          easing: Easing.exp,
          useNativeDriver: true,
        }
      ).start()
    }, 6500);
  }

  return (
    <Animated.View
      style={{
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: COLOUR_BLACK, 
        borderRadius: 4, 
        // bottom: 60,
        bottom: -80,
        elevation: 4,
        flexDirection: 'row',
        height: 72, 
        justifyContent: 'space-between',
        maxWidth: 420, 
        opacity,
        paddingHorizontal: 16, 
        position: 'absolute', 
        transform: [{
          translateY
        }],
        width: '92%'
      }}
    >
      <Text bold title white>An update is available</Text>
      <Button  
        buttonStyle={{
          paddingRight: 0,
        }}
        containerStyle={{
          paddingRight: 0,
        }}
        onPress={() => Linking.openURL(remoteConfig.latest_app_url)}
        title="DOWNLOAD"
        titleStyle={{
          color: COLOUR_GREEN
        }}
        transparent
      />
    </Animated.View>
  );
}

function mapStateToProps(state) {
  return {
    remoteConfig: state.tunnel.remoteConfig,
  }
}

export default connect(mapStateToProps, null)(UpdateBanner);

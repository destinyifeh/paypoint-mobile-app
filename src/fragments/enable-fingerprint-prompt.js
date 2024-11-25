import React from 'react';
import { View } from 'react-native';

import RBSheet from 'react-native-raw-bottom-sheet';

import Text from '../components/text';
import Button from '../components/button';
import { COLOUR_GREY, COLOUR_PRIMARY } from '../constants/styles';
import Settings from '../utils/settings';


export default class EnableFingerprintPrompt extends React.Component {
  render() {
    const { ref_, requestClose } = this.props;

    const settings = new Settings();

    const doDisableFingerprintLogin = () => {
      settings.biometricLogin = false;
      settings.blacklistCurrentUserFromBiometricLogin();
      requestClose();
    }

    const doEnableFingerprintLogin = () => {
      settings.biometricLogin = true;
      requestClose();
    }

    return (
      <RBSheet
        animationType="fade"
        closeOnDragDown={true}
        duration={250}
        height={295}
        onOpen={this.onOpen}
        onClose={this.onCancelConfirmation}
        ref={ref_}
      >
        <View
          style={{
            flex: 1,
            padding: 20,
            justifyContent: 'space-between'
          }}
        >
          <Text big black>
            Would you like to use the fingerprint registered on this device to login subsequently?
          </Text>

          <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'}}>
            <Button 
              buttonStyle={{ paddingHorizontal: 40 }} 
              containerStyle={{width: '50%'}}
              onPress={doEnableFingerprintLogin}
              title="YES" 
            />
            <Button 
              buttonStyle={{ paddingHorizontal: 40 }} 
              containerStyle={{width: '45%'}}
              onPress={doDisableFingerprintLogin}
              title="NO"
              titleStyle={{ color: COLOUR_PRIMARY }}
              transparent
            />
            <Text right small style={{marginTop: 8}}>We strongly advice you only enable this if you're currently using your personal device.</Text>
          </View>
        </View>
      </RBSheet>
    );
  }
}

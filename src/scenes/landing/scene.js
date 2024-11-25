import React from 'react';
import {
  Dimensions,
  Image,
  StatusBar,
  View
} from 'react-native';

import Svg, { Path } from 'react-native-svg';

import Button from '../../components/button';
import Text from '../../components/text';
import {
  COLOUR_BLUE,
  COLOUR_PRIMARY,
  COLOUR_SECONDARY,
  CONTENT_DARK
} from '../../constants/styles';
import BaseScene from '../base-scene';

const windowWidth = Dimensions.get('window').width;


export default class LandingScene extends BaseScene {
  screen_name = 'Landing';
  
  constructor(props) {
    super(props)

    this.onBecomeAnAgentButtonPressOut = this.onBecomeAnAgentButtonPressOut.bind(this)
    this.onLoginButtonPressOut = this.onLoginButtonPressOut.bind(this)
  }

  onBecomeAnAgentButtonPressOut () {
    this.props.navigation.navigate('Signup')
  }

  onLoginButtonPressOut () {
    this.props.navigation.replace('Login', {
      isAssistedPasswordPage: false
    })
  }

  render () {
    const isDeviceScreenLarge = windowWidth > 400;
    
    return <View style={{alignContent: 'space-around', flex: 1, flexDirection: 'column'}}>
      <StatusBar backgroundColor={'transparent'} barStyle={CONTENT_DARK} translucent={true} />

      <View style={{justifyContent: 'center', flex: .67, flexDirection: 'column', margin: 30, marginTop: 30}}>
        <View style={{alignItems: 'center', flex: .3}}>
          <Image source={require('../../assets/media/icons/paypoint.png')} style={{
            height: '100%',
            width: 380, 
            resizeMode: 'center'
          }} />
        </View>

        <View style={{justifyContent: 'center', flex: .7, marginTop: 0}}>
          <Text bold blue style={{fontSize: isDeviceScreenLarge ? 33 : 30, lineHeight: isDeviceScreenLarge ? 38 : 35}}>
            Welcome to {'\n'}Quickteller Paypoint
          </Text>
          <Text thin justify blue style={{lineHeight: 22, marginTop: 8, opacity: .8}} title>
            Offer services like Bill Payment, Funds Transfer, Cash Deposits, Cash Withdrawals, Insurance and Airtime Recharge to customers.
          </Text>
        </View>
      </View>

      <View style={{flex: .33, flexDirection: 'row', flexWrap: 'wrap', alignContent: 'flex-end', justifyContent: 'space-between', padding: 30}}>
        <Button containerStyle={{marginBottom: 16, width: '100%'}} buttonStyle={{backgroundColor: COLOUR_SECONDARY, borderRadius: 25, padding: 12}} onPressOut={this.onLoginButtonPressOut} title="LOGIN" />
        <Button containerStyle={{width: '100%'}} buttonStyle={{backgroundColor: COLOUR_PRIMARY, borderRadius: 25, padding: 12}} onPressOut={this.onBecomeAnAgentButtonPressOut} title="BECOME AN AGENT" />
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

    </View>
  }
}

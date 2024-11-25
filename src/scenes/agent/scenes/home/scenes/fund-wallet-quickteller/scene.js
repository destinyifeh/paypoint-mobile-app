import React from 'react';
import {
  StatusBar, 
  View 
} from 'react-native';
import {
  COLOUR_WHITE, CONTENT_DARK, CONTENT_LIGHT, COLOUR_RED, COLOUR_BLUE
} from '../../../../../../constants/styles';
import Header from '../../../../../../components/header';
import WebView from 'react-native-webview';
import ActivityIndicator from '../../../../../../components/activity-indicator';
import { Icon } from 'react-native-elements';

export default class FundWalletQuicktellerScene extends React.Component {
  state = {

  }

  render() {
    return <View style={{
      flex: 1
    }}>
      <Header 
        containerStyle={{
          backgroundColor: COLOUR_BLUE
        }}
        navigationIconColor={COLOUR_WHITE}
        leftComponent={<Icon
          color={COLOUR_RED}
          name="chevron-left"
          onPress={() => this.props.navigation.goBack()}
          size={40}
          type="material"
          underlayColor="transparent"
        />}
        statusBarProps={{
          backgroundColor: 'transparent',
          barStyle: CONTENT_LIGHT
        }}
        title="Fund Wallet"
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: 'bold'
        }} />
      <WebView
        renderLoading={() => <View style={{height: '100%'}}>
          <ActivityIndicator />
        </View>}
        source={{uri: this.props.fundWalletUrl}}
        startInLoadingState={true}
      />
    </View> 
  }
}

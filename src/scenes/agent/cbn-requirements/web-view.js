import React, {useEffect, useState} from 'react';
import {BackHandler, SafeAreaView, StyleSheet, View} from 'react-native';
import {WebView} from 'react-native-webview';
import ActivityIndicator from '../../../components/activity-indicator';
import {WEBVIEW_FACIAL_VERIFICATION_BASE_URL} from '../../../constants/api-resources';
import Platform from '../../../services/api/resources/platform';
import {retrieveAuthToken} from '../../../utils/auth';

const FaceVerificatiobWebViewScreen = props => {
  const [token, setToken] = useState('');
  const [kycStatus, setKycStatus] = useState('');
  const hardcodedId = 'REF20240616317181096998875';
  const bvn = props.route?.params?.bvn || null;
  const jobId = props.route?.params?.jobId || null;

  platform = new Platform();
  const jobId2 = '098263';

  const getToken = async () => {
    const {authToken} = await retrieveAuthToken();
    setToken(authToken);
    console.log('AUTHTOKEN', token);
  };

  useEffect(() => {
    getToken();
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonPress,
    );
    return () => backHandler.remove();
  }, [jobId]);

  const handleBackButtonPress = () => {
    props.navigation.navigate('AgentBvnVerification', {webView: jobId});
    return true;
  };

  const uri = `${WEBVIEW_FACIAL_VERIFICATION_BASE_URL}?bvn=${bvn}&jobId=${jobId}&token=${token}`;

  return (
    <SafeAreaView style={{flex: 1}}>
      <WebView
        originWhitelist={['*']}
        source={{uri}}
        startInLoadingState={true}
        sharedCookiesEnabled={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        useWebKit={true}
        mixedContentMode="always"
        allowFileAccess
        allowFileAccessFromFileURLs
        allowUniversalAccessFromFileURLs
        injectedJavaScriptBeforeContentLoaded={`
        (function() {
          console.log("Injected JavaScript running--Dez on it");
        })();
      `}
        onError={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          console.error('WebView error: ', nativeEvent);
        }}
        onLoad={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          console.log('WebView loaded--Dez: ', nativeEvent);
        }}
        onLoadEnd={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          console.log('WebView load ended: ', nativeEvent);
        }}
        onMessage={event => {
          try {
            console.log('WEBVIEW MESSAGE', event.nativeEvent.data);
            const messageData = JSON.parse(event.nativeEvent.data);
            console.log('WEBVIEW MESSAGE2', messageData.key);
            if (messageData.key === 'value') {
              props.navigation.navigate('AgentNinVerification', {
                jobId: jobId,
                bvn: bvn,
              });
            } else if (messageData.key === 'Back') {
              props.navigation.navigate('AgentBvnVerification');
            }
          } catch (error) {
            console.error('Error processing message from WebView:', error);
          }
        }}
        renderLoading={() => (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'white',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 30,
            }}>
            <ActivityIndicator />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default FaceVerificatiobWebViewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

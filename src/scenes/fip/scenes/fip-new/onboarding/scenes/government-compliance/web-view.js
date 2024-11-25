import React, {useEffect, useState} from 'react';
import {BackHandler, SafeAreaView, StyleSheet, View} from 'react-native';
import {WebView} from 'react-native-webview';
import {connect} from 'react-redux';
import ActivityIndicator from '../../../../../../../components/activity-indicator';
import {FIP_WEBVIEW_FACIAL_VERIFICATION_BASE_URL} from '../../../../../../../constants/api-resources';
import {retrieveAuthToken} from '../../../../../../../utils/auth';

const FipAgentFaceVerificatiobWebViewScreen = props => {
  const [token, setToken] = useState('');
  const [kycStatus, setKycStatus] = useState('');

  const {bvn, kycId, jobId} = props.route.params?.data || {};

  console.log(bvn, 'bvnn');
  console.log(kycId, 'kycIUd');
  console.log(jobId, 'jobId');

  const getToken = async () => {
    const {authToken} = await retrieveAuthToken();
    setToken(authToken);
  };

  useEffect(() => {
    getToken();
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonPress,
    );
    return () => backHandler.remove();
  }, [jobId]);

  React.useEffect(() => {
    checkIncomingRoute();
  }, []);

  const checkIncomingRoute = () => {
    if (props.navigationState.previousScreen === 'Login') {
      props.navigation.replace('HomeTabs');
      return;
    }
  };

  const handleBackButtonPress = () => {
    return true;
  };

  const uri = `${FIP_WEBVIEW_FACIAL_VERIFICATION_BASE_URL}?bvn=${bvn}&jobId=${jobId}&token=${token}&kycId=${kycId}`;

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
              const data = {
                jobId: jobId,
                bvn: bvn,
                kycId: kycId,
              };
              props.navigation.replace(
                'FipAgentFacialVerificationConfirmation',
                {
                  data: data,
                },
              );
            } else if (messageData.key === 'Back') {
              props.navigation.goBack();
            }
          } catch (error) {
            console.error('Error processing message from WebView', error);
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

function mapStateToProps(state) {
  return {
    navigationState: state.tunnel.navigationState,
  };
}

export default connect(mapStateToProps)(FipAgentFaceVerificatiobWebViewScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

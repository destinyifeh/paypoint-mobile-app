/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {DeviceEventEmitter, View} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
// import Crashlytics from '@react-native-firebase/crashlytics';
import QuickActions from 'react-native-quick-actions';
import {Provider} from 'react-redux';

import ErrorBoundary from './src/components/error-boundary';
import {BUY_AIRTIME, PAY_A_BILL_NORMALIZED} from './src/constants';
import {
  SET_QUICK_ACTION,
  SET_SCREEN_AFTER_LOGIN,
} from './src/constants/action-types/tunnel';
import {QUICK_ACTION_ITEMS_DELIMITER} from './src/constants/api-resources';
import UpdateBanner from './src/fragments/update-banner';
import MainStackNavigator from './src/routes';
import {
  addBroadcastMessageToRead,
  isMessageLastReadMessage,
} from './src/scenes/misc/broadcast-message-scene';
import DisabledScene from './src/scenes/misc/disabled-scene';
import ImportantUpdateAvailable, {
  shouldForceAppUpdate,
} from './src/scenes/misc/important-update-available';
import {shouldShowReleaseNotes} from './src/scenes/release-notes';
import store from './src/services/redux/store';
import './src/setup';
import {
  isAuthTokenExpired,
  onNewSessionBegin,
  onSessionEnd,
} from './src/utils/auth';
import NavigationService from './src/utils/navigation-service';
import {Stopwatch} from './src/utils/time';

export * from './src/setup/api';
export * from './src/setup/session-timers';

import NativeDevSettings from 'react-native/Libraries/NativeModules/specs/NativeDevSettings';

export const stopwatch = new Stopwatch();

class App extends React.Component {
  state = {
    animDone: false,
    appState: null,
    broadcastMessage: null,
    showingBroadcastMessage: null,
    showingReleaseNotes: false,
    isReady: false,
    initialState: null,
  };

  persistenceKey = 'persistenceKey';

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.showingReleaseNotes !== this.state.showingReleaseNotes &&
      this.state.showingReleaseNotes
    ) {
      setTimeout(() => NavigationService.navigate('ReleaseNotes'), 0);
    } else if (
      prevState.showingBroadcastMessage !==
        this.state.showingBroadcastMessage &&
      this.state.showingBroadcastMessage &&
      !this.state.showingReleaseNotes
    ) {
      addBroadcastMessageToRead(this.state.broadcastMessage);
      NavigationService.navigate('BroadcastMessage', {
        message: this.state.broadcastMessage,
      });
    }
  }

  componentDidMount() {
    if (__DEV__) {
      // Crashlytics().log('App Mounted');
      NativeDevSettings.setIsDebuggingRemotely(false);
    }
    store.subscribe(() => {
      const {
        tunnel: {
          appState,
          remoteConfig: {
            broadcast_message,
            enable_app,
            app_release_lifespan,
            latest_app_version,
            should_force_app_updates,
          },
        },
      } = store.getState();

      console.log({appState});

      if (appState !== this.state.appState) {
        this.setState({
          appState,
        });
      }

      if (enable_app !== this.state.enableApp) {
        this.setState({
          app_release_lifespan,
          latest_app_version,
          should_force_app_updates,
          enableApp: enable_app,
        });
      }

      if (broadcast_message !== this.state.broadcastMessage) {
        isMessageLastReadMessage(broadcast_message).then(result => {
          this.setState({
            broadcastMessage: broadcast_message,
            showingBroadcastMessage: !result,
          });
        });
      }
    });

    setTimeout(
      () =>
        this.setState({
          animDone: true,
        }),
      2000,
    );

    // this.handleSession();

    QuickActions.setShortcutItems([
      {
        type: 'MTN Recharge',
        title: 'MTN Recharge',
        subtitle: 'MTN Recharge',
        icon: 'src_assets_media_images_sell_airtime_icon',
        userInfo: {
          url: `ProductPayment${QUICK_ACTION_ITEMS_DELIMITER}${JSON.stringify({
            category: BUY_AIRTIME,
            paymentCode: '10906',
            product: null,
            subCategory: null,
          })}`,
        },
      },
      {
        type: 'DStv Subscription',
        title: 'DStv Subscription',
        subtitle: 'DStv Subscription',
        icon: 'src_assets_media_images_pay_bill_icon',
        userInfo: {
          url: `ProductPayment${QUICK_ACTION_ITEMS_DELIMITER}${JSON.stringify({
            category: PAY_A_BILL_NORMALIZED,
            product: {
              supportPhoneNumber: null,
              code: 'DSTV',
              amountType: 0,
              name: 'DSTV Subscription',
              categoryId: 2,
              categoryName: '',
              urlName: 'dstv',
              description: 'Pay DSTV bills',
              id: 104,
              imageUrl:
                'https://www.quickteller.com/images/Downloaded/362ed1cc-f986-4946-bb48-bfcdc76020cd.png',
              imageName: 'DSTV Subscription',
              currencyCode: '566',
              customerIdName: 'DSTV Smart Card Number',
              address: null,
              surcharge: 10000,
              supportEmail:
                'dstv@nigeria.multichoice.co.za      If your subscription expired before this payment was made, please call DSTV customer care on +2348039003788,01-2703232 to request for a reconnection. For any other activation issues, please send a mail to the email address above',
              customerBearsFee: false,
              additionalMessage: '',
              options: null,
            },
            subCategory: {
              id: 2,
              name: 'Cable TV',
              description: 'Pay your cable TV bill here',
              urlName: 'cable-tv',
            },
          })}`,
        },
      },
      {
        type: 'Ikeja Electric (Postpaid)',
        title: 'Ikeja Electric (Postpaid)',
        subtitle: 'IE Bill Payment',
        icon: 'src_assets_media_images_pay_bill_icon',
        userInfo: {
          url: `ProductPayment${QUICK_ACTION_ITEMS_DELIMITER}${JSON.stringify({
            category: PAY_A_BILL_NORMALIZED,
            product: {
              supportPhoneNumber: null,
              code: 'IE',
              amountType: 0,
              name: 'Ikeja Electric (Postpaid)',
              categoryId: 1,
              categoryName: 'Utilities',
              urlName: 'ikejaelectric',
              description: 'Ikeja Electric Postpaid Payments',
              id: 848,
              imageUrl:
                'https://www.quickteller.com/images/Downloaded/e3335668-6fff-43da-acef-39371ffad86b.png',
              imageName: 'Ikeja Electric (Postpaid)',
              currencyCode: '566',
              customerIdName: 'Customer Account No.(enter only digits)',
              address: null,
              surcharge: 10000,
              supportEmail: null,
              customerBearsFee: false,
              additionalMessage: '',
              options: null,
            },
            subCategory: null,
          })}`,
        },
      },
    ]);

    QuickActions.popInitialAction()
      .then(this.handleQuickAction)
      .catch(console.error);

    DeviceEventEmitter.addListener('quickActionShortcut', data => {
      this.handleQuickAction(data);
    });

    shouldShowReleaseNotes().then(result => {
      this.setState({
        showingReleaseNotes: result,
      });
    });
  }

  handleQuickAction(quickActionData) {
    console.log({quickActionData});
    if (!quickActionData) {
      return;
    }

    const [screenName, navigationParams] = quickActionData?.userInfo.url.split(
      QUICK_ACTION_ITEMS_DELIMITER,
    );

    payload = {
      screenName,
      navigationParams: JSON.parse(navigationParams),
    };

    store.dispatch({
      type: SET_SCREEN_AFTER_LOGIN,
      payload,
    });

    store.dispatch({
      type: SET_QUICK_ACTION,
      payload,
    });
  }

  async handleSession() {
    const hasAuthTokenExpired = await isAuthTokenExpired();

    console.log('AUTH TOKEN HAS EXPIRED', hasAuthTokenExpired);

    // hasAuthTokenExpired === null || hasAuthTokenExpired === true
    if (hasAuthTokenExpired === true) {
      const navigationStateString = await AsyncStorage.getItem(
        this.persistenceKey,
      );

      const navigationState = JSON.parse(navigationStateString);

      const currentScreen = navigationState.routes[navigationState.index].name;
      if (
        currentScreen === 'Login' ||
        currentScreen === 'Welcome' ||
        currentScreen === 'ForgotPassword' ||
        currentScreen === 'Signup' ||
        currentScreen === 'Landing' ||
        currentScreen === 'Logout'
      ) {
        console.log(
          'CURRENT SCREEN IS LOGIN or WELCOME, SO NOT BOTHERING TO LOGOUT',
        );
        return;
      }

      console.log('WILL LOG USER OUT NOW!!!');

      onSessionEnd();
      setTimeout(
        () =>
          NavigationService.navigate('Logout', {
            didSessionExpire: true,
          }),
        5000,
      );

      return;
    }

    hasAuthTokenExpired === false && onNewSessionBegin();
  }

  render() {
    const {
      app_release_lifespan,
      appState,
      latest_app_version,
      should_force_app_updates,
      isReady,
      initialState,
    } = this.state;

    // if (!isReady) {
    //   return <SplashScene backgroundColor={COLOUR_BLUE} />;
    // }

    let content = <MainStackNavigator />;

    if (this.state.enableApp === false) {
      content = <DisabledScene />;
    }

    if (
      app_release_lifespan &&
      should_force_app_updates &&
      shouldForceAppUpdate({
        should_force_app_updates,
        app_release_lifespan,
        latest_app_version,
      })
    ) {
      content = <ImportantUpdateAvailable />;
    }

    // if (appState === APP_STATES.ACTIVATING) {
    //   content = <View
    //     style={{
    //       backgroundColor: 'white',
    //       flex: 0,
    //       position: 'absolute',
    //     }}
    //   >
    //     {content}
    //   </View>;
    // }

    return (
      <Provider store={store}>
        <ErrorBoundary>
          <View style={{flex: 1}}>
            {content}
            <UpdateBanner />
          </View>
        </ErrorBoundary>
      </Provider>
    );
  }
}

// const codePushOptions = {
//   checkFrequency: CodePush.CheckFrequency.MANUAL,
//   installMode: CodePush.InstallMode.IMMEDIATE,
//   deploymentKey: CODE_PUSH_DEPLOYMENT_KEY
// };

export default App;

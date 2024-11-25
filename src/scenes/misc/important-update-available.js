import React from 'react';
import {Linking, View} from 'react-native';
import {connect} from 'react-redux';

import {Icon} from 'react-native-elements';
import Button from '../../components/button';
import Header from '../../components/header';
import Text from '../../components/text';
import {APP_NAME} from '../../constants';
import {APP_VERSION} from '../../constants/api-resources';
import {COLOUR_GREY} from '../../constants/styles';
import {getVersionNumber} from '../../utils/helpers';

export function shouldForceAppUpdate({
  should_force_app_updates,
  latest_app_version,
  app_release_lifespan,
}) {
  if (!should_force_app_updates || !latest_app_version) {
    return false;
  }

  return (
    getVersionNumber(latest_app_version) - getVersionNumber(APP_VERSION) >
    app_release_lifespan
  );
}

function ImportantUpdateAvailable({latest_app_url}) {
  return (
    <View style={{flex: 1}}>
      <View style={{height: 70, marginBottom: 25}}>
        <Header paypointLogo />
      </View>
      <View
        style={{
          flex: 0.8,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
        }}>
        <Icon
          color={COLOUR_GREY}
          name="alert-circle"
          size={156}
          containerStyle={{marginBottom: 16}}
          type="feather"
        />
        <Text big center>
          This version of the application is outdated. Please, update your app
          to continue using {APP_NAME}.
        </Text>
        <Button
          containerStyle={{marginTop: 16, width: 200}}
          onPress={() => Linking.openURL(latest_app_url)}
          title="UPDATE"
        />
      </View>
    </View>
  );
}

function mapStateToProps(state) {
  return {
    app_release_lifespan: state.tunnel.remoteConfig.app_release_lifespan,
    latest_app_url: state.tunnel.remoteConfig.latest_app_url,
    latest_app_version: state.tunnel.remoteConfig.latest_app_version,
    should_force_app_updates:
      state.tunnel.remoteConfig.should_force_app_updates,
  };
}

export default connect(mapStateToProps, null)(ImportantUpdateAvailable);

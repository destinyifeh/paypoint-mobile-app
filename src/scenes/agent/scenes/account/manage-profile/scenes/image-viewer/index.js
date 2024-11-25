import React from 'react';
import {Image, View} from 'react-native';
import {Icon} from 'react-native-elements';

import Header from '../../../../../../../components/header';
import {
  COLOUR_BLUE,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../../../../../constants/styles';

export default class ImageViewer extends React.Component {
  render() {
    const {title, url} = this.props.route?.params?.image || {};

    return (
      <View style={{flex: 1}}>
        <Header
          containerStyle={{
            backgroundColor: COLOUR_BLUE,
          }}
          navigationIconColor={COLOUR_WHITE}
          leftComponent={
            <Icon
              color={COLOUR_RED}
              underlayColor="transparent"
              name="chevron-left"
              size={40}
              type="material"
              onPress={() => this.props.navigation.goBack()}
            />
          }
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_LIGHT,
          }}
          title={title}
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
          }}
        />

        <View
          style={{
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
            padding: 16,
          }}>
          <Image
            resizeMode="center"
            source={{uri: url}}
            style={{
              height: '85%',
              width: '85%',
            }}
          />
        </View>
      </View>
    );
  }
}

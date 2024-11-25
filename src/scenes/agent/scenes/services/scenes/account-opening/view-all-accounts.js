import React from 'react';
import {View} from 'react-native';

import {Icon} from 'react-native-elements';

import Header from '../../../../../../components/header';
import {
  COLOUR_BLUE,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../../../../constants/styles';

export default function ViewAllAccounts(props) {
  const category = props.route?.params?.category || null;

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
            onPress={() => props.navigation.goBack()}
          />
        }
        statusBarProps={{
          backgroundColor: 'transparent',
          barStyle: CONTENT_LIGHT,
        }}
        title={`View ${category} Accounts`}
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: 'bold',
        }}
      />
    </View>
  );
}

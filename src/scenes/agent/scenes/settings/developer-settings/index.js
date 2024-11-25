import React from 'react';
import { FlatList, View } from 'react-native';

import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';
import messaging from '@react-native-firebase/messaging';

import Header from '../../../../../components/header';
import Text from '../../../../../components/text';
import {
  COLOUR_BLUE,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../../../constants/styles';
import ClickableListItem from '../../../../../components/clickable-list-item';
import { retrieveAuthToken } from '../../../../../utils/auth';
import { copyContentToClipboard } from '../../../../../utils/helpers';


export default class DeveloperSettings extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  async componentDidMount() {
    const { authToken } = await retrieveAuthToken();
    const fcmToken = await messaging().getToken();

    this.setState({
      menuItems: [
        {
          title: 'Access Token',
          value: authToken,
        },
        {
          title: 'Firebase Token',
          value: fcmToken,
        },
      ],
    });
  }

  renderItem(item) {
    return <ClickableListItem
      style={{
        alignItems: 'center',
        backgroundColor: COLOUR_WHITE,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 55,
        padding: 10,
        paddingHorizontal: 15,
        marginBottom: 10,
      }}
      onPressOut={() => copyContentToClipboard(item.value)}
    >
      <Text>
        {item.title}
      </Text>
    </ClickableListItem>;
  }

  render() {
    return <View style={{
      backgroundColor: '#F3F3F4',
      flex: 1,
    }}>
      <Header
        containerStyle={{
          backgroundColor: COLOUR_BLUE,
        }}
        navigationIconColor={COLOUR_WHITE}
        leftComponent={<Icon
          color={COLOUR_WHITE}
          underlayColor="transparent"
          name="chevron-left"
          size={40}
          type="material"
          onPress={() => this.props.navigation.goBack()}
        />}
        hideNavigationMenu={this.props.hideNavigator}
        showNavigationMenu={this.props.showNavigator}
        statusBarProps={{
          backgroundColor: 'transparent',
          barStyle: CONTENT_LIGHT,
        }}
        title="Developer Settings"
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: 'bold',
        }}
      />

      <View style = {{
        backgroundColor: '#F3F3F4',
        flex: 1,
      }}>
        <FlatList
          contentContainerStyle={{marginTop: 30}}
          data={this.state.menuItems}
          renderItem={({item, index}) => this.renderItem(item)}
        />
      </View>

    </View>;
  }
}

DeveloperSettings.propTypes = {
  hideNavigator: PropTypes.func,
  navigation: PropTypes.object,
  showNavigator: PropTypes.func,
};

import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {Icon, Header as RneHeader} from 'react-native-elements';
import {connect} from 'react-redux';
import {COLOUR_WHITE, CONTENT_DARK} from '../constants/styles';
import Text from './text';

class Header extends React.Component {
  state = {
    active: null,
  };

  render() {
    const {sub_header_message} = this.props.remoteConfig;

    const subHeaderStyle = {
      backgroundColor: '#012F4480',
      marginTop: this.props.paypointLogo ? 24 : 0,
    };

    const navigationIcon = (
      <Icon
        color={this.props.navigationIconColor}
        name="sort"
        size={36}
        type="material"
        underlayColor="transparent"
      />
    );

    const navigateBackIcon = (
      <Icon
        color={this.props.navigationIconColor || COLOUR_WHITE}
        name="chevron-left"
        size={40}
        onPress={this.props.goBack}
        type="material"
        underlayColor="transparent"
      />
    );

    const paypointLogoHeader = (
      <View style={{justifyContent: 'center', marginTop: 35}}>
        <Image
          source={require('../assets/media/icons/paypoint.png')}
          style={{
            resizeMode: 'center',
            width: 230,
          }}
        />
      </View>
    );

    let leftComponent = this.props.leftComponent;
    if (this.props.withNavigator) {
      leftComponent = (
        <TouchableOpacity
          style={{
            alignItems: 'flex-start',
            width: 100,
          }}
          onPress={() => {
            this.props.isNavigatorVisible
              ? this.props.hideNavigationMenu()
              : this.props.showNavigationMenu();
          }}>
          {navigationIcon}
        </TouchableOpacity>
      );
    } else if (this.props.withNavigateBackIcon) {
      leftComponent = (
        <TouchableOpacity
          // onPress={() => this.props.navigation?.goBack()}
          style={{
            alignItems: 'flex-start',
            width: 100,
          }}>
          {navigateBackIcon}
        </TouchableOpacity>
      );
    }

    const centerComponent = this.props.paypointLogo ? (
      paypointLogoHeader
    ) : this.props.centerComponent ? (
      this.props.centerComponent
    ) : (
      <Text
        ellipsizeMode={'middle'}
        numberOfLines={1}
        semiBold
        white
        style={{
          fontSize: 20,
          ...this.props.titleStyle,
        }}>
        {this.props.title}
      </Text>
    );

    const rightComponent = this.props.rightComponent || null;

    const regularHeader = (
      <View>
        <RneHeader
          centerContainerStyle={{
            borderColor: 'transparent',
            ...this.props.centerContainerStyle,
          }}
          containerStyle={{
            backgroundColor: 'transparent',
            borderBottomColor: 'transparent',
            borderColor: 'transparent',
            borderWidth: 0,
            paddingLeft: 15,
            paddingRight: 15,
            ...this.props.containerStyle,
          }}
          statusBarProps={{
            animated: true,
            backgroundColor: COLOUR_WHITE,
            barStyle: CONTENT_DARK,
            translucent: true,
            ...this.props.statusBarProps,
          }}>
          {leftComponent}
          {centerComponent}
          {rightComponent}
        </RneHeader>
        {sub_header_message && (
          <View
            style={{
              backgroundColor: 'white',
              padding: 8,
              width: '100%',
              ...subHeaderStyle,
            }}>
            <Text bold center small white>
              {sub_header_message}
            </Text>
          </View>
        )}
      </View>
    );

    return regularHeader;
  }
}

function mapStateToProps(state) {
  return {
    isNavigatorVisible: state.navigation.isNavigatorVisible,
    remoteConfig: state.tunnel.remoteConfig,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // hideNavigator: () => dispatch(hideNavigator()),
    // showNavigator: () => dispatch(showNavigator())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);

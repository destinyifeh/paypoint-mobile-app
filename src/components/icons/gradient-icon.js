import React from 'react';
import { Icon } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

const DEFAULT_ICON_SIZE = 32;

export default class GradientIcon extends React.Component {
  render() {
    return <LinearGradient colors={this.props.colors} style={{
      alignItems: 'center',
      borderRadius: this.props.round ? 25 : 8,
      height: 50,
      justifyContent: 'center',
      width: 50,
      ...this.props.style,
    }}>
      <Icon
        name={this.props.icon}
        color="white"
        size={this.props.iconSize || DEFAULT_ICON_SIZE}
        type={this.props.iconType || 'font-awesome'}
      />
    </LinearGradient>;
  }
}

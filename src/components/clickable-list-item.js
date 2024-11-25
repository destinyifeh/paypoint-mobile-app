import React from 'react';
import { TouchableOpacity } from 'react-native';

export default class ClickableListItem extends React.Component {
  render() {
    return <TouchableOpacity
      {...this.props}
      onPress={this.props.onPressOut || this.props.onPress}
      onPressOut={() => {}}
    >
        {this.props.children}
    </TouchableOpacity>;
  }
}

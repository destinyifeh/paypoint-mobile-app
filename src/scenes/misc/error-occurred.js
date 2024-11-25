import React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';

export default class ErrorOccurred extends React.Component {
  
  defaultMessage = "An error occurred";

  render() {
    return <View style={{
      alignItems: 'center',
      flex: 1, 
      justifyContent: 'center'
    }}>
      <Icon 
        name="frown"
        size={48}
        type="antdesign"
      />
      <Text grey>{this.props.message || this.defaultMessage}</Text>
      <Text big blue onClick={this.props.onRetry}>Try again</Text>

    </View>
  }
}

import React from 'react'
import { ActivityIndicator as RnActivityIndicator, View } from 'react-native'
import { COLOUR_BLUE } from '../constants/styles';

export default class ActivityIndicator extends React.Component {
  render () {
    return <View style={{
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      ...this.props.containerStyle
    }}>
      <RnActivityIndicator 
        size={this.props.size || "large"}
        color={this.props.color || COLOUR_BLUE}
      />
    </View>
  }
}

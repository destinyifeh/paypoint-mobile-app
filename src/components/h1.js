import React from 'react'
import { Text, View } from 'react-native'
import { Divider } from 'react-native-elements'
import { COLOUR_BLUE, COLOUR_LIGHT_GREY } from '../constants/styles'
import { FONT_FAMILY_HEADER, FONT_SIZE_BIGGER } from '../constants/styles'


export default class H1 extends React.Component {
  render() {
    return <View>
      <Text style={{
        color: COLOUR_BLUE,
        fontFamily: FONT_FAMILY_HEADER,
        fontSize: FONT_SIZE_BIGGER,
        // fontWeight: 'bold',
        ...this.props.style
      }}>
        {this.props.children}
      </Text>

      {this.props.underline && <Divider style={{
        alignSelf: 'center',
        backgroundColor: COLOUR_LIGHT_GREY,
        height: 1,
        marginBottom: 20,
        width: this.props.underlineWidth || 100,
        ...this.props.underlineStyle
      }} />}
    </View>
  }
}

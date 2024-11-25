import React from 'react'
import { View } from 'react-native'
import { COLOUR_GREEN } from '../constants/styles'

export default class ProgressBar extends React.Component {
  render () {
    return <View style={{backgroundColor: COLOUR_GREEN, height: 10, width: '20%'}}>

    </View>
  }
}

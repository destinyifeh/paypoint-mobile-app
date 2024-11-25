import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { COLOUR_RED, COLOUR_BLACK, COLOUR_BLUE } from '../constants/styles';
import Text from './text';
import { ERROR_STATUS, SUCCESS_STATUS } from '../constants/api';

export default class AlertStrip extends React.Component {
  render() {
    return <View 
      style={
        [styles.base, styles[this.props.variant.toLowerCase()]]
      }
    >
      <View>
        <Text title style={styles[`${this.props.variant.toLowerCase()}Text`]}>
          {this.props.content}
        </Text>
      </View>
    </View>
  }
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 2,
    color: COLOUR_BLACK,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
    marginBottom: 20
  },
  emotion: {
    position: 'absolute',
    left: 0,
    height: 60,
    opacity: .6,
    width: 60
  },
  error: {
    backgroundColor: `${COLOUR_RED}90`,
    borderColor: COLOUR_RED,
  },
  information: {
    backgroundColor: `${COLOUR_BLUE}50`,
    borderColor: COLOUR_BLUE,
  },
  informationText: {
    color: COLOUR_BLUE
  }
});

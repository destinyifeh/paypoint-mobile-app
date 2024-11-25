import React from 'react'
import {
  Dimensions,
  Image, 
  StyleSheet, 
  View 
} from 'react-native'
import Text from '../../../components/text';
import { COLOUR_GREY } from '../../../constants/styles';

const windowWidth = Dimensions.get('window').width

export default class SecondSlide extends React.Component {
  render() {
    return <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={require('../../../assets/media/images/welcome-slide-1-image-1.png')}
          style={{
            height: '100%',
            position: 'absolute',
            resizeMode: 'center',
            top: -20
          }} />
        <Image 
          source={require('../../../assets/media/images/welcome-slide-1-image-2.png')} 
          style={{
            height: '130%',
            position: 'absolute',
            resizeMode: 'center',
            top: -50
          }} />
      </View>

      <View style={styles.textContainer}>
        <Text bold style={styles.heading}>Our Network</Text>
        <Text big style={styles.body}>With a network of over 28,000 agents, spread across 36 states and FCT, be rest assured that a Quickteller Paypoint agent is always near you.</Text>
      </View>
    </View>
  }
}

const styles = StyleSheet.create({
  body: {
    color: COLOUR_GREY, 
    lineHeight: 28, 
    marginTop: 25,
    textAlign: 'center'
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: windowWidth * 1
  },
  heading: {
    color: COLOUR_GREY, 
    fontSize: 30, 
    lineHeight: 38
  },
  imageContainer: {
    alignItems: 'center',
    flex: .35
  },
  textContainer: {
    alignItems: 'center',
    // backgroundColor: 'red',
    flex: .3,
    justifyContent: 'space-evenly',
    paddingHorizontal: 20
  }
})

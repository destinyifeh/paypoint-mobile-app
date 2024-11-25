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

export default class FirstSlide extends React.Component {
  render() {
    return <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={require('../../../assets/media/images/welcome-slide-3-image-1.png')}
          style={{
            height: '100%',
            position: 'absolute',
            resizeMode: 'center',
            top: -20
          }}/>
        <Image 
          source={require('../../../assets/media/images/welcome-slide-3-image-2.png')} 
          style={{
            height: '130%',
            position: 'absolute',
            resizeMode: 'center',
            top: -60
          }} />
      </View>

      <View style={styles.textContainer}>
        <Text bold style={styles.heading}>Our Services</Text>
        <Text big style={styles.body}>You can enjoy the following services at our agents' points - Pay Bills, Send Money, Withdraw Cash, Buy Airtime, Open Accounts with your preferred bank, etc.</Text>
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
    lineHeight: 38,
    textAlign: 'center'
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
    marginTop: 10,
    paddingHorizontal: 20
  }
})

import React from 'react'
import { 
  Animated,
  Easing,
  Image,
  StatusBar,
  StyleSheet,
  View 
} from 'react-native'
import { COLOUR_SECONDARY, COLOUR_PRIMARY } from '../../constants/styles'

export default class SplashScene extends React.Component {
  static defaultProps = {
    delay: 500,
    animationDuration: 500,
  }

  state = {
    animStarted: false,
    scaleValue: new Animated.Value(0)
  };

  constructor() {
    super();

    this.startAnimations = this.startAnimations.bind(this);
  }

  componentDidMount() {
    setTimeout(this.startAnimations, this.props.delay);
    setTimeout(() => this.setState({
      animStarted: true
    }), this.props.delay + 50)
  }

  componentWillUnmount() {
    this.setState({
      isUnmounted: true
    })
  }

  startAnimations() {

    if (this.state.isUnmounted) {
      return
    }

    Animated.timing(
      this.state.scaleValue,
      {
        toValue: 10,
        duration: this.props.animationDuration,
        easing: Easing.ease,
        useNativeDriver: true,
      }
    ).start();
  }

  render() {
    return <View style={styles.view}>
      <StatusBar barStyle="light-content" translucent={true} backgroundColor={'transparent'} />
      <Animated.View style={{
        backgroundColor: this.state.animStarted ? COLOUR_SECONDARY : COLOUR_PRIMARY,
        borderRadius: 50,
        height: 100,
        width: 100,
        transform: [{
          scale: this.state.scaleValue
        }]
      }}>
      </Animated.View>
      
      <Image source={require('../../assets/media/images/logo-light.png')} width={200} style={{
        alignSelf: 'center',
        position: 'absolute',
      }} />
    </View>
  }
}

const styles = StyleSheet.create({
  view: {
    alignItems: 'center',
    backgroundColor: COLOUR_PRIMARY,
    flex: 1,
    justifyContent: 'center'
  }
})

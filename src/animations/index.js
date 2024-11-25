import React from 'react';

import LottieView from 'lottie-react-native';


export function failedAnimation({style}) {
  return <LottieView
    autoPlay={true}
    loop={false}
    ref={animation => {
      this.animation = animation;
    }}
    style={{
      backgroundColor: 'transparent',
      height: 200,
      width: 200,
      ...style
    }}
    source={require('./14651-error-animation (2).json')}
  />
}


export function warningAnimation({style}) {
  return <LottieView
    autoPlay={true}
    loop={false}
    ref={animation => {
      this.animation = animation;
    }}
    style={{
      backgroundColor: 'transparent',
      height: 200,
      width: 200,
      ...style
    }}
    source={require('./15426-warning-animation (3).json')}
  />
}


export function waitingAnimation({style}) {
  return <LottieView
    autoPlay={true}
    loop={false}
    ref={animation => {
      this.animation = animation;
    }}
    style={{
      backgroundColor: 'transparent',
      height: 200,
      width: 200,
      ...style
    }}
    source={require('./21421-waiting.json')}
  />
}


export function successAnimation({style}) {
  return <LottieView
    autoPlay={true}
    loop={false}
    ref={animation => {
      this.animation = animation;
    }}
    style={{
      backgroundColor: 'transparent',
      height: 200,
      width: 200,
      ...style
    }}
    source={require('./checked-done-2.json')}
  />
}

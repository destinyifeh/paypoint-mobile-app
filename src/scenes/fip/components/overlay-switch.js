import React from 'react';
import {Animated, Easing} from 'react-native';
import ViewShot, {captureScreen} from 'react-native-view-shot';
import {connect} from 'react-redux';
import {COLOUR_LIGHT_GREY} from '../../../constants/styles';
import {updateLastSceneCapture} from '../../../services/redux/actions/navigation';

class Switch extends React.Component {
  render() {
    const {routes} = this.props;

    return routes[this.props.active || 'Home'] || routes['Home'];
  }
}

class OverlayScene extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      borderRadius: new Animated.Value(0),
      underlayVisible: false,
      translateXValue: new Animated.Value(0),
      scaleValue: new Animated.Value(1), // 1
    };

    this.hideUnderlayNavigator = this.hideUnderlayNavigator.bind(this);
    this.showUnderlayNavigator = this.showUnderlayNavigator.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isNavigatorVisible) {
      this.showUnderlayNavigator();
    } else if (
      this.props.isNavigatorVisible !== null &&
      !this.props.isNavigatorVisible
    ) {
      this.hideUnderlayNavigator();
    }
  }

  async doScreenCapture() {
    const uri = await captureScreen({
      format: 'jpg',
      quality: 1,
    });

    this.props.updateLastSceneCapture(uri);
  }

  hideUnderlayNavigator() {
    setTimeout(this.doScreenCapture.bind(this), 1000);

    Animated.timing(this.state.scaleValue, {
      toValue: 1,
      duration: 200,
      easing: Easing.exp,
      useNativeDriver: true,
    }).start();

    Animated.timing(this.state.translateXValue, {
      toValue: 0,
      duration: 200,
      easing: Easing.exp,
      useNativeDriver: true,
    }).start();
  }

  showUnderlayNavigator() {
    const viewRef = this.switchView;

    Animated.timing(this.state.scaleValue, {
      toValue: 0.65,
      duration: 200,
      easing: Easing.exp,
      useNativeDriver: true,
    }).start();

    Animated.timing(this.state.translateXValue, {
      toValue: 400,
      duration: 200,
      easing: Easing.exp,
      useNativeDriver: true,
    }).start();

    // Animated.decay(
    //   this.state.translateXValue,
    //   {
    //     velocity: 1.15,
    //     deceleration: 0.9972,
    //     easing: Easing.ease,
    //     useNativeDriver: true
    //   }
    // ).start()
  }

  render() {
    if (this.isNavigatorVisible && !this.state.underlayVisible) {
      this.showUnderlayNavigator();
    } else {
      this.hideUnderlayNavigator();
    }

    return (
      <Animated.View
        style={{
          backgroundColor: COLOUR_LIGHT_GREY,
          borderRadius: this.props.isNavigatorVisible ? 16 : 0,
          elevation: 10,
          height: '100%',
          width: '100%',
          flex: 1,
          position: 'absolute',
          zIndex: 1,
          transform: [
            {scale: this.state.scaleValue},
            {translateX: this.state.translateXValue},
          ],
        }}>
        <ViewShot
          ref={view => (this.switchView = view)}
          style={{
            flex: 1,
          }}>
          <Switch
            active={this.props.pendingUrl}
            routes={this.props.routes}
            showNavigationMenu={this.showUnderlayNavigator}
          />
        </ViewShot>
      </Animated.View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isNavigatorVisible: state.navigation.isNavigatorVisible,
    pendingUrl: state.navigation.pendingUrl,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateLastSceneCapture: path => dispatch(updateLastSceneCapture()),
    // navigateTo: message => dispatch(navigateTo(message))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OverlayScene);

import React from 'react';

import {Animated, StyleSheet, View} from 'react-native';
import ActivityIndicator from './activity-indicator';

const styles = StyleSheet.create({
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  container: {
    backgroundColor: '#e1e4e8',
    marginRight: 10,
  },
});

class ProgressiveImage extends React.Component {
  thumbnailAnimated = new Animated.Value(0);
  imageAnimated = new Animated.Value(0);

  state = {};

  handleThumbnailLoad = () => {
    Animated.timing(this.thumbnailAnimated, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  onImageLoad = () => {
    Animated.timing(this.imageAnimated, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  handleImageLoadStart = () => {
    this.setState({
      isLoading: true,
    });
  };

  handleImageLoadEnd = () => {
    this.setState({
      isLoading: false,
    });
  };

  handleThumbnailLoadStart = () => {
    this.setState({
      isLoading: true,
    });
  };

  handleThumbnailLoadEnd = () => {
    this.setState({
      isLoading: false,
    });
  };

  render() {
    const {thumbnailSource, source, style, ...props} = this.props;
    const {isLoading} = this.state;

    return (
      <View style={styles.container}>
        <Animated.Image
          {...props}
          source={thumbnailSource}
          style={[style, {opacity: this.thumbnailAnimated}]}
          onLoad={this.handleThumbnailLoad}
          onLoadEnd={this.handleThumbnailLoadEnd.bind(this)}
          onLoadStart={this.handleThumbnailLoadStart.bind(this)}
          blurRadius={1}
        />
        <Animated.Image
          {...props}
          source={source}
          style={[styles.imageOverlay, {opacity: this.imageAnimated}, style]}
          onLoad={this.onImageLoad}
          onLoadEnd={this.handleImageLoadEnd.bind(this)}
          onLoadStart={this.handleImageLoadStart.bind(this)}
        />
        {isLoading && (
          <ActivityIndicator
            containerStyle={{position: 'absolute', top: '50%', left: '50%'}}
          />
        )}
      </View>
    );
  }
}

export default ProgressiveImage;

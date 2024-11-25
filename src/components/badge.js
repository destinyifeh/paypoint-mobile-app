import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import Text from './text';


export default function Badge({backgroundColor, color, text}) {
  return (
    <View style={[styles.container, {backgroundColor}]}>
      <Text bold small style={{color}}>
        {text.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    width: 'auto',
  },
});

Badge.propTypes = {
  backgroundColor: PropTypes.string,
  color: PropTypes.string,
  text: PropTypes.string,
};

import React from 'react';
import { StyleSheet, View } from 'react-native';

import PropTypes from 'prop-types';
import { COLOUR_LIGHT_GREY } from '../constants/styles';


function Block({height, width}) {
  return (
    <View style={[styles.block, {height, width}]} />
  );
}


export function TransactionRow() {
  return (
    <View style={styles.transactionRowContainer}>
      <Block height={64} width={64} />
      <View
        style={[
          styles.verticalContainer,
          {
            justifyContent: 'space-between',
            marginLeft: 12,
            height: '100%',
          },
        ]}
      >
        <Block height={20} width={204} />
        <Block height={12} width={130} />
        <Block height={12} width={130} />
      </View>
      <View
        style={[
          styles.verticalContainer,
          {
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginLeft: 12,
            height: '100%',
          },
        ]}
      >
        <Block height={40} width={80} />
        <Block height={12} width={50} />
      </View>
    </View>
  );
}

export default {
  TransactionRow,
};

const styles = StyleSheet.create({
  block: {
    backgroundColor: COLOUR_LIGHT_GREY, // '#B9CAE1',
  },
  transactionRowContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    height: 100,
    padding: 20,
  },
  verticalContainer: {
    flexDirection: 'column',
  },
});

Block.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
};

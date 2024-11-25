import React, { useEffect, useState } from 'react';
import { FlatList, Linking, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import SendIntentAndroid from 'react-native-send-intent';
import { Icon } from 'react-native-elements';

import Button from '../../components/button';
import Header from '../../components/header';
import Text from '../../components/text';
import { PRINTER_DRIVER_PACKAGE_NAME } from '../../constants/api-resources';
import {
  COLOUR_BLUE,
  COLOUR_GREEN,
  COLOUR_LIGHT_GREY,
  COLOUR_LINK_BLUE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../constants/styles';
import {
  hideNavigator,
  showNavigator,
} from '../../services/redux/actions/navigation';


const PRINTER_SETUP_STEPS = [
  {
    title: 'Download the RawBT App',
    description: 'Firstly, you will need to download a driver for the ' +
    'POS printer on your phone so that you can print conveniently.',
    onClick: () => {
      Linking.openURL(`market://details?id=${PRINTER_DRIVER_PACKAGE_NAME}`);
    },
    isDone: async () => {
      return (
        await SendIntentAndroid.isAppInstalled(PRINTER_DRIVER_PACKAGE_NAME)
      );
    },
  },
  {
    title: 'Setup your printer on RawBT',
    description: 'Next, follow the steps in the RawBT app to setup your ' +
    'printer.',
    onClick: () => {
      SendIntentAndroid.openApp(PRINTER_DRIVER_PACKAGE_NAME);
    },
    isDone: undefined,
  },
  {
    title: 'Print out your receipts!',
    description: 'When you’re all setup, you can then proceed to print ' +
    'receipts after each transaction or from the report view by clicking ' +
    'the \'print\' button on the receipts.',
    onClick: undefined,
    isDone: undefined,
  },
];

function BulletPoint({description, isDone, onClick, title}) {
  const [isDone_, setIsDone_] = useState(false);

  useEffect(() => {
    if (isDone) {
      isDone().then(
          (result) => setIsDone_(result),
      );
    }
  }, []);

  return (
    <View style={styles.bulletPointContainer}>
      <Icon
        color={isDone_ ? COLOUR_GREEN : COLOUR_LIGHT_GREY}
        name={isDone_ ? 'check-circle' : 'donut-large'}
        size={42}
        containerStyle={{marginTop: 4}}
        type="material"
      />
      <View style={{marginLeft: 16, width: '85%'}}>
        <Text big blue semiBold>{title}</Text>
        <Text title>{description}</Text>
        {!isDone_ && onClick && <Button
          containerStyle={{
            width: '100%',
          }}
          buttonStyle={{
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            paddingLeft: 0,
            width: '100%',
          }}
          onPress={onClick}
          title="Take me there"
          titleStyle={{
            color: COLOUR_LINK_BLUE,
            textAlign: 'left',
          }}
          transparent
        />}
      </View>
    </View>
  );
}

function PrinterSetupScene(props) {
  return (
    <View style={styles.container}>
      <Header
        containerStyle={{
          backgroundColor: COLOUR_BLUE,
        }}
        navigationIconColor={COLOUR_WHITE}
        hideNavigationMenu={props.hideNavigator}
        showNavigationMenu={props.showNavigator}
        statusBarProps={{
          backgroundColor: 'transparent',
          barStyle: CONTENT_LIGHT,
        }}
        title="Printer Setup"
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: 'bold',
        }}
        withNavigator
      />
      <View
        style={{
          alignItems: 'center',
        }}
      >
        <Icon
          color={COLOUR_BLUE}
          name="print"
          size={100}
          containerStyle={{
            backgroundColor: `${COLOUR_LINK_BLUE}80`,
            borderRadius: 100,
            height: 200,
            justifyContent: 'center',
            marginTop: 24,
            opacity: 0.6,
            padding: 16,
            width: 200,
          }}
          type="material"
        />
      </View>
      <FlatList
        style={{
          marginTop: 16,
          padding: 16,
        }}
        data={PRINTER_SETUP_STEPS}
        renderItem={({item}, index) => <BulletPoint {...item} />}
      />
    </View>
  );
}


BulletPoint.propTypes = {
  description: PropTypes.string,
  index: PropTypes.number,
  isDone: PropTypes.func,
  onClick: PropTypes.func,
  title: PropTypes.string,
};

PrinterSetupScene.propTypes = {
  hideNavigator: PropTypes.func,
  showNavigator: PropTypes.func,
};

const styles = StyleSheet.create({
  bulletPointContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginBottom: 32,
  },
  container: {
    backgroundColor: COLOUR_WHITE,
    flex: 1,
  },
});


function mapDispatchToProps(dispatch) {
  return {
    hideNavigator: () => dispatch(hideNavigator()),
    showNavigator: () => dispatch(showNavigator()),
  };
}

export default connect(null, mapDispatchToProps)(PrinterSetupScene);

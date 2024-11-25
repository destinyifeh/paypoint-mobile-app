import React from 'react';
import {
  BackHandler,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import failedIcon from '../../../../../../../assets/media/icons/failure-animation-icon.png';
import {FONT_FAMILY_BODY} from '../../../../../../../constants/styles';
export const FipAgentFailedVerification = props => {
  const {message} = props.route.params || {};

  const handleBackButtonPress = () => {
    return true;
  };

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonPress,
    );
    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.main}>
      <View style={styles.contentContainer}>
        <Image source={failedIcon} />
        <View style={{marginTop: 15}}>
          <Text style={styles.titeText}>Verification Failed!</Text>
          <Text style={styles.descText}>
            {message
              ? message
              : ' Unable to complete NIN Verification. Please try again.'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => props.navigation.replace('HomeTabs')}>
          <Text style={styles.buttonText}>Okay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    width: '90%',
    alignSelf: 'center',
    flex: 1,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderWidth: 1,
    borderColor: '#479FC8',
    height: 56,
    borderRadius: 8,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  buttonText: {
    color: '#479FC8',
    fontFamily: FONT_FAMILY_BODY,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  descText: {
    color: '#9CA3AF',
    fontFamily: FONT_FAMILY_BODY,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    width: 269.27,
    textAlign: 'center',
  },
  titeText: {
    color: '#10345E',
    fontFamily: FONT_FAMILY_BODY,
    fontSize: 24.98,
    lineHeight: 32,
    fontWeight: '700',
    textAlign: 'center',
  },
});

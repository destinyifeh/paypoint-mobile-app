import React from 'react';
import {
  BackHandler,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import failedIcon from '../../../../../../assets/media/icons/fail-verification-confirmation-icon.png';
import {FONT_FAMILY_BODY} from '../../../../../../constants/styles';
export const FipAgentFailedVerificationModal = props => {
  const handleBackButtonPress = () => {
    props.navigation.goBack();
    return true;
  };

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonPress,
    );
    return () => backHandler.remove();
  }, []);

  const onNext = () => {
    // props.navigation.navigate("AgentFacialVerification", {
    //   bvnInfo: bvn,
    // });
    props.navigation.goBack();
  };
  return (
    <View style={styles.main}>
      <View style={styles.contentContainer}>
        <Image source={failedIcon} />
        <View style={{marginTop: 15}}>
          <Text style={styles.titeText}>Verification Failed!</Text>
          <Text style={styles.descText}>{props.message}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={onNext}>
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
  },
  titeText: {
    color: '#10345E',
    fontFamily: FONT_FAMILY_BODY,
    fontSize: 24.98,
    lineHeight: 32,
    fontWeight: '700',
  },
});

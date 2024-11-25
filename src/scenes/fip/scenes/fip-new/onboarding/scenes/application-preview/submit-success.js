import React from "react";
import {
  Animated,
  BackHandler,
  Easing,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import successIcon from "../../../../../../../assets/media/icons/success-verification-confirmation-icon.png";
import Button from "../../../../../../../components/button";
import { FONT_FAMILY_BODY } from "../../../../../../../constants/styles";

export const FipAgentSubmitApplicationSuccessScene = (props) => {
  const shakeAnimation = React.useRef(new Animated.Value(0)).current;

  const handleBackButtonPress = () => {
    return true;
  };

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButtonPress
    );
    return () => backHandler.remove();
  }, []);

  React.useEffect(() => {
    startShake();
  }, []);

  const startShake = () => {
    //Animated.loop(
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
    //).start();
  };

  return (
    <View style={styles.main}>
      <View style={styles.contentContainer}>
        <Animated.View style={{ transform: [{ translateX: shakeAnimation }] }}>
          <Image source={successIcon} />
        </Animated.View>
        <View
          style={{
            marginTop: 35,
            marginBottom: 65,
            width: 309,
          }}
        >
          <Text style={styles.titeText}>
            Agent application successfully submitted
          </Text>
          <Text style={styles.infoDescText}>
            Your request has been submitted and approval status will be
            available within 48 hours
          </Text>
        </View>
        <Button
          onPress={() => props.navigation.replace("HomeTabs")}
          title="View Application"
          containerStyle={{
            marginVertical: 15,
            width: 224,
          }}
          buttonStyle={{ backgroundColor: "#00425F" }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  contentContainer: {
    width: "90%",
    alignSelf: "center",
    flex: 1,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    borderWidth: 1,
    borderColor: "#479FC8",
    height: 56,
    borderRadius: 8,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
  },
  buttonText: {
    color: "#479FC8",
    fontFamily: FONT_FAMILY_BODY,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  descText: {
    color: "#9CA3AF",
    fontFamily: FONT_FAMILY_BODY,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
    width: 269.27,
  },
  titeText: {
    color: "#19191B",
    fontFamily: FONT_FAMILY_BODY,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "600",
    textAlign: "center",
  },
  infoDescText: {
    color: "#5F738C",
    fontFamily: FONT_FAMILY_BODY,
    fontSize: 18,
    lineHeight: 21.6,
    fontWeight: "400",
    textAlign: "center",
    marginTop: 5,
  },
});

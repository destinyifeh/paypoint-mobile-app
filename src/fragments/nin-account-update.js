import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import RBSheet from "react-native-raw-bottom-sheet";

import cbnImage from "../assets/media/images/cbn-image.png";
import {
  FONT_FAMILY_BODY,
  FONT_FAMILY_BODY_BOLD,
  FONT_SIZE_MID,
} from "../constants/styles";
const deviceHeight = Dimensions.get("window").height;
export default function NINAccountUpdate({ ref_, requestClose, navigation }) {
  return (
    <RBSheet
      animationType="fade"
      closeOnDragDown={true}
      closeOnPressMask={false}
      closeOnPressBack={false}
      duration={250}
      height={deviceHeight * 0.4}
      //onClose={this.onCancelConfirmation}
      ref={ref_}
      customStyles={{
        container: {
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        },
      }}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.clearContainer}
          onPress={() => requestClose()}
        >
          <Icon type="" name="clear" size={20} color="grey" />
        </TouchableOpacity>
        <View style={{ width: "85%", alignSelf: "center" }}>
          <Image
            source={cbnImage}
            resizeMode="contain"
            style={{ alignSelf: "center", marginBottom: 16 }}
          />
          <Text style={styles.mainText}>Account Update</Text>

          <Text style={styles.descText}>
            Your account will be restricted if you do not update your info by
            march 1st
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate("NinIdInformation", {
              isNinAccountUpdate: true,
            }),
              requestClose();
          }}
        >
          <Text style={styles.buttonText}>Update Now</Text>
        </TouchableOpacity>
      </View>
    </RBSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignSelf: "center",
    paddingVertical: 10,
    marginBottom: 10,
  },
  descText: {
    color: "#5F738C",
    fontFamily: FONT_FAMILY_BODY,
    fontSize: FONT_SIZE_MID,
    lineHeight: 20,
    textAlign: "center",
  },
  mainText: {
    color: "#353F50",
    fontFamily: FONT_FAMILY_BODY_BOLD,
    // fontSize:FONT_SIZE_TITLE,
    fontSize: 20,
    lineHeight: 32,
    textAlign: "center",
  },
  button: {
    height: 56,
    backgroundColor: "#00425F",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },
  buttonText: {
    color: "white",
    lineHeight: 24,
    fontSize: 16,
  },
  clearContainer: {
    backgroundColor: "#F3F5F6",

    width: 24,
    height: 24,
    alignSelf: "flex-end",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});

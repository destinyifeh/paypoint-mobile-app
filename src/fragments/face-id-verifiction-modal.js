import React from "react";
import { Image, Modal, StyleSheet, View } from "react-native";
import Button from "../components/button";
import Text from "../components/text";
import { COLOUR_BLUE } from "../constants/styles";

const STEPS = [
  { name: "Ensure you are in a well lit area" },
  { name: "Make sure you are in front of a plain background" },
  {
    name:
      "Make sure to remove hats, thick glasses or anything else that might blur your face",
  },
  { name: "Make sure you keep your expressions neutral" },
];

const FaceIdVerificationModal = (props) => {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.visible}
        onRequestClose={props.onRequestClose}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ flexDirection: "column" }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.header} bold black>
                  Face ID Verification
                </Text>
              </View>
              <View style={{ flexDirection: "row", marginVertical: 10 }}>
                <Text>
                  Ensure your camera is steady and your face fits into the shape
                </Text>
              </View>
            </View>

            {STEPS.map((step, index) => (
              <View
                key={index}
                style={{ flexDirection: "row", marginVertical: 10 }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={require("../assets/media/icons/Frame.png")}
                    style={{ width: 13, height: 13 }}
                  />
                </View>
                <View style={{ paddingStart: 5 }}>
                  <Text>{step.name}</Text>
                </View>
              </View>
            ))}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: 15,
                paddingHorizontal: 10,
              }}
            >
              <Button
                onPress={props.proceed}
                title="Proceed"
                buttonStyle={{ backgroundColor: COLOUR_BLUE }}
                containerStyle={{ backgroundColor: COLOUR_BLUE, width: "100%" }}
                loading={props.isLoading}
                disabled={props.isLoading}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FaceIdVerificationModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    marginHorizontal: 10,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "left",
  },
  header: {
    fontSize: 20,
    textAlign: "left",
    fontWeight: "bold",
  },
});

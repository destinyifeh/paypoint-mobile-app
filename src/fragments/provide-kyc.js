import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import Button from "../components/button";
import Text from "../components/text";
import {
  COLOUR_BLACK,
  COLOUR_BLUE,
  COLOUR_LINK_BLUE,
  COLOUR_OFF_WHITE,
  FONT_FAMILY_BODY_BOLD,
} from "../constants/styles";

const ProvideKycModal = (props) => {
  return (
    <View style={styles.centeredView}>
      <Modal
        ref={props.ProvideKycModalRef}
        animationType="slide"
        transparent={true}
        visible={props.showprovideKycModal}
        onRequestClose={() => {
          //   props.updateCbnPromptModal();
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ flexDirection: "column" }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={styles.header} bold black>
                  Complete your KYC{" "}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 10,
                alignItems: "center",
                justifyContent: "center",
                paddingTop: 20,
              }}
            >
              <Text style={{ textAlign: "center" }}>
                {" "}
                Please provide your complete KYC documentation so you can
                continue transacting.
              </Text>
            </View>

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
                onPress={props.onPressNext}
                title="Provide your KYC"
                buttonStyle={{ backgroundColor: COLOUR_BLUE }}
                containerStyle={{
                  backgroundColor: COLOUR_BLUE,
                  width: "100%",
                }}
              />
            </View>
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
                onPress={props.onSkip}
                title="Skip"
                buttonStyle={{
                  backgroundColor: COLOUR_OFF_WHITE,
                  borderRadius: 2,
                }}
                containerStyle={{
                  backgroundColor: COLOUR_OFF_WHITE,
                  width: "100%",
                  borderRadius: 2,
                }}
                titleStyle={{
                  color: COLOUR_BLACK,
                }}
              />
            </View>

            <View
              style={{
                paddingVertical: 20,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text>Don't have your KYC?</Text>
              <TouchableOpacity onPress={props.onLogout}>
                <Text
                  style={{
                    color: COLOUR_LINK_BLUE,
                    fontSize: 16,
                    marginLeft: 3,
                    fontFamily: FONT_FAMILY_BODY_BOLD,
                  }}
                >
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProvideKycModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 20,
  },
  modalView: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    paddingHorizontal: 20,
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
    textAlign: "center",
  },
  header: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
});

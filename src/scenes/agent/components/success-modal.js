import LottieView from "lottie-react-native";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Alert, Modal, StyleSheet, View } from "react-native";
import Button from "../../../components/button";
import Text from "../../../components/text";
import { COLOUR_BLUE } from "../../../constants/styles";

// eslint-disable-next-line react/display-name
const CbnKycSuccessConfirmationModal = forwardRef(
  (props, CbnKycSuccessConfirmationRef) => {
    const [visible, setVisible] = useState(true);

    // const animationRef = React.createRef<LottieView>(null);
    const lottieRef = useRef(null);

    useEffect(() => {
      // if (lottieRef.current) {
      //   lottieRef.current.playAnimation();
      // }
    }, []);

    const onPressNext = () => {
      setVisible(false);
      props.navigation.replace("Agent");
    };

    useImperativeHandle(CbnKycSuccessConfirmationRef, () => ({
      playAnimation: () => {
        if (lottieRef.current) {
          lottieRef.current.play();
        }
      },
      resetAnimation: () => {
        if (lottieRef.current) {
          lottieRef.current.reset();
        }
      },
      open: () => {
        console.log("Modal Open Method Called");
        setVisible(true);
      },
      close: () => {
        console.log("Modal Close Method Called");
        setVisible(false);
      },
    }));

    return (
      <View style={styles.centeredView}>
        <Modal
          ref={CbnKycSuccessConfirmationRef}
          animationType="slide"
          transparent={true}
          visible={visible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setVisible(false);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={{ flexDirection: "column" }}>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: 20,
                    flexDirection: "column",
                  }}
                >
                  <React.Fragment>
                    <LottieView
                      autoPlay={true}
                      loop={false}
                      ref={lottieRef}
                      style={{ height: 120, width: 120 }}
                      source={props.source}
                    />
                  </React.Fragment>

                  <View>
                    <Text bold style={styles.textStyle}>{props.successMessage}</Text>
                  </View>

                  <View style={{ paddingTop: 20 }}>
                    <Text
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {props.message}
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: 15,
                  paddingHorizontal: 10,
                  paddingBottom: 30
                }}
              >
                <Button
                  onPress={onPressNext}
                  title="OKAY"
                  buttonStyle={{ backgroundColor: COLOUR_BLUE }}
                  containerStyle={{
                    backgroundColor: COLOUR_BLUE,
                    width: "100%",
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
);

export default CbnKycSuccessConfirmationModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  modalView: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    paddingHorizontal: 10,
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
    fontSize: 20
  },
  header: {
    fontSize: 20,
    textAlign: "left",
    fontWeight: "bold",
  },
});

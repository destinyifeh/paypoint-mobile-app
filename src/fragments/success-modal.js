import LottieView from "lottie-react-native";
import React from "react";
import { Dimensions, Image, View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import Button from "../components/button";
import Text from "../components/text";
import {
  COLOUR_BLUE,
  COLOUR_LINK_BLUE,
  COLOUR_OFF_WHITE,
  COLOUR_WHITE,
} from "../constants/styles";
const height = Dimensions.get("window").height;

export default class SuccessModal extends React.Component {
  constructor() {
    super();
    this.state = {
      expand: null,
      isLoading: false,
      isBasic: false,
      email: "",
      bottomSheetVisible: false,
    };
  }

  componentDidMount() {}
  render() {
    const {
      successConfRef,
      navigation,
      message,
      source,
      successMessage,
      screen1,
      onClosePress,
      show,
      buttonTitle1,
      buttonTitle2,
      screen2,
      onPressDone1,
      show2,
    } = this.props;

    // const onPressDone1 = () => {
    //   navigation.replace(screen1);
    //   onClosePress();
    // };

    const onPressDone2 = () => {
      navigation.replace(screen2);
      onClosePress();
    };
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <RBSheet
          ref={successConfRef}
          onOpen={() => {
            this.animation.play();
          }}
          animationType="slide"
          height={height}
          customStyles={{
            container: {
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            },
          }}
        >
          <View style={{ flexDirection: "column" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "flex-end",
                padding: 20,
              }}
            />
            <View />

            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                justifyContent: "center",
                paddingTop: -30,
                marginTop: -30,
              }}
            >
              <Image
                width={10}
                height={10}
                source={require("../assets/media/images/interswitch-logo.png")}
              />
            </View>

            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 150,
                flexDirection: "column",
              }}
            >
              {/* <Image
                source={require("../assets/media/images/confirmation-animation.png")}
                width={80}
                height={80}
              /> */}

              <React.Fragment>
                <LottieView
                  autoPlay={true}
                  loop={false}
                  ref={(animation) => {
                    this.animation = animation;
                  }}
                  style={{ height: 120, width: 120 }}
                  source={source}
                />
              </React.Fragment>

              {/* {this.state.bottomSheetVisible && (
                <React.Fragment>
                  <LottieView
                    autoPlay={true}
                    loop={true}
                    ref={(animation) => {
                      this.animation = animation;
                    }}
                    style={{ flex: 1, height: 80, width: 80 }}
                    source={require("../animations/LYRPbfvcWm-upgrade-success.json")}
                  />
                </React.Fragment>
              )} */}

              <View>
                <Text
                  style={{
                    fontSize: 20,
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                  bold
                  black
                >
                  {successMessage}
                </Text>
              </View>

              <View style={{ paddingTop: 20, paddingHorizontal: 20 }}>
                <Text
                  style={{
                    textAlign: "center",
                  }}
                >
                  {message}
                </Text>
              </View>
            </View>

            <View
              style={{
                paddingHorizontal: 20,
                marginHorizontal: 20,
                paddingTop: 20,
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: 15,
                  paddingHorizontal: 10,
                }}
              >
                {show ? (
                  <>
                    <Button
                      onPress={onPressDone1}
                      title={buttonTitle1}
                      loading={this.state.isLoading}
                      buttonStyle={{ backgroundColor: COLOUR_BLUE }}
                      containerStyle={{
                        backgroundColor: COLOUR_BLUE,
                        width: "100%",
                      }}
                      titleStyle={{
                        color: COLOUR_WHITE,
                        textTransform: "capitalize",
                      }}
                    />
                  </>
                ) : (
                  <></>
                )}
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
                {show2 && (
                  <Button
                    onPress={onPressDone2}
                    title={buttonTitle2}
                    buttonStyle={{
                      backgroundColor: COLOUR_OFF_WHITE,
                      borderRadius: 4,
                      borderRadiusColor: COLOUR_BLUE,
                    }}
                    containerStyle={{
                      backgroundColor: COLOUR_OFF_WHITE,
                      width: "100%",
                      borderRadius: 4,
                      borderRadiusColor: COLOUR_BLUE,
                    }}
                    titleStyle={{
                      color: COLOUR_LINK_BLUE,
                      textTransform: "capitalize",
                    }}
                  />
                )}
              </View>
            </View>
          </View>
        </RBSheet>
      </View>
    );
  }
}

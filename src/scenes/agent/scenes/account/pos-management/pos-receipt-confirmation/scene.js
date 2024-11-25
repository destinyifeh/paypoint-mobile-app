import React from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import Button from "../../../../../../components/button";
import FormInput from "../../../../../../components/form-controls/form-input";
import H1 from "../../../../../../components/h1";
import Header from "../../../../../../components/header";
import Modal from "../../../../../../components/modal";
import {
  COLOUR_BLUE,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_FAMILY_BODY_SEMIBOLD,
  FONT_SIZE_MID,
  FONT_SIZE_TEXT_INPUT,
} from "../../../../../../constants/styles";
import Platform from "../../../../../../services/api/resources/platform";
import UserManagement from "../../../../../../services/api/resources/user-management";

export default class PosReceiptConfirmationScene extends React.Component {
  userManagement = new UserManagement();
  platform = new Platform();
  state = {
    searchTerm: "",
    search: false,
    devicDetails: null,
    showSuccessModal: false,
    showConfirmationModal: false,
    posRequestStockId: null,
    showProceedButton: false,
    posRequestId: null,
  };

  async sendRequest() {
    this.setState({
      isLoading: true,
    });
    if (this.state.devicDetails?.workflowType === "pos_request") {
      const { code, response } = await this.userManagement.confirmPOSDelivery(
        this.state.searchTerm
      );
      if (code == "200") {
        this.setState({
          isLoading: false,
          search: true,
          showSuccessModal: true,
          responseMessage: response.description,
        });
      } else if (code == "403") {
        this.setState({
          isLoading: false,
          search: true,
        });
        Alert.alert(
          "Unauthorised",
          "You are not allowed to perform this action for the entered request"
        );
      } else if (code == "404") {
        this.setState({
          isLoading: false,
          search: true,
        });
        Alert.alert("Not Found", response.description);
      } else {
        this.setState({
          isLoading: false,
          search: true,
        });
        Alert.alert(
          "Operation failed",
          "Something went wrong. Please try again"
        );
      }
    } else {
      let res;
      if (this.state.posRequestStockId !== null) {
        res = await this.userManagement.confirmPOSDelivery(
          this.state.posRequestStockId
        );
      }
      // if (this.state.posRequestId !== null) {
      //   res = await this.userManagement.confirmAllPOSDeliveryRequest(
      //     this.state.posRequestId
      //   );
      // }

      const { code, response } = res;
      if (code == "200") {
        this.setState({
          isLoading: false,
          search: true,
          showSuccessModal: true,
          responseMessage: response.description,
        });
      } else if (code == "403") {
        this.setState({
          isLoading: false,
          search: true,
        });
        Alert.alert(
          "Unauthorised",
          "You are not allowed to perform this action for the entered request"
        );
      } else if (code == "404") {
        this.setState({
          isLoading: false,
          search: true,
        });
        Alert.alert("Not Found", response.description);
      } else {
        this.setState({
          isLoading: false,
          search: true,
        });
        Alert.alert(
          "Operation failed",
          "Something went wrong. Please try again"
        );
      }
    }
  }

  async searchAgentData(searchTerm, refresh = 0) {
    if (this.state.isLoading) return;
    this.setState({
      isLoading: true,
    });
    const {
      code,
      response,
    } = await this.userManagement.getPosRequestAwaitingDelivery(searchTerm);
    if (code == "404" && refresh == 0) {
      this.setState({
        // didErrorOccurWhileLoading: true,
        isLoading: false,
        search: false,
      });
      Alert.alert("Not Found", "No record found for the selected ID");
      return;
    }
    if (code == "404" && refresh !== 0) {
      this.setState({
        // didErrorOccurWhileLoading: true,
        isLoading: false,
        search: false,
      });
      Alert.alert("Not Found", "All devices successfully confirmed");
      return;
    }
    if (code == "403") {
      this.setState({
        // didErrorOccurWhileLoading: true,
        isLoading: false,
        search: false,
      });
      Alert.alert(response.description);
      return;
    }

    this.setState({
      isLoading: false,
      search: true,
      showProceedButton: true,
      devicDetails: response.data,
    });
  }

  get confirmationModal() {
    return (
      <Modal
        buttons={[
          {
            onPress: () => {
              this.setState({ showConfirmationModal: false });
              this.sendRequest();
            },
            buttonStyle: {
              paddingHorizontal: 10,
            },
            containerStyle: {
              paddingHorizontal: 10,
              width: "40%",
            },
            title: "Confirm",
          },
          {
            containerStyle: {
              width: "2%",
              backgroundColor: "white",
            },
          },
          {
            onPress: () => {
              this.setState({ showConfirmationModal: false });
            },
            buttonStyle: {
              paddingHorizontal: 10,
            },
            containerStyle: {
              paddingHorizontal: 10,
              width: "40%",
              backgroundColor: "#999999",
            },
            title: "Cancel",
          },
        ]}
        content={
          <View
            style={{
              flex: 0.6,
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <Text big center style={{ textAlign: "center" }}>
              Kindly confirm that the POS received matches the request ID you
              have entered
            </Text>
          </View>
        }
        isModalVisible={true}
        size="md"
        title="POS Confirmation"
        withButtons
        hideCloseButton
      />
    );
  }

  get successModal() {
    return (
      <Modal
        buttons={[
          {
            onPress: () => {
              this.setState({ showSuccessModal: false, devicDetails: null });
              // this.searchAgentData(this.state.searchTerm, 1);
            },
            buttonStyle: {
              paddingHorizontal: 10,
            },
            containerStyle: {
              paddingHorizontal: 10,
              width: "100%",
            },
            title: "Okay",
          },
        ]}
        content={
          <View
            style={{
              flex: 0.6,
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <Text big center style={{ textAlign: "center" }}>
              Your POS device has been confirmed
            </Text>
          </View>
        }
        image={require("../../../../../../assets/media/images/clap.png")}
        isModalVisible={true}
        size="md"
        title="POS Confirmed"
        withButtons
        hideCloseButton
      />
    );
  }

  render() {
    const screenContent = () => {
      return (
        <>
          {this.state.showSuccessModal && this.successModal}
          {this.state.showConfirmationModal && this.confirmationModal}
          {this.state.devicDetails !== null && (
            <>
              <View>
                <H1 style={{ fontSize: FONT_SIZE_MID, marginVertical: 5 }}>
                  Agent Name
                </H1>
                <Text
                  style={{
                    fontSize: FONT_SIZE_TEXT_INPUT,
                    fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                    marginBottom: 5,
                  }}
                >
                  {this.state.devicDetails?.nextOwnerName}
                </Text>
              </View>

              <View>
                <H1 style={{ fontSize: FONT_SIZE_MID, marginVertical: 5 }}>
                  Phone Number
                </H1>
                <Text
                  style={{
                    fontSize: FONT_SIZE_TEXT_INPUT,
                    fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                    marginBottom: 5,
                  }}
                >
                  {this.state.devicDetails?.nextTerminalOwner}
                </Text>
              </View>

              <View>
                <H1 style={{ fontSize: FONT_SIZE_MID, marginVertical: 5 }}>
                  Terminal Name
                </H1>
                <Text
                  style={{
                    fontSize: FONT_SIZE_TEXT_INPUT,
                    fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                    marginBottom: 5,
                  }}
                >
                  {this.state.devicDetails?.terminalModel}
                </Text>
              </View>

              <Button
                onPress={() =>
                  this.setState({
                    showConfirmationModal: true,
                    posRequestStockId: this.state.devicDetails?.requestId,
                  })
                }
                title="CONFIRM"
                buttonStyle={{
                  backgroundColor: COLOUR_BLUE,
                }}
                containerStyle={{
                  backgroundColor: COLOUR_BLUE,
                  marginVertical: 30,
                }}
              />
            </>
          )}
        </>
      
      );
    };
    return (
      <View
        style={{
          backgroundColor: "#F3F3F4",
          flex: 1,
        }}
      >
        <Header
          containerStyle={{
            backgroundColor: COLOUR_BLUE,
          }}
          navigationIconColor={COLOUR_WHITE}
          leftComponent={
            <Icon
              color={COLOUR_RED}
              underlayColor="transparent"
              name="chevron-left"
              size={40}
              type="material"
              onPress={() => this.props.navigation.replace("POSManagement")}
            />
          }
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          statusBarProps={{
            backgroundColor: "transparent",
            barStyle: CONTENT_LIGHT,
          }}
          title="POS Remap Confirmation"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: "bold",
          }}
        />

        <View
          style={{
            padding: 30,
          }}
        >
          <FormInput
            hideOptionalLabel
            outerContainerStyle={{
              marginBottom: 5,
              borderBottomColor: "red",
            }}
            innerContainerStyle={{
              elevation: 5,
              marginBottom: 5,
            }}
            rightIconName="search"
            rightIconParams={this.state.searchTerm}
            rightIconOnpress={() => {
              this.state.searchTerm === ""
                ? Alert.alert("Validation Error", "Field cannot be empty!")
                : this.searchAgentData(this.state.searchTerm);
            }}
            onChangeText={(searchTerm) => this.setState({ searchTerm })}
            placeholder="Enter Request ID"
          />
          {this.state.isLoading ? <ActivityIndicator /> : screenContent()}
        </View>
      </View>
    );
  }
}

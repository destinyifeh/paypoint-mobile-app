import React from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import Button from "../../../../../../../components/button";
import FormInput from "../../../../../../../components/form-controls/form-input";
import H1 from "../../../../../../../components/h1";
import Header from "../../../../../../../components/header";
import Modal from "../../../../../../../components/modal";
import {
  COLOUR_BLUE,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_FAMILY_BODY_SEMIBOLD,
  FONT_SIZE_BIG,
  FONT_SIZE_TEXT_INPUT
} from "../../../../../../../constants/styles";
import Platform from "../../../../../../../services/api/resources/platform";
import UserManagement from "../../../../../../../services/api/resources/user-management";


export default class PosRemapNewAgentScreenScene extends React.Component {
  platform = new Platform();
  usermanagement = new UserManagement();
  
  state = {
    searchTerm: "",
    search: false,
    agent: null,
    posDevice: null,
    showSuccessModal: false,
    showConfirmationModal: false
  };

  
  constructor(props) {
    super(props);

    this.state = {
      posDevice: props.navigation.state.params.posDevice,
    };

  }


  async sendRequest() {
    
    this.setState({
      isLoading: true
    });

    const payload = {
      "currentTerminalOwner": this.state.posDevice.businessMobile,
      "deviceId": this.state.posDevice.deviceid,
      "nextOwnerBusinessAddress": this.state.agent.businessLocation.addressLine1,
      "nextOwnerState": this.state.agent.businessLocation.state,
      "nextTerminalOwner": this.state.agent.agentMobileNo,
      "reasonForRemaping": "NA",
      "remapRequestType": "free",
      "terminalName": this.state.posDevice.deviceName,
      "unitPrice": 0
    }
    const { code, response } = await this.usermanagement.requestPOSRemapping(payload);

    if (code == "404") {
      this.setState({
        didErrorOccurWhileLoading: true,
        isLoading: false,
        search: false
      });
      Alert.alert("Not Found", "Records not found")
      return
    }else if(code=="202"){
      this.setState({
        isLoading: false,
        search: true,
        showSuccessModal: true,
        responseMessage: response.description
      });
    }
    else if(code=="400"){
      this.setState({
        isLoading: false,
        search: true,
      });
      Alert.alert("Operation failed", "Invalid Request");
    }
    else{
      this.setState({
        isLoading: false,
        search: true,
      });
      Alert.alert("Operation failed", "Something went wrong. Please try again");
    }

  }
  

  async searchAgentData(searchTerm) {
    if(this.state.isLoading) return;
    this.setState({
      isLoading: true
    });

    const { code, response } = await this.platform.getAggregatorAgentsByPhone(searchTerm);

    if (code == "404") {
      this.setState({
        didErrorOccurWhileLoading: true,
        isLoading: false,
        search: false
      });
      Alert.alert("Not Found", "No record found.")
      return
    }
    this.setState({
      isLoading: false,
      search: true,
      agent: response.content[0]
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
            title: "Yes",
          },
          {
            containerStyle: {
              width: "2%",
              backgroundColor: 'white',
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
              backgroundColor: '#999999',
            },
            title: "Cancel",
          },
        ]}
        content={
          <View style={{ flex: 0.6, justifyContent: "center", alignContent: "center", }}>
            <Text big center style={{textAlign:"center"}}>
              Are you sure the information being provided is correct?
            </Text>
          </View>
        }
        isModalVisible={true}
        size="md"
        title="Agent Information"
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
              this.setState({ showSuccessModal: false });
              this.props.navigation.replace('POSManagement')
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
          <View style={{ flex: 0.6, justifyContent: "center", alignContent: "center", }}>
            <Text big center style={{textAlign:"center"}}>
              Your request for POS has been received, please check under Notifications to see 
              your request status
            </Text>
          </View>
        }
        image={require("../../../../../../../assets/media/images/clap.png")}
        isModalVisible={true}
        size="md"
        title="Request Submitted"
        withButtons
        hideCloseButton
      />
    );
  }

  render() {
    const screenContent = () => {
      return this.state.search && <>
        <ScrollView
        contentContainerStyle={{
        height: "75%",
      }}
          >
            {this.state.showConfirmationModal && this.confirmationModal}
            {this.state.showSuccessModal && this.successModal}
            <View>
              <H1 style={{ fontSize: FONT_SIZE_BIG, marginVertical: 10 }}>
                Name of Agent
              </H1>
              <Text
                style={{
                  fontSize: FONT_SIZE_TEXT_INPUT,
                  fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                  marginBottom: 10,
                }}
              >
                {`${this.state.agent.contact.firstname} ${this.state.agent.contact.middlename} ${this.state.agent.contact.lastname}`}
              </Text>
            </View>
            <View>
              <H1 style={{ fontSize: FONT_SIZE_BIG, marginVertical: 10 }}>
                Phone Number
              </H1>
              <Text
                style={{
                  fontSize: FONT_SIZE_TEXT_INPUT,
                  fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                  marginBottom: 10,
                }}
              >
                {this.state.agent.contact.phoneNo}
              </Text>
            </View>
            <View>
              <H1 style={{ fontSize: FONT_SIZE_BIG, marginVertical: 10 }}>
                Email Address
              </H1>
              <Text
                style={{
                  fontSize: FONT_SIZE_TEXT_INPUT,
                  fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                  marginBottom: 10,
                }}
              >
                {this.state.agent.businessEmail}
              </Text>
            </View><View>
              <H1 style={{ fontSize: FONT_SIZE_BIG, marginVertical: 10 }}>
                Agent Address
              </H1>
              <Text
                style={{
                  fontSize: FONT_SIZE_TEXT_INPUT,
                  fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                  marginBottom: 10,
                }}
              >
                {this.state.agent.businessLocation.addressLine1}
              </Text>
            </View>
            <View>
              <H1 style={{ fontSize: FONT_SIZE_BIG, marginVertical: 10 }}>
                Terminal Location
              </H1>
              <Text
                style={{
                  fontSize: FONT_SIZE_TEXT_INPUT,
                  fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                  marginBottom: 10,
                }}
              >
                {this.state.agent.businessLocation.addressLine1}
              </Text>
            </View>
          </ScrollView>

          <Button
            onPress={() => this.setState({showConfirmationModal:true})}
            title="SUBMIT REQUEST"
            buttonStyle={{ backgroundColor: COLOUR_BLUE }}
          />
      </>
    }
    
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
              onPress={() => this.props.navigation.goBack()}
            />
          }
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          statusBarProps={{
            backgroundColor: "transparent",
            barStyle: CONTENT_LIGHT,
          }}
          title="Agent to Map"
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
              marginBottom: 10,
              borderBottomColor: "red",
            }}
            innerContainerStyle={{
              elevation: 5,
              marginBottom: 10,
            }}
            rightIconName="search"
            rightIconParams={this.state.searchTerm}
            rightIconOnpress={() => {
              this.state.searchTerm === ""
                ? Alert.alert("Validation Error", "Field cannot be empty!")
                : this.searchAgentData(this.state.searchTerm);
            }}
            // inputStyle={{elevation: 50, borderWidth: 1, borderColor: "yellow"}}
            onChangeText={(searchTerm) => this.setState({ searchTerm })}
            placeholder="Agent's phone number....."
          /> 
          
          {this.state.isLoading
            ? <ActivityIndicator /> 
            : screenContent()
          }

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  formInputInnerContainerStyle: {
    marginTop: -10,
    // backgroundColor: "red",
  },
  formInputOuterContainerStyle: {
    // marginBottom: 2
    marginTop: -15,
    // backgroundColor: "yellow",
    width: "100%",
  },
});

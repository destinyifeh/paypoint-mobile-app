import React from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import Button from "../../../../../components/button";
import ClickableListItem from "../../../../../components/clickable-list-item";
import FormInput from "../../../../../components/form-controls/form-input";
import H1 from "../../../../../components/h1";
import Header from "../../../../../components/header";
import {
  COLOUR_BLUE,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_FAMILY_BODY_SEMIBOLD,
  FONT_SIZE_BIG,
  FONT_SIZE_TEXT_INPUT
} from "../../../../../constants/styles";
import UserManagement from "../../../../../services/api/resources/user-management";


export default class PosRemapScene extends React.Component {

  userManagement = new UserManagement();


  state = {
    searchTerm: "",
    search: false,
    device: null
  };

  async searchTerminalData(searchTerm) {
    if (this.state.isLoading) return;
    this.setState({
      isLoading: true
    });

    const { code, response } = await this.userManagement.getAggregatorAgentsByTerminalId(searchTerm);

    if (code == "404") {
      this.setState({
        didErrorOccurWhileLoading: true,
        isLoading: false,
        search: false
      });
      Alert.alert("Not Found", "No record found for the selected terminal")
      return
    }
    else if (code != "200") {
      this.setState({
        isLoading: false
      });
      Alert.alert("Oops", "Something went wrong");
    } else {
      this.setState({
        isLoading: false,
        search: true,
        device: response.data
      });
    }
  }

  renderItem(item, index) {
    return (
      <ClickableListItem
        key={index}
        onPressOut={() => this.props.navigation.navigate(item.href)}
        style={{
          backgroundColor: "white",
          flexDirection: "row",
          marginBottom: 1,
        }}
      >
        <View
          style={{ flex: 0.8, justifyContent: "space-evenly", paddingLeft: 20 }}
        >
          <Text black>{item.name}</Text>
        </View>

        <View
          style={{
            alignItems: "center",
            flex: 0.2,
            justifyContent: "center",
          }}
        >
          <Icon
            name="chevron-right"
            color={"#B4B7BF"}
            type="material"
            size={50}
          />
        </View>
      </ClickableListItem>
    );
  }

  renderSectionHeader(item) {
    return (
      <Text style={{ lineHeight: 32, marginLeft: 10, marginTop: 30 }}>
        {item}
      </Text>
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
          <View>
            <H1 style={{ fontSize: FONT_SIZE_BIG, marginVertical: 10 }}>
              Agent Name
            </H1>
            <Text
              style={{
                fontSize: FONT_SIZE_TEXT_INPUT,
                fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                marginBottom: 10,
              }}
            >
              {`${this.state.device.firstName} ${this.state.device.lastName}`}
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
              {this.state.device.businessMobile}
            </Text>
          </View>
          <View>
            <H1 style={{ fontSize: FONT_SIZE_BIG, marginVertical: 10 }}>
              Business Name
            </H1>
            <Text
              style={{
                fontSize: FONT_SIZE_TEXT_INPUT,
                fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                marginBottom: 10,
              }}
            >
              {this.state.device.businessName}
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
              {this.state.device.email}
            </Text>
          </View>
          <View>
            <H1 style={{ fontSize: FONT_SIZE_BIG, marginVertical: 10 }}>
              Device Name
            </H1>
            <Text
              style={{
                fontSize: FONT_SIZE_TEXT_INPUT,
                fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                marginBottom: 10,
              }}
            >
              {this.state.device.deviceName}
            </Text>
          </View>
          <View>
            <H1 style={{ fontSize: FONT_SIZE_BIG, marginVertical: 10 }}>
              Device Os
            </H1>
            <Text
              style={{
                fontSize: FONT_SIZE_TEXT_INPUT,
                fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                marginBottom: 10,
              }}
            >
              {this.state.device.deviceOs}
            </Text>
          </View>
        </ScrollView>

        <Button
          onPress={() => this.props.navigation.replace('PosRemapNewAgentScreen', {
            posDevice: this.state.device
          })}
          title="PROCEED"
          buttonStyle={{ backgroundColor: COLOUR_BLUE }}
        /></>
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
              onPress={() => this.props.navigation.replace('POSManagement')}
            />
          }
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          statusBarProps={{
            backgroundColor: "transparent",
            barStyle: CONTENT_LIGHT,
          }}
          title="POS Remap"
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
                : this.searchTerminalData(this.state.searchTerm);
            }}
            // inputStyle={{elevation: 50, borderWidth: 1, borderColor: "yellow"}}
            onChangeText={(searchTerm) => this.setState({ searchTerm })}
            placeholder="Search POS terminal ID....."
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

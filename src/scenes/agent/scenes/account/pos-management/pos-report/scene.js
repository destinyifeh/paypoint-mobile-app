import React from "react";
import { ActivityIndicator, Alert, FlatList, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import ClickableListItem from "../../../../../../components/clickable-list-item";
import FormInput from "../../../../../../components/form-controls/form-input";
import Header from "../../../../../../components/header";
import {
  COLOUR_BLUE, COLOUR_GREY, COLOUR_OFF_WHITE, COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT
} from "../../../../../../constants/styles";
import UserManagement from "../../../../../../services/api/resources/user-management";


export default class PosReportScene extends React.Component {

  userManagement = new UserManagement();

  state = {
    searchTerm: "",
    search: false,
    data: null,
    count: 0,
    isLoading: false
  };

  componentDidMount() {
    this.searchTerminalData();
  }


  async searchTerminalData() {
    if (this.state.isLoading) return;
    this.setState({
      isLoading: true
    });

    const requestId = this.state.searchTerm;
    let args = { "pageNumber": 1, "pageSize": 20 };
    if (requestId !== "") {
      args = { "requestId": requestId };
    }
    const { code, response } = await this.userManagement.searchPOSRemapRequests(args);

    if (code == "404") {
      this.setState({
        didErrorOccurWhileLoading: true,
        isLoading: false,
        search: false
      });
      Alert.alert("Not Found", "No record found")
      return
    }
    this.setState({
      isLoading: false,
      search: true,
      data: response.data,
      count: response.count
    });

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

  render() {

    const screenContent = () => {
      return this.state.count > 0 &&
        <ScrollView
          contentContainerStyle={{
            margin: 10,
            marginTop: 0,
            height: "86%"
          }}
        >
          {this.state.count > 0 &&
            <FlatList
              data={this.state.data}
              keyExtractor={(item, index) => item + index}
              renderItem={({ item, index }) => <DataRow {...item} key={index}
                onPressOut={() => this.props.navigation.navigate('PosReportView', {
                  data: item
                })} />}
            />
          }
        </ScrollView>
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
          title="POS Remap Report"
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
              borderBottomColor: "red",
            }}
            innerContainerStyle={{
              elevation: 5,
            }}
            rightIconName="search"
            rightIconParams={this.state.searchTerm}
            rightIconOnpress={() => {
              this.state.searchTerm === ""
                ? Alert.alert("Validation Error", "Field cannot be empty!")
                : this.searchTerminalData();
            }}
            onChangeText={(searchTerm) => this.setState({ searchTerm })}
            placeholder="Search by Request ID....."
          />
        </View>
        <View>
          {this.state.isLoading
            ? <ActivityIndicator />
            : screenContent()
          }
        </View>
      </View>
    );
  }

}


export class DataRow extends React.Component {

  render() {
    return <ClickableListItem
      onPressOut={this.props.onPressOut}
      style={{
        alignItems: 'center',
        backgroundColor: COLOUR_WHITE,
        borderBottomColor: COLOUR_OFF_WHITE,
        borderBottomWidth: 5,
        flex: 1,
        flexDirection: 'row',
        height: 60,
        justifyContent: 'space-between',
        padding: 15,
        paddingTop: 5,
        paddingBottom: 10
      }}
    >
      <View
        style={{
          alignItems: 'center',
          backgroundColor: COLOUR_BLUE,
          borderRadius: 17,
          height: 35,
          justifyContent: 'center',
          width: 35
        }}
      >
      </View>

      <View style={{
        flex: .75,
        height: '100%',
        justifyContent: 'space-evenly',
        marginVertical: 20,
      }}>
        <Text mid>Request ID:</Text>
        <Text bold title>{this.props.requestId}</Text>
      </View>

      <View style={{
        alignItems: 'flex-end',
        flex: .15,
      }}>
        <Icon
          color={COLOUR_GREY}
          name="chevron-right"
          size={32}
        />
      </View>
    </ClickableListItem>
  }
}

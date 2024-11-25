import React from "react";
import { Alert, AsyncStorage, FlatList, Image, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import ClickableListItem from "../../../../../../components/clickable-list-item";
import Header from "../../../../../../components/header";
import {
  COLOUR_BLUE, COLOUR_OFF_WHITE,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT
} from "../../../../../../constants/styles";
import UserManagement from "../../../../../../services/api/resources/user-management";

export default class PosRequestScene extends React.Component {
  userManagement = new UserManagement();

  state = {
    searchTerm: "",
    search: false,
    data: null,
    count: 0,
    isLoading: false,
  };

  componentDidMount() {
    // this.getAllPosRequests();
    this.getAllPosModels();
  }

  persistenceKey = "posModels";

  async getAllPosModels() {
    if (this.state.isLoading) return;
    this.setState({
      isLoading: true,
    });

    const { code, response } = await this.userManagement.getAllPosModels();

    // await AsyncStorage.setItem(
    //   this.persistenceKey,
    //   JSON.stringify(response.data)
    // );

    // console.log(response, "NUGAGEE POS MODELS");
    

    if (code == "404") {
      this.setState({
        didErrorOccurWhileLoading: true,
        isLoading: false,
        search: false,
      });
      // Alert.alert("Not Found", "No record found");
      return;
    }
     await AsyncStorage.setItem(
      this.persistenceKey,
      JSON.stringify(response.data)
    );
    this.setState({
      data: response.data,
      count: response.count,
    });
  }

  async getAllPosRequests() {
    if (this.state.isLoading) return;
    this.setState({
      isLoading: true,
    });

    // const requestId = this.state.searchTerm;
    // let args = { pageNumber: 1, pageSize: 20 };
    // if (requestId !== "") {
    //   args = { requestId: requestId };
    // }
    const { code, response } = await this.userManagement.getAllPosRequests();
    console.log(response, 'NUGAGEE MODELS')
    if (code == "404") {
      this.setState({
        didErrorOccurWhileLoading: true,
        isLoading: false,
        search: false,
      });
      Alert.alert("Not Found", "No record found");
      return;
    }
    this.setState({
      isLoading: false,
      search: true,
      data: response.data,
      count: response.count,
    });
  }



  render() {
    const screenContent = () => {
      return (
        this.state.count > 0 && (
          <ScrollView
            contentContainerStyle={{
              margin: 10,
              marginTop: 0,
              height: "86%",
            }}
          >
            {/* {this.state.count > 0 && ( */}
              <FlatList
                data={this.state.data}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item, index }) => (
                  <DataRow
                    {...item}
                    key={index}
                    // onPressOut={() =>
                    //   this.props.navigation.navigate("PosReportView", {
                    //     data: item,
                    //   })
                    // }
                  />
                )}
              />
            {/* )} */}
          </ScrollView>
        )
      );
    };

    return (
      <View
        style={{
          backgroundColor: COLOUR_WHITE,
          // backgroundColor: "#F3F3F4",
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
          title="POS Requests"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: "bold",
          }}
          rightComponent
        />

        <View
          style={{
            padding: 30,
            paddingBottom: 10,
          }}
        >
          {/* <FormInput
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
            placeholder="Search brands name, product items"
          /> */}
          <ClickableListItem
            // onPressOut={() =>
            //   Alert.alert("Validation Error", "Field cannot be empty!")
            // }
            onPressOut={() => this.props.navigation.navigate('PosRequestDetailsScene')}
            style={{
              alignItems: "center",
              backgroundColor: COLOUR_WHITE,
              borderBottomColor: COLOUR_OFF_WHITE,
              borderBottomWidth: 3,
              flex: 1,
              flexDirection: "row",
              height: 150,
              justifyContent: "space-between",
              padding: 25,
              // paddingTop: 5,
              // paddingBottom: 10,
            }}
          >

            <View
              style={{
                flex: 0.75,
                height: "100%",
                justifyContent: "space-evenly",
                marginVertical: 20,
              }}
            >
              <Text mid style={{ color: COLOUR_BLUE }}>
                New Request
              </Text>
            </View>

            <View
              style={{
                alignItems: "flex-end",
                flex: 0.15,
              }}
            >
              <Icon
                color={COLOUR_BLUE}
                name="add"
                size={32}
                // onPress={() => Alert.alert("Validation Error", "Field cannot be empty!")}
              />
            </View>
          </ClickableListItem>
        </View>
        {/* <ScrollView
          contentContainerStyle={{
            margin: 30,
            marginTop: 40,
            paddingBottom: 60,
          }}
        >
          <ClickableListItem
            onPressOut={this.props.onPressOut}
            style={{
              borderColor: COLOUR_OFF_WHITE,
              borderWidth: 2,
              height: 170,
              marginBottom: 10,
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                height: 40,
                backgroundColor: "#00ACDE",
                justifyContent: "center",
              }}
            >
              <Text bold title style={{ color: COLOUR_WHITE, padding: 15 }}>
                R225117766
              </Text>
            </View>
            <View
              onPressOut={this.props.onPressOut}
              style={{
                alignItems: "center",
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 15,
              }}
            >
              <View
                style={{
                  flex: 0.75,
                  justifyContent: "space-evenly",
                  marginVertical: 10,
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 10,
                    width: "75%",
                  }}
                >
                  <Text mid style={{ color: "#00425F" }}>
                    Model 1050tx
                  </Text>
                  <Text mid style={{ color: "#00425F" }}>
                    Linux
                  </Text>
                </View>
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 25,
                    width: "75%",
                    marginBottom: 15,
                  }}
                >
                  <Text mid style={{ color: "#00425F" }}>
                    Approval Status :
                  </Text>
                  <Text mid style={{ color: "green" }}>
                    Approved
                  </Text>
                </View>
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    paddingVertical: 15,
                    width: "75%",
                  }}
                >
                  <Text bold title style={{ color: "#00425F" }}>
                    More details{" "}
                  </Text>
                  <Icon color="#00425F" name="chevron-right" size={22} />
                </View>
              </View>

              <View
                style={{
                  alignItems: "flex-end",
                  flex: 0.5,
                  marginVertical: 5,
                  height: "130%",
                  width: "90%",
                }}
              >
                <Image
                  source={require("./pos.png")}
                  style={{
                    resizeMode: "center",
                    width: "100%",
                    height: "100%",
                  }}
                />
              </View>
            </View>
          </ClickableListItem>
          <ClickableListItem
            onPressOut={this.props.onPressOut}
            style={{
              borderColor: COLOUR_OFF_WHITE,
              borderWidth: 2,
              height: 170,
              marginBottom: 10,
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                height: 40,
                backgroundColor: "#00ACDE",
                justifyContent: "center",
              }}
            >
              <Text bold title style={{ color: COLOUR_WHITE, padding: 15 }}>
                R225117766
              </Text>
            </View>
            <View
              onPressOut={this.props.onPressOut}
              style={{
                alignItems: "center",
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 15,
              }}
            >
              <View
                style={{
                  flex: 0.75,
                  justifyContent: "space-evenly",
                  marginVertical: 10,
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 10,
                    width: "75%",
                  }}
                >
                  <Text mid style={{ color: "#00425F" }}>
                    Model 1050tx
                  </Text>
                  <Text mid style={{ color: "#00425F" }}>
                    Linux
                  </Text>
                </View>
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 25,
                    width: "75%",
                    marginBottom: 15,
                  }}
                >
                  <Text mid style={{ color: "#00425F" }}>
                    Approval Status :
                  </Text>
                  <Text mid style={{ color: "green" }}>
                    Approved
                  </Text>
                </View>
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    paddingVertical: 15,
                    width: "75%",
                  }}
                >
                  <Text bold title style={{ color: "#00425F" }}>
                    More details{" "}
                  </Text>
                  <Icon color="#00425F" name="chevron-right" size={22} />
                </View>
              </View>

              <View
                style={{
                  alignItems: "flex-end",
                  flex: 0.5,
                  marginVertical: 5,
                  height: "130%",
                  width: "90%",
                }}
              >
                <Image
                  source={require("./pos.png")}
                  style={{
                    resizeMode: "center",
                    width: "100%",
                    height: "100%",
                  }}
                />
              </View>
            </View>
          </ClickableListItem>
          <ClickableListItem
            onPressOut={this.props.onPressOut}
            style={{
              borderColor: COLOUR_OFF_WHITE,
              borderWidth: 2,
              height: 170,
              marginBottom: 10,
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                height: 40,
                backgroundColor: "#00ACDE",
                justifyContent: "center",
              }}
            >
              <Text bold title style={{ color: COLOUR_WHITE, padding: 15 }}>
                R225117766
              </Text>
            </View>
            <View
              onPressOut={this.props.onPressOut}
              style={{
                alignItems: "center",
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 15,
              }}
            >
              <View
                style={{
                  flex: 0.75,
                  justifyContent: "space-evenly",
                  marginVertical: 10,
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 10,
                    width: "75%",
                  }}
                >
                  <Text mid style={{ color: "#00425F" }}>
                    Model 1050tx
                  </Text>
                  <Text mid style={{ color: "#00425F" }}>
                    Linux
                  </Text>
                </View>
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 25,
                    width: "75%",
                    marginBottom: 15,
                  }}
                >
                  <Text mid style={{ color: "#00425F" }}>
                    Approval Status :
                  </Text>
                  <Text mid style={{ color: "green" }}>
                    Approved
                  </Text>
                </View>
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    paddingVertical: 15,
                    width: "75%",
                  }}
                >
                  <Text bold title style={{ color: "#00425F" }}>
                    More details{" "}
                  </Text>
                  <Icon color="#00425F" name="chevron-right" size={22} />
                </View>
              </View>

              <View
                style={{
                  alignItems: "flex-end",
                  flex: 0.5,
                  marginVertical: 5,
                  height: "130%",
                  width: "90%",
                }}
              >
                <Image
                  source={require("./pos.png")}
                  style={{
                    resizeMode: "center",
                    width: "100%",
                    height: "100%",
                  }}
                />
              </View>
            </View>
          </ClickableListItem>
          <ClickableListItem
            onPressOut={this.props.onPressOut}
            style={{
              borderColor: COLOUR_OFF_WHITE,
              borderWidth: 2,
              height: 170,
              marginBottom: 10,
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                height: 40,
                backgroundColor: "#00ACDE",
                justifyContent: "center",
              }}
            >
              <Text bold title style={{ color: COLOUR_WHITE, padding: 15 }}>
                R225117766
              </Text>
            </View>
            <View
              onPressOut={this.props.onPressOut}
              style={{
                alignItems: "center",
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 15,
              }}
            >
              <View
                style={{
                  flex: 0.75,
                  justifyContent: "space-evenly",
                  marginVertical: 10,
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 10,
                    width: "75%",
                  }}
                >
                  <Text mid style={{ color: "#00425F" }}>
                    Model 1050tx
                  </Text>
                  <Text mid style={{ color: "#00425F" }}>
                    Linux
                  </Text>
                </View>
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 25,
                    width: "75%",
                    marginBottom: 15,
                  }}
                >
                  <Text mid style={{ color: "#00425F" }}>
                    Approval Status :
                  </Text>
                  <Text mid style={{ color: "green" }}>
                    Approved
                  </Text>
                </View>
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    paddingVertical: 15,
                    width: "75%",
                  }}
                >
                  <Text bold title style={{ color: "#00425F" }}>
                    More details{" "}
                  </Text>
                  <Icon color="#00425F" name="chevron-right" size={22} />
                </View>
              </View>

              <View
                style={{
                  alignItems: "flex-end",
                  flex: 0.5,
                  marginVertical: 5,
                  height: "130%",
                  width: "90%",
                }}
              >
                <Image
                  source={require("./pos.png")}
                  style={{
                    resizeMode: "center",
                    width: "100%",
                    height: "100%",
                  }}
                />
              </View>
            </View>
          </ClickableListItem>
        </ScrollView> */}
        {/* <View>
          {this.state.isLoading ? <ActivityIndicator /> : screenContent()}
        </View> */}
      </View>
    );
  }
}

export class DataRow extends React.Component {
  render() {
    return (<>
      <ClickableListItem
      onPressOut={this.props.onPressOut}
      style={{
        borderColor: COLOUR_OFF_WHITE,
        borderWidth: 2,
        height: 170,
        marginBottom: 10,
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          height: 40,
          backgroundColor: "#00ACDE",
          justifyContent: "center",
        }}
      >
        <Text bold title style={{ color: COLOUR_WHITE, padding: 15 }}>
          {/* {this.props.requestId} */}
          R225117766
        </Text>
      </View>
      <View
        onPressOut={this.props.onPressOut}
        style={{
          alignItems: "center",
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 15,
        }}
      >
        <View
          style={{
            flex: 0.75,
            justifyContent: "space-evenly",
            marginVertical: 10,
          }}
        >
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 10,
              width: "75%",
            }}
          >
            <Text mid style={{ color: "#00425F" }}>
              {this.props.data ? this.props.data.terminalModel : "Model 1050tx"}
            </Text>
            <Text mid style={{ color: "#00425F" }}>
              {this.props.data ? this.props.data.terminalType : "Linux"}

            </Text>
          </View>
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 25,
              width: "75%",
              marginBottom: 15,
            }}
          >
            <Text mid style={{ color: "#00425F" }}>
              Approval Status :
            </Text>
            <Text mid style={{ color: "green" }}>
              Approved
            </Text>
          </View>
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              paddingVertical: 15,
              width: "75%",
            }}
          >
            <Text bold title style={{ color: "#00425F" }}>
              More details{" "}
            </Text>
            <Icon color="#00425F" name="chevron-right" size={22} />
          </View>
        </View>

        <View
          style={{
            alignItems: "flex-end",
            flex: 0.5,
            marginVertical: 5,
            height: "130%",
            width: "90%",
          }}
        >
          <Image
            source={require("./pos.png")}
            // source={{uri: cardLogoUrl}}
            style={{
              resizeMode: "center",
              width: "100%",
              height: "100%",
            }}
          />
        </View>
      </View>
    </ClickableListItem>
    </>
    );
  }
}

const DrawLine = () => (
  <View
    style={{
      borderWidth: 1,
      borderColor: "grey",
      borderRadius: 5,
      marginTop: 10,
      marginBottom: 10,
    }}
  />
);

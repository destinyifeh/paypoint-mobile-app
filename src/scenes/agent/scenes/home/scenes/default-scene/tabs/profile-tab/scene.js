import React from "react";
import { ScrollView, SectionList, StyleSheet, View } from "react-native";
import { Icon } from "react-native-elements";
import ActivityIndicator from "../../../../../../../../components/activity-indicator";
import Button from "../../../../../../../../components/button";
import ClickableListItem from "../../../../../../../../components/clickable-list-item";
import Header from "../../../../../../../../components/header";
import Text from "../../../../../../../../components/text";
import { AGENT } from "../../../../../../../../constants";
import { ERROR_STATUS } from "../../../../../../../../constants/api";
import {
  COLOUR_BLACK,
  COLOUR_BLUE,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_FAMILY_BODY_SEMIBOLD,
} from "../../../../../../../../constants/styles";
import Platform from "../../../../../../../../services/api/resources/platform";
import { saveData } from "../../../../../../../../utils/storage";

export default class ManageProfileScene extends React.Component {
  platform = new Platform();

  static navigationOptions = {
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      let IconComponent = Icon;
      let iconName;

      return (
        <IconComponent name="user" type="feather" size={25} color={tintColor} />
      );
    },
    title: "My Profile",
  };

  constructor() {
    super();

    this.loadAgentData = this.loadAgentData.bind(this);

    this.state = {
      expand: null,
      isLoading: false,
    };
  }

  componentDidMount() {
    this.loadAgentData();
  }

  async loadAgentData() {
    this.setState({
      isLoading: true,
    });

    const { status, response } = await this.platform.getCurrentAgent();
    if (status === ERROR_STATUS) {
      this.setState({
        didErrorOccurWhileLoading: true,
        isLoading: false,
      });

      return;
    }

    await saveData(AGENT, response);

    this.setState({
      didErrorOccurWhileLoading: false,
      isLoading: false,
    });
  }

  get errorFallbackMessage() {
    return (
      <View style={{ alignItems: "center", flex: 1, justifyContent: "center" }}>
        <Text big center>
          An error occured.
        </Text>
        <Button
          containerStyle={{
            marginTop: 8,
          }}
          onPress={this.loadAgentData}
          transparent
          title="RETRY"
          titleStyle={{
            color: COLOUR_BLUE,
          }}
        />
      </View>
    );
  }

  renderItem(item, index) {
    const statusIconColor = {
      Completed: "#32BE69",
      Failed: "#EE312A",
      "In Progress": "#F8B573",
    }[item.status];

    return (
      <View style={styles.itemContainer}>
        <ClickableListItem
          key={index}
          onPressOut={() => this.props.navigation.navigate(item.href)}
          style={styles.clickableListItemContainer}
        >
          <Text style={styles.titleText}>{item.name}</Text>

          <Icon
            name="chevron-right"
            color={"#B4B7BF"}
            type="material"
            size={30}
          />
        </ClickableListItem>
      </View>
    );
  }

  renderSectionHeader(item) {
    return (
      <Text style={{ lineHeight: 32, marginLeft: 10, marginTop: 0 }}>
        {item}
      </Text>
    );
  }

  render() {
    const { didErrorOccurWhileLoading, isLoading } = this.state;

    if (isLoading) {
      return <ActivityIndicator />;
    }

    if (didErrorOccurWhileLoading) {
      return this.errorFallbackMessage;
    }

    return (
      <View
        style={{
          backgroundColor: "#F3F3F4",
          flex: 1,
        }}
        onTouchEnd={() =>
          this.props.isNavigatorVisible ? this.props.hideNavigator() : null
        }
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
          title="Manage Profile"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: "bold",
          }}
          withNavigator
        />

        <ScrollView style={{ marginTop: 20 }}>
          <SectionList
            keyExtractor={(item, index) => item + index}
            renderItem={({ item, index, section }) =>
              this.renderItem(item, index)
            }
            // renderSectionHeader={({ section: { title } }) =>
            //   this.renderSectionHeader(title)
            // }
            sections={[
              {
                data: [
                  {
                    name: "Personal Details",
                    href: "UpdatePersonalInformation",
                  },
                ],
              },
              {
                data: [
                  {
                    name: "Business Information",
                    href: "UpdateBusinessInformation",
                  },
                ],
              },

              {
                data: [
                  {
                    name: "KYC Information",
                    href: "UpdateDocuments",
                  },
                ],
              },
              {
                data: [
                  {
                    name: "Next of Kin ",
                    href: "UpdateNextOfKinInformation",
                  },
                ],
              },
            ]}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titleText: {
    color: COLOUR_BLACK,
    fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
    fontSize: 16,
  },
  itemContainer: { width: "90%", alignSelf: "center" },
  clickableListItemContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    borderWidth: 0.5,
    borderColor: "#B4B7BF",
  },
});

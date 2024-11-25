import React from "react";
import { View } from "react-native";
import { Icon } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { connect } from "react-redux";
import ClickableListItem from "../../../../components/clickable-list-item";
import Header from "../../../../components/header";
import GradientIcon from "../../../../components/icons/gradient-icon";
import Text from "../../../../components/text";
import {
  COLOUR_BLUE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from "../../../../constants/styles";
import {
  hideNavigator,
  showNavigator,
} from "../../../../services/redux/actions/navigation";

class ItemRow extends React.Component {
  render() {
    return (
      <ClickableListItem
        style={{
          alignItems: "center",
          flexDirection: "row",
          ...this.props.style,
        }}
        title="adfdsf"
        onPressOut={this.props.onPressOut}
      >
        <GradientIcon
          colors={this.props.colors}
          icon={this.props.icon}
          iconSize={this.props.iconSize}
          style={{
            marginRight: 20,
          }}
        />
        <Text>{this.props.title}</Text>
      </ClickableListItem>
    );
  }
}

class AccountScene extends React.Component {
  static navigationOptions = {
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      let IconComponent = Icon;
      let iconName;

      return (
        <IconComponent name="user" type="feather" size={25} color={tintColor} />
      );
    },
    title: "Account",
  };

  render() {
    return (
      <View
        onTouchEnd={() =>
          this.props.isNavigatorVisible ? this.props.hideNavigator() : null
        }
        style={{
          backgroundColor: "white",
          flex: 1,
        }}
      >
        <Header
          containerStyle={{
            backgroundColor: COLOUR_BLUE,
          }}
          navigationIconColor={COLOUR_WHITE}
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          statusBarProps={{
            backgroundColor: "transparent",
            barStyle: CONTENT_LIGHT,
          }}
          title="My Account"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: "bold",
          }}
          withNavigator
        />

        <ScrollView
          contentContainerStyle={{
            padding: 30,
          }}
        >
          <ItemRow
            colors={["#5073F7", "#2A32EE"]}
            icon="user"
            style={{
              marginBottom: 30,
            }}
            title="Manage Profile"
            onPressOut={() => this.props.navigation.navigate("ManageProfile")}
          />
          <ItemRow
            colors={["#967AF9", "#9D56F6"]}
            icon="laptop"
            style={{
              marginBottom: 30,
            }}
            title="Manage Devices"
            onPressOut={() => this.props.navigation.navigate("ManageDevices")}
          />
          <ItemRow
            colors={["#F9BE7A", "#F58852"]}
            icon="lock"
            style={{
              marginBottom: 30,
            }}
            title="Security Settings"
            onPressOut={() =>
              this.props.navigation.navigate("SecuritySettings")
            }
          />
          {this.props.enable_pos_request === true && (
            <ItemRow
              colors={["#00ACDE", "#0076DE"]}
              icon="credit-card"
              style={{
                marginBottom: 30,
              }}
              title="POS Management"
              onPressOut={() => this.props.navigation.navigate("POSManagement")}
            />
          )}
        </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isNavigatorVisible: state.navigation.isNavigatorVisible,
    enable_pos_request: state.tunnel.remoteConfig.enable_pos_request,

    // pendingUrl: state.navigation.pendingUrl
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideNavigator: () => dispatch(hideNavigator()),
    showNavigator: () => dispatch(showNavigator()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountScene);

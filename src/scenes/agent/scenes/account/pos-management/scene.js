import React from "react";
import { View } from "react-native";
import { Icon } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { connect } from "react-redux";
import ClickableListItem from "../../../../../components/clickable-list-item";
import Header from "../../../../../components/header";
import GradientIcon from "../../../../../components/icons/gradient-icon";
import Text from "../../../../../components/text";
import { USER } from "../../../../../constants";
import {
  COLOUR_BLUE,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT
} from "../../../../../constants/styles";
import UserSerializer from "../../../../../serializers/resources/user";
import {
  hideNavigator,
  showNavigator
} from "../../../../../services/redux/actions/navigation";
import { loadData } from "../../../../../utils/storage";

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

class POSManagementScene extends React.Component {
  componentDidMount() {
    loadData(USER).then((response) => {
      const userData = new UserSerializer(JSON.parse(response));
      this.setState({ user: userData });
    });
  }
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
          title="POS Management"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: "bold",
          }}
        />

        <ScrollView
          contentContainerStyle={{
            padding: 30,
          }}
        >
          {this.state?.user && !this.state.user.isAgent && (
            <>

              <ItemRow
                colors={["#00ACDE", "#0076DE"]}
                icon="credit-card"
                style={{
                  marginBottom: 30,
                }}
                title="POS Remap"
                onPressOut={() => this.props.navigation.replace("PosRemap")}
              />
              <ItemRow
                colors={["#5073F7", "#2A32EE"]}
                icon="laptop"
                style={{
                  marginBottom: 30,
                }}
                title="POS Report"
                onPressOut={() => this.props.navigation.navigate("PosReport")}
              />
              <ItemRow
                colors={["#00ACDE", "#0076DE"]}
                icon="credit-card"
                style={{
                  marginBottom: 30,
                }}
                title="POS Requests"
                onPressOut={() => this.props.navigation.replace("PosRequestScene")}
              />
              <ItemRow
                colors={["#5073F7", "#2A32EE"]}
                icon="phone"
                style={{
                  marginBottom: 30,
                }}
                title="Track POS Request"
                onPressOut={() =>
                  this.props.navigation.replace("TrackPosScene")
                }
              />
            </>
          )}
          {this.state?.user && this.state.user.isAgent && this.state.user.isFip && (
            <>

              <ItemRow
                colors={["#00ACDE", "#0076DE"]}
                icon="credit-card"
                style={{
                  marginBottom: 30,
                }}
                title="POS Remap"
                onPressOut={() => this.props.navigation.replace("PosRemap")}
              />
              <ItemRow
                colors={["#5073F7", "#2A32EE"]}
                icon="laptop"
                style={{
                  marginBottom: 30,
                }}
                title="POS Report"
                onPressOut={() => this.props.navigation.navigate("PosReport")}
              />
              <ItemRow
                colors={["#00ACDE", "#0076DE"]}
                icon="credit-card"
                style={{
                  marginBottom: 30,
                }}
                title="POS Requests"
                onPressOut={() => this.props.navigation.replace("PosRequestScene")}
              />
              <ItemRow
                colors={["#5073F7", "#2A32EE"]}
                icon="phone"
                style={{
                  marginBottom: 30,
                }}
                title="Track POS Request"
                onPressOut={() =>
                  this.props.navigation.replace("TrackPosScene")
                }
              />
            </>
          )}


          {this.state?.user && this.state.user.isAgent && !this.state.user.isFip && (
            <>
              <ItemRow
                colors={["#5073F7", "#2A32EE"]}
                icon="laptop"
                style={{
                  marginBottom: 30,
                }}
                title="POS Report"
                onPressOut={() => this.props.navigation.navigate("PosReport")}
              />
              <ItemRow
                colors={["#00ACDE", "#0076DE"]}
                icon="credit-card"
                style={{
                  marginBottom: 30,
                }}
                title="POS Requests"
                onPressOut={() => this.props.navigation.replace("PosRequestScene")}
              />
              <ItemRow
                colors={["#5073F7", "#2A32EE"]}
                icon="laptop"
                style={{
                  marginBottom: 30,
                }}
                title="POS Remap Confirmation"
                onPressOut={() =>
                  this.props.navigation.replace("PosReceiptConfirmationScene")
                }
              />
              <ItemRow
                colors={["#5073F7", "#2A32EE"]}
                icon="phone"
                style={{
                  marginBottom: 30,
                }}
                title="Track POS Request"
                onPressOut={() =>
                  this.props.navigation.replace("TrackPosScene")
                }
              />
            </>
          )}
        </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isNavigatorVisible: state.navigation.isNavigatorVisible,
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
)(POSManagementScene);

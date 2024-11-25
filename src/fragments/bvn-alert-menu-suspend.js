import React from "react";

import { View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";

import Text from "../components/text";
import { COLOUR_GREY, COLOUR_RED } from "../constants/styles";
import { Icon } from "react-native-elements";
import ClickableListItem from "../components/clickable-list-item";
import { connect } from "react-redux";

const badIcon = ({ color }) => (
  <Icon color={color} name="frown" size={52} type="feather" />
);

class BVNAlertMenuSuspended extends React.Component {
  state = {
    showOnlyMessage: false,
  };

  render() {
    const { navigation, ref_, requestClose } = this.props;
    const { message, showOnlyMessage } = this.state;

    const Rating = ({ defaultColor = COLOUR_GREY, icon }) => {
      return (
        <ClickableListItem
          onPress={() => {
            navigation.replace("BVNInformation");
            requestClose();
          }}
          style={{ flexDirection: "column" }}
        >
          {icon({ color: defaultColor })}
          <Text
            bold
            center
            style={{
              color: defaultColor,
              marginTop: 4,
              padding: 10,
            }}
          >
            {/* Your account has been suspended as a result of inaccurate BVN information.{"\n"} */}
            Your BVN has not been verified.{"\n"}
            <Text bold style={{ color: "#ff0000" }}>
              Click here
            </Text>{" "}
            to update your BVN!.{"\n"}
          </Text>
        </ClickableListItem>
      );
    };

    let ratingSelect = () => (
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          justifyContent: "space-evenly",
          marginTop: 32,
        }}
      >
        <Rating
          icon={(params) => badIcon(params)}
          message=""
          tintColor={COLOUR_RED}
          title="Bad"
          value={1}
        />
      </View>
    );

    let messageView = () => (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginTop: 32,
        }}
      >
        <Text bigger center>
          {message}
        </Text>
      </View>
    );

    let content = ratingSelect;
    if (showOnlyMessage) {
      content = messageView;
    }

    return (
      <RBSheet
        animationType="fade"
        closeOnDragDown={false}
        closeOnPressMask={false}
        closeOnPressBack={false}
        duration={250}
        height={290}
        onClose={this.onCancelConfirmation}
        ref={ref_}
      >
        <View
          style={{
            padding: 20,
          }}
        />

        {content()}
      </RBSheet>
    );
  }
}

function mapStateToProps(state) {
  return {
    remoteConfig: state.tunnel.remoteConfig,
  };
}

export default connect(
  mapStateToProps,
  null
)(BVNAlertMenuSuspended);

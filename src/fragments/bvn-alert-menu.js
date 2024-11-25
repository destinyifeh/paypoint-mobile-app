import React from "react";

import { View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";

import Text from "../components/text";
import { COLOUR_GREY, COLOUR_RED } from "../constants/styles";
import { Icon } from "react-native-elements";
import ClickableListItem from "../components/clickable-list-item";
import { connect } from "react-redux";
import { loadData } from "../utils/storage";
import { AGENT } from "../constants";

const badIcon = ({ color }) => (
  <Icon color={color} name="frown" size={52} type="feather" />
);

class BVNAlertMenu extends React.Component {
  state = {
    showOnlyMessage: false,
    currentAgent: {},
  };

  render() {
    const { navigation, ref_, requestClose } = this.props;
    const { message, showOnlyMessage, currentAgent } = this.state;

    function daydifference(dt1) {
      const currentDate = new Date().getTime();
      let day1 = new Date(dt1).getTime();
      let thisDay = parseInt((day1 - currentDate) / (1000 * 3600 * 24));

      return thisDay > 0 ? thisDay : 0;
    }

    getAgentInfo = () => {
      loadData(AGENT).then((userData) => {
        userData_ = JSON.parse(userData);
        this.setState({
          currentAgent: userData_,
        });
      });
    };
    const Rating = ({ defaultColor = COLOUR_GREY, icon }) => {
      if (Object.keys(currentAgent).length < 1) {
        getAgentInfo();
      }

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
            {currentAgent.bvnVerificationStatus === "VERIFIED_PARTIALLY"
              ? "Your BVN data is partially verified."
              : " Your BVN data is not accurate."}
            {"\n"}
            <Text bold style={{ color: "#ff0000" }}>
              Click here
            </Text>{" "}
            to update your BVN!{"\n\n"}
            <Text>
              Kindly update your BVN information within the next{" "}
              <Text bold style={{ color: "#000088" }}>
                {daydifference(currentAgent.bvnGracePeriod)} days
              </Text>{" "}
              to avoid being suspended
            </Text>
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
        closeOnDragDown={true}
        closeOnPressMask={true}
        closeOnPressBack={true}
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
)(BVNAlertMenu);

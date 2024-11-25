import React from "react";

import { View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";

import { Icon } from "react-native-elements";
import { connect } from "react-redux";
import ClickableListItem from "../components/clickable-list-item";
import Text from "../components/text";
import { AGENT } from "../constants";
import { SHOW_FUND_VIA_USSD } from "../constants/api-resources";
import { BLOCKER } from "../constants/dialog-priorities";
import {
  COLOUR_BLACK,
  COLOUR_GREY,
  COLOUR_LIGHT_GREY,
  COLOUR_WHITE,
} from "../constants/styles";
import AgentSerializer from "../serializers/resources/agent";
import { flashMessage } from "../utils/dialog";
import { loadData } from "../utils/storage";
import FundViaTransfer from "./fund-via-transfer";

class FundingWalletOptionsMenu extends React.Component {
  state = {
    currentAgent: {},
  };

  constructor() {
    super();

    this._loadAgent = this._loadAgent.bind(this);
  }

  componentDidMount() {
    this._loadAgent();
  }

  async _loadAgent() {
    const savedAgentData = JSON.parse(await loadData(AGENT));

    // if (savedAgentData === null) {
    //   return;
    // }

    const currentAgent = new AgentSerializer(savedAgentData);

    this.setState({
      currentAgent,
    });

    return currentAgent;
  }

  render() {
    const {
      navigation,
      ref_,
      remoteConfig: { enable_quickteller_funding, enable_webpay_funding },
      requestClose,
      screenShown
    } = this.props;

    const isQuicktellerFundingDisabled = !enable_quickteller_funding;
    const isWebPayFundingDisabled = !enable_webpay_funding;

    return (
      <View>
        <FundViaTransfer
          navigation={this.props.navigation}
          ref_={(component) => (this.fundViaTransfer = component)}
          requestClose={() => this.fundViaTransfer.close()}
          accountNo={
            this.state.currentAgent?.staticAccounts
              ? this.state.currentAgent?.staticAccounts[0]?.accountNumber
              : "..."
          }
          // accountNo={this.state.currentAgent?.staticAccounts[0]?.accountNumber || "123456789099"}
          bankName={
            this.state.currentAgent?.staticAccounts
              ? this.state.currentAgent?.staticAccounts[0]?.bankName
              : "..."
          }
          accountName={
            this.state.currentAgent?.staticAccounts
              ? this.state.currentAgent?.staticAccounts[0]?.accountName
              : "..."
          }
          // bankName={this.state.currentAgent?.staticAccounts[0]?.bankName  || "Wema Bank"}
        />
        <RBSheet
          animationType="fade"
          closeOnDragDown={true}
          duration={250}
          height={430}
          onClose={this.onCancelConfirmation}
          ref={ref_}
        >
          <View
            style={{
              padding: 20,
            }}
          >
            <Text bold>Fund your wallet via</Text>
          </View>

          <ClickableListItem
            onPress={() => {
              this.fundViaTransfer.open();
            }}
            style={{
              alignItems: "center",
              borderBottomColor: COLOUR_LIGHT_GREY,
              borderBottomWidth: 1,
              flexDirection: "row",
              height: 70,
              justifyContent: "space-between",
              padding: 20,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text big black>
                Via Transfer
              </Text>
              {isWebPayFundingDisabled && (
                <Text
                  style={{
                    fontSize: 9,
                    backgroundColor: "red",
                    padding: 3,
                    color: "white",
                    marginLeft: 10,
                  }}
                >
                  NEW
                </Text>
              )}
            </View>
            <Icon
              color={isWebPayFundingDisabled ? COLOUR_LIGHT_GREY : COLOUR_BLACK}
              name="chevron-right"
              type="feather"
            />
          </ClickableListItem>
          {SHOW_FUND_VIA_USSD && (
            <ClickableListItem
              onPress={() => {
                navigation.navigate("FundWalletViaUssd",{
                  previousScreen: screenShown,
                });
                requestClose();
              }}
              style={{
                alignItems: "center",
                borderBottomColor: COLOUR_LIGHT_GREY,
                borderBottomWidth: 1,
                flexDirection: "row",
                height: 70,
                justifyContent: "space-between",
                padding: 20,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text big black>
                  Via USSD
                </Text>
                {!SHOW_FUND_VIA_USSD && (
                  <Text
                    style={{
                      fontSize: 9,
                      backgroundColor: "red",
                      padding: 3,
                      color: "white",
                      marginLeft: 10,
                    }}
                  >
                    New
                  </Text>
                )}
              </View>
              <Icon
                color={
                  isWebPayFundingDisabled ? COLOUR_LIGHT_GREY : COLOUR_BLACK
                }
                name="chevron-right"
                type="feather"
              />
            </ClickableListItem>
          )}
          {!SHOW_FUND_VIA_USSD && (
            <ClickableListItem
              onPress={() =>
                flashMessage(
                  "Fund Via USSD",
                  "This feature will be launched soon!",
                  BLOCKER
                )
              }
              style={{
                alignItems: "center",
                borderBottomColor: COLOUR_LIGHT_GREY,
                borderBottomWidth: 1,
                flexDirection: "row",
                height: 70,
                justifyContent: "space-between",
                padding: 20,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text big grey>
                  Via USSD
                </Text>
                <Text
                  style={{
                    fontSize: 9,
                    backgroundColor: "#bB8000",
                    padding: 3,
                    color: "white",
                    marginLeft: 10,
                  }}
                >
                  Coming Soon
                </Text>
              </View>
              <Icon
                color={
                  isWebPayFundingDisabled ? COLOUR_LIGHT_GREY : COLOUR_BLACK
                }
                name="chevron-right"
                type="feather"
              />
            </ClickableListItem>
          )}
          <ClickableListItem
            disabled={isWebPayFundingDisabled}
            onPress={() => {
              navigation.navigate("FundWalletInApp", { previousScreen: screenShown,});
              requestClose();
            }}
            style={{
              alignItems: "center",
              borderBottomColor: COLOUR_LIGHT_GREY,
              borderBottomWidth: 1,
              flexDirection: "row",
              height: 70,
              justifyContent: "space-between",
              padding: 20,
            }}
          >
            <View>
              <Text
                big
                black={!isWebPayFundingDisabled}
                lightGrey={isWebPayFundingDisabled}
              >
                Quickteller Paypoint
              </Text>
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  backgroundColor: isWebPayFundingDisabled
                    ? COLOUR_WHITE
                    : COLOUR_LIGHT_GREY,
                  justifyContent: "space-evenly",
                  padding: 6,
                  width: 100,
                }}
              >
                <Text
                  lightGrey={isWebPayFundingDisabled}
                  style={{ fontSize: 13 }}
                >
                  Instant
                </Text>
                <Icon
                  color={
                    isWebPayFundingDisabled ? COLOUR_LIGHT_GREY : COLOUR_GREY
                  }
                  name="zap"
                  size={15}
                  type="feather"
                />
              </View>
            </View>
            <Icon
              color={isWebPayFundingDisabled ? COLOUR_LIGHT_GREY : COLOUR_BLACK}
              name="chevron-right"
              type="feather"
            />
          </ClickableListItem>

          <ClickableListItem
            disabled={isQuicktellerFundingDisabled}
            onPress={() => {
              navigation.navigate("FundWalletQuickteller");
              requestClose();
            }}
            style={{
              alignItems: "center",
              borderBottomColor: COLOUR_LIGHT_GREY,
              borderBottomWidth: 1,
              flexDirection: "row",
              height: 70,
              justifyContent: "space-between",
              padding: 20,
            }}
          >
            <Text
              big
              black={!isQuicktellerFundingDisabled}
              lightGrey={isQuicktellerFundingDisabled}
            >
              Quickteller
            </Text>
            <Icon name="chevron-right" type="feather" />
          </ClickableListItem>

          <ClickableListItem
            onPress={() => {
              "Fund Wallet via Bank Branch",
                flashMessage(
                  "Fund Via Bank Branch",
                  "Visit any bank branch nationwide, and fund your Quickteller Paypoint wallet using PayDirect.",
                  BLOCKER
                );
            }}
            style={{
              alignItems: "center",
              flexDirection: "row",
              height: 70,
              justifyContent: "space-between",
              padding: 20,
            }}
          >
            <Text big black>
              Bank Branch
            </Text>
            <Icon name="chevron-right" type="feather" />
          </ClickableListItem>
        </RBSheet>
      </View>
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
)(FundingWalletOptionsMenu);

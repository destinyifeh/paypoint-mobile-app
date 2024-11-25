import React from "react";
import { View } from "react-native";

import { Icon } from "react-native-elements";
import ClickableListItem from "../../../../../components/clickable-list-item";
import Text from "../../../../../components/text";
import {
  COLOUR_DARK_RED,
  COLOUR_GREEN,
  COLOUR_LIGHT_GREY,
  COLOUR_WHITE,
} from "../../../../../constants/styles";
import TransactionSerializer from "../../../../../serializers/resources/transaction";

class SuccessComponent extends React.Component {
  render() {
    return (
      <View
        style={{
          flexDirection: "row",
          width: 103,
          height: 28,
          backgroundColor: "#F1FEF1",
          justifyContent: "center",
          paddingVertical: 5,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#BEF2B9",
        }}
      >
        <View style={{ marginTop: 3 }}>
          <Icon
            color={COLOUR_GREEN}
            name="fiber-manual-record"
            size={9}
            type="material"
            underlayColor="transparent"
          />
        </View>

        <Text style={{ fontSize: 14, color: COLOUR_GREEN }}>Successful</Text>
      </View>
    );
  }
}
class ProcessingComponent extends React.Component {
  render() {
    return (
      <View
        style={{
          flexDirection: "row",
          width: 80,
          height: 28,
          backgroundColor: "#FEF6CF",
          justifyContent: "center",
          paddingVertical: 5,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#FDED94",
        }}
      >
        <View style={{ marginTop: 3 }}>
          <Icon
            color={"#AF5F26"}
            name="fiber-manual-record"
            size={9}
            type="material"
            underlayColor="transparent"
          />
        </View>

        <Text style={{ fontSize: 14, color: "#AF5F26" }}>Processing</Text>
      </View>
    );
  }
}
class QueriedComponent extends React.Component {
  render() {
    return (
      <View
        style={{
          flexDirection: "row",
          width: 75,
          height: 28,
          backgroundColor: "#FBE9E9",
          justifyContent: "center",
          paddingVertical: 5,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#D81E1E",
        }}
      >
        <View style={{ marginTop: 3 }}>
          <Icon
            color={"#D81E1E"}
            name="fiber-manual-record"
            size={9}
            type="material"
            underlayColor="transparent"
          />
        </View>

        <Text style={{ fontSize: 14, color: COLOUR_DARK_RED }}>Queried</Text>
      </View>
    );
  }
}
export default class CacReportRow extends React.Component {
  transactionSerializer = new TransactionSerializer();

  constructor(props) {
    super(props);

    this.state = {
      transaction: props.transaction,
    };
  }

  getColours(transactionType) {
    switch (transactionType) {
      case "BILLS":
        return ["#9483FA", "#9F4FF5"];
      case "TRANSFER_CASH_IN":
      case "FUND_TRANSFER_UNIFIED":
        return ["#FACB83", "#F5834F"];
      case "RECHARGE":
        return ["#83F4FA", "#00B8DE"];
      case "CASH_IN":
        return ["#F9596C", "#EE312A"];
      default:
        return ["#83F4FA", "#00B8DE"];
    }
  }

  render() {
    const { status, name, date, time } = this.props;
    // const { status } = item;
    let statusComponent;
    switch (status) {
      case "SUCCESSFUL":
        statusComponent = <SuccessComponent />;
        break;
      case "PROCESSING":
        statusComponent = <ProcessingComponent />;
        break;
      case "QUERIED":
        statusComponent = <QueriedComponent />;
        break;
      default:
        statusComponent = <Text>Unknown Status</Text>;
    }
    // const {
    //   amount,
    //   creator,
    //   customerId,
    //   customerMsisdn,
    //   destination,
    //   fee,
    //   narration,
    //   statusCode,
    //   transactionType,
    // } = serializedTransaction;

    return (
      <View style={{ paddingHorizontal: 15, marginVertical: 7 }}>
        <ClickableListItem
          onPressOut={this.props.onPressOut}
          style={{
            alignItems: "center",
            backgroundColor: COLOUR_WHITE,
            //   borderTopColor: COLOUR_LIGHT_GREY,
            flex: 1,
            flexDirection: "row",
            height: 70,
            justifyContent: "space-between",
            padding: 15,
            paddingTop: 2,
            paddingBottom: 2,
            borderWidth: 0.7,
            borderColor: COLOUR_LIGHT_GREY,
            borderRadius: 4,
          }}
        >
          <View
            style={{
              flex: 0.55,
              flexDirection: "column",
            }}
          >
            <Text
              style={{ fontSize: 14, color: "#353F50" }}
              numberOfLines={1}
              bold
            >
              {name}
            </Text>
            <View style={{ paddingTop: 5 }}>
              <Text style={{ fontSize: 12 }} numberOfLines={1} bold>
                {date} | {time}
              </Text>
            </View>
          </View>
          {statusComponent}
          <View style={{}}>
            <Icon
              color={"#5F738C"}
              name="chevron-right"
              onPress={() => this.props.navigation.goBack()}
              size={24}
              type="material"
              underlayColor="transparent"
            />
          </View>
        </ClickableListItem>
      </View>
    );
  }
}

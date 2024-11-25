import React from "react";
import { View } from "react-native";

import ClickableListItem from "../../../../../components/clickable-list-item";
import GradientIcon from "../../../../../components/icons/gradient-icon";
import Text from "../../../../../components/text";
import {
  FAILED_STATUS,
  PENDING_STATUS,
  SUCCESSFUL_STATUS,
} from "../../../../../constants/api";
import {
  COLOUR_LIGHT_GREY,
  COLOUR_WHITE,
  FONT_SIZE_BIG,
} from "../../../../../constants/styles";
import TransactionSerializer from "../../../../../serializers/resources/transaction";
import reduxStore from "../../../../../services/redux/store";

export default class TransactionRow extends React.Component {
  transactionSerializer = new TransactionSerializer();

  constructor(props) {
    super(props);

    this.state = {
      transaction: props.transaction,
    };

    function handleChange() {
      const { requeryTransactionBucket } = reduxStore.getState().tunnel;
      const newTransaction =
        requeryTransactionBucket[this.state.transaction.transactionRef];

      if (!newTransaction) {
        return;
      }

      console.log({ newTransaction });

      this.setState({
        transaction: newTransaction,
      });
    }

    reduxStore.subscribe(handleChange.bind(this));
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

  getIconName(transactionType) {
    switch (transactionType) {
      case "BILLS":
        return "credit-card";
      case "TRANSFER_CASH_IN":
      case "FUND_TRANSFER_UNIFIED":
        return "money";
      case "CASH_IN":
        return "sign-out";
      default:
        return "tag";
    }
  }

  render() {
    const { isHistoricalData } = this.props;
    const { transaction } = this.state;
    const serializedTransaction = isHistoricalData
      ? this.transactionSerializer.serializeHistoricalData(transaction)
      : this.transactionSerializer.serializeApiData(transaction);
    const {
      amount,
      creator,
      customerId,
      customerMsisdn,
      destination,
      fee,
      narration,
      statusCode,
      transactionType,
    } = serializedTransaction;

    return (
      <ClickableListItem
        onPressOut={this.props.onPressOut}
        style={{
          alignItems: "center",
          backgroundColor: COLOUR_WHITE,
          borderTopColor: COLOUR_LIGHT_GREY,
          borderTopWidth: 0.7,
          flex: 1,
          flexDirection: "row",
          height: 70,
          justifyContent: "space-between",
          padding: 15,
          paddingTop: 2,
          paddingBottom: 2,
        }}
      >
        <GradientIcon
          icon={this.getIconName(transactionType)}
          iconSize={18}
          colors={this.getColours(transactionType)}
          style={{
            // flex: .2,
            height: 35,
            width: 35,
          }}
        />

        <View
          style={{
            flex: 0.55,
          }}
        >
          <Text numberOfLines={1} isStatus bold>
            {narration}
          </Text>
          {isHistoricalData ? (
            <React.Fragment>
              <Text isStatus numberOfLines={1}>
                <Text semiBold isStatus>
                  Destination:
                </Text>{" "}
                {destination}
              </Text>
              <Text isStatus numberOfLines={1}>
                <Text semiBold isStatus>
                  Creator:{" "}
                </Text>
                {creator}
              </Text>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Text isStatus numberOfLines={1}>
                <Text semiBold isStatus>
                  Customer ID:
                </Text>{" "}
                {customerId}
              </Text>
              <Text isStatus numberOfLines={1}>
                <Text semiBold isStatus>
                  Phone:{" "}
                </Text>
                {customerMsisdn}
              </Text>
            </React.Fragment>
          )}
        </View>

        <View
          style={{
            flex: 0.4,
          }}
        >
          <Text
            bold
            style={{
              fontSize: FONT_SIZE_BIG,
              textAlign: "right",
            }}
          >
            {amount}
          </Text>
          <Text
            isStatus
            isPendingStatus={statusCode === PENDING_STATUS}
            isSuccessStatus={statusCode === SUCCESSFUL_STATUS}
            isFailedStatus={statusCode === FAILED_STATUS}
            style={{
              textAlign: "right",
            }}
          >
            {statusCode}
          </Text>
        </View>
      </ClickableListItem>
    );
  }
}

import React from 'react';
import { View } from "react-native";

import amountField from "../../../../../fragments/amount-field";
import ClickableListItem from "../../../../../components/clickable-list-item";
import { convertNgkToNgn } from "../../../../../utils/converters/currencies";
import { COLOUR_LIGHT_GREY, FONT_SIZE_BIG, COLOUR_WHITE, COLOUR_GREEN, COLOUR_RED } from "../../../../../constants/styles";
import Text from "../../../../../components/text";
import TransactionSerializer from "../../../../../serializers/resources/transaction";
import reduxStore from '../../../../../services/redux/store';
import { FAILED_STATUS, PENDING_STATUS, SUCCESSFUL_STATUS, COMPLETED_STATUS } from "../../../../../constants/api";
import GradientIcon from '../../../../../components/icons/gradient-icon';
import { formatNgnAmount } from '../../../../../utils/formatters';


export default class StatementOfAccountRow extends React.Component {
  transactionSerializer = new TransactionSerializer();

  constructor(props) {
    super(props);

    this.state = {
      transaction: props.transaction,
    };

    function handleChange() {
      const { requeryTransactionBucket } = reduxStore.getState().tunnel;
      const newTransaction = requeryTransactionBucket[this.state.transaction.transactionRef];

      if (!newTransaction) {
        return
      }

      console.log({newTransaction})

      this.setState({
        transaction: newTransaction
      });
    }

    reduxStore.subscribe(handleChange.bind(this));
  }

  getAmountColour(transactionType) {
    switch (transactionType) {
      case 'CREDIT':
        return COLOUR_GREEN;
      case 'DEBIT':
        return COLOUR_RED;
      default:
        return COLOUR_LIGHT_GREY;
    }
  }

  getColours(transactionType) {
    switch(transactionType) {
      case 'CREDIT':
        return ['#83F4FA', '#00B8DE']
      case 'DEBIT':
        return ['#F9596C', '#EE312A']
      default:
        return ['#83F4FA', '#00B8DE']
    }
  }

  getIconName(transactionType) {
    switch(transactionType) {
      case 'CREDIT': 
        return 'sign-in'
      case 'DEBIT':
        return 'sign-out'
      default:
        return 'tag'
    } 
  }

  render () {
    const { transaction } = this.state;
    const { 
      amount, formattedDateTime, narration, statusCode, transactionType,
      remainingBalance, uniqueReference,
    } = transaction;
    
    return <ClickableListItem 
      onPressOut={this.props.onPressOut} 
      style={{
        alignItems: 'center',
        backgroundColor: COLOUR_WHITE,
        borderTopColor: COLOUR_LIGHT_GREY,
        borderTopWidth: .7,
        flex: 1,
        flexDirection: 'row',
        height: 90,
        justifyContent: 'space-between',
        padding: 15,
        paddingTop: 5,
        paddingBottom: 10
      }}
    >
      <GradientIcon 
        icon={this.getIconName(transactionType)}
        iconSize={18}
        colors={this.getColours(transactionType)} 
        style={{
          // flex: .2,
          height: 35,
          width: 35
        }}
      />
      
      <View style={{
        flex: .55,
        marginLeft: 4,
      }}>  
        <Text numberOfLines={1} isStatus bold>{narration}</Text>
        <Text mid numberOfLines={1}>
          <Text semiBold isStatus>Date:</Text> {formattedDateTime}
        </Text>
        <Text isStatus numberOfLines={2}>
          <Text semiBold isStatus>Transaction Ref.:</Text>{`\n${uniqueReference}`}
        </Text>
      </View>

      <View style={{
        flex: .4,
      }}>
        <Text bold style={{
          color: this.getAmountColour(transactionType),
          fontSize: FONT_SIZE_BIG,
          textAlign: 'right'
        }}>{amount}</Text>
        <Text isStatus isPendingStatus={statusCode === PENDING_STATUS} isSuccessStatus_={statusCode === COMPLETED_STATUS} isFailedStatus={statusCode === FAILED_STATUS} style={{
          textAlign: 'right',
          marginTop: 4,
        }}>Balance After:{'\n'}{formatNgnAmount(convertNgkToNgn(remainingBalance))}</Text>
      </View>
    </ClickableListItem>
  }
}

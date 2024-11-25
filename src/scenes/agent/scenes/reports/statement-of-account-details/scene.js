import React from 'react';
import {ActivityIndicator, Dimensions, ScrollView, View} from 'react-native';

import {connect} from 'react-redux';

import Accordion from '../../../../../components/accordion';
import Header from '../../../../../components/header';
import GradientIcon from '../../../../../components/icons/gradient-icon';
import Text from '../../../../../components/text';
import {FAILED_STATUS, SUCCESSFUL_STATUS} from '../../../../../constants/api';
import {
  COLOUR_BLACK,
  COLOUR_BLUE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_SIZE_BIG,
} from '../../../../../constants/styles';
import TransactionSerializer from '../../../../../serializers/resources/transaction';
import {
  hideNavigator,
  showNavigator,
} from '../../../../../services/redux/actions/navigation';
import {addRequeriedTransaction} from '../../../../../services/redux/actions/tunnel';

const window_height = Dimensions.get('window').height;

class TransactionSummary extends React.Component {
  REQUERY_TRANSACTION_MESSAGE =
    'We are currently fetching the latest transaction status';
  REQUERY_TRANSACTION_TYPES = ['Pending'];
  TRANSACTION_TYPES_WITHOUT_RECEIPT = [
    'REVERSAL',
    'COMMISSION_UNLOAD',
    'PAYPOINT_FUND',
  ];

  transactionSerializer = new TransactionSerializer();

  constructor() {
    super();

    this.state = {
      transaction: {},
    };
  }

  componentDidMount() {
    const {transaction} = this.props.route?.params || {};

    this.setState({
      transaction: transaction || {},
    });
  }

  getSummaryContent() {
    const {
      availableBalance,
      creditAmount,
      debitAmount,
      ledgerBalance,
      uniqueReference,
    } = this.state.transaction;

    return (
      <View style={{justifyContent: 'space-evenly', marginLeft: 10}}>
        <Text bold>Credit Amount</Text>
        <Text>{creditAmount}</Text>

        <Text bold style={{marginTop: 10}}>
          Debit Amount
        </Text>
        <Text>{debitAmount}</Text>

        <React.Fragment>
          <Text bold style={{marginTop: 10}}>
            Available Balance
          </Text>
          <Text>{availableBalance}</Text>
        </React.Fragment>

        <React.Fragment>
          <Text bold style={{marginTop: 10}}>
            Ledger Balance
          </Text>
          <Text>{ledgerBalance}</Text>
        </React.Fragment>

        <React.Fragment>
          <Text bold style={{marginTop: 10}}>
            Transaction Reference
          </Text>
          <Text copyOnPress>{uniqueReference}</Text>
        </React.Fragment>
      </View>
    );
  }

  getColourForTransactionType(transactionType) {
    switch (transactionType) {
      case 'CREDIT':
        return ['#83F4FA', '#00B8DE'];
      case 'DEBIT':
        return ['#F9596C', '#EE312A'];
      default:
        return ['#83F4FA', '#00B8DE'];
    }
  }

  getIconForTransactionType(transactionType) {
    switch (transactionType) {
      case 'CREDIT':
        return 'sign-in';
      case 'DEBIT':
        return 'sign-out';
      default:
        return 'tag';
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  render() {
    const {isLoading, transaction} = this.state;
    const {amount, formattedDateTime, narration, statusCode, transactionType} =
      transaction;

    const mainPageContent = (
      <ScrollView>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-evenly',
            backgroundColor: '#F3F3F4',
            height: 300,
          }}>
          <GradientIcon
            colors={this.getColourForTransactionType(transactionType)}
            icon={this.getIconForTransactionType(transactionType)}
            style={{
              justifyContent: 'center',
            }}
          />

          <Text title style={{color: COLOUR_BLACK}}>
            {narration}
          </Text>
          <Text>{formattedDateTime}</Text>
          <Text style={{color: COLOUR_BLACK, fontSize: FONT_SIZE_BIG}}>
            {amount}
          </Text>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Text
              center
              mid
              isFailedStatus={statusCode === FAILED_STATUS}
              isSuccessStatus={statusCode === SUCCESSFUL_STATUS}
              style={
                {
                  // width: '50%'
                }
              }>
              {statusCode}
            </Text>
            {isLoading && (
              <ActivityIndicator size="small" style={{marginLeft: 8}} />
            )}
          </View>
        </View>

        <Accordion
          expanded={true}
          header="Summary"
          content={this.getSummaryContent()}
        />
      </ScrollView>
    );

    return (
      <View style={{flex: 1}}>
        <Header
          containerStyle={{
            backgroundColor: COLOUR_BLUE,
          }}
          goBack={() => this.props.navigation.goBack()}
          withNavigateBackIcon
          title="Transaction Details"
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_LIGHT,
          }}
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
          }}
        />

        {mainPageContent}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isNavigatorVisible: state.navigation.isNavigatorVisible,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addRequeriedTransaction: transaction =>
      dispatch(addRequeriedTransaction(transaction)),
    hideNavigator: () => dispatch(hideNavigator()),
    showNavigator: () => dispatch(showNavigator()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionSummary);

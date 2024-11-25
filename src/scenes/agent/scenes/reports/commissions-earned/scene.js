import React from 'react';
import {FlatList, InteractionManager, View} from 'react-native';

import moment from 'moment';
import {Icon} from 'react-native-elements';

import ActivityIndicator from '../../../../../components/activity-indicator';
import Button from '../../../../../components/button';
import Header from '../../../../../components/header';
import GradientIcon from '../../../../../components/icons/gradient-icon';
import Skeleton from '../../../../../components/skeleton';
import Text from '../../../../../components/text';
import {DEFAULT_PAGE_SIZE, USER} from '../../../../../constants';
import {ERROR_STATUS, HTTP_NOT_FOUND} from '../../../../../constants/api';
import {
  COLOUR_BLACK,
  COLOUR_BLUE,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../../../constants/styles';
import TransactionHistory from '../../../../../services/api/resources/transaction-history';
import {convertNgkToNgn} from '../../../../../utils/converters/currencies';
import handleErrorResponse from '../../../../../utils/error-handlers/api';
import {formatNgnAmount} from '../../../../../utils/formatters';
import {loadData} from '../../../../../utils/storage';

class ListItem extends React.Component {
  getColoursForCommissionTransactionEvent(transactionEvent) {
    return {
      Debit: ['#F9596C', '#EE312A'],
      Credit: ['#83F4FA', '#00B8DE'],
    }[transactionEvent];
  }

  getIconForCommissionTransactionEvent(transactionEvent) {
    return {
      Debit: 'sign-out',
      Credit: 'sign-in',
    }[transactionEvent];
  }

  render() {
    const {
      amount,
      dateCreated,
      event,
      fee,
      status,
      transactionRef,
      transactionType,
    } = this.props;

    // TODO use `fee` as "Commission Earned" and `transactionType` and "Transaction Type"

    const isFailedTransaction = status === 'Failed';
    const isSuccessfulTransaction = status === 'Successful';
    const isPendingTransaction = status === 'Pending';
    const transactionAmount = event === 'Debit' ? amount : fee;

    return (
      <View
        style={{
          backgroundColor: COLOUR_WHITE,
          flex: 1,
          flexDirection: 'row',
          height: 125,
          marginBottom: 10,
          padding: 10,
        }}>
        <View
          style={{
            alignItems: 'flex-start',
            flex: 0.165,
            justifyContent: 'center',
            marginRight: 0,
            paddingTop: 5,
            width: 75,
          }}>
          {event && (
            <GradientIcon
              colors={this.getColoursForCommissionTransactionEvent(event)}
              icon={this.getIconForCommissionTransactionEvent(event)}
              style={{
                justifyContent: 'center',
              }}
            />
          )}
          <Text
            bold
            center
            small
            style={{
              color: event
                ? this.getColoursForCommissionTransactionEvent(event)[1]
                : COLOUR_BLACK,
            }}>
            {event}
          </Text>
        </View>
        <View
          style={{
            flex: 0.535,
            justifyContent: 'center',
          }}>
          <Text style={{flex: 0.5, flexWrap: 'wrap'}}>{transactionType}</Text>
          <Text>
            <Text mid bold>
              Amount:{' '}
            </Text>
            <Text mid style={{flex: 0.5, flexWrap: 'wrap', width: '50%'}}>
              {formatNgnAmount(convertNgkToNgn(amount))}
            </Text>
          </Text>
          {transactionRef && (
            <Text>
              <Text mid bold>
                Ref.:{' '}
              </Text>
              <Text
                mid
                style={{flex: 0.5, flexWrap: 'wrap', width: '50%'}}
                copyOnPress>
                {transactionRef}
              </Text>
            </Text>
          )}
          <Text>
            <Text bold small>
              Date:{' '}
            </Text>
            <Text small>
              {moment(dateCreated).format('DD-MM-YYYY h:mm:ss a')}
            </Text>
          </Text>
        </View>
        <View
          style={{
            alignItems: 'flex-end',
            flex: 0.35,
            justifyContent: 'center',
          }}>
          <Text big bold right>
            {formatNgnAmount(convertNgkToNgn(transactionAmount))}
          </Text>
          <Text
            green={isSuccessfulTransaction}
            isPendingStatus={isPendingTransaction}
            mid
            red={isFailedTransaction}
            right>
            {status}
          </Text>
        </View>
      </View>
    );
  }
}

const endDate = moment().format('DD-MM-YYYY');
const startDate = moment().subtract(1, 'months').format('DD-MM-YYYY');

export default class CommissionEarnedScene extends React.Component {
  transactionHistory = new TransactionHistory();

  state = {
    animationsDone: false,
    endDate,
    isLoading: true,
    pageNo: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    startDate,
    transactions: [],
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });
    });

    loadData(USER).then(data => {
      const user = JSON.parse(data);
      this.setState({
        user,
      });

      this.fetchData(user);
    });
  }

  async fetchData(_user) {
    const user = _user || this.state.user;
    const {pageNo, pageSize} = this.state;
    const {filters = null} = this.props.route.params || {};
    const time =
      endDate === moment().format('DD-MM-YYYY')
        ? moment().subtract(1, 'minutes').format('HH:mm:ss')
        : '23:59:59';
    const defaultStartDate = moment(startDate, 'DD-MM-YYYY').format(
      'YYYY-MM-DD[T00:00:01]',
    );
    const defaultEndDate = moment(endDate, 'DD-MM-YYYY').format(
      `YYYY-MM-DD[T${time}]`,
    );

    this.setState({
      didErrorOccurWhileFetching: null,
      isLoading: true,
    });

    if (filters !== null) {
      const {domainCode, endDate, event, startDate, transactionTypeInt} =
        filters;

      const time =
        endDate === moment().format('DD-MM-YYYY')
          ? moment().subtract(1, 'minutes').format('HH:mm:ss')
          : '23:59:59';

      console.log('DOMAIN CODE', {domainCode});

      const {status, response, code} =
        await this.transactionHistory.getCommissionHistory(
          domainCode ? domainCode : user.domainCode,
          pageNo,
          pageSize,
          startDate
            ? moment(startDate, 'DD-MM-YYYY').format('YYYY-MM-DD[T00:00:01]')
            : defaultStartDate,
          endDate
            ? moment(endDate, 'DD-MM-YYYY').format(`YYYY-MM-DD[T${time}]`)
            : defaultEndDate,
          transactionTypeInt,
          event,
        );

      console.log(
        'RETRIEVE SETTLEMENTS',
        status,
        JSON.stringify(response),
        code,
      );

      if (status === ERROR_STATUS) {
        this.setState({
          didErrorOccurWhileFetching: code !== HTTP_NOT_FOUND,
          errorMessage: await handleErrorResponse(response),
          isLoading: false,
          transactions: this.state.transactions,
        });

        return;
      }

      this.setState({
        didErrorOccurWhileFetching: false,
        isLoading: false,
        transactions: [...this.state.transactions, ...response.content],
        domainCode,
      });

      return;
    }

    const {status, response, code} =
      await this.transactionHistory.getCommissionHistory(
        user.domainCode,
        pageNo,
        pageSize,
        defaultStartDate,
        defaultEndDate,
      );

    console.log('RETRIEVE SETTLEMENTS', status, JSON.stringify(response), code);

    if (status === ERROR_STATUS) {
      this.setState({
        didErrorOccurWhileFetching: code !== HTTP_NOT_FOUND,
        errorMessage: await handleErrorResponse(response),
        isLoading: false,
        transactions: this.state.transactions,
      });

      return;
    }

    this.setState({
      didErrorOccurWhileFetching: false,
      isLoading: false,
      transactions: [
        ...this.state.transactions,
        ...response.content,
        // ...this.sortTransactions(response.content.filter(value => value.statusCode !== 'INITIATED'))
      ],
    });
  }

  get errorFallbackMessage() {
    const {errorMessage} = this.state;

    return (
      <View style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
        <Text bold center red small>
          Oops!
        </Text>
        <Text big center>
          {errorMessage}
        </Text>
        <Button
          containerStyle={{
            marginTop: 8,
          }}
          onPress={this.fetchData.bind(this)}
          transparent
          title="RETRY"
          titleStyle={{
            color: COLOUR_BLUE,
          }}
        />
      </View>
    );
  }

  get noContentMessage() {
    return (
      <View style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
        <Text big center>
          No data found for filters selected.
        </Text>
        <Button
          containerStyle={{
            marginTop: 8,
          }}
          onPress={() =>
            this.props.navigation.navigate('CommissionsEarnedFilter')
          }
          title="ADJUST FILTERS"
          titleStyle={{
            color: COLOUR_BLUE,
          }}
          transparent
        />
      </View>
    );
  }

  loadNextPage() {
    this.setState({
      pageNo: this.state.pageNo + 1,
    });

    setTimeout(() => this.fetchData(), 0);
  }

  renderItem(item, index) {
    return <ListItem {...item} />;
  }

  isCloseToBottom({layoutMeasurement, contentOffset, contentSize}) {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  }

  renderLoader() {
    if (this.state.transactions.length) {
      return <ActivityIndicator />;
    }

    return (
      <View>
        <Skeleton.TransactionRow />
        <Skeleton.TransactionRow />
        <Skeleton.TransactionRow />
        <Skeleton.TransactionRow />
        <Skeleton.TransactionRow />
        <Skeleton.TransactionRow />
        <Skeleton.TransactionRow />
        <Skeleton.TransactionRow />
      </View>
    );
  }

  render() {
    const {domainCode} = this.state;
    if (!this.state.animationsDone) {
      return <React.Fragment />;
    }

    return (
      <View
        style={{
          backgroundColor: '#F3F3F4',
          flex: 1,
        }}>
        <Header
          containerStyle={{
            backgroundColor: COLOUR_BLUE,
          }}
          navigationIconColor={COLOUR_WHITE}
          leftComponent={
            <Icon
              color={COLOUR_RED}
              name="chevron-left"
              onPress={() => this.props.navigation.goBack()}
              size={40}
              type="material"
              underlayColor="transparent"
            />
          }
          rightComponent={
            <Icon
              color={COLOUR_WHITE}
              name="tune"
              onPress={() => {
                this.props.navigation.replace('CommissionsEarnedFilter', {
                  domainCode,
                });
              }}
              size={24}
              type="material"
              underlayColor="transparent"
            />
          }
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_LIGHT,
          }}
          title="Commission History"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
          }}
        />

        {/* <Text>{JSON.stringify(this.state.transactions)}</Text> */}

        {Boolean(this.state.transactions.length) && (
          <FlatList
            keyExtractor={(item, index) => item + index}
            onScroll={({nativeEvent}) => {
              if (this.isCloseToBottom(nativeEvent)) {
                this.loadNextPage();
              }
            }}
            renderItem={({item, index}) => this.renderItem(item, index)}
            scrollEventThrottle={400}
            data={this.state.transactions}
          />
        )}

        {this.state.didErrorOccurWhileFetching && this.errorFallbackMessage}
        {!this.state.didErrorOccurWhileFetching &&
          !Boolean(this.state.transactions.length) &&
          !this.state.isLoading &&
          this.noContentMessage}

        {this.state.isLoading && this.renderLoader()}
      </View>
    );
  }
}

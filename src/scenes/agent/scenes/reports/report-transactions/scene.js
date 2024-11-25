import React from 'react';

import moment from 'moment';
import {InteractionManager, SectionList, View} from 'react-native';
import {Icon} from 'react-native-elements';

import ActivityIndicator from '../../../../../components/activity-indicator';
import Button from '../../../../../components/button';
import Header from '../../../../../components/header';
import Text from '../../../../../components/text';
import {MIME_TYPE_CSV, USER} from '../../../../../constants';
import {ERROR_STATUS, HTTP_NOT_FOUND} from '../../../../../constants/api';
import {
  COLOUR_BLUE,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../../../constants/styles';
import TransactionSerializer from '../../../../../serializers/resources/transaction';
import UserSerializer from '../../../../../serializers/resources/user';
import TransactionHistory from '../../../../../services/api/resources/transaction-history';
import {loadData} from '../../../../../utils/storage';

import Skeleton from '../../../../../components/skeleton';
import {
  ENVIRONMENT_IS_TEST,
  TRANSACTION_HISTORY_API_BASE_URL,
} from '../../../../../constants/api-resources';
import {CASUAL} from '../../../../../constants/dialog-priorities';
import IfisArchives from '../../../../../services/api/resources/ifis-archives';
import {flashMessage} from '../../../../../utils/dialog';
import {startFinchFileDownload} from '../../../../../utils/download-manager';
import TransactionRow from '../components/transaction-row';

const dummyHistoricalTransactions = [
  {
    id: '134686577.0000000000',
    referenceId: '707MYHFDDXVK',
    dateCreated: '2018-05-23T07:59:56.681',
    status: 'Successful',
    source: '707MYHFDDXVK',
    destination: '2348022074343',
    debitedAmount: '10100.0',
    creditedAmount: '10100.0',
    cashAmount: '10000.0',
    consumerSP: 'IFIS',
    agentSA: '',
    agentSP: '',
    esbRef: '12931431527058795',
    externalRef: null,
    consumer: '',
    tokenType: 'CASH',
    transactionType: 'Money Transfer Inter SP',
    creator: 'okechimso',
  },
];

export default class ReportTransactionsScene extends React.Component {
  ifisArchives = new IfisArchives();
  transactionHistory = new TransactionHistory();
  transactionSerializer = new TransactionSerializer();

  state = {
    animationsDone: false,
    isLoading: true,
    pageNo: 1,
    pageSize: 20,
    transactions: [],
    user: {},
  };

  constructor() {
    super();

    this.downloadReports = this.downloadReports.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.fetchHistoricalData = this.fetchHistoricalData.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });
    });

    const {isHistoricalData = false} = this.props.route.params || {};

    this.setState({
      isHistoricalData,
    });

    this.loadData();

    setTimeout(() => {
      isHistoricalData ? this.fetchHistoricalData() : this.fetchData();
    }, 100);
  }

  async loadData() {
    const user = new UserSerializer(JSON.parse((await loadData(USER)) || '{}'));

    this.setState({
      user,
    });
  }

  async fetchData() {
    const {filters = null} = this.props.route.params || {};

    this.setState({
      didErrorOccurWhileFetching: null,
      isLoading: true,
    });

    if (filters !== null) {
      const {
        domainCode,
        endDate,
        startDate,
        statusCodeInt,
        transactionRef,
        transactionTypeInt,
        username,
      } = filters;

      const {status, response, code} =
        await this.transactionHistory.retrieveTransactionsByDate(
          domainCode,
          endDate
            ? moment(endDate, 'DD-MM-YYYY').format('YYYY-MM-DD[T23:59:59]')
            : null,
          this.state.pageNo,
          this.state.pageSize,
          null,
          null,
          startDate
            ? moment(startDate, 'DD-MM-YYYY').format('YYYY-MM-DD[T00:00:00]')
            : null,
          statusCodeInt,
          transactionTypeInt,
          null,
          transactionRef,
        );

      console.log('RETRIEVE TRANSACTIONS', status, response, code);

      if (status === ERROR_STATUS && code !== HTTP_NOT_FOUND) {
        this.setState({
          didErrorOccurWhileFetching: true,
          isLoading: false,
          transactions: this.state.transactions,
        });

        return;
      }

      if (code === HTTP_NOT_FOUND) {
        this.setState({
          transactions: this.state.transactions,
        });
      }

      const transactions = [
        ...this.state.transactions,
        ...this.sortTransactions(response.content),
      ];

      console.log({transactions});

      this.setState({
        didErrorOccurWhileFetching: false,
        isLoading: false,
        transactions,
        domainCode,
      });

      return;
    }

    const {status, response, code} =
      await this.transactionHistory.retrieveTransactions(
        this.state.user.isSuperAgent ? undefined : this.state.user.domainCode,
        this.state.pageNo,
        this.state.pageSize,
        null,
        null,
        null,
        null,
        null,
      );

    console.log('RETRIEVE TRANSACTIONS', status, response, code);

    if (status === ERROR_STATUS) {
      this.setState({
        didErrorOccurWhileFetching: true,
        isLoading: false,
        transactions: this.state.transactions,
      });

      return;
    }

    const transactions = [
      ...this.state.transactions,
      ...this.sortTransactions(
        response.content.filter(
          value => value.statusCode.toUpperCase() !== 'INITIATED',
        ),
      ),
    ];

    console.log({transactions});

    this.setState({
      didErrorOccurWhileFetching: false,
      isLoading: false,
      transactions,
    });
  }

  async fetchHistoricalData() {
    console.log('FETCHING HISTORICAL DATA');

    this.setState({
      didErrorOccurWhileFetching: null,
      isLoading: true,
    });

    const {gmppRef, startDate, endDate, transactionType} =
      this.props.route?.params?.filters || {};

    const userData = JSON.parse(await loadData(USER));
    console.log({userData});

    const agentPhone = null; // userData.mobileNo;

    const {status, response, code} =
      await this.ifisArchives.retrieveHistoricalData(
        agentPhone,
        this.state.pageNo,
        this.state.pageSize,
        startDate
          ? moment(startDate, 'DD-MM-YYYY').format('YYYY-MM-DD[T00:00:00]')
          : null,
        endDate
          ? moment(endDate, 'DD-MM-YYYY').format('YYYY-MM-DD[T23:59:59]')
          : null,
        transactionType,
        gmppRef,
      );

    console.log({status, response, code});

    if (status === ERROR_STATUS && code !== HTTP_NOT_FOUND) {
      this.setState({
        didErrorOccurWhileFetching: true,
        isLoading: false,
        transactions: this.state.transactions,
      });

      return;
    } else if (code === HTTP_NOT_FOUND) {
      this.setState({
        didErrorOccurWhileFetching: false,
        isLoading: false,
        transactions: [],
      });

      return;
    }

    const responseContent = response.content || response;

    this.setState({
      didErrorOccurWhileFetching: false,
      isLoading: false,
      transactions: [
        ...this.state.transactions,
        ...this.sortTransactions(
          responseContent?.filter(value => value.status !== 'Initiated'),
        ),
      ],
    });
  }

  get errorFallbackMessage() {
    const {isHistoricalData} = this.state;

    return (
      <View style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
        <Text big center>
          An error occured.
        </Text>
        <Button
          containerStyle={{
            marginTop: 8,
          }}
          onPress={isHistoricalData ? this.fetchHistoricalData : this.fetchData}
          title="RETRY"
          titleStyle={{
            color: COLOUR_BLUE,
          }}
          transparent
        />
      </View>
    );
  }

  get noContentMessage() {
    return (
      <View style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
        <Text big center>
          Nothing to display.
        </Text>
      </View>
    );
  }

  loadNextPage() {
    this.setState({
      pageNo: this.state.pageNo + 1,
    });

    setTimeout(
      () =>
        this.state.isHistoricalData
          ? this.fetchHistoricalData()
          : this.fetchData(),
      0,
    );
  }

  sortTransactions(transactions) {
    let sections = [];

    transactions?.map((value, index) => {
      const serializedTransaction = this.state.isHistoricalData
        ? this.transactionSerializer.serializeHistoricalData(value)
        : this.transactionSerializer.serializeApiData(value);

      if (
        sections.find(
          value => value.title === serializedTransaction.formattedDate,
        )
      ) {
        sections.map(section => {
          if (section.title === serializedTransaction.formattedDate) {
            section.data.push(serializedTransaction);
            return;
          }
        });

        return;
      }

      sections.push({
        title: serializedTransaction.formattedDate,
        data: [serializedTransaction],
      });
    });

    return sections;
  }

  renderItem(item, index) {
    return (
      <TransactionRow
        isHistoricalData={this.state.isHistoricalData}
        onPressOut={() =>
          this.props.navigation.navigate('TransactionSummary', {
            transaction: item,
          })
        }
        transaction={item}
      />
    );
  }

  renderSectionHeader(item) {
    return <Text style={{lineHeight: 32, marginLeft: 10}}>{item}</Text>;
  }

  isCloseToBottom({layoutMeasurement, contentOffset, contentSize}) {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  }

  async downloadReports() {
    flashMessage(
      null,
      'Your download has started! Check your status bar for the download progress.',
      CASUAL,
    );

    const {filters} = this.props.route?.params || {};

    const currentUser = JSON.parse(await loadData(USER));

    const domainCode = currentUser.domainCode;
    const endDate_ = encodeURIComponent(
      filters.endDate
        ? moment(filters.endDate, 'DD-MM-YYYY').format('YYYY-MM-DD[T23:59:59]')
        : moment().format('YYYY-MM-DD[T23:59:59]'),
    );
    const startDate_ = encodeURIComponent(
      filters.startDate
        ? moment(filters.startDate, 'DD-MM-YYYY').format(
            'YYYY-MM-DD[T00:00:00]',
          )
        : moment().subtract(1, 'days').format('YYYY-MM-DD[T00:00:00]'),
    );

    const fullDownloadUrl = `${TRANSACTION_HISTORY_API_BASE_URL}/transactions/search/download/details?startDate=${startDate_}&endDate=${endDate_}&agentCode=${domainCode}&domainCode=${domainCode}`;

    startFinchFileDownload(
      fullDownloadUrl,
      MIME_TYPE_CSV,
      'Quickteller Paypoint Report',
    );
  }

  rightComponent() {
    const {isHistoricalData, domainCode} = this.state;

    return (
      <View style={{flexDirection: 'row'}}>
        {ENVIRONMENT_IS_TEST && (
          <Icon
            color={COLOUR_WHITE}
            name="download"
            onPress={() => {
              console.log('CLICKED DOWNLOAD BUTTON');
              this.downloadReports();
            }}
            containerStyle={{
              marginRight: 12,
            }}
            size={24}
            type="feather"
            underlayColor="transparent"
          />
        )}
        <Icon
          color={COLOUR_WHITE}
          name="tune"
          onPress={() => {
            this.props.navigation.replace('ReportTransactionsFilter', {
              isHistoricalData,
              domainCode,
            });
          }}
          size={24}
          type="material"
          underlayColor="transparent"
        />
      </View>
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
    const {animationsDone, isHistoricalData} = this.state;
    if (!animationsDone) {
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
          rightComponent={this.rightComponent()}
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_LIGHT,
          }}
          title={isHistoricalData ? 'Historical Transactions' : 'Transactions'}
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
          }}
        />

        {/* <Text>{JSON.stringify(this.state.transactions)}</Text>  */}

        {Boolean(this.state.transactions.length) && (
          <SectionList
            keyExtractor={(item, index) => item + index}
            onScroll={({nativeEvent}) => {
              if (this.isCloseToBottom(nativeEvent)) {
                this.loadNextPage();
              }
            }}
            renderItem={({item, index, section}) =>
              this.renderItem(item, index)
            }
            renderSectionHeader={({section: {title}}) =>
              this.renderSectionHeader(title)
            }
            scrollEventThrottle={400}
            sections={this.state.transactions}
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

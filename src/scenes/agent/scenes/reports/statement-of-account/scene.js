import moment from 'moment';
import React from 'react';
import {InteractionManager, SectionList, View} from 'react-native';
import {Icon} from 'react-native-elements';
import ActivityIndicator from '../../../../../components/activity-indicator';
import Button from '../../../../../components/button';
import Header from '../../../../../components/header';
import Text from '../../../../../components/text';
import {MIME_TYPE_CSV, USER} from '../../../../../constants';
import {ERROR_STATUS} from '../../../../../constants/api';
import {
  ENVIRONMENT_IS_TEST,
  TRANSACTION_HISTORY_API_BASE_URL,
} from '../../../../../constants/api-resources';
import {CASUAL} from '../../../../../constants/dialog-priorities';
import {
  COLOUR_BLUE,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../../../constants/styles';
import TransactionSerializer from '../../../../../serializers/resources/transaction';
import TransactionHistory from '../../../../../services/api/resources/transaction-history';
import {flashMessage} from '../../../../../utils/dialog';
import {startFinchFileDownload} from '../../../../../utils/download-manager';
import {loadData} from '../../../../../utils/storage';
import StatementOfAccountRow from '../components/statement-of-account-row';

export default class ReportTransactionsScene extends React.Component {
  transactionHistory = new TransactionHistory();
  transactionSerializer = new TransactionSerializer();

  state = {
    animationsDone: false,
    category: null,
    isLoading: true,
    pageNo: 1,
    pageSize: 20,
    transactions: [],
  };

  constructor() {
    super();

    this.fetchData = this.fetchData.bind(this);
    this.downloadReports = this.downloadReports.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });
    });

    const {category = null} = this.props.route.params || {};

    this.setState({
      category,
      walletJournalTypeId: category === 'Transactions' ? 1 : 2,
    });

    setTimeout(this.fetchData, 0);
  }

  async fetchData() {
    const {pageNo, pageSize, walletJournalTypeId} = this.state;
    const {filters = null} = this.props.route.params || {};

    this.setState({
      didErrorOccurWhileFetching: null,
      isLoading: true,
    });

    let startDate = moment()
      .subtract(1, 'months')
      .format('YYYY-MM-DD[T]HH:mm:ss');
    let endDate = moment().format('YYYY-MM-DD[T]HH:mm:ss');

    if (filters !== null) {
      endDate = filters.endDate;
      startDate = filters.startDate;
    }
    const {sortDesc = null} = this.props.route.params || {};

    const {status, response, code} =
      await this.transactionHistory.getStatementOfAccount(
        pageNo,
        pageSize,
        startDate,
        endDate,
        walletJournalTypeId,
        sortDesc,
      );

    console.log('RETRIEVE STATEMENT OF ACCOUNT', status, response, code);

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
      ...this.sortTransactions(response.content),
    ];

    this.setState({
      didErrorOccurWhileFetching: false,
      isLoading: false,
      transactions,
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
      const serializedTransaction =
        this.transactionSerializer.serializeStatementOfAccountData(value);

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
      <StatementOfAccountRow
        onPressOut={() =>
          this.props.navigation.navigate('StatementOfAccountDetails', {
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
    const {category = null} = this.props.route.params || {};

    flashMessage(
      null,
      'Your download has started! Check your status bar for the download progress.',
      CASUAL,
    );

    const {filters = null} = this.props.route.params || {};

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
        : moment().subtract(1, 'months').format('YYYY-MM-DD[T00:00:00]'),
    );

    const fullDownloadUrl = `${TRANSACTION_HISTORY_API_BASE_URL}/journal/mini-statement/download?startDate=${startDate_}&endDate=${endDate_}&agentCode=${domainCode}&domainCode=${domainCode}&walletJournalType=${
      category === 'Transactions' ? 1 : 2
    }`;
    console.log({fullDownloadUrl});

    startFinchFileDownload(
      fullDownloadUrl,
      MIME_TYPE_CSV,
      'Quickteller Paypoint Report',
    );
  }

  rightComponent() {
    const {category = null} = this.props.route.params || {};

    return (
      <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
        {ENVIRONMENT_IS_TEST && (
          <Icon
            color={COLOUR_WHITE}
            name="download"
            onPress={() => {
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
          onPress={() =>
            this.props.navigation.replace('StatementOfAccountFilter', {
              category,
            })
          }
          size={24}
          type="material"
          underlayColor="transparent"
        />
      </View>
    );
  }

  render() {
    const {category = null} = this.props.route.params || {};
    const {sortDesc = null} = this.props.route.params || {};

    const title = sortDesc
      ? 'Commission History'
      : `Statement of ${category} Account`;
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
          title={title}
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
          }}
        />

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

        {this.state.isLoading && (
          <ActivityIndicator
            containerStyle={{
              height: 100,
            }}
          />
        )}
      </View>
    );
  }
}

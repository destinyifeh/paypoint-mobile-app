/* eslint-disable react/require-render-return */
import Clipboard from '@react-native-clipboard/clipboard';
import Moment from 'moment';
import React from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  InteractionManager,
  SectionList,
  StyleSheet,
  View,
} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {Icon} from 'react-native-elements';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {connect} from 'react-redux';
import ActivityIndicator from '../../../../components/activity-indicator';
import AnimatedNumber from '../../../../components/animated-number';
import Button from '../../../../components/button';
import ClickableListItem from '../../../../components/clickable-list-item';
import FormPicker from '../../../../components/form-controls/form-picker';
import Header from '../../../../components/header';
import Skeleton from '../../../../components/skeleton';
import Text from '../../../../components/text';
import {
  AGENT,
  COPIED_TO_CLIPBOARD,
  SHOW_STATUS_BAR,
  USER,
  WALLET,
  WINDOW_WIDTH,
} from '../../../../constants';
import {ERROR_STATUS, HTTP_NOT_FOUND} from '../../../../constants/api';
import {CASUAL, UNIMPORTANT} from '../../../../constants/dialog-priorities';
import {
  COLOUR_BLUE,
  COLOUR_DARK_RED,
  COLOUR_GREEN,
  COLOUR_LIGHT_GREEN,
  COLOUR_LIGHT_RED,
  COLOUR_LIGHT_YELLOW,
  COLOUR_MID_GREY,
  COLOUR_RED,
  COLOUR_WHITE,
  COLOUR_YELLOW,
  CONTENT_LIGHT,
  LIGHT_RED,
  LINE_HEIGHT_MID,
} from '../../../../constants/styles';
import amountField from '../../../../fragments/amount-field';
import AgentSerializer from '../../../../serializers/resources/agent';
import TransactionSerializer from '../../../../serializers/resources/transaction';
import UserSerializer from '../../../../serializers/resources/user';
import WalletSerializer from '../../../../serializers/resources/wallet';
import UserManagement from '../../../../services/api/resources/user-management';
import {
  platformService,
  settlementService,
  transactionHistoryService,
  transactionService,
} from '../../../../setup/api';
import {convertNgkToNgn} from '../../../../utils/converters/currencies';
import {flashMessage} from '../../../../utils/dialog';
import handleErrorResponse from '../../../../utils/error-handlers/api';
import {formatDate, formatNgnAmount} from '../../../../utils/formatters';
import ApplicationSerializer from '../../../../utils/serializers/application';
import {loadData} from '../../../../utils/storage';
import TransactionRow from '../../../agent/scenes/reports/components/transaction-row';
// import { BalanceCard } from "../../../agent/scenes/home/scenes/default-scene/tabs/home-tab";
const screenWidth = Dimensions.get('window').width;

export class TopAgentCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={{
          justifyContent: 'space-between',
          backgroundColor: 'white',
          borderRadius: 12,
          elevation: 1,
          marginRight: 20,
          width: '100%',
          flex: 0,
          alignSelf: 'auto',
        }}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#F3F4F6',
            padding: 20,
            width: '100%',
          }}>
          <View
            style={{
              flex: 1,
              alignItems: 'flex-start',
              width: '70%',
            }}>
            <Text bold>Agent Name</Text>
          </View>

          <View
            style={{
              flex: 1,
              width: '10%',
            }}>
            <Text bold>Amount Earned</Text>
          </View>

          <Text bold />
        </View>
        <View style={{flex: 1}}>
          <FlatList
            data={this.props.response}
            keyExtractor={item => item.agentId}
            renderItem={({item}) => <TopAgentListItem item={item} />}
          />
        </View>
      </View>
    );
  }
}
export class WithdrawalHistoryCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={{
          justifyContent: 'space-between',
          backgroundColor: COLOUR_WHITE,
          borderRadius: 12,
          padding: 10,
          marginRight: 20,
          width: '100%',
          flex: 0,
          alignSelf: 'auto',
        }}>
        <View style={{flex: 1}}>
          <FlatList
            data={this.props.response}
            keyExtractor={item => item.uniqueReference}
            renderItem={({item}) => (
              <WithdrawalHistorytListItem
                item={item}
                onPressOut={() => {
                  this.props.navigate.navigate(
                    'AggregatorCommissionsWithdrawalDetails',
                    {
                      withdrawal: item,
                    },
                  );
                }}
              />
            )}
          />
        </View>
      </View>
    );
  }
}
export class ChartCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {periods, values} = this.props;
    const chartConfig = {
      backgroundGradientFrom: '#FFFFFF',
      backgroundGradientFromOpacity: 0,
      backgroundGradientTo: '#FFFFFF',
      backgroundGradientToOpacity: 0.5,
      color: (opacity = 1) => `rgba(135, 135, 135, ${opacity})`,
      strokeWidth: 2, // optional, default 3
      barPercentage: 0.5,
      useShadowColorFromDataset: false, // optional
    };
    const data = {
      labels: periods.length
        ? periods
        : ['January', 'February', 'March', 'April', 'May', 'June'],
      // labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [
        {
          data: values.length ? values : [0, 0, 0, 0, 0, 0],
          // data: [20, 45, 28, 80, 99, 43],
          color: (opacity = 0.45) => `rgba(172, 246, 221, ${opacity})`, // optional
          strokeWidth: 2, // optional
        },
      ],
      // optional
    };

    return (
      <View
        style={{
          justifyContent: 'space-between',
          backgroundColor: 'white',
          borderRadius: 12,
          elevation: 5,
          height: 300,
          marginRight: 20,
          width: '100%',
        }}>
        <View
          style={{
            flexDirection: 'column',
            padding: 20,
            width: '100%',
          }}>
          <Text bold>Commission Performance</Text>
        </View>
        <View>
          <LineChart
            data={data}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
          />
        </View>
      </View>
    );
  }
}
export class WithdrawalBalanceCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      amount,
      withdrawalVariancePercent,
      currentEarningValue,
      containerStyle,
      didLoadBalanceFail,
      isLoading,
      retry,
      timestamp,
      title,
      showAccountNo,
      accountNo,
      bankName,
    } = this.props;

    return (
      <View
        style={{
          justifyContent: 'space-between',
          backgroundColor: COLOUR_WHITE,
          borderRadius: 12,
          elevation: 5,
          height: 170,
          marginRight: 20,
          width: '100%',
        }}>
        <View
          style={{
            flexDirection: 'column',
            padding: 20,
            width: '100%',
          }}>
          <Text semiBold>{title}</Text>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
            }}>
            <View
              style={{
                width: '70%',
              }}>
              <Text style={{height: 7}} />
              <AnimatedNumber
                blue
                steps={1}
                formatter={value =>
                  amountField('NGN', convertNgkToNgn(value || '0.00'))
                }
                semiBold
                style={{
                  fontSize: 32,
                  lineHeight: 32,
                }}
                value={amount}
              />
            </View>
            {withdrawalVariancePercent <= 0 ? (
              <View
                style={{
                  width: '30%',
                  flexDirection: 'row',
                  backgroundColor: COLOUR_LIGHT_RED,
                  alignContent: 'center',
                  padding: 10,
                  borderRadius: 5,
                  justifyContent: 'center',
                }}>
                <Image
                  source={require('../../../../assets/media/images/ArrowFatLinesDown.png')}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
                <Text style={{color: COLOUR_RED}} semiBold>
                  {withdrawalVariancePercent}%
                </Text>
              </View>
            ) : (
              <View
                style={{
                  marginTop: 10,
                  width: '30%',
                  flexDirection: 'row',
                  backgroundColor: COLOUR_LIGHT_GREEN,
                  alignContent: 'center',
                  justifyContent: 'center',
                  padding: 10,
                  borderRadius: 5,
                }}>
                <Image
                  source={require('../../../../assets/media/images/arrows.png')}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
                <Text style={{color: COLOUR_GREEN}} semiBold>
                  {withdrawalVariancePercent}%
                </Text>
              </View>
            )}
          </View>
        </View>
        <View />
      </View>
    );
  }
}

export class BalanceCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      amount,
      containerStyle,
      didLoadBalanceFail,
      isLoading,
      retry,
      timestamp,
      title,
      showAccountNo,
      accountNo,
      bankName,
    } = this.props;

    const copyContentToClipboard = () => {
      Clipboard.setString(accountNo);

      flashMessage(null, COPIED_TO_CLIPBOARD, CASUAL);
    };

    return (
      <View
        style={{
          justifyContent: 'space-between',
          backgroundColor: 'white',
          borderRadius: 12,
          elevation: 5,
          height: 170,
          marginRight: 20,
          padding: 20,
          width: '100%',
          ...containerStyle,
        }}>
        <View>
          <Text semiBold>{`\n${title}`}</Text>
          <Text
            small
            style={{color: COLOUR_MID_GREY, lineHeight: LINE_HEIGHT_MID}}>
            as at {Moment(timestamp).format('MMMM Do, YYYY h:mma')}
          </Text>
        </View>

        {showAccountNo && (
          <>
            <View>
              <Text style={{height: 7}} />
              <AnimatedNumber
                blue
                steps={1}
                formatter={value =>
                  amountField('NGN', JSON.stringify(value || '0.00'))
                }
                semiBold
                style={{
                  fontSize: 32,
                  lineHeight: 32,
                }}
                value={amount}
              />
            </View>
            <View>
              <Text semiBold>{accountNo}</Text>
              <Text small style={{color: COLOUR_MID_GREY, lineHeight: 13}}>
                {bankName}
              </Text>
            </View>
          </>
        )}
        {!showAccountNo && (
          <>
            <View>
              <Text style={{height: 7}} />
              <AnimatedNumber
                blue
                steps={1}
                formatter={value =>
                  amountField('NGN', JSON.stringify(value || '0.00'))
                }
                semiBold
                style={{
                  fontSize: 35,
                  lineHeight: 40,
                }}
                value={amount}
              />
            </View>
            <View>
              <Text semiBold />
              <Text small style={{color: COLOUR_MID_GREY, lineHeight: 13}} />
            </View>
            {isLoading && (
              <ActivityIndicator
                containerStyle={{
                  position: 'absolute',
                  right: 20,
                  bottom: 20,
                }}
                size="small"
              />
            )}
            {didLoadBalanceFail && !isLoading && (
              <ClickableListItem
                onPress={retry}
                style={{
                  position: 'absolute',
                  right: 18,
                  bottom: 18,
                }}>
                <Icon color={COLOUR_BLUE} name="refresh" size={24} />
              </ClickableListItem>
            )}
          </>
        )}
        {showAccountNo && (
          <ClickableListItem
            onPress={copyContentToClipboard}
            style={{
              position: 'absolute',
              right: 16,
              bottom: 14,
            }}>
            {accountNo !== '...' && (
              <Icon
                color={COLOUR_BLUE}
                name="copy"
                type="font-awesome"
                size={20}
              />
            )}
          </ClickableListItem>
        )}

        {this.props.buttonTitle && (
          <Button
            disabled={this.props.isDisabled}
            buttonStyle={{
              backgroundColor: 'transparent',
              padding: 20,
              ...this.props.buttonStyle,
            }}
            containerStyle={{
              backgroundColor: 'transparent',
              flex: 0.4,
              position: 'absolute',
              top: 0,
              right: 0,
              ...this.props.buttonContainerStyle,
            }}
            title={this.props.buttonTitle}
            titleStyle={{
              color: COLOUR_RED,
              fontSize: 13,
              letterSpacing: 1.15,
              textAlign: 'right',
            }}
            onPressOut={() => this.props.buttonOnPressOut()}
          />
        )}
      </View>
    );
  }
}

export class TopAgentListItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {item} = this.props;

    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          backgroundColor: 'white',
          alignItems: 'flex-start',
          paddingHorizontal: 20,
          paddingVertical: 20,
          width: '100%',
        }}>
        <View style={{flex: 1, alignItems: 'flex-start', width: '70%'}}>
          <Text semiBold>{item.businessName}</Text>
        </View>

        <View
          style={{
            flex: 1,
            alignItems: 'flex-start',
            width: '10%',
            paddingStart: 23,
          }}>
          <Text semiBold>
            {formatNgnAmount(convertNgkToNgn(item.commission || 0))}
          </Text>
        </View>
        <Icon
          color="#353F50"
          name="chevron-right"
          size={30}
          type="material"
          underlayColor="transparent"
        />
      </View>
    );
  }
}

export class WithdrawalHistorytListItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {item} = this.props;
    const {journalEntryDate, debitAmount, status, uniqueReference} = item;
    let statusComponent;

    switch (status) {
      case 'Successful':
        statusComponent = <SuccessComponent />;
        break;
      case 'Pending':
        statusComponent = <PendingComponent />;
        break;
      case 'Failed':
        statusComponent = <FailedComponent />;
        break;
      default:
        statusComponent = <Text>Unknown Status</Text>;
    }

    return (
      <ClickableListItem onPressOut={this.props.onPressOut}>
        <View
          style={{
            flexDirection: 'column',
            backgroundColor: '#F3F5F6',
            padding: 10,
            width: '100%',
            marginBottom: 10,
          }}>
          <View style={{padding: 14}}>
            <Text style={{fontSize: 12}} bold>
              {formatDate(journalEntryDate)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#F3F5F6',
              padding: 10,
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <Text semiBold> Transaction Wallet</Text>
            <AnimatedNumber
              blue
              steps={1}
              formatter={value => formatNgnAmount(convertNgkToNgn(value || 0))}
              semiBold
              style={{
                fontSize: 16,
                lineHeight: 24,
              }}
              value={debitAmount}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#F3F5F6',
              justifyContent: 'space-between',
              width: '100%',
              paddingHorizontal: 13,
            }}>
            <Text semiBold>{uniqueReference}</Text>
            {statusComponent}
          </View>
        </View>
      </ClickableListItem>
    );
  }
}

class FailedComponent extends React.Component {
  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          width: 75,
          height: 28,
          backgroundColor: LIGHT_RED,
          justifyContent: 'center',
          paddingVertical: 5,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: COLOUR_DARK_RED,
        }}>
        <View style={{marginTop: 3}}>
          <Icon
            color={COLOUR_DARK_RED}
            name="fiber-manual-record"
            size={9}
            type="material"
            underlayColor="transparent"
          />
        </View>

        <Text style={{fontSize: 14, color: COLOUR_DARK_RED}}>Failed</Text>
      </View>
    );
  }
}
class SuccessComponent extends React.Component {
  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          width: 103,
          height: 28,
          backgroundColor: COLOUR_LIGHT_GREEN,
          justifyContent: 'center',
          paddingVertical: 5,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: COLOUR_GREEN,
        }}>
        <View style={{marginTop: 3}}>
          <Icon
            color={COLOUR_GREEN}
            name="fiber-manual-record"
            size={9}
            type="material"
            underlayColor="transparent"
          />
        </View>

        <Text style={{fontSize: 14, color: COLOUR_GREEN}}>Successful</Text>
      </View>
    );
  }
}

class PendingComponent extends React.Component {
  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          width: 80,
          height: 28,
          backgroundColor: COLOUR_LIGHT_YELLOW,
          justifyContent: 'center',
          paddingVertical: 5,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: COLOUR_YELLOW,
        }}>
        <View style={{marginTop: 3}}>
          <Icon
            color={COLOUR_YELLOW}
            name="fiber-manual-record"
            size={9}
            type="material"
            underlayColor="transparent"
          />
        </View>

        <Text style={{fontSize: 14, color: COLOUR_YELLOW}}>Pending</Text>
      </View>
    );
  }
}
class CommissionsEarnedDashBoard extends React.Component {
  platform = platformService;
  settlement = settlementService;
  transaction = transactionService;
  transactionHistory = transactionHistoryService;

  userManagement = new UserManagement();
  // transactionHistory = new TransactionHistory();
  transactionSerializer = new TransactionSerializer();

  state = {
    activeSlide: 0,
    makeCallToAgentsMe: false, //MAKE_CALL_TO_AGENTS_ME,
    wallet: new WalletSerializer(),
    hardReloadFailed: null,
    isFetchingTopContributors: false,
    isChangingDateInterval: false,
    isFetchingCommissionWithdrawalReport: false,
    isFetchingCommissionStats: false,
    isFetchingWithdrawalSummary: false,
    isFetchingEarningPerformance: false,
    isFetchingCommissionEarningsStats: false,
    isOnboarded: null,
    isLoadingWallet: false,
    overlayErrorViewScale: new Animated.Value(0),
    scrollY: new Animated.Value(0),
    pendingState: {},
    topContributors: [],
    withdrawalSummary: {},
    commissionStats: {},
    earningStats: {},
    currentWithdrawalValue: 0,
    withdrawalVariancePercent: 0,
    currentEarningValue: 0,
    earningValue: 0,
    ledgerBalance: 0,
    earningVariancePercent: 0,
    transactions: [],
    earningPerformance: [],
    commissionWithdrawalReport: [],
    showPosBanner: false,
    chartPeriods: [],
    chartValues: [],
    pageNo: 1,
    pageSize: 20,
    dateInterval: 2,
  };

  constructor() {
    super();
    this.renderWithdrawalHistory = this.renderWithdrawalHistory.bind(this);
    this.renderTransactionHistory = this.renderTransactionHistory.bind(this);
    this.renderTopContributor = this.renderTopContributor.bind(this);
    this.doHardRefresh = this.doHardRefresh.bind(this);
    this.doSoftRefresh = this.doSoftRefresh.bind(this);
    this.doFastRefresh = this.doFastRefresh.bind(this);
    this._loadWallet = this._loadWallet.bind(this);
    this._loadUser = this._loadUser.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.renderSectionHeader = this.renderSectionHeader.bind(this);
    this.loadTopContributors = this.loadTopContributors.bind(this);
    this.loadCommissionStats = this.loadCommissionStats.bind(this);
    this.loadWithdrawalSummarry = this.loadWithdrawalSummarry.bind(this);
    this.loadEarningPerformanceYearly =
      this.loadEarningPerformanceYearly.bind(this);
    this.loadCommissionWithdrawalReport =
      this.loadCommissionWithdrawalReport.bind(this);
    this.changeDateInterval = this.changeDateInterval.bind(this);
    this.changeWithdrawalDateInterval =
      this.changeWithdrawalDateInterval.bind(this);
    this.loadCommissionEarningsStat =
      this.loadCommissionEarningsStat.bind(this);
  }

  componentDidMount() {
    this.hardLoadTransactionHistory();
    this.loadEarningPerformanceYearly();
    this.loadWithdrawalSummarry();
    this.loadCommissionWithdrawalReport();
    this.loadCommissionStats();
    this.loadCommissionEarningsStat();
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });
    });

    loadData(SHOW_STATUS_BAR).then(response => {
      this.setState({
        showStatusCard: response,
      });
    });

    const doHardLoadUser = false;
    const doHardLoadAgent = this.state.makeCallToAgentsMe;
    this.doHardRefresh(doHardLoadUser, doHardLoadAgent);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.isFastRefreshPending !== prevProps &&
      this.props.isFastRefreshPending
    ) {
      this.doFastRefresh();
      this.props.setIsFastRefreshPending(false);
    }

    if (
      this.props.navigationState.currentScreen !==
      prevProps.navigationState.currentScreen
    ) {
      console.log('SUPPOSED TO DO STUFF HERE.');
      this.isCommissionEarnedDashboard() &&
        setTimeout(
          () =>
            this.setState({
              ...this.state.pendingState,
            }),
          800,
        );
    }
  }

  async changeDateInterval(dateInterval) {
    this.setState(
      {
        dateInterval,
        isChangingDateInterval: true,
      },
      async () => {
        console.log(
          'isFetchingTopContributors',
          this.state.isFetchingTopContributors,
        );
        console.log('newDateInterval', this.state.dateInterval);

        await this.loadTopContributors();
        await this.loadEarningPerformanceYearly();
        await this.loadCommissionEarningsStat();

        this.setState({
          isChangingDateInterval: false,
        });
      },
    );
  }

  async changeWithdrawalDateInterval(dateInterval) {
    this.setState(
      {
        dateInterval,
        isChangingDateInterval: true,
      },
      async () => {
        await this.loadCommissionStats();
        await this.loadCommissionWithdrawalReport();

        this.setState({
          isChangingDateInterval: false,
        });
      },
    );
  }

  async _loadAgent() {
    // if (!this.state.makeCallToAgentsMe) {
    //   return null;
    // }

    const savedAgentData = JSON.parse(await loadData(AGENT));

    if (savedAgentData === null) {
      return;
    }

    const currentAgent = new AgentSerializer(savedAgentData);

    this.setState({
      currentAgent,
    });

    console.log('NUGAGEE AGENT 3', currentAgent);

    return currentAgent;
  }

  async _loadApplication() {
    const currentApplicationData = JSON.parse(await loadData(APPLICATION));

    if (!currentApplicationData) {
      return;
    }

    const currentApplication = new ApplicationSerializer(
      currentApplicationData,
    );

    this.setState({
      currentApplication,
    });

    return currentApplication;
  }

  async _loadUser() {
    const currentUser = new UserSerializer(JSON.parse(await loadData(USER)));

    this.setState({
      currentUser,
    });

    console.log('CURRENT USER NUGAGEE', currentUser);

    return currentUser;
  }
  async _loadWallet(currentAgent, currentUser, isFastRefresh = false) {
    let oldWallet = await loadData(WALLET + currentUser.businessMobileNo);
    console.log('oldWalletDashboard', oldWallet);

    try {
      oldWallet = JSON.parse(oldWallet) || {};
    } catch {
      oldWallet = oldWallet || {};
    }

    console.log(
      'addition',
      oldWallet.commissions_earned + oldWallet.unsettled_balance,
    );

    const ledgerBalance =
      oldWallet.commissions_earned + oldWallet.unsettled_balance;

    this.setState({
      isLoadingWallet: false,
      wallet: oldWallet,
      ledgerBalance,
    });

    let walletBalance = {};

    let settlementBalance = null;

    if (this.state.makeCallToAgentsMe) {
      settlementBalance = await this.settlement.getWalletUnsettledBalanceByRef(
        currentAgent.walletRef,
      );
      walletBalance = await this.transaction.getWalletBalanceByPost({
        businessPhoneNo: currentAgent.phoneNumber,
      });
    } else {
      walletBalance = await this.transaction.getWalletBalance();
    }

    const walletSerializer = new WalletSerializer({
      commissionWalletBalance:
        walletBalance?.status !== SUCCESS_STATUS
          ? oldWallet.commissions_earned * 100
          : walletBalance.response.commissionWalletBalance,
      ledgerBalance:
        walletBalance?.status !== SUCCESS_STATUS
          ? oldWallet.ledger_balance * 100
          : walletBalance.response.ledgerBalance,
      transactionWalletBalance:
        walletBalance?.status !== SUCCESS_STATUS
          ? oldWallet.current_balance * 100
          : walletBalance.response.transactionWalletBalance,
      unsettledWalletBalance:
        walletBalance?.status !== SUCCESS_STATUS
          ? oldWallet.unsettled_balance * 100
          : walletBalance.response.unsettledWalletBalance,
      walletBalanceTimestamp:
        walletBalance?.status !== SUCCESS_STATUS
          ? oldWallet.walletBalanceTimestamp
          : new Date(),
    });

    const wallet = walletSerializer.asJson();

    await saveData(WALLET + currentUser.businessMobileNo, wallet);

    const pendingState = {
      wallet,
    };

    this.setState({
      wallet: this.isCommissionEarnedDashboard() ? wallet : this.state.wallet,
      isLoadingWallet: false,
      didLoadWalletBalanceFail: walletBalance.status === ERROR_STATUS,
      pendingState: this.isCommissionEarnedDashboard() ? null : pendingState,
    });

    console.log('myWallet', this.state.wallet);
  }

  isCommissionEarnedDashboard() {
    const {
      navigationState: {currentScreen},
    } = this.props;
    return ['Agent', 'AggregatorCommissionsEarned'].includes(currentScreen);
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

  async hardLoadUser() {
    const currentUserResponse = await this.platform.getCurrentUser();
    const currentUserResponseStatus = currentUserResponse.status;
    const currentUserResponseObj = currentUserResponse.response;

    if (currentUserResponseStatus === ERROR_STATUS) {
      this.setState({
        hardReloadFailed: true,
      });

      return new UserSerializer(JSON.parse(await loadData(USER)));
    }

    const currentUser = new UserSerializer(currentUserResponseObj);

    this.setState({
      currentUser,
    });

    console.log('HARDLOAD USER NUGAGEE', currentUser);

    await saveData(USER, currentUserResponseObj);

    return currentUser;
  }

  async doHardRefresh(doHardLoadUser = true, doHardLoadAgent = true) {
    this.setState({
      hardReloadFailed: null,
      isLoading: true,
    });

    // flashMessage(null, 'Please, hold on...', CASUAL);
    // hard-load user because domain might have changed from APPLICANT
    const serializedUser = doHardLoadUser
      ? await this.hardLoadUser()
      : await this._loadUser();

    if (serializedUser.isAgent) {
      if (!doHardLoadAgent) {
        console.log('NOT HARD LOADING AGENT');
        this.setState({
          isLoading: false,
        });
      } else {
        await this.hardLoadAgent();
      }
    }

    if (serializedUser.isSuperAgent) {
      if (!doHardLoadAgent) {
        this.setState({
          isLoading: false,
        });
      } else {
        await this.hardLoadSuperAgent();
      }
    }

    if (serializedUser.isApplicant) {
      await this.hardLoadApplication();
    }

    await this.doSoftRefresh();

    this.setState({
      isLoading: false,
    });
  }

  async doSoftRefresh() {
    let isDisabled = false;

    const currentUser = await this._loadUser();
    isDisabled =
      isDisabled || currentUser.isDisabled || currentUser.isDomainDisabled;

    console.log('User based isDisabled', isDisabled);
    let currentAgent = null;

    if (currentUser.isAgent) {
      currentAgent = await this._loadAgent();

      console.log('DID HARD RELOAD FAIL', this.state.hardReloadFailed);

      if (true) {
        this._loadWallet(currentAgent, currentUser);

        this.loadTopContributors();
        this.loadCommissionStats();
        this.loadWithdrawalSummarry();
        this.hardLoadStatementOfAccount();
        this.hardLoadTransactionHistory();
        this.loadCommissionWithdrawalReport();
        // this.loadEarningPerformanceYearly();
        this.hardLoadAgent();

        // TODO this could go as soon as currentUser.domainStatus can return NEW
        // isDisabled = isDisabled || currentAgent?.isDisabled;
        // console.log('Agent based isDisabled', isDisabled);
      }
    } else if (currentUser.isSuperAgent) {
      this._loadWallet(null, currentUser);
      this.hardLoadTransactionHistory();
      this.loadCommissionWithdrawalReport();
      this.loadTopContributors();
      this.loadCommissionStats();
      this.loadWithdrawalSummarry();
      this.hardLoadStatementOfAccount();
      // this.loadEarningPerformanceYearly();
    } else if (currentUser.isApplicant) {
      const currentApplication = await this._loadApplication();

      isDisabled = isDisabled || currentApplication.isDisabled;
    }

    this.setState({
      isNewUser: currentUser.isDomainNew,
      isOnboarded: currentUser.isOnboarded,
      isSetupComplete: !currentAgent ? null : currentAgent.isSetupComplete,
      isDisabled,
    });
  }

  async doFastRefresh() {
    const currentAgent = null,
      currentUser = null,
      isFastRefresh = true;

    this._loadWallet(currentAgent, currentUser, isFastRefresh);
    this.loadTopContributors();
    this.loadCommissionStats();
    this.loadWithdrawalSummarry();
    this.loadEarningPerformanceYearly();
    this.hardLoadTransactionHistory();
    this.loadCommissionWithdrawalReport();
    setTimeout(() => {
      // this.hardLoadTopContributors(isFastRefresh);
      this.hardLoadStatementOfAccount(isFastRefresh);
    }, 3000);
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
    return (
      <Text
        style={{
          backgroundColor: '#F3F3F4',
          lineHeight: 32,
          marginLeft: 0,
          paddingLeft: 16,
        }}>
        {item}
      </Text>
    );
  }

  async hardLoadTransactionHistory(isFastRefresh = false) {
    this.setState({
      isFetchingTransactions: true, //!isFastRefresh,
      transactions: isFastRefresh ? this.state.transactions : [],
    });

    const {code, response, status} =
      await this.transactionHistory.retrieveTransactions(
        this.state.currentUser.domainCode,
      );

    if (status === ERROR_STATUS) {
      flashMessage(null, await handleErrorResponse(response), UNIMPORTANT);

      this.setState({
        isFetchingTransactions: false,
        transactions: code === HTTP_NOT_FOUND ? [] : null,
      });

      return;
    }

    this.setState({
      isFetchingTransactions: false,
      transactions: this.sortTransactions(
        response.content.filter(
          value => value.statusCode.toUpperCase() !== 'INITIATED',
        ),
      ),
    });
  }

  async loadTopContributors() {
    this.setState({
      isFetchingTopContributors: true, //!isFastRefresh,
      topContributors: [],
    });

    const {code, response, status} =
      await this.transactionHistory.getTopContributors(
        '2023-08-01T00:00:00',
        '2023-08-31T23:59:59',
        this.state.dateInterval,
      );

    if (status === 'ERROR') {
      this.setState({
        isFetchingTopContributors: false,
        topContributors: code === HTTP_NOT_FOUND ? [] : null,
      });
      console.log('TOPCONTRIBUTORSTATUS', this.state.isFetchingTopContributors);

      return;
    }

    this.setState({
      isFetchingTopContributors: false,
      topContributors: response.data,
    });

    console.log(
      'Init9 TOPCONTRIBUTORSSTATUS',
      this.state.isFetchingTopContributors,
    );
    console.log('topContributors', this.state.topContributors);

    const topContributors = [...this.state.topContributors];
  }

  async loadCommissionStats() {
    this.setState({
      isFetchingCommissionStats: true, //!isFastRefresh,
      commissionStats: {},
    });

    const {code, response, status} =
      await this.transactionHistory.getCommissionsStats(
        this.state.dateInterval,
      );

    if (status === ERROR_STATUS) {
      flashMessage(null, await handleErrorResponse(data), UNIMPORTANT);

      this.setState({
        isFetchingCommissionStats: false,
        commissionStats: code === HTTP_NOT_FOUND ? {} : null,
      });

      return;
    }

    const currentWithdrawalValue = response.data.currentWithdrawalValue;
    const withdrawalVariancePercent = response.data.withdrawalVariancePercent;
    // const currentEarningValue = response.data.currentEarningValue;
    // const earningVariancePercent = response.data.earningVariancePercent;

    this.setState({
      isFetchingCommissionStats: false,
      commissionStats: response.data,
      currentWithdrawalValue,
      withdrawalVariancePercent,
    });
    console.log('currentWithdrawalValue', this.state.currentWithdrawalValue);
    console.log(
      'withdrawalVariancePercent',
      this.state.withdrawalVariancePercent,
    );
  }

  async loadCommissionEarningsStat() {
    this.setState({
      isFetchingCommissionEarningsStats: true,
      earningStats: {},
    });

    const {code, response, status} =
      await this.transactionHistory.getCommissionsStats(
        this.state.dateInterval,
      );

    if (status === ERROR_STATUS) {
      flashMessage(null, await handleErrorResponse(data), UNIMPORTANT);

      this.setState({
        isFetchingCommissionEarningsStats: false,
        earningStats: code === HTTP_NOT_FOUND ? {} : null,
      });

      return;
    }

    const earningValue = response.data.currentEarningValue;
    const earningVariancePercent = response.data.earningVariancePercent;

    this.setState({
      isFetchingCommissionEarningsStats: false,
      earningStats: response.data,
      earningValue,
      earningVariancePercent,
    });
    console.log('earningVariancePercent', this.state.earningVariancePercent);
    console.log('earningValue', this.state.currentEarningValue);
  }

  async loadCommissionWithdrawalReport() {
    this.setState({
      isFetchingCommissionWithdrawalReport: true, //!isFastRefresh,
      commissionWithdrawalReport: [],
    });

    const {pageNo, pageSize} = this.state;

    const {code, response, status} =
      await this.transactionHistory.getCommissionsWithdrawalReport(
        this.state.dateInterval,
        pageNo,
        pageSize,
      );

    console.log('response', response);

    if (status === 'ERROR') {
      console.log('statusWithdrawal', status);
      this.setState({
        isFetchingCommissionWithdrawalReport: false,
        commissionWithdrawalReport: code === HTTP_NOT_FOUND ? {} : null,
      });

      return;
    }

    this.setState({
      isFetchingCommissionWithdrawalReport: false,
      commissionWithdrawalReport: response.data.content,
    });
    console.log(
      'fetchingvalue2',
      this.state.isFetchingCommissionWithdrawalReport,
    );
  }

  async loadWithdrawalSummarry() {
    this.setState({
      isFetchingWithdrawalSummary: true, //!isFastRefresh,
      withdrawalSummary: {},
    });

    const {code, response, status} =
      await this.transactionHistory.getWithdrawalSummarry('1');

    if (status === ERROR_STATUS) {
      flashMessage(null, await handleErrorResponse(data), UNIMPORTANT);

      this.setState({
        isFetchingWithdrawalSummary: false,
        withdrawalSummary: code === HTTP_NOT_FOUND ? {} : null,
      });

      return;
    }

    this.setState({
      isFetchingWithdrawalSummary: false,
      withdrawalSummary: response.data,
    });
    console.log('withdrawalSummary', this.state.withdrawalSummary);
  }

  async loadEarningPerformanceYearly() {
    this.setState({
      isFetchingEarningPerformance: true, //!isFastRefresh,
      earningPerformance: [],
    });

    const {code, response, status} =
      await this.transactionHistory.getEarningPerformanceYearly(
        this.state.dateInterval,
      );

    if (status === ERROR_STATUS) {
      flashMessage(null, await handleErrorResponse(data), UNIMPORTANT);

      this.setState({
        isFetchingEarningPerformance: false,
        earningPerformance: code === HTTP_NOT_FOUND ? {} : null,
      });

      return;
    }

    const earningPerformanceData = response.data;

    function filterPeriodAndValue(apiResponse) {
      const periods = [];
      const values = [];

      // Loop through the API response and extract "period" and "value"
      apiResponse.forEach(item => {
        if (item.period && item.value) {
          periods.push(item.period);
          values.push(item.value);
        }
      });

      return {periods, values};
    }

    const {periods, values} = filterPeriodAndValue(earningPerformanceData);

    // console.log("Periods:", periods);
    // console.log("Values:", values);

    this.setState({
      isFetchingEarningPerformance: false,
      earningPerformance: response.data,
      chartPeriods: periods,
      chartValues: values,
    });
    console.log('Periods:', this.state.chartPeriods);
    console.log('Values:', this.state.chartValues);
    console.log('earningPerformance', this.state.earningPerformance);
  }

  renderTopContributor() {
    if (this.state.isFetchingTopContributors) {
      return (
        <View>
          <Skeleton.TransactionRow />
          <Skeleton.TransactionRow />
          <Skeleton.TransactionRow />
          <Skeleton.TransactionRow />
        </View>
      );
    }
    if (this.state.topContributors === null) {
      return (
        <View
          style={{
            padding: 20,
          }}>
          <Text center>Something went wrong. Please, refresh the page.</Text>
        </View>
      );
    }

    return !this.state.topContributors.length ? (
      <View
        style={{
          padding: 20,
        }}>
        <Text center>Nothing to display.</Text>
      </View>
    ) : (
      <TopAgentCard response={this.state.topContributors} />
    );
  }

  renderTransactionHistory() {
    if (this.state.isFetchingTransactions) {
      return (
        <View>
          <Skeleton.TransactionRow />
          <Skeleton.TransactionRow />
          <Skeleton.TransactionRow />
          <Skeleton.TransactionRow />
        </View>
      );
    }

    if (this.state.transactions === null) {
      return (
        <View
          style={{
            padding: 20,
          }}>
          <Text center>Something went wrong. Please, refresh the page.</Text>
        </View>
      );
    }

    return !this.state.transactions.length ? (
      <View
        style={{
          padding: 20,
        }}>
        <Text center>Nothing to display.</Text>
      </View>
    ) : (
      <SectionList
        keyExtractor={(item, index) => item + index}
        renderItem={({item, index, section}) => this.renderItem(item, index)}
        renderSectionHeader={({section: {title}}) =>
          this.renderSectionHeader(title)
        }
        scrollEventThrottle={400}
        sections={this.state.transactions}
      />
    );
  }

  renderWithdrawalHistory() {
    if (this.state.isFetchingCommissionWithdrawalReport) {
      return (
        <View>
          <Skeleton.TransactionRow />
          <Skeleton.TransactionRow />
          <Skeleton.TransactionRow />
          <Skeleton.TransactionRow />
        </View>
      );
    }

    if (this.state.commissionWithdrawalReport === null) {
      return (
        <View
          style={{
            padding: 20,
          }}>
          <Text center>Something went wrong. Please, refresh the page.</Text>
        </View>
      );
    }

    if (this.state.commissionWithdrawalReport.length === 0) {
      return (
        <View
          style={{
            padding: 20,
          }}>
          <Text center>Something went wrong. Please, refresh the page.</Text>
        </View>
      );
    }

    return !this.state.commissionWithdrawalReport?.length ? (
      <View
        style={{
          padding: 20,
        }}>
        <Text center>Nothing to display.</Text>
      </View>
    ) : (
      <WithdrawalHistoryCard
        navigate={this.props.navigation}
        response={this.state.commissionWithdrawalReport}
      />
    );
  }

  renderCarouselPagination() {
    const {activeSlide} = this.state;

    return (
      <Pagination
        dotsLength={2}
        activeDotIndex={activeSlide}
        containerStyle={{
          backgroundColor: COLOUR_WHITE,
          elevation: 1,
          paddingVertical: 20,
          paddingBottom: 10,
          marginTop: 0,
          marginBottom: 0,
        }}
        dotStyle={{
          width: 18,
          height: 18,
          borderRadius: 9,
          marginHorizontal: 8,
          backgroundColor: COLOUR_BLUE,
        }}
        inactiveDotOpacity={0.45}
        inactiveDotScale={0.7}
      />
    );
  }

  render() {
    const date = [
      {value: 2, name: 'This week'},
      {value: 3, name: 'This month'},
      {value: 4, name: 'This year'},
    ];
    const {
      navigation,
      amount,
      containerStyle,
      didLoadBalanceFail,
      isLoading,
      retry,
      timestamp,
      title,
      showAccountNo,
      accountNo,
      bankName,
    } = this.props;

    const earningsView = () => (
      <View>
        <View
          style={{
            flexDirection: 'column',
            flex: 1,
            paddingBottom: 2,
            paddingHorizontal: 16,
            width: WINDOW_WIDTH,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              paddingBottom: 2,
              marginTop: 15,
            }}>
            <Text bold>Earnings</Text>
          </View>
          <FormPicker
            choices={date.map(({value, name}) => ({
              label: name,
              value: value,
            }))}
            placeholder="This Week"
            innerContainerStyle={styles.formInputInnerContainerStyle}
            onSelect={value => this.changeDateInterval(value)}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            propagateError={this.props.propagateFormErrors}
            validators={{
              required: true,
            }}
          />
          <View style={{marginBottom: 10, marginTop: 5}}>
            <WithdrawalBalanceCard
              amount={
                this.state.earningValue !== 0 ? this.state.earningValue : '0.00'
              }
              withdrawalVariancePercent={
                this.state.earningVariancePercent !== 0
                  ? this.state.earningVariancePercent
                  : 0
              }
              title="Earnings"
            />
          </View>
          <View style={{marginBottom: 10}}>
            <BalanceCard
              didLoadBalanceFail={this.state.didLoadWalletBalanceFail}
              isDisabled={this.state.isDisabled}
              isLoading={this.state.isLoadingWallet}
              retry={() =>
                this._loadWallet(this._loadAgent(), this._loadUser())
              }
              title="Ledger Balance"
              amount={this.state.wallet ? this.state.ledgerBalance : '0.00'}
              timestamp={this.state.wallet.walletBalanceTimestamp}
              key="ledgerBalance"
            />
          </View>
          <View style={{marginBottom: 10, marginTop: 5}}>
            <BalanceCard
              didLoadBalanceFail={this.state.didLoadWalletBalanceFail}
              isDisabled={this.state.isDisabled}
              isLoading={this.state.isLoadingWallet}
              retry={() =>
                this._loadWallet(this._loadAgent(), this._loadUser())
              }
              title="Available Balance"
              amount={
                this.state.wallet
                  ? this.state.wallet.commissions_earned
                  : '0.00'
              }
              buttonTitle="Unload"
              buttonOnPressOut={() =>
                this.props.navigation.navigate('UnloadCommission')
              }
              timestamp={this.state.wallet.walletBalanceTimestamp}
            />
          </View>

          <ChartCard
            periods={this.state.chartPeriods}
            values={this.state.chartValues}
          />
          <View style={{paddingHorizontal: 10, paddingVertical: 20}}>
            <Text bold>Top 5 Agents</Text>
          </View>
        </View>
        {this.renderTopContributor()}
      </View>
    );

    const withdrawalView = () => (
      <View>
        <View
          style={{
            flexDirection: 'column',
            flex: 1,
            paddingBottom: 2,
            paddingHorizontal: 16,
            width: WINDOW_WIDTH,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              paddingBottom: 2,
              marginTop: 15,
            }}>
            <Text bold>Withdrawals</Text>
          </View>
          <FormPicker
            choices={date.map(({value, name}) => ({
              label: name,
              value,
            }))}
            placeholder="This Week"
            innerContainerStyle={styles.formInputInnerContainerStyle}
            onSelect={value => this.changeWithdrawalDateInterval(value)}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            propagateError={this.props.propagateFormErrors}
            validators={{
              required: true,
            }}
          />

          <View style={{marginBottom: 10, marginTop: 5, width: '100%'}}>
            <WithdrawalBalanceCard
              amount={
                this.state.currentWithdrawalValue !== 0
                  ? this.state.currentWithdrawalValue
                  : '0.00'
              }
              withdrawalVariancePercent={
                this.state.withdrawalVariancePercent !== 0
                  ? this.state.withdrawalVariancePercent
                  : 0
              }
              title="Total Withdrawals"
            />
          </View>
          <View style={{marginTop: 10}} />
        </View>
        {this.renderWithdrawalHistory()}
      </View>
    );

    return (
      <View
        style={{
          flex: 1,
        }}>
        <Header
          containerStyle={{
            backgroundColor: COLOUR_BLUE,
          }}
          navigationIconColor={COLOUR_WHITE}
          leftComponent={
            <Icon
              color={COLOUR_WHITE}
              name="chevron-left"
              onPress={() => this.props.navigation.goBack()}
              size={40}
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
          title="My Commissions"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
          }}
        />

        <Animated.ScrollView
          onScroll={Animated.event(
            [
              {
                nativeEvent: {contentOffset: {y: this.state.scrollY}},
              },
            ],
            {
              useNativeDriver: true,
            },
          )}
          scrollEventThrottle={16}>
          {this.renderCarouselPagination()}

          <Carousel
            data={[earningsView, withdrawalView]}
            onSnapToItem={index => this.setState({activeSlide: index})}
            ref={c => {
              this._carousel = c;
            }}
            renderItem={({item: viewFunc}) => (
              <>
                <View
                  style={{
                    backgroundColor: 'white',
                    flex: 0.4,
                  }}>
                  {viewFunc()}
                </View>
              </>
            )}
            sliderWidth={WINDOW_WIDTH}
            itemWidth={WINDOW_WIDTH}
          />

          {this.state.isChangingDateInterval && (
            <ActivityIndicator
              color={COLOUR_WHITE}
              containerStyle={{
                alignItems: 'center',
                backgroundColor: `${COLOUR_BLUE}AA`,
                height: '100%',
                justifyContent: 'center',
                position: 'absolute',
                width: '100%',
                zIndex: 1,
              }}
            />
          )}
        </Animated.ScrollView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFastRefreshPending: state.tunnel.isFastRefreshPending,
    isNavigatorVisible: state.navigation.isNavigatorVisible,
    navigationState: state.tunnel.navigationState,
    screenAfterLogin: state.tunnel.screenAfterLogin,
    remoteConfig: state.tunnel.remoteConfig,
    requeryTransactionBucket: state.tunnel.requeryTransactionBucket,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideNavigator: () => dispatch(hideNavigator()),
    setIsFastRefreshPending: value => dispatch(setIsFastRefreshPending(value)),
    setScreenAfterLogin: screen => dispatch(setScreenAfterLogin(screen)),
    showNavigator: () => dispatch(showNavigator()),
    navigateTo: message => dispatch(navigateTo(message)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommissionsEarnedDashBoard);

const styles = StyleSheet.create({
  formInputInnerContainerStyle: {
    marginTop: 5,
  },
  formInputOuterContainerStyle: {
    marginBottom: 20,
  },
});

import React from 'react';
import { Dimensions, ScrollView, View } from 'react-native';

import moment from 'moment';
import Numeral from 'numeral';
import { Icon } from 'react-native-elements';
import WebView from 'react-native-webview';
import { connect } from 'react-redux';

import ActivityIndicator from '../../../../../../../components/activity-indicator';
import Button from '../../../../../../../components/button';
import FormDate from '../../../../../../../components/form-controls/form-date';
import Header from '../../../../../../../components/header';
import GradientIcon from '../../../../../../../components/icons/gradient-icon';
import Text from '../../../../../../../components/text';
import { ERROR_STATUS, SUCCESS_STATUS } from '../../../../../../../constants/api';
import {
  COLOUR_BLUE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_SIZE_BIGGER
} from '../../../../../../../constants/styles';
import TransactionHistory from '../../../../../../../services/api/resources/transaction-history';
import {
  hideNavigator,
  showNavigator
} from '../../../../../../../services/redux/actions/navigation';
import { flashMessage } from '../../../../../../../utils/dialog';
import handleErrorResponse from '../../../../../../../utils/error-handlers/api';


const currentDateStr = moment().format('YYYY-MM-DD[T]HH:mm:ss');
const screenWidth = Dimensions.get('window').width;
const BUY_AIRTIME = 'Buy Airtime';
const CASH_IN = 'Cash In';
const FUND_WALLET = 'Fund Wallet';
const PAY_BILL = 'Pay Bill';
const TRANSFER_TO_ACCOUNT = 'Send Money (Transfer to Account)';
const TRANSFER_TO_AGENT = 'Send Money (Transfer to Agent)';


class ReportServicesScene extends React.Component {

  transactionHistory = new TransactionHistory();

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => {
      let IconComponent = Icon;
      
      return <IconComponent 
        name="bar-chart-2" 
        type="feather"
        size={25} 
        color={tintColor} />;
    },
    title: 'Services Report'
  };

  state = {
    dataSpan: 1,
    didErrorOccurWhileFetching: false,
    graphData: [],
    isLoading: true,
    reports: {

    },
    currentDate: currentDateStr,
    startDate: moment().subtract(6, 'months').format('YYYY-MM-DD[T00:00:00]'),
    endDate: currentDateStr
  };

  constructor() {
    super();

    this.getColorForTransactionType = this.getColorForTransactionType.bind(this);
    this.getGraphData = this.getGraphData.bind(this);
    this.loadData = this.loadData.bind(this);
    this.serializeReportData = this.serializeReportData.bind(this);
    this.updateFilterParams = this.updateFilterParams.bind(this);
  }

  componentDidMount() {
    this.loadData()
  }

  getGraphData() {
    const { reports } = this.state;

    let largestReport = [];
    let largestReportSize = 0;

    Object.values(reports).map(
      report => {
        if (report.length > largestReportSize) {
          largestReport = report;
          largestReportSize = report.length
        }
      }
    );

    const graphData = [];

    const transactionTypes = Object.keys(reports);
    transactionTypes.map((transactionType, index) => {
      graphData.push({
        transactionType,
        data: reports[transactionType].map(value => value.volume / 100)
      })
    })

    this.setState({
      graphDataLabels: largestReport?.map(value => value.date) || [],
      graphData,
      dataSpan: largestReport?.length || 0
    });
  }

  serializeReportData(transactionType, data) {
    if (data === "") {
      return
    }

    const { reports } = this.state;

    reports[transactionType] = data;

    const newState = {
      reports
    }
    
    this.setState(newState);
  }

  getColorForTransactionType (transactionType) {
    return {
      'Buy Airtime': '#83F4FA',
      'Cash In': '#EE312A',
      'Cash Out': '#00425F',
      'Commission Unload': '#8E443D',
      'Fund Wallet': '#05a826',
      'Pay Bill': '#9483FA',
      'Send Money (Transfer to Account)': '#DABB63',
      'Send Money (Transfer to Agent)': '#FACB83',
      'Reversal': '#000000',
      'Paypoint Fund': '#BEB7A4',
    }[transactionType];
  }

  _getTotalTransactionTypeVolume() {
    const { reports } = this.state;
    let totalVolume = 0;

    Object.values(reports).map((value, index) => {
      const transactionReports = value;
      if (transactionReports) {  
        const latestTransactionReport = transactionReports[transactionReports.length - 1];

        console.log(latestTransactionReport)

        if (!latestTransactionReport) {
          totalVolume += 0;  
        } else {
          totalVolume += latestTransactionReport.volume;
        }

      }
    });

    return totalVolume;
  }

  getStatsGraphAndLabels() {
    
    const buyAirtimePerformance = this.getTransactionTypePerformance(BUY_AIRTIME);
    const fundWalletPerformance = this.getTransactionTypePerformance(FUND_WALLET)
    const payBillPerformance = this.getTransactionTypePerformance(PAY_BILL);
    const sendMoneyPerformance = this.getTransactionTypePerformance([TRANSFER_TO_AGENT, TRANSFER_TO_ACCOUNT]);
    const cashOutPerformance = this.getTransactionTypePerformance(CASH_IN);

    return <React.Fragment>
      <ScrollView horizontal>
        <WebView
          source={{
            html: `<html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.bundle.js"></script>
                <script src="//cdnjs.cloudflare.com/ajax/libs/numeral.js/2.0.6/numeral.min.js"></script>
              </head>
              <body style={{height: '100vh'}}>
                <canvas id="myChart" height="400dp" width="${this.state.dataSpan > 2 ? this.state.dataSpan * screenWidth * .5 : screenWidth}dp"></canvas>
                <script>
                  var ctx = document.getElementById('myChart').getContext('2d');
                  var myChart = new Chart(ctx, {
                    aspectRatio: 1,
                    responsive: true,
                    type: 'bar',
                    data: {
                      aspectRatio: 1,
                      labels: ${JSON.stringify(this.state.graphDataLabels)},
                      datasets: ${JSON.stringify(this.state.graphData.map((value, index) => {
                        return {
                          label: value.transactionType,
                          backgroundColor: this.getColorForTransactionType(value.transactionType),
                          borderColor: this.getColorForTransactionType(value.transactionType),
                          borderJoinStyle: 'round',
                          borderWidth: 1,
                          data: value.data,
                          pointBorderWidth: 0
                        }
                      }))}
                    },
                    options: {
                      scales: {
                        yAxes: [{
                          ticks: {
                            beginAtZero: true,
                            callback: function(value, index, values) {
                              let formattedAmount = JSON.stringify(value).split('.')[0].split('').reverse().map(
                                (value, index) => index > 0 && (index % 3) === 0 
                                  ? value + ',' 
                                  : value
                                ).reverse().join('');

                              if (JSON.stringify(value).includes('.')) {
                                const numberAfterDecimal = JSON.stringify(value).split('.')[1];
                                if (numberAfterDecimal.length === 1) {
                                  formattedAmount += '.' + numberAfterDecimal + '0';
                                } else {
                                  formattedAmount += '.' + numberAfterDecimal;
                                }
                              } else {
                                formattedAmount += '.00';
                              }
                              return '₦' + formattedAmount;
                            }
                          }
                        }]
                      },
                      tooltips: {
                        callbacks: {
                          label: function(tooltipItem, data) {
                            const val = tooltipItem.value;
                            let formattedAmount = val.split('.')[0].split('').reverse().map(
                              (value, index) => index > 0 && (index % 3) === 0 
                                ? value + ',' 
                                : value
                              ).reverse().join('');

                            if (val.includes('.')) {
                              const numberAfterDecimal = val.split('.')[1];
                              if (numberAfterDecimal.length === 1) {
                                formattedAmount += '.' + numberAfterDecimal + '0';
                              } else {
                                formattedAmount += '.' + numberAfterDecimal;
                              }
                            } else {
                              formattedAmount += '.00';
                            }

                            return '₦' + formattedAmount;
                          }
                        }
                      }
                    }
                  });
                </script>
              </body>
            </html>`
          }}
          style={{
            height: 500,
            width: this.state.dataSpan > 2 ? 100 + (this.state.dataSpan * screenWidth * .5) : screenWidth
          }}
        />
      </ScrollView>

      <View style={{backgroundColor: 'white', padding: 12, height: 750}}>
        <View style={{flexDirection: 'row'}}>

          <View style={{justifyContent: 'space-between', height: 140, width: '50%', marginBottom: 40}}>
            <Text>SELL AIRTIME</Text>
            <View style={{alignItems: 'center', flexDirection: 'row'}}>
              <GradientIcon colors={['#66E6F3', '#0ABCE0']} icon="tag" iconSize={26} style={{marginRight: 10}} round />
              <Text style={{color: COLOUR_BLUE, fontSize: FONT_SIZE_BIGGER}}>{!this.state.isLoading && this.getTransactionTypePortion(BUY_AIRTIME)}%</Text>
            </View>
            <Text small>{!this.state.isLoading && `${buyAirtimePerformance} than previous`}</Text>
          </View>
          
          <View style={{justifyContent: 'space-between', height: 140, width: '50%', marginBottom: 40, marginLeft: 20}}>
            <Text>SEND MONEY</Text>
            <View style={{alignItems: 'center', flexDirection: 'row'}}>
              <GradientIcon colors={['#F9BE79', '#F58752']} icon="money" iconSize={26} style={{marginRight: 10}} round />
              <Text style={{color: COLOUR_BLUE, fontSize: FONT_SIZE_BIGGER}}>{!this.state.isLoading && (
                Numeral(JSON.parse(this.getTransactionTypePortion(TRANSFER_TO_ACCOUNT)) + JSON.parse(this.getTransactionTypePortion(TRANSFER_TO_AGENT))).format('0.00')
              )}%</Text>
            </View>
            <Text small>{!this.state.isLoading && `${sendMoneyPerformance} than previous`}</Text>
          </View>

        </View>

        <View style={{flexDirection: 'row'}}>
          <View style={{justifyContent: 'space-between', height: 140, width: '50%', marginBottom: 40}}>
            <Text>PAY A BILL</Text>
            <View style={{alignItems: 'center', flexDirection: 'row'}}>
              <GradientIcon colors={['#9678F9', '#9E53F5']} icon="credit-card" iconSize={26} style={{marginRight: 10}} round />
              <Text style={{color: COLOUR_BLUE, fontSize: FONT_SIZE_BIGGER}}>{!this.state.isLoading && this.getTransactionTypePortion(PAY_BILL)}%</Text>
            </View>
            <Text small>{!this.state.isLoading && `${payBillPerformance} than previous`}</Text>
          </View>
          
          <View style={{justifyContent: 'space-between', height: 140, width: '50%', marginBottom: 40, marginLeft: 20}}>
            <Text>CASH IN</Text>
            <View style={{alignItems: 'center', flexDirection: 'row'}}>
              <GradientIcon colors={['#F75261', '#EF3430']} icon="sign-out" iconSize={26} style={{marginRight: 10}} round />
              <Text style={{color: COLOUR_BLUE, fontSize: FONT_SIZE_BIGGER}}>{!this.state.isLoading && this.getTransactionTypePortion(CASH_IN)}%</Text>
            </View>
            <Text small>{!this.state.isLoading && `${cashOutPerformance} than previous`}</Text>
          </View>
          
        </View>

        <View style={{flexDirection: 'row'}}>
          <View style={{justifyContent: 'space-between', height: 140, width: '50%', marginBottom: 40}}>
            <Text>FUND WALLET</Text>
            <View style={{alignItems: 'center', flexDirection: 'row'}}>
              <GradientIcon colors={['#05a826', '#03a624']} icon="credit-card" iconSize={26} style={{marginRight: 10}} round />
              <Text style={{color: COLOUR_BLUE, fontSize: FONT_SIZE_BIGGER}}>{!this.state.isLoading && this.getTransactionTypePortion(FUND_WALLET)}%</Text>
            </View>
            <Text small>{!this.state.isLoading && `${fundWalletPerformance} than previous`}</Text>
          </View>
        </View>
      </View>
    </React.Fragment>
  }

  getTransactionTypePerformance(transactionType) {
    const defaultReturn = '0% more';
    const maxDefaultReturn = '100% more';

    if (Array.isArray(transactionType)) {
      const transactionTypes = transactionType
      
      let lastMonthVolume = 0;
      let thisMonthVolume = 0;

      transactionTypes.map((transactionType, index) => {
        const { reports } = this.state;
        const transactionTypeReports = reports[transactionType];
        if (!transactionTypeReports) {
          return null;
        }

        const lastMonthReports = transactionTypeReports[transactionTypeReports.length - 2];
        const thisMonthReports = transactionTypeReports[transactionTypeReports.length - 1];

        if (!lastMonthReports) {
          return null;
        }

        lastMonthVolume += lastMonthReports.volume || 0;
        thisMonthVolume += thisMonthReports.volume || 0;
      })

      const resolve = Math.abs(Math.round(((thisMonthVolume - lastMonthVolume) / lastMonthVolume) * 100));
      
      return `${isNaN(resolve) || resolve == Infinity ? '0' : resolve}% ${lastMonthVolume > thisMonthVolume ? 'less' : 'more'}`
    }

    const { reports } = this.state;
    const transactionTypeReports = reports[transactionType];
    if (!transactionTypeReports) {
      return defaultReturn;
    }

    console.log({reports})

    const lastMonthReports = transactionTypeReports[transactionTypeReports.length - 2];
    const thisMonthReports = transactionTypeReports[transactionTypeReports.length - 1];
    if (!lastMonthReports) {
      return maxDefaultReturn;
    }

    const lastMonthVolume = lastMonthReports.volume;
    const thisMonthVolume = thisMonthReports.volume;

    return `${Math.abs(Math.round(((thisMonthVolume - lastMonthVolume) / lastMonthVolume) * 100))}% ${lastMonthVolume > thisMonthVolume ? 'less' : 'more'}`
  }

  getTransactionTypePortion(transactionType) {
    const { reports } = this.state;
    const transactionReports = reports[transactionType];

    if (transactionReports === undefined || transactionReports.length === 0) {
      return '0.00';
    }

    const latestTransactionReport = transactionReports[transactionReports.length - 1];

    if (latestTransactionReport === undefined) {
      return '0.00'
    }
    
    return Numeral((latestTransactionReport.volume / this._getTotalTransactionTypeVolume()) * 100).format('0.00')
  }

  normalizeResponse(response) {
    const arrays_ = Object.values(response);
    let lowestInt = null;
    let highestInt = null;

    let normalizedResponse = {};
    let dateMap = {};
    
    arrays_.map(array_ => {
      array_.map(({date, dateInt}) => {
        if (dateInt < lowestInt || lowestInt === null) {
          lowestInt = dateInt;
        } else if (dateInt > highestInt || highestInt === null) {
          highestInt = dateInt;
        }

        dateMap[dateInt] = date;
      });
    });

    const margin = [];
    for (var i = lowestInt; i < highestInt + 1; i++) {
      margin.push(i);
    }

    console.log({margin})

    const keys_ = Object.keys(response);
    keys_.map(key => {
      let normalizedArray = [];

      margin.map(refDateInt => {
        const matchingRecord = response[key].find(({dateInt}) => dateInt === refDateInt)  || {count: 0, volume: 0, date: dateMap[refDateInt] || '', dateInt: refDateInt};

        normalizedArray.push(matchingRecord);
      });

      console.log({key, normalizedArray});

      normalizedResponse[key] = normalizedArray;
    });

    return normalizedResponse;
  }

  async loadData() {
    this.setState({
      didErrorOccurWhileFetching: null,
      isLoading: true
    });

    const { endDate, startDate } = this.state;
    
    const { status, code, ...response_ } = await this.transactionHistory.retrieveChartReportByDateRange(
      null,
      startDate,
      endDate,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    );

    console.log('TRANSACTION HISTORY', {response_})
    let response = {};

    if (status === SUCCESS_STATUS) {
      response = this.normalizeResponse(response_.response);
    }
    
    const transactionTypeMap = {
      'recharge': 'Buy Airtime',
      'cashIn': 'Cash In',
      'cashOut': 'Cash Out',
      'commissionUnload': 'Commission Unload',
      'fund': 'Fund Wallet',
      'bills': 'Pay Bill',
      'payPointFund': 'Paypoint Fund',
      'transfer': 'Send Money (Transfer to Account)',
      'reversal': 'Reversal',
      'walletToWallet': 'Send Money (Transfer to Agent)',
    }

    if (status === ERROR_STATUS) {
      this.setState({
        didErrorOccurWhileFetching: true,
        isLoading: false
      })

      flashMessage(
        null,
        await handleErrorResponse(
          response
        )
      )
      return
    }

    Object.keys(response).map(value => {
      const transactionType = transactionTypeMap[value] || value;
      const data = response[value];

      console.log(transactionType, data);
  
      this.serializeReportData(transactionType, data)
    });

    this.getGraphData();
  
    this.setState({
      isLoading: false,
    });
  }

  get errorFallbackMessage() {
    return (
      <View
        style={{ alignItems: 'center', height: 200, justifyContent: 'center',}}
      >
        <Text big center>An error occured.</Text>
        <Button 
          containerStyle={{
            marginTop: 8
          }}
          onPress={this.loadData} 
          transparent
          title="RETRY"
          titleStyle={{
            color: COLOUR_BLUE
          }}
        />
      </View>
    );
  }

  sanitizeDate(date, isEndDate) {
    const time = isEndDate ? '23:59:59' : '00:00:00';
    return moment(date, "DD-MM-YYYY").format(`YYYY-MM-DD[T${time}]`);
  }

  updateFilterParams(params) {
    this.setState({
      ...params
    })
  }

  render () {
    return <View 
      contentContainerStyle={{
        backgroundColor: '#F3F3F4',
        flex: 1
      }}
      onTouchMove={() => this.props.isNavigatorVisible ? this.props.hideNavigator() : null}
    >

      <Header 
        containerStyle={{
          backgroundColor: COLOUR_BLUE
        }}
        navigationIconColor={COLOUR_WHITE}
        // rightComponent={<Icon 
        //   underlayColor="transparent"
        //   color={COLOUR_WHITE}
        //   name="notifications"
        //   size={28}
        //   type="material"
        //   onPress={() => this.props.navigation.navigate('Notifications')}
        // />}
        hideNavigationMenu={this.props.hideNavigator}
        showNavigationMenu={this.props.showNavigator}
        statusBarProps={{
          backgroundColor: 'transparent',
          barStyle: CONTENT_LIGHT
        }}
        title="Services Report"
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: 'bold'
        }}
        withNavigator 
      />
    
      
      <ScrollView contentContainerStyle={{
        backgroundColor: '#F3F3F4'
      }}>

        {this.state.didErrorOccurWhileFetching && this.errorFallbackMessage}

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}>
          <FormDate 
            defaultValue={moment(this.state.startDate, 'YYYY-MM-DD').format('DD-MM-YYYY')}
            innerContainerStyle={{
              backgroundColor: COLOUR_WHITE,
              marginTop: 5
            }}
            maxDate={moment(this.state.currentDate, 'YYYY-MM-DD').format('DD-MM-YYYY')}
            onDateSelect={(startDate) => {
              console.log({startDate})
              this.setState({
                startDate: this.sanitizeDate(startDate, false)
              })
              setTimeout(this.loadData, 200)
            }}
            outerContainerStyle={{
              marginBottom: 20
            }}
            text="Start Date:" 
          />
          <FormDate 
            defaultValue={moment(this.state.endDate, 'YYYY-MM-DD').format('DD-MM-YYYY')}
            innerContainerStyle={{
              backgroundColor: COLOUR_WHITE,
              marginTop: 5
            }}
            maxDate={moment(this.state.currentDate, 'YYYY-MM-DD').format('DD-MM-YYYY')}
            minDate={moment(this.state.startDate, 'YYYY-MM-DD').format('DD-MM-YYYY')}
            onDateSelect={(endDate) => {
              console.log({endDate})
              this.setState({
                endDate: this.sanitizeDate(endDate, true)
              })
              setTimeout(this.loadData, 200)
            }}
            outerContainerStyle={{
              marginBottom: 20
            }}
            text="End Date:" 
          />
          <Text>{JSON.stringify(this.state.dataSpan)}</Text>
        </View>

        {this.state.isLoading ? <View style={{flex: 1, marginBottom: 10}}><ActivityIndicator /></View> : this.getStatsGraphAndLabels()}
      </ScrollView>

    </View>
  }
}

function mapStateToProps(state) {
  return {
    isNavigatorVisible: state.navigation.isNavigatorVisible,
    // pendingUrl: state.navigation.pendingUrl
  }
}

function mapDispatchToProps(dispatch) {
  return {
    hideNavigator: () => dispatch(hideNavigator()),
    showNavigator: () => dispatch(showNavigator())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportServicesScene)

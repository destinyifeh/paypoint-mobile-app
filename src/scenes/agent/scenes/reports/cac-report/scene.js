import React from 'react';
import {FlatList, View} from 'react-native';

import {TextInput} from 'react-native';
import {Icon} from 'react-native-elements';
import ActivityIndicator from '../../../../../components/activity-indicator';
import Button from '../../../../../components/button';
import Header from '../../../../../components/header';
import Text from '../../../../../components/text';
import {AGENT} from '../../../../../constants';
import {SUCCESS_STATUS} from '../../../../../constants/api';
import {
  COLOUR_BLUE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../../../constants/styles';
import AgentSerializer from '../../../../../serializers/resources/agent';
import {cac} from '../../../../../setup/api';
import handleErrorResponse from '../../../../../utils/error-handlers/api';
import {loadData} from '../../../../../utils/storage';
import CacReportRow from '../components/cac-report-row';
const REPORTS = [
  {
    name: 'JOSH BASH',
    date: '23-09-2024',
    status: 'Queried',
    time: '08:14:01',
  },
  {
    name: 'JOHN Saloon',
    date: '23-09-2024',
    status: 'Processing',
    time: '08:14:01',
  },
  {
    name: 'JOHN Saloon',
    date: '23-09-2024',
    status: 'Successful',
    time: '08:14:01',
  },
];

export default class CacReport extends React.Component {
  constructor() {
    super();
    this.loadCacReports = this.loadCacReports.bind(this);
    this.loadAgent = this.loadAgent.bind(this);
    this.filterByStatus = this.filterByStatus.bind(this);
    this.state = {
      form: {},
      invalidFields: [],
      lineOfBusiness: [],
      buttonDisabled: true,
      isLoading: false,
      invalidName: false,
      savedCacBusinessForm: null,
      searchText: '',
      allReports: [],
      filteredReports: [],
      pageNumber: 0,
      selectedStatus: null,
      didErrorOccur: false,
      currentAgent: null,
      lineOfBusinessQueried: false,
    };
  }

  async componentDidMount() {
    await this.loadAgent();
    this.filterByStatus(this.state.selectedStatus);
    // await this.loadCacReports();
  }

  async componentDidUpdate(prevProps, prevState) {
    // await this.loadCacReports();
    const {filters: statusValue} = this.props.route.params || {};

    if (
      statusValue &&
      statusValue.statusCodeInt !== this.state.selectedStatus
    ) {
      this.setState({selectedStatus: statusValue.statusCodeInt});
    }
    if (
      prevState.selectedStatus !== this.state.selectedStatus &&
      this.state.selectedStatus
    ) {
      //   await this.loadCacReports();
      this.filterByStatus(this.state.selectedStatus);
    }
  }

  filterByStatus = async status => {
    await this.loadCacReports();
    console.log('DATATOFILTER', this.state.allReports);
    if (this.state.allReports.length === 0) {
      return;
    }
    const filteredData = this.state.allReports.filter(
      item => item.status.toLowerCase() === status.toLowerCase(),
    );
    this.setState({filteredReports: filteredData}, () => {
      console.log('FILTERDDATA', this.state.filteredReports);
    });
    console.log('FILTERDDATA2', this.state.filteredReports);
  };

  loadNextPage() {
    this.setState({
      pageNumber: this.state.pageNumber + 1,
    });

    setTimeout(() => this.loadCacReports(), 0);
  }

  isCloseToBottom({layoutMeasurement, contentOffset, contentSize}) {
    const paddingToBottom = 10;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  }

  handleSearch = text => {
    const {allReports} = this.state;

    const filteredData = allReports.filter(item =>
      item.businessName.toLowerCase().includes(text.toLowerCase()),
    );

    this.setState({searchText: text, filteredReports: filteredData});
  };

  async loadAgent() {
    const savedAgentData = JSON.parse(await loadData(AGENT));

    if (savedAgentData === null) {
      return;
    }

    const currentAgent = new AgentSerializer(savedAgentData);

    this.setState({
      currentAgent,
    });

    console.log('CACREG', currentAgent);

    return currentAgent;
  }

  async loadCacReports() {
    const {pageNumber} = this.state;
    this.setState({
      didErrorOccur: false,
      errorMessage: null,
      isLoading: true,
    });
    const {response, status} = await cac.getCacReports(
      10000,
      pageNumber,
      this.state.currentAgent.agentCode,
    );
    console.log('REPORTTABLE', response);
    if (status === SUCCESS_STATUS) {
      this.setState({
        filteredReports: response.data.content,
        isLoading: false,
        allReports: response.data.content,
      });
    } else {
      this.setState({
        didErrorOccur: true,
        errorMessage: await handleErrorResponse(response),
        isLoading: false,
      });
    }
  }

  errorFallbackMessage() {
    const {errorMessage} = this.state;

    return (
      <View
        style={{
          alignItems: 'center',
          flex: 0.3,
          justifyContent: 'center',
          padding: 16,
        }}>
        <Text big center>
          {errorMessage}
        </Text>
        <Button
          containerStyle={{
            marginTop: 8,
          }}
          onPress={this.loadCacReports}
          transparent
          title="RETRY"
          titleStyle={{
            color: COLOUR_BLUE,
          }}
        />
      </View>
    );
  }

  renderItem(item, index) {
    return (
      <CacReportRow
        // isHistoricalData={this.state.isHistoricalData}{ transaction: item,}CacReportDetails
        onPressOut={() =>
          this.props.navigation.navigate('CacReportDetails', {
            businessDetails: item,
          })
        }
        item={item}
        status={item.status}
        name={item.businessName}
        date={item.dateCreated}
        time={item.time}
      />
    );
  }
  render() {
    const {filteredReports, didErrorOccur, isLoading, allReports} = this.state;
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
          title="CAC Reports"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
          }}
        />

        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              height: 48,
              backgroundColor: '#F3F5F6',
              width: '70%',
              marginHorizontal: 15,
              flexDirection: 'row',
              marginTop: 15,
              borderRadius: 8,
              alignItems: 'center',
              paddingHorizontal: 10,
            }}>
            <Icon
              color={'#9CA3AF'}
              name="search"
              onPress={() => this.props.navigation.goBack()}
              size={22}
              type="material"
              underlayColor="transparent"
            />
            <TextInput
              style={{
                height: 48,
                margin: 12,
                borderWidth: 1,
                padding: 10,
                borderColor: '#F3F5F6',
                width: '70%',
              }}
              onChangeText={this.handleSearch}
              value={this.state.searchText}
              placeholder="Search"
            />
          </View>

          <View
            style={{
              width: '18%',
              height: 48,
              borderWidth: 1,
              borderRadius: 8,
              borderColor: '#E1E6ED',
              marginTop: 15,
              paddingEnd: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon
              color={'#000000'}
              name="tune"
              onPress={() => {
                this.props.navigation.replace('ReportCacFilter');
              }}
              size={24}
              type="material"
              underlayColor="transparent"
            />
          </View>
        </View>

        <View style={{paddingHorizontal: 15, paddingVertical: 15}}>
          <Text bold style={{fontSize: 20, color: '#1F2937'}}>
            CAC Registration Reports
          </Text>
        </View>

        {Boolean(allReports.length > 0 && filteredReports.length) ? (
          <FlatList
            keyExtractor={(item, index) => item + index}
            renderItem={({item, index}) => this.renderItem(item, index)}
            // scrollEventThrottle={400}
            data={filteredReports}
          />
        ) : (
          <Text big center style={{padding: 16}}>
            No data to display.
          </Text>
        )}
        {console.log('filteredReports9', filteredReports)}
        {!Boolean(allReports.length) && !isLoading && (
          <Text big center style={{padding: 16}}></Text>
        )}
        {isLoading && <ActivityIndicator />}
        {didErrorOccur && this.errorFallbackMessage()}
      </View>
    );
  }
}

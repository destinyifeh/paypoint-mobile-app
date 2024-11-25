import React from 'react';
import {SectionList, View} from 'react-native';

import moment from 'moment';
import {Icon} from 'react-native-elements';

import ActivityIndicator from '../../../../../../../components/activity-indicator';
import Button from '../../../../../../../components/button';
import ClickableListItem from '../../../../../../../components/clickable-list-item';
import Header from '../../../../../../../components/header';
import Text from '../../../../../../../components/text';
import {DEFAULT_PAGE_SIZE, USER} from '../../../../../../../constants';
import {ERROR_STATUS} from '../../../../../../../constants/api';
import {
  COLOUR_BLUE,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../../../../../constants/styles';
import AuditTrailEventSerializer from '../../../../../../../serializers/resources/audit-trail-event';
import {auditService} from '../../../../../../../setup/api';
import handleErrorResponse from '../../../../../../../utils/error-handlers/api';
import {loadData} from '../../../../../../../utils/storage';

export default class ManageDevicesAuditTrail extends React.Component {
  auditTrailEventSerializer = new AuditTrailEventSerializer();

  constructor(props) {
    super(props);
    const {devices = []} = props.route?.params || {};

    this.state = {
      auditTrail: [],
      devices: devices,
      isLoading: true,
      pageNumber: 0,
    };

    this.loadData = this.loadData.bind(this);
    this.loadNextPage = this.loadNextPage.bind(this);
  }

  componentDidMount() {
    const {filters} = this.props.route?.params || {};

    this.setState({
      filters,
    });

    setTimeout(this.loadData, 0);
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
          onPress={this.loadData}
          transparent
          title="RETRY"
          titleStyle={{
            color: COLOUR_BLUE,
          }}
        />
      </View>
    );
  }

  async loadData() {
    const {filters, pageNumber} = this.state;

    const user = JSON.parse(await loadData(USER));
    console.log({user});

    const deviceId = filters.deviceId || null;
    const {domainName} = user;
    const endDate = filters.endDate || moment().format('YYYY-MM-DD[ ]H:mm:ss');
    const startDate =
      filters.startDate ||
      moment().subtract(6, 'months').format('YYYY-MM-DD[ 0:00:00]');
    const auditAction = filters.auditAction || null;

    this.setState({
      didErrorOccur: false,
      errorMessage: null,
      isLoading: true,
    });

    const {code, response, status} = await auditService.searchAuditTrail(
      domainName,
      startDate,
      pageNumber,
      DEFAULT_PAGE_SIZE + 10,
      endDate,
      deviceId || undefined,
      auditAction || undefined,
    );

    console.log({code, response, status});

    this.setState({
      isLoading: false,
    });

    if (status === ERROR_STATUS) {
      this.setState({
        didErrorOccur: true,
        errorMessage: await handleErrorResponse(response),
      });

      return;
    }

    this.setState({
      auditTrail: [
        ...this.state.auditTrail,
        ...this.sortEvents(response.data.lgs),
      ],
    });
  }

  loadNextPage() {
    this.setState({
      pageNumber: this.state.pageNumber + 1,
    });

    setTimeout(() => this.loadData(), 0);
  }

  renderItem(item, index) {
    const {devices} = this.state;
    const statusIconColor = {
      Active: '#32BE69',
      Inactive: '#EE312A',
    }[item.status || 'Active'];

    return (
      <ClickableListItem
        key={index}
        onPressOut={() => {
          this.props.navigation.navigate('AuditTrailDetails', {
            devices,
            ...item,
          });
        }}
        style={{
          backgroundColor: 'white',
          flexDirection: 'row',
          padding: 10,
        }}>
        <View style={{flex: 0.1, marginTop: 4}}>
          <Icon name="lens" color={statusIconColor} type="material" size={16} />
        </View>

        <View style={{flex: 0.7}}>
          <Text bold title>
            {item.auditEntity} {item.auditAction}
          </Text>
          <Text mid style={{fontWeight: 'bold'}}>
            Username: {item.username}
          </Text>
          <Text small style={{fontWeight: 'bold'}}>
            {item.formattedDateTime}
          </Text>
        </View>

        <View
          style={{
            alignItems: 'center',
            flex: 0.2,
            justifyContent: 'center',
          }}>
          <Icon
            name="chevron-right"
            color={'#B4B7BF'}
            type="material"
            size={50}
          />
        </View>
      </ClickableListItem>
    );
  }

  renderSectionHeader(item) {
    return <Text style={{lineHeight: 32, marginLeft: 10}}>{item}</Text>;
  }

  sortEvents(transactions) {
    let sections = [];

    transactions.map((value, index) => {
      const serializedAuditTrailEvent =
        this.auditTrailEventSerializer.serializeApiData(value);

      if (
        sections.find(
          value => value.title === serializedAuditTrailEvent.formattedDate,
        )
      ) {
        sections.map(section => {
          if (section.title === serializedAuditTrailEvent.formattedDate) {
            section.data.push(serializedAuditTrailEvent);
            return;
          }
        });

        return;
      }

      sections.push({
        title: serializedAuditTrailEvent.formattedDate,
        data: [serializedAuditTrailEvent],
      });
    });

    return sections;
  }

  isCloseToBottom({layoutMeasurement, contentOffset, contentSize}) {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  }

  render() {
    const {auditTrail, devices, didErrorOccur, isLoading} = this.state;

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
              onPress={() =>
                this.props.navigation.navigate('FilterAuditTrail', {
                  devices,
                })
              }
              size={24}
              type="material"
              underlayColor="transparent"
            />
          }
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_LIGHT,
          }}
          title="Audit Trail"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
          }}
        />

        {Boolean(auditTrail.length) && (
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
            sections={this.state.auditTrail}
          />
        )}

        {!Boolean(auditTrail.length) && !isLoading && (
          <Text big center style={{padding: 16}}>
            Nothing to display.
          </Text>
        )}

        {isLoading && <ActivityIndicator />}
        {didErrorOccur && this.errorFallbackMessage()}
      </View>
    );
  }
}

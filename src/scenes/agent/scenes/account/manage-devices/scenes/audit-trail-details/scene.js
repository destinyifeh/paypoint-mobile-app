import React from 'react';
import {Image, ScrollView, SectionList, View} from 'react-native';

import moment from 'moment';
import {Icon} from 'react-native-elements';

import Accordion from '../../../../../../../components/accordion';
import ActivityIndicator from '../../../../../../../components/activity-indicator';
import Button from '../../../../../../../components/button';
import ClickableListItem from '../../../../../../../components/clickable-list-item';
import Header from '../../../../../../../components/header';
import Modal from '../../../../../../../components/modal';
import Text from '../../../../../../../components/text';
import {DEFAULT_PAGE_SIZE} from '../../../../../../../constants';
import {ERROR_STATUS} from '../../../../../../../constants/api';
import {CASUAL} from '../../../../../../../constants/dialog-priorities';
import {
  COLOUR_BLUE,
  COLOUR_GREY,
  COLOUR_LIGHT_GREY,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_SIZE_SMALL,
} from '../../../../../../../constants/styles';
import AuditTrailEventSerializer from '../../../../../../../serializers/resources/audit-trail-event';
import {
  auditService,
  userManagementService,
} from '../../../../../../../setup/api';
import {flashMessage} from '../../../../../../../utils/dialog';
import handleErrorResponse from '../../../../../../../utils/error-handlers/api';

export default class AuditTrailDetails extends React.Component {
  constructor() {
    super();

    this.state = {
      auditTrailEvents: [],
      device: {},
      isLoading: true,
      pageNumber: 1,
    };

    this.loadNextPage = this.loadNextPage.bind(this);
  }

  auditTrailEventSerializer = new AuditTrailEventSerializer();

  componentDidMount() {
    const {
      auditAction,
      auditEntity,
      deviceId,
      devices,
      ip,
      roleName,
      username,
    } = this.props.route?.params || {};

    console.log({ip, username, auditAction});

    this.setState({
      auditAction,
      auditEntity,
      deviceId,
      devices,
      ip,
      roleName,
      username,
    });

    this.loadData = this.loadData.bind(this);
    this.fetchDeviceInformation = this.fetchDeviceInformation.bind(this);
    this.fetchDeviceAuditTrail = this.fetchDeviceAuditTrail.bind(this);

    setTimeout(this.loadData, 0);
  }

  async fetchDeviceInformation() {
    const {deviceId} = this.state;
    this.setState({
      didFetchDeviceInformationFail: false,
      isLoading: true,
    });

    const {code, response, status} =
      await userManagementService.getDeviceList();
    if (status === ERROR_STATUS) {
      this.setState({
        didFetchDeviceInformationFail: true,
        isLoading: false,
      });

      return;
    }

    console.log('GET DEVICES', {code, response});

    const device =
      response.data.find(device => device.deviceid == deviceId) || null; //response.data[0];
    this.setState({
      device,
    });
  }

  async fetchDeviceAuditTrail() {
    const {auditTrailEvents, device, deviceId, pageNumber} = this.state;

    if (!deviceId) {
      this.setState({
        auditTrailEvents: [],
        isLoading: false,
      });

      return;
    }

    this.setState({
      didFetchDeviceAuditTrailFail: false,
      isLoading: true,
    });

    const endDate = moment().format('YYYY-MM-DD[ ]H:mm:ss');
    const startDate = moment()
      .subtract(6, 'months')
      .format('YYYY-MM-DD[ 0:00:00]');
    const pageSize = DEFAULT_PAGE_SIZE;

    let {code, response, status} = await auditService.searchAuditTrail(
      null,
      startDate,
      pageNumber,
      pageSize + 40,
      endDate,
      deviceId || undefined,
    );

    console.log({device, deviceId, pageNumber, code, response, status});

    if (status === ERROR_STATUS) {
      this.setState({
        didFetchDeviceAuditTrailFail: true,
        isLoading: false,
      });

      return;
    }

    this.setState({
      auditTrailEvents: [
        ...auditTrailEvents,
        ...this.sortEvents(response.data.lgs),
      ],
      isLoading: false,
    });
  }

  loadData() {
    this.fetchDeviceAuditTrail();
    this.fetchDeviceInformation();
    return;
  }

  loadNextPage() {
    this.setState({
      pageNumber: this.state.pageNumber + 1,
    });

    setTimeout(() => this.fetchDeviceAuditTrail(), 0);
  }

  renderSectionHeader(item) {
    return (
      <View
        style={{
          backgroundColor: '#F3F3F4',
          paddingHorizontal: 12,
        }}>
        <Text style={{lineHeight: 32, marginLeft: 10}}>{item}</Text>
      </View>
    );
  }

  renderTransactionItem(item, index) {
    const statusIconColor = {
      Active: '#32BE69',
      Inactive: '#EE312A',
    }[item.status || 'Active'];

    return (
      <ClickableListItem
        key={index}
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
      </ClickableListItem>
    );
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

  confirmationModal() {
    const {isPendingActionFuncLoading, pendingAction, pendingActionFunc} =
      this.state;

    return (
      <Modal
        buttons={[
          {
            loading: isPendingActionFuncLoading,
            onPress: pendingActionFunc,
            // {
            //   this.setState({showConfirmationModal: false})
            // },
            buttonStyle: {
              paddingHorizontal: 10,
            },
            containerStyle: {
              paddingHorizontal: 10,
              width: '40%',
            },
            title: 'Yes',
          },
          {
            loading: isPendingActionFuncLoading,
            onPress: () => {
              this.setState({showConfirmationModal: false});
            },
            buttonStyle: {
              paddingHorizontal: 10,
              paddingRight: 0,
            },
            containerStyle: {
              backgroundColor: 'transparent',
              paddingHorizontal: 10,
              paddingRight: 0,
              width: '40%',
            },
            title: 'NO',
            titleStyle: {
              color: COLOUR_RED,
            },
          },
        ]}
        content={
          <View style={{flex: 0.6, justifyContent: 'center'}}>
            <Text big center>
              Are you sure you want to {pendingAction}?
            </Text>
          </View>
        }
        isModalVisible={true}
        onRequestClose={() => this.setState({showConfirmationModal: false})}
        size="sm"
        title="Confirm"
        withButtons
      />
    );
  }

  isCloseToBottom({layoutMeasurement, contentOffset, contentSize}) {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  }

  get transactionsContent() {
    const {auditTrailEvents, device, isLoading} = this.state;

    if (!Boolean(auditTrailEvents.length) && !isLoading) {
      return (
        <Text center style={{padding: 24}}>
          No data to display {!Boolean(device) && 'for unregistered device'}
        </Text>
      );
    }

    return (
      <SectionList
        keyExtractor={(item, index) => item + index}
        onScroll={({nativeEvent}) => {
          if (this.isCloseToBottom(nativeEvent)) {
            this.loadNextPage();
          }
        }}
        renderItem={({item, index, section}) =>
          this.renderTransactionItem(item, index)
        }
        renderSectionHeader={({section: {title}}) =>
          this.renderSectionHeader(title)
        }
        sections={auditTrailEvents}
      />
    );
  }

  async activateDevice() {
    const {device, deviceId} = this.state;
    this.setState({
      isPendingActionFuncLoading: true,
    });

    const {response, status} = await userManagementService.activateDevice(
      deviceId,
    );
    // status = 'SU'
    if (status === ERROR_STATUS) {
      this.setState({
        isPendingActionFuncLoading: false,
      });

      flashMessage(null, await handleErrorResponse(response), CASUAL);

      return;
    }

    flashMessage(null, 'Success', CASUAL);

    this.setState({
      isPendingActionFuncLoading: false,
      showConfirmationModal: false,
      device: {
        ...device,
        status: 'Active',
      },
    });
  }

  async deactivateDevice() {
    const {device, deviceId} = this.state;
    this.setState({
      isPendingActionFuncLoading: true,
    });

    const {response, status} = await userManagementService.deactivateDevice(
      deviceId,
    );
    // status = 'SU'
    if (status === ERROR_STATUS) {
      this.setState({
        isPendingActionFuncLoading: false,
      });

      flashMessage(null, await handleErrorResponse(response), CASUAL);

      return;
    }

    flashMessage(null, 'Success', CASUAL);

    this.setState({
      isPendingActionFuncLoading: false,
      showConfirmationModal: false,
      device: {
        ...device,
        status: 'Inactive',
      },
    });
  }

  onActivateDevicePress() {
    this.setState({
      pendingAction: 'activate device',
      pendingActionFunc: this.activateDevice.bind(this),
      showConfirmationModal: true,
    });
  }

  onDeactivateDevicePress() {
    this.setState({
      pendingAction: 'deactivate device',
      pendingActionFunc: this.deactivateDevice.bind(this),
      showConfirmationModal: true,
    });
  }

  onManageDevicePress() {
    const {devices} = this.state;

    this.props.navigation.navigate('MyDevices', {
      devices,
    });
  }

  get activateDeviceButton() {
    return (
      <Button
        containerStyle={{
          backgroundColor: 'transparent',
          borderColor: COLOUR_GREY,
          borderWidth: 1,
        }}
        onPress={this.onActivateDevicePress.bind(this)}
        title="Activate Device"
        titleStyle={{
          color: COLOUR_GREY,
          fontSize: FONT_SIZE_SMALL,
          fontWeight: 'normal',
        }}
      />
    );
  }

  get deactivateDeviceButton() {
    return (
      <Button
        containerStyle={{
          backgroundColor: 'transparent',
          borderColor: COLOUR_GREY,
          borderWidth: 1,
        }}
        onPress={this.onDeactivateDevicePress.bind(this)}
        title="Deactivate Device"
        titleStyle={{
          color: COLOUR_GREY,
          fontSize: FONT_SIZE_SMALL,
          fontWeight: 'normal',
        }}
      />
    );
  }

  get manageDeviceButton() {
    return (
      <Button
        containerStyle={{
          backgroundColor: 'transparent',
          borderColor: COLOUR_GREY,
          borderWidth: 1,
        }}
        onPress={this.onManageDevicePress.bind(this)}
        title="Manage Device"
        titleStyle={{
          color: COLOUR_GREY,
          fontSize: FONT_SIZE_SMALL,
          fontWeight: 'normal',
        }}
      />
    );
  }

  render() {
    const {
      auditTrailEvents,
      device,
      ip,
      isLoading,
      roleName,
      showConfirmationModal,
      username,
    } = this.state;

    const deviceActionButton = this.manageDeviceButton;
    // const deviceActionButton = {
    //   'Active': this.deactivateDeviceButton,
    //   'Inactive': this.activateDeviceButton,
    // }[device?.status]

    return (
      <View style={{flex: 1}}>
        <Header
          containerStyle={{
            backgroundColor: COLOUR_BLUE,
          }}
          goBack={() => this.props.navigation.goBack()}
          withNavigateBackIcon
          title="Audit Trail Details"
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_LIGHT,
          }}
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
          }}
        />

        {showConfirmationModal && this.confirmationModal()}

        <ScrollView>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-evenly',
              backgroundColor: '#F3F3F4',
              height: 380,
            }}>
            <View
              style={{
                backgroundColor: COLOUR_LIGHT_GREY,
                padding: 20,
              }}>
              <Image
                source={require('../../../../../../../assets/media/images/laptop.png')}
                style={{
                  resizeMode: 'contain',
                }}
              />
            </View>

            <View>
              <Text big bold center>
                {device ? device.deviceName : 'Unregistered device'}
              </Text>
              <Text
                center
                isSuccessStatus={device?.status === 'Active'}
                style={{marginBottom: 8}}>
                {device?.status}
              </Text>
              <Text>IP Address: {ip}</Text>
              <Text>Username: {username}</Text>
              <Text>Role: {roleName}</Text>
              {/* <Text style={{fontSize: FONT_SIZE_SMALL}}>Last Activity: 20/05/19 22:00</Text> */}
            </View>
            {deviceActionButton}
          </View>

          <Accordion
            content={this.transactionsContent}
            expanded={true}
            header="Recent Device Activity"
            style={{padding: 0}}
          />

          {isLoading && <ActivityIndicator />}
        </ScrollView>
      </View>
    );
  }
}

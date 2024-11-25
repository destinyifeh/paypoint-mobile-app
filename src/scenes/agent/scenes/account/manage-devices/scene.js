import React from 'react'
import { SectionList, View } from 'react-native'
import { Icon } from 'react-native-elements'
import ActivityIndicator from '../../../../../components/activity-indicator'
import Button from '../../../../../components/button'
import ClickableListItem from '../../../../../components/clickable-list-item'
import Header from '../../../../../components/header'
import Text from '../../../../../components/text'
import { ERROR_STATUS } from '../../../../../constants/api'
import {
  COLOUR_BLUE,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT
} from '../../../../../constants/styles'
import { userManagementService } from '../../../../../setup/api'
import handleErrorResponse from '../../../../../utils/error-handlers/api'

export default class ManageDevicesScene extends React.Component {
  state = {
    devices: [],
    expand: null,
    wasFetchSuccessful: null,
  }

  componentDidMount() {
    this.loadDevices();
  }

  async loadDevices() {
    this.setState({didErrorOccur: false, isLoading: true});

    const { response, status } = await userManagementService.getDeviceList();

    console.log(response);

    if (status === ERROR_STATUS) {
      this.setState({
        didErrorOccur: true,
        errorMessage: await handleErrorResponse(response),
        isLoading: false,
        wasFetchSuccessful: false
      });

      return
    }

    this.setState({
      devices: response.data,
      didErrorOccur: false,
      errorMessage: null,
      isLoading: false,
      wasFetchSuccessful: true
    });
  }

  renderItem (item, index) {
    const { devices } = this.state;
    
    const statusIconColor = {
      'Completed': '#32BE69',
      'Failed': '#EE312A',
      'In Progress': '#F8B573'
    }[item.status]

    return <ClickableListItem key={index} onPressOut={() => this.props.navigation.navigate(item.href, {
      devices
    })} style={{
      backgroundColor: 'white',
      flexDirection: 'row',
      marginBottom: 1,
    }}>
      <View style={{flex: .8, justifyContent: 'space-evenly', paddingLeft: 20}}>
        <Text black>{item.name}</Text>
      </View>

      <View style={{
        alignItems: 'center',
        flex: .2,
        justifyContent: 'center'
      }}>
        <Icon 
          name='chevron-right'
          color={'#B4B7BF'}
          type="material"
          size={50} />
      </View>
    </ClickableListItem>
  }

  renderSectionHeader (item) {
    return <Text style={{lineHeight: 32, marginLeft: 10, marginTop: 30}}>
      {item}
    </Text>
  }

  renderErrorMessage() {
    const { errorMessage } = this.state;

    return (
      <View
        style={{alignItems: 'center', flex: .3, justifyContent: 'center', padding: 16}}
      >
        <Text big center>{errorMessage}</Text>
        <Button 
          containerStyle={{
            marginTop: 8
          }}
          onPress={this.loadDevices.bind(this)} 
          transparent
          title="RETRY"
          titleStyle={{
            color: COLOUR_BLUE
          }}
        />
      </View>
    );
  }

  render() {
    const { devices, didErrorOccur, isLoading, wasFetchSuccessful } = this.state;

    return <View style={{
        backgroundColor: '#F3F3F4',
        flex: 1
      }}>
      <Header 
        containerStyle={{
          backgroundColor: COLOUR_BLUE
        }}
        navigationIconColor={COLOUR_WHITE}
        leftComponent={<Icon 
          color={COLOUR_RED}
          underlayColor="transparent"
          name="chevron-left"
          size={40}
          type="material"
          onPress={() => this.props.navigation.goBack()}
        />}
        hideNavigationMenu={this.props.hideNavigator}
        showNavigationMenu={this.props.showNavigator}
        statusBarProps={{
          backgroundColor: 'transparent',
          barStyle: CONTENT_LIGHT
        }}
        title="Manage Devices"
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: 'bold'
        }} 
      />
      
      <View style={{flex: 1}}>

        {isLoading && <ActivityIndicator />}
        {didErrorOccur && this.renderErrorMessage()}

        {wasFetchSuccessful && <SectionList
          keyExtractor={(item, index) => item + index}
          renderItem={({item, index, section}) => this.renderItem(item, index)}
          renderSectionHeader={({section: {title}}) => this.renderSectionHeader(title)}
          sections={[
            {
              title: '', 
              data: [
                {
                  name: 'My Devices',
                  href: 'MyDevices'
                },
                {
                  name: 'Audit Trail',
                  href: 'ManageDevicesAuditTrail'
                }
              ]
            }
          ]}
        />}

      </View>

    </View>
  }
}
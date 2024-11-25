import React from 'react';
import {SectionList, View} from 'react-native';
import {Icon} from 'react-native-elements';

import ActivityIndicator from '../../../../../../../components/activity-indicator';
import ClickableListItem from '../../../../../../../components/clickable-list-item';
import Header from '../../../../../../../components/header';
import Text from '../../../../../../../components/text';
import {MONTHS} from '../../../../../../../constants';
import {ERROR_STATUS} from '../../../../../../../constants/api';
import {
  COLOUR_BLUE,
  COLOUR_GREY,
  COLOUR_OFF_WHITE,
  COLOUR_SCENE_BACKGROUND,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../../../../../constants/styles';
import Onboarding from '../../../../../../../services/api/resources/onboarding';
import {flashMessage} from '../../../../../../../utils/dialog';
import handleErrorResponse from '../../../../../../../utils/error-handlers/api';

class RequestRow extends React.Component {
  render() {
    const {onPress, request} = this.props;

    return (
      <ClickableListItem
        onPress={onPress}
        style={{
          alignItems: 'center',
          backgroundColor: COLOUR_WHITE,
          flex: 1,
          flexDirection: 'row',
          height: 90,
          justifyContent: 'space-between',
          marginBottom: 5,
          padding: 20,
          width: '100%',
        }}>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: COLOUR_BLUE,
            borderRadius: 17,
            height: 35,
            justifyContent: 'center',
            width: 35,
          }}>
          <Text white>
            {request.applicantDetails.firstName[0]}
            {request.applicantDetails.surname[0]}
          </Text>
        </View>

        <View
          style={{
            flex: 0.65,
            justifyContent: 'space-evenly',
            marginVertical: 10,
          }}>
          <Text bold>
            {request.applicantDetails.firstName}{' '}
            {request.applicantDetails.surname}
            {'\n'}
          </Text>
          {request.businessDetails && request.businessDetails.businessName ? (
            <Text>{request.businessDetails.businessName}</Text>
          ) : null}
        </View>

        <View
          style={{
            alignItems: 'flex-end',
            flex: 0.2,
          }}>
          <Icon color={COLOUR_GREY} name="chevron-right" size={32} />
        </View>
      </ClickableListItem>
    );
  }
}

export default class ViewAllAgentsScene extends React.Component {
  onboarding = new Onboarding();

  state = {
    agents: [],
    isLoading: true,
    page: 1,
  };

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const id = this.props.route.params.id;

    const {response, status} =
      await this.onboarding.getMyApplicationsByApprovalStatus(
        id,
        this.state.page,
      );

    console.log('GET APPLICATION BY APPROVAL STATUS', {response});

    this.setState({
      isLoading: false,
    });

    if (status === ERROR_STATUS) {
      flashMessage(null, await handleErrorResponse(response));

      return;
    }

    this.setState({
      agents: response,
    });
  }

  get recentRequestsDemo() {
    return [
      {
        title: '12 Jul 2019',
        data: [
          {
            firstName: 'Name',
            lastName: 'surname',
            id: '09101029012',
            status: 'Pending',
          },
          {
            firstName: 'Name',
            lastName: 'surname',
            id: '09101029012',
            status: 'Pending',
          },
        ],
      },
      {
        title: '5 Jul 2019',
        data: [
          {
            firstName: 'Name',
            lastName: 'surname',
            id: '09101029012',
            status: 'Pending',
          },
          {
            firstName: 'Name',
            lastName: 'surname',
            id: '09101029012',
            status: 'Pending',
          },
        ],
      },
    ];
  }

  renderItem(item) {
    return (
      <RequestRow
        onPress={() => {
          item.approvalStatus === 'REJECTED'
            ? this.props.updateApplication(item) &&
              this.props.navigation.navigate('Application')
            : this.props.navigation.navigate('ViewAgentDetails');
        }}
        request={item}
      />
    );
  }

  renderSectionHeader(item) {
    return (
      <View
        style={{
          backgroundColor: '#F3F3F4',
          paddingHorizontal: 12,
        }}>
        <Text style={{lineHeight: 32, marginLeft: 10}}>{/* {item} */}</Text>
      </View>
    );
  }

  get sections() {
    const sections_ = [];
    const {agents} = this.state;

    agents.forEach(value => {
      const date = new Date(value.dateLastModified);
      console.log({date});
      const formattedDate = `${date.getDate()} ${
        MONTHS[date.getUTCMonth()]
      } ${date.getFullYear()}`;

      const section_ = sections_.find(
        section => section.title === formattedDate,
      );

      if (section_) {
        sections_.map(section => {
          if (section.title === formattedDate) {
            section.data.push(value);
          }
        });
      } else {
        sections_.push({
          title: formattedDate,
          data: [value],
        });
      }
    });

    return sections_;
  }

  render() {
    return this.state.isLoading ? (
      <ActivityIndicator />
    ) : (
      <View
        style={{
          backgroundColor: COLOUR_SCENE_BACKGROUND,
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
          title={`View ${this.props.route.params.category} Agents`}
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
          }}
        />

        <View
          style={{
            backgroundColor: COLOUR_OFF_WHITE,
            justifyContent: 'space-between',
          }}>
          <SectionList
            keyExtractor={(item, index) => item + index}
            renderItem={({item, index, section}) =>
              this.renderItem(item, index)
            }
            renderSectionHeader={({section: {title}}) =>
              this.renderSectionHeader(title)
            }
            sections={this.sections}
          />
        </View>
      </View>
    );
  }
}

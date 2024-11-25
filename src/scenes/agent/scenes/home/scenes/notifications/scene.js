import React from 'react';
import { SectionList, View } from 'react-native';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';

import ClickableListItem from '../../../../../../components/clickable-list-item';
import Header from '../../../../../../components/header';
import Text from '../../../../../../components/text';
import {
  COLOUR_BLUE,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../../../../constants/styles';
import Hyperlink from '../../../../../../components/hyperlink';
import Messaging from '../../../../../../services/api/resources/messaging';
import { ERROR_STATUS } from '../../../../../../constants/api';
import { loadData } from '../../../../../../utils/storage';
import { DEFAULT_PAGE_SIZE, USER } from '../../../../../../constants';
import ActivityIndicator from '../../../../../../components/activity-indicator';
import { isScrollCloseToBottom } from '../../../../../../utils/scroll';

export default class NotificationsScene extends React.Component {
  constructor() {
    super();

    this.messaging = new Messaging();
    this.fetchedPages = [];

    this.state = {
      expand: null,
      isLoading: false,
      pageNumber: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      sortFields: 'date',
      sortOrder: 'DESC',
    };

    this.fetchNotifications = this.fetchNotifications.bind(this);
    this.loadNextPage = this.loadNextPage.bind(this);
  }

  async componentDidMount() {
    const { pageNumber, pageSize } = this.state;

    this.setState({
      user: JSON.parse(await loadData(USER)),
    });

    this.fetchNotifications(pageNumber, pageSize);
  }

  async fetchNotifications() {
    const { pageNumber, pageSize, sortFields, sortOrder, user } = this.state;

    if (this.fetchedPages.includes(pageNumber)) return;

    this.setState({
      isLoading: true,
    });

    const { code, response, status } = (
      await this.messaging.retrieveNotifications(
          user.mobileNo, pageNumber, pageSize, sortFields, sortOrder,
      )
    );

    console.log({code, response, status});

    if (status === ERROR_STATUS) {
      this.setState({
        didErrorOccur: true,
        isLoading: false,
      });

      return;
    }

    this.setState({
      isLoading: false,
      notifications: response.items,
    });

    this.fetchedPages.push(pageNumber);
  }

  loadNextPage() {
    this.setState((prevState) => ({
      pageNumber: prevState.pageNumber + 1,
    }));

    setTimeout(() => this.fetchNotifications(), 0);
  }

  renderItem(item, index) {
    return <ClickableListItem key={index} onPressOut={() => this.setState({
      expand: this.state.expand === item.time ? null : item.time,
    })} style={{
      backgroundColor: 'white',
      flexDirection: 'row',
      marginBottom: 5,
    }}>
      <View style={{
        justifyContent: 'center',
        flex: .1,
        borderLeftWidth: !item.read ? 5 : 0,
        borderLeftColor: !item.read ? COLOUR_RED : 'transparent',
      }}>
        <Icon
          name="notifications"
          color={!item.read ? '#808593' : '#B2B5BE'}
          type="material"
          size={32} />
      </View>

      <View
        style={{
          flex: .7,
          justifyContent: 'space-evenly',
          paddingVertical: 10,
        }}
      >
        <Text bold>{item.title}</Text>
        <Text>{item.message}</Text>
        <Text small>{item.date}</Text>
        {this.state.expand === item.date &&
          <Hyperlink href="">{`Action >`}</Hyperlink>}
      </View>

      <View style={{
        alignItems: 'center',
        flex: .2,
        justifyContent: 'center',
        paddingVertical: 10,
      }}>
        <Icon
          name={this.state.expand === item.date ? 'expand-less' : 'expand-more'}
          color={'#B4B7BF'}
          type="material"
          size={50} />
      </View>
    </ClickableListItem>;
  }

  renderSectionHeader(item) {
    return <Text style={{lineHeight: 32, marginLeft: 10}}>
      {item}
    </Text>;
  }

  sortDataIntoSections(data) {
    const sections = [];

    data?.map((notification) => {
      if (
        sections.find(
            (value) => value.title === notification.prettyTime,
        )
      ) {
        sections.map((section) => {
          if (section.title === notification.prettyTime) {
            section.data.push(notification);
            return;
          }
        });

        return;
      }

      sections.push({
        title: notification.prettyTime,
        data: [
          notification,
        ],
      });
    });

    return sections;
  }

  render() {
    const { isLoading } = this.state;

    return <View style={{
      backgroundColor: '#F3F3F4',
      flex: 1,
    }}>
      <Header
        containerStyle={{
          backgroundColor: COLOUR_BLUE,
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
          barStyle: CONTENT_LIGHT,
        }}
        title="Notifications"
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: 'bold',
        }} />

      {isLoading && <ActivityIndicator />}

      <SectionList
        keyExtractor={(item, index) => item + index}
        onScroll={({nativeEvent}) => {
          isScrollCloseToBottom(nativeEvent) && this.loadNextPage();
        }}
        renderItem={({item, index}) => this.renderItem(item, index)}
        renderSectionHeader={
          ({section: {title}}) => this.renderSectionHeader(title)
        }
        sections={this.sortDataIntoSections(this.state.notifications)}
      />

    </View>;
  }
}

NotificationsScene.propTypes = {
  hideNavigator: PropTypes.func,
  navigation: PropTypes.object,
  showNavigator: PropTypes.func,
};

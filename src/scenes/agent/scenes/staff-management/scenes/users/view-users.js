import React from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  ToastAndroid,
  View
} from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import ActivityIndicator from '../../../../../../components/activity-indicator';
import ClickableListItem from '../../../../../../components/clickable-list-item';
import Header from '../../../../../../components/header';
import Hyperlink from '../../../../../../components/hyperlink';
import Text from '../../../../../../components/text';
import { ERROR_STATUS } from '../../../../../../constants/api';
import {
  COLOUR_BLUE,
  COLOUR_SCENE_BACKGROUND,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../../../../constants/styles';
import Platform from '../../../../../../services/api/resources/platform';
import {
  hideNavigator,
  showNavigator
} from '../../../../../../services/redux/actions/navigation';
import { refreshingViewUsers } from '../../../../../../services/redux/actions/users-scene';
import handleErrorResponse from '../../../../../../utils/error-handlers/api';

const screenWidth = Math.round(Dimensions.get('window').width);

class UserCard extends React.Component {
  render() {
    console.log(this.props.item);

    const { firstName, lastName, email, mobileNo } = this.props.item;

    return <ClickableListItem
      onPress={() => this.props.navigation.navigate('UpdateUser', {
        item: this.props.item,
      })}>
      <View style={styles.UserCard}>
        <View style={{flex: 1, justifyContent: 'space-evenly'}}>
          <Text black bold title>
            {firstName} {lastName}
          </Text>
          <Text>
            {mobileNo}
          </Text>
          <Text>
            {email}
          </Text>
        </View>

        <Icon 
          color={'#B4B7BF'}
          name="chevron-right"
          size={48}
          type="material"
        />
      </View>
    </ClickableListItem>
  }
}

class ViewUserScene extends React.Component {
  platform = new Platform();

  constructor() {
    super()

    this.state = {
      isLoading: true,
      Users: []
    };

    this.loadData = this.loadData.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const { status, response, code } = await this.platform.retrieveUsers();

    console.log(status, response);

    if (status === ERROR_STATUS) {
      ToastAndroid.show(
        await handleErrorResponse(response),
        ToastAndroid.LONG
      );

      this.setState({
        isLoading: false
      })

      return
    }

    this.setState({
      isLoading: false,
      Users: response
    })
  }

  renderItem(item, index) {
    return <UserCard 
      item={item} 
      key={index} 
      navigation={this.props.navigation}
    />
  }

  render() {
    if (this.props.doRefreshViewUsers) {
      this.props.refreshingViewUsers()
      this.setState({
        isLoading: true
      });
      this.loadData();
    }

    if (this.state.isLoading) {
      return <ActivityIndicator />
    }

    return <View style={{
      backgroundColor: COLOUR_SCENE_BACKGROUND,
      flex: 1,
    }}>
      <Header 
        containerStyle={{
          backgroundColor: COLOUR_BLUE
        }}
        navigation={this.props.navigation}
        rightComponent={<Hyperlink style={{color: COLOUR_WHITE, fontSize: 12}} href="CreateUser">+ Add User</Hyperlink>}
        statusBarProps={{
          backgroundColor: 'transparent',
          barStyle: CONTENT_LIGHT
        }}
        title="Users"
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: 'bold'
        }}
        withNavigateBackIcon />

      <FlatList 
        contentContainerStyle={{
          paddingHorizontal: 5,
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-evenly',
        }} 
        data={this.state.Users}
        keyExtractor={(item, index) => item + index}
        renderItem={({item, index}) => this.renderItem(item, index)}
      />
    </View>
  }
}

const styles = StyleSheet.create({
  UserCard: {
    alignItems: 'center',
    backgroundColor: COLOUR_WHITE,
    flexDirection: 'row',
    height: 80,
    justifyContent: 'space-between',
    marginBottom: 2,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: screenWidth
  }
});

function mapStateToProps(state) {
  return {
    doRefreshViewUsers: state.usersScene.doRefreshViewUsers,
    isNavigatorVisible: state.navigation.isNavigatorVisible,
    // pendingUrl: state.navigation.pendingUrl
  }
}

function mapDispatchToProps(dispatch) {
  return {
    hideNavigator: () => dispatch(hideNavigator()),
    refreshingViewUsers: () => dispatch(refreshingViewUsers()),
    showNavigator: () => dispatch(showNavigator()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewUserScene);

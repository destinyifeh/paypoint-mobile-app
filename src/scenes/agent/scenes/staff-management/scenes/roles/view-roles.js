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
import { refreshingViewRoles } from '../../../../../../services/redux/actions/roles-scene';
import handleErrorResponse from '../../../../../../utils/error-handlers/api';

const screenWidth = Math.round(Dimensions.get('window').width);

class RoleCard extends React.Component {
  render() {
    const { name } = this.props.item;

    return <ClickableListItem
      onPress={() => this.props.navigation.navigate('UpdateRole', {
        item: this.props.item,
      })}>
      <View style={styles.roleCard}>
        <Text black title>
          {name.replace(/_/g, ' ')}
        </Text>
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

class ViewRoleScene extends React.Component {
  platform = new Platform();

  constructor() {
    super()

    this.state = {
      isLoading: true,
      roles: []
    };

    this.loadData = this.loadData.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const { status, response, code } = await this.platform.retrieveRoles();

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
      roles: response
    })
  }

  renderItem(item, index) {
    return <RoleCard 
      item={item} 
      key={index} 
      navigation={this.props.navigation}
    />
  }

  render() {
    if (this.props.doRefreshViewRoles) {
      this.props.refreshingViewRoles()
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
        rightComponent={<Hyperlink style={{color: COLOUR_WHITE, fontSize: 12}} href="CreateRole">+ Add Role</Hyperlink>}
        statusBarProps={{
          backgroundColor: 'transparent',
          barStyle: CONTENT_LIGHT
        }}
        title="Roles"
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
        data={this.state.roles}
        keyExtractor={(item, index) => item + index}
        renderItem={({item, index}) => this.renderItem(item, index)}
      />
    </View>
  }
}

const styles = StyleSheet.create({
  roleCard: {
    alignItems: 'center',
    backgroundColor: COLOUR_WHITE,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    marginBottom: 2,
    padding: 20,
    width: screenWidth
  }
});

function mapStateToProps(state) {
  return {
    doRefreshViewRoles: state.rolesScene.doRefreshViewRoles,
    isNavigatorVisible: state.navigation.isNavigatorVisible,
    // pendingUrl: state.navigation.pendingUrl
  }
}

function mapDispatchToProps(dispatch) {
  return {
    hideNavigator: () => dispatch(hideNavigator()),
    refreshingViewRoles: () => dispatch(refreshingViewRoles()),
    showNavigator: () => dispatch(showNavigator()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewRoleScene);

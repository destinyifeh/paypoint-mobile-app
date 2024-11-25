import React from 'react'
import {
  ActivityIndicator,
  InteractionManager,
  Switch,
  View
} from 'react-native'
import { Icon } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import {
  COLOUR_BLUE,
  COLOUR_WHITE, 
  CONTENT_LIGHT
} from '../../../../constants/styles';
import Header from '../../../../components/header';
import Text from '../../../../components/text';
import { 
  hideNavigator, 
  showNavigator
} from '../../../../services/redux/actions/navigation'
import ClickableListItem from '../../../../components/clickable-list-item';


class ReportsScene extends React.Component {

  state = {

  }

  componentDidMount () {
    InteractionManager.runAfterInteractions(() => {
      // 2: Component is done animating
      // 3: Start fetching the team
      this.setState({
        animationsDone: true
      });
    });
  }

  render () {
    if (!this.state.animationsDone) {
      return <View style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
        <ActivityIndicator size="large" color={COLOUR_BLUE} />
      </View>
    }

    return <View style={{
      backgroundColor: '#F2F3F3',
      flex: 1
    }}
    onTouchMove={() => this.props.isNavigatorVisible ? this.props.hideNavigator() : null}>
      <Header 
        containerStyle={{
          backgroundColor: COLOUR_BLUE
        }}
        navigationIconColor={COLOUR_WHITE}
        hideNavigationMenu={this.props.hideNavigator}
        showNavigationMenu={this.props.showNavigator}
        statusBarProps={{
          backgroundColor: 'transparent',
          barStyle: CONTENT_LIGHT
        }}
        title="My Settings"
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: 'bold'
        }}
        withNavigator />

      <ScrollView contentContainerStyle={{
        paddingTop: 30
      }}>
        <ClickableListItem style={{
          alignItems: 'center',
          backgroundColor: COLOUR_WHITE,
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: 55,
          padding: 10,
          paddingHorizontal: 15,
          marginBottom: 10
        }}
        onPressOut={() => this.props.navigation.navigate('SelectLanguage')}>
          <Text black>Language</Text>
          <Text>English</Text>
        </ClickableListItem>
        
        <View
          hidden
          style={{
            alignItems: 'center',
            backgroundColor: COLOUR_WHITE,
            flexDirection: 'row',
            justifyContent: 'space-between',
            height: 55,
            padding: 10,
            paddingHorizontal: 15,
            marginBottom: 10
          }}
        >
          <Text black>Notifications</Text>
          <Switch />
        </View>
        
        <View style={{
          alignItems: 'center',
          backgroundColor: COLOUR_WHITE,
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: 55,
          padding: 10,
          paddingHorizontal: 15,
          marginBottom: 10
        }}>
          <Text black>Use Touch/Face ID</Text>
          <Switch />
        </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(ReportsScene)

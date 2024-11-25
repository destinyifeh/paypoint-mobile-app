import React from 'react';
import { SectionList, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import ClickableListItem from '../../../../components/clickable-list-item';
import Header from '../../../../components/header';
import Text from '../../../../components/text';
import { 
  COLOUR_BLUE, 
  COLOUR_RED, 
  COLOUR_WHITE, 
  CONTENT_LIGHT 
} from '../../../../constants/styles';
import { 
  hideNavigator, 
  showNavigator 
} from '../../../../services/redux/actions/navigation';

class StaffManagementScene extends React.Component {
  state = {
    expand: null
  }

  renderItem (item, index) {
    
    const statusIconColor = {
      'Completed': '#32BE69',
      'Failed': '#EE312A',
      'In Progress': '#F8B573'
    }[item.status]

    return <ClickableListItem key={index} onPressOut={() => this.props.navigation.navigate(item.href)} style={{
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

  render () {
    return <View style={{
        backgroundColor: '#F3F3F4',
        flex: 1
      }}>
      
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
        title="My Account"
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: 'bold'
        }}
        withNavigator />
      
      <View>

        <SectionList
          keyExtractor={(item, index) => item + index}
          renderItem={({item, index, section}) => this.renderItem(item, index)}
          renderSectionHeader={({section: {title}}) => this.renderSectionHeader(title)}
          sections={[
            {
              title: '', 
              data: [
                {
                  name: 'Roles',
                  href: 'ViewRoles'
                },
                {
                  name: 'Users',
                  href: 'ViewUsers'
                }
              ]
            }
          ]}
        />

      </View>

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

export default connect(mapStateToProps, mapDispatchToProps)(StaffManagementScene)

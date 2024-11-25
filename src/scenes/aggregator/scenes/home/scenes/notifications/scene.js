import React from 'react'
import { SectionList, View } from 'react-native'
import { Icon } from 'react-native-elements'
import ClickableListItem from '../../../../../../components/clickable-list-item'
import Header from '../../../../../../components/header'
import Text from '../../../../../../components/text'
import { 
  COLOUR_BLUE, 
  COLOUR_RED, 
  COLOUR_WHITE, 
  CONTENT_LIGHT 
} from '../../../../../../constants/styles';
import Hyperlink from '../../../../../../components/hyperlink';

export default class NotificationsScene extends React.Component {
  state = {
    expand: null
  }

  renderItem (item, index) {
    
    const statusIconColor = {
      'Completed': '#32BE69',
      'Failed': '#EE312A',
      'In Progress': '#F8B573'
    }[item.status]

    return <ClickableListItem key={index} onPressOut={() => this.setState({
      expand: this.state.expand === item.time ? null : item.time  
    })} style={{
      backgroundColor: 'white',
      flexDirection: 'row',
      marginBottom: 5,
    }}>
      <View style={{
        justifyContent: 'center', 
        flex: .1,
        borderLeftWidth: item.unread ? 5 : 0,
        borderLeftColor: item.unread ? COLOUR_RED : 'transparent'
      }}>
        <Icon 
          name="notifications"
          color={item.unread ? '#808593' : '#B2B5BE'}
          type="material"
          size={32} />
      </View>
      
      <View style={{flex: .7, justifyContent: 'space-evenly', paddingVertical: 10}}>
        <Text bold>{item.description}</Text>
        <Text small>{item.time}</Text>
        {this.state.expand === item.time && <Hyperlink href="">Action ></Hyperlink>}
      </View>

      <View style={{
        alignItems: 'center',
        flex: .2,
        justifyContent: 'center', 
        paddingVertical: 10
      }}>
        <Icon 
          name={this.state.expand === item.time ? 'expand-less' : 'expand-more'}
          color={'#B4B7BF'}
          type="material"
          size={50} />
      </View>
    </ClickableListItem>
  }

  renderSectionHeader (item) {
    return <Text style={{lineHeight: 32, marginLeft: 10}}>
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
        leftComponent={<Icon 
          color={COLOUR_WHITE}
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
        title="Notifications"
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: 'bold'
        }} />

      <SectionList
        keyExtractor={(item, index) => item + index}
        renderItem={({item, index, section}) => this.renderItem(item, index)}
        renderSectionHeader={({section: {title}}) => this.renderSectionHeader(title)}
        sections={[
          {
            title: 'Today', 
            data: [
              {
                description: 'Finish registration: Add your cards',
                time: 'Today at 10:46',
                unread: true
              },
              {
                description: 'Finish registration: Add your cards',
                time: 'Today at 7:26',
                unread: false
              }
            ]
          },
          {
            title: 'Earlier', 
            data: [
              {
                description: 'Annual Report: View your balance',
                time: 'Monday at 5:16',
                unread: false
              },
              {
                description: 'Annual Report: View your balance',
                time: 'Tuesday at 7:42',
                unread: true
              },
              {
                description: 'Annual Report: View your balance',
                time: 'Wednesday at 10:46',
                unread: false
              }
            ]
          }
        ]}
      />

    </View>
  }
}
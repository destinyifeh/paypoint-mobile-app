import React from 'react'
import { 
  SectionList,
  View 
} from 'react-native'
import { 
  Icon
} from 'react-native-elements'
import ClickableListItem from '../../../../../../components/clickable-list-item'
import Header from '../../../../../../components/header'
import { 
  COLOUR_BLUE,
  COLOUR_OFF_WHITE,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  COLOUR_SCENE_BACKGROUND,
  COLOUR_GREY
} from '../../../../../../constants/styles'
import FormInput from '../../../../../../components/form-controls/form-input'
import Text from '../../../../../../components/text';

class RequestRow extends React.Component {
  render () {
    const { onPress, request } = this.props

    return <ClickableListItem 
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
        width: '100%'
      }}>
      <View style={{
        alignItems: 'center',
        backgroundColor: COLOUR_BLUE,
        borderRadius: 17,
        height: 35,
        justifyContent: 'center',
        width: 35
      }}>
        <Text white>{request.firstName[0]}{request.lastName[0]}</Text>
      </View>
      
      <View style={{
        flex: .45,
        justifyContent: 'space-evenly',
        marginVertical: 10
      }}>
        <Text bold>{request.firstName} {request.lastName}{'\n'}</Text>
        <Text>{request.id}{'\n'}</Text>
        <Text isSuccessStatus>Pending</Text>
      </View>

      <View style={{
        alignItems: 'flex-end',
        flex: .4,
      }}>
        <Icon 
          color={COLOUR_GREY}
          name="chevron-right"
          size={32} />
      </View>
    </ClickableListItem>
  }
}

export default class ViewAllAgentsScene extends React.Component {
  state = {

  }

  get recentRequests() {
    return [
      {
        title: "12 Jul 2019",
        data: [
          {
            firstName: 'Name',
            lastName: 'surname',
            id: '09101029012',
            status: 'Pending'
          },
          {
            firstName: 'Name',
            lastName: 'surname',
            id: '09101029012',
            status: 'Pending'
          }
        ]
      },
      {
        title: "5 Jul 2019",
        data: [
          {
            firstName: 'Name',
            lastName: 'surname',
            id: '09101029012',
            status: 'Pending'
          },
          {
            firstName: 'Name',
            lastName: 'surname',
            id: '09101029012',
            status: 'Pending'
          }
        ]
      }
    ]
  }

  renderItem(item) {
    return <RequestRow 
      onPress={() => this.props.navigation.navigate('ViewAgentDetails')}
      request={item}
    />
  }

  renderSectionHeader(item) {
    return <View style={{
      backgroundColor: '#F3F3F4',
      paddingHorizontal: 12
    }}>
      <Text style={{lineHeight: 32, marginLeft: 10}}>
        {item}
      </Text>
    </View>
  }

  render() {
    return <View 
      onTouchEnd={() => this.props.isNavigatorVisible ? this.props.hideNavigator() : null}
      style={{
        backgroundColor: COLOUR_SCENE_BACKGROUND,
        flex: 1
      }}>
      
      <Header 
        containerStyle={{
          backgroundColor: COLOUR_BLUE
        }}
        navigationIconColor={COLOUR_WHITE}
        rightComponent={<Icon 
          color={COLOUR_WHITE}
          name="tune"
          onPress={() => this.props.navigation.navigate('FilterViewAllAgents')}
          size={24}
          type="material"
          underlayColor="transparent"
        />}
        hideNavigationMenu={this.props.hideNavigator}
        showNavigationMenu={this.props.showNavigator}
        statusBarProps={{
          backgroundColor: 'transparent',
          barStyle: CONTENT_LIGHT
        }}
        title="Monitoring & Support"
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: 'bold'
        }}
        withNavigator />
        
      <View style={{
        backgroundColor: COLOUR_OFF_WHITE, 
        justifyContent: 'space-between'
      }}>
        <FormInput
          innerContainerStyle={{
            backgroundColor: COLOUR_WHITE,
            borderColor: COLOUR_WHITE,
            height: 50,
            marginVertical: 5
          }}
          leftIcon='search'
          leftIconColor={COLOUR_BLUE}
          leftIconSize={32}
          onChangeText={(value) => this.setState({username: value})}
          outerContainerStyle={{
            alignSelf: 'center',
            height: 60,
            marginBottom: 15,
            width: '85%'
          }}
          placeholder='Enter Agent Number'
        />
        <SectionList
          keyExtractor={(item, index) => item + index}
          renderItem={({item, index, section}) => this.renderItem(item, index)}
          renderSectionHeader={({section: {title}}) => this.renderSectionHeader(title)}
          sections={this.recentRequests}
        />
      </View>
    </View>
  }
}

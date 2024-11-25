import React from 'react'
import { 
  ScrollView,
  View 
} from 'react-native'
import {
  Icon
} from 'react-native-elements'
import ClickableListItem from '../../../../../../components/clickable-list-item'
import Header from '../../../../../../components/header'
import { 
  COLOUR_BLUE,
  COLOUR_GREY,
  COLOUR_RED,
  COLOUR_OFF_WHITE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  COLOUR_SCENE_BACKGROUND,
  COLOUR_LIGHT_GREY
} from '../../../../../../constants/styles'
import Modal from '../../../../../../components/modal'
import Text from '../../../../../../components/text';
import Button from '../../../../../../components/button';

class RequestRow extends React.Component {
  render () {
    const { request } = this.props

    return <ClickableListItem onPressOut={() => this.props.navigation.navigate('RequestConfirmation')} style={{
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

export default class ViewAgentDetailsScene extends React.Component {
  state = {
    isModalVisible: false
  }

  get modalContent() {
    return <Text bigger>
      Complete Setup Upload successfully.
    </Text>
  }

  get recentRequests() {
    return [
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

  renderItem(item) {
    return <RequestRow 
      request={item}
    />
  }

  render() {
    return <View style={{
        backgroundColor: COLOUR_SCENE_BACKGROUND,
        flex: 1
      }}>

      <Modal
        button={{
          onPress: () => {},
          buttonStyle: {
            paddingHorizontal: 10
          },
          containerStyle: {
            paddingHorizontal: 10,
            width: '75%'
          },
          title: 'Ok'
        }}
        content={this.modalContent}
        isModalVisible={this.state.isModalVisible}
        title="Agent Details"
        withButton
      />
      
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
        title="Agent Details"
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: 'bold'
        }} />
        
      <ScrollView style={{
        backgroundColor: COLOUR_OFF_WHITE, 
        flex: 1
      }}>
        
        <View style={{
          alignItems: 'center',
          height: 220,
          justifyContent: 'space-evenly'
        }}>
          <View style={{
            alignItems: 'center',
            backgroundColor: COLOUR_RED,
            borderRadius: 37.5,
            height: 75,
            justifyContent: 'center',
            width: 75
          }}>
            <Text big white>NS</Text>
          </View>

          <Text big black>Fola Mayowa</Text>  
          <Text>Location: Lagos, Nigeria</Text>
          <Text isSuccessStatus>Success</Text>
        </View>

        <View style={{
          backgroundColor: COLOUR_WHITE,
          flex: .65,
          justifyContent: 'space-evenly',
          padding: 20
        }}>

          <View style={{
            borderBottomColor: COLOUR_LIGHT_GREY,
            borderBottomWidth: .6,
            marginBottom: 10,
            paddingBottom: 10
          }}>
            <Text big black>Agent Details</Text>
          </View>
            
          <View style={{flexDirection: 'row', justifyContent: 'space-between', margin: 10}}>
            <Text>Class of Service:</Text>
            <Text black>Standard</Text>
          </View>
            
          <View style={{flexDirection: 'row', justifyContent: 'space-between', margin: 10}}>
            <Text>Phone:</Text>
            <Text black>2347081920991</Text>
          </View>
          
          <View style={{flexDirection: 'row', justifyContent: 'space-between', margin: 10}}>
            <Text>Location:</Text>
            <Text black>Ikeja, Lagos</Text>
          </View>
          
          <View style={{flexDirection: 'row', justifyContent: 'space-between', margin: 10}}>
            <Text>Identification Means:</Text>
            <Text black>International Passport</Text>
          </View>
          
          <View style={{flexDirection: 'row', justifyContent: 'space-between', margin: 10}}>
            <Text>Role:</Text>
            <Text black>Supervisor</Text>
          </View>
        </View>

        <View style={{
          backgroundColor: COLOUR_WHITE,
          padding: 20
        }}>
          <Button
            onPress={() => this.props.navigation.navigate('QuestionnaireObjectives')}
            title="Questionnaires"
          />
        </View>
      </ScrollView>
    </View>
  }
}

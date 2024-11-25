import React from 'react'
import { ScrollView, View } from 'react-native'
import { Icon, Image } from 'react-native-elements'
import ClickableListItem from '../../../../../../../components/clickable-list-item'
import FormInput from '../../../../../../../components/form-controls/form-input'
import Header from '../../../../../../../components/header'
import Text from '../../../../../../../components/text'
import { 
  COLOUR_BLUE, 
  COLOUR_RED, 
  COLOUR_WHITE, 
  CONTENT_LIGHT, 
  COLOUR_GREY
} from '../../../../../../../constants/styles';
import Button from '../../../../../../../components/button';
import { AGENT } from '../../../../../../../constants';
import { loadData } from '../../../../../../../utils/storage';
import AgentSerializer from '../../../../../../../serializers/resources/agent';
import FormPhone from '../../../../../../../components/form-controls/form-phone';
import { DISABLE_PROFILE_FIELDS } from '../../../../../../../constants/api-resources'

export default class UpdateContactInformationScene extends React.Component {
  state = {
    expand: null,
    form: {
      
    }
  }

  componentDidMount() {
    try {
      this.loadData();
    } catch {
      
    }
  }

  async loadData() {
    const agentInformation = JSON.parse(await loadData(AGENT));

    console.log('AGENT INFORMATION', agentInformation);

    const serializedAgentInformation = new AgentSerializer(agentInformation);

    this.setState({
      form: {
        ...this.state.form,
        ...serializedAgentInformation,
      },
    });
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
    return (
      <View 
        style={{
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
          title="Contact Information"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold'
          }} />
        
        <ScrollView contentContainerStyle={{
          padding: 20
        }}>
          <FormInput 
            defaultValue={this.state.form.firstName}
            disabled={DISABLE_PROFILE_FIELDS}
            outerContainerStyle={{
              marginTop: 20
            }}
            text="First Name:"
            validators={{
              required: true
            }} />
          <FormInput 
            defaultValue={this.state.form.middleName}
            disabled={DISABLE_PROFILE_FIELDS}
            outerContainerStyle={{
              marginTop: 20
            }}
            text="Middle Name:"
            validators={{
              required: true
            }} />
          <FormInput
            defaultValue={this.state.form.surname}
            disabled={DISABLE_PROFILE_FIELDS}
            outerContainerStyle={{
              marginTop: 20
            }}
            text="Surname:"
            validators={{
              required: true
            }} />
          <FormPhone
            defaultValue={this.state.form.phoneNumber}
            disabled={DISABLE_PROFILE_FIELDS}
            outerContainerStyle={{
              marginTop: 20
            }}
            text="Phone Number:"
            validators={{
              required: true
            }}
          />
          <FormInput
            defaultValue={this.state.form.emailAddress}
            disabled={DISABLE_PROFILE_FIELDS}
            outerContainerStyle={{
              marginTop: 20
            }}
            text="Email Address:"
            validators={{
              required: true
            }}
          />
        </ScrollView>

        {/* <View style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          padding: 20
        }}>
          <Button 
            transparent
            buttonStyle={{ paddingHorizontal: 40 }} 
            onPressOut={() => this.props.navigation.goBack()}
            title="Cancel"
            titleStyle={{ color: COLOUR_GREY }}
          />
          <Button 
            buttonStyle={{ paddingHorizontal: 40 }} 
            title="Save" 
          />
        </View> */}

      </View>
    );
  }
}
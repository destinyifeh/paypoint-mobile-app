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

export default class UpdateTransactionPinScene extends React.Component {
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
        title="Update Transaction PIN"
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: 'bold'
        }} />
      
      <ScrollView contentContainerStyle={{
        padding: 20
      }}>
        <FormInput 
          innerContainerStyle={{
            backgroundColor: COLOUR_WHITE
          }}
          outerContainerStyle={{
            marginTop: 10
          }}
          text="Current PIN:" />
        <FormInput 
          innerContainerStyle={{
            backgroundColor: COLOUR_WHITE
          }}
          outerContainerStyle={{
            marginTop: 10
          }}
          text="New PIN:" />
        <FormInput 
          innerContainerStyle={{
            backgroundColor: COLOUR_WHITE
          }}
          outerContainerStyle={{
            marginTop: 10
          }}
          text="Verify PIN:" />
      </ScrollView>

      <View style={{
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
      </View>

    </View>
  }
}
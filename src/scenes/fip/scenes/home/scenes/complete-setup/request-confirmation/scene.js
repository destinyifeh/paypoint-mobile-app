import React from 'react'
import { 
  FlatList,
  View 
} from 'react-native'
import Header from '../../../../../../../components/header'
import { 
  COLOUR_BLUE,
  COLOUR_OFF_WHITE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  COLOUR_SCENE_BACKGROUND
} from '../../../../../../../constants/styles'
import FormInput from '../../../../../../../components/form-controls/form-input'
import Text from '../../../../../../../components/text';

export default class RequestConfirmationScene extends React.Component {
  state = {

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
      
      <Header 
        navigationIconColor={COLOUR_WHITE}
        containerStyle={{
          backgroundColor: COLOUR_BLUE
        }}
        hideNavigationMenu={this.props.hideNavigator}
        showNavigationMenu={this.props.showNavigator}
        statusBarProps={{
          backgroundColor: 'transparent',
          barStyle: CONTENT_LIGHT
        }}
        title="Complete Setup"
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
            marginTop: 5
          }}
          leftIcon='search'
          leftIconColor={COLOUR_BLUE}
          leftIconSize={32}
          onChangeText={(value) => this.setState({username: value})}
          outerContainerStyle={{
            alignSelf: 'center',
            height: 60,
            marginBottom: 10,
            width: '85%'
          }}
          placeholder='Enter Agent Number'
        />
        <Text style={{margin: 10}}>Recent Requests</Text>
        <FlatList
          data={this.recentRequests}
          keyExtractor={(item, index) => item + index}
          renderItem={({item, index, section}) => this.renderItem(item, index)}
        />
      </View>
    </View>
  }
}

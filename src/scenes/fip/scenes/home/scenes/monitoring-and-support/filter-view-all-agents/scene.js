import React from 'react'
import { 
  Alert,
  Picker, 
  ScrollView, 
  View 
} from 'react-native'
import { 
  Icon
} from 'react-native-elements'
import Header from '../../../../../../../components/header'
import { 
  COLOUR_BLUE,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  COLOUR_BLACK,
  COLOUR_SCENE_BACKGROUND,
  COLOUR_GREY
} from '../../../../../../../constants/styles'
import Text from '../../../../../../../components/text';
import Button from '../../../../../../../components/button';
import FormPicker from '../../../../../../../components/form-controls/form-picker';


export default class FilterViewAllAgents extends React.Component {
  state = {

  }

  render () {
    return <View style={{
        backgroundColor: COLOUR_SCENE_BACKGROUND,
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
          name="close"
          size={32}
          type="material"
          onPress={() => this.props.navigation.goBack()}
        />}
        hideNavigationMenu={this.props.hideNavigator}
        showNavigationMenu={this.props.showNavigator}
        statusBarProps={{
          backgroundColor: 'transparent',
          barStyle: CONTENT_LIGHT
        }}
        title="Filters"
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: 'bold'
        }} />

      <ScrollView contentContainerStyle={{
        padding: 20
      }}>
        <Text style={{
          color: COLOUR_BLACK
        }}>Date:</Text>

        <FormPicker 
          choices={[
            {
              label: 'Java',
              value: 'java'
            },
            {
              label: 'JavaScript',
              value: 'javascript'
            }
          ]}
          onSelect={(item) => Alert.alert(item)}
        />

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
          title="Apply Filters" 
        />
      </View>
    </View>
  }
}

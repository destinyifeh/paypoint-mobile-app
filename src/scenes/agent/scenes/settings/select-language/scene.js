import React from 'react'
import { 
  FlatList, 
  View 
} from 'react-native'
import { Icon } from 'react-native-elements'
import Header from '../../../../../components/header'
import Text from '../../../../../components/text'
import { 
  COLOUR_BLUE,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  COLOUR_GREY,
  COLOUR_GREEN
} from '../../../../../constants/styles'
import ClickableListItem from '../../../../../components/clickable-list-item';
import Languages from '../../../../../fixtures/languages'

const ENGLISH = 'English'

export default class SelectLanguageScene extends React.Component {
  state = {
    language: ENGLISH
  }

  renderItem (item) {
    const isActive = this.state.language === item
    
    return <ClickableListItem 
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
      onPressOut={() => this.setState({language: item})}
    >
      <Text style={{color: isActive ? COLOUR_GREEN : COLOUR_GREY}}>{item}</Text>
      {isActive && <Icon 
        color={COLOUR_GREEN}
        name="check"
        size={32}
        type="feather" />}
    </ClickableListItem>
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
        title="Language"
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: 'bold'
        }} />
      
      <View style = {{ 
        backgroundColor: '#F3F3F4',
        flex: 1 
      }}>
        <FlatList 
          contentContainerStyle={{marginTop: 30}}
          data={Languages}
          renderItem={({item, index}) => this.renderItem(item)}
        />
      </View> 

    </View>
  }
}

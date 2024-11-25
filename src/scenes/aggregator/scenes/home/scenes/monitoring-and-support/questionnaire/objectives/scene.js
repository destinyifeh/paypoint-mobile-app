import React from 'react'
import {
  FlatList,
  StyleSheet,
  View
} from 'react-native'
import {
  Icon
} from 'react-native-elements'
import ClickableListItem from '../../../../../../../../components/clickable-list-item'
import Header from '../../../../../../../../components/header'
import Modal from '../../../../../../../../components/modal'
import Text from '../../../../../../../../components/text'
import { 
  COLOUR_BLUE,
  COLOUR_GREY,
  COLOUR_RED, 
  COLOUR_WHITE,
  CONTENT_LIGHT,
  COLOUR_LIGHT_GREY
} from '../../../../../../../../constants/styles';
import QuestionnaireObjectives from '../../../../../../../../fixtures/questionnaire_objectives'

export default class QuestionnaireObjectivesScene extends React.Component {
  state = {
    isModalVisible: false
  }

  renderItem(item, index) {
    return <ClickableListItem 
      key={index}
      onPress={() => this.setState({
        isModalVisible: true,
        pendingObjective: item
      })}
      style={{
        backgroundColor: 'white',
        borderBottomColor: COLOUR_LIGHT_GREY,
        borderBottomWidth: .6,
        flexDirection: 'row',
        marginBottom: 5,
        paddingVertical: 10
      }}
    >
      <View style={{flex: .2, justifyContent: 'space-evenly', paddingLeft: 20}}>
        <Icon
          color={COLOUR_BLUE}
          name='disc'
          size={20}
          type="feather" />
      </View>

      <View style={{flex: .6, justifyContent: 'space-evenly', paddingLeft: 5}}>
        <Text black>{item}</Text>
      </View>

      <View style={{
        alignItems: 'center',
        flex: .2,
        justifyContent: 'center'
      }}>
        <Icon 
          name='chevron-right'
          color={'#B4B7BF'}
          type="feather"
          size={30} />
      </View>
    </ClickableListItem>
  }

  startQuestionnaire() {
    this.props.navigation.navigate('QuestionnaireQuestions', {
      objective: this.state.pendingObjective
    })
  }

  render() {
    return <View>
      
      {this.state.isModalVisible && <Modal
        buttons={[{
            transparent: true,
            onPress: () => {
              this.setState({isModalVisible: false})
            },
            buttonStyle: {
              paddingHorizontal: 10
            },
            containerStyle: {
              paddingHorizontal: 10,
              width: 150
            },
            title: 'Cancel',
            titleStyle: {
              color: COLOUR_GREY
            }
          },  
          {
            onPress: () => {
              this.setState({isModalVisible: false})
              this.startQuestionnaire()
            },
            buttonStyle: {
              paddingHorizontal: 10
            },
            containerStyle: {
              paddingHorizontal: 10,
              width: 150
            },
            title: 'Ok'
          }
        ]}
        content={<View style={{flex: .9, justifyContent: 'center'}}><Text big center>Do you want to save your answers?</Text></View>}
        hideCloseButton={true}
        isModalVisible={true}
        size="sm"
        title="Save"
        withButtons
      />}

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
        title="Questionnaires"
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: 'bold'
        }} />

      <FlatList
        data={QuestionnaireObjectives}
        keyExtractor={(item, index) => item + index}
        renderItem={({item, index, section}) => this.renderItem(item, index)}
      />
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

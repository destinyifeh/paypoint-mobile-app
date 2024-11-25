import React from 'react'
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View 
} from 'react-native'
import Text from '../../../../../../../../../components/text';
import { 
  COLOUR_GREEN,
  COLOUR_LIGHT_GREY 
} from '../../../../../../../../../constants/styles';
import ClickableListItem from '../../../../../../../../../components/clickable-list-item';

const windowWidth = Dimensions.get('window').width

class Option extends React.Component {
  render() {
    return <ClickableListItem 
      onPress={this.props.onPress}
      style={{
        borderColor: this.props.isActive ? COLOUR_GREEN : COLOUR_LIGHT_GREY,
        borderRadius: 6,
        borderLeftWidth: this.props.isActive ? 5 : .6,
        borderWidth: .6,
        elevation: this.props.isActive ? 1 : 0,
        marginBottom: 10,
        padding: 15,
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      }}
    >
      <Text black>
        {this.props.data}
      </Text>
    </ClickableListItem>
  }
}

export default class QuestionSlide extends React.Component {
  state = {

  }

  onSelectOption(value) {
    this.setState({
      selected: value
    })

    this.props.onSelectAnswer(this.props.data.question, value)
  }

  render() {
    const { data } = this.props;

    return <ScrollView contentContainerStyle={styles.container}>
      <Text big bold black>
        {data.question}
      </Text>

      <View style={styles.optionsContainer}>
        {data.options.map((value, index) => <Option isActive={value === this.state.selected} data={value} onPress={() => this.onSelectOption(value)} key={index} />)}
      </View>
    </ScrollView>
  }
}

styles = StyleSheet.create({
  container: {
    padding: 30,
    paddingHorizontal: 20,
    width: windowWidth
  },
  optionsContainer: {
    marginTop: 30
  }
})

import React from 'react'
import { 
  Image,
  Modal as RnModal,
  StyleSheet,
  View
} from 'react-native'
import {
  Icon
} from 'react-native-elements'
import { COLOUR_BLUE, COLOUR_WHITE } from '../constants/styles'
import Button from './button'
import H1 from './h1'
import Text from './text'

export default class Modal extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      isModalVisible: props.isModalVisible
    }
    
    this.closeButton = this.closeButton.bind(this)
    this.hideModal = this.hideModal.bind(this)
  }

  hideModal() {
    this.setState({
      isModalVisible: false
    })
    this.props.onRequestClose && this.props.onRequestClose()
  }

  closeButton() {
    return <Icon 
      color='#8CA0B3'
      containerStyle={{
        alignItems: 'flex-end'
      }}
      name="x-circle"
      onPress={this.hideModal}
      size={32}
      type="feather"
    />
  }

  render() {
    const height = {
      'sm': 290,
      'md': 380,
      'lg': 550
    }[this.props.size];
    
    return <RnModal
      animationType="fade"
      onRequestClose={() => {
        this.props.onRequestClose && this.props.onRequestClose()
        this.setState({isModalVisible: !this.state.isModalVisible})
      }}
      transparent={true}
      visible={this.state.isModalVisible}>
      <View style={styles.outerContainer}>
        <View style={[styles.innerContainer, {height}]}>
          {this.props.hideCloseButton ? <View style={{padding: 16}} /> : this.closeButton()}
          
          <H1 style={styles.titleStyle} underline>{this.props.title}</H1>
          
          <View style={styles.contentStyle}>
            {this.props.image && <Image source={this.props.image} style={{
              height: 100,
              resizeMode: 'contain'
            }} />}
            {this.props.content}
            {this.props.withButton && <Button {...this.props.button} />}
            {this.props.withButtons && <View style={styles.buttonsContainerStyle}>
              {this.props.buttons.map((value, index) => <Button {...value} key={index} />)}
            </View>}
          </View>

        </View>
      </View>
    </RnModal>
  }
}

const styles = StyleSheet.create({
  buttonsContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  contentStyle: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 20
  },
  innerContainer: {
    backgroundColor: COLOUR_WHITE, 
    borderRadius: 10, 
    maxWidth: 420,
    padding: 10,
    width: '90%'
  },
  outerContainer: {
    alignItems: 'center',
    backgroundColor: `${COLOUR_BLUE}cb`,
    flex: 1,
    height: '100%',
    justifyContent: 'center'
  },
  titleStyle: {
    marginBottom: 20,
    textAlign: 'center'
  }
})

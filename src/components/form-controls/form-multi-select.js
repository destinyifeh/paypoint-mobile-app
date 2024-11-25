import React, { Component } from 'react';
import { Icon } from 'react-native-elements';
import Text from '../text';
import {
  FlatList,
  Modal,
  View
} from 'react-native';
import {
  COLOUR_GREY,
  COLOUR_LIGHT_GREY,
  COLOUR_LINK_BLUE,
  COLOUR_RED,
  COLOUR_WHITE,
  COLOUR_GREEN
} from '../../constants/styles';
import ClickableListItem from '../clickable-list-item';
import FormInput from './form-input';
import Button from '../button';


const DEFAULT_MIN_LENGTH = 1;

export default class FormMultiSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fieldIsValid: props.propagateError ? true : null,
      modalVisible: false,
      searchTerm: '',
      selected: [],
    };

    this.onDeselect = this.onDeselect.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  componentDidMount() {
    this.setState({
      selected: this.props.selected.map(value => value.id)
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.defaultValue !== this.props.defaultValue) {
      const itemValue = nextProps.defaultValue;
      const isValid = true;

      this.props.onSelect(itemValue, isValid);
      this.setState({
        errorMessage: isValid ? null : 'Field is required',
        fieldIsValid: isValid,
        value: itemValue
      });
    }

    const validators = this.props.validators || {};
    const minLength = validators.minLength || DEFAULT_MIN_LENGTH;

    if (nextProps.propagateError !== this.props.propagateError && validators.required) {
      this.state.selected.length < minLength && this.setState({
        errorMessage: `Select at least ${minLength}.`,
        fieldIsValid: false
      })

      return true;
    }

    return true;
  }

  get contentSummary() {
    const { selected } = this.state;
    const limit = 3;
    const contentToDisplay = selected.slice(0, limit);

    let str = '';
    contentToDisplay.map(value => {
      choice = this.props.choices.find(item => item.value === value)
      str += ` ${choice ? choice.label.replace(/_/g, ' ') : ''},`
    })

    const contentToDisplayStr = str.slice(0, str.length - 1);
    const sizeDiff = selected.length - contentToDisplay.length;

    return sizeDiff ? `${contentToDisplayStr} +${sizeDiff} more` : `${contentToDisplayStr}`
  }

  onSelect(item) {
    const newSelected = [
      ...this.state.selected,
      item
    ];

    this.setState({
      selected: newSelected,
    });

    const minLength = this.props.validators ? this.props.validators.length || 0 : 0;
    const isValid = newSelected.length > minLength;

    this.setState({
      errorMessage: isValid ? null : `Select at least ${minLength}`,
      fieldIsValid: isValid,
    });

    this.props.onSelect && this.props.onSelect(item, isValid);
  }

  onDeselect(item) {
    let { selected } = this.state;
    const newSelected = selected.filter(value => value !== item);

    this.setState({
      selected: newSelected,
    });

    const minLength = this.props.validators ? this.props.validators.length || DEFAULT_MIN_LENGTH : DEFAULT_MIN_LENGTH;
    const isValid = newSelected.length > minLength;

    this.setState({
      errorMessage: isValid ? null : `Select at least ${minLength}`,
      fieldIsValid: isValid,
    });

    this.props.onDeselect && this.props.onDeselect(item);
  }

  renderChoice(item) {
    const { label, value } = item
    const choiceIsSelected = this.state.selected.includes(value);

    return <ClickableListItem 
      onPressOut={() => {
        this.state.selected.includes(value) ? this.onDeselect(value) : this.onSelect(value)
      }}
    >
      <View style={{
        alignItems: 'center',
        flexDirection: 'row',
        height: 35,
        justifyContent: 'space-between',
        margin: 10,
      }}>
        <Text
          green={choiceIsSelected}
          style={{
            marginLeft: 10
          }}
          title>{label.replace(/_/g, ' ')}</Text>
        {choiceIsSelected && <Icon
          color={COLOUR_GREEN}
          name="check"
          size={32}
          type="feather" />}
      </View>
    </ClickableListItem>
  }

  render() {
    return <View style={{
      ...this.props.outerContainerStyle
    }}>

      <Modal
        animationType="fade"
        onRequestClose={() => {
          this.setState({
            modalVisible: false,
          })
        }}
        presentationStyle={{
          height: 100,
        }}
        transparent={false}
        visible={this.state.modalVisible}>

        <View style={{
          backgroundColor: 'transparent',
          flex: 1,
          marginTop: 22,
          paddingHorizontal: 20
        }}>
          <Button 
            onPressOut={() => {
              this.setState({
                modalVisible: false
              })
            }}
            title="Close"
            titleStyle={{
              color: COLOUR_GREY
            }}
            transparent
          />
          <FormInput
            hideOptionalLabel
            outerContainerStyle={{
              marginBottom: 10
            }}
            onChangeText={
              (searchTerm) => searchTerm && this.setState({
                searchResults: this.props.choices.filter(
                  value => {
                    let searchTerm_ = searchTerm.toLowerCase();
                    let valueLabel = value.label.toLowerCase();

                    return valueLabel.includes(searchTerm_);
                  }
                ),
                searchTerm
              })
            }
            placeholder="Search"
          />
          <FlatList
            contentContainerStyle={{
              backgroundColor: COLOUR_WHITE,
            }}
            data={this.state.searchTerm.length > 0 ? this.state.searchResults : this.props.choices}
            renderItem={data => this.renderChoice(data.item)}
          />
        </View>
      </Modal>

      <Text style={{ color: this.state.fieldIsValid === false ? COLOUR_RED : COLOUR_GREY }}>{this.props.text}</Text>

      <View style={{
        alignItems: 'center',
        backgroundColor: this.props.disabled ? COLOUR_LIGHT_GREY : COLOUR_WHITE,
        borderColor: this.state.focused ? COLOUR_LINK_BLUE : COLOUR_LIGHT_GREY,
        borderWidth: this.state.focused ? 3 : 2,
        borderRadius: 25,
        flexDirection: 'row',
        height: 45,
        justifyContent: 'flex-start',
        padding: 0,
        ...this.props.innerContainerStyle
      }}>
        {this.props.leftIcon && <View style={{
          padding: 10,
          width: '15%'
        }}>
          <Icon
            name={this.props.leftIcon}
            size={this.props.leftIconSize || 28}
            type='material'
            color={this.props.leftIconColor || COLOUR_LIGHT_GREY} />
        </View>}

        <ClickableListItem
          onPress={() => this.setState({
            modalVisible: true
          })} style={{
            paddingHorizontal: 15,
            width: '100%'
          }}>
          <Text>{this.contentSummary}</Text>
        </ClickableListItem>

        {this.props.rightIcon && <View
          style={{
            alignItems: 'flex-end',
            width: '15%'
          }}>
          <Icon
            color={COLOUR_LIGHT_GREY}
            name={this.state.hideText ? 'visibility' : 'visibility-off'}
            size={28}
            style={{
              padding: 10
            }} onPress={() => this.setState({ hideText: !this.state.hideText })} />
        </View>}

        {this.props.secureTextEntry && !this.props.rightIcon && <View
          style={{
            alignItems: 'flex-end',
            padding: 10,
            width: '15%'
          }}>
          <Icon
            color={COLOUR_LIGHT_GREY}
            name={this.state.hideText ? 'visibility' : 'visibility-off'}
            size={28}
            onPress={() => this.setState({ hideText: !this.state.hideText })} />
        </View>}
      </View>

      <Text small red style={{
        position: 'absolute',
        textAlign: 'right',
        top: 70,
        width: '100%',
      }}>{this.state.errorMessage}</Text>
    </View>
  }
}

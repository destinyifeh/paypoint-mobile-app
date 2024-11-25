import React, {useState} from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';

import {Icon} from 'react-native-elements';
import RBSheet from 'react-native-raw-bottom-sheet';

import Text from '../../components/text';
import {MAX_SELECT_BOX_RECORDS} from '../../constants';
import {
  COLOUR_BLACK,
  COLOUR_FORM_CONTROL_BACKGROUND,
  COLOUR_LIGHT_GREY,
  COLOUR_RED,
  FONT_FAMILY_BODY_SEMIBOLD,
  FONT_SIZE_TITLE,
} from '../../constants/styles';
import ClickableListItem from '../clickable-list-item';
import FormInput from './form-input';

const deviceHeight = Dimensions.get('window').height;

function Menu({choices, lists, disabledOptions, onSelect, ref_}) {
  const [choicesInScope, setChoicesInScope] = useState(choices);
  const [value, setValue] = useState('');

  const options = Boolean(value) && value.length ? choicesInScope : choices;

  return (
    <RBSheet
      animationType="fade"
      closeOnDragDown={true}
      duration={250}
      height={0.8 * deviceHeight}
      openDuration={220}
      ref={ref_}>
      <View style={{flex: 1}}>
        <FormInput
          defaultValue={value}
          placeholder="Search..."
          onChangeText={value => {
            if (!value) {
              return;
            }

            setValue(value);
            setChoicesInScope(
              lists
                .filter(({label}) =>
                  label.toLowerCase().includes(value.toLowerCase()),
                )
                .slice(0, MAX_SELECT_BOX_RECORDS),
            );
          }}
          outerContainerStyle={{padding: 16}}
        />

        <ScrollView contentContainerStyle={{}}>
          {options.map(({label, value}, index) => (
            <ClickableListItem
              disabled={disabledOptions?.includes(value)}
              key={index}
              onPress={() => onSelect(value, index + 1)}
              style={{
                flexDirection: 'row',
                opacity: disabledOptions?.includes(value) ? 0.25 : 1,
                padding: 16,
              }}>
              <Text black>{label}</Text>
            </ClickableListItem>
          ))}
        </ScrollView>
      </View>
    </RBSheet>
  );
}

export default class FormPicker extends React.Component {
  constructor(props) {
    super(props);

    const isDefaultValueCustom = Boolean(
      props.defaultValue &&
        !props.choices.map(value => value.value).includes(props.defaultValue),
    );

    this.state = {
      showOptions: false,
      // showTextInput: isDefaultValueCustom,
      value: null,
      fieldIsValid: props.progateError ? true : null,
    };
  }

  componentDidMount() {
    const {defaultValue} = this.props;

    if (defaultValue) {
      const itemValue = defaultValue;
      const isValid = true;

      this.props.onSelect(itemValue, isValid);
      this.setState({
        errorMessage: isValid ? null : 'Field is required',
        fieldIsValid: isValid,
        value: itemValue,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    try {
      if (prevProps.defaultValue !== this.props.defaultValue) {
        const isDefaultValueCustom =
          this.props.defaultValue &&
          !this.props.choices
            .map(value => value.value)
            .includes(this.props.defaultValue) &&
          this.props.choices?.length;

        console.log(
          'COMPONENT DID UPDATE',
          {isDefaultValueCustom},
          this.props.choices.map(value => value.value),
        );

        this.setState({
          showTextInput:
            isDefaultValueCustom ||
            (this.props.defaultValue === this.props.showTextInputForOption &&
              this.props.defaultValue),
        });
      }
    } catch {}
  }

  shouldComponentUpdate(nextProps, nextState) {
    try {
      if (nextProps.defaultValue !== this.props.defaultValue) {
        const itemValue = nextProps.defaultValue;
        const isValid = true;

        this.props.onSelect(itemValue, isValid);
        this.setState({
          errorMessage: isValid ? null : 'Field is required',
          fieldIsValid: isValid,
          value: itemValue,
        });
      }

      const validators = this.props.validators || {};

      if (
        nextProps.propagateError !== this.props.propagateError &&
        validators.required
      ) {
        (this.state.value === null ||
          this.state.value === this.props.showTextInputForOption) &&
          this.setState({
            errorMessage: 'Field is required',
            fieldIsValid: false,
          });

        return true;
      }

      return true;
    } catch {
      return true;
    }
  }

  render() {
    const {
      choices,
      defaultValue,
      disabled,
      disabledOptions,
      hideSearch = false,
      showTextInputForOption,
      silenceErrors,
    } = this.props;
    const {focused, showOptions, showTextInput, value} = this.state;

    const isDefaultValueCustom =
      defaultValue && !choices.map(value => value.value).includes(defaultValue);
    const defaultValue_ = isDefaultValueCustom
      ? showTextInputForOption
      : defaultValue;
    const formInputDefaultValue = isDefaultValueCustom ? defaultValue : '';

    const placeholder = this.props.placeholder || 'Select an option';

    const value_ = value || defaultValue_;
    const labelForValue = choices.find(({value}) => value === value_)?.label;
    const selectedValue_ = showTextInput
      ? showTextInputForOption
      : labelForValue || placeholder;

    return (
      <View
        style={[
          this.props.outerContainerStyle,
          {
            marginBottom:
              (this.props.outerContainerStyle?.marginBottom || 0) + 8,
          },
        ]}>
        <Menu
          lists={choices}
          choices={choices.slice(0, MAX_SELECT_BOX_RECORDS)}
          disabledOptions={disabledOptions}
          onSelect={(itemValue, itemIndex) => {
            const showTextInput = itemValue === showTextInputForOption;
            let fieldIsValid = itemIndex !== 0;
            if (showTextInput) {
              fieldIsValid = false;
            }

            this.props.onSelect(itemValue, fieldIsValid);

            this.setState({
              errorMessage: fieldIsValid ? null : 'Field is required',
              fieldIsValid,
              showTextInput,
              value: itemValue,
            });
            this.menu.close();
          }}
          ref_={menu => (this.menu = menu)}
        />

        <Animated.Text
          style={{
            color: COLOUR_BLACK,
            fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
            fontSize: FONT_SIZE_TITLE,
          }}>
          {this.props.text}
        </Animated.Text>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: this.props.disabled
              ? COLOUR_LIGHT_GREY
              : COLOUR_FORM_CONTROL_BACKGROUND,
            borderRadius: 8,
            borderWidth: 1.5,
            borderColor: this.state.errorMessage
              ? COLOUR_RED
              : COLOUR_FORM_CONTROL_BACKGROUND,
            flexDirection: 'row',
            height: 50,
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            marginTop: 5,
            ...this.props.innerContainerStyle,
          }}>
          <Icon
            name="chevron-down"
            type="feather"
            containerStyle={{
              position: 'absolute',
              right: 15,
            }}
          />

          <TouchableOpacity
            onPress={() => !disabled && this.menu.open()}
            style={{width: showTextInput ? '30%' : '100%'}}>
            <View
              style={{
                justifyContent: 'center',
                height: '100%',
                //padding: 20,
                width: '100%',
              }}>
              <Text black={!disabled} grey={disabled}>
                {selectedValue_}
              </Text>
            </View>
          </TouchableOpacity>

          {showTextInput && (
            <FormInput
              defaultValue={formInputDefaultValue}
              placeholder="Please specify"
              propagateError={this.props.propagateFormErrors}
              onChangeText={(value, fieldIsValid) => {
                if (value === '') {
                  value = showTextInputForOption;
                }

                this.props.onSelect(value, fieldIsValid);

                this.setState({
                  errorMessage: fieldIsValid
                    ? null
                    : 'Field must have at least three (3) characters.',
                  fieldIsValid,
                  value,
                });
              }}
              outerContainerStyle={{
                marginBottom: -8,
                width: '75%',
              }}
              silenceErrors={true}
              validators={{
                minLength: 3,
                regex: 'alphabet',
                required: true,
              }}
            />
          )}
        </View>

        {!silenceErrors && !focused && this.state.errorMessage && (
          <View
            style={{
              flexDirection: 'row',
              position: 'absolute',
              top: 78,
            }}>
            <Icon
              color={COLOUR_RED}
              containerStyle={{
                marginRight: 4,
              }}
              name="error"
              size={18}
              type="material"
            />
            <Text mid red>
              {this.state.errorMessage}
            </Text>
          </View>
        )}
      </View>
    );
  }
}

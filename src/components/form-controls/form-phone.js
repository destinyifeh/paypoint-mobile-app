import React, {Component} from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Keyboard,
  Modal,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from 'react-native-elements';

import CountryFlag from 'react-native-country-flag';

import {FlatList} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {NIGERIA_SHORT_CODE} from '../../constants';
import {
  COLOUR_BLACK,
  COLOUR_BLUE,
  COLOUR_FORM_CONTROL_BACKGROUND,
  COLOUR_GREEN,
  COLOUR_GREY,
  COLOUR_LIGHT_GREY,
  COLOUR_LINK_BLUE,
  COLOUR_RED,
  COLOUR_WHITE,
  FONT_FAMILY_BODY,
  FONT_FAMILY_BODY_SEMIBOLD,
  FONT_SIZE_TEXT_INPUT,
  FONT_SIZE_TITLE,
} from '../../constants/styles';
import SupportedCountries from '../../fixtures/supported_countries';
import {validateFieldLength} from '../../validators/form-validators';
import ClickableListItem from '../clickable-list-item';
import Text from '../text';
import {FormInput} from './form-input';

class FlagDropdown extends Component {
  constructor() {
    super();

    this.state = {
      countryShortCode: 'NG',
      modalVisible: false,
    };

    this.onSelect = this.onSelect.bind(this);
  }

  onSelect(item) {
    this.setState({
      countryShortCode: item.countryShortCode,
      modalVisible: false,
    });
    this.props.onSelect(item);
  }

  renderCountryFlagListItem(item) {
    const {countryName, countryShortCode} = item;

    return (
      <ClickableListItem onPress={() => this.onSelect(item)}>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            margin: 10,
            marginLeft: 30,
          }}>
          <CountryFlag isoCode={countryShortCode?.toLowerCase()} size={14} />

          <Text style={{marginLeft: 10}}>{countryName}</Text>
        </View>
      </ClickableListItem>
    );
  }

  render() {
    return (
      <View style={{marginLeft: 15}}>
        <TouchableOpacity
          onPress={() => {
            this.setState({
              modalVisible: true,
            });
          }}>
          <CountryFlag
            isoCode={this.state.countryShortCode?.toLowerCase()}
            size={14}
          />
        </TouchableOpacity>
        <Modal
          animationType="fade"
          presentationStyle="fullScreen"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({
              modalVisible: false,
            });
          }}>
          <View
            style={{
              backgroundColor: 'transparent',
              marginTop: 22,
              height: 200,
            }}>
            <FlatList
              contentContainerStyle={{
                backgroundColor: COLOUR_WHITE,
                height: 200,
              }}
              data={SupportedCountries}
              renderItem={data => this.renderCountryFlagListItem(data.item)}
            />
          </View>
        </Modal>
      </View>
    );
  }
}

class FormPhone extends FormInput {
  constructor(props) {
    super(props);

    const {validators} = props;

    this.state = {
      countryShortCode: NIGERIA_SHORT_CODE,
      errorMessage: null,
      fieldIsValid: props.progateError ? true : null,
      focused: false,
      hideText: props.secureTextEntry,
      placeholder: 'xxxxxxxxxxx',
      value: null,
      validators,
    };

    this.borderColor = new Animated.Value(0);
    this.labelColor = new Animated.Value(0);
    this.checkInputValidity = this.checkInputValidity.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onSubmitEditing = this.onSubmitEditing.bind(this);
    this._keyboardDidHide = this._keyboardDidHide.bind(this);
  }

  componentDidMount() {
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }

  componentWillUnmount() {
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidHide() {
    if (this.state.focused) {
      this.textInput && this.textInput.blur();
    }
  }

  async checkInputValidity(value = this.state.value) {
    const validators = this.state.validators || {};

    let errorMessage = null;
    let fieldIsValid = true;

    if (
      validators.required == undefined &&
      ((value !== null && value.length === 0) || value === null)
    ) {
    } else {
      if (validators.minLength && value !== null) {
        fieldIsValid = validateFieldLength(value, validators.minLength);
        if (!fieldIsValid) {
          errorMessage = `Field must be at least ${validators.minLength} characters`;
        }
      }

      if (fieldIsValid && validators.equalTo && value !== null) {
        fieldIsValid = value === validators.equalTo;
        console.log(value, validators.equalTo);
        if (!fieldIsValid) {
          errorMessage = `Fields don't match`;
        }
      }

      if (fieldIsValid && validators.length && value !== null) {
        fieldIsValid = validateFieldLength(
          value,
          null,
          null,
          validators.length,
        );
        if (!fieldIsValid) {
          errorMessage = Array.isArray(validators.length)
            ? 'Field is invalid'
            : `Field must be ${validators.length} characters`;
        }
      }

      if (fieldIsValid && validators.required) {
        fieldIsValid = value !== null;
        if (!fieldIsValid) {
          errorMessage = 'Field is required';
        }
      }

      if (fieldIsValid && validators.rawRegex) {
        const regexExp = new RegExp(validators.rawRegex);
        if (!value.match(regexExp)) {
          fieldIsValid = false;
          errorMessage = 'Field is invalid';
        }
      }

      if (fieldIsValid && validators.asyncFunction_) {
        this.setState({
          isLoading: true,
        });

        const {errorToDisplay, func, onFailTest, onPassTest, test} =
          validators.asyncFunction_;

        const testResult = test(await func());

        this.setState({
          isLoading: false,
        });

        console.log({testResult});

        if (!testResult) {
          onFailTest && onFailTest();
          fieldIsValid = false;
          errorMessage = errorToDisplay || 'Field is invalid';
        } else {
          onPassTest && onPassTest();
        }
      }
    }

    this.setState({
      errorMessage,
      fieldIsValid,
    });

    return {
      errorMessage,
      fieldIsValid,
    };
  }

  onSelectCountry(countryShortCode) {
    const {validators} = this.state;

    const country = SupportedCountries.find(
      value => value.countryShortCode == countryShortCode,
    );

    const placeholder = country['phoneNumberPlaceholder'];
    validators.length = country['phoneNumberLength'];
    validators.rawRegex = country['phoneNumberRegex'];

    this.setState({
      countryShortCode,
      placeholder,
      validators,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.defaultValue !== this.props.defaultValue) {
      this.onChangeText(nextProps.defaultValue);

      this.checkInputValidity(nextProps.defaultValue).then(
        ({fieldIsValid}) => {
          this.props.onChangeText &&
            this.props.onChangeText(nextProps.defaultValue, fieldIsValid);
        },
        error => {},
      );
    }

    const validators = this.state.validators || {};

    if (nextProps.propagateError !== this.props.propagateError) {
      this.checkInputValidity();
      // this.state.value === null && this.setState({
      //   errorMessage: 'Field is required',
      //   fieldIsValid: false,
      // });

      return true;
    }

    if (nextProps.validators !== this.props.validators) {
      this.setState(
        {
          validators: nextProps.validators,
        },
        () => {
          if (this.props.propagateError || nextProps.propagateError) {
            this.checkInputValidity();
          }
        },
      );

      return true;
    }

    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.fieldIsValid) {
      Animated.timing(this.labelColor, {
        toValue: 0,
        easing: Easing.ease,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else if (this.state.fieldIsValid === false) {
      Animated.timing(this.labelColor, {
        toValue: 1,
        easing: Easing.ease,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }

  onBlur() {
    this.props.onBlur && this.props.onBlur();

    this.setState({
      focused: false,
    });

    Animated.timing(this.borderColor, {
      toValue: 0,
      easing: Easing.ease,
      duration: 300,
      useNativeDriver: true,
    }).start();

    this.checkInputValidity().then(
      ({fieldIsValid}) => {
        this.props.onChangeText &&
          this.props.onChangeText(this.state.value, fieldIsValid);
      },
      error => {},
    );
  }

  onChangeText(value) {
    this.setState({
      value,
    });
    this.props.onChangeText && this.props.onChangeText(value, null);
  }

  onFocus() {
    this.setState({
      errorMessage: null,
      fieldIsValid: null,
      focused: true,
    });

    Animated.timing(this.borderColor, {
      toValue: 1,
      easing: Easing.ease,
      duration: 300,
      useNativeDriver: true,
    }).start();

    this.props.onFocus && this.props.onFocus();
  }

  onSubmitEditing() {
    const {on_submit_editing_delay_milliseconds} = this.props;

    setTimeout(() => {
      this.props.onSubmitEditing && this.props.onSubmitEditing();
    }, on_submit_editing_delay_milliseconds);
  }

  render() {
    const {hint, silenceErrors, validators} = this.props;
    const {focused} = this.state;
    const borderColor = this.borderColor.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [
        COLOUR_FORM_CONTROL_BACKGROUND,
        COLOUR_LINK_BLUE,
        COLOUR_BLUE,
      ],
    });

    return this.props.hidden ? (
      <React.Fragment />
    ) : (
      <View
        style={[
          this.props.outerContainerStyle,
          {
            marginBottom:
              (this.props.outerContainerStyle?.marginBottom || 0) + 8,
          },
        ]}>
        {this.props.text && (
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'flex-start',
            }}>
            <Animated.Text
              style={{
                color: COLOUR_BLACK,
                fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                fontSize: FONT_SIZE_TITLE,
              }}>
              {this.props.text}{' '}
              {!validators.required && !this.props.hideOptionalLabel
                ? '(Optional)'
                : ''}
            </Animated.Text>
            {this.state.isLoading && <ActivityIndicator size="small" />}
            {!this.state.isLoading &&
              this.props.showValidIndicator &&
              this.state.fieldIsValid && (
                <Icon
                  color={COLOUR_GREEN}
                  name="check-circle"
                  size={18}
                  type="feather"
                />
              )}
          </View>
        )}

        <Animated.View
          style={{
            alignItems: 'center',
            // backgroundColor: this.props.disabled ? COLOUR_LIGHT_GREY : COLOUR_WHITE,
            backgroundColor: COLOUR_FORM_CONTROL_BACKGROUND,
            borderColor: this.state.errorMessage ? COLOUR_RED : borderColor,
            borderWidth: 1.5,
            borderRadius: this.props.multiline ? 4 : 8,
            flexDirection: 'row',
            height: 60,
            justifyContent: 'flex-start',
            padding: 0,
            ...this.props.innerContainerStyle,
          }}>
          <FlagDropdown
            onSelect={({countryShortCode}) =>
              this.onSelectCountry(countryShortCode)
            }
          />

          <TextInput
            autoCapitalize={this.props.autoCapitalize}
            autoCompleteType={this.props.autoCompleteType || 'tel'}
            autoFocus={this.props.focus}
            defaultValue={this.props.defaultValue}
            editable={!this.props.disabled}
            keyboardType={this.props.keyboardType || 'number-pad'}
            multiline={false}
            onBlur={this.onBlur}
            onChangeText={this.onChangeText}
            onFocus={this.onFocus}
            onSubmitEditing={this.onSubmitEditing}
            placeholder={this.state.placeholder}
            placeholderTextColor={COLOUR_GREY}
            ref={textInput => {
              this.textInput = textInput;
              this.props.textInputRef && this.props.textInputRef(textInput);
            }}
            returnKeyType="next"
            secureTextEntry={this.state.hideText}
            style={{
              fontFamily: FONT_FAMILY_BODY,
              fontSize: FONT_SIZE_TEXT_INPUT,
              padding: 0,
              paddingLeft: 15,
              width:
                this.props.rightIcon || this.props.secureTextEntry
                  ? '70%'
                  : '85%',
              ...this.props.inputStyle,
            }}
            textContentType={this.props.textContentType}
          />

          {this.props.rightIcon && (
            <View
              style={{
                alignItems: 'flex-end',
                width: '15%',
              }}>
              <Icon
                color={COLOUR_LIGHT_GREY}
                name={this.state.hideText ? 'visibility' : 'visibility-off'}
                size={28}
                style={{
                  padding: 10,
                }}
                onPress={() => this.setState({hideText: !this.state.hideText})}
              />
            </View>
          )}
        </Animated.View>

        {!silenceErrors && !focused && this.state.errorMessage ? (
          <View
            style={{
              flexDirection: 'row',
              position: 'absolute',
              top: 90,
              width: '100%',
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
        ) : (
          <View
            style={{
              flexDirection: 'row',
              position: 'absolute',
              top: 90,
            }}>
            <Text mid grey>
              {hint}
            </Text>
          </View>
        )}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    on_submit_editing_delay_milliseconds: parseInt(
      state.tunnel.remoteConfig.on_submit_editing_delay_milliseconds,
    ),
  };
}

export default connect(mapStateToProps, null)(FormPhone);

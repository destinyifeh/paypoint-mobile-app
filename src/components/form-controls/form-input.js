import React from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Keyboard,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {connect} from 'react-redux';

import {
  MAX_NIGERIA_PHONE_LENGTH,
  MIN_NIGERIA_PHONE_LENGTH,
} from '../../constants/fields';
import {
  COLOUR_BLACK,
  COLOUR_BLUE,
  COLOUR_FORM_CONTROL_BACKGROUND,
  COLOUR_GREEN,
  COLOUR_GREY,
  COLOUR_LINK_BLUE,
  COLOUR_MID_GREY,
  COLOUR_RED,
  FONT_FAMILY_BODY,
  FONT_FAMILY_BODY_SEMIBOLD,
  FONT_SIZE_TEXT_INPUT,
  FONT_SIZE_TITLE,
} from '../../constants/styles';
import {
  validateEmail,
  validateFieldLength,
  validateName,
  validatePassword,
} from '../../validators/form-validators';

export class FormInput extends React.Component {
  constructor(props) {
    super(props);

    const {validators} = props;

    this.state = {
      errorMessage: null,
      successMessage: null,
      fieldIsValid: props.progateError ? true : null,
      focused: false,
      hideText: props.secureTextEntry,
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
    let wasValidationDone = true;
    let successMessage = null;

    if (
      !Boolean(validators.required) &&
      ((value !== null && value.length === 0) || value === null)
    ) {
      wasValidationDone = false;
    } else {
      if (validators.minLength && value !== null) {
        fieldIsValid = validateFieldLength(value, validators.minLength);
        if (!fieldIsValid) {
          errorMessage = `Field must be at least ${validators.minLength} characters`;
        }
      }

      if (fieldIsValid && validators.equalTo && value !== null) {
        fieldIsValid = value === validators.equalTo;
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

      if (fieldIsValid && validators.email && value !== null) {
        fieldIsValid = validateEmail(value);
        if (!fieldIsValid) {
          errorMessage = 'Field is not a valid email';
        }
      }

      if (fieldIsValid && validators.number && value !== null) {
        fieldIsValid = !isNaN(value);
        if (!fieldIsValid) {
          errorMessage = 'Field is not a valid number';
        }
      }

      if (fieldIsValid && validators.positiveNumber && value !== null) {
        fieldIsValid = !(!isNaN(value) && parseFloat(value) < 0);
        if (!fieldIsValid) {
          errorMessage = 'Field must not be negative';
        }
      }

      if (fieldIsValid && validators.applicationSearchTerm && value !== null) {
        fieldIsValid =
          validateEmail(value) ||
          validateFieldLength(value, null, null, MAX_NIGERIA_PHONE_LENGTH) ||
          validateName(value);

        if (!fieldIsValid) {
          errorMessage = 'Field must be valid name, email or phone number';
        }
      }

      if (fieldIsValid && validators.username && value !== null) {
        fieldIsValid =
          validateEmail(value) ||
          validateFieldLength(value, null, null, [
            MIN_NIGERIA_PHONE_LENGTH,
            13,
          ]);

        if (!fieldIsValid) {
          errorMessage = 'Field must be valid email or phone number';
        }
      }

      if (fieldIsValid && validators.password && value !== null) {
        fieldIsValid = validatePassword(value);
        if (!fieldIsValid) {
          errorMessage = 'Field must have at least four (4) characters.';
        }
      }

      if (fieldIsValid && validators.required) {
        fieldIsValid = ![null, ''].includes(value);
        if (!fieldIsValid) {
          errorMessage = 'Field is required';
        }
      }

      if (fieldIsValid && validators.numberOfWords) {
        if (value.trim().split(' ').length !== validators.numberOfWords) {
          errorMessage = `Field must have ${validators.numberOfWords} words`;
        }

        if (validators.minLengthOfWord) {
          const shortWords = value
            .trim()
            .split(' ')
            .find(word => {
              return word.length < validators.minLengthOfWord;
            });
          if (shortWords !== undefined) {
            errorMessage =
              `Each word must have at least ` +
              `${validators.minLengthOfWord} characters`;
          }
        }
      }

      if (fieldIsValid && validators.rawRegex) {
        const regexExp = new RegExp(validators.rawRegex);
        if (!regexExp.test(value)) {
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

        if (typeof testResult === 'object' && testResult != null) {
          if (testResult.status) {
            onPassTest && onPassTest();
            successMessage = testResult.errorToDisplay;
          } else {
            onFailTest && onFailTest();
            fieldIsValid = false;
            errorMessage = testResult.errorToDisplay || 'Field is invalid';
          }
        } else if (!testResult) {
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
      wasValidationDone,
      successMessage,
    });

    return {
      errorMessage,
      fieldIsValid,
      wasValidationDone,
      successMessage,
    };
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
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if (this.state.fieldIsValid === false) {
      Animated.timing(this.labelColor, {
        toValue: 1,
        easing: Easing.ease,
        duration: 200,
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
      successMessage: null,
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
    const {hint, silenceErrors, multiline} = this.props;
    const {focused} = this.state;

    const validators = this.props.validators || {};
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
              (this.props.outerContainerStyle?.marginBottom || 0) + 12,
          },
        ]}>
        {this.props.text && (
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: this.props.rightTextExist
                ? 'space-between'
                : 'flex-start',
              marginBottom: 4,
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
              this.state.fieldIsValid &&
              this.state.wasValidationDone &&
              this.props.showValidIndicator && (
                <Icon
                  color={COLOUR_GREEN}
                  name="check-circle"
                  size={18}
                  type="feather"
                />
              )}
            {this.props.rightTextExist && (
              <Text
                style={{
                  color: COLOUR_BLACK,
                  fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                  fontSize: FONT_SIZE_TITLE,
                }}>
                {this.props.rightText && this.props.rightText}
              </Text>
            )}
          </View>
        )}

        <Animated.View
          style={{
            alignItems: multiline ? 'flex-start' : 'center',
            // backgroundColor: this.props.disabled ? COLOUR_LIGHT_GREY : COLOUR_WHITE,
            backgroundColor: COLOUR_FORM_CONTROL_BACKGROUND,
            borderColor: this.state.errorMessage ? COLOUR_RED : borderColor,
            borderWidth: 1.5,
            borderRadius: multiline ? 4 : 8,
            flexDirection: 'row',
            height: multiline ? 90 : 50,
            justifyContent: 'flex-start',
            padding: 0,
            ...this.props.innerContainerStyle,
          }}>
          {this.props.leftIcon && (
            <View
              style={{
                padding: 10,
                width: '15%',
              }}>
              <Icon
                name={this.props.leftIcon}
                size={this.props.leftIconSize || 28}
                type="material"
                color={this.props.leftIconColor || COLOUR_MID_GREY}
              />
            </View>
          )}

          <TextInput
            textAlignVertical={this.props.textAlignVertical}
            numberOfLines={this.props.numberOfLines}
            autoCapitalize={this.props.autoCapitalize}
            autoCompleteType={this.props.autoCompleteType}
            defaultValue={this.props.defaultValue}
            editable={!this.props.disabled}
            autoFocus={this.props.focus}
            keyboardType={this.props.keyboardType}
            maxLength={this.props.maxLength}
            multiline={multiline}
            onBlur={this.onBlur}
            onChangeText={this.onChangeText}
            onFocus={this.onFocus}
            onSubmitEditing={this.onSubmitEditing}
            placeholder={this.props.placeholder}
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
              height: multiline ? '100%' : undefined,
              padding: 0,
              paddingLeft: 15,
              paddingVertical: multiline ? 16 : undefined,
              width:
                this.props.rightIcon || this.props.secureTextEntry
                  ? '70%'
                  : this.props.textInputWidth
                  ? this.props.textInputWidth
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
                color={COLOUR_MID_GREY}
                name={this.state.hideText ? 'visibility' : 'visibility-off'}
                size={28}
                style={{
                  padding: 10,
                }}
                onPress={() => this.setState({hideText: !this.state.hideText})}
              />
            </View>
          )}

          {this.props.rightIconName && (
            <View
              style={{
                padding: 10,
                width: '15%',
              }}>
              <Icon
                name={this.props.rightIconName}
                size={this.props.rightIconSize || 28}
                type="material"
                color={
                  this.props.rightIconParams === '' ? COLOUR_MID_GREY : 'black'
                }
                onPress={this.props.rightIconOnpress}
                disabled={this.props.rightIconDisabled}
              />
            </View>
          )}

          {this.props.secureTextEntry && !this.props.rightIcon && (
            <View
              style={{
                alignItems: 'flex-end',
                padding: 10,
                width: '15%',
              }}>
              <Icon
                color={COLOUR_MID_GREY}
                name={this.state.hideText ? 'visibility' : 'visibility-off'}
                size={28}
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
              top: this.props.showMultiline ? 120 : 78,
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
              top: 78,
            }}>
            {this.state.successMessage && (
              <Text mid style={{color: '#32de84'}}>
                {this.state.successMessage}
              </Text>
            )}
            {!this.state.successMessage && (
              <Text mid grey>
                {hint}
              </Text>
            )}
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

export default connect(mapStateToProps, null)(FormInput);

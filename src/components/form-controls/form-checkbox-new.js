import React from "react";
import { View } from "react-native";
import { CheckBox, Icon, Input } from "react-native-elements";
import {
  COLOUR_BLACK, COLOUR_LIGHT_GREY, COLOUR_LINK_BLUE, COLOUR_RED, COLOUR_WHITE, FONT_SIZE_MID
} from "../../constants/styles";
import Text from "../text";

export default class FormCheckboxNew extends React.Component {
  state = {
    value: null,
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.defaultValue !== this.props.defaultValue) {
      const isValid = true;

      this.props.onSelect(nextProps.defaultValue, isValid);
      this.setState({
        errorMessage: null,
        fieldIsValid: isValid,
        value: nextProps.defaultValue,
      });
    }

    const validators = this.props.validators || {};

    if (
      nextProps.propagateError !== this.props.propagateError &&
      validators.required
    ) {
      this.state.value === null &&
        this.setState({
          errorMessage: "Field is required",
          fieldIsValid: false,
        });

      return true;
    }

    return true;
  }

  render() {
    const { silenceErrors, disabled } = this.props;
    const { focused } = this.state;
    const validators = this.props.validators || {};

    return (
      <View
        style={[
          this.props.outerContainerStyle,
          {
            marginBottom:
              (this.props.outerContainerStyle?.marginBottom || 0) + 8,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
            <CheckBox
              center
              // key={index}
              title={this.props.title}
              titleProps={{
                style: {
                  color:
                    // this.state.value?.toLowerCase() == this.props.value.toLowerCase()
                      // ? COLOUR_LINK_BLUE
                      COLOUR_BLACK,
                      // : COLOUR_BLACK,
                  marginLeft: 5,
                },
              }}
              iconLeft
              iconType="material"
              checkedIcon="lens"
              uncheckedIcon="panorama-fish-eye"
              checkedColor={COLOUR_LINK_BLUE}
              checked={this.props.value}
              // checked={this.state.value?.toLowerCase() == this.props.value.toLowerCase()}
              onPress={() => {
                if (disabled) {
                  return;
                }

                this.props.onPress(this.props.value, true);
                this.setState({
                  errorMessage: null,
                  fieldIsValid: true,
                  value: this.props.value,
                });
              }}
            />
          {/* ))} */}
          {this.props.withInput && (
            <Input
              autoCompleteType={this.props.autoCompleteType || null}
              editable={!disabled}
              keyboardType={this.props.keyboardType || "number-pad"}
              onChangeText={(value) =>
                this.props.onChangeText && this.props.onChangeText(value)
              }
              placeholder={this.props.placeholder}
              style={{
                backgroundColor: disabled ? COLOUR_LIGHT_GREY : COLOUR_WHITE,
                color: COLOUR_BLACK,
                fontSize: FONT_SIZE_MID,
              }}
            />
          )}
        </View>
        {!silenceErrors && !focused && this.state.errorMessage && (
          <View
            style={{
              flexDirection: "row",
              position: "absolute",
              top: 80,
            }}
          >
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

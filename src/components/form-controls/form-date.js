import React from "react";
import { View } from "react-native";
import DatePicker from "react-native-datepicker";
import { COLOUR_GREY, COLOUR_RED } from "../../constants/styles";
import Text from "../text";

export default class FormDate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.defaultValue,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.defaultValue !== this.props.defaultValue) {
      const date = nextProps.defaultValue;
      const isValid = true;

      this.props.onDateSelect(date, isValid);
      this.setState({
        errorMessage: null,
        fieldIsValid: isValid,
        value: date,
      });
    }

    const validators = this.props.validators || {};

    if (
      nextProps.propagateError !== this.props.propagateError &&
      validators.required
    ) {
      [null, undefined].includes(this.state.value) &&
        this.setState({
          errorMessage: "Field is required",
          fieldIsValid: false,
        });

      return true;
    }

    return true;
  }

  onBlur() {
    console.log("BLURRED FORM DATE");
  }

  render() {
    const { disabled } = this.props;

    return (
      <View
        style={{
          ...this.props.outerContainerStyle,
        }}
      >
        <Text
          style={{
            color: this.state.fieldIsValid === false ? COLOUR_RED : COLOUR_GREY,
            marginBottom: 4,
          }}
        >
          {this.props.text}
        </Text>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <DatePicker
            androidMode={this.props.androidMode || "default"}
            cancelBtnText="Cancel"
            confirmBtnText="Confirm"
            customStyles={{
              dateIcon: {
                position: "absolute",
                left: 0,
                top: 4,
                marginLeft: 0,
              },
              dateInput: {
                marginLeft: 36,
              },
              // ... You can check the source to find the other keys.
            }}
            date={this.state.value}
            format={this.props.format || "DD-MM-YYYY"}
            // format="YYYY-MM-DD"
            maxDate={this.props.maxDate}
            minDate={this.props.minDate}
            mode="date"
            onCloseModal={this.onBlur}
            onDateChange={(date) => {
              if (disabled) {
                return;
              }

              this.setState({
                errorMessage: null,
                fieldIsValid: true,
                value: date,
              });
              this.props.onDateSelect(date, true);
            }}
            placeholder={this.props.placeholder}
            style={{ width: this.props.width || 200 }}
          />
        </View>
        <Text
          small
          red
          style={{
            position: "absolute",
            textAlign: "right",
            top: 70,
            width: "100%",
          }}
        >
          {this.state.errorMessage}
        </Text>
      </View>
    );
  }
}

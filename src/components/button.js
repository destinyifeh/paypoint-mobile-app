import React from "react";
import { View } from "react-native";
import { Button as RneButton } from "react-native-elements";
import { COLOUR_RED, FONT_FAMILY_BODY_SEMIBOLD } from "../constants/styles";

export default class Button extends React.Component {
  transparentStyle = {
    backgroundColor: "transparent",
    color: COLOUR_RED,
  };

  render() {
    let preferredContainerStyle = {};
    let preferredStyle = {};
    const props = this.props;

    if (props.transparent) {
      preferredContainerStyle.backgroundColor = "transparent";
      preferredStyle = this.transparentStyle;
    }

    if (props.isDisabled) {
      preferredStyle.opacity = 0.2;
    }

    if (props.hidden) {
      return <View />;
    }

    return (
      <RneButton
        disabled={props.loading}
        {...props}
        buttonStyle={{
          backgroundColor: "transparent",
          padding: 12,
          ...props.buttonStyle,
          borderRadius: 8,
          marginVertical: 0,
          height: 54,
        }}
        containerStyle={{
          justifyContent: "center",
          backgroundColor: COLOUR_RED,
          borderRadius: 8,
          height: 54,
          opacity: props.loading ? 0.6 : 1,
          ...props.containerStyle,
          ...preferredContainerStyle,
          paddingVertical: 0,
        }}
        disabledStyle={{}}
        onPress={
          this.props.isDisabled
            ? null
            : this.props.onPress || this.props.onPressOut
        }
        onPressOut={undefined}
        titleStyle={{
          fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
          // fontWeight: 'bold',
          letterSpacing: 1.3,
          textTransform: "uppercase",
          ...props.titleStyle,
          paddingVertical: 0,
        }}
        loadingStyle={{ ...props.loadingStyle }}
        loadingProps={{ ...props.loadingProps }}
        type={props.type}
      />
    );
  }
}

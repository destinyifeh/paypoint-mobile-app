import React from "react";
import { View } from "react-native";

const FipProgressBar = (props) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
      }}
    >
      <View
        style={{
          height: 2,
          width: "100%",
          flex: 1,
          position: "relative",
          paddingLeft: 10,
          border: "none",
          margin: 10,
          marginTop: 30,
          borderColor: props.step >= 1 ? "#0275C8" : "#CCCCCC",
          borderWidth: 2,
        }}
      />
      <View
        style={{
          height: 2,
          width: "100%",
          flex: 1,
          position: "relative",
          paddingLeft: 10,
          border: "none",
          margin: 10,
          marginTop: 30,
          borderColor: props.step >= 2 ? "#0275D8" : "#CCCCCC",
          borderWidth: 2,
        }}
      />
      <View
        style={{
          height: 2,
          width: "100%",
          flex: 1,
          position: "relative",
          paddingLeft: 10,
          border: "none",
          margin: 10,
          marginTop: 30,
          borderColor: props.step >= 3 ? "#0275D8" : "#CCCCCC",
          borderWidth: 2,
        }}
      />
      <View
        style={{
          height: 2,
          width: "100%",
          flex: 1,
          position: "relative",
          paddingLeft: 10,
          border: "none",
          margin: 10,
          marginTop: 30,
          borderColor: props.step >= 4 ? "#0275D8" : "#CCCCCC",
          borderWidth: 2,
        }}
      />
      <View
        style={{
          height: 2,
          width: "100%",
          flex: 1,
          position: "relative",
          paddingLeft: 10,
          border: "none",
          margin: 10,
          marginTop: 30,
          borderColor: props.step >= 5 ? "#0275D8" : "#CCCCCC",
          borderWidth: 2,
        }}
      />
      <View
        style={{
          height: 2,
          width: "100%",
          flex: 1,
          position: "relative",
          paddingLeft: 10,
          border: "none",
          margin: 10,
          marginTop: 30,
          borderColor: props.step >= 6 ? "#0275D8" : "#CCCCCC",
          borderWidth: 2,
        }}
      />
      <View
        style={{
          height: 2,
          width: "100%",
          flex: 1,
          position: "relative",
          paddingLeft: 10,
          border: "none",
          margin: 10,
          marginTop: 30,
          borderColor: props.step >= 7 ? "#0275D8" : "#CCCCCC",
          borderWidth: 2,
        }}
      />

      {(props.size == null || props.size > 8) && (
        <View
          style={{
            height: 2,
            width: "100%",
            flex: 1,
            position: "relative",
            paddingLeft: 10,
            border: "none",
            margin: 10,
            marginTop: 30,
            borderColor: props.step >= 8 ? "#0275D8" : "#CCCCCC",
            borderWidth: 2,
          }}
        />
      )}
    </View>
  );
};

export default FipProgressBar;

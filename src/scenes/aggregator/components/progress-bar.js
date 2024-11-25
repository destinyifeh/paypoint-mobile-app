import React from "react";
import { View } from "react-native";

const ProgressBar = (props) => {
return <View
    style={{
      display: "flex",
      flexDirection: "row",
      flexWrap: "nowrap"
    }}>
        
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
          borderColor: props.step >= 1?"#0275C8":"#CCCCCC",
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
          borderColor: props.step >= 2?"#0275D8":"#CCCCCC",
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
          borderColor: props.step >= 3?"#0275D8":"#CCCCCC",
          borderWidth: 2,
        }}
      />
      {(props.size == null || props.size>3) && <View
        style={{
          height: 2,
          width: "100%",
          flex: 1,
          position: "relative",
          paddingLeft: 10,
          border: "none",
          margin: 10,
          marginTop: 30,
          borderColor: props.step >= 4?"#0275D8":"#CCCCCC",
          borderWidth: 2,
        }}
      />}
    </View>
};

export default ProgressBar;

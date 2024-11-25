import React from "react";
import { View } from "react-native";
import FormInput from "../../../../../../components/form-controls/form-input";

export default function BankSearch(props) {
  return (
    <View
      style={{
        paddingTop: 10,
        paddingBottom: 10,
        width: 325,
        alignSelf: "center",
      }}
    >
      <FormInput
        hideOptionalLabel
        outerContainerStyle={{
          marginBottom: 0,
          borderBottomColor: "red",
        }}
        innerContainerStyle={{
          elevation: 5,
          marginBottom: 0,
        }}
        // rightIconName="search"
        // rightIconParams={this.state.searchTerm}
        rightIconOnpress={() => {
          props.onSearch();
        }}
        inputStyle={{
          elevation: 50,
          //borderWidth: 1,
          borderColor: "yellow",
        }}
        onChangeText={(val) => props.onChangeText(val)}
        placeholder="Search Bank..."
        defaultValue={props.value}
        // onSubmitEditing={() => props.onSearch()}
      />
    </View>
  );
}

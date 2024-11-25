import React from 'react';
import { TextInput, View } from 'react-native';

const SearchInput = (props) => {
  const {
    containerStyle,
    placeholder,
    inputStyle,
    prependComponent,
    appendComponent,
    onChange,
    onFocus,
    autoFocus,
    secureTextEntry,
    keyboardType = 'default',
    autoCompleteType = 'off',
    autoCapitalize = 'none',
  } = props;
  
  return (
    <View style={{ ...containerStyle }}>
      {/* Text Input */}
      <View
        style={{
          flexDirection: 'row',
          height: 45,
          width: '100%',
          paddingHorizontal: 8, 
          borderRadius: 50 / 2,
          backgroundColor: 'red', 
          paddingVertical: 10,
        }}
      >
        {prependComponent}

        <TextInput
          style={{
            flex: 1,
            ...inputStyle,
            color: '#000', // Replace with your desired color
          }}
          placeholder='Search Agents'
          autoFocus={autoFocus}
          placeholderTextColor='#888' // Replace with your desired color
          onChangeText={(text) => onChange(text)}
          onFocus={() => onFocus()} // Assuming onFocus is a function
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCompleteType={autoCompleteType}
          autoCapitalize={autoCapitalize}
        />
        {appendComponent}
      </View>
    </View>
  );
};

export default SearchInput;

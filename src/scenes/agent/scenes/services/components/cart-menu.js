import React from 'react';
import { Dimensions, ScrollView, View } from 'react-native';

import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';

import amountField from '../../../../../fragments/amount-field';
import Button from '../../../../../components/button';
import Text from '../../../../../components/text';
import { COLOUR_RED } from '../../../../../constants/styles';
import { NGN } from '../../../../../constants/currencies';
import { convertNgkToNgn } from '../../../../../utils/converters/currencies';
import ActivityIndicator from '../../../../../components/activity-indicator';


const window_height = Dimensions.get('window').height;


export function CartMenuItem({amount, title, description, qty, ...props}) {
  return (
    <View 
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12
      }}
    >
      <View style={{width: '67%'}}>
        <Text semiBold big>{title}</Text>
        <Text small>{description}</Text>
      </View>

      <Text bold right>{amountField(NGN, JSON.stringify(convertNgkToNgn(amount)))}</Text>

      <Icon 
        containerStyle={{
          marginLeft: 4,
        }}
        name='cancel'
        onPress={() => props.onRemoveItem(title)}
        type='material'
      />
    </View>
  );
}


function CartMenuBottomSheet({cart, isLoading, onAddAnotherItem, onClose, onOpen, onRemoveItem, onSubmit, ref_, ...props}) {
  return (
    <RBSheet
      animationType="fade"
      closeOnPressBack={false}
      closeOnPressMask={false}
      closeOnDragDown={false}
      duration={250}
      height={window_height * .55}
      onOpen={onOpen}
      ref={ref_}
    >
      {isLoading ? <ActivityIndicator /> : <View style={{flex: 1, padding: 16}}>
        <Text bold style={{flex: .07, marginBottom: 12}}>Beneficiaries List</Text>
        <Button 
          loading={isLoading}
          containerStyle={{flex: .15, width: '100%'}}
          title={'+ ADD BENEFICIARY'}
          transparent
          titleStyle={{
            color: COLOUR_RED,
            textAlign: 'center',
          }}
          onPressOut={onAddAnotherItem}
        />

        <ScrollView
          style={{
            flex: .7,
          }}
        >
          {cart.map(item => <CartMenuItem {...item} onRemoveItem={onRemoveItem} />)}
        </ScrollView>

        <Button 
          loading={isLoading}
          containerStyle={{flex: .15, width: '100%'}}
          title={'CONTINUE'}
          onPressOut={() => onSubmit()}
        />
      </View>}
    </RBSheet>
  );
}


function mapStateToProps(state) {
  return {
    cart: state.transactions.cart,
  };
}

export default connect(mapStateToProps, null)(CartMenuBottomSheet);

import React from 'react';
import { View } from 'react-native';

import BankIcon from '../../../../../components/bank-icon';
import Text from '../../../../../components/text';
import { COLOUR_LIGHT_GREY } from '../../../../../constants/styles';
import { getBankForBankCode } from '../../../../../utils/helpers';


export default function AccountRow({
  emailAddress, firstName, isDraftStatus, isFailedStatus, 
  isPendingStatus, isSuccessStatus, lastName, bankCode, 
  phoneNumber, status, ...props
}) {
  const percentageCompletion = '62';

  const bank = getBankForBankCode(bankCode);

  return (
    <View style={{alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLOUR_LIGHT_GREY, flex: 1, flexDirection: 'row', height: 90, padding: 16, width: '100%'}}>
      <View style={{flexGrow: .1}}>
        <BankIcon bankCode={bankCode} style={{height: 32, width: 32}} />
        <Text numberOfLines={2} small style={{lineHeight: 14, width: 50}}>{bank.name}</Text>
      </View>
      <View style={{flexGrow: .7}}>
        <Text title>{firstName} {lastName}</Text>
        <Text mid numberOfLines={1}>
          <Text mid bold>Phone No:</Text> {phoneNumber}
        </Text>
        <Text mid numberOfLines={1}>
          <Text mid bold>Email:</Text> {emailAddress}
        </Text>
      </View>
      <View style={{alignSelf: 'flex-end', alignItems: 'flex-end', flexGrow: .2, height: '100%', justifyContent: 'center', right: 0}}>
        {isDraftStatus ? <Text bigger bold right>{percentageCompletion}%</Text> : null}
        <Text 
          isFailedStatus={isFailedStatus} 
          isPendingStatus={isPendingStatus}
          isStatus 
          isSuccessStatus={isSuccessStatus} 
          right 
          small
          uppercase
        >
          {status}
        </Text>
      </View>
    </View>
  );
}

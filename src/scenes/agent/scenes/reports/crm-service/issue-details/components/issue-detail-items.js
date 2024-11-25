import Clipboard from '@react-native-clipboard/clipboard';
import moment from 'moment';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {COPIED_TO_CLIPBOARD} from '../../../../../../../constants';
import {CASUAL} from '../../../../../../../constants/dialog-priorities';
import {
  COLOUR_BLACK,
  COLOUR_BLUE,
  COLOUR_GREY,
  COLOUR_LIGHT_GREY,
  COLOUR_OFF_WHITE,
  FONT_FAMILY_BODY,
  FONT_FAMILY_BODY_SEMIBOLD,
  FONT_SIZE_MID,
} from '../../../../../../../constants/styles';
import {flashMessage} from '../../../../../../../utils/dialog';

export default function IssueDetailItems({transaction}) {
  const copyContentToClipboard = value => {
    Clipboard.setString(value);

    flashMessage(null, COPIED_TO_CLIPBOARD, CASUAL);
  };

  const copyContentToClipboard2 = value => {
    Clipboard.setString(value);

    flashMessage(null, COPIED_TO_CLIPBOARD, CASUAL);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.itemContainer}>
        <Text style={styles.titleText}>Ticket ID</Text>
        <TouchableOpacity
          onPress={() => copyContentToClipboard2(transaction?.ticketNumber)}>
          <Text
            style={styles.ellipValueText}
            numberOfLines={1}
            ellipsizeMode="tail">
            {transaction?.ticketNumber}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.itemContainer}>
        <View>
          <Text style={styles.titleText}>Transaction</Text>
          <Text style={styles.titleText}>Date & Time</Text>
        </View>
        <Text style={styles.normalValueText}>
          {moment(transaction?.transactionDate).format('DD MMM, YYYY | h:mma')}
        </Text>
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.titleText}>Reference</Text>
        <View>
          <Text
            style={styles.ellipValueText}
            numberOfLines={1}
            ellipsizeMode="tail">
            {transaction?.transactionRef}
          </Text>
          <TouchableOpacity
            onPress={() => copyContentToClipboard(transaction?.transactionRef)}
            style={{flexDirection: 'row', alignSelf: 'flex-end', right: 5}}>
            <Icon color={'#0275D8'} name="copy" type="feather" size={20} />
            <Text style={{left: 5, color: '#0275D8'}}>Copy</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.itemContainer}>
        <Text style={styles.titleText}>Transaction Type</Text>
        <Text style={styles.ellipValueText}>
          {transaction?.transactionType}
        </Text>
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.titleText}>Transaction Amount</Text>
        <Text
          style={styles.ellipValueText}
          numberOfLines={1}
          ellipsizeMode="tail">
          {transaction?.amount && '₦'}
          {transaction?.amount}
        </Text>
      </View>
      <View style={styles.lastItemContainer}>
        <Text style={styles.titleText}>Status</Text>
        <View
          style={[
            styles.statusInnerContainer,
            {
              borderColor:
                transaction?.status === 'Active' ? '#A8D6EF' : '#E1E6ED',

              backgroundColor:
                transaction?.status === 'Active' ? '#EBF8FE' : COLOUR_OFF_WHITE,
            },
          ]}>
          <Icon
            color={transaction?.status === 'Active' ? COLOUR_BLUE : COLOUR_GREY}
            type="entypo"
            name="dot-single"
          />
          <Text
            style={[
              styles.statusValueText,
              {
                color:
                  transaction?.status === 'Active' ? COLOUR_BLUE : COLOUR_GREY,
              },
            ]}>
            {transaction?.status === 'Active' ? 'Active' : 'Resolved'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderColor: COLOUR_LIGHT_GREY,
  },

  itemContainer: {
    borderBottomWidth: 1,
    paddingVertical: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    borderColor: COLOUR_LIGHT_GREY,
  },
  lastItemContainer: {
    paddingVertical: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },

  titleText: {
    fontFamily: FONT_FAMILY_BODY,
    fontSize: FONT_SIZE_MID,
    color: COLOUR_BLACK,
  },
  statusInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 3,
    borderRadius: 8,
  },
  statusValueText: {
    fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
    fontSize: FONT_SIZE_MID,
    maxWidth: 100,
    paddingRight: 5,
  },
  ellipValueText: {
    fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
    fontSize: FONT_SIZE_MID,
    maxWidth: 140,
  },
  normalValueText: {
    fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
    fontSize: FONT_SIZE_MID,
  },
});

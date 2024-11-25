import Clipboard from '@react-native-clipboard/clipboard';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Icon} from 'react-native-elements';
import RBSheet from 'react-native-raw-bottom-sheet';
import ClickableListItem from '../components/clickable-list-item';
import Text from '../components/text';
import {COPIED_TO_CLIPBOARD} from '../constants';
import {CASUAL} from '../constants/dialog-priorities';
import {
  COLOUR_BLACK,
  COLOUR_BLUE,
  COLOUR_FORM_CONTROL_BACKGROUND,
  COLOUR_GREY,
  FONT_FAMILY_BODY,
  FONT_FAMILY_BODY_BOLD,
  FONT_SIZE_TEXT_INPUT,
} from '../constants/styles';
import {flashMessage} from '../utils/dialog';

const BankAccountBankDetailsPrompt = props => {
  const copyContentToClipboard = () => {
    Clipboard.setString(props.accountNo);

    flashMessage(null, COPIED_TO_CLIPBOARD, CASUAL);
  };

  return (
    <View>
      <RBSheet
        ref={props.paymentDetailsModalRef}
        animationType="fade"
        closeOnDragDown={true}
        duration={250}
        height={200}
        customStyles={{
          container: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          },
        }}>
        <View style={{flexDirection: 'column'}}>
          <View
            style={{
              paddingHorizontal: 20,
              paddingBottom: 5,
              paddingEnd: 20,
            }}>
            <Text
              style={{
                color: COLOUR_BLACK,
                fontSize: 15,
                fontFamily: FONT_FAMILY_BODY_BOLD,
              }}>
              Bank account Details
            </Text>
          </View>

          <View
            style={{
              height: 68,
              backgroundColor: '#F3F5F6',
              marginTop: 10,
              paddingHorizontal: 20,
              marginHorizontal: 20,
            }}>
            <View style={{marginTop: 10}}>
              <Text>Unity Bank</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                justifyContent: 'space-between',
              }}>
              <View>
                <Text>{props.accountNo}</Text>
              </View>
              <View
                style={{
                  marginLeft: 'auto',
                  paddingRight: -20,
                  paddingLeft: 20,
                }}>
                <ClickableListItem
                  onPress={copyContentToClipboard}
                  style={{
                    marginLeft: 'auto',
                  }}>
                  {props.accountNo !== '...' && (
                    <Icon
                      color={COLOUR_BLUE}
                      name="copy"
                      type="font-awesome"
                      size={20}
                    />
                  )}
                </ClickableListItem>
              </View>
            </View>
          </View>
        </View>
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    fontFamily: FONT_FAMILY_BODY,
    fontSize: FONT_SIZE_TEXT_INPUT,
    width: '20%',
    backgroundColor: COLOUR_FORM_CONTROL_BACKGROUND,
    borderWidth: 2,
    borderRadius: 8,
    flexDirection: 'row',
    height: 50,
    padding: 0,
    paddingLeft: 15,
    borderColor: COLOUR_FORM_CONTROL_BACKGROUND,
    color: COLOUR_GREY,
  },
});

export default BankAccountBankDetailsPrompt;

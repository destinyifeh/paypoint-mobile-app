import React from 'react';

import { View, Linking } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

import Text from '../components/text';
import { CONTACT_US_PHONE, CONTACT_US_EMAIL } from '../constants';
import { COLOUR_GREY, COLOUR_LIGHT_GREY } from '../constants/styles';
import { Icon } from 'react-native-elements';
import { FUND_WALLET_URL } from '../constants/api-resources';
import ClickableListItem from '../components/clickable-list-item';


export default class UploadFileMenu extends React.Component {
  render() {
    const { 
      navigation, onAddDocumentClick, onAddImageClick, 
      ref_, requestClose, excludeDocuments, excludeImages
    } = this.props;

    return (
      <RBSheet
        animationType="fade"
        closeOnDragDown={true}
        duration={250}
        height={240}
        onClose={this.onCancelConfirmation}
        ref={ref_}
      >
        <View
          style={{
            padding: 20
          }}
        >
          <Text
            bold
          >
            What would you like to upload?
          </Text>
        </View>
        
        {excludeImages !== true && <ClickableListItem
          onPress={() => {
            onAddImageClick();
            requestClose()
          }}
          style={{
            alignItems: 'center',
            borderBottomColor: COLOUR_LIGHT_GREY,
            borderBottomWidth: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 20
          }}
        >
          <Text
            big
            black
          >
            Image (PNG, JPEG, JPG)
          </Text>
          <Icon 
            name="chevron-right"
            type="feather"
          />
        </ClickableListItem>}
        
        {excludeDocuments !== true && <ClickableListItem
          onPress={() => {
            onAddDocumentClick();
            requestClose()
          }}
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 20
          }}
        >
          <Text
            big
            black
          >
            Document (PDF)
          </Text>
          <Icon 
            name="chevron-right"
            type="feather"
          />
        </ClickableListItem>}
      </RBSheet>
    );
  }
}

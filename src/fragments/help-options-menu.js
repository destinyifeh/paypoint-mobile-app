import React from 'react';

import { Linking, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { connect } from 'react-redux';

import { Icon } from 'react-native-elements';
import ClickableListItem from '../components/clickable-list-item';
import Text from '../components/text';
import { LINK_TO_FAQ } from '../constants/api-resources';
import { COLOUR_LIGHT_GREY } from '../constants/styles';


class HelpOptionsMenu extends React.Component {
  render() {
    const {
      onSetupPrinterPress,
      ref_, 
      remoteConfig: { 
        contact_us_email_address, 
        contact_us_phone_number,
        contact_us_webpage
      }, 
      requestClose,
    } = this.props;

    return (
      <RBSheet
        animationType="fade"
        closeOnDragDown={true}
        duration={250}
        height={480}
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
            Help Menu
          </Text>
        </View>
        
        <ClickableListItem
          onPress={() => {
            Linking.openURL(LINK_TO_FAQ)
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
            FAQs
          </Text>
          <Icon 
            name="chevron-right"
            type="feather"
          />
        </ClickableListItem>
        <ClickableListItem
          onPress={() => {
            Linking.openURL(contact_us_webpage)
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
            Help Desk
          </Text>
          <Icon 
            name="chevron-right"
            type="feather"
          />
        </ClickableListItem>

        <ClickableListItem
          onPress={() => {
            onSetupPrinterPress();
            requestClose();
          }}
          style={{
            alignItems: 'center',
            borderBottomColor: COLOUR_LIGHT_GREY,
            borderBottomWidth: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 20,
          }}
        >
          <Text big black>
            Setup Printer
          </Text>
          <Icon
            name="chevron-right"
            type="feather"
          />
        </ClickableListItem>

        <View
          style={{
            marginTop: 40,
            padding: 20
          }}
        >
          <Text
            bold
          >
            Contact Us via
          </Text>
        </View>
        
        <ClickableListItem
          onPress={() => {
            Linking.openURL(`tel:${contact_us_phone_number}`)
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
            Phone Call
          </Text>
          <Icon 
            name="chevron-right"
            type="feather"
          />
        </ClickableListItem>
        
        <ClickableListItem
          onPress={() => {
            Linking.openURL(`mailto:${contact_us_email_address}`)
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
            Email
          </Text>
          <Icon 
            name="chevron-right"
            type="feather"
          />
        </ClickableListItem>
      </RBSheet>
    );
  }
}

function mapStateToProps(state) {
  return {
    remoteConfig: state.tunnel.remoteConfig
  }
}

export default connect(mapStateToProps, null)(HelpOptionsMenu);


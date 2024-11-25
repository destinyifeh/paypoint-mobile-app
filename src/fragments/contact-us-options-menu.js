import React from 'react';

import { View, Linking } from 'react-native';
import { connect } from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';

import Text from '../components/text';
import { COLOUR_LIGHT_GREY } from '../constants/styles';
import { Icon } from 'react-native-elements';
import { LINK_TO_FAQ } from '../constants/api-resources';
import ClickableListItem from '../components/clickable-list-item';


class ContactUsOptionsMenu extends React.Component {
  render() {
    const { 
      ref_, 
      remoteConfig: { 
        contact_us_email_address, 
        contact_us_phone_number
      }, 
      requestClose
    } = this.props;

    return (
      <RBSheet
        animationType="fade"
        closeOnDragDown={true}
        duration={250}
        height={340}
        onClose={this.onCancelConfirmation}
        ref={ref_}
      >
        
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
            marginBottom: 36,
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

        <View
          style={{
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

export default connect(mapStateToProps, null)(ContactUsOptionsMenu);

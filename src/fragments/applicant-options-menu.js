import React from 'react';

import { ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';

import Text from '../components/text';
import { COLOUR_LIGHT_GREY } from '../constants/styles';
import { Icon } from 'react-native-elements';
import ClickableListItem from '../components/clickable-list-item';

// TO DO
// Check if the status is in progress first

class ApplicantOptionsMenu extends React.Component {
  render() {
    const {
      agentDetails,
      navigation,
      ref_,
      requestClose
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
        <ScrollView>

          <View
            style={{
              padding: 20
            }}
          >
            <Text
              bold
            >
              {agentDetails.businessName}
            </Text>
          </View>
          <ClickableListItem
            onPress={() => {
              navigation.navigate('ViewApplicantDetails', {
                applicantDetails: agentDetails
              });
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
              View
            </Text>
            <Icon
              name="chevron-right"
              type="feather"
            />
          </ClickableListItem>

          {agentDetails.status == 1 && <ClickableListItem
            onPress={() => {
              navigation.navigate('AggregatorLanding', {
                applicantDetails: agentDetails
              });
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
              Resume
            </Text>
            <Icon
              name="chevron-right"
              type="feather"
            />
          </ClickableListItem>}

        </ScrollView>
      </RBSheet>
    );
  }
}

function mapStateToProps(state) {
  return {
    remoteConfig: state.tunnel.remoteConfig
  }
}

export default connect(mapStateToProps, null)(ApplicantOptionsMenu);

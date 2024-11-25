import React from 'react';

import { Linking, ScrollView, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { connect } from 'react-redux';

import { Icon } from 'react-native-elements';
import ClickableListItem from '../components/clickable-list-item';
import Text from '../components/text';
import { SEND_MONEY } from '../constants';
import { COLOUR_LIGHT_GREY } from '../constants/styles';
import Services from '../fixtures/services.json';
import { formatPhoneNumberToReadable } from '../utils/formatters';


class AgentOptionsMenu extends React.Component {
  render() {
    const {
      agentDetails,
      navigation,
      ref_,
      requestClose
    } = this.props;

    const distributeServiceSubCategory = Services['send-money'].find(
      ({ name }) => name === 'Distribute'
    );

    return (
      <RBSheet
        animationType="fade"
        closeOnDragDown={true}
        duration={250}
        height={420}
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
              Manage {agentDetails.businessName}
            </Text>
          </View>
          <ClickableListItem
            onPress={() => {
              navigation.navigate('ViewAgentDetails', {
                agentDetails
              });
              requestClose()
            }}
            style={{
              alignItems: 'center',
              borderBottomColor: COLOUR_LIGHT_GREY,
              borderBottomWidth: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              // marginBottom: 36,
              padding: 20
            }}
          >
            <Text
              big
              black
            >
              Details
            </Text>
            <Icon
              name="chevron-right"
              type="feather"
            />
          </ClickableListItem>

          <ClickableListItem
            onPress={() => {
              navigation.navigate('ProductPayment', {
                category: SEND_MONEY,
                subCategory: distributeServiceSubCategory,
                defaultFormValues: {
                  recipient: agentDetails.businessPhoneNo
                }
              });
              requestClose()
            }}
            style={{
              alignItems: 'center',
              borderBottomColor: COLOUR_LIGHT_GREY,
              borderBottomWidth: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              // marginBottom: 36,
              padding: 20
            }}
          >
            <Text
              big
              black
            >
              Distribute to {agentDetails.businessName}
            </Text>
            <Icon
              name="chevron-right"
              type="feather"
            />
          </ClickableListItem>

          {/* <ClickableListItem
            onPress={() => {
              navigation.navigate('ProductPayment', {
                category: SEND_MONEY,
                subCategory: distributeServiceSubCategory,
                defaultFormValues: {
                  recipient: agentDetails.businessPhoneNo
                }
              });
              requestClose()
            }}
            style={{
              alignItems: 'center',
              borderBottomColor: COLOUR_LIGHT_GREY,
              borderBottomWidth: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              // marginBottom: 36,
              padding: 20
            }}
          >
            <Text
              big
              black
            >
              Manage {agentDetails.businessName}
            </Text>
            <Icon
              name="chevron-right"
              type="feather"
            />
          </ClickableListItem> */}

          <ClickableListItem
            onPress={() => {
              navigation.navigate('AgentUpgrade', {
                agentDetails
              });
              requestClose()
            }}
            style={{
              alignItems: 'center',
              borderBottomColor: COLOUR_LIGHT_GREY,
              borderBottomWidth: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              // marginBottom: 36,
              padding: 20
            }}
          >
            <Text
              big
              black
            >
              Upgrade {agentDetails.businessName}
            </Text>
            <Icon
              name="chevron-right"
              type="feather"
            />
          </ClickableListItem>

          <ClickableListItem
            onPress={() => {
              navigation.navigate('ReportTransactions', {
                filters: {
                  domainCode: agentDetails.walletRef,
                }
              });
              requestClose()
            }}
            style={{
              alignItems: 'center',
              borderBottomColor: COLOUR_LIGHT_GREY,
              borderBottomWidth: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              // marginBottom: 36,
              padding: 20
            }}
          >
            <Text
              big
              black
            >
              Transaction History
            </Text>
            <Icon
              name="chevron-right"
              type="feather"
            />
          </ClickableListItem>

          <ClickableListItem
            onPress={() => {
              navigation.navigate('CommissionsEarned', {
                filters: {
                  domainCode: agentDetails.walletRef,
                }
              });
              requestClose();
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
              Commission History
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
              Contact via
            </Text>
          </View>

          <ClickableListItem
            onPress={() => {
              Linking.openURL(`tel:${formatPhoneNumberToReadable(agentDetails.businessPhoneNo)}`)
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
              Linking.openURL(`mailto:${agentDetails.businessEmail}`)
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

export default connect(mapStateToProps, null)(AgentOptionsMenu);

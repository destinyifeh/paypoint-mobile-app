import React from 'react';

import {View} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

import Clipboard from '@react-native-clipboard/clipboard';
import {Icon} from 'react-native-elements';
import {connect} from 'react-redux';
import ClickableListItem from '../components/clickable-list-item';
import Text from '../components/text';
import {COPIED_TO_CLIPBOARD} from '../constants';
import {CASUAL} from '../constants/dialog-priorities';
import {
  COLOUR_BLACK,
  COLOUR_BLUE,
  COLOUR_LIGHT_GREY,
} from '../constants/styles';
import {flashMessage} from '../utils/dialog';
import {loadData} from '../utils/storage';

class FundViaTransfer extends React.Component {
  state = {
    showOnlyMessage: false,
    currentAgent: null,
  };

  componentDidMount() {
    const fetchCurrentAgent = async () => {
      const savedAgentData = JSON.parse(await loadData('theLoggedInAgent'));
      this.setState({currentAgent: savedAgentData});
    };
    fetchCurrentAgent();
  }
  render() {
    const {ref_, accountNo} = this.props;
    const {message, showOnlyMessage} = this.state;

    const copyContentToClipboard = () => {
      Clipboard.setString(accountNo);
      flashMessage(null, COPIED_TO_CLIPBOARD, CASUAL);
    };

    return (
      <RBSheet
        animationType="fade"
        closeOnDragDown={true}
        closeOnPressMask={true}
        closeOnPressBack={true}
        duration={250}
        height={240}
        // onClose={this.onCancelConfirmation}/
        ref={ref_}>
        <View
          style={{
            padding: 20,
          }}>
          <Text
            bold
            style={{
              color: COLOUR_BLUE,
            }}>
            Account Number
          </Text>
          <View
            style={{
              backgroundColor: COLOUR_LIGHT_GREY,
              borderRadius: 10,
              padding: 20,
              marginTop: 20,
            }}>
            <View>
              <Text
                big
                style={{
                  color: COLOUR_BLUE,
                  // paddingHorizontal: 10,
                }}>
                {this.state.currentAgent?.staticAccounts
                  ? this.state.currentAgent?.staticAccounts[0]?.bankName
                  : '...'}{' '}
              </Text>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text big black copyOnPress>
                    {this.state.currentAgent?.staticAccounts
                      ? this.state.currentAgent?.staticAccounts[0]
                          ?.accountNumber
                      : '...'}{' '}
                  </Text>
                </View>

                {this.state.currentAgent?.staticAccounts && (
                  <ClickableListItem onPress={copyContentToClipboard}>
                    {this.state.currentAgent !== null && (
                      <Icon
                        color={COLOUR_BLACK}
                        name="copy"
                        type="font-awesome"
                      />
                    )}
                  </ClickableListItem>
                )}
              </View>
              <Text
                big
                style={{
                  color: COLOUR_BLUE,
                  // paddingHorizontal: 10,
                }}>
                {this.state.currentAgent?.staticAccounts
                  ? this.state.currentAgent?.staticAccounts[0]?.accountName
                  : '...'}{' '}
              </Text>
            </View>
          </View>
        </View>
      </RBSheet>
    );
  }
}

function mapStateToProps(state) {
  return {
    remoteConfig: state.tunnel.remoteConfig,
  };
}

export default connect(mapStateToProps, null)(FundViaTransfer);

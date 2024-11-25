import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import ActivityIndicator from '../../../../../../components/activity-indicator';
import BaseForm from '../../../../../../components/base-form';
import FormInput from '../../../../../../components/form-controls/form-input';
import Header from '../../../../../../components/header';
import {
  COLOUR_BLUE,
  COLOUR_GREY,
  COLOUR_LIGHT_GREY,
  COLOUR_MID_GREY,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_FAMILY_BODY,
} from '../../../../../../constants/styles';
import UserManagement from '../../../../../../services/api/resources/user-management';

const APPROVAL_STATUS = {
  awaiting_approval: 'Awaiting Approval',
  declined: 'Declined',
  approved: 'Approved',
  '': '',
};

const DELIVERY_STATUS = {
  awaiting_delivery: 'Awaiting Delivery',
  delivered: 'Delivered',
  '': '',
};

export default class TrackPosOrderScene extends BaseForm {
  userManagement = new UserManagement();

  requiredFields = ['posModel'];

  workflowDetails = this.props.route?.params?.workflowDetails || null;
  requestId = this.props.route?.params?.requestId || null;

  state = {
    searchTerm: '',
    count: 0,
    isLoading: false,
    workflowRequestId: '',
  };

  async componentDidMount() {
    this.getPosRequestData();
  }

  async getPosRequestData() {
    console.log('WorkFlowDetails:', this.workflowDetails);
    return this.setState({
      workflowRequestId: workflowDetails,
    });
  }

  render() {
    const screenContent = () => {
      return (
        <View
          style={{
            backgroundColor: COLOUR_WHITE,
            flex: 1,
            paddingHorizontal: 30,
            paddingBottom: 0,
          }}>
          <Text
            bold
            style={{
              color: '#353F50',
              paddingVertical: 15,
              paddingTop: 30,
              fontSize: 19,
            }}>
            Track Delivery
          </Text>
          <FormInput
            hideOptionalLabel
            outerContainerStyle={{
              borderBottomColor: 'red',
            }}
            innerContainerStyle={{
              elevation: 5,
              borderWidth: 1,
              borderColor: '#A8D6EF',
            }}
            placeholder={`Request No: ${this.requestId || ''}`}
            disabled
          />
          <Text
            bold
            style={{
              color: '#353F50',
              paddingVertical: 15,
              paddingTop: 30,
              fontSize: 19,
            }}>
            Status
          </Text>
          <View
            style={{
              backgroundColor: COLOUR_WHITE,
              elevation: 5,
              padding: 50,
              paddingLeft: 40,
              borderRadius: 7,
              minHeight: 350,
              marginBottom: 30,
            }}>
            <View
              style={{
                height: 100,
                position: 'relative',
                paddingLeft: 30,
                border: 'none',
                borderLeftColor: '#0275D8',
                borderTopColor: 'transparent',
                borderRightColor: 'transparent',
                borderbottomColor: 'transparent',
                borderLeftWidth: 2,
              }}>
              <Text bigger style={{color: COLOUR_MID_GREY}}>
                Processing
              </Text>
              <View
                style={{
                  position: 'absolute',
                  backgroundColor: '#EBF8FE',
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 40,
                  width: 40,
                  top: -10,
                  left: -20,
                  zIndex: 3,
                }}>
                <Image
                  source={require('../../../../../../assets/media/icons/check.png')}
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: 'contain',
                  }}
                />
              </View>
            </View>
            {this.workflowDetails?.paymentStatus &&
              this.workflowDetails?.paymentStatus != 'n/a' && (
                <View
                  style={{
                    height: 100,
                    position: 'relative',
                    paddingLeft: 30,
                    border: 'none',
                    borderLeftColor:
                      this.workflowDetails?.paymentStatus === 'paid'
                        ? '#0275D8'
                        : COLOUR_LIGHT_GREY,
                    borderTopColor: 'transparent',
                    borderRightColor: 'transparent',
                    borderbottomColor: 'transparent',
                    borderLeftWidth: 2,
                  }}>
                  <Text bigger style={{color: COLOUR_MID_GREY}}>
                    Paid
                  </Text>
                  <View
                    style={{
                      position: 'absolute',
                      backgroundColor: '#EBF8FE',
                      borderRadius: 50,
                      alignItems: 'center',
                      // flexDirection: "row",
                      justifyContent: 'center',
                      // padding: 8,
                      height: 40,
                      width: 40,
                      top: -10,
                      left: -20,
                      zIndex: 3,
                    }}>
                    <Image
                      source={require('../../../../../../assets/media/icons/check.png')}
                      style={{
                        height: 20,
                        width: 20,
                        resizeMode: 'contain',
                      }}
                    />
                  </View>
                </View>
              )}
            <View
              style={{
                height: 100,
                position: 'relative',
                paddingLeft: 30,
                border: 'none',
                borderLeftColor: COLOUR_LIGHT_GREY,
                borderTopColor: 'transparent',
                borderRightColor: 'transparent',
                borderbottomColor: 'transparent',
                borderLeftWidth: 2,
              }}>
              <Text
                bigger
                style={{
                  color:
                    this.workflowDetails?.approvalStatus ===
                      'awaiting_approval' || 'declined'
                      ? '#74C965'
                      : '#676767',
                }}>
                {APPROVAL_STATUS[this.workflowDetails?.approvalStatus]}
              </Text>
              {this.workflowDetails?.approvalStatus === 'approved' ? (
                <View
                  style={{
                    position: 'absolute',
                    backgroundColor: '#EBF8FE',
                    borderRadius: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 40,
                    width: 40,
                    top: -10,
                    left: -20,
                    zIndex: 3,
                  }}>
                  <Image
                    source={require('../../../../../../assets/media/icons/check.png')}
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: 'contain',
                    }}
                  />
                </View>
              ) : (
                <View
                  style={{
                    position: 'absolute',
                    backgroundColor: '#00B8DE',
                    borderRadius: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 40,
                    width: 40,
                    top: -10,
                    left: -20,
                    zIndex: 3,
                  }}>
                  <Image
                    source={require('../../../../../../assets/media/icons/check-white.png')}
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: 'contain',
                    }}
                  />
                </View>
              )}
            </View>
            <View
              style={{
                height: 40,
                position: 'relative',
                paddingLeft: 30,
                border: 'none',
                borderLeftColor:
                  this.workflowDetails?.deliveryStatus === 'delivered'
                    ? '#0275D8'
                    : COLOUR_LIGHT_GREY,
                borderTopColor: 'transparent',
                borderRightColor: 'transparent',
                borderbottomColor: 'transparent',
                borderLeftWidth: 2,
              }}>
              <Text bigger style={{color: COLOUR_GREY}}>
                {DELIVERY_STATUS[this.workflowDetails?.deliveryStatus]}
              </Text>
              {this.workflowDetails?.deliveryStatus === 'delivered' ? (
                <View
                  style={{
                    position: 'absolute',
                    backgroundColor: '#00B8DE',
                    borderRadius: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 40,
                    width: 40,
                    top: -10,
                    left: -20,
                    zIndex: 3,
                  }}>
                  <Image
                    source={require('../../../../../../assets/media/icons/check-white.png')}
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: 'contain',
                    }}
                  />
                </View>
              ) : (
                <View
                  style={{
                    position: 'absolute',
                    backgroundColor: '#EBF8FE',
                    borderRadius: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 25,
                    width: 25,
                    top: -7,
                    left: -15,
                    zIndex: 3,
                  }}>
                  <Image
                    source={require('../../../../../../assets/media/icons/step.png')}
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: 'contain',
                    }}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
      );
    };

    return (
      <View style={styles.container}>
        <React.Fragment>
          <Header
            containerStyle={{
              backgroundColor: COLOUR_BLUE,
            }}
            navigationIconColor={COLOUR_WHITE}
            leftComponent={
              <Icon
                color={COLOUR_RED}
                underlayColor="transparent"
                name="chevron-left"
                size={40}
                type="material"
                onPress={() => this.props.navigation.goBack()}
              />
            }
            hideNavigationMenu={this.props.hideNavigator}
            showNavigationMenu={this.props.showNavigator}
            statusBarProps={{
              backgroundColor: 'transparent',
              barStyle: CONTENT_LIGHT,
            }}
            title="Track Delivery"
            titleStyle={{
              color: COLOUR_WHITE,
              fontWeight: 'bold',
            }}
            rightComponent
          />
          <ScrollView>
            {this.state.isLoading ? <ActivityIndicator /> : screenContent()}
          </ScrollView>
        </React.Fragment>
        {/* } */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  receiptLineContainer: {
    flexDirection: 'row',
  },
  receiptLineItemFieldName: {
    fontSize: 18,
    marginTop: 4,
    paddingTop: 2,
    paddingBottom: 1,
    lineHeight: 18,
    fontFamily: FONT_FAMILY_BODY,
  },
});

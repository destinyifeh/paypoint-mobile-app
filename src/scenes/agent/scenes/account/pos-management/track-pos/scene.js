import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import ActivityIndicator from '../../../../../../components/activity-indicator';
import BaseForm from '../../../../../../components/base-form';
import Button from '../../../../../../components/button';
import FormInput from '../../../../../../components/form-controls/form-input';
import Header from '../../../../../../components/header';
import {
  COLOUR_BLUE,
  COLOUR_LIGHT_GREY,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_FAMILY_BODY_SEMIBOLD,
  FONT_SIZE_TEXT_INPUT,
} from '../../../../../../constants/styles';
import UserManagement from '../../../../../../services/api/resources/user-management';

export default class TrackPosScene extends BaseForm {
  userManagement = new UserManagement();

  requiredFields = ['posModel'];

  state = {
    searchTerm: '',
    search: false,
    data: null,
    count: 0,
    isLoading: false,
    showWorkflowDetails: false,
    workflowDetails: null,
    selectedQuantity: null,
    posDetails: [],
    paidResponse: [],
    receiptFields: {},
    posModel: 'Model 1050tx',
  };

  async componentDidMount() {}

  async getPOSWorkflowDetailsByRequestId() {
    this.setState({
      isLoading: true,
    });

    const {code, response} = await this.userManagement.getPosWorkflowDetails(
      this.state.searchTerm,
    );

    if (code == '404') {
      this.setState({
        didErrorOccurWhileLoading: true,
        isLoading: false,
        search: false,
        showWorkflowDetails: false,
      });
      Alert.alert('Not Found', 'No record found for the selected terminal');
      return;
    } else if (code != '200') {
      this.setState({
        isLoading: false,
      });
      Alert.alert('Oops', 'Something went wrong');
    } else {
      let details = response.data;
      details.requestId = this.state.searchTerm;
      this.setState({
        isLoading: false,
        search: true,
        workflowDetails: details,
        showWorkflowDetails: true,
      });
    }
  }

  workflowItem = (workflowDetails, id) => {
    return (
      <View
        key={`workflowItem${id}`}
        style={{
          backgroundColor: COLOUR_WHITE,
          flex: 1,
          paddingHorizontal: 30,
          paddingBottom: 0,
          borderWidth: 2,
          borderRadius: 5,
          borderColor: COLOUR_LIGHT_GREY,
          marginHorizontal: 10,
          marginBottom: 3,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 15,
          }}
        />
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 15,
          }}>
          <View
            style={{
              flex: 0.5,
            }}>
            <Text mid style={{color: '#00425F'}}>
              Agent Username
            </Text>
            <Text
              style={{
                fontSize: FONT_SIZE_TEXT_INPUT,
                fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                marginVertical: 10,
              }}>
              {workflowDetails?.agentUsername}
            </Text>
          </View>

          <View
            style={{
              alignItems: 'flex-end',
              flex: 0.5,
            }}>
            <Text mid style={{color: '#00425F'}}>
              Initiator Number
            </Text>
            <Text
              style={{
                fontSize: FONT_SIZE_TEXT_INPUT,
                fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                marginVertical: 10,
              }}>
              {workflowDetails?.initiatorUsername}
            </Text>
          </View>
        </View>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            // paddingVertical: 15,
            paddingTop: 15,
          }}>
          <View
            style={{
              flex: 0.5,
            }}>
            <Text mid style={{color: '#00425F'}}>
              Terminal Model
            </Text>
            <Text
              style={{
                fontSize: FONT_SIZE_TEXT_INPUT,
                fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                marginVertical: 10,
              }}>
              {workflowDetails?.terminalModel}
            </Text>
          </View>

          <View
            style={{
              alignItems: 'flex-end',
              flex: 0.5,
            }}>
            <Button
              onPress={() =>
                this.props.navigation.navigate('TrackPosOrderScene', {
                  workflowDetails,
                  requestId: this.state.searchTerm,
                })
              }
              title="TRACK"
              buttonStyle={{backgroundColor: COLOUR_BLUE}}
              containerStyle={{
                backgroundColor: COLOUR_BLUE,
              }}
            />
          </View>
        </View>

        {workflowDetails?.deliveryStatus && (
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 15,
            }}>
            <View
              style={{
                flex: 0.5,
              }}>
              <Text mid style={{color: '#00425F'}}>
                Delivery status
              </Text>
              <Text
                style={{
                  fontSize: FONT_SIZE_TEXT_INPUT,
                  fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                  marginVertical: 10,
                  color:
                    workflowDetails?.deliveryStatus === 'awaiting_delivery'
                      ? '#F2994A'
                      : '#74C965',
                }}>
                {workflowDetails?.deliveryStatus === 'awaiting_delivery'
                  ? 'Awaiting Delivery'
                  : workflowDetails?.deliveryStatus === 'delivered'
                  ? 'Delivered'
                  : workflowDetails?.deliveryStatus}
              </Text>
            </View>

            <View
              style={{
                alignItems: 'flex-end',
                flex: 0.5,
              }}>
              <Text mid style={{color: '#00425F'}} />
            </View>
          </View>
        )}
      </View>
    );
  };

  render() {
    const screenContent = () => {
      return (
        this.state.showWorkflowDetails &&
        this.state.workflowDetails.map((workflowDetails, id) =>
          this.workflowItem(workflowDetails, id),
        )
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
                onPress={() => this.props.navigation.replace('POSManagement')}
              />
            }
            hideNavigationMenu={this.props.hideNavigator}
            showNavigationMenu={this.props.showNavigator}
            statusBarProps={{
              backgroundColor: 'transparent',
              barStyle: CONTENT_LIGHT,
            }}
            title="Request Details"
            titleStyle={{
              color: COLOUR_WHITE,
              fontWeight: 'bold',
            }}
            rightComponent
          />
          <FormInput
            hideOptionalLabel
            outerContainerStyle={{
              borderBottomColor: 'red',
            }}
            innerContainerStyle={{
              elevation: 5,
              margin: 30,
            }}
            rightIconName="search"
            rightIconParams={this.state.searchTerm}
            rightIconOnpress={() => {
              this.state.searchTerm === ''
                ? Alert.alert('Validation Error', 'Field cannot be empty!')
                : this.getPOSWorkflowDetailsByRequestId();
            }}
            onChangeText={searchTerm => {
              AsyncStorage.setItem(
                this.persistenceKey,
                JSON.stringify(searchTerm),
              );
              this.setState({searchTerm});
            }}
            placeholder="R1250924798"
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
});

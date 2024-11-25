import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {Alert, Dimensions, Linking, ScrollView, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import BaseForm from '../../../../../../components/base-form';
import Button from '../../../../../../components/button';
import ClickableListItem from '../../../../../../components/clickable-list-item';
import FormCheckboxNew from '../../../../../../components/form-controls/form-checkbox-new';
import FormInput from '../../../../../../components/form-controls/form-input';
import FormPicker from '../../../../../../components/form-controls/form-picker';
import Header from '../../../../../../components/header';
import {
  COLOUR_BLUE,
  COLOUR_GREY,
  COLOUR_LIGHT_GREY,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_SIZE_MID,
  FONT_SIZE_SMALL,
} from '../../../../../../constants/styles';
import UserManagement from '../../../../../../services/api/resources/user-management';
import styles from '../../../services/styles';

const windowHeight = Dimensions.get('window').height;

export default class PosRequestSubmitScene extends BaseForm {
  userManagement = new UserManagement();

  requiredFields = ['posModel'];

  state = {
    searchTerm: '',
    search: false,
    data: null,
    count: 0,
    isLoading: false,
    iAgree: false,
    showSuccessModal: false,
    showFailureModal: false,
    posModelData: null,
    posDetails: null,
    posRequestType: 'Free',
    posRequestTypes: [
      {
        name: 'Free',
        value: 'Free',
      },
      {
        name: 'Purchase',
        value: 'Purchase',
      },
    ],
    posModel: 'Model 1050tx',
    posModels: [
      {
        id: 1,
        name: 'Model 1050tx',
      },
      {
        id: 2,
        name: 'Model 1054tx',
      },
      {
        id: 3,
        name: 'Model 1053tx',
      },
    ],
    selectedQuantity: '',
    invalidFields: [],
  };

  persistenceKey = 'selectedPosModel';
  persistenceKey2 = 'selectedQuantity';
  persistenceKey3 = 'selectedPosData';
  persistenceKey4 = 'paidResponse';

  async componentDidMount() {
    this.getPosRequestData();
  }

  async getPosRequestData() {
    const jsonString = await AsyncStorage.getItem(this.persistenceKey);
    const posDetails = await AsyncStorage.getItem(this.persistenceKey3);

    return this.setState({
      posModelData: JSON.parse(jsonString),
      posDetails: JSON.parse(posDetails),
    });
  }

  async onSubmit() {
    this.setState({
      isLoading: true,
    });

    AsyncStorage.setItem(
      this.persistenceKey2,
      JSON.stringify(this.state.selectedQuantity),
    );

    const payload = {
      posModel: this.state.posDetails[0].terminalModel,
      posType: this.state.posDetails[0].terminalType,
      quantity: parseInt(this.state.selectedQuantity),
      requestDeviceChannel: 'WEB',
      requestType: this.state.posRequestType === 'Free' ? 'free' : 'paid',
      termsCondition: true,
    };

    const {code, response} = await this.userManagement.validatePosRequest(
      payload,
    );

    if (code == '409' || code == '404' || code == '400' || code == '500') {
      this.setState({
        isLoading: false,
      });
      Alert.alert('Request Failed', response.description || response.error);
      this.props.navigation.navigate('PosRequestScene');
      return;
    } else {
      this.setState({
        isLoading: false,
      });
      AsyncStorage.setItem(this.persistenceKey4, JSON.stringify(response.data));
      this.props.navigation.navigate('PosRequestPaymentDetailsScene');
    }

    this.setState({
      isLoading: false,
    });
  }

  get successModal() {
    return (
      <Modal
        buttons={[
          {
            onPress: () => {
              this.setState({showSuccessModal: false});
              this.props.navigation.replace('POSManagement');
            },
            buttonStyle: {
              paddingHorizontal: 10,
            },
            containerStyle: {
              paddingHorizontal: 10,
              width: '100%',
            },
            title: 'Okay',
          },
        ]}
        content={
          <View
            style={{
              flex: 0.6,
              justifyContent: 'center',
              alignContent: 'center',
            }}>
            <Text big center style={{textAlign: 'center'}}>
              Your request has been received, please check under “My Reports” to
              see request status
            </Text>
          </View>
        }
        image={require('../../../../../../assets/media/images/clap.png')}
        isModalVisible={true}
        size="md"
        title="Request Submitted"
        withButtons
        hideCloseButton
      />
    );
  }
  get failureModal() {
    return (
      <Modal
        buttons={[
          {
            onPress: () => {
              this.setState({showSuccessModal: false});
              this.props.navigation.replace('POSManagement');
            },
            buttonStyle: {
              paddingHorizontal: 10,
            },
            containerStyle: {
              paddingHorizontal: 10,
              width: '100%',
            },
            title: 'Retry',
          },
        ]}
        content={
          <View
            style={{
              flex: 0.6,
              justifyContent: 'center',
              alignContent: 'center',
            }}>
            <Text big center style={{textAlign: 'center'}}>
              Your request has failed and cannot continue, please try again
            </Text>
          </View>
        }
        image={require('../../../../../../assets/media/images/failed.png')}
        isModalVisible={true}
        size="md"
        title="Request Failed"
        withButtons
        hideCloseButton
      />
    );
  }

  render() {
    return (
      <View
        style={{
          backgroundColor: COLOUR_WHITE,
          flex: 1,
        }}>
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
          title="Request POS"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
          }}
          rightComponent
        />
        {this.state.showSuccessModal && this.successModal}
        {this.state.showFailureModal && this.failureModal}
        <ScrollView>
          <View
            style={{
              padding: 30,
              paddingBottom: 20,
              height: '80%',
            }}>
            <Text
              bigger
              style={{
                color: '#353F50',
                paddingVertical: 15,
                paddingBottom: 30,
                fontSize: 20,
              }}>
              Create New POS Request
            </Text>
            <FormInput
              hideOptionalLabel
              outerContainerStyle={{
                borderBottomColor: 'red',
              }}
              innerContainerStyle={{
                elevation: 5,
              }}
              placeholder={this.state.posModelData}
              text="POS Model"
              disabled
            />
            <FormInput
              autoCompleteType="tel"
              keyboardType="number-pad"
              defaultValue={this.state.selectedQuantity}
              innerContainerStyle={styles.formInputInnerContainerStyle}
              onChangeText={(selectedQuantity, isValid) => {
                this.setState({selectedQuantity});
                !isValid
                  ? this.addInvalidField('selectedQuantity')
                  : this.removeInvalidField('selectedQuantity');
              }}
              placeholder="Enter quantity"
              outerContainerStyle={styles.formInputOuterContainerStyle}
              propagateError={this.props.propagateFormErrors}
              text="Quantity:"
              textInputRef={input => (this.selectedQuantity = input)}
              validators={{
                maxLength: 2,
                required: true,
              }}
            />

            <FormPicker
              choices={this.state.posRequestTypes.map(({value, name}) => ({
                label: name,
                value: value,
              }))}
              defaultValue={this.state.posRequestType}
              innerContainerStyle={styles.formInputInnerContainerStyle}
              onSelect={posRequestType => {
                this.setState({posRequestType});
              }}
              propagateError={this.props.propagateFormErrors}
              text="Request Type"
              validators={{
                required: true,
              }}
            />
            <View
              style={{
                marginTop: windowHeight * 0.3,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  height: 50,
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  borderColor: COLOUR_LIGHT_GREY,
                  borderWidth: 1,
                  borderRadius: 5,
                  paddingTop: 6,
                  paddingBottom: 10,
                  paddingRight: 8,
                  paddingLeft: 2,
                  marginBottom: 4,
                }}>
                <FormCheckboxNew
                  center
                  checked={this.state.iAgree}
                  onPress={() =>
                    this.setState({
                      iAgree: !this.state.iAgree,
                    })
                  }
                  textStyle={{
                    color: COLOUR_GREY,
                    fontWeight: 'normal',
                    fontSize: FONT_SIZE_MID,
                  }}
                  value={this.state.iAgree}
                />
                <View
                  style={{
                    fontSize: FONT_SIZE_SMALL,
                    // flexDirection: "row",
                    // alignItems: "center",
                    // maxWidth: "80%"
                  }}>
                  <Text>I agree to Quickteller Paypoint </Text>
                  <ClickableListItem
                    onPress={() =>
                      Linking.openURL(
                        `https://mufasa.interswitchng.com/p/finch-agent-dashboard/documents/POS Agreement Template Outright Payment.pdf`,
                      )
                    }>
                    <Text
                      bold
                      style={{
                        color: COLOUR_BLUE,
                      }}>
                      Terms and Conditions
                    </Text>
                  </ClickableListItem>
                </View>
              </View>
              <Button
                title={
                  this.state.posRequestType === 'Purchase'
                    ? 'PROCEED TO PAYMENT'
                    : 'SUBMIT REQUEST'
                }
                buttonStyle={{
                  backgroundColor: COLOUR_BLUE,
                }}
                containerStyle={{
                  backgroundColor: COLOUR_BLUE,
                }}
                disabled={!(this.state.iAgree && this.state.selectedQuantity)}
                onPress={() => this.onSubmit()}
                loading={this.state.isLoading}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

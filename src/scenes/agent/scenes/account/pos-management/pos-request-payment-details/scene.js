import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {Alert, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import ActivityIndicator from '../../../../../../components/activity-indicator';
import BaseForm from '../../../../../../components/base-form';
import Button from '../../../../../../components/button';
import Header from '../../../../../../components/header';
import {ReceiptBottomSheet} from '../../../../../../components/receipt';
import {
  COLOUR_BLUE,
  COLOUR_LIGHT_GREY,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../../../../constants/styles';
import UserManagement from '../../../../../../services/api/resources/user-management';
import {convertNgkToNgn} from '../../../../../../utils/converters/currencies';
import {formatNgnAmount} from '../../../../../../utils/formatters';
import ServiceTypes from '../../../services//types';

export default class PosRequestPaymentDetailsScene extends BaseForm {
  userManagement = new UserManagement();

  requiredFields = ['posModel'];

  state = {
    searchTerm: '',
    search: false,
    data: null,
    bottomSheet: null,
    count: 0,
    isLoading: false,
    disableButton: false,
    selectedQuantity: null,
    posDetails: [],
    paidResponse: [],
    receiptFields: {},
    posModel: 'Model 1050tx',
  };

  persistenceKey = 'selectedPosModel';
  persistenceKey2 = 'selectedQuantity';
  persistenceKey3 = 'selectedPosData';
  persistenceKey4 = 'paidResponse';
  persistenceKey5 = 'fieldDetails';

  async componentDidMount() {
    this.getPosRequestData();
    // this.searchTerminalData();

    const {category, option, product, subCategory} =
      this.props.route?.params || {};

    this.serviceType = new ServiceTypes[category]({
      category,
      option,
      product,
      subCategory,
    });

    // InteractionManager.runAfterInteractions(() => {
    //   this.setState({
    //     animationsDone: true,
    //   });
    // });

    // if (product?.imageUrl) {
    //   const [, destinationPath] = await startFileDownload(product.imageUrl);
    //   this.setState({
    //     iconPath: destinationPath,
    //   });
    // }

    this.setState({
      deviceDetails: await getDeviceDetails(),
      product,
    });
  }

  async getPosRequestData() {
    const jsonString = await AsyncStorage.getItem(this.persistenceKey2);
    const posDetails = await AsyncStorage.getItem(this.persistenceKey3);
    const paidResponse = await AsyncStorage.getItem(this.persistenceKey4);
    return this.setState({
      selectedQuantity: JSON.parse(jsonString),
      posDetails: JSON.parse(posDetails),
      paidResponse: JSON.parse(paidResponse),
    });
  }

  async onSubmit() {
    this.setState({
      isLoading: true,
    });

    // AsyncStorage.setItem(
    //   this.persistenceKey2,
    //   JSON.stringify(this.state.selectedQuantity)
    // );

    const payload = {
      posRequestId: this.state.paidResponse?.posRequestId,
    };

    // Alert.alert("Not Found", "Paid");
    const {code, response} = await this.userManagement.submitPosRequest(
      payload,
    );
    if (
      code == '404' ||
      code == '409' ||
      code === '40006' ||
      code === '405' ||
      code == '400' ||
      code == '500'
    ) {
      this.setState({
        didErrorOccurWhileLoading: true,
        isLoading: false,
        search: false,
      });
      Alert.alert('Failed', response.description);
      this.props.navigation.navigate('PosRequestScene');
      return;
    }
    AsyncStorage.setItem(this.persistenceKey5, JSON.stringify(response.data));
    this.setState({
      isLoading: false,
      receiptFields: response.data,
      disableButton: true,
    });
    setTimeout(() => {
      this.showReceipt();
    }, 2000);
  }

  onCloseBottomSheet() {
    this.props.navigation.navigate('PosRequestScene');
    this.setState({
      bottomSheet: null,
    });
  }

  showReceipt() {
    this.receiptBottomSheet.open();
  }

  cancelReceipt() {
    this.props.navigation.navigate('PosRequestScene');
    this.receiptBottomSheet.close();
  }

  render() {
    const totalAmountIn =
      convertNgkToNgn(this.state.posDetails[0]?.price || 0) *
      parseInt(this.state.selectedQuantity);
    const totalAmountInFree =
      convertNgkToNgn(this.state.paidResponse?.posDeploymentFee || 0) *
      parseInt(this.state.selectedQuantity);
    // (convertNgkToNgn(this.state.posDetails[0]?.price || 0) + parseInt(requestId.fee)) * parseInt(amount);

    const screenContent = () => {
      return (
        // this.state.count > 0 && (
        <ScrollView
          contentContainerStyle={{
            margin: 10,
            marginTop: 0,
            height: '90%',
          }}>
          <ReceiptBottomSheet
            iconPath={this.state.iconPath}
            fields={this.state.receiptFields}
            onClose={() => {
              this.onCloseBottomSheet();
            }}
            requestClose={() => this.cancelReceipt()}
            onHome={() => {
              // this.props.navigation.reset(
              //   [NavigationActions.navigate({routeName: 'DefaultScene'})],
              //   0,
              // );
              this.props.navigation.reset({
                index: 0,
                routes: [{name: 'DefaultScene'}],
              });
            }}
            sheetRef={sheet => (this.receiptBottomSheet = sheet)}
            showAnimation={false}
          />

          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 15,
              paddingTop: 25,
            }}>
            <View
              style={{
                flex: 0.5,
              }}>
              <Text mid style={{color: '#00425F'}}>
                Terminal Model:
              </Text>
            </View>

            <View
              style={{
                flex: 0.5,
                alignItems: 'flex-end',
              }}>
              <Text>
                {this.state.posDetails[0]?.terminalModel || 'Loading'}
              </Text>
            </View>
          </View>
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
                Terminal Type:
              </Text>
            </View>

            <View
              style={{
                flex: 0.5,
                alignItems: 'flex-end',
              }}>
              <Text>{this.state.posDetails[0]?.terminalType || 'Loading'}</Text>
            </View>
          </View>
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
                Quantity:
              </Text>
            </View>

            <View
              style={{
                flex: 0.5,
                alignItems: 'flex-end',
              }}>
              <Text>{this.state.selectedQuantity || 'loading'}</Text>
            </View>
          </View>

          <DrawLine />
          {this.state.paidResponse?.posDeploymentFee === 0 && (
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 15,
                paddingTop: 35,
              }}>
              <View
                style={{
                  flex: 0.5,
                }}>
                <Text mid style={{color: '#00425F'}}>
                  POS Unit Price:
                </Text>
              </View>

              <View
                style={{
                  flex: 0.5,
                  alignItems: 'flex-end',
                }}>
                <Text>
                  {formatNgnAmount(
                    convertNgkToNgn(this.state.posDetails[0]?.price || 0),
                  )}
                </Text>
              </View>
            </View>
          )}
          {this.state.posDetails[0]?.fee > 0 && (
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
                  Surchage:
                </Text>
              </View>

              <View
                style={{
                  flex: 0.5,
                  alignItems: 'flex-end',
                }}>
                <Text>
                  {formatNgnAmount(
                    this.state.posDetails[0]?.fee > 0
                      ? this.state.posDetails[0]?.fee
                      : 0,
                  )}
                </Text>
              </View>
            </View>
          )}
          {this.state.paidResponse?.posDeploymentFee > 0 && (
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
                  POS Deployment Fee:
                </Text>
                <Text small style={{color: 'red', fontSize: 10}}>
                  N.B: This fee is non-refundable
                </Text>
              </View>

              <View
                style={{
                  flex: 0.5,
                  alignItems: 'flex-end',
                }}>
                <Text>
                  {formatNgnAmount(
                    convertNgkToNgn(
                      this.state.paidResponse?.posDeploymentFee > 0
                        ? this.state.paidResponse?.posDeploymentFee
                        : 0,
                    ),
                  )}
                </Text>
              </View>
            </View>
          )}
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 15,
            }}>
            {!this.state.paidResponse?.posDeploymentFee > 0 && (
              <>
                <View
                  style={{
                    flex: 0.5,
                  }}>
                  <Text mid style={{color: '#00425F'}}>
                    Total Price:
                  </Text>
                </View>

                <View
                  style={{
                    flex: 0.5,
                    alignItems: 'flex-end',
                  }}>
                  <Text>
                    {formatNgnAmount(
                      this.state.paidResponse?.posDeploymentFee > 0
                        ? totalAmountInFree
                        : totalAmountIn || 0,
                    )}
                  </Text>
                </View>
              </>
            )}
          </View>

          <DrawLine />

          <Button
            onPress={() => {
              this.onSubmit();
            }}
            title="MAKE PAYMENT"
            buttonStyle={{backgroundColor: COLOUR_BLUE}}
            containerStyle={{
              backgroundColor: COLOUR_BLUE,
              // margin: 30,
              marginTop: 40,
            }}
            disabled={this.state.disableButton === true}
          />
        </ScrollView>
        // )
      );
    };

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
          title="Payment Details"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
          }}
          rightComponent
        />

        <View
          style={{
            padding: 30,
          }}>
          <View>
            {this.state.isLoading ? <ActivityIndicator /> : screenContent()}
          </View>
        </View>
      </View>
    );
  }
}

const DrawLine = () => (
  <View
    style={{
      borderWidth: 1,
      borderColor: COLOUR_LIGHT_GREY,
      borderRadius: 5,
      marginTop: 10,
      marginBottom: 10,
    }}
  />
);

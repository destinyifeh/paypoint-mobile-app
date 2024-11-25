import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  InteractionManager,
  ToastAndroid,
  View,
} from 'react-native';
import {connect} from 'react-redux';

import {Icon} from 'react-native-elements';
import {TextInput} from 'react-native-gesture-handler';
import ActivityIndicator from '../../../../../../components/activity-indicator';
import ClickableListItem from '../../../../../../components/clickable-list-item';
import Header from '../../../../../../components/header';
import Text from '../../../../../../components/text';
import {
  DEFAULT_API_ERROR_MESSAGE,
  ERROR_STATUS,
  SUCCESS_STATUS,
} from '../../../../../../constants/api';
import {
  MOCK_QUICKTELLER_RESPONSE,
  QUICKTELLER_API_TERMINAL_ID,
} from '../../../../../../constants/api-resources';
import {
  COLOUR_BLUE,
  COLOUR_GREY,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_DARK,
} from '../../../../../../constants/styles';
import Catalog from '../../../../../../services/api/resources/catalog';
import Quickteller from '../../../../../../services/api/resources/quickteller';
import {checkIfWordIncludesAnyOf} from '../../../../../../utils/helpers';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

class SelectProductScene extends React.Component {
  quickteller = new Quickteller();
  catalog = new Catalog();

  renderItem(item, index) {
    return (
      <ClickableListItem
        style={{
          width: SCREEN_WIDTH / 2 - 5,
          height: 185,
          padding: 10,
        }}
        onPressOut={() => {
          this.props.navigation.navigate('ProductPayment', {
            category: this.props.route?.params?.category,
            subCategory: this.props.route?.params?.subCategory,
            product: item,
          });
        }}>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 5,
            elevation: 2,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 15,
            width: '100%',
          }}>
          <Image
            resizeMode="cover"
            source={{uri: item.imageUrl}}
            style={{borderRadius: 2, height: 100, width: 150}}
          />
          <Text
            ellipsizeMode="middle"
            numberOfLines={2}
            style={{
              textAlign: 'center',
            }}>
            {item.name}
          </Text>
        </View>
      </ClickableListItem>
    );
  }

  state = {
    isLoading: true,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });
    });

    if (this.props.route?.params?.searchMode) {
      this.setState({
        isLoading: false,
      });
    } else {
      this.getServices();
    }
  }

  filterServices(services) {
    const {
      blacklisted_biller_ids: blacklistedBillerIds,
      blacklisted_biller_names: blacklistedBillerNames,
    } = this.props.remoteConfig;

    return services.filter(({id, name, description}) => {
      const isBillerIdBlacklisted = blacklistedBillerIds.includes(id);
      if (isBillerIdBlacklisted === true) {
        return false;
      }

      const isBillerNameOrDescriptionBlacklisted = [
        checkIfWordIncludesAnyOf(name || '', blacklistedBillerNames),
        checkIfWordIncludesAnyOf(description || '', blacklistedBillerNames),
      ].includes(true);
      if (isBillerNameOrDescriptionBlacklisted === true) {
        return false;
      }

      return true;
    });
  }

  async getServices(searchTerm) {
    const serviceType = this.props.route.params.subCategory;

    if (searchTerm) {
      !this.state.isLoading &&
        this.setState({
          isLoading: true,
        });

      const {status, response} = await this.catalog.searchForBiller(
        searchTerm,
        QUICKTELLER_API_TERMINAL_ID,
      );

      if (searchTerm !== this.state.searchTerm) {
        return;
      }

      if (status === ERROR_STATUS) {
        this.setState({
          isLoading: false,
          errorOccured: true,
        });

        ToastAndroid.show(DEFAULT_API_ERROR_MESSAGE, ToastAndroid.LONG);

        // this.props.navigation.goBack();

        return;
      } else {
        this.setState({
          isLoading: false,
          errorOccured: false,
          services: this.filterServices(response),
        });

        return;
      }
    }

    let code = null;
    let status = null;
    let response = null;

    if (MOCK_QUICKTELLER_RESPONSE) {
      status = SUCCESS_STATUS;
      response = {
        id: 2,
        name: 'Cable TV Bills',
        description: 'Pay for your cable TV subscriptions here',
        urlName: 'cable-tv-bills',
        services: [
          {
            supportPhoneNumber: null,
            code: 'AYO',
            amountType: 0,
            name: 'Ayo Aremu',
            categoryId: 2,
            categoryName: '',
            urlName: 'ayo',
            description: 'Creating test biller',
            id: 1234,
            imageUrl:
              'https://qt-v5.qa.interswitchng.com/images/Downloaded/cad63810-d771-4cce-9f89-284e87d53756.png',
            imageName: 'Ayo Aremu',
            currencyCode: '566',
            customerIdName: 'Ayo H. Aremu',
            address: null,
            surcharge: 100,
            supportEmail: 'ayo.aremu@interswitchgroup.com',
            customerBearsFee: false,
            additionalMessage: '',
            options: null,
          },
          {
            supportPhoneNumber: null,
            code: 'DAARSAT',
            amountType: 0,
            name: 'DAARSAT Communications',
            categoryId: 2,
            categoryName: '',
            urlName: 'daarsat',
            description: 'DAARSAT',
            id: 113,
            imageUrl:
              'https://qt-v5.qa.interswitchng.com/images/Downloaded/79b605d1-438a-4951-a53c-a356752b9c35.png',
            imageName: 'DAARSAT Communications',
            currencyCode: '566',
            customerIdName: 'Decoder Number',
            address: null,
            surcharge: 0,
            supportEmail: 'oadeoye@interswitchng.com',
            customerBearsFee: false,
            additionalMessage: '',
            options: null,
          },
          {
            supportPhoneNumber: null,
            code: 'DSTVMobi',
            amountType: 0,
            name: 'DSTV Mobile',
            categoryId: 2,
            categoryName: '',
            urlName: 'dstvmobi',
            description: 'Mobile DSTV Payments',
            id: 480,
            imageUrl: 'https://qt-v5.qa.interswitchng.com/images/noimage.png',
            imageName: 'DSTV Mobile',
            currencyCode: '566',
            customerIdName: 'Decoder Number',
            address: null,
            surcharge: 100,
            supportEmail: null,
            customerBearsFee: false,
            additionalMessage: '',
            options: null,
          },
          {
            supportPhoneNumber: null,
            code: 'HiTV',
            amountType: 0,
            name: 'HiTV',
            categoryId: 2,
            categoryName: '',
            urlName: 'hitv',
            description: 'Pay your HiTV bills here',
            id: 121,
            imageUrl: 'https://qt-v5.qa.interswitchng.com/images/noimage.png',
            imageName: 'HiTV',
            currencyCode: '566',
            customerIdName: 'Smart Card Number',
            address: null,
            surcharge: 10000,
            supportEmail: 'support@hitv.com',
            customerBearsFee: false,
            additionalMessage: '',
            options: null,
          },
          {
            supportPhoneNumber: null,
            code: 'IFISD',
            amountType: 0,
            name: 'IFIS DSTV',
            categoryId: 2,
            categoryName: '',
            urlName: 'ifisd',
            description: 'Testing Pricing Discount',
            id: 16783,
            imageUrl: 'https://qt-v5.qa.interswitchng.com/images/noimage.png',
            imageName: 'IFIS DSTV',
            currencyCode: '566',
            customerIdName: 'Decoder Number',
            address: null,
            surcharge: 0,
            supportEmail: null,
            customerBearsFee: false,
            additionalMessage: '',
            options: null,
          },
          {
            supportPhoneNumber: null,
            code: 'IROKO',
            amountType: 0,
            name: 'iROKOtv',
            categoryId: 2,
            categoryName: '',
            urlName: 'irokotv',
            description: 'Iroko Partners UK Limited',
            id: 471,
            imageUrl:
              'https://qt-v5.qa.interswitchng.com/images/Downloaded/d9fbe305-5b1d-4b51-afb6-9cfa522096da.png',
            imageName: 'iROKOtv',
            currencyCode: '566',
            customerIdName: 'Email Address',
            address: null,
            surcharge: 10000,
            supportEmail: 'support@irokotv.com',
            customerBearsFee: false,
            additionalMessage: '',
            options: null,
          },
          {
            supportPhoneNumber: null,
            code: 'MCN',
            amountType: 0,
            name: 'Multichoice Limited',
            categoryId: 2,
            categoryName: '',
            urlName: 'dstv',
            description: 'Pay DSTV bills',
            id: 104,
            imageUrl:
              'https://qt-v5.qa.interswitchng.com/images/Downloaded/72b21de3-d345-4a65-b231-7656a74c646c.png',
            imageName: 'Multichoice Limited',
            currencyCode: '566',
            customerIdName: 'Decoder Number',
            address: null,
            surcharge: 7700,
            supportEmail: 'application.development@interswitchng.com',
            customerBearsFee: false,
            additionalMessage: '',
            options: null,
          },
          {
            supportPhoneNumber: null,
            code: 'PAYDirect2',
            amountType: 0,
            name: 'Multichoice PAYDirect2',
            categoryId: 2,
            categoryName: '',
            urlName: 'MultichoicePAYDirect2',
            description: null,
            id: 16918,
            imageUrl: 'https://qt-v5.qa.interswitchng.com/images/noimage.png',
            imageName: 'Multichoice PAYDirect2',
            currencyCode: '566',
            customerIdName: 'SmartCard No',
            address: null,
            surcharge: 0,
            supportEmail: null,
            customerBearsFee: false,
            additionalMessage: '',
            options: null,
          },
          {
            supportPhoneNumber: null,
            code: 'MyTV',
            amountType: 0,
            name: 'MyTV',
            categoryId: 2,
            categoryName: '',
            urlName: 'mytv',
            description: 'Pay MyTV bills',
            id: 112,
            imageUrl:
              'https://qt-v5.qa.interswitchng.com/images/Downloaded/839cec5d-0f2e-4245-962e-827bc33f1198.png',
            imageName: 'MyTV',
            currencyCode: '566',
            customerIdName: 'Decoder numbers',
            address: null,
            surcharge: 0,
            supportEmail: 'support@interswitchng.com',
            customerBearsFee: false,
            additionalMessage: '',
            options: null,
          },
          {
            supportPhoneNumber: null,
            code: 'PGV',
            amountType: 0,
            name: 'Pebble Gift ',
            categoryId: 2,
            categoryName: '',
            urlName: 'pebblegifts',
            description: 'gift voucher payments',
            id: 128,
            imageUrl:
              'https://qt-v5.qa.interswitchng.com/images/Downloaded/4a7e0c96-8cc1-4709-a338-81fc76d932af.png',
            imageName: 'Pebble Gift ',
            currencyCode: '566',
            customerIdName: 'Phone Number',
            address: null,
            surcharge: 10000,
            supportEmail:
              'customer.support@pebblegifts.com, support@interswitchng.com',
            customerBearsFee: false,
            additionalMessage: '',
            options: null,
          },
        ],
      };
    } else {
      const getServicesResponseObj = await this.catalog.getServices(
        serviceType.id,
        QUICKTELLER_API_TERMINAL_ID,
      );
      code = getServicesResponseObj.code;
      status = getServicesResponseObj.status;
      response = getServicesResponseObj.response;

      console.log({getServicesResponseObj});
    }

    if (status === ERROR_STATUS) {
      this.setState({
        isLoading: false,
        errorOccured: true,
      });

      ToastAndroid.show(DEFAULT_API_ERROR_MESSAGE, ToastAndroid.LONG);

      return;
    }

    this.setState({
      isLoading: false,
      services: this.filterServices(response.services),
    });
  }

  render() {
    const wasSearchModeNavigatedInto =
      this.props.route.params.searchMode || null;

    const wasSearchModeSet = this.state.searchMode;
    const searchMode = wasSearchModeNavigatedInto || wasSearchModeSet;

    const {navigation} = this.props;

    const emptyContent = () => {
      if (searchMode) {
        return (
          <View
            style={{
              alignItems: 'center',
              flex: 1,
              padding: 16,
              justifyContent: 'center',
            }}>
            <Icon
              color={COLOUR_GREY}
              name={'search'}
              size={64}
              type="material"
              underlayColor="transparent"
            />
            <Text center style={{marginTop: 12}}>
              Type a term in the search bar above to search for billers.
            </Text>
          </View>
        );
      } else {
        return (
          <Text center style={{marginTop: 12}}>
            No results found.
          </Text>
        );
      }
    };

    const screenContent = () =>
      this.state.services?.length ? (
        <FlatList
          contentContainerStyle={{
            paddingHorizontal: 5,
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'flex-start', // if you want to fill rows left to right
            justifyContent: 'space-evenly',
          }}
          data={this.state.services}
          keyExtractor={(item, index) => item + index}
          renderItem={({item, index}) => this.renderItem(item, index)}
        />
      ) : (
        emptyContent()
      );

    return (
      <View
        style={{
          backgroundColor: '#F3F3F4',
          flex: 1,
        }}>
        <Header
          centerComponent={
            searchMode ? (
              <TextInput
                autoFocus
                onSubmitEditing={() => {
                  if (!this.state.services) {
                    !this.getServices(this.state.searchTerm);
                  }
                }}
                onChangeText={searchTerm => {
                  setTimeout(() => {
                    this.setState({searchTerm});
                    this.getServices(searchTerm);
                  }, 0);
                }}
                onChangeTextOld={searchTerm => {
                  this.setState({searchTerm});
                  // setTimeout(() => this.getServices(), 500);
                }}
                style={{
                  borderBottomColor: COLOUR_GREY,
                  borderBottomWidth: 2,
                  width: '100%',
                }}
                placeholder="Search for biller (e.g DStv)"
                text="Search:"
              />
            ) : null
          }
          containerStyle={{
            backgroundColor: 'transparent',
          }}
          navigationIconColor={COLOUR_WHITE}
          leftComponent={
            <Icon
              color={COLOUR_RED}
              underlayColor="transparent"
              name={searchMode ? 'close' : 'chevron-left'}
              size={40}
              type="material"
              onPress={() => {
                if (wasSearchModeNavigatedInto) {
                  return this.props.navigation.goBack();
                } else if (searchMode) {
                  this.setState({
                    searchMode: false,
                    services: null,
                  });
                  this.getServices();
                } else {
                  this.props.navigation.goBack();
                }
              }}
            />
          }
          rightComponent={
            !searchMode ? (
              <ClickableListItem
                onPress={() =>
                  this.setState({
                    searchMode: true,
                  })
                }
                onPressOld={() =>
                  this.state.searchMode
                    ? this.state.searchTerm
                      ? navigation.replace('SelectProduct', {
                          category: 'Pay a Bill',
                          searchTerm: this.state.searchTerm,
                        })
                      : null
                    : this.setState({
                        searchMode: true,
                      })
                }>
                <Icon
                  color={`${COLOUR_BLUE}${
                    this.state.searchMode && !this.state.searchTerm
                      ? '60'
                      : 'ff'
                  }`}
                  name={!this.state.searchMode ? 'search' : 'arrow-forward'}
                  size={32}
                  type="material"
                  underlayColor="transparent"
                />
              </ClickableListItem>
            ) : null
          }
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_DARK,
          }}
          title={
            this.props.route?.params?.subCategory?.name ||
            this.props.route?.params?.category
          }
          titleStyle={{
            color: COLOUR_GREY,
            fontWeight: 'bold',
          }}
        />

        {!this.state.animationsDone || this.state.isLoading ? (
          <ActivityIndicator />
        ) : (
          screenContent()
        )}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    remoteConfig: state.tunnel.remoteConfig,
  };
}

export default connect(mapStateToProps, null)(SelectProductScene);

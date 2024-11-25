import React from 'react';
import {
  FlatList,
  InteractionManager,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from 'react-native-elements';
import RBSheet from 'react-native-raw-bottom-sheet';
import {connect} from 'react-redux';
import ActivityIndicator from '../../../../../../components/activity-indicator';
import ClickableListItem from '../../../../../../components/clickable-list-item';
import Header from '../../../../../../components/header';
import Text from '../../../../../../components/text';
import {BILLS, MMO, RECHARGE, SEND_MONEY} from '../../../../../../constants';
import {
  ENVIRONMENT,
  PRODUCTION,
} from '../../../../../../constants/api-resources';
import {
  COLOUR_BLUE,
  COLOUR_GREY,
  COLOUR_LIGHT_GREY,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../../../../constants/styles';
import Services from '../../../../../../fixtures/services';
import FeatureFlag from '../../../../../../fragments/feature-flag';
import ServiceTypes from '../../types';

const MMO_SUB_CATEGORY = Services[MMO];
MMO_SUB_CATEGORY.id = ENVIRONMENT === PRODUCTION ? 18 : 20;

class SelectSubCategoryScene extends React.Component {
  discColors = [
    'gold',
    COLOUR_BLUE,
    COLOUR_RED,
    '#0EBEE1',
    '#F58550',
    '#2E39EF',
  ];
  state = {
    selectedSubCategory: null,
  };

  constructor() {
    super();

    this.getSubCategoriesList = this.getSubCategoriesList.bind(this);
    this.onListItemClick = this.onListItemClick.bind(this);
    this.selectOption = this.selectOption.bind(this);
    this.selectSubCategory = this.selectSubCategory.bind(this);
    this.showOptions = this.showOptions.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });
    });
  }

  checkIfSubCategoryItemIsDisabled({name}) {
    if (this.props.blacklisted_biller_categories.includes(name.toLowerCase())) {
      return true;
    }

    switch (name) {
      case 'Sell Airtime':
        return !this.props.enable_sell_airtime;
      case 'Sell Data':
        return !this.props.enable_sell_data;
      case 'Sell EPin':
        return !this.props.enable_sell_epin;
      default:
        break;
    }
  }

  selectOption(option) {
    this.optionsSheet.close();
    this.selectSubCategory(this.state.selectedSubCategory, option);
  }

  showOptions(subCategory) {
    this.optionsSheet.open();
  }

  onListItemClick(subCategory) {
    this.setState({
      selectedSubCategory: subCategory,
    });

    if (subCategory.options) {
      this.showOptions(subCategory);
    } else {
      this.selectSubCategory(subCategory);
    }
  }

  renderItem(item, index) {
    const isDisabled = this.checkIfSubCategoryItemIsDisabled(item);
    if (isDisabled) {
      return false;
    }

    return (
      <FeatureFlag {...item.feature_props}>
        {() => (
          <ClickableListItem
            disabled={isDisabled}
            key={index}
            onPressOut={() => (isDisabled ? null : this.onListItemClick(item))}
            style={{
              backgroundColor: 'white',
              flexDirection: 'row',
              marginBottom: 5,
              opacity: isDisabled ? 0.2 : 1,
              paddingVertical: 10,
            }}>
            <View
              style={{
                flex: 0.2,
                justifyContent: 'space-evenly',
                paddingLeft: 20,
              }}>
              <Icon name="disc" color={COLOUR_BLUE} type="feather" size={20} />
            </View>

            <View
              style={{
                flex: 0.6,
                justifyContent: 'space-evenly',
                paddingLeft: 5,
              }}>
              <Text black>{item.name}</Text>
            </View>

            <View
              style={{
                alignItems: 'center',
                flex: 0.2,
                justifyContent: 'center',
              }}>
              <Icon
                name="chevron-right"
                color={'#B4B7BF'}
                type="feather"
                size={30}
              />
            </View>
          </ClickableListItem>
        )}
      </FeatureFlag>
    );
  }

  selectSubCategory(item, option) {
    const category = this.props.route.params.category;

    if (category === RECHARGE) {
      this.props.navigation.navigate('ProductPayment', {
        category,
        subCategory: item,
        option,
      });

      return;
    }

    if (category === SEND_MONEY) {
      if (item.id === 5) {
        this.props.navigation.navigate('SelectProduct', {
          category: MMO,
          subCategory: MMO_SUB_CATEGORY,
        });
      } else {
        this.props.navigation.navigate('ProductPayment', {
          category,
          subCategory: item,
          option,
        });
      }

      return;
    }

    if (category === BILLS) {
      this.props.navigation.navigate('SelectProduct', {
        category,
        subCategory: item,
        option,
      });

      return;
    }

    this.props.navigation.navigate('ProductPayment', {
      category,
      subCategory: item,
      option,
    });
  }

  render() {
    const {navigation} = this.props;
    const {selectedSubCategory} = this.state;

    if (!this.state.animationsDone) {
      return <ActivityIndicator />;
    }

    const category = this.props.route.params.category;

    const thisServiceType = new ServiceTypes[category]();

    return (
      <View
        style={{
          backgroundColor: '#F3F3F4',
          flex: 1,
        }}>
        <RBSheet
          animationType={'fade'}
          closeOnDragDown={true}
          closeOnPressBack={true}
          closeOnPressMask={true}
          ref={sheet => (this.optionsSheet = sheet)}>
          <View
            style={{
              padding: 20,
            }}>
            <Text bold grey style={{marginBottom: 12}}>
              Select Option
            </Text>
            <FlatList
              data={selectedSubCategory?.options}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => this.selectOption(item.value)}
                  style={{
                    borderColor: COLOUR_LIGHT_GREY,
                    borderBottomWidth: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 20,
                  }}>
                  <Text big black>
                    {item.name}
                  </Text>
                  <Icon
                    color={COLOUR_GREY}
                    name="chevron-right"
                    type="feather"
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        </RBSheet>
        <Header
          centerComponent={
            this.state.searchMode ? (
              <TextInput
                autoFocus
                onSubmitEditing={() =>
                  navigation.navigate('SelectProduct', {
                    category: BILLS,
                    searchTerm: this.state.searchTerm,
                  })
                }
                onChangeText={searchTerm =>
                  this.setState({
                    searchTerm,
                  })
                }
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
            backgroundColor: COLOUR_BLUE,
          }}
          navigationIconColor={COLOUR_WHITE}
          leftComponent={
            <Icon
              color={COLOUR_WHITE}
              underlayColor="transparent"
              name={this.state.searchMode ? 'close' : 'chevron-left'}
              size={40}
              type="material"
              onPress={() =>
                this.state.searchMode
                  ? this.setState({
                      searchMode: false,
                    })
                  : this.props.navigation.goBack()
              }
            />
          }
          rightComponent={
            <ClickableListItem
              onPress={() =>
                navigation.navigate('SelectProduct', {
                  category: BILLS,
                  searchMode: true,
                })
              }>
              <Icon
                color={`${COLOUR_WHITE}${
                  this.state.searchMode && !this.state.searchTerm ? '60' : 'ff'
                }`}
                name={!this.state.searchMode ? 'search' : 'arrow-forward'}
                size={32}
                type="material"
                underlayColor="transparent"
              />
            </ClickableListItem>
          }
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_LIGHT,
          }}
          title={thisServiceType.friendlyName}
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
          }}
        />

        <FlatList
          data={this.getSubCategoriesList()}
          keyExtractor={(item, index) => item + index}
          renderItem={({item, index, section}) => this.renderItem(item, index)}
          style={{
            //paddingTop: 20,
            marginTop: 20,
          }}
        />
      </View>
    );
  }

  getSubCategoriesList() {
    const category = this.props.route.params.category;

    if (category === 'send-money') {
      return Services['send-money'];
    }

    return new ServiceTypes[category]().subCategories;
  }
}

function mapStateToProps(state) {
  return {
    blacklisted_biller_categories:
      state.tunnel.remoteConfig.blacklisted_biller_categories,
    account_opening_pilot_group:
      state.tunnel.remoteConfig.account_opening_pilot_group,
    enable_sell_airtime: state.tunnel.remoteConfig.enable_sell_airtime,
    enable_sell_data: state.tunnel.remoteConfig.enable_sell_data,
    enable_sell_epin: state.tunnel.remoteConfig.enable_sell_epin,
    isNavigatorVisible: state.navigation.isNavigatorVisible,
    userIsAnInternalAgent: state.tunnel.remoteConfig.userIsAnInternalAgent,
    // pendingUrl: state.navigation.pendingUrl
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideNavigator: () => dispatch(hideNavigator()),
    showNavigator: () => dispatch(showNavigator()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectSubCategoryScene);

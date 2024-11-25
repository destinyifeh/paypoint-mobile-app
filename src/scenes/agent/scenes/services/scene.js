import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {connect} from 'react-redux';
import ClickableListItem from '../../../../components/clickable-list-item';
import Header from '../../../../components/header';
import GradientIcon from '../../../../components/icons/gradient-icon';
import Text from '../../../../components/text';
import {
  AGENT,
  BILLS,
  CASH_IN,
  MMO,
  RECHARGE,
  SEND_MONEY,
  SUPER_AGENT,
  USER,
  WITHDRAW,
} from '../../../../constants';
import {
  ENVIRONMENT,
  ENVIRONMENT_IS_TEST,
  PRODUCTION,
} from '../../../../constants/api-resources';
import {
  COLOUR_BLUE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../../constants/styles';
import Services from '../../../../fixtures/services.json';
import FeatureFlag, {
  FeatureFlagNewBadge,
} from '../../../../fragments/feature-flag';
import {
  hideNavigator,
  showNavigator,
} from '../../../../services/redux/actions/navigation';
import {loadData} from '../../../../utils/storage';
import DisabledScene from '../../../misc/disabled-scene';

const CASH_IN_SUB_CATEGORY = Services[CASH_IN];
CASH_IN_SUB_CATEGORY.id = ENVIRONMENT === PRODUCTION ? 18 : 20;

const DISTRIBUTE_SERVICE_SUB_CATEGORY = Services['send-money'].find(
  ({name}) => name === 'Distribute',
);

const MMO_SUB_CATEGORY = Services[MMO];

class ItemRow extends React.Component {
  render() {
    const {isNew} = this.props;

    return (
      <ClickableListItem
        disabled={this.props.disabled}
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          opacity: this.props.disabled ? 0.2 : 1,
          ...this.props.style,
        }}
        onPressOut={this.props.onPressOut}>
        <GradientIcon
          icon={this.props.icon}
          colors={this.props.colors}
          style={{
            marginRight: 20,
          }}
        />
        <Text>{this.props.title}</Text>
        {isNew && (
          <FeatureFlagNewBadge
            style={{
              backgroundColor: '#DC4437',
              marginLeft: 8,
              paddingVertical: 2,
              // position: 'absolute',
              // right: -4,
              // top: -4,
            }}
            textStyle={{
              textTransform: 'uppercase',
            }}
          />
        )}
      </ClickableListItem>
    );
  }
}

function ServicesScene(props) {
  const {
    enable_account_opening: enableAccountOpeningRemoteConfig,
    account_opening_pilot_group,
    enable_card_linking: enableCardLinkingRemoteConfig,
    enable_send_money,
    enable_services,
    enable_sell_airtime,
    enable_sell_data,
    enable_pay_bills,
  } = props.remoteConfig;

  const [enable_card_linking, setEnableCardLinking] = useState(
    enableCardLinkingRemoteConfig,
  );

  const [enable_account_opening, setEnableAccountOpening] = useState(
    enableAccountOpeningRemoteConfig,
  );

  useEffect(() => {
    loadData(USER).then(userData => {
      const userData_ = JSON.parse(userData);

      setEnableAccountOpening(
        enableAccountOpeningRemoteConfig ||
          account_opening_pilot_group.includes(userData_.username),
      );

      setEnableCardLinking(
        enableCardLinkingRemoteConfig ||
          account_opening_pilot_group.includes(userData_.username),
      );
    });
  }, []);

  return (
    <View
      onTouchEnd={() =>
        props.isNavigatorVisible ? props.hideNavigator() : null
      }
      style={{
        backgroundColor: COLOUR_WHITE,
        flex: 1,
      }}>
      <Header
        containerStyle={{
          backgroundColor: COLOUR_BLUE,
        }}
        navigationIconColor={COLOUR_WHITE}
        hideNavigationMenu={props.hideNavigator}
        showNavigationMenu={props.showNavigator}
        statusBarProps={{
          backgroundColor: 'transparent',
          barStyle: CONTENT_LIGHT,
        }}
        title="Services"
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: 'bold',
        }}
        withNavigator
      />

      {enable_services === false ? (
        <DisabledScene sceneName="Services" />
      ) : (
        <ScrollView
          contentContainerStyle={{
            padding: 30,
          }}>
          <FeatureFlag
            requiredDomain={AGENT}
            uid="pay-a-bill-services-scene-list-item">
            {() => (
              <ItemRow
                colors={['#9679F9', '#9D55F5']}
                disabled={enable_pay_bills === false}
                icon="credit-card"
                style={{
                  marginBottom: 30,
                }}
                title="Pay a Bill"
                onPressOut={() =>
                  props.navigation.navigate('SelectSubCategory', {
                    category: BILLS,
                  })
                }
              />
            )}
          </FeatureFlag>
          <FeatureFlag
            requiredDomain={AGENT}
            uid="airtime-and-data-services-scene-list-item">
            {() => (
              <ItemRow
                colors={['#6FEBF5', '#0BBDE0']}
                disabled={
                  enable_sell_airtime === false && enable_sell_data === false
                }
                icon="tag"
                style={{
                  marginBottom: 30,
                }}
                title="Sell Airtime & Data"
                onPressOut={() =>
                  props.navigation.navigate('SelectSubCategory', {
                    category: RECHARGE,
                  })
                }
              />
            )}
          </FeatureFlag>
          <FeatureFlag
            requiredDomain={AGENT}
            targetVersion={'1.0.20'}
            uid="cash-out-services-scene-list-item">
            {featureProps => (
              <ItemRow
                colors={['#F64F5A', '#EF3430']}
                // disabled={enable_cash_in === false}
                icon="money"
                isNew={featureProps.isNew}
                style={{
                  marginBottom: 30,
                }}
                title="Cardless Cash Out"
                onPressOut={() =>
                  props.navigation.navigate('SelectSubCategory', {
                    category: WITHDRAW,
                  })
                }
              />
            )}
          </FeatureFlag>

          <FeatureFlag requiredDomain={AGENT}>
            {() => (
              <ItemRow
                colors={['#F9BE7A', '#F58953']}
                disabled={enable_send_money === false}
                icon="money"
                style={{
                  marginBottom: 30,
                }}
                title="Send Money"
                onPressOut={() =>
                  props.navigation.navigate('SelectSubCategory', {
                    category: SEND_MONEY,
                  })
                }
              />
            )}
          </FeatureFlag>

          <FeatureFlag requiredDomain={AGENT} uid="pay-mmo-service-thumbnail">
            {featureProps => (
              <ItemRow
                colors={['#FFA69E', '#861657']}
                // disabled={enable_cash_in === false}
                icon="credit-card"
                isNew={featureProps.isNew}
                style={{
                  marginBottom: 30,
                }}
                title="Transfer to MMO"
                onPressOut={() =>
                  props.navigation.navigate('SelectProduct', {
                    category: MMO,
                    subCategory: MMO_SUB_CATEGORY,
                  })
                }
              />
            )}
          </FeatureFlag>

          <FeatureFlag
            requiredDomain={AGENT}
            uid="register-cac-service-thumbnail">
            {featureProps => (
              <ItemRow
                colors={['#2CBC65', '#2CBC65']}
                // disabled={enable_cash_in === false}
                icon="briefcase"
                isNew={featureProps.isNew}
                style={{
                  marginBottom: 30,
                }}
                title="Register with CAC"
                onPressOut={() =>
                  props.navigation.replace('CacBusinessNameDetails', {
                    cacRegType: 'assisted',
                  })
                }
              />
            )}
          </FeatureFlag>

          {Boolean(enable_account_opening) && (
            <FeatureFlag
              requiredDomains={[AGENT, SUPER_AGENT]}
              uid="account-opening-services-scene-list-item">
              {() => (
                <ItemRow
                  colors={['#5378F7', '#2C35EE']}
                  disabled={enable_account_opening === false}
                  icon="user"
                  style={{
                    marginBottom: 30,
                  }}
                  title="Open an Account"
                  onPressOut={() =>
                    props.navigation.navigate('AccountOpeningForm', {
                      category: 'Open an Account',
                    })
                  }
                />
              )}
            </FeatureFlag>
          )}
          {(Boolean(enable_card_linking) || ENVIRONMENT_IS_TEST) && (
            <FeatureFlag
              requiredDomains={[AGENT, SUPER_AGENT]}
              uid="card-linking-services-scene-list-item">
              {() => (
                <ItemRow
                  colors={['#304864', '#001824']}
                  disabled={
                    ENVIRONMENT_IS_TEST ? false : enable_card_linking === false
                  }
                  icon="link"
                  style={{
                    marginBottom: 30,
                  }}
                  title="Link a Card"
                  onPressOut={() => props.navigation.navigate('CardLinking')}
                />
              )}
            </FeatureFlag>
          )}
          <FeatureFlag requiredDomain={SUPER_AGENT} uid="services-1">
            {() => (
              <ItemRow
                colors={['#F9BE7A', '#F58953']}
                disabled={enable_send_money === false}
                icon="money"
                style={{
                  marginBottom: 30,
                }}
                title="Distribute"
                onPressOut={() =>
                  props.navigation.navigate('ProductPayment', {
                    category: SEND_MONEY,
                    subCategory: DISTRIBUTE_SERVICE_SUB_CATEGORY,
                  })
                }
              />
            )}
          </FeatureFlag>

          {/* <ItemRow 
          colors={['#5378F7', '#2C35EE']} 
          icon="user"
          style={{
            marginBottom: 30
          }}
          title="Open an Account"
          onPressOut={() => props.navigation.navigate('SelectSubCategory', {
            category: 'Open an Account'
          })} /> */}
        </ScrollView>
      )}
    </View>
  );
}

function mapStateToProps(state) {
  return {
    isNavigatorVisible: state.navigation.isNavigatorVisible,
    remoteConfig: state.tunnel.remoteConfig,
    // pendingUrl: state.navigation.pendingUrl
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideNavigator: () => dispatch(hideNavigator()),
    showNavigator: () => dispatch(showNavigator()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ServicesScene);

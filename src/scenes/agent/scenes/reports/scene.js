import React from 'react';
import {InteractionManager, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import ClickableListItem from '../../../../components/clickable-list-item';
import Header from '../../../../components/header';
import GradientIcon from '../../../../components/icons/gradient-icon';
import Text from '../../../../components/text';
import {AGENT} from '../../../../constants';
import {
  SHOW_AGGREGATOR_COMMISSION,
  SHOW_BANK_NETWORK,
  SHOW_CRM,
} from '../../../../constants/api-resources';
import {
  COLOUR_BLUE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../../constants/styles';
import FeatureFlag, {
  FeatureFlagNewBadge,
} from '../../../../fragments/feature-flag';
import {
  hideNavigator,
  showNavigator,
} from '../../../../services/redux/actions/navigation';
import DisabledScene from '../../../misc/disabled-scene';

class ItemRow extends React.Component {
  render() {
    const {isNew} = this.props;

    return (
      <ClickableListItem
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          ...this.props.style,
        }}
        onPressOut={this.props.onPressOut}>
        <GradientIcon
          colors={this.props.colors}
          icon={this.props.icon}
          style={{
            marginRight: 20,
          }}
        />
        <Text>{this.props.title}</Text>
        {isNew && (
          <FeatureFlagNewBadge
            style={{position: 'absolute', right: -4, top: -4}}
          />
        )}
      </ClickableListItem>
    );
  }
}

class ReportsScene extends React.Component {
  static navigationOptions = {
    tabBarIcon: ({focused, horizontal, tintColor}) => {
      let IconComponent = Icon;
      let iconName;

      return (
        <IconComponent
          name="bar-chart-2"
          type="feather"
          size={25}
          color={tintColor}
        />
      );
    },
    title: 'My Reports',
  };

  state = {};

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      // 2: Component is done animating
      // 3: Start fetching the team
      this.setState({
        animationsDone: true,
      });
    });
  }

  render() {
    const {enable_reports} = this.props.remoteConfig;

    // if (!this.state.animationsDone) {
    //   return <ActivityIndicator />;
    //   // return <View />;
    // }

    return (
      <View
        onTouchEnd={() =>
          this.props.isNavigatorVisible ? this.props.hideNavigator() : null
        }
        style={{
          backgroundColor: 'white',
          flex: 1,
        }}>
        <Header
          containerStyle={{
            backgroundColor: COLOUR_BLUE,
          }}
          navigationIconColor={COLOUR_WHITE}
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_LIGHT,
          }}
          title="My Reports"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
          }}
          withNavigator
        />

        {enable_reports === false ? (
          <DisabledScene sceneName="Reports" />
        ) : (
          <ScrollView
            contentContainerStyle={{
              padding: 30,
            }}>
            <ItemRow
              colors={['#F9BE7A', '#F6935A']}
              icon="exchange"
              style={{
                marginBottom: 30,
              }}
              title="Transactions"
              onPressOut={() =>
                this.props.navigation.navigate('ReportTransactions')
              }
            />

            <ItemRow
              colors={['#2CBC65', '#2CBC65']}
              icon="briefcase"
              style={{
                marginBottom: 30,
              }}
              title="CAC Report"
              onPressOut={() => this.props.navigation.navigate('CacReports')}
            />
            <ItemRow
              colors={['#9578F8', '#9E53F5']}
              icon="bar-chart"
              style={{
                marginBottom: 30,
              }}
              title="Services Report"
              onPressOut={() =>
                this.props.navigation.navigate('ReportServices')
              }
            />
            {SHOW_BANK_NETWORK && (
              <ItemRow
                colors={['#A71D31', '#3F0D12']}
                icon="bar-chart"
                style={{
                  marginBottom: 30,
                }}
                title="Bank Network"
                onPressOut={() => this.props.navigation.navigate('BankNetwork')}
              />
            )}
            <ItemRow
              colors={['#FE515A', '#EE312A']}
              icon="exchange"
              style={{
                marginBottom: 30,
              }}
              title="Commissions Report"
              onPressOut={() =>
                this.props.navigation.navigate('CommissionsEarned')
              }
            />
            {SHOW_AGGREGATOR_COMMISSION && (
              <ItemRow
                colors={['#FE515A', '#EE312A']}
                icon="exchange"
                style={{
                  marginBottom: 30,
                }}
                title="Aggregator Commissions Report"
                onPressOut={() =>
                  this.props.navigation.navigate('AggregatorCommissionsEarned')
                }
              />
            )}

            {/* <FeatureFlag targetVersion="1.0.14" uid="statement-of-commissions-account">
          {({isNew, onUseFeature}) => <ItemRow 
          colors={['#FE515A', '#EE312A']} 
          icon="exchange"
          style={{
            marginBottom: 30
          }} 
          title="Commissions Report"
          onPressOut={() => {
            this.props.navigation.navigate('StatementOfAccount',  {category: 'Commissions', sortDesc: 'descending', isHistoricalData: false})
            isNew && onUseFeature();
          }} />}
        </FeatureFlag> */}
            <FeatureFlag
              targetVersion="1.0.14"
              uid="statement-of-transactions-account">
              {({isNew, onUseFeature}) => (
                <ItemRow
                  colors={['#20D8FE', '#00B8DE']}
                  icon="file-text"
                  isNew={isNew}
                  style={{
                    marginBottom: 30,
                  }}
                  title="Statement of Transactions Account"
                  onPressOut={() => {
                    this.props.navigation.navigate('StatementOfAccount', {
                      category: 'Transactions',
                      isHistoricalData: false,
                    });
                    isNew && onUseFeature();
                  }}
                />
              )}
            </FeatureFlag>
            <FeatureFlag
              targetVersion="1.0.14"
              uid="statement-of-commissions-account">
              {({isNew, onUseFeature}) => (
                <ItemRow
                  colors={['#007992', '#008eab']}
                  icon="file-text"
                  isNew={isNew}
                  style={{
                    marginBottom: 30,
                  }}
                  title="Statement of Commissions Account"
                  onPressOut={() => {
                    this.props.navigation.navigate('StatementOfAccount', {
                      category: 'Commissions',
                      isHistoricalData: false,
                    });
                    isNew && onUseFeature();
                  }}
                />
              )}
            </FeatureFlag>
            <FeatureFlag requiredDomain={AGENT} uid="reports">
              {() => (
                <ItemRow
                  colors={['#20627F', '#00425F']}
                  icon="clock-o"
                  style={{
                    marginBottom: 30,
                  }}
                  title="Historical Transactions"
                  onPressOut={() =>
                    this.props.navigation.navigate('ReportTransactions', {
                      isHistoricalData: true,
                    })
                  }
                />
              )}
            </FeatureFlag>
            {SHOW_CRM && (
              <ItemRow
                colors={['#233329', '#63D471']}
                icon="ticket"
                style={{
                  marginBottom: 30,
                }}
                title="Issue History"
                onPressOut={() =>
                  this.props.navigation.navigate('IssueHistory')
                }
              />
            )}
          </ScrollView>
        )}
      </View>
    );
  }
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

export default connect(mapStateToProps, mapDispatchToProps)(ReportsScene);

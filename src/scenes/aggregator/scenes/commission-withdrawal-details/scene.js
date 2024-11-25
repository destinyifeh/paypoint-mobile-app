import React from 'react';
import {Animated, View} from 'react-native';
import {Icon} from 'react-native-elements';
import AnimatedNumber from '../../../../components/animated-number';
import Button from '../../../../components/button';
import Header from '../../../../components/header';
import Text from '../../../../components/text';
import {
  COLOUR_BLUE,
  COLOUR_DARK_RED,
  COLOUR_GREEN,
  COLOUR_GREY,
  COLOUR_LIGHT_GREEN,
  COLOUR_LIGHT_YELLOW,
  COLOUR_WHITE,
  COLOUR_YELLOW,
  CONTENT_LIGHT,
  LIGHT_RED,
} from '../../../../constants/styles';
import amountField from '../../../../fragments/amount-field';
import {convertNgkToNgn} from '../../../../utils/converters/currencies';

class FailedComponent extends React.Component {
  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          width: 75,
          height: 28,
          backgroundColor: LIGHT_RED,
          justifyContent: 'center',
          paddingVertical: 5,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: COLOUR_DARK_RED,
        }}>
        <View style={{marginTop: 3}}>
          <Icon
            color={COLOUR_DARK_RED}
            name="fiber-manual-record"
            size={9}
            type="material"
            underlayColor="transparent"
          />
        </View>

        <Text style={{fontSize: 14, color: COLOUR_DARK_RED}}>Failed</Text>
      </View>
    );
  }
}
class SuccessComponent extends React.Component {
  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          width: 103,
          height: 28,
          backgroundColor: COLOUR_LIGHT_GREEN,
          justifyContent: 'center',
          paddingVertical: 5,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: COLOUR_GREEN,
        }}>
        <View style={{marginTop: 3}}>
          <Icon
            color={COLOUR_GREEN}
            name="fiber-manual-record"
            size={9}
            type="material"
            underlayColor="transparent"
          />
        </View>

        <Text style={{fontSize: 14, color: COLOUR_GREEN}}>Successful</Text>
      </View>
    );
  }
}

class PendingComponent extends React.Component {
  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          width: 80,
          height: 28,
          backgroundColor: COLOUR_LIGHT_YELLOW,
          justifyContent: 'center',
          paddingVertical: 5,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: COLOUR_YELLOW,
        }}>
        <View style={{marginTop: 3}}>
          <Icon
            color={COLOUR_YELLOW}
            name="fiber-manual-record"
            size={9}
            type="material"
            underlayColor="transparent"
          />
        </View>

        <Text style={{fontSize: 14, color: COLOUR_YELLOW}}>Pending</Text>
      </View>
    );
  }
}

class AggregatorCommissionsWithdrawalDetails extends React.Component {
  //   state = {
  //     scrollY: new Animated.Value(0),
  //   };

  constructor(props) {
    super(props);

    this.state = {
      scrollY: new Animated.Value(0),
      withdrawalDetails: {},
    };
  }

  async componentDidMount() {
    const withdrawalDetails = this.props.route.params.withdrawal || {};

    this.setState(prevState => ({
      withdrawalDetails: {
        ...prevState.withdrawalDetails,
        ...withdrawalDetails,
      },
    }));

    console.log('withdrawal', withdrawal);
    console.log('withdrawalState', this.state.withdrawalDetails);
  }

  render() {
    const {withdrawalDetails} = this.state;
    const {journalEntryDate, debitAmount, status, uniqueReference} =
      withdrawalDetails;

    // const { withdrawalStatus } = this.props;
    let statusComponent;

    switch (status) {
      case 'Successful':
        statusComponent = <SuccessComponent />;
        break;
      case 'Pending':
        statusComponent = <PendingComponent />;
        break;
      case 'Failed':
        statusComponent = <FailedComponent />;
        break;
      default:
        statusComponent = <Text>Unknown Status</Text>;
    }
    return (
      <View
        style={{
          flex: 1,
        }}>
        <Header
          containerStyle={{
            backgroundColor: COLOUR_BLUE,
          }}
          navigationIconColor={COLOUR_WHITE}
          leftComponent={
            <Icon
              color={COLOUR_WHITE}
              name="chevron-left"
              onPress={() => this.props.navigation.goBack()}
              size={40}
              type="material"
              underlayColor="transparent"
            />
          }
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_LIGHT,
          }}
          title="Withdrawal Details"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
          }}
        />
        <Animated.ScrollView
          onScroll={Animated.event(
            [
              {
                nativeEvent: {contentOffset: {y: this.state.scrollY}},
              },
            ],
            {
              useNativeDriver: true,
            },
          )}
          scrollEventThrottle={16}>
          <View style={{flexDirection: 'column'}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 20,
              }}>
              <Text semibold>Withdrawal Reference</Text>
              <Text semibold>{uniqueReference}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 20,
              }}>
              <Text semibold>Withdrawal date</Text>
              <Text semibold>{journalEntryDate}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 20,
              }}>
              <Text semibold>Destination</Text>
              <Text semibold>Transaction Wallet</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 20,
              }}>
              <Text semibold>Amount</Text>
              <AnimatedNumber
                blue
                steps={1}
                formatter={value =>
                  amountField('NGN', convertNgkToNgn(value || '0.00'))
                }
                semiBold
                style={{
                  fontSize: 16,
                  lineHeight: 32,
                }}
                value={debitAmount}
              />
              {/* <Text semibold>{debitAmount}</Text> */}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 20,
              }}>
              <Text semibold>Status</Text>
              {statusComponent}
            </View>

            <View style={{paddingTop: 40, paddingHorizontal: 20}}>
              {status === 'Failed' && (
                <Button
                  onPress={() => {}}
                  title="Try again"
                  buttonStyle={{backgroundColor: COLOUR_BLUE}}
                  containerStyle={{
                    backgroundColor: COLOUR_BLUE,
                    marginVertical: 30,
                  }}
                  // disabled={this.state.inputs?.length === 0 || this.state.isLoading}
                  loading={this.state.isLoading}
                />
              )}
            </View>
            <View style={{paddingHorizontal: 20}}>
              <Button
                onPress={() => this.props.navigation.goBack()}
                title="Close"
                buttonStyle={{backgroundColor: COLOUR_GREY}}
                containerStyle={{
                  backgroundColor: COLOUR_BLUE,
                  marginVertical: 30,
                }}
                // disabled={this.state.inputs?.length === 0 || this.state.isLoading}
                loading={this.state.isLoading}
              />
            </View>
          </View>
        </Animated.ScrollView>
      </View>
    );
  }
}

export default AggregatorCommissionsWithdrawalDetails;

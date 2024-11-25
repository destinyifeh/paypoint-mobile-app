import React from 'react';
import { Dimensions, ScrollView, View } from 'react-native';

import Moment from 'moment';
import { Icon } from 'react-native-elements';

import Header from '../../../../../../components/header';
import Text from '../../../../../../components/text';
import { COLOUR_BLUE, COLOUR_LIGHT_GREY, COLOUR_MID_GREY, COLOUR_RED, COLOUR_WHITE, CONTENT_LIGHT, FONT_SIZE_BIGGEST, LINE_HEIGHT_BIGGEST, LINE_HEIGHT_MID } from '../../../../../../constants/styles';
import ActivityIndicator from '../../../../../../components/activity-indicator';
import ClickableListItem from '../../../../../../components/clickable-list-item';
import AnimatedNumber from '../../../../../../components/animated-number';
import { formatNumber } from '../../../../../../utils/formatters';
import Button from '../../../../../../components/button';
import Hyperlink from '../../../../../../components/hyperlink';
import DummyOpenedAccounts from '../../../../../../fixtures/dummy_opened_accounts.json'
import AccountRow from '../../components/account-row';
import AccountSerializer from '../../../../../../serializers/resources/account';


const accountSerializer = new AccountSerializer();
const windowWidth = Dimensions.get('window').width;


class BalanceCard extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { 
      amount, buttonTitle, containerStyle, didLoadBalanceFail, 
      isLoading, ledgerAmount, retry, timestamp, 
      title 
    } = this.props;

    return (
      <View
        style={{
          justifyContent: 'space-between',
          backgroundColor: 'white', 
          borderRadius: 12,
          elevation: 5,
          height: '85%',
          margin: 16,
          marginRight: 3,
          padding: 20,
          width: windowWidth * .8,
          ...containerStyle
        }}
      >
        <View>
          <Text semiBold>{title}</Text>
          <Text small style={{color: COLOUR_MID_GREY, lineHeight: LINE_HEIGHT_MID}}>as at {Moment(timestamp).format('MMMM Do, YYYY h:mma')}</Text>
        </View>
        
        <View style={{marginTop: 20}}>
          <AnimatedNumber 
            blue 
            steps={12}
            formatter={(value) => formatNumber(parseInt(value))}
            semiBold 
            style={{
              fontSize: FONT_SIZE_BIGGEST,
              lineHeight: LINE_HEIGHT_BIGGEST,
            }}
            value={amount}
          />
          <View>
            <Text semiBold white={!Boolean(ledgerAmount)}>Ledger Balance</Text>
            <Text white={!Boolean(ledgerAmount)}>{ledgerAmount}</Text>
          </View>
        </View>
        {isLoading && <ActivityIndicator 
          containerStyle={{
            position: 'absolute', 
            right: 20, 
            bottom: 20
          }} 
          size="small"
        />}
        {didLoadBalanceFail && !isLoading && <ClickableListItem
          onPress={retry}
          style={{
            position: 'absolute', 
            right: 18, 
            bottom: 18
          }}
        >
          <Icon 
            color={COLOUR_BLUE}
            name="refresh"
            size={24} 
          />
        </ClickableListItem>}
        {buttonTitle && <Button 
          disabled={this.props.isDisabled} 
          buttonStyle={{
            backgroundColor: 'transparent',
            padding: 20,
            ...this.props.buttonStyle
          }} 
          containerStyle={{
            backgroundColor: 'transparent',
            flex: .4,
            position: 'absolute',
            top: 0,
            right: 0,
            ...this.props.buttonContainerStyle
          }} 
          title={buttonTitle} 
          titleStyle={{
            color: COLOUR_RED,
            fontSize: 13,
            letterSpacing: 1.15,
            textAlign: 'right'
          }}
          onPressOut={() => this.props.buttonOnPressOut()} 
        />}
      </View>
    );
  }
}


export default function AccountOpeningScene({navigation, ...props}) {
  return (
    <View style={{flex: 1}}>
      <Header 
        containerStyle={{
          backgroundColor: COLOUR_BLUE
        }}
        leftComponent={<Icon 
          color={COLOUR_RED}
          underlayColor="transparent"
          name={'chevron-left'}
          size={32}
          type="material"
          onPress={() => navigation.goBack()}
        />}
        navigationIconColor={COLOUR_WHITE}
        statusBarProps={{
          backgroundColor: 'transparent',
          barStyle: CONTENT_LIGHT
        }}
        title="Open an Account"
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: 'bold'
        }}
      />
      <ScrollView>
        <View
          style={{
            backgroundColor: COLOUR_BLUE,
            height: 130
          }}
        />
        
        <ScrollView
          horizontal 
          style={{
            height: 220,
            position: 'absolute',
            top: 30,
            zIndex: 10,
            width: '100%'
          }}
          contentContainerStyle={{
            marginLeft: 8
          }}
        >
          <BalanceCard amount={87009} buttonOnPressOut={() => navigation.navigate('AccountOpeningForm')} buttonTitle="OPEN ACCOUNT" title="No of Accounts" />
          <BalanceCard amount={52} buttonOnPressOut={() => navigation.navigate('ViewAllAccountsScene', {category: 'Pending'})} buttonTitle="VIEW" title="Pending Accounts" />
          <BalanceCard amount={19} buttonOnPressOut={() => navigation.navigate('ViewAllAccountsScene', {category: 'Rejected'})} buttonTitle="VIEW" title="Rejected Accounts" />
        </ScrollView>

        <View style={{alignItems: 'center', backgroundColor: COLOUR_LIGHT_GREY, flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 8, marginTop: 130, width: '100%'}}>
          <Text bold>Recent Accounts</Text>
          <Hyperlink 
            bold
            onPress={() => navigation.navigate('AllAccounts')}
            style={{
              fontSize: 14,
              flexWrap: 'wrap'
            }}
          >
            More
          </Hyperlink>
        </View>
      
        {DummyOpenedAccounts.map(data => (
          <AccountRow {...accountSerializer.serializeApiData(data)} />
        ))}
      </ScrollView>
    </View>
  );
}

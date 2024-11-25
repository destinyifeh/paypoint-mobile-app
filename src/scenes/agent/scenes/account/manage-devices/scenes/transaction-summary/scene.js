import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import Header from '../../../../../../../components/header';
import GradientIcon from '../../../../../../../components/icons/gradient-icon';
import Text from '../../../../../../../components/text';
import { 
  COLOUR_BLUE, 
  COLOUR_WHITE, 
  CONTENT_LIGHT, 
  COLOUR_BLACK, 
  FONT_SIZE_BIG, 
  FONT_SIZE_SMALL 
} from '../../../../../../../constants/styles'
import { NGN } from '../../../../../../../constants/currencies'
import { 
  hideNavigator, 
  showNavigator 
} from '../../../../../../../services/redux/actions/navigation'
import { ScrollView } from 'react-native-gesture-handler';
import Accordion from '../../../../../../../components/accordion';
import amountField from '../../../../../../../fragments/amount-field';

class TransactionSummary extends React.Component {
  get summaryContent () {
    return <View style={{justifyContent: 'space-evenly', marginLeft: 10}}>
      <Text bold>Transaction amount</Text>
      <Text>{amountField(NGN, '95.76')}</Text>
      
      <Text bold style={{marginTop: 10}}>Fee</Text>
      <Text>{amountField(NGN, '0.02')}</Text>
      
      <Text bold style={{marginTop: 10}}>Total amount</Text>
      <Text>{amountField(NGN, '95.78')}</Text>
    </View>
  }

  get transactionDetailsContent () {
    return <View style={{justifyContent: 'space-evenly', marginLeft: 10}}>
      <Text bold>Merchant</Text>
      <Text>Airtime Topup</Text>
      
      <Text bold style={{marginTop: 10}}>Category</Text>
      <Text>Payment for services</Text>
      
      <Text bold style={{marginTop: 10}}>Location</Text>
      <Text>Ajah, Lagos</Text>
      
      <Text bold style={{marginTop: 10}}>Authorization Code</Text>
      <Text>344806107</Text>
      
      <Text bold style={{marginTop: 10}}>Payment Method</Text>
      <Text>530072XXXXXX8740</Text>
    </View>
  }

  render () {
    return <View style={{flex: 1}}>
      <Header 
        containerStyle={{
          backgroundColor: COLOUR_BLUE
        }}
        goBack={() => this.props.navigation.goBack()}
        navigation={this.props.navigation}
        withNavigateBackIcon
        title="Transaction Details"
        statusBarProps={{
          backgroundColor: 'transparent',
          barStyle: CONTENT_LIGHT
        }}
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: 'bold'
        }}
      />

      <ScrollView>  
        <View style={{
            alignItems: 'center',
            justifyContent: 'space-evenly',
            backgroundColor: '#F3F3F4',
            height: 250}}>
          <GradientIcon
            colors={['#83F4FA', '#00B8DE']}
            icon="tag"
            style={{
              justifyContent: 'center'
            }}
          />

          <Text style={{color: COLOUR_BLACK}}>Quickteller Paypoint - Airtime Popup</Text>
          <Text style={{fontSize: FONT_SIZE_SMALL}}>20/05/19 22:00</Text>
          <Text style={{color: COLOUR_BLACK, fontSize: FONT_SIZE_BIG}}>{amountField(NGN, '-95.80')}</Text>
          <Text isSuccessStatus>Successful</Text>
        </View>
      
        <Accordion 
          expanded={true}
          header="Summary"
          content={this.summaryContent}
        />

        <Accordion 
          expanded={true}
          header="Transaction Details"
          content={this.transactionDetailsContent}
        />
      </ScrollView>

    </View>
  }
}

function mapStateToProps (state) {
  return {
    isNavigatorVisible: state.navigation.isNavigatorVisible
  }
}

function mapDispatchToProps(dispatch) {
  return {
    hideNavigator: () => dispatch(hideNavigator()),
    showNavigator: () => dispatch(showNavigator())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionSummary)

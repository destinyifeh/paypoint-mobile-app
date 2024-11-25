import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import AggregatorLanding from '../../../../scenes/aggregator/scenes/landing';
import AgentUpgradeLanding from '../../../../scenes/aggregator/scenes/landing/agent-upgrade-landing';
import AgentBusinessDetails from '../../../aggregator/scenes/agent-upgrade/business-details';
import AgentPersonalDetails from '../../../aggregator/scenes/agent-upgrade/index';
import AgentkYCInformation from '../../../aggregator/scenes/agent-upgrade/kyc-information';
import CommissionEarnedScene from '../reports/commissions-earned';
import CommissionsEarnedFilterScene from '../reports/commissions-earned-filter';
import ReportTransactionsScene from '../reports/report-transactions';
import ReportTransactionsFilterScene from '../reports/report-transactions-filter';
import TransactionSummaryScene from '../reports/transaction-summary';
import ProductPaymentScene from '../services/scenes/transactions/product-payment';
import AgentUpgrade from './scenes/agent-upgrade';
import ViewAgentDetails from './scenes/details';
import ViewAgents from './scenes/view-agents';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="ViewAgents" component={ViewAgents} />
    <Stack.Screen name="ViewAgentDetails" component={ViewAgentDetails} />
    <Stack.Screen name="AgentUpgrade" component={AgentUpgrade} />
    <Stack.Screen name="AgentUpgradeLanding" component={AgentUpgradeLanding} />
    <Stack.Screen name="AgentkYCInformation" component={AgentkYCInformation} />
    <Stack.Screen
      name="AgentBusinessDetails"
      component={AgentBusinessDetails}
    />
    <Stack.Screen
      name="AgentPersonalDetails"
      component={AgentPersonalDetails}
    />
    <Stack.Screen name="AggregatorLanding" component={AggregatorLanding} />
    <Stack.Screen name="ProductPayment" component={ProductPaymentScene} />
    <Stack.Screen
      name="ReportTransactions"
      component={ReportTransactionsScene}
    />
    <Stack.Screen
      name="ReportTransactionsFilter"
      component={ReportTransactionsFilterScene}
    />
    <Stack.Screen
      name="TransactionSummary"
      component={TransactionSummaryScene}
    />
    <Stack.Screen name="CommissionsEarned" component={CommissionEarnedScene} />
    <Stack.Screen
      name="CommissionsEarnedFilter"
      component={CommissionsEarnedFilterScene}
    />
  </Stack.Navigator>
);

export default AppNavigator;

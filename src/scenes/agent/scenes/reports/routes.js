import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';

import AggregatorCommissionsWithdrawalDetails from '../../../aggregator/scenes/commission-withdrawal-details/scene';
import CommissionsEarnedDashBoard from '../../../aggregator/scenes/commissions/scene';
import UnloadCommissionScene from '../home/scenes/unload-commission';
import BankNetwork from './bank-network';
import CacReport from './cac-report';
import ReportCacFilterScene from './cac-report-filter/scene';
import CacReportDetails from './cac-report/cac-reg-details';
import ReportDetailsCac from './cac-report/cac-reg-details/report-details-scene';
import CommissionsEarned from './commissions-earned';
import CommissionsEarnedFilterScene from './commissions-earned-filter';
import AddIssueScene from './crm-service/add-issue';
import IssueDetailsScene from './crm-service/issue-details';
import issueHistory from './crm-service/issue-history';
import ReportServices from './report-services';
import ReportTransactions from './report-transactions';
import ReportTransactionsFilterScene from './report-transactions-filter';
import DefaultScene from './scene';
import StatementOfAccountScene from './statement-of-account';
import StatementOfAccountDetailsScene from './statement-of-account-details';
import StatementOfAccountFilterScene from './statement-of-account-filter';
import TransactionSummary from './transaction-summary';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="DefaultScene" component={DefaultScene} />
    <Stack.Screen name="Agent" component={DefaultScene} />
    <Stack.Screen name="CommissionsEarned" component={CommissionsEarned} />
    <Stack.Screen name="UnloadCommission" component={UnloadCommissionScene} />
    <Stack.Screen
      name="AggregatorCommissionsEarned"
      component={CommissionsEarnedDashBoard}
    />
    <Stack.Screen
      name="AggregatorCommissionsWithdrawalDetails"
      component={AggregatorCommissionsWithdrawalDetails}
    />
    <Stack.Screen
      name="CommissionsEarnedFilter"
      component={CommissionsEarnedFilterScene}
    />
    <Stack.Screen name="ReportServices" component={ReportServices} />
    <Stack.Screen name="BankNetwork" component={BankNetwork} />
    <Stack.Screen name="IssueHistory" component={issueHistory} />
    <Stack.Screen name="IssueDetails" component={IssueDetailsScene} />
    <Stack.Screen name="AddIssue" component={AddIssueScene} />
    <Stack.Screen name="ReportTransactions" component={ReportTransactions} />
    <Stack.Screen
      name="ReportTransactionsFilter"
      component={ReportTransactionsFilterScene}
    />
    <Stack.Screen
      name="StatementOfAccount"
      component={StatementOfAccountScene}
    />
    <Stack.Screen
      name="StatementOfAccountDetails"
      component={StatementOfAccountDetailsScene}
    />
    <Stack.Screen
      name="StatementOfAccountFilter"
      component={StatementOfAccountFilterScene}
    />
    <Stack.Screen name="TransactionSummary" component={TransactionSummary} />
    <Stack.Screen name="ReportCacFilter" component={ReportCacFilterScene} />
    <Stack.Screen name="ReportDetailsCac" component={ReportDetailsCac} />
    <Stack.Screen name="CacReportDetails" component={CacReportDetails} />
    <Stack.Screen name="CacReports" component={CacReport} />
  </Stack.Navigator>
);

export default AppNavigator;

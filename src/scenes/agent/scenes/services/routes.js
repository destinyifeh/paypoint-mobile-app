import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import CacCancelScreen from '../cac-registration/scenes/cancel-screen';
import CacKycDetails from '../cac-registration/scenes/kyc-details';
import CacTinDetails from '../cac-registration/scenes/tin-details';
import DefaultScene from './scene';

import CacBusinessDetails from '../cac-registration/scenes/business-details';
import CacBusinessName from '../cac-registration/scenes/business-name';
import CacInsuffiecientFunds from '../cac-registration/scenes/insuffiecient-funds';
import CacPersonalDetails from '../cac-registration/scenes/personal-details';
import CacSuccess from '../cac-registration/scenes/success';
import CacUnsuccessfulPayment from '../cac-registration/scenes/unsuccessful-payment';
import AccountOpeningFormScene from './scenes/account-opening/account-opening';
import CardLinkingScene from './scenes/account-opening/card-linking';
import AccountOpeningHomeScene from './scenes/account-opening/home';
import ViewAllAccountsScene from './scenes/account-opening/view-all-accounts';
import ProductPaymentScene from './scenes/transactions/product-payment';
import SelectProductScene from './scenes/transactions/select-product';
import SelectSubCategoryScene from './scenes/transactions/select-sub-category';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="DefaultScene" component={DefaultScene} />
    <Stack.Screen name="CardLinking" component={CardLinkingScene} />
    <Stack.Screen name="ProductPayment" component={ProductPaymentScene} />
    <Stack.Screen name="SelectProduct" component={SelectProductScene} />
    <Stack.Screen name="SelectSubCategory" component={SelectSubCategoryScene} />
    <Stack.Screen
      name="AccountOpeningHome"
      component={AccountOpeningHomeScene}
    />
    <Stack.Screen
      name="AccountOpeningForm"
      component={AccountOpeningFormScene}
    />
    <Stack.Screen
      name="ViewAllAccountsScene"
      component={ViewAllAccountsScene}
    />

    <Stack.Screen name="CancelPayment" component={CacCancelScreen} />
    <Stack.Screen name="CacTinDetails" component={CacTinDetails} />
    <Stack.Screen name="InsufficientFund" component={CacInsuffiecientFunds} />
    <Stack.Screen name="Congratulation" component={CacSuccess} />
    <Stack.Screen
      name="CacUnsuccessfulPayment"
      component={CacUnsuccessfulPayment}
    />
    <Stack.Screen name="CacBusinessDetails" component={CacBusinessDetails} />
    <Stack.Screen name="CacKycDetails" component={CacKycDetails} />
    <Stack.Screen name="CacPersonalDetails" component={CacPersonalDetails} />
    <Stack.Screen name="CacBusinessNameDetails" component={CacBusinessName} />
  </Stack.Navigator>
);

export default AppNavigator;

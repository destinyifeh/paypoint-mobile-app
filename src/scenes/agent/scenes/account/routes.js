import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import ManageDevicesScene from './manage-devices';
import AuditTrailDetailsScene from './manage-devices/scenes/audit-trail-details';
import FilterAuditTrailScene from './manage-devices/scenes/filter-audit-trail';
import ManageDevicesAuditTrailScene from './manage-devices/scenes/manage-devices-audit-trail';
import MyDevicesScene from './manage-devices/scenes/my-devices';
import TransactionSummaryScene from './manage-devices/scenes/transaction-summary';
import ManageProfileScene from './manage-profile';
import ImageViewerScene from './manage-profile/scenes/image-viewer';
import UpdateBusinessInformationScene from './manage-profile/scenes/update-business-information';
import UpdateContactInformationScene from './manage-profile/scenes/update-contact-information';
import UpdateDocumentsScene from './manage-profile/scenes/update-documents';
import UpdateNextOfKinInformationScene from './manage-profile/scenes/update-next-of-kin-information';
import UpdatePersonalInformationScene from './manage-profile/scenes/update-personal-information';
import UpdateResidentialAddressInformationScene from './manage-profile/scenes/update-residential-address';
import POSManagementScene from './pos-management';
import PosReportView from './pos-management/components/posReportView';
import PosReceiptConfirmationScene from './pos-management/pos-receipt-confirmation';
import PosReportScene from './pos-management/pos-report/scene';
import PosRequestDetailsScene from './pos-management/pos-request-details/scene';
import PosRequestPaymentDetailsScene from './pos-management/pos-request-payment-details/scene';
import PosRequestSubmitScene from './pos-management/pos-request-submit';
import PosRequestScene from './pos-management/pos-request/scene';
import TrackPosOrderScene from './pos-management/track-pos order';
import TrackPosScene from './pos-management/track-pos/scene';
import PosRemapScene from './pos-remap/scene';
import PosRemapNewAgentScreenScene from './pos-remap/scenes/new-agent-details';
import DefaultScene from './scene';
import SecuritySettingsScene from './security-settings';
import UpdatePasswordScene from './security-settings/scenes/update-password';
import UpdateTransactionPinScene from './security-settings/scenes/update-transaction-pin';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator
    initialRouteName="DefaultScene"
    screenOptions={{headerShown: false}}>
    <Stack.Screen name="DefaultScene" component={DefaultScene} />
    <Stack.Screen name="AuditTrailDetails" component={AuditTrailDetailsScene} />
    <Stack.Screen name="FilterAuditTrail" component={FilterAuditTrailScene} />
    <Stack.Screen name="ImageViewer" component={ImageViewerScene} />
    <Stack.Screen name="ManageDevices" component={ManageDevicesScene} />
    <Stack.Screen
      name="ManageDevicesAuditTrail"
      component={ManageDevicesAuditTrailScene}
    />
    <Stack.Screen name="ManageProfile" component={ManageProfileScene} />
    <Stack.Screen name="MyDevices" component={MyDevicesScene} />
    <Stack.Screen name="SecuritySettings" component={SecuritySettingsScene} />
    <Stack.Screen name="POSManagement" component={POSManagementScene} />
    <Stack.Screen name="PosRemap" component={PosRemapScene} />
    <Stack.Screen name="PosReport" component={PosReportScene} />
    <Stack.Screen name="PosReportView" component={PosReportView} />
    <Stack.Screen
      name="PosRemapNewAgentScreen"
      component={PosRemapNewAgentScreenScene}
    />
    <Stack.Screen
      name="PosReceiptConfirmationScene"
      component={PosReceiptConfirmationScene}
    />
    <Stack.Screen name="PosRequestScene" component={PosRequestScene} />
    <Stack.Screen
      name="PosRequestDetailsScene"
      component={PosRequestDetailsScene}
    />
    <Stack.Screen
      name="PosRequestPaymentDetailsScene"
      component={PosRequestPaymentDetailsScene}
    />
    <Stack.Screen
      name="PosRequestSubmitScene"
      component={PosRequestSubmitScene}
    />
    <Stack.Screen name="TrackPosScene" component={TrackPosScene} />
    <Stack.Screen name="TrackPosOrderScene" component={TrackPosOrderScene} />
    <Stack.Screen
      name="TransactionSummary"
      component={TransactionSummaryScene}
    />
    <Stack.Screen
      name="UpdateContactInformation"
      component={UpdateContactInformationScene}
    />
    <Stack.Screen name="UpdateDocuments" component={UpdateDocumentsScene} />
    <Stack.Screen
      name="UpdateNextOfKinInformation"
      component={UpdateNextOfKinInformationScene}
    />
    <Stack.Screen name="UpdatePassword" component={UpdatePasswordScene} />
    <Stack.Screen
      name="UpdateTransactionPin"
      component={UpdateTransactionPinScene}
    />
    <Stack.Screen
      name="UpdateBusinessInformation"
      component={UpdateBusinessInformationScene}
    />
    <Stack.Screen
      name="UpdatePersonalInformation"
      component={UpdatePersonalInformationScene}
    />
    <Stack.Screen
      name="UpdateResidentialAddressInformation"
      component={UpdateResidentialAddressInformationScene}
    />
  </Stack.Navigator>
);

export default AppNavigator;

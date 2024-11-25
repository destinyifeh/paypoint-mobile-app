import {createStackNavigator} from '@react-navigation/stack';
import AgentBusinessDetailsScene from '../../../aggregator/scenes/agent-upgrade/business-details';
import AgentkycInformationScene from '../../../aggregator/scenes/agent-upgrade/kyc-information';
import AgentPersonalInformation from '../../../aggregator/scenes/home/scenes/pre-setup-agent/tabs/personal-information';
import AggregatorLandingScene from '../../../aggregator/scenes/landing';
import PreSetupAgentScene from '../../../aggregator/scenes/pre-setup-agent';
import agentApplicationPreview from '../../../aggregator/scenes/pre-setup-agent/agentApplicationPreview';
import BusinessDetailsScene from '../../../aggregator/scenes/pre-setup-agent/business-details';
import kycInformationScene from '../../../aggregator/scenes/pre-setup-agent/kyc-information';
import NextOfKinDetailsScene from '../../../aggregator/scenes/pre-setup-agent/next-of-kin-details';
import ApplicationScene from '../../../application';
import ApplicationPreviewScene from '../../../application-preview';
import LogoutScene from '../../../logout';
import SelfOnboardingApplicationPreview from '../../../self-onboarding/application-preview';
import SelfOnboardingBusinessScene from '../../../self-onboarding/onboarding-business-details';
import SelfOnboardingKYCScene from '../../../self-onboarding/onboarding-kyc';
import SelfOnboardingNOKScene from '../../../self-onboarding/onboarding-nok';
import SelfOnboardingOTPScene from '../../../self-onboarding/onboarding-otp';
import SelfOnboardingPreSetupAgent from '../../../self-onboarding/pre-setup-self-onboard';
import ServiceLevelAgreementScene from '../../../service-level-agreement';
import AgentBvnVerification from '../../cbn-requirements/scenes/bvn-verification';
import AgentFacialVerification from '../../cbn-requirements/scenes/facial-verification';
import AgentNinVerification from '../../cbn-requirements/scenes/nin-verfication';
import AgentTinAndCacVerification from '../../cbn-requirements/scenes/tin-cac-verification';
import FaceVerificationWebViewScreen from '../../cbn-requirements/web-view';
import ManageDevicesScene from '../account/manage-devices/scene';
import ManageDevicesAuditTrailScene from '../account/manage-devices/scenes/manage-devices-audit-trail';
import MyDevicesScene from '../account/manage-devices/scenes/my-devices';
import ManageProfileScene from '../account/manage-profile';
import ImageViewerScene from '../account/manage-profile/scenes/image-viewer';
import UpdateBusinessInformationScene from '../account/manage-profile/scenes/update-business-information';
import BVNInformationScene from '../account/manage-profile/scenes/update-bvn';
import UpdateContactInformationScene from '../account/manage-profile/scenes/update-contact-information';
import UpdateDocumentsScene from '../account/manage-profile/scenes/update-documents';
import UpdateNextOfKinInformationScene from '../account/manage-profile/scenes/update-next-of-kin-information';
import UpdatePersonalInformationScene from '../account/manage-profile/scenes/update-personal-information';
import UpdateResidentialAddressInformationScene from '../account/manage-profile/scenes/update-residential-address';
import NINAccountDowngrade from '../account/nin-update/account-downgrade/scene';
import NINInformation from '../account/nin-update/nin-information/scene';
import PosConcorConfirmationScene from '../account/pos-management/pos-concor-confirmation';
import ViewApplicants from '../applications-management/scene';
import BankNetworkScene from '../reports/bank-network';
import CommissionsEarnedScene from '../reports/commissions-earned';
import CommissionsEarnedFilterScene from '../reports/commissions-earned-filter';
import AddIssue from '../reports/crm-service/add-issue';
import IssueDetails from '../reports/crm-service/issue-details';
import IssueHistory from '../reports/crm-service/issue-history';
import ReportServicesScene from '../reports/report-services';
import ReportTransactionsScene from '../reports/report-transactions';
import ReportTransactionsFilterScene from '../reports/report-transactions-filter';
import StatementOfAccountScene from '../reports/statement-of-account';
import TransactionSummaryScene from '../reports/transaction-summary';
import ServicesScene from '../services';
import AccountOpeningForm from '../services/scenes/account-opening/account-opening';
import CardLinkingScene from '../services/scenes/account-opening/card-linking';
import ProductPaymentScene from '../services/scenes/transactions/product-payment';
import SelectProductScene from '../services/scenes/transactions/select-product';
import SelectSubCategoryScene from '../services/scenes/transactions/select-sub-category';
import DefaultScene from './scenes/default-scene/routes';
import FundWalletInAppScene from './scenes/fund-wallet-in-app';
import FundWalletQuicktellerScene from './scenes/fund-wallet-quickteller';
import FundWalletViaUssdScene from './scenes/fund-wallet-ussd';
import NotificationsScene from './scenes/notifications';
import UnloadCommissionScene from './scenes/unload-commission';

import CacCancelScreen from '../cac-registration/scenes/cancel-screen';
import CacKycDetails from '../cac-registration/scenes/kyc-details';
import CacTinDetails from '../cac-registration/scenes/tin-details';

import CacBusinessDetails from '../cac-registration/scenes/business-details';
import CacBusinessName from '../cac-registration/scenes/business-name';
import CacInsuffiecientFunds from '../cac-registration/scenes/insuffiecient-funds';
import CacPersonalDetails from '../cac-registration/scenes/personal-details';
import CacSuccess from '../cac-registration/scenes/success';
import CacUnsuccessfulPayment from '../cac-registration/scenes/unsuccessful-payment';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="DefaultScene"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeTabs" component={DefaultScene} />
      <Stack.Screen name="AccountOpeningForm" component={AccountOpeningForm} />
      <Stack.Screen name="Agent" component={DefaultScene} />
      <Stack.Screen name="Application" component={ApplicationScene} />
      <Stack.Screen
        name="ApplicationPreview"
        component={ApplicationPreviewScene}
      />
      <Stack.Screen name="CardLinking" component={CardLinkingScene} />
      <Stack.Screen
        name="CommissionsEarned"
        component={CommissionsEarnedScene}
      />
      <Stack.Screen
        name="CommissionsEarnedFilter"
        component={CommissionsEarnedFilterScene}
      />
      <Stack.Screen name="FundWalletInApp" component={FundWalletInAppScene} />
      <Stack.Screen
        name="FundWalletQuickteller"
        component={FundWalletQuicktellerScene}
      />
      <Stack.Screen
        name="FundWalletViaUssd"
        component={FundWalletViaUssdScene}
      />
      <Stack.Screen name="ImageViewer" component={ImageViewerScene} />
      <Stack.Screen name="ManageDevices" component={ManageDevicesScene} />
      <Stack.Screen
        name="ManageDevicesAuditTrail"
        component={ManageDevicesAuditTrailScene}
      />
      <Stack.Screen name="ManageProfile" component={ManageProfileScene} />
      <Stack.Screen name="BVNInformation" component={BVNInformationScene} />
      <Stack.Screen name="MyDevices" component={MyDevicesScene} />
      <Stack.Screen name="Notifications" component={NotificationsScene} />
      <Stack.Screen name="ProductPayment" component={ProductPaymentScene} />
      <Stack.Screen
        name="PosConcorConfirmation"
        component={PosConcorConfirmationScene}
      />
      <Stack.Screen
        name="ReportTransactions"
        component={ReportTransactionsScene}
      />
      <Stack.Screen
        name="ReportTransactionsFilter"
        component={ReportTransactionsFilterScene}
      />
      <Stack.Screen name="ReportServices" component={ReportServicesScene} />
      <Stack.Screen name="BankNetwork" component={BankNetworkScene} />
      <Stack.Screen name="IssueHistory" component={IssueHistory} />
      <Stack.Screen name="IssueDetails" component={IssueDetails} />
      <Stack.Screen name="AddIssue" component={AddIssue} />
      <Stack.Screen name="NinIdInformation" component={NINInformation} />
      <Stack.Screen
        name="NinAccountDowngrade"
        component={NINAccountDowngrade}
      />
      <Stack.Screen
        name="AgentBvnVerification"
        component={AgentBvnVerification}
      />
      <Stack.Screen
        name="AgentNinVerification"
        component={AgentNinVerification}
      />
      <Stack.Screen
        name="AgentTinVerification"
        component={AgentTinAndCacVerification}
      />
      <Stack.Screen
        name="AgentFacialVerification"
        component={AgentFacialVerification}
      />
      <Stack.Screen
        name="AgentWebViewFacialVerification"
        component={FaceVerificationWebViewScreen}
      />
      <Stack.Screen name="SelectProduct" component={SelectProductScene} />
      <Stack.Screen
        name="SelectSubCategory"
        component={SelectSubCategoryScene}
      />
      <Stack.Screen name="Services" component={ServicesScene} />
      <Stack.Screen
        name="ServiceLevelAgreement"
        component={ServiceLevelAgreementScene}
      />
      <Stack.Screen
        name="StatementOfAccount"
        component={StatementOfAccountScene}
      />
      <Stack.Screen
        name="TransactionSummary"
        component={TransactionSummaryScene}
      />
      <Stack.Screen
        name="UpdateBusinessInformation"
        component={UpdateBusinessInformationScene}
      />
      <Stack.Screen name="UpdateDocuments" component={UpdateDocumentsScene} />
      <Stack.Screen name="UnloadCommission" component={UnloadCommissionScene} />
      <Stack.Screen
        name="UpdateContactInformation"
        component={UpdateContactInformationScene}
      />
      <Stack.Screen
        name="UpdateNextOfKinInformation"
        component={UpdateNextOfKinInformationScene}
      />
      <Stack.Screen
        name="UpdatePersonalInformation"
        component={UpdatePersonalInformationScene}
      />
      <Stack.Screen
        name="UpdateResidentialAddressInformation"
        component={UpdateResidentialAddressInformationScene}
      />
      <Stack.Screen name="PreSetupAgent" component={PreSetupAgentScene} />
      <Stack.Screen name="BusinessDetails" component={BusinessDetailsScene} />
      <Stack.Screen name="NextOfKinDetails" component={NextOfKinDetailsScene} />
      <Stack.Screen name="kYCInformation" component={kycInformationScene} />
      <Stack.Screen
        name="AggregatorLanding"
        component={AggregatorLandingScene}
      />
      <Stack.Screen
        name="AgentBusinessDetails"
        component={AgentBusinessDetailsScene}
      />
      <Stack.Screen
        name="AgentkYCInformation"
        component={AgentkycInformationScene}
      />
      <Stack.Screen
        name="AgentUpgradeLanding"
        component={AggregatorLandingScene}
      />
      <Stack.Screen
        name="AgentPersonalDetails"
        component={AgentPersonalInformation}
      />
      <Stack.Screen
        name="AgentApplicationPreview"
        component={agentApplicationPreview}
      />
      <Stack.Screen name="ViewApplicants" component={ViewApplicants} />
      <Stack.Screen
        name="SelfOnboardingPreSetupAgent"
        component={SelfOnboardingPreSetupAgent}
      />
      <Stack.Screen
        name="SelfOnboardingOTPScene"
        component={SelfOnboardingOTPScene}
      />
      <Stack.Screen
        name="SelfOnboardingKYCScene"
        component={SelfOnboardingKYCScene}
      />
      <Stack.Screen
        name="SelfOnboardingBusinessScene"
        component={SelfOnboardingBusinessScene}
      />
      <Stack.Screen
        name="SelfOnboardingNOKScene"
        component={SelfOnboardingNOKScene}
      />
      <Stack.Screen
        name="SelfOnboardingApplicationPreview"
        component={SelfOnboardingApplicationPreview}
      />
      <Stack.Screen name="Logout" component={LogoutScene} />

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
}

import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';

export const IFIS_K3 = 'ifis-k3';
export const PROD_K2 = 'prod-k2';

export const PRODUCTION = 'production';
export const UAT = 'uat';

export const DISTRIBUTE_PAYMENT_ITEM_CODE = 'IFISW2W';

export let ENVIRONMENT = Config.ENVIRONMENT;
export const ENVIRONMENT_IS_API_GATEWAY = JSON.parse(
  Config.ENVIRONMENT_IS_API_GATEWAY,
);
export let ENVIRONMENT_IS_TEST = JSON.parse(Config.ENVIRONMENT_IS_TEST);
export let ENVIRONMENT_IS_PRODUCTION = JSON.parse(
  Config.ENVIRONMENT_IS_PRODUCTION,
);

export const FUND_VIA_QUICKTELLER = false;
export const MOCK_QUICKTELLER_RESPONSE = false;

export const APP_UPDATE_CHECK_INTERVAL_IN_MILLISECONDS = 60 * 1000;
export const IDLE_TIMEOUT = 300000;
export const IDLE_TIMEOUT_IN_SECONDS = 60 * 5; // 5 minutes
export const TIME_TO_REFRESH_TOKEN_IN_MILLISECONDS = 300000;

export const CHECK_TOKEN_EXPIRY_DATE = 'check_token_expiry_date';

export const MOCK_DEVICE_DETAILS = ENVIRONMENT_IS_TEST;
export const DEVICE_CHANNEL = 'MOBILE';

export const AUDIT_TRAIL_SERVICE_API_BASE_URL =
  Config.AUDIT_TRAIL_SERVICE_API_BASE_URL;

export const API_GATEWAY_API_BASE_URL = Config.API_GATEWAY_API_BASE_URL;

export let QUICKTELLER_API_BASE_URL = Config.QUICKTELLER_API_BASE_URL;
export let CATALOG_API_BASE_URL = Config.CATALOG_API_BASE_URL;

export let QUICKTELLER_CHANNEL = Config.QUICKTELLER_CHANNEL;

export const TRANSFER_TO_ACCOUNT_NIP_PAYMENT_ITEM_CODE = 'NIP2021';
export let TRANSFER_TO_ACCOUNT_PAYMENT_ITEM_CODE =
  Config.TRANSFER_TO_ACCOUNT_PAYMENT_ITEM_CODE;

export const CASHIN_PAYMENT_ITEM_CODE = 'CASHINTRANSFER';
export const TRANSFER_TO_AGENT_PAYMENT_ITEM_CODE =
  Config.TRANSFER_TO_AGENT_PAYMENT_ITEM_CODE;
export let DOCUMENT_BASE_URL = Config.DOCUMENT_BASE_URL;

export const CDN_BASE_URL = Config.CDN_BASE_URL;
export const FUND_WALLET_URL = Config.FUND_WALLET_URL;
export let QUICKTELLER_API_TERMINAL_ID = Config.QUICKTELLER_API_TERMINAL_ID;
export let RECOVER_PASSWORD_DESTINATION_URL = {
  uat: 'https://finch-agent-dashboard-ifis.k3.isw.la/agent/reset-password',
  'prod-k2':
    'https://finch-agent-dashboard-prod.k2.isw.la/agent/reset-password',
  production: 'https://paypoint.quickteller.com/agent/reset-password',
}[ENVIRONMENT];

export let ACCOUNT_OPENING_API_BASE_URL = Config.ACCOUNT_OPENING_API_BASE_URL;
export const IFIS_ARCHIVES_API_BASE_URL =
  'https://ifis-archives.quickteller.com';
export let IN_APP_NOTIFICATIONS_API_BASE_URL =
  Config.IN_APP_NOTIFICATIONS_API_BASE_URL;
export let LIQUIDITY_API_BASE_URL = Config.LIQUIDITY_API_BASE_URL;
export let MESSAGING_API_BASE_URL = Config.MESSAGING_API_BASE_URL;
export let WEBVIEW_FACIAL_VERIFICATION_BASE_URL = {
  uat: 'https://finch-agent-dashboard.k8.isw.la/agent/face-verification-mobile',
  production: 'https://paypoint.quickteller.com/agent/face-verification-mobile',
}[ENVIRONMENT];

export let FIP_WEBVIEW_FACIAL_VERIFICATION_BASE_URL = {
  uat: 'https://finch-agent-dashboard.k8.isw.la/agent/face-verification-fmpa',
  production: 'https://paypoint.quickteller.com/agent/face-verification-fmpa',
}[ENVIRONMENT];
export let NIP_API_BASE_URL = {
  uat: 'https://finch-nip-service.k8.isw.la/api',
  production: 'https://api-gateway.interswitchng.com/api',
}[ENVIRONMENT];
export let ONBOARDING_API_BASE_URL = Config.ONBOARDING_API_BASE_URL;
export let PASSPORT_API_BASE_URL = Config.PASSPORT_API_BASE_URL;
export let PLATFORM_API_BASE_URL = Config.PLATFORM_API_BASE_URL;
export let CAC_API_BASE_URL = Config.CAC_API_BASE_URL;

export let SETTLEMENT_API_BASE_URL = Config.SETTLEMENT_API_BASE_URL;
export let TRANSACTION_API_BASE_URL = Config.TRANSACTION_API_BASE_URL;
export let TRANSACTION_API_BASE_URL_V3 = Config.TRANSACTION_API_BASE_URL_V3;
export let TRANSACTION_API_BASE_URL_V1 = Config.TRANSACTION_API_BASE_URL_V1;
export let BANK_MONITORING_API_BASE_URL = Config.BANK_MONITORING_API_BASE_URL;
export let CRM_API_BASE_URL = Config.CRM_API_BASE_URL;
export let TRANSACTION_HISTORY_API_BASE_URL =
  Config.TRANSACTION_HISTORY_API_BASE_URL;
export let USER_MANAGEMENT_API_BASE_URL = Config.USER_MANAGEMENT_API_BASE_URL;
export const CODE_PUSH_DEPLOYMENT_KEY = Config.CODE_PUSH_DEPLOYMENT_KEY;
export let IS_ANALYTICS_ENABLED = ENVIRONMENT_IS_PRODUCTION;
export const IKEDC_CODES = '051727101 051722602 04393801 04393701';
export const WHITELISTED__PRELOADED_BILLERS_CODES_FOR_EDO_STATE_HOSPITAL =
  '3995';
export let SHOW_FUND_VIA_USSD = true;
export let SHOW_BANK_NETWORK = true;
export let SHOW_CRM = true;
export let SHOW_AGGREGATOR_COMMISSION = true;
export let SHOW_CBN_COMPLIANCE = true;
export let ALLOW_NEW_FMPA = false;

const FORCE_UAT = true;
if (FORCE_UAT) {
  SHOW_CBN_COMPLIANCE = true;
  SHOW_AGGREGATOR_COMMISSION = true;
  SHOW_CRM = true;
  SHOW_BANK_NETWORK = true;
  ACCOUNT_OPENING_API_BASE_URL =
    'https://finch-account-opening-service.k8.isw.la';
  IN_APP_NOTIFICATIONS_API_BASE_URL =
    'https://ifis-in-app-notification-service.k8.isw.la/api/v1/ifis/notifications';
  LIQUIDITY_API_BASE_URL =
    'http://finch.qa.interswitchng.com/liquidity-service/api';
  MESSAGING_API_BASE_URL =
    'https://finch-messaging-service.k8.isw.la/finch-messaging/api/v1';
  ONBOARDING_API_BASE_URL = 'https://finch-onboarding-service.k8.isw.la/api';
  PASSPORT_API_BASE_URL = 'http://qa.interswitchng.com';
  PLATFORM_API_BASE_URL = 'https://finch-platform-service.k8.isw.la/api';
  CAC_API_BASE_URL = 'https://cac-registration-service.k8.isw.la/cac';
  SETTLEMENT_API_BASE_URL =
    'http://finch-settlement-service.k8.isw.la/api/v1/finch-settlement';
  TRANSACTION_API_BASE_URL =
    'https://finch-transaction-service.k8.isw.la/api/v2/finch-transaction';
  TRANSACTION_API_BASE_URL_V3 =
    'https://finch-transaction-service.k8.isw.la/api/v3/finch-transaction';
  TRANSACTION_HISTORY_API_BASE_URL =
    'https://finch-transaction-history-service.k8.isw.la/api';
  BANK_MONITORING_API_BASE_URL =
    'https://finch-bank-monitoring-service.k8.isw.la/finch-bank-monitoring-service/api';
  CRM_API_BASE_URL = 'https://finch-crm-middleware-service.k8.isw.la/api';
  USER_MANAGEMENT_API_BASE_URL =
    'https://finch-user-mgmt-service.k8.isw.la/api';
  RECOVER_PASSWORD_DESTINATION_URL =
    'https://finch-agent-dashboard-ifis.k3.isw.la/agent/reset-password';
  NIP_API_BASE_URL = 'https://finch-nip-service.k8.isw.la/api';
  TRANSACTION_API_BASE_URL_V1 =
    'https://finch-transaction-service.k8.isw.la/api/v1/finch-transaction';

  QUICKTELLER_API_BASE_URL = 'https://quickteller.k8.isw.la/api/v1';
  CATALOG_API_BASE_URL =
    'http://finch.qa.interswitchng.com/api/v2/finch-catalog-service/quickteller';
  DOCUMENT_BASE_URL =
    'https://mufasa.k8.isw.la/p/inclusio/finch-onboarding-service';
  WEBVIEW_FACIAL_VERIFICATION_BASE_URL =
    'https://finch-agent-dashboard.k8.isw.la/agent/face-verification-mobile';

  FIP_WEBVIEW_FACIAL_VERIFICATION_BASE_URL =
    'https://finch-agent-dashboard.k8.isw.la/agent/face-verification-fmpa';

  QUICKTELLER_CHANNEL = '7';
  QUICKTELLER_API_TERMINAL_ID = '9PBL0001';
  IS_ANALYTICS_ENABLED = false;
  ENVIRONMENT = 'uat';
  ENVIRONMENT_IS_TEST = true;
  ENVIRONMENT_IS_PRODUCTION = false;
  TRANSFER_TO_ACCOUNT_PAYMENT_ITEM_CODE = 70101;
}

const FORCE_PROD = false;
if (FORCE_PROD) {
  SHOW_CBN_COMPLIANCE = true;
  SHOW_AGGREGATOR_COMMISSION = false;
  SHOW_CRM = true;
  SHOW_FUND_VIA_USSD = false;
  SHOW_BANK_NETWORK = true;
  ACCOUNT_OPENING_API_BASE_URL = 'https://api-gateway.interswitchng.com';
  IN_APP_NOTIFICATIONS_API_BASE_URL =
    'https://api-gateway.interswitchng.com/api/v1/ifis/notifications';
  LIQUIDITY_API_BASE_URL =
    'https://api-gateway.interswitchng.com/liquidity-service/api';
  MESSAGING_API_BASE_URL =
    'https://api-gateway.interswitchng.com/finch-messaging/api/v1';
  NIP_API_BASE_URL = 'https://api-gateway.interswitchng.com/api';
  ONBOARDING_API_BASE_URL = 'https://api-gateway.interswitchng.com/api';
  PASSPORT_API_BASE_URL = 'https://qa.interswitchng.com';
  PLATFORM_API_BASE_URL = 'https://api-gateway.interswitchng.com/api';
  SETTLEMENT_API_BASE_URL =
    'https://api-gateway.interswitchng.com/api/v1/finch-settlement';
  TRANSACTION_API_BASE_URL =
    'https://api-gateway.interswitchng.com/api/v2/finch-transaction';
  TRANSACTION_API_BASE_URL_V3 =
    'https://api-gateway.interswitchng.com/api/v3/finch-transaction';
  TRANSACTION_API_BASE_URL_V1 =
    'https://api-gateway.interswitchng.com/api/v1/finch-transaction';
  TRANSACTION_HISTORY_API_BASE_URL =
    'https://api-gateway.interswitchng.com/api';

  BANK_MONITORING_API_BASE_URL =
    ' https://api-gateway.interswitchng.com/finch-bank-monitoring-service/api';
  CRM_API_BASE_URL = ' https://api-gateway.interswitchng.com/api';

  USER_MANAGEMENT_API_BASE_URL = 'https://api-gateway.interswitchng.com/api';
  RECOVER_PASSWORD_DESTINATION_URL =
    'https://finch-agent-dashboard-prod.k2.isw.la/agent/reset-password';

  QUICKTELLER_API_BASE_URL = 'https://www.quickteller.com/api/v1';
  CATALOG_API_BASE_URL =
    'https://api-gateway.interswitchng.com/api/v2/finch-catalog-service/quickteller';
  DOCUMENT_BASE_URL =
    'https://mufasa.interswitchng.com/p/inclusio/finch-onboarding-service';
  WEBVIEW_FACIAL_VERIFICATION_BASE_URL =
    'https://paypoint.quickteller.com/agent/face-verification-mobile';

  FIP_WEBVIEW_FACIAL_VERIFICATION_BASE_URL =
    'https://paypoint.quickteller.com/agent/face-verification-fmpa';
  CAC_API_BASE_URL = 'https://cac-registration-service-prod.k2.isw.la/cac';

  QUICKTELLER_CHANNEL = '7';
  QUICKTELLER_API_TERMINAL_ID = '9FIS0001';
  IS_ANALYTICS_ENABLED = false;
  ENVIRONMENT = 'production';
  ENVIRONMENT_IS_TEST = false;
  ENVIRONMENT_IS_PRODUCTION = true;
}

export const CLIENT_BASIC_AUTH_CREDENTIALS =
  Config.CLIENT_BASIC_AUTH_CREDENTIALS;

export const CACHE_LIFESPAN_IN_MILLISECONDS = 60 * 60 * 24 * 1000;

export const FORCE_LOGOUT_ON_401_RESPONSE = true; // ENVIRONMENT_IS_PRODUCTION;

export const MAKE_CALL_TO_AGENTS_ME = false;

export const VERBOSE_ERRORS = false; // ENVIRONMENT_IS_TEST;

export const DEFAULT_ERROR_MESSAGE = 'An error occured. Please, try again.';

export const INTERNET_CONNECTION_NO = 'You are currently offline.';
export const INTERNET_CONNECTION_POOR =
  'Your internet connection is poor. So, your experience on Quickteller Paypoint might be limited.';
export const INTERNET_CONNECTION_ERROR =
  'Something went wrong, please check your internet connection and try again.';

export const OTP_SENDER = 'QuickTeller';

export const USE_APP_SESSION_TIMER = false;

export const FORCE_ACCOUNT_VALIDATION_ON_TRANSFER_TO_ACCOUNT = false;

export const APP_VERSION = DeviceInfo.getVersion();

export const LINK_TO_FAQ = `${CDN_BASE_URL}/p/finch-agent-dashboard/documents/Updated FAQs.pdf`;

export const DEFAULT_MESSAGE_FOR_PENDING_TRANSACTIONS =
  'The transaction is being processed. Check your transaction reports for the latest status.';

export const QUICK_ACTION_ITEMS_DELIMITER = '////';

export const LOGIN_REQUIRED_MESSAGE = 'You will need to login first.';

export const CONTACT_US_EMAIL = 'ifiscustomercare@interswitchgroup.com';
export const CONTACT_US_WEBPAGE = 'https://help.interswitchgroup.com/';
export const CONTACT_US_PHONE = '07009065000';

export const DEFAULT_REMOTE_CONFIG_VALUES = {
  account_opening_pilot_group: [],
  app_release_lifespan: 3,
  blacklisted_biller_categories: [],
  blacklisted_biller_ids: [],
  blacklisted_biller_names: [],
  broadcast_message: null,
  contact_us_email_address: CONTACT_US_EMAIL,
  contact_us_phone_number: CONTACT_US_PHONE,
  contact_us_webpage: CONTACT_US_WEBPAGE,
  devices_with_printers: ['TPS900'],
  enable_account_opening: true,
  enable_agent: true,
  enable_app: true,
  enable_card_linking: true,
  enable_cash_in: true,
  enable_commission_unload: true,
  enable_fip: true,
  enable_login: true, // unused
  enable_onboarding: true,
  enable_pay_bills: true,
  enable_reports: true,
  enable_sell_airtime: true,
  enable_sell_data: true,
  enable_sell_epin: true,
  enable_send_money: true,
  enable_services: true,
  enable_signup: true,
  enable_quickteller_funding: true,
  enable_webpay_funding: true,
  fund_wallet_url: FUND_WALLET_URL,
  internal_agents: [],
  latest_app_url: null,
  latest_app_version: null,
  force_send_sell_data_as_bill_payment: false,
  on_submit_editing_delay_milliseconds: 100,
  print_restriction_password: ['445544321'],
  print_restriction_biller: ['BENUE STATE IRS', 'Benue MDA Revenue'],
  should_force_app_updates: true,
  show_status_animation_before_transaction_receipt: true,
  show_app_update_banner: false,
  show_rate_this_app_menu: false,
  sub_header_message: null,
  read_from_cache: true,
  verbose_errors: VERBOSE_ERRORS,
  enable_pos_request: true,
};

export const REMOTE_CONFIG_KEYS = Object.keys(DEFAULT_REMOTE_CONFIG_VALUES);
export const REMOTE_CONFIG_REFRESH_INTERVAL_IN_SECONDS = 45;

export const DISABLE_PROFILE_FIELDS = true;

export const PRINTER_DRIVER_PACKAGE_NAME = 'ru.a402d.rawbtprinter';

export const APP_LOGO_ASSET_PATH = 'images/paypoint.png';

export const USE_MOCK_FOR_CASH_IN = true;
export const USE_MOCK_FOR_WITHDRAW = true;

export const WITHDRAW_PAYMENT_ITEM_CODE = 'IFIS05';
export const USSD_FUNDING_PAYMENT_ITEM_CODE = 'FUND_VIA_USSD';
